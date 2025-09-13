import { fal } from "@fal-ai/client";

export interface MinimaxHailuo02StandardImageToVideoInput {
  prompt: string;
  image_url: string;
  duration?: "6" | "10";
  resolution?: "512P" | "768P";
  prompt_optimizer?: boolean;
}

export interface MinimaxHailuo02StandardImageToVideoOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  requestId?: string;
}

export interface MinimaxHailuo02StandardImageToVideoError {
  error: string;
  message: string;
  code?: string;
}

export type MinimaxHailuo02StandardImageToVideoResult = MinimaxHailuo02StandardImageToVideoOutput | MinimaxHailuo02StandardImageToVideoError;

const MODEL_ENDPOINT = "fal-ai/minimax/hailuo-02/standard/image-to-video";

const DEFAULT_CONFIG = {
  duration: "6" as const,
  resolution: "768P" as const,
  prompt_optimizer: true,
};

export class MinimaxHailuo02StandardImageToVideoExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: apiKey });
  }

  /**
   * Generate video from image with default settings
   */
  async generateVideo(input: MinimaxHailuo02StandardImageToVideoInput): Promise<MinimaxHailuo02StandardImageToVideoOutput> {
    try {
      this.validateInput(input);
      const config = this.mergeWithDefaults(input);

      const result = await fal.subscribe(MODEL_ENDPOINT, {
        input: config,
      });

      // Extract video from result
      const video = {
        url: (result as any).video?.url || "",
        content_type: (result as any).video?.content_type,
        file_name: (result as any).video?.file_name,
        file_size: (result as any).video?.file_size,
      };

      return {
        video,
        requestId: (result as any).requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Queue video generation for long-running requests
   */
  async queueVideoGeneration(input: MinimaxHailuo02StandardImageToVideoInput, webhookUrl?: string): Promise<{ requestId: string }> {
    try {
      this.validateInput(input);
      const config = this.mergeWithDefaults(input);

      const { request_id } = await fal.queue.submit(MODEL_ENDPOINT, {
        input: config,
      });

      return { requestId: request_id };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Check the status of a queued request
   */
  async checkQueueStatus(requestId: string): Promise<any> {
    try {
      const status = await fal.queue.status(MODEL_ENDPOINT, {
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
  async getQueueResult(requestId: string): Promise<MinimaxHailuo02StandardImageToVideoOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });
      
      // Extract video from result
      const video = {
        url: (result as any).video?.url || "",
        content_type: (result as any).video?.content_type,
        file_name: (result as any).video?.file_name,
        file_size: (result as any).video?.file_size,
      };

      return {
        video,
        requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate multiple videos in parallel
   */
  async generateMultipleVideos(inputs: MinimaxHailuo02StandardImageToVideoInput[]): Promise<MinimaxHailuo02StandardImageToVideoResult[]> {
    const promises = inputs.map(input => this.generateVideo(input));
    return Promise.allSettled(promises).then(results =>
      results.map(result =>
        result.status === 'fulfilled' ? result.value : { error: 'Failed', message: result.reason?.message || 'Unknown error' }
      )
    );
  }

  /**
   * Calculate the cost for video generation
   */
  calculateCost(duration: number = 6): number {
    if (duration <= 6) {
      return 2.50;
    }
    const additionalSeconds = duration - 6;
    return 2.50 + (additionalSeconds * 0.50);
  }

  /**
   * Get available durations
   */
  getAvailableDurations(): string[] {
    return ["6", "10"];
  }

  /**
   * Get available resolutions
   */
  getAvailableResolutions(): string[] {
    return ["512P", "768P"];
  }

  /**
   * Get model capabilities and information
   */
  getModelInfo() {
    return {
      name: "MiniMax Hailuo-02 Standard Image-to-Video",
      version: "v1.0",
      provider: "MiniMax (via fal.ai)",
      endpoint: MODEL_ENDPOINT,
      capabilities: {
        inputTypes: ["image", "text"],
        outputFormat: "MP4",
        maxVideoSize: "768P",
        maxDuration: "10 seconds",
        supportedDurations: this.getAvailableDurations(),
        supportedResolutions: this.getAvailableResolutions(),
        supportsImageInput: true,
        supportsTextPrompts: true,
        supportsPromptOptimizer: true,
        quality: "Standard",
      },
      pricing: {
        baseCost6s: 2.50,
        costPerAdditionalSecond: 0.50,
        currency: "USD",
        quality: "Standard tier",
      },
    };
  }

  private validateInput(input: MinimaxHailuo02StandardImageToVideoInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (!input.image_url || input.image_url.trim().length === 0) {
      throw new Error("Image URL is required");
    }

    if (input.duration && !["6", "10"].includes(input.duration)) {
      throw new Error("Duration must be one of: 6, 10");
    }

    if (input.resolution && !["512P", "768P"].includes(input.resolution)) {
      throw new Error("Resolution must be one of: 512P, 768P");
    }
  }

  private mergeWithDefaults(input: MinimaxHailuo02StandardImageToVideoInput): MinimaxHailuo02StandardImageToVideoInput {
    return {
      ...DEFAULT_CONFIG,
      ...input,
    };
  }

  private handleError(error: any): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error(typeof error === 'string' ? error : 'Unknown error occurred');
  }
}

export const createMinimaxHailuo02StandardImageToVideoExecutor = (apiKey: string) =>
  new MinimaxHailuo02StandardImageToVideoExecutor(apiKey);
