import { fal } from '@fal-ai/client';

// Input interface for the image-to-video model
export interface Ltxv13b098DistilledImageToVideoInput {
  prompt: string;
  image_url: string;
  negative_prompt?: string;
  loras?: Array<{
    path: string;
    weight_name?: string;
    scale?: number;
  }>;
  resolution?: '480p' | '720p';
  aspect_ratio?: '9:16' | '1:1' | '16:9' | 'auto';
  seed?: number;
  num_frames?: number;
  first_pass_num_inference_steps?: number;
  second_pass_num_inference_steps?: number;
  second_pass_skip_initial_steps?: number;
  frame_rate?: number;
  expand_prompt?: boolean;
  reverse_video?: boolean;
  enable_safety_checker?: boolean;
  enable_detail_pass?: boolean;
  temporal_adain_factor?: number;
  tone_map_compression_ratio?: number;
  constant_rate_factor?: number;
}

// Output interface for the image-to-video model
export interface Ltxv13b098DistilledImageToVideoOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
    file_data?: string;
  };
  prompt: string;
  seed?: number;
}

// Error types
export interface Ltxv13b098DistilledImageToVideoError {
  message: string;
  code?: string;
  details?: unknown;
}

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/ltxv-13b-098-distilled/image-to-video';

/**
 * Executor for the fal-ai/ltxv-13b-098-distilled/image-to-video model
 * Generates videos from prompts and images using LTX Video-0.9.8 13B Distilled
 */
export class Ltxv13b098DistilledImageToVideoExecutor {
  /**
   * Generate a video from a prompt and image using the LTX Video model
   */
  static async generateVideo(
    input: Ltxv13b098DistilledImageToVideoInput
  ): Promise<Ltxv13b098DistilledImageToVideoOutput> {
    try {
      // Validate required inputs
      if (!input.prompt) {
        throw new Error('Prompt is required');
      }
      if (!input.image_url) {
        throw new Error('Image URL is required');
      }
      if (input.prompt.length > 1000) {
        throw new Error('Prompt must be 1000 characters or less');
      }

      const result = await fal.subscribe(MODEL_ENDPOINT, {
        input: {
          prompt: input.prompt,
          image_url: input.image_url,
          negative_prompt: input.negative_prompt || 'worst quality, inconsistent motion, blurry, jittery, distorted',
          loras: input.loras || [],
          resolution: input.resolution || '720p',
          aspect_ratio: input.aspect_ratio || 'auto',
          seed: input.seed,
          num_frames: input.num_frames || 121,
          first_pass_num_inference_steps: input.first_pass_num_inference_steps || 8,
          second_pass_num_inference_steps: input.second_pass_num_inference_steps || 8,
          second_pass_skip_initial_steps: input.second_pass_skip_initial_steps || 5,
          frame_rate: input.frame_rate || 24,
          expand_prompt: input.expand_prompt || false,
          reverse_video: input.reverse_video || false,
          enable_safety_checker: input.enable_safety_checker !== false,
          enable_detail_pass: input.enable_detail_pass || false,
          temporal_adain_factor: input.temporal_adain_factor || 0.5,
          tone_map_compression_ratio: input.tone_map_compression_ratio || 0,
          constant_rate_factor: input.constant_rate_factor || 29,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            update.logs?.map((log) => log.message).forEach(console.log);
          }
        },
      });

      return result.data as Ltxv13b098DistilledImageToVideoOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Video generation failed: ${errorMessage}`);
    }
  }

  /**
   * Submit a video generation request to the queue
   */
  static async submitToQueue(
    input: Ltxv13b098DistilledImageToVideoInput,
    webhookUrl?: string
  ): Promise<{ request_id: string }> {
    try {
      // Validate required inputs
      if (!input.prompt) {
        throw new Error('Prompt is required');
      }
      if (!input.image_url) {
        throw new Error('Image URL is required');
      }
      if (input.prompt.length > 1000) {
        throw new Error('Prompt must be 1000 characters or less');
      }

      const { request_id } = await fal.queue.submit(MODEL_ENDPOINT, {
        input: {
          prompt: input.prompt,
          image_url: input.image_url,
          negative_prompt: input.negative_prompt || 'worst quality, inconsistent motion, blurry, jittery, distorted',
          loras: input.loras || [],
          resolution: input.resolution || '720p',
          aspect_ratio: input.aspect_ratio || 'auto',
          seed: input.seed,
          num_frames: input.num_frames || 121,
          first_pass_num_inference_steps: input.first_pass_num_inference_steps || 8,
          second_pass_num_inference_steps: input.second_pass_num_inference_steps || 8,
          second_pass_skip_initial_steps: input.second_pass_skip_initial_steps || 5,
          frame_rate: input.frame_rate || 24,
          expand_prompt: input.expand_prompt || false,
          reverse_video: input.reverse_video || false,
          enable_safety_checker: input.enable_safety_checker !== false,
          enable_detail_pass: input.enable_detail_pass || false,
          temporal_adain_factor: input.temporal_adain_factor || 0.5,
          tone_map_compression_ratio: input.tone_map_compression_ratio || 0,
          constant_rate_factor: input.constant_rate_factor || 29,
        },
        webhookUrl,
      });

      return { request_id };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Queue submission failed: ${errorMessage}`);
    }
  }

  /**
   * Check the status of a queued request
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
   */
  static async getQueueResult(
    requestId: string
  ): Promise<Ltxv13b098DistilledImageToVideoOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, { requestId });
      return result.data as Ltxv13b098DistilledImageToVideoOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Result retrieval failed: ${errorMessage}`);
    }
  }

  /**
   * Calculate the estimated cost for video generation
   */
  static calculateCost(
    durationSeconds: number,
    resolution: '480p' | '720p' = '720p',
    enableDetailPass = false
  ): number {
    const baseCostPerSecond = 0.02;
    let totalCost = baseCostPerSecond * durationSeconds;

    // Apply detail pass multiplier (2x cost)
    if (enableDetailPass) {
      totalCost *= 2;
    }

    return Math.round(totalCost * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Get available resolutions for the model
   */
  static getAvailableResolutions(): Array<'480p' | '720p'> {
    return ['480p', '720p'];
  }

  /**
   * Get available aspect ratios for the model
   */
  static getAvailableAspectRatios(): Array<'9:16' | '1:1' | '16:9' | 'auto'> {
    return ['9:16', '1:1', '16:9', 'auto'];
  }

  /**
   * Get recommended frame count for different video durations
   */
  static getRecommendedFrameCount(durationSeconds: number): number {
    const frameRate = 24;
    return Math.round(durationSeconds * frameRate);
  }

  /**
   * Get recommended inference steps for different quality levels
   */
  static getRecommendedInferenceSteps(quality: 'fast' | 'balanced' | 'high' = 'balanced'): {
    firstPass: number;
    secondPass: number;
  } {
    switch (quality) {
      case 'fast':
        return { firstPass: 6, secondPass: 6 };
      case 'balanced':
        return { firstPass: 8, secondPass: 8 };
      case 'high':
        return { firstPass: 12, secondPass: 12 };
      default:
        return { firstPass: 8, secondPass: 8 };
    }
  }

  /**
   * Get LoRA usage recommendations
   */
  static getLoRARecommendations(): Array<{
    name: string;
    description: string;
    useCase: string;
  }> {
    return [
      {
        name: 'Style LoRAs',
        description: 'Apply specific artistic styles to your videos',
        useCase: 'Use for consistent visual style across frames',
      },
      {
        name: 'Character LoRAs',
        description: 'Maintain consistent character appearance',
        useCase: 'Use for character-driven narratives',
      },
      {
        name: 'Object LoRAs',
        description: 'Ensure consistent object representation',
        useCase: 'Use for product demonstrations or object-focused content',
      },
    ];
  }

  /**
   * Get prompt optimization tips
   */
  static getPromptOptimizationTips(): Array<string> {
    return [
      'Be specific about visual elements and composition',
      'Include camera movement descriptions for dynamic shots',
      'Specify lighting and atmosphere for mood',
      'Mention specific objects or characters that should appear',
      'Use descriptive adjectives for visual quality',
      'Include temporal elements (time of day, weather)',
      'Specify artistic style or cinematic techniques',
    ];
  }

  /**
   * Get detail pass recommendations
   */
  static getDetailPassRecommendations(): {
    whenToUse: string;
    costImpact: string;
    qualityImprovement: string;
  } {
    return {
      whenToUse: 'Use for high-quality outputs, close-up shots, or when fine details matter',
      costImpact: 'Doubles the cost but significantly improves visual quality',
      qualityImprovement: 'Enhances texture, lighting, and fine details in the video',
    };
  }

  /**
   * Get temporal AdaIN factor recommendations
   */
  static getTemporalAdaINRecommendations(): {
    lowValue: string;
    highValue: string;
    balancedValue: string;
  } {
    return {
      lowValue: '0.1-0.3: Allows more color variation across frames',
      highValue: '0.7-0.9: Ensures consistent color distribution',
      balancedValue: '0.5: Good balance between consistency and variation',
    };
  }

  /**
   * Get tone mapping recommendations
   */
  static getToneMappingRecommendations(): {
    lowValue: string;
    highValue: string;
    balancedValue: string;
  } {
    return {
      lowValue: '0.0: No compression, preserves original dynamic range',
      highValue: '1.0: Maximum compression, improves visual consistency',
      balancedValue: '0.5: Moderate compression for balanced results',
    };
  }
}
