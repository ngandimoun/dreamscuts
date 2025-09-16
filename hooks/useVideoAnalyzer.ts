import { useState, useCallback } from 'react';

export interface VideoAnalysisInput {
  videoUrl: string;
  prompt: string;
  userDescription?: string;
  analysisType?: 'content_analysis' | 'scene_analysis' | 'activity_recognition' | 'question_answering' | 'summarization' | 'educational' | 'entertainment' | 'sports' | 'cooking' | 'custom';
}

export interface VideoAnalysisResult {
  success: boolean;
  analysis?: string;
  model?: string;
  fallbackUsed?: boolean;
  processingTime?: number;
  error?: string;
}

export interface BatchVideoAnalysisInput {
  videos: Array<{
    videoUrl: string;
    prompt: string;
    userDescription?: string;
    analysisType?: 'content_analysis' | 'scene_analysis' | 'activity_recognition' | 'question_answering' | 'summarization' | 'educational' | 'entertainment' | 'sports' | 'cooking' | 'custom';
  }>;
}

export interface BatchVideoAnalysisResult {
  success: boolean;
  results?: Array<{
    success: boolean;
    analysis?: string;
    model?: string;
    fallbackUsed?: boolean;
    processingTime?: number;
    error?: string;
  }>;
  summary?: {
    total: number;
    successful: number;
    failed: number;
    modelsUsed: string[];
    averageProcessingTime: number;
  };
  error?: string;
}

export interface VideoAnalyzerOptions {
  maxRetries?: number;
  timeout?: number;
  enableFallback?: boolean;
  logLevel?: 'silent' | 'error' | 'warn' | 'info' | 'debug';
}

export interface UseVideoAnalyzerReturn {
  // State
  isLoading: boolean;
  error: string | null;
  lastResult: VideoAnalysisResult | null;
  lastBatchResult: BatchVideoAnalysisResult | null;
  
  // Actions
  analyzeVideo: (input: VideoAnalysisInput, options?: VideoAnalyzerOptions) => Promise<VideoAnalysisResult>;
  analyzeVideos: (input: BatchVideoAnalysisInput, options?: VideoAnalyzerOptions) => Promise<BatchVideoAnalysisResult>;
  clearError: () => void;
  clearResults: () => void;
  
  // Utility
  validateVideoUrl: (url: string) => { isValid: boolean; error?: string };
}

export function useVideoAnalyzer(): UseVideoAnalyzerReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<VideoAnalysisResult | null>(null);
  const [lastBatchResult, setLastBatchResult] = useState<BatchVideoAnalysisResult | null>(null);

  const validateVideoUrl = useCallback((url: string): { isValid: boolean; error?: string } => {
    if (!url || typeof url !== 'string') {
      return { isValid: false, error: 'Video URL is required' };
    }

    try {
      new URL(url);
    } catch {
      return { isValid: false, error: 'Invalid URL format' };
    }

    const videoExtensions = ['.mp4', '.avi', '.mov', '.webm', '.mkv', '.m4v', '.gif'];
    const hasValidExtension = videoExtensions.some(ext => 
      url.toLowerCase().includes(ext)
    );

    if (!hasValidExtension) {
      return { 
        isValid: false, 
        error: `Video must be in supported format: ${videoExtensions.join(', ')}` 
      };
    }

    return { isValid: true };
  }, []);

  const analyzeVideo = useCallback(async (
    input: VideoAnalysisInput, 
    options: VideoAnalyzerOptions = {}
  ): Promise<VideoAnalysisResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate input
      const validation = validateVideoUrl(input.videoUrl);
      if (!validation.isValid) {
        const errorResult = { success: false, error: validation.error };
        setError(validation.error || 'Invalid video URL');
        setLastResult(errorResult);
        return errorResult;
      }

      const response = await fetch('/api/dreamcut/video-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoUrl: input.videoUrl,
          prompt: input.prompt,
          userDescription: input.userDescription,
          analysisType: input.analysisType || 'content_analysis',
          maxRetries: options.maxRetries || 3,
          timeout: options.timeout || 30000,
          enableFallback: options.enableFallback !== false,
          logLevel: options.logLevel || 'info'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorResult = { 
          success: false, 
          error: data.message || data.error || 'Analysis failed' 
        };
        setError(errorResult.error);
        setLastResult(errorResult);
        return errorResult;
      }

      const result: VideoAnalysisResult = {
        success: data.success,
        analysis: data.result?.analysis,
        model: data.result?.model,
        fallbackUsed: data.result?.fallbackUsed,
        processingTime: data.result?.processingTime,
        error: data.error
      };

      setLastResult(result);
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      const errorResult = { success: false, error: errorMessage };
      setError(errorMessage);
      setLastResult(errorResult);
      return errorResult;
    } finally {
      setIsLoading(false);
    }
  }, [validateVideoUrl]);

  const analyzeVideos = useCallback(async (
    input: BatchVideoAnalysisInput, 
    options: VideoAnalyzerOptions = {}
  ): Promise<BatchVideoAnalysisResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate all video URLs
      for (const video of input.videos) {
        const validation = validateVideoUrl(video.videoUrl);
        if (!validation.isValid) {
          const errorResult = { 
            success: false, 
            error: `Invalid video URL: ${video.videoUrl} - ${validation.error}` 
          };
          setError(errorResult.error);
          setLastBatchResult(errorResult);
          return errorResult;
        }
      }

      const response = await fetch('/api/dreamcut/video-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videos: input.videos.map(video => ({
            videoUrl: video.videoUrl,
            prompt: video.prompt,
            userDescription: video.userDescription,
            analysisType: video.analysisType || 'content_analysis'
          })),
          maxRetries: options.maxRetries || 3,
          timeout: options.timeout || 30000,
          enableFallback: options.enableFallback !== false,
          logLevel: options.logLevel || 'info'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorResult = { 
          success: false, 
          error: data.message || data.error || 'Batch analysis failed' 
        };
        setError(errorResult.error);
        setLastBatchResult(errorResult);
        return errorResult;
      }

      const result: BatchVideoAnalysisResult = {
        success: data.success,
        results: data.results,
        summary: data.summary,
        error: data.error
      };

      setLastBatchResult(result);
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      const errorResult = { success: false, error: errorMessage };
      setError(errorMessage);
      setLastBatchResult(errorResult);
      return errorResult;
    } finally {
      setIsLoading(false);
    }
  }, [validateVideoUrl]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearResults = useCallback(() => {
    setLastResult(null);
    setLastBatchResult(null);
    setError(null);
  }, []);

  return {
    // State
    isLoading,
    error,
    lastResult,
    lastBatchResult,
    
    // Actions
    analyzeVideo,
    analyzeVideos,
    clearError,
    clearResults,
    
    // Utility
    validateVideoUrl
  };
}

export default useVideoAnalyzer;
