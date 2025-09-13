import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/wan/v2.2-14b/speech-to-video';

// Aspect ratio enum
export type WanV2_2_14bSpeechToVideoAspectRatioEnum = '16:9' | '4:3' | '1:1' | '3:4' | '9:16';

// Resolution enum
export type WanV2_2_14bSpeechToVideoResolutionEnum = '360p' | '540p' | '720p' | '1080p';

// Duration enum
export type WanV2_2_14bSpeechToVideoDurationEnum = '5' | '8';

// Style enum
export type WanV2_2_14bSpeechToVideoStyleEnum = 'anime' | '3d_animation' | 'clay' | 'comic' | 'cyberpunk';

// Input interface
export interface FalAiWanV2_2_14bSpeechToVideoInput {
  prompt: string;
  audio_url: string;
  aspect_ratio?: WanV2_2_14bSpeechToVideoAspectRatioEnum;
  resolution?: WanV2_2_14bSpeechToVideoResolutionEnum;
  duration?: WanV2_2_14bSpeechToVideoDurationEnum;
  negative_prompt?: string;
  style?: WanV2_2_14bSpeechToVideoStyleEnum;
  seed?: number;
}

// Output interface
export interface FalAiWanV2_2_14bSpeechToVideoOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error types
export interface FalAiWanV2_2_14bSpeechToVideoError {
  message: string;
  code?: string;
}

// Main executor class
export class FalAiWanV2_2_14bSpeechToVideoExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: this.apiKey });
  }

  /**
   * Generate a video from speech audio using WAN v2.2-14b model
   */
  async generateVideo(input: FalAiWanV2_2_14bSpeechToVideoInput): Promise<FalAiWanV2_2_14bSpeechToVideoOutput> {
    try {
      this.validateInput(input);

      const result = await fal.subscribe(MODEL_ENDPOINT, {
        input: {
          prompt: input.prompt,
          audio_url: input.audio_url,
          aspect_ratio: input.aspect_ratio || '16:9',
          resolution: input.resolution || '720p',
          duration: input.duration || '5',
          negative_prompt: input.negative_prompt || '',
          style: input.style,
          seed: input.seed || Math.floor(Math.random() * 1000000),
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            update.logs?.map((log) => log.message).forEach(console.log);
          }
        },
      });

      return result.data as FalAiWanV2_2_14bSpeechToVideoOutput;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit a speech-to-video request to the queue for long-running operations
   */
  async submitSpeechToVideoRequest(input: FalAiWanV2_2_14bSpeechToVideoInput, webhookUrl?: string): Promise<{ request_id: string }> {
    try {
      this.validateInput(input);

      const { request_id } = await fal.queue.submit(MODEL_ENDPOINT, {
        input: {
          prompt: input.prompt,
          audio_url: input.audio_url,
          aspect_ratio: input.aspect_ratio || '16:9',
          resolution: input.resolution || '720p',
          duration: input.duration || '5',
          negative_prompt: input.negative_prompt || '',
          style: input.style,
          seed: input.seed || Math.floor(Math.random() * 1000000),
        },
        webhookUrl,
      });

      return { request_id };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Check the status of a queued speech-to-video request
   */
  async checkRequestStatus(requestId: string): Promise<any> {
    try {
      return await fal.queue.status(MODEL_ENDPOINT, {
        requestId,
        logs: true,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get the result of a completed speech-to-video request
   */
  async getRequestResult(requestId: string): Promise<FalAiWanV2_2_14bSpeechToVideoOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });

      return result.data as FalAiWanV2_2_14bSpeechToVideoOutput;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Calculate the cost for generating a video based on resolution and duration
   */
  calculateCost(resolution: WanV2_2_14bSpeechToVideoResolutionEnum = '720p', duration: WanV2_2_14bSpeechToVideoDurationEnum = '5'): number {
    let baseCost = 0;
    
    switch (resolution) {
      case '360p':
      case '540p':
        baseCost = 0.15;
        break;
      case '720p':
        baseCost = 0.20;
        break;
      case '1080p':
        baseCost = 0.40;
        break;
    }

    // 8-second videos cost double
    if (duration === '8') {
      baseCost *= 2;
    }

    return baseCost;
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: FalAiWanV2_2_14bSpeechToVideoInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error('Prompt is required');
    }

    if (input.prompt.length > 2000) {
      throw new Error('Prompt must be 2000 characters or less');
    }

    if (!input.audio_url || input.audio_url.trim().length === 0) {
      throw new Error('Audio URL is required');
    }

    if (input.negative_prompt && input.negative_prompt.length > 2000) {
      throw new Error('Negative prompt must be 2000 characters or less');
    }

    if (input.seed !== undefined && (input.seed < 0 || input.seed > 999999)) {
      throw new Error('Seed must be between 0 and 999999');
    }
  }

  /**
   * Handle and format errors
   */
  private handleError(error: any): FalAiWanV2_2_14bSpeechToVideoError {
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'EXECUTION_ERROR',
      };
    }

    return {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    };
  }

  /**
   * Get model information
   */
  static getModelInfo() {
    return {
      name: 'Fal AI WAN v2.2-14b Speech-to-Video',
      endpoint: MODEL_ENDPOINT,
      description: 'Generate high-quality video clips from speech audio using WAN v2.2-14b model',
      pricing: {
        '360p': 0.15,
        '540p': 0.15,
        '720p': 0.20,
        '1080p': 0.40,
      },
      durationMultiplier: 2, // 8s videos cost double
    };
  }

  /**
   * Get supported aspect ratios
   */
  static getSupportedAspectRatios(): WanV2_2_14bSpeechToVideoAspectRatioEnum[] {
    return ['16:9', '4:3', '1:1', '3:4', '9:16'];
  }

  /**
   * Get supported resolutions
   */
  static getSupportedResolutions(): WanV2_2_14bSpeechToVideoResolutionEnum[] {
    return ['360p', '540p', '720p', '1080p'];
  }

  /**
   * Get supported durations
   */
  static getSupportedDurations(): WanV2_2_14bSpeechToVideoDurationEnum[] {
    return ['5', '8'];
  }

  /**
   * Get supported styles
   */
  static getSupportedStyles(): WanV2_2_14bSpeechToVideoStyleEnum[] {
    return ['anime', '3d_animation', 'clay', 'comic', 'cyberpunk'];
  }
}
