# Bytedance Seedance 1.0 Pro - Usage Guide

## Overview

Bytedance Seedance 1.0 Pro is a high-quality video generation model that transforms static images into fluid, natural-looking videos with sophisticated motion synthesis. This advanced AI motion generation model excels at creating natural motion from single images while preserving visual quality and temporal consistency.

## Model Information

- **Name**: Bytedance Seedance 1.0 Pro
- **Version**: v1.0
- **Provider**: Bytedance (via fal.ai)
- **Model ID**: `fal-ai/bytedance/seedance/v1/pro/image-to-video`
- **Type**: Image-to-Video Generation
- **Quality Tier**: Professional

## Key Features

- **High-Quality Motion Synthesis**: Creates natural, realistic movement patterns
- **Flexible Duration**: Support for 3-12 second videos
- **Multiple Resolutions**: 480p, 720p, and 1080p output options
- **Physical Realism**: Respects physical constraints and object relationships
- **Visual Quality Preservation**: Maintains image quality and temporal consistency
- **Safety Features**: Built-in content moderation and safety checker
- **Seed Control**: Reproducible results with seed parameter
- **Camera Control**: Options for fixed or dynamic camera positioning

## Pricing

- **Base Cost**: $0.62 for 1080p 5-second video
- **Token-Based Pricing**: $2.5 per million video tokens
- **Calculation Formula**: `tokens(video) = (height × width × FPS × duration) / 1024`
- **Example Costs**:
  - 1080p 5s video: $0.62
  - 720p 8s video: ~$0.67
  - 480p 12s video: ~$0.45

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
import { createSeedanceV1ProExecutor } from './executors/seedance-v1-pro';
```

## Basic Usage

### Simple Video Generation

```typescript
import { createSeedanceV1ProExecutor } from './executors/seedance-v1-pro';

const executor = createSeedanceV1ProExecutor(process.env.FAL_KEY);

const result = await executor.generateVideo({
  prompt: "A person walking naturally through a city street",
  image_url: "https://example.com/person.jpg"
});

console.log(result.video.url);
```

### Advanced Configuration

```typescript
const result = await executor.generateVideo({
  prompt: "A skier gliding down a slope with natural movement",
  image_url: "https://example.com/skier.jpg",
  resolution: "720p",
  duration: "8",
  enable_safety_checker: true,
  seed: 42
});
```

## Input Parameters

### Required Parameters

- **prompt** (string): Text description of the desired motion and video content
- **image_url** (string): URL of the input image to animate

### Optional Parameters

- **resolution** ("480p" | "720p" | "1080p"): Output video resolution (default: "1080p")
- **duration** ("3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12"): Video duration in seconds (default: "5")
- **camera_fixed** (boolean): Whether to fix the camera position during generation
- **seed** (integer): Random seed for reproducible results (use -1 for random)
- **enable_safety_checker** (boolean): Enable content safety checking (default: true)

## Output Format

```typescript
interface SeedanceV1ProOutput {
  video: {
    url: string;           // Download URL for the generated video
    content_type?: string; // MIME type (video/mp4)
    file_name?: string;    // Generated filename
    file_size?: number;    // File size in bytes
  };
  seed?: number;           // Seed used for generation
  requestId?: string;      // Request identifier
}
```

## Asynchronous Processing

For long-running requests, use the queue system:

```typescript
// Submit to queue
const { requestId } = await executor.queueVideoGeneration({
  prompt: "A flower blooming in time-lapse",
  image_url: "https://example.com/flower.jpg"
});

// Check status
const status = await executor.checkQueueStatus(requestId);

// Get result when complete
const result = await executor.getQueueResult(requestId);
```

## Cost Management

### Cost Calculation

```typescript
const executor = createSeedanceV1ProExecutor(process.env.FAL_KEY);

// Calculate costs for different configurations
const baseCost = executor.calculateCost("1080p", 5);     // $0.62
const customCost = executor.calculateCost("720p", 8);    // ~$0.67
const lowResCost = executor.calculateCost("480p", 12);   // ~$0.45

console.log(`Base cost: $${baseCost.toFixed(2)}`);
console.log(`Custom config: $${customCost.toFixed(2)}`);
console.log(`Low res long: $${lowResCost.toFixed(2)}`);
```

### Budget Planning

- **$5.00 budget**: 8 videos at base cost, or 7-9 videos with custom configurations
- **$10.00 budget**: 16 videos at base cost, or 14-18 videos with custom configurations
- **$25.00 budget**: 40 videos at base cost, or 35-45 videos with custom configurations

## Advanced Features

### Multiple Video Generation

```typescript
const inputs = [
  {
    prompt: "A person walking naturally",
    image_url: "https://example.com/person1.jpg"
  },
  {
    prompt: "A car driving through a city",
    image_url: "https://example.com/car.jpg"
  },
  {
    prompt: "A bird flying over mountains",
    image_url: "https://example.com/bird.jpg"
  }
];

const results = await executor.generateMultipleVideos(inputs);

results.forEach((result, index) => {
  if ('video' in result) {
    console.log(`Video ${index + 1}: ${result.video.url}`);
  } else {
    console.log(`Video ${index + 1} failed: ${result.message}`);
  }
});
```

### Seed Control for Reproducibility

```typescript
// Generate with specific seed for reproducible results
const result1 = await executor.generateVideo({
  prompt: "A butterfly landing on a flower",
  image_url: "https://example.com/butterfly.jpg",
  seed: 12345
});

const result2 = await executor.generateVideo({
  prompt: "A butterfly landing on a flower",
  image_url: "https://example.com/butterfly.jpg",
  seed: 12345
});

// result1 and result2 should be identical
```

## Use Cases

### 1. **Social Media Content**
- Animate portrait photos with natural expressions
- Create engaging product demonstrations
- Generate dynamic landscape videos
- Produce creative visual effects

### 2. **Marketing and Advertising**
- Animate product images for campaigns
- Create dynamic brand content
- Generate promotional video materials
- Produce engaging social media ads

### 3. **Creative Projects**
- Transform artwork into animated videos
- Create motion graphics from static images
- Generate storytelling content
- Produce entertainment videos

### 4. **Educational Content**
- Animate diagrams and illustrations
- Create interactive learning materials
- Generate demonstration videos
- Produce engaging educational content

## Performance Optimization

### 1. **Image Quality**
- Use high-resolution source images
- Ensure good lighting and clear subjects
- Choose images with distinct focal points
- Avoid blurry or low-quality inputs

### 2. **Prompt Engineering**
- Write clear, descriptive motion descriptions
- Specify movement type and speed
- Include camera behavior details
- Use natural language descriptions

### 3. **Parameter Selection**
- Choose resolution based on quality vs. speed needs
- Select duration appropriate for your content
- Use seed control for consistency when needed
- Enable safety checker for content moderation

## Error Handling

```typescript
try {
  const result = await executor.generateVideo(input);
  // Handle success
} catch (error) {
  if (error.message.includes('image_url')) {
    // Handle invalid image URL
    console.error('Invalid image URL:', error.message);
  } else if (error.message.includes('prompt')) {
    // Handle prompt-related errors
    console.error('Prompt error:', error.message);
  } else if (error.message.includes('resolution')) {
    // Handle resolution errors
    console.error('Resolution error:', error.message);
  } else if (error.message.includes('duration')) {
    // Handle duration errors
    console.error('Duration error:', error.message);
  } else {
    // Handle other errors
    console.error('Video generation failed:', error.message);
  }
}
```

## Common Issues and Solutions

### 1. **Poor Motion Quality**
- **Solution**: Use high-quality input images with clear subjects
- **Tip**: Ensure good lighting and distinct focal points

### 2. **Inconsistent Results**
- **Solution**: Use specific seed values for reproducible results
- **Note**: Use -1 for random seed, or any positive integer for consistency

### 3. **Long Generation Times**
- **Solution**: Use lower resolution (480p or 720p) for faster generation
- **Trade-off**: Lower quality but faster processing

### 4. **Safety Checker Blocks**
- **Solution**: Review prompt content for compliance
- **Best Practice**: Avoid potentially controversial or inappropriate content

## Integration Examples

### React Component

```typescript
import React, { useState } from 'react';
import { createSeedanceV1ProExecutor } from './executors/seedance-v1-pro';

const SeedanceVideoGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [cost, setCost] = useState(0);

  const generateVideo = async (prompt: string, imageUrl: string, resolution: string = "1080p", duration: number = 5) => {
    setLoading(true);
    try {
      const executor = createSeedanceV1ProExecutor(process.env.REACT_APP_FAL_KEY);
      
      // Calculate cost first
      const estimatedCost = executor.calculateCost(resolution, duration);
      setCost(estimatedCost);
      
      const result = await executor.generateVideo({
        prompt,
        image_url: imageUrl,
        resolution: resolution as any,
        duration: duration.toString() as any
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
import { createSeedanceV1ProExecutor } from './executors/seedance-v1-pro';

const app = express();
app.use(express.json());

app.post('/generate-video', async (req, res) => {
  try {
    const { prompt, image_url, resolution, duration, seed } = req.body;
    
    const executor = createSeedanceV1ProExecutor(process.env.FAL_KEY);
    
    // Calculate estimated cost
    const estimatedCost = executor.calculateCost(resolution || "1080p", duration || 5);
    
    const result = await executor.generateVideo({
      prompt,
      image_url,
      resolution: resolution || "1080p",
      duration: duration ? duration.toString() : "5",
      seed: seed || -1
    });

    res.json({ 
      success: true, 
      video: result.video, 
      estimatedCost,
      seed: result.seed,
      requestId: result.requestId 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
```

### Batch Processing

```typescript
const executor = createSeedanceV1ProExecutor(process.env.FAL_KEY);

// Generate multiple videos with different configurations
const videoConfigs = [
  {
    prompt: "A person walking naturally",
    image_url: "https://example.com/person1.jpg",
    resolution: "1080p",
    duration: 5
  },
  {
    prompt: "A car driving through a city",
    image_url: "https://example.com/car.jpg",
    resolution: "720p",
    duration: 8
  },
  {
    prompt: "A bird flying over mountains",
    image_url: "https://example.com/bird.jpg",
    resolution: "480p",
    duration: 12
  }
];

// Calculate total cost
const totalCost = videoConfigs.reduce((total, config) => {
  return total + executor.calculateCost(config.resolution, config.duration);
}, 0);

console.log(`Total cost for ${videoConfigs.length} videos: $${totalCost.toFixed(2)}`);

// Generate all videos
const results = await executor.generateMultipleVideos(
  videoConfigs.map(config => ({
    prompt: config.prompt,
    image_url: config.image_url,
    resolution: config.resolution as any,
    duration: config.duration.toString() as any
  }))
);
```

## Support and Resources

- **Documentation**: [FAL AI Documentation](https://fal.ai/docs)
- **API Reference**: [Seedance API](https://fal.ai/docs/reference/rest/seedance)
- **Community**: [FAL AI Discord](https://discord.gg/fal-ai)
- **Examples**: [GitHub Examples](https://github.com/fal-ai/fal-ai-examples)

## Changelog

### v1.0 (Current)
- High-quality image-to-video generation
- Natural motion synthesis with physical realism
- Flexible duration options (3-12 seconds)
- Multiple resolution support (480p, 720p, 1080p)
- Built-in safety checker and content moderation
- Seed control for reproducible results
- Camera position control options

## Technical Specifications

- **Model Family**: Seedance
- **Architecture**: AI Motion Generation
- **Input Types**: Image + Text
- **Output Format**: MP4
- **Duration Range**: 3-12 seconds
- **Frame Rate**: 30 FPS
- **Quality Tier**: Professional
- **Aspect Ratio**: 16:9
- **Seed Control**: Yes
- **Safety Checker**: Yes
- **Camera Control**: Yes
