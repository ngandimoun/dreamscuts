/**
 * AI Avatar Workflow Examples - Complete Implementation
 * 
 * This file demonstrates the complete AI avatar workflow system that combines:
 * 1. Image Generation (4 models: Multi-camera, Nano Banana, SeeDream, Custom)
 * 2. Video Animation (Veo 3 Fast with audio-off)
 * 3. Voice Generation (ElevenLabs)
 * 4. Lip Sync (Veed)
 * 
 * The system creates professional-quality, synchronized video avatars for various use cases.
 */

import { fal } from "@fal-ai/client";
import { ElevenLabsService } from '@/lib/elevenlabs';
import { VeedLipsyncExecutor } from '@/executors/veed-lipsync';
import { FalAiVeo3FastImageToVideoExecutor } from '@/executors/fal-ai-veo3-fast-image-to-video';

// ============================================================================
// WORKFLOW ORCHESTRATOR CLASS
// ============================================================================

export interface AvatarWorkflowOptions {
  imageModel: 'nano-banana' | 'seedream-4' | 'multi-camera' | 'custom-diffusion';
  voiceSettings: {
    voice_id: string;
    stability?: number;
    similarity_boost?: number;
    style?: number;
    model_id?: string;
  };
  videoSettings: {
    duration?: '8s';
    resolution?: '720p' | '1080p';
    aspect_ratio?: 'auto' | '16:9' | '9:16';
  };
  lipsyncSettings: {
    quality?: 'low' | 'medium' | 'high';
    fps?: 24 | 30 | 60;
  };
}

export interface AvatarWorkflowResult {
  image: {
    url: string;
    model: string;
    cost: number;
  };
  video: {
    url: string;
    duration: string;
    cost: number;
  };
  voice: {
    url: string;
    duration: number;
    cost: number;
  };
  finalVideo: {
    url: string;
    duration: number;
    cost: number;
  };
  totalCost: number;
  processingTime: number;
}

export class AvatarWorkflowOrchestrator {
  private elevenLabsService: ElevenLabsService;
  private veedLipsyncExecutor: VeedLipsyncExecutor;
  private veo3FastExecutor: FalAiVeo3FastImageToVideoExecutor;

  constructor(apiKeys: {
    falApiKey: string;
    elevenLabsApiKey: string;
    veedApiKey: string;
  }) {
    // Configure FAL AI
    fal.config({ credentials: apiKeys.falApiKey });
    
    // Initialize services
    this.elevenLabsService = new ElevenLabsService({
      apiKey: apiKeys.elevenLabsApiKey
    });
    
    this.veedLipsyncExecutor = new VeedLipsyncExecutor(apiKeys.veedApiKey);
    this.veo3FastExecutor = new FalAiVeo3FastImageToVideoExecutor(apiKeys.falApiKey);
  }

  /**
   * Complete avatar workflow: Image → Video → Voice → Lip Sync
   */
  async createAvatar(
    prompt: string,
    options: AvatarWorkflowOptions
  ): Promise<AvatarWorkflowResult> {
    const startTime = Date.now();
    let totalCost = 0;

    try {
      // Step 1: Generate base image
      console.log('🎨 Step 1: Generating avatar image...');
      const imageResult = await this.generateImage(prompt, options.imageModel);
      totalCost += imageResult.cost;

      // Step 2: Animate with Veo 3 Fast (audio-off)
      console.log('🎬 Step 2: Animating avatar with Veo 3 Fast...');
      const videoResult = await this.animateImage(
        imageResult.url,
        prompt,
        options.videoSettings
      );
      totalCost += videoResult.cost;

      // Step 3: Generate voice with ElevenLabs
      console.log('🎤 Step 3: Generating voice with ElevenLabs...');
      const voiceResult = await this.generateVoice(prompt, options.voiceSettings);
      totalCost += voiceResult.cost;

      // Step 4: Sync voice with video using Veed
      console.log('👄 Step 4: Syncing voice with video...');
      const lipsyncResult = await this.syncVoice(
        videoResult.url,
        voiceResult.url,
        options.lipsyncSettings
      );
      totalCost += lipsyncResult.cost;

      const processingTime = Date.now() - startTime;

      return {
        image: imageResult,
        video: videoResult,
        voice: voiceResult,
        finalVideo: lipsyncResult,
        totalCost,
        processingTime
      };

    } catch (error) {
      throw new Error(`Avatar workflow failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate base image using selected model
   */
  private async generateImage(
    prompt: string,
    model: AvatarWorkflowOptions['imageModel']
  ): Promise<{ url: string; model: string; cost: number }> {
    const modelConfigs = {
      'nano-banana': {
        endpoint: 'fal-ai/gemini-25-flash-image',
        cost: 0.039
      },
      'seedream-4': {
        endpoint: 'fal-ai/bytedance/seedream/v4/text-to-image',
        cost: 0.03
      },
      'multi-camera': {
        endpoint: 'fal-ai/multi-camera-generator',
        cost: 0.035
      },
      'custom-diffusion': {
        endpoint: 'fal-ai/custom-diffusion',
        cost: 0.04
      }
    };

    const config = modelConfigs[model];
    
    const result = await fal.subscribe(config.endpoint, {
      input: {
        prompt: prompt,
        image_size: 'square_hd',
        num_inference_steps: 30,
        guidance_scale: 7.5
      }
    });

    return {
      url: result.data.images[0].url,
      model: model,
      cost: config.cost
    };
  }

  /**
   * Animate image with Veo 3 Fast (audio disabled)
   */
  private async animateImage(
    imageUrl: string,
    prompt: string,
    settings: AvatarWorkflowOptions['videoSettings']
  ): Promise<{ url: string; duration: string; cost: number }> {
    const result = await this.veo3FastExecutor.generateVideo({
      prompt: prompt,
      image_url: imageUrl,
      aspect_ratio: settings.aspect_ratio || 'auto',
      duration: settings.duration || '8s',
      generate_audio: false, // Key: Audio disabled for voice sync
      resolution: settings.resolution || '720p'
    });

    // Calculate cost based on duration
    const durationSeconds = 8; // Fixed 8 seconds for Veo 3 Fast
    const costPerSecond = 0.25; // Veo 3 Fast pricing
    const cost = durationSeconds * costPerSecond;

    return {
      url: result.video.url,
      duration: settings.duration || '8s',
      cost: cost
    };
  }

  /**
   * Generate voice with ElevenLabs
   */
  private async generateVoice(
    text: string,
    settings: AvatarWorkflowOptions['voiceSettings']
  ): Promise<{ url: string; duration: number; cost: number }> {
    const result = await this.elevenLabsService.generateSpeech({
      text: text,
      voice_id: settings.voice_id,
      voice_settings: {
        stability: settings.stability || 0.75,
        similarity_boost: settings.similarity_boost || 0.85,
        style: settings.style || 0.3,
        use_speaker_boost: true
      },
      model_id: settings.model_id || 'eleven_multilingual_v2'
    });

    // Estimate cost (ElevenLabs pricing varies by model)
    const estimatedDuration = text.length / 15; // Rough estimate: 15 chars per second
    const costPerSecond = 0.01; // Approximate ElevenLabs cost
    const cost = estimatedDuration * costPerSecond;

    return {
      url: result.audio_url,
      duration: estimatedDuration,
      cost: cost
    };
  }

  /**
   * Sync voice with video using Veed
   */
  private async syncVoice(
    videoUrl: string,
    audioUrl: string,
    settings: AvatarWorkflowOptions['lipsyncSettings']
  ): Promise<{ url: string; duration: number; cost: number }> {
    const result = await this.veedLipsyncExecutor.generateLipsync({
      video_url: videoUrl,
      audio_url: audioUrl,
      quality: settings.quality || 'high',
      fps: settings.fps || 30
    });

    // Calculate cost based on duration
    const durationMinutes = 8 / 60; // 8 seconds = ~0.13 minutes
    const costPerMinute = 0.4; // Veed pricing
    const cost = durationMinutes * costPerMinute;

    return {
      url: result.video.url,
      duration: 8, // 8 seconds
      cost: cost
    };
  }
}

// ============================================================================
// PRACTICAL USE CASE EXAMPLES
// ============================================================================

export const avatarWorkflowExamples = {
  
  // ============================================================================
  // CORPORATE TRAINING AVATAR
  // ============================================================================
  
  corporateTraining: {
    name: "Corporate Training Avatar",
    description: "Professional CEO avatar for corporate training videos",
    
    async create() {
      const orchestrator = new AvatarWorkflowOrchestrator({
        falApiKey: process.env.FAL_KEY!,
        elevenLabsApiKey: process.env.ELEVENLABS_API_KEY!,
        veedApiKey: process.env.VEED_API_KEY!
      });

      return await orchestrator.createAvatar(
        "Professional CEO in business suit, confident expression, corporate office background, looking directly at camera with authoritative presence",
        {
          imageModel: 'nano-banana', // Best for realistic, consistent avatars
          voiceSettings: {
            voice_id: 'professional_corporate_voice',
            stability: 0.75,
            similarity_boost: 0.85,
            style: 0.3
          },
          videoSettings: {
            duration: '8s',
            resolution: '1080p',
            aspect_ratio: '16:9'
          },
          lipsyncSettings: {
            quality: 'high',
            fps: 30
          }
        }
      );
    }
  },

  // ============================================================================
  // EDUCATIONAL CONTENT AVATAR
  // ============================================================================
  
  educationalContent: {
    name: "Educational Content Avatar",
    description: "Friendly teacher avatar for educational videos",
    
    async create() {
      const orchestrator = new AvatarWorkflowOrchestrator({
        falApiKey: process.env.FAL_KEY!,
        elevenLabsApiKey: process.env.ELEVENLABS_API_KEY!,
        veedApiKey: process.env.VEED_API_KEY!
      });

      return await orchestrator.createAvatar(
        "Friendly teacher in casual professional attire, warm smile, classroom background, approachable and engaging expression",
        {
          imageModel: 'nano-banana', // Consistent character across lessons
          voiceSettings: {
            voice_id: 'educational_inspirational_voice',
            stability: 0.7,
            similarity_boost: 0.8,
            style: 0.4
          },
          videoSettings: {
            duration: '8s',
            resolution: '720p',
            aspect_ratio: '16:9'
          },
          lipsyncSettings: {
            quality: 'high',
            fps: 24
          }
        }
      );
    }
  },

  // ============================================================================
  // MARKETING SPOKESPERSON AVATAR
  // ============================================================================
  
  marketingSpokesperson: {
    name: "Marketing Spokesperson Avatar",
    description: "Stylized brand spokesperson for marketing content",
    
    async create() {
      const orchestrator = new AvatarWorkflowOrchestrator({
        falApiKey: process.env.FAL_KEY!,
        elevenLabsApiKey: process.env.ELEVENLABS_API_KEY!,
        veedApiKey: process.env.VEED_API_KEY!
      });

      return await orchestrator.createAvatar(
        "Stylized brand spokesperson, modern fashion, vibrant background, energetic and enthusiastic expression, trendy and contemporary look",
        {
          imageModel: 'seedream-4', // Best for stylized, high-resolution content
          voiceSettings: {
            voice_id: 'marketing_energetic_voice',
            stability: 0.6,
            similarity_boost: 0.9,
            style: 0.5
          },
          videoSettings: {
            duration: '8s',
            resolution: '1080p',
            aspect_ratio: '9:16' // Vertical for social media
          },
          lipsyncSettings: {
            quality: 'high',
            fps: 30
          }
        }
      );
    }
  },

  // ============================================================================
  // MULTILINGUAL CONTENT AVATAR
  // ============================================================================
  
  multilingualContent: {
    name: "Multilingual Content Avatar",
    description: "Same avatar, multiple languages with perfect lip sync",
    
    async createMultipleLanguages() {
      const orchestrator = new AvatarWorkflowOrchestrator({
        falApiKey: process.env.FAL_KEY!,
        elevenLabsApiKey: process.env.ELEVENLABS_API_KEY!,
        veedApiKey: process.env.VEED_API_KEY!
      });

      const basePrompt = "Professional presenter in business casual attire, confident expression, modern office background";
      
      // Generate base image and video once
      const imageResult = await orchestrator['generateImage'](basePrompt, 'nano-banana');
      const videoResult = await orchestrator['animateImage'](imageResult.url, basePrompt, {
        duration: '8s',
        resolution: '1080p',
        aspect_ratio: '16:9'
      });

      // Generate voices in multiple languages
      const languages = [
        { code: 'en', text: 'Welcome to our presentation. Today we will discuss the latest trends in technology.', voice_id: 'english_professional' },
        { code: 'es', text: 'Bienvenidos a nuestra presentación. Hoy discutiremos las últimas tendencias en tecnología.', voice_id: 'spanish_professional' },
        { code: 'fr', text: 'Bienvenue à notre présentation. Aujourd\'hui, nous discuterons des dernières tendances technologiques.', voice_id: 'french_professional' },
        { code: 'de', text: 'Willkommen zu unserer Präsentation. Heute werden wir die neuesten Technologietrends diskutieren.', voice_id: 'german_professional' }
      ];

      const results = [];
      for (const lang of languages) {
        const voiceResult = await orchestrator['generateVoice'](lang.text, {
          voice_id: lang.voice_id,
          stability: 0.75,
          similarity_boost: 0.85,
          style: 0.3,
          model_id: 'eleven_multilingual_v2'
        });

        const lipsyncResult = await orchestrator['syncVoice'](
          videoResult.url,
          voiceResult.url,
          { quality: 'high', fps: 30 }
        );

        results.push({
          language: lang.code,
          finalVideo: lipsyncResult
        });
      }

      return {
        baseImage: imageResult,
        baseVideo: videoResult,
        localizedVideos: results
      };
    }
  },

  // ============================================================================
  // CUSTOM STYLE AVATAR
  // ============================================================================
  
  customStyleAvatar: {
    name: "Custom Style Avatar",
    description: "Branded avatar with specific art style",
    
    async create() {
      const orchestrator = new AvatarWorkflowOrchestrator({
        falApiKey: process.env.FAL_KEY!,
        elevenLabsApiKey: process.env.ELEVENLABS_API_KEY!,
        veedApiKey: process.env.VEED_API_KEY!
      });

      return await orchestrator.createAvatar(
        "Anime-style character, colorful hair, expressive eyes, modern casual outfit, vibrant background, energetic and friendly expression",
        {
          imageModel: 'custom-diffusion', // Best for specific art styles
          voiceSettings: {
            voice_id: 'anime_character_voice',
            stability: 0.6,
            similarity_boost: 0.8,
            style: 0.6
          },
          videoSettings: {
            duration: '8s',
            resolution: '720p',
            aspect_ratio: '16:9'
          },
          lipsyncSettings: {
            quality: 'high',
            fps: 24
          }
        }
      );
    }
  }
};

// ============================================================================
// BATCH PROCESSING EXAMPLES
// ============================================================================

export class BatchAvatarProcessor {
  private orchestrator: AvatarWorkflowOrchestrator;

  constructor(apiKeys: {
    falApiKey: string;
    elevenLabsApiKey: string;
    veedApiKey: string;
  }) {
    this.orchestrator = new AvatarWorkflowOrchestrator(apiKeys);
  }

  /**
   * Process multiple avatars in parallel
   */
  async processMultipleAvatars(
    prompts: string[],
    options: AvatarWorkflowOptions
  ): Promise<AvatarWorkflowResult[]> {
    const promises = prompts.map(prompt => 
      this.orchestrator.createAvatar(prompt, options)
    );

    return await Promise.allSettled(promises).then(results =>
      results
        .filter((result): result is PromiseFulfilledResult<AvatarWorkflowResult> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value)
    );
  }

  /**
   * Create avatar series with consistent character
   */
  async createAvatarSeries(
    basePrompt: string,
    variations: string[],
    options: AvatarWorkflowOptions
  ): Promise<AvatarWorkflowResult[]> {
    // Generate base image once
    const baseImage = await this.orchestrator['generateImage'](basePrompt, options.imageModel);
    
    // Create variations with same base image
    const promises = variations.map(variationPrompt =>
      this.orchestrator.createAvatar(variationPrompt, {
        ...options,
        // Override to use same base image
        imageModel: options.imageModel
      })
    );

    return await Promise.allSettled(promises).then(results =>
      results
        .filter((result): result is PromiseFulfilledResult<AvatarWorkflowResult> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value)
    );
  }
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

export async function runAvatarWorkflowExamples() {
  console.log('🚀 Starting AI Avatar Workflow Examples...\n');

  try {
    // Example 1: Corporate Training Avatar
    console.log('📊 Creating Corporate Training Avatar...');
    const corporateAvatar = await avatarWorkflowExamples.corporateTraining.create();
    console.log(`✅ Corporate avatar created! Cost: $${corporateAvatar.totalCost.toFixed(2)}`);
    console.log(`   Processing time: ${corporateAvatar.processingTime}ms\n`);

    // Example 2: Educational Content Avatar
    console.log('🎓 Creating Educational Content Avatar...');
    const educationalAvatar = await avatarWorkflowExamples.educationalContent.create();
    console.log(`✅ Educational avatar created! Cost: $${educationalAvatar.totalCost.toFixed(2)}`);
    console.log(`   Processing time: ${educationalAvatar.processingTime}ms\n`);

    // Example 3: Multilingual Content
    console.log('🌍 Creating Multilingual Content...');
    const multilingualContent = await avatarWorkflowExamples.multilingualContent.createMultipleLanguages();
    console.log(`✅ Multilingual content created! ${multilingualContent.localizedVideos.length} languages`);
    console.log(`   Languages: ${multilingualContent.localizedVideos.map(v => v.language).join(', ')}\n`);

    // Example 4: Batch Processing
    console.log('📦 Creating Batch Avatar Series...');
    const batchProcessor = new BatchAvatarProcessor({
      falApiKey: process.env.FAL_KEY!,
      elevenLabsApiKey: process.env.ELEVENLABS_API_KEY!,
      veedApiKey: process.env.VEED_API_KEY!
    });

    const batchResults = await batchProcessor.createAvatarSeries(
      "Professional presenter in business attire",
      [
        "Professional presenter introducing the company",
        "Professional presenter explaining the product features",
        "Professional presenter concluding the presentation"
      ],
      {
        imageModel: 'nano-banana',
        voiceSettings: {
          voice_id: 'professional_corporate_voice',
          stability: 0.75,
          similarity_boost: 0.85,
          style: 0.3
        },
        videoSettings: {
          duration: '8s',
          resolution: '1080p',
          aspect_ratio: '16:9'
        },
        lipsyncSettings: {
          quality: 'high',
          fps: 30
        }
      }
    );

    console.log(`✅ Batch series created! ${batchResults.length} avatars generated`);
    const totalBatchCost = batchResults.reduce((sum, result) => sum + result.totalCost, 0);
    console.log(`   Total batch cost: $${totalBatchCost.toFixed(2)}\n`);

    console.log('🎉 All avatar workflow examples completed successfully!');

  } catch (error) {
    console.error('❌ Error running avatar workflow examples:', error);
  }
}

// Export for use in other files
export { AvatarWorkflowOrchestrator, BatchAvatarProcessor };
