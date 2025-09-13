// Types pour les APIs de médias

export interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail: string;
  uploadedAt: Date;
  isGenerated?: boolean;
  source?: 'pexels' | 'pixabay' | 'unsplash' | 'freesound';
  originalData?: any;
}

// Types Pexels
export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  full_res: string | null;
  tags: string[];
  duration: number;
  user: {
    id: number;
    name: string;
    url: string;
  };
  video_files: Array<{
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    fps: number;
    link: string;
  }>;
  video_pictures: Array<{
    id: number;
    picture: string;
    nr: number;
  }>;
}

export interface PexelsResponse<T> {
  page: number;
  per_page: number;
  photos?: T[];
  videos?: T[];
  total_results: number;
  next_page: string;
}

// Types Pixabay
export interface PixabayImage {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  previewWidth: number;
  previewHeight: number;
  webformatURL: string;
  webformatWidth: number;
  webformatHeight: number;
  largeImageURL: string;
  fullHDURL: string;
  imageURL: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  views: number;
  downloads: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  userImageURL: string;
}

export interface PixabayVideo {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  duration: number;
  videos: {
    large: {
      url: string;
      width: number;
      height: number;
      size: number;
      thumbnail: string;
    };
    medium: {
      url: string;
      width: number;
      height: number;
      size: number;
      thumbnail: string;
    };
    small: {
      url: string;
      width: number;
      height: number;
      size: number;
      thumbnail: string;
    };
    tiny: {
      url: string;
      width: number;
      height: number;
      size: number;
      thumbnail: string;
    };
  };
  views: number;
  downloads: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  userImageURL: string;
}

export interface PixabayResponse<T> {
  total: number;
  totalHits: number;
  hits: T[];
}

// Types Unsplash
export interface UnsplashPhoto {
  id: string;
  created_at: string;
  updated_at: string;
  promoted_at: string | null;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  links: {
    self: string;
    html: string;
    download: string;
    download_location: string;
  };
  user: {
    id: string;
    updated_at: string;
    username: string;
    name: string;
    first_name: string;
    last_name: string | null;
    twitter_username: string | null;
    portfolio_url: string | null;
    bio: string | null;
    location: string | null;
    links: {
      self: string;
      html: string;
      photos: string;
      likes: string;
      portfolio: string;
      following: string;
      followers: string;
    };
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
    instagram_username: string | null;
    total_collections: number;
    total_likes: number;
    total_photos: number;
    accepted_tos: boolean;
    for_hire: boolean;
    social: {
      instagram_username: string | null;
      portfolio_url: string | null;
      twitter_username: string | null;
      paypal_email: string | null;
    };
  };
  tags: Array<{
    type: string;
    title: string;
  }>;
}

// Types Freesound
export interface FreesoundSound {
  id: number;
  url: string;
  name: string;
  tags: string[];
  description: string;
  type: string;
  duration: number;
  filesize: number;
  bitrate: number;
  bitdepth: number;
  samplerate: number;
  channels: number;
  license: string;
  username: string;
  pack: string | null;
  pack_name: string | null;
  download: string;
  bookmark: string;
  previews: {
    'preview-hq-mp3': string;
    'preview-hq-ogg': string;
    'preview-lq-mp3': string;
    'preview-lq-ogg': string;
  };
  images: {
    waveform_m: string;
    waveform_l: string;
    spectral_m: string;
    spectral_l: string;
  };
  num_downloads: number;
  avg_rating: number;
  num_ratings: number;
  created: string;
  modified: string;
  num_comments: number;
  comment: string;
  original_filename: string;
  filesize_approx: number;
}

export interface FreesoundResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: FreesoundSound[];
}

