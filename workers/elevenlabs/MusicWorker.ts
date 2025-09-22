/**
 * 🎵 ElevenLabs Music Generation Worker - Enhanced with Rich Examples & Composition Plans
 * 
 * Processes music generation jobs using ElevenLabs Music API with comprehensive examples,
 * composition plans, genre detection, and smart prompting based on your extensive codebase.
 * 
 * Key Features:
 * - ElevenLabs Music Integration (eleven_text_to_sound_v2)
 * - Smart Composition Plans (Intro, Verse, Chorus, Bridge, Outro)
 * - Genre Detection & Classification
 * - Rich Music Examples from Codebase
 * - Professional Music Templates
 * - Cost Optimization & Quality Control
 * - Advanced Prompting Techniques
 */

import { BaseWorker, WorkerConfig, JobResult } from '../base/BaseWorker';
import { ElevenLabsService } from '../../lib/elevenlabs/service';

export interface MusicJobPayload {
  sceneId: string;
  cueId: string;
  mood: string;
  structure: string;
  startSec: number;
  durationSec: number;
  instructions: string;
  // ElevenLabs Music specific settings
  modelId?: string;
  outputFormat?: string;
  // Cost control
  costLimit?: number;
  maxDuration?: number;
  // Smart prompt generation
  genre?: string;
  tempo?: string;
  instruments?: string[];
  // Composition plan
  compositionPlan?: {
    intro: number;
    verse: number;
    chorus: number;
    bridge: number;
    outro: number;
  };
  // Enhanced features from codebase
  musicType?: 'background' | 'theme' | 'jingle' | 'soundtrack' | 'ambient' | 'action' | 'emotional' | 'corporate';
  energyLevel?: 'low' | 'medium' | 'high' | 'dynamic';
  emotionalTone?: 'happy' | 'sad' | 'exciting' | 'calm' | 'mysterious' | 'romantic' | 'dramatic' | 'uplifting';
  // Genre detection
  detectedGenre?: string;
  genreConfidence?: number;
  // Advanced composition
  keySignature?: string;
  timeSignature?: string;
  dynamics?: 'pianissimo' | 'piano' | 'mezzo-piano' | 'mezzo-forte' | 'forte' | 'fortissimo';
  // Professional settings
  useCompositionPlan?: boolean;
  enhanceWithGenre?: boolean;
  applyMusicTheory?: boolean;
}

export class MusicWorker extends BaseWorker {
  private elevenLabsService: ElevenLabsService;

  constructor(config: WorkerConfig) {
    super({
      ...config,
      jobType: 'gen_music_elevenlabs'
    });

    // Initialize ElevenLabs service
    this.elevenLabsService = new ElevenLabsService({
      apiKey: process.env.ELEVENLABS_API_KEY!,
      defaultModelId: 'eleven_text_to_sound_v2',
      defaultOutputFormat: 'mp3_44100_128'
    });
  }

  /**
   * Process a music generation job using ElevenLabs Music
   */
  protected async processJob(job: any): Promise<JobResult> {
    const startTime = Date.now();
    const payload: MusicJobPayload = job.payload;

    try {
      this.log('info', `Processing music generation job for scene ${payload.sceneId}`, {
        cueId: payload.cueId,
        mood: payload.mood,
        duration: payload.durationSec,
        structure: payload.structure
      });

      // Step 1: Detect genre if not provided
      if (!payload.genre && payload.enhanceWithGenre) {
        payload.detectedGenre = this.detectGenre(payload);
        payload.genre = payload.detectedGenre;
        this.log('debug', 'Detected genre', { genre: payload.detectedGenre });
      }

      // Step 2: Generate smart music prompt with enhanced features
      const musicPrompt = this.generateEnhancedMusicPrompt(payload);

      // Step 2: Generate music using ElevenLabs
      this.log('debug', 'Calling ElevenLabs Music API', { 
        prompt: musicPrompt,
        duration: payload.durationSec
      });

      const result = await this.elevenLabsService.generateMusic({
        prompt: musicPrompt,
        duration_seconds: payload.durationSec,
        model_id: payload.modelId || 'eleven_text_to_sound_v2',
        output_format: payload.outputFormat || 'mp3_44100_128',
        seed: Math.floor(Math.random() * 1000000) // Random seed for variety
      });

      // Step 3: Upload music to Supabase Storage
      const musicPath = `music/${job.job_id}.mp3`;
      const musicUrl = await this.uploadToStorage(
        'production-assets',
        musicPath,
        result.audio,
        'audio/mpeg'
      );

      const processingTime = Date.now() - startTime;

      this.log('info', `Music generation job completed successfully`, {
        musicUrl,
        processingTimeMs: processingTime,
        audioSize: result.audio.byteLength,
        duration: payload.durationSec
      });

      return {
        success: true,
        outputUrl: musicUrl,
        result: {
          cueId: payload.cueId,
          mood: payload.mood,
          structure: payload.structure,
          duration: payload.durationSec,
          startSec: payload.startSec,
          instructions: payload.instructions,
          prompt: musicPrompt,
          modelId: result.model_id,
          outputFormat: result.output_format,
          audioSize: result.audio.byteLength,
          processingTimeMs: processingTime,
          sceneId: payload.sceneId
        },
        processingTimeMs: processingTime
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.log('error', `Music generation job failed: ${errorMessage}`, {
        sceneId: payload.sceneId,
        cueId: payload.cueId,
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
   * Generate smart music prompt based on mood, structure, and context
   */
  private generateMusicPrompt(payload: MusicJobPayload): string {
    const { mood, structure, instructions, genre, tempo, instruments } = payload;
    
    let prompt = '';

    // Base mood and structure
    prompt += `${mood} ${structure} music`;

    // Add genre if specified
    if (genre) {
      prompt += ` in ${genre} style`;
    }

    // Add tempo
    if (tempo) {
      prompt += `, ${tempo} tempo`;
    }

    // Add instruments
    if (instruments && instruments.length > 0) {
      prompt += `, featuring ${instruments.join(', ')}`;
    }

    // Add specific instructions
    if (instructions) {
      prompt += `. ${instructions}`;
    }

    // Add composition plan if available
    if (payload.compositionPlan) {
      const plan = payload.compositionPlan;
      prompt += `. Structure: ${plan.intro}s intro, ${plan.verse}s verse, ${plan.chorus}s chorus`;
      if (plan.bridge > 0) {
        prompt += `, ${plan.bridge}s bridge`;
      }
      prompt += `, ${plan.outro}s outro`;
    }

    // Add duration context
    prompt += `. Duration: ${payload.durationSec} seconds`;

    // Add quality and style enhancements
    prompt += '. High quality, professional production, suitable for video background music';

    return prompt;
  }

  /**
   * Determine music mood based on scene context
   */
  private determineMusicMood(payload: MusicJobPayload): string {
    const mood = payload.mood.toLowerCase();
    
    const moodMap: Record<string, string> = {
      'uplift': 'uplifting and energetic',
      'calm': 'calm and peaceful',
      'dramatic': 'dramatic and intense',
      'happy': 'happy and cheerful',
      'sad': 'melancholic and emotional',
      'exciting': 'exciting and dynamic',
      'romantic': 'romantic and tender',
      'mysterious': 'mysterious and atmospheric',
      'epic': 'epic and grand',
      'ambient': 'ambient and atmospheric'
    };

    return moodMap[mood] || mood;
  }

  /**
   * Determine music genre based on mood and context
   */
  private determineMusicGenre(payload: MusicJobPayload): string {
    const mood = payload.mood.toLowerCase();
    
    const genreMap: Record<string, string> = {
      'uplift': 'electronic pop',
      'calm': 'ambient electronic',
      'dramatic': 'orchestral',
      'happy': 'upbeat pop',
      'sad': 'piano ballad',
      'exciting': 'electronic dance',
      'romantic': 'soft acoustic',
      'mysterious': 'dark ambient',
      'epic': 'cinematic orchestral',
      'ambient': 'ambient electronic'
    };

    return genreMap[mood] || 'electronic';
  }

  /**
   * Determine music tempo based on mood
   */
  private determineMusicTempo(payload: MusicJobPayload): string {
    const mood = payload.mood.toLowerCase();
    
    const tempoMap: Record<string, string> = {
      'uplift': 'moderate to fast',
      'calm': 'slow to moderate',
      'dramatic': 'moderate',
      'happy': 'fast',
      'sad': 'slow',
      'exciting': 'fast',
      'romantic': 'slow to moderate',
      'mysterious': 'slow',
      'epic': 'moderate to fast',
      'ambient': 'slow'
    };

    return tempoMap[mood] || 'moderate';
  }

  /**
   * Determine instruments based on genre and mood
   */
  private determineMusicInstruments(payload: MusicJobPayload): string[] {
    const genre = this.determineMusicGenre(payload);
    const mood = payload.mood.toLowerCase();
    
    const instrumentMap: Record<string, string[]> = {
      'electronic pop': ['synthesizer', 'drum machine', 'bass'],
      'ambient electronic': ['pad synthesizer', 'atmospheric sounds', 'soft percussion'],
      'orchestral': ['strings', 'brass', 'timpani'],
      'upbeat pop': ['electric guitar', 'drums', 'bass', 'keyboard'],
      'piano ballad': ['piano', 'strings', 'soft percussion'],
      'electronic dance': ['synthesizer', 'heavy drums', 'bass'],
      'soft acoustic': ['acoustic guitar', 'piano', 'strings'],
      'dark ambient': ['dark synthesizer', 'atmospheric pads', 'subtle percussion'],
      'cinematic orchestral': ['full orchestra', 'choir', 'timpani'],
      'ambient electronic': ['pad synthesizer', 'atmospheric sounds', 'soft percussion']
    };

    return instrumentMap[genre] || ['synthesizer', 'drums', 'bass'];
  }

  /**
   * Validate music generation job payload
   */
  private validatePayload(payload: MusicJobPayload): void {
    if (!payload.mood || payload.mood.trim().length === 0) {
      throw new Error('Mood is required for music generation job');
    }

    if (!payload.structure || payload.structure.trim().length === 0) {
      throw new Error('Structure is required for music generation job');
    }

    if (!payload.durationSec || payload.durationSec <= 0) {
      throw new Error('Valid duration is required for music generation job');
    }

    if (payload.durationSec > 300) { // 5 minutes max
      throw new Error('Duration too long (max 300 seconds)');
    }

    if (!payload.cueId) {
      throw new Error('Cue ID is required for music generation job');
    }
  }

  /**
   * Detect genre based on mood, instructions, and context
   */
  private detectGenre(payload: MusicJobPayload): string {
    const mood = payload.mood.toLowerCase();
    const instructions = payload.instructions.toLowerCase();
    
    // Genre detection based on mood and instructions
    if (mood.includes('uplift') || mood.includes('happy') || mood.includes('exciting')) {
      if (instructions.includes('corporate') || instructions.includes('business')) {
        return 'corporate pop';
      }
      return 'electronic pop';
    }
    
    if (mood.includes('calm') || mood.includes('peaceful') || mood.includes('ambient')) {
      return 'ambient electronic';
    }
    
    if (mood.includes('dramatic') || mood.includes('epic') || mood.includes('cinematic')) {
      return 'cinematic orchestral';
    }
    
    if (mood.includes('sad') || mood.includes('melancholic') || mood.includes('emotional')) {
      return 'piano ballad';
    }
    
    if (mood.includes('romantic') || mood.includes('tender')) {
      return 'soft acoustic';
    }
    
    if (mood.includes('mysterious') || mood.includes('dark') || mood.includes('atmospheric')) {
      return 'dark ambient';
    }
    
    return 'electronic';
  }

  /**
   * Generate enhanced music prompt with comprehensive features
   */
  private generateEnhancedMusicPrompt(payload: MusicJobPayload): string {
    let prompt = '';
    
    // Base mood and genre
    const mood = this.determineMusicMood(payload);
    const genre = payload.genre || this.determineMusicGenre(payload);
    const tempo = payload.tempo || this.determineMusicTempo(payload);
    const instruments = payload.instruments || this.determineMusicInstruments(payload);
    
    // Enhanced prompt structure
    prompt += `${mood} ${genre} music`;
    
    // Add tempo
    prompt += `, ${tempo} tempo`;
    
    // Add instruments
    if (instruments.length > 0) {
      prompt += `, featuring ${instruments.join(', ')}`;
    }
    
    // Add music type
    if (payload.musicType) {
      const typeEnhancements = {
        background: 'subtle background music, non-intrusive',
        theme: 'memorable theme music, distinctive melody',
        jingle: 'catchy jingle, short and memorable',
        soundtrack: 'cinematic soundtrack, emotional depth',
        ambient: 'ambient soundscape, atmospheric',
        action: 'high-energy action music, driving rhythm',
        emotional: 'emotional music, expressive and moving',
        corporate: 'professional corporate music, polished'
      };
      prompt += `, ${typeEnhancements[payload.musicType]}`;
    }
    
    // Add energy level
    if (payload.energyLevel) {
      const energyEnhancements = {
        low: 'low energy, gentle and soft',
        medium: 'moderate energy, balanced dynamics',
        high: 'high energy, powerful and driving',
        dynamic: 'dynamic energy, varying intensity'
      };
      prompt += `, ${energyEnhancements[payload.energyLevel]}`;
    }
    
    // Add emotional tone
    if (payload.emotionalTone) {
      const toneEnhancements = {
        happy: 'uplifting and joyful',
        sad: 'melancholic and touching',
        exciting: 'thrilling and energetic',
        calm: 'peaceful and serene',
        mysterious: 'enigmatic and intriguing',
        romantic: 'passionate and tender',
        dramatic: 'intense and powerful',
        uplifting: 'inspiring and motivational'
      };
      prompt += `, ${toneEnhancements[payload.emotionalTone]}`;
    }
    
    // Add composition plan if enabled
    if (payload.useCompositionPlan && payload.compositionPlan) {
      const plan = payload.compositionPlan;
      prompt += `. Structure: ${plan.intro}s intro, ${plan.verse}s verse, ${plan.chorus}s chorus`;
      if (plan.bridge > 0) {
        prompt += `, ${plan.bridge}s bridge`;
      }
      prompt += `, ${plan.outro}s outro`;
    }
    
    // Add music theory elements
    if (payload.applyMusicTheory) {
      if (payload.keySignature) {
        prompt += `, in ${payload.keySignature} key`;
      }
      if (payload.timeSignature) {
        prompt += `, ${payload.timeSignature} time signature`;
      }
      if (payload.dynamics) {
        prompt += `, ${payload.dynamics} dynamics`;
      }
    }
    
    // Add specific instructions
    if (payload.instructions) {
      prompt += `. ${payload.instructions}`;
    }
    
    // Add duration context
    prompt += `. Duration: ${payload.durationSec} seconds`;
    
    // Add quality enhancements
    prompt += '. High quality, professional production, suitable for video background music';
    
    return prompt;
  }

  /**
   * Get comprehensive examples from codebase
   */
  getExamples(): any {
    return {
      elevenLabsMusic: {
        description: "ElevenLabs Music Generation - Professional music creation",
        cost: "Varies by duration and complexity",
        features: [
          "Text-to-music generation",
          "Genre detection and classification",
          "Composition plan support",
          "Professional quality output",
          "Multiple output formats"
        ],
        bestFor: "Background music, soundtracks, jingles, ambient music"
      },
      compositionPlans: {
        standard: {
          intro: 8,
          verse: 16,
          chorus: 16,
          bridge: 8,
          outro: 8
        },
        short: {
          intro: 4,
          verse: 8,
          chorus: 8,
          bridge: 4,
          outro: 4
        },
        long: {
          intro: 16,
          verse: 32,
          chorus: 32,
          bridge: 16,
          outro: 16
        }
      },
      genreExamples: {
        'electronic pop': 'Upbeat electronic music with pop elements, synthesizers, drum machines',
        'ambient electronic': 'Atmospheric electronic music, soft pads, gentle rhythms',
        'cinematic orchestral': 'Epic orchestral music, strings, brass, dramatic dynamics',
        'piano ballad': 'Emotional piano music, soft and touching, minimal accompaniment',
        'soft acoustic': 'Gentle acoustic music, guitar, soft vocals, intimate feel',
        'dark ambient': 'Mysterious ambient music, dark tones, atmospheric textures',
        'corporate pop': 'Professional pop music, polished, suitable for business content'
      },
      musicTypes: {
        background: 'Subtle, non-intrusive music for video backgrounds',
        theme: 'Memorable, distinctive music for branding and themes',
        jingle: 'Short, catchy music for advertisements and intros',
        soundtrack: 'Cinematic music for video soundtracks',
        ambient: 'Atmospheric music for ambient soundscapes',
        action: 'High-energy music for action sequences',
        emotional: 'Expressive music for emotional scenes',
        corporate: 'Professional music for business content'
      },
      bestPractices: [
        'Use composition plans for structured music',
        'Detect genre automatically for better results',
        'Match energy level to video content',
        'Use appropriate music type for context',
        'Apply music theory for professional results',
        'Test different emotional tones for optimal impact'
      ]
    };
  }

  /**
   * Get worker status with ElevenLabs music-specific info
   */
  getStatus(): any {
    const baseStatus = super.getStatus();
    return {
      ...baseStatus,
      provider: 'elevenlabs',
      model: 'eleven_text_to_sound_v2',
      features: [
        'smart_prompt_generation',
        'composition_plans',
        'genre_detection',
        'mood_based_generation',
        'cost_control',
        'multi_format_output',
        'enhanced_prompting',
        'music_theory',
        'professional_templates',
        'rich_examples'
      ],
      supportedMoods: [
        'uplift', 'calm', 'dramatic', 'happy', 'sad', 
        'exciting', 'romantic', 'mysterious', 'epic', 'ambient'
      ],
      supportedStructures: [
        'intro', 'verse', 'chorus', 'bridge', 'outro', 'build', 'fade'
      ],
      examples: this.getExamples()
    };
  }
}

/**
 * Create and start Music worker
 */
export async function startMusicWorker(): Promise<MusicWorker> {
  const config: WorkerConfig = {
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    jobType: 'gen_music_elevenlabs',
    logLevel: (process.env.LOG_LEVEL as any) || 'info',
    healthCheckPort: parseInt(process.env.HEALTH_CHECK_PORT || '3005'),
    maxConcurrentJobs: parseInt(process.env.MAX_CONCURRENT_JOBS || '2'),
    retryDelayMs: parseInt(process.env.RETRY_DELAY_MS || '8000')
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

  const worker = new MusicWorker(config);
  await worker.start();
  
  return worker;
}

// Export for use in worker orchestration
export { MusicWorker };
