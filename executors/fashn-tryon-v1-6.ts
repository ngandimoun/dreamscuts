import { fal } from "@fal-ai/client";

export interface FashnTryOnInput {
  model_image: string;
  garment_image: string;
  category?: "tops" | "bottoms" | "one-pieces" | "auto";
  mode?: "performance" | "balanced" | "quality";
  garment_photo_type?: "auto" | "model" | "flat-lay";
  moderation_level?: "none" | "permissive" | "conservative";
  seed?: number;
  num_samples?: number;
  segmentation_free?: boolean;
  sync_mode?: boolean;
  output_format?: "png" | "jpeg";
}

export interface FashnTryOnOutput {
  images: Array<{
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  }>;
}

export class FashnTryOnV16Executor {
  private modelId = "fal-ai/fashn/tryon/v1.6";

  /**
   * Perform virtual try-on
   */
  async tryOn(input: FashnTryOnInput): Promise<FashnTryOnOutput> {
    const params = {
      model_image: input.model_image,
      garment_image: input.garment_image,
      category: input.category ?? "auto",
      mode: input.mode ?? "balanced",
      garment_photo_type: input.garment_photo_type ?? "auto",
      moderation_level: input.moderation_level ?? "permissive",
      seed: input.seed ?? 42,
      num_samples: input.num_samples ?? 1,
      segmentation_free: input.segmentation_free ?? true,
      sync_mode: input.sync_mode,
      output_format: input.output_format ?? "png"
    };

    const result = await fal.subscribe(this.modelId, {
      input: params
    });

    return result.data as FashnTryOnOutput;
  }

  /**
   * Try-on with specific garment category
   */
  async tryOnWithCategory(input: FashnTryOnInput & { category: "tops" | "bottoms" | "one-pieces" }): Promise<FashnTryOnOutput> {
    return this.tryOn(input);
  }

  /**
   * High-quality try-on with quality mode
   */
  async tryOnHighQuality(input: FashnTryOnInput & { mode: "quality" }): Promise<FashnTryOnOutput> {
    return this.tryOn(input);
  }

  /**
   * Fast try-on with performance mode
   */
  async tryOnFast(input: FashnTryOnInput & { mode: "performance" }): Promise<FashnTryOnOutput> {
    return this.tryOn(input);
  }

  /**
   * Try-on with specific garment photo type
   */
  async tryOnWithPhotoType(input: FashnTryOnInput & { garment_photo_type: "model" | "flat-lay" }): Promise<FashnTryOnOutput> {
    return this.tryOn(input);
  }

  /**
   * Generate multiple try-on variations
   */
  async tryOnMultiple(input: FashnTryOnInput & { num_samples: number }): Promise<FashnTryOnOutput> {
    return this.tryOn(input);
  }

  /**
   * Try-on with custom moderation level
   */
  async tryOnWithModeration(input: FashnTryOnInput & { moderation_level: "none" | "permissive" | "conservative" }): Promise<FashnTryOnOutput> {
    return this.tryOn(input);
  }

  /**
   * Advanced try-on with all custom parameters
   */
  async tryOnAdvanced(input: FashnTryOnInput & {
    category: "tops" | "bottoms" | "one-pieces";
    mode: "performance" | "balanced" | "quality";
    garment_photo_type: "model" | "flat-lay";
    num_samples: number;
    seed: number;
  }): Promise<FashnTryOnOutput> {
    return this.tryOn(input);
  }

  /**
   * Get cost estimate for virtual try-on
   */
  getCostEstimate(): { price: number; unit: string } {
    return {
      price: 0.075,
      unit: "per generation"
    };
  }

  /**
   * Get recommended parameters for different use cases
   */
  getRecommendedParameters(useCase: "ecommerce" | "professional" | "fast_preview" | "high_quality" | "multiple_variations" | "conservative" | "performance" | "balanced") {
    const recommendations = {
      ecommerce: { mode: "balanced" as const, category: "auto" as const, garment_photo_type: "auto" as const, num_samples: 1, moderation_level: "permissive" as const },
      professional: { mode: "quality" as const, category: "auto" as const, garment_photo_type: "auto" as const, num_samples: 1, moderation_level: "permissive" as const },
      fast_preview: { mode: "performance" as const, category: "auto" as const, garment_photo_type: "auto" as const, num_samples: 1, moderation_level: "permissive" as const },
      high_quality: { mode: "quality" as const, category: "auto" as const, garment_photo_type: "auto" as const, num_samples: 1, moderation_level: "permissive" as const },
      multiple_variations: { mode: "balanced" as const, category: "auto" as const, garment_photo_type: "auto" as const, num_samples: 3, moderation_level: "permissive" as const },
      conservative: { mode: "balanced" as const, category: "auto" as const, garment_photo_type: "auto" as const, num_samples: 1, moderation_level: "conservative" as const },
      performance: { mode: "performance" as const, category: "auto" as const, garment_photo_type: "auto" as const, num_samples: 1, moderation_level: "permissive" as const },
      balanced: { mode: "balanced" as const, category: "auto" as const, garment_photo_type: "auto" as const, num_samples: 1, moderation_level: "permissive" as const }
    };

    return recommendations[useCase];
  }

  /**
   * Get garment category guide
   */
  getGarmentCategoryGuide(): Array<{ category: string; description: string; examples: string[] }> {
    return [
      { category: "tops", description: "Upper body garments", examples: ["shirts", "blouses", "t-shirts", "sweaters", "jackets"] },
      { category: "bottoms", description: "Lower body garments", examples: ["pants", "jeans", "skirts", "shorts", "trousers"] },
      { category: "one-pieces", description: "Full body garments", examples: ["dresses", "jumpsuits", "overalls", "bodysuits"] },
      { category: "auto", description: "Automatic category detection", examples: ["any garment type"] }
    ];
  }

  /**
   * Get operation mode guide
   */
  getOperationModeGuide(): Array<{ mode: string; description: string; speed: string; quality: string; useCase: string }> {
    return [
      { mode: "performance", description: "Fastest processing", speed: "Very fast", quality: "Good", useCase: "Quick previews and testing" },
      { mode: "balanced", description: "Optimal speed-quality balance", speed: "Fast", quality: "High", useCase: "Standard e-commerce applications" },
      { mode: "quality", description: "Highest quality output", speed: "Slow", quality: "Very high", useCase: "Professional fashion photography" }
    ];
  }

  /**
   * Get garment photo type guide
   */
  getGarmentPhotoTypeGuide(): Array<{ type: string; description: string; examples: string[] }> {
    return [
      { type: "model", description: "Garment worn on a model", examples: ["fashion photography", "model shots", "worn garments"] },
      { type: "flat-lay", description: "Garment laid flat or on ghost mannequin", examples: ["product photography", "flat lay shots", "ghost mannequin"] },
      { type: "auto", description: "Automatic photo type detection", examples: ["any garment photo style"] }
    ];
  }

  /**
   * Get moderation level guide
   */
  getModerationLevelGuide(): Array<{ level: string; description: string; restrictions: string[] }> {
    return [
      { level: "none", description: "No content moderation", restrictions: ["No restrictions"] },
      { level: "permissive", description: "Blocks only explicit content", restrictions: ["Explicit content only"] },
      { level: "conservative", description: "Blocks explicit content, underwear, and swimwear", restrictions: ["Explicit content", "Underwear", "Swimwear"] }
    ];
  }

  /**
   * Validate input parameters
   */
  validateInput(input: FashnTryOnInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.model_image) {
      errors.push("model_image is required");
    }

    if (!input.garment_image) {
      errors.push("garment_image is required");
    }

    const validCategories = ["tops", "bottoms", "one-pieces", "auto"];
    if (input.category && !validCategories.includes(input.category)) {
      errors.push(`category must be one of: ${validCategories.join(", ")}`);
    }

    const validModes = ["performance", "balanced", "quality"];
    if (input.mode && !validModes.includes(input.mode)) {
      errors.push(`mode must be one of: ${validModes.join(", ")}`);
    }

    const validPhotoTypes = ["auto", "model", "flat-lay"];
    if (input.garment_photo_type && !validPhotoTypes.includes(input.garment_photo_type)) {
      errors.push(`garment_photo_type must be one of: ${validPhotoTypes.join(", ")}`);
    }

    const validModerationLevels = ["none", "permissive", "conservative"];
    if (input.moderation_level && !validModerationLevels.includes(input.moderation_level)) {
      errors.push(`moderation_level must be one of: ${validModerationLevels.join(", ")}`);
    }

    if (input.num_samples !== undefined && (input.num_samples < 1 || input.num_samples > 4)) {
      errors.push("num_samples must be between 1 and 4");
    }

    const validOutputFormats = ["png", "jpeg"];
    if (input.output_format && !validOutputFormats.includes(input.output_format)) {
      errors.push(`output_format must be one of: ${validOutputFormats.join(", ")}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get effect description based on parameters
   */
  getEffectDescription(category: string, mode: string, garmentPhotoType: string, numSamples: number): string {
    const getCategoryDescription = (cat: string): string => {
      if (cat === "auto") return "auto-detected garment";
      return `${cat} garment`;
    };

    const getModeDescription = (m: string): string => {
      if (m === "performance") return "fast processing";
      if (m === "balanced") return "balanced processing";
      return "high-quality processing";
    };

    const getPhotoTypeDescription = (type: string): string => {
      if (type === "auto") return "auto-detected photo type";
      if (type === "model") return "model-worn garment";
      return "flat-lay garment";
    };

    const samplesText = numSamples > 1 ? `${numSamples} variations` : "single image";

    return `Virtual try-on of ${getCategoryDescription(category)} with ${getModeDescription(mode)} from ${getPhotoTypeDescription(garmentPhotoType)} - generating ${samplesText}`;
  }

  /**
   * Calculate processing time estimate
   */
  getProcessingTimeEstimate(mode: string, numSamples: number): { time: string; category: string } {
    let baseTime: number;
    
    switch (mode) {
      case "performance":
        baseTime = 15;
        break;
      case "balanced":
        baseTime = 25;
        break;
      case "quality":
        baseTime = 40;
        break;
      default:
        baseTime = 25;
    }

    const totalTime = baseTime * numSamples;
    
    if (totalTime <= 20) {
      return { time: `${totalTime}-${totalTime + 5} seconds`, category: "fast" };
    } else if (totalTime <= 40) {
      return { time: `${totalTime}-${totalTime + 10} seconds`, category: "moderate" };
    } else {
      return { time: `${totalTime}-${totalTime + 15} seconds`, category: "slow" };
    }
  }

  /**
   * Get optimal settings for different garment types
   */
  getOptimalSettings(garmentType: "tops" | "bottoms" | "one-pieces" | "mixed") {
    const settings = {
      tops: { category: "tops" as const, mode: "balanced" as const, garment_photo_type: "auto" as const, num_samples: 1 },
      bottoms: { category: "bottoms" as const, mode: "balanced" as const, garment_photo_type: "auto" as const, num_samples: 1 },
      "one-pieces": { category: "one-pieces" as const, mode: "balanced" as const, garment_photo_type: "auto" as const, num_samples: 1 },
      mixed: { category: "auto" as const, mode: "balanced" as const, garment_photo_type: "auto" as const, num_samples: 1 }
    };

    return settings[garmentType];
  }

  /**
   * Get supported resolutions
   */
  getSupportedResolutions(): Array<{ name: string; width: number; height: number; aspect_ratio: string; useCase: string }> {
    return [
      { name: "standard_tryon", width: 864, height: 1296, aspect_ratio: "2:3", useCase: "Professional fashion applications" },
      { name: "medium_tryon", width: 720, height: 1080, aspect_ratio: "2:3", useCase: "Standard e-commerce" },
      { name: "small_tryon", width: 576, height: 864, aspect_ratio: "2:3", useCase: "Fast previews" },
      { name: "compact_tryon", width: 512, height: 768, aspect_ratio: "2:3", useCase: "Mobile applications" }
    ];
  }
}

// Export a default instance
export const fashnTryOnV16 = new FashnTryOnV16Executor();
