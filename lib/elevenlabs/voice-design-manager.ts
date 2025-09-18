/**
 * Voice Design Manager
 * 
 * Utility functions for managing voice design and prompting.
 * Based on the official ElevenLabs Voice Design documentation.
 */

import type { 
  VoiceDesignPrompt, 
  VoiceDesignAttributes, 
  VoiceDesignExample,
  VoiceDesignOptions 
} from './types';

// Voice Design Models
export const VOICE_DESIGN_MODELS = [
  {
    model_id: 'eleven_multilingual_ttv_v2',
    name: 'Eleven Multilingual TTV v2',
    description: 'Multilingual text-to-voice model with broad language support',
    capabilities: ['text_to_voice', 'multilingual', 'voice_design'],
    max_description_length: 1000,
    min_description_length: 20,
    supports_reference_audio: false
  },
  {
    model_id: 'eleven_ttv_v3',
    name: 'Eleven TTV v3',
    description: 'Latest text-to-voice model with enhanced quality and reference audio support',
    capabilities: ['text_to_voice', 'voice_design', 'reference_audio', 'enhanced_quality'],
    max_description_length: 1000,
    min_description_length: 20,
    supports_reference_audio: true
  }
];

// Voice Design Attributes
export const VOICE_DESIGN_ATTRIBUTES: VoiceDesignAttributes = {
  age: [
    'adolescent', 'young', 'younger', 'adult', 'middle-aged', 'old', 'elderly',
    'in his/her 20s', 'in his/her 30s', 'in his/her 40s', 'in his/her 50s',
    'in his/her 60s', 'in his/her 70s', 'in his/her 80s', 'teenager',
    'young adult', 'mature', 'senior'
  ],
  accent: [
    'thick French accent', 'slight Asian-American accent', 'Southern American accent',
    'thick Scottish accent', 'British accent', 'Australian accent', 'Irish accent',
    'German accent', 'Italian accent', 'Spanish accent', 'Russian accent',
    'Eastern European accent', 'New York accent', 'Southern drawl', 'neutral American accent',
    'regional Australian accent', 'proper British accent', 'crisp British accent',
    'soft Irish lilt', 'heavy Eastern European accent', 'thick New York accent'
  ],
  gender: [
    'male', 'female', 'gender-neutral', 'ambiguous gender', 'masculine', 'feminine',
    'lower-pitched female voice', 'husky female voice', 'masculine male voice',
    'neutral gender', 'soft and mid-pitched'
  ],
  tone_timbre_pitch: [
    'deep', 'low-pitched', 'smooth', 'rich', 'gravelly', 'raspy', 'nasally', 'shrill',
    'airy', 'breathy', 'booming', 'resonant', 'light', 'thin', 'warm', 'mellow',
    'tinny', 'metallic', 'buttery', 'throaty', 'harsh', 'robotic', 'ethereal',
    'silly', 'resonant', 'husky', 'squeaky', 'cute', 'authoritative', 'tough',
    'world-weary', 'cynical', 'eccentric', 'manic', 'contemplative'
  ],
  pacing: [
    'normal cadence', 'fast-paced', 'quickly', 'slowly', 'drawn out', 'calm pace',
    'natural pace', 'conversational pace', 'speaking quickly', 'at a fast pace',
    'speaking normally', 'at a normal pace', 'speaking slowly', 'with a slow rhythm',
    'deliberate and measured pacing', 'drawn out, as if savoring each word',
    'with a hurried cadence', 'relaxed and conversational pacing',
    'rhythmic and musical in pace', 'erratic pacing', 'even pacing',
    'staccato delivery', 'rapid', 'erratic speech patterns', 'accelerating with excitement'
  ],
  audio_quality: [
    'perfect audio quality', 'studio-quality recording', 'audio quality is perfect',
    'low-fidelity audio', 'poor audio quality', 'sounds like a voicemail',
    'muffled and distant', 'like on an old tape recorder', 'audio quality is ok',
    'high-quality audio', 'crystal clear audio', 'professional recording quality'
  ],
  character_profession: [
    'pirate', 'businessman', 'farmer', 'politician', 'therapist', 'ogre', 'godlike being',
    'TV announcer', 'sports commentator', 'drill sergeant', 'evil ogre', 'entrepreneur',
    'Southern woman', 'movie trailer voice', 'squeaky mouse', 'angry pirate', 'New Yorker',
    'mad scientist', 'scientist', 'genius', 'revolutionary', 'narrator', 'virtual assistant',
    'character', 'professional', 'expert', 'specialist', 'authority', 'leader'
  ],
  emotion: [
    'energetic', 'excited', 'sad', 'emotional', 'sarcastic', 'dry', 'passionate',
    'enthusiastic', 'lively', 'immersed', 'angry', 'silly', 'sweet', 'dramatic',
    'cheerful', 'authoritative', 'tough', 'world-weary', 'cynical', 'eccentric',
    'manic', 'contemplative', 'calm', 'reflective', 'friendly', 'warm', 'expressive',
    'humorous', 'serious', 'playful', 'mysterious', 'confident', 'nervous', 'relaxed'
  ],
  pitch: [
    'low-pitched', 'high-pitched', 'normal pitch', 'deep', 'shrill', 'squeaky',
    'booming', 'resonant', 'thin', 'light', 'metallic', 'tinny', 'husky',
    'breathy', 'airy', 'gravelly', 'raspy', 'smooth', 'rich', 'warm', 'mellow'
  ]
};

// Voice Design Prompting Categories
export const VOICE_DESIGN_PROMPTS: Record<string, VoiceDesignPrompt> = {
  professional: {
    category: 'professional',
    description: 'Professional voices for business, education, and formal content',
    examples: [
      'A professional male narrator with a calm, authoritative tone',
      'A businesswoman in her 30s with a confident, clear voice',
      'A mature male voice with perfect audio quality, ideal for presentations',
      'A professional female voice with a warm, engaging tone'
    ],
    tips: [
      'Focus on clarity and authority',
      'Include "perfect audio quality" for professional results',
      'Specify age and gender for consistency',
      'Use neutral accents for broad appeal'
    ],
    recommended_guidance_scale: 25,
    recommended_text_length: 200
  },
  character: {
    category: 'character',
    description: 'Character voices for storytelling, games, and entertainment',
    examples: [
      'A wise old wizard with a deep, mystical voice',
      'A mischievous fairy with a high-pitched, playful tone',
      'A gruff pirate captain with a thick Scottish accent',
      'A young hero with an energetic, determined voice'
    ],
    tips: [
      'Be specific about personality traits',
      'Include age, gender, and emotional characteristics',
      'Use descriptive adjectives for tone and timbre',
      'Consider the character\'s background and role'
    ],
    recommended_guidance_scale: 35,
    recommended_text_length: 300
  },
  narrator: {
    category: 'narrator',
    description: 'Narrator voices for audiobooks, documentaries, and storytelling',
    examples: [
      'A calm, reflective narrator with a smooth, engaging voice',
      'A dramatic narrator with perfect audio quality for audiobooks',
      'A warm, grandmotherly voice telling bedtime stories',
      'A professional male narrator with a rich, authoritative tone'
    ],
    tips: [
      'Focus on pacing and clarity',
      'Include emotional tone (calm, dramatic, warm)',
      'Specify the type of content (audiobooks, documentaries)',
      'Use longer, more detailed descriptions'
    ],
    recommended_guidance_scale: 30,
    recommended_text_length: 250
  },
  commercial: {
    category: 'commercial',
    description: 'Commercial voices for advertising, marketing, and promotional content',
    examples: [
      'A energetic female voice perfect for commercials',
      'A confident male voice with studio-quality recording',
      'A friendly, approachable voice for product advertisements',
      'A professional announcer with perfect audio quality'
    ],
    tips: [
      'Emphasize energy and engagement',
      'Include "studio-quality recording" for best results',
      'Specify the commercial context',
      'Use positive, appealing descriptors'
    ],
    recommended_guidance_scale: 25,
    recommended_text_length: 200
  },
  educational: {
    category: 'educational',
    description: 'Educational voices for tutorials, courses, and instructional content',
    examples: [
      'A patient, clear instructor with perfect audio quality',
      'A knowledgeable teacher with a warm, encouraging tone',
      'A professional educator with a calm, measured pace',
      'An expert narrator with crystal clear pronunciation'
    ],
    tips: [
      'Focus on clarity and patience',
      'Include educational context',
      'Specify pacing (calm, measured)',
      'Emphasize audio quality for learning'
    ],
    recommended_guidance_scale: 30,
    recommended_text_length: 250
  },
  entertainment: {
    category: 'entertainment',
    description: 'Entertainment voices for games, animations, and media',
    examples: [
      'A quirky game character with a unique, memorable voice',
      'A cartoon villain with an exaggerated, dramatic tone',
      'A fantasy creature with an otherworldly, ethereal voice',
      'A comedic character with a playful, energetic delivery'
    ],
    tips: [
      'Be creative and specific',
      'Include entertainment context (games, cartoons)',
      'Use vivid, descriptive language',
      'Consider the target audience'
    ],
    recommended_guidance_scale: 40,
    recommended_text_length: 300
  }
};

// Official Voice Design Examples
export const VOICE_DESIGN_EXAMPLES: VoiceDesignExample[] = [
  {
    voice_type: 'Female Sports Commentator',
    prompt: 'A high-energy female sports commentator with a thick British accent, passionately delivering play-by-play coverage of a football match in a very quick pace. Her voice is lively, enthusiastic, and fully immersed in the action.',
    text_preview: 'OH MY WORD — WHAT A GOAL! She picks it up just past midfield, dances through TWO defenders like they\'re not even THERE, and absolutely SMASHES it into the top corner! The goalkeeper had NO CHANCE! That is WORLD-CLASS from the young forward, and the crowd is on their FEET! This match has come ALIVE, and you can FEEL the momentum SHIFTING!',
    guidance_scale: 25,
    model_id: 'eleven_multilingual_ttv_v2',
    expected_characteristics: ['high-energy', 'British accent', 'quick pace', 'enthusiastic', 'lively']
  },
  {
    voice_type: 'Drill Sergeant',
    prompt: 'An army drill sergeant shouting at his team of soldiers. He sounds angry and is speaking at a fast pace.',
    text_preview: 'LISTEN UP, you sorry lot! I didn\'t come here to babysit — I came to BUILD SOLDIERS! You move when I say move, and you breathe when I say breathe! You\'ve got ten seconds to fall in line or you\'ll regret it!!',
    guidance_scale: 25,
    model_id: 'eleven_multilingual_ttv_v2',
    expected_characteristics: ['angry', 'fast pace', 'authoritative', 'military', 'shouting']
  },
  {
    voice_type: 'Evil Ogre',
    prompt: 'A massive evil ogre speaking at a quick pace. He has a silly and resonant tone.',
    text_preview: 'Your weapons are but toothpicks to me. [laughs] Surrender now and I may grant you a swift end. I\'ve toppled kingdoms and devoured armies. What hope do you have against me?',
    guidance_scale: 30,
    model_id: 'eleven_multilingual_ttv_v2',
    expected_characteristics: ['evil', 'silly', 'resonant', 'quick pace', 'threatening']
  },
  {
    voice_type: 'Relatable British Entrepreneur',
    prompt: 'Excellent audio quality. A man in his 30s to early 40s with a thick British accent speaking at a natural pace like he\'s talking to a friend.',
    text_preview: '[laughs] See, that\'s the thing. YOU see a company, while I see... [lip smacks] I see a promise, ya know what I mean? [exhales] We don\'t build just to profit, we build to, to UPLIFT! If our technology doesn\'t leave the world kinder, smarter, and more connected than we found it… [sighs] then what are we even doing here?',
    guidance_scale: 40,
    model_id: 'eleven_multilingual_ttv_v2',
    expected_characteristics: ['British accent', 'natural pace', 'friendly', '30s-40s', 'perfect audio quality']
  },
  {
    voice_type: 'Southern Woman',
    prompt: 'An older woman with a thick Southern accent. She is sweet and sarcastic.',
    text_preview: 'Well sugar, if all we ever do is chase titles and trophies, we\'re gonna miss the whole darn point. [light chuckle] I\'d rather build somethin\' that makes folks\' lives easier—and if I can do it in heels with a smile and a touch of sass, even better.',
    guidance_scale: 35,
    model_id: 'eleven_multilingual_ttv_v2',
    expected_characteristics: ['Southern accent', 'sweet', 'sarcastic', 'older woman', 'charming']
  },
  {
    voice_type: 'Movie Trailer Voice',
    prompt: 'Dramatic voice, used to build anticipation in movie trailers, typically associated with action or thrillers',
    text_preview: 'In a world on the brink of chaos, one hero will rise. Prepare yourself for a story of epic proportions, coming soon to the big screen.',
    guidance_scale: 20,
    model_id: 'eleven_multilingual_ttv_v2',
    expected_characteristics: ['dramatic', 'anticipation', 'cinematic', 'authoritative', 'epic']
  },
  {
    voice_type: 'Squeaky Mouse',
    prompt: 'A cute little squeaky mouse',
    text_preview: 'I may be small, but my attitude is anything but! [giggles] Watch it, big feet, or I\'ll give your toes a nibble you won\'t forget!',
    guidance_scale: 20,
    model_id: 'eleven_multilingual_ttv_v2',
    expected_characteristics: ['cute', 'squeaky', 'small', 'playful', 'attitude']
  },
  {
    voice_type: 'Angry Pirate',
    prompt: 'An angry old pirate, loud and boisterous',
    text_preview: 'I\'ve faced storms that would turn your hair white and sea monsters that would make your knees quake. You think you can cross Captain Blackheart and live to tell the tale?',
    guidance_scale: 30,
    model_id: 'eleven_multilingual_ttv_v2',
    expected_characteristics: ['angry', 'loud', 'boisterous', 'pirate', 'threatening']
  },
  {
    voice_type: 'New Yorker',
    prompt: 'Deep, gravelly thick New York accent, tough and world-weary, often cynical',
    text_preview: 'I\'ve been walking these streets longer than you can imagine, kid. There\'s nothing you can say or do that\'ll surprise me anymore.',
    guidance_scale: 40,
    model_id: 'eleven_multilingual_ttv_v2',
    expected_characteristics: ['New York accent', 'gravelly', 'tough', 'world-weary', 'cynical']
  },
  {
    voice_type: 'Mad Scientist',
    prompt: 'A voice of an eccentric scientific genius with rapid, erratic speech patterns that accelerate with excitement. His German-tinged accent becomes more pronounced when agitated. The pitch varies widely from contemplative murmurs to manic exclamations, with frequent eruptions of maniacal laughter.',
    text_preview: 'I am doctor Heinrich, revolutionary genius rejected by the narrow-minded scientific establishment! Bah! They called my theories impossible, my methods unethical—but who is laughing now? (maniacal laughter) For twenty years I have perfected my creation in this mountain laboratory, harnessing energies beyond mortal comprehension! The fools at the academy will regret their mockery when my quantum destabilizer reveals the multiverse. Or perhaps new life forms... the experiment has certain unpredictable variables... FASCINATING ones!',
    guidance_scale: 38,
    model_id: 'eleven_multilingual_ttv_v2',
    expected_characteristics: ['eccentric', 'rapid speech', 'German accent', 'manic', 'scientific']
  }
];

export class VoiceDesignManager {
  /**
   * Get all available voice design models
   */
  static getVoiceDesignModels() {
    return VOICE_DESIGN_MODELS;
  }

  /**
   * Get voice design model by ID
   */
  static getVoiceDesignModel(modelId: string) {
    return VOICE_DESIGN_MODELS.find(model => model.model_id === modelId) || null;
  }

  /**
   * Get all voice design categories
   */
  static getVoiceDesignCategories(): string[] {
    return Object.keys(VOICE_DESIGN_PROMPTS);
  }

  /**
   * Get prompting guide for a specific category
   */
  static getPromptingGuide(category: string): VoiceDesignPrompt {
    return VOICE_DESIGN_PROMPTS[category];
  }

  /**
   * Get all prompting guides
   */
  static getAllPromptingGuides(): Record<string, VoiceDesignPrompt> {
    return VOICE_DESIGN_PROMPTS;
  }

  /**
   * Get voice design attributes
   */
  static getVoiceDesignAttributes(): VoiceDesignAttributes {
    return VOICE_DESIGN_ATTRIBUTES;
  }

  /**
   * Get attributes by category
   */
  static getAttributesByCategory(category: keyof VoiceDesignAttributes): string[] {
    return VOICE_DESIGN_ATTRIBUTES[category];
  }

  /**
   * Get all voice design examples
   */
  static getVoiceDesignExamples(): VoiceDesignExample[] {
    return VOICE_DESIGN_EXAMPLES;
  }

  /**
   * Get examples by voice type
   */
  static getExamplesByVoiceType(voiceType: string): VoiceDesignExample[] {
    return VOICE_DESIGN_EXAMPLES.filter(example => 
      example.voice_type.toLowerCase().includes(voiceType.toLowerCase())
    );
  }

  /**
   * Search examples by keyword
   */
  static searchExamples(keyword: string): VoiceDesignExample[] {
    const lowerKeyword = keyword.toLowerCase();
    return VOICE_DESIGN_EXAMPLES.filter(example => 
      example.voice_type.toLowerCase().includes(lowerKeyword) ||
      example.prompt.toLowerCase().includes(lowerKeyword) ||
      example.expected_characteristics.some(char => char.toLowerCase().includes(lowerKeyword))
    );
  }

  /**
   * Get recommended voice design options based on category
   */
  static getRecommendedOptions(category: string, voiceDescription: string): Partial<VoiceDesignOptions> {
    const guide = VOICE_DESIGN_PROMPTS[category];
    
    const options: Partial<VoiceDesignOptions> = {
      model_id: 'eleven_multilingual_ttv_v2',
      guidance_scale: guide?.recommended_guidance_scale || 30,
      loudness: 0.5,
      auto_generate_text: false
    };

    // Adjust guidance scale based on description complexity
    if (voiceDescription.length > 200) {
      options.guidance_scale = Math.min((options.guidance_scale || 30) + 10, 50);
    }

    // Adjust based on category
    switch (category) {
      case 'professional':
      case 'commercial':
        options.guidance_scale = 25;
        break;
      case 'character':
      case 'entertainment':
        options.guidance_scale = 40;
        break;
      case 'narrator':
      case 'educational':
        options.guidance_scale = 30;
        break;
    }

    return options;
  }

  /**
   * Validate voice description
   */
  static validateVoiceDescription(description: string): { isValid: boolean; suggestions: string[] } {
    const suggestions: string[] = [];
    let isValid = true;

    if (!description.trim()) {
      isValid = false;
      suggestions.push('Voice description is required');
    }

    if (description.length < 20) {
      isValid = false;
      suggestions.push('Description must be at least 20 characters long');
    }

    if (description.length > 1000) {
      isValid = false;
      suggestions.push('Description must be no more than 1000 characters long');
    }

    // Check for key elements
    const hasAge = VOICE_DESIGN_ATTRIBUTES.age.some(age => 
      description.toLowerCase().includes(age.toLowerCase())
    );
    if (!hasAge) {
      suggestions.push('Consider adding age descriptors (young, middle-aged, elderly, etc.)');
    }

    const hasGender = VOICE_DESIGN_ATTRIBUTES.gender.some(gender => 
      description.toLowerCase().includes(gender.toLowerCase())
    );
    if (!hasGender) {
      suggestions.push('Consider adding gender descriptors (male, female, gender-neutral, etc.)');
    }

    const hasTone = VOICE_DESIGN_ATTRIBUTES.tone_timbre_pitch.some(tone => 
      description.toLowerCase().includes(tone.toLowerCase())
    );
    if (!hasTone) {
      suggestions.push('Consider adding tone descriptors (deep, warm, gravelly, etc.)');
    }

    return { isValid, suggestions };
  }

  /**
   * Generate preview text for a voice description
   */
  static generatePreviewText(voiceDescription: string, category?: string): string {
    const lowerDesc = voiceDescription.toLowerCase();
    
    // Extract characteristics from description
    const isProfessional = lowerDesc.includes('professional') || lowerDesc.includes('business');
    const isCharacter = lowerDesc.includes('character') || lowerDesc.includes('pirate') || lowerDesc.includes('wizard');
    const isNarrator = lowerDesc.includes('narrator') || lowerDesc.includes('storytelling');
    const isCommercial = lowerDesc.includes('commercial') || lowerDesc.includes('advertisement');
    const isEducational = lowerDesc.includes('educational') || lowerDesc.includes('instructor');
    const isEntertainment = lowerDesc.includes('game') || lowerDesc.includes('cartoon') || lowerDesc.includes('entertainment');

    // Generate appropriate preview text
    if (isProfessional) {
      return 'Welcome to today\'s presentation. I\'m excited to share with you the latest developments in our industry. This information will be valuable for your professional growth and understanding of current market trends.';
    } else if (isCharacter) {
      return 'Ah, you\'ve come seeking adventure, have you? Well, you\'ve found the right place, my friend. The path ahead is treacherous, but with courage and determination, you might just succeed where others have failed.';
    } else if (isNarrator) {
      return 'In a world where magic and mystery intertwine, our story begins. The ancient forest whispered secrets to those who dared to listen, and in its depths, a great adventure awaited the brave souls who would seek it.';
    } else if (isCommercial) {
      return 'Introducing the revolutionary new product that will change your life forever! Don\'t miss out on this incredible opportunity. Order now and experience the difference for yourself. Limited time offer!';
    } else if (isEducational) {
      return 'Today we\'ll be exploring a fascinating topic that will expand your knowledge and understanding. Pay close attention as we break down complex concepts into simple, easy-to-understand explanations.';
    } else if (isEntertainment) {
      return 'Welcome to the most exciting adventure of your life! Get ready for non-stop action, incredible challenges, and unforgettable moments. Are you ready to begin this epic journey?';
    } else {
      // Generic preview text
      return 'Hello there! I hope you\'re having a wonderful day. This is a sample of my voice, and I\'m excited to share it with you. Thank you for taking the time to listen to this preview.';
    }
  }

  /**
   * Get random voice design example
   */
  static getRandomExample(): VoiceDesignExample {
    const randomIndex = Math.floor(Math.random() * VOICE_DESIGN_EXAMPLES.length);
    return VOICE_DESIGN_EXAMPLES[randomIndex];
  }

  /**
   * Get examples by guidance scale range
   */
  static getExamplesByGuidanceScale(min: number, max: number): VoiceDesignExample[] {
    return VOICE_DESIGN_EXAMPLES.filter(example => 
      example.guidance_scale >= min && example.guidance_scale <= max
    );
  }

  /**
   * Get examples by model
   */
  static getExamplesByModel(modelId: string): VoiceDesignExample[] {
    return VOICE_DESIGN_EXAMPLES.filter(example => example.model_id === modelId);
  }

  /**
   * Analyze voice description and suggest improvements
   */
  static analyzeVoiceDescription(description: string): {
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
    if (description.length >= 20 && description.length <= 1000) {
      score += 20;
      strengths.push('Appropriate length');
    } else {
      improvements.push('Length should be between 20-1000 characters');
    }

    // Check for key elements
    const hasAge = VOICE_DESIGN_ATTRIBUTES.age.some(age => 
      description.toLowerCase().includes(age.toLowerCase())
    );
    if (hasAge) {
      score += 15;
      strengths.push('Includes age descriptor');
    } else {
      improvements.push('Missing age descriptor');
      suggestions.push('Add age descriptors like "young", "middle-aged", "elderly"');
    }

    const hasGender = VOICE_DESIGN_ATTRIBUTES.gender.some(gender => 
      description.toLowerCase().includes(gender.toLowerCase())
    );
    if (hasGender) {
      score += 15;
      strengths.push('Includes gender descriptor');
    } else {
      improvements.push('Missing gender descriptor');
      suggestions.push('Add gender descriptors like "male", "female", "gender-neutral"');
    }

    const hasTone = VOICE_DESIGN_ATTRIBUTES.tone_timbre_pitch.some(tone => 
      description.toLowerCase().includes(tone.toLowerCase())
    );
    if (hasTone) {
      score += 15;
      strengths.push('Includes tone descriptor');
    } else {
      improvements.push('Missing tone descriptor');
      suggestions.push('Add tone descriptors like "deep", "warm", "gravelly"');
    }

    const hasAccent = VOICE_DESIGN_ATTRIBUTES.accent.some(accent => 
      description.toLowerCase().includes(accent.toLowerCase())
    );
    if (hasAccent) {
      score += 10;
      strengths.push('Includes accent descriptor');
    } else {
      suggestions.push('Consider adding accent descriptors for more specificity');
    }

    const hasPacing = VOICE_DESIGN_ATTRIBUTES.pacing.some(pacing => 
      description.toLowerCase().includes(pacing.toLowerCase())
    );
    if (hasPacing) {
      score += 10;
      strengths.push('Includes pacing descriptor');
    } else {
      suggestions.push('Consider adding pacing descriptors like "fast-paced", "slowly"');
    }

    const hasAudioQuality = VOICE_DESIGN_ATTRIBUTES.audio_quality.some(quality => 
      description.toLowerCase().includes(quality.toLowerCase())
    );
    if (hasAudioQuality) {
      score += 10;
      strengths.push('Includes audio quality descriptor');
    } else {
      suggestions.push('Consider adding "perfect audio quality" for professional results');
    }

    const hasCharacter = VOICE_DESIGN_ATTRIBUTES.character_profession.some(char => 
      description.toLowerCase().includes(char.toLowerCase())
    );
    if (hasCharacter) {
      score += 5;
      strengths.push('Includes character/profession descriptor');
    }

    return { score, strengths, improvements, suggestions };
  }
}

// Export default instance
export const voiceDesignManager = new VoiceDesignManager();
