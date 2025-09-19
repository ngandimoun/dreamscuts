import { z } from "zod";

// Auto-corrector configuration schema
export const AutoCorrectorConfigSchema = z.object({
  maxRetries: z.number().min(1).max(10).default(3),
  retryDelay: z.number().min(100).max(10000).default(1000),
  exponentialBackoff: z.boolean().default(true),
  enableFallback: z.boolean().default(true),
  logLevel: z.enum(['silent', 'error', 'warn', 'info', 'debug']).default('info'),
  timeout: z.number().min(1000).max(60000).default(30000),
});

export type AutoCorrectorConfig = z.infer<typeof AutoCorrectorConfigSchema>;

// Service types
export type ServiceType = 'together' | 'replicate' | 'fal' | 'openai' | 'anthropic' | 'shotstack';

// Error types
export interface ServiceError {
  service: ServiceType;
  error: string;
  code?: string;
  statusCode?: number;
  retryable: boolean;
  fallbackAvailable: boolean;
}

// Auto-corrector result
export interface AutoCorrectorResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  service: ServiceType;
  attempts: number;
  fallbackUsed: boolean;
  processingTime: number;
  retryHistory: RetryAttempt[];
}

export interface RetryAttempt {
  attempt: number;
  service: ServiceType;
  error: string;
  timestamp: number;
  retryable: boolean;
}

// Service executor interface
export interface ServiceExecutor<TInput = any, TOutput = any> {
  service: ServiceType;
  execute: (input: TInput) => Promise<TOutput>;
  validateInput?: (input: TInput) => boolean;
  getFallbackService?: () => ServiceType | null;
}

// Auto-corrector class
export class AutoCorrector {
  private config: AutoCorrectorConfig;
  private serviceExecutors: Map<ServiceType, ServiceExecutor> = new Map();
  private fallbackChain: Map<ServiceType, ServiceType[]> = new Map();

  constructor(config: Partial<AutoCorrectorConfig> = {}) {
    this.config = AutoCorrectorConfigSchema.parse(config);
    this.initializeFallbackChains();
  }

  private initializeFallbackChains() {
    // Define fallback chains for each service
    this.fallbackChain.set('together', ['replicate', 'fal', 'openai']);
    this.fallbackChain.set('replicate', ['together', 'fal', 'openai']);
    this.fallbackChain.set('fal', ['replicate', 'together', 'openai']);
    this.fallbackChain.set('openai', ['anthropic', 'together', 'replicate']);
    this.fallbackChain.set('anthropic', ['openai', 'together', 'replicate']);
    this.fallbackChain.set('shotstack', []); // Shotstack has no direct fallbacks
  }

  /**
   * Register a service executor
   */
  registerService(executor: ServiceExecutor) {
    this.serviceExecutors.set(executor.service, executor);
  }

  /**
   * Execute with auto-correction
   */
  async execute<TInput = any, TOutput = any>(
    service: ServiceType,
    input: TInput,
    options: Partial<AutoCorrectorConfig> = {}
  ): Promise<AutoCorrectorResult<TOutput>> {
    const config = { ...this.config, ...options };
    const startTime = Date.now();
    const retryHistory: RetryAttempt[] = [];

    // Get the primary service executor
    const primaryExecutor = this.serviceExecutors.get(service);
    if (!primaryExecutor) {
      return {
        success: false,
        error: `Service executor not found for ${service}`,
        service,
        attempts: 0,
        fallbackUsed: false,
        processingTime: Date.now() - startTime,
        retryHistory: []
      };
    }

    // Try primary service first
    let result = await this.tryService(primaryExecutor, input, config, retryHistory);
    if (result.success) {
      return result;
    }

    // If fallback is enabled, try fallback services
    if (config.enableFallback) {
      const fallbackServices = this.fallbackChain.get(service) || [];
      
      for (const fallbackService of fallbackServices) {
        const fallbackExecutor = this.serviceExecutors.get(fallbackService);
        if (fallbackExecutor) {
          result = await this.tryService(fallbackExecutor, input, config, retryHistory);
          if (result.success) {
            result.fallbackUsed = true;
            return result;
          }
        }
      }
    }

    // All attempts failed
    return {
      success: false,
      error: `All services failed. Last error: ${retryHistory[retryHistory.length - 1]?.error || 'Unknown error'}`,
      service,
      attempts: retryHistory.length,
      fallbackUsed: config.enableFallback,
      processingTime: Date.now() - startTime,
      retryHistory
    };
  }

  /**
   * Try a specific service with retry logic
   */
  private async tryService<TInput, TOutput>(
    executor: ServiceExecutor<TInput, TOutput>,
    input: TInput,
    config: AutoCorrectorConfig,
    retryHistory: RetryAttempt[]
  ): Promise<AutoCorrectorResult<TOutput>> {
    const startTime = Date.now();
    let lastError: string = '';

    for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
      try {
        // Validate input if validator is provided
        if (executor.validateInput && !executor.validateInput(input)) {
          throw new Error('Invalid input provided');
        }

        // Execute with timeout
        const result = await Promise.race([
          executor.execute(input),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Service timeout')), config.timeout)
          )
        ]);

        return {
          success: true,
          data: result,
          service: executor.service,
          attempts: attempt,
          fallbackUsed: false,
          processingTime: Date.now() - startTime,
          retryHistory
        };

      } catch (error: any) {
        lastError = error.message || 'Unknown error';
        const serviceError = this.analyzeError(error, executor.service);
        
        retryHistory.push({
          attempt,
          service: executor.service,
          error: lastError,
          timestamp: Date.now(),
          retryable: serviceError.retryable
        });

        if (config.logLevel !== 'silent') {
          console.warn(`[AutoCorrector] ${executor.service} attempt ${attempt} failed: ${lastError}`);
        }

        // If not retryable, break immediately
        if (!serviceError.retryable) {
          break;
        }

        // If this is the last attempt, don't wait
        if (attempt < config.maxRetries) {
          const delay = config.exponentialBackoff 
            ? config.retryDelay * Math.pow(2, attempt - 1)
            : config.retryDelay;
          
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    return {
      success: false,
      error: lastError,
      service: executor.service,
      attempts: config.maxRetries,
      fallbackUsed: false,
      processingTime: Date.now() - startTime,
      retryHistory
    };
  }

  /**
   * Analyze error to determine if it's retryable
   */
  private analyzeError(error: any, service: ServiceType): ServiceError {
    const errorMessage = error.message || error.toString();
    const statusCode = error.status || error.statusCode || error.code;

    // Common retryable errors
    const retryablePatterns = [
      /timeout/i,
      /network/i,
      /connection/i,
      /rate limit/i,
      /throttle/i,
      /temporary/i,
      /service unavailable/i,
      /bad gateway/i,
      /gateway timeout/i,
      /internal server error/i,
      /502/i,
      /503/i,
      /504/i,
      /429/i
    ];

    // Common non-retryable errors
    const nonRetryablePatterns = [
      /authentication/i,
      /authorization/i,
      /forbidden/i,
      /not found/i,
      /bad request/i,
      /invalid/i,
      /malformed/i,
      /quota exceeded/i,
      /billing/i,
      /payment/i,
      /401/i,
      /403/i,
      /404/i,
      /400/i
    ];

    const isRetryable = retryablePatterns.some(pattern => pattern.test(errorMessage)) &&
                       !nonRetryablePatterns.some(pattern => pattern.test(errorMessage));

    return {
      service,
      error: errorMessage,
      code: error.code,
      statusCode,
      retryable: isRetryable,
      fallbackAvailable: true
    };
  }

  /**
   * Get service health status
   */
  async getServiceHealth(service: ServiceType): Promise<{
    healthy: boolean;
    responseTime: number;
    error?: string;
  }> {
    const executor = this.serviceExecutors.get(service);
    if (!executor) {
      return { healthy: false, responseTime: 0, error: 'Service not registered' };
    }

    const startTime = Date.now();
    try {
      // Use a simple health check input
      const healthCheckInput = { prompt: 'health check', max_tokens: 1 };
      await Promise.race([
        executor.execute(healthCheckInput),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Health check timeout')), 5000)
        )
      ]);

      return {
        healthy: true,
        responseTime: Date.now() - startTime
      };
    } catch (error: any) {
      return {
        healthy: false,
        responseTime: Date.now() - startTime,
        error: error.message
      };
    }
  }

  /**
   * Get all service health statuses
   */
  async getAllServiceHealth(): Promise<Record<ServiceType, {
    healthy: boolean;
    responseTime: number;
    error?: string;
  }>> {
    const healthChecks = await Promise.all(
      Array.from(this.serviceExecutors.keys()).map(async (service) => {
        const health = await this.getServiceHealth(service);
        return [service, health] as const;
      })
    );

    return Object.fromEntries(healthChecks);
  }
}

// Singleton instance
export const autoCorrector = new AutoCorrector();

// Utility functions
export function createServiceExecutor<TInput, TOutput>(
  service: ServiceType,
  execute: (input: TInput) => Promise<TOutput>,
  options: {
    validateInput?: (input: TInput) => boolean;
    getFallbackService?: () => ServiceType | null;
  } = {}
): ServiceExecutor<TInput, TOutput> {
  return {
    service,
    execute,
    ...options
  };
}

export function withAutoCorrection<TInput, TOutput>(
  service: ServiceType,
  executor: ServiceExecutor<TInput, TOutput>,
  config?: Partial<AutoCorrectorConfig>
) {
  return async (input: TInput): Promise<AutoCorrectorResult<TOutput>> => {
    return autoCorrector.execute(service, input, config);
  };
}
