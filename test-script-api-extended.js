#!/usr/bin/env node

/**
 * 🎬 EXTENDED SCRIPT API TEST SUITE
 * 
 * Comprehensive testing covering:
 * - Different duration ranges
 * - Various aspect ratios and platforms
 * - Edge cases and error handling
 * - Asset integration scenarios
 * - Performance testing
 */

const fs = require('fs');

// Test configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const API_ENDPOINT = `${BASE_URL}/api/dreamcut/script-enhancer`;

// Extended test scenarios
const DURATION_TESTS = [
  { name: 'Ultra Short (5s)', duration: 5 },
  { name: 'Short (10s)', duration: 10 },
  { name: 'Medium Short (15s)', duration: 15 },
  { name: 'Standard (30s)', duration: 30 },
  { name: 'Long (60s)', duration: 60 },
  { name: 'Extended (120s)', duration: 120 },
  { name: 'Very Long (180s)', duration: 180 }
];

const ASPECT_RATIO_TESTS = [
  { name: 'Portrait (9:16)', aspect_ratio: '9:16', platform: 'tiktok' },
  { name: 'Landscape (16:9)', aspect_ratio: '16:9', platform: 'youtube' },
  { name: 'Square (1:1)', aspect_ratio: '1:1', platform: 'instagram' },
  { name: 'Standard (4:3)', aspect_ratio: '4:3', platform: 'linkedin' }
];

const PLATFORM_TESTS = [
  { name: 'TikTok', platform: 'tiktok', aspect_ratio: '9:16' },
  { name: 'Instagram Reels', platform: 'instagram', aspect_ratio: '9:16' },
  { name: 'YouTube Shorts', platform: 'youtube', aspect_ratio: '9:16' },
  { name: 'YouTube Long-form', platform: 'youtube', aspect_ratio: '16:9' },
  { name: 'LinkedIn', platform: 'linkedin', aspect_ratio: '16:9' },
  { name: 'Facebook', platform: 'facebook', aspect_ratio: '16:9' }
];

const ASSET_INTEGRATION_TESTS = [
  {
    name: 'No Assets',
    assets: []
  },
  {
    name: 'Single Image',
    assets: [
      {
        id: 'user_image_01',
        type: 'image',
        url: 'https://example.com/image1.jpg',
        user_description: 'Test image',
        ai_caption: 'Professional test image',
        objects_detected: ['object'],
        quality_score: 0.85
      }
    ]
  },
  {
    name: 'Multiple Images',
    assets: [
      {
        id: 'user_image_01',
        type: 'image',
        url: 'https://example.com/image1.jpg',
        user_description: 'First image',
        ai_caption: 'First test image',
        objects_detected: ['object1'],
        quality_score: 0.85
      },
      {
        id: 'user_image_02',
        type: 'image',
        url: 'https://example.com/image2.jpg',
        user_description: 'Second image',
        ai_caption: 'Second test image',
        objects_detected: ['object2'],
        quality_score: 0.90
      }
    ]
  },
  {
    name: 'Mixed Media',
    assets: [
      {
        id: 'user_image_01',
        type: 'image',
        url: 'https://example.com/image.jpg',
        user_description: 'Image asset',
        ai_caption: 'Test image',
        objects_detected: ['object'],
        quality_score: 0.85
      },
      {
        id: 'user_video_01',
        type: 'video',
        url: 'https://example.com/video.mp4',
        user_description: 'Video asset',
        ai_caption: 'Test video',
        objects_detected: ['movement'],
        quality_score: 0.75
      }
    ]
  }
];

const EDGE_CASE_TESTS = [
  {
    name: 'Empty Request Body',
    input: {},
    shouldFail: true
  },
  {
    name: 'Invalid Duration (0s)',
    input: null, // Will be created dynamically
    shouldFail: true
  },
  {
    name: 'Invalid Duration (negative)',
    input: null, // Will be created dynamically
    shouldFail: true
  },
  {
    name: 'Invalid Duration (too long)',
    input: null, // Will be created dynamically
    shouldFail: true
  },
  {
    name: 'Invalid Aspect Ratio',
    input: null, // Will be created dynamically
    shouldFail: true
  },
  {
    name: 'Invalid Platform',
    input: null, // Will be created dynamically
    shouldFail: true
  },
  {
    name: 'Invalid Profile ID',
    input: null, // Will be created dynamically
    shouldFail: false // Should fallback to default
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
  details: [],
  performance: {
    averageResponseTime: 0,
    minResponseTime: Infinity,
    maxResponseTime: 0,
    responseTimeHistory: []
  }
};

/**
 * Create mock input for testing
 */
function createMockInput(profile = 'educational_explainer', duration = 30, aspect_ratio = '16:9', platform = 'youtube', assets = []) {
  return {
    user_request: {
      original_prompt: `Create a ${profile} video about testing`,
      intent: 'video',
      duration_seconds: duration,
      aspect_ratio: aspect_ratio,
      platform: platform,
      image_count: assets.filter(a => a.type === 'image').length
    },
    prompt_analysis: {
      user_intent_description: `Generate ${profile} content for ${platform}`,
      reformulated_prompt: `Create engaging ${profile} content with ${aspect_ratio} format`,
      clarity_score: 8,
      suggested_improvements: ['Specify target audience'],
      content_type_analysis: {
        needs_explanation: profile.includes('explainer'),
        needs_charts: profile === 'finance_explainer',
        needs_diagrams: profile === 'educational_explainer',
        needs_educational_content: profile.includes('educational'),
        content_complexity: duration > 60 ? 'complex' : 'simple',
        requires_visual_aids: true,
        is_instructional: profile.includes('tutorial'),
        needs_data_visualization: profile === 'finance_explainer',
        requires_interactive_elements: false,
        content_category: 'general'
      }
    },
    assets: assets,
    global_analysis: {
      goal: `Create high-quality ${profile} content`,
      constraints: {
        duration_seconds: duration,
        aspect_ratio: aspect_ratio,
        platform: platform
      },
      asset_roles: assets.reduce((acc, asset) => {
        acc[asset.id] = 'primary_visual';
        return acc;
      }, {}),
      conflicts: []
    },
    creative_options: [
      {
        id: 'opt_primary',
        title: `${profile} Style`,
        short: `Professional ${profile} approach`,
        reasons: ['Matches requirements'],
        estimatedWorkload: 'medium'
      }
    ],
    creative_direction: {
      core_concept: `Deliver ${profile} content effectively`,
      visual_approach: 'Professional and engaging',
      style_direction: 'Modern and clean',
      mood_atmosphere: 'Energetic and engaging'
    },
    production_pipeline: {
      workflow_steps: ['Analyze', 'Generate', 'Create', 'Plan'],
      estimated_time: '30-45 minutes',
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
        recommendation: 'Ensure proper pacing',
        priority: 'recommended'
      }
    ],
    refiner_extensions: {
      creative_profile: {
        profileId: profile,
        profileName: profile.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        goal: `Create engaging ${profile} content`,
        confidence: '0.95',
        detectionMethod: 'multi-factor',
        matchedFactors: [`profile: ${profile}`, 'priority_bonus: 95']
      }
    }
  };
}

/**
 * Validate script response
 */
function validateScriptResponse(response, expectedProfile, expectedDuration) {
  const errors = [];
  
  if (!response.success) {
    errors.push('Response success flag is false');
  }
  
  if (!response.script) {
    errors.push('Missing script object');
    return { valid: false, errors };
  }
  
  const script = response.script;
  
  // Check basic structure
  if (!script.script_metadata) {
    errors.push('Missing script_metadata');
  } else {
    if (script.script_metadata.profile !== expectedProfile) {
      errors.push(`Profile mismatch: expected ${expectedProfile}, got ${script.script_metadata.profile}`);
    }
    if (script.script_metadata.duration_seconds !== expectedDuration) {
      errors.push(`Duration mismatch: expected ${expectedDuration}s, got ${script.script_metadata.duration_seconds}s`);
    }
  }
  
  if (!script.scenes || !Array.isArray(script.scenes) || script.scenes.length === 0) {
    errors.push('Missing or empty scenes array');
  }
  
  if (!script.global_voiceover) {
    errors.push('Missing global_voiceover');
  }
  
  if (!script.music_plan) {
    errors.push('Missing music_plan');
  }
  
  if (!script.asset_integration) {
    errors.push('Missing asset_integration');
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
 * Run duration tests
 */
async function runDurationTests() {
  console.log('\n📏 Testing Different Duration Ranges...');
  
  for (const test of DURATION_TESTS) {
    console.log(`\n🧪 Testing: ${test.name}`);
    
    const input = createMockInput('educational_explainer', test.duration, '16:9', 'youtube');
    const result = await makeApiRequest(input);
    
    const testResult = {
      scenario: `Duration Test - ${test.name}`,
      success: result.success,
      responseTime: result.responseTime,
      validation: { valid: false, errors: [] },
      result: null,
      error: null
    };
    
    if (result.success) {
      const validation = validateScriptResponse(result.data, 'educational_explainer', test.duration);
      testResult.validation = validation;
      testResult.result = result.data;
      
      if (validation.valid) {
        console.log(`✅ ${test.name} - PASSED (${result.responseTime}ms)`);
        console.log(`   Scenes: ${result.data.script?.scenes?.length || 0}`);
        console.log(`   Quality: ${result.data.quality_assessment?.grade || 'N/A'}`);
      } else {
        console.log(`❌ ${test.name} - VALIDATION FAILED: ${validation.errors.join(', ')}`);
        testResult.error = `Validation failed: ${validation.errors.join(', ')}`;
      }
    } else {
      console.log(`❌ ${test.name} - FAILED: ${result.error}`);
      testResult.error = result.error;
    }
    
    testResults.details.push(testResult);
    testResults.summary.total++;
    
    if (testResult.success && testResult.validation.valid) {
      testResults.summary.passed++;
    } else {
      testResults.summary.failed++;
      testResults.errors.push(`${testResult.scenario}: ${testResult.error || 'Validation failed'}`);
    }
    
    // Update performance metrics
    testResults.performance.responseTimeHistory.push(result.responseTime);
    testResults.performance.minResponseTime = Math.min(testResults.performance.minResponseTime, result.responseTime);
    testResults.performance.maxResponseTime = Math.max(testResults.performance.maxResponseTime, result.responseTime);
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

/**
 * Run aspect ratio tests
 */
async function runAspectRatioTests() {
  console.log('\n📐 Testing Different Aspect Ratios...');
  
  for (const test of ASPECT_RATIO_TESTS) {
    console.log(`\n🧪 Testing: ${test.name}`);
    
    const input = createMockInput('ugc_influencer', 30, test.aspect_ratio, test.platform);
    const result = await makeApiRequest(input);
    
    const testResult = {
      scenario: `Aspect Ratio Test - ${test.name}`,
      success: result.success,
      responseTime: result.responseTime,
      validation: { valid: false, errors: [] },
      result: null,
      error: null
    };
    
    if (result.success) {
      const validation = validateScriptResponse(result.data, 'ugc_influencer', 30);
      testResult.validation = validation;
      testResult.result = result.data;
      
      if (validation.valid) {
        console.log(`✅ ${test.name} - PASSED (${result.responseTime}ms)`);
        console.log(`   Orientation: ${result.data.script?.script_metadata?.orientation || 'N/A'}`);
        console.log(`   Scenes: ${result.data.script?.scenes?.length || 0}`);
      } else {
        console.log(`❌ ${test.name} - VALIDATION FAILED: ${validation.errors.join(', ')}`);
        testResult.error = `Validation failed: ${validation.errors.join(', ')}`;
      }
    } else {
      console.log(`❌ ${test.name} - FAILED: ${result.error}`);
      testResult.error = result.error;
    }
    
    testResults.details.push(testResult);
    testResults.summary.total++;
    
    if (testResult.success && testResult.validation.valid) {
      testResults.summary.passed++;
    } else {
      testResults.summary.failed++;
      testResults.errors.push(`${testResult.scenario}: ${testResult.error || 'Validation failed'}`);
    }
    
    // Update performance metrics
    testResults.performance.responseTimeHistory.push(result.responseTime);
    testResults.performance.minResponseTime = Math.min(testResults.performance.minResponseTime, result.responseTime);
    testResults.performance.maxResponseTime = Math.max(testResults.performance.maxResponseTime, result.responseTime);
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

/**
 * Run platform tests
 */
async function runPlatformTests() {
  console.log('\n🌐 Testing Different Platforms...');
  
  for (const test of PLATFORM_TESTS) {
    console.log(`\n🧪 Testing: ${test.name}`);
    
    const input = createMockInput('finance_explainer', 30, test.aspect_ratio, test.platform);
    const result = await makeApiRequest(input);
    
    const testResult = {
      scenario: `Platform Test - ${test.name}`,
      success: result.success,
      responseTime: result.responseTime,
      validation: { valid: false, errors: [] },
      result: null,
      error: null
    };
    
    if (result.success) {
      const validation = validateScriptResponse(result.data, 'finance_explainer', 30);
      testResult.validation = validation;
      testResult.result = result.data;
      
      if (validation.valid) {
        console.log(`✅ ${test.name} - PASSED (${result.responseTime}ms)`);
        console.log(`   Platform: ${test.platform}`);
        console.log(`   Scenes: ${result.data.script?.scenes?.length || 0}`);
      } else {
        console.log(`❌ ${test.name} - VALIDATION FAILED: ${validation.errors.join(', ')}`);
        testResult.error = `Validation failed: ${validation.errors.join(', ')}`;
      }
    } else {
      console.log(`❌ ${test.name} - FAILED: ${result.error}`);
      testResult.error = result.error;
    }
    
    testResults.details.push(testResult);
    testResults.summary.total++;
    
    if (testResult.success && testResult.validation.valid) {
      testResults.summary.passed++;
    } else {
      testResults.summary.failed++;
      testResults.errors.push(`${testResult.scenario}: ${testResult.error || 'Validation failed'}`);
    }
    
    // Update performance metrics
    testResults.performance.responseTimeHistory.push(result.responseTime);
    testResults.performance.minResponseTime = Math.min(testResults.performance.minResponseTime, result.responseTime);
    testResults.performance.maxResponseTime = Math.max(testResults.performance.maxResponseTime, result.responseTime);
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

/**
 * Run asset integration tests
 */
async function runAssetIntegrationTests() {
  console.log('\n🖼️ Testing Asset Integration Scenarios...');
  
  for (const test of ASSET_INTEGRATION_TESTS) {
    console.log(`\n🧪 Testing: ${test.name}`);
    
    const input = createMockInput('anime_mode', 30, '16:9', 'youtube', test.assets);
    const result = await makeApiRequest(input);
    
    const testResult = {
      scenario: `Asset Integration Test - ${test.name}`,
      success: result.success,
      responseTime: result.responseTime,
      validation: { valid: false, errors: [] },
      result: null,
      error: null
    };
    
    if (result.success) {
      const validation = validateScriptResponse(result.data, 'anime_mode', 30);
      testResult.validation = validation;
      testResult.result = result.data;
      
      if (validation.valid) {
        console.log(`✅ ${test.name} - PASSED (${result.responseTime}ms)`);
        console.log(`   Assets Used: ${result.data.script?.asset_integration?.user_assets_used?.length || 0}`);
        console.log(`   Generated Content: ${result.data.script?.asset_integration?.generated_content_needed?.length || 0}`);
      } else {
        console.log(`❌ ${test.name} - VALIDATION FAILED: ${validation.errors.join(', ')}`);
        testResult.error = `Validation failed: ${validation.errors.join(', ')}`;
      }
    } else {
      console.log(`❌ ${test.name} - FAILED: ${result.error}`);
      testResult.error = result.error;
    }
    
    testResults.details.push(testResult);
    testResults.summary.total++;
    
    if (testResult.success && testResult.validation.valid) {
      testResults.summary.passed++;
    } else {
      testResults.summary.failed++;
      testResults.errors.push(`${testResult.scenario}: ${testResult.error || 'Validation failed'}`);
    }
    
    // Update performance metrics
    testResults.performance.responseTimeHistory.push(result.responseTime);
    testResults.performance.minResponseTime = Math.min(testResults.performance.minResponseTime, result.responseTime);
    testResults.performance.maxResponseTime = Math.max(testResults.performance.maxResponseTime, result.responseTime);
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

/**
 * Run edge case tests
 */
async function runEdgeCaseTests() {
  console.log('\n⚠️ Testing Edge Cases and Error Handling...');
  
  for (const test of EDGE_CASE_TESTS) {
    console.log(`\n🧪 Testing: ${test.name}`);
    
    let input = test.input;
    
    // Create dynamic inputs for edge cases
    if (input === null) {
      switch (test.name) {
        case 'Invalid Duration (0s)':
          input = createMockInput('educational_explainer', 0, '16:9', 'youtube');
          break;
        case 'Invalid Duration (negative)':
          input = createMockInput('educational_explainer', -10, '16:9', 'youtube');
          break;
        case 'Invalid Duration (too long)':
          input = createMockInput('educational_explainer', 3600, '16:9', 'youtube');
          break;
        case 'Invalid Aspect Ratio':
          input = createMockInput('educational_explainer', 30, 'invalid', 'youtube');
          break;
        case 'Invalid Platform':
          input = createMockInput('educational_explainer', 30, '16:9', 'invalid_platform');
          break;
        case 'Invalid Profile ID':
          input = createMockInput('invalid_profile', 30, '16:9', 'youtube');
          break;
      }
    }
    
    const result = await makeApiRequest(input);
    
    const testResult = {
      scenario: `Edge Case Test - ${test.name}`,
      success: result.success,
      responseTime: result.responseTime,
      validation: { valid: false, errors: [] },
      result: null,
      error: null
    };
    
    if (test.shouldFail && result.success) {
      console.log(`❌ ${test.name} - Expected failure but got success`);
      testResult.error = 'Expected failure but got success';
    } else if (!test.shouldFail && !result.success) {
      console.log(`❌ ${test.name} - Expected success but got failure: ${result.error}`);
      testResult.error = `Expected success but got failure: ${result.error}`;
    } else {
      console.log(`✅ ${test.name} - ${result.success ? 'PASSED' : 'FAILED as expected'}`);
      if (result.success) {
        testResult.result = result.data;
      }
    }
    
    testResults.details.push(testResult);
    testResults.summary.total++;
    
    if ((test.shouldFail && !result.success) || (!test.shouldFail && result.success)) {
      testResults.summary.passed++;
    } else {
      testResults.summary.failed++;
      testResults.errors.push(`${testResult.scenario}: ${testResult.error || 'Unexpected result'}`);
    }
    
    // Update performance metrics
    testResults.performance.responseTimeHistory.push(result.responseTime);
    testResults.performance.minResponseTime = Math.min(testResults.performance.minResponseTime, result.responseTime);
    testResults.performance.maxResponseTime = Math.max(testResults.performance.maxResponseTime, result.responseTime);
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

/**
 * Main test runner
 */
async function runExtendedTests() {
  console.log('🎬 Starting Extended Script API Test Suite');
  console.log(`📍 Testing endpoint: ${API_ENDPOINT}`);
  
  const startTime = Date.now();
  
  // Run all test suites
  await runDurationTests();
  await runAspectRatioTests();
  await runPlatformTests();
  await runAssetIntegrationTests();
  await runEdgeCaseTests();
  
  const totalTime = Date.now() - startTime;
  
  // Calculate final metrics
  testResults.summary.successRate = (testResults.summary.passed / testResults.summary.total) * 100;
  testResults.performance.averageResponseTime = testResults.performance.responseTimeHistory.reduce((a, b) => a + b, 0) / testResults.performance.responseTimeHistory.length;
  
  console.log('\n📊 Extended Test Results Summary:');
  console.log(`Total Tests: ${testResults.summary.total}`);
  console.log(`Passed: ${testResults.summary.passed}`);
  console.log(`Failed: ${testResults.summary.failed}`);
  console.log(`Success Rate: ${testResults.summary.successRate.toFixed(2)}%`);
  console.log(`Total Time: ${(totalTime / 1000).toFixed(2)}s`);
  console.log(`Average Response Time: ${testResults.performance.averageResponseTime.toFixed(2)}ms`);
  console.log(`Min Response Time: ${testResults.performance.minResponseTime}ms`);
  console.log(`Max Response Time: ${testResults.performance.maxResponseTime}ms`);
  
  if (testResults.errors.length > 0) {
    console.log('\n❌ Errors:');
    testResults.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  // Save results
  const reportPath = 'extended-script-api-test-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  
  return testResults;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runExtendedTests().catch(console.error);
}

module.exports = { runExtendedTests };

