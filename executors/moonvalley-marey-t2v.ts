import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'moonvalley/marey/t2v';

// Input interface
export interface MoonvalleyMareyT2VInput {
  prompt: string;
  dimensions?: '1920x1080' | '1152x1152' | '1536x1152' | '1152x1536';
  duration?: '5s' | '10s';
  negative_prompt?: string;
  seed?: number;
}

// Output interface
export interface MoonvalleyMareyT2VOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error types
export interface MoonvalleyMareyT2VError {
  message: string;
  code?: string;
}

// Main executor class
export class MoonvalleyMareyT2VExecutor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  /**
   * Generate video from text using fal.subscribe for real-time updates
   */
  async generateVideo(
    input: MoonvalleyMareyT2VInput
  ): Promise<MoonvalleyMareyT2VOutput> {
    try {
      this.validateInput(input);

      const result = await fal.subscribe(this.modelEndpoint, {
        input,
        pollInterval: 1000, // Poll every second
      });

      return result as unknown as MoonvalleyMareyT2VOutput;
    } catch (error) {
      throw {
        message: `Video generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'GENERATION_FAILED',
      } as MoonvalleyMareyT2VError;
    }
  }

  /**
   * Submit video generation request to queue for long-running operations
   */
  async submitToQueue(
    input: MoonvalleyMareyT2VInput
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
      } as MoonvalleyMareyT2VError;
    }
  }

  /**
   * Check the status of a queued request
   */
  static async checkQueueStatus(requestId: string): Promise<any> {
    try {
      const status = await fal.queue.status('moonvalley/marey/t2v', { requestId });
      return status;
    } catch (error) {
      throw {
        message: `Failed to check queue status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'STATUS_CHECK_FAILED',
      } as MoonvalleyMareyT2VError;
    }
  }

  /**
   * Get the result of a completed queued request
   */
  static async getQueueResult(requestId: string): Promise<MoonvalleyMareyT2VOutput> {
    try {
      const result = await fal.queue.result('moonvalley/marey/t2v', { requestId });
      return result as unknown as MoonvalleyMareyT2VOutput;
    } catch (error) {
      throw {
        message: `Failed to get queue result: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'RESULT_FETCH_FAILED',
      } as MoonvalleyMareyT2VError;
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
  private validateInput(input: MoonvalleyMareyT2VInput): void {
    if (!input.prompt) {
      throw new Error('prompt is required');
    }

    if (input.prompt.length < 50) {
      throw new Error('prompt should be at least 50 words for best results');
    }

    if (input.prompt.length > 2000) {
      throw new Error('prompt must be 2000 characters or less');
    }

    if (input.dimensions && !['1920x1080', '1152x1152', '1536x1152', '1152x1536'].includes(input.dimensions)) {
      throw new Error('dimensions must be one of: 1920x1080, 1152x1152, 1536x1152, 1152x1536');
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
   * Get prompt writing tips for Marey
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
    ];
  }

  /**
   * Get common use cases for Marey text-to-video
   */
  static getCommonUseCases() {
    return [
      'Cinematic storytelling and narrative content',
      'Commercial and advertising videos',
      'Film and video production',
      'Creative content creation',
      'Educational and training videos',
      'Brand storytelling and marketing',
      'Entertainment and artistic content',
      'Professional video production',
      'Social media content creation',
      'Film school and learning projects',
    ];
  }

  /**
   * Get technical considerations for Marey
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
        description: '5-second video generation',
        use_case: 'Quick content, social media, testing concepts',
      },
      {
        duration: '10s',
        cost: this.calculateCost('10s'),
        description: '10-second video generation',
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
    ];
  }

  /**
   * Get model-specific advantages
   */
  static getModelAdvantages() {
    return [
      'World\'s first commercially-safe video generation model',
      'Trained exclusively on fully licensed data',
      'Built to meet world-class cinematography standards',
      'Unmatched control, consistency, and fidelity',
      'Designed for professional filmmakers',
      'Commercial use rights included',
      'High-quality output suitable for professional projects',
      'Advanced prompt understanding and interpretation',
      'Queue support for long-running requests',
      'Real-time progress monitoring',
    ];
  }

  /**
   * Get example prompt for reference
   */
  static getExamplePrompt() {
    return {
      prompt: 'Detailed Description: A small, white paper boat, with one corner engulfed in bright orange flames, drifts precariously across a dark puddle on wet asphalt. As raindrops fall, they create ever-expanding ripples on the water\'s surface, gently rocking the fragile vessel and causing the fiery reflection below to dance and shimmer. The flickering flame slowly consumes the paper, charring the edges black as the boat becomes waterlogged, beginning to sink in a poignant slow-motion battle between fire and water. Background: The background is softly blurred, suggesting an overcast day with out-of-focus foliage, enhancing the scene\'s intimate and melancholic mood. Middleground: Raindrops continuously strike the puddle\'s surface, creating concentric ripples that gently push the boat along its short, determined voyage. Foreground: The burning paper boat floats in sharp focus, its bright, flickering flame casting a warm, dramatic glow that reflects and distorts on the dark, wet surface of the asphalt.',
      description: 'Poetic scene of a burning paper boat in rain',
      key_elements: [
        'Detailed visual description with atmospheric details',
        'Camera movement and perspective information',
        'Environmental and lighting specifications',
        'Emotional and narrative elements',
        'Technical cinematography details',
        'Minimum 50 words for optimal results',
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
    ];
  }
}
