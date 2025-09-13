import { MediaItem } from './types';
import { pexelsAPI } from './pexels';
import { pixabayAPI } from './pixabay';
import { unsplashAPI } from './unsplash';
import { unsplashFallbackAPI } from './unsplash-fallback';
import { freesoundAPI } from './freesound';
import { API_CONFIG, isAPIEnabled } from './config';
import { PexelsPhoto, PexelsVideo } from './types';
import { PixabayImage, PixabayVideo } from './types';
import { UnsplashPhoto } from './types';
import { FreesoundSound } from './types';

class MediaService {
  // Convertir les données Pexels en MediaItem
  private convertPexelsPhoto(photo: PexelsPhoto): MediaItem {
    return {
      id: `pexels_photo_${photo.id}`,
      name: photo.alt || `Photo by ${photo.photographer}`,
      type: 'image',
      url: photo.src.large,
      thumbnail: photo.src.medium,
      uploadedAt: new Date(),
      isGenerated: true,
      source: 'pexels',
      originalData: photo,
      width: photo.width,
      height: photo.height,
    };
  }

  private convertPexelsVideo(video: PexelsVideo): MediaItem {
    return {
      id: `pexels_video_${video.id}`,
      name: `Video by ${video.user.name}`,
      type: 'video',
      url: video.video_files[0]?.link || '',
      thumbnail: video.image,
      uploadedAt: new Date(),
      isGenerated: true,
      source: 'pexels',
      originalData: video,
      width: video.width,
      height: video.height,
    };
  }

  // Convertir les données Pixabay en MediaItem
  private convertPixabayImage(image: PixabayImage): MediaItem {
    return {
      id: `pixabay_image_${image.id}`,
      name: image.tags.split(',')[0] || 'Pixabay Image',
      type: 'image',
      url: image.largeImageURL,
      thumbnail: image.previewURL,
      uploadedAt: new Date(),
      isGenerated: true,
      source: 'pixabay',
      originalData: image,
      width: image.imageWidth,
      height: image.imageHeight,
    };
  }

  private convertPixabayVideo(video: PixabayVideo): MediaItem {
    return {
      id: `pixabay_video_${video.id}`,
      name: video.tags.split(',')[0] || 'Pixabay Video',
      type: 'video',
      url: video.videos.medium.url,
      thumbnail: video.videos.medium.thumbnail,
      uploadedAt: new Date(),
      isGenerated: true,
      source: 'pixabay',
      originalData: video,
      width: video.videos.medium.width,
      height: video.videos.medium.height,
    };
  }

  // Convertir les données Unsplash en MediaItem
  private convertUnsplashPhoto(photo: UnsplashPhoto): MediaItem {
    return {
      id: `unsplash_photo_${photo.id}`,
      name: photo.alt_description || photo.description || `Photo by ${photo.user.name}`,
      type: 'image',
      url: photo.urls.regular,
      thumbnail: photo.urls.small,
      uploadedAt: new Date(photo.created_at),
      isGenerated: true,
      source: 'unsplash',
      originalData: photo,
      width: photo.width,
      height: photo.height,
    };
  }

  // Convertir les données Freesound en MediaItem
  private convertFreesoundSound(sound: FreesoundSound): MediaItem {
    return {
      id: `freesound_${sound.id}`,
      name: sound.name,
      type: 'audio',
      url: sound.previews['preview-hq-mp3'],
      thumbnail: sound.images.waveform_m,
      uploadedAt: new Date(sound.created),
      isGenerated: true,
      source: 'freesound',
      originalData: sound,
      // Métadonnées audio
      duration: sound.duration,
      artist: sound.username,
      downloads: sound.num_downloads,
      rating: sound.avg_rating,
      comments: sound.num_comments,
      hasLocation: sound.geotag && sound.geotag.lat !== null,
      description: sound.description,
    };
  }

  // Méthodes pour récupérer les images
  async getImages(query: string = '', page: number = 1, perPage: number = 20): Promise<MediaItem[]> {
    const results: MediaItem[] = [];

    try {
      // Récupérer depuis Pexels
      if (isAPIEnabled('PEXELS_ENABLED')) {
        try {
          const pexelsResponse = await pexelsAPI.searchPhotos(query, page, API_CONFIG.MAX_IMAGES_PER_API);
          if (pexelsResponse.photos) {
            results.push(...pexelsResponse.photos.map(photo => this.convertPexelsPhoto(photo)));
          }
        } catch (error) {
          console.warn('Pexels API error:', error);
        }
      }

      // Récupérer depuis Pixabay
      if (isAPIEnabled('PIXABAY_ENABLED')) {
        try {
          const pixabayResponse = await pixabayAPI.searchImages(query, page, API_CONFIG.MAX_IMAGES_PER_API);
          results.push(...pixabayResponse.hits.map(image => this.convertPixabayImage(image)));
        } catch (error) {
          console.warn('Pixabay API error:', error);
        }
      }

      // Unsplash (désactivé dans la configuration)
      if (isAPIEnabled('UNSPLASH_ENABLED')) {
        try {
          const unsplashResponse = await unsplashAPI.searchPhotos(query, page, API_CONFIG.MAX_IMAGES_PER_API);
          results.push(...unsplashResponse.map(photo => this.convertUnsplashPhoto(photo)));
        } catch (error) {
          console.warn('Unsplash API error:', error);
        }
      } else {
        console.log('Unsplash API disabled in configuration');
      }

    } catch (error) {
      console.error('Error fetching images:', error);
    }

    return results.slice(0, perPage);
  }

  // Méthodes pour récupérer les vidéos
  async getVideos(query: string = '', page: number = 1, perPage: number = 20): Promise<MediaItem[]> {
    const results: MediaItem[] = [];

    try {
      // Récupérer depuis Pexels
      try {
        const pexelsResponse = await pexelsAPI.searchVideos(query, page, Math.ceil(perPage / 2));
        if (pexelsResponse.videos) {
          results.push(...pexelsResponse.videos.map(video => this.convertPexelsVideo(video)));
        }
      } catch (error) {
        console.warn('Pexels API error:', error);
      }

      // Récupérer depuis Pixabay
      try {
        const pixabayResponse = await pixabayAPI.searchVideos(query, page, Math.ceil(perPage / 2));
        results.push(...pixabayResponse.hits.map(video => this.convertPixabayVideo(video)));
      } catch (error) {
        console.warn('Pixabay API error:', error);
      }

    } catch (error) {
      console.error('Error fetching videos:', error);
    }

    return results.slice(0, perPage);
  }

  // Méthodes pour récupérer les sons
  async getSounds(query: string = '', page: number = 1, perPage: number = 20): Promise<MediaItem[]> {
    try {
      const response = await freesoundAPI.searchSounds(query, page, perPage);
      return response.results.map(sound => this.convertFreesoundSound(sound));
    } catch (error) {
      console.warn('Freesound API error:', error);
      return [];
    }
  }

  // Méthodes pour récupérer le contenu populaire
  async getPopularImages(page: number = 1, perPage: number = 20): Promise<MediaItem[]> {
    const results: MediaItem[] = [];

    try {
      // Récupérer depuis Pexels (plus d'images pour compenser Unsplash)
      try {
        const pexelsResponse = await pexelsAPI.getCuratedPhotos(page, Math.ceil(perPage / 2));
        if (pexelsResponse.photos) {
          results.push(...pexelsResponse.photos.map(photo => this.convertPexelsPhoto(photo)));
        }
      } catch (error) {
        console.warn('Pexels API error:', error);
      }

      // Récupérer depuis Pixabay (plus d'images pour compenser Unsplash)
      try {
        const pixabayResponse = await pixabayAPI.getPopularImages(page, Math.ceil(perPage / 2));
        results.push(...pixabayResponse.hits.map(image => this.convertPixabayImage(image)));
      } catch (error) {
        console.warn('Pixabay API error:', error);
      }

      // Unsplash temporairement désactivé pour éviter les erreurs
      // TODO: Réactiver une fois la clé API corrigée
      console.log('Unsplash API temporarily disabled to avoid errors');

    } catch (error) {
      console.error('Error fetching popular images:', error);
    }

    return results.slice(0, perPage);
  }

  async getPopularVideos(page: number = 1, perPage: number = 20): Promise<MediaItem[]> {
    const results: MediaItem[] = [];

    try {
      // Récupérer depuis Pexels
      try {
        const pexelsResponse = await pexelsAPI.getPopularVideos(page, Math.ceil(perPage / 2));
        if (pexelsResponse.videos) {
          results.push(...pexelsResponse.videos.map(video => this.convertPexelsVideo(video)));
        }
      } catch (error) {
        console.warn('Pexels API error:', error);
      }

      // Récupérer depuis Pixabay
      try {
        const pixabayResponse = await pixabayAPI.getPopularVideos(page, Math.ceil(perPage / 2));
        results.push(...pixabayResponse.hits.map(video => this.convertPixabayVideo(video)));
      } catch (error) {
        console.warn('Pixabay API error:', error);
      }

    } catch (error) {
      console.error('Error fetching popular videos:', error);
    }

    return results.slice(0, perPage);
  }

  async getPopularSounds(page: number = 1, perPage: number = 20): Promise<MediaItem[]> {
    try {
      const response = await freesoundAPI.getPopularSounds(page, perPage);
      return response.results.map(sound => this.convertFreesoundSound(sound));
    } catch (error) {
      console.warn('Freesound API error:', error);
      return [];
    }
  }
}

export const mediaService = new MediaService();
