import { PixabayImage, PixabayVideo, PixabayResponse } from './types';

const PIXABAY_API_KEY = '52174041-e42aca2c94c75b8db2f07d314';
const PIXABAY_BASE_URL = 'https://pixabay.com/api';

class PixabayAPI {
  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${PIXABAY_BASE_URL}${endpoint}`);
    
    // Ajouter la clé API
    url.searchParams.append('key', PIXABAY_API_KEY);
    
    // Ajouter les autres paramètres
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Pixabay API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async searchImages(query: string, page: number = 1, perPage: number = 20): Promise<PixabayResponse<PixabayImage>> {
    return this.makeRequest<PixabayResponse<PixabayImage>>('/', {
      q: query,
      image_type: 'photo',
      orientation: 'all',
      category: 'all',
      min_width: '0',
      min_height: '0',
      colors: 'all',
      editors_choice: 'false',
      safesearch: 'true',
      order: 'popular',
      page: page.toString(),
      per_page: perPage.toString(),
    });
  }

  async searchVideos(query: string, page: number = 1, perPage: number = 20): Promise<PixabayResponse<PixabayVideo>> {
    return this.makeRequest<PixabayResponse<PixabayVideo>>('/videos/', {
      q: query,
      video_type: 'all',
      category: 'all',
      min_width: '0',
      min_height: '0',
      editors_choice: 'false',
      safesearch: 'true',
      order: 'popular',
      page: page.toString(),
      per_page: perPage.toString(),
    });
  }

  async getPopularImages(page: number = 1, perPage: number = 20): Promise<PixabayResponse<PixabayImage>> {
    return this.makeRequest<PixabayResponse<PixabayImage>>('/', {
      image_type: 'photo',
      orientation: 'all',
      category: 'all',
      min_width: '0',
      min_height: '0',
      colors: 'all',
      editors_choice: 'false',
      safesearch: 'true',
      order: 'popular',
      page: page.toString(),
      per_page: perPage.toString(),
    });
  }

  async getPopularVideos(page: number = 1, perPage: number = 20): Promise<PixabayResponse<PixabayVideo>> {
    return this.makeRequest<PixabayResponse<PixabayVideo>>('/videos/', {
      video_type: 'all',
      category: 'all',
      min_width: '0',
      min_height: '0',
      editors_choice: 'false',
      safesearch: 'true',
      order: 'popular',
      page: page.toString(),
      per_page: perPage.toString(),
    });
  }
}

export const pixabayAPI = new PixabayAPI();
