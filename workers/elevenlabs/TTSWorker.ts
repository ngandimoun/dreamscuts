/**
 * 🎙️ ElevenLabs TTS Worker - Enhanced with Rich Examples & Best Practices
 * 
 * Processes TTS jobs using ElevenLabs Dialog API with advanced audio tags, context awareness,
 * and v3 prompting guide integration. Features comprehensive dialogue enhancement and
 * multi-speaker support based on your extensive codebase examples.
 * 
 * Key Features:
 * - V3 Audio Tags Integration ([excited], [whispers], [laughs], etc.)
 * - Context-Aware Dialogue Enhancement
 * - Multi-Speaker Conversations
 * - Emotion Enhancement & Stability Control
 * - Rich Prompting Examples from Codebase
 * - Professional Voice Settings & Output Formats
 */

import { BaseWorker, WorkerConfig, JobResult } from '../base/BaseWorker';
import { ElevenLabsService } from '../../lib/elevenlabs/service';
import { DialogueManager } from '../../lib/elevenlabs/dialogue-manager';
import type { TextToDialogueOptions, DialogueSettings } from '../../lib/elevenlabs/types';
import { ProfileContext, HardConstraints } from '../../types/production-manifest';

export interface TTSJobPayload {
  sceneId: string;
  text: string;
  voiceId?: string;
  modelId?: string;
  languageCode?: string;
  voiceSettings?: any;
  outputFormat?: string;
  seed?: number;
  previousText?: string;
  nextText?: string;
  dialogueSettings?: DialogueSettings;
  // Enhanced features from decomposeJobs
  audioTags?: string[];
  contextAware?: boolean;
  enhanceEmotion?: boolean;
  // Rich examples integration
  promptType?: 'narrative' | 'conversational' | 'excited' | 'whispered' | 'multi_speaker';
  emotionLevel?: 'subtle' | 'moderate' | 'dramatic';
  stabilityMode?: 'natural' | 'creative' | 'stable';
  // V3 Audio Tags from codebase examples
  v3AudioTags?: Array<'excited' | 'whispers' | 'laughs' | 'sighs' | 'sarcastic' | 'curious' | 'happy' | 'sad' | 'angry' | 'surprised'>;
  // Multi-speaker support
  speakerVoices?: Array<{
    name: string;
    voice_id: string;
    lines: string[];
  }>;
  
  // NEW: Profile-Pipeline Integration
  profileContext?: ProfileContext;
  hardConstraints?: HardConstraints;
  enforcementMode?: 'strict' | 'balanced' | 'creative';
  enhancementPolicy?: 'additive' | 'transform_lite';
}

export class TTSWorker extends BaseWorker {
  private elevenLabsService: ElevenLabsService;
  private dialogueManager: DialogueManager;

  constructor(config: WorkerConfig) {
    super({
      ...config,
      jobType: 'tts_elevenlabs'
    });

    // Initialize ElevenLabs service
    this.elevenLabsService = new ElevenLabsService({
      apiKey: process.env.ELEVENLABS_API_KEY!,
      defaultVoiceId: process.env.ELEVENLABS_DEFAULT_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb',
      defaultModelId: 'eleven_multilingual_v2',
      defaultOutputFormat: 'mp3_44100_128'
    });

    // Initialize dialogue manager for audio tags
    this.dialogueManager = new DialogueManager();
  }

  /**
   * Process a TTS job using ElevenLabs Dialog API
   */
  protected async processJob(job: any): Promise<JobResult> {
    const startTime = Date.now();
    const payload: TTSJobPayload = job.payload;

    try {
      this.log('info', `Processing TTS job for scene ${payload.sceneId}`, {
        textLength: payload.text.length,
        voiceId: payload.voiceId,
        hasAudioTags: !!payload.audioTags?.length
      });

      // Step 0: Apply hard constraints before any enhancement
      const constrainedPayload = this.applyHardConstraints(payload);
      if (constrainedPayload !== payload) {
        this.log('info', 'Applied hard constraints to TTS job', {
          originalVoiceStyle: payload.voiceSettings?.style,
          constrainedVoiceStyle: constrainedPayload.voiceSettings?.style
        });
      }

      // Step 1: Enhance text with rich examples from codebase
      let enhancedText = constrainedPayload.text;
      
      // Apply V3 Audio Tags from codebase examples
      if (constrainedPayload.v3AudioTags && constrainedPayload.v3AudioTags.length > 0) {
        enhancedText = this.enhanceWithV3AudioTags(constrainedPayload.text, constrainedPayload.v3AudioTags, constrainedPayload.promptType);
        this.log('debug', 'Enhanced text with V3 audio tags', { enhancedText });
      }
      
      // Apply traditional audio tags if provided
      if (constrainedPayload.audioTags && constrainedPayload.audioTags.length > 0) {
        enhancedText = this.dialogueManager.enhanceTextWithAudioTags(
          enhancedText,
          constrainedPayload.audioTags
        );
        this.log('debug', 'Enhanced text with traditional audio tags', { enhancedText });
      }
      
      // Apply prompt type enhancements from codebase examples
      if (constrainedPayload.promptType) {
        enhancedText = this.enhanceByPromptType(enhancedText, constrainedPayload.promptType, constrainedPayload.emotionLevel);
        this.log('debug', 'Enhanced text by prompt type', { promptType: constrainedPayload.promptType, enhancedText });
      }

      // Step 2: Prepare dialogue settings
      const dialogueSettings: DialogueSettings = {
        stability: constrainedPayload.dialogueSettings?.stability || 'natural',
        use_audio_tags: constrainedPayload.dialogueSettings?.use_audio_tags ?? true,
        enhance_emotion: constrainedPayload.dialogueSettings?.enhance_emotion ?? true,
        multi_speaker: constrainedPayload.dialogueSettings?.multi_speaker ?? false,
        speaker_voices: constrainedPayload.dialogueSettings?.speaker_voices
      };

      // Step 3: Prepare ElevenLabs options
      const options: TextToDialogueOptions = {
        text: enhancedText,
        voice_id: constrainedPayload.voiceId,
        model_id: constrainedPayload.modelId || 'eleven_multilingual_v2',
        language_code: constrainedPayload.languageCode,
        voice_settings: constrainedPayload.voiceSettings,
        output_format: constrainedPayload.outputFormat || 'mp3_44100_128',
        seed: constrainedPayload.seed,
        previous_text: constrainedPayload.previousText,
        next_text: constrainedPayload.nextText,
        apply_text_normalization: 'auto',
        apply_language_text_normalization: false,
        dialogue_settings: dialogueSettings
      };

      // Step 4: Generate dialogue using ElevenLabs
      this.log('debug', 'Calling ElevenLabs Dialog API', { options });
      const result = await this.elevenLabsService.textToDialogue(options);

      // Step 5: Upload audio to Supabase Storage
      const audioPath = `tts/${job.job_id}.mp3`;
      const audioUrl = await this.uploadToStorage(
        'production-assets',
        audioPath,
        result.audio,
        'audio/mpeg'
      );

      const processingTime = Date.now() - startTime;

      this.log('info', `TTS job completed successfully`, {
        audioUrl,
        processingTimeMs: processingTime,
        audioSize: result.audio.byteLength
      });

      return {
        success: true,
        outputUrl: audioUrl,
        result: {
          voiceId: result.voice_id,
          modelId: result.model_id,
          outputFormat: result.output_format,
          text: result.text,
          enhancedText,
          audioTags: payload.audioTags,
          dialogueSettings: result.dialogue_settings,
          audioSize: result.audio.byteLength,
          processingTimeMs: processingTime
        },
        processingTimeMs: processingTime
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.log('error', `TTS job failed: ${errorMessage}`, {
        sceneId: payload.sceneId,
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
   * Validate TTS job payload
   */
  private validatePayload(payload: TTSJobPayload): void {
    if (!payload.text || payload.text.trim().length === 0) {
      throw new Error('Text is required for TTS job');
    }

    if (payload.text.length > 5000) {
      throw new Error('Text is too long (max 5000 characters)');
    }

    if (!payload.voiceId && !process.env.ELEVENLABS_DEFAULT_VOICE_ID) {
      throw new Error('Voice ID is required for TTS job');
    }
  }

  /**
   * Apply hard constraints to TTS job payload
   * - Clamps or drops conflicting enhancements
   * - Logs constraint violations
   */
  private applyHardConstraints(payload: TTSJobPayload): TTSJobPayload {
    if (!payload.hardConstraints || !payload.enforcementMode) {
      return payload; // No constraints to apply
    }

    const constraints = payload.hardConstraints;
    const enforcementMode = payload.enforcementMode;
    const constrainedPayload = { ...payload };
    const warnings: string[] = [];

    // Apply audio style constraints
    if (constraints.audioStyle) {
      // Clamp voice style to allowed style
      if (constraints.audioStyle.voiceStyle && payload.voiceSettings?.style) {
        const allowedStyle = constraints.audioStyle.voiceStyle;
        if (payload.voiceSettings.style !== allowedStyle) {
          constrainedPayload.voiceSettings = {
            ...payload.voiceSettings,
            style: allowedStyle
          };
          warnings.push(`Voice style clamped to profile constraint: ${allowedStyle}`);
        }
      }

      // Clamp emotion level based on constraints
      if (constraints.audioStyle.tone && payload.emotionLevel) {
        const allowedTone = constraints.audioStyle.tone;
        const toneMapping: Record<string, string> = {
          'professional': 'subtle',
          'casual': 'moderate',
          'energetic': 'dramatic'
        };
        const allowedEmotionLevel = toneMapping[allowedTone] || 'moderate';
        if (payload.emotionLevel !== allowedEmotionLevel) {
          constrainedPayload.emotionLevel = allowedEmotionLevel as 'subtle' | 'moderate' | 'dramatic';
          warnings.push(`Emotion level clamped to profile constraint: ${allowedEmotionLevel}`);
        }
      }
    }

    // Apply enhancement policy constraints
    if (payload.enhancementPolicy === 'additive' && enforcementMode === 'strict') {
      // In strict mode with additive policy, limit enhancements
      if (payload.v3AudioTags && payload.v3AudioTags.length > 3) {
        constrainedPayload.v3AudioTags = payload.v3AudioTags.slice(0, 3);
        warnings.push(`V3 audio tags limited to 3 in strict additive mode`);
      }
    }

    // Log constraint violations
    if (warnings.length > 0) {
      this.log('info', 'Applied hard constraints to TTS job', { warnings });
    }

    return constrainedPayload;
  }

  /**
   * Enhance text with V3 Audio Tags from codebase examples
   */
  private enhanceWithV3AudioTags(text: string, audioTags: string[], promptType?: string): string {
    // Rich examples from codebase
    const v3Examples = {
      excited: `[excited] ${text}`,
      whispers: `[whispers] ${text}`,
      laughs: `${text} [laughs]`,
      sighs: `${text} [sighs]`,
      sarcastic: `[sarcastic] ${text}`,
      curious: `[curious] ${text}`,
      happy: `[happy] ${text}`,
      sad: `[sad] ${text}`,
      angry: `[angry] ${text}`,
      surprised: `[surprised] ${text}`
    };

    // Apply first audio tag
    if (audioTags.length > 0) {
      const firstTag = audioTags[0] as keyof typeof v3Examples;
      if (v3Examples[firstTag]) {
        return v3Examples[firstTag];
      }
    }

    return text;
  }

  /**
   * Enhance text by prompt type using codebase examples
   */
  private enhanceByPromptType(text: string, promptType: string, emotionLevel?: string): string {
    const examples = {
      narrative: `[excited] ${text}`,
      conversational: `[curious] ${text}`,
      excited: `[excited] ${text}`,
      whispered: `[whispers] ${text}`,
      multi_speaker: text // Keep as-is for multi-speaker
    };

    return examples[promptType as keyof typeof examples] || text;
  }

  /**
   * Get comprehensive examples from codebase
   */
  getExamples(): any {
    return {
      v3AudioTags: {
        excited: "[excited] Okay, you are NOT going to believe this. You know how I've been totally stuck on that short story?",
        whispers: "[whispers] I have a secret to tell you. [laughs] Just kidding!",
        laughs: "It all just CLICKED. [happy gasp] I stayed up till, like, 3 AM, just typing like a maniac.",
        sighs: "[frustrated sigh] I was seriously about to just trash the whole thing. Start over.",
        sarcastic: "[sarcastic] Oh, that's just perfect. Exactly what I needed right now.",
        curious: "[curious] Just got it! I can actually do whispers now—",
        happy: "[happy] It feels so... complete now, you know? Like it finally has a soul.",
        sad: "[sad] I was seriously about to just trash the whole thing.",
        angry: "[angry] This is ridiculous! I can't believe this is happening.",
        surprised: "[surprised] Wait, what? That's not what I expected at all!"
      },
      promptTypes: {
        narrative: "Professional storytelling with emotional depth",
        conversational: "Natural dialogue with realistic pauses and inflections",
        excited: "High-energy delivery with enthusiasm and engagement",
        whispered: "Intimate, quiet delivery for dramatic effect",
        multi_speaker: "Multiple voices with distinct characteristics"
      },
      stabilityModes: {
        natural: "Balanced, human-like delivery",
        creative: "More expressive and varied",
        stable: "Consistent, predictable output"
      }
    };
  }

  /**
   * Get worker status with ElevenLabs-specific info
   */
  getStatus(): any {
    const baseStatus = super.getStatus();
    return {
      ...baseStatus,
      provider: 'elevenlabs',
      model: 'eleven_multilingual_v2',
      features: [
        'audio_tags', 
        'context_awareness', 
        'dialogue_settings', 
        'multi_language',
        'v3_audio_tags',
        'prompt_type_enhancement',
        'emotion_control',
        'stability_modes',
        'multi_speaker'
      ],
      examples: this.getExamples()
    };
  }
}

/**
 * Create and start TTS worker
 */
export async function startTTSWorker(): Promise<TTSWorker> {
  const config: WorkerConfig = {
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    jobType: 'tts_elevenlabs',
    logLevel: (process.env.LOG_LEVEL as any) || 'info',
    healthCheckPort: parseInt(process.env.HEALTH_CHECK_PORT || '3001'),
    maxConcurrentJobs: parseInt(process.env.MAX_CONCURRENT_JOBS || '3'),
    retryDelayMs: parseInt(process.env.RETRY_DELAY_MS || '5000')
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

  const worker = new TTSWorker(config);
  await worker.start();
  
  return worker;
}

// Export for use in worker orchestration
export { TTSWorker };
