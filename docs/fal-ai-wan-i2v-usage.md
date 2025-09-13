# Fal AI Wan-i2v Usage Guide

## Overview

**Fal AI Wan-i2v** is a powerful image-to-video generation model that transforms static images into dynamic, engaging video content. Based on the WAN-2.1 architecture, this model excels at creating high-quality videos with exceptional motion diversity and visual quality from single images.

### Key Features

- **High Visual Quality**: Professional-grade video output with excellent detail preservation
- **Motion Diversity**: Natural and varied motion patterns that bring images to life
- **Flexible Resolution**: Support for both 480p and 720p resolutions
- **Customizable Parameters**: Fine-tune generation with multiple configurable options
- **Cost-Effective**: Transparent pricing starting at $0.20 per video
- **Queue System**: Support for long-running requests with webhook notifications

## Model Specifications

- **Model ID**: `fal-ai/wan-i2v`
- **Type**: Image-to-Video Generation
- **Provider**: Fal AI
- **Version**: 2.1
- **Category**: Video Generation

## Input Parameters

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `prompt` | string | Text description of the desired motion | "Cars racing in slow motion" |
| `image_url` | string | URL of the input image | "https://example.com/image.jpg" |

### Optional Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `negative_prompt` | string | Comprehensive default | 0-2000 chars | Elements to avoid in generation |
| `num_frames` | integer | 81 | 81-100 | Number of frames to generate |
| `frames_per_second` | integer | 16 | 5-24 | Video frame rate |
| `seed` | integer | Random | 0-999999 | Random seed for reproducibility |
| `resolution` | string | "720p" | "480p", "720p" | Output video resolution |
| `num_inference_steps` | integer | 30 | 1-100 | Denoising steps for quality |
| `guide_scale` | number | 5.0 | 0.1-20.0 | Prompt adherence strength |
| `shift` | number | 5.0 | 0-10 | Motion control parameter |
| `enable_safety_checker` | boolean | true | true/false | Content safety filtering |
| `enable_prompt_expansion` | boolean | false | true/false | Automatic prompt enhancement |
| `acceleration` | string | "regular" | "none", "regular" | Generation speed vs quality |
| `aspect_ratio` | string | "auto" | "auto", "16:9", "9:16", "1:1" | Video aspect ratio |

## Pricing Structure

### Base Pricing
- **480p Resolution**: $0.20 per video (0.5 billing units)
- **720p Resolution**: $0.40 per video (1 billing unit)

### Frame Multiplier
- **Standard (81 frames)**: Base price
- **Extended (82-100 frames)**: 1.25x billing units

### Cost Examples
- 480p, 81 frames: $0.20
- 720p, 81 frames: $0.40
- 720p, 100 frames: $0.50 (1.25x multiplier)

## Usage Examples

### Basic Usage

```typescript
import { FalAiWanI2vExecutor } from './executors/fal-ai-wan-i2v';

const executor = new FalAiWanI2vExecutor('YOUR_API_KEY');

const result = await executor.generateVideo({
  prompt: "Cars racing in slow motion",
  image_url: "https://storage.googleapis.com/falserverless/gallery/car_720p.png"
});

console.log('Video URL:', result.video.url);
console.log('Seed used:', result.seed);
```

### Advanced Usage with Custom Parameters

```typescript
const result = await executor.generateVideo({
  prompt: "Gentle waves on a calm ocean",
  image_url: "https://example.com/ocean.jpg",
  num_frames: 100,
  frames_per_second: 24,
  resolution: "480p",
  aspect_ratio: "16:9",
  num_inference_steps: 50,
  guide_scale: 7.5,
  shift: 3,
  enable_safety_checker: true,
  enable_prompt_expansion: false,
  acceleration: "regular"
});
```

### Queue-Based Processing

```typescript
// Submit to queue for long-running requests
const { request_id } = await executor.submitVideoGenerationRequest({
  prompt: "Complex scene with multiple elements",
  image_url: "https://example.com/complex-image.jpg"
}, "https://your-webhook.com/callback");

// Check status
const status = await executor.checkRequestStatus(request_id);
console.log('Status:', status.status);

// Get result when complete
const result = await executor.getRequestResult(request_id);
console.log('Video URL:', result.video.url);
```

## Best Practices

### Image Selection
- **Quality**: Use high-resolution, clear images with good lighting
- **Composition**: Choose images with clear subjects and good contrast
- **Format**: Support for JPEG, PNG, and WebP formats
- **Size**: No strict limits, but larger images may be automatically resized

### Prompt Engineering
- **Specificity**: Describe the exact motion you want to see
- **Clarity**: Use clear, descriptive language
- **Motion Details**: Specify speed, direction, and style of movement
- **Context**: Provide context about the scene and desired outcome

### Parameter Optimization
- **Start Simple**: Begin with default parameters and adjust as needed
- **Resolution**: Use 720p for better quality, 480p for cost savings
- **Frame Rate**: Higher FPS for smoother motion, lower for stylized effects
- **Inference Steps**: More steps = better quality but longer generation time

### Error Handling

```typescript
try {
  const result = await executor.generateVideo(input);
  // Process successful result
} catch (error) {
  if (error.code === 'EXECUTION_ERROR') {
    console.error('Generation failed:', error.message);
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

## Common Use Cases

### Social Media Content
- **Instagram Stories**: Create engaging 5-6 second videos from product photos
- **TikTok**: Transform static images into dynamic content
- **YouTube Shorts**: Generate video content from image assets

### E-commerce
- **Product Videos**: Bring product photography to life
- **Marketing**: Create dynamic advertising content
- **Catalogs**: Transform static product images into engaging videos

### Creative Projects
- **Portraits**: Animate portrait photography
- **Landscapes**: Add motion to scenic photography
- **Artwork**: Bring digital art to life

### Business Applications
- **Presentations**: Create dynamic visual content
- **Training**: Generate engaging educational videos
- **Architecture**: Animate architectural visualizations

## Technical Considerations

### Performance
- **Generation Time**: Approximately 1 minute per video
- **Queue System**: Use for batch processing or long-running requests
- **Real-time Updates**: Monitor progress with status callbacks
- **Webhook Support**: Get notified when generation completes

### Quality vs Speed
- **Acceleration Levels**: Choose between "none" and "regular"
- **Inference Steps**: Balance between quality and generation time
- **Resolution**: Higher resolution = better quality but higher cost
- **Frame Count**: More frames = longer video but higher cost

### Input Handling
- **Image Processing**: Automatic resizing and aspect ratio adjustment
- **Format Support**: Multiple image formats supported
- **URL Requirements**: Public URLs or base64 data URIs
- **Size Optimization**: Consider image dimensions for best results

## Advanced Features

### Safety Checker
- **Content Moderation**: Automatic filtering of inappropriate content
- **Configurable**: Enable/disable as needed
- **Quality Assurance**: Ensures output meets content guidelines

### Prompt Expansion
- **Automatic Enhancement**: AI-powered prompt improvement
- **Context Addition**: Adds relevant details to your prompts
- **Quality Improvement**: Can enhance generation results

### Seed Control
- **Reproducibility**: Consistent results with same seed
- **Variation Control**: Different seeds for different outputs
- **Debugging**: Useful for testing and iteration

### Negative Prompting
- **Quality Enhancement**: Comprehensive default negative prompt
- **Custom Control**: Specify elements to avoid
- **Style Control**: Influence the overall aesthetic

## Integration Examples

### Node.js/TypeScript

```typescript
import { FalAiWanI2vExecutor } from './executors/fal-ai-wan-i2v';

class VideoGenerator {
  private executor: FalAiWanI2vExecutor;

  constructor(apiKey: string) {
    this.executor = new FalAiWanI2vExecutor(apiKey);
  }

  async generateProductVideo(imageUrl: string, motionDescription: string) {
    try {
      const result = await this.executor.generateVideo({
        prompt: motionDescription,
        image_url: imageUrl,
        resolution: "720p",
        num_frames: 81
      });

      return {
        success: true,
        videoUrl: result.video.url,
        cost: this.executor.calculateCost("720p", 81)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
```

### React Component

```typescript
import React, { useState } from 'react';
import { FalAiWanI2vExecutor } from './executors/fal-ai-wan-i2v';

const VideoGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const generateVideo = async (imageUrl: string, prompt: string) => {
    setIsGenerating(true);
    
    try {
      const executor = new FalAiWanI2vExecutor(process.env.REACT_APP_FAL_KEY!);
      const result = await executor.generateVideo({
        prompt,
        image_url: imageUrl
      });
      
      setVideoUrl(result.video.url);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      {/* Component implementation */}
    </div>
  );
};
```

## Troubleshooting

### Common Issues

#### Generation Fails
- **Check API Key**: Ensure your FAL_KEY is valid and has sufficient credits
- **Validate Input**: Verify image URL is accessible and parameters are within ranges
- **Check Limits**: Ensure you haven't exceeded rate limits or quotas

#### Poor Quality Output
- **Image Quality**: Use higher resolution source images
- **Prompt Clarity**: Make motion descriptions more specific
- **Parameters**: Increase inference steps or adjust guide scale
- **Resolution**: Use 720p instead of 480p for better quality

#### Slow Generation
- **Acceleration**: Use "regular" acceleration for faster processing
- **Queue System**: Use queue submission for long-running requests
- **Parameters**: Reduce inference steps for faster generation

#### Cost Optimization
- **Resolution**: Use 480p for cost savings
- **Frame Count**: Stick to 81 frames when possible
- **Batch Processing**: Use queue system for multiple videos

### Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `EXECUTION_ERROR` | Generation process failed | Check input parameters and try again |
| `UNKNOWN_ERROR` | Unexpected system error | Contact support if persistent |
| `VALIDATION_ERROR` | Input parameter validation failed | Review parameter values and ranges |

## Support and Resources

### Documentation
- **API Reference**: [fal.ai/models/fal-ai/wan-i2v/api](https://fal.ai/models/fal-ai/wan-i2v/api)
- **Model Page**: [fal.ai/models/fal-ai/wan-i2v](https://fal.ai/models/fal-ai/wan-i2v)
- **Pricing**: [fal.ai/pricing](https://fal.ai/pricing)

### Support Channels
- **Email**: support@fal.ai
- **Discord**: Join the community for real-time assistance
- **Status Page**: [status.fal.ai](https://status.fal.ai)

### Community
- **Examples**: Browse community-generated content
- **Best Practices**: Learn from other users' experiences
- **Updates**: Stay informed about new features and improvements

## Migration Guide

### From Other Platforms
If you're coming from other AI video generation platforms, Fal AI Wan-i2v offers:

- **Higher Quality**: Better visual quality and motion diversity
- **Faster Processing**: Optimized generation pipeline
- **Better Pricing**: Transparent, usage-based costs
- **Enhanced SDK**: Comprehensive client library support
- **Queue System**: Built-in support for long-running requests

### API Compatibility
The Fal AI client provides a familiar interface:
- **Direct Generation**: `fal.subscribe` for immediate results
- **Queue Management**: `fal.queue.*` methods for batch processing
- **File Handling**: Automatic upload and URL management
- **Webhook Support**: Asynchronous completion notifications

## Conclusion

Fal AI Wan-i2v is a powerful and versatile image-to-video generation model that excels at creating high-quality, engaging video content from static images. With its comprehensive parameter controls, transparent pricing, and robust API, it's an excellent choice for developers and creators looking to add dynamic video generation capabilities to their applications.

Whether you're building social media tools, e-commerce platforms, or creative applications, Wan-i2v provides the tools and flexibility needed to transform static content into engaging video experiences.
