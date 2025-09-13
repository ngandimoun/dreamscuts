import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/framepack/f1';

// Input interface
export interface FramepackF1Input {
  prompt: string; // Text prompt for video generation (max 500 characters)
  image_url: string; // URL of the image input
  negative_prompt?: string; // Negative prompt for video generation
  seed?: number; // The seed to use for generating the video
  aspect_ratio?: '16:9' | '9:16'; // The aspect ratio of the video to generate
  resolution?: '480p' | '720p'; // The resolution of the video to generate
  cfg_scale?: number; // Classifier-Free Guidance scale for the generation
  guidance_scale?: number; // Guidance scale for the generation
  num_frames?: number; // The number of frames to generate
  enable_safety_checker?: boolean; // If set to true, the safety checker will be enabled
}

// Output interface
export interface FramepackF1Output {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  seed: number; // The seed used for generating the video
}

// Error interface
export interface FramepackF1Error {
  error: string;
  details?: string;
  code?: string;
}

// Default configuration
const DEFAULT_CONFIG: Partial<FramepackF1Input> = {
  negative_prompt: '',
  aspect_ratio: '16:9',
  resolution: '480p',
  cfg_scale: 1,
  guidance_scale: 10,
  num_frames: 180,
  enable_safety_checker: true
};

export class FramepackF1Executor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  /**
   * Generate video synchronously
   */
  async generateVideo(input: FramepackF1Input): Promise<FramepackF1Output> {
    try {
      const config = { ...DEFAULT_CONFIG, ...input };
      
      const result = await fal.subscribe(this.modelEndpoint, {
        input: config,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs?.forEach((log) => console.log(log.message));
          }
        },
      });

      return {
        video: {
          url: (result as any).video?.url || '',
          content_type: (result as any).video?.content_type,
          file_name: (result as any).video?.file_name,
          file_size: (result as any).video?.file_size,
        },
        seed: (result as any).seed || 0
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate video asynchronously using queue
   */
  async generateVideoAsync(
    input: FramepackF1Input,
    webhookUrl?: string
  ): Promise<{ requestId: string; status: string }> {
    try {
      const config = { ...DEFAULT_CONFIG, ...input };
      
      const { request_id } = await fal.queue.submit(this.modelEndpoint, {
        input: config,
        webhookUrl
      });

      return {
        requestId: request_id,
        status: 'submitted'
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Check queue status
   */
  async checkStatus(requestId: string): Promise<{ status: string; logs?: string[] }> {
    try {
      const status = await fal.queue.status(this.modelEndpoint, { requestId, logs: true });
      return {
        status: status.status,
        logs: status.status === 'IN_PROGRESS' || status.status === 'COMPLETED' ? (status as any).logs?.map((log: any) => log.message) : undefined
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get result from queue
   */
  async getResult(requestId: string): Promise<FramepackF1Output> {
    try {
      const result = await fal.queue.result(this.modelEndpoint, { requestId });
      
      return {
        video: {
          url: (result as any).video?.url || '',
          content_type: (result as any).video?.content_type,
          file_name: (result as any).video?.file_name,
          file_size: (result as any).video?.file_size,
        },
        seed: (result as any).seed || 0
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Calculate cost for video generation
   */
  calculateCost(resolution: '480p' | '720p', numFrames: number = 180): number {
    // Base cost per compute second
    const baseCostPerSecond = 0.0333;
    
    // 720p generations cost 1.5x more than 480p generations
    const resolutionMultiplier = resolution === '720p' ? 1.5 : 1.0;
    
    // Estimate compute time based on frames (rough approximation)
    const estimatedSeconds = numFrames / 30; // Assuming 30fps processing
    
    return baseCostPerSecond * resolutionMultiplier * estimatedSeconds;
  }

  /**
   * Validate input parameters
   */
  validateInput(input: FramepackF1Input): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.prompt) {
      errors.push('Prompt is required');
    }

    if (input.prompt && input.prompt.length > 500) {
      errors.push('Prompt must be 500 characters or less');
    }

    if (!input.image_url) {
      errors.push('Image URL is required');
    }

    if (input.seed !== undefined && (input.seed < 0 || input.seed > 2147483647)) {
      errors.push('Seed must be between 0 and 2147483647');
    }

    if (input.aspect_ratio && !['16:9', '9:16'].includes(input.aspect_ratio)) {
      errors.push('Aspect ratio must be either "16:9" or "9:16"');
    }

    if (input.resolution && !['480p', '720p'].includes(input.resolution)) {
      errors.push('Resolution must be either "480p" or "720p"');
    }

    if (input.cfg_scale !== undefined && (input.cfg_scale < 0 || input.cfg_scale > 20)) {
      errors.push('CFG scale must be between 0 and 20');
    }

    if (input.guidance_scale !== undefined && (input.guidance_scale < 0 || input.guidance_scale > 20)) {
      errors.push('Guidance scale must be between 0 and 20');
    }

    if (input.num_frames !== undefined && (input.num_frames < 1 || input.num_frames > 1000)) {
      errors.push('Number of frames must be between 1 and 1000');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get available aspect ratios
   */
  getAvailableAspectRatios(): Array<{ value: string; description: string; useCase: string }> {
    return [
      { value: '16:9', description: 'Widescreen landscape', useCase: 'Standard video content, landscape videos' },
      { value: '9:16', description: 'Portrait vertical', useCase: 'Mobile content, social media stories' }
    ];
  }

  /**
   * Get available resolutions
   */
  getAvailableResolutions(): Array<{ value: string; description: string; costMultiplier: number; useCase: string }> {
    return [
      { value: '480p', description: 'Standard definition', costMultiplier: 1.0, useCase: 'Cost-effective generation, previews' },
      { value: '720p', description: 'High definition', costMultiplier: 1.5, useCase: 'Professional quality, final output' }
    ];
  }

  /**
   * Get available frame count options
   */
  getAvailableFrameCounts(): Array<{ value: number; description: string; duration: string; useCase: string }> {
    return [
      { value: 60, description: 'Short video', duration: '2 seconds', useCase: 'Quick previews, social media clips' },
      { value: 120, description: 'Medium video', duration: '4 seconds', useCase: 'Standard content, demonstrations' },
      { value: 180, description: 'Standard video', duration: '6 seconds', useCase: 'Default setting, balanced content' },
      { value: 240, description: 'Long video', duration: '8 seconds', useCase: 'Extended content, detailed scenes' },
      { value: 300, description: 'Extended video', duration: '10 seconds', useCase: 'Comprehensive scenes, storytelling' }
    ];
  }

  /**
   * Get model information
   */
  getModelInfo(): { name: string; version: string; description: string; capabilities: string[] } {
    return {
      name: 'Framepack F1',
      version: '1.0',
      description: 'Efficient Image-to-video model that autoregressively generates videos',
      capabilities: [
        'Autoregressive video generation',
        'Image-to-video transformation',
        'Configurable aspect ratios and resolutions',
        'Frame count control',
        'Safety checker integration',
        'Seed-based reproducibility',
        'Cost-effective generation'
      ]
    };
  }

  /**
   * Get optimal settings for different use cases
   */
  getOptimalSettings(useCase: 'preview' | 'social_media' | 'professional' | 'storytelling' | 'cost_effective'): Partial<FramepackF1Input> {
    switch (useCase) {
      case 'preview':
        return { resolution: '480p', num_frames: 60, enable_safety_checker: true };
      case 'social_media':
        return { resolution: '720p', num_frames: 120, aspect_ratio: '9:16', enable_safety_checker: true };
      case 'professional':
        return { resolution: '720p', num_frames: 180, aspect_ratio: '16:9', enable_safety_checker: true };
      case 'storytelling':
        return { resolution: '720p', num_frames: 300, aspect_ratio: '16:9', enable_safety_checker: true };
      case 'cost_effective':
        return { resolution: '480p', num_frames: 120, aspect_ratio: '16:9', enable_safety_checker: true };
      default:
        return { resolution: '480p', num_frames: 180, aspect_ratio: '16:9', enable_safety_checker: true };
    }
  }

  /**
   * Get cost comparison for different resolutions and frame counts
   */
  getCostComparison(): Array<{ resolution: string; frames: number; estimatedCost: number; duration: string }> {
    const frameCounts = [60, 120, 180, 240, 300];
    const resolutions: Array<'480p' | '720p'> = ['480p', '720p'];
    
    return frameCounts.flatMap(frames => 
      resolutions.map(resolution => ({
        resolution,
        frames,
        estimatedCost: this.calculateCost(resolution, frames),
        duration: `${(frames / 30).toFixed(1)}s`
      }))
    );
  }

  /**
   * Check if aspect ratio is supported
   */
  isAspectRatioSupported(aspectRatio: string): boolean {
    return ['16:9', '9:16'].includes(aspectRatio);
  }

  /**
   * Check if resolution is supported
   */
  isResolutionSupported(resolution: string): boolean {
    return ['480p', '720p'].includes(resolution);
  }

  /**
   * Check if frame count is supported
   */
  isFrameCountSupported(frameCount: number): boolean {
    return frameCount >= 1 && frameCount <= 1000;
  }

  /**
   * Get recommended settings for image type
   */
  getRecommendedSettingsForImage(imageType: 'landscape' | 'portrait' | 'square'): Partial<FramepackF1Input> {
    switch (imageType) {
      case 'landscape':
        return { aspect_ratio: '16:9', resolution: '720p' };
      case 'portrait':
        return { aspect_ratio: '9:16', resolution: '720p' };
      case 'square':
        return { aspect_ratio: '16:9', resolution: '720p' }; // Can be cropped to either
      default:
        return { aspect_ratio: '16:9', resolution: '480p' };
    }
  }

  /**
   * Get prompt optimization tips
   */
  getPromptOptimizationTips(): string[] {
    return [
      'Keep prompts under 500 characters for optimal performance',
      'Use descriptive, vivid language for better video quality',
      'Include specific details about motion and movement',
      'Mention lighting and atmosphere for enhanced realism',
      'Avoid overly complex or contradictory descriptions',
      'Use positive, clear language rather than negative statements',
      'Consider the relationship between your image and prompt'
    ];
  }

  /**
   * Get negative prompt suggestions
   */
  getNegativePromptSuggestions(): string[] {
    return [
      'Ugly, blurry, distorted, bad quality',
      'Low resolution, pixelated, artifacts',
      'Unrealistic, cartoon, anime style',
      'Poor lighting, dark, overexposed',
      'Jagged edges, noise, compression artifacts',
      'Unnatural movement, glitch, error',
      'Watermark, signature, text overlay'
    ];
  }

  /**
   * Get example prompts
   */
  getExamplePrompts(): Array<{ prompt: string; category: string; description: string }> {
    return [
      {
        prompt: 'A mesmerizing video of a deep sea jellyfish moving through an inky-black ocean. The jellyfish glows softly with an amber bioluminescence. The overall scene is lifelike.',
        category: 'Nature',
        description: 'Deep sea bioluminescent scene'
      },
      {
        prompt: 'A majestic eagle soaring through a clear blue sky, wings spread wide, catching thermal updrafts. The bird glides gracefully over mountain peaks.',
        category: 'Wildlife',
        description: 'Aerial wildlife scene'
      },
      {
        prompt: 'A cozy coffee shop interior with warm lighting, steam rising from cups, people chatting quietly. The atmosphere is inviting and peaceful.',
        category: 'Urban',
        description: 'Cozy indoor scene'
      },
      {
        prompt: 'A magical forest with floating lanterns, fireflies dancing between ancient trees, and a gentle breeze moving through the leaves.',
        category: 'Fantasy',
        description: 'Enchanted forest scene'
      }
    ];
  }

  /**
   * Get supported image formats
   */
  getSupportedImageFormats(): string[] {
    return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];
  }

  /**
   * Get video output information
   */
  getVideoOutputInfo(): { format: string; codec: string; quality: string; compatibility: string[] } {
    return {
      format: 'MP4',
      codec: 'H.264',
      quality: 'High quality with configurable resolution',
      compatibility: ['Web browsers', 'Mobile devices', 'Video players', 'Social media platforms']
    };
  }

  /**
   * Handle errors consistently
   */
  private handleError(error: any): FramepackF1Error {
    if (error instanceof Error) {
      return {
        error: error.message,
        details: error.stack,
        code: 'EXECUTION_ERROR'
      };
    }

    if (typeof error === 'string') {
      return {
        error,
        code: 'STRING_ERROR'
      };
    }

    return {
      error: 'Unknown error occurred',
      details: JSON.stringify(error),
      code: 'UNKNOWN_ERROR'
    };
  }
}
