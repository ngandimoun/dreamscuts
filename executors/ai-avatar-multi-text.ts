import { fal } from "@fal-ai/client";

export interface AiAvatarMultiTextInput {
  image_url: string;
  first_text_input: string;
  second_text_input: string;
  voice1?: "Aria" | "Roger" | "Sarah" | "Laura" | "Charlie" | "George" | "Callum" | "River" | "Liam" | "Charlotte" | "Alice" | "Matilda" | "Will" | "Jessica" | "Eric" | "Chris" | "Brian" | "Daniel" | "Lily" | "Bill";
  voice2?: "Aria" | "Roger" | "Sarah" | "Laura" | "Charlie" | "George" | "Callum" | "River" | "Liam" | "Charlotte" | "Alice" | "Matilda" | "Will" | "Jessica" | "Eric" | "Chris" | "Brian" | "Daniel" | "Lily" | "Bill";
  prompt: string;
  num_frames?: number;
  resolution?: "480p" | "720p";
  seed?: number;
  acceleration?: "none" | "regular" | "high";
}

export interface AiAvatarMultiTextOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  seed: number;
  requestId?: string;
}

export interface AiAvatarMultiTextError {
  error: string;
  message: string;
  code?: string;
}

export type AiAvatarMultiTextResult = AiAvatarMultiTextOutput | AiAvatarMultiTextError;

const MODEL_ENDPOINT = "fal-ai/ai-avatar/multi-text";

const DEFAULT_CONFIG = {
  voice1: "Sarah" as const,
  voice2: "Roger" as const,
  num_frames: 191,
  resolution: "480p" as const,
  seed: 81,
  acceleration: "regular" as const,
};

export class AiAvatarMultiTextExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: apiKey });
  }

  /**
   * Generate multi-person conversation video from image and text inputs
   */
  async generateVideo(input: AiAvatarMultiTextInput): Promise<AiAvatarMultiTextOutput> {
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
        seed: (result as any).seed || 0,
        requestId: (result as any).requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Queue video generation for long-running requests
   */
  async queueVideoGeneration(input: AiAvatarMultiTextInput, webhookUrl?: string): Promise<{ requestId: string }> {
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
  async getQueueResult(requestId: string): Promise<AiAvatarMultiTextOutput> {
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
        seed: (result as any).seed || 0,
        requestId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate multiple videos from different inputs
   */
  async generateMultipleVideos(inputs: AiAvatarMultiTextInput[]): Promise<AiAvatarMultiTextResult[]> {
    const promises = inputs.map(input => this.generateVideo(input));
    return Promise.allSettled(promises).then(results =>
      results.map(result =>
        result.status === 'fulfilled' ? result.value : { error: 'Failed', message: result.reason?.message || 'Unknown error' }
      )
    );
  }

  /**
   * Calculate the cost for video generation based on duration and resolution
   * Cost: $0.3 per second, with 1.25x billing for frames > 81
   */
  calculateCost(numFrames: number = 191, resolution: "480p" | "720p" = "480p"): number {
    const baseCostPerSecond = 0.3;
    const frameMultiplier = numFrames > 81 ? 1.25 : 1.0;
    const durationSeconds = numFrames / 30; // Assuming 30fps
    return baseCostPerSecond * durationSeconds * frameMultiplier;
  }

  /**
   * Get available voice options
   */
  getAvailableVoices(): string[] {
    return ["Aria", "Roger", "Sarah", "Laura", "Charlie", "George", "Callum", "River", "Liam", "Charlotte", "Alice", "Matilda", "Will", "Jessica", "Eric", "Chris", "Brian", "Daniel", "Lily", "Bill"];
  }

  /**
   * Get available resolution options
   */
  getAvailableResolutions(): string[] {
    return ["480p", "720p"];
  }

  /**
   * Get available acceleration options
   */
  getAvailableAccelerationOptions(): string[] {
    return ["none", "regular", "high"];
  }

  /**
   * Get available frame count range
   */
  getAvailableFrameRange(): { min: number; max: number } {
    return { min: 81, max: 129 };
  }

  /**
   * Get model capabilities and information
   */
  getModelInfo() {
    return {
      name: "AI Avatar Multi-Text",
      version: "v1.0",
      provider: "fal.ai",
      endpoint: MODEL_ENDPOINT,
      capabilities: {
        inputTypes: ["image", "text"],
        outputFormat: "MP4",
        resolution: "480p or 720p",
        frameRate: "Variable based on frame count",
        videoDuration: "Variable based on frame count",
        supportsMultiPerson: true,
        supportsTextToSpeech: true,
        supportsVoiceSelection: true,
        supportsAcceleration: true,
        quality: "High-quality multi-person conversation video generation",
      },
      pricing: {
        costPerSecond: 0.3,
        currency: "USD",
        billingModel: "per_second",
        frameMultiplier: "1.25x billing for frames > 81",
        examples: {
          "81_frames_480p": "$0.81",
          "191_frames_480p": "$1.19",
          "129_frames_720p": "$1.29"
        },
        notes: "Cost is $0.3 per second with 1.25x billing for frame counts above 81."
      },
      features: {
        multiPersonGeneration: "Generate videos with multiple people conversing",
        textToSpeech: "Convert text inputs to speech for each person",
        voiceSelection: "Choose from 20 different voice options",
        imageInput: "Use images as the base for video generation",
        frameControl: "Control video length with frame count (81-129)",
        resolutionOptions: "Choose between 480p and 720p output",
        accelerationControl: "Configurable acceleration levels for speed/quality trade-offs"
      },
    };
  }

  /**
   * Get optimal settings for different use cases
   */
  getOptimalSettings(useCase: string): Partial<AiAvatarMultiTextInput> {
    switch (useCase.toLowerCase()) {
      case "fast":
        return {
          num_frames: 81,
          resolution: "480p",
          acceleration: "high",
        };
      case "quality":
        return {
          num_frames: 129,
          resolution: "720p",
          acceleration: "none",
        };
      case "balanced":
        return {
          num_frames: 105,
          resolution: "480p",
          acceleration: "regular",
        };
      case "cost_effective":
        return {
          num_frames: 81,
          resolution: "480p",
          acceleration: "regular",
        };
      case "long_conversation":
        return {
          num_frames: 129,
          resolution: "480p",
          acceleration: "regular",
        };
      default:
        return DEFAULT_CONFIG;
    }
  }

  /**
   * Get cost comparison for different frame counts
   */
  getCostComparison(): { frames: number; cost: number; duration: string; multiplier: string }[] {
    return [
      {
        frames: 81,
        cost: 0.81,
        duration: "2.7 seconds",
        multiplier: "1.0x"
      },
      {
        frames: 105,
        cost: 1.05,
        duration: "3.5 seconds",
        multiplier: "1.0x"
      },
      {
        frames: 129,
        cost: 1.61,
        duration: "4.3 seconds",
        multiplier: "1.25x"
      },
      {
        frames: 191,
        cost: 2.39,
        duration: "6.4 seconds",
        multiplier: "1.25x"
      }
    ];
  }

  /**
   * Validate if a frame count is supported
   */
  isFrameCountSupported(frameCount: number): boolean {
    return frameCount >= 81 && frameCount <= 129;
  }

  /**
   * Validate if a resolution is supported
   */
  isResolutionSupported(resolution: string): boolean {
    return this.getAvailableResolutions().includes(resolution);
  }

  /**
   * Validate if a voice is supported
   */
  isVoiceSupported(voice: string): boolean {
    return this.getAvailableVoices().includes(voice);
  }

  /**
   * Get recommended voice combinations for different scenarios
   */
  getRecommendedVoiceCombinations(): { scenario: string; voice1: string; voice2: string; reasoning: string }[] {
    return [
      {
        scenario: "Professional conversation",
        voice1: "Sarah",
        voice2: "Roger",
        reasoning: "Clear, professional voices suitable for business contexts"
      },
      {
        scenario: "Casual conversation",
        voice1: "Charlie",
        voice2: "Lily",
        reasoning: "Friendly, approachable voices for informal discussions"
      },
      {
        scenario: "Educational content",
        voice1: "Laura",
        voice2: "George",
        reasoning: "Clear, articulate voices ideal for learning materials"
      },
      {
        scenario: "Entertainment",
        voice1: "Aria",
        voice2: "River",
        reasoning: "Dynamic, engaging voices for creative content"
      }
    ];
  }

  private validateInput(input: AiAvatarMultiTextInput): void {
    if (!input.image_url || input.image_url.trim().length === 0) {
      throw new Error("Image URL is required");
    }

    if (!input.first_text_input || input.first_text_input.trim().length === 0) {
      throw new Error("First text input is required");
    }

    if (!input.second_text_input || input.second_text_input.trim().length === 0) {
      throw new Error("Second text input is required");
    }

    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (input.first_text_input.length > 500) {
      throw new Error("First text input must be under 500 characters");
    }

    if (input.second_text_input.length > 500) {
      throw new Error("Second text input must be under 500 characters");
    }

    if (input.prompt.length > 1000) {
      throw new Error("Prompt must be under 1000 characters");
    }

    if (input.num_frames && !this.isFrameCountSupported(input.num_frames)) {
      throw new Error(`Number of frames must be between 81 and 129, got ${input.num_frames}`);
    }

    if (input.resolution && !this.isResolutionSupported(input.resolution)) {
      throw new Error(`Resolution must be one of: ${this.getAvailableResolutions().join(", ")}`);
    }

    if (input.seed && (input.seed < 0 || input.seed > 2147483647)) {
      throw new Error("Seed must be between 0 and 2147483647");
    }

    if (input.acceleration && !this.getAvailableAccelerationOptions().includes(input.acceleration)) {
      throw new Error(`Acceleration must be one of: ${this.getAvailableAccelerationOptions().join(", ")}`);
    }

    if (input.voice1 && !this.isVoiceSupported(input.voice1)) {
      throw new Error(`Voice1 must be one of: ${this.getAvailableVoices().join(", ")}`);
    }

    if (input.voice2 && !this.isVoiceSupported(input.voice2)) {
      throw new Error(`Voice2 must be one of: ${this.getAvailableVoices().join(", ")}`);
    }
  }

  private mergeWithDefaults(input: AiAvatarMultiTextInput): AiAvatarMultiTextInput {
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

export const createAiAvatarMultiTextExecutor = (apiKey: string) =>
  new AiAvatarMultiTextExecutor(apiKey);
