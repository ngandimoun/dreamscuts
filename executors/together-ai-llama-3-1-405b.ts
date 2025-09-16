/**
 * Together AI Llama 3.1 405B Instruct Executor
 * 
 * Meta's flagship Llama 3.1 405B model - the most capable open-source model.
 * Ideal for complex reasoning, analysis, and instruction following.
 * 
 * Together AI Model: meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo
 */

export interface TogetherAILlama31405BInput {
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
  repetition_penalty?: number;
}

export interface TogetherAILlama31405BOutput {
  text: string;
  finish_reason: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface TogetherAILlama31405BOptions {
  timeout?: number;
  retries?: number;
  onProgress?: (progress: any) => void;
}

/**
 * Execute Together AI Llama 3.1 405B Instruct model
 */
export async function executeTogetherAILlama31405B(
  input: TogetherAILlama31405BInput,
  options: TogetherAILlama31405BOptions = {}
): Promise<TogetherAILlama31405BOutput> {
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
      model: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo',
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

    console.log(`[TogetherAI-Llama31-405B] Making request with ${input.prompt.length} chars`);

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
      throw new Error(`Together AI Llama 3.1 405B API error: ${errorMessage}`);
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

    console.log(`[TogetherAI-Llama31-405B] Generated ${choice.text.length} chars`);

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
    console.error('[TogetherAI-Llama31-405B] Execution failed:', error);
    throw new Error(`Together AI Llama 3.1 405B execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create optimized prompts for Llama 3.1 405B
 */
export function createLlama31405BPrompt(
  systemPrompt: string,
  userPrompt: string,
  assistantStart?: string
): string {
  let prompt = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>

${systemPrompt}<|eot_id|><|start_header_id|>user<|end_header_id|>

${userPrompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>

`;

  if (assistantStart) {
    prompt += assistantStart;
  }

  return prompt;
}

/**
 * Predefined system prompts for different tasks
 */
export const LLAMA31_405B_SYSTEM_PROMPTS = {
  query_analysis: `You are an expert creative project analyzer. Your task is to analyze user queries and extract comprehensive information about their creative intent, constraints, and requirements. 

Be precise, thorough, and structured in your analysis. Focus on:
- Understanding the core intent (image, video, audio, mixed)
- Extracting all modifiers (style, mood, theme, emotions, etc.)
- Identifying explicit and implicit constraints
- Detecting gaps in the requirements
- Suggesting creative interpretations when appropriate

Always respond with valid JSON only, no additional text.`,

  instruction_following: `You are an expert instruction-following assistant. Analyze the given instructions carefully and provide detailed, actionable responses. Follow instructions precisely and ask for clarification if anything is ambiguous.`,

  reasoning: `You are an expert reasoning assistant. Break down complex problems into logical steps, analyze cause and effect relationships, and provide well-reasoned conclusions. Show your thinking process clearly.`,

  creative_analysis: `You are a creative analysis expert. Evaluate creative content, identify patterns, suggest improvements, and provide insights about artistic and creative elements. Consider aesthetics, emotional impact, and technical execution.`,

  text_processing: `You are a text processing expert. Handle tasks involving language analysis, content extraction, summarization, and text transformation. Maintain accuracy and preserve important nuances.`
} as const;

/**
 * Helper function to estimate cost for Llama 3.1 405B
 */
export function estimateLlama31405BCost(inputTokens: number, outputTokens: number): number {
  // Together AI pricing for Llama 3.1 405B (as of 2024)
  const inputCostPerMillion = 5.0;  // $5 per 1M input tokens
  const outputCostPerMillion = 15.0; // $15 per 1M output tokens
  
  const inputCost = (inputTokens / 1000000) * inputCostPerMillion;
  const outputCost = (outputTokens / 1000000) * outputCostPerMillion;
  
  return inputCost + outputCost;
}

/**
 * Get optimal settings for different use cases
 */
export function getLlama31405BOptimalSettings(useCase: 'analysis' | 'creative' | 'reasoning' | 'instruction'): {
  max_tokens: number;
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
} {
  const settings = {
    analysis: {
      max_tokens: 2000,
      temperature: 0.1,
      top_p: 0.9,
      frequency_penalty: 0,
      presence_penalty: 0
    },
    creative: {
      max_tokens: 2500,
      temperature: 0.7,
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1
    },
    reasoning: {
      max_tokens: 1500,
      temperature: 0.1,
      top_p: 0.8,
      frequency_penalty: 0,
      presence_penalty: 0
    },
    instruction: {
      max_tokens: 2000,
      temperature: 0.1,
      top_p: 0.9,
      frequency_penalty: 0,
      presence_penalty: 0
    }
  };

  return settings[useCase];
}

export default executeTogetherAILlama31405B;
