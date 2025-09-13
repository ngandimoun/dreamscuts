import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/pixverse/v5/image-to-video';

// Aspect ratio enum
export type PixverseV5ImageToVideoAspectRatioEnum = '16:9' | '4:3' | '1:1' | '3:4' | '9:16';

// Resolution enum
export type PixverseV5ImageToVideoResolutionEnum = '360p' | '540p' | '720p' | '1080p';

// Duration enum
export type PixverseV5ImageToVideoDurationEnum = '5' | '8';

// Style enum
export type PixverseV5ImageToVideoStyleEnum = 'anime' | '3d_animation' | 'clay' | 'comic' | 'cyberpunk';

// Camera movement enum
export type CameraMovementEnum = 
  | 'horizontal_left' | 'horizontal_right' | 'vertical_up' | 'vertical_down'
  | 'zoom_in' | 'zoom_out' | 'crane_up' | 'quickly_zoom_in' | 'quickly_zoom_out'
  | 'smooth_zoom_in' | 'camera_rotation' | 'robo_arm' | 'super_dolly_out'
  | 'whip_pan' | 'hitchcock' | 'left_follow' | 'right_follow' | 'pan_left' | 'pan_right' | 'fix_bg';

// Input interface
export interface FalAiPixverseV5ImageToVideoInput {
  prompt: string;
  image_url: string;
  aspect_ratio?: PixverseV5ImageToVideoAspectRatioEnum;
  resolution?: PixverseV5ImageToVideoResolutionEnum;
  duration?: PixverseV5ImageToVideoDurationEnum;
  negative_prompt?: string;
  style?: PixverseV5ImageToVideoStyleEnum;
  seed?: number;
  camera_movement?: CameraMovementEnum;
}

// Output interface
export interface FalAiPixverseV5ImageToVideoOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error types
export interface FalAiPixverseV5ImageToVideoError {
  message: string;
  code?: string;
}

// Main executor class
export class FalAiPixverseV5ImageToVideoExecutor {
  /**
   * Generate video from image and text prompt synchronously
   */
  async generateVideo(input: FalAiPixverseV5ImageToVideoInput): Promise<FalAiPixverseV5ImageToVideoOutput> {
    try {
      this.validateInput(input);
      
      const result = await fal.subscribe(MODEL_ENDPOINT, {
        input,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            update.logs?.map((log) => log.message).forEach(console.log);
          }
        },
      });

      return result.data as FalAiPixverseV5ImageToVideoOutput;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit video generation request to queue for long-running operations
   */
  async submitToQueue(
    input: FalAiPixverseV5ImageToVideoInput,
    webhookUrl?: string
  ): Promise<{ request_id: string }> {
    try {
      this.validateInput(input);
      
      const { request_id } = await fal.queue.submit(MODEL_ENDPOINT, {
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
  async checkQueueStatus(requestId: string, logs = true): Promise<any> {
    try {
      return await fal.queue.status(MODEL_ENDPOINT, {
        requestId,
        logs,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get the result of a completed queued request
   */
  async getQueueResult(requestId: string): Promise<FalAiPixverseV5ImageToVideoOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });

      return result.data as FalAiPixverseV5ImageToVideoOutput;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Calculate the cost based on resolution and duration
   */
  calculateCost(resolution: PixverseV5ImageToVideoResolutionEnum = '720p', duration: PixverseV5ImageToVideoDurationEnum = '5'): number {
    let baseCost = 0;
    
    switch (resolution) {
      case '360p':
      case '540p':
        baseCost = 0.15;
        break;
      case '720p':
        baseCost = 0.20;
        break;
      case '1080p':
        baseCost = 0.40;
        break;
    }

    // 8-second videos cost double
    if (duration === '8') {
      baseCost *= 2;
    }

    return baseCost;
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: FalAiPixverseV5ImageToVideoInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error('Prompt is required');
    }

    if (input.prompt.length > 2000) {
      throw new Error('Prompt must be 2000 characters or less');
    }

    if (!input.image_url || input.image_url.trim().length === 0) {
      throw new Error('Image URL is required');
    }

    if (input.negative_prompt && input.negative_prompt.length > 2000) {
      throw new Error('Negative prompt must be 2000 characters or less');
    }

    if (input.seed !== undefined && (input.seed < 0 || input.seed > 999999)) {
      throw new Error('Seed must be between 0 and 999999');
    }

    // 1080p videos are limited to 5 seconds
    if (input.resolution === '1080p' && input.duration === '8') {
      throw new Error('1080p resolution is limited to 5 seconds duration');
    }
  }

  /**
   * Handle and format errors
   */
  private handleError(error: any): FalAiPixverseV5ImageToVideoError {
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
  static getRecommendations() {
    return {
      aspectRatio: {
        '16:9': 'Best for widescreen content, social media, and general video content',
        '4:3': 'Good for traditional video formats and some social platforms',
        '1:1': 'Perfect for Instagram, TikTok, and square video platforms',
        '3:4': 'Ideal for mobile-first content and portrait videos',
        '9:16': 'Best for mobile vertical videos, Instagram Stories, TikTok',
      },
      resolution: {
        '360p': 'Lowest cost, good for testing and previews',
        '540p': 'Cost-effective for social media and web content',
        '720p': 'Balanced quality and cost, recommended for most use cases',
        '1080p': 'Highest quality, limited to 5 seconds, best for premium content',
      },
      duration: {
        '5': 'Standard duration, most cost-effective option',
        '8': 'Extended duration, costs double, not available for 1080p',
      },
      style: {
        'anime': 'Japanese animation style with vibrant colors and expressive characters',
        '3d_animation': 'Three-dimensional computer-generated animation style',
        'clay': 'Stop-motion clay animation aesthetic',
        'comic': 'Comic book and graphic novel visual style',
        'cyberpunk': 'Futuristic, high-tech aesthetic with neon colors',
      },
      cameraMovement: {
        'zoom_in': 'Gradual zoom toward the subject',
        'zoom_out': 'Gradual zoom away from the subject',
        'pan_left': 'Horizontal camera movement to the left',
        'pan_right': 'Horizontal camera movement to the right',
        'crane_up': 'Camera movement upward for dramatic effect',
        'fix_bg': 'Static camera with moving subject',
      },
    };
  }

  static getBestPractices() {
    return {
      promptWriting: [
        'Be specific and descriptive about the desired visual elements',
        'Include details about lighting, mood, and atmosphere',
        'Specify character actions and expressions clearly',
        'Use vivid adjectives to guide the visual style',
        'Keep prompts under 2000 characters for optimal processing',
      ],
      imagePreparation: [
        'Use high-quality, clear images as starting points',
        'Ensure the image has good contrast and lighting',
        'Choose images that match your desired aspect ratio',
        'Avoid images with too many small details that may not translate well',
        'Use images with clear subjects and good composition',
      ],
      styleSelection: [
        'Choose style based on your target audience and content type',
        'Consider the emotional tone you want to convey',
        'Match style with your brand or project aesthetic',
        'Test different styles to find the best fit for your content',
        'Use style to differentiate your content from competitors',
      ],
      cameraMovement: [
        'Select camera movement that enhances your narrative',
        'Use subtle movements for professional content',
        'Apply dramatic movements for entertainment content',
        'Consider how movement affects viewer attention',
        'Balance movement with content clarity',
      ],
      costOptimization: [
        'Start with 720p for testing, then scale up if needed',
        'Use 5-second duration for cost-effective content creation',
        'Reserve 1080p for premium, short-form content',
        'Batch multiple requests to optimize processing time',
        'Use queue processing for longer videos to avoid timeouts',
      ],
    };
  }

  static getUseCases() {
    return {
      marketing: [
        'Product demonstrations with dynamic camera movements',
        'Brand storytelling with consistent visual style',
        'Social media campaigns with platform-optimized formats',
        'Promotional videos with engaging visual effects',
      ],
      entertainment: [
        'Short-form content for social media platforms',
        'Creative storytelling with artistic style options',
        'Gaming content with dynamic visual effects',
        'Music video concepts and visualizers',
      ],
      education: [
        'Explainer videos with clear visual progression',
        'Tutorial content with step-by-step visual guidance',
        'Educational storytelling with engaging visuals',
        'Concept visualization for complex topics',
      ],
      business: [
        'Corporate presentations with professional styling',
        'Training materials with clear visual communication',
        'Client presentations with branded visual elements',
        'Internal communications with engaging visuals',
      ],
      personal: [
        'Creative projects and artistic expression',
        'Personal storytelling and memory preservation',
        'Hobby content with specialized visual styles',
        'Social media personal branding',
      ],
    };
  }

  static getTechnicalConsiderations() {
    return {
      processingTime: [
        '5-second videos typically process faster than 8-second videos',
        'Higher resolutions require more processing time',
        'Complex prompts may increase generation time',
        'Use queue processing for videos longer than 30 seconds',
      ],
      qualityOptimization: [
        'Balance resolution with duration for optimal results',
        'Use negative prompts to avoid unwanted elements',
        'Experiment with different seeds for varied results',
        'Consider aspect ratio for platform compatibility',
      ],
      fileManagement: [
        'Generated videos are automatically hosted and accessible via URL',
        'Videos include metadata like file size and content type',
        'Download videos promptly as URLs may expire',
        'Consider local storage for important generated content',
      ],
      apiLimitations: [
        '1080p resolution limited to 5 seconds maximum',
        '8-second duration costs double the base price',
        'Maximum prompt length of 2000 characters',
        'Seed values must be between 0 and 999999',
      ],
    };
  }

  static getPerformanceOptimization() {
    return {
      promptOptimization: [
        'Use clear, specific language to reduce processing iterations',
        'Avoid overly complex or contradictory descriptions',
        'Include relevant style keywords for better results',
        'Keep prompts focused on visual elements rather than abstract concepts',
      ],
      parameterTuning: [
        'Start with default values and adjust based on results',
        'Use consistent seeds for reproducible results',
        'Test different aspect ratios for your specific use case',
        'Balance resolution and duration for optimal cost-performance',
      ],
      batchProcessing: [
        'Submit multiple requests to queue for efficient processing',
        'Use webhooks for automated result handling',
        'Monitor queue status for optimal resource management',
        'Plan processing during off-peak hours if possible',
      ],
    };
  }

  static getTroubleshooting() {
    return {
      commonIssues: [
        'Prompt too long: Ensure prompts are under 2000 characters',
        'Invalid resolution/duration: 1080p limited to 5 seconds',
        'Image URL issues: Ensure image URLs are publicly accessible',
        'Processing timeouts: Use queue processing for longer videos',
      ],
      errorHandling: [
        'Check API key configuration and permissions',
        'Verify input parameter validation and constraints',
        'Monitor queue status for long-running requests',
        'Review error logs for specific failure reasons',
      ],
      qualityIssues: [
        'Use negative prompts to avoid unwanted visual elements',
        'Adjust style parameters for better aesthetic control',
        'Experiment with different seeds for varied results',
        'Consider resolution trade-offs for your specific use case',
      ],
    };
  }

  static getModelAdvantages() {
    return {
      quality: [
        'High-quality video generation from image inputs',
        'Multiple artistic style options for creative flexibility',
        'Advanced camera movement controls for dynamic content',
        'Professional-grade output suitable for commercial use',
      ],
      flexibility: [
        'Wide range of aspect ratios for platform compatibility',
        'Multiple resolution options with cost scaling',
        'Duration flexibility with pricing considerations',
        'Style customization for brand consistency',
      ],
      efficiency: [
        'Fast processing for standard duration videos',
        'Queue processing for long-running operations',
        'Cost-effective pricing for various quality levels',
        'Automatic file hosting and management',
      ],
      integration: [
        'Simple API integration with comprehensive documentation',
        'Webhook support for automated workflows',
        'Real-time progress monitoring and logging',
        'Compatible with existing fal.ai infrastructure',
      ],
    };
  }

  static getExamplePrompts() {
    return {
      marketing: [
        'A professional woman in business attire confidently presenting to a modern office audience, with smooth camera movement and corporate styling',
        'Product showcase with dynamic lighting and professional camera work, highlighting key features with cinematic quality',
        'Brand story visualization with consistent visual identity and engaging narrative progression',
      ],
      entertainment: [
        'Epic fantasy scene with magical creatures and dynamic camera movements, creating cinematic adventure atmosphere',
        'Sci-fi action sequence with futuristic elements and dramatic lighting, emphasizing movement and energy',
        'Comedic sketch with expressive characters and engaging visual storytelling',
      ],
      education: [
        'Step-by-step tutorial visualization with clear progression and educational clarity',
        'Concept explanation with visual metaphors and engaging animations',
        'Historical recreation with authentic period details and educational accuracy',
      ],
      artistic: [
        'Surreal dreamscape with abstract elements and artistic interpretation',
        'Nature-inspired artwork with organic movement and natural beauty',
        'Urban exploration with street art aesthetics and city life energy',
      ],
    };
  }

  static getPromptStructure() {
    return {
      subject: 'Describe the main subject or character clearly',
      action: 'Specify what the subject is doing or how they are moving',
      environment: 'Detail the setting, background, and surroundings',
      mood: 'Convey the emotional tone and atmosphere',
      style: 'Include artistic style preferences and visual elements',
      technical: 'Add camera movement, lighting, and composition details',
    };
  }

  static getCostOptimization() {
    return {
      resolutionStrategy: [
        'Use 720p for most content to balance quality and cost',
        'Reserve 1080p for premium, short-form content only',
        'Consider 540p for social media content where quality is sufficient',
        'Use 360p for testing and preview purposes',
      ],
      durationOptimization: [
        'Default to 5-second duration for cost-effective content',
        'Use 8-second duration only when necessary for storytelling',
        'Plan content to fit within 5-second constraints when possible',
        'Batch multiple 5-second videos for longer content needs',
      ],
      batchProcessing: [
        'Submit multiple requests to queue for efficient processing',
        'Use webhooks to handle results automatically',
        'Process during off-peak hours if possible',
        'Plan content creation in advance to optimize resource usage',
      ],
      qualityBalance: [
        'Match resolution to content importance and distribution platform',
        'Use style options to enhance visual appeal without increasing cost',
        'Optimize prompts for better results with fewer iterations',
        'Consider the target platform\'s quality requirements',
      ],
    };
  }
}
