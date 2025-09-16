/**
 * 🎬 UNIFIED COMPREHENSIVE ANALYZER
 * 
 * This is the COMPLETE 4-step analysis pipeline that produces
 * the "creative director grade" comprehensive JSON output.
 * 
 * This replaces the simplified compatibility layer with the
 * full pipeline described in the documentation.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runUnifiedAnalysisWithRealtime, type AssetInput } from '@/lib/analyzer/unified-analyzer-with-realtime';

// Comprehensive request schema
const UnifiedAnalyzerRequestSchema = z.object({
  query: z.string().min(1, 'Query is required'),
  assets: z.array(
    z.object({
      id: z.string().optional(),
      url: z.string().url('Invalid asset URL'),
      mediaType: z.enum(['image', 'video', 'audio']),
      filename: z.string().optional(),
      userDescription: z.string().optional(),
      metadata: z.record(z.any()).optional(),
    })
  ).default([]),
  options: z.object({
    step1: z.object({
      model_preference: z.enum(['llama31_405b', 'llama31_70b', 'qwen25_72b', 'gemma2_27b', 'mistral_7b', 'auto']).optional(),
      enable_creative_reframing: z.boolean().optional(),
      gap_detection_depth: z.enum(['basic', 'detailed', 'comprehensive']).optional(),
    }).optional(),
    step2: z.object({
      parallel_processing: z.boolean().optional(),
      enable_fallbacks: z.boolean().optional(),
      quality_threshold: z.number().optional(),
    }).optional(),
    step3: z.object({
      enable_ai_synthesis: z.boolean().optional(),
      synthesis_model: z.enum(['llama31_405b', 'llama31_70b', 'qwen25_72b', 'auto']).optional(),
      include_creative_suggestions: z.boolean().optional(),
      gap_analysis_depth: z.enum(['basic', 'detailed', 'comprehensive']).optional(),
    }).optional(),
    step4: z.object({
      include_alternative_approaches: z.boolean().optional(),
      include_creative_enhancements: z.boolean().optional(),
      include_detailed_pipeline: z.boolean().optional(),
      detail_level: z.enum(['minimal', 'standard', 'comprehensive']).optional(),
    }).optional(),
    realtime: z.object({
      enable_streaming: z.boolean().optional(),
      user_id: z.string(),
      query_id: z.string().optional(),
    }).optional(),
  }).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate the comprehensive request format
    const validationResult = UnifiedAnalyzerRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request format',
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { query, assets, options } = validationResult.data;

    console.log('🎬 Unified Analyzer: Starting comprehensive 4-step analysis...');
    
    const start = Date.now();

    // Convert to the format expected by the unified analyzer
    const unifiedAssets: AssetInput[] = assets.map((asset, index) => ({
      id: asset.id || `asset_${index}`,
      url: asset.url,
      mediaType: asset.mediaType,
      filename: asset.filename || asset.url.split('/').pop() || 'unknown',
      userDescription: asset.userDescription || '',
      metadata: asset.metadata || {},
    }));

    // Set comprehensive defaults for the full pipeline
    const comprehensiveOptions = {
      step1: {
        model_preference: 'auto' as const,
        enable_creative_reframing: true,
        gap_detection_depth: 'comprehensive' as const,
        ...options?.step1,
      },
      step2: {
        parallel_processing: true,
        enable_fallbacks: true,
        quality_threshold: 0.7,
        ...options?.step2,
      },
      step3: {
        enable_ai_synthesis: true,
        synthesis_model: 'auto' as const,
        include_creative_suggestions: true,
        gap_analysis_depth: 'comprehensive' as const,
        ...options?.step3,
      },
      step4: {
        include_alternative_approaches: true,
        include_creative_enhancements: true,
        include_detailed_pipeline: true,
        detail_level: 'comprehensive' as const,
        ...options?.step4,
      },
      realtime: {
        enable_streaming: false, // For now, disable streaming
        user_id: 'api_user',
        ...options?.realtime,
      },
    };

    // Run the complete 4-step unified analysis pipeline
    const analysisResult = await runUnifiedAnalysisWithRealtime(
      query,
      unifiedAssets,
      comprehensiveOptions
    );

    const processingTime = Date.now() - start;

    if (!analysisResult.success || !analysisResult.result) {
      console.error('🚨 Unified analysis failed:', analysisResult.error);
      return NextResponse.json(
        {
          success: false,
          error: `Comprehensive analysis failed: ${analysisResult.error}`,
          processingTimeMs: processingTime,
        },
        { status: 500 }
      );
    }

    console.log(`✅ Unified Analyzer completed comprehensive analysis in ${processingTime}ms`);
    
    // Return the complete comprehensive analysis
    return NextResponse.json({
      success: true,
      analysis: analysisResult.result,
      metadata: {
        processingTimeMs: processingTime,
        analysisType: 'comprehensive_4_step_pipeline',
        pipelineVersion: '2.0',
        steps_completed: ['query_analysis', 'asset_analysis', 'combination_synthesis', 'final_summarization'],
        models_invoked: analysisResult.result.processing_insights?.models_invoked || 'multiple',
        confidence_score: analysisResult.result.processing_insights?.overall_confidence || 0.85,
      },
    });

  } catch (error) {
    console.error('🚨 Unified Analyzer error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Comprehensive analysis failed',
        details: error instanceof Error ? { stack: error.stack } : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'DreamCut Unified Comprehensive Analyzer',
    description: 'Complete 4-step creative director grade analysis pipeline',
    version: '2.0',
    features: [
      'Step 1: Advanced query analysis with Together AI models',
      'Step 2: Parallel asset analysis with Replicate vision models',
      'Step 3: AI-enhanced creative synthesis and gap resolution',
      'Step 4: Comprehensive JSON summarization with pipeline recommendations',
      'Cost-optimized model execution with smart fallbacks',
      'Creative director grade insights and recommendations',
      'Production-ready API integration specs',
    ],
    models: {
      query: 'Together AI (Llama 3.1 405B, 70B, Qwen 2.5 72B, Gemma 2 27B, Mistral 7B)',
      image: 'Replicate (LLaVA 13B, BLIP, Moondream2)',
      video: 'Replicate (Apollo 7B, Qwen 2.5 Omni 7B)',
      audio: 'Replicate (Whisper Large V3)',
    },
    usage: {
      endpoint: '/api/dreamcut/unified-analyzer',
      method: 'POST',
      example: {
        query: 'Create a cinematic 30-second cyberpunk trailer',
        assets: [
          {
            url: 'https://example.com/image.jpg',
            mediaType: 'image',
            userDescription: 'Reference style image'
          }
        ],
        options: {
          step4: {
            detail_level: 'comprehensive'
          }
        }
      }
    },
  });
}