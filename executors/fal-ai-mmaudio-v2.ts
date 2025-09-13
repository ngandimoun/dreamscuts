import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/mmaudio-v2';

// Input interface
export interface FalAiMmaudioV2Input {
  audio_url: string;
  prompt?: string;
  negative_prompt?: string;
  seed?: number;
  num_inference_steps?: number;
  guidance_scale?: number;
  num_samples?: number;
  audio_length_in_s?: number;
  top_k?: number;
  top_p?: number;
  temperature?: number;
  classifier_free_guidance?: boolean;
}

// Output interface
export interface FalAiMmaudioV2Output {
  audio: string; // The actual output is just a string URL
  seed?: number;
  metadata?: {
    duration?: number;
    sample_rate?: number;
    format?: string;
  };
}

// Error types
export interface FalAiMmaudioV2Error {
  message: string;
  code?: string;
}

// Main executor class
export class FalAiMmaudioV2Executor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: this.apiKey });
  }

  /**
   * Generate audio using the Mmaudio v2 model
   */
  async generateAudio(input: FalAiMmaudioV2Input): Promise<FalAiMmaudioV2Output> {
    try {
      this.validateInput(input);

      const result = await fal.subscribe(MODEL_ENDPOINT, {
        input: input as any, // Use any to avoid type conflicts
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            update.logs?.map((log) => log.message).forEach(console.log);
          }
        },
      });

      // Transform the result to match our interface
      return {
        audio: result.data as unknown as string,
        seed: input.seed,
        metadata: {
          duration: input.audio_length_in_s,
          format: 'mp3', // Default format
        },
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit an audio generation request to the queue for long-running operations
   */
  async submitAudioGenerationRequest(input: FalAiMmaudioV2Input, webhookUrl?: string): Promise<{ request_id: string }> {
    try {
      this.validateInput(input);

      const { request_id } = await fal.queue.submit(MODEL_ENDPOINT, {
        input: input as any, // Use any to avoid type conflicts
        webhookUrl,
      });

      return { request_id };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Check the status of a queued audio generation request
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
   * Get the result of a completed audio generation request
   */
  async getRequestResult(requestId: string): Promise<FalAiMmaudioV2Output> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });

      // Transform the result to match our interface
      return {
        audio: result.data as unknown as string,
        seed: undefined, // Seed not returned in queue result
        metadata: {
          format: 'mp3', // Default format
        },
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Calculate the cost for generating audio based on parameters
   */
  calculateCost(audioLengthInS: number = 10, numInferenceSteps: number = 50): number {
    // Base cost calculation for Mmaudio v2
    // This is an estimate based on typical audio generation models
    const baseCostPerSecond = 0.05; // $0.05 per second of audio
    const stepMultiplier = numInferenceSteps / 50; // Normalize to 50 steps
    
    const totalCost = audioLengthInS * baseCostPerSecond * stepMultiplier;
    return Math.round(totalCost * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: FalAiMmaudioV2Input): void {
    if (!input.audio_url || input.audio_url.trim().length === 0) {
      throw new Error('Audio URL is required');
    }

    if (input.prompt && input.prompt.length > 2000) {
      throw new Error('Prompt must be 2000 characters or less');
    }

    if (input.negative_prompt && input.negative_prompt.length > 2000) {
      throw new Error('Negative prompt must be 2000 characters or less');
    }

    if (input.seed !== undefined && (input.seed < 0 || input.seed > 999999)) {
      throw new Error('Seed must be between 0 and 999999');
    }

    if (input.num_inference_steps !== undefined && (input.num_inference_steps < 1 || input.num_inference_steps > 200)) {
      throw new Error('Number of inference steps must be between 1 and 200');
    }

    if (input.guidance_scale !== undefined && (input.guidance_scale < 0.1 || input.guidance_scale > 20.0)) {
      throw new Error('Guidance scale must be between 0.1 and 20.0');
    }

    if (input.num_samples !== undefined && (input.num_samples < 1 || input.num_samples > 4)) {
      throw new Error('Number of samples must be between 1 and 4');
    }

    if (input.audio_length_in_s !== undefined && (input.audio_length_in_s < 1 || input.audio_length_in_s > 60)) {
      throw new Error('Audio length must be between 1 and 60 seconds');
    }

    if (input.top_k !== undefined && (input.top_k < 1 || input.top_k > 1000)) {
      throw new Error('Top-k must be between 1 and 1000');
    }

    if (input.top_p !== undefined && (input.top_p < 0.0 || input.top_p > 1.0)) {
      throw new Error('Top-p must be between 0.0 and 1.0');
    }

    if (input.temperature !== undefined && (input.temperature < 0.1 || input.temperature > 10.0)) {
      throw new Error('Temperature must be between 0.1 and 10.0');
    }
  }

  /**
   * Handle and format errors
   */
  private handleError(error: any): FalAiMmaudioV2Error {
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
      name: 'Fal AI Mmaudio v2',
      endpoint: MODEL_ENDPOINT,
      description: 'Advanced audio generation model for creating high-quality audio content',
      pricing: {
        base_cost: '$0.05 per second of audio',
        step_multiplier: 'Cost scales with inference steps',
      },
      capabilities: [
        'Audio generation from prompts',
        'Negative prompt support',
        'Configurable audio length (1-60 seconds)',
        'Multiple inference step options',
        'Guidance scale control',
        'Temperature and sampling controls',
        'Seed control for reproducible results',
      ],
    };
  }

  /**
   * Get supported audio length range
   */
  static getSupportedAudioLengthRange(): { min: number; max: number } {
    return { min: 1, max: 60 };
  }

  /**
   * Get supported inference steps range
   */
  static getSupportedInferenceStepsRange(): { min: number; max: number } {
    return { min: 1, max: 200 };
  }

  /**
   * Get supported guidance scale range
   */
  static getSupportedGuidanceScaleRange(): { min: number; max: number } {
    return { min: 0.1, max: 20.0 };
  }

  /**
   * Get supported temperature range
   */
  static getSupportedTemperatureRange(): { min: number; max: number } {
    return { min: 0.1, max: 10.0 };
  }

  /**
   * Get maximum number of samples
   */
  static getMaxSamples(): number {
    return 4;
  }
}
