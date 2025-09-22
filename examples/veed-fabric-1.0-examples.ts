/**
 * VEED Fabric 1.0 Examples
 * 
 * This file contains comprehensive examples for using VEED Fabric 1.0
 * to create talking videos from static images.
 */

import { 
  executeVeedFabric, 
  executeVeedFabricWithQueue,
  checkVeedFabricStatus,
  getVeedFabricResult,
  calculateVeedFabricCost,
  getVeedFabricModelInfo,
  VeedFabricInput
} from '../executors/veed-fabric-1.0';

// Example 1: Basic Talking Avatar Creation
export async function createBasicTalkingAvatar() {
  console.log('=== Creating Basic Talking Avatar ===');
  
  const input: VeedFabricInput = {
    image_url: "https://v3.fal.media/files/koala/NLVPfOI4XL1cWT2PmmqT3_Hope.png",
    audio_url: "https://v3.fal.media/files/elephant/Oz_g4AwQvXtXpUHL3Pa7u_Hope.mp3",
    resolution: "480p"
  };

  try {
    const result = await executeVeedFabric(input);
    
    if ('error' in result) {
      console.error('Error creating talking avatar:', result.message);
      return null;
    }

    console.log('✅ Talking avatar created successfully!');
    console.log('Video URL:', result.video.url);
    console.log('File size:', result.video.file_size, 'bytes');
    console.log('Content type:', result.video.content_type);
    
    return result;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Example 2: High-Quality Talking Video
export async function createHighQualityTalkingVideo() {
  console.log('=== Creating High-Quality Talking Video ===');
  
  const input: VeedFabricInput = {
    image_url: "https://example.com/portrait.jpg",
    audio_url: "https://example.com/narration.wav",
    resolution: "720p" // Higher quality, higher cost
  };

  try {
    const result = await executeVeedFabric(input);
    
    if ('error' in result) {
      console.error('Error creating high-quality video:', result.message);
      return null;
    }

    console.log('✅ High-quality talking video created!');
    console.log('Video URL:', result.video.url);
    console.log('Resolution: 720p');
    console.log('File size:', result.video.file_size, 'bytes');
    
    return result;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Example 3: Queue-Based Processing for Long Videos
export async function processLongVideoWithQueue() {
  console.log('=== Processing Long Video with Queue ===');
  
  const input: VeedFabricInput = {
    image_url: "https://example.com/avatar.png",
    audio_url: "https://example.com/long-speech.mp3", // Long audio file
    resolution: "480p"
  };

  try {
    // Submit to queue
    const submission = await executeVeedFabricWithQueue(input, "https://your-webhook.url/results");
    
    if ('error' in submission) {
      console.error('Error submitting to queue:', submission.message);
      return null;
    }

    const requestId = submission.request_id;
    console.log('✅ Request submitted to queue:', requestId);

    // Poll for completion
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max wait time
    
    while (attempts < maxAttempts) {
      const status = await checkVeedFabricStatus(requestId);
      
      console.log(`Status check ${attempts + 1}: ${status.status}`);
      
      if (status.status === 'COMPLETED') {
        const result = await getVeedFabricResult(requestId);
        console.log('✅ Long video processing completed!');
        console.log('Video URL:', result.video.url);
        return result;
      } else if (status.status === 'FAILED') {
        console.error('❌ Processing failed:', status.error);
        return null;
      } else if (status.status === 'IN_PROGRESS') {
        console.log('⏳ Processing in progress...');
        if (status.logs) {
          status.logs.forEach(log => console.log('  Log:', log.message));
        }
      }
      
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    }
    
    console.log('⏰ Timeout waiting for completion');
    return null;
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Example 4: Cost Calculation Examples
export function demonstrateCostCalculation() {
  console.log('=== Cost Calculation Examples ===');
  
  const scenarios = [
    { duration: 10, resolution: "480p" as const, description: "Short 10-second video" },
    { duration: 30, resolution: "480p" as const, description: "30-second video" },
    { duration: 60, resolution: "480p" as const, description: "1-minute video" },
    { duration: 10, resolution: "720p" as const, description: "Short 10-second HD video" },
    { duration: 30, resolution: "720p" as const, description: "30-second HD video" },
    { duration: 60, resolution: "720p" as const, description: "1-minute HD video" }
  ];

  scenarios.forEach(scenario => {
    const cost = calculateVeedFabricCost(scenario.duration, scenario.resolution);
    console.log(`${scenario.description}: $${cost.toFixed(2)}`);
  });
}

// Example 5: Batch Processing Multiple Videos
export async function batchProcessVideos() {
  console.log('=== Batch Processing Multiple Videos ===');
  
  const videos = [
    {
      name: "Avatar 1",
      image_url: "https://example.com/avatar1.png",
      audio_url: "https://example.com/speech1.mp3",
      resolution: "480p" as const
    },
    {
      name: "Avatar 2", 
      image_url: "https://example.com/avatar2.png",
      audio_url: "https://example.com/speech2.mp3",
      resolution: "480p" as const
    },
    {
      name: "Avatar 3",
      image_url: "https://example.com/avatar3.png", 
      audio_url: "https://example.com/speech3.mp3",
      resolution: "720p" as const
    }
  ];

  const results = [];
  
  for (const video of videos) {
    console.log(`Processing ${video.name}...`);
    
    try {
      const result = await executeVeedFabric(video);
      
      if ('error' in result) {
        console.error(`❌ Error processing ${video.name}:`, result.message);
        results.push({ name: video.name, error: result.message });
      } else {
        console.log(`✅ ${video.name} completed:`, result.video.url);
        results.push({ 
          name: video.name, 
          video_url: result.video.url,
          file_size: result.video.file_size 
        });
      }
    } catch (error) {
      console.error(`❌ Unexpected error processing ${video.name}:`, error);
      results.push({ name: video.name, error: 'Unexpected error' });
    }
    
    // Add delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('Batch processing completed. Results:', results);
  return results;
}

// Example 6: Error Handling and Validation
export async function demonstrateErrorHandling() {
  console.log('=== Error Handling Examples ===');
  
  const invalidInputs = [
    {
      name: "Missing image URL",
      input: {
        audio_url: "https://example.com/audio.mp3",
        resolution: "480p" as const
      } as Partial<VeedFabricInput>
    },
    {
      name: "Invalid resolution",
      input: {
        image_url: "https://example.com/image.png",
        audio_url: "https://example.com/audio.mp3",
        resolution: "1080p" as any
      }
    },
    {
      name: "Invalid image URL",
      input: {
        image_url: "not-a-valid-url",
        audio_url: "https://example.com/audio.mp3",
        resolution: "480p" as const
      }
    }
  ];

  for (const test of invalidInputs) {
    console.log(`Testing: ${test.name}`);
    
    try {
      const result = await executeVeedFabric(test.input as VeedFabricInput);
      
      if ('error' in result) {
        console.log(`✅ Correctly caught error: ${result.error} - ${result.message}`);
      } else {
        console.log('❌ Expected error but got success');
      }
    } catch (error) {
      console.log(`✅ Caught exception: ${error}`);
    }
  }
}

// Example 7: Model Information
export function displayModelInformation() {
  console.log('=== VEED Fabric 1.0 Model Information ===');
  
  const modelInfo = getVeedFabricModelInfo();
  
  console.log('Name:', modelInfo.name);
  console.log('Description:', modelInfo.description);
  console.log('Provider:', modelInfo.provider);
  console.log('Model ID:', modelInfo.modelId);
  console.log('Capabilities:', modelInfo.capabilities.join(', '));
  console.log('Pricing:');
  Object.entries(modelInfo.pricing).forEach(([resolution, price]) => {
    console.log(`  ${resolution}: ${price}`);
  });
  console.log('Supported Formats:');
  console.log('  Images:', modelInfo.supportedFormats.image.join(', '));
  console.log('  Audio:', modelInfo.supportedFormats.audio.join(', '));
  console.log('  Output:', modelInfo.supportedFormats.output.join(', '));
}

// Example 8: Real-World Use Case - Educational Content
export async function createEducationalTalkingAvatar() {
  console.log('=== Creating Educational Talking Avatar ===');
  
  const input: VeedFabricInput = {
    image_url: "https://example.com/teacher-avatar.png",
    audio_url: "https://example.com/lesson-narration.mp3",
    resolution: "720p" // High quality for educational content
  };

  try {
    const result = await executeVeedFabric(input);
    
    if ('error' in result) {
      console.error('Error creating educational avatar:', result.message);
      return null;
    }

    console.log('✅ Educational talking avatar created!');
    console.log('Perfect for:');
    console.log('- Online courses');
    console.log('- Tutorial videos');
    console.log('- Educational presentations');
    console.log('- Interactive learning content');
    console.log('Video URL:', result.video.url);
    
    return result;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Example 9: Real-World Use Case - Marketing Content
export async function createMarketingTalkingVideo() {
  console.log('=== Creating Marketing Talking Video ===');
  
  const input: VeedFabricInput = {
    image_url: "https://example.com/mascot.png",
    audio_url: "https://example.com/product-pitch.mp3",
    resolution: "480p" // Cost-effective for marketing
  };

  try {
    const result = await executeVeedFabric(input);
    
    if ('error' in result) {
      console.error('Error creating marketing video:', result.message);
      return null;
    }

    console.log('✅ Marketing talking video created!');
    console.log('Perfect for:');
    console.log('- Social media campaigns');
    console.log('- Product demonstrations');
    console.log('- Brand storytelling');
    console.log('- Customer engagement');
    console.log('Video URL:', result.video.url);
    
    return result;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Example 10: Complete Workflow with Progress Tracking
export async function completeWorkflowWithProgress() {
  console.log('=== Complete Workflow with Progress Tracking ===');
  
  const workflow = async () => {
    console.log('Step 1: Calculate estimated cost...');
    const estimatedCost = calculateVeedFabricCost(30, "480p");
    console.log(`Estimated cost for 30-second video: $${estimatedCost.toFixed(2)}`);
    
    console.log('Step 2: Display model information...');
    displayModelInformation();
    
    console.log('Step 3: Create talking video...');
    const result = await createBasicTalkingAvatar();
    
    if (result) {
      console.log('Step 4: Workflow completed successfully!');
      console.log('Final video URL:', result.video.url);
      return result;
    } else {
      console.log('Step 4: Workflow failed');
      return null;
    }
  };
  
  return await workflow();
}

// Main execution function to run all examples
export async function runAllExamples() {
  console.log('🚀 Starting VEED Fabric 1.0 Examples\n');
  
  try {
    // Basic examples
    await createBasicTalkingAvatar();
    console.log('\n');
    
    // Cost calculation
    demonstrateCostCalculation();
    console.log('\n');
    
    // Model information
    displayModelInformation();
    console.log('\n');
    
    // Error handling
    await demonstrateErrorHandling();
    console.log('\n');
    
    // Real-world use cases
    await createEducationalTalkingAvatar();
    console.log('\n');
    
    await createMarketingTalkingVideo();
    console.log('\n');
    
    // Complete workflow
    await completeWorkflowWithProgress();
    
    console.log('\n✅ All examples completed!');
    
  } catch (error) {
    console.error('❌ Error running examples:', error);
  }
}

// Export individual examples for selective execution
export const examples = {
  createBasicTalkingAvatar,
  createHighQualityTalkingVideo,
  processLongVideoWithQueue,
  demonstrateCostCalculation,
  batchProcessVideos,
  demonstrateErrorHandling,
  displayModelInformation,
  createEducationalTalkingAvatar,
  createMarketingTalkingVideo,
  completeWorkflowWithProgress,
  runAllExamples
};

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples();
}
