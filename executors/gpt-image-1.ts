import OpenAI from "openai";

export interface GPTImage1Input {
  prompt: string;
  model?: "gpt-image-1";
  n?: number;
  size?: "1024x1024" | "1024x1536" | "1536x1024" | "auto";
  quality?: "low" | "medium" | "high" | "auto";
  background?: "transparent" | "opaque" | "auto";
  output_format?: "png" | "jpeg" | "webp";
  output_compression?: number;
  stream?: boolean;
  partial_images?: number;
  moderation?: "auto" | "low";
  user?: string;
}

export interface GPTImage1EditInput {
  image: string | string[]; // Can accept multiple images (up to 16)
  prompt: string;
  model?: "gpt-image-1";
  mask?: string;
  n?: number;
  size?: "1024x1024" | "1024x1536" | "1536x1024" | "auto";
  quality?: "low" | "medium" | "high" | "auto";
  background?: "transparent" | "opaque" | "auto";
  output_format?: "png" | "jpeg" | "webp";
  output_compression?: number;
  stream?: boolean;
  partial_images?: number;
  input_fidelity?: "low" | "high";
  user?: string;
}

export interface GPTImage1Output {
  created: number;
  data: Array<{
    b64_json?: string;
    url?: string;
    revised_prompt?: string;
  }>;
  background?: string;
  output_format?: string;
  size?: string;
  quality?: string;
  usage?: {
    total_tokens: number;
    input_tokens: number;
    output_tokens: number;
    input_tokens_details?: {
      text_tokens: number;
      image_tokens: number;
    };
  };
}

export interface GPTImage1Error {
  error: {
    message: string;
    type: string;
    code?: string;
  };
}

export interface GPTImage1Options {
  webhookUrl?: string;
  onProgress?: (progress: any) => void;
}

/**
 * GPT Image 1 Executor
 * 
 * GPT Image 1 is OpenAI's latest and most advanced image generation model. It's a natively 
 * multimodal language model that excels at high-quality image generation with superior 
 * instruction following, text rendering, detailed editing, and real-world knowledge.
 * 
 * Key features:
 * - Support for multiple input images (up to 16)
 * - High input fidelity for preserving details
 * - Streaming image generation
 * - Transparent background support
 * - Advanced editing capabilities
 * - Superior text rendering
 * 
 * @param input - The image generation input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated image result
 */
export async function executeGPTImage1(
  input: GPTImage1Input,
  options: GPTImage1Options = {}
): Promise<GPTImage1Output> {
  try {
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Validate required inputs
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (input.prompt.length > 32000) {
      throw new Error("Prompt must be 32000 characters or less");
    }

    // Validate optional parameters
    if (input.n && (input.n < 1 || input.n > 10)) {
      throw new Error("Number of images must be between 1 and 10");
    }

    if (input.output_compression && (input.output_compression < 0 || input.output_compression > 100)) {
      throw new Error("Output compression must be between 0 and 100");
    }

    if (input.partial_images && (input.partial_images < 0 || input.partial_images > 3)) {
      throw new Error("Partial images must be between 0 and 3");
    }

    // Prepare the request payload
    const payload: any = {
      model: input.model || "gpt-image-1",
      prompt: input.prompt.trim(),
    };

    // Add optional parameters only if they are provided
    if (input.n !== undefined) payload.n = input.n;
    if (input.size !== undefined) payload.size = input.size;
    if (input.quality !== undefined) payload.quality = input.quality;
    if (input.background !== undefined) payload.background = input.background;
    if (input.output_format !== undefined) payload.output_format = input.output_format;
    if (input.output_compression !== undefined) payload.output_compression = input.output_compression;
    if (input.stream !== undefined) payload.stream = input.stream;
    if (input.partial_images !== undefined) payload.partial_images = input.partial_images;
    if (input.moderation !== undefined) payload.moderation = input.moderation;
    if (input.user !== undefined) payload.user = input.user;

    // Execute the model
    const result = await openai.images.generate(payload);

    return result as GPTImage1Output;

  } catch (error) {
    console.error("GPT Image 1 execution failed:", error);
    throw new Error(`GPT Image 1 generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute GPT Image 1 for image editing with multiple input images
 * 
 * ⚠️ IMPORTANT LIMITATIONS:
 * - GPT image editing may change aspect ratios even when not requested
 * - Not suitable for pixel-perfect precision editing
 * - Consider using specialized tools for exact dimension control
 * 
 * @param input - The image editing input parameters
 * @param options - Additional execution options
 * @returns Promise with the edited image result
 */
export async function executeGPTImage1Edit(
  input: GPTImage1EditInput,
  options: GPTImage1Options = {}
): Promise<GPTImage1Output> {
  try {
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Validate required inputs
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (!input.image || (Array.isArray(input.image) && input.image.length === 0)) {
      throw new Error("At least one image is required");
    }

    if (Array.isArray(input.image) && input.image.length > 16) {
      throw new Error("Maximum 16 images allowed");
    }

    if (input.prompt.length > 32000) {
      throw new Error("Prompt must be 32000 characters or less");
    }

    // Validate optional parameters
    if (input.n && (input.n < 1 || input.n > 10)) {
      throw new Error("Number of images must be between 1 and 10");
    }

    if (input.output_compression && (input.output_compression < 0 || input.output_compression > 100)) {
      throw new Error("Output compression must be between 0 and 100");
    }

    if (input.partial_images && (input.partial_images < 0 || input.partial_images > 3)) {
      throw new Error("Partial images must be between 0 and 3");
    }

    // Enhance prompt with aspect ratio preservation if not already specified
    let enhancedPrompt = input.prompt.trim();
    if (!enhancedPrompt.toLowerCase().includes('aspect ratio') && 
        !enhancedPrompt.toLowerCase().includes('maintain') && 
        !enhancedPrompt.toLowerCase().includes('preserve')) {
      enhancedPrompt += " (maintain original aspect ratio and image dimensions)";
    }

    // Prepare the request payload
    const payload: any = {
      model: input.model || "gpt-image-1",
      image: input.image,
      prompt: enhancedPrompt,
    };

    // Add optional parameters only if they are provided
    if (input.mask !== undefined) payload.mask = input.mask;
    if (input.n !== undefined) payload.n = input.n;
    if (input.size !== undefined) payload.size = input.size;
    if (input.quality !== undefined) payload.quality = input.quality;
    if (input.background !== undefined) payload.background = input.background;
    if (input.output_format !== undefined) payload.output_format = input.output_format;
    if (input.output_compression !== undefined) payload.output_compression = input.output_compression;
    if (input.stream !== undefined) payload.stream = input.stream;
    if (input.partial_images !== undefined) payload.partial_images = input.partial_images;
    if (input.input_fidelity !== undefined) payload.input_fidelity = input.input_fidelity;
    if (input.user !== undefined) payload.user = input.user;

    // Execute the model
    const result = await openai.images.edit(payload);

    return result as GPTImage1Output;

  } catch (error) {
    console.error("GPT Image 1 edit execution failed:", error);
    throw new Error(`GPT Image 1 edit failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute GPT Image 1 with streaming support
 * 
 * @param input - The image generation input parameters
 * @param options - Additional execution options
 * @returns Promise with streaming result
 */
export async function executeGPTImage1Stream(
  input: GPTImage1Input,
  options: GPTImage1Options = {}
): Promise<AsyncIterable<GPTImage1Output>> {
  try {
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Validate required inputs
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    // Prepare the request payload with streaming enabled
    const payload: any = {
      model: input.model || "gpt-image-1",
      prompt: input.prompt.trim(),
      stream: true,
    };

    // Add optional parameters
    if (input.n !== undefined) payload.n = input.n;
    if (input.size !== undefined) payload.size = input.size;
    if (input.quality !== undefined) payload.quality = input.quality;
    if (input.background !== undefined) payload.background = input.background;
    if (input.output_format !== undefined) payload.output_format = input.output_format;
    if (input.output_compression !== undefined) payload.output_compression = input.output_compression;
    if (input.partial_images !== undefined) payload.partial_images = input.partial_images;
    if (input.moderation !== undefined) payload.moderation = input.moderation;
    if (input.user !== undefined) payload.user = input.user;

    // Execute the model with streaming
    const stream = await openai.images.generate(payload);

    return stream as AsyncIterable<GPTImage1Output>;

  } catch (error) {
    console.error("GPT Image 1 streaming execution failed:", error);
    throw new Error(`GPT Image 1 streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate multiple images with different prompts
 * 
 * @param prompts - Array of prompts to generate images for
 * @param options - Additional execution options
 * @returns Promise with array of results for each prompt
 */
export async function executeGPTImage1Multiple(
  prompts: string[],
  options: GPTImage1Options = {}
): Promise<GPTImage1Output[]> {
  const results: GPTImage1Output[] = [];

  for (const prompt of prompts) {
    try {
      const result = await executeGPTImage1({ prompt }, options);
      results.push(result);
    } catch (error) {
      console.error(`Failed to generate image for prompt: ${prompt}`, error);
      results.push({
        created: Date.now(),
        data: [],
        error: (error as GPTImage1Error).error?.message || 'Generation failed',
      } as any);
    }
  }

  return results;
}

/**
 * Generate images with different quality levels
 * 
 * @param input - Base input parameters
 * @param qualityLevels - Array of quality levels to generate
 * @param options - Additional execution options
 * @returns Promise with array of results for each quality level
 */
export async function executeGPTImage1WithQualityLevels(
  input: Omit<GPTImage1Input, "quality">,
  qualityLevels: GPTImage1Input["quality"][],
  options: GPTImage1Options = {}
): Promise<GPTImage1Output[]> {
  const results: GPTImage1Output[] = [];

  for (const quality of qualityLevels) {
    try {
      const result = await executeGPTImage1({ ...input, quality }, options);
      results.push(result);
    } catch (error) {
      console.error(`Failed to generate image with quality: ${quality}`, error);
      results.push({
        created: Date.now(),
        data: [],
        error: (error as GPTImage1Error).error?.message || 'Generation failed',
      } as any);
    }
  }

  return results;
}

/**
 * Generate images with different sizes
 * 
 * @param input - Base input parameters
 * @param sizes - Array of sizes to generate
 * @param options - Additional execution options
 * @returns Promise with array of results for each size
 */
export async function executeGPTImage1WithSizes(
  input: Omit<GPTImage1Input, "size">,
  sizes: GPTImage1Input["size"][],
  options: GPTImage1Options = {}
): Promise<GPTImage1Output[]> {
  const results: GPTImage1Output[] = [];

  for (const size of sizes) {
    try {
      const result = await executeGPTImage1({ ...input, size }, options);
      results.push(result);
    } catch (error) {
      console.error(`Failed to generate image with size: ${size}`, error);
      results.push({
        created: Date.now(),
        data: [],
        error: (error as GPTImage1Error).error?.message || 'Generation failed',
      } as any);
    }
  }

  return results;
}

/**
 * Get model information and capabilities
 * 
 * @returns Object with model information
 */
export function getGPTImage1ModelInfo() {
  return {
    name: "GPT Image 1",
    version: "1.0",
    provider: "openai",
    model_id: "gpt-image-1",
    description: "OpenAI's latest and most advanced image generation model with superior instruction following, text rendering, and detailed editing capabilities",
    features: [
      "Superior instruction following",
      "Advanced text rendering",
      "Detailed image editing",
      "Real-world knowledge integration",
      "Multiple input image support (up to 16)",
      "High input fidelity",
      "Streaming generation",
      "Transparent background support",
      "Advanced editing capabilities"
    ],
    supportedSizes: ["1024x1024", "1024x1536", "1536x1024", "auto"],
    supportedQualities: ["low", "medium", "high", "auto"],
    supportedBackgrounds: ["transparent", "opaque", "auto"],
    supportedFormats: ["png", "jpeg", "webp"],
    maxImagesPerRequest: 10,
    maxInputImages: 16,
    maxPromptLength: 32000,
    pricing: {
      textInput: 5, // $5 per 1M tokens
      imageInput: 10, // $10 per 1M tokens
      imageOutput: 40, // $40 per 1M tokens
    },
    estimatedCosts: {
      low: { "1024x1024": 0.011, "1024x1536": 0.016, "1536x1024": 0.016 },
      medium: { "1024x1024": 0.042, "1024x1536": 0.063, "1536x1024": 0.063 },
      high: { "1024x1024": 0.167, "1024x1536": 0.25, "1536x1024": 0.25 },
    },
  };
}

/**
 * Calculate estimated cost for image generation
 * 
 * @param size - Image size
 * @param quality - Image quality
 * @param count - Number of images
 * @returns Estimated cost in USD
 */
export function calculateGPTImage1Cost(
  size: GPTImage1Input["size"] = "1024x1024",
  quality: GPTImage1Input["quality"] = "medium",
  count: number = 1
): number {
  const modelInfo = getGPTImage1ModelInfo();
  const sizeKey = size === "auto" ? "1024x1024" : size;
  const qualityKey = quality === "auto" ? "medium" : quality;
  
  const costPerImage = modelInfo.estimatedCosts[qualityKey]?.[sizeKey] || 0.042;
  return costPerImage * count;
}

/**
 * Utility functions for common use cases
 */
export const gptImage1Utils = {
  /**
   * Create a professional prompt for business use
   */
  createProfessionalPrompt(subject: string, style: string = "professional"): string {
    return `Professional ${style} image of ${subject}, high-quality, detailed, commercial use ready, clean composition`;
  },

  /**
   * Create a creative prompt for artistic use
   */
  createCreativePrompt(subject: string, artisticStyle: string = "artistic"): string {
    return `Creative ${artisticStyle} interpretation of ${subject}, vibrant colors, expressive style, artistic composition, high detail`;
  },

  /**
   * Create a prompt for product visualization
   */
  createProductPrompt(product: string, context: string = "lifestyle"): string {
    return `${context} product visualization of ${product}, high-quality rendering, detailed materials, professional lighting, commercial photography style`;
  },

  /**
   * Create a prompt for character design
   */
  createCharacterPrompt(character: string, style: string = "detailed"): string {
    return `${style} character design of ${character}, full body, detailed features, expressive pose, high-quality illustration`;
  },

  /**
   * Create a prompt for landscape generation
   */
  createLandscapePrompt(landscape: string, mood: string = "serene"): string {
    return `${mood} landscape of ${landscape}, high detail, natural lighting, atmospheric perspective, photorealistic quality`;
  },

  /**
   * Create a prompt for data visualization chart
   */
  createChartPrompt(
    chartType: string,
    data: Record<string, number> | Array<{label: string, value: number}>,
    options: {
      title?: string;
      colors?: string[];
      style?: string;
      background?: string;
    } = {}
  ): string {
    const dataStr = Array.isArray(data) 
      ? data.map(d => `${d.label}: ${d.value}`).join(', ')
      : Object.entries(data).map(([k, v]) => `${k}: ${v}`).join(', ');
    
    const title = options.title ? ` titled "${options.title}"` : '';
    const colors = options.colors ? ` using ${options.colors.join(', ')} colors` : '';
    const style = options.style ? ` in ${options.style} style` : '';
    const background = options.background ? ` on ${options.background} background` : '';
    
    return `Create a ${chartType} chart${title} showing data: ${dataStr}${colors}${style}${background}. Professional styling, clear labels, readable typography, high quality`;
  },

  /**
   * Create a prompt for UI component design
   */
  createUIComponentPrompt(
    componentType: string,
    elements: string[],
    options: {
      style?: string;
      theme?: string;
      colors?: string[];
      layout?: string;
    } = {}
  ): string {
    const elementsStr = elements.join(', ');
    const style = options.style ? ` in ${options.style} style` : '';
    const theme = options.theme ? ` with ${options.theme} theme` : '';
    const colors = options.colors ? ` using ${options.colors.join(', ')} color scheme` : '';
    const layout = options.layout ? ` with ${options.layout} layout` : '';
    
    return `Design a ${componentType} component with ${elementsStr}${style}${theme}${colors}${layout}. Clean, modern, professional UI design, high quality, web-ready`;
  },

  /**
   * Create a prompt for dashboard layout
   */
  createDashboardPrompt(
    sections: string[],
    options: {
      theme?: string;
      style?: string;
      colors?: string[];
      layout?: string;
    } = {}
  ): string {
    const sectionsStr = sections.join(', ');
    const theme = options.theme ? ` with ${options.theme} theme` : '';
    const style = options.style ? ` in ${options.style} style` : '';
    const colors = options.colors ? ` using ${options.colors.join(', ')} color palette` : '';
    const layout = options.layout ? ` with ${options.layout} layout` : '';
    
    return `Create a dashboard layout with ${sectionsStr}${theme}${style}${colors}${layout}. Professional, clean design, well-organized, high quality, modern interface`;
  },

  /**
   * Create a prompt for infographic
   */
  createInfographicPrompt(
    topic: string,
    data: Record<string, number> | Array<{label: string, value: number}>,
    options: {
      chartType?: string;
      colors?: string[];
      style?: string;
      background?: string;
    } = {}
  ): string {
    const dataStr = Array.isArray(data) 
      ? data.map(d => `${d.label}: ${d.value}`).join(', ')
      : Object.entries(data).map(([k, v]) => `${k}: ${v}`).join(', ');
    
    const chartType = options.chartType || 'pie chart';
    const colors = options.colors ? ` using ${options.colors.join(', ')} colors` : '';
    const style = options.style ? ` in ${options.style} style` : '';
    const background = options.background ? ` on ${options.background} background` : '';
    
    return `Create an infographic about ${topic} with ${chartType} showing: ${dataStr}${colors}${style}${background}. Include icons, clean typography, professional design, high quality`;
  },

  /**
   * Get recommended size for use case
   */
  getRecommendedSize(useCase: string): GPTImage1Input["size"] {
    const sizeMap: Record<string, GPTImage1Input["size"]> = {
      "social_media": "1024x1024",
      "banner": "1536x1024",
      "portrait": "1024x1536",
      "landscape": "1536x1024",
      "square": "1024x1024",
      "auto": "auto",
    };
    return sizeMap[useCase.toLowerCase()] || "1024x1024";
  },

  /**
   * Get recommended quality for use case
   */
  getRecommendedQuality(useCase: string): GPTImage1Input["quality"] {
    const qualityMap: Record<string, GPTImage1Input["quality"]> = {
      "preview": "low",
      "production": "high",
      "testing": "medium",
      "commercial": "high",
      "personal": "medium",
      "auto": "auto",
    };
    return qualityMap[useCase.toLowerCase()] || "medium";
  },

  /**
   * Validate image size
   */
  isValidSize(size: string): size is GPTImage1Input["size"] {
    return ["1024x1024", "1024x1536", "1536x1024", "auto"].includes(size);
  },

  /**
   * Validate quality level
   */
  isValidQuality(quality: string): quality is GPTImage1Input["quality"] {
    return ["low", "medium", "high", "auto"].includes(quality);
  },

  /**
   * Validate background setting
   */
  isValidBackground(background: string): background is GPTImage1Input["background"] {
    return ["transparent", "opaque", "auto"].includes(background);
  },

  /**
   * Validate output format
   */
  isValidOutputFormat(format: string): format is GPTImage1Input["output_format"] {
    return ["png", "jpeg", "webp"].includes(format);
  },
};

export default {
  executeGPTImage1,
  executeGPTImage1Edit,
  executeGPTImage1Stream,
  executeGPTImage1Multiple,
  executeGPTImage1WithQualityLevels,
  executeGPTImage1WithSizes,
  getGPTImage1ModelInfo,
  calculateGPTImage1Cost,
  gptImage1Utils,
};
