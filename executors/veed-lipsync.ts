import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'veed/lipsync';

// Input interface
export interface VeedLipsyncInput {
  video_url: string;
  audio_url: string;
}

// Output interface
export interface VeedLipsyncOutput {
  video: {
    url: string;
    content_type: string;
    file_name?: string;
    file_size?: number;
  };
}

// Error interface
export interface VeedLipsyncError {
  error: string;
  message: string;
  details?: any;
}

// Result type
export type VeedLipsyncResult = VeedLipsyncOutput | VeedLipsyncError;

// ============================================================================
// MAIN EXECUTOR CLASS
// ============================================================================

export class VeedLipsyncExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: apiKey });
  }

  /**
   * Generate lipsync video using VEED's model via fal.subscribe
   * This method handles the complete lipsync generation process synchronously
   */
  async generateLipsync(
    input: VeedLipsyncInput,
    options?: {
      logs?: boolean;
      onQueueUpdate?: (update: any) => void;
    }
  ): Promise<VeedLipsyncOutput> {
    try {
      this.validateInput(input);

      const result = await fal.subscribe(MODEL_ENDPOINT, {
        input: {
          video_url: input.video_url,
          audio_url: input.audio_url
        },
        logs: options?.logs || false,
        onQueueUpdate: options?.onQueueUpdate
      });

      return result.data as VeedLipsyncOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`VEED Lipsync generation failed: ${errorMessage}`);
    }
  }

  /**
   * Submit a lipsync generation request to the queue (asynchronous)
   * Use this for long-running requests or when you want to handle the queue manually
   */
  async submitLipsyncRequest(
    input: VeedLipsyncInput,
    options?: {
      webhookUrl?: string;
    }
  ): Promise<{ request_id: string }> {
    try {
      this.validateInput(input);

      const result = await fal.queue.submit(MODEL_ENDPOINT, {
        input: {
          video_url: input.video_url,
          audio_url: input.audio_url
        },
        webhookUrl: options?.webhookUrl
      });

      return { request_id: result.request_id };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`VEED Lipsync request submission failed: ${errorMessage}`);
    }
  }

  /**
   * Check the status of a queued lipsync request
   */
  async getRequestStatus(
    requestId: string,
    options?: {
      logs?: boolean;
    }
  ): Promise<any> {
    try {
      const status = await fal.queue.status(MODEL_ENDPOINT, {
        requestId,
        logs: options?.logs || false
      });

      return status;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get request status: ${errorMessage}`);
    }
  }

  /**
   * Get the result of a completed lipsync request
   */
  async getRequestResult(requestId: string): Promise<VeedLipsyncOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId
      });

      return result.data as VeedLipsyncOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get request result: ${errorMessage}`);
    }
  }

  /**
   * Calculate the cost for lipsync generation based on video duration
   */
  calculateCost(videoDurationMinutes: number): number {
    const ratePerMinute = 0.4; // $0.4 per minute
    return videoDurationMinutes * ratePerMinute;
  }

  /**
   * Estimate processing time based on video duration
   */
  estimateProcessingTime(videoDurationMinutes: number): string {
    // Rough estimation: 1-2 minutes processing per minute of video
    const processingTimeMinutes = Math.max(1, videoDurationMinutes * 1.5);
    
    if (processingTimeMinutes < 1) {
      return 'Less than 1 minute';
    } else if (processingTimeMinutes < 60) {
      return `Approximately ${Math.ceil(processingTimeMinutes)} minutes`;
    } else {
      const hours = Math.floor(processingTimeMinutes / 60);
      const minutes = Math.ceil(processingTimeMinutes % 60);
      return `Approximately ${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: VeedLipsyncInput): void {
    if (!input.video_url) {
      throw new Error('Video URL is required');
    }

    if (!input.audio_url) {
      throw new Error('Audio URL is required');
    }

    if (!this.isValidUrl(input.video_url)) {
      throw new Error('Invalid video URL format');
    }

    if (!this.isValidUrl(input.audio_url)) {
      throw new Error('Invalid audio URL format');
    }

    // Validate video file format
    const videoFormats = ['.mp4', '.mov', '.webm', '.m4v', '.gif'];
    const videoExtension = this.getFileExtension(input.video_url);
    if (!videoFormats.includes(videoExtension)) {
      throw new Error(`Unsupported video format: ${videoExtension}. Supported formats: ${videoFormats.join(', ')}`);
    }

    // Validate audio file format
    const audioFormats = ['.mp3', '.ogg', '.wav', '.m4a', '.aac'];
    const audioExtension = this.getFileExtension(input.audio_url);
    if (!audioFormats.includes(audioExtension)) {
      throw new Error(`Unsupported audio format: ${audioExtension}. Supported formats: ${audioFormats.join(', ')}`);
    }
  }

  /**
   * Check if URL is valid
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get file extension from URL
   */
  private getFileExtension(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const lastDotIndex = pathname.lastIndexOf('.');
      
      if (lastDotIndex === -1) {
        return '';
      }
      
      return pathname.substring(lastDotIndex).toLowerCase();
    } catch {
      return '';
    }
  }

  /**
   * Get supported video formats
   */
  getSupportedVideoFormats(): string[] {
    return ['mp4', 'mov', 'webm', 'm4v', 'gif'];
  }

  /**
   * Get supported audio formats
   */
  getSupportedAudioFormats(): string[] {
    return ['mp3', 'ogg', 'wav', 'm4a', 'aac'];
  }

  /**
   * Get model information
   */
  getModelInfo(): {
    name: string;
    provider: string;
    endpoint: string;
    pricing: {
      rate: number;
      unit: string;
    };
  } {
    return {
      name: 'VEED Lipsync',
      provider: 'VEED',
      endpoint: MODEL_ENDPOINT,
      pricing: {
        rate: 0.4,
        unit: 'per minute'
      }
    };
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Create a new VeedLipsyncExecutor instance
 */
export function createVeedLipsyncExecutor(apiKey: string): VeedLipsyncExecutor {
  return new VeedLipsyncExecutor(apiKey);
}

/**
 * Quick lipsync generation function
 */
export async function generateLipsync(
  apiKey: string,
  videoUrl: string,
  audioUrl: string,
  options?: {
    logs?: boolean;
    onQueueUpdate?: (update: any) => void;
  }
): Promise<VeedLipsyncOutput> {
  const executor = new VeedLipsyncExecutor(apiKey);
  return await executor.generateLipsync(
    {
      video_url: videoUrl,
      audio_url: audioUrl
    },
    options
  );
}

/**
 * Submit lipsync request to queue
 */
export async function submitLipsyncRequest(
  apiKey: string,
  videoUrl: string,
  audioUrl: string,
  options?: {
    webhookUrl?: string;
  }
): Promise<{ request_id: string }> {
  const executor = new VeedLipsyncExecutor(apiKey);
  return await executor.submitLipsyncRequest(
    {
      video_url: videoUrl,
      audio_url: audioUrl
    },
    options
  );
}

/**
 * Calculate lipsync cost
 */
export function calculateLipsyncCost(videoDurationMinutes: number): number {
  const ratePerMinute = 0.4;
  return videoDurationMinutes * ratePerMinute;
}

/**
 * Estimate processing time
 */
export function estimateLipsyncProcessingTime(videoDurationMinutes: number): string {
  const processingTimeMinutes = Math.max(1, videoDurationMinutes * 1.5);
  
  if (processingTimeMinutes < 1) {
    return 'Less than 1 minute';
  } else if (processingTimeMinutes < 60) {
    return `Approximately ${Math.ceil(processingTimeMinutes)} minutes`;
  } else {
    const hours = Math.floor(processingTimeMinutes / 60);
    const minutes = Math.ceil(processingTimeMinutes % 60);
    return `Approximately ${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
}

export default VeedLipsyncExecutor;