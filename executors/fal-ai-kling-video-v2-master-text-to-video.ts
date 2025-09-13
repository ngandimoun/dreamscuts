import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/kling-video/v2/master/text-to-video';

// Enums for type safety
export enum KlingV2MasterDurationEnum {
  FIVE_SECONDS = '5',
  TEN_SECONDS = '10',
}

export enum KlingV2MasterAspectRatioEnum {
  SIXTEEN_NINE = '16:9',
  NINE_SIXTEEN = '9:16',
  ONE_ONE = '1:1',
}

// Input interface
export interface FalAiKlingV2MasterTextToVideoInput {
  prompt: string;
  duration?: KlingV2MasterDurationEnum;
  aspect_ratio?: KlingV2MasterAspectRatioEnum;
  negative_prompt?: string;
  cfg_scale?: number;
}

// Output interface
export interface FalAiKlingV2MasterTextToVideoOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error types
export interface FalAiKlingV2MasterTextToVideoError {
  message: string;
  code?: string;
}

// Main executor class
export class FalAiKlingV2MasterTextToVideoExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: this.apiKey });
  }

  /**
   * Generate video from text prompt using the Kling 2.0 Master model
   */
  async generateVideo(input: FalAiKlingV2MasterTextToVideoInput): Promise<FalAiKlingV2MasterTextToVideoOutput> {
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
  async submitVideoGenerationRequest(input: FalAiKlingV2MasterTextToVideoInput, webhookUrl?: string): Promise<{ request_id: string }> {
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
  async getRequestResult(requestId: string): Promise<FalAiKlingV2MasterTextToVideoOutput> {
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
  calculateCost(duration: KlingV2MasterDurationEnum = KlingV2MasterDurationEnum.FIVE_SECONDS): number {
    // Base cost calculation for Kling 2.0 Master
    // 5s video: $1.40
    // 10s video: $2.80
    // For every additional second beyond 10s: $0.28
    
    if (duration === KlingV2MasterDurationEnum.FIVE_SECONDS) {
      return 1.40;
    } else if (duration === KlingV2MasterDurationEnum.TEN_SECONDS) {
      return 2.80;
    }
    
    // For custom durations beyond 10 seconds
    const additionalSeconds = parseInt(duration) - 10;
    return 2.80 + (additionalSeconds * 0.28);
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: FalAiKlingV2MasterTextToVideoInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error('Prompt is required');
    }

    if (input.prompt.length > 2000) {
      throw new Error('Prompt must be 2000 characters or less');
    }

    if (input.duration && !Object.values(KlingV2MasterDurationEnum).includes(input.duration)) {
      throw new Error('Duration must be either "5" or "10"');
    }

    if (input.aspect_ratio && !Object.values(KlingV2MasterAspectRatioEnum).includes(input.aspect_ratio)) {
      throw new Error('Aspect ratio must be one of: "16:9", "9:16", "1:1"');
    }

    if (input.negative_prompt && input.negative_prompt.length > 2000) {
      throw new Error('Negative prompt must be 2000 characters or less');
    }

    if (input.cfg_scale !== undefined && (input.cfg_scale < 0.1 || input.cfg_scale > 2.0)) {
      throw new Error('CFG scale must be between 0.1 and 2.0');
    }
  }

  /**
   * Handle and format errors
   */
  private handleError(error: any): FalAiKlingV2MasterTextToVideoError {
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
      name: 'Fal AI Kling 2.0 Master Text-to-Video',
      endpoint: MODEL_ENDPOINT,
      description: 'Kling 2.0 Master is an upgraded text-to-video generation model that significantly improves upon Kling 1.6 in text understanding, motion quality, and visual quality',
      pricing: {
        five_seconds: '$1.40 per video',
        ten_seconds: '$2.80 per video',
        additional_second: '$0.28 per additional second',
      },
      capabilities: [
        'Text-to-video generation',
        'Enhanced text understanding for complex scenes',
        'Dynamic character and subject movements',
        'Smooth motion and transitions',
        'Natural and logical complex action sequences',
        'Lifelike characters with realistic movements',
        'Highly detailed scene generation',
        'Better preservation of artistic style',
        'Cinematic quality output',
        'Support for complex sequential shot descriptions',
        'Blockbuster-quality scene generation',
      ],
    };
  }

  /**
   * Get supported duration options
   */
  static getSupportedDurations(): KlingV2MasterDurationEnum[] {
    return [KlingV2MasterDurationEnum.FIVE_SECONDS, KlingV2MasterDurationEnum.TEN_SECONDS];
  }

  /**
   * Get supported aspect ratios
   */
  static getSupportedAspectRatios(): KlingV2MasterAspectRatioEnum[] {
    return [
      KlingV2MasterAspectRatioEnum.SIXTEEN_NINE,
      KlingV2MasterAspectRatioEnum.NINE_SIXTEEN,
      KlingV2MasterAspectRatioEnum.ONE_ONE,
    ];
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
      duration: KlingV2MasterDurationEnum.FIVE_SECONDS,
      aspect_ratio: KlingV2MasterAspectRatioEnum.SIXTEEN_NINE,
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
        '5s': 1.40,
        '10s': 2.80,
      },
      additional_second_cost: 0.28,
      currency: 'USD',
      billing_model: 'per_video',
      notes: [
        '5s video costs $1.40',
        '10s video costs $2.80',
        'Additional seconds beyond 10s cost $0.28 each',
        'No subscription required - pay per use',
      ],
    };
  }

  /**
   * Get technical specifications
   */
  static getTechnicalSpecs() {
    return {
      model_type: 'text-to-video',
      architecture: 'Kling 2.0 Master',
      input_format: 'text prompt',
      output_format: 'MP4 video',
      supported_durations: ['5s', '10s'],
      supported_aspect_ratios: ['16:9', '9:16', '1:1'],
      cfg_scale_range: [0.1, 2.0],
      max_prompt_length: 2000,
      max_negative_prompt_length: 2000,
      processing_time: 'approximately 1-2 minutes',
      quality_level: 'master',
      motion_quality: 'enhanced',
      visual_quality: 'cinematic',
    };
  }

  /**
   * Get best practices
   */
  static getBestPractices() {
    return [
      'Use detailed, descriptive prompts for better results',
      'Specify camera movements and angles clearly',
      'Describe character actions and emotions in detail',
      'Use appropriate aspect ratios for your content type',
      'Start with default CFG scale (0.5) and adjust as needed',
      'Keep prompts under 2000 characters for optimal performance',
      'Use negative prompts to avoid unwanted elements',
      'Consider the intended use case when choosing duration',
    ];
  }

  /**
   * Get common use cases
   */
  static getCommonUseCases() {
    return [
      'Social media content creation',
      'Marketing and advertising videos',
      'Educational content',
      'Entertainment and storytelling',
      'Product demonstrations',
      'Character animation',
      'Scene visualization',
      'Creative art projects',
      'Prototype video generation',
      'Content for streaming platforms',
    ];
  }
}
