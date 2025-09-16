/**
 * Step 2 Asset Analyzer API Endpoint
 * 
 * This endpoint handles Step 2: Individual Asset Analysis in Parallel
 * - Analyzes images using LLaVA 13B, BLIP, Moondream2
 * - Analyzes videos using Apollo 7B, Qwen 2.5 Omni 7B
 * - Analyzes audio using Whisper Large V3
 * - Provides comprehensive metadata and content analysis
 * - Processes assets in parallel for maximum efficiency
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { analyzeAssetsInParallel } from '@/lib/analyzer/step2-asset-analyzer';

// Request schema for Step 2 analyzer
const Step2AnalyzerRequestSchema = z.object({
  user_query: z.string().min(1, 'User query is required for context'),
  assets: z.array(z.object({
    id: z.string(),
    url: z.string().url('Must be a valid URL'),
    media_type: z.enum(['image', 'video', 'audio', 'text']),
    user_description: z.string().optional(),
    metadata: z.any().optional()
  })).min(1, 'At least one asset is required'),
  options: z.object({
    enable_fallback_models: z.boolean().optional().default(true),
    parallel_processing: z.boolean().optional().default(true),
    max_concurrent_analyses: z.number().min(1).max(10).optional().default(5),
    timeout_per_asset: z.number().min(30000).max(300000).optional().default(120000), // 2 minutes
    include_creative_analysis: z.boolean().optional().default(true),
    include_technical_assessment: z.boolean().optional().default(true),
    quality_analysis_depth: z.enum(['basic', 'detailed', 'comprehensive']).optional().default('detailed')
  }).optional().default({}),
  user_id: z.string().uuid().optional(),
  session_id: z.string().optional()
});

/**
 * POST /api/dreamcut/step2-asset-analyzer
 * 
 * Analyzes multiple media assets in parallel using Replicate models
 */
export async function POST(request: NextRequest) {
  const requestStartTime = Date.now();
  const requestId = `step2_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  
  console.log(`[Step2AssetAnalyzer] ${requestId} - Starting asset analysis`);
  
  try {
    // Parse and validate request
    const body = await request.json();
    const validatedRequest = Step2AnalyzerRequestSchema.parse(body);
    
    const { user_query, assets, options, user_id, session_id } = validatedRequest;
    
    console.log(`[Step2AssetAnalyzer] ${requestId} - Processing ${assets.length} assets`);
    console.log(`[Step2AssetAnalyzer] ${requestId} - Asset types:`, assets.map(a => `${a.id}:${a.media_type}`));
    console.log(`[Step2AssetAnalyzer] ${requestId} - Options:`, options);
    
    // Convert request format to internal format
    const internalAssets = assets.map(asset => ({
      id: asset.id,
      url: asset.url,
      mediaType: asset.media_type as 'image' | 'video' | 'audio' | 'text',
      userDescription: asset.user_description,
      metadata: asset.metadata
    }));
    
    // Perform Step 2 analysis
    const analysisResult = await analyzeAssetsInParallel(
      internalAssets,
      user_query,
      {
        enable_fallback_models: options?.enable_fallback_models,
        parallel_processing: options?.parallel_processing,
        max_concurrent_analyses: options?.max_concurrent_analyses,
        timeout_per_asset: options?.timeout_per_asset,
        include_creative_analysis: options?.include_creative_analysis,
        include_technical_assessment: options?.include_technical_assessment,
        quality_analysis_depth: options?.quality_analysis_depth
      }
    );
    
    if (!analysisResult.success) {
      console.error(`[Step2AssetAnalyzer] ${requestId} - Analysis failed:`, analysisResult.error);
      
      return NextResponse.json({
        success: false,
        request_id: requestId,
        timestamp: new Date().toISOString(),
        processing_time_ms: Date.now() - requestStartTime,
        error: analysisResult.error || 'Asset analysis failed',
        error_code: 'ANALYSIS_FAILED',
        debug: {
          total_assets: assets.length,
          processing_options: options
        }
      }, { status: 500 });
    }
    
    const processingTime = Date.now() - requestStartTime;
    
    console.log(`[Step2AssetAnalyzer] ${requestId} - Analysis completed successfully in ${processingTime}ms`);
    console.log(`[Step2AssetAnalyzer] ${requestId} - Results: ${analysisResult.result!.successful_analyses}/${analysisResult.result!.total_assets} successful`);
    console.log(`[Step2AssetAnalyzer] ${requestId} - Primary content assets:`, analysisResult.result!.summary.primary_content_assets);
    
    const response = {
      success: true,
      request_id: requestId,
      timestamp: new Date().toISOString(),
      processing_time_ms: processingTime,
      
      // Core analysis results
      analysis_result: analysisResult.result,
      
      // Quick summary for convenience
      summary: {
        total_assets: analysisResult.result!.total_assets,
        successful_analyses: analysisResult.result!.successful_analyses,
        failed_analyses: analysisResult.result!.failed_analyses,
        overall_quality_score: analysisResult.result!.summary.overall_quality_score,
        asset_type_breakdown: analysisResult.result!.summary.asset_type_breakdown,
        primary_content_count: analysisResult.result!.summary.primary_content_assets.length,
        enhancement_needed_count: analysisResult.result!.summary.enhancement_needed_assets.length
      },
      
      // Processing insights
      insights: {
        parallel_processing_used: analysisResult.result!.processing_metadata.parallel_processing_used,
        success_rate: analysisResult.result!.processing_metadata.performance_metrics.success_rate,
        avg_processing_time: analysisResult.result!.processing_metadata.performance_metrics.avg_processing_time_per_asset,
        models_available: analysisResult.result!.processing_metadata.models_available,
        alignment_insights: analysisResult.result!.summary.alignment_insights,
        technical_recommendations: analysisResult.result!.summary.technical_recommendations
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error(`[Step2AssetAnalyzer] ${requestId} - Unexpected error:`, error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        request_id: requestId,
        timestamp: new Date().toISOString(),
        processing_time_ms: Date.now() - requestStartTime,
        error: 'Invalid request format',
        error_code: 'VALIDATION_ERROR',
        validation_errors: error.format(),
        debug: {
          received_body_keys: Object.keys(await request.json().catch(() => ({}))),
        }
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      request_id: requestId,
      timestamp: new Date().toISOString(),
      processing_time_ms: Date.now() - requestStartTime,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      error_code: 'INTERNAL_ERROR',
      debug: {
        error_type: error instanceof Error ? error.constructor.name : 'Unknown'
      }
    }, { status: 500 });
  }
}

/**
 * GET /api/dreamcut/step2-asset-analyzer
 * 
 * Returns information about the Step 2 asset analyzer capabilities
 */
export async function GET() {
  return NextResponse.json({
    name: 'DreamCut Step 2 Asset Analyzer',
    version: '2.0.0',
    description: 'Analyzes individual media assets in parallel using specialized Replicate models',
    
    capabilities: {
      image_analysis: [
        'Content detection and description',
        'Object and scene identification',
        'Quality assessment',
        'Style and mood analysis',
        'Creative potential evaluation'
      ],
      video_analysis: [
        'Scene breakdown and content analysis',
        'Action and object detection',
        'Audio content analysis',
        'Technical quality assessment',
        'Multimodal understanding'
      ],
      audio_analysis: [
        'Speech transcription',
        'Content summarization',
        'Language detection',
        'Speaker analysis',
        'Sentiment assessment'
      ]
    },
    
    supported_models: {
      image: [
        {
          name: 'LLaVA 13B',
          model_id: 'yorickvp/llava-13b',
          description: 'Advanced image understanding and visual question answering',
          priority: 'primary'
        },
        {
          name: 'BLIP',
          model_id: 'salesforce/blip',
          description: 'Image captioning and visual question answering',
          priority: 'secondary'
        },
        {
          name: 'Moondream2',
          model_id: 'lucataco/moondream2',
          description: 'Efficient image analysis for fallback scenarios',
          priority: 'fallback'
        }
      ],
      video: [
        {
          name: 'Apollo 7B',
          model_id: 'lucataco/apollo-7b',
          description: 'Video understanding and content analysis',
          priority: 'primary'
        },
        {
          name: 'Qwen 2.5 Omni 7B',
          model_id: 'lucataco/qwen2.5-omni-7b',
          description: 'Multimodal video understanding with audio analysis',
          priority: 'secondary'
        }
      ],
      audio: [
        {
          name: 'Whisper Large V3',
          model_id: 'openai/whisper-large-v3',
          description: 'State-of-the-art speech recognition and transcription',
          priority: 'primary'
        }
      ]
    },
    
    features: {
      parallel_processing: true,
      fallback_models: true,
      quality_assessment: true,
      alignment_analysis: true,
      processing_recommendations: true,
      comprehensive_metadata: true,
      creative_analysis: true,
      technical_assessment: true
    },
    
    processing_pipeline: [
      '1. Asset validation and preparation',
      '2. Parallel model execution with fallbacks',
      '3. Metadata extraction and quality assessment',
      '4. Content analysis and object/scene detection',
      '5. Query alignment analysis',
      '6. Processing needs determination',
      '7. Summary generation and insights'
    ],
    
    performance: {
      max_concurrent_analyses: 10,
      typical_processing_time: '30-120 seconds per asset',
      supported_formats: {
        image: ['jpg', 'jpeg', 'png', 'webp'],
        video: ['mp4', 'avi', 'mov', 'mkv', 'webm'],
        audio: ['mp3', 'wav', 'flac', 'm4a', 'aac']
      }
    },
    
    endpoints: {
      analyze: {
        method: 'POST',
        path: '/api/dreamcut/step2-asset-analyzer',
        description: 'Analyze multiple media assets in parallel'
      },
      info: {
        method: 'GET',
        path: '/api/dreamcut/step2-asset-analyzer',
        description: 'Get analyzer information and capabilities'
      }
    }
  });
}
