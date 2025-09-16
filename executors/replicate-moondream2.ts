/**
 * Replicate Moondream2 Executor
 * 
 * Moondream2 model for image understanding and visual question answering.
 * Compact but capable model for efficient image analysis.
 * 
 * Model: lucataco/moondream2:72ccb656353c348c1385df54b237eeb7bfa874bf11486cf0b9473e691b662d31
 */

import Replicate from "replicate";

export interface ReplicateMoondream2Input {
  image: string; // URL or base64 encoded image
  prompt: string;
  max_tokens?: number;
  temperature?: number;
}

export interface ReplicateMoondream2Output {
  text: string;
  processing_time?: number;
}

export interface ReplicateMoondream2Options {
  timeout?: number;
  retries?: number;
  onProgress?: (progress: any) => void;
}

/**
 * Execute Replicate Moondream2 model for image analysis
 */
export async function executeReplicateMoondream2(
  input: ReplicateMoondream2Input,
  options: ReplicateMoondream2Options = {}
): Promise<ReplicateMoondream2Output> {
  try {
    // Validate API token
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error('REPLICATE_API_TOKEN environment variable is required');
    }

    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate required inputs
    if (!input.image || input.image.trim().length === 0) {
      throw new Error('Image URL or data is required');
    }

    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error('Prompt is required');
    }

    // Validate parameter ranges
    if (input.max_tokens && (input.max_tokens < 1 || input.max_tokens > 2048)) {
      throw new Error('max_tokens must be between 1 and 2048');
    }

    if (input.temperature && (input.temperature < 0 || input.temperature > 1)) {
      throw new Error('temperature must be between 0 and 1');
    }

    // Prepare the request payload
    const payload = {
      image: input.image.trim(),
      prompt: input.prompt.trim(),
      max_tokens: input.max_tokens || 1024,
      temperature: input.temperature || 0.1,
    };

    console.log(`[Replicate-Moondream2] Analyzing image with prompt: "${input.prompt.substring(0, 100)}..."`);

    const startTime = Date.now();

    // Execute the model
    const output = await replicate.run(
      "lucataco/moondream2:72ccb656353c348c1385df54b237eeb7bfa874bf11486cf0b9473e691b662d31",
      {
        input: payload,
      }
    );

    const processingTime = Date.now() - startTime;

    // Process the output
    const responseText = Array.isArray(output) ? output.join("") : String(output);

    console.log(`[Replicate-Moondream2] Generated ${responseText.length} chars in ${processingTime}ms`);

    return {
      text: responseText.trim(),
      processing_time: processingTime
    };

  } catch (error) {
    console.error('[Replicate-Moondream2] Execution failed:', error);
    throw new Error(`Replicate Moondream2 execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create focused image analysis prompts for Moondream2
 */
export function createMoondream2Prompt(analysisType: 'quick' | 'detailed' | 'objects' | 'scene' | 'creative'): string {
  const prompts = {
    quick: 'Describe this image briefly and accurately, focusing on the main subjects and key visual elements.',

    detailed: 'Provide a comprehensive description of this image including objects, people, setting, colors, composition, and overall visual characteristics.',

    objects: 'Identify and list all objects, items, and elements visible in this image. Be specific and thorough.',

    scene: 'Describe the scene, setting, and environment shown in this image. Include details about the location, context, and atmosphere.',

    creative: 'Analyze this image from a creative perspective. Describe the visual style, mood, aesthetic qualities, and potential creative applications.'
  };

  return prompts[analysisType];
}

/**
 * Helper function to perform multi-aspect image analysis with Moondream2
 */
export async function comprehensiveImageAnalysisWithMoondream2(
  imageUrl: string,
  options: ReplicateMoondream2Options = {}
): Promise<{
  quickDescription: string;
  detailedAnalysis: string;
  objectList: string;
  sceneDescription: string;
  creativeAnalysis: string;
  totalProcessingTime: number;
}> {
  try {
    const startTime = Date.now();

    // Run multiple analysis prompts in parallel
    const [
      quickResult,
      detailedResult,
      objectsResult,
      sceneResult,
      creativeResult
    ] = await Promise.all([
      executeReplicateMoondream2({
        image: imageUrl,
        prompt: createMoondream2Prompt('quick'),
        max_tokens: 256
      }, options),

      executeReplicateMoondream2({
        image: imageUrl,
        prompt: createMoondream2Prompt('detailed'),
        max_tokens: 512
      }, options),

      executeReplicateMoondream2({
        image: imageUrl,
        prompt: createMoondream2Prompt('objects'),
        max_tokens: 384
      }, options),

      executeReplicateMoondream2({
        image: imageUrl,
        prompt: createMoondream2Prompt('scene'),
        max_tokens: 384
      }, options),

      executeReplicateMoondream2({
        image: imageUrl,
        prompt: createMoondream2Prompt('creative'),
        max_tokens: 384
      }, options),
    ]);

    const totalProcessingTime = Date.now() - startTime;

    return {
      quickDescription: quickResult.text,
      detailedAnalysis: detailedResult.text,
      objectList: objectsResult.text,
      sceneDescription: sceneResult.text,
      creativeAnalysis: creativeResult.text,
      totalProcessingTime
    };

  } catch (error) {
    console.error('[Moondream2-Comprehensive-Analysis] Failed:', error);
    throw new Error(`Moondream2 comprehensive analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to estimate processing cost for Moondream2
 */
export function estimateMoondream2Cost(numberOfRuns: number): number {
  // Replicate pricing for Moondream2 (approximate)
  const costPerRun = 0.001; // $0.001 per run (very efficient)
  
  return numberOfRuns * costPerRun;
}

/**
 * Predefined prompt templates for different use cases
 */
export const MOONDREAM2_PROMPTS = {
  general: 'Describe what you see in this image.',
  detailed: 'Provide a detailed description of this image including all visible elements, colors, composition, and context.',
  objects: 'List all objects and items you can identify in this image.',
  people: 'Describe any people in this image, including their appearance, actions, and context.',
  setting: 'Describe the setting, location, and environment shown in this image.',
  quality: 'Assess the technical quality and visual characteristics of this image.',
  mood: 'What mood or atmosphere does this image convey?',
  colors: 'Describe the color palette and color scheme of this image.',
  composition: 'Analyze the composition and visual arrangement of elements in this image.',
  style: 'What visual style or aesthetic does this image represent?'
} as const;

/**
 * Helper function for efficient batch processing with Moondream2
 */
export async function batchAnalyzeImagesWithMoondream2(
  images: Array<{ url: string; prompt?: string }>,
  options: ReplicateMoondream2Options = {}
): Promise<Array<{
  imageUrl: string;
  analysis: string;
  processingTime: number;
  success: boolean;
  error?: string;
}>> {
  const results = await Promise.allSettled(
    images.map(async (image) => {
      const prompt = image.prompt || MOONDREAM2_PROMPTS.detailed;
      
      try {
        const result = await executeReplicateMoondream2({
          image: image.url,
          prompt: prompt,
          max_tokens: 512
        }, options);

        return {
          imageUrl: image.url,
          analysis: result.text,
          processingTime: result.processing_time || 0,
          success: true
        };
      } catch (error) {
        return {
          imageUrl: image.url,
          analysis: '',
          processingTime: 0,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    })
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        imageUrl: images[index].url,
        analysis: '',
        processingTime: 0,
        success: false,
        error: result.reason?.message || 'Analysis failed'
      };
    }
  });
}

export default executeReplicateMoondream2;
