import { fal } from "@fal-ai/client";

export interface KlingVideoV21MasterImageToVideoInput {
  prompt: string;
  image_url: string;
  duration?: "5" | "10";
  negative_prompt?: string;
  cfg_scale?: number;
}

export interface KlingVideoV21MasterImageToVideoOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  requestId?: string;
}

export interface KlingVideoV21MasterImageToVideoError {
  error: string;
  message: string;
  code?: string;
}

export type KlingVideoV21MasterImageToVideoResult = KlingVideoV21MasterImageToVideoOutput | KlingVideoV21MasterImageToVideoError;

const MODEL_ENDPOINT = "fal-ai/kling-video/v2.1/master/image-to-video";

const DEFAULT_CONFIG = {
  duration: "5" as const,
  negative_prompt: "blur, distort, and low quality",
  cfg_scale: 0.5,
};

export class KlingVideoV21MasterImageToVideoExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: apiKey });
  }

  /**
   * Generate video from image with prompt
   */
  async generateVideo(input: KlingVideoV21MasterImageToVideoInput): Promise<KlingVideoV21MasterImageToVideoOutput> {
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
  async queueVideoGeneration(input: KlingVideoV21MasterImageToVideoInput, webhookUrl?: string): Promise<{ requestId: string }> {
    try {
      this.validateInput(input);
      const config = this.mergeWithDefaults(input);

      const { request_id } = await fal.queue.submit(MODEL_ENDPOINT, {
        input: config,
        // webhook: webhookUrl, // Webhook support may vary by model endpoint
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
  async getQueueResult(requestId: string): Promise<KlingVideoV21MasterImageToVideoOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });
      
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
   * Generate multiple videos from different inputs
   */
  async generateMultipleVideos(inputs: KlingVideoV21MasterImageToVideoInput[]): Promise<KlingVideoV21MasterImageToVideoResult[]> {
    const promises = inputs.map(input => this.generateVideo(input));
    return Promise.allSettled(promises).then(results =>
      results.map(result =>
        result.status === 'fulfilled' ? result.value : { error: 'Failed', message: result.reason?.message || 'Unknown error' }
      )
    );
  }

  /**
   * Calculate the cost for video generation
   * Cost: $1.40 for 5s, $0.28 for each additional second
   */
  calculateCost(durationSeconds: number): number {
    if (durationSeconds <= 5) {
      return 1.40;
    }
    const additionalSeconds = durationSeconds - 5;
    return 1.40 + (additionalSeconds * 0.28);
  }

  /**
   * Get available duration options
   */
  getAvailableDurations(): string[] {
    return ["5", "10"];
  }

  /**
   * Get model capabilities and information
   */
  getModelInfo() {
    return {
      name: "Kling Video v2.1 Master Image-to-Video",
      version: "v2.1",
      provider: "Kling AI (via fal.ai)",
      endpoint: MODEL_ENDPOINT,
      capabilities: {
        inputTypes: ["image", "text"],
        outputFormat: "MP4",
        resolution: "High-quality cinematic output",
        frameRate: "Professional frame rate",
        videoDuration: "5 or 10 seconds",
        supportsImageInput: true,
        supportsTextPrompts: true,
        supportsNegativePrompts: true,
        supportsCFGScale: true,
        quality: "Premium tier with unparalleled motion fluidity",
      },
      pricing: {
        baseCost: 1.40,
        costPerAdditionalSecond: 0.28,
        currency: "USD",
        billingModel: "base + per_second",
        examples: {
          "5_seconds": "$1.40",
          "10_seconds": "$2.52",
        },
      },
      features: {
        motionFluidity: "Unparalleled motion fluidity",
        cinematicVisuals: "Top-tier cinematic visuals",
        promptPrecision: "Exceptional prompt precision",
        negativePrompts: "Custom negative prompt support",
        cfgScale: "CFG scale control for prompt adherence",
      },
    };
  }

  /**
   * Get recommended CFG scale values
   */
  getRecommendedCFGScales(): { value: number; description: string }[] {
    return [
      { value: 0.5, description: "Default - Balanced creativity and adherence" },
      { value: 0.3, description: "More creative, less prompt adherence" },
      { value: 0.7, description: "More prompt adherence, less creativity" },
      { value: 1.0, description: "Maximum prompt adherence" },
    ];
  }

  /**
   * Get recommended negative prompts
   */
  getRecommendedNegativePrompts(): string[] {
    return [
      "blur, distort, and low quality",
      "low quality, blurry, distorted",
      "poor quality, artifacts, noise",
      "blurry, low resolution, distorted",
      "bad quality, blur, artifacts",
    ];
  }

  private validateInput(input: KlingVideoV21MasterImageToVideoInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (!input.image_url || input.image_url.trim().length === 0) {
      throw new Error("Image URL is required");
    }

    // Validate image URL format
    try {
      new URL(input.image_url);
    } catch {
      throw new Error("Image URL must be a valid URL");
    }

    if (input.duration && !["5", "10"].includes(input.duration)) {
      throw new Error("Duration must be either '5' or '10'");
    }

    if (input.cfg_scale !== undefined && (input.cfg_scale < 0 || input.cfg_scale > 1)) {
      throw new Error("CFG scale must be between 0 and 1");
    }
  }

  private mergeWithDefaults(input: KlingVideoV21MasterImageToVideoInput): KlingVideoV21MasterImageToVideoInput {
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

export const createKlingVideoV21MasterImageToVideoExecutor = (apiKey: string) =>
  new KlingVideoV21MasterImageToVideoExecutor(apiKey);
