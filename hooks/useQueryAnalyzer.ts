import { useState, useCallback } from 'react';
import { z } from 'zod';

// Types for the query analyzer
export interface MediaAsset {
  id?: string;
  url: string;
  mediaType: 'image' | 'video' | 'audio';
  metadata?: Record<string, any>;
}

export interface QueryAnalyzerRequest {
  query: string;
  assets: MediaAsset[];
  intent?: 'image' | 'video' | 'audio' | 'mix';
  outputImages?: number;
  outputVideoSeconds?: number;
  preferences?: {
    aspect_ratio?: string;
    platform_target?: string;
  };
}

export interface BriefPackage {
  briefId: string;
  createdAt: string;
  request: QueryAnalyzerRequest;
  analysis?: {
    vision?: Record<string, any>;
    video?: Record<string, any>;
    audio?: Record<string, any>;
  };
  plan?: {
    assetProcessing: Record<string, string[]>;
    creativeOptions: any[];
    stockSearchCandidates?: any[];
    costEstimate?: number;
  };
  status: 'analyzed' | 'queued' | 'processing' | 'done' | 'failed';
  // New comprehensive format
  brief?: {
    id: string;
    createdAt: string;
    userId: string;
    userPrompt: string;
    intent: string;
    options: {
      durationSeconds?: number;
      aspectRatio?: string;
      imageCount?: number;
      budget?: number | null;
    };
    assets: any[];
    globalAnalysis: any;
    creativeOptions: any[];
    recommendedPipeline: any;
    warnings: any[];
    metadata: any;
  };
}

export interface QueryAnalyzerResponse {
  success: boolean;
  brief?: BriefPackage;
  error?: string;
  details?: any;
}

export interface UseQueryAnalyzerReturn {
  analyzeQuery: (request: QueryAnalyzerRequest) => Promise<QueryAnalyzerResponse>;
  isLoading: boolean;
  error: string | null;
  lastBrief: BriefPackage | null;
}

export function useQueryAnalyzer(): UseQueryAnalyzerReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastBrief, setLastBrief] = useState<BriefPackage | null>(null);

  const analyzeQuery = useCallback(async (request: QueryAnalyzerRequest): Promise<QueryAnalyzerResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate the request
      const requestSchema = z.object({
        query: z.string().min(1),
        assets: z.array(
          z.object({
            id: z.string().optional(),
            url: z.string().url(),
            mediaType: z.enum(['image', 'video', 'audio']),
            metadata: z.record(z.any()).optional(),
          })
        ).min(0),
        intent: z.enum(['image', 'video', 'audio', 'mix']).optional(),
        outputImages: z.number().int().min(1).max(20).optional(),
        outputVideoSeconds: z.number().int().min(5).max(180).optional(),
        preferences: z.object({
          aspect_ratio: z.string().optional(),
          platform_target: z.string().optional(),
        }).optional(),
        budget_credits: z.number().optional(),
      });

      const validation = requestSchema.safeParse(request);
      if (!validation.success) {
        const errorMessage = 'Invalid request format';
        setError(errorMessage);
        return { success: false, error: errorMessage, details: validation.error.format() };
      }

      // Make the API call
      const response = await fetch('/api/dreamcut/query-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validation.data),
      });

      const data: QueryAnalyzerResponse = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || `HTTP ${response.status}: ${response.statusText}`;
        setError(errorMessage);
        return { success: false, error: errorMessage, details: data.details };
      }

      if (data.success && data.brief) {
        setLastBrief(data.brief);
        return data;
      } else {
        const errorMessage = data.error || 'Analysis failed';
        setError(errorMessage);
        return { success: false, error: errorMessage, details: data.details };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    analyzeQuery,
    isLoading,
    error,
    lastBrief,
  };
}
