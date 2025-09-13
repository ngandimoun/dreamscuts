import { fal } from "@fal-ai/client";

// Types for the Wan Effects model
export interface WanEffectsInput {
  subject: string;
  image_url: string;
  effect_type?: WanEffectType;
  num_frames?: number;
  frames_per_second?: number;
  seed?: number;
  aspect_ratio?: "16:9" | "9:16" | "1:1";
  num_inference_steps?: number;
  lora_scale?: number;
  turbo_mode?: boolean;
}

export type WanEffectType = 
  | "squish" | "muscle" | "inflate" | "crush" | "rotate" | "gun-shooting" 
  | "deflate" | "cakeify" | "hulk" | "baby" | "bride" | "classy" | "puppy" 
  | "snow-white" | "disney-princess" | "mona-lisa" | "painting" | "pirate-captain" 
  | "princess" | "jungle" | "samurai" | "vip" | "warrior" | "zen" | "assassin" 
  | "timelapse" | "tsunami" | "fire" | "zoom-call" | "doom-fps" | "fus-ro-dah" 
  | "hug-jesus" | "robot-face-reveal" | "super-saiyan" | "jumpscare" | "laughing" 
  | "cartoon-jaw-drop" | "crying" | "kissing" | "angry-face" | "selfie-younger-self" 
  | "animeify" | "blast";

export interface WanEffectsOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  seed?: number;
  requestId?: string;
}

export interface WanEffectsError {
  error: string;
  message: string;
  code?: string;
}

// Union type for handling both success and error cases
export type WanEffectsResult = WanEffectsOutput | WanEffectsError;

// Model configuration
const MODEL_ENDPOINT = "fal-ai/wan-effects";

// Default configuration
const DEFAULT_CONFIG = {
  effect_type: "cakeify" as const,
  num_frames: 81,
  frames_per_second: 16,
  aspect_ratio: "16:9" as const,
  num_inference_steps: 30,
  lora_scale: 1.0,
};

/**
 * Wan Effects Video Generation Executor
 * 
 * This executor provides a comprehensive interface for generating videos with special effects
 * using Wan Effects through the fal.ai API. It's optimized for applying predefined effect
 * templates to images, creating engaging videos with various visual transformations.
 */
export class WanEffectsExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    
    // Configure fal.ai client
    fal.config({
      credentials: apiKey,
    });
  }

  /**
   * Generate video with effects using the Wan Effects model
   * @param input - The input parameters for effect video generation
   * @returns Promise<WanEffectsOutput> - The generated video and metadata
   */
  async generateEffectsVideo(input: WanEffectsInput): Promise<WanEffectsOutput> {
    try {
      // Validate input
      this.validateInput(input);

      // Merge with defaults
      const params = this.mergeWithDefaults(input);

      // Generate video
      const result = await fal.subscribe(MODEL_ENDPOINT, {
        input: params,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs?.forEach((log) => console.log(log.message));
          }
        },
      });

      // Extract video from result
      const video = {
        url: (result as any).video?.url || "",
        content_type: (result as any).video?.content_type,
        file_name: (result as any).video?.file_name,
        file_size: (result as any).video?.file_size,
      };

      return {
        video,
        seed: (result as any).seed,
        requestId: (result as any).requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate effects video asynchronously using queue system
   * @param input - The input parameters for effect video generation
   * @param webhookUrl - Optional webhook URL for notifications
   * @returns Promise<{requestId: string}> - The request ID for tracking
   */
  async queueEffectsVideoGeneration(
    input: WanEffectsInput,
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
   * @param requestId - The request ID from queueEffectsVideoGeneration
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
   * @param requestId - The request ID from queueEffectsVideoGeneration
   * @returns Promise<WanEffectsOutput> - The generated video and metadata
   */
  async getQueueResult(requestId: string): Promise<WanEffectsOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });

      // Extract video from result
      const video = {
        url: (result as any).video?.url || "",
        content_type: (result as any).video?.content_type,
        file_name: (result as any).video?.file_name,
        file_size: (result as any).video?.file_size,
      };

      return {
        video,
        seed: (result as any).seed,
        requestId: (result as any).requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate multiple effects videos with different subjects and images
   * @param inputs - Array of input parameters for effect video generation
   * @returns Promise<WanEffectsResult[]> - Array of results for each input
   */
  async generateMultipleEffectsVideos(
    inputs: WanEffectsInput[]
  ): Promise<WanEffectsResult[]> {
    const results: WanEffectsResult[] = [];

    for (const input of inputs) {
      try {
        const result = await this.generateEffectsVideo(input);
        results.push(result);
      } catch (error) {
        console.error(`Failed to generate effects video for subject: ${input.subject}`, error);
        results.push({
          error: "Generation failed",
          message: (error as any).message || "Unknown error occurred",
        });
      }
    }

    return results;
  }

  /**
   * Calculate estimated cost for effects video generation
   * @returns number - Estimated cost in USD
   */
  calculateCost(): number {
    return 0.35; // Fixed cost per video
  }

  /**
   * Calculate video duration based on frames and FPS
   * @param numFrames - Number of frames
   * @param fps - Frames per second
   * @returns number - Duration in seconds
   */
  calculateDuration(numFrames: number = 81, fps: number = 16): number {
    return numFrames / fps;
  }

  /**
   * Get all available effect types
   * @returns WanEffectType[] - Array of all available effects
   */
  getAvailableEffects(): WanEffectType[] {
    return [
      "squish", "muscle", "inflate", "crush", "rotate", "gun-shooting",
      "deflate", "cakeify", "hulk", "baby", "bride", "classy", "puppy",
      "snow-white", "disney-princess", "mona-lisa", "painting", "pirate-captain",
      "princess", "jungle", "samurai", "vip", "warrior", "zen", "assassin",
      "timelapse", "tsunami", "fire", "zoom-call", "doom-fps", "fus-ro-dah",
      "hug-jesus", "robot-face-reveal", "super-saiyan", "jumpscare", "laughing",
      "cartoon-jaw-drop", "crying", "kissing", "angry-face", "selfie-younger-self",
      "animeify", "blast"
    ];
  }

  /**
   * Validate input parameters
   * @param input - The input parameters to validate
   * @throws Error if validation fails
   */
  private validateInput(input: WanEffectsInput): void {
    if (!input.subject || input.subject.trim().length === 0) {
      throw new Error("Subject is required and cannot be empty");
    }

    if (!input.image_url || input.image_url.trim().length === 0) {
      throw new Error("Image URL is required and cannot be empty");
    }

    // Validate URL format
    try {
      new URL(input.image_url);
    } catch {
      throw new Error("Image URL must be a valid URL");
    }

    if (input.num_frames !== undefined && (input.num_frames < 1 || input.num_frames > 200)) {
      throw new Error("Number of frames must be between 1 and 200");
    }

    if (input.frames_per_second !== undefined && (input.frames_per_second < 1 || input.frames_per_second > 60)) {
      throw new Error("Frames per second must be between 1 and 60");
    }

    if (input.seed !== undefined && (input.seed < 0 || input.seed > 2147483647)) {
      throw new Error("Seed must be a positive integer within valid range");
    }

    if (input.num_inference_steps !== undefined && (input.num_inference_steps < 1 || input.num_inference_steps > 100)) {
      throw new Error("Number of inference steps must be between 1 and 100");
    }

    if (input.lora_scale !== undefined && (input.lora_scale < 0.1 || input.lora_scale > 2.0)) {
      throw new Error("LoRA scale must be between 0.1 and 2.0");
    }
  }

  /**
   * Merge input with default values
   * @param input - The user input
   * @returns WanEffectsInput - Merged input with defaults
   */
  private mergeWithDefaults(input: WanEffectsInput): WanEffectsInput {
    return {
      ...DEFAULT_CONFIG,
      ...input,
    };
  }

  /**
   * Handle and format errors consistently
   * @param error - The error to handle
   * @returns Error - Formatted error
   */
  private handleError(error: any): Error {
    if (error instanceof Error) {
      return error;
    }

    // Handle fal.ai specific errors
    if (error?.message) {
      return new Error(error.message);
    }

    if (error?.error) {
      return new Error(error.error);
    }

    return new Error("An unknown error occurred during effects video generation");
  }

  /**
   * Get model information and capabilities
   * @returns object - Model information
   */
  getModelInfo() {
    return {
      name: "Wan Effects",
      version: "v1.0",
      provider: "fal-ai",
      endpoint: MODEL_ENDPOINT,
      capabilities: {
        inputTypes: ["image", "text"],
        outputFormat: "MP4",
        supportedEffects: this.getAvailableEffects().length,
        supportedAspectRatios: ["16:9", "9:16", "1:1"],
        maxInputImages: 1,
        maxFrames: 81,
        defaultFPS: 16,
        supportsSeedControl: true,
        supportsTurboMode: true,
        supportsLoRAScaling: true,
      },
      pricing: {
        costPerVideo: 0.35,
        currency: "USD",
        quality: "Standard tier",
      },
    };
  }
}

// Export default instance creator
export const createWanEffectsExecutor = (apiKey: string) => 
  new WanEffectsExecutor(apiKey);


