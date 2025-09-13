import { fal } from '@fal-ai/client';

// Aspect ratio options
export type ViduAspectRatioEnum = '16:9' | '9:16' | '1:1';

// Movement amplitude options
export type ViduMovementAmplitudeEnum = 'auto' | 'small' | 'medium' | 'large';

// Input schema for Vidu Q1 Reference to Video
export interface ViduQ1ReferenceToVideoInput {
  prompt: string;
  reference_image_urls: string[];
  seed?: number;
  aspect_ratio?: ViduAspectRatioEnum;
  movement_amplitude?: ViduMovementAmplitudeEnum;
  bgm?: boolean;
}

// Output schema for Vidu Q1 Reference to Video
export interface ViduQ1ReferenceToVideoOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error types
export interface ViduQ1ReferenceToVideoError {
  error: string;
  details?: string;
}

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/vidu/q1/reference-to-video';

export class ViduQ1ReferenceToVideoExecutor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  /**
   * Generate video from reference images using Vidu Q1
   */
  async generateVideo(input: ViduQ1ReferenceToVideoInput): Promise<ViduQ1ReferenceToVideoOutput> {
    try {
      // Validate required inputs
      if (!input.prompt || !input.reference_image_urls || input.reference_image_urls.length === 0) {
        throw new Error('Missing required inputs: prompt and reference_image_urls are required');
      }

      if (input.reference_image_urls.length > 7) {
        throw new Error('Maximum 7 reference images allowed');
      }

      if (input.prompt.length > 1500) {
        throw new Error('Prompt must be 1500 characters or less');
      }

      // Set defaults
      const requestInput = {
        prompt: input.prompt,
        reference_image_urls: input.reference_image_urls,
        seed: input.seed || Math.floor(Math.random() * 1000000),
        aspect_ratio: input.aspect_ratio || '16:9',
        movement_amplitude: input.movement_amplitude || 'auto',
        bgm: input.bgm || false
      };

      // Calculate cost (fixed $0.40 for 5s video)
      console.log(`Estimated cost: $0.40 for 5-second video`);
      console.log(`Reference images: ${requestInput.reference_image_urls.length}`);
      console.log(`Aspect ratio: ${requestInput.aspect_ratio}`);

      // Submit request
      const result = await fal.subscribe(this.modelEndpoint, {
        input: requestInput,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            update.logs?.map((log) => log.message).forEach(console.log);
          }
        },
      });

      return result.data as ViduQ1ReferenceToVideoOutput;
    } catch (error) {
      console.error('Error generating video:', error);
      throw {
        error: 'Failed to generate video',
        details: error instanceof Error ? error.message : String(error)
      } as ViduQ1ReferenceToVideoError;
    }
  }

  /**
   * Submit video generation to queue for long-running requests
   */
  async submitToQueue(input: ViduQ1ReferenceToVideoInput, webhookUrl?: string): Promise<{ request_id: string }> {
    try {
      // Validate required inputs
      if (!input.prompt || !input.reference_image_urls || input.reference_image_urls.length === 0) {
        throw new Error('Missing required inputs: prompt and reference_image_urls are required');
      }

      if (input.reference_image_urls.length > 7) {
        throw new Error('Maximum 7 reference images allowed');
      }

      if (input.prompt.length > 1500) {
        throw new Error('Prompt must be 1500 characters or less');
      }

      // Set defaults
      const requestInput = {
        prompt: input.prompt,
        reference_image_urls: input.reference_image_urls,
        seed: input.seed || Math.floor(Math.random() * 1000000),
        aspect_ratio: input.aspect_ratio || '16:9',
        movement_amplitude: input.movement_amplitude || 'auto',
        bgm: input.bgm || false
      };

      // Calculate cost (fixed $0.40 for 5s video)
      console.log(`Estimated cost: $0.40 for 5-second video`);
      console.log(`Reference images: ${requestInput.reference_image_urls.length}`);
      console.log(`Aspect ratio: ${requestInput.aspect_ratio}`);

      // Submit to queue
      const { request_id } = await fal.queue.submit(this.modelEndpoint, {
        input: requestInput,
        webhookUrl,
      });

      return { request_id };
    } catch (error) {
      console.error('Error submitting video generation to queue:', error);
      throw {
        error: 'Failed to submit video generation to queue',
        details: error instanceof Error ? error.message : String(error)
      } as ViduQ1ReferenceToVideoError;
    }
  }

  /**
   * Check queue status
   */
  async checkQueueStatus(requestId: string): Promise<any> {
    try {
      const status = await fal.queue.status(this.modelEndpoint, {
        requestId,
        logs: true,
      });
      return status;
    } catch (error) {
      console.error('Error checking queue status:', error);
      throw {
        error: 'Failed to check queue status',
        details: error instanceof Error ? error.message : String(error)
      } as ViduQ1ReferenceToVideoError;
    }
  }

  /**
   * Get queue result
   */
  async getQueueResult(requestId: string): Promise<ViduQ1ReferenceToVideoOutput> {
    try {
      const result = await fal.queue.result(this.modelEndpoint, {
        requestId,
      });
      return result.data as ViduQ1ReferenceToVideoOutput;
    } catch (error) {
      console.error('Error getting queue result:', error);
      throw {
        error: 'Failed to get queue result',
        details: error instanceof Error ? error.message : String(error)
      } as ViduQ1ReferenceToVideoError;
    }
  }

  /**
   * Calculate estimated cost for video generation
   */
  calculateCost(): {
    baseCost: number;
    currency: string;
    duration: string;
    totalCost: number;
  } {
    // Fixed cost for 5s video
    const baseCost = 0.40;
    
    return {
      baseCost,
      currency: 'USD',
      duration: '5 seconds',
      totalCost: baseCost
    };
  }

  /**
   * Get available aspect ratios with descriptions
   */
  getAvailableAspectRatios(): Array<{ value: ViduAspectRatioEnum; description: string }> {
    return [
      { value: '16:9', description: 'Widescreen landscape format (default)' },
      { value: '9:16', description: 'Portrait format for mobile devices' },
      { value: '1:1', description: 'Square format for social media' }
    ];
  }

  /**
   * Get available movement amplitudes with descriptions
   */
  getAvailableMovementAmplitudes(): Array<{ value: ViduMovementAmplitudeEnum; description: string }> {
    return [
      { value: 'auto', description: 'Automatic movement detection (default)' },
      { value: 'small', description: 'Subtle, minimal movement' },
      { value: 'medium', description: 'Moderate movement intensity' },
      { value: 'large', description: 'Dynamic, energetic movement' }
    ];
  }

  /**
   * Get reference image recommendations
   */
  getReferenceImageRecommendations(): Array<{ count: number; useCase: string; description: string }> {
    return [
      { count: 1, useCase: 'Single subject', description: 'One clear reference image for consistent appearance' },
      { count: 2, useCase: 'Dual subjects', description: 'Two reference images for character consistency' },
      { count: 3, useCase: 'Multiple subjects', description: 'Three reference images for complex scenes' },
      { count: 4, useCase: 'Detailed scenes', description: 'Four reference images for rich visual details' },
      { count: 5, useCase: 'Complex compositions', description: 'Five reference images for intricate scenes' },
      { count: 6, useCase: 'Advanced scenes', description: 'Six reference images for sophisticated content' },
      { count: 7, useCase: 'Maximum detail', description: 'Seven reference images for maximum visual consistency' }
    ];
  }

  /**
   * Get prompt optimization tips
   */
  getPromptOptimizationTips(): Array<string> {
    return [
      'Keep prompts under 1500 characters for optimal processing',
      'Be specific about subjects, actions, and scene elements',
      'Mention visual style and atmosphere for better results',
      'Include context about the reference images',
      'Specify desired movement and animation style',
      'Use clear, descriptive language for consistent output'
    ];
  }

  /**
   * Get best practices for reference images
   */
  getReferenceImageBestPractices(): Array<string> {
    return [
      'Use high-quality, clear reference images',
      'Ensure subjects are well-lit and visible',
      'Choose images with consistent lighting and style',
      'Avoid overly complex or cluttered backgrounds',
      'Use images with similar aspect ratios when possible',
      'Include images that show different angles of subjects',
      'Limit to maximum 7 reference images for optimal performance'
    ];
  }
}
