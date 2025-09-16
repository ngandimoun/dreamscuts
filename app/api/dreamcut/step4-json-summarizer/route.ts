/**
 * Step 4 JSON Summarizer API Endpoint
 * 
 * This endpoint handles Step 4: Output Structured JSON Summarizer
 * - Takes results from Steps 1, 2, and 3
 * - Creates the final, comprehensive JSON output
 * - Provides clear, consistent structure with all required sections
 * - Includes executive summary and key insights
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createFinalAnalysisOutput } from '@/lib/analyzer/step4-json-summarizer';
import { QueryAnalysisResult } from '@/lib/analyzer/query-analyzer';
import { Step2AnalysisResult } from '@/lib/analyzer/step2-asset-analyzer';
import { UnifiedProjectUnderstanding } from '@/lib/analyzer/step3-combination-analyzer';

// Request schema for Step 4 summarizer
const Step4SummarizerRequestSchema = z.object({
  query_analysis: z.any(), // QueryAnalysisResult from Step 1
  asset_analysis: z.any(), // Step2AnalysisResult from Step 2
  unified_understanding: z.any(), // UnifiedProjectUnderstanding from Step 3
  processing_times: z.object({
    step1_ms: z.number().min(0),
    step2_ms: z.number().min(0),
    step3_ms: z.number().min(0)
  }),
  options: z.object({
    include_alternative_approaches: z.boolean().optional().default(true),
    include_creative_enhancements: z.boolean().optional().default(true),
    include_detailed_pipeline: z.boolean().optional().default(true),
    include_processing_insights: z.boolean().optional().default(true),
    optimization_focus: z.enum(['speed', 'quality', 'cost', 'balanced']).optional().default('balanced'),
    detail_level: z.enum(['summary', 'standard', 'comprehensive']).optional().default('standard'),
    target_audience: z.enum(['technical', 'creative', 'business', 'general']).optional().default('general')
  }).optional().default({}),
  user_id: z.string().uuid().optional(),
  session_id: z.string().optional(),
  export_format: z.enum(['json', 'formatted']).optional().default('json')
});

/**
 * POST /api/dreamcut/step4-json-summarizer
 * 
 * Creates the final structured JSON output from all analysis steps
 */
export async function POST(request: NextRequest) {
  const requestStartTime = Date.now();
  const requestId = `step4_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  
  console.log(`[Step4JsonSummarizer] ${requestId} - Starting final JSON summarization`);
  
  try {
    // Parse and validate request
    const body = await request.json();
    const validatedRequest = Step4SummarizerRequestSchema.parse(body);
    
    const { 
      query_analysis, 
      asset_analysis, 
      unified_understanding, 
      processing_times,
      options, 
      user_id, 
      session_id,
      export_format 
    } = validatedRequest;
    
    console.log(`[Step4JsonSummarizer] ${requestId} - Summarizing project: "${unified_understanding.project_title}"`);
    console.log(`[Step4JsonSummarizer] ${requestId} - Processing times: Step1=${processing_times.step1_ms}ms, Step2=${processing_times.step2_ms}ms, Step3=${processing_times.step3_ms}ms`);
    console.log(`[Step4JsonSummarizer] ${requestId} - Options:`, options);
    
    // Validate input data structures
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
    
    if (!unified_understanding.unified_intent || !unified_understanding.asset_utilization) {
      return NextResponse.json({
        success: false,
        request_id: requestId,
        timestamp: new Date().toISOString(),
        processing_time_ms: Date.now() - requestStartTime,
        error: 'Invalid unified understanding structure - missing required fields',
        error_code: 'INVALID_UNIFIED_UNDERSTANDING'
      }, { status: 400 });
    }
    
    // Create final analysis output
    const summarizerResult = await createFinalAnalysisOutput(
      query_analysis as QueryAnalysisResult,
      asset_analysis as Step2AnalysisResult,
      unified_understanding as UnifiedProjectUnderstanding,
      processing_times.step1_ms,
      processing_times.step2_ms,
      processing_times.step3_ms,
      {
        include_alternative_approaches: options?.include_alternative_approaches,
        include_creative_enhancements: options?.include_creative_enhancements,
        include_detailed_pipeline: options?.include_detailed_pipeline,
        include_processing_insights: options?.include_processing_insights,
        optimization_focus: options?.optimization_focus,
        detail_level: options?.detail_level,
        target_audience: options?.target_audience
      }
    );
    
    if (!summarizerResult.success) {
      console.error(`[Step4JsonSummarizer] ${requestId} - Summarization failed:`, summarizerResult.error);
      
      return NextResponse.json({
        success: false,
        request_id: requestId,
        timestamp: new Date().toISOString(),
        processing_time_ms: Date.now() - requestStartTime,
        error: summarizerResult.error || 'JSON summarization failed',
        error_code: 'SUMMARIZATION_FAILED',
        warnings: summarizerResult.warnings
      }, { status: 500 });
    }
    
    const processingTime = Date.now() - requestStartTime;
    const totalPipelineTime = processing_times.step1_ms + processing_times.step2_ms + processing_times.step3_ms + processingTime;
    
    console.log(`[Step4JsonSummarizer] ${requestId} - Summarization completed successfully in ${processingTime}ms`);
    console.log(`[Step4JsonSummarizer] ${requestId} - Total pipeline time: ${totalPipelineTime}ms`);
    console.log(`[Step4JsonSummarizer] ${requestId} - Final quality score: ${summarizerResult.result!.analysis_metadata.quality_score}/10`);
    console.log(`[Step4JsonSummarizer] ${requestId} - Overall confidence: ${(summarizerResult.result!.analysis_metadata.analyzer_confidence * 100).toFixed(1)}%`);
    
    // Create executive summary for quick overview
    const executiveSummary = createExecutiveSummary(summarizerResult.result!);
    
    // Create performance metrics
    const performanceMetrics = {
      total_pipeline_time_ms: totalPipelineTime,
      step_breakdown: {
        step1_query_analysis: processing_times.step1_ms,
        step2_asset_analysis: processing_times.step2_ms,
        step3_combination: processing_times.step3_ms,
        step4_summarization: processingTime
      },
      efficiency_metrics: {
        time_per_asset_ms: Math.round(processing_times.step2_ms / asset_analysis.total_assets),
        synthesis_efficiency: Math.round(processing_times.step3_ms / Math.max(1, asset_analysis.total_assets)),
        total_assets_processed: asset_analysis.total_assets,
        processing_rate: Math.round(asset_analysis.total_assets / (totalPipelineTime / 1000))
      }
    };
    
    const response = {
      success: true,
      request_id: requestId,
      timestamp: new Date().toISOString(),
      processing_time_ms: processingTime,
      total_pipeline_time_ms: totalPipelineTime,
      
      // The complete final analysis output
      final_analysis: summarizerResult.result,
      warnings: summarizerResult.warnings,
      
      // Executive summary for quick overview
      executive_summary: executiveSummary,
      
      // Performance insights
      performance_metrics: performanceMetrics,
      
      // Pipeline completion status
      pipeline_status: {
        all_steps_completed: true,
        completion_quality: summarizerResult.result!.analysis_metadata.completion_status,
        overall_success_probability: calculateOverallSuccessProbability(summarizerResult.result!),
        readiness_for_production: assessProductionReadiness(summarizerResult.result!),
        next_recommended_actions: generateNextActions(summarizerResult.result!)
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error(`[Step4JsonSummarizer] ${requestId} - Unexpected error:`, error);
    
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
 * GET /api/dreamcut/step4-json-summarizer
 * 
 * Returns information about the Step 4 JSON summarizer capabilities
 */
export async function GET() {
  return NextResponse.json({
    name: 'DreamCut Step 4 JSON Summarizer',
    version: '2.0.0',
    description: 'Creates final structured JSON output with comprehensive project analysis and recommendations',
    
    capabilities: [
      'Complete project analysis summarization',
      'Executive summary generation',
      'Structured JSON output with all required sections',
      'Performance metrics and efficiency analysis',
      'Production readiness assessment',
      'Next action recommendations',
      'Customizable detail levels and target audiences',
      'Alternative approaches and creative enhancements'
    ],
    
    output_sections: {
      analysis_metadata: 'Processing information, confidence scores, and quality metrics',
      query_summary: 'User intent analysis with extracted requirements and identified gaps',
      assets_analysis: 'Comprehensive asset breakdown with quality assessments and utilization plans',
      global_understanding: 'Project overview, creative direction, and feasibility analysis',
      creative_options: 'Primary direction, alternatives, enhancements, and style variations',
      pipeline_recommendations: 'Step-by-step workflow with quality targets and optimization suggestions',
      processing_insights: 'Model usage, confidence breakdown, and quality assessments'
    },
    
    customization_options: {
      detail_levels: {
        summary: 'Condensed output with essential information only',
        standard: 'Balanced detail appropriate for most use cases',
        comprehensive: 'Full detail with extensive insights and alternatives'
      },
      target_audiences: {
        technical: 'Focus on technical specifications and implementation details',
        creative: 'Emphasize creative direction and artistic considerations',
        business: 'Highlight project feasibility and resource requirements',
        general: 'Balanced approach suitable for broad audiences'
      },
      optimization_focuses: {
        speed: 'Prioritize faster processing and automation',
        quality: 'Emphasize visual appeal and professional finishing',
        cost: 'Focus on resource efficiency and budget optimization',
        balanced: 'Balance all optimization factors appropriately'
      }
    },
    
    executive_summary_includes: [
      'Project title and type classification',
      'Primary creative direction and confidence score',
      'Asset utilization statistics and efficiency metrics',
      'Project complexity and feasibility assessment',
      'Critical gaps and major challenges identification',
      'Success probability and production readiness score',
      'Next recommended actions and timeline estimates'
    ],
    
    quality_assurance: {
      validation_checks: 'Comprehensive schema validation and data integrity checks',
      confidence_scoring: 'Multi-dimensional confidence assessment across all analysis components',
      completeness_verification: 'Ensures all required sections are present and properly formatted',
      consistency_validation: 'Cross-references data consistency across all analysis sections'
    },
    
    performance_metrics: {
      processing_efficiency: 'Time per asset and overall processing rate calculations',
      resource_utilization: 'Asset usage efficiency and optimization recommendations',
      synthesis_quality: 'Quality of combining multiple analysis results',
      output_completeness: 'Measure of how thoroughly requirements are addressed'
    },
    
    endpoints: {
      summarize: {
        method: 'POST',
        path: '/api/dreamcut/step4-json-summarizer',
        description: 'Create final structured JSON output from all analysis steps'
      },
      info: {
        method: 'GET',
        path: '/api/dreamcut/step4-json-summarizer',
        description: 'Get summarizer information and capabilities'
      }
    },
    
    dependencies: {
      step1_required: 'Query analysis result from Step 1',
      step2_required: 'Asset analysis result from Step 2', 
      step3_required: 'Unified understanding from Step 3',
      processing_times: 'Processing times from all previous steps'
    },
    
    typical_processing_time: '5-15 seconds for JSON structuring and validation'
  });
}

/**
 * Create executive summary for quick project overview
 */
function createExecutiveSummary(finalAnalysis: any): any {
  return {
    project_overview: {
      title: finalAnalysis.analysis_metadata.analysis_id,
      type: finalAnalysis.global_understanding.project_overview.project_type,
      complexity: finalAnalysis.global_understanding.project_overview.complexity_level,
      confidence: Math.round(finalAnalysis.analysis_metadata.analyzer_confidence * 100)
    },
    
    creative_direction: {
      primary_approach: finalAnalysis.creative_options.primary_creative_direction.approach_name,
      style_elements: finalAnalysis.creative_options.primary_creative_direction.style_elements.slice(0, 3),
      confidence: Math.round(finalAnalysis.creative_options.primary_creative_direction.confidence_score * 100)
    },
    
    assets_utilization: {
      total_assets: finalAnalysis.assets_analysis.total_assets_processed,
      primary_assets: finalAnalysis.assets_analysis.individual_assets.filter((a: any) => 
        a.alignment_with_query.role_in_project === 'primary_content'
      ).length,
      quality_score: finalAnalysis.assets_analysis.asset_quality_overview.overall_quality_score,
      utilization_efficiency: Math.round(
        (finalAnalysis.assets_analysis.total_assets_processed - 
         finalAnalysis.assets_analysis.individual_assets.filter((a: any) => 
           a.alignment_with_query.role_in_project === 'unused'
         ).length) / finalAnalysis.assets_analysis.total_assets_processed * 100
      )
    },
    
    project_feasibility: {
      overall_score: Math.round(finalAnalysis.global_understanding.project_feasibility.overall_feasibility * 100),
      technical_feasibility: Math.round(finalAnalysis.global_understanding.project_feasibility.technical_feasibility * 100),
      creative_feasibility: Math.round(finalAnalysis.global_understanding.project_feasibility.creative_feasibility * 100),
      success_probability: Math.round(finalAnalysis.global_understanding.project_overview.success_probability * 100)
    },
    
    critical_insights: {
      major_gaps: finalAnalysis.query_summary.identified_gaps.filter((g: any) => 
        g.impact_level === 'critical' || g.impact_level === 'high'
      ).length,
      key_challenges: finalAnalysis.global_understanding.identified_challenges.slice(0, 3).map((c: any) => c.description),
      production_steps: finalAnalysis.pipeline_recommendations.recommended_workflow.length,
      estimated_timeline: finalAnalysis.pipeline_recommendations.success_metrics.expected_timeline
    }
  };
}

/**
 * Calculate overall success probability
 */
function calculateOverallSuccessProbability(finalAnalysis: any): number {
  const weights = {
    analyzer_confidence: 0.3,
    project_feasibility: 0.3,
    asset_quality: 0.2,
    gap_impact: 0.2
  };
  
  const analyzerConfidence = finalAnalysis.analysis_metadata.analyzer_confidence;
  const projectFeasibility = finalAnalysis.global_understanding.project_feasibility.overall_feasibility;
  const assetQuality = finalAnalysis.assets_analysis.asset_quality_overview.overall_quality_score / 10;
  
  // Calculate gap impact (inverted - fewer gaps = higher score)
  const criticalGaps = finalAnalysis.query_summary.identified_gaps.filter((g: any) => g.impact_level === 'critical').length;
  const gapImpact = Math.max(0.1, 1.0 - (criticalGaps * 0.3));
  
  const overallProbability = 
    (analyzerConfidence * weights.analyzer_confidence) +
    (projectFeasibility * weights.project_feasibility) +
    (assetQuality * weights.asset_quality) +
    (gapImpact * weights.gap_impact);
    
  return Math.round(overallProbability * 100) / 100;
}

/**
 * Assess production readiness
 */
function assessProductionReadiness(finalAnalysis: any): 'ready' | 'needs_preparation' | 'needs_significant_work' | 'not_ready' {
  const successProbability = calculateOverallSuccessProbability(finalAnalysis);
  const criticalGaps = finalAnalysis.query_summary.identified_gaps.filter((g: any) => g.impact_level === 'critical').length;
  const majorChallenges = finalAnalysis.global_understanding.identified_challenges.filter((c: any) => 
    c.impact_assessment === 'major' || c.impact_assessment === 'significant'
  ).length;
  
  if (successProbability >= 0.8 && criticalGaps === 0 && majorChallenges <= 1) return 'ready';
  if (successProbability >= 0.6 && criticalGaps <= 1 && majorChallenges <= 2) return 'needs_preparation';
  if (successProbability >= 0.4 && criticalGaps <= 2) return 'needs_significant_work';
  return 'not_ready';
}

/**
 * Generate next recommended actions
 */
function generateNextActions(finalAnalysis: any): string[] {
  const actions: string[] = [];
  
  // Address critical gaps first
  const criticalGaps = finalAnalysis.query_summary.identified_gaps.filter((g: any) => g.impact_level === 'critical');
  criticalGaps.forEach((gap: any) => {
    actions.push(`Address critical gap: ${gap.suggested_defaults}`);
  });
  
  // Asset enhancement priorities
  const enhancementNeeded = finalAnalysis.assets_analysis.asset_quality_overview.enhancement_needed_assets;
  if (enhancementNeeded > 0) {
    actions.push(`Enhance ${enhancementNeeded} assets for improved quality`);
  }
  
  // First pipeline step
  const firstStep = finalAnalysis.pipeline_recommendations.recommended_workflow[0];
  if (firstStep) {
    actions.push(`Begin with: ${firstStep.step_name} - ${firstStep.description}`);
  }
  
  // Top optimization recommendation
  const topOptimization = finalAnalysis.pipeline_recommendations.optimization_recommendations.find((opt: any) => 
    opt.priority_level === 'critical' || opt.priority_level === 'important'
  );
  if (topOptimization) {
    actions.push(`Optimization: ${topOptimization.recommendation}`);
  }
  
  return actions.slice(0, 5); // Limit to 5 key actions
}
