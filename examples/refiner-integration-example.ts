/**
 * Refiner Integration Example
 * 
 * This example shows how to integrate the Step 2a: Refiner = Polished JSON Upgrade
 * into your application workflow.
 */

import { refineAnalyzerJSON, RefinerServiceOptions } from '../lib/analyzer/refiner-service';
import { validateAnalyzerInput } from '../lib/analyzer/refiner-schema';

// Example 1: Basic Refiner Usage
export async function basicRefinerExample() {
  console.log('🔧 Basic Refiner Example');
  
  // Sample analyzer JSON (from query-analyzer output)
  const analyzerJson = {
    "user_request": {
      "original_prompt": "build a vid with these",
      "intent": "image",
      "aspect_ratio": "Smart Auto",
      "platform": "social",
      "image_count": 1
    },
    "assets": [
      {
        "id": "ast_ima01",
        "type": "image",
        "user_description": "use her as main character",
        "ai_caption": "A young woman in graduation gown...",
        "objects_detected": ["person", "car"],
        "style": "unknown",
        "mood": "happy",
        "quality_score": 0.6,
        "role": "primary source footage"
      }
    ],
    "global_analysis": {
      "goal": "Create a social media video",
      "constraints": {
        "aspect_ratio": "Smart Auto",
        "platform": "social"
      }
    },
    "creative_options": [
      {
        "id": "opt_1",
        "title": "Standard Approach",
        "short": "Basic video creation",
        "reasons": ["Simple", "Fast"],
        "estimatedWorkload": "low"
      }
    ],
    "creative_direction": {
      "core_concept": "Create engaging content",
      "visual_approach": "Professional styling",
      "style_direction": "Modern and clean",
      "mood_atmosphere": "Positive and energetic"
    },
    "production_pipeline": {
      "workflow_steps": ["Process assets", "Apply styling", "Export"],
      "estimated_time": "15-30 minutes",
      "success_probability": 0.8
    },
    "quality_metrics": {
      "overall_confidence": 0.7,
      "analysis_quality": 6,
      "completion_status": "partial",
      "feasibility_score": 0.75
    },
    "challenges": [
      {
        "type": "quality",
        "description": "Some assets need enhancement",
        "impact": "moderate"
      }
    ],
    "recommendations": [
      {
        "type": "quality",
        "recommendation": "Enhance asset quality",
        "priority": "recommended"
      }
    ]
  };

  try {
    // Refine the analyzer JSON
    const result = await refineAnalyzerJSON(analyzerJson, {
      enableLogging: true
    });

    if (result.success && result.data) {
      console.log('✅ Refinement successful!');
      console.log(`📊 Model used: ${result.modelUsed}`);
      console.log(`⏱️ Processing time: ${result.processingTimeMs}ms`);
      console.log(`🔄 Retries: ${result.retryCount}`);
      
      // The refined JSON now has:
      // - Confident, specific creative direction (no placeholders)
      // - Normalized asset roles
      // - Tiered recommendations (required vs recommended)
      // - Enhanced conflict detection
      // - Improved quality metrics
      
      console.log('🎯 Key improvements:');
      console.log(`- Reformulated prompt: "${result.data.prompt_analysis.reformulated_prompt}"`);
      console.log(`- Core concept: "${result.data.creative_direction.core_concept}"`);
      console.log(`- Asset role: ${result.data.assets[0].role}`);
      console.log(`- Recommendation priority: ${result.data.recommendations[0].priority}`);
      
      return result.data;
    } else {
      console.error('❌ Refinement failed:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Refiner service error:', error);
    return null;
  }
}

// Example 2: Refiner with Custom Options
export async function customOptionsRefinerExample() {
  console.log('🔧 Custom Options Refiner Example');
  
  const analyzerJson = {
    // ... (same as above)
  };

  const options: RefinerServiceOptions = {
    useFallback: false, // Force Claude 3 Haiku
    maxRetries: 3,
    timeoutMs: 30000,
    enableLogging: true
  };

  try {
    const result = await refineAnalyzerJSON(analyzerJson, options);
    
    if (result.success) {
      console.log('✅ Custom options refinement successful!');
      return result.data;
    }
  } catch (error) {
    console.error('❌ Custom options refinement failed:', error);
  }
}

// Example 3: Batch Refiner Processing
export async function batchRefinerExample() {
  console.log('🔧 Batch Refiner Example');
  
  const analyzerJsonArray = [
    // Multiple analyzer JSON objects
  ];

  try {
    const { batchRefineAnalyzerJSON } = await import('../lib/analyzer/refiner-service');
    
    const results = await batchRefineAnalyzerJSON(analyzerJsonArray, {
      enableLogging: true
    });

    const successCount = results.filter(r => r.success).length;
    console.log(`✅ Batch processing completed: ${successCount}/${analyzerJsonArray.length} successful`);
    
    return results;
  } catch (error) {
    console.error('❌ Batch refinement failed:', error);
  }
}

// Example 4: API Integration
export async function apiIntegrationExample() {
  console.log('🔧 API Integration Example');
  
  const analyzerJson = {
    // ... analyzer JSON
  };

  try {
    const response = await fetch('/api/dreamcut/refiner', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        analyzerJson,
        options: {
          enableLogging: true,
        },
        metadata: {
          userId: 'user-123',
          sessionId: 'session-456',
          source: 'web-app',
        },
      }),
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ API refinement successful!');
      console.log(`📊 Model used: ${result.metadata.modelUsed}`);
      console.log(`⏱️ Processing time: ${result.metadata.processingTimeMs}ms`);
      
      return result.data;
    } else {
      console.error('❌ API refinement failed:', result.error);
    }
  } catch (error) {
    console.error('❌ API integration error:', error);
  }
}

// Example 5: Error Handling and Fallback
export async function errorHandlingExample() {
  console.log('🔧 Error Handling Example');
  
  const invalidAnalyzerJson = {
    // Invalid or incomplete analyzer JSON
    "user_request": {
      "original_prompt": "test"
    }
    // Missing required fields
  };

  try {
    // This will fail validation
    const result = await refineAnalyzerJSON(invalidAnalyzerJson, {
      enableLogging: true,
      maxRetries: 1
    });

    if (!result.success) {
      console.log('❌ Expected failure:', result.error);
      
      // Handle the error appropriately
      if (result.error?.includes('validation')) {
        console.log('🔧 Input validation failed - check your analyzer JSON format');
      } else if (result.error?.includes('Claude') || result.error?.includes('GPT')) {
        console.log('🔧 Model execution failed - check API keys and network');
      } else {
        console.log('🔧 Unknown error occurred');
      }
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Example 6: Cost Estimation
export async function costEstimationExample() {
  console.log('🔧 Cost Estimation Example');
  
  const analyzerJson = {
    // ... analyzer JSON
  };

  try {
    const { estimateRefinerCost } = await import('../lib/analyzer/refiner-service');
    
    // Estimate cost for Claude 3 Haiku
    const claudeCost = estimateRefinerCost(analyzerJson, 'claude-3-haiku');
    console.log(`💰 Estimated Claude 3 Haiku cost: $${claudeCost.toFixed(6)}`);
    
    // Estimate cost for GPT-4o-mini
    const gptCost = estimateRefinerCost(analyzerJson, 'gpt-4o-mini');
    console.log(`💰 Estimated GPT-4o-mini cost: $${gptCost.toFixed(6)}`);
    
    // Choose the more cost-effective option
    const useFallback = gptCost < claudeCost;
    console.log(`🎯 Recommended model: ${useFallback ? 'GPT-4o-mini (fallback)' : 'Claude 3 Haiku (primary)'}`);
    
  } catch (error) {
    console.error('❌ Cost estimation failed:', error);
  }
}

// Example 7: Health Check
export async function healthCheckExample() {
  console.log('🔧 Health Check Example');
  
  try {
    const { refinerServiceHealthCheck } = await import('../lib/analyzer/refiner-service');
    
    const health = await refinerServiceHealthCheck();
    
    console.log(`🏥 Service healthy: ${health.healthy}`);
    console.log(`🤖 Claude 3 Haiku: ${health.models.claude3Haiku ? '✅' : '❌'}`);
    console.log(`🤖 GPT-4o-mini: ${health.models.gpt4oMini ? '✅' : '❌'}`);
    
    if (health.errors.length > 0) {
      console.log('⚠️ Errors:', health.errors);
    }
    
    return health;
  } catch (error) {
    console.error('❌ Health check failed:', error);
  }
}

// Run all examples
export async function runAllExamples() {
  console.log('🚀 Running all refiner examples...\n');
  
  await basicRefinerExample();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await customOptionsRefinerExample();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await errorHandlingExample();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await costEstimationExample();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await healthCheckExample();
  
  console.log('\n🎉 All examples completed!');
}

// Export for use in other files
export {
  basicRefinerExample,
  customOptionsRefinerExample,
  batchRefinerExample,
  apiIntegrationExample,
  errorHandlingExample,
  costEstimationExample,
  healthCheckExample,
  runAllExamples
};
