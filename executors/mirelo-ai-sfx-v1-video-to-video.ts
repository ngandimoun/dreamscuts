import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'mirelo-ai/sfx-v1/video-to-video';

// Input interface
export interface MireloAiSfxV1VideoToVideoInput {
  video_url: string;
  text_prompt?: string;
  num_samples?: number;
  seed?: number;
  duration?: number;
}

// Output interface
export interface MireloAiSfxV1VideoToVideoOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error types
export interface MireloAiSfxV1VideoToVideoError {
  message: string;
  code?: string;
}

// Main executor class
export class MireloAiSfxV1VideoToVideoExecutor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  async generateVideo(
    input: MireloAiSfxV1VideoToVideoInput
  ): Promise<MireloAiSfxV1VideoToVideoOutput> {
    try {
      this.validateInput(input);

      const result = await fal.run(MODEL_ENDPOINT, {
        input: {
          video_url: input.video_url,
          text_prompt: input.text_prompt,
          num_samples: input.num_samples || 2,
          seed: input.seed || 2105,
          duration: input.duration || 10,
        },
      });

      return result as unknown as MireloAiSfxV1VideoToVideoOutput;
    } catch (error) {
      throw {
        message: `Failed to generate video: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'GENERATION_FAILED',
      } as MireloAiSfxV1VideoToVideoError;
    }
  }

  async submitToQueue(
    input: MireloAiSfxV1VideoToVideoInput
  ): Promise<{ request_id: string }> {
    try {
      this.validateInput(input);

      const result = await fal.queue.submit(MODEL_ENDPOINT, {
        input: {
          video_url: input.video_url,
          text_prompt: input.text_prompt,
          num_samples: input.num_samples || 2,
          seed: input.seed || 2105,
          duration: input.duration || 10,
        },
      });

      return { request_id: result.request_id };
    } catch (error) {
      throw {
        message: `Failed to submit to queue: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'QUEUE_SUBMISSION_FAILED',
      } as MireloAiSfxV1VideoToVideoError;
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
      } as MireloAiSfxV1VideoToVideoError;
    }
  }

  static async getQueueResult(requestId: string): Promise<MireloAiSfxV1VideoToVideoOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, { requestId });
      return result as unknown as MireloAiSfxV1VideoToVideoOutput;
    } catch (error) {
      throw {
        message: `Failed to get queue result: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'RESULT_FETCH_FAILED',
      } as MireloAiSfxV1VideoToVideoError;
    }
  }

  calculateCost(duration: number, numSamples: number = 2): number {
    // $0.007 per second of output and per sample
    const costPerSecond = 0.007;
    const costPerSample = 0.007;
    
    return (duration * costPerSecond) + (numSamples * costPerSample);
  }

  estimateVideoDuration(duration: number): number {
    return duration;
  }

  private validateInput(input: MireloAiSfxV1VideoToVideoInput): void {
    if (!input.video_url) {
      throw {
        message: 'video_url is required',
        code: 'MISSING_VIDEO_URL',
      } as MireloAiSfxV1VideoToVideoError;
    }

    if (input.video_url && !this.isValidUrl(input.video_url)) {
      throw {
        message: 'video_url must be a valid URL',
        code: 'INVALID_VIDEO_URL',
      } as MireloAiSfxV1VideoToVideoError;
    }

    if (input.num_samples !== undefined && (input.num_samples < 1 || input.num_samples > 10)) {
      throw {
        message: 'num_samples must be between 1 and 10',
        code: 'INVALID_NUM_SAMPLES',
      } as MireloAiSfxV1VideoToVideoError;
    }

    if (input.seed !== undefined && (input.seed < 0 || input.seed > 999999)) {
      throw {
        message: 'seed must be between 0 and 999999',
        code: 'INVALID_SEED',
      } as MireloAiSfxV1VideoToVideoError;
    }

    if (input.duration !== undefined && (input.duration < 1 || input.duration > 60)) {
      throw {
        message: 'duration must be between 1 and 60 seconds',
        code: 'INVALID_DURATION',
      } as MireloAiSfxV1VideoToVideoError;
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
  static getDurationRecommendations() {
    return {
      short: { duration: 5, description: 'Quick sound effects and short audio clips' },
      medium: { duration: 10, description: 'Standard sound effects and moderate audio content' },
      long: { duration: 30, description: 'Extended audio sequences and complex soundscapes' },
      extended: { duration: 60, description: 'Full audio tracks and comprehensive sound design' },
    };
  }

  static getSampleCountRecommendations() {
    return {
      single: { samples: 1, description: 'Single output for quick iterations' },
      standard: { samples: 2, description: 'Default setting for balanced quality and variety' },
      multiple: { samples: 5, description: 'Multiple variations for selection' },
      comprehensive: { samples: 10, description: 'Maximum variety for final selection' },
    };
  }

  static getPromptWritingTips() {
    return [
      'Be specific about the desired sound characteristics',
      'Use descriptive language for audio qualities',
      'Reference similar sounds or genres when possible',
      'Include emotional or atmospheric descriptors',
      'Specify timing and rhythm if relevant',
    ];
  }

  static getVideoPreparationTips() {
    return [
      'Ensure video has clear audio content to work with',
      'Use high-quality video files for better results',
      'Consider the relationship between video and desired audio',
      'Test with shorter clips first for cost efficiency',
      'Provide context about the intended audio outcome',
    ];
  }

  static getCommonUseCases() {
    return [
      'Sound effect generation for video content',
      'Audio enhancement and modification',
      'Music generation based on video content',
      'Atmospheric sound creation',
      'Audio-visual synchronization',
    ];
  }

  static getTechnicalConsiderations() {
    return [
      'Cost scales with both duration and sample count',
      'Longer videos require more processing time',
      'Multiple samples increase variety but also cost',
      'Seed values ensure reproducible results',
      'Text prompts help guide audio generation',
    ];
  }

  getCostExamples() {
    return [
      {
        duration: 5,
        samples: 2,
        cost: this.calculateCost(5, 2),
        description: '5-second video with 2 samples',
      },
      {
        duration: 10,
        samples: 2,
        cost: this.calculateCost(10, 2),
        description: '10-second video with 2 samples',
      },
      {
        duration: 30,
        samples: 5,
        cost: this.calculateCost(30, 5),
        description: '30-second video with 5 samples',
      },
      {
        duration: 60,
        samples: 10,
        cost: this.calculateCost(60, 10),
        description: '60-second video with 10 samples',
      },
    ];
  }

  static getPerformanceOptimizationTips() {
    return [
      'Start with shorter durations for testing',
      'Use fewer samples initially, increase as needed',
      'Provide clear, specific text prompts',
      'Use consistent seed values for reproducible results',
      'Consider batch processing for multiple videos',
    ];
  }

  static getTroubleshootingTips() {
    return [
      'Ensure video URL is accessible and valid',
      'Check that video contains audio content',
      'Verify text prompt is clear and descriptive',
      'Use appropriate duration for your use case',
      'Start with default parameters and adjust gradually',
    ];
  }

  static getModelAdvantages() {
    return [
      'Specialized in video-to-audio generation',
      'Cost-effective pricing structure',
      'Flexible sample generation options',
      'Reproducible results with seed control',
      'Text prompt guidance for better results',
    ];
  }

  static getExamplePrompt() {
    return 'Create a cinematic orchestral soundtrack that matches the dramatic tension and emotional intensity of this video sequence, with dynamic swells and atmospheric elements.';
  }

  static getPromptStructureRecommendations() {
    return [
      'Start with the desired audio type or genre',
      'Describe the emotional or atmospheric quality',
      'Specify timing and rhythm characteristics',
      'Include references to similar audio styles',
      'Mention any specific instruments or sounds',
    ];
  }

  static getAudioGenerationBestPractices() {
    return [
      'Provide clear context about the video content',
      'Use descriptive language for audio qualities',
      'Consider the relationship between visual and audio',
      'Specify desired emotional impact',
      'Reference similar audio examples when possible',
    ];
  }

  static getSupportedVideoFormats() {
    return [
      'MP4 (H.264, H.265)',
      'MOV (QuickTime)',
      'AVI',
      'WebM',
      'MKV',
    ];
  }

  static getCostOptimizationStrategies() {
    return [
      'Use shorter durations for initial testing',
      'Start with fewer samples and increase as needed',
      'Batch similar requests together',
      'Use consistent parameters to reduce experimentation costs',
      'Plan your audio generation workflow efficiently',
    ];
  }
}
