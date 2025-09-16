/**
 * Replicate LLaVA 13B Executor
 * 
 * LLaVA 13B model for image understanding and visual question answering.
 * Excellent for detailed image analysis and content description.
 * 
 * Model: yorickvp/llava-13b:a0fdc44e4f2e1f20f2bb4e27846899953ac8e66c5886c5878fa1d6b73ce009e5
 */

import Replicate from "replicate";

export interface ReplicateLLaVA13BInput {
  image: string; // URL or base64 encoded image
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
}

export interface ReplicateLLaVA13BOutput {
  text: string;
  processing_time?: number;
}

export interface ReplicateLLaVA13BOptions {
  timeout?: number;
  retries?: number;
  onProgress?: (progress: any) => void;
}

/**
 * Execute Replicate LLaVA 13B model for image analysis
 */
export async function executeReplicateLLaVA13B(
  input: ReplicateLLaVA13BInput,
  options: ReplicateLLaVA13BOptions = {}
): Promise<ReplicateLLaVA13BOutput> {
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

    if (input.top_p && (input.top_p < 0 || input.top_p > 1)) {
      throw new Error('top_p must be between 0 and 1');
    }

    // Prepare the request payload
    const payload = {
      image: input.image.trim(),
      prompt: input.prompt.trim(),
      max_tokens: input.max_tokens || 1024,
      temperature: input.temperature || 0.1,
      top_p: input.top_p || 0.9,
    };

    console.log(`[Replicate-LLaVA-13B] Analyzing image with prompt: "${input.prompt.substring(0, 100)}..."`);

    const startTime = Date.now();

    // Execute the model
    const output = await replicate.run(
      "yorickvp/llava-13b:a0fdc44e4f2e1f20f2bb4e27846899953ac8e66c5886c5878fa1d6b73ce009e5",
      {
        input: payload,
      }
    );

    const processingTime = Date.now() - startTime;

    // Process the output
    const responseText = Array.isArray(output) ? output.join("") : String(output);

    console.log(`[Replicate-LLaVA-13B] Generated ${responseText.length} chars in ${processingTime}ms`);

    return {
      text: responseText.trim(),
      processing_time: processingTime
    };

  } catch (error) {
    console.error('[Replicate-LLaVA-13B] Execution failed:', error);
    throw new Error(`Replicate LLaVA 13B execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create comprehensive image analysis prompts
 */
export function createImageAnalysisPrompt(analysisType: 'content' | 'metadata' | 'creative' | 'detailed'): string {
  const prompts = {
    content: `Analyze this image comprehensively. Describe:
1. Main subjects and objects present
2. Scene setting and environment
3. Colors, lighting, and mood
4. Visual style and composition
5. Any text or graphics visible
6. Overall quality and technical aspects

Provide a detailed, structured description.`,

    metadata: `Extract detailed information about this image:
1. Image composition and layout
2. Visual elements and their arrangement
3. Color palette and lighting conditions
4. Style and aesthetic qualities
5. Quality assessment
6. Potential use cases or applications

Focus on technical and descriptive details.`,

    creative: `Describe this image for creative project planning:
1. Visual mood and atmosphere
2. Style and aesthetic direction
3. Creative elements and inspiration
4. Potential for enhancement or editing
5. Suitability for different media types
6. Creative opportunities and suggestions

Think like a creative director analyzing reference material.`,

    detailed: `Provide an extremely detailed analysis of this image covering:
1. Subject matter: What is shown in the image?
2. Composition: How are elements arranged?
3. Technical quality: Resolution, clarity, lighting
4. Visual style: Aesthetic, mood, color scheme
5. Content suitability: What projects could use this?
6. Enhancement needs: What improvements might be needed?
7. Creative potential: How could this be used or adapted?

Be thorough and specific in your analysis.`
  };

  return prompts[analysisType];
}

/**
 * Helper function to estimate processing cost for LLaVA 13B
 */
export function estimateLLaVA13BCost(inputTokens: number, outputTokens: number): number {
  // Replicate pricing for LLaVA 13B (approximate)
  const costPerSecond = 0.000725; // $0.000725 per second
  const estimatedSeconds = Math.max(5, (inputTokens + outputTokens) / 100); // Rough estimate
  
  return estimatedSeconds * costPerSecond;
}

/**
 * Helper function to validate image URL or data
 */
export function validateImageInput(image: string): { isValid: boolean; error?: string } {
  if (!image || image.trim().length === 0) {
    return { isValid: false, error: 'Image input is required' };
  }

  // Check if it's a URL
  try {
    new URL(image);
    return { isValid: true };
  } catch {
    // Not a URL, check if it's base64
    if (image.startsWith('data:image/') || image.match(/^[A-Za-z0-9+/=]+$/)) {
      return { isValid: true };
    }
    
    return { isValid: false, error: 'Image must be a valid URL or base64 encoded data' };
  }
}

export default executeReplicateLLaVA13B;
