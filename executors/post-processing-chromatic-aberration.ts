import { fal } from "@fal-ai/client";

export interface ChromaticAberrationInput {
  image_url: string;
  red_shift?: number;
  red_direction?: "horizontal" | "vertical";
  green_shift?: number;
  green_direction?: "horizontal" | "vertical";
  blue_shift?: number;
  blue_direction?: "horizontal" | "vertical";
}

export interface ChromaticAberrationOutput {
  images: Array<{
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
    width?: number;
    height?: number;
  }>;
}

export class PostProcessingChromaticAberrationExecutor {
  private modelId = "fal-ai/post-processing/chromatic-aberration";

  /**
   * Apply chromatic aberration effect to an image
   */
  async applyEffect(input: ChromaticAberrationInput): Promise<ChromaticAberrationOutput> {
    const params = {
      image_url: input.image_url,
      red_shift: input.red_shift ?? 0,
      red_direction: input.red_direction ?? "horizontal",
      green_shift: input.green_shift ?? 0,
      green_direction: input.green_direction ?? "horizontal",
      blue_shift: input.blue_shift ?? 0,
      blue_direction: input.blue_direction ?? "horizontal"
    };

    const result = await fal.subscribe(this.modelId, {
      input: params
    });

    return result.data as ChromaticAberrationOutput;
  }

  /**
   * Apply red channel shift
   */
  async applyRedShift(input: ChromaticAberrationInput & { red_shift: number; red_direction: "horizontal" | "vertical" }): Promise<ChromaticAberrationOutput> {
    return this.applyEffect(input);
  }

  /**
   * Apply green channel shift
   */
  async applyGreenShift(input: ChromaticAberrationInput & { green_shift: number; green_direction: "horizontal" | "vertical" }): Promise<ChromaticAberrationOutput> {
    return this.applyEffect(input);
  }

  /**
   * Apply blue channel shift
   */
  async applyBlueShift(input: ChromaticAberrationInput & { blue_shift: number; blue_direction: "horizontal" | "vertical" }): Promise<ChromaticAberrationOutput> {
    return this.applyEffect(input);
  }

  /**
   * Apply RGB channel separation
   */
  async applyRGBSeparation(input: ChromaticAberrationInput & { 
    red_shift: number; 
    green_shift: number; 
    blue_shift: number 
  }): Promise<ChromaticAberrationOutput> {
    return this.applyEffect(input);
  }

  /**
   * Apply advanced chromatic aberration with all parameters
   */
  async applyAdvanced(input: ChromaticAberrationInput & { 
    red_shift: number; 
    red_direction: "horizontal" | "vertical";
    green_shift: number; 
    green_direction: "horizontal" | "vertical";
    blue_shift: number; 
    blue_direction: "horizontal" | "vertical";
  }): Promise<ChromaticAberrationOutput> {
    return this.applyEffect(input);
  }

  /**
   * Get cost estimate for chromatic aberration processing
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
  getRecommendedParameters(useCase: "subtle" | "moderate" | "artistic" | "extreme" | "realistic" | "creative" | "vintage" | "modern") {
    const recommendations = {
      subtle: { red_shift: 2, green_shift: -1, blue_shift: 3, red_direction: "horizontal" as const, green_direction: "horizontal" as const, blue_direction: "horizontal" as const },
      moderate: { red_shift: 8, green_shift: -3, blue_shift: 12, red_direction: "horizontal" as const, green_direction: "horizontal" as const, blue_direction: "horizontal" as const },
      artistic: { red_shift: 15, green_shift: -8, blue_shift: 20, red_direction: "horizontal" as const, green_direction: "vertical" as const, blue_direction: "horizontal" as const },
      extreme: { red_shift: 25, green_shift: -15, blue_shift: 35, red_direction: "horizontal" as const, green_direction: "vertical" as const, blue_direction: "horizontal" as const },
      realistic: { red_shift: 3, green_shift: -2, blue_shift: 5, red_direction: "horizontal" as const, green_direction: "horizontal" as const, blue_direction: "horizontal" as const },
      creative: { red_shift: 12, green_shift: 8, blue_shift: -10, red_direction: "horizontal" as const, green_direction: "vertical" as const, blue_direction: "vertical" as const },
      vintage: { red_shift: 6, green_shift: -4, blue_shift: 8, red_direction: "horizontal" as const, green_direction: "horizontal" as const, blue_direction: "horizontal" as const },
      modern: { red_shift: 4, green_shift: 2, blue_shift: -3, red_direction: "vertical" as const, green_direction: "horizontal" as const, blue_direction: "vertical" as const }
    };

    return recommendations[useCase];
  }

  /**
   * Get all available shift directions
   */
  getAvailableDirections(): Array<{ direction: string; description: string; useCase: string }> {
    return [
      { direction: "horizontal", description: "Shift channels left or right", useCase: "Standard chromatic aberration simulation" },
      { direction: "vertical", description: "Shift channels up or down", useCase: "Vertical lens distortion effects" }
    ];
  }

  /**
   * Get shift range information
   */
  getShiftRange(): { min: number; max: number; description: string } {
    return {
      min: -50,
      max: 50,
      description: "Shift values range from -50 to 50 pixels. Negative values shift in opposite direction."
    };
  }

  /**
   * Validate input parameters
   */
  validateInput(input: ChromaticAberrationInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.image_url) {
      errors.push("image_url is required");
    }

    if (input.red_shift !== undefined && (input.red_shift < -50 || input.red_shift > 50)) {
      errors.push("red_shift must be between -50 and 50");
    }

    if (input.green_shift !== undefined && (input.green_shift < -50 || input.green_shift > 50)) {
      errors.push("green_shift must be between -50 and 50");
    }

    if (input.blue_shift !== undefined && (input.blue_shift < -50 || input.blue_shift > 50)) {
      errors.push("blue_shift must be between -50 and 50");
    }

    const validDirections = ["horizontal", "vertical"];
    if (input.red_direction && !validDirections.includes(input.red_direction)) {
      errors.push(`red_direction must be one of: ${validDirections.join(", ")}`);
    }

    if (input.green_direction && !validDirections.includes(input.green_direction)) {
      errors.push(`green_direction must be one of: ${validDirections.join(", ")}`);
    }

    if (input.blue_direction && !validDirections.includes(input.blue_direction)) {
      errors.push(`blue_direction must be one of: ${validDirections.join(", ")}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get effect description based on shift parameters
   */
  getEffectDescription(redShift: number, greenShift: number, blueShift: number, redDirection: string, greenDirection: string, blueDirection: string): string {
    const getShiftDescription = (shift: number, direction: string): string => {
      if (shift === 0) return "no shift";
      const directionText = direction === "horizontal" ? "horizontal" : "vertical";
      const directionDesc = shift > 0 ? "positive" : "negative";
      return `${Math.abs(shift)}px ${directionText} ${directionDesc} shift`;
    };

    const redDesc = getShiftDescription(redShift, redDirection);
    const greenDesc = getShiftDescription(greenShift, greenDirection);
    const blueDesc = getShiftDescription(blueShift, blueDirection);

    return `Chromatic aberration with red: ${redDesc}, green: ${greenDesc}, blue: ${blueDesc}`;
  }

  /**
   * Calculate total shift intensity
   */
  calculateShiftIntensity(redShift: number, greenShift: number, blueShift: number): number {
    return Math.abs(redShift) + Math.abs(greenShift) + Math.abs(blueShift);
  }

  /**
   * Get shift intensity category
   */
  getShiftIntensityCategory(totalShift: number): "none" | "subtle" | "moderate" | "strong" | "extreme" {
    if (totalShift === 0) return "none";
    if (totalShift <= 10) return "subtle";
    if (totalShift <= 25) return "moderate";
    if (totalShift <= 50) return "strong";
    return "extreme";
  }
}

// Export a default instance
export const postProcessingChromaticAberration = new PostProcessingChromaticAberrationExecutor();
