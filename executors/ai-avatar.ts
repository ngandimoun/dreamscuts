import { fal } from '@fal-ai/client';

// Resolution options
export type AvatarResolutionEnum = '480p' | '720p';

// Acceleration options
export type AvatarAccelerationEnum = 'none' | 'regular' | 'high';

// Input schema for AI Avatar
export interface AiAvatarInput {
  image_url: string;
  audio_url: string;
  prompt: string;
  num_frames?: number;
  resolution?: AvatarResolutionEnum;
  seed?: number;
  acceleration?: AvatarAccelerationEnum;
}

// Output schema for AI Avatar
export interface AiAvatarOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  seed: number;
}

// Error types
export interface AiAvatarError {
  error: string;
  details?: string;
}

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/ai-avatar';

export class AiAvatarExecutor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  /**
   * Generate talking avatar video using AI Avatar
   */
  async generateAvatar(input: AiAvatarInput): Promise<AiAvatarOutput> {
    try {
      // Validate required inputs
      if (!input.image_url || !input.audio_url || !input.prompt) {
        throw new Error('Missing required inputs: image_url, audio_url, and prompt are required');
      }

      // Validate num_frames range
      if (input.num_frames && (input.num_frames < 81 || input.num_frames > 129)) {
        throw new Error('num_frames must be between 81 and 129 (inclusive)');
      }

      // Set defaults
      const requestInput = {
        image_url: input.image_url,
        audio_url: input.audio_url,
        prompt: input.prompt,
        num_frames: input.num_frames || 145,
        resolution: input.resolution || '480p',
        seed: input.seed || 42,
        acceleration: input.acceleration || 'regular'
      };

      // Calculate cost based on resolution and frames
      const baseCostPerSecond = 0.3;
      const resolutionMultiplier = requestInput.resolution === '720p' ? 2 : 1;
      const frameMultiplier = requestInput.num_frames > 81 ? 1.25 : 1;
      const totalCost = baseCostPerSecond * resolutionMultiplier * frameMultiplier;

      console.log(`Estimated cost: $${totalCost.toFixed(2)} per second of output video`);
      console.log(`Resolution multiplier: ${resolutionMultiplier}x`);
      console.log(`Frame multiplier: ${frameMultiplier}x`);

      // Submit request
      const result = await fal.subscribe(this.modelEndpoint, {
        input: requestInput,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            update.logs?.map((log) => log.message).forEach(console.log);
          }
        },
      });

      return result.data as AiAvatarOutput;
    } catch (error) {
      console.error('Error generating avatar video:', error);
      throw {
        error: 'Failed to generate avatar video',
        details: error instanceof Error ? error.message : String(error)
      } as AiAvatarError;
    }
  }

  /**
   * Submit avatar generation to queue for long-running requests
   */
  async submitToQueue(input: AiAvatarInput, webhookUrl?: string): Promise<{ request_id: string }> {
    try {
      // Validate required inputs
      if (!input.image_url || !input.audio_url || !input.prompt) {
        throw new Error('Missing required inputs: image_url, audio_url, and prompt are required');
      }

      // Validate num_frames range
      if (input.num_frames && (input.num_frames < 81 || input.num_frames > 129)) {
        throw new Error('num_frames must be between 81 and 129 (inclusive)');
      }

      // Set defaults
      const requestInput = {
        image_url: input.image_url,
        audio_url: input.audio_url,
        prompt: input.prompt,
        num_frames: input.num_frames || 145,
        resolution: input.resolution || '480p',
        seed: input.seed || 42,
        acceleration: input.acceleration || 'regular'
      };

      // Calculate cost based on resolution and frames
      const baseCostPerSecond = 0.3;
      const resolutionMultiplier = requestInput.resolution === '720p' ? 2 : 1;
      const frameMultiplier = requestInput.num_frames > 81 ? 1.25 : 1;
      const totalCost = baseCostPerSecond * resolutionMultiplier * frameMultiplier;

      console.log(`Estimated cost: $${totalCost.toFixed(2)} per second of output video`);
      console.log(`Resolution multiplier: ${resolutionMultiplier}x`);
      console.log(`Frame multiplier: ${frameMultiplier}x`);

      // Submit to queue
      const { request_id } = await fal.queue.submit(this.modelEndpoint, {
        input: requestInput,
        webhookUrl,
      });

      return { request_id };
    } catch (error) {
      console.error('Error submitting avatar generation to queue:', error);
      throw {
        error: 'Failed to submit avatar generation to queue',
        details: error instanceof Error ? error.message : String(error)
      } as AiAvatarError;
    }
  }

  /**
   * Check queue status
   */
  async checkQueueStatus(requestId: string): Promise<any> {
    try {
      const status = await fal.queue.status(this.modelEndpoint, {
        requestId,
        logs: true,
      });
      return status;
    } catch (error) {
      console.error('Error checking queue status:', error);
      throw {
        error: 'Failed to check queue status',
        details: error instanceof Error ? error.message : String(error)
      } as AiAvatarError;
    }
  }

  /**
   * Get queue result
   */
  async getQueueResult(requestId: string): Promise<AiAvatarOutput> {
    try {
      const result = await fal.queue.result(this.modelEndpoint, {
        requestId,
      });
      return result.data as AiAvatarOutput;
    } catch (error) {
      console.error('Error getting queue result:', error);
      throw {
        error: 'Failed to get queue result',
        details: error instanceof Error ? error.message : String(error)
      } as AiAvatarError;
    }
  }

  /**
   * Calculate estimated cost for avatar generation
   */
  calculateCost(numFrames: number = 145, resolution: AvatarResolutionEnum = '480p'): {
    baseCost: number;
    resolutionMultiplier: number;
    frameMultiplier: number;
    totalCost: number;
  } {
    const baseCostPerSecond = 0.3;
    const resolutionMultiplier = resolution === '720p' ? 2 : 1;
    const frameMultiplier = numFrames > 81 ? 1.25 : 1;
    const totalCost = baseCostPerSecond * resolutionMultiplier * frameMultiplier;

    return {
      baseCost: baseCostPerSecond,
      resolutionMultiplier,
      frameMultiplier,
      totalCost
    };
  }
}
