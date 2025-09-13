import { fal } from "@fal-ai/client";

// Types for the Wan Pro image-to-video model
export interface WanProImageToVideoInput {
  prompt: string;
  image_url: string;
  seed?: number;
  enable_safety_checker?: boolean;
}

export interface WanProImageToVideoOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  requestId?: string;
}

export interface WanProImageToVideoError {
  error: string;
  message: string;
  code?: string;
}

// Union type for handling both success and error cases
export type WanProImageToVideoResult = WanProImageToVideoOutput | WanProImageToVideoError;

// Model configuration
const MODEL_ENDPOINT = "fal-ai/wan-pro/image-to-video";

// Default configuration
const DEFAULT_CONFIG = {
  enable_safety_checker: true,
};

/**
 * Wan Pro Image-to-Video Generation Executor
 * 
 * This executor provides a comprehensive interface for generating videos from images using
 * Wan Pro through the fal.ai API. It's optimized for premium-quality video generation
 * with 1080p resolution at 30fps and exceptional motion diversity.
 */
export class WanProImageToVideoExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    
    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Generate video from image using the Wan Pro model
   * @param input - The input parameters for video generation
   * @returns Promise<WanProImageToVideoOutput> - The generated video and metadata
   */
  async generateVideo(input: WanProImageToVideoInput): Promise<WanProImageToVideoOutput> {
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
    input: WanProImageToVideoInput,
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
   * @returns Promise<WanProImageToVideoOutput> - The generated video and metadata
   */
  async getQueueResult(requestId: string): Promise<WanProImageToVideoOutput> {
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
   * Generate multiple videos with different prompts and images
   * @param inputs - Array of input parameters for video generation
   * @returns Promise<WanProImageToVideoResult[]> - Array of results for each input
   */
  async generateMultipleVideos(
    inputs: WanProImageToVideoInput[]
  ): Promise<WanProImageToVideoResult[]> {
    const results: WanProImageToVideoResult[] = [];

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
   * @returns number - Estimated cost in USD
   */
  calculateCost(): number {
    return 0.8; // Fixed cost per video
  }

  /**
   * Validate input parameters
   * @param input - The input parameters to validate
   * @throws Error if validation fails
   */
  private validateInput(input: WanProImageToVideoInput): void {
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

    if (input.seed !== undefined && (input.seed < 0 || input.seed > 2147483647)) {
      throw new Error("Seed must be a positive integer within valid range");
    }
  }

  /**
   * Merge input with default values
   * @param input - The user input
   * @returns WanProImageToVideoInput - Merged input with defaults
   */
  private mergeWithDefaults(input: WanProImageToVideoInput): WanProImageToVideoInput {
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
      name: "Wan Pro",
      version: "v2.1",
      provider: "fal-ai",
      endpoint: MODEL_ENDPOINT,
      capabilities: {
        inputTypes: ["image", "text"],
        outputFormat: "MP4",
        supportedDuration: "6 seconds",
        supportedAspectRatios: ["16:9", "9:16", "1:1"],
        maxInputImages: 1,
        resolution: "1080p",
        frameRate: "30fps",
        supportsSafetyChecker: true,
        supportsSeedControl: true,
      },
      pricing: {
        costPerVideo: 0.8,
        currency: "USD",
        quality: "Pro tier",
      },
    };
  }
}

// Export default instance creator
export const createWanProImageToVideoExecutor = (apiKey: string) => 
  new WanProImageToVideoExecutor(apiKey);


