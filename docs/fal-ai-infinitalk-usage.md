# Fal AI Infinitalk Usage Guide

## Overview

The **Fal AI Infinitalk** model (fal-ai/infinitalk) is an advanced AI model specialized in generating talking head videos with synchronized lip-sync capabilities. This model can create realistic talking head videos from a single image and audio file, offering precise lip-sync and natural facial expressions.

The model costs $0.3 per second of output video, with 720p resolution doubling the cost. This makes it an excellent choice for creating professional talking head content, educational materials, and personalized video messages.

## Key Features

- **Talking Head Generation**: Create realistic talking head videos from images and audio
- **Precise Lip-Sync**: Advanced algorithms for natural speech synchronization
- **Flexible Resolution**: Choose between 480p (cost-effective) and 720p (high quality)
- **Frame Count Control**: Customize video length from 1.4 to 24 seconds
- **Acceleration Options**: Balance between speed and quality
- **Seed-Based Reproducibility**: Ensure consistent results with seed values
- **Queue Processing**: Handle long-running requests asynchronously
- **Cost-Effective Pricing**: Pay only for the video duration you generate

## Input Parameters

### Required Parameters

- **`image_url`** (string): URL of the input image file (headshot)
- **`audio_url`** (string): URL of the input audio file
- **`prompt`** (string): Text description to guide video generation

### Optional Parameters

- **`num_frames`** (integer): Number of frames to generate (41-721, default: 145)
- **`resolution`** (string): Output resolution ('480p' or '720p', default: '480p')
- **`seed`** (integer): Random seed for reproducible results (0-999999, default: 42)
- **`acceleration`** (string): Processing speed ('none', 'regular', 'high', default: 'regular')

## Pricing Structure

- **$0.3 per second** of output video
- **720p resolution doubles the cost**

### Cost Examples

| Frames | Resolution | Duration | Cost |
|--------|------------|----------|------|
| 60 | 480p | 2s | $0.60 |
| 145 | 480p | 4.8s | $1.44 |
| 300 | 720p | 10s | $6.00 |
| 600 | 480p | 20s | $6.00 |

## Usage Examples

### Basic Generation

```typescript
import { FalAiInfinitalkExecutor } from './executors/fal-ai-infinitalk';

const executor = new FalAiInfinitalkExecutor();

const result = await executor.generateVideo({
  image_url: 'https://example.com/headshot.jpg',
  audio_url: 'https://example.com/presentation.mp3',
  prompt: 'Create a professional talking head video with confident expression',
  num_frames: 145,
  resolution: '480p'
});
```

### Queue Processing

```typescript
const queueResult = await executor.submitToQueue({
  image_url: 'https://example.com/headshot.jpg',
  audio_url: 'https://example.com/long-presentation.mp3',
  prompt: 'Create a professional presentation video',
  num_frames: 600,
  resolution: '480p'
});
```

## Best Practices

- Use high-quality, clear headshots with good lighting
- Ensure the face is clearly visible and centered
- Use clear, high-quality audio with minimal background noise
- Start with lower frame counts for testing
- Use 480p resolution for cost efficiency
- Choose appropriate acceleration settings

## Common Use Cases

- Talking head videos for presentations
- Educational content with synchronized speech
- Marketing videos with personalized messages
- Customer service announcements
- Training and onboarding materials
- Social media content creation
- Virtual assistant avatars

## Technical Considerations

- Maximum of 721 frames (24 seconds at 30fps)
- 720p resolution doubles the cost
- Processing time increases with frame count
- Queue processing recommended for longer videos
- Supports common image and audio formats

## Error Handling

The executor provides comprehensive error handling with specific error codes for missing parameters, invalid values, and generation failures.

## Integration

- Uses @fal-ai/client for API communication
- Requires FAL_KEY environment variable
- Supports webhooks for asynchronous processing
- Comprehensive error handling and validation
