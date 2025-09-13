// Version de fallback pour Unsplash en cas de problème avec l'API
import { UnsplashPhoto } from './types';

// Données de fallback pour éviter les erreurs
const FALLBACK_PHOTOS: UnsplashPhoto[] = [
  {
    id: "fallback-1",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    promoted_at: null,
    width: 1920,
    height: 1080,
    color: "#6366f1",
    blur_hash: "L6PZfSi_.AyE_3t7t7R**0o#DgRj",
    description: "Beautiful landscape",
    alt_description: "A beautiful landscape photo",
    urls: {
      raw: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      full: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      regular: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
      small: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      thumb: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
    },
    links: {
      self: "https://api.unsplash.com/photos/fallback-1",
      html: "https://unsplash.com/photos/fallback-1",
      download: "https://unsplash.com/photos/fallback-1/download",
      download_location: "https://api.unsplash.com/photos/fallback-1/download"
    },
    user: {
      id: "fallback-user",
      updated_at: "2023-01-01T00:00:00Z",
      username: "fallback",
      name: "Fallback User",
      first_name: "Fallback",
      last_name: "User",
      twitter_username: null,
      portfolio_url: null,
      bio: null,
      location: null,
      links: {
        self: "https://api.unsplash.com/users/fallback",
        html: "https://unsplash.com/@fallback",
        photos: "https://api.unsplash.com/users/fallback/photos",
        likes: "https://api.unsplash.com/users/fallback/likes",
        portfolio: "https://api.unsplash.com/users/fallback/portfolio"
      },
      profile_image: {
        small: "https://images.unsplash.com/profile-1446404465118-3a53b909cc82?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32&s=a2f8c40e39b8dfee1534eb32acfa6bc7",
        medium: "https://images.unsplash.com/profile-1446404465118-3a53b909cc82?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64&s=3ef46b07bb19f68322d027cb8f9ac99f",
        large: "https://images.unsplash.com/profile-1446404465118-3a53b909cc82?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128&s=27a346c2362207494baa7b76f5d606e5"
      },
      total_collections: 0,
      instagram_username: null,
      total_likes: 0,
      total_photos: 1,
      accepted_tos: true,
      for_hire: false,
      social: {
        instagram_username: null,
        portfolio_url: null,
        twitter_username: null,
        paypal_email: null
      }
    },
    tags: [
      { type: "search", title: "landscape" },
      { type: "search", title: "nature" }
    ]
  }
];

class UnsplashFallbackAPI {
  async searchPhotos(query: string, page: number = 1, perPage: number = 20): Promise<UnsplashPhoto[]> {
    console.log('Using Unsplash fallback API for search:', query);
    // Retourner des données de fallback
    return FALLBACK_PHOTOS.slice(0, Math.min(perPage, FALLBACK_PHOTOS.length));
  }

  async getCuratedPhotos(page: number = 1, perPage: number = 20): Promise<UnsplashPhoto[]> {
    console.log('Using Unsplash fallback API for curated photos');
    return FALLBACK_PHOTOS.slice(0, Math.min(perPage, FALLBACK_PHOTOS.length));
  }

  async getRandomPhotos(count: number = 20, query?: string): Promise<UnsplashPhoto[]> {
    console.log('Using Unsplash fallback API for random photos');
    return FALLBACK_PHOTOS.slice(0, Math.min(count, FALLBACK_PHOTOS.length));
  }

  async testConnection(): Promise<boolean> {
    return true; // Le fallback fonctionne toujours
  }
}

export const unsplashFallbackAPI = new UnsplashFallbackAPI();
