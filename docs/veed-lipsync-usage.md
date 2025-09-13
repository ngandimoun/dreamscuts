# Veed Lipsync Usage Guide

## Overview

The **Veed Lipsync** model is a powerful tool for generating realistic lipsync from any audio using VEED's latest technology. This model creates perfectly synchronized video content where audio and video are aligned, making it ideal for content creation, localization, dubbing, and accessibility applications.

## Key Features

- **Realistic Lipsync Generation**: Advanced AI-powered mouth movement synchronization
- **Audio-Video Synchronization**: Perfect alignment between audio and video content
- **Flexible Input Support**: Works with any video and audio formats
- **Cost-Effective Pricing**: $0.40 per minute of video content
- **Queue Support**: Asynchronous processing for longer videos
- **Real-time Progress Monitoring**: Track generation progress with detailed logs

## Basic Usage

### Simple Lipsync Generation

```typescript
import { VeedLipsyncExecutor } from './executors/veed-lipsync';

const executor = new VeedLipsyncExecutor();

const result = await executor.generateLipsync({
  video_url: "https://example.com/video.mp4",
  audio_url: "https://example.com/audio.mp3"
});

console.log('Generated lipsync video URL:', result.video.url);
```

### With Queue Processing

For longer videos or when you need to handle multiple requests:

```typescript
// Submit to queue
const { requestId } = await executor.submitToQueue({
  video_url: "https://example.com/long_video.mp4",
  audio_url: "https://example.com/narration.mp3"
});

// Check status
const status = await executor.checkStatus(requestId);
console.log('Status:', status.status);

// Get result when complete
if (status.status === 'COMPLETED') {
  const result = await executor.getResult(requestId);
  console.log('Video URL:', result.video.url);
}
```

## Input Parameters

### Required Parameters

- **`video_url`** (string): URL of the input video file
- **`audio_url`** (string): URL of the input audio file

### Input Requirements

- **Video**: Should contain clear facial features for optimal lipsync results
- **Audio**: Clear, well-recorded audio that matches the intended language
- **URLs**: Must be publicly accessible and valid URLs
- **Formats**: Supports common video and audio formats

## Advanced Usage

### Batch Processing

Process multiple videos with different audio tracks:

```typescript
const videoAudioPairs = [
  {
    video_url: "https://example.com/video1.mp4",
    audio_url: "https://example.com/audio1.mp3"
  },
  {
    video_url: "https://example.com/video2.mp4",
    audio_url: "https://example.com/audio2.mp3"
  }
];

const results = [];

for (const pair of videoAudioPairs) {
  const result = await executor.generateLipsync(pair);
  results.push(result);
}

console.log(`Processed ${results.length} videos`);
```

### Cost Estimation

Estimate costs before processing:

```typescript
// Estimate cost for a 5-minute video
const estimatedCost = executor.calculateCost(5);
console.log(`Estimated cost: $${estimatedCost.toFixed(2)}`);

// For a 10-minute video
const longVideoCost = executor.calculateCost(10);
console.log(`Long video cost: $${longVideoCost.toFixed(2)}`);
```

### Input Validation

Validate inputs before processing:

```typescript
const validation = executor.validateInput({
  video_url: "https://example.com/video.mp4",
  audio_url: "https://example.com/audio.mp3"
});

if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
  // Handle errors appropriately
} else {
  // Proceed with generation
  const result = await executor.generateLipsync({
    video_url: "https://example.com/video.mp4",
    audio_url: "https://example.com/audio.mp3"
  });
}
```

## Use Case Examples

### 1. Content Creation
Create engaging social media content with synchronized audio:

```typescript
const socialMediaContent = await executor.generateLipsync({
  video_url: "https://example.com/raw_video.mp4",
  audio_url: "https://example.com/script_audio.mp3"
});
```

### 2. Video Localization
Translate videos to different languages:

```typescript
const localizedVideo = await executor.generateLipsync({
  video_url: "https://example.com/english_video.mp4",
  audio_url: "https://example.com/spanish_narration.mp3"
});
```

### 3. Educational Content
Create training videos with professional narration:

```typescript
const trainingVideo = await executor.generateLipsync({
  video_url: "https://example.com/demo_video.mp4",
  audio_url: "https://example.com/training_narration.mp3"
});
```

### 4. Marketing Presentations
Synchronize product demos with marketing messages:

```typescript
const marketingVideo = await executor.generateLipsync({
  video_url: "https://example.com/product_demo.mp4",
  audio_url: "https://example.com/marketing_script.mp3"
});
```

## Best Practices

### Video Quality
- Use high-resolution videos with clear facial features
- Ensure good lighting and minimal background noise
- Avoid rapid camera movements during speech segments
- Use videos with clear, unobstructed faces

### Audio Quality
- Record audio in a quiet environment
- Use clear, well-articulated speech
- Match audio language to video content
- Ensure consistent audio levels throughout

### Cost Optimization
- Consider video duration for cost management
- Use queue system for longer videos
- Batch process multiple videos when possible
- Monitor generation progress to avoid unnecessary costs

### Technical Considerations
- Use publicly accessible URLs for inputs
- Validate URLs before submission
- Handle errors gracefully with proper error handling
- Use the queue system for videos longer than 2-3 minutes

## Error Handling

### Input Validation Errors

```typescript
try {
  const validation = executor.validateInput({
    video_url: "invalid-url",
    audio_url: ""
  });

  if (!validation.isValid) {
    console.error('Validation errors:', validation.errors);
    // Handle validation errors
  }
} catch (error) {
  console.error('Validation failed:', error);
}
```

### Generation Errors

```typescript
try {
  const result = await executor.generateLipsync({
    video_url: "https://example.com/video.mp4",
    audio_url: "https://example.com/audio.mp3"
  });
} catch (error) {
  console.error('Lipsync generation failed:', error.error);
  if (error.details) {
    console.error('Details:', error.details);
  }
}
```

### Queue Status Errors

```typescript
try {
  const status = await executor.checkStatus(requestId);
  console.log('Status:', status.status);
} catch (error) {
  console.error('Status check failed:', error.error);
}
```

## Troubleshooting

### Common Issues

1. **Invalid URLs**
   - Ensure URLs are publicly accessible
   - Check for CORS restrictions
   - Verify file formats are supported
   - Test URLs in a browser

2. **Poor Lipsync Quality**
   - Use videos with clear facial features
   - Ensure good lighting conditions
   - Avoid background noise in video
   - Use clear, well-recorded audio

3. **Generation Failures**
   - Check input validation results
   - Verify file accessibility
   - Ensure proper file formats
   - Monitor generation logs

4. **Cost Issues**
   - Calculate costs before processing
   - Use queue system for longer videos
   - Monitor generation progress
   - Consider video duration optimization

### Performance Tips

- Use appropriate video quality for your needs
- Process shorter videos for faster results
- Use queue system for longer content
- Monitor generation progress with logs
- Handle errors gracefully with retry logic

## API Reference

### Class: VeedLipsyncExecutor

#### Methods

- **`generateLipsync(input)`**: Generate lipsync synchronously
- **`submitToQueue(input)`**: Submit to queue for async processing
- **`checkStatus(requestId)`**: Check queue status
- **`getResult(requestId)`**: Get completed result
- **`calculateCost(durationMinutes)`**: Estimate generation cost
- **`validateInput(input)`**: Validate input parameters

#### Properties

- **`modelEndpoint`**: The VEED lipsync model endpoint

### Input Interface: VeedLipsyncInput

- **`video_url`**: URL of the input video file
- **`audio_url`**: URL of the input audio file

### Output Interface: VeedLipsyncOutput

- **`video`**: Object containing video URL and metadata
  - **`url`**: Download URL for the generated video
  - **`content_type`**: MIME type of the video file
  - **`file_name`**: Name of the generated file
  - **`file_size`**: Size of the file in bytes

## Cost Structure

The model uses a **per-minute pricing model**:

- **Cost per minute**: $0.40
- **No setup fees or additional charges**
- **Cost scales linearly with video duration**

### Example Calculations

- 1-minute video: $0.40
- 5-minute video: $2.00
- 10-minute video: $4.00
- 30-minute video: $12.00

## Conclusion

The Veed Lipsync model offers powerful capabilities for creating perfectly synchronized video content. By understanding the input requirements, optimizing for quality, and managing costs effectively, you can create professional lipsync videos for various applications including content creation, localization, education, and marketing.

For more information about VEED's platform and available models, visit the [VEED documentation](https://veed.io/docs).
