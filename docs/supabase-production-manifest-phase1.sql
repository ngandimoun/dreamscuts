-- 🎬 Production Planner Phase 1 - Production Manifest Table
-- 
-- This creates the dreamcut_production_manifest table for storing validated manifests
-- that are ready for worker consumption.

-- Create the production manifest table
CREATE TABLE IF NOT EXISTS dreamcut_production_manifest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Source References (links to previous pipeline stages)
  analyzer_ref TEXT,
  refiner_ref TEXT,
  script_ref TEXT,
  
  -- Manifest Data (the complete validated manifest)
  manifest_json JSONB NOT NULL,
  
  -- Status and Processing
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'ready_to_dispatch', 'rendering', 'done', 'failed')),
  priority INTEGER DEFAULT 0,
  
  -- Validation Results
  validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('pending', 'valid', 'invalid', 'warning')),
  validation_errors JSONB DEFAULT '[]',
  business_check_errors JSONB DEFAULT '[]',
  
  -- Quality Metrics
  quality_score DECIMAL(3,2) CHECK (quality_score >= 0 AND quality_score <= 1),
  duration_seconds INTEGER,
  aspect_ratio TEXT,
  platform TEXT,
  language TEXT,
  
  -- Processing Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  validated_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Error Handling
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_dreamcut_production_manifest_user_id ON dreamcut_production_manifest(user_id);
CREATE INDEX IF NOT EXISTS idx_dreamcut_production_manifest_status ON dreamcut_production_manifest(status);
CREATE INDEX IF NOT EXISTS idx_dreamcut_production_manifest_priority ON dreamcut_production_manifest(priority DESC);
CREATE INDEX IF NOT EXISTS idx_dreamcut_production_manifest_created_at ON dreamcut_production_manifest(created_at);
CREATE INDEX IF NOT EXISTS idx_dreamcut_production_manifest_analyzer_ref ON dreamcut_production_manifest(analyzer_ref);
CREATE INDEX IF NOT EXISTS idx_dreamcut_production_manifest_refiner_ref ON dreamcut_production_manifest(refiner_ref);
CREATE INDEX IF NOT EXISTS idx_dreamcut_production_manifest_script_ref ON dreamcut_production_manifest(script_ref);

-- Create GIN index for JSONB manifest_json queries
CREATE INDEX IF NOT EXISTS idx_dreamcut_production_manifest_json_gin ON dreamcut_production_manifest USING GIN (manifest_json);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_dreamcut_production_manifest_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_dreamcut_production_manifest_updated_at
  BEFORE UPDATE ON dreamcut_production_manifest
  FOR EACH ROW
  EXECUTE FUNCTION update_dreamcut_production_manifest_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE dreamcut_production_manifest ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow users to view their own production manifests
CREATE POLICY "Users can view their own production manifests" ON dreamcut_production_manifest
  FOR SELECT USING (user_id = auth.uid());

-- Allow users to create their own production manifests
CREATE POLICY "Users can create their own production manifests" ON dreamcut_production_manifest
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Allow users to update their own production manifests
CREATE POLICY "Users can update their own production manifests" ON dreamcut_production_manifest
  FOR UPDATE USING (user_id = auth.uid());

-- Allow service role to do everything (for workers and API operations)
CREATE POLICY "Service role full access to production manifests" ON dreamcut_production_manifest
  FOR ALL USING (auth.role() = 'service_role');

-- Create a view for easy querying of production manifests with user info
CREATE OR REPLACE VIEW dreamcut_production_manifest_with_user AS
SELECT 
  pm.id,
  pm.user_id,
  pm.analyzer_ref,
  pm.refiner_ref,
  pm.script_ref,
  pm.manifest_json,
  pm.status,
  pm.priority,
  pm.validation_status,
  pm.validation_errors,
  pm.business_check_errors,
  pm.quality_score,
  pm.duration_seconds,
  pm.aspect_ratio,
  pm.platform,
  pm.language,
  pm.created_at,
  pm.updated_at,
  pm.validated_at,
  pm.started_at,
  pm.completed_at,
  pm.error_message,
  pm.retry_count,
  pm.max_retries,
  -- Extract metadata from manifest_json
  pm.manifest_json->'metadata'->>'intent' as intent,
  pm.manifest_json->'metadata'->>'profile' as profile,
  pm.manifest_json->'metadata'->>'voiceGender' as voice_gender,
  pm.manifest_json->'metadata'->>'cinematicLevel' as cinematic_level,
  -- Count scenes and assets
  jsonb_array_length(pm.manifest_json->'scenes') as scene_count,
  jsonb_object_keys(pm.manifest_json->'assets') as asset_count,
  jsonb_array_length(pm.manifest_json->'jobs') as job_count
FROM dreamcut_production_manifest pm;

-- Create a view for production manifest status summary
CREATE OR REPLACE VIEW dreamcut_production_manifest_status AS
SELECT 
  status,
  validation_status,
  COUNT(*) as count,
  AVG(quality_score) as avg_quality_score,
  AVG(duration_seconds) as avg_duration_seconds,
  MIN(created_at) as earliest_created,
  MAX(created_at) as latest_created
FROM dreamcut_production_manifest
GROUP BY status, validation_status
ORDER BY status, validation_status;

-- Create a function to get production manifest by user with filtering
CREATE OR REPLACE FUNCTION get_user_production_manifests(
  user_uuid UUID,
  status_filter TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  status TEXT,
  priority INTEGER,
  validation_status TEXT,
  quality_score DECIMAL,
  duration_seconds INTEGER,
  aspect_ratio TEXT,
  platform TEXT,
  language TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  scene_count INTEGER,
  asset_count INTEGER,
  job_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pm.id,
    pm.status,
    pm.priority,
    pm.validation_status,
    pm.quality_score,
    pm.duration_seconds,
    pm.aspect_ratio,
    pm.platform,
    pm.language,
    pm.created_at,
    pm.updated_at,
    jsonb_array_length(pm.manifest_json->'scenes')::INTEGER as scene_count,
    (SELECT COUNT(*) FROM jsonb_object_keys(pm.manifest_json->'assets'))::INTEGER as asset_count,
    jsonb_array_length(pm.manifest_json->'jobs')::INTEGER as job_count
  FROM dreamcut_production_manifest pm
  WHERE pm.user_id = user_uuid
    AND (status_filter IS NULL OR pm.status = status_filter)
  ORDER BY pm.priority DESC, pm.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get production manifest statistics
CREATE OR REPLACE FUNCTION get_production_manifest_stats()
RETURNS TABLE (
  total_manifests BIGINT,
  planning_count BIGINT,
  ready_to_dispatch_count BIGINT,
  rendering_count BIGINT,
  done_count BIGINT,
  failed_count BIGINT,
  avg_quality_score NUMERIC,
  avg_duration_seconds NUMERIC,
  platform_distribution JSONB,
  aspect_ratio_distribution JSONB,
  language_distribution JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_manifests,
    COUNT(*) FILTER (WHERE status = 'planning') as planning_count,
    COUNT(*) FILTER (WHERE status = 'ready_to_dispatch') as ready_to_dispatch_count,
    COUNT(*) FILTER (WHERE status = 'rendering') as rendering_count,
    COUNT(*) FILTER (WHERE status = 'done') as done_count,
    COUNT(*) FILTER (WHERE status = 'failed') as failed_count,
    AVG(quality_score) as avg_quality_score,
    AVG(duration_seconds) as avg_duration_seconds,
    jsonb_object_agg(platform, platform_count) as platform_distribution,
    jsonb_object_agg(aspect_ratio, aspect_ratio_count) as aspect_ratio_distribution,
    jsonb_object_agg(language, language_count) as language_distribution
  FROM (
    SELECT 
      platform,
      COUNT(*) as platform_count,
      aspect_ratio,
      COUNT(*) as aspect_ratio_count,
      language,
      COUNT(*) as language_count
    FROM dreamcut_production_manifest
    GROUP BY platform, aspect_ratio, language
  ) stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT ALL ON dreamcut_production_manifest TO service_role;
GRANT SELECT ON dreamcut_production_manifest TO authenticated;
GRANT SELECT ON dreamcut_production_manifest_with_user TO authenticated;
GRANT SELECT ON dreamcut_production_manifest_status TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_production_manifests(UUID, TEXT, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_production_manifest_stats() TO authenticated;

-- Comments for documentation
COMMENT ON TABLE dreamcut_production_manifest IS 'Stores validated production manifests ready for worker consumption';
COMMENT ON COLUMN dreamcut_production_manifest.manifest_json IS 'Complete validated production manifest structure';
COMMENT ON COLUMN dreamcut_production_manifest.status IS 'Current processing status of the manifest';
COMMENT ON COLUMN dreamcut_production_manifest.validation_status IS 'JSON schema validation status';
COMMENT ON COLUMN dreamcut_production_manifest.business_check_errors IS 'Business rule validation errors';
