-- DreamCut Refiner Table Schema
-- Step 2a: Polished JSON Upgrade Storage

-- Create the dreamcut_refiner table
CREATE TABLE IF NOT EXISTS dreamcut_refiner (
  id TEXT PRIMARY KEY,
  analyzer_id TEXT, -- Links to original analyzer result
  payload JSONB NOT NULL, -- The refined JSON output
  model_used TEXT NOT NULL CHECK (model_used IN ('claude-3-haiku', 'gpt-4o-mini')),
  processing_time_ms INTEGER NOT NULL,
  retry_count INTEGER DEFAULT 0,
  template_used TEXT, -- Which prompt template was used (e.g., 'Image Only', 'Mixed Media')
  asset_mix TEXT[], -- Array of asset types (e.g., ['image', 'video', 'audio'])
  complexity TEXT CHECK (complexity IN ('simple', 'moderate', 'complex')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_dreamcut_refiner_analyzer_id ON dreamcut_refiner(analyzer_id);
CREATE INDEX IF NOT EXISTS idx_dreamcut_refiner_created_at ON dreamcut_refiner(created_at);
CREATE INDEX IF NOT EXISTS idx_dreamcut_refiner_model_used ON dreamcut_refiner(model_used);
CREATE INDEX IF NOT EXISTS idx_dreamcut_refiner_template_used ON dreamcut_refiner(template_used);
CREATE INDEX IF NOT EXISTS idx_dreamcut_refiner_complexity ON dreamcut_refiner(complexity);

-- Create GIN index for JSONB payload queries
CREATE INDEX IF NOT EXISTS idx_dreamcut_refiner_payload_gin ON dreamcut_refiner USING GIN (payload);

-- Create GIN index for asset_mix array queries
CREATE INDEX IF NOT EXISTS idx_dreamcut_refiner_asset_mix_gin ON dreamcut_refiner USING GIN (asset_mix);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_dreamcut_refiner_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_dreamcut_refiner_updated_at
  BEFORE UPDATE ON dreamcut_refiner
  FOR EACH ROW
  EXECUTE FUNCTION update_dreamcut_refiner_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE dreamcut_refiner ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow users to read their own refiner results
CREATE POLICY "Users can read their own refiner results" ON dreamcut_refiner
  FOR SELECT USING (
    payload->>'user_id' = auth.uid()::text
  );

-- Allow service role to insert/update/delete (for API operations)
CREATE POLICY "Service role can manage all refiner results" ON dreamcut_refiner
  FOR ALL USING (
    auth.role() = 'service_role'
  );

-- Allow authenticated users to insert their own results
CREATE POLICY "Users can insert their own refiner results" ON dreamcut_refiner
  FOR INSERT WITH CHECK (
    payload->>'user_id' = auth.uid()::text
  );

-- Create a view for easy querying of refiner results with user info
CREATE OR REPLACE VIEW dreamcut_refiner_with_user AS
SELECT 
  r.id,
  r.analyzer_id,
  r.payload,
  r.model_used,
  r.processing_time_ms,
  r.retry_count,
  r.template_used,
  r.asset_mix,
  r.complexity,
  r.created_at,
  r.updated_at,
  r.payload->>'user_id' as user_id,
  r.payload->'user_request'->>'original_prompt' as original_prompt,
  r.payload->'user_request'->>'intent' as intent,
  r.payload->'quality_metrics'->>'overall_confidence' as overall_confidence,
  r.payload->'quality_metrics'->>'completion_status' as completion_status
FROM dreamcut_refiner r;

-- Grant permissions on the view
GRANT SELECT ON dreamcut_refiner_with_user TO authenticated;

-- Create a function to get refiner results by user
CREATE OR REPLACE FUNCTION get_user_refiner_results(user_uuid UUID, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id TEXT,
  analyzer_id TEXT,
  model_used TEXT,
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  original_prompt TEXT,
  intent TEXT,
  overall_confidence NUMERIC,
  completion_status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.analyzer_id,
    r.model_used,
    r.processing_time_ms,
    r.created_at,
    r.payload->'user_request'->>'original_prompt' as original_prompt,
    r.payload->'user_request'->>'intent' as intent,
    (r.payload->'quality_metrics'->>'overall_confidence')::NUMERIC as overall_confidence,
    r.payload->'quality_metrics'->>'completion_status' as completion_status
  FROM dreamcut_refiner r
  WHERE r.payload->>'user_id' = user_uuid::text
  ORDER BY r.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_user_refiner_results(UUID, INTEGER) TO authenticated;

-- Create a function to get refiner statistics
CREATE OR REPLACE FUNCTION get_refiner_stats()
RETURNS TABLE (
  total_refinements BIGINT,
  claude_count BIGINT,
  gpt_count BIGINT,
  avg_processing_time NUMERIC,
  success_rate NUMERIC,
  template_usage JSONB,
  complexity_distribution JSONB,
  asset_mix_distribution JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_refinements,
    COUNT(*) FILTER (WHERE model_used = 'claude-3-haiku') as claude_count,
    COUNT(*) FILTER (WHERE model_used = 'gpt-4o-mini') as gpt_count,
    AVG(processing_time_ms) as avg_processing_time,
    (COUNT(*) FILTER (WHERE payload->'quality_metrics'->>'completion_status' = 'complete')::NUMERIC / COUNT(*)::NUMERIC * 100) as success_rate,
    jsonb_object_agg(template_used, template_count) as template_usage,
    jsonb_object_agg(complexity, complexity_count) as complexity_distribution,
    jsonb_object_agg(asset_mix_key, asset_mix_count) as asset_mix_distribution
  FROM (
    SELECT 
      template_used,
      COUNT(*) as template_count,
      complexity,
      COUNT(*) as complexity_count,
      array_to_string(asset_mix, '+') as asset_mix_key,
      COUNT(*) as asset_mix_count
    FROM dreamcut_refiner
    GROUP BY template_used, complexity, asset_mix
  ) stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_refiner_stats() TO authenticated;

-- Create a function to clean up old refiner results (optional maintenance)
CREATE OR REPLACE FUNCTION cleanup_old_refiner_results(days_to_keep INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM dreamcut_refiner 
  WHERE created_at < NOW() - INTERVAL '1 day' * days_to_keep;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the cleanup function
GRANT EXECUTE ON FUNCTION cleanup_old_refiner_results(INTEGER) TO service_role;

-- Insert sample data for testing (optional)
-- INSERT INTO dreamcut_refiner (
--   id,
--   analyzer_id,
--   payload,
--   model_used,
--   processing_time_ms,
--   retry_count
-- ) VALUES (
--   'ref_sample_001',
--   'dq_sample_001',
--   '{
--     "user_request": {
--       "original_prompt": "build a vid with these",
--       "intent": "image",
--       "aspect_ratio": "16:9",
--       "platform": "social"
--     },
--     "prompt_analysis": {
--       "user_intent_description": "Create a social-ready graduation portrait featuring the user's chosen subject.",
--       "reformulated_prompt": "Generate a vibrant graduation portrait with clean composition, joyful atmosphere, and optimized styling for social platforms.",
--       "clarity_score": 6,
--       "suggested_improvements": ["Specify background style", "Choose preferred color scheme"],
--       "content_type_analysis": {
--         "needs_explanation": false,
--         "needs_charts": false,
--         "needs_diagrams": false,
--         "needs_educational_content": false,
--         "content_complexity": "simple",
--         "requires_visual_aids": false,
--         "is_instructional": false,
--         "needs_data_visualization": false,
--         "requires_interactive_elements": false,
--         "content_category": "general"
--       }
--     },
--     "assets": [
--       {
--         "id": "ast_ima01",
--         "type": "image",
--         "user_description": "use her as main character",
--         "ai_caption": "A young woman in graduation gown...",
--         "objects_detected": ["person", "car"],
--         "style": "portrait",
--         "mood": "happy",
--         "quality_score": 0.6,
--         "role": "primary subject reference",
--         "recommended_edits": [
--           { "action": "enhance-contrast", "priority": "required" }
--         ]
--       }
--     ],
--     "global_analysis": {
--       "goal": "Deliver a polished social media-ready graduation portrait.",
--       "constraints": {
--         "duration_seconds": null,
--         "aspect_ratio": "16:9",
--         "platform": "social"
--       },
--       "asset_roles": {
--         "ast_ima01": "primary subject reference"
--       },
--       "conflicts": [
--         {
--           "issue": "Smart Auto aspect ratio may crop subject",
--           "resolution": "Manual framing required",
--           "severity": "moderate"
--         }
--       ]
--     },
--     "creative_options": [
--       {
--         "id": "opt_modern",
--         "title": "Modern Clean",
--         "short": "Bright, minimalist portrait optimized for Instagram.",
--         "reasons": ["Trendy", "Professional"],
--         "estimatedWorkload": "low"
--       }
--     ],
--     "creative_direction": {
--       "core_concept": "Celebrate achievement through a vibrant graduation portrait",
--       "visual_approach": "Highlight subject with vivid contrast and shallow depth of field",
--       "style_direction": "Bright, modern, social-media-optimized",
--       "mood_atmosphere": "Joyful, celebratory"
--     },
--     "production_pipeline": {
--       "workflow_steps": [
--         "Enhance image quality",
--         "Apply chosen creative style",
--         "Optimize crop for Smart Auto aspect ratio"
--       ],
--       "estimated_time": "15-30 minutes",
--       "success_probability": 0.92,
--       "quality_targets": {
--         "technical_quality_target": "high",
--         "creative_quality_target": "appealing",
--         "consistency_target": "good",
--         "polish_level_target": "refined"
--       }
--     },
--     "quality_metrics": {
--       "overall_confidence": 0.82,
--       "analysis_quality": 8,
--       "completion_status": "complete",
--       "feasibility_score": 0.88
--     },
--     "challenges": [
--       {
--         "type": "quality",
--         "description": "Image requires enhancement before final styling.",
--         "impact": "moderate"
--       }
--     ],
--     "recommendations": [
--       {
--         "type": "quality",
--         "recommendation": "Enhance subject quality before applying style.",
--         "priority": "required"
--       }
--     ]
--   }'::jsonb,
--   'claude-3-haiku',
--   1500,
--   0
-- );

-- Comments for documentation
COMMENT ON TABLE dreamcut_refiner IS 'Stores refined JSON outputs from the DreamCut refiner system';
COMMENT ON COLUMN dreamcut_refiner.id IS 'Unique identifier for the refiner result';
COMMENT ON COLUMN dreamcut_refiner.analyzer_id IS 'Links to the original analyzer result';
COMMENT ON COLUMN dreamcut_refiner.payload IS 'The complete refined JSON output';
COMMENT ON COLUMN dreamcut_refiner.model_used IS 'Which LLM model was used for refinement';
COMMENT ON COLUMN dreamcut_refiner.processing_time_ms IS 'Time taken to process the refinement';
COMMENT ON COLUMN dreamcut_refiner.retry_count IS 'Number of retries attempted';
