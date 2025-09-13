-- Apply user media schema to Supabase
-- Run this in your Supabase SQL editor

-- Create the user_media table
CREATE TABLE IF NOT EXISTS user_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'video', 'document', 'audio')),
  url TEXT NOT NULL,
  thumbnail TEXT,
  file_size INTEGER,
  mime_type VARCHAR(100),
  supabase_path TEXT NOT NULL,
  supabase_bucket VARCHAR(50) NOT NULL DEFAULT 'dreamcut-assets',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Optional metadata
  width INTEGER,
  height INTEGER,
  duration INTEGER, -- for audio/video files
  description TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_media_user_id ON user_media(user_id);
CREATE INDEX IF NOT EXISTS idx_user_media_type ON user_media(type);
CREATE INDEX IF NOT EXISTS idx_user_media_created_at ON user_media(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_media_supabase_path ON user_media(supabase_path);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_media_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_media_updated_at 
    BEFORE UPDATE ON user_media 
    FOR EACH ROW 
    EXECUTE FUNCTION update_user_media_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE user_media ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own media
CREATE POLICY "Users can view their own media" ON user_media
    FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own media
CREATE POLICY "Users can insert their own media" ON user_media
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own media
CREATE POLICY "Users can update their own media" ON user_media
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own media
CREATE POLICY "Users can delete their own media" ON user_media
    FOR DELETE USING (auth.uid() = user_id);

-- Function to get user's media files
CREATE OR REPLACE FUNCTION get_user_media(user_id UUID)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    type VARCHAR,
    url TEXT,
    thumbnail TEXT,
    file_size INTEGER,
    mime_type VARCHAR,
    supabase_path TEXT,
    supabase_bucket VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    width INTEGER,
    height INTEGER,
    duration INTEGER,
    description TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        um.id,
        um.name,
        um.type,
        um.url,
        um.thumbnail,
        um.file_size,
        um.mime_type,
        um.supabase_path,
        um.supabase_bucket,
        um.created_at,
        um.updated_at,
        um.width,
        um.height,
        um.duration,
        um.description
    FROM user_media um
    WHERE um.user_id = get_user_media.user_id
    ORDER BY um.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete user media and clean up storage
CREATE OR REPLACE FUNCTION delete_user_media(media_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    media_record RECORD;
BEGIN
    -- Get the media record
    SELECT * INTO media_record 
    FROM user_media 
    WHERE id = media_id AND user_id = auth.uid();
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Delete from database
    DELETE FROM user_media WHERE id = media_id;
    
    -- Note: Storage cleanup should be handled by the application
    -- as Supabase doesn't support direct storage operations in functions
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT ALL ON user_media TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_media(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_user_media(UUID) TO authenticated;

