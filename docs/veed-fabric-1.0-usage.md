# VEED Fabric 1.0 Usage Guide

## Overview

VEED Fabric 1.0 is an advanced image-to-video API that transforms any static image into a realistic talking video. This model is perfect for creating talking avatars, lip-sync videos, and animated content from static images.

## Key Features

- **Image-to-Video Generation**: Convert static images into talking videos
- **Realistic Lip-Sync**: High-quality audio-video synchronization
- **Multiple Resolutions**: Support for 480p and 720p output
- **Commercial Use**: Suitable for commercial applications
- **Multilingual Support**: Works with various languages

## Pricing

- **480p**: $0.08 per second
- **720p**: $0.15 per second

## Setup

### 1. Install Dependencies

```bash
npm install @fal-ai/client
```

### 2. Environment Variables

Set your FAL API key:

```bash
export FAL_KEY="your_fal_api_key_here"
```

### 3. Import the Executor

```typescript
import { 
  executeVeedFabric, 
  executeVeedFabricWithQueue,
  checkVeedFabricStatus,
  getVeedFabricResult,
  calculateVeedFabricCost,
  getVeedFabricModelInfo
} from '../executors/veed-fabric-1.0';
```

## Basic Usage

### Simple Image-to-Video Generation

```typescript
import { executeVeedFabric } from '../executors/veed-fabric-1.0';

async function createTalkingVideo() {
  const result = await executeVeedFabric({
    image_url: "https://example.com/avatar.png",
    audio_url: "https://example.com/speech.mp3",
    resolution: "480p"
  });

  if ('error' in result) {
    console.error('Error:', result.message);
    return;
  }

  console.log('Generated video URL:', result.video.url);
  console.log('File size:', result.video.file_size, 'bytes');
}
```

### High-Quality Video Generation

```typescript
async function createHighQualityVideo() {
  const result = await executeVeedFabric({
    image_url: "https://example.com/portrait.jpg",
    audio_url: "https://example.com/narration.wav",
    resolution: "720p" // Higher quality, higher cost
  });

  if ('error' in result) {
    console.error('Error:', result.message);
    return;
  }

  console.log('High-quality video ready:', result.video.url);
}
```

## Advanced Usage

### Queue-Based Processing

For longer videos or when you want to handle requests asynchronously:

```typescript
import { 
  executeVeedFabricWithQueue, 
  checkVeedFabricStatus, 
  getVeedFabricResult 
} from '../executors/veed-fabric-1.0';

async function processLongVideo() {
  // Submit to queue
  const submission = await executeVeedFabricWithQueue({
    image_url: "https://example.com/image.png",
    audio_url: "https://example.com/long-audio.mp3",
    resolution: "480p"
  }, "https://your-webhook.url/for/results");

  if ('error' in submission) {
    console.error('Submission error:', submission.message);
    return;
  }

  const requestId = submission.request_id;
  console.log('Request submitted:', requestId);

  // Poll for completion
  let completed = false;
  while (!completed) {
    const status = await checkVeedFabricStatus(requestId);
    
    if (status.status === 'COMPLETED') {
      const result = await getVeedFabricResult(requestId);
      console.log('Video ready:', result.video.url);
      completed = true;
    } else if (status.status === 'FAILED') {
      console.error('Processing failed:', status.error);
      completed = true;
    } else {
      console.log('Processing...', status.status);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    }
  }
}
```

### Cost Calculation

```typescript
import { calculateVeedFabricCost } from '../executors/veed-fabric-1.0';

// Calculate cost for different scenarios
const cost480p = calculateVeedFabricCost(30, "480p"); // 30 seconds at 480p
const cost720p = calculateVeedFabricCost(30, "720p"); // 30 seconds at 720p

console.log(`30-second video costs:`);
console.log(`480p: $${cost480p.toFixed(2)}`);
console.log(`720p: $${cost720p.toFixed(2)}`);
```

## Input Requirements

### Supported Image Formats
- JPG/JPEG
- PNG
- WebP
- GIF
- AVIF

### Supported Audio Formats
- MP3
- OGG
- WAV
- M4A
- AAC

### Resolution Options
- **480p**: Lower cost, good quality
- **720p**: Higher cost, better quality

## Best Practices

### Image Preparation
1. **High Quality**: Use high-resolution images with clear facial features
2. **Good Lighting**: Ensure proper lighting and contrast
3. **Frontal View**: Images with subjects facing forward work best
4. **Clear Features**: Avoid blurry or low-quality images

### Audio Preparation
1. **Clear Speech**: Use high-quality audio with clear speech
2. **Appropriate Length**: Match audio length to desired video duration
3. **Good Quality**: Avoid background noise and distortion
4. **Consistent Volume**: Maintain consistent audio levels

### Cost Optimization
1. **Use 480p**: For cost-sensitive applications
2. **Shorter Videos**: Keep videos concise when possible
3. **Batch Processing**: Process multiple short videos efficiently
4. **Quality vs Cost**: Balance quality requirements with budget

## Error Handling

```typescript
async function handleErrors() {
  try {
    const result = await executeVeedFabric({
      image_url: "invalid-url",
      audio_url: "https://example.com/audio.mp3",
      resolution: "480p"
    });

    if ('error' in result) {
      switch (result.error) {
        case 'INVALID_INPUT':
          console.error('Input validation failed:', result.message);
          break;
        case 'EXECUTION_ERROR':
          console.error('Processing failed:', result.message);
          break;
        default:
          console.error('Unknown error:', result.message);
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}
```

## Model Information

```typescript
import { getVeedFabricModelInfo } from '../executors/veed-fabric-1.0';

const modelInfo = getVeedFabricModelInfo();
console.log('Model:', modelInfo.name);
console.log('Description:', modelInfo.description);
console.log('Capabilities:', modelInfo.capabilities);
console.log('Pricing:', modelInfo.pricing);
```

## Use Cases

### 1. Talking Avatars
Create animated avatars for customer service, education, or entertainment.

### 2. Social Media Content
Generate engaging talking videos for social media platforms.

### 3. Educational Content
Create animated presenters for educational videos and tutorials.

### 4. Marketing Videos
Develop talking mascots or animated characters for marketing campaigns.

### 5. Accessibility
Create accessible content with talking avatars for hearing-impaired users.

## Limitations

- Requires clear facial features in the input image
- Works best with frontal face shots
- Audio and video lengths should match
- Processing time varies with video length and resolution
- Higher resolution (720p) costs more than 480p

## Integration Examples

### React Component

```typescript
import React, { useState } from 'react';
import { executeVeedFabric } from '../executors/veed-fabric-1.0';

export function TalkingVideoGenerator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const generateVideo = async () => {
    setLoading(true);
    
    const videoResult = await executeVeedFabric({
      image_url: "https://example.com/avatar.png",
      audio_url: "https://example.com/speech.mp3",
      resolution: "480p"
    });

    if ('error' in videoResult) {
      console.error('Error:', videoResult.message);
    } else {
      setResult(videoResult.video.url);
    }
    
    setLoading(false);
  };

  return (
    <div>
      <button onClick={generateVideo} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Talking Video'}
      </button>
      {result && (
        <video controls src={result} style={{ width: '100%', maxWidth: '500px' }} />
      )}
    </div>
  );
}
```

### Node.js API Endpoint

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { executeVeedFabric } from '../executors/veed-fabric-1.0';

export async function POST(request: NextRequest) {
  try {
    const { image_url, audio_url, resolution } = await request.json();

    const result = await executeVeedFabric({
      image_url,
      audio_url,
      resolution: resolution || "480p"
    });

    if ('error' in result) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      video_url: result.video.url,
      file_size: result.video.file_size
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Troubleshooting

### Common Issues

1. **Invalid API Key**: Ensure FAL_KEY environment variable is set correctly
2. **Invalid URLs**: Verify that image and audio URLs are accessible
3. **Unsupported Format**: Check that file formats are supported
4. **Resolution Error**: Ensure resolution is either "480p" or "720p"

### Debug Mode

Enable detailed logging by setting the environment variable:

```bash
export DEBUG=veed-fabric-1.0
```

This will provide detailed information about the processing pipeline and help identify issues.

## Support

For additional support and documentation:
- Check the VEED Fabric 1.0 registry file: `registry/veed-fabric-1.0.json`
- Review the executor implementation: `executors/veed-fabric-1.0.ts`
- See usage examples: `examples/veed-fabric-1.0-examples.ts`
