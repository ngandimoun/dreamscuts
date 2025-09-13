import { fal } from "@fal-ai/client";

// Types for the Bytedance Seedance 1.0 Pro model
export interface SeedanceV1ProInput {
  prompt: string;
  image_url: string;
  resolution?: "480p" | "720p" | "1080p";
  duration?: "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";
  camera_fixed?: boolean;
  seed?: number;
  enable_safety_checker?: boolean;
}

export interface SeedanceV1ProOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  seed?: number;
  requestId?: string;
}

export interface SeedanceV1ProError {
  error: string;
  message: string;
  code?: string;
}

// Union type for handling both success and error cases
export type SeedanceV1ProResult = SeedanceV1ProOutput | SeedanceV1ProError;

// Model configuration
const MODEL_ENDPOINT = "fal-ai/bytedance/seedance/v1/pro/image-to-video";

// Default configuration
const DEFAULT_CONFIG = {
  resolution: "1080p" as const,
  duration: "5" as const,
  enable_safety_checker: true,
};

/**
 * Bytedance Seedance 1.0 Pro Video Generation Executor
 *
 * This executor provides a comprehensive interface for generating videos
 * using Bytedance's Seedance 1.0 Pro model through the fal.ai API. It's optimized for
 * high-quality image-to-video generation with flexible duration and resolution options.
 */
export class SeedanceV1ProExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;

    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Generate video using the Seedance 1.0 Pro model
   * @param input - The input parameters for video generation
   * @returns Promise<SeedanceV1ProOutput> - The generated video and metadata
   */
  async generateVideo(input: SeedanceV1ProInput): Promise<SeedanceV1ProOutput> {
    try {
      // Validate input
      this.validateInput(input);

      // Merge with defaults
      const params = this.mergeWithDefaults(input);

      // Generate video
      const result = await fal.subscribe(MODEL_ENDPOINT, {
        input: params,
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
        seed: (result as any).seed,
        requestId: (result as any).requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate video asynchronously using queue system
   * @param input - The input parameters for video generation
   * @param webhookUrl - Optional webhook URL for notifications
   * @returns Promise<{requestId: string}> - The request ID for tracking
   */
  async queueVideoGeneration(
    input: SeedanceV1ProInput,
    webhookUrl?: string
  ): Promise<{ requestId: string }> {
    try {
      // Validate input
      this.validateInput(input);

      // Merge with defaults
      const params = this.mergeWithDefaults(input);

      // Submit to queue
      const { request_id } = await fal.queue.submit(MODEL_ENDPOINT, {
        input: params,
        webhookUrl,
      });

      return { requestId: request_id };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Check the status of a queued request
   * @param requestId - The request ID from queueVideoGeneration
   * @returns Promise<any> - The current status
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
   * @param requestId - The request ID from queueVideoGeneration
   * @returns Promise<SeedanceV1ProOutput> - The generated video and metadata
   */
  async getQueueResult(requestId: string): Promise<SeedanceV1ProOutput> {
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
        seed: (result as any).seed,
        requestId: (result as any).requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate multiple videos with different inputs
   * @param inputs - Array of input parameters for video generation
   * @returns Promise<SeedanceV1ProResult[]> - Array of results for each input
   */
  async generateMultipleVideos(
    inputs: SeedanceV1ProInput[]
  ): Promise<SeedanceV1ProResult[]> {
    const results: SeedanceV1ProResult[] = [];

    for (const input of inputs) {
      try {
        const result = await this.generateVideo(input);
        results.push(result);
      } catch (error) {
        console.error(`Failed to generate video for prompt: ${input.prompt}`, error);
        results.push({
          error: "Generation failed",
          message: (error as any).message || "Unknown error occurred",
        });
      }
    }

    return results;
  }

  /**
   * Calculate estimated cost for video generation
   * @param resolution - Video resolution (default: "1080p")
   * @param duration - Duration in seconds (default: 5)
   * @returns number - Estimated cost in USD
   */
  calculateCost(resolution: string = "1080p", duration: number = 5): number {
    // Base cost for 1080p 5-second video is $0.62
    if (resolution === "1080p" && duration === 5) {
      return 0.62;
    }

    // For other configurations, calculate based on video tokens
    // tokens(video) = (height x width x FPS x duration) / 1024
    const fps = 30; // Standard FPS
    let height: number, width: number;

    switch (resolution) {
      case "480p":
        height = 480;
        width = 854; // 16:9 aspect ratio
        break;
      case "720p":
        height = 720;
        width = 1280; // 16:9 aspect ratio
        break;
      case "1080p":
        height = 1080;
        width = 1920; // 16:9 aspect ratio
        break;
      default:
        height = 1080;
        width = 1920;
    }

    const tokens = (height * width * fps * duration) / 1024;
    const costPerMillionTokens = 2.5;
    
    return (tokens / 1000000) * costPerMillionTokens;
  }

  /**
   * Calculate video duration based on duration parameter
   * @param duration - Duration string (e.g., "5")
   * @returns number - Duration in seconds
   */
  calculateDuration(duration: string = "5"): number {
    return parseInt(duration);
  }

  /**
   * Get available resolutions
   * @returns string[] - Array of supported resolutions
   */
  getAvailableResolutions(): string[] {
    return ["480p", "720p", "1080p"];
  }

  /**
   * Get available durations
   * @returns string[] - Array of supported durations
   */
  getAvailableDurations(): string[] {
    return ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  }

  /**
   * Validate input parameters
   * @param input - The input parameters to validate
   * @throws Error if validation fails
   */
  private validateInput(input: SeedanceV1ProInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required and cannot be empty");
    }

    if (!input.image_url || input.image_url.trim().length === 0) {
      throw new Error("Image URL is required and cannot be empty");
    }

    // Validate URL format
    try {
      new URL(input.image_url);
    } catch {
      throw new Error("Image URL must be a valid URL");
    }

    if (input.resolution && !["480p", "720p", "1080p"].includes(input.resolution)) {
      throw new Error("Resolution must be one of: 480p, 720p, 1080p");
    }

    if (input.duration && !["3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].includes(input.duration)) {
      throw new Error("Duration must be one of: 3, 4, 5, 6, 7, 8, 9, 10, 11, 12");
    }

    if (input.seed !== undefined && input.seed !== -1 && (input.seed < 0 || input.seed > 2147483647)) {
      throw new Error("Seed must be -1 for random or a positive integer within valid range");
    }

    if (input.camera_fixed !== undefined && typeof input.camera_fixed !== "boolean") {
      throw new Error("camera_fixed must be a boolean");
    }

    if (input.enable_safety_checker !== undefined && typeof input.enable_safety_checker !== "boolean") {
      throw new Error("enable_safety_checker must be a boolean");
    }
  }

  /**
   * Merge input with default values
   * @param input - The user input
   * @returns SeedanceV1ProInput - Merged input with defaults
   */
  private mergeWithDefaults(input: SeedanceV1ProInput): SeedanceV1ProInput {
    return {
      ...DEFAULT_CONFIG,
      ...input,
    };
  }

  /**
   * Handle and format errors consistently
   * @param error - The error to handle
   * @returns Error - Formatted error
   */
  private handleError(error: any): Error {
    if (error instanceof Error) {
      return error;
    }

    // Handle fal.ai specific errors
    if (error?.message) {
      return new Error(error.message);
    }

    if (error?.error) {
      return new Error(error.error);
    }

    return new Error("An unknown error occurred during video generation");
  }

  /**
   * Get model information and capabilities
   * @returns object - Model information
   */
  getModelInfo() {
    return {
      name: "Bytedance Seedance 1.0 Pro",
      version: "v1.0",
      provider: "Bytedance",
      endpoint: MODEL_ENDPOINT,
      capabilities: {
        inputTypes: ["image", "text"],
        outputFormat: "MP4",
        supportedResolutions: ["480p", "720p", "1080p"],
        supportedDurations: ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        maxDuration: 12,
        defaultDuration: 5,
        supportsSeedControl: true,
        supportsCameraControl: true,
        supportsSafetyChecker: true,
        quality: "Professional",
      },
      pricing: {
        baseCost1080p5s: 0.62,
        costPerMillionTokens: 2.5,
        currency: "USD",
        quality: "Professional tier",
      },
    };
  }
}

// Export default instance creator
export const createSeedanceV1ProExecutor = (apiKey: string) =>
  new SeedanceV1ProExecutor(apiKey);


