import { fal } from "@fal-ai/client";

export interface WanV22A14bTextToVideoTurboInput {
  prompt: string;
  seed?: number;
  resolution?: "480p" | "580p" | "720p";
  aspect_ratio?: "16:9" | "9:16" | "1:1";
  enable_safety_checker?: boolean;
  enable_prompt_expansion?: boolean;
  acceleration?: "none" | "regular";
}

export interface WanV22A14bTextToVideoTurboOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  prompt: string;
  seed: number;
  requestId?: string;
}

export interface WanV22A14bTextToVideoTurboError {
  error: string;
  message: string;
  code?: string;
}

export type WanV22A14bTextToVideoTurboResult = WanV22A14bTextToVideoTurboOutput | WanV22A14bTextToVideoTurboError;

const MODEL_ENDPOINT = "fal-ai/wan/v2.2-a14b/text-to-video/turbo";

const DEFAULT_CONFIG = {
  resolution: "720p" as const,
  aspect_ratio: "16:9" as const,
  enable_safety_checker: true,
  enable_prompt_expansion: false,
  acceleration: "regular" as const,
};

export class WanV22A14bTextToVideoTurboExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: apiKey });
  }

  /**
   * Generate video from text prompt
   */
  async generateVideo(input: WanV22A14bTextToVideoTurboInput): Promise<WanV22A14bTextToVideoTurboOutput> {
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
        prompt: (result as any).prompt || "",
        seed: (result as any).seed || 0,
        requestId: (result as any).requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Queue video generation for long-running requests
   */
  async queueVideoGeneration(input: WanV22A14bTextToVideoTurboInput, webhookUrl?: string): Promise<{ requestId: string }> {
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
  async getQueueResult(requestId: string): Promise<WanV22A14bTextToVideoTurboOutput> {
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
        prompt: (result as any).prompt || "",
        seed: (result as any).seed || 0,
        requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate multiple videos from different inputs
   */
  async generateMultipleVideos(inputs: WanV22A14bTextToVideoTurboInput[]): Promise<WanV22A14bTextToVideoTurboResult[]> {
    const promises = inputs.map(input => this.generateVideo(input));
    return Promise.allSettled(promises).then(results =>
      results.map(result =>
        result.status === 'fulfilled' ? result.value : { error: 'Failed', message: result.reason?.message || 'Unknown error' }
      )
    );
  }

  /**
   * Calculate the cost for video generation based on resolution
   * Cost: $0.10 for 720p, $0.075 for 580p, $0.05 for 480p
   */
  calculateCost(resolution: "480p" | "580p" | "720p" = "720p"): number {
    const costs = {
      "480p": 0.05,
      "580p": 0.075,
      "720p": 0.10,
    };
    return costs[resolution];
  }

  /**
   * Get available resolution options
   */
  getAvailableResolutions(): string[] {
    return ["480p", "580p", "720p"];
  }

  /**
   * Get available aspect ratio options
   */
  getAvailableAspectRatios(): string[] {
    return ["16:9", "9:16", "1:1"];
  }

  /**
   * Get available acceleration options
   */
  getAvailableAccelerationOptions(): string[] {
    return ["none", "regular"];
  }

  /**
   * Get model capabilities and information
   */
  getModelInfo() {
    return {
      name: "WAN v2.2 A14B Text-to-Video Turbo",
      version: "v2.2-a14b-turbo",
      provider: "WAN (via fal.ai)",
      endpoint: MODEL_ENDPOINT,
      capabilities: {
        inputTypes: ["text"],
        outputFormat: "MP4",
        resolution: "480p, 580p, or 720p",
        frameRate: "Standard frame rate",
        videoDuration: "Variable based on generation",
        supportsTextPrompts: true,
        supportsSafetyChecker: true,
        supportsPromptExpansion: true,
        supportsAcceleration: true,
        quality: "High-quality text-to-video generation with turbo optimization",
      },
      pricing: {
        costPerVideo: {
          "480p": 0.05,
          "580p": 0.075,
          "720p": 0.10,
        },
        currency: "USD",
        billingModel: "per_video_tiered",
        examples: {
          "480p_video": "$0.05",
          "580p_video": "$0.075",
          "720p_video": "$0.10",
          "ten_720p_videos": "$1.00",
          "hundred_480p_videos": "$5.00"
        },
        notes: "Cost varies based on output resolution. Higher resolution = higher cost."
      },
      features: {
        textToVideo: "Generate videos from text descriptions",
        turboOptimization: "Faster generation with optimized processing",
        resolutionControl: "Multiple resolution options with tiered pricing",
        safetyFeatures: "Built-in safety checker for content moderation",
        promptEnhancement: "Optional prompt expansion for better results",
        accelerationControl: "Configurable acceleration levels for speed/quality trade-offs"
      },
    };
  }

  /**
   * Get optimal settings for different use cases
   */
  getOptimalSettings(useCase: string): Partial<WanV22A14bTextToVideoTurboInput> {
    switch (useCase.toLowerCase()) {
      case "fast":
        return {
          resolution: "480p",
          acceleration: "regular",
          enable_prompt_expansion: false,
        };
      case "quality":
        return {
          resolution: "720p",
          acceleration: "none",
          enable_prompt_expansion: true,
        };
      case "balanced":
        return {
          resolution: "580p",
          acceleration: "regular",
          enable_prompt_expansion: false,
        };
      case "cost_effective":
        return {
          resolution: "480p",
          acceleration: "regular",
          enable_safety_checker: true,
        };
      default:
        return DEFAULT_CONFIG;
    }
  }

  /**
   * Get cost comparison for different resolutions
   */
  getCostComparison(): { resolution: string; cost: number; savings: string }[] {
    const baseCost = 0.10; // 720p cost
    return [
      {
        resolution: "720p",
        cost: 0.10,
        savings: "Base price"
      },
      {
        resolution: "580p",
        cost: 0.075,
        savings: "25% savings"
      },
      {
        resolution: "480p",
        cost: 0.05,
        savings: "50% savings"
      }
    ];
  }

  /**
   * Validate if a resolution is supported
   */
  isResolutionSupported(resolution: string): boolean {
    return this.getAvailableResolutions().includes(resolution);
  }

  /**
   * Validate if an aspect ratio is supported
   */
  isAspectRatioSupported(aspectRatio: string): boolean {
    return this.getAvailableAspectRatios().includes(aspectRatio);
  }

  private validateInput(input: WanV22A14bTextToVideoTurboInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (input.prompt.length > 1000) {
      throw new Error("Prompt must be under 1000 characters");
    }

    if (input.seed && (input.seed < 0 || input.seed > 2147483647)) {
      throw new Error("Seed must be between 0 and 2147483647");
    }

    if (input.resolution && !this.isResolutionSupported(input.resolution)) {
      throw new Error(`Resolution must be one of: ${this.getAvailableResolutions().join(", ")}`);
    }

    if (input.aspect_ratio && !this.isAspectRatioSupported(input.aspect_ratio)) {
      throw new Error(`Aspect ratio must be one of: ${this.getAvailableAspectRatios().join(", ")}`);
    }

    if (input.acceleration && !this.getAvailableAccelerationOptions().includes(input.acceleration)) {
      throw new Error(`Acceleration must be one of: ${this.getAvailableAccelerationOptions().join(", ")}`);
    }
  }

  private mergeWithDefaults(input: WanV22A14bTextToVideoTurboInput): WanV22A14bTextToVideoTurboInput {
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

export const createWanV22A14bTextToVideoTurboExecutor = (apiKey: string) =>
  new WanV22A14bTextToVideoTurboExecutor(apiKey);
