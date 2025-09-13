import { fal } from "@fal-ai/client";

// Types for the Dreamina v3.1 model
export interface DreaminaV31Input {
  prompt: string;
  image_size?: "square_hd" | "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9" | { width: number; height: number };
  enhance_prompt?: boolean;
  num_images?: number;
  seed?: number;
}

export interface DreaminaV31Output {
  images: Array<{
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
    width?: number;
    height?: number;
  }>;
  seed?: number;
  requestId?: string;
}

export interface DreaminaV31Error {
  error: string;
  message: string;
  code?: string;
}

// Union type for handling both success and error cases
export type DreaminaV31Result = DreaminaV31Output | DreaminaV31Error;

// Model configuration
const MODEL_ENDPOINT = "fal-ai/bytedance/dreamina/v3.1/text-to-image";

// Default configuration
const DEFAULT_CONFIG = {
  image_size: "square_hd" as const,
  num_images: 1,
};

/**
 * Dreamina v3.1 Image Generation Executor
 * 
 * This executor provides a comprehensive interface for generating images using Bytedance's
 * Dreamina v3.1 model through the fal.ai API. It's optimized for superior picture effects,
 * precise styles, and rich details with exceptional aesthetic quality.
 */
export class DreaminaV31Executor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    
    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Generate images using the Dreamina v3.1 model
   * @param input - The input parameters for image generation
   * @returns Promise<DreaminaV31Output> - The generated images and metadata
   */
  async generateImages(input: DreaminaV31Input): Promise<DreaminaV31Output> {
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

      // Safely extract properties from the result object, handling possible missing fields
      const images = Array.isArray((result as any).images)
        ? (result as any).images.map((url: string) => ({ url }))
        : [];
      const seed = (result as any).seed ?? undefined;
      const requestId = (result as any).requestId ?? undefined;

      return {
        images,
        seed,
        requestId,
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
    input: DreaminaV31Input,
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
   * @returns Promise<DreaminaV31Output> - The generated images and metadata
   */
  async getQueueResult(requestId: string): Promise<DreaminaV31Output> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });

      // Safely extract images from the result
      const images = Array.isArray((result as any).images)
        ? (result as any).images.map((url: string) => ({ url }))
        : [];

      return {
        images,
        seed: (result as any).seed,
        requestId: (result as any).requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate multiple images with different prompts
   * @param prompts - Array of prompts to generate images for
   * @param imageSize - Optional image size to use for all generations
   * @returns Promise<DreaminaV31Output[]> - Array of results for each prompt
   */
  async generateMultipleImages(
    prompts: string[],
    imageSize?: DreaminaV31Input["image_size"]
  ): Promise<DreaminaV31Result[]> {
    const results: DreaminaV31Result[] = [];

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
          error: "Generation failed",
          message: (error as any).message || "Unknown error occurred",
        });
      }
    }

    return results;
  }

  /**
   * Generate images with different image sizes
   * @param input - Base input parameters
   * @param imageSizes - Array of image sizes to generate
   * @returns Promise<DreaminaV31Output[]> - Array of results for each size
   */
  async generateWithImageSizes(
    input: Omit<DreaminaV31Input, "image_size">,
    imageSizes: DreaminaV31Input["image_size"][]
  ): Promise<DreaminaV31Result[]> {
    const results: DreaminaV31Result[] = [];

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
          error: "Generation failed",
          message: (error as any).message || "Unknown error occurred",
        });
      }
    }

    return results;
  }

  /**
   * Generate images with enhanced prompts
   * @param input - The input parameters for image generation
   * @returns Promise<DreaminaV31Output> - The generated images with enhanced prompts
   */
  async generateWithEnhancedPrompt(input: DreaminaV31Input): Promise<DreaminaV31Output> {
    return this.generateImages({
      ...input,
      enhance_prompt: true,
    });
  }

  /**
   * Get model information and capabilities
   * @returns Object with model information
   */
  getModelInfo() {
    return {
      name: "Dreamina",
      version: "v3.1",
      provider: "fal-ai",
      endpoint: MODEL_ENDPOINT,
      supportedImageSizes: ["square_hd", "square", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"],
      supportedAspectRatios: ["1:1", "4:3", "16:9", "3:4", "9:16"],
      pricing: {
        standard: 0.05,
      },
      features: [
        "Superior picture effects and aesthetics",
        "Precise and diverse style rendering",
        "Rich detail generation capabilities",
        "Advanced prompt enhancement",
        "Flexible image size customization",
        "Professional-grade output quality"
      ],
    };
  }

  /**
   * Calculate cost for generation
   * @param numImages - Number of images to generate
   * @returns Cost in dollars
   */
  calculateCost(numImages: number = 1): number {
    return 0.05 * numImages;
  }

  /**
   * Validate input parameters
   * @param input - The input to validate
   */
  private validateInput(input: DreaminaV31Input): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required and cannot be empty");
    }

    if (input.prompt.length > 1000) {
      throw new Error("Prompt is too long. Maximum length is 1000 characters");
    }

    if (input.num_images !== undefined && input.num_images < 1) {
      throw new Error("Number of images must be at least 1");
    }

    if (input.image_size && typeof input.image_size === "object") {
      const { width, height } = input.image_size;
      if (width < 512 || width > 2048 || height < 512 || height > 2048) {
        throw new Error("Custom image dimensions must be between 512 and 2048 pixels");
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
  private isValidImageSize(imageSize: any): imageSize is DreaminaV31Input["image_size"] {
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
  private mergeWithDefaults(input: DreaminaV31Input): DreaminaV31Input {
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
  private handleError(error: any): DreaminaV31Error {
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
export const dreaminaV31Utils = {
  /**
   * Create a selfie-style portrait prompt
   * @param person - Person description
   * @param setting - Setting or background
   * @returns Formatted prompt
   */
  createSelfiePrompt(person: string, setting: string = "modern apartment"): string {
    return `A ${person} selfie, front facing camera, lighting is soft and natural. If background is visible, it's a clean, ${setting} interior. The clothing color is clearly visible and distinct, adding a hint of color contrast`;
  },

  /**
   * Create a social media content prompt
   * @param content - Content description
   * @param style - Visual style
   * @returns Formatted prompt
   */
  createSocialMediaPrompt(content: string, style: string = "aesthetic"): string {
    return `${style} ${content}, high quality, visually appealing, perfect for social media, beautiful composition, stunning visuals`;
  },

  /**
   * Create a portrait photography prompt
   * @param subject - Subject description
   * @param style - Photography style
   * @returns Formatted prompt
   */
  createPortraitPrompt(subject: string, style: string = "professional"): string {
    return `${style} portrait photography of ${subject}, natural lighting, beautiful composition, high quality, aesthetic appeal`;
  },

  /**
   * Create a creative art prompt
   * @param concept - Art concept
   * @param style - Artistic style
   * @returns Formatted prompt
   */
  createCreativeArtPrompt(concept: string, style: string = "artistic"): string {
    return `${style} interpretation of ${concept}, beautiful aesthetics, rich details, superior picture effects, creative composition`;
  },

  /**
   * Get recommended image size for use case
   * @param useCase - The intended use case
   * @returns Recommended image size
   */
  getRecommendedImageSize(useCase: string): DreaminaV31Input["image_size"] {
    const recommendations: Record<string, DreaminaV31Input["image_size"]> = {
      "social_media": "square_hd",
      "instagram": "square_hd",
      "tiktok": "portrait_16_9",
      "youtube": "landscape_16_9",
      "portrait": "portrait_16_9",
      "landscape": "landscape_16_9",
      "square": "square_hd",
      "profile": "square_hd",
      "banner": "landscape_16_9",
      "story": "portrait_16_9"
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
      "social_media": "1:1",
      "instagram": "1:1",
      "tiktok": "9:16",
      "youtube": "16:9",
      "portrait": "9:16",
      "landscape": "16:9",
      "square": "1:1",
      "profile": "1:1",
      "banner": "16:9",
      "story": "9:16"
    };

    return recommendations[useCase.toLowerCase()] || "1:1";
  },

  /**
   * Estimate cost for generation
   * @param numImages - Number of images to generate
   * @returns Estimated cost
   */
  estimateCost(numImages: number): number {
    return 0.05 * numImages;
  },

  /**
   * Calculate images per dollar
   * @param budget - Budget in dollars
   * @returns Number of images that can be generated
   */
  calculateImagesPerDollar(budget: number): number {
    return Math.floor(budget / 0.05);
  },

  /**
   * Create a fashion photography prompt
   * @param clothing - Clothing description
   * @param style - Fashion style
   * @returns Formatted prompt
   */
  createFashionPrompt(clothing: string, style: string = "fashion"): string {
    return `${style} photography of ${clothing}, beautiful model, professional lighting, aesthetic composition, high quality, stunning visuals`;
  },

  /**
   * Create a lifestyle photography prompt
   * @param activity - Activity or lifestyle scene
   * @param mood - Desired mood
   * @returns Formatted prompt
   */
  createLifestylePrompt(activity: string, mood: string = "natural"): string {
    return `${mood} lifestyle photography of ${activity}, candid moment, beautiful lighting, aesthetic appeal, high quality, perfect composition`;
  },

  /**
   * Create a beauty photography prompt
   * @param subject - Subject description
   * @param style - Beauty style
   * @returns Formatted prompt
   */
  createBeautyPrompt(subject: string, style: string = "beauty"): string {
    return `${style} photography of ${subject}, flawless skin, perfect lighting, aesthetic composition, high quality, stunning beauty shot`;
  }
};

// Export default executor instance
export default DreaminaV31Executor;
