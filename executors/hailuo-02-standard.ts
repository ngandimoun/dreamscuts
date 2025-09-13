import { fal } from "@fal-ai/client";

// Types for the MiniMax Hailuo-02 Standard model
export interface Hailuo02StandardInput {
  prompt: string;
  duration?: "6" | "10";
  prompt_optimizer?: boolean;
}

export interface Hailuo02StandardOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  requestId?: string;
}

export interface Hailuo02StandardError {
  error: string;
  message: string;
  code?: string;
}

// Union type for handling both success and error cases
export type Hailuo02StandardResult = Hailuo02StandardOutput | Hailuo02StandardError;

// Model configuration
const MODEL_ENDPOINT = "fal-ai/minimax/hailuo-02/standard/text-to-video";

// Default configuration
const DEFAULT_CONFIG = {
  duration: "6" as const,
  prompt_optimizer: true,
};

/**
 * MiniMax Hailuo-02 Standard Text-to-Video Generation Executor
 *
 * This executor provides a comprehensive interface for generating videos
 * using MiniMax's Hailuo-02 Standard model through the fal.ai API. It's optimized for
 * cost-effective text-to-video generation with 768p resolution.
 */
export class Hailuo02StandardExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;

    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Generate video using the Hailuo-02 Standard model
   * @param input - The input parameters for video generation
   * @returns Promise<Hailuo02StandardOutput> - The generated video and metadata
   */
  async generateVideo(input: Hailuo02StandardInput): Promise<Hailuo02StandardOutput> {
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
    input: Hailuo02StandardInput,
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
   * @returns Promise<Hailuo02StandardOutput> - The generated video and metadata
   */
  async getQueueResult(requestId: string): Promise<Hailuo02StandardOutput> {
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
   * Generate multiple videos with different prompts
   * @param inputs - Array of input parameters for video generation
   * @returns Promise<Hailuo02StandardResult[]> - Array of results for each input
   */
  async generateMultipleVideos(
    inputs: Hailuo02StandardInput[]
  ): Promise<Hailuo02StandardResult[]> {
    const results: Hailuo02StandardResult[] = [];

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
   * @param duration - Duration in seconds (default: 6)
   * @returns number - Estimated cost in USD
   */
  calculateCost(duration: number = 6): number {
    // Cost is $0.045 per second
    const costPerSecond = 0.045;
    return duration * costPerSecond;
  }

  /**
   * Calculate video duration based on duration parameter
   * @param duration - Duration string (e.g., "6")
   * @returns number - Duration in seconds
   */
  calculateDuration(duration: string = "6"): number {
    return parseInt(duration);
  }

  /**
   * Get available durations
   * @returns string[] - Array of supported durations
   */
  getAvailableDurations(): string[] {
    return ["6", "10"];
  }

  /**
   * Get model resolution
   * @returns string - Model resolution
   */
  getResolution(): string {
    return "768p";
  }

  /**
   * Validate input parameters
   * @param input - The input parameters to validate
   * @throws Error if validation fails
   */
  private validateInput(input: Hailuo02StandardInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required and cannot be empty");
    }

    if (input.duration && !["6", "10"].includes(input.duration)) {
      throw new Error("Duration must be one of: 6, 10");
    }

    if (input.prompt_optimizer !== undefined && typeof input.prompt_optimizer !== "boolean") {
      throw new Error("prompt_optimizer must be a boolean");
    }
  }

  /**
   * Merge input with default values
   * @param input - The user input
   * @returns Hailuo02StandardInput - Merged input with defaults
   */
  private mergeWithDefaults(input: Hailuo02StandardInput): Hailuo02StandardInput {
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
      name: "MiniMax Hailuo-02 Standard",
      version: "v1.0",
      provider: "MiniMax",
      endpoint: MODEL_ENDPOINT,
      capabilities: {
        inputTypes: ["text"],
        outputFormat: "MP4",
        resolution: "768p",
        supportedDurations: ["6", "10"],
        maxDuration: 10,
        defaultDuration: 6,
        supportsPromptOptimization: true,
        quality: "Standard",
      },
      pricing: {
        costPerSecond: 0.045,
        currency: "USD",
        quality: "Standard tier",
      },
    };
  }
}

// Export default instance creator
export const createHailuo02StandardExecutor = (apiKey: string) =>
  new Hailuo02StandardExecutor(apiKey);


