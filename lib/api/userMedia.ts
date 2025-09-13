import { supabase } from '@/lib/supabase/client';
import { MediaItem } from '@/components/chat/mediaTypes';

export interface UserMediaRecord {
  id: string;
  user_id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  thumbnail?: string;
  file_size?: number;
  mime_type?: string;
  supabase_path: string;
  supabase_bucket: string;
  created_at: string;
  updated_at: string;
  width?: number;
  height?: number;
  duration?: number;
  description?: string;
}

export interface CreateUserMediaData {
  name: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  thumbnail?: string;
  file_size?: number;
  mime_type?: string;
  supabase_path: string;
  supabase_bucket?: string;
  width?: number;
  height?: number;
  duration?: number;
  description?: string;
}

/**
 * Save user media metadata to database after successful upload
 */
export async function saveUserMedia(
  userId: string,
  mediaData: CreateUserMediaData
): Promise<{ success: boolean; error?: string; mediaId?: string }> {
  try {
    const { data, error } = await supabase
      .from('user_media')
      .insert({
        user_id: userId,
        name: mediaData.name,
        type: mediaData.type,
        url: mediaData.url,
        thumbnail: mediaData.thumbnail,
        file_size: mediaData.file_size,
        mime_type: mediaData.mime_type,
        supabase_path: mediaData.supabase_path,
        supabase_bucket: mediaData.supabase_bucket || 'dreamcut-assets',
        width: mediaData.width,
        height: mediaData.height,
        duration: mediaData.duration,
        description: mediaData.description,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving user media:', error);
      return { success: false, error: error.message };
    }

    return { success: true, mediaId: data.id };
  } catch (error) {
    console.error('Error saving user media:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save media metadata'
    };
  }
}

/**
 * Load user's media files from database
 */
export async function loadUserMedia(userId: string): Promise<{ success: boolean; media?: MediaItem[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('user_media')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading user media:', error);
      return { success: false, error: error.message };
    }

    // Convert database records to MediaItem format
    const mediaItems: MediaItem[] = data.map((record: UserMediaRecord) => ({
      id: record.id,
      name: record.name,
      type: record.type,
      url: record.url,
      thumbnail: record.thumbnail,
      uploadedAt: new Date(record.created_at),
      fileSize: record.file_size,
      mimeType: record.mime_type,
      supabasePath: record.supabase_path,
      supabaseBucket: record.supabase_bucket,
      width: record.width,
      height: record.height,
      duration: record.duration,
      description: record.description,
    }));

    return { success: true, media: mediaItems };
  } catch (error) {
    console.error('Error loading user media:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load media'
    };
  }
}

/**
 * Delete user media from database and storage
 */
export async function deleteUserMedia(
  mediaId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // First get the media record to get storage path
    const { data: mediaRecord, error: fetchError } = await supabase
      .from('user_media')
      .select('supabase_path, supabase_bucket')
      .eq('id', mediaId)
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching media record:', fetchError);
      return { success: false, error: fetchError.message };
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('user_media')
      .delete()
      .eq('id', mediaId)
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting media from database:', deleteError);
      return { success: false, error: deleteError.message };
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(mediaRecord.supabase_bucket)
      .remove([mediaRecord.supabase_path]);

    if (storageError) {
      console.error('Error deleting media from storage:', storageError);
      // Don't return error here as the database record is already deleted
      // The file will be orphaned but that's better than inconsistent state
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting user media:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete media'
    };
  }
}

/**
 * Update user media metadata
 */
export async function updateUserMedia(
  mediaId: string,
  userId: string,
  updates: Partial<CreateUserMediaData>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('user_media')
      .update(updates)
      .eq('id', mediaId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating user media:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating user media:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update media'
    };
  }
}

