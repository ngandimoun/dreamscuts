import { fal } from "@fal-ai/client";

// Types for the Kling Video v2 Master model
export interface KlingVideoV2MasterInput {
  prompt: string;
  image_url: string;
  duration?: "5" | "10";
  negative_prompt?: string;
  cfg_scale?: number;
}

export interface KlingVideoV2MasterOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  requestId?: string;
}

export interface KlingVideoV2MasterError {
  error: string;
  message: string;
  code?: string;
}

// Union type for handling both success and error cases
export type KlingVideoV2MasterResult = KlingVideoV2MasterOutput | KlingVideoV2MasterError;

// Model configuration
const MODEL_ENDPOINT = "fal-ai/kling-video/v2/master/image-to-video";

// Default configuration
const DEFAULT_CONFIG = {
  duration: "5" as const,
  negative_prompt: "blur, distort, and low quality",
  cfg_scale: 0.5,
};

/**
 * Kling Video v2 Master Image-to-Video Generation Executor
 * 
 * This executor provides a comprehensive interface for generating videos from images using
 * Kling AI v2 Master through the fal.ai API. It's optimized for professional-grade video
 * generation with superior motion fluidity and cinematic quality.
 */
export class KlingVideoV2MasterExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    
    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Generate video from image using the Kling Video v2 Master model
   * @param input - The input parameters for video generation
   * @returns Promise<KlingVideoV2MasterOutput> - The generated video and metadata
   */
  async generateVideo(input: KlingVideoV2MasterInput): Promise<KlingVideoV2MasterOutput> {
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
    input: KlingVideoV2MasterInput,
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
   * @returns Promise<KlingVideoV2MasterOutput> - The generated video and metadata
   */
  async getQueueResult(requestId: string): Promise<KlingVideoV2MasterOutput> {
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
   * @returns Promise<KlingVideoV2MasterResult[]> - Array of results for each input
   */
  async generateMultipleVideos(
    inputs: KlingVideoV2MasterInput[]
  ): Promise<KlingVideoV2MasterResult[]> {
    const results: KlingVideoV2MasterResult[] = [];

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
   * @param duration - Duration in seconds
   * @returns number - Estimated cost in USD
   */
  calculateCost(duration: "5" | "10"): number {
    const baseCost5s = 1.40;
    const baseCost10s = 2.80;
    const additionalSecondCost = 0.28;

    if (duration === "5") {
      return baseCost5s;
    } else if (duration === "10") {
      return baseCost10s;
    } else {
      // For custom durations beyond 10 seconds
      const additionalSeconds = parseInt(duration) - 10;
      return baseCost10s + (additionalSeconds * additionalSecondCost);
    }
  }

  /**
   * Validate input parameters
   * @param input - The input parameters to validate
   * @throws Error if validation fails
   */
  private validateInput(input: KlingVideoV2MasterInput): void {
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

    if (input.duration && !["5", "10"].includes(input.duration)) {
      throw new Error("Duration must be either '5' or '10'");
    }

    if (input.cfg_scale !== undefined && (input.cfg_scale < 0.1 || input.cfg_scale > 2.0)) {
      throw new Error("CFG scale must be between 0.1 and 2.0");
    }
  }

  /**
   * Merge input with default values
   * @param input - The user input
   * @returns KlingVideoV2MasterInput - Merged input with defaults
   */
  private mergeWithDefaults(input: KlingVideoV2MasterInput): KlingVideoV2MasterInput {
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
      name: "Kling AI v2 Master",
      version: "v2.0",
      provider: "fal-ai",
      endpoint: MODEL_ENDPOINT,
      capabilities: {
        inputTypes: ["image", "text"],
        outputFormat: "MP4",
        supportedDurations: ["5s", "10s"],
        supportedAspectRatios: ["16:9", "9:16", "1:1"],
        maxInputImages: 1,
        supportsMotionControl: true,
        supportsCameraControl: true,
        supportsMasks: true,
      },
      pricing: {
        baseCost5s: 1.40,
        baseCost10s: 2.80,
        additionalSecondCost: 0.28,
        currency: "USD",
      },
    };
  }
}

// Export default instance creator
export const createKlingVideoV2MasterExecutor = (apiKey: string) => 
  new KlingVideoV2MasterExecutor(apiKey);


