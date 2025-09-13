# AI Avatar Multi Usage Guide

## Overview

The **AI Avatar Multi** model is a powerful tool for generating multi-person conversation videos from images and audio files using fal.ai's MultiTalk technology. This model creates realistic scenes where multiple people speak in sequence, making it ideal for podcast videos, interviews, educational content, and social media videos.

## Key Features

- **Multi-Person Avatar Generation**: Create realistic conversation videos with multiple speakers
- **Audio-Driven Animation**: Synchronize avatar movements with audio input
- **Flexible Audio Support**: Support for single or dual audio files
- **Resolution Options**: Choose between 480p (cost-effective) and 720p (high-quality)
- **Frame Control**: Generate videos with 81-129 frames for optimal performance
- **Cost-Effective Pricing**: $0.30 per second with resolution and frame multipliers
- **Queue Support**: Asynchronous processing for longer videos
- **Real-time Progress Monitoring**: Track generation progress with detailed logs

## Input Parameters

### Required Parameters

- **`image_url`** (string): URL of the input image showing the scene/people
- **`first_audio_url`** (string): URL of the first person's audio file
- **`prompt`** (string): Detailed description of the scene and conversation

### Optional Parameters

- **`second_audio_url`** (string): URL of the second person's audio file (optional)
- **`num_frames`** (integer): Number of frames to generate (81-129, default: 181)
- **`resolution`** (enum): Video resolution - "480p" or "720p" (default: "480p")
- **`seed`** (integer): Random seed for reproducibility (default: 81)
- **`use_only_first_audio`** (boolean): Whether to use only the first audio file
- **`acceleration`** (enum): Processing speed - "none", "regular", or "high" (default: "regular")

## Pricing Structure

### Base Cost
- **$0.30 per second** of output video

### Multipliers
- **720p Resolution**: 2x cost multiplier
- **Frames > 81**: 1.25x cost multiplier

### Cost Examples
- 480p, 81 frames: $0.30 per second
- 480p, 181 frames: $0.375 per second
- 720p, 81 frames: $0.60 per second
- 720p, 181 frames: $0.75 per second

## Usage Examples

### Basic Multi-Person Conversation

```typescript
import { AiAvatarMultiExecutor } from './executors/ai-avatar-multi';

const executor = new AiAvatarMultiExecutor();

const result = await executor.generateMultiAvatar({
  image_url: "https://example.com/podcast_scene.png",
  first_audio_url: "https://example.com/host_audio.mp3",
  second_audio_url: "https://example.com/guest_audio.mp3",
  prompt: "A smiling man and woman wearing headphones sit in front of microphones, appearing to host a podcast. They are engaged in conversation, looking at each other and the camera as they speak.",
  resolution: "480p",
  num_frames: 181
});

console.log('Generated video URL:', result.video.url);
```

### Single Audio (One Person Speaking)

```typescript
const result = await executor.generateMultiAvatar({
  image_url: "https://example.com/single_speaker.png",
  first_audio_url: "https://example.com/speaker_audio.mp3",
  prompt: "A professional speaker stands at a podium, addressing an audience with confidence and enthusiasm.",
  use_only_first_audio: true,
  resolution: "720p"
});
```

### Queue-Based Processing (Long Videos)

```typescript
// Submit to queue
const { request_id } = await executor.submitToQueue({
  image_url: "https://example.com/interview_scene.png",
  first_audio_url: "https://example.com/interviewer.mp3",
  second_audio_url: "https://example.com/interviewee.mp3",
  prompt: "A professional interviewer and interviewee sit across from each other at a table. Both are well-dressed and maintain eye contact during their conversation.",
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
- Ensure proper synchronization between speakers
- Consider audio length relative to frame count
- Test audio clarity before submission

### Prompt Writing
- Be specific about the scene and conversation context
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
- **Interview Videos**: Create professional interview presentations
- **Educational Content**: Generate talking head videos for courses
- **Social Media**: Create engaging content for platforms like TikTok, Instagram

### Professional Applications
- **Corporate Presentations**: Add visual elements to audio presentations
- **Training Videos**: Create instructional content with multiple speakers
- **Marketing Content**: Generate promotional videos with conversations
- **Event Recordings**: Convert event audio to visual content

### Creative Projects
- **Storytelling**: Create narrative videos with multiple characters
- **Music Videos**: Generate visual content for audio tracks
- **Art Projects**: Combine images and audio for multimedia art
- **Entertainment**: Create engaging content for various audiences

## Technical Considerations

### Frame Count Optimization
- **81 frames**: Minimum, most cost-effective
- **129 frames**: Maximum, highest quality
- **181 frames**: Default, balanced approach
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
import { AiAvatarMultiExecutor } from './executors/ai-avatar-multi';

const AvatarMultiGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async (formData: any) => {
    setIsGenerating(true);
    try {
      const executor = new AiAvatarMultiExecutor();
      const videoResult = await executor.generateMultiAvatar(formData);
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
        {isGenerating ? 'Generating...' : 'Generate Video'}
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
import { AiAvatarMultiExecutor } from './executors/ai-avatar-multi';

const app = express();
app.use(express.json());

app.post('/api/generate-avatar-multi', async (req, res) => {
  try {
    const executor = new AiAvatarMultiExecutor();
    const result = await executor.generateMultiAvatar(req.body);
    
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

The AI Avatar Multi model provides a powerful solution for creating engaging multi-person conversation videos. With its flexible audio support, cost-effective pricing, and high-quality output, it's ideal for content creators, marketers, educators, and anyone looking to bring static images to life with dynamic conversations.

By following the best practices outlined in this guide and leveraging the comprehensive features of the model, you can create professional-quality video content that engages your audience and enhances your creative projects.
