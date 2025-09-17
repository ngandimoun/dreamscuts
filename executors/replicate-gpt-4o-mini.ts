/**
 * Replicate GPT-4o-mini Executor
 * 
 * GPT-4o-mini is OpenAI's most cost-effective model, perfect as a fallback
 * for the Refiner system when Claude 3 Haiku fails.
 * 
 * Model: openai/gpt-4o-mini
 */

import Replicate from "replicate";

export interface GPT4oMiniInput {
  prompt: string;
  system_prompt?: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop_sequences?: string[];
}

export interface GPT4oMiniOutput {
  text: string;
  processing_time: number;
}

export interface GPT4oMiniOptions {
  webhookUrl?: string;
  webhookEventsFilter?: string[];
  onProgress?: (progress: any) => void;
  retries?: number;
}

/**
 * Execute GPT-4o-mini model for JSON generation (fallback for Claude 3 Haiku)
 */
export async function executeGPT4oMini(
  input: GPT4oMiniInput,
  options: GPT4oMiniOptions = {}
): Promise<GPT4oMiniOutput> {
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
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error('Prompt is required');
    }

    // Validate parameter ranges
    if (input.max_tokens && (input.max_tokens < 1 || input.max_tokens > 4096)) {
      throw new Error('max_tokens must be between 1 and 4096');
    }

    if (input.temperature && (input.temperature < 0 || input.temperature > 2)) {
      throw new Error('temperature must be between 0 and 2');
    }

    if (input.top_p && (input.top_p < 0 || input.top_p > 1)) {
      throw new Error('top_p must be between 0 and 1');
    }

    if (input.frequency_penalty && (input.frequency_penalty < -2 || input.frequency_penalty > 2)) {
      throw new Error('frequency_penalty must be between -2 and 2');
    }

    if (input.presence_penalty && (input.presence_penalty < -2 || input.presence_penalty > 2)) {
      throw new Error('presence_penalty must be between -2 and 2');
    }

    // Prepare the request payload
    const payload: any = {
      prompt: input.prompt.trim(),
    };

    // Add optional inputs with defaults optimized for JSON generation
    if (input.system_prompt) {
      payload.system_prompt = input.system_prompt;
    }

    if (input.max_tokens !== undefined) {
      payload.max_tokens = input.max_tokens;
    } else {
      payload.max_tokens = 2048; // Default for JSON generation
    }

    if (input.temperature !== undefined) {
      payload.temperature = input.temperature;
    } else {
      payload.temperature = 0.1; // Low temperature for consistent JSON
    }

    if (input.top_p !== undefined) {
      payload.top_p = input.top_p;
    } else {
      payload.top_p = 0.9; // Good balance for structured output
    }

    if (input.frequency_penalty !== undefined) {
      payload.frequency_penalty = input.frequency_penalty;
    }

    if (input.presence_penalty !== undefined) {
      payload.presence_penalty = input.presence_penalty;
    }

    if (input.stop_sequences && input.stop_sequences.length > 0) {
      payload.stop_sequences = input.stop_sequences;
    }

    console.log(`[GPT-4o-mini] Processing prompt (${input.prompt.length} chars) with max_tokens: ${payload.max_tokens}`);

    const startTime = Date.now();

    // Execute the model
    const output = await replicate.run(
      "openai/gpt-4o-mini",
      {
        input: payload,
        webhook: options.webhookUrl,
        webhook_events_filter: options.webhookEventsFilter,
      }
    );

    const processingTime = Date.now() - startTime;

    // Process the output
    const responseText = Array.isArray(output) ? output.join("") : String(output);

    console.log(`[GPT-4o-mini] Generated ${responseText.length} chars in ${processingTime}ms`);

    return {
      text: responseText.trim(),
      processing_time: processingTime
    };

  } catch (error) {
    console.error('[GPT-4o-mini] Execution failed:', error);
    throw new Error(`GPT-4o-mini execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute GPT-4o-mini with prediction management for long-running tasks
 */
export async function executeGPT4oMiniPrediction(
  input: GPT4oMiniInput,
  options: GPT4oMiniOptions = {}
): Promise<any> {
  try {
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate input (same validation as above)
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error('Prompt is required');
    }

    if (input.max_tokens && (input.max_tokens < 1 || input.max_tokens > 4096)) {
      throw new Error('max_tokens must be between 1 and 4096');
    }

    if (input.temperature && (input.temperature < 0 || input.temperature > 2)) {
      throw new Error('temperature must be between 0 and 2');
    }

    if (input.top_p && (input.top_p < 0 || input.top_p > 1)) {
      throw new Error('top_p must be between 0 and 1');
    }

    if (input.frequency_penalty && (input.frequency_penalty < -2 || input.frequency_penalty > 2)) {
      throw new Error('frequency_penalty must be between -2 and 2');
    }

    if (input.presence_penalty && (input.presence_penalty < -2 || input.presence_penalty > 2)) {
      throw new Error('presence_penalty must be between -2 and 2');
    }

    // Prepare the request payload
    const payload: any = {
      prompt: input.prompt.trim(),
      max_tokens: input.max_tokens || 2048,
      temperature: input.temperature || 0.1,
      top_p: input.top_p || 0.9,
    };

    if (input.system_prompt) {
      payload.system_prompt = input.system_prompt;
    }

    if (input.frequency_penalty !== undefined) {
      payload.frequency_penalty = input.frequency_penalty;
    }

    if (input.presence_penalty !== undefined) {
      payload.presence_penalty = input.presence_penalty;
    }

    if (input.stop_sequences && input.stop_sequences.length > 0) {
      payload.stop_sequences = input.stop_sequences;
    }

    // Create prediction
    const prediction = await replicate.predictions.create({
      model: "openai/gpt-4o-mini",
      input: payload,
      webhook: options.webhookUrl,
      webhook_events_filter: options.webhookEventsFilter,
    });

    return prediction;

  } catch (error) {
    console.error('[GPT-4o-mini] Prediction creation failed:', error);
    throw new Error(`GPT-4o-mini prediction creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a GPT-4o-mini prediction
 */
export async function checkGPT4oMiniStatus(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.get(predictionId);
    return prediction;

  } catch (error) {
    console.error('[GPT-4o-mini] Status check failed:', error);
    throw new Error(`GPT-4o-mini status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Cancel a running GPT-4o-mini prediction
 */
export async function cancelGPT4oMiniPrediction(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.cancel(predictionId);
    return prediction;

  } catch (error) {
    console.error('[GPT-4o-mini] Prediction cancellation failed:', error);
    throw new Error(`GPT-4o-mini prediction cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create JSON-optimized prompts for GPT-4o-mini
 */
export function createJSONOptimizedPrompt(
  systemPrompt: string,
  userPrompt: string,
  jsonSchema?: string
): string {
  let prompt = systemPrompt;
  
  if (jsonSchema) {
    prompt += `\n\nJSON Schema to follow:\n${jsonSchema}`;
  }
  
  prompt += `\n\nUser Request:\n${userPrompt}`;
  prompt += `\n\nOutput ONLY valid JSON. No explanations, no markdown, no additional text.`;
  
  return prompt;
}

/**
 * Helper function to create refiner-specific prompts
 */
export function createRefinerPrompt(
  analyzerInput: any,
  systemPrompt: string
): string {
  return createJSONOptimizedPrompt(
    systemPrompt,
    `INPUT ANALYZER JSON:\n${JSON.stringify(analyzerInput, null, 2)}`,
    undefined // Schema is already in system prompt
  );
}

/**
 * Utility function to estimate processing cost for GPT-4o-mini
 */
export function estimateGPT4oMiniCost(
  inputTokens: number,
  outputTokens: number
): number {
  // GPT-4o-mini pricing (as of 2024)
  const inputCostPerMillion = 0.15; // $0.15 per million input tokens
  const outputCostPerMillion = 0.60; // $0.60 per million output tokens
  
  const inputCost = (inputTokens / 1000000) * inputCostPerMillion;
  const outputCost = (outputTokens / 1000000) * outputCostPerMillion;
  
  return inputCost + outputCost;
}

/**
 * Utility function to validate JSON output from GPT-4o-mini
 */
export function validateJSONOutput(text: string): {
  isValid: boolean;
  parsedJSON?: any;
  error?: string;
} {
  try {
    // Clean the text - remove any markdown formatting
    let cleanText = text.trim();
    
    // Remove markdown code blocks if present
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Try to parse as JSON
    const parsedJSON = JSON.parse(cleanText);
    
    return {
      isValid: true,
      parsedJSON
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown JSON parsing error'
    };
  }
}

/**
 * Utility function to get optimal settings for JSON generation
 */
export function getOptimalJSONSettings(): {
  max_tokens: number;
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  stop_sequences: string[];
} {
  return {
    max_tokens: 2048,
    temperature: 0.1, // Low temperature for consistent JSON
    top_p: 0.9,
    frequency_penalty: 0.0, // No frequency penalty for JSON
    presence_penalty: 0.0, // No presence penalty for JSON
    stop_sequences: ['```', '---', '===', '***'] // Stop sequences to prevent markdown
  };
}

/**
 * Example usage of the GPT-4o-mini executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic JSON generation
    const result1 = await executeGPT4oMini({
      prompt: 'Generate a JSON object with user information including name, email, and age.',
      system_prompt: 'You are a helpful assistant that generates valid JSON.',
      max_tokens: 512,
      temperature: 0.1
    });

    console.log('Basic JSON response:', result1.text);

    // Example 2: Refiner-style JSON upgrade
    const analyzerInput = {
      user_request: {
        original_prompt: "build a vid with these",
        intent: "image"
      },
      assets: [{
        id: "ast_ima01",
        type: "image",
        user_description: "use her as main character"
      }]
    };

    const refinerPrompt = createRefinerPrompt(
      analyzerInput,
      'You are a JSON refiner. Upgrade the input JSON to be more polished and confident.'
    );

    const result2 = await executeGPT4oMini({
      prompt: refinerPrompt,
      ...getOptimalJSONSettings()
    });

    console.log('Refiner JSON response:', result2.text);

    // Example 3: Using prediction for long-running tasks
    const prediction = await executeGPT4oMiniPrediction({
      prompt: 'Generate a comprehensive JSON schema for a complex application.',
      max_tokens: 3000
    });

    console.log('Prediction ID:', prediction.id);

    // Check status
    const status = await checkGPT4oMiniStatus(prediction.id);
    console.log('Prediction status:', status.status);

    // Get result when completed
    if (status.status === 'succeeded') {
      console.log('Prediction result:', status.output);
    }

  } catch (error) {
    console.error('Example execution failed:', error);
  }
}

/**
 * GPT-4o-mini capability descriptions
 */
export const GPT_4O_MINI_CAPABILITIES = {
  "cost_effective": "Most cost-effective GPT-4o model",
  "json_generation": "Good for structured JSON output",
  "instruction_following": "Strong instruction following capabilities",
  "context_length": "128k token context window",
  "multimodal": "Text-only model (no image input)",
  "safety": "Built-in safety features and content filtering",
  "speed": "Fast response times",
  "reliability": "High reliability and availability"
} as const;

/**
 * Performance benchmarks
 */
export const GPT_4O_MINI_BENCHMARKS = {
  "cost": "Lowest cost per token among GPT-4o models",
  "json_accuracy": "Good accuracy for structured output",
  "instruction_following": "Strong performance on instruction following tasks",
  "speed": "Fast response times"
} as const;

/**
 * Pricing information
 */
export const GPT_4O_MINI_PRICING = {
  "input_cost_per_million": 0.15,
  "output_cost_per_million": 0.60,
  "currency": "USD",
  "billing_unit": "per token"
} as const;

/**
 * GPT-4o-mini tips
 */
export const GPT_4O_MINI_TIPS = {
  "json_generation": "Use low temperature (0.1) for consistent JSON output",
  "prompt_clarity": "Use clear, specific prompts for best results",
  "system_prompts": "Use system prompts to guide model behavior",
  "token_management": "Set appropriate max_tokens based on expected response length",
  "cost_optimization": "Most cost-effective for simple, fast tasks",
  "stop_sequences": "Use stop sequences to prevent unwanted formatting",
  "fallback_usage": "Excellent as a fallback when primary models fail"
} as const;

export default executeGPT4oMini;
