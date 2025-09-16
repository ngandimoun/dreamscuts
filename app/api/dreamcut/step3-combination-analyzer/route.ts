/**
 * Step 3 Combination Analyzer API Endpoint
 * 
 * This endpoint handles Step 3: Combine All Assets + User Query
 * - Cross-references query intent with asset analysis results
 * - Merges into cohesive understanding
 * - Identifies gaps, contradictions, and fills missing information
 * - Generates unified creative direction and production plan
 * - Uses Together AI models for AI-enhanced synthesis
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { combineQueryAndAssets } from '@/lib/analyzer/step3-combination-analyzer';
import { QueryAnalysisResult } from '@/lib/analyzer/query-analyzer';
import { Step2AnalysisResult } from '@/lib/analyzer/step2-asset-analyzer';

// Request schema for Step 3 analyzer
const Step3AnalyzerRequestSchema = z.object({
  query_analysis: z.any(), // QueryAnalysisResult from Step 1
  asset_analysis: z.any(), // Step2AnalysisResult from Step 2
  options: z.object({
    enable_ai_synthesis: z.boolean().optional().default(true),
    synthesis_model: z.enum(['llama31_405b', 'llama31_70b', 'qwen25_72b', 'auto']).optional().default('auto'),
    include_creative_suggestions: z.boolean().optional().default(true),
    include_production_planning: z.boolean().optional().default(true),
    gap_analysis_depth: z.enum(['basic', 'detailed', 'comprehensive']).optional().default('detailed'),
    enable_contradiction_resolution: z.boolean().optional().default(true),
    optimization_focus: z.enum(['quality', 'speed', 'cost', 'balanced']).optional().default('balanced'),
    synthesis_timeout: z.number().min(30000).max(180000).optional().default(90000) // 1.5 minutes
  }).optional().default({}),
  user_id: z.string().uuid().optional(),
  session_id: z.string().optional(),
  project_name: z.string().optional()
});

/**
 * POST /api/dreamcut/step3-combination-analyzer
 * 
 * Combines query analysis and asset analysis into unified project understanding
 */
export async function POST(request: NextRequest) {
  const requestStartTime = Date.now();
  const requestId = `step3_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  
  console.log(`[Step3CombinationAnalyzer] ${requestId} - Starting synthesis`);
  
  try {
    // Parse and validate request
    const body = await request.json();
    const validatedRequest = Step3AnalyzerRequestSchema.parse(body);
    
    const { query_analysis, asset_analysis, options, user_id, session_id, project_name } = validatedRequest;
    
    console.log(`[Step3CombinationAnalyzer] ${requestId} - Combining query analysis with ${asset_analysis.total_assets} assets`);
    console.log(`[Step3CombinationAnalyzer] ${requestId} - Query intent: ${query_analysis.intent.primary_output_type}`);
    console.log(`[Step3CombinationAnalyzer] ${requestId} - Asset types:`, asset_analysis.summary.asset_type_breakdown);
    console.log(`[Step3CombinationAnalyzer] ${requestId} - Options:`, options);
    
    // Validate input data structure
    if (!query_analysis.intent || !query_analysis.modifiers) {
      return NextResponse.json({
        success: false,
        request_id: requestId,
        timestamp: new Date().toISOString(),
        processing_time_ms: Date.now() - requestStartTime,
        error: 'Invalid query analysis structure - missing required fields',
        error_code: 'INVALID_QUERY_ANALYSIS'
      }, { status: 400 });
    }
    
    if (!asset_analysis.asset_analyses || !Array.isArray(asset_analysis.asset_analyses)) {
      return NextResponse.json({
        success: false,
        request_id: requestId,
        timestamp: new Date().toISOString(),
        processing_time_ms: Date.now() - requestStartTime,
        error: 'Invalid asset analysis structure - missing asset analyses array',
        error_code: 'INVALID_ASSET_ANALYSIS'
      }, { status: 400 });
    }
    
    // Perform Step 3 combination analysis
    const combinationResult = await combineQueryAndAssets(
      query_analysis as QueryAnalysisResult,
      asset_analysis as Step2AnalysisResult,
      {
        enable_ai_synthesis: options?.enable_ai_synthesis,
        synthesis_model: options?.synthesis_model,
        include_creative_suggestions: options?.include_creative_suggestions,
        include_production_planning: options?.include_production_planning,
        gap_analysis_depth: options?.gap_analysis_depth,
        enable_contradiction_resolution: options?.enable_contradiction_resolution,
        optimization_focus: options?.optimization_focus,
        synthesis_timeout: options?.synthesis_timeout
      }
    );
    
    if (!combinationResult.success) {
      console.error(`[Step3CombinationAnalyzer] ${requestId} - Combination failed:`, combinationResult.error);
      
      return NextResponse.json({
        success: false,
        request_id: requestId,
        timestamp: new Date().toISOString(),
        processing_time_ms: Date.now() - requestStartTime,
        error: combinationResult.error || 'Combination analysis failed',
        error_code: 'COMBINATION_FAILED',
        warnings: combinationResult.warnings
      }, { status: 500 });
    }
    
    const processingTime = Date.now() - requestStartTime;
    
    console.log(`[Step3CombinationAnalyzer] ${requestId} - Combination completed successfully in ${processingTime}ms`);
    console.log(`[Step3CombinationAnalyzer] ${requestId} - Project: "${combinationResult.result!.project_title}"`);
    console.log(`[Step3CombinationAnalyzer] ${requestId} - Unified intent: ${combinationResult.result!.unified_intent.primary_output_type} (${(combinationResult.result!.unified_intent.confidence * 100).toFixed(1)}% confidence)`);
    console.log(`[Step3CombinationAnalyzer] ${requestId} - Primary assets: ${combinationResult.result!.asset_utilization.primary_assets.length}`);
    console.log(`[Step3CombinationAnalyzer] ${requestId} - Gaps identified: ${combinationResult.result!.gap_analysis.identified_gaps.length}`);
    console.log(`[Step3CombinationAnalyzer] ${requestId} - Complexity: ${combinationResult.result!.synthesis_metadata.complexity_assessment}`);
    
    const response = {
      success: true,
      request_id: requestId,
      timestamp: new Date().toISOString(),
      processing_time_ms: processingTime,
      
      // Core combination result
      unified_understanding: combinationResult.result,
      warnings: combinationResult.warnings,
      
      // Quick executive summary for convenience
      executive_summary: {
        project_title: combinationResult.result!.project_title,
        unified_intent: {
          output_type: combinationResult.result!.unified_intent.primary_output_type,
          confidence: Math.round(combinationResult.result!.unified_intent.confidence * 100),
          creative_direction: combinationResult.result!.unified_intent.creative_direction
        },
        asset_utilization: {
          primary_assets_count: combinationResult.result!.asset_utilization.primary_assets.length,
          reference_assets_count: combinationResult.result!.asset_utilization.reference_assets.length,
          supporting_assets_count: combinationResult.result!.asset_utilization.supporting_assets.length,
          unused_assets_count: combinationResult.result!.asset_utilization.unused_assets.length,
          utilization_rate: Math.round(
            ((combinationResult.result!.asset_utilization.primary_assets.length + 
              combinationResult.result!.asset_utilization.supporting_assets.length) /
             (combinationResult.result!.asset_utilization.primary_assets.length + 
              combinationResult.result!.asset_utilization.reference_assets.length +
              combinationResult.result!.asset_utilization.supporting_assets.length +
              combinationResult.result!.asset_utilization.unused_assets.length)) * 100
          )
        },
        project_readiness: {
          completeness_score: Math.round(combinationResult.result!.synthesis_metadata.completeness_score * 100),
          complexity_level: combinationResult.result!.synthesis_metadata.complexity_assessment,
          critical_gaps: combinationResult.result!.gap_analysis.identified_gaps.filter(g => g.impact_level === 'critical').length,
          major_contradictions: combinationResult.result!.gap_analysis.contradictions.length,
          estimated_pipeline_steps: combinationResult.result!.production_recommendations.recommended_pipeline.length
        }
      },
      
      // Key insights and recommendations
      key_insights: {
        alignment_score: Math.round(combinationResult.result!.synthesis_metadata.query_asset_alignment_score * 100),
        synthesis_confidence: Math.round(combinationResult.result!.synthesis_metadata.synthesis_confidence * 100),
        recommendations_confidence: Math.round(combinationResult.result!.synthesis_metadata.recommendations_confidence * 100),
        
        // Top priorities
        priority_actions: combinationResult.result!.gap_analysis.identified_gaps
          .filter(g => g.impact_level === 'critical' || g.impact_level === 'high')
          .slice(0, 3)
          .map(g => ({
            type: g.gap_type,
            description: g.description,
            resolution: g.suggested_resolution,
            impact: g.impact_level
          })),
          
        // Creative highlights
        creative_direction: combinationResult.result!.creative_synthesis.unified_creative_direction,
        style_strategy: combinationResult.result!.creative_synthesis.style_fusion_strategy,
        
        // Production overview
        pipeline_complexity: combinationResult.result!.production_recommendations.recommended_pipeline[0]?.complexity_level || 'moderate',
        estimated_total_time: calculateTotalProductionTime(combinationResult.result!.production_recommendations.recommended_pipeline),
        quality_target: combinationResult.result!.production_recommendations.quality_targets.technical_quality
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error(`[Step3CombinationAnalyzer] ${requestId} - Unexpected error:`, error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        request_id: requestId,
        timestamp: new Date().toISOString(),
        processing_time_ms: Date.now() - requestStartTime,
        error: 'Invalid request format',
        error_code: 'VALIDATION_ERROR',
        validation_errors: error.format()
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      request_id: requestId,
      timestamp: new Date().toISOString(),
      processing_time_ms: Date.now() - requestStartTime,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      error_code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}

/**
 * GET /api/dreamcut/step3-combination-analyzer
 * 
 * Returns information about the Step 3 combination analyzer capabilities
 */
export async function GET() {
  return NextResponse.json({
    name: 'DreamCut Step 3 Combination Analyzer',
    version: '2.0.0',
    description: 'Combines query analysis and asset analysis into unified project understanding with AI-enhanced synthesis',
    
    capabilities: [
      'Cross-reference query intent with asset capabilities',
      'Merge constraints and resolve contradictions',
      'Asset role assignment and utilization planning',
      'Gap analysis and missing element identification',
      'AI-enhanced creative direction synthesis',
      'Production pipeline recommendations',
      'Quality target derivation',
      'Optimization suggestions'
    ],
    
    ai_synthesis: {
      enabled: true,
      models: [
        {
          name: 'Llama 3.1 405B',
          description: 'Primary model for complex creative synthesis',
          capabilities: ['advanced_reasoning', 'creative_direction', 'constraint_resolution']
        },
        {
          name: 'Llama 3.1 70B',
          description: 'Balanced model for most synthesis tasks',
          capabilities: ['general_synthesis', 'optimization_planning', 'gap_analysis']
        },
        {
          name: 'Qwen 2.5 72B',
          description: 'Specialized model for technical analysis',
          capabilities: ['technical_synthesis', 'production_planning', 'quality_assessment']
        }
      ],
      fallback_strategy: 'Automatic model selection with robust fallback chain'
    },
    
    analysis_components: {
      intent_unification: {
        description: 'Merges query intent with asset capabilities',
        ai_enhanced: true,
        confidence_scoring: true
      },
      constraint_synthesis: {
        description: 'Unifies technical and creative constraints',
        platform_awareness: true,
        default_generation: true
      },
      asset_utilization: {
        description: 'Assigns roles and creates utilization plan',
        priority_scoring: true,
        enhancement_planning: true
      },
      gap_analysis: {
        description: 'Identifies missing elements and contradictions',
        impact_assessment: true,
        resolution_strategies: true
      },
      creative_synthesis: {
        description: 'Generates unified creative direction',
        ai_enhanced: true,
        style_fusion: true,
        narrative_structuring: true
      },
      production_recommendations: {
        description: 'Creates actionable production pipeline',
        complexity_aware: true,
        optimization_focused: true,
        time_estimation: true
      }
    },
    
    output_structure: {
      unified_intent: 'Merged creative direction with confidence scoring',
      unified_constraints: 'Complete technical and creative requirements',
      asset_utilization: 'Detailed role assignments and processing plans',
      gap_analysis: 'Identified issues with resolution strategies',
      creative_synthesis: 'AI-enhanced creative direction and style fusion',
      production_recommendations: 'Step-by-step pipeline with quality targets',
      synthesis_metadata: 'Confidence scores and validation metrics'
    },
    
    validation_checks: [
      'Intent clarity and confidence thresholds',
      'Asset utilization coverage',
      'Critical gap identification',
      'Complexity reasonableness',
      'Asset quality sufficiency'
    ],
    
    optimization_focuses: {
      quality: 'Prioritizes visual appeal and professional finishing',
      speed: 'Optimizes for faster processing and automation',
      cost: 'Maximizes asset reuse and minimizes generation needs',
      balanced: 'Balances all optimization factors appropriately'
    },
    
    endpoints: {
      analyze: {
        method: 'POST',
        path: '/api/dreamcut/step3-combination-analyzer',
        description: 'Combine query and asset analysis into unified understanding'
      },
      info: {
        method: 'GET',
        path: '/api/dreamcut/step3-combination-analyzer',
        description: 'Get analyzer information and capabilities'
      }
    },
    
    dependencies: {
      step1_required: 'Query analysis result from Step 1',
      step2_required: 'Asset analysis result from Step 2',
      ai_models: 'Together AI models for enhanced synthesis'
    },
    
    typical_processing_time: '30-90 seconds depending on complexity and AI synthesis depth'
  });
}

/**
 * Helper function to calculate total production time
 */
function calculateTotalProductionTime(pipeline: any[]): string {
  if (!pipeline || pipeline.length === 0) return 'Unknown';
  
  // Extract time estimates and sum them
  let totalMinutes = 0;
  let hasEstimates = false;
  
  for (const step of pipeline) {
    if (step.estimated_time) {
      // Parse time like "15-30 minutes" or "20 minutes"
      const timeMatch = step.estimated_time.match(/(\d+)(?:-(\d+))?\s*minutes?/);
      if (timeMatch) {
        const minTime = parseInt(timeMatch[1]);
        const maxTime = timeMatch[2] ? parseInt(timeMatch[2]) : minTime;
        totalMinutes += (minTime + maxTime) / 2; // Use average
        hasEstimates = true;
      }
    }
  }
  
  if (!hasEstimates) return 'Variable';
  
  if (totalMinutes < 60) {
    return `${Math.round(totalMinutes)} minutes`;
  } else {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return `${hours}h ${minutes}m`;
  }
}
