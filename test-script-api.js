#!/usr/bin/env node

/**
 * 🎬 SCRIPT API TEST RUNNER
 * 
 * Quick test runner for the Script Enhancer API
 * Tests key scenarios to verify functionality
 */

const fs = require('fs');

// Test configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const API_ENDPOINT = `${BASE_URL}/api/dreamcut/script-enhancer`;

// Test scenarios to run
const TEST_SCENARIOS = [
  {
    name: 'Educational Explainer - Short Video',
    profile: 'educational_explainer',
    duration: 15,
    aspect_ratio: '9:16',
    platform: 'tiktok'
  },
  {
    name: 'Finance Explainer - Medium Video',
    profile: 'finance_explainer',
    duration: 30,
    aspect_ratio: '16:9',
    platform: 'youtube'
  },
  {
    name: 'UGC Influencer - Long Video',
    profile: 'ugc_influencer',
    duration: 60,
    aspect_ratio: '16:9',
    platform: 'youtube'
  },
  {
    name: 'Anime Mode - Creative Content',
    profile: 'anime_mode',
    duration: 30,
    aspect_ratio: '9:16',
    platform: 'tiktok'
  },
  {
    name: 'Commercial Ad - Persuasive Content',
    profile: 'ads_commercial',
    duration: 15,
    aspect_ratio: '16:9',
    platform: 'facebook'
  }
];

// Test results
let testResults = {
  timestamp: new Date().toISOString(),
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    successRate: 0
  },
  errors: [],
  details: []
};

/**
 * Create mock input for testing
 */
function createMockInput(scenario) {
  return {
    user_request: {
      original_prompt: `Create a ${scenario.profile} video about ${scenario.name.toLowerCase()}`,
      intent: 'video',
      duration_seconds: scenario.duration,
      aspect_ratio: scenario.aspect_ratio,
      platform: scenario.platform,
      image_count: 1
    },
    prompt_analysis: {
      user_intent_description: `Generate ${scenario.profile} content for ${scenario.platform}`,
      reformulated_prompt: `Create engaging ${scenario.profile} content with ${scenario.aspect_ratio} format`,
      clarity_score: 8,
      suggested_improvements: [
        'Specify the target audience',
        'Include call-to-action elements'
      ],
      content_type_analysis: {
        needs_explanation: scenario.profile.includes('explainer'),
        needs_charts: scenario.profile === 'finance_explainer',
        needs_diagrams: scenario.profile === 'educational_explainer',
        needs_educational_content: scenario.profile.includes('educational'),
        content_complexity: scenario.duration > 30 ? 'complex' : 'simple',
        requires_visual_aids: true,
        is_instructional: scenario.profile.includes('tutorial'),
        needs_data_visualization: scenario.profile === 'finance_explainer',
        requires_interactive_elements: false,
        content_category: 'general'
      }
    },
    assets: [
      {
        id: 'user_image_01',
        type: 'image',
        url: 'https://example.com/test-image.jpg',
        user_description: 'Test image for script generation',
        ai_caption: 'Professional test image with good composition',
        objects_detected: ['object', 'background'],
        quality_score: 0.85
      }
    ],
    global_analysis: {
      goal: `Create high-quality ${scenario.profile} content`,
      constraints: {
        duration_seconds: scenario.duration,
        aspect_ratio: scenario.aspect_ratio,
        platform: scenario.platform
      },
      asset_roles: {
        'user_image_01': 'primary_visual'
      },
      conflicts: []
    },
    creative_options: [
      {
        id: 'opt_primary',
        title: `${scenario.profile} Style`,
        short: `Professional ${scenario.profile} approach`,
        reasons: ['Matches profile requirements', 'Platform optimized'],
        estimatedWorkload: 'medium'
      }
    ],
    creative_direction: {
      core_concept: `Deliver ${scenario.profile} content effectively`,
      visual_approach: 'Professional and engaging',
      style_direction: 'Modern and clean',
      mood_atmosphere: 'Energetic and engaging'
    },
    production_pipeline: {
      workflow_steps: [
        'Analyze content requirements',
        'Generate script structure',
        'Create scene breakdown',
        'Plan asset integration'
      ],
      estimated_time: `${Math.ceil(scenario.duration / 10)}-${Math.ceil(scenario.duration / 5)} minutes`,
      success_probability: 0.9,
      quality_targets: {
        technical_quality_target: 'high',
        creative_quality_target: 'appealing',
        consistency_target: 'good',
        polish_level_target: 'refined'
      }
    },
    quality_metrics: {
      overall_confidence: 0.85,
      analysis_quality: 8,
      completion_status: 'complete',
      feasibility_score: 0.9
    },
    challenges: [],
    recommendations: [
      {
        type: 'quality',
        recommendation: 'Ensure proper pacing for target duration',
        priority: 'recommended'
      }
    ],
    refiner_extensions: {
      creative_profile: {
        profileId: scenario.profile,
        profileName: scenario.profile.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        goal: `Create engaging ${scenario.profile} content`,
        confidence: '0.95',
        detectionMethod: 'multi-factor',
        matchedFactors: [`profile: ${scenario.profile}`, 'priority_bonus: 95']
      }
    }
  };
}

/**
 * Validate script response
 */
function validateScriptResponse(response, scenario) {
  const errors = [];
  
  if (!response.success) {
    errors.push('Response success flag is false');
  }
  
  // Check for human-readable script (new format)
  if (!response.human_readable_script) {
    errors.push('Missing human_readable_script');
    return { valid: false, errors };
  }
  
  // Check basic structure
  if (!response.script_metadata) {
    errors.push('Missing script_metadata');
  } else {
    if (response.script_metadata.profile !== scenario.profile) {
      errors.push(`Profile mismatch: expected ${scenario.profile}, got ${response.script_metadata.profile}`);
    }
    if (response.script_metadata.duration_seconds !== scenario.duration) {
      errors.push(`Duration mismatch: expected ${scenario.duration}s, got ${response.script_metadata.duration_seconds}s`);
    }
  }
  
  // Check that human-readable script contains expected sections
  const script = response.human_readable_script;
  if (!script.includes('=== SCRIPT TITLE ===')) {
    errors.push('Missing script title section');
  }
  
  if (!script.includes('=== SCENES ===')) {
    errors.push('Missing scenes section');
  }
  
  if (!script.includes('=== VOICEOVER GUIDANCE ===')) {
    errors.push('Missing voiceover guidance section');
  }
  
  if (!script.includes('=== MUSIC & AUDIO PLAN ===')) {
    errors.push('Missing music & audio plan section');
  }
  
  if (!response.quality_assessment) {
    errors.push('Missing quality_assessment');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Make API request
 */
async function makeApiRequest(input) {
  const startTime = Date.now();
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    
    const responseTime = Date.now() - startTime;
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    return { success: true, data, responseTime };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return { success: false, error: error.message, responseTime };
  }
}

/**
 * Run a single test
 */
async function runTest(scenario) {
  console.log(`\n🧪 Testing: ${scenario.name}`);
  
  const input = createMockInput(scenario);
  const result = await makeApiRequest(input);
  
  const testResult = {
    scenario: scenario.name,
    success: result.success,
    responseTime: result.responseTime,
    validation: { valid: false, errors: [] },
    result: null,
    error: null
  };
  
  if (result.success) {
    const validation = validateScriptResponse(result.data, scenario);
    testResult.validation = validation;
    testResult.result = result.data;
    
    if (validation.valid) {
      console.log(`✅ ${scenario.name} - PASSED (${result.responseTime}ms)`);
      console.log(`   Profile: ${result.data.script?.script_metadata?.profile}`);
      console.log(`   Scenes: ${result.data.script?.scenes?.length || 0}`);
      console.log(`   Quality: ${result.data.quality_assessment?.grade || 'N/A'}`);
    } else {
      console.log(`❌ ${scenario.name} - VALIDATION FAILED: ${validation.errors.join(', ')}`);
      testResult.error = `Validation failed: ${validation.errors.join(', ')}`;
    }
  } else {
    console.log(`❌ ${scenario.name} - FAILED: ${result.error}`);
    testResult.error = result.error;
  }
  
  return testResult;
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🎬 Starting Script API Test Suite');
  console.log(`📍 Testing endpoint: ${API_ENDPOINT}`);
  console.log(`📊 Total test scenarios: ${TEST_SCENARIOS.length}`);
  
  const startTime = Date.now();
  
  for (const scenario of TEST_SCENARIOS) {
    const testResult = await runTest(scenario);
    testResults.details.push(testResult);
    testResults.summary.total++;
    
    if (testResult.success && testResult.validation.valid) {
      testResults.summary.passed++;
    } else {
      testResults.summary.failed++;
      testResults.errors.push(`${testResult.scenario}: ${testResult.error || 'Validation failed'}`);
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  const totalTime = Date.now() - startTime;
  testResults.summary.successRate = (testResults.summary.passed / testResults.summary.total) * 100;
  
  console.log('\n📊 Test Results Summary:');
  console.log(`Total Tests: ${testResults.summary.total}`);
  console.log(`Passed: ${testResults.summary.passed}`);
  console.log(`Failed: ${testResults.summary.failed}`);
  console.log(`Success Rate: ${testResults.summary.successRate.toFixed(2)}%`);
  console.log(`Total Time: ${(totalTime / 1000).toFixed(2)}s`);
  
  if (testResults.errors.length > 0) {
    console.log('\n❌ Errors:');
    testResults.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  // Save results
  const reportPath = 'script-api-test-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  
  return testResults;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };

