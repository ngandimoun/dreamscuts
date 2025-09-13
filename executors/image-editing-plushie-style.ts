import { fal } from "@fal-ai/client";

export interface PlushieStyleInput {
  image_url: string;
  guidance_scale?: number;
  num_inference_steps?: number;
  enable_safety_checker?: boolean;
  lora_scale?: number;
  seed?: number;
  sync_mode?: boolean;
}

export interface PlushieStyleOutput {
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

export class ImageEditingPlushieStyleExecutor {
  private modelId = "fal-ai/image-editing/plushie-style";

  /**
   * Convert image to plushie style
   */
  async convertToPlushie(input: PlushieStyleInput): Promise<PlushieStyleOutput> {
    const params = {
      image_url: input.image_url,
      guidance_scale: input.guidance_scale ?? 3.5,
      num_inference_steps: input.num_inference_steps ?? 30,
      enable_safety_checker: input.enable_safety_checker ?? true,
      lora_scale: input.lora_scale ?? 1,
      seed: input.seed,
      sync_mode: input.sync_mode
    };

    const result = await fal.subscribe(this.modelId, {
      input: params
    });

    return result.data as PlushieStyleOutput;
  }

  /**
   * Convert with custom guidance scale
   */
  async convertWithGuidance(input: PlushieStyleInput & { guidance_scale: number }): Promise<PlushieStyleOutput> {
    return this.convertToPlushie(input);
  }

  /**
   * Convert with high quality settings
   */
  async convertHighQuality(input: PlushieStyleInput & { 
    num_inference_steps: number; 
    guidance_scale: number 
  }): Promise<PlushieStyleOutput> {
    return this.convertToPlushie(input);
  }

  /**
   * Convert with custom LoRA scale
   */
  async convertWithLora(input: PlushieStyleInput & { lora_scale: number }): Promise<PlushieStyleOutput> {
    return this.convertToPlushie(input);
  }

  /**
   * Convert with all custom parameters
   */
  async convertAdvanced(input: PlushieStyleInput & {
    guidance_scale: number;
    num_inference_steps: number;
    lora_scale: number;
    seed: number;
  }): Promise<PlushieStyleOutput> {
    return this.convertToPlushie(input);
  }

  /**
   * Get cost estimate for plushie style conversion
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
  getRecommendedParameters(useCase: "standard" | "high_quality" | "subtle" | "strong" | "fast" | "detailed" | "balanced" | "artistic") {
    const recommendations = {
      standard: { guidance_scale: 3.5, num_inference_steps: 30, lora_scale: 1 },
      high_quality: { guidance_scale: 4.0, num_inference_steps: 40, lora_scale: 1 },
      subtle: { guidance_scale: 2.5, num_inference_steps: 25, lora_scale: 0.8 },
      strong: { guidance_scale: 5.0, num_inference_steps: 35, lora_scale: 1.2 },
      fast: { guidance_scale: 3.0, num_inference_steps: 20, lora_scale: 1 },
      detailed: { guidance_scale: 4.5, num_inference_steps: 45, lora_scale: 1.1 },
      balanced: { guidance_scale: 3.5, num_inference_steps: 30, lora_scale: 1 },
      artistic: { guidance_scale: 4.2, num_inference_steps: 38, lora_scale: 1.3 }
    };

    return recommendations[useCase];
  }

  /**
   * Get guidance scale recommendations
   */
  getGuidanceScaleGuide(): Array<{ range: string; effect: string; useCase: string }> {
    return [
      { range: "1.0-2.5", effect: "Very subtle plushie effect", useCase: "Minimal transformation" },
      { range: "2.5-3.5", effect: "Balanced plushie style", useCase: "Standard conversion" },
      { range: "3.5-4.5", effect: "Strong plushie aesthetic", useCase: "Prominent plushie effect" },
      { range: "4.5-6.0", effect: "Very strong plushie style", useCase: "Maximum plushie transformation" },
      { range: "6.0-10.0", effect: "Extreme plushie effect", useCase: "Experimental/artistic use" }
    ];
  }

  /**
   * Get inference steps recommendations
   */
  getInferenceStepsGuide(): Array<{ steps: string; quality: string; speed: string; useCase: string }> {
    return [
      { steps: "10-20", quality: "Fast", speed: "Very fast", useCase: "Quick previews" },
      { steps: "20-30", quality: "Good", speed: "Fast", useCase: "Standard processing" },
      { steps: "30-40", quality: "High", speed: "Moderate", useCase: "Quality results" },
      { steps: "40-50", quality: "Very high", speed: "Slow", useCase: "Maximum quality" }
    ];
  }

  /**
   * Get LoRA scale recommendations
   */
  getLoraScaleGuide(): Array<{ scale: string; effect: string; useCase: string }> {
    return [
      { scale: "0.1-0.5", effect: "Very subtle LoRA influence", useCase: "Minimal style change" },
      { scale: "0.5-0.8", effect: "Reduced LoRA effect", useCase: "Softer plushie style" },
      { scale: "0.8-1.2", effect: "Standard LoRA effect", useCase: "Balanced transformation" },
      { scale: "1.2-1.5", effect: "Enhanced LoRA effect", useCase: "Stronger plushie style" },
      { scale: "1.5-2.0", effect: "Maximum LoRA effect", useCase: "Intense plushie transformation" }
    ];
  }

  /**
   * Validate input parameters
   */
  validateInput(input: PlushieStyleInput): { valid: boolean; errors: string[] } {
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

    if (input.lora_scale !== undefined && (input.lora_scale < 0.1 || input.lora_scale > 2.0)) {
      errors.push("lora_scale must be between 0.1 and 2.0");
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get effect description based on parameters
   */
  getEffectDescription(guidanceScale: number, inferenceSteps: number, loraScale: number): string {
    const getGuidanceDescription = (scale: number): string => {
      if (scale < 2.5) return "subtle";
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

    const getLoraDescription = (scale: number): string => {
      if (scale < 0.5) return "minimal";
      if (scale < 0.8) return "reduced";
      if (scale < 1.2) return "standard";
      if (scale < 1.5) return "enhanced";
      return "maximum";
    };

    const guidanceDesc = getGuidanceDescription(guidanceScale);
    const qualityDesc = getQualityDescription(inferenceSteps);
    const loraDesc = getLoraDescription(loraScale);

    return `${guidanceDesc} plushie style with ${qualityDesc} quality and ${loraDesc} LoRA effect (guidance: ${guidanceScale}, steps: ${inferenceSteps}, LoRA: ${loraScale})`;
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
   * Get optimal settings for different image types
   */
  getOptimalSettings(imageType: "portrait" | "full_body" | "group" | "object" | "animal" | "character") {
    const settings = {
      portrait: { guidance_scale: 3.5, num_inference_steps: 30, lora_scale: 1, aspect_ratio: "1:1" },
      full_body: { guidance_scale: 4.0, num_inference_steps: 35, lora_scale: 1.1, aspect_ratio: "3:4" },
      group: { guidance_scale: 3.8, num_inference_steps: 32, lora_scale: 1, aspect_ratio: "16:9" },
      object: { guidance_scale: 3.2, num_inference_steps: 28, lora_scale: 0.9, aspect_ratio: "1:1" },
      animal: { guidance_scale: 4.2, num_inference_steps: 38, lora_scale: 1.2, aspect_ratio: "4:3" },
      character: { guidance_scale: 3.7, num_inference_steps: 33, lora_scale: 1.05, aspect_ratio: "1:1" }
    };

    return settings[imageType];
  }
}

// Export a default instance
export const imageEditingPlushieStyle = new ImageEditingPlushieStyleExecutor();
