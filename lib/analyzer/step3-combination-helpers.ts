/**
 * Step 3: Combination Analysis Helper Functions
 * 
 * Helper functions for combining query analysis and asset analysis
 * into unified project understanding.
 */

import { QueryAnalysisResult } from './query-analyzer';
import { Step2AnalysisResult, AssetAnalysisResult } from './step2-asset-analyzer';

/**
 * Create synthesis prompt for AI creative direction
 */
export function createSynthesisPrompt(
  queryAnalysis: QueryAnalysisResult,
  assetAnalysis: Step2AnalysisResult,
  outputType: string
): string {
  const assetSummary = assetAnalysis.asset_analyses.map(asset => 
    `${asset.asset_type}: ${asset.content_analysis.primary_description} (Quality: ${asset.metadata.quality_score || 'N/A'})`
  ).join('\n');

  return `Analyze this creative project and provide strategic direction:

USER QUERY: "${queryAnalysis.original_prompt}"
NORMALIZED: "${queryAnalysis.normalized_prompt}"
INTENT: ${queryAnalysis.intent.primary_output_type} (${(queryAnalysis.intent.confidence * 100).toFixed(1)}% confidence)

QUERY MODIFIERS:
- Style: ${queryAnalysis.modifiers.style?.join(', ') || 'Not specified'}
- Mood: ${queryAnalysis.modifiers.mood?.join(', ') || 'Not specified'}
- Theme: ${queryAnalysis.modifiers.theme?.join(', ') || 'Not specified'}

AVAILABLE ASSETS (${assetAnalysis.total_assets} total):
${assetSummary}

ASSET SUMMARY:
- Primary content assets: ${assetAnalysis.summary.primary_content_assets.length}
- Reference material: ${assetAnalysis.summary.reference_material_assets.length}
- Overall quality score: ${assetAnalysis.summary.overall_quality_score}/10
- Enhancement needed: ${assetAnalysis.summary.enhancement_needed_assets.length} assets

UNIFIED OUTPUT TYPE: ${outputType}

Please provide:

Creative Direction: [A clear, actionable creative direction that leverages the available assets to fulfill the user's intent]

Target Outcome: [Specific description of what the final output should achieve]

Reasoning: [Brief explanation of how the assets and query work together strategically]

Focus on maximizing asset utilization while staying true to the user's creative intent.`;
}

/**
 * Unify constraints from query analysis and asset capabilities
 */
export async function unifyConstraints(
  queryAnalysis: QueryAnalysisResult,
  assetAnalysis: Step2AnalysisResult,
  unifiedIntent: any
): Promise<any> {
  console.log(`[Step3-Combiner] Unifying constraints`);
  
  // Start with query constraints
  const queryConstraints = queryAnalysis.constraints;
  
  // Derive specifications from assets
  const assetCapabilities = analyzeAssetCapabilities(assetAnalysis.asset_analyses);
  
  // Merge and resolve conflicts
  const outputSpecifications = {
    image_count: queryConstraints.image_count ?? (unifiedIntent.primary_output_type === 'image' ? 1 : undefined),
    video_duration_seconds: queryConstraints.duration_seconds ?? (unifiedIntent.primary_output_type === 'video' ? 30 : undefined),
    audio_length_seconds: queryConstraints.audio_length_seconds ?? (unifiedIntent.primary_output_type === 'audio' ? 30 : undefined),
    aspect_ratio: queryConstraints.aspect_ratio ?? assetCapabilities.most_common_aspect_ratio,
    resolution: queryConstraints.resolution ?? assetCapabilities.highest_resolution,
    quality_target: deriveQualityTarget(assetAnalysis.summary.overall_quality_score),
    format_requirements: deriveFormatRequirements(unifiedIntent.primary_output_type, queryConstraints.platform)
  };

  const platformConstraints = {
    target_platforms: queryConstraints.platform ?? ['web'],
    platform_specific_requirements: derivePlatformRequirements(queryConstraints.platform),
    distribution_format: deriveDistributionFormat(unifiedIntent.primary_output_type, queryConstraints.platform)
  };

  const creativeConstraints = {
    required_style: queryAnalysis.modifiers.style?.[0],
    mood_requirements: queryAnalysis.modifiers.mood,
    color_palette: deriveColorPalette(assetAnalysis.asset_analyses),
    brand_requirements: extractBrandRequirements(queryAnalysis.original_prompt),
    accessibility_requirements: ['standard_compliance']
  };

  const productionConstraints = {
    budget_tier: deriveBudgetTier(queryAnalysis, assetAnalysis),
    timeline: queryConstraints.timeline ?? 'standard',
    complexity_level: deriveComplexityLevel(queryAnalysis, assetAnalysis),
    automation_level: deriveAutomationLevel(assetAnalysis.summary.enhancement_needed_assets.length, assetAnalysis.total_assets)
  };

  return {
    output_specifications: outputSpecifications,
    platform_constraints: platformConstraints,
    creative_constraints: creativeConstraints,
    production_constraints: productionConstraints
  };
}

/**
 * Create asset utilization plan
 */
export async function createAssetUtilizationPlan(
  queryAnalysis: QueryAnalysisResult,
  assetAnalyses: AssetAnalysisResult[],
  unifiedIntent: any,
  unifiedConstraints: any
): Promise<any> {
  console.log(`[Step3-Combiner] Creating asset utilization plan`);
  
  const primaryAssets = [];
  const referenceAssets = [];
  const supportingAssets = [];
  const unusedAssets = [];

  for (const asset of assetAnalyses) {
    const role = asset.alignment_with_query.role_in_project;
    const alignmentScore = asset.alignment_with_query.alignment_score;
    const qualityScore = asset.metadata.quality_score || 5;

    if (role === 'primary_content' && alignmentScore > 0.6) {
      primaryAssets.push({
        asset_id: asset.asset_id,
        role: deriveAssetRole(asset, unifiedIntent),
        usage_plan: generateUsagePlan(asset, unifiedIntent, unifiedConstraints),
        processing_priority: deriveProcessingPriority(asset, alignmentScore, qualityScore),
        enhancement_plan: generateEnhancementPlan(asset)
      });
    } else if (role === 'reference_material' || (alignmentScore > 0.3 && alignmentScore <= 0.6)) {
      referenceAssets.push({
        asset_id: asset.asset_id,
        reference_type: deriveReferenceType(asset, queryAnalysis),
        application: generateReferenceApplication(asset, queryAnalysis),
        extraction_focus: generateExtractionFocus(asset, queryAnalysis)
      });
    } else if (role === 'supporting_element' || alignmentScore > 0.1) {
      supportingAssets.push({
        asset_id: asset.asset_id,
        support_role: deriveSupportRole(asset, unifiedIntent),
        integration_method: generateIntegrationMethod(asset, unifiedIntent),
        processing_needs: asset.processing_needs.recommended_tools || []
      });
    } else {
      unusedAssets.push({
        asset_id: asset.asset_id,
        reason: `Low alignment (${(alignmentScore * 100).toFixed(1)}%) with project intent`,
        alternative_usage: generateAlternativeUsage(asset, unifiedIntent)
      });
    }
  }

  return {
    primary_assets: primaryAssets,
    reference_assets: referenceAssets,
    supporting_assets: supportingAssets,
    unused_assets: unusedAssets
  };
}

/**
 * Perform comprehensive gap analysis
 */
export async function performGapAnalysis(
  queryAnalysis: QueryAnalysisResult,
  assetAnalysis: Step2AnalysisResult,
  unifiedIntent: any,
  unifiedConstraints: any,
  assetUtilization: any,
  options: { depth: string; enable_contradiction_resolution: boolean }
): Promise<any> {
  console.log(`[Step3-Combiner] Performing gap analysis (${options.depth} depth)`);
  
  const identifiedGaps = [];
  const contradictions = [];
  const missingElements = [];

  // Content gaps
  if (assetUtilization.primary_assets.length === 0) {
    identifiedGaps.push({
      gap_type: 'content',
      description: 'No primary content assets identified for the project',
      impact_level: 'critical',
      suggested_resolution: 'Generate or source primary content assets',
      alternative_solutions: ['Use reference assets as base', 'Create content from scratch']
    });
  }

  // Style gaps
  if (!queryAnalysis.modifiers.style && assetUtilization.reference_assets.length === 0) {
    identifiedGaps.push({
      gap_type: 'style',
      description: 'No style direction specified and no reference assets available',
      impact_level: 'high',
      suggested_resolution: 'Define default style based on intent and platform',
      alternative_solutions: ['Use platform-appropriate defaults', 'Generate style guide']
    });
  }

  // Technical gaps
  const outputSpecs = unifiedConstraints.output_specifications;
  if (unifiedIntent.primary_output_type === 'video' && !outputSpecs.video_duration_seconds) {
    identifiedGaps.push({
      gap_type: 'technical',
      description: 'Video duration not specified',
      impact_level: 'medium',
      suggested_resolution: 'Use platform-appropriate default duration',
      alternative_solutions: ['30 seconds for social media', '60 seconds for general content']
    });
  }

  // Quality gaps
  if (assetAnalysis.summary.overall_quality_score < 6) {
    identifiedGaps.push({
      gap_type: 'quality',
      description: 'Overall asset quality below recommended threshold',
      impact_level: 'medium',
      suggested_resolution: 'Apply quality enhancement to key assets',
      alternative_solutions: ['Selective enhancement', 'Quality-appropriate usage']
    });
  }

  // Contradiction detection
  if (options.enable_contradiction_resolution) {
    // Intent vs assets contradiction
    if (unifiedIntent.primary_output_type === 'video' && assetAnalysis.summary.asset_type_breakdown.video === 0) {
      contradictions.push({
        contradiction_type: 'intent_vs_assets',
        description: 'User wants video content but no video assets provided',
        affected_elements: ['intent', 'available_assets'],
        resolution_strategy: 'Generate video from available images or create new video content',
        impact_assessment: 'Moderate impact - requires content generation'
      });
    }

    // Asset vs asset contradictions
    const styles = extractAssetStyles(assetAnalysis.asset_analyses);
    if (styles.length > 2) {
      contradictions.push({
        contradiction_type: 'asset_vs_asset',
        description: 'Multiple conflicting visual styles detected across assets',
        affected_elements: styles,
        resolution_strategy: 'Harmonize styles or select dominant style direction',
        impact_assessment: 'Low to moderate impact - affects visual consistency'
      });
    }
  }

  // Missing elements detection
  if (!outputSpecs.aspect_ratio) {
    missingElements.push({
      element_type: 'specification',
      description: 'Output aspect ratio not specified',
      importance: 'recommended',
      default_suggestion: '16:9 for video, 1:1 for social media images',
      acquisition_method: 'infer'
    });
  }

  if (queryAnalysis.gaps.missing_target_audience) {
    missingElements.push({
      element_type: 'constraint',
      description: 'Target audience not specified',
      importance: 'recommended',
      default_suggestion: 'General audience appropriate for platform',
      acquisition_method: 'infer'
    });
  }

  return {
    identified_gaps: identifiedGaps,
    contradictions: contradictions,
    missing_elements: missingElements
  };
}

/**
 * Generate creative synthesis
 */
export async function generateCreativeSynthesis(
  queryAnalysis: QueryAnalysisResult,
  assetAnalysis: Step2AnalysisResult,
  unifiedIntent: any,
  assetUtilization: any,
  options: any
): Promise<any> {
  console.log(`[Step3-Combiner] Generating creative synthesis`);
  
  const primaryStyles = extractPrimaryStyles(assetAnalysis.asset_analyses, assetUtilization.primary_assets);
  const dominantMoods = extractDominantMoods(assetAnalysis.asset_analyses);
  
  const unifiedCreativeDirection = unifiedIntent.creative_direction || 
    'Professional content creation leveraging available assets for maximum impact';
    
  const styleFusionStrategy = generateStyleFusionStrategy(primaryStyles, queryAnalysis.modifiers.style);
  
  const moodIntegrationPlan = generateMoodIntegrationPlan(dominantMoods, queryAnalysis.modifiers.mood);
  
  const narrativeStructure = unifiedIntent.primary_output_type === 'video' 
    ? generateNarrativeStructure(assetUtilization.primary_assets)
    : undefined;
    
  const visualHierarchy = generateVisualHierarchy(assetUtilization.primary_assets, unifiedIntent.primary_output_type);
  
  const audioVisualAlignment = (unifiedIntent.primary_output_type === 'video' || assetAnalysis.summary.asset_type_breakdown.audio > 0)
    ? generateAudioVisualAlignment(assetAnalysis.asset_analyses)
    : undefined;

  return {
    unified_creative_direction: unifiedCreativeDirection,
    style_fusion_strategy: styleFusionStrategy,
    mood_integration_plan: moodIntegrationPlan,
    narrative_structure: narrativeStructure,
    visual_hierarchy: visualHierarchy,
    audio_visual_alignment: audioVisualAlignment,
    brand_voice_integration: generateBrandVoiceIntegration(queryAnalysis.original_prompt)
  };
}

/**
 * Generate production recommendations
 */
export async function generateProductionRecommendations(
  unifiedIntent: any,
  unifiedConstraints: any,
  assetUtilization: any,
  gapAnalysis: any,
  creativeSynthesis: any,
  options: any
): Promise<any> {
  console.log(`[Step3-Combiner] Generating production recommendations`);
  
  const pipeline = generateRecommendedPipeline(
    unifiedIntent,
    assetUtilization,
    gapAnalysis,
    options.optimization_focus
  );
  
  const qualityTargets = deriveQualityTargets(
    unifiedConstraints.production_constraints.complexity_level,
    unifiedConstraints.platform_constraints.target_platforms
  );
  
  const optimizationSuggestions = generateOptimizationSuggestions(
    assetUtilization,
    gapAnalysis,
    options.optimization_focus
  );

  return {
    recommended_pipeline: pipeline,
    quality_targets: qualityTargets,
    optimization_suggestions: optimizationSuggestions
  };
}

// Helper functions for constraint derivation
function analyzeAssetCapabilities(assets: AssetAnalysisResult[]): any {
  const resolutions = assets
    .filter(a => a.metadata.dimensions)
    .map(a => `${a.metadata.dimensions?.width}x${a.metadata.dimensions?.height}`);
    
  const aspectRatios = assets
    .filter(a => a.metadata.dimensions)
    .map(a => {
      const w = a.metadata.dimensions?.width || 16;
      const h = a.metadata.dimensions?.height || 9;
      const ratio = w / h;
      if (Math.abs(ratio - 16/9) < 0.1) return '16:9';
      if (Math.abs(ratio - 1) < 0.1) return '1:1';
      if (Math.abs(ratio - 9/16) < 0.1) return '9:16';
      return `${w}:${h}`;
    });

  return {
    most_common_aspect_ratio: aspectRatios.length > 0 ? aspectRatios[0] : '16:9',
    highest_resolution: resolutions.length > 0 ? resolutions[0] : '1920x1080'
  };
}

function deriveQualityTarget(overallScore: number): 'standard' | 'high' | 'professional' | 'cinema' {
  if (overallScore >= 9) return 'cinema';
  if (overallScore >= 7) return 'professional';
  if (overallScore >= 5) return 'high';
  return 'standard';
}

function deriveFormatRequirements(outputType: string, platforms?: string[]): string[] {
  const formats = [];
  
  if (outputType === 'video') {
    formats.push('mp4');
    if (platforms?.includes('web')) formats.push('webm');
  } else if (outputType === 'image') {
    formats.push('jpg', 'png');
    if (platforms?.includes('web')) formats.push('webp');
  } else if (outputType === 'audio') {
    formats.push('mp3');
    if (platforms?.includes('web')) formats.push('ogg');
  }
  
  return formats;
}

function derivePlatformRequirements(platforms?: string[]): Record<string, any> {
  const requirements: Record<string, any> = {};
  
  platforms?.forEach(platform => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        requirements[platform] = { max_duration: 60, aspect_ratios: ['1:1', '9:16'] };
        break;
      case 'youtube':
        requirements[platform] = { max_duration: 3600, aspect_ratios: ['16:9'] };
        break;
      case 'tiktok':
        requirements[platform] = { max_duration: 180, aspect_ratios: ['9:16'] };
        break;
    }
  });
  
  return requirements;
}

function deriveDistributionFormat(outputType: string, platforms?: string[]): string {
  if (platforms?.includes('web')) {
    return outputType === 'video' ? 'web-optimized-mp4' : 'web-optimized';
  }
  return 'standard';
}

function deriveColorPalette(assets: AssetAnalysisResult[]): string[] {
  // Extract color information from asset content analysis
  const colors: string[] = [];
  
  assets.forEach(asset => {
    const analysis = asset.content_analysis.detailed_analysis.toLowerCase();
    const colorWords = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white'];
    colorWords.forEach(color => {
      if (analysis.includes(color) && !colors.includes(color)) {
        colors.push(color);
      }
    });
  });
  
  return colors.slice(0, 5); // Limit to 5 dominant colors
}

function extractBrandRequirements(prompt: string): string | undefined {
  const brandKeywords = ['brand', 'logo', 'company', 'business', 'corporate'];
  const lowerPrompt = prompt.toLowerCase();
  
  if (brandKeywords.some(keyword => lowerPrompt.includes(keyword))) {
    return 'Brand consistency and professional presentation required';
  }
  
  return undefined;
}

function deriveBudgetTier(queryAnalysis: QueryAnalysisResult, assetAnalysis: Step2AnalysisResult): 'low' | 'medium' | 'high' | 'unlimited' {
  const enhancementNeeded = assetAnalysis.summary.enhancement_needed_assets.length;
  const totalAssets = assetAnalysis.total_assets;
  const complexityIndicators = queryAnalysis.modifiers.technical_specs?.length || 0;
  
  if (enhancementNeeded / totalAssets > 0.7 || complexityIndicators > 3) return 'high';
  if (enhancementNeeded / totalAssets > 0.3 || complexityIndicators > 1) return 'medium';
  return 'low';
}

function deriveComplexityLevel(queryAnalysis: QueryAnalysisResult, assetAnalysis: Step2AnalysisResult): 'simple' | 'moderate' | 'complex' | 'advanced' {
  const assetTypes = Object.keys(assetAnalysis.summary.asset_type_breakdown).length;
  const enhancementRatio = assetAnalysis.summary.enhancement_needed_assets.length / assetAnalysis.total_assets;
  const gapCount = Object.values(queryAnalysis.gaps).filter(Boolean).length;
  
  if (assetTypes > 2 && enhancementRatio > 0.5 && gapCount > 3) return 'advanced';
  if (assetTypes > 1 && enhancementRatio > 0.3 && gapCount > 2) return 'complex';
  if (assetTypes > 1 || enhancementRatio > 0.2 || gapCount > 1) return 'moderate';
  return 'simple';
}

function deriveAutomationLevel(enhancementNeeded: number, totalAssets: number): 'full_auto' | 'semi_auto' | 'manual_review' {
  const enhancementRatio = enhancementNeeded / totalAssets;
  
  if (enhancementRatio > 0.7) return 'manual_review';
  if (enhancementRatio > 0.3) return 'semi_auto';
  return 'full_auto';
}

// Additional helper functions continue...
function deriveAssetRole(asset: AssetAnalysisResult, unifiedIntent: any): 'hero' | 'main_content' | 'key_element' | 'supporting' {
  if (asset.alignment_with_query.alignment_score > 0.8) return 'hero';
  if (asset.alignment_with_query.alignment_score > 0.6) return 'main_content';
  if (asset.alignment_with_query.alignment_score > 0.4) return 'key_element';
  return 'supporting';
}

function generateUsagePlan(asset: AssetAnalysisResult, unifiedIntent: any, unifiedConstraints: any): string {
  const role = asset.alignment_with_query.role_in_project;
  const type = asset.asset_type;
  const outputType = unifiedIntent.primary_output_type;
  
  if (role === 'primary_content') {
    if (type === outputType) {
      return `Direct use as primary ${type} content with quality optimization`;
    } else {
      return `Convert ${type} to ${outputType} format while preserving key elements`;
    }
  }
  
  return `Integrate as ${role} with appropriate processing for ${outputType} output`;
}

function deriveProcessingPriority(asset: AssetAnalysisResult, alignmentScore: number, qualityScore: number): 'critical' | 'high' | 'medium' | 'low' {
  const combinedScore = (alignmentScore + qualityScore / 10) / 2;
  
  if (combinedScore > 0.8) return 'critical';
  if (combinedScore > 0.6) return 'high';
  if (combinedScore > 0.4) return 'medium';
  return 'low';
}

function generateEnhancementPlan(asset: AssetAnalysisResult): string[] {
  const plan: string[] = [];
  
  if (asset.processing_needs.requires_upscaling) plan.push('Quality upscaling');
  if (asset.processing_needs.requires_enhancement) plan.push('Content enhancement');
  if (asset.processing_needs.requires_style_transfer) plan.push('Style harmonization');
  if (asset.processing_needs.requires_noise_reduction) plan.push('Noise reduction');
  
  return plan;
}

// Additional helper functions for creative synthesis
function extractPrimaryStyles(assets: AssetAnalysisResult[], primaryAssets: any[]): string[] {
  const styles: string[] = [];
  
  primaryAssets.forEach(pa => {
    const asset = assets.find(a => a.asset_id === pa.asset_id);
    if (asset?.content_analysis.style_analysis) {
      styles.push(asset.content_analysis.style_analysis);
    }
  });
  
  return [...new Set(styles)]; // Remove duplicates
}

function extractDominantMoods(assets: AssetAnalysisResult[]): string[] {
  const moods: string[] = [];
  
  assets.forEach(asset => {
    if (asset.content_analysis.mood_assessment) {
      moods.push(asset.content_analysis.mood_assessment);
    }
  });
  
  // Count occurrences and return most common
  const moodCounts = moods.reduce((acc, mood) => {
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(moodCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([mood]) => mood);
}

function generateStyleFusionStrategy(primaryStyles: string[], queryStyles?: string[]): string {
  if (primaryStyles.length === 0 && (!queryStyles || queryStyles.length === 0)) {
    return 'Apply platform-appropriate default styling';
  }
  
  if (primaryStyles.length === 1 && (!queryStyles || queryStyles.length === 0)) {
    return `Maintain consistent ${primaryStyles[0]} style throughout the project`;
  }
  
  if (queryStyles && queryStyles.length > 0) {
    return `Blend query-specified ${queryStyles.join(', ')} style with asset-derived ${primaryStyles.join(', ')} characteristics`;
  }
  
  return `Harmonize multiple styles (${primaryStyles.join(', ')}) into cohesive visual direction`;
}

function generateMoodIntegrationPlan(dominantMoods: string[], queryMoods?: string[]): string {
  if (dominantMoods.length === 0 && (!queryMoods || queryMoods.length === 0)) {
    return 'Maintain neutral, professional mood appropriate for content type';
  }
  
  const allMoods = [...(queryMoods || []), ...dominantMoods];
  const uniqueMoods = [...new Set(allMoods)];
  
  if (uniqueMoods.length === 1) {
    return `Maintain consistent ${uniqueMoods[0]} mood throughout the content`;
  }
  
  return `Balance ${uniqueMoods.slice(0, 2).join(' and ')} elements for emotional consistency`;
}

function generateNarrativeStructure(primaryAssets: any[]): string {
  if (primaryAssets.length <= 1) {
    return 'Single focal point presentation with clear beginning, middle, and end';
  }
  
  if (primaryAssets.length <= 3) {
    return 'Three-act structure utilizing assets for introduction, development, and conclusion';
  }
  
  return 'Multi-segment narrative with smooth transitions between asset-driven scenes';
}

function generateVisualHierarchy(primaryAssets: any[], outputType: string): string[] {
  const hierarchy: string[] = [];
  
  // Hero content always comes first
  const heroAssets = primaryAssets.filter(a => a.role === 'hero');
  if (heroAssets.length > 0) {
    hierarchy.push('Hero asset as primary focal point');
  }
  
  // Main content
  const mainAssets = primaryAssets.filter(a => a.role === 'main_content');
  if (mainAssets.length > 0) {
    hierarchy.push('Main content assets as secondary focus');
  }
  
  // Key elements
  const keyAssets = primaryAssets.filter(a => a.role === 'key_element');
  if (keyAssets.length > 0) {
    hierarchy.push('Key elements for context and support');
  }
  
  // Supporting elements
  const supportingAssets = primaryAssets.filter(a => a.role === 'supporting');
  if (supportingAssets.length > 0) {
    hierarchy.push('Supporting elements for depth and texture');
  }
  
  if (hierarchy.length === 0) {
    hierarchy.push(`Standard ${outputType} layout with balanced composition`);
  }
  
  return hierarchy;
}

function generateAudioVisualAlignment(assets: AssetAnalysisResult[]): string {
  const hasAudio = assets.some(a => a.asset_type === 'audio');
  const hasVideo = assets.some(a => a.asset_type === 'video');
  const hasImages = assets.some(a => a.asset_type === 'image');
  
  if (hasAudio && hasVideo) {
    return 'Synchronize audio elements with video pacing and visual transitions';
  }
  
  if (hasAudio && hasImages) {
    return 'Align audio tempo and mood with visual rhythm and image transitions';
  }
  
  if (hasVideo) {
    return 'Ensure consistent audio-visual pacing throughout video content';
  }
  
  return 'Maintain consistent pacing appropriate for content type';
}

function generateBrandVoiceIntegration(originalPrompt: string): string | undefined {
  const brandKeywords = ['brand', 'company', 'business', 'corporate', 'professional', 'logo'];
  const lowerPrompt = originalPrompt.toLowerCase();
  
  if (brandKeywords.some(keyword => lowerPrompt.includes(keyword))) {
    return 'Maintain professional brand consistency across all visual and content elements';
  }
  
  return undefined;
}

function extractAssetStyles(assets: AssetAnalysisResult[]): string[] {
  const styles = assets
    .map(a => a.content_analysis.style_analysis)
    .filter(Boolean) as string[];
    
  return [...new Set(styles)]; // Remove duplicates
}

function deriveReferenceType(asset: AssetAnalysisResult, queryAnalysis: QueryAnalysisResult): 'style_reference' | 'mood_reference' | 'content_reference' | 'technical_reference' {
  const contentAnalysis = asset.content_analysis.detailed_analysis.toLowerCase();
  
  if (queryAnalysis.modifiers.style && contentAnalysis.includes('style')) {
    return 'style_reference';
  }
  
  if (queryAnalysis.modifiers.mood && contentAnalysis.includes('mood')) {
    return 'mood_reference';
  }
  
  if (contentAnalysis.includes('quality') || contentAnalysis.includes('resolution')) {
    return 'technical_reference';
  }
  
  return 'content_reference';
}

function generateReferenceApplication(asset: AssetAnalysisResult, queryAnalysis: QueryAnalysisResult): string {
  const referenceType = deriveReferenceType(asset, queryAnalysis);
  
  switch (referenceType) {
    case 'style_reference':
      return 'Extract visual style elements for consistent application across output';
    case 'mood_reference':
      return 'Use mood and atmosphere as guide for emotional tone';
    case 'technical_reference':
      return 'Reference technical specifications for quality targets';
    default:
      return 'Use as content inspiration and structural reference';
  }
}

function generateExtractionFocus(asset: AssetAnalysisResult, queryAnalysis: QueryAnalysisResult): string[] {
  const focus: string[] = [];
  
  if (asset.content_analysis.style_analysis) {
    focus.push('Visual style elements');
  }
  
  if (asset.content_analysis.mood_assessment) {
    focus.push('Mood and atmosphere');
  }
  
  if (asset.metadata.quality_score && asset.metadata.quality_score > 7) {
    focus.push('Technical quality standards');
  }
  
  if (asset.content_analysis.objects_detected && asset.content_analysis.objects_detected.length > 0) {
    focus.push('Content composition elements');
  }
  
  return focus.length > 0 ? focus : ['General reference characteristics'];
}

function deriveSupportRole(asset: AssetAnalysisResult, unifiedIntent: any): 'background' | 'texture' | 'overlay' | 'b_roll' | 'audio_layer' {
  if (asset.asset_type === 'audio') return 'audio_layer';
  if (asset.asset_type === 'video' && unifiedIntent.primary_output_type === 'video') return 'b_roll';
  if (asset.asset_type === 'image' && unifiedIntent.primary_output_type === 'video') return 'overlay';
  if (asset.metadata.quality_score && asset.metadata.quality_score < 6) return 'texture';
  return 'background';
}

function generateIntegrationMethod(asset: AssetAnalysisResult, unifiedIntent: any): string {
  const role = deriveSupportRole(asset, unifiedIntent);
  
  switch (role) {
    case 'audio_layer':
      return 'Layer as background audio or sound effects';
    case 'b_roll':
      return 'Integrate as B-roll footage with smooth transitions';
    case 'overlay':
      return 'Apply as overlay element with appropriate blending';
    case 'texture':
      return 'Use for texture and depth enhancement';
    default:
      return 'Integrate as background element with subtle presence';
  }
}

function generateAlternativeUsage(asset: AssetAnalysisResult, unifiedIntent: any): string | undefined {
  if (asset.alignment_with_query.alignment_score > 0.1) {
    return `Consider for future ${unifiedIntent.primary_output_type} projects or alternative creative directions`;
  }
  
  if (asset.metadata.quality_score && asset.metadata.quality_score > 7) {
    return 'High-quality asset suitable for different project types or client presentations';
  }
  
  return 'Archive for potential future use or creative experimentation';
}

function generateRecommendedPipeline(unifiedIntent: any, assetUtilization: any, gapAnalysis: any, optimizationFocus: string): any[] {
  const pipeline = [];
  let stepNumber = 1;
  
  // Step 1: Asset preparation
  if (assetUtilization.primary_assets.some((a: any) => a.enhancement_plan?.length > 0)) {
    pipeline.push({
      step_number: stepNumber++,
      step_name: 'Asset Enhancement',
      description: 'Enhance and optimize primary assets for production',
      input_assets: assetUtilization.primary_assets.map((a: any) => a.asset_id),
      output_expectation: 'Production-ready assets with improved quality',
      tools_needed: ['upscaling', 'enhancement', 'format_conversion'],
      estimated_time: '15-30 minutes',
      complexity_level: 'moderate'
    });
  }
  
  // Step 2: Content creation
  pipeline.push({
    step_number: stepNumber++,
    step_name: 'Content Creation',
    description: `Create ${unifiedIntent.primary_output_type} content using prepared assets`,
    input_assets: assetUtilization.primary_assets.map((a: any) => a.asset_id),
    output_expectation: `Draft ${unifiedIntent.primary_output_type} content`,
    tools_needed: deriveCreationTools(unifiedIntent.primary_output_type),
    estimated_time: deriveCreationTime(unifiedIntent.primary_output_type, assetUtilization.primary_assets.length),
    complexity_level: deriveCreationComplexity(assetUtilization.primary_assets.length)
  });
  
  // Step 3: Integration and refinement
  if (assetUtilization.supporting_assets.length > 0) {
    pipeline.push({
      step_number: stepNumber++,
      step_name: 'Asset Integration',
      description: 'Integrate supporting assets and refine composition',
      input_assets: [...assetUtilization.primary_assets.map((a: any) => a.asset_id), ...assetUtilization.supporting_assets.map((a: any) => a.asset_id)],
      output_expectation: 'Integrated content with all assets properly positioned',
      tools_needed: ['compositing', 'blending', 'transition_effects'],
      estimated_time: '20-45 minutes',
      complexity_level: 'moderate'
    });
  }
  
  // Step 4: Final polish
  pipeline.push({
    step_number: stepNumber++,
    step_name: 'Final Polish',
    description: 'Apply final enhancements and quality assurance',
    input_assets: ['composed_content'],
    output_expectation: `Finished ${unifiedIntent.primary_output_type} ready for delivery`,
    tools_needed: ['color_correction', 'quality_enhancement', 'export_optimization'],
    estimated_time: '10-20 minutes',
    complexity_level: 'easy'
  });
  
  return pipeline;
}

function deriveQualityTargets(complexityLevel: string, platforms?: string[]): any {
  const baseTargets = {
    technical_quality: 'good' as const,
    creative_quality: 'appealing' as const,
    consistency_level: 'good' as const,
    polish_level: 'refined' as const
  };
  
  // Adjust based on complexity
  if (complexityLevel === 'advanced') {
    baseTargets.technical_quality = 'professional';
    baseTargets.creative_quality = 'impressive';
    baseTargets.consistency_level = 'high';
    baseTargets.polish_level = 'polished';
  } else if (complexityLevel === 'simple') {
    baseTargets.technical_quality = 'acceptable';
    baseTargets.creative_quality = 'functional';
    baseTargets.polish_level = 'draft';
  }
  
  // Adjust for platforms
  if (platforms?.includes('professional') || platforms?.includes('business')) {
    baseTargets.technical_quality = 'professional';
    baseTargets.consistency_level = 'high';
  }
  
  return baseTargets;
}

function generateOptimizationSuggestions(assetUtilization: any, gapAnalysis: any, optimizationFocus: string): any[] {
  const suggestions = [];
  
  // Quality optimization
  if (optimizationFocus === 'quality' || optimizationFocus === 'balanced') {
    suggestions.push({
      optimization_type: 'quality',
      suggestion: 'Prioritize high-quality asset enhancement and professional finishing',
      impact: 'Significantly improved visual appeal and professional presentation',
      implementation_effort: 'moderate'
    });
  }
  
  // Speed optimization
  if (optimizationFocus === 'speed' || optimizationFocus === 'balanced') {
    suggestions.push({
      optimization_type: 'performance',
      suggestion: 'Batch process similar assets and use automated enhancement tools',
      impact: 'Reduced processing time while maintaining quality',
      implementation_effort: 'minimal'
    });
  }
  
  // Cost optimization
  if (optimizationFocus === 'cost' || optimizationFocus === 'balanced') {
    suggestions.push({
      optimization_type: 'cost',
      suggestion: 'Maximize utilization of existing assets before generating new content',
      impact: 'Lower production costs through efficient asset reuse',
      implementation_effort: 'minimal'
    });
  }
  
  // Complexity optimization
  if (assetUtilization.unused_assets.length > assetUtilization.primary_assets.length) {
    suggestions.push({
      optimization_type: 'complexity',
      suggestion: 'Reduce project scope to focus on most aligned assets',
      impact: 'Simplified production process with clearer creative direction',
      implementation_effort: 'minimal'
    });
  }
  
  return suggestions;
}

function deriveCreationTools(outputType: string): string[] {
  switch (outputType) {
    case 'video':
      return ['video_editor', 'compositing', 'audio_sync', 'transition_effects'];
    case 'image':
      return ['image_editor', 'compositing', 'color_correction', 'style_transfer'];
    case 'audio':
      return ['audio_editor', 'mixing', 'mastering', 'effects_processing'];
    default:
      return ['content_creator', 'asset_manager', 'quality_enhancer'];
  }
}

function deriveCreationTime(outputType: string, assetCount: number): string {
  const baseTime = outputType === 'video' ? 45 : outputType === 'audio' ? 30 : 20;
  const timePerAsset = 10;
  const totalMinutes = baseTime + (assetCount * timePerAsset);
  
  return `${totalMinutes}-${totalMinutes + 15} minutes`;
}

function deriveCreationComplexity(assetCount: number): 'easy' | 'moderate' | 'complex' | 'expert' {
  if (assetCount >= 5) return 'expert';
  if (assetCount >= 3) return 'complex';
  if (assetCount >= 2) return 'moderate';
  return 'easy';
}

// Note: Core functions are already exported inline above
// Export additional helper functions that weren't exported inline
export {
  extractPrimaryStyles,
  extractDominantMoods,
  generateStyleFusionStrategy,
  generateMoodIntegrationPlan,
  generateNarrativeStructure,
  generateVisualHierarchy,
  generateAudioVisualAlignment,
  generateBrandVoiceIntegration
};
