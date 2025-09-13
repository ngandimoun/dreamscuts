import { fal } from "@fal-ai/client";

export interface PikaV2TurboImageToVideoInput {
  image_url: string;
  prompt: string;
  seed?: number;
  negative_prompt?: string;
  resolution?: "720p" | "1080p";
  duration?: number;
}

export interface PikaV2TurboImageToVideoOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  requestId?: string;
}

export interface PikaV2TurboImageToVideoError {
  error: string;
  message: string;
  code?: string;
}

export type PikaV2TurboImageToVideoResult = PikaV2TurboImageToVideoOutput | PikaV2TurboImageToVideoError;

const MODEL_ENDPOINT = "fal-ai/pika/v2/turbo/image-to-video";

const DEFAULT_CONFIG = {
  resolution: "720p" as const,
  duration: 5,
  negative_prompt: "",
};

export class PikaV2TurboImageToVideoExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: apiKey });
  }

  /**
   * Generate video from image input
   */
  async generateVideo(input: PikaV2TurboImageToVideoInput): Promise<PikaV2TurboImageToVideoOutput> {
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
  async queueVideoGeneration(input: PikaV2TurboImageToVideoInput, webhookUrl?: string): Promise<{ requestId: string }> {
    try {
      this.validateInput(input);
      const config = this.mergeWithDefaults(input);

      const { request_id } = await fal.queue.submit(MODEL_ENDPOINT, {
        input: config,
        webhookUrl,
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
  async getQueueResult(requestId: string): Promise<PikaV2TurboImageToVideoOutput> {
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
  async generateMultipleVideos(inputs: PikaV2TurboImageToVideoInput[]): Promise<PikaV2TurboImageToVideoResult[]> {
    const promises = inputs.map(input => this.generateVideo(input));
    return Promise.allSettled(promises).then(results =>
      results.map(result =>
        result.status === 'fulfilled' ? result.value : { error: 'Failed', message: result.reason?.message || 'Unknown error' }
      )
    );
  }

  /**
   * Calculate the cost for video generation
   * Fixed cost: $0.20 per video regardless of resolution or duration
   */
  calculateCost(): number {
    return 0.20; // Fixed cost per video
  }

  /**
   * Get available resolution options
   */
  getAvailableResolutions(): string[] {
    return ["720p", "1080p"];
  }

  /**
   * Get available duration options
   */
  getAvailableDurations(): number[] {
    return [5]; // Currently only supports 5 seconds
  }

  /**
   * Get model capabilities and information
   */
  getModelInfo() {
    return {
      name: "Pika v2 Turbo Image-to-Video",
      version: "v2.0",
      provider: "Pika (via fal.ai)",
      endpoint: MODEL_ENDPOINT,
      capabilities: {
        inputTypes: ["image_url", "prompt"],
        outputFormat: "MP4",
        resolution: "720p or 1080p",
        frameRate: "Standard frame rate",
        videoDuration: "5 seconds",
        supportsImageInput: true,
        supportsTextPrompt: true,
        supportsNegativePrompt: true,
        supportsSeedControl: true,
        quality: "High-quality image-to-video transformation",
      },
      pricing: {
        cost: 0.20,
        currency: "USD",
        billingModel: "per_video",
        notes: "Fixed cost of $0.20 per video regardless of resolution or duration"
      },
      features: {
        imageToVideo: "Transform static images into dynamic videos",
        turboOptimization: "Optimized for faster generation",
        resolutionOptions: "Choose between 720p and 1080p",
        promptControl: "Text prompts guide video generation",
        negativePrompts: "Avoid unwanted elements with negative prompts",
        seedControl: "Reproducible results with seed values",
        durationControl: "5-second video output",
        costEffective: "Fixed pricing regardless of complexity"
      },
    };
  }

  /**
   * Get optimal settings for different use cases
   */
  getOptimalSettings(useCase: string): Partial<PikaV2TurboImageToVideoInput> {
    switch (useCase.toLowerCase()) {
      case "cost_effective":
        return {
          resolution: "720p",
          duration: 5,
        };
      case "high_quality":
        return {
          resolution: "1080p",
          duration: 5,
        };
      case "social_media":
        return {
          resolution: "720p",
          duration: 5,
        };
      case "professional":
        return {
          resolution: "1080p",
          duration: 5,
        };
      default:
        return DEFAULT_CONFIG;
    }
  }

  /**
   * Get cost comparison for different resolutions
   */
  getCostComparison(): { resolution: string; cost: number; quality: string; bestFor: string }[] {
    return [
      {
        resolution: "720p",
        cost: 0.20,
        quality: "High",
        bestFor: "Social media, cost-effective projects, standard quality needs"
      },
      {
        resolution: "1080p",
        cost: 0.20,
        quality: "Premium",
        bestFor: "Professional content, marketing materials, high-quality requirements"
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
   * Validate if a duration is supported
   */
  isDurationSupported(duration: number): boolean {
    return this.getAvailableDurations().includes(duration);
  }

  /**
   * Get prompt optimization tips for better video generation
   */
  getPromptOptimizationTips(): string[] {
    return [
      "Be specific about the motion you want to see",
      "Describe the desired emotional tone and atmosphere",
      "Include details about camera movement if desired",
      "Specify the speed and intensity of animations",
      "Use descriptive language for visual elements",
      "Consider the relationship between the image and prompt",
      "Keep prompts concise but descriptive",
      "Use action verbs to describe desired movement"
    ];
  }

  /**
   * Get negative prompt suggestions for common use cases
   */
  getNegativePromptSuggestions(): string[] {
    return [
      "blurry, low quality, distorted, deformed",
      "watermark, text, logo, signature",
      "multiple people, crowd, group",
      "nude, inappropriate, adult content",
      "cartoon, anime, illustration, painting",
      "black and white, monochrome",
      "fast motion, rapid movement, jittery"
    ];
  }

  /**
   * Get example prompts for different scenarios
   */
  getExamplePrompts(): { scenario: string; prompt: string; description: string }[] {
    return [
      {
        scenario: "Portrait Animation",
        prompt: "a person looking into camera slowly smiling",
        description: "Subtle facial expression animation"
      },
      {
        scenario: "Nature Movement",
        prompt: "leaves gently swaying in the breeze",
        description: "Natural environmental movement"
      },
      {
        scenario: "Product Showcase",
        prompt: "product slowly rotating to show all angles",
        description: "Professional product presentation"
      },
      {
        scenario: "Action Scene",
        prompt: "dramatic camera movement around the subject",
        description: "Dynamic cinematic movement"
      }
    ];
  }

  private validateInput(input: PikaV2TurboImageToVideoInput): void {
    if (!input.image_url || input.image_url.trim().length === 0) {
      throw new Error("Image URL is required");
    }

    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (input.prompt.length > 1000) {
      throw new Error("Prompt must be under 1000 characters");
    }

    if (input.resolution && !this.isResolutionSupported(input.resolution)) {
      throw new Error(`Resolution must be one of: ${this.getAvailableResolutions().join(", ")}`);
    }

    if (input.duration && !this.isDurationSupported(input.duration)) {
      throw new Error(`Duration must be one of: ${this.getAvailableDurations().join(", ")} seconds`);
    }

    if (input.seed !== undefined && (input.seed < 0 || input.seed > 2147483647)) {
      throw new Error("Seed must be between 0 and 2147483647");
    }
  }

  private mergeWithDefaults(input: PikaV2TurboImageToVideoInput): PikaV2TurboImageToVideoInput {
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

export const createPikaV2TurboImageToVideoExecutor = (apiKey: string) =>
  new PikaV2TurboImageToVideoExecutor(apiKey);
