import { fal } from "@fal-ai/client";

// Types for the Google Veo 2 Image-to-Video model
export interface Veo2ImageToVideoInput {
  prompt: string;
  image_url: string;
  aspect_ratio?: "16:9" | "9:16" | "1:1";
  duration?: "5s" | "6s" | "7s" | "8s";
}

export interface Veo2ImageToVideoOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  requestId?: string;
}

export interface Veo2ImageToVideoError {
  error: string;
  message: string;
  code?: string;
}

// Union type for handling both success and error cases
export type Veo2ImageToVideoResult = Veo2ImageToVideoOutput | Veo2ImageToVideoError;

// Model configuration
const MODEL_ENDPOINT = "fal-ai/veo2/image-to-video";

// Default configuration
const DEFAULT_CONFIG = {
  aspect_ratio: "16:9" as const,
  duration: "5s" as const,
};

/**
 * Google Veo 2 Image-to-Video Generation Executor
 *
 * This executor provides a comprehensive interface for generating videos
 * using Google's Veo 2 model through the fal.ai API. It's optimized for
 * high-quality image-to-video generation with realistic motion and natural animations.
 */
export class Veo2ImageToVideoExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;

    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Generate video using the Veo 2 model
   * @param input - The input parameters for video generation
   * @returns Promise<Veo2ImageToVideoOutput> - The generated video and metadata
   */
  async generateVideo(input: Veo2ImageToVideoInput): Promise<Veo2ImageToVideoOutput> {
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
    input: Veo2ImageToVideoInput,
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
   * @returns Promise<Veo2ImageToVideoOutput> - The generated video and metadata
   */
  async getQueueResult(requestId: string): Promise<Veo2ImageToVideoOutput> {
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
        requestId: (result as any).requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate multiple videos with different inputs
   * @param inputs - Array of input parameters for video generation
   * @returns Promise<Veo2ImageToVideoResult[]> - Array of results for each input
   */
  async generateMultipleVideos(
    inputs: Veo2ImageToVideoInput[]
  ): Promise<Veo2ImageToVideoResult[]> {
    const results: Veo2ImageToVideoResult[] = [];

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
   * @param duration - Duration in seconds (default: 5)
   * @returns number - Estimated cost in USD
   */
  calculateCost(duration: number = 5): number {
    // Veo 2 pricing: $2.50 for 5s, $0.50 for each additional second
    if (duration <= 5) {
      return 2.50;
    }
    const additionalSeconds = duration - 5;
    return 2.50 + (additionalSeconds * 0.50);
  }

  /**
   * Calculate video duration based on duration parameter
   * @param duration - Duration string (e.g., "5s")
   * @returns number - Duration in seconds
   */
  calculateDuration(duration: string = "5s"): number {
    return parseInt(duration.replace("s", ""));
  }

  /**
   * Get available aspect ratios
   * @returns string[] - Array of supported aspect ratios
   */
  getAvailableAspectRatios(): string[] {
    return ["16:9", "9:16", "1:1"];
  }

  /**
   * Get available durations
   * @returns string[] - Array of supported durations
   */
  getAvailableDurations(): string[] {
    return ["5s", "6s", "7s", "8s"];
  }

  /**
   * Get model resolution
   * @returns string - Model resolution
   */
  getResolution(): string {
    return "720p";
  }

  /**
   * Validate input parameters
   * @param input - The input parameters to validate
   * @throws Error if validation fails
   */
  private validateInput(input: Veo2ImageToVideoInput): void {
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

    if (input.aspect_ratio && !["16:9", "9:16", "1:1"].includes(input.aspect_ratio)) {
      throw new Error("Aspect ratio must be one of: 16:9, 9:16, 1:1");
    }

    if (input.duration && !["5s", "6s", "7s", "8s"].includes(input.duration)) {
      throw new Error("Duration must be one of: 5s, 6s, 7s, 8s");
    }
  }

  /**
   * Merge input with default values
   * @param input - The user input
   * @returns Veo2ImageToVideoInput - Merged input with defaults
   */
  private mergeWithDefaults(input: Veo2ImageToVideoInput): Veo2ImageToVideoInput {
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
      name: "Google Veo 2",
      version: "v2.0",
      provider: "Google (via fal.ai)",
      endpoint: MODEL_ENDPOINT,
      capabilities: {
        inputTypes: ["image", "text"],
        outputFormat: "MP4",
        supportedAspectRatios: ["16:9", "9:16", "1:1"],
        supportedDurations: ["5s", "6s", "7s", "8s"],
        maxDuration: 8,
        defaultDuration: 5,
        resolution: "720p",
        supportsImageInput: true,
        supportsTextPrompts: true,
        quality: "Professional",
      },
      pricing: {
        baseCost5s: 2.50,
        costPerAdditionalSecond: 0.50,
        currency: "USD",
        quality: "Professional tier",
      },
    };
  }
}

// Export default instance creator
export const createVeo2ImageToVideoExecutor = (apiKey: string) =>
  new Veo2ImageToVideoExecutor(apiKey);


