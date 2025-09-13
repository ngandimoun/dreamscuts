import { fal } from "@fal-ai/client";

export interface ProductShotInput {
  image_url: string;
  scene_description?: string;
  ref_image_url?: string;
  optimize_description?: boolean;
  num_results?: number;
  fast?: boolean;
  placement_type?: "original" | "automatic" | "manual_placement" | "manual_padding";
  original_quality?: boolean;
  shot_size?: number[];
  manual_placement_selection?: "upper_left" | "upper_right" | "bottom_left" | "bottom_right" | "right_center" | "left_center" | "upper_center" | "bottom_center" | "center_vertical" | "center_horizontal";
  padding_values?: number[];
  sync_mode?: boolean;
}

export interface ProductShotOutput {
  images: Array<{
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
    width?: number;
    height?: number;
  }>;
}

export class FalAiBriaProductShotExecutor {
  private modelId = "fal-ai/bria/product-shot";

  /**
   * Generate product shot
   */
  async generateProductShot(input: ProductShotInput): Promise<ProductShotOutput> {
    const params = {
      image_url: input.image_url,
      scene_description: input.scene_description,
      ref_image_url: input.ref_image_url ?? "",
      optimize_description: input.optimize_description ?? true,
      num_results: input.num_results ?? 1,
      fast: input.fast ?? true,
      placement_type: input.placement_type ?? "manual_placement",
      original_quality: input.original_quality,
      shot_size: input.shot_size,
      manual_placement_selection: input.manual_placement_selection ?? "bottom_center",
      padding_values: input.padding_values,
      sync_mode: input.sync_mode
    };

    const result = await fal.subscribe(this.modelId, {
      input: params
    });

    return result.data as ProductShotOutput;
  }

  /**
   * Generate product shot with scene description
   */
  async generateProductShotWithScene(input: ProductShotInput & { scene_description: string }): Promise<ProductShotOutput> {
    return this.generateProductShot(input);
  }

  /**
   * Generate product shot with reference image
   */
  async generateProductShotWithReference(input: ProductShotInput & { ref_image_url: string }): Promise<ProductShotOutput> {
    return this.generateProductShot(input);
  }

  /**
   * Generate product shot with automatic placement
   */
  async generateProductShotAutomatic(input: ProductShotInput & { placement_type: "automatic" }): Promise<ProductShotOutput> {
    return this.generateProductShot(input);
  }

  /**
   * Generate product shot with manual placement
   */
  async generateProductShotManual(input: ProductShotInput & { 
    placement_type: "manual_placement"; 
    manual_placement_selection: "upper_left" | "upper_right" | "bottom_left" | "bottom_right" | "right_center" | "left_center" | "upper_center" | "bottom_center" | "center_vertical" | "center_horizontal";
  }): Promise<ProductShotOutput> {
    return this.generateProductShot(input);
  }

  /**
   * Generate product shot with manual padding
   */
  async generateProductShotWithPadding(input: ProductShotInput & { 
    placement_type: "manual_padding"; 
    padding_values: number[];
  }): Promise<ProductShotOutput> {
    return this.generateProductShot(input);
  }

  /**
   * Generate product shot with original placement
   */
  async generateProductShotOriginal(input: ProductShotInput & { placement_type: "original" }): Promise<ProductShotOutput> {
    return this.generateProductShot(input);
  }

  /**
   * Generate product shot with high quality settings
   */
  async generateProductShotHighQuality(input: ProductShotInput & { fast: false }): Promise<ProductShotOutput> {
    return this.generateProductShot(input);
  }

  /**
   * Generate product shot with fast settings
   */
  async generateProductShotFast(input: ProductShotInput & { fast: true }): Promise<ProductShotOutput> {
    return this.generateProductShot(input);
  }

  /**
   * Generate product shot with multiple results
   */
  async generateProductShotMultiple(input: ProductShotInput & { num_results: number }): Promise<ProductShotOutput> {
    return this.generateProductShot(input);
  }

  /**
   * Generate product shot for eCommerce
   */
  async generateProductShotEcommerce(input: ProductShotInput): Promise<ProductShotOutput> {
    return this.generateProductShot(input);
  }

  /**
   * Generate product shot for marketing
   */
  async generateProductShotMarketing(input: ProductShotInput): Promise<ProductShotOutput> {
    return this.generateProductShot(input);
  }

  /**
   * Generate product shot for advertising
   */
  async generateProductShotAdvertising(input: ProductShotInput): Promise<ProductShotOutput> {
    return this.generateProductShot(input);
  }

  /**
   * Generate product shot for commercial photography
   */
  async generateProductShotCommercial(input: ProductShotInput): Promise<ProductShotOutput> {
    return this.generateProductShot(input);
  }

  /**
   * Generate product shot for product visualization
   */
  async generateProductShotVisualization(input: ProductShotInput): Promise<ProductShotOutput> {
    return this.generateProductShot(input);
  }

  /**
   * Generate product shot with bottom center placement
   */
  async generateProductShotBottomCenter(input: ProductShotInput): Promise<ProductShotOutput> {
    return this.generateProductShot({
      ...input,
      placement_type: "manual_placement",
      manual_placement_selection: "bottom_center"
    });
  }

  /**
   * Generate product shot with center placement
   */
  async generateProductShotCenter(input: ProductShotInput): Promise<ProductShotOutput> {
    return this.generateProductShot({
      ...input,
      placement_type: "manual_placement",
      manual_placement_selection: "center_vertical"
    });
  }

  /**
   * Generate product shot with upper left placement
   */
  async generateProductShotUpperLeft(input: ProductShotInput): Promise<ProductShotOutput> {
    return this.generateProductShot({
      ...input,
      placement_type: "manual_placement",
      manual_placement_selection: "upper_left"
    });
  }

  /**
   * Generate product shot with upper right placement
   */
  async generateProductShotUpperRight(input: ProductShotInput): Promise<ProductShotOutput> {
    return this.generateProductShot({
      ...input,
      placement_type: "manual_placement",
      manual_placement_selection: "upper_right"
    });
  }

  /**
   * Generate product shot with bottom left placement
   */
  async generateProductShotBottomLeft(input: ProductShotInput): Promise<ProductShotOutput> {
    return this.generateProductShot({
      ...input,
      placement_type: "manual_placement",
      manual_placement_selection: "bottom_left"
    });
  }

  /**
   * Generate product shot with bottom right placement
   */
  async generateProductShotBottomRight(input: ProductShotInput): Promise<ProductShotOutput> {
    return this.generateProductShot({
      ...input,
      placement_type: "manual_placement",
      manual_placement_selection: "bottom_right"
    });
  }

  /**
   * Generate product shot with right center placement
   */
  async generateProductShotRightCenter(input: ProductShotInput): Promise<ProductShotOutput> {
    return this.generateProductShot({
      ...input,
      placement_type: "manual_placement",
      manual_placement_selection: "right_center"
    });
  }

  /**
   * Generate product shot with left center placement
   */
  async generateProductShotLeftCenter(input: ProductShotInput): Promise<ProductShotOutput> {
    return this.generateProductShot({
      ...input,
      placement_type: "manual_placement",
      manual_placement_selection: "left_center"
    });
  }

  /**
   * Generate product shot with upper center placement
   */
  async generateProductShotUpperCenter(input: ProductShotInput): Promise<ProductShotOutput> {
    return this.generateProductShot({
      ...input,
      placement_type: "manual_placement",
      manual_placement_selection: "upper_center"
    });
  }

  /**
   * Generate product shot with center horizontal placement
   */
  async generateProductShotCenterHorizontal(input: ProductShotInput): Promise<ProductShotOutput> {
    return this.generateProductShot({
      ...input,
      placement_type: "manual_placement",
      manual_placement_selection: "center_horizontal"
    });
  }

  /**
   * Get cost estimate for product shot
   */
  getCostEstimate(): { price: number; unit: string } {
    return {
      price: 0.04,
      unit: "per generation"
    };
  }

  /**
   * Get recommended parameters for different use cases
   */
  getRecommendedParameters(useCase: "ecommerce" | "marketing" | "advertising" | "commercial" | "visualization" | "high_quality" | "fast" | "balanced" | "conservative") {
    const recommendations = {
      ecommerce: { placement_type: "manual_placement" as const, manual_placement_selection: "bottom_center" as const, fast: true, optimize_description: true },
      marketing: { placement_type: "automatic" as const, fast: true, optimize_description: true },
      advertising: { placement_type: "automatic" as const, fast: false, optimize_description: true },
      commercial: { placement_type: "manual_placement" as const, manual_placement_selection: "center_vertical" as const, fast: false, optimize_description: true },
      visualization: { placement_type: "manual_placement" as const, manual_placement_selection: "center_vertical" as const, fast: false, optimize_description: true },
      high_quality: { placement_type: "manual_placement" as const, manual_placement_selection: "bottom_center" as const, fast: false, optimize_description: true },
      fast: { placement_type: "manual_placement" as const, manual_placement_selection: "bottom_center" as const, fast: true, optimize_description: false },
      balanced: { placement_type: "manual_placement" as const, manual_placement_selection: "bottom_center" as const, fast: true, optimize_description: true },
      conservative: { placement_type: "original" as const, fast: true, optimize_description: false }
    };

    return recommendations[useCase];
  }

  /**
   * Get placement type guide for product shot
   */
  getPlacementTypeGuide(): Array<{ type: string; description: string; useCase: string; effect: string }> {
    return [
      { type: "original", description: "Preserve original position", useCase: "Maintain product position", effect: "Keeps original product placement" },
      { type: "automatic", description: "Automatic placement", useCase: "General use", effect: "Generates 10 recommended positions" },
      { type: "manual_placement", description: "Manual placement selection", useCase: "Precise positioning", effect: "Choose from predefined positions" },
      { type: "manual_padding", description: "Manual padding control", useCase: "Custom positioning", effect: "Control position and size with padding" }
    ];
  }

  /**
   * Get manual placement guide for product shot
   */
  getManualPlacementGuide(): Array<{ placement: string; description: string; useCase: string; effect: string }> {
    return [
      { placement: "upper_left", description: "Upper left corner", useCase: "Product showcase", effect: "Places product in upper left area" },
      { placement: "upper_right", description: "Upper right corner", useCase: "Product showcase", effect: "Places product in upper right area" },
      { placement: "bottom_left", description: "Bottom left corner", useCase: "Product showcase", effect: "Places product in bottom left area" },
      { placement: "bottom_right", description: "Bottom right corner", useCase: "Product showcase", effect: "Places product in bottom right area" },
      { placement: "right_center", description: "Right center", useCase: "Side product placement", effect: "Places product on right side" },
      { placement: "left_center", description: "Left center", useCase: "Side product placement", effect: "Places product on left side" },
      { placement: "upper_center", description: "Upper center", useCase: "Top product placement", effect: "Places product at top center" },
      { placement: "bottom_center", description: "Bottom center", useCase: "Standard eCommerce", effect: "Places product at bottom center" },
      { placement: "center_vertical", description: "Center vertical", useCase: "Centered product", effect: "Places product at vertical center" },
      { placement: "center_horizontal", description: "Center horizontal", useCase: "Centered product", effect: "Places product at horizontal center" }
    ];
  }

  /**
   * Get product shot recommendations
   */
  getProductShotRecommendations(): Array<{ shot_type: string; placement_type: "original" | "automatic" | "manual_placement" | "manual_padding"; manual_placement_selection?: string; fast: boolean; description: string }> {
    return [
      { shot_type: "Standard eCommerce", placement_type: "manual_placement", manual_placement_selection: "bottom_center", fast: true, description: "Standard product shot for eCommerce" },
      { shot_type: "High Quality Commercial", placement_type: "manual_placement", manual_placement_selection: "center_vertical", fast: false, description: "High-quality product shot for commercial use" },
      { shot_type: "Automatic Placement", placement_type: "automatic", fast: true, description: "Automatic placement with multiple options" },
      { shot_type: "Original Position", placement_type: "original", fast: true, description: "Maintain original product position" },
      { shot_type: "Custom Padding", placement_type: "manual_padding", fast: true, description: "Custom positioning with padding control" },
      { shot_type: "Marketing Shot", placement_type: "automatic", fast: false, description: "Marketing-focused product shot" },
      { shot_type: "Advertising Shot", placement_type: "automatic", fast: false, description: "Advertising-focused product shot" },
      { shot_type: "Product Visualization", placement_type: "manual_placement", manual_placement_selection: "center_vertical", fast: false, description: "Product visualization shot" }
    ];
  }

  /**
   * Validate input parameters
   */
  validateInput(input: ProductShotInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.image_url) {
      errors.push("image_url is required");
    }

    const validPlacementTypes = ["original", "automatic", "manual_placement", "manual_padding"];
    if (input.placement_type && !validPlacementTypes.includes(input.placement_type)) {
      errors.push(`placement_type must be one of: ${validPlacementTypes.join(", ")}`);
    }

    const validManualPlacements = ["upper_left", "upper_right", "bottom_left", "bottom_right", "right_center", "left_center", "upper_center", "bottom_center", "center_vertical", "center_horizontal"];
    if (input.manual_placement_selection && !validManualPlacements.includes(input.manual_placement_selection)) {
      errors.push(`manual_placement_selection must be one of: ${validManualPlacements.join(", ")}`);
    }

    if (input.num_results !== undefined && input.num_results < 1) {
      errors.push("num_results must be at least 1");
    }

    if (input.shot_size && input.shot_size.length !== 2) {
      errors.push("shot_size must be an array with exactly 2 elements [width, height]");
    }

    if (input.padding_values && input.padding_values.length !== 4) {
      errors.push("padding_values must be an array with exactly 4 elements [left, right, top, bottom]");
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get effect description based on parameters
   */
  getEffectDescription(placementType: string, fast: boolean, optimizeDescription: boolean, manualPlacement?: string, sceneDescription?: string, refImageUrl?: string): string {
    const getPlacementDescription = (type: string, placement?: string): string => {
      if (type === "original") return "original position";
      if (type === "automatic") return "automatic placement";
      if (type === "manual_placement" && placement) return `manual placement (${placement})`;
      if (type === "manual_padding") return "manual padding control";
      return type;
    };

    const getQualityDescription = (fast: boolean): string => {
      return fast ? "fast processing" : "high quality processing";
    };

    const getSceneDescription = (sceneDesc?: string, refUrl?: string): string => {
      if (sceneDesc) return `with scene description: "${sceneDesc}"`;
      if (refUrl) return "with reference image";
      return "with default scene";
    };

    const placementDesc = getPlacementDescription(placementType, manualPlacement);
    const qualityDesc = getQualityDescription(fast);
    const sceneDesc = getSceneDescription(sceneDescription, refImageUrl);
    const optimizeDesc = optimizeDescription ? "with description optimization" : "without description optimization";

    return `Product shot with ${placementDesc} using ${qualityDesc} ${sceneDesc} ${optimizeDesc}`;
  }

  /**
   * Calculate processing time estimate
   */
  getProcessingTimeEstimate(fast: boolean, placementType: string): { time: string; category: string } {
    if (fast) {
      if (placementType === "automatic") {
        return { time: "20-35 seconds", category: "fast" };
      } else {
        return { time: "15-25 seconds", category: "fast" };
      }
    } else {
      if (placementType === "automatic") {
        return { time: "45-60 seconds", category: "slow" };
      } else {
        return { time: "30-45 seconds", category: "moderate" };
      }
    }
  }

  /**
   * Get optimal settings for different content types
   */
  getOptimalSettings(contentType: "ecommerce" | "marketing" | "advertising" | "commercial" | "visualization" | "mixed") {
    const settings = {
      ecommerce: { placement_type: "manual_placement" as const, manual_placement_selection: "bottom_center" as const, fast: true, optimize_description: true },
      marketing: { placement_type: "automatic" as const, fast: true, optimize_description: true },
      advertising: { placement_type: "automatic" as const, fast: false, optimize_description: true },
      commercial: { placement_type: "manual_placement" as const, manual_placement_selection: "center_vertical" as const, fast: false, optimize_description: true },
      visualization: { placement_type: "manual_placement" as const, manual_placement_selection: "center_vertical" as const, fast: false, optimize_description: true },
      mixed: { placement_type: "manual_placement" as const, manual_placement_selection: "bottom_center" as const, fast: true, optimize_description: true }
    };

    return settings[contentType];
  }

  /**
   * Get supported resolutions for different aspect ratios
   */
  getSupportedResolutions(): Array<{ aspect_ratio: string; width: number; height: number; name: string; useCase: string }> {
    return [
      { aspect_ratio: "1:1", width: 1000, height: 1000, name: "square_1_1", useCase: "Social media" },
      { aspect_ratio: "2:3", width: 1000, height: 1500, name: "portrait_2_3", useCase: "Mobile content" },
      { aspect_ratio: "3:2", width: 1500, height: 1000, name: "landscape_3_2", useCase: "Desktop content" },
      { aspect_ratio: "3:4", width: 1000, height: 1333, name: "portrait_3_4", useCase: "Mobile content" },
      { aspect_ratio: "4:3", width: 1333, height: 1000, name: "landscape_4_3", useCase: "Desktop content" },
      { aspect_ratio: "5:4", width: 1250, height: 1000, name: "landscape_5_4", useCase: "Print media" },
      { aspect_ratio: "9:16", width: 1000, height: 1778, name: "mobile_9_16", useCase: "Mobile apps" },
      { aspect_ratio: "16:9", width: 1778, height: 1000, name: "widescreen_16_9", useCase: "Video content" }
    ];
  }

  /**
   * Get product shot tips
   */
  getProductShotTips(): Array<{ tip: string; description: string; importance: string }> {
    return [
      { tip: "Clear product images", description: "Use clear, high-quality product images for best results", importance: "High" },
      { tip: "Good contrast", description: "Ensure product images have good contrast and lighting", importance: "High" },
      { tip: "Detailed descriptions", description: "Provide detailed scene descriptions for better scene generation", importance: "High" },
      { tip: "Reference images", description: "Use reference images for specific scene styles", importance: "Medium" },
      { tip: "Appropriate placement", description: "Choose appropriate placement type for your use case", importance: "Medium" },
      { tip: "Manual placement", description: "Use manual placement for precise product positioning", importance: "Medium" },
      { tip: "Fast mode", description: "Enable fast mode for quicker results", importance: "Low" },
      { tip: "Description optimization", description: "Use optimize_description for better scene descriptions", importance: "Low" }
    ];
  }
}

// Export a default instance
export const falAiBriaProductShot = new FalAiBriaProductShotExecutor();
