/**
 * Voice Manager
 * 
 * Utility functions for managing ElevenLabs voices.
 * Provides convenient methods for voice selection and management.
 */

import { elevenLabsService } from './service';
import type { Voice, VoiceSettings, LanguageCode } from './types';

export class VoiceManager {
  private cachedVoices: Voice[] = [];
  private lastCacheTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get all available voices with caching
   */
  async getVoices(forceRefresh = false): Promise<Voice[]> {
    const now = Date.now();
    
    if (!forceRefresh && this.cachedVoices.length > 0 && (now - this.lastCacheTime) < this.CACHE_DURATION) {
      return this.cachedVoices;
    }

    try {
      const response = await elevenLabsService.getVoices({
        page_size: 100,
        include_total_count: true
      });
      
      this.cachedVoices = response.voices;
      this.lastCacheTime = now;
      
      return this.cachedVoices;
    } catch (error) {
      console.error('Failed to fetch voices:', error);
      return this.cachedVoices; // Return cached voices if available
    }
  }

  /**
   * Find voices by name (case-insensitive)
   */
  async findVoicesByName(name: string): Promise<Voice[]> {
    const voices = await this.getVoices();
    const searchTerm = name.toLowerCase();
    
    return voices.filter(voice => 
      voice.name.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Find voices by category
   */
  async findVoicesByCategory(category: Voice['category']): Promise<Voice[]> {
    const voices = await this.getVoices();
    return voices.filter(voice => voice.category === category);
  }

  /**
   * Find voices that support a specific language
   */
  async findVoicesByLanguage(language: LanguageCode): Promise<Voice[]> {
    const voices = await this.getVoices();
    
    return voices.filter(voice => {
      if (!voice.verified_languages) return true; // Include voices without language restrictions
      
      return voice.verified_languages.some(lang => 
        lang.language === language || 
        lang.locale?.startsWith(language)
      );
    });
  }

  /**
   * Get recommended voices for different use cases
   */
  async getRecommendedVoices(): Promise<{
    forNarration: Voice[];
    forConversation: Voice[];
    forAnnouncements: Voice[];
    forCharacterVoices: Voice[];
  }> {
    const voices = await this.getVoices();
    
    return {
      forNarration: voices.filter(voice => 
        voice.category === 'premade' || 
        voice.category === 'professional' ||
        (voice.labels?.gender === 'male' && voice.labels?.age === 'middle_aged')
      ).slice(0, 5),
      
      forConversation: voices.filter(voice => 
        voice.category === 'premade' ||
        (voice.labels?.gender && voice.labels?.age)
      ).slice(0, 5),
      
      forAnnouncements: voices.filter(voice => 
        voice.category === 'premade' ||
        voice.category === 'professional' ||
        (voice.labels?.accent === 'american' || voice.labels?.accent === 'british')
      ).slice(0, 5),
      
      forCharacterVoices: voices.filter(voice => 
        voice.category === 'generated' ||
        voice.category === 'cloned' ||
        (voice.labels?.use_case === 'character' || voice.labels?.use_case === 'acting')
      ).slice(0, 5)
    };
  }

  /**
   * Get voice by ID
   */
  async getVoiceById(voiceId: string): Promise<Voice | null> {
    const voices = await this.getVoices();
    return voices.find(voice => voice.voice_id === voiceId) || null;
  }

  /**
   * Get default voice settings for different use cases
   */
  getDefaultVoiceSettings(useCase: 'narration' | 'conversation' | 'announcement' | 'character'): VoiceSettings {
    const baseSettings: VoiceSettings = {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.0,
      use_speaker_boost: true,
      speed: 1.0
    };

    switch (useCase) {
      case 'narration':
        return {
          ...baseSettings,
          stability: 0.7, // More stable for consistent narration
          similarity_boost: 0.8,
          speed: 0.9 // Slightly slower for better comprehension
        };
      
      case 'conversation':
        return {
          ...baseSettings,
          stability: 0.4, // More emotional range for conversation
          similarity_boost: 0.7,
          style: 0.2 // Slight style exaggeration
        };
      
      case 'announcement':
        return {
          ...baseSettings,
          stability: 0.8, // Very stable for clear announcements
          similarity_boost: 0.9,
          speed: 0.8 // Slower for clarity
        };
      
      case 'character':
        return {
          ...baseSettings,
          stability: 0.3, // High emotional range for characters
          similarity_boost: 0.6,
          style: 0.5, // More style exaggeration
          speed: 1.1 // Slightly faster for dynamic characters
        };
      
      default:
        return baseSettings;
    }
  }

  /**
   * Search voices with multiple criteria
   */
  async searchVoices(criteria: {
    name?: string;
    category?: Voice['category'];
    language?: LanguageCode;
    gender?: 'male' | 'female' | 'neutral';
    age?: 'young' | 'middle_aged' | 'old';
    accent?: string;
    useCase?: 'narration' | 'conversation' | 'announcement' | 'character';
  }): Promise<Voice[]> {
    let voices = await this.getVoices();

    if (criteria.name) {
      const searchTerm = criteria.name.toLowerCase();
      voices = voices.filter(voice => 
        voice.name.toLowerCase().includes(searchTerm) ||
        voice.description?.toLowerCase().includes(searchTerm)
      );
    }

    if (criteria.category) {
      voices = voices.filter(voice => voice.category === criteria.category);
    }

    if (criteria.language) {
      voices = voices.filter(voice => {
        if (!voice.verified_languages) return true;
        return voice.verified_languages.some(lang => 
          lang.language === criteria.language || 
          lang.locale?.startsWith(criteria.language)
        );
      });
    }

    if (criteria.gender) {
      voices = voices.filter(voice => 
        voice.labels?.gender === criteria.gender
      );
    }

    if (criteria.age) {
      voices = voices.filter(voice => 
        voice.labels?.age === criteria.age
      );
    }

    if (criteria.accent) {
      voices = voices.filter(voice => 
        voice.labels?.accent?.toLowerCase().includes(criteria.accent!.toLowerCase())
      );
    }

    if (criteria.useCase) {
      voices = voices.filter(voice => 
        voice.labels?.use_case === criteria.useCase ||
        voice.labels?.description?.toLowerCase().includes(criteria.useCase!)
      );
    }

    return voices;
  }

  /**
   * Get popular voices (voices with high usage or ratings)
   */
  async getPopularVoices(limit = 10): Promise<Voice[]> {
    const voices = await this.getVoices();
    
    // Sort by category priority and return top voices
    const categoryPriority = {
      'premade': 1,
      'professional': 2,
      'generated': 3,
      'cloned': 4,
      'famous': 5,
      'high_quality': 6
    };

    return voices
      .sort((a, b) => {
        const aPriority = categoryPriority[a.category] || 999;
        const bPriority = categoryPriority[b.category] || 999;
        return aPriority - bPriority;
      })
      .slice(0, limit);
  }

  /**
   * Clear voice cache
   */
  clearCache(): void {
    this.cachedVoices = [];
    this.lastCacheTime = 0;
  }

  /**
   * Get voice statistics
   */
  async getVoiceStats(): Promise<{
    total: number;
    byCategory: Record<string, number>;
    byLanguage: Record<string, number>;
  }> {
    const voices = await this.getVoices();
    
    const byCategory: Record<string, number> = {};
    const byLanguage: Record<string, number> = {};

    voices.forEach(voice => {
      // Count by category
      byCategory[voice.category] = (byCategory[voice.category] || 0) + 1;

      // Count by language
      if (voice.verified_languages) {
        voice.verified_languages.forEach(lang => {
          byLanguage[lang.language] = (byLanguage[lang.language] || 0) + 1;
        });
      } else {
        byLanguage['unknown'] = (byLanguage['unknown'] || 0) + 1;
      }
    });

    return {
      total: voices.length,
      byCategory,
      byLanguage
    };
  }
}

// Export a default instance
export const voiceManager = new VoiceManager();
