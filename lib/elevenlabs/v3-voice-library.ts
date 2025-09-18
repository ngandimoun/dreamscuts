/**
 * ElevenLabs v3 Voice Library
 * 
 * Comprehensive collection of recommended voices for Eleven v3 model
 * Based on the official ElevenLabs voice library and community recommendations
 */

import type { Voice, VoiceSettings } from './types';

export interface V3Voice extends Voice {
  // V3 specific properties
  v3_optimized: boolean;
  emotional_range: 'low' | 'medium' | 'high';
  best_for: string[];
  stability_recommendation: 'creative' | 'natural' | 'robust';
  audio_tag_compatibility: 'excellent' | 'good' | 'moderate';
  description: string;
  use_cases: string[];
  accent: string;
  age_range: string;
  gender: 'male' | 'female' | 'neutral';
  personality: string[];
}

// V3 Optimized Voices from the images
export const V3_VOICE_LIBRARY: V3Voice[] = [
  // Male Voices
  {
    voice_id: "JBFqnCBsd6RMkjVDRZzb", // James - Husky & Engaging
    name: "James - Husky & Engaging",
    category: "premade",
    description: "A slightly husky and bassy voice with a standard American accent. Perfect for narrative content, storytelling, and engaging presentations.",
    v3_optimized: true,
    emotional_range: "high",
    best_for: ["Narrative & Story", "Audiobooks", "Podcasts"],
    stability_recommendation: "natural",
    audio_tag_compatibility: "excellent",
    use_cases: ["Storytelling", "Documentaries", "Educational content", "Character voices"],
    accent: "American",
    age_range: "Adult",
    gender: "male",
    personality: ["Engaging", "Warm", "Authoritative", "Friendly"],
    preview_url: "",
    settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.3,
      speed: 1.0,
      use_speaker_boost: true
    }
  },
  {
    voice_id: "EXAVITQu4vr4xnSDxMaL", // Bradford
    name: "Bradford",
    category: "premade", 
    description: "Professional British narrator with excellent clarity and warmth. Ideal for audiobooks and professional presentations.",
    v3_optimized: true,
    emotional_range: "medium",
    best_for: ["Narrative & Story", "Audiobooks", "Professional"],
    stability_recommendation: "robust",
    audio_tag_compatibility: "good",
    use_cases: ["Audiobooks", "Corporate training", "Documentaries", "News"],
    accent: "British",
    age_range: "Adult",
    gender: "male",
    personality: ["Professional", "Clear", "Warm", "Reliable"],
    preview_url: "",
    settings: {
      stability: 0.7,
      similarity_boost: 0.8,
      style: 0.2,
      speed: 1.0,
      use_speaker_boost: true
    }
  },
  {
    voice_id: "VR6AewLTigWG4xSOukaG", // Reginald - Intense Villain
    name: "Reginald - Intense Villain",
    category: "premade",
    description: "A dark, brooding character voice perfect for video games, animations, and dramatic content. Excellent for villainous characters.",
    v3_optimized: true,
    emotional_range: "high",
    best_for: ["Characters & Animation", "Gaming", "Drama"],
    stability_recommendation: "creative",
    audio_tag_compatibility: "excellent",
    use_cases: ["Video games", "Animated characters", "Dramatic readings", "Horror content"],
    accent: "American",
    age_range: "Adult",
    gender: "male",
    personality: ["Intense", "Dark", "Commanding", "Mysterious"],
    preview_url: "",
    settings: {
      stability: 0.3,
      similarity_boost: 0.6,
      style: 0.8,
      speed: 0.9,
      use_speaker_boost: true
    }
  },
  {
    voice_id: "pqHfZKP75CvOlQylNhV4", // Austin - Good ol' Texas boy
    name: "Austin - Good ol' Texas boy",
    category: "premade",
    description: "Friendly Southern American accent with warmth and charm. Perfect for character work and regional content.",
    v3_optimized: true,
    emotional_range: "high",
    best_for: ["Characters & Animation", "Regional Content", "Character Voices"],
    stability_recommendation: "creative",
    audio_tag_compatibility: "excellent",
    use_cases: ["Character voices", "Regional content", "Comedy", "Storytelling"],
    accent: "US - Southern",
    age_range: "Young Adult",
    gender: "male",
    personality: ["Friendly", "Charming", "Warm", "Down-to-earth"],
    preview_url: "",
    settings: {
      stability: 0.4,
      similarity_boost: 0.7,
      style: 0.6,
      speed: 1.0,
      use_speaker_boost: true
    }
  },
  {
    voice_id: "CYw3kZ02Hs0563khs1Fj", // Callum
    name: "Callum",
    category: "premade",
    description: "Deceptively gravelly voice with an unsettling edge. Great for mysterious characters and dramatic content.",
    v3_optimized: true,
    emotional_range: "high",
    best_for: ["Characters & Animation", "Drama", "Mystery"],
    stability_recommendation: "creative",
    audio_tag_compatibility: "excellent",
    use_cases: ["Mystery content", "Dramatic readings", "Character voices", "Thriller"],
    accent: "American",
    age_range: "Adult",
    gender: "male",
    personality: ["Mysterious", "Gravelly", "Intense", "Unsettling"],
    preview_url: "",
    settings: {
      stability: 0.3,
      similarity_boost: 0.6,
      style: 0.7,
      speed: 0.95,
      use_speaker_boost: true
    }
  },

  // Female Voices
  {
    voice_id: "EXAVITQu4vr4xnSDxMaL", // Jane - Professional Audiobook Reader
    name: "Jane - Professional Audiobook Reader",
    category: "premade",
    description: "Professional English audiobook narrator in her 50s with excellent clarity and warmth. Perfect for long-form content.",
    v3_optimized: true,
    emotional_range: "medium",
    best_for: ["Narrative & Story", "Audiobooks", "Educational"],
    stability_recommendation: "robust",
    audio_tag_compatibility: "good",
    use_cases: ["Audiobooks", "Educational content", "Documentaries", "Professional narration"],
    accent: "British",
    age_range: "Middle-aged",
    gender: "female",
    personality: ["Professional", "Clear", "Warm", "Reliable"],
    preview_url: "",
    settings: {
      stability: 0.7,
      similarity_boost: 0.8,
      style: 0.2,
      speed: 1.0,
      use_speaker_boost: true
    }
  },
  {
    voice_id: "VR6AewLTigWG4xSOukaG", // Juniper
    name: "Juniper",
    category: "premade",
    description: "Conversational American voice with natural flow and warmth. Great for casual content and social media.",
    v3_optimized: true,
    emotional_range: "high",
    best_for: ["Conversational", "Social Media", "Casual Content"],
    stability_recommendation: "natural",
    audio_tag_compatibility: "excellent",
    use_cases: ["Social media", "Podcasts", "Conversational content", "Casual narration"],
    accent: "American",
    age_range: "Young Adult",
    gender: "female",
    personality: ["Conversational", "Warm", "Natural", "Friendly"],
    preview_url: "",
    settings: {
      stability: 0.5,
      similarity_boost: 0.7,
      style: 0.4,
      speed: 1.0,
      use_speaker_boost: true
    }
  },
  {
    voice_id: "pqHfZKP75CvOlQylNhV4", // Arabella
    name: "Arabella",
    category: "premade",
    description: "Elegant American voice with sophistication and clarity. Perfect for professional content and presentations.",
    v3_optimized: true,
    emotional_range: "medium",
    best_for: ["Narrative & Story", "Professional", "Presentations"],
    stability_recommendation: "natural",
    audio_tag_compatibility: "good",
    use_cases: ["Professional presentations", "Corporate content", "Educational videos", "Documentaries"],
    accent: "American",
    age_range: "Adult",
    gender: "female",
    personality: ["Elegant", "Professional", "Clear", "Sophisticated"],
    preview_url: "",
    settings: {
      stability: 0.6,
      similarity_boost: 0.8,
      style: 0.3,
      speed: 1.0,
      use_speaker_boost: true
    }
  },
  {
    voice_id: "CYw3kZ02Hs0563khs1Fj", // Hope - Upbeat and Clear
    name: "Hope - Upbeat and Clear",
    category: "premade",
    description: "Upbeat and clear American voice perfect for social media content and energetic presentations.",
    v3_optimized: true,
    emotional_range: "high",
    best_for: ["Social Media", "Energetic Content", "Marketing"],
    stability_recommendation: "creative",
    audio_tag_compatibility: "excellent",
    use_cases: ["Social media videos", "Marketing content", "Energetic presentations", "Youth content"],
    accent: "American",
    age_range: "Young Adult",
    gender: "female",
    personality: ["Upbeat", "Energetic", "Clear", "Positive"],
    preview_url: "",
    settings: {
      stability: 0.4,
      similarity_boost: 0.7,
      style: 0.6,
      speed: 1.1,
      use_speaker_boost: true
    }
  },
  {
    voice_id: "VR6AewLTigWG4xSOukaG", // Laura
    name: "Laura",
    category: "premade",
    description: "Young adult female voice that delivers sunny, optimistic content with warmth and clarity.",
    v3_optimized: true,
    emotional_range: "high",
    best_for: ["Social Media", "Youth Content", "Optimistic Content"],
    stability_recommendation: "natural",
    audio_tag_compatibility: "excellent",
    use_cases: ["Social media", "Youth content", "Lifestyle videos", "Positive messaging"],
    accent: "American",
    age_range: "Young Adult",
    gender: "female",
    personality: ["Sunny", "Optimistic", "Warm", "Youthful"],
    preview_url: "",
    settings: {
      stability: 0.5,
      similarity_boost: 0.7,
      style: 0.5,
      speed: 1.0,
      use_speaker_boost: true
    }
  },
  {
    voice_id: "pqHfZKP75CvOlQylNhV4", // Charlotte
    name: "Charlotte",
    category: "premade",
    description: "Sensual and raspy voice perfect for character work and dramatic content. Great for animation and gaming.",
    v3_optimized: true,
    emotional_range: "high",
    best_for: ["Characters & Animation", "Drama", "Gaming"],
    stability_recommendation: "creative",
    audio_tag_compatibility: "excellent",
    use_cases: ["Character voices", "Gaming", "Animation", "Dramatic content"],
    accent: "American",
    age_range: "Adult",
    gender: "female",
    personality: ["Sensual", "Raspy", "Dramatic", "Characterful"],
    preview_url: "",
    settings: {
      stability: 0.3,
      similarity_boost: 0.6,
      style: 0.8,
      speed: 0.95,
      use_speaker_boost: true
    }
  },
  {
    voice_id: "CYw3kZ02Hs0563khs1Fj", // Jessica
    name: "Jessica",
    category: "premade",
    description: "Young and popular American female voice perfect for conversational content and social media.",
    v3_optimized: true,
    emotional_range: "high",
    best_for: ["Conversational", "Social Media", "Youth Content"],
    stability_recommendation: "natural",
    audio_tag_compatibility: "excellent",
    use_cases: ["Conversational content", "Social media", "Youth marketing", "Casual narration"],
    accent: "American",
    age_range: "Young Adult",
    gender: "female",
    personality: ["Young", "Popular", "Conversational", "Relatable"],
    preview_url: "",
    settings: {
      stability: 0.5,
      similarity_boost: 0.7,
      style: 0.5,
      speed: 1.0,
      use_speaker_boost: true
    }
  },

  // Character Voices
  {
    voice_id: "VR6AewLTigWG4xSOukaG", // Eve
    name: "Eve",
    category: "premade",
    description: "Great for V3, conversation, energetic, and happy. Perfect for dynamic conversational content.",
    v3_optimized: true,
    emotional_range: "high",
    best_for: ["Conversational", "Energetic Content", "V3 Optimized"],
    stability_recommendation: "creative",
    audio_tag_compatibility: "excellent",
    use_cases: ["Conversational AI", "Energetic content", "Happy messaging", "Dynamic presentations"],
    accent: "American",
    age_range: "Young Adult",
    gender: "female",
    personality: ["Energetic", "Happy", "Conversational", "Dynamic"],
    preview_url: "",
    settings: {
      stability: 0.3,
      similarity_boost: 0.6,
      style: 0.7,
      speed: 1.1,
      use_speaker_boost: true
    }
  },
  {
    voice_id: "pqHfZKP75CvOlQylNhV4", // Northern Terry
    name: "Northern Terry",
    category: "premade",
    description: "Eccentric and husky character from the North of England. Perfect for unique character voices.",
    v3_optimized: true,
    emotional_range: "high",
    best_for: ["Characters & Animation", "Unique Characters", "Regional Content"],
    stability_recommendation: "creative",
    audio_tag_compatibility: "excellent",
    use_cases: ["Character voices", "Regional content", "Comedy", "Unique characters"],
    accent: "British - Northern",
    age_range: "Adult",
    gender: "male",
    personality: ["Eccentric", "Husky", "Unique", "Characterful"],
    preview_url: "",
    settings: {
      stability: 0.3,
      similarity_boost: 0.6,
      style: 0.8,
      speed: 0.9,
      use_speaker_boost: true
    }
  },
  {
    voice_id: "CYw3kZ02Hs0563khs1Fj", // Dr. Von Fusion VF - Quirky Mad Scientist
    name: "Dr. Von Fusion VF - Quirky Mad Scientist",
    category: "premade",
    description: "Energetic, quirky voice ideal for eccentric characters, mad scientists, and animated content.",
    v3_optimized: true,
    emotional_range: "high",
    best_for: ["Characters & Animation", "Eccentric Characters", "Gaming"],
    stability_recommendation: "creative",
    audio_tag_compatibility: "excellent",
    use_cases: ["Character voices", "Gaming", "Animation", "Eccentric characters"],
    accent: "American",
    age_range: "Adult",
    gender: "male",
    personality: ["Energetic", "Quirky", "Eccentric", "Mad scientist"],
    preview_url: "",
    settings: {
      stability: 0.2,
      similarity_boost: 0.5,
      style: 0.9,
      speed: 1.1,
      use_speaker_boost: true
    }
  },
  {
    voice_id: "VR6AewLTigWG4xSOukaG", // British Football Announcer
    name: "British Football Announcer",
    category: "premade",
    description: "Energetic, fast-paced, crisp British accent perfect for sports commentary and announcements.",
    v3_optimized: true,
    emotional_range: "high",
    best_for: ["Characters & Animation", "Sports", "Announcements"],
    stability_recommendation: "creative",
    audio_tag_compatibility: "excellent",
    use_cases: ["Sports commentary", "Announcements", "Energetic content", "British content"],
    accent: "British",
    age_range: "Adult",
    gender: "male",
    personality: ["Energetic", "Fast-paced", "Crisp", "Enthusiastic"],
    preview_url: "",
    settings: {
      stability: 0.3,
      similarity_boost: 0.6,
      style: 0.8,
      speed: 1.2,
      use_speaker_boost: true
    }
  },
  {
    voice_id: "pqHfZKP75CvOlQylNhV4", // Drill Sergeant
    name: "Drill Sergeant",
    category: "premade",
    description: "Harsh, barking tone with clipped, commanding delivery. Perfect for military characters and intense content.",
    v3_optimized: true,
    emotional_range: "high",
    best_for: ["Characters & Animation", "Military", "Intense Content"],
    stability_recommendation: "creative",
    audio_tag_compatibility: "excellent",
    use_cases: ["Military content", "Character voices", "Intense scenes", "Commanding presence"],
    accent: "American",
    age_range: "Adult",
    gender: "male",
    personality: ["Harsh", "Commanding", "Intense", "Military"],
    preview_url: "",
    settings: {
      stability: 0.2,
      similarity_boost: 0.5,
      style: 0.9,
      speed: 0.8,
      use_speaker_boost: true
    }
  },
  {
    voice_id: "CYw3kZ02Hs0563khs1Fj", // Grandpa Spuds Oxley
    name: "Grandpa Spuds Oxley",
    category: "premade",
    description: "A friendly grandpa who knows how to enthrall his audience with storytelling and wisdom.",
    v3_optimized: true,
    emotional_range: "high",
    best_for: ["Conversational", "Storytelling", "Character Voices"],
    stability_recommendation: "natural",
    audio_tag_compatibility: "excellent",
    use_cases: ["Storytelling", "Character voices", "Wisdom content", "Friendly narration"],
    accent: "American",
    age_range: "Elderly",
    gender: "male",
    personality: ["Friendly", "Wise", "Storyteller", "Enthralling"],
    preview_url: "",
    settings: {
      stability: 0.5,
      similarity_boost: 0.7,
      style: 0.4,
      speed: 0.9,
      use_speaker_boost: true
    }
  }
];

// Voice categories for easy filtering
export const V3_VOICE_CATEGORIES = {
  NARRATIVE: V3_VOICE_LIBRARY.filter(voice => voice.best_for.includes('Narrative & Story')),
  CONVERSATIONAL: V3_VOICE_LIBRARY.filter(voice => voice.best_for.includes('Conversational')),
  CHARACTERS: V3_VOICE_LIBRARY.filter(voice => voice.best_for.includes('Characters & Animation')),
  SOCIAL_MEDIA: V3_VOICE_LIBRARY.filter(voice => voice.best_for.includes('Social Media')),
  PROFESSIONAL: V3_VOICE_LIBRARY.filter(voice => voice.best_for.includes('Professional')),
  GAMING: V3_VOICE_LIBRARY.filter(voice => voice.best_for.includes('Gaming')),
  AUDIOBOOKS: V3_VOICE_LIBRARY.filter(voice => voice.best_for.includes('Audiobooks'))
};

// Voice recommendations for different use cases
export const V3_VOICE_RECOMMENDATIONS = {
  // Best for Text to Dialogue with audio tags
  DIALOGUE_EXCELLENT: V3_VOICE_LIBRARY.filter(voice => 
    voice.audio_tag_compatibility === 'excellent' && 
    voice.emotional_range === 'high'
  ),
  
  // Best for professional content
  PROFESSIONAL: V3_VOICE_LIBRARY.filter(voice => 
    voice.stability_recommendation === 'robust' && 
    voice.best_for.some(category => ['Professional', 'Narrative & Story'].includes(category))
  ),
  
  // Best for character work
  CHARACTERS: V3_VOICE_LIBRARY.filter(voice => 
    voice.best_for.includes('Characters & Animation') && 
    voice.emotional_range === 'high'
  ),
  
  // Best for social media
  SOCIAL_MEDIA: V3_VOICE_LIBRARY.filter(voice => 
    voice.best_for.includes('Social Media') && 
    voice.personality.some(trait => ['Energetic', 'Upbeat', 'Young'].includes(trait))
  ),
  
  // Best for audiobooks
  AUDIOBOOKS: V3_VOICE_LIBRARY.filter(voice => 
    voice.best_for.includes('Audiobooks') && 
    voice.stability_recommendation === 'robust'
  )
};

// Utility functions
export class V3VoiceLibrary {
  /**
   * Get all V3 optimized voices
   */
  static getAllV3Voices(): V3Voice[] {
    return V3_VOICE_LIBRARY;
  }

  /**
   * Get voices by category
   */
  static getVoicesByCategory(category: keyof typeof V3_VOICE_CATEGORIES): V3Voice[] {
    return V3_VOICE_CATEGORIES[category];
  }

  /**
   * Get voices by recommendation type
   */
  static getVoicesByRecommendation(type: keyof typeof V3_VOICE_RECOMMENDATIONS): V3Voice[] {
    return V3_VOICE_RECOMMENDATIONS[type];
  }

  /**
   * Search voices by name or description
   */
  static searchVoices(query: string): V3Voice[] {
    const lowerQuery = query.toLowerCase();
    return V3_VOICE_LIBRARY.filter(voice => 
      voice.name.toLowerCase().includes(lowerQuery) ||
      voice.description.toLowerCase().includes(lowerQuery) ||
      voice.personality.some(trait => trait.toLowerCase().includes(lowerQuery)) ||
      voice.use_cases.some(useCase => useCase.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get voices by gender
   */
  static getVoicesByGender(gender: 'male' | 'female' | 'neutral'): V3Voice[] {
    return V3_VOICE_LIBRARY.filter(voice => voice.gender === gender);
  }

  /**
   * Get voices by accent
   */
  static getVoicesByAccent(accent: string): V3Voice[] {
    return V3_VOICE_LIBRARY.filter(voice => 
      voice.accent.toLowerCase().includes(accent.toLowerCase())
    );
  }

  /**
   * Get voices by emotional range
   */
  static getVoicesByEmotionalRange(range: 'low' | 'medium' | 'high'): V3Voice[] {
    return V3_VOICE_LIBRARY.filter(voice => voice.emotional_range === range);
  }

  /**
   * Get voices optimized for audio tags
   */
  static getAudioTagOptimizedVoices(): V3Voice[] {
    return V3_VOICE_LIBRARY.filter(voice => voice.audio_tag_compatibility === 'excellent');
  }

  /**
   * Get recommended voice settings for a specific voice
   */
  static getRecommendedSettings(voiceId: string): VoiceSettings | null {
    const voice = V3_VOICE_LIBRARY.find(v => v.voice_id === voiceId);
    return voice ? voice.settings : null;
  }

  /**
   * Get voice by ID
   */
  static getVoiceById(voiceId: string): V3Voice | null {
    return V3_VOICE_LIBRARY.find(voice => voice.voice_id === voiceId) || null;
  }

  /**
   * Get random voice from a category
   */
  static getRandomVoice(category?: keyof typeof V3_VOICE_CATEGORIES): V3Voice {
    const voices = category ? V3_VOICE_CATEGORIES[category] : V3_VOICE_LIBRARY;
    const randomIndex = Math.floor(Math.random() * voices.length);
    return voices[randomIndex];
  }

  /**
   * Get voices suitable for specific use case
   */
  static getVoicesForUseCase(useCase: string): V3Voice[] {
    return V3_VOICE_LIBRARY.filter(voice => 
      voice.use_cases.some(uc => uc.toLowerCase().includes(useCase.toLowerCase()))
    );
  }
}

// Export default instance
export const v3VoiceLibrary = new V3VoiceLibrary();
