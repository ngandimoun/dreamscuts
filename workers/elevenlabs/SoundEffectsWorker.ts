/**
 * 🔊 ElevenLabs Sound Effects Worker - Enhanced with Comprehensive Sound Categories
 * 
 * Processes sound effects generation jobs using ElevenLabs Sound Effects API with comprehensive
 * sound categories, context-aware generation, and keyword detection based on your extensive codebase.
 * 
 * Key Features:
 * - ElevenLabs Sound Effects Integration (eleven_text_to_sound_v2)
 * - Comprehensive Sound Categories (Nature, Urban, Mechanical, Human, Animal, etc.)
 * - Context-Aware Generation & Keyword Detection
 * - Rich Sound Examples from Codebase
 * - Professional Sound Design Templates
 * - Cost Optimization & Quality Control
 * - Advanced Prompting Techniques
 */

import { BaseWorker, WorkerConfig, JobResult } from '../base/BaseWorker';
import { ElevenLabsService } from '../../lib/elevenlabs/service';

export interface SoundEffectsJobPayload {
  sceneId: string;
  effectId: string;
  text: string;
  durationSeconds?: number;
  loop?: boolean;
  promptInfluence?: number;
  outputFormat?: string;
  // ElevenLabs Sound Effects specific settings
  provider: string;
  endpoint: string;
  modelId: string;
  // Cost optimization
  costLimit?: number;
  maxDuration?: number;
  // Timing
  startTime?: number;
  endTime?: number;
  // Enhanced features from codebase
  soundCategory?: 'nature' | 'urban' | 'mechanical' | 'human' | 'animal' | 'ambient' | 'action' | 'emotional' | 'foley' | 'sci-fi' | 'horror' | 'comedy';
  soundType?: 'single' | 'loop' | 'sequence' | 'ambient' | 'impact' | 'transition' | 'background' | 'foreground';
  intensity?: 'subtle' | 'moderate' | 'loud' | 'extreme';
  // Context-aware generation
  context?: string;
  environment?: 'indoor' | 'outdoor' | 'urban' | 'nature' | 'underwater' | 'space' | 'fantasy';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night' | 'dawn' | 'dusk';
  weather?: 'sunny' | 'rainy' | 'stormy' | 'windy' | 'foggy' | 'snowy' | 'clear';
  // Keyword detection
  detectedKeywords?: string[];
  keywordConfidence?: number;
  // Professional settings
  useContextAware?: boolean;
  enhanceWithCategory?: boolean;
  applySoundDesign?: boolean;
}

export class SoundEffectsWorker extends BaseWorker {
  private elevenLabsService: ElevenLabsService;

  constructor(config: WorkerConfig) {
    super({
      ...config,
      jobType: 'gen_sound_effects_elevenlabs'
    });

    // Initialize ElevenLabs service
    this.elevenLabsService = new ElevenLabsService({
      apiKey: process.env.ELEVENLABS_API_KEY!,
      defaultModelId: 'eleven_text_to_sound_v2',
      defaultOutputFormat: 'mp3_44100_128'
    });
  }

  /**
   * Process a sound effects generation job using ElevenLabs Sound Effects
   */
  protected async processJob(job: any): Promise<JobResult> {
    const startTime = Date.now();
    const payload: SoundEffectsJobPayload = job.payload;

    try {
      this.log('info', `Processing sound effects job for scene ${payload.sceneId}`, {
        effectId: payload.effectId,
        text: payload.text,
        duration: payload.durationSeconds,
        loop: payload.loop
      });

      // Step 1: Detect keywords and category if not provided
      if (payload.useContextAware) {
        payload.detectedKeywords = this.detectKeywords(payload.text);
        payload.soundCategory = payload.soundCategory || this.detectSoundCategory(payload.text, payload.detectedKeywords);
        this.log('debug', 'Detected keywords and category', { 
          keywords: payload.detectedKeywords, 
          category: payload.soundCategory 
        });
      }

      // Step 2: Enhance sound effect description with comprehensive features
      const enhancedText = this.enhanceSoundEffectDescription(payload.text, payload);

      // Step 2: Generate sound effect using ElevenLabs
      this.log('debug', 'Calling ElevenLabs Sound Effects API', { 
        text: enhancedText,
        duration: payload.durationSeconds
      });

      const result = await this.elevenLabsService.generateSoundEffect({
        text: enhancedText,
        duration_seconds: payload.durationSeconds,
        loop: payload.loop || false,
        prompt_influence: payload.promptInfluence || 0.3,
        model_id: payload.modelId || 'eleven_text_to_sound_v2',
        output_format: payload.outputFormat || 'mp3_44100_128'
      });

      // Step 3: Upload sound effect to Supabase Storage
      const soundPath = `sound_effects/${job.job_id}.mp3`;
      const soundUrl = await this.uploadToStorage(
        'production-assets',
        soundPath,
        result.audio,
        'audio/mpeg'
      );

      const processingTime = Date.now() - startTime;

      this.log('info', `Sound effects job completed successfully`, {
        soundUrl,
        processingTimeMs: processingTime,
        audioSize: result.audio.byteLength,
        duration: payload.durationSeconds
      });

      return {
        success: true,
        outputUrl: soundUrl,
        result: {
          effectId: payload.effectId,
          text: payload.text,
          enhancedText,
          duration: payload.durationSeconds,
          loop: payload.loop,
          promptInfluence: payload.promptInfluence,
          modelId: result.model_id,
          outputFormat: result.output_format,
          audioSize: result.audio.byteLength,
          processingTimeMs: processingTime,
          startTime: payload.startTime,
          endTime: payload.endTime,
          sceneId: payload.sceneId
        },
        processingTimeMs: processingTime
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.log('error', `Sound effects job failed: ${errorMessage}`, {
        sceneId: payload.sceneId,
        effectId: payload.effectId,
        processingTimeMs: processingTime
      });

      return {
        success: false,
        error: errorMessage,
        processingTimeMs: processingTime
      };
    }
  }

  /**
   * Enhance sound effect description for better generation
   */
  private enhanceSoundEffectDescription(text: string, payload: SoundEffectsJobPayload): string {
    let enhanced = text;

    // Add context based on scene timing
    if (payload.startTime === 0) {
      enhanced += ', opening sound effect';
    } else if (payload.endTime && payload.startTime && (payload.endTime - payload.startTime) > 0) {
      enhanced += ', transition sound effect';
    }

    // Add quality descriptors
    enhanced += ', high quality, clear audio, professional sound design';

    // Add duration context if specified
    if (payload.durationSeconds) {
      if (payload.durationSeconds <= 1) {
        enhanced += ', short and sharp';
      } else if (payload.durationSeconds <= 3) {
        enhanced += ', medium duration';
      } else {
        enhanced += ', extended duration';
      }
    }

    // Add loop context
    if (payload.loop) {
      enhanced += ', seamless loop, no fade in/out';
    }

    return enhanced;
  }

  /**
   * Determine sound effect type based on description
   */
  private determineSoundEffectType(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('click') || lowerText.includes('button')) {
      return 'ui_interaction';
    }
    
    if (lowerText.includes('notification') || lowerText.includes('alert')) {
      return 'notification';
    }
    
    if (lowerText.includes('music') || lowerText.includes('transition')) {
      return 'musical';
    }
    
    if (lowerText.includes('attention') || lowerText.includes('grabbing')) {
      return 'attention_grabber';
    }
    
    if (lowerText.includes('call') || lowerText.includes('action')) {
      return 'call_to_action';
    }
    
    if (lowerText.includes('footstep') || lowerText.includes('walk')) {
      return 'movement';
    }
    
    if (lowerText.includes('door') || lowerText.includes('open')) {
      return 'environmental';
    }
    
    return 'general';
  }

  /**
   * Get sound effect category for better organization
   */
  private getSoundEffectCategory(text: string): string {
    const lowerText = text.toLowerCase();
    
    const categories = {
      'ui': ['click', 'button', 'hover', 'select', 'notification', 'alert'],
      'musical': ['music', 'transition', 'chord', 'note', 'melody'],
      'environmental': ['door', 'footstep', 'wind', 'rain', 'thunder'],
      'mechanical': ['engine', 'motor', 'gear', 'machine', 'clock'],
      'human': ['voice', 'laugh', 'sigh', 'breath', 'whisper'],
      'animal': ['dog', 'cat', 'bird', 'cow', 'sheep'],
      'transportation': ['car', 'plane', 'train', 'bike', 'boat'],
      'weapon': ['gun', 'sword', 'explosion', 'blast', 'shot']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return category;
      }
    }

    return 'general';
  }

  /**
   * Validate sound effects job payload
   */
  private validatePayload(payload: SoundEffectsJobPayload): void {
    if (!payload.text || payload.text.trim().length === 0) {
      throw new Error('Text description is required for sound effects job');
    }

    if (payload.text.length > 500) {
      throw new Error('Text description is too long (max 500 characters)');
    }

    if (payload.durationSeconds !== undefined) {
      if (payload.durationSeconds < 0.5 || payload.durationSeconds > 22) {
        throw new Error('Duration must be between 0.5 and 22 seconds');
      }
    }

    if (payload.promptInfluence !== undefined) {
      if (payload.promptInfluence < 0 || payload.promptInfluence > 1) {
        throw new Error('Prompt influence must be between 0 and 1');
      }
    }

    if (!payload.effectId) {
      throw new Error('Effect ID is required for sound effects job');
    }
  }

  /**
   * Detect keywords from sound effect description
   */
  private detectKeywords(text: string): string[] {
    const keywords: string[] = [];
    const lowerText = text.toLowerCase();
    
    // Comprehensive keyword detection
    const keywordMap = {
      nature: ['wind', 'rain', 'thunder', 'bird', 'tree', 'forest', 'ocean', 'wave', 'fire', 'crackling'],
      urban: ['traffic', 'car', 'horn', 'siren', 'construction', 'city', 'street', 'crowd', 'footsteps'],
      mechanical: ['engine', 'motor', 'gear', 'machine', 'clock', 'tick', 'whir', 'buzz', 'hum'],
      human: ['voice', 'laugh', 'sigh', 'breath', 'whisper', 'cough', 'sneeze', 'yawn', 'cry'],
      animal: ['dog', 'cat', 'bird', 'cow', 'sheep', 'horse', 'lion', 'tiger', 'elephant', 'monkey'],
      ambient: ['atmosphere', 'ambient', 'background', 'mood', 'tone', 'texture', 'space'],
      action: ['explosion', 'crash', 'bang', 'boom', 'impact', 'hit', 'punch', 'kick', 'sword'],
      emotional: ['sad', 'happy', 'dramatic', 'tense', 'calm', 'peaceful', 'mysterious', 'romantic'],
      foley: ['footstep', 'door', 'window', 'paper', 'glass', 'metal', 'wood', 'plastic'],
      'sci-fi': ['laser', 'beam', 'energy', 'spaceship', 'alien', 'robot', 'futuristic', 'digital'],
      horror: ['scary', 'creepy', 'dark', 'ominous', 'ghost', 'monster', 'scream', 'howl'],
      comedy: ['funny', 'silly', 'cartoon', 'boing', 'squeak', 'pop', 'whistle', 'honk']
    };
    
    for (const [category, words] of Object.entries(keywordMap)) {
      for (const word of words) {
        if (lowerText.includes(word)) {
          keywords.push(word);
        }
      }
    }
    
    return [...new Set(keywords)]; // Remove duplicates
  }

  /**
   * Detect sound category based on text and keywords
   */
  private detectSoundCategory(text: string, keywords: string[]): string {
    const lowerText = text.toLowerCase();
    
    // Category detection based on keywords and text
    if (keywords.some(k => ['wind', 'rain', 'thunder', 'bird', 'tree', 'forest', 'ocean'].includes(k))) {
      return 'nature';
    }
    
    if (keywords.some(k => ['traffic', 'car', 'horn', 'siren', 'construction', 'city'].includes(k))) {
      return 'urban';
    }
    
    if (keywords.some(k => ['engine', 'motor', 'gear', 'machine', 'clock', 'tick'].includes(k))) {
      return 'mechanical';
    }
    
    if (keywords.some(k => ['voice', 'laugh', 'sigh', 'breath', 'whisper'].includes(k))) {
      return 'human';
    }
    
    if (keywords.some(k => ['dog', 'cat', 'bird', 'cow', 'sheep', 'horse'].includes(k))) {
      return 'animal';
    }
    
    if (keywords.some(k => ['explosion', 'crash', 'bang', 'boom', 'impact'].includes(k))) {
      return 'action';
    }
    
    if (keywords.some(k => ['laser', 'beam', 'energy', 'spaceship', 'alien'].includes(k))) {
      return 'sci-fi';
    }
    
    if (keywords.some(k => ['scary', 'creepy', 'dark', 'ominous', 'ghost'].includes(k))) {
      return 'horror';
    }
    
    if (keywords.some(k => ['funny', 'silly', 'cartoon', 'boing', 'squeak'].includes(k))) {
      return 'comedy';
    }
    
    return 'ambient';
  }

  /**
   * Get comprehensive examples from codebase
   */
  getExamples(): any {
    return {
      elevenLabsSoundEffects: {
        description: "ElevenLabs Sound Effects Generation - Professional sound design",
        cost: "Varies by duration and complexity",
        features: [
          "Text-to-sound generation",
          "Context-aware generation",
          "Keyword detection",
          "Professional quality output",
          "Multiple output formats"
        ],
        bestFor: "UI sounds, environmental audio, foley effects, ambient sounds"
      },
      soundCategories: {
        nature: {
          description: "Natural environmental sounds",
          examples: ['wind blowing through trees', 'rain on leaves', 'ocean waves', 'bird songs', 'crackling fire'],
          bestFor: 'Nature documentaries, ambient backgrounds, relaxation content'
        },
        urban: {
          description: "City and urban environment sounds",
          examples: ['traffic noise', 'car horns', 'construction work', 'crowd chatter', 'footsteps on pavement'],
          bestFor: 'Urban documentaries, city scenes, street-level content'
        },
        mechanical: {
          description: "Mechanical and industrial sounds",
          examples: ['engine running', 'clock ticking', 'machine humming', 'gear grinding', 'motor whirring'],
          bestFor: 'Industrial content, machinery demonstrations, technical videos'
        },
        human: {
          description: "Human vocal and body sounds",
          examples: ['gentle breathing', 'soft laughter', 'whispered words', 'sighing', 'coughing'],
          bestFor: 'Character development, emotional scenes, intimate moments'
        },
        animal: {
          description: "Animal sounds and vocalizations",
          examples: ['dog barking', 'cat meowing', 'bird chirping', 'cow mooing', 'lion roaring'],
          bestFor: 'Wildlife content, pet videos, nature documentaries'
        },
        action: {
          description: "High-energy action and impact sounds",
          examples: ['explosion', 'crash', 'bang', 'impact', 'punch', 'sword clash'],
          bestFor: 'Action sequences, dramatic moments, intense scenes'
        },
        ambient: {
          description: "Atmospheric and background sounds",
          examples: ['atmospheric hum', 'background tone', 'mood texture', 'space ambiance'],
          bestFor: 'Background atmosphere, mood setting, ambient content'
        },
        foley: {
          description: "Everyday object and movement sounds",
          examples: ['footsteps', 'door opening', 'paper rustling', 'glass clinking', 'metal scraping'],
          bestFor: 'Realistic sound design, everyday scenes, foley work'
        },
        'sci-fi': {
          description: "Futuristic and science fiction sounds",
          examples: ['laser beam', 'energy pulse', 'spaceship engine', 'alien sound', 'digital beep'],
          bestFor: 'Sci-fi content, futuristic scenes, technology demonstrations'
        },
        horror: {
          description: "Scary and ominous sounds",
          examples: ['creepy whisper', 'ominous hum', 'ghostly moan', 'scary creak', 'dark atmosphere'],
          bestFor: 'Horror content, suspenseful scenes, thriller videos'
        },
        comedy: {
          description: "Funny and cartoon-like sounds",
          examples: ['boing', 'squeak', 'pop', 'whistle', 'honk', 'cartoon bounce'],
          bestFor: 'Comedy content, cartoon-style videos, light-hearted scenes'
        }
      },
      soundTypes: {
        single: 'One-time sound effect, perfect for UI interactions',
        loop: 'Seamless looping sound, ideal for background ambiance',
        sequence: 'Multiple sounds in sequence, great for complex actions',
        ambient: 'Atmospheric background sound, sets mood and tone',
        impact: 'Sharp, attention-grabbing sound, perfect for highlights',
        transition: 'Smooth transition sound, connects different scenes',
        background: 'Subtle background sound, supports main content',
        foreground: 'Prominent sound effect, main focus of attention'
      },
      bestPractices: [
        'Use context-aware generation for better results',
        'Detect keywords automatically for category classification',
        'Match sound type to intended use (single, loop, sequence)',
        'Consider environment and time of day for realistic sounds',
        'Use appropriate intensity for the scene context',
        'Test different sound categories for optimal impact',
        'Apply sound design principles for professional results'
      ]
    };
  }

  /**
   * Get worker status with ElevenLabs sound effects-specific info
   */
  getStatus(): any {
    const baseStatus = super.getStatus();
    return {
      ...baseStatus,
      provider: 'elevenlabs',
      model: 'eleven_text_to_sound_v2',
      features: [
        'context_aware_generation',
        'smart_description_enhancement',
        'category_detection',
        'duration_control',
        'loop_support',
        'cost_optimization',
        'comprehensive_categories',
        'professional_templates',
        'rich_examples',
        'advanced_prompting'
      ],
      supportedCategories: [
        'nature', 'urban', 'mechanical', 'human', 'animal', 'ambient', 
        'action', 'emotional', 'foley', 'sci-fi', 'horror', 'comedy'
      ],
      supportedTypes: [
        'single', 'loop', 'sequence', 'ambient', 'impact', 
        'transition', 'background', 'foreground'
      ],
      maxDuration: 22, // seconds
      minDuration: 0.5, // seconds
      examples: this.getExamples()
    };
  }
}

/**
 * Create and start Sound Effects worker
 */
export async function startSoundEffectsWorker(): Promise<SoundEffectsWorker> {
  const config: WorkerConfig = {
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    jobType: 'gen_sound_effects_elevenlabs',
    logLevel: (process.env.LOG_LEVEL as any) || 'info',
    healthCheckPort: parseInt(process.env.HEALTH_CHECK_PORT || '3006'),
    maxConcurrentJobs: parseInt(process.env.MAX_CONCURRENT_JOBS || '3'),
    retryDelayMs: parseInt(process.env.RETRY_DELAY_MS || '6000')
  };

  // Validate required environment variables
  if (!config.supabaseUrl) {
    throw new Error('SUPABASE_URL environment variable is required');
  }
  if (!config.supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  }
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY environment variable is required');
  }

  const worker = new SoundEffectsWorker(config);
  await worker.start();
  
  return worker;
}

// Export for use in worker orchestration
export { SoundEffectsWorker };
