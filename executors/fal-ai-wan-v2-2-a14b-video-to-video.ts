import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/wan/v2.2-a14b/video-to-video';

// Input interface
export interface FalAiWanV22A14bVideoToVideoInput {
  video_url: string;
  prompt: string;
  strength?: number;
  num_frames?: number;
  frames_per_second?: number;
  negative_prompt?: string;
  seed?: number;
  resolution?: '480p' | '580p' | '720p';
  aspect_ratio?: 'auto' | '16:9' | '9:16' | '1:1';
  num_inference_steps?: number;
  enable_safety_checker?: boolean;
  enable_prompt_expansion?: boolean;
  acceleration?: 'none' | 'regular';
  guidance_scale?: number;
  guidance_scale_2?: number;
  shift?: number;
  interpolator_model?: 'none' | 'film' | 'rife';
  num_interpolated_frames?: number;
  adjust_fps_for_interpolation?: boolean;
  resample_fps?: number;
}

// Output interface
export interface FalAiWanV22A14bVideoToVideoOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error types
export interface FalAiWanV22A14bVideoToVideoError {
  message: string;
  code?: string;
}

// Main executor class
export class FalAiWanV22A14bVideoToVideoExecutor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  /**
   * Generate video from video using fal.subscribe for real-time updates
   */
  async generateVideo(
    input: FalAiWanV22A14bVideoToVideoInput
  ): Promise<FalAiWanV22A14bVideoToVideoOutput> {
    try {
      this.validateInput(input);

      const result = await fal.subscribe(this.modelEndpoint, {
        input,
        pollInterval: 1000, // Poll every second
      });

      return result as unknown as FalAiWanV22A14bVideoToVideoOutput;
    } catch (error) {
      throw {
        message: `Video generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'GENERATION_FAILED',
      } as FalAiWanV22A14bVideoToVideoError;
    }
  }

  /**
   * Submit video generation request to queue for long-running operations
   */
  async submitToQueue(
    input: FalAiWanV22A14bVideoToVideoInput
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
      } as FalAiWanV22A14bVideoToVideoError;
    }
  }

  /**
   * Check the status of a queued request
   */
  static async checkQueueStatus(requestId: string): Promise<any> {
    try {
      const status = await fal.queue.status('fal-ai/wan/v2.2-a14b/video-to-video', { requestId });
      return status;
    } catch (error) {
      throw {
        message: `Failed to check queue status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'STATUS_CHECK_FAILED',
      } as FalAiWanV22A14bVideoToVideoError;
    }
  }

  /**
   * Get the result of a completed queued request
   */
  static async getQueueResult(requestId: string): Promise<FalAiWanV22A14bVideoToVideoOutput> {
    try {
      const result = await fal.queue.result('fal-ai/wan/v2.2-a14b/video-to-video', { requestId });
      return result as unknown as FalAiWanV22A14bVideoToVideoOutput;
    } catch (error) {
      throw {
        message: `Failed to get queue result: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'RESULT_FETCH_FAILED',
      } as FalAiWanV22A14bVideoToVideoError;
    }
  }

  /**
   * Calculate the cost based on video duration and resolution
   */
  calculateCost(durationSeconds: number, resolution: '480p' | '580p' | '720p' = '720p'): number {
    const baseCosts = {
      '480p': 0.04,
      '580p': 0.06,
      '720p': 0.08,
    };

    return baseCosts[resolution] * durationSeconds;
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
  private validateInput(input: FalAiWanV22A14bVideoToVideoInput): void {
    if (!input.video_url) {
      throw new Error('video_url is required');
    }

    if (!input.prompt) {
      throw new Error('prompt is required');
    }

    if (input.prompt.length > 1000) {
      throw new Error('prompt must be 1000 characters or less');
    }

    if (input.strength !== undefined && (input.strength < 0 || input.strength > 1)) {
      throw new Error('strength must be between 0 and 1');
    }

    if (input.num_frames !== undefined && (input.num_frames < 81 || input.num_frames > 121)) {
      throw new Error('num_frames must be between 81 and 121');
    }

    if (input.frames_per_second !== undefined && (input.frames_per_second < 4 || input.frames_per_second > 60)) {
      throw new Error('frames_per_second must be between 4 and 60');
    }

    if (input.negative_prompt && input.negative_prompt.length > 1000) {
      throw new Error('negative_prompt must be 1000 characters or less');
    }

    if (input.num_inference_steps !== undefined && (input.num_inference_steps < 1 || input.num_inference_steps > 50)) {
      throw new Error('num_inference_steps must be between 1 and 50');
    }

    if (input.guidance_scale !== undefined && (input.guidance_scale < 0 || input.guidance_scale > 20)) {
      throw new Error('guidance_scale must be between 0 and 20');
    }

    if (input.guidance_scale_2 !== undefined && (input.guidance_scale_2 < 0 || input.guidance_scale_2 > 20)) {
      throw new Error('guidance_scale_2 must be between 0 and 20');
    }

    if (input.shift !== undefined && (input.shift < 0 || input.shift > 1)) {
      throw new Error('shift must be between 0 and 1');
    }

    if (input.num_interpolated_frames !== undefined && (input.num_interpolated_frames < 0 || input.num_interpolated_frames > 4)) {
      throw new Error('num_interpolated_frames must be between 0 and 4');
    }

    if (input.resample_fps !== undefined && (input.resample_fps < 1 || input.resample_fps > 60)) {
      throw new Error('resample_fps must be between 1 and 60');
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
   * Get strength parameter recommendations
   */
  static getStrengthRecommendations() {
    return {
      '0.1-0.3': 'Subtle modifications, preserve original video structure',
      '0.4-0.6': 'Moderate changes, good balance of preservation and transformation',
      '0.7-0.9': 'Significant transformations, more creative freedom',
      '1.0': 'Maximum transformation, original video heavily modified',
    };
  }

  /**
   * Get prompt writing tips for video-to-video
   */
  static getPromptWritingTips() {
    return [
      'Describe the desired visual style and mood',
      'Mention specific objects, actions, or scenes you want to see',
      'Use descriptive adjectives for colors, lighting, and atmosphere',
      'Reference artistic styles or cinematic techniques',
      'Be specific about what should change vs. what should remain',
      'Consider the temporal aspect - describe motion and transitions',
    ];
  }

  /**
   * Get common use cases for video-to-video generation
   */
  static getCommonUseCases() {
    return [
      'Style transfer and artistic transformations',
      'Background replacement and scene modification',
      'Object addition, removal, or modification',
      'Color grading and visual effects',
      'Temporal editing and motion modification',
      'Creative video art and experimental content',
      'Marketing and advertising content adaptation',
      'Educational content enhancement',
    ];
  }

  /**
   * Get technical considerations for video-to-video
   */
  static getTechnicalConsiderations() {
    return [
      'Higher strength values require more processing time',
      'Resolution affects both quality and cost significantly',
      'Frame interpolation can smooth motion but increase processing time',
      'Safety checker may filter certain content types',
      'Prompt expansion can enhance results but may increase cost',
      'Seed values enable reproducible results',
      'Guidance scales affect adherence to prompts vs. creativity',
    ];
  }

  /**
   * Get cost examples for different scenarios
   */
  getCostExamples() {
    return [
      {
        duration: 3,
        resolution: '480p',
        cost: this.calculateCost(3, '480p'),
        description: '3-second video at 480p',
      },
      {
        duration: 5,
        resolution: '580p',
        cost: this.calculateCost(5, '580p'),
        description: '5-second video at 580p',
      },
      {
        duration: 10,
        resolution: '720p',
        cost: this.calculateCost(10, '720p'),
        description: '10-second video at 720p',
      },
      {
        duration: 15,
        resolution: '720p',
        cost: this.calculateCost(15, '720p'),
        description: '15-second video at 720p',
      },
    ];
  }

  /**
   * Get performance optimization tips
   */
  static getPerformanceOptimizationTips() {
    return [
      'Use lower resolutions for testing and iterations',
      'Start with moderate strength values (0.4-0.6)',
      'Limit frame count for faster processing',
      'Use regular acceleration when available',
      'Disable safety checker for faster processing (if appropriate)',
      'Use seed values for reproducible results during development',
      'Consider queue processing for longer videos',
    ];
  }

  /**
   * Get troubleshooting tips
   */
  static getTroubleshootingTips() {
    return [
      'If generation fails, try reducing strength or frame count',
      'For poor quality, increase resolution and inference steps',
      'If motion is too fast/slow, adjust frames_per_second',
      'For inconsistent results, use specific seed values',
      'If content is filtered, check safety checker settings',
      'For slow processing, use lower resolution or enable acceleration',
      'If prompt not followed, increase guidance scale',
    ];
  }
}
