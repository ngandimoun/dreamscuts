# MiniMax Hailuo-02 Fast Image-to-Video Usage Guide

## Overview

The **MiniMax Hailuo-02 Fast Image-to-Video** model (`fal-ai/minimax/hailuo-02-fast/image-to-video`) is a fast and economical AI-powered tool that creates videos from images using MiniMax Hailuo-02 technology. It generates videos at 512p resolution with blazing fast processing and cost-effective pricing at $0.017 per second.

## Key Features

- **Fast Generation**: Optimized for quick iterations and rapid content creation
- **Cost Effective**: Economical pricing at $0.017 per second of video
- **Fixed Resolution**: Consistent 512p output quality for reliable results
- **Duration Control**: Support for 6 or 10 second video outputs
- **Prompt Optimization**: Built-in prompt optimizer for enhanced results
- **Image-to-Video**: Transform static images into dynamic video content
- **Queue Support**: Handle long-running requests with webhook integration

## Input Parameters

### Required Parameters

- **`prompt`** (string): Text description of the desired video motion and action
- **`image_url`** (string): URL of the source image to animate

### Optional Parameters

- **`duration`** (6|10): Duration of the output video in seconds
- **`prompt_optimizer`** (boolean): Enable automatic prompt optimization (default: true)

## Pricing Structure

The model uses a **per-second pricing** system:

- **Base Rate**: $0.017 per second of video
- **6-second video**: $0.102 total
- **10-second video**: $0.17 total

### Cost Examples

| Duration | Cost | Description |
|----------|------|-------------|
| 6 seconds | $0.102 | Quick content and testing |
| 10 seconds | $0.17 | Extended storytelling and showcases |

## Usage Examples

### Basic Video Generation

```typescript
import { FalAiMinimaxHailuo02FastImageToVideoExecutor } from './executors/fal-ai-minimax-hailuo-02-fast-image-to-video';

const executor = new FalAiMinimaxHailuo02FastImageToVideoExecutor();

const result = await executor.generateVideo({
  prompt: 'Extremely realistic movement An old samurai is breaking a stone in half',
  image_url: 'https://v3.fal.media/files/tiger/U9HN_tm5-3Ls52SbD6CrW_image.webp',
  duration: '6',
  prompt_optimizer: true
});
```

### Queue-Based Processing for Longer Videos

```typescript
// Submit to queue
const { request_id } = await executor.submitToQueue({
  prompt: 'Portrait comes to life with subtle head movements and blinking eyes',
  image_url: 'https://example.com/portrait.jpg',
  duration: '10',
  prompt_optimizer: true
});

// Check status
const status = await FalAiMinimaxHailuo02FastImageToVideoExecutor.checkQueueStatus(request_id);

// Get result when complete
if (status.status === 'completed') {
  const result = await FalAiMinimaxHailuo02FastImageToVideoExecutor.getQueueResult(request_id);
}
```

### Cost Calculation

```typescript
// Calculate cost for different durations
const cost6sec = executor.calculateCost(6); // $0.102
const cost10sec = executor.calculateCost(10); // $0.17

// Get all duration options with costs
const options = executor.getDurationOptions();
```

## Best Practices

### Prompt Writing

1. **Be Specific**: Describe the desired motion and action clearly
2. **Use Action Verbs**: Include specific movements and transformations
3. **Reference the Image**: Mention elements from the source image
4. **Describe Motion**: Explain how objects or characters should move
5. **Consider Timing**: Think about the sequence of events
6. **Use Descriptive Language**: Include adjectives for desired outcomes

### Image Preparation

1. **High Quality**: Use clear, high-resolution source images
2. **Clear Subject**: Choose images with well-defined focal points
3. **Good Lighting**: Ensure proper contrast and visibility
4. **Simple Composition**: Avoid overly complex or cluttered images
5. **Accessible URL**: Ensure the image is publicly accessible
6. **Appropriate Format**: Use common image formats (JPG, PNG, WebP)

### Parameter Optimization

1. **Start with 6 seconds**: Use shorter duration for testing and iterations
2. **Enable Prompt Optimizer**: Let the model enhance your prompts automatically
3. **Clear Descriptions**: Provide specific, actionable prompts
4. **Test Variations**: Experiment with different prompt approaches

## Common Use Cases

### Social Media Content
- Transform profile pictures into animated content
- Create engaging posts from product photos
- Animate artwork and designs for sharing

### Marketing and Advertising
- Product demonstration videos
- Brand storytelling content
- Character animation for campaigns

### Content Creation
- Educational material enhancement
- Entertainment and creative content
- Portrait animation and expression changes

### Professional Applications
- Corporate communication videos
- Training material creation
- Business concept visualization

## Technical Considerations

### Processing Time
- 6-second videos process faster than 10-second videos
- Image quality affects processing speed
- Queue processing recommended for longer videos

### Quality Factors
- Input image resolution impacts final video quality
- Prompt clarity affects motion accuracy
- Duration affects content complexity

### Cost Optimization
- Use 6-second duration for testing
- Enable prompt optimizer for better results
- Batch process multiple videos when possible

## Error Handling

The executor provides comprehensive error handling with specific error codes:

- `GENERATION_FAILED`: Video generation process failed
- `QUEUE_SUBMIT_FAILED`: Failed to submit to processing queue
- `STATUS_CHECK_FAILED`: Failed to check queue status
- `RESULT_FETCH_FAILED`: Failed to retrieve queue result

### Common Issues and Solutions

1. **Generation Fails**: Simplify the prompt or check image URL accessibility
2. **Poor Quality**: Use higher quality input images and clearer prompts
3. **Unexpected Motion**: Be more specific in describing desired movements
4. **Processing Errors**: Verify image URL and reduce prompt complexity

## Integration Examples

### Real-time Processing

```typescript
const result = await fal.subscribe('fal-ai/minimax/hailuo-02-fast/image-to-video', {
  input: {
    prompt: 'Product rotates slowly showing all angles and features',
    image_url: 'https://example.com/product.jpg',
    duration: '6',
    prompt_optimizer: true
  },
  pollInterval: 1000,
  onResult: (result) => console.log('Complete:', result),
  onError: (error) => console.error('Error:', error)
});
```

### Batch Processing

```typescript
const images = [
  { url: 'image1.jpg', prompt: 'Portrait blinks and smiles' },
  { url: 'image2.jpg', prompt: 'Object floats and rotates' },
  { url: 'image3.jpg', prompt: 'Character waves and moves' }
];

const results = await Promise.all(
  images.map(image => 
    executor.generateVideo({
      prompt: image.prompt,
      image_url: image.url,
      duration: '6',
      prompt_optimizer: true
    })
  )
);
```

## Cost Optimization

### Strategies to Reduce Costs

1. **Use 6-second duration**: 40% cheaper than 10-second videos
2. **Test with shorter prompts**: Validate concepts before longer generation
3. **Batch processing**: Process multiple videos together
4. **Enable prompt optimizer**: Improve results without additional cost

### Cost Estimation Tools

The executor provides built-in cost calculation:

```typescript
// Get cost examples for different scenarios
const examples = executor.getCostExamples();

// Calculate custom costs
const customCost = executor.calculateCost(8); // $0.136 for 8 seconds
```

## Advanced Features

### Prompt Optimizer

- Automatic prompt enhancement for better results
- Improved motion and action descriptions
- Better adherence to user intentions
- No additional cost for optimization

### Duration Control

- **6 seconds**: Quick content, testing, social media
- **10 seconds**: Storytelling, detailed demonstrations, extended content

### Queue Processing

- Submit long-running requests to queue
- Check status and retrieve results asynchronously
- Webhook support for notifications
- Better handling of complex generations

## Troubleshooting

### Performance Issues

- **Slow Processing**: Use 6-second duration for faster results
- **Queue Delays**: Check queue status and use webhooks
- **Image Loading**: Verify image URL accessibility

### Quality Issues

- **Poor Motion**: Improve prompt specificity and clarity
- **Low Quality**: Use higher resolution input images
- **Unexpected Results**: Enable prompt optimizer and refine prompts

### API Issues

- **Authentication Errors**: Check API key and permissions
- **Rate Limits**: Implement retry logic and respect limits
- **Network Issues**: Use appropriate timeout values

## Support and Resources

- **Documentation**: Complete API reference and examples
- **Community**: Active user community and support forums
- **Updates**: Regular model improvements and feature additions
- **Examples**: Extensive collection of use cases and implementations

The MiniMax Hailuo-02 Fast Image-to-Video model provides fast, cost-effective video generation capabilities while maintaining consistent quality. By following these guidelines and best practices, you can achieve excellent results while optimizing costs and processing time.
