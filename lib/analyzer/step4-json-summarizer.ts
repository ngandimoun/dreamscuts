/**
 * Step 4: JSON Output Summarizer
 * 
 * Creates the final, structured JSON output that summarizes the complete
 * analysis pipeline. This is the definitive output format for the analyzer.
 * 
 * The output provides:
 * - Clear query understanding
 * - Asset analysis summaries
 * - Global project understanding
 * - Creative options and recommendations
 * - Pipeline recommendations for next steps
 */

import { z } from 'zod';
import { QueryAnalysisResult } from './query-analyzer';
import { Step2AnalysisResult } from './step2-asset-analyzer';
import { UnifiedProjectUnderstanding } from './step3-combination-analyzer';

// Final output schema - the definitive JSON structure
export const FinalAnalysisOutputSchema = z.object({
  // Analysis metadata
  analysis_metadata: z.object({
    analysis_id: z.string(),
    timestamp: z.string(),
    total_processing_time_ms: z.number(),
    pipeline_version: z.string(),
    analyzer_confidence: z.number().min(0).max(1),
    completion_status: z.enum(['complete', 'partial', 'error']),
    quality_score: z.number().min(0).max(10)
  }),

  // Section 1: Query Summary
  query_summary: z.object({
    original_prompt: z.string(),
    normalized_prompt: z.string(),
    parsed_intent: z.object({
      primary_output_type: z.enum(['image', 'video', 'audio', 'mixed']),
      confidence: z.number().min(0).max(1),
      secondary_outputs: z.array(z.enum(['image', 'video', 'audio'])).optional(),
      intent_description: z.string(),
      user_goal: z.string()
    }),
    extracted_constraints: z.object({
      technical_requirements: z.object({
        output_count: z.number().optional(),
        duration_seconds: z.number().optional(),
        aspect_ratio: z.string().optional(),
        resolution: z.string().optional(),
        format_preferences: z.array(z.string()).optional(),
        quality_level: z.enum(['draft', 'standard', 'high', 'professional', 'cinema']).optional()
      }),
      creative_requirements: z.object({
        style_preferences: z.array(z.string()).optional(),
        mood_requirements: z.array(z.string()).optional(),
        theme_elements: z.array(z.string()).optional(),
        color_preferences: z.array(z.string()).optional(),
        brand_requirements: z.string().optional()
      }),
      platform_requirements: z.object({
        target_platforms: z.array(z.string()).optional(),
        distribution_format: z.string().optional(),
        platform_specific_constraints: z.record(z.string(), z.any()).optional()
      }),
      timeline_requirements: z.object({
        urgency_level: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
        deadline: z.string().optional(),
        estimated_timeline: z.string().optional()
      })
    }),
    identified_gaps: z.array(z.object({
      gap_type: z.enum(['content', 'style', 'technical', 'platform', 'timeline']),
      description: z.string(),
      impact_level: z.enum(['low', 'medium', 'high', 'critical']),
      suggested_defaults: z.string()
    }))
  }),

  // Section 2: Assets Analysis
  assets_analysis: z.object({
    total_assets_processed: z.number(),
    asset_type_breakdown: z.record(z.string(), z.number()),
    processing_summary: z.object({
      successful_analyses: z.number(),
      failed_analyses: z.number(),
      partial_analyses: z.number(),
      total_processing_time_ms: z.number()
    }),
    individual_assets: z.array(z.object({
      asset_id: z.string(),
      asset_type: z.enum(['image', 'video', 'audio']),
      analysis_status: z.enum(['success', 'partial', 'failed']),
      metadata_summary: z.object({
        file_size: z.string().optional(),
        dimensions: z.string().optional(),
        duration: z.string().optional(),
        format: z.string().optional(),
        quality_score: z.number().min(0).max(10).optional()
      }),
      content_summary: z.object({
        primary_description: z.string(),
        key_elements: z.array(z.string()),
        style_characteristics: z.string().optional(),
        mood_tone: z.string().optional(),
        technical_quality: z.enum(['poor', 'fair', 'good', 'excellent', 'professional']).optional(),
        usability_assessment: z.string()
      }),
      alignment_with_query: z.object({
        alignment_score: z.number().min(0).max(1),
        role_in_project: z.enum(['primary_content', 'reference_material', 'supporting_element', 'unused']),
        specific_contributions: z.array(z.string()),
        recommended_usage: z.string()
      }),
      processing_recommendations: z.object({
        enhancement_needed: z.boolean(),
        recommended_tools: z.array(z.string()),
        processing_priority: z.enum(['critical', 'high', 'medium', 'low']),
        estimated_processing_time: z.string().optional()
      })
    })),
    asset_quality_overview: z.object({
      overall_quality_score: z.number().min(0).max(10),
      high_quality_assets: z.number(),
      enhancement_needed_assets: z.number(),
      unusable_assets: z.number(),
      quality_distribution: z.record(z.string(), z.number())
    })
  }),

  // Section 3: Global Understanding
  global_understanding: z.object({
    project_overview: z.object({
      project_title: z.string(),
      project_type: z.enum(['content_creation', 'content_enhancement', 'style_transfer', 'format_conversion', 'creative_synthesis']),
      complexity_level: z.enum(['simple', 'moderate', 'complex', 'highly_complex']),
      estimated_scope: z.string(),
      success_probability: z.number().min(0).max(1)
    }),
    unified_creative_direction: z.object({
      core_concept: z.string(),
      visual_approach: z.string(),
      style_direction: z.string(),
      mood_atmosphere: z.string(),
      narrative_approach: z.string().optional(),
      brand_voice: z.string().optional()
    }),
    asset_utilization_strategy: z.object({
      primary_content_plan: z.object({
        asset_count: z.number(),
        utilization_approach: z.string(),
        enhancement_strategy: z.string(),
        expected_output_quality: z.enum(['acceptable', 'good', 'excellent', 'professional'])
      }),
      reference_material_plan: z.object({
        reference_count: z.number(),
        extraction_strategy: z.string(),
        application_method: z.string()
      }),
      supporting_elements_plan: z.object({
        supporting_count: z.number(),
        integration_approach: z.string(),
        enhancement_needs: z.array(z.string())
      })
    }),
    identified_challenges: z.array(z.object({
      challenge_type: z.enum(['technical', 'creative', 'resource', 'quality', 'alignment']),
      description: z.string(),
      impact_assessment: z.enum(['minimal', 'moderate', 'significant', 'major']),
      mitigation_strategy: z.string(),
      resolution_confidence: z.number().min(0).max(1)
    })),
    project_feasibility: z.object({
      technical_feasibility: z.number().min(0).max(1),
      creative_feasibility: z.number().min(0).max(1),
      resource_adequacy: z.number().min(0).max(1),
      overall_feasibility: z.number().min(0).max(1),
      risk_factors: z.array(z.string())
    })
  }),

  // Section 4: Creative Options
  creative_options: z.object({
    primary_creative_direction: z.object({
      approach_name: z.string(),
      description: z.string(),
      style_elements: z.array(z.string()),
      mood_elements: z.array(z.string()),
      technical_approach: z.string(),
      expected_outcome: z.string(),
      confidence_score: z.number().min(0).max(1)
    }),
    alternative_approaches: z.array(z.object({
      approach_name: z.string(),
      description: z.string(),
      key_differences: z.array(z.string()),
      trade_offs: z.object({
        advantages: z.array(z.string()),
        disadvantages: z.array(z.string())
      }),
      suitability_score: z.number().min(0).max(1)
    })),
    creative_enhancements: z.array(z.object({
      enhancement_type: z.enum(['style', 'mood', 'quality', 'format', 'narrative', 'technical']),
      enhancement_name: z.string(),
      description: z.string(),
      impact_on_outcome: z.string(),
      implementation_complexity: z.enum(['simple', 'moderate', 'complex', 'advanced']),
      recommended: z.boolean()
    })),
    style_variations: z.array(z.object({
      variation_name: z.string(),
      style_description: z.string(),
      mood_impact: z.string(),
      technical_requirements: z.array(z.string()),
      asset_compatibility: z.number().min(0).max(1)
    }))
  }),

  // Section 5: Pipeline Recommendations
  pipeline_recommendations: z.object({
    recommended_workflow: z.array(z.object({
      step_number: z.number(),
      step_name: z.string(),
      step_category: z.enum(['preparation', 'enhancement', 'creation', 'integration', 'finalization']),
      description: z.string(),
      input_requirements: z.array(z.string()),
      output_deliverables: z.array(z.string()),
      tools_and_models: z.array(z.object({
        tool_type: z.enum(['ai_model', 'processing_tool', 'creative_software', 'api_service']),
        tool_name: z.string(),
        purpose: z.string(),
        alternatives: z.array(z.string()).optional()
      })),
      estimated_time: z.string(),
      complexity_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
      success_probability: z.number().min(0).max(1),
      dependencies: z.array(z.string()).optional()
    })),
    quality_targets: z.object({
      technical_quality_target: z.enum(['acceptable', 'good', 'excellent', 'professional', 'cinematic']),
      creative_quality_target: z.enum(['functional', 'appealing', 'impressive', 'exceptional', 'award_worthy']),
      consistency_target: z.enum(['basic', 'good', 'high', 'perfect']),
      polish_level_target: z.enum(['draft', 'refined', 'polished', 'premium', 'luxury'])
    }),
    optimization_recommendations: z.array(z.object({
      optimization_type: z.enum(['speed', 'quality', 'cost', 'complexity', 'automation']),
      recommendation: z.string(),
      expected_impact: z.string(),
      implementation_effort: z.enum(['minimal', 'low', 'moderate', 'high', 'extensive']),
      priority_level: z.enum(['optional', 'recommended', 'important', 'critical'])
    })),
    fallback_strategies: z.array(z.object({
      scenario: z.string(),
      fallback_approach: z.string(),
      quality_impact: z.string(),
      timeline_impact: z.string()
    })),
    success_metrics: z.object({
      completion_criteria: z.array(z.string()),
      quality_checkpoints: z.array(z.string()),
      expected_timeline: z.string(),
      resource_requirements: z.array(z.string())
    })
  }),

  // Processing insights for transparency
  processing_insights: z.object({
    model_usage_summary: z.array(z.object({
      step_name: z.string(),
      models_used: z.array(z.string()),
      processing_time: z.number(),
      success_rate: z.number().min(0).max(1)
    })),
    confidence_breakdown: z.object({
      query_analysis_confidence: z.number().min(0).max(1),
      asset_analysis_confidence: z.number().min(0).max(1),
      synthesis_confidence: z.number().min(0).max(1),
      overall_confidence: z.number().min(0).max(1)
    }),
    quality_assessments: z.object({
      input_quality_score: z.number().min(0).max(10),
      analysis_thoroughness: z.number().min(0).max(1),
      output_completeness: z.number().min(0).max(1),
      recommendation_reliability: z.number().min(0).max(1)
    }),
    warnings_and_notes: z.array(z.object({
      type: z.enum(['warning', 'note', 'recommendation', 'limitation']),
      message: z.string(),
      severity: z.enum(['info', 'low', 'medium', 'high', 'critical']),
      category: z.enum(['technical', 'creative', 'resource', 'timeline', 'quality'])
    }))
  })
});

export type FinalAnalysisOutput = z.infer<typeof FinalAnalysisOutputSchema>;

interface Step4SummarizerOptions {
  include_alternative_approaches?: boolean;
  include_creative_enhancements?: boolean;
  include_detailed_pipeline?: boolean;
  include_processing_insights?: boolean;
  optimization_focus?: 'speed' | 'quality' | 'cost' | 'balanced';
  detail_level?: 'summary' | 'standard' | 'comprehensive';
  target_audience?: 'technical' | 'creative' | 'business' | 'general';
}

/**
 * Main function to create the final structured JSON summary
 */
export async function createFinalAnalysisOutput(
  queryAnalysis: QueryAnalysisResult,
  assetAnalysis: Step2AnalysisResult,
  unifiedUnderstanding: UnifiedProjectUnderstanding,
  step1ProcessingTime: number,
  step2ProcessingTime: number,
  step3ProcessingTime: number,
  options: Step4SummarizerOptions = {}
): Promise<{
  success: boolean;
  result?: FinalAnalysisOutput;
  error?: string;
  warnings?: string[];
}> {
  const startTime = Date.now();
  const analysisId = unifiedUnderstanding.project_id;
  
  console.log(`[Step4-Summarizer] ${analysisId} - Creating final JSON output`);
  
  const {
    include_alternative_approaches = true,
    include_creative_enhancements = true,
    include_detailed_pipeline = true,
    include_processing_insights = true,
    optimization_focus = 'balanced',
    detail_level = 'standard',
    target_audience = 'general'
  } = options;

  try {
    const warnings: string[] = [];
    const totalProcessingTime = step1ProcessingTime + step2ProcessingTime + step3ProcessingTime;

    // Analysis metadata
    const analysisMetadata = createAnalysisMetadata(
      analysisId,
      totalProcessingTime,
      queryAnalysis,
      assetAnalysis,
      unifiedUnderstanding
    );

    // Section 1: Query Summary
    const querySummary = createQuerySummary(
      queryAnalysis,
      unifiedUnderstanding,
      detail_level
    );

    // Section 2: Assets Analysis
    const assetsAnalysis = createAssetsAnalysis(
      assetAnalysis,
      unifiedUnderstanding,
      step2ProcessingTime,
      detail_level
    );

    // Section 3: Global Understanding
    const globalUnderstanding = createGlobalUnderstanding(
      queryAnalysis,
      assetAnalysis,
      unifiedUnderstanding,
      detail_level
    );

    // Section 4: Creative Options
    const creativeOptions = createCreativeOptions(
      unifiedUnderstanding,
      include_alternative_approaches,
      include_creative_enhancements,
      detail_level,
      target_audience
    );

    // Section 5: Pipeline Recommendations
    const pipelineRecommendations = createPipelineRecommendations(
      unifiedUnderstanding,
      optimization_focus,
      include_detailed_pipeline,
      detail_level
    );

    // Processing insights
    const processingInsights = include_processing_insights 
      ? createProcessingInsights(
          queryAnalysis,
          assetAnalysis,
          unifiedUnderstanding,
          step1ProcessingTime,
          step2ProcessingTime,
          step3ProcessingTime,
          warnings
        )
      : createMinimalProcessingInsights(warnings);

    // Construct final output with comprehensive summary
    const finalOutput: FinalAnalysisOutput = {
      analysis_metadata: analysisMetadata,
      query_summary: querySummary,
      assets_analysis: assetsAnalysis,
      global_understanding: globalUnderstanding,
      creative_options: creativeOptions,
      pipeline_recommendations: pipelineRecommendations,
      processing_insights: processingInsights,
      // Add comprehensive summary that combines all steps
      comprehensive_summary: {
        // Step 1: Query Analysis
        user_request: {
          original_prompt: queryAnalysis.original_prompt,
          normalized_prompt: queryAnalysis.normalized_prompt,
          user_intent_description: `Create ${queryAnalysis.intent.primary_output_type} content based on: "${queryAnalysis.original_prompt}"`,
          reformulated_prompt: queryAnalysis.normalized_prompt,
          prompt_clarity_score: assessPromptClarity(queryAnalysis.original_prompt),
          suggested_improvements: generatePromptImprovements(queryAnalysis.original_prompt, queryAnalysis.intent.primary_output_type),
          ui_selections: {
            intent: queryAnalysis.intent.primary_output_type,
            duration_seconds: queryAnalysis.constraints.duration_seconds,
            aspect_ratio: queryAnalysis.constraints.aspect_ratio,
            platform: queryAnalysis.constraints.platform?.[0]
          }
        },
        
        // Step 2: Asset Analysis with comprehensive details
        assets_comprehensive: assetAnalysis.asset_analyses?.map((asset, index) => ({
          id: asset.asset_id || `asset_${index}`,
          type: asset.asset_type || 'unknown',
          url: asset.asset_url || 'unknown',
          filename: asset.metadata?.filename || 'unknown',
          size_bytes: asset.metadata?.file_size || 0,
          user_description: asset.user_description || asset.metadata?.description || 'No description provided',
          ai_analysis: {
            caption: asset.content_analysis?.primary_description || 'No analysis available',
            objects_detected: asset.content_analysis?.objects_detected || [],
            style_analysis: asset.content_analysis?.style_analysis || 'unknown',
            mood_assessment: asset.content_analysis?.mood_assessment || 'unknown',
            quality_score: asset.metadata?.quality_score || 0,
            recommended_edits: asset.processing_recommendations?.recommended_tools || []
          },
          technical_metadata: {
            resolution: asset.metadata?.dimensions ? `${asset.metadata.dimensions.width}x${asset.metadata.dimensions.height}` : 'unknown',
            duration_seconds: asset.metadata?.duration_seconds,
            mime_type: asset.metadata?.mime_type || 'unknown',
            dimensions: asset.metadata?.dimensions || null
          }
        })) || [],
        
        // Step 3: Creative Synthesis Results
        creative_synthesis: {
          project_id: unifiedUnderstanding.project_id,
          unified_intent: unifiedUnderstanding.unified_intent,
          asset_utilization_plan: unifiedUnderstanding.asset_utilization_plan,
          gap_analysis: unifiedUnderstanding.gap_analysis,
          contradiction_resolution: unifiedUnderstanding.contradiction_resolution,
          synthesis_metadata: unifiedUnderstanding.synthesis_metadata,
          production_recommendations: unifiedUnderstanding.production_recommendations
        },
        
        // Production Readiness Assessment
        production_readiness: {
          overall_confidence: processingInsights.confidence_breakdown?.overall_confidence || 0,
          quality_score: analysisMetadata.quality_score || 0,
          completion_status: analysisMetadata.completion_status || 'partial',
          missing_elements: globalUnderstanding.identified_challenges || [],
          asset_roles_assigned: Object.fromEntries(
            (assetAnalysis.asset_analyses || []).map((asset, index) => [
              asset.asset_id || `asset_${index}`,
              determineAssetRoleFromAnalysis(asset, queryAnalysis, unifiedUnderstanding)
            ])
          ),
          estimated_success_probability: pipelineRecommendations.overall_success_probability || 0
        }
      }
    };

    // Validate output
    const validation = FinalAnalysisOutputSchema.safeParse(finalOutput);
    if (!validation.success) {
      console.error(`[Step4-Summarizer] ${analysisId} - Validation failed:`, validation.error.format());
      return {
        success: false,
        error: `Output validation failed: ${JSON.stringify(validation.error.format())}`,
        warnings
      };
    }

    const processingTime = Date.now() - startTime;
    console.log(`[Step4-Summarizer] ${analysisId} - Final output created in ${processingTime}ms`);
    console.log(`[Step4-Summarizer] ${analysisId} - Total pipeline time: ${totalProcessingTime + processingTime}ms`);
    console.log(`[Step4-Summarizer] ${analysisId} - Output quality score: ${analysisMetadata.quality_score}/10`);
    console.log(`[Step4-Summarizer] ${analysisId} - Overall confidence: ${(processingInsights.confidence_breakdown.overall_confidence * 100).toFixed(1)}%`);

    return {
      success: true,
      result: validation.data,
      warnings: warnings.length > 0 ? warnings : undefined
    };

  } catch (error) {
    console.error(`[Step4-Summarizer] ${analysisId} - Summary creation failed:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown summarizer error'
    };
  }
}

/**
 * Create analysis metadata section
 */
function createAnalysisMetadata(
  analysisId: string,
  totalProcessingTime: number,
  queryAnalysis: QueryAnalysisResult,
  assetAnalysis: Step2AnalysisResult,
  unifiedUnderstanding: UnifiedProjectUnderstanding
): any {
  // Calculate overall confidence
  const queryConfidence = queryAnalysis.intent.confidence;
  const assetConfidence = assetAnalysis.summary.overall_quality_score / 10;
  const synthesisConfidence = unifiedUnderstanding.synthesis_metadata.synthesis_confidence;
  const overallConfidence = (queryConfidence + assetConfidence + synthesisConfidence) / 3;

  // Calculate quality score (0-10)
  const qualityScore = Math.round(
    (queryConfidence * 3 + 
     assetConfidence * 3 + 
     synthesisConfidence * 2 + 
     unifiedUnderstanding.synthesis_metadata.completeness_score * 2) * 10 / 10
  );

  // Determine completion status
  let completionStatus: 'complete' | 'partial' | 'error' = 'complete';
  if (unifiedUnderstanding.gap_analysis.identified_gaps.some(g => g.impact_level === 'critical')) {
    completionStatus = 'partial';
  }
  if (overallConfidence < 0.5) {
    completionStatus = 'partial';
  }

  return {
    analysis_id: analysisId,
    timestamp: new Date().toISOString(),
    total_processing_time_ms: totalProcessingTime,
    pipeline_version: '2.0.0',
    analyzer_confidence: Math.round(overallConfidence * 100) / 100,
    completion_status: completionStatus,
    quality_score: qualityScore
  };
}

// Import helper functions
import {
  createQuerySummary,
  createAssetsAnalysis,
  createGlobalUnderstanding,
  createCreativeOptions,
  createPipelineRecommendations,
  createProcessingInsights,
  createMinimalProcessingInsights
} from './step4-summarizer-helpers';

// Helper functions for comprehensive summary
function assessPromptClarity(prompt: string): number {
  let score = 5; // Base score
  
  // Length bonus
  if (prompt.length > 20) score += 2;
  if (prompt.length > 50) score += 1;
  
  // Specificity indicators
  const specificWords = ['style', 'color', 'mood', 'tone', 'scene', 'action', 'character', 'setting'];
  const foundSpecific = specificWords.filter(word => prompt.toLowerCase().includes(word)).length;
  score += foundSpecific;
  
  // Penalty for very short or unclear prompts
  if (prompt.length < 10) score -= 3;
  if (prompt.toLowerCase().includes('biul') || prompt.toLowerCase().includes('build')) score -= 2;
  
  return Math.max(1, Math.min(10, score));
}

function generatePromptImprovements(prompt: string, intent: string): string[] {
  const improvements: string[] = [];
  const promptLower = prompt.toLowerCase();
  
  if (prompt.length < 10) {
    improvements.push('Add more specific details about what you want to create');
  }
  
  if (!promptLower.includes('style') && !promptLower.includes('mood') && !promptLower.includes('tone')) {
    improvements.push('Specify the style, mood, or tone you prefer');
  }
  
  if (intent === 'video' && !promptLower.includes('scene') && !promptLower.includes('action')) {
    improvements.push('Describe the scenes or actions you want to include');
  }
  
  if (intent === 'image' && !promptLower.includes('color') && !promptLower.includes('composition')) {
    improvements.push('Mention preferred colors or composition style');
  }
  
  if (improvements.length === 0) {
    improvements.push('Prompt is clear and detailed');
  }
  
  return improvements;
}

function determineAssetRoleFromAnalysis(asset: any, queryAnalysis: any, unifiedUnderstanding: any): string {
  // Determine role based on asset analysis and query intent
  if (asset.asset_type === 'image' && queryAnalysis.intent.primary_output_type === 'video') {
    return 'style reference';
  }
  if (asset.asset_type === 'video' && queryAnalysis.intent.primary_output_type === 'video') {
    return 'primary footage';
  }
  if (asset.asset_type === 'audio' && queryAnalysis.intent.primary_output_type === 'video') {
    return 'voiceover narration';
  }
  if (asset.asset_type === 'image' && queryAnalysis.intent.primary_output_type === 'image') {
    return 'primary content';
  }
  if (asset.asset_type === 'audio' && queryAnalysis.intent.primary_output_type === 'audio') {
    return 'primary audio';
  }
  
  // Check if unified understanding has more specific role assignment
  if (unifiedUnderstanding?.asset_utilization_plan) {
    const utilization = unifiedUnderstanding.asset_utilization_plan.find((u: any) => u.asset_id === asset.asset_id);
    if (utilization) {
      return utilization.role || 'supporting material';
    }
  }
  
  return 'supporting material';
}
