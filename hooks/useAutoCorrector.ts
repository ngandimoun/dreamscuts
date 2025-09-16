import { useState, useCallback, useRef } from 'react';
import { ServiceType, AutoCorrectorResult } from '@/lib/auto-corrector';

// Hook configuration
export interface UseAutoCorrectorConfig {
  maxRetries?: number;
  retryDelay?: number;
  enableFallback?: boolean;
  logLevel?: 'silent' | 'error' | 'warn' | 'info' | 'debug';
  timeout?: number;
  onSuccess?: (result: AutoCorrectorResult) => void;
  onError?: (error: string) => void;
  onRetry?: (attempt: number, service: ServiceType) => void;
}

// Hook state
export interface UseAutoCorrectorState {
  isLoading: boolean;
  error: string | null;
  result: AutoCorrectorResult | null;
  attempts: number;
  currentService: ServiceType | null;
  fallbackUsed: boolean;
  processingTime: number;
  retryHistory: Array<{
    attempt: number;
    service: ServiceType;
    error: string;
    timestamp: number;
    retryable: boolean;
  }>;
}

// Hook return type
export interface UseAutoCorrectorReturn {
  state: UseAutoCorrectorState;
  execute: <TInput = any, TOutput = any>(
    service: ServiceType,
    input: TInput
  ) => Promise<AutoCorrectorResult<TOutput>>;
  reset: () => void;
  retry: () => Promise<void>;
  cancel: () => void;
}

// Default state
const defaultState: UseAutoCorrectorState = {
  isLoading: false,
  error: null,
  result: null,
  attempts: 0,
  currentService: null,
  fallbackUsed: false,
  processingTime: 0,
  retryHistory: []
};

export function useAutoCorrector(config: UseAutoCorrectorConfig = {}): UseAutoCorrectorReturn {
  const [state, setState] = useState<UseAutoCorrectorState>(defaultState);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastInputRef = useRef<any>(null);
  const lastServiceRef = useRef<ServiceType | null>(null);

  const reset = useCallback(() => {
    setState(defaultState);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setState(prev => ({ ...prev, isLoading: false }));
  }, []);

  const execute = useCallback(async <TInput = any, TOutput = any>(
    service: ServiceType,
    input: TInput
  ): Promise<AutoCorrectorResult<TOutput>> => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    lastInputRef.current = input;
    lastServiceRef.current = service;

    // Reset state
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      result: null,
      attempts: 0,
      currentService: service,
      fallbackUsed: false,
      processingTime: 0,
      retryHistory: []
    }));

    try {
      // Import the auto-corrector service
      const { executeWithAutoCorrection } = await import('@/lib/auto-corrector/services');

      const result = await executeWithAutoCorrection<TInput, TOutput>(service, input, {
        maxRetries: config.maxRetries,
        retryDelay: config.retryDelay,
        enableFallback: config.enableFallback,
        logLevel: config.logLevel,
        timeout: config.timeout
      });

      // Check if request was cancelled
      if (abortControllerRef.current?.signal.aborted) {
        throw new Error('Request cancelled');
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: result.success ? null : result.error || 'Unknown error',
        result: result as AutoCorrectorResult<TOutput>,
        attempts: result.attempts,
        fallbackUsed: result.fallbackUsed,
        processingTime: result.processingTime,
        retryHistory: result.retryHistory
      }));

      if (result.success && config.onSuccess) {
        config.onSuccess(result);
      } else if (!result.success && config.onError) {
        config.onError(result.error || 'Unknown error');
      }

      return result as AutoCorrectorResult<TOutput>;

    } catch (error: any) {
      // Check if request was cancelled
      if (abortControllerRef.current?.signal.aborted) {
        return {
          success: false,
          error: 'Request cancelled',
          service,
          attempts: 0,
          fallbackUsed: false,
          processingTime: 0,
          retryHistory: []
        };
      }

      const errorMessage = error.message || 'Unknown error';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        result: null
      }));

      if (config.onError) {
        config.onError(errorMessage);
      }

      return {
        success: false,
        error: errorMessage,
        service,
        attempts: 0,
        fallbackUsed: false,
        processingTime: 0,
        retryHistory: []
      };
    }
  }, [config]);

  const retry = useCallback(async () => {
    if (lastInputRef.current && lastServiceRef.current) {
      await execute(lastServiceRef.current, lastInputRef.current);
    }
  }, [execute]);

  return {
    state,
    execute,
    reset,
    retry,
    cancel
  };
}

// Hook for service health monitoring
export function useServiceHealth(services: ServiceType[] = []) {
  const [healthStatus, setHealthStatus] = useState<Record<ServiceType, {
    healthy: boolean;
    responseTime: number;
    error?: string;
  }>>({});
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = useCallback(async () => {
    setIsChecking(true);
    try {
      const { checkAllServicesHealth } = await import('@/lib/auto-corrector/services');
      const health = await checkAllServicesHealth();
      setHealthStatus(health);
    } catch (error) {
      console.error('Failed to check service health:', error);
    } finally {
      setIsChecking(false);
    }
  }, []);

  const checkSpecificService = useCallback(async (service: ServiceType) => {
    try {
      const { checkServiceHealth } = await import('@/lib/auto-corrector/services');
      const health = await checkServiceHealth(service);
      setHealthStatus(prev => ({ ...prev, [service]: health }));
    } catch (error) {
      console.error(`Failed to check health for ${service}:`, error);
    }
  }, []);

  return {
    healthStatus,
    isChecking,
    checkHealth,
    checkSpecificService
  };
}

// Hook for service statistics
export function useServiceStats() {
  const [stats, setStats] = useState<Record<ServiceType, {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    lastUsed: Date;
  }>>({});

  const refreshStats = useCallback(async () => {
    try {
      const { getAllServiceStats } = await import('@/lib/auto-corrector/services');
      const serviceStats = getAllServiceStats();
      setStats(serviceStats);
    } catch (error) {
      console.error('Failed to get service statistics:', error);
    }
  }, []);

  return {
    stats,
    refreshStats
  };
}
