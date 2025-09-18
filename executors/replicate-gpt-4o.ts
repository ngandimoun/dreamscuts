/**
 * Replicate GPT-4o Executor
 * 
 * GPT-4o is OpenAI's flagship multimodal model, perfect for complex
 * script generation and creative tasks requiring high-quality output.
 * 
 * Model: openai/gpt-4o
 */

import Replicate from "replicate";

export interface GPT4oInput {
  prompt: string;
  system_prompt?: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop_sequences?: string[];
}

export interface GPT4oOutput {
  text: string;
  processing_time: number;
}

export interface GPT4oOptions {
  webhookUrl?: string;
  webhookEventsFilter?: string[];
  retries?: number;
}

/**
 * Execute GPT-4o model for high-quality script generation
 */
export async function executeGPT4o(
  input: GPT4oInput,
  options: GPT4oOptions = {}
): Promise<GPT4oOutput> {
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

    // Add optional inputs with defaults optimized for script generation
    if (input.system_prompt) {
      payload.system_prompt = input.system_prompt;
    }

    if (input.max_tokens !== undefined) {
      payload.max_tokens = input.max_tokens;
    } else {
      payload.max_tokens = 4000; // Higher default for script generation
    }

    if (input.temperature !== undefined) {
      payload.temperature = input.temperature;
    } else {
      payload.temperature = 0.7; // Higher temperature for creative output
    }

    if (input.top_p !== undefined) {
      payload.top_p = input.top_p;
    } else {
      payload.top_p = 0.9; // Good balance for creative output
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

    console.log(`[GPT-4o] Processing prompt (${input.prompt.length} chars) with max_tokens: ${payload.max_tokens}`);

    const startTime = Date.now();

    // Execute the model
    const output = await replicate.run(
      "openai/gpt-4o",
      {
        input: payload,
        webhook: options.webhookUrl,
        webhook_events_filter: options.webhookEventsFilter,
      }
    );

    const processingTime = Date.now() - startTime;

    // Process the output
    const responseText = Array.isArray(output) ? output.join("") : String(output);

    console.log(`[GPT-4o] Generated ${responseText.length} chars in ${processingTime}ms`);

    return {
      text: responseText.trim(),
      processing_time: processingTime
    };

  } catch (error) {
    console.error('[GPT-4o] Execution failed:', error);
    throw new Error(`GPT-4o execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute GPT-4o with prediction management for long-running tasks
 */
export async function executeGPT4oPrediction(
  input: GPT4oInput,
  options: GPT4oOptions = {}
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
      max_tokens: input.max_tokens || 4000,
      temperature: input.temperature || 0.7,
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
      model: "openai/gpt-4o",
      input: payload,
      webhook: options.webhookUrl,
      webhook_events_filter: options.webhookEventsFilter,
    });

    return prediction;

  } catch (error) {
    console.error('[GPT-4o] Prediction creation failed:', error);
    throw new Error(`GPT-4o prediction creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a GPT-4o prediction
 */
export async function checkGPT4oStatus(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    return await replicate.predictions.get(predictionId);
  } catch (error) {
    console.error('[GPT-4o] Status check failed:', error);
    throw new Error(`GPT-4o status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
