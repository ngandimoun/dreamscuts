import { fal } from "@fal-ai/client";

export interface GrainInput {
  image_url: string;
  grain_intensity?: number;
  grain_scale?: number;
  grain_style?: "modern" | "analog" | "kodak" | "fuji" | "cinematic" | "newspaper";
}

export interface GrainOutput {
  images: Array<{
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
    width?: number;
    height?: number;
  }>;
}

export class PostProcessingGrainExecutor {
  private modelId = "fal-ai/post-processing/grain";

  /**
   * Apply film grain effect to an image
   */
  async applyEffect(input: GrainInput): Promise<GrainOutput> {
    const params = {
      image_url: input.image_url,
      grain_intensity: input.grain_intensity ?? 0.4,
      grain_scale: input.grain_scale ?? 10,
      grain_style: input.grain_style ?? "modern"
    };

    const result = await fal.subscribe(this.modelId, {
      input: params
    });

    return result.data as GrainOutput;
  }

  /**
   * Apply grain effect with custom intensity
   */
  async applyWithIntensity(input: GrainInput & { grain_intensity: number }): Promise<GrainOutput> {
    return this.applyEffect(input);
  }

  /**
   * Apply specific film grain style
   */
  async applyFilmStyle(input: GrainInput & { grain_style: "modern" | "analog" | "kodak" | "fuji" | "cinematic" | "newspaper" }): Promise<GrainOutput> {
    return this.applyEffect(input);
  }

  /**
   * Apply advanced grain effect with all parameters
   */
  async applyAdvanced(input: GrainInput & { 
    grain_intensity: number; 
    grain_scale: number; 
    grain_style: "modern" | "analog" | "kodak" | "fuji" | "cinematic" | "newspaper" 
  }): Promise<GrainOutput> {
    return this.applyEffect(input);
  }

  /**
   * Get cost estimate for grain processing
   */
  getCostEstimate(): { price: number; unit: string } {
    return {
      price: 0.001,
      unit: "per image"
    };
  }

  /**
   * Get recommended parameters for different use cases
   */
  getRecommendedParameters(useCase: "subtle" | "moderate" | "heavy" | "cinematic" | "vintage" | "newspaper") {
    const recommendations = {
      subtle: { grain_intensity: 0.2, grain_scale: 5, grain_style: "modern" as const },
      moderate: { grain_intensity: 0.4, grain_scale: 10, grain_style: "modern" as const },
      heavy: { grain_intensity: 0.8, grain_scale: 20, grain_style: "analog" as const },
      cinematic: { grain_intensity: 0.6, grain_scale: 15, grain_style: "cinematic" as const },
      vintage: { grain_intensity: 0.5, grain_scale: 12, grain_style: "kodak" as const },
      newspaper: { grain_intensity: 0.7, grain_scale: 18, grain_style: "newspaper" as const }
    };

    return recommendations[useCase];
  }

  /**
   * Validate input parameters
   */
  validateInput(input: GrainInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.image_url) {
      errors.push("image_url is required");
    }

    if (input.grain_intensity !== undefined && (input.grain_intensity < 0 || input.grain_intensity > 1)) {
      errors.push("grain_intensity must be between 0.0 and 1.0");
    }

    if (input.grain_scale !== undefined && (input.grain_scale < 1 || input.grain_scale > 50)) {
      errors.push("grain_scale must be between 1 and 50");
    }

    const validStyles = ["modern", "analog", "kodak", "fuji", "cinematic", "newspaper"];
    if (input.grain_style && !validStyles.includes(input.grain_style)) {
      errors.push(`grain_style must be one of: ${validStyles.join(", ")}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Export a default instance
export const postProcessingGrain = new PostProcessingGrainExecutor();
