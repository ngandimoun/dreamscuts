# Bria Video Background Removal - Usage Guide

## Overview

The **Bria Video Background Removal** is a powerful AI-powered tool that automatically removes backgrounds from videos, eliminating the need for green screens or manual editing. This professional-grade model delivers clean, precise background removal with support for multiple output formats and background colors, making it ideal for content creators, marketers, and video professionals.

### Key Features

- **Automatic Background Removal**: No green screen required
- **Professional Quality**: Precise edge detection and clean results
- **Multiple Output Formats**: Support for MP4, WebM, MOV, MKV, and GIF
- **Flexible Background Colors**: Including transparent backgrounds
- **Cost-Effective**: $0.14 per video second
- **High Resolution Support**: Up to 14142x14142 pixels
- **Queue System**: Asynchronous processing for long videos

### Use Cases

- Professional video production
- Content creation for social media
- Marketing and advertising videos
- Educational content
- Product demonstrations
- Video editing and post-production
- Background replacement for virtual sets
- Content localization and adaptation

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm, yarn, pnpm, or bun package manager
- fal.ai API key

### Installation Steps

1. **Install the FAL AI client:**
   ```bash
   npm install --save @fal-ai/client
   ```

2. **Set up your API key:**
   ```bash
   export FAL_KEY="YOUR_API_KEY"
   ```

3. **Import and configure in your code:**
   ```typescript
   import { fal } from "@fal-ai/client";
   
   fal.config({
     credentials: "YOUR_FAL_KEY"
   });
   ```

## Basic Usage

### Simple Background Removal

Remove background with default settings (black background, WebM VP9 format):

```typescript
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("bria/video/background-removal", {
  input: {
    video_url: "https://example.com/video.mp4"
  }
});

console.log("Processed Video URL:", result.video.url);
console.log("Request ID:", result.requestId);
```

### Custom Background Color and Format

Remove background with transparent background and MP4 H.265 format:

```typescript
const result = await fal.subscribe("bria/video/background-removal", {
  input: {
    video_url: "https://example.com/video.mp4",
    background_color: "Transparent",
    output_container_and_codec: "mp4_h265"
  }
});
```

## Advanced Usage

### Queue-Based Processing

For long videos or batch processing, use the queue system:

```typescript
// Submit to queue
const { request_id } = await fal.queue.submit("bria/video/background-removal", {
  input: {
    video_url: "https://example.com/long-video.mp4",
    background_color: "White",
    output_container_and_codec: "webm_vp9"
  },
  webhookUrl: "https://your-webhook-url.com/notify"
});

console.log("Request ID:", request_id);
```

### Check Queue Status

Monitor the progress of your queued request:

```typescript
const status = await fal.queue.status("bria/video/background-removal", {
  requestId: "your-request-id",
  logs: true
});

console.log("Status:", status.status);
console.log("Progress:", status.progress);
```

### Get Queue Result

Retrieve the completed video:

```typescript
const result = await fal.queue.result("bria/video/background-removal", {
  requestId: "your-request-id"
});

console.log("Processed Video URL:", result.video.url);
```

## Input Parameters

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `video_url` | string | URL of the input video to remove background from | "https://example.com/video.mp4" |

### Optional Parameters

| Parameter | Type | Default | Description | Values |
|-----------|------|---------|-------------|---------|
| `background_color` | enum | "Black" | Background color for the output video | "Transparent", "Black", "White", "Gray", "Red", "Green", "Blue", "Yellow", "Cyan", "Magenta", "Orange" |
| `output_container_and_codec` | enum | "webm_vp9" | Output container and codec format | "mp4_h265", "mp4_h264", "webm_vp9", "mov_h265", "mov_proresks", "mkv_h265", "mkv_h264", "mkv_vp9", "gif" |

## Output Format

### Success Response

```json
{
  "video": {
    "url": "https://v3.fal.media/files/processed/abc123_output.mp4",
    "content_type": "video/mp4",
    "file_name": "output.mp4",
    "file_size": 1234567
  }
}
```

## Pricing & Cost Calculation

### Pricing Structure

- **Cost**: $0.14 per video second
- **No Subscription Required**: Pay-per-use model
- **Maximum Duration**: 30 seconds per video

### Cost Examples

| Duration | Cost | Use Case |
|----------|------|----------|
| 5 seconds | $0.70 | Short social media clips |
| 10 seconds | $1.40 | Standard content pieces |
| 15 seconds | $2.10 | Extended content |
| 30 seconds | $4.20 | Maximum duration (long content) |

## Best Practices

### Video Preparation

1. **Good Lighting**: Ensure subjects are well-lit for better edge detection
2. **High Contrast**: Use backgrounds that contrast well with the subject
3. **Stable Footage**: Minimize camera movement for cleaner results
4. **Clear Subjects**: Ensure main subjects are well-defined
5. **Reasonable Duration**: Keep videos under 30 seconds for optimal processing

### Format Selection

1. **WebM VP9**: Good balance of quality and file size (default)
2. **MP4 H.265**: High quality with good compression
3. **MP4 H.264**: Widest compatibility across platforms
4. **MOV ProRes**: Professional editing workflows
5. **GIF**: Simple animations and social media

### Background Color Selection

1. **Transparent**: Maximum flexibility for post-production
2. **Black/White**: Clean, professional look
3. **Custom Colors**: Match your brand or design requirements
4. **Gray**: Neutral background for various use cases

## Integration Examples

### React Component

```tsx
import React, { useState } from 'react';
import { fal } from '@fal-ai/client';

interface BackgroundRemovalProps {
  apiKey: string;
}

export const BriaBackgroundRemoval: React.FC<BackgroundRemovalProps> = ({ apiKey }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [backgroundColor, setBackgroundColor] = useState<'Transparent' | 'Black' | 'White' | 'Gray' | 'Red' | 'Green' | 'Blue' | 'Yellow' | 'Cyan' | 'Magenta' | 'Orange'>('Black');
  const [outputFormat, setOutputFormat] = useState<'mp4_h265' | 'mp4_h264' | 'webm_vp9' | 'mov_h265' | 'mov_proresks' | 'mkv_h265' | 'mkv_h264' | 'mkv_vp9' | 'gif'>('webm_vp9');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedVideoUrl, setProcessedVideoUrl] = useState('');
  const [error, setError] = useState('');

  fal.config({ credentials: apiKey });

  const removeBackground = async () => {
    if (!videoUrl.trim()) {
      setError('Please enter a video URL');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const result = await fal.subscribe("bria/video/background-removal", {
        input: { 
          video_url: videoUrl,
          background_color: backgroundColor, 
          output_container_and_codec: outputFormat 
        }
      });

      setProcessedVideoUrl(result.video.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process video');
    } finally {
      setIsProcessing(false);
    }
  };

  const estimateCost = (duration: number) => {
    return (duration * 0.14).toFixed(2);
  };

  return (
    <div className="bria-background-removal">
      <h2>Remove Video Background with Bria</h2>
      
      <div className="input-group">
        <label htmlFor="videoUrl">Video URL:</label>
        <input
          id="videoUrl"
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://example.com/video.mp4"
        />
      </div>

      <div className="input-group">
        <label htmlFor="backgroundColor">Background Color:</label>
        <select
          id="backgroundColor"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value as any)}
        >
          <option value="Transparent">Transparent</option>
          <option value="Black">Black</option>
          <option value="White">White</option>
          <option value="Gray">Gray</option>
          <option value="Red">Red</option>
          <option value="Green">Green</option>
          <option value="Blue">Blue</option>
          <option value="Yellow">Yellow</option>
          <option value="Cyan">Cyan</option>
          <option value="Magenta">Magenta</option>
          <option value="Orange">Orange</option>
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="outputFormat">Output Format:</label>
        <select
          id="outputFormat"
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value as any)}
        >
          <option value="webm_vp9">WebM VP9 (Default)</option>
          <option value="mp4_h265">MP4 H.265</option>
          <option value="mp4_h264">MP4 H.264</option>
          <option value="mov_h265">MOV H.265</option>
          <option value="mov_proresks">MOV ProRes</option>
          <option value="mkv_h265">MKV H.265</option>
          <option value="mkv_h264">MKV H.264</option>
          <option value="mkv_vp9">MKV VP9</option>
          <option value="gif">GIF</option>
        </select>
      </div>

      <div className="cost-info">
        <p>Cost: $0.14 per second</p>
        <p>Max duration: 30 seconds</p>
        <p>Estimated cost for 10s video: ${estimateCost(10)}</p>
      </div>

      <button 
        onClick={removeBackground} 
        disabled={isProcessing || !videoUrl.trim()}
        type="button"
      >
        {isProcessing ? 'Processing...' : 'Remove Background'}
      </button>

      {error && <div className="error">{error}</div>}

      {processedVideoUrl && (
        <div className="result">
          <h3>Processed Video:</h3>
          <video controls width="100%">
            <source src={processedVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <a href={processedVideoUrl} download>Download Video</a>
        </div>
      )}
    </div>
  );
};
```

### Node.js Server

```typescript
import express from 'express';
import { fal } from '@fal-ai/client';

const app = express();
app.use(express.json());

// Configure fal.ai
fal.config({
  credentials: process.env.FAL_KEY
});

// Background removal endpoint
app.post('/api/remove-background', async (req, res) => {
  try {
    const { 
      video_url, 
      background_color = 'Black', 
      output_container_and_codec = 'webm_vp9'
    } = req.body;

    if (!video_url) {
      return res.status(400).json({ error: 'video_url is required' });
    }

    const result = await fal.subscribe("bria/video/background-removal", {
      input: { 
        video_url, 
        background_color, 
        output_container_and_codec 
      }
    });

    res.json({
      success: true,
      video: result.video,
      requestId: result.requestId
    });
  } catch (error) {
    console.error('Background removal error:', error);
    res.status(500).json({
      error: 'Failed to remove background',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Queue-based processing endpoint
app.post('/api/queue-removal', async (req, res) => {
  try {
    const { 
      video_url, 
      background_color = 'Black', 
      output_container_and_codec = 'webm_vp9',
      webhookUrl 
    } = req.body;

    if (!video_url) {
      return res.status(400).json({ error: 'video_url is required' });
    }

    const { request_id } = await fal.queue.submit("bria/video/background-removal", {
      input: { 
        video_url, 
        background_color, 
        output_container_and_codec 
      },
      webhookUrl
    });

    res.json({
      success: true,
      requestId: request_id,
      status: 'queued'
    });
  } catch (error) {
    console.error('Queue submission error:', error);
    res.status(500).json({
      error: 'Failed to queue background removal',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Error Handling

### Common Error Types

1. **Authentication Errors**
   ```typescript
   try {
     const result = await fal.subscribe("bria/video/background-removal", {
       input: { video_url: "..." }
     });
   } catch (error) {
     if (error.message.includes("credentials")) {
       console.error("Invalid API key. Please check your FAL_KEY.");
     }
   }
   ```

2. **Input Validation Errors**
   ```typescript
   try {
     const result = await fal.subscribe("bria/video/background-removal", {
       input: { video_url: "" } // Empty URL
     });
   } catch (error) {
     if (error.message.includes("video_url")) {
       console.error("Video URL cannot be empty");
     }
   }
   ```

3. **Processing Errors**
   ```typescript
   try {
     const result = await fal.subscribe("bria/video/background-removal", {
       input: { video_url: "invalid-url" }
     });
   } catch (error) {
     if (error.message.includes("video")) {
       console.error("Invalid video URL or format");
     }
   }
   ```

## Troubleshooting

### Common Issues

#### 1. Poor Background Removal Quality

**Problem**: Background removal results are not clean or precise

**Solutions**:
- Ensure good lighting on the subject
- Use videos with high contrast between subject and background
- Avoid complex or busy backgrounds
- Use stable video footage

#### 2. Processing Failures

**Problem**: API calls fail or return errors

**Solutions**:
- Verify video format compatibility
- Check that video URL is publicly accessible
- Ensure video meets size and duration requirements
- Verify API key permissions

#### 3. Long Processing Times

**Problem**: Video processing takes too long

**Solutions**:
- Use queue system for videos longer than 10 seconds
- Implement webhook notifications for async processing
- Monitor queue status for progress updates
- Consider video length and complexity

### Optimization Tips

1. **Video Preparation**: Use well-lit, high-contrast videos
2. **Format Selection**: Choose appropriate output format for your use case
3. **Background Color**: Use transparent backgrounds for maximum flexibility
4. **Batch Processing**: Use queue system for multiple videos
5. **Error Handling**: Implement robust error handling with retry logic

## Getting Help

- **Documentation**: [fal.ai docs](https://docs.fal.ai)
- **Community**: [fal.ai Discord](https://discord.gg/fal-ai)
- **Support**: Contact fal.ai support for technical issues
- **Model Page**: [fal.ai/models/bria/video/background-removal](https://fal.ai/models/bria/video/background-removal)

## Conclusion

The Bria Video Background Removal model provides an excellent solution for creating professional videos without the need for green screens or complex editing. With its precise AI-powered background removal, multiple output format support, and cost-effective pricing, it's an ideal choice for content creators, marketers, and video professionals.

By following the best practices outlined in this guide, you can maximize the quality of your background removal results while optimizing costs. The model's professional-grade output, flexible parameters, and reliable processing make it a versatile tool for various video editing needs.
