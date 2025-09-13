import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/sync-lipsync/v2';

// Input interface
export interface SyncLipsyncV2Input {
  audio: string; // Audio file URL or base64
  video: string; // Video file URL or base64
  sync_mode?: 'cut_off' | 'loop' | 'bounce' | 'silence' | 'remap'; // How to handle duration mismatch
  start_time?: number; // Start time in seconds (optional)
  end_time?: number; // End time in seconds (optional)
  fps?: number; // Output frame rate (optional)
  quality?: 'low' | 'medium' | 'high'; // Output quality (optional)
}

// Output interface
export interface SyncLipsyncV2Output {
  video: string; // Generated lipsync video URL
  duration: number; // Video duration in seconds
  fps: number; // Output frame rate
  sync_mode: string; // Applied sync mode
  processing_time: number; // Processing time in seconds
}

// Error interface
export interface SyncLipsyncV2Error {
  error: string;
  details?: string;
  code?: string;
}

// Default configuration
const DEFAULT_CONFIG: Partial<SyncLipsyncV2Input> = {
  sync_mode: 'cut_off',
  fps: 30,
  quality: 'medium'
};

export class SyncLipsyncV2Executor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  /**
   * Generate lipsync video synchronously
   */
  async generateVideo(input: SyncLipsyncV2Input): Promise<SyncLipsyncV2Output> {
    try {
      const config = { ...DEFAULT_CONFIG, ...input };
      
      const result = await fal.run(this.modelEndpoint, {
        input: config
      });

      return {
        video: (result as any).video || '',
        duration: (result as any).duration || 0,
        fps: (result as any).fps || config.fps || 30,
        sync_mode: (result as any).sync_mode || config.sync_mode || 'cut_off',
        processing_time: (result as any).processing_time || 0
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate lipsync video asynchronously using queue
   */
  async generateVideoAsync(
    input: SyncLipsyncV2Input,
    webhookUrl?: string
  ): Promise<{ requestId: string; status: string }> {
    try {
      const config = { ...DEFAULT_CONFIG, ...input };
      
      const { request_id } = await fal.queue.submit(this.modelEndpoint, {
        input: config
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
  async getResult(requestId: string): Promise<SyncLipsyncV2Output> {
    try {
      const result = await fal.queue.result(this.modelEndpoint, { requestId });
      
      return {
        video: (result as any).video || '',
        duration: (result as any).duration || 0,
        fps: (result as any).fps || 30,
        sync_mode: (result as any).sync_mode || 'cut_off',
        processing_time: (result as any).processing_time || 0
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }



  /**
   * Calculate cost for lipsync generation
   */
  calculateCost(duration: number): number {
    // Base cost per second of output video
    const costPerSecond = 0.15;
    return duration * costPerSecond;
  }

  /**
   * Validate input parameters
   */
  validateInput(input: SyncLipsyncV2Input): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.audio) {
      errors.push('Audio input is required');
    }

    if (!input.video) {
      errors.push('Video input is required');
    }

    if (input.start_time !== undefined && input.start_time < 0) {
      errors.push('Start time must be non-negative');
    }

    if (input.end_time !== undefined && input.end_time <= 0) {
      errors.push('End time must be positive');
    }

    if (input.start_time !== undefined && input.end_time !== undefined && input.start_time >= input.end_time) {
      errors.push('Start time must be less than end time');
    }

    if (input.fps !== undefined && (input.fps < 1 || input.fps > 120)) {
      errors.push('FPS must be between 1 and 120');
    }

    if (input.sync_mode && !['cut_off', 'loop', 'bounce', 'silence', 'remap'].includes(input.sync_mode)) {
      errors.push('Invalid sync mode. Must be one of: cut_off, loop, bounce, silence, remap');
    }

    if (input.quality && !['low', 'medium', 'high'].includes(input.quality)) {
      errors.push('Invalid quality. Must be one of: low, medium, high');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get available sync modes
   */
  getAvailableSyncModes(): Array<{ value: string; description: string }> {
    return [
      { value: 'cut_off', description: 'Cut off audio/video at the shorter duration' },
      { value: 'loop', description: 'Loop the shorter input to match the longer duration' },
      { value: 'bounce', description: 'Bounce back and forth for the shorter input' },
      { value: 'silence', description: 'Add silence to audio if it\'s shorter than video' },
      { value: 'remap', description: 'Remap timing to fit within the target duration' }
    ];
  }

  /**
   * Get available quality options
   */
  getAvailableQualityOptions(): Array<{ value: string; description: string; tradeoff: string }> {
    return [
      { value: 'low', description: 'Fastest processing, lower quality', tradeoff: 'Speed over quality' },
      { value: 'medium', description: 'Balanced processing and quality', tradeoff: 'Balance of speed and quality' },
      { value: 'high', description: 'Highest quality, slower processing', tradeoff: 'Quality over speed' }
    ];
  }

  /**
   * Get available FPS options
   */
  getAvailableFPSOptions(): Array<{ value: number; description: string; useCase: string }> {
    return [
      { value: 24, description: 'Cinematic frame rate', useCase: 'Film, cinematic content' },
      { value: 30, description: 'Standard video frame rate', useCase: 'General video content' },
      { value: 60, description: 'High frame rate', useCase: 'Smooth motion, gaming content' }
    ];
  }

  /**
   * Get model information
   */
  getModelInfo(): { name: string; version: string; description: string; capabilities: string[] } {
    return {
      name: 'Sync Lipsync v2',
      version: '2.0',
      description: 'AI-powered lipsync animation that synchronizes video with audio input',
      capabilities: [
        'Realistic lipsync generation',
        'Multiple sync modes for duration handling',
        'Configurable output quality and frame rate',
        'Support for various audio and video formats',
        'Professional-grade output suitable for content creation'
      ]
    };
  }

  /**
   * Get optimal settings for different use cases
   */
  getOptimalSettings(useCase: 'content_creation' | 'streaming' | 'professional' | 'quick_demo'): Partial<SyncLipsyncV2Input> {
    switch (useCase) {
      case 'content_creation':
        return { quality: 'medium', fps: 30, sync_mode: 'cut_off' };
      case 'streaming':
        return { quality: 'low', fps: 30, sync_mode: 'loop' };
      case 'professional':
        return { quality: 'high', fps: 60, sync_mode: 'remap' };
      case 'quick_demo':
        return { quality: 'low', fps: 24, sync_mode: 'cut_off' };
      default:
        return { quality: 'medium', fps: 30, sync_mode: 'cut_off' };
    }
  }

  /**
   * Get cost comparison for different durations
   */
  getCostComparison(durations: number[]): Array<{ duration: number; cost: number; costPerMinute: number }> {
    return durations.map(duration => ({
      duration,
      cost: this.calculateCost(duration),
      costPerMinute: this.calculateCost(duration) * (60 / duration)
    }));
  }

  /**
   * Check if sync mode is supported
   */
  isSyncModeSupported(syncMode: string): boolean {
    return ['cut_off', 'loop', 'bounce', 'silence', 'remap'].includes(syncMode);
  }

  /**
   * Check if quality option is supported
   */
  isQualitySupported(quality: string): boolean {
    return ['low', 'medium', 'high'].includes(quality);
  }

  /**
   * Check if FPS is supported
   */
  isFPSSupported(fps: number): boolean {
    return fps >= 1 && fps <= 120;
  }

  /**
   * Get recommended sync mode based on audio/video duration
   */
  getRecommendedSyncMode(audioDuration: number, videoDuration: number): string {
    const durationDiff = Math.abs(audioDuration - videoDuration);
    const ratio = Math.max(audioDuration, videoDuration) / Math.min(audioDuration, videoDuration);

    if (durationDiff < 1) {
      return 'cut_off'; // Minimal difference, cut off is fine
    } else if (ratio < 2) {
      return 'remap'; // Moderate difference, remap for better sync
    } else if (audioDuration < videoDuration) {
      return 'loop'; // Audio is shorter, loop it
    } else {
      return 'cut_off'; // Video is shorter, cut off audio
    }
  }

  /**
   * Get tips for optimal lipsync results
   */
  getLipsyncOptimizationTips(): string[] {
    return [
      'Use clear, high-quality audio for better lipsync accuracy',
      'Ensure video has good lighting and clear facial features',
      'Choose appropriate sync mode based on duration differences',
      'Consider using higher quality settings for professional content',
      'Test with shorter clips first to optimize settings',
      'Use consistent audio levels throughout the input',
      'Avoid background noise in audio input'
    ];
  }

  /**
   * Get supported audio formats
   */
  getSupportedAudioFormats(): string[] {
    return ['mp3', 'wav', 'aac', 'ogg', 'm4a'];
  }

  /**
   * Get supported video formats
   */
  getSupportedVideoFormats(): string[] {
    return ['mp4', 'mov', 'avi', 'mkv', 'webm'];
  }

  /**
   * Handle errors consistently
   */
  private handleError(error: any): SyncLipsyncV2Error {
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
