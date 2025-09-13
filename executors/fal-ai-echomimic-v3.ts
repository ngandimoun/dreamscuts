import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/echomimic-v3';

// Input interface
export interface FalAiEchoMimicV3Input {
  image_url: string;
  audio_url: string;
  prompt: string;
  negative_prompt?: string;
  num_frames_per_generation?: number;
  guidance_scale?: number;
  audio_guidance_scale?: number;
  seed?: number;
}

// Output interface
export interface FalAiEchoMimicV3Output {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error types
export interface FalAiEchoMimicV3Error {
  message: string;
  code?: string;
}

// Main executor class
export class FalAiEchoMimicV3Executor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  /**
   * Generate talking avatar video using fal.subscribe for real-time updates
   */
  async generateTalkingAvatar(
    input: FalAiEchoMimicV3Input
  ): Promise<FalAiEchoMimicV3Output> {
    try {
      this.validateInput(input);

      const result = await fal.subscribe(this.modelEndpoint, {
        input,
        pollInterval: 1000, // Poll every second
      });

      return result as unknown as FalAiEchoMimicV3Output;
    } catch (error) {
      throw {
        message: `Talking avatar generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'GENERATION_FAILED',
      } as FalAiEchoMimicV3Error;
    }
  }

  /**
   * Submit talking avatar generation request to queue for long-running operations
   */
  async submitToQueue(
    input: FalAiEchoMimicV3Input
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
      } as FalAiEchoMimicV3Error;
    }
  }

  /**
   * Check the status of a queued request
   */
  static async checkQueueStatus(requestId: string): Promise<any> {
    try {
      const status = await fal.queue.status('fal-ai/echomimic-v3', { requestId });
      return status;
    } catch (error) {
      throw {
        message: `Failed to check queue status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'STATUS_CHECK_FAILED',
      } as FalAiEchoMimicV3Error;
    }
  }

  /**
   * Get the result of a completed queued request
   */
  static async getQueueResult(requestId: string): Promise<FalAiEchoMimicV3Output> {
    try {
      const result = await fal.queue.result('fal-ai/echomimic-v3', { requestId });
      return result as unknown as FalAiEchoMimicV3Output;
    } catch (error) {
      throw {
        message: `Failed to get queue result: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'RESULT_FETCH_FAILED',
      } as FalAiEchoMimicV3Error;
    }
  }

  /**
   * Calculate the cost based on audio duration
   */
  calculateCost(audioDurationSeconds: number): number {
    const costPerSecond = 0.20;
    return costPerSecond * audioDurationSeconds;
  }

  /**
   * Estimate video duration based on audio length
   */
  estimateVideoDuration(audioDurationSeconds: number): number {
    return audioDurationSeconds; // Video duration matches audio duration
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: FalAiEchoMimicV3Input): void {
    if (!input.image_url) {
      throw new Error('image_url is required');
    }

    if (!input.audio_url) {
      throw new Error('audio_url is required');
    }

    if (!input.prompt) {
      throw new Error('prompt is required');
    }

    if (input.prompt.length > 1000) {
      throw new Error('prompt must be 1000 characters or less');
    }

    if (input.num_frames_per_generation !== undefined && (input.num_frames_per_generation < 1 || input.num_frames_per_generation > 200)) {
      throw new Error('num_frames_per_generation must be between 1 and 200');
    }

    if (input.guidance_scale !== undefined && (input.guidance_scale < 0 || input.guidance_scale > 20)) {
      throw new Error('guidance_scale must be between 0 and 20');
    }

    if (input.audio_guidance_scale !== undefined && (input.audio_guidance_scale < 0 || input.audio_guidance_scale > 20)) {
      throw new Error('audio_guidance_scale must be between 0 and 20');
    }
  }

  /**
   * Get guidance scale recommendations for talking avatars
   */
  static getGuidanceScaleRecommendations() {
    return {
      '2.0-3.0': 'Lower adherence to prompt, more natural movement',
      '3.5-4.5': 'Balanced adherence and natural movement (recommended)',
      '5.0-6.0': 'Higher adherence to prompt, more controlled movement',
      '6.0+': 'Very strict adherence to prompt, minimal variation',
    };
  }

  /**
   * Get audio guidance scale recommendations
   */
  static getAudioGuidanceScaleRecommendations() {
    return {
      '1.0-2.0': 'Lower audio influence, more visual freedom',
      '2.0-3.0': 'Balanced audio and visual influence (recommended)',
      '3.0-4.0': 'Higher audio influence, more lip-sync accuracy',
      '4.0+': 'Very strict audio-visual synchronization',
    };
  }

  /**
   * Get frame generation recommendations
   */
  static getFrameGenerationRecommendations() {
    return {
      '60-80': 'Faster generation, lower quality',
      '100-121': 'Balanced quality and speed (recommended)',
      '150-180': 'Higher quality, slower generation',
      '180+': 'Maximum quality, slowest generation',
    };
  }

  /**
   * Get prompt writing tips for talking avatars
   */
  static getPromptWritingTips() {
    return [
      'Describe the desired pose and movement style clearly',
      'Mention specific body language and facial expressions',
      'Include details about hand and arm movements',
      'Describe blinking frequency and eye behavior',
      'Mention background preservation requirements',
      'Specify movement consistency with natural speaking',
      'Include lighting and spatial configuration details',
      'Mention minimal vs. expressive movement preferences',
      'Reference the example prompt for structure',
    ];
  }

  /**
   * Get common use cases for talking avatar generation
   */
  static getCommonUseCases() {
    return [
      'Corporate presentations and training videos',
      'Educational content with talking instructors',
      'Marketing and advertising with spokesperson avatars',
      'Customer service and support videos',
      'Product demonstrations with talking hosts',
      'News and information delivery',
      'Entertainment and storytelling content',
      'Professional development and training',
      'Brand communication and messaging',
      'Social media content creation',
      'Virtual events and webinars',
      'Accessibility content with sign language',
    ];
  }

  /**
   * Get technical considerations for talking avatars
   */
  static getTechnicalConsiderations() {
    return [
      'Audio duration directly affects video length and cost',
      'Higher frame counts improve quality but increase processing time',
      'Guidance scale affects prompt adherence vs. natural movement',
      'Audio guidance scale controls lip-sync accuracy',
      'Image quality affects final video quality',
      'Audio clarity improves lip-sync results',
      'Background preservation depends on prompt specificity',
      'Seed values enable reproducible results',
      'Queue processing recommended for longer audio files',
    ];
  }

  /**
   * Get cost examples for different scenarios
   */
  getCostExamples() {
    return [
      {
        audio_duration: 5,
        cost: this.calculateCost(5),
        description: '5-second talking avatar video',
      },
      {
        audio_duration: 10,
        cost: this.calculateCost(10),
        description: '10-second talking avatar video',
      },
      {
        audio_duration: 30,
        cost: this.calculateCost(30),
        description: '30-second talking avatar video',
      },
      {
        audio_duration: 60,
        cost: this.calculateCost(60),
        description: '1-minute talking avatar video',
      },
    ];
  }

  /**
   * Get performance optimization tips
   */
  static getPerformanceOptimizationTips() {
    return [
      'Use moderate frame counts (100-121) for balanced results',
      'Balance guidance scales for natural movement',
      'Provide clear, specific prompts for better results',
      'Use high-quality input images and audio',
      'Consider queue processing for longer content',
      'Use seed values for reproducible results during development',
      'Optimize audio length for cost efficiency',
      'Leverage the model for natural talking avatar generation',
    ];
  }

  /**
   * Get troubleshooting tips
   */
  static getTroubleshootingTips() {
    return [
      'If generation fails, check image and audio URL accessibility',
      'For poor lip-sync, increase audio guidance scale',
      'If movement is too rigid, decrease guidance scale',
      'For inconsistent results, use specific seed values',
      'If background changes too much, be more specific in prompt',
      'For slow processing, reduce frame count',
      'If audio quality is poor, use clearer audio files',
      'Use the example prompt as a reference for best results',
    ];
  }

  /**
   * Get model-specific advantages
   */
  static getModelAdvantages() {
    return [
      'Specialized talking avatar generation with lip-sync',
      'Natural speaking movements and expressions',
      'Background preservation capabilities',
      'Audio-driven video generation',
      'High-quality avatar animation',
      'Consistent character appearance',
      'Professional presentation quality',
      'Cost-effective per-second pricing',
      'Queue support for long content',
      'Real-time progress monitoring',
    ];
  }

  /**
   * Get example prompt for reference
   */
  static getExamplePrompt() {
    return {
      prompt: 'A person is in a relaxed pose. As the video progresses, the character speaks while arm and body movements are minimal and consistent with a natural speaking posture. Hand movements remain minimal. Don\'t blink too often. Preserve background integrity matching the reference image\'s spatial configuration, lighting conditions, and color temperature.',
      description: 'Natural speaking pose with minimal movement and background preservation',
      key_elements: [
        'Relaxed pose specification',
        'Minimal movement requirements',
        'Natural speaking posture',
        'Blinking frequency control',
        'Background integrity preservation',
        'Spatial configuration matching',
        'Lighting conditions preservation',
        'Color temperature consistency',
      ],
    };
  }

  /**
   * Get supported file formats
   */
  static getSupportedFormats() {
    return {
      images: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'],
      audio: ['mp3', 'ogg', 'wav', 'm4a', 'aac'],
    };
  }

  /**
   * Get input preparation tips
   */
  static getInputPreparationTips() {
    return [
      'Use high-quality, clear portrait images',
      'Ensure good lighting and contrast in source images',
      'Use clear, well-articulated audio',
      'Avoid background noise in audio files',
      'Choose images with neutral expressions',
      'Use appropriate aspect ratios for your use case',
      'Ensure images are publicly accessible via URL',
      'Use audio files with clear speech content',
    ];
  }
}
