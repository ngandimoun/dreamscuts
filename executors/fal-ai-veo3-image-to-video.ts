import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/veo3/image-to-video';

// Input interface
export interface FalAiVeo3ImageToVideoInput {
  image_url: string;
  prompt: string;
  negative_prompt?: string;
  num_frames?: number;
  fps?: number;
  width?: number;
  height?: number;
  num_inference_steps?: number;
  guidance_scale?: number;
  seed?: number;
  loop?: boolean;
  motion_bucket_id?: number;
  cond_aug?: number;
  decoding_t?: number;
}

// Output interface
export interface FalAiVeo3ImageToVideoOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error types
export interface FalAiVeo3ImageToVideoError {
  message: string;
  code?: string;
}

// Main executor class
export class FalAiVeo3ImageToVideoExecutor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  /**
   * Generate video from image using Veo3 model via fal.subscribe
   * @param input - The input parameters for video generation
   * @param options - Additional options for the request
   * @returns Promise with the generated video result
   */
  async generateVideo(
    input: FalAiVeo3ImageToVideoInput,
    options?: {
      logs?: boolean;
      onQueueUpdate?: (update: any) => void;
    }
  ): Promise<FalAiVeo3ImageToVideoOutput> {
    try {
      // Validate input
      this.validateInput(input);

      const result = await fal.subscribe(this.modelEndpoint, {
        input,
        logs: options?.logs ?? false,
        onQueueUpdate: options?.onQueueUpdate,
      });

      return result.data as FalAiVeo3ImageToVideoOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Veo3 video generation failed: ${errorMessage}`);
    }
  }

  /**
   * Submit a video generation request to the queue for long-running processing
   * @param input - The input parameters for video generation
   * @param options - Additional options including webhook URL
   * @returns Promise with the request ID
   */
  async submitToQueue(
    input: FalAiVeo3ImageToVideoInput,
    options?: {
      webhookUrl?: string;
    }
  ): Promise<{ request_id: string }> {
    try {
      // Validate input
      this.validateInput(input);

      const result = await fal.queue.submit(this.modelEndpoint, {
        input,
        webhookUrl: options?.webhookUrl,
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Queue submission failed: ${errorMessage}`);
    }
  }

  /**
   * Check the status of a queued request
   * @param requestId - The request ID from queue submission
   * @param includeLogs - Whether to include logs in the response
   * @returns Promise with the queue status
   */
  static async checkQueueStatus(
    requestId: string,
    includeLogs = false
  ): Promise<any> {
    try {
      const status = await fal.queue.status(MODEL_ENDPOINT, {
        requestId,
        logs: includeLogs,
      });
      return status;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Status check failed: ${errorMessage}`);
    }
  }

  /**
   * Get the result of a completed queued request
   * @param requestId - The request ID from queue submission
   * @returns Promise with the generated video result
   */
  static async getQueueResult(requestId: string): Promise<FalAiVeo3ImageToVideoOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });

      return result.data as FalAiVeo3ImageToVideoOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Result retrieval failed: ${errorMessage}`);
    }
  }

  /**
   * Calculate the cost for video generation based on compute seconds
   * @param computeSeconds - Number of compute seconds required
   * @returns Cost in USD
   */
  calculateCost(computeSeconds: number): number {
    if (computeSeconds <= 0) {
      throw new Error('Compute seconds must be greater than 0');
    }
    // Base cost: $0.0013 per compute second
    const baseCost = 0.0013;
    return computeSeconds * baseCost;
  }

  /**
   * Estimate compute seconds based on video generation parameters
   * @param numFrames - Number of frames to generate
   * @param width - Video width in pixels
   * @param height - Video height in pixels
   * @param numInferenceSteps - Number of inference steps
   * @param motionBucketId - Motion bucket ID (affects complexity)
   * @returns Estimated compute seconds
   */
  estimateComputeSeconds(
    numFrames: number = 16,
    width: number = 512,
    height: number = 512,
    numInferenceSteps: number = 14,
    motionBucketId: number = 127
  ): number {
    if (numFrames <= 0) {
      throw new Error('Number of frames must be greater than 0');
    }
    if (width <= 0 || height <= 0) {
      throw new Error('Width and height must be greater than 0');
    }
    if (numInferenceSteps <= 0) {
      throw new Error('Number of inference steps must be greater than 0');
    }

    // Base computation time per frame
    const baseComputationPerFrame = 0.5;
    
    // Resolution multiplier (higher resolution = more computation)
    const resolutionMultiplier = Math.sqrt((width * height) / (512 * 512));
    
    // Inference steps multiplier
    const stepsMultiplier = numInferenceSteps / 14;
    
    // Motion complexity multiplier (higher motion bucket = more computation)
    const motionMultiplier = 1 + (motionBucketId / 127) * 0.3;
    
    return numFrames * baseComputationPerFrame * resolutionMultiplier * stepsMultiplier * motionMultiplier;
  }

  /**
   * Validate input parameters
   * @param input - The input parameters to validate
   */
  private validateInput(input: FalAiVeo3ImageToVideoInput): void {
    if (!input.image_url) {
      throw new Error('image_url is required');
    }
    
    if (!input.prompt) {
      throw new Error('prompt is required');
    }
    
    // Validate URL format
    try {
      new URL(input.image_url);
    } catch {
      throw new Error('Invalid URL format for image_url');
    }

    // Validate optional parameters
    if (input.num_frames !== undefined && (input.num_frames < 1 || input.num_frames > 32)) {
      throw new Error('num_frames must be between 1 and 32');
    }
    
    if (input.fps !== undefined && (input.fps < 1 || input.fps > 60)) {
      throw new Error('fps must be between 1 and 60');
    }
    
    if (input.motion_bucket_id !== undefined && (input.motion_bucket_id < 1 || input.motion_bucket_id > 255)) {
      throw new Error('motion_bucket_id must be between 1 and 255');
    }
    
    if (input.cond_aug !== undefined && (input.cond_aug < 0 || input.cond_aug > 1)) {
      throw new Error('cond_aug must be between 0 and 1');
    }
    
    if (input.decoding_t !== undefined && (input.decoding_t < 1 || input.decoding_t > 20)) {
      throw new Error('decoding_t must be between 1 and 20');
    }
    
    if (input.width !== undefined && (input.width < 256 || input.width > 1024)) {
      throw new Error('width must be between 256 and 1024');
    }
    
    if (input.height !== undefined && (input.height < 256 || input.height > 1024)) {
      throw new Error('height must be between 256 and 1024');
    }
    
    if (input.num_inference_steps !== undefined && (input.num_inference_steps < 1 || input.num_inference_steps > 50)) {
      throw new Error('num_inference_steps must be between 1 and 50');
    }
    
    if (input.guidance_scale !== undefined && (input.guidance_scale < 0 || input.guidance_scale > 20)) {
      throw new Error('guidance_scale must be between 0 and 20');
    }
    
    if (input.seed !== undefined && (input.seed < 0 || input.seed > 2147483647)) {
      throw new Error('seed must be between 0 and 2147483647');
    }
  }

  // Utility methods for common use cases
  static getVideoTypeRecommendations() {
    return {
      short_clips: {
        frames: 16,
        fps: 8,
        description: 'Perfect for social media clips and quick demonstrations'
      },
      standard_videos: {
        frames: 24,
        fps: 12,
        description: 'Balanced quality and performance for most use cases'
      },
      cinematic_videos: {
        frames: 32,
        fps: 16,
        description: 'High-quality videos for professional content'
      }
    };
  }

  static getMotionBucketRecommendations() {
    return {
      subtle: {
        range: '1-50',
        description: 'Minimal motion, perfect for gentle animations'
      },
      moderate: {
        range: '51-127',
        description: 'Balanced motion, good for natural movement'
      },
      dynamic: {
        range: '128-200',
        description: 'High motion, ideal for action scenes'
      },
      extreme: {
        range: '201-255',
        description: 'Maximum motion, for dramatic effects'
      }
    };
  }

  static getPromptOptimizationTips() {
    return [
      'Be specific about the type of motion you want',
      'Include directional cues (e.g., "camera pans left", "object rotates")',
      'Describe the mood and atmosphere',
      'Mention camera movements and angles',
      'Specify timing and pacing of the animation'
    ];
  }

  static getCommonUseCases() {
    return [
      'Product demonstrations and showcases',
      'Social media content creation',
      'Marketing and advertising videos',
      'Educational content and tutorials',
      'Artistic and creative projects',
      'E-commerce product videos',
      'Portfolio presentations',
      'Event and celebration videos'
    ];
  }

  static getTechnicalConsiderations() {
    return [
      'Higher resolution requires more compute time and cost',
      'More frames result in longer videos but higher costs',
      'Motion bucket ID significantly affects processing time',
      'Inference steps impact quality vs. speed trade-off',
      'Seed values ensure reproducible results',
      'Loop option creates seamless looping videos'
    ];
  }

  static getCostExamples() {
    return [
      {
        scenario: 'Basic 16-frame video (512x512)',
        estimated_cost: '$0.104',
        description: 'Quick social media clip'
      },
      {
        scenario: 'Enhanced 24-frame video (512x512)',
        estimated_cost: '$0.234',
        description: 'Standard promotional video'
      },
      {
        scenario: 'HD quality 16-frame video (768x768)',
        estimated_cost: '$0.351',
        description: 'Professional content'
      },
      {
        scenario: 'Ultra HD quality 24-frame video (1024x1024)',
        estimated_cost: '$1.17',
        description: 'High-end production'
      }
    ];
  }

  static getPerformanceOptimizationTips() {
    return [
      'Start with lower resolution for testing',
      'Use moderate motion bucket IDs for faster processing',
      'Balance inference steps between quality and speed',
      'Consider queue processing for longer videos',
      'Use webhooks for efficient result handling'
    ];
  }

  static getTroubleshootingTips() {
    return [
      'Ensure image URL is publicly accessible',
      'Check that prompt is descriptive and clear',
      'Verify resolution is within supported range',
      'Use appropriate motion bucket ID for desired effect',
      'Monitor queue status for long-running requests'
    ];
  }
}
