import { fal } from "@fal-ai/client";

export interface WanV22A14bTextToVideoLoraInput {
  prompt: string;
  negative_prompt?: string;
  num_frames?: number;
  num_inference_steps?: number;
  guidance_scale?: number;
  seed?: number;
  width?: number;
  height?: number;
  lora_scale?: number;
  lora_weights?: string;
}

export interface WanV22A14bTextToVideoLoraOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  requestId?: string;
}

export interface WanV22A14bTextToVideoLoraError {
  error: string;
  message: string;
  code?: string;
}

export type WanV22A14bTextToVideoLoraResult = WanV22A14bTextToVideoLoraOutput | WanV22A14bTextToVideoLoraError;

const MODEL_ENDPOINT = "fal-ai/wan/v2.2-a14b/text-to-video/lora";

const DEFAULT_CONFIG = {
  num_frames: 24,
  num_inference_steps: 50,
  guidance_scale: 7.5,
  width: 1024,
  height: 576,
  lora_scale: 1.0,
};

export class WanV22A14bTextToVideoLoraExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: apiKey });
  }

  /**
   * Generate video from text prompt with LoRA support
   */
  async generateVideo(input: WanV22A14bTextToVideoLoraInput): Promise<WanV22A14bTextToVideoLoraOutput> {
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
  async queueVideoGeneration(input: WanV22A14bTextToVideoLoraInput, webhookUrl?: string): Promise<{ requestId: string }> {
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
  async getQueueResult(requestId: string): Promise<WanV22A14bTextToVideoLoraOutput> {
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
  async generateMultipleVideos(inputs: WanV22A14bTextToVideoLoraInput[]): Promise<WanV22A14bTextToVideoLoraResult[]> {
    const promises = inputs.map(input => this.generateVideo(input));
    return Promise.allSettled(promises).then(results =>
      results.map(result =>
        result.status === 'fulfilled' ? result.value : { error: 'Failed', message: result.reason?.message || 'Unknown error' }
      )
    );
  }

  /**
   * Calculate the cost for video generation
   * Cost: $0.50 per video (fixed price)
   */
  calculateCost(): number {
    return 0.50;
  }

  /**
   * Get available frame count options
   */
  getAvailableFrameCounts(): number[] {
    return [16, 24, 32, 48, 64];
  }

  /**
   * Get available resolution options
   */
  getAvailableResolutions(): { width: number; height: number; aspectRatio: string }[] {
    return [
      { width: 512, height: 512, aspectRatio: "1:1" },
      { width: 768, height: 432, aspectRatio: "16:9" },
      { width: 1024, height: 576, aspectRatio: "16:9" },
      { width: 1024, height: 1024, aspectRatio: "1:1" },
      { width: 1280, height: 720, aspectRatio: "16:9" },
      { width: 1536, height: 864, aspectRatio: "16:9" },
    ];
  }

  /**
   * Get recommended LoRA weights for different styles
   */
  getRecommendedLoraWeights(): { name: string; description: string; url?: string }[] {
    return [
      { name: "anime", description: "Anime and manga style" },
      { name: "realistic", description: "Photorealistic style" },
      { name: "artistic", description: "Artistic and painterly style" },
      { name: "cinematic", description: "Cinematic and film-like style" },
      { name: "cartoon", description: "Cartoon and comic style" },
    ];
  }

  /**
   * Get model capabilities and information
   */
  getModelInfo() {
    return {
      name: "WAN v2.2 A14B Text-to-Video LoRA",
      version: "v2.2-a14b",
      provider: "WAN (via fal.ai)",
      endpoint: MODEL_ENDPOINT,
      capabilities: {
        inputTypes: ["text"],
        outputFormat: "MP4",
        resolution: "Up to 1536x864",
        frameRate: "Variable based on num_frames",
        videoDuration: "Variable based on num_frames",
        supportsTextPrompts: true,
        supportsNegativePrompts: true,
        supportsLoRA: true,
        supportsCustomResolutions: true,
        supportsSeedControl: true,
        quality: "High-quality text-to-video generation with LoRA fine-tuning",
      },
      pricing: {
        costPerVideo: 0.50,
        currency: "USD",
        billingModel: "per_video",
        examples: {
          "single_video": "$0.50",
          "ten_videos": "$5.00",
          "hundred_videos": "$50.00"
        },
        notes: "Fixed price per video regardless of complexity or resolution"
      },
      features: {
        textToVideo: "Generate videos from text descriptions",
        loraSupport: "Low-Rank Adaptation for fine-tuned style control",
        resolutionControl: "Customizable output dimensions",
        frameControl: "Adjustable number of frames and inference steps",
        seedControl: "Reproducible results with seed values",
        guidanceControl: "Classifier-Free Guidance scale adjustment"
      },
    };
  }

  /**
   * Validate if a resolution is supported
   */
  isResolutionSupported(width: number, height: number): boolean {
    const resolutions = this.getAvailableResolutions();
    return resolutions.some(res => res.width === width && res.height === height);
  }

  /**
   * Get optimal settings for a specific use case
   */
  getOptimalSettings(useCase: string): Partial<WanV22A14bTextToVideoLoraInput> {
    switch (useCase.toLowerCase()) {
      case "fast":
        return {
          num_frames: 16,
          num_inference_steps: 25,
          guidance_scale: 7.0,
        };
      case "quality":
        return {
          num_frames: 48,
          num_inference_steps: 75,
          guidance_scale: 8.0,
        };
      case "balanced":
        return {
          num_frames: 24,
          num_inference_steps: 50,
          guidance_scale: 7.5,
        };
      case "cinematic":
        return {
          num_frames: 64,
          num_inference_steps: 100,
          guidance_scale: 8.5,
          width: 1280,
          height: 720,
        };
      default:
        return DEFAULT_CONFIG;
    }
  }

  private validateInput(input: WanV22A14bTextToVideoLoraInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (input.prompt.length > 1000) {
      throw new Error("Prompt must be under 1000 characters");
    }

    if (input.num_frames && !this.getAvailableFrameCounts().includes(input.num_frames)) {
      throw new Error(`Number of frames must be one of: ${this.getAvailableFrameCounts().join(", ")}`);
    }

    if (input.num_inference_steps && (input.num_inference_steps < 10 || input.num_inference_steps > 200)) {
      throw new Error("Number of inference steps must be between 10 and 200");
    }

    if (input.guidance_scale && (input.guidance_scale < 1.0 || input.guidance_scale > 20.0)) {
      throw new Error("Guidance scale must be between 1.0 and 20.0");
    }

    if (input.seed && (input.seed < 0 || input.seed > 2147483647)) {
      throw new Error("Seed must be between 0 and 2147483647");
    }

    if (input.width && input.height) {
      if (!this.isResolutionSupported(input.width, input.height)) {
        throw new Error(`Resolution ${input.width}x${input.height} is not supported. Use one of: ${this.getAvailableResolutions().map(r => `${r.width}x${r.height}`).join(", ")}`);
      }
    }

    if (input.lora_scale && (input.lora_scale < 0.0 || input.lora_scale > 2.0)) {
      throw new Error("LoRA scale must be between 0.0 and 2.0");
    }

    if (input.lora_weights && input.lora_weights.trim().length === 0) {
      throw new Error("LoRA weights URL cannot be empty if provided");
    }
  }

  private mergeWithDefaults(input: WanV22A14bTextToVideoLoraInput): WanV22A14bTextToVideoLoraInput {
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

export const createWanV22A14bTextToVideoLoraExecutor = (apiKey: string) =>
  new WanV22A14bTextToVideoLoraExecutor(apiKey);
