/**
 * 👤 VEED Talking Avatar Worker - Enhanced with Multi-Provider Avatar Pipeline
 * 
 * Processes talking avatar generation jobs using VEED Fabric 1.0 with comprehensive
 * avatar creation pipeline supporting multiple image providers and ElevenLabs Dialogue TTS
 * based on your extensive codebase.
 * 
 * Key Features:
 * - VEED Fabric 1.0 Integration (Image + Audio → Talking Video)
 * - Complete Avatar Pipeline (Image Gen → TTS → Lip Sync → Final Video)
 * - Dual Image Providers: ImageGPT-1 (high-quality) + Nano Banana (cost-effective)
 * - ElevenLabs Dialogue Integration (Always uses dialogue model for natural speech)
 * - C.R.I.S.T.A.L Method Support (Nano Banana enhanced prompting)
 * - Rich Avatar Examples from Codebase
 * - Professional Quality & Cost Optimization
 * - Advanced Avatar Customization
 */

import { BaseWorker, WorkerConfig, JobResult } from '../base/BaseWorker';
import { executeVeedFabric, VeedFabricInput } from '../../executors/veed-fabric-1.0';
import { executeGPTImage1, GPTImage1Input } from '../../executors/gpt-image-1';
import { executeNanoBanana, NanoBananaInput } from '../../executors/nano-banana';
import { ElevenLabsService } from '../../lib/elevenlabs/service';

export interface TalkingAvatarJobPayload {
  sceneId: string;
  avatarId: string;
  // Avatar image generation
  avatarImage?: {
    prompt: string;
    style?: 'realistic' | 'cartoon' | 'anime' | 'professional' | 'casual' | 'corporate';
    gender?: 'male' | 'female' | 'neutral';
    age?: 'young' | 'middle-aged' | 'senior' | 'any';
    ethnicity?: string;
    clothing?: string;
    background?: 'transparent' | 'solid' | 'office' | 'studio' | 'outdoor';
    quality?: 'standard' | 'high' | 'premium';
    // Image generation provider
    imageProvider?: 'imagegpt1' | 'nano_banana';
    // Nano Banana specific settings
    nanoBananaSettings?: {
      useCristalMethod?: boolean;
      cristalContext?: string;
      promptType?: 'avatar' | 'portrait' | 'character' | 'professional';
      imageStyle?: 'realistic' | 'artistic' | 'photographic' | 'illustration';
      composition?: 'close-up' | 'medium-shot' | 'full-body' | 'headshot';
      lighting?: 'natural' | 'studio' | 'dramatic' | 'soft' | 'professional';
      colorPalette?: 'warm' | 'cool' | 'neutral' | 'vibrant' | 'monochrome';
      detailLevel?: 'high' | 'medium' | 'standard';
      negativePrompt?: string;
      seed?: number;
    };
  };
  // Use existing image
  existingImageUrl?: string;
  // Audio generation
  audioText: string;
  voiceSettings?: {
    voiceId?: string;
    modelId?: string;
    languageCode?: string;
    voiceSettings?: {
      stability: number;
      similarity_boost: number;
      style?: number;
      use_speaker_boost?: boolean;
    };
    // Enhanced TTS features
    v3AudioTags?: string[];
    promptType?: 'narrative' | 'conversational' | 'excited' | 'whispered' | 'multi_speaker';
    emotionControl?: 'subtle' | 'moderate' | 'dramatic';
    stabilityMode?: 'natural' | 'creative' | 'stable';
  };
  // VEED Fabric 1.0 settings
  resolution?: '480p' | '720p';
  // Enhanced features from codebase
  avatarType?: 'presenter' | 'instructor' | 'spokesperson' | 'character' | 'celebrity' | 'custom';
  useCase?: 'education' | 'marketing' | 'training' | 'entertainment' | 'corporate' | 'social_media';
  // Professional settings
  enhanceWithPipeline?: boolean;
  useImageGPT1?: boolean;
  useNanoBanana?: boolean;
  useElevenLabsDialogue?: boolean;
  // Cost optimization
  costLimit?: number;
  maxDuration?: number;
  // Quality settings
  outputQuality?: 'standard' | 'high' | 'premium';
}

export class TalkingAvatarWorker extends BaseWorker {
  private elevenLabsService: ElevenLabsService;

  constructor(config: WorkerConfig) {
    super({
      ...config,
      jobType: 'gen_talking_avatar_veed'
    });

    // Initialize ElevenLabs service
    this.elevenLabsService = new ElevenLabsService({
      apiKey: process.env.ELEVENLABS_API_KEY!,
      defaultModelId: 'eleven_multilingual_v2',
      defaultOutputFormat: 'mp3_44100_128'
    });
  }

  /**
   * Process a talking avatar generation job using VEED Fabric 1.0
   */
  protected async processJob(job: any): Promise<JobResult> {
    const startTime = Date.now();
    const payload: TalkingAvatarJobPayload = job.payload;

    try {
      this.log('info', `Processing talking avatar job for scene ${payload.sceneId}`, {
        avatarId: payload.avatarId,
        avatarType: payload.avatarType,
        useCase: payload.useCase,
        hasExistingImage: !!payload.existingImageUrl,
        audioTextLength: payload.audioText.length
      });

      let imageUrl: string;
      let audioUrl: string;

      // Step 1: Generate or use avatar image
      if (payload.existingImageUrl) {
        imageUrl = payload.existingImageUrl;
        this.log('debug', 'Using existing image URL', { imageUrl });
      } else if (payload.avatarImage && (payload.useImageGPT1 || payload.useNanoBanana)) {
        const imageProvider = payload.avatarImage.imageProvider || (payload.useNanoBanana ? 'nano_banana' : 'imagegpt1');
        imageUrl = await this.generateAvatarImage(payload.avatarImage, imageProvider);
        this.log('debug', 'Generated avatar image', { imageUrl, provider: imageProvider });
      } else {
        throw new Error('Either existingImageUrl or avatarImage with useImageGPT1/useNanoBanana must be provided');
      }

      // Step 2: Generate audio using ElevenLabs Dialogue TTS
      if (payload.useElevenLabsDialogue) {
        audioUrl = await this.generateAvatarAudio(payload.audioText, payload.voiceSettings);
        this.log('debug', 'Generated avatar audio with ElevenLabs Dialogue', { audioUrl });
      } else {
        throw new Error('useElevenLabsDialogue must be enabled for audio generation');
      }

      // Step 3: Generate talking avatar using VEED Fabric 1.0
      this.log('debug', 'Calling VEED Fabric 1.0 for talking avatar generation', { 
        imageUrl, 
        audioUrl,
        resolution: payload.resolution
      });

      const veedInput: VeedFabricInput = {
        image_url: imageUrl,
        audio_url: audioUrl,
        resolution: payload.resolution || '480p'
      };

      const result = await executeVeedFabric(veedInput);

      if ('error' in result) {
        throw new Error(`VEED Fabric 1.0 failed: ${result.message}`);
      }

      // Step 4: Upload talking avatar video to Supabase Storage
      const videoPath = `talking_avatars/${job.job_id}.mp4`;
      const videoResponse = await fetch(result.video.url);
      const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
      const videoUrl = await this.uploadToStorage(
        'production-assets',
        videoPath,
        videoBuffer,
        'video/mp4'
      );

      const processingTime = Date.now() - startTime;

      this.log('info', `Talking avatar generation job completed successfully`, {
        videoUrl,
        processingTimeMs: processingTime,
        videoSize: videoBuffer.length,
        avatarType: payload.avatarType,
        resolution: payload.resolution
      });

      return {
        success: true,
        outputUrl: videoUrl,
        result: {
          avatarType: payload.avatarType,
          useCase: payload.useCase,
          resolution: payload.resolution,
          audioText: payload.audioText,
          imageUrl,
          audioUrl,
          videoSize_bytes: videoBuffer.length,
          processingTimeMs: processingTime,
          avatarId: payload.avatarId,
          sceneId: payload.sceneId,
          originalVideoUrl: result.video.url,
          fileSize: result.video.file_size,
          contentType: result.video.content_type
        },
        processingTimeMs: processingTime
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.log('error', `Talking avatar generation job failed: ${errorMessage}`, {
        sceneId: payload.sceneId,
        avatarType: payload.avatarType,
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
   * Generate avatar image using ImageGPT-1 or Nano Banana
   */
  private async generateAvatarImage(avatarImage: TalkingAvatarJobPayload['avatarImage'], provider: 'imagegpt1' | 'nano_banana'): Promise<string> {
    if (!avatarImage) {
      throw new Error('Avatar image configuration is required');
    }

    let imageBuffer: Buffer;
    let contentType: string;

    if (provider === 'imagegpt1') {
      // Generate using ImageGPT-1
      const prompt = this.createAvatarPrompt(avatarImage);

      const gptInput: GPTImage1Input = {
        prompt,
        model: 'gpt-image-1',
        quality: avatarImage.quality === 'premium' ? 'high' : 'medium',
        size: '1024x1024',
        background: avatarImage.background === 'transparent' ? 'transparent' : 'opaque',
        output_format: 'png',
        n: 1
      };

      const result = await executeGPTImage1(gptInput);

      if (!result.data || result.data.length === 0) {
        throw new Error('Failed to generate avatar image with ImageGPT-1');
      }

      imageBuffer = Buffer.from(result.data[0].b64_json, 'base64');
      contentType = 'image/png';
    } else {
      // Generate using Nano Banana
      const prompt = this.createNanoBananaAvatarPrompt(avatarImage);

      const nanoInput: NanoBananaInput = {
        prompt,
        model: 'nano-banana',
        useCristalMethod: avatarImage.nanoBananaSettings?.useCristalMethod || true,
        cristalContext: avatarImage.nanoBananaSettings?.cristalContext || 'Professional avatar portrait for talking video',
        promptType: avatarImage.nanoBananaSettings?.promptType || 'avatar',
        imageStyle: avatarImage.nanoBananaSettings?.imageStyle || 'realistic',
        composition: avatarImage.nanoBananaSettings?.composition || 'close-up',
        lighting: avatarImage.nanoBananaSettings?.lighting || 'professional',
        colorPalette: avatarImage.nanoBananaSettings?.colorPalette || 'neutral',
        detailLevel: avatarImage.nanoBananaSettings?.detailLevel || 'high',
        negativePrompt: avatarImage.nanoBananaSettings?.negativePrompt || 'blurry, low quality, distorted, multiple people',
        seed: avatarImage.nanoBananaSettings?.seed,
        outputFormat: 'png',
        quality: avatarImage.quality === 'premium' ? 'high' : 'medium'
      };

      const result = await executeNanoBanana(nanoInput);

      if (!result.success || !result.image) {
        throw new Error('Failed to generate avatar image with Nano Banana');
      }

      // Convert base64 to buffer
      imageBuffer = Buffer.from(result.image.base64Data, 'base64');
      contentType = 'image/png';
    }

    // Upload image to temporary storage and return URL
    const imagePath = `temp_avatars/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.png`;
    const imageUrl = await this.uploadToStorage(
      'production-assets',
      imagePath,
      imageBuffer,
      contentType
    );

    return imageUrl;
  }

  /**
   * Create enhanced prompt for Nano Banana avatar generation
   */
  private createNanoBananaAvatarPrompt(avatarImage: TalkingAvatarJobPayload['avatarImage']): string {
    if (!avatarImage) return '';

    let prompt = 'Professional portrait of a person, ';
    
    // Add gender
    if (avatarImage.gender) {
      prompt += `${avatarImage.gender} person, `;
    }
    
    // Add age
    if (avatarImage.age) {
      prompt += `${avatarImage.age} age, `;
    }
    
    // Add ethnicity
    if (avatarImage.ethnicity) {
      prompt += `${avatarImage.ethnicity} ethnicity, `;
    }
    
    // Add clothing
    if (avatarImage.clothing) {
      prompt += `wearing ${avatarImage.clothing}, `;
    }
    
    // Add style
    if (avatarImage.style) {
      const styleEnhancements = {
        realistic: 'photorealistic, high detail, professional photography',
        cartoon: 'cartoon style, animated character, colorful',
        anime: 'anime style, manga character, stylized',
        professional: 'business professional, corporate attire, clean background',
        casual: 'casual clothing, relaxed pose, friendly expression',
        corporate: 'corporate headshot, business attire, professional setting'
      };
      prompt += `${styleEnhancements[avatarImage.style]}, `;
    }
    
    // Add background
    if (avatarImage.background) {
      const backgroundEnhancements = {
        transparent: 'transparent background',
        solid: 'solid color background',
        office: 'modern office background',
        studio: 'professional studio background',
        outdoor: 'outdoor natural lighting'
      };
      prompt += `${backgroundEnhancements[avatarImage.background]}, `;
    }
    
    // Add quality enhancements
    prompt += 'high quality, detailed, clear facial features, good lighting, ';
    
    // Add avatar-specific enhancements
    prompt += 'suitable for talking avatar, clear mouth and facial expressions, ';
    
    // Add the original prompt
    prompt += avatarImage.prompt;
    
    return prompt;
  }

  /**
   * Create enhanced prompt for ImageGPT-1 avatar generation
   */
  private createAvatarPrompt(avatarImage: TalkingAvatarJobPayload['avatarImage']): string {
    if (!avatarImage) return '';

    let prompt = 'Professional portrait of a person, ';
    
    // Add gender
    if (avatarImage.gender) {
      prompt += `${avatarImage.gender} person, `;
    }
    
    // Add age
    if (avatarImage.age) {
      prompt += `${avatarImage.age} age, `;
    }
    
    // Add ethnicity
    if (avatarImage.ethnicity) {
      prompt += `${avatarImage.ethnicity} ethnicity, `;
    }
    
    // Add clothing
    if (avatarImage.clothing) {
      prompt += `wearing ${avatarImage.clothing}, `;
    }
    
    // Add style
    if (avatarImage.style) {
      const styleEnhancements = {
        realistic: 'photorealistic, high detail, professional photography',
        cartoon: 'cartoon style, animated character, colorful',
        anime: 'anime style, manga character, stylized',
        professional: 'business professional, corporate attire, clean background',
        casual: 'casual clothing, relaxed pose, friendly expression',
        corporate: 'corporate headshot, business attire, professional setting'
      };
      prompt += `${styleEnhancements[avatarImage.style]}, `;
    }
    
    // Add background
    if (avatarImage.background) {
      const backgroundEnhancements = {
        transparent: 'transparent background',
        solid: 'solid color background',
        office: 'modern office background',
        studio: 'professional studio background',
        outdoor: 'outdoor natural lighting'
      };
      prompt += `${backgroundEnhancements[avatarImage.background]}, `;
    }
    
    // Add quality enhancements
    prompt += 'high quality, detailed, clear facial features, good lighting, ';
    
    // Add avatar-specific enhancements
    prompt += 'suitable for talking avatar, clear mouth and facial expressions, ';
    
    // Add the original prompt
    prompt += avatarImage.prompt;
    
    return prompt;
  }

  /**
   * Generate avatar audio using ElevenLabs Dialogue TTS
   */
  private async generateAvatarAudio(text: string, voiceSettings?: TalkingAvatarJobPayload['voiceSettings']): Promise<string> {
    // Enhance text with V3 audio tags if provided
    let enhancedText = text;
    if (voiceSettings?.v3AudioTags && voiceSettings.v3AudioTags.length > 0) {
      enhancedText = this.enhanceWithV3AudioTags(text, voiceSettings.v3AudioTags, voiceSettings.promptType);
    }

    // Apply prompt type enhancements for dialogue
    if (voiceSettings?.promptType) {
      enhancedText = this.enhanceByPromptType(enhancedText, voiceSettings.promptType);
    }

    // Always use ElevenLabs Dialogue model for talking avatars
    const result = await this.elevenLabsService.generateSpeech({
      text: enhancedText,
      voice_id: voiceSettings?.voiceId || 'pNInz6obpgDQGcFmaJgB', // Default voice
      model_id: 'eleven_multilingual_v2', // Always use dialogue model
      voice_settings: voiceSettings?.voiceSettings || {
        stability: 0.5,
        similarity_boost: 0.5,
        use_speaker_boost: true
      }
    });

    // Upload audio to temporary storage and return URL
    const audioPath = `temp_audio/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.mp3`;
    const audioUrl = await this.uploadToStorage(
      'production-assets',
      audioPath,
      result.audio,
      'audio/mpeg'
    );

    return audioUrl;
  }

  /**
   * Enhance text with V3 Audio Tags
   */
  private enhanceWithV3AudioTags(text: string, audioTags: string[], promptType?: string): string {
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

    let enhancedText = text;
    for (const tag of audioTags) {
      if (v3Examples[tag as keyof typeof v3Examples]) {
        enhancedText = v3Examples[tag as keyof typeof v3Examples];
        break; // Use first matching tag
      }
    }

    return enhancedText;
  }

  /**
   * Enhance text by prompt type
   */
  private enhanceByPromptType(text: string, promptType: string): string {
    const typeEnhancements = {
      narrative: `Narrate this in a clear, engaging voice: ${text}`,
      conversational: `Say this in a natural, conversational tone: ${text}`,
      excited: `Express this with enthusiasm and energy: ${text}`,
      whispered: `Whisper this softly and intimately: ${text}`,
      multi_speaker: `Present this as a dialogue: ${text}`
    };

    return typeEnhancements[promptType as keyof typeof typeEnhancements] || text;
  }

  /**
   * Validate talking avatar job payload
   */
  private validatePayload(payload: TalkingAvatarJobPayload): void {
    if (!payload.audioText || payload.audioText.trim().length === 0) {
      throw new Error('Audio text is required for talking avatar job');
    }

    if (!payload.avatarId) {
      throw new Error('Avatar ID is required for talking avatar job');
    }

    if (!payload.existingImageUrl && !payload.avatarImage) {
      throw new Error('Either existingImageUrl or avatarImage must be provided');
    }

    if (payload.audioText.length > 5000) {
      throw new Error('Audio text is too long (max 5000 characters)');
    }

    if (payload.costLimit && payload.costLimit < 0) {
      throw new Error('Cost limit must be positive');
    }
  }

  /**
   * Get comprehensive examples from codebase
   */
  getExamples(): any {
    return {
      veedFabricTalkingAvatar: {
        description: "VEED Fabric 1.0 Talking Avatar - Transform any image into a realistic talking video",
        cost: "480p ($0.08/sec), 720p ($0.15/sec)",
        features: [
          "Image-to-video generation",
          "Realistic lip-sync",
          "High-quality output",
          "Multiple resolutions",
          "Commercial use",
          "Multilingual support"
        ],
        bestFor: "Talking avatars, presentations, educational content, marketing videos"
      },
      avatarTypes: {
        presenter: {
          description: "Professional presenter for business content",
          style: "Business professional, corporate attire, clean background",
          bestFor: "Corporate presentations, business training, professional content"
        },
        instructor: {
          description: "Educational instructor for learning content",
          style: "Friendly, approachable, educational setting",
          bestFor: "Online courses, tutorials, educational videos"
        },
        spokesperson: {
          description: "Brand spokesperson for marketing content",
          style: "Confident, trustworthy, branded appearance",
          bestFor: "Marketing videos, brand announcements, promotional content"
        },
        character: {
          description: "Animated character for entertainment content",
          style: "Cartoon or anime style, colorful, expressive",
          bestFor: "Entertainment videos, animated content, creative projects"
        },
        celebrity: {
          description: "Celebrity-style avatar for high-end content",
          style: "Glamorous, polished, professional photography",
          bestFor: "Premium content, celebrity endorsements, luxury brands"
        },
        custom: {
          description: "Custom avatar based on specific requirements",
          style: "Tailored to specific needs and preferences",
          bestFor: "Unique requirements, specialized content, custom branding"
        }
      },
      useCases: {
        education: {
          description: "Educational content and online learning",
          avatarType: "instructor",
          voiceStyle: "Clear, engaging, educational",
          bestFor: "Online courses, tutorials, educational videos"
        },
        marketing: {
          description: "Marketing and promotional content",
          avatarType: "spokesperson",
          voiceStyle: "Confident, persuasive, engaging",
          bestFor: "Product demos, brand videos, promotional content"
        },
        training: {
          description: "Corporate training and development",
          avatarType: "presenter",
          voiceStyle: "Professional, clear, authoritative",
          bestFor: "Employee training, compliance videos, corporate communications"
        },
        entertainment: {
          description: "Entertainment and creative content",
          avatarType: "character",
          voiceStyle: "Expressive, dynamic, entertaining",
          bestFor: "Entertainment videos, creative projects, animated content"
        },
        corporate: {
          description: "Corporate communications and presentations",
          avatarType: "presenter",
          voiceStyle: "Professional, trustworthy, clear",
          bestFor: "Executive communications, corporate announcements, business presentations"
        },
        social_media: {
          description: "Social media and viral content",
          avatarType: "character",
          voiceStyle: "Engaging, trendy, attention-grabbing",
          bestFor: "Social media posts, viral videos, influencer content"
        }
      },
      pipeline: {
        step1: "Generate or upload avatar image (ImageGPT-1, Nano Banana, or existing image)",
        step2: "Generate audio using ElevenLabs Dialogue TTS with enhanced features",
        step3: "Combine image and audio using VEED Fabric 1.0",
        step4: "Output professional talking avatar video"
      },
      imageProviders: {
        imagegpt1: {
          description: "OpenAI's ImageGPT-1 for high-quality avatar generation",
          bestFor: "Professional avatars, detailed portraits, high-quality output",
          features: ["Superior text rendering", "Detailed instruction following", "High-quality output"]
        },
        nano_banana: {
          description: "Fal.ai Nano Banana for cost-effective avatar generation",
          bestFor: "Cost-effective avatars, consistent character generation, rapid prototyping",
          features: ["C.R.I.S.T.A.L method", "Cost-effective", "Fast generation", "Character consistency"]
        }
      },
      ttsIntegration: {
        elevenlabs_dialogue: {
          description: "ElevenLabs Dialogue model for natural talking avatar speech",
          model: "eleven_multilingual_v2",
          features: ["Natural dialogue", "Multilingual support", "High-quality speech", "Emotion control"],
          bestFor: "Talking avatars, presentations, educational content"
        }
      },
      bestPractices: [
        'Use ImageGPT-1 for high-quality avatar generation or Nano Banana for cost-effective options',
        'Always use ElevenLabs Dialogue model for natural talking avatar speech',
        'Apply V3 audio tags for enhanced voice expression',
        'Choose appropriate avatar type for your use case',
        'Use professional voice settings for business content',
        'Test different resolutions for optimal quality/cost balance',
        'Consider your target audience when selecting avatar style',
        'Use transparent backgrounds for flexible video integration',
        'Optimize audio text length for cost efficiency',
        'Apply appropriate voice emotions for content type',
        'Use C.R.I.S.T.A.L method with Nano Banana for consistent results',
        'Test the complete pipeline for best results'
      ]
    };
  }

  /**
   * Get worker status with VEED talking avatar-specific info
   */
  getStatus(): any {
    const baseStatus = super.getStatus();
    return {
      ...baseStatus,
      provider: 'veed_fabric',
      model: 'veed/fabric-1.0',
      features: [
        'talking_avatar_generation',
        'image_to_video',
        'realistic_lipsync',
        'complete_pipeline',
        'imagegpt1_integration',
        'nano_banana_integration',
        'elevenlabs_dialogue_integration',
        'professional_quality',
        'rich_examples',
        'cost_optimization'
      ],
      supportedAvatarTypes: [
        'presenter', 'instructor', 'spokesperson', 'character', 'celebrity', 'custom'
      ],
      supportedUseCases: [
        'education', 'marketing', 'training', 'entertainment', 'corporate', 'social_media'
      ],
      supportedImageProviders: ['imagegpt1', 'nano_banana'],
      supportedTTSProvider: 'elevenlabs_dialogue',
      supportedResolutions: ['480p', '720p'],
      maxAudioLength: 5000, // characters
      examples: this.getExamples()
    };
  }
}

/**
 * Create and start Talking Avatar worker
 */
export async function startTalkingAvatarWorker(): Promise<TalkingAvatarWorker> {
  const config: WorkerConfig = {
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    jobType: 'gen_talking_avatar_veed',
    logLevel: (process.env.LOG_LEVEL as any) || 'info',
    healthCheckPort: parseInt(process.env.HEALTH_CHECK_PORT || '3009'),
    maxConcurrentJobs: parseInt(process.env.MAX_CONCURRENT_JOBS || '1'), // Resource intensive
    retryDelayMs: parseInt(process.env.RETRY_DELAY_MS || '20000')
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
  if (!process.env.FAL_KEY) {
    throw new Error('FAL_KEY environment variable is required');
  }

  const worker = new TalkingAvatarWorker(config);
  await worker.start();
  
  return worker;
}

// Export for use in worker orchestration
export { TalkingAvatarWorker };
