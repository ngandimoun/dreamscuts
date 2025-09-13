export interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  thumbnail?: string;
  uploadedAt: Date;
  isGenerated?: boolean;
  source?: 'pexels' | 'pixabay' | 'unsplash' | 'freesound' | 'user-design';
  originalData?: any;
  width?: number;
  height?: number;
  description?: string;
  // Design-specific properties
  category?: string;
  tags?: string[];
  // Propriétés spécifiques aux sons
  duration?: number;
  artist?: string;
  downloads?: number;
  rating?: number;
  comments?: number;
  hasLocation?: boolean;
  // Supabase storage properties
  supabasePath?: string;
  supabaseBucket?: string;
  fileSize?: number;
  mimeType?: string;
  isUploading?: boolean;
  uploadProgress?: number;
  uploadError?: string;
}
