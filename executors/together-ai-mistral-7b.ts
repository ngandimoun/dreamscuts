/**
 * Together AI Mistral 7B Instruct Executor
 * 
 * Mistral AI's 7B model - fast and efficient for basic tasks.
 * Excellent for lightweight fallback scenarios and quick responses.
 * 
 * Together AI Model: mistralai/Mistral-7B-Instruct-v0.3
 */

export interface TogetherAIMistral7BInput {
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
  repetition_penalty?: number;
}

export interface TogetherAIMistral7BOutput {
  text: string;
  finish_reason: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface TogetherAIMistral7BOptions {
  timeout?: number;
  retries?: number;
  onProgress?: (progress: any) => void;
}

/**
 * Execute Together AI Mistral 7B Instruct model
 */
export async function executeTogetherAIMistral7B(
  input: TogetherAIMistral7BInput,
  options: TogetherAIMistral7BOptions = {}
): Promise<TogetherAIMistral7BOutput> {
  try {
    // Validate API key
    if (!process.env.TOGETHER_API_KEY) {
      throw new Error('TOGETHER_API_KEY environment variable is required');
    }

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

    // Prepare the request payload
    const payload = {
      model: 'mistralai/Mistral-7B-Instruct-v0.3',
      prompt: input.prompt.trim(),
      max_tokens: input.max_tokens || 1000,
      temperature: input.temperature || 0.1,
      top_p: input.top_p || 0.9,
      frequency_penalty: input.frequency_penalty || 0,
      presence_penalty: input.presence_penalty || 0,
      repetition_penalty: input.repetition_penalty || 1,
      stop: input.stop || [],
      stream: false
    };

    console.log(`[TogetherAI-Mistral-7B] Making request with ${input.prompt.length} chars`);

    // Make the API request
    const response = await fetch('https://api.together.xyz/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: options.timeout ? AbortSignal.timeout(options.timeout) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || errorData.message || `HTTP ${response.status} ${response.statusText}`;
      throw new Error(`Together AI Mistral 7B API error: ${errorMessage}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      throw new Error('Invalid response format: missing choices array');
    }

    const choice = data.choices[0];
    if (!choice.text) {
      throw new Error('Invalid response format: missing text in choice');
    }

    console.log(`[TogetherAI-Mistral-7B] Generated ${choice.text.length} chars`);

    return {
      text: choice.text.trim(),
      finish_reason: choice.finish_reason || 'unknown',
      usage: data.usage || {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      }
    };

  } catch (error) {
    console.error('[TogetherAI-Mistral-7B] Execution failed:', error);
    throw new Error(`Together AI Mistral 7B execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create optimized prompts for Mistral 7B
 */
export function createMistral7BPrompt(
  systemPrompt: string,
  userPrompt: string
): string {
  return `<s>[INST] ${systemPrompt}

${userPrompt} [/INST]`;
}

/**
 * Helper function to estimate cost for Mistral 7B
 */
export function estimateMistral7BCost(inputTokens: number, outputTokens: number): number {
  // Together AI pricing for Mistral 7B (as of 2024)
  const inputCostPerMillion = 0.2;   // $0.2 per 1M input tokens
  const outputCostPerMillion = 0.2;  // $0.2 per 1M output tokens
  
  const inputCost = (inputTokens / 1000000) * inputCostPerMillion;
  const outputCost = (outputTokens / 1000000) * outputCostPerMillion;
  
  return inputCost + outputCost;
}

export default executeTogetherAIMistral7B;
