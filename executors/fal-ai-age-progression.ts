import { fal } from "@fal-ai/client";

export interface AgeProgressionInput {
  image_url: string;
  prompt?: string;
  guidance_scale?: number;
  num_inference_steps?: number;
  safety_tolerance?: "1" | "2" | "3" | "4" | "5" | "6";
  output_format?: "jpeg" | "png";
  aspect_ratio?: "21:9" | "16:9" | "4:3" | "3:2" | "1:1" | "2:3" | "3:4" | "9:16" | "9:21";
  seed?: number;
  sync_mode?: boolean;
}

export interface AgeProgressionOutput {
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

export class FalAiAgeProgressionExecutor {
  private modelId = "fal-ai/image-editing/age-progression";

  /**
   * Progress age with prompt
   */
  async progress(input: AgeProgressionInput): Promise<AgeProgressionOutput> {
    const params = {
      image_url: input.image_url,
      prompt: input.prompt ?? "20 years older",
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

    return result.data as AgeProgressionOutput;
  }

  /**
   * Custom age progression with specific age change
   */
  async progressCustom(input: AgeProgressionInput & { prompt: string }): Promise<AgeProgressionOutput> {
    return this.progress(input);
  }

  /**
   * Age regression to younger age
   */
  async regress(input: AgeProgressionInput & { prompt: string }): Promise<AgeProgressionOutput> {
    return this.progress(input);
  }

  /**
   * Realistic aging with enhanced settings
   */
  async progressRealistic(input: AgeProgressionInput & { guidance_scale: number }): Promise<AgeProgressionOutput> {
    return this.progress(input);
  }

  /**
   * Facial feature preservation with high guidance scale
   */
  async preserveFeatures(input: AgeProgressionInput): Promise<AgeProgressionOutput> {
    return this.progress(input);
  }

  /**
   * Core feature retention with optimized settings
   */
  async retainCoreFeatures(input: AgeProgressionInput): Promise<AgeProgressionOutput> {
    return this.progress(input);
  }

  /**
   * Age transformation with custom settings
   */
  async transformAge(input: AgeProgressionInput): Promise<AgeProgressionOutput> {
    return this.progress(input);
  }

  /**
   * Facial analysis with age progression
   */
  async analyzeFacialAge(input: AgeProgressionInput): Promise<AgeProgressionOutput> {
    return this.progress(input);
  }

  /**
   * Predictive aging with advanced settings
   */
  async predictAging(input: AgeProgressionInput): Promise<AgeProgressionOutput> {
    return this.progress(input);
  }

  /**
   * Portrait enhancement with age progression
   */
  async enhancePortrait(input: AgeProgressionInput): Promise<AgeProgressionOutput> {
    return this.progress(input);
  }

  /**
   * Age simulation with realistic settings
   */
  async simulateAge(input: AgeProgressionInput): Promise<AgeProgressionOutput> {
    return this.progress(input);
  }

  /**
   * Square HD age progression
   */
  async progressSquareHd(input: AgeProgressionInput & { aspect_ratio: "1:1" }): Promise<AgeProgressionOutput> {
    return this.progress(input);
  }

  /**
   * Square age progression
   */
  async progressSquare(input: AgeProgressionInput & { aspect_ratio: "1:1" }): Promise<AgeProgressionOutput> {
    return this.progress(input);
  }

  /**
   * Portrait 4:3 age progression
   */
  async progressPortrait43(input: AgeProgressionInput & { aspect_ratio: "3:4" }): Promise<AgeProgressionOutput> {
    return this.progress(input);
  }

  /**
   * Portrait 16:9 age progression
   */
  async progressPortrait169(input: AgeProgressionInput & { aspect_ratio: "9:16" }): Promise<AgeProgressionOutput> {
    return this.progress(input);
  }

  /**
   * Landscape 4:3 age progression
   */
  async progressLandscape43(input: AgeProgressionInput & { aspect_ratio: "4:3" }): Promise<AgeProgressionOutput> {
    return this.progress(input);
  }

  /**
   * Landscape 16:9 age progression
   */
  async progressLandscape169(input: AgeProgressionInput & { aspect_ratio: "16:9" }): Promise<AgeProgressionOutput> {
    return this.progress(input);
  }

  /**
   * Ultra-wide 21:9 age progression
   */
  async progressUltraWide219(input: AgeProgressionInput & { aspect_ratio: "21:9" }): Promise<AgeProgressionOutput> {
    return this.progress(input);
  }

  /**
   * Ultra-wide 9:21 age progression
   */
  async progressUltraWide921(input: AgeProgressionInput & { aspect_ratio: "9:21" }): Promise<AgeProgressionOutput> {
    return this.progress(input);
  }

  /**
   * 3:2 age progression
   */
  async progress32(input: AgeProgressionInput & { aspect_ratio: "3:2" }): Promise<AgeProgressionOutput> {
    return this.progress(input);
  }

  /**
   * 2:3 age progression
   */
  async progress23(input: AgeProgressionInput & { aspect_ratio: "2:3" }): Promise<AgeProgressionOutput> {
    return this.progress(input);
  }

  /**
   * JPEG output age progression
   */
  async progressJpeg(input: AgeProgressionInput & { output_format: "jpeg" }): Promise<AgeProgressionOutput> {
    return this.progress(input);
  }

  /**
   * PNG output age progression
   */
  async progressPng(input: AgeProgressionInput & { output_format: "png" }): Promise<AgeProgressionOutput> {
    return this.progress(input);
  }

  /**
   * Get cost estimate for age progression
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
  getRecommendedParameters(useCase: "basic" | "custom" | "regression" | "realistic" | "preservation" | "retention" | "transformation" | "analysis" | "predictive" | "enhancement" | "simulation") {
    const recommendations = {
      basic: { prompt: "20 years older", guidance_scale: 3.5, description: "Basic age progression with default settings" },
      custom: { prompt: "30 years older", guidance_scale: 3.5, description: "Custom age progression with specific age change" },
      regression: { prompt: "10 years younger", guidance_scale: 3.5, description: "Age regression to younger age" },
      realistic: { prompt: "20 years older", guidance_scale: 4.0, description: "Realistic aging with enhanced settings" },
      preservation: { prompt: "20 years older", guidance_scale: 4.5, description: "Facial feature preservation with high guidance scale" },
      retention: { prompt: "20 years older", guidance_scale: 4.0, description: "Core feature retention with optimized settings" },
      transformation: { prompt: "25 years older", guidance_scale: 3.5, description: "Age transformation with custom settings" },
      analysis: { prompt: "20 years older", guidance_scale: 3.5, description: "Facial analysis with age progression" },
      predictive: { prompt: "20 years older", guidance_scale: 4.0, description: "Predictive aging with advanced settings" },
      enhancement: { prompt: "20 years older", guidance_scale: 3.5, description: "Portrait enhancement with age progression" },
      simulation: { prompt: "20 years older", guidance_scale: 4.0, description: "Age simulation with realistic settings" }
    };

    return recommendations[useCase];
  }

  /**
   * Get age progression guide
   */
  getAgeProgressionGuide(): Array<{ aspect: string; description: string; importance: string; tips: string }> {
    return [
      { aspect: "Image Quality", description: "Use clear, high-quality portrait images for best results", importance: "High", tips: "Use high-resolution images with visible facial features" },
      { aspect: "Age Change Prompts", description: "Choose appropriate age change prompts", importance: "High", tips: "Use descriptive prompts like '20 years older' or '10 years younger'" },
      { aspect: "Guidance Scale", description: "Use guidance scale to control aging intensity", importance: "High", tips: "Higher values for more realistic aging, lower for subtle changes" },
      { aspect: "Aspect Ratio", description: "Select appropriate aspect ratio for portrait orientation", importance: "Medium", tips: "Use portrait ratios for better facial feature display" },
      { aspect: "Safety Tolerance", description: "Use safety tolerance settings appropriately", importance: "Medium", tips: "Lower values for stricter content filtering" },
      { aspect: "Facial Features", description: "Ensure input images show clear facial features", importance: "Medium", tips: "Use images with well-lit, clear facial features" },
      { aspect: "Age Prompts", description: "Experiment with different age change prompts", importance: "Low", tips: "Try various age ranges for different effects" },
      { aspect: "Output Format", description: "Use appropriate output format for your needs", importance: "Low", tips: "JPEG for web, PNG for transparency" }
    ];
  }

  /**
   * Get age progression recommendations
   */
  getAgeProgressionRecommendations(): Array<{ progression_type: string; description: string; useCase: string; quality: string }> {
    return [
      { progression_type: "Basic Progression", description: "Basic age progression with default settings", useCase: "General aging", quality: "Standard" },
      { progression_type: "Custom Age", description: "Custom age progression with specific age change", useCase: "Specific age changes", quality: "Custom" },
      { progression_type: "Age Regression", description: "Age regression to younger age", useCase: "Youth restoration", quality: "Youth-focused" },
      { progression_type: "Realistic Aging", description: "Realistic aging with enhanced settings", useCase: "Realistic aging", quality: "Realistic" },
      { progression_type: "Feature Preservation", description: "Facial feature preservation with high guidance scale", useCase: "Feature retention", quality: "Preservation-focused" },
      { progression_type: "Core Retention", description: "Core feature retention with optimized settings", useCase: "Core feature preservation", quality: "Retention-focused" },
      { progression_type: "Age Transformation", description: "Age transformation with custom settings", useCase: "Age transformation", quality: "Transformative" },
      { progression_type: "Facial Analysis", description: "Facial analysis with age progression", useCase: "Facial analysis", quality: "Analytical" },
      { progression_type: "Predictive Aging", description: "Predictive aging with advanced settings", useCase: "Future aging prediction", quality: "Predictive" },
      { progression_type: "Portrait Enhancement", description: "Portrait enhancement with age progression", useCase: "Portrait enhancement", quality: "Enhancement-focused" },
      { progression_type: "Age Simulation", description: "Age simulation with realistic settings", useCase: "Age simulation", quality: "Simulation-focused" }
    ];
  }

  /**
   * Validate input parameters
   */
  validateInput(input: AgeProgressionInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.image_url) {
      errors.push("image_url is required");
    }

    if (input.guidance_scale !== undefined && input.guidance_scale <= 0) {
      errors.push("guidance_scale must be a positive number");
    }

    if (input.num_inference_steps !== undefined && input.num_inference_steps < 1) {
      errors.push("num_inference_steps must be at least 1");
    }

    const validOutputFormats = ["jpeg", "png"];
    if (input.output_format && !validOutputFormats.includes(input.output_format)) {
      errors.push(`output_format must be one of: ${validOutputFormats.join(", ")}`);
    }

    const validSafetyTolerances = ["1", "2", "3", "4", "5", "6"];
    if (input.safety_tolerance && !validSafetyTolerances.includes(input.safety_tolerance)) {
      errors.push(`safety_tolerance must be one of: ${validSafetyTolerances.join(", ")}`);
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
  getEffectDescription(prompt: string, guidanceScale: number, aspectRatio: string, outputFormat: string): string {
    const getGuidanceDescription = (scale: number): string => {
      if (scale < 2.0) return "subtle aging";
      if (scale < 3.5) return "moderate aging";
      if (scale < 5.0) return "realistic aging";
      return "intense aging";
    };

    const guidanceDesc = getGuidanceDescription(guidanceScale);

    return `Age progression with prompt "${prompt}" using ${guidanceDesc} at ${aspectRatio} aspect ratio in ${outputFormat.toUpperCase()} format`;
  }

  /**
   * Calculate processing time estimate
   */
  getProcessingTimeEstimate(): { time: string; category: string } {
    return { time: "20-40 seconds", category: "moderate" };
  }

  /**
   * Get optimal settings for different content types
   */
  getOptimalSettings(contentType: "basic" | "custom" | "regression" | "realistic" | "preservation" | "retention" | "transformation" | "analysis" | "predictive" | "enhancement" | "simulation" | "mixed") {
    const settings = {
      basic: { prompt: "20 years older", guidance_scale: 3.5, description: "Basic age progression for general use" },
      custom: { prompt: "30 years older", guidance_scale: 3.5, description: "Custom age progression for specific changes" },
      regression: { prompt: "10 years younger", guidance_scale: 3.5, description: "Age regression for youth restoration" },
      realistic: { prompt: "20 years older", guidance_scale: 4.0, description: "Realistic aging for natural results" },
      preservation: { prompt: "20 years older", guidance_scale: 4.5, description: "Feature preservation for maintaining facial features" },
      retention: { prompt: "20 years older", guidance_scale: 4.0, description: "Core retention for preserving key features" },
      transformation: { prompt: "25 years older", guidance_scale: 3.5, description: "Age transformation for dramatic changes" },
      analysis: { prompt: "20 years older", guidance_scale: 3.5, description: "Facial analysis for analytical purposes" },
      predictive: { prompt: "20 years older", guidance_scale: 4.0, description: "Predictive aging for future prediction" },
      enhancement: { prompt: "20 years older", guidance_scale: 3.5, description: "Portrait enhancement for improved portraits" },
      simulation: { prompt: "20 years older", guidance_scale: 4.0, description: "Age simulation for realistic simulation" },
      mixed: { prompt: "20 years older", guidance_scale: 3.5, description: "Mixed content for balanced results" }
    };

    return settings[contentType];
  }

  /**
   * Get supported resolutions for different aspect ratios
   */
  getSupportedResolutions(): Array<{ aspect_ratio: string; width: number; height: number; name: string; useCase: string }> {
    return [
      { aspect_ratio: "1:1", width: 1024, height: 1024, name: "square_hd", useCase: "High definition square portraits" },
      { aspect_ratio: "1:1", width: 512, height: 512, name: "square", useCase: "Standard square portraits" },
      { aspect_ratio: "3:4", width: 1024, height: 1365, name: "portrait_4_3", useCase: "Portrait 4:3 for traditional portraits" },
      { aspect_ratio: "9:16", width: 1024, height: 576, name: "portrait_16_9", useCase: "Portrait 16:9 for mobile portraits" },
      { aspect_ratio: "4:3", width: 1365, height: 1024, name: "landscape_4_3", useCase: "Landscape 4:3 for wide portraits" },
      { aspect_ratio: "16:9", width: 576, height: 1024, name: "landscape_16_9", useCase: "Landscape 16:9 for cinematic portraits" },
      { aspect_ratio: "21:9", width: 1024, height: 439, name: "ultra_wide_21_9", useCase: "Ultra-wide 21:9 for panoramic portraits" },
      { aspect_ratio: "9:21", width: 439, height: 1024, name: "ultra_tall_9_21", useCase: "Ultra-tall 9:21 for vertical portraits" },
      { aspect_ratio: "3:2", width: 1024, height: 683, name: "landscape_3_2", useCase: "Landscape 3:2 for photography portraits" },
      { aspect_ratio: "2:3", width: 683, height: 1024, name: "portrait_2_3", useCase: "Portrait 2:3 for classic portraits" }
    ];
  }

  /**
   * Get age progression tips
   */
  getAgeProgressionTips(): Array<{ tip: string; description: string; importance: string }> {
    return [
      { tip: "High-quality images", description: "Use clear, high-quality portrait images for best results", importance: "High" },
      { tip: "Age change prompts", description: "Choose appropriate age change prompts", importance: "High" },
      { tip: "Guidance scale", description: "Use guidance scale to control aging intensity", importance: "High" },
      { tip: "Aspect ratio", description: "Select appropriate aspect ratio for portrait orientation", importance: "Medium" },
      { tip: "Safety tolerance", description: "Use safety tolerance settings appropriately", importance: "Medium" },
      { tip: "Facial features", description: "Ensure input images show clear facial features", importance: "Medium" },
      { tip: "Age prompts", description: "Experiment with different age change prompts", importance: "Low" },
      { tip: "Output format", description: "Use appropriate output format for your needs", importance: "Low" }
    ];
  }

  /**
   * Get guidance scale guide
   */
  getGuidanceScaleGuide(): Array<{ scale: number; description: string; effect: string; useCase: string }> {
    return [
      { scale: 1.0, description: "Very low guidance", effect: "Minimal aging changes", useCase: "Subtle age progression" },
      { scale: 2.0, description: "Low guidance", effect: "Gentle aging changes", useCase: "Soft age progression" },
      { scale: 3.0, description: "Moderate guidance", effect: "Balanced aging changes", useCase: "Balanced age progression" },
      { scale: 3.5, description: "Standard guidance", effect: "Standard aging changes", useCase: "General age progression" },
      { scale: 4.0, description: "High guidance", effect: "Realistic aging changes", useCase: "Realistic age progression" },
      { scale: 5.0, description: "Very high guidance", effect: "Intense aging changes", useCase: "Dramatic age progression" }
    ];
  }

  /**
   * Get safety tolerance guide
   */
  getSafetyToleranceGuide(): Array<{ tolerance: string; description: string; strictness: string; useCase: string }> {
    return [
      { tolerance: "1", description: "Most strict", strictness: "Maximum content filtering", useCase: "Family-friendly content" },
      { tolerance: "2", description: "Very strict", strictness: "High content filtering", useCase: "Professional content" },
      { tolerance: "3", description: "Strict", strictness: "Moderate content filtering", useCase: "General use" },
      { tolerance: "4", description: "Moderate", strictness: "Low content filtering", useCase: "Creative work" },
      { tolerance: "5", description: "Permissive", strictness: "Minimal content filtering", useCase: "Artistic work" },
      { tolerance: "6", description: "Most permissive", strictness: "No content filtering", useCase: "Unrestricted work" }
    ];
  }

  /**
   * Get aspect ratio guide
   */
  getAspectRatioGuide(): Array<{ ratio: string; width: number; height: number; useCase: string; description: string }> {
    return [
      { ratio: "21:9", width: 1024, height: 439, useCase: "Ultra-wide displays", description: "Cinematic ultra-wide format" },
      { ratio: "16:9", width: 1024, height: 576, useCase: "Widescreen displays", description: "Standard widescreen format" },
      { ratio: "4:3", width: 1024, height: 768, useCase: "Traditional displays", description: "Traditional aspect ratio" },
      { ratio: "3:2", width: 1024, height: 683, useCase: "Photography", description: "Classic photography ratio" },
      { ratio: "1:1", width: 1024, height: 1024, useCase: "Square formats", description: "Perfect square format" },
      { ratio: "2:3", width: 683, height: 1024, useCase: "Portrait photography", description: "Portrait photography ratio" },
      { ratio: "3:4", width: 768, height: 1024, useCase: "Portrait displays", description: "Portrait display ratio" },
      { ratio: "9:16", width: 576, height: 1024, useCase: "Mobile displays", description: "Mobile phone format" },
      { ratio: "9:21", width: 439, height: 1024, useCase: "Ultra-tall displays", description: "Ultra-tall format" }
    ];
  }
}

// Export a default instance
export const falAiAgeProgression = new FalAiAgeProgressionExecutor();
