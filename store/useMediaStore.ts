import { create } from 'zustand';
import { MediaItem } from '@/components/chat/mediaTypes';

interface MediaStore {
  uploadedMedia: MediaItem[];
  generatedMedia: MediaItem[];
  addUploadedMedia: (media: MediaItem) => void;
  addGeneratedMedia: (media: MediaItem) => void;
  removeUploadedMedia: (mediaId: string) => void;
  removeGeneratedMedia: (mediaId: string) => void;
  clearAllMedia: () => void;
}

export const useMediaStore = create<MediaStore>((set) => ({
  uploadedMedia: [
    {
      id: '1',
      name: 'Nickel-OIL Logo (White Background)',
      type: 'image',
      url: '/placeholder-logo.png',
      thumbnail: '/placeholder-logo.png',
      uploadedAt: new Date(),
    },
    {
      id: '2',
      name: 'Bar Chart - Competitive Analysis',
      type: 'image',
      url: '/placeholder.jpg',
      thumbnail: '/placeholder.jpg',
      uploadedAt: new Date(),
    },
    {
      id: '3',
      name: 'Kunai Weapon',
      type: 'image',
      url: '/placeholder.svg',
      thumbnail: '/placeholder.svg',
      uploadedAt: new Date(),
    },
    {
      id: '4',
      name: 'Anime Character - Minato',
      type: 'image',
      url: '/placeholder-user.jpg',
      thumbnail: '/placeholder-user.jpg',
      uploadedAt: new Date(),
    },
  ],
  generatedMedia: [
    {
      id: 'g1',
      name: 'AI Generated Logo',
      type: 'image',
      url: '/placeholder-logo.svg',
      thumbnail: '/placeholder-logo.svg',
      uploadedAt: new Date(),
      isGenerated: true,
    },
    {
      id: 'g2',
      name: 'AI Generated Illustration',
      type: 'image',
      url: '/placeholder.jpg',
      thumbnail: '/placeholder.jpg',
      uploadedAt: new Date(),
      isGenerated: true,
    },
  ],
  
  addUploadedMedia: (media) =>
    set((state) => ({
      uploadedMedia: [media, ...state.uploadedMedia],
    })),
    
  addGeneratedMedia: (media) =>
    set((state) => ({
      generatedMedia: [media, ...state.generatedMedia],
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
}));
