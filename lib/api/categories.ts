// Types pour les catégories
export interface MediaCategory {
  id: string;
  name: string;
  query: string;
  icon?: string;
}

export interface TemplateSubMenu {
  id: 'images' | 'videos' | 'sounds';
  name: string;
  icon: string;
  categories: MediaCategory[];
}

// Catégories pour les images
export const imageCategories: MediaCategory[] = [
  { id: 'nature', name: 'Nature', query: 'nature landscape forest mountain' },
  { id: 'business', name: 'Business', query: 'business office corporate professional' },
  { id: 'technology', name: 'Technology', query: 'technology computer digital innovation' },
  { id: 'people', name: 'People', query: 'people portrait human face' },
  { id: 'abstract', name: 'Abstract', query: 'abstract geometric pattern design' },
  { id: 'food', name: 'Food', query: 'food restaurant cooking meal' },
  { id: 'travel', name: 'Travel', query: 'travel vacation destination city' },
  { id: 'health', name: 'Health', query: 'health medical fitness wellness' },
  { id: 'education', name: 'Education', query: 'education school learning student' },
  { id: 'art', name: 'Art', query: 'art creative artistic painting' },
  { id: 'sports', name: 'Sports', query: 'sports fitness exercise athlete' },
  { id: 'architecture', name: 'Architecture', query: 'architecture building construction design' },
];

// Catégories pour les vidéos
export const videoCategories: MediaCategory[] = [
  { id: 'nature', name: 'Nature', query: 'nature landscape forest mountain' },
  { id: 'business', name: 'Business', query: 'business office corporate professional' },
  { id: 'technology', name: 'Technology', query: 'technology computer digital innovation' },
  { id: 'people', name: 'People', query: 'people portrait human face' },
  { id: 'abstract', name: 'Abstract', query: 'abstract geometric pattern design' },
  { id: 'food', name: 'Food', query: 'food restaurant cooking meal' },
  { id: 'travel', name: 'Travel', query: 'travel vacation destination city' },
  { id: 'health', name: 'Health', query: 'health medical fitness wellness' },
  { id: 'education', name: 'Education', query: 'education school learning student' },
  { id: 'art', name: 'Art', query: 'art creative artistic painting' },
  { id: 'sports', name: 'Sports', query: 'sports fitness exercise athlete' },
  { id: 'architecture', name: 'Architecture', query: 'architecture building construction design' },
];

// Catégories pour les sons
export const soundCategories: MediaCategory[] = [
  { id: 'ambient', name: 'Ambient', query: 'ambient atmosphere background' },
  { id: 'music', name: 'Music', query: 'music melody tune instrumental' },
  { id: 'nature', name: 'Nature', query: 'nature birds wind rain ocean' },
  { id: 'urban', name: 'Urban', query: 'urban city traffic street' },
  { id: 'mechanical', name: 'Mechanical', query: 'mechanical machine engine motor' },
  { id: 'human', name: 'Human', query: 'human voice speech conversation' },
  { id: 'animal', name: 'Animal', query: 'animal pet dog cat bird' },
  { id: 'transport', name: 'Transport', query: 'transport vehicle car plane train' },
  { id: 'notification', name: 'Notification', query: 'notification alert bell chime' },
  { id: 'interface', name: 'Interface', query: 'interface ui sound effect click' },
  { id: 'emotion', name: 'Emotion', query: 'emotion happy sad dramatic' },
  { id: 'abstract', name: 'Abstract', query: 'abstract synthetic electronic' },
];

// Configuration des sous-menus
export const templateSubMenus: TemplateSubMenu[] = [
  {
    id: 'images',
    name: 'Images',
    icon: '🖼️',
    categories: imageCategories,
  },
  {
    id: 'videos',
    name: 'Videos',
    icon: '🎥',
    categories: videoCategories,
  },
  {
    id: 'sounds',
    name: 'Sounds',
    icon: '🔊',
    categories: soundCategories,
  },
];
