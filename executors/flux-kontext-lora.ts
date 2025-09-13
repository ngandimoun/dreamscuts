import { fal } from "@fal-ai/client";

// Types for the FLUX.1 Kontext LoRA model
export interface FluxKontextLoraInput {
  prompt: string;
  image_size?: "square_hd" | "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9" | { width: number; height: number };
  num_inference_steps?: number;
  seed?: number;
  guidance_scale?: number;
  sync_mode?: boolean;
  num_images?: number;
  enable_safety_checker?: boolean;
  output_format?: "jpeg" | "png";
  loras?: Array<{
    path: string;
    scale?: number;
  }>;
  acceleration?: "none" | "regular" | "high";
}

export interface FluxKontextLoraOutput {
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

export interface FluxKontextLoraError {
  error: string;
  message: string;
  code?: string;
}

// Model configuration
const MODEL_ENDPOINT = "fal-ai/flux-kontext-lora/text-to-image";

// Default configuration
const DEFAULT_CONFIG = {
  image_size: "landscape_4_3" as const,
  num_inference_steps: 30,
  guidance_scale: 2.5,
  num_images: 1,
  enable_safety_checker: true,
  output_format: "png" as const,
  acceleration: "none" as const,
};

/**
 * FLUX.1 Kontext LoRA Generation Executor
 * 
 * This executor provides a comprehensive interface for generating images using the FLUX.1 Kontext LoRA model
 * through the fal.ai API. It's optimized for speed and LoRA-based customization with megapixel-based pricing.
 */
export class FluxKontextLoraExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    
    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Generate images using the FLUX.1 Kontext LoRA model
   * @param input - The input parameters for image generation
   * @returns Promise<FluxKontextLoraOutput> - The generated images and metadata
   */
  async generateImages(input: FluxKontextLoraInput): Promise<FluxKontextLoraOutput> {
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
   * @returns Promise<FluxKontextLoraOutput> - The generated images and metadata
   */
  async generateImagesStreaming(input: FluxKontextLoraInput): Promise<FluxKontextLoraOutput> {
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
    input: FluxKontextLoraInput,
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
   * @returns Promise<FluxKontextLoraOutput> - The generated images and metadata
   */
  async getQueueResult(requestId: string): Promise<FluxKontextLoraOutput> {
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
   * @returns Promise<FluxKontextLoraOutput[]> - Array of results for each prompt
   */
  async generateMultipleImages(
    prompts: string[],
    imageSize?: FluxKontextLoraInput["image_size"]
  ): Promise<FluxKontextLoraOutput[]> {
    const results: FluxKontextLoraOutput[] = [];

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
          error: (error as FluxKontextLoraError).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate images with different image sizes
   * @param input - Base input parameters
   * @param imageSizes - Array of image sizes to generate
   * @returns Promise<FluxKontextLoraOutput[]> - Array of results for each size
   */
  async generateWithImageSizes(
    input: Omit<FluxKontextLoraInput, "image_size">,
    imageSizes: FluxKontextLoraInput["image_size"][]
  ): Promise<FluxKontextLoraOutput[]> {
    const results: FluxKontextLoraOutput[] = [];

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
          error: (error as FluxKontextLoraError).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate images with high acceleration for maximum speed
   * @param input - The input parameters for image generation
   * @returns Promise<FluxKontextLoraOutput> - The generated images with high acceleration
   */
  async generateWithHighAcceleration(input: FluxKontextLoraInput): Promise<FluxKontextLoraOutput> {
    return this.generateImages({
      ...input,
      acceleration: "high",
    });
  }

  /**
   * Generate images with regular acceleration for balanced performance
   * @param input - The input parameters for image generation
   * @returns Promise<FluxKontextLoraOutput> - The generated images with regular acceleration
   */
  async generateWithRegularAcceleration(input: FluxKontextLoraInput): Promise<FluxKontextLoraOutput> {
    return this.generateImages({
      ...input,
      acceleration: "regular",
    });
  }

  /**
   * Generate images with no acceleration for maximum quality
   * @param input - The input parameters for image generation
   * @returns Promise<FluxKontextLoraOutput> - The generated images with no acceleration
   */
  async generateWithNoAcceleration(input: FluxKontextLoraInput): Promise<FluxKontextLoraOutput> {
    return this.generateImages({
      ...input,
      acceleration: "none",
    });
  }

  /**
   * Generate images with LoRA weights for style customization
   * @param input - The input parameters for image generation
   * @param loras - Array of LoRA weights to apply
   * @returns Promise<FluxKontextLoraOutput> - The generated images with LoRA customization
   */
  async generateWithLoRA(
    input: FluxKontextLoraInput,
    loras: Array<{ path: string; scale?: number }>
  ): Promise<FluxKontextLoraOutput> {
    return this.generateImages({
      ...input,
      loras,
    });
  }

  /**
   * Generate images with a single LoRA weight
   * @param input - The input parameters for image generation
   * @param loraPath - Path to the LoRA weight file
   * @param scale - Scale factor for the LoRA weight (default: 1.0)
   * @returns Promise<FluxKontextLoraOutput> - The generated images with LoRA customization
   */
  async generateWithSingleLoRA(
    input: FluxKontextLoraInput,
    loraPath: string,
    scale: number = 1.0
  ): Promise<FluxKontextLoraOutput> {
    return this.generateImages({
      ...input,
      loras: [{ path: loraPath, scale }],
    });
  }

  /**
   * Generate images optimized for speed
   * @param input - The input parameters for image generation
   * @returns Promise<FluxKontextLoraOutput> - The generated images optimized for speed
   */
  async generateSpeedOptimized(input: FluxKontextLoraInput): Promise<FluxKontextLoraOutput> {
    return this.generateImages({
      ...input,
      acceleration: "high",
      num_inference_steps: 20,
    });
  }

  /**
   * Generate images with streaming for real-time feedback
   * @param input - The input parameters for image generation
   * @returns Promise<FluxKontextLoraOutput> - The generated images with streaming
   */
  async generateWithStreaming(input: FluxKontextLoraInput): Promise<FluxKontextLoraOutput> {
    return this.generateImagesStreaming(input);
  }

  /**
   * Get model information and capabilities
   * @returns Object with model information
   */
  getModelInfo() {
    return {
      name: "FLUX.1 Kontext LoRA",
      version: "dev",
      provider: "fal-ai",
      endpoint: MODEL_ENDPOINT,
      supportedImageSizes: ["square_hd", "square", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"],
      supportedAspectRatios: ["1:1", "4:3", "16:9", "3:4", "9:16"],
      pricing: {
        standard: 0.035,
        unit: "per megapixel",
      },
      features: [
        "Super fast text-to-image generation with optimized performance",
        "Comprehensive LoRA support for style customization and personalization",
        "Pre-trained LoRA adaptations for brand identities and specific styles",
        "High-quality output with rapid generation times",
        "Flexible image size options with custom dimensions",
        "Multiple acceleration levels for speed optimization",
        "Robust safety checking mechanisms",
        "Streaming capabilities for real-time generation feedback",
        "Cost-effective megapixel-based pricing",
        "Excellent for rapid prototyping and iterative workflows"
      ],
    };
  }

  /**
   * Calculate cost for generation based on megapixels
   * @param width - Image width in pixels
   * @param height - Image height in pixels
   * @param numImages - Number of images to generate
   * @returns Cost in dollars
   */
  calculateCost(width: number, height: number, numImages: number = 1): number {
    const megapixels = (width * height) / 1000000; // Convert to megapixels
    return 0.035 * megapixels * numImages;
  }

  /**
   * Calculate cost for a specific image size
   * @param imageSize - The image size to calculate cost for
   * @param numImages - Number of images to generate
   * @returns Cost in dollars
   */
  calculateCostForSize(imageSize: FluxKontextLoraInput["image_size"], numImages: number = 1): number {
    let width = 1024;
    let height = 768;

    if (typeof imageSize === "string") {
      const sizeMap: Record<string, { width: number; height: number }> = {
        square_hd: { width: 1024, height: 1024 },
        square: { width: 512, height: 512 },
        portrait_4_3: { width: 768, height: 1024 },
        portrait_16_9: { width: 576, height: 1024 },
        landscape_4_3: { width: 1024, height: 768 },
        landscape_16_9: { width: 1024, height: 576 },
      };
      const size = sizeMap[imageSize];
      if (size) {
        width = size.width;
        height = size.height;
      }
    } else if (typeof imageSize === "object" && imageSize !== null) {
      width = imageSize.width;
      height = imageSize.height;
    }

    return this.calculateCost(width, height, numImages);
  }

  /**
   * Calculate images per dollar for a given budget and image size
   * @param budget - Budget in dollars
   * @param width - Image width in pixels
   * @param height - Image height in pixels
   * @returns Number of images that can be generated
   */
  calculateImagesPerDollar(budget: number, width: number, height: number): number {
    const costPerImage = this.calculateCost(width, height, 1);
    return Math.floor(budget / costPerImage);
  }

  /**
   * Validate input parameters
   * @param input - The input to validate
   */
  private validateInput(input: FluxKontextLoraInput): void {
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

    if (input.loras) {
      for (const lora of input.loras) {
        if (!lora.path || lora.path.trim().length === 0) {
          throw new Error("LoRA path is required and cannot be empty");
        }
        if (lora.scale !== undefined && (lora.scale < 0 || lora.scale > 2)) {
          throw new Error("LoRA scale must be between 0 and 2");
        }
      }
    }
  }

  /**
   * Check if an image size is valid
   * @param imageSize - The image size to validate
   * @returns Boolean indicating if the image size is valid
   */
  private isValidImageSize(imageSize: any): imageSize is FluxKontextLoraInput["image_size"] {
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
  private mergeWithDefaults(input: FluxKontextLoraInput): FluxKontextLoraInput {
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
  private handleError(error: any): FluxKontextLoraError {
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
export const fluxKontextLoraUtils = {
  /**
   * Create a brand identity prompt
   * @param brand - Brand name
   * @param style - Brand style description
   * @param context - Usage context
   * @returns Formatted prompt
   */
  createBrandIdentityPrompt(brand: string, style: string = "modern", context: string = "logo"): string {
    return `A ${style} ${context} design for ${brand}, professional branding, clean and memorable, suitable for commercial use, high-quality design`;
  },

  /**
   * Create a style-specific prompt
   * @param subject - Subject description
   * @param style - Artistic style
   * @param mood - Mood description
   * @returns Formatted prompt
   */
  createStyleSpecificPrompt(subject: string, style: string = "artistic", mood: string = "elegant"): string {
    return `A ${style} representation of ${subject}, ${mood} mood, high-quality rendering, professional composition, suitable for commercial use`;
  },

  /**
   * Create a rapid prototyping prompt
   * @param concept - Design concept
   * @param type - Type of design
   * @param style - Design style
   * @returns Formatted prompt
   */
  createRapidPrototypingPrompt(concept: string, type: string = "concept", style: string = "modern"): string {
    return `A ${style} ${type} design for ${concept}, clean and professional, suitable for rapid iteration, high-quality output`;
  },

  /**
   * Create a personalized content prompt
   * @param content - Content description
   * @param personalization - Personalization elements
   * @param style - Content style
   * @returns Formatted prompt
   */
  createPersonalizedContentPrompt(content: string, personalization: string = "custom", style: string = "personalized"): string {
    return `A ${style} ${content} with ${personalization} elements, unique and personalized, high-quality generation, professional appearance`;
  },

  /**
   * Create a marketing campaign prompt
   * @param campaign - Campaign description
   * @param target - Target audience
   * @param style - Campaign style
   * @returns Formatted prompt
   */
  createMarketingCampaignPrompt(campaign: string, target: string = "general", style: string = "commercial"): string {
    return `A ${style} marketing visual for ${campaign}, targeting ${target} audience, engaging and professional, high-quality commercial design`;
  },

  /**
   * Create a character design prompt
   * @param character - Character description
   * @param style - Character style
   * @param context - Character context
   * @returns Formatted prompt
   */
  createCharacterDesignPrompt(character: string, style: string = "consistent", context: string = "design"): string {
    return `A ${style} character ${context} of ${character}, detailed and professional, suitable for consistent use across multiple applications`;
  },

  /**
   * Get recommended image size for use case
   * @param useCase - The intended use case
   * @returns Recommended image size
   */
  getRecommendedImageSize(useCase: string): FluxKontextLoraInput["image_size"] {
    const recommendations: Record<string, FluxKontextLoraInput["image_size"]> = {
      "brand_identity": "square_hd",
      "style_specific": "portrait_4_3",
      "rapid_prototyping": "landscape_4_3",
      "personalized_content": "square_hd",
      "marketing_campaign": "landscape_16_9",
      "character_design": "portrait_4_3",
      "social_media": "square_hd",
      "print": "portrait_4_3",
      "web": "landscape_16_9",
      "mobile": "portrait_16_9"
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
      "brand_identity": "1:1",
      "style_specific": "3:4",
      "rapid_prototyping": "4:3",
      "personalized_content": "1:1",
      "marketing_campaign": "16:9",
      "character_design": "3:4",
      "social_media": "1:1",
      "print": "3:4",
      "web": "16:9",
      "mobile": "9:16"
    };

    return recommendations[useCase.toLowerCase()] || "4:3";
  },

  /**
   * Estimate cost for generation based on megapixels
   * @param width - Image width in pixels
   * @param height - Image height in pixels
   * @param numImages - Number of images to generate
   * @returns Estimated cost
   */
  estimateCost(width: number, height: number, numImages: number = 1): number {
    const megapixels = (width * height) / 1000000; // Convert to megapixels
    return 0.035 * megapixels * numImages;
  },

  /**
   * Calculate images per dollar for a given budget and image size
   * @param budget - Budget in dollars
   * @param width - Image width in pixels
   * @param height - Image height in pixels
   * @returns Number of images that can be generated
   */
  calculateImagesPerDollar(budget: number, width: number, height: number): number {
    const costPerImage = this.estimateCost(width, height, 1);
    return Math.floor(budget / costPerImage);
  },

  /**
   * Get recommended acceleration level for use case
   * @param useCase - The intended use case
   * @returns Recommended acceleration level
   */
  getRecommendedAcceleration(useCase: string): "none" | "regular" | "high" {
    const recommendations: Record<string, "none" | "regular" | "high"> = {
      "brand_identity": "none",
      "style_specific": "regular",
      "rapid_prototyping": "high",
      "personalized_content": "regular",
      "marketing_campaign": "regular",
      "character_design": "none",
      "social_media": "high",
      "print": "none",
      "web": "regular",
      "mobile": "high"
    };

    return recommendations[useCase.toLowerCase()] || "regular";
  },

  /**
   * Create LoRA weight configuration
   * @param path - Path to LoRA weight file
   * @param scale - Scale factor (default: 1.0)
   * @returns LoRA weight configuration
   */
  createLoraWeight(path: string, scale: number = 1.0): { path: string; scale: number } {
    return { path, scale };
  },

  /**
   * Create multiple LoRA weight configurations
   * @param loras - Array of LoRA configurations
   * @returns Array of LoRA weight configurations
   */
  createLoraWeights(loras: Array<{ path: string; scale?: number }>): Array<{ path: string; scale: number }> {
    return loras.map(lora => ({ path: lora.path, scale: lora.scale || 1.0 }));
  }
};

// Export default executor instance
export default FluxKontextLoraExecutor;
