# Google Veo 2 - Image-to-Video Generation

## Overview

The **Google Veo 2** is a powerful image-to-video generation model that transforms static images into dynamic video sequences with realistic motion and natural animations. This professional-grade model creates smooth, high-quality animations that bring your still images to life.

### Key Features

- **Image-to-Video Transformation**: Convert static images into fluid video content
- **Natural Motion Generation**: Intelligent motion animation based on text prompts
- **High Quality Output**: 720p resolution with consistent frame rates
- **Flexible Duration**: 5-8 seconds with customizable length
- **Aspect Ratio Control**: Support for 16:9, 9:16, and 1:1 ratios
- **Commercial Use**: Permitted for commercial applications

### Use Cases

- Social media content creation
- Digital advertisements
- Interactive experiences
- Content marketing
- Product demonstrations
- Creative storytelling
- Educational content
- Professional video production

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

### Simple Video Generation

Generate a video with default settings (5 seconds, 16:9 aspect ratio):

```typescript
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/veo2/image-to-video", {
  input: {
    prompt: "A lego chef cooking eggs",
    image_url: "https://fal.media/files/elephant/6fq8JDSjb1osE_c3J_F2H.png"
  }
});

console.log("Video URL:", result.video.url);
console.log("Request ID:", result.requestId);
```

### Custom Aspect Ratio and Duration

Generate a portrait video with 8-second duration:

```typescript
const result = await fal.subscribe("fal-ai/veo2/image-to-video", {
  input: {
    prompt: "Camera slowly zooms in on the subject",
    image_url: "https://example.com/image.jpg",
    aspect_ratio: "9:16",
    duration: "8s"
  }
});
```

## Advanced Usage

### Queue-Based Processing

For long-running requests, use the queue system:

```typescript
// Submit to queue
const { request_id } = await fal.queue.submit("fal-ai/veo2/image-to-video", {
  input: {
    prompt: "A smooth tracking shot revealing the scene",
    image_url: "https://example.com/image.jpg",
    aspect_ratio: "16:9",
    duration: "8s"
  },
  webhookUrl: "https://your-webhook-url.com/notify"
});

console.log("Request ID:", request_id);
```

### Check Queue Status

Monitor the progress of your queued request:

```typescript
const status = await fal.queue.status("fal-ai/veo2/image-to-video", {
  requestId: "your-request-id",
  logs: true
});

console.log("Status:", status.status);
console.log("Progress:", status.progress);
```

## Input Parameters

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `prompt` | string | Text prompt describing how the image should be animated | "A lego chef cooking eggs" |
| `image_url` | string | URL of the input image to animate | "https://example.com/image.jpg" |

### Optional Parameters

| Parameter | Type | Default | Description | Values |
|-----------|------|---------|-------------|---------|
| `aspect_ratio` | enum | "16:9" | The aspect ratio of the generated video | "16:9", "9:16", "1:1" |
| `duration` | enum | "5s" | Duration of the generated video | "5s", "6s", "7s", "8s" |

## Output Format

### Success Response

```json
{
  "video": {
    "url": "https://v3.fal.media/files/monkey/jOYy3rvGB33vumzulpXd5_output.mp4",
    "content_type": "video/mp4",
    "file_name": "output.mp4",
    "file_size": 1234567
  },
  "requestId": "764cabcf-b745-4b3e-ae38-1200304cf45b"
}
```

## Pricing & Cost Calculation

### Pricing Structure

- **Base Cost**: $2.50 for 5-second video
- **Additional Seconds**: $0.50 for each additional second
- **No Subscription Required**: Pay-per-use model

### Cost Examples

| Duration | Cost | Use Case |
|----------|------|----------|
| 5 seconds | $2.50 | Standard animation, social media content |
| 6 seconds | $3.00 | Extended scenes, detailed animations |
| 7 seconds | $3.50 | Longer narratives, complex motions |
| 8 seconds | $4.00 | Extended content, detailed storytelling |

## Best Practices

### Image Preparation

1. **High Resolution**: Use images with at least 720p resolution
2. **Clear Subjects**: Ensure main subjects are well-defined
3. **Good Lighting**: Use well-lit images for better results
4. **Image Size**: Keep images under 8MB for optimal performance
5. **Format Support**: Use JPG, PNG, WEBP, GIF, or AVIF formats

### Prompt Engineering

1. **Be Specific**: Describe the exact motion you want
2. **Include Details**: Specify camera movement, style, and ambiance
3. **Use Action Words**: Describe how the image should animate
4. **Consider Context**: Think about the intended animation outcome

#### Good Prompt Examples

✅ **Specific Motion:**
```
"Camera slowly zooms in on the subject with gentle movement"
```

✅ **Detailed Animation:**
```
"A smooth tracking shot revealing the scene, with natural camera motion"
```

#### Poor Prompt Examples

❌ **Too Vague:**
```
"Make it move"
```

❌ **Too Abstract:**
```
"Animate this"
```

## Error Handling

### Common Error Types

1. **Authentication Errors**
   ```typescript
   try {
     const result = await fal.subscribe("fal-ai/veo2/image-to-video", {
       input: { prompt: "...", image_url: "..." }
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
     const result = await fal.subscribe("fal-ai/veo2/image-to-video", {
       input: { prompt: "", image_url: "..." } // Empty prompt
     });
   } catch (error) {
     if (error.message.includes("prompt")) {
       console.error("Prompt cannot be empty");
     }
   }
   ```

## Integration Examples

### React Component

```tsx
import React, { useState } from 'react';
import { fal } from '@fal-ai/client';

interface VideoGeneratorProps {
  apiKey: string;
}

export const Veo2VideoGenerator: React.FC<VideoGeneratorProps> = ({ apiKey }) => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [duration, setDuration] = useState<'5s' | '6s' | '7s' | '8s'>('5s');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  fal.config({ credentials: apiKey });

  const generateVideo = async () => {
    if (!prompt.trim() || !imageUrl.trim()) {
      setError('Please enter both prompt and image URL');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const result = await fal.subscribe("fal-ai/veo2/image-to-video", {
        input: { 
          prompt, 
          image_url: imageUrl,
          aspect_ratio: aspectRatio, 
          duration 
        }
      });

      setVideoUrl(result.video.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate video');
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateCost = () => {
    const durationSeconds = parseInt(duration.replace('s', ''));
    if (durationSeconds <= 5) {
      return 2.50;
    }
    const additionalSeconds = durationSeconds - 5;
    return 2.50 + (additionalSeconds * 0.50);
  };

  return (
    <div className="veo2-video-generator">
      <h2>Generate Video with Veo 2</h2>
      
      <div className="input-group">
        <label htmlFor="prompt">Animation Description:</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe how the image should be animated..."
          rows={4}
        />
      </div>

      <div className="input-group">
        <label htmlFor="imageUrl">Image URL:</label>
        <input
          id="imageUrl"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="input-group">
        <label htmlFor="aspectRatio">Aspect Ratio:</label>
        <select
          id="aspectRatio"
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value as '16:9' | '9:16' | '1:1')}
        >
          <option value="16:9">16:9 (Landscape)</option>
          <option value="9:16">9:16 (Portrait)</option>
          <option value="1:1">1:1 (Square)</option>
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="duration">Duration:</label>
        <select
          id="duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value as '5s' | '6s' | '7s' | '8s')}
        >
          <option value="5s">5s ($2.50)</option>
          <option value="6s">6s ($3.00)</option>
          <option value="7s">7s ($3.50)</option>
          <option value="8s">8s ($4.00)</option>
        </select>
      </div>

      <div className="cost-display">
        Estimated Cost: ${calculateCost().toFixed(2)}
      </div>

      <button 
        onClick={generateVideo} 
        disabled={isGenerating || !prompt.trim() || !imageUrl.trim()}
        type="button"
      >
        {isGenerating ? 'Generating...' : 'Generate Video'}
      </button>

      {error && <div className="error">{error}</div>}

      {videoUrl && (
        <div className="result">
          <h3>Generated Video:</h3>
          <video controls width="100%">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <a href={videoUrl} download>Download Video</a>
        </div>
      )}
    </div>
  );
};
```

## Troubleshooting

### Common Issues

#### 1. Poor Video Quality

**Problem**: Generated videos don't match image quality expectations

**Solutions**:
- Ensure input image meets minimum resolution requirements (720p+)
- Use images with good lighting and clear subjects
- Write more descriptive prompts with specific motion instructions
- Try different aspect ratios for better results

#### 2. Motion Not as Expected

**Problem**: Animation doesn't match prompt description

**Solutions**:
- Write more descriptive prompts with specific motion instructions
- Include details about camera movement and style
- Use action-oriented language in your prompts

### Getting Help

- **Documentation**: [fal.ai docs](https://docs.fal.ai)
- **Community**: [fal.ai Discord](https://discord.gg/fal-ai)
- **Support**: Contact fal.ai support for technical issues
- **Model Page**: [fal.ai/models/fal-ai/veo2/image-to-video](https://fal.ai/models/fal-ai/veo2/image-to-video)

## Conclusion

The Google Veo 2 model provides an excellent balance of quality, cost-effectiveness, and flexibility for image-to-video generation. It's particularly valuable for content creators, marketers, and developers who need professional-grade video animations from static images without breaking the bank.

By following the best practices outlined in this guide, you can maximize the quality of your generated videos while optimizing costs. The model's natural motion generation, flexible parameters, and professional output make it a versatile choice for various content creation needs.
