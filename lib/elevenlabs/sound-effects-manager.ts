/**
 * Sound Effects Manager
 * 
 * Utility functions for managing sound effects generation and prompting.
 * Based on the official ElevenLabs Sound Effects documentation.
 */

import type { 
  SoundEffectCategory, 
  SoundEffectPrompt, 
  SoundEffectModel,
  SoundEffectOptions 
} from './types';

// Sound Effects Models
export const SOUND_EFFECT_MODELS: SoundEffectModel[] = [
  {
    model_id: 'eleven_text_to_sound_v2',
    name: 'Eleven Text to Sound v2',
    description: 'Latest sound effects model with enhanced quality and looping support',
    capabilities: ['text_to_sound', 'looping', 'duration_control', 'prompt_influence'],
    max_duration: 30,
    supports_looping: true
  }
];

// Sound Effects Prompting Guide
export const SOUND_EFFECT_PROMPTS: Record<SoundEffectCategory, SoundEffectPrompt> = {
  impact: {
    category: 'impact',
    description: 'Collision or contact sounds between objects, from subtle taps to dramatic crashes',
    examples: [
      'Glass shattering on concrete',
      'Heavy wooden door creaking open',
      'Thunder rumbling in the distance',
      'Metal door slamming shut',
      'Footsteps on gravel'
    ],
    tips: [
      'Be specific about materials (glass, wood, metal)',
      'Include intensity descriptors (subtle, heavy, dramatic)',
      'Mention surface types (concrete, gravel, wood)'
    ]
  },
  whoosh: {
    category: 'whoosh',
    description: 'Movement through air effects, ranging from fast and ghostly to slow-spinning or rhythmic',
    examples: [
      'Fast whoosh through air',
      'Slow spinning wind effect',
      'Ghostly movement sound',
      'Rhythmic air movement',
      'Sword swishing through air'
    ],
    tips: [
      'Specify speed (fast, slow, medium)',
      'Include direction (through air, spinning, swishing)',
      'Add character (ghostly, rhythmic, dramatic)'
    ]
  },
  ambience: {
    category: 'ambience',
    description: 'Background environmental sounds that establish atmosphere and space',
    examples: [
      'Soft rain on leaves',
      'Wind whistling through trees',
      'Ocean waves on shore',
      'Forest ambience with birds',
      'City street ambience'
    ],
    tips: [
      'Focus on environmental elements',
      'Include atmospheric descriptors (soft, gentle, harsh)',
      'Mention specific locations or settings'
    ]
  },
  one_shot: {
    category: 'one_shot',
    description: 'Single, non-repeating sound effects',
    examples: [
      'Single gunshot',
      'Doorbell chime',
      'Phone ringing once',
      'Single clap',
      'One-time notification sound'
    ],
    tips: [
      'Keep descriptions concise',
      'Focus on single events',
      'Avoid continuous or repeating elements'
    ]
  },
  loop: {
    category: 'loop',
    description: 'Repeating audio segments designed for seamless looping',
    examples: [
      'Soft rain loop',
      'Heartbeat rhythm',
      'Clock ticking',
      'Engine idling',
      'Breathing pattern'
    ],
    tips: [
      'Design for seamless repetition',
      'Avoid sounds with clear start/end points',
      'Focus on rhythmic or continuous elements'
    ]
  },
  stem: {
    category: 'stem',
    description: 'Isolated audio components for mixing and layering',
    examples: [
      'Drum stem, 90 BPM',
      'Bass line in C major',
      'Vocal harmony stem',
      'Guitar riff isolated',
      'Percussion loop stem'
    ],
    tips: [
      'Specify musical elements (BPM, key, instrument)',
      'Focus on single musical components',
      'Include technical details when relevant'
    ]
  },
  braam: {
    category: 'braam',
    description: 'Big, brassy cinematic hit that signals epic or dramatic moments, common in trailers',
    examples: [
      'Cinematic braam, horror',
      'Epic trailer braam',
      'Dramatic brass hit',
      'Movie trailer impact',
      'Cinematic whoosh into braam'
    ],
    tips: [
      'Use cinematic terminology',
      'Include genre descriptors (horror, epic, dramatic)',
      'Focus on impact and drama'
    ]
  },
  glitch: {
    category: 'glitch',
    description: 'Sounds of malfunction, jittering, or erratic movement, useful for transitions and sci-fi',
    examples: [
      'Digital glitch transition',
      'Static interference',
      'Data corruption sound',
      'Electronic malfunction',
      'Sci-fi glitch effect'
    ],
    tips: [
      'Use digital/electronic terminology',
      'Include transition descriptors',
      'Focus on malfunction or error sounds'
    ]
  },
  drone: {
    category: 'drone',
    description: 'Continuous, textured sound that creates atmosphere and suspense',
    examples: [
      'Dark atmospheric drone',
      'Tension building drone',
      'Low frequency hum',
      'Ambient texture',
      'Suspenseful atmosphere'
    ],
    tips: [
      'Focus on continuous, sustained sounds',
      'Include atmospheric descriptors',
      'Mention frequency characteristics (low, high, mid)'
    ]
  },
  musical: {
    category: 'musical',
    description: 'Musical elements and components',
    examples: [
      '90s hip-hop drum loop, 90 BPM',
      'Vintage brass stabs in F minor',
      'Atmospheric synth pad with subtle modulation',
      'Jazz piano chord progression',
      'Electronic beat with reverb'
    ],
    tips: [
      'Include musical terminology (BPM, key, genre)',
      'Specify instruments and effects',
      'Mention musical style or era'
    ]
  },
  foley: {
    category: 'foley',
    description: 'Realistic sound effects for film and video production',
    examples: [
      'Footsteps on wooden floor',
      'Paper rustling',
      'Keys jingling',
      'Water dripping',
      'Clothing movement'
    ],
    tips: [
      'Focus on realistic, everyday sounds',
      'Be specific about materials and surfaces',
      'Include movement descriptors'
    ]
  },
  cinematic: {
    category: 'cinematic',
    description: 'Sound effects designed for film, TV, and cinematic content',
    examples: [
      'Cinematic impact hit',
      'Movie trailer whoosh',
      'Dramatic crescendo',
      'Epic orchestral hit',
      'Cinematic transition'
    ],
    tips: [
      'Use cinematic terminology',
      'Focus on dramatic impact',
      'Include genre-specific descriptors'
    ]
  },
  nature: {
    category: 'nature',
    description: 'Natural environmental sounds',
    examples: [
      'Birds chirping in forest',
      'Ocean waves crashing',
      'Wind through trees',
      'Rain on roof',
      'Crickets at night'
    ],
    tips: [
      'Focus on natural elements',
      'Include environmental context',
      'Specify time of day or weather'
    ]
  },
  mechanical: {
    category: 'mechanical',
    description: 'Mechanical and industrial sounds',
    examples: [
      'Engine starting',
      'Gears grinding',
      'Steam hissing',
      'Metal clanking',
      'Machine humming'
    ],
    tips: [
      'Focus on mechanical processes',
      'Include industrial terminology',
      'Specify machine types when relevant'
    ]
  },
  electronic: {
    category: 'electronic',
    description: 'Electronic and digital sounds',
    examples: [
      'Synthesizer pad',
      'Digital beep',
      'Computer startup sound',
      'Electronic notification',
      'Digital processing effect'
    ],
    tips: [
      'Use electronic terminology',
      'Include digital descriptors',
      'Focus on synthetic or processed sounds'
    ]
  },
  vocal: {
    category: 'vocal',
    description: 'Human vocal sounds and effects',
    examples: [
      'Crowd cheering',
      'Whispered words',
      'Laughing children',
      'Singing in distance',
      'Vocal harmony'
    ],
    tips: [
      'Focus on human vocal elements',
      'Include emotional descriptors',
      'Specify vocal techniques when relevant'
    ]
  },
  atmospheric: {
    category: 'atmospheric',
    description: 'Atmospheric and ambient soundscapes',
    examples: [
      'Haunted house atmosphere',
      'Space station ambience',
      'Underwater environment',
      'Desert wind',
      'Mystical forest'
    ],
    tips: [
      'Focus on environmental atmosphere',
      'Include mood descriptors',
      'Create immersive soundscapes'
    ]
  }
};

export class SoundEffectsManager {
  /**
   * Get all available sound effect models
   */
  static getSoundEffectModels(): SoundEffectModel[] {
    return SOUND_EFFECT_MODELS;
  }

  /**
   * Get sound effect model by ID
   */
  static getSoundEffectModel(modelId: string): SoundEffectModel | null {
    return SOUND_EFFECT_MODELS.find(model => model.model_id === modelId) || null;
  }

  /**
   * Get all sound effect categories
   */
  static getSoundEffectCategories(): SoundEffectCategory[] {
    return Object.keys(SOUND_EFFECT_PROMPTS) as SoundEffectCategory[];
  }

  /**
   * Get prompting guide for a specific category
   */
  static getPromptingGuide(category: SoundEffectCategory): SoundEffectPrompt {
    return SOUND_EFFECT_PROMPTS[category];
  }

  /**
   * Get all prompting guides
   */
  static getAllPromptingGuides(): Record<SoundEffectCategory, SoundEffectPrompt> {
    return SOUND_EFFECT_PROMPTS;
  }

  /**
   * Search for sound effect examples by keyword
   */
  static searchSoundEffectExamples(keyword: string): Array<{ category: SoundEffectCategory; example: string }> {
    const results: Array<{ category: SoundEffectCategory; example: string }> = [];
    const lowerKeyword = keyword.toLowerCase();

    for (const [category, prompt] of Object.entries(SOUND_EFFECT_PROMPTS)) {
      for (const example of prompt.examples) {
        if (example.toLowerCase().includes(lowerKeyword)) {
          results.push({ category: category as SoundEffectCategory, example });
        }
      }
    }

    return results;
  }

  /**
   * Get recommended sound effect options based on category
   */
  static getRecommendedOptions(category: SoundEffectCategory, text: string): Partial<SoundEffectOptions> {
    const guide = SOUND_EFFECT_PROMPTS[category];
    
    const options: Partial<SoundEffectOptions> = {
      model_id: 'eleven_text_to_sound_v2',
      prompt_influence: 0.3
    };

    // Set duration based on category
    switch (category) {
      case 'one_shot':
        options.duration_seconds = 1.0;
        break;
      case 'loop':
        options.loop = true;
        options.duration_seconds = 10.0;
        break;
      case 'ambience':
      case 'atmospheric':
        options.loop = true;
        options.duration_seconds = 15.0;
        break;
      case 'drone':
        options.duration_seconds = 8.0;
        break;
      case 'musical':
        options.duration_seconds = 4.0;
        break;
      default:
        options.duration_seconds = 3.0;
    }

    // Adjust prompt influence based on category
    if (category === 'cinematic' || category === 'braam') {
      options.prompt_influence = 0.5; // Higher influence for cinematic effects
    } else if (category === 'ambience' || category === 'atmospheric') {
      options.prompt_influence = 0.2; // Lower influence for more creative ambience
    }

    return options;
  }

  /**
   * Validate sound effect text description
   */
  static validateSoundEffectText(text: string): { isValid: boolean; suggestions: string[] } {
    const suggestions: string[] = [];
    let isValid = true;

    if (!text.trim()) {
      isValid = false;
      suggestions.push('Text description is required');
    }

    if (text.length < 10) {
      suggestions.push('Consider adding more detail to your description');
    }

    if (text.length > 200) {
      suggestions.push('Very long descriptions may not work as well - consider simplifying');
    }

    // Check for common issues
    if (!/[a-zA-Z]/.test(text)) {
      isValid = false;
      suggestions.push('Description must contain letters');
    }

    // Suggest improvements
    if (!text.includes(' ') && text.length > 5) {
      suggestions.push('Consider adding descriptive words (e.g., "loud", "soft", "dramatic")');
    }

    return { isValid, suggestions };
  }

  /**
   * Get sound effect examples by category
   */
  static getExamplesByCategory(category: SoundEffectCategory): string[] {
    return SOUND_EFFECT_PROMPTS[category]?.examples || [];
  }

  /**
   * Get tips for a specific category
   */
  static getTipsByCategory(category: SoundEffectCategory): string[] {
    return SOUND_EFFECT_PROMPTS[category]?.tips || [];
  }

  /**
   * Generate a random sound effect example
   */
  static getRandomExample(category?: SoundEffectCategory): { category: SoundEffectCategory; example: string } {
    const categories = category ? [category] : this.getSoundEffectCategories();
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const examples = this.getExamplesByCategory(randomCategory);
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    
    return { category: randomCategory, example: randomExample };
  }

  /**
   * Get popular sound effect combinations
   */
  static getPopularCombinations(): Array<{ name: string; description: string; examples: string[] }> {
    return [
      {
        name: 'Cinematic Impact',
        description: 'Dramatic sound effects for trailers and films',
        examples: [
          'Cinematic braam, horror',
          'Epic trailer whoosh',
          'Dramatic crescendo',
          'Movie impact hit'
        ]
      },
      {
        name: 'Nature Ambience',
        description: 'Natural environmental sounds',
        examples: [
          'Soft rain on leaves',
          'Forest with birds',
          'Ocean waves',
          'Wind through trees'
        ]
      },
      {
        name: 'Musical Elements',
        description: 'Musical components and loops',
        examples: [
          '90s hip-hop drum loop, 90 BPM',
          'Vintage brass stabs in F minor',
          'Atmospheric synth pad',
          'Electronic beat with reverb'
        ]
      },
      {
        name: 'Foley Effects',
        description: 'Realistic everyday sounds',
        examples: [
          'Footsteps on wooden floor',
          'Paper rustling',
          'Keys jingling',
          'Water dripping'
        ]
      }
    ];
  }
}

// Export default instance
export const soundEffectsManager = new SoundEffectsManager();
