import { fal } from '@fal-ai/client';

// Input schema for Veed Lipsync
export interface VeedLipsyncInput {
  video_url: string;
  audio_url: string;
}

// Output schema for Veed Lipsync
export interface VeedLipsyncOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error types
export interface VeedLipsyncError {
  error: string;
  details?: string;
}

// Model endpoint
const MODEL_ENDPOINT = 'veed/lipsync';

export class VeedLipsyncExecutor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  /**
   * Generate lipsync using Veed Lipsync
   */
  async generateLipsync(input: VeedLipsyncInput): Promise<VeedLipsyncOutput> {
    try {
      const result = await fal.subscribe(this.modelEndpoint, {
        input,
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
        }
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit lipsync generation to queue for long-running requests
   */
  async submitToQueue(input: VeedLipsyncInput): Promise<{ requestId: string }> {
    try {
      const { request_id } = await fal.queue.submit(this.modelEndpoint, {
        input,
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
  async getResult(requestId: string): Promise<VeedLipsyncOutput> {
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
        }
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Calculate estimated cost for lipsync generation
   */
  calculateCost(durationMinutes: number): number {
    // Cost is $0.4 per minute
    const costPerMinute = 0.4;
    return costPerMinute * durationMinutes;
  }

  /**
   * Validate input parameters
   */
  validateInput(input: VeedLipsyncInput): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.video_url || input.video_url.trim().length === 0) {
      errors.push('Video URL is required');
    }

    if (!input.audio_url || input.audio_url.trim().length === 0) {
      errors.push('Audio URL is required');
    }

    // Basic URL validation
    try {
      new URL(input.video_url);
    } catch {
      errors.push('Video URL must be a valid URL');
    }

    try {
      new URL(input.audio_url);
    } catch {
      errors.push('Audio URL must be a valid URL');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Handle errors consistently
   */
  private handleError(error: any): VeedLipsyncError {
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
