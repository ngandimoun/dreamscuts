import { fal } from "@fal-ai/client";

export interface BriaVideoIncreaseResolutionInput {
  video_url: string;
  desired_increase?: "2" | "4";
  output_container_and_codec?: "mp4_h265" | "mp4_h264" | "webm_vp9" | "mov_h265" | "mov_proresks" | "mkv_h265" | "mkv_h264" | "mkv_vp9" | "gif";
}

export interface BriaVideoIncreaseResolutionOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  requestId?: string;
}

export interface BriaVideoIncreaseResolutionError {
  error: string;
  message: string;
  code?: string;
}

export type BriaVideoIncreaseResolutionResult = BriaVideoIncreaseResolutionOutput | BriaVideoIncreaseResolutionError;

const MODEL_ENDPOINT = "bria/video/increase-resolution";

const DEFAULT_CONFIG = {
  desired_increase: "2" as const,
  output_container_and_codec: "webm_vp9" as const,
};

export class BriaVideoIncreaseResolutionExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: apiKey });
  }

  /**
   * Upscale video resolution
   */
  async increaseResolution(input: BriaVideoIncreaseResolutionInput): Promise<BriaVideoIncreaseResolutionOutput> {
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
   * Queue video resolution increase for long-running requests
   */
  async queueIncreaseResolution(input: BriaVideoIncreaseResolutionInput, webhookUrl?: string): Promise<{ requestId: string }> {
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
  async getQueueResult(requestId: string): Promise<BriaVideoIncreaseResolutionOutput> {
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
   * Calculate the cost for video resolution increase
   * Cost: $0.14 per video second
   */
  calculateCost(videoDurationSeconds: number): number {
    const costPerSecond = 0.14;
    return videoDurationSeconds * costPerSecond;
  }

  /**
   * Get available desired increase factors
   */
  getAvailableDesiredIncreases(): string[] {
    return ["2", "4"];
  }

  /**
   * Get available output container and codec options
   */
  getAvailableOutputContainerAndCodecs(): string[] {
    return ["mp4_h265", "mp4_h264", "webm_vp9", "mov_h265", "mov_proresks", "mkv_h265", "mkv_h264", "mkv_vp9", "gif"];
  }

  /**
   * Get model capabilities and information
   */
  getModelInfo() {
    return {
      name: "Bria Video Increase Resolution",
      version: "v1.0",
      provider: "Bria (via fal.ai)",
      endpoint: MODEL_ENDPOINT,
      capabilities: {
        inputTypes: ["video"],
        outputFormat: "MP4, WebM, MOV, MKV, GIF (based on output_container_and_codec)",
        maxOutputResolution: "8K",
        maxInputDuration: "30 seconds",
        supportedDesiredIncreases: this.getAvailableDesiredIncreases(),
        supportedOutputContainerAndCodecs: this.getAvailableOutputContainerAndCodecs(),
        supportsVideoInput: true,
        supportsResolutionIncrease: true,
        quality: "High",
      },
      pricing: {
        costPerSecond: 0.14,
        currency: "USD",
        billingModel: "per_video_second",
        example10s: "$1.40 for 10-second video",
        example30s: "$4.20 for 30-second video",
      },
    };
  }

  private validateInput(input: BriaVideoIncreaseResolutionInput): void {
    if (!input.video_url || input.video_url.trim().length === 0) {
      throw new Error("Video URL is required");
    }

    if (input.desired_increase && !["2", "4"].includes(input.desired_increase)) {
      throw new Error("Desired increase must be one of: 2, 4");
    }

    if (input.output_container_and_codec && !this.getAvailableOutputContainerAndCodecs().includes(input.output_container_and_codec)) {
      throw new Error(`Output container and codec must be one of: ${this.getAvailableOutputContainerAndCodecs().join(", ")}`);
    }
    // Note: Input video size and duration validation (less than 14142x14142 and duration less than 30s)
    // cannot be performed here without fetching the video metadata, which is outside the scope of simple input validation.
    // This should be handled by the calling application or assumed to be handled by the fal.ai endpoint.
  }

  private mergeWithDefaults(input: BriaVideoIncreaseResolutionInput): BriaVideoIncreaseResolutionInput {
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

export const createBriaVideoIncreaseResolutionExecutor = (apiKey: string) =>
  new BriaVideoIncreaseResolutionExecutor(apiKey);
