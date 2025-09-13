import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'moonvalley/marey/pose-transfer';

// Input interface
export interface MoonvalleyMareyPoseTransferInput {
  image_url: string;
  pose_image_url: string;
  prompt: string;
  dimensions?: '1920x1080' | '1080x1920' | '1152x1152' | '1536x1152' | '1152x1536';
  duration?: '5s' | '10s';
  negative_prompt?: string;
  seed?: number;
}

// Output interface
export interface MoonvalleyMareyPoseTransferOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error types
export interface MoonvalleyMareyPoseTransferError {
  message: string;
  code?: string;
}

// Main executor class
export class MoonvalleyMareyPoseTransferExecutor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  async generateVideo(
    input: MoonvalleyMareyPoseTransferInput
  ): Promise<MoonvalleyMareyPoseTransferOutput> {
    try {
      this.validateInput(input);

      const result = await fal.subscribe(this.modelEndpoint, {
        input,
        pollInterval: 1000, // Poll every second
      });

      return result as unknown as MoonvalleyMareyPoseTransferOutput;
    } catch (error) {
      throw {
        message: `Video generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'GENERATION_FAILED',
      } as MoonvalleyMareyPoseTransferError;
    }
  }

  async submitToQueue(
    input: MoonvalleyMareyPoseTransferInput
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
      } as MoonvalleyMareyPoseTransferError;
    }
  }

  static async checkQueueStatus(requestId: string): Promise<any> {
    try {
      const status = await fal.queue.status(MODEL_ENDPOINT, { requestId });
      return status;
    } catch (error) {
      throw {
        message: `Failed to check queue status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'STATUS_CHECK_FAILED',
      } as MoonvalleyMareyPoseTransferError;
    }
  }

  static async getQueueResult(requestId: string): Promise<MoonvalleyMareyPoseTransferOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, { requestId });
      return result as unknown as MoonvalleyMareyPoseTransferOutput;
    } catch (error) {
      throw {
        message: `Failed to get queue result: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'RESULT_FETCH_FAILED',
      } as MoonvalleyMareyPoseTransferError;
    }
  }

  calculateCost(duration: '5s' | '10s'): number {
    const costs = {
      '5s': 1.50,
      '10s': 3.00,
    };
    return costs[duration];
  }

  estimateVideoDuration(duration: '5s' | '10s'): number {
    return duration === '5s' ? 5 : 10;
  }

  private validateInput(input: MoonvalleyMareyPoseTransferInput): void {
    if (!input.image_url) {
      throw new Error('image_url is required');
    }

    if (!input.pose_image_url) {
      throw new Error('pose_image_url is required');
    }

    if (!input.prompt) {
      throw new Error('prompt is required');
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

  // Static utility methods
  static getDimensionRecommendations() {
    return {
      '1920x1080': 'Landscape format, ideal for widescreen content and social media',
      '1080x1920': 'Portrait format, perfect for mobile-first content and stories',
      '1152x1152': 'Square format, great for social media posts and thumbnails',
      '1536x1152': 'Wide landscape, excellent for cinematic content',
      '1152x1536': 'Tall portrait, ideal for mobile video content'
    };
  }

  static getDurationRecommendations() {
    return {
      '5s': 'Quick demonstrations, social media clips, and preview content',
      '10s': 'Detailed pose transfers, longer demonstrations, and showcase content'
    };
  }

  static getPromptWritingTips() {
    return [
      'Describe the desired pose and movement clearly and specifically',
      'Include details about the character\'s appearance and clothing',
      'Specify the mood and atmosphere you want to convey',
      'Use descriptive language for body positioning and gestures',
      'Mention any specific actions or movements you want to see',
      'Include environmental context if relevant to the pose',
      'Be specific about facial expressions and body language',
      'Use action verbs to describe movement and positioning'
    ];
  }

  static getImagePreparationTips() {
    return {
      source_image: [
        'Use high-quality images with clear character visibility',
        'Ensure good lighting and contrast',
        'Avoid cluttered backgrounds when possible',
        'Use images with the character in a neutral pose for best results',
        'Ensure the character takes up a significant portion of the frame'
      ],
      pose_image: [
        'Choose clear, well-defined pose references',
        'Use images with good body positioning visibility',
        'Avoid poses that are too complex or extreme',
        'Ensure the pose image shows the desired movement clearly',
        'Use high-resolution pose reference images'
      ]
    };
  }

  static getCommonUseCases() {
    return [
      'Character animation for games and interactive media',
      'Fashion and clothing demonstrations',
      'Dance and movement tutorials',
      'Character pose libraries for artists',
      'Animation reference creation',
      'Social media content generation',
      'Educational content for movement studies',
      'Character development for storytelling'
    ];
  }

  static getTechnicalConsiderations() {
    return [
      'Both source and pose images should be high quality',
      'Pose transfer works best with clear, well-lit images',
      'Complex poses may require longer generation times',
      'Results depend on the quality of both input images',
      'Character consistency is maintained from the source image',
      'Pose accuracy depends on the clarity of the pose reference'
    ];
  }

  getCostExamples() {
    return [
      {
        duration: '5s',
        cost: 1.50,
        description: '5-second pose transfer video'
      },
      {
        duration: '10s',
        cost: 3.00,
        description: '10-second pose transfer video'
      }
    ];
  }

  static getPerformanceOptimizationTips() {
    return [
      'Use clear, high-resolution input images',
      'Choose pose references that are well-defined and visible',
      'Write detailed, specific prompts for better results',
      'Use appropriate dimensions for your content type',
      'Consider using 5s duration for quick iterations',
      'Use 10s duration for complex pose sequences'
    ];
  }

  static getTroubleshootingTips() {
    return [
      'If results are unclear, try using a more defined pose reference',
      'Ensure both input images are high quality and well-lit',
      'Check that your prompt clearly describes the desired outcome',
      'Verify that both image URLs are accessible and valid',
      'Try different seed values for varied results',
      'Use the default negative prompt for better quality'
    ];
  }

  static getModelAdvantages() {
    return [
      'Commercially safe with fully licensed data training',
      'High-quality pose transfer with character consistency',
      'Multiple dimension and duration options',
      'Professional-grade output suitable for commercial use',
      'Advanced pose control and movement generation',
      'Character-aware pose transfer technology',
      'Cinematography-quality output standards',
      'Flexible input image requirements'
    ];
  }

  static getExamplePrompt() {
    return 'A confident young woman in a flowing red dress gracefully extending her arms in a ballet pose, her hair flowing elegantly, standing in a sunlit garden with soft bokeh background, cinematic lighting, professional photography style';
  }

  static getDefaultNegativePrompt() {
    return '<synthetic> <scene cut> low-poly, flat shader, bad rigging, stiff animation, uncanny eyes, low-quality textures, looping glitch, cheap effect, overbloom, bloom spam, default lighting, game asset, stiff face, ugly specular, AI artifacts';
  }

  static getPromptStructureRecommendations() {
    return [
      'Start with character description and appearance',
      'Describe the specific pose or movement',
      'Include body positioning and gestures',
      'Add facial expression details',
      'Describe the environment or setting',
      'Specify the mood and atmosphere',
      'Include any specific actions or movements',
      'End with style and quality specifications'
    ];
  }

  static getCommercialUseBestPractices() {
    return [
      'Ensure you have rights to use both source and pose images',
      'Use high-quality, professional reference materials',
      'Test with different pose references for best results',
      'Consider your target audience and content requirements',
      'Use appropriate dimensions for your platform',
      'Plan your content strategy with pose transfer capabilities',
      'Maintain brand consistency across generated content',
      'Follow platform-specific content guidelines'
    ];
  }

  static getSupportedImageFormats() {
    return [
      'jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'
    ];
  }

  static getPoseTransferBestPractices() {
    return [
      'Choose pose references that clearly show the desired position',
      'Use poses that complement your character\'s style',
      'Consider the flow and movement between poses',
      'Select poses that work well with your prompt description',
      'Use reference poses that are achievable and natural',
      'Consider the character\'s proportions and build',
      'Choose poses that enhance your storytelling goals',
      'Test different pose references for optimal results'
    ];
  }
}
