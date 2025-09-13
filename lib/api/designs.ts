import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export interface Design {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  image_url: string;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  prompt?: string;
  model_used?: string;
  generation_params?: Record<string, any>;
  file_size?: number;
  file_format?: string;
  aspect_ratio?: string;
  resolution?: string;
  color_palette?: string[];
  style_tags?: string[];
  bucket_name?: string;
  storage_path?: string;
}

export interface CreateDesignData {
  title: string;
  description?: string;
  image_url: string;
  category: string;
  tags?: string[];
  is_public?: boolean;
  prompt?: string;
  model_used?: string;
  generation_params?: Record<string, any>;
  file_size?: number;
  file_format?: string;
  aspect_ratio?: string;
  resolution?: string;
  color_palette?: string[];
  style_tags?: string[];
  bucket_name?: string;
  storage_path?: string;
}

export interface UpdateDesignData {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  is_public?: boolean;
  color_palette?: string[];
  style_tags?: string[];
}

export interface DesignFilters {
  category?: string;
  search?: string;
  tags?: string[];
  is_public?: boolean;
  user_id?: string;
}

export interface DesignStats {
  total_designs: number;
  total_views: number;
  total_likes: number;
  category_counts: Record<string, number>;
}

/**
 * Fetch user's designs with optional filtering
 */
export async function getUserDesigns(
  user: User | null,
  filters: DesignFilters = {}
): Promise<{ data: Design[] | null; error: string | null }> {
  if (!user) {
    return { data: null, error: 'User not authenticated' };
  }

  try {
    let query = supabase
      .from('designs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.category && filters.category !== 'All') {
      query = query.eq('category', filters.category);
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    if (filters.is_public !== undefined) {
      query = query.eq('is_public', filters.is_public);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching user designs:', error);
      return { data: null, error: error.message };
    }

    return { data: data as Design[], error: null };
  } catch (error) {
    console.error('Error fetching user designs:', error);
    return { data: null, error: 'Failed to fetch designs' };
  }
}

/**
 * Fetch public designs with optional filtering
 */
export async function getPublicDesigns(
  filters: DesignFilters = {}
): Promise<{ data: Design[] | null; error: string | null }> {
  try {
    let query = supabase
      .from('designs')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.category && filters.category !== 'All') {
      query = query.eq('category', filters.category);
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching public designs:', error);
      return { data: null, error: error.message };
    }

    return { data: data as Design[], error: null };
  } catch (error) {
    console.error('Error fetching public designs:', error);
    return { data: null, error: 'Failed to fetch public designs' };
  }
}

/**
 * Create a new design
 */
export async function createDesign(
  user: User | null,
  designData: CreateDesignData
): Promise<{ data: Design | null; error: string | null }> {
  if (!user) {
    return { data: null, error: 'User not authenticated' };
  }

  try {
    const { data, error } = await supabase
      .from('designs')
      .insert([{
        user_id: user.id,
        ...designData,
        tags: designData.tags || [],
        color_palette: designData.color_palette || [],
        style_tags: designData.style_tags || [],
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating design:', error);
      return { data: null, error: error.message };
    }

    return { data: data as Design, error: null };
  } catch (error) {
    console.error('Error creating design:', error);
    return { data: null, error: 'Failed to create design' };
  }
}

/**
 * Update an existing design
 */
export async function updateDesign(
  user: User | null,
  designId: string,
  updateData: UpdateDesignData
): Promise<{ data: Design | null; error: string | null }> {
  if (!user) {
    return { data: null, error: 'User not authenticated' };
  }

  try {
    const { data, error } = await supabase
      .from('designs')
      .update(updateData)
      .eq('id', designId)
      .eq('user_id', user.id) // Ensure user can only update their own designs
      .select()
      .single();

    if (error) {
      console.error('Error updating design:', error);
      return { data: null, error: error.message };
    }

    return { data: data as Design, error: null };
  } catch (error) {
    console.error('Error updating design:', error);
    return { data: null, error: 'Failed to update design' };
  }
}

/**
 * Delete a design
 */
export async function deleteDesign(
  user: User | null,
  designId: string
): Promise<{ error: string | null }> {
  if (!user) {
    return { error: 'User not authenticated' };
  }

  try {
    const { error } = await supabase
      .from('designs')
      .delete()
      .eq('id', designId)
      .eq('user_id', user.id); // Ensure user can only delete their own designs

    if (error) {
      console.error('Error deleting design:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Error deleting design:', error);
    return { error: 'Failed to delete design' };
  }
}

/**
 * Increment view count for a design
 */
export async function incrementDesignViews(designId: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.rpc('increment_design_views', {
      design_id: designId
    });

    if (error) {
      console.error('Error incrementing design views:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Error incrementing design views:', error);
    return { error: 'Failed to increment views' };
  }
}

/**
 * Toggle like for a design
 */
export async function toggleDesignLike(
  user: User | null,
  designId: string
): Promise<{ data: { liked: boolean; likes: number } | null; error: string | null }> {
  if (!user) {
    return { data: null, error: 'User not authenticated' };
  }

  try {
    // First check if user has already liked this design
    const { data: existingLike, error: checkError } = await supabase
      .from('design_likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('design_id', designId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error checking existing like:', checkError);
      return { data: null, error: checkError.message };
    }

    const hasLiked = !!existingLike;

    if (hasLiked) {
      // Remove like
      const { error: deleteError } = await supabase
        .from('design_likes')
        .delete()
        .eq('user_id', user.id)
        .eq('design_id', designId);

      if (deleteError) {
        console.error('Error removing like:', deleteError);
        return { data: null, error: deleteError.message };
      }

      // Decrement likes count
      const { error: decrementError } = await supabase.rpc('decrement_design_likes', {
        design_id: designId
      });

      if (decrementError) {
        console.error('Error decrementing likes:', decrementError);
        return { data: null, error: decrementError.message };
      }
    } else {
      // Add like
      const { error: insertError } = await supabase
        .from('design_likes')
        .insert([{
          user_id: user.id,
          design_id: designId
        }]);

      if (insertError) {
        console.error('Error adding like:', insertError);
        return { data: null, error: insertError.message };
      }

      // Increment likes count
      const { error: incrementError } = await supabase.rpc('increment_design_likes', {
        design_id: designId
      });

      if (incrementError) {
        console.error('Error incrementing likes:', incrementError);
        return { data: null, error: incrementError.message };
      }
    }

    // Get updated likes count
    const { data: design, error: fetchError } = await supabase
      .from('designs')
      .select('likes')
      .eq('id', designId)
      .single();

    if (fetchError) {
      console.error('Error fetching updated likes:', fetchError);
      return { data: null, error: fetchError.message };
    }

    return { 
      data: { 
        liked: !hasLiked, 
        likes: design.likes 
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error toggling design like:', error);
    return { data: null, error: 'Failed to toggle like' };
  }
}

/**
 * Get design statistics for a user
 */
export async function getDesignStats(
  user: User | null
): Promise<{ data: DesignStats | null; error: string | null }> {
  if (!user) {
    return { data: null, error: 'User not authenticated' };
  }

  try {
    const { data, error } = await supabase
      .from('designs')
      .select('category, views, likes')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching design stats:', error);
      return { data: null, error: error.message };
    }

    const stats: DesignStats = {
      total_designs: data.length,
      total_views: data.reduce((sum, design) => sum + design.views, 0),
      total_likes: data.reduce((sum, design) => sum + design.likes, 0),
      category_counts: data.reduce((acc, design) => {
        acc[design.category] = (acc[design.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error calculating design stats:', error);
    return { data: null, error: 'Failed to calculate stats' };
  }
}

/**
 * Get available categories from existing designs
 */
export async function getAvailableCategories(): Promise<{ data: string[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('designs')
      .select('category')
      .eq('is_public', true);

    if (error) {
      console.error('Error fetching categories:', error);
      return { data: null, error: error.message };
    }

    const categories = [...new Set(data.map(design => design.category))].sort();
    return { data: categories, error: null };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { data: null, error: 'Failed to fetch categories' };
  }
}
