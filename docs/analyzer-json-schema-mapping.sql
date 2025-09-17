-- 🎬 DreamCut Analyzer JSON Schema Mapping to Supabase
-- 
-- This migration maps the complete analyzer JSON output to normalized database tables
-- for efficient querying, realtime streaming, and data analysis.

-- ========================================
-- 1. ANALYZER_QUERIES TABLE (Main Query)
-- ========================================
-- Stores the main query with user request and overall analysis

CREATE TABLE IF NOT EXISTS analyzer_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- User Request Data
  original_prompt TEXT NOT NULL,
  intent TEXT NOT NULL CHECK (intent IN ('image', 'video', 'audio', 'mixed')),
  duration_seconds INTEGER,
  aspect_ratio TEXT,
  platform TEXT,
  image_count INTEGER,
  
  -- Prompt Analysis
  user_intent_description TEXT,
  reformulated_prompt TEXT,
  clarity_score INTEGER CHECK (clarity_score >= 1 AND clarity_score <= 10),
  suggested_improvements TEXT[],
  
  -- Content Type Analysis
  needs_explanation BOOLEAN DEFAULT false,
  needs_charts BOOLEAN DEFAULT false,
  needs_diagrams BOOLEAN DEFAULT false,
  needs_educational_content BOOLEAN DEFAULT false,
  content_complexity TEXT CHECK (content_complexity IN ('simple', 'moderate', 'complex')),
  requires_visual_aids BOOLEAN DEFAULT false,
  is_instructional BOOLEAN DEFAULT false,
  needs_data_visualization BOOLEAN DEFAULT false,
  requires_interactive_elements BOOLEAN DEFAULT false,
  content_category TEXT,
  
  -- Global Analysis
  goal TEXT,
  constraints JSONB DEFAULT '{}',
  asset_roles JSONB DEFAULT '{}',
  conflicts TEXT[],
  
  -- Creative Direction
  core_concept TEXT,
  visual_approach TEXT,
  style_direction TEXT,
  mood_atmosphere TEXT,
  
  -- Production Pipeline
  workflow_steps TEXT[],
  estimated_time TEXT,
  success_probability DECIMAL(3,2) CHECK (success_probability >= 0 AND success_probability <= 1),
  quality_targets JSONB DEFAULT '{}',
  
  -- Quality Metrics
  overall_confidence DECIMAL(3,2) CHECK (overall_confidence >= 0 AND overall_confidence <= 1),
  analysis_quality INTEGER CHECK (analysis_quality >= 1 AND analysis_quality <= 10),
  completion_status TEXT CHECK (completion_status IN ('complete', 'partial', 'failed')),
  feasibility_score DECIMAL(3,2) CHECK (feasibility_score >= 0 AND feasibility_score <= 1),
  
  -- Processing metadata
  processing_time_ms INTEGER,
  models_used TEXT[],
  cost_estimate DECIMAL(10,4),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ========================================
-- 2. ANALYZER_ASSETS TABLE
-- ========================================
-- Stores individual assets with their analysis

CREATE TABLE IF NOT EXISTS analyzer_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES analyzer_queries(id) ON DELETE CASCADE,
  
  -- Asset identification
  asset_id TEXT NOT NULL, -- e.g., "ast_ima01"
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'audio')),
  
  -- Asset details
  user_description TEXT,
  ai_caption TEXT,
  objects_detected TEXT[],
  style TEXT,
  mood TEXT,
  quality_score DECIMAL(3,2) CHECK (quality_score >= 0 AND quality_score <= 1),
  role TEXT,
  recommended_edits TEXT[],
  
  -- File metadata
  file_url TEXT,
  file_size_bytes BIGINT,
  file_format TEXT,
  resolution TEXT,
  duration_seconds INTEGER,
  
  -- Analysis metadata
  analysis_confidence DECIMAL(3,2) CHECK (analysis_confidence >= 0 AND analysis_confidence <= 1),
  processing_time_ms INTEGER,
  model_used TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  analyzed_at TIMESTAMPTZ
);

-- ========================================
-- 3. CREATIVE_OPTIONS TABLE
-- ========================================
-- Stores available creative directions

CREATE TABLE IF NOT EXISTS creative_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES analyzer_queries(id) ON DELETE CASCADE,
  
  -- Option details
  option_id TEXT NOT NULL, -- e.g., "opt_modern"
  title TEXT NOT NULL,
  short_description TEXT,
  reasons TEXT[],
  estimated_workload TEXT CHECK (estimated_workload IN ('low', 'medium', 'high')),
  
  -- Selection tracking
  is_selected BOOLEAN DEFAULT false,
  selection_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 4. CHALLENGES TABLE
-- ========================================
-- Stores identified challenges

CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES analyzer_queries(id) ON DELETE CASCADE,
  
  -- Challenge details
  type TEXT NOT NULL, -- e.g., "quality", "technical", "creative"
  description TEXT NOT NULL,
  impact TEXT CHECK (impact IN ('low', 'moderate', 'high', 'critical')),
  
  -- Resolution tracking
  is_resolved BOOLEAN DEFAULT false,
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 5. RECOMMENDATIONS TABLE
-- ========================================
-- Stores recommendations and suggestions

CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES analyzer_queries(id) ON DELETE CASCADE,
  
  -- Recommendation details
  type TEXT NOT NULL, -- e.g., "quality", "creative", "technical"
  recommendation TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical', 'recommended')),
  
  -- Implementation tracking
  is_implemented BOOLEAN DEFAULT false,
  implementation_notes TEXT,
  implemented_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 6. INDEXES FOR PERFORMANCE
-- ========================================

-- Analyzer queries indexes
CREATE INDEX IF NOT EXISTS idx_analyzer_queries_user_id ON analyzer_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_analyzer_queries_intent ON analyzer_queries(intent);
CREATE INDEX IF NOT EXISTS idx_analyzer_queries_created_at ON analyzer_queries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyzer_queries_completion_status ON analyzer_queries(completion_status);

-- Analyzer assets indexes
CREATE INDEX IF NOT EXISTS idx_analyzer_assets_query_id ON analyzer_assets(query_id);
CREATE INDEX IF NOT EXISTS idx_analyzer_assets_type ON analyzer_assets(type);
CREATE INDEX IF NOT EXISTS idx_analyzer_assets_asset_id ON analyzer_assets(asset_id);

-- Creative options indexes
CREATE INDEX IF NOT EXISTS idx_creative_options_query_id ON creative_options(query_id);
CREATE INDEX IF NOT EXISTS idx_creative_options_selected ON creative_options(is_selected);

-- Challenges indexes
CREATE INDEX IF NOT EXISTS idx_challenges_query_id ON challenges(query_id);
CREATE INDEX IF NOT EXISTS idx_challenges_type ON challenges(type);
CREATE INDEX IF NOT EXISTS idx_challenges_resolved ON challenges(is_resolved);

-- Recommendations indexes
CREATE INDEX IF NOT EXISTS idx_recommendations_query_id ON recommendations(query_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_type ON recommendations(type);
CREATE INDEX IF NOT EXISTS idx_recommendations_priority ON recommendations(priority);

-- ========================================
-- 7. TRIGGER FUNCTIONS
-- ========================================

-- Auto-update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_analyzer_queries_updated_at 
    BEFORE UPDATE ON analyzer_queries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analyzer_assets_updated_at 
    BEFORE UPDATE ON analyzer_assets 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creative_options_updated_at 
    BEFORE UPDATE ON creative_options 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at 
    BEFORE UPDATE ON challenges 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recommendations_updated_at 
    BEFORE UPDATE ON recommendations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE analyzer_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyzer_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for analyzer_queries
CREATE POLICY "Users can view own analyzer queries" ON analyzer_queries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyzer queries" ON analyzer_queries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyzer queries" ON analyzer_queries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyzer queries" ON analyzer_queries
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for analyzer_assets
CREATE POLICY "Users can view assets from own queries" ON analyzer_assets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM analyzer_queries 
            WHERE analyzer_queries.id = analyzer_assets.query_id 
            AND analyzer_queries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert assets to own queries" ON analyzer_assets
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM analyzer_queries 
            WHERE analyzer_queries.id = analyzer_assets.query_id 
            AND analyzer_queries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update assets from own queries" ON analyzer_assets
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM analyzer_queries 
            WHERE analyzer_queries.id = analyzer_assets.query_id 
            AND analyzer_queries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete assets from own queries" ON analyzer_assets
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM analyzer_queries 
            WHERE analyzer_queries.id = analyzer_assets.query_id 
            AND analyzer_queries.user_id = auth.uid()
        )
    );

-- RLS Policies for creative_options
CREATE POLICY "Users can view options from own queries" ON creative_options
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM analyzer_queries 
            WHERE analyzer_queries.id = creative_options.query_id 
            AND analyzer_queries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert options to own queries" ON creative_options
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM analyzer_queries 
            WHERE analyzer_queries.id = creative_options.query_id 
            AND analyzer_queries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update options from own queries" ON creative_options
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM analyzer_queries 
            WHERE analyzer_queries.id = creative_options.query_id 
            AND analyzer_queries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete options from own queries" ON creative_options
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM analyzer_queries 
            WHERE analyzer_queries.id = creative_options.query_id 
            AND analyzer_queries.user_id = auth.uid()
        )
    );

-- RLS Policies for challenges
CREATE POLICY "Users can view challenges from own queries" ON challenges
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM analyzer_queries 
            WHERE analyzer_queries.id = challenges.query_id 
            AND analyzer_queries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert challenges to own queries" ON challenges
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM analyzer_queries 
            WHERE analyzer_queries.id = challenges.query_id 
            AND analyzer_queries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update challenges from own queries" ON challenges
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM analyzer_queries 
            WHERE analyzer_queries.id = challenges.query_id 
            AND analyzer_queries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete challenges from own queries" ON challenges
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM analyzer_queries 
            WHERE analyzer_queries.id = challenges.query_id 
            AND analyzer_queries.user_id = auth.uid()
        )
    );

-- RLS Policies for recommendations
CREATE POLICY "Users can view recommendations from own queries" ON recommendations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM analyzer_queries 
            WHERE analyzer_queries.id = recommendations.query_id 
            AND analyzer_queries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert recommendations to own queries" ON recommendations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM analyzer_queries 
            WHERE analyzer_queries.id = recommendations.query_id 
            AND analyzer_queries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update recommendations from own queries" ON recommendations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM analyzer_queries 
            WHERE analyzer_queries.id = recommendations.query_id 
            AND analyzer_queries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete recommendations from own queries" ON recommendations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM analyzer_queries 
            WHERE analyzer_queries.id = recommendations.query_id 
            AND analyzer_queries.user_id = auth.uid()
        )
    );

-- ========================================
-- 9. REALTIME PUBLICATION
-- ========================================

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE analyzer_queries;
ALTER PUBLICATION supabase_realtime ADD TABLE analyzer_assets;
ALTER PUBLICATION supabase_realtime ADD TABLE creative_options;
ALTER PUBLICATION supabase_realtime ADD TABLE challenges;
ALTER PUBLICATION supabase_realtime ADD TABLE recommendations;

-- ========================================
-- 10. HELPER FUNCTIONS
-- ========================================

-- Function to insert complete analyzer result
CREATE OR REPLACE FUNCTION insert_analyzer_result(
    p_user_id UUID,
    p_analyzer_json JSONB
) RETURNS UUID AS $$
DECLARE
    query_id UUID;
    asset_item JSONB;
    option_item JSONB;
    challenge_item JSONB;
    recommendation_item JSONB;
BEGIN
    -- Insert main query
    INSERT INTO analyzer_queries (
        user_id,
        original_prompt,
        intent,
        duration_seconds,
        aspect_ratio,
        platform,
        image_count,
        user_intent_description,
        reformulated_prompt,
        clarity_score,
        suggested_improvements,
        needs_explanation,
        needs_charts,
        needs_diagrams,
        needs_educational_content,
        content_complexity,
        requires_visual_aids,
        is_instructional,
        needs_data_visualization,
        requires_interactive_elements,
        content_category,
        goal,
        constraints,
        asset_roles,
        conflicts,
        core_concept,
        visual_approach,
        style_direction,
        mood_atmosphere,
        workflow_steps,
        estimated_time,
        success_probability,
        quality_targets,
        overall_confidence,
        analysis_quality,
        completion_status,
        feasibility_score,
        processing_time_ms,
        models_used,
        cost_estimate
    ) VALUES (
        p_user_id,
        p_analyzer_json->'user_request'->>'original_prompt',
        p_analyzer_json->'user_request'->>'intent',
        (p_analyzer_json->'user_request'->>'duration_seconds')::INTEGER,
        p_analyzer_json->'user_request'->>'aspect_ratio',
        p_analyzer_json->'user_request'->>'platform',
        (p_analyzer_json->'user_request'->>'image_count')::INTEGER,
        p_analyzer_json->'prompt_analysis'->>'user_intent_description',
        p_analyzer_json->'prompt_analysis'->>'reformulated_prompt',
        (p_analyzer_json->'prompt_analysis'->>'clarity_score')::INTEGER,
        ARRAY(SELECT jsonb_array_elements_text(p_analyzer_json->'prompt_analysis'->'suggested_improvements')),
        (p_analyzer_json->'prompt_analysis'->'content_type_analysis'->>'needs_explanation')::BOOLEAN,
        (p_analyzer_json->'prompt_analysis'->'content_type_analysis'->>'needs_charts')::BOOLEAN,
        (p_analyzer_json->'prompt_analysis'->'content_type_analysis'->>'needs_diagrams')::BOOLEAN,
        (p_analyzer_json->'prompt_analysis'->'content_type_analysis'->>'needs_educational_content')::BOOLEAN,
        p_analyzer_json->'prompt_analysis'->'content_type_analysis'->>'content_complexity',
        (p_analyzer_json->'prompt_analysis'->'content_type_analysis'->>'requires_visual_aids')::BOOLEAN,
        (p_analyzer_json->'prompt_analysis'->'content_type_analysis'->>'is_instructional')::BOOLEAN,
        (p_analyzer_json->'prompt_analysis'->'content_type_analysis'->>'needs_data_visualization')::BOOLEAN,
        (p_analyzer_json->'prompt_analysis'->'content_type_analysis'->>'requires_interactive_elements')::BOOLEAN,
        p_analyzer_json->'prompt_analysis'->'content_type_analysis'->>'content_category',
        p_analyzer_json->'global_analysis'->>'goal',
        p_analyzer_json->'global_analysis'->'constraints',
        p_analyzer_json->'global_analysis'->'asset_roles',
        ARRAY(SELECT jsonb_array_elements_text(p_analyzer_json->'global_analysis'->'conflicts')),
        p_analyzer_json->'creative_direction'->>'core_concept',
        p_analyzer_json->'creative_direction'->>'visual_approach',
        p_analyzer_json->'creative_direction'->>'style_direction',
        p_analyzer_json->'creative_direction'->>'mood_atmosphere',
        ARRAY(SELECT jsonb_array_elements_text(p_analyzer_json->'production_pipeline'->'workflow_steps')),
        p_analyzer_json->'production_pipeline'->>'estimated_time',
        (p_analyzer_json->'production_pipeline'->>'success_probability')::DECIMAL,
        p_analyzer_json->'production_pipeline'->'quality_targets',
        (p_analyzer_json->'quality_metrics'->>'overall_confidence')::DECIMAL,
        (p_analyzer_json->'quality_metrics'->>'analysis_quality')::INTEGER,
        p_analyzer_json->'quality_metrics'->>'completion_status',
        (p_analyzer_json->'quality_metrics'->>'feasibility_score')::DECIMAL,
        (p_analyzer_json->>'processing_time_ms')::INTEGER,
        ARRAY(SELECT jsonb_array_elements_text(p_analyzer_json->'models_used')),
        (p_analyzer_json->>'cost_estimate')::DECIMAL
    ) RETURNING id INTO query_id;

    -- Insert assets
    FOR asset_item IN SELECT jsonb_array_elements(p_analyzer_json->'assets')
    LOOP
        INSERT INTO analyzer_assets (
            query_id,
            asset_id,
            type,
            user_description,
            ai_caption,
            objects_detected,
            style,
            mood,
            quality_score,
            role,
            recommended_edits
        ) VALUES (
            query_id,
            asset_item->>'id',
            asset_item->>'type',
            asset_item->>'user_description',
            asset_item->>'ai_caption',
            ARRAY(SELECT jsonb_array_elements_text(asset_item->'objects_detected')),
            asset_item->>'style',
            asset_item->>'mood',
            (asset_item->>'quality_score')::DECIMAL,
            asset_item->>'role',
            ARRAY(SELECT jsonb_array_elements_text(asset_item->'recommended_edits'))
        );
    END LOOP;

    -- Insert creative options
    FOR option_item IN SELECT jsonb_array_elements(p_analyzer_json->'creative_options')
    LOOP
        INSERT INTO creative_options (
            query_id,
            option_id,
            title,
            short_description,
            reasons,
            estimated_workload
        ) VALUES (
            query_id,
            option_item->>'id',
            option_item->>'title',
            option_item->>'short',
            ARRAY(SELECT jsonb_array_elements_text(option_item->'reasons')),
            option_item->>'estimatedWorkload'
        );
    END LOOP;

    -- Insert challenges
    FOR challenge_item IN SELECT jsonb_array_elements(p_analyzer_json->'challenges')
    LOOP
        INSERT INTO challenges (
            query_id,
            type,
            description,
            impact
        ) VALUES (
            query_id,
            challenge_item->>'type',
            challenge_item->>'description',
            challenge_item->>'impact'
        );
    END LOOP;

    -- Insert recommendations
    FOR recommendation_item IN SELECT jsonb_array_elements(p_analyzer_json->'recommendations')
    LOOP
        INSERT INTO recommendations (
            query_id,
            type,
            recommendation,
            priority
        ) VALUES (
            query_id,
            recommendation_item->>'type',
            recommendation_item->>'recommendation',
            recommendation_item->>'priority'
        );
    END LOOP;

    RETURN query_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get complete analyzer result
CREATE OR REPLACE FUNCTION get_analyzer_result(p_query_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    query_record RECORD;
    assets JSONB;
    options JSONB;
    challenges JSONB;
    recommendations JSONB;
BEGIN
    -- Get main query
    SELECT * INTO query_record FROM analyzer_queries WHERE id = p_query_id;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;

    -- Get assets
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', asset_id,
            'type', type,
            'user_description', user_description,
            'ai_caption', ai_caption,
            'objects_detected', objects_detected,
            'style', style,
            'mood', mood,
            'quality_score', quality_score,
            'role', role,
            'recommended_edits', recommended_edits
        )
    ) INTO assets
    FROM analyzer_assets 
    WHERE query_id = p_query_id;

    -- Get creative options
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', option_id,
            'title', title,
            'short', short_description,
            'reasons', reasons,
            'estimatedWorkload', estimated_workload,
            'is_selected', is_selected
        )
    ) INTO options
    FROM creative_options 
    WHERE query_id = p_query_id;

    -- Get challenges
    SELECT jsonb_agg(
        jsonb_build_object(
            'type', type,
            'description', description,
            'impact', impact,
            'is_resolved', is_resolved
        )
    ) INTO challenges
    FROM challenges 
    WHERE query_id = p_query_id;

    -- Get recommendations
    SELECT jsonb_agg(
        jsonb_build_object(
            'type', type,
            'recommendation', recommendation,
            'priority', priority,
            'is_implemented', is_implemented
        )
    ) INTO recommendations
    FROM recommendations 
    WHERE query_id = p_query_id;

    -- Build complete result
    result := jsonb_build_object(
        'user_request', jsonb_build_object(
            'original_prompt', query_record.original_prompt,
            'intent', query_record.intent,
            'duration_seconds', query_record.duration_seconds,
            'aspect_ratio', query_record.aspect_ratio,
            'platform', query_record.platform,
            'image_count', query_record.image_count
        ),
        'prompt_analysis', jsonb_build_object(
            'user_intent_description', query_record.user_intent_description,
            'reformulated_prompt', query_record.reformulated_prompt,
            'clarity_score', query_record.clarity_score,
            'suggested_improvements', query_record.suggested_improvements,
            'content_type_analysis', jsonb_build_object(
                'needs_explanation', query_record.needs_explanation,
                'needs_charts', query_record.needs_charts,
                'needs_diagrams', query_record.needs_diagrams,
                'needs_educational_content', query_record.needs_educational_content,
                'content_complexity', query_record.content_complexity,
                'requires_visual_aids', query_record.requires_visual_aids,
                'is_instructional', query_record.is_instructional,
                'needs_data_visualization', query_record.needs_data_visualization,
                'requires_interactive_elements', query_record.requires_interactive_elements,
                'content_category', query_record.content_category
            )
        ),
        'assets', COALESCE(assets, '[]'::jsonb),
        'global_analysis', jsonb_build_object(
            'goal', query_record.goal,
            'constraints', query_record.constraints,
            'asset_roles', query_record.asset_roles,
            'conflicts', query_record.conflicts
        ),
        'creative_options', COALESCE(options, '[]'::jsonb),
        'creative_direction', jsonb_build_object(
            'core_concept', query_record.core_concept,
            'visual_approach', query_record.visual_approach,
            'style_direction', query_record.style_direction,
            'mood_atmosphere', query_record.mood_atmosphere
        ),
        'production_pipeline', jsonb_build_object(
            'workflow_steps', query_record.workflow_steps,
            'estimated_time', query_record.estimated_time,
            'success_probability', query_record.success_probability,
            'quality_targets', query_record.quality_targets
        ),
        'quality_metrics', jsonb_build_object(
            'overall_confidence', query_record.overall_confidence,
            'analysis_quality', query_record.analysis_quality,
            'completion_status', query_record.completion_status,
            'feasibility_score', query_record.feasibility_score
        ),
        'challenges', COALESCE(challenges, '[]'::jsonb),
        'recommendations', COALESCE(recommendations, '[]'::jsonb),
        'processing_time_ms', query_record.processing_time_ms,
        'models_used', query_record.models_used,
        'cost_estimate', query_record.cost_estimate,
        'created_at', query_record.created_at,
        'updated_at', query_record.updated_at
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 11. GRANT PERMISSIONS
-- ========================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- ========================================
-- MIGRATION COMPLETE
-- ========================================

-- This migration creates a complete normalized database schema
-- that maps all fields from the analyzer JSON output to queryable tables
-- with full realtime support and proper security policies.
