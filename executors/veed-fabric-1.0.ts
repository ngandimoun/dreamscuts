import { fal } from "@fal-ai/client";

// Input interface for VEED Fabric 1.0
export interface VeedFabricInput {
  image_url: string;
  audio_url: string;
  resolution: "480p" | "720p";
}

// Output interface for VEED Fabric 1.0
export interface VeedFabricOutput {
  video: {
    url: string;
    content_type: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error interface
export interface VeedFabricError {
  error: string;
  message: string;
  details?: any;
}

// Result type
export type VeedFabricResult = VeedFabricOutput | VeedFabricError;

/**
 * VEED Fabric 1.0 Executor
 * 
 * VEED Fabric 1.0 is an image-to-video API that turns any image into a talking video.
 * Perfect for creating realistic talking avatars, lip-sync videos, and animated content.
 * 
 * Pricing:
 * - 480p: $0.08 per second
 * - 720p: $0.15 per second
 * 
 * @param input - The input parameters for VEED Fabric 1.0
 * @returns Promise<VeedFabricResult> - The generated talking video or error
 */
export class VeedFabricExecutor {
  private readonly modelId = "veed/fabric-1.0";
  private readonly timeout = 120000; // 2 minutes timeout

  /**
   * Execute VEED Fabric 1.0 image-to-video generation
   */
  async execute(input: VeedFabricInput): Promise<VeedFabricResult> {
    try {
      // Validate input
      const validation = this.validateInput(input);
      if (!validation.valid) {
        return {
          error: "INVALID_INPUT",
          message: validation.message,
          details: validation.details
        };
      }

      // Configure FAL client
      this.configureFalClient();

      // Submit request to VEED Fabric 1.0
      const result = await fal.subscribe(this.modelId, {
        input: {
          image_url: input.image_url,
          audio_url: input.audio_url,
          resolution: input.resolution
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log(`VEED Fabric 1.0 processing: ${update.logs?.map(log => log.message).join(", ")}`);
          }
        }
      });

      // Return the result
      return result.data as VeedFabricOutput;

    } catch (error) {
      console.error("VEED Fabric 1.0 execution error:", error);
      
      return {
        error: "EXECUTION_ERROR",
        message: error instanceof Error ? error.message : "Unknown error occurred",
        details: error
      };
    }
  }

  /**
   * Execute VEED Fabric 1.0 with queue-based processing
   * Useful for longer videos or when you want to handle the request asynchronously
   */
  async executeWithQueue(input: VeedFabricInput, webhookUrl?: string): Promise<{ request_id: string } | VeedFabricError> {
    try {
      // Validate input
      const validation = this.validateInput(input);
      if (!validation.valid) {
        return {
          error: "INVALID_INPUT",
          message: validation.message,
          details: validation.details
        };
      }

      // Configure FAL client
      this.configureFalClient();

      // Submit to queue
      const { request_id } = await fal.queue.submit(this.modelId, {
        input: {
          image_url: input.image_url,
          audio_url: input.audio_url,
          resolution: input.resolution
        },
        webhookUrl
      });

      return { request_id };

    } catch (error) {
      console.error("VEED Fabric 1.0 queue submission error:", error);
      
      return {
        error: "QUEUE_SUBMISSION_ERROR",
        message: error instanceof Error ? error.message : "Unknown error occurred",
        details: error
      };
    }
  }

  /**
   * Check the status of a queued request
   */
  async checkStatus(requestId: string): Promise<any> {
    try {
      this.configureFalClient();
      
      const status = await fal.queue.status(this.modelId, {
        requestId,
        logs: true
      });

      return status;

    } catch (error) {
      console.error("VEED Fabric 1.0 status check error:", error);
      
      return {
        error: "STATUS_CHECK_ERROR",
        message: error instanceof Error ? error.message : "Unknown error occurred",
        details: error
      };
    }
  }

  /**
   * Get the result of a completed request
   */
  async getResult(requestId: string): Promise<VeedFabricResult> {
    try {
      this.configureFalClient();
      
      const result = await fal.queue.result(this.modelId, {
        requestId
      });

      return result.data as VeedFabricOutput;

    } catch (error) {
      console.error("VEED Fabric 1.0 result retrieval error:", error);
      
      return {
        error: "RESULT_RETRIEVAL_ERROR",
        message: error instanceof Error ? error.message : "Unknown error occurred",
        details: error
      };
    }
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: VeedFabricInput): { valid: boolean; message?: string; details?: any } {
    if (!input.image_url) {
      return {
        valid: false,
        message: "Image URL is required",
        details: { missing: "image_url" }
      };
    }

    if (!input.audio_url) {
      return {
        valid: false,
        message: "Audio URL is required",
        details: { missing: "audio_url" }
      };
    }

    if (!input.resolution) {
      return {
        valid: false,
        message: "Resolution is required",
        details: { missing: "resolution" }
      };
    }

    if (!["480p", "720p"].includes(input.resolution)) {
      return {
        valid: false,
        message: "Resolution must be either '480p' or '720p'",
        details: { invalid: "resolution", value: input.resolution }
      };
    }

    // Validate URL formats
    try {
      new URL(input.image_url);
    } catch {
      return {
        valid: false,
        message: "Invalid image URL format",
        details: { invalid: "image_url", value: input.image_url }
      };
    }

    try {
      new URL(input.audio_url);
    } catch {
      return {
        valid: false,
        message: "Invalid audio URL format",
        details: { invalid: "audio_url", value: input.audio_url }
      };
    }

    return { valid: true };
  }

  /**
   * Configure FAL client with API key
   */
  private configureFalClient(): void {
    const apiKey = process.env.FAL_KEY;
    if (!apiKey) {
      throw new Error("FAL_KEY environment variable is required for VEED Fabric 1.0");
    }

    fal.config({
      credentials: apiKey
    });
  }

  /**
   * Calculate estimated cost for a video
   */
  calculateCost(durationSeconds: number, resolution: "480p" | "720p"): number {
    const rates = {
      "480p": 0.08,
      "720p": 0.15
    };

    return durationSeconds * rates[resolution];
  }

  /**
   * Get model information
   */
  getModelInfo() {
    return {
      name: "VEED Fabric 1.0",
      description: "Image-to-video API that turns any image into a talking video",
      provider: "VEED",
      modelId: this.modelId,
      capabilities: [
        "image-to-video-generation",
        "talking-avatar-creation",
        "realistic-lipsync",
        "audio-video-synchronization"
      ],
      pricing: {
        "480p": "$0.08 per second",
        "720p": "$0.15 per second"
      },
      supportedFormats: {
        image: ["jpg", "jpeg", "png", "webp", "gif", "avif"],
        audio: ["mp3", "ogg", "wav", "m4a", "aac"],
        output: ["mp4"]
      }
    };
  }
}

// Export default instance
export const veedFabricExecutor = new VeedFabricExecutor();

// Export convenience functions
export async function executeVeedFabric(input: VeedFabricInput): Promise<VeedFabricResult> {
  return veedFabricExecutor.execute(input);
}

export async function executeVeedFabricWithQueue(input: VeedFabricInput, webhookUrl?: string): Promise<{ request_id: string } | VeedFabricError> {
  return veedFabricExecutor.executeWithQueue(input, webhookUrl);
}

export async function checkVeedFabricStatus(requestId: string): Promise<any> {
  return veedFabricExecutor.checkStatus(requestId);
}

export async function getVeedFabricResult(requestId: string): Promise<VeedFabricResult> {
  return veedFabricExecutor.getResult(requestId);
}

export function calculateVeedFabricCost(durationSeconds: number, resolution: "480p" | "720p"): number {
  return veedFabricExecutor.calculateCost(durationSeconds, resolution);
}

export function getVeedFabricModelInfo() {
  return veedFabricExecutor.getModelInfo();
}
