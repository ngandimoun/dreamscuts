import { fal } from "@fal-ai/client";

export interface IdeogramV3Input {
  prompt: string;
  image_size?: "square_hd" | "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9" | { width: number; height: number };
  rendering_speed?: "TURBO" | "BALANCED" | "QUALITY";
  style?: "AUTO" | "GENERAL" | "REALISTIC" | "DESIGN";
  style_codes?: string[];
  color_palette?: {
    name?: "EMBER" | "FRESH" | "JUNGLE" | "MAGIC" | "MELON" | "MOSAIC" | "PASTEL" | "ULTRAMARINE";
    members?: Array<{
      rgb: { r: number; g: number; b: number };
      color_weight?: number;
    }>;
  };
  image_urls?: string[];
  expand_prompt?: boolean;
  num_images?: number;
  seed?: number;
  sync_mode?: boolean;
  negative_prompt?: string;
}

export interface IdeogramV3Output {
  images: Array<{
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
    file_data?: string;
    width?: number;
    height?: number;
  }>;
  seed: number;
  requestId?: string;
}

export interface IdeogramV3Error {
  message: string;
  code?: string;
  details?: any;
}

export class IdeogramV3Executor {
  private apiKey: string;
  private endpoint = "fal-ai/ideogram/v3";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: apiKey });
  }

  /**
   * Generate images using Ideogram V3
   */
  async generateImages(input: IdeogramV3Input): Promise<IdeogramV3Output> {
    try {
      const validatedInput = this.validateInput(input);
      const mergedInput = this.mergeWithDefaults(validatedInput);

      const result = await fal.subscribe(this.endpoint, {
        input: mergedInput,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs?.map((log) => log.message).forEach(console.log);
          }
        },
      });

      return {
        images: result.data.images,
        seed: result.data.seed,
        requestId: result.requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Queue image generation for long-running requests
   */
  async queueImageGeneration(input: IdeogramV3Input, webhookUrl?: string): Promise<{ request_id: string }> {
    try {
      const validatedInput = this.validateInput(input);
      const mergedInput = this.mergeWithDefaults(validatedInput);

      const result = await fal.queue.submit(this.endpoint, {
        input: mergedInput,
        webhookUrl,
      });

      return { request_id: result.request_id };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Check queue status
   */
  async checkQueueStatus(requestId: string): Promise<any> {
    try {
      return await fal.queue.status(this.endpoint, {
        requestId,
        logs: true,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get queue result
   */
  async getQueueResult(requestId: string): Promise<IdeogramV3Output> {
    try {
      const result = await fal.queue.result(this.endpoint, { requestId });
      return {
        images: result.data.images,
        seed: result.data.seed,
        requestId: result.requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate high-quality images with QUALITY rendering speed
   */
  async generateHighQuality(input: Omit<IdeogramV3Input, "rendering_speed">): Promise<IdeogramV3Output> {
    return this.generateImages({
      ...input,
      rendering_speed: "QUALITY",
    });
  }

  /**
   * Generate fast images with TURBO rendering speed
   */
  async generateFast(input: Omit<IdeogramV3Input, "rendering_speed">): Promise<IdeogramV3Output> {
    return this.generateImages({
      ...input,
      rendering_speed: "TURBO",
    });
  }

  /**
   * Generate balanced images with BALANCED rendering speed
   */
  async generateBalanced(input: Omit<IdeogramV3Input, "rendering_speed">): Promise<IdeogramV3Output> {
    return this.generateImages({
      ...input,
      rendering_speed: "BALANCED",
    });
  }

  /**
   * Generate with specific style
   */
  async generateWithStyle(
    input: Omit<IdeogramV3Input, "style">,
    style: "GENERAL" | "REALISTIC" | "DESIGN"
  ): Promise<IdeogramV3Output> {
    return this.generateImages({
      ...input,
      style,
    });
  }

  /**
   * Generate with custom color palette
   */
  async generateWithColorPalette(
    input: Omit<IdeogramV3Input, "color_palette">,
    colorPalette: IdeogramV3Input["color_palette"]
  ): Promise<IdeogramV3Output> {
    return this.generateImages({
      ...input,
      color_palette: colorPalette,
    });
  }

  /**
   * Generate with style reference images
   */
  async generateWithStyleReferences(
    input: Omit<IdeogramV3Input, "image_urls">,
    styleImages: string[]
  ): Promise<IdeogramV3Output> {
    return this.generateImages({
      ...input,
      image_urls: styleImages,
    });
  }

  /**
   * Generate with uploaded files
   */
  async generateWithUploadedFiles(
    input: Omit<IdeogramV3Input, "image_urls">,
    files: File[]
  ): Promise<IdeogramV3Output> {
    try {
      const uploadedUrls = await Promise.all(
        files.map((file) => fal.storage.upload(file))
      );
      return this.generateWithStyleReferences(input, uploadedUrls);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate multiple variations
   */
  async generateMultipleVariations(
    input: Omit<IdeogramV3Input, "num_images">,
    count: number
  ): Promise<IdeogramV3Output> {
    return this.generateImages({
      ...input,
      num_images: count,
    });
  }

  /**
   * Generate with different rendering speeds
   */
  async generateWithRenderingSpeeds(
    input: Omit<IdeogramV3Input, "rendering_speed">,
    speeds: Array<"TURBO" | "BALANCED" | "QUALITY">
  ): Promise<IdeogramV3Output[]> {
    return Promise.all(
      speeds.map((speed) =>
        this.generateImages({
          ...input,
          rendering_speed: speed,
        })
      )
    );
  }

  /**
   * Get model information
   */
  getModelInfo() {
    return {
      name: "Ideogram V3",
      version: "latest",
      provider: "fal-ai",
      endpoint: this.endpoint,
      description: "High-quality image generation with exceptional typography handling",
      features: [
        "Exceptional typography handling",
        "High-quality image generation",
        "Poster and logo creation",
        "Multiple rendering speeds",
        "Style customization",
        "Color palette support",
        "Style reference images",
        "Commercial and creative optimization",
      ],
      supportedStyles: ["AUTO", "GENERAL", "REALISTIC", "DESIGN"],
      supportedRenderingSpeeds: ["TURBO", "BALANCED", "QUALITY"],
      supportedColorPalettes: ["EMBER", "FRESH", "JUNGLE", "MAGIC", "MELON", "MOSAIC", "PASTEL", "ULTRAMARINE"],
      supportedAspectRatios: ["1:1", "4:3", "16:9", "3:4", "9:16"],
      pricing: {
        standard: { price: 0.05, unit: "per megapixel" },
      },
    };
  }

  /**
   * Calculate cost for generation
   */
  calculateCost(width: number, height: number, count: number = 1): number {
    const megapixels = (width * height) / 1000000;
    const pricePerMegapixel = 0.05;
    return megapixels * pricePerMegapixel * count;
  }

  /**
   * Calculate cost for specific image size
   */
  calculateCostForSize(imageSize: string | { width: number; height: number }, count: number = 1): number {
    let width: number, height: number;

    if (typeof imageSize === "string") {
      const sizeMap: Record<string, { width: number; height: number }> = {
        square_hd: { width: 1024, height: 1024 },
        square: { width: 512, height: 512 },
        portrait_4_3: { width: 768, height: 1024 },
        portrait_16_9: { width: 720, height: 1280 },
        landscape_4_3: { width: 1024, height: 768 },
        landscape_16_9: { width: 1280, height: 720 },
      };
      const size = sizeMap[imageSize];
      if (!size) throw new Error(`Invalid image size: ${imageSize}`);
      width = size.width;
      height = size.height;
    } else {
      width = imageSize.width;
      height = imageSize.height;
    }

    return this.calculateCost(width, height, count);
  }

  /**
   * Calculate images per dollar
   */
  calculateImagesPerDollar(dollarAmount: number, width: number, height: number): number {
    const costPerImage = this.calculateCost(width, height, 1);
    return Math.floor(dollarAmount / costPerImage);
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: IdeogramV3Input): IdeogramV3Input {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (input.num_images && (input.num_images < 1 || input.num_images > 10)) {
      throw new Error("Number of images must be between 1 and 10");
    }

    if (input.seed && (input.seed < 0 || input.seed > 2147483647)) {
      throw new Error("Seed must be between 0 and 2147483647");
    }

    if (input.image_urls && input.image_urls.length > 10) {
      throw new Error("Maximum 10 style reference images allowed");
    }

    if (input.style_codes && input.style_codes.length > 0) {
      for (const code of input.style_codes) {
        if (code.length !== 8) {
          throw new Error("Style codes must be exactly 8 characters");
        }
      }
    }

    return input;
  }

  /**
   * Merge input with default values
   */
  private mergeWithDefaults(input: IdeogramV3Input): IdeogramV3Input {
    return {
      rendering_speed: "BALANCED",
      style: "AUTO",
      expand_prompt: true,
      num_images: 1,
      negative_prompt: "",
      ...input,
    };
  }

  /**
   * Handle errors consistently
   */
  private handleError(error: any): IdeogramV3Error {
    if (error instanceof Error) {
      return {
        message: error.message,
        code: "GENERATION_ERROR",
        details: error,
      };
    }
    return {
      message: "Unknown error occurred",
      code: "UNKNOWN_ERROR",
      details: error,
    };
  }
}

export const ideogramV3Utils = {
  /**
   * Create a professional prompt for business use
   */
  createProfessionalPrompt(subject: string, style: string = "professional"): string {
    return `Professional ${subject} with ${style} styling, high-quality typography, clean design, commercial use ready`;
  },

  /**
   * Create a creative prompt for artistic use
   */
  createCreativePrompt(subject: string, artisticStyle: string = "artistic"): string {
    return `Creative ${subject} in ${artisticStyle} style, vibrant colors, expressive typography, artistic composition`;
  },

  /**
   * Create a poster prompt
   */
  createPosterPrompt(title: string, theme: string = "modern"): string {
    return `Poster design for "${title}" with ${theme} theme, bold typography, eye-catching layout, professional presentation`;
  },

  /**
   * Create a logo prompt
   */
  createLogoPrompt(brandName: string, industry: string = "modern"): string {
    return `Logo design for ${brandName} in ${industry} industry, clean typography, scalable design, brand identity`;
  },

  /**
   * Create a marketing prompt
   */
  createMarketingPrompt(product: string, target: string = "general"): string {
    return `Marketing image for ${product} targeting ${target} audience, compelling typography, persuasive design, commercial appeal`;
  },

  /**
   * Get recommended image size for use case
   */
  getRecommendedImageSize(useCase: string): string {
    const sizeMap: Record<string, string> = {
      poster: "portrait_4_3",
      logo: "square_hd",
      marketing: "landscape_16_9",
      social: "square_hd",
      banner: "landscape_16_9",
      card: "portrait_4_3",
    };
    return sizeMap[useCase] || "square_hd";
  },

  /**
   * Get recommended rendering speed for use case
   */
  getRecommendedRenderingSpeed(useCase: string): "TURBO" | "BALANCED" | "QUALITY" {
    const speedMap: Record<string, "TURBO" | "BALANCED" | "QUALITY"> = {
      preview: "TURBO",
      production: "QUALITY",
      testing: "BALANCED",
      commercial: "QUALITY",
      personal: "BALANCED",
    };
    return speedMap[useCase] || "BALANCED";
  },

  /**
   * Get recommended style for use case
   */
  getRecommendedStyle(useCase: string): "AUTO" | "GENERAL" | "REALISTIC" | "DESIGN" {
    const styleMap: Record<string, "AUTO" | "GENERAL" | "REALISTIC" | "DESIGN"> = {
      business: "DESIGN",
      creative: "GENERAL",
      realistic: "REALISTIC",
      artistic: "GENERAL",
      commercial: "DESIGN",
    };
    return styleMap[useCase] || "AUTO";
  },

  /**
   * Get color palette description
   */
  getColorPaletteDescription(paletteName: string): string {
    const descriptions: Record<string, string> = {
      EMBER: "Warm, fiery colors with reds and oranges",
      FRESH: "Cool, vibrant colors with greens and blues",
      JUNGLE: "Natural, earthy tones with greens and browns",
      MAGIC: "Mystical, purple and blue tones",
      MELON: "Soft, pastel pinks and corals",
      MOSAIC: "Bold, diverse colors for vibrant designs",
      PASTEL: "Soft, gentle pastel colors",
      ULTRAMARINE: "Deep, rich blues and navy tones",
    };
    return descriptions[paletteName] || "Custom color palette";
  },

  /**
   * Estimate cost for generation
   */
  estimateCost(width: number, height: number, count: number = 1): number {
    const megapixels = (width * height) / 1000000;
    const pricePerMegapixel = 0.05;
    return megapixels * pricePerMegapixel * count;
  },

  /**
   * Calculate images per dollar
   */
  calculateImagesPerDollar(dollarAmount: number, width: number, height: number): number {
    const costPerImage = this.estimateCost(width, height, 1);
    return Math.floor(dollarAmount / costPerImage);
  },

  /**
   * Validate image size
   */
  isValidImageSize(size: string | { width: number; height: number }): boolean {
    if (typeof size === "string") {
      const validSizes = ["square_hd", "square", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"];
      return validSizes.includes(size);
    }
    return size.width >= 512 && size.width <= 2048 && size.height >= 512 && size.height <= 2048;
  },

  /**
   * Validate rendering speed
   */
  isValidRenderingSpeed(speed: string): speed is "TURBO" | "BALANCED" | "QUALITY" {
    return ["TURBO", "BALANCED", "QUALITY"].includes(speed);
  },

  /**
   * Validate style
   */
  isValidStyle(style: string): style is "AUTO" | "GENERAL" | "REALISTIC" | "DESIGN" {
    return ["AUTO", "GENERAL", "REALISTIC", "DESIGN"].includes(style);
  },
};

export default IdeogramV3Executor;
