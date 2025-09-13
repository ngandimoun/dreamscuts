import { fal } from "@fal-ai/client";

export interface KlingVideoV16ProInput {
  prompt: string;
  image_url: string;
  duration?: "5" | "10";
  aspect_ratio?: "16:9" | "9:16" | "1:1";
  tail_image_url?: string;
  negative_prompt?: string;
  cfg_scale?: number;
}

export interface KlingVideoV16ProOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  requestId?: string;
}

export interface KlingVideoV16ProError {
  error: string;
  message: string;
  code?: string;
}

export type KlingVideoV16ProResult = KlingVideoV16ProOutput | KlingVideoV16ProError;

const MODEL_ENDPOINT = "fal-ai/kling-video/v1.6/pro/image-to-video";

const DEFAULT_CONFIG = {
  duration: "5" as const,
  aspect_ratio: "16:9" as const,
  negative_prompt: "blur, distort, and low quality",
  cfg_scale: 0.5,
};

export class KlingVideoV16ProExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: apiKey });
  }

  /**
   * Generate video from image with default settings
   */
  async generateVideo(input: KlingVideoV16ProInput): Promise<KlingVideoV16ProOutput> {
    try {
      this.validateInput(input);
      const config = this.mergeWithDefaults(input);

      const result = await fal.subscribe(MODEL_ENDPOINT, {
        input: config,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs?.forEach((log) => console.log(log.message));
          }
        },
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
  async queueVideoGeneration(input: KlingVideoV16ProInput, webhookUrl?: string): Promise<{ requestId: string }> {
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
  async getQueueResult(requestId: string): Promise<KlingVideoV16ProOutput> {
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
  async generateMultipleVideos(inputs: KlingVideoV16ProInput[]): Promise<KlingVideoV16ProResult[]> {
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
  calculateCost(duration: number = 5): number {
    const costPerSecond = 0.095;
    return duration * costPerSecond;
  }

  /**
   * Get available durations
   */
  getAvailableDurations(): string[] {
    return ["5", "10"];
  }

  /**
   * Get available aspect ratios
   */
  getAvailableAspectRatios(): string[] {
    return ["16:9", "9:16", "1:1"];
  }

  /**
   * Get model capabilities and information
   */
  getModelInfo() {
    return {
      name: "Kling AI v1.6 Pro Image-to-Video",
      version: "v1.6",
      provider: "Kling AI (via fal.ai)",
      endpoint: MODEL_ENDPOINT,
      capabilities: {
        inputTypes: ["image", "text"],
        outputFormat: "MP4",
        maxVideoSize: "1080p",
        maxDuration: "10 seconds",
        supportedDurations: this.getAvailableDurations(),
        supportedAspectRatios: this.getAvailableAspectRatios(),
        supportsImageInput: true,
        supportsTextPrompts: true,
        supportsAspectRatioControl: true,
        supportsDurationControl: true,
        supportsNegativePrompts: true,
        supportsCfgScale: true,
        supportsTailImages: true,
        quality: "Professional",
      },
      pricing: {
        costPerSecond: 0.095,
        currency: "USD",
        quality: "Professional tier",
        example5s: "$0.475 for 5-second video",
        example10s: "$0.95 for 10-second video",
      },
    };
  }

  private validateInput(input: KlingVideoV16ProInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (!input.image_url || input.image_url.trim().length === 0) {
      throw new Error("Image URL is required");
    }

    if (input.duration && !["5", "10"].includes(input.duration)) {
      throw new Error("Duration must be one of: 5, 10");
    }

    if (input.aspect_ratio && !["16:9", "9:16", "1:1"].includes(input.aspect_ratio)) {
      throw new Error("Aspect ratio must be one of: 16:9, 9:16, 1:1");
    }

    if (input.cfg_scale !== undefined && (input.cfg_scale < 0 || input.cfg_scale > 1)) {
      throw new Error("CFG scale must be between 0 and 1");
    }
  }

  private mergeWithDefaults(input: KlingVideoV16ProInput): KlingVideoV16ProInput {
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

export const createKlingVideoV16ProExecutor = (apiKey: string) =>
  new KlingVideoV16ProExecutor(apiKey);
