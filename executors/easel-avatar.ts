import { fal } from "@fal-ai/client";

// Types for the Easel Avatar model
export interface EaselAvatarInput {
  face_image_0: string;
  gender_0: "male" | "female" | "non-binary";
  face_image_1?: string;
  gender_1?: "male" | "female" | "non-binary";
  prompt: string;
  style?: "hyperrealistic-likeness" | "hyperrealistic" | "realistic" | "stylistic";
}

export interface EaselAvatarOutput {
  image: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
    file_data?: string;
    width?: number;
    height?: number;
  };
  requestId?: string;
}

export interface EaselAvatarError {
  error: string;
  message: string;
  code?: string;
}

// Model configuration
const MODEL_ENDPOINT = "easel-ai/easel-avatar";

// Default configuration
const DEFAULT_CONFIG = {
  style: "hyperrealistic-likeness" as const,
  gender_1: "female" as const,
};

/**
 * Easel Avatar Generation Executor
 * 
 * This executor provides a comprehensive interface for avatar scene generation using the Easel Avatar model
 * through the fal.ai API. It specializes in creating scenes with one or two people using selfies and text prompts,
 * with various output styles for different use cases.
 */
export class EaselAvatarExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    
    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Generate avatar scene using the Easel Avatar model
   * @param input - The input parameters for avatar generation
   * @returns Promise<EaselAvatarOutput> - The generated avatar image and metadata
   */
  async generateAvatar(input: EaselAvatarInput): Promise<EaselAvatarOutput> {
    try {
      // Validate input
      this.validateInput(input);

      // Merge with defaults
      const params = this.mergeWithDefaults(input);

      // Generate avatar
      const result = await fal.subscribe(MODEL_ENDPOINT, {
        input: params,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs?.forEach((log) => console.log(log.message));
          }
        },
      });

      return {
        image: result.image || { url: "" },
        requestId: result.requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate avatar asynchronously using queue system
   * @param input - The input parameters for avatar generation
   * @param webhookUrl - Optional webhook URL for notifications
   * @returns Promise<{requestId: string}> - The request ID for tracking
   */
  async queueAvatarGeneration(
    input: EaselAvatarInput,
    webhookUrl?: string
  ): Promise<{ requestId: string }> {
    try {
      // Validate input
      this.validateInput(input);

      // Merge with defaults
      const params = this.mergeWithDefaults(input);

      // Submit to queue
      const { request_id } = await fal.queue.submit(MODEL_ENDPOINT, {
        input: params,
        webhookUrl,
      });

      return { requestId: request_id };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Check the status of a queued request
   * @param requestId - The request ID from queueAvatarGeneration
   * @returns Promise<any> - The current status
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
   * @param requestId - The request ID from queueAvatarGeneration
   * @returns Promise<EaselAvatarOutput> - The generated avatar image and metadata
   */
  async getQueueResult(requestId: string): Promise<EaselAvatarOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });

      return {
        image: result.image || { url: "" },
        requestId: result.requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate single person avatar scene
   * @param faceImageUrl - URL of the face image
   * @param gender - Gender of the person
   * @param prompt - Scene description prompt
   * @param style - Output style (optional)
   * @returns Promise<EaselAvatarOutput> - The generated avatar
   */
  async generateSinglePersonAvatar(
    faceImageUrl: string,
    gender: "male" | "female" | "non-binary",
    prompt: string,
    style?: EaselAvatarInput["style"]
  ): Promise<EaselAvatarOutput> {
    return this.generateAvatar({
      face_image_0: faceImageUrl,
      gender_0: gender,
      prompt,
      style,
    });
  }

  /**
   * Generate dual person avatar scene
   * @param faceImage0Url - URL of the first face image
   * @param gender0 - Gender of the first person
   * @param faceImage1Url - URL of the second face image
   * @param gender1 - Gender of the second person
   * @param prompt - Scene description prompt
   * @param style - Output style (optional)
   * @returns Promise<EaselAvatarOutput> - The generated avatar
   */
  async generateDualPersonAvatar(
    faceImage0Url: string,
    gender0: "male" | "female" | "non-binary",
    faceImage1Url: string,
    gender1: "male" | "female" | "non-binary",
    prompt: string,
    style?: EaselAvatarInput["style"]
  ): Promise<EaselAvatarOutput> {
    return this.generateAvatar({
      face_image_0: faceImage0Url,
      gender_0: gender0,
      face_image_1: faceImage1Url,
      gender_1: gender1,
      prompt,
      style,
    });
  }

  /**
   * Generate avatar with hyperrealistic likeness style
   * @param input - Base input parameters
   * @returns Promise<EaselAvatarOutput> - The generated avatar with likeness preservation
   */
  async generateWithLikenessPreservation(input: Omit<EaselAvatarInput, "style">): Promise<EaselAvatarOutput> {
    return this.generateAvatar({
      ...input,
      style: "hyperrealistic-likeness",
    });
  }

  /**
   * Generate avatar with hyperrealistic style
   * @param input - Base input parameters
   * @returns Promise<EaselAvatarOutput> - The generated avatar with hyperrealistic style
   */
  async generateHyperrealistic(input: Omit<EaselAvatarInput, "style">): Promise<EaselAvatarOutput> {
    return this.generateAvatar({
      ...input,
      style: "hyperrealistic",
    });
  }

  /**
   * Generate avatar with realistic style
   * @param input - Base input parameters
   * @returns Promise<EaselAvatarOutput> - The generated avatar with realistic style
   */
  async generateRealistic(input: Omit<EaselAvatarInput, "style">): Promise<EaselAvatarOutput> {
    return this.generateAvatar({
      ...input,
      style: "realistic",
    });
  }

  /**
   * Generate avatar with stylistic style
   * @param input - Base input parameters
   * @returns Promise<EaselAvatarOutput> - The generated avatar with artistic style
   */
  async generateStylistic(input: Omit<EaselAvatarInput, "style">): Promise<EaselAvatarOutput> {
    return this.generateAvatar({
      ...input,
      style: "stylistic",
    });
  }

  /**
   * Upload files and use them for avatar generation
   * @param faceImageFile - Face image file to upload
   * @param gender - Gender of the person
   * @param prompt - Scene description prompt
   * @param secondFaceImageFile - Optional second face image file
   * @param secondGender - Optional gender of second person
   * @param style - Output style (optional)
   * @returns Promise<EaselAvatarOutput> - The generated avatar
   */
  async generateWithUploadedFiles(
    faceImageFile: File,
    gender: "male" | "female" | "non-binary",
    prompt: string,
    secondFaceImageFile?: File,
    secondGender?: "male" | "female" | "non-binary",
    style?: EaselAvatarInput["style"]
  ): Promise<EaselAvatarOutput> {
    // Upload first face image
    const faceImage0Url = await fal.storage.upload(faceImageFile);

    const input: EaselAvatarInput = {
      face_image_0: faceImage0Url,
      gender_0: gender,
      prompt,
      style,
    };

    // Upload second face image if provided
    if (secondFaceImageFile && secondGender) {
      const faceImage1Url = await fal.storage.upload(secondFaceImageFile);
      input.face_image_1 = faceImage1Url;
      input.gender_1 = secondGender;
    }

    return this.generateAvatar(input);
  }

  /**
   * Generate multiple avatars with different styles
   * @param input - Base input parameters
   * @param styles - Array of styles to try
   * @returns Promise<EaselAvatarOutput[]> - Array of results for each style
   */
  async generateWithMultipleStyles(
    input: Omit<EaselAvatarInput, "style">,
    styles: EaselAvatarInput["style"][]
  ): Promise<EaselAvatarOutput[]> {
    const results: EaselAvatarOutput[] = [];

    for (const style of styles) {
      try {
        const result = await this.generateAvatar({
          ...input,
          style,
        });
        results.push(result);
      } catch (error) {
        console.error(`Failed to generate avatar with style: ${style}`, error);
        results.push({
          image: { url: "" },
          error: (error as EaselAvatarError).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate avatar for specific use cases
   * @param useCase - The intended use case
   * @param faceImageUrl - URL of the face image
   * @param gender - Gender of the person
   * @param additionalDetails - Additional scene details
   * @param secondPerson - Optional second person details
   * @returns Promise<EaselAvatarOutput> - The generated avatar
   */
  async generateForUseCase(
    useCase: string,
    faceImageUrl: string,
    gender: "male" | "female" | "non-binary",
    additionalDetails: string = "",
    secondPerson?: { faceImageUrl: string; gender: "male" | "female" | "non-binary" }
  ): Promise<EaselAvatarOutput> {
    const prompt = this.createUseCasePrompt(useCase, additionalDetails);
    const style = this.getRecommendedStyleForUseCase(useCase);

    const input: EaselAvatarInput = {
      face_image_0: faceImageUrl,
      gender_0: gender,
      prompt,
      style,
    };

    if (secondPerson) {
      input.face_image_1 = secondPerson.faceImageUrl;
      input.gender_1 = secondPerson.gender;
    }

    return this.generateAvatar(input);
  }

  /**
   * Get model information and capabilities
   * @returns Object with model information
   */
  getModelInfo() {
    return {
      name: "Easel Avatar",
      version: "latest",
      provider: "easel-ai",
      endpoint: MODEL_ENDPOINT,
      supportedStyles: ["hyperrealistic-likeness", "hyperrealistic", "realistic", "stylistic"],
      supportedGenders: ["male", "female", "non-binary"],
      pricing: {
        standard: 0.05,
        unit: "per generation",
      },
      features: [
        "Single and dual person avatar generation",
        "Face image-based scene creation",
        "Multiple output styles for different use cases",
        "Gender-aware generation",
        "Text prompt-driven scene creation",
        "Hyperrealistic likeness preservation",
        "Creative and artistic styles",
        "Real-time generation with queue system"
      ],
    };
  }

  /**
   * Calculate cost for generation
   * @param numGenerations - Number of avatars to generate
   * @returns Cost in dollars
   */
  calculateCost(numGenerations: number = 1): number {
    return 0.05 * numGenerations;
  }

  /**
   * Calculate avatars per dollar for a given budget
   * @param budget - Budget in dollars
   * @returns Number of avatars that can be generated
   */
  calculateAvatarsPerDollar(budget: number): number {
    return Math.floor(budget / 0.05);
  }

  /**
   * Validate input parameters
   * @param input - The input to validate
   */
  private validateInput(input: EaselAvatarInput): void {
    if (!input.face_image_0 || input.face_image_0.trim().length === 0) {
      throw new Error("Face image 0 is required and cannot be empty");
    }

    if (!input.gender_0 || !["male", "female", "non-binary"].includes(input.gender_0)) {
      throw new Error("Gender 0 must be 'male', 'female', or 'non-binary'");
    }

    if (input.face_image_1 && !input.gender_1) {
      throw new Error("Gender 1 is required when face image 1 is provided");
    }

    if (input.gender_1 && !["male", "female", "non-binary"].includes(input.gender_1)) {
      throw new Error("Gender 1 must be 'male', 'female', or 'non-binary'");
    }

    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required and cannot be empty");
    }

    if (input.prompt.length > 1000) {
      throw new Error("Prompt is too long. Maximum length is 1000 characters");
    }

    if (input.style && !["hyperrealistic-likeness", "hyperrealistic", "realistic", "stylistic"].includes(input.style)) {
      throw new Error("Style must be 'hyperrealistic-likeness', 'hyperrealistic', 'realistic', or 'stylistic'");
    }
  }

  /**
   * Merge input with default values
   * @param input - The input parameters
   * @returns Merged parameters with defaults
   */
  private mergeWithDefaults(input: EaselAvatarInput): EaselAvatarInput {
    return {
      ...DEFAULT_CONFIG,
      ...input,
    };
  }

  /**
   * Handle and format errors
   * @param error - The error to handle
   * @returns Formatted error
   */
  private handleError(error: any): EaselAvatarError {
    if (error.message) {
      return {
        error: "Avatar generation failed",
        message: error.message,
        code: error.code,
      };
    }

    return {
      error: "Unknown error",
      message: "An unexpected error occurred during avatar generation",
    };
  }

  /**
   * Create use case specific prompt
   * @param useCase - The use case
   * @param additionalDetails - Additional details
   * @returns Formatted prompt
   */
  private createUseCasePrompt(useCase: string, additionalDetails: string = ""): string {
    const basePrompts: Record<string, string> = {
      "professional": "in a professional business setting, wearing formal attire",
      "casual": "in a casual everyday setting, wearing comfortable clothes",
      "formal_event": "at a formal event, dressed in elegant attire",
      "outdoor": "in an outdoor setting, enjoying nature",
      "indoor": "in an indoor setting, relaxed and comfortable",
      "social_media": "perfect for social media, trendy and stylish",
      "portrait": "professional portrait style, well-lit and clear",
      "creative": "in a creative artistic setting, expressive and dynamic",
      "fantasy": "in a fantasy setting, imaginative and magical",
      "historical": "in a historical setting, period-appropriate attire",
      "futuristic": "in a futuristic setting, modern and innovative",
      "romantic": "in a romantic setting, intimate and warm",
      "adventure": "on an adventure, active and energetic",
      "relaxation": "in a relaxing setting, peaceful and calm"
    };

    const basePrompt = basePrompts[useCase.toLowerCase()] || "in a beautiful setting";
    return additionalDetails ? `${basePrompt}, ${additionalDetails}` : basePrompt;
  }

  /**
   * Get recommended style for use case
   * @param useCase - The use case
   * @returns Recommended style
   */
  private getRecommendedStyleForUseCase(useCase: string): EaselAvatarInput["style"] {
    const recommendations: Record<string, EaselAvatarInput["style"]> = {
      "professional": "hyperrealistic-likeness",
      "casual": "realistic",
      "formal_event": "hyperrealistic-likeness",
      "outdoor": "realistic",
      "indoor": "realistic",
      "social_media": "hyperrealistic",
      "portrait": "hyperrealistic-likeness",
      "creative": "stylistic",
      "fantasy": "stylistic",
      "historical": "realistic",
      "futuristic": "hyperrealistic",
      "romantic": "realistic",
      "adventure": "realistic",
      "relaxation": "realistic"
    };

    return recommendations[useCase.toLowerCase()] || "hyperrealistic-likeness";
  }
}

// Utility functions for common use cases
export const easelAvatarUtils = {
  /**
   * Create a professional avatar prompt
   * @param setting - Professional setting
   * @param attire - Type of attire
   * @returns Formatted prompt
   */
  createProfessionalPrompt(setting: string, attire: string): string {
    return `in a professional ${setting}, wearing ${attire}, confident and poised`;
  },

  /**
   * Create a casual avatar prompt
   * @param activity - Activity being performed
   * @param setting - Casual setting
   * @returns Formatted prompt
   */
  createCasualPrompt(activity: string, setting: string): string {
    return `${activity} in a casual ${setting}, relaxed and natural`;
  },

  /**
   * Create a formal event prompt
   * @param event - Type of formal event
   * @param attire - Formal attire description
   * @returns Formatted prompt
   */
  createFormalEventPrompt(event: string, attire: string): string {
    return `at a ${event}, dressed in ${attire}, elegant and sophisticated`;
  },

  /**
   * Create an outdoor avatar prompt
   * @param location - Outdoor location
   * @param activity - Outdoor activity
   * @returns Formatted prompt
   */
  createOutdoorPrompt(location: string, activity: string): string {
    return `${activity} in a beautiful ${location}, enjoying the outdoors`;
  },

  /**
   * Create a creative avatar prompt
   * @param artisticStyle - Artistic style
   * @param creativeElement - Creative element
   * @returns Formatted prompt
   */
  createCreativePrompt(artisticStyle: string, creativeElement: string): string {
    return `in a ${artisticStyle} artistic setting with ${creativeElement}, creative and expressive`;
  },

  /**
   * Create a social media avatar prompt
   * @param platform - Social media platform
   * @param trend - Current trend
   * @returns Formatted prompt
   */
  createSocialMediaPrompt(platform: string, trend: string): string {
    return `perfect for ${platform}, following the ${trend} trend, stylish and trendy`;
  },

  /**
   * Get recommended style for use case
   * @param useCase - The intended use case
   * @returns Recommended style
   */
  getRecommendedStyle(useCase: string): EaselAvatarInput["style"] {
    const recommendations: Record<string, EaselAvatarInput["style"]> = {
      "professional": "hyperrealistic-likeness",
      "casual": "realistic",
      "formal_event": "hyperrealistic-likeness",
      "outdoor": "realistic",
      "indoor": "realistic",
      "social_media": "hyperrealistic",
      "portrait": "hyperrealistic-likeness",
      "creative": "stylistic",
      "fantasy": "stylistic",
      "historical": "realistic",
      "futuristic": "hyperrealistic",
      "romantic": "realistic",
      "adventure": "realistic",
      "relaxation": "realistic"
    };

    return recommendations[useCase.toLowerCase()] || "hyperrealistic-likeness";
  },

  /**
   * Get style description
   * @param style - The style to describe
   * @returns Style description
   */
  getStyleDescription(style: EaselAvatarInput["style"]): string {
    const descriptions: Record<string, string> = {
      "hyperrealistic-likeness": "Preserves more likeness including hair styles",
      "hyperrealistic": "Ideal for fun and creative scenes",
      "realistic": "Photorealistic with good text rendering",
      "stylistic": "Softer, more artistic"
    };

    return descriptions[style] || "Unknown style";
  },

  /**
   * Estimate cost for generation
   * @param numGenerations - Number of avatars to generate
   * @returns Estimated cost
   */
  estimateCost(numGenerations: number = 1): number {
    return 0.05 * numGenerations;
  },

  /**
   * Calculate avatars per dollar for a given budget
   * @param budget - Budget in dollars
   * @returns Number of avatars that can be generated
   */
  calculateAvatarsPerDollar(budget: number): number {
    return Math.floor(budget / 0.05);
  },

  /**
   * Validate gender input
   * @param gender - Gender to validate
   * @returns Boolean indicating if gender is valid
   */
  isValidGender(gender: string): gender is "male" | "female" | "non-binary" {
    return ["male", "female", "non-binary"].includes(gender);
  },

  /**
   * Validate style input
   * @param style - Style to validate
   * @returns Boolean indicating if style is valid
   */
  isValidStyle(style: string): style is EaselAvatarInput["style"] {
    return ["hyperrealistic-likeness", "hyperrealistic", "realistic", "stylistic"].includes(style);
  }
};

// Export default executor instance
export default EaselAvatarExecutor;
