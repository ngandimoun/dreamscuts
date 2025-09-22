-- Studio Blueprint Table Schema
-- Phase 3: Human-readable Plan Storage

-- Create the studio_blueprints table
CREATE TABLE IF NOT EXISTS studio_blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Source References
  analyzer_ref TEXT,
  refiner_ref TEXT,
  script_ref TEXT,
  
  -- Blueprint Content
  project_title TEXT NOT NULL,
  overview JSONB NOT NULL, -- ProjectOverview
  scenes JSONB NOT NULL, -- Array of SceneBlueprint
  audio_arc JSONB NOT NULL, -- AudioArc
  consistency_rules JSONB NOT NULL, -- ConsistencyRules
  
  -- Processing Metadata
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'generated', 'reviewed', 'approved', 'rejected')),
  quality_score NUMERIC CHECK (quality_score >= 0 AND quality_score <= 1),
  processing_time_ms INTEGER,
  warnings TEXT[],
  
  -- Human Review
  human_review JSONB, -- HumanReview
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_studio_blueprints_user_id ON studio_blueprints(user_id);
CREATE INDEX IF NOT EXISTS idx_studio_blueprints_status ON studio_blueprints(status);
CREATE INDEX IF NOT EXISTS idx_studio_blueprints_created_at ON studio_blueprints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_studio_blueprints_quality_score ON studio_blueprints(quality_score DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_studio_blueprints_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_studio_blueprints_updated_at
  BEFORE UPDATE ON studio_blueprints
  FOR EACH ROW
  EXECUTE FUNCTION update_studio_blueprints_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE studio_blueprints ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow users to read their own studio blueprints
CREATE POLICY "Users can read their own studio blueprints" ON studio_blueprints
  FOR SELECT USING (user_id = auth.uid());

-- Allow authenticated users to insert their own blueprints
CREATE POLICY "Users can insert their own studio blueprints" ON studio_blueprints
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Allow users to update their own studio blueprints
CREATE POLICY "Users can update their own studio blueprints" ON studio_blueprints
  FOR UPDATE USING (user_id = auth.uid());

-- Allow service role to manage all studio blueprints (for API operations and workers)
CREATE POLICY "Service role full access on studio blueprints" ON studio_blueprints
  FOR ALL USING (auth.role() = 'service_role');

-- Grant permissions on the table
GRANT ALL ON studio_blueprints TO service_role;
GRANT SELECT, INSERT, UPDATE ON studio_blueprints TO authenticated;

-- Create a view for blueprint statistics
CREATE OR REPLACE VIEW studio_blueprint_stats AS
SELECT 
  user_id,
  COUNT(*) as total_blueprints,
  COUNT(*) FILTER (WHERE status = 'generated') as generated_count,
  COUNT(*) FILTER (WHERE status = 'approved') as approved_count,
  COUNT(*) FILTER (WHERE status = 'rejected') as rejected_count,
  AVG(quality_score) as avg_quality_score,
  AVG(processing_time_ms) as avg_processing_time_ms,
  MAX(created_at) as last_created_at
FROM studio_blueprints
GROUP BY user_id;

-- Grant permissions on the view
GRANT SELECT ON studio_blueprint_stats TO authenticated;
GRANT SELECT ON studio_blueprint_stats TO service_role;

-- Create a function to get blueprint by ID with user validation
CREATE OR REPLACE FUNCTION get_studio_blueprint(blueprint_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  project_title TEXT,
  overview JSONB,
  scenes JSONB,
  audio_arc JSONB,
  consistency_rules JSONB,
  status TEXT,
  quality_score NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user has access to this blueprint
  IF NOT EXISTS (
    SELECT 1 FROM studio_blueprints 
    WHERE id = blueprint_id 
    AND (user_id = auth.uid() OR auth.role() = 'service_role')
  ) THEN
    RAISE EXCEPTION 'Access denied to blueprint %', blueprint_id;
  END IF;
  
  RETURN QUERY
  SELECT 
    sb.id,
    sb.user_id,
    sb.project_title,
    sb.overview,
    sb.scenes,
    sb.audio_arc,
    sb.consistency_rules,
    sb.status,
    sb.quality_score,
    sb.created_at,
    sb.updated_at
  FROM studio_blueprints sb
  WHERE sb.id = blueprint_id;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_studio_blueprint(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_studio_blueprint(UUID) TO service_role;

-- Create a function to update blueprint status
CREATE OR REPLACE FUNCTION update_blueprint_status(
  blueprint_id UUID,
  new_status TEXT,
  review_data JSONB DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  -- Validate status
  IF new_status NOT IN ('draft', 'generated', 'reviewed', 'approved', 'rejected') THEN
    RAISE EXCEPTION 'Invalid status: %', new_status;
  END IF;
  
  -- Update the blueprint
  UPDATE studio_blueprints 
  SET 
    status = new_status,
    human_review = CASE 
      WHEN review_data IS NOT NULL THEN review_data
      ELSE human_review
    END,
    reviewed_at = CASE 
      WHEN new_status IN ('reviewed', 'approved', 'rejected') THEN NOW()
      ELSE reviewed_at
    END,
    approved_at = CASE 
      WHEN new_status = 'approved' THEN NOW()
      ELSE approved_at
    END,
    updated_at = NOW()
  WHERE id = blueprint_id 
    AND (user_id = auth.uid() OR auth.role() = 'service_role');
  
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  
  IF affected_rows = 0 THEN
    RAISE EXCEPTION 'Blueprint % not found or access denied', blueprint_id;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION update_blueprint_status(UUID, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION update_blueprint_status(UUID, TEXT, JSONB) TO service_role;
