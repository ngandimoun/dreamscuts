import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/infinitalk/single-text';

// Voice enum
export type InfinitalkSingleTextVoiceEnum = 
  | 'Aria' | 'Roger' | 'Sarah' | 'Laura' | 'Charlie' | 'George' 
  | 'Callum' | 'River' | 'Liam' | 'Charlotte' | 'Alice' | 'Matilda' 
  | 'Will' | 'Jessica' | 'Eric' | 'Chris' | 'Brian' | 'Daniel' 
  | 'Lily' | 'Bill';

// Input interface
export interface FalAiInfinitalkSingleTextInput {
  image_url: string;
  text_input: string;
  voice: InfinitalkSingleTextVoiceEnum;
  prompt: string;
  num_frames?: number;
  resolution?: '480p' | '720p';
  seed?: number;
  acceleration?: 'none' | 'regular' | 'high';
}

// Output interface
export interface FalAiInfinitalkSingleTextOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  seed?: number;
}

// Error types
export interface FalAiInfinitalkSingleTextError {
  message: string;
  code?: string;
}

// Main executor class
export class FalAiInfinitalkSingleTextExecutor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  /**
   * Generate a talking avatar video from text input
   */
  async generateVideo(
    input: FalAiInfinitalkSingleTextInput
  ): Promise<FalAiInfinitalkSingleTextOutput> {
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

      return result.data as FalAiInfinitalkSingleTextOutput;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit a request to the queue for long-running generation
   */
  async submitToQueue(
    input: FalAiInfinitalkSingleTextInput,
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
  ): Promise<FalAiInfinitalkSingleTextOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });
      return result.data as FalAiInfinitalkSingleTextOutput;
    } catch (error) {
      throw new Error(`Failed to get queue result: ${error}`);
    }
  }

  /**
   * Calculate the cost based on frame count and resolution
   */
  calculateCost(numFrames: number, resolution: '480p' | '720p' = '480p'): number {
    const baseCostPerSecond = 0.3;
    const resolutionMultiplier = resolution === '720p' ? 2 : 1;
    const estimatedDuration = numFrames / 30;
    return estimatedDuration * baseCostPerSecond * resolutionMultiplier;
  }

  /**
   * Estimate video duration based on frame count
   */
  estimateVideoDuration(numFrames: number): number {
    return numFrames / 30; // Assuming 30fps
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: FalAiInfinitalkSingleTextInput): void {
    if (!input.image_url) {
      throw new Error('image_url is required');
    }
    if (!input.text_input) {
      throw new Error('text_input is required');
    }
    if (!input.voice) {
      throw new Error('voice is required');
    }
    if (!input.prompt) {
      throw new Error('prompt is required');
    }

    // Validate URL format
    try {
      new URL(input.image_url);
    } catch {
      throw new Error('image_url must be a valid URL');
    }

    // Validate text input length
    if (input.text_input.length < 1 || input.text_input.length > 1000) {
      throw new Error('text_input must be between 1 and 1000 characters');
    }

    // Validate prompt length
    if (input.prompt.length < 1 || input.prompt.length > 1000) {
      throw new Error('prompt must be between 1 and 1000 characters');
    }

    // Validate num_frames
    if (input.num_frames !== undefined) {
      if (input.num_frames < 41 || input.num_frames > 721) {
        throw new Error('num_frames must be between 41 and 721');
      }
    }

    // Validate seed
    if (input.seed !== undefined) {
      if (input.seed < 0 || input.seed > 999999) {
        throw new Error('seed must be between 0 and 999999');
      }
    }
  }

  /**
   * Handle errors and provide meaningful messages
   */
  private handleError(error: any): FalAiInfinitalkSingleTextError {
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
  static getFrameCountRecommendations() {
    return {
      short: { frames: 60, duration: '2s', description: 'Quick social media clips' },
      standard: { frames: 145, duration: '4.8s', description: 'Standard talking head videos' },
      medium: { frames: 300, duration: '10s', description: 'Detailed explanations' },
      long: { frames: 600, duration: '20s', description: 'Comprehensive content' },
      extended: { frames: 721, duration: '24s', description: 'Maximum length content' }
    };
  }

  static getResolutionRecommendations() {
    return {
      '480p': { cost: 'Base price', quality: 'Good for most use cases', bestFor: 'Social media, web content' },
      '720p': { cost: 'Double price', quality: 'High quality', bestFor: 'Professional content, presentations' }
    };
  }

  static getAccelerationRecommendations() {
    return {
      none: { speed: 'Slowest', quality: 'Highest', bestFor: 'Final production videos' },
      regular: { speed: 'Balanced', quality: 'Good', bestFor: 'Most use cases' },
      high: { speed: 'Fastest', quality: 'Lower', bestFor: 'Quick iterations, testing' }
    };
  }

  static getPromptWritingTips() {
    return [
      'Be specific about the avatar\'s appearance and expression',
      'Describe the context and setting clearly',
      'Include emotional cues for natural expressions',
      'Mention any specific movements or gestures',
      'Keep prompts concise but descriptive'
    ];
  }

  static getImagePreparationTips() {
    return [
      'Use high-quality, clear images (at least 512x512 pixels)',
      'Ensure good lighting and contrast',
      'Use images with clear facial features',
      'Avoid images with multiple people or complex backgrounds',
      'Ensure the face is centered and well-lit'
    ];
  }

  static getTextInputTips() {
    return [
      'Write natural, conversational text',
      'Keep sentences clear and concise',
      'Use proper punctuation for natural speech patterns',
      'Consider the avatar\'s personality and tone',
      'Avoid overly complex or technical language'
    ];
  }

  static getVoiceSelectionTips() {
    return [
      'Choose voices that match your content tone',
      'Consider the target audience demographics',
      'Test different voices for the same content',
      'Match voice characteristics to the avatar image',
      'Use consistent voices for brand consistency'
    ];
  }

  static getCommonUseCases() {
    return [
      'Educational content and tutorials',
      'Marketing and promotional videos',
      'Customer service announcements',
      'Training and onboarding materials',
      'Social media content creation',
      'Virtual assistant avatars',
      'Personalized video messages',
      'Corporate communications',
      'Product demonstrations',
      'News and media content',
      'Entertainment and gaming',
      'Language learning content'
    ];
  }

  static getTechnicalConsiderations() {
    return [
      'Text-to-speech conversion adds processing time',
      'Longer text inputs require more frames',
      'Higher resolutions significantly increase costs',
      'Seed values ensure reproducible results',
      'Queue processing recommended for long content',
      'Webhook support for production workflows'
    ];
  }

  getCostExamples() {
    return [
      {
        frames: 60,
        resolution: '480p',
        duration: '2s',
        cost: this.calculateCost(60, '480p'),
        description: '2-second video at 480p'
      },
      {
        frames: 145,
        resolution: '480p',
        duration: '4.8s',
        cost: this.calculateCost(145, '480p'),
        description: '4.8-second video at 480p'
      },
      {
        frames: 300,
        resolution: '720p',
        duration: '10s',
        cost: this.calculateCost(300, '720p'),
        description: '10-second video at 720p'
      },
      {
        frames: 600,
        resolution: '480p',
        duration: '20s',
        cost: this.calculateCost(600, '480p'),
        description: '20-second video at 480p'
      }
    ];
  }

  static getPerformanceOptimizationTips() {
    return [
      'Use 480p for testing and iterations',
      'Start with shorter frame counts for quick feedback',
      'Use acceleration settings for faster processing',
      'Batch multiple requests for efficiency',
      'Implement webhook handling for production use',
      'Cache generated videos when possible'
    ];
  }

  static getTroubleshootingTips() {
    return [
      'Ensure image URLs are publicly accessible',
      'Check text input length and content',
      'Verify voice selection is valid',
      'Monitor queue status for long requests',
      'Use appropriate frame counts for content length',
      'Check API key and rate limits'
    ];
  }

  static getModelAdvantages() {
    return [
      'Automatic text-to-speech conversion',
      'Natural lip-sync and facial expressions',
      'Multiple voice options for different content types',
      'Flexible frame count and resolution options',
      'Cost-effective pricing model',
      'Queue processing for long content',
      'Webhook support for production workflows',
      'Seed-based reproducibility'
    ];
  }

  static getExamplePrompt() {
    return 'A professional business person in a modern office setting, speaking confidently with a warm smile. The avatar appears engaged and trustworthy, perfect for corporate communications.';
  }

  static getPromptStructureRecommendations() {
    return [
      'Start with the person\'s appearance and clothing',
      'Describe the setting and environment',
      'Include emotional state and expression',
      'Mention any specific actions or gestures',
      'End with the overall mood and purpose'
    ];
  }

  static getTalkingHeadBestPractices() {
    return [
      'Use clear, high-quality reference images',
      'Write natural, conversational text',
      'Choose appropriate voices for your content',
      'Keep prompts descriptive but concise',
      'Test different frame counts for optimal length',
      'Use 480p for cost-effective production',
      'Implement queue processing for long content'
    ];
  }

  static getSupportedImageFormats() {
    return ['JPEG', 'PNG', 'WebP', 'GIF'];
  }

  static getSupportedVoiceOptions() {
    return [
      'Aria', 'Roger', 'Sarah', 'Laura', 'Charlie', 'George',
      'Callum', 'River', 'Liam', 'Charlotte', 'Alice', 'Matilda',
      'Will', 'Jessica', 'Eric', 'Chris', 'Brian', 'Daniel',
      'Lily', 'Bill'
    ];
  }

  static getCostOptimizationStrategies() {
    return [
      'Use 480p resolution for most content',
      'Start with shorter frame counts and extend if needed',
      'Batch multiple requests together',
      'Use acceleration settings for faster processing',
      'Implement efficient queue management',
      'Cache and reuse generated content when possible'
    ];
  }
}
