import { fal } from "@fal-ai/client";

export interface ParabolizeInput {
  image_url: string;
  parabolize_coeff?: number;
  vertex_x?: number;
  vertex_y?: number;
}

export interface ParabolizeOutput {
  images: Array<{
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
    width?: number;
    height?: number;
  }>;
}

export class PostProcessingParabolizeExecutor {
  private modelId = "fal-ai/post-processing/parabolize";

  /**
   * Apply parabolic distortion effect to an image
   */
  async applyEffect(input: ParabolizeInput): Promise<ParabolizeOutput> {
    const params = {
      image_url: input.image_url,
      parabolize_coeff: input.parabolize_coeff ?? 1,
      vertex_x: input.vertex_x ?? 0.5,
      vertex_y: input.vertex_y ?? 0.5
    };

    const result = await fal.subscribe(this.modelId, {
      input: params
    });

    return result.data as ParabolizeOutput;
  }

  /**
   * Apply parabolize effect with custom coefficient
   */
  async applyWithCoefficient(input: ParabolizeInput & { parabolize_coeff: number }): Promise<ParabolizeOutput> {
    return this.applyEffect(input);
  }

  /**
   * Apply parabolize effect with custom vertex position
   */
  async applyWithVertex(input: ParabolizeInput & { vertex_x: number; vertex_y: number }): Promise<ParabolizeOutput> {
    return this.applyEffect(input);
  }

  /**
   * Apply advanced parabolize effect with all parameters
   */
  async applyAdvanced(input: ParabolizeInput & { 
    parabolize_coeff: number; 
    vertex_x: number; 
    vertex_y: number 
  }): Promise<ParabolizeOutput> {
    return this.applyEffect(input);
  }

  /**
   * Get cost estimate for parabolize processing
   */
  getCostEstimate(): { price: number; unit: string } {
    return {
      price: 0.01,
      unit: "per image"
    };
  }

  /**
   * Get recommended parameters for different use cases
   */
  getRecommendedParameters(useCase: "subtle" | "moderate" | "strong" | "creative" | "outward" | "inward") {
    const recommendations = {
      subtle: { parabolize_coeff: 0.5, vertex_x: 0.5, vertex_y: 0.5 },
      moderate: { parabolize_coeff: 1.0, vertex_x: 0.5, vertex_y: 0.5 },
      strong: { parabolize_coeff: 2.0, vertex_x: 0.5, vertex_y: 0.5 },
      creative: { parabolize_coeff: 3.0, vertex_x: 0.3, vertex_y: 0.7 },
      outward: { parabolize_coeff: 2.5, vertex_x: 0.5, vertex_y: 0.5 },
      inward: { parabolize_coeff: -2.0, vertex_x: 0.5, vertex_y: 0.5 }
    };

    return recommendations[useCase];
  }

  /**
   * Validate input parameters
   */
  validateInput(input: ParabolizeInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.image_url) {
      errors.push("image_url is required");
    }

    if (input.parabolize_coeff !== undefined && (input.parabolize_coeff < -5.0 || input.parabolize_coeff > 5.0)) {
      errors.push("parabolize_coeff must be between -5.0 and 5.0");
    }

    if (input.vertex_x !== undefined && (input.vertex_x < 0.0 || input.vertex_x > 1.0)) {
      errors.push("vertex_x must be between 0.0 and 1.0");
    }

    if (input.vertex_y !== undefined && (input.vertex_y < 0.0 || input.vertex_y > 1.0)) {
      errors.push("vertex_y must be between 0.0 and 1.0");
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get effect description based on coefficient
   */
  getEffectDescription(coefficient: number): string {
    if (coefficient === 0) return "No distortion";
    if (coefficient > 0) return `Outward parabolic distortion (strength: ${Math.abs(coefficient)})`;
    return `Inward parabolic distortion (strength: ${Math.abs(coefficient)})`;
  }
}

// Export a default instance
export const postProcessingParabolize = new PostProcessingParabolizeExecutor();
