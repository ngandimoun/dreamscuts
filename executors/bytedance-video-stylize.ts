import { fal } from "@fal-ai/client";

export interface BytedanceVideoStylizeInput {
  style: string;
  image_url: string;
}

export interface BytedanceVideoStylizeOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  requestId?: string;
}

export interface BytedanceVideoStylizeError {
  error: string;
  message: string;
  code?: string;
}

export type BytedanceVideoStylizeResult = BytedanceVideoStylizeOutput | BytedanceVideoStylizeError;

const MODEL_ENDPOINT = "fal-ai/bytedance/video-stylize";

export class BytedanceVideoStylizeExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: apiKey });
  }

  /**
   * Generate stylized video from image
   */
  async generateStylizedVideo(input: BytedanceVideoStylizeInput): Promise<BytedanceVideoStylizeOutput> {
    try {
      this.validateInput(input);

      const result = await fal.subscribe(MODEL_ENDPOINT, {
        input,
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
   * Queue stylized video generation for long-running requests
   */
  async queueStylizedVideoGeneration(input: BytedanceVideoStylizeInput, webhookUrl?: string): Promise<{ requestId: string }> {
    try {
      this.validateInput(input);

      const { request_id } = await fal.queue.submit(MODEL_ENDPOINT, {
        input,
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
  async getQueueResult(requestId: string): Promise<BytedanceVideoStylizeOutput> {
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
   * Generate multiple stylized videos from different inputs
   */
  async generateMultipleStylizedVideos(inputs: BytedanceVideoStylizeInput[]): Promise<BytedanceVideoStylizeResult[]> {
    const promises = inputs.map(input => this.generateStylizedVideo(input));
    return Promise.allSettled(promises).then(results =>
      results.map(result =>
        result.status === 'fulfilled' ? result.value : { error: 'Failed', message: result.reason?.message || 'Unknown error' }
      )
    );
  }

  /**
   * Calculate the cost for stylized video generation
   * Cost: $0.23 per video (fixed price)
   */
  calculateCost(): number {
    return 0.23;
  }

  /**
   * Get model capabilities and information
   */
  getModelInfo() {
    return {
      name: "Bytedance Video Stylize",
      version: "v1.0",
      provider: "Bytedance (via fal.ai)",
      endpoint: MODEL_ENDPOINT,
      capabilities: {
        inputTypes: ["image", "style"],
        outputFormat: "MP4",
        resolution: "Standard video resolution",
        frameRate: "Standard frame rate",
        videoDuration: "Variable based on input",
        supportsImageInput: true,
        supportsStyleCustomization: true,
        supportsMultipleStyles: true,
        quality: "Professional stylization",
      },
      pricing: {
        costPerVideo: 0.23,
        currency: "USD",
        billingModel: "per_video",
        examples: {
          "single_video": "$0.23",
          "ten_videos": "$2.30",
          "hundred_videos": "$23.00"
        },
        notes: "Fixed price per video regardless of style complexity"
      },
      features: {
        styleTransformation: "Transform images into stylized videos",
        multipleStyles: "Support for various artistic styles",
        imageProcessing: "Advanced image-to-video conversion",
        creativeEffects: "Professional artistic stylization"
      },
    };
  }

  /**
   * Get recommended style options
   */
  getRecommendedStyles(): string[] {
    return [
      "Manga style",
      "Anime style",
      "Cartoon style",
      "Oil painting style",
      "Watercolor style",
      "Sketch style",
      "Comic book style",
      "Pop art style",
      "Vintage style",
      "Modern art style"
    ];
  }

  /**
   * Get style suggestions for different use cases
   */
  getStyleSuggestions(): { useCase: string; styles: string[] }[] {
    return [
      {
        useCase: "Character Animation",
        styles: ["Manga style", "Anime style", "Cartoon style"]
      },
      {
        useCase: "Artistic Transformation",
        styles: ["Oil painting style", "Watercolor style", "Modern art style"]
      },
      {
        useCase: "Comic and Graphic",
        styles: ["Comic book style", "Sketch style", "Pop art style"]
      },
      {
        useCase: "Nostalgic Content",
        styles: ["Vintage style", "Retro style", "Classic style"]
      }
    ];
  }

  /**
   * Validate if a style is supported
   */
  isStyleSupported(style: string): boolean {
    const recommendedStyles = this.getRecommendedStyles();
    return recommendedStyles.some(recommended => 
      recommended.toLowerCase().includes(style.toLowerCase()) ||
      style.toLowerCase().includes(recommended.toLowerCase())
    );
  }

  private validateInput(input: BytedanceVideoStylizeInput): void {
    if (!input.style || input.style.trim().length === 0) {
      throw new Error("Style is required");
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

    // Validate style length (should be a short description)
    if (input.style.length > 100) {
      throw new Error("Style description should be short (under 100 characters)");
    }
  }

  private handleError(error: any): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error(typeof error === 'string' ? error : 'Unknown error occurred');
  }
}

export const createBytedanceVideoStylizeExecutor = (apiKey: string) =>
  new BytedanceVideoStylizeExecutor(apiKey);
