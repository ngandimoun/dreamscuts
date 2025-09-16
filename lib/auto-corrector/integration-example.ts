/**
 * Integration Example: How to use Auto-Corrector with existing executors
 * 
 * This file demonstrates how to integrate the auto-corrector system
 * with your existing executor functions for enhanced reliability.
 */

import { executeWithAutoCorrection } from './services';
import { ServiceType } from './index';

// Example: Wrapping an existing executor with auto-correction
export async function executeWithAutoCorrectionWrapper<TInput, TOutput>(
  service: ServiceType,
  executor: (input: TInput) => Promise<TOutput>,
  input: TInput,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    enableFallback?: boolean;
    logLevel?: 'silent' | 'error' | 'warn' | 'info' | 'debug';
    timeout?: number;
  } = {}
): Promise<{
  success: boolean;
  data?: TOutput;
  error?: string;
  service: string;
  attempts: number;
  fallbackUsed: boolean;
  processingTime: number;
}> {
  // Create a temporary executor for this specific call
  const tempExecutor = {
    service,
    execute: executor,
    validateInput: (input: TInput) => {
      // Basic validation - customize as needed
      return input !== null && input !== undefined;
    }
  };

  // Register the temporary executor
  const { autoCorrector } = await import('./index');
  autoCorrector.registerService(tempExecutor);

  try {
    // Execute with auto-correction
    const result = await autoCorrector.execute(service, input, options);
    
    return {
      success: result.success,
      data: result.data,
      error: result.error,
      service: result.service,
      attempts: result.attempts,
      fallbackUsed: result.fallbackUsed,
      processingTime: result.processingTime
    };
  } finally {
    // Clean up - remove the temporary executor
    autoCorrector['serviceExecutors'].delete(service);
  }
}

// Example: Enhanced video analyzer with auto-correction
export async function enhancedVideoAnalyzeWithAutoCorrection(
  videoUrl: string,
  prompt: string,
  userDescription?: string
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  service: string;
  attempts: number;
  fallbackUsed: boolean;
  processingTime: number;
}> {
  // Import your existing video analyzer
  const { analyzeVideoAsset } = await import('../../executors/video-asset-analyzer');
  
  // Create input for the video analyzer
  const input = {
    videoUrl,
    prompt,
    userDescription,
    analysisType: 'content_analysis' as const,
    maxRetries: 3
  };

  // Use auto-correction with the video analyzer
  return executeWithAutoCorrectionWrapper(
    'replicate', // Primary service
    async (input) => {
      const result = await analyzeVideoAsset(input, {
        timeout: 30000,
        enableFallback: true,
        logLevel: 'info'
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Video analysis failed');
      }
      
      return result;
    },
    input,
    {
      maxRetries: 3,
      retryDelay: 2000,
      enableFallback: true,
      logLevel: 'info',
      timeout: 45000
    }
  );
}

// Example: Enhanced image analyzer with auto-correction
export async function enhancedImageAnalyzeWithAutoCorrection(
  imageUrl: string,
  prompt: string,
  userDescription?: string
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  service: string;
  attempts: number;
  fallbackUsed: boolean;
  processingTime: number;
}> {
  // Import your existing image analyzer
  const { analyzeImageAsset } = await import('../../executors/image-asset-analyzer');
  
  // Create input for the image analyzer
  const input = {
    imageUrl,
    prompt,
    userDescription,
    analysisType: 'content_analysis' as const,
    maxRetries: 3
  };

  // Use auto-correction with the image analyzer
  return executeWithAutoCorrectionWrapper(
    'together', // Primary service
    async (input) => {
      const result = await analyzeImageAsset(input, {
        timeout: 30000,
        enableFallback: true,
        logLevel: 'info'
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Image analysis failed');
      }
      
      return result;
    },
    input,
    {
      maxRetries: 3,
      retryDelay: 1500,
      enableFallback: true,
      logLevel: 'info',
      timeout: 35000
    }
  );
}

// Example: Enhanced text analyzer with auto-correction
export async function enhancedTextAnalyzeWithAutoCorrection(
  text: string,
  prompt: string,
  userDescription?: string
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  service: string;
  attempts: number;
  fallbackUsed: boolean;
  processingTime: number;
}> {
  // Import your existing text analyzer
  const { analyzeTextAsset } = await import('../../executors/text-asset-analyzer');
  
  // Create input for the text analyzer
  const input = {
    text,
    prompt,
    userDescription,
    analysisType: 'content_summarization' as const,
    maxRetries: 3
  };

  // Use auto-correction with the text analyzer
  return executeWithAutoCorrectionWrapper(
    'together', // Primary service
    async (input) => {
      const result = await analyzeTextAsset(input, {
        timeout: 30000,
        enableFallback: true,
        logLevel: 'info'
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Text analysis failed');
      }
      
      return result;
    },
    input,
    {
      maxRetries: 3,
      retryDelay: 1000,
      enableFallback: true,
      logLevel: 'info',
      timeout: 30000
    }
  );
}

// Example: Service health monitoring
export async function monitorAllServices(): Promise<{
  healthy: Record<ServiceType, boolean>;
  responseTimes: Record<ServiceType, number>;
  errors: Record<ServiceType, string | null>;
}> {
  const { checkAllServicesHealth } = await import('./services');
  const health = await checkAllServicesHealth();
  
  const healthy: Record<ServiceType, boolean> = {};
  const responseTimes: Record<ServiceType, number> = {};
  const errors: Record<ServiceType, string | null> = {};
  
  Object.entries(health).forEach(([service, status]) => {
    healthy[service as ServiceType] = status.healthy;
    responseTimes[service as ServiceType] = status.responseTime;
    errors[service as ServiceType] = status.error || null;
  });
  
  return { healthy, responseTimes, errors };
}

// Example: Service statistics
export async function getServicePerformanceStats(): Promise<{
  totalRequests: Record<ServiceType, number>;
  successRates: Record<ServiceType, number>;
  averageResponseTimes: Record<ServiceType, number>;
}> {
  const { getAllServiceStats } = await import('./services');
  const stats = getAllServiceStats();
  
  const totalRequests: Record<ServiceType, number> = {};
  const successRates: Record<ServiceType, number> = {};
  const averageResponseTimes: Record<ServiceType, number> = {};
  
  Object.entries(stats).forEach(([service, stat]) => {
    totalRequests[service as ServiceType] = stat.totalRequests;
    successRates[service as ServiceType] = stat.totalRequests > 0 
      ? (stat.successfulRequests / stat.totalRequests) * 100 
      : 0;
    averageResponseTimes[service as ServiceType] = stat.averageResponseTime;
  });
  
  return { totalRequests, successRates, averageResponseTimes };
}

// Example: Batch processing with auto-correction
export async function processBatchWithAutoCorrection<TInput, TOutput>(
  service: ServiceType,
  inputs: TInput[],
  executor: (input: TInput) => Promise<TOutput>,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    enableFallback?: boolean;
    logLevel?: 'silent' | 'error' | 'warn' | 'info' | 'debug';
    timeout?: number;
    concurrency?: number;
  } = {}
): Promise<Array<{
  success: boolean;
  data?: TOutput;
  error?: string;
  service: string;
  attempts: number;
  fallbackUsed: boolean;
  processingTime: number;
}>> {
  const { concurrency = 3 } = options;
  const results: Array<{
    success: boolean;
    data?: TOutput;
    error?: string;
    service: string;
    attempts: number;
    fallbackUsed: boolean;
    processingTime: number;
  }> = [];
  
  // Process inputs in batches
  for (let i = 0; i < inputs.length; i += concurrency) {
    const batch = inputs.slice(i, i + concurrency);
    
    const batchResults = await Promise.all(
      batch.map(input => 
        executeWithAutoCorrectionWrapper(service, executor, input, options)
      )
    );
    
    results.push(...batchResults);
  }
  
  return results;
}
