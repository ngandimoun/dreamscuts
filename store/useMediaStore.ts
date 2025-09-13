import { create } from 'zustand';
import { MediaItem } from '@/components/chat/mediaTypes';
import { loadUserMedia } from '@/lib/api/userMedia';
import { getUserDesigns, type Design } from '@/lib/api/designs';
import { User } from '@supabase/supabase-js';

// Helper function to convert Design to MediaItem
const designToMediaItem = (design: Design): MediaItem => ({
  id: design.id,
  name: design.title,
  type: 'image', // Designs are typically images
  url: design.image_url,
  thumbnail: design.image_url,
  uploadedAt: new Date(design.created_at),
  isGenerated: true,
  source: 'user-design',
  category: design.category,
  description: design.description,
  tags: design.tags,
});

interface MediaStore {
  uploadedMedia: MediaItem[];
  generatedMedia: MediaItem[];
  isLoadingMedia: boolean;
  addUploadedMedia: (media: MediaItem) => void;
  addGeneratedMedia: (media: MediaItem) => void;
  updateUploadedMedia: (mediaId: string, updates: Partial<MediaItem>) => void;
  removeUploadedMedia: (mediaId: string) => void;
  removeGeneratedMedia: (mediaId: string) => void;
  clearAllMedia: () => void;
  loadUserMediaFromDatabase: (userId: string) => Promise<void>;
  loadUserDesignsFromDatabase: (user: User) => Promise<void>;
  setUploadedMedia: (media: MediaItem[]) => void;
  setGeneratedMedia: (media: MediaItem[]) => void;
}

export const useMediaStore = create<MediaStore>((set, get) => ({
  uploadedMedia: [],
  isLoadingMedia: false,
  generatedMedia: [],
  
  addUploadedMedia: (media) =>
    set((state) => ({
      uploadedMedia: [media, ...state.uploadedMedia],
    })),
    
  addGeneratedMedia: (media) =>
    set((state) => ({
      generatedMedia: [media, ...state.generatedMedia],
    })),
    
  updateUploadedMedia: (mediaId, updates) =>
    set((state) => ({
      uploadedMedia: state.uploadedMedia.map((media) =>
        media.id === mediaId ? { ...media, ...updates } : media
      ),
    })),
    
  removeUploadedMedia: (mediaId) =>
    set((state) => ({
      uploadedMedia: state.uploadedMedia.filter((media) => media.id !== mediaId),
    })),
    
  removeGeneratedMedia: (mediaId) =>
    set((state) => ({
      generatedMedia: state.generatedMedia.filter((media) => media.id !== mediaId),
    })),
    
  clearAllMedia: () =>
    set({
      uploadedMedia: [],
      generatedMedia: [],
    }),
    
  setUploadedMedia: (media) =>
    set({ uploadedMedia: media }),
    
  setGeneratedMedia: (media) =>
    set({ generatedMedia: media }),
    
  loadUserMediaFromDatabase: async (userId) => {
    set({ isLoadingMedia: true });
    try {
      const result = await loadUserMedia(userId);
      if (result.success && result.media) {
        set({ uploadedMedia: result.media });
      } else {
        console.error('Failed to load user media:', result.error);
        // Keep existing media on error
      }
    } catch (error) {
      console.error('Error loading user media:', error);
    } finally {
      set({ isLoadingMedia: false });
    }
  },
  
  loadUserDesignsFromDatabase: async (user) => {
    set({ isLoadingMedia: true });
    try {
      const { data: designs, error } = await getUserDesigns(user);
      if (error) {
        console.error('Failed to load user designs:', error);
        // Keep existing designs on error
      } else if (designs) {
        const mediaItems = designs.map(designToMediaItem);
        set({ generatedMedia: mediaItems });
      }
    } catch (error) {
      console.error('Error loading user designs:', error);
    } finally {
      set({ isLoadingMedia: false });
    }
  },
}));
