export interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  thumbnail?: string;
  uploadedAt: Date;
  isGenerated?: boolean;
  source?: 'pexels' | 'pixabay' | 'unsplash' | 'freesound';
  originalData?: any;
  width?: number;
  height?: number;
  description?: string;
  // Propriétés spécifiques aux sons
  duration?: number;
  artist?: string;
  downloads?: number;
  rating?: number;
  comments?: number;
  hasLocation?: boolean;
}
