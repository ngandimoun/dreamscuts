# Sync Lipsync v2 Usage Guide

## Overview

The **Sync Lipsync v2** model (`fal-ai/sync-lipsync/v2`) is an AI-powered tool that generates realistic lipsync animations by synchronizing video content with audio input. This model is perfect for content creators, educators, and professionals who need to create videos with perfectly synchronized mouth movements.

## Key Features

- **Realistic Lipsync Generation**: AI-powered mouth movement synchronization
- **Multiple Sync Modes**: Handle duration mismatches between audio and video
- **Configurable Quality**: Choose between low, medium, and high quality outputs
- **Frame Rate Control**: Support for 24fps (cinematic), 30fps (standard), and 60fps (smooth)
- **Professional Output**: High-quality results suitable for various use cases
- **Queue Support**: Asynchronous processing for longer videos
- **Real-time Updates**: Monitor progress during generation

## Basic Usage

### Simple Lipsync Generation

```typescript
import { SyncLipsyncV2Executor } from './executors/sync-lipsync-v2';

const executor = new SyncLipsyncV2Executor();

// Basic usage with default settings
const result = await executor.generateVideo({
  audio: 'path/to/audio.mp3',
  video: videoFile
});

console.log('Generated video:', result.video);
console.log('Duration:', result.duration, 'seconds');
```

### Customized Lipsync Generation

```typescript
// Advanced usage with custom settings
const result = await executor.generateVideo({
  audio: 'path/to/audio.mp3',
  video: videoFile,
  sync_mode: 'remap',
  quality: 'high',
  fps: 60,
  start_time: 0,
  end_time: 120
});
```

## Input Parameters

### Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `audio` | `string` | Audio file URL or base64 encoded audio data |
| `video` | `Image` | Input video file for lipsync generation |

### Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `sync_mode` | `string` | `'cut_off'` | How to handle duration mismatches |
| `start_time` | `number` | `undefined` | Start time in seconds for processing |
| `end_time` | `number` | `undefined` | End time in seconds for processing |
| `fps` | `number` | `30` | Output frame rate (1-120) |
| `quality` | `string` | `'medium'` | Output quality setting |

## Sync Modes

The model supports five different sync modes to handle duration mismatches between audio and video:

### 1. Cut Off (`cut_off`)
- **Description**: Cut off audio/video at the shorter duration
- **Use Case**: When you want exact synchronization and don't mind truncating content
- **Best For**: Short clips, precise timing requirements

```typescript
const result = await executor.generateVideo({
  audio: audioFile,
  video: videoFile,
  sync_mode: 'cut_off'
});
```

### 2. Loop (`loop`)
- **Description**: Loop the shorter input to match the longer duration
- **Use Case**: When you want to extend content without gaps
- **Best For**: Background music, ambient content

```typescript
const result = await executor.generateVideo({
  audio: audioFile,
  video: videoFile,
  sync_mode: 'loop'
});
```

### 3. Bounce (`bounce`)
- **Description**: Bounce back and forth for the shorter input
- **Use Case**: When you want dynamic content variation
- **Best For**: Creative content, music videos

```typescript
const result = await executor.generateVideo({
  audio: audioFile,
  video: videoFile,
  sync_mode: 'bounce'
});
```

### 4. Silence (`silence`)
- **Description**: Add silence to audio if it's shorter than video
- **Use Case**: When you want to preserve video length
- **Best For**: Video content with minimal audio

```typescript
const result = await executor.generateVideo({
  audio: audioFile,
  video: videoFile,
  sync_mode: 'silence'
});
```

### 5. Remap (`remap`)
- **Description**: Remap timing to fit within the target duration
- **Use Case**: When you want to compress or expand timing
- **Best For**: Professional content, precise timing control

```typescript
const result = await executor.generateVideo({
  audio: audioFile,
  video: videoFile,
  sync_mode: 'remap'
});
```

## Quality Options

### Low Quality
- **Processing Time**: ~30-60 seconds
- **Output Quality**: Good for demos and testing
- **Cost Factor**: 1.0x

### Medium Quality (Default)
- **Processing Time**: ~1-2 minutes
- **Output Quality**: Professional quality suitable for most use cases
- **Cost Factor**: 1.2x

### High Quality
- **Processing Time**: ~2-4 minutes
- **Output Quality**: Premium quality for professional content
- **Cost Factor**: 1.5x

## Frame Rate Options

### 24 FPS (Cinematic)
- **Use Case**: Film, cinematic content, artistic videos
- **File Size**: Smallest
- **Processing Speed**: Fastest

### 30 FPS (Standard)
- **Use Case**: General video content, social media, streaming
- **File Size**: Medium
- **Processing Speed**: Medium

### 60 FPS (High Frame Rate)
- **Use Case**: Smooth motion, gaming content, action videos
- **File Size**: Largest
- **Processing Speed**: Slowest

## Asynchronous Processing

For longer videos or when you need to handle multiple requests, use the queue system:

```typescript
// Submit to queue
const { requestId, status } = await executor.generateVideoAsync({
  audio: audioFile,
  video: videoFile,
  quality: 'high'
});

console.log('Request submitted:', requestId);

// Check status
const statusInfo = await executor.checkStatus(requestId);
console.log('Current status:', statusInfo.status);

// Get result when ready
const result = await executor.getResult(requestId);
console.log('Video generated:', result.video);
```

### Real-time Updates

```typescript
// Subscribe to real-time updates
await executor.subscribeToUpdates(requestId, (update) => {
  console.log('Update received:', update);
});
```

## Cost Calculation

The model uses a per-second pricing model:

```typescript
// Calculate cost for different durations
const durations = [10, 30, 60, 120];
const costComparison = executor.getCostComparison(durations);

costComparison.forEach(({ duration, cost, costPerMinute }) => {
  console.log(`${duration}s: $${cost.toFixed(2)} ($${costPerMinute.toFixed(2)}/min)`);
});
```

**Cost Examples:**
- 10 seconds: $1.50
- 30 seconds: $4.50
- 60 seconds: $9.00
- 2 minutes: $18.00

## Use Case Examples

### Content Creation
```typescript
const contentSettings = executor.getOptimalSettings('content_creation');
// Returns: { quality: 'medium', fps: 30, sync_mode: 'cut_off' }

const result = await executor.generateVideo({
  audio: podcastAudio,
  video: talkingHeadVideo,
  ...contentSettings
});
```

### Professional Presentations
```typescript
const professionalSettings = executor.getOptimalSettings('professional');
// Returns: { quality: 'high', fps: 60, sync_mode: 'remap' }

const result = await executor.generateVideo({
  audio: presentationAudio,
  video: speakerVideo,
  ...professionalSettings
});
```

### Quick Demos
```typescript
const demoSettings = executor.getOptimalSettings('quick_demo');
// Returns: { quality: 'low', fps: 24, sync_mode: 'cut_off' }

const result = await executor.generateVideo({
  audio: demoAudio,
  video: demoVideo,
  ...demoSettings
});
```

## Best Practices

### Audio Quality
- Use clear, high-quality audio for better lipsync accuracy
- Maintain consistent audio levels throughout the input
- Avoid background noise and interference
- Consider using lossless formats (WAV, FLAC) for critical content

### Video Quality
- Ensure good lighting and clear facial features
- Use high-resolution video when possible
- Avoid rapid camera movements during speech
- Ensure the subject's face is clearly visible

### Sync Mode Selection
- Use `cut_off` for short clips and precise timing
- Use `loop` for background music and ambient content
- Use `bounce` for creative and dynamic content
- Use `silence` when preserving video length is important
- Use `remap` for professional content requiring precise timing

### Quality and Performance
- Start with medium quality for testing
- Use low quality for demos and iterations
- Reserve high quality for final production content
- Consider processing time vs. quality trade-offs

## Error Handling

The executor provides comprehensive error handling:

```typescript
try {
  const result = await executor.generateVideo({
    audio: audioFile,
    video: videoFile
  });
} catch (error) {
  if (error.code === 'EXECUTION_ERROR') {
    console.error('Execution failed:', error.error);
    console.error('Details:', error.details);
  } else {
    console.error('Unknown error:', error.error);
  }
}
```

## Input Validation

Validate inputs before processing:

```typescript
const input = {
  audio: audioFile,
  video: videoFile,
  fps: 120, // Invalid: exceeds maximum
  sync_mode: 'invalid_mode' // Invalid: not supported
};

const validation = executor.validateInput(input);
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
  return;
}
```

## Performance Optimization

### Processing Speed
- Use lower quality settings for faster processing
- Choose appropriate frame rates based on content needs
- Consider using shorter clips for testing and iteration

### Cost Optimization
- Estimate costs before processing long videos
- Use appropriate quality settings for your use case
- Consider processing in segments for very long content

### Quality Optimization
- Test with shorter clips first to optimize settings
- Use higher quality settings for professional content
- Consider the target platform's requirements

## Troubleshooting

### Common Issues

**Poor Lipsync Quality**
- Check audio quality and clarity
- Ensure video has good lighting and clear facial features
- Try different sync modes
- Consider using higher quality settings

**Long Processing Times**
- Reduce quality settings
- Use lower frame rates
- Check input file sizes and formats
- Consider using the queue system for long videos

**Duration Mismatch Issues**
- Choose appropriate sync mode for your use case
- Use `remap` mode for precise timing control
- Consider editing audio/video before processing

**Format Compatibility**
- Ensure audio and video formats are supported
- Convert files to supported formats if needed
- Check file size limits

### Getting Help

- Check the model's capabilities and limitations
- Validate all input parameters
- Test with smaller files first
- Review error messages and validation results

## API Reference

### Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `generateVideo(input)` | Generate lipsync video synchronously | `Promise<SyncLipsyncV2Output>` |
| `generateVideoAsync(input)` | Submit to queue for async processing | `Promise<{requestId, status}>` |
| `checkStatus(requestId)` | Check queue status | `Promise<{status, logs}>` |
| `getResult(requestId)` | Get result from queue | `Promise<SyncLipsyncV2Output>` |
| `subscribeToUpdates(requestId, callback)` | Subscribe to real-time updates | `Promise<void>` |
| `calculateCost(duration)` | Calculate processing cost | `number` |
| `validateInput(input)` | Validate input parameters | `{isValid, errors}` |

### Helper Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `getAvailableSyncModes()` | Get all available sync modes | `Array<{value, description}>` |
| `getAvailableQualityOptions()` | Get quality options with trade-offs | `Array<{value, description, tradeoff}>` |
| `getAvailableFPSOptions()` | Get FPS options with use cases | `Array<{value, description, useCase}>` |
| `getModelInfo()` | Get model information | `{name, version, description, capabilities}` |
| `getOptimalSettings(useCase)` | Get recommended settings for use case | `Partial<SyncLipsyncV2Input>` |
| `getCostComparison(durations)` | Compare costs for different durations | `Array<{duration, cost, costPerMinute}>` |
| `getRecommendedSyncMode(audioDuration, videoDuration)` | Get recommended sync mode | `string` |
| `getLipsyncOptimizationTips()` | Get optimization tips | `string[]` |
| `getSupportedAudioFormats()` | Get supported audio formats | `string[]` |
| `getSupportedVideoFormats()` | Get supported video formats | `string[]` |

## Conclusion

The Sync Lipsync v2 model provides powerful AI-driven lipsync generation capabilities with flexible configuration options. By following the best practices outlined in this guide and choosing appropriate settings for your use case, you can create high-quality, synchronized videos efficiently and cost-effectively.

For more information about the model's capabilities and integration options, refer to the registry JSON file and the executor implementation.
