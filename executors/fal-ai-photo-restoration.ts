import { fal } from "@fal-ai/client";

export interface PhotoRestorationInput {
  image_url: string;
  guidance_scale?: number;
  num_inference_steps?: number;
  safety_tolerance?: "1" | "2" | "3" | "4" | "5" | "6";
  output_format?: "jpeg" | "png";
  aspect_ratio?: "21:9" | "16:9" | "4:3" | "3:2" | "1:1" | "2:3" | "3:4" | "9:16" | "9:21";
  seed?: number;
  sync_mode?: boolean;
}

export interface PhotoRestorationOutput {
  images: Array<{
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
    width?: number;
    height?: number;
  }>;
  seed?: number;
}

export class FalAiPhotoRestorationExecutor {
  private modelId = "fal-ai/image-editing/photo-restoration";

  /**
   * Restore old or damaged photo
   */
  async restore(input: PhotoRestorationInput): Promise<PhotoRestorationOutput> {
    const params = {
      image_url: input.image_url,
      guidance_scale: input.guidance_scale ?? 3.5,
      num_inference_steps: input.num_inference_steps ?? 30,
      safety_tolerance: input.safety_tolerance ?? "2",
      output_format: input.output_format ?? "jpeg",
      aspect_ratio: input.aspect_ratio,
      seed: input.seed,
      sync_mode: input.sync_mode
    };

    const result = await fal.subscribe(this.modelId, {
      input: params
    });

    return result.data as PhotoRestorationOutput;
  }

  /**
   * Restore with custom guidance scale
   */
  async restoreWithGuidance(input: PhotoRestorationInput & { guidance_scale: number }): Promise<PhotoRestorationOutput> {
    return this.restore(input);
  }

  /**
   * High-quality restoration with quality settings
   */
  async restoreHighQuality(input: PhotoRestorationInput & { 
    num_inference_steps: number; 
    guidance_scale: number 
  }): Promise<PhotoRestorationOutput> {
    return this.restore(input);
  }

  /**
   * Fast restoration with performance settings
   */
  async restoreFast(input: PhotoRestorationInput & { 
    num_inference_steps: number; 
    guidance_scale: number 
  }): Promise<PhotoRestorationOutput> {
    return this.restore(input);
  }

  /**
   * Restore to specific aspect ratio
   */
  async restoreToAspectRatio(input: PhotoRestorationInput & { aspect_ratio: "21:9" | "16:9" | "4:3" | "3:2" | "1:1" | "2:3" | "3:4" | "9:16" | "9:21" }): Promise<PhotoRestorationOutput> {
    return this.restore(input);
  }

  /**
   * Restore for photography format (3:2)
   */
  async restoreForPhotography(input: PhotoRestorationInput & { aspect_ratio: "3:2" }): Promise<PhotoRestorationOutput> {
    return this.restore(input);
  }

  /**
   * Restore for portrait format (3:4)
   */
  async restoreForPortrait(input: PhotoRestorationInput & { aspect_ratio: "3:4" }): Promise<PhotoRestorationOutput> {
    return this.restore(input);
  }

  /**
   * Restore for landscape format (16:9)
   */
  async restoreForLandscape(input: PhotoRestorationInput & { aspect_ratio: "16:9" }): Promise<PhotoRestorationOutput> {
    return this.restore(input);
  }

  /**
   * Restore for square format (1:1)
   */
  async restoreForSquare(input: PhotoRestorationInput & { aspect_ratio: "1:1" }): Promise<PhotoRestorationOutput> {
    return this.restore(input);
  }

  /**
   * Restore with custom safety tolerance
   */
  async restoreWithSafetyTolerance(input: PhotoRestorationInput & { safety_tolerance: "1" | "2" | "3" | "4" | "5" | "6" }): Promise<PhotoRestorationOutput> {
    return this.restore(input);
  }

  /**
   * Advanced restoration with all custom parameters
   */
  async restoreAdvanced(input: PhotoRestorationInput & {
    aspect_ratio: "21:9" | "16:9" | "4:3" | "3:2" | "1:1" | "2:3" | "3:4" | "9:16" | "9:21";
    guidance_scale: number;
    num_inference_steps: number;
    safety_tolerance: "1" | "2" | "3" | "4" | "5" | "6";
    seed: number;
  }): Promise<PhotoRestorationOutput> {
    return this.restore(input);
  }

  /**
   * Get cost estimate for photo restoration
   */
  getCostEstimate(): { price: number; unit: string } {
    return {
      price: 0.04,
      unit: "per image"
    };
  }

  /**
   * Get recommended parameters for different use cases
   */
  getRecommendedParameters(useCase: "historical" | "family" | "archival" | "artwork" | "high_quality" | "fast" | "balanced" | "conservative") {
    const recommendations = {
      historical: { aspect_ratio: "3:2" as const, guidance_scale: 4.0, num_inference_steps: 35, safety_tolerance: "2" as const },
      family: { aspect_ratio: "3:2" as const, guidance_scale: 3.5, num_inference_steps: 30, safety_tolerance: "2" as const },
      archival: { aspect_ratio: "3:2" as const, guidance_scale: 4.5, num_inference_steps: 40, safety_tolerance: "2" as const },
      artwork: { aspect_ratio: "3:2" as const, guidance_scale: 4.0, num_inference_steps: 35, safety_tolerance: "2" as const },
      high_quality: { aspect_ratio: "3:2" as const, guidance_scale: 4.0, num_inference_steps: 40, safety_tolerance: "2" as const },
      fast: { aspect_ratio: "3:2" as const, guidance_scale: 3.0, num_inference_steps: 20, safety_tolerance: "2" as const },
      balanced: { aspect_ratio: "3:2" as const, guidance_scale: 3.5, num_inference_steps: 30, safety_tolerance: "2" as const },
      conservative: { aspect_ratio: "3:2" as const, guidance_scale: 3.5, num_inference_steps: 30, safety_tolerance: "1" as const }
    };

    return recommendations[useCase];
  }

  /**
   * Get guidance scale guide for photo restoration
   */
  getGuidanceScaleGuide(): Array<{ range: string; effect: string; useCase: string }> {
    return [
      { range: "1.0-2.5", effect: "Very loose restoration", useCase: "Creative reinterpretation" },
      { range: "2.5-3.5", effect: "Balanced restoration", useCase: "Standard restoration" },
      { range: "3.5-4.5", effect: "Strong restoration", useCase: "Faithful restoration" },
      { range: "4.5-6.0", effect: "Very strong restoration", useCase: "Maximum preservation" },
      { range: "6.0-10.0", effect: "Extreme restoration", useCase: "Experimental use" }
    ];
  }

  /**
   * Get safety tolerance guide
   */
  getSafetyToleranceGuide(): Array<{ level: string; description: string; restrictions: string; useCase: string }> {
    return [
      { level: "1", description: "Most strict", restrictions: "Blocks most content", useCase: "Family-friendly applications" },
      { level: "2", description: "Strict", restrictions: "Blocks explicit content", useCase: "General applications" },
      { level: "3", description: "Moderate", restrictions: "Balanced filtering", useCase: "Standard applications" },
      { level: "4", description: "Permissive", restrictions: "Minimal filtering", useCase: "Creative applications" },
      { level: "5", description: "Very permissive", restrictions: "Very minimal filtering", useCase: "Experimental use" },
      { level: "6", description: "Most permissive", restrictions: "No filtering", useCase: "Unrestricted use" }
    ];
  }

  /**
   * Get aspect ratio guide for photo restoration
   */
  getAspectRatioGuide(): Array<{ ratio: string; description: string; useCase: string; examples: string[] }> {
    return [
      { ratio: "21:9", description: "Ultrawide format", useCase: "Cinematic photo restoration", examples: ["movie stills", "gaming content", "ultrawide displays"] },
      { ratio: "16:9", description: "Widescreen format", useCase: "Standard video content", examples: ["YouTube videos", "presentations", "desktop backgrounds"] },
      { ratio: "4:3", description: "Standard format", useCase: "Traditional displays", examples: ["legacy content", "presentations", "documentation"] },
      { ratio: "3:2", description: "Photography format", useCase: "Professional photography", examples: ["DSLR photos", "print media", "professional portfolios"] },
      { ratio: "1:1", description: "Square format", useCase: "Social media platforms", examples: ["Instagram posts", "profile pictures", "social media content"] },
      { ratio: "2:3", description: "Portrait format", useCase: "Portrait photography", examples: ["portrait photos", "mobile content", "vertical displays"] },
      { ratio: "3:4", description: "Portrait format", useCase: "Mobile content, portrait displays", examples: ["mobile apps", "portrait photos", "vertical content"] },
      { ratio: "9:16", description: "Mobile format", useCase: "Mobile apps, social media stories", examples: ["Instagram stories", "TikTok videos", "mobile apps"] },
      { ratio: "9:21", description: "Ultrawide portrait", useCase: "Ultrawide portrait content", examples: ["ultrawide mobile", "specialized displays", "experimental content"] }
    ];
  }

  /**
   * Validate input parameters
   */
  validateInput(input: PhotoRestorationInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.image_url) {
      errors.push("image_url is required");
    }

    if (input.guidance_scale !== undefined && (input.guidance_scale < 1.0 || input.guidance_scale > 10.0)) {
      errors.push("guidance_scale must be between 1.0 and 10.0");
    }

    if (input.num_inference_steps !== undefined && (input.num_inference_steps < 10 || input.num_inference_steps > 50)) {
      errors.push("num_inference_steps must be between 10 and 50");
    }

    const validSafetyTolerances = ["1", "2", "3", "4", "5", "6"];
    if (input.safety_tolerance && !validSafetyTolerances.includes(input.safety_tolerance)) {
      errors.push(`safety_tolerance must be one of: ${validSafetyTolerances.join(", ")}`);
    }

    const validOutputFormats = ["jpeg", "png"];
    if (input.output_format && !validOutputFormats.includes(input.output_format)) {
      errors.push(`output_format must be one of: ${validOutputFormats.join(", ")}`);
    }

    const validAspectRatios = ["21:9", "16:9", "4:3", "3:2", "1:1", "2:3", "3:4", "9:16", "9:21"];
    if (input.aspect_ratio && !validAspectRatios.includes(input.aspect_ratio)) {
      errors.push(`aspect_ratio must be one of: ${validAspectRatios.join(", ")}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get effect description based on parameters
   */
  getEffectDescription(guidanceScale: number, inferenceSteps: number, safetyTolerance: string, aspectRatio?: string): string {
    const getGuidanceDescription = (scale: number): string => {
      if (scale < 2.5) return "loose";
      if (scale < 3.5) return "balanced";
      if (scale < 4.5) return "strong";
      if (scale < 6.0) return "very strong";
      return "extreme";
    };

    const getQualityDescription = (steps: number): string => {
      if (steps < 20) return "fast";
      if (steps < 30) return "good";
      if (steps < 40) return "high";
      return "very high";
    };

    const getAspectRatioDescription = (ratio?: string): string => {
      if (!ratio) return "original aspect ratio";
      const descriptions: Record<string, string> = {
        "21:9": "ultrawide",
        "16:9": "widescreen",
        "4:3": "standard",
        "3:2": "photography",
        "1:1": "square",
        "2:3": "portrait",
        "3:4": "portrait",
        "9:16": "mobile",
        "9:21": "ultrawide portrait"
      };
      return descriptions[ratio] || ratio;
    };

    const guidanceDesc = getGuidanceDescription(guidanceScale);
    const qualityDesc = getQualityDescription(inferenceSteps);
    const aspectDesc = getAspectRatioDescription(aspectRatio);

    return `Photo restoration with ${guidanceDesc} adherence to original and ${qualityDesc} quality processing in ${aspectDesc} format (guidance: ${guidanceScale}, steps: ${inferenceSteps}, safety: ${safetyTolerance})`;
  }

  /**
   * Calculate processing time estimate
   */
  getProcessingTimeEstimate(inferenceSteps: number): { time: string; category: string } {
    if (inferenceSteps <= 20) {
      return { time: "10-20 seconds", category: "fast" };
    } else if (inferenceSteps <= 30) {
      return { time: "20-35 seconds", category: "moderate" };
    } else if (inferenceSteps <= 40) {
      return { time: "35-50 seconds", category: "slow" };
    } else {
      return { time: "50-70 seconds", category: "very slow" };
    }
  }

  /**
   * Get optimal settings for different content types
   */
  getOptimalSettings(contentType: "historical" | "family" | "archival" | "artwork" | "professional" | "mixed") {
    const settings = {
      historical: { aspect_ratio: "3:2" as const, guidance_scale: 4.0, num_inference_steps: 35, safety_tolerance: "2" as const },
      family: { aspect_ratio: "3:2" as const, guidance_scale: 3.5, num_inference_steps: 30, safety_tolerance: "2" as const },
      archival: { aspect_ratio: "3:2" as const, guidance_scale: 4.5, num_inference_steps: 40, safety_tolerance: "2" as const },
      artwork: { aspect_ratio: "3:2" as const, guidance_scale: 4.0, num_inference_steps: 35, safety_tolerance: "2" as const },
      professional: { aspect_ratio: "3:2" as const, guidance_scale: 4.0, num_inference_steps: 40, safety_tolerance: "2" as const },
      mixed: { aspect_ratio: "3:2" as const, guidance_scale: 3.5, num_inference_steps: 30, safety_tolerance: "2" as const }
    };

    return settings[contentType];
  }

  /**
   * Get supported resolutions for different aspect ratios
   */
  getSupportedResolutions(): Array<{ aspect_ratio: string; width: number; height: number; name: string; useCase: string }> {
    return [
      { aspect_ratio: "21:9", width: 2560, height: 1080, name: "ultrawide_hd", useCase: "Ultrawide displays" },
      { aspect_ratio: "16:9", width: 1920, height: 1080, name: "hd_widescreen", useCase: "Standard widescreen" },
      { aspect_ratio: "4:3", width: 1440, height: 1080, name: "standard_4_3", useCase: "Traditional displays" },
      { aspect_ratio: "3:2", width: 1080, height: 720, name: "photography_3_2", useCase: "Professional photography" },
      { aspect_ratio: "1:1", width: 1080, height: 1080, name: "square_social", useCase: "Social media" },
      { aspect_ratio: "2:3", width: 720, height: 1080, name: "portrait_2_3", useCase: "Portrait photography" },
      { aspect_ratio: "3:4", width: 810, height: 1080, name: "portrait_3_4", useCase: "Portrait content" },
      { aspect_ratio: "9:16", width: 1080, height: 1920, name: "mobile_9_16", useCase: "Mobile applications" },
      { aspect_ratio: "9:21", width: 1080, height: 2520, name: "ultrawide_portrait", useCase: "Ultrawide portrait" }
    ];
  }

  /**
   * Get photo restoration tips
   */
  getRestorationTips(): Array<{ tip: string; description: string; importance: string }> {
    return [
      { tip: "High-quality scans", description: "Use high-quality scans of damaged photos for best restoration results", importance: "High" },
      { tip: "Good resolution", description: "Ensure original photos are scanned at good resolution (300+ DPI)", importance: "High" },
      { tip: "Clean scans", description: "Remove dust and debris from scanner before scanning", importance: "Medium" },
      { tip: "Proper lighting", description: "Use even lighting when scanning to avoid shadows and glare", importance: "Medium" },
      { tip: "Original orientation", description: "Maintain original photo orientation for best results", importance: "Medium" },
      { tip: "Multiple scans", description: "Consider multiple scans at different settings for severely damaged photos", importance: "Low" }
    ];
  }

  /**
   * Get damage type recommendations
   */
  getDamageTypeRecommendations(): Array<{ damage_type: string; guidance_scale: number; inference_steps: number; description: string }> {
    return [
      { damage_type: "Light fading", guidance_scale: 3.5, inference_steps: 30, description: "Standard restoration for lightly faded photos" },
      { damage_type: "Heavy fading", guidance_scale: 4.0, inference_steps: 35, description: "Enhanced restoration for heavily faded photos" },
      { damage_type: "Scratches", guidance_scale: 4.5, inference_steps: 40, description: "Strong restoration for photos with scratches" },
      { damage_type: "Tears", guidance_scale: 4.5, inference_steps: 40, description: "Maximum restoration for photos with tears" },
      { damage_type: "Water damage", guidance_scale: 4.0, inference_steps: 35, description: "Enhanced restoration for water-damaged photos" },
      { damage_type: "Mold damage", guidance_scale: 4.5, inference_steps: 40, description: "Strong restoration for mold-damaged photos" }
    ];
  }
}

// Export a default instance
export const falAiPhotoRestoration = new FalAiPhotoRestorationExecutor();
