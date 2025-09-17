/**
 * Replicate Claude 3 Haiku Executor
 * 
 * Claude 3 Haiku is the fastest and most cost-effective model in the Claude 3 family.
 * Perfect for the Refiner system that needs fast, structured JSON output.
 * 
 * Model: anthropic/claude-3-haiku
 */

import Replicate from "replicate";

export interface Claude3HaikuInput {
  prompt: string;
  system_prompt?: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  stop_sequences?: string[];
}

export interface Claude3HaikuOutput {
  text: string;
  processing_time: number;
}

export interface Claude3HaikuOptions {
  webhookUrl?: string;
  webhookEventsFilter?: string[];
  onProgress?: (progress: any) => void;
  retries?: number;
}

/**
 * Execute Claude 3 Haiku model for fast, structured JSON generation
 */
export async function executeClaude3Haiku(
  input: Claude3HaikuInput,
  options: Claude3HaikuOptions = {}
): Promise<Claude3HaikuOutput> {
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

    if (input.temperature && (input.temperature < 0 || input.temperature > 1)) {
      throw new Error('temperature must be between 0 and 1');
    }

    if (input.top_p && (input.top_p < 0 || input.top_p > 1)) {
      throw new Error('top_p must be between 0 and 1');
    }

    if (input.top_k && (input.top_k < 1 || input.top_k > 100)) {
      throw new Error('top_k must be between 1 and 100');
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

    if (input.top_k !== undefined) {
      payload.top_k = input.top_k;
    }

    if (input.stop_sequences && input.stop_sequences.length > 0) {
      payload.stop_sequences = input.stop_sequences;
    }

    console.log(`[Claude-3.5-Haiku] Processing prompt (${input.prompt.length} chars) with max_tokens: ${payload.max_tokens}`);

    const startTime = Date.now();

    // Execute the model
    const output = await replicate.run(
      "anthropic/claude-3-5-haiku",
      {
        input: payload,
        webhook: options.webhookUrl,
        webhook_events_filter: options.webhookEventsFilter,
      }
    );

    const processingTime = Date.now() - startTime;

    // Process the output
    const responseText = Array.isArray(output) ? output.join("") : String(output);

    console.log(`[Claude-3.5-Haiku] Generated ${responseText.length} chars in ${processingTime}ms`);

    return {
      text: responseText.trim(),
      processing_time: processingTime
    };

  } catch (error) {
    console.error('[Claude-3.5-Haiku] Execution failed:', error);
    throw new Error(`Claude 3.5 Haiku execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Claude 3.5 Haiku with prediction management for long-running tasks
 */
export async function executeClaude3HaikuPrediction(
  input: Claude3HaikuInput,
  options: Claude3HaikuOptions = {}
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

    if (input.temperature && (input.temperature < 0 || input.temperature > 1)) {
      throw new Error('temperature must be between 0 and 1');
    }

    if (input.top_p && (input.top_p < 0 || input.top_p > 1)) {
      throw new Error('top_p must be between 0 and 1');
    }

    if (input.top_k && (input.top_k < 1 || input.top_k > 100)) {
      throw new Error('top_k must be between 1 and 100');
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

    if (input.top_k !== undefined) {
      payload.top_k = input.top_k;
    }

    if (input.stop_sequences && input.stop_sequences.length > 0) {
      payload.stop_sequences = input.stop_sequences;
    }

    // Create prediction
    const prediction = await replicate.predictions.create({
      model: "anthropic/claude-3-haiku",
      input: payload,
      webhook: options.webhookUrl,
      webhook_events_filter: options.webhookEventsFilter,
    });

    return prediction;

  } catch (error) {
    console.error('[Claude-3-Haiku] Prediction creation failed:', error);
    throw new Error(`Claude 3 Haiku prediction creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a Claude 3 Haiku prediction
 */
export async function checkClaude3HaikuStatus(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.get(predictionId);
    return prediction;

  } catch (error) {
    console.error('[Claude-3-Haiku] Status check failed:', error);
    throw new Error(`Claude 3 Haiku status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Cancel a running Claude 3 Haiku prediction
 */
export async function cancelClaude3HaikuPrediction(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.cancel(predictionId);
    return prediction;

  } catch (error) {
    console.error('[Claude-3-Haiku] Prediction cancellation failed:', error);
    throw new Error(`Claude 3 Haiku prediction cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create JSON-optimized prompts for Claude 3 Haiku
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
 * Utility function to estimate processing cost for Claude 3 Haiku
 */
export function estimateClaude3HaikuCost(
  inputTokens: number,
  outputTokens: number
): number {
  // Claude 3 Haiku pricing (as of 2024)
  const inputCostPerMillion = 0.25; // $0.25 per million input tokens
  const outputCostPerMillion = 1.25; // $1.25 per million output tokens
  
  const inputCost = (inputTokens / 1000000) * inputCostPerMillion;
  const outputCost = (outputTokens / 1000000) * outputCostPerMillion;
  
  return inputCost + outputCost;
}

/**
 * Utility function to validate JSON output from Claude 3 Haiku
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
  top_k: number;
  stop_sequences: string[];
} {
  return {
    max_tokens: 2048,
    temperature: 0.1, // Low temperature for consistent JSON
    top_p: 0.9,
    top_k: 40,
    stop_sequences: ['```', '---', '===', '***'] // Stop sequences to prevent markdown
  };
}

/**
 * Example usage of the Claude 3 Haiku executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic JSON generation
    const result1 = await executeClaude3Haiku({
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

    const result2 = await executeClaude3Haiku({
      prompt: refinerPrompt,
      ...getOptimalJSONSettings()
    });

    console.log('Refiner JSON response:', result2.text);

    // Example 3: Using prediction for long-running tasks
    const prediction = await executeClaude3HaikuPrediction({
      prompt: 'Generate a comprehensive JSON schema for a complex application.',
      max_tokens: 3000
    });

    console.log('Prediction ID:', prediction.id);

    // Check status
    const status = await checkClaude3HaikuStatus(prediction.id);
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
 * Claude 3 Haiku capability descriptions
 */
export const CLAUDE_3_HAIKU_CAPABILITIES = {
  "speed": "Fastest model in the Claude 3 family",
  "cost_effective": "Most cost-effective option for simple tasks",
  "json_generation": "Excellent for structured JSON output",
  "instruction_following": "Good instruction following capabilities",
  "context_length": "200k token context window",
  "multimodal": "Text-only model (no image input)",
  "safety": "Built-in safety features and content filtering"
} as const;

/**
 * Performance benchmarks
 */
export const CLAUDE_3_HAIKU_BENCHMARKS = {
  "speed": "Fastest response times in Claude 3 family",
  "cost": "Lowest cost per token",
  "json_accuracy": "High accuracy for structured output",
  "instruction_following": "Good performance on instruction following tasks"
} as const;

/**
 * Pricing information
 */
export const CLAUDE_3_HAIKU_PRICING = {
  "input_cost_per_million": 0.25,
  "output_cost_per_million": 1.25,
  "currency": "USD",
  "billing_unit": "per token"
} as const;

/**
 * Claude 3 Haiku tips
 */
export const CLAUDE_3_HAIKU_TIPS = {
  "json_generation": "Use low temperature (0.1) for consistent JSON output",
  "prompt_clarity": "Use clear, specific prompts for best results",
  "system_prompts": "Use system prompts to guide model behavior",
  "token_management": "Set appropriate max_tokens based on expected response length",
  "cost_optimization": "Most cost-effective for simple, fast tasks",
  "stop_sequences": "Use stop sequences to prevent unwanted formatting"
} as const;

export default executeClaude3Haiku;
