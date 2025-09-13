import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'moonvalley/marey/i2v';

// Input interface
export interface MoonvalleyMareyI2VInput {
  prompt: string;
  image_url: string;
  dimensions?: '1920x1080' | '1080x1920' | '1152x1152' | '1536x1152' | '1152x1536';
  duration?: '5s' | '10s';
  negative_prompt?: string;
  seed?: number;
}

// Output interface
export interface MoonvalleyMareyI2VOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error types
export interface MoonvalleyMareyI2VError {
  message: string;
  code?: string;
}

// Main executor class
export class MoonvalleyMareyI2VExecutor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  /**
   * Generate video from image using fal.subscribe for real-time updates
   */
  async generateVideo(
    input: MoonvalleyMareyI2VInput
  ): Promise<MoonvalleyMareyI2VOutput> {
    try {
      this.validateInput(input);

      const result = await fal.subscribe(this.modelEndpoint, {
        input,
        pollInterval: 1000, // Poll every second
      });

      return result as unknown as MoonvalleyMareyI2VOutput;
    } catch (error) {
      throw {
        message: `Video generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'GENERATION_FAILED',
      } as MoonvalleyMareyI2VError;
    }
  }

  /**
   * Submit video generation request to queue for long-running operations
   */
  async submitToQueue(
    input: MoonvalleyMareyI2VInput
  ): Promise<{ request_id: string }> {
    try {
      this.validateInput(input);

      const result = await fal.queue.submit(this.modelEndpoint, {
        input,
      });

      return { request_id: result.request_id };
    } catch (error) {
      throw {
        message: `Failed to submit to queue: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'QUEUE_SUBMIT_FAILED',
      } as MoonvalleyMareyI2VError;
    }
  }

  /**
   * Check the status of a queued request
   */
  static async checkQueueStatus(requestId: string): Promise<any> {
    try {
      const status = await fal.queue.status('moonvalley/marey/i2v', { requestId });
      return status;
    } catch (error) {
      throw {
        message: `Failed to check queue status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'STATUS_CHECK_FAILED',
      } as MoonvalleyMareyI2VError;
    }
  }

  /**
   * Get the result of a completed queued request
   */
  static async getQueueResult(requestId: string): Promise<MoonvalleyMareyI2VOutput> {
    try {
      const result = await fal.queue.result('moonvalley/marey/i2v', { requestId });
      return result as unknown as MoonvalleyMareyI2VOutput;
    } catch (error) {
      throw {
        message: `Failed to get queue result: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'RESULT_FETCH_FAILED',
      } as MoonvalleyMareyI2VError;
    }
  }

  /**
   * Calculate the cost based on duration
   */
  calculateCost(duration: '5s' | '10s'): number {
    const costs = {
      '5s': 1.50,
      '10s': 3.00,
    };
    return costs[duration];
  }

  /**
   * Estimate video duration in seconds
   */
  estimateVideoDuration(duration: '5s' | '10s'): number {
    return duration === '5s' ? 5 : 10;
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: MoonvalleyMareyI2VInput): void {
    if (!input.prompt) {
      throw new Error('prompt is required');
    }

    if (!input.image_url) {
      throw new Error('image_url is required');
    }

    if (input.prompt.length < 50) {
      throw new Error('prompt should be at least 50 words for best results');
    }

    if (input.prompt.length > 2000) {
      throw new Error('prompt must be 2000 characters or less');
    }

    if (input.dimensions && !['1920x1080', '1080x1920', '1152x1152', '1536x1152', '1152x1536'].includes(input.dimensions)) {
      throw new Error('dimensions must be one of: 1920x1080, 1080x1920, 1152x1152, 1536x1152, 1152x1536');
    }

    if (input.duration && !['5s', '10s'].includes(input.duration)) {
      throw new Error('duration must be either 5s or 10s');
    }

    if (input.seed !== undefined && (input.seed < -1 || input.seed > 999999)) {
      throw new Error('seed must be -1 (random) or between 0 and 999999');
    }
  }

  /**
   * Get dimension recommendations based on use case
   */
  static getDimensionRecommendations() {
    return {
      '1920x1080': 'Standard widescreen format, ideal for most content (default)',
      '1080x1920': 'Portrait format, perfect for mobile and social media',
      '1152x1152': 'Square format, perfect for social media and mobile',
      '1536x1152': 'Landscape format, great for cinematic content',
      '1152x1536': 'Portrait format, ideal for mobile-first content',
    };
  }

  /**
   * Get duration recommendations
   */
  static getDurationRecommendations() {
    return {
      '5s': 'Quick content, social media, testing concepts ($1.50)',
      '10s': 'Extended content, storytelling, detailed scenes ($3.00)',
    };
  }

  /**
   * Get prompt writing tips for Marey image-to-video
   */
  static getPromptWritingTips() {
    return [
      'Aim for at least 50 words of detail for best results',
      'Use the recommended structure: [Camera Movement] + [Scale/Perspective] + [Core Visual] + [Environmental Details] + [Lighting/Technical Specs]',
      'Be descriptive about camera details (e.g., 35mm, handheld shot)',
      'Include scene environment and atmosphere details',
      'Describe subjects and their actions clearly',
      'Mention lighting conditions and technical specifications',
      'Avoid negative prompts in the main description - use the negative_prompt field',
      'Reference the example prompt for structure and detail level',
      'Focus on describing the motion and changes you want from the starting image',
    ];
  }

  /**
   * Get common use cases for Marey image-to-video
   */
  static getCommonUseCases() {
    return [
      'Cinematic storytelling starting from keyframes',
      'Commercial and advertising videos from still images',
      'Film and video production with image references',
      'Creative content creation from photographs',
      'Educational and training videos from diagrams',
      'Brand storytelling and marketing from brand images',
      'Entertainment and artistic content from artwork',
      'Professional video production from reference images',
      'Social media content creation from photos',
      'Film school and learning projects from stills',
      'Corporate communications from company images',
      'Product demonstrations from product photos',
      'Documentary content from historical images',
      'Artistic and experimental videos from paintings',
    ];
  }

  /**
   * Get technical considerations for Marey image-to-video
   */
  static getTechnicalConsiderations() {
    return [
      'Marey is trained exclusively on fully licensed data for commercial safety',
      'Model designed to meet world-class cinematography standards',
      'Offers unmatched control, consistency, and fidelity',
      'Built for filmmakers who demand precision in every frame',
      'Duration affects cost: 5s = $1.50, 10s = $3.00',
      'Seed values enable reproducible results and variations',
      'Dimensions affect aspect ratio and viewing experience',
      'Negative prompts help guide away from undesirable features',
      'Queue processing recommended for longer content',
      'Image quality affects starting frame quality and video output',
      'Supported image formats: jpg, jpeg, png, webp, gif, avif',
      'Image serves as the first frame of the generated video',
    ];
  }

  /**
   * Get cost examples for different scenarios
   */
  getCostExamples() {
    return [
      {
        duration: '5s',
        cost: this.calculateCost('5s'),
        description: '5-second image-to-video generation',
        use_case: 'Quick content, social media, testing concepts',
      },
      {
        duration: '10s',
        cost: this.calculateCost('10s'),
        description: '10-second image-to-video generation',
        use_case: 'Extended content, storytelling, detailed scenes',
      },
    ];
  }

  /**
   * Get performance optimization tips
   */
  static getPerformanceOptimizationTips() {
    return [
      'Use detailed prompts with at least 50 words for best results',
      'Follow the recommended prompt structure for optimal output',
      'Choose appropriate dimensions for your content type',
      'Use seed values for reproducible results during development',
      'Consider queue processing for longer content',
      'Leverage the model for cinematic-quality video generation',
      'Use negative prompts to avoid unwanted features',
      'Ensure high-quality input images for better starting frames',
      'Use supported image formats for optimal compatibility',
    ];
  }

  /**
   * Get troubleshooting tips
   */
  static getTroubleshootingTips() {
    return [
      'If generation fails, ensure prompt is at least 50 words',
      'For poor quality, use more detailed and structured prompts',
      'If content is not as expected, adjust negative prompts',
      'For inconsistent results, use specific seed values',
      'If processing is slow, use queue processing',
      'Use the example prompt as a reference for structure',
      'Ensure all parameters are within valid ranges',
      'Check that image URL is accessible and in supported format',
      'Verify image dimensions are appropriate for your video dimensions',
    ];
  }

  /**
   * Get model-specific advantages
   */
  static getModelAdvantages() {
    return [
      'World\'s first commercially-safe image-to-video generation model',
      'Trained exclusively on fully licensed data',
      'Built to meet world-class cinematography standards',
      'Unmatched control, consistency, and fidelity',
      'Designed for professional filmmakers',
      'Commercial use rights included',
      'High-quality output suitable for professional projects',
      'Advanced prompt understanding and interpretation',
      'Queue support for long-running requests',
      'Real-time progress monitoring',
      'Image-to-video control for precise starting points',
      'Professional cinematography quality from still images',
    ];
  }

  /**
   * Get example prompt for reference
   */
  static getExamplePrompt() {
    return {
      prompt: 'Detailed Description: In a hidden jungle grotto, a majestic waterfall plunges into a dark, serene pool below. Ethereal sunbeams slice through the dense canopy high above, illuminating the swirling mist generated by the powerful cascade. The light rays dance across the scene, highlighting the vibrant green foliage that clings to the dark, wet rock walls. The constant roar of the falling water echoes through the secluded space, as the surface of the pool ripples and churns from the impact, creating a mesmerizing display of nature\'s raw power and tranquil beauty. Background: Brilliant sunbeams pierce through an opening in the dense jungle canopy, their ethereal rays shifting and shimmering as they cut through the misty air. Middleground: A powerful column of white water cascades down a dark, foliage-covered cliff face, creating a stark contrast with the shadowy recesses of the grotto. Foreground: The waterfall crashes into a dark, churning pool of water, sending up a fine spray and creating ever-expanding ripples across the surface.',
      description: 'Jungle grotto waterfall scene with dynamic lighting and water movement',
      key_elements: [
        'Detailed visual description with atmospheric details',
        'Camera movement and perspective information',
        'Environmental and lighting specifications',
        'Dynamic elements and motion descriptions',
        'Technical cinematography details',
        'Minimum 50 words for optimal results',
        'Focus on movement and changes from the starting image',
      ],
    };
  }

  /**
   * Get default negative prompt
   */
  static getDefaultNegativePrompt() {
    return '<synthetic> <scene cut> low-poly, flat shader, bad rigging, stiff animation, uncanny eyes, low-quality textures, looping glitch, cheap effect, overbloom, bloom spam, default lighting, game asset, stiff face, ugly specular, AI artifacts';
  }

  /**
   * Get prompt structure recommendations
   */
  static getPromptStructureRecommendations() {
    return [
      '[Camera Movement]: Describe camera work and movement',
      '[Scale/Perspective]: Specify shot scale and perspective',
      '[Core Visual]: Describe the main subject and action',
      '[Environmental Details]: Include scene and atmosphere details',
      '[Lighting/Technical Specs]: Mention lighting and technical aspects',
      '[Motion Elements]: Describe the movement and changes you want from the image',
    ];
  }

  /**
   * Get best practices for commercial use
   */
  static getCommercialUseBestPractices() {
    return [
      'Marey is trained on fully licensed data for commercial safety',
      'No copyright concerns for commercial projects',
      'Suitable for professional filmmaking and advertising',
      'Meets industry standards for content creation',
      'Ideal for brand storytelling and marketing campaigns',
      'Professional-grade output for commercial applications',
      'Image-to-video control for precise brand messaging',
    ];
  }

  /**
   * Get supported image formats
   */
  static getSupportedImageFormats() {
    return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];
  }

  /**
   * Get image preparation tips
   */
  static getImagePreparationTips() {
    return [
      'Use high-quality, clear images for better starting frames',
      'Ensure good lighting and contrast in source images',
      'Choose images that represent your desired starting point',
      'Consider how the image will transition to video',
      'Use appropriate aspect ratios for your video dimensions',
      'Ensure images are publicly accessible via URL',
      'Avoid heavily compressed or low-resolution images',
      'Select images that complement your prompt description',
    ];
  }
}
