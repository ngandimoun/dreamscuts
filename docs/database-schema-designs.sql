-- Database schema for user designs
-- This file contains the SQL commands to create the designs table in Supabase

-- Create the designs table
CREATE TABLE IF NOT EXISTS designs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'General',
  tags TEXT[] DEFAULT '{}',
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Metadata for generated designs
  prompt TEXT,
  model_used VARCHAR(255),
  generation_params JSONB,
  file_size INTEGER,
  file_format VARCHAR(10),
  
  -- Design specific fields
  aspect_ratio VARCHAR(20),
  resolution VARCHAR(20),
  color_palette TEXT[],
  style_tags TEXT[]
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_designs_user_id ON designs(user_id);
CREATE INDEX IF NOT EXISTS idx_designs_category ON designs(category);
CREATE INDEX IF NOT EXISTS idx_designs_created_at ON designs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_designs_public ON designs(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_designs_tags ON designs USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_designs_style_tags ON designs USING GIN(style_tags);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_designs_updated_at 
    BEFORE UPDATE ON designs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own designs and public designs
CREATE POLICY "Users can view their own designs" ON designs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public designs" ON designs
    FOR SELECT USING (is_public = true);

-- Users can only insert their own designs
CREATE POLICY "Users can insert their own designs" ON designs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own designs
CREATE POLICY "Users can update their own designs" ON designs
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own designs
CREATE POLICY "Users can delete their own designs" ON designs
    FOR DELETE USING (auth.uid() = user_id);

-- Create a view for public designs with user information
CREATE OR REPLACE VIEW public_designs AS
SELECT 
    d.*,
    u.email as creator_email,
    u.raw_user_meta_data->>'full_name' as creator_name,
    u.raw_user_meta_data->>'avatar_url' as creator_avatar
FROM designs d
JOIN auth.users u ON d.user_id = u.id
WHERE d.is_public = true;

-- Grant permissions
GRANT SELECT ON public_designs TO authenticated;
GRANT ALL ON designs TO authenticated;
