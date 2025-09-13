# Framepack F1 Usage Guide

## Overview

The **Framepack F1** model (`fal-ai/framepack/f1`) is an efficient Image-to-video model that autoregressively generates videos with configurable quality and duration. This model is perfect for content creators, marketers, and developers who need to transform static images into dynamic video content with precise control over output parameters.

## Key Features

- **Autoregressive Video Generation**: Advanced frame-by-frame generation for smooth motion
- **Image-to-Video Transformation**: Convert any static image into dynamic video content
- **Configurable Quality**: Choose between 480p (cost-effective) and 720p (high-quality) outputs
- **Flexible Aspect Ratios**: Support for 16:9 (landscape) and 9:16 (portrait) formats
- **Frame Count Control**: Generate videos from 1 to 1000 frames for precise duration control
- **Safety Integration**: Built-in safety checker for content moderation
- **Seed Control**: Reproducible results with seed values
- **Cost-Effective**: Per-compute-second pricing model

## Basic Usage

### Simple Video Generation

```typescript
import { FramepackF1Executor } from './executors/framepack-f1';

const executor = new FramepackF1Executor();

// Basic usage with default settings
const result = await executor.generateVideo({
  prompt: 'A mesmerizing video of a deep sea jellyfish moving through an inky-black ocean. The jellyfish glows softly with an amber bioluminescence. The overall scene is lifelike.',
  image_url: 'https://storage.googleapis.com/falserverless/framepack/framepack.jpg'
});

console.log('Generated video:', result.video.url);
console.log('Seed used:', result.seed);
```

### Customized Video Generation

```typescript
// Advanced usage with custom settings
const result = await executor.generateVideo({
  prompt: 'A majestic eagle soaring through a clear blue sky, wings spread wide, catching thermal updrafts. The bird glides gracefully over mountain peaks.',
  image_url: 'eagle_image.jpg',
  aspect_ratio: '16:9',
  resolution: '720p',
  num_frames: 240,
  negative_prompt: 'Ugly, blurry, distorted, bad quality',
  cfg_scale: 1.2,
  guidance_scale: 12,
  enable_safety_checker: true
});
```

## Input Parameters

### Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `prompt` | `string` | Text prompt for video generation (max 500 characters) |
| `image_url` | `string` | URL of the image input |

### Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `negative_prompt` | `string` | `''` | Negative prompt for video generation |
| `seed` | `number` | `undefined` | The seed to use for generating the video (0-2147483647) |
| `aspect_ratio` | `string` | `'16:9'` | The aspect ratio of the video to generate |
| `resolution` | `string` | `'480p'` | The resolution of the video to generate |
| `cfg_scale` | `number` | `1` | Classifier-Free Guidance scale (0-20) |
| `guidance_scale` | `number` | `10` | Guidance scale for the generation (0-20) |
| `num_frames` | `number` | `180` | The number of frames to generate (1-1000) |
| `enable_safety_checker` | `boolean` | `true` | Enable safety checker for content moderation |

## Aspect Ratios

The model supports two aspect ratios for different use cases:

### 16:9 (Widescreen Landscape)
- **Use Case**: Standard video content, landscape videos, cinematic content
- **Best For**: YouTube videos, presentations, landscape scenes, general content
- **Example**: Traditional video content, landscape photography, cinematic scenes

```typescript
const result = await executor.generateVideo({
  prompt: 'A majestic eagle soaring through a clear blue sky',
  image_url: 'eagle_image.jpg',
  aspect_ratio: '16:9'
});
```

### 9:16 (Portrait Vertical)
- **Use Case**: Mobile content, social media stories, vertical videos
- **Best For**: Instagram stories, TikTok videos, mobile-first content, social media
- **Example**: Mobile-optimized content, social media stories, portrait scenes

```typescript
const result = await executor.generateVideo({
  prompt: 'A cozy coffee shop interior with warm lighting',
  image_url: 'coffee_shop.jpg',
  aspect_ratio: '9:16'
});
```

## Resolution Options

### 480p (Standard Definition)
- **Cost Multiplier**: 1.0x (base cost)
- **Use Case**: Cost-effective generation, previews, testing
- **Best For**: Quick iterations, cost optimization, preview content
- **Processing Time**: ~2-4 minutes

```typescript
const result = await executor.generateVideo({
  prompt: 'A beautiful sunset over the ocean',
  image_url: 'sunset_image.jpg',
  resolution: '480p'
});
```

### 720p (High Definition)
- **Cost Multiplier**: 1.5x (50% more expensive)
- **Use Case**: Professional quality, final output, high-quality content
- **Best For**: Final production, professional use, high-quality delivery
- **Processing Time**: ~3-6 minutes

```typescript
const result = await executor.generateVideo({
  prompt: 'A professional product demonstration',
  image_url: 'product_image.jpg',
  resolution: '720p'
});
```

## Frame Count Options

### Short Videos (60-120 frames)
- **60 frames**: 2 seconds - Quick previews, social media clips, testing
- **120 frames**: 4 seconds - Standard content, demonstrations, social media

```typescript
// Quick preview
const result = await executor.generateVideo({
  prompt: 'A quick preview of the scene',
  image_url: 'scene_image.jpg',
  num_frames: 60
});
```

### Standard Videos (180-240 frames)
- **180 frames**: 6 seconds - Default setting, balanced content, general use
- **240 frames**: 8 seconds - Extended content, detailed scenes, storytelling

```typescript
// Standard content
const result = await executor.generateVideo({
  prompt: 'A detailed scene with natural movement',
  image_url: 'scene_image.jpg',
  num_frames: 180
});
```

### Extended Videos (300+ frames)
- **300 frames**: 10 seconds - Comprehensive scenes, storytelling, detailed content

```typescript
// Extended storytelling
const result = await executor.generateVideo({
  prompt: 'A comprehensive scene with extended movement',
  image_url: 'scene_image.jpg',
  num_frames: 300
});
```

## Guidance and Control Parameters

### CFG Scale (Classifier-Free Guidance)
- **Range**: 0-20
- **Default**: 1
- **Effect**: Controls how closely the generation follows the prompt
- **Lower values**: More creative, less prompt-adherent
- **Higher values**: More prompt-adherent, less creative

```typescript
const result = await executor.generateVideo({
  prompt: 'A precise scene description',
  image_url: 'scene_image.jpg',
  cfg_scale: 1.5 // More prompt-adherent
});
```

### Guidance Scale
- **Range**: 0-20
- **Default**: 10
- **Effect**: Controls the overall quality and adherence to the prompt
- **Lower values**: Lower quality, more creative
- **Higher values**: Higher quality, more controlled

```typescript
const result = await executor.generateVideo({
  prompt: 'A high-quality scene',
  image_url: 'scene_image.jpg',
  guidance_scale: 15 // Higher quality output
});
```

## Asynchronous Processing

For longer videos or when you need to handle multiple requests, use the queue system:

```typescript
// Submit to queue
const { requestId, status } = await executor.generateVideoAsync({
  prompt: 'A complex scene requiring extended processing',
  image_url: 'complex_scene.jpg',
  resolution: '720p',
  num_frames: 300
});

console.log('Request submitted:', requestId);

// Check status
const statusInfo = await executor.checkStatus(requestId);
console.log('Current status:', statusInfo.status);

// Get result when ready
const result = await executor.getResult(requestId);
console.log('Video generated:', result.video.url);
```

### Webhook Support

You can also use webhooks for automatic result delivery:

```typescript
const { requestId, status } = await executor.generateVideoAsync({
  prompt: 'A scene with webhook delivery',
  image_url: 'scene_image.jpg'
}, 'https://your-webhook-url.com/webhook');
```

## Cost Calculation

The model uses a per-compute-second pricing model:

```typescript
// Calculate cost for different configurations
const costComparison = executor.getCostComparison();

costComparison.forEach(({ resolution, frames, estimatedCost, duration }) => {
  console.log(`${resolution} ${frames}f: $${estimatedCost.toFixed(2)} (${duration})`);
});
```

**Cost Examples:**
- 480p, 180 frames: ~$0.20 (6 seconds)
- 720p, 180 frames: ~$0.30 (6 seconds)
- 480p, 300 frames: ~$0.33 (10 seconds)
- 720p, 300 frames: ~$0.50 (10 seconds)

## Use Case Examples

### Content Creation
```typescript
const contentSettings = executor.getOptimalSettings('content_creation');
// Returns: { resolution: '720p', num_frames: 180, aspect_ratio: '16:9' }

const result = await executor.generateVideo({
  prompt: 'A professional content piece',
  image_url: 'content_image.jpg',
  ...contentSettings
});
```

### Social Media
```typescript
const socialMediaSettings = executor.getOptimalSettings('social_media');
// Returns: { resolution: '720p', num_frames: 120, aspect_ratio: '9:16' }

const result = await executor.generateVideo({
  prompt: 'A social media optimized scene',
  image_url: 'social_image.jpg',
  ...socialMediaSettings
});
```

### Cost-Effective Generation
```typescript
const costEffectiveSettings = executor.getOptimalSettings('cost_effective');
// Returns: { resolution: '480p', num_frames: 120, aspect_ratio: '16:9' }

const result = await executor.generateVideo({
  prompt: 'A cost-effective preview',
  image_url: 'preview_image.jpg',
  ...costEffectiveSettings
});
```

## Best Practices

### Prompt Optimization
- **Keep prompts under 500 characters** for optimal performance
- **Use descriptive, vivid language** for better video quality
- **Include specific details about motion and movement**
- **Mention lighting and atmosphere** for enhanced realism
- **Avoid overly complex or contradictory descriptions**
- **Use positive, clear language** rather than negative statements

### Image Selection
- **Choose high-quality input images** for best results
- **Consider the relationship between your image and prompt**
- **Use images with clear subjects and good composition**
- **Avoid images with excessive noise or compression artifacts**

### Quality vs. Cost Optimization
- **Start with 480p for testing and iteration**
- **Use 720p for final production content**
- **Choose frame count based on content complexity and duration needs**
- **Consider using lower frame counts for quick previews**

### Parameter Tuning
- **Start with default values** and adjust based on results
- **Use CFG scale 1-2 for creative content, 1.5+ for precise adherence**
- **Adjust guidance scale based on quality requirements**
- **Test different seeds for variety in results**

## Error Handling

The executor provides comprehensive error handling:

```typescript
try {
  const result = await executor.generateVideo({
    prompt: 'A beautiful scene',
    image_url: 'scene_image.jpg'
  });
} catch (error) {
  if (error.code === 'EXECUTION_ERROR') {
    console.error('Execution failed:', error.error);
    console.error('Details:', error.details);
  } else {
    console.error('Unknown error:', error.error);
  }
}
```

## Input Validation

Validate inputs before processing:

```typescript
const input = {
  prompt: 'A beautiful scene',
  image_url: 'scene_image.jpg',
  num_frames: 1500, // Invalid: exceeds maximum
  resolution: '1080p' // Invalid: not supported
};

const validation = executor.validateInput(input);
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
  return;
}
```

## Performance Optimization

### Processing Speed
- Use 480p resolution for faster processing
- Choose appropriate frame counts for your needs
- Consider using shorter clips for testing and iteration

### Cost Optimization
- Start with 480p for testing
- Use appropriate frame counts for your use case
- Consider the cost implications of 720p resolution

### Quality Optimization
- Test with shorter clips first to optimize settings
- Use higher resolution settings for professional content
- Consider the target platform's requirements

## Troubleshooting

### Common Issues

**Poor Video Quality**
- Check input image quality and resolution
- Ensure prompt is clear and descriptive
- Try different CFG and guidance scale values
- Consider using 720p resolution for better quality

**Long Processing Times**
- Reduce resolution to 480p
- Use lower frame counts
- Check input image size and complexity
- Consider using the queue system for long videos

**Prompt Not Followed**
- Increase CFG scale for better prompt adherence
- Use more specific and descriptive language
- Avoid contradictory descriptions
- Consider the relationship between image and prompt

**Cost Issues**
- Use 480p resolution for cost optimization
- Reduce frame count for shorter videos
- Start with lower quality settings for testing
- Monitor compute time for cost estimation

### Getting Help

- Check the model's capabilities and limitations
- Validate all input parameters
- Test with smaller configurations first
- Review error messages and validation results
- Use the cost comparison tools for planning

## API Reference

### Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `generateVideo(input)` | Generate video synchronously | `Promise<FramepackF1Output>` |
| `generateVideoAsync(input, webhookUrl?)` | Submit to queue for async processing | `Promise<{requestId, status}>` |
| `checkStatus(requestId)` | Check queue status | `Promise<{status, logs}>` |
| `getResult(requestId)` | Get result from queue | `Promise<FramepackF1Output>` |
| `calculateCost(resolution, numFrames)` | Calculate processing cost | `number` |
| `validateInput(input)` | Validate input parameters | `{isValid, errors}` |

### Helper Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `getAvailableAspectRatios()` | Get all available aspect ratios | `Array<{value, description, useCase}>` |
| `getAvailableResolutions()` | Get resolution options with cost info | `Array<{value, description, costMultiplier, useCase}>` |
| `getAvailableFrameCounts()` | Get frame count options with duration | `Array<{value, description, duration, useCase}>` |
| `getModelInfo()` | Get model information | `{name, version, description, capabilities}` |
| `getOptimalSettings(useCase)` | Get recommended settings for use case | `Partial<FramepackF1Input>` |
| `getCostComparison()` | Compare costs for different configurations | `Array<{resolution, frames, estimatedCost, duration}>` |
| `getRecommendedSettingsForImage(imageType)` | Get settings based on image type | `Partial<FramepackF1Input>` |
| `getPromptOptimizationTips()` | Get prompt optimization tips | `string[]` |
| `getNegativePromptSuggestions()` | Get negative prompt suggestions | `string[]` |
| `getExamplePrompts()` | Get example prompts by category | `Array<{prompt, category, description}>` |
| `getSupportedImageFormats()` | Get supported image formats | `string[]` |
| `getVideoOutputInfo()` | Get video output information | `{format, codec, quality, compatibility}` |

## Conclusion

The Framepack F1 model provides powerful and efficient image-to-video generation capabilities with flexible configuration options. By following the best practices outlined in this guide and choosing appropriate settings for your use case, you can create high-quality, dynamic videos efficiently and cost-effectively.

For more information about the model's capabilities and integration options, refer to the registry JSON file and the executor implementation.
