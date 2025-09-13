import { supabase } from '@/lib/supabase/client';
import { saveUserMedia, CreateUserMediaData } from '@/lib/api/userMedia';

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
  mediaId?: string; // Database ID of the saved media record
}

/**
 * Upload a file to Supabase storage
 */
export async function uploadToStorage(
  file: File | Blob,
  bucketName: string,
  path: string,
  options?: {
    cacheControl?: string;
    contentType?: string;
    upsert?: boolean;
  }
): Promise<UploadResult> {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        cacheControl: options?.cacheControl || '3600',
        upsert: options?.upsert || false,
        contentType: options?.contentType || file.type,
      });

    if (error) {
      console.error('Storage upload error:', error);
      return { success: false, error: error.message };
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error('Storage upload error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Upload failed' 
    };
  }
}

/**
 * Upload a design image to the dreamcut-result bucket
 */
export async function uploadDesignImage(
  file: File | Blob,
  userId: string,
  designId?: string
): Promise<UploadResult> {
  const timestamp = Date.now();
  const fileName = designId || `design_${timestamp}`;
  const fileExtension = file instanceof File ? file.name.split('.').pop() : 'png';
  const path = `users/${userId}/designs/${fileName}.${fileExtension}`;

  return uploadToStorage(file, 'dreamcut-result', path, {
    contentType: file instanceof File ? file.type : 'image/png',
    upsert: true,
  });
}

/**
 * Upload user media files to Supabase storage with file size validation
 */
export async function uploadUserMedia(
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  // File size validation (100MB limit)
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: `File size exceeds 100MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
    };
  }

  // Generate unique filename with timestamp
  const timestamp = Date.now();
  const fileExtension = file.name.split('.').pop() || 'bin';
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${timestamp}_${sanitizedFileName}`;
  const path = `users/${userId}/uploads/${fileName}`;

  try {
    // Simulate progress for better UX (Supabase doesn't provide real progress)
    if (onProgress) {
      onProgress(10);
      await new Promise(resolve => setTimeout(resolve, 100));
      onProgress(50);
    }

    const result = await uploadToStorage(file, 'dreamcut-assets', path, {
      contentType: file.type,
      upsert: false,
    });

    if (onProgress && result.success) {
      onProgress(100);
    }

    // If upload was successful, save metadata to database
    if (result.success && result.url && result.path) {
      const mediaData: CreateUserMediaData = {
        name: file.name,
        type: getFileTypeFromMime(file.type),
        url: result.url,
        thumbnail: result.url, // Use the same URL for thumbnail initially
        file_size: file.size,
        mime_type: file.type,
        supabase_path: result.path,
        supabase_bucket: 'dreamcut-assets',
      };

      const saveResult = await saveUserMedia(userId, mediaData);
      if (saveResult.success && saveResult.mediaId) {
        result.mediaId = saveResult.mediaId;
      } else {
        console.error('Failed to save media metadata:', saveResult.error);
        // Don't fail the upload, but log the error
      }
    }

    return result;
  } catch (error) {
    console.error('User media upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

/**
 * Get file type from MIME type
 */
export function getFileTypeFromMime(mimeType: string): 'image' | 'video' | 'document' | 'audio' {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'document';
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Delete a file from Supabase storage
 */
export async function deleteFromStorage(
  bucketName: string,
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([path]);

    if (error) {
      console.error('Storage delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Storage delete error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Delete failed' 
    };
  }
}

/**
 * Get a signed URL for private file access
 */
export async function getSignedUrl(
  bucketName: string,
  path: string,
  expiresIn: number = 3600
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error('Signed URL error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, url: data.signedUrl };
  } catch (error) {
    console.error('Signed URL error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get signed URL' 
    };
  }
}

/**
 * List files in a storage bucket
 */
export async function listStorageFiles(
  bucketName: string,
  path?: string
): Promise<{ success: boolean; files?: any[]; error?: string }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(path);

    if (error) {
      console.error('List files error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, files: data };
  } catch (error) {
    console.error('List files error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to list files' 
    };
  }
}

/**
 * Get storage bucket info
 */
export async function getBucketInfo(bucketName: string) {
  try {
    const { data, error } = await supabase.storage.getBucket(bucketName);
    
    if (error) {
      console.error('Get bucket info error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, bucket: data };
  } catch (error) {
    console.error('Get bucket info error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get bucket info' 
    };
  }
}
