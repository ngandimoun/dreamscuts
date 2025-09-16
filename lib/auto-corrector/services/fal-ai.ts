import { createServiceExecutor, ServiceType } from '../index';

// Fal.ai specific types
export interface FalAIInput {
  input: Record<string, any>;
  model: string;
  webhook_url?: string;
  webhook_secret?: string;
}

export interface FalAIOutput {
  request_id: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  output?: any;
  error?: string;
  logs?: string;
  metrics?: {
    duration?: number;
    predict_time?: number;
  };
}

// Fal.ai service executor
export const falAIExecutor = createServiceExecutor<FalAIInput, FalAIOutput>(
  'fal' as ServiceType,
  async (input: FalAIInput): Promise<FalAIOutput> => {
    const response = await fetch(`https://fal.run/${input.model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: input.input,
        webhook_url: input.webhook_url,
        webhook_secret: input.webhook_secret,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Fal.ai API error: ${response.status} ${response.statusText} - ${errorData.detail || errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    // If the request is not immediately ready, poll for completion
    if (data.status === 'IN_PROGRESS') {
      return await pollFalAIRequest(data.request_id);
    }
    
    return data;
  },
  {
    validateInput: (input: FalAIInput) => {
      return !!(input.model && input.input && typeof input.input === 'object');
    }
  }
);

// Poll for Fal.ai request completion
async function pollFalAIRequest(
  requestId: string,
  maxAttempts: number = 60,
  pollInterval: number = 2000
): Promise<FalAIOutput> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(`https://fal.run/requests/${requestId}`, {
      headers: {
        'Authorization': `Key ${process.env.FAL_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to poll Fal.ai request: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status === 'COMPLETED') {
      return data;
    } else if (data.status === 'FAILED' || data.status === 'CANCELLED') {
      throw new Error(`Fal.ai request failed: ${data.error || 'Unknown error'}`);
    }
    
    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
  
  throw new Error('Fal.ai request timeout - exceeded maximum polling attempts');
}

// Enhanced Fal.ai executor with auto-correction
export async function executeFalAIWithAutoCorrection(
  input: FalAIInput,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    enableFallback?: boolean;
    logLevel?: 'silent' | 'error' | 'warn' | 'info' | 'debug';
  } = {}
): Promise<{
  success: boolean;
  data?: FalAIOutput;
  error?: string;
  service: string;
  attempts: number;
  fallbackUsed: boolean;
  processingTime: number;
}> {
  const { autoCorrector } = await import('../index');
  
  // Register the Fal.ai executor if not already registered
  if (!autoCorrector['serviceExecutors'].has('fal')) {
    autoCorrector.registerService(falAIExecutor);
  }

  const result = await autoCorrector.execute('fal', input, options);
  
  return {
    success: result.success,
    data: result.data,
    error: result.error,
    service: result.service,
    attempts: result.attempts,
    fallbackUsed: result.fallbackUsed,
    processingTime: result.processingTime
  };
}

// Utility function to extract output from Fal.ai response
export function extractFalAIOutput(response: FalAIOutput): any {
  if (response.status === 'COMPLETED' && response.output !== undefined) {
    return response.output;
  }
  throw new Error(`Fal.ai request not successful: ${response.status} - ${response.error || 'Unknown error'}`);
}

// Utility function to get request metrics from Fal.ai response
export function getFalAIMetrics(response: FalAIOutput): {
  duration?: number;
  predict_time?: number;
} {
  return response.metrics || {};
}

// Utility function to check if Fal.ai response is successful
export function isFalAISuccessful(response: FalAIOutput): boolean {
  return response.status === 'COMPLETED';
}

// Utility function to get request ID from Fal.ai response
export function getFalAIRequestId(response: FalAIOutput): string {
  return response.request_id;
}
