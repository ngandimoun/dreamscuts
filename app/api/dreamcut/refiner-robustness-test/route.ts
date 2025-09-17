/**
 * 🧪 DreamCut Refiner Robustness Test API
 * 
 * API endpoint to test the robustness improvements made to the refiner system.
 * This endpoint demonstrates how the enhanced refiner handles the issues mentioned in user feedback.
 */

import { NextRequest, NextResponse } from 'next/server';
import { runRobustnessTests, testIndividualValidations } from '@/lib/analyzer/refiner-robustness-test';

export async function POST(req: NextRequest) {
  try {
    console.log('🧪 [Robustness Test] Starting comprehensive refiner robustness tests...');
    
    // Run the main robustness tests
    const testResults = runRobustnessTests();
    
    // Run individual validation tests
    testIndividualValidations();
    
    // Format results for the frontend
    const response = {
      problematic: {
        overallScore: testResults.problematicResults.overallScore,
        grade: testResults.problematicResults.grade,
        issuesCount: testResults.problematicResults.issues.length,
        recommendationsCount: testResults.problematicResults.recommendations.length,
        hasIssues: testResults.problematicResults.issues.length > 0,
        confidenceGap: testResults.problematicResults.metrics.confidenceGap,
        hasPlaceholder: testResults.problematicResults.metrics.hasPlaceholders,
        assetIntegrationScore: testResults.problematicResults.metrics.assetIntegrationScore,
        isValid: testResults.problematicResults.issues.filter(issue => issue.severity === 'critical').length === 0,
        detailedIssues: testResults.problematicResults.issues.map(issue => ({
          type: issue.type,
          severity: issue.severity,
          message: issue.message,
          suggestion: issue.suggestion
        }))
      },
      improved: {
        overallScore: testResults.improvedResults.overallScore,
        grade: testResults.improvedResults.grade,
        issuesCount: testResults.improvedResults.issues.length,
        recommendationsCount: testResults.improvedResults.recommendations.length,
        hasIssues: testResults.improvedResults.issues.length > 0,
        confidenceGap: testResults.improvedResults.metrics.confidenceGap,
        hasPlaceholder: testResults.improvedResults.metrics.hasPlaceholders,
        assetIntegrationScore: testResults.improvedResults.metrics.assetIntegrationScore,
        isValid: testResults.improvedResults.issues.filter(issue => issue.severity === 'critical').length === 0,
        detailedIssues: testResults.improvedResults.issues.map(issue => ({
          type: issue.type,
          severity: issue.severity,
          message: issue.message,
          suggestion: issue.suggestion
        }))
      },
      improvements: testResults.improvements,
      summary: {
        scoreImprovement: testResults.improvedResults.overallScore - testResults.problematicResults.overallScore,
        gradeImprovement: testResults.improvedResults.grade !== testResults.problematicResults.grade,
        issuesReduction: testResults.problematicResults.issues.length - testResults.improvedResults.issues.length,
        confidenceGapReduction: testResults.problematicResults.metrics.confidenceGap - testResults.improvedResults.metrics.confidenceGap,
        placeholderElimination: testResults.problematicResults.metrics.hasPlaceholders && !testResults.improvedResults.metrics.hasPlaceholders,
        assetIntegrationImprovement: testResults.improvedResults.metrics.assetIntegrationScore - testResults.problematicResults.metrics.assetIntegrationScore
      }
    };
    
    console.log('🧪 [Robustness Test] Tests completed successfully');
    console.log('📊 [Robustness Test] Summary:', {
      scoreImprovement: response.summary.scoreImprovement.toFixed(2),
      gradeImprovement: response.summary.gradeImprovement,
      issuesReduction: response.summary.issuesReduction,
      confidenceGapReduction: response.summary.confidenceGapReduction.toFixed(2),
      placeholderElimination: response.summary.placeholderElimination,
      assetIntegrationImprovement: response.summary.assetIntegrationImprovement.toFixed(2)
    });
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('🧪 [Robustness Test] Test execution failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Robustness test execution failed',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'DreamCut Refiner Robustness Test API',
    description: 'Test the robustness improvements made to the refiner system',
    endpoints: {
      POST: 'Run comprehensive robustness tests'
    },
    features: [
      'Confidence level validation and normalization',
      'Placeholder detection in core concepts',
      'Content type analysis consistency checks',
      'Asset integration quality assessment',
      'Comprehensive quality scoring and grading',
      'Detailed issue detection and recommendations'
    ]
  });
}
