import { fal } from '@fal-ai/client';

// Input schema for LTX Video LoRA Multi-conditioning
export interface LtxVideoLoraMulticonditioningInput {
  prompt: string;
  negative_prompt?: string;
  image_url?: string;
  video_url?: string;
  seed?: number;
  aspect_ratio?: '16:9' | '9:16' | '1:1' | '4:3' | '3:4';
  resolution?: '480p' | '720p' | '1080p';
  num_frames?: number;
  guidance_scale?: number;
  image_condition?: {
    image_url: string;
    frame_number: number;
    strength: number;
  };
  video_condition?: {
    video_url: string;
    frame_number: number;
    strength: number;
  };
  prompt_optimizer?: boolean;
}

// Output schema for LTX Video LoRA Multi-conditioning
export interface LtxVideoLoraMulticonditioningOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  seed: number;
  prompt_optimized?: string;
}

// Error types
export interface LtxVideoLoraMulticonditioningError {
  error: string;
  details?: string;
}

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/ltx-video-lora/multiconditioning';

// Default configuration
const DEFAULT_CONFIG: Partial<LtxVideoLoraMulticonditioningInput> = {
  negative_prompt: '',
  seed: 0,
  aspect_ratio: '16:9',
  resolution: '480p',
  num_frames: 180,
  guidance_scale: 10,
  prompt_optimizer: true,
};

export class LtxVideoLoraMulticonditioningExecutor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  /**
   * Generate video using LTX Video LoRA Multi-conditioning
   */
  async generateVideo(input: LtxVideoLoraMulticonditioningInput): Promise<LtxVideoLoraMulticonditioningOutput> {
    try {
      const config = { ...DEFAULT_CONFIG, ...input };

      const result = await fal.subscribe(this.modelEndpoint, {
        input: config,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs?.forEach((log) => console.log(log.message));
          }
        },
      });

      return {
        video: {
          url: (result as any).video?.url || '',
          content_type: (result as any).video?.content_type,
          file_name: (result as any).video?.file_name,
          file_size: (result as any).video?.file_size,
        },
        seed: (result as any).seed || 0,
        prompt_optimized: (result as any).prompt_optimized
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit video generation to queue for long-running requests
   */
  async submitToQueue(input: LtxVideoLoraMulticonditioningInput): Promise<{ requestId: string }> {
    try {
      const config = { ...DEFAULT_CONFIG, ...input };

      const { request_id } = await fal.queue.submit(this.modelEndpoint, {
        input: config,
      });

      return { requestId: request_id };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Check the status of a queued request
   */
  async checkStatus(requestId: string): Promise<any> {
    try {
      const status = await fal.queue.status(this.modelEndpoint, {
        requestId,
        logs: true,
      });

      return status;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get the result of a completed queued request
   */
  async getResult(requestId: string): Promise<LtxVideoLoraMulticonditioningOutput> {
    try {
      const result = await fal.queue.result(this.modelEndpoint, {
        requestId,
      });

      return {
        video: {
          url: (result as any).video?.url || '',
          content_type: (result as any).video?.content_type,
          file_name: (result as any).video?.file_name,
          file_size: (result as any).video?.file_size,
        },
        seed: (result as any).seed || 0,
        prompt_optimized: (result as any).prompt_optimized
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Calculate estimated cost for video generation
   */
  calculateCost(resolution: '480p' | '720p' | '1080p', numFrames: number = 180): number {
    // Base cost per frame
    const baseCostPerFrame = 0.0001;

    // Resolution multipliers
    const resolutionMultipliers = {
      '480p': 1.0,
      '720p': 1.5,
      '1080p': 2.0,
    };

    const multiplier = resolutionMultipliers[resolution] || 1.0;
    return baseCostPerFrame * numFrames * multiplier;
  }

  /**
   * Validate input parameters
   */
  validateInput(input: LtxVideoLoraMulticonditioningInput): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.prompt || input.prompt.trim().length === 0) {
      errors.push('Prompt is required');
    }

    if (input.prompt && input.prompt.length > 500) {
      errors.push('Prompt must be 500 characters or less');
    }

    if (input.num_frames && (input.num_frames < 1 || input.num_frames > 300)) {
      errors.push('Number of frames must be between 1 and 300');
    }

    if (input.guidance_scale && (input.guidance_scale < 1 || input.guidance_scale > 20)) {
      errors.push('Guidance scale must be between 1 and 20');
    }

    if (input.image_condition) {
      if (!input.image_condition.image_url) {
        errors.push('Image condition must include image_url');
      }
      if (input.image_condition.frame_number < 0) {
        errors.push('Image condition frame number must be non-negative');
      }
      if (input.image_condition.strength < 0 || input.image_condition.strength > 1) {
        errors.push('Image condition strength must be between 0 and 1');
      }
    }

    if (input.video_condition) {
      if (!input.video_condition.video_url) {
        errors.push('Video condition must include video_url');
      }
      if (input.video_condition.frame_number < 0) {
        errors.push('Video condition frame number must be non-negative');
      }
      if (input.video_condition.strength < 0 || input.video_condition.strength > 1) {
        errors.push('Video condition strength must be between 0 and 1');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Handle errors consistently
   */
  private handleError(error: any): LtxVideoLoraMulticonditioningError {
    if (error instanceof Error) {
      return {
        error: error.message,
        details: error.stack,
      };
    }

    if (typeof error === 'string') {
      return {
        error,
      };
    }

    return {
      error: 'An unknown error occurred',
      details: JSON.stringify(error),
    };
  }
}
