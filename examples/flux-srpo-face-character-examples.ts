/**
 * FLUX.1 SRPO Face Character Examples
 * 
 * Comprehensive examples demonstrating the use of FLUX.1 SRPO for generating
 * ultra-realistic face characters with excellent consistency and quality.
 */

import { generateFaceCharacter, generateFaceCharacterStream, createFaceCharacterPrompt } from '../executors/flux-srpo-face-character';

/**
 * Professional Portrait Example
 * High-quality business portrait with detailed facial features
 */
export async function professionalPortraitExample() {
  console.log('👔 Generating professional portrait...');
  
  const result = await generateFaceCharacter({
    prompt: 'Professional portrait of a young adult woman with long wavy brown hair, bright blue eyes, high cheekbones, defined jawline, subtle smile, wearing navy blue business suit, confident expression, professional studio lighting, high resolution, detailed, sharp focus, professional quality, 8k, masterpiece',
    imageSize: 'portrait_4_3',
    numInferenceSteps: 28,
    guidanceScale: 4.5,
    numImages: 1,
    enableSafetyChecker: true,
    outputFormat: 'jpeg',
    acceleration: 'none'
  });

  if (result.success) {
    console.log('✅ Professional portrait generated successfully');
    console.log('💰 Cost: $' + result.metadata.cost.toFixed(4));
    console.log('⏱️ Processing time: ' + result.metadata.processingTime + 'ms');
    console.log('🎯 Seed: ' + result.result.seed);
  } else {
    console.error('❌ Professional portrait generation failed:', result.error);
  }

  return result;
}

/**
 * Character Design Example
 * Detailed character design for game or story
 */
export async function characterDesignExample() {
  console.log('🎮 Generating character design...');
  
  const result = await generateFaceCharacter({
    prompt: 'Character design of a middle-aged man with short gray hair, weathered face with deep lines, piercing green eyes, strong jawline, wearing weathered leather jacket, determined expression, mountain background, natural lighting, ultra-realistic, photorealistic, high resolution, detailed, sharp focus, professional quality, 8k, masterpiece',
    imageSize: 'landscape_4_3',
    numInferenceSteps: 32,
    guidanceScale: 5.0,
    numImages: 1,
    enableSafetyChecker: true,
    outputFormat: 'png',
    acceleration: 'regular'
  });

  if (result.success) {
    console.log('✅ Character design generated successfully');
    console.log('💰 Cost: $' + result.metadata.cost.toFixed(4));
    console.log('⏱️ Processing time: ' + result.metadata.processingTime + 'ms');
    console.log('🎯 Seed: ' + result.result.seed);
  } else {
    console.error('❌ Character design generation failed:', result.error);
  }

  return result;
}

/**
 * Multiple Character Variations Example
 * Generate multiple variations of the same character
 */
export async function characterVariationsExample() {
  console.log('👥 Generating character variations...');
  
  const baseCharacter = 'young adult woman with long brown hair, blue eyes, high cheekbones, defined jawline';
  
  const variations = [
    {
      prompt: `Professional portrait of a ${baseCharacter}, wearing business attire, confident expression, studio lighting, high resolution, detailed, sharp focus, professional quality, 8k, masterpiece`,
      description: 'Business Professional'
    },
    {
      prompt: `Casual portrait of a ${baseCharacter}, wearing casual clothing, friendly smile, natural lighting, high resolution, detailed, sharp focus, professional quality, 8k, masterpiece`,
      description: 'Casual Style'
    },
    {
      prompt: `Formal portrait of a ${baseCharacter}, wearing elegant dress, sophisticated pose, soft lighting, high resolution, detailed, sharp focus, professional quality, 8k, masterpiece`,
      description: 'Formal Elegance'
    }
  ];

  const results = [];
  
  for (const variation of variations) {
    try {
      console.log(`📸 Generating ${variation.description}...`);
      
      const result = await generateFaceCharacter({
        prompt: variation.prompt,
        imageSize: 'portrait_4_3',
        numInferenceSteps: 28,
        guidanceScale: 4.5,
        numImages: 1,
        enableSafetyChecker: true,
        outputFormat: 'jpeg',
        acceleration: 'none'
      });
      
      if (result.success) {
        console.log(`✅ ${variation.description} generated successfully`);
        results.push({ variation: variation.description, success: true, result });
      } else {
        console.error(`❌ ${variation.description} generation failed:`, result.error);
        results.push({ variation: variation.description, success: false, error: result.error });
      }
    } catch (error) {
      console.error(`❌ ${variation.description} generation failed:`, error);
      results.push({ variation: variation.description, success: false, error: error.message });
    }
  }

  return results;
}

/**
 * Character Builder Example
 * Using the character builder helper function
 */
export async function characterBuilderExample() {
  console.log('🔧 Generating character using builder...');
  
  const prompt = createFaceCharacterPrompt({
    characterType: 'portrait',
    gender: 'male',
    age: 'young-adult',
    ethnicity: 'Asian',
    hairColor: 'black',
    hairStyle: 'short',
    eyeColor: 'brown',
    facialFeatures: ['strong jawline', 'defined cheekbones', 'confident eyes'],
    expression: 'determined',
    clothing: 'modern casual wear',
    setting: 'urban environment',
    style: 'realistic',
    lighting: 'natural daylight',
    pose: 'three-quarter view',
    additionalDetails: 'high resolution, detailed, sharp focus, professional quality, 8k, masterpiece'
  });

  console.log('📝 Generated prompt:', prompt);

  const result = await generateFaceCharacter({
    prompt,
    imageSize: 'portrait_4_3',
    numInferenceSteps: 28,
    guidanceScale: 4.5,
    numImages: 1,
    enableSafetyChecker: true,
    outputFormat: 'jpeg',
    acceleration: 'none'
  });

  if (result.success) {
    console.log('✅ Character builder example generated successfully');
    console.log('💰 Cost: $' + result.metadata.cost.toFixed(4));
    console.log('⏱️ Processing time: ' + result.metadata.processingTime + 'ms');
  } else {
    console.error('❌ Character builder example generation failed:', result.error);
  }

  return result;
}

/**
 * Streaming Example
 * Using streaming for real-time generation
 */
export async function streamingExample() {
  console.log('🌊 Generating with streaming...');
  
  const result = await generateFaceCharacterStream({
    prompt: 'Headshot of a young adult male with curly black hair, brown eyes, wearing casual clothing, friendly smile, soft lighting, artistic style, detailed, sharp focus, professional quality, 8k, masterpiece',
    imageSize: 'square_hd',
    numInferenceSteps: 28,
    guidanceScale: 4.5,
    numImages: 1,
    enableSafetyChecker: true,
    outputFormat: 'jpeg',
    acceleration: 'high'
  });

  if (result.success) {
    console.log('✅ Streaming example generated successfully');
    console.log('💰 Cost: $' + result.metadata.cost.toFixed(4));
    console.log('⏱️ Processing time: ' + result.metadata.processingTime + 'ms');
  } else {
    console.error('❌ Streaming example generation failed:', result.error);
  }

  return result;
}

/**
 * High-Quality Portrait Example
 * Maximum quality settings for professional use
 */
export async function highQualityPortraitExample() {
  console.log('⭐ Generating high-quality portrait...');
  
  const result = await generateFaceCharacter({
    prompt: 'Professional portrait of a mature woman with silver hair, wise blue eyes, gentle smile, wearing elegant blouse, sophisticated expression, professional studio lighting, high resolution, detailed, sharp focus, professional quality, 8k, masterpiece',
    imageSize: 'portrait_4_3',
    numInferenceSteps: 50,
    guidanceScale: 6.0,
    numImages: 1,
    enableSafetyChecker: true,
    outputFormat: 'png',
    acceleration: 'none'
  });

  if (result.success) {
    console.log('✅ High-quality portrait generated successfully');
    console.log('💰 Cost: $' + result.metadata.cost.toFixed(4));
    console.log('⏱️ Processing time: ' + result.metadata.processingTime + 'ms');
  } else {
    console.error('❌ High-quality portrait generation failed:', result.error);
  }

  return result;
}

/**
 * Multiple Images Example
 * Generate multiple images in one request
 */
export async function multipleImagesExample() {
  console.log('🖼️ Generating multiple images...');
  
  const result = await generateFaceCharacter({
    prompt: 'Character design of a young adult woman with long red hair, green eyes, wearing fantasy armor, determined expression, magical forest background, ethereal lighting, ultra-realistic, photorealistic, high resolution, detailed, sharp focus, professional quality, 8k, masterpiece',
    imageSize: 'landscape_4_3',
    numInferenceSteps: 28,
    guidanceScale: 4.5,
    numImages: 3,
    enableSafetyChecker: true,
    outputFormat: 'jpeg',
    acceleration: 'regular'
  });

  if (result.success) {
    console.log('✅ Multiple images generated successfully');
    console.log('💰 Cost: $' + result.metadata.cost.toFixed(4));
    console.log('⏱️ Processing time: ' + result.metadata.processingTime + 'ms');
    console.log('📊 Images generated: ' + result.metadata.imageCount);
  } else {
    console.error('❌ Multiple images generation failed:', result.error);
  }

  return result;
}

/**
 * Seed Reproducibility Example
 * Using seed for reproducible results
 */
export async function seedReproducibilityExample() {
  console.log('🎲 Testing seed reproducibility...');
  
  const seed = 12345;
  const prompt = 'Professional portrait of a young adult man with short brown hair, blue eyes, wearing business suit, confident expression, studio lighting, high resolution, detailed, sharp focus, professional quality, 8k, masterpiece';
  
  // Generate first image
  const result1 = await generateFaceCharacter({
    prompt,
    imageSize: 'portrait_4_3',
    numInferenceSteps: 28,
    guidanceScale: 4.5,
    numImages: 1,
    enableSafetyChecker: true,
    outputFormat: 'jpeg',
    acceleration: 'none',
    seed
  });

  // Generate second image with same seed
  const result2 = await generateFaceCharacter({
    prompt,
    imageSize: 'portrait_4_3',
    numInferenceSteps: 28,
    guidanceScale: 4.5,
    numImages: 1,
    enableSafetyChecker: true,
    outputFormat: 'jpeg',
    acceleration: 'none',
    seed
  });

  if (result1.success && result2.success) {
    console.log('✅ Seed reproducibility test completed');
    console.log('🎯 Seed used: ' + seed);
    console.log('🔄 Both images should be identical');
    console.log('💰 Total cost: $' + (result1.metadata.cost + result2.metadata.cost).toFixed(4));
  } else {
    console.error('❌ Seed reproducibility test failed');
  }

  return { result1, result2 };
}

/**
 * Different Image Sizes Example
 * Testing various image size formats
 */
export async function differentImageSizesExample() {
  console.log('📐 Testing different image sizes...');
  
  const sizes = [
    { size: 'square_hd', description: 'Square HD' },
    { size: 'portrait_4_3', description: 'Portrait 4:3' },
    { size: 'landscape_4_3', description: 'Landscape 4:3' },
    { size: { width: 1024, height: 1024 }, description: 'Custom Square' }
  ];

  const results = [];
  
  for (const sizeConfig of sizes) {
    try {
      console.log(`📏 Generating ${sizeConfig.description}...`);
      
      const result = await generateFaceCharacter({
        prompt: 'Professional portrait of a young adult woman with long blonde hair, blue eyes, wearing elegant dress, confident expression, studio lighting, high resolution, detailed, sharp focus, professional quality, 8k, masterpiece',
        imageSize: sizeConfig.size,
        numInferenceSteps: 28,
        guidanceScale: 4.5,
        numImages: 1,
        enableSafetyChecker: true,
        outputFormat: 'jpeg',
        acceleration: 'none'
      });
      
      if (result.success) {
        console.log(`✅ ${sizeConfig.description} generated successfully`);
        console.log(`💰 Cost: $${result.metadata.cost.toFixed(4)}`);
        results.push({ size: sizeConfig.description, success: true, result });
      } else {
        console.error(`❌ ${sizeConfig.description} generation failed:`, result.error);
        results.push({ size: sizeConfig.description, success: false, error: result.error });
      }
    } catch (error) {
      console.error(`❌ ${sizeConfig.description} generation failed:`, error);
      results.push({ size: sizeConfig.description, success: false, error: error.message });
    }
  }

  return results;
}

/**
 * Acceleration Comparison Example
 * Comparing different acceleration options
 */
export async function accelerationComparisonExample() {
  console.log('⚡ Testing acceleration options...');
  
  const accelerations = [
    { acceleration: 'none', description: 'Base Speed' },
    { acceleration: 'regular', description: 'Regular Speed' },
    { acceleration: 'high', description: 'High Speed' }
  ];

  const results = [];
  
  for (const accelConfig of accelerations) {
    try {
      console.log(`🚀 Testing ${accelConfig.description}...`);
      
      const startTime = Date.now();
      const result = await generateFaceCharacter({
        prompt: 'Professional portrait of a young adult man with short black hair, brown eyes, wearing casual clothing, friendly smile, natural lighting, high resolution, detailed, sharp focus, professional quality, 8k, masterpiece',
        imageSize: 'portrait_4_3',
        numInferenceSteps: 28,
        guidanceScale: 4.5,
        numImages: 1,
        enableSafetyChecker: true,
        outputFormat: 'jpeg',
        acceleration: accelConfig.acceleration
      });
      
      const endTime = Date.now();
      const actualTime = endTime - startTime;
      
      if (result.success) {
        console.log(`✅ ${accelConfig.description} completed in ${actualTime}ms`);
        console.log(`💰 Cost: $${result.metadata.cost.toFixed(4)}`);
        results.push({ 
          acceleration: accelConfig.description, 
          success: true, 
          result, 
          actualTime,
          cost: result.metadata.cost
        });
      } else {
        console.error(`❌ ${accelConfig.description} generation failed:`, result.error);
        results.push({ acceleration: accelConfig.description, success: false, error: result.error });
      }
    } catch (error) {
      console.error(`❌ ${accelConfig.description} generation failed:`, error);
      results.push({ acceleration: accelConfig.description, success: false, error: error.message });
    }
  }

  return results;
}

/**
 * Run all examples
 */
export async function runAllFluxSRPOFaceCharacterExamples() {
  console.log('🚀 Starting FLUX.1 SRPO Face Character Examples\n');
  
  const examples = [
    { name: 'Professional Portrait', fn: professionalPortraitExample },
    { name: 'Character Design', fn: characterDesignExample },
    { name: 'Character Variations', fn: characterVariationsExample },
    { name: 'Character Builder', fn: characterBuilderExample },
    { name: 'Streaming', fn: streamingExample },
    { name: 'High-Quality Portrait', fn: highQualityPortraitExample },
    { name: 'Multiple Images', fn: multipleImagesExample },
    { name: 'Seed Reproducibility', fn: seedReproducibilityExample },
    { name: 'Different Image Sizes', fn: differentImageSizesExample },
    { name: 'Acceleration Comparison', fn: accelerationComparisonExample }
  ];

  const results = [];

  for (const example of examples) {
    try {
      console.log(`\n--- ${example.name} ---`);
      const result = await example.fn();
      results.push({ name: example.name, success: true, result });
    } catch (error) {
      console.error(`❌ ${example.name} failed:`, error);
      results.push({ name: example.name, success: false, error: error.message });
    }
  }

  console.log('\n📋 Summary:');
  results.forEach(result => {
    console.log(`${result.success ? '✅' : '❌'} ${result.name}`);
  });

  const successful = results.filter(r => r.success).length;
  console.log(`\n🎯 Overall: ${successful}/${results.length} examples successful`);

  return results;
}

export default {
  professionalPortraitExample,
  characterDesignExample,
  characterVariationsExample,
  characterBuilderExample,
  streamingExample,
  highQualityPortraitExample,
  multipleImagesExample,
  seedReproducibilityExample,
  differentImageSizesExample,
  accelerationComparisonExample,
  runAllFluxSRPOFaceCharacterExamples
};
