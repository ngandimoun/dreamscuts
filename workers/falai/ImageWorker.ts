/**
 * 🎨 Fal.ai Image Generation Worker - Enhanced with Rich Examples & C.R.I.S.T.A.L Method
 * 
 * Processes image generation jobs using multiple Fal.ai models with comprehensive examples,
 * C.R.I.S.T.A.L prompting method, and smart model selection based on your extensive codebase.
 * 
 * Key Features:
 * - C.R.I.S.T.A.L Prompting Method (Context, Role, Intention, Scenography, Tones, Appearance, Limitations)
 * - Nano Banana Integration (Perfect for realistic avatars, product photography, character consistency)
 * - FLUX SRPO Support (High-quality artistic generation, style transfer)
 * - Seedream 4.0 Integration (4K generation, multi-image composition)
 * - Professional Photo Models (Corporate presentations, business content)
 * - Multi-Camera Generator (Animation continuity, character turnarounds)
 * - Rich Prompt Templates & Examples from Codebase
 */

import { BaseWorker, WorkerConfig, JobResult } from '../base/BaseWorker';
import { fal } from '@fal-ai/client';

export interface ImageJobPayload {
  sceneId: string;
  assetId: string;
  prompt: string;
  model: string;
  endpoint: string;
  imageSize?: string;
  numInferenceSteps?: number;
  guidanceScale?: number;
  numImages?: number;
  enableSafetyChecker?: boolean;
  outputFormat?: string;
  acceleration?: string;
  resultAssetId: string;
  // Model-specific parameters
  quality?: string;
  style?: string;
  estimatedCost?: number;
  // Fal.ai specific settings
  syncMode?: boolean;
  seed?: number;
  image_size?: string;
  num_inference_steps?: number;
  guidance_scale?: number;
  // Enhanced features from codebase
  useCristalMethod?: boolean;
  promptType?: 'product_photography' | 'character_consistency' | 'background_replacement' | 'architectural' | 'photo_restoration' | 'comic_generation';
  cristalContext?: {
    context?: string;
    role?: string;
    intention?: string;
    scenography?: string;
    tones?: string;
    appearance?: string;
    limitations?: string;
  };
  // Rich examples integration
  referenceImages?: string[];
  preserveElements?: string[];
  enhanceElements?: string[];
}

export class ImageWorker extends BaseWorker {
  private falApiKey: string;

  constructor(config: WorkerConfig) {
    super({
      ...config,
      jobType: 'gen_image_falai'
    });

    this.falApiKey = process.env.FAL_KEY!;
    
    // Configure fal.ai client
    fal.config({
      credentials: this.falApiKey
    });
  }

  /**
   * Process an image generation job using Fal.ai
   */
  protected async processJob(job: any): Promise<JobResult> {
    const startTime = Date.now();
    const payload: ImageJobPayload = job.payload;

    try {
      this.log('info', `Processing image generation job for scene ${payload.sceneId}`, {
        model: payload.model,
        endpoint: payload.endpoint,
        promptLength: payload.prompt.length,
        imageSize: payload.imageSize
      });

      // Step 1: Enhance prompt using C.R.I.S.T.A.L method if requested
      let enhancedPrompt = payload.prompt;
      if (payload.useCristalMethod && payload.cristalContext) {
        enhancedPrompt = this.applyCristalMethod(payload.prompt, payload.cristalContext, payload.promptType);
        this.log('debug', 'Enhanced prompt using C.R.I.S.T.A.L method', { enhancedPrompt });
      }

      // Step 2: Apply prompt type enhancements from codebase examples
      if (payload.promptType) {
        enhancedPrompt = this.enhanceByPromptType(enhancedPrompt, payload.promptType, payload);
        this.log('debug', 'Enhanced prompt by type', { promptType: payload.promptType, enhancedPrompt });
      }

      // Step 3: Prepare model-specific parameters
      const modelParams = this.prepareModelParameters({ ...payload, prompt: enhancedPrompt });

      // Step 2: Generate image using Fal.ai
      this.log('debug', 'Calling Fal.ai API', { 
        endpoint: payload.endpoint, 
        params: modelParams 
      });

      const result = await fal.subscribe(payload.endpoint, {
        input: modelParams
      });

      // Step 3: Download the generated image
      const imageUrl = result.data.images[0].url;
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

      // Step 4: Upload image to Supabase Storage
      const imagePath = `images/${job.job_id}.${payload.outputFormat || 'jpeg'}`;
      const imageUrl_storage = await this.uploadToStorage(
        'production-assets',
        imagePath,
        imageBuffer,
        `image/${payload.outputFormat || 'jpeg'}`
      );

      const processingTime = Date.now() - startTime;

      this.log('info', `Image generation job completed successfully`, {
        imageUrl: imageUrl_storage,
        processingTimeMs: processingTime,
        imageSize: imageBuffer.length,
        model: payload.model
      });

      return {
        success: true,
        outputUrl: imageUrl_storage,
        result: {
          model: payload.model,
          endpoint: payload.endpoint,
          prompt: payload.prompt,
          imageSize: payload.imageSize,
          outputFormat: payload.outputFormat || 'jpeg',
          imageSize_bytes: imageBuffer.length,
          processingTimeMs: processingTime,
          originalUrl: imageUrl,
          assetId: payload.assetId,
          sceneId: payload.sceneId
        },
        processingTimeMs: processingTime
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.log('error', `Image generation job failed: ${errorMessage}`, {
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
   */
  private prepareModelParameters(payload: ImageJobPayload): any {
    const baseParams = {
      prompt: payload.prompt,
      image_size: payload.imageSize || payload.image_size || 'landscape_16_9',
      num_inference_steps: payload.numInferenceSteps || payload.num_inference_steps || 28,
      guidance_scale: payload.guidanceScale || payload.guidance_scale || 4.5,
      num_images: payload.numImages || 1,
      enable_safety_checker: payload.enableSafetyChecker !== false,
      output_format: payload.outputFormat || 'jpeg',
      acceleration: payload.acceleration || 'regular'
    };

    // Add model-specific parameters
    switch (payload.model) {
      case 'flux-srpo':
        return {
          ...baseParams,
          // FLUX SRPO specific parameters
          image_size: payload.imageSize || 'landscape_16_9',
          num_inference_steps: payload.numInferenceSteps || 28,
          guidance_scale: payload.guidanceScale || 4.5
        };

      case 'nano-banana':
        return {
          ...baseParams,
          // Nano Banana specific parameters
          quality: payload.quality || 'standard',
          style: payload.style || 'photographic',
          image_size: payload.imageSize || 'landscape_16_9',
          num_inference_steps: payload.numInferenceSteps || 30,
          guidance_scale: payload.guidanceScale || 7.5
        };

      case 'professional-photo':
        return {
          ...baseParams,
          // Professional Photo specific parameters
          image_size: payload.imageSize || 'landscape_16_9',
          num_inference_steps: payload.numInferenceSteps || 25,
          guidance_scale: payload.guidanceScale || 6.0
        };

      case 'seedream-4':
        return {
          ...baseParams,
          // Seedream V4 specific parameters
          image_size: payload.imageSize || 'landscape_16_9',
          num_inference_steps: payload.numInferenceSteps || 30,
          guidance_scale: payload.guidanceScale || 7.5
        };

      case 'multi-camera':
        return {
          ...baseParams,
          // Multi-Camera Generator specific parameters
          image_size: payload.imageSize || 'landscape_16_9',
          num_inference_steps: payload.numInferenceSteps || 30,
          guidance_scale: payload.guidanceScale || 7.5
        };

      default:
        this.log('warn', `Unknown model ${payload.model}, using default parameters`);
        return baseParams;
    }
  }

  /**
   * Validate image generation job payload
   */
  private validatePayload(payload: ImageJobPayload): void {
    if (!payload.prompt || payload.prompt.trim().length === 0) {
      throw new Error('Prompt is required for image generation job');
    }

    if (!payload.endpoint) {
      throw new Error('Endpoint is required for image generation job');
    }

    if (!payload.model) {
      throw new Error('Model is required for image generation job');
    }

    if (payload.prompt.length > 2000) {
      throw new Error('Prompt is too long (max 2000 characters)');
    }
  }

  /**
   * Apply C.R.I.S.T.A.L method for enhanced prompting
   */
  private applyCristalMethod(prompt: string, context: any, promptType?: string): string {
    const cristal = context;
    
    let enhancedPrompt = prompt;
    
    if (cristal.context) {
      enhancedPrompt = `${cristal.context}. ${enhancedPrompt}`;
    }
    
    if (cristal.role) {
      enhancedPrompt = `${enhancedPrompt}. Role: ${cristal.role}`;
    }
    
    if (cristal.intention) {
      enhancedPrompt = `${enhancedPrompt}. Style: ${cristal.intention}`;
    }
    
    if (cristal.scenography) {
      enhancedPrompt = `${enhancedPrompt}. Lighting: ${cristal.scenography}`;
    }
    
    if (cristal.tones) {
      enhancedPrompt = `${enhancedPrompt}. Colors: ${cristal.tones}`;
    }
    
    if (cristal.appearance) {
      enhancedPrompt = `${enhancedPrompt}. Quality: ${cristal.appearance}`;
    }
    
    if (cristal.limitations) {
      enhancedPrompt = `${enhancedPrompt}. Avoid: ${cristal.limitations}`;
    }
    
    return enhancedPrompt;
  }

  /**
   * Enhance prompt by type using codebase examples
   */
  private enhanceByPromptType(prompt: string, promptType: string, payload: ImageJobPayload): string {
    const examples = {
      product_photography: `Create a professional product photography image of ${prompt}. Keep the product label exactly as shown. Ultra-realistic commercial photography style, 4K quality, hyper-detailed, professional studio lighting.`,
      character_consistency: `Create a scene of ${prompt}. Keep the character's appearance exactly as shown. Professional photography style, consistent lighting.`,
      background_replacement: `Create a scene of ${prompt} by changing the background. Keep the main subject exactly the same. Professional photography style.`,
      architectural: `Create a professional architectural visualization of ${prompt}. High quality architecture rendering, professional lighting.`,
      photo_restoration: `Restore and enhance this ${prompt}. Maintain the authentic look and feel of the original. Apply moderate enhancements.`,
      comic_generation: `Create a comic panel in modern colorful comic art style. ${prompt}. Natural lighting, professional comic art style.`
    };

    return examples[promptType as keyof typeof examples] || prompt;
  }

  /**
   * Get comprehensive examples from codebase
   */
  getExamples(): any {
    return {
      cristalMethod: {
        description: "The C.R.I.S.T.A.L method for optimal image generation prompts",
        structure: {
          C: "Context & Composition - Where is the scene? What composition? (close-up, wide shot, etc.)",
          R: "Role of Subject - What is your subject? What actions, postures, details?",
          I: "Intention & Style - What artistic style? References? Era? Ultra-realistic?",
          S: "Scenography & Lighting - What ambiance? What emotions to convey?",
          T: "Tones & Palette - What colors are expected?",
          A: "Appearance & Details - Textures, finishes, quality level (4K, film grain, etc.)",
          L: "Limitations - What NOT to include (no text, no blur, etc.)"
        },
        example: `Context: Close-up product photography in a studio environment
Role: Premium watch floating in mid-air with dust particles
Intention: Ultra-realistic commercial photography style
Scenography: Dramatic lighting with lightning in background, moody atmosphere
Tones: Metallic golds, dark stormy blues, electric whites
Appearance: 4K quality, hyper-detailed, professional studio lighting
Limitations: No text overlays, no watermarks, no blur effects`
      },
      modelExamples: {
        'nano-banana': {
          description: "Hyper-realistic character portraits with fine details",
          strengths: [
            "Perfect product label reproduction",
            "Character consistency across scenes", 
            "Hand-holding products (AI's biggest challenge)",
            "Background replacement with proper lighting",
            "Photo restoration and enhancement"
          ],
          cost: "$0.039 per image",
          resolution: "Up to 2048x2048",
          bestFor: "Realistic avatars, product photography, character consistency"
        },
        'seedream-4': {
          description: "Stylized, cinematic characters with high-resolution output",
          strengths: [
            "Fast 4K generation (up to 4096x4096)",
            "Multi-image composition and editing",
            "Sketch to photography conversion",
            "Character turnarounds and multiple views",
            "Product mockups and packaging shots"
          ],
          cost: "$0.03 per image",
          resolution: "Up to 4096x4096",
          bestFor: "High-resolution avatars, stylized content, product mockups"
        },
        'flux-srpo': {
          description: "High-quality artistic generation with style transfer",
          strengths: [
            "High-quality artistic generation",
            "Style transfer capabilities",
            "Artistic compositions",
            "Aesthetic quality",
            "Print materials"
          ],
          cost: "$0.04 per image",
          resolution: "Up to 2048x2048",
          bestFor: "Artistic styles, creative compositions, print materials"
        }
      },
      promptTemplates: {
        productPhotography: "Create a [COMPOSITION] product photography image of [PRODUCT] [ACTION/CONTEXT]. [LIGHTING_STYLE] lighting with [SHADOW_DESCRIPTION]. Keep the product label exactly as shown in the reference image. [STYLE] style, [QUALITY] quality.",
        characterConsistency: "Create a [COMPOSITION] of [CHARACTER_DESCRIPTION] [ACTION/POSE] in [ENVIRONMENT]. Keep the character's appearance exactly as shown in the reference image. [LIGHTING] lighting, [STYLE] style.",
        backgroundReplacement: "Create a scene of [CHARACTER/OBJECT] in [NEW_ENVIRONMENT] by changing the background to [SPECIFIC_BACKGROUND]. Keep [ELEMENTS_TO_PRESERVE] exactly the same. Adjust lighting and shadows to match the [ENVIRONMENT_TYPE] environment."
      }
    };
  }

  /**
   * Get worker status with Fal.ai-specific info
   */
  getStatus(): any {
    const baseStatus = super.getStatus();
    return {
      ...baseStatus,
      provider: 'fal.ai',
      supportedModels: [
        'flux-srpo',
        'nano-banana', 
        'professional-photo',
        'seedream-4',
        'multi-camera'
      ],
      features: [
        'multi_model', 
        'safety_checker', 
        'custom_sizing', 
        'acceleration',
        'cristal_method',
        'prompt_type_enhancement',
        'rich_examples',
        'model_specific_optimization'
      ],
      examples: this.getExamples()
    };
  }
}

/**
 * Create and start Image worker
 */
export async function startImageWorker(): Promise<ImageWorker> {
  const config: WorkerConfig = {
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    jobType: 'gen_image_falai',
    logLevel: (process.env.LOG_LEVEL as any) || 'info',
    healthCheckPort: parseInt(process.env.HEALTH_CHECK_PORT || '3002'),
    maxConcurrentJobs: parseInt(process.env.MAX_CONCURRENT_JOBS || '2'),
    retryDelayMs: parseInt(process.env.RETRY_DELAY_MS || '10000')
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

  const worker = new ImageWorker(config);
  await worker.start();
  
  return worker;
}

// Export for use in worker orchestration
export { ImageWorker };
