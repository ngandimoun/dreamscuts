import { fal } from "@fal-ai/client";

// Types for the Google Veo 3 model
export interface Veo3Input {
  prompt: string;
  aspect_ratio?: "16:9" | "9:16" | "1:1";
  duration?: "8s";
  negative_prompt?: string;
  enhance_prompt?: boolean;
  seed?: number;
  auto_fix?: boolean;
  resolution?: "720p" | "1080p";
  generate_audio?: boolean;
}

export interface Veo3Output {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  requestId?: string;
}

export interface Veo3Error {
  error: string;
  message: string;
  code?: string;
}

// Union type for handling both success and error cases
export type Veo3Result = Veo3Output | Veo3Error;

// Model configuration
const MODEL_ENDPOINT = "fal-ai/veo3";

// Default configuration
const DEFAULT_CONFIG = {
  aspect_ratio: "16:9" as const,
  duration: "8s" as const,
  enhance_prompt: true,
  auto_fix: true,
  resolution: "720p" as const,
  generate_audio: true,
};

/**
 * Google Veo 3 Video Generation Executor
 *
 * This executor provides a comprehensive interface for generating videos
 * using Google's Veo 3 model through the fal.ai API. It's optimized for
 * high-quality video generation with optional audio capabilities.
 */
export class Veo3Executor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;

    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Generate video using the Veo 3 model
   * @param input - The input parameters for video generation
   * @returns Promise<Veo3Output> - The generated video and metadata
   */
  async generateVideo(input: Veo3Input): Promise<Veo3Output> {
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
    input: Veo3Input,
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
   * @returns Promise<Veo3Output> - The generated video and metadata
   */
  async getQueueResult(requestId: string): Promise<Veo3Output> {
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
   * @returns Promise<Veo3Result[]> - Array of results for each input
   */
  async generateMultipleVideos(
    inputs: Veo3Input[]
  ): Promise<Veo3Result[]> {
    const results: Veo3Result[] = [];

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
   * @param duration - Duration in seconds (default: 8)
   * @param generateAudio - Whether audio is generated (default: true)
   * @returns number - Estimated cost in USD
   */
  calculateCost(duration: number = 8, generateAudio: boolean = true): number {
    const costPerSecond = generateAudio ? 0.75 : 0.50;
    return duration * costPerSecond;
  }

  /**
   * Calculate video duration based on duration parameter
   * @param duration - Duration string (e.g., "8s")
   * @returns number - Duration in seconds
   */
  calculateDuration(duration: string = "8s"): number {
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
   * Get available resolutions
   * @returns string[] - Array of supported resolutions
   */
  getAvailableResolutions(): string[] {
    return ["720p", "1080p"];
  }

  /**
   * Validate input parameters
   * @param input - The input parameters to validate
   * @throws Error if validation fails
   */
  private validateInput(input: Veo3Input): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required and cannot be empty");
    }

    if (input.prompt.length > 1000) {
      throw new Error("Prompt must be 1000 characters or less");
    }

    if (input.aspect_ratio && !["16:9", "9:16", "1:1"].includes(input.aspect_ratio)) {
      throw new Error("Aspect ratio must be one of: 16:9, 9:16, 1:1");
    }

    if (input.duration && input.duration !== "8s") {
      throw new Error("Duration must be '8s'");
    }

    if (input.resolution && !["720p", "1080p"].includes(input.resolution)) {
      throw new Error("Resolution must be one of: 720p, 1080p");
    }

    if (input.seed !== undefined && (input.seed < 0 || input.seed > 2147483647)) {
      throw new Error("Seed must be a positive integer within valid range");
    }

    if (input.enhance_prompt !== undefined && typeof input.enhance_prompt !== "boolean") {
      throw new Error("enhance_prompt must be a boolean");
    }

    if (input.auto_fix !== undefined && typeof input.auto_fix !== "boolean") {
      throw new Error("auto_fix must be a boolean");
    }

    if (input.generate_audio !== undefined && typeof input.generate_audio !== "boolean") {
      throw new Error("generate_audio must be a boolean");
    }
  }

  /**
   * Merge input with default values
   * @param input - The user input
   * @returns Veo3Input - Merged input with defaults
   */
  private mergeWithDefaults(input: Veo3Input): Veo3Input {
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
      name: "Google Veo 3",
      version: "v3.0",
      provider: "Google",
      endpoint: MODEL_ENDPOINT,
      capabilities: {
        inputTypes: ["text"],
        outputFormat: "MP4",
        supportedAspectRatios: ["16:9", "9:16", "1:1"],
        supportedResolutions: ["720p", "1080p"],
        maxDuration: 8,
        defaultDuration: 8,
        supportsAudio: true,
        supportsSeedControl: true,
        supportsPromptEnhancement: true,
        supportsAutoFix: true,
        supportsNegativePrompts: true,
      },
      pricing: {
        costPerSecondAudioOff: 0.50,
        costPerSecondAudioOn: 0.75,
        currency: "USD",
        quality: "Professional tier",
      },
    };
  }
}

// Export default instance creator
export const createVeo3Executor = (apiKey: string) =>
  new Veo3Executor(apiKey);


