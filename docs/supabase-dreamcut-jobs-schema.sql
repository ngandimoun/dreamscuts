-- DreamCut Jobs Table Schema
-- Phase 4: Job Queue for Production Pipeline

-- Create the dreamcut_jobs table
CREATE TABLE IF NOT EXISTS dreamcut_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manifest_id UUID REFERENCES dreamcut_production_manifest(id) ON DELETE CASCADE,
  job_id TEXT NOT NULL, -- The job ID from the manifest (e.g., "job_tts_s1")
  type TEXT NOT NULL CHECK (type IN (
    'tts', 'generate_image', 'generate_video', 'generate_music', 
    'generate_chart', 'enhance_image', 'lip_sync', 'render_shotstack',
    'video_assembly', 'effect_application', 'subtitle_generation'
  )),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'processing', 'completed', 'failed', 'cancelled'
  )),
  priority INTEGER NOT NULL DEFAULT 5 CHECK (priority >= 0 AND priority <= 20),
  payload JSONB NOT NULL DEFAULT '{}',
  depends_on TEXT[] DEFAULT '{}', -- Array of job IDs this job depends on
  retry_policy JSONB DEFAULT '{"maxRetries": 3, "backoffSeconds": 30}',
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  error_message TEXT,
  result JSONB, -- Job result data
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_dreamcut_jobs_manifest_id ON dreamcut_jobs(manifest_id);
CREATE INDEX IF NOT EXISTS idx_dreamcut_jobs_status ON dreamcut_jobs(status);
CREATE INDEX IF NOT EXISTS idx_dreamcut_jobs_priority ON dreamcut_jobs(priority DESC);
CREATE INDEX IF NOT EXISTS idx_dreamcut_jobs_type ON dreamcut_jobs(type);
CREATE INDEX IF NOT EXISTS idx_dreamcut_jobs_created_at ON dreamcut_jobs(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_dreamcut_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_dreamcut_jobs_updated_at
  BEFORE UPDATE ON dreamcut_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_dreamcut_jobs_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE dreamcut_jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow users to read jobs for their own manifests
CREATE POLICY "Users can read jobs for their own manifests" ON dreamcut_jobs
  FOR SELECT USING (
    manifest_id IN (
      SELECT id FROM dreamcut_production_manifest WHERE user_id = auth.uid()
    )
  );

-- Allow service role to manage all jobs (for workers and API operations)
CREATE POLICY "Service role full access on dreamcut jobs" ON dreamcut_jobs
  FOR ALL USING (auth.role() = 'service_role');

-- Grant permissions on the table
GRANT ALL ON dreamcut_jobs TO service_role;
GRANT SELECT ON dreamcut_jobs TO authenticated;

-- Create a function to claim a job for processing
CREATE OR REPLACE FUNCTION claim_job_for_processing(worker_id TEXT)
RETURNS TABLE (
  id UUID,
  job_id TEXT,
  type TEXT,
  payload JSONB,
  manifest_id UUID
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  job_record RECORD;
BEGIN
  -- Find a pending job with no unmet dependencies
  SELECT dj.* INTO job_record
  FROM dreamcut_jobs dj
  WHERE dj.status = 'pending'
    AND dj.attempts < dj.max_attempts
    AND NOT EXISTS (
      -- Check if any dependencies are not completed
      SELECT 1 FROM dreamcut_jobs dep
      WHERE dep.job_id = ANY(dj.depends_on)
        AND dep.status != 'completed'
    )
  ORDER BY dj.priority DESC, dj.created_at ASC
  LIMIT 1;
  
  -- If no job found, return empty
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  -- Update job status to processing
  UPDATE dreamcut_jobs 
  SET 
    status = 'processing',
    started_at = NOW(),
    updated_at = NOW()
  WHERE dreamcut_jobs.id = job_record.id;
  
  -- Return the job details
  RETURN QUERY
  SELECT 
    job_record.id,
    job_record.job_id,
    job_record.type,
    job_record.payload,
    job_record.manifest_id;
END;
$$;

-- Create a function to complete a job
CREATE OR REPLACE FUNCTION complete_job(
  job_uuid UUID,
  result_data JSONB DEFAULT NULL,
  error_msg TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  -- Update job status
  UPDATE dreamcut_jobs 
  SET 
    status = CASE 
      WHEN error_msg IS NOT NULL THEN 'failed'
      ELSE 'completed'
    END,
    result = result_data,
    error_message = error_msg,
    completed_at = NOW(),
    updated_at = NOW()
  WHERE id = job_uuid;
  
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  
  IF affected_rows = 0 THEN
    RAISE EXCEPTION 'Job % not found', job_uuid;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Create a function to fail a job (for retry logic)
CREATE OR REPLACE FUNCTION fail_job_for_retry(
  job_uuid UUID,
  error_msg TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  job_record RECORD;
BEGIN
  -- Get current job details
  SELECT * INTO job_record FROM dreamcut_jobs WHERE id = job_uuid;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Job % not found', job_uuid;
  END IF;
  
  -- Check if we can retry
  IF job_record.attempts >= job_record.max_attempts THEN
    -- Max retries reached, mark as failed
    UPDATE dreamcut_jobs 
    SET 
      status = 'failed',
      error_message = error_msg,
      completed_at = NOW(),
      updated_at = NOW()
    WHERE id = job_uuid;
  ELSE
    -- Increment attempts and reset to pending for retry
    UPDATE dreamcut_jobs 
    SET 
      status = 'pending',
      attempts = attempts + 1,
      error_message = error_msg,
      started_at = NULL,
      updated_at = NOW()
    WHERE id = job_uuid;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION claim_job_for_processing(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION complete_job(UUID, JSONB, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION fail_job_for_retry(UUID, TEXT) TO service_role;

-- Create a view for job statistics
CREATE OR REPLACE VIEW dreamcut_job_stats AS
SELECT 
  manifest_id,
  COUNT(*) as total_jobs,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_jobs,
  COUNT(*) FILTER (WHERE status = 'processing') as processing_jobs,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_jobs,
  COUNT(*) FILTER (WHERE status = 'failed') as failed_jobs,
  AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) as avg_processing_time_seconds,
  MAX(completed_at) as last_completed_at
FROM dreamcut_jobs
GROUP BY manifest_id;

-- Grant permissions on the view
GRANT SELECT ON dreamcut_job_stats TO service_role;
GRANT SELECT ON dreamcut_job_stats TO authenticated;
