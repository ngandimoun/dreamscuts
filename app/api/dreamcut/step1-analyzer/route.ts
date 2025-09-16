/**
 * Step 1 Query Analyzer API Endpoint
 * 
 * This endpoint exclusively handles Step 1: User Query Analysis
 * - Extract intent, meaning, constraints, and hidden requirements
 * - Normalize text and fix grammar
 * - Detect gaps and suggest creative reframing
 * 
 * This is part of the complete DreamCut query analyzer refactor.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { analyzeUserQuery, detectAssetRequirements, generateDefaultConstraints } from '@/lib/analyzer/query-analyzer';

// Request schema for Step 1 analyzer
const Step1AnalyzerRequestSchema = z.object({
  query: z.string().min(1, 'Query cannot be empty'),
  options: z.object({
    enable_grammar_correction: z.boolean().optional().default(true),
    enable_creative_reframing: z.boolean().optional().default(true),
    enable_detailed_modifier_extraction: z.boolean().optional().default(true),
    fallback_on_failure: z.boolean().optional().default(true),
    timeout: z.number().min(5000).max(120000).optional().default(60000),
    model_preference: z.enum(['llama31_405b', 'llama31_70b', 'qwen25_72b', 'gemma2_27b', 'mistral_7b', 'auto']).optional().default('auto')
  }).optional().default({}),
  user_id: z.string().uuid().optional(),
  session_id: z.string().optional()
});

// Response schema
const Step1AnalyzerResponseSchema = z.object({
  success: z.boolean(),
  request_id: z.string(),
  timestamp: z.string(),
  processing_time_ms: z.number(),
  
  // Core analysis result
  query_analysis: z.any().optional(), // Will be QueryAnalysisResult when successful
  
  // Additional insights
  asset_requirements: z.object({
    needs_reference_images: z.boolean(),
    needs_source_video: z.boolean(),
    needs_audio_input: z.boolean(),
    recommended_asset_types: z.array(z.string()),
    rationale: z.string()
  }).optional(),
  
  default_constraints: z.object({
    suggested_duration: z.number().optional(),
    suggested_aspect_ratio: z.string().optional(),
    suggested_resolution: z.string().optional(),
    rationale: z.string()
  }).optional(),
  
  // Error information
  error: z.string().optional(),
  error_code: z.string().optional(),
  model_used: z.string().optional(),
  
  // Debug information
  debug: z.object({
    original_query_length: z.number(),
    normalization_applied: z.boolean(),
    model_attempts: z.array(z.string()),
    confidence_score: z.number().optional()
  }).optional()
});

/**
 * POST /api/dreamcut/step1-analyzer
 * 
 * Analyzes user queries to extract intent, constraints, and requirements
 */
export async function POST(request: NextRequest) {
  const requestStartTime = Date.now();
  const requestId = `step1_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  
  console.log(`[Step1Analyzer] ${requestId} - Starting query analysis`);
  
  try {
    // Parse and validate request
    const body = await request.json();
    const validatedRequest = Step1AnalyzerRequestSchema.parse(body);
    
    const { query, options, user_id, session_id } = validatedRequest;
    
    console.log(`[Step1Analyzer] ${requestId} - Processing query: "${query.substring(0, 100)}..."`);
    console.log(`[Step1Analyzer] ${requestId} - Options:`, options);
    
    // Perform Step 1 analysis
    const analysisResult = await analyzeUserQuery(query, {
      enableGrammarCorrection: options?.enable_grammar_correction,
      enableCreativeReframing: options?.enable_creative_reframing,
      enableDetailedModifierExtraction: options?.enable_detailed_modifier_extraction,
      fallbackOnFailure: options?.fallback_on_failure,
      timeout: options?.timeout,
      model_preference: options?.model_preference
    });
    
    if (!analysisResult.success) {
      console.error(`[Step1Analyzer] ${requestId} - Analysis failed:`, analysisResult.error);
      
      return NextResponse.json({
        success: false,
        request_id: requestId,
        timestamp: new Date().toISOString(),
        processing_time_ms: Date.now() - requestStartTime,
        error: analysisResult.error || 'Query analysis failed',
        error_code: 'ANALYSIS_FAILED',
        debug: {
          original_query_length: query.length,
          normalization_applied: false,
          model_attempts: [],
        }
      }, { status: 500 });
    }
    
    // Generate additional insights
    const assetRequirements = detectAssetRequirements(analysisResult.result!);
    const defaultConstraints = generateDefaultConstraints(analysisResult.result!);
    
    const processingTime = Date.now() - requestStartTime;
    
    console.log(`[Step1Analyzer] ${requestId} - Analysis completed successfully in ${processingTime}ms`);
    console.log(`[Step1Analyzer] ${requestId} - Intent: ${analysisResult.result!.intent.primary_output_type}`);
    console.log(`[Step1Analyzer] ${requestId} - Confidence: ${analysisResult.result!.intent.confidence}`);
    console.log(`[Step1Analyzer] ${requestId} - Asset requirements:`, assetRequirements.recommended_asset_types);
    
    const response = {
      success: true,
      request_id: requestId,
      timestamp: new Date().toISOString(),
      processing_time_ms: processingTime,
      query_analysis: analysisResult.result,
      asset_requirements: assetRequirements,
      default_constraints: defaultConstraints,
      model_used: analysisResult.model_used,
      debug: {
        original_query_length: query.length,
        normalization_applied: query !== analysisResult.result!.normalized_prompt,
        model_attempts: [analysisResult.model_used || 'unknown'],
        confidence_score: analysisResult.result!.processing_metadata.confidence_score
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error(`[Step1Analyzer] ${requestId} - Unexpected error:`, error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        request_id: requestId,
        timestamp: new Date().toISOString(),
        processing_time_ms: Date.now() - requestStartTime,
        error: 'Invalid request format',
        error_code: 'VALIDATION_ERROR',
        debug: {
          validation_errors: error.format(),
          original_query_length: 0,
          normalization_applied: false,
          model_attempts: []
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
        original_query_length: 0,
        normalization_applied: false,
        model_attempts: []
      }
    }, { status: 500 });
  }
}

/**
 * GET /api/dreamcut/step1-analyzer
 * 
 * Returns information about the Step 1 analyzer capabilities
 */
export async function GET() {
  return NextResponse.json({
    name: 'DreamCut Step 1 Query Analyzer',
    version: '2.0.0',
    description: 'Analyzes user queries to extract intent, meaning, constraints, and hidden requirements',
    capabilities: [
      'Intent classification (image/video/audio/mixed)',
      'Text normalization and grammar correction',
      'Style, mood, and theme extraction',
      'Constraint detection (duration, aspect ratio, etc.)',
      'Gap identification (missing requirements)',
      'Creative reframing suggestions',
      'Asset requirement detection',
      'Default constraint generation'
    ],
    supported_models: ['llama31_405b', 'llama31_70b', 'qwen25_72b', 'gemma2_27b', 'mistral_7b'],
    features: {
      grammar_correction: true,
      creative_reframing: true,
      detailed_modifier_extraction: true,
      fallback_chain: true,
      confidence_scoring: true,
      asset_requirement_detection: true,
      platform_specific_defaults: true
    },
    processing_pipeline: [
      '1. Text normalization and cleanup',
      '2. LLM-based intent and modifier extraction',
      '3. Constraint identification and gap detection',
      '4. Creative reframing and enhancement suggestions',
      '5. Asset requirement analysis',
      '6. Default constraint generation'
    ],
    endpoints: {
      analyze: {
        method: 'POST',
        path: '/api/dreamcut/step1-analyzer',
        description: 'Analyze a user query'
      },
      info: {
        method: 'GET',
        path: '/api/dreamcut/step1-analyzer',
        description: 'Get analyzer information'
      }
    }
  });
}
