import { fal } from "@fal-ai/client";

export interface ColorTintInput {
  image_url: string;
  tint_strength?: number;
  tint_mode?: "sepia" | "red" | "green" | "blue" | "cyan" | "magenta" | "yellow" | "purple" | "orange" | "warm" | "cool" | "lime" | "navy" | "vintage" | "rose" | "teal" | "maroon" | "peach" | "lavender" | "olive";
}

export interface ColorTintOutput {
  images: Array<{
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
    width?: number;
    height?: number;
  }>;
}

export class PostProcessingColorTintExecutor {
  private modelId = "fal-ai/post-processing/color-tint";

  /**
   * Apply color tint effect to an image
   */
  async applyEffect(input: ColorTintInput): Promise<ColorTintOutput> {
    const params = {
      image_url: input.image_url,
      tint_strength: input.tint_strength ?? 1,
      tint_mode: input.tint_mode ?? "sepia"
    };

    const result = await fal.subscribe(this.modelId, {
      input: params
    });

    return result.data as ColorTintOutput;
  }

  /**
   * Apply color tint with custom strength
   */
  async applyWithStrength(input: ColorTintInput & { tint_strength: number }): Promise<ColorTintOutput> {
    return this.applyEffect(input);
  }

  /**
   * Apply specific tint mode
   */
  async applyTintMode(input: ColorTintInput & { tint_mode: "sepia" | "red" | "green" | "blue" | "cyan" | "magenta" | "yellow" | "purple" | "orange" | "warm" | "cool" | "lime" | "navy" | "vintage" | "rose" | "teal" | "maroon" | "peach" | "lavender" | "olive" }): Promise<ColorTintOutput> {
    return this.applyEffect(input);
  }

  /**
   * Apply advanced color tint with all parameters
   */
  async applyAdvanced(input: ColorTintInput & { 
    tint_strength: number; 
    tint_mode: "sepia" | "red" | "green" | "blue" | "cyan" | "magenta" | "yellow" | "purple" | "orange" | "warm" | "cool" | "lime" | "navy" | "vintage" | "rose" | "teal" | "maroon" | "peach" | "lavender" | "olive" 
  }): Promise<ColorTintOutput> {
    return this.applyEffect(input);
  }

  /**
   * Get cost estimate for color tint processing
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
  getRecommendedParameters(useCase: "vintage" | "warm" | "cool" | "romantic" | "modern" | "professional" | "creative" | "subtle" | "bold") {
    const recommendations = {
      vintage: { tint_strength: 1.2, tint_mode: "sepia" as const },
      warm: { tint_strength: 0.8, tint_mode: "warm" as const },
      cool: { tint_strength: 0.9, tint_mode: "cool" as const },
      romantic: { tint_strength: 0.7, tint_mode: "rose" as const },
      modern: { tint_strength: 0.6, tint_mode: "teal" as const },
      professional: { tint_strength: 0.5, tint_mode: "navy" as const },
      creative: { tint_strength: 1.0, tint_mode: "purple" as const },
      subtle: { tint_strength: 0.3, tint_mode: "sepia" as const },
      bold: { tint_strength: 1.8, tint_mode: "vintage" as const }
    };

    return recommendations[useCase];
  }

  /**
   * Get all available tint modes
   */
  getAvailableTintModes(): Array<{ mode: string; description: string; useCase: string }> {
    return [
      { mode: "sepia", description: "Classic vintage brown tint", useCase: "Vintage and nostalgic effects" },
      { mode: "red", description: "Warm red tint", useCase: "Dramatic and passionate effects" },
      { mode: "green", description: "Natural green tint", useCase: "Nature and organic themes" },
      { mode: "blue", description: "Cool blue tint", useCase: "Professional and calm effects" },
      { mode: "cyan", description: "Bright cyan tint", useCase: "Modern and vibrant effects" },
      { mode: "magenta", description: "Pink-purple tint", useCase: "Creative and artistic effects" },
      { mode: "yellow", description: "Warm yellow tint", useCase: "Sunny and cheerful effects" },
      { mode: "purple", description: "Rich purple tint", useCase: "Creative and mystical effects" },
      { mode: "orange", description: "Warm orange tint", useCase: "Sunset and warm effects" },
      { mode: "warm", description: "Overall warm tone", useCase: "Cozy and inviting atmospheres" },
      { mode: "cool", description: "Overall cool tone", useCase: "Modern and professional looks" },
      { mode: "lime", description: "Bright lime tint", useCase: "Fresh and energetic effects" },
      { mode: "navy", description: "Deep navy tint", useCase: "Professional and sophisticated effects" },
      { mode: "vintage", description: "Classic film vintage", useCase: "Classic film aesthetics" },
      { mode: "rose", description: "Soft rose tint", useCase: "Romantic and soft effects" },
      { mode: "teal", description: "Modern teal tint", useCase: "Modern and trendy looks" },
      { mode: "maroon", description: "Deep maroon tint", useCase: "Rich and elegant effects" },
      { mode: "peach", description: "Soft peach tint", useCase: "Soft and gentle effects" },
      { mode: "lavender", description: "Soft lavender tint", useCase: "Calm and peaceful effects" },
      { mode: "olive", description: "Natural olive tint", useCase: "Earthy and natural effects" }
    ];
  }

  /**
   * Validate input parameters
   */
  validateInput(input: ColorTintInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.image_url) {
      errors.push("image_url is required");
    }

    if (input.tint_strength !== undefined && (input.tint_strength < 0 || input.tint_strength > 2)) {
      errors.push("tint_strength must be between 0.0 and 2.0");
    }

    const validModes = ["sepia", "red", "green", "blue", "cyan", "magenta", "yellow", "purple", "orange", "warm", "cool", "lime", "navy", "vintage", "rose", "teal", "maroon", "peach", "lavender", "olive"];
    if (input.tint_mode && !validModes.includes(input.tint_mode)) {
      errors.push(`tint_mode must be one of: ${validModes.join(", ")}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get effect description based on tint mode and strength
   */
  getEffectDescription(tintMode: string, strength: number): string {
    const modeDescriptions: Record<string, string> = {
      sepia: "Vintage brown tint",
      red: "Warm red tint",
      green: "Natural green tint",
      blue: "Cool blue tint",
      cyan: "Bright cyan tint",
      magenta: "Pink-purple tint",
      yellow: "Warm yellow tint",
      purple: "Rich purple tint",
      orange: "Warm orange tint",
      warm: "Overall warm tone",
      cool: "Overall cool tone",
      lime: "Bright lime tint",
      navy: "Deep navy tint",
      vintage: "Classic film vintage",
      rose: "Soft rose tint",
      teal: "Modern teal tint",
      maroon: "Deep maroon tint",
      peach: "Soft peach tint",
      lavender: "Soft lavender tint",
      olive: "Natural olive tint"
    };

    const strengthDescription = strength < 0.5 ? "subtle" : strength < 1.0 ? "moderate" : strength < 1.5 ? "strong" : "bold";
    const modeDescription = modeDescriptions[tintMode] || "color tint";

    return `${strengthDescription} ${modeDescription} (strength: ${strength})`;
  }
}

// Export a default instance
export const postProcessingColorTint = new PostProcessingColorTintExecutor();
