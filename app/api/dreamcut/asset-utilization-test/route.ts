/**
 * 🧪 DreamCut Asset Utilization Test API
 * 
 * API endpoint to test the new asset utilization features that prevent the "reference only" issue.
 * This endpoint demonstrates how the enhanced refiner handles both asset-driven and asset-free modes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { runAssetUtilizationTests, testIndividualAssetUtilizationFunctions } from '@/lib/analyzer/asset-utilization-test';

export async function POST(req: NextRequest) {
  try {
    console.log('🧪 [Asset Utilization Test] Starting comprehensive asset utilization tests...');
    
    // Run the main asset utilization tests
    const testResults = runAssetUtilizationTests();
    
    // Run individual function tests
    testIndividualAssetUtilizationFunctions();
    
    // Format results for the frontend
    const response = {
      assetDrivenHighQuality: {
        sessionMode: testResults.assetDrivenHighQuality.sessionMode,
        utilization: testResults.assetDrivenHighQuality.utilization,
        narrative: testResults.assetDrivenHighQuality.narrative
      },
      assetDrivenLowQuality: {
        sessionMode: testResults.assetDrivenLowQuality.sessionMode,
        utilization: testResults.assetDrivenLowQuality.utilization,
        narrative: testResults.assetDrivenLowQuality.narrative
      },
      assetFreeMode: {
        sessionMode: testResults.assetFreeMode.sessionMode,
        utilization: testResults.assetFreeMode.utilization,
        narrative: testResults.assetFreeMode.narrative,
        scaffolding: testResults.assetFreeMode.scaffolding
      },
      summary: testResults.summary,
      improvements: [
        'Assets are never marked as "reference only" - always elevated to meaningful roles',
        'Session mode detection correctly identifies asset-driven vs asset-free scenarios',
        'Narrative spine provides clear structure for all outputs',
        'Default scaffolding ensures quality even without user assets',
        'Utilization rate is never 0 when assets exist',
        'Low-quality assets are elevated to generation seeds or supporting elements'
      ]
    };
    
    console.log('🧪 [Asset Utilization Test] Tests completed successfully');
    console.log('📊 [Asset Utilization Test] Summary:', {
      totalTests: testResults.summary.totalTests,
      passedTests: testResults.summary.passedTests,
      keyFindings: testResults.summary.keyFindings.length
    });
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('🧪 [Asset Utilization Test] Test execution failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Asset utilization test execution failed',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'DreamCut Asset Utilization Test API',
    description: 'Test the new asset utilization features that prevent the "reference only" issue',
    endpoints: {
      POST: 'Run comprehensive asset utilization tests'
    },
    features: [
      'Session mode detection (asset_driven vs asset_free)',
      'Asset elevation from reference-only to meaningful roles',
      'Narrative spine generation for all outputs',
      'Default scaffolding for asset-free mode',
      'Utilization rate calculation and validation',
      'Asset integration quality assessment'
    ],
    testScenarios: [
      'Asset-driven mode with high-quality assets',
      'Asset-driven mode with low-quality assets (elevation test)',
      'Asset-free mode with profile default scaffolding'
    ]
  });
}
