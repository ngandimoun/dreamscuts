/**
 * Step 4: JSON Summarizer Helper Functions
 * 
 * Helper functions for creating each section of the final analysis output
 */

import { QueryAnalysisResult } from './query-analyzer';
import { Step2AnalysisResult } from './step2-asset-analyzer';
import { UnifiedProjectUnderstanding } from './step3-combination-analyzer';
// Import utility functions
import * as utils from './step4-summarizer-utils';

// Import specific utility functions for direct use
import {
  mapProcessingStatus,
  formatFileSize,
  formatDuration,
  mapQualityScore,
  calculateSuccessProbability,
  calculateTechnicalFeasibility,
  calculateCreativeFeasibility,
  calculateResourceAdequacy,
  mapStepCategory,
  mapToolType,
  generateToolPurpose,
  generateToolAlternatives,
  mapComplexityLevel,
  calculateStepSuccessProbability,
  mapQualityTarget,
  mapCreativeQualityTarget,
  mapConsistencyTarget,
  mapPolishTarget,
  mapImplementationEffort,
  derivePriorityLevel
} from './step4-summarizer-utils';

/**
 * Create query summary section
 */
export function createQuerySummary(
  queryAnalysis: QueryAnalysisResult,
  unifiedUnderstanding: UnifiedProjectUnderstanding,
  detailLevel: string
): any {
  // Extract technical requirements
  const outputCount = queryAnalysis.constraints.image_count || 
                      (queryAnalysis.constraints.duration_seconds ? 1 : undefined) || 
                      (queryAnalysis.constraints.audio_length_seconds ? 1 : undefined);
  
  const technicalRequirements = {
    output_count: outputCount,
    duration_seconds: queryAnalysis.constraints.duration_seconds || undefined,
    aspect_ratio: queryAnalysis.constraints.aspect_ratio || undefined,
    resolution: queryAnalysis.constraints.resolution || undefined,
    format_preferences: queryAnalysis.constraints.image_format ? [queryAnalysis.constraints.image_format] : undefined,
    quality_level: utils.deriveQualityLevel(queryAnalysis.modifiers.technical_specs)
  };

  // Extract creative requirements
  const creativeRequirements = {
    style_preferences: queryAnalysis.modifiers.style,
    mood_requirements: queryAnalysis.modifiers.mood,
    theme_elements: queryAnalysis.modifiers.theme,
    color_preferences: queryAnalysis.modifiers.aesthetic,
    brand_requirements: utils.extractBrandRequirements(queryAnalysis.original_prompt)
  };

  // Extract platform requirements
  const platformRequirements = {
    target_platforms: queryAnalysis.constraints.platform || undefined,
    distribution_format: queryAnalysis.constraints.image_format || queryAnalysis.constraints.video_format || queryAnalysis.constraints.audio_format || undefined,
    platform_specific_constraints: utils.derivePlatformConstraints(queryAnalysis.constraints.platform)
  };

  // Extract timeline requirements
  const timelineRequirements = {
    urgency_level: utils.deriveUrgencyLevel(queryAnalysis.constraints.timeline || undefined),
    deadline: queryAnalysis.constraints.timeline || undefined,
    estimated_timeline: utils.estimateProjectTimeline(unifiedUnderstanding.production_recommendations.recommended_pipeline)
  };

  // Convert gaps to proper format
  const identifiedGaps = Object.entries(queryAnalysis.gaps)
    .filter(([_, value]) => value === true)
    .map(([key, _]) => ({
      gap_type: utils.mapGapTypeToCategory(key),
      description: utils.generateGapDescription(key),
      impact_level: utils.assessGapImpact(key),
      suggested_defaults: utils.generateDefaultSuggestion(key, queryAnalysis.intent.primary_output_type)
    }));

  return {
    original_prompt: queryAnalysis.original_prompt,
    normalized_prompt: queryAnalysis.normalized_prompt,
    parsed_intent: {
      primary_output_type: unifiedUnderstanding.unified_intent.primary_output_type,
      confidence: unifiedUnderstanding.unified_intent.confidence,
      secondary_outputs: unifiedUnderstanding.unified_intent.secondary_outputs,
      intent_description: unifiedUnderstanding.unified_intent.creative_direction,
      user_goal: unifiedUnderstanding.unified_intent.target_outcome
    },
    extracted_constraints: {
      technical_requirements: technicalRequirements,
      creative_requirements: creativeRequirements,
      platform_requirements: platformRequirements,
      timeline_requirements: timelineRequirements
    },
    identified_gaps: identifiedGaps
  };
}

/**
 * Create assets analysis section
 */
export function createAssetsAnalysis(
  assetAnalysis: Step2AnalysisResult,
  unifiedUnderstanding: UnifiedProjectUnderstanding,
  processingTime: number,
  detailLevel: string
): any {
  const successful = assetAnalysis.asset_analyses.filter(a => a.processing_info.success === true).length;
  const failed = assetAnalysis.asset_analyses.filter(a => a.processing_info.success === false).length;
  const partial = assetAnalysis.asset_analyses.length - successful - failed;

  // Create individual asset summaries (filter out text assets as they're not supported in final output)
  const individualAssets = assetAnalysis.asset_analyses
    .filter(asset => asset.asset_type !== 'text')
    .map(asset => {
    const utilizationAsset = findAssetInUtilization(asset.asset_id, unifiedUnderstanding.asset_utilization);
    
    return {
      asset_id: asset.asset_id,
      asset_type: asset.asset_type,
      analysis_status: mapProcessingStatus(asset.processing_info.success ? 'success' : 'failed'),
      metadata_summary: {
        file_size: asset.metadata.file_size ? formatFileSize(asset.metadata.file_size) : undefined,
        dimensions: asset.metadata.dimensions ? 
          `${asset.metadata.dimensions.width}x${asset.metadata.dimensions.height}` : undefined,
        duration: asset.metadata.duration_seconds ? formatDuration(asset.metadata.duration_seconds) : undefined,
        format: asset.metadata.format || undefined,
        quality_score: asset.metadata.quality_score || undefined
      },
      content_summary: {
        primary_description: asset.content_analysis.primary_description || 'No description available',
        key_elements: asset.content_analysis.objects_detected || [],
        style_characteristics: asset.content_analysis.style_analysis || undefined,
        mood_tone: asset.content_analysis.mood_assessment || undefined,
        technical_quality: mapQualityScore(asset.metadata.quality_score),
        usability_assessment: asset.content_analysis.quality_assessment || 'No assessment available'
      },
      alignment_with_query: {
        alignment_score: asset.alignment_with_query.alignment_score || 0.5,
        role_in_project: mapRoleInProject(asset.alignment_with_query.role_in_project),
        specific_contributions: asset.alignment_with_query.usage_recommendations || [],
        recommended_usage: generateRecommendedUsage(asset, utilizationAsset)
      },
      processing_recommendations: {
        enhancement_needed: asset.processing_needs.requires_enhancement || false,
        recommended_tools: asset.processing_needs.recommended_tools || [],
        processing_priority: mapProcessingPriority(utilizationAsset),
        estimated_processing_time: estimateAssetProcessingTime(asset)
      }
    };
  });

  // Create quality distribution
  const qualityDistribution = createQualityDistribution(assetAnalysis.asset_analyses);

  return {
    total_assets_processed: assetAnalysis.total_assets,
    asset_type_breakdown: assetAnalysis.summary.asset_type_breakdown,
    processing_summary: {
      successful_analyses: successful,
      failed_analyses: failed,
      partial_analyses: partial,
      total_processing_time_ms: processingTime
    },
    individual_assets: individualAssets,
    asset_quality_overview: {
      overall_quality_score: assetAnalysis.summary.overall_quality_score,
      high_quality_assets: assetAnalysis.asset_analyses.filter(a => (a.metadata.quality_score || 0) >= 7).length,
      enhancement_needed_assets: assetAnalysis.summary.enhancement_needed_assets.length,
      unusable_assets: assetAnalysis.asset_analyses.filter(a => (a.metadata.quality_score || 0) < 3).length,
      quality_distribution: qualityDistribution
    }
  };
}

/**
 * Create global understanding section
 */
export function createGlobalUnderstanding(
  queryAnalysis: QueryAnalysisResult,
  assetAnalysis: Step2AnalysisResult,
  unifiedUnderstanding: UnifiedProjectUnderstanding,
  detailLevel: string
): any {
  // Determine project type
  const projectType = determineProjectType(
    queryAnalysis.intent.primary_output_type,
    assetAnalysis.summary.asset_type_breakdown,
    unifiedUnderstanding.gap_analysis.identified_gaps
  );

  // Calculate success probability
  const successProbability = calculateSuccessProbability(
    unifiedUnderstanding.synthesis_metadata.completeness_score,
    unifiedUnderstanding.synthesis_metadata.query_asset_alignment_score,
    unifiedUnderstanding.gap_analysis.identified_gaps
  );

  // Create asset utilization strategy
  const assetUtilizationStrategy = {
    primary_content_plan: {
      asset_count: unifiedUnderstanding.asset_utilization.primary_assets.length,
      utilization_approach: generateUtilizationApproach(unifiedUnderstanding.asset_utilization.primary_assets),
      enhancement_strategy: generateEnhancementStrategy(unifiedUnderstanding.asset_utilization.primary_assets),
      expected_output_quality: mapQualityTarget(unifiedUnderstanding.production_recommendations.quality_targets.technical_quality)
    },
    reference_material_plan: {
      reference_count: unifiedUnderstanding.asset_utilization.reference_assets.length,
      extraction_strategy: generateExtractionStrategy(unifiedUnderstanding.asset_utilization.reference_assets),
      application_method: generateApplicationMethod(unifiedUnderstanding.asset_utilization.reference_assets)
    },
    supporting_elements_plan: {
      supporting_count: unifiedUnderstanding.asset_utilization.supporting_assets.length,
      integration_approach: generateIntegrationApproach(unifiedUnderstanding.asset_utilization.supporting_assets),
      enhancement_needs: extractEnhancementNeeds(unifiedUnderstanding.asset_utilization.supporting_assets)
    }
  };

  // Create identified challenges
  const identifiedChallenges = [
    ...unifiedUnderstanding.gap_analysis.identified_gaps.map(gap => ({
      challenge_type: mapChallengeType(gap.gap_type),
      description: gap.description,
      impact_assessment: mapImpactLevel(gap.impact_level),
      mitigation_strategy: gap.suggested_resolution,
      resolution_confidence: calculateResolutionConfidence(gap.impact_level, gap.gap_type)
    })),
    ...unifiedUnderstanding.gap_analysis.contradictions.map(contradiction => ({
      challenge_type: 'alignment' as const,
      description: contradiction.description,
      impact_assessment: mapImpactLevel('medium'),
      mitigation_strategy: contradiction.resolution_strategy,
      resolution_confidence: 0.75
    }))
  ];

  // Calculate project feasibility
  const projectFeasibility = {
    technical_feasibility: calculateTechnicalFeasibility(unifiedUnderstanding),
    creative_feasibility: calculateCreativeFeasibility(unifiedUnderstanding),
    resource_adequacy: calculateResourceAdequacy(unifiedUnderstanding),
    overall_feasibility: 0, // Will be calculated below
    risk_factors: identifyRiskFactors(unifiedUnderstanding)
  };
  
  projectFeasibility.overall_feasibility = 
    (projectFeasibility.technical_feasibility + 
     projectFeasibility.creative_feasibility + 
     projectFeasibility.resource_adequacy) / 3;

  return {
    project_overview: {
      project_title: unifiedUnderstanding.project_title,
      project_type: projectType,
      complexity_level: unifiedUnderstanding.synthesis_metadata.complexity_assessment,
      estimated_scope: generateProjectScope(unifiedUnderstanding),
      success_probability: successProbability
    },
    unified_creative_direction: {
      core_concept: unifiedUnderstanding.creative_synthesis.unified_creative_direction,
      visual_approach: unifiedUnderstanding.creative_synthesis.style_fusion_strategy,
      style_direction: unifiedUnderstanding.creative_synthesis.style_fusion_strategy,
      mood_atmosphere: unifiedUnderstanding.creative_synthesis.mood_integration_plan,
      narrative_approach: unifiedUnderstanding.creative_synthesis.narrative_structure,
      brand_voice: unifiedUnderstanding.creative_synthesis.brand_voice_integration
    },
    asset_utilization_strategy: assetUtilizationStrategy,
    identified_challenges: identifiedChallenges,
    project_feasibility: projectFeasibility
  };
}

/**
 * Create creative options section
 */
export function createCreativeOptions(
  unifiedUnderstanding: UnifiedProjectUnderstanding,
  includeAlternatives: boolean,
  includeEnhancements: boolean,
  detailLevel: string,
  targetAudience: string
): any {
  const primaryCreativeDirection = {
    approach_name: extractApproachName(unifiedUnderstanding.creative_synthesis.unified_creative_direction),
    description: unifiedUnderstanding.creative_synthesis.unified_creative_direction,
    style_elements: extractStyleElements(unifiedUnderstanding.creative_synthesis.style_fusion_strategy),
    mood_elements: extractMoodElements(unifiedUnderstanding.creative_synthesis.mood_integration_plan),
    technical_approach: generateTechnicalApproach(unifiedUnderstanding.production_recommendations),
    expected_outcome: unifiedUnderstanding.unified_intent.target_outcome,
    confidence_score: unifiedUnderstanding.synthesis_metadata.synthesis_confidence
  };

  const alternativeApproaches = includeAlternatives ? 
    generateAlternativeApproaches(unifiedUnderstanding, detailLevel) : [];

  const creativeEnhancements = includeEnhancements ? 
    generateCreativeEnhancements(unifiedUnderstanding, targetAudience) : [];

  const styleVariations = generateStyleVariations(
    unifiedUnderstanding.creative_synthesis.style_fusion_strategy,
    unifiedUnderstanding.asset_utilization.reference_assets
  );

  return {
    primary_creative_direction: primaryCreativeDirection,
    alternative_approaches: alternativeApproaches,
    creative_enhancements: creativeEnhancements,
    style_variations: styleVariations
  };
}

/**
 * Create pipeline recommendations section
 */
export function createPipelineRecommendations(
  unifiedUnderstanding: UnifiedProjectUnderstanding,
  optimizationFocus: string,
  includeDetailedPipeline: boolean,
  detailLevel: string
): any {
  // Convert pipeline steps to required format
  const recommendedWorkflow = unifiedUnderstanding.production_recommendations.recommended_pipeline.map(step => ({
    step_number: step.step_number,
    step_name: step.step_name,
    step_category: mapStepCategory(step.step_name),
    description: step.description,
    input_requirements: step.input_assets || [],
    output_deliverables: [step.output_expectation],
    tools_and_models: (step.tools_needed || []).map(tool => ({
      tool_type: mapToolType(tool),
      tool_name: tool,
      purpose: generateToolPurpose(tool, step.step_name),
      alternatives: generateToolAlternatives(tool)
    })),
    estimated_time: step.estimated_time,
    complexity_level: mapComplexityLevel(step.complexity_level),
    success_probability: calculateStepSuccessProbability(step, unifiedUnderstanding),
    dependencies: step.step_number > 1 ? [`Step ${step.step_number - 1}`] : undefined
  }));

  // Map quality targets
  const qualityTargets = {
    technical_quality_target: mapQualityTarget(unifiedUnderstanding.production_recommendations.quality_targets.technical_quality),
    creative_quality_target: mapCreativeQualityTarget(unifiedUnderstanding.production_recommendations.quality_targets.creative_quality),
    consistency_target: mapConsistencyTarget(unifiedUnderstanding.production_recommendations.quality_targets.consistency_level),
    polish_level_target: mapPolishTarget(unifiedUnderstanding.production_recommendations.quality_targets.polish_level)
  };

  // Convert optimization suggestions
  const optimizationRecommendations = unifiedUnderstanding.production_recommendations.optimization_suggestions.map(opt => ({
    optimization_type: mapOptimizationType(opt.optimization_type),
    recommendation: opt.suggestion,
    expected_impact: opt.impact,
    implementation_effort: mapImplementationEffort(opt.implementation_effort),
    priority_level: derivePriorityLevel(opt.optimization_type, optimizationFocus)
  }));

  // Generate fallback strategies
  const fallbackStrategies = generateFallbackStrategies(unifiedUnderstanding);

  // Create success metrics
  const successMetrics = generateSuccessMetrics(unifiedUnderstanding);

  return {
    recommended_workflow: recommendedWorkflow,
    quality_targets: qualityTargets,
    optimization_recommendations: optimizationRecommendations,
    fallback_strategies: fallbackStrategies,
    success_metrics: successMetrics
  };
}

/**
 * Create processing insights section
 */
export function createProcessingInsights(
  queryAnalysis: QueryAnalysisResult,
  assetAnalysis: Step2AnalysisResult,
  unifiedUnderstanding: UnifiedProjectUnderstanding,
  step1Time: number,
  step2Time: number,
  step3Time: number,
  warnings: string[]
): any {
  const modelUsageSummary = [
    {
      step_name: 'Query Analysis',
      models_used: ['together-ai-llama-31-405b', 'together-ai-llama-31-70b'],
      processing_time: step1Time,
      success_rate: queryAnalysis.intent.confidence
    },
    {
      step_name: 'Asset Analysis',
      models_used: ['replicate-llava-13b', 'replicate-blip', 'replicate-moondream2', 'replicate-apollo-7b', 'replicate-whisper-large-v3'],
      processing_time: step2Time,
      success_rate: assetAnalysis.asset_analyses.filter(a => a.processing_info.success === true).length / assetAnalysis.total_assets
    },
    {
      step_name: 'Synthesis & Combination',
      models_used: unifiedUnderstanding.synthesis_metadata.ai_models_used,
      processing_time: step3Time,
      success_rate: unifiedUnderstanding.synthesis_metadata.synthesis_confidence
    }
  ];

  const confidenceBreakdown = {
    query_analysis_confidence: queryAnalysis.intent.confidence,
    asset_analysis_confidence: assetAnalysis.summary.overall_quality_score / 10,
    synthesis_confidence: unifiedUnderstanding.synthesis_metadata.synthesis_confidence,
    overall_confidence: unifiedUnderstanding.synthesis_metadata.synthesis_confidence
  };

  const qualityAssessments = {
    input_quality_score: assetAnalysis.summary.overall_quality_score,
    analysis_thoroughness: unifiedUnderstanding.synthesis_metadata.completeness_score,
    output_completeness: unifiedUnderstanding.synthesis_metadata.completeness_score,
    recommendation_reliability: unifiedUnderstanding.synthesis_metadata.recommendations_confidence
  };

  const warningsAndNotes = [
    ...warnings.map(warning => ({
      type: 'warning' as const,
      message: warning,
      severity: 'medium' as const,
      category: 'technical' as const
    })),
    ...unifiedUnderstanding.synthesis_metadata.warnings?.map(warning => ({
      type: 'warning' as const,
      message: warning,
      severity: 'medium' as const,
      category: 'technical' as const
    })) || [],
    ...generateQualityNotes(unifiedUnderstanding),
    ...generateRecommendationNotes(unifiedUnderstanding)
  ];

  return {
    model_usage_summary: modelUsageSummary,
    confidence_breakdown: confidenceBreakdown,
    quality_assessments: qualityAssessments,
    warnings_and_notes: warningsAndNotes
  };
}

/**
 * Create minimal processing insights for when full insights are disabled
 */
export function createMinimalProcessingInsights(warnings: string[]): any {
  return {
    model_usage_summary: [],
    confidence_breakdown: {
      query_analysis_confidence: 0.8,
      asset_analysis_confidence: 0.8,
      synthesis_confidence: 0.8,
      overall_confidence: 0.8
    },
    quality_assessments: {
      input_quality_score: 7.0,
      analysis_thoroughness: 0.85,
      output_completeness: 0.9,
      recommendation_reliability: 0.8
    },
    warnings_and_notes: warnings.map(warning => ({
      type: 'warning' as const,
      message: warning,
      severity: 'medium' as const,
      category: 'technical' as const
    }))
  };
}

// Helper functions for asset analysis
function findAssetInUtilization(assetId: string, assetUtilization: any): any {
  if (!assetUtilization) return null;
  
  // Search in all asset categories
  const allAssets = [
    ...(assetUtilization.primary_assets || []),
    ...(assetUtilization.reference_assets || []),
    ...(assetUtilization.supporting_assets || []),
    ...(assetUtilization.unused_assets || [])
  ];
  
  return allAssets.find(asset => asset.asset_id === assetId) || null;
}

function generateRecommendedUsage(asset: any, utilizationAsset: any): string {
  if (!utilizationAsset) {
    return 'Asset not utilized in current project plan';
  }
  
  const role = utilizationAsset.role_in_project || 'supporting_element';
  const contributions = utilizationAsset.specific_contributions || [];
  
  switch (role) {
    case 'primary_content':
      return `Primary content: ${contributions.join(', ')}`;
    case 'reference_material':
      return `Reference material: ${contributions.join(', ')}`;
    case 'supporting_element':
      return `Supporting element: ${contributions.join(', ')}`;
    default:
      return `Supporting role: ${contributions.join(', ')}`;
  }
}

function mapProcessingPriority(utilizationAsset: any): 'critical' | 'high' | 'medium' | 'low' {
  if (!utilizationAsset) return 'low';
  
  const role = utilizationAsset.role_in_project;
  switch (role) {
    case 'primary_content':
      return 'critical';
    case 'reference_material':
      return 'high';
    case 'supporting_element':
      return 'medium';
    default:
      return 'low';
  }
}

function estimateAssetProcessingTime(asset: any): string {
  const assetType = asset.asset_type;
  const qualityScore = asset.metadata.quality_score || 5;
  
  let baseTime = 0;
  switch (assetType) {
    case 'image':
      baseTime = qualityScore < 5 ? 5 : 2; // minutes
      break;
    case 'video':
      baseTime = qualityScore < 5 ? 15 : 8; // minutes
      break;
    case 'audio':
      baseTime = qualityScore < 5 ? 3 : 1; // minutes
      break;
    default:
      baseTime = 2;
  }
  
  return `${baseTime} minutes`;
}

function createQualityDistribution(assetAnalyses: any[]): Record<string, number> {
  const distribution: Record<string, number> = {
    'excellent': 0,
    'good': 0,
    'fair': 0,
    'poor': 0
  };
  
  for (const asset of assetAnalyses) {
    const score = asset.metadata.quality_score || 5;
    if (score >= 8) distribution.excellent++;
    else if (score >= 6) distribution.good++;
    else if (score >= 4) distribution.fair++;
    else distribution.poor++;
  }
  
  return distribution;
}

// Additional helper functions for global understanding and creative options
function determineProjectType(primaryOutputType: string, assetBreakdown: any, gaps: any[]): string {
  if (primaryOutputType === 'video') return 'content_creation';
  if (primaryOutputType === 'image') return 'content_creation';
  if (primaryOutputType === 'audio') return 'content_creation';
  if (primaryOutputType === 'mixed') return 'creative_synthesis';
  return 'content_creation';
}

function generateUtilizationApproach(primaryAssets: any[]): string {
  if (!primaryAssets || primaryAssets.length === 0) return 'No primary assets identified';
  return `Utilize ${primaryAssets.length} primary assets as main content foundation`;
}

function generateEnhancementStrategy(primaryAssets: any[]): string {
  if (!primaryAssets || primaryAssets.length === 0) return 'No enhancement needed';
  return 'Apply quality enhancement and optimization to primary assets';
}

function generateExtractionStrategy(referenceAssets: any[]): string {
  if (!referenceAssets || referenceAssets.length === 0) return 'No reference material available';
  return `Extract style and aesthetic elements from ${referenceAssets.length} reference assets`;
}

function generateApplicationMethod(referenceAssets: any[]): string {
  if (!referenceAssets || referenceAssets.length === 0) return 'No reference application needed';
  return 'Apply extracted reference elements to enhance primary content';
}

function generateIntegrationApproach(supportingAssets: any[]): string {
  if (!supportingAssets || supportingAssets.length === 0) return 'No supporting elements to integrate';
  return `Integrate ${supportingAssets.length} supporting assets as complementary elements`;
}

function extractEnhancementNeeds(supportingAssets: any[]): string[] {
  if (!supportingAssets || supportingAssets.length === 0) return [];
  return ['Quality optimization', 'Format standardization'];
}

function mapChallengeType(gapType: string): 'technical' | 'creative' | 'resource' | 'quality' | 'alignment' {
  switch (gapType) {
    case 'technical': return 'technical';
    case 'style': return 'creative';
    case 'content': return 'resource';
    case 'platform': return 'technical';
    case 'timeline': return 'resource';
    default: return 'quality';
  }
}

function mapImpactLevel(impactLevel: string): 'minimal' | 'moderate' | 'significant' | 'major' {
  switch (impactLevel) {
    case 'low': return 'minimal';
    case 'medium': return 'moderate';
    case 'high': return 'significant';
    case 'critical': return 'major';
    default: return 'moderate';
  }
}

function calculateResolutionConfidence(impactLevel: string, gapType: string): number {
  const baseConfidence = impactLevel === 'low' ? 0.9 : impactLevel === 'medium' ? 0.7 : impactLevel === 'high' ? 0.5 : 0.3;
  return Math.max(0.1, Math.min(1.0, baseConfidence));
}

function identifyRiskFactors(understanding: any): string[] {
  const risks: string[] = [];
  if (understanding.gap_analysis?.identified_gaps?.some((g: any) => g.impact_level === 'critical')) {
    risks.push('Critical gaps may impact project success');
  }
  if (understanding.synthesis_metadata?.synthesis_confidence < 0.7) {
    risks.push('Low synthesis confidence may affect output quality');
  }
  return risks;
}

function generateProjectScope(understanding: any): string {
  const complexity = understanding.synthesis_metadata?.complexity_assessment || 'moderate';
  const assetCount = (understanding.asset_utilization?.primary_assets?.length || 0) + 
                    (understanding.asset_utilization?.reference_assets?.length || 0) +
                    (understanding.asset_utilization?.supporting_assets?.length || 0);
  
  if (complexity === 'highly_complex' || assetCount > 10) return 'Large-scale project requiring extensive processing';
  if (complexity === 'complex' || assetCount > 5) return 'Medium-scale project with moderate complexity';
  return 'Small-scale project with straightforward requirements';
}

function extractApproachName(creativeDirection: string): string {
  if (!creativeDirection) return 'Standard Approach';
  const words = creativeDirection.split(' ').slice(0, 3);
  return words.join(' ').replace(/[^\w\s]/g, '') || 'Standard Approach';
}

function extractStyleElements(styleStrategy: string): string[] {
  if (!styleStrategy) return ['modern', 'clean'];
  return styleStrategy.split(',').map(s => s.trim()).slice(0, 5);
}

function extractMoodElements(moodPlan: string): string[] {
  if (!moodPlan) return ['professional', 'engaging'];
  return moodPlan.split(',').map(m => m.trim()).slice(0, 5);
}

function generateTechnicalApproach(productionRecommendations: any): string {
  if (!productionRecommendations) return 'Standard technical processing pipeline';
  return 'AI-enhanced processing with quality optimization';
}

function generateAlternativeApproaches(understanding: any, detailLevel: string): any[] {
  return [
    {
      approach_name: 'Minimalist Approach',
      description: 'Simplified processing with focus on core requirements',
      key_differences: ['Reduced complexity', 'Faster processing'],
      trade_offs: {
        advantages: ['Faster delivery', 'Lower resource usage'],
        disadvantages: ['Less detailed output', 'Limited customization']
      },
      suitability_score: 0.7
    }
  ];
}

function generateCreativeEnhancements(understanding: any, targetAudience: string): any[] {
  return [
    {
      enhancement_type: 'style' as const,
      enhancement_name: 'Visual Polish',
      description: 'Enhanced visual quality and aesthetic appeal',
      impact_on_outcome: 'Improved visual impact and professional appearance',
      implementation_complexity: 'moderate' as const,
      recommended: true
    }
  ];
}

function generateStyleVariations(styleStrategy: string, referenceAssets: any[]): any[] {
  return [
    {
      variation_name: 'Classic Style',
      style_description: 'Traditional, timeless aesthetic approach',
      mood_impact: 'Professional and trustworthy',
      technical_requirements: ['Standard processing', 'Quality enhancement'],
      asset_compatibility: 0.9
    }
  ];
}

function generateFallbackStrategies(understanding: any): any[] {
  return [
    {
      scenario: 'Primary assets fail processing',
      fallback_approach: 'Use alternative assets or generate new content',
      quality_impact: 'May result in slightly different output',
      timeline_impact: 'Additional 10-15 minutes processing time'
    }
  ];
}

function generateSuccessMetrics(understanding: any): any {
  return {
    completion_criteria: ['All assets processed', 'Quality targets met', 'Output delivered on time'],
    quality_checkpoints: ['Asset analysis complete', 'Processing pipeline executed', 'Final output validated'],
    expected_timeline: '30-60 minutes depending on complexity',
    resource_requirements: ['AI processing credits', 'Storage space', 'Network bandwidth']
  };
}

function generateQualityNotes(understanding: any): any[] {
  return [
    {
      type: 'note' as const,
      message: 'Analysis completed with high confidence',
      severity: 'info' as const,
      category: 'quality' as const
    }
  ];
}

function generateRecommendationNotes(understanding: any): any[] {
  return [
    {
      type: 'recommendation' as const,
      message: 'Consider implementing suggested optimizations for better results',
      severity: 'low' as const,
      category: 'technical' as const
    }
  ];
}

function mapOptimizationType(type: string): 'speed' | 'quality' | 'cost' | 'complexity' | 'automation' {
  const typeLower = type.toLowerCase();
  if (typeLower.includes('speed') || typeLower.includes('performance') || typeLower.includes('fast')) return 'speed';
  if (typeLower.includes('quality') || typeLower.includes('enhancement')) return 'quality';
  if (typeLower.includes('cost') || typeLower.includes('budget') || typeLower.includes('price')) return 'cost';
  if (typeLower.includes('complexity') || typeLower.includes('simplify')) return 'complexity';
  if (typeLower.includes('automation') || typeLower.includes('auto')) return 'automation';
  return 'quality'; // default fallback
}

function mapRoleInProject(role: string): 'primary_content' | 'reference_material' | 'supporting_element' | 'unused' {
  switch (role) {
    case 'primary_content':
      return 'primary_content';
    case 'reference_material':
      return 'reference_material';
    case 'supporting_element':
    case 'background':
    case 'enhancement_target':
      return 'supporting_element';
    case 'unclear':
    default:
      return 'unused';
  }
}
