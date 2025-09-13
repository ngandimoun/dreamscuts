import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/kling-video/v2.1/standard/image-to-video';

// Enums for type safety
export enum KlingV21StandardDurationEnum {
  FIVE_SECONDS = '5',
  TEN_SECONDS = '10',
}

// Input interface
export interface FalAiKlingV21StandardImageToVideoInput {
  prompt: string;
  image_url: string;
  duration?: KlingV21StandardDurationEnum;
  negative_prompt?: string;
  cfg_scale?: number;
}

// Output interface
export interface FalAiKlingV21StandardImageToVideoOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error types
export interface FalAiKlingV21StandardImageToVideoError {
  message: string;
  code?: string;
}

// Main executor class
export class FalAiKlingV21StandardImageToVideoExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: this.apiKey });
  }

  /**
   * Generate video from image using the Kling 2.1 Standard model
   */
  async generateVideo(input: FalAiKlingV21StandardImageToVideoInput): Promise<FalAiKlingV21StandardImageToVideoOutput> {
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
   * Submit a video generation request to the queue for long-running operations
   */
  async submitVideoGenerationRequest(input: FalAiKlingV21StandardImageToVideoInput, webhookUrl?: string): Promise<{ request_id: string }> {
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
   * Check the status of a queued video generation request
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
   * Get the result of a completed video generation request
   */
  async getRequestResult(requestId: string): Promise<FalAiKlingV21StandardImageToVideoOutput> {
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
   * Calculate the cost for generating video based on parameters
   */
  calculateCost(duration: KlingV21StandardDurationEnum = KlingV21StandardDurationEnum.FIVE_SECONDS): number {
    // Base cost calculation for Kling 2.1 Standard
    // 5s video: $0.25
    // 10s video: $0.50
    // For every additional second beyond 5s: $0.05
    
    if (duration === KlingV21StandardDurationEnum.FIVE_SECONDS) {
      return 0.25;
    } else if (duration === KlingV21StandardDurationEnum.TEN_SECONDS) {
      return 0.50;
    }
    
    // For custom durations beyond 5 seconds
    const additionalSeconds = parseInt(duration) - 5;
    return 0.25 + (additionalSeconds * 0.05);
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: FalAiKlingV21StandardImageToVideoInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error('Prompt is required');
    }

    if (!input.image_url || input.image_url.trim().length === 0) {
      throw new Error('Image URL is required');
    }

    if (input.prompt.length > 2000) {
      throw new Error('Prompt must be 2000 characters or less');
    }

    if (input.duration && !Object.values(KlingV21StandardDurationEnum).includes(input.duration)) {
      throw new Error('Duration must be either "5" or "10"');
    }

    if (input.negative_prompt && input.negative_prompt.length > 2000) {
      throw new Error('Negative prompt must be 2000 characters or less');
    }

    if (input.cfg_scale !== undefined && (input.cfg_scale < 0.1 || input.cfg_scale > 2.0)) {
      throw new Error('CFG scale must be between 0.1 and 2.0');
    }

    // Validate URL format
    try {
      new URL(input.image_url);
    } catch {
      throw new Error('Image URL must be a valid URL');
    }
  }

  /**
   * Handle and format errors
   */
  private handleError(error: any): FalAiKlingV21StandardImageToVideoError {
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
      name: 'Fal AI Kling 2.1 Standard Image-to-Video',
      endpoint: MODEL_ENDPOINT,
      description: 'Kling 2.1 Standard is a cost-efficient endpoint for the Kling 2.1 model, delivering high-quality image-to-video generation',
      pricing: {
        five_seconds: '$0.25 per video',
        ten_seconds: '$0.50 per video',
        additional_second: '$0.05 per additional second',
      },
      capabilities: [
        'Image-to-video generation',
        'Natural motion synthesis',
        'Preservation of image quality and details',
        'Support for diverse content types',
        'Cost-efficient pricing',
        'Flexible duration options',
        'Professional-quality output',
        'Advanced motion synthesis technology',
      ],
    };
  }

  /**
   * Get supported duration options
   */
  static getSupportedDurations(): KlingV21StandardDurationEnum[] {
    return [KlingV21StandardDurationEnum.FIVE_SECONDS, KlingV21StandardDurationEnum.TEN_SECONDS];
  }

  /**
   * Get supported CFG scale range
   */
  static getSupportedCfgScaleRange(): { min: number; max: number } {
    return { min: 0.1, max: 2.0 };
  }

  /**
   * Get default values for common parameters
   */
  static getDefaultValues() {
    return {
      duration: KlingV21StandardDurationEnum.FIVE_SECONDS,
      negative_prompt: 'blur, distort, and low quality',
      cfg_scale: 0.5,
    };
  }

  /**
   * Get pricing information
   */
  static getPricingInfo() {
    return {
      base_costs: {
        '5s': 0.25,
        '10s': 0.50,
      },
      additional_second_cost: 0.05,
      currency: 'USD',
      billing_model: 'per_video',
      notes: [
        '5s video costs $0.25',
        '10s video costs $0.50',
        'Additional seconds beyond 5s cost $0.05 each',
        'No subscription required - pay per use',
        'Cost-efficient option for image-to-video generation',
      ],
    };
  }

  /**
   * Get technical specifications
   */
  static getTechnicalSpecs() {
    return {
      model_type: 'image-to-video',
      architecture: 'Kling 2.1 Standard',
      input_format: 'image + text prompt',
      output_format: 'MP4 video',
      supported_durations: ['5s', '10s'],
      cfg_scale_range: [0.1, 2.0],
      max_prompt_length: 2000,
      max_negative_prompt_length: 2000,
      processing_time: 'variable based on load',
      quality_level: 'standard',
      motion_quality: 'natural',
      visual_quality: 'high',
      supported_image_formats: ['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF', 'AVIF'],
    };
  }

  /**
   * Get best practices
   */
  static getBestPractices() {
    return [
      'Use high-quality source images with clear subjects',
      'Ensure proper lighting and contrast in your input images',
      'Consider the intended motion when framing your source image',
      'Test different CFG scale values (0.3-0.7) to find the right motion control',
      'Write detailed prompts describing the desired motion and scene dynamics',
      'Keep prompts under 2000 characters for optimal performance',
      'Use negative prompts to avoid unwanted elements',
      'Choose appropriate duration for your content needs',
    ];
  }

  /**
   * Get common use cases
   */
  static getCommonUseCases() {
    return [
      'Content creation and marketing visuals',
      'Social media assets and blog illustrations',
      'Product development and concept art',
      'UI mockups and design variations',
      'E-commerce product lifestyle images',
      'Seasonal campaigns and A/B testing',
      'Game assets and storyboard illustrations',
      'Creative concept art for media projects',
      'Rapid prototyping and visual exploration',
      'Professional content at scale',
    ];
  }

  /**
   * Get supported image formats
   */
  static getSupportedImageFormats(): string[] {
    return ['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF', 'AVIF'];
  }

  /**
   * Get model variants information
   */
  static getModelVariants() {
    return {
      standard: {
        name: 'Standard',
        endpoint: 'fal-ai/kling-video/v2.1/standard/image-to-video',
        description: 'Cost-efficient option (this model)',
        pricing: '5s: $0.25, 10s: $0.50',
      },
      pro: {
        name: 'Pro',
        endpoint: 'fal-ai/kling-video/v2.1/pro/image-to-video',
        description: 'Professional grade',
        pricing: 'Higher quality, higher cost',
      },
      master: {
        name: 'Master',
        endpoint: 'fal-ai/kling-video/v2.1/master/image-to-video',
        description: 'Premium quality',
        pricing: 'Highest quality, highest cost',
      },
    };
  }
}
