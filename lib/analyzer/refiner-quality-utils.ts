/**
 * 🎯 DreamCut Refiner Quality Utilities
 * 
 * Comprehensive quality assessment and validation utilities for the refiner system.
 * These utilities help detect and prevent the issues mentioned in the user feedback:
 * - Confidence level mismatches
 * - Placeholder detection in core concepts
 * - Content type contradictions
 * - Asset integration quality
 */

import { AnalyzerInput, RefinerOutput } from './refiner-schema';

export interface RefinerQualityReport {
  overallScore: number; // 0-1
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  issues: QualityIssue[];
  recommendations: string[];
  metrics: {
    confidenceGap: number;
    hasPlaceholders: boolean;
    assetIntegrationScore: number;
    assetUtilizationScore: number; // NEW
    contentTypeConsistency: number;
    coreConceptStrength: number;
  };
}

export interface QualityIssue {
  type: 'confidence' | 'placeholder' | 'integration' | 'consistency' | 'concept' | 'utilization';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  suggestion: string;
}

/**
 * Comprehensive quality assessment of refiner output
 */
export function assessRefinerQuality(
  analyzerData: AnalyzerInput,
  refinerData: RefinerOutput
): RefinerQualityReport {
  const issues: QualityIssue[] = [];
  const recommendations: string[] = [];
  
  // 1. Confidence Analysis
  const confidenceGap = analyzeConfidenceGap(analyzerData, refinerData);
  if (confidenceGap > 0.3) {
    issues.push({
      type: 'confidence',
      severity: confidenceGap > 0.5 ? 'high' : 'medium',
      message: `Large confidence gap detected: ${confidenceGap.toFixed(2)}`,
      suggestion: 'Adjust refiner confidence to better match analyzer confidence'
    });
  }
  
  // 2. Placeholder Detection
  const hasPlaceholders = detectPlaceholders(refinerData);
  if (hasPlaceholders) {
    issues.push({
      type: 'placeholder',
      severity: 'critical',
      message: 'Placeholders detected in core concept',
      suggestion: 'Replace placeholders with specific, meaningful content'
    });
  }
  
  // 3. Asset Integration Analysis
  const assetIntegrationScore = assessAssetIntegration(analyzerData, refinerData);
  if (assetIntegrationScore < 0.6) {
    issues.push({
      type: 'integration',
      severity: assetIntegrationScore < 0.3 ? 'high' : 'medium',
      message: 'Poor asset integration detected',
      suggestion: 'Improve asset context embedding in reformulated prompt'
    });
  }
  
  // 4. Asset Utilization Analysis (NEW)
  const assetUtilizationScore = assessAssetUtilization(analyzerData, refinerData);
  if (assetUtilizationScore < 0.7) {
    issues.push({
      type: 'utilization',
      severity: assetUtilizationScore < 0.4 ? 'high' : 'medium',
      message: 'Poor asset utilization detected',
      suggestion: 'Elevate assets from reference-only to meaningful roles'
    });
  }
  
  // 5. Content Type Consistency
  const contentTypeConsistency = assessContentTypeConsistency(analyzerData, refinerData);
  if (contentTypeConsistency < 0.8) {
    issues.push({
      type: 'consistency',
      severity: 'medium',
      message: 'Content type analysis inconsistencies detected',
      suggestion: 'Normalize contradictory content type flags'
    });
  }
  
  // 6. Core Concept Strength
  const coreConceptStrength = assessCoreConceptStrength(refinerData);
  if (coreConceptStrength < 0.7) {
    issues.push({
      type: 'concept',
      severity: coreConceptStrength < 0.4 ? 'high' : 'medium',
      message: 'Weak core concept detected',
      suggestion: 'Enhance core concept with more specific and descriptive content'
    });
  }
  
  // Generate recommendations
  if (confidenceGap > 0.2) {
    recommendations.push('Implement confidence normalization to prevent over-correction');
  }
  if (hasPlaceholders) {
    recommendations.push('Add placeholder detection and replacement logic');
  }
  if (assetIntegrationScore < 0.7) {
    recommendations.push('Enhance asset integration validation');
  }
  if (assetUtilizationScore < 0.7) {
    recommendations.push('Improve asset utilization to prevent reference-only classification');
  }
  if (contentTypeConsistency < 0.9) {
    recommendations.push('Add content type consistency checks');
  }
  
  // Calculate overall score
  const overallScore = calculateOverallScore({
    confidenceGap,
    hasPlaceholders,
    assetIntegrationScore,
    assetUtilizationScore,
    contentTypeConsistency,
    coreConceptStrength
  });
  
  // Determine grade
  const grade = determineGrade(overallScore);
  
  return {
    overallScore,
    grade,
    issues,
    recommendations,
    metrics: {
      confidenceGap,
      hasPlaceholders,
      assetIntegrationScore,
      assetUtilizationScore,
      contentTypeConsistency,
      coreConceptStrength
    }
  };
}

/**
 * Analyze confidence gap between analyzer and refiner
 */
function analyzeConfidenceGap(analyzerData: AnalyzerInput, refinerData: RefinerOutput): number {
  const analyzerConfidence = analyzerData.quality_metrics?.overall_confidence || 0.5;
  const refinerConfidence = refinerData.quality_metrics?.overall_confidence || 0.75;
  return Math.abs(refinerConfidence - analyzerConfidence);
}

/**
 * Detect placeholders in refiner output
 */
function detectPlaceholders(refinerData: RefinerOutput): boolean {
  const coreConcept = refinerData.creative_direction?.core_concept || '';
  return coreConcept.includes('**') || 
         coreConcept.trim() === '' || 
         coreConcept.length < 10 ||
         coreConcept.toLowerCase().includes('placeholder');
}

/**
 * Assess asset integration quality
 */
function assessAssetIntegration(analyzerData: AnalyzerInput, refinerData: RefinerOutput): number {
  const assets = analyzerData.assets || [];
  const reformulatedPrompt = refinerData.prompt_analysis?.reformulated_prompt || '';
  
  if (assets.length === 0) return 1.0; // No assets to integrate
  
  let score = 0;
  
  // Check if assets are referenced in reformulated prompt
  const assetsReferenced = assets.filter(asset => 
    reformulatedPrompt.toLowerCase().includes(asset.type) ||
    reformulatedPrompt.toLowerCase().includes(asset.user_description?.toLowerCase() || '')
  ).length;
  
  score += (assetsReferenced / assets.length) * 0.4;
  
  // Check if asset roles are meaningful
  const meaningfulRoles = assets.filter(asset => 
    asset.role && asset.role.length > 10 && !asset.role.includes('**')
  ).length;
  
  score += (meaningfulRoles / assets.length) * 0.3;
  
  // Check if reformulated prompt is substantial
  if (reformulatedPrompt.length > 50) {
    score += 0.3;
  }
  
  return score;
}

/**
 * Assess asset utilization quality (NEW)
 */
function assessAssetUtilization(analyzerData: AnalyzerInput, refinerData: RefinerOutput): number {
  const assets = analyzerData.assets || [];
  const extensions = refinerData.refiner_extensions;
  
  if (assets.length === 0) return 1.0; // No assets to utilize
  
  let score = 0;
  
  // Check session mode appropriateness
  if (extensions?.session_mode === 'asset_driven' && assets.length > 0) {
    score += 0.3;
  } else if (extensions?.session_mode === 'asset_free' && assets.length === 0) {
    score += 0.3;
  }
  
  // Check utilization rate
  const utilizationRate = extensions?.asset_utilization_summary?.utilization_rate || 0;
  score += utilizationRate * 0.4;
  
  // Check if assets are elevated from reference_only
  const referenceOnlyAssets = extensions?.asset_utilization_summary?.reference_only_assets || [];
  if (referenceOnlyAssets.length === 0) {
    score += 0.3; // No assets marked as reference only
  } else {
    score += 0.1; // Some assets still reference only (partial credit)
  }
  
  // Check narrative spine quality
  const narrativeSpine = extensions?.narrative_spine;
  if (narrativeSpine && narrativeSpine.intro && narrativeSpine.core.length > 0 && narrativeSpine.outro) {
    score += 0.2;
  }
  
  return Math.min(1, score);
}

/**
 * Assess content type consistency
 */
function assessContentTypeConsistency(analyzerData: AnalyzerInput, refinerData: RefinerOutput): number {
  const originalAnalysis = analyzerData.prompt_analysis?.content_type_analysis || {};
  const refinerAnalysis = refinerData.prompt_analysis?.content_type_analysis || {};
  
  let consistency = 1.0;
  
  // Check for explainer contradiction
  if (originalAnalysis.needs_explanation === true && originalAnalysis.needs_educational_content === false) {
    consistency -= 0.3;
  }
  
  // Check if refiner fixed the contradiction
  if (refinerAnalysis.needs_explanation === true && refinerAnalysis.needs_educational_content === true) {
    consistency += 0.1; // Bonus for fixing
  }
  
  // Check content category consistency
  if (originalAnalysis.content_category && refinerAnalysis.content_category) {
    if (originalAnalysis.content_category === refinerAnalysis.content_category) {
      consistency += 0.1;
    }
  }
  
  return Math.max(0, Math.min(1, consistency));
}

/**
 * Assess core concept strength
 */
function assessCoreConceptStrength(refinerData: RefinerOutput): number {
  const coreConcept = refinerData.creative_direction?.core_concept || '';
  
  if (coreConcept.length < 10) return 0;
  if (coreConcept.includes('**')) return 0.1;
  
  let strength = 0.5; // Base score
  
  // Length bonus
  if (coreConcept.length > 50) strength += 0.2;
  if (coreConcept.length > 100) strength += 0.1;
  
  // Specificity bonus
  if (coreConcept.includes('content') || coreConcept.includes('create')) strength += 0.1;
  if (coreConcept.includes('visual') || coreConcept.includes('style')) strength += 0.1;
  
  return Math.min(1, strength);
}

/**
 * Calculate overall quality score
 */
function calculateOverallScore(metrics: {
  confidenceGap: number;
  hasPlaceholders: boolean;
  assetIntegrationScore: number;
  assetUtilizationScore: number;
  contentTypeConsistency: number;
  coreConceptStrength: number;
}): number {
  let score = 0.8; // Base score
  
  // Confidence gap penalty
  score -= metrics.confidenceGap * 0.3;
  
  // Placeholder penalty
  if (metrics.hasPlaceholders) {
    score -= 0.3;
  }
  
  // Asset integration bonus
  score += metrics.assetIntegrationScore * 0.15;
  
  // Asset utilization bonus (NEW)
  score += metrics.assetUtilizationScore * 0.15;
  
  // Content type consistency bonus
  score += metrics.contentTypeConsistency * 0.1;
  
  // Core concept strength bonus
  score += metrics.coreConceptStrength * 0.2;
  
  return Math.max(0, Math.min(1, score));
}

/**
 * Determine quality grade
 */
function determineGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 0.9) return 'A';
  if (score >= 0.8) return 'B';
  if (score >= 0.7) return 'C';
  if (score >= 0.6) return 'D';
  return 'F';
}

/**
 * Generate quality improvement suggestions
 */
export function generateQualityImprovements(report: RefinerQualityReport): string[] {
  const improvements: string[] = [];
  
  if (report.metrics.confidenceGap > 0.3) {
    improvements.push('Implement confidence normalization to prevent over-correction');
  }
  
  if (report.metrics.hasPlaceholders) {
    improvements.push('Add placeholder detection and replacement in core concept generation');
  }
  
  if (report.metrics.assetIntegrationScore < 0.7) {
    improvements.push('Enhance asset integration validation and context embedding');
  }
  
  if (report.metrics.contentTypeConsistency < 0.9) {
    improvements.push('Add content type consistency validation and normalization');
  }
  
  if (report.metrics.coreConceptStrength < 0.7) {
    improvements.push('Strengthen core concept extraction and generation');
  }
  
  return improvements;
}

/**
 * Validate refiner output against quality standards
 */
export function validateRefinerQuality(
  analyzerData: AnalyzerInput,
  refinerData: RefinerOutput
): { isValid: boolean; report: RefinerQualityReport } {
  const report = assessRefinerQuality(analyzerData, refinerData);
  
  // Consider invalid if grade is D or F, or if there are critical issues
  const hasCriticalIssues = report.issues.some(issue => issue.severity === 'critical');
  const isValid = report.grade !== 'F' && !hasCriticalIssues;
  
  return { isValid, report };
}

export default {
  assessRefinerQuality,
  generateQualityImprovements,
  validateRefinerQuality
};
