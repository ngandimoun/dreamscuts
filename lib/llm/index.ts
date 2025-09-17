/**
 * Unified LLM Wrapper
 * 
 * Bulletproof wrapper for Claude 3 Haiku and GPT-4o-mini calls
 * with automatic fallback and error handling.
 */

import { executeClaude3Haiku } from '../../executors/replicate-claude-3-haiku';
import { executeGPT4oMini } from '../../executors/replicate-gpt-4o-mini';

export interface LLMOptions {
  model?: 'claude-3.5-haiku' | 'gpt-4o-mini' | 'auto';
  maxTokens?: number;
  temperature?: number;
  useFallback?: boolean;
  timeoutMs?: number;
  retries?: number;
}

export interface LLMResult {
  success: boolean;
  text: string;
  modelUsed: 'claude-3.5-haiku' | 'gpt-4o-mini';
  processingTimeMs: number;
  retryCount: number;
  error?: string;
}

/**
 * Unified LLM call function with automatic fallback
 */
export async function callLLM(
  prompt: string,
  options: LLMOptions = {}
): Promise<LLMResult> {
  const {
    model = 'auto',
    maxTokens = 2048,
    temperature = 0.1,
    useFallback = true,
    timeoutMs = 30000,
    retries = 2
  } = options;

  let retryCount = 0;
  const startTime = Date.now();

  // Try Claude 3 Haiku first (unless GPT is forced)
  if (model === 'auto' || model === 'claude-3-haiku') {
    try {
      const result = await executeClaude3Haiku({
        prompt,
        max_tokens: maxTokens,
        temperature,
        top_p: 0.9,
        top_k: 40,
        stop_sequences: ['```', '---', '===', '***']
      });

      return {
        success: true,
        text: result.text,
        modelUsed: 'claude-3.5-haiku',
        processingTimeMs: Date.now() - startTime,
        retryCount
      };
    } catch (error) {
      console.warn('Claude 3 Haiku failed:', error instanceof Error ? error.message : 'Unknown error');
      
      // If fallback is disabled or GPT is not forced, return error
      if (!useFallback && model !== 'gpt-4o-mini') {
        return {
          success: false,
          text: '',
          modelUsed: 'claude-3.5-haiku',
          processingTimeMs: Date.now() - startTime,
          retryCount,
          error: error instanceof Error ? error.message : 'Claude 3 Haiku failed'
        };
      }
    }
  }

  // Try GPT-4o-mini fallback
  if (model === 'auto' || model === 'gpt-4o-mini' || useFallback) {
    try {
      const result = await executeGPT4oMini({
        prompt,
        max_tokens: maxTokens,
        temperature,
        top_p: 0.9,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop_sequences: ['```', '---', '===', '***']
      });

      return {
        success: true,
        text: result.text,
        modelUsed: 'gpt-4o-mini',
        processingTimeMs: Date.now() - startTime,
        retryCount
      };
    } catch (error) {
      console.error('GPT-4o-mini also failed:', error instanceof Error ? error.message : 'Unknown error');
      
      return {
        success: false,
        text: '',
        modelUsed: 'gpt-4o-mini',
        processingTimeMs: Date.now() - startTime,
        retryCount,
        error: error instanceof Error ? error.message : 'Both models failed'
      };
    }
  }

  // This should never be reached, but just in case
  return {
    success: false,
    text: '',
    modelUsed: 'claude-3-haiku',
    processingTimeMs: Date.now() - startTime,
    retryCount,
    error: 'No valid model configuration'
  };
}

/**
 * Call LLM with retry logic
 */
export async function callLLMWithRetry(
  prompt: string,
  options: LLMOptions = {}
): Promise<LLMResult> {
  const maxRetries = options.retries || 2;
  let lastError: string | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await callLLM(prompt, {
      ...options,
      retries: 0 // Don't retry within the callLLM function
    });

    if (result.success) {
      return {
        ...result,
        retryCount: attempt
      };
    }

    lastError = result.error;
    
    if (attempt < maxRetries) {
      // Wait before retry (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return {
    success: false,
    text: '',
    modelUsed: 'claude-3-haiku',
    processingTimeMs: 0,
    retryCount: maxRetries,
    error: lastError || 'Max retries exceeded'
  };
}

/**
 * Validate JSON output from LLM
 */
export function validateLLMJSON(text: string): {
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
 * Estimate cost for LLM call
 */
export function estimateLLMCost(
  inputTokens: number,
  outputTokens: number,
  model: 'claude-3.5-haiku' | 'gpt-4o-mini'
): number {
  if (model === 'claude-3.5-haiku') {
    const inputCostPerMillion = 0.25;
    const outputCostPerMillion = 1.25;
    return (inputTokens / 1000000) * inputCostPerMillion + (outputTokens / 1000000) * outputCostPerMillion;
  } else {
    const inputCostPerMillion = 0.15;
    const outputCostPerMillion = 0.60;
    return (inputTokens / 1000000) * inputCostPerMillion + (outputTokens / 1000000) * outputCostPerMillion;
  }
}

/**
 * Health check for LLM services
 */
export async function llmHealthCheck(): Promise<{
  healthy: boolean;
  models: {
    claude3Haiku: boolean;
    gpt4oMini: boolean;
  };
  errors: string[];
}> {
  const errors: string[] = [];
  const models = {
    claude3Haiku: false,
    gpt4oMini: false
  };

  // Test Claude 3 Haiku
  try {
    const result = await callLLM('Generate a simple JSON object with a "test" field set to true.', {
      model: 'claude-3-haiku',
      maxTokens: 100,
      temperature: 0.1,
      useFallback: false
    });
    
    if (result.success) {
      models.claude3Haiku = true;
    }
  } catch (error) {
    errors.push(`Claude 3 Haiku health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Test GPT-4o-mini
  try {
    const result = await callLLM('Generate a simple JSON object with a "test" field set to true.', {
      model: 'gpt-4o-mini',
      maxTokens: 100,
      temperature: 0.1,
      useFallback: false
    });
    
    if (result.success) {
      models.gpt4oMini = true;
    }
  } catch (error) {
    errors.push(`GPT-4o-mini health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    healthy: models.claude3Haiku || models.gpt4oMini,
    models,
    errors
  };
}

export default callLLM;
