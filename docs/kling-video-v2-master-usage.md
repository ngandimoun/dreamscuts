# Kling Video v2 Master - Usage Guide

## Overview

The Kling Video v2 Master is a professional-grade image-to-video generation model that transforms static images into dynamic, fluid video content. This model excels at creating cinematic-quality videos with natural motion and superior visual quality.

## Model Information

- **Name**: Kling AI v2 Master
- **Version**: v2.0
- **Provider**: fal-ai
- **Model ID**: `fal-ai/kling-video/v2/master/image-to-video`
- **Type**: Video Generation (Image-to-Video)
- **Quality Tier**: Master (Premium)

## Key Features

- **Superior Motion Quality**: Enhanced motion fluidity and natural character movements
- **Advanced Text Understanding**: Better execution of complex sequential shot descriptions
- **Cinematic Output**: Professional-grade video generation with realistic expressions
- **Flexible Duration**: Support for 5-second and 10-second videos
- **Multiple Aspect Ratios**: 16:9, 9:16, and 1:1 support

## Pricing

- **5-second video**: $1.40
- **10-second video**: $2.80
- **Additional seconds**: $0.28 per second

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
import { createKlingVideoV2MasterExecutor } from './executors/kling-video-v2-master';
```

## Basic Usage

### Simple Video Generation

```typescript
import { createKlingVideoV2MasterExecutor } from './executors/kling-video-v2-master';

const executor = createKlingVideoV2MasterExecutor(process.env.FAL_KEY);

const result = await executor.generateVideo({
  prompt: "slow-motion sequence captures the catastrophic implosion of a skyscraper",
  image_url: "https://example.com/source-image.jpg",
  duration: "5"
});

console.log(result.video.url);
```

### Advanced Configuration

```typescript
const result = await executor.generateVideo({
  prompt: "cinematic scene with dramatic camera movement",
  image_url: "https://example.com/character.jpg",
  duration: "10",
  negative_prompt: "blur, low quality, distorted",
  cfg_scale: 0.8
});
```

## Asynchronous Processing

For long-running requests, use the queue system:

```typescript
// Submit to queue
const { requestId } = await executor.queueVideoGeneration({
  prompt: "epic battle scene with dynamic motion",
  image_url: "https://example.com/battle-scene.jpg",
  duration: "10"
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

- **duration** ("5" | "10"): Video duration in seconds (default: "5")
- **negative_prompt** (string): Elements to avoid (default: "blur, distort, and low quality")
- **cfg_scale** (number): Classifier Free Guidance scale (default: 0.5, range: 0.1-2.0)

## Output Format

```typescript
interface KlingVideoV2MasterOutput {
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
- Use high-resolution source images (minimum 720p recommended)
- Ensure good lighting and clear subjects
- Avoid blurry or low-quality input images

### 2. Prompt Engineering
- Use descriptive, cinematic language
- Be specific about motion and camera movements
- Include context about the scene and atmosphere

### 3. Parameter Tuning
- Start with default cfg_scale (0.5) and adjust as needed
- Test different duration settings for your use case
- Use negative prompts to avoid unwanted elements

### 4. Cost Optimization
- Choose appropriate duration for your needs
- Batch multiple requests when possible
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
  } else {
    // Handle other errors
    console.error('Video generation failed:', error.message);
  }
}
```

## Common Use Cases

### 1. Content Creation
- Transform product photos into engaging videos
- Create social media content from still images
- Generate marketing materials with motion

### 2. Character Animation
- Bring portraits to life with subtle movements
- Create animated avatars for applications
- Generate character animations for storytelling

### 3. Cinematic Scenes
- Convert landscape photos to dynamic scenes
- Create atmospheric videos from architectural shots
- Generate action sequences from action shots

## Performance Considerations

- **Processing Time**: 5-10 seconds typically take 1-3 minutes
- **Image Size**: Larger images may increase processing time
- **Queue Management**: Use async processing for multiple requests
- **Rate Limits**: Check fal-ai documentation for current limits

## Troubleshooting

### Common Issues

1. **Poor Quality Output**
   - Ensure high-quality input images
   - Adjust cfg_scale values
   - Refine prompt descriptions

2. **Motion Not Natural**
   - Use more descriptive prompts
   - Adjust motion parameters
   - Consider different input images

3. **API Errors**
   - Verify API key is valid
   - Check input format requirements
   - Ensure image URLs are accessible

### Optimization Tips

- **Prompt Engineering**: Use cinematic language and specific motion descriptions
- **Image Selection**: Choose images with clear subjects and good composition
- **Parameter Tuning**: Experiment with different cfg_scale values
- **Batch Processing**: Use queue system for multiple generations

## Integration Examples

### React Component

```typescript
import React, { useState } from 'react';
import { createKlingVideoV2MasterExecutor } from './executors/kling-video-v2-master';

const VideoGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const generateVideo = async (prompt: string, imageUrl: string) => {
    setLoading(true);
    try {
      const executor = createKlingVideoV2MasterExecutor(process.env.REACT_APP_FAL_KEY);
      const result = await executor.generateVideo({
        prompt,
        image_url: imageUrl,
        duration: "5"
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
import { createKlingVideoV2MasterExecutor } from './executors/kling-video-v2-master';

const app = express();
app.use(express.json());

app.post('/generate-video', async (req, res) => {
  try {
    const { prompt, image_url, duration } = req.body;
    
    const executor = createKlingVideoV2MasterExecutor(process.env.FAL_KEY);
    const result = await executor.generateVideo({
      prompt,
      image_url,
      duration: duration || "5"
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

## Support and Resources

- **Documentation**: [FAL AI Documentation](https://fal.ai/docs)
- **API Reference**: [Kling Video API](https://fal.ai/docs/reference/rest/kling-video)
- **Community**: [FAL AI Discord](https://discord.gg/fal-ai)
- **Examples**: [GitHub Examples](https://github.com/fal-ai/fal-ai-examples)

## Changelog

### v2.0 (Current)
- Enhanced motion quality and fluidity
- Improved text understanding for complex scenes
- Better character realism and expressions
- Advanced camera control capabilities
- Support for motion masks and dynamic controls

### v1.6 (Previous)
- Basic image-to-video generation
- Standard motion patterns
- Limited camera control options
