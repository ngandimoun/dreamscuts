# MiniMax Video-01 Image-to-Video - Usage Guide

## Overview
The MiniMax Video-01 model is an advanced AI-powered image-to-video generation system that transforms static images into dynamic video content. It produces high-resolution, high-frame-rate videos with natural motion while maintaining the original image's quality and integrity.

## Model Information
- **Model ID**: `fal-ai/minimax/video-01/image-to-video`
- **Provider**: MiniMax (via fal.ai)
- **Version**: v1.0
- **Cost**: $0.50 per video (fixed price)
- **Output Duration**: 6 seconds
- **Output Resolution**: 1280x720 (720p)
- **Frame Rate**: 25 fps

## Key Features
- **High-Quality Output**: 720p resolution at 25fps for professional results
- **Natural Motion**: Advanced AI generates fluid, realistic animations
- **Camera Movements**: Support for professional camera techniques
- **Prompt Optimization**: Built-in prompt enhancement for better results
- **Quality Preservation**: Maintains original image quality during transformation
- **Fast Processing**: Real-time progress updates during generation

## Basic Usage

### 1. Import and Initialize
```typescript
import { createMinimaxVideo01ImageToVideoExecutor } from './executors/minimax-video-01-image-to-video';

const executor = createMinimaxVideo01ImageToVideoExecutor('your-fal-ai-api-key');
```

### 2. Simple Video Generation
```typescript
const result = await executor.generateVideo({
  image_url: 'https://example.com/your-image.jpg',
  prompt: 'A stylish woman walks down a Tokyo street filled with warm glowing neon'
});

console.log('Generated video URL:', result.video.url);
```

### 3. With Prompt Optimization
```typescript
const result = await executor.generateVideo({
  image_url: 'https://example.com/your-image.jpg',
  prompt: 'A cat playing in a garden with butterflies',
  prompt_optimizer: true // Enabled by default
});
```

## Advanced Features

### Camera Movement Instructions
Add professional camera movements to your prompts using square brackets:

```typescript
// Single camera movement
const result = await executor.generateVideo({
  image_url: 'https://example.com/your-image.jpg',
  prompt: 'A mountain landscape [Pan left]'
});

// Multiple camera movements (up to 3)
const result = await executor.generateVideo({
  image_url: 'https://example.com/your-image.jpg',
  prompt: 'A city skyline at sunset [Truck left, Zoom in, Tilt up]'
});
```

### Available Camera Movements
- **Pan left/right** - Horizontal camera rotation
- **Truck left/right** - Sideways camera movement
- **Push in/Pull out** - Forward/backward camera movement
- **Pedestal up/down** - Vertical camera movement
- **Tilt up/down** - Vertical camera rotation
- **Zoom in/out** - Lens zoom effects
- **Shake** - Camera shake effect
- **Tracking shot** - Follow subject movement
- **Static shot** - No camera movement

### Helper Methods for Camera Movements
```typescript
// Get all available camera movements
const movements = executor.getAvailableCameraMovements();

// Generate a prompt with camera movements
const enhancedPrompt = executor.generatePromptWithCameraMovement(
  'A beautiful sunset over the ocean',
  ['Pan left', 'Zoom in']
);
// Result: "A beautiful sunset over the ocean [Pan left, Zoom in]"
```

## Queue-Based Processing

For handling multiple requests or long-running generations:

### 1. Submit to Queue
```typescript
const { requestId } = await executor.queueVideoGeneration({
  image_url: 'https://example.com/your-image.jpg',
  prompt: 'A car driving through a mountain pass [Truck left]',
  prompt_optimizer: true
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
- **`prompt_optimizer`** (boolean): Enable automatic prompt optimization (default: true)

## Output Format

The model returns an object with the following structure:

```typescript
interface MinimaxVideo01ImageToVideoOutput {
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

The cost is fixed per video regardless of complexity:

```typescript
const cost = executor.calculateCost(); // Always returns $0.50
console.log(`Cost: $${cost}`);
```

**Cost Examples:**
- 1 video: $0.50
- 10 videos: $5.00
- 100 videos: $50.00

## Model Capabilities

### Supported Input Types
- **Image Formats**: JPG, JPEG, PNG, WebM, GIF, AVIF
- **Text Prompts**: Descriptive motion and scene descriptions
- **Camera Movements**: Professional cinematography techniques

### Output Quality
- **Resolution**: 1280x720 (720p)
- **Frame Rate**: 25 fps
- **Duration**: 6 seconds
- **Format**: MP4 with high compression

### Processing Features
- Real-time progress updates
- Automatic prompt optimization
- Professional camera movement support
- Quality preservation during transformation

## Best Practices

### 1. Image Quality
- Use high-resolution, clear source images
- Ensure good lighting and contrast
- Avoid heavily compressed or low-quality images

### 2. Prompt Writing
- Be specific about desired motion and actions
- Describe the scene and atmosphere clearly
- Use camera movement instructions for professional effects
- Test different prompt variations for optimal results

### 3. Camera Movements
- Start with simple movements for basic effects
- Combine up to 3 movements for complex shots
- Use movements that enhance the story or mood
- Consider the subject and scene when choosing movements

### 4. Error Handling
```typescript
try {
  const result = await executor.generateVideo({
    image_url: 'https://example.com/your-image.jpg',
    prompt: 'A bird flying over mountains [Pan right]'
  });
  // Process successful result
} catch (error) {
  console.error('Video generation failed:', error.message);
  // Handle error appropriately
}
```

## Use Cases

### Social Media Content
- Transform product photos into engaging videos
- Create dynamic content for Instagram, TikTok, and YouTube
- Add motion to static brand imagery

### Marketing and Advertising
- Product demonstration videos
- Brand storytelling with motion
- Engaging promotional content

### Creative Projects
- Artistic image transformations
- Storytelling through motion
- Experimental video art

### Educational Content
- Animated diagrams and charts
- Interactive learning materials
- Visual concept explanations

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
  prompt: 'A flower blooming in slow motion [Zoom in]'
});
```

## Limitations and Considerations

### Current Limitations
- Fixed 6-second video duration
- 720p output resolution only
- MP4 output format only
- Processing time varies with complexity

### Future Updates
- Planned extension to 10-second videos
- Potential resolution improvements
- Additional output format support

### Quality Factors
- Output quality depends on input image quality
- Complex prompts may require longer processing
- Camera movements add realism but may increase processing time

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

3. **Quality Issues**
   - Use higher quality input images
   - Enable prompt optimization
   - Test different prompt variations

### Getting Help
- Check fal.ai documentation for API-related issues
- Verify your fal.ai account has access to this model
- Ensure you have sufficient credits for processing

## Example Workflows

### Basic Content Creation
```typescript
import { createMinimaxVideo01ImageToVideoExecutor } from './executors/minimax-video-01-image-to-video';

async function createBasicVideo() {
  try {
    const executor = createMinimaxVideo01ImageToVideoExecutor('your-api-key');
    
    const result = await executor.generateVideo({
      image_url: 'https://example.com/product-photo.jpg',
      prompt: 'A modern smartphone rotating slowly to showcase all angles'
    });
    
    console.log('Video created successfully!');
    console.log('Output URL:', result.video.url);
    
    return result;
  } catch (error) {
    console.error('Video creation failed:', error.message);
    throw error;
  }
}
```

### Professional Camera Movement
```typescript
async function createCinematicVideo() {
  try {
    const executor = createMinimaxVideo01ImageToVideoExecutor('your-api-key');
    
    const result = await executor.generateVideo({
      image_url: 'https://example.com/landscape.jpg',
      prompt: 'A breathtaking mountain landscape at golden hour [Truck left, Zoom in, Tilt up]'
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

### Batch Processing
```typescript
async function createMultipleVideos() {
  try {
    const executor = createMinimaxVideo01ImageToVideoExecutor('your-api-key');
    
    const inputs = [
      {
        image_url: 'https://example.com/image1.jpg',
        prompt: 'A cat playing with a ball [Zoom in]'
      },
      {
        image_url: 'https://example.com/image2.jpg',
        prompt: 'A sunset over the ocean [Pan left]'
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

This comprehensive guide should help you effectively use the MiniMax Video-01 Image-to-Video model for creating dynamic, engaging video content from static images.
