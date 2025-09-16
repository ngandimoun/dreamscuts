import { useState, useCallback } from 'react';

export interface TextAnalysisInput {
  text: string;
  prompt: string;
  userDescription?: string;
  analysisType?: 'sentiment_analysis' | 'content_summarization' | 'language_detection' | 'keyword_extraction' | 'topic_modeling' | 'text_classification' | 'named_entity_recognition' | 'intent_analysis' | 'readability_analysis' | 'translation' | 'paraphrasing' | 'creative_writing' | 'technical_analysis' | 'educational_content' | 'marketing_analysis' | 'legal_analysis' | 'medical_analysis' | 'custom';
}

export interface TextAnalysisResult {
  success: boolean;
  analysis?: string;
  model?: string;
  fallbackUsed?: boolean;
  processingTime?: number;
  error?: string;
}

export interface BatchTextAnalysisInput {
  texts: Array<{
    text: string;
    prompt: string;
    userDescription?: string;
    analysisType?: 'sentiment_analysis' | 'content_summarization' | 'language_detection' | 'keyword_extraction' | 'topic_modeling' | 'text_classification' | 'named_entity_recognition' | 'intent_analysis' | 'readability_analysis' | 'translation' | 'paraphrasing' | 'creative_writing' | 'technical_analysis' | 'educational_content' | 'marketing_analysis' | 'legal_analysis' | 'medical_analysis' | 'custom';
  }>;
}

export interface BatchTextAnalysisResult {
  success: boolean;
  results?: TextAnalysisResult[];
  summary?: {
    total: number;
    successful: number;
    failed: number;
    averageProcessingTime: number;
  };
  error?: string;
}

export interface TextAnalyzerOptions {
  timeout?: number;
  enableFallback?: boolean;
  logLevel?: 'silent' | 'error' | 'warn' | 'info' | 'debug';
}

export interface TextModel {
  name: string;
  priority: number;
  capabilities: string[];
  description: string;
  performance: string;
}

export interface TextModelRecommendation {
  name: string;
  priority: number;
  description: string;
  performance: string;
}

export function useTextAnalyzer() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeText = useCallback(async (
    input: TextAnalysisInput,
    options: TextAnalyzerOptions = {}
  ): Promise<TextAnalysisResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/dreamcut/text-analyzer', {
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
        throw new Error(data.error || 'Text analysis failed');
      }

      if (!data.success) {
        throw new Error(data.error || 'Text analysis failed');
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

  const analyzeTexts = useCallback(async (
    input: BatchTextAnalysisInput,
    options: TextAnalyzerOptions = {}
  ): Promise<BatchTextAnalysisResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/dreamcut/text-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texts: input.texts,
          ...options
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Batch text analysis failed');
      }

      if (!data.success) {
        throw new Error(data.error || 'Batch text analysis failed');
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

  const getAvailableModels = useCallback(async (): Promise<TextModel[]> => {
    try {
      const response = await fetch('/api/dreamcut/text-analyzer?action=models');
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
  ): Promise<TextModelRecommendation[]> => {
    try {
      const response = await fetch(
        `/api/dreamcut/text-analyzer?action=recommendations&analysisType=${encodeURIComponent(analysisType)}`
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
    customText?: string,
    customPrompt?: string
  ) => {
    try {
      const params = new URLSearchParams({
        action: 'scenarios',
        scenarioType
      });

      if (customText) params.append('customText', customText);
      if (customPrompt) params.append('customPrompt', customPrompt);

      const response = await fetch(`/api/dreamcut/text-analyzer?${params}`);
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
    analyzeText,
    analyzeTexts,
    getAvailableModels,
    getModelRecommendations,
    createAnalysisScenario,
    clearError
  };
}
