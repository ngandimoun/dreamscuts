import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/film/video';

// Input interface
export interface FalAiFilmVideoInput {
  video_url: string;
  num_frames?: number;
  use_scene_detection?: boolean;
  use_calculated_fps?: boolean;
  fps?: number;
  loop?: boolean;
}

// Output interface
export interface FalAiFilmVideoOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error types
export interface FalAiFilmVideoError {
  message: string;
  code?: string;
}

// Main executor class
export class FalAiFilmVideoExecutor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  /**
   * Interpolate video frames using fal.subscribe
   * @param input - The input parameters for frame interpolation
   * @param options - Additional options for the request
   * @returns Promise with the interpolated video result
   */
  async interpolateVideo(
    input: FalAiFilmVideoInput,
    options?: {
      logs?: boolean;
      onQueueUpdate?: (update: any) => void;
    }
  ): Promise<FalAiFilmVideoOutput> {
    try {
      // Validate input
      this.validateInput(input);

      const result = await fal.subscribe(this.modelEndpoint, {
        input,
        logs: options?.logs ?? false,
        onQueueUpdate: options?.onQueueUpdate,
      });

      return result.data as FalAiFilmVideoOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Frame interpolation failed: ${errorMessage}`);
    }
  }

  /**
   * Submit a frame interpolation request to the queue for long-running processing
   * @param input - The input parameters for frame interpolation
   * @param options - Additional options including webhook URL
   * @returns Promise with the request ID
   */
  async submitToQueue(
    input: FalAiFilmVideoInput,
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
   * @returns Promise with the interpolated video result
   */
  static async getQueueResult(requestId: string): Promise<FalAiFilmVideoOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId,
      });

      return result.data as FalAiFilmVideoOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Result retrieval failed: ${errorMessage}`);
    }
  }

  /**
   * Calculate the cost for frame interpolation based on compute seconds
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
   * Estimate compute seconds based on video duration and frame interpolation settings
   * @param videoDurationSeconds - Duration of the input video in seconds
   * @param numFrames - Number of frames to interpolate between
   * @param useSceneDetection - Whether scene detection is enabled
   * @returns Estimated compute seconds
   */
  estimateComputeSeconds(
    videoDurationSeconds: number,
    numFrames: number = 1,
    useSceneDetection: boolean = false
  ): number {
    if (videoDurationSeconds <= 0) {
      throw new Error('Video duration must be greater than 0');
    }
    if (numFrames < 0) {
      throw new Error('Number of frames must be non-negative');
    }

    // Base computation time per second of video
    const baseComputationPerSecond = 2.0;
    
    // Frame interpolation multiplier
    const frameMultiplier = 1 + (numFrames * 0.5);
    
    // Scene detection multiplier (adds processing overhead)
    const sceneDetectionMultiplier = useSceneDetection ? 1.2 : 1.0;
    
    return videoDurationSeconds * baseComputationPerSecond * frameMultiplier * sceneDetectionMultiplier;
  }

  /**
   * Validate input parameters
   * @param input - The input parameters to validate
   */
  private validateInput(input: FalAiFilmVideoInput): void {
    if (!input.video_url) {
      throw new Error('video_url is required');
    }
    
    // Validate URL format
    try {
      new URL(input.video_url);
    } catch {
      throw new Error('Invalid URL format for video_url');
    }

    // Validate optional parameters
    if (input.num_frames !== undefined && input.num_frames < 0) {
      throw new Error('num_frames must be non-negative');
    }
    
    if (input.fps !== undefined && input.fps <= 0) {
      throw new Error('fps must be greater than 0');
    }
  }

  // Utility methods for common use cases

  /**
   * Get recommended frame interpolation settings for different video types
   * @returns Object with recommendations for different video categories
   */
  static getFrameInterpolationRecommendations() {
    return {
      smooth_motion: {
        num_frames: 2,
        use_scene_detection: true,
        use_calculated_fps: true,
        description: 'For smooth motion videos like walking, dancing, or sports'
      },
      cinematic: {
        num_frames: 1,
        use_scene_detection: true,
        use_calculated_fps: false,
        fps: 24,
        description: 'For cinematic content with natural motion'
      },
      slow_motion: {
        num_frames: 3,
        use_scene_detection: false,
        use_calculated_fps: true,
        description: 'For creating slow-motion effects'
      },
      action: {
        num_frames: 2,
        use_scene_detection: true,
        use_calculated_fps: true,
        description: 'For action sequences with fast movement'
      },
      subtle_motion: {
        num_frames: 1,
        use_scene_detection: false,
        use_calculated_fps: true,
        description: 'For videos with subtle movements'
      }
    };
  }

  /**
   * Get scene detection recommendations
   * @returns Object with scene detection guidance
   */
  static getSceneDetectionRecommendations() {
    return {
      enabled_recommendations: [
        'Videos with clear scene transitions',
        'Content with multiple distinct locations',
        'Videos with different lighting conditions',
        'Content with camera cuts or edits',
        'Videos with different subjects or contexts'
      ],
      disabled_recommendations: [
        'Single continuous shot videos',
        'Videos with gradual transitions',
        'Content with subtle scene changes',
        'Videos where smooth continuity is important',
        'Content with artistic transitions'
      ],
      considerations: [
        'Scene detection may create false positives',
        'Can affect smooth motion between scenes',
        'May increase processing time',
        'Useful for removing smear frames between scenes'
      ]
    };
  }

  /**
   * Get FPS optimization tips
   * @returns Object with FPS optimization guidance
   */
  static getFpsOptimizationTips() {
    return {
      calculated_fps_benefits: [
        'Automatically adjusts to input video characteristics',
        'Maintains natural motion timing',
        'Optimizes for content-specific requirements',
        'Reduces manual parameter tuning'
      ],
      manual_fps_benefits: [
        'Precise control over output timing',
        'Consistent output across different inputs',
        'Predictable processing requirements',
        'Better for batch processing workflows'
      ],
      recommended_fps_values: {
        cinematic: 24,
        standard: 30,
        smooth: 60,
        web: 25,
        broadcast: 29.97
      }
    };
  }

  /**
   * Get common use cases and examples
   * @returns Object with use case examples
   */
  static getCommonUseCases() {
    return {
      content_creation: [
        'Smooth motion for social media content',
        'Enhanced video quality for marketing materials',
        'Professional video production enhancement',
        'Content creator workflow optimization'
      ],
      entertainment: [
        'Smooth action sequences in videos',
        'Enhanced dance and movement videos',
        'Improved sports and action content',
        'Cinematic video enhancement'
      ],
      business: [
        'Professional presentation videos',
        'Training material enhancement',
        'Product demonstration videos',
        'Corporate communication content'
      ],
      technical: [
        'Video frame rate conversion',
        'Motion analysis preparation',
        'Video compression optimization',
        'Frame interpolation for research'
      ]
    };
  }

  /**
   * Get technical considerations and limitations
   * @returns Object with technical information
   */
  static getTechnicalConsiderations() {
    return {
      processing_time: 'Varies based on video length, resolution, and frame interpolation settings',
      quality_factors: [
        'Input video quality and resolution',
        'Motion complexity and scene changes',
        'Frame interpolation settings',
        'Scene detection accuracy'
      ],
      limitations: [
        'Best results with clear, high-quality input videos',
        'Scene detection may create false positives',
        'Processing time increases with video length and complexity',
        'Quality depends on input material characteristics'
      ],
      best_practices: [
        'Use high-quality input videos',
        'Test with shorter clips first',
        'Consider scene detection for complex content',
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
      short_content: [
        { duration: '10_seconds', num_frames: 1, estimated_cost: 0.026, description: 'Short clip with basic interpolation' },
        { duration: '15_seconds', num_frames: 2, estimated_cost: 0.078, description: 'Medium clip with enhanced interpolation' },
        { duration: '30_seconds', num_frames: 1, estimated_cost: 0.078, description: 'Longer clip with basic interpolation' }
      ],
      medium_content: [
        { duration: '1_minute', num_frames: 1, estimated_cost: 0.156, description: '1-minute video with basic interpolation' },
        { duration: '2_minutes', num_frames: 2, estimated_cost: 0.468, description: '2-minute video with enhanced interpolation' }
      ],
      long_content: [
        { duration: '5_minutes', num_frames: 1, estimated_cost: 0.78, description: '5-minute video with basic interpolation' },
        { duration: '10_minutes', num_frames: 2, estimated_cost: 2.34, description: '10-minute video with enhanced interpolation' }
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
        'Use compressed but high-quality input videos',
        'Ensure consistent video format and codec',
        'Optimize video resolution for your use case',
        'Prepare videos with clear motion patterns'
      ],
      processing_tips: [
        'Use queue processing for longer videos',
        'Monitor queue status for progress updates',
        'Implement webhook handling for automated processing',
        'Plan processing during off-peak hours'
      ],
      output_optimization: [
        'Choose appropriate frame interpolation settings',
        'Consider scene detection for complex content',
        'Balance quality and processing time',
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
        'Ensure input video has clear motion and good quality',
        'Try different frame interpolation settings',
        'Check if scene detection is appropriate for your content',
        'Verify input video format and codec compatibility'
      ],
      processing_issues: [
        'Use queue processing for longer videos',
        'Check video URL accessibility and format',
        'Verify API key and authentication',
        'Monitor queue status for error messages'
      ],
      performance_issues: [
        'Start with shorter clips for testing',
        'Use appropriate frame interpolation settings',
        'Consider scene detection for complex content',
        'Balance quality and processing time requirements'
      ]
    };
  }
}
