# Fal AI Decart Lucy 5b Image-to-Video Usage Guide

## Overview

The **Fal AI Decart Lucy 5b Image-to-Video** model (`fal-ai/decart/lucy-5b/image-to-video`) is an advanced AI model specialized in generating high-quality video clips from images using the Decart Lucy 5b architecture. This model excels at creating dynamic, engaging videos by combining descriptive text prompts with image input, offering multiple artistic styles, camera movements, and flexible output options.

The model offers cost-effective pricing that scales with resolution and duration: $0.15 for 360p/540p, $0.20 for 720p, and $0.40 for 1080p. 8-second videos cost double the base price.

## Key Features

- **Image-to-Video Generation**: Convert static images into dynamic video content
- **Multiple Artistic Styles**: Support for anime, 3D animation, clay, comic, and cyberpunk styles
- **Camera Movement Control**: 20 different camera movement options for dynamic video effects
- **Flexible Output Options**: Multiple aspect ratios (16:9, 4:3, 1:1, 3:4, 9:16) and resolutions (360p, 540p, 720p, 1080p)
- **Duration Control**: 5-second and 8-second video options with pricing implications
- **Cost Optimization**: Resolution-based pricing with duration multipliers
- **Queue Management**: Asynchronous processing for long-running requests
- **Real-time Logs**: Progress monitoring during video generation
- **Webhook Support**: Production-ready callback integration

## Input Parameters

### Required Parameters

- **`prompt`** (string, 1-2000 chars): Text description of the video content to generate from the image
- **`image_url`** (string): URL of the image to use as the first frame for video generation

### Optional Parameters

- **`aspect_ratio`** (enum): Video aspect ratio - `16:9`, `4:3`, `1:1`, `3:4`, `9:16` (default: `16:9`)
- **`resolution`** (enum): Video resolution - `360p`, `540p`, `720p`, `1080p` (default: `720p`)
- **`duration`** (enum): Video duration - `5`, `8` seconds (default: `5`)
- **`negative_prompt`** (string, max 2000 chars): Text describing elements to avoid in the video
- **`style`** (enum): Artistic style - `anime`, `3d_animation`, `clay`, `comic`, `cyberpunk`
- **`camera_movement`** (enum): Camera movement effect - 20 different options available
- **`seed`** (integer, 0-999999): Random seed for reproducible results

## Pricing Structure

| Resolution | 5s Video | 8s Video |
|------------|-----------|-----------|
| 360p       | $0.15     | $0.30     |
| 540p       | $0.15     | $0.30     |
| 720p       | $0.20     | $0.40     |
| 1080p      | $0.40     | $0.80     |

**Note**: 8-second videos cost double the base price for each resolution.

## Usage Examples

### Basic Image-to-Video Generation

```typescript
import { FalAiDecartLucy5bImageToVideoExecutor } from './executors/fal-ai-decart-lucy-5b-image-to-video';

const executor = new FalAiDecartLucy5bImageToVideoExecutor('YOUR_API_KEY');

const input = {
  prompt: "A woman warrior with her hammer walking with her glacier wolf",
  image_url: "https://example.com/warrior.png",
  aspect_ratio: "16:9",
  resolution: "720p",
  duration: "5",
  style: "anime",
  camera_movement: "zoom_in"
};

try {
  const result = await executor.generateVideo(input);
  console.log('Generated video URL:', result.video.url);
} catch (error) {
  console.error('Error generating video:', error);
}
```

### Queue-Based Processing for Long-Running Requests

```typescript
// Submit request to queue
const { request_id } = await executor.submitImageToVideoRequest(input, 'https://your-webhook.com/callback');

// Check status periodically
const status = await executor.checkRequestStatus(request_id);
console.log('Request status:', status.status);

// Get result when completed
if (status.status === 'COMPLETED') {
  const result = await executor.getRequestResult(request_id);
  console.log('Video generated:', result.video.url);
}
```

### Cost Calculation

```typescript
// Calculate cost for different configurations
const cost5s720p = executor.calculateCost('720p', '5'); // $0.20
const cost8s1080p = executor.calculateCost('1080p', '8'); // $0.80

console.log(`5s 720p video: $${cost5s720p}`);
console.log(`8s 1080p video: $${cost8s1080p}`);
```

### Style Variations

```typescript
// Generate video with different styles
const styles = ['anime', '3d_animation', 'clay', 'comic', 'cyberpunk'];

for (const style of styles) {
  const input = {
    prompt: "A majestic dragon flying over mountains",
    image_url: "https://example.com/dragon.png",
    style: style as any,
    resolution: "720p"
  };
  
  try {
    const result = await executor.generateVideo(input);
    console.log(`${style} style video:`, result.video.url);
  } catch (error) {
    console.error(`Error with ${style} style:`, error);
  }
}
```

### Camera Movement Effects

```typescript
// Apply different camera movements
const movements = ['zoom_in', 'pan_left', 'crane_up', 'whip_pan'];

for (const movement of movements) {
  const input = {
    prompt: "A cityscape with flowing traffic",
    image_url: "https://example.com/city.png",
    camera_movement: movement as any,
    resolution: "720p"
  };
  
  try {
    const result = await executor.generateVideo(input);
    console.log(`${movement} movement video:`, result.video.url);
  } catch (error) {
    console.error(`Error with ${movement} movement:`, error);
  }
}
```

## Best Practices

### Prompt Engineering
- Use clear, descriptive prompts that complement the image content
- Include specific details about desired video elements
- Use negative prompts to avoid unwanted artifacts
- Keep prompts under 2000 characters for optimal performance

### Image Selection
- Choose high-quality images with clear subjects
- Ensure images match your desired aspect ratio
- Avoid overly complex images that may slow processing
- Use images that complement your text prompt

### Cost Optimization
- Start with 720p resolution for good quality/cost balance
- Use 5-second duration unless longer videos are essential
- Consider 360p/540p for rapid prototyping
- Reserve 1080p for final production content

### Performance Tips
- Use queue-based processing for production applications
- Implement webhooks for automated result handling
- Monitor logs for debugging and progress tracking
- Set seeds for reproducible results when needed

## Common Use Cases

### Content Creation
- **Social Media**: Create engaging video content from product photos
- **Marketing**: Generate promotional videos from brand images
- **Education**: Animate diagrams and infographics
- **Entertainment**: Create animated content from artwork

### Business Applications
- **E-commerce**: Showcase products in motion
- **Real Estate**: Create virtual tours from property photos
- **Training**: Animate instructional materials
- **Presentations**: Add motion to static slides

### Creative Projects
- **Portfolio**: Animate artwork and designs
- **Storytelling**: Bring illustrations to life
- **Music Videos**: Create visual content from album art
- **Gaming**: Animate character concepts and environments

## Technical Considerations

### API Limits
- Maximum prompt length: 2000 characters
- Supported image formats: PNG, JPG, and other common formats
- Seed range: 0 to 999999
- Processing time: Typically 1-5 minutes

### Error Handling
- Implement proper error handling for API failures
- Validate input parameters before submission
- Handle rate limiting and quota exceeded errors
- Provide user feedback during long processing times

### Security
- Never expose API keys in client-side code
- Use server-side proxies for production applications
- Validate and sanitize user inputs
- Implement proper authentication and authorization

## Advanced Features

### Camera Movement Options
The model supports 20 different camera movements:
- **Basic Movements**: `horizontal_left`, `horizontal_right`, `vertical_up`, `vertical_down`
- **Zoom Effects**: `zoom_in`, `zoom_out`, `quickly_zoom_in`, `quickly_zoom_out`, `smooth_zoom_in`
- **Cinematic Effects**: `crane_up`, `camera_rotation`, `robo_arm`, `super_dolly_out`
- **Dynamic Shots**: `whip_pan`, `hitchcock`, `left_follow`, `right_follow`
- **Panning**: `pan_left`, `pan_right`
- **Static**: `fix_bg` (no camera movement)

### Style Control
- **Anime**: Japanese animation style with vibrant colors
- **3D Animation**: Three-dimensional computer graphics
- **Clay**: Stop-motion clay animation aesthetic
- **Comic**: Comic book and graphic novel style
- **Cyberpunk**: Futuristic, high-tech aesthetic

### Aspect Ratio Optimization
- **16:9**: Standard widescreen for most platforms
- **4:3**: Traditional television format
- **1:1**: Square format for social media
- **3:4**: Portrait orientation for mobile
- **9:16**: Vertical video for stories and reels

## Performance Optimization

### Request Management
- Use appropriate resolution for your use case
- Implement retry logic for failed requests
- Batch similar requests when possible
- Monitor API usage and costs

### Caching Strategy
- Cache generated videos when appropriate
- Store metadata for reuse
- Implement CDN for video delivery
- Use local storage for development

### Quality vs. Speed
- Lower resolutions for rapid prototyping
- Higher resolutions for final production
- Balance quality requirements with cost constraints
- Consider user experience and loading times

## Troubleshooting

### Common Issues

**"Image URL is required"**
- Ensure the `image_url` parameter is provided
- Verify the URL is accessible and valid
- Check for proper URL encoding

**"Prompt must be 2000 characters or less"**
- Truncate long prompts to fit within limits
- Focus on essential descriptive elements
- Use abbreviations where appropriate

**"Seed must be between 0 and 999999"**
- Ensure seed values are within the valid range
- Use positive integers only
- Consider using random seeds for variety

**Processing Timeouts**
- Use queue-based processing for long operations
- Implement proper timeout handling
- Monitor request status regularly
- Consider using webhooks for completion notifications

### Debugging Tips
- Enable logging to monitor progress
- Check API response codes and messages
- Validate input parameters before submission
- Test with simple inputs first
- Monitor API quotas and rate limits

## Integration Examples

### Next.js Integration

```typescript
// pages/api/generate-video.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { FalAiDecartLucy5bImageToVideoExecutor } from '../../../executors/fal-ai-decart-lucy-5b-image-to-video';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { prompt, image_url, ...options } = req.body;
    
    const executor = new FalAiDecartLucy5bImageToVideoExecutor(process.env.FAL_KEY!);
    
    const result = await executor.generateVideo({
      prompt,
      image_url,
      ...options
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### React Component

```typescript
// components/VideoGenerator.tsx
import React, { useState } from 'react';
import { FalAiDecartLucy5bImageToVideoExecutor } from '../executors/fal-ai-decart-lucy-5b-image-to-video';

export const VideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const executor = new FalAiDecartLucy5bImageToVideoExecutor(process.env.REACT_APP_FAL_KEY!);
      
      const videoResult = await executor.generateVideo({
        prompt,
        image_url: imageUrl,
        resolution: '720p',
        style: 'anime'
      });
      
      setResult(videoResult.video.url);
    } catch (error) {
      console.error('Error generating video:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter image URL..."
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Video'}
      </button>
      {result && (
        <video controls>
          <source src={result} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};
```

## Conclusion

The Fal AI Decart Lucy 5b Image-to-Video model provides a powerful and flexible solution for converting static images into dynamic video content. With its comprehensive feature set, including multiple styles, camera movements, and output options, it's well-suited for a wide range of creative and business applications.

By following the best practices outlined in this guide and leveraging the model's advanced features, you can create engaging, high-quality video content efficiently and cost-effectively. The queue-based processing and webhook support make it suitable for both development and production environments.

For more information about the Fal AI platform and additional models, visit the [Fal AI documentation](https://fal.ai/docs).
