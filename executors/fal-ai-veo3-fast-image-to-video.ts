import { fal } from "@fal-ai/client";

const MODEL_ENDPOINT = 'fal-ai/veo3/fast/image-to-video';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export type Veo3FastImageToVideoAspectRatioEnum = 'auto' | '16:9' | '9:16';
export type Veo3FastImageToVideoDurationEnum = '8s';
export type Veo3FastImageToVideoResolutionEnum = '720p' | '1080p';

export interface FalAiVeo3FastImageToVideoInput {
  prompt: string;
  image_url: string;
  aspect_ratio?: Veo3FastImageToVideoAspectRatioEnum;
  duration?: Veo3FastImageToVideoDurationEnum;
  generate_audio?: boolean;
  resolution?: Veo3FastImageToVideoResolutionEnum;
}

export interface FalAiVeo3FastImageToVideoOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
    file_data?: string;
  };
}

export interface FalAiVeo3FastImageToVideoError {
  error: string;
  details?: string;
}

// ============================================================================
// MAIN EXECUTOR CLASS
// ============================================================================

export class FalAiVeo3FastImageToVideoExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: apiKey });
  }

  /**
   * Generate video from image using Veo3 Fast model via fal.subscribe
   * This method handles the complete video generation process synchronously
   */
  async generateVideo(
    input: FalAiVeo3FastImageToVideoInput,
    options?: {
      logs?: boolean;
      onQueueUpdate?: (update: any) => void;
    }
  ): Promise<FalAiVeo3FastImageToVideoOutput> {
    try {
      this.validateInput(input);

      const result = await fal.subscribe(MODEL_ENDPOINT, {
        input: {
          prompt: input.prompt,
          image_url: input.image_url,
          aspect_ratio: input.aspect_ratio || 'auto',
          duration: input.duration || '8s',
          generate_audio: input.generate_audio !== false,
          resolution: input.resolution || '720p'
        },
        logs: options?.logs || false,
        onQueueUpdate: options?.onQueueUpdate
      });

      return result.data as FalAiVeo3FastImageToVideoOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Veo3 Fast Image-to-Video generation failed: ${errorMessage}`);
    }
  }

  /**
   * Submit a video generation request to the queue (asynchronous)
   * Use this for long-running requests or when you want to handle the queue manually
   */
  async submitVideoGenerationRequest(
    input: FalAiVeo3FastImageToVideoInput,
    webhookUrl?: string
  ): Promise<{ request_id: string }> {
    try {
      this.validateInput(input);

      const { request_id } = await fal.queue.submit(MODEL_ENDPOINT, {
        input: {
          prompt: input.prompt,
          image_url: input.image_url,
          aspect_ratio: input.aspect_ratio || 'auto',
          duration: input.duration || '8s',
          generate_audio: input.generate_audio !== false,
          resolution: input.resolution || '720p'
        },
        webhookUrl
      });

      return { request_id };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to submit Veo3 Fast Image-to-Video request: ${errorMessage}`);
    }
  }

  /**
   * Get the status of a queued request
   */
  async getRequestStatus(requestId: string, logs: boolean = false): Promise<any> {
    try {
      const status = await fal.queue.status(MODEL_ENDPOINT, {
        requestId,
        logs
      });

      return status;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get request status: ${errorMessage}`);
    }
  }

  /**
   * Get the result of a completed request
   */
  async getRequestResult(requestId: string): Promise<FalAiVeo3FastImageToVideoOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId
      });

      return result.data as FalAiVeo3FastImageToVideoOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get request result: ${errorMessage}`);
    }
  }

  /**
   * Calculate the cost for video generation
   * Veo3 Fast pricing: $0.10 per second (audio off), $0.15 per second (audio on)
   */
  calculateCost(
    duration: Veo3FastImageToVideoDurationEnum = '8s',
    generateAudio: boolean = true
  ): number {
    const seconds = parseInt(duration.replace('s', ''));
    const costPerSecond = generateAudio ? 0.15 : 0.10;
    return seconds * costPerSecond;
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: FalAiVeo3FastImageToVideoInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error('Prompt is required and cannot be empty');
    }

    if (!input.image_url || input.image_url.trim().length === 0) {
      throw new Error('Image URL is required and cannot be empty');
    }

    // Validate URL format
    try {
      new URL(input.image_url);
    } catch {
      throw new Error('Invalid image URL format');
    }

    if (input.aspect_ratio && !['auto', '16:9', '9:16'].includes(input.aspect_ratio)) {
      throw new Error('Invalid aspect ratio. Must be auto, 16:9, or 9:16');
    }

    if (input.duration && !['8s'].includes(input.duration)) {
      throw new Error('Invalid duration. Must be 8s');
    }

    if (input.resolution && !['720p', '1080p'].includes(input.resolution)) {
      throw new Error('Invalid resolution. Must be 720p or 1080p');
    }
  }

  /**
   * Get model information and capabilities
   */
  static getModelInfo() {
    return {
      name: 'Fal AI Veo3 Fast Image-to-Video',
      endpoint: MODEL_ENDPOINT,
      description: 'Generate videos by animating an input image using Google\'s Veo 3 Fast model with 50% price drop',
      capabilities: [
        'Image-to-video generation',
        'Natural motion and realistic animations',
        'Control over animation via text prompts',
        'Audio generation support',
        'Multiple aspect ratios (auto, 16:9, 9:16)',
        '720p and 1080p resolution support',
        '8-second video duration',
        'Safety filters applied'
      ],
      pricing: {
        audioOff: '$0.10 per second',
        audioOn: '$0.15 per second',
        example: '5s video with audio on costs $0.75'
      },
      limitations: [
        'Input images up to 8MB in size',
        '720p output resolution (1080p available)',
        '16:9 aspect ratio (auto-cropped if not)',
        '8-second duration only',
        'Safety filters applied to input and output'
      ],
      supportedFormats: {
        input: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'],
        output: ['mp4']
      }
    };
  }

  /**
   * Get supported aspect ratios
   */
  static getSupportedAspectRatios(): Veo3FastImageToVideoAspectRatioEnum[] {
    return ['auto', '16:9', '9:16'];
  }

  /**
   * Get supported durations
   */
  static getSupportedDurations(): Veo3FastImageToVideoDurationEnum[] {
    return ['8s'];
  }

  /**
   * Get supported resolutions
   */
  static getSupportedResolutions(): Veo3FastImageToVideoResolutionEnum[] {
    return ['720p', '1080p'];
  }

  /**
   * Get example usage
   */
  static getExampleUsage() {
    return {
      basic: {
        prompt: "A woman looks into the camera, breathes in, then exclaims energetically, \"have you guys checked out Veo3 Image-to-Video on Fal? It's incredible!\"",
        image_url: "https://storage.googleapis.com/falserverless/example_inputs/veo3-i2v-input.png",
        aspect_ratio: "auto",
        duration: "8s",
        generate_audio: true,
        resolution: "720p"
      },
      withoutAudio: {
        prompt: "A person walking through a forest with leaves falling around them",
        image_url: "https://example.com/forest-image.jpg",
        aspect_ratio: "16:9",
        duration: "8s",
        generate_audio: false,
        resolution: "1080p"
      },
      portrait: {
        prompt: "A chef cooking in a modern kitchen, stirring a pot",
        image_url: "https://example.com/chef-image.jpg",
        aspect_ratio: "9:16",
        duration: "8s",
        generate_audio: true,
        resolution: "720p"
      }
    };
  }

  /**
   * Get prompting guidelines
   */
  static getPromptingGuidelines() {
    return {
      required: [
        'Action: How the image should be animated',
        'Style: Desired animation style'
      ],
      optional: [
        'Camera motion: How camera should move',
        'Ambiance: Desired mood and atmosphere'
      ],
      tips: [
        'Be specific about the animation you want',
        'Describe the movement and actions clearly',
        'Include style preferences for consistency',
        'Mention camera movements for dynamic shots',
        'Add ambiance details for mood setting'
      ],
      examples: [
        'A woman looks into the camera, breathes in, then exclaims energetically',
        'A person walking through a forest with leaves falling around them',
        'A chef cooking in a modern kitchen, stirring a pot with steam rising',
        'A cat stretching and yawning on a windowsill with sunlight streaming in'
      ]
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a new Veo3 Fast Image-to-Video executor instance
 */
export const createVeo3FastImageToVideoExecutor = (apiKey: string) =>
  new FalAiVeo3FastImageToVideoExecutor(apiKey);

/**
 * Quick video generation function
 */
export async function generateVeo3FastImageToVideo(
  apiKey: string,
  prompt: string,
  imageUrl: string,
  options?: Partial<FalAiVeo3FastImageToVideoInput>
): Promise<FalAiVeo3FastImageToVideoOutput> {
  const executor = new FalAiVeo3FastImageToVideoExecutor(apiKey);
  return await executor.generateVideo({
    prompt,
    image_url: imageUrl,
    ...options
  });
}

/**
 * Batch video generation function
 */
export async function generateMultipleVeo3FastImageToVideos(
  apiKey: string,
  inputs: Array<{
    prompt: string;
    imageUrl: string;
    options?: Partial<FalAiVeo3FastImageToVideoInput>;
  }>
): Promise<FalAiVeo3FastImageToVideoOutput[]> {
  const executor = new FalAiVeo3FastImageToVideoExecutor(apiKey);
  const results: FalAiVeo3FastImageToVideoOutput[] = [];

  for (const input of inputs) {
    try {
      const result = await executor.generateVideo({
        prompt: input.prompt,
        image_url: input.imageUrl,
        ...input.options
      });
      results.push(result);
    } catch (error) {
      console.error(`Failed to generate video for prompt: ${input.prompt}`, error);
      throw error;
    }
  }

  return results;
}

export default FalAiVeo3FastImageToVideoExecutor;
