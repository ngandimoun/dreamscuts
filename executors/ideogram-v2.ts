import { fal } from "@fal-ai/client";

// Types for the Ideogram V2 model
export interface IdeogramV2Input {
  prompt: string;
  aspect_ratio?: "10:16" | "16:10" | "9:16" | "16:9" | "4:3" | "3:4" | "1:1" | "1:3" | "3:1" | "3:2" | "2:3";
  expand_prompt?: boolean;
  seed?: number;
  style?: "auto" | "general" | "realistic" | "design" | "render_3D" | "anime";
  sync_mode?: boolean;
  negative_prompt?: string;
}

export interface IdeogramV2Output {
  images: Array<{
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  }>;
  seed?: number;
  requestId?: string;
}

export interface IdeogramV2Error {
  error: string;
  message: string;
  code?: string;
}

// Model configuration
const MODEL_ENDPOINT = "fal-ai/ideogram/v2";

// Default configuration
const DEFAULT_CONFIG = {
  aspect_ratio: "1:1" as const,
  expand_prompt: true,
  style: "auto" as const,
  negative_prompt: "",
};

/**
 * Ideogram V2 Image Generation Executor
 * 
 * This executor provides a comprehensive interface for generating images using Ideogram V2 model
 * through the fal.ai API. It's optimized for typography, logos, posters, and commercial use cases.
 */
export class IdeogramV2Executor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    
    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Generate images using the Ideogram V2 model
   * @param input - The input parameters for image generation
   * @returns Promise<IdeogramV2Output> - The generated images and metadata
   */
  async generateImages(input: IdeogramV2Input): Promise<IdeogramV2Output> {
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
    input: IdeogramV2Input,
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
   * @returns Promise<IdeogramV2Output> - The generated images and metadata
   */
  async getQueueResult(requestId: string): Promise<IdeogramV2Output> {
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
   * @returns Promise<IdeogramV2Output[]> - Array of results for each prompt
   */
  async generateMultipleImages(
    prompts: string[],
    aspectRatio?: IdeogramV2Input["aspect_ratio"]
  ): Promise<IdeogramV2Output[]> {
    const results: IdeogramV2Output[] = [];

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
          error: (error as IdeogramV2Error).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate images with different aspect ratios
   * @param input - Base input parameters
   * @param aspectRatios - Array of aspect ratios to generate
   * @returns Promise<IdeogramV2Output[]> - Array of results for each aspect ratio
   */
  async generateWithAspectRatios(
    input: Omit<IdeogramV2Input, "aspect_ratio">,
    aspectRatios: IdeogramV2Input["aspect_ratio"][]
  ): Promise<IdeogramV2Output[]> {
    const results: IdeogramV2Output[] = [];

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
          error: (error as IdeogramV2Error).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate images with different styles
   * @param input - Base input parameters
   * @param styles - Array of styles to generate
   * @returns Promise<IdeogramV2Output[]> - Array of results for each style
   */
  async generateWithStyles(
    input: Omit<IdeogramV2Input, "style">,
    styles: IdeogramV2Input["style"][]
  ): Promise<IdeogramV2Output[]> {
    const results: IdeogramV2Output[] = [];

    for (const style of styles) {
      try {
        const result = await this.generateImages({
          ...input,
          style,
        });
        results.push(result);
      } catch (error) {
        console.error(
          `Failed to generate image with style: ${style}`,
          error
        );
        results.push({
          images: [],
          error: (error as IdeogramV2Error).message,
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
      name: "Ideogram",
      version: "v2",
      provider: "fal-ai",
      endpoint: MODEL_ENDPOINT,
      supportedAspectRatios: ["10:16", "16:10", "9:16", "16:9", "4:3", "3:4", "1:1", "1:3", "3:1", "3:2", "2:3"],
      supportedStyles: ["auto", "general", "realistic", "design", "render_3D", "anime"],
      pricing: {
        standard: 0.08,
      },
      features: [
        "Exceptional typography handling",
        "High-quality realistic outputs",
        "Advanced text rendering capabilities",
        "Professional commercial aesthetics",
        "MagicPrompt enhancement functionality",
        "Versatile style options"
      ],
    };
  }

  /**
   * Calculate cost for generation
   * @param numImages - Number of images to generate
   * @returns Cost in dollars
   */
  calculateCost(numImages: number = 1): number {
    return 0.08 * numImages;
  }

  /**
   * Validate input parameters
   * @param input - The input to validate
   */
  private validateInput(input: IdeogramV2Input): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required and cannot be empty");
    }

    if (input.prompt.length > 1000) {
      throw new Error("Prompt is too long. Maximum length is 1000 characters");
    }

    if (input.aspect_ratio && !this.isValidAspectRatio(input.aspect_ratio)) {
      throw new Error(`Invalid aspect ratio: ${input.aspect_ratio}. Supported values: 10:16, 16:10, 9:16, 16:9, 4:3, 3:4, 1:1, 1:3, 3:1, 3:2, 2:3`);
    }

    if (input.style && !this.isValidStyle(input.style)) {
      throw new Error(`Invalid style: ${input.style}. Supported values: auto, general, realistic, design, render_3D, anime`);
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
  private isValidAspectRatio(aspectRatio: string): aspectRatio is IdeogramV2Input["aspect_ratio"] {
    const validRatios: IdeogramV2Input["aspect_ratio"][] = ["10:16", "16:10", "9:16", "16:9", "4:3", "3:4", "1:1", "1:3", "3:1", "3:2", "2:3"];
    return validRatios.includes(aspectRatio as IdeogramV2Input["aspect_ratio"]);
  }

  /**
   * Check if a style is valid
   * @param style - The style to validate
   * @returns Boolean indicating if the style is valid
   */
  private isValidStyle(style: string): style is IdeogramV2Input["style"] {
    const validStyles: IdeogramV2Input["style"][] = ["auto", "general", "realistic", "design", "render_3D", "anime"];
    return validStyles.includes(style as IdeogramV2Input["style"]);
  }

  /**
   * Merge input with default values
   * @param input - The input parameters
   * @returns Merged parameters with defaults
   */
  private mergeWithDefaults(input: IdeogramV2Input): IdeogramV2Input {
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
  private handleError(error: any): IdeogramV2Error {
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
export const ideogramV2Utils = {
  /**
   * Create a logo design prompt
   * @param companyName - Name of the company
   * @param industry - Industry or sector
   * @returns Formatted prompt
   */
  createLogoPrompt(companyName: string, industry: string = "modern"): string {
    return `${industry} logo design for ${companyName}, clean typography, professional, scalable, minimalist design`;
  },

  /**
   * Create a poster design prompt
   * @param event - Event or theme
   * @param style - Design style
   * @returns Formatted prompt
   */
  createPosterPrompt(event: string, style: string = "modern"): string {
    return `${style} poster design for ${event}, bold typography, eye-catching layout, professional design`;
  },

  /**
   * Create a business card prompt
   * @param companyName - Company name
   * @param design - Design style
   * @returns Formatted prompt
   */
  createBusinessCardPrompt(companyName: string, design: string = "professional"): string {
    return `${design} business card design for ${companyName}, clean layout, professional typography, modern design`;
  },

  /**
   * Create a typography-focused prompt
   * @param text - Text to display
   * @param style - Typography style
   * @returns Formatted prompt
   */
  createTypographyPrompt(text: string, style: string = "bold"): string {
    return `${style} typography design with text "${text}", clean layout, professional lettering, modern design`;
  },

  /**
   * Get recommended aspect ratio for use case
   * @param useCase - The intended use case
   * @returns Recommended aspect ratio
   */
  getRecommendedAspectRatio(useCase: string): IdeogramV2Input["aspect_ratio"] {
    const recommendations: Record<string, IdeogramV2Input["aspect_ratio"]> = {
      "logo": "1:1",
      "business_card": "3:2",
      "poster": "16:9",
      "banner": "16:9",
      "social_media": "1:1",
      "instagram": "1:1",
      "facebook": "1:1",
      "twitter": "16:9",
      "linkedin": "1:1",
      "youtube": "16:9",
      "pinterest": "9:16",
      "tiktok": "9:16",
      "flyer": "3:2",
      "brochure": "3:2",
      "billboard": "16:9",
      "magazine": "3:4",
      "book_cover": "3:4",
      "web_banner": "16:9",
      "mobile_banner": "9:16"
    };

    return recommendations[useCase.toLowerCase()] || "1:1";
  },

  /**
   * Get recommended style for use case
   * @param useCase - The intended use case
   * @returns Recommended style
   */
  getRecommendedStyle(useCase: string): IdeogramV2Input["style"] {
    const recommendations: Record<string, IdeogramV2Input["style"]> = {
      "logo": "design",
      "business_card": "realistic",
      "poster": "design",
      "typography": "design",
      "commercial": "realistic",
      "marketing": "design",
      "artistic": "general",
      "photorealistic": "realistic",
      "3d": "render_3D",
      "anime": "anime",
      "auto": "auto"
    };

    return recommendations[useCase.toLowerCase()] || "auto";
  },

  /**
   * Create negative prompt for common issues
   * @param issues - Array of issues to avoid
   * @returns Formatted negative prompt
   */
  createNegativePrompt(issues: string[] = []): string {
    const defaultIssues = ["blurry", "low quality", "watermark", "text errors", "typo"];
    const allIssues = [...defaultIssues, ...issues];
    return allIssues.join(", ");
  },

  /**
   * Estimate cost for generation
   * @param numImages - Number of images to generate
   * @returns Estimated cost
   */
  estimateCost(numImages: number): number {
    return 0.08 * numImages;
  },

  /**
   * Generate random seed
   * @returns Random seed number
   */
  generateRandomSeed(): number {
    return Math.floor(Math.random() * 2147483647);
  },

  /**
   * Create a commercial design prompt
   * @param product - Product or service
   * @param target - Target audience
   * @returns Formatted prompt
   */
  createCommercialPrompt(product: string, target: string = "professional"): string {
    return `${target} commercial design for ${product}, professional typography, clean layout, modern aesthetics`;
  },

  /**
   * Create a marketing material prompt
   * @param campaign - Campaign theme
   * @param medium - Marketing medium
   * @returns Formatted prompt
   */
  createMarketingPrompt(campaign: string, medium: string = "digital"): string {
    return `${medium} marketing material for ${campaign}, compelling typography, professional design, modern layout`;
  }
};

// Export default executor instance
export default IdeogramV2Executor;
