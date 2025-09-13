import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/luma-dream-machine/ray-2-flash/modify';

// Input interface
export interface LumaDreamMachineRay2FlashModifyInput {
  video_url: string;
  image_url?: string;
  prompt?: string;
  mode?: 'adhere_1' | 'adhere_2' | 'adhere_3' | 'flex_1' | 'flex_2' | 'flex_3' | 'reimagine_1' | 'reimagine_2' | 'reimagine_3';
}

// Output interface
export interface LumaDreamMachineRay2FlashModifyOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
    file_data?: string;
  };
}

// Error types
export interface LumaDreamMachineRay2FlashModifyError {
  message: string;
  code?: string;
  details?: any;
}

// Executor class
export class LumaDreamMachineRay2FlashModifyExecutor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  /**
   * Generate a modified video using Ray2 Flash Modify
   * @param input - Input parameters for video modification
   * @returns Promise with the generated video result
   */
  async generateVideo(input: LumaDreamMachineRay2FlashModifyInput): Promise<LumaDreamMachineRay2FlashModifyOutput> {
    try {
      // Validate required inputs
      if (!input.video_url) {
        throw new Error('video_url is required');
      }

      // Validate video URL format
      if (!this.isValidUrl(input.video_url)) {
        throw new Error('Invalid video_url format');
      }

      // Validate image URL if provided
      if (input.image_url && !this.isValidUrl(input.image_url)) {
        throw new Error('Invalid image_url format');
      }

      // Validate prompt length if provided
      if (input.prompt && input.prompt.length > 1000) {
        throw new Error('Prompt must be 1000 characters or less');
      }

      const result = await fal.subscribe(this.modelEndpoint, {
        input: {
          video_url: input.video_url,
          ...(input.image_url && { image_url: input.image_url }),
          ...(input.prompt && { prompt: input.prompt }),
          ...(input.mode && { mode: input.mode }),
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            update.logs?.map((log) => log.message).forEach(console.log);
          }
        },
      });

      return result.data as LumaDreamMachineRay2FlashModifyOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Video modification failed: ${errorMessage}`);
    }
  }

  /**
   * Submit a video modification request to the queue
   * @param input - Input parameters for video modification
   * @param webhookUrl - Optional webhook URL for notifications
   * @returns Promise with the request ID
   */
  async submitToQueue(
    input: LumaDreamMachineRay2FlashModifyInput,
    webhookUrl?: string
  ): Promise<{ request_id: string }> {
    try {
      // Validate required inputs
      if (!input.video_url) {
        throw new Error('video_url is required');
      }

      // Validate video URL format
      if (!this.isValidUrl(input.video_url)) {
        throw new Error('Invalid video_url format');
      }

      // Validate image URL if provided
      if (input.image_url && !this.isValidUrl(input.image_url)) {
        throw new Error('Invalid image_url format');
      }

      // Validate prompt length if provided
      if (input.prompt && input.prompt.length > 1000) {
        throw new Error('Prompt must be 1000 characters or less');
      }

      const { request_id } = await fal.queue.submit(this.modelEndpoint, {
        input: {
          video_url: input.video_url,
          ...(input.image_url && { image_url: input.image_url }),
          ...(input.prompt && { prompt: input.prompt }),
          ...(input.mode && { mode: input.mode }),
        },
        ...(webhookUrl && { webhookUrl }),
      });

      return { request_id };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Queue submission failed: ${errorMessage}`);
    }
  }

  /**
   * Check the status of a queued request
   * @param requestId - The request ID to check
   * @param includeLogs - Whether to include logs in the response
   * @returns Promise with the request status
   */
  static async checkQueueStatus(
    requestId: string,
    includeLogs = false
  ): Promise<any> {
    try {
      const status = await fal.queue.status(MODEL_ENDPOINT, {
        requestId,
        logs: includeLogs,
      });
      return status;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Status check failed: ${errorMessage}`);
    }
  }

  /**
   * Get the result of a completed queued request
   * @param requestId - The request ID to get results for
   * @returns Promise with the request result
   */
  static async getQueueResult(requestId: string): Promise<LumaDreamMachineRay2FlashModifyOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });
      return result.data as LumaDreamMachineRay2FlashModifyOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Result retrieval failed: ${errorMessage}`);
    }
  }

  /**
   * Calculate the estimated cost for video modification
   * @param videoDurationSeconds - Duration of the input video in seconds
   * @returns Estimated cost in USD
   */
  calculateCost(videoDurationSeconds: number): number {
    if (videoDurationSeconds <= 0) {
      throw new Error('Video duration must be greater than 0');
    }

    // Base cost: $0.12 per second
    const baseCost = 0.12;
    return videoDurationSeconds * baseCost;
  }

  /**
   * Get available modification modes
   * @returns Array of available modification modes
   */
  getAvailableModes(): Array<{ value: string; description: string }> {
    return [
      { value: 'adhere_1', description: 'Least amount of modification - minimal changes' },
      { value: 'adhere_2', description: 'Low modification - subtle changes' },
      { value: 'adhere_3', description: 'Medium-low modification - moderate changes' },
      { value: 'flex_1', description: 'Medium modification - balanced changes' },
      { value: 'flex_2', description: 'Medium-high modification - significant changes' },
      { value: 'flex_3', description: 'High modification - substantial changes' },
      { value: 'reimagine_1', description: 'Very high modification - major changes' },
      { value: 'reimagine_2', description: 'Extreme modification - dramatic changes' },
      { value: 'reimagine_3', description: 'Maximum modification - complete transformation' },
    ];
  }

  /**
   * Get modification mode recommendations based on use case
   * @param useCase - The intended use case for the modification
   * @returns Recommended modification mode
   */
  getModeRecommendation(useCase: string): string {
    const useCaseLower = useCase.toLowerCase();
    
    if (useCaseLower.includes('subtle') || useCaseLower.includes('minor') || useCaseLower.includes('preserve')) {
      return 'adhere_1';
    } else if (useCaseLower.includes('style') || useCaseLower.includes('aesthetic') || useCaseLower.includes('enhance')) {
      return 'flex_2';
    } else if (useCaseLower.includes('transform') || useCaseLower.includes('complete') || useCaseLower.includes('reimagine')) {
      return 'reimagine_2';
    } else if (useCaseLower.includes('moderate') || useCaseLower.includes('balanced')) {
      return 'flex_1';
    } else {
      return 'flex_1'; // Default recommendation
    }
  }

  /**
   * Get prompt writing tips for better results
   * @returns Array of prompt writing tips
   */
  getPromptWritingTips(): string[] {
    return [
      'Be specific about the desired style or aesthetic change',
      'Mention specific elements you want to modify (clothing, background, lighting, etc.)',
      'Use descriptive adjectives for the desired outcome',
      'Consider the mood or atmosphere you want to create',
      'Be clear about what should remain unchanged',
      'Use art style references when applicable (e.g., "cinematic", "anime style", "oil painting")',
      'Keep prompts concise but descriptive (under 1000 characters)',
      'Test with different modification modes to find the right balance',
    ];
  }

  /**
   * Get common use cases for video modification
   * @returns Array of common use cases
   */
  getCommonUseCases(): string[] {
    return [
      'Style transfer (live-action to animation, painting style, etc.)',
      'Wardrobe and prop changes',
      'Background and environment modifications',
      'Lighting and color grading adjustments',
      'Time period transformations (modern to vintage, etc.)',
      'Weather and atmospheric changes',
      'Artistic style applications',
      'Brand and marketing customization',
      'Educational content adaptation',
      'Entertainment and creative projects',
    ];
  }

  /**
   * Get technical considerations and limitations
   * @returns Array of technical considerations
   */
  getTechnicalConsiderations(): string[] {
    return [
      'Input video should be clear and well-lit for best results',
      'Longer videos may take more time to process',
      'Complex modifications may require higher modification modes',
      'Results depend on the quality and content of the input video',
      'Some modifications may affect video motion and timing',
      'Consider the aspect ratio and resolution of your input video',
      'Test with shorter clips before processing longer videos',
      'Ensure your input video is publicly accessible via URL',
    ];
  }

  /**
   * Validate URL format
   * @param url - URL to validate
   * @returns Whether the URL is valid
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get cost examples for different video durations
   * @returns Array of cost examples
   */
  getCostExamples(): Array<{ duration: string; cost: number; description: string }> {
    return [
      { duration: '5 seconds', cost: 0.60, description: 'Short clip modification' },
      { duration: '10 seconds', cost: 1.20, description: 'Medium clip modification' },
      { duration: '30 seconds', cost: 3.60, description: 'Long clip modification' },
      { duration: '60 seconds', cost: 7.20, description: '1-minute video modification' },
      { duration: '120 seconds', cost: 14.40, description: '2-minute video modification' },
    ];
  }

  /**
   * Get performance optimization tips
   * @returns Array of optimization tips
   */
  getOptimizationTips(): string[] {
    return [
      'Start with lower modification modes and increase if needed',
      'Use shorter video clips for testing and iteration',
      'Provide clear, specific prompts for better results',
      'Consider the input video quality and resolution',
      'Use appropriate modification modes for your use case',
      'Test with different prompts to find the best approach',
      'Monitor processing times for longer videos',
      'Use webhooks for long-running modifications',
    ];
  }
}
