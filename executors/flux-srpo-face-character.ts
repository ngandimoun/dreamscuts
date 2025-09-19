/**
 * FLUX.1 SRPO Face Character Executor
 * 
 * Specialized executor for generating ultra-realistic face characters using
 * FLUX.1 SRPO via Fal.ai. This model excels at creating consistent, high-quality
 * human faces and characters with incredible aesthetics.
 * 
 * Model: fal-ai/flux/srpo
 * Provider: Fal.ai
 * Specialization: Ultra-realistic face character generation
 * Strengths: Face consistency, character realism, high-quality aesthetics
 */

import { fal } from "@fal-ai/client";

export interface FluxSRPOFaceInput {
  prompt: string;
  imageSize?: 'square_hd' | 'square' | 'portrait_4_3' | 'portrait_16_9' | 'landscape_4_3' | 'landscape_16_9' | { width: number; height: number };
  numInferenceSteps?: number;
  seed?: number;
  guidanceScale?: number;
  numImages?: number;
  enableSafetyChecker?: boolean;
  outputFormat?: 'jpeg' | 'png';
  acceleration?: 'none' | 'regular' | 'high';
  syncMode?: boolean;
}

export interface FluxSRPOFaceOutput {
  success: boolean;
  result?: {
    images: Array<{
      url: string;
      width: number;
      height: number;
      content_type: string;
    }>;
    timings?: {
      inference: number;
      total: number;
    };
    seed: number;
    has_nsfw_concepts: boolean[];
    prompt: string;
  };
  metadata?: {
    cost: number;
    processingTime: number;
    model: string;
    provider: string;
    imageCount: number;
    totalPixels: number;
  };
  error?: string;
}

export interface FluxSRPOFaceOptions {
  timeout?: number;
  retries?: number;
  fallbackAcceleration?: 'none' | 'regular' | 'high';
}

/**
 * Generate ultra-realistic face character using FLUX.1 SRPO
 */
export async function generateFaceCharacter(
  input: FluxSRPOFaceInput,
  options: FluxSRPOFaceOptions = {}
): Promise<FluxSRPOFaceOutput> {
  const startTime = Date.now();
  
  try {
    // Validate input
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error('Prompt is required for face character generation');
    }
    
    if (input.prompt.length > 2000) {
      throw new Error('Prompt must be 2000 characters or less');
    }
    
    // Configure Fal.ai client
    if (!process.env.FAL_KEY) {
      throw new Error('FAL_KEY environment variable is required');
    }
    
    fal.config({
      credentials: process.env.FAL_KEY
    });
    
    // Prepare the request payload
    const payload = {
      prompt: input.prompt.trim(),
      image_size: input.imageSize || 'portrait_4_3',
      num_inference_steps: input.numInferenceSteps || 28,
      guidance_scale: input.guidanceScale || 4.5,
      num_images: input.numImages || 1,
      enable_safety_checker: input.enableSafetyChecker !== false,
      output_format: input.outputFormat || 'jpeg',
      acceleration: input.acceleration || 'none',
      sync_mode: input.syncMode || false,
      ...(input.seed && { seed: input.seed })
    };
    
    // Execute the model
    const result = await fal.subscribe("fal-ai/flux/srpo", {
      input: payload,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs?.map((log) => log.message).forEach(console.log);
        }
      },
    });
    
    const processingTime = Date.now() - startTime;
    const imageCount = result.data.images.length;
    const totalPixels = result.data.images.reduce((total, img) => total + (img.width * img.height), 0);
    const cost = calculateCost(totalPixels, input.acceleration || 'none');
    
    return {
      success: true,
      result: result.data,
      metadata: {
        cost,
        processingTime,
        model: 'fal-ai/flux/srpo',
        provider: 'Fal.ai',
        imageCount,
        totalPixels
      }
    };
    
  } catch (error) {
    console.error('FLUX.1 SRPO face character generation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Generate face character with streaming support
 */
export async function generateFaceCharacterStream(
  input: FluxSRPOFaceInput,
  options: FluxSRPOFaceOptions = {}
): Promise<FluxSRPOFaceOutput> {
  const startTime = Date.now();
  
  try {
    // Validate input
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error('Prompt is required for face character generation');
    }
    
    // Configure Fal.ai client
    if (!process.env.FAL_KEY) {
      throw new Error('FAL_KEY environment variable is required');
    }
    
    fal.config({
      credentials: process.env.FAL_KEY
    });
    
    // Prepare the request payload
    const payload = {
      prompt: input.prompt.trim(),
      image_size: input.imageSize || 'portrait_4_3',
      num_inference_steps: input.numInferenceSteps || 28,
      guidance_scale: input.guidanceScale || 4.5,
      num_images: input.numImages || 1,
      enable_safety_checker: input.enableSafetyChecker !== false,
      output_format: input.outputFormat || 'jpeg',
      acceleration: input.acceleration || 'none',
      ...(input.seed && { seed: input.seed })
    };
    
    // Execute with streaming
    const stream = await fal.stream("fal-ai/flux/srpo", {
      input: payload
    });
    
    // Process streaming events
    for await (const event of stream) {
      console.log('Streaming event:', event);
    }
    
    const result = await stream.done();
    const processingTime = Date.now() - startTime;
    const imageCount = result.data.images.length;
    const totalPixels = result.data.images.reduce((total, img) => total + (img.width * img.height), 0);
    const cost = calculateCost(totalPixels, input.acceleration || 'none');
    
    return {
      success: true,
      result: result.data,
      metadata: {
        cost,
        processingTime,
        model: 'fal-ai/flux/srpo',
        provider: 'Fal.ai',
        imageCount,
        totalPixels
      }
    };
    
  } catch (error) {
    console.error('FLUX.1 SRPO streaming face character generation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Create optimized prompt for face character generation
 */
export function createFaceCharacterPrompt(input: {
  characterType: 'portrait' | 'full-body' | 'headshot' | 'character-design';
  gender?: 'male' | 'female' | 'non-binary';
  age?: 'child' | 'teen' | 'young-adult' | 'adult' | 'elderly';
  ethnicity?: string;
  hairColor?: string;
  hairStyle?: string;
  eyeColor?: string;
  facialFeatures?: string[];
  expression?: string;
  clothing?: string;
  setting?: string;
  style?: 'realistic' | 'cinematic' | 'artistic' | 'photographic';
  lighting?: string;
  pose?: string;
  additionalDetails?: string;
}): string {
  let prompt = '';
  
  // Character type and basic description
  if (input.characterType === 'portrait') {
    prompt += 'Professional portrait of a ';
  } else if (input.characterType === 'full-body') {
    prompt += 'Full body shot of a ';
  } else if (input.characterType === 'headshot') {
    prompt += 'Headshot of a ';
  } else if (input.characterType === 'character-design') {
    prompt += 'Character design of a ';
  }
  
  // Age and gender
  if (input.age) {
    prompt += input.age + ' ';
  }
  if (input.gender) {
    prompt += input.gender + ' ';
  }
  
  // Ethnicity
  if (input.ethnicity) {
    prompt += input.ethnicity + ' ';
  }
  
  // Physical features
  if (input.hairColor && input.hairStyle) {
    prompt += `with ${input.hairColor} ${input.hairStyle} hair, `;
  } else if (input.hairColor) {
    prompt += `with ${input.hairColor} hair, `;
  } else if (input.hairStyle) {
    prompt += `with ${input.hairStyle} hair, `;
  }
  
  if (input.eyeColor) {
    prompt += `${input.eyeColor} eyes, `;
  }
  
  // Facial features
  if (input.facialFeatures && input.facialFeatures.length > 0) {
    prompt += input.facialFeatures.join(', ') + ', ';
  }
  
  // Expression
  if (input.expression) {
    prompt += `${input.expression} expression, `;
  }
  
  // Clothing
  if (input.clothing) {
    prompt += `wearing ${input.clothing}, `;
  }
  
  // Setting
  if (input.setting) {
    prompt += `in ${input.setting}, `;
  }
  
  // Style and quality
  if (input.style === 'realistic') {
    prompt += 'ultra-realistic, photorealistic, ';
  } else if (input.style === 'cinematic') {
    prompt += 'cinematic, movie-quality, ';
  } else if (input.style === 'artistic') {
    prompt += 'artistic, detailed, ';
  } else if (input.style === 'photographic') {
    prompt += 'photographic, professional photography, ';
  }
  
  // Lighting
  if (input.lighting) {
    prompt += `${input.lighting} lighting, `;
  }
  
  // Pose
  if (input.pose) {
    prompt += `${input.pose} pose, `;
  }
  
  // Additional details
  if (input.additionalDetails) {
    prompt += input.additionalDetails + ', ';
  }
  
  // Quality and technical specifications
  prompt += 'high resolution, detailed, sharp focus, professional quality, 8k, masterpiece';
  
  return prompt.trim().replace(/,\s*$/, '');
}

/**
 * Create character consistency prompt for multiple images
 */
export function createConsistencyPrompt(basePrompt: string, variation: string): string {
  return `${basePrompt}, ${variation}, consistent character, same person, maintaining facial features and identity`;
}

/**
 * Calculate cost based on pixels and acceleration
 */
function calculateCost(totalPixels: number, acceleration: string): number {
  const baseCostPerMegapixel = 0.025; // $0.025 per megapixel
  const megapixels = Math.ceil(totalPixels / 1000000); // Round up to nearest megapixel
  
  const accelerationMultiplier = {
    none: 1,
    regular: 1.2,
    high: 1.5
  };
  
  const cost = megapixels * baseCostPerMegapixel * accelerationMultiplier[acceleration as keyof typeof accelerationMultiplier];
  return Math.round(cost * 10000) / 10000; // Round to 4 decimal places
}

/**
 * Get model information
 */
export function getFluxSRPOInfo() {
  return {
    name: 'FLUX.1 SRPO',
    provider: 'Fal.ai',
    model: 'fal-ai/flux/srpo',
    description: '12 billion parameter flow transformer for ultra-realistic face character generation',
    capabilities: [
      'Ultra-realistic face generation',
      'Character consistency',
      'High-quality aesthetics',
      'Professional portraits',
      'Character design',
      'Photorealistic images'
    ],
    strengths: [
      'Excellent face consistency',
      'High-quality character generation',
      'Professional aesthetics',
      'Detailed facial features',
      'Realistic lighting and shadows',
      'Consistent character identity'
    ],
    pricing: {
      base: '$0.025 per megapixel',
      acceleration: {
        none: 'Base price',
        regular: '+20% for faster generation',
        high: '+50% for fastest generation'
      }
    },
    supportedSizes: [
      'square_hd',
      'square',
      'portrait_4_3',
      'portrait_16_9',
      'landscape_4_3',
      'landscape_16_9',
      'custom dimensions'
    ],
    maxPromptLength: 2000,
    defaultSettings: {
      numInferenceSteps: 28,
      guidanceScale: 4.5,
      numImages: 1,
      enableSafetyChecker: true,
      outputFormat: 'jpeg',
      acceleration: 'none'
    }
  };
}

export default {
  generateFaceCharacter,
  generateFaceCharacterStream,
  createFaceCharacterPrompt,
  createConsistencyPrompt,
  getFluxSRPOInfo
};
