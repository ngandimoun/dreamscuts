import { createServiceExecutor, ServiceType } from '../index';

// Replicate specific types
export interface ReplicateInput {
  input: Record<string, any>;
  model: string;
  version?: string;
  webhook?: string;
  webhook_events_filter?: string[];
}

export interface ReplicateOutput {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output?: any;
  error?: string;
  logs?: string;
  metrics?: {
    predict_time?: number;
  };
}

// Replicate service executor
export const replicateExecutor = createServiceExecutor<ReplicateInput, ReplicateOutput>(
  'replicate' as ServiceType,
  async (input: ReplicateInput): Promise<ReplicateOutput> => {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: input.input,
        model: input.model,
        version: input.version,
        webhook: input.webhook,
        webhook_events_filter: input.webhook_events_filter,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Replicate API error: ${response.status} ${response.statusText} - ${errorData.detail || 'Unknown error'}`);
    }

    const data = await response.json();
    
    // If the prediction is not immediately ready, poll for completion
    if (data.status === 'starting' || data.status === 'processing') {
      return await pollReplicatePrediction(data.id);
    }
    
    return data;
  },
  {
    validateInput: (input: ReplicateInput) => {
      return !!(input.model && input.input && typeof input.input === 'object');
    }
  }
);

// Poll for Replicate prediction completion
async function pollReplicatePrediction(
  predictionId: string,
  maxAttempts: number = 60,
  pollInterval: number = 2000
): Promise<ReplicateOutput> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to poll Replicate prediction: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status === 'succeeded') {
      return data;
    } else if (data.status === 'failed' || data.status === 'canceled') {
      throw new Error(`Replicate prediction failed: ${data.error || 'Unknown error'}`);
    }
    
    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
  
  throw new Error('Replicate prediction timeout - exceeded maximum polling attempts');
}

// Enhanced Replicate executor with auto-correction
export async function executeReplicateWithAutoCorrection(
  input: ReplicateInput,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    enableFallback?: boolean;
    logLevel?: 'silent' | 'error' | 'warn' | 'info' | 'debug';
  } = {}
): Promise<{
  success: boolean;
  data?: ReplicateOutput;
  error?: string;
  service: string;
  attempts: number;
  fallbackUsed: boolean;
  processingTime: number;
}> {
  const { autoCorrector } = await import('../index');
  
  // Register the Replicate executor if not already registered
  if (!autoCorrector['serviceExecutors'].has('replicate')) {
    autoCorrector.registerService(replicateExecutor);
  }

  const result = await autoCorrector.execute('replicate', input, options);
  
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

// Utility function to extract output from Replicate response
export function extractReplicateOutput(response: ReplicateOutput): any {
  if (response.status === 'succeeded' && response.output !== undefined) {
    return response.output;
  }
  throw new Error(`Replicate prediction not successful: ${response.status} - ${response.error || 'Unknown error'}`);
}

// Utility function to get prediction metrics from Replicate response
export function getReplicateMetrics(response: ReplicateOutput): {
  predict_time?: number;
} {
  return response.metrics || {};
}

// Utility function to check if Replicate response is successful
export function isReplicateSuccessful(response: ReplicateOutput): boolean {
  return response.status === 'succeeded';
}
