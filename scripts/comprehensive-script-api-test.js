#!/usr/bin/env node

/**
 * 🎬 COMPREHENSIVE SCRIPT API TEST SUITE
 * 
 * This script performs extensive testing of the Script Enhancer API to verify:
 * - All 18 creative profiles work correctly
 * - Different duration ranges and aspect ratios
 * - Edge cases and error handling
 * - Asset integration scenarios
 * - Quality assessment accuracy
 * - Performance and response times
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const API_ENDPOINT = `${BASE_URL}/api/dreamcut/script-enhancer`;

// All 18 creative profiles
const CREATIVE_PROFILES = [
  { id: 'anime_mode', name: 'Anime Mode', description: 'Dramatic dialogue with inner monologue' },
  { id: 'finance_explainer', name: 'Finance Explainer', description: 'Structured narration with data callouts' },
  { id: 'educational_explainer', name: 'Educational Explainer', description: 'Clear, instructional narration' },
  { id: 'ugc_influencer', name: 'UGC Influencer', description: 'Casual, punchy, first-person style' },
  { id: 'presentation_corporate', name: 'Corporate Presentation', description: 'Professional, confident narration' },
  { id: 'pleasure_relaxation', name: 'Relaxation Content', description: 'Calm, soothing narration' },
  { id: 'ads_commercial', name: 'Commercial Ads', description: 'Persuasive, compelling narration' },
  { id: 'demo_product_showcase', name: 'Product Demo', description: 'Demonstrative, feature-focused' },
  { id: 'funny_meme_style', name: 'Meme Style', description: 'Humorous, meme-style narration' },
  { id: 'documentary_storytelling', name: 'Documentary', description: 'Narrative, documentary-style' },
  { id: 'lifestyle_vlog', name: 'Lifestyle Vlog', description: 'Personal, authentic storytelling' },
  { id: 'tech_review', name: 'Tech Review', description: 'Analytical, detailed product analysis' },
  { id: 'cooking_tutorial', name: 'Cooking Tutorial', description: 'Step-by-step instructional content' },
  { id: 'fitness_motivation', name: 'Fitness Motivation', description: 'Energetic, motivational content' },
  { id: 'travel_vlog', name: 'Travel Vlog', description: 'Adventure, exploration storytelling' },
  { id: 'beauty_tutorial', name: 'Beauty Tutorial', description: 'Detailed, step-by-step beauty content' },
  { id: 'gaming_content', name: 'Gaming Content', description: 'Entertaining, engaging gaming content' },
  { id: 'news_commentary', name: 'News Commentary', description: 'Informative, analytical news content' }
];

// Test scenarios
const TEST_SCENARIOS = [
  // Duration tests
  { name: 'Short Video (5s)', duration: 5, aspect_ratio: '9:16', platform: 'tiktok' },
  { name: 'Medium Short (15s)', duration: 15, aspect_ratio: '9:16', platform: 'instagram' },
  { name: 'Standard Video (30s)', duration: 30, aspect_ratio: '16:9', platform: 'youtube' },
  { name: 'Long Video (60s)', duration: 60, aspect_ratio: '16:9', platform: 'youtube' },
  { name: 'Extended Video (120s)', duration: 120, aspect_ratio: '16:9', platform: 'youtube' },
  
  // Aspect ratio tests
  { name: 'Square Format (1:1)', duration: 30, aspect_ratio: '1:1', platform: 'instagram' },
  { name: 'Portrait Format (9:16)', duration: 30, aspect_ratio: '9:16', platform: 'tiktok' },
  { name: 'Landscape Format (16:9)', duration: 30, aspect_ratio: '16:9', platform: 'youtube' },
  { name: 'Standard Format (4:3)', duration: 30, aspect_ratio: '4:3', platform: 'linkedin' },
  
  // Platform tests
  { name: 'TikTok Content', duration: 30, aspect_ratio: '9:16', platform: 'tiktok' },
  { name: 'Instagram Reels', duration: 30, aspect_ratio: '9:16', platform: 'instagram' },
  { name: 'YouTube Shorts', duration: 30, aspect_ratio: '9:16', platform: 'youtube' },
  { name: 'LinkedIn Video', duration: 30, aspect_ratio: '16:9', platform: 'linkedin' },
  { name: 'Facebook Video', duration: 30, aspect_ratio: '16:9', platform: 'facebook' }
];

// Asset scenarios
const ASSET_SCENARIOS = [
  {
    name: 'Single Image',
    assets: [
      {
        id: 'user_image_01',
        type: 'image',
        url: 'https://example.com/landscape.jpg',
        user_description: 'Beautiful mountain landscape',
        ai_caption: 'Scenic mountain landscape with clear blue sky',
        objects_detected: ['mountain', 'sky', 'landscape'],
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
        user_description: 'Product photo',
        ai_caption: 'Modern smartphone on white background',
        objects_detected: ['phone', 'background'],
        quality_score: 0.92
      },
      {
        id: 'user_image_02',
        type: 'image',
        url: 'https://example.com/image2.jpg',
        user_description: 'Lifestyle shot',
        ai_caption: 'Person using smartphone in natural setting',
        objects_detected: ['person', 'phone', 'nature'],
        quality_score: 0.78
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
        user_description: 'Product image',
        ai_caption: 'Product on display',
        objects_detected: ['product'],
        quality_score: 0.88
      },
      {
        id: 'user_video_01',
        type: 'video',
        url: 'https://example.com/video.mp4',
        user_description: 'Product demo video',
        ai_caption: 'Product demonstration in action',
        objects_detected: ['product', 'hands', 'movement'],
        quality_score: 0.75
      }
    ]
  },
  {
    name: 'No Assets',
    assets: []
  }
];

// Test results storage
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
 * Create mock input data for testing
 */
function createMockInput(profile, scenario, assetScenario) {
  return {
    user_request: {
      original_prompt: `Create a ${profile.name.toLowerCase()} video about ${scenario.name.toLowerCase()}`,
      intent: 'video',
      duration_seconds: scenario.duration,
      aspect_ratio: scenario.aspect_ratio,
      platform: scenario.platform,
      image_count: assetScenario.assets.filter(a => a.type === 'image').length
    },
    prompt_analysis: {
      user_intent_description: `Generate ${profile.name.toLowerCase()} content for ${scenario.platform}`,
      reformulated_prompt: `Create engaging ${profile.name.toLowerCase()} content with ${scenario.aspect_ratio} format`,
      clarity_score: 8,
      suggested_improvements: [
        'Specify the target audience',
        'Include call-to-action elements'
      ],
      content_type_analysis: {
        needs_explanation: profile.id.includes('explainer'),
        needs_charts: profile.id === 'finance_explainer',
        needs_diagrams: profile.id === 'educational_explainer',
        needs_educational_content: profile.id.includes('educational'),
        content_complexity: scenario.duration > 60 ? 'complex' : 'simple',
        requires_visual_aids: true,
        is_instructional: profile.id.includes('tutorial'),
        needs_data_visualization: profile.id === 'finance_explainer',
        requires_interactive_elements: false,
        content_category: 'general'
      }
    },
    assets: assetScenario.assets,
    global_analysis: {
      goal: `Create high-quality ${profile.name.toLowerCase()} content`,
      constraints: {
        duration_seconds: scenario.duration,
        aspect_ratio: scenario.aspect_ratio,
        platform: scenario.platform
      },
      asset_roles: assetScenario.assets.reduce((acc, asset) => {
        acc[asset.id] = 'primary_visual';
        return acc;
      }, {}),
      conflicts: []
    },
    creative_options: [
      {
        id: 'opt_primary',
        title: `${profile.name} Style`,
        short: `Professional ${profile.name.toLowerCase()} approach`,
        reasons: ['Matches profile requirements', 'Platform optimized'],
        estimatedWorkload: 'medium'
      }
    ],
    creative_direction: {
      core_concept: `Deliver ${profile.name.toLowerCase()} content effectively`,
      visual_approach: 'Professional and engaging',
      style_direction: 'Modern and clean',
      mood_atmosphere: profile.id.includes('relaxation') ? 'Calm and soothing' : 'Energetic and engaging'
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
        profileId: profile.id,
        profileName: profile.name,
        goal: `Create engaging ${profile.name.toLowerCase()} content`,
        confidence: '0.95',
        detectionMethod: 'multi-factor',
        matchedFactors: [`profile: ${profile.id}`, 'priority_bonus: 95']
      }
    }
  };
}

/**
 * Validate script response structure
 */
function validateScriptResponse(response, expectedProfile, expectedDuration) {
  const errors = [];
  
  // Check basic structure
  if (!response.success) {
    errors.push('Response success flag is false');
  }
  
  if (!response.script) {
    errors.push('Missing script object');
    return { valid: false, errors };
  }
  
  const script = response.script;
  
  // Validate script metadata
  if (!script.script_metadata) {
    errors.push('Missing script_metadata');
  } else {
    const metadata = script.script_metadata;
    if (metadata.profile !== expectedProfile.id) {
      errors.push(`Profile mismatch: expected ${expectedProfile.id}, got ${metadata.profile}`);
    }
    if (metadata.duration_seconds !== expectedDuration) {
      errors.push(`Duration mismatch: expected ${expectedDuration}s, got ${metadata.duration_seconds}s`);
    }
    if (!metadata.total_scenes || metadata.total_scenes < 1) {
      errors.push('Invalid total_scenes count');
    }
    if (!metadata.estimated_word_count || metadata.estimated_word_count < 10) {
      errors.push('Invalid estimated_word_count');
    }
  }
  
  // Validate scenes
  if (!script.scenes || !Array.isArray(script.scenes)) {
    errors.push('Missing or invalid scenes array');
  } else {
    if (script.scenes.length === 0) {
      errors.push('Empty scenes array');
    }
    
    script.scenes.forEach((scene, index) => {
      if (!scene.scene_id) {
        errors.push(`Scene ${index + 1}: Missing scene_id`);
      }
      if (!scene.narration || scene.narration.length < 10) {
        errors.push(`Scene ${index + 1}: Invalid narration`);
      }
      if (!scene.visual_anchor) {
        errors.push(`Scene ${index + 1}: Missing visual_anchor`);
      }
      if (!scene.duration || scene.duration <= 0) {
        errors.push(`Scene ${index + 1}: Invalid duration`);
      }
    });
  }
  
  // Validate voiceover
  if (!script.global_voiceover) {
    errors.push('Missing global_voiceover');
  } else {
    if (!script.global_voiceover.narration_style) {
      errors.push('Missing narration_style');
    }
    if (!script.global_voiceover.pacing_notes) {
      errors.push('Missing pacing_notes');
    }
  }
  
  // Validate music plan
  if (!script.music_plan) {
    errors.push('Missing music_plan');
  } else {
    if (!script.music_plan.style) {
      errors.push('Missing music style');
    }
    if (!script.music_plan.transitions || !Array.isArray(script.music_plan.transitions)) {
      errors.push('Missing or invalid transitions array');
    }
  }
  
  // Validate asset integration
  if (!script.asset_integration) {
    errors.push('Missing asset_integration');
  } else {
    if (!Array.isArray(script.asset_integration.user_assets_used)) {
      errors.push('Missing or invalid user_assets_used array');
    }
    if (!Array.isArray(script.asset_integration.generated_content_needed)) {
      errors.push('Missing or invalid generated_content_needed array');
    }
  }
  
  // Validate quality assessment
  if (!response.quality_assessment) {
    errors.push('Missing quality_assessment');
  } else {
    const qa = response.quality_assessment;
    if (typeof qa.overallScore !== 'number' || qa.overallScore < 0 || qa.overallScore > 1) {
      errors.push('Invalid overallScore');
    }
    if (!qa.grade || !['A', 'B', 'C', 'D', 'F'].includes(qa.grade)) {
      errors.push('Invalid grade');
    }
    if (!Array.isArray(qa.issues)) {
      errors.push('Invalid issues array');
    }
    if (!Array.isArray(qa.recommendations)) {
      errors.push('Invalid recommendations array');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Make API request with error handling
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
 * Run a single test scenario
 */
async function runTestScenario(profile, scenario, assetScenario) {
  const testName = `${profile.name} - ${scenario.name} - ${assetScenario.name}`;
  console.log(`\n🧪 Testing: ${testName}`);
  
  const input = createMockInput(profile, scenario, assetScenario);
  const result = await makeApiRequest(input);
  
  const testResult = {
    scenario: testName,
    success: result.success,
    responseTime: result.responseTime,
    validation: { valid: false, errors: [] },
    result: null,
    error: null
  };
  
  if (result.success) {
    const validation = validateScriptResponse(result.data, profile, scenario.duration);
    testResult.validation = validation;
    testResult.result = result.data;
    
    if (validation.valid) {
      console.log(`✅ ${testName} - PASSED (${result.responseTime}ms)`);
    } else {
      console.log(`❌ ${testName} - VALIDATION FAILED: ${validation.errors.join(', ')}`);
      testResult.error = `Validation failed: ${validation.errors.join(', ')}`;
    }
  } else {
    console.log(`❌ ${testName} - FAILED: ${result.error}`);
    testResult.error = result.error;
  }
  
  // Update performance metrics
  testResults.performance.responseTimeHistory.push(result.responseTime);
  testResults.performance.minResponseTime = Math.min(testResults.performance.minResponseTime, result.responseTime);
  testResults.performance.maxResponseTime = Math.max(testResults.performance.maxResponseTime, result.responseTime);
  
  return testResult;
}

/**
 * Run comprehensive test suite
 */
async function runComprehensiveTests() {
  console.log('🎬 Starting Comprehensive Script API Test Suite');
  console.log(`📍 Testing endpoint: ${API_ENDPOINT}`);
  console.log(`📊 Total test scenarios: ${CREATIVE_PROFILES.length * TEST_SCENARIOS.length * ASSET_SCENARIOS.length}`);
  
  const startTime = Date.now();
  
  // Run tests for each combination
  for (const profile of CREATIVE_PROFILES) {
    for (const scenario of TEST_SCENARIOS) {
      for (const assetScenario of ASSET_SCENARIOS) {
        const testResult = await runTestScenario(profile, scenario, assetScenario);
        testResults.details.push(testResult);
        testResults.summary.total++;
        
        if (testResult.success && testResult.validation.valid) {
          testResults.summary.passed++;
        } else {
          testResults.summary.failed++;
          testResults.errors.push(`${testResult.scenario}: ${testResult.error || 'Validation failed'}`);
        }
        
        // Add small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }
  
  const totalTime = Date.now() - startTime;
  
  // Calculate final metrics
  testResults.summary.successRate = (testResults.summary.passed / testResults.summary.total) * 100;
  testResults.performance.averageResponseTime = testResults.performance.responseTimeHistory.reduce((a, b) => a + b, 0) / testResults.performance.responseTimeHistory.length;
  
  console.log('\n📊 Test Results Summary:');
  console.log(`Total Tests: ${testResults.summary.total}`);
  console.log(`Passed: ${testResults.summary.passed}`);
  console.log(`Failed: ${testResults.summary.failed}`);
  console.log(`Success Rate: ${testResults.summary.successRate.toFixed(2)}%`);
  console.log(`Total Time: ${(totalTime / 1000).toFixed(2)}s`);
  console.log(`Average Response Time: ${testResults.performance.averageResponseTime.toFixed(2)}ms`);
  console.log(`Min Response Time: ${testResults.performance.minResponseTime}ms`);
  console.log(`Max Response Time: ${testResults.performance.maxResponseTime}ms`);
  
  // Save detailed results
  const reportPath = path.join(process.cwd(), 'comprehensive-script-api-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  
  return testResults;
}

/**
 * Run edge case tests
 */
async function runEdgeCaseTests() {
  console.log('\n🔍 Running Edge Case Tests...');
  
  const edgeCases = [
    {
      name: 'Empty Request Body',
      input: {},
      expectedError: true
    },
    {
      name: 'Invalid Duration (0 seconds)',
      input: createMockInput(CREATIVE_PROFILES[0], { ...TEST_SCENARIOS[0], duration: 0 }, ASSET_SCENARIOS[0]),
      expectedError: true
    },
    {
      name: 'Invalid Duration (negative)',
      input: createMockInput(CREATIVE_PROFILES[0], { ...TEST_SCENARIOS[0], duration: -10 }, ASSET_SCENARIOS[0]),
      expectedError: true
    },
    {
      name: 'Invalid Duration (too long)',
      input: createMockInput(CREATIVE_PROFILES[0], { ...TEST_SCENARIOS[0], duration: 3600 }, ASSET_SCENARIOS[0]),
      expectedError: true
    },
    {
      name: 'Invalid Aspect Ratio',
      input: createMockInput(CREATIVE_PROFILES[0], { ...TEST_SCENARIOS[0], aspect_ratio: 'invalid' }, ASSET_SCENARIOS[0]),
      expectedError: true
    },
    {
      name: 'Invalid Platform',
      input: createMockInput(CREATIVE_PROFILES[0], { ...TEST_SCENARIOS[0], platform: 'invalid_platform' }, ASSET_SCENARIOS[0]),
      expectedError: true
    },
    {
      name: 'Invalid Profile ID',
      input: {
        ...createMockInput(CREATIVE_PROFILES[0], TEST_SCENARIOS[0], ASSET_SCENARIOS[0]),
        refiner_extensions: {
          creative_profile: {
            profileId: 'invalid_profile',
            profileName: 'Invalid Profile',
            goal: 'Test invalid profile',
            confidence: '0.95',
            detectionMethod: 'test',
            matchedFactors: ['test']
          }
        }
      },
      expectedError: false // Should fallback to default
    }
  ];
  
  for (const edgeCase of edgeCases) {
    console.log(`\n🧪 Testing Edge Case: ${edgeCase.name}`);
    const result = await makeApiRequest(edgeCase.input);
    
    if (edgeCase.expectedError && result.success) {
      console.log(`❌ ${edgeCase.name} - Expected error but got success`);
    } else if (!edgeCase.expectedError && !result.success) {
      console.log(`❌ ${edgeCase.name} - Expected success but got error: ${result.error}`);
    } else {
      console.log(`✅ ${edgeCase.name} - ${result.success ? 'PASSED' : 'FAILED as expected'}`);
    }
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    // Check if API is accessible
    console.log('🔍 Checking API accessibility...');
    const healthCheck = await fetch(`${BASE_URL}/api/health`).catch(() => null);
    if (!healthCheck) {
      console.log('⚠️  Health check endpoint not available, proceeding with tests...');
    }
    
    // Run comprehensive tests
    await runComprehensiveTests();
    
    // Run edge case tests
    await runEdgeCaseTests();
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  }
}

// Run the test suite
if (require.main === module) {
  main();
}

module.exports = {
  runComprehensiveTests,
  runEdgeCaseTests,
  validateScriptResponse,
  createMockInput
};

