import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/bytedance/seedance/v1/lite/reference-to-video';

// Resolution enum
export type BytedanceSeedanceV1LiteReferenceToVideoResolutionEnum = '360p' | '480p' | '720p' | '1080p';

// Input interface
export interface FalAiBytedanceSeedanceV1LiteReferenceToVideoInput {
  prompt: string;
  reference_image_urls: string[];
  resolution?: BytedanceSeedanceV1LiteReferenceToVideoResolutionEnum;
  duration?: number;
  fps?: number;
  seed?: number;
}

// Output interface
export interface FalAiBytedanceSeedanceV1LiteReferenceToVideoOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  seed?: number;
}

// Error types
export interface FalAiBytedanceSeedanceV1LiteReferenceToVideoError {
  message: string;
  code?: string;
}

// Main executor class
export class FalAiBytedanceSeedanceV1LiteReferenceToVideoExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: this.apiKey });
  }

  /**
   * Generate a video from reference images using Bytedance Seedance 1.0 Lite model
   */
  async generateVideo(input: FalAiBytedanceSeedanceV1LiteReferenceToVideoInput): Promise<FalAiBytedanceSeedanceV1LiteReferenceToVideoOutput> {
    try {
      this.validateInput(input);

      const result = await fal.subscribe(MODEL_ENDPOINT, {
        input: {
          prompt: input.prompt,
          reference_image_urls: input.reference_image_urls,
          resolution: input.resolution || '720p',
          duration: input.duration || 5,
          fps: input.fps || 24,
          seed: input.seed || Math.floor(Math.random() * 1000000),
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            update.logs?.map((log) => log.message).forEach(console.log);
          }
        },
      });

      return result.data as FalAiBytedanceSeedanceV1LiteReferenceToVideoOutput;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit a reference-to-video request to the queue for long-running operations
   */
  async submitReferenceToVideoRequest(input: FalAiBytedanceSeedanceV1LiteReferenceToVideoInput, webhookUrl?: string): Promise<{ request_id: string }> {
    try {
      this.validateInput(input);

      const { request_id } = await fal.queue.submit(MODEL_ENDPOINT, {
        input: {
          prompt: input.prompt,
          reference_image_urls: input.reference_image_urls,
          resolution: input.resolution || '720p',
          duration: input.duration || 5,
          fps: input.fps || 24,
          seed: input.seed || Math.floor(Math.random() * 1000000),
        },
        webhookUrl,
      });

      return { request_id };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Check the status of a queued reference-to-video request
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
   * Get the result of a completed reference-to-video request
   */
  async getRequestResult(requestId: string): Promise<FalAiBytedanceSeedanceV1LiteReferenceToVideoOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });

      return result.data as FalAiBytedanceSeedanceV1LiteReferenceToVideoOutput;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Calculate the cost for generating a video based on resolution and duration
   */
  calculateCost(resolution: BytedanceSeedanceV1LiteReferenceToVideoResolutionEnum = '720p', duration: number = 5, fps: number = 24): number {
    // For 720p 5-second videos, cost is $0.18
    if (resolution === '720p' && duration === 5) {
      return 0.18;
    }

    // For other resolutions, calculate based on video tokens
    // tokens(video) = (height x width x FPS x duration) / 1024
    let height: number;
    let width: number;

    switch (resolution) {
      case '360p':
        height = 360;
        width = 640;
        break;
      case '480p':
        height = 480;
        width = 854;
        break;
      case '720p':
        height = 720;
        width = 1280;
        break;
      case '1080p':
        height = 1080;
        width = 1920;
        break;
      default:
        height = 720;
        width = 1280;
    }

    const videoTokens = (height * width * fps * duration) / 1024;
    const cost = (videoTokens / 1000000) * 1.8; // $1.8 per 1 million tokens

    return Math.round(cost * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: FalAiBytedanceSeedanceV1LiteReferenceToVideoInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error('Prompt is required');
    }

    if (input.prompt.length > 2000) {
      throw new Error('Prompt must be 2000 characters or less');
    }

    if (!input.reference_image_urls || input.reference_image_urls.length === 0) {
      throw new Error('At least one reference image URL is required');
    }

    if (input.reference_image_urls.length > 4) {
      throw new Error('Maximum of 4 reference images allowed');
    }

    for (const url of input.reference_image_urls) {
      if (!url || url.trim().length === 0) {
        throw new Error('All reference image URLs must be valid');
      }
    }

    if (input.duration !== undefined && (input.duration < 1 || input.duration > 30)) {
      throw new Error('Duration must be between 1 and 30 seconds');
    }

    if (input.fps !== undefined && (input.fps < 1 || input.fps > 60)) {
      throw new Error('FPS must be between 1 and 60');
    }

    if (input.seed !== undefined && (input.seed < 0 || input.seed > 999999)) {
      throw new Error('Seed must be between 0 and 999999');
    }
  }

  /**
   * Handle and format errors
   */
  private handleError(error: any): FalAiBytedanceSeedanceV1LiteReferenceToVideoError {
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
      name: 'Fal AI Bytedance Seedance 1.0 Lite Reference-to-Video',
      endpoint: MODEL_ENDPOINT,
      description: 'Generate high-quality videos from reference images using Bytedance Seedance 1.0 Lite model',
      pricing: {
        '720p_5s': 0.18,
        'other_resolutions': 'Based on video tokens: $1.8 per 1 million tokens',
      },
      tokenCalculation: 'tokens(video) = (height × width × FPS × duration) / 1024',
    };
  }

  /**
   * Get supported resolutions
   */
  static getSupportedResolutions(): BytedanceSeedanceV1LiteReferenceToVideoResolutionEnum[] {
    return ['360p', '480p', '720p', '1080p'];
  }

  /**
   * Get supported duration range
   */
  static getSupportedDurationRange(): { min: number; max: number } {
    return { min: 1, max: 30 };
  }

  /**
   * Get supported FPS range
   */
  static getSupportedFPSRange(): { min: number; max: number } {
    return { min: 1, max: 60 };
  }

  /**
   * Get maximum reference images allowed
   */
  static getMaxReferenceImages(): number {
    return 4;
  }
}
