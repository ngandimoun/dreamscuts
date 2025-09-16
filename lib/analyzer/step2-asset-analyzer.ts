/**
 * Step 2: Asset Analysis Module
 * 
 * Analyzes each media asset individually in parallel:
 * - Image assets: metadata, content detection, quality assessment
 * - Video assets: metadata, scene breakdown, content analysis
 * - Audio assets: transcription, content analysis, metadata
 * 
 * Features:
 * - Parallel processing for maximum efficiency
 * - Multiple model fallbacks for reliability
 * - Comprehensive analysis with structured output
 * - Support for various media formats
 */

import { z } from 'zod';

// Import Replicate model executors for images
import { executeReplicateLLaVA13B, createImageAnalysisPrompt } from '../../executors/replicate-llava-13b';
import { executeReplicateBLIP, comprehensiveImageAnalysisWithBLIP } from '../../executors/replicate-blip';
import { executeReplicateMoondream2, comprehensiveImageAnalysisWithMoondream2 } from '../../executors/replicate-moondream2';

// Import Replicate model executors for videos
import { executeReplicateApollo7B, comprehensiveVideoAnalysisWithApollo7B } from '../../executors/replicate-apollo-7b';
import { executeReplicateQwen25Omni7B, comprehensiveOmniVideoAnalysis } from '../../executors/replicate-qwen2-5-omni-7b';

// Import Replicate model executors for audio
import { executeReplicateWhisperLargeV3, comprehensiveAudioAnalysisWithWhisper } from '../../executors/replicate-whisper-large-v3';

// Import helper functions for asset analysis
import { analyzeImageAsset, analyzeVideoAsset, analyzeAudioAsset } from './step2-asset-analysis-helpers';

// Asset analysis schemas
export const AssetMetadataSchema = z.object({
  file_size: z.number().optional(),
  format: z.string().optional(),
  duration_seconds: z.number().optional(),
  dimensions: z.object({
    width: z.number(),
    height: z.number()
  }).optional(),
  resolution: z.string().optional(),
  fps: z.number().optional(),
  sample_rate: z.number().optional(),
  channels: z.number().optional(),
  bitrate: z.number().optional(),
  quality_score: z.number().min(0).max(10).optional()
});

export const AssetContentAnalysisSchema = z.object({
  primary_description: z.string(),
  detailed_analysis: z.string(),
  objects_detected: z.array(z.string()).optional(),
  scenes_identified: z.array(z.string()).optional(),
  text_content: z.string().optional(),
  audio_content: z.string().optional(),
  transcription: z.string().optional(),
  mood_assessment: z.string().optional(),
  style_analysis: z.string().optional(),
  quality_assessment: z.string().optional(),
  technical_notes: z.array(z.string()).optional(),
  creative_potential: z.string().optional()
});

export const AssetAlignmentSchema = z.object({
  supports_query_intent: z.boolean(),
  alignment_score: z.number().min(0).max(1),
  role_in_project: z.enum(['primary_content', 'reference_material', 'supporting_element', 'background', 'enhancement_target', 'unclear']),
  usage_recommendations: z.array(z.string()),
  conflicts_or_issues: z.array(z.string()).optional(),
  enhancement_suggestions: z.array(z.string()).optional()
});

export const AssetNeedsSchema = z.object({
  requires_upscaling: z.boolean(),
  requires_enhancement: z.boolean(),
  requires_background_removal: z.boolean(),
  requires_style_transfer: z.boolean(),
  requires_format_conversion: z.boolean(),
  requires_trimming: z.boolean(),
  requires_noise_reduction: z.boolean(),
  requires_voice_cloning: z.boolean(),
  priority_level: z.enum(['high', 'medium', 'low']),
  estimated_processing_time: z.string().optional(),
  recommended_tools: z.array(z.string()).optional()
});

export const AssetAnalysisResultSchema = z.object({
  asset_id: z.string(),
  asset_url: z.string(),
  asset_type: z.enum(['image', 'video', 'audio', 'text']),
  user_description: z.string().optional(),
  
  // Core analysis
  metadata: AssetMetadataSchema,
  content_analysis: AssetContentAnalysisSchema,
  alignment_with_query: AssetAlignmentSchema,
  processing_needs: AssetNeedsSchema,
  
  // Processing metadata
  processing_info: z.object({
    models_used: z.array(z.string()),
    processing_time_ms: z.number(),
    analysis_timestamp: z.string(),
    success: z.boolean(),
    confidence_score: z.number().min(0).max(1),
    fallback_used: z.boolean(),
    error_messages: z.array(z.string()).optional()
  })
});

export const Step2AnalysisResultSchema = z.object({
  analysis_id: z.string(),
  total_assets: z.number(),
  successful_analyses: z.number(),
  failed_analyses: z.number(),
  total_processing_time_ms: z.number(),
  
  // Individual asset results
  asset_analyses: z.array(AssetAnalysisResultSchema),
  
  // Summary insights
  summary: z.object({
    asset_type_breakdown: z.record(z.string(), z.number()),
    overall_quality_score: z.number().min(0).max(10),
    primary_content_assets: z.array(z.string()),
    reference_material_assets: z.array(z.string()),
    enhancement_needed_assets: z.array(z.string()),
    high_priority_processing: z.array(z.string()),
    alignment_insights: z.array(z.string()),
    technical_recommendations: z.array(z.string())
  }),
  
  // Processing metadata
  processing_metadata: z.object({
    analysis_timestamp: z.string(),
    parallel_processing_used: z.boolean(),
    models_available: z.record(z.string(), z.boolean()),
    performance_metrics: z.object({
      avg_processing_time_per_asset: z.number(),
      fastest_analysis_ms: z.number(),
      slowest_analysis_ms: z.number(),
      success_rate: z.number().min(0).max(1)
    })
  })
});

export type AssetAnalysisResult = z.infer<typeof AssetAnalysisResultSchema>;
export type Step2AnalysisResult = z.infer<typeof Step2AnalysisResultSchema>;

interface AssetAnalysisOptions {
  enable_fallback_models?: boolean;
  parallel_processing?: boolean;
  max_concurrent_analyses?: number;
  timeout_per_asset?: number;
  include_creative_analysis?: boolean;
  include_technical_assessment?: boolean;
  quality_analysis_depth?: 'basic' | 'detailed' | 'comprehensive';
}

interface AssetInput {
  id: string;
  url: string;
  mediaType: 'image' | 'video' | 'audio' | 'text';
  userDescription?: string;
  metadata?: any;
}

/**
 * Main function to analyze all assets in parallel
 */
export async function analyzeAssetsInParallel(
  assets: AssetInput[],
  userQuery: string,
  options: AssetAnalysisOptions = {}
): Promise<{
  success: boolean;
  result?: Step2AnalysisResult;
  error?: string;
}> {
  const startTime = Date.now();
  const analysisId = `step2_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  
  const {
    enable_fallback_models = true,
    parallel_processing = true,
    max_concurrent_analyses = 5,
    timeout_per_asset = 120000, // 2 minutes per asset
    include_creative_analysis = true,
    include_technical_assessment = true,
    quality_analysis_depth = 'detailed'
  } = options;

  console.log(`[Step2-AssetAnalyzer] ${analysisId} - Starting analysis of ${assets.length} assets`);

  try {
    let assetAnalyses: AssetAnalysisResult[];

    if (parallel_processing && assets.length > 1) {
      // Process assets in parallel with concurrency limit
      assetAnalyses = await processAssetsInParallel(
        assets,
        userQuery,
        max_concurrent_analyses,
        {
          enable_fallback_models,
          timeout_per_asset,
          include_creative_analysis,
          include_technical_assessment,
          quality_analysis_depth
        }
      );
    } else {
      // Process assets sequentially
      assetAnalyses = await processAssetsSequentially(
        assets,
        userQuery,
        {
          enable_fallback_models,
          timeout_per_asset,
          include_creative_analysis,
          include_technical_assessment,
          quality_analysis_depth
        }
      );
    }

    // Generate summary insights
    const summary = generateAnalysisSummary(assetAnalyses, userQuery);
    
    // Calculate performance metrics
    const processingTimes = assetAnalyses.map(a => a.processing_info.processing_time_ms);
    const successfulAnalyses = assetAnalyses.filter(a => a.processing_info.success).length;
    const failedAnalyses = assets.length - successfulAnalyses;
    
    const totalProcessingTime = Date.now() - startTime;

    const result: Step2AnalysisResult = {
      analysis_id: analysisId,
      total_assets: assets.length,
      successful_analyses: successfulAnalyses,
      failed_analyses: failedAnalyses,
      total_processing_time_ms: totalProcessingTime,
      asset_analyses: assetAnalyses,
      summary,
      processing_metadata: {
        analysis_timestamp: new Date().toISOString(),
        parallel_processing_used: parallel_processing && assets.length > 1,
        models_available: await checkModelAvailability(),
        performance_metrics: {
          avg_processing_time_per_asset: processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length,
          fastest_analysis_ms: Math.min(...processingTimes),
          slowest_analysis_ms: Math.max(...processingTimes),
          success_rate: successfulAnalyses / assets.length
        }
      }
    };

    console.log(`[Step2-AssetAnalyzer] ${analysisId} - Analysis completed: ${successfulAnalyses}/${assets.length} successful in ${totalProcessingTime}ms`);

    return {
      success: true,
      result
    };

  } catch (error) {
    console.error(`[Step2-AssetAnalyzer] ${analysisId} - Analysis failed:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Process assets in parallel with concurrency control
 */
async function processAssetsInParallel(
  assets: AssetInput[],
  userQuery: string,
  maxConcurrent: number,
  options: any
): Promise<AssetAnalysisResult[]> {
  const results: AssetAnalysisResult[] = [];
  
  // Process assets in batches to control concurrency
  for (let i = 0; i < assets.length; i += maxConcurrent) {
    const batch = assets.slice(i, i + maxConcurrent);
    
    const batchPromises = batch.map(asset => 
      analyzeSingleAsset(asset, userQuery, options)
    );
    
    const batchResults = await Promise.allSettled(batchPromises);
    
    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        // Create error result for failed analysis
        const errorResult = createErrorAssetResult(
          batch[batchResults.indexOf(result)],
          result.reason instanceof Error ? result.reason.message : 'Unknown error'
        );
        results.push(errorResult);
      }
    }
  }
  
  return results;
}

/**
 * Process assets sequentially
 */
async function processAssetsSequentially(
  assets: AssetInput[],
  userQuery: string,
  options: any
): Promise<AssetAnalysisResult[]> {
  const results: AssetAnalysisResult[] = [];
  
  for (const asset of assets) {
    try {
      const result = await analyzeSingleAsset(asset, userQuery, options);
      results.push(result);
    } catch (error) {
      const errorResult = createErrorAssetResult(
        asset,
        error instanceof Error ? error.message : 'Unknown error'
      );
      results.push(errorResult);
    }
  }
  
  return results;
}

/**
 * Analyze a single asset with appropriate model selection
 */
async function analyzeSingleAsset(
  asset: AssetInput,
  userQuery: string,
  options: any
): Promise<AssetAnalysisResult> {
  const startTime = Date.now();
  
  console.log(`[Step2-AssetAnalyzer] Analyzing ${asset.mediaType} asset: ${asset.id}`);
  
  try {
    let analysisResult: any;
    let modelsUsed: string[] = [];
    let fallbackUsed = false;

    switch (asset.mediaType) {
      case 'image':
        analysisResult = await analyzeImageAsset(asset, userQuery, options);
        modelsUsed = analysisResult.modelsUsed || ['llava-13b', 'blip', 'moondream2'];
        fallbackUsed = analysisResult.fallbackUsed || false;
        break;
        
      case 'video':
        analysisResult = await analyzeVideoAsset(asset, userQuery, options);
        modelsUsed = analysisResult.modelsUsed || ['apollo-7b', 'qwen2.5-omni-7b'];
        fallbackUsed = analysisResult.fallbackUsed || false;
        break;
        
      case 'audio':
        analysisResult = await analyzeAudioAsset(asset, userQuery, options);
        modelsUsed = analysisResult.modelsUsed || ['whisper-large-v3'];
        fallbackUsed = analysisResult.fallbackUsed || false;
        break;
        
      default:
        throw new Error(`Unsupported asset type: ${asset.mediaType}`);
    }

    const processingTime = Date.now() - startTime;

    // Create structured result
    const result: AssetAnalysisResult = {
      asset_id: asset.id,
      asset_url: asset.url,
      asset_type: asset.mediaType,
      user_description: asset.userDescription,
      metadata: analysisResult.metadata || {},
      content_analysis: analysisResult.contentAnalysis || {},
      alignment_with_query: analysisResult.alignment || {},
      processing_needs: analysisResult.needs || {},
      processing_info: {
        models_used: modelsUsed,
        processing_time_ms: processingTime,
        analysis_timestamp: new Date().toISOString(),
        success: true,
        confidence_score: analysisResult.confidence || 0.8,
        fallback_used: fallbackUsed,
        error_messages: []
      }
    };

    console.log(`[Step2-AssetAnalyzer] Successfully analyzed ${asset.id} in ${processingTime}ms`);
    
    return result;

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`[Step2-AssetAnalyzer] Failed to analyze ${asset.id}:`, error);
    
    return createErrorAssetResult(asset, error instanceof Error ? error.message : 'Unknown error', processingTime);
  }
}

/**
 * Generate comprehensive analysis summary
 */
function generateAnalysisSummary(assetAnalyses: AssetAnalysisResult[], userQuery: string): any {
  const successful = assetAnalyses.filter(a => a.processing_info.success);
  
  // Asset type breakdown
  const assetTypeBreakdown = successful.reduce((acc, asset) => {
    acc[asset.asset_type] = (acc[asset.asset_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Overall quality score
  const qualityScores = successful
    .map(a => a.metadata.quality_score || 5)
    .filter(score => typeof score === 'number');
  const overallQualityScore = qualityScores.length > 0 
    ? qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length 
    : 5;

  // Categorize assets by role
  const primaryContentAssets = successful
    .filter(a => a.alignment_with_query.role_in_project === 'primary_content')
    .map(a => a.asset_id);
  
  const referenceMaterialAssets = successful
    .filter(a => a.alignment_with_query.role_in_project === 'reference_material')
    .map(a => a.asset_id);

  const enhancementNeededAssets = successful
    .filter(a => a.processing_needs.requires_enhancement || a.processing_needs.requires_upscaling)
    .map(a => a.asset_id);

  const highPriorityProcessing = successful
    .filter(a => a.processing_needs.priority_level === 'high')
    .map(a => a.asset_id);

  // Generate insights
  const alignmentInsights = generateAlignmentInsights(successful, userQuery);
  const technicalRecommendations = generateTechnicalRecommendations(successful);

  return {
    asset_type_breakdown: assetTypeBreakdown,
    overall_quality_score: Math.round(overallQualityScore * 10) / 10,
    primary_content_assets: primaryContentAssets,
    reference_material_assets: referenceMaterialAssets,
    enhancement_needed_assets: enhancementNeededAssets,
    high_priority_processing: highPriorityProcessing,
    alignment_insights: alignmentInsights,
    technical_recommendations: technicalRecommendations
  };
}

/**
 * Generate alignment insights
 */
function generateAlignmentInsights(analyses: AssetAnalysisResult[], userQuery: string): string[] {
  const insights: string[] = [];
  
  const highAlignmentCount = analyses.filter(a => a.alignment_with_query.alignment_score > 0.7).length;
  const lowAlignmentCount = analyses.filter(a => a.alignment_with_query.alignment_score < 0.3).length;
  
  if (highAlignmentCount > 0) {
    insights.push(`${highAlignmentCount} asset(s) strongly align with your query intent`);
  }
  
  if (lowAlignmentCount > 0) {
    insights.push(`${lowAlignmentCount} asset(s) may need role clarification or alternative usage`);
  }
  
  const primaryContentCount = analyses.filter(a => a.alignment_with_query.role_in_project === 'primary_content').length;
  if (primaryContentCount === 0) {
    insights.push('No assets identified as primary content - consider providing more aligned reference material');
  } else if (primaryContentCount > 3) {
    insights.push('Multiple primary content assets identified - consider prioritizing the most relevant ones');
  }

  return insights;
}

/**
 * Generate technical recommendations
 */
function generateTechnicalRecommendations(analyses: AssetAnalysisResult[]): string[] {
  const recommendations: string[] = [];
  
  const lowQualityCount = analyses.filter(a => (a.metadata.quality_score || 5) < 6).length;
  if (lowQualityCount > 0) {
    recommendations.push(`${lowQualityCount} asset(s) would benefit from quality enhancement`);
  }
  
  const upscalingNeeded = analyses.filter(a => a.processing_needs.requires_upscaling).length;
  if (upscalingNeeded > 0) {
    recommendations.push(`${upscalingNeeded} asset(s) require upscaling for optimal results`);
  }
  
  const formatIssues = analyses.filter(a => a.processing_needs.requires_format_conversion).length;
  if (formatIssues > 0) {
    recommendations.push(`${formatIssues} asset(s) may need format conversion for compatibility`);
  }
  
  const styleTransferNeeded = analyses.filter(a => a.processing_needs.requires_style_transfer).length;
  if (styleTransferNeeded > 0) {
    recommendations.push(`${styleTransferNeeded} asset(s) would benefit from style adaptation to match project requirements`);
  }
  
  if (recommendations.length === 0) {
    recommendations.push('All assets appear technically suitable for direct use');
  }

  return recommendations;
}

/**
 * Check model availability
 */
async function checkModelAvailability(): Promise<Record<string, boolean>> {
  // In a real implementation, this would ping each model endpoint
  // For now, assume all models are available
  return {
    'llava-13b': true,
    'blip': true,
    'moondream2': true,
    'apollo-7b': true,
    'qwen2.5-omni-7b': true,
    'whisper-large-v3': true
  };
}

/**
 * Create error result for failed asset analysis
 */
function createErrorAssetResult(asset: AssetInput, errorMessage: string, processingTime?: number): AssetAnalysisResult {
  return {
    asset_id: asset.id,
    asset_url: asset.url,
    asset_type: asset.mediaType,
    user_description: asset.userDescription,
    metadata: {
      quality_score: 0
    },
    content_analysis: {
      primary_description: 'Analysis failed',
      detailed_analysis: `Failed to analyze asset: ${errorMessage}`
    },
    alignment_with_query: {
      supports_query_intent: false,
      alignment_score: 0,
      role_in_project: 'unclear',
      usage_recommendations: ['Analysis failed - manual review required'],
      conflicts_or_issues: [errorMessage]
    },
    processing_needs: {
      requires_upscaling: false,
      requires_enhancement: false,
      requires_background_removal: false,
      requires_style_transfer: false,
      requires_format_conversion: false,
      requires_trimming: false,
      requires_noise_reduction: false,
      requires_voice_cloning: false,
      priority_level: 'low'
    },
    processing_info: {
      models_used: [],
      processing_time_ms: processingTime || 0,
      analysis_timestamp: new Date().toISOString(),
      success: false,
      confidence_score: 0,
      fallback_used: false,
      error_messages: [errorMessage]
    }
  };
}

// Import helper functions
export { analyzeImageAsset, analyzeVideoAsset, analyzeAudioAsset } from './step2-asset-analysis-helpers';
