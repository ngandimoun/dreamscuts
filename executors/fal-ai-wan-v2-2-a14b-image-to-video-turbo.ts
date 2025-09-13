import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/wan/v2.2-a14b/image-to-video/turbo';

// Input interface
export interface FalAiWanV22A14bImageToVideoTurboInput {
  image_url: string;
  prompt: string;
  negative_prompt?: string;
  num_frames?: number;
  fps?: number;
  motion_bucket_id?: number;
  cond_aug?: number;
  decoding_t?: number;
  width?: number;
  height?: number;
  num_inference_steps?: number;
  guidance_scale?: number;
  seed?: number;
  loop?: boolean;
}

// Output interface
export interface FalAiWanV22A14bImageToVideoTurboOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error types
export interface FalAiWanV22A14bImageToVideoTurboError {
  message: string;
  code?: string;
}

// Main executor class
export class FalAiWanV22A14bImageToVideoTurboExecutor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  /**
   * Generate video from image using WAN v2.2 A14B Turbo model via fal.subscribe
   * @param input - The input parameters for video generation
   * @param options - Additional options for the request
   * @returns Promise with the generated video result
   */
  async generateVideo(
    input: FalAiWanV22A14bImageToVideoTurboInput,
    options?: {
      logs?: boolean;
      onQueueUpdate?: (update: any) => void;
    }
  ): Promise<FalAiWanV22A14bImageToVideoTurboOutput> {
    try {
      // Validate input
      this.validateInput(input);

      const result = await fal.subscribe(this.modelEndpoint, {
        input,
        logs: options?.logs ?? false,
        onQueueUpdate: options?.onQueueUpdate,
      });

      return result.data as FalAiWanV22A14bImageToVideoTurboOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`WAN video generation failed: ${errorMessage}`);
    }
  }

  /**
   * Submit a video generation request to the queue for long-running processing
   * @param input - The input parameters for video generation
   * @param options - Additional options including webhook URL
   * @returns Promise with the request ID
   */
  async submitToQueue(
    input: FalAiWanV22A14bImageToVideoTurboInput,
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
  static async getQueueResult(requestId: string): Promise<FalAiWanV22A14bImageToVideoTurboOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });

      return result.data as FalAiWanV22A14bImageToVideoTurboOutput;
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
  private validateInput(input: FalAiWanV22A14bImageToVideoTurboInput): void {
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

  /**
   * Get recommended settings for different video types
   * @returns Object with recommendations for different video categories
   */
  static getVideoTypeRecommendations() {
    return {
      subtle_motion: {
        num_frames: 16,
        motion_bucket_id: 64,
        num_inference_steps: 14,
        guidance_scale: 7.5,
        description: 'For subtle movements like gentle swaying or breathing'
      },
      moderate_motion: {
        num_frames: 16,
        motion_bucket_id: 127,
        num_inference_steps: 14,
        guidance_scale: 7.5,
        description: 'For moderate movements like walking or dancing'
      },
      dynamic_motion: {
        num_frames: 24,
        motion_bucket_id: 191,
        num_inference_steps: 20,
        guidance_scale: 8.0,
        description: 'For dynamic movements like running or jumping'
      },
      cinematic: {
        num_frames: 16,
        motion_bucket_id: 127,
        num_inference_steps: 20,
        guidance_scale: 8.5,
        description: 'For cinematic quality with balanced motion'
      },
      artistic: {
        num_frames: 24,
        motion_bucket_id: 191,
        num_inference_steps: 25,
        guidance_scale: 9.0,
        description: 'For artistic expression with high detail'
      }
    };
  }

  /**
   * Get motion bucket ID recommendations
   * @returns Object with motion bucket guidance
   */
  static getMotionBucketRecommendations() {
    return {
      low_motion: {
        range: '1-64',
        description: 'Minimal movement, subtle animations',
        examples: ['Portrait breathing', 'Gentle swaying', 'Static poses with slight motion']
      },
      medium_motion: {
        range: '65-127',
        description: 'Moderate movement, natural motion',
        examples: ['Walking', 'Dancing', 'Gesturing', 'Turning']
      },
      high_motion: {
        range: '128-191',
        description: 'Dynamic movement, active motion',
        examples: ['Running', 'Jumping', 'Spinning', 'Fast dancing']
      },
      extreme_motion: {
        range: '192-255',
        description: 'Intense movement, rapid motion',
        examples: ['Sprinting', 'Acrobatics', 'Fast sports', 'Dramatic actions']
      }
    };
  }

  /**
   * Get prompt optimization tips
   * @returns Object with prompt optimization guidance
   */
  static getPromptOptimizationTips() {
    return {
      structure: [
        'Start with the main subject or action',
        'Include motion descriptors (walking, dancing, spinning)',
        'Add style and mood descriptors',
        'Specify camera movement if desired',
        'Include lighting and atmosphere details'
      ],
      motion_descriptors: [
        'Gentle, subtle, slow, smooth',
        'Dynamic, energetic, fast, dramatic',
        'Rhythmic, flowing, graceful, fluid',
        'Sharp, sudden, explosive, intense'
      ],
      style_descriptors: [
        'Cinematic, professional, artistic',
        'Natural, realistic, authentic',
        'Stylized, cartoon, anime, painterly',
        'Vintage, retro, modern, futuristic'
      ],
      negative_prompt_examples: [
        'blurry, low quality, distorted',
        'static, frozen, motionless',
        'glitch, artifact, noise',
        'unrealistic, artificial, fake'
      ]
    };
  }

  /**
   * Get common use cases and examples
   * @returns Object with use case examples
   */
  static getCommonUseCases() {
    return {
      content_creation: [
        'Social media video content from photos',
        'Marketing material enhancement',
        'Product demonstration videos',
        'Brand storytelling content'
      ],
      entertainment: [
        'Music video creation from album art',
        'Gaming content enhancement',
        'Animation from concept art',
        'Storyboard to video conversion'
      ],
      business: [
        'Professional presentation enhancement',
        'Training material creation',
        'Product showcase videos',
        'Corporate communication content'
      ],
      artistic: [
        'Digital art animation',
        'Concept art visualization',
        'Portrait animation',
        'Abstract art motion'
      ]
    };
  }

  /**
   * Get technical considerations and limitations
   * @returns Object with technical information
   */
  static getTechnicalConsiderations() {
    return {
      processing_time: 'Varies based on frame count, resolution, and inference steps',
      quality_factors: [
        'Input image quality and resolution',
        'Prompt clarity and specificity',
        'Motion bucket ID selection',
        'Inference steps and guidance scale'
      ],
      limitations: [
        'Best results with clear, high-quality input images',
        'Motion complexity affects output quality',
        'Processing time increases with frame count and resolution',
        'Quality depends on prompt engineering'
      ],
      best_practices: [
        'Use high-quality input images',
        'Write clear, descriptive prompts',
        'Test with different motion bucket IDs',
        'Balance quality and processing time'
      ]
    };
  }

  /**
   * Get cost examples for different video lengths and settings
   * @returns Object with cost examples
   */
  static getCostExamples() {
    return {
      short_videos: [
        { frames: 16, resolution: '512x512', steps: 14, estimated_cost: 0.104, description: 'Basic 16-frame video' },
        { frames: 24, resolution: '512x512', steps: 20, estimated_cost: 0.234, description: 'Enhanced 24-frame video' }
      ],
      medium_videos: [
        { frames: 16, resolution: '768x768', steps: 20, estimated_cost: 0.351, description: 'HD quality 16-frame video' },
        { frames: 24, resolution: '768x768', steps: 25, estimated_cost: 0.585, description: 'HD quality 24-frame video' }
      ],
      high_quality: [
        { frames: 24, resolution: '1024x1024', steps: 30, estimated_cost: 1.17, description: 'Ultra HD quality video' },
        { frames: 32, resolution: '1024x1024', steps: 35, estimated_cost: 1.95, description: 'Ultra HD quality extended video' }
      ]
    };
  }

  /**
   * Get performance optimization tips
   * @returns Object with optimization tips
   */
  static getPerformanceOptimizationTips() {
    return {
      input_optimization: [
        'Use high-quality, clear input images',
        'Ensure consistent image format and resolution',
        'Optimize image composition for motion',
        'Prepare images with clear subjects and backgrounds'
      ],
      processing_tips: [
        'Use queue processing for longer videos',
        'Monitor queue status for progress updates',
        'Implement webhook handling for automated processing',
        'Plan processing during off-peak hours'
      ],
      output_optimization: [
        'Choose appropriate motion bucket ID',
        'Balance frame count and quality',
        'Consider inference steps for quality vs speed',
        'Test different settings for optimal results'
      ]
    };
  }

  /**
   * Get troubleshooting tips for common issues
   * @returns Object with troubleshooting guidance
   */
  static getTroubleshootingTips() {
    return {
      quality_issues: [
        'Ensure input image has clear subject and good quality',
        'Try different motion bucket IDs for motion complexity',
        'Adjust inference steps for quality vs speed balance',
        'Verify prompt clarity and specificity'
      ],
      processing_issues: [
        'Use queue processing for longer videos',
        'Check image URL accessibility and format',
        'Verify API key and authentication',
        'Monitor queue status for error messages'
      ],
      motion_issues: [
        'Adjust motion bucket ID for desired motion level',
        'Use appropriate frame count for motion duration',
        'Consider prompt motion descriptors',
        'Balance motion complexity with quality'
      ]
    };
  }
}
