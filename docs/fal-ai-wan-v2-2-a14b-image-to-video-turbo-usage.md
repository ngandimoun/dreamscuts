# WAN v2.2 A14B Image-to-Video Turbo Usage Guide

## Overview

The **WAN v2.2 A14B Image-to-Video Turbo** model (`fal-ai/wan/v2.2-a14b/image-to-video/turbo`) is an advanced AI-powered tool that generates high-quality videos from static images using the WAN (World Animation Network) architecture. This turbo version provides faster processing while maintaining exceptional quality for creating dynamic motion from still images.

## Key Features

- **High-Quality Output**: Generate videos up to 1024x1024 resolution with up to 32 frames
- **Motion Control**: Precise control over motion complexity using motion bucket IDs (1-255)
- **Turbo Processing**: Faster generation compared to standard WAN models
- **Prompt-Based Animation**: Control motion and style through natural language descriptions
- **Resolution Flexibility**: Custom output dimensions from 256x256 to 1024x1024
- **Queue Management**: Handle long-running requests with webhook support
- **Cost Optimization**: Per-compute-second billing for efficient resource usage

## Input Parameters

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `image_url` | string | URL to the input image | `"https://example.com/portrait.jpg"` |
| `prompt` | string | Description of desired motion/animation | `"A person gently swaying from side to side"` |

### Optional Parameters

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `negative_prompt` | string | - | - | What to avoid in the output |
| `num_frames` | number | 1-32 | 16 | Number of frames to generate |
| `fps` | number | 1-60 | calculated | Frame rate (or automatic) |
| `motion_bucket_id` | number | 1-255 | 127 | Controls motion complexity |
| `cond_aug` | number | 0-1 | - | Conditional augmentation strength |
| `decoding_t` | number | 1-20 | - | Decoding temperature |
| `width` | number | 256-1024 | 512 | Output video width |
| `height` | number | 256-1024 | 512 | Output video height |
| `num_inference_steps` | number | 1-50 | 14 | Quality vs speed trade-off |
| `guidance_scale` | number | 0-20 | 7.5 | Prompt adherence strength |
| `seed` | number | 0-2147483647 | random | For reproducible results |
| `loop` | boolean | true/false | false | Create looping video |

## Pricing Structure

### Base Cost
- **Rate**: $0.0013 per compute second
- **Billing**: Based on actual compute time used

### Cost Examples

#### Short Videos (Basic Quality)
- **16 frames, 512x512, 14 steps**: ~$0.104
- **24 frames, 512x512, 20 steps**: ~$0.234

#### Medium Videos (HD Quality)
- **16 frames, 768x768, 20 steps**: ~$0.351
- **24 frames, 768x768, 25 steps**: ~$0.585

#### High-Quality Videos (Ultra HD)
- **24 frames, 1024x1024, 30 steps**: ~$1.17
- **32 frames, 1024x1024, 35 steps**: ~$1.95

### Cost Calculation
```typescript
const cost = computeSeconds * 0.0013;
```

## Usage Examples

### Basic Video Generation
```typescript
import { FalAiWanV22A14bImageToVideoTurboExecutor } from './executors';

const executor = new FalAiWanV22A14bImageToVideoTurboExecutor();

const result = await executor.generateVideo({
  image_url: "https://example.com/portrait.jpg",
  prompt: "A person gently swaying from side to side with a peaceful expression"
});

console.log('Generated video:', result.video.url);
```

### Enhanced Video with Custom Settings
```typescript
const result = await executor.generateVideo({
  image_url: "https://example.com/dancer.jpg",
  prompt: "A dancer performing graceful movements with flowing motion",
  num_frames: 24,
  motion_bucket_id: 191,
  num_inference_steps: 20,
  width: 768,
  height: 768
});
```

### Cinematic Quality Video
```typescript
const result = await executor.generateVideo({
  image_url: "https://example.com/landscape.jpg",
  prompt: "A cinematic landscape with gentle camera movement and atmospheric lighting",
  num_frames: 16,
  motion_bucket_id: 127,
  num_inference_steps: 25,
  guidance_scale: 8.5,
  width: 1024,
  height: 1024
});
```

### Queue-Based Processing
```typescript
// Submit to queue for long-running processing
const { request_id } = await executor.submitToQueue({
  image_url: "https://example.com/complex-image.jpg",
  prompt: "Complex animation with multiple moving elements",
  num_frames: 32,
  motion_bucket_id: 255,
  num_inference_steps: 35
});

// Check status
const status = await FalAiWanV22A14bImageToVideoTurboExecutor.checkQueueStatus(request_id);

// Get result when complete
if (status.status === 'completed') {
  const result = await FalAiWanV22A14bImageToVideoTurboExecutor.getQueueResult(request_id);
  console.log('Video ready:', result.video.url);
}
```

## Video Type Recommendations

### Subtle Motion
- **Frames**: 16
- **Motion Bucket ID**: 64
- **Inference Steps**: 14
- **Guidance Scale**: 7.5
- **Use Case**: Gentle swaying, breathing, subtle movements

### Moderate Motion
- **Frames**: 16
- **Motion Bucket ID**: 127
- **Inference Steps**: 14
- **Guidance Scale**: 7.5
- **Use Case**: Walking, dancing, gesturing, turning

### Dynamic Motion
- **Frames**: 24
- **Motion Bucket ID**: 191
- **Inference Steps**: 20
- **Guidance Scale**: 8.0
- **Use Case**: Running, jumping, spinning, fast dancing

### Cinematic Quality
- **Frames**: 16
- **Motion Bucket ID**: 127
- **Inference Steps**: 20
- **Guidance Scale**: 8.5
- **Use Case**: Cinematic content with balanced motion

### Artistic Expression
- **Frames**: 24
- **Motion Bucket ID**: 191
- **Inference Steps**: 25
- **Guidance Scale**: 9.0
- **Use Case**: High-detail artistic content

## Motion Bucket ID Guide

### Low Motion (1-64)
- **Description**: Minimal movement, subtle animations
- **Examples**: Portrait breathing, gentle swaying, static poses with slight motion
- **Best For**: Portraits, still life, subtle character movements

### Medium Motion (65-127)
- **Description**: Moderate movement, natural motion
- **Examples**: Walking, dancing, gesturing, turning
- **Best For**: Human movement, natural animations, character actions

### High Motion (128-191)
- **Description**: Dynamic movement, active motion
- **Examples**: Running, jumping, spinning, fast dancing
- **Best For**: Sports, dance, action sequences, dynamic content

### Extreme Motion (192-255)
- **Description**: Intense movement, rapid motion
- **Examples**: Sprinting, acrobatics, fast sports, dramatic actions
- **Best For**: High-energy content, extreme sports, dramatic sequences

## Prompt Optimization Tips

### Structure
1. **Start with the main subject or action**
2. **Include motion descriptors** (walking, dancing, spinning)
3. **Add style and mood descriptors**
4. **Specify camera movement if desired**
5. **Include lighting and atmosphere details**

### Motion Descriptors
- **Gentle**: subtle, slow, smooth, gentle
- **Dynamic**: energetic, fast, dramatic, powerful
- **Rhythmic**: flowing, graceful, fluid, rhythmic
- **Sharp**: sudden, explosive, intense, sharp

### Style Descriptors
- **Cinematic**: professional, artistic, cinematic
- **Natural**: realistic, authentic, natural
- **Stylized**: cartoon, anime, painterly, stylized
- **Temporal**: vintage, retro, modern, futuristic

### Negative Prompt Examples
- **Quality Issues**: blurry, low quality, distorted, pixelated
- **Motion Issues**: static, frozen, motionless, still
- **Technical Issues**: glitch, artifact, noise, compression
- **Style Issues**: unrealistic, artificial, fake, synthetic

## Advanced Features

### Conditional Augmentation
- **Range**: 0-1
- **Effect**: Controls augmentation strength during generation
- **Use Case**: Fine-tune the balance between input image fidelity and creative freedom

### Decoding Temperature
- **Range**: 1-20
- **Effect**: Controls randomness in the generation process
- **Lower Values**: More deterministic, consistent results
- **Higher Values**: More creative, varied outputs

### Guidance Scale
- **Range**: 0-20
- **Effect**: Balances prompt adherence vs creative freedom
- **Lower Values**: More creative, less prompt-following
- **Higher Values**: More prompt-following, less creative

### Seed Control
- **Range**: 0-2147483647
- **Effect**: Enables reproducible results
- **Use Case**: Consistent outputs for iterative refinement

## Use Cases and Applications

### Content Creation
- **Social Media**: Create engaging video content from photos
- **Marketing**: Enhance product images with motion
- **Branding**: Animate logos and brand elements
- **Storytelling**: Bring static narratives to life

### Entertainment
- **Music Videos**: Animate album artwork and band photos
- **Gaming**: Enhance character portraits and concept art
- **Animation**: Convert storyboards to animated sequences
- **Art**: Bring digital art and paintings to life

### Business
- **Presentations**: Animate charts and diagrams
- **Training**: Create dynamic training materials
- **Product Demos**: Show products in motion
- **Corporate**: Enhance communication materials

### Technical
- **Research**: Motion analysis and visualization
- **Education**: Interactive learning materials
- **Documentation**: Animated technical diagrams
- **Prototyping**: Quick motion concept validation

## Technical Considerations

### Processing Time
- **Factors**: Frame count, resolution, inference steps, motion complexity
- **Estimation**: Use `estimateComputeSeconds()` method for planning
- **Queue Processing**: Recommended for videos longer than 16 frames

### Quality Factors
- **Input Image**: High-quality, clear images produce better results
- **Prompt Clarity**: Specific, descriptive prompts improve output
- **Motion Complexity**: Higher motion bucket IDs require more processing
- **Resolution**: Higher resolutions increase quality but processing time

### Best Practices
- **Start Simple**: Begin with basic settings and refine
- **Test Parameters**: Experiment with different motion bucket IDs
- **Balance Quality**: Find the right balance between quality and speed
- **Use Queue**: For longer videos, use queue processing

## Error Handling

### Common Errors
```typescript
try {
  const result = await executor.generateVideo(input);
} catch (error) {
  if (error.message.includes('image_url is required')) {
    console.error('Please provide a valid image URL');
  } else if (error.message.includes('prompt is required')) {
    console.error('Please provide a description of desired motion');
  } else if (error.message.includes('Invalid URL format')) {
    console.error('Please provide a valid URL format');
  } else {
    console.error('Video generation failed:', error.message);
  }
}
```

### Validation Errors
- **Missing Required Fields**: Ensure `image_url` and `prompt` are provided
- **Invalid Ranges**: Check parameter values are within allowed ranges
- **URL Format**: Verify image URLs are properly formatted
- **File Accessibility**: Ensure image URLs are publicly accessible

## Integration Examples

### React Component
```typescript
import React, { useState } from 'react';
import { FalAiWanV22A14bImageToVideoTurboExecutor } from './executors';

const VideoGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateVideo = async (imageUrl: string, prompt: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const executor = new FalAiWanV22A14bImageToVideoTurboExecutor();
      const result = await executor.generateVideo({ image_url: imageUrl, prompt });
      setVideoUrl(result.video.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Form inputs for image URL and prompt */}
      {loading && <div>Generating video...</div>}
      {error && <div className="error">{error}</div>}
      {videoUrl && <video src={videoUrl} controls />}
    </div>
  );
};
```

### Node.js Server
```typescript
import express from 'express';
import { FalAiWanV22A14bImageToVideoTurboExecutor } from './executors';

const app = express();
app.use(express.json());

app.post('/generate-video', async (req, res) => {
  try {
    const { image_url, prompt, ...options } = req.body;
    
    const executor = new FalAiWanV22A14bImageToVideoTurboExecutor();
    const result = await executor.generateVideo({ image_url, prompt, ...options });
    
    res.json({ success: true, video: result.video });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.post('/submit-video-queue', async (req, res) => {
  try {
    const { image_url, prompt, webhook_url, ...options } = req.body;
    
    const executor = new FalAiWanV22A14bImageToVideoTurboExecutor();
    const result = await executor.submitToQueue(
      { image_url, prompt, ...options },
      { webhookUrl: webhook_url }
    );
    
    res.json({ success: true, request_id: result.request_id });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.get('/video-status/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const status = await FalAiWanV22A14bImageToVideoTurboExecutor.checkQueueStatus(requestId);
    res.json({ success: true, status });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});
```

## Cost Optimization Strategies

### Resolution Optimization
- **Start Low**: Begin with 512x512 for testing
- **Scale Up**: Increase resolution only when needed
- **Aspect Ratio**: Use square dimensions for best cost efficiency

### Frame Count Optimization
- **Minimum Frames**: Use 16 frames for basic motion
- **Quality vs Cost**: Balance frame count with quality requirements
- **Test Incrementally**: Start with fewer frames and increase as needed

### Inference Steps Optimization
- **Default (14)**: Good balance of quality and speed
- **High Quality (20+)**: For final outputs
- **Fast Preview (10-14)**: For testing and iteration

### Motion Complexity
- **Lower Motion**: Use motion bucket IDs 1-127 for cost efficiency
- **Higher Motion**: Reserve higher IDs for special effects
- **Test Settings**: Find the minimum motion bucket ID for your needs

## Troubleshooting

### Quality Issues
- **Blurry Output**: Increase inference steps or check input image quality
- **Poor Motion**: Adjust motion bucket ID or refine prompt
- **Inconsistent Results**: Use seed values for reproducible outputs
- **Artifacts**: Reduce resolution or adjust guidance scale

### Processing Issues
- **Long Wait Times**: Use queue processing for longer videos
- **Failed Requests**: Check image URL accessibility and API key
- **Memory Errors**: Reduce resolution or frame count
- **Timeout Issues**: Use queue processing for complex requests

### Motion Issues
- **Too Much Motion**: Lower motion bucket ID
- **Too Little Motion**: Increase motion bucket ID
- **Unnatural Motion**: Refine prompt with better motion descriptors
- **Motion Direction**: Be specific about movement direction in prompts

## Performance Tips

### Input Preparation
- **Image Quality**: Use high-resolution, clear images
- **Format**: Ensure images are in common formats (JPEG, PNG)
- **Composition**: Clear subjects with good contrast
- **Size**: Optimize image size for your target resolution

### Processing Workflow
- **Test First**: Start with small, simple examples
- **Iterate**: Refine parameters based on results
- **Batch Process**: Use queue processing for multiple videos
- **Monitor Costs**: Track compute time and costs

### Output Optimization
- **Format Selection**: Choose appropriate output format
- **Compression**: Balance quality and file size
- **Storage**: Plan for video storage and delivery
- **Delivery**: Consider CDN for video distribution

## Conclusion

The WAN v2.2 A14B Image-to-Video Turbo model provides powerful capabilities for creating dynamic video content from static images. By understanding the parameters, optimizing prompts, and following best practices, you can achieve high-quality results while managing costs effectively.

Key success factors include:
- **Clear, descriptive prompts** with motion descriptors
- **Appropriate motion bucket ID** selection for desired motion level
- **Balanced parameter settings** for quality vs speed
- **Queue processing** for longer or complex videos
- **Iterative refinement** based on initial results

Start with simple examples and gradually explore the advanced features to unlock the full potential of this powerful AI video generation model.
