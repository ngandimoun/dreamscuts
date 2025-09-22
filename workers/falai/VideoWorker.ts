/**
 * 🎬 Fal.ai Video Generation Worker - Enhanced with Veo3 Fast & Cinematic Prompts
 * 
 * Processes video generation jobs using Fal.ai video models with focus on Veo3 Fast,
 * Wan Effects, and comprehensive cinematic prompting based on your extensive codebase.
 * 
 * Key Features:
 * - Veo3 Fast Priority (Cost-effective, 60-80% cheaper than Veo3)
 * - Wan Effects Integration (40+ effect templates: cakeify, hulk, squish, etc.)
 * - Cinematic Prompt Engineering (Professional production prompts)
 * - Image-to-Video Support (Wan i2v, Infinitalk)
 * - Audio Generation (Native audio with Veo3 Fast)
 * - Rich Video Examples from Codebase
 * - Professional Video Templates
 */

import { BaseWorker, WorkerConfig, JobResult } from '../base/BaseWorker';
import { fal } from '@fal-ai/client';

export interface VideoJobPayload {
  sceneId: string;
  videoId: string;
  prompt: string;
  model: string;
  endpoint: string;
  duration?: string;
  resolution?: string;
  aspectRatio?: string;
  generateAudio?: boolean;
  // Cost optimization
  estimatedCost?: number;
  costLimit?: number;
  // Quality settings
  quality?: string;
  acceleration?: string;
  // Model-specific parameters
  imageUrl?: string; // For image-to-video models
  effectType?: string; // For Wan Effects
  numFrames?: number;
  framesPerSecond?: number;
  enhancePrompt?: boolean;
  autoFix?: boolean;
  seed?: number;
  // Enhanced features from codebase
  promptType?: 'cinematic' | 'documentary' | 'nature' | 'character_animation' | 'product_demo' | 'social_media';
  cinematicStyle?: 'professional' | 'dramatic' | 'documentary' | 'anime' | 'realistic' | 'horror' | 'noir' | 'cartoon';
  cameraMovement?: 'aerial_view' | 'tracking_shot' | 'panning' | 'zooming' | 'close_up' | 'wide_shot' | 'static';
  lighting?: 'golden_hour' | 'neon' | 'natural' | 'dramatic' | 'soft' | 'harsh' | 'backlit';
  atmosphere?: 'foggy' | 'rainy' | 'sunny' | 'dark' | 'bright' | 'moody' | 'cheerful';
  // Wan Effects specific
  wanEffectIntensity?: number; // 0.1 to 2.0
  wanEffectTypes?: Array<'cakeify' | 'hulk' | 'squish' | 'melt' | 'explode' | 'freeze' | 'glow' | 'shrink'>;
}

export class VideoWorker extends BaseWorker {
  private falApiKey: string;

  constructor(config: WorkerConfig) {
    super({
      ...config,
      jobType: 'gen_video_falai'
    });

    this.falApiKey = process.env.FAL_KEY!;
    
    // Configure fal.ai client
    fal.config({
      credentials: this.falApiKey
    });
  }

  /**
   * Process a video generation job using Fal.ai
   */
  protected async processJob(job: any): Promise<JobResult> {
    const startTime = Date.now();
    const payload: VideoJobPayload = job.payload;

    try {
      this.log('info', `Processing video generation job for scene ${payload.sceneId}`, {
        model: payload.model,
        endpoint: payload.endpoint,
        promptLength: payload.prompt.length,
        duration: payload.duration,
        resolution: payload.resolution
      });

      // Step 1: Enhance prompt with cinematic elements if requested
      let enhancedPrompt = payload.prompt;
      if (payload.promptType || payload.cinematicStyle || payload.cameraMovement || payload.lighting || payload.atmosphere) {
        enhancedPrompt = this.enhanceWithCinematicElements(payload);
        this.log('debug', 'Enhanced prompt with cinematic elements', { enhancedPrompt });
      }

      // Step 2: Prepare model-specific parameters
      const modelParams = this.prepareModelParameters({ ...payload, prompt: enhancedPrompt });

      // Step 2: Generate video using Fal.ai
      this.log('debug', 'Calling Fal.ai Video API', { 
        endpoint: payload.endpoint, 
        params: modelParams 
      });

      const result = await fal.subscribe(payload.endpoint, {
        input: modelParams
      });

      // Step 3: Download the generated video
      const videoUrl = result.data.video.url;
      const videoResponse = await fetch(videoUrl);
      const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());

      // Step 4: Upload video to Supabase Storage
      const videoPath = `videos/${job.job_id}.mp4`;
      const videoUrl_storage = await this.uploadToStorage(
        'production-assets',
        videoPath,
        videoBuffer,
        'video/mp4'
      );

      const processingTime = Date.now() - startTime;

      this.log('info', `Video generation job completed successfully`, {
        videoUrl: videoUrl_storage,
        processingTimeMs: processingTime,
        videoSize: videoBuffer.length,
        model: payload.model
      });

      return {
        success: true,
        outputUrl: videoUrl_storage,
        result: {
          model: payload.model,
          endpoint: payload.endpoint,
          prompt: payload.prompt,
          duration: payload.duration,
          resolution: payload.resolution,
          aspectRatio: payload.aspectRatio,
          generateAudio: payload.generateAudio,
          videoSize_bytes: videoBuffer.length,
          processingTimeMs: processingTime,
          originalUrl: videoUrl,
          videoId: payload.videoId,
          sceneId: payload.sceneId
        },
        processingTimeMs: processingTime
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.log('error', `Video generation job failed: ${errorMessage}`, {
        sceneId: payload.sceneId,
        model: payload.model,
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
   * Prepare model-specific parameters based on the model type
   * Priority: Veo3 Fast (cost-effective) over Veo3
   */
  private prepareModelParameters(payload: VideoJobPayload): any {
    switch (payload.model) {
      case 'veo3-fast':
        return {
          prompt: payload.prompt,
          aspect_ratio: payload.aspectRatio || 'auto',
          duration: payload.duration || '8s',
          generate_audio: payload.generateAudio !== false,
          resolution: payload.resolution || '720p',
          enhance_prompt: payload.enhancePrompt !== false,
          auto_fix: payload.autoFix !== false,
          seed: payload.seed
        };

      case 'veo3':
        // Fallback to Veo3 if Veo3 Fast not available
        return {
          prompt: payload.prompt,
          aspect_ratio: payload.aspectRatio || '16:9',
          duration: payload.duration || '8s',
          generate_audio: payload.generateAudio !== false,
          resolution: payload.resolution || '720p',
          enhance_prompt: payload.enhancePrompt !== false,
          auto_fix: payload.autoFix !== false,
          seed: payload.seed
        };

      case 'wan-effects':
        return {
          subject: payload.prompt,
          image_url: payload.imageUrl,
          effect_type: payload.effectType || 'cakeify',
          num_frames: payload.numFrames || 81,
          frames_per_second: payload.framesPerSecond || 16,
          aspect_ratio: payload.aspectRatio || '16:9',
          num_inference_steps: 30,
          lora_scale: 1.0,
          seed: payload.seed
        };

      case 'wan-i2v':
        return {
          prompt: payload.prompt,
          image_url: payload.imageUrl,
          negative_prompt: '',
          num_frames: payload.numFrames || 81,
          frames_per_second: payload.framesPerSecond || 16,
          seed: payload.seed,
          resolution: payload.resolution || '720p',
          num_inference_steps: 30,
          guide_scale: 5.0
        };

      case 'infinitalk':
        return {
          image_url: payload.imageUrl,
          audio_url: payload.audioUrl, // This would need to be provided
          prompt: payload.prompt,
          num_frames: payload.numFrames || 145,
          resolution: payload.resolution || '480p',
          seed: payload.seed || 42,
          acceleration: payload.acceleration || 'regular'
        };

      default:
        this.log('warn', `Unknown video model ${payload.model}, using Veo3 Fast defaults`);
        return {
          prompt: payload.prompt,
          aspect_ratio: payload.aspectRatio || 'auto',
          duration: payload.duration || '8s',
          generate_audio: payload.generateAudio !== false,
          resolution: payload.resolution || '720p'
        };
    }
  }

  /**
   * Validate video generation job payload
   */
  private validatePayload(payload: VideoJobPayload): void {
    if (!payload.prompt || payload.prompt.trim().length === 0) {
      throw new Error('Prompt is required for video generation job');
    }

    if (!payload.endpoint) {
      throw new Error('Endpoint is required for video generation job');
    }

    if (!payload.model) {
      throw new Error('Model is required for video generation job');
    }

    if (payload.prompt.length > 2000) {
      throw new Error('Prompt is too long (max 2000 characters)');
    }

    // Model-specific validations
    if (payload.model === 'wan-effects' && !payload.imageUrl) {
      throw new Error('Image URL is required for Wan Effects model');
    }

    if (payload.model === 'wan-i2v' && !payload.imageUrl) {
      throw new Error('Image URL is required for Wan i2v model');
    }

    if (payload.model === 'infinitalk' && !payload.imageUrl) {
      throw new Error('Image URL is required for Infinitalk model');
    }
  }

  /**
   * Enhance prompt with cinematic elements from codebase examples
   */
  private enhanceWithCinematicElements(payload: VideoJobPayload): string {
    let enhancedPrompt = payload.prompt;
    
    // Add cinematic style
    if (payload.cinematicStyle) {
      const styleEnhancements = {
        professional: "professional production quality, cinematic lighting",
        dramatic: "dramatic, high-contrast lighting, intense atmosphere",
        documentary: "documentary style, natural lighting, realistic movement",
        anime: "anime style, vibrant colors, stylized animation",
        realistic: "ultra-realistic, photorealistic quality",
        horror: "dark, ominous atmosphere, dramatic shadows",
        noir: "film noir style, high contrast, dramatic lighting",
        cartoon: "cartoon style, bright colors, exaggerated movements"
      };
      enhancedPrompt = `${enhancedPrompt}, ${styleEnhancements[payload.cinematicStyle]}`;
    }
    
    // Add camera movement
    if (payload.cameraMovement) {
      const cameraEnhancements = {
        aerial_view: "aerial view, bird's eye perspective",
        tracking_shot: "tracking shot, smooth camera movement",
        panning: "panning camera movement, sweeping motion",
        zooming: "zoom in/out effect, dynamic camera movement",
        close_up: "close-up shot, intimate framing",
        wide_shot: "wide shot, establishing view",
        static: "static camera, stable composition"
      };
      enhancedPrompt = `${enhancedPrompt}, ${cameraEnhancements[payload.cameraMovement]}`;
    }
    
    // Add lighting
    if (payload.lighting) {
      const lightingEnhancements = {
        golden_hour: "golden hour lighting, warm sunset tones",
        neon: "neon lighting, vibrant electric colors",
        natural: "natural lighting, realistic illumination",
        dramatic: "dramatic lighting, high contrast shadows",
        soft: "soft lighting, gentle illumination",
        harsh: "harsh lighting, strong shadows",
        backlit: "backlit, silhouette effect"
      };
      enhancedPrompt = `${enhancedPrompt}, ${lightingEnhancements[payload.lighting]}`;
    }
    
    // Add atmosphere
    if (payload.atmosphere) {
      const atmosphereEnhancements = {
        foggy: "foggy atmosphere, misty environment",
        rainy: "rainy weather, water droplets",
        sunny: "sunny day, bright cheerful atmosphere",
        dark: "dark atmosphere, moody environment",
        bright: "bright atmosphere, vibrant environment",
        moody: "moody atmosphere, emotional tone",
        cheerful: "cheerful atmosphere, upbeat mood"
      };
      enhancedPrompt = `${enhancedPrompt}, ${atmosphereEnhancements[payload.atmosphere]}`;
    }
    
    return enhancedPrompt;
  }

  /**
   * Get comprehensive examples from codebase
   */
  getExamples(): any {
    return {
      veo3Fast: {
        description: "Cost-effective video generation (60-80% cheaper than Veo3)",
        cost: "$0.25-$0.40 per second",
        duration: "Fixed 8 seconds",
        resolution: "720p or 1080p at 24 FPS",
        features: [
          "Native audio generation",
          "Superior physics understanding",
          "Enhanced prompt adherence",
          "Flexible aspect ratios",
          "Built-in safety filters"
        ],
        bestFor: "Social media content, marketing videos, product demonstrations"
      },
      wanEffects: {
        description: "40+ predefined effect templates for creative video generation",
        cost: "$0.35 per video",
        duration: "Fixed 5 seconds",
        resolution: "16 FPS with customizable frames",
        effectTypes: [
          "cakeify", "hulk", "squish", "melt", "explode", 
          "freeze", "glow", "shrink", "grow", "twist"
        ],
        bestFor: "Creative effects, social media content, experimental videos"
      },
      cinematicPrompts: {
        professional: "A futuristic robot walking through a neon-lit cyberpunk city at night, cinematic lighting, tracking shot, wide angle, dramatic shadows, rain-slicked streets, atmospheric fog",
        documentary: "A casual street interview on a busy New York City sidewalk in the afternoon. The interviewer holds a plain, unbranded microphone and asks: Have you seen Google's new Veo3 model?",
        nature: "A majestic eagle soaring over snow-capped mountains at sunset, golden hour lighting, aerial view, wide shot, natural movement, realistic physics, ambient wind sounds",
        character: "A woman looks into the camera, breathes in, then exclaims energetically, 'have you guys checked out Veo3 Image-to-Video on Fal? It's incredible!'"
      },
      promptStructure: {
        format: "Subject + Context + Action + Style + Camera + Composition + Ambiance",
        example: "A futuristic robot (Subject) walking through a neon-lit cyberpunk city (Context) at night (Ambiance), cinematic lighting (Style), tracking shot (Camera), wide angle (Composition)"
      }
    };
  }

  /**
   * Get worker status with Fal.ai video-specific info
   */
  getStatus(): any {
    const baseStatus = super.getStatus();
    return {
      ...baseStatus,
      provider: 'fal.ai',
      supportedModels: [
        'veo3-fast', // Priority model
        'veo3',
        'wan-effects',
        'wan-i2v',
        'infinitalk'
      ],
      features: [
        'text_to_video',
        'image_to_video', 
        'effects_application',
        'audio_generation',
        'high_resolution',
        'custom_duration',
        'cinematic_enhancement',
        'veo3_fast_priority',
        'wan_effects_integration',
        'professional_prompts'
      ],
      examples: this.getExamples()
    };
  }
}

/**
 * Create and start Video worker
 */
export async function startVideoWorker(): Promise<VideoWorker> {
  const config: WorkerConfig = {
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    jobType: 'gen_video_falai',
    logLevel: (process.env.LOG_LEVEL as any) || 'info',
    healthCheckPort: parseInt(process.env.HEALTH_CHECK_PORT || '3003'),
    maxConcurrentJobs: parseInt(process.env.MAX_CONCURRENT_JOBS || '1'), // Video generation is resource intensive
    retryDelayMs: parseInt(process.env.RETRY_DELAY_MS || '15000')
  };

  // Validate required environment variables
  if (!config.supabaseUrl) {
    throw new Error('SUPABASE_URL environment variable is required');
  }
  if (!config.supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  }
  if (!process.env.FAL_KEY) {
    throw new Error('FAL_KEY environment variable is required');
  }

  const worker = new VideoWorker(config);
  await worker.start();
  
  return worker;
}

// Export for use in worker orchestration
export { VideoWorker };
