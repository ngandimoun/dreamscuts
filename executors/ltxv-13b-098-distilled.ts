import { fal } from '@fal-ai/client';

// Resolution options
export type LtxvResolutionEnum = '480p' | '720p';

// Aspect ratio options
export type LtxvAspectRatioEnum = '9:16' | '1:1' | '16:9';

// LoRA weight interface
export interface LtxvLoRAWeight {
  path: string;
  weight_name?: string;
  scale?: number;
}

// Input schema for LTX Video 13B 0.98 Distilled
export interface Ltxv13b098DistilledInput {
  prompt: string;
  negative_prompt?: string;
  loras?: LtxvLoRAWeight[];
  resolution?: LtxvResolutionEnum;
  aspect_ratio?: LtxvAspectRatioEnum;
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
}

// Output schema for LTX Video 13B 0.98 Distilled
export interface Ltxv13b098DistilledOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  prompt: string;
  seed: number;
}

// Error types
export interface Ltxv13b098DistilledError {
  error: string;
  details?: string;
}

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/ltxv-13b-098-distilled';

export class Ltxv13b098DistilledExecutor {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = MODEL_ENDPOINT;
  }

  /**
   * Generate video from prompt using LTX Video 13B 0.98 Distilled
   */
  async generateVideo(input: Ltxv13b098DistilledInput): Promise<Ltxv13b098DistilledOutput> {
    try {
      // Validate required inputs
      if (!input.prompt) {
        throw new Error('Missing required input: prompt is required');
      }

      if (input.prompt.length > 2000) {
        throw new Error('Prompt must be 2000 characters or less');
      }

      // Set defaults
      const requestInput = {
        prompt: input.prompt,
        negative_prompt: input.negative_prompt || 'worst quality, inconsistent motion, blurry, jittery, distorted',
        loras: input.loras || [],
        resolution: input.resolution || '720p',
        aspect_ratio: input.aspect_ratio || '16:9',
        seed: input.seed || Math.floor(Math.random() * 1000000),
        num_frames: input.num_frames || 121,
        first_pass_num_inference_steps: input.first_pass_num_inference_steps || 8,
        second_pass_num_inference_steps: input.second_pass_num_inference_steps || 8,
        second_pass_skip_initial_steps: input.second_pass_skip_initial_steps || 5,
        frame_rate: input.frame_rate || 24,
        expand_prompt: input.expand_prompt || false,
        reverse_video: input.reverse_video || false,
        enable_safety_checker: input.enable_safety_checker !== false, // Default to true
        enable_detail_pass: input.enable_detail_pass || false,
        temporal_adain_factor: input.temporal_adain_factor || 0.5,
        tone_map_compression_ratio: input.tone_map_compression_ratio || 0
      };

      // Calculate cost
      const baseCost = this.calculateCost(requestInput.num_frames, requestInput.frame_rate, requestInput.enable_detail_pass);
      console.log(`Estimated cost: $${baseCost.totalCost.toFixed(4)}`);
      console.log(`Duration: ${baseCost.duration} seconds`);
      console.log(`Resolution: ${requestInput.resolution}`);
      console.log(`Detail pass: ${requestInput.enable_detail_pass ? 'Enabled (2x cost)' : 'Disabled'}`);

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

      return result.data as Ltxv13b098DistilledOutput;
    } catch (error) {
      console.error('Error generating video:', error);
      throw {
        error: 'Failed to generate video',
        details: error instanceof Error ? error.message : String(error)
      } as Ltxv13b098DistilledError;
    }
  }

  /**
   * Submit video generation to queue for long-running requests
   */
  async submitToQueue(input: Ltxv13b098DistilledInput, webhookUrl?: string): Promise<{ request_id: string }> {
    try {
      // Validate required inputs
      if (!input.prompt) {
        throw new Error('Missing required input: prompt is required');
      }

      if (input.prompt.length > 2000) {
        throw new Error('Prompt must be 2000 characters or less');
      }

      // Set defaults
      const requestInput = {
        prompt: input.prompt,
        negative_prompt: input.negative_prompt || 'worst quality, inconsistent motion, blurry, jittery, distorted',
        loras: input.loras || [],
        resolution: input.resolution || '720p',
        aspect_ratio: input.aspect_ratio || '16:9',
        seed: input.seed || Math.floor(Math.random() * 1000000),
        num_frames: input.num_frames || 121,
        first_pass_num_inference_steps: input.first_pass_num_inference_steps || 8,
        second_pass_num_inference_steps: input.second_pass_num_inference_steps || 8,
        second_pass_skip_initial_steps: input.second_pass_skip_initial_steps || 5,
        frame_rate: input.frame_rate || 24,
        expand_prompt: input.expand_prompt || false,
        reverse_video: input.reverse_video || false,
        enable_safety_checker: input.enable_safety_checker !== false, // Default to true
        enable_detail_pass: input.enable_detail_pass || false,
        temporal_adain_factor: input.temporal_adain_factor || 0.5,
        tone_map_compression_ratio: input.tone_map_compression_ratio || 0
      };

      // Calculate cost
      const baseCost = this.calculateCost(requestInput.num_frames, requestInput.frame_rate, requestInput.enable_detail_pass);
      console.log(`Estimated cost: $${baseCost.totalCost.toFixed(4)}`);
      console.log(`Duration: ${baseCost.duration} seconds`);
      console.log(`Resolution: ${requestInput.resolution}`);
      console.log(`Detail pass: ${requestInput.enable_detail_pass ? 'Enabled (2x cost)' : 'Disabled'}`);

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
      } as Ltxv13b098DistilledError;
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
      } as Ltxv13b098DistilledError;
    }
  }

  /**
   * Get queue result
   */
  async getQueueResult(requestId: string): Promise<Ltxv13b098DistilledOutput> {
    try {
      const result = await fal.queue.result(this.modelEndpoint, {
        requestId,
      });
      return result.data as Ltxv13b098DistilledOutput;
    } catch (error) {
      console.error('Error getting queue result:', error);
      throw {
        error: 'Failed to get queue result',
        details: error instanceof Error ? error.message : String(error)
      } as Ltxv13b098DistilledError;
    }
  }

  /**
   * Calculate estimated cost for video generation
   */
  calculateCost(numFrames: number, frameRate: number, enableDetailPass: boolean): {
    baseCost: number;
    currency: string;
    duration: string;
    totalCost: number;
    detailPassMultiplier: number;
  } {
    // Base cost: $0.02 per second, billed at 24fps
    const baseFrameRate = 24;
    const durationSeconds = numFrames / frameRate;
    const billedSeconds = (numFrames / baseFrameRate);
    const baseCost = billedSeconds * 0.02;
    
    // Detail pass doubles the cost
    const detailPassMultiplier = enableDetailPass ? 2.0 : 1.0;
    const totalCost = baseCost * detailPassMultiplier;
    
    return {
      baseCost,
      currency: 'USD',
      duration: `${durationSeconds.toFixed(2)} seconds`,
      totalCost,
      detailPassMultiplier
    };
  }

  /**
   * Get available resolutions with descriptions
   */
  getAvailableResolutions(): Array<{ value: LtxvResolutionEnum; description: string; costMultiplier: number }> {
    return [
      { value: '480p', description: 'Standard definition (cost-effective)', costMultiplier: 1.0 },
      { value: '720p', description: 'High definition (default)', costMultiplier: 1.0 }
    ];
  }

  /**
   * Get available aspect ratios with descriptions
   */
  getAvailableAspectRatios(): Array<{ value: LtxvAspectRatioEnum; description: string; useCase: string }> {
    return [
      { value: '16:9', description: 'Widescreen landscape format (default)', useCase: 'Traditional video content, YouTube, TV' },
      { value: '9:16', description: 'Portrait format for mobile devices', useCase: 'TikTok, Instagram Stories, mobile viewing' },
      { value: '1:1', description: 'Square format for social media', useCase: 'Instagram posts, Facebook, LinkedIn' }
    ];
  }

  /**
   * Get frame count recommendations
   */
  getFrameCountRecommendations(): Array<{ frames: number; duration: string; useCase: string; cost: string }> {
    return [
      { frames: 60, duration: '2.5 seconds', useCase: 'Short clips, social media', cost: '$0.05' },
      { frames: 121, duration: '5 seconds', useCase: 'Standard videos (default)', cost: '$0.10' },
      { frames: 240, duration: '10 seconds', useCase: 'Medium-length content', cost: '$0.20' },
      { frames: 480, duration: '20 seconds', useCase: 'Long-form content', cost: '$0.40' },
      { frames: 720, duration: '30 seconds', useCase: 'Extended content', cost: '$0.60' }
    ];
  }

  /**
   * Get inference step recommendations
   */
  getInferenceStepRecommendations(): Array<{ firstPass: number; secondPass: number; quality: string; speed: string; useCase: string }> {
    return [
      { firstPass: 4, secondPass: 4, quality: 'Fast', speed: 'Quick generation', useCase: 'Rapid prototyping, testing' },
      { firstPass: 8, secondPass: 8, quality: 'Standard (default)', speed: 'Balanced', useCase: 'Most use cases' },
      { firstPass: 12, secondPass: 12, quality: 'High', speed: 'Slower generation', useCase: 'Quality-focused content' },
      { firstPass: 16, secondPass: 16, quality: 'Premium', speed: 'Slowest generation', useCase: 'Professional content, final versions' }
    ];
  }

  /**
   * Get LoRA usage recommendations
   */
  getLoRAUsageRecommendations(): Array<{ useCase: string; description: string; examples: string[] }> {
    return [
      { 
        useCase: 'Style Transfer', 
        description: 'Apply specific artistic styles to videos',
        examples: ['anime', 'oil painting', 'watercolor', 'sketch']
      },
      { 
        useCase: 'Character Consistency', 
        description: 'Maintain consistent character appearances',
        examples: ['specific character models', 'personality traits']
      },
      { 
        useCase: 'Environmental Effects', 
        description: 'Add atmospheric and environmental effects',
        examples: ['fog', 'rain', 'sunset', 'night']
      },
      { 
        useCase: 'Motion Enhancement', 
        description: 'Improve specific types of movement',
        examples: ['dancing', 'walking', 'running', 'flying']
      }
    ];
  }

  /**
   * Get prompt optimization tips
   */
  getPromptOptimizationTips(): Array<string> {
    return [
      'Keep prompts under 2000 characters for optimal processing',
      'Be specific about camera movements and angles',
      'Describe lighting, atmosphere, and mood clearly',
      'Mention visual style and artistic direction',
      'Include details about subjects, actions, and scenes',
      'Use cinematic terminology for better results',
      'Specify time of day and weather conditions',
      'Mention desired video quality and resolution'
    ];
  }

  /**
   * Get detail pass recommendations
   */
  getDetailPassRecommendations(): Array<{ enabled: boolean; useCase: string; description: string; costImpact: string }> {
    return [
      { 
        enabled: false, 
        useCase: 'Rapid prototyping', 
        description: 'Fast generation for testing concepts',
        costImpact: 'Standard cost ($0.02/second)'
      },
      { 
        enabled: true, 
        useCase: 'Final content', 
        description: 'Enhanced detail and quality for production',
        costImpact: 'Double cost ($0.04/second)'
      }
    ];
  }

  /**
   * Get temporal AdaIN factor recommendations
   */
  getTemporalAdaINRecommendations(): Array<{ value: number; description: string; useCase: string }> {
    return [
      { value: 0.0, description: 'No color normalization', useCase: 'Allow maximum color variation' },
      { value: 0.3, description: 'Light color consistency', useCase: 'Subtle color stabilization' },
      { value: 0.5, description: 'Balanced consistency (default)', useCase: 'Most use cases' },
      { value: 0.7, description: 'Strong color consistency', useCase: 'Professional content requiring consistency' },
      { value: 1.0, description: 'Maximum color consistency', useCase: 'Strict brand color requirements' }
    ];
  }

  /**
   * Get tone mapping recommendations
   */
  getToneMappingRecommendations(): Array<{ value: number; description: string; useCase: string }> {
    return [
      { value: 0.0, description: 'No compression (default)', useCase: 'Preserve full dynamic range' },
      { value: 0.3, description: 'Light compression', useCase: 'Subtle dynamic range reduction' },
      { value: 0.5, description: 'Moderate compression', useCase: 'Balanced dynamic range' },
      { value: 0.7, description: 'Strong compression', useCase: 'Reduced dynamic range for compatibility' },
      { value: 1.0, description: 'Maximum compression', useCase: 'Minimal dynamic range for broad compatibility' }
    ];
  }
}
