import { fal } from '@fal-ai/client';

// Style options for video extension
export type PixverseStyleEnum = 'anime' | '3d_animation' | 'day' | 'cyberpunk' | 'comic';

// Resolution options
export type PixverseResolutionEnum = '360p' | '540p' | '720p' | '1080p';

// Duration options
export type PixverseDurationEnum = '5' | '8';

// Model version options
export type PixverseModelEnum = 'v3.5' | 'v4' | 'v4.5' | 'v5';

// Input schema for PixVerse Extend
export interface PixverseExtendInput {
  video_url: string;
  prompt: string;
  negative_prompt?: string;
  style?: PixverseStyleEnum;
  resolution?: PixverseResolutionEnum;
  duration?: PixverseDurationEnum;
  model?: PixverseModelEnum;
  seed?: number;
}

// Output schema for PixVerse Extend
export interface PixverseExtendOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error types
export interface PixverseExtendError {
  error: string;
  details?: string;
}

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/pixverse/extend';

export class PixverseExtendExecutor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  /**
   * Extend video using PixVerse Extend
   */
  async extendVideo(input: PixverseExtendInput): Promise<PixverseExtendOutput> {
    try {
      // Validate required inputs
      if (!input.video_url || !input.prompt) {
        throw new Error('Missing required inputs: video_url and prompt are required');
      }

      // Set defaults
      const requestInput = {
        video_url: input.video_url,
        prompt: input.prompt,
        negative_prompt: input.negative_prompt || '',
        style: input.style || 'day',
        resolution: input.resolution || '720p',
        duration: input.duration || '5',
        model: input.model || 'v4.5',
        seed: input.seed || Math.floor(Math.random() * 1000000)
      };

      // Calculate cost based on resolution and duration
      const costInfo = this.calculateCost(requestInput.resolution, requestInput.duration);
      console.log(`Estimated cost: $${costInfo.totalCost.toFixed(2)}`);
      console.log(`Resolution: ${requestInput.resolution}, Duration: ${requestInput.duration}s`);

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

      return result.data as PixverseExtendOutput;
    } catch (error) {
      console.error('Error extending video:', error);
      throw {
        error: 'Failed to extend video',
        details: error instanceof Error ? error.message : String(error)
      } as PixverseExtendError;
    }
  }

  /**
   * Submit video extension to queue for long-running requests
   */
  async submitToQueue(input: PixverseExtendInput, webhookUrl?: string): Promise<{ request_id: string }> {
    try {
      // Validate required inputs
      if (!input.video_url || !input.prompt) {
        throw new Error('Missing required inputs: video_url and prompt are required');
      }

      // Set defaults
      const requestInput = {
        video_url: input.video_url,
        prompt: input.prompt,
        negative_prompt: input.negative_prompt || '',
        style: input.style || 'day',
        resolution: input.resolution || '720p',
        duration: input.duration || '5',
        model: input.model || 'v4.5',
        seed: input.seed || Math.floor(Math.random() * 1000000)
      };

      // Calculate cost based on resolution and duration
      const costInfo = this.calculateCost(requestInput.resolution, requestInput.duration);
      console.log(`Estimated cost: $${costInfo.totalCost.toFixed(2)}`);
      console.log(`Resolution: ${requestInput.resolution}, Duration: ${requestInput.duration}s`);

      // Submit to queue
      const { request_id } = await fal.queue.submit(this.modelEndpoint, {
        input: requestInput,
        webhookUrl,
      });

      return { request_id };
    } catch (error) {
      console.error('Error submitting video extension to queue:', error);
      throw {
        error: 'Failed to submit video extension to queue',
        details: error instanceof Error ? error.message : String(error)
      } as PixverseExtendError;
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
      } as PixverseExtendError;
    }
  }

  /**
   * Get queue result
   */
  async getQueueResult(requestId: string): Promise<PixverseExtendOutput> {
    try {
      const result = await fal.queue.result(this.modelEndpoint, {
        requestId,
      });
      return result.data as PixverseExtendOutput;
    } catch (error) {
      console.error('Error getting queue result:', error);
      throw {
        error: 'Failed to get queue result',
        details: error instanceof Error ? error.message : String(error)
      } as PixverseExtendError;
    }
  }

  /**
   * Calculate estimated cost for video extension
   */
  calculateCost(resolution: PixverseResolutionEnum, duration: PixverseDurationEnum): {
    baseCost: number;
    resolutionMultiplier: number;
    durationMultiplier: number;
    totalCost: number;
  } {
    // Base cost for 5s video at 360p/540p
    const baseCost = 0.15;
    
    // Resolution multipliers
    const resolutionMultipliers = {
      '360p': 1.0,
      '540p': 1.0,
      '720p': 1.33, // $0.20 / $0.15
      '1080p': 2.67  // $0.40 / $0.15
    };

    // Duration multipliers (8s videos cost double)
    const durationMultipliers = {
      '5': 1.0,
      '8': 2.0
    };

    const resolutionMultiplier = resolutionMultipliers[resolution];
    const durationMultiplier = durationMultipliers[duration];
    const totalCost = baseCost * resolutionMultiplier * durationMultiplier;

    return {
      baseCost,
      resolutionMultiplier,
      durationMultiplier,
      totalCost
    };
  }

  /**
   * Get available styles with descriptions
   */
  getAvailableStyles(): Array<{ value: PixverseStyleEnum; description: string }> {
    return [
      { value: 'anime', description: 'Japanese anime style with vibrant colors and distinctive art' },
      { value: '3d_animation', description: '3D computer-generated animation style' },
      { value: 'day', description: 'Natural daylight style with realistic lighting' },
      { value: 'cyberpunk', description: 'Futuristic, high-tech aesthetic with neon colors' },
      { value: 'comic', description: 'Comic book or graphic novel style' }
    ];
  }

  /**
   * Get available models with descriptions
   */
  getAvailableModels(): Array<{ value: PixverseModelEnum; description: string }> {
    return [
      { value: 'v3.5', description: 'Version 3.5 - Balanced performance and quality' },
      { value: 'v4', description: 'Version 4 - Enhanced quality and features' },
      { value: 'v4.5', description: 'Version 4.5 - Latest stable release (default)' },
      { value: 'v5', description: 'Version 5 - Latest experimental features' }
    ];
  }

  /**
   * Get resolution recommendations based on use case
   */
  getResolutionRecommendations(): Array<{ resolution: PixverseResolutionEnum; useCase: string; cost: string }> {
    return [
      { resolution: '360p', useCase: 'Social media, testing, cost-effective', cost: '$0.15' },
      { resolution: '540p', useCase: 'Web content, moderate quality', cost: '$0.15' },
      { resolution: '720p', useCase: 'Standard quality, most use cases', cost: '$0.20' },
      { resolution: '1080p', useCase: 'High quality, professional content', cost: '$0.40' }
    ];
  }
}
