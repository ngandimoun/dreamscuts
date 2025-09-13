# Fal AI WAN v2.2-14b Speech-to-Video Usage Guide

## Overview

The **Fal AI WAN v2.2-14b Speech-to-Video** model (`fal-ai/wan/v2.2-14b/speech-to-video`) is an advanced AI model specialized in generating high-quality video clips from speech audio using the WAN v2.2-14b architecture. This model excels at creating dynamic, engaging videos by combining descriptive text prompts with audio input, offering multiple artistic styles and flexible output options.

The model offers cost-effective pricing that scales with resolution and duration: $0.15 for 360p/540p, $0.20 for 720p, and $0.40 for 1080p. 8-second videos cost double the base price.

## Key Features

- **Speech-to-Video Generation**: Convert audio speech into synchronized video content
- **Multiple Artistic Styles**: Support for anime, 3D animation, clay, comic, and cyberpunk styles
- **Flexible Output Options**: Multiple aspect ratios (16:9, 4:3, 1:1, 3:4, 9:16) and resolutions (360p, 540p, 720p, 1080p)
- **Duration Control**: 5-second and 8-second video options with pricing implications
- **Cost Optimization**: Resolution-based pricing with duration multipliers
- **Queue Management**: Asynchronous processing for long-running requests
- **Real-time Logs**: Progress monitoring during video generation
- **Webhook Support**: Production-ready callback integration

## Input Parameters

### Required Parameters

- **`prompt`** (string, 1-2000 chars): Text description of the video content to generate from the audio
- **`audio_url`** (string): URL of the audio file to use as input for video generation

### Optional Parameters

- **`aspect_ratio`** (enum): Video aspect ratio - `16:9`, `4:3`, `1:1`, `3:4`, `9:16` (default: `16:9`)
- **`resolution`** (enum): Video resolution - `360p`, `540p`, `720p`, `1080p` (default: `720p`)
- **`duration`** (enum): Video duration - `5`, `8` seconds (default: `5`)
- **`negative_prompt`** (string, max 2000 chars): Text describing elements to avoid in the video
- **`style`** (enum): Artistic style - `anime`, `3d_animation`, `clay`, `comic`, `cyberpunk`
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

### Basic Speech-to-Video Generation

```typescript
import { FalAiWanV2_2_14bSpeechToVideoExecutor } from './executors/fal-ai-wan-v2-2-14b-speech-to-video';

const executor = new FalAiWanV2_2_14bSpeechToVideoExecutor('YOUR_API_KEY');

const input = {
  prompt: "A woman warrior with her hammer walking with her glacier wolf",
  audio_url: "https://example.com/audio.mp3",
  aspect_ratio: "16:9",
  resolution: "720p",
  duration: "5",
  style: "anime"
};

try {
  const result = await executor.generateVideo(input);
  console.log('Generated video URL:', result.video.url);
} catch (error) {
  console.error('Error generating video:', error);
}
```

### Queue-Based Processing for Long Operations

```typescript
// Submit request to queue
const { request_id } = await executor.submitSpeechToVideoRequest(input, 'https://your-webhook.com/callback');

// Check status
const status = await executor.checkRequestStatus(request_id);
console.log('Request status:', status.status);

// Get result when complete
if (status.status === 'COMPLETED') {
  const result = await executor.getRequestResult(request_id);
  console.log('Video URL:', result.video.url);
}
```

### Cost Calculation

```typescript
const cost = executor.calculateCost('720p', '8');
console.log(`Cost for 8s 720p video: $${cost}`); // Output: $0.40
```

### Style Variations

```typescript
const styles = ['anime', '3d_animation', 'clay', 'comic', 'cyberpunk'];

for (const style of styles) {
  const input = {
    prompt: "A peaceful forest scene with birds singing",
    audio_url: "https://example.com/forest-audio.mp3",
    style: style,
    resolution: "720p",
    duration: "5"
  };
  
  const result = await executor.generateVideo(input);
  console.log(`${style} style video:`, result.video.url);
}
```

## Best Practices

### 1. Prompt Engineering
- Use clear, descriptive prompts that complement the audio content
- Include visual details that align with the audio narrative
- Keep prompts under 2000 characters for optimal performance

### 2. Audio Quality
- Use high-quality audio files for better video generation
- Ensure audio is clear and well-recorded
- Consider audio length matching your desired video duration

### 3. Resolution Selection
- Choose 360p/540p for cost-effective testing and social media
- Use 720p for standard quality content
- Reserve 1080p for high-quality productions

### 4. Style Selection
- **Anime**: Best for cartoon-like, stylized content
- **3D Animation**: Ideal for modern, computer-generated aesthetics
- **Clay**: Great for artistic, textured visuals
- **Comic**: Perfect for graphic novel-style content
- **Cyberpunk**: Excellent for futuristic, high-tech themes

### 5. Cost Optimization
- Use 5-second videos for cost-effective content creation
- Reserve 8-second videos for premium content
- Balance resolution quality with cost considerations

## Common Use Cases

### Educational Content
- Convert audio lectures into engaging video presentations
- Create visual aids for educational materials
- Generate video summaries from audio content

### Marketing and Promotion
- Transform voice recordings into promotional videos
- Create video content from podcast episodes
- Generate visual content from audio interviews

### Content Creation
- Produce video content from audio books
- Create animated videos from speech recordings
- Generate video summaries from audio meetings

### Social Media
- Convert voice notes into shareable video content
- Create engaging content from audio clips
- Generate platform-optimized video formats

## Technical Considerations

### API Rate Limits
- Monitor your Fal AI plan limits
- Implement appropriate retry logic
- Use queue-based processing for high-volume usage

### Error Handling
- Implement comprehensive error handling
- Check for specific error codes
- Provide user-friendly error messages

### File Management
- Handle generated video URLs appropriately
- Consider video file sizes and storage
- Implement cleanup for temporary files

## Advanced Features

### Queue Management
```typescript
// Submit multiple requests
const requests = [];
for (let i = 0; i < 5; i++) {
  const request = executor.submitSpeechToVideoRequest(inputs[i]);
  requests.push(request);
}

// Monitor all requests
const results = await Promise.all(requests);
```

### Webhook Integration
```typescript
const webhookUrl = 'https://your-app.com/api/video-complete';

const { request_id } = await executor.submitSpeechToVideoRequest(input, webhookUrl);

// Your webhook endpoint will receive updates when the video is complete
```

### Batch Processing
```typescript
const batchInputs = [
  { prompt: "Scene 1", audio_url: "audio1.mp3" },
  { prompt: "Scene 2", audio_url: "audio2.mp3" },
  { prompt: "Scene 3", audio_url: "audio3.mp3" }
];

const batchResults = [];
for (const input of batchInputs) {
  const result = await executor.generateVideo(input);
  batchResults.push(result);
}
```

## Performance Optimization

### 1. Request Batching
- Group related requests together
- Use appropriate concurrency limits
- Monitor API response times

### 2. Caching Strategies
- Cache generated videos when possible
- Implement result storage for reuse
- Consider CDN integration for video delivery

### 3. Monitoring and Analytics
- Track generation success rates
- Monitor cost per video
- Analyze user preferences and patterns

## Troubleshooting

### Common Issues

1. **Audio URL Invalid**
   - Ensure the audio file is publicly accessible
   - Check file format compatibility
   - Verify URL structure

2. **Prompt Too Long**
   - Reduce prompt length to under 2000 characters
   - Focus on essential visual elements
   - Use concise, descriptive language

3. **Generation Timeouts**
   - Use queue-based processing for long operations
   - Implement proper timeout handling
   - Monitor request status regularly

4. **Style Not Applied**
   - Verify style parameter is correctly set
   - Check for typos in style names
   - Ensure style is supported by the model

### Error Codes

- `EXECUTION_ERROR`: General execution failure
- `UNKNOWN_ERROR`: Unexpected system error
- `VALIDATION_ERROR`: Input validation failure
- `API_ERROR`: Fal AI API communication error

## Integration Examples

### Next.js Integration

```typescript
// pages/api/generate-video.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { FalAiWanV2_2_14bSpeechToVideoExecutor } from '../../../executors/fal-ai-wan-v2-2-14b-speech-to-video';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const executor = new FalAiWanV2_2_14bSpeechToVideoExecutor(process.env.FAL_KEY!);
    const result = await executor.generateVideo(req.body);
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### React Component

```typescript
// components/SpeechToVideoGenerator.tsx
import React, { useState } from 'react';
import { FalAiWanV2_2_14bSpeechToVideoExecutor } from '../executors/fal-ai-wan-v2-2-14b-speech-to-video';

export const SpeechToVideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const executor = new FalAiWanV2_2_14bSpeechToVideoExecutor(process.env.REACT_APP_FAL_KEY!);
      const videoResult = await executor.generateVideo({
        prompt,
        audio_url: audioUrl,
        resolution: '720p',
        duration: '5'
      });
      setResult(videoResult);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Describe the video content..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <input
        type="text"
        placeholder="Audio file URL..."
        value={audioUrl}
        onChange={(e) => setAudioUrl(e.target.value)}
      />
      <button onClick={handleGenerate} disabled={generating}>
        {generating ? 'Generating...' : 'Generate Video'}
      </button>
      {result && (
        <div>
          <h3>Generated Video:</h3>
          <video controls src={result.video.url} />
        </div>
      )}
    </div>
  );
};
```

## Conclusion

The Fal AI WAN v2.2-14b Speech-to-Video model provides a powerful and flexible solution for converting audio speech into engaging video content. With its multiple style options, resolution controls, and cost-effective pricing, it's an excellent choice for content creators, educators, marketers, and developers looking to add video generation capabilities to their applications.

By following the best practices outlined in this guide and leveraging the advanced features like queue management and webhook integration, you can create robust, scalable video generation workflows that enhance your content creation capabilities.
