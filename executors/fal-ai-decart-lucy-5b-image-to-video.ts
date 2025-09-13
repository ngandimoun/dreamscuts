import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/decart/lucy-5b/image-to-video';

// Aspect ratio enum
export type DecartLucy5bImageToVideoAspectRatioEnum = '16:9' | '4:3' | '1:1' | '3:4' | '9:16';

// Resolution enum
export type DecartLucy5bImageToVideoResolutionEnum = '360p' | '540p' | '720p' | '1080p';

// Duration enum
export type DecartLucy5bImageToVideoDurationEnum = '5' | '8';

// Style enum
export type DecartLucy5bImageToVideoStyleEnum = 'anime' | '3d_animation' | 'clay' | 'comic' | 'cyberpunk';

// Camera movement enum
export type DecartLucy5bImageToVideoCameraMovementEnum = 
  | 'horizontal_left' | 'horizontal_right' | 'vertical_up' | 'vertical_down'
  | 'zoom_in' | 'zoom_out' | 'crane_up' | 'quickly_zoom_in' | 'quickly_zoom_out'
  | 'smooth_zoom_in' | 'camera_rotation' | 'robo_arm' | 'super_dolly_out'
  | 'whip_pan' | 'hitchcock' | 'left_follow' | 'right_follow' | 'pan_left' | 'pan_right' | 'fix_bg';

// Input interface
export interface FalAiDecartLucy5bImageToVideoInput {
  prompt: string;
  image_url: string;
  aspect_ratio?: DecartLucy5bImageToVideoAspectRatioEnum;
  resolution?: DecartLucy5bImageToVideoResolutionEnum;
  duration?: DecartLucy5bImageToVideoDurationEnum;
  negative_prompt?: string;
  style?: DecartLucy5bImageToVideoStyleEnum;
  camera_movement?: DecartLucy5bImageToVideoCameraMovementEnum;
  seed?: number;
}

// Output interface
export interface FalAiDecartLucy5bImageToVideoOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error types
export interface FalAiDecartLucy5bImageToVideoError {
  message: string;
  code?: string;
}

// Main executor class
export class FalAiDecartLucy5bImageToVideoExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: this.apiKey });
  }

  /**
   * Generate a video from an image using Decart Lucy 5b model
   */
  async generateVideo(input: FalAiDecartLucy5bImageToVideoInput): Promise<FalAiDecartLucy5bImageToVideoOutput> {
    try {
      this.validateInput(input);

      const result = await fal.subscribe(MODEL_ENDPOINT, {
        input: {
          prompt: input.prompt,
          image_url: input.image_url,
          aspect_ratio: input.aspect_ratio || '16:9',
          resolution: input.resolution || '720p',
          duration: input.duration || '5',
          negative_prompt: input.negative_prompt || '',
          style: input.style,
          camera_movement: input.camera_movement,
          seed: input.seed || Math.floor(Math.random() * 1000000),
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            update.logs?.map((log) => log.message).forEach(console.log);
          }
        },
      });

      return result.data as FalAiDecartLucy5bImageToVideoOutput;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit an image-to-video request to the queue for long-running operations
   */
  async submitImageToVideoRequest(input: FalAiDecartLucy5bImageToVideoInput, webhookUrl?: string): Promise<{ request_id: string }> {
    try {
      this.validateInput(input);

      const { request_id } = await fal.queue.submit(MODEL_ENDPOINT, {
        input: {
          prompt: input.prompt,
          image_url: input.image_url,
          aspect_ratio: input.aspect_ratio || '16:9',
          resolution: input.resolution || '720p',
          duration: input.duration || '5',
          negative_prompt: input.negative_prompt || '',
          style: input.style,
          camera_movement: input.camera_movement,
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
   * Check the status of a queued image-to-video request
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
   * Get the result of a completed image-to-video request
   */
  async getRequestResult(requestId: string): Promise<FalAiDecartLucy5bImageToVideoOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });

      return result.data as FalAiDecartLucy5bImageToVideoOutput;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Calculate the cost for generating a video based on resolution and duration
   */
  calculateCost(resolution: DecartLucy5bImageToVideoResolutionEnum = '720p', duration: DecartLucy5bImageToVideoDurationEnum = '5'): number {
    let baseCost = 0;
    
    switch (resolution) {
      case '360p':
      case '540p':
        baseCost = 0.15;
        break;
      case '720p':
        baseCost = 0.20;
        break;
      case '1080p':
        baseCost = 0.40;
        break;
    }

    // 8-second videos cost double
    if (duration === '8') {
      baseCost *= 2;
    }

    return baseCost;
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: FalAiDecartLucy5bImageToVideoInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error('Prompt is required');
    }

    if (input.prompt.length > 2000) {
      throw new Error('Prompt must be 2000 characters or less');
    }

    if (!input.image_url || input.image_url.trim().length === 0) {
      throw new Error('Image URL is required');
    }

    if (input.negative_prompt && input.negative_prompt.length > 2000) {
      throw new Error('Negative prompt must be 2000 characters or less');
    }

    if (input.seed !== undefined && (input.seed < 0 || input.seed > 999999)) {
      throw new Error('Seed must be between 0 and 999999');
    }
  }

  /**
   * Handle and format errors
   */
  private handleError(error: any): FalAiDecartLucy5bImageToVideoError {
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
      name: 'Fal AI Decart Lucy 5b Image-to-Video',
      endpoint: MODEL_ENDPOINT,
      description: 'Generate high-quality video clips from images using Decart Lucy 5b model',
      pricing: {
        '360p': 0.15,
        '540p': 0.15,
        '720p': 0.20,
        '1080p': 0.40,
      },
      durationMultiplier: 2, // 8s videos cost double
    };
  }

  /**
   * Get supported aspect ratios
   */
  static getSupportedAspectRatios(): DecartLucy5bImageToVideoAspectRatioEnum[] {
    return ['16:9', '4:3', '1:1', '3:4', '9:16'];
  }

  /**
   * Get supported resolutions
   */
  static getSupportedResolutions(): DecartLucy5bImageToVideoResolutionEnum[] {
    return ['360p', '540p', '720p', '1080p'];
  }

  /**
   * Get supported durations
   */
  static getSupportedDurations(): DecartLucy5bImageToVideoDurationEnum[] {
    return ['5', '8'];
  }

  /**
   * Get supported styles
   */
  static getSupportedStyles(): DecartLucy5bImageToVideoStyleEnum[] {
    return ['anime', '3d_animation', 'clay', 'comic', 'cyberpunk'];
  }

  /**
   * Get supported camera movements
   */
  static getSupportedCameraMovements(): DecartLucy5bImageToVideoCameraMovementEnum[] {
    return [
      'horizontal_left', 'horizontal_right', 'vertical_up', 'vertical_down',
      'zoom_in', 'zoom_out', 'crane_up', 'quickly_zoom_in', 'quickly_zoom_out',
      'smooth_zoom_in', 'camera_rotation', 'robo_arm', 'super_dolly_out',
      'whip_pan', 'hitchcock', 'left_follow', 'right_follow', 'pan_left', 'pan_right', 'fix_bg'
    ];
  }
}
