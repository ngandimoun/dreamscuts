import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/wan/v2.2-5b/text-to-video/fast-wan';

// Input interface
export interface FalAiWanV225bTextToVideoFastWanInput {
  prompt: string;
  negative_prompt?: string;
  num_frames?: number;
  frames_per_second?: number;
  seed?: number;
  resolution?: '480p' | '580p' | '720p';
  aspect_ratio?: '16:9' | '9:16' | '1:1';
  enable_safety_checker?: boolean;
  enable_prompt_expansion?: boolean;
  guidance_scale?: number;
  interpolator_model?: 'none' | 'film' | 'rife';
  num_interpolated_frames?: number;
  adjust_fps_for_interpolation?: boolean;
}

// Output interface
export interface FalAiWanV225bTextToVideoFastWanOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  prompt: string;
  seed: number;
}

// Error types
export interface FalAiWanV225bTextToVideoFastWanError {
  message: string;
  code?: string;
}

// Main executor class
export class FalAiWanV225bTextToVideoFastWanExecutor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  /**
   * Generate video from text using fal.subscribe for real-time updates
   */
  async generateVideo(
    input: FalAiWanV225bTextToVideoFastWanInput
  ): Promise<FalAiWanV225bTextToVideoFastWanOutput> {
    try {
      this.validateInput(input);

      const result = await fal.subscribe(this.modelEndpoint, {
        input,
        pollInterval: 1000, // Poll every second
      });

      return result as unknown as FalAiWanV225bTextToVideoFastWanOutput;
    } catch (error) {
      throw {
        message: `Video generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'GENERATION_FAILED',
      } as FalAiWanV225bTextToVideoFastWanError;
    }
  }

  /**
   * Submit video generation request to queue for long-running operations
   */
  async submitToQueue(
    input: FalAiWanV225bTextToVideoFastWanInput
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
      } as FalAiWanV225bTextToVideoFastWanError;
    }
  }

  /**
   * Check the status of a queued request
   */
  static async checkQueueStatus(requestId: string): Promise<any> {
    try {
      const status = await fal.queue.status('fal-ai/wan/v2.2-5b/text-to-video/fast-wan', { requestId });
      return status;
    } catch (error) {
      throw {
        message: `Failed to check queue status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'STATUS_CHECK_FAILED',
      } as FalAiWanV225bTextToVideoFastWanError;
    }
  }

  /**
   * Get the result of a completed queued request
   */
  static async getQueueResult(requestId: string): Promise<FalAiWanV225bTextToVideoFastWanOutput> {
    try {
      const result = await fal.queue.result('fal-ai/wan/v2.2-5b/text-to-video/fast-wan', { requestId });
      return result as unknown as FalAiWanV225bTextToVideoFastWanOutput;
    } catch (error) {
      throw {
        message: `Failed to get queue result: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'RESULT_FETCH_FAILED',
      } as FalAiWanV225bTextToVideoFastWanError;
    }
  }

  /**
   * Calculate the cost based on resolution
   */
  calculateCost(resolution: '480p' | '580p' | '720p' = '720p'): number {
    const baseCosts = {
      '480p': 0.0125,
      '580p': 0.01875,
      '720p': 0.025,
    };

    return baseCosts[resolution];
  }

  /**
   * Estimate video duration based on frames and FPS
   */
  estimateDuration(numFrames: number, fps: number): number {
    return numFrames / fps;
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: FalAiWanV225bTextToVideoFastWanInput): void {
    if (!input.prompt) {
      throw new Error('prompt is required');
    }

    if (input.prompt.length > 1000) {
      throw new Error('prompt must be 1000 characters or less');
    }

    if (input.negative_prompt && input.negative_prompt.length > 1000) {
      throw new Error('negative_prompt must be 1000 characters or less');
    }

    if (input.num_frames !== undefined && (input.num_frames < 81 || input.num_frames > 121)) {
      throw new Error('num_frames must be between 81 and 121');
    }

    if (input.frames_per_second !== undefined && (input.frames_per_second < 4 || input.frames_per_second > 60)) {
      throw new Error('frames_per_second must be between 4 and 60');
    }

    if (input.guidance_scale !== undefined && (input.guidance_scale < 0 || input.guidance_scale > 20)) {
      throw new Error('guidance_scale must be between 0 and 20');
    }

    if (input.num_interpolated_frames !== undefined && (input.num_interpolated_frames < 0 || input.num_interpolated_frames > 4)) {
      throw new Error('num_interpolated_frames must be between 0 and 4');
    }
  }

  /**
   * Get resolution recommendations based on use case
   */
  static getResolutionRecommendations() {
    return {
      '480p': 'Good for social media, web previews, and quick iterations',
      '580p': 'Balanced quality and cost for most use cases',
      '720p': 'High quality for professional content and final outputs',
    };
  }

  /**
   * Get guidance scale recommendations
   */
  static getGuidanceScaleRecommendations() {
    return {
      '1.0-2.0': 'Lower adherence to prompt, more creative freedom',
      '2.5-4.0': 'Balanced adherence and creativity (recommended)',
      '4.5-6.0': 'Higher adherence to prompt, less creative variation',
      '6.5+': 'Very strict adherence to prompt, minimal creativity',
    };
  }

  /**
   * Get prompt writing tips for text-to-video
   */
  static getPromptWritingTips() {
    return [
      'Describe the scene, setting, and atmosphere in detail',
      'Mention specific objects, characters, and their actions',
      'Use descriptive adjectives for colors, lighting, and mood',
      'Reference cinematic techniques and camera movements',
      'Be specific about timing and motion sequences',
      'Consider the visual flow and transitions between scenes',
      'Include environmental details and background elements',
      'Describe character expressions and body language',
    ];
  }

  /**
   * Get common use cases for text-to-video generation
   */
  static getCommonUseCases() {
    return [
      'Marketing and advertising content creation',
      'Social media video content',
      'Product demonstration videos',
      'Educational and training content',
      'Storytelling and narrative videos',
      'Brand storytelling and corporate content',
      'Entertainment and creative content',
      'Professional presentation enhancement',
      'Content for streaming platforms',
      'Video content for websites and apps',
    ];
  }

  /**
   * Get technical considerations for text-to-video
   */
  static getTechnicalConsiderations() {
    return [
      'Higher frame counts require more processing time',
      'Resolution affects both quality and cost significantly',
      'Frame interpolation can smooth motion but increase processing time',
      'Safety checker may filter certain content types',
      'Prompt expansion can enhance results but may increase cost',
      'Seed values enable reproducible results',
      'Guidance scale affects adherence to prompts vs. creativity',
      'Fast processing with 5B parameter model',
    ];
  }

  /**
   * Get cost examples for different scenarios
   */
  getCostExamples() {
    return [
      {
        resolution: '480p',
        cost: this.calculateCost('480p'),
        description: '480p video output',
      },
      {
        resolution: '580p',
        cost: this.calculateCost('580p'),
        description: '580p video output',
      },
      {
        resolution: '720p',
        cost: this.calculateCost('720p'),
        description: '720p video output (recommended)',
      },
    ];
  }

  /**
   * Get performance optimization tips
   */
  static getPerformanceOptimizationTips() {
    return [
      'Use lower resolutions for testing and iterations',
      'Start with moderate guidance scale values (2.5-4.0)',
      'Limit frame count for faster processing',
      'Use frame interpolation for smoother motion',
      'Disable safety checker for faster processing (if appropriate)',
      'Use seed values for reproducible results during development',
      'Consider queue processing for longer videos',
      'Leverage the fast 5B model for quick iterations',
    ];
  }

  /**
   * Get troubleshooting tips
   */
  static getTroubleshootingTips() {
    return [
      'If generation fails, try reducing frame count or guidance scale',
      'For poor quality, increase resolution and use more frames',
      'If motion is too fast/slow, adjust frames_per_second',
      'For inconsistent results, use specific seed values',
      'If content is filtered, check safety checker settings',
      'For slow processing, use lower resolution or fewer frames',
      'If prompt not followed, increase guidance scale',
      'Use frame interpolation for smoother motion',
    ];
  }

  /**
   * Get model-specific advantages
   */
  static getModelAdvantages() {
    return [
      'Fast processing with 5B parameter model',
      'High-quality 720p output capability',
      'Fluid motion generation at 24FPS',
      'Powerful prompt understanding',
      'Cost-effective per-video pricing',
      'Support for multiple aspect ratios',
      'Frame interpolation options',
      'Safety checker integration',
    ];
  }
}
