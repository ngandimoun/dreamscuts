import { PexelsPhoto, PexelsVideo, PexelsResponse } from './types';

const PEXELS_API_KEY = 'DeI1tUe77tinbWsJ9MDAIoGUe9pCJZK592LkghzjENl1pXf9wJm7QBZP';
const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

class PexelsAPI {
  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${PEXELS_BASE_URL}${endpoint}`);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': PEXELS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async searchPhotos(query: string, page: number = 1, perPage: number = 20): Promise<PexelsResponse<PexelsPhoto>> {
    return this.makeRequest<PexelsResponse<PexelsPhoto>>('/search', {
      query,
      page: page.toString(),
      per_page: perPage.toString(),
    });
  }

  async searchVideos(query: string, page: number = 1, perPage: number = 20): Promise<PexelsResponse<PexelsVideo>> {
    return this.makeRequest<PexelsResponse<PexelsVideo>>('/videos/search', {
      query,
      page: page.toString(),
      per_page: perPage.toString(),
    });
  }

  async getCuratedPhotos(page: number = 1, perPage: number = 20): Promise<PexelsResponse<PexelsPhoto>> {
    return this.makeRequest<PexelsResponse<PexelsPhoto>>('/curated', {
      page: page.toString(),
      per_page: perPage.toString(),
    });
  }

  async getPopularVideos(page: number = 1, perPage: number = 20): Promise<PexelsResponse<PexelsVideo>> {
    return this.makeRequest<PexelsResponse<PexelsVideo>>('/videos/popular', {
      page: page.toString(),
      per_page: perPage.toString(),
    });
  }
}

export const pexelsAPI = new PexelsAPI();
