import { fal } from "@fal-ai/client";

// Types for the DreamO model
export interface DreamOInput {
  prompt: string;
  first_image_url?: string;
  second_image_url?: string;
  first_reference_task?: "ip" | "id" | "style";
  second_reference_task?: "ip" | "id" | "style";
  image_size?: "square_hd" | "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9" | { width: number; height: number };
  num_inference_steps?: number;
  seed?: number;
  guidance_scale?: number;
  negative_prompt?: string;
  sync_mode?: boolean;
  ref_resolution?: number;
  true_cfg?: number;
  enable_safety_checker?: boolean;
}

export interface DreamOOutput {
  images: Array<{
    url: string;
    content_type: string;
    file_name?: string;
    file_size?: number;
    file_data?: string;
    width: number;
    height: number;
  }>;
  timings?: any;
  seed?: number;
  has_nsfw_concepts?: boolean[];
  prompt?: string;
  requestId?: string;
}

export interface DreamOError {
  error: string;
  message: string;
  code?: string;
}

// Model configuration
const MODEL_ENDPOINT = "fal-ai/dreamo";

// Default configuration
const DEFAULT_CONFIG = {
  first_reference_task: "ip" as const,
  second_reference_task: "ip" as const,
  image_size: "square_hd" as const,
  num_inference_steps: 12,
  guidance_scale: 3.5,
  negative_prompt: "",
  ref_resolution: 512,
  true_cfg: 1,
  enable_safety_checker: true,
};

/**
 * DreamO Generation Executor
 * 
 * This executor provides a comprehensive interface for image customization using the DreamO model
 * through the fal.ai API. It's an advanced image customization framework that supports multiple
 * reference images and tasks, enabling sophisticated image generation with precise control.
 */
export class DreamOExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    
    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Generate images using the DreamO model
   * @param input - The input parameters for image generation
   * @returns Promise<DreamOOutput> - The generated images and metadata
   */
  async generateImages(input: DreamOInput): Promise<DreamOOutput> {
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
    input: DreamOInput,
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
   * @returns Promise<DreamOOutput> - The generated images and metadata
   */
  async getQueueResult(requestId: string): Promise<DreamOOutput> {
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
   * Generate images with identity preservation (IP) reference
   * @param prompt - The generation prompt
   * @param referenceImageUrl - URL of the reference image for identity preservation
   * @param options - Additional options for generation
   * @returns Promise<DreamOOutput> - The generated images
   */
  async generateWithIdentityPreservation(
    prompt: string,
    referenceImageUrl: string,
    options?: Partial<DreamOInput>
  ): Promise<DreamOOutput> {
    return this.generateImages({
      prompt,
      first_image_url: referenceImageUrl,
      first_reference_task: "ip",
      ...options,
    });
  }

  /**
   * Generate images with style reference
   * @param prompt - The generation prompt
   * @param styleImageUrl - URL of the style reference image
   * @param options - Additional options for generation
   * @returns Promise<DreamOOutput> - The generated images
   */
  async generateWithStyleReference(
    prompt: string,
    styleImageUrl: string,
    options?: Partial<DreamOInput>
  ): Promise<DreamOOutput> {
    return this.generateImages({
      prompt,
      first_image_url: styleImageUrl,
      first_reference_task: "style",
      ...options,
    });
  }

  /**
   * Generate images with dual reference (identity + style)
   * @param prompt - The generation prompt
   * @param identityImageUrl - URL of the identity reference image
   * @param styleImageUrl - URL of the style reference image
   * @param options - Additional options for generation
   * @returns Promise<DreamOOutput> - The generated images
   */
  async generateWithDualReference(
    prompt: string,
    identityImageUrl: string,
    styleImageUrl: string,
    options?: Partial<DreamOInput>
  ): Promise<DreamOOutput> {
    return this.generateImages({
      prompt,
      first_image_url: identityImageUrl,
      first_reference_task: "ip",
      second_image_url: styleImageUrl,
      second_reference_task: "style",
      ...options,
    });
  }

  /**
   * Generate images with multiple identity references
   * @param prompt - The generation prompt
   * @param identityImageUrls - Array of identity reference image URLs
   * @param options - Additional options for generation
   * @returns Promise<DreamOOutput> - The generated images
   */
  async generateWithMultipleIdentities(
    prompt: string,
    identityImageUrls: string[],
    options?: Partial<DreamOInput>
  ): Promise<DreamOOutput> {
    if (identityImageUrls.length === 0) {
      throw new Error("At least one identity reference image is required");
    }

    const input: DreamOInput = {
      prompt,
      first_image_url: identityImageUrls[0],
      first_reference_task: "ip",
      ...options,
    };

    if (identityImageUrls.length > 1) {
      input.second_image_url = identityImageUrls[1];
      input.second_reference_task = "ip";
    }

    return this.generateImages(input);
  }

  /**
   * Generate images with multiple style references
   * @param prompt - The generation prompt
   * @param styleImageUrls - Array of style reference image URLs
   * @param options - Additional options for generation
   * @returns Promise<DreamOOutput> - The generated images
   */
  async generateWithMultipleStyles(
    prompt: string,
    styleImageUrls: string[],
    options?: Partial<DreamOInput>
  ): Promise<DreamOOutput> {
    if (styleImageUrls.length === 0) {
      throw new Error("At least one style reference image is required");
    }

    const input: DreamOInput = {
      prompt,
      first_image_url: styleImageUrls[0],
      first_reference_task: "style",
      ...options,
    };

    if (styleImageUrls.length > 1) {
      input.second_image_url = styleImageUrls[1];
      input.second_reference_task = "style";
    }

    return this.generateImages(input);
  }

  /**
   * Generate images with high-quality settings
   * @param input - The input parameters for image generation
   * @returns Promise<DreamOOutput> - The high-quality generated images
   */
  async generateHighQuality(input: DreamOInput): Promise<DreamOOutput> {
    return this.generateImages({
      ...input,
      num_inference_steps: 20,
      guidance_scale: 4.0,
      image_size: "square_hd",
    });
  }

  /**
   * Generate images with fast processing
   * @param input - The input parameters for image generation
   * @returns Promise<DreamOOutput> - The fast-generated images
   */
  async generateFast(input: DreamOInput): Promise<DreamOOutput> {
    return this.generateImages({
      ...input,
      num_inference_steps: 8,
      guidance_scale: 3.0,
      image_size: "square",
    });
  }

  /**
   * Generate images with custom reference tasks
   * @param prompt - The generation prompt
   * @param references - Array of reference configurations
   * @param options - Additional options for generation
   * @returns Promise<DreamOOutput> - The generated images
   */
  async generateWithCustomReferences(
    prompt: string,
    references: Array<{ url: string; task: "ip" | "id" | "style" }>,
    options?: Partial<DreamOInput>
  ): Promise<DreamOOutput> {
    if (references.length === 0) {
      throw new Error("At least one reference is required");
    }

    const input: DreamOInput = {
      prompt,
      first_image_url: references[0].url,
      first_reference_task: references[0].task,
      ...options,
    };

    if (references.length > 1) {
      input.second_image_url = references[1].url;
      input.second_reference_task = references[1].task;
    }

    return this.generateImages(input);
  }

  /**
   * Upload files and use them for generation
   * @param prompt - The generation prompt
   * @param files - Array of files to upload and use as references
   * @param tasks - Array of tasks for each file ("ip", "id", or "style")
   * @param options - Additional options for generation
   * @returns Promise<DreamOOutput> - The generated images
   */
  async generateWithUploadedFiles(
    prompt: string,
    files: File[],
    tasks: Array<"ip" | "id" | "style">,
    options?: Partial<DreamOInput>
  ): Promise<DreamOOutput> {
    if (files.length === 0) {
      throw new Error("At least one file is required");
    }

    if (files.length !== tasks.length) {
      throw new Error("Number of files must match number of tasks");
    }

    // Upload files
    const urls = await Promise.all(files.map(file => fal.storage.upload(file)));

    // Create references array
    const references = urls.map((url, index) => ({
      url,
      task: tasks[index],
    }));

    return this.generateWithCustomReferences(prompt, references, options);
  }

  /**
   * Generate multiple variations with different seeds
   * @param input - Base input parameters
   * @param seeds - Array of seeds to use for generation
   * @returns Promise<DreamOOutput[]> - Array of results for each seed
   */
  async generateMultipleVariations(
    input: Omit<DreamOInput, "seed">,
    seeds: number[]
  ): Promise<DreamOOutput[]> {
    const results: DreamOOutput[] = [];

    for (const seed of seeds) {
      try {
        const result = await this.generateImages({
          ...input,
          seed,
        });
        results.push(result);
      } catch (error) {
        console.error(`Failed to generate image with seed: ${seed}`, error);
        results.push({
          images: [],
          error: (error as DreamOError).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate images with different guidance scales
   * @param input - Base input parameters
   * @param guidanceScales - Array of guidance scales to try
   * @returns Promise<DreamOOutput[]> - Array of results for each guidance scale
   */
  async generateWithGuidanceScales(
    input: Omit<DreamOInput, "guidance_scale">,
    guidanceScales: number[]
  ): Promise<DreamOOutput[]> {
    const results: DreamOOutput[] = [];

    for (const guidanceScale of guidanceScales) {
      try {
        const result = await this.generateImages({
          ...input,
          guidance_scale: guidanceScale,
        });
        results.push(result);
      } catch (error) {
        console.error(`Failed to generate image with guidance scale: ${guidanceScale}`, error);
        results.push({
          images: [],
          error: (error as DreamOError).message,
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
      name: "DreamO",
      version: "latest",
      provider: "fal-ai",
      endpoint: MODEL_ENDPOINT,
      supportedImageSizes: ["square_hd", "square", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"],
      supportedAspectRatios: ["1:1", "4:3", "16:9", "3:4", "9:16"],
      pricing: {
        standard: 0.05,
        unit: "per megapixel",
      },
      features: [
        "Advanced image customization framework",
        "Multiple reference image support",
        "Identity preservation (IP) capabilities",
        "Style transfer and customization",
        "Dual reference image processing",
        "Flexible reference task configuration",
        "High-quality image generation",
        "Multiple output support",
        "Custom image size support",
        "Real-time generation with queue system"
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
    return 0.05 * megapixels * numImages;
  }

  /**
   * Calculate cost for a specific image size
   * @param imageSize - The image size to calculate cost for
   * @param numImages - Number of images to generate
   * @returns Cost in dollars
   */
  calculateCostForSize(imageSize: DreamOInput["image_size"], numImages: number = 1): number {
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
  private validateInput(input: DreamOInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required and cannot be empty");
    }

    if (input.prompt.length > 1000) {
      throw new Error("Prompt is too long. Maximum length is 1000 characters");
    }

    if (input.first_reference_task && !["ip", "id", "style"].includes(input.first_reference_task)) {
      throw new Error("First reference task must be 'ip', 'id', or 'style'");
    }

    if (input.second_reference_task && !["ip", "id", "style"].includes(input.second_reference_task)) {
      throw new Error("Second reference task must be 'ip', 'id', or 'style'");
    }

    if (input.num_inference_steps !== undefined && (input.num_inference_steps < 1 || input.num_inference_steps > 50)) {
      throw new Error("Number of inference steps must be between 1 and 50");
    }

    if (input.guidance_scale !== undefined && (input.guidance_scale < 0 || input.guidance_scale > 20)) {
      throw new Error("Guidance scale must be between 0 and 20");
    }

    if (input.ref_resolution !== undefined && (input.ref_resolution < 256 || input.ref_resolution > 1024)) {
      throw new Error("Reference resolution must be between 256 and 1024");
    }

    if (input.true_cfg !== undefined && (input.true_cfg < 0 || input.true_cfg > 10)) {
      throw new Error("True CFG must be between 0 and 10");
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
  private isValidImageSize(imageSize: any): imageSize is DreamOInput["image_size"] {
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
  private mergeWithDefaults(input: DreamOInput): DreamOInput {
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
  private handleError(error: any): DreamOError {
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
export const dreamOUtils = {
  /**
   * Create an identity preservation prompt
   * @param subject - Subject description
   * @param action - Action or pose
   * @param setting - Setting or background
   * @returns Formatted prompt
   */
  createIdentityPreservationPrompt(subject: string, action: string, setting: string): string {
    return `${subject} ${action} in ${setting}, high quality, detailed, professional photography`;
  },

  /**
   * Create a style transfer prompt
   * @param subject - Subject description
   * @param style - Artistic style
   * @param context - Context or setting
   * @returns Formatted prompt
   */
  createStyleTransferPrompt(subject: string, style: string, context: string): string {
    return `${subject} in ${style} style, ${context}, artistic rendering, high quality`;
  },

  /**
   * Create a dual reference prompt
   * @param subject - Subject description
   * @param identity - Identity characteristics
   * @param style - Artistic style
   * @param setting - Setting or background
   * @returns Formatted prompt
   */
  createDualReferencePrompt(subject: string, identity: string, style: string, setting: string): string {
    return `${subject} with ${identity} features in ${style} style, ${setting}, high quality, detailed`;
  },

  /**
   * Create a multiple identity prompt
   * @param subjects - Array of subject descriptions
   * @param action - Action or interaction
   * @param setting - Setting or background
   * @returns Formatted prompt
   */
  createMultipleIdentityPrompt(subjects: string[], action: string, setting: string): string {
    const subjectList = subjects.join(" and ");
    return `${subjectList} ${action} in ${setting}, high quality, detailed, professional photography`;
  },

  /**
   * Create a custom reference prompt
   * @param subject - Subject description
   * @param references - Array of reference descriptions
   * @param context - Context or setting
   * @returns Formatted prompt
   */
  createCustomReferencePrompt(subject: string, references: string[], context: string): string {
    const referenceList = references.join(" with ");
    return `${subject} with ${referenceList} in ${context}, high quality, detailed`;
  },

  /**
   * Get recommended image size for use case
   * @param useCase - The intended use case
   * @returns Recommended image size
   */
  getRecommendedImageSize(useCase: string): DreamOInput["image_size"] {
    const recommendations: Record<string, DreamOInput["image_size"]> = {
      "identity_preservation": "square_hd",
      "style_transfer": "square_hd",
      "dual_reference": "square_hd",
      "portrait": "portrait_4_3",
      "landscape": "landscape_16_9",
      "social_media": "square_hd",
      "print": "portrait_4_3",
      "web": "landscape_16_9",
      "fast_generation": "square",
      "high_quality": "square_hd"
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
      "identity_preservation": "1:1",
      "style_transfer": "1:1",
      "dual_reference": "1:1",
      "portrait": "3:4",
      "landscape": "16:9",
      "social_media": "1:1",
      "print": "3:4",
      "web": "16:9",
      "fast_generation": "1:1",
      "high_quality": "1:1"
    };

    return recommendations[useCase.toLowerCase()] || "1:1";
  },

  /**
   * Get recommended guidance scale for reference task
   * @param referenceTask - The reference task type
   * @returns Recommended guidance scale
   */
  getRecommendedGuidanceScale(referenceTask: string): number {
    const recommendations: Record<string, number> = {
      "ip": 4.0, // Identity preservation
      "id": 3.5, // Identity
      "style": 3.0, // Style transfer
      "dual": 3.5, // Dual reference
      "multiple": 4.0, // Multiple references
      "high_quality": 4.0,
      "fast": 3.0,
      "balanced": 3.5
    };

    return recommendations[referenceTask.toLowerCase()] || 3.5;
  },

  /**
   * Get recommended inference steps for quality level
   * @param qualityLevel - The desired quality level
   * @returns Recommended number of inference steps
   */
  getRecommendedInferenceSteps(qualityLevel: string): number {
    const recommendations: Record<string, number> = {
      "fast": 8,
      "standard": 12,
      "high": 16,
      "ultra": 20,
      "preview": 6,
      "draft": 4
    };

    return recommendations[qualityLevel.toLowerCase()] || 12;
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
    return 0.05 * megapixels * numImages;
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
   * Get recommended reference resolution for task
   * @param task - The reference task
   * @returns Recommended reference resolution
   */
  getRecommendedRefResolution(task: string): number {
    const recommendations: Record<string, number> = {
      "ip": 512, // Identity preservation
      "id": 512, // Identity
      "style": 768, // Style transfer (higher for better style capture)
      "dual": 512, // Dual reference
      "multiple": 512, // Multiple references
      "high_quality": 768,
      "fast": 512,
      "balanced": 512
    };

    return recommendations[task.toLowerCase()] || 512;
  }
};

// Export default executor instance
export default DreamOExecutor;
