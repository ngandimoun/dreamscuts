import { fal } from "@fal-ai/client";

// Types for the Wan v2.2-5b model
export interface WanV225BInput {
  prompt: string;
  negative_prompt?: string;
  seed?: number;
  num_inference_steps?: number;
  enable_safety_checker?: boolean;
  enable_prompt_expansion?: boolean;
  guidance_scale?: number;
  shift?: number;
  image_size?: "square_hd" | "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9" | { width: number; height: number };
}

export interface WanV225BOutput {
  image: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  seed?: number;
  requestId?: string;
}

export interface WanV225BError {
  error: string;
  message: string;
  code?: string;
}

// Model configuration
const MODEL_ENDPOINT = "fal-ai/wan/v2.2-5b/text-to-image";

// Default configuration
const DEFAULT_CONFIG = {
  num_inference_steps: 40,
  guidance_scale: 3.5,
  shift: 2,
  image_size: "square_hd" as const,
  negative_prompt: "",
};

/**
 * Wan v2.2-5b Image Generation Executor
 * 
 * This executor provides a comprehensive interface for generating high-resolution,
 * photorealistic images using the Wan v2.2-5b model through the fal.ai API. It's
 * optimized for exceptional image quality with powerful prompt understanding and
 * fine-grained visual detail.
 */
export class WanV225BExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    
    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Generate images using the Wan v2.2-5b model
   * @param input - The input parameters for image generation
   * @returns Promise<WanV225BOutput> - The generated image and metadata
   */
  async generateImages(input: WanV225BInput): Promise<WanV225BOutput> {
    try {
      // Validate input
      this.validateInput(input);

      // Merge with defaults
      const params = this.mergeWithDefaults(input);

      // Generate image
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
        image: result.image || { url: "" },
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
    input: WanV225BInput,
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
   * @returns Promise<WanV225BOutput> - The generated image and metadata
   */
  async getQueueResult(requestId: string): Promise<WanV225BOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });

      return {
        image: result.image || { url: "" },
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
   * @param imageSize - Optional image size to use for all generations
   * @returns Promise<WanV225BOutput[]> - Array of results for each prompt
   */
  async generateMultipleImages(
    prompts: string[],
    imageSize?: WanV225BInput["image_size"]
  ): Promise<WanV225BOutput[]> {
    const results: WanV225BOutput[] = [];

    for (const prompt of prompts) {
      try {
        const result = await this.generateImages({
          prompt,
          image_size: imageSize
        });
        results.push(result);
      } catch (error) {
        console.error(`Failed to generate image for prompt: ${prompt}`, error);
        results.push({
          image: { url: "" },
          error: (error as WanV225BError).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate images with different image sizes
   * @param input - Base input parameters
   * @param imageSizes - Array of image sizes to generate
   * @returns Promise<WanV225BOutput[]> - Array of results for each size
   */
  async generateWithImageSizes(
    input: Omit<WanV225BInput, "image_size">,
    imageSizes: WanV225BInput["image_size"][]
  ): Promise<WanV225BOutput[]> {
    const results: WanV225BOutput[] = [];

    for (const imageSize of imageSizes) {
      try {
        const result = await this.generateImages({
          ...input,
          image_size: imageSize,
        });
        results.push(result);
      } catch (error) {
        console.error(
          `Failed to generate image with size: ${JSON.stringify(imageSize)}`,
          error
        );
        results.push({
          image: { url: "" },
          error: (error as WanV225BError).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate images with enhanced prompt expansion
   * @param input - The input parameters for image generation
   * @returns Promise<WanV225BOutput> - The generated image with enhanced prompts
   */
  async generateWithPromptExpansion(input: WanV225BInput): Promise<WanV225BOutput> {
    return this.generateImages({
      ...input,
      enable_prompt_expansion: true,
    });
  }

  /**
   * Generate high-quality images with optimized parameters
   * @param input - The input parameters for image generation
   * @returns Promise<WanV225BOutput> - The generated high-quality image
   */
  async generateHighQuality(input: WanV225BInput): Promise<WanV225BOutput> {
    return this.generateImages({
      ...input,
      num_inference_steps: 50,
      guidance_scale: 4.0,
      enable_prompt_expansion: true,
    });
  }

  /**
   * Get model information and capabilities
   * @returns Object with model information
   */
  getModelInfo() {
    return {
      name: "Wan",
      version: "v2.2-5b",
      provider: "fal-ai",
      endpoint: MODEL_ENDPOINT,
      supportedImageSizes: ["square_hd", "square", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"],
      supportedAspectRatios: ["1:1", "4:3", "16:9", "3:4", "9:16"],
      pricing: {
        standard: 0.016,
      },
      features: [
        "High-resolution photorealistic image generation",
        "Powerful prompt understanding and interpretation",
        "Fine-grained visual detail and texture",
        "Advanced inference control with multiple parameters",
        "Professional-grade output quality",
        "Cost-effective pricing"
      ],
    };
  }

  /**
   * Calculate cost for generation
   * @param numImages - Number of images to generate
   * @returns Cost in dollars
   */
  calculateCost(numImages: number = 1): number {
    return 0.016 * numImages;
  }

  /**
   * Calculate images per dollar
   * @param budget - Budget in dollars
   * @returns Number of images that can be generated
   */
  calculateImagesPerDollar(budget: number): number {
    return Math.floor(budget / 0.016);
  }

  /**
   * Validate input parameters
   * @param input - The input to validate
   */
  private validateInput(input: WanV225BInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required and cannot be empty");
    }

    if (input.prompt.length > 1000) {
      throw new Error("Prompt is too long. Maximum length is 1000 characters");
    }

    if (input.num_inference_steps !== undefined && input.num_inference_steps < 1) {
      throw new Error("Number of inference steps must be at least 1");
    }

    if (input.guidance_scale !== undefined && input.guidance_scale <= 0) {
      throw new Error("Guidance scale must be positive");
    }

    if (input.shift !== undefined && (input.shift < 1.0 || input.shift > 10.0)) {
      throw new Error("Shift value must be between 1.0 and 10.0");
    }

    if (input.image_size && typeof input.image_size === "object") {
      const { width, height } = input.image_size;
      if (width < 512 || height < 512) {
        throw new Error("Custom image dimensions must be at least 512x512 pixels");
      }
    }

    if (input.seed !== undefined && (input.seed < 0 || input.seed > 2147483647)) {
      throw new Error("Seed must be a positive integer between 0 and 2147483647");
    }
  }

  /**
   * Check if an image size is valid
   * @param imageSize - The image size to validate
   * @returns Boolean indicating if the image size is valid
   */
  private isValidImageSize(imageSize: any): imageSize is WanV225BInput["image_size"] {
    if (typeof imageSize === "string") {
      const validSizes: string[] = ["square_hd", "square", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"];
      return validSizes.includes(imageSize);
    }
    
    if (typeof imageSize === "object" && imageSize !== null) {
      return typeof imageSize.width === "number" && typeof imageSize.height === "number";
    }
    
    return false;
  }

  /**
   * Merge input with default values
   * @param input - The input parameters
   * @returns Merged parameters with defaults
   */
  private mergeWithDefaults(input: WanV225BInput): WanV225BInput {
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
  private handleError(error: any): WanV225BError {
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
export const wanV225BUtils = {
  /**
   * Create a wildlife photography prompt
   * @param animal - Animal description
   * @param setting - Environment or setting
   * @returns Formatted prompt
   */
  createWildlifePrompt(animal: string, setting: string = "natural habitat"): string {
    return `In this breathtaking wildlife documentary, we are drawn into an intimate close-up of a majestic ${animal}, framed against the backdrop of a vast ${setting}. The camera captures the raw power and nobility of the creature as it gazes intently into the distance, its fur glistening under the soft, diffused light that bathes the scene in an ethereal glow.`;
  },

  /**
   * Create a portrait photography prompt
   * @param person - Person description
   * @param style - Photography style
   * @returns Formatted prompt
   */
  createPortraitPrompt(person: string, style: string = "professional"): string {
    return `${style} portrait photography of ${person}, natural lighting, beautiful composition, high quality, photorealistic detail, stunning visual appeal`;
  },

  /**
   * Create a landscape photography prompt
   * @param scene - Landscape scene
   * @param timeOfDay - Time of day
   * @returns Formatted prompt
   */
  createLandscapePrompt(scene: string, timeOfDay: string = "golden hour"): string {
    return `${timeOfDay} landscape photography of ${scene}, natural lighting, beautiful composition, high resolution, photorealistic detail, stunning visual appeal`;
  },

  /**
   * Create a product photography prompt
   * @param product - Product description
   * @param style - Photography style
   * @returns Formatted prompt
   */
  createProductPrompt(product: string, style: string = "commercial"): string {
    return `${style} product photography of ${product}, professional lighting, clean background, high quality, photorealistic detail, commercial appeal`;
  },

  /**
   * Get recommended image size for use case
   * @param useCase - The intended use case
   * @returns Recommended image size
   */
  getRecommendedImageSize(useCase: string): WanV225BInput["image_size"] {
    const recommendations: Record<string, WanV225BInput["image_size"]> = {
      "portrait": "portrait_16_9",
      "landscape": "landscape_16_9",
      "square": "square_hd",
      "product": "square_hd",
      "wildlife": "landscape_16_9",
      "nature": "landscape_16_9",
      "commercial": "square_hd",
      "artistic": "square_hd"
    };

    return recommendations[useCase.toLowerCase()] || "square_hd";
  },

  /**
   * Get recommended aspect ratio for use case
   * @param useCase - The intended use case
   * @returns Recommended aspect ratio
   */
  getRecommendedAspectRatio(useCase: string): string {
    const recommendations: Record<string, string> = {
      "portrait": "9:16",
      "landscape": "16:9",
      "square": "1:1",
      "product": "1:1",
      "wildlife": "16:9",
      "nature": "16:9",
      "commercial": "1:1",
      "artistic": "1:1"
    };

    return recommendations[useCase.toLowerCase()] || "1:1";
  },

  /**
   * Estimate cost for generation
   * @param numImages - Number of images to generate
   * @returns Estimated cost
   */
  estimateCost(numImages: number): number {
    return 0.016 * numImages;
  },

  /**
   * Calculate images per dollar
   * @param budget - Budget in dollars
   * @returns Number of images that can be generated
   */
  calculateImagesPerDollar(budget: number): number {
    return Math.floor(budget / 0.016);
  },

  /**
   * Create a nature photography prompt
   * @param subject - Nature subject
   * @param mood - Desired mood
   * @returns Formatted prompt
   */
  createNaturePrompt(subject: string, mood: string = "serene"): string {
    return `${mood} nature photography of ${subject}, natural lighting, beautiful composition, high quality, photorealistic detail, stunning visual appeal`;
  },

  /**
   * Create a commercial photography prompt
   * @param subject - Commercial subject
   * @param style - Commercial style
   * @returns Formatted prompt
   */
  createCommercialPrompt(subject: string, style: string = "professional"): string {
    return `${style} commercial photography of ${subject}, professional lighting, clean background, high quality, photorealistic detail, commercial appeal`;
  },

  /**
   * Create an artistic composition prompt
   * @param concept - Artistic concept
   * @param style - Artistic style
   * @returns Formatted prompt
   */
  createArtisticPrompt(concept: string, style: string = "artistic"): string {
    return `${style} composition of ${concept}, creative lighting, beautiful composition, high quality, photorealistic detail, stunning visual appeal`;
  }
};

// Export default executor instance
export default WanV225BExecutor;
