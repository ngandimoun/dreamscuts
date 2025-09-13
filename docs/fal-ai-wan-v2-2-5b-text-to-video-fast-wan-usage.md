# WAN v2.2 5B FastVideo Text-to-Video Usage Guide

## Overview

The **WAN v2.2 5B FastVideo Text-to-Video** model (`fal-ai/wan/v2.2-5b/text-to-video/fast-wan`) is a fast and efficient AI-powered tool that generates high-quality videos from text prompts using the WAN (World Animation Network) 5B parameter architecture. It produces up to 5 seconds of video at 720p resolution and 24FPS with fluid motion and powerful prompt understanding.

## Key Features

- **Fast Generation**: Optimized 5B parameter model for quick video creation
- **High-Quality Output**: Support for resolutions up to 720p with smooth 24FPS
- **Text-to-Video**: Generate videos directly from natural language descriptions
- **Fluid Motion**: Advanced motion generation with realistic movement patterns
- **Multiple Resolutions**: Choose from 480p, 580p, or 720p output quality
- **Aspect Ratio Control**: Support for 16:9, 9:16, and 1:1 aspect ratios
- **Frame Interpolation**: Smooth motion enhancement with film or RIFE models
- **Cost Effective**: Fixed per-video pricing regardless of duration

## Input Parameters

### Required Parameters

- **`prompt`** (string): Text description of the desired video content and style

### Optional Parameters

#### Video Specifications
- **`num_frames`** (81-121): Number of frames in the output video
- **`frames_per_second`** (4-60): Frame rate of the output video
- **`resolution`** (480p|580p|720p): Output video resolution
- **`aspect_ratio`** (16:9|9:16|1:1): Output video aspect ratio

#### Generation Control
- **`negative_prompt`** (string): Text describing what to avoid in the output
- **`seed`** (number): Random seed for reproducible results
- **`guidance_scale`** (0-20): How closely to follow the prompt
- **`enable_safety_checker`** (boolean): Enable content filtering
- **`enable_prompt_expansion`** (boolean): AI-enhanced prompt interpretation

#### Advanced Features
- **`interpolator_model`** (none|film|rife): Frame interpolation method
- **`num_interpolated_frames`** (0-4): Additional frames for smooth motion
- **`adjust_fps_for_interpolation`** (boolean): Adjust FPS for interpolation

## Pricing Structure

The model uses a **fixed per-video pricing** system with different rates per resolution:

- **480p**: $0.0125 per video
- **580p**: $0.01875 per video  
- **720p**: $0.025 per video

### Cost Examples

| Resolution | Cost | Description |
|------------|------|-------------|
| 480p | $0.0125 | Quick iterations and social media |
| 580p | $0.01875 | Balanced quality and cost |
| 720p | $0.025 | Professional quality output |

## Usage Examples

### Basic Video Generation

```typescript
import { FalAiWanV225bTextToVideoFastWanExecutor } from './executors/fal-ai-wan-v2-2-5b-text-to-video-fast-wan';

const executor = new FalAiWanV225bTextToVideoFastWanExecutor();

const result = await executor.generateVideo({
  prompt: 'A serene mountain stream flows through a lush forest valley with crystal clear water cascading over smooth rocks',
  num_frames: 100,
  frames_per_second: 24,
  resolution: '720p',
  aspect_ratio: '16:9'
});
```

### Queue-Based Processing for Long Videos

```typescript
// Submit to queue
const { request_id } = await executor.submitToQueue({
  prompt: 'A bustling city skyline at golden hour with modern skyscrapers reflecting warm sunset hues',
  num_frames: 120,
  frames_per_second: 30,
  resolution: '720p',
  aspect_ratio: '16:9'
});

// Check status
const status = await FalAiWanV225bTextToVideoFastWanExecutor.checkQueueStatus(request_id);

// Get result when complete
if (status.status === 'completed') {
  const result = await FalAiWanV225bTextToVideoFastWanExecutor.getQueueResult(request_id);
}
```

### Cost Calculation

```typescript
// Calculate cost for different resolutions
const cost480p = executor.calculateCost('480p'); // $0.0125
const cost580p = executor.calculateCost('580p'); // $0.01875
const cost720p = executor.calculateCost('720p'); // $0.025

// Estimate duration from frames and FPS
const duration = executor.estimateDuration(100, 24); // 4.17 seconds
```

## Best Practices

### Prompt Writing

1. **Be Descriptive**: Provide detailed descriptions of scenes, characters, and actions
2. **Include Visual Details**: Mention colors, lighting, atmosphere, and mood
3. **Specify Motion**: Describe how objects and characters should move
4. **Reference Styles**: Mention artistic styles, cinematic techniques, or visual aesthetics
5. **Consider Timing**: Think about the sequence of events and transitions
6. **Use Adjectives**: Include descriptive words for textures, materials, and environments

### Parameter Optimization

1. **Start Moderate**: Begin with guidance scale values of 2.5-4.0
2. **Test Resolution**: Use lower resolutions for iterations, higher for final output
3. **Frame Control**: Balance frame count with processing time and cost
4. **FPS Selection**: 24fps for cinematic feel, 30fps for smooth motion
5. **Seed Values**: Use specific seeds for reproducible results during development

### Performance Tips

1. **Lower Resolutions**: Use 480p or 580p for testing and quick iterations
2. **Frame Limits**: Start with fewer frames and increase as needed
3. **Interpolation**: Use frame interpolation for smoother motion
4. **Safety Settings**: Disable safety checker for faster processing if content is appropriate
5. **Queue Processing**: Use queue submission for longer videos to avoid timeouts

## Common Use Cases

### Marketing and Advertising
- Product demonstration videos
- Brand storytelling content
- Social media marketing videos
- E-commerce product showcases

### Content Creation
- Social media content
- YouTube and streaming platform videos
- Educational and training content
- Entertainment and creative content

### Professional Applications
- Corporate communication videos
- Professional presentation enhancement
- Training material creation
- Business concept visualization

### Creative Projects
- Storytelling and narrative videos
- Artistic and experimental content
- Music video concepts
- Short film creation

## Technical Considerations

### Processing Time
- Higher frame counts increase processing time
- Resolution affects generation speed
- Frame interpolation adds additional processing overhead
- 5B parameter model optimized for speed

### Quality vs. Speed
- 480p: Fastest processing, good for social media
- 580p: Balanced quality and speed for most use cases
- 720p: Highest quality, slightly slower processing

### Memory and Resources
- Larger frame counts require more memory
- Frame interpolation increases memory usage
- Consider queue processing for resource-intensive operations

## Error Handling

The executor provides comprehensive error handling with specific error codes:

- `GENERATION_FAILED`: Video generation process failed
- `QUEUE_SUBMIT_FAILED`: Failed to submit to processing queue
- `STATUS_CHECK_FAILED`: Failed to check queue status
- `RESULT_FETCH_FAILED`: Failed to retrieve queue result

### Common Issues and Solutions

1. **Generation Fails**: Reduce frame count, guidance scale, or resolution
2. **Poor Quality**: Increase resolution, frame count, or guidance scale
3. **Slow Processing**: Use lower resolution, fewer frames, or enable queue processing
4. **Content Filtered**: Check safety checker settings and adjust prompts
5. **Motion Issues**: Adjust frames_per_second or use frame interpolation

## Integration Examples

### Real-time Processing

```typescript
const result = await fal.subscribe('fal-ai/wan/v2.2-5b/text-to-video/fast-wan', {
  input: {
    prompt: 'A modern office scene with professional business person',
    num_frames: 81,
    frames_per_second: 24,
    resolution: '720p',
    aspect_ratio: '16:9'
  },
  pollInterval: 1000,
  onResult: (result) => console.log('Complete:', result),
  onError: (error) => console.error('Error:', error)
});
```

### Batch Processing

```typescript
const prompts = [
  'Nature scene with flowing water',
  'Urban cityscape at sunset',
  'Modern office environment'
];

const results = await Promise.all(
  prompts.map(prompt => 
    executor.generateVideo({
      prompt,
      num_frames: 100,
      frames_per_second: 24,
      resolution: '580p',
      aspect_ratio: '16:9'
    })
  )
);
```

## Cost Optimization

### Strategies to Reduce Costs

1. **Use Lower Resolutions**: 480p is 50% cheaper than 720p
2. **Limit Frame Count**: Fewer frames mean lower processing time
3. **Batch Processing**: Process multiple videos together for efficiency
4. **Test First**: Use low-quality settings for iterations, high-quality for final output
5. **Queue Processing**: Avoid timeouts on long videos that could waste resources

### Cost Estimation Tools

The executor provides built-in cost calculation:

```typescript
// Get cost examples for different scenarios
const examples = executor.getCostExamples();

// Calculate custom costs
const customCost = executor.calculateCost('580p'); // $0.01875 for 580p
```

## Advanced Features

### Frame Interpolation

- **Film Model**: Cinematic-quality motion smoothing
- **RIFE Model**: Real-time frame interpolation
- **Custom FPS**: Adjust output frame rate for smooth playback

### Prompt Expansion

- AI-enhanced prompt interpretation
- Automatic style and aesthetic enhancement
- Improved result quality and consistency

### Safety and Moderation

- Content filtering and safety checks
- Compliance with platform guidelines
- Configurable safety levels

## Troubleshooting

### Performance Issues

- **Slow Processing**: Reduce resolution, frame count, use queue processing
- **High Memory Usage**: Limit frame count, disable frame interpolation
- **Timeout Errors**: Use queue submission for long videos

### Quality Issues

- **Poor Visual Quality**: Increase resolution, frame count, or guidance scale
- **Motion Problems**: Adjust FPS, use frame interpolation, check frame count
- **Style Inconsistency**: Improve prompts, use seed values, adjust guidance scale

### API Issues

- **Authentication Errors**: Check API key and permissions
- **Rate Limits**: Implement retry logic and respect limits
- **Network Issues**: Use appropriate timeout values and error handling

## Support and Resources

- **Documentation**: Complete API reference and examples
- **Community**: Active user community and support forums
- **Updates**: Regular model improvements and feature additions
- **Examples**: Extensive collection of use cases and implementations

The WAN v2.2 5B FastVideo Text-to-Video model provides fast, high-quality video generation capabilities while maintaining cost-effectiveness. By following these guidelines and best practices, you can achieve excellent results while optimizing processing time and costs.
