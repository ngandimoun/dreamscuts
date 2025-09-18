/**
 * Music Manager
 * 
 * Utility functions for managing music generation and prompting.
 * Based on the official ElevenLabs Music documentation.
 */

import type { 
  MusicGenre, 
  MusicMood, 
  MusicInstrument, 
  MusicStructure,
  MusicPrompt,
  MusicExample,
  CompositionPlan,
  MusicSection
} from './types';

// Music Genres
export const MUSIC_GENRES: MusicGenre[] = [
  'electronic', 'rock', 'pop', 'hip-hop', 'jazz', 'classical', 'country', 'blues',
  'folk', 'reggae', 'funk', 'soul', 'r&b', 'metal', 'punk', 'indie', 'alternative',
  'ambient', 'techno', 'house', 'trance', 'dubstep', 'drum-and-bass', 'synthwave',
  'lo-fi', 'chill', 'cinematic', 'orchestral', 'acoustic', 'experimental', 'world',
  'latin', 'flamenco', 'salsa', 'bossa-nova', 'tango', 'samba', 'reggaeton',
  'k-pop', 'j-pop', 'anime', 'video-game', 'trailer', 'corporate', 'advertising'
];

// Music Moods
export const MUSIC_MOODS: MusicMood[] = [
  'energetic', 'calm', 'happy', 'sad', 'melancholic', 'uplifting', 'dramatic',
  'mysterious', 'romantic', 'aggressive', 'peaceful', 'nostalgic', 'epic',
  'intense', 'relaxing', 'dark', 'bright', 'emotional', 'powerful', 'gentle',
  'fierce', 'dreamy', 'atmospheric', 'driving', 'contemplative', 'celebratory',
  'ominous', 'hopeful', 'triumphant', 'brooding', 'playful', 'serious'
];

// Music Instruments
export const MUSIC_INSTRUMENTS: MusicInstrument[] = [
  'piano', 'guitar', 'bass', 'drums', 'violin', 'cello', 'viola', 'flute',
  'saxophone', 'trumpet', 'trombone', 'clarinet', 'oboe', 'bassoon', 'harp',
  'organ', 'synthesizer', 'electric-guitar', 'acoustic-guitar', 'bass-guitar',
  'drum-machine', 'sampler', 'vocals', 'choir', 'strings', 'brass', 'woodwinds',
  'percussion', 'bells', 'chimes', 'xylophone', 'marimba', 'vibraphone',
  'accordion', 'harmonica', 'banjo', 'mandolin', 'ukulele', 'sitar', 'tabla'
];

// Music Structures
export const MUSIC_STRUCTURES: MusicStructure[] = [
  'intro', 'verse', 'chorus', 'bridge', 'outro', 'breakdown', 'drop', 'buildup',
  'pre-chorus', 'post-chorus', 'instrumental', 'solo', 'interlude', 'coda',
  'verse-1', 'verse-2', 'chorus-1', 'chorus-2', 'bridge-1', 'bridge-2'
];

// Music Prompting Categories
export const MUSIC_PROMPTS: Record<string, MusicPrompt> = {
  video_game: {
    category: 'video_game',
    description: 'High-energy tracks for video games, action sequences, and interactive media',
    examples: [
      'Create an intense, fast-paced electronic track for a high-adrenaline video game scene. Use driving synth arpeggios, punchy drums, distorted bass, glitch effects, and aggressive rhythmic textures. The tempo should be fast, 130–150 bpm, with rising tension, quick transitions, and dynamic energy bursts.',
      'Epic orchestral battle music with soaring strings, powerful brass, and thunderous percussion for a fantasy RPG boss fight.',
      'Retro 8-bit chiptune with catchy melodies and upbeat tempo for a platformer game.'
    ],
    tips: [
      'Focus on energy and intensity',
      'Include tempo specifications (BPM)',
      'Use dynamic descriptors (rising tension, energy bursts)',
      'Consider the game genre and scene context'
    ],
    recommended_duration_ms: 60000,
    common_instruments: ['synthesizer', 'drums', 'electric-guitar', 'strings', 'brass'],
    common_moods: ['energetic', 'intense', 'epic', 'dramatic', 'driving']
  },
  commercial: {
    category: 'commercial',
    description: 'Music for advertisements, marketing, and promotional content',
    examples: [
      'Track for a high-end mascara commercial. Upbeat and polished. Voiceover only. The script begins: "We bring you the most volumizing mascara yet." Mention the brand name "X" at the end.',
      'Upbeat corporate jingle with bright synthesizers, punchy drums, and an optimistic melody for a tech startup.',
      'Elegant and sophisticated orchestral piece for a luxury car advertisement.'
    ],
    tips: [
      'Focus on brand alignment and target audience',
      'Consider the product or service being advertised',
      'Use positive, uplifting descriptors',
      'Specify if voiceover is needed'
    ],
    recommended_duration_ms: 30000,
    common_instruments: ['synthesizer', 'piano', 'strings', 'drums', 'vocals'],
    common_moods: ['uplifting', 'bright', 'optimistic', 'energetic', 'sophisticated']
  },
  cinematic: {
    category: 'cinematic',
    description: 'Music for films, trailers, and cinematic content',
    examples: [
      'A slow, melancholic piano melody over ambient synth textures, suitable for a tragic film scene.',
      'Dark, atmospheric electronic track with deep bass, glitchy percussion, and haunting vocal samples.',
      'Epic orchestral piece with full symphony, choir, and dramatic crescendos for a movie trailer.'
    ],
    tips: [
      'Focus on emotional impact and scene context',
      'Use atmospheric and mood descriptors',
      'Consider the narrative arc and pacing',
      'Include specific instruments for orchestral pieces'
    ],
    recommended_duration_ms: 120000,
    common_instruments: ['orchestra', 'strings', 'brass', 'piano', 'choir', 'synthesizer'],
    common_moods: ['dramatic', 'atmospheric', 'epic', 'melancholic', 'mysterious']
  },
  ambient: {
    category: 'ambient',
    description: 'Atmospheric and background music for relaxation, meditation, and ambient spaces',
    examples: [
      'Soft, ethereal ambient track with gentle pad sounds, subtle reverb, and peaceful atmosphere.',
      'Nature-inspired ambient music with bird sounds, flowing water, and organic textures.',
      'Minimalist ambient piece with long, sustained tones and subtle harmonic movement.'
    ],
    tips: [
      'Focus on atmosphere and texture',
      'Use gentle, peaceful descriptors',
      'Consider the intended environment',
      'Avoid complex rhythms or melodies'
    ],
    recommended_duration_ms: 300000,
    common_instruments: ['synthesizer', 'piano', 'strings', 'flute', 'harp'],
    common_moods: ['calm', 'peaceful', 'atmospheric', 'dreamy', 'contemplative']
  },
  electronic: {
    category: 'electronic',
    description: 'Electronic music across various subgenres and styles',
    examples: [
      '1980s synthwave with analog synthesizers, retro drum machines, and nostalgic atmosphere.',
      'Deep house track with four-on-the-floor kick, warm bassline, and soulful vocal samples.',
      'Experimental electronic piece with glitchy textures, unconventional rhythms, and futuristic sounds.'
    ],
    tips: [
      'Specify the electronic subgenre',
      'Include specific electronic elements (synths, drum machines)',
      'Use tempo and rhythm descriptors',
      'Consider the era or style influence'
    ],
    recommended_duration_ms: 180000,
    common_instruments: ['synthesizer', 'drum-machine', 'sampler', 'bass', 'vocals'],
    common_moods: ['energetic', 'atmospheric', 'futuristic', 'nostalgic', 'driving']
  },
  acoustic: {
    category: 'acoustic',
    description: 'Acoustic and organic music with natural instruments',
    examples: [
      'Fingerpicked acoustic guitar with warm, intimate vocals and subtle string accompaniment.',
      'Folk song with banjo, harmonica, and storytelling lyrics about traveling.',
      'Jazz trio with piano, upright bass, and brushed drums in a smoky club atmosphere.'
    ],
    tips: [
      'Focus on natural, organic sounds',
      'Specify acoustic instruments',
      'Consider the musical tradition or style',
      'Use warm, intimate descriptors'
    ],
    recommended_duration_ms: 240000,
    common_instruments: ['acoustic-guitar', 'piano', 'violin', 'bass', 'drums', 'vocals'],
    common_moods: ['warm', 'intimate', 'nostalgic', 'peaceful', 'emotional']
  },
  instrumental: {
    category: 'instrumental',
    description: 'Purely instrumental music without vocals',
    examples: [
      'Instrumental only. Upbeat funk track with a prominent slap bass line, funky rhythm guitar, and a horn section.',
      'Classical string quartet with violin, viola, and cello performing a beautiful melody.',
      'Solo piano piece with emotional depth and technical virtuosity.'
    ],
    tips: [
      'Always specify "instrumental only"',
      'Focus on instrumental arrangement',
      'Describe the musical complexity',
      'Consider the performance context'
    ],
    recommended_duration_ms: 180000,
    common_instruments: ['piano', 'guitar', 'strings', 'brass', 'woodwinds', 'percussion'],
    common_moods: ['emotional', 'technical', 'beautiful', 'complex', 'virtuosic']
  }
};

// Official Music Examples
export const MUSIC_EXAMPLES: MusicExample[] = [
  {
    title: 'Video Game Electronic Track',
    prompt: 'Create an intense, fast-paced electronic track for a high-adrenaline video game scene. Use driving synth arpeggios, punchy drums, distorted bass, glitch effects, and aggressive rhythmic textures. The tempo should be fast, 130–150 bpm, with rising tension, quick transitions, and dynamic energy bursts.',
    genre: 'electronic',
    mood: 'intense',
    duration_ms: 10000,
    instruments: ['synthesizer', 'drums', 'bass', 'sampler'],
    structure: ['intro', 'buildup', 'drop', 'breakdown'],
    use_case: 'video_game',
    description: 'High-energy electronic track for action video games'
  },
  {
    title: 'Mascara Commercial',
    prompt: 'Track for a high-end mascara commercial. Upbeat and polished. Voiceover only. The script begins: "We bring you the most volumizing mascara yet." Mention the brand name "X" at the end.',
    genre: 'corporate',
    mood: 'uplifting',
    duration_ms: 30000,
    instruments: ['synthesizer', 'piano', 'strings'],
    structure: ['intro', 'verse', 'outro'],
    use_case: 'advertising',
    description: 'Upbeat commercial track with voiceover integration'
  },
  {
    title: 'Live Indie Rock Performance',
    prompt: 'Write a raw, emotionally charged track that fuses alternative R&B, gritty soul, indie rock, and folk. The song should still feel like a live, one-take, emotionally spontaneous performance. A female vocalist begins at 15 seconds: "I tried to leave the light on, just in case you turned around But all the shadows answered back, and now I\'m burning out My voice is shaking in the silence you left behind But I keep singing to the smoke, hoping love is still alive"',
    genre: 'indie',
    mood: 'emotional',
    duration_ms: 180000,
    instruments: ['electric-guitar', 'bass', 'drums', 'vocals'],
    structure: ['intro', 'verse', 'chorus', 'bridge', 'outro'],
    use_case: 'music_production',
    description: 'Raw, emotional indie rock with live performance feel'
  },
  {
    title: 'Cinematic Orchestral Piece',
    prompt: 'A slow, melancholic piano melody over ambient synth textures, suitable for a tragic film scene.',
    genre: 'cinematic',
    mood: 'melancholic',
    duration_ms: 120000,
    instruments: ['piano', 'strings', 'synthesizer'],
    structure: ['intro', 'verse', 'bridge', 'outro'],
    use_case: 'film',
    description: 'Emotional orchestral piece for dramatic film scenes'
  },
  {
    title: 'Ambient Meditation',
    prompt: 'Soft, ethereal ambient track with gentle pad sounds, subtle reverb, and peaceful atmosphere.',
    genre: 'ambient',
    mood: 'peaceful',
    duration_ms: 300000,
    instruments: ['synthesizer', 'piano', 'strings'],
    structure: ['intro', 'ambient', 'outro'],
    use_case: 'meditation',
    description: 'Calming ambient music for relaxation and meditation'
  },
  {
    title: '1980s Synthwave',
    prompt: '1980s synthwave with analog synthesizers, retro drum machines, and nostalgic atmosphere.',
    genre: 'synthwave',
    mood: 'nostalgic',
    duration_ms: 180000,
    instruments: ['synthesizer', 'drum-machine', 'bass'],
    structure: ['intro', 'verse', 'chorus', 'bridge', 'outro'],
    use_case: 'music_production',
    description: 'Retro synthwave with 1980s aesthetic'
  },
  {
    title: 'Acoustic Folk Song',
    prompt: 'Fingerpicked acoustic guitar with warm, intimate vocals and subtle string accompaniment.',
    genre: 'folk',
    mood: 'warm',
    duration_ms: 240000,
    instruments: ['acoustic-guitar', 'violin', 'vocals'],
    structure: ['intro', 'verse', 'chorus', 'bridge', 'outro'],
    use_case: 'music_production',
    description: 'Intimate acoustic folk with warm vocals'
  },
  {
    title: 'Funk Instrumental',
    prompt: 'Instrumental only. Upbeat funk track with a prominent slap bass line, funky rhythm guitar, and a horn section.',
    genre: 'funk',
    mood: 'energetic',
    duration_ms: 180000,
    instruments: ['bass-guitar', 'electric-guitar', 'brass', 'drums'],
    structure: ['intro', 'verse', 'chorus', 'solo', 'outro'],
    use_case: 'music_production',
    description: 'High-energy funk instrumental with horn section'
  }
];

export class MusicManager {
  /**
   * Get all available music genres
   */
  static getMusicGenres(): MusicGenre[] {
    return MUSIC_GENRES;
  }

  /**
   * Get all available music moods
   */
  static getMusicMoods(): MusicMood[] {
    return MUSIC_MOODS;
  }

  /**
   * Get all available music instruments
   */
  static getMusicInstruments(): MusicInstrument[] {
    return MUSIC_INSTRUMENTS;
  }

  /**
   * Get all available music structures
   */
  static getMusicStructures(): MusicStructure[] {
    return MUSIC_STRUCTURES;
  }

  /**
   * Get all music prompting categories
   */
  static getMusicCategories(): string[] {
    return Object.keys(MUSIC_PROMPTS);
  }

  /**
   * Get prompting guide for a specific category
   */
  static getPromptingGuide(category: string): MusicPrompt {
    return MUSIC_PROMPTS[category];
  }

  /**
   * Get all prompting guides
   */
  static getAllPromptingGuides(): Record<string, MusicPrompt> {
    return MUSIC_PROMPTS;
  }

  /**
   * Get all music examples
   */
  static getMusicExamples(): MusicExample[] {
    return MUSIC_EXAMPLES;
  }

  /**
   * Get examples by genre
   */
  static getExamplesByGenre(genre: MusicGenre): MusicExample[] {
    return MUSIC_EXAMPLES.filter(example => example.genre === genre);
  }

  /**
   * Get examples by mood
   */
  static getExamplesByMood(mood: MusicMood): MusicExample[] {
    return MUSIC_EXAMPLES.filter(example => example.mood === mood);
  }

  /**
   * Get examples by use case
   */
  static getExamplesByUseCase(useCase: string): MusicExample[] {
    return MUSIC_EXAMPLES.filter(example => example.use_case === useCase);
  }

  /**
   * Search examples by keyword
   */
  static searchExamples(keyword: string): MusicExample[] {
    const lowerKeyword = keyword.toLowerCase();
    return MUSIC_EXAMPLES.filter(example => 
      example.title.toLowerCase().includes(lowerKeyword) ||
      example.prompt.toLowerCase().includes(lowerKeyword) ||
      example.genre.toLowerCase().includes(lowerKeyword) ||
      example.mood.toLowerCase().includes(lowerKeyword) ||
      example.use_case.toLowerCase().includes(lowerKeyword) ||
      example.description.toLowerCase().includes(lowerKeyword)
    );
  }

  /**
   * Get recommended duration for a category
   */
  static getRecommendedDuration(category: string): number {
    return MUSIC_PROMPTS[category]?.recommended_duration_ms || 30000;
  }

  /**
   * Generate a music prompt from parameters
   */
  static generatePrompt(params: {
    genre?: MusicGenre;
    mood?: MusicMood;
    instruments?: MusicInstrument[];
    structure?: MusicStructure[];
    useCase?: string;
    duration?: number;
    includeVocals?: boolean;
    tempo?: number;
    key?: string;
    customDescription?: string;
  }): string {
    const {
      genre,
      mood,
      instruments,
      structure,
      useCase,
      duration,
      includeVocals = true,
      tempo,
      key,
      customDescription
    } = params;

    let prompt = '';

    // Add custom description if provided
    if (customDescription) {
      prompt += customDescription;
    } else {
      // Build prompt from parameters
      if (genre) prompt += `${genre} `;
      if (mood) prompt += `${mood} `;
      
      if (instruments && instruments.length > 0) {
        prompt += `with ${instruments.join(', ')} `;
      }
      
      if (structure && structure.length > 0) {
        prompt += `featuring ${structure.join(', ')} structure `;
      }
      
      if (useCase) {
        prompt += `suitable for ${useCase} `;
      }
      
      if (tempo) {
        prompt += `at ${tempo} BPM `;
      }
      
      if (key) {
        prompt += `in ${key} `;
      }
      
      if (!includeVocals) {
        prompt += 'instrumental only ';
      }
      
      if (duration) {
        const durationSeconds = Math.round(duration / 1000);
        prompt += `(${durationSeconds} seconds)`;
      }
    }

    return prompt.trim();
  }

  /**
   * Validate music prompt
   */
  static validatePrompt(prompt: string): { isValid: boolean; suggestions: string[] } {
    const suggestions: string[] = [];
    let isValid = true;

    if (!prompt.trim()) {
      isValid = false;
      suggestions.push('Prompt is required');
    }

    if (prompt.length < 10) {
      suggestions.push('Consider adding more detail to your prompt');
    }

    // Check for key elements
    const hasGenre = MUSIC_GENRES.some(genre => 
      prompt.toLowerCase().includes(genre.toLowerCase())
    );
    if (!hasGenre) {
      suggestions.push('Consider specifying a genre (electronic, rock, pop, etc.)');
    }

    const hasMood = MUSIC_MOODS.some(mood => 
      prompt.toLowerCase().includes(mood.toLowerCase())
    );
    if (!hasMood) {
      suggestions.push('Consider adding mood descriptors (energetic, calm, dramatic, etc.)');
    }

    const hasInstruments = MUSIC_INSTRUMENTS.some(instrument => 
      prompt.toLowerCase().includes(instrument.toLowerCase())
    );
    if (!hasInstruments) {
      suggestions.push('Consider specifying instruments (piano, guitar, drums, etc.)');
    }

    return { isValid, suggestions };
  }

  /**
   * Get random music example
   */
  static getRandomExample(): MusicExample {
    const randomIndex = Math.floor(Math.random() * MUSIC_EXAMPLES.length);
    return MUSIC_EXAMPLES[randomIndex];
  }

  /**
   * Get examples by duration range
   */
  static getExamplesByDuration(minMs: number, maxMs: number): MusicExample[] {
    return MUSIC_EXAMPLES.filter(example => 
      example.duration_ms >= minMs && example.duration_ms <= maxMs
    );
  }

  /**
   * Create a composition plan from parameters
   */
  static createCompositionPlan(params: {
    genre: MusicGenre;
    mood: MusicMood;
    instruments: MusicInstrument[];
    structure: MusicStructure[];
    duration: number;
    includeVocals?: boolean;
  }): CompositionPlan {
    const { genre, mood, instruments, structure, duration, includeVocals = true } = params;

    const positiveGlobalStyles = [
      genre,
      mood,
      ...instruments,
      ...(includeVocals ? ['vocals'] : ['instrumental only'])
    ];

    const negativeGlobalStyles = [
      'acoustic', // Opposite of electronic
      'slow', // Opposite of energetic
      'minimalist', // Opposite of complex
      'ambient', // Opposite of driving
      'lo-fi' // Opposite of polished
    ].filter(style => !positiveGlobalStyles.includes(style));

    const sections: MusicSection[] = structure.map((sectionName, index) => {
      const sectionDuration = Math.round(duration / structure.length);
      
      return {
        sectionName,
        positiveLocalStyles: [
          `${sectionName} style`,
          mood,
          ...instruments.slice(0, 3) // Limit to 3 instruments per section
        ],
        negativeLocalStyles: negativeGlobalStyles.slice(0, 2),
        durationMs: sectionDuration,
        lines: includeVocals ? [
          {
            text: `[${sectionName} lyrics]`,
            startTimeMs: index * sectionDuration,
            endTimeMs: (index + 1) * sectionDuration
          }
        ] : []
      };
    });

    return {
      positiveGlobalStyles,
      negativeGlobalStyles,
      sections
    };
  }

  /**
   * Analyze music prompt and suggest improvements
   */
  static analyzePrompt(prompt: string): {
    score: number;
    strengths: string[];
    improvements: string[];
    suggestions: string[];
  } {
    const strengths: string[] = [];
    const improvements: string[] = [];
    const suggestions: string[] = [];
    let score = 0;

    // Check length
    if (prompt.length >= 20) {
      score += 20;
      strengths.push('Good prompt length');
    } else {
      improvements.push('Prompt could be more detailed');
    }

    // Check for genre
    const hasGenre = MUSIC_GENRES.some(genre => 
      prompt.toLowerCase().includes(genre.toLowerCase())
    );
    if (hasGenre) {
      score += 20;
      strengths.push('Includes genre specification');
    } else {
      improvements.push('Missing genre specification');
      suggestions.push('Add a genre like "electronic", "rock", "pop", etc.');
    }

    // Check for mood
    const hasMood = MUSIC_MOODS.some(mood => 
      prompt.toLowerCase().includes(mood.toLowerCase())
    );
    if (hasMood) {
      score += 20;
      strengths.push('Includes mood descriptor');
    } else {
      improvements.push('Missing mood descriptor');
      suggestions.push('Add mood descriptors like "energetic", "calm", "dramatic", etc.');
    }

    // Check for instruments
    const hasInstruments = MUSIC_INSTRUMENTS.some(instrument => 
      prompt.toLowerCase().includes(instrument.toLowerCase())
    );
    if (hasInstruments) {
      score += 15;
      strengths.push('Includes instrument specification');
    } else {
      improvements.push('Missing instrument specification');
      suggestions.push('Specify instruments like "piano", "guitar", "drums", etc.');
    }

    // Check for structure
    const hasStructure = MUSIC_STRUCTURES.some(structure => 
      prompt.toLowerCase().includes(structure.toLowerCase())
    );
    if (hasStructure) {
      score += 10;
      strengths.push('Includes structure information');
    } else {
      suggestions.push('Consider adding structure like "intro", "verse", "chorus", etc.');
    }

    // Check for use case
    const hasUseCase = prompt.toLowerCase().includes('for ') || 
                      prompt.toLowerCase().includes('suitable for') ||
                      prompt.toLowerCase().includes('perfect for');
    if (hasUseCase) {
      score += 10;
      strengths.push('Includes use case context');
    } else {
      suggestions.push('Consider adding use case like "for video games", "for commercials", etc.');
    }

    // Check for tempo
    const hasTempo = /\d+\s*bpm/i.test(prompt);
    if (hasTempo) {
      score += 5;
      strengths.push('Includes tempo specification');
    } else {
      suggestions.push('Consider adding tempo like "120 BPM" or "fast tempo"');
    }

    return { score, strengths, improvements, suggestions };
  }
}

// Export default instance
export const musicManager = new MusicManager();
