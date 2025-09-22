-- 🎬 Production Planner Phase 0 - Supabase Schema
-- 
-- This schema creates the foundation tables for the Production Planner system
-- that bridges creative planning (Analyzer → Refiner → Script Enhancer) 
-- with technical production execution.

-- ========================================
-- 1. PRODUCTION_MANIFEST TABLE
-- ========================================
-- Stores the complete production plan that coordinates all downstream services

CREATE TABLE IF NOT EXISTS production_manifest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Source References (links to previous pipeline stages)
  analyzer_id TEXT, -- Links to analyzer result
  refiner_id TEXT, -- Links to dreamcut_refiner table
  script_enhancer_id TEXT, -- Links to script_enhancer_results table
  
  -- Manifest Metadata
  manifest_version TEXT DEFAULT '1.0.0',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'validated', 'approved', 'in_production', 'completed', 'failed')),
  priority INTEGER DEFAULT 0, -- Higher numbers = higher priority
  
  -- Production Configuration
  duration_seconds INTEGER NOT NULL,
  aspect_ratio TEXT NOT NULL,
  platform TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  orientation TEXT CHECK (orientation IN ('landscape', 'portrait', 'square')),
  
  -- Manifest Content (the actual production plan)
  manifest_data JSONB NOT NULL, -- Complete production manifest structure
  
  -- Quality & Validation
  validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('pending', 'valid', 'invalid', 'warning')),
  validation_errors JSONB DEFAULT '[]',
  quality_score DECIMAL(3,2) CHECK (quality_score >= 0 AND quality_score <= 1),
  
  -- Processing Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  validated_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Performance Tracking
  processing_time_ms INTEGER,
  estimated_completion_time TIMESTAMP WITH TIME ZONE,
  
  -- Error Handling
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3
);

-- ========================================
-- 2. PRODUCTION_JOBS TABLE (Extended)
-- ========================================
-- Extends the existing jobs table with production-specific job types

-- Add production-specific job types to existing jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS production_manifest_id UUID REFERENCES production_manifest(id) ON DELETE CASCADE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS job_config JSONB DEFAULT '{}'; -- Job-specific configuration
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS dependencies JSONB DEFAULT '[]'; -- Array of job IDs this job depends on
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS estimated_duration_seconds INTEGER; -- Estimated job duration
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS resource_requirements JSONB DEFAULT '{}'; -- CPU, memory, API limits, etc.

-- Update job types to include production-specific types
-- Note: This requires dropping and recreating the check constraint
ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_type_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_type_check CHECK (
  type IN (
    'analysis', 'asset_prep', 'storyboard', 'render', 'video_generation', 'image_processing', 'text_analysis',
    -- Production Planner specific job types
    'voiceover_generation', 'music_generation', 'sound_effects', 'image_generation', 'video_generation_ai',
    'chart_generation', 'subtitle_generation', 'lipsync_processing', 'visual_effects', 'asset_enhancement',
    'consistency_check', 'quality_validation', 'final_assembly', 'rendering'
  )
);

-- ========================================
-- 3. PRODUCTION_ASSETS TABLE
-- ========================================
-- Tracks all assets (user-provided and AI-generated) for a production

CREATE TABLE IF NOT EXISTS production_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_manifest_id UUID REFERENCES production_manifest(id) ON DELETE CASCADE,
  
  -- Asset Identification
  asset_id TEXT NOT NULL, -- Original asset ID from analyzer/refiner
  asset_type TEXT NOT NULL CHECK (asset_type IN ('image', 'video', 'audio', 'text', 'chart', 'effect')),
  source TEXT NOT NULL CHECK (source IN ('user_upload', 'ai_generated', 'stock', 'enhanced')),
  
  -- Asset Metadata
  original_url TEXT,
  processed_url TEXT,
  file_size_bytes BIGINT,
  duration_seconds DECIMAL(10,3), -- For video/audio assets
  dimensions JSONB, -- {width, height} for images/videos
  format TEXT, -- jpg, png, mp4, wav, etc.
  
  -- Asset Processing Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready', 'failed', 'skipped')),
  processing_job_id UUID REFERENCES jobs(id),
  
  -- Asset Usage in Production
  scene_assignments JSONB DEFAULT '[]', -- Which scenes use this asset
  usage_type TEXT, -- 'primary', 'background', 'overlay', 'transition', etc.
  timing_info JSONB, -- Start/end times, duration, etc.
  
  -- Quality & Enhancement
  quality_score DECIMAL(3,2),
  enhancement_applied BOOLEAN DEFAULT false,
  enhancement_details JSONB DEFAULT '{}',
  
  -- Consistency Tracking
  consistency_group TEXT, -- Groups related assets (e.g., same character, same style)
  consistency_checks JSONB DEFAULT '[]',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 4. PRODUCTION_SCENES TABLE
-- ========================================
-- Detailed scene breakdown for production execution

CREATE TABLE IF NOT EXISTS production_scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_manifest_id UUID REFERENCES production_manifest(id) ON DELETE CASCADE,
  
  -- Scene Identification
  scene_id TEXT NOT NULL, -- Original scene ID from script enhancer
  scene_order INTEGER NOT NULL, -- Order in the final video
  scene_name TEXT,
  
  -- Scene Timing
  start_time_seconds DECIMAL(10,3) NOT NULL,
  duration_seconds DECIMAL(10,3) NOT NULL,
  end_time_seconds DECIMAL(10,3) GENERATED ALWAYS AS (start_time_seconds + duration_seconds) STORED,
  
  -- Scene Content
  narration_text TEXT,
  visual_description TEXT,
  music_cue TEXT,
  sound_effects TEXT[],
  visual_effects JSONB DEFAULT '[]',
  
  -- Scene Assets
  primary_assets JSONB DEFAULT '[]', -- Asset IDs used in this scene
  background_assets JSONB DEFAULT '[]',
  overlay_assets JSONB DEFAULT '[]',
  
  -- Scene Processing
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready', 'failed')),
  processing_jobs JSONB DEFAULT '[]', -- Job IDs for this scene
  
  -- Scene Quality
  quality_score DECIMAL(3,2),
  consistency_score DECIMAL(3,2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(production_manifest_id, scene_id)
);

-- ========================================
-- 5. INDEXES FOR PERFORMANCE
-- ========================================

-- Production Manifest indexes
CREATE INDEX IF NOT EXISTS idx_production_manifest_user_id ON production_manifest(user_id);
CREATE INDEX IF NOT EXISTS idx_production_manifest_status ON production_manifest(status);
CREATE INDEX IF NOT EXISTS idx_production_manifest_priority ON production_manifest(priority DESC);
CREATE INDEX IF NOT EXISTS idx_production_manifest_created_at ON production_manifest(created_at);
CREATE INDEX IF NOT EXISTS idx_production_manifest_refiner_id ON production_manifest(refiner_id);
CREATE INDEX IF NOT EXISTS idx_production_manifest_script_enhancer_id ON production_manifest(script_enhancer_id);
CREATE INDEX IF NOT EXISTS idx_production_manifest_manifest_data_gin ON production_manifest USING GIN (manifest_data);

-- Production Assets indexes
CREATE INDEX IF NOT EXISTS idx_production_assets_manifest_id ON production_assets(production_manifest_id);
CREATE INDEX IF NOT EXISTS idx_production_assets_asset_id ON production_assets(asset_id);
CREATE INDEX IF NOT EXISTS idx_production_assets_type ON production_assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_production_assets_source ON production_assets(source);
CREATE INDEX IF NOT EXISTS idx_production_assets_status ON production_assets(status);
CREATE INDEX IF NOT EXISTS idx_production_assets_consistency_group ON production_assets(consistency_group);

-- Production Scenes indexes
CREATE INDEX IF NOT EXISTS idx_production_scenes_manifest_id ON production_scenes(production_manifest_id);
CREATE INDEX IF NOT EXISTS idx_production_scenes_scene_id ON production_scenes(scene_id);
CREATE INDEX IF NOT EXISTS idx_production_scenes_order ON production_scenes(production_manifest_id, scene_order);
CREATE INDEX IF NOT EXISTS idx_production_scenes_status ON production_scenes(status);

-- Jobs table additional indexes
CREATE INDEX IF NOT EXISTS idx_jobs_production_manifest_id ON jobs(production_manifest_id);
CREATE INDEX IF NOT EXISTS idx_jobs_dependencies_gin ON jobs USING GIN (dependencies);

-- ========================================
-- 6. TRIGGERS FOR AUTOMATIC UPDATES
-- ========================================

-- Update timestamp trigger for production_manifest
CREATE OR REPLACE FUNCTION update_production_manifest_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_production_manifest_updated_at
  BEFORE UPDATE ON production_manifest
  FOR EACH ROW
  EXECUTE FUNCTION update_production_manifest_updated_at();

-- Update timestamp trigger for production_assets
CREATE OR REPLACE FUNCTION update_production_assets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_production_assets_updated_at
  BEFORE UPDATE ON production_assets
  FOR EACH ROW
  EXECUTE FUNCTION update_production_assets_updated_at();

-- Update timestamp trigger for production_scenes
CREATE OR REPLACE FUNCTION update_production_scenes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_production_scenes_updated_at
  BEFORE UPDATE ON production_scenes
  FOR EACH ROW
  EXECUTE FUNCTION update_production_scenes_updated_at();

-- ========================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE production_manifest ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_scenes ENABLE ROW LEVEL SECURITY;

-- Production Manifest policies
CREATE POLICY "Users can view their own production manifests" ON production_manifest
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own production manifests" ON production_manifest
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own production manifests" ON production_manifest
  FOR UPDATE USING (user_id = auth.uid());

-- Production Assets policies
CREATE POLICY "Users can view assets for their manifests" ON production_assets
  FOR SELECT USING (
    production_manifest_id IN (
      SELECT id FROM production_manifest WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create assets for their manifests" ON production_assets
  FOR INSERT WITH CHECK (
    production_manifest_id IN (
      SELECT id FROM production_manifest WHERE user_id = auth.uid()
    )
  );

-- Production Scenes policies
CREATE POLICY "Users can view scenes for their manifests" ON production_scenes
  FOR SELECT USING (
    production_manifest_id IN (
      SELECT id FROM production_manifest WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create scenes for their manifests" ON production_scenes
  FOR INSERT WITH CHECK (
    production_manifest_id IN (
      SELECT id FROM production_manifest WHERE user_id = auth.uid()
    )
  );

-- Service role policies (for workers and API operations)
CREATE POLICY "Service role full access to production_manifest" ON production_manifest
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to production_assets" ON production_assets
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to production_scenes" ON production_scenes
  FOR ALL USING (auth.role() = 'service_role');

-- ========================================
-- 8. USEFUL VIEWS
-- ========================================

-- View for production manifest with related data
CREATE OR REPLACE VIEW production_manifest_summary AS
SELECT 
  pm.id,
  pm.user_id,
  pm.status,
  pm.priority,
  pm.duration_seconds,
  pm.aspect_ratio,
  pm.platform,
  pm.language,
  pm.quality_score,
  pm.created_at,
  pm.updated_at,
  pm.validated_at,
  pm.approved_at,
  pm.started_at,
  pm.completed_at,
  -- Count related records
  (SELECT COUNT(*) FROM production_assets pa WHERE pa.production_manifest_id = pm.id) as asset_count,
  (SELECT COUNT(*) FROM production_scenes ps WHERE ps.production_manifest_id = pm.id) as scene_count,
  (SELECT COUNT(*) FROM jobs j WHERE j.production_manifest_id = pm.id) as job_count,
  (SELECT COUNT(*) FROM jobs j WHERE j.production_manifest_id = pm.id AND j.status = 'completed') as completed_jobs,
  (SELECT COUNT(*) FROM jobs j WHERE j.production_manifest_id = pm.id AND j.status = 'failed') as failed_jobs
FROM production_manifest pm;

-- View for production progress tracking
CREATE OR REPLACE VIEW production_progress AS
SELECT 
  pm.id as manifest_id,
  pm.status as manifest_status,
  pm.duration_seconds,
  pm.created_at,
  pm.started_at,
  pm.completed_at,
  -- Job progress
  COUNT(j.id) as total_jobs,
  COUNT(j.id) FILTER (WHERE j.status = 'completed') as completed_jobs,
  COUNT(j.id) FILTER (WHERE j.status = 'failed') as failed_jobs,
  COUNT(j.id) FILTER (WHERE j.status = 'processing') as processing_jobs,
  COUNT(j.id) FILTER (WHERE j.status = 'pending') as pending_jobs,
  -- Progress percentage
  CASE 
    WHEN COUNT(j.id) = 0 THEN 0
    ELSE ROUND((COUNT(j.id) FILTER (WHERE j.status = 'completed')::DECIMAL / COUNT(j.id) * 100), 2)
  END as progress_percentage
FROM production_manifest pm
LEFT JOIN jobs j ON j.production_manifest_id = pm.id
GROUP BY pm.id, pm.status, pm.duration_seconds, pm.created_at, pm.started_at, pm.completed_at;

-- ========================================
-- 9. GRANT PERMISSIONS
-- ========================================

-- Grant permissions to authenticated users
GRANT SELECT ON production_manifest TO authenticated;
GRANT SELECT ON production_assets TO authenticated;
GRANT SELECT ON production_scenes TO authenticated;
GRANT SELECT ON production_manifest_summary TO authenticated;
GRANT SELECT ON production_progress TO authenticated;

-- Grant permissions to service role
GRANT ALL ON production_manifest TO service_role;
GRANT ALL ON production_assets TO service_role;
GRANT ALL ON production_scenes TO service_role;
GRANT ALL ON production_manifest_summary TO service_role;
GRANT ALL ON production_progress TO service_role;

-- ========================================
-- 10. COMMENTS FOR DOCUMENTATION
-- ========================================

COMMENT ON TABLE production_manifest IS 'Stores complete production plans that coordinate all downstream services';
COMMENT ON TABLE production_assets IS 'Tracks all assets (user-provided and AI-generated) for a production';
COMMENT ON TABLE production_scenes IS 'Detailed scene breakdown for production execution';

COMMENT ON COLUMN production_manifest.manifest_data IS 'Complete production manifest structure with scenes, assets, jobs, etc.';
COMMENT ON COLUMN production_manifest.validation_status IS 'JSON schema validation status of the manifest';
COMMENT ON COLUMN production_assets.consistency_group IS 'Groups related assets for consistency tracking';
COMMENT ON COLUMN production_scenes.end_time_seconds IS 'Automatically calculated end time based on start + duration';
