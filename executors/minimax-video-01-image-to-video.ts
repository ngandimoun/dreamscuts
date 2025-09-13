import { fal } from "@fal-ai/client";

export interface MinimaxVideo01ImageToVideoInput {
  prompt: string;
  image_url: string;
  prompt_optimizer?: boolean;
}

export interface MinimaxVideo01ImageToVideoOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  requestId?: string;
}

export interface MinimaxVideo01ImageToVideoError {
  error: string;
  message: string;
  code?: string;
}

export type MinimaxVideo01ImageToVideoResult = MinimaxVideo01ImageToVideoOutput | MinimaxVideo01ImageToVideoError;

const MODEL_ENDPOINT = "fal-ai/minimax/video-01/image-to-video";

const DEFAULT_CONFIG = {
  prompt_optimizer: true,
};

export class MinimaxVideo01ImageToVideoExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: apiKey });
  }

  /**
   * Generate video from image with prompt
   */
  async generateVideo(input: MinimaxVideo01ImageToVideoInput): Promise<MinimaxVideo01ImageToVideoOutput> {
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
  async queueVideoGeneration(input: MinimaxVideo01ImageToVideoInput, webhookUrl?: string): Promise<{ requestId: string }> {
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
  async getQueueResult(requestId: string): Promise<MinimaxVideo01ImageToVideoOutput> {
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
  async generateMultipleVideos(inputs: MinimaxVideo01ImageToVideoInput[]): Promise<MinimaxVideo01ImageToVideoResult[]> {
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
   * Get model capabilities and information
   */
  getModelInfo() {
    return {
      name: "MiniMax Video-01 Image-to-Video",
      version: "v1.0",
      provider: "MiniMax (via fal.ai)",
      endpoint: MODEL_ENDPOINT,
      capabilities: {
        inputTypes: ["image", "text"],
        outputFormat: "MP4",
        resolution: "1280x720 (720p)",
        frameRate: "25 fps",
        videoDuration: "6 seconds",
        supportsImageInput: true,
        supportsTextPrompts: true,
        supportsPromptOptimizer: true,
        supportsCameraMovements: true,
        quality: "High-resolution, high-frame-rate",
      },
      pricing: {
        costPerVideo: 0.50,
        currency: "USD",
        billingModel: "per_video",
        notes: "Fixed price per video regardless of complexity",
      },
      cameraMovements: [
        "Pan left/right",
        "Truck left/right", 
        "Push in/Pull out",
        "Pedestal up/down",
        "Tilt up/down",
        "Zoom in/out",
        "Shake",
        "Tracking shot",
        "Static shot"
      ],
    };
  }

  /**
   * Get available camera movement options
   */
  getAvailableCameraMovements(): string[] {
    return [
      "Pan left/right",
      "Truck left/right", 
      "Push in/Pull out",
      "Pedestal up/down",
      "Tilt up/down",
      "Zoom in/out",
      "Shake",
      "Tracking shot",
      "Static shot"
    ];
  }

  /**
   * Generate a prompt with camera movement instructions
   */
  generatePromptWithCameraMovement(basePrompt: string, movements: string[]): string {
    if (movements.length === 0) return basePrompt;
    
    const validMovements = movements.filter(movement => 
      this.getAvailableCameraMovements().includes(movement)
    );
    
    if (validMovements.length === 0) return basePrompt;
    
    const movementText = validMovements.slice(0, 3).join(", ");
    return `${basePrompt} [${movementText}]`;
  }

  private validateInput(input: MinimaxVideo01ImageToVideoInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (!input.image_url || input.image_url.trim().length === 0) {
      throw new Error("Image URL is required");
    }

    // Validate image URL format
    try {
      new URL(input.image_url);
    } catch {
      throw new Error("Image URL must be a valid URL");
    }
  }

  private mergeWithDefaults(input: MinimaxVideo01ImageToVideoInput): MinimaxVideo01ImageToVideoInput {
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

export const createMinimaxVideo01ImageToVideoExecutor = (apiKey: string) =>
  new MinimaxVideo01ImageToVideoExecutor(apiKey);
