import { fal } from "@fal-ai/client";

export interface VeedAvatarsTextToVideoInput {
  avatar_id: "emily_vertical_primary" | "emily_vertical_secondary" | "marcus_vertical_primary" | "marcus_vertical_secondary" | "mira_vertical_primary" | "mira_vertical_secondary" | "jasmine_vertical_primary" | "jasmine_vertical_secondary" | "jasmine_vertical_walking" | "aisha_vertical_walking" | "elena_vertical_primary" | "elena_vertical_secondary" | "any_male_vertical_primary" | "any_female_vertical_primary" | "any_male_vertical_secondary" | "any_female_vertical_secondary" | "any_female_vertical_walking" | "emily_primary" | "emily_side" | "marcus_primary" | "marcus_side" | "aisha_walking" | "elena_primary" | "elena_side" | "any_male_primary" | "any_female_primary" | "any_male_side" | "any_female_side";
  text: string;
}

export interface VeedAvatarsTextToVideoOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  requestId?: string;
}

export interface VeedAvatarsTextToVideoError {
  error: string;
  message: string;
  code?: string;
}

export type VeedAvatarsTextToVideoResult = VeedAvatarsTextToVideoOutput | VeedAvatarsTextToVideoError;

const MODEL_ENDPOINT = "veed/avatars/text-to-video";

const DEFAULT_CONFIG = {
  avatar_id: "emily_vertical_primary" as const,
};

export class VeedAvatarsTextToVideoExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: apiKey });
  }

  /**
   * Generate UGC-like avatar video from text input
   */
  async generateVideo(input: VeedAvatarsTextToVideoInput): Promise<VeedAvatarsTextToVideoOutput> {
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
  async queueVideoGeneration(input: VeedAvatarsTextToVideoInput, webhookUrl?: string): Promise<{ requestId: string }> {
    try {
      this.validateInput(input);
      const config = this.mergeWithDefaults(input);

      const { request_id } = await fal.queue.submit(MODEL_ENDPOINT, {
        input: config,

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
  async getQueueResult(requestId: string): Promise<VeedAvatarsTextToVideoOutput> {
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
   * Generate multiple videos from different inputs
   */
  async generateMultipleVideos(inputs: VeedAvatarsTextToVideoInput[]): Promise<VeedAvatarsTextToVideoResult[]> {
    const promises = inputs.map(input => this.generateVideo(input));
    return Promise.allSettled(promises).then(results =>
      results.map(result =>
        result.status === 'fulfilled' ? result.value : { error: 'Failed', message: result.reason?.message || 'Unknown error' }
      )
    );
  }

  /**
   * Calculate the cost for video generation based on duration
   * Cost: $0.35 per minute
   */
  calculateCost(durationMinutes: number = 1): number {
    const costPerMinute = 0.35;
    return costPerMinute * durationMinutes;
  }

  /**
   * Get available avatar options
   */
  getAvailableAvatars(): string[] {
    return [
      "emily_vertical_primary", "emily_vertical_secondary", "marcus_vertical_primary", "marcus_vertical_secondary",
      "mira_vertical_primary", "mira_vertical_secondary", "jasmine_vertical_primary", "jasmine_vertical_secondary",
      "jasmine_vertical_walking", "aisha_vertical_walking", "elena_vertical_primary", "elena_vertical_secondary",
      "any_male_vertical_primary", "any_female_vertical_primary", "any_male_vertical_secondary", "any_female_vertical_secondary",
      "any_female_vertical_walking", "emily_primary", "emily_side", "marcus_primary", "marcus_side",
      "aisha_walking", "elena_primary", "elena_side", "any_male_primary", "any_female_primary", "any_male_side", "any_female_side"
    ];
  }

  /**
   * Get avatar categories for easier selection
   */
  getAvatarCategories(): { category: string; avatars: string[]; description: string }[] {
    return [
      {
        category: "Emily",
        avatars: ["emily_vertical_primary", "emily_vertical_secondary", "emily_primary", "emily_side"],
        description: "Professional female avatar with multiple angles and orientations"
      },
      {
        category: "Marcus",
        avatars: ["marcus_vertical_primary", "marcus_vertical_secondary", "marcus_primary", "marcus_side"],
        description: "Professional male avatar with multiple angles and orientations"
      },
      {
        category: "Mira",
        avatars: ["mira_vertical_primary", "mira_vertical_secondary"],
        description: "Female avatar with vertical orientations"
      },
      {
        category: "Jasmine",
        avatars: ["jasmine_vertical_primary", "jasmine_vertical_secondary", "jasmine_vertical_walking"],
        description: "Female avatar with walking animation option"
      },
      {
        category: "Aisha",
        avatars: ["aisha_vertical_walking", "aisha_walking"],
        description: "Female avatar with walking animation"
      },
      {
        category: "Elena",
        avatars: ["elena_vertical_primary", "elena_vertical_secondary", "elena_primary", "elena_side"],
        description: "Female avatar with multiple angles and orientations"
      },
      {
        category: "Generic Male",
        avatars: ["any_male_vertical_primary", "any_male_vertical_secondary", "any_male_primary", "any_male_side"],
        description: "Generic male avatar options for various use cases"
      },
      {
        category: "Generic Female",
        avatars: ["any_female_vertical_primary", "any_female_vertical_secondary", "any_female_vertical_walking", "any_female_primary", "any_female_side"],
        description: "Generic female avatar options for various use cases"
      }
    ];
  }

  /**
   * Get recommended avatars for different use cases
   */
  getRecommendedAvatars(useCase: string): string[] {
    switch (useCase.toLowerCase()) {
      case "business":
        return ["emily_vertical_primary", "marcus_vertical_primary", "elena_vertical_primary"];
      case "marketing":
        return ["emily_vertical_primary", "jasmine_vertical_primary", "aisha_vertical_walking"];
      case "educational":
        return ["elena_vertical_primary", "marcus_vertical_primary", "any_female_vertical_primary"];
      case "social_media":
        return ["jasmine_vertical_walking", "aisha_walking", "emily_side"];
      case "product_demo":
        return ["emily_vertical_primary", "marcus_vertical_primary", "any_female_vertical_primary"];
      case "walking":
        return ["jasmine_vertical_walking", "aisha_vertical_walking", "aisha_walking"];
      default:
        return ["emily_vertical_primary", "marcus_vertical_primary"];
    }
  }

  /**
   * Get model capabilities and information
   */
  getModelInfo() {
    return {
      name: "Veed Avatars Text-to-Video",
      version: "v1.0",
      provider: "Veed (via fal.ai)",
      endpoint: MODEL_ENDPOINT,
      capabilities: {
        inputTypes: ["text"],
        outputFormat: "MP4",
        resolution: "High quality",
        frameRate: "Standard frame rate",
        videoDuration: "Variable based on text length",
        supportsAvatarSelection: true,
        supportsTextInput: true,
        supportsUGCStyle: true,
        quality: "High-quality UGC-like avatar video generation",
      },
      pricing: {
        costPerMinute: 0.35,
        currency: "USD",
        billingModel: "per_minute",
        examples: {
          "1_minute": "$0.35",
          "2_minutes": "$0.70",
          "5_minutes": "$1.75",
          "10_minutes": "$3.50"
        },
        notes: "Cost is $0.35 per minute of generated video content."
      },
      features: {
        ugcStyleGeneration: "Generate UGC-like avatar videos from text",
        avatarSelection: "Choose from 30+ different avatar options",
        textToSpeech: "Convert text input to natural speech",
        multipleOrientations: "Support for vertical, horizontal, and side angles",
        walkingAnimations: "Some avatars support walking animations",
        professionalQuality: "High-quality video output suitable for business use",
        avatarCategories: "Organized avatar selection by category and use case"
      },
    };
  }

  /**
   * Get optimal settings for different use cases
   */
  getOptimalSettings(useCase: string): Partial<VeedAvatarsTextToVideoInput> {
    switch (useCase.toLowerCase()) {
      case "business_presentation":
        return {
          avatar_id: "emily_vertical_primary",
        };
      case "marketing_video":
        return {
          avatar_id: "jasmine_vertical_primary",
        };
      case "educational_content":
        return {
          avatar_id: "elena_vertical_primary",
        };
      case "social_media":
        return {
          avatar_id: "aisha_vertical_walking",
        };
      case "product_demo":
        return {
          avatar_id: "marcus_vertical_primary",
        };
      case "walking_animation":
        return {
          avatar_id: "jasmine_vertical_walking",
        };
      default:
        return DEFAULT_CONFIG;
    }
  }

  /**
   * Get cost comparison for different durations
   */
  getCostComparison(): { duration: string; cost: number; useCase: string }[] {
    return [
      {
        duration: "1 minute",
        cost: 0.35,
        useCase: "Short announcements, quick tips"
      },
      {
        duration: "2 minutes",
        cost: 0.70,
        useCase: "Product demos, brief explanations"
      },
      {
        duration: "5 minutes",
        cost: 1.75,
        useCase: "Detailed tutorials, comprehensive guides"
      },
      {
        duration: "10 minutes",
        cost: 3.50,
        useCase: "Full presentations, extended content"
      }
    ];
  }

  /**
   * Validate if an avatar ID is supported
   */
  isAvatarSupported(avatarId: string): boolean {
    return this.getAvailableAvatars().includes(avatarId);
  }

  /**
   * Get avatar details and characteristics
   */
  getAvatarDetails(avatarId: string): { name: string; gender: string; orientation: string; animation: string; bestFor: string[] } | null {
    const avatarDetails: Record<string, { name: string; gender: string; orientation: string; animation: string; bestFor: string[] }> = {
      "emily_vertical_primary": {
        name: "Emily",
        gender: "Female",
        orientation: "Vertical Primary",
        animation: "Static",
        bestFor: ["Business presentations", "Professional content", "Marketing videos"]
      },
      "marcus_vertical_primary": {
        name: "Marcus",
        gender: "Male",
        orientation: "Vertical Primary",
        animation: "Static",
        bestFor: ["Business presentations", "Professional content", "Product demos"]
      },
      "jasmine_vertical_walking": {
        name: "Jasmine",
        gender: "Female",
        orientation: "Vertical",
        animation: "Walking",
        bestFor: ["Lifestyle content", "Social media", "Dynamic presentations"]
      },
      "aisha_vertical_walking": {
        name: "Aisha",
        gender: "Female",
        orientation: "Vertical",
        animation: "Walking",
        bestFor: ["Lifestyle content", "Social media", "Dynamic presentations"]
      }
    };

    return avatarDetails[avatarId] || null;
  }

  /**
   * Get text optimization tips for better video generation
   */
  getTextOptimizationTips(): string[] {
    return [
      "Keep sentences clear and concise for better speech synthesis",
      "Use natural language that sounds conversational when spoken",
      "Break long text into shorter, digestible segments",
      "Include pauses and natural breaks for better pacing",
      "Use active voice and engaging language",
      "Consider the avatar's personality when writing text",
      "Keep paragraphs under 3-4 sentences for optimal delivery",
      "Use punctuation to guide speech patterns and emphasis"
    ];
  }

  private validateInput(input: VeedAvatarsTextToVideoInput): void {
    if (!input.avatar_id || input.avatar_id.trim().length === 0) {
      throw new Error("Avatar ID is required");
    }

    if (!input.text || input.text.trim().length === 0) {
      throw new Error("Text input is required");
    }

    if (input.text.length > 5000) {
      throw new Error("Text input must be under 5000 characters");
    }

    if (!this.isAvatarSupported(input.avatar_id)) {
      throw new Error(`Avatar ID must be one of: ${this.getAvailableAvatars().join(", ")}`);
    }
  }

  private mergeWithDefaults(input: VeedAvatarsTextToVideoInput): VeedAvatarsTextToVideoInput {
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

export const createVeedAvatarsTextToVideoExecutor = (apiKey: string) =>
  new VeedAvatarsTextToVideoExecutor(apiKey);
