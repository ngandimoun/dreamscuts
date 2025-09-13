import { fal } from "@fal-ai/client";

export interface HunyuanWorldInput {
  image_url: string;
  prompt: string;
}

export interface HunyuanWorldOutput {
  image: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
    width?: number;
    height?: number;
  };
}

export class HunyuanWorldExecutor {
  private modelId = "fal-ai/hunyuan_world";

  /**
   * Create panorama from single image
   */
  async createPanorama(input: HunyuanWorldInput): Promise<HunyuanWorldOutput> {
    const result = await fal.subscribe(this.modelId, {
      input: {
        image_url: input.image_url,
        prompt: input.prompt
      }
    });

    return result.data as HunyuanWorldOutput;
  }

  /**
   * Create 3D world from image
   */
  async createWorld(input: HunyuanWorldInput): Promise<HunyuanWorldOutput> {
    return this.createPanorama(input);
  }

  /**
   * Generate immersive scene
   */
  async createImmersiveScene(input: HunyuanWorldInput): Promise<HunyuanWorldOutput> {
    return this.createPanorama(input);
  }

  /**
   * Build virtual environment
   */
  async buildVirtualEnvironment(input: HunyuanWorldInput): Promise<HunyuanWorldOutput> {
    return this.createPanorama(input);
  }

  /**
   * Get cost estimate for panorama generation
   */
  getCostEstimate(): { price: number; unit: string } {
    return {
      price: 0.15,
      unit: "per panorama image"
    };
  }

  /**
   * Get recommended prompts for different use cases
   */
  getRecommendedPrompts(useCase: "landscape" | "cityscape" | "fantasy" | "sci-fi" | "nature" | "architectural") {
    const recommendations = {
      landscape: "A breathtaking panoramic landscape with rolling hills, clear skies, and natural beauty",
      cityscape: "A modern cityscape panorama with skyscrapers, urban architecture, and city life",
      fantasy: "A magical fantasy world panorama with floating islands, mystical creatures, and enchanted forests",
      "sci-fi": "A futuristic sci-fi panorama with advanced technology, flying vehicles, and alien landscapes",
      nature: "A serene natural panorama with mountains, forests, rivers, and wildlife",
      architectural: "An architectural panorama showcasing beautiful buildings, monuments, and urban design"
    };

    return recommendations[useCase];
  }

  /**
   * Validate input parameters
   */
  validateInput(input: HunyuanWorldInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.image_url) {
      errors.push("image_url is required");
    }

    if (!input.prompt) {
      errors.push("prompt is required");
    }

    if (input.prompt && input.prompt.trim().length < 10) {
      errors.push("prompt should be descriptive (at least 10 characters)");
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get supported aspect ratios for panoramas
   */
  getSupportedAspectRatios(): Array<{ ratio: string; width: number; height: number; name: string }> {
    return [
      { ratio: "2:1", width: 1920, height: 960, name: "panorama_2_1" },
      { ratio: "3:1", width: 2880, height: 960, name: "panorama_3_1" },
      { ratio: "21:9", width: 2560, height: 1080, name: "panorama_21_9" }
    ];
  }

  /**
   * Get processing time estimate
   */
  getProcessingTimeEstimate(): string {
    return "30-60 seconds (varies based on image complexity and prompt length)";
  }
}

// Export a default instance
export const hunyuanWorld = new HunyuanWorldExecutor();
