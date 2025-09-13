import { UnsplashPhoto } from './types';

const UNSPLASH_ACCESS_KEY = 'QNEtl3I0Zeot4qn0O-02zXPa_hk__Vyvhu8ceQ48TCw';
const UNSPLASH_BASE_URL = 'https://api.unsplash.com';

class UnsplashAPI {
  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${UNSPLASH_BASE_URL}${endpoint}`);
    
    // Ajouter la clé d'accès
    url.searchParams.append('client_id', UNSPLASH_ACCESS_KEY);
    
    // Ajouter les autres paramètres
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    console.log('Unsplash API Request:', url.toString());

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'Accept-Version': 'v1',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Unsplash API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: url.toString(),
        error: errorText,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error(`Unsplash API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  async searchPhotos(query: string, page: number = 1, perPage: number = 20): Promise<UnsplashPhoto[]> {
    const response = await this.makeRequest<{ results: UnsplashPhoto[] }>('/search/photos', {
      query,
      page: page.toString(),
      per_page: perPage.toString(),
      orientation: 'all',
    });
    return response.results;
  }

  async getCuratedPhotos(page: number = 1, perPage: number = 20): Promise<UnsplashPhoto[]> {
    const response = await this.makeRequest<UnsplashPhoto[]>('/photos/curated', {
      page: page.toString(),
      per_page: perPage.toString(),
    });
    return response;
  }

  async getRandomPhotos(count: number = 20, query?: string): Promise<UnsplashPhoto[]> {
    const params: Record<string, string> = {
      count: count.toString(),
    };
    
    if (query) {
      params.query = query;
    }

    const response = await this.makeRequest<UnsplashPhoto[]>('/photos/random', params);
    return Array.isArray(response) ? response : [response];
  }

  // Méthode de test pour vérifier la connectivité
  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/photos/random', { count: '1' });
      return true;
    } catch (error) {
      console.error('Unsplash API connection test failed:', error);
      return false;
    }
  }
}

export const unsplashAPI = new UnsplashAPI();
