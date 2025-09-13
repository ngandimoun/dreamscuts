import { fal } from "@fal-ai/client";

export interface QwenImageEditInput {
  prompt: string;
  image_url: string;
  image_size?: "square_hd" | "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9" | { width: number; height: number };
  num_inference_steps?: number;
  seed?: number;
  guidance_scale?: number;
  sync_mode?: boolean;
  num_images?: number;
  enable_safety_checker?: boolean;
  output_format?: "jpeg" | "png";
  negative_prompt?: string;
  acceleration?: "none" | "regular" | "high";
}

export interface QwenImageEditOutput {
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

export class QwenImageEditExecutor {
  private modelId = "fal-ai/qwen-image-edit";

  /**
   * Edit image with text prompt
   */
  async editImage(input: QwenImageEditInput): Promise<QwenImageEditOutput> {
    const params = {
      prompt: input.prompt,
      image_url: input.image_url,
      image_size: input.image_size ?? "square_hd",
      num_inference_steps: input.num_inference_steps ?? 30,
      guidance_scale: input.guidance_scale ?? 4,
      sync_mode: input.sync_mode ?? false,
      num_images: input.num_images ?? 1,
      enable_safety_checker: input.enable_safety_checker ?? true,
      output_format: input.output_format ?? "png",
      negative_prompt: input.negative_prompt ?? " ",
      acceleration: input.acceleration ?? "none"
    };

    if (input.seed !== undefined) {
      params.seed = input.seed;
    }

    const result = await fal.subscribe(this.modelId, {
      input: params
    });

    return result.data as QwenImageEditOutput;
  }

  /**
   * Edit with custom parameters
   */
  async editWithParams(input: QwenImageEditInput & { 
    guidance_scale: number; 
    num_inference_steps: number 
  }): Promise<QwenImageEditOutput> {
    return this.editImage(input);
  }

  /**
   * Edit with acceleration
   */
  async editWithAcceleration(input: QwenImageEditInput & { acceleration: "none" | "regular" | "high" }): Promise<QwenImageEditOutput> {
    return this.editImage(input);
  }

  /**
   * Generate multiple variations
   */
  async generateVariations(input: QwenImageEditInput & { num_images: number }): Promise<QwenImageEditOutput> {
    return this.editImage(input);
  }

  /**
   * Get cost estimate for image editing
   */
  getCostEstimate(): { price: number; unit: string } {
    return {
      price: 0.03,
      unit: "per megapixel"
    };
  }

  /**
   * Get recommended parameters for different use cases
   */
  getRecommendedParameters(useCase: "quick" | "quality" | "creative" | "precise" | "fast" | "detailed") {
    const recommendations = {
      quick: { num_inference_steps: 20, guidance_scale: 3, acceleration: "regular" as const },
      quality: { num_inference_steps: 50, guidance_scale: 7, acceleration: "none" as const },
      creative: { num_inference_steps: 40, guidance_scale: 5, acceleration: "none" as const },
      precise: { num_inference_steps: 60, guidance_scale: 8, acceleration: "none" as const },
      fast: { num_inference_steps: 15, guidance_scale: 2, acceleration: "high" as const },
      detailed: { num_inference_steps: 80, guidance_scale: 10, acceleration: "none" as const }
    };

    return recommendations[useCase];
  }

  /**
   * Validate input parameters
   */
  validateInput(input: QwenImageEditInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.prompt) {
      errors.push("prompt is required");
    }

    if (!input.image_url) {
      errors.push("image_url is required");
    }

    if (input.num_inference_steps !== undefined && (input.num_inference_steps < 1 || input.num_inference_steps > 100)) {
      errors.push("num_inference_steps must be between 1 and 100");
    }

    if (input.guidance_scale !== undefined && (input.guidance_scale < 1.0 || input.guidance_scale > 20.0)) {
      errors.push("guidance_scale must be between 1.0 and 20.0");
    }

    if (input.num_images !== undefined && (input.num_images < 1 || input.num_images > 10)) {
      errors.push("num_images must be between 1 and 10");
    }

    const validAccelerations = ["none", "regular", "high"];
    if (input.acceleration && !validAccelerations.includes(input.acceleration)) {
      errors.push(`acceleration must be one of: ${validAccelerations.join(", ")}`);
    }

    const validFormats = ["jpeg", "png"];
    if (input.output_format && !validFormats.includes(input.output_format)) {
      errors.push(`output_format must be one of: ${validFormats.join(", ")}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Calculate estimated cost based on image size
   */
  calculateCost(width: number, height: number): number {
    const megapixels = (width * height) / 1000000;
    return megapixels * 0.03;
  }
}

// Export a default instance
export const qwenImageEdit = new QwenImageEditExecutor();
