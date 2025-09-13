import { fal } from "@fal-ai/client";

// Types for the SeedDream 3.0 model
export interface SeedreamV3Input {
  prompt: string;
  image_size?: "square_hd" | "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9" | { width: number; height: number };
  guidance_scale?: number;
  num_images?: number;
  seed?: number;
  enable_safety_checker?: boolean;
}

export interface SeedreamV3Output {
  images: Array<{
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
    file_data?: string;
    width?: number;
    height?: number;
  }>;
  seed?: number;
  requestId?: string;
}

export interface SeedreamV3Error {
  error: string;
  message: string;
  code?: string;
}

// Model configuration
const MODEL_ENDPOINT = "fal-ai/bytedance/seedream/v3/text-to-image";

// Default configuration
const DEFAULT_CONFIG = {
  guidance_scale: 2.5,
  num_images: 1,
  enable_safety_checker: true,
};

/**
 * SeedDream 3.0 Generation Executor
 * 
 * This executor provides a comprehensive interface for generating images using the SeedDream 3.0 model
 * through the fal.ai API. It's a bilingual (Chinese and English) text-to-image model that excels at
 * native 2K high resolution output, exceptional text layout, and photorealistic portraits.
 */
export class SeedreamV3Executor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    
    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Generate images using the SeedDream 3.0 model
   * @param input - The input parameters for image generation
   * @returns Promise<SeedreamV3Output> - The generated images and metadata
   */
  async generateImages(input: SeedreamV3Input): Promise<SeedreamV3Output> {
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
    input: SeedreamV3Input,
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
   * @returns Promise<SeedreamV3Output> - The generated images and metadata
   */
  async getQueueResult(requestId: string): Promise<SeedreamV3Output> {
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
   * @param imageSize - Optional image size to use for all generations
   * @returns Promise<SeedreamV3Output[]> - Array of results for each prompt
   */
  async generateMultipleImages(
    prompts: string[],
    imageSize?: SeedreamV3Input["image_size"]
  ): Promise<SeedreamV3Output[]> {
    const results: SeedreamV3Output[] = [];

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
          images: [],
          error: (error as SeedreamV3Error).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate images with different image sizes
   * @param input - Base input parameters
   * @param imageSizes - Array of image sizes to generate
   * @returns Promise<SeedreamV3Output[]> - Array of results for each size
   */
  async generateWithImageSizes(
    input: Omit<SeedreamV3Input, "image_size">,
    imageSizes: SeedreamV3Input["image_size"][]
  ): Promise<SeedreamV3Output[]> {
    const results: SeedreamV3Output[] = [];

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
          images: [],
          error: (error as SeedreamV3Error).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate high-resolution 2K images
   * @param input - The input parameters for image generation
   * @returns Promise<SeedreamV3Output> - The high-resolution generated images
   */
  async generateHighResolution(input: SeedreamV3Input): Promise<SeedreamV3Output> {
    return this.generateImages({
      ...input,
      image_size: "square_hd", // 1024x1024 for high resolution
    });
  }

  /**
   * Generate images optimized for text layout
   * @param input - The input parameters for image generation
   * @returns Promise<SeedreamV3Output> - The text-optimized generated images
   */
  async generateTextOptimized(input: SeedreamV3Input): Promise<SeedreamV3Output> {
    return this.generateImages({
      ...input,
      guidance_scale: 3.0, // Higher guidance for better text adherence
    });
  }

  /**
   * Generate photorealistic portraits
   * @param input - The input parameters for image generation
   * @returns Promise<SeedreamV3Output> - The photorealistic portrait images
   */
  async generatePhotorealisticPortrait(input: SeedreamV3Input): Promise<SeedreamV3Output> {
    return this.generateImages({
      ...input,
      image_size: "portrait_4_3", // Optimal for portraits
      guidance_scale: 2.8, // Balanced guidance for realistic results
    });
  }

  /**
   * Generate images with cinematic beauty
   * @param input - The input parameters for image generation
   * @returns Promise<SeedreamV3Output> - The cinematic generated images
   */
  async generateCinematic(input: SeedreamV3Input): Promise<SeedreamV3Output> {
    return this.generateImages({
      ...input,
      image_size: "landscape_16_9", // Cinematic aspect ratio
      guidance_scale: 2.5, // Standard guidance for cinematic look
    });
  }

  /**
   * Generate images with fast processing (3 seconds for 1K images)
   * @param input - The input parameters for image generation
   * @returns Promise<SeedreamV3Output> - The fast-generated images
   */
  async generateFast(input: SeedreamV3Input): Promise<SeedreamV3Output> {
    return this.generateImages({
      ...input,
      image_size: "square", // 512x512 for faster processing
      guidance_scale: 2.0, // Lower guidance for faster generation
    });
  }

  /**
   * Generate bilingual images (Chinese and English prompts)
   * @param chinesePrompt - Chinese prompt
   * @param englishPrompt - English prompt
   * @param options - Additional options
   * @returns Promise<SeedreamV3Output> - The bilingual generated images
   */
  async generateBilingual(
    chinesePrompt: string,
    englishPrompt: string,
    options?: Partial<SeedreamV3Input>
  ): Promise<SeedreamV3Output> {
    const combinedPrompt = `${chinesePrompt} | ${englishPrompt}`;
    return this.generateImages({
      prompt: combinedPrompt,
      ...options,
    });
  }

  /**
   * Get model information and capabilities
   * @returns Object with model information
   */
  getModelInfo() {
    return {
      name: "SeedDream 3.0",
      version: "v3",
      provider: "fal-ai",
      endpoint: MODEL_ENDPOINT,
      supportedImageSizes: ["square_hd", "square", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"],
      supportedAspectRatios: ["1:1", "4:3", "16:9", "3:4", "9:16"],
      pricing: {
        standard: 0.05,
        unit: "per image",
      },
      features: [
        "Bilingual (Chinese and English) text-to-image generation",
        "Native 2K high resolution output with various aspect ratios",
        "Exceptional text layout for visually stunning results",
        "Accurate small and large text generation",
        "Photorealistic portraits with cinematic beauty",
        "Fast generation (3 seconds for 1K images)",
        "Strong instruction following and enhanced aesthetics",
        "High-quality output with multiple format options",
        "Robust safety checking mechanisms",
        "Professional-grade output suitable for commercial use"
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
   * Calculate images per dollar for a given budget
   * @param budget - Budget in dollars
   * @returns Number of images that can be generated
   */
  calculateImagesPerDollar(budget: number): number {
    return Math.floor(budget / 0.05);
  }

  /**
   * Validate input parameters
   * @param input - The input to validate
   */
  private validateInput(input: SeedreamV3Input): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required and cannot be empty");
    }

    if (input.prompt.length > 1000) {
      throw new Error("Prompt is too long. Maximum length is 1000 characters");
    }

    if (input.guidance_scale !== undefined && (input.guidance_scale < 0 || input.guidance_scale > 20)) {
      throw new Error("Guidance scale must be between 0 and 20");
    }

    if (input.num_images !== undefined && (input.num_images < 1 || input.num_images > 4)) {
      throw new Error("Number of images must be between 1 and 4");
    }

    if (input.image_size && typeof input.image_size === "object") {
      const { width, height } = input.image_size;
      if (width < 512 || height < 512) {
        throw new Error("Custom image dimensions must be at least 512x512 pixels");
      }
      if (width > 2048 || height > 2048) {
        throw new Error("Custom image dimensions must not exceed 2048x2048 pixels");
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
  private isValidImageSize(imageSize: any): imageSize is SeedreamV3Input["image_size"] {
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
  private mergeWithDefaults(input: SeedreamV3Input): SeedreamV3Input {
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
  private handleError(error: any): SeedreamV3Error {
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
export const seedreamV3Utils = {
  /**
   * Create a fisheye lens photography prompt
   * @param subject - Subject description
   * @param effect - Distortion effect description
   * @param style - Photography style
   * @returns Formatted prompt
   */
  createFisheyePrompt(subject: string, effect: string = "distorted", style: string = "fisheye lens"): string {
    return `${style}, ${subject}, the image shows the effect that ${effect} due to the shooting method.`;
  },

  /**
   * Create a text layout prompt
   * @param text - Text content
   * @param layout - Layout style
   * @param design - Design elements
   * @returns Formatted prompt
   */
  createTextLayoutPrompt(text: string, layout: string = "elegant", design: string = "typography"): string {
    return `${text} with ${layout} ${design} layout, visually stunning text arrangement, high-quality typography`;
  },

  /**
   * Create a photorealistic portrait prompt
   * @param subject - Subject description
   * @param style - Portrait style
   * @param lighting - Lighting description
   * @returns Formatted prompt
   */
  createPhotorealisticPortraitPrompt(subject: string, style: string = "photorealistic", lighting: string = "studio lighting"): string {
    return `A ${style} portrait of ${subject}, ${lighting}, cinematic beauty, professional photography, high-quality details`;
  },

  /**
   * Create a cinematic scene prompt
   * @param scene - Scene description
   * @param mood - Mood description
   * @param cinematography - Cinematography style
   * @returns Formatted prompt
   */
  createCinematicPrompt(scene: string, mood: string = "dramatic", cinematography: string = "cinematic"): string {
    return `A ${cinematography} scene of ${scene}, ${mood} mood, beautiful cinematography, high-quality film look`;
  },

  /**
   * Create a bilingual prompt (Chinese and English)
   * @param chineseText - Chinese text
   * @param englishText - English text
   * @param context - Context description
   * @returns Formatted bilingual prompt
   */
  createBilingualPrompt(chineseText: string, englishText: string, context: string = "bilingual"): string {
    return `${chineseText} | ${englishText}, ${context} text generation, clear and readable text`;
  },

  /**
   * Create a high-resolution detail prompt
   * @param subject - Subject description
   * @param details - Detail level
   * @param resolution - Resolution quality
   * @returns Formatted prompt
   */
  createHighResolutionPrompt(subject: string, details: string = "detailed", resolution: string = "2K high resolution"): string {
    return `${subject}, ${details}, ${resolution} output, exceptional quality, sharp and clear`;
  },

  /**
   * Get recommended image size for use case
   * @param useCase - The intended use case
   * @returns Recommended image size
   */
  getRecommendedImageSize(useCase: string): SeedreamV3Input["image_size"] {
    const recommendations: Record<string, SeedreamV3Input["image_size"]> = {
      "high_resolution": "square_hd",
      "text_layout": "landscape_4_3",
      "portrait": "portrait_4_3",
      "cinematic": "landscape_16_9",
      "fast_generation": "square",
      "social_media": "square_hd",
      "print": "portrait_4_3",
      "web": "landscape_16_9",
      "mobile": "portrait_16_9",
      "bilingual": "square_hd"
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
      "high_resolution": "1:1",
      "text_layout": "4:3",
      "portrait": "3:4",
      "cinematic": "16:9",
      "fast_generation": "1:1",
      "social_media": "1:1",
      "print": "3:4",
      "web": "16:9",
      "mobile": "9:16",
      "bilingual": "1:1"
    };

    return recommendations[useCase.toLowerCase()] || "1:1";
  },

  /**
   * Estimate cost for generation
   * @param numImages - Number of images to generate
   * @returns Estimated cost
   */
  estimateCost(numImages: number = 1): number {
    return 0.05 * numImages;
  },

  /**
   * Calculate images per dollar for a given budget
   * @param budget - Budget in dollars
   * @returns Number of images that can be generated
   */
  calculateImagesPerDollar(budget: number): number {
    return Math.floor(budget / 0.05);
  },

  /**
   * Get recommended guidance scale for use case
   * @param useCase - The intended use case
   * @returns Recommended guidance scale
   */
  getRecommendedGuidanceScale(useCase: string): number {
    const recommendations: Record<string, number> = {
      "text_layout": 3.0,
      "portrait": 2.8,
      "cinematic": 2.5,
      "fast_generation": 2.0,
      "high_resolution": 2.5,
      "photorealistic": 2.8,
      "artistic": 2.2,
      "commercial": 2.5,
      "creative": 2.0,
      "detailed": 3.0
    };

    return recommendations[useCase.toLowerCase()] || 2.5;
  }
};

// Export default executor instance
export default SeedreamV3Executor;
