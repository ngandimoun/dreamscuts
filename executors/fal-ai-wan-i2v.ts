import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/wan-i2v';

// Enums for type safety
export enum WanI2vResolutionEnum {
  RESOLUTION_480P = '480p',
  RESOLUTION_720P = '720p',
}

export enum WanI2vAspectRatioEnum {
  AUTO = 'auto',
  SIXTEEN_NINE = '16:9',
  NINE_SIXTEEN = '9:16',
  ONE_ONE = '1:1',
}

export enum WanI2vAccelerationEnum {
  NONE = 'none',
  REGULAR = 'regular',
}

// Input interface
export interface FalAiWanI2vInput {
  prompt: string;
  image_url: string;
  negative_prompt?: string;
  num_frames?: number;
  frames_per_second?: number;
  seed?: number;
  resolution?: WanI2vResolutionEnum;
  num_inference_steps?: number;
  guide_scale?: number;
  shift?: number;
  enable_safety_checker?: boolean;
  enable_prompt_expansion?: boolean;
  acceleration?: WanI2vAccelerationEnum;
  aspect_ratio?: WanI2vAspectRatioEnum;
}

// Output interface
export interface FalAiWanI2vOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  seed?: number;
}

// Error types
export interface FalAiWanI2vError {
  message: string;
  code?: string;
}

// Main executor class
export class FalAiWanI2vExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: this.apiKey });
  }

  /**
   * Generate video from image using the Wan-i2v model
   */
  async generateVideo(input: FalAiWanI2vInput): Promise<FalAiWanI2vOutput> {
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
        seed: result.data.seed || input.seed,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit a video generation request to the queue for long-running operations
   */
  async submitVideoGenerationRequest(input: FalAiWanI2vInput, webhookUrl?: string): Promise<{ request_id: string }> {
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
  async getRequestResult(requestId: string): Promise<FalAiWanI2vOutput> {
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
        seed: result.data.seed,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Calculate the cost for generating video based on parameters
   */
  calculateCost(resolution: WanI2vResolutionEnum = WanI2vResolutionEnum.RESOLUTION_720P, numFrames: number = 81): number {
    // Base cost calculation for Wan-i2v
    // 480p: $0.20 per video (0.5 billing units)
    // 720p: $0.40 per video (1 billing unit)
    // More than 81 frames: 1.25x billing units
    
    let baseCost = 0;
    if (resolution === WanI2vResolutionEnum.RESOLUTION_480P) {
      baseCost = 0.20;
    } else if (resolution === WanI2vResolutionEnum.RESOLUTION_720P) {
      baseCost = 0.40;
    }

    // Apply frame multiplier if more than 81 frames
    if (numFrames > 81) {
      baseCost *= 1.25;
    }

    return Math.round(baseCost * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: FalAiWanI2vInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error('Prompt is required');
    }

    if (!input.image_url || input.image_url.trim().length === 0) {
      throw new Error('Image URL is required');
    }

    if (input.prompt.length > 2000) {
      throw new Error('Prompt must be 2000 characters or less');
    }

    if (input.negative_prompt && input.negative_prompt.length > 2000) {
      throw new Error('Negative prompt must be 2000 characters or less');
    }

    if (input.num_frames !== undefined && (input.num_frames < 81 || input.num_frames > 100)) {
      throw new Error('Number of frames must be between 81 and 100');
    }

    if (input.frames_per_second !== undefined && (input.frames_per_second < 5 || input.frames_per_second > 24)) {
      throw new Error('Frames per second must be between 5 and 24');
    }

    if (input.seed !== undefined && (input.seed < 0 || input.seed > 999999)) {
      throw new Error('Seed must be between 0 and 999999');
    }

    if (input.num_inference_steps !== undefined && (input.num_inference_steps < 1 || input.num_inference_steps > 100)) {
      throw new Error('Number of inference steps must be between 1 and 100');
    }

    if (input.guide_scale !== undefined && (input.guide_scale < 0.1 || input.guide_scale > 20.0)) {
      throw new Error('Guide scale must be between 0.1 and 20.0');
    }

    if (input.shift !== undefined && (input.shift < 0 || input.shift > 10)) {
      throw new Error('Shift parameter must be between 0 and 10');
    }
  }

  /**
   * Handle and format errors
   */
  private handleError(error: any): FalAiWanI2vError {
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
      name: 'Fal AI Wan-i2v',
      endpoint: MODEL_ENDPOINT,
      description: 'WAN-2.1 Image-to-Video model that generates high-quality videos with high visual quality and motion diversity from images',
      pricing: {
        resolution_480p: '$0.20 per video (0.5 billing units)',
        resolution_720p: '$0.40 per video (1 billing unit)',
        frame_multiplier: '1.25x billing units for more than 81 frames',
      },
      capabilities: [
        'Image-to-video generation',
        'High visual quality output',
        'Motion diversity control',
        'Multiple resolution options (480p, 720p)',
        'Configurable frame count (81-100)',
        'Customizable frames per second (5-24)',
        'Seed control for reproducible results',
        'Safety checker and prompt expansion options',
        'Multiple aspect ratio support',
      ],
    };
  }

  /**
   * Get supported frame count range
   */
  static getSupportedFrameCountRange(): { min: number; max: number } {
    return { min: 81, max: 100 };
  }

  /**
   * Get supported frames per second range
   */
  static getSupportedFpsRange(): { min: number; max: number } {
    return { min: 5, max: 24 };
  }

  /**
   * Get supported inference steps range
   */
  static getSupportedInferenceStepsRange(): { min: number; max: number } {
    return { min: 1, max: 100 };
  }

  /**
   * Get supported guide scale range
   */
  static getSupportedGuideScaleRange(): { min: number; max: number } {
    return { min: 0.1, max: 20.0 };
  }

  /**
   * Get supported shift range
   */
  static getSupportedShiftRange(): { min: number; max: number } {
    return { min: 0, max: 10 };
  }

  /**
   * Get supported resolutions
   */
  static getSupportedResolutions(): WanI2vResolutionEnum[] {
    return [WanI2vResolutionEnum.RESOLUTION_480P, WanI2vResolutionEnum.RESOLUTION_720P];
  }

  /**
   * Get supported aspect ratios
   */
  static getSupportedAspectRatios(): WanI2vAspectRatioEnum[] {
    return [
      WanI2vAspectRatioEnum.AUTO,
      WanI2vAspectRatioEnum.SIXTEEN_NINE,
      WanI2vAspectRatioEnum.NINE_SIXTEEN,
      WanI2vAspectRatioEnum.ONE_ONE,
    ];
  }

  /**
   * Get supported acceleration levels
   */
  static getSupportedAccelerationLevels(): WanI2vAccelerationEnum[] {
    return [WanI2vAccelerationEnum.NONE, WanI2vAccelerationEnum.REGULAR];
  }

  /**
   * Get default values for common parameters
   */
  static getDefaultValues() {
    return {
      num_frames: 81,
      frames_per_second: 16,
      resolution: WanI2vResolutionEnum.RESOLUTION_720P,
      num_inference_steps: 30,
      guide_scale: 5,
      shift: 5,
      enable_safety_checker: true,
      enable_prompt_expansion: false,
      acceleration: WanI2vAccelerationEnum.REGULAR,
      aspect_ratio: WanI2vAspectRatioEnum.AUTO,
      negative_prompt: 'bright colors, overexposed, static, blurred details, subtitles, style, artwork, painting, picture, still, overall gray, worst quality, low quality, JPEG compression residue, ugly, incomplete, extra fingers, poorly drawn hands, poorly drawn faces, deformed, disfigured, malformed limbs, fused fingers, still picture, cluttered background, three legs, many people in the background, walking backwards',
    };
  }
}
