import { createDesign, type CreateDesignData } from '@/lib/api/designs';
import { uploadDesignImage } from '@/lib/utils/storage';
import { User } from '@supabase/supabase-js';

export interface SaveDesignOptions {
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  tags?: string[];
  prompt?: string;
  modelUsed?: string;
  generationParams?: Record<string, any>;
  fileSize?: number;
  fileFormat?: string;
  aspectRatio?: string;
  resolution?: string;
  colorPalette?: string[];
  styleTags?: string[];
  imageFile?: File | Blob; // Optional file for upload to storage
}

/**
 * Save a generated design to the user's collection
 */
export async function saveDesignToCollection(
  user: User | null,
  options: SaveDesignOptions
): Promise<{ success: boolean; error?: string; designId?: string }> {
  if (!user) {
    return { success: false, error: 'User must be logged in to save designs' };
  }

  try {
    // If we have a file, upload it to storage first
    let finalImageUrl = options.imageUrl;
    let storagePath = '';
    
    if (options.imageFile) {
      const uploadResult = await uploadDesignImage(options.imageFile, user.id);
      if (uploadResult.success && uploadResult.url) {
        finalImageUrl = uploadResult.url;
        storagePath = uploadResult.path || '';
      } else {
        console.warn('Failed to upload image to storage, using original URL:', uploadResult.error);
      }
    }

    const designData: CreateDesignData = {
      title: options.title,
      description: options.description,
      image_url: finalImageUrl,
      category: options.category,
      tags: options.tags || [],
      is_public: false, // Default to private
      prompt: options.prompt,
      model_used: options.modelUsed,
      generation_params: options.generationParams,
      file_size: options.fileSize,
      file_format: options.fileFormat,
      aspect_ratio: options.aspectRatio,
      resolution: options.resolution,
      color_palette: options.colorPalette || [],
      style_tags: options.styleTags || [],
      bucket_name: 'dreamcut-result',
      storage_path: storagePath,
    };

    const { data, error } = await createDesign(user, designData);

    if (error) {
      console.error('Error saving design:', error);
      return { success: false, error };
    }

    return { success: true, designId: data?.id };
  } catch (error) {
    console.error('Error saving design:', error);
    return { success: false, error: 'Failed to save design' };
  }
}

/**
 * Generate a title from the prompt if not provided
 */
export function generateTitleFromPrompt(prompt: string): string {
  // Clean up the prompt and create a title
  const words = prompt.trim().split(' ').slice(0, 6); // Take first 6 words
  const title = words.join(' ').replace(/[^\w\s]/g, ''); // Remove special characters
  return title.charAt(0).toUpperCase() + title.slice(1);
}

/**
 * Extract tags from prompt
 */
export function extractTagsFromPrompt(prompt: string): string[] {
  const commonTags = [
    'logo', 'website', 'mobile', 'branding', 'social media', 'print',
    'minimalist', 'modern', 'vintage', 'colorful', 'monochrome',
    'tech', 'fashion', 'food', 'travel', 'business', 'creative',
    'artistic', 'professional', 'casual', 'elegant', 'bold'
  ];

  const promptLower = prompt.toLowerCase();
  const foundTags = commonTags.filter(tag => promptLower.includes(tag));
  
  // Add some generic tags based on content
  if (promptLower.includes('logo')) foundTags.push('branding');
  if (promptLower.includes('website') || promptLower.includes('web')) foundTags.push('digital');
  if (promptLower.includes('mobile') || promptLower.includes('app')) foundTags.push('mobile');
  if (promptLower.includes('social') || promptLower.includes('instagram')) foundTags.push('social media');
  
  return [...new Set(foundTags)]; // Remove duplicates
}

/**
 * Determine category from prompt
 */
export function determineCategoryFromPrompt(prompt: string): string {
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes('logo') || promptLower.includes('brand')) return 'Logo';
  if (promptLower.includes('website') || promptLower.includes('web')) return 'Website';
  if (promptLower.includes('mobile') || promptLower.includes('app')) return 'Mobile';
  if (promptLower.includes('social') || promptLower.includes('instagram') || promptLower.includes('facebook')) return 'Social Media';
  if (promptLower.includes('print') || promptLower.includes('poster') || promptLower.includes('flyer')) return 'Print';
  if (promptLower.includes('brand') || promptLower.includes('identity')) return 'Branding';
  
  return 'General';
}
