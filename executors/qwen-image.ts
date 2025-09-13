import { fal } from "@fal-ai/client";

// Types for LoRA weights
export interface LoRAWeight {
  path: string;
  scale?: number;
}

// Types for the Qwen-Image model
export interface QwenImageInput {
  prompt: string;
  image_size?: "square_hd" | "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9" | { width: number; height: number };
  num_inference_steps?: number;
  seed?: number;
  guidance_scale?: number;
  sync_mode?: boolean;
  num_images?: number;
  enable_safety_checker?: boolean;
  output_format?: "jpeg" | "png";
  negative_prompt?: string;
  acceleration?: "none" | "regular" | "high";
  loras?: LoRAWeight[];
}

export interface QwenImageOutput {
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

export interface QwenImageError {
  error: string;
  message: string;
  code?: string;
}

// Model configuration
const MODEL_ENDPOINT = "fal-ai/qwen-image";

// Default configuration
const DEFAULT_CONFIG = {
  image_size: "landscape_4_3" as const,
  num_inference_steps: 30,
  guidance_scale: 2.5,
  num_images: 1,
  enable_safety_checker: true,
  output_format: "png" as const,
  negative_prompt: " ",
  acceleration: "none" as const,
  loras: [],
};

/**
 * Qwen-Image Generation Executor
 * 
 * This executor provides a comprehensive interface for generating images using the Qwen-Image model
 * through the fal.ai API. It's optimized for complex text rendering and precise image editing,
 * with support for parallel CFG and LoRA weights.
 */
export class QwenImageExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    
    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Generate images using the Qwen-Image model
   * @param input - The input parameters for image generation
   * @returns Promise<QwenImageOutput> - The generated images and metadata
   */
  async generateImages(input: QwenImageInput): Promise<QwenImageOutput> {
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
   * Generate images asynchronously using queue system
   * @param input - The input parameters for image generation
   * @param webhookUrl - Optional webhook URL for notifications
   * @returns Promise<{requestId: string}> - The request ID for tracking
   */
  async queueImageGeneration(
    input: QwenImageInput,
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
   * @returns Promise<QwenImageOutput> - The generated images and metadata
   */
  async getQueueResult(requestId: string): Promise<QwenImageOutput> {
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
   * @returns Promise<QwenImageOutput[]> - Array of results for each prompt
   */
  async generateMultipleImages(
    prompts: string[],
    imageSize?: QwenImageInput["image_size"]
  ): Promise<QwenImageOutput[]> {
    const results: QwenImageOutput[] = [];

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
          error: (error as QwenImageError).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate images with different image sizes
   * @param input - Base input parameters
   * @param imageSizes - Array of image sizes to generate
   * @returns Promise<QwenImageOutput[]> - Array of results for each size
   */
  async generateWithImageSizes(
    input: Omit<QwenImageInput, "image_size">,
    imageSizes: QwenImageInput["image_size"][]
  ): Promise<QwenImageOutput[]> {
    const results: QwenImageOutput[] = [];

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
          error: (error as QwenImageError).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate images with high acceleration for speed
   * @param input - The input parameters for image generation
   * @returns Promise<QwenImageOutput> - The generated images with high acceleration
   */
  async generateWithHighAcceleration(input: QwenImageInput): Promise<QwenImageOutput> {
    return this.generateImages({
      ...input,
      acceleration: "high",
    });
  }

  /**
   * Generate images with regular acceleration for balanced performance
   * @param input - The input parameters for image generation
   * @returns Promise<QwenImageOutput> - The generated images with regular acceleration
   */
  async generateWithRegularAcceleration(input: QwenImageInput): Promise<QwenImageOutput> {
    return this.generateImages({
      ...input,
      acceleration: "regular",
    });
  }

  /**
   * Generate images with no acceleration for maximum quality
   * @param input - The input parameters for image generation
   * @returns Promise<QwenImageOutput> - The generated images with no acceleration
   */
  async generateWithNoAcceleration(input: QwenImageInput): Promise<QwenImageOutput> {
    return this.generateImages({
      ...input,
      acceleration: "none",
    });
  }

  /**
   * Generate images with specific LoRA weights
   * @param input - The input parameters for image generation
   * @param loras - Array of LoRA weights to apply
   * @returns Promise<QwenImageOutput> - The generated images with LoRA styles
   */
  async generateWithLoRA(input: QwenImageInput, loras: LoRAWeight[]): Promise<QwenImageOutput> {
    return this.generateImages({
      ...input,
      loras,
    });
  }

  /**
   * Generate images with a single LoRA weight
   * @param input - The input parameters for image generation
   * @param lora - Single LoRA weight to apply
   * @returns Promise<QwenImageOutput> - The generated images with LoRA style
   */
  async generateWithSingleLoRA(input: QwenImageInput, lora: LoRAWeight): Promise<QwenImageOutput> {
    return this.generateImages({
      ...input,
      loras: [lora],
    });
  }

  /**
   * Generate images optimized for text rendering
   * @param input - The input parameters for image generation
   * @returns Promise<QwenImageOutput> - The generated images optimized for text
   */
  async generateTextOptimized(input: QwenImageInput): Promise<QwenImageOutput> {
    return this.generateImages({
      ...input,
      acceleration: "none",
      guidance_scale: 3.0,
      num_inference_steps: 40,
    });
  }

  /**
   * Get model information and capabilities
   * @returns Object with model information
   */
  getModelInfo() {
    return {
      name: "Qwen-Image",
      version: "latest",
      provider: "fal-ai",
      endpoint: MODEL_ENDPOINT,
      supportedImageSizes: ["square_hd", "square", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"],
      supportedAspectRatios: ["1:1", "4:3", "16:9", "3:4", "9:16"],
      pricing: {
        standard: 0.02,
        unit: "per megapixel",
      },
      features: [
        "Advanced complex text rendering capabilities",
        "Precise image editing and manipulation",
        "Parallel CFG support for enhanced control",
        "Comprehensive LoRA integration for style customization",
        "Flexible image size options with custom dimensions",
        "Multiple acceleration levels for speed/quality optimization",
        "Robust safety checking mechanisms",
        "High-quality output with multiple format options",
        "Cost-effective pricing at $0.02 per megapixel",
        "Excellent prompt adherence and interpretation"
      ],
    };
  }

  /**
   * Calculate cost for generation
   * @param width - Image width in pixels
   * @param height - Image height in pixels
   * @param numImages - Number of images to generate
   * @returns Cost in dollars
   */
  calculateCost(width: number, height: number, numImages: number = 1): number {
    const megapixels = (width * height) / 1000000;
    return 0.02 * megapixels * numImages;
  }

  /**
   * Calculate cost for standard image sizes
   * @param imageSize - Standard image size
   * @param numImages - Number of images to generate
   * @returns Cost in dollars
   */
  calculateCostForSize(imageSize: string, numImages: number = 1): number {
    const sizeMap: Record<string, { width: number; height: number }> = {
      "square_hd": { width: 1024, height: 1024 },
      "square": { width: 512, height: 512 },
      "portrait_4_3": { width: 768, height: 1024 },
      "portrait_16_9": { width: 576, height: 1024 },
      "landscape_4_3": { width: 1024, height: 768 },
      "landscape_16_9": { width: 1024, height: 576 },
    };

    const size = sizeMap[imageSize];
    if (!size) {
      throw new Error(`Unknown image size: ${imageSize}`);
    }

    return this.calculateCost(size.width, size.height, numImages);
  }

  /**
   * Validate input parameters
   * @param input - The input to validate
   */
  private validateInput(input: QwenImageInput): void {
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

    // Validate LoRA weights
    if (input.loras) {
      if (input.loras.length > 3) {
        throw new Error("Maximum of 3 LoRA weights can be used");
      }
      
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
  private isValidImageSize(imageSize: any): imageSize is QwenImageInput["image_size"] {
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
  private mergeWithDefaults(input: QwenImageInput): QwenImageInput {
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
  private handleError(error: any): QwenImageError {
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
export const qwenImageUtils = {
  /**
   * Create a LoRA weight configuration
   * @param path - Path or URL to the LoRA weights
   * @param scale - Scale factor for the LoRA (0-2)
   * @returns LoRA weight configuration
   */
  createLoRAWeight(path: string, scale: number = 1): LoRAWeight {
    return {
      path,
      scale,
    };
  },

  /**
   * Create a business card prompt
   * @param name - Person's name
   * @param title - Job title
   * @param company - Company name
   * @param style - Design style
   * @returns Formatted prompt
   */
  createBusinessCardPrompt(name: string, title: string, company: string, style: string = "professional"): string {
    return `A ${style} business card design with the text '${name}' in elegant typography, '${title}' in smaller text below, '${company}' in corporate font, clean white background, modern minimalist design, high quality, professional appearance`;
  },

  /**
   * Create a poster prompt
   * @param event - Event name
   * @param details - Event details
   * @param style - Design style
   * @returns Formatted prompt
   */
  createPosterPrompt(event: string, details: string, style: string = "modern"): string {
    return `A ${style} event poster design with the title '${event}' in bold typography, details '${details}' clearly readable, attractive layout, high quality, professional design, eye-catching colors`;
  },

  /**
   * Create a document prompt
   * @param documentType - Type of document
   * @param content - Document content
   * @param style - Document style
   * @returns Formatted prompt
   */
  createDocumentPrompt(documentType: string, content: string, style: string = "formal"): string {
    return `A ${style} ${documentType} document with the text '${content}' clearly formatted and readable, professional layout, high quality typography, clean design`;
  },

  /**
   * Create a sign prompt
   * @param text - Sign text
   * @param location - Sign location
   * @param style - Sign style
   * @returns Formatted prompt
   */
  createSignPrompt(text: string, location: string, style: string = "clear"): string {
    return `A ${style} sign at ${location} with the text '${text}' prominently displayed, readable typography, appropriate size, high quality, professional appearance`;
  },

  /**
   * Create a logo prompt
   * @param company - Company name
   * @param industry - Industry type
   * @param style - Logo style
   * @returns Formatted prompt
   */
  createLogoPrompt(company: string, industry: string, style: string = "modern"): string {
    return `A ${style} logo design for ${company} in the ${industry} industry, clean typography, scalable design, professional appearance, high quality, minimalist approach`;
  },

  /**
   * Create a certificate prompt
   * @param recipient - Certificate recipient
   * @param achievement - Achievement or award
   * @param organization - Issuing organization
   * @returns Formatted prompt
   */
  createCertificatePrompt(recipient: string, achievement: string, organization: string): string {
    return `A formal certificate design with 'Certificate of ${achievement}' as the title, 'This is to certify that ${recipient}' in elegant script, '${organization}' as the issuing authority, ornate border, professional typography, high quality`;
  },

  /**
   * Get recommended image size for use case
   * @param useCase - The intended use case
   * @returns Recommended image size
   */
  getRecommendedImageSize(useCase: string): QwenImageInput["image_size"] {
    const recommendations: Record<string, QwenImageInput["image_size"]> = {
      "business_card": "landscape_4_3",
      "poster": "portrait_16_9",
      "document": "portrait_4_3",
      "sign": "landscape_16_9",
      "logo": "square_hd",
      "certificate": "landscape_4_3",
      "text_heavy": "landscape_4_3",
      "social_media": "square_hd",
      "presentation": "landscape_16_9",
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
      "business_card": "4:3",
      "poster": "9:16",
      "document": "3:4",
      "sign": "16:9",
      "logo": "1:1",
      "certificate": "4:3",
      "text_heavy": "4:3",
      "social_media": "1:1",
      "presentation": "16:9",
      "print": "3:4"
    };

    return recommendations[useCase.toLowerCase()] || "4:3";
  },

  /**
   * Estimate cost for generation
   * @param width - Image width in pixels
   * @param height - Image height in pixels
   * @param numImages - Number of images to generate
   * @returns Estimated cost
   */
  estimateCost(width: number, height: number, numImages: number = 1): number {
    const megapixels = (width * height) / 1000000;
    return 0.02 * megapixels * numImages;
  },

  /**
   * Calculate images per dollar for a given resolution
   * @param width - Image width in pixels
   * @param height - Image height in pixels
   * @param budget - Budget in dollars
   * @returns Number of images that can be generated
   */
  calculateImagesPerDollar(width: number, height: number, budget: number): number {
    const costPerImage = this.estimateCost(width, height, 1);
    return Math.floor(budget / costPerImage);
  },

  /**
   * Get recommended acceleration level for content type
   * @param contentType - Type of content being generated
   * @returns Recommended acceleration level
   */
  getRecommendedAcceleration(contentType: string): "none" | "regular" | "high" {
    const recommendations: Record<string, "none" | "regular" | "high"> = {
      "text_heavy": "none",
      "complex_text": "none",
      "simple_image": "high",
      "landscape": "regular",
      "portrait": "regular",
      "logo": "high",
      "abstract": "high",
      "detailed": "none"
    };

    return recommendations[contentType.toLowerCase()] || "regular";
  }
};

// Export default executor instance
export default QwenImageExecutor;
