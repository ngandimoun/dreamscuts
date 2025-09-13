# Mirelo AI SFX V1 Video to Video Usage Guide

## Overview

The **Mirelo AI SFX V1 Video to Video** model (mirelo-ai/sfx-v1/video-to-video) is an advanced AI model specialized in generating and modifying video content with specialized sound effects and audio generation capabilities. This model can create new video content based on input videos and text prompts, offering flexible duration control and multi-sample generation options.

The model costs $0.007 per second of output and per sample generated, making it cost-effective for various video generation needs, from short sound effects to extended audio-visual content.

## Key Features

- **Video-to-Video Generation**: Transform input videos with AI-generated content
- **Audio-Guided Creation**: Use text prompts to guide video generation
- **Multi-Sample Generation**: Generate up to 10 variations simultaneously
- **Duration Control**: Customize output length from 1 to 60 seconds
- **Seed-Based Reproducibility**: Ensure consistent results with seed values
- **Queue Processing**: Handle long-running requests asynchronously
- **Cost-Effective Pricing**: Pay only for what you generate

## Input Parameters

### Required Parameters

- **`video_url`** (string): URL of the input video file
  - Must be a valid, accessible URL
  - Supported formats: MP4, MOV, AVI, WebM, MKV
  - Ensure the video contains clear content for the AI to work with

### Optional Parameters

- **`text_prompt`** (string, optional): Text description to guide video generation
  - Maximum length: 1000 characters
  - Use descriptive language for better results
  - Include emotional or atmospheric descriptors

- **`num_samples`** (integer, optional): Number of video samples to generate
  - Range: 1-10
  - Default: 2
  - Higher values increase variety but also cost

- **`seed`** (integer, optional): Random seed for reproducible results
  - Range: 0-999999
  - Default: 2105
  - Use consistent seeds for consistent outputs

- **`duration`** (number, optional): Duration of the output video in seconds
  - Range: 1-60 seconds
  - Default: 10
  - Shorter durations are more cost-effective for testing

## Pricing Structure

The model uses a dual pricing structure:
- **$0.007 per second** of output video
- **$0.007 per sample** generated

### Cost Examples

| Duration | Samples | Cost | Description |
|----------|---------|------|-------------|
| 5s | 2 | $0.049 | Quick sound effects with 2 variations |
| 10s | 2 | $0.084 | Standard content with 2 variations |
| 15s | 3 | $0.126 | Extended content with 3 variations |
| 30s | 5 | $0.245 | Long-form content with 5 variations |
| 60s | 10 | $0.490 | Maximum duration with maximum samples |

## Usage Examples

### Basic Video Generation

```typescript
import { MireloAiSfxV1VideoToVideoExecutor } from './executors/mirelo-ai-sfx-v1-video-to-video';

const executor = new MireloAiSfxV1VideoToVideoExecutor();

// Generate a 10-second video with 2 samples
const result = await executor.generateVideo({
  video_url: 'https://example.com/input-video.mp4',
  text_prompt: 'Create a cinematic orchestral soundtrack with dramatic tension',
  duration: 10,
  num_samples: 2
});

console.log('Generated video URL:', result.video.url);
```

### Queue-Based Processing

```typescript
// Submit to queue for long-running requests
const queueResult = await executor.submitToQueue({
  video_url: 'https://example.com/action-scene.mp4',
  text_prompt: 'Generate intense action movie sound effects',
  duration: 30,
  num_samples: 5
});

// Check status
const status = await MireloAiSfxV1VideoToVideoExecutor.checkQueueStatus(
  queueResult.request_id
);

// Get result when complete
if (status.status === 'completed') {
  const result = await MireloAiSfxV1VideoToVideoExecutor.getQueueResult(
    queueResult.request_id
  );
  console.log('Queue result:', result);
}
```

### Cost Calculation

```typescript
// Calculate cost for different configurations
const cost5s2samples = executor.calculateCost(5, 2);  // $0.049
const cost10s3samples = executor.calculateCost(10, 3); // $0.091
const cost30s5samples = executor.calculateCost(30, 5); // $0.245

console.log('Cost examples:', executor.getCostExamples());
```

## Best Practices

### Prompt Writing

- **Be Specific**: Describe the desired sound characteristics clearly
- **Use Descriptive Language**: Include emotional and atmospheric descriptors
- **Reference Similar Content**: Mention genres or styles when applicable
- **Include Timing**: Specify rhythm or pacing if relevant
- **Provide Context**: Explain the relationship between video and desired audio

### Video Preparation

- **Quality Matters**: Use high-quality input videos for better results
- **Clear Content**: Ensure the video has clear audio content to work with
- **Contextual Relevance**: Consider how the video content relates to desired audio
- **Test Incrementally**: Start with shorter clips for cost efficiency
- **Accessibility**: Ensure video URLs are publicly accessible

### Parameter Optimization

- **Start Small**: Begin with shorter durations and fewer samples
- **Iterate Gradually**: Increase parameters based on initial results
- **Use Seeds**: Maintain consistency with seed values when needed
- **Batch Processing**: Group similar requests for efficiency
- **Monitor Costs**: Track usage to optimize your workflow

## Common Use Cases

### Sound Effect Generation
- Create custom sound effects for video content
- Generate atmospheric audio for different scenes
- Produce unique audio signatures for branding

### Audio Enhancement
- Improve existing video audio quality
- Add background music or ambient sounds
- Enhance emotional impact through audio

### Content Creation
- Generate music videos with AI-created audio
- Create educational content with synchronized audio
- Produce marketing materials with custom soundtracks

### Creative Projects
- Experimental audio-visual art
- Interactive media installations
- Personalized content generation

## Technical Considerations

### Performance
- **Processing Time**: Varies based on duration and complexity
- **Queue Management**: Use for longer videos to avoid timeouts
- **Batch Processing**: Efficient for multiple similar requests
- **Error Handling**: Implement proper error handling for production use

### Limitations
- **Maximum Duration**: 60 seconds per video
- **Sample Count**: Maximum of 10 samples per request
- **URL Accessibility**: Input videos must be publicly accessible
- **Format Support**: Limited to common video formats

### Integration
- **Client Library**: Uses @fal-ai/client for API communication
- **Authentication**: Requires FAL_KEY environment variable
- **Rate Limits**: Subject to account tier restrictions
- **Webhooks**: Supported for asynchronous processing

## Error Handling

The executor provides comprehensive error handling with specific error codes:

```typescript
try {
  const result = await executor.generateVideo(input);
} catch (error) {
  if (error.code === 'MISSING_VIDEO_URL') {
    console.error('Video URL is required');
  } else if (error.code === 'INVALID_DURATION') {
    console.error('Duration must be between 1-60 seconds');
  } else if (error.code === 'GENERATION_FAILED') {
    console.error('Video generation failed:', error.message);
  }
}
```

### Common Error Codes

- `MISSING_VIDEO_URL`: video_url parameter is required
- `INVALID_VIDEO_URL`: video_url must be a valid URL
- `INVALID_NUM_SAMPLES`: num_samples must be 1-10
- `INVALID_SEED`: seed must be 0-999999
- `INVALID_DURATION`: duration must be 1-60 seconds
- `GENERATION_FAILED`: General generation error
- `QUEUE_SUBMISSION_FAILED`: Queue submission error

## Integration Examples

### Next.js API Route

```typescript
// pages/api/generate-video.ts
import { MireloAiSfxV1VideoToVideoExecutor } from '../../../executors/mirelo-ai-sfx-v1-video-to-video';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const executor = new MireloAiSfxV1VideoToVideoExecutor();
    const result = await executor.generateVideo(req.body);
    
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ 
      error: error.message, 
      code: error.code 
    });
  }
}
```

### React Component

```typescript
import { useState } from 'react';
import { MireloAiSfxV1VideoToVideoExecutor } from './executors/mirelo-ai-sfx-v1-video-to-video';

export function VideoGenerator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const generateVideo = async (input) => {
    setLoading(true);
    setError(null);
    
    try {
      const executor = new MireloAiSfxV1VideoToVideoExecutor();
      const videoResult = await executor.generateVideo(input);
      setResult(videoResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Form and UI components */}
      {loading && <div>Generating video...</div>}
      {error && <div>Error: {error}</div>}
      {result && (
        <video src={result.video.url} controls />
      )}
    </div>
  );
}
```

## Advanced Features

### Seed Control
Use consistent seed values to generate reproducible results:

```typescript
// Generate variations with different seeds
const seed1 = await executor.generateVideo({ ...input, seed: 123 });
const seed2 = await executor.generateVideo({ ...input, seed: 456 });
const seed3 = await executor.generateVideo({ ...input, seed: 789 });
```

### Multi-Sample Generation
Generate multiple variations for selection:

```typescript
// Generate 5 variations for comparison
const result = await executor.generateVideo({
  ...input,
  num_samples: 5
});

// Process multiple samples
result.samples?.forEach((sample, index) => {
  console.log(`Sample ${index + 1}:`, sample.url);
});
```

### Duration Optimization
Balance quality and cost with duration control:

```typescript
// Test with short duration first
const testResult = await executor.generateVideo({
  ...input,
  duration: 5
});

// Scale up if results are satisfactory
if (testResult.quality === 'good') {
  const fullResult = await executor.generateVideo({
    ...input,
    duration: 30
  });
}
```

## Troubleshooting

### Common Issues

1. **Invalid Video URL**
   - Ensure the URL is publicly accessible
   - Check that the video format is supported
   - Verify the URL is properly encoded

2. **Generation Failures**
   - Check input video quality and content
   - Verify text prompt clarity
   - Ensure parameters are within valid ranges

3. **High Costs**
   - Start with shorter durations
   - Use fewer samples initially
   - Monitor usage patterns

4. **Queue Timeouts**
   - Use shorter videos for testing
   - Implement proper error handling
   - Consider using synchronous generation for quick results

### Performance Tips

- **Batch Similar Requests**: Group related generations together
- **Use Appropriate Durations**: Match duration to your actual needs
- **Optimize Sample Counts**: Balance variety with cost
- **Implement Caching**: Store results to avoid regeneration
- **Monitor Usage**: Track costs and optimize accordingly

## Cost Optimization

### Strategies for Reducing Costs

1. **Start Small**: Begin with shorter durations and fewer samples
2. **Iterate Efficiently**: Use results to guide parameter adjustments
3. **Batch Processing**: Group similar requests together
4. **Seed Consistency**: Use consistent seeds to reduce experimentation
5. **Quality Assessment**: Test with minimal parameters before scaling up

### Budget Planning

- **Testing Phase**: Allocate budget for initial experimentation
- **Production Use**: Plan costs based on expected volume
- **Monitoring**: Track usage to identify optimization opportunities
- **Scaling**: Increase parameters gradually based on results

## Conclusion

The Mirelo AI SFX V1 Video to Video model offers powerful capabilities for AI-driven video generation and modification. With its flexible pricing structure, comprehensive parameter control, and robust error handling, it's well-suited for both experimental and production use cases.

By following the best practices outlined in this guide and implementing proper error handling and cost optimization strategies, you can effectively integrate this model into your creative workflow and achieve high-quality results while managing costs efficiently.

For more information about the model's capabilities and integration options, refer to the registry file and executor implementation in your project.
