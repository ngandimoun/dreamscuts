import { fal } from "@fal-ai/client";

export type PikaffectEnum = 
  | "Cake-ify" | "Crumble" | "Crush" | "Decapitate" | "Deflate" 
  | "Dissolve" | "Explode" | "Eye-pop" | "Inflate" | "Levitate" 
  | "Melt" | "Peel" | "Poke" | "Squish" | "Ta-da" | "Tear";

export interface PikaV15PikaffectsInput {
  image_url: string;
  pikaffect: PikaffectEnum;
  prompt?: string;
  negative_prompt?: string;
  seed?: number;
}

export interface PikaV15PikaffectsOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  requestId?: string;
}

export interface PikaV15PikaffectsError {
  error: string;
  message: string;
  code?: string;
}

export type PikaV15PikaffectsResult = PikaV15PikaffectsOutput | PikaV15PikaffectsError;

const MODEL_ENDPOINT = "fal-ai/pika/v1.5/pikaffects";

const DEFAULT_CONFIG = {
  negative_prompt: "",
};

export class PikaV15PikaffectsExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: apiKey });
  }

  /**
   * Generate video with Pikaffect applied
   */
  async generateVideo(input: PikaV15PikaffectsInput): Promise<PikaV15PikaffectsOutput> {
    try {
      this.validateInput(input);
      const config = this.mergeWithDefaults(input);

      const result = await fal.subscribe(MODEL_ENDPOINT, {
        input: config,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs?.forEach((log) => console.log(log.message));
          }
        },
      });

      const video = {
        url: (result as any).video?.url || "",
        content_type: (result as any).video?.content_type,
        file_name: (result as any).video?.file_name,
        file_size: (result as any).video?.file_size,
      };

      return {
        video,
        requestId: (result as any).requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Queue video generation for long-running requests
   */
  async queueVideoGeneration(input: PikaV15PikaffectsInput, webhookUrl?: string): Promise<{ requestId: string }> {
    try {
      this.validateInput(input);
      const config = this.mergeWithDefaults(input);

      const { request_id } = await fal.queue.submit(MODEL_ENDPOINT, {
        input: config,
        webhookUrl,
      });

      return { requestId: request_id };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Check the status of a queued request
   */
  async checkQueueStatus(requestId: string): Promise<any> {
    try {
      const status = await fal.queue.status(MODEL_ENDPOINT, {
        requestId,
        logs: true,
      });

      return status;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get the result of a completed queued request
   */
  async getQueueResult(requestId: string): Promise<PikaV15PikaffectsOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });
      
      const video = {
        url: (result as any).video?.url || "",
        content_type: (result as any).video?.content_type,
        file_name: (result as any).video?.file_name,
        file_size: (result as any).video?.file_size,
      };

      return {
        video,
        requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate multiple videos with different effects
   */
  async generateMultipleVideos(inputs: PikaV15PikaffectsInput[]): Promise<PikaV15PikaffectsResult[]> {
    const promises = inputs.map(input => this.generateVideo(input));
    return Promise.allSettled(promises).then(results =>
      results.map(result =>
        result.status === 'fulfilled' ? result.value : { error: 'Failed', message: result.reason?.message || 'Unknown error' }
      )
    );
  }

  /**
   * Calculate the cost for video generation
   * Fixed cost: $0.465 per video
   */
  calculateCost(): number {
    return 0.465; // Fixed cost per video
  }

  /**
   * Get available Pikaffect options
   */
  getAvailablePikaffects(): PikaffectEnum[] {
    return [
      "Cake-ify", "Crumble", "Crush", "Decapitate", "Deflate",
      "Dissolve", "Explode", "Eye-pop", "Inflate", "Levitate",
      "Melt", "Peel", "Poke", "Squish", "Ta-da", "Tear"
    ];
  }

  /**
   * Get Pikaffect categories for organization
   */
  getPikaffectCategories(): { category: string; effects: PikaffectEnum[] }[] {
    return [
      {
        category: "Destruction Effects",
        effects: ["Crush", "Crumble", "Explode", "Tear", "Decapitate"]
      },
      {
        category: "Transformation Effects",
        effects: ["Cake-ify", "Melt", "Dissolve", "Peel"]
      },
      {
        category: "Size Effects",
        effects: ["Inflate", "Deflate", "Squish"]
      },
      {
        category: "Movement Effects",
        effects: ["Levitate", "Eye-pop", "Poke"]
      },
      {
        category: "Special Effects",
        effects: ["Ta-da"]
      }
    ];
  }

  /**
   * Get model capabilities and information
   */
  getModelInfo() {
    return {
      name: "Pika v1.5 Pikaffects",
      version: "v1.5",
      provider: "Pika (via fal.ai)",
      endpoint: MODEL_ENDPOINT,
      capabilities: {
        inputTypes: ["image_url", "pikaffect"],
        outputFormat: "MP4",
        effectTypes: "16 predefined Pikaffects",
        supportsPrompts: true,
        supportsNegativePrompts: true,
        supportsSeedControl: true,
        quality: "AI-powered video effects for fun and engaging content",
      },
      pricing: {
        cost: 0.465,
        currency: "USD",
        billingModel: "per_video",
        notes: "Fixed cost of $0.465 per video regardless of effect complexity"
      },
      features: {
        pikaffects: "16 predefined AI-powered video effects",
        imageInput: "Transform static images into dynamic videos",
        promptGuidance: "Text prompts guide effect application",
        negativePrompts: "Avoid unwanted elements with negative prompts",
        seedControl: "Reproducible results with seed values",
        funEngaging: "Designed for fun, engaging, and visually compelling content"
      },
    };
  }

  /**
   * Get optimal settings for different use cases
   */
  getOptimalSettings(useCase: string): Partial<PikaV15PikaffectsInput> {
    switch (useCase.toLowerCase()) {
      case "destruction":
        return {
          pikaffect: "Crush",
          prompt: "Dramatic destruction effect",
        };
      case "transformation":
        return {
          pikaffect: "Cake-ify",
          prompt: "Magical transformation effect",
        };
      case "size_change":
        return {
          pikaffect: "Inflate",
          prompt: "Dramatic size increase",
        };
      case "movement":
        return {
          pikaffect: "Levitate",
          prompt: "Smooth floating motion",
        };
      case "fun":
        return {
          pikaffect: "Ta-da",
          prompt: "Celebratory reveal effect",
        };
      default:
        return DEFAULT_CONFIG;
    }
  }

  /**
   * Get cost comparison for different effects
   */
  getCostComparison(): { effect: string; cost: number; category: string; bestFor: string }[] {
    return [
      {
        effect: "Crush",
        cost: 0.465,
        category: "Destruction",
        bestFor: "Action scenes, dramatic content, destruction effects"
      },
      {
        effect: "Cake-ify",
        cost: 0.465,
        category: "Transformation",
        bestFor: "Fun content, magical transformations, entertainment"
      },
      {
        effect: "Levitate",
        cost: 0.465,
        category: "Movement",
        bestFor: "Floating effects, supernatural content, smooth motion"
      },
      {
        effect: "Ta-da",
        cost: 0.465,
        category: "Special",
        bestFor: "Reveals, celebrations, magical moments"
      }
    ];
  }

  /**
   * Validate if a Pikaffect is supported
   */
  isPikaffectSupported(pikaffect: string): boolean {
    return this.getAvailablePikaffects().includes(pikaffect as PikaffectEnum);
  }

  /**
   * Get prompt optimization tips for better effect generation
   */
  getPromptOptimizationTips(): string[] {
    return [
      "Be specific about the effect intensity and style",
      "Describe the desired emotional impact",
      "Include details about timing and motion",
      "Specify the relationship between effect and subject",
      "Use descriptive language for visual elements",
      "Consider the context of the original image",
      "Keep prompts concise but descriptive",
      "Use action verbs to describe desired effects"
    ];
  }

  /**
   * Get negative prompt suggestions for common use cases
   */
  getNegativePromptSuggestions(): string[] {
    return [
      "blurry, low quality, distorted, deformed",
      "watermark, text, logo, signature",
      "multiple people, crowd, group",
      "nude, inappropriate, adult content",
      "cartoon, anime, illustration, painting",
      "black and white, monochrome",
      "fast motion, rapid movement, jittery"
    ];
  }

  /**
   * Get example prompts for different Pikaffects
   */
  getExamplePrompts(): { effect: PikaffectEnum; prompt: string; description: string }[] {
    return [
      {
        effect: "Crush",
        prompt: "A duck getting crushed with dramatic impact",
        description: "Destruction effect with impact emphasis"
      },
      {
        effect: "Cake-ify",
        prompt: "Magical transformation into delicious cake",
        description: "Fun transformation effect"
      },
      {
        effect: "Levitate",
        prompt: "Smooth floating motion with gentle breeze",
        description: "Peaceful floating effect"
      },
      {
        effect: "Ta-da",
        prompt: "Celebratory reveal with sparkles and magic",
        description: "Magical reveal effect"
      }
    ];
  }

  /**
   * Get recommended Pikaffects for different image types
   */
  getRecommendedPikaffects(imageType: string): PikaffectEnum[] {
    switch (imageType.toLowerCase()) {
      case "portrait":
        return ["Eye-pop", "Inflate", "Deflate", "Ta-da"];
      case "animal":
        return ["Crush", "Cake-ify", "Levitate", "Squish"];
      case "object":
        return ["Crumble", "Melt", "Dissolve", "Peel"];
      case "landscape":
        return ["Levitate", "Explode", "Dissolve", "Ta-da"];
      case "food":
        return ["Cake-ify", "Melt", "Squish", "Ta-da"];
      default:
        return ["Ta-da", "Levitate", "Inflate", "Crush"];
    }
  }

  private validateInput(input: PikaV15PikaffectsInput): void {
    if (!input.image_url || input.image_url.trim().length === 0) {
      throw new Error("Image URL is required");
    }

    if (!input.pikaffect || !this.isPikaffectSupported(input.pikaffect)) {
      throw new Error(`Pikaffect must be one of: ${this.getAvailablePikaffects().join(", ")}`);
    }

    if (input.prompt && input.prompt.length > 1000) {
      throw new Error("Prompt must be under 1000 characters");
    }

    if (input.negative_prompt && input.negative_prompt.length > 1000) {
      throw new Error("Negative prompt must be under 1000 characters");
    }

    if (input.seed !== undefined && (input.seed < 0 || input.seed > 2147483647)) {
      throw new Error("Seed must be between 0 and 2147483647");
    }
  }

  private mergeWithDefaults(input: PikaV15PikaffectsInput): PikaV15PikaffectsInput {
    return {
      ...DEFAULT_CONFIG,
      ...input,
    };
  }

  private handleError(error: any): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error(typeof error === 'string' ? error : 'Unknown error occurred');
  }
}

export const createPikaV15PikaffectsExecutor = (apiKey: string) =>
  new PikaV15PikaffectsExecutor(apiKey);
