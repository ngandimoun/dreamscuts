import { fal } from "@fal-ai/client";

// Types for the OmniGen V2 model
export interface OmniGenV2Input {
  prompt: string;
  input_image_urls?: string[];
  image_size?: "square_hd" | "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9" | { width: number; height: number };
  num_inference_steps?: number;
  seed?: number;
  text_guidance_scale?: number;
  image_guidance_scale?: number;
  negative_prompt?: string;
  cfg_range_start?: number;
  cfg_range_end?: number;
  scheduler?: "euler" | "dpmsolver";
  sync_mode?: boolean;
  num_images?: number;
  enable_safety_checker?: boolean;
  output_format?: "jpeg" | "png";
}

export interface OmniGenV2Output {
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

export interface OmniGenV2Error {
  error: string;
  message: string;
  code?: string;
}

// Model configuration
const MODEL_ENDPOINT = "fal-ai/omnigen-v2";

// Default configuration
const DEFAULT_CONFIG = {
  image_size: "square_hd" as const,
  num_inference_steps: 50,
  text_guidance_scale: 5,
  image_guidance_scale: 2,
  negative_prompt: "(((deformed))), blurry, over saturation, bad anatomy, disfigured, poorly drawn face, mutation, mutated, (extra_limb), (ugly), (poorly drawn hands), fused fingers, messy drawing, broken legs censor, censored, censor_bar",
  cfg_range_end: 1,
  scheduler: "euler" as const,
  num_images: 1,
  enable_safety_checker: true,
  output_format: "jpeg" as const,
};

/**
 * OmniGen V2 Generation Executor
 * 
 * This executor provides a comprehensive interface for generating images using the OmniGen V2 model
 * through the fal.ai API. It's a unified framework for text-to-image generation, image editing,
 * personalized generation, virtual try-on, and multi-person generation.
 */
export class OmniGenV2Executor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    
    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Generate images using the OmniGen V2 model
   * @param input - The input parameters for image generation
   * @returns Promise<OmniGenV2Output> - The generated images and metadata
   */
  async generateImages(input: OmniGenV2Input): Promise<OmniGenV2Output> {
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
    input: OmniGenV2Input,
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
   * @returns Promise<OmniGenV2Output> - The generated images and metadata
   */
  async getQueueResult(requestId: string): Promise<OmniGenV2Output> {
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
   * @returns Promise<OmniGenV2Output[]> - Array of results for each prompt
   */
  async generateMultipleImages(
    prompts: string[],
    imageSize?: OmniGenV2Input["image_size"]
  ): Promise<OmniGenV2Output[]> {
    const results: OmniGenV2Output[] = [];

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
          error: (error as OmniGenV2Error).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate images with different image sizes
   * @param input - Base input parameters
   * @param imageSizes - Array of image sizes to generate
   * @returns Promise<OmniGenV2Output[]> - Array of results for each size
   */
  async generateWithImageSizes(
    input: Omit<OmniGenV2Input, "image_size">,
    imageSizes: OmniGenV2Input["image_size"][]
  ): Promise<OmniGenV2Output[]> {
    const results: OmniGenV2Output[] = [];

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
          error: (error as OmniGenV2Error).message,
        });
      }
    }

    return results;
  }

  /**
   * Edit an image with natural language instructions
   * @param prompt - The editing instruction
   * @param imageUrl - URL of the image to edit
   * @param options - Additional options for editing
   * @returns Promise<OmniGenV2Output> - The edited image
   */
  async editImage(
    prompt: string,
    imageUrl: string,
    options?: Partial<OmniGenV2Input>
  ): Promise<OmniGenV2Output> {
    return this.generateImages({
      prompt,
      input_image_urls: [imageUrl],
      image_guidance_scale: 1.5, // Optimal for image editing
      ...options,
    });
  }

  /**
   * Generate image using multiple reference images
   * @param prompt - The generation prompt
   * @param imageUrls - Array of reference image URLs (up to 3)
   * @param options - Additional options for generation
   * @returns Promise<OmniGenV2Output> - The generated image
   */
  async generateWithMultipleImages(
    prompt: string,
    imageUrls: string[],
    options?: Partial<OmniGenV2Input>
  ): Promise<OmniGenV2Output> {
    if (imageUrls.length > 3) {
      throw new Error("Maximum of 3 input images supported");
    }

    return this.generateImages({
      prompt,
      input_image_urls: imageUrls,
      image_guidance_scale: 2.5, // Optimal for multi-image generation
      ...options,
    });
  }

  /**
   * Generate personalized image using reference photo
   * @param prompt - The generation prompt
   * @param referenceImageUrl - URL of the reference photo
   * @param options - Additional options for generation
   * @returns Promise<OmniGenV2Output> - The personalized image
   */
  async generatePersonalizedImage(
    prompt: string,
    referenceImageUrl: string,
    options?: Partial<OmniGenV2Input>
  ): Promise<OmniGenV2Output> {
    return this.generateImages({
      prompt,
      input_image_urls: [referenceImageUrl],
      image_guidance_scale: 2.0, // Optimal for personalized generation
      ...options,
    });
  }

  /**
   * Generate high-quality image with optimized parameters
   * @param input - The input parameters for image generation
   * @returns Promise<OmniGenV2Output> - The high-quality generated image
   */
  async generateHighQuality(input: OmniGenV2Input): Promise<OmniGenV2Output> {
    return this.generateImages({
      ...input,
      num_inference_steps: 100,
      text_guidance_scale: 7.5,
      image_size: "square_hd",
    });
  }

  /**
   * Generate image optimized for speed
   * @param input - The input parameters for image generation
   * @returns Promise<OmniGenV2Output> - The speed-optimized generated image
   */
  async generateSpeedOptimized(input: OmniGenV2Input): Promise<OmniGenV2Output> {
    return this.generateImages({
      ...input,
      num_inference_steps: 30,
      text_guidance_scale: 3.0,
    });
  }

  /**
   * Upload a file and use it for generation
   * @param prompt - The generation prompt
   * @param file - The file to upload
   * @param options - Additional options for generation
   * @returns Promise<OmniGenV2Output> - The generated image
   */
  async generateWithUploadedFile(
    prompt: string,
    file: File,
    options?: Partial<OmniGenV2Input>
  ): Promise<OmniGenV2Output> {
    // Upload the file
    const url = await fal.storage.upload(file);

    // Generate with the uploaded file
    return this.generateImages({
      prompt,
      input_image_urls: [url],
      ...options,
    });
  }

  /**
   * Get model information and capabilities
   * @returns Object with model information
   */
  getModelInfo() {
    return {
      name: "OmniGen V2",
      version: "v2",
      provider: "fal-ai",
      endpoint: MODEL_ENDPOINT,
      supportedImageSizes: ["square_hd", "square", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"],
      supportedAspectRatios: ["1:1", "4:3", "16:9", "3:4", "9:16"],
      pricing: {
        standard: 0.15,
        unit: "per megapixel",
      },
      features: [
        "Unified framework for text-to-image, image editing, and personalized generation",
        "No need for additional modules like ControlNet or IP-Adapter",
        "Supports multi-modal prompts with text and image inputs",
        "Advanced image editing with natural language instructions",
        "Personalized image generation using reference images",
        "Virtual try-on capabilities",
        "Multi-person generation support",
        "Subject-driven generation",
        "Simple REST API with comprehensive SDKs",
        "Support for up to 3 input images",
        "Fast inference times with various output resolutions",
        "Automatic safety checking and content filtering"
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
    return 0.15 * megapixels * numImages;
  }

  /**
   * Calculate cost for a specific image size
   * @param imageSize - The image size to calculate cost for
   * @param numImages - Number of images to generate
   * @returns Cost in dollars
   */
  calculateCostForSize(imageSize: OmniGenV2Input["image_size"], numImages: number = 1): number {
    let width = 1024;
    let height = 1024;

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
  private validateInput(input: OmniGenV2Input): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required and cannot be empty");
    }

    if (input.prompt.length > 1000) {
      throw new Error("Prompt is too long. Maximum length is 1000 characters");
    }

    if (input.input_image_urls && input.input_image_urls.length > 3) {
      throw new Error("Maximum of 3 input images supported");
    }

    if (input.num_inference_steps !== undefined && input.num_inference_steps < 1) {
      throw new Error("Number of inference steps must be at least 1");
    }

    if (input.text_guidance_scale !== undefined && (input.text_guidance_scale < 1 || input.text_guidance_scale > 20)) {
      throw new Error("Text guidance scale must be between 1 and 20");
    }

    if (input.image_guidance_scale !== undefined && (input.image_guidance_scale < 1 || input.image_guidance_scale > 10)) {
      throw new Error("Image guidance scale must be between 1 and 10");
    }

    if (input.num_images !== undefined && (input.num_images < 1 || input.num_images > 4)) {
      throw new Error("Number of images must be between 1 and 4");
    }

    if (input.scheduler !== undefined && !["euler", "dpmsolver"].includes(input.scheduler)) {
      throw new Error("Scheduler must be 'euler' or 'dpmsolver'");
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
  private isValidImageSize(imageSize: any): imageSize is OmniGenV2Input["image_size"] {
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
  private mergeWithDefaults(input: OmniGenV2Input): OmniGenV2Input {
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
  private handleError(error: any): OmniGenV2Error {
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
export const omniGenV2Utils = {
  /**
   * Create an image editing prompt
   * @param instruction - The editing instruction
   * @param target - The target element to edit
   * @param style - The desired style or change
   * @returns Formatted prompt
   */
  createImageEditingPrompt(instruction: string, target: string = "the image", style: string = ""): string {
    return `${instruction} ${target}${style ? `, ${style}` : ""}`;
  },

  /**
   * Create a multi-image generation prompt
   * @param action - The action to perform
   * @param sourceElement - Element from source image
   * @param targetLocation - Target location in destination image
   * @returns Formatted prompt
   */
  createMultiImagePrompt(action: string, sourceElement: string, targetLocation: string): string {
    return `${action} the ${sourceElement} from image 1 to ${targetLocation} in image 2`;
  },

  /**
   * Create a personalized generation prompt
   * @param subject - The subject description
   * @param style - The desired style
   * @param context - The context or setting
   * @returns Formatted prompt
   */
  createPersonalizedPrompt(subject: string, style: string = "photorealistic", context: string = "professional setting"): string {
    return `A ${style} image of ${subject} in a ${context}, high-quality, detailed, professional appearance`;
  },

  /**
   * Create a virtual try-on prompt
   * @param item - The item to try on
   * @param person - The person description
   * @param style - The desired style
   * @returns Formatted prompt
   */
  createVirtualTryOnPrompt(item: string, person: string = "person", style: string = "natural"): string {
    return `${person} wearing ${item}, ${style} fit, realistic appearance, high-quality photography`;
  },

  /**
   * Create a multi-person generation prompt
   * @param people - Array of person descriptions
   * @param activity - The activity they're doing
   * @param setting - The setting or location
   * @returns Formatted prompt
   */
  createMultiPersonPrompt(people: string[], activity: string, setting: string): string {
    const peopleList = people.join(", ");
    return `${peopleList} ${activity} in ${setting}, natural interaction, high-quality, detailed`;
  },

  /**
   * Create a subject-driven generation prompt
   * @param subject - The main subject
   * @param style - The artistic style
   * @param mood - The mood or atmosphere
   * @returns Formatted prompt
   */
  createSubjectDrivenPrompt(subject: string, style: string = "artistic", mood: string = "elegant"): string {
    return `A ${style} representation of ${subject}, ${mood} mood, high-quality rendering, professional composition`;
  },

  /**
   * Get recommended image size for use case
   * @param useCase - The intended use case
   * @returns Recommended image size
   */
  getRecommendedImageSize(useCase: string): OmniGenV2Input["image_size"] {
    const recommendations: Record<string, OmniGenV2Input["image_size"]> = {
      "image_editing": "square_hd",
      "personalized_generation": "portrait_4_3",
      "virtual_try_on": "portrait_16_9",
      "multi_person": "landscape_4_3",
      "subject_driven": "square_hd",
      "creative_applications": "square_hd",
      "marketing_assets": "landscape_16_9",
      "ai_art": "square_hd",
      "product_visualization": "square_hd",
      "content_creation": "landscape_4_3"
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
      "image_editing": "1:1",
      "personalized_generation": "3:4",
      "virtual_try_on": "9:16",
      "multi_person": "4:3",
      "subject_driven": "1:1",
      "creative_applications": "1:1",
      "marketing_assets": "16:9",
      "ai_art": "1:1",
      "product_visualization": "1:1",
      "content_creation": "4:3"
    };

    return recommendations[useCase.toLowerCase()] || "1:1";
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
    return 0.15 * megapixels * numImages;
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
   * Get recommended guidance scales for different tasks
   * @param task - The task type
   * @returns Recommended guidance scale configuration
   */
  getRecommendedGuidanceScales(task: string): { text_guidance_scale: number; image_guidance_scale: number } {
    const recommendations: Record<string, { text_guidance_scale: number; image_guidance_scale: number }> = {
      "image_editing": { text_guidance_scale: 5, image_guidance_scale: 1.5 },
      "personalized_generation": { text_guidance_scale: 6, image_guidance_scale: 2.0 },
      "virtual_try_on": { text_guidance_scale: 5, image_guidance_scale: 2.5 },
      "multi_person": { text_guidance_scale: 7, image_guidance_scale: 2.0 },
      "subject_driven": { text_guidance_scale: 6, image_guidance_scale: 2.0 },
      "creative_applications": { text_guidance_scale: 5, image_guidance_scale: 1.8 },
      "marketing_assets": { text_guidance_scale: 6, image_guidance_scale: 2.2 },
      "ai_art": { text_guidance_scale: 7, image_guidance_scale: 2.0 },
      "product_visualization": { text_guidance_scale: 5, image_guidance_scale: 2.0 },
      "content_creation": { text_guidance_scale: 5, image_guidance_scale: 2.0 }
    };

    return recommendations[task.toLowerCase()] || { text_guidance_scale: 5, image_guidance_scale: 2 };
  }
};

// Export default executor instance
export default OmniGenV2Executor;
