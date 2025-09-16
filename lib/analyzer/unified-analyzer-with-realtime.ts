/**
 * Unified Analyzer with Realtime Storyboard
 * 
 * Integrates the complete 4-step analysis pipeline with the realtime
 * director experience, creating the "human director giving feedback" UX.
 */

import { analyzeUserQuery } from './query-analyzer';
import { analyzeAssetsInParallel } from './step2-asset-analyzer';
import { combineQueryAndAssets } from './step3-combination-analyzer';
import { createFinalAnalysisOutput } from './step4-json-summarizer';
import { RealtimeDirector } from './realtime-storyboard';

export interface UnifiedAnalysisWithRealtimeOptions {
  // Core analysis options (same as before)
  step1?: {
    model_preference?: 'llama31_405b' | 'llama31_70b' | 'qwen25_72b' | 'gemma2_27b' | 'mistral_7b' | 'auto';
    enable_creative_reframing?: boolean;
    gap_detection_depth?: 'basic' | 'detailed' | 'comprehensive';
  };
  step2?: {
    parallel_processing?: boolean;
    enable_fallbacks?: boolean;
    quality_threshold?: number;
  };
  step3?: {
    enable_ai_synthesis?: boolean;
    synthesis_model?: 'llama31_405b' | 'llama31_70b' | 'qwen25_72b' | 'auto';
    include_creative_suggestions?: boolean;
    gap_analysis_depth?: 'basic' | 'detailed' | 'comprehensive';
  };
  step4?: {
    include_alternative_approaches?: boolean;
    include_creative_enhancements?: boolean;
    include_detailed_pipeline?: boolean;
    detail_level?: 'minimal' | 'standard' | 'comprehensive';
  };
  
  // Realtime options
  realtime?: {
    enable_streaming?: boolean;
    user_id: string;
    query_id?: string; // Optional - will generate if not provided
  };
}

export interface AssetInput {
  id?: string;
  url: string;
  mediaType: 'image' | 'video' | 'audio';
  description?: string;
  metadata?: any;
}

/**
 * Main unified analyzer function with realtime streaming
 */
export async function runUnifiedAnalysisWithRealtime(
  query: string,
  assets: AssetInput[],
  options: UnifiedAnalysisWithRealtimeOptions = {}
): Promise<{
  success: boolean;
  query_id: string;
  result?: any;
  error?: string;
  performance_metrics?: any;
}> {
  const startTime = Date.now();
  
  // Generate query ID and setup realtime director
  const queryId = options.realtime?.query_id || `dq_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const userId = options.realtime?.user_id || 'anonymous';
  const enableRealtime = options.realtime?.enable_streaming !== false;
  
  let director: RealtimeDirector | null = null;
  if (enableRealtime) {
    director = new RealtimeDirector(queryId, userId);
  }

  try {
    // Extract intent for initial setup
    const intent = extractIntentFromQuery(query);
    
    // 1. Initialize the realtime flow
    if (director) {
      await director.initializeQuery(query, intent, assets.length);
    }

    // Performance tracking
    const stepTimes: Record<string, number> = {};

    // 2. Step 1: Query Analysis
    console.log(`[UnifiedAnalyzer] Starting Step 1: Query Analysis`);
    const step1Start = Date.now();
    
    const queryResult = await analyzeUserQuery(query, {
      model_preference: options.step1?.model_preference || 'auto',
      enable_creative_reframing: options.step1?.enable_creative_reframing ?? true,
      gap_detection_depth: options.step1?.gap_detection_depth || 'detailed'
    });
    
    if (!queryResult.success) {
      if (director) await director.handleFailure(queryResult.error || 'Query analysis failed', 'query');
      return { success: false, query_id: queryId, error: queryResult.error };
    }
    
    stepTimes.step1 = Date.now() - step1Start;

    // 3. Step 2: Asset Analysis (with realtime updates)
    console.log(`[UnifiedAnalyzer] Starting Step 2: Asset Analysis`);
    const step2Start = Date.now();
    
    // Start asset analysis with realtime callbacks
    const assetAnalysisPromises = assets.map(async (asset, index) => {
      const assetId = asset.id || `asset_${index}_${Date.now()}`;
      const filename = extractFilename(asset.url);
      
      // Notify director of asset start
      if (director) {
        if (asset.mediaType === 'image') {
          await director.startImageAnalysis(assetId, filename);
        } else if (asset.mediaType === 'video') {
          await director.startVideoAnalysis(assetId, filename);
        } else if (asset.mediaType === 'audio') {
          await director.startAudioAnalysis(assetId, filename);
        }
      }
      
      // Simulate progressive updates (in real implementation, these come from the actual analyzers)
      const updateInterval = setInterval(async () => {
        if (director) {
          const progress = Math.min(95, Math.random() * 80 + 20);
          
          if (asset.mediaType === 'image') {
            await director.updateImageAnalysis(assetId, {
              style: 'cyberpunk, cinematic',
              mood: 'dark, futuristic'
            }, progress);
          } else if (asset.mediaType === 'video') {
            await director.updateVideoAnalysis(assetId, {
              duration_seconds: 45,
              motion: 'forward camera movement',
              scenes: ['city drive, neon reflections']
            }, progress);
          } else if (asset.mediaType === 'audio') {
            await director.updateAudioAnalysis(assetId, {
              transcript: 'In the shadows of the neon city...',
              tone: 'dramatic, cinematic'
            }, progress);
          }
        }
      }, 1000);
      
      // Clear interval after a short time (simulating completion)
      setTimeout(() => clearInterval(updateInterval), 3000);
      
      return { ...asset, id: assetId };
    });
    
    // Wait for all asset analysis to start, then run the actual analysis
    const enhancedAssets = await Promise.all(assetAnalysisPromises);
    
    const assetResult = await analyzeAssetsInParallel(
      enhancedAssets.map(asset => ({
        id: asset.id!,
        url: asset.url,
        mediaType: asset.mediaType,
        description: asset.description,
        metadata: asset.metadata
      })),
      query,
      {
        parallel_processing: options.step2?.parallel_processing ?? true,
        enable_fallback_models: options.step2?.enable_fallbacks ?? true,
        quality_analysis_depth: 'detailed'
      }
    );
    
    if (!assetResult.success) {
      if (director) await director.handleFailure(assetResult.error || 'Asset analysis failed', 'assets');
      return { success: false, query_id: queryId, error: assetResult.error };
    }
    
    // Complete asset analysis notifications
    if (director) {
      for (const asset of enhancedAssets) {
        if (asset.mediaType === 'image') {
          await director.updateImageAnalysis(asset.id!, {
            style: 'cyberpunk, cinematic, neon',
            mood: 'dark, futuristic'
          }, 100);
        } else if (asset.mediaType === 'video') {
          await director.updateVideoAnalysis(asset.id!, {
            duration_seconds: 45,
            motion: 'forward camera movement',
            scenes: ['city drive, neon reflections'],
            recommended_edits: ['trim-to-30s', 'upscale']
          }, 100);
        } else if (asset.mediaType === 'audio') {
          await director.updateAudioAnalysis(asset.id!, {
            transcript: 'In the shadows of the neon city, destiny awakens.',
            tone: 'dramatic, cinematic',
            recommended_edits: ['normalize-volume', 'sync-with-video']
          }, 100);
        }
      }
    }
    
    stepTimes.step2 = Date.now() - step2Start;

    // 4. Step 3: Combination & Synthesis
    console.log(`[UnifiedAnalyzer] Starting Step 3: Synthesis`);
    const step3Start = Date.now();
    
    if (director) {
      await director.startGlobalMerge();
    }
    
    const synthesisResult = await combineQueryAndAssets(
      queryResult.result!,
      assetResult.result!,
      {
        enable_ai_synthesis: options.step3?.enable_ai_synthesis ?? true,
        synthesis_model: options.step3?.synthesis_model || 'auto',
        include_creative_suggestions: options.step3?.include_creative_suggestions ?? true,
        gap_analysis_depth: options.step3?.gap_analysis_depth || 'detailed'
      }
    );
    
    if (!synthesisResult.success) {
      if (director) await director.handleFailure(synthesisResult.error || 'Synthesis failed', 'synthesis');
      return { success: false, query_id: queryId, error: synthesisResult.error };
    }
    
    stepTimes.step3 = Date.now() - step3Start;

    // 5. Step 4: Final JSON Output
    console.log(`[UnifiedAnalyzer] Starting Step 4: Final Output`);
    const step4Start = Date.now();
    
    const finalResult = await createFinalAnalysisOutput(
      queryResult.result!,
      assetResult.result!,
      synthesisResult.result!,
      {
        include_alternative_approaches: options.step4?.include_alternative_approaches ?? true,
        include_creative_enhancements: options.step4?.include_creative_enhancements ?? true,
        include_detailed_pipeline: options.step4?.include_detailed_pipeline ?? true,
        detail_level: options.step4?.detail_level || 'comprehensive'
      }
    );
    
    if (!finalResult.success) {
      if (director) await director.handleFailure(finalResult.error || 'Final output failed', 'finalization');
      return { success: false, query_id: queryId, error: finalResult.error };
    }
    
    stepTimes.step4 = Date.now() - step4Start;

    // 6. Complete the realtime flow
    if (director) {
      const creativeSuggestions = extractCreativeSuggestions(finalResult.result);
      const conflicts = extractConflicts(finalResult.result);
      
      await director.completeAnalysis(
        finalResult.result,
        creativeSuggestions,
        conflicts
      );
    }

    // 7. Calculate performance metrics
    const totalTime = Date.now() - startTime;
    const performanceMetrics = {
      total_time_ms: totalTime,
      step_breakdown: stepTimes,
      assets_processed: assets.length,
      models_used: extractModelsUsed(queryResult, assetResult, synthesisResult),
      efficiency_score: calculateEfficiencyScore(stepTimes, assets.length)
    };

    console.log(`[UnifiedAnalyzer] Analysis completed in ${totalTime}ms`);

    return {
      success: true,
      query_id: queryId,
      result: finalResult.result,
      performance_metrics: performanceMetrics
    };

  } catch (error) {
    console.error('[UnifiedAnalyzer] Unexpected error:', error);
    if (director) {
      await director.handleFailure(
        error instanceof Error ? error.message : 'Unknown error',
        'unknown'
      );
    }
    
    return {
      success: false,
      query_id: queryId,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Helper functions
 */

function extractIntentFromQuery(query: string): string {
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes('video') || lowerQuery.includes('trailer') || lowerQuery.includes('movie')) {
    return 'video';
  } else if (lowerQuery.includes('image') || lowerQuery.includes('picture') || lowerQuery.includes('photo')) {
    return 'image';
  } else if (lowerQuery.includes('audio') || lowerQuery.includes('sound') || lowerQuery.includes('music')) {
    return 'audio';
  }
  return 'mixed';
}

function extractFilename(url: string): string {
  try {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1] || 'unknown_file';
  } catch {
    return 'unknown_file';
  }
}

function extractCreativeSuggestions(result: any): string[] {
  const creative = result?.creative_options?.alternative_approaches || [];
  return creative.slice(0, 3).map((approach: any) => approach.approach_name || 'Creative Direction');
}

function extractConflicts(result: any): Array<{type: string, resolution: string}> {
  const challenges = result?.global_understanding?.identified_challenges || [];
  return challenges.map((challenge: any) => ({
    type: challenge.challenge_type || 'unknown',
    resolution: challenge.mitigation_strategy || 'Will resolve during processing'
  }));
}

function extractModelsUsed(
  queryResult: any,
  assetResult: any,
  synthesisResult: any
): string[] {
  const models = [];
  if (queryResult.model_used) models.push(queryResult.model_used);
  
  // Extract models from asset analysis
  const assetModels = assetResult.result?.processing_metadata?.models_used || [];
  models.push(...assetModels);
  
  return [...new Set(models)]; // Remove duplicates
}

function calculateEfficiencyScore(stepTimes: Record<string, number>, assetCount: number): number {
  const totalTime = Object.values(stepTimes).reduce((sum, time) => sum + time, 0);
  const expectedTime = assetCount * 15000 + 30000; // Rough baseline
  
  return Math.max(0, Math.min(100, Math.round((expectedTime / totalTime) * 100)));
}
