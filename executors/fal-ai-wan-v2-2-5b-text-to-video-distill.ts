import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/wan/v2.2-5b/text-to-video/distill';

// Input interface
export interface FalAiWanV225bTextToVideoDistillInput {
  prompt: string;
  num_frames?: number;
  frames_per_second?: number;
  seed?: number;
  resolution?: '580p' | '720p';
  aspect_ratio?: '16:9' | '9:16' | '1:1';
  num_inference_steps?: number;
  enable_safety_checker?: boolean;
  enable_prompt_expansion?: boolean;
  guidance_scale?: number;
  shift?: number;
  interpolator_model?: 'none' | 'film' | 'rife';
  num_interpolated_frames?: number;
  adjust_fps_for_interpolation?: boolean;
}

// Output interface
export interface FalAiWanV225bTextToVideoDistillOutput {
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
export interface FalAiWanV225bTextToVideoDistillError {
  message: string;
  code?: string;
}

// Main executor class
export class FalAiWanV225bTextToVideoDistillExecutor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  /**
   * Generate video from text using fal.subscribe for real-time updates
   */
  async generateVideo(
    input: FalAiWanV225bTextToVideoDistillInput
  ): Promise<FalAiWanV225bTextToVideoDistillOutput> {
    try {
      this.validateInput(input);

      const result = await fal.subscribe(this.modelEndpoint, {
        input,
        pollInterval: 1000, // Poll every second
      });

      return result as unknown as FalAiWanV225bTextToVideoDistillOutput;
    } catch (error) {
      throw {
        message: `Video generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'GENERATION_FAILED',
      } as FalAiWanV225bTextToVideoDistillError;
    }
  }

  /**
   * Submit video generation request to queue for long-running operations
   */
  async submitToQueue(
    input: FalAiWanV225bTextToVideoDistillInput
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
      } as FalAiWanV225bTextToVideoDistillError;
    }
  }

  /**
   * Check the status of a queued request
   */
  static async checkQueueStatus(requestId: string): Promise<any> {
    try {
      const status = await fal.queue.status('fal-ai/wan/v2.2-5b/text-to-video/distill', { requestId });
      return status;
    } catch (error) {
      throw {
        message: `Failed to check queue status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'STATUS_CHECK_FAILED',
      } as FalAiWanV225bTextToVideoDistillError;
    }
  }

  /**
   * Get the result of a completed queued request
   */
  static async getQueueResult(requestId: string): Promise<FalAiWanV225bTextToVideoDistillOutput> {
    try {
      const result = await fal.queue.result('fal-ai/wan/v2.2-5b/text-to-video/distill', { requestId });
      return result as unknown as FalAiWanV225bTextToVideoDistillOutput;
    } catch (error) {
      throw {
        message: `Failed to get queue result: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'RESULT_FETCH_FAILED',
      } as FalAiWanV225bTextToVideoDistillError;
    }
  }

  /**
   * Calculate the cost - fixed per video
   */
  calculateCost(): number {
    return 0.08; // Fixed cost per video
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
  private validateInput(input: FalAiWanV225bTextToVideoDistillInput): void {
    if (!input.prompt) {
      throw new Error('prompt is required');
    }

    if (input.prompt.length > 1000) {
      throw new Error('prompt must be 1000 characters or less');
    }

    if (input.num_frames !== undefined && (input.num_frames < 81 || input.num_frames > 121)) {
      throw new Error('num_frames must be between 81 and 121');
    }

    if (input.frames_per_second !== undefined && (input.frames_per_second < 4 || input.frames_per_second > 60)) {
      throw new Error('frames_per_second must be between 4 and 60');
    }

    if (input.num_inference_steps !== undefined && (input.num_inference_steps < 1 || input.num_inference_steps > 100)) {
      throw new Error('num_inference_steps must be between 1 and 100');
    }

    if (input.guidance_scale !== undefined && (input.guidance_scale < 0 || input.guidance_scale > 20)) {
      throw new Error('guidance_scale must be between 0 and 20');
    }

    if (input.shift !== undefined && (input.shift < 1.0 || input.shift > 10.0)) {
      throw new Error('shift must be between 1.0 and 10.0');
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
      '580p': 'Good for social media, web previews, and quick iterations',
      '720p': 'High quality for professional content and final outputs (recommended)',
    };
  }

  /**
   * Get guidance scale recommendations
   */
  static getGuidanceScaleRecommendations() {
    return {
      '0.5-1.0': 'Lower adherence to prompt, more creative freedom',
      '1.0-2.0': 'Balanced adherence and creativity (recommended)',
      '2.0-3.0': 'Higher adherence to prompt, less creative variation',
      '3.0+': 'Very strict adherence to prompt, minimal creativity',
    };
  }

  /**
   * Get inference steps recommendations
   */
  static getInferenceStepsRecommendations() {
    return {
      '20-30': 'Fast generation, lower quality',
      '40-50': 'Balanced quality and speed (recommended)',
      '60-80': 'Higher quality, slower generation',
      '80+': 'Maximum quality, slowest generation',
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
      'Use the example prompt as a reference for detailed descriptions',
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
      'Character and scene visualization',
      'Cinematic content creation',
    ];
  }

  /**
   * Get technical considerations for text-to-video
   */
  static getTechnicalConsiderations() {
    return [
      'Higher frame counts require more processing time',
      'Resolution affects quality significantly (580p vs 720p)',
      'Frame interpolation can smooth motion but increase processing time',
      'Safety checker may filter certain content types',
      'Prompt expansion can enhance results but may increase cost',
      'Seed values enable reproducible results',
      'Guidance scale affects adherence to prompts vs. creativity',
      'Inference steps balance quality vs. speed',
      'Shift parameter affects video dynamics',
      'Distilled model optimized for efficiency',
    ];
  }

  /**
   * Get cost examples for different scenarios
   */
  getCostExamples() {
    return [
      {
        cost: this.calculateCost(),
        description: 'Fixed cost per video regardless of parameters',
        note: 'Cost is $0.08 per video, independent of resolution, frames, or duration',
      },
    ];
  }

  /**
   * Get performance optimization tips
   */
  static getPerformanceOptimizationTips() {
    return [
      'Use 580p resolution for faster processing and testing',
      'Start with moderate inference steps (40-50) for balanced results',
      'Limit frame count for faster processing',
      'Use frame interpolation for smoother motion',
      'Disable safety checker for faster processing (if appropriate)',
      'Use seed values for reproducible results during development',
      'Consider queue processing for longer videos',
      'Leverage the distilled model for efficient processing',
      'Balance guidance scale between 1.0-2.0 for optimal results',
    ];
  }

  /**
   * Get troubleshooting tips
   */
  static getTroubleshootingTips() {
    return [
      'If generation fails, try reducing frame count or inference steps',
      'For poor quality, increase resolution and inference steps',
      'If motion is too fast/slow, adjust frames_per_second',
      'For inconsistent results, use specific seed values',
      'If content is filtered, check safety checker settings',
      'For slow processing, use lower resolution or fewer frames',
      'If prompt not followed, adjust guidance scale',
      'Use frame interpolation for smoother motion',
      'Experiment with shift parameter for different video dynamics',
    ];
  }

  /**
   * Get model-specific advantages
   */
  static getModelAdvantages() {
    return [
      'Distilled model optimized for efficiency and speed',
      'High-quality 720p output capability',
      'Fluid motion generation at up to 60 FPS',
      'Powerful prompt understanding and interpretation',
      'Fixed cost per video for predictable pricing',
      'Support for multiple aspect ratios',
      'Frame interpolation options for smooth motion',
      'Safety checker integration for content moderation',
      'Prompt expansion capabilities for enhanced results',
      'Flexible inference step control for quality/speed balance',
    ];
  }

  /**
   * Get example prompt for reference
   */
  static getExamplePrompt() {
    return {
      prompt: 'A medium shot establishes a modern, minimalist office setting: clean lines, muted grey walls, and polished wood surfaces. The focus shifts to a close-up on a woman in sharp, navy blue business attire. Her crisp white blouse contrasts with the deep blue of her tailored suit jacket. The subtle texture of the fabric is visible—a fine weave with a slight sheen. Her expression is serious, yet engaging, as she speaks to someone unseen just beyond the frame. Close-up on her eyes, showing the intensity of her gaze and the fine lines around them that hint at experience and focus. Her lips are slightly parted, as if mid-sentence. The light catches the subtle highlights in her auburn hair, meticulously styled. Note the slight catch of light on the silver band of her watch. High resolution 4k',
      description: 'Detailed office scene with character focus and cinematic description',
      key_elements: [
        'Scene establishment with setting details',
        'Character description with clothing and appearance',
        'Cinematic camera movements and focus shifts',
        'Lighting and texture details',
        'Emotional and physical characteristics',
        'High-resolution specification',
      ],
    };
  }
}
