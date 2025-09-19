import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'nano-banana';

// Input interface
export interface NanoBananaInput {
  prompt: string;
  style?: 'cinematic' | 'photographic' | 'artistic' | 'raw' | 'vintage' | 'modern';
  aspect_ratio?: '16:9' | '9:16' | '4:5' | '1:1';
  duration?: '5s' | '10s' | '15s' | '30s';
  resolution?: '720p' | '1080p' | '4K';
  camera_movement?: 'tracking' | 'panning' | 'zooming' | 'orbital' | 'dolly' | 'crane' | 'static';
  negative_prompt?: string;
  seed?: number;
}

// Output interface
export interface NanoBananaOutput {
  video: {
    url: string;
    content_type: string;
    file_name?: string;
    file_size?: number;
    duration?: number;
    resolution?: string;
  };
}

// Error interface
export interface NanoBananaError {
  error: string;
  message: string;
  details?: any;
}

// Result type
export type NanoBananaResult = NanoBananaOutput | NanoBananaError;

// ============================================================================
// MAIN EXECUTOR CLASS
// ============================================================================

export class NanoBananaExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: apiKey });
  }

  /**
   * Generate video using Nano Banana model via fal.subscribe
   * This method handles the complete video generation process synchronously
   */
  async generateVideo(
    input: NanoBananaInput,
    options?: {
      logs?: boolean;
      onQueueUpdate?: (update: any) => void;
    }
  ): Promise<NanoBananaOutput> {
    try {
      this.validateInput(input);

      const result = await fal.subscribe(MODEL_ENDPOINT, {
        input: {
          prompt: input.prompt,
          style: input.style || 'cinematic',
          aspect_ratio: input.aspect_ratio || '16:9',
          duration: input.duration || '10s',
          resolution: input.resolution || '1080p',
          camera_movement: input.camera_movement || 'static',
          negative_prompt: input.negative_prompt,
          seed: input.seed
        },
        logs: options?.logs || false,
        onQueueUpdate: options?.onQueueUpdate
      });

      return result.data as NanoBananaOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Nano Banana video generation failed: ${errorMessage}`);
    }
  }

  /**
   * Generate first frame of a video sequence
   */
  async generateFirstFrame(
    prompt: string,
    options?: {
      style?: string;
      aspect_ratio?: string;
      resolution?: string;
    }
  ): Promise<NanoBananaOutput> {
    const firstFramePrompt = `First frame: ${prompt}`;
    
    return await this.generateVideo({
      prompt: firstFramePrompt,
      style: options?.style as any || 'photographic',
      aspect_ratio: options?.aspect_ratio as any || '4:5',
      duration: '5s',
      resolution: options?.resolution as any || '1080p'
    });
  }

  /**
   * Generate last frame of a video sequence
   */
  async generateLastFrame(
    prompt: string,
    options?: {
      style?: string;
      aspect_ratio?: string;
      resolution?: string;
    }
  ): Promise<NanoBananaOutput> {
    const lastFramePrompt = `Last frame: ${prompt}`;
    
    return await this.generateVideo({
      prompt: lastFramePrompt,
      style: options?.style as any || 'photographic',
      aspect_ratio: options?.aspect_ratio as any || '4:5',
      duration: '5s',
      resolution: options?.resolution as any || '1080p'
    });
  }

  /**
   * Generate video with camera movement
   */
  async generateWithCameraMovement(
    prompt: string,
    cameraMovement: string,
    options?: {
      style?: string;
      aspect_ratio?: string;
      duration?: string;
      resolution?: string;
    }
  ): Promise<NanoBananaOutput> {
    const cameraPrompt = `Camera ${cameraMovement}: ${prompt}`;
    
    return await this.generateVideo({
      prompt: cameraPrompt,
      style: options?.style as any || 'cinematic',
      aspect_ratio: options?.aspect_ratio as any || '16:9',
      duration: options?.duration as any || '10s',
      resolution: options?.resolution as any || '1080p',
      camera_movement: cameraMovement as any
    });
  }

  /**
   * Generate video with specific view angle
   */
  async generateWithViewAngle(
    prompt: string,
    viewAngle: string,
    options?: {
      style?: string;
      aspect_ratio?: string;
      duration?: string;
      resolution?: string;
    }
  ): Promise<NanoBananaOutput> {
    const viewPrompt = `View from ${viewAngle}: ${prompt}`;
    
    return await this.generateVideo({
      prompt: viewPrompt,
      style: options?.style as any || 'photographic',
      aspect_ratio: options?.aspect_ratio as any || '4:5',
      duration: options?.duration as any || '5s',
      resolution: options?.resolution as any || '1080p'
    });
  }

  /**
   * Submit a video generation request to the queue (asynchronous)
   * Use this for long-running requests or when you want to handle the queue manually
   */
  async submitVideoRequest(
    input: NanoBananaInput,
    options?: {
      webhookUrl?: string;
    }
  ): Promise<{ request_id: string }> {
    try {
      this.validateInput(input);

      const result = await fal.queue.submit(MODEL_ENDPOINT, {
        input: {
          prompt: input.prompt,
          style: input.style || 'cinematic',
          aspect_ratio: input.aspect_ratio || '16:9',
          duration: input.duration || '10s',
          resolution: input.resolution || '1080p',
          camera_movement: input.camera_movement || 'static',
          negative_prompt: input.negative_prompt,
          seed: input.seed
        },
        webhookUrl: options?.webhookUrl
      });

      return { request_id: result.request_id };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Nano Banana request submission failed: ${errorMessage}`);
    }
  }

  /**
   * Check the status of a queued video request
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
   * Get the result of a completed video request
   */
  async getRequestResult(requestId: string): Promise<NanoBananaOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId
      });

      return result.data as NanoBananaOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get request result: ${errorMessage}`);
    }
  }

  /**
   * Calculate estimated processing time based on video duration
   */
  estimateProcessingTime(duration: string): string {
    const durationMap: Record<string, number> = {
      '5s': 2,
      '10s': 4,
      '15s': 6,
      '30s': 12
    };

    const minutes = durationMap[duration] || 5;
    
    if (minutes < 1) {
      return 'Less than 1 minute';
    } else if (minutes < 60) {
      return `Approximately ${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.ceil(minutes % 60);
      return `Approximately ${hours} hour${hours > 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
    }
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: NanoBananaInput): void {
    if (!input.prompt) {
      throw new Error('Prompt is required');
    }

    if (input.prompt.length < 10) {
      throw new Error('Prompt must be at least 10 characters long');
    }

    if (input.prompt.length > 1000) {
      throw new Error('Prompt must be less than 1000 characters');
    }

    // Validate style
    const validStyles = ['cinematic', 'photographic', 'artistic', 'raw', 'vintage', 'modern'];
    if (input.style && !validStyles.includes(input.style)) {
      throw new Error(`Invalid style. Valid styles: ${validStyles.join(', ')}`);
    }

    // Validate aspect ratio
    const validAspectRatios = ['16:9', '9:16', '4:5', '1:1'];
    if (input.aspect_ratio && !validAspectRatios.includes(input.aspect_ratio)) {
      throw new Error(`Invalid aspect ratio. Valid ratios: ${validAspectRatios.join(', ')}`);
    }

    // Validate duration
    const validDurations = ['5s', '10s', '15s', '30s'];
    if (input.duration && !validDurations.includes(input.duration)) {
      throw new Error(`Invalid duration. Valid durations: ${validDurations.join(', ')}`);
    }

    // Validate resolution
    const validResolutions = ['720p', '1080p', '4K'];
    if (input.resolution && !validResolutions.includes(input.resolution)) {
      throw new Error(`Invalid resolution. Valid resolutions: ${validResolutions.join(', ')}`);
    }

    // Validate camera movement
    const validCameraMovements = ['tracking', 'panning', 'zooming', 'orbital', 'dolly', 'crane', 'static'];
    if (input.camera_movement && !validCameraMovements.includes(input.camera_movement)) {
      throw new Error(`Invalid camera movement. Valid movements: ${validCameraMovements.join(', ')}`);
    }
  }

  /**
   * Get supported styles
   */
  getSupportedStyles(): string[] {
    return ['cinematic', 'photographic', 'artistic', 'raw', 'vintage', 'modern'];
  }

  /**
   * Get supported aspect ratios
   */
  getSupportedAspectRatios(): string[] {
    return ['16:9', '9:16', '4:5', '1:1'];
  }

  /**
   * Get supported durations
   */
  getSupportedDurations(): string[] {
    return ['5s', '10s', '15s', '30s'];
  }

  /**
   * Get supported resolutions
   */
  getSupportedResolutions(): string[] {
    return ['720p', '1080p', '4K'];
  }

  /**
   * Get supported camera movements
   */
  getSupportedCameraMovements(): string[] {
    return ['tracking', 'panning', 'zooming', 'orbital', 'dolly', 'crane', 'static'];
  }

  /**
   * Get model information
   */
  getModelInfo(): {
    name: string;
    provider: string;
    endpoint: string;
    version: string;
  } {
    return {
      name: 'Nano Banana',
      provider: 'Nano Banana',
      endpoint: MODEL_ENDPOINT,
      version: 'v1.0'
    };
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Create a new NanoBananaExecutor instance
 */
export function createNanoBananaExecutor(apiKey: string): NanoBananaExecutor {
  return new NanoBananaExecutor(apiKey);
}

/**
 * Quick video generation function
 */
export async function generateNanoBananaVideo(
  apiKey: string,
  prompt: string,
  options?: {
    style?: string;
    aspect_ratio?: string;
    duration?: string;
    resolution?: string;
    camera_movement?: string;
    negative_prompt?: string;
    seed?: number;
  }
): Promise<NanoBananaOutput> {
  const executor = new NanoBananaExecutor(apiKey);
  return await executor.generateVideo({
    prompt,
    style: options?.style as any,
    aspect_ratio: options?.aspect_ratio as any,
    duration: options?.duration as any,
    resolution: options?.resolution as any,
    camera_movement: options?.camera_movement as any,
    negative_prompt: options?.negative_prompt,
    seed: options?.seed
  });
}

/**
 * Generate first frame
 */
export async function generateFirstFrame(
  apiKey: string,
  prompt: string,
  options?: {
    style?: string;
    aspect_ratio?: string;
    resolution?: string;
  }
): Promise<NanoBananaOutput> {
  const executor = new NanoBananaExecutor(apiKey);
  return await executor.generateFirstFrame(prompt, options);
}

/**
 * Generate last frame
 */
export async function generateLastFrame(
  apiKey: string,
  prompt: string,
  options?: {
    style?: string;
    aspect_ratio?: string;
    resolution?: string;
  }
): Promise<NanoBananaOutput> {
  const executor = new NanoBananaExecutor(apiKey);
  return await executor.generateLastFrame(prompt, options);
}

/**
 * Generate video with camera movement
 */
export async function generateWithCameraMovement(
  apiKey: string,
  prompt: string,
  cameraMovement: string,
  options?: {
    style?: string;
    aspect_ratio?: string;
    duration?: string;
    resolution?: string;
  }
): Promise<NanoBananaOutput> {
  const executor = new NanoBananaExecutor(apiKey);
  return await executor.generateWithCameraMovement(prompt, cameraMovement, options);
}

/**
 * Generate video with specific view angle
 */
export async function generateWithViewAngle(
  apiKey: string,
  prompt: string,
  viewAngle: string,
  options?: {
    style?: string;
    aspect_ratio?: string;
    duration?: string;
    resolution?: string;
  }
): Promise<NanoBananaOutput> {
  const executor = new NanoBananaExecutor(apiKey);
  return await executor.generateWithViewAngle(prompt, viewAngle, options);
}

export default NanoBananaExecutor;
