import { useState, useCallback } from 'react';

export interface ImageAnalysisInput {
  imageUrl: string;
  prompt: string;
  userDescription?: string;
  analysisType?: 'visual_qa' | 'object_detection' | 'text_recognition' | 'scene_analysis' | 'creative_tasks' | 'problem_solving' | 'content_summarization' | 'educational' | 'marketing' | 'medical' | 'custom';
}

export interface ImageAnalysisResult {
  success: boolean;
  analysis?: string;
  model?: string;
  fallbackUsed?: boolean;
  processingTime?: number;
  error?: string;
}

export interface BatchImageAnalysisInput {
  images: Array<{
    imageUrl: string;
    prompt: string;
    userDescription?: string;
    analysisType?: 'visual_qa' | 'object_detection' | 'text_recognition' | 'scene_analysis' | 'creative_tasks' | 'problem_solving' | 'content_summarization' | 'educational' | 'marketing' | 'medical' | 'custom';
  }>;
}

export interface BatchImageAnalysisResult {
  success: boolean;
  results?: ImageAnalysisResult[];
  summary?: {
    total: number;
    successful: number;
    failed: number;
    averageProcessingTime: number;
  };
  error?: string;
}

export interface ImageAnalyzerOptions {
  timeout?: number;
  enableFallback?: boolean;
  logLevel?: 'silent' | 'error' | 'warn' | 'info' | 'debug';
}

export interface ImageModel {
  name: string;
  priority: number;
  capabilities: string[];
  description: string;
  performance: string;
}

export interface ModelRecommendation {
  name: string;
  priority: number;
  description: string;
  performance: string;
}

export function useImageAnalyzer() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeImage = useCallback(async (
    input: ImageAnalysisInput,
    options: ImageAnalyzerOptions = {}
  ): Promise<ImageAnalysisResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/dreamcut/image-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...input,
          ...options
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Image analysis failed');
      }

      if (!data.success) {
        throw new Error(data.error || 'Image analysis failed');
      }

      return {
        success: true,
        analysis: data.result.result,
        model: data.result.model,
        fallbackUsed: data.result.fallbackUsed,
        processingTime: data.result.processingTime
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeImages = useCallback(async (
    input: BatchImageAnalysisInput,
    options: ImageAnalyzerOptions = {}
  ): Promise<BatchImageAnalysisResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/dreamcut/image-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: input.images,
          ...options
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Batch image analysis failed');
      }

      if (!data.success) {
        throw new Error(data.error || 'Batch image analysis failed');
      }

      return {
        success: true,
        results: data.results.map((result: any) => ({
          success: result.success,
          analysis: result.result,
          model: result.model,
          fallbackUsed: result.fallbackUsed,
          processingTime: result.processingTime,
          error: result.error
        })),
        summary: data.summary
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAvailableModels = useCallback(async (): Promise<ImageModel[]> => {
    try {
      const response = await fetch('/api/dreamcut/image-analyzer?action=models');
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch models');
      }

      return data.models;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return [];
    }
  }, []);

  const getModelRecommendations = useCallback(async (
    analysisType: string
  ): Promise<ModelRecommendation[]> => {
    try {
      const response = await fetch(
        `/api/dreamcut/image-analyzer?action=recommendations&analysisType=${encodeURIComponent(analysisType)}`
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch recommendations');
      }

      return data.recommendations;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return [];
    }
  }, []);

  const createAnalysisScenario = useCallback(async (
    scenarioType: string,
    customImageUrl?: string,
    customPrompt?: string
  ) => {
    try {
      const params = new URLSearchParams({
        action: 'scenarios',
        scenarioType
      });

      if (customImageUrl) params.append('customImageUrl', customImageUrl);
      if (customPrompt) params.append('customPrompt', customPrompt);

      const response = await fetch(`/api/dreamcut/image-analyzer?${params}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create scenario');
      }

      return data.scenario;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isLoading,
    error,
    
    // Actions
    analyzeImage,
    analyzeImages,
    getAvailableModels,
    getModelRecommendations,
    createAnalysisScenario,
    clearError
  };
}
