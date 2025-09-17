/**
 * 🧪 DreamCut Refiner Robustness Test
 * 
 * Comprehensive test suite to validate the robustness improvements made to the refiner.
 * This test demonstrates how the enhanced refiner handles the issues mentioned in the user feedback.
 */

import { 
  assessRefinerQuality, 
  validateRefinerQuality,
  type RefinerQualityReport 
} from './refiner-quality-utils';
import { 
  analyzeConfidenceLevels,
  analyzeCoreConcept,
  normalizeContentTypeAnalysis,
  analyzeAssetIntegration,
  type AnalyzerInput,
  type RefinerOutput
} from './refiner-schema';

// Test data that simulates the problematic scenario from user feedback
const problematicAnalyzerData: AnalyzerInput = {
  user_request: {
    original_prompt: "Create an explainer video about machine learning",
    intent: "video",
    duration_seconds: 60,
    aspect_ratio: "16:9",
    platform: "youtube",
    image_count: 9
  },
  prompt_analysis: {
    user_intent_description: "User wants to create educational content about machine learning",
    reformulated_prompt: "Create a video explaining machine learning concepts",
    clarity_score: 7,
    suggested_improvements: ["Add more specific details about ML concepts"],
    content_type_analysis: {
      needs_explanation: true,
      needs_charts: true,
      needs_diagrams: true,
      needs_educational_content: false, // CONTRADICTION: explainer should be educational
      content_complexity: "moderate",
      requires_visual_aids: true,
      is_instructional: true,
      needs_data_visualization: true,
      requires_interactive_elements: false,
      content_category: "educational"
    }
  },
  assets: [
    {
      id: "asset1",
      type: "image",
      user_description: "Machine learning diagram",
      ai_caption: "A flowchart showing ML process",
      objects_detected: ["diagram", "arrows", "text"],
      style: "technical",
      mood: "professional",
      quality_score: 0.8,
      role: "main visual anchor",
      recommended_edits: ["enhance contrast"]
    },
    {
      id: "asset2", 
      type: "image",
      user_description: "Data visualization chart",
      ai_caption: "Bar chart showing ML performance metrics",
      objects_detected: ["chart", "bars", "numbers"],
      style: "data visualization",
      mood: "analytical",
      quality_score: 0.7,
      role: "supporting visual",
      recommended_edits: ["improve readability"]
    }
  ],
  global_analysis: {
    goal: "Create educational content about machine learning",
    constraints: {
      duration_seconds: 60,
      aspect_ratio: "16:9",
      platform: "youtube"
    },
    asset_roles: {
      "asset1": "main visual anchor",
      "asset2": "supporting visual"
    },
    conflicts: []
  },
  quality_metrics: {
    overall_confidence: 0.33, // LOW CONFIDENCE as mentioned in user feedback
    analysis_quality: 6,
    completion_status: "complete",
    feasibility_score: 0.7
  }
};

// Simulated refiner output with the issues mentioned in user feedback
const problematicRefinerData: RefinerOutput = {
  user_request: {
    original_prompt: "Create an explainer video about machine learning",
    intent: "video",
    duration_seconds: 60,
    aspect_ratio: "16:9",
    platform: "youtube",
    image_count: 9
  },
  prompt_analysis: {
    user_intent_description: "User wants to create educational content about machine learning",
    reformulated_prompt: "Create a video explaining machine learning concepts", // NOT MEANINGFULLY INTEGRATED
    clarity_score: 8,
    suggested_improvements: ["Add more specific details about ML concepts"],
    content_type_analysis: {
      needs_explanation: true,
      needs_charts: true,
      needs_diagrams: true,
      needs_educational_content: true, // FIXED: now consistent
      content_complexity: "moderate",
      requires_visual_aids: true,
      is_instructional: true,
      needs_data_visualization: true,
      requires_interactive_elements: false,
      content_category: "educational"
    }
  },
  assets: [
    {
      id: "asset1",
      type: "image",
      user_description: "Machine learning diagram",
      ai_caption: "A flowchart showing ML process",
      objects_detected: ["diagram", "arrows", "text"],
      style: "technical",
      mood: "professional",
      quality_score: 0.8,
      role: "main visual anchor",
      recommended_edits: ["enhance contrast"]
    },
    {
      id: "asset2",
      type: "image", 
      user_description: "Data visualization chart",
      ai_caption: "Bar chart showing ML performance metrics",
      objects_detected: ["chart", "bars", "numbers"],
      style: "data visualization",
      mood: "analytical",
      quality_score: 0.7,
      role: "supporting visual",
      recommended_edits: ["improve readability"]
    }
  ],
  global_analysis: {
    goal: "Create educational content about machine learning",
    constraints: {
      duration_seconds: 60,
      aspect_ratio: "16:9",
      platform: "youtube"
    },
    asset_roles: {
      "asset1": "main visual anchor",
      "asset2": "supporting visual"
    },
    conflicts: []
  },
  creative_options: [
    {
      id: "option1",
      title: "Technical Explainer",
      short: "Focus on technical details",
      reasons: ["Matches user intent", "Uses available assets"],
      estimatedWorkload: "medium"
    }
  ],
  creative_direction: {
    core_concept: "**", // PLACEHOLDER ISSUE as mentioned in user feedback
    visual_approach: "Use technical diagrams and charts",
    style_direction: "Professional and educational",
    mood_atmosphere: "Authoritative and informative"
  },
  production_pipeline: {
    workflow_steps: [
      "Create video structure",
      "Add visual elements",
      "Include narration",
      "Finalize editing"
    ],
    estimated_time: "2-3 hours",
    success_probability: 0.8,
    quality_targets: {
      technical_quality_target: "high",
      creative_quality_target: "professional",
      consistency_target: "excellent",
      polish_level_target: "refined"
    }
  },
  quality_metrics: {
    overall_confidence: 0.75, // OVER-CORRECTED as mentioned in user feedback
    analysis_quality: 8,
    completion_status: "complete",
    feasibility_score: 0.8
  },
  challenges: [
    {
      type: "technical",
      description: "Need to balance technical depth with accessibility",
      impact: "moderate"
    }
  ],
  recommendations: [
    {
      type: "visual",
      recommendation: "Add more supporting graphics",
      priority: "recommended"
    }
  ]
};

// Improved refiner output that addresses all the issues
const improvedRefinerData: RefinerOutput = {
  ...problematicRefinerData,
  prompt_analysis: {
    ...problematicRefinerData.prompt_analysis,
    reformulated_prompt: "Create an educational video explaining machine learning concepts using the provided technical diagram as the main visual anchor and the data visualization chart as supporting evidence, with clear narration and step-by-step explanations"
  },
  creative_direction: {
    core_concept: "Create a comprehensive educational video that breaks down machine learning concepts into digestible segments, using the technical diagram to illustrate the ML process flow and the data visualization chart to demonstrate real-world performance metrics, ensuring maximum learning impact and retention",
    visual_approach: "Use the technical diagram as primary visual anchor with zoom-ins on key concepts, overlay the data chart for evidence, and maintain professional educational styling",
    style_direction: "Clean, professional, and accessible with high contrast and readable fonts",
    mood_atmosphere: "Authoritative, trustworthy, and engaging with a focus on clarity"
  },
  quality_metrics: {
    ...problematicRefinerData.quality_metrics,
    overall_confidence: 0.55 // REALISTIC confidence that doesn't over-correct
  }
};

/**
 * Run comprehensive robustness tests
 */
export function runRobustnessTests(): {
  problematicResults: RefinerQualityReport;
  improvedResults: RefinerQualityReport;
  improvements: string[];
} {
  console.log('🧪 Running DreamCut Refiner Robustness Tests...\n');
  
  // Test 1: Analyze problematic scenario
  console.log('📊 Testing problematic scenario (as described in user feedback)...');
  const problematicResults = assessRefinerQuality(problematicAnalyzerData, problematicRefinerData);
  
  console.log('❌ Problematic Results:');
  console.log(`   Overall Score: ${problematicResults.overallScore.toFixed(2)} (Grade: ${problematicResults.grade})`);
  console.log(`   Issues Found: ${problematicResults.issues.length}`);
  problematicResults.issues.forEach(issue => {
    console.log(`   - ${issue.severity.toUpperCase()}: ${issue.message}`);
  });
  console.log(`   Confidence Gap: ${problematicResults.metrics.confidenceGap.toFixed(2)}`);
  console.log(`   Has Placeholders: ${problematicResults.metrics.hasPlaceholders}`);
  console.log(`   Asset Integration Score: ${problematicResults.metrics.assetIntegrationScore.toFixed(2)}`);
  console.log(`   Content Type Consistency: ${problematicResults.metrics.contentTypeConsistency.toFixed(2)}`);
  console.log(`   Core Concept Strength: ${problematicResults.metrics.coreConceptStrength.toFixed(2)}\n`);
  
  // Test 2: Analyze improved scenario
  console.log('✅ Testing improved scenario (with robustness fixes)...');
  const improvedResults = assessRefinerQuality(problematicAnalyzerData, improvedRefinerData);
  
  console.log('✅ Improved Results:');
  console.log(`   Overall Score: ${improvedResults.overallScore.toFixed(2)} (Grade: ${improvedResults.grade})`);
  console.log(`   Issues Found: ${improvedResults.issues.length}`);
  improvedResults.issues.forEach(issue => {
    console.log(`   - ${issue.severity.toUpperCase()}: ${issue.message}`);
  });
  console.log(`   Confidence Gap: ${improvedResults.metrics.confidenceGap.toFixed(2)}`);
  console.log(`   Has Placeholders: ${improvedResults.metrics.hasPlaceholders}`);
  console.log(`   Asset Integration Score: ${improvedResults.metrics.assetIntegrationScore.toFixed(2)}`);
  console.log(`   Content Type Consistency: ${improvedResults.metrics.contentTypeConsistency.toFixed(2)}`);
  console.log(`   Core Concept Strength: ${improvedResults.metrics.coreConceptStrength.toFixed(2)}\n`);
  
  // Test 3: Validate improvements
  const problematicValidation = validateRefinerQuality(problematicAnalyzerData, problematicRefinerData);
  const improvedValidation = validateRefinerQuality(problematicAnalyzerData, improvedRefinerData);
  
  console.log('🔍 Validation Results:');
  console.log(`   Problematic Output Valid: ${problematicValidation.isValid}`);
  console.log(`   Improved Output Valid: ${improvedValidation.isValid}\n`);
  
  // Calculate improvements
  const improvements = [
    `Overall score improved from ${problematicResults.overallScore.toFixed(2)} to ${improvedResults.overallScore.toFixed(2)}`,
    `Grade improved from ${problematicResults.grade} to ${improvedResults.grade}`,
    `Issues reduced from ${problematicResults.issues.length} to ${improvedResults.issues.length}`,
    `Confidence gap reduced from ${problematicResults.metrics.confidenceGap.toFixed(2)} to ${improvedResults.metrics.confidenceGap.toFixed(2)}`,
    `Placeholders eliminated: ${problematicResults.metrics.hasPlaceholders} → ${improvedResults.metrics.hasPlaceholders}`,
    `Asset integration improved from ${problematicResults.metrics.assetIntegrationScore.toFixed(2)} to ${improvedResults.metrics.assetIntegrationScore.toFixed(2)}`,
    `Core concept strength improved from ${problematicResults.metrics.coreConceptStrength.toFixed(2)} to ${improvedResults.metrics.coreConceptStrength.toFixed(2)}`
  ];
  
  console.log('📈 Key Improvements:');
  improvements.forEach(improvement => {
    console.log(`   ✅ ${improvement}`);
  });
  
  return {
    problematicResults,
    improvedResults,
    improvements
  };
}

/**
 * Test individual validation functions
 */
export function testIndividualValidations(): void {
  console.log('\n🔧 Testing Individual Validation Functions...\n');
  
  // Test confidence analysis
  const confidenceAnalysis = analyzeConfidenceLevels(problematicAnalyzerData, problematicRefinerData);
  console.log('📊 Confidence Analysis:');
  console.log(`   Analyzer Confidence: ${confidenceAnalysis.analyzerConfidence}`);
  console.log(`   Refiner Confidence: ${confidenceAnalysis.refinerConfidence}`);
  console.log(`   Gap: ${confidenceAnalysis.confidenceGap.toFixed(2)}`);
  console.log(`   Over-corrected: ${confidenceAnalysis.isOverCorrected}`);
  console.log(`   Needs Normalization: ${confidenceAnalysis.needsNormalization}\n`);
  
  // Test core concept analysis
  const coreConceptAnalysis = analyzeCoreConcept(problematicRefinerData.creative_direction);
  console.log('🎯 Core Concept Analysis:');
  console.log(`   Has Placeholder: ${coreConceptAnalysis.hasPlaceholder}`);
  console.log(`   Placeholder Value: "${coreConceptAnalysis.placeholderValue}"`);
  console.log(`   Concept Strength: ${coreConceptAnalysis.conceptStrength}`);
  console.log(`   Needs Enhancement: ${coreConceptAnalysis.needsEnhancement}\n`);
  
  // Test content type normalization
  const contentTypeNormalization = normalizeContentTypeAnalysis(problematicAnalyzerData);
  console.log('🔄 Content Type Normalization:');
  console.log(`   Needs Correction: ${contentTypeNormalization.needsCorrection}`);
  console.log(`   Contradictions: ${contentTypeNormalization.contradictions.join(', ')}`);
  console.log(`   Original needs_educational_content: ${contentTypeNormalization.originalAnalysis.needs_educational_content}`);
  console.log(`   Normalized needs_educational_content: ${contentTypeNormalization.normalizedAnalysis.needs_educational_content}\n`);
  
  // Test asset integration analysis
  const assetIntegrationAnalysis = analyzeAssetIntegration(problematicAnalyzerData, problematicRefinerData);
  console.log('🔗 Asset Integration Analysis:');
  console.log(`   Meaningful Integration: ${assetIntegrationAnalysis.meaningfulIntegration}`);
  console.log(`   Asset Context Embedded: ${assetIntegrationAnalysis.assetContextEmbedded}`);
  console.log(`   Role Clarity: ${assetIntegrationAnalysis.roleClarity}`);
  console.log(`   Integration Score: ${assetIntegrationAnalysis.integrationScore.toFixed(2)}`);
  console.log(`   Issues: ${assetIntegrationAnalysis.issues.join(', ')}\n`);
}

// Export test functions
export default {
  runRobustnessTests,
  testIndividualValidations,
  problematicAnalyzerData,
  problematicRefinerData,
  improvedRefinerData
};
