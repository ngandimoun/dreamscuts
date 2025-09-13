# AI Avatar Usage Guide

## Overview

The **AI Avatar** model is a powerful tool for generating talking avatar videos from images and audio files using fal.ai's MultiTalk technology. This model creates realistic lip-sync animations with natural facial expressions, making it ideal for content creation, presentations, educational videos, and social media content.

## Key Features

- **Talking Avatar Generation**: Create realistic talking head videos from any image
- **Audio-Driven Animation**: Synchronize avatar movements with audio input
- **Natural Facial Expressions**: Advanced AI-powered facial animation
- **Flexible Resolution**: Choose between 480p (cost-effective) and 720p (high-quality)
- **Frame Control**: Generate videos with 81-129 frames for optimal performance
- **Cost-Effective Pricing**: $0.30 per second with resolution and frame multipliers
- **Queue Support**: Asynchronous processing for longer videos
- **Real-time Progress Monitoring**: Track generation progress with detailed logs

## Input Parameters

### Required Parameters

- **`image_url`** (string): URL of the input image showing the person/avatar
- **`audio_url`** (string): URL of the audio file for lip-sync
- **`prompt`** (string): Detailed description of the scene and context

### Optional Parameters

- **`num_frames`** (integer): Number of frames to generate (81-129, default: 145)
- **`resolution`** (enum): Video resolution - "480p" or "720p" (default: "480p")
- **`seed`** (integer): Random seed for reproducibility (default: 42)
- **`acceleration`** (enum): Processing speed - "none", "regular", or "high" (default: "regular")

## Pricing Structure

### Base Cost
- **$0.30 per second** of output video

### Multipliers
- **720p Resolution**: 2x cost multiplier
- **Frames > 81**: 1.25x cost multiplier

### Cost Examples
- 480p, 81 frames: $0.30 per second
- 480p, 145 frames: $0.375 per second
- 720p, 81 frames: $0.60 per second
- 720p, 145 frames: $0.75 per second

## Usage Examples

### Basic Avatar Generation

```typescript
import { AiAvatarExecutor } from './executors/ai-avatar';

const executor = new AiAvatarExecutor();

const result = await executor.generateAvatar({
  image_url: "https://example.com/podcast_host.png",
  audio_url: "https://example.com/podcast_audio.mp3",
  prompt: "A woman with colorful hair talking on a podcast.",
  resolution: "480p",
  num_frames: 145
});

console.log('Generated video URL:', result.video.url);
```

### High-Quality Professional Content

```typescript
const result = await executor.generateAvatar({
  image_url: "https://example.com/business_presenter.png",
  audio_url: "https://example.com/presentation_audio.mp3",
  prompt: "A professional business person giving a presentation with confidence.",
  resolution: "720p",
  num_frames: 129
});
```

### Queue-Based Processing (Long Videos)

```typescript
// Submit to queue
const { request_id } = await executor.submitToQueue({
  image_url: "https://example.com/educator.png",
  audio_url: "https://example.com/lecture_audio.mp3",
  prompt: "A knowledgeable educator explaining complex concepts with enthusiasm.",
  num_frames: 129,
  resolution: "720p"
}, "https://your-webhook-url.com/callback");

// Check status
const status = await executor.checkQueueStatus(request_id);
console.log('Status:', status.status);

// Get result when complete
const result = await executor.getQueueResult(request_id);
```

## Best Practices

### Image Selection
- Use high-quality images with clear facial features
- Ensure good lighting and contrast
- Choose images that match your desired scene composition
- Avoid images with too many people or complex backgrounds

### Audio Preparation
- Use clear, high-quality audio files
- Ensure proper audio length relative to frame count
- Test audio clarity before submission
- Consider audio format compatibility (MP3, WAV, AAC)

### Prompt Writing
- Be specific about the scene and context
- Describe facial expressions and body language
- Include details about the setting and atmosphere
- Mention camera angles and framing if important

### Cost Optimization
- Start with 480p resolution for testing
- Use 81 frames for shorter content
- Consider frame count carefully as it affects cost
- Use 720p only for professional/final content

## Use Cases

### Content Creation
- **Podcast Videos**: Convert audio podcasts to engaging video content
- **Presentation Videos**: Add visual elements to audio presentations
- **Educational Content**: Generate talking head videos for courses
- **Social Media**: Create engaging content for platforms like TikTok, Instagram

### Professional Applications
- **Corporate Training**: Create instructional content with talking avatars
- **Marketing Content**: Generate promotional videos with human-like presenters
- **Event Recordings**: Convert event audio to visual content
- **Accessibility**: Make content more accessible with visual elements

### Creative Projects
- **Storytelling**: Create narrative videos with talking characters
- **Entertainment**: Generate engaging content for various audiences
- **Art Projects**: Combine images and audio for multimedia art
- **Personal Branding**: Create consistent avatar content for social media

## Technical Considerations

### Frame Count Optimization
- **81 frames**: Minimum, most cost-effective
- **129 frames**: Maximum, highest quality
- **145 frames**: Default, balanced approach
- Higher frame counts increase cost by 1.25x

### Resolution Selection
- **480p**: Standard quality, base cost
- **720p**: High quality, 2x cost
- Choose based on intended use and budget

### Processing Time
- Varies by complexity and resolution
- Use queue system for longer videos
- Monitor progress with real-time updates
- Consider webhook notifications for completion

## Error Handling

### Common Issues
- **Invalid Image URL**: Ensure image is publicly accessible
- **Audio Format Issues**: Use supported audio formats (MP3, WAV, AAC)
- **Frame Count Errors**: Keep frames between 81-129
- **Authentication Errors**: Verify FAL_KEY environment variable

### Troubleshooting
- Check input validation messages
- Verify file accessibility and formats
- Monitor queue status for long-running requests
- Review logs for detailed error information

## Integration Examples

### React Component

```typescript
import React, { useState } from 'react';
import { AiAvatarExecutor } from './executors/ai-avatar';

const AvatarGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async (formData: any) => {
    setIsGenerating(true);
    try {
      const executor = new AiAvatarExecutor();
      const videoResult = await executor.generateAvatar(formData);
      setResult(videoResult);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      {/* Form components */}
      <button 
        onClick={() => handleGenerate(formData)} 
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Generate Avatar Video'}
      </button>
      
      {result && (
        <video controls src={result.video.url}>
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};
```

### Node.js API Endpoint

```typescript
import express from 'express';
import { AiAvatarExecutor } from './executors/ai-avatar';

const app = express();
app.use(express.json());

app.post('/api/generate-avatar', async (req, res) => {
  try {
    const executor = new AiAvatarExecutor();
    const result = await executor.generateAvatar(req.body);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Conclusion

The AI Avatar model provides a powerful solution for creating engaging talking avatar videos. With its natural facial expressions, cost-effective pricing, and high-quality output, it's ideal for content creators, marketers, educators, and anyone looking to bring static images to life with dynamic audio-driven animations.

By following the best practices outlined in this guide and leveraging the comprehensive features of the model, you can create professional-quality video content that engages your audience and enhances your creative projects.
