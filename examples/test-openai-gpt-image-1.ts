/**
 * Test OpenAI GPT Image 1 Integration
 * 
 * This file tests the direct OpenAI API integration for GPT Image 1
 * to ensure it's working correctly with the official OpenAI SDK.
 */

import { executeGPTImage1 } from '../executors/gpt-image-1';
import { generateChart } from '../executors/gpt-image-1-chart-generator';

/**
 * Test basic GPT Image 1 functionality
 */
export async function testBasicGPTImage1() {
  console.log('🧪 Testing basic GPT Image 1 functionality...');
  
  try {
    const result = await executeGPTImage1({
      prompt: 'Create a simple bar chart showing sales data: Q1: 100, Q2: 150, Q3: 120, Q4: 180. Use professional styling with blue bars, white background, and clear labels.',
      model: 'gpt-image-1',
      quality: 'medium',
      size: '1024x1024',
      output_format: 'png',
    });

    console.log('✅ Basic GPT Image 1 test successful');
    console.log('📊 Generated image data length:', result.data[0]?.b64_json?.length || 0);
    console.log('📈 Model used:', result.data[0]?.revised_prompt ? 'GPT Image 1' : 'Unknown');
    
    return result;
  } catch (error) {
    console.error('❌ Basic GPT Image 1 test failed:', error);
    throw error;
  }
}

/**
 * Test chart generator with detailed prompts
 */
export async function testChartGenerator() {
  console.log('🧪 Testing chart generator with detailed prompts...');
  
  try {
    const result = await generateChart({
      chartType: 'bar',
      data: [
        { label: 'Q1 2024', value: 120000 },
        { label: 'Q2 2024', value: 150000 },
        { label: 'Q3 2024', value: 180000 },
        { label: 'Q4 2024', value: 200000 },
      ],
      title: 'Quarterly Sales Performance',
      xAxisLabel: 'Quarter',
      yAxisLabel: 'Sales ($)',
      style: 'corporate',
      colorScheme: 'professional',
      quality: 'high',
    });

    if (result.success) {
      console.log('✅ Chart generator test successful');
      console.log('📊 Chart metadata:', result.chart.metadata);
      console.log('💰 Estimated cost:', result.chart.metadata.cost);
      console.log('⏱️ Processing time:', result.chart.metadata.processingTime + 'ms');
    } else {
      console.error('❌ Chart generator test failed:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Chart generator test failed:', error);
    throw error;
  }
}

/**
 * Test API key validation
 */
export function testAPIKeyValidation() {
  console.log('🧪 Testing API key validation...');
  
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY environment variable not set');
    return false;
  }
  
  if (apiKey.length < 20) {
    console.error('❌ OPENAI_API_KEY appears to be invalid (too short)');
    return false;
  }
  
  if (!apiKey.startsWith('sk-')) {
    console.error('❌ OPENAI_API_KEY should start with "sk-"');
    return false;
  }
  
  console.log('✅ API key validation passed');
  console.log('🔑 API key format:', apiKey.substring(0, 7) + '...');
  
  return true;
}

/**
 * Test different chart types
 */
export async function testDifferentChartTypes() {
  console.log('🧪 Testing different chart types...');
  
  const chartTypes = ['bar', 'line', 'pie'] as const;
  const results = [];
  
  for (const chartType of chartTypes) {
    try {
      console.log(`📊 Testing ${chartType} chart...`);
      
      const result = await generateChart({
        chartType,
        data: [
          { label: 'A', value: 100 },
          { label: 'B', value: 150 },
          { label: 'C', value: 120 },
        ],
        title: `Test ${chartType} Chart`,
        style: 'modern',
        colorScheme: 'professional',
        quality: 'medium',
      });
      
      if (result.success) {
        console.log(`✅ ${chartType} chart test successful`);
        results.push({ chartType, success: true });
      } else {
        console.error(`❌ ${chartType} chart test failed:`, result.error);
        results.push({ chartType, success: false, error: result.error });
      }
    } catch (error) {
      console.error(`❌ ${chartType} chart test failed:`, error);
      results.push({ chartType, success: false, error: error.message });
    }
  }
  
  return results;
}

/**
 * Test quality levels
 */
export async function testQualityLevels() {
  console.log('🧪 Testing different quality levels...');
  
  const qualities = ['low', 'medium', 'high'] as const;
  const results = [];
  
  for (const quality of qualities) {
    try {
      console.log(`🎨 Testing ${quality} quality...`);
      
      const result = await generateChart({
        chartType: 'bar',
        data: [
          { label: 'Test', value: 100 },
        ],
        title: `Test ${quality} Quality`,
        style: 'corporate',
        colorScheme: 'professional',
        quality,
      });
      
      if (result.success) {
        console.log(`✅ ${quality} quality test successful`);
        console.log(`💰 Cost: $${result.chart.metadata.cost.toFixed(4)}`);
        results.push({ quality, success: true, cost: result.chart.metadata.cost });
      } else {
        console.error(`❌ ${quality} quality test failed:`, result.error);
        results.push({ quality, success: false, error: result.error });
      }
    } catch (error) {
      console.error(`❌ ${quality} quality test failed:`, error);
      results.push({ quality, success: false, error: error.message });
    }
  }
  
  return results;
}

/**
 * Run all tests
 */
export async function runAllTests() {
  console.log('🚀 Starting OpenAI GPT Image 1 Integration Tests\n');
  
  const results = {
    apiKeyValidation: false,
    basicGPTImage1: false,
    chartGenerator: false,
    chartTypes: [],
    qualityLevels: [],
  };
  
  try {
    // Test 1: API Key Validation
    results.apiKeyValidation = testAPIKeyValidation();
    console.log('');
    
    if (!results.apiKeyValidation) {
      console.error('❌ API key validation failed. Please check your OPENAI_API_KEY environment variable.');
      return results;
    }
    
    // Test 2: Basic GPT Image 1
    try {
      await testBasicGPTImage1();
      results.basicGPTImage1 = true;
    } catch (error) {
      console.error('❌ Basic GPT Image 1 test failed:', error.message);
    }
    console.log('');
    
    // Test 3: Chart Generator
    try {
      await testChartGenerator();
      results.chartGenerator = true;
    } catch (error) {
      console.error('❌ Chart generator test failed:', error.message);
    }
    console.log('');
    
    // Test 4: Different Chart Types
    results.chartTypes = await testDifferentChartTypes();
    console.log('');
    
    // Test 5: Quality Levels
    results.qualityLevels = await testQualityLevels();
    console.log('');
    
    // Summary
    console.log('📋 Test Summary:');
    console.log(`🔑 API Key Validation: ${results.apiKeyValidation ? '✅' : '❌'}`);
    console.log(`🤖 Basic GPT Image 1: ${results.basicGPTImage1 ? '✅' : '❌'}`);
    console.log(`📊 Chart Generator: ${results.chartGenerator ? '✅' : '❌'}`);
    console.log(`📈 Chart Types: ${results.chartTypes.filter(r => r.success).length}/${results.chartTypes.length} successful`);
    console.log(`🎨 Quality Levels: ${results.qualityLevels.filter(r => r.success).length}/${results.qualityLevels.length} successful`);
    
    const allTestsPassed = results.apiKeyValidation && results.basicGPTImage1 && results.chartGenerator;
    console.log(`\n🎯 Overall Result: ${allTestsPassed ? '✅ All tests passed!' : '❌ Some tests failed'}`);
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
  
  return results;
}

/**
 * Quick test for development
 */
export async function quickTest() {
  console.log('⚡ Quick OpenAI GPT Image 1 Test\n');
  
  // Check API key
  if (!testAPIKeyValidation()) {
    return false;
  }
  
  // Test basic functionality
  try {
    const result = await generateChart({
      chartType: 'bar',
      data: [{ label: 'Test', value: 100 }],
      title: 'Quick Test',
      style: 'corporate',
      quality: 'medium',
    });
    
    if (result.success) {
      console.log('✅ Quick test successful!');
      console.log('📊 Chart generated successfully');
      return true;
    } else {
      console.error('❌ Quick test failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Quick test failed:', error.message);
    return false;
  }
}

export default {
  testBasicGPTImage1,
  testChartGenerator,
  testAPIKeyValidation,
  testDifferentChartTypes,
  testQualityLevels,
  runAllTests,
  quickTest,
};
