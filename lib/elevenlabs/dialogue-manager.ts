/**
 * Dialogue Manager
 * 
 * Utility functions for managing Text to Dialogue functionality.
 * Provides methods for audio tag management, dialogue enhancement, and multi-speaker conversations.
 */

import type { 
  AudioTag, 
  DialogueSettings, 
  DialogueEnhancementOptions,
  MultiSpeakerDialogue,
  VoiceSettings 
} from './types';

export class DialogueManager {
  // Predefined audio tags organized by category
  private static readonly AUDIO_TAGS = {
    // Voice-related tags
    emotions: [
      '[happy]', '[sad]', '[excited]', '[angry]', '[annoyed]', '[appalled]',
      '[thoughtful]', '[surprised]', '[sarcastic]', '[curious]', '[crying]',
      '[mischievously]', '[delighted]', '[amazed]', '[warmly]', '[nervously]',
      '[alarmed]', '[sheepishly]', '[desperately]', '[deadpan]', '[impressed]',
      '[dramatically]', '[cautiously]', '[cheerfully]', '[indecisive]',
      '[quizzically]', '[elated]', '[professional]', '[sympathetic]',
      '[questioning]', '[reassuring]'
    ],
    
    // Non-verbal sounds
    nonVerbal: [
      '[laughs]', '[laughs harder]', '[starts laughing]', '[wheezing]',
      '[whispers]', '[sighs]', '[exhales]', '[snorts]', '[chuckles]',
      '[clears throat]', '[short pause]', '[long pause]', '[exhales sharply]',
      '[inhales deeply]', '[muttering]', '[giggling]', '[giggles]',
      '[frustrated sigh]', '[happy gasp]', '[stifling laughter]',
      '[cracking up]', '[with genuine belly laugh]'
    ],
    
    // Speech flow and timing
    speechFlow: [
      '[starting to speak]', '[jumping in]', '[overlapping]', '[interrupting]',
      '[stopping abruptly]', '[pauses]', '[trailing off]', '[hesitating]'
    ],
    
    // Sound effects
    soundEffects: [
      '[gunshot]', '[applause]', '[clapping]', '[explosion]', '[swallows]',
      '[gulps]', '[leaves rustling]', '[gentle footsteps]', '[football]',
      '[wrestling match]', '[auctioneer]'
    ],
    
    // Unique and special
    special: [
      '[sings]', '[woo]', '[fart]', '[strong French accent]', '[strong Russian accent]',
      '[strong British accent]', '[strong American accent]', '[strong German accent]',
      '[strong Spanish accent]', '[strong Italian accent]', '[strong Japanese accent]'
    ]
  };

  /**
   * Get all available audio tags
   */
  static getAllAudioTags(): AudioTag[] {
    return Object.values(this.AUDIO_TAGS).flat();
  }

  /**
   * Get audio tags by category
   */
  static getAudioTagsByCategory(category: keyof typeof DialogueManager.AUDIO_TAGS): AudioTag[] {
    return this.AUDIO_TAGS[category] || [];
  }

  /**
   * Search for audio tags by keyword
   */
  static searchAudioTags(keyword: string): AudioTag[] {
    const allTags = this.getAllAudioTags();
    const searchTerm = keyword.toLowerCase();
    
    return allTags.filter(tag => 
      tag.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Get recommended audio tags for different emotions
   */
  static getRecommendedTagsForEmotion(emotion: string): AudioTag[] {
    const emotionMap: Record<string, AudioTag[]> = {
      'happy': ['[happy]', '[laughs]', '[giggles]', '[delighted]', '[excited]'],
      'sad': ['[sad]', '[sighs]', '[crying]', '[muttering]', '[long pause]'],
      'angry': ['[angry]', '[annoyed]', '[exhales sharply]', '[snorts]'],
      'surprised': ['[surprised]', '[happy gasp]', '[amazed]', '[short pause]'],
      'confused': ['[quizzically]', '[indecisive]', '[hesitating]', '[thoughtful]'],
      'excited': ['[excited]', '[elated]', '[laughs harder]', '[cheerfully]'],
      'nervous': ['[nervously]', '[alarmed]', '[cautiously]', '[short pause]'],
      'professional': ['[professional]', '[reassuring]', '[sympathetic]', '[questioning]'],
      'mysterious': ['[whispers]', '[mischievously]', '[deadpan]', '[long pause]'],
      'dramatic': ['[dramatically]', '[impressed]', '[with genuine belly laugh]']
    };

    return emotionMap[emotion.toLowerCase()] || [];
  }

  /**
   * Enhance text with audio tags based on emotional context
   */
  static enhanceTextWithAudioTags(
    text: string, 
    options: DialogueEnhancementOptions = {}
  ): string {
    const {
      enhance_emotion = true,
      add_audio_tags = true,
      preserve_original_text = true,
      max_tags_per_sentence = 2,
      custom_tags = []
    } = options;

    if (!add_audio_tags) return text;

    let enhancedText = text;

    // Simple emotion detection and tag addition
    if (enhance_emotion) {
      enhancedText = this.addEmotionalTags(enhancedText, max_tags_per_sentence);
    }

    // Add custom tags if provided
    if (custom_tags.length > 0) {
      enhancedText = this.addCustomTags(enhancedText, custom_tags);
    }

    return enhancedText;
  }

  /**
   * Add emotional tags based on text analysis
   */
  private static addEmotionalTags(text: string, maxTags: number): string {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    let enhancedSentences: string[] = [];

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (!trimmedSentence) continue;

      let enhancedSentence = trimmedSentence;
      const tags: string[] = [];

      // Detect emotional indicators
      if (this.containsEmotionalIndicators(trimmedSentence, 'excitement')) {
        tags.push('[excited]');
      }
      if (this.containsEmotionalIndicators(trimmedSentence, 'sadness')) {
        tags.push('[sad]');
      }
      if (this.containsEmotionalIndicators(trimmedSentence, 'anger')) {
        tags.push('[angry]');
      }
      if (this.containsEmotionalIndicators(trimmedSentence, 'surprise')) {
        tags.push('[surprised]');
      }
      if (this.containsEmotionalIndicators(trimmedSentence, 'confusion')) {
        tags.push('[quizzically]');
      }

      // Add laughter detection
      if (this.containsLaughterIndicators(trimmedSentence)) {
        tags.push('[laughs]');
      }

      // Add pause indicators
      if (this.containsPauseIndicators(trimmedSentence)) {
        tags.push('[short pause]');
      }

      // Limit number of tags
      const selectedTags = tags.slice(0, maxTags);
      
      if (selectedTags.length > 0) {
        enhancedSentence = `${selectedTags.join(' ')} ${enhancedSentence}`;
      }

      enhancedSentences.push(enhancedSentence);
    }

    return enhancedSentences.join('. ') + (text.endsWith('.') ? '.' : '');
  }

  /**
   * Add custom tags to text
   */
  private static addCustomTags(text: string, customTags: string[]): string {
    if (customTags.length === 0) return text;

    const firstTag = customTags[0];
    return `${firstTag} ${text}`;
  }

  /**
   * Check if text contains emotional indicators
   */
  private static containsEmotionalIndicators(text: string, emotion: string): boolean {
    const indicators: Record<string, string[]> = {
      excitement: ['!', 'amazing', 'wow', 'incredible', 'fantastic', 'great', 'awesome'],
      sadness: ['sad', 'sorry', 'unfortunately', 'disappointed', 'upset', 'crying'],
      anger: ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'upset'],
      surprise: ['what', 'really', 'unbelievable', 'shocking', 'surprising'],
      confusion: ['?', 'confused', 'unclear', 'not sure', 'maybe', 'perhaps']
    };

    const emotionIndicators = indicators[emotion] || [];
    const lowerText = text.toLowerCase();

    return emotionIndicators.some(indicator => lowerText.includes(indicator));
  }

  /**
   * Check if text contains laughter indicators
   */
  private static containsLaughterIndicators(text: string): boolean {
    const laughterWords = ['haha', 'hehe', 'lol', 'laugh', 'funny', 'hilarious', 'joke'];
    const lowerText = text.toLowerCase();
    
    return laughterWords.some(word => lowerText.includes(word));
  }

  /**
   * Check if text contains pause indicators
   */
  private static containsPauseIndicators(text: string): boolean {
    const pauseIndicators = ['...', 'um', 'uh', 'well', 'so', 'actually'];
    const lowerText = text.toLowerCase();
    
    return pauseIndicators.some(indicator => lowerText.includes(indicator));
  }

  /**
   * Create multi-speaker dialogue structure
   */
  static createMultiSpeakerDialogue(
    speakers: Array<{ name: string; voice_id: string; lines: string[] }>,
    settings?: DialogueSettings
  ): MultiSpeakerDialogue {
    return {
      speakers,
      settings: {
        stability: 'natural',
        use_audio_tags: true,
        enhance_emotion: true,
        multi_speaker: true,
        ...settings
      }
    };
  }

  /**
   * Format multi-speaker dialogue for Text to Dialogue API
   */
  static formatMultiSpeakerDialogue(dialogue: MultiSpeakerDialogue): string {
    let formattedText = '';

    for (const speaker of dialogue.speakers) {
      for (const line of speaker.lines) {
        formattedText += `Speaker ${speaker.name}: ${line}\n\n`;
      }
    }

    return formattedText.trim();
  }

  /**
   * Get dialogue settings for different use cases
   */
  static getDialogueSettingsForUseCase(useCase: 'conversation' | 'narration' | 'character' | 'announcement'): DialogueSettings {
    const settingsMap: Record<string, DialogueSettings> = {
      conversation: {
        stability: 'natural',
        use_audio_tags: true,
        enhance_emotion: true,
        multi_speaker: true
      },
      narration: {
        stability: 'robust',
        use_audio_tags: false,
        enhance_emotion: false,
        multi_speaker: false
      },
      character: {
        stability: 'creative',
        use_audio_tags: true,
        enhance_emotion: true,
        multi_speaker: true
      },
      announcement: {
        stability: 'robust',
        use_audio_tags: false,
        enhance_emotion: false,
        multi_speaker: false
      }
    };

    return settingsMap[useCase] || settingsMap.conversation;
  }

  /**
   * Validate audio tags in text
   */
  static validateAudioTags(text: string): { valid: boolean; invalidTags: string[] } {
    const audioTagRegex = /\[([^\]]+)\]/g;
    const matches = text.match(audioTagRegex) || [];
    const allValidTags = this.getAllAudioTags();
    
    const invalidTags = matches.filter(tag => !allValidTags.includes(tag as AudioTag));
    
    return {
      valid: invalidTags.length === 0,
      invalidTags
    };
  }

  /**
   * Extract audio tags from text
   */
  static extractAudioTags(text: string): AudioTag[] {
    const audioTagRegex = /\[([^\]]+)\]/g;
    const matches = text.match(audioTagRegex) || [];
    
    return matches as AudioTag[];
  }

  /**
   * Remove audio tags from text
   */
  static removeAudioTags(text: string): string {
    const audioTagRegex = /\[([^\]]+)\]/g;
    return text.replace(audioTagRegex, '').replace(/\s+/g, ' ').trim();
  }

  /**
   * Get voice settings optimized for dialogue
   */
  static getDialogueOptimizedVoiceSettings(stability: 'creative' | 'natural' | 'robust' = 'natural'): VoiceSettings {
    const stabilityMap = {
      creative: { stability: 0.3, similarity_boost: 0.6, style: 0.7 },
      natural: { stability: 0.5, similarity_boost: 0.75, style: 0.3 },
      robust: { stability: 0.8, similarity_boost: 0.9, style: 0.1 }
    };

    const baseSettings = stabilityMap[stability];

    return {
      stability: baseSettings.stability,
      similarity_boost: baseSettings.similarity_boost,
      style: baseSettings.style,
      use_speaker_boost: true,
      speed: 1.0
    };
  }

  /**
   * Generate dialogue examples for testing
   */
  static getDialogueExamples(): Array<{ title: string; text: string; description: string }> {
    return [
      {
        title: 'Expressive Monologue',
        text: `[excited] Okay, you are NOT going to believe this.

You know how I've been totally stuck on that short story?

Like, staring at the screen for HOURS, just... nothing?

[frustrated sigh] I was seriously about to just trash the whole thing. Start over.

Give up, probably. But then!

Last night, I was just doodling, not even thinking about it, right?

And this one little phrase popped into my head. Just... completely out of the blue.

And it wasn't even for the story, initially.

But then I typed it out, just to see. And it was like... the FLOODGATES opened!

Suddenly, I knew exactly where the character needed to go, what the ending had to be...

It all just CLICKED. [happy gasp] I stayed up till, like, 3 AM, just typing like a maniac.

Didn't even stop for coffee! [laughs] And it's... it's GOOD! Like, really good.

It feels so... complete now, you know? Like it finally has a soul.

I am so incredibly PUMPED to finish editing it now.

It went from feeling like a chore to feeling like... MAGIC. Seriously, I'm still buzzing!`,
        description: 'A dynamic, emotional monologue with various audio tags for expressiveness'
      },
      {
        title: 'Multi-Speaker Conversation',
        text: `Speaker 1: [excitedly] Sam! Have you tried the new Eleven V3?

Speaker 2: [curiously] Just got it! The clarity is amazing. I can actually do whispers now—
[whispers] like this!

Speaker 1: [impressed] Ooh, fancy! Check this out—
[dramatically] I can do full Shakespeare now! "To be or not to be, that is the question!"

Speaker 2: [giggling] Nice! Though I'm more excited about the laugh upgrade. Listen to this—
[with genuine belly laugh] Ha ha ha!

Speaker 1: [delighted] That's so much better than our old "ha. ha. ha." robot chuckle!

Speaker 2: [amazed] Wow! V2 me could never. I'm actually excited to have conversations now instead of just... talking at people.

Speaker 1: [warmly] Same here! It's like we finally got our personality software fully installed.`,
        description: 'A conversation between two speakers with overlapping dialogue and emotional expressions'
      },
      {
        title: 'Customer Service Simulation',
        text: `[professional] "Thank you for calling Tech Solutions. My name is Sarah, how can I help you today?"

[sympathetic] "Oh no, I'm really sorry to hear you're having trouble with your new device. That sounds frustrating."

[questioning] "Okay, could you tell me a little more about what you're seeing on the screen?"

[reassuring] "Alright, based on what you're describing, it sounds like a software glitch. We can definitely walk through some troubleshooting steps to try and fix that."`,
        description: 'Professional customer service dialogue with appropriate emotional tones'
      }
    ];
  }
}

// Export a default instance
export const dialogueManager = new DialogueManager();
