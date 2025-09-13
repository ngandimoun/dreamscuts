import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/infinitalk';

// Input interface
export interface FalAiInfinitalkInput {
  image_url: string;
  audio_url: string;
  prompt: string;
  num_frames?: number;
  resolution?: '480p' | '720p';
  seed?: number;
  acceleration?: 'none' | 'regular' | 'high';
}

// Output interface
export interface FalAiInfinitalkOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error types
export interface FalAiInfinitalkError {
  message: string;
  code?: string;
}

// Main executor class
export class FalAiInfinitalkExecutor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  async generateVideo(
    input: FalAiInfinitalkInput
  ): Promise<FalAiInfinitalkOutput> {
    try {
      this.validateInput(input);

      const result = await fal.run(MODEL_ENDPOINT, {
        input: {
          image_url: input.image_url,
          audio_url: input.audio_url,
          prompt: input.prompt,
          num_frames: input.num_frames || 145,
          resolution: input.resolution || '480p',
          seed: input.seed || 42,
          acceleration: input.acceleration || 'regular',
        },
      });

      return result as unknown as FalAiInfinitalkOutput;
    } catch (error) {
      throw {
        message: `Failed to generate video: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'GENERATION_FAILED',
      } as FalAiInfinitalkError;
    }
  }

  async submitToQueue(
    input: FalAiInfinitalkInput
  ): Promise<{ request_id: string }> {
    try {
      this.validateInput(input);

      const result = await fal.queue.submit(MODEL_ENDPOINT, {
        input: {
          image_url: input.image_url,
          audio_url: input.audio_url,
          prompt: input.prompt,
          num_frames: input.num_frames || 145,
          resolution: input.resolution || '480p',
          seed: input.seed || 42,
          acceleration: input.acceleration || 'regular',
        },
      });

      return { request_id: result.request_id };
    } catch (error) {
      throw {
        message: `Failed to submit to queue: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'QUEUE_SUBMISSION_FAILED',
      } as FalAiInfinitalkError;
    }
  }

  static async checkQueueStatus(requestId: string): Promise<any> {
    try {
      const status = await fal.queue.status(MODEL_ENDPOINT, { requestId });
      return status;
    } catch (error) {
      throw {
        message: `Failed to check queue status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'STATUS_CHECK_FAILED',
      } as FalAiInfinitalkError;
    }
  }

  static async getQueueResult(requestId: string): Promise<FalAiInfinitalkOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, { requestId });
      return result as unknown as FalAiInfinitalkOutput;
    } catch (error) {
      throw {
        message: `Failed to get queue result: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'RESULT_FETCH_FAILED',
      } as FalAiInfinitalkError;
    }
  }

  calculateCost(numFrames: number, resolution: '480p' | '720p' = '480p'): number {
    // $0.3 per second of output video
    // For 720p, price is doubled
    const baseCostPerSecond = 0.3;
    const resolutionMultiplier = resolution === '720p' ? 2 : 1;
    
    // Estimate duration based on frames (assuming 30fps)
    const estimatedDuration = numFrames / 30;
    
    return estimatedDuration * baseCostPerSecond * resolutionMultiplier;
  }

  estimateVideoDuration(numFrames: number): number {
    // Assuming 30fps
    return numFrames / 30;
  }

  private validateInput(input: FalAiInfinitalkInput): void {
    if (!input.image_url) {
      throw {
        message: 'image_url is required',
        code: 'MISSING_IMAGE_URL',
      } as FalAiInfinitalkError;
    }

    if (!input.audio_url) {
      throw {
        message: 'audio_url is required',
        code: 'MISSING_AUDIO_URL',
      } as FalAiInfinitalkError;
    }

    if (!input.prompt) {
      throw {
        message: 'prompt is required',
        code: 'MISSING_PROMPT',
      } as FalAiInfinitalkError;
    }

    if (input.image_url && !this.isValidUrl(input.image_url)) {
      throw {
        message: 'image_url must be a valid URL',
        code: 'INVALID_IMAGE_URL',
      } as FalAiInfinitalkError;
    }

    if (input.audio_url && !this.isValidUrl(input.audio_url)) {
      throw {
        message: 'audio_url must be a valid URL',
        code: 'INVALID_AUDIO_URL',
      } as FalAiInfinitalkError;
    }

    if (input.num_frames !== undefined && (input.num_frames < 41 || input.num_frames > 721)) {
      throw {
        message: 'num_frames must be between 41 and 721',
        code: 'INVALID_NUM_FRAMES',
      } as FalAiInfinitalkError;
    }

    if (input.resolution && !['480p', '720p'].includes(input.resolution)) {
      throw {
        message: 'resolution must be either "480p" or "720p"',
        code: 'INVALID_RESOLUTION',
      } as FalAiInfinitalkError;
    }

    if (input.seed !== undefined && (input.seed < 0 || input.seed > 999999)) {
      throw {
        message: 'seed must be between 0 and 999999',
        code: 'INVALID_SEED',
      } as FalAiInfinitalkError;
    }

    if (input.acceleration && !['none', 'regular', 'high'].includes(input.acceleration)) {
      throw {
        message: 'acceleration must be either "none", "regular", or "high"',
        code: 'INVALID_ACCELERATION',
      } as FalAiInfinitalkError;
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Static utility methods for recommendations and best practices
  static getFrameCountRecommendations() {
    return {
      short: { frames: 60, duration: '2s', description: 'Quick talking head videos' },
      standard: { frames: 145, duration: '4.8s', description: 'Standard talking head content' },
      medium: { frames: 300, duration: '10s', description: 'Extended presentations' },
      long: { frames: 600, duration: '20s', description: 'Long-form content' },
      extended: { frames: 721, duration: '24s', description: 'Maximum duration content' },
    };
  }

  static getResolutionRecommendations() {
    return {
      '480p': { description: 'Standard quality, cost-effective', cost_multiplier: 1 },
      '720p': { description: 'High quality, double the cost', cost_multiplier: 2 },
    };
  }

  static getAccelerationRecommendations() {
    return {
      none: { description: 'No acceleration, highest quality', speed: 'slowest' },
      regular: { description: 'Balanced acceleration and quality', speed: 'medium' },
      high: { description: 'Maximum acceleration, slightly lower quality', speed: 'fastest' },
    };
  }

  static getPromptWritingTips() {
    return [
      'Describe the desired talking style and personality',
      'Include emotional tone and expression details',
      'Specify any particular gestures or movements',
      'Mention the context or setting if relevant',
      'Keep prompts concise but descriptive',
    ];
  }

  static getImagePreparationTips() {
    return [
      'Use high-quality, clear headshots',
      'Ensure good lighting and contrast',
      'Avoid complex backgrounds',
      'Use images with neutral expressions',
      'Ensure the face is clearly visible',
    ];
  }

  static getAudioPreparationTips() {
    return [
      'Use clear, high-quality audio recordings',
      'Ensure minimal background noise',
      'Use consistent volume levels',
      'Consider the emotional tone of the audio',
      'Test audio clarity before submission',
    ];
  }

  static getCommonUseCases() {
    return [
      'Talking head videos for presentations',
      'Educational content with synchronized speech',
      'Marketing videos with personalized messages',
      'Customer service announcements',
      'Training and onboarding materials',
      'Social media content creation',
      'Virtual assistant avatars',
      'Personalized video messages',
    ];
  }

  static getTechnicalConsiderations() {
    return [
      'Cost scales with frame count and resolution',
      '720p resolution doubles the cost',
      'Higher frame counts increase processing time',
      'Acceleration settings affect quality vs speed',
      'Seed values ensure reproducible results',
      'Queue processing recommended for longer videos',
    ];
  }

  getCostExamples() {
    return [
      {
        frames: 60,
        resolution: '480p',
        cost: this.calculateCost(60, '480p'),
        description: '2-second video at 480p',
      },
      {
        frames: 145,
        resolution: '480p',
        cost: this.calculateCost(145, '480p'),
        description: '4.8-second video at 480p',
      },
      {
        frames: 300,
        resolution: '720p',
        cost: this.calculateCost(300, '720p'),
        description: '10-second video at 720p',
      },
      {
        frames: 600,
        resolution: '480p',
        cost: this.calculateCost(600, '480p'),
        description: '20-second video at 480p',
      },
    ];
  }

  static getPerformanceOptimizationTips() {
    return [
      'Start with lower frame counts for testing',
      'Use 480p resolution for cost efficiency',
      'Choose appropriate acceleration settings',
      'Use consistent seed values for reproducible results',
      'Consider queue processing for longer videos',
    ];
  }

  static getTroubleshootingTips() {
    return [
      'Ensure image and audio URLs are accessible',
      'Check that image shows a clear face',
      'Verify audio quality and clarity',
      'Use appropriate frame counts for your needs',
      'Start with default parameters and adjust gradually',
    ];
  }

  static getModelAdvantages() {
    return [
      'Specialized in talking head video generation',
      'High-quality lip-sync capabilities',
      'Flexible frame count and resolution options',
      'Cost-effective pricing structure',
      'Multiple acceleration options for different needs',
      'Reproducible results with seed control',
    ];
  }

  static getExamplePrompt() {
    return 'Create a professional talking head video with a warm, engaging expression that matches the friendly tone of the audio. The person should appear confident and approachable, with natural head movements and subtle gestures.';
  }

  static getPromptStructureRecommendations() {
    return [
      'Start with the desired emotional expression',
      'Describe the talking style and personality',
      'Include any specific gestures or movements',
      'Mention the context or setting if relevant',
      'Specify the overall tone and mood',
    ];
  }

  static getTalkingHeadBestPractices() {
    return [
      'Use clear, high-quality headshots',
      'Ensure good lighting and contrast',
      'Avoid complex or distracting backgrounds',
      'Use images with neutral expressions',
      'Consider the relationship between image and audio',
    ];
  }

  static getSupportedImageFormats() {
    return [
      'JPEG',
      'PNG',
      'WebP',
      'GIF (first frame)',
    ];
  }

  static getSupportedAudioFormats() {
    return [
      'MP3',
      'WAV',
      'M4A',
      'OGG',
    ];
  }

  static getCostOptimizationStrategies() {
    return [
      'Use 480p resolution for cost efficiency',
      'Start with lower frame counts for testing',
      'Choose appropriate acceleration settings',
      'Batch similar requests together',
      'Use consistent parameters to reduce experimentation costs',
    ];
  }
}
