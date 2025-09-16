-- 🎬 DreamCut Supabase Schema & Realtime Strategy
-- 
-- This schema implements the director's feedback experience with:
-- 1. dreamcut_queries - Overall query management
-- 2. dreamcut_assets - Individual asset tracking  
-- 3. Realtime channels - Live progress streaming
-- 4. RLS policies - Secure user access
-- 5. Background worker queues - Parallel processing

-- ========================================
-- 1. DREAMCUT_QUERIES TABLE
-- ========================================
-- Stores the overall query request with realtime progress

CREATE TABLE dreamcut_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  user_prompt TEXT NOT NULL,
  intent TEXT CHECK (intent IN ('image', 'video', 'audio', 'mixed')),
  options JSONB DEFAULT '{}', -- duration, aspect ratio, model preferences, etc.
  
  -- Progress tracking
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  stage TEXT DEFAULT 'init' CHECK (stage IN ('init', 'analyzing', 'merging', 'done')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  
  -- Results
  payload JSONB, -- final analyzer JSON (comprehensive creative brief)
  error_message TEXT,
  
  -- Performance metrics
  processing_time_ms INTEGER,
  models_used TEXT[],
  cost_estimate DECIMAL(10,4),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_dreamcut_queries_user_id ON dreamcut_queries(user_id);
CREATE INDEX idx_dreamcut_queries_status ON dreamcut_queries(status);
CREATE INDEX idx_dreamcut_queries_created_at ON dreamcut_queries(created_at DESC);

-- ========================================
-- 2. DREAMCUT_ASSETS TABLE  
-- ========================================
-- Stores each uploaded asset linked to a query with individual progress

CREATE TABLE dreamcut_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES dreamcut_queries(id) ON DELETE CASCADE,
  
  -- Asset details
  url TEXT NOT NULL,
  filename TEXT,
  type TEXT CHECK (type IN ('image', 'video', 'audio')),
  user_description TEXT,
  file_size_bytes BIGINT,
  metadata JSONB DEFAULT '{}', -- dimensions, duration, format, etc.
  
  -- Analysis progress
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'completed', 'failed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  analysis JSONB DEFAULT '{}', -- partial analysis JSON that builds up
  
  -- Processing details
  worker_id TEXT, -- which worker is processing this asset
  model_used TEXT, -- which AI model analyzed this asset
  processing_time_ms INTEGER,
  error_message TEXT,
  
  -- Quality metrics
  quality_score DECIMAL(3,2), -- 0.00 to 10.00
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  analyzed_at TIMESTAMPTZ
);

-- Indexes for performance and realtime queries
CREATE INDEX idx_dreamcut_assets_query_id ON dreamcut_assets(query_id);
CREATE INDEX idx_dreamcut_assets_status ON dreamcut_assets(status);
CREATE INDEX idx_dreamcut_assets_type ON dreamcut_assets(type);

-- ========================================
-- 3. DREAMCUT_MESSAGES TABLE (Optional Chat History)
-- ========================================
-- Stores the director's feedback messages for persistence

CREATE TABLE dreamcut_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES dreamcut_queries(id) ON DELETE CASCADE,
  
  -- Message details
  type TEXT CHECK (type IN ('status', 'asset_start', 'asset_progress', 'asset_complete', 'merge', 'final', 'conflict', 'suggestion', 'error')),
  content TEXT NOT NULL,
  emoji TEXT,
  
  -- Associated data
  asset_id UUID REFERENCES dreamcut_assets(id) ON DELETE SET NULL,
  data JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dreamcut_messages_query_id ON dreamcut_messages(query_id);
CREATE INDEX idx_dreamcut_messages_created_at ON dreamcut_messages(created_at);

-- ========================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE dreamcut_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE dreamcut_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE dreamcut_messages ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own data
CREATE POLICY "Users can manage own queries" ON dreamcut_queries
  FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can manage assets for own queries" ON dreamcut_assets
  FOR ALL USING (
    query_id IN (
      SELECT id FROM dreamcut_queries WHERE user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can view messages for own queries" ON dreamcut_messages
  FOR SELECT USING (
    query_id IN (
      SELECT id FROM dreamcut_queries WHERE user_id = auth.uid()::text
    )
  );

-- Service role can manage all data (for background workers)
CREATE POLICY "Service role can manage all data" ON dreamcut_queries
  FOR ALL TO service_role USING (true);

CREATE POLICY "Service role can manage all assets" ON dreamcut_assets
  FOR ALL TO service_role USING (true);

CREATE POLICY "Service role can manage all messages" ON dreamcut_messages
  FOR ALL TO service_role USING (true);

-- ========================================
-- 5. REALTIME PUBLICATION
-- ========================================

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE dreamcut_queries;
ALTER PUBLICATION supabase_realtime ADD TABLE dreamcut_assets;
ALTER PUBLICATION supabase_realtime ADD TABLE dreamcut_messages;

-- ========================================
-- 6. TRIGGER FUNCTIONS FOR AUTO-UPDATES
-- ========================================

-- Update timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables
CREATE TRIGGER update_dreamcut_queries_updated_at
  BEFORE UPDATE ON dreamcut_queries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dreamcut_assets_updated_at
  BEFORE UPDATE ON dreamcut_assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-complete query when all assets are done
CREATE OR REPLACE FUNCTION check_query_completion()
RETURNS TRIGGER AS $$
DECLARE
  total_assets INTEGER;
  completed_assets INTEGER;
  failed_assets INTEGER;
BEGIN
  -- Count assets for this query
  SELECT COUNT(*) INTO total_assets
  FROM dreamcut_assets 
  WHERE query_id = NEW.query_id;
  
  SELECT COUNT(*) INTO completed_assets
  FROM dreamcut_assets 
  WHERE query_id = NEW.query_id AND status = 'completed';
  
  SELECT COUNT(*) INTO failed_assets
  FROM dreamcut_assets 
  WHERE query_id = NEW.query_id AND status = 'failed';
  
  -- If all assets are done (completed or failed), trigger merge stage
  IF (completed_assets + failed_assets) = total_assets THEN
    UPDATE dreamcut_queries 
    SET 
      stage = CASE 
        WHEN failed_assets = total_assets THEN 'done'
        ELSE 'merging'
      END,
      progress = CASE 
        WHEN failed_assets = total_assets THEN 100
        ELSE 80
      END,
      status = CASE 
        WHEN failed_assets = total_assets THEN 'failed'
        ELSE status
      END
    WHERE id = NEW.query_id;
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_check_query_completion
  AFTER UPDATE ON dreamcut_assets
  FOR EACH ROW EXECUTE FUNCTION check_query_completion();

-- ========================================
-- 7. HELPER FUNCTIONS
-- ========================================

-- Function to initialize a new query with assets
CREATE OR REPLACE FUNCTION initialize_dreamcut_query(
  p_user_id TEXT,
  p_user_prompt TEXT,
  p_intent TEXT,
  p_options JSONB DEFAULT '{}',
  p_assets JSONB DEFAULT '[]'
) RETURNS UUID AS $$
DECLARE
  query_id UUID;
  asset JSONB;
BEGIN
  -- Insert main query
  INSERT INTO dreamcut_queries (user_id, user_prompt, intent, options)
  VALUES (p_user_id, p_user_prompt, p_intent, p_options)
  RETURNING id INTO query_id;
  
  -- Insert assets
  FOR asset IN SELECT * FROM jsonb_array_elements(p_assets)
  LOOP
    INSERT INTO dreamcut_assets (
      query_id,
      url,
      filename,
      type,
      user_description,
      metadata
    ) VALUES (
      query_id,
      asset->>'url',
      asset->>'filename',
      asset->>'type',
      asset->>'description',
      COALESCE(asset->'metadata', '{}'::jsonb)
    );
  END LOOP;
  
  -- Insert initial status message
  INSERT INTO dreamcut_messages (query_id, type, content, emoji)
  VALUES (query_id, 'status', 'Got your request. Let''s break it down...', '🎬');
  
  RETURN query_id;
END;
$$ language 'plpgsql';

-- Function to update asset progress with message
CREATE OR REPLACE FUNCTION update_asset_progress(
  p_asset_id UUID,
  p_progress INTEGER,
  p_status TEXT DEFAULT NULL,
  p_analysis JSONB DEFAULT NULL,
  p_model_used TEXT DEFAULT NULL,
  p_message TEXT DEFAULT NULL,
  p_message_type TEXT DEFAULT 'asset_progress',
  p_emoji TEXT DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
  query_id_var UUID;
BEGIN
  -- Update asset
  UPDATE dreamcut_assets 
  SET 
    progress = p_progress,
    status = COALESCE(p_status, status),
    analysis = COALESCE(p_analysis, analysis),
    model_used = COALESCE(p_model_used, model_used),
    analyzed_at = CASE WHEN p_progress = 100 THEN NOW() ELSE analyzed_at END
  WHERE id = p_asset_id
  RETURNING query_id INTO query_id_var;
  
  -- Add message if provided
  IF p_message IS NOT NULL THEN
    INSERT INTO dreamcut_messages (query_id, asset_id, type, content, emoji)
    VALUES (query_id_var, p_asset_id, p_message_type, p_message, p_emoji);
  END IF;
END;
$$ language 'plpgsql';

-- Function to complete query with final payload
CREATE OR REPLACE FUNCTION complete_dreamcut_query(
  p_query_id UUID,
  p_payload JSONB,
  p_processing_time_ms INTEGER DEFAULT NULL,
  p_models_used TEXT[] DEFAULT NULL,
  p_cost_estimate DECIMAL DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  -- Update query
  UPDATE dreamcut_queries 
  SET 
    status = 'completed',
    stage = 'done',
    progress = 100,
    payload = p_payload,
    processing_time_ms = p_processing_time_ms,
    models_used = p_models_used,
    cost_estimate = p_cost_estimate,
    completed_at = NOW()
  WHERE id = p_query_id;
  
  -- Add completion messages
  INSERT INTO dreamcut_messages (query_id, type, content, emoji)
  VALUES 
    (p_query_id, 'final', 'Creative brief ready 🎬', '🎬'),
    (p_query_id, 'final', 'Ready for production! 🚀', '🚀');
END;
$$ language 'plpgsql';

-- ========================================
-- 8. SAMPLE DATA (FOR TESTING)
-- ========================================

-- Insert sample query for testing (uncomment to use)
/*
SELECT initialize_dreamcut_query(
  'user123',
  'Make a cinematic 30-second cyberpunk trailer with neon rain, using my reference image and video, and add my voiceover.',
  'video',
  '{"duration": 30, "aspect_ratio": "16:9"}'::jsonb,
  '[
    {
      "url": "https://cdn.supabase.io/assets/cyberpunk_ref.jpg",
      "filename": "cyberpunk_ref.jpg", 
      "type": "image",
      "description": "Moodboard reference for style and lighting"
    },
    {
      "url": "https://cdn.supabase.io/assets/city_drive.mp4",
      "filename": "city_drive.mp4",
      "type": "video", 
      "description": "Footage of driving through neon-lit streets"
    },
    {
      "url": "https://cdn.supabase.io/assets/voiceover.mp3",
      "filename": "voiceover.mp3",
      "type": "audio",
      "description": "Narration for the trailer"
    }
  ]'::jsonb
);
*/
