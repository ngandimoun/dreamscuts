import { FreesoundSound, FreesoundResponse } from './types';

const FREESOUND_CLIENT_ID = 'DvDwaKHHKcuWngPj2lHt';
const FREESOUND_API_KEY = 'J9z3OesqvC05zDuA1zWs17ZYbPPBvJr9MQgWJTVb';
const FREESOUND_BASE_URL = 'https://freesound.org/apiv2';

class FreesoundAPI {
  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${FREESOUND_BASE_URL}${endpoint}`);
    
    // Ajouter les clés d'authentification
    url.searchParams.append('token', FREESOUND_API_KEY);
    
    // Ajouter les autres paramètres
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Token ${FREESOUND_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Freesound API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async searchSounds(query: string, page: number = 1, pageSize: number = 20): Promise<FreesoundResponse> {
    return this.makeRequest<FreesoundResponse>('/search/text/', {
      query,
      page: page.toString(),
      page_size: pageSize.toString(),
      fields: 'id,url,name,tags,description,type,duration,filesize,bitrate,bitdepth,samplerate,channels,license,username,pack,pack_name,download,bookmark,previews,images,num_downloads,avg_rating,num_ratings,created,modified,num_comments,comment,original_filename,filesize_approx',
      sort: 'score',
      filter: 'duration:[0 TO 30]', // Limiter à 30 secondes max
    });
  }

  async getPopularSounds(page: number = 1, pageSize: number = 20): Promise<FreesoundResponse> {
    return this.makeRequest<FreesoundResponse>('/search/text/', {
      query: 'sound effect',
      page: page.toString(),
      page_size: pageSize.toString(),
      fields: 'id,url,name,tags,description,type,duration,filesize,bitrate,bitdepth,samplerate,channels,license,username,pack,pack_name,download,bookmark,previews,images,num_downloads,avg_rating,num_ratings,created,modified,num_comments,comment,original_filename,filesize_approx',
      sort: 'downloads_desc',
      filter: 'duration:[0 TO 30]',
    });
  }

  async getSoundById(id: number): Promise<FreesoundSound> {
    return this.makeRequest<FreesoundSound>(`/sounds/${id}/`, {
      fields: 'id,url,name,tags,description,type,duration,filesize,bitrate,bitdepth,samplerate,channels,license,username,pack,pack_name,download,bookmark,previews,images,num_downloads,avg_rating,num_ratings,created,modified,num_comments,comment,original_filename,filesize_approx',
    });
  }
}

export const freesoundAPI = new FreesoundAPI();
