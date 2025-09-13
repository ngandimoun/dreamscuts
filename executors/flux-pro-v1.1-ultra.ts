import { fal } from "@fal-ai/client";

// Types for the FLUX Pro Ultra model
export interface FluxProUltraInput {
  prompt: string;
  seed?: number;
  sync_mode?: boolean;
  num_images?: number;
  enable_safety_checker?: boolean;
  output_format?: "jpeg" | "png";
  safety_tolerance?: "1" | "2" | "3" | "4" | "5" | "6";
  enhance_prompt?: boolean;
  aspect_ratio?: "21:9" | "16:9" | "4:3" | "3:2" | "1:1" | "2:3" | "3:4" | "9:16" | "9:21";
  raw?: boolean;
}

export interface FluxProUltraOutput {
  images: Array<{
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
    width?: number;
    height?: number;
  }>;
  timings?: Record<string, any>;
  seed?: number;
  has_nsfw_concepts?: boolean[];
  prompt?: string;
  requestId?: string;
}

export interface FluxProUltraError {
  error: string;
  message: string;
  code?: string;
}

// Model configuration
const MODEL_ENDPOINT = "fal-ai/flux-pro/v1.1-ultra";

// Default configuration
const DEFAULT_CONFIG = {
  num_images: 1,
  enable_safety_checker: true,
  output_format: "jpeg" as const,
  safety_tolerance: "2" as const,
  aspect_ratio: "16:9" as const,
  sync_mode: false,
};

/**
 * FLUX Pro Ultra Image Generation Executor
 * 
 * This executor provides a comprehensive interface for generating images using FLUX Pro Ultra model
 * through the fal.ai API. It supports advanced features like safety checking, prompt enhancement,
 * and configurable tolerance levels.
 */
export class FluxProUltraExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    
    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Generate images using the FLUX Pro Ultra model
   * @param input - The input parameters for image generation
   * @returns Promise<FluxProUltraOutput> - The generated images and metadata
   */
  async generateImages(input: FluxProUltraInput): Promise<FluxProUltraOutput> {
    try {
      // Validate input
      this.validateInput(input);

      // Merge with defaults
      const params = this.mergeWithDefaults(input);

      // Generate images
      const result = await fal.subscribe(MODEL_ENDPOINT, {
        input: params,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs?.forEach((log) => console.log(log.message));
          }
        },
      });

      return {
        images: result.images || [],
        timings: result.timings,
        seed: result.seed,
        has_nsfw_concepts: result.has_nsfw_concepts,
        prompt: result.prompt,
        requestId: result.requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate images asynchronously using queue system
   * @param input - The input parameters for image generation
   * @param webhookUrl - Optional webhook URL for notifications
   * @returns Promise<{requestId: string}> - The request ID for tracking
   */
  async queueImageGeneration(
    input: FluxProUltraInput,
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
   * @param requestId - The request ID from queueImageGeneration
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
   * @param requestId - The request ID from queueImageGeneration
   * @returns Promise<FluxProUltraOutput> - The generated images and metadata
   */
  async getQueueResult(requestId: string): Promise<FluxProUltraOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });

      return {
        images: result.images || [],
        timings: result.timings,
        seed: result.seed,
        has_nsfw_concepts: result.has_nsfw_concepts,
        prompt: result.prompt,
        requestId: result.requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate multiple images with different prompts
   * @param prompts - Array of prompts to generate images for
   * @returns Promise<FluxProUltraOutput[]> - Array of results for each prompt
   */
  async generateMultipleImages(prompts: string[]): Promise<FluxProUltraOutput[]> {
    const results: FluxProUltraOutput[] = [];

    for (const prompt of prompts) {
      try {
        const result = await this.generateImages({ prompt });
        results.push(result);
      } catch (error) {
        console.error(`Failed to generate image for prompt: ${prompt}`, error);
        results.push({
          images: [],
          error: (error as FluxProUltraError).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate images with different aspect ratios
   * @param input - Base input parameters
   * @param aspectRatios - Array of aspect ratios to generate
   * @returns Promise<FluxProUltraOutput[]> - Array of results for each aspect ratio
   */
  async generateWithAspectRatios(
    input: Omit<FluxProUltraInput, "aspect_ratio">,
    aspectRatios: FluxProUltraInput["aspect_ratio"][]
  ): Promise<FluxProUltraOutput[]> {
    const results: FluxProUltraOutput[] = [];

    for (const aspectRatio of aspectRatios) {
      try {
        const result = await this.generateImages({
          ...input,
          aspect_ratio: aspectRatio,
        });
        results.push(result);
      } catch (error) {
        console.error(
          `Failed to generate image with aspect ratio: ${aspectRatio}`,
          error
        );
        results.push({
          images: [],
          error: (error as FluxProUltraError).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate images with different safety tolerance levels
   * @param input - Base input parameters
   * @param toleranceLevels - Array of safety tolerance levels to test
   * @returns Promise<FluxProUltraOutput[]> - Array of results for each tolerance level
   */
  async generateWithSafetyTolerance(
    input: Omit<FluxProUltraInput, "safety_tolerance">,
    toleranceLevels: FluxProUltraInput["safety_tolerance"][]
  ): Promise<FluxProUltraOutput[]> {
    const results: FluxProUltraOutput[] = [];

    for (const tolerance of toleranceLevels) {
      try {
        const result = await this.generateImages({
          ...input,
          safety_tolerance: tolerance,
        });
        results.push(result);
      } catch (error) {
        console.error(
          `Failed to generate image with safety tolerance: ${tolerance}`,
          error
        );
        results.push({
          images: [],
          error: (error as FluxProUltraError).message,
        });
      }
    }

    return results;
  }

  /**
   * Get model information and capabilities
   * @returns Object with model information
   */
  getModelInfo() {
    return {
      name: "FLUX1.1",
      version: "v1.1-ultra",
      provider: "fal-ai",
      endpoint: MODEL_ENDPOINT,
      supportedAspectRatios: [
        "21:9", "16:9", "4:3", "3:2", "1:1", "2:3", "3:4", "9:16", "9:21"
      ],
      supportedOutputFormats: ["jpeg", "png"],
      safetyToleranceLevels: ["1", "2", "3", "4", "5", "6"],
      maxResolution: "Up to 2K resolution",
      pricing: {
        ultra: 0.06,
      },
      features: [
        "Professional-grade image quality",
        "10x accelerated speeds",
        "Advanced safety checker",
        "Configurable tolerance levels",
        "Prompt enhancement",
        "Raw mode for natural images"
      ],
    };
  }

  /**
   * Validate input parameters
   * @param input - The input to validate
   */
  private validateInput(input: FluxProUltraInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required and cannot be empty");
    }

    if (input.prompt.length > 1000) {
      throw new Error("Prompt is too long. Maximum length is 1000 characters");
    }

    if (input.num_images && (input.num_images < 1 || input.num_images > 4)) {
      throw new Error("Number of images must be between 1 and 4");
    }

    if (input.safety_tolerance && !["1", "2", "3", "4", "5", "6"].includes(input.safety_tolerance)) {
      throw new Error("Invalid safety tolerance. Supported values: 1, 2, 3, 4, 5, 6");
    }

    if (input.output_format && !["jpeg", "png"].includes(input.output_format)) {
      throw new Error("Invalid output format. Supported values: jpeg, png");
    }

    if (input.aspect_ratio && !["21:9", "16:9", "4:3", "3:2", "1:1", "2:3", "3:4", "9:16", "9:21"].includes(input.aspect_ratio)) {
      throw new Error("Invalid aspect ratio. Supported values: 21:9, 16:9, 4:3, 3:2, 1:1, 2:3, 3:4, 9:16, 9:21");
    }
  }

  /**
   * Merge input with default values
   * @param input - The input parameters
   * @returns Merged parameters with defaults
   */
  private mergeWithDefaults(input: FluxProUltraInput): FluxProUltraInput {
    return {
      ...DEFAULT_CONFIG,
      ...input,
    };
  }

  /**
   * Handle and format errors
   * @param error - The error to handle
   * @returns Formatted error
   */
  private handleError(error: any): FluxProUltraError {
    if (error.message) {
      return {
        error: "Generation failed",
        message: error.message,
        code: error.code,
      };
    }

    return {
      error: "Unknown error",
      message: "An unexpected error occurred during image generation",
    };
  }
}

// Utility functions for common use cases
export const fluxProUltraUtils = {
  /**
   * Create a prompt for professional photography
   * @param subject - The subject to photograph
   * @param style - Photography style
   * @returns Formatted prompt
   */
  createProfessionalPhotoPrompt(subject: string, style: string = "professional"): string {
    return `Professional ${style} photography of ${subject}, high resolution, detailed textures, natural lighting, commercial quality, up to 2K resolution`;
  },

  /**
   * Create a prompt for commercial advertising
   * @param product - The product to advertise
   * @param mood - Desired mood
   * @returns Formatted prompt
   */
  createCommercialPrompt(product: string, mood: string = "premium"): string {
    return `${mood} commercial advertising photography of ${product}, studio lighting, clean background, high-end aesthetic, professional quality, detailed product features`;
  },

  /**
   * Create a prompt for digital art
   * @param concept - The concept to visualize
   * @param style - Art style
   * @returns Formatted prompt
   */
  createDigitalArtPrompt(concept: string, style: string = "digital art"): string {
    return `${style} of ${concept}, highly detailed, professional illustration, vibrant colors, high resolution, artistic composition`;
  },

  /**
   * Create a prompt for product visualization
   * @param product - The product to visualize
   * @param context - Context or setting
   * @returns Formatted prompt
   */
  createProductVisualizationPrompt(product: string, context: string = "lifestyle"): string {
    return `${context} product visualization of ${product}, high-quality rendering, detailed materials, professional lighting, commercial photography style`;
  },

  /**
   * Get recommended safety tolerance for content type
   * @param contentType - Type of content being generated
   * @returns Recommended safety tolerance level
   */
  getRecommendedSafetyTolerance(contentType: string): FluxProUltraInput["safety_tolerance"] {
    const recommendations: Record<string, FluxProUltraInput["safety_tolerance"]> = {
      "professional": "2",
      "commercial": "2",
      "artistic": "3",
      "creative": "4",
      "experimental": "5",
      "unrestricted": "6",
    };

    return recommendations[contentType.toLowerCase()] || "2";
  },

  /**
   * Get recommended aspect ratio for use case
   * @param useCase - The intended use case
   * @returns Recommended aspect ratio
   */
  getRecommendedAspectRatio(useCase: string): FluxProUltraInput["aspect_ratio"] {
    const recommendations: Record<string, FluxProUltraInput["aspect_ratio"]> = {
      "social_media": "1:1",
      "banner": "16:9",
      "portrait": "9:16",
      "landscape": "16:9",
      "cinematic": "21:9",
      "print": "4:3",
      "mobile": "9:16",
      "desktop": "16:9",
    };

    return recommendations[useCase.toLowerCase()] || "16:9";
  },
};

// Export default executor instance
export default FluxProUltraExecutor;
