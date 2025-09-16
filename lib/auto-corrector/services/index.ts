import { autoCorrector, ServiceType } from '../index';
import { togetherAIExecutor } from './together-ai';
import { replicateExecutor } from './replicate';
import { falAIExecutor } from './fal-ai';

// Register all service executors
autoCorrector.registerService(togetherAIExecutor);
autoCorrector.registerService(replicateExecutor);
autoCorrector.registerService(falAIExecutor);

// Export service-specific functions
export { executeTogetherAIWithAutoCorrection } from './together-ai';
export { executeReplicateWithAutoCorrection } from './replicate';
export { executeFalAIWithAutoCorrection } from './fal-ai';

// Export types
export type { TogetherAIInput, TogetherAIOutput } from './together-ai';
export type { ReplicateInput, ReplicateOutput } from './replicate';
export type { FalAIInput, FalAIOutput } from './fal-ai';

// Unified auto-corrector function
export async function executeWithAutoCorrection<TInput = any, TOutput = any>(
  service: ServiceType,
  input: TInput,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    enableFallback?: boolean;
    logLevel?: 'silent' | 'error' | 'warn' | 'info' | 'debug';
    timeout?: number;
  } = {}
) {
  return autoCorrector.execute(service, input, options);
}

// Service health checker
export async function checkServiceHealth(service: ServiceType) {
  return autoCorrector.getServiceHealth(service);
}

// All services health checker
export async function checkAllServicesHealth() {
  return autoCorrector.getAllServiceHealth();
}

// Service availability checker
export function isServiceAvailable(service: ServiceType): boolean {
  return autoCorrector['serviceExecutors'].has(service);
}

// Get available services
export function getAvailableServices(): ServiceType[] {
  return Array.from(autoCorrector['serviceExecutors'].keys());
}

// Service configuration
export const SERVICE_CONFIG = {
  together: {
    name: 'Together AI',
    description: 'Open-source AI models API',
    defaultModel: 'meta-llama/Llama-2-7b-chat-hf',
    maxTokens: 4000,
    timeout: 30000
  },
  replicate: {
    name: 'Replicate',
    description: 'Machine learning model hosting platform',
    defaultModel: 'stability-ai/stable-diffusion',
    maxTokens: 1000,
    timeout: 60000
  },
  fal: {
    name: 'Fal.ai',
    description: 'Fast AI inference platform',
    defaultModel: 'fal-ai/flux-dev',
    maxTokens: 1000,
    timeout: 45000
  }
} as const;

// Get service configuration
export function getServiceConfig(service: ServiceType) {
  return SERVICE_CONFIG[service] || null;
}

// Validate service input
export function validateServiceInput(service: ServiceType, input: any): boolean {
  const executor = autoCorrector['serviceExecutors'].get(service);
  if (!executor || !executor.validateInput) {
    return true; // No validation available
  }
  return executor.validateInput(input);
}

// Get service fallback chain
export function getServiceFallbackChain(service: ServiceType): ServiceType[] {
  return autoCorrector['fallbackChain'].get(service) || [];
}

// Service statistics
export interface ServiceStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  lastUsed: Date;
}

// Simple in-memory statistics tracker
class ServiceStatsTracker {
  private stats: Map<ServiceType, ServiceStats> = new Map();

  recordRequest(service: ServiceType, success: boolean, responseTime: number) {
    const current = this.stats.get(service) || {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      lastUsed: new Date()
    };

    current.totalRequests++;
    if (success) {
      current.successfulRequests++;
    } else {
      current.failedRequests++;
    }
    
    // Update average response time
    current.averageResponseTime = 
      (current.averageResponseTime * (current.totalRequests - 1) + responseTime) / current.totalRequests;
    
    current.lastUsed = new Date();
    this.stats.set(service, current);
  }

  getStats(service: ServiceType): ServiceStats | null {
    return this.stats.get(service) || null;
  }

  getAllStats(): Record<ServiceType, ServiceStats> {
    return Object.fromEntries(this.stats.entries());
  }

  resetStats(service?: ServiceType) {
    if (service) {
      this.stats.delete(service);
    } else {
      this.stats.clear();
    }
  }
}

export const serviceStatsTracker = new ServiceStatsTracker();

// Enhanced execute function with statistics
export async function executeWithStats<TInput = any, TOutput = any>(
  service: ServiceType,
  input: TInput,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    enableFallback?: boolean;
    logLevel?: 'silent' | 'error' | 'warn' | 'info' | 'debug';
    timeout?: number;
  } = {}
) {
  const startTime = Date.now();
  const result = await autoCorrector.execute(service, input, options);
  const responseTime = Date.now() - startTime;
  
  // Record statistics
  serviceStatsTracker.recordRequest(service, result.success, responseTime);
  
  return result;
}

// Get service statistics
export function getServiceStats(service: ServiceType): ServiceStats | null {
  return serviceStatsTracker.getStats(service);
}

// Get all service statistics
export function getAllServiceStats(): Record<ServiceType, ServiceStats> {
  return serviceStatsTracker.getAllStats();
}
