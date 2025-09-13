import { fal } from "@fal-ai/client";

// Types for LoRA weights
export interface LoRAWeight {
  path: string;
  weight_name?: string;
  scale?: number;
  transformer?: "high" | "low" | "both";
}

// Types for the Wan v2.2-a14b LoRA model
export interface WanV22A14BLoRAInput {
  prompt: string;
  negative_prompt?: string;
  seed?: number;
  num_inference_steps?: number;
  enable_safety_checker?: boolean;
  enable_prompt_expansion?: boolean;
  acceleration?: "none" | "regular";
  guidance_scale?: number;
  guidance_scale_2?: number;
  shift?: number;
  loras?: LoRAWeight[];
  reverse_video?: boolean;
  image_size?: "square_hd" | "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9" | { width: number; height: number };
}

export interface WanV22A14BLoRAOutput {
  image: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  seed?: number;
  requestId?: string;
}

export interface WanV22A14BLoRAError {
  error: string;
  message: string;
  code?: string;
}

// Model configuration
const MODEL_ENDPOINT = "fal-ai/wan/v2.2-a14b/text-to-image/lora";

// Default configuration
const DEFAULT_CONFIG = {
  num_inference_steps: 27,
  guidance_scale: 3.5,
  guidance_scale_2: 4,
  shift: 2,
  acceleration: "regular" as const,
  image_size: "square_hd" as const,
  negative_prompt: "",
  loras: [],
};

/**
 * Wan v2.2-a14b LoRA Image Generation Executor
 * 
 * This executor provides a comprehensive interface for generating ultra-high quality,
 * photorealistic images using the Wan v2.2-a14b LoRA model through the fal.ai API. It's
 * optimized for exceptional image quality with the 14B parameter architecture and
 * LoRA support for enhanced style control and customization.
 */
export class WanV22A14BLoRAExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    
    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Generate images using the Wan v2.2-a14b LoRA model
   * @param input - The input parameters for image generation
   * @returns Promise<WanV22A14BLoRAOutput> - The generated image and metadata
   */
  async generateImages(input: WanV22A14BLoRAInput): Promise<WanV22A14BLoRAOutput> {
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
    input: WanV22A14BLoRAInput,
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
   * @returns Promise<WanV22A14BLoRAOutput> - The generated image and metadata
   */
  async getQueueResult(requestId: string): Promise<WanV22A14BLoRAOutput> {
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
   * @param loras - Optional LoRA weights to use for all generations
   * @returns Promise<WanV22A14BLoRAOutput[]> - Array of results for each prompt
   */
  async generateMultipleImages(
    prompts: string[],
    imageSize?: WanV22A14BLoRAInput["image_size"],
    loras?: LoRAWeight[]
  ): Promise<WanV22A14BLoRAOutput[]> {
    const results: WanV22A14BLoRAOutput[] = [];

    for (const prompt of prompts) {
      try {
        const result = await this.generateImages({
          prompt,
          image_size: imageSize,
          loras
        });
        results.push(result);
      } catch (error) {
        console.error(`Failed to generate image for prompt: ${prompt}`, error);
        results.push({
          image: { url: "" },
          error: (error as WanV22A14BLoRAError).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate images with different image sizes
   * @param input - Base input parameters
   * @param imageSizes - Array of image sizes to generate
   * @returns Promise<WanV22A14BLoRAOutput[]> - Array of results for each size
   */
  async generateWithImageSizes(
    input: Omit<WanV22A14BLoRAInput, "image_size">,
    imageSizes: WanV22A14BLoRAInput["image_size"][]
  ): Promise<WanV22A14BLoRAOutput[]> {
    const results: WanV22A14BLoRAOutput[] = [];

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
          error: (error as WanV22A14BLoRAError).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate images with enhanced prompt expansion
   * @param input - The input parameters for image generation
   * @returns Promise<WanV22A14BLoRAOutput> - The generated image with enhanced prompts
   */
  async generateWithPromptExpansion(input: WanV22A14BLoRAInput): Promise<WanV22A14BLoRAOutput> {
    return this.generateImages({
      ...input,
      enable_prompt_expansion: true,
    });
  }

  /**
   * Generate ultra-high quality images with maximum quality settings
   * @param input - The input parameters for image generation
   * @returns Promise<WanV22A14BLoRAOutput> - The generated ultra-high quality image
   */
  async generateUltraHighQuality(input: WanV22A14BLoRAInput): Promise<WanV22A14BLoRAOutput> {
    return this.generateImages({
      ...input,
      num_inference_steps: 40,
      guidance_scale: 4.0,
      guidance_scale_2: 5.0,
      enable_prompt_expansion: true,
      acceleration: "none",
    });
  }

  /**
   * Generate images with no acceleration for maximum quality
   * @param input - The input parameters for image generation
   * @returns Promise<WanV22A14BLoRAOutput> - The generated image with no acceleration
   */
  async generateWithNoAcceleration(input: WanV22A14BLoRAInput): Promise<WanV22A14BLoRAOutput> {
    return this.generateImages({
      ...input,
      acceleration: "none",
    });
  }

  /**
   * Generate images with specific LoRA weights
   * @param input - The input parameters for image generation
   * @param loras - Array of LoRA weights to apply
   * @returns Promise<WanV22A14BLoRAOutput> - The generated image with LoRA styles
   */
  async generateWithLoRA(input: WanV22A14BLoRAInput, loras: LoRAWeight[]): Promise<WanV22A14BLoRAOutput> {
    return this.generateImages({
      ...input,
      loras,
    });
  }

  /**
   * Generate images with a single LoRA weight
   * @param input - The input parameters for image generation
   * @param lora - Single LoRA weight to apply
   * @returns Promise<WanV22A14BLoRAOutput> - The generated image with LoRA style
   */
  async generateWithSingleLoRA(input: WanV22A14BLoRAInput, lora: LoRAWeight): Promise<WanV22A14BLoRAOutput> {
    return this.generateImages({
      ...input,
      loras: [lora],
    });
  }

  /**
   * Get model information and capabilities
   * @returns Object with model information
   */
  getModelInfo() {
    return {
      name: "Wan",
      version: "v2.2-a14b-lora",
      provider: "fal-ai",
      endpoint: MODEL_ENDPOINT,
      supportedImageSizes: ["square_hd", "square", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"],
      supportedAspectRatios: ["1:1", "4:3", "16:9", "3:4", "9:16"],
      pricing: {
        standard: 0.03,
      },
      features: [
        "Ultra-high resolution photorealistic image generation",
        "14B parameter architecture for maximum quality",
        "LoRA support for enhanced style control and customization",
        "Superior prompt understanding and interpretation",
        "Ultra-fine-grained visual detail and texture",
        "Advanced inference control with multiple parameters",
        "Professional-grade output quality",
        "Enhanced visual fidelity and attention to detail",
        "Style adaptability through LoRA weights"
      ],
    };
  }

  /**
   * Calculate cost for generation
   * @param numImages - Number of images to generate
   * @returns Cost in dollars
   */
  calculateCost(numImages: number = 1): number {
    return 0.03 * numImages;
  }

  /**
   * Calculate images per dollar
   * @param budget - Budget in dollars
   * @returns Number of images that can be generated
   */
  calculateImagesPerDollar(budget: number): number {
    return Math.floor(budget / 0.03);
  }

  /**
   * Validate input parameters
   * @param input - The input to validate
   */
  private validateInput(input: WanV22A14BLoRAInput): void {
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

    if (input.guidance_scale_2 !== undefined && input.guidance_scale_2 <= 0) {
      throw new Error("Guidance scale 2 must be positive");
    }

    if (input.shift !== undefined && (input.shift < 1.0 || input.shift > 10.0)) {
      throw new Error("Shift value must be between 1.0 and 10.0");
    }

    if (input.acceleration !== undefined && !["none", "regular"].includes(input.acceleration)) {
      throw new Error("Acceleration must be either 'none' or 'regular'");
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

    // Validate LoRA weights
    if (input.loras) {
      for (const lora of input.loras) {
        if (!lora.path || lora.path.trim().length === 0) {
          throw new Error("LoRA path is required and cannot be empty");
        }

        if (lora.scale !== undefined && (lora.scale < 0 || lora.scale > 2)) {
          throw new Error("LoRA scale must be between 0 and 2");
        }

        if (lora.transformer !== undefined && !["high", "low", "both"].includes(lora.transformer)) {
          throw new Error("LoRA transformer must be 'high', 'low', or 'both'");
        }
      }
    }
  }

  /**
   * Check if an image size is valid
   * @param imageSize - The image size to validate
   * @returns Boolean indicating if the image size is valid
   */
  private isValidImageSize(imageSize: any): imageSize is WanV22A14BLoRAInput["image_size"] {
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
  private mergeWithDefaults(input: WanV22A14BLoRAInput): WanV22A14BLoRAInput {
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
  private handleError(error: any): WanV22A14BLoRAError {
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
export const wanV22A14BLoRAUtils = {
  /**
   * Create a LoRA weight configuration
   * @param path - Path or URL to the LoRA weights
   * @param scale - Scale factor for the LoRA (0-2)
   * @param transformer - Transformer to load into ('high', 'low', 'both')
   * @param weightName - Optional weight name for Hugging Face repos
   * @returns LoRA weight configuration
   */
  createLoRAWeight(path: string, scale: number = 1, transformer: "high" | "low" | "both" = "high", weightName?: string): LoRAWeight {
    return {
      path,
      scale,
      transformer,
      weight_name: weightName,
    };
  },

  /**
   * Create a wildlife photography prompt
   * @param animal - Animal description
   * @param setting - Environment or setting
   * @returns Formatted prompt
   */
  createWildlifePrompt(animal: string, setting: string = "natural habitat"): string {
    return `In this breathtaking wildlife documentary, we are drawn into an intimate close-up of a majestic ${animal}, framed against the backdrop of a vast ${setting}. The camera captures the raw power and nobility of the creature as it gazes intently into the distance, its fur glistening under the soft, diffused light that bathes the scene in an ethereal glow. Harsh shadows dance across its features, accentuating the deep wrinkles around its eyes and the rugged texture of its fur, each strand a testament to its age and wisdom.`;
  },

  /**
   * Create a portrait photography prompt
   * @param person - Person description
   * @param style - Photography style
   * @returns Formatted prompt
   */
  createPortraitPrompt(person: string, style: string = "professional"): string {
    return `${style} portrait photography of ${person}, natural lighting, beautiful composition, high quality, photorealistic detail, stunning visual appeal, ultra-fine detail`;
  },

  /**
   * Create a landscape photography prompt
   * @param scene - Landscape scene
   * @param timeOfDay - Time of day
   * @returns Formatted prompt
   */
  createLandscapePrompt(scene: string, timeOfDay: string = "golden hour"): string {
    return `${timeOfDay} landscape photography of ${scene}, natural lighting, beautiful composition, high resolution, photorealistic detail, stunning visual appeal, ultra-fine detail`;
  },

  /**
   * Create a product photography prompt
   * @param product - Product description
   * @param style - Photography style
   * @returns Formatted prompt
   */
  createProductPrompt(product: string, style: string = "commercial"): string {
    return `${style} product photography of ${product}, professional lighting, clean background, high quality, photorealistic detail, commercial appeal, ultra-fine detail`;
  },

  /**
   * Create a fine art prompt
   * @param concept - Art concept
   * @param style - Artistic style
   * @returns Formatted prompt
   */
  createFineArtPrompt(concept: string, style: string = "fine art"): string {
    return `${style} composition of ${concept}, gallery-quality, beautiful composition, high quality, photorealistic detail, stunning visual appeal, ultra-fine detail, artistic excellence`;
  },

  /**
   * Create a character design prompt
   * @param character - Character description
   * @param style - Character style
   * @returns Formatted prompt
   */
  createCharacterPrompt(character: string, style: string = "detailed"): string {
    return `${style} character design of ${character}, consistent appearance, high quality, photorealistic detail, stunning visual appeal, ultra-fine detail, character consistency`;
  },

  /**
   * Create a brand identity prompt
   * @param brand - Brand description
   * @param style - Brand style
   * @returns Formatted prompt
   */
  createBrandPrompt(brand: string, style: string = "brand"): string {
    return `${style} visual identity for ${brand}, consistent branding, high quality, photorealistic detail, stunning visual appeal, ultra-fine detail, brand consistency`;
  },

  /**
   * Get recommended image size for use case
   * @param useCase - The intended use case
   * @returns Recommended image size
   */
  getRecommendedImageSize(useCase: string): WanV22A14BLoRAInput["image_size"] {
    const recommendations: Record<string, WanV22A14BLoRAInput["image_size"]> = {
      "portrait": "portrait_16_9",
      "landscape": "landscape_16_9",
      "square": "square_hd",
      "product": "square_hd",
      "wildlife": "landscape_16_9",
      "nature": "landscape_16_9",
      "commercial": "square_hd",
      "artistic": "square_hd",
      "fine_art": "square_hd",
      "scientific": "square_hd",
      "gallery": "square_hd",
      "character": "square_hd",
      "brand": "square_hd"
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
      "artistic": "1:1",
      "fine_art": "1:1",
      "scientific": "1:1",
      "gallery": "1:1",
      "character": "1:1",
      "brand": "1:1"
    };

    return recommendations[useCase.toLowerCase()] || "1:1";
  },

  /**
   * Estimate cost for generation
   * @param numImages - Number of images to generate
   * @returns Estimated cost
   */
  estimateCost(numImages: number): number {
    return 0.03 * numImages;
  },

  /**
   * Calculate images per dollar
   * @param budget - Budget in dollars
   * @returns Number of images that can be generated
   */
  calculateImagesPerDollar(budget: number): number {
    return Math.floor(budget / 0.03);
  },

  /**
   * Create a nature photography prompt
   * @param subject - Nature subject
   * @param mood - Desired mood
   * @returns Formatted prompt
   */
  createNaturePrompt(subject: string, mood: string = "serene"): string {
    return `${mood} nature photography of ${subject}, natural lighting, beautiful composition, high quality, photorealistic detail, stunning visual appeal, ultra-fine detail`;
  },

  /**
   * Create a commercial photography prompt
   * @param subject - Commercial subject
   * @param style - Commercial style
   * @returns Formatted prompt
   */
  createCommercialPrompt(subject: string, style: string = "professional"): string {
    return `${style} commercial photography of ${subject}, professional lighting, clean background, high quality, photorealistic detail, commercial appeal, ultra-fine detail`;
  },

  /**
   * Create an artistic composition prompt
   * @param concept - Artistic concept
   * @param style - Artistic style
   * @returns Formatted prompt
   */
  createArtisticPrompt(concept: string, style: string = "artistic"): string {
    return `${style} composition of ${concept}, creative lighting, beautiful composition, high quality, photorealistic detail, stunning visual appeal, ultra-fine detail`;
  }
};

// Export default executor instance
export default WanV22A14BLoRAExecutor;
