import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'creatify/lipsync';

// Input interface
export interface CreatifyLipsyncInput {
  audio_url: string;
  video_url: string;
  loop?: boolean;
}

// Output interface
export interface CreatifyLipsyncOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error types
export interface CreatifyLipsyncError {
  message: string;
  code?: string;
}

// Main executor class
export class CreatifyLipsyncExecutor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  /**
   * Generate a lipsync video using fal.subscribe
   * @param input - The input parameters for lipsync generation
   * @param options - Additional options for the request
   * @returns Promise with the generated video result
   */
  async generateVideo(
    input: CreatifyLipsyncInput,
    options?: {
      logs?: boolean;
      onQueueUpdate?: (update: any) => void;
    }
  ): Promise<CreatifyLipsyncOutput> {
    try {
      // Validate input
      this.validateInput(input);

      const result = await fal.subscribe(this.modelEndpoint, {
        input,
        logs: options?.logs ?? false,
        onQueueUpdate: options?.onQueueUpdate,
      });

      return result.data as CreatifyLipsyncOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Lipsync generation failed: ${errorMessage}`);
    }
  }

  /**
   * Submit a lipsync request to the queue for long-running processing
   * @param input - The input parameters for lipsync generation
   * @param options - Additional options including webhook URL
   * @returns Promise with the request ID
   */
  async submitToQueue(
    input: CreatifyLipsyncInput,
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
  static async getQueueResult(requestId: string): Promise<CreatifyLipsyncOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });

      return result.data as CreatifyLipsyncOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Result retrieval failed: ${errorMessage}`);
    }
  }

  /**
   * Calculate the cost for lipsync generation based on audio duration
   * @param audioDurationMinutes - Duration of the audio in minutes
   * @returns Cost in USD
   */
  calculateCost(audioDurationMinutes: number): number {
    if (audioDurationMinutes <= 0) {
      throw new Error('Audio duration must be greater than 0');
    }
    // Base cost: $1 per audio minute
    const baseCost = 1.0;
    return audioDurationMinutes * baseCost;
  }

  /**
   * Validate input parameters
   * @param input - The input parameters to validate
   */
  private validateInput(input: CreatifyLipsyncInput): void {
    if (!input.audio_url) {
      throw new Error('audio_url is required');
    }
    if (!input.video_url) {
      throw new Error('video_url is required');
    }
    
    // Validate URL format
    try {
      new URL(input.audio_url);
      new URL(input.video_url);
    } catch {
      throw new Error('Invalid URL format for audio_url or video_url');
    }
  }

  // Utility methods for common use cases

  /**
   * Get available audio formats and recommendations
   * @returns Object with format recommendations
   */
  static getAudioFormatRecommendations() {
    return {
      recommended_formats: ['mp3', 'wav', 'm4a', 'aac'],
      max_duration: '10 minutes',
      quality_tips: [
        'Use high-quality audio (44.1kHz or higher)',
        'Ensure clear speech without background noise',
        'Avoid audio with heavy compression artifacts',
        'Use consistent volume levels throughout the audio'
      ]
    };
  }

  /**
   * Get available video formats and recommendations
   * @returns Object with format recommendations
   */
  static getVideoFormatRecommendations() {
    return {
      recommended_formats: ['mp4', 'mov', 'avi', 'mkv'],
      resolution_tips: [
        '720p or higher for best quality',
        'Ensure good lighting on the subject\'s face',
        'Subject should be clearly visible and centered',
        'Avoid rapid camera movements during speech'
      ]
    };
  }

  /**
   * Get lipsync optimization tips
   * @returns Object with optimization recommendations
   */
  static getLipsyncOptimizationTips() {
    return {
      audio_optimization: [
        'Use clear, well-enunciated speech',
        'Avoid background music or noise',
        'Ensure consistent audio levels',
        'Use high-quality microphone recordings'
      ],
      video_optimization: [
        'Good lighting on the subject\'s face',
        'Clear view of the mouth and lips',
        'Stable camera positioning',
        'Appropriate video length (not too long)'
      ],
      content_tips: [
        'Match video content with audio content',
        'Use appropriate facial expressions',
        'Consider the target audience',
        'Test with different audio lengths'
      ]
    };
  }

  /**
   * Get common use cases and examples
   * @returns Object with use case examples
   */
  static getCommonUseCases() {
    return {
      marketing: [
        'Product demonstration videos',
        'Brand spokesperson messages',
        'Social media content',
        'Advertisement voiceovers'
      ],
      education: [
        'Language learning videos',
        'Tutorial presentations',
        'Educational content',
        'Training materials'
      ],
      entertainment: [
        'Character voiceovers',
        'Music video synchronization',
        'Podcast visual content',
        'Gaming content'
      ],
      business: [
        'Corporate presentations',
        'Sales pitch videos',
        'Customer testimonials',
        'Internal communications'
      ]
    };
  }

  /**
   * Get technical considerations and limitations
   * @returns Object with technical information
   */
  static getTechnicalConsiderations() {
    return {
      processing_time: 'Varies based on audio length and video quality',
      quality_factors: [
        'Audio clarity and quality',
        'Video resolution and lighting',
        'Subject positioning and visibility',
        'Audio-video synchronization accuracy'
      ],
      limitations: [
        'Audio must contain clear speech',
        'Video should have good facial visibility',
        'Processing time increases with longer content',
        'Quality depends on input material quality'
      ],
      best_practices: [
        'Use high-quality input materials',
        'Ensure good lighting and audio',
        'Test with shorter clips first',
        'Consider the final use case'
      ]
    };
  }

  /**
   * Get cost examples for different audio lengths
   * @returns Object with cost examples
   */
  static getCostExamples() {
    return {
      short_content: [
        { duration: '30_seconds', cost: 0.50, description: 'Short social media clip' },
        { duration: '1_minute', cost: 1.00, description: 'Standard marketing message' },
        { duration: '2_minutes', cost: 2.00, description: 'Extended product demo' }
      ],
      medium_content: [
        { duration: '5_minutes', cost: 5.00, description: 'Detailed tutorial' },
        { duration: '10_minutes', cost: 10.00, description: 'Comprehensive presentation' }
      ],
      long_content: [
        { duration: '15_minutes', cost: 15.00, description: 'Extended training session' },
        { duration: '30_minutes', cost: 30.00, description: 'Full presentation or lecture' }
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
        'Compress audio to reduce file size while maintaining quality',
        'Use appropriate video compression settings',
        'Ensure optimal lighting and audio recording conditions',
        'Prepare clear, well-structured content'
      ],
      processing_tips: [
        'Use queue processing for longer content',
        'Monitor queue status for progress updates',
        'Implement webhook handling for automated processing',
        'Plan processing during off-peak hours'
      ],
      output_optimization: [
        'Choose appropriate output format for your use case',
        'Consider different quality settings for different platforms',
        'Test output on target devices and platforms',
        'Optimize for streaming or download requirements'
      ]
    };
  }
}
