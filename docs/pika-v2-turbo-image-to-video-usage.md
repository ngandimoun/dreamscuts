# Pika v2 Turbo Image-to-Video Usage Guide

## Overview

The **Pika v2 Turbo Image-to-Video** model (`fal-ai/pika/v2/turbo/image-to-video`) is a high-quality AI-powered tool that transforms static images into dynamic videos. This model is optimized for faster generation with a fixed cost structure, making it perfect for content creators, marketers, and businesses looking to bring their images to life efficiently.

## Key Features

- **High-Quality Generation**: Professional-grade image-to-video transformation
- **Turbo Optimization**: Faster generation compared to standard models
- **Fixed Cost Pricing**: $0.20 per video regardless of resolution or duration
- **Resolution Options**: Choose between 720p and 1080p output
- **Professional Output**: Suitable for business and marketing use
- **Prompt Control**: Text prompts guide video generation
- **Negative Prompts**: Avoid unwanted elements with negative prompts
- **Seed Control**: Reproducible results with seed values
- **5-Second Duration**: Optimized for social media and short-form content

## Model Information

- **Model ID**: `fal-ai/pika/v2/turbo/image-to-video`
- **Provider**: Pika (via fal.ai)
- **Input Types**: Image URL + Text prompt
- **Output Format**: MP4 video
- **Pricing**: Fixed $0.20 per video
- **Optimization**: Turbo mode for faster generation

## Basic Usage

### Installation

```bash
npm install --save @fal-ai/client
```

### Setup

```typescript
import { fal } from "@fal-ai/client";

// Set your API key
fal.config({
  credentials: "YOUR_FAL_KEY"
});
```

### Simple Example

```typescript
import { createPikaV2TurboImageToVideoExecutor } from './executors/pika-v2-turbo-image-to-video';

const executor = createPikaV2TurboImageToVideoExecutor("YOUR_API_KEY");

const result = await executor.generateVideo({
  image_url: "https://example.com/portrait.jpg",
  prompt: "a person looking into camera slowly smiling"
});

console.log("Video URL:", result.video.url);
```

## Input Parameters

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `image_url` | string | URL of the image to use as the first frame | `"https://example.com/image.jpg"` |
| `prompt` | string | Text prompt describing the desired video (max 1000 chars) | `"a person slowly smiling"` |

### Optional Parameters

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `resolution` | enum | `"720p"` | Output video resolution | `"1080p"` |
| `duration` | number | `5` | Video duration in seconds | `5` |
| `seed` | number | - | Seed for reproducible results | `12345` |
| `negative_prompt` | string | `""` | Text to avoid unwanted elements | `"blurry, low quality"` |

### Resolution Options

| Resolution | Cost | Best For | Quality |
|------------|------|----------|---------|
| **720p** | $0.20 | Social media, cost-effective projects | High |
| **1080p** | $0.20 | Professional content, marketing materials | Premium |

## Advanced Usage

### Queue Management for Long-Running Requests

```typescript
// Submit to queue
const { requestId } = await executor.queueVideoGeneration({
  image_url: "https://example.com/product.jpg",
  prompt: "product slowly rotating to show all angles",
  resolution: "1080p"
}, "https://your-webhook-url.com/callback");

// Check status
const status = await executor.checkQueueStatus(requestId);
console.log("Status:", status.status);

// Get result when complete
const result = await executor.getQueueResult(requestId);
```

### Batch Generation

```typescript
const inputs = [
  {
    image_url: "https://example.com/portrait1.jpg",
    prompt: "person slowly smiling"
  },
  {
    image_url: "https://example.com/portrait2.jpg",
    prompt: "person looking thoughtful",
    resolution: "1080p"
  },
  {
    image_url: "https://example.com/landscape.jpg",
    prompt: "leaves gently swaying in the breeze"
  }
];

const results = await executor.generateMultipleVideos(inputs);
```

### Cost Calculation

```typescript
// Calculate cost (fixed at $0.20 per video)
const cost = executor.calculateCost(); // $0.20

// Get cost comparison
const comparison = executor.getCostComparison();
console.log("Cost options:", comparison);
```

## Use Case Examples

### 1. Portrait Animation

```typescript
const portraitVideo = await executor.generateVideo({
  image_url: "https://example.com/portrait.jpg",
  prompt: "a person looking into camera slowly smiling with warm lighting",
  resolution: "1080p",
  negative_prompt: "blurry, distorted, multiple people"
});
```

### 2. Product Showcase

```typescript
const productVideo = await executor.generateVideo({
  image_url: "https://example.com/product.jpg",
  prompt: "product slowly rotating to show all angles with dramatic lighting",
  resolution: "1080p",
  negative_prompt: "blurry, low quality, text overlay"
});
```

### 3. Nature Movement

```typescript
const natureVideo = await executor.generateVideo({
  image_url: "https://example.com/landscape.jpg",
  prompt: "leaves gently swaying in the breeze with natural movement",
  resolution: "720p",
  negative_prompt: "fast motion, jittery, artificial"
});
```

### 4. Marketing Content

```typescript
const marketingVideo = await executor.generateVideo({
  image_url: "https://example.com/brand.jpg",
  prompt: "dramatic camera movement around the subject with cinematic lighting",
  resolution: "1080p",
  negative_prompt: "amateur, low quality, distorted"
});
```

## Best Practices

### Prompt Optimization

- **Be Specific**: Describe the exact motion you want to see
- **Use Action Verbs**: "slowly rotating", "gently swaying", "dramatically moving"
- **Include Details**: Mention lighting, atmosphere, and emotional tone
- **Keep Concise**: Stay under 1000 characters for optimal processing
- **Consider Context**: Think about how the prompt relates to the image content

### Resolution Selection

- **720p ($0.20)**: Use for social media, cost-effective projects, standard quality needs
- **1080p ($0.20)**: Use for professional content, marketing materials, high-quality requirements

### Image Preparation

- **High Quality**: Use high-resolution source images for best results
- **Public Access**: Ensure images are publicly accessible via URL
- **Clear Subject**: Images with clear, well-defined subjects work best
- **Good Lighting**: Well-lit images produce better video results

### Negative Prompts

Use negative prompts to avoid common issues:
- `"blurry, low quality, distorted, deformed"`
- `"watermark, text, logo, signature"`
- `"multiple people, crowd, group"`
- `"fast motion, rapid movement, jittery"`

## Cost Optimization

### Pricing Structure

- **Fixed Cost**: $0.20 per video (regardless of resolution or duration)

### Cost-Saving Strategies

- Use 720p for testing and prototyping
- Choose 720p for social media content
- Reserve 1080p for professional projects
- Batch process multiple videos for efficiency
- Take advantage of the fixed pricing regardless of complexity

## Performance Optimization

### Prompt Guidelines

- **Optimal Length**: 50-200 characters for most use cases
- **Specific Language**: Use descriptive, action-oriented language
- **Emotional Context**: Include mood and atmosphere descriptions
- **Motion Description**: Be clear about desired movement type

### Image Guidelines

- **Format**: JPG, PNG, WebP (avoid GIF for source images)
- **Resolution**: Minimum 720p, higher is better
- **Content**: Clear subjects with good contrast
- **Accessibility**: Publicly accessible URLs only

## Troubleshooting

### Common Issues

1. **Image URL Not Accessible**
   - Ensure image is publicly available
   - Upload to public hosting service
   - Check for CORS restrictions

2. **Prompt Too Long**
   - Keep under 1000 characters
   - Simplify and focus on key elements
   - Remove unnecessary details

3. **Invalid Resolution**
   - Use only "720p" or "1080p"
   - Check parameter spelling
   - Use default if unsure

4. **Poor Video Quality**
   - Use higher resolution source images
   - Improve prompt specificity
   - Consider using 1080p output

### Performance Tips

- Start with 720p for testing
- Use clear, descriptive prompts
- Ensure source images are high quality
- Test with simple prompts first
- Use negative prompts to avoid issues

## API Reference

### Methods

- `generateVideo(input)`: Generate video synchronously
- `queueVideoGeneration(input, webhookUrl)`: Submit to queue
- `checkQueueStatus(requestId)`: Check queue status
- `getQueueResult(requestId)`: Get queue result
- `generateMultipleVideos(inputs)`: Batch generation
- `calculateCost()`: Cost calculation (fixed at $0.20)

### Helper Methods

- `getAvailableResolutions()`: List resolution options
- `getAvailableDurations()`: List duration options
- `getModelInfo()`: Get model capabilities
- `getOptimalSettings(useCase)`: Get recommended settings
- `getCostComparison()`: Compare different resolutions
- `getPromptOptimizationTips()`: Get prompt advice
- `getNegativePromptSuggestions()`: Get negative prompt ideas
- `getExamplePrompts()`: Get example prompts by scenario

## Cost Examples

| Resolution | Duration | Cost | Use Case | Best For |
|------------|----------|------|----------|----------|
| 720p | 5 seconds | $0.20 | Social media, testing | Cost-effective projects |
| 1080p | 5 seconds | $0.20 | Professional content | High-quality requirements |

## Support and Resources

- **Documentation**: [Pika v2 Turbo Image-to-Video](https://fal.ai/models/fal-ai/pika/v2/turbo/image-to-video)
- **API Reference**: [fal.ai Client Documentation](https://fal.ai/docs)
- **Examples**: [fal.ai Examples Repository](https://github.com/fal-ai/fal-ai-examples)
- **Community**: [fal.ai Discord](https://discord.gg/fal-ai)

## Conclusion

The Pika v2 Turbo Image-to-Video model provides a powerful and cost-effective solution for transforming static images into dynamic videos. With its fixed pricing structure, turbo optimization for faster generation, and high-quality output, it's ideal for content creators, marketers, and businesses looking to bring their visual content to life efficiently.

By following the best practices outlined in this guide and taking advantage of the fixed cost structure, you can create engaging, professional videos that effectively communicate your message while maintaining quality and managing costs predictably.
