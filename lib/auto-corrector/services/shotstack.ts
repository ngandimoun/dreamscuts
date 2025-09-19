import { createServiceExecutor, ServiceType } from '../index';

// Shotstack specific types
export interface ShotstackInput {
  timeline: {
    background?: string;
    soundtrack?: {
      src: string;
      effect?: 'fadeIn' | 'fadeOut' | 'fadeInOut';
    };
    tracks: Array<{
      clips: Array<{
        asset: {
          type: 'video' | 'image' | 'text' | 'html' | 'audio' | 'luma' | 'title' | 'shape' | 'caption';
          src?: string;
          text?: string;
          html?: string;
          css?: string;
          shape?: 'rectangle' | 'circle' | 'line';
          rectangle?: {
            width: number;
            height: number;
            cornerRadius?: number;
          };
          circle?: {
            radius: number;
          };
          line?: {
            length: number;
            thickness: number;
          };
          fill?: {
            color: string;
            opacity?: number;
          };
          stroke?: {
            color: string;
            width: number;
          };
          font?: {
            family?: string;
            size?: number;
            color?: string;
            weight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
            style?: 'normal' | 'italic' | 'oblique';
            decoration?: 'none' | 'underline' | 'line-through';
            align?: 'left' | 'center' | 'right' | 'justify';
            lineHeight?: number;
            letterSpacing?: number;
            stroke?: string;
            strokeWidth?: number;
          };
          alignment?: {
            horizontal?: 'left' | 'center' | 'right';
            vertical?: 'top' | 'middle' | 'bottom';
          };
          background?: {
            color: string;
            padding?: number;
            borderRadius?: number;
            opacity?: number;
          };
          width?: number;
          height?: number;
          trim?: number;
          volume?: number;
          chromaKey?: {
            color: string;
            threshold: number;
            halo: number;
          };
        };
        start: number | 'auto';
        length: number | 'auto' | 'end';
        transition?: {
          in?: string;
          out?: string;
        };
        filter?: string;
        effect?: string;
        transform?: {
          scale?: number;
          rotate?: {
            angle: number;
          };
          skew?: {
            x: number;
            y: number;
          };
        };
        opacity?: number | Array<{
          from: number;
          to: number;
          start: number;
          length: number;
          interpolation?: 'linear' | 'bezier';
          easing?: string;
        }>;
        offset?: {
          x: number | Array<{
            from: number;
            to: number;
            start: number;
            length: number;
            interpolation?: 'linear' | 'bezier';
            easing?: string;
          }>;
          y: number | Array<{
            from: number;
            to: number;
            start: number;
            length: number;
            interpolation?: 'linear' | 'bezier';
            easing?: string;
          }>;
        };
        position?: string;
        fit?: 'cover' | 'contain' | 'fill' | 'fit' | 'none';
        scale?: number;
        volume?: number;
        alias?: string;
      }>;
    }>;
    fonts?: Array<{
      src: string;
    }>;
    cache?: boolean;
  };
  output: {
    format: 'mp4' | 'gif';
    resolution?: 'preview' | 'mobile' | 'sd' | 'hd' | '1080';
    size?: {
      width: number;
      height: number;
    };
    fps?: number;
    quality?: 'low' | 'medium' | 'high' | 'best';
  };
  merge?: Array<{
    find: string;
    replace: string;
  }>;
  callback?: string;
  destinations?: Array<{
    provider: 'shotstack' | 's3' | 'gcs' | 'azure';
    exclude?: boolean;
    region?: string;
    bucket?: string;
    prefix?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
  }>;
}

export interface ShotstackOutput {
  success: boolean;
  message: string;
  response: {
    message: string;
    id: string;
  };
}

export interface ShotstackRenderStatus {
  success: boolean;
  message: string;
  response: {
    id: string;
    owner: string;
    plan: string;
    status: 'queued' | 'fetching' | 'rendering' | 'saving' | 'done' | 'failed';
    url?: string;
    data?: any;
    created: string;
    updated: string;
    error?: string;
  };
}

export interface ShotstackOptions {
  environment?: 'stage' | 'v1';
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  onProgress?: (status: ShotstackRenderStatus) => void;
}

// Shotstack service executor
export const shotstackExecutor = createServiceExecutor<ShotstackInput, ShotstackOutput>(
  'shotstack' as ServiceType,
  async (input: ShotstackInput): Promise<ShotstackOutput> => {
    const environment = input.environment || 'stage';
    const baseUrl = environment === 'stage' 
      ? 'https://api.shotstack.io/stage' 
      : 'https://api.shotstack.io/v1';

    const response = await fetch(`${baseUrl}/edit/render`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.SHOTSTACK_API_KEY!,
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Shotstack API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data;
  },
  {
    validateInput: (input: ShotstackInput) => {
      return !!(input.timeline && input.timeline.tracks && input.output && input.output.format);
    }
  }
);

// Enhanced Shotstack executor with auto-correction
export async function executeShotstackWithAutoCorrection(
  input: ShotstackInput,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    enableFallback?: boolean;
    logLevel?: 'silent' | 'error' | 'warn' | 'info' | 'debug';
  } = {}
): Promise<{
  success: boolean;
  data?: ShotstackOutput;
  error?: string;
  service: string;
  attempts: number;
  fallbackUsed: boolean;
  processingTime: number;
}> {
  const { autoCorrector } = await import('../index');
  
  // Register the Shotstack executor if not already registered
  if (!autoCorrector['serviceExecutors'].has('shotstack')) {
    autoCorrector.registerService(shotstackExecutor);
  }

  const result = await autoCorrector.execute('shotstack', input, options);
  
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

// Utility function to extract render ID from Shotstack response
export function extractShotstackRenderId(response: ShotstackOutput): string {
  if (response.success && response.response?.id) {
    return response.response.id;
  }
  throw new Error(`Invalid Shotstack response format: ${JSON.stringify(response)}`);
}

// Utility function to check if Shotstack response is successful
export function isShotstackSuccessful(response: ShotstackOutput): boolean {
  return response.success === true;
}

// Utility function to get render status
export async function getShotstackRenderStatus(
  renderId: string,
  environment: 'stage' | 'v1' = 'stage'
): Promise<ShotstackRenderStatus> {
  const baseUrl = environment === 'stage' 
    ? 'https://api.shotstack.io/stage' 
    : 'https://api.shotstack.io/v1';

  const response = await fetch(`${baseUrl}/edit/render/${renderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.SHOTSTACK_API_KEY!,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Shotstack API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
  }

  return await response.json();
}

// Utility function to poll for render completion
export async function pollShotstackRender(
  renderId: string,
  options: {
    maxAttempts?: number;
    pollInterval?: number;
    timeout?: number;
    environment?: 'stage' | 'v1';
    onProgress?: (status: ShotstackRenderStatus) => void;
  } = {}
): Promise<ShotstackRenderStatus> {
  const maxAttempts = options.maxAttempts || 60;
  const pollInterval = options.pollInterval || 2000;
  const timeout = options.timeout || 300000; // 5 minutes
  const environment = options.environment || 'stage';

  const startTime = Date.now();

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Check timeout
    if (Date.now() - startTime > timeout) {
      throw new Error('Shotstack render polling timeout exceeded');
    }

    try {
      const status = await getShotstackRenderStatus(renderId, environment);
      
      // Call progress callback if provided
      if (options.onProgress) {
        options.onProgress(status);
      }

      // Check if render is complete
      if (status.response.status === 'done') {
        return status;
      }

      // Check if render failed
      if (status.response.status === 'failed') {
        throw new Error(`Shotstack render failed: ${status.response.error || 'Unknown error'}`);
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    } catch (error) {
      if (attempt === maxAttempts - 1) {
        throw error;
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
  }

  throw new Error('Maximum Shotstack polling attempts exceeded');
}

// Utility function to render video and wait for completion
export async function renderShotstackVideoAndWait(
  input: ShotstackInput,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    enableFallback?: boolean;
    logLevel?: 'silent' | 'error' | 'warn' | 'info' | 'debug';
    maxAttempts?: number;
    pollInterval?: number;
    timeout?: number;
    onProgress?: (status: ShotstackRenderStatus) => void;
  } = {}
): Promise<ShotstackRenderStatus> {
  // Start the render
  const renderResult = await executeShotstackWithAutoCorrection(input, options);
  
  if (!renderResult.success || !renderResult.data) {
    throw new Error(`Failed to start Shotstack render: ${renderResult.error}`);
  }

  const renderId = extractShotstackRenderId(renderResult.data);
  
  // Poll for completion
  return await pollShotstackRender(renderId, {
    maxAttempts: options.maxAttempts,
    pollInterval: options.pollInterval,
    timeout: options.timeout,
    environment: input.environment || 'stage',
    onProgress: options.onProgress,
  });
}
