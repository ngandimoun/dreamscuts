-- 🎬 Dreamcut Production Tables - Phase 4
-- 
-- This schema creates the tables that match the Phase 4 API expectations
-- for storing production manifests and jobs.

-- ========================================
-- 1. DREAMCUT_PRODUCTION_MANIFEST TABLE
-- ========================================
-- Stores the complete production manifest from Phase 4

CREATE TABLE IF NOT EXISTS dreamcut_production_manifest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Manifest Content (the actual production plan)
  manifest_json JSONB NOT NULL, -- Complete production manifest structure
  
  -- Status and Processing
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'ready_to_dispatch', 'rendering', 'done', 'failed')),
  
  -- Validation Results
  validation_errors JSONB DEFAULT NULL, -- Validation errors and warnings
  business_check_errors JSONB DEFAULT NULL, -- Business rule violations
  
  -- Processing Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Performance Tracking
  processing_time_ms INTEGER,
  
  -- Error Handling
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3
);

-- ========================================
-- 2. DREAMCUT_JOBS TABLE
-- ========================================
-- Stores individual jobs for production execution

CREATE TABLE IF NOT EXISTS dreamcut_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manifest_id UUID REFERENCES dreamcut_production_manifest(id) ON DELETE CASCADE,
  
  -- Job Identification
  job_id TEXT NOT NULL, -- Original job ID from manifest
  type TEXT NOT NULL, -- Job type (tts, generate_image, render_shotstack, etc.)
  
  -- Job Status and Priority
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  priority INTEGER DEFAULT 10, -- Higher numbers = higher priority
  
  -- Job Configuration
  payload JSONB NOT NULL, -- Job-specific configuration and parameters
  depends_on TEXT[] DEFAULT '{}', -- Array of job IDs this job depends on
  
  -- Retry Policy
  retry_policy JSONB DEFAULT '{}', -- Retry configuration
  max_attempts INTEGER DEFAULT 3,
  current_attempt INTEGER DEFAULT 0,
  
  -- Processing Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Results
  result JSONB DEFAULT NULL, -- Job execution results
  error_message TEXT,
  
  -- Performance Tracking
  processing_time_ms INTEGER,
  
  UNIQUE(manifest_id, job_id)
);

-- ========================================
-- 3. INDEXES FOR PERFORMANCE
-- ========================================

-- Production Manifest indexes
CREATE INDEX IF NOT EXISTS idx_dreamcut_production_manifest_user_id ON dreamcut_production_manifest(user_id);
CREATE INDEX IF NOT EXISTS idx_dreamcut_production_manifest_status ON dreamcut_production_manifest(status);
CREATE INDEX IF NOT EXISTS idx_dreamcut_production_manifest_created_at ON dreamcut_production_manifest(created_at);
CREATE INDEX IF NOT EXISTS idx_dreamcut_production_manifest_manifest_json_gin ON dreamcut_production_manifest USING GIN (manifest_json);

-- Jobs indexes
CREATE INDEX IF NOT EXISTS idx_dreamcut_jobs_manifest_id ON dreamcut_jobs(manifest_id);
CREATE INDEX IF NOT EXISTS idx_dreamcut_jobs_job_id ON dreamcut_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_dreamcut_jobs_type ON dreamcut_jobs(type);
CREATE INDEX IF NOT EXISTS idx_dreamcut_jobs_status ON dreamcut_jobs(status);
CREATE INDEX IF NOT EXISTS idx_dreamcut_jobs_priority ON dreamcut_jobs(priority DESC);
CREATE INDEX IF NOT EXISTS idx_dreamcut_jobs_depends_on_gin ON dreamcut_jobs USING GIN (depends_on);

-- ========================================
-- 4. TRIGGERS FOR AUTOMATIC UPDATES
-- ========================================

-- Update timestamp trigger for production_manifest
CREATE OR REPLACE FUNCTION update_dreamcut_production_manifest_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_dreamcut_production_manifest_updated_at
  BEFORE UPDATE ON dreamcut_production_manifest
  FOR EACH ROW
  EXECUTE FUNCTION update_dreamcut_production_manifest_updated_at();

-- Update timestamp trigger for jobs
CREATE OR REPLACE FUNCTION update_dreamcut_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_dreamcut_jobs_updated_at
  BEFORE UPDATE ON dreamcut_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_dreamcut_jobs_updated_at();

-- ========================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE dreamcut_production_manifest ENABLE ROW LEVEL SECURITY;
ALTER TABLE dreamcut_jobs ENABLE ROW LEVEL SECURITY;

-- Production Manifest policies
CREATE POLICY "Users can view their own production manifests" ON dreamcut_production_manifest
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own production manifests" ON dreamcut_production_manifest
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own production manifests" ON dreamcut_production_manifest
  FOR UPDATE USING (user_id = auth.uid());

-- Jobs policies
CREATE POLICY "Users can view jobs for their manifests" ON dreamcut_jobs
  FOR SELECT USING (
    manifest_id IN (
      SELECT id FROM dreamcut_production_manifest WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create jobs for their manifests" ON dreamcut_jobs
  FOR INSERT WITH CHECK (
    manifest_id IN (
      SELECT id FROM dreamcut_production_manifest WHERE user_id = auth.uid()
    )
  );

-- Service role policies (for workers and API operations)
CREATE POLICY "Service role full access to dreamcut_production_manifest" ON dreamcut_production_manifest
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to dreamcut_jobs" ON dreamcut_jobs
  FOR ALL USING (auth.role() = 'service_role');

-- ========================================
-- 6. USEFUL VIEWS
-- ========================================

-- View for production manifest with job summary
CREATE OR REPLACE VIEW dreamcut_production_summary AS
SELECT 
  pm.id,
  pm.user_id,
  pm.status,
  pm.created_at,
  pm.updated_at,
  pm.started_at,
  pm.completed_at,
  pm.processing_time_ms,
  -- Job counts
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
FROM dreamcut_production_manifest pm
LEFT JOIN dreamcut_jobs j ON j.manifest_id = pm.id
GROUP BY pm.id, pm.user_id, pm.status, pm.created_at, pm.updated_at, pm.started_at, pm.completed_at, pm.processing_time_ms;

-- ========================================
-- 7. GRANT PERMISSIONS
-- ========================================

-- Grant permissions to authenticated users
GRANT SELECT ON dreamcut_production_manifest TO authenticated;
GRANT SELECT ON dreamcut_jobs TO authenticated;
GRANT SELECT ON dreamcut_production_summary TO authenticated;

-- Grant permissions to service role
GRANT ALL ON dreamcut_production_manifest TO service_role;
GRANT ALL ON dreamcut_jobs TO service_role;
GRANT ALL ON dreamcut_production_summary TO service_role;

-- ========================================
-- 8. COMMENTS FOR DOCUMENTATION
-- ========================================

COMMENT ON TABLE dreamcut_production_manifest IS 'Stores production manifests from Phase 4 pipeline';
COMMENT ON TABLE dreamcut_jobs IS 'Stores individual jobs for production execution';

COMMENT ON COLUMN dreamcut_production_manifest.manifest_json IS 'Complete production manifest structure with scenes, assets, jobs, etc.';
COMMENT ON COLUMN dreamcut_production_manifest.validation_errors IS 'JSON schema validation errors and warnings';
COMMENT ON COLUMN dreamcut_jobs.payload IS 'Job-specific configuration and parameters';
COMMENT ON COLUMN dreamcut_jobs.depends_on IS 'Array of job IDs this job depends on';
