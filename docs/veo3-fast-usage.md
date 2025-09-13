# Google Veo 3 Fast - Text-to-Video Generation

## Overview

The **Google Veo 3 Fast** is a faster and more cost-effective version of Google's Veo 3 model for advanced text-to-video generation with synchronized audio. This optimized model delivers exceptional video generation capabilities with improved speed and cost-effectiveness, making it 60-80% more affordable than the standard Veo 3 while maintaining professional-grade quality.

### Key Features

- **Cost-Effective**: 60-80% cheaper than standard Veo 3
- **Fast Processing**: Optimized for quicker inference times
- **Audio Generation**: Full synchronized audio with dialogue and sound effects
- **High Quality**: Professional-grade video output
- **Flexible Aspect Ratios**: 16:9, 9:16, and 1:1 with outpainting support
- **Resolution Options**: 720p and 1080p
- **Commercial Use**: Permitted for commercial applications
- **Built-in Safety**: Content policy compliance and moderation

### Use Cases

- Social media content creation
- Marketing and advertising videos
- Educational content
- Product demonstrations
- Creative storytelling
- Quick video prototypes
- Content marketing campaigns
- Social media engagement
- Professional video production
- Cost-effective content creation

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

Generate a video with default settings (8 seconds, 720p, with audio):

```typescript
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/veo3/fast", {
  input: {
    prompt: "A peaceful forest scene with sunlight filtering through trees and birds flying overhead"
  }
});

console.log("Video URL:", result.video.url);
console.log("Request ID:", result.requestId);
```

### Custom Resolution and Aspect Ratio

Generate a 1080p video in portrait format:

```typescript
const result = await fal.subscribe("fal-ai/veo3/fast", {
  input: {
    prompt: "A futuristic city with flying cars and neon lights illuminating the skyline",
    aspect_ratio: "9:16",
    resolution: "1080p"
  }
});
```

### Audio Control

Generate a video without audio for cost savings:

```typescript
const result = await fal.subscribe("fal-ai/veo3/fast", {
  input: {
    prompt: "A serene mountain landscape at sunrise",
    generate_audio: false
  }
});
```

## Advanced Usage

### Queue-Based Processing

For long-running requests, use the queue system:

```typescript
// Submit to queue
const { request_id } = await fal.queue.submit("fal-ai/veo3/fast", {
  input: {
    prompt: "A detailed scene of a medieval castle with knights and dragons",
    aspect_ratio: "16:9",
    resolution: "1080p",
    generate_audio: true
  },
  webhookUrl: "https://your-webhook-url.com/notify"
});

console.log("Request ID:", request_id);
```

### Check Queue Status

Monitor the progress of your queued request:

```typescript
const status = await fal.queue.status("fal-ai/veo3/fast", {
  requestId: "your-request-id",
  logs: true
});

console.log("Status:", status.status);
console.log("Progress:", status.progress);
```

### Get Queue Result

Retrieve the completed video:

```typescript
const result = await fal.queue.result("fal-ai/veo3/fast", {
  requestId: "your-request-id"
});

console.log("Video URL:", result.video.url);
```

## Input Parameters

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `prompt` | string | Text description of the video to generate | "A peaceful forest scene with sunlight filtering through trees" |

### Optional Parameters

| Parameter | Type | Default | Description | Values |
|-----------|------|---------|-------------|---------|
| `aspect_ratio` | enum | "16:9" | The aspect ratio of the generated video | "16:9", "9:16", "1:1" |
| `duration` | enum | "8s" | Duration of the generated video | "8s" |
| `negative_prompt` | string | - | A negative prompt to guide generation | Any text |
| `enhance_prompt` | boolean | true | Whether to enhance the video generation | true, false |
| `seed` | integer | - | A seed for reproducible results | 0-2147483647 |
| `auto_fix` | boolean | true | Automatically fix content policy violations | true, false |
| `resolution` | enum | "720p" | The resolution of the generated video | "720p", "1080p" |
| `generate_audio` | boolean | true | Whether to generate audio | true, false |

## Output Format

### Success Response

```json
{
  "video": {
    "url": "https://v3.fal.media/files/penguin/Q-2dpcjIoQOldJRL3grsc_output.mp4",
    "content_type": "video/mp4",
    "file_name": "output.mp4",
    "file_size": 1234567
  },
  "requestId": "764cabcf-b745-4b3e-ae38-1200304cf45b"
}
```

## Pricing & Cost Calculation

### Pricing Structure

- **Audio Off**: $0.25 per second
- **Audio On**: $0.40 per second
- **Cost Savings**: 60-80% cheaper than standard Veo 3

### Cost Examples

| Duration | Audio | Cost | Use Case |
|----------|-------|------|----------|
| 8 seconds | Off | $2.00 | Cost-effective content, silent videos |
| 8 seconds | On | $3.20 | Professional content with audio |

### Cost Optimization Tips

1. **Disable audio** for cost savings when audio isn't needed
2. **Use 720p resolution** for faster generation and lower costs
3. **Batch processing** with queue system for multiple videos
4. **Enable auto_fix** to avoid regeneration costs from policy violations

## Best Practices

### Prompt Engineering

1. **Be Descriptive**: Include specific details about characters, settings, and actions
2. **Set the Scene**: Describe the environment, lighting, and atmosphere
3. **Specify Actions**: Detail what characters or objects are doing
4. **Include Audio Elements**: Describe dialogue, sound effects, and ambient noise
5. **Use Natural Language**: Write as you would describe to another person

#### Good Prompt Examples

✅ **Detailed with Audio:**
```
"A casual street interview on a busy New York City sidewalk in the afternoon. The interviewer holds a plain, unbranded microphone and asks: Have you seen Google's new Veo3 model? It is a super good model. Person replies: Yeah I saw it, it's already available on fal. It's crazy good."
```

✅ **Visual Scene with Actions:**
```
"A futuristic city street during rush hour with flying cars zooming between skyscrapers, neon lights illuminating the scene, and people walking on elevated walkways with holographic advertisements everywhere."
```

#### Poor Prompt Examples

❌ **Too Vague:**
```
"A city"
```

❌ **Too Abstract:**
```
"Something cool"
```

❌ **Missing Audio Context:**
```
"A person talking" (without specifying what they're saying)
```

### Parameter Optimization

- **Aspect Ratio**: Choose based on your content platform (16:9 for landscape, 9:16 for mobile)
- **Resolution**: Use 720p for cost efficiency, 1080p for quality
- **Audio**: Enable for engaging content, disable for cost savings
- **Prompt Enhancement**: Keep enabled for better results
- **Auto-fix**: Keep enabled to avoid content policy issues

## Error Handling

### Common Error Types

1. **Authentication Errors**
   ```typescript
   try {
     const result = await fal.subscribe("fal-ai/veo3/fast", {
       input: { prompt: "..." }
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
     const result = await fal.subscribe("fal-ai/veo3/fast", {
       input: { prompt: "" } // Empty prompt
     });
   } catch (error) {
     if (error.message.includes("prompt")) {
       console.error("Prompt cannot be empty");
     }
   }
   ```

3. **Content Policy Violations**
   ```typescript
   try {
     const result = await fal.subscribe("fal-ai/veo3/fast", {
       input: { prompt: "..." }
     });
   } catch (error) {
     if (error.message.includes("content policy")) {
       console.error("Content violates policy. Enable auto_fix or revise prompt.");
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

export const VideoGenerator: React.FC<VideoGeneratorProps> = ({ apiKey }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [generateAudio, setGenerateAudio] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  fal.config({ credentials: apiKey });

  const generateVideo = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const result = await fal.subscribe("fal-ai/veo3/fast", {
        input: { 
          prompt, 
          aspect_ratio: aspectRatio, 
          resolution, 
          generate_audio: generateAudio 
        }
      });

      setVideoUrl(result.video.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate video');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="video-generator">
      <h2>Generate Video with Veo 3 Fast</h2>
      
      <div className="input-group">
        <label htmlFor="prompt">Video Description:</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the video you want to generate..."
          rows={4}
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
        <label htmlFor="resolution">Resolution:</label>
        <select
          id="resolution"
          value={resolution}
          onChange={(e) => setResolution(e.target.value as '720p' | '1080p')}
        >
          <option value="720p">720p (Cost-effective)</option>
          <option value="1080p">1080p (High Quality)</option>
        </select>
      </div>

      <div className="input-group">
        <label>
          <input
            type="checkbox"
            checked={generateAudio}
            onChange={(e) => setGenerateAudio(e.target.checked)}
          />
          Generate Audio (${generateAudio ? '3.20' : '2.00'} for 8s video)
        </label>
      </div>

      <button 
        onClick={generateVideo} 
        disabled={isGenerating || !prompt.trim()}
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

#### 1. Poor Quality Output

**Problem**: Generated videos don't match prompt expectations

**Solutions**:
- Enable prompt enhancement
- Write more detailed, descriptive prompts
- Include specific visual and audio details
- Use appropriate aspect ratio and resolution

#### 2. Generation Failures

**Problem**: API calls fail or return errors

**Solutions**:
- Verify API key is valid and has sufficient credits
- Check prompt content for policy violations
- Enable auto_fix for automatic prompt correction
- Ensure proper error handling in your code

#### 3. Content Policy Violations

**Problem**: Prompts fail content policy checks

**Solutions**:
- Enable auto_fix for automatic correction
- Review and revise prompt content
- Avoid potentially problematic topics
- Use clear, appropriate language

### Getting Help

- **Documentation**: [fal.ai docs](https://docs.fal.ai)
- **Community**: [fal.ai Discord](https://discord.gg/fal-ai)
- **Support**: Contact fal.ai support for technical issues
- **Model Page**: [fal.ai/models/fal-ai/veo3/fast](https://fal.ai/models/fal-ai/veo3/fast)

## Conclusion

The Google Veo 3 Fast model provides an excellent balance of quality, speed, and cost-effectiveness for text-to-video generation. It's particularly valuable for content creators, marketers, and developers who need professional-grade videos with synchronized audio at a fraction of the cost of standard Veo 3.

By following the best practices outlined in this guide, you can maximize the quality of your generated videos while minimizing costs. The model's audio generation capabilities, flexible parameters, and cost optimization options make it a versatile choice for various content creation needs.
