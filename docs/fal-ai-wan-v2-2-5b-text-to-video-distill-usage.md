# WAN v2.2 5B Distill Text-to-Video Usage Guide

## Overview

The **WAN v2.2 5B Distill Text-to-Video** model (`fal-ai/wan/v2.2-5b/text-to-video/distill`) is a distilled version of the WAN (World Animation Network) 5B parameter model that produces up to 5 seconds of video at 720p resolution with fluid motion and powerful prompt understanding. This distilled model is optimized for efficiency while maintaining high quality output, with a fixed cost of $0.08 per video.

## Key Features

- **Distilled Architecture**: Optimized 5B parameter model for efficiency and speed
- **High Quality Output**: Up to 720p resolution with fluid motion generation
- **Fixed Pricing**: Predictable cost of $0.08 per video regardless of parameters
- **Advanced Controls**: Inference steps, guidance scale, and shift parameter control
- **Frame Interpolation**: Smooth motion with film or RIFE models
- **Prompt Understanding**: Powerful interpretation of detailed, cinematic descriptions
- **Queue Support**: Handle long-running requests with webhook integration
- **Safety Features**: Built-in content filtering and moderation

## Input Parameters

### Required Parameters

- **`prompt`** (string): Text description of the desired video scene and action

### Optional Parameters

- **`num_frames`** (81-121): Number of frames to generate (default: 81)
- **`frames_per_second`** (4-60): FPS of the generated video (default: 24)
- **`seed`** (number): Random seed for reproducibility
- **`resolution`** (580p|720p): Output video resolution (default: 720p)
- **`aspect_ratio`** (16:9|9:16|1:1): Video aspect ratio (default: 16:9)
- **`num_inference_steps`** (1-100): Quality vs. speed balance (default: 40)
- **`enable_safety_checker`** (boolean): Content filtering (default: true)
- **`enable_prompt_expansion`** (boolean): AI-enhanced prompt interpretation (default: false)
- **`guidance_scale`** (0-20): Prompt adherence control (default: 1)
- **`shift`** (1.0-10.0): Video dynamics control (default: 5)
- **`interpolator_model`** (none|film|rife): Frame interpolation method (default: film)
- **`num_interpolated_frames`** (0-4): Additional frames between generated frames
- **`adjust_fps_for_interpolation`** (boolean): Auto-adjust FPS for interpolation (default: true)

## Pricing Structure

The model uses a **fixed per-video pricing** system:

- **Base Cost**: $0.08 per video
- **No Additional Charges**: Cost is independent of resolution, frames, duration, or other parameters

### Cost Examples

| Scenario | Cost | Description |
|----------|------|-------------|
| Any video generation | $0.08 | Fixed cost regardless of parameters |

## Usage Examples

### Basic Video Generation

```typescript
import { FalAiWanV225bTextToVideoDistillExecutor } from './executors/fal-ai-wan-v2-2-5b-text-to-video-distill';

const executor = new FalAiWanV225bTextToVideoDistillExecutor();

const result = await executor.generateVideo({
  prompt: 'A medium shot establishes a modern, minimalist office setting: clean lines, muted grey walls, and polished wood surfaces. The focus shifts to a close-up on a woman in sharp, navy blue business attire. Her crisp white blouse contrasts with the deep blue of her tailored suit jacket. The subtle texture of the fabric is visible—a fine weave with a slight sheen. Her expression is serious, yet engaging, as she speaks to someone unseen just beyond the frame. Close-up on her eyes, showing the intensity of her gaze and the fine lines around them that hint at experience and focus. Her lips are slightly parted, as if mid-sentence. The light catches the subtle highlights in her auburn hair, meticulously styled. Note the slight catch of light on the silver band of her watch. High resolution 4k',
  num_frames: 81,
  frames_per_second: 24,
  resolution: '720p',
  aspect_ratio: '16:9',
  num_inference_steps: 40,
  enable_safety_checker: true,
  enable_prompt_expansion: false,
  guidance_scale: 1,
  shift: 5,
  interpolator_model: 'film',
  num_interpolated_frames: 0,
  adjust_fps_for_interpolation: true
});
```

### Queue-Based Processing for Longer Videos

```typescript
// Submit to queue
const { request_id } = await executor.submitToQueue({
  prompt: 'A serene mountain stream flows through a lush forest valley. Crystal clear water cascades over smooth rocks, creating gentle ripples and reflections. Sunlight filters through the canopy, casting dappled shadows on the forest floor. Wildflowers bloom along the stream banks, their colors vibrant against the green foliage. A gentle breeze rustles the leaves, and birds can be heard singing in the distance. The scene captures the peaceful tranquility of nature in high definition.',
  num_frames: 120,
  frames_per_second: 30,
  resolution: '720p',
  aspect_ratio: '16:9',
  num_inference_steps: 60,
  enable_safety_checker: true,
  enable_prompt_expansion: true,
  guidance_scale: 2.0,
  shift: 7,
  interpolator_model: 'film',
  num_interpolated_frames: 2,
  adjust_fps_for_interpolation: true
});

// Check status
const status = await FalAiWanV225bTextToVideoDistillExecutor.checkQueueStatus(request_id);

// Get result when complete
if (status.status === 'completed') {
  const result = await FalAiWanV225bTextToVideoDistillExecutor.getQueueResult(request_id);
}
```

### Cost Calculation

```typescript
// Calculate cost (always fixed)
const cost = executor.calculateCost(); // $0.08

// Get cost examples
const examples = executor.getCostExamples();
```

## Best Practices

### Prompt Writing

1. **Be Cinematic**: Use detailed, scene-establishing descriptions
2. **Describe Camera Work**: Mention shots, angles, and movements
3. **Include Visual Details**: Colors, lighting, textures, and atmosphere
4. **Character Development**: Describe expressions, clothing, and actions
5. **Environmental Context**: Set the scene with background details
6. **Use the Example**: Reference the provided example prompt for structure
7. **Be Specific**: Include concrete details rather than abstract concepts
8. **Consider Motion**: Describe how elements should move or change

### Parameter Optimization

1. **Start with Defaults**: Use 81 frames, 24 FPS, 40 inference steps
2. **Resolution Choice**: Use 720p for professional content, 580p for testing
3. **Inference Steps**: 40-50 for balance, 60+ for higher quality
4. **Guidance Scale**: 1.0-2.0 for optimal results
5. **Frame Interpolation**: Enable for smoother motion
6. **Safety Checker**: Keep enabled unless speed is critical

### Performance Optimization

1. **Use 580p for Testing**: Faster processing during development
2. **Limit Frame Count**: Start with 81 frames for quick iterations
3. **Moderate Inference Steps**: Balance quality and speed
4. **Enable Interpolation**: Smooth motion without extra generation time
5. **Use Queue Processing**: For longer videos and batch operations

## Common Use Cases

### Professional Content Creation
- Marketing and advertising videos
- Brand storytelling content
- Corporate communication materials
- Product demonstration videos
- Professional presentation enhancement

### Creative and Entertainment
- Cinematic scene creation
- Character and story visualization
- Artistic and creative content
- Entertainment video production
- Content for streaming platforms

### Social Media and Marketing
- Social media video content
- Influencer content creation
- Brand awareness campaigns
- Product showcases
- Educational content

### Business Applications
- Training material creation
- Corporate communications
- Business concept visualization
- Professional development content
- Industry-specific content

## Technical Considerations

### Processing Time
- Higher frame counts increase processing time
- More inference steps improve quality but slow generation
- Resolution affects processing speed (580p faster than 720p)
- Frame interpolation adds minimal overhead

### Quality Factors
- Inference steps directly impact output quality
- Resolution affects visual clarity and detail
- Guidance scale controls prompt adherence
- Shift parameter affects video dynamics and motion

### Cost Optimization
- Fixed cost means no parameter-based savings
- Use queue processing for batch operations
- Optimize for speed during development
- Focus on quality for final outputs

## Error Handling

The executor provides comprehensive error handling with specific error codes:

- `GENERATION_FAILED`: Video generation process failed
- `QUEUE_SUBMIT_FAILED`: Failed to submit to processing queue
- `STATUS_CHECK_FAILED`: Failed to check queue status
- `RESULT_FETCH_FAILED`: Failed to retrieve queue result

### Common Issues and Solutions

1. **Generation Fails**: Reduce frame count or inference steps
2. **Poor Quality**: Increase inference steps and resolution
3. **Unexpected Motion**: Adjust guidance scale and shift parameter
4. **Processing Errors**: Verify parameters within valid ranges
5. **Content Filtered**: Check safety checker settings

## Integration Examples

### Real-time Processing

```typescript
const result = await fal.subscribe('fal-ai/wan/v2.2-5b/text-to-video/distill', {
  input: {
    prompt: 'A bustling city skyline at golden hour, with modern skyscrapers reflecting the warm orange and pink hues of the setting sun. The city streets below are alive with activity - cars moving in traffic, people walking on sidewalks, and streetlights beginning to glow. The atmosphere is vibrant and energetic, capturing the dynamic urban lifestyle. The architecture showcases contemporary design with glass facades and geometric shapes.',
    num_frames: 120,
    frames_per_second: 30,
    resolution: '720p',
    aspect_ratio: '16:9',
    num_inference_steps: 60,
    enable_safety_checker: true,
    enable_prompt_expansion: true,
    guidance_scale: 2.0,
    shift: 7,
    interpolator_model: 'film',
    num_interpolated_frames: 2,
    adjust_fps_for_interpolation: true
  },
  pollInterval: 1000,
  onResult: (result) => console.log('Complete:', result),
  onError: (error) => console.error('Error:', error)
});
```

### Batch Processing

```typescript
const prompts = [
  'Portrait of a confident business professional in a modern office',
  'Serene nature scene with flowing water and gentle sunlight',
  'Dynamic urban cityscape with modern architecture and activity'
];

const results = await Promise.all(
  prompts.map(prompt => 
    executor.generateVideo({
      prompt,
      num_frames: 81,
      frames_per_second: 24,
      resolution: '580p',
      aspect_ratio: '16:9',
      num_inference_steps: 40,
      enable_safety_checker: true,
      enable_prompt_expansion: false,
      guidance_scale: 1.5,
      shift: 5,
      interpolator_model: 'film',
      num_interpolated_frames: 1,
      adjust_fps_for_interpolation: true
    })
  )
);
```

## Advanced Features

### Inference Step Control

- **20-30 steps**: Fast generation, lower quality
- **40-50 steps**: Balanced quality and speed (recommended)
- **60-80 steps**: Higher quality, slower generation
- **80+ steps**: Maximum quality, slowest generation

### Guidance Scale Control

- **0.5-1.0**: Lower adherence to prompt, more creative freedom
- **1.0-2.0**: Balanced adherence and creativity (recommended)
- **2.0-3.0**: Higher adherence to prompt, less creative variation
- **3.0+**: Very strict adherence to prompt, minimal creativity

### Shift Parameter

- **1.0-3.0**: Subtle video dynamics
- **3.0-7.0**: Balanced dynamics (recommended)
- **7.0-10.0**: Dramatic video dynamics and motion

### Frame Interpolation

- **Film model**: Smooth, cinematic interpolation
- **RIFE model**: Fast, efficient interpolation
- **No interpolation**: Faster processing, potential motion artifacts

## Troubleshooting

### Performance Issues

- **Slow Processing**: Reduce inference steps and frame count
- **Queue Delays**: Check queue status and use webhooks
- **Memory Issues**: Use lower resolution for testing

### Quality Issues

- **Poor Motion**: Increase inference steps and enable interpolation
- **Low Quality**: Use higher resolution and more inference steps
- **Unexpected Results**: Adjust guidance scale and shift parameter

### API Issues

- **Authentication Errors**: Check API key and permissions
- **Rate Limits**: Implement retry logic and respect limits
- **Parameter Validation**: Ensure all values are within valid ranges

## Support and Resources

- **Documentation**: Complete API reference and examples
- **Example Prompt**: Detailed reference for prompt writing
- **Community**: Active user community and support forums
- **Updates**: Regular model improvements and feature additions

The WAN v2.2 5B Distill Text-to-Video model provides efficient, high-quality video generation capabilities with predictable pricing. By following these guidelines and leveraging the advanced parameter controls, you can achieve excellent results while optimizing for your specific use case requirements.
