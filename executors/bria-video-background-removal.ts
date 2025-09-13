import { fal } from "@fal-ai/client";

// Types for the Bria Video Background Removal model
export interface BriaVideoBackgroundRemovalInput {
  video_url: string;
  background_color?: "Transparent" | "Black" | "White" | "Gray" | "Red" | "Green" | "Blue" | "Yellow" | "Cyan" | "Magenta" | "Orange";
  output_container_and_codec?: "mp4_h265" | "mp4_h264" | "webm_vp9" | "mov_h265" | "mov_proresks" | "mkv_h265" | "mkv_h264" | "mkv_vp9" | "gif";
}

export interface BriaVideoBackgroundRemovalOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  requestId?: string;
}

export interface BriaVideoBackgroundRemovalError {
  error: string;
  message: string;
  code?: string;
}

// Union type for handling both success and error cases
export type BriaVideoBackgroundRemovalResult = BriaVideoBackgroundRemovalOutput | BriaVideoBackgroundRemovalError;

// Model configuration
const MODEL_ENDPOINT = "bria/video/background-removal";

// Default configuration
const DEFAULT_CONFIG = {
  background_color: "Black" as const,
  output_container_and_codec: "webm_vp9" as const,
};

/**
 * Bria Video Background Removal Executor
 *
 * This executor provides a comprehensive interface for removing backgrounds
 * from videos using Bria's advanced AI technology through the fal.ai API.
 * It's optimized for creating clean, professional content without green screens.
 */
export class BriaVideoBackgroundRemovalExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;

    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Remove background from video using the Bria model
   * @param input - The input parameters for background removal
   * @returns Promise<BriaVideoBackgroundRemovalOutput> - The processed video and metadata
   */
  async removeBackground(input: BriaVideoBackgroundRemovalInput): Promise<BriaVideoBackgroundRemovalOutput> {
    try {
      // Validate input
      this.validateInput(input);

      // Merge with defaults
      const params = this.mergeWithDefaults(input);

      // Process video
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
   * Remove background asynchronously using queue system
   * @param input - The input parameters for background removal
   * @param webhookUrl - Optional webhook URL for notifications
   * @returns Promise<{requestId: string}> - The request ID for tracking
   */
  async queueBackgroundRemoval(
    input: BriaVideoBackgroundRemovalInput,
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
   * @param requestId - The request ID from queueBackgroundRemoval
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
   * @param requestId - The request ID from queueBackgroundRemoval
   * @returns Promise<BriaVideoBackgroundRemovalOutput> - The processed video and metadata
   */
  async getQueueResult(requestId: string): Promise<BriaVideoBackgroundRemovalOutput> {
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
   * Process multiple videos with different inputs
   * @param inputs - Array of input parameters for background removal
   * @returns Promise<BriaVideoBackgroundRemovalResult[]> - Array of results for each input
   */
  async processMultipleVideos(
    inputs: BriaVideoBackgroundRemovalInput[]
  ): Promise<BriaVideoBackgroundRemovalResult[]> {
    const results: BriaVideoBackgroundRemovalResult[] = [];

    for (const input of inputs) {
      try {
        const result = await this.removeBackground(input);
        results.push(result);
      } catch (error) {
        console.error(`Failed to process video: ${input.video_url}`, error);
        results.push({
          error: "Processing failed",
          message: (error as any).message || "Unknown error occurred",
        });
      }
    }

    return results;
  }

  /**
   * Calculate estimated cost for video processing
   * @param duration - Duration in seconds
   * @returns number - Estimated cost in USD
   */
  calculateCost(duration: number): number {
    // Bria pricing: $0.14 per video second
    return duration * 0.14;
  }

  /**
   * Get available background colors
   * @returns string[] - Array of supported background colors
   */
  getAvailableBackgroundColors(): string[] {
    return ["Transparent", "Black", "White", "Gray", "Red", "Green", "Blue", "Yellow", "Cyan", "Magenta", "Orange"];
  }

  /**
   * Get available output formats
   * @returns string[] - Array of supported output formats
   */
  getAvailableOutputFormats(): string[] {
    return ["mp4_h265", "mp4_h264", "webm_vp9", "mov_h265", "mov_proresks", "mkv_h265", "mkv_h264", "mkv_vp9", "gif"];
  }

  /**
   * Get model capabilities
   * @returns object - Model capabilities information
   */
  getCapabilities() {
    return {
      maxVideoSize: "14142x14142 pixels",
      maxDuration: "30 seconds",
      supportedFormats: this.getAvailableOutputFormats(),
      backgroundColors: this.getAvailableBackgroundColors(),
      costPerSecond: 0.14,
    };
  }

  /**
   * Validate input parameters
   * @param input - The input parameters to validate
   * @throws Error if validation fails
   */
  private validateInput(input: BriaVideoBackgroundRemovalInput): void {
    if (!input.video_url || input.video_url.trim().length === 0) {
      throw new Error("Video URL is required and cannot be empty");
    }

    // Validate URL format
    try {
      new URL(input.video_url);
    } catch {
      throw new Error("Video URL must be a valid URL");
    }

    if (input.background_color && !this.getAvailableBackgroundColors().includes(input.background_color)) {
      throw new Error(`Background color must be one of: ${this.getAvailableBackgroundColors().join(", ")}`);
    }

    if (input.output_container_and_codec && !this.getAvailableOutputFormats().includes(input.output_container_and_codec)) {
      throw new Error(`Output format must be one of: ${this.getAvailableOutputFormats().join(", ")}`);
    }
  }

  /**
   * Merge input with default values
   * @param input - The user input
   * @returns BriaVideoBackgroundRemovalInput - Merged input with defaults
   */
  private mergeWithDefaults(input: BriaVideoBackgroundRemovalInput): BriaVideoBackgroundRemovalInput {
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

    return new Error("An unknown error occurred during background removal");
  }

  /**
   * Get model information and capabilities
   * @returns object - Model information
   */
  getModelInfo() {
    return {
      name: "Bria Video Background Removal",
      version: "v1.0",
      provider: "Bria (via fal.ai)",
      endpoint: MODEL_ENDPOINT,
      capabilities: {
        inputTypes: ["video"],
        outputFormat: "Multiple formats supported",
        maxVideoSize: "14142x14142 pixels",
        maxDuration: "30 seconds",
        supportedBackgroundColors: this.getAvailableBackgroundColors(),
        supportedOutputFormats: this.getAvailableOutputFormats(),
        supportsTransparentBackground: true,
        quality: "Professional",
      },
      pricing: {
        costPerSecond: 0.14,
        currency: "USD",
        quality: "Professional tier",
      },
    };
  }
}

// Export default instance creator
export const createBriaVideoBackgroundRemovalExecutor = (apiKey: string) =>
  new BriaVideoBackgroundRemovalExecutor(apiKey);
