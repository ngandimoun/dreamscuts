/**
 * Unified LLM Wrapper
 * 
 * Bulletproof wrapper for GPT-4o, Claude 3 Haiku, and GPT-4o-mini calls
 * with automatic fallback and error handling.
 */

import { executeClaude3Haiku } from '../../executors/replicate-claude-3-haiku';
import { executeGPT5 } from '../../executors/gpt-5';
import { executeGPT4o } from '../../executors/replicate-gpt-4o';
import { executeGPT4oMini } from '../../executors/replicate-gpt-4o-mini';

export interface LLMOptions {
  model?: 'gpt-5' | 'gpt-4o' | 'claude-3.5-haiku' | 'gpt-4o-mini' | 'auto';
  maxTokens?: number;
  temperature?: number;
  useFallback?: boolean;
  timeoutMs?: number;
  retries?: number;
}

export interface LLMResult {
  success: boolean;
  text: string;
  modelUsed: 'gpt-5' | 'gpt-4o' | 'claude-3.5-haiku' | 'gpt-4o-mini';
  processingTimeMs: number;
  retryCount: number;
  error?: string;
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMCallOptions {
  model?: 'gpt-5' | 'gpt-4o' | 'claude-3.5-haiku' | 'gpt-4o-mini' | 'auto';
  messages?: LLMMessage[];
  prompt?: string;
  maxTokens?: number;
  temperature?: number;
  useFallback?: boolean;
  timeoutMs?: number;
  retries?: number;
}

/**
 * Unified LLM call function with automatic fallback (messages format)
 */
export async function callLLM(
  options: LLMCallOptions
): Promise<LLMResult> {
  const {
    model = 'gpt-5',
    messages,
    prompt,
    maxTokens = 4000,
    temperature = 0.7,
    useFallback = true,
    timeoutMs = 30000,
    retries = 2
  } = options;

  // Convert messages to prompt if needed
  let finalPrompt = prompt;
  if (messages && messages.length > 0) {
    finalPrompt = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n\n');
  }

  if (!finalPrompt) {
    return {
      success: false,
      text: '',
      modelUsed: 'gpt-5',
      processingTimeMs: 0,
      retryCount: 0,
      error: 'Either prompt or messages must be provided'
    };
  }

  let retryCount = 0;
  const startTime = Date.now();

  // Try GPT-5 first (primary model)
  if (model === 'gpt-5' || model === 'auto') {
    try {
      const result = await executeGPT5({
        prompt: finalPrompt,
        max_completion_tokens: maxTokens,
        reasoning_effort: 'medium',
        verbosity: 'medium'
      });

      return {
        success: true,
        text: result.text,
        modelUsed: 'gpt-5',
        processingTimeMs: Date.now() - startTime,
        retryCount
      };
    } catch (error) {
      console.warn('GPT-5 failed:', error instanceof Error ? error.message : 'Unknown error');
      
      // If fallback is disabled, return error
      if (!useFallback) {
        return {
          success: false,
          text: '',
          modelUsed: 'gpt-5',
          processingTimeMs: Date.now() - startTime,
          retryCount,
          error: error instanceof Error ? error.message : 'GPT-5 failed'
        };
      }
    }
  }

  // Try GPT-4o fallback
  if (model === 'gpt-4o' || (model === 'auto' && useFallback)) {
    try {
      const result = await executeGPT4o({
        prompt: finalPrompt,
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
        modelUsed: 'gpt-4o',
        processingTimeMs: Date.now() - startTime,
        retryCount
      };
    } catch (error) {
      console.warn('GPT-4o failed:', error instanceof Error ? error.message : 'Unknown error');
      
      // If fallback is disabled, return error
      if (!useFallback) {
        return {
          success: false,
          text: '',
          modelUsed: 'gpt-4o',
          processingTimeMs: Date.now() - startTime,
          retryCount,
          error: error instanceof Error ? error.message : 'GPT-4o failed'
        };
      }
    }
  }

  // Try Claude 3 Haiku fallback
  if (model === 'claude-3.5-haiku' || (model === 'auto' && useFallback)) {
    try {
      const result = await executeClaude3Haiku({
        prompt: finalPrompt,
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
    }
  }

  // Try GPT-4o-mini final fallback
  if (model === 'gpt-4o-mini' || (model === 'auto' && useFallback)) {
    try {
      const result = await executeGPT4oMini({
        prompt: finalPrompt,
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
        error: error instanceof Error ? error.message : 'All models failed'
      };
    }
  }

  // This should never be reached, but just in case
  return {
    success: false,
    text: '',
    modelUsed: 'gpt-4o',
    processingTimeMs: Date.now() - startTime,
    retryCount,
    error: 'No valid model configuration'
  };
}

/**
 * Legacy LLM call function with automatic fallback (prompt format)
 */
export async function callLLMLegacy(
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
  if (model === 'auto' || model === 'claude-3.5-haiku') {
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
      if (!useFallback && model !== 'auto') {
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
        modelUsed: 'claude-3.5-haiku',
    processingTimeMs: Date.now() - startTime,
    retryCount,
    error: 'No valid model configuration'
  };
}

/**
 * Call LLM with retry logic (messages format)
 */
export async function callLLMWithRetry(
  options: LLMCallOptions
): Promise<LLMResult> {
  const maxRetries = options.retries || 2;
  let lastError: string | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await callLLM({
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
        modelUsed: 'claude-3.5-haiku',
    processingTimeMs: 0,
    retryCount: maxRetries,
    error: lastError || 'Max retries exceeded'
  };
}

/**
 * Validate JSON output from LLM with enhanced error handling and repair
 */
export function validateLLMJSON(text: string): {
  isValid: boolean;
  parsedJSON?: any;
  error?: string;
  repaired?: boolean;
} {
  // Clean the text - remove any markdown formatting
  let cleanText = text.trim();
  
  console.log('🔍 [JSON Validation] Original text length:', text.length);
  console.log('🔍 [JSON Validation] Contains <json> tags:', cleanText.includes('<json>'));
  console.log('🔍 [JSON Validation] Contains </json> tags:', cleanText.includes('</json>'));
  
  // Remove JSON boundary tags if present
  if (cleanText.includes('<json>')) {
    console.log('🔍 [JSON Validation] Found <json> tag, attempting extraction');
    const jsonMatch = cleanText.match(/<json>([\s\S]*?)<\/json>/);
    console.log('🔍 [JSON Validation] JSON match found:', !!jsonMatch);
    console.log('🔍 [JSON Validation] Full text preview:', cleanText.substring(0, 500) + '...');
    
    if (jsonMatch && jsonMatch[1]) {
      cleanText = jsonMatch[1].trim();
      console.log('🔍 [JSON Validation] Extracted JSON length:', cleanText.length);
      console.log('🔍 [JSON Validation] Extracted JSON preview:', cleanText.substring(0, 100) + '...');
    } else {
      // Try to extract everything after <json> if no closing tag found
      const startIndex = cleanText.indexOf('<json>');
      if (startIndex !== -1) {
        cleanText = cleanText.substring(startIndex + 6).trim(); // Remove '<json>' (6 chars)
        console.log('🔍 [JSON Validation] Extracted JSON without closing tag, length:', cleanText.length);
        console.log('🔍 [JSON Validation] Extracted JSON preview:', cleanText.substring(0, 100) + '...');
      } else {
        console.log('🔍 [JSON Validation] JSON match failed, using original text');
      }
    }
  }
  
  // Remove markdown code blocks if present
  if (cleanText.startsWith('```json')) {
    cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    console.log('🔍 [JSON Validation] Removed markdown json blocks');
  } else if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    console.log('🔍 [JSON Validation] Removed markdown blocks');
  }
  
  try {
    // Try to parse as JSON
    const parsedJSON = JSON.parse(cleanText);
    console.log('🔍 [JSON Validation] JSON parsing successful');
    
    return {
      isValid: true,
      parsedJSON
    };
  } catch (error) {
    console.log('🔍 [JSON Validation] JSON parsing failed:', error instanceof Error ? error.message : 'Unknown error');
    console.log('🔍 [JSON Validation] Clean text preview:', cleanText.substring(0, 200) + '...');
    
    // Try to repair common JSON issues
    const repairResult = repairJSON(cleanText);
    if (repairResult.isValid) {
      console.log('🔍 [JSON Validation] JSON repair successful');
      return {
        isValid: true,
        parsedJSON: repairResult.parsedJSON,
        repaired: true
      };
    }
    
    console.log('🔍 [JSON Validation] JSON repair failed:', repairResult.error);
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown JSON parsing error'
    };
  }
}

/**
 * Repair common JSON issues in LLM output
 */
function repairJSON(text: string): {
  isValid: boolean;
  parsedJSON?: any;
  error?: string;
} {
  try {
    let repairedText = text;
    
    // Remove JSON boundary tags if present
    if (repairedText.includes('<json>') && repairedText.includes('</json>')) {
      const jsonMatch = repairedText.match(/<json>([\s\S]*?)<\/json>/);
      if (jsonMatch && jsonMatch[1]) {
        repairedText = jsonMatch[1].trim();
      }
    }
    
    // Fix common issues:
    // 1. Unterminated strings (add closing quote)
    repairedText = repairedText.replace(/"([^"]*?)(\s*)$/gm, '"$1"');
    
    // 2. Missing commas between objects
    repairedText = repairedText.replace(/}\s*{/g, '}, {');
    
    // 3. Missing commas between array elements
    repairedText = repairedText.replace(/]\s*\[/g, '], [');
    
    // 4. Trailing commas (remove them)
    repairedText = repairedText.replace(/,(\s*[}\]])/g, '$1');
    
    // 4.5. Fix incomplete object properties (like "intensity": "medium",\n)
    repairedText = repairedText.replace(/"([^"]+)":\s*"([^"]*)"\s*,\s*$/gm, '"$1": "$2"');
    
    // 5. Fix unescaped quotes in strings
    repairedText = repairedText.replace(/"([^"]*)"([^"]*)"([^"]*)"/g, '"$1\\"$2\\"$3"');
    
    // 6. Fix incomplete JSON (try to find the last complete object)
    const lastCompleteBrace = repairedText.lastIndexOf('}');
    if (lastCompleteBrace > 0) {
      repairedText = repairedText.substring(0, lastCompleteBrace + 1);
      console.log('🔍 [JSON Repair] Truncated to last complete object at position:', lastCompleteBrace);
    }
    
    // 7. Fix incomplete strings at the end
    if (repairedText.endsWith('"') === false && repairedText.includes('"')) {
      const lastQuoteIndex = repairedText.lastIndexOf('"');
      const afterLastQuote = repairedText.substring(lastQuoteIndex + 1);
      if (afterLastQuote.trim() && !afterLastQuote.includes('"')) {
        // There's text after the last quote without a closing quote
        repairedText = repairedText.substring(0, lastQuoteIndex + 1) + '"';
        console.log('🔍 [JSON Repair] Fixed unterminated string at end');
      }
    }
    
    // 8. Handle truncated JSON by finding the last complete field
    if (repairedText.includes('"') && !repairedText.endsWith('"') && !repairedText.endsWith('}')) {
      // Find the last complete field by looking for patterns like "field": "value",
      const fieldPattern = /"([^"]+)":\s*"([^"]*)"\s*,?\s*$/;
      const match = repairedText.match(fieldPattern);
      if (match) {
        // Remove the incomplete part and close the object
        const completePart = repairedText.substring(0, (match.index || 0) + match[0].length);
        repairedText = completePart.replace(/,\s*$/, '') + '}';
        console.log('🔍 [JSON Repair] Fixed truncated JSON by completing last field');
      } else {
        // Try to find the last complete object/array and close it
        const lastCompleteBrace = repairedText.lastIndexOf('}');
        const lastCompleteBracket = repairedText.lastIndexOf(']');
        const lastComplete = Math.max(lastCompleteBrace, lastCompleteBracket);
        
        if (lastComplete > 0) {
          repairedText = repairedText.substring(0, lastComplete + 1);
          console.log('🔍 [JSON Repair] Truncated to last complete structure at position:', lastComplete);
        } else {
          // If no complete structure found, try to close the current object
          const openBraces = (repairedText.match(/\{/g) || []).length;
          const closeBraces = (repairedText.match(/\}/g) || []).length;
          const openBrackets = (repairedText.match(/\[/g) || []).length;
          const closeBrackets = (repairedText.match(/\]/g) || []).length;
          
          // Add missing closing braces/brackets
          for (let i = 0; i < openBraces - closeBraces; i++) {
            repairedText += '}';
          }
          for (let i = 0; i < openBrackets - closeBrackets; i++) {
            repairedText += ']';
          }
          console.log('🔍 [JSON Repair] Added missing closing braces/brackets');
        }
      }
    }
    
    // 9. Handle specific case where JSON is truncated in middle of object property
    if (repairedText.includes('"') && !repairedText.endsWith('"') && !repairedText.endsWith('}') && !repairedText.endsWith(']')) {
      // Look for incomplete property like "intensity": "medium",
      const incompletePropertyPattern = /"([^"]+)":\s*"([^"]*)"\s*,\s*$/;
      const incompleteMatch = repairedText.match(incompletePropertyPattern);
      if (incompleteMatch) {
        // Remove the trailing comma and close the object
        repairedText = repairedText.replace(/,\s*$/, '') + '}';
        console.log('🔍 [JSON Repair] Fixed incomplete property by removing trailing comma');
      }
    }
    
    // Try to parse the repaired JSON
    const parsedJSON = JSON.parse(repairedText);
    
    return {
      isValid: true,
      parsedJSON
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'JSON repair failed'
    };
  }
}

/**
 * Estimate cost for LLM call
 */
export function estimateLLMCost(
  inputTokens: number,
  outputTokens: number,
  model: 'gpt-5' | 'gpt-4o' | 'claude-3.5-haiku' | 'gpt-4o-mini'
): number {
  if (model === 'gpt-5') {
    const inputCostPerMillion = 5.00;
    const outputCostPerMillion = 15.00;
    return (inputTokens / 1000000) * inputCostPerMillion + (outputTokens / 1000000) * outputCostPerMillion;
  } else if (model === 'gpt-4o') {
    const inputCostPerMillion = 2.50;
    const outputCostPerMillion = 10.00;
    return (inputTokens / 1000000) * inputCostPerMillion + (outputTokens / 1000000) * outputCostPerMillion;
  } else if (model === 'claude-3.5-haiku') {
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
    gpt5: boolean;
    gpt4o: boolean;
    claude3Haiku: boolean;
    gpt4oMini: boolean;
  };
  errors: string[];
}> {
  const errors: string[] = [];
  const models = {
    gpt5: false,
    gpt4o: false,
    claude3Haiku: false,
    gpt4oMini: false
  };

  // Test GPT-5
  try {
    const result = await callLLM({
      model: 'gpt-5',
      prompt: 'Generate a simple JSON object with a "test" field set to true.',
      maxTokens: 100,
      temperature: 0.1,
      useFallback: false
    });
    
    if (result.success) {
      models.gpt5 = true;
    }
  } catch (error) {
    errors.push(`GPT-5 health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Test GPT-4o
  try {
    const result = await callLLM({
      model: 'gpt-4o',
      prompt: 'Generate a simple JSON object with a "test" field set to true.',
      maxTokens: 100,
      temperature: 0.1,
      useFallback: false
    });
    
    if (result.success) {
      models.gpt4o = true;
    }
  } catch (error) {
    errors.push(`GPT-4o health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Test Claude 3 Haiku
  try {
    const result = await callLLMLegacy('Generate a simple JSON object with a "test" field set to true.', {
      model: 'claude-3.5-haiku',
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
    const result = await callLLMLegacy('Generate a simple JSON object with a "test" field set to true.', {
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
    healthy: models.gpt5 || models.gpt4o || models.claude3Haiku || models.gpt4oMini,
    models,
    errors
  };
}

export default callLLM;
