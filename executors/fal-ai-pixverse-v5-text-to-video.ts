import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/pixverse/v5/text-to-video';

// Aspect ratio enum
export type AspectRatioEnum = '16:9' | '4:3' | '1:1' | '3:4' | '9:16';

// Resolution enum
export type PixverseV5ResolutionEnum = '360p' | '540p' | '720p' | '1080p';

// Duration enum
export type DurationEnum = '5' | '8';

// Style enum
export type StyleEnum = 'anime' | '3d_animation' | 'clay' | 'comic' | 'cyberpunk';

// Input interface
export interface FalAiPixverseV5TextToVideoInput {
  prompt: string;
  aspect_ratio?: AspectRatioEnum;
  resolution?: PixverseV5ResolutionEnum;
  duration?: DurationEnum;
  negative_prompt?: string;
  style?: StyleEnum;
  seed?: number;
}

// Output interface
export interface FalAiPixverseV5TextToVideoOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error types
export interface FalAiPixverseV5TextToVideoError {
  message: string;
  code?: string;
}

// Main executor class
export class FalAiPixverseV5TextToVideoExecutor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  /**
   * Generate a video from text prompt
   */
  async generateVideo(
    input: FalAiPixverseV5TextToVideoInput
  ): Promise<FalAiPixverseV5TextToVideoOutput> {
    try {
      this.validateInput(input);

      const result = await fal.subscribe(this.modelEndpoint, {
        input,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            update.logs?.map((log) => log.message).forEach(console.log);
          }
        },
      });

      return result.data as FalAiPixverseV5TextToVideoOutput;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit a request to the queue for long-running generation
   */
  async submitToQueue(
    input: FalAiPixverseV5TextToVideoInput,
    webhookUrl?: string
  ): Promise<{ request_id: string }> {
    try {
      this.validateInput(input);

      const { request_id } = await fal.queue.submit(this.modelEndpoint, {
        input,
        webhookUrl,
      });

      return { request_id };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Check the status of a queued request
   */
  static async checkQueueStatus(
    requestId: string,
    logs = true
  ): Promise<any> {
    try {
      const status = await fal.queue.status(MODEL_ENDPOINT, {
        requestId,
        logs,
      });
      return status;
    } catch (error) {
      throw new Error(`Failed to check queue status: ${error}`);
    }
  }

  /**
   * Get the result of a completed queued request
   */
  static async getQueueResult(
    requestId: string
  ): Promise<FalAiPixverseV5TextToVideoOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });
      return result.data as FalAiPixverseV5TextToVideoOutput;
    } catch (error) {
      throw new Error(`Failed to get queue result: ${error}`);
    }
  }

  /**
   * Calculate the cost based on resolution and duration
   */
  calculateCost(resolution: PixverseV5ResolutionEnum = '720p', duration: DurationEnum = '5'): number {
    const baseCosts = {
      '360p': 0.15,
      '540p': 0.15,
      '720p': 0.2,
      '1080p': 0.4
    };

    const durationMultiplier = duration === '8' ? 2 : 1;
    return baseCosts[resolution] * durationMultiplier;
  }

  /**
   * Get cost examples for different configurations
   */
  getCostExamples() {
    return [
      {
        resolution: '360p',
        duration: '5s',
        cost: this.calculateCost('360p', '5'),
        description: '5-second video at 360p'
      },
      {
        resolution: '540p',
        duration: '5s',
        cost: this.calculateCost('540p', '5'),
        description: '5-second video at 540p'
      },
      {
        resolution: '720p',
        duration: '5s',
        cost: this.calculateCost('720p', '5'),
        description: '5-second video at 720p'
      },
      {
        resolution: '1080p',
        duration: '5s',
        cost: this.calculateCost('1080p', '5'),
        description: '5-second video at 1080p (limited to 5s)'
      },
      {
        resolution: '720p',
        duration: '8s',
        cost: this.calculateCost('720p', '8'),
        description: '8-second video at 720p (double cost)'
      }
    ];
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: FalAiPixverseV5TextToVideoInput): void {
    if (!input.prompt) {
      throw new Error('prompt is required');
    }

    // Validate prompt length
    if (input.prompt.length < 1 || input.prompt.length > 2000) {
      throw new Error('prompt must be between 1 and 2000 characters');
    }

    // Validate negative prompt length if provided
    if (input.negative_prompt && input.negative_prompt.length > 2000) {
      throw new Error('negative_prompt must be less than 2000 characters');
    }

    // Validate seed if provided
    if (input.seed !== undefined) {
      if (input.seed < 0 || input.seed > 999999) {
        throw new Error('seed must be between 0 and 999999');
      }
    }

    // Validate resolution and duration constraints
    if (input.resolution === '1080p' && input.duration === '8') {
      throw new Error('1080p videos are limited to 5 seconds');
    }
  }

  /**
   * Handle errors and provide meaningful messages
   */
  private handleError(error: any): FalAiPixverseV5TextToVideoError {
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'EXECUTION_ERROR',
      };
    }
    return {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    };
  }

  // Static utility methods for recommendations and best practices
  static getAspectRatioRecommendations() {
    return {
      '16:9': { description: 'Widescreen format, ideal for most content', bestFor: 'General videos, social media' },
      '4:3': { description: 'Traditional format, good for presentations', bestFor: 'Educational content, presentations' },
      '1:1': { description: 'Square format, perfect for social media', bestFor: 'Instagram, TikTok, social media' },
      '3:4': { description: 'Portrait format, good for mobile viewing', bestFor: 'Mobile-first content, stories' },
      '9:16': { description: 'Vertical format, ideal for mobile', bestFor: 'Stories, reels, mobile videos' }
    };
  }

  static getResolutionRecommendations() {
    return {
      '360p': { cost: '$0.15', quality: 'Basic', bestFor: 'Testing, quick previews' },
      '540p': { cost: '$0.15', quality: 'Good', bestFor: 'Social media, web content' },
      '720p': { cost: '$0.20', quality: 'High', bestFor: 'Most use cases, professional content' },
      '1080p': { cost: '$0.40', quality: 'Premium', bestFor: 'High-quality content, limited to 5s' }
    };
  }

  static getDurationRecommendations() {
    return {
      '5': { cost: 'Base price', description: 'Standard duration, good for most content' },
      '8': { cost: 'Double price', description: 'Extended duration, costs twice as much' }
    };
  }

  static getStyleRecommendations() {
    return {
      anime: { description: 'Japanese animation style', bestFor: 'Anime content, cartoons' },
      '3d_animation': { description: '3D computer graphics style', bestFor: 'Modern content, gaming' },
      clay: { description: 'Claymation/stop-motion style', bestFor: 'Artistic content, children\'s videos' },
      comic: { description: 'Comic book/graphic novel style', bestFor: 'Storytelling, artistic content' },
      cyberpunk: { description: 'Futuristic, high-tech style', bestFor: 'Sci-fi content, modern aesthetics' }
    };
  }

  static getPromptWritingTips() {
    return [
      'Be specific about visual elements and style',
      'Include details about lighting, atmosphere, and mood',
      'Mention specific art styles or visual references',
      'Describe camera angles and movements if relevant',
      'Keep prompts clear and descriptive',
      'Use vivid, descriptive language for better results'
    ];
  }

  static getNegativePromptTips() {
    return [
      'Specify what you don\'t want to see',
      'Include quality issues to avoid (blurry, low quality)',
      'Mention unwanted elements or styles',
      'Use specific terms for better filtering',
      'Keep negative prompts concise but effective'
    ];
  }

  static getCommonUseCases() {
    return [
      'Social media content creation',
      'Marketing and promotional videos',
      'Educational content and tutorials',
      'Entertainment and gaming content',
      'Artistic and creative projects',
      'Product demonstrations',
      'Storytelling and narrative content',
      'Brand and corporate videos',
      'Personal creative projects',
      'Content for streaming platforms'
    ];
  }

  static getTechnicalConsiderations() {
    return [
      '1080p videos are limited to 5 seconds maximum',
      '8-second videos cost double the base price',
      'Higher resolutions provide better quality but cost more',
      'Seed values ensure reproducible results',
      'Queue processing recommended for long content',
      'Webhook support for production workflows'
    ];
  }

  static getPerformanceOptimizationTips() {
    return [
      'Start with lower resolutions for testing',
      'Use 5-second duration for cost-effective production',
      'Implement queue processing for better reliability',
      'Use webhooks for production workflows',
      'Cache generated videos when possible',
      'Batch multiple requests for efficiency'
    ];
  }

  static getTroubleshootingTips() {
    return [
      'Ensure prompts are clear and descriptive',
      'Check resolution and duration constraints',
      'Use appropriate aspect ratios for your content',
      'Monitor costs with different configurations',
      'Implement proper error handling',
      'Check API key and rate limits'
    ];
  }

  static getModelAdvantages() {
    return [
      'High-quality video generation from text',
      'Multiple style options for different aesthetics',
      'Flexible aspect ratios for various platforms',
      'Cost-effective pricing for different resolutions',
      'Seed-based reproducibility for consistent results',
      'Queue processing for reliable generation',
      'Webhook support for production workflows',
      'Multiple duration options for different needs'
    ];
  }

  static getExamplePrompt() {
    return 'Epic low-cut camera capture of a girl clad in ultraviolet threads, Peter Max art style depiction, luminous diamond skin glistening under a vast moon\'s radiance, embodied in a superhuman flight among mystical ruins, symbolizing a deity\'s ritual ascent, hyper-detailed';
  }

  static getPromptStructureRecommendations() {
    return [
      'Start with the main subject or action',
      'Describe the visual style and aesthetic',
      'Include environmental and atmospheric details',
      'Mention lighting and mood elements',
      'Specify camera angles or movements',
      'End with quality and detail specifications'
    ];
  }

  static getCostOptimizationStrategies() {
    return [
      'Use 360p or 540p for testing and iterations',
      'Reserve 720p for most production content',
      'Use 1080p only for high-priority content (5s max)',
      'Stick to 5-second duration for cost efficiency',
      'Implement efficient queue management',
      'Cache and reuse generated content when possible'
    ];
  }

  static getSupportedAspectRatios() {
    return ['16:9', '4:3', '1:1', '3:4', '9:16'];
  }

  static getSupportedResolutions() {
    return ['360p', '540p', '720p', '1080p'];
  }

  static getSupportedDurations() {
    return ['5', '8'];
  }

  static getSupportedStyles() {
    return ['anime', '3d_animation', 'clay', 'comic', 'cyberpunk'];
  }
}
