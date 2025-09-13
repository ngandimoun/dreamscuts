# Wan Pro Image-to-Video - Usage Guide

## Overview

The Wan Pro is a premium image-to-video model that generates high-quality 1080p videos at 30fps with up to 6 seconds duration. This model delivers exceptional visual quality and motion diversity from images, making it ideal for professional video production and creative content creation.

## Model Information

- **Name**: Wan Pro
- **Version**: v2.1
- **Provider**: fal-ai
- **Model ID**: `fal-ai/wan-pro/image-to-video`
- **Type**: Video Generation (Image-to-Video)
- **Quality Tier**: Pro (Premium)

## Key Features

- **High-Quality Output**: 1080p resolution at 30fps for professional-grade videos
- **Fixed Duration**: 6-second video generation with consistent quality
- **Motion Diversity**: Exceptional motion understanding and generation capabilities
- **Safety Features**: Built-in safety checker for content moderation
- **Seed Control**: Reproducible results with seed parameter support
- **Premium Quality**: Pro-tier model with superior visual output

## Pricing

- **Cost per video**: $0.80
- **Duration**: Fixed 6 seconds
- **Quality**: 1080p at 30fps
- **Billing**: Per video (no additional charges)

## Installation

1. Install the FAL AI client:
```bash
npm install --save @fal-ai/client
```

2. Set your API key:
```bash
export FAL_KEY="YOUR_API_KEY"
```

3. Import the executor:
```typescript
import { createWanProImageToVideoExecutor } from './executors/wan-pro-image-to-video';
```

## Basic Usage

### Simple Video Generation

```typescript
import { createWanProImageToVideoExecutor } from './executors/wan-pro-image-to-video';

const executor = createWanProImageToVideoExecutor(process.env.FAL_KEY);

const result = await executor.generateVideo({
  prompt: "A stylish woman walks down a Tokyo street filled with warm glowing neon and animated city signage.",
  image_url: "https://example.com/source-image.jpg"
});

console.log(result.video.url);
```

### Advanced Configuration with Seed Control

```typescript
const result = await executor.generateVideo({
  prompt: "Cinematic scene with dramatic camera movement and atmospheric lighting",
  image_url: "https://example.com/character.jpg",
  seed: 12345,
  enable_safety_checker: true
});
```

## Asynchronous Processing

For long-running requests, use the queue system:

```typescript
// Submit to queue
const { requestId } = await executor.queueVideoGeneration({
  prompt: "Epic battle scene with dynamic motion and dramatic lighting",
  image_url: "https://example.com/battle-scene.jpg"
});

// Check status
const status = await executor.checkQueueStatus(requestId);

// Get result when complete
const result = await executor.getQueueResult(requestId);
```

## Input Parameters

### Required Parameters

- **prompt** (string): Text description of desired motion and scene
- **image_url** (string): URL of input image to animate

### Optional Parameters

- **seed** (integer): Random seed for reproducibility (0 to 2147483647)
- **enable_safety_checker** (boolean): Whether to enable the safety checker (default: true)

## Output Format

```typescript
interface WanProImageToVideoOutput {
  video: {
    url: string;           // Download URL for the generated video
    content_type?: string; // MIME type (video/mp4)
    file_name?: string;    // Generated filename
    file_size?: number;    // File size in bytes
  };
  requestId?: string;      // Request identifier
}
```

## Best Practices

### 1. Image Quality
- Use high-resolution source images (minimum 1080p recommended)
- Ensure good lighting and clear subjects
- Avoid blurry or low-quality input images
- Choose images with strong visual composition

### 2. Prompt Engineering
- Use descriptive, action-oriented language
- Be specific about motion and camera movements
- Include context about the scene and atmosphere
- Describe the desired mood and style

### 3. Parameter Optimization
- Use seed values for reproducible results when needed
- Keep safety checker enabled for content moderation
- Test different prompts to find optimal results
- Consider the 6-second duration limitation in your planning

### 4. Cost Optimization
- Plan your video generation needs in advance
- Batch multiple requests when possible
- Use the queue system for multiple generations
- Monitor usage to stay within budget

## Error Handling

```typescript
try {
  const result = await executor.generateVideo(input);
  // Handle success
} catch (error) {
  if (error.message.includes('API key')) {
    // Handle authentication errors
  } else if (error.message.includes('image_url')) {
    // Handle invalid image URL
  } else if (error.message.includes('seed')) {
    // Handle invalid seed value
  } else {
    // Handle other errors
    console.error('Video generation failed:', error.message);
  }
}
```

## Common Use Cases

### 1. Professional Video Production
- Transform product photos into engaging videos
- Create marketing materials with motion
- Generate promotional content from still images
- Produce professional demonstrations

### 2. Creative Content Creation
- Bring portraits to life with subtle movements
- Create animated scenes from landscape photos
- Generate character animations for storytelling
- Produce atmospheric videos from architectural shots

### 3. Social Media and Marketing
- Create engaging social media content
- Transform product images into video ads
- Generate brand storytelling videos
- Produce content for digital campaigns

## Performance Considerations

- **Processing Time**: 6-second videos typically take 2-5 minutes
- **Image Size**: Larger images may increase processing time
- **Queue Management**: Use async processing for multiple requests
- **Rate Limits**: Check fal-ai documentation for current limits

## Troubleshooting

### Common Issues

1. **Poor Quality Output**
   - Ensure high-quality input images
   - Write more descriptive prompts
   - Check image resolution and clarity

2. **Motion Not Natural**
   - Refine prompt descriptions
   - Use action-oriented language
   - Consider different input images

3. **API Errors**
   - Verify API key is valid
   - Check input format requirements
   - Ensure image URLs are accessible

### Optimization Tips

- **Prompt Engineering**: Use cinematic language and specific motion descriptions
- **Image Selection**: Choose images with clear subjects and good composition
- **Seed Management**: Use consistent seeds for similar content types
- **Safety Features**: Keep safety checker enabled for professional use

## Integration Examples

### React Component

```typescript
import React, { useState } from 'react';
import { createWanProImageToVideoExecutor } from './executors/wan-pro-image-to-video';

const WanProVideoGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const generateVideo = async (prompt: string, imageUrl: string) => {
    setLoading(true);
    try {
      const executor = createWanProImageToVideoExecutor(process.env.REACT_APP_FAL_KEY);
      const result = await executor.generateVideo({
        prompt,
        image_url: imageUrl,
        enable_safety_checker: true
      });
      setVideoUrl(result.video.url);
    } catch (error) {
      console.error('Video generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Your UI components */}
    </div>
  );
};
```

### Node.js API

```typescript
import express from 'express';
import { createWanProImageToVideoExecutor } from './executors/wan-pro-image-to-video';

const app = express();
app.use(express.json());

app.post('/generate-wan-pro-video', async (req, res) => {
  try {
    const { prompt, image_url, seed, enable_safety_checker } = req.body;
    
    const executor = createWanProImageToVideoExecutor(process.env.FAL_KEY);
    const result = await executor.generateVideo({
      prompt,
      image_url,
      seed: seed || undefined,
      enable_safety_checker: enable_safety_checker !== false
    });

    res.json({ success: true, video: result.video });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
```

### Cost Calculation

```typescript
const executor = createWanProImageToVideoExecutor(process.env.FAL_KEY);

// Calculate cost for multiple videos
const numberOfVideos = 10;
const totalCost = executor.calculateCost() * numberOfVideos;
console.log(`Total cost for ${numberOfVideos} videos: $${totalCost.toFixed(2)}`);
```

## Comparison with Other Models

### Wan Pro vs Kling Video v2 Master

| Feature | Wan Pro | Kling Video v2 Master |
|---------|---------|----------------------|
| **Duration** | Fixed 6 seconds | 5 or 10 seconds |
| **Resolution** | 1080p at 30fps | Variable |
| **Cost** | $0.80 per video | $1.40 (5s) / $2.80 (10s) |
| **Quality Tier** | Pro | Master |
| **Safety Features** | Built-in checker | Not specified |
| **Seed Control** | Yes | No |

### When to Use Wan Pro

- **Fixed Duration Needs**: When you specifically need 6-second videos
- **Cost Efficiency**: For budget-conscious projects requiring high quality
- **Safety Requirements**: When content moderation is important
- **Reproducibility**: When you need consistent results with seed control
- **Professional Output**: For marketing and commercial applications

## Support and Resources

- **Documentation**: [FAL AI Documentation](https://fal.ai/docs)
- **API Reference**: [Wan Pro API](https://fal.ai/docs/reference/rest/wan-pro)
- **Community**: [FAL AI Discord](https://discord.gg/fal-ai)
- **Examples**: [GitHub Examples](https://github.com/fal-ai/fal-ai-examples)

## Changelog

### v2.1 (Current)
- Premium image-to-video generation
- 1080p resolution at 30fps
- 6-second duration limit
- Enhanced motion diversity
- Built-in safety checker
- Seed control for reproducibility

### Previous Versions
- Basic image-to-video capabilities
- Standard quality output
- Limited motion control options

## Technical Specifications

- **Model Family**: Wan 2.1
- **Architecture**: Image-to-Video Generation
- **Input Types**: Image + Text
- **Output Format**: MP4
- **Max Duration**: 6 seconds
- **Resolution**: 1080p
- **Frame Rate**: 30fps
- **Quality Tier**: Pro
- **Safety Features**: Built-in checker
- **Seed Control**: Yes
