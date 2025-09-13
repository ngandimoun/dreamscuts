-- Additional database functions for designs
-- This file contains SQL functions for likes, views, and other design operations

-- Create design_likes table for tracking user likes
CREATE TABLE IF NOT EXISTS design_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  design_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, design_id)
);

-- Create indexes for design_likes
CREATE INDEX IF NOT EXISTS idx_design_likes_user_id ON design_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_design_likes_design_id ON design_likes(design_id);

-- Enable RLS for design_likes
ALTER TABLE design_likes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for design_likes
CREATE POLICY "Users can view all design likes" ON design_likes
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own likes" ON design_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON design_likes
    FOR DELETE USING (auth.uid() = user_id);

-- Function to increment design views
CREATE OR REPLACE FUNCTION increment_design_views(design_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE designs 
    SET views = views + 1 
    WHERE id = design_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment design likes
CREATE OR REPLACE FUNCTION increment_design_likes(design_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE designs 
    SET likes = likes + 1 
    WHERE id = design_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement design likes
CREATE OR REPLACE FUNCTION decrement_design_likes(design_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE designs 
    SET likes = GREATEST(likes - 1, 0) 
    WHERE id = design_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's liked designs
CREATE OR REPLACE FUNCTION get_user_liked_designs(user_id UUID)
RETURNS TABLE (
    design_id UUID,
    liked_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT dl.design_id, dl.created_at
    FROM design_likes dl
    WHERE dl.user_id = get_user_liked_designs.user_id
    ORDER BY dl.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has liked a design
CREATE OR REPLACE FUNCTION has_user_liked_design(user_id UUID, design_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM design_likes 
        WHERE design_likes.user_id = has_user_liked_design.user_id 
        AND design_likes.design_id = has_user_liked_design.design_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get design with like status for a user
CREATE OR REPLACE FUNCTION get_design_with_like_status(
    design_id UUID, 
    user_id UUID DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    title VARCHAR,
    description TEXT,
    image_url TEXT,
    category VARCHAR,
    tags TEXT[],
    views INTEGER,
    likes INTEGER,
    is_public BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    prompt TEXT,
    model_used VARCHAR,
    generation_params JSONB,
    file_size INTEGER,
    file_format VARCHAR,
    aspect_ratio VARCHAR,
    resolution VARCHAR,
    color_palette TEXT[],
    style_tags TEXT[],
    is_liked BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.*,
        CASE 
            WHEN get_design_with_like_status.user_id IS NULL THEN false
            ELSE has_user_liked_design(get_design_with_like_status.user_id, d.id)
        END as is_liked
    FROM designs d
    WHERE d.id = get_design_with_like_status.design_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get designs with like status for a user
CREATE OR REPLACE FUNCTION get_designs_with_like_status(
    user_id UUID DEFAULT NULL,
    limit_count INTEGER DEFAULT 50,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    title VARCHAR,
    description TEXT,
    image_url TEXT,
    category VARCHAR,
    tags TEXT[],
    views INTEGER,
    likes INTEGER,
    is_public BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    prompt TEXT,
    model_used VARCHAR,
    generation_params JSONB,
    file_size INTEGER,
    file_format VARCHAR,
    aspect_ratio VARCHAR,
    resolution VARCHAR,
    color_palette TEXT[],
    style_tags TEXT[],
    is_liked BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.*,
        CASE 
            WHEN get_designs_with_like_status.user_id IS NULL THEN false
            ELSE has_user_liked_design(get_designs_with_like_status.user_id, d.id)
        END as is_liked
    FROM designs d
    WHERE d.is_public = true
    ORDER BY d.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION increment_design_views(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_design_likes(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_design_likes(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_liked_designs(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION has_user_liked_design(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_design_with_like_status(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_designs_with_like_status(UUID, INTEGER, INTEGER) TO authenticated;
