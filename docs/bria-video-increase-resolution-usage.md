# Bria Video Increase Resolution - Usage Guide

## Overview
The Bria Video Increase Resolution model is an AI-powered video upscaling solution that can increase video resolution up to 8K output. It supports various output formats and codecs, making it ideal for professional video production and content enhancement.

## Model Information
- **Model ID**: `bria/video/increase-resolution`
- **Provider**: Bria (via fal.ai)
- **Version**: v1.0
- **Cost**: $0.14 per video second
- **Max Input Duration**: 30 seconds
- **Max Input Resolution**: 14142x14142 pixels

## Key Features
- **2x and 4x Resolution Upscaling**: Choose between 2x or 4x resolution increase
- **Multiple Output Formats**: Support for MP4, WebM, MOV, MKV, and GIF
- **Quality Preservation**: Advanced AI algorithms maintain video quality during upscaling
- **Flexible Codec Options**: Choose from H.264, H.265, VP9, and ProRes codecs

## Basic Usage

### 1. Import and Initialize
```typescript
import { createBriaVideoIncreaseResolutionExecutor } from './executors/bria-video-increase-resolution';

const executor = createBriaVideoIncreaseResolutionExecutor('your-fal-ai-api-key');
```

### 2. Simple Video Upscaling
```typescript
const result = await executor.increaseResolution({
  video_url: 'https://example.com/input-video.mp4',
  desired_increase: '2', // 2x upscaling
  output_container_and_codec: 'mp4_h265' // MP4 with H.265 codec
});

console.log('Upscaled video URL:', result.video.url);
```

### 3. Advanced Configuration
```typescript
const result = await executor.increaseResolution({
  video_url: 'https://example.com/input-video.mp4',
  desired_increase: '4', // 4x upscaling for maximum quality
  output_container_and_codec: 'webm_vp9' // WebM with VP9 codec
});
```

## Queue-Based Processing

For longer videos or when you need to handle multiple requests:

### 1. Submit to Queue
```typescript
const { requestId } = await executor.queueIncreaseResolution({
  video_url: 'https://example.com/input-video.mp4',
  desired_increase: '2',
  output_container_and_codec: 'mov_h265'
});
```

### 2. Check Status
```typescript
const status = await executor.checkQueueStatus(requestId);
console.log('Processing status:', status.status);
```

### 3. Get Results
```typescript
const result = await executor.getQueueResult(requestId);
console.log('Upscaled video URL:', result.video.url);
```

## Input Parameters

### Required Parameters
- **`video_url`** (string): URL of the input video to be upscaled

### Optional Parameters
- **`desired_increase`** (string): Resolution increase factor
  - `"2"` - 2x upscaling (default)
  - `"4"` - 4x upscaling
- **`output_container_and_codec`** (string): Output format and codec
  - `"mp4_h265"` - MP4 with H.265 codec
  - `"mp4_h264"` - MP4 with H.264 codec
  - `"webm_vp9"` - WebM with VP9 codec (default)
  - `"mov_h265"` - MOV with H.265 codec
  - `"mov_proresks"` - MOV with ProRes codec
  - `"mkv_h265"` - MKV with H.265 codec
  - `"mkv_h264"` - MKV with H.264 codec
  - `"mkv_vp9"` - MKV with VP9 codec
  - `"gif"` - Animated GIF format

## Output Format

The model returns an object with the following structure:

```typescript
interface BriaVideoIncreaseResolutionOutput {
  video: {
    url: string;           // URL of the upscaled video
    content_type?: string; // MIME type of the video
    file_name?: string;    // Name of the video file
    file_size?: number;    // Size of the video file in bytes
  };
  requestId?: string;      // Request ID for queue-based processing
}
```

## Cost Calculation

The cost is calculated based on the duration of the input video:

```typescript
const cost = executor.calculateCost(30); // $4.20 for a 30-second video
console.log(`Cost: $${cost}`);
```

**Cost Examples:**
- 10-second video: $1.40
- 30-second video: $4.20
- 60-second video: $8.40

## Model Capabilities

### Supported Input Types
- Video files (MP4, WebM, MOV, MKV, etc.)

### Output Quality
- Maximum output resolution: 8K
- Maintains original aspect ratio
- Quality preservation during upscaling

### Processing Considerations
- Processing time varies based on video length and resolution
- Higher resolution increases require more processing time
- Quality depends on input video quality

## Best Practices

### 1. Input Quality
- Use high-quality input videos for best results
- Ensure input videos are clear and well-lit
- Avoid heavily compressed or low-resolution source material

### 2. Resolution Selection
- Use 2x upscaling for moderate quality improvement
- Use 4x upscaling for maximum quality (requires more processing time)
- Consider your target platform's resolution requirements

### 3. Output Format Selection
- **MP4 (H.264)**: Best compatibility across devices and platforms
- **MP4 (H.265)**: Better compression, good quality
- **WebM (VP9)**: Good for web applications
- **MOV (ProRes)**: Professional video editing workflows
- **GIF**: For simple animations or social media

### 4. Error Handling
```typescript
try {
  const result = await executor.increaseResolution({
    video_url: 'https://example.com/input-video.mp4'
  });
  // Process successful result
} catch (error) {
  console.error('Upscaling failed:', error.message);
  // Handle error appropriately
}
```

## Use Cases

### Professional Video Production
- Upscale footage for 4K/8K displays
- Enhance archival video content
- Prepare content for high-resolution platforms

### Content Creation
- Improve video quality for social media
- Enhance educational content
- Create high-quality marketing materials

### Video Restoration
- Enhance old or low-resolution videos
- Improve video quality for modern displays
- Restore historical footage

## Limitations and Considerations

### Input Limitations
- Maximum input video size: 14142x14142 pixels
- Maximum input duration: 30 seconds
- Input quality affects output quality

### Processing Considerations
- Processing time increases with video length and resolution
- Higher resolution increases require more computational resources
- Queue-based processing recommended for longer videos

### Quality Factors
- Output quality depends on input video quality
- AI upscaling cannot create detail that doesn't exist in the source
- Best results with clear, high-quality input material

## Troubleshooting

### Common Issues

1. **Invalid Video URL**
   - Ensure the video URL is accessible
   - Check that the video format is supported
   - Verify the video file exists and is not corrupted

2. **Processing Failures**
   - Check input video size and duration limits
   - Ensure fal.ai API key is valid
   - Verify network connectivity

3. **Quality Issues**
   - Use higher quality input videos
   - Consider using 4x upscaling for better results
   - Check output format and codec settings

### Getting Help
- Check fal.ai documentation for API-related issues
- Verify your fal.ai account has access to this model
- Ensure you have sufficient credits for processing

## Example Workflow

Here's a complete example of upscaling a video:

```typescript
import { createBriaVideoIncreaseResolutionExecutor } from './executors/bria-video-increase-resolution';

async function upscaleVideo() {
  try {
    // Initialize executor
    const executor = createBriaVideoIncreaseResolutionExecutor('your-api-key');
    
    // Upscale video
    const result = await executor.increaseResolution({
      video_url: 'https://example.com/input-video.mp4',
      desired_increase: '2',
      output_container_and_codec: 'mp4_h265'
    });
    
    console.log('Video upscaled successfully!');
    console.log('Output URL:', result.video.url);
    console.log('File size:', result.video.file_size, 'bytes');
    
    return result;
  } catch (error) {
    console.error('Upscaling failed:', error.message);
    throw error;
  }
}

// Run the upscaling
upscaleVideo().catch(console.error);
```

This comprehensive guide should help you effectively use the Bria Video Increase Resolution model for your video upscaling needs.
