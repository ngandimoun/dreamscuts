import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/minimax/hailuo-02-fast/image-to-video';

// Input interface
export interface FalAiMinimaxHailuo02FastImageToVideoInput {
  prompt: string;
  image_url: string;
  duration?: '6' | '10';
  prompt_optimizer?: boolean;
}

// Output interface
export interface FalAiMinimaxHailuo02FastImageToVideoOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error types
export interface FalAiMinimaxHailuo02FastImageToVideoError {
  message: string;
  code?: string;
}

// Main executor class
export class FalAiMinimaxHailuo02FastImageToVideoExecutor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  /**
   * Generate video from image using fal.subscribe for real-time updates
   */
  async generateVideo(
    input: FalAiMinimaxHailuo02FastImageToVideoInput
  ): Promise<FalAiMinimaxHailuo02FastImageToVideoOutput> {
    try {
      this.validateInput(input);

      const result = await fal.subscribe(this.modelEndpoint, {
        input,
        pollInterval: 1000, // Poll every second
      });

      return result as unknown as FalAiMinimaxHailuo02FastImageToVideoOutput;
    } catch (error) {
      throw {
        message: `Video generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'GENERATION_FAILED',
      } as FalAiMinimaxHailuo02FastImageToVideoError;
    }
  }

  /**
   * Submit video generation request to queue for long-running operations
   */
  async submitToQueue(
    input: FalAiMinimaxHailuo02FastImageToVideoInput
  ): Promise<{ request_id: string }> {
    try {
      this.validateInput(input);

      const result = await fal.queue.submit(this.modelEndpoint, {
        input,
      });

      return { request_id: result.request_id };
    } catch (error) {
      throw {
        message: `Failed to submit to queue: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'QUEUE_SUBMIT_FAILED',
      } as FalAiMinimaxHailuo02FastImageToVideoError;
    }
  }

  /**
   * Check the status of a queued request
   */
  static async checkQueueStatus(requestId: string): Promise<any> {
    try {
      const status = await fal.queue.status('fal-ai/minimax/hailuo-02-fast/image-to-video', { requestId });
      return status;
    } catch (error) {
      throw {
        message: `Failed to check queue status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'STATUS_CHECK_FAILED',
      } as FalAiMinimaxHailuo02FastImageToVideoError;
    }
  }

  /**
   * Get the result of a completed queued request
   */
  static async getQueueResult(requestId: string): Promise<FalAiMinimaxHailuo02FastImageToVideoOutput> {
    try {
      const result = await fal.queue.result('fal-ai/minimax/hailuo-02-fast/image-to-video', { requestId });
      return result as unknown as FalAiMinimaxHailuo02FastImageToVideoOutput;
    } catch (error) {
      throw {
        message: `Failed to get queue result: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'RESULT_FETCH_FAILED',
      } as FalAiMinimaxHailuo02FastImageToVideoError;
    }
  }

  /**
   * Calculate the cost based on duration
   */
  calculateCost(durationSeconds: number): number {
    const costPerSecond = 0.017;
    return costPerSecond * durationSeconds;
  }

  /**
   * Get duration options and their costs
   */
  getDurationOptions() {
    return [
      {
        duration: 6,
        cost: this.calculateCost(6),
        description: '6-second video',
      },
      {
        duration: 10,
        cost: this.calculateCost(10),
        description: '10-second video',
      },
    ];
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: FalAiMinimaxHailuo02FastImageToVideoInput): void {
    if (!input.prompt) {
      throw new Error('prompt is required');
    }

    if (input.prompt.length > 1000) {
      throw new Error('prompt must be 1000 characters or less');
    }

    if (!input.image_url) {
      throw new Error('image_url is required');
    }

    if (input.duration && !['6', '10'].includes(input.duration)) {
      throw new Error('duration must be either "6" or "10"');
    }
  }

  /**
   * Get duration recommendations based on use case
   */
  static getDurationRecommendations() {
    return {
      '6': 'Good for social media, quick demonstrations, and testing',
      '10': 'Better for storytelling, product showcases, and detailed content',
    };
  }

  /**
   * Get prompt writing tips for image-to-video
   */
  static getPromptWritingTips() {
    return [
      'Describe the desired motion and action clearly',
      'Mention specific movements or transformations you want to see',
      'Use descriptive adjectives for the desired outcome',
      'Reference the original image content in your prompt',
      'Be specific about what should change vs. what should remain',
      'Consider the temporal aspect - describe the sequence of events',
      'Use action verbs to describe the desired movement',
      'Mention any specific effects or visual elements you want',
    ];
  }

  /**
   * Get common use cases for image-to-video generation
   */
  static getCommonUseCases() {
    return [
      'Social media content creation from photos',
      'Product demonstration videos',
      'Character animation and storytelling',
      'Marketing material enhancement',
      'Educational content creation',
      'Entertainment and creative content',
      'Portrait animation and expression changes',
      'Object transformation and motion',
      'Art and design visualization',
      'Content for streaming platforms',
    ];
  }

  /**
   * Get technical considerations for image-to-video
   */
  static getTechnicalConsiderations() {
    return [
      'Fixed 512p resolution for consistent quality and cost',
      'Duration affects both content length and cost',
      'Prompt optimizer can enhance results automatically',
      'Image quality affects final video quality',
      'Processing time increases with longer durations',
      'Cost is directly proportional to video duration',
      'Fast processing optimized for quick iterations',
    ];
  }

  /**
   * Get cost examples for different scenarios
   */
  getCostExamples() {
    return [
      {
        duration: 6,
        cost: this.calculateCost(6),
        description: '6-second video at 512p',
      },
      {
        duration: 10,
        cost: this.calculateCost(10),
        description: '10-second video at 512p',
      },
    ];
  }

  /**
   * Get performance optimization tips
   */
  static getPerformanceOptimizationTips() {
    return [
      'Use 6-second duration for testing and quick iterations',
      'Enable prompt optimizer for better results',
      'Provide clear, descriptive prompts',
      'Use high-quality input images',
      'Consider queue processing for longer videos',
      'Leverage the fast processing for quick iterations',
      'Use appropriate image formats and sizes',
    ];
  }

  /**
   * Get troubleshooting tips
   */
  static getTroubleshootingTips() {
    return [
      'If generation fails, try simplifying the prompt',
      'For poor quality, check input image resolution and clarity',
      'If motion is not as expected, be more specific in the prompt',
      'For inconsistent results, enable prompt optimizer',
      'If processing is slow, use shorter duration',
      'Ensure input image URL is accessible and valid',
      'Check that prompt describes desired motion clearly',
    ];
  }

  /**
   * Get model-specific advantages
   */
  static getModelAdvantages() {
    return [
      'Fast processing optimized for quick iterations',
      'Cost-effective at $0.017 per second',
      'Consistent 512p resolution quality',
      'Built-in prompt optimizer for better results',
      'Support for both 6 and 10 second durations',
      'Efficient image-to-video transformation',
      'Reliable and stable generation process',
    ];
  }

  /**
   * Get image preparation tips
   */
  static getImagePreparationTips() {
    return [
      'Use high-quality images with clear subjects',
      'Ensure good lighting and contrast in the source image',
      'Choose images with interesting subjects that can be animated',
      'Avoid images with too many complex elements',
      'Use images with clear focal points',
      'Consider the aspect ratio and composition',
      'Ensure the image is publicly accessible via URL',
    ];
  }
}
