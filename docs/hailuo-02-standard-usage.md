# MiniMax Hailuo-02 Standard - Text-to-Video Generation

## Overview

The **MiniMax Hailuo-02 Standard** is an advanced text-to-video generation model that offers high-quality video creation at an affordable price point. This model excels at creating engaging videos from text descriptions with 768p resolution and flexible duration options.

### Key Features

- **Cost-Effective**: Only $0.045 per second of generated video
- **High Quality**: 768p resolution output for professional results
- **Flexible Duration**: Choose between 6 or 10 seconds
- **Prompt Optimization**: Built-in AI prompt enhancement for better results
- **Fast Processing**: Quick generation and reliable output
- **Simple Workflow**: Text-to-video with minimal parameter tuning

### Use Cases

- Social media content creation
- Marketing and advertising videos
- Educational content
- Product demonstrations
- Creative storytelling
- Quick video prototypes
- Content marketing campaigns
- Social media engagement

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

Generate a video with default settings (6 seconds, 768p):

```typescript
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/minimax/hailuo-02/standard/text-to-video", {
  input: {
    prompt: "A peaceful forest scene with sunlight filtering through trees and birds flying overhead"
  }
});

console.log("Video URL:", result.video.url);
console.log("Request ID:", result.requestId);
```

### Custom Duration

Generate a 10-second video:

```typescript
const result = await fal.subscribe("fal-ai/minimax/hailuo-02/standard/text-to-video", {
  input: {
    prompt: "A futuristic city with flying cars and neon lights illuminating the skyline",
    duration: "10"
  }
});
```

### With Prompt Optimization

Enable the built-in prompt optimizer for enhanced results:

```typescript
const result = await fal.subscribe("fal-ai/minimax/hailuo-02/standard/text-to-video", {
  input: {
    prompt: "A Galactic Smuggler with a cybernetic arm navigating through a space station",
    duration: "10",
    prompt_optimizer: true
  }
});
```

## Advanced Usage

### Queue-Based Processing

For long-running requests, use the queue system:

```typescript
// Submit to queue
const { request_id } = await fal.queue.submit("fal-ai/minimax/hailuo-02/standard/text-to-video", {
  input: {
    prompt: "A detailed scene of a medieval castle with knights and dragons",
    duration: "10",
    prompt_optimizer: true
  },
  webhookUrl: "https://your-webhook-url.com/notify"
});

console.log("Request ID:", request_id);
```

### Check Queue Status

Monitor the progress of your queued request:

```typescript
const status = await fal.queue.status("fal-ai/minimax/hailuo-02/standard/text-to-video", {
  requestId: "your-request-id",
  logs: true
});

console.log("Status:", status.status);
console.log("Progress:", status.progress);
```

### Get Queue Result

Retrieve the completed video:

```typescript
const result = await fal.queue.result("fal-ai/minimax/hailuo-02/standard/text-to-video", {
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
| `duration` | enum | "6" | Duration of the generated video in seconds | "6", "10" |
| `prompt_optimizer` | boolean | true | Whether to use the model's prompt optimizer | true, false |

## Output Format

### Success Response

```json
{
  "video": {
    "url": "https://v3.fal.media/files/kangaroo/_qEOfY3iKHsc86kqHUUh2_output.mp4",
    "content_type": "video/mp4",
    "file_name": "output.mp4",
    "file_size": 1234567
  },
  "requestId": "764cabcf-b745-4b3e-ae38-1200304cf45b"
}
```

## Pricing & Cost Calculation

### Pricing Structure

- **Base Rate**: $0.045 per second of generated video
- **6-second video**: $0.27
- **10-second video**: $0.45

### Cost Examples

| Duration | Cost | Use Case |
|----------|------|----------|
| 6 seconds | $0.27 | Quick social media posts, simple scenes |
| 10 seconds | $0.45 | Complex narratives, detailed scenes |

## Best Practices

### Prompt Engineering

1. **Be Descriptive**: Include specific details about characters, settings, and actions
2. **Set the Scene**: Describe the environment, lighting, and atmosphere
3. **Specify Actions**: Detail what characters or objects are doing
4. **Use Natural Language**: Write as you would describe to another person

#### Good Prompt Examples

✅ **Detailed and Specific:**
```
"A peaceful forest scene with sunlight filtering through trees, birds flying overhead, and a gentle breeze rustling the leaves. The forest floor is covered in fallen leaves and patches of sunlight create warm golden pools on the ground."
```

✅ **Action-Oriented:**
```
"A futuristic city street during rush hour with flying cars zooming between skyscrapers, neon lights illuminating the scene, and people walking on elevated walkways with holographic advertisements everywhere."
```

#### Poor Prompt Examples

❌ **Too Vague:**
```
"A forest"
```

❌ **Too Abstract:**
```
"Something cool"
```

### Duration Selection

- **6 seconds**: Simple scenes, quick content, cost-effective generation
- **10 seconds**: Complex narratives, detailed scenes, when you need more time

## Error Handling

### Common Error Types

1. **Authentication Errors**
   ```typescript
   try {
     const result = await fal.subscribe("fal-ai/minimax/hailuo-02/standard/text-to-video", {
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
     const result = await fal.subscribe("fal-ai/minimax/hailuo-02/standard/text-to-video", {
       input: { prompt: "" } // Empty prompt
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

export const VideoGenerator: React.FC<VideoGeneratorProps> = ({ apiKey }) => {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState<'6' | '10'>('6');
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
      const result = await fal.subscribe("fal-ai/minimax/hailuo-02/standard/text-to-video", {
        input: { prompt, duration, prompt_optimizer: true }
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
      <h2>Generate Video with Hailuo-02 Standard</h2>
      
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
        <label htmlFor="duration">Duration:</label>
        <select
          id="duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value as '6' | '10')}
        >
          <option value="6">6 seconds ($0.27)</option>
          <option value="10">10 seconds ($0.45)</option>
        </select>
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
- Enable prompt optimizer
- Write more detailed, descriptive prompts
- Include specific visual details
- Use appropriate duration for scene complexity

#### 2. Generation Failures

**Problem**: API calls fail or return errors

**Solutions**:
- Verify API key is valid and has sufficient credits
- Check prompt content for policy violations
- Ensure proper error handling in your code
- Use queue system for long-running requests

### Getting Help

- **Documentation**: [fal.ai docs](https://docs.fal.ai)
- **Community**: [fal.ai Discord](https://discord.gg/fal-ai)
- **Support**: Contact fal.ai support for technical issues

## Conclusion

The MiniMax Hailuo-02 Standard model provides an excellent entry point into AI video generation with its cost-effective pricing and reliable performance. It's perfect for content creators, marketers, and developers who need to generate videos quickly and affordably.

By following the best practices outlined in this guide, you can maximize the quality of your generated videos while minimizing costs. The model's simplicity makes it accessible to beginners while still providing professional results for experienced users.
