import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/pixverse/v5/transition';

// Aspect ratio enum
export type PixverseV5TransitionAspectRatioEnum = '16:9' | '4:3' | '1:1' | '3:4' | '9:16';

// Resolution enum
export type PixverseV5TransitionResolutionEnum = '360p' | '540p' | '720p' | '1080p';

// Duration enum
export type PixverseV5TransitionDurationEnum = '5' | '8';

// Style enum
export type PixverseV5TransitionStyleEnum = 'anime' | '3d_animation' | 'clay' | 'comic' | 'cyberpunk';

// Input interface
export interface FalAiPixverseV5TransitionInput {
  prompt: string;
  first_image_url: string;
  last_image_url: string;
  aspect_ratio?: PixverseV5TransitionAspectRatioEnum;
  resolution?: PixverseV5TransitionResolutionEnum;
  duration?: PixverseV5TransitionDurationEnum;
  negative_prompt?: string;
  style?: PixverseV5TransitionStyleEnum;
  seed?: number;
}

// Output interface
export interface FalAiPixverseV5TransitionOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error types
export interface FalAiPixverseV5TransitionError {
  message: string;
  code?: string;
}

// Main executor class
export class FalAiPixverseV5TransitionExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: apiKey });
  }

  /**
   * Generate a transition video between two images
   */
  async generateTransition(input: FalAiPixverseV5TransitionInput): Promise<FalAiPixverseV5TransitionOutput> {
    try {
      this.validateInput(input);
      
      const result = await fal.subscribe(MODEL_ENDPOINT, {
        input: {
          prompt: input.prompt,
          first_image_url: input.first_image_url,
          last_image_url: input.last_image_url,
          aspect_ratio: input.aspect_ratio || '16:9',
          resolution: input.resolution || '720p',
          duration: input.duration || '5',
          negative_prompt: input.negative_prompt || '',
          style: input.style,
          seed: input.seed,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            update.logs?.map((log) => log.message).forEach(console.log);
          }
        },
      });

      return result.data as FalAiPixverseV5TransitionOutput;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit a transition generation request to the queue
   */
  async submitTransitionRequest(input: FalAiPixverseV5TransitionInput, webhookUrl?: string): Promise<{ request_id: string }> {
    try {
      this.validateInput(input);
      
      const { request_id } = await fal.queue.submit(MODEL_ENDPOINT, {
        input: {
          prompt: input.prompt,
          first_image_url: input.first_image_url,
          last_image_url: input.last_image_url,
          aspect_ratio: input.aspect_ratio || '16:9',
          resolution: input.resolution || '720p',
          duration: input.duration || '5',
          negative_prompt: input.negative_prompt || '',
          style: input.style,
          seed: input.seed,
        },
        webhookUrl,
      });

      return { request_id };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Check the status of a queued request
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
   * Get the result of a completed request
   */
  async getRequestResult(requestId: string): Promise<FalAiPixverseV5TransitionOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });
      return result.data as FalAiPixverseV5TransitionOutput;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Calculate the cost for a transition generation
   */
  calculateCost(resolution: PixverseV5TransitionResolutionEnum = '720p', duration: PixverseV5TransitionDurationEnum = '5'): number {
    const baseCosts = {
      '360p': 0.15,
      '540p': 0.15,
      '720p': 0.20,
      '1080p': 0.40,
    };

    const baseCost = baseCosts[resolution];
    const durationMultiplier = duration === '8' ? 2 : 1;
    
    return baseCost * durationMultiplier;
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: FalAiPixverseV5TransitionInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error('Prompt is required');
    }

    if (input.prompt.length > 2000) {
      throw new Error('Prompt must be 2000 characters or less');
    }

    if (!input.first_image_url || input.first_image_url.trim().length === 0) {
      throw new Error('First image URL is required');
    }

    if (!input.last_image_url || input.last_image_url.trim().length === 0) {
      throw new Error('Last image URL is required');
    }

    if (input.negative_prompt && input.negative_prompt.length > 2000) {
      throw new Error('Negative prompt must be 2000 characters or less');
    }

    if (input.seed !== undefined && (input.seed < 0 || input.seed > 999999)) {
      throw new Error('Seed must be between 0 and 999999');
    }

    // Validate resolution and duration constraints
    if (input.resolution === '1080p' && input.duration === '8') {
      throw new Error('1080p videos are limited to 5 seconds maximum');
    }
  }

  /**
   * Handle and format errors
   */
  private handleError(error: any): FalAiPixverseV5TransitionError {
    if (error.response?.data) {
      return {
        message: error.response.data.message || 'API request failed',
        code: error.response.data.code,
      };
    }

    if (error.message) {
      return {
        message: error.message,
      };
    }

    return {
      message: 'An unexpected error occurred',
    };
  }

  /**
   * Get available aspect ratios
   */
  static getAspectRatios(): PixverseV5TransitionAspectRatioEnum[] {
    return ['16:9', '4:3', '1:1', '3:4', '9:16'];
  }

  /**
   * Get available resolutions
   */
  static getResolutions(): PixverseV5TransitionResolutionEnum[] {
    return ['360p', '540p', '720p', '1080p'];
  }

  /**
   * Get available durations
   */
  static getDurations(): PixverseV5TransitionDurationEnum[] {
    return ['5', '8'];
  }

  /**
   * Get available styles
   */
  static getStyles(): PixverseV5TransitionStyleEnum[] {
    return ['anime', '3d_animation', 'clay', 'comic', 'cyberpunk'];
  }

  /**
   * Get pricing information
   */
  static getPricingInfo(): { [key: string]: number } {
    return {
      '360p': 0.15,
      '540p': 0.15,
      '720p': 0.20,
      '1080p': 0.40,
    };
  }
}
