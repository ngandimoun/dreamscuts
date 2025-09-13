import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/stable-avatar';

// Enums for type safety
export enum StableAvatarAspectRatioEnum {
  SIXTEEN_NINE = '16:9',
  ONE_ONE = '1:1',
  NINE_SIXTEEN = '9:16',
  AUTO = 'auto',
}

// Input interface
export interface FalAiStableAvatarInput {
  image_url: string;
  audio_url: string;
  prompt: string;
  aspect_ratio?: StableAvatarAspectRatioEnum;
  guidance_scale?: number;
  audio_guidance_scale?: number;
  num_inference_steps?: number;
  seed?: number;
  perturbation?: number;
}

// Output interface
export interface FalAiStableAvatarOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error types
export interface FalAiStableAvatarError {
  message: string;
  code?: string;
}

// Main executor class
export class FalAiStableAvatarExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: this.apiKey });
  }

  /**
   * Generate audio-driven video avatar using the Stable Avatar model
   */
  async generateAvatar(input: FalAiStableAvatarInput): Promise<FalAiStableAvatarOutput> {
    try {
      this.validateInput(input);

      const result = await fal.subscribe(MODEL_ENDPOINT, {
        input: input as any, // Use any to avoid type conflicts
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            update.logs?.map((log) => log.message).forEach(console.log);
          }
        },
      });

      // Transform the result to match our interface
      return {
        video: {
          url: typeof result.data.video === 'string' ? result.data.video : result.data.video?.url || '',
          content_type: result.data.video?.content_type,
          file_name: result.data.video?.file_name,
          file_size: result.data.video?.file_size,
        },
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit an avatar generation request to the queue for long-running operations
   */
  async submitAvatarGenerationRequest(input: FalAiStableAvatarInput, webhookUrl?: string): Promise<{ request_id: string }> {
    try {
      this.validateInput(input);

      const { request_id } = await fal.queue.submit(MODEL_ENDPOINT, {
        input: input as any, // Use any to avoid type conflicts
        webhookUrl,
      });

      return { request_id };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Check the status of a queued avatar generation request
   */
  async checkRequestStatus(requestId: string): Promise<any> {
    try {
      return await fal.queue.status(MODEL_ENDPOINT, {
        requestId,
        logs: true,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get the result of a completed avatar generation request
   */
  async getRequestResult(requestId: string): Promise<FalAiStableAvatarOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });

      // Transform the result to match our interface
      return {
        video: {
          url: typeof result.data.video === 'string' ? result.data.video : result.data.video?.url || '',
          content_type: result.data.video?.content_type,
          file_name: result.data.video?.file_name,
          file_size: result.data.video?.file_size,
        },
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Calculate the cost for generating avatar video based on duration
   */
  calculateCost(durationSeconds: number = 4): number {
    // $0.10 per generated second, minimum 4 seconds
    const actualDuration = Math.max(durationSeconds, 4);
    return actualDuration * 0.10;
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: FalAiStableAvatarInput): void {
    if (!input.image_url || input.image_url.trim().length === 0) {
      throw new Error('Image URL is required');
    }

    if (!input.audio_url || input.audio_url.trim().length === 0) {
      throw new Error('Audio URL is required');
    }

    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error('Prompt is required');
    }

    if (input.prompt.length > 2000) {
      throw new Error('Prompt must be 2000 characters or less');
    }

    if (input.aspect_ratio && !Object.values(StableAvatarAspectRatioEnum).includes(input.aspect_ratio)) {
      throw new Error('Invalid aspect ratio');
    }

    if (input.guidance_scale !== undefined && (input.guidance_scale < 1.0 || input.guidance_scale > 20.0)) {
      throw new Error('Guidance scale must be between 1.0 and 20.0');
    }

    if (input.audio_guidance_scale !== undefined && (input.audio_guidance_scale < 1.0 || input.audio_guidance_scale > 20.0)) {
      throw new Error('Audio guidance scale must be between 1.0 and 20.0');
    }

    if (input.num_inference_steps !== undefined && (input.num_inference_steps < 10 || input.num_inference_steps > 100)) {
      throw new Error('Number of inference steps must be between 10 and 100');
    }

    if (input.perturbation !== undefined && (input.perturbation < 0.0 || input.perturbation > 1.0)) {
      throw new Error('Perturbation must be between 0.0 and 1.0');
    }

    // Validate URL formats
    try {
      new URL(input.image_url);
      new URL(input.audio_url);
    } catch {
      throw new Error('Image and audio URLs must be valid URLs');
    }
  }

  /**
   * Handle and format errors
   */
  private handleError(error: any): FalAiStableAvatarError {
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'EXECUTION_ERROR',
      };
    }

    return {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    };
  }

  /**
   * Get model information
   */
  static getModelInfo() {
    return {
      name: 'Fal AI Stable Avatar',
      endpoint: MODEL_ENDPOINT,
      description: 'Generate audio-driven video avatars up to five minutes long with natural lip-sync and facial expressions',
      pricing: {
        per_second: '$0.10 per generated second',
        minimum: '4 seconds minimum ($0.40)',
        maximum: 'Up to 5 minutes (300 seconds)',
      },
      capabilities: [
        'Audio-driven video generation',
        'Natural lip-sync and facial expressions',
        'Preservation of background and lighting',
        'Support for various aspect ratios',
        'Customizable guidance scales',
        'Seed-based reproducibility',
        'Perturbation control for variation',
        'Long-form video generation (up to 5 minutes)',
      ],
    };
  }

  /**
   * Get supported aspect ratios
   */
  static getSupportedAspectRatios(): StableAvatarAspectRatioEnum[] {
    return Object.values(StableAvatarAspectRatioEnum);
  }

  /**
   * Get supported parameter ranges
   */
  static getSupportedParameterRanges() {
    return {
      guidance_scale: { min: 1.0, max: 20.0 },
      audio_guidance_scale: { min: 1.0, max: 20.0 },
      num_inference_steps: { min: 10, max: 100 },
      perturbation: { min: 0.0, max: 1.0 },
      duration: { min: 4, max: 300 }, // seconds
    };
  }

  /**
   * Get default values for common parameters
   */
  static getDefaultValues() {
    return {
      aspect_ratio: StableAvatarAspectRatioEnum.AUTO,
      guidance_scale: 5,
      audio_guidance_scale: 4,
      num_inference_steps: 50,
      perturbation: 0.1,
    };
  }

  /**
   * Get pricing information
   */
  static getPricingInfo() {
    return {
      base_cost: 0.10,
      currency: 'USD',
      billing_model: 'per_second',
      minimum_duration: 4,
      maximum_duration: 300,
      notes: [
        '$0.10 per generated second',
        '4 seconds minimum ($0.40)',
        'Up to 5 minutes (300 seconds) supported',
        'No subscription required - pay per use',
        'Cost scales linearly with video duration',
      ],
    };
  }

  /**
   * Get technical specifications
   */
  static getTechnicalSpecs() {
    return {
      model_type: 'audio-driven-avatar',
      architecture: 'Stable Avatar',
      input_format: 'image + audio + text prompt',
      output_format: 'MP4 video',
      supported_durations: '4 seconds to 5 minutes',
      guidance_scale_range: [1.0, 20.0],
      audio_guidance_scale_range: [1.0, 20.0],
      inference_steps_range: [10, 100],
      perturbation_range: [0.0, 1.0],
      max_prompt_length: 2000,
      processing_time: 'variable based on duration and load',
      quality_level: 'high',
      lip_sync_quality: 'natural',
      facial_expression_quality: 'realistic',
      background_preservation: 'excellent',
      supported_image_formats: ['JPG', 'JPEG', 'PNG', 'WEBP'],
      supported_audio_formats: ['MP3', 'WAV', 'AAC', 'OGG'],
    };
  }

  /**
   * Get best practices
   */
  static getBestPractices() {
    return [
      'Use high-quality reference images with clear facial features',
      'Ensure good lighting and contrast in your reference image',
      'Write detailed prompts describing desired facial expressions and movements',
      'Use clear, high-quality audio for better lip-sync results',
      'Test different guidance scale values (3-7) for optimal results',
      'Keep prompts under 2000 characters for optimal performance',
      'Consider background preservation when framing your reference image',
      'Use appropriate aspect ratios for your target platform',
      'Start with shorter durations for testing and iteration',
      'Use perturbation values between 0.05-0.2 for natural variation',
    ];
  }

  /**
   * Get common use cases
   */
  static getCommonUseCases() {
    return [
      'Virtual avatars and digital humans',
      'Video presentations and tutorials',
      'Customer service and support videos',
      'Educational content and training materials',
      'Marketing and promotional videos',
      'Social media content creation',
      'Live streaming and broadcasting',
      'Gaming and entertainment applications',
      'Corporate communications',
      'Personal branding and influencer content',
    ];
  }

  /**
   * Get supported file formats
   */
  static getSupportedFileFormats() {
    return {
      images: ['JPG', 'JPEG', 'PNG', 'WEBP'],
      audio: ['MP3', 'WAV', 'AAC', 'OGG'],
      output: ['MP4'],
    };
  }

  /**
   * Get model limitations
   */
  static getModelLimitations() {
    return [
      'Minimum 4 seconds duration required',
      'Maximum 5 minutes (300 seconds) duration',
      'Reference image must be publicly accessible URL',
      'Audio file must be publicly accessible URL',
      'Processing time scales with video duration',
      'Background preservation works best with static scenes',
      'Lip-sync accuracy depends on audio quality',
      'Facial expressions limited to natural human range',
    ];
  }
}
