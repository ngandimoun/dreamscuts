import { fal } from "@fal-ai/client";

// Types for the Gemini 25 Flash Image model
export interface Gemini25FlashImageInput {
  prompt: string;
  num_images?: number;
  output_format?: "jpeg" | "png";
  sync_mode?: boolean;
}

export interface Gemini25FlashImageOutput {
  images: Array<{
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  }>;
  description?: string;
  requestId?: string;
}

export interface Gemini25FlashImageError {
  error: string;
  message: string;
  code?: string;
}

// Model configuration
const MODEL_ENDPOINT = "fal-ai/gemini-25-flash-image";

// Default configuration
const DEFAULT_CONFIG = {
  num_images: 1,
  output_format: "jpeg" as const,
};

/**
 * Gemini 25 Flash Image Generation Executor
 * 
 * This executor provides a comprehensive interface for generating images using Google's
 * Gemini 25 Flash Image model through the fal.ai API. It's optimized for high-quality
 * image generation with fast processing times and advanced capabilities.
 */
export class Gemini25FlashImageExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    
    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Generate images using the Gemini 25 Flash Image model
   * @param input - The input parameters for image generation
   * @returns Promise<Gemini25FlashImageOutput> - The generated images and metadata
   */
  async generateImages(input: Gemini25FlashImageInput): Promise<Gemini25FlashImageOutput> {
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
        description: result.description,
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
    input: Gemini25FlashImageInput,
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
   * @returns Promise<Gemini25FlashImageOutput> - The generated images and metadata
   */
  async getQueueResult(requestId: string): Promise<Gemini25FlashImageOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });

      return {
        images: result.images || [],
        description: result.description,
        requestId: result.requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate multiple images with different prompts
   * @param prompts - Array of prompts to generate images for
   * @param outputFormat - Optional output format to use for all generations
   * @returns Promise<Gemini25FlashImageOutput[]> - Array of results for each prompt
   */
  async generateMultipleImages(
    prompts: string[],
    outputFormat?: Gemini25FlashImageInput["output_format"]
  ): Promise<Gemini25FlashImageOutput[]> {
    const results: Gemini25FlashImageOutput[] = [];

    for (const prompt of prompts) {
      try {
        const result = await this.generateImages({
          prompt,
          output_format: outputFormat
        });
        results.push(result);
      } catch (error) {
        console.error(`Failed to generate image for prompt: ${prompt}`, error);
        results.push({
          images: [],
          error: (error as Gemini25FlashImageError).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate images with different output formats
   * @param input - Base input parameters
   * @param outputFormats - Array of output formats to generate
   * @returns Promise<Gemini25FlashImageOutput[]> - Array of results for each format
   */
  async generateWithOutputFormats(
    input: Omit<Gemini25FlashImageInput, "output_format">,
    outputFormats: Gemini25FlashImageInput["output_format"][]
  ): Promise<Gemini25FlashImageOutput[]> {
    const results: Gemini25FlashImageOutput[] = [];

    for (const outputFormat of outputFormats) {
      try {
        const result = await this.generateImages({
          ...input,
          output_format: outputFormat,
        });
        results.push(result);
      } catch (error) {
        console.error(
          `Failed to generate image with output format: ${outputFormat}`,
          error
        );
        results.push({
          images: [],
          error: (error as Gemini25FlashImageError).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate images with sync mode for data URIs
   * @param input - The input parameters for image generation
   * @returns Promise<Gemini25FlashImageOutput> - The generated images with data URIs
   */
  async generateImagesSync(input: Gemini25FlashImageInput): Promise<Gemini25FlashImageOutput> {
    return this.generateImages({
      ...input,
      sync_mode: true,
    });
  }

  /**
   * Get model information and capabilities
   * @returns Object with model information
   */
  getModelInfo() {
    return {
      name: "Gemini",
      version: "25-flash-image",
      provider: "fal-ai",
      endpoint: MODEL_ENDPOINT,
      supportedOutputFormats: ["jpeg", "png"],
      pricing: {
        standard: 0.039,
      },
      features: [
        "State-of-the-art image generation quality",
        "Fast processing and generation times",
        "Advanced image editing capabilities",
        "Google's latest AI technology",
        "Sync mode for data URI outputs",
        "Excellent prompt understanding"
      ],
    };
  }

  /**
   * Calculate cost for generation
   * @param numImages - Number of images to generate
   * @returns Cost in dollars
   */
  calculateCost(numImages: number = 1): number {
    return 0.039 * numImages;
  }

  /**
   * Validate input parameters
   * @param input - The input to validate
   */
  private validateInput(input: Gemini25FlashImageInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required and cannot be empty");
    }

    if (input.prompt.length > 1000) {
      throw new Error("Prompt is too long. Maximum length is 1000 characters");
    }

    if (input.num_images !== undefined && input.num_images < 1) {
      throw new Error("Number of images must be at least 1");
    }

    if (input.output_format && !this.isValidOutputFormat(input.output_format)) {
      throw new Error(`Invalid output format: ${input.output_format}. Supported values: jpeg, png`);
    }
  }

  /**
   * Check if an output format is valid
   * @param outputFormat - The output format to validate
   * @returns Boolean indicating if the output format is valid
   */
  private isValidOutputFormat(outputFormat: string): outputFormat is Gemini25FlashImageInput["output_format"] {
    const validFormats: Gemini25FlashImageInput["output_format"][] = ["jpeg", "png"];
    return validFormats.includes(outputFormat as Gemini25FlashImageInput["output_format"]);
  }

  /**
   * Merge input with default values
   * @param input - The input parameters
   * @returns Merged parameters with defaults
   */
  private mergeWithDefaults(input: Gemini25FlashImageInput): Gemini25FlashImageInput {
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
  private handleError(error: any): Gemini25FlashImageError {
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
export const gemini25FlashImageUtils = {
  /**
   * Create a creative art prompt
   * @param subject - Subject of the artwork
   * @param style - Artistic style
   * @returns Formatted prompt
   */
  createCreativeArtPrompt(subject: string, style: string = "modern"): string {
    return `${style} artistic interpretation of ${subject}, creative composition, vibrant colors, high quality, detailed artwork`;
  },

  /**
   * Create a commercial photography prompt
   * @param product - Product or subject
   * @param setting - Photography setting
   * @returns Formatted prompt
   */
  createCommercialPhotoPrompt(product: string, setting: string = "professional"): string {
    return `${setting} commercial photography of ${product}, high resolution, professional lighting, clean background, product showcase`;
  },

  /**
   * Create a lifestyle photography prompt
   * @param activity - Activity or lifestyle scene
   * @param mood - Desired mood
   * @returns Formatted prompt
   */
  createLifestylePrompt(activity: string, mood: string = "natural"): string {
    return `${mood} lifestyle photography of ${activity}, candid moment, natural lighting, authentic atmosphere, high quality`;
  },

  /**
   * Create a digital art prompt
   * @param concept - Art concept
   * @param technique - Digital art technique
   * @returns Formatted prompt
   */
  createDigitalArtPrompt(concept: string, technique: string = "digital painting"): string {
    return `${technique} of ${concept}, digital art style, vibrant colors, detailed textures, high resolution artwork`;
  },

  /**
   * Get recommended output format for use case
   * @param useCase - The intended use case
   * @returns Recommended output format
   */
  getRecommendedOutputFormat(useCase: string): Gemini25FlashImageInput["output_format"] {
    const recommendations: Record<string, Gemini25FlashImageInput["output_format"]> = {
      "photography": "jpeg",
      "web": "jpeg",
      "social_media": "jpeg",
      "graphics": "png",
      "transparent": "png",
      "logos": "png",
      "illustrations": "png",
      "artwork": "png"
    };

    return recommendations[useCase.toLowerCase()] || "jpeg";
  },

  /**
   * Estimate cost for generation
   * @param numImages - Number of images to generate
   * @returns Estimated cost
   */
  estimateCost(numImages: number): number {
    return 0.039 * numImages;
  },

  /**
   * Calculate images per dollar
   * @param budget - Budget in dollars
   * @returns Number of images that can be generated
   */
  calculateImagesPerDollar(budget: number): number {
    return Math.floor(budget / 0.039);
  },

  /**
   * Create a nature photography prompt
   * @param subject - Nature subject
   * @param timeOfDay - Time of day
   * @returns Formatted prompt
   */
  createNaturePhotoPrompt(subject: string, timeOfDay: string = "golden hour"): string {
    return `${timeOfDay} nature photography of ${subject}, natural lighting, beautiful composition, high resolution, professional quality`;
  },

  /**
   * Create a portrait photography prompt
   * @param person - Person description
   * @param style - Portrait style
   * @returns Formatted prompt
   */
  createPortraitPrompt(person: string, style: string = "professional"): string {
    return `${style} portrait photography of ${person}, natural lighting, sharp focus, high quality, studio background`;
  },

  /**
   * Create a product photography prompt
   * @param product - Product name
   * @param style - Photography style
   * @returns Formatted prompt
   */
  createProductPhotoPrompt(product: string, style: string = "elegant"): string {
    return `${style} product photography of ${product}, clean background, professional lighting, high resolution, commercial quality`;
  }
};

// Export default executor instance
export default Gemini25FlashImageExecutor;
