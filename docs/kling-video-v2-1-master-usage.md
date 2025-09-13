# Kling Video v2.1 Master Image-to-Video - Usage Guide

## Overview
The Kling Video v2.1 Master model is the premium endpoint for Kling 2.1, designed for top-tier image-to-video generation. It delivers unparalleled motion fluidity, cinematic visuals, and exceptional prompt precision, making it ideal for professional video production and high-end content creation.

## Model Information
- **Model ID**: `fal-ai/kling-video/v2.1/master/image-to-video`
- **Provider**: Kling AI (via fal.ai)
- **Version**: v2.1
- **Cost**: $1.40 for 5s, $0.28 for each additional second
- **Output Duration**: 5 or 10 seconds
- **Quality**: Premium tier with unparalleled motion fluidity

## Key Features
- **Premium Quality**: Top-tier cinematic visuals and motion fluidity
- **Advanced Control**: Negative prompts and CFG scale control
- **Duration Options**: 5 or 10 second outputs
- **Exceptional Precision**: Unparalleled prompt adherence and scene understanding
- **Professional Grade**: Designed for high-end content creation
- **Motion Fluidity**: Advanced motion synthesis with realistic animations

## Basic Usage

### 1. Import and Initialize
```typescript
import { createKlingVideoV21MasterImageToVideoExecutor } from './executors/kling-video-v2-1-master';

const executor = createKlingVideoV21MasterImageToVideoExecutor('your-fal-ai-api-key');
```

### 2. Simple Video Generation
```typescript
const result = await executor.generateVideo({
  image_url: 'https://example.com/your-image.jpg',
  prompt: 'A majestic eagle soaring through mountain peaks with graceful wing movements'
});

console.log('Generated video URL:', result.video.url);
```

### 3. With Advanced Parameters
```typescript
const result = await executor.generateVideo({
  image_url: 'https://example.com/your-image.jpg',
  prompt: 'A serene lake reflecting golden sunset light, gentle ripples spreading across the surface',
  duration: '10',
  negative_prompt: 'blur, low quality, artifacts, noise',
  cfg_scale: 0.7
});
```

## Advanced Features

### Duration Control
Choose between 5 and 10 second outputs:

```typescript
// 5-second video (default, most cost-effective)
const result5s = await executor.generateVideo({
  image_url: 'https://example.com/your-image.jpg',
  prompt: 'A butterfly landing on a flower petal',
  duration: '5'
});

// 10-second video (longer, more expensive)
const result10s = await executor.generateVideo({
  image_url: 'https://example.com/your-image.jpg',
  prompt: 'A butterfly landing on a flower petal, then taking flight',
  duration: '10'
});
```

### Negative Prompts
Use negative prompts to avoid unwanted elements:

```typescript
const result = await executor.generateVideo({
  image_url: 'https://example.com/your-image.jpg',
  prompt: 'A peaceful forest scene with gentle sunlight filtering through trees',
  negative_prompt: 'blur, low quality, artifacts, noise, distorted, blurry'
});
```

### CFG Scale Control
Control how closely the model follows your prompt:

```typescript
// More creative, less prompt adherence
const creativeResult = await executor.generateVideo({
  image_url: 'https://example.com/your-image.jpg',
  prompt: 'A magical forest with glowing mushrooms',
  cfg_scale: 0.3
});

// More prompt adherence, less creativity
const preciseResult = await executor.generateVideo({
  image_url: 'https://example.com/your-image.jpg',
  prompt: 'A magical forest with glowing mushrooms',
  cfg_scale: 0.8
});
```

### Helper Methods for Advanced Features
```typescript
// Get recommended CFG scale values
const cfgScales = executor.getRecommendedCFGScales();
cfgScales.forEach(scale => {
  console.log(`${scale.value}: ${scale.description}`);
});

// Get recommended negative prompts
const negativePrompts = executor.getRecommendedNegativePrompts();
console.log('Recommended negative prompts:', negativePrompts);
```

## Queue-Based Processing

For handling multiple requests or long-running generations:

### 1. Submit to Queue
```typescript
const { requestId } = await executor.queueVideoGeneration({
  image_url: 'https://example.com/your-image.jpg',
  prompt: 'A car driving through a mountain pass with scenic views',
  duration: '10',
  negative_prompt: 'blur, low quality',
  cfg_scale: 0.6
}, 'https://your-webhook-url.com/callback');
```

### 2. Check Status
```typescript
const status = await executor.checkQueueStatus(requestId);
console.log('Processing status:', status.status);
console.log('Progress logs:', status.logs);
```

### 3. Get Results
```typescript
const result = await executor.getQueueResult(requestId);
console.log('Generated video URL:', result.video.url);
```

## Input Parameters

### Required Parameters
- **`prompt`** (string): Text description of the desired video motion and scene
- **`image_url`** (string): URL of the source image to transform into video

### Optional Parameters
- **`duration`** (string): Duration of the generated video - "5" or "10" seconds (default: "5")
- **`negative_prompt`** (string): Text describing elements to avoid (default: "blur, distort, and low quality")
- **`cfg_scale`** (number): CFG scale to control prompt adherence, 0-1 (default: 0.5)

## Output Format

The model returns an object with the following structure:

```typescript
interface KlingVideoV21MasterImageToVideoOutput {
  video: {
    url: string;           // URL of the generated video
    content_type?: string; // MIME type of the video
    file_name?: string;    // Name of the video file
    file_size?: number;    // Size of the video file in bytes
  };
  requestId?: string;      // Request ID for queue-based processing
}
```

## Cost Calculation

The cost structure is base + per-second:

```typescript
// Calculate cost for different durations
const cost5s = executor.calculateCost(5);   // $1.40
const cost6s = executor.calculateCost(6);   // $1.68
const cost8s = executor.calculateCost(8);   // $2.24
const cost10s = executor.calculateCost(10); // $2.52

console.log(`5s video: $${cost5s}`);
console.log(`10s video: $${cost10s}`);
```

**Cost Examples:**
- 5 seconds: $1.40
- 6 seconds: $1.68
- 8 seconds: $2.24
- 10 seconds: $2.52

## Model Capabilities

### Supported Input Types
- **Image Formats**: Any high-quality image format
- **Text Prompts**: Detailed motion and scene descriptions
- **Advanced Controls**: Negative prompts and CFG scale

### Output Quality
- **Resolution**: High-quality cinematic output
- **Frame Rate**: Professional frame rate
- **Duration**: 5 or 10 seconds
- **Format**: MP4 with professional compression

### Processing Features
- Real-time progress updates
- Advanced negative prompt support
- CFG scale control for precision
- Premium motion fluidity
- Cinematic quality enhancement

## Best Practices

### 1. Image Quality
- Use high-resolution, clear source images
- Ensure good lighting and contrast
- Avoid heavily compressed or low-quality images

### 2. Prompt Writing
- Be specific about desired motion and actions
- Describe the scene and atmosphere clearly
- Use detailed descriptions for complex scenes
- Test different prompt variations for optimal results

### 3. Negative Prompts
- Start with the default negative prompt
- Add specific elements you want to avoid
- Use clear, descriptive language
- Test different negative prompt combinations

### 4. CFG Scale Tuning
- **0.3-0.4**: More creative, less prompt adherence
- **0.5**: Default balanced approach
- **0.6-0.7**: More prompt adherence, less creativity
- **0.8-1.0**: Maximum prompt adherence

### 5. Duration Selection
- Use 5 seconds for testing and cost-effectiveness
- Use 10 seconds for complex scenes requiring more time
- Consider cost implications for longer durations

### 6. Error Handling
```typescript
try {
  const result = await executor.generateVideo({
    image_url: 'https://example.com/your-image.jpg',
    prompt: 'A majestic eagle soaring through mountain peaks',
    duration: '10',
    cfg_scale: 0.7
  });
  // Process successful result
} catch (error) {
  console.error('Video generation failed:', error.message);
  // Handle error appropriately
}
```

## Use Cases

### Professional Video Production
- High-end marketing content
- Cinematic storytelling
- Professional presentations
- Premium brand content

### Creative Projects
- Artistic video transformations
- Cinematic art pieces
- Professional portfolios
- High-quality content creation

### Marketing and Advertising
- Premium product demonstrations
- High-end brand storytelling
- Cinematic promotional content
- Professional marketing materials

## File Upload Support

Upload local images using fal.ai's storage API:

```typescript
import { fal } from "@fal-ai/client";

// Upload a local image file
const file = new File([imageData], "image.jpg", { type: "image/jpeg" });
const url = await fal.storage.upload(file);

// Use the uploaded image for video generation
const result = await executor.generateVideo({
  image_url: url,
  prompt: 'A majestic eagle soaring through mountain peaks',
  duration: '10',
  cfg_scale: 0.7
});
```

## Limitations and Considerations

### Current Limitations
- Only 5 or 10 second duration options
- MP4 output format only
- Higher cost compared to standard models
- Processing time varies with complexity

### Quality Factors
- Output quality depends on input image quality
- Complex prompts may require longer processing
- CFG scale affects creativity vs. precision balance
- Negative prompts help avoid unwanted artifacts

## Troubleshooting

### Common Issues

1. **Invalid Image URL**
   - Ensure the image URL is accessible
   - Check that the image format is supported
   - Verify the image file exists and is not corrupted

2. **Processing Failures**
   - Check image quality and format
   - Ensure fal.ai API key is valid
   - Verify network connectivity
   - Check prompt length and complexity

3. **Quality Issues**
   - Use higher quality input images
   - Adjust CFG scale values
   - Refine negative prompts
   - Test different prompt variations

### Getting Help
- Check fal.ai documentation for API-related issues
- Verify your fal.ai account has access to this model
- Ensure you have sufficient credits for processing
- Test with simpler prompts first

## Example Workflows

### Basic Premium Content Creation
```typescript
import { createKlingVideoV21MasterImageToVideoExecutor } from './executors/kling-video-v2-1-master';

async function createPremiumVideo() {
  try {
    const executor = createKlingVideoV21MasterImageToVideoExecutor('your-api-key');
    
    const result = await executor.generateVideo({
      image_url: 'https://example.com/product-photo.jpg',
      prompt: 'A luxury smartphone rotating slowly to showcase all premium features and design elements',
      duration: '10',
      cfg_scale: 0.7
    });
    
    console.log('Premium video created successfully!');
    console.log('Output URL:', result.video.url);
    
    return result;
  } catch (error) {
    console.error('Premium video creation failed:', error.message);
    throw error;
  }
}
```

### Cinematic Storytelling
```typescript
async function createCinematicVideo() {
  try {
    const executor = createKlingVideoV21MasterImageToVideoExecutor('your-api-key');
    
    const result = await executor.generateVideo({
      image_url: 'https://example.com/landscape.jpg',
      prompt: 'A breathtaking mountain landscape at golden hour, with gentle camera movement revealing the majestic peaks and valleys below, creating a sense of awe and wonder',
      duration: '10',
      negative_prompt: 'blur, low quality, artifacts, noise, distorted',
      cfg_scale: 0.8
    });
    
    console.log('Cinematic video created!');
    console.log('Output URL:', result.video.url);
    
    return result;
  } catch (error) {
    console.error('Cinematic video creation failed:', error.message);
    throw error;
  }
}
```

### Batch Processing with Quality Control
```typescript
async function createMultiplePremiumVideos() {
  try {
    const executor = createKlingVideoV21MasterImageToVideoExecutor('your-api-key');
    
    const inputs = [
      {
        image_url: 'https://example.com/image1.jpg',
        prompt: 'A cat playing with a ball in a sunlit garden',
        duration: '5',
        cfg_scale: 0.6
      },
      {
        image_url: 'https://example.com/image2.jpg',
        prompt: 'A sunset over the ocean with gentle waves',
        duration: '10',
        cfg_scale: 0.7
      }
    ];
    
    const results = await executor.generateMultipleVideos(inputs);
    
    console.log('Batch processing completed!');
    results.forEach((result, index) => {
      if ('video' in result) {
        console.log(`Video ${index + 1}:`, result.video.url);
      } else {
        console.log(`Video ${index + 1} failed:`, result.message);
      }
    });
    
    return results;
  } catch (error) {
    console.error('Batch processing failed:', error.message);
    throw error;
  }
}
```

This comprehensive guide should help you effectively use the Kling Video v2.1 Master Image-to-Video model for creating premium, cinematic content with unparalleled motion fluidity and exceptional prompt precision.
