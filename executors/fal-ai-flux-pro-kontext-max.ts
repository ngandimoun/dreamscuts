import { fal } from "@fal-ai/client";

export interface FluxProKontextMaxInput {
  prompt: string;
  image_url: string;
  guidance_scale?: number;
  num_images?: number;
  output_format?: "jpeg" | "png";
  safety_tolerance?: "1" | "2" | "3" | "4" | "5" | "6";
  enhance_prompt?: boolean;
  aspect_ratio?: "21:9" | "16:9" | "4:3" | "3:2" | "1:1" | "2:3" | "3:4" | "9:16" | "9:21";
  seed?: number;
  sync_mode?: boolean;
}

export interface FluxProKontextMaxOutput {
  images: Array<{
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
    width?: number;
    height?: number;
  }>;
  timings?: any;
  seed?: number;
  has_nsfw_concepts?: boolean[];
  prompt?: string;
}

export class FalAiFluxProKontextMaxExecutor {
  private modelId = "fal-ai/flux-pro/kontext/max";

  /**
   * Edit image with prompt
   */
  async edit(input: FluxProKontextMaxInput): Promise<FluxProKontextMaxOutput> {
    const params = {
      prompt: input.prompt,
      image_url: input.image_url,
      guidance_scale: input.guidance_scale ?? 3.5,
      num_images: input.num_images ?? 1,
      output_format: input.output_format ?? "jpeg",
      safety_tolerance: input.safety_tolerance ?? "2",
      enhance_prompt: input.enhance_prompt,
      aspect_ratio: input.aspect_ratio,
      seed: input.seed,
      sync_mode: input.sync_mode
    };

    const result = await fal.subscribe(this.modelId, {
      input: params
    });

    return result.data as FluxProKontextMaxOutput;
  }

  /**
   * Premium image editing with enhanced settings
   */
  async editPremium(input: FluxProKontextMaxInput & { guidance_scale: number }): Promise<FluxProKontextMaxOutput> {
    return this.edit(input);
  }

  /**
   * Typography generation with text focus
   */
  async generateTypography(input: FluxProKontextMaxInput): Promise<FluxProKontextMaxOutput> {
    return this.edit(input);
  }

  /**
   * Complex task handling with advanced settings
   */
  async handleComplexTask(input: FluxProKontextMaxInput & { enhance_prompt: boolean }): Promise<FluxProKontextMaxOutput> {
    return this.edit(input);
  }

  /**
   * Professional editing with high quality settings
   */
  async editProfessional(input: FluxProKontextMaxInput): Promise<FluxProKontextMaxOutput> {
    return this.edit(input);
  }

  /**
   * Content creation with optimized settings
   */
  async createContent(input: FluxProKontextMaxInput): Promise<FluxProKontextMaxOutput> {
    return this.edit(input);
  }

  /**
   * Design work with design-focused settings
   */
  async designWork(input: FluxProKontextMaxInput): Promise<FluxProKontextMaxOutput> {
    return this.edit(input);
  }

  /**
   * Marketing materials with marketing-optimized settings
   */
  async createMarketingMaterials(input: FluxProKontextMaxInput): Promise<FluxProKontextMaxOutput> {
    return this.edit(input);
  }

  /**
   * Creative projects with creative-focused settings
   */
  async createCreativeProject(input: FluxProKontextMaxInput): Promise<FluxProKontextMaxOutput> {
    return this.edit(input);
  }

  /**
   * High speed editing with optimized settings
   */
  async editHighSpeed(input: FluxProKontextMaxInput): Promise<FluxProKontextMaxOutput> {
    return this.edit(input);
  }

  /**
   * Frontier technology editing with advanced settings
   */
  async editFrontierTechnology(input: FluxProKontextMaxInput): Promise<FluxProKontextMaxOutput> {
    return this.edit(input);
  }

  /**
   * Advanced capabilities editing with maximum settings
   */
  async editAdvancedCapabilities(input: FluxProKontextMaxInput): Promise<FluxProKontextMaxOutput> {
    return this.edit(input);
  }

  /**
   * Square HD editing
   */
  async editSquareHd(input: FluxProKontextMaxInput & { aspect_ratio: "1:1" }): Promise<FluxProKontextMaxOutput> {
    return this.edit(input);
  }

  /**
   * Square editing
   */
  async editSquare(input: FluxProKontextMaxInput & { aspect_ratio: "1:1" }): Promise<FluxProKontextMaxOutput> {
    return this.edit(input);
  }

  /**
   * Portrait 4:3 editing
   */
  async editPortrait43(input: FluxProKontextMaxInput & { aspect_ratio: "3:4" }): Promise<FluxProKontextMaxOutput> {
    return this.edit(input);
  }

  /**
   * Portrait 16:9 editing
   */
  async editPortrait169(input: FluxProKontextMaxInput & { aspect_ratio: "9:16" }): Promise<FluxProKontextMaxOutput> {
    return this.edit(input);
  }

  /**
   * Landscape 4:3 editing
   */
  async editLandscape43(input: FluxProKontextMaxInput & { aspect_ratio: "4:3" }): Promise<FluxProKontextMaxOutput> {
    return this.edit(input);
  }

  /**
   * Landscape 16:9 editing
   */
  async editLandscape169(input: FluxProKontextMaxInput & { aspect_ratio: "16:9" }): Promise<FluxProKontextMaxOutput> {
    return this.edit(input);
  }

  /**
   * Ultra-wide 21:9 editing
   */
  async editUltraWide219(input: FluxProKontextMaxInput & { aspect_ratio: "21:9" }): Promise<FluxProKontextMaxOutput> {
    return this.edit(input);
  }

  /**
   * Ultra-wide 9:21 editing
   */
  async editUltraWide921(input: FluxProKontextMaxInput & { aspect_ratio: "9:21" }): Promise<FluxProKontextMaxOutput> {
    return this.edit(input);
  }

  /**
   * 3:2 editing
   */
  async edit32(input: FluxProKontextMaxInput & { aspect_ratio: "3:2" }): Promise<FluxProKontextMaxOutput> {
    return this.edit(input);
  }

  /**
   * 2:3 editing
   */
  async edit23(input: FluxProKontextMaxInput & { aspect_ratio: "2:3" }): Promise<FluxProKontextMaxOutput> {
    return this.edit(input);
  }

  /**
   * JPEG output editing
   */
  async editJpeg(input: FluxProKontextMaxInput & { output_format: "jpeg" }): Promise<FluxProKontextMaxOutput> {
    return this.edit(input);
  }

  /**
   * PNG output editing
   */
  async editPng(input: FluxProKontextMaxInput & { output_format: "png" }): Promise<FluxProKontextMaxOutput> {
    return this.edit(input);
  }

  /**
   * Multiple images editing
   */
  async editMultiple(input: FluxProKontextMaxInput & { num_images: number }): Promise<FluxProKontextMaxOutput> {
    return this.edit(input);
  }

  /**
   * Get cost estimate for editing
   */
  getCostEstimate(): { price: number; unit: string } {
    return {
      price: 0.08,
      unit: "per image"
    };
  }

  /**
   * Get recommended parameters for different use cases
   */
  getRecommendedParameters(useCase: "premium" | "typography" | "complex" | "professional" | "content" | "design" | "marketing" | "creative" | "high_speed" | "frontier" | "advanced") {
    const recommendations = {
      premium: { guidance_scale: 4.0, enhance_prompt: true, description: "Premium editing with enhanced guidance scale" },
      typography: { guidance_scale: 3.5, enhance_prompt: true, description: "Typography generation with text focus" },
      complex: { guidance_scale: 4.0, enhance_prompt: true, description: "Complex task handling with advanced settings" },
      professional: { guidance_scale: 3.5, enhance_prompt: true, description: "Professional editing with consistent quality" },
      content: { guidance_scale: 3.5, enhance_prompt: true, description: "Content creation with optimized settings" },
      design: { guidance_scale: 4.0, enhance_prompt: true, description: "Design work with design-focused settings" },
      marketing: { guidance_scale: 3.5, enhance_prompt: true, description: "Marketing materials with marketing-optimized settings" },
      creative: { guidance_scale: 3.0, enhance_prompt: true, description: "Creative projects with creative-focused settings" },
      high_speed: { guidance_scale: 3.0, enhance_prompt: false, description: "High speed editing with optimized settings" },
      frontier: { guidance_scale: 4.0, enhance_prompt: true, description: "Frontier technology editing with advanced settings" },
      advanced: { guidance_scale: 4.5, enhance_prompt: true, description: "Advanced capabilities editing with maximum settings" }
    };

    return recommendations[useCase];
  }

  /**
   * Get editing guide
   */
  getEditingGuide(): Array<{ aspect: string; description: string; importance: string; tips: string }> {
    return [
      { aspect: "Prompt Quality", description: "Clear, descriptive prompts for better editing results", importance: "High", tips: "Use detailed, specific prompts" },
      { aspect: "Guidance Scale", description: "Choose appropriate guidance scale for your needs", importance: "High", tips: "Higher values for more adherence to prompt" },
      { aspect: "Prompt Enhancement", description: "Use enhance_prompt for improved results", importance: "Medium", tips: "Enable for better prompt interpretation" },
      { aspect: "Aspect Ratio", description: "Select appropriate aspect ratio for your use case", importance: "Medium", tips: "Choose based on output requirements" },
      { aspect: "Safety Tolerance", description: "Use safety tolerance settings appropriately", importance: "Medium", tips: "Lower values for stricter content filtering" },
      { aspect: "Input Quality", description: "Ensure input images are high quality for best results", importance: "Medium", tips: "Use clear, high-resolution images" },
      { aspect: "Seed Control", description: "Experiment with different seeds for variations", importance: "Low", tips: "Use same seed for consistent results" },
      { aspect: "Output Format", description: "Use appropriate output format for your needs", importance: "Low", tips: "JPEG for web, PNG for transparency" }
    ];
  }

  /**
   * Get editing recommendations
   */
  getEditingRecommendations(): Array<{ editing_type: string; description: string; useCase: string; quality: string }> {
    return [
      { editing_type: "Premium Editing", description: "Premium image editing with enhanced settings", useCase: "Professional work", quality: "Premium" },
      { editing_type: "Typography Generation", description: "Typography generation with text focus", useCase: "Text-based editing", quality: "High" },
      { editing_type: "Complex Task Handling", description: "Complex task handling with advanced settings", useCase: "Complex editing tasks", quality: "Advanced" },
      { editing_type: "Professional Editing", description: "Professional editing with consistent quality", useCase: "Professional work", quality: "Professional" },
      { editing_type: "Content Creation", description: "Content creation with optimized settings", useCase: "Content creation", quality: "Optimized" },
      { editing_type: "Design Work", description: "Design work with design-focused settings", useCase: "Design work", quality: "Design-focused" },
      { editing_type: "Marketing Materials", description: "Marketing materials with marketing-optimized settings", useCase: "Marketing", quality: "Marketing-optimized" },
      { editing_type: "Creative Projects", description: "Creative projects with creative-focused settings", useCase: "Creative work", quality: "Creative" },
      { editing_type: "High Speed Editing", description: "High speed editing with optimized settings", useCase: "Quick editing", quality: "Fast" },
      { editing_type: "Frontier Technology", description: "Frontier technology editing with advanced settings", useCase: "Advanced work", quality: "Frontier" },
      { editing_type: "Advanced Capabilities", description: "Advanced capabilities editing with maximum settings", useCase: "Maximum quality", quality: "Maximum" }
    ];
  }

  /**
   * Validate input parameters
   */
  validateInput(input: FluxProKontextMaxInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.prompt) {
      errors.push("prompt is required");
    }

    if (!input.image_url) {
      errors.push("image_url is required");
    }

    if (input.guidance_scale !== undefined && input.guidance_scale <= 0) {
      errors.push("guidance_scale must be a positive number");
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

    if (input.num_images !== undefined && input.num_images < 1) {
      errors.push("num_images must be at least 1");
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
      if (scale < 2.0) return "low adherence";
      if (scale < 3.5) return "moderate adherence";
      if (scale < 5.0) return "high adherence";
      return "very high adherence";
    };

    const guidanceDesc = getGuidanceDescription(guidanceScale);

    return `Premium image editing with prompt "${prompt}" using ${guidanceDesc} guidance scale at ${aspectRatio} aspect ratio in ${outputFormat.toUpperCase()} format`;
  }

  /**
   * Calculate processing time estimate
   */
  getProcessingTimeEstimate(): { time: string; category: string } {
    return { time: "15-30 seconds", category: "fast" };
  }

  /**
   * Get optimal settings for different content types
   */
  getOptimalSettings(contentType: "premium" | "typography" | "complex" | "professional" | "content" | "design" | "marketing" | "creative" | "high_speed" | "frontier" | "advanced" | "mixed") {
    const settings = {
      premium: { guidance_scale: 4.0, enhance_prompt: true, description: "Premium editing for professional work" },
      typography: { guidance_scale: 3.5, enhance_prompt: true, description: "Typography generation for text-based editing" },
      complex: { guidance_scale: 4.0, enhance_prompt: true, description: "Complex task handling for advanced editing" },
      professional: { guidance_scale: 3.5, enhance_prompt: true, description: "Professional editing for consistent quality" },
      content: { guidance_scale: 3.5, enhance_prompt: true, description: "Content creation for optimized results" },
      design: { guidance_scale: 4.0, enhance_prompt: true, description: "Design work for design-focused results" },
      marketing: { guidance_scale: 3.5, enhance_prompt: true, description: "Marketing materials for marketing-optimized results" },
      creative: { guidance_scale: 3.0, enhance_prompt: true, description: "Creative projects for creative-focused results" },
      high_speed: { guidance_scale: 3.0, enhance_prompt: false, description: "High speed editing for quick results" },
      frontier: { guidance_scale: 4.0, enhance_prompt: true, description: "Frontier technology for advanced results" },
      advanced: { guidance_scale: 4.5, enhance_prompt: true, description: "Advanced capabilities for maximum results" },
      mixed: { guidance_scale: 3.5, enhance_prompt: true, description: "Mixed content for balanced results" }
    };

    return settings[contentType];
  }

  /**
   * Get supported resolutions for different aspect ratios
   */
  getSupportedResolutions(): Array<{ aspect_ratio: string; width: number; height: number; name: string; useCase: string }> {
    return [
      { aspect_ratio: "1:1", width: 1024, height: 1024, name: "square_hd", useCase: "High definition square" },
      { aspect_ratio: "1:1", width: 512, height: 512, name: "square", useCase: "Standard square" },
      { aspect_ratio: "3:4", width: 1024, height: 1365, name: "portrait_4_3", useCase: "Portrait 4:3" },
      { aspect_ratio: "9:16", width: 1024, height: 576, name: "portrait_16_9", useCase: "Portrait 16:9" },
      { aspect_ratio: "4:3", width: 1365, height: 1024, name: "landscape_4_3", useCase: "Landscape 4:3" },
      { aspect_ratio: "16:9", width: 576, height: 1024, name: "landscape_16_9", useCase: "Landscape 16:9" },
      { aspect_ratio: "21:9", width: 1024, height: 439, name: "ultra_wide_21_9", useCase: "Ultra-wide 21:9" },
      { aspect_ratio: "9:21", width: 439, height: 1024, name: "ultra_tall_9_21", useCase: "Ultra-tall 9:21" },
      { aspect_ratio: "3:2", width: 1024, height: 683, name: "landscape_3_2", useCase: "Landscape 3:2" },
      { aspect_ratio: "2:3", width: 683, height: 1024, name: "portrait_2_3", useCase: "Portrait 2:3" }
    ];
  }

  /**
   * Get editing tips
   */
  getEditingTips(): Array<{ tip: string; description: string; importance: string }> {
    return [
      { tip: "Clear prompts", description: "Use clear, descriptive prompts for better editing results", importance: "High" },
      { tip: "Guidance scale", description: "Choose appropriate guidance scale for your needs", importance: "High" },
      { tip: "Prompt enhancement", description: "Use enhance_prompt for improved results", importance: "High" },
      { tip: "Aspect ratio", description: "Select appropriate aspect ratio for your use case", importance: "Medium" },
      { tip: "Safety tolerance", description: "Use safety tolerance settings appropriately", importance: "Medium" },
      { tip: "Input quality", description: "Ensure input images are high quality for best results", importance: "Medium" },
      { tip: "Seed experimentation", description: "Experiment with different seeds for variations", importance: "Low" },
      { tip: "Output format", description: "Use appropriate output format for your needs", importance: "Low" }
    ];
  }

  /**
   * Get guidance scale guide
   */
  getGuidanceScaleGuide(): Array<{ scale: number; description: string; effect: string; useCase: string }> {
    return [
      { scale: 1.0, description: "Very low guidance", effect: "Minimal adherence to prompt", useCase: "Creative exploration" },
      { scale: 2.0, description: "Low guidance", effect: "Low adherence to prompt", useCase: "Creative work" },
      { scale: 3.0, description: "Moderate guidance", effect: "Moderate adherence to prompt", useCase: "Balanced editing" },
      { scale: 3.5, description: "Standard guidance", effect: "Standard adherence to prompt", useCase: "General editing" },
      { scale: 4.0, description: "High guidance", effect: "High adherence to prompt", useCase: "Precise editing" },
      { scale: 5.0, description: "Very high guidance", effect: "Very high adherence to prompt", useCase: "Maximum precision" }
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
export const falAiFluxProKontextMax = new FalAiFluxProKontextMaxExecutor();
