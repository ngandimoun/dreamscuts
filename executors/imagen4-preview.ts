import { fal } from "@fal-ai/client";

// Types for the Imagen4 model
export interface Imagen4Input {
  prompt: string;
  negative_prompt?: string;
  aspect_ratio?: "1:1" | "16:9" | "9:16" | "3:4" | "4:3";
  num_images?: number;
  seed?: number;
  output_format?: string;
}

export interface Imagen4Output {
  images: Array<{
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  }>;
  seed?: number;
  requestId?: string;
}

export interface Imagen4Error {
  error: string;
  message: string;
  code?: string;
}

// Model variants mapping
const MODEL_VARIANTS = {
  standard: "fal-ai/imagen4/preview",
  fast: "fal-ai/imagen4/preview/fast",
  ultra: "fal-ai/imagen4/preview/ultra",
} as const;

type ModelVariant = keyof typeof MODEL_VARIANTS;

// Default configuration
const DEFAULT_CONFIG = {
  num_images: 1,
  aspect_ratio: "1:1" as const,
  negative_prompt: "",
};

/**
 * Imagen4 Image Generation Executor
 * 
 * This executor provides a comprehensive interface for generating images using Google's Imagen4 model
 * through the fal.ai API. It supports multiple variants (standard, fast, ultra) and provides
 * both synchronous and asynchronous generation methods.
 */
export class Imagen4Executor {
  private apiKey: string;
  private defaultVariant: ModelVariant;

  constructor(apiKey: string, defaultVariant: ModelVariant = "standard") {
    this.apiKey = apiKey;
    this.defaultVariant = defaultVariant;
    
    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Generate images using the Imagen4 model
   * @param input - The input parameters for image generation
   * @param variant - The model variant to use (standard, fast, ultra)
   * @returns Promise<Imagen4Output> - The generated images and metadata
   */
  async generateImages(
    input: Imagen4Input,
    variant: ModelVariant = this.defaultVariant
  ): Promise<Imagen4Output> {
    try {
      // Validate input
      this.validateInput(input);

      // Merge with defaults
      const params = this.mergeWithDefaults(input);

      // Get model endpoint
      const modelEndpoint = MODEL_VARIANTS[variant];

      // Generate images
      const result = await fal.subscribe(modelEndpoint, {
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
   * @param variant - The model variant to use
   * @param webhookUrl - Optional webhook URL for notifications
   * @returns Promise<{requestId: string}> - The request ID for tracking
   */
  async queueImageGeneration(
    input: Imagen4Input,
    variant: ModelVariant = this.defaultVariant,
    webhookUrl?: string
  ): Promise<{ requestId: string }> {
    try {
      // Validate input
      this.validateInput(input);

      // Merge with defaults
      const params = this.mergeWithDefaults(input);

      // Get model endpoint
      const modelEndpoint = MODEL_VARIANTS[variant];

      // Submit to queue
      const { request_id } = await fal.queue.submit(modelEndpoint, {
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
   * @param variant - The model variant used
   * @returns Promise<any> - The current status
   */
  async checkQueueStatus(
    requestId: string,
    variant: ModelVariant = this.defaultVariant
  ): Promise<any> {
    try {
      const modelEndpoint = MODEL_VARIANTS[variant];
      
      const status = await fal.queue.status(modelEndpoint, {
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
   * @param variant - The model variant used
   * @returns Promise<Imagen4Output> - The generated images and metadata
   */
  async getQueueResult(
    requestId: string,
    variant: ModelVariant = this.defaultVariant
  ): Promise<Imagen4Output> {
    try {
      const modelEndpoint = MODEL_VARIANTS[variant];
      
      const result = await fal.queue.result(modelEndpoint, {
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
   * @param variant - The model variant to use
   * @returns Promise<Imagen4Output[]> - Array of results for each prompt
   */
  async generateMultipleImages(
    prompts: string[],
    variant: ModelVariant = this.defaultVariant
  ): Promise<Imagen4Output[]> {
    const results: Imagen4Output[] = [];

    for (const prompt of prompts) {
      try {
        const result = await this.generateImages({ prompt }, variant);
        results.push(result);
      } catch (error) {
        console.error(`Failed to generate image for prompt: ${prompt}`, error);
        results.push({
          images: [],
          error: (error as Imagen4Error).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate images with different aspect ratios
   * @param input - Base input parameters
   * @param aspectRatios - Array of aspect ratios to generate
   * @param variant - The model variant to use
   * @returns Promise<Imagen4Output[]> - Array of results for each aspect ratio
   */
  async generateWithAspectRatios(
    input: Omit<Imagen4Input, "aspect_ratio">,
    aspectRatios: Imagen4Input["aspect_ratio"][],
    variant: ModelVariant = this.defaultVariant
  ): Promise<Imagen4Output[]> {
    const results: Imagen4Output[] = [];

    for (const aspectRatio of aspectRatios) {
      try {
        const result = await this.generateImages(
          { ...input, aspect_ratio: aspectRatio },
          variant
        );
        results.push(result);
      } catch (error) {
        console.error(
          `Failed to generate image with aspect ratio: ${aspectRatio}`,
          error
        );
        results.push({
          images: [],
          error: (error as Imagen4Error).message,
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
      version: "preview",
      provider: "fal-ai",
      variants: Object.keys(MODEL_VARIANTS),
      supportedAspectRatios: ["1:1", "16:9", "9:16", "3:4", "4:3"],
      maxImagesPerRequest: 4,
      pricing: {
        standard: 0.05,
        fast: 0.04,
        ultra: 0.06,
      },
    };
  }

  /**
   * Validate input parameters
   * @param input - The input to validate
   */
  private validateInput(input: Imagen4Input): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required and cannot be empty");
    }

    if (input.prompt.length > 1000) {
      throw new Error("Prompt is too long. Maximum length is 1000 characters");
    }

    if (input.num_images && (input.num_images < 1 || input.num_images > 4)) {
      throw new Error("Number of images must be between 1 and 4");
    }

    if (input.aspect_ratio && !["1:1", "16:9", "9:16", "3:4", "4:3"].includes(input.aspect_ratio)) {
      throw new Error("Invalid aspect ratio. Supported values: 1:1, 16:9, 9:16, 3:4, 4:3");
    }
  }

  /**
   * Merge input with default values
   * @param input - The input parameters
   * @returns Merged parameters with defaults
   */
  private mergeWithDefaults(input: Imagen4Input): Imagen4Input {
    return {
      ...DEFAULT_CONFIG,
      ...input,
      negative_prompt: input.negative_prompt || DEFAULT_CONFIG.negative_prompt,
    };
  }

  /**
   * Handle and format errors
   * @param error - The error to handle
   * @returns Formatted error
   */
  private handleError(error: any): Imagen4Error {
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
export const imagen4Utils = {
  /**
   * Create a prompt for product photography
   * @param productName - Name of the product
   * @param style - Photography style
   * @returns Formatted prompt
   */
  createProductPrompt(productName: string, style: string = "professional"): string {
    return `Professional ${style} product photography of ${productName}, studio lighting, clean background, high resolution, commercial quality`;
  },

  /**
   * Create a prompt for social media content
   * @param theme - Content theme
   * @param mood - Desired mood
   * @returns Formatted prompt
   */
  createSocialMediaPrompt(theme: string, mood: string = "engaging"): string {
    return `${mood} social media content featuring ${theme}, vibrant colors, modern aesthetic, Instagram-worthy, high quality`;
  },

  /**
   * Create a prompt for concept art
   * @param concept - The concept to visualize
   * @param style - Art style
   * @returns Formatted prompt
   */
  createConceptArtPrompt(concept: string, style: string = "digital art"): string {
    return `${style} concept art of ${concept}, detailed, atmospheric, professional illustration, high quality`;
  },
};

// Export default executor instance
export default Imagen4Executor;
