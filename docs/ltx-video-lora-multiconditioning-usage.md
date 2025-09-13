# LTX Video LoRA Multi-conditioning Usage Guide

## Overview

The **LTX Video LoRA Multi-conditioning** model is an advanced video generation system that combines the power of LTX Video-0.9.7 with custom LoRA weights and sophisticated multi-conditioning capabilities. This model can generate videos from text prompts while applying image or video influences at specific frame numbers with configurable strength.

## Key Features

- **Multi-conditioning Support**: Apply image or video influences at specific frames
- **LoRA Integration**: Custom LoRA weights for enhanced style control
- **Prompt Optimization**: AI-powered prompt enhancement for better results
- **Flexible Input**: Support for text, image, and video inputs
- **Frame-level Control**: Precise control over conditioning application
- **Multiple Resolutions**: 480p, 720p, and 1080p output options
- **Aspect Ratio Control**: 16:9, 9:16, 1:1, 4:3, and 3:4 ratios

## Basic Usage

### Simple Text-to-Video Generation

```typescript
import { LtxVideoLoraMulticonditioningExecutor } from './executors/ltx-video-lora-multiconditioning';

const executor = new LtxVideoLoraMulticonditioningExecutor();

const result = await executor.generateVideo({
  prompt: "A serene mountain landscape with flowing clouds",
  aspect_ratio: "16:9",
  resolution: "720p",
  num_frames: 180
});

console.log('Generated video URL:', result.video.url);
```

### With Image Conditioning

```typescript
const result = await executor.generateVideo({
  prompt: "A futuristic cityscape with flying cars",
  image_condition: {
    image_url: "https://example.com/city.jpg",
    frame_number: 90,  // Apply at frame 90
    strength: 0.7      // 70% influence strength
  },
  aspect_ratio: "16:9",
  resolution: "1080p"
});
```

### With Video Conditioning

```typescript
const result = await executor.generateVideo({
  prompt: "A flowing river through a forest",
  video_condition: {
    video_url: "https://example.com/river.mp4",
    frame_number: 45,  // Apply at frame 45
    strength: 0.5      // 50% influence strength
  },
  aspect_ratio: "9:16",
  resolution: "720p"
});
```

## Input Parameters

### Required Parameters

- **`prompt`** (string, max 500 chars): Text description of the video to generate

### Optional Parameters

- **`negative_prompt`** (string): Text describing what to avoid in the video
- **`image_url`** (string): URL of input image for image-to-video generation
- **`video_url`** (string): URL of input video for video-to-video generation
- **`seed`** (number): Random seed for reproducible results (default: 0)
- **`aspect_ratio`** (string): Video aspect ratio (default: "16:9")
  - Options: "16:9", "9:16", "1:1", "4:3", "3:4"
- **`resolution`** (string): Output video resolution (default: "480p")
  - Options: "480p", "720p", "1080p"
- **`num_frames`** (number): Number of frames to generate (1-300, default: 180)
- **`guidance_scale`** (number): Control over prompt adherence (1-20, default: 10)
- **`prompt_optimizer`** (boolean): Enable AI prompt enhancement (default: true)

### Conditioning Parameters

#### Image Condition
```typescript
image_condition: {
  image_url: string,    // URL of conditioning image
  frame_number: number, // Frame to apply condition (0-based)
  strength: number      // Influence strength (0.0-1.0)
}
```

#### Video Condition
```typescript
video_condition: {
  video_url: string,    // URL of conditioning video
  frame_number: number, // Frame to apply condition (0-based)
  strength: number      // Influence strength (0.0-1.0)
}
```

## Advanced Usage

### Queue-based Processing

For long-running requests, use the queue system:

```typescript
// Submit to queue
const { requestId } = await executor.submitToQueue({
  prompt: "Complex video generation with multiple conditions",
  image_condition: {
    image_url: "https://example.com/start.jpg",
    frame_number: 0,
    strength: 0.8
  },
  video_condition: {
    video_url: "https://example.com/transition.mp4",
    frame_number: 90,
    strength: 0.6
  }
});

// Check status
const status = await executor.checkStatus(requestId);
console.log('Status:', status.status);

// Get result when complete
if (status.status === 'COMPLETED') {
  const result = await executor.getResult(requestId);
  console.log('Video URL:', result.video.url);
}
```

### Batch Generation with Different Seeds

```typescript
const seeds = [42, 123, 456, 789, 999];
const results = [];

for (const seed of seeds) {
  const result = await executor.generateVideo({
    prompt: "A magical forest with glowing mushrooms",
    seed,
    aspect_ratio: "16:9",
    resolution: "720p"
  });
  results.push(result);
}

console.log(`Generated ${results.length} variations`);
```

### Cost Estimation

```typescript
// Estimate cost before generation
const estimatedCost = executor.calculateCost("720p", 180);
console.log(`Estimated cost: $${estimatedCost.toFixed(4)}`);

// For 1080p with 240 frames
const highResCost = executor.calculateCost("1080p", 240);
console.log(`High resolution cost: $${highResCost.toFixed(4)}`);
```

## Use Case Examples

### 1. Storytelling Videos
Create narrative videos with scene transitions using image conditioning:

```typescript
const storyVideo = await executor.generateVideo({
  prompt: "A hero's journey through different worlds",
  image_condition: {
    image_url: "https://example.com/hero.jpg",
    frame_number: 0,
    strength: 0.9
  },
  aspect_ratio: "16:9",
  resolution: "720p",
  num_frames: 240
});
```

### 2. Product Demonstrations
Generate product videos with consistent branding:

```typescript
const productVideo = await executor.generateVideo({
  prompt: "A sleek smartphone rotating to showcase its design",
  image_condition: {
    image_url: "https://example.com/brand-logo.png",
    frame_number: 60,
    strength: 0.8
  },
  aspect_ratio: "9:16",
  resolution: "1080p"
});
```

### 3. Educational Content
Create educational videos with visual aids:

```typescript
const educationalVideo = await executor.generateVideo({
  prompt: "A scientific explanation of photosynthesis",
  image_condition: {
    image_url: "https://example.com/diagram.jpg",
    frame_number: 30,
    strength: 0.7
  },
  video_condition: {
    video_url: "https://example.com/process.mp4",
    frame_number: 120,
    strength: 0.6
  },
  aspect_ratio: "16:9",
  resolution: "720p"
});
```

## Best Practices

### Prompt Engineering
- Use clear, descriptive language
- Include specific visual details
- Mention desired camera movements
- Specify lighting and atmosphere
- Use the prompt optimizer for enhanced results

### Conditioning Strategy
- Apply conditions sparingly to avoid over-conditioning
- Use higher strength (0.7-0.9) for important elements
- Use lower strength (0.3-0.6) for subtle influences
- Consider frame timing for smooth transitions
- Test different frame numbers for optimal placement

### Performance Optimization
- Start with lower resolutions for testing
- Use appropriate frame counts for desired duration
- Balance quality vs. cost with resolution choices
- Use queue system for long generations
- Monitor generation progress with logs

### Cost Management
- 480p is most cost-effective for testing
- 720p offers good quality-cost balance
- 1080p for final production content
- Consider frame count impact on total cost
- Use cost estimation before generation

## Error Handling

### Input Validation

```typescript
const validation = executor.validateInput({
  prompt: "Test prompt",
  num_frames: 500  // Invalid: exceeds maximum
});

if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
  // Handle errors appropriately
}
```

### Error Handling in Generation

```typescript
try {
  const result = await executor.generateVideo({
    prompt: "A beautiful landscape",
    image_condition: {
      image_url: "invalid-url",
      frame_number: 0,
      strength: 0.5
    }
  });
} catch (error) {
  console.error('Generation failed:', error.error);
  if (error.details) {
    console.error('Details:', error.details);
  }
}
```

## Troubleshooting

### Common Issues

1. **Invalid Image/Video URLs**
   - Ensure URLs are publicly accessible
   - Check for CORS restrictions
   - Verify file formats are supported

2. **Conditioning Not Working**
   - Check frame number is within video length
   - Verify strength values are between 0.0-1.0
   - Ensure image/video files are valid

3. **Generation Failures**
   - Reduce prompt length if over 500 characters
   - Check guidance scale is within 1-20 range
   - Verify frame count is within 1-300 range

4. **Poor Quality Results**
   - Increase guidance scale (try 12-15)
   - Use more descriptive prompts
   - Enable prompt optimizer
   - Try different seeds

### Performance Tips

- Use 480p for rapid prototyping
- Start with 180 frames for testing
- Apply conditions at key frame numbers
- Use negative prompts to avoid unwanted elements
- Experiment with different aspect ratios

## API Reference

### Class: LtxVideoLoraMulticonditioningExecutor

#### Methods

- **`generateVideo(input)`**: Generate video synchronously
- **`submitToQueue(input)`**: Submit to queue for async processing
- **`checkStatus(requestId)`**: Check queue status
- **`getResult(requestId)`**: Get completed result
- **`calculateCost(resolution, numFrames)`**: Estimate generation cost
- **`validateInput(input)`**: Validate input parameters

#### Properties

- **`modelEndpoint`**: The fal.ai model endpoint

### Input Interface: LtxVideoLoraMulticonditioningInput

All input parameters and their types as described above.

### Output Interface: LtxVideoLoraMulticonditioningOutput

- **`video`**: Object containing video URL and metadata
- **`seed`**: The seed used for generation
- **`prompt_optimized`**: Enhanced prompt if optimizer was used

## Cost Structure

The model uses a **per-frame pricing model**:

- **Base cost per frame**: $0.0001
- **Resolution multipliers**:
  - 480p: 1.0x (base cost)
  - 720p: 1.5x
  - 1080p: 2.0x

### Example Calculations

- 180 frames at 480p: $0.018
- 180 frames at 720p: $0.027
- 180 frames at 1080p: $0.036
- 240 frames at 720p: $0.036

## Conclusion

The LTX Video LoRA Multi-conditioning model offers powerful capabilities for creating sophisticated videos with precise control over visual elements. By understanding the conditioning system, optimizing prompts, and managing costs effectively, you can create high-quality video content for various applications.

For more information about the fal.ai platform and available models, visit the [fal.ai documentation](https://fal.ai/docs).
