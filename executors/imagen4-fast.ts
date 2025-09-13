import { fal } from "@fal-ai/client";

// Types for the Imagen4 Fast model
export interface Imagen4FastInput {
  prompt: string;
  negative_prompt?: string;
  aspect_ratio?: "1:1" | "16:9" | "9:16" | "3:4" | "4:3";
  num_images?: number;
  seed?: number;
}

export interface Imagen4FastOutput {
  images: Array<{
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  }>;
  seed?: number;
  requestId?: string;
}

export interface Imagen4FastError {
  error: string;
  message: string;
  code?: string;
}

// Model configuration
const MODEL_ENDPOINT = "fal-ai/imagen4/preview/fast";

// Default configuration
const DEFAULT_CONFIG = {
  aspect_ratio: "1:1" as const,
  num_images: 1,
  negative_prompt: "",
};

/**
 * Imagen4 Fast Image Generation Executor
 * 
 * This executor provides a comprehensive interface for generating images using Imagen4 Fast model
 * through the fal.ai API. It's optimized for cost-effective bulk generation while maintaining
 * high quality output.
 */
export class Imagen4FastExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    
    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Generate images using the Imagen4 Fast model
   * @param input - The input parameters for image generation
   * @returns Promise<Imagen4FastOutput> - The generated images and metadata
   */
  async generateImages(input: Imagen4FastInput): Promise<Imagen4FastOutput> {
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
        seed: result.seed,
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
    input: Imagen4FastInput,
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
   * @returns Promise<Imagen4FastOutput> - The generated images and metadata
   */
  async getQueueResult(requestId: string): Promise<Imagen4FastOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });

      return {
        images: result.images || [],
        seed: result.seed,
        requestId: result.requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate multiple images with different prompts
   * @param prompts - Array of prompts to generate images for
   * @param aspectRatio - Optional aspect ratio to use for all generations
   * @returns Promise<Imagen4FastOutput[]> - Array of results for each prompt
   */
  async generateMultipleImages(
    prompts: string[],
    aspectRatio?: Imagen4FastInput["aspect_ratio"]
  ): Promise<Imagen4FastOutput[]> {
    const results: Imagen4FastOutput[] = [];

    for (const prompt of prompts) {
      try {
        const result = await this.generateImages({ 
          prompt, 
          aspect_ratio: aspectRatio 
        });
        results.push(result);
      } catch (error) {
        console.error(`Failed to generate image for prompt: ${prompt}`, error);
        results.push({
          images: [],
          error: (error as Imagen4FastError).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate images with different aspect ratios
   * @param input - Base input parameters
   * @param aspectRatios - Array of aspect ratios to generate
   * @returns Promise<Imagen4FastOutput[]> - Array of results for each aspect ratio
   */
  async generateWithAspectRatios(
    input: Omit<Imagen4FastInput, "aspect_ratio">,
    aspectRatios: Imagen4FastInput["aspect_ratio"][]
  ): Promise<Imagen4FastOutput[]> {
    const results: Imagen4FastOutput[] = [];

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
          error: (error as Imagen4FastError).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate images with different seeds for variety
   * @param input - Base input parameters
   * @param seeds - Array of seeds to use
   * @returns Promise<Imagen4FastOutput[]> - Array of results for each seed
   */
  async generateWithSeeds(
    input: Omit<Imagen4FastInput, "seed">,
    seeds: number[]
  ): Promise<Imagen4FastOutput[]> {
    const results: Imagen4FastOutput[] = [];

    for (const seed of seeds) {
      try {
        const result = await this.generateImages({
          ...input,
          seed,
        });
        results.push(result);
      } catch (error) {
        console.error(
          `Failed to generate image with seed: ${seed}`,
          error
        );
        results.push({
          images: [],
          error: (error as Imagen4FastError).message,
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
      name: "Imagen4",
      version: "preview/fast",
      provider: "fal-ai",
      endpoint: MODEL_ENDPOINT,
      supportedAspectRatios: ["1:1", "16:9", "9:16", "3:4", "4:3"],
      maxImagesPerRequest: 4,
      pricing: {
        fast: 0.02,
      },
      features: [
        "Cost-effective image generation",
        "High-quality output with enhanced detail",
        "Faster processing compared to standard variant",
        "Multiple aspect ratio support",
        "Reproducible results with seed control",
        "Bulk generation optimization"
      ],
    };
  }

  /**
   * Calculate cost for generation
   * @param numImages - Number of images to generate
   * @returns Cost in dollars
   */
  calculateCost(numImages: number = 1): number {
    return 0.02 * numImages;
  }

  /**
   * Validate input parameters
   * @param input - The input to validate
   */
  private validateInput(input: Imagen4FastInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required and cannot be empty");
    }

    if (input.prompt.length > 1000) {
      throw new Error("Prompt is too long. Maximum length is 1000 characters");
    }

    if (input.num_images !== undefined && (input.num_images < 1 || input.num_images > 4)) {
      throw new Error("Number of images must be between 1 and 4");
    }

    if (input.aspect_ratio && !this.isValidAspectRatio(input.aspect_ratio)) {
      throw new Error(`Invalid aspect ratio: ${input.aspect_ratio}. Supported values: 1:1, 16:9, 9:16, 3:4, 4:3`);
    }

    if (input.seed !== undefined && (input.seed < 0 || input.seed > 2147483647)) {
      throw new Error("Seed must be a positive integer between 0 and 2147483647");
    }
  }

  /**
   * Check if an aspect ratio is valid
   * @param aspectRatio - The aspect ratio to validate
   * @returns Boolean indicating if the aspect ratio is valid
   */
  private isValidAspectRatio(aspectRatio: string): aspectRatio is Imagen4FastInput["aspect_ratio"] {
    const validRatios: Imagen4FastInput["aspect_ratio"][] = ["1:1", "16:9", "9:16", "3:4", "4:3"];
    return validRatios.includes(aspectRatio as Imagen4FastInput["aspect_ratio"]);
  }

  /**
   * Merge input with default values
   * @param input - The input parameters
   * @returns Merged parameters with defaults
   */
  private mergeWithDefaults(input: Imagen4FastInput): Imagen4FastInput {
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
  private handleError(error: any): Imagen4FastError {
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
export const imagen4FastUtils = {
  /**
   * Create a product photography prompt
   * @param product - Name of the product
   * @param style - Photography style
   * @returns Formatted prompt
   */
  createProductPrompt(product: string, style: string = "professional"): string {
    return `${style} product photography of ${product}, high resolution, detailed textures, studio lighting, clean background`;
  },

  /**
   * Create a social media content prompt
   * @param theme - Content theme
   * @param mood - Desired mood
   * @returns Formatted prompt
   */
  createSocialMediaPrompt(theme: string, mood: string = "engaging"): string {
    return `${mood} social media content featuring ${theme}, vibrant colors, modern composition, high quality`;
  },

  /**
   * Create a landscape photography prompt
   * @param location - Location or landscape type
   * @param timeOfDay - Time of day
   * @returns Formatted prompt
   */
  createLandscapePrompt(location: string, timeOfDay: string = "golden hour"): string {
    return `${timeOfDay} landscape photography of ${location}, dramatic lighting, natural beauty, high resolution`;
  },

  /**
   * Create a portrait photography prompt
   * @param subject - Subject description
   * @param style - Portrait style
   * @returns Formatted prompt
   */
  createPortraitPrompt(subject: string, style: string = "professional"): string {
    return `${style} portrait photography of ${subject}, natural lighting, sharp focus, high quality, studio background`;
  },

  /**
   * Get recommended aspect ratio for use case
   * @param useCase - The intended use case
   * @returns Recommended aspect ratio
   */
  getRecommendedAspectRatio(useCase: string): Imagen4FastInput["aspect_ratio"] {
    const recommendations: Record<string, Imagen4FastInput["aspect_ratio"]> = {
      "social_media": "1:1",
      "instagram": "1:1",
      "facebook": "1:1",
      "twitter": "16:9",
      "linkedin": "1:1",
      "youtube": "16:9",
      "pinterest": "9:16",
      "tiktok": "9:16",
      "product": "1:1",
      "landscape": "16:9",
      "portrait": "9:16",
      "banner": "16:9",
      "poster": "3:4"
    };

    return recommendations[useCase.toLowerCase()] || "1:1";
  },

  /**
   * Get recommended number of images for use case
   * @param useCase - The intended use case
   * @returns Recommended number of images
   */
  getRecommendedImageCount(useCase: string): number {
    const recommendations: Record<string, number> = {
      "single": 1,
      "variety": 3,
      "selection": 4,
      "bulk": 4,
      "prototype": 2,
      "final": 1
    };

    return recommendations[useCase.toLowerCase()] || 1;
  },

  /**
   * Create negative prompt for common issues
   * @param issues - Array of issues to avoid
   * @returns Formatted negative prompt
   */
  createNegativePrompt(issues: string[] = []): string {
    const defaultIssues = ["blurry", "low quality", "watermark", "text"];
    const allIssues = [...defaultIssues, ...issues];
    return allIssues.join(", ");
  },

  /**
   * Estimate cost for bulk generation
   * @param numImages - Number of images to generate
   * @returns Estimated cost
   */
  estimateCost(numImages: number): number {
    return 0.02 * numImages;
  },

  /**
   * Generate random seed
   * @returns Random seed number
   */
  generateRandomSeed(): number {
    return Math.floor(Math.random() * 2147483647);
  }
};

// Export default executor instance
export default Imagen4FastExecutor;
