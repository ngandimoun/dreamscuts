import { fal } from "@fal-ai/client";

// Types for the FlowEdit model
export interface FlowEditInput {
  image_url: string;
  source_prompt: string;
  target_prompt: string;
  seed?: number;
  num_inference_steps?: number;
  src_guidance_scale?: number;
  tar_guidance_scale?: number;
  n_avg?: number;
  n_max?: number;
  n_min?: number;
}

export interface FlowEditOutput {
  image: {
    url: string;
    content_type: string;
    file_name: string;
    file_size: number;
    file_data?: string;
    width: number;
    height: number;
  };
  seed?: number;
  requestId?: string;
}

export interface FlowEditError {
  error: string;
  message: string;
  code?: string;
}

// Model configuration
const MODEL_ENDPOINT = "fal-ai/flowedit";

// Default configuration
const DEFAULT_CONFIG = {
  num_inference_steps: 28,
  src_guidance_scale: 1.5,
  tar_guidance_scale: 5.5,
  n_avg: 1,
  n_max: 23,
};

/**
 * FlowEdit Generation Executor
 * 
 * This executor provides a comprehensive interface for high-quality image editing using the FlowEdit model
 * through the fal.ai API. It specializes in transforming images based on source and target prompts,
 * enabling precise control over image modifications and transformations.
 */
export class FlowEditExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    
    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Edit images using the FlowEdit model
   * @param input - The input parameters for image editing
   * @returns Promise<FlowEditOutput> - The edited image and metadata
   */
  async editImage(input: FlowEditInput): Promise<FlowEditOutput> {
    try {
      // Validate input
      this.validateInput(input);

      // Merge with defaults
      const params = this.mergeWithDefaults(input);

      // Edit image
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
        image: result.image,
        seed: result.seed,
        requestId: result.requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Edit images asynchronously using queue system
   * @param input - The input parameters for image editing
   * @param webhookUrl - Optional webhook URL for notifications
   * @returns Promise<{requestId: string}> - The request ID for tracking
   */
  async queueImageEdit(
    input: FlowEditInput,
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
   * @param requestId - The request ID from queueImageEdit
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
   * @param requestId - The request ID from queueImageEdit
   * @returns Promise<FlowEditOutput> - The edited image and metadata
   */
  async getQueueResult(requestId: string): Promise<FlowEditOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });

      return {
        image: result.image,
        seed: result.seed,
        requestId: result.requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Edit multiple images with different transformations
   * @param imageUrl - The source image URL
   * @param sourcePrompt - The source prompt
   * @param targetPrompts - Array of target prompts for different transformations
   * @param options - Additional options for editing
   * @returns Promise<FlowEditOutput[]> - Array of results for each transformation
   */
  async editMultipleImages(
    imageUrl: string,
    sourcePrompt: string,
    targetPrompts: string[],
    options?: Partial<FlowEditInput>
  ): Promise<FlowEditOutput[]> {
    const results: FlowEditOutput[] = [];

    for (const targetPrompt of targetPrompts) {
      try {
        const result = await this.editImage({
          image_url: imageUrl,
          source_prompt: sourcePrompt,
          target_prompt: targetPrompt,
          ...options,
        });
        results.push(result);
      } catch (error) {
        console.error(`Failed to edit image for target prompt: ${targetPrompt}`, error);
        results.push({
          image: {
            url: "",
            content_type: "",
            file_name: "",
            file_size: 0,
            width: 0,
            height: 0,
          },
          error: (error as FlowEditError).message,
        });
      }
    }

    return results;
  }

  /**
   * Edit image with different guidance scales
   * @param input - Base input parameters
   * @param guidanceScales - Array of guidance scale combinations to try
   * @returns Promise<FlowEditOutput[]> - Array of results for each guidance scale
   */
  async editWithGuidanceScales(
    input: Omit<FlowEditInput, "src_guidance_scale" | "tar_guidance_scale">,
    guidanceScales: Array<{ src: number; tar: number }>
  ): Promise<FlowEditOutput[]> {
    const results: FlowEditOutput[] = [];

    for (const { src, tar } of guidanceScales) {
      try {
        const result = await this.editImage({
          ...input,
          src_guidance_scale: src,
          tar_guidance_scale: tar,
        });
        results.push(result);
      } catch (error) {
        console.error(
          `Failed to edit image with guidance scales: src=${src}, tar=${tar}`,
          error
        );
        results.push({
          image: {
            url: "",
            content_type: "",
            file_name: "",
            file_size: 0,
            width: 0,
            height: 0,
          },
          error: (error as FlowEditError).message,
        });
      }
    }

    return results;
  }

  /**
   * Edit image with high-quality settings
   * @param input - The input parameters for image editing
   * @returns Promise<FlowEditOutput> - The high-quality edited image
   */
  async editHighQuality(input: FlowEditInput): Promise<FlowEditOutput> {
    return this.editImage({
      ...input,
      num_inference_steps: 50,
      src_guidance_scale: 2.0,
      tar_guidance_scale: 7.0,
      n_max: 30,
    });
  }

  /**
   * Edit image with fast processing
   * @param input - The input parameters for image editing
   * @returns Promise<FlowEditOutput> - The fast-edited image
   */
  async editFast(input: FlowEditInput): Promise<FlowEditOutput> {
    return this.editImage({
      ...input,
      num_inference_steps: 20,
      src_guidance_scale: 1.0,
      tar_guidance_scale: 4.0,
      n_max: 15,
    });
  }

  /**
   * Edit image with conservative changes
   * @param input - The input parameters for image editing
   * @returns Promise<FlowEditOutput> - The conservatively edited image
   */
  async editConservative(input: FlowEditInput): Promise<FlowEditOutput> {
    return this.editImage({
      ...input,
      src_guidance_scale: 2.5,
      tar_guidance_scale: 4.0,
      n_max: 15,
    });
  }

  /**
   * Edit image with aggressive changes
   * @param input - The input parameters for image editing
   * @returns Promise<FlowEditOutput> - The aggressively edited image
   */
  async editAggressive(input: FlowEditInput): Promise<FlowEditOutput> {
    return this.editImage({
      ...input,
      src_guidance_scale: 1.0,
      tar_guidance_scale: 7.0,
      n_max: 30,
    });
  }

  /**
   * Edit image with style preservation
   * @param input - The input parameters for image editing
   * @returns Promise<FlowEditOutput> - The style-preserved edited image
   */
  async editWithStylePreservation(input: FlowEditInput): Promise<FlowEditOutput> {
    return this.editImage({
      ...input,
      src_guidance_scale: 2.0,
      tar_guidance_scale: 5.0,
      n_avg: 2,
      n_max: 20,
    });
  }

  /**
   * Edit image with content transformation
   * @param input - The input parameters for image editing
   * @returns Promise<FlowEditOutput> - The content-transformed image
   */
  async editWithContentTransformation(input: FlowEditInput): Promise<FlowEditOutput> {
    return this.editImage({
      ...input,
      src_guidance_scale: 1.0,
      tar_guidance_scale: 6.0,
      n_max: 25,
    });
  }

  /**
   * Upload a file and use it for editing
   * @param file - The file to upload
   * @param sourcePrompt - The source prompt
   * @param targetPrompt - The target prompt
   * @param options - Additional options for editing
   * @returns Promise<FlowEditOutput> - The edited image
   */
  async editWithUploadedFile(
    file: File,
    sourcePrompt: string,
    targetPrompt: string,
    options?: Partial<FlowEditInput>
  ): Promise<FlowEditOutput> {
    // Upload the file
    const url = await fal.storage.upload(file);

    // Edit with the uploaded file
    return this.editImage({
      image_url: url,
      source_prompt: sourcePrompt,
      target_prompt: targetPrompt,
      ...options,
    });
  }

  /**
   * Get model information and capabilities
   * @returns Object with model information
   */
  getModelInfo() {
    return {
      name: "FlowEdit",
      version: "latest",
      provider: "fal-ai",
      endpoint: MODEL_ENDPOINT,
      pricing: {
        standard: 0,
        unit: "per compute second",
      },
      features: [
        "High-quality image editing capabilities",
        "Source-to-target prompt transformation",
        "Precise control over image modifications",
        "Multiple guidance scale options",
        "Adjustable inference steps for quality/speed trade-offs",
        "Style preservation and content transformation",
        "Conservative and aggressive editing modes",
        "Professional-grade image editing results",
        "Support for various image formats",
        "Real-time editing with queue system"
      ],
    };
  }

  /**
   * Calculate cost for editing (free model)
   * @returns Cost in dollars (always 0 for this model)
   */
  calculateCost(): number {
    return 0; // Free model
  }

  /**
   * Validate input parameters
   * @param input - The input to validate
   */
  private validateInput(input: FlowEditInput): void {
    if (!input.image_url || input.image_url.trim().length === 0) {
      throw new Error("Image URL is required and cannot be empty");
    }

    if (!input.source_prompt || input.source_prompt.trim().length === 0) {
      throw new Error("Source prompt is required and cannot be empty");
    }

    if (!input.target_prompt || input.target_prompt.trim().length === 0) {
      throw new Error("Target prompt is required and cannot be empty");
    }

    if (input.source_prompt.length > 1000) {
      throw new Error("Source prompt is too long. Maximum length is 1000 characters");
    }

    if (input.target_prompt.length > 1000) {
      throw new Error("Target prompt is too long. Maximum length is 1000 characters");
    }

    if (input.num_inference_steps !== undefined && (input.num_inference_steps < 1 || input.num_inference_steps > 100)) {
      throw new Error("Number of inference steps must be between 1 and 100");
    }

    if (input.src_guidance_scale !== undefined && (input.src_guidance_scale < 0 || input.src_guidance_scale > 10)) {
      throw new Error("Source guidance scale must be between 0 and 10");
    }

    if (input.tar_guidance_scale !== undefined && (input.tar_guidance_scale < 0 || input.tar_guidance_scale > 10)) {
      throw new Error("Target guidance scale must be between 0 and 10");
    }

    if (input.n_avg !== undefined && (input.n_avg < 1 || input.n_avg > 10)) {
      throw new Error("N_avg must be between 1 and 10");
    }

    if (input.n_max !== undefined && (input.n_max < 1 || input.n_max > 50)) {
      throw new Error("N_max must be between 1 and 50");
    }

    if (input.n_min !== undefined && (input.n_min < 0 || input.n_min > 20)) {
      throw new Error("N_min must be between 0 and 20");
    }

    if (input.seed !== undefined && (input.seed < 0 || input.seed > 2147483647)) {
      throw new Error("Seed must be a positive integer between 0 and 2147483647");
    }
  }

  /**
   * Merge input with default values
   * @param input - The input parameters
   * @returns Merged parameters with defaults
   */
  private mergeWithDefaults(input: FlowEditInput): FlowEditInput {
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
  private handleError(error: any): FlowEditError {
    if (error.message) {
      return {
        error: "Editing failed",
        message: error.message,
        code: error.code,
      };
    }

    return {
      error: "Unknown error",
      message: "An unexpected error occurred during image editing",
    };
  }
}

// Utility functions for common use cases
export const flowEditUtils = {
  /**
   * Create a landmark transformation prompt
   * @param originalLandmark - Original landmark description
   * @param newLandmark - New landmark description
   * @param context - Context description
   * @returns Formatted transformation prompt
   */
  createLandmarkTransformationPrompt(originalLandmark: string, newLandmark: string, context: string = "prominently"): { source: string; target: string } {
    return {
      source: `The image features ${originalLandmark} standing ${context}, with a beautiful background.`,
      target: `The image features ${newLandmark} standing ${context}, with a beautiful background.`
    };
  },

  /**
   * Create a style transformation prompt
   * @param subject - Subject description
   * @param originalStyle - Original style
   * @param newStyle - New style
   * @returns Formatted transformation prompt
   */
  createStyleTransformationPrompt(subject: string, originalStyle: string, newStyle: string): { source: string; target: string } {
    return {
      source: `A ${originalStyle} image of ${subject}, high quality, detailed.`,
      target: `A ${newStyle} image of ${subject}, high quality, detailed.`
    };
  },

  /**
   * Create a lighting transformation prompt
   * @param subject - Subject description
   * @param originalLighting - Original lighting
   * @param newLighting - New lighting
   * @returns Formatted transformation prompt
   */
  createLightingTransformationPrompt(subject: string, originalLighting: string, newLighting: string): { source: string; target: string } {
    return {
      source: `${subject} in ${originalLighting} lighting, professional photography.`,
      target: `${subject} in ${newLighting} lighting, professional photography.`
    };
  },

  /**
   * Create a season transformation prompt
   * @param subject - Subject description
   * @param originalSeason - Original season
   * @param newSeason - New season
   * @returns Formatted transformation prompt
   */
  createSeasonTransformationPrompt(subject: string, originalSeason: string, newSeason: string): { source: string; target: string } {
    return {
      source: `${subject} during ${originalSeason}, natural environment, high quality.`,
      target: `${subject} during ${newSeason}, natural environment, high quality.`
    };
  },

  /**
   * Create a time of day transformation prompt
   * @param subject - Subject description
   * @param originalTime - Original time of day
   * @param newTime - New time of day
   * @returns Formatted transformation prompt
   */
  createTimeTransformationPrompt(subject: string, originalTime: string, newTime: string): { source: string; target: string } {
    return {
      source: `${subject} at ${originalTime}, atmospheric lighting, professional photography.`,
      target: `${subject} at ${newTime}, atmospheric lighting, professional photography.`
    };
  },

  /**
   * Create a weather transformation prompt
   * @param subject - Subject description
   * @param originalWeather - Original weather
   * @param newWeather - New weather
   * @returns Formatted transformation prompt
   */
  createWeatherTransformationPrompt(subject: string, originalWeather: string, newWeather: string): { source: string; target: string } {
    return {
      source: `${subject} in ${originalWeather} weather conditions, realistic atmosphere.`,
      target: `${subject} in ${newWeather} weather conditions, realistic atmosphere.`
    };
  },

  /**
   * Get recommended guidance scales for editing type
   * @param editingType - The type of editing
   * @returns Recommended guidance scale configuration
   */
  getRecommendedGuidanceScales(editingType: string): { src_guidance_scale: number; tar_guidance_scale: number } {
    const recommendations: Record<string, { src_guidance_scale: number; tar_guidance_scale: number }> = {
      "conservative": { src_guidance_scale: 2.5, tar_guidance_scale: 4.0 },
      "moderate": { src_guidance_scale: 1.5, tar_guidance_scale: 5.5 },
      "aggressive": { src_guidance_scale: 1.0, tar_guidance_scale: 7.0 },
      "style_preservation": { src_guidance_scale: 2.0, tar_guidance_scale: 5.0 },
      "content_transformation": { src_guidance_scale: 1.0, tar_guidance_scale: 6.0 },
      "lighting_change": { src_guidance_scale: 1.5, tar_guidance_scale: 5.0 },
      "color_transformation": { src_guidance_scale: 1.0, tar_guidance_scale: 6.5 },
      "object_replacement": { src_guidance_scale: 1.0, tar_guidance_scale: 7.0 },
      "background_change": { src_guidance_scale: 1.5, tar_guidance_scale: 5.5 },
      "atmospheric_change": { src_guidance_scale: 1.0, tar_guidance_scale: 6.0 }
    };

    return recommendations[editingType.toLowerCase()] || { src_guidance_scale: 1.5, tar_guidance_scale: 5.5 };
  },

  /**
   * Get recommended inference steps for quality level
   * @param qualityLevel - The desired quality level
   * @returns Recommended number of inference steps
   */
  getRecommendedInferenceSteps(qualityLevel: string): number {
    const recommendations: Record<string, number> = {
      "fast": 20,
      "standard": 28,
      "high": 40,
      "ultra": 50,
      "preview": 15,
      "draft": 10
    };

    return recommendations[qualityLevel.toLowerCase()] || 28;
  },

  /**
   * Get recommended n_max for editing strength
   * @param editingStrength - The desired editing strength
   * @returns Recommended n_max value
   */
  getRecommendedNMax(editingStrength: string): number {
    const recommendations: Record<string, number> = {
      "subtle": 15,
      "moderate": 23,
      "strong": 30,
      "extreme": 40,
      "minimal": 10,
      "maximum": 50
    };

    return recommendations[editingStrength.toLowerCase()] || 23;
  },

  /**
   * Estimate cost for editing (free model)
   * @returns Estimated cost (always 0)
   */
  estimateCost(): number {
    return 0; // Free model
  },

  /**
   * Calculate edits per dollar for a given budget (infinite for free model)
   * @param budget - Budget in dollars
   * @returns Number of edits that can be performed (infinite for free model)
   */
  calculateEditsPerDollar(budget: number): number {
    return budget > 0 ? Infinity : 0; // Free model
  }
};

// Export default executor instance
export default FlowEditExecutor;
