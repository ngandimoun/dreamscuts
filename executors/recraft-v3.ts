import { fal } from "@fal-ai/client";

// Types for the Recraft V3 model
export interface RecraftV3Input {
  prompt: string;
  image_size?: "square_hd" | "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9" | {
    width: number;
    height: number;
  };
  style?: RecraftV3Style;
  colors?: RGBColor[];
  style_id?: string;
  enable_safety_checker?: boolean;
}

export type RecraftV3Style = 
  | "any" 
  | "realistic_image" 
  | "digital_illustration" 
  | "vector_illustration"
  | "realistic_image/b_and_w" | "realistic_image/hard_flash" | "realistic_image/hdr" | "realistic_image/natural_light" | "realistic_image/studio_portrait" | "realistic_image/enterprise" | "realistic_image/motion_blur" | "realistic_image/evening_light" | "realistic_image/faded_nostalgia" | "realistic_image/forest_life" | "realistic_image/mystic_naturalism" | "realistic_image/natural_tones" | "realistic_image/organic_calm" | "realistic_image/real_life_glow" | "realistic_image/retro_realism" | "realistic_image/retro_snapshot" | "realistic_image/urban_drama" | "realistic_image/village_realism" | "realistic_image/warm_folk"
  | "digital_illustration/pixel_art" | "digital_illustration/hand_drawn" | "digital_illustration/grain" | "digital_illustration/infantile_sketch" | "digital_illustration/2d_art_poster" | "digital_illustration/handmade_3d" | "digital_illustration/hand_drawn_outline" | "digital_illustration/engraving_color" | "digital_illustration/2d_art_poster_2" | "digital_illustration/antiquarian" | "digital_illustration/bold_fantasy" | "digital_illustration/child_book" | "digital_illustration/child_books" | "digital_illustration/cover" | "digital_illustration/crosshatch" | "digital_illustration/digital_engraving" | "digital_illustration/expressionism" | "digital_illustration/freehand_details" | "digital_illustration/grain_20" | "digital_illustration/graphic_intensity" | "digital_illustration/hard_comics" | "digital_illustration/long_shadow" | "digital_illustration/modern_folk" | "digital_illustration/multicolor" | "digital_illustration/neon_calm" | "digital_illustration/noir" | "digital_illustration/nostalgic_pastel" | "digital_illustration/outline_details" | "digital_illustration/pastel_gradient" | "digital_illustration/pastel_sketch" | "digital_illustration/pop_art" | "digital_illustration/pop_renaissance" | "digital_illustration/street_art" | "digital_illustration/tablet_sketch" | "digital_illustration/urban_glow" | "digital_illustration/urban_sketching" | "digital_illustration/vanilla_dreams" | "digital_illustration/young_adult_book" | "digital_illustration/young_adult_book_2"
  | "vector_illustration/bold_stroke" | "vector_illustration/chemistry" | "vector_illustration/colored_stencil" | "vector_illustration/contour_pop_art" | "vector_illustration/cosmics" | "vector_illustration/cutout" | "vector_illustration/depressive" | "vector_illustration/editorial" | "vector_illustration/emotional_flat" | "vector_illustration/infographical" | "vector_illustration/marker_outline" | "vector_illustration/mosaic" | "vector_illustration/naivector" | "vector_illustration/roundish_flat" | "vector_illustration/segmented_colors" | "vector_illustration/sharp_contrast" | "vector_illustration/thin" | "vector_illustration/vector_photo" | "vector_illustration/vivid_shapes" | "vector_illustration/engraving" | "vector_illustration/line_art" | "vector_illustration/line_circuit" | "vector_illustration/linocut";

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface RecraftV3Output {
  images: Array<{
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
    file_data?: string;
  }>;
  requestId?: string;
}

export interface RecraftV3Error {
  error: string;
  message: string;
  code?: string;
}

// Model configuration
const MODEL_ENDPOINT = "fal-ai/recraft/v3/text-to-image";

// Default configuration
const DEFAULT_CONFIG = {
  image_size: "square_hd" as const,
  style: "realistic_image" as const,
  colors: [] as RGBColor[],
  enable_safety_checker: true,
};

// Style categories for easier management
export const STYLE_CATEGORIES = {
  realistic: [
    "realistic_image", "realistic_image/b_and_w", "realistic_image/hard_flash", 
    "realistic_image/hdr", "realistic_image/natural_light", "realistic_image/studio_portrait",
    "realistic_image/enterprise", "realistic_image/motion_blur", "realistic_image/evening_light",
    "realistic_image/faded_nostalgia", "realistic_image/forest_life", "realistic_image/mystic_naturalism",
    "realistic_image/natural_tones", "realistic_image/organic_calm", "realistic_image/real_life_glow",
    "realistic_image/retro_realism", "realistic_image/retro_snapshot", "realistic_image/urban_drama",
    "realistic_image/village_realism", "realistic_image/warm_folk"
  ],
  digital: [
    "digital_illustration", "digital_illustration/pixel_art", "digital_illustration/hand_drawn",
    "digital_illustration/grain", "digital_illustration/infantile_sketch", "digital_illustration/2d_art_poster",
    "digital_illustration/handmade_3d", "digital_illustration/hand_drawn_outline", "digital_illustration/engraving_color",
    "digital_illustration/2d_art_poster_2", "digital_illustration/antiquarian", "digital_illustration/bold_fantasy",
    "digital_illustration/child_book", "digital_illustration/child_books", "digital_illustration/cover",
    "digital_illustration/crosshatch", "digital_illustration/digital_engraving", "digital_illustration/expressionism",
    "digital_illustration/freehand_details", "digital_illustration/grain_20", "digital_illustration/graphic_intensity",
    "digital_illustration/hard_comics", "digital_illustration/long_shadow", "digital_illustration/modern_folk",
    "digital_illustration/multicolor", "digital_illustration/neon_calm", "digital_illustration/noir",
    "digital_illustration/nostalgic_pastel", "digital_illustration/outline_details", "digital_illustration/pastel_gradient",
    "digital_illustration/pastel_sketch", "digital_illustration/pop_art", "digital_illustration/pop_renaissance",
    "digital_illustration/street_art", "digital_illustration/tablet_sketch", "digital_illustration/urban_glow",
    "digital_illustration/urban_sketching", "digital_illustration/vanilla_dreams", "digital_illustration/young_adult_book",
    "digital_illustration/young_adult_book_2"
  ],
  vector: [
    "vector_illustration", "vector_illustration/bold_stroke", "vector_illustration/chemistry",
    "vector_illustration/colored_stencil", "vector_illustration/contour_pop_art", "vector_illustration/cosmics",
    "vector_illustration/cutout", "vector_illustration/depressive", "vector_illustration/editorial",
    "vector_illustration/emotional_flat", "vector_illustration/infographical", "vector_illustration/marker_outline",
    "vector_illustration/mosaic", "vector_illustration/naivector", "vector_illustration/roundish_flat",
    "vector_illustration/segmented_colors", "vector_illustration/sharp_contrast", "vector_illustration/thin",
    "vector_illustration/vector_photo", "vector_illustration/vivid_shapes", "vector_illustration/engraving",
    "vector_illustration/line_art", "vector_illustration/line_circuit", "vector_illustration/linocut"
  ]
};

/**
 * Recraft V3 Image Generation Executor
 * 
 * This executor provides a comprehensive interface for generating images using Recraft V3 model
 * through the fal.ai API. It supports extensive style customization, color preferences, and
 * brand-specific generation capabilities.
 */
export class RecraftV3Executor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    
    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Generate images using the Recraft V3 model
   * @param input - The input parameters for image generation
   * @returns Promise<RecraftV3Output> - The generated images and metadata
   */
  async generateImages(input: RecraftV3Input): Promise<RecraftV3Output> {
    try {
      // Validate input
      this.validateInput(input);

      // Merge with defaults
      const params = this.mergeWithDefaults(input);

      // Generate images
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
        images: result.images || [],
        requestId: result.requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate images asynchronously using queue system
   * @param input - The input parameters for image generation
   * @param webhookUrl - Optional webhook URL for notifications
   * @returns Promise<{requestId: string}> - The request ID for tracking
   */
  async queueImageGeneration(
    input: RecraftV3Input,
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
   * @param requestId - The request ID from queueImageGeneration
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
   * @param requestId - The request ID from queueImageGeneration
   * @returns Promise<RecraftV3Output> - The generated images and metadata
   */
  async getQueueResult(requestId: string): Promise<RecraftV3Output> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });

      return {
        images: result.images || [],
        requestId: result.requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate multiple images with different prompts
   * @param prompts - Array of prompts to generate images for
   * @param style - Optional style to use for all generations
   * @returns Promise<RecraftV3Output[]> - Array of results for each prompt
   */
  async generateMultipleImages(
    prompts: string[],
    style?: RecraftV3Style
  ): Promise<RecraftV3Output[]> {
    const results: RecraftV3Output[] = [];

    for (const prompt of prompts) {
      try {
        const result = await this.generateImages({ prompt, style });
        results.push(result);
      } catch (error) {
        console.error(`Failed to generate image for prompt: ${prompt}`, error);
        results.push({
          images: [],
          error: (error as RecraftV3Error).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate images with different styles
   * @param input - Base input parameters
   * @param styles - Array of styles to generate
   * @returns Promise<RecraftV3Output[]> - Array of results for each style
   */
  async generateWithStyles(
    input: Omit<RecraftV3Input, "style">,
    styles: RecraftV3Style[]
  ): Promise<RecraftV3Output[]> {
    const results: RecraftV3Output[] = [];

    for (const style of styles) {
      try {
        const result = await this.generateImages({
          ...input,
          style,
        });
        results.push(result);
      } catch (error) {
        console.error(
          `Failed to generate image with style: ${style}`,
          error
        );
        results.push({
          images: [],
          error: (error as RecraftV3Error).message,
        });
      }
    }

    return results;
  }

  /**
   * Generate images with different image sizes
   * @param input - Base input parameters
   * @param imageSizes - Array of image sizes to generate
   * @returns Promise<RecraftV3Output[]> - Array of results for each size
   */
  async generateWithImageSizes(
    input: Omit<RecraftV3Input, "image_size">,
    imageSizes: RecraftV3Input["image_size"][]
  ): Promise<RecraftV3Output[]> {
    const results: RecraftV3Output[] = [];

    for (const imageSize of imageSizes) {
      try {
        const result = await this.generateImages({
          ...input,
          image_size: imageSize,
        });
        results.push(result);
      } catch (error) {
        console.error(
          `Failed to generate image with size: ${JSON.stringify(imageSize)}`,
          error
        );
        results.push({
          images: [],
          error: (error as RecraftV3Error).message,
        });
      }
    }

    return results;
  }

  /**
   * Get model information and capabilities
   * @returns Object with model information
   */
  getModelInfo() {
    return {
      name: "Recraft",
      version: "v3",
      provider: "fal-ai",
      endpoint: MODEL_ENDPOINT,
      supportedImageSizes: ["square_hd", "square", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"],
      supportedStyles: {
        realistic: STYLE_CATEGORIES.realistic.length,
        digital: STYLE_CATEGORIES.digital.length,
        vector: STYLE_CATEGORIES.vector.length,
        total: STYLE_CATEGORIES.realistic.length + STYLE_CATEGORIES.digital.length + STYLE_CATEGORIES.vector.length
      },
      pricing: {
        standard: 0.04,
        vector: 0.08,
      },
      features: [
        "80+ predefined styles across 3 categories",
        "Brand style customization",
        "Color preference control",
        "Vector illustration support",
        "Long text generation",
        "Multiple aspect ratios"
      ],
    };
  }

  /**
   * Get all available styles
   * @returns Object with categorized styles
   */
  getAvailableStyles() {
    return STYLE_CATEGORIES;
  }

  /**
   * Get styles by category
   * @param category - The style category
   * @returns Array of styles in the category
   */
  getStylesByCategory(category: keyof typeof STYLE_CATEGORIES): RecraftV3Style[] {
    return STYLE_CATEGORIES[category] as RecraftV3Style[];
  }

  /**
   * Check if a style is a vector style (costs 2X more)
   * @param style - The style to check
   * @returns Boolean indicating if it's a vector style
   */
  isVectorStyle(style: RecraftV3Style): boolean {
    return style.startsWith("vector_illustration");
  }

  /**
   * Get the cost for a specific style
   * @param style - The style to check
   * @returns The cost per image
   */
  getStyleCost(style: RecraftV3Style): number {
    return this.isVectorStyle(style) ? 0.08 : 0.04;
  }

  /**
   * Validate input parameters
   * @param input - The input to validate
   */
  private validateInput(input: RecraftV3Input): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required and cannot be empty");
    }

    if (input.prompt.length > 1000) {
      throw new Error("Prompt is too long. Maximum length is 1000 characters");
    }

    if (input.style && !this.isValidStyle(input.style)) {
      throw new Error(`Invalid style: ${input.style}. Use getAvailableStyles() to see valid options.`);
    }

    if (input.colors) {
      for (const color of input.colors) {
        if (color.r < 0 || color.r > 255 || color.g < 0 || color.g > 255 || color.b < 0 || color.b > 255) {
          throw new Error("Color values must be between 0 and 255");
        }
      }
    }

    if (input.image_size && typeof input.image_size === "object") {
      if (input.image_size.width < 1 || input.image_size.height < 1) {
        throw new Error("Custom image dimensions must be positive numbers");
      }
    }
  }

  /**
   * Check if a style is valid
   * @param style - The style to validate
   * @returns Boolean indicating if the style is valid
   */
  private isValidStyle(style: string): style is RecraftV3Style {
    const allStyles = [
      ...STYLE_CATEGORIES.realistic,
      ...STYLE_CATEGORIES.digital,
      ...STYLE_CATEGORIES.vector,
      "any"
    ];
    return allStyles.includes(style as RecraftV3Style);
  }

  /**
   * Merge input with default values
   * @param input - The input parameters
   * @returns Merged parameters with defaults
   */
  private mergeWithDefaults(input: RecraftV3Input): RecraftV3Input {
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
  private handleError(error: any): RecraftV3Error {
    if (error.message) {
      return {
        error: "Generation failed",
        message: error.message,
        code: error.code,
      };
    }

    return {
      error: "Unknown error",
      message: "An unexpected error occurred during image generation",
    };
  }
}

// Utility functions for common use cases
export const recraftV3Utils = {
  /**
   * Create a brand logo prompt
   * @param brandName - Name of the brand
   * @param industry - Industry or sector
   * @returns Formatted prompt
   */
  createBrandLogoPrompt(brandName: string, industry: string = "modern"): string {
    return `${industry} logo design for ${brandName}, clean, professional, scalable, brand identity`;
  },

  /**
   * Create a social media content prompt
   * @param theme - Content theme
   * @param platform - Social media platform
   * @returns Formatted prompt
   */
  createSocialMediaPrompt(theme: string, platform: string = "Instagram"): string {
    return `${platform} social media content featuring ${theme}, engaging, visually appealing, modern design`;
  },

  /**
   * Create a vector icon prompt
   * @param iconType - Type of icon
   * @param style - Icon style
   * @returns Formatted prompt
   */
  createVectorIconPrompt(iconType: string, style: string = "minimal"): string {
    return `${style} vector icon of ${iconType}, scalable, clean lines, professional design`;
  },

  /**
   * Create a digital art prompt
   * @param subject - The subject to illustrate
   * @param artStyle - Art style
   * @returns Formatted prompt
   */
  createDigitalArtPrompt(subject: string, artStyle: string = "digital illustration"): string {
    return `${artStyle} of ${subject}, vibrant colors, detailed, artistic composition`;
  },

  /**
   * Get recommended styles for use case
   * @param useCase - The intended use case
   * @returns Array of recommended styles
   */
  getRecommendedStyles(useCase: string): RecraftV3Style[] {
    const recommendations: Record<string, RecraftV3Style[]> = {
      "brand_logo": ["vector_illustration/bold_stroke", "vector_illustration/editorial", "vector_illustration/emotional_flat"],
      "social_media": ["digital_illustration/pop_art", "digital_illustration/urban_glow", "realistic_image/natural_light"],
      "icon_design": ["vector_illustration/thin", "vector_illustration/line_art", "vector_illustration/engraving"],
      "illustration": ["digital_illustration/hand_drawn", "digital_illustration/child_book", "digital_illustration/expressionism"],
      "photography": ["realistic_image/studio_portrait", "realistic_image/natural_light", "realistic_image/hdr"],
      "artistic": ["digital_illustration/bold_fantasy", "digital_illustration/street_art", "digital_illustration/neon_calm"]
    };

    return recommendations[useCase.toLowerCase()] || ["realistic_image"];
  },

  /**
   * Get recommended image size for platform
   * @param platform - The target platform
   * @returns Recommended image size
   */
  getRecommendedImageSize(platform: string): RecraftV3Input["image_size"] {
    const recommendations: Record<string, RecraftV3Input["image_size"]> = {
      "instagram": "square_hd",
      "facebook": "square_hd",
      "twitter": "landscape_16_9",
      "linkedin": "square_hd",
      "youtube": "landscape_16_9",
      "pinterest": "portrait_16_9",
      "tiktok": "portrait_16_9",
      "logo": "square_hd",
      "icon": "square",
      "banner": "landscape_16_9"
    };

    return recommendations[platform.toLowerCase()] || "square_hd";
  },

  /**
   * Create brand colors array
   * @param colors - Array of hex color codes
   * @returns Array of RGB color objects
   */
  createBrandColors(colors: string[]): RGBColor[] {
    return colors.map(hex => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    });
  },

  /**
   * Estimate cost for generation
   * @param style - The style to use
   * @param count - Number of images to generate
   * @returns Estimated cost
   */
  estimateCost(style: RecraftV3Style, count: number = 1): number {
    const costPerImage = style.startsWith("vector_illustration") ? 0.08 : 0.04;
    return costPerImage * count;
  }
};

// Export default executor instance
export default RecraftV3Executor;
