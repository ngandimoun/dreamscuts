import { fal } from "@fal-ai/client";

// Types for the FLUX.1 Krea model
export interface FluxKreaInput {
  prompt: string;
  image_size?: "square_hd" | "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9" | { width: number; height: number };
  num_inference_steps?: number;
  seed?: number;
  guidance_scale?: number;
  sync_mode?: boolean;
  num_images?: number;
  enable_safety_checker?: boolean;
  output_format?: "jpeg" | "png";
  acceleration?: "none" | "regular" | "high";
}

export interface FluxKreaOutput {
  images: Array<{
    height: number;
    content_type: string;
    url: string;
    width: number;
  }>;
  timings?: any;
  seed?: number;
  has_nsfw_concepts?: boolean[];
  prompt?: string;
  requestId?: string;
}

export interface FluxKreaError {
  error: string;
  message: string;
  code?: string;
}

// Model configuration
const MODEL_ENDPOINT = "fal-ai/flux/krea";

// Default configuration
const DEFAULT_CONFIG = {
  image_size: "landscape_4_3" as const,
  num_inference_steps: 28,
  guidance_scale: 4.5,
  num_images: 1,
  enable_safety_checker: true,
  output_format: "jpeg" as const,
  acceleration: "none" as const,
};

/**
 * FLUX.1 Krea Generation Executor
 * 
 * This executor provides a comprehensive interface for generating images using the FLUX.1 Krea model
 * through the fal.ai API. It's optimized for high-quality aesthetic generation with streaming support
 * and 12 billion parameter flow transformer architecture.
 */
export class FluxKreaExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    
    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Generate images using the FLUX.1 Krea model
   * @param input - The input parameters for image generation
   * @returns Promise<FluxKreaOutput> - The generated images and metadata
   */
  async generateImages(input: FluxKreaInput): Promise<FluxKreaOutput> {
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
   * Generate images using streaming for real-time feedback
   * @param input - The input parameters for image generation
   * @returns Promise<FluxKreaOutput> - The generated images and metadata
   */
  async generateImagesStreaming(input: FluxKreaInput): Promise<FluxKreaOutput> {
    try {
      // Validate input
      this.validateInput(input);

      // Merge with defaults
      const params = this.mergeWithDefaults(input);

      // Create stream
      const stream = await fal.stream(MODEL_ENDPOINT, {
        input: params,
      });

      // Process streaming events
      for await (const event of stream) {
        console.log('Streaming event:', event);
      }

      // Get final result
      const result = await stream.done();

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
    input: FluxKreaInput,
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
   * @returns Promise<FluxKreaOutput> - The generated images and metadata
   */
  async getQueueResult(requestId: string): Promise<FluxKreaOutput> {
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
   * @param imageSize - Optional image size to use for all generations
   * @returns Promise<FluxKreaOutput[]> - Array of results for each prompt
   */
  async generateMultipleImages(
    prompts: string[],
    imageSize?: FluxKreaInput["image_size"]
  ): Promise<FluxKreaOutput[]> {
    const results: FluxKreaOutput[] = [];

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
          error: (error as FluxKreaError).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate images with different image sizes
   * @param input - Base input parameters
   * @param imageSizes - Array of image sizes to generate
   * @returns Promise<FluxKreaOutput[]> - Array of results for each size
   */
  async generateWithImageSizes(
    input: Omit<FluxKreaInput, "image_size">,
    imageSizes: FluxKreaInput["image_size"][]
  ): Promise<FluxKreaOutput[]> {
    const results: FluxKreaOutput[] = [];

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
          error: (error as FluxKreaError).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate images with high acceleration for speed
   * @param input - The input parameters for image generation
   * @returns Promise<FluxKreaOutput> - The generated images with high acceleration
   */
  async generateWithHighAcceleration(input: FluxKreaInput): Promise<FluxKreaOutput> {
    return this.generateImages({
      ...input,
      acceleration: "high",
    });
  }

  /**
   * Generate images with regular acceleration for balanced performance
   * @param input - The input parameters for image generation
   * @returns Promise<FluxKreaOutput> - The generated images with regular acceleration
   */
  async generateWithRegularAcceleration(input: FluxKreaInput): Promise<FluxKreaOutput> {
    return this.generateImages({
      ...input,
      acceleration: "regular",
    });
  }

  /**
   * Generate images with no acceleration for maximum quality
   * @param input - The input parameters for image generation
   * @returns Promise<FluxKreaOutput> - The generated images with no acceleration
   */
  async generateWithNoAcceleration(input: FluxKreaInput): Promise<FluxKreaOutput> {
    return this.generateImages({
      ...input,
      acceleration: "none",
    });
  }

  /**
   * Generate images optimized for aesthetic quality
   * @param input - The input parameters for image generation
   * @returns Promise<FluxKreaOutput> - The generated images optimized for aesthetics
   */
  async generateAestheticOptimized(input: FluxKreaInput): Promise<FluxKreaOutput> {
    return this.generateImages({
      ...input,
      acceleration: "none",
      guidance_scale: 5.0,
      num_inference_steps: 35,
    });
  }

  /**
   * Generate images with streaming for real-time feedback
   * @param input - The input parameters for image generation
   * @returns Promise<FluxKreaOutput> - The generated images with streaming
   */
  async generateWithStreaming(input: FluxKreaInput): Promise<FluxKreaOutput> {
    return this.generateImagesStreaming(input);
  }

  /**
   * Get model information and capabilities
   * @returns Object with model information
   */
  getModelInfo() {
    return {
      name: "FLUX.1 Krea",
      version: "dev",
      provider: "fal-ai",
      endpoint: MODEL_ENDPOINT,
      supportedImageSizes: ["square_hd", "square", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"],
      supportedAspectRatios: ["1:1", "4:3", "16:9", "3:4", "9:16"],
      pricing: {
        standard: 0.05,
        unit: "per image",
      },
      features: [
        "12 billion parameter flow transformer architecture",
        "High-quality image generation with incredible aesthetics",
        "Exceptional prompt understanding and interpretation",
        "Suitable for both personal and commercial use",
        "Advanced streaming capabilities for real-time generation",
        "Flexible image size options with custom dimensions",
        "Multiple acceleration levels for speed/quality optimization",
        "Robust safety checking mechanisms",
        "High-quality output with multiple format options",
        "Excellent artistic and aesthetic quality"
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
  private validateInput(input: FluxKreaInput): void {
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

    if (input.num_images !== undefined && (input.num_images < 1 || input.num_images > 4)) {
      throw new Error("Number of images must be between 1 and 4");
    }

    if (input.acceleration !== undefined && !["none", "regular", "high"].includes(input.acceleration)) {
      throw new Error("Acceleration must be 'none', 'regular', or 'high'");
    }

    if (input.output_format !== undefined && !["jpeg", "png"].includes(input.output_format)) {
      throw new Error("Output format must be 'jpeg' or 'png'");
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
  private isValidImageSize(imageSize: any): imageSize is FluxKreaInput["image_size"] {
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
  private mergeWithDefaults(input: FluxKreaInput): FluxKreaInput {
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
  private handleError(error: any): FluxKreaError {
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
export const fluxKreaUtils = {
  /**
   * Create an artistic portrait prompt
   * @param subject - Subject description
   * @param style - Artistic style
   * @param setting - Setting description
   * @returns Formatted prompt
   */
  createArtisticPortraitPrompt(subject: string, style: string = "artistic", setting: string = "studio"): string {
    return `A stunning ${style} portrait of ${subject} in a ${setting}, golden hour lighting, artistic atmosphere, high aesthetic quality, beautiful composition, professional photography`;
  },

  /**
   * Create a fashion photography prompt
   * @param clothing - Clothing description
   * @param model - Model description
   * @param location - Location description
   * @returns Formatted prompt
   */
  createFashionPrompt(clothing: string, model: string = "fashion model", location: string = "urban setting"): string {
    return `A candid fashion photography shot of a ${model} wearing ${clothing} in a ${location}, natural lighting, authentic urban scene, relaxed unposed feel, high aesthetic quality, commercial photography`;
  },

  /**
   * Create a lifestyle photography prompt
   * @param activity - Activity description
   * @param mood - Mood description
   * @param environment - Environment description
   * @returns Formatted prompt
   */
  createLifestylePrompt(activity: string, mood: string = "authentic", environment: string = "natural setting"): string {
    return `A candid lifestyle photography of ${activity} in a ${environment}, ${mood} mood, natural lighting, authentic scene, relaxed unposed feel, high aesthetic quality, documentary style`;
  },

  /**
   * Create a commercial product prompt
   * @param product - Product description
   * @param style - Photography style
   * @param setting - Setting description
   * @returns Formatted prompt
   */
  createCommercialProductPrompt(product: string, style: string = "commercial", setting: string = "studio"): string {
    return `A ${style} product photography of ${product} in a ${setting}, professional lighting, high aesthetic quality, commercial appeal, beautiful composition, marketing ready`;
  },

  /**
   * Create a fine art prompt
   * @param concept - Artistic concept
   * @param style - Art style
   * @param medium - Artistic medium
   * @returns Formatted prompt
   */
  createFineArtPrompt(concept: string, style: string = "fine art", medium: string = "digital art"): string {
    return `A stunning ${style} ${medium} piece depicting ${concept}, gallery quality, artistic excellence, high aesthetic appeal, beautiful composition, museum worthy`;
  },

  /**
   * Create a street photography prompt
   * @param scene - Street scene description
   * @param mood - Mood description
   * @param time - Time of day
   * @returns Formatted prompt
   */
  createStreetPhotographyPrompt(scene: string, mood: string = "authentic", time: string = "golden hour"): string {
    return `A candid street photography of ${scene} during ${time}, ${mood} mood, natural urban lighting, authentic city scene, documentary style, high aesthetic quality`;
  },

  /**
   * Get recommended image size for use case
   * @param useCase - The intended use case
   * @returns Recommended image size
   */
  getRecommendedImageSize(useCase: string): FluxKreaInput["image_size"] {
    const recommendations: Record<string, FluxKreaInput["image_size"]> = {
      "portrait": "portrait_4_3",
      "fashion": "portrait_16_9",
      "lifestyle": "landscape_4_3",
      "commercial": "square_hd",
      "fine_art": "portrait_4_3",
      "street_photography": "landscape_4_3",
      "product": "square_hd",
      "editorial": "portrait_16_9",
      "social_media": "square_hd",
      "print": "portrait_4_3"
    };

    return recommendations[useCase.toLowerCase()] || "landscape_4_3";
  },

  /**
   * Get recommended aspect ratio for use case
   * @param useCase - The intended use case
   * @returns Recommended aspect ratio
   */
  getRecommendedAspectRatio(useCase: string): string {
    const recommendations: Record<string, string> = {
      "portrait": "3:4",
      "fashion": "9:16",
      "lifestyle": "4:3",
      "commercial": "1:1",
      "fine_art": "3:4",
      "street_photography": "4:3",
      "product": "1:1",
      "editorial": "9:16",
      "social_media": "1:1",
      "print": "3:4"
    };

    return recommendations[useCase.toLowerCase()] || "4:3";
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
   * Get recommended acceleration level for use case
   * @param useCase - The intended use case
   * @returns Recommended acceleration level
   */
  getRecommendedAcceleration(useCase: string): "none" | "regular" | "high" {
    const recommendations: Record<string, "none" | "regular" | "high"> = {
      "portrait": "none",
      "fashion": "none",
      "lifestyle": "regular",
      "commercial": "none",
      "fine_art": "none",
      "street_photography": "regular",
      "product": "none",
      "editorial": "none",
      "social_media": "regular",
      "print": "none"
    };

    return recommendations[useCase.toLowerCase()] || "regular";
  }
};

// Export default executor instance
export default FluxKreaExecutor;
