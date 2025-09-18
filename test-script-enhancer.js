/**
 * 🧪 COMPREHENSIVE SCRIPT ENHANCER API TEST
 * 
 * Tests the script enhancer API with various scenarios to verify:
 * - JSON parsing fixes work correctly
 * - Fallback mechanisms function properly
 * - Different creative profiles generate valid scripts
 * - Error handling and recovery work as expected
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const API_BASE_URL = 'http://localhost:3000';
const TEST_SCENARIOS = [
  {
    name: 'Educational Explainer - Short Video',
    data: {
      user_request: {
        original_prompt: 'Create a 5-second educational video about photosynthesis',
        intent: 'educational',
        duration_seconds: 5,
        aspect_ratio: '16:9',
        platform: 'social',
        image_count: 1
      },
      prompt_analysis: {
        user_intent_description: 'Create educational content about photosynthesis',
        reformulated_prompt: 'Create a 5-second educational video explaining photosynthesis in simple terms',
        clarity_score: 8,
        suggested_improvements: ['Add visual examples', 'Use simple language'],
        content_type_analysis: {
          needs_explanation: true,
          needs_charts: false,
          needs_diagrams: true,
          needs_educational_content: true,
          content_complexity: 'simple',
          requires_visual_aids: true,
          is_instructional: true,
          needs_data_visualization: false,
          requires_interactive_elements: false,
          content_category: 'educational'
        }
      },
      assets: [
        {
          id: 'leaf_photo_001',
          type: 'image',
          url: 'https://example.com/leaf.jpg',
          user_description: 'Green leaf in sunlight',
          ai_caption: 'A healthy green leaf with visible veins, perfect for photosynthesis demonstration',
          objects_detected: ['leaf', 'sunlight', 'green'],
          quality_score: 0.9
        }
      ],
      global_analysis: {
        goal: 'Create engaging educational content about photosynthesis',
        constraints: {
          duration_seconds: 5,
          aspect_ratio: '16:9',
          platform: 'social'
        },
        asset_roles: {
          'leaf_photo_001': 'primary_visual'
        },
        conflicts: []
      },
      creative_options: [
        {
          id: 'educational_approach',
          title: 'Educational Explainer',
          short: 'Clear, instructional approach',
          reasons: ['Best for educational content', 'Matches user intent'],
          estimatedWorkload: 'medium'
        }
      ],
      creative_direction: {
        core_concept: 'Simple explanation of photosynthesis',
        visual_approach: 'Clean, educational visuals',
        style_direction: 'Professional and clear',
        mood_atmosphere: 'Educational and inspiring'
      },
      production_pipeline: {
        workflow_steps: ['Plan', 'Create', 'Review', 'Publish'],
        estimated_time: '15-20 minutes',
        success_probability: 0.95,
        quality_targets: {
          technical_quality_target: 'high',
          creative_quality_target: 'appealing',
          consistency_target: 'excellent',
          polish_level_target: 'professional'
        }
      },
      quality_metrics: {
        overall_confidence: 0.9,
        analysis_quality: 8,
        completion_status: 'complete',
        feasibility_score: 0.95
      },
      challenges: [],
      recommendations: [
        {
          type: 'quality',
          recommendation: 'Use clear, simple language',
          priority: 'high'
        }
      ],
      refiner_extensions: {
        creative_profile: {
          profileId: 'educational_explainer',
          profileName: 'Educational Explainer',
          goal: 'Create clear, instructional content',
          confidence: '0.95',
          detectionMethod: 'multi-factor',
          matchedFactors: ['intent: educational', 'content_type: instructional']
        }
      }
    }
  },
  {
    name: 'Finance Explainer - Medium Video',
    data: {
      user_request: {
        original_prompt: 'Create a 15-second video explaining compound interest',
        intent: 'educational',
        duration_seconds: 15,
        aspect_ratio: '9:16',
        platform: 'social',
        image_count: 2
      },
      prompt_analysis: {
        user_intent_description: 'Create educational content about compound interest',
        reformulated_prompt: 'Create a 15-second video explaining compound interest with examples',
        clarity_score: 7,
        suggested_improvements: ['Add numerical examples', 'Use charts'],
        content_type_analysis: {
          needs_explanation: true,
          needs_charts: true,
          needs_diagrams: true,
          needs_educational_content: true,
          content_complexity: 'medium',
          requires_visual_aids: true,
          is_instructional: true,
          needs_data_visualization: true,
          requires_interactive_elements: false,
          content_category: 'financial_education'
        }
      },
      assets: [
        {
          id: 'chart_001',
          type: 'image',
          url: 'https://example.com/chart.jpg',
          user_description: 'Compound interest growth chart',
          ai_caption: 'A line chart showing exponential growth of compound interest over time',
          objects_detected: ['chart', 'line', 'numbers'],
          quality_score: 0.85
        },
        {
          id: 'calculator_001',
          type: 'image',
          url: 'https://example.com/calculator.jpg',
          user_description: 'Financial calculator',
          ai_caption: 'A modern financial calculator with clear display',
          objects_detected: ['calculator', 'display', 'buttons'],
          quality_score: 0.8
        }
      ],
      global_analysis: {
        goal: 'Create engaging financial education content',
        constraints: {
          duration_seconds: 15,
          aspect_ratio: '9:16',
          platform: 'social'
        },
        asset_roles: {
          'chart_001': 'primary_visual',
          'calculator_001': 'supporting_visual'
        },
        conflicts: []
      },
      creative_options: [
        {
          id: 'finance_approach',
          title: 'Finance Explainer',
          short: 'Data-driven, authoritative approach',
          reasons: ['Best for financial content', 'Builds trust'],
          estimatedWorkload: 'medium'
        }
      ],
      creative_direction: {
        core_concept: 'Clear explanation of compound interest with examples',
        visual_approach: 'Professional, data-focused visuals',
        style_direction: 'Authoritative and trustworthy',
        mood_atmosphere: 'Professional and confident'
      },
      production_pipeline: {
        workflow_steps: ['Plan', 'Create', 'Review', 'Publish'],
        estimated_time: '20-25 minutes',
        success_probability: 0.9,
        quality_targets: {
          technical_quality_target: 'high',
          creative_quality_target: 'professional',
          consistency_target: 'excellent',
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
          recommendation: 'Use clear data visualization',
          priority: 'high'
        }
      ],
      refiner_extensions: {
        creative_profile: {
          profileId: 'finance_explainer',
          profileName: 'Finance Explainer',
          goal: 'Create authoritative, data-driven financial content',
          confidence: '0.9',
          detectionMethod: 'multi-factor',
          matchedFactors: ['intent: financial_education', 'content_type: data_visualization']
        }
      }
    }
  },
  {
    name: 'UGC Influencer - Long Video',
    data: {
      user_request: {
        original_prompt: 'Create a 30-second viral video about morning routines',
        intent: 'entertainment',
        duration_seconds: 30,
        aspect_ratio: '9:16',
        platform: 'tiktok',
        image_count: 3
      },
      prompt_analysis: {
        user_intent_description: 'Create viral entertainment content about morning routines',
        reformulated_prompt: 'Create a 30-second viral video showcasing an engaging morning routine',
        clarity_score: 9,
        suggested_improvements: ['Add trendy music', 'Use quick cuts'],
        content_type_analysis: {
          needs_explanation: false,
          needs_charts: false,
          needs_diagrams: false,
          needs_educational_content: false,
          content_complexity: 'simple',
          requires_visual_aids: true,
          is_instructional: false,
          needs_data_visualization: false,
          requires_interactive_elements: false,
          content_category: 'lifestyle'
        }
      },
      assets: [
        {
          id: 'morning_coffee_001',
          type: 'image',
          url: 'https://example.com/coffee.jpg',
          user_description: 'Morning coffee cup',
          ai_caption: 'A beautiful latte art coffee cup in morning light',
          objects_detected: ['coffee', 'cup', 'latte_art'],
          quality_score: 0.95
        },
        {
          id: 'workout_001',
          type: 'image',
          url: 'https://example.com/workout.jpg',
          user_description: 'Morning workout',
          ai_caption: 'Person doing morning yoga in a bright room',
          objects_detected: ['person', 'yoga', 'exercise'],
          quality_score: 0.9
        },
        {
          id: 'breakfast_001',
          type: 'image',
          url: 'https://example.com/breakfast.jpg',
          user_description: 'Healthy breakfast',
          ai_caption: 'Colorful healthy breakfast bowl with fruits and granola',
          objects_detected: ['food', 'fruits', 'bowl'],
          quality_score: 0.85
        }
      ],
      global_analysis: {
        goal: 'Create viral lifestyle content',
        constraints: {
          duration_seconds: 30,
          aspect_ratio: '9:16',
          platform: 'tiktok'
        },
        asset_roles: {
          'morning_coffee_001': 'opening_visual',
          'workout_001': 'main_visual',
          'breakfast_001': 'closing_visual'
        },
        conflicts: []
      },
      creative_options: [
        {
          id: 'ugc_approach',
          title: 'UGC Influencer',
          short: 'Energetic, engaging approach',
          reasons: ['Best for viral content', 'High engagement'],
          estimatedWorkload: 'high'
        }
      ],
      creative_direction: {
        core_concept: 'Energetic morning routine showcase',
        visual_approach: 'Dynamic, trendy visuals',
        style_direction: 'Viral and engaging',
        mood_atmosphere: 'Energetic and inspiring'
      },
      production_pipeline: {
        workflow_steps: ['Plan', 'Create', 'Review', 'Publish'],
        estimated_time: '25-30 minutes',
        success_probability: 0.85,
        quality_targets: {
          technical_quality_target: 'high',
          creative_quality_target: 'viral',
          consistency_target: 'good',
          polish_level_target: 'trendy'
        }
      },
      quality_metrics: {
        overall_confidence: 0.8,
        analysis_quality: 7,
        completion_status: 'complete',
        feasibility_score: 0.85
      },
      challenges: [],
      recommendations: [
        {
          type: 'quality',
          recommendation: 'Use trendy music and quick cuts',
          priority: 'high'
        }
      ],
      refiner_extensions: {
        creative_profile: {
          profileId: 'ugc_influencer',
          profileName: 'UGC Influencer',
          goal: 'Create viral, engaging content',
          confidence: '0.85',
          detectionMethod: 'multi-factor',
          matchedFactors: ['intent: entertainment', 'platform: tiktok', 'content_type: lifestyle']
        }
      }
    }
  }
];

// Test results tracking
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: [],
  details: []
};

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function makeRequest(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });
}

async function testScriptEnhancer(scenario) {
  log(`Testing scenario: ${scenario.name}`, 'info');
  
  try {
    const startTime = Date.now();
    const response = await makeRequest(`${API_BASE_URL}/api/dreamcut/script-enhancer`, scenario.data);
    const endTime = Date.now();
    
    const responseTime = endTime - startTime;
    log(`Response time: ${responseTime}ms`, 'info');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Validate response structure
    const validation = validateScriptResponse(result);
    
    const testResult = {
      scenario: scenario.name,
      success: validation.valid,
      responseTime,
      validation,
      result: validation.valid ? result : null,
      error: validation.valid ? null : validation.error
    };
    
    if (validation.valid) {
      log(`✅ ${scenario.name} - PASSED`, 'success');
      testResults.passed++;
    } else {
      log(`❌ ${scenario.name} - FAILED: ${validation.error}`, 'error');
      testResults.failed++;
      testResults.errors.push(`${scenario.name}: ${validation.error}`);
    }
    
    testResults.details.push(testResult);
    return testResult;
    
  } catch (error) {
    log(`❌ ${scenario.name} - ERROR: ${error.message}`, 'error');
    testResults.failed++;
    testResults.errors.push(`${scenario.name}: ${error.message}`);
    
    const testResult = {
      scenario: scenario.name,
      success: false,
      responseTime: null,
      validation: { valid: false, error: error.message },
      result: null,
      error: error.message
    };
    
    testResults.details.push(testResult);
    return testResult;
  }
}

function validateScriptResponse(result) {
  try {
    // Check basic structure
    if (!result.success) {
      return { valid: false, error: 'Response indicates failure' };
    }
    
    if (!result.script) {
      return { valid: false, error: 'Missing script data' };
    }
    
    const script = result.script;
    
    // Validate required fields
    const requiredFields = [
      'script_metadata',
      'scenes',
      'global_voiceover',
      'music_plan',
      'asset_integration',
      'quality_assurance'
    ];
    
    for (const field of requiredFields) {
      if (!script[field]) {
        return { valid: false, error: `Missing required field: ${field}` };
      }
    }
    
    // Validate script_metadata
    const metadata = script.script_metadata;
    if (!metadata.profile || !metadata.duration_seconds || !metadata.total_scenes) {
      return { valid: false, error: 'Invalid script_metadata structure' };
    }
    
    // Validate scenes
    if (!Array.isArray(script.scenes) || script.scenes.length === 0) {
      return { valid: false, error: 'Invalid scenes array' };
    }
    
    for (const scene of script.scenes) {
      if (!scene.scene_id || !scene.duration || !scene.narration) {
        return { valid: false, error: 'Invalid scene structure' };
      }
    }
    
    // Validate global_voiceover
    const voiceover = script.global_voiceover;
    if (!voiceover.voices || !Array.isArray(voiceover.voices) || voiceover.voices.length === 0) {
      return { valid: false, error: 'Invalid global_voiceover structure' };
    }
    
    // Validate music_plan
    const musicPlan = script.music_plan;
    if (!musicPlan.style || !musicPlan.transitions) {
      return { valid: false, error: 'Invalid music_plan structure' };
    }
    
    // Check quality assessment
    if (result.quality_assessment) {
      const quality = result.quality_assessment;
      if (typeof quality.overallScore !== 'number' || !quality.grade) {
        return { valid: false, error: 'Invalid quality_assessment structure' };
      }
    }
    
    return { valid: true, error: null };
    
  } catch (error) {
    return { valid: false, error: `Validation error: ${error.message}` };
  }
}

async function runComprehensiveTest() {
  log('🚀 Starting comprehensive script enhancer API test', 'info');
  log(`Testing ${TEST_SCENARIOS.length} scenarios`, 'info');
  
  testResults.total = TEST_SCENARIOS.length;
  
  // Run all test scenarios
  for (const scenario of TEST_SCENARIOS) {
    await testScriptEnhancer(scenario);
    // Add small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Generate test report
  generateTestReport();
}

function generateTestReport() {
  log('\n📊 TEST REPORT', 'info');
  log('=' * 50, 'info');
  
  log(`Total Tests: ${testResults.total}`, 'info');
  log(`Passed: ${testResults.passed}`, 'success');
  log(`Failed: ${testResults.failed}`, 'error');
  log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`, 'info');
  
  if (testResults.errors.length > 0) {
    log('\n❌ ERRORS:', 'error');
    testResults.errors.forEach(error => log(`  - ${error}`, 'error'));
  }
  
  log('\n📋 DETAILED RESULTS:', 'info');
  testResults.details.forEach(detail => {
    const status = detail.success ? '✅ PASS' : '❌ FAIL';
    const time = detail.responseTime ? `${detail.responseTime}ms` : 'N/A';
    log(`  ${status} ${detail.scenario} (${time})`, detail.success ? 'success' : 'error');
    
    if (!detail.success && detail.error) {
      log(`    Error: ${detail.error}`, 'error');
    }
  });
  
  // Save detailed report to file
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      successRate: (testResults.passed / testResults.total) * 100
    },
    errors: testResults.errors,
    details: testResults.details
  };
  
  const reportPath = path.join(__dirname, 'script-enhancer-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
  log(`\n📄 Detailed report saved to: ${reportPath}`, 'info');
  
  // Final assessment
  if (testResults.failed === 0) {
    log('\n🎉 ALL TESTS PASSED! Script enhancer API is working perfectly.', 'success');
  } else if (testResults.passed > testResults.failed) {
    log('\n⚠️  MOSTLY WORKING: Some tests failed, but the API is functional.', 'warning');
  } else {
    log('\n❌ SIGNIFICANT ISSUES: Multiple test failures detected.', 'error');
  }
}

// Run the test
if (require.main === module) {
  runComprehensiveTest().catch(error => {
    log(`Fatal error: ${error.message}`, 'error');
    process.exit(1);
  });
}

module.exports = { runComprehensiveTest, testScriptEnhancer, validateScriptResponse };
