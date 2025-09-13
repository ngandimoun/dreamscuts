import { fal } from "@fal-ai/client";

export interface TextRemovalInput {
  image_url: string;
  guidance_scale?: number;
  num_inference_steps?: number;
  safety_tolerance?: "1" | "2" | "3" | "4" | "5" | "6";
  output_format?: "jpeg" | "png";
  aspect_ratio?: "21:9" | "16:9" | "4:3" | "3:2" | "1:1" | "2:3" | "3:4" | "9:16" | "9:21";
  seed?: number;
  sync_mode?: boolean;
}

export interface TextRemovalOutput {
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

export class FalAiTextRemovalExecutor {
  private modelId = "fal-ai/image-editing/text-removal";

  /**
   * Remove text from image
   */
  async removeText(input: TextRemovalInput): Promise<TextRemovalOutput> {
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

    return result.data as TextRemovalOutput;
  }

  /**
   * Apply text removal with custom guidance scale
   */
  async removeTextWithGuidance(input: TextRemovalInput & { guidance_scale: number }): Promise<TextRemovalOutput> {
    return this.removeText(input);
  }

  /**
   * High-quality text removal with quality settings
   */
  async removeTextHighQuality(input: TextRemovalInput & { 
    num_inference_steps: number; 
    guidance_scale: number 
  }): Promise<TextRemovalOutput> {
    return this.removeText(input);
  }

  /**
   * Fast text removal with performance settings
   */
  async removeTextFast(input: TextRemovalInput & { 
    num_inference_steps: number; 
    guidance_scale: number 
  }): Promise<TextRemovalOutput> {
    return this.removeText(input);
  }

  /**
   * Apply text removal to specific aspect ratio
   */
  async removeTextToAspectRatio(input: TextRemovalInput & { aspect_ratio: "21:9" | "16:9" | "4:3" | "3:2" | "1:1" | "2:3" | "3:4" | "9:16" | "9:21" }): Promise<TextRemovalOutput> {
    return this.removeText(input);
  }

  /**
   * Apply text removal for landscape format (16:9)
   */
  async removeTextForLandscape(input: TextRemovalInput & { aspect_ratio: "16:9" }): Promise<TextRemovalOutput> {
    return this.removeText(input);
  }

  /**
   * Apply text removal for portrait format (3:4)
   */
  async removeTextForPortrait(input: TextRemovalInput & { aspect_ratio: "3:4" }): Promise<TextRemovalOutput> {
    return this.removeText(input);
  }

  /**
   * Apply text removal for square format (1:1)
   */
  async removeTextForSquare(input: TextRemovalInput & { aspect_ratio: "1:1" }): Promise<TextRemovalOutput> {
    return this.removeText(input);
  }

  /**
   * Apply text removal for widescreen format (21:9)
   */
  async removeTextForWidescreen(input: TextRemovalInput & { aspect_ratio: "21:9" }): Promise<TextRemovalOutput> {
    return this.removeText(input);
  }

  /**
   * Apply text removal with custom safety tolerance
   */
  async removeTextWithSafetyTolerance(input: TextRemovalInput & { safety_tolerance: "1" | "2" | "3" | "4" | "5" | "6" }): Promise<TextRemovalOutput> {
    return this.removeText(input);
  }

  /**
   * Advanced text removal with all custom parameters
   */
  async removeTextAdvanced(input: TextRemovalInput & {
    aspect_ratio: "21:9" | "16:9" | "4:3" | "3:2" | "1:1" | "2:3" | "3:4" | "9:16" | "9:21";
    guidance_scale: number;
    num_inference_steps: number;
    safety_tolerance: "1" | "2" | "3" | "4" | "5" | "6";
    seed: number;
  }): Promise<TextRemovalOutput> {
    return this.removeText(input);
  }

  /**
   * Remove text from document images
   */
  async removeTextFromDocument(input: TextRemovalInput): Promise<TextRemovalOutput> {
    return this.removeText(input);
  }

  /**
   * Remove text from photos
   */
  async removeTextFromPhoto(input: TextRemovalInput): Promise<TextRemovalOutput> {
    return this.removeText(input);
  }

  /**
   * Remove text from screenshots
   */
  async removeTextFromScreenshot(input: TextRemovalInput): Promise<TextRemovalOutput> {
    return this.removeText(input);
  }

  /**
   * Get cost estimate for text removal
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
  getRecommendedParameters(useCase: "document_editing" | "photo_editing" | "screenshot_cleanup" | "image_sanitization" | "high_quality" | "fast" | "balanced" | "conservative") {
    const recommendations = {
      document_editing: { aspect_ratio: "16:9" as const, guidance_scale: 3.5, num_inference_steps: 30, safety_tolerance: "2" as const },
      photo_editing: { aspect_ratio: "16:9" as const, guidance_scale: 3.5, num_inference_steps: 30, safety_tolerance: "2" as const },
      screenshot_cleanup: { aspect_ratio: "16:9" as const, guidance_scale: 4.0, num_inference_steps: 35, safety_tolerance: "2" as const },
      image_sanitization: { aspect_ratio: "16:9" as const, guidance_scale: 3.5, num_inference_steps: 30, safety_tolerance: "2" as const },
      high_quality: { aspect_ratio: "16:9" as const, guidance_scale: 4.0, num_inference_steps: 40, safety_tolerance: "2" as const },
      fast: { aspect_ratio: "16:9" as const, guidance_scale: 3.0, num_inference_steps: 20, safety_tolerance: "2" as const },
      balanced: { aspect_ratio: "16:9" as const, guidance_scale: 3.5, num_inference_steps: 30, safety_tolerance: "2" as const },
      conservative: { aspect_ratio: "16:9" as const, guidance_scale: 3.5, num_inference_steps: 30, safety_tolerance: "1" as const }
    };

    return recommendations[useCase];
  }

  /**
   * Get guidance scale guide for text removal
   */
  getGuidanceScaleGuide(): Array<{ range: string; effect: string; useCase: string }> {
    return [
      { range: "1.0-2.5", effect: "Very loose text removal", useCase: "Creative reinterpretation" },
      { range: "2.5-3.5", effect: "Balanced text removal", useCase: "Standard text removal application" },
      { range: "3.5-4.5", effect: "Strong text removal", useCase: "Faithful text removal application" },
      { range: "4.5-6.0", effect: "Very strong text removal", useCase: "Maximum text removal control" },
      { range: "6.0-10.0", effect: "Extreme text removal", useCase: "Experimental use" }
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
   * Get aspect ratio guide for text removal
   */
  getAspectRatioGuide(): Array<{ ratio: string; description: string; useCase: string; examples: string[] }> {
    return [
      { ratio: "21:9", description: "Ultrawide format", useCase: "Cinematic text removal", examples: ["movie scenes", "gaming content", "ultrawide displays"] },
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
   * Get text removal recommendations
   */
  getTextRemovalRecommendations(): Array<{ removal_type: string; guidance_scale: number; description: string }> {
    return [
      { removal_type: "Document Text", guidance_scale: 3.5, description: "Remove text from documents and forms" },
      { removal_type: "Photo Text", guidance_scale: 3.5, description: "Remove text overlays from photos" },
      { removal_type: "Screenshot Text", guidance_scale: 4.0, description: "Remove text from screenshots" },
      { removal_type: "Image Text", guidance_scale: 3.5, description: "Remove text from general images" },
      { removal_type: "Watermark Text", guidance_scale: 4.0, description: "Remove watermark text from images" },
      { removal_type: "Caption Text", guidance_scale: 3.5, description: "Remove caption text from images" }
    ];
  }

  /**
   * Validate input parameters
   */
  validateInput(input: TextRemovalInput): { valid: boolean; errors: string[] } {
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

    return `Text removal with ${guidanceDesc} adherence to original and ${qualityDesc} quality processing in ${aspectDesc} format (guidance: ${guidanceScale}, steps: ${inferenceSteps}, safety: ${safetyTolerance})`;
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
  getOptimalSettings(contentType: "document_editing" | "photo_editing" | "screenshot_cleanup" | "image_sanitization" | "marketing" | "mixed") {
    const settings = {
      document_editing: { aspect_ratio: "16:9" as const, guidance_scale: 3.5, num_inference_steps: 30, safety_tolerance: "2" as const },
      photo_editing: { aspect_ratio: "16:9" as const, guidance_scale: 3.5, num_inference_steps: 30, safety_tolerance: "2" as const },
      screenshot_cleanup: { aspect_ratio: "16:9" as const, guidance_scale: 4.0, num_inference_steps: 35, safety_tolerance: "2" as const },
      image_sanitization: { aspect_ratio: "16:9" as const, guidance_scale: 3.5, num_inference_steps: 30, safety_tolerance: "2" as const },
      marketing: { aspect_ratio: "16:9" as const, guidance_scale: 4.0, num_inference_steps: 35, safety_tolerance: "2" as const },
      mixed: { aspect_ratio: "16:9" as const, guidance_scale: 3.5, num_inference_steps: 30, safety_tolerance: "2" as const }
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
   * Get text removal tips
   */
  getTextRemovalTips(): Array<{ tip: string; description: string; importance: string }> {
    return [
      { tip: "Clear image", description: "Use clear, high-quality images for best text removal results", importance: "High" },
      { tip: "Good contrast", description: "Ensure good contrast between text and background for better removal", importance: "High" },
      { tip: "High resolution", description: "Use high-resolution images for better quality text removal", importance: "Medium" },
      { tip: "Text clarity", description: "Ensure text is clearly visible and readable in the original image", importance: "Medium" },
      { tip: "Test variations", description: "Try different seeds for varied text removal results", importance: "Medium" },
      { tip: "Appropriate aspect ratio", description: "Choose aspect ratio that complements the image content", importance: "Low" }
    ];
  }
}

// Export a default instance
export const falAiTextRemoval = new FalAiTextRemovalExecutor();
