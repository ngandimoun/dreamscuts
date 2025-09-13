import { fal } from "@fal-ai/client";

export interface IdeogramRemixInput {
  prompt: string;
  image_url: string;
  rendering_speed?: "TURBO" | "BALANCED" | "QUALITY";
  strength?: number;
  image_size?: "square_hd" | "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9" | { width: number; height: number };
  expand_prompt?: boolean;
  num_images?: number;
  seed?: number;
  negative_prompt?: string;
  sync_mode?: boolean;
}

export interface IdeogramRemixOutput {
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

export class FalAiIdeogramV3RemixExecutor {
  private modelId = "fal-ai/ideogram/v3/remix";

  /**
   * Remix image with prompt
   */
  async remix(input: IdeogramRemixInput): Promise<IdeogramRemixOutput> {
    const params = {
      prompt: input.prompt,
      image_url: input.image_url,
      rendering_speed: input.rendering_speed ?? "BALANCED",
      strength: input.strength ?? 0.8,
      image_size: input.image_size ?? "square_hd",
      expand_prompt: input.expand_prompt ?? true,
      num_images: input.num_images ?? 1,
      seed: input.seed,
      negative_prompt: input.negative_prompt ?? "",
      sync_mode: input.sync_mode
    };

    const result = await fal.subscribe(this.modelId, {
      input: params
    });

    return result.data as IdeogramRemixOutput;
  }

  /**
   * Fast remix with TURBO speed
   */
  async remixTurbo(input: IdeogramRemixInput & { rendering_speed: "TURBO" }): Promise<IdeogramRemixOutput> {
    return this.remix(input);
  }

  /**
   * Balanced remix with BALANCED speed
   */
  async remixBalanced(input: IdeogramRemixInput & { rendering_speed: "BALANCED" }): Promise<IdeogramRemixOutput> {
    return this.remix(input);
  }

  /**
   * High quality remix with QUALITY speed
   */
  async remixQuality(input: IdeogramRemixInput & { rendering_speed: "QUALITY" }): Promise<IdeogramRemixOutput> {
    return this.remix(input);
  }

  /**
   * Creative remix with custom strength
   */
  async remixCreative(input: IdeogramRemixInput & { strength: number }): Promise<IdeogramRemixOutput> {
    return this.remix(input);
  }

  /**
   * Multiple images remix
   */
  async remixMultiple(input: IdeogramRemixInput & { num_images: number }): Promise<IdeogramRemixOutput> {
    return this.remix(input);
  }

  /**
   * Artistic transformation remix
   */
  async remixArtistic(input: IdeogramRemixInput): Promise<IdeogramRemixOutput> {
    return this.remix(input);
  }

  /**
   * Style adaptation remix
   */
  async remixStyleAdaptation(input: IdeogramRemixInput): Promise<IdeogramRemixOutput> {
    return this.remix(input);
  }

  /**
   * Content creation remix
   */
  async remixContentCreation(input: IdeogramRemixInput): Promise<IdeogramRemixOutput> {
    return this.remix(input);
  }

  /**
   * Design variation remix
   */
  async remixDesignVariation(input: IdeogramRemixInput): Promise<IdeogramRemixOutput> {
    return this.remix(input);
  }

  /**
   * Creative exploration remix
   */
  async remixCreativeExploration(input: IdeogramRemixInput): Promise<IdeogramRemixOutput> {
    return this.remix(input);
  }

  /**
   * Image enhancement remix
   */
  async remixImageEnhancement(input: IdeogramRemixInput): Promise<IdeogramRemixOutput> {
    return this.remix(input);
  }

  /**
   * Square HD remix
   */
  async remixSquareHd(input: IdeogramRemixInput & { image_size: "square_hd" }): Promise<IdeogramRemixOutput> {
    return this.remix(input);
  }

  /**
   * Square remix
   */
  async remixSquare(input: IdeogramRemixInput & { image_size: "square" }): Promise<IdeogramRemixOutput> {
    return this.remix(input);
  }

  /**
   * Portrait 4:3 remix
   */
  async remixPortrait43(input: IdeogramRemixInput & { image_size: "portrait_4_3" }): Promise<IdeogramRemixOutput> {
    return this.remix(input);
  }

  /**
   * Portrait 16:9 remix
   */
  async remixPortrait169(input: IdeogramRemixInput & { image_size: "portrait_16_9" }): Promise<IdeogramRemixOutput> {
    return this.remix(input);
  }

  /**
   * Landscape 4:3 remix
   */
  async remixLandscape43(input: IdeogramRemixInput & { image_size: "landscape_4_3" }): Promise<IdeogramRemixOutput> {
    return this.remix(input);
  }

  /**
   * Landscape 16:9 remix
   */
  async remixLandscape169(input: IdeogramRemixInput & { image_size: "landscape_16_9" }): Promise<IdeogramRemixOutput> {
    return this.remix(input);
  }

  /**
   * Custom size remix
   */
  async remixCustomSize(input: IdeogramRemixInput & { image_size: { width: number; height: number } }): Promise<IdeogramRemixOutput> {
    return this.remix(input);
  }

  /**
   * Get cost estimate for remix
   */
  getCostEstimate(renderingSpeed: "TURBO" | "BALANCED" | "QUALITY" = "BALANCED"): { price: number; unit: string } {
    const costs = {
      TURBO: 0.03,
      BALANCED: 0.06,
      QUALITY: 0.09
    };

    return {
      price: costs[renderingSpeed],
      unit: "per generation"
    };
  }

  /**
   * Get recommended parameters for different use cases
   */
  getRecommendedParameters(useCase: "fast" | "balanced" | "quality" | "creative" | "artistic" | "content" | "design" | "exploration" | "enhancement") {
    const recommendations = {
      fast: { rendering_speed: "TURBO" as const, strength: 0.8, expand_prompt: true, description: "Fast remix with TURBO speed" },
      balanced: { rendering_speed: "BALANCED" as const, strength: 0.8, expand_prompt: true, description: "Balanced remix with BALANCED speed" },
      quality: { rendering_speed: "QUALITY" as const, strength: 0.8, expand_prompt: true, description: "High quality remix with QUALITY speed" },
      creative: { rendering_speed: "BALANCED" as const, strength: 0.6, expand_prompt: true, description: "Creative remix with lower strength" },
      artistic: { rendering_speed: "QUALITY" as const, strength: 0.7, expand_prompt: true, description: "Artistic transformation with high quality" },
      content: { rendering_speed: "BALANCED" as const, strength: 0.8, expand_prompt: true, description: "Content creation with balanced settings" },
      design: { rendering_speed: "QUALITY" as const, strength: 0.8, expand_prompt: true, description: "Design variation with high quality" },
      exploration: { rendering_speed: "BALANCED" as const, strength: 0.5, expand_prompt: true, description: "Creative exploration with lower strength" },
      enhancement: { rendering_speed: "QUALITY" as const, strength: 0.9, expand_prompt: true, description: "Image enhancement with high strength" }
    };

    return recommendations[useCase];
  }

  /**
   * Get remix guide
   */
  getRemixGuide(): Array<{ aspect: string; description: string; importance: string; tips: string }> {
    return [
      { aspect: "Prompt Quality", description: "Clear, descriptive prompts for better remix results", importance: "High", tips: "Use detailed, specific prompts" },
      { aspect: "Rendering Speed", description: "Choose appropriate rendering speed for your needs", importance: "High", tips: "TURBO for speed, QUALITY for best results" },
      { aspect: "Strength Control", description: "Adjust strength parameter to control image influence", importance: "Medium", tips: "Lower values for more creative changes" },
      { aspect: "Prompt Expansion", description: "Use expand_prompt for enhanced prompt processing", importance: "Medium", tips: "Enable for better prompt interpretation" },
      { aspect: "Image Size", description: "Select appropriate image size for your use case", importance: "Medium", tips: "Choose based on output requirements" },
      { aspect: "Negative Prompts", description: "Use negative prompts to exclude unwanted elements", importance: "Medium", tips: "Specify what you don't want" },
      { aspect: "Seed Control", description: "Experiment with different seeds for variations", importance: "Low", tips: "Use same seed for consistent results" },
      { aspect: "Input Quality", description: "Ensure input images are high quality for best results", importance: "Low", tips: "Use clear, high-resolution images" }
    ];
  }

  /**
   * Get remix recommendations
   */
  getRemixRecommendations(): Array<{ remix_type: string; description: string; useCase: string; quality: string }> {
    return [
      { remix_type: "Fast Remix", description: "Fast image remix with TURBO speed", useCase: "Quick iterations", quality: "Fast" },
      { remix_type: "Balanced Remix", description: "Balanced image remix with BALANCED speed", useCase: "General use", quality: "Balanced" },
      { remix_type: "Quality Remix", description: "High quality image remix with QUALITY speed", useCase: "Final output", quality: "High" },
      { remix_type: "Creative Remix", description: "Creative variation with custom strength", useCase: "Creative exploration", quality: "Creative" },
      { remix_type: "Artistic Remix", description: "Artistic transformation remix", useCase: "Artistic work", quality: "Artistic" },
      { remix_type: "Content Remix", description: "Content creation remix", useCase: "Content creation", quality: "Content" },
      { remix_type: "Design Remix", description: "Design variation remix", useCase: "Design work", quality: "Design" },
      { remix_type: "Exploration Remix", description: "Creative exploration remix", useCase: "Creative exploration", quality: "Exploration" },
      { remix_type: "Enhancement Remix", description: "Image enhancement remix", useCase: "Image enhancement", quality: "Enhancement" }
    ];
  }

  /**
   * Validate input parameters
   */
  validateInput(input: IdeogramRemixInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.prompt) {
      errors.push("prompt is required");
    }

    if (!input.image_url) {
      errors.push("image_url is required");
    }

    const validRenderingSpeeds = ["TURBO", "BALANCED", "QUALITY"];
    if (input.rendering_speed && !validRenderingSpeeds.includes(input.rendering_speed)) {
      errors.push(`rendering_speed must be one of: ${validRenderingSpeeds.join(", ")}`);
    }

    if (input.strength !== undefined && (input.strength < 0 || input.strength > 1)) {
      errors.push("strength must be between 0 and 1");
    }

    const validImageSizes = ["square_hd", "square", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"];
    if (typeof input.image_size === "string" && !validImageSizes.includes(input.image_size)) {
      errors.push(`image_size must be one of: ${validImageSizes.join(", ")}`);
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
  getEffectDescription(prompt: string, renderingSpeed: string, strength: number, imageSize: string): string {
    const getSpeedDescription = (speed: string): string => {
      if (speed === "TURBO") return "fast processing";
      if (speed === "BALANCED") return "balanced processing";
      if (speed === "QUALITY") return "high quality processing";
      return speed;
    };

    const getStrengthDescription = (str: number): string => {
      if (str < 0.3) return "highly creative";
      if (str < 0.6) return "creative";
      if (str < 0.8) return "moderate";
      return "preservative";
    };

    const speedDesc = getSpeedDescription(renderingSpeed);
    const strengthDesc = getStrengthDescription(strength);

    return `Image remix with prompt "${prompt}" using ${speedDesc} with ${strengthDesc} strength at ${imageSize} resolution`;
  }

  /**
   * Calculate processing time estimate
   */
  getProcessingTimeEstimate(renderingSpeed: string): { time: string; category: string } {
    const timeEstimates = {
      TURBO: { time: "10-20 seconds", category: "fast" },
      BALANCED: { time: "20-40 seconds", category: "moderate" },
      QUALITY: { time: "40-60 seconds", category: "slow" }
    };

    return timeEstimates[renderingSpeed as keyof typeof timeEstimates] || { time: "20-40 seconds", category: "moderate" };
  }

  /**
   * Get optimal settings for different content types
   */
  getOptimalSettings(contentType: "fast" | "balanced" | "quality" | "creative" | "artistic" | "content" | "design" | "exploration" | "enhancement" | "mixed") {
    const settings = {
      fast: { rendering_speed: "TURBO" as const, strength: 0.8, expand_prompt: true, description: "Fast processing for quick iterations" },
      balanced: { rendering_speed: "BALANCED" as const, strength: 0.8, expand_prompt: true, description: "Balanced processing for general use" },
      quality: { rendering_speed: "QUALITY" as const, strength: 0.8, expand_prompt: true, description: "High quality processing for final output" },
      creative: { rendering_speed: "BALANCED" as const, strength: 0.6, expand_prompt: true, description: "Creative processing with lower strength" },
      artistic: { rendering_speed: "QUALITY" as const, strength: 0.7, expand_prompt: true, description: "Artistic processing with high quality" },
      content: { rendering_speed: "BALANCED" as const, strength: 0.8, expand_prompt: true, description: "Content processing with balanced settings" },
      design: { rendering_speed: "QUALITY" as const, strength: 0.8, expand_prompt: true, description: "Design processing with high quality" },
      exploration: { rendering_speed: "BALANCED" as const, strength: 0.5, expand_prompt: true, description: "Exploration processing with lower strength" },
      enhancement: { rendering_speed: "QUALITY" as const, strength: 0.9, expand_prompt: true, description: "Enhancement processing with high strength" },
      mixed: { rendering_speed: "BALANCED" as const, strength: 0.8, expand_prompt: true, description: "Mixed processing with balanced settings" }
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
      { aspect_ratio: "16:9", width: 576, height: 1024, name: "landscape_16_9", useCase: "Landscape 16:9" }
    ];
  }

  /**
   * Get remix tips
   */
  getRemixTips(): Array<{ tip: string; description: string; importance: string }> {
    return [
      { tip: "Clear prompts", description: "Use clear, descriptive prompts for better remix results", importance: "High" },
      { tip: "Rendering speed", description: "Choose appropriate rendering speed for your needs", importance: "High" },
      { tip: "Strength control", description: "Adjust strength parameter to control image influence", importance: "High" },
      { tip: "Prompt expansion", description: "Use expand_prompt for enhanced prompt processing", importance: "Medium" },
      { tip: "Image size", description: "Select appropriate image size for your use case", importance: "Medium" },
      { tip: "Negative prompts", description: "Use negative prompts to exclude unwanted elements", importance: "Medium" },
      { tip: "Seed experimentation", description: "Experiment with different seeds for variations", importance: "Low" },
      { tip: "Input quality", description: "Ensure input images are high quality for best results", importance: "Low" }
    ];
  }

  /**
   * Get rendering speed guide
   */
  getRenderingSpeedGuide(): Array<{ speed: string; description: string; useCase: string; cost: number; time: string }> {
    return [
      { speed: "TURBO", description: "Fastest processing speed", useCase: "Quick iterations and testing", cost: 0.03, time: "10-20 seconds" },
      { speed: "BALANCED", description: "Balanced speed and quality", useCase: "General use and production", cost: 0.06, time: "20-40 seconds" },
      { speed: "QUALITY", description: "Highest quality output", useCase: "Final output and premium content", cost: 0.09, time: "40-60 seconds" }
    ];
  }

  /**
   * Get strength guide
   */
  getStrengthGuide(): Array<{ strength: number; description: string; effect: string; useCase: string }> {
    return [
      { strength: 0.1, description: "Very low strength", effect: "Minimal changes to original image", useCase: "Subtle enhancements" },
      { strength: 0.3, description: "Low strength", effect: "Minor creative changes", useCase: "Gentle modifications" },
      { strength: 0.5, description: "Medium strength", effect: "Balanced changes", useCase: "Moderate transformations" },
      { strength: 0.7, description: "High strength", effect: "Significant creative changes", useCase: "Creative transformations" },
      { strength: 0.9, description: "Very high strength", effect: "Major creative changes", useCase: "Dramatic transformations" },
      { strength: 1.0, description: "Maximum strength", effect: "Maximum creative changes", useCase: "Complete transformations" }
    ];
  }

  /**
   * Get image size guide
   */
  getImageSizeGuide(): Array<{ size: string; width: number; height: number; aspect_ratio: string; useCase: string }> {
    return [
      { size: "square_hd", width: 1024, height: 1024, aspect_ratio: "1:1", useCase: "High definition square images" },
      { size: "square", width: 512, height: 512, aspect_ratio: "1:1", useCase: "Standard square images" },
      { size: "portrait_4_3", width: 1024, height: 1365, aspect_ratio: "3:4", useCase: "Portrait images with 4:3 aspect ratio" },
      { size: "portrait_16_9", width: 1024, height: 576, aspect_ratio: "9:16", useCase: "Portrait images with 16:9 aspect ratio" },
      { size: "landscape_4_3", width: 1365, height: 1024, aspect_ratio: "4:3", useCase: "Landscape images with 4:3 aspect ratio" },
      { size: "landscape_16_9", width: 576, height: 1024, aspect_ratio: "16:9", useCase: "Landscape images with 16:9 aspect ratio" }
    ];
  }
}

// Export a default instance
export const falAiIdeogramV3Remix = new FalAiIdeogramV3RemixExecutor();
