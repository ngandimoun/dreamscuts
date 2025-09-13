import { fal } from '@fal-ai/client';

// Voice options for the avatar
export type VoiceEnum = 
  | 'Aria' | 'Roger' | 'Sarah' | 'Laura' | 'Charlie' | 'George' 
  | 'Callum' | 'River' | 'Liam' | 'Charlotte' | 'Alice' | 'Matilda' 
  | 'Will' | 'Jessica' | 'Eric' | 'Chris' | 'Brian' | 'Daniel' 
  | 'Lily' | 'Bill';

// Resolution options
export type ResolutionEnum = '480p' | '720p';

// Acceleration options
export type AccelerationEnum = 'none' | 'regular' | 'high';

// Input schema for AI Avatar Single Text
export interface AiAvatarSingleTextInput {
  image_url: string;
  text_input: string;
  voice: VoiceEnum;
  prompt: string;
  num_frames?: number;
  resolution?: ResolutionEnum;
  seed?: number;
  acceleration?: AccelerationEnum;
}

// Output schema for AI Avatar Single Text
export interface AiAvatarSingleTextOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  seed: number;
}

// Error types
export interface AiAvatarSingleTextError {
  error: string;
  details?: string;
}

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/ai-avatar/single-text';

export class AiAvatarSingleTextExecutor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  /**
   * Generate talking avatar video using AI Avatar Single Text
   */
  async generateAvatar(input: AiAvatarSingleTextInput): Promise<AiAvatarSingleTextOutput> {
    try {
      const result = await fal.subscribe(this.modelEndpoint, {
        input: {
          image_url: input.image_url,
          text_input: input.text_input,
          voice: input.voice,
          prompt: input.prompt,
          num_frames: input.num_frames || 136,
          resolution: input.resolution || '480p',
          seed: input.seed || 42,
          acceleration: input.acceleration || 'regular',
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs?.forEach((log) => console.log(log.message));
          }
        },
      });

      return {
        video: {
          url: (result as any).video?.url || '',
          content_type: (result as any).video?.content_type,
          file_name: (result as any).video?.file_name,
          file_size: (result as any).video?.file_size,
        },
        seed: (result as any).seed || input.seed || 42,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit avatar generation to queue for long-running requests
   */
  async submitToQueue(input: AiAvatarSingleTextInput): Promise<{ requestId: string }> {
    try {
      const { request_id } = await fal.queue.submit(this.modelEndpoint, {
        input: {
          image_url: input.image_url,
          text_input: input.text_input,
          voice: input.voice,
          prompt: input.prompt,
          num_frames: input.num_frames || 136,
          resolution: input.resolution || '480p',
          seed: input.seed || 42,
          acceleration: input.acceleration || 'regular',
        },
      });

      return { requestId: request_id };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Check the status of a queued request
   */
  async checkStatus(requestId: string): Promise<any> {
    try {
      const status = await fal.queue.status(this.modelEndpoint, {
        requestId,
        logs: true,
      });

      return status;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get the result of a completed queued request
   */
  async getResult(requestId: string): Promise<AiAvatarSingleTextOutput> {
    try {
      const result = await fal.queue.result(this.modelEndpoint, {
        requestId,
      });

      return {
        video: {
          url: (result as any).video?.url || '',
          content_type: (result as any).video?.content_type,
          file_name: (result as any).video?.file_name,
          file_size: (result as any).video?.file_size,
        },
        seed: (result as any).seed || 42,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Calculate estimated cost for avatar generation
   */
  calculateCost(durationSeconds: number, resolution: ResolutionEnum = '480p'): number {
    // Base cost is $0.3 per second
    const baseCostPerSecond = 0.3;
    let totalCost = baseCostPerSecond * durationSeconds;
    
    // 720p price is doubled
    if (resolution === '720p') {
      totalCost *= 2;
    }
    
    // If frames > 81, apply 1.25x multiplier
    const frameCount = this.estimateFrameCount(durationSeconds);
    if (frameCount > 81) {
      totalCost *= 1.25;
    }
    
    return totalCost;
  }

  /**
   * Estimate frame count based on duration
   */
  private estimateFrameCount(durationSeconds: number): number {
    // Assuming 30fps, but this is approximate
    return Math.round(durationSeconds * 30);
  }

  /**
   * Get available voice options
   */
  getAvailableVoices(): VoiceEnum[] {
    return [
      'Aria', 'Roger', 'Sarah', 'Laura', 'Charlie', 'George',
      'Callum', 'River', 'Liam', 'Charlotte', 'Alice', 'Matilda',
      'Will', 'Jessica', 'Eric', 'Chris', 'Brian', 'Daniel',
      'Lily', 'Bill'
    ];
  }

  /**
   * Get voice recommendations based on use case
   */
  getVoiceRecommendations(useCase: string): VoiceEnum[] {
    const recommendations: Record<string, VoiceEnum[]> = {
      'professional': ['Sarah', 'Roger', 'Charlotte', 'George'],
      'casual': ['Alice', 'Liam', 'Jessica', 'Chris'],
      'friendly': ['Laura', 'Charlie', 'Matilda', 'Will'],
      'authoritative': ['Bill', 'Eric', 'Daniel', 'Aria'],
      'youthful': ['Lily', 'River', 'Callum', 'Alice'],
    };

    return recommendations[useCase] || this.getAvailableVoices();
  }

  /**
   * Validate input parameters
   */
  validateInput(input: AiAvatarSingleTextInput): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.image_url || input.image_url.trim().length === 0) {
      errors.push('Image URL is required');
    }

    if (!input.text_input || input.text_input.trim().length === 0) {
      errors.push('Text input is required');
    }

    if (!input.voice || !this.getAvailableVoices().includes(input.voice)) {
      errors.push('Valid voice selection is required');
    }

    if (!input.prompt || input.prompt.trim().length === 0) {
      errors.push('Prompt is required');
    }

    if (input.num_frames && (input.num_frames < 81 || input.num_frames > 129)) {
      errors.push('Number of frames must be between 81 and 129');
    }

    if (input.resolution && !['480p', '720p'].includes(input.resolution)) {
      errors.push('Resolution must be either 480p or 720p');
    }

    if (input.seed && (input.seed < 0 || input.seed > 999999)) {
      errors.push('Seed must be between 0 and 999999');
    }

    if (input.acceleration && !['none', 'regular', 'high'].includes(input.acceleration)) {
      errors.push('Acceleration must be none, regular, or high');
    }

    // Basic URL validation
    try {
      new URL(input.image_url);
    } catch {
      errors.push('Image URL must be a valid URL');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get optimal settings for different use cases
   */
  getOptimalSettings(useCase: string): Partial<AiAvatarSingleTextInput> {
    const settings: Record<string, Partial<AiAvatarSingleTextInput>> = {
      'social_media': {
        num_frames: 81,
        resolution: '480p',
        acceleration: 'high',
      },
      'professional': {
        num_frames: 136,
        resolution: '720p',
        acceleration: 'regular',
      },
      'quick_demo': {
        num_frames: 81,
        resolution: '480p',
        acceleration: 'high',
      },
      'high_quality': {
        num_frames: 129,
        resolution: '720p',
        acceleration: 'none',
      },
    };

    return settings[useCase] || {};
  }

  /**
   * Handle errors consistently
   */
  private handleError(error: any): AiAvatarSingleTextError {
    if (error instanceof Error) {
      return {
        error: error.message,
        details: error.stack,
      };
    }

    if (typeof error === 'string') {
      return {
        error,
      };
    }

    return {
      error: 'An unknown error occurred',
      details: JSON.stringify(error),
    };
  }
}
