/**
 * Step 2a: Refiner Service
 * 
 * Main service that orchestrates the refiner process:
 * 1. Takes analyzer JSON input
 * 2. Uses Claude 3 Haiku (primary) or GPT-4o-mini (fallback)
 * 3. Validates output with Zod
 * 4. Returns polished JSON
 */

import { z } from 'zod';
import { 
  validateAnalyzerInput, 
  validateRefinerOutput, 
  AnalyzerInput, 
  RefinerOutput 
} from './refiner-schema';
import { createRefinerPrompt } from './refiner-prompt';
import { 
  executeClaude3Haiku, 
  validateJSONOutput as validateClaudeJSON,
  getOptimalJSONSettings as getClaudeSettings
} from '../../executors/replicate-claude-3-haiku';
import { 
  executeGPT4oMini, 
  validateJSONOutput as validateGPTJSON,
  getOptimalJSONSettings as getGPTSettings
} from '../../executors/replicate-gpt-4o-mini';

export interface RefinerServiceOptions {
  useFallback?: boolean;
  maxRetries?: number;
  timeoutMs?: number;
  enableLogging?: boolean;
}

export interface RefinerServiceResult {
  success: boolean;
  data?: RefinerOutput;
  error?: string;
  modelUsed?: 'claude-3-haiku' | 'gpt-4o-mini';
  processingTimeMs?: number;
  retryCount?: number;
}

/**
 * Main refiner service that upgrades analyzer JSON to polished JSON
 */
export async function refineAnalyzerJSON(
  analyzerInput: unknown,
  options: RefinerServiceOptions = {}
): Promise<RefinerServiceResult> {
  const startTime = Date.now();
  let retryCount = 0;
  const maxRetries = options.maxRetries || 2;
  const enableLogging = options.enableLogging !== false;

  try {
    if (enableLogging) {
      console.log('🔧 [Refiner] Starting JSON refinement process...');
    }

    // Step 1: Validate input
    if (enableLogging) {
      console.log('🔧 [Refiner] Validating analyzer input...');
    }
    
    const validatedInput = validateAnalyzerInput(analyzerInput);
    
    if (enableLogging) {
      console.log('🔧 [Refiner] Input validation successful');
      console.log(`🔧 [Refiner] Processing ${validatedInput.assets.length} assets`);
    }

    // Step 2: Create refiner prompt
    const { createRefinerPrompt } = await import('./refiner-prompt');
    const refinerPrompt = createRefinerPrompt(validatedInput);

    if (enableLogging) {
      console.log('🔧 [Refiner] Created refiner prompt');
    }

    // Step 3: Try Claude 3 Haiku first (unless fallback is forced)
    let result: RefinerServiceResult;
    
    if (!options.useFallback) {
      result = await tryClaude3Haiku(refinerPrompt, enableLogging);
      
      if (result.success) {
        const processingTime = Date.now() - startTime;
        return {
          ...result,
          processingTimeMs: processingTime,
          retryCount
        };
      }
      
      if (enableLogging) {
        console.log('🔧 [Refiner] Claude 3 Haiku failed, trying GPT-4o-mini fallback...');
      }
    }

    // Step 4: Try GPT-4o-mini fallback
    result = await tryGPT4oMini(refinerPrompt, enableLogging);
    
    if (result.success) {
      const processingTime = Date.now() - startTime;
      return {
        ...result,
        processingTimeMs: processingTime,
        retryCount
      };
    }

    // Step 5: If both fail, return error
    const processingTime = Date.now() - startTime;
    return {
      success: false,
      error: 'Both Claude 3 Haiku and GPT-4o-mini failed to generate valid JSON',
      processingTimeMs: processingTime,
      retryCount
    };

  } catch (error) {
    const processingTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (enableLogging) {
      console.error('🔧 [Refiner] Service failed:', errorMessage);
    }
    
    return {
      success: false,
      error: errorMessage,
      processingTimeMs: processingTime,
      retryCount
    };
  }
}

/**
 * Try Claude 3 Haiku for JSON refinement
 */
async function tryClaude3Haiku(
  refinerPrompt: string,
  enableLogging: boolean
): Promise<RefinerServiceResult> {
  try {
    if (enableLogging) {
      console.log('🔧 [Refiner] Attempting Claude 3 Haiku...');
    }

    const claudeSettings = getClaudeSettings();
    const claudeResult = await executeClaude3Haiku({
      prompt: refinerPrompt,
      ...claudeSettings
    });

    if (enableLogging) {
      console.log(`🔧 [Refiner] Claude 3 Haiku generated ${claudeResult.text.length} chars in ${claudeResult.processing_time}ms`);
    }

    // Validate JSON output
    const jsonValidation = validateClaudeJSON(claudeResult.text);
    
    if (!jsonValidation.isValid) {
      throw new Error(`Invalid JSON from Claude 3 Haiku: ${jsonValidation.error}`);
    }

    // Validate against refiner schema
    const refinerOutput = validateRefinerOutput(jsonValidation.parsedJSON);

    if (enableLogging) {
      console.log('🔧 [Refiner] Claude 3 Haiku validation successful');
    }

    return {
      success: true,
      data: refinerOutput,
      modelUsed: 'claude-3-haiku'
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown Claude 3 Haiku error';
    
    if (enableLogging) {
      console.error('🔧 [Refiner] Claude 3 Haiku failed:', errorMessage);
    }
    
    return {
      success: false,
      error: errorMessage,
      modelUsed: 'claude-3-haiku'
    };
  }
}

/**
 * Try GPT-4o-mini for JSON refinement (fallback)
 */
async function tryGPT4oMini(
  refinerPrompt: string,
  enableLogging: boolean
): Promise<RefinerServiceResult> {
  try {
    if (enableLogging) {
      console.log('🔧 [Refiner] Attempting GPT-4o-mini fallback...');
    }

    const gptSettings = getGPTSettings();
    const gptResult = await executeGPT4oMini({
      prompt: refinerPrompt,
      ...gptSettings
    });

    if (enableLogging) {
      console.log(`🔧 [Refiner] GPT-4o-mini generated ${gptResult.text.length} chars in ${gptResult.processing_time}ms`);
    }

    // Validate JSON output
    const jsonValidation = validateGPTJSON(gptResult.text);
    
    if (!jsonValidation.isValid) {
      throw new Error(`Invalid JSON from GPT-4o-mini: ${jsonValidation.error}`);
    }

    // Validate against refiner schema
    const refinerOutput = validateRefinerOutput(jsonValidation.parsedJSON);

    if (enableLogging) {
      console.log('🔧 [Refiner] GPT-4o-mini validation successful');
    }

    return {
      success: true,
      data: refinerOutput,
      modelUsed: 'gpt-4o-mini'
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown GPT-4o-mini error';
    
    if (enableLogging) {
      console.error('🔧 [Refiner] GPT-4o-mini failed:', errorMessage);
    }
    
    return {
      success: false,
      error: errorMessage,
      modelUsed: 'gpt-4o-mini'
    };
  }
}

/**
 * Batch refine multiple analyzer JSON inputs
 */
export async function batchRefineAnalyzerJSON(
  analyzerInputs: unknown[],
  options: RefinerServiceOptions = {}
): Promise<RefinerServiceResult[]> {
  const enableLogging = options.enableLogging !== false;
  
  if (enableLogging) {
    console.log(`🔧 [Refiner] Starting batch refinement of ${analyzerInputs.length} inputs...`);
  }

  const results = await Promise.allSettled(
    analyzerInputs.map((input, index) => {
      if (enableLogging) {
        console.log(`🔧 [Refiner] Processing batch item ${index + 1}/${analyzerInputs.length}`);
      }
      return refineAnalyzerJSON(input, options);
    })
  );

  const processedResults = results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        success: false,
        error: result.reason instanceof Error ? result.reason.message : 'Unknown batch error',
        retryCount: 0
      };
    }
  });

  if (enableLogging) {
    const successCount = processedResults.filter(r => r.success).length;
    console.log(`🔧 [Refiner] Batch refinement completed: ${successCount}/${analyzerInputs.length} successful`);
  }

  return processedResults;
}

/**
 * Utility function to estimate refiner processing cost
 */
export function estimateRefinerCost(
  analyzerInput: AnalyzerInput,
  modelUsed: 'claude-3-haiku' | 'gpt-4o-mini' = 'claude-3-haiku'
): number {
  // Estimate input tokens (rough approximation)
  const inputText = JSON.stringify(analyzerInput);
  const estimatedInputTokens = Math.ceil(inputText.length / 4); // Rough token estimation
  
  // Estimate output tokens (refiner JSON is typically 2-3x larger)
  const estimatedOutputTokens = estimatedInputTokens * 2.5;

  if (modelUsed === 'claude-3-haiku') {
    const { estimateClaude3HaikuCost } = require('../../executors/replicate-claude-3-haiku');
    return estimateClaude3HaikuCost(estimatedInputTokens, estimatedOutputTokens);
  } else {
    const { estimateGPT4oMiniCost } = require('../../executors/replicate-gpt-4o-mini');
    return estimateGPT4oMiniCost(estimatedInputTokens, estimatedOutputTokens);
  }
}

/**
 * Utility function to get refiner service statistics
 */
export function getRefinerServiceStats(): {
  supportedModels: string[];
  primaryModel: string;
  fallbackModel: string;
  maxRetries: number;
  defaultTimeout: number;
} {
  return {
    supportedModels: ['claude-3-haiku', 'gpt-4o-mini'],
    primaryModel: 'claude-3-haiku',
    fallbackModel: 'gpt-4o-mini',
    maxRetries: 2,
    defaultTimeout: 30000 // 30 seconds
  };
}

/**
 * Health check for refiner service
 */
export async function refinerServiceHealthCheck(): Promise<{
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
    await executeClaude3Haiku({
      prompt: 'Generate a simple JSON object with a "test" field set to true.',
      max_tokens: 100,
      temperature: 0.1
    });
    models.claude3Haiku = true;
  } catch (error) {
    errors.push(`Claude 3 Haiku health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Test GPT-4o-mini
  try {
    await executeGPT4oMini({
      prompt: 'Generate a simple JSON object with a "test" field set to true.',
      max_tokens: 100,
      temperature: 0.1
    });
    models.gpt4oMini = true;
  } catch (error) {
    errors.push(`GPT-4o-mini health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    healthy: models.claude3Haiku || models.gpt4oMini, // At least one model should work
    models,
    errors
  };
}

export default refineAnalyzerJSON;
