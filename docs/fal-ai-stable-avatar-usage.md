# Fal AI Stable Avatar - Usage Guide

## Overview

Fal AI Stable Avatar generates audio-driven video avatars up to five minutes long with natural lip-sync and facial expressions. This powerful model transforms static images into dynamic, speaking avatars by combining reference images with audio files and text prompts.

## Key Features

- **Audio-driven generation**: Creates videos that sync with provided audio files
- **Natural lip-sync**: Advanced technology for realistic mouth movements
- **Facial expressions**: Generates natural facial expressions and movements
- **Background preservation**: Maintains the original image's background and lighting
- **Flexible duration**: Support for videos from 4 seconds to 5 minutes
- **Multiple aspect ratios**: 16:9, 1:1, 9:16, and auto-detection
- **Customizable parameters**: Fine-tune guidance scales, inference steps, and more

## Input Parameters

### Required Parameters

- **`image_url`** (string): URL of the reference image for the avatar
- **`audio_url`** (string): URL of the audio file to sync with
- **`prompt`** (string): Text description of desired facial expressions and movements

### Optional Parameters

- **`aspect_ratio`** (string): Video aspect ratio - "16:9", "1:1", "9:16", or "auto"
- **`guidance_scale`** (number): Controls adherence to prompt (1.0-20.0, default: 5)
- **`audio_guidance_scale`** (number): Controls lip-sync accuracy (1.0-20.0, default: 4)
- **`num_inference_steps`** (integer): Generation quality vs. speed (10-100, default: 50)
- **`seed`** (integer): Random seed for reproducible results
- **`perturbation`** (number): Variation amount (0.0-1.0, default: 0.1)

## Pricing Structure

- **Base cost**: $0.10 per generated second
- **Minimum duration**: 4 seconds ($0.40 minimum)
- **Maximum duration**: Up to 5 minutes (300 seconds)
- **Cost calculation**: Duration × $0.10 (minimum $0.40)

## Usage Examples

### Basic Avatar Generation

```typescript
import { FalAiStableAvatarExecutor } from './executors/fal-ai-stable-avatar';

const executor = new FalAiStableAvatarExecutor('YOUR_API_KEY');

const result = await executor.generateAvatar({
  image_url: 'https://example.com/reference-image.jpg',
  audio_url: 'https://example.com/audio-file.mp3',
  prompt: 'A person speaking naturally with minimal movements'
});

console.log('Generated video:', result.video.url);
```

### Advanced Configuration

```typescript
const result = await executor.generateAvatar({
  image_url: 'https://example.com/reference-image.jpg',
  audio_url: 'https://example.com/audio-file.mp3',
  prompt: 'A professional speaker with confident posture, natural blinking',
  aspect_ratio: '16:9',
  guidance_scale: 6,
  audio_guidance_scale: 5,
  num_inference_steps: 60,
  perturbation: 0.15
});
```

### Queue-based Processing

```typescript
// Submit request for long videos
const { request_id } = await executor.submitAvatarGenerationRequest({
  image_url: 'https://example.com/reference-image.jpg',
  audio_url: 'https://example.com/audio-file.mp3',
  prompt: 'A person speaking naturally'
});

// Check status
const status = await executor.checkRequestStatus(request_id);

// Get result when complete
const result = await executor.getRequestResult(request_id);
```

## Best Practices

### Image Selection
- Use high-quality reference images with clear facial features
- Ensure good lighting and contrast
- Choose images with appropriate backgrounds for your use case

### Audio Quality
- Use clear, high-quality audio files
- Avoid background noise and distortion
- Ensure proper audio levels and clarity

### Prompt Writing
- Be specific about desired facial expressions
- Describe movement patterns and posture
- Keep prompts under 2000 characters
- Focus on natural, human-like behaviors

### Parameter Tuning
- Start with default values and adjust gradually
- Use guidance scales between 3-7 for optimal results
- Test different perturbation values (0.05-0.2)
- Balance quality vs. processing time with inference steps

## Common Use Cases

### Virtual Avatars
- Digital humans for virtual events
- AI presenters and hosts
- Virtual customer service representatives

### Content Creation
- Video tutorials and presentations
- Educational content and training materials
- Marketing and promotional videos

### Social Media
- Influencer content creation
- Brand personality videos
- Engaging social media posts

### Corporate Applications
- Company presentations and announcements
- Training and onboarding materials
- Internal communications

## Technical Considerations

### File Formats
- **Input images**: JPG, JPEG, PNG, WEBP
- **Input audio**: MP3, WAV, AAC, OGG
- **Output video**: MP4

### Processing Time
- Varies based on video duration and server load
- Longer videos require more processing time
- Use queue system for videos over 1 minute

### Quality Optimization
- Higher inference steps = better quality but slower processing
- Balance guidance scales for optimal results
- Use appropriate aspect ratios for target platforms

## Error Handling

```typescript
try {
  const result = await executor.generateAvatar(input);
  // Handle success
} catch (error) {
  if (error.code === 'EXECUTION_ERROR') {
    console.error('Generation failed:', error.message);
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

## Cost Optimization

- Start with shorter durations for testing
- Use appropriate guidance scales to avoid regeneration
- Plan content to maximize value per second
- Consider batch processing for multiple avatars

## Support and Resources

- **API Documentation**: [fal.ai/models/fal-ai/stable-avatar/api](https://fal.ai/models/fal-ai/stable-avatar/api)
- **Community**: [Discord](https://discord.com/invite/fal-ai)
- **Support**: support@fal.ai
- **Examples**: [fal.ai/models/fal-ai/stable-avatar](https://fal.ai/models/fal-ai/stable-avatar)

## Migration from Other Platforms

The Stable Avatar API follows industry standards with intuitive parameter naming. Key differences:
- Uses `@fal-ai/client` library
- Supports longer video durations (up to 5 minutes)
- Advanced lip-sync and facial expression control
- Comprehensive background preservation
