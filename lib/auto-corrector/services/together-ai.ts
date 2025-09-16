import { createServiceExecutor, ServiceType } from '../index';

// Together AI specific types
export interface TogetherAIInput {
  prompt: string;
  model?: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
  stream?: boolean;
}

export interface TogetherAIOutput {
  output: {
    choices: Array<{
      text: string;
      finish_reason: string;
    }>;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };
}

// Together AI service executor
export const togetherAIExecutor = createServiceExecutor<TogetherAIInput, TogetherAIOutput>(
  'together' as ServiceType,
  async (input: TogetherAIInput): Promise<TogetherAIOutput> => {
    const response = await fetch('https://api.together.xyz/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: input.model || 'meta-llama/Llama-2-7b-chat-hf',
        prompt: input.prompt,
        max_tokens: input.max_tokens || 1000,
        temperature: input.temperature || 0.7,
        top_p: input.top_p || 1,
        frequency_penalty: input.frequency_penalty || 0,
        presence_penalty: input.presence_penalty || 0,
        stop: input.stop,
        stream: input.stream || false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Together AI API error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return { output: data };
  },
  {
    validateInput: (input: TogetherAIInput) => {
      return !!(input.prompt && input.prompt.trim().length > 0);
    }
  }
);

// Enhanced Together AI executor with auto-correction
export async function executeTogetherAIWithAutoCorrection(
  input: TogetherAIInput,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    enableFallback?: boolean;
    logLevel?: 'silent' | 'error' | 'warn' | 'info' | 'debug';
  } = {}
): Promise<{
  success: boolean;
  data?: TogetherAIOutput;
  error?: string;
  service: string;
  attempts: number;
  fallbackUsed: boolean;
  processingTime: number;
}> {
  const { autoCorrector } = await import('../index');
  
  // Register the Together AI executor if not already registered
  if (!autoCorrector['serviceExecutors'].has('together')) {
    autoCorrector.registerService(togetherAIExecutor);
  }

  const result = await autoCorrector.execute('together', input, options);
  
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

// Utility function to extract text from Together AI response
export function extractTogetherAIText(response: TogetherAIOutput): string {
  if (response?.output?.choices?.[0]?.text) {
    return response.output.choices[0].text.trim();
  }
  throw new Error('Invalid Together AI response format');
}

// Utility function to get token usage from Together AI response
export function getTogetherAITokenUsage(response: TogetherAIOutput): {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
} {
  if (response?.output?.usage) {
    return response.output.usage;
  }
  throw new Error('Token usage not available in Together AI response');
}
