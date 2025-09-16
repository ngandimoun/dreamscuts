/**
 * Step 3: Combination Analyzer
 * 
 * Combines user query analysis (Step 1) with individual asset analyses (Step 2)
 * into a cohesive understanding of the entire creative project.
 * 
 * Key Functions:
 * - Cross-reference query intent with available assets
 * - Match assets to specific project requirements
 * - Identify contradictions and gaps
 * - Fill missing information with defaults
 * - Summarize unified constraints
 * - Generate creative direction suggestions
 */

import { z } from 'zod';
import { QueryAnalysisResult } from './query-analyzer';
import { Step2AnalysisResult, AssetAnalysisResult } from './step2-asset-analyzer';

// Import helper functions
import {
  createSynthesisPrompt,
  unifyConstraints,
  createAssetUtilizationPlan,
  performGapAnalysis,
  generateCreativeSynthesis,
  generateProductionRecommendations
} from './step3-combination-helpers';

// Import Together AI models for synthesis analysis
import { executeTogetherAILlama31405B, createLlama31405BPrompt, LLAMA31_405B_SYSTEM_PROMPTS } from '../../executors/together-ai-llama-3-1-405b';
import { executeTogetherAILlama3170B } from '../../executors/together-ai-llama-3-1-70b';
import { executeTogetherAIQwen2572B } from '../../executors/together-ai-qwen-2-5-72b';

// Unified project understanding schema
export const UnifiedProjectUnderstandingSchema = z.object({
  project_id: z.string(),
  project_title: z.string(),
  
  // Merged intent and requirements
  unified_intent: z.object({
    primary_output_type: z.enum(['image', 'video', 'audio', 'mixed']),
    confidence: z.number().min(0).max(1),
    secondary_outputs: z.array(z.enum(['image', 'video', 'audio'])).optional(),
    creative_direction: z.string(),
    target_outcome: z.string(),
    reasoning: z.string()
  }),
  
  // Unified constraints from query + assets
  unified_constraints: z.object({
    // Derived from query analysis and asset capabilities
    output_specifications: z.object({
      image_count: z.number().optional(),
      video_duration_seconds: z.number().optional(),
      audio_length_seconds: z.number().optional(),
      aspect_ratio: z.string().optional(),
      resolution: z.string().optional(),
      quality_target: z.enum(['standard', 'high', 'professional', 'cinema']).optional(),
      format_requirements: z.array(z.string()).optional()
    }),
    
    // Platform and distribution
    platform_constraints: z.object({
      target_platforms: z.array(z.string()).optional(),
      platform_specific_requirements: z.record(z.string(), z.any()).optional(),
      distribution_format: z.string().optional()
    }),
    
    // Creative and stylistic
    creative_constraints: z.object({
      required_style: z.string().optional(),
      mood_requirements: z.array(z.string()).optional(),
      color_palette: z.array(z.string()).optional(),
      brand_requirements: z.string().optional(),
      accessibility_requirements: z.array(z.string()).optional()
    }),
    
    // Technical and production
    production_constraints: z.object({
      budget_tier: z.enum(['low', 'medium', 'high', 'unlimited']).optional(),
      timeline: z.string().optional(),
      complexity_level: z.enum(['simple', 'moderate', 'complex', 'advanced']).optional(),
      automation_level: z.enum(['full_auto', 'semi_auto', 'manual_review']).optional()
    })
  }),
  
  // Asset utilization plan
  asset_utilization: z.object({
    primary_assets: z.array(z.object({
      asset_id: z.string(),
      role: z.enum(['hero', 'main_content', 'key_element', 'supporting']),
      usage_plan: z.string(),
      processing_priority: z.enum(['critical', 'high', 'medium', 'low']),
      enhancement_plan: z.array(z.string()).optional()
    })),
    
    reference_assets: z.array(z.object({
      asset_id: z.string(),
      reference_type: z.enum(['style_reference', 'mood_reference', 'content_reference', 'technical_reference']),
      application: z.string(),
      extraction_focus: z.array(z.string())
    })),
    
    supporting_assets: z.array(z.object({
      asset_id: z.string(),
      support_role: z.enum(['background', 'texture', 'overlay', 'b_roll', 'audio_layer']),
      integration_method: z.string(),
      processing_needs: z.array(z.string())
    })),
    
    unused_assets: z.array(z.object({
      asset_id: z.string(),
      reason: z.string(),
      alternative_usage: z.string().optional()
    }))
  }),
  
  // Gap analysis and resolution
  gap_analysis: z.object({
    identified_gaps: z.array(z.object({
      gap_type: z.enum(['content', 'style', 'technical', 'format', 'quality']),
      description: z.string(),
      impact_level: z.enum(['critical', 'high', 'medium', 'low']),
      suggested_resolution: z.string(),
      alternative_solutions: z.array(z.string()).optional()
    })),
    
    contradictions: z.array(z.object({
      contradiction_type: z.enum(['intent_vs_assets', 'asset_vs_asset', 'constraint_vs_capability']),
      description: z.string(),
      affected_elements: z.array(z.string()),
      resolution_strategy: z.string(),
      impact_assessment: z.string()
    })),
    
    missing_elements: z.array(z.object({
      element_type: z.enum(['asset', 'specification', 'constraint', 'creative_direction']),
      description: z.string(),
      importance: z.enum(['essential', 'recommended', 'optional']),
      default_suggestion: z.string(),
      acquisition_method: z.enum(['generate', 'source', 'derive', 'infer'])
    }))
  }),
  
  // Creative synthesis
  creative_synthesis: z.object({
    unified_creative_direction: z.string(),
    style_fusion_strategy: z.string(),
    mood_integration_plan: z.string(),
    narrative_structure: z.string().optional(),
    visual_hierarchy: z.array(z.string()),
    audio_visual_alignment: z.string().optional(),
    brand_voice_integration: z.string().optional()
  }),
  
  // Production recommendations
  production_recommendations: z.object({
    recommended_pipeline: z.array(z.object({
      step_number: z.number(),
      step_name: z.string(),
      description: z.string(),
      input_assets: z.array(z.string()),
      output_expectation: z.string(),
      tools_needed: z.array(z.string()),
      estimated_time: z.string(),
      complexity_level: z.enum(['easy', 'moderate', 'complex', 'expert'])
    })),
    
    quality_targets: z.object({
      technical_quality: z.enum(['acceptable', 'good', 'excellent', 'professional']),
      creative_quality: z.enum(['functional', 'appealing', 'impressive', 'exceptional']),
      consistency_level: z.enum(['basic', 'good', 'high', 'perfect']),
      polish_level: z.enum(['draft', 'refined', 'polished', 'premium'])
    }),
    
    optimization_suggestions: z.array(z.object({
      optimization_type: z.enum(['performance', 'quality', 'cost', 'time', 'complexity']),
      suggestion: z.string(),
      impact: z.string(),
      implementation_effort: z.enum(['minimal', 'moderate', 'significant', 'major'])
    }))
  }),
  
  // Processing metadata
  synthesis_metadata: z.object({
    analysis_timestamp: z.string(),
    processing_time_ms: z.number(),
    synthesis_confidence: z.number().min(0).max(1),
    query_asset_alignment_score: z.number().min(0).max(1),
    completeness_score: z.number().min(0).max(1),
    complexity_assessment: z.enum(['simple', 'moderate', 'complex', 'highly_complex']),
    ai_models_used: z.array(z.string()),
    synthesis_approach: z.string(),
    validation_checks_passed: z.number(),
    warnings: z.array(z.string()).optional(),
    recommendations_confidence: z.number().min(0).max(1)
  })
});

export type UnifiedProjectUnderstanding = z.infer<typeof UnifiedProjectUnderstandingSchema>;

interface Step3AnalysisOptions {
  enable_ai_synthesis?: boolean;
  synthesis_model?: 'llama31_405b' | 'llama31_70b' | 'qwen25_72b' | 'auto';
  include_creative_suggestions?: boolean;
  include_production_planning?: boolean;
  gap_analysis_depth?: 'basic' | 'detailed' | 'comprehensive';
  enable_contradiction_resolution?: boolean;
  optimization_focus?: 'quality' | 'speed' | 'cost' | 'balanced';
  synthesis_timeout?: number;
}

/**
 * Main function to combine query analysis and asset analysis into unified understanding
 */
export async function combineQueryAndAssets(
  queryAnalysis: QueryAnalysisResult,
  assetAnalysis: Step2AnalysisResult,
  options: Step3AnalysisOptions = {}
): Promise<{
  success: boolean;
  result?: UnifiedProjectUnderstanding;
  error?: string;
  warnings?: string[];
}> {
  const startTime = Date.now();
  const projectId = `project_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  
  const {
    enable_ai_synthesis = true,
    synthesis_model = 'auto',
    include_creative_suggestions = true,
    include_production_planning = true,
    gap_analysis_depth = 'detailed',
    enable_contradiction_resolution = true,
    optimization_focus = 'balanced',
    synthesis_timeout = 90000 // 1.5 minutes
  } = options;

  console.log(`[Step3-Combiner] ${projectId} - Starting synthesis of query + ${assetAnalysis.total_assets} assets`);

  try {
    const warnings: string[] = [];

    // Step 1: Unify intent and creative direction
    const unifiedIntent = await unifyIntentAndDirection(
      queryAnalysis,
      assetAnalysis,
      { enable_ai_synthesis, synthesis_model, synthesis_timeout }
    );

    // Step 2: Merge and unify constraints
    const unifiedConstraints = await unifyConstraints(
      queryAnalysis,
      assetAnalysis,
      unifiedIntent
    );

    // Step 3: Create asset utilization plan
    const assetUtilization = await createAssetUtilizationPlan(
      queryAnalysis,
      assetAnalysis.asset_analyses,
      unifiedIntent,
      unifiedConstraints
    );

    // Step 4: Perform gap analysis and identify contradictions
    const gapAnalysis = await performGapAnalysis(
      queryAnalysis,
      assetAnalysis,
      unifiedIntent,
      unifiedConstraints,
      assetUtilization,
      { depth: gap_analysis_depth, enable_contradiction_resolution }
    );

    // Step 5: Generate creative synthesis
    const creativeSynthesis = await generateCreativeSynthesis(
      queryAnalysis,
      assetAnalysis,
      unifiedIntent,
      assetUtilization,
      { enable_ai_synthesis, synthesis_model, include_creative_suggestions, synthesis_timeout }
    );

    // Step 6: Create production recommendations
    const productionRecommendations = await generateProductionRecommendations(
      unifiedIntent,
      unifiedConstraints,
      assetUtilization,
      gapAnalysis,
      creativeSynthesis,
      { include_production_planning, optimization_focus }
    );

    // Step 7: Calculate synthesis metadata
    const processingTime = Date.now() - startTime;
    const synthesisMetadata = calculateSynthesisMetadata(
      queryAnalysis,
      assetAnalysis,
      unifiedIntent,
      assetUtilization,
      gapAnalysis,
      processingTime,
      warnings
    );

    // Generate project title
    const projectTitle = generateProjectTitle(unifiedIntent, queryAnalysis);

    // Construct final unified understanding
    const unifiedUnderstanding: UnifiedProjectUnderstanding = {
      project_id: projectId,
      project_title: projectTitle,
      unified_intent: unifiedIntent,
      unified_constraints: unifiedConstraints,
      asset_utilization: assetUtilization,
      gap_analysis: gapAnalysis,
      creative_synthesis: creativeSynthesis,
      production_recommendations: productionRecommendations,
      synthesis_metadata: synthesisMetadata
    };

    // Validate the final result
    const validation = UnifiedProjectUnderstandingSchema.safeParse(unifiedUnderstanding);
    if (!validation.success) {
      console.error(`[Step3-Combiner] ${projectId} - Validation failed:`, validation.error.format());
      return {
        success: false,
        error: `Synthesis validation failed: ${JSON.stringify(validation.error.format())}`,
        warnings
      };
    }

    console.log(`[Step3-Combiner] ${projectId} - Synthesis completed successfully in ${processingTime}ms`);
    console.log(`[Step3-Combiner] ${projectId} - Unified intent: ${unifiedIntent.primary_output_type} (${(unifiedIntent.confidence * 100).toFixed(1)}% confidence)`);
    console.log(`[Step3-Combiner] ${projectId} - Asset utilization: ${assetUtilization.primary_assets.length} primary, ${assetUtilization.reference_assets.length} reference`);
    console.log(`[Step3-Combiner] ${projectId} - Gaps identified: ${gapAnalysis.identified_gaps.length}, Contradictions: ${gapAnalysis.contradictions.length}`);

    return {
      success: true,
      result: validation.data,
      warnings: warnings.length > 0 ? warnings : undefined
    };

  } catch (error) {
    console.error(`[Step3-Combiner] ${projectId} - Synthesis failed:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown synthesis error',
      warnings
    };
  }
}

/**
 * Unify intent and creative direction from query and assets
 */
async function unifyIntentAndDirection(
  queryAnalysis: QueryAnalysisResult,
  assetAnalysis: Step2AnalysisResult,
  options: { enable_ai_synthesis: boolean; synthesis_model: string; synthesis_timeout: number }
): Promise<any> {
  console.log(`[Step3-Combiner] Unifying intent and creative direction`);
  
  // Extract primary intent from query
  const queryIntent = queryAnalysis.intent.primary_output_type;
  const queryConfidence = queryAnalysis.intent.confidence;
  
  // Analyze asset types and their alignment
  const assetTypes = assetAnalysis.summary.asset_type_breakdown;
  const primaryContentAssets = assetAnalysis.summary.primary_content_assets;
  
  // Determine if there are conflicts between query intent and assets
  let unifiedOutputType = queryIntent;
  let confidence = queryConfidence;
  let reasoning = queryAnalysis.intent.reasoning;
  
  // Check for intent reinforcement from assets
  if (queryIntent === 'image' && assetTypes.image > 0) {
    confidence = Math.min(1.0, confidence + 0.1);
    reasoning += ' Assets support image creation intent.';
  } else if (queryIntent === 'video' && (assetTypes.video > 0 || assetTypes.image > 0)) {
    confidence = Math.min(1.0, confidence + 0.1);
    reasoning += ' Assets support video creation intent.';
  } else if (queryIntent === 'audio' && assetTypes.audio > 0) {
    confidence = Math.min(1.0, confidence + 0.1);
    reasoning += ' Assets support audio creation intent.';
  }
  
  // Detect mixed content scenarios
  const assetTypeCount = Object.keys(assetTypes).length;
  let secondaryOutputs: string[] = [];
  
  if (assetTypeCount > 1) {
    if (queryIntent === 'video') {
      secondaryOutputs = Object.keys(assetTypes).filter(type => type !== 'video' && assetTypes[type] > 0);
    } else if (queryIntent === 'image' && assetTypes.video > 0) {
      secondaryOutputs = ['video'];
      unifiedOutputType = 'mixed';
    }
  }
  
  // Generate creative direction using AI synthesis if enabled
  let creativeDirection = 'Standard content creation following user requirements';
  let targetOutcome = `Create ${queryIntent} content as specified`;
  
  if (options.enable_ai_synthesis) {
    try {
      const aiSynthesis = await generateAICreativeDirection(
        queryAnalysis,
        assetAnalysis,
        unifiedOutputType,
        options.synthesis_model,
        options.synthesis_timeout
      );
      
      if (aiSynthesis.success) {
        creativeDirection = aiSynthesis.creative_direction;
        targetOutcome = aiSynthesis.target_outcome;
        reasoning += ` AI synthesis: ${aiSynthesis.reasoning}`;
      }
    } catch (error) {
      console.warn(`[Step3-Combiner] AI synthesis failed, using fallback:`, error);
    }
  }
  
  return {
    primary_output_type: unifiedOutputType,
    confidence,
    secondary_outputs: secondaryOutputs.length > 0 ? secondaryOutputs : undefined,
    creative_direction: creativeDirection,
    target_outcome: targetOutcome,
    reasoning
  };
}

/**
 * Generate AI-powered creative direction synthesis
 */
async function generateAICreativeDirection(
  queryAnalysis: QueryAnalysisResult,
  assetAnalysis: Step2AnalysisResult,
  outputType: string,
  model: string,
  timeout: number
): Promise<{
  success: boolean;
  creative_direction: string;
  target_outcome: string;
  reasoning: string;
}> {
  const synthesisPrompt = createSynthesisPrompt(queryAnalysis, assetAnalysis, outputType);
  
  try {
    let modelResult: any;
    
    // Select and execute model
    switch (model) {
      case 'llama31_405b':
        modelResult = await executeTogetherAILlama31405B({
          prompt: createLlama31405BPrompt(LLAMA31_405B_SYSTEM_PROMPTS.creative_analysis, synthesisPrompt),
          max_tokens: 1000,
          temperature: 0.2
        });
        break;
        
      case 'llama31_70b':
        modelResult = await executeTogetherAILlama3170B({
          prompt: synthesisPrompt,
          max_tokens: 800,
          temperature: 0.2
        });
        break;
        
      case 'qwen25_72b':
        modelResult = await executeTogetherAIQwen2572B({
          prompt: synthesisPrompt,
          max_tokens: 800,
          temperature: 0.2
        });
        break;
        
      default: // auto
        modelResult = await executeTogetherAILlama31405B({
          prompt: createLlama31405BPrompt(LLAMA31_405B_SYSTEM_PROMPTS.creative_analysis, synthesisPrompt),
          max_tokens: 1000,
          temperature: 0.2
        });
        break;
    }
    
    // Parse AI response
    const response = modelResult.text;
    const lines = response.split('\n').filter(line => line.trim());
    
    let creativeDirection = 'Professional content creation with strategic asset utilization';
    let targetOutcome = `Create high-quality ${outputType} content that maximizes asset potential`;
    let reasoning = 'AI-generated creative synthesis based on query-asset analysis';
    
    // Extract structured information from AI response
    for (const line of lines) {
      if (line.toLowerCase().includes('creative direction:')) {
        creativeDirection = line.split(':').slice(1).join(':').trim();
      } else if (line.toLowerCase().includes('target outcome:')) {
        targetOutcome = line.split(':').slice(1).join(':').trim();
      } else if (line.toLowerCase().includes('reasoning:')) {
        reasoning = line.split(':').slice(1).join(':').trim();
      }
    }
    
    return {
      success: true,
      creative_direction: creativeDirection,
      target_outcome: targetOutcome,
      reasoning
    };
    
  } catch (error) {
    console.error(`[Step3-Combiner] AI creative direction failed:`, error);
    return {
      success: false,
      creative_direction: 'Standard creative approach',
      target_outcome: `Professional ${outputType} content creation`,
      reasoning: 'Fallback creative direction due to AI synthesis failure'
    };
  }
}

/**
 * Calculate synthesis metadata
 */
function calculateSynthesisMetadata(
  queryAnalysis: QueryAnalysisResult,
  assetAnalysis: Step2AnalysisResult,
  unifiedIntent: any,
  assetUtilization: any,
  gapAnalysis: any,
  processingTime: number,
  warnings: string[]
): any {
  const queryAssetAlignmentScore = calculateQueryAssetAlignment(queryAnalysis, assetAnalysis);
  const completenessScore = calculateCompletenessScore(queryAnalysis, assetAnalysis, gapAnalysis);
  const complexityAssessment = assessProjectComplexity(queryAnalysis, assetAnalysis, gapAnalysis);
  
  const validationChecks = performValidationChecks(unifiedIntent, assetUtilization, gapAnalysis);
  
  return {
    analysis_timestamp: new Date().toISOString(),
    processing_time_ms: processingTime,
    synthesis_confidence: Math.min(unifiedIntent.confidence, queryAssetAlignmentScore),
    query_asset_alignment_score: queryAssetAlignmentScore,
    completeness_score: completenessScore,
    complexity_assessment: complexityAssessment,
    ai_models_used: ['llama-31-405b', 'synthesis-engine'],
    synthesis_approach: 'ai_enhanced_rule_based',
    validation_checks_passed: validationChecks,
    warnings: warnings.length > 0 ? warnings : undefined,
    recommendations_confidence: calculateRecommendationsConfidence(gapAnalysis, assetUtilization)
  };
}

/**
 * Generate project title from unified intent
 */
function generateProjectTitle(unifiedIntent: any, queryAnalysis: QueryAnalysisResult): string {
  const outputType = unifiedIntent.primary_output_type;
  const normalizedPrompt = queryAnalysis.normalized_prompt;
  
  // Extract key nouns and themes from the prompt
  const words = normalizedPrompt.split(' ').filter(w => w.length > 3);
  const keyWords = words.slice(0, 3).join(' ');
  
  // Create descriptive title
  const typeCapitalized = outputType.charAt(0).toUpperCase() + outputType.slice(1);
  
  if (keyWords.length > 0) {
    return `${typeCapitalized} Project: ${keyWords}`;
  }
  
  return `${typeCapitalized} Content Creation Project`;
}

/**
 * Helper calculation functions
 */
function calculateQueryAssetAlignment(queryAnalysis: QueryAnalysisResult, assetAnalysis: Step2AnalysisResult): number {
  const alignmentScores = assetAnalysis.asset_analyses.map(a => a.alignment_with_query.alignment_score);
  
  if (alignmentScores.length === 0) return 0.5;
  
  const averageAlignment = alignmentScores.reduce((a, b) => a + b, 0) / alignmentScores.length;
  return Math.round(averageAlignment * 100) / 100;
}

function calculateCompletenessScore(queryAnalysis: QueryAnalysisResult, assetAnalysis: Step2AnalysisResult, gapAnalysis: any): number {
  let score = 1.0;
  
  // Deduct for gaps
  const criticalGaps = gapAnalysis.identified_gaps.filter((g: any) => g.impact_level === 'critical').length;
  const highGaps = gapAnalysis.identified_gaps.filter((g: any) => g.impact_level === 'high').length;
  
  score -= criticalGaps * 0.3;
  score -= highGaps * 0.15;
  
  // Deduct for missing elements
  const essentialMissing = gapAnalysis.missing_elements.filter((e: any) => e.importance === 'essential').length;
  score -= essentialMissing * 0.2;
  
  return Math.max(0.1, Math.min(1.0, score));
}

function assessProjectComplexity(queryAnalysis: QueryAnalysisResult, assetAnalysis: Step2AnalysisResult, gapAnalysis: any): 'simple' | 'moderate' | 'complex' | 'highly_complex' {
  let complexityPoints = 0;
  
  // Asset diversity
  const assetTypes = Object.keys(assetAnalysis.summary.asset_type_breakdown).length;
  complexityPoints += assetTypes * 1;
  
  // Enhancement needs
  const enhancementRatio = assetAnalysis.summary.enhancement_needed_assets.length / assetAnalysis.total_assets;
  complexityPoints += enhancementRatio * 3;
  
  // Gap count
  complexityPoints += gapAnalysis.identified_gaps.length * 0.5;
  complexityPoints += gapAnalysis.contradictions.length * 1;
  
  // Query complexity
  const queryWords = queryAnalysis.normalized_prompt.split(' ').length;
  if (queryWords > 20) complexityPoints += 1;
  
  if (complexityPoints >= 8) return 'highly_complex';
  if (complexityPoints >= 5) return 'complex';
  if (complexityPoints >= 2) return 'moderate';
  return 'simple';
}

function performValidationChecks(unifiedIntent: any, assetUtilization: any, gapAnalysis: any): number {
  let passedChecks = 0;
  const totalChecks = 5;
  
  // Check 1: Intent clarity
  if (unifiedIntent.confidence > 0.7) passedChecks++;
  
  // Check 2: Asset utilization
  if (assetUtilization.primary_assets.length > 0) passedChecks++;
  
  // Check 3: No critical gaps
  const criticalGaps = gapAnalysis.identified_gaps.filter((g: any) => g.impact_level === 'critical').length;
  if (criticalGaps === 0) passedChecks++;
  
  // Check 4: Reasonable complexity
  const totalGapsAndContradictions = gapAnalysis.identified_gaps.length + gapAnalysis.contradictions.length;
  if (totalGapsAndContradictions < 5) passedChecks++;
  
  // Check 5: Asset quality
  if (assetUtilization.primary_assets.some((a: any) => a.processing_priority === 'critical' || a.processing_priority === 'high')) {
    passedChecks++;
  }
  
  return passedChecks;
}

function calculateRecommendationsConfidence(gapAnalysis: any, assetUtilization: any): number {
  let confidence = 0.8;
  
  // Reduce confidence for many gaps
  const totalIssues = gapAnalysis.identified_gaps.length + gapAnalysis.contradictions.length;
  confidence -= totalIssues * 0.05;
  
  // Increase confidence for good asset utilization
  if (assetUtilization.primary_assets.length > 0) confidence += 0.1;
  if (assetUtilization.unused_assets.length / (assetUtilization.primary_assets.length + assetUtilization.supporting_assets.length + 1) < 0.3) {
    confidence += 0.1;
  }
  
  return Math.max(0.3, Math.min(1.0, confidence));
}

// Import helper functions
export { 
  unifyConstraints,
  createAssetUtilizationPlan, 
  performGapAnalysis,
  generateCreativeSynthesis,
  generateProductionRecommendations,
  createSynthesisPrompt
} from './step3-combination-helpers';
