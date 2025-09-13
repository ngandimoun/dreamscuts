# LTX Video 13B 0.98 Distilled - Image to Video

## Overview

The **LTX Video 13B 0.98 Distilled - Image to Video** model is a powerful AI video generation tool that creates videos from both text prompts and reference images. This model leverages the advanced LTX Video architecture to generate high-quality, temporally consistent videos while maintaining visual coherence with the provided reference image.

## Key Features

- **Image-Driven Generation**: Uses reference images to guide video creation
- **Long Video Support**: Generates videos up to 121 frames (5+ seconds at 24fps)
- **High Quality Output**: Supports 480p and 720p resolutions
- **Custom LoRA Integration**: Apply specialized style and character LoRAs
- **Two-Pass Generation**: Optional detail pass for enhanced quality
- **Temporal Consistency**: Advanced algorithms for smooth motion
- **Cost-Effective**: $0.02 per second of generated video

## Input Parameters

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `prompt` | string | Text description of the desired video | "The astronaut gets up and walks away" |
| `image_url` | string | URL of the reference image | "https://example.com/image.jpg" |

### Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `negative_prompt` | string | "worst quality, inconsistent motion, blurry, jittery, distorted" | Text describing what to avoid |
| `resolution` | enum | "720p" | Video resolution (480p, 720p) |
| `aspect_ratio` | enum | "auto" | Video aspect ratio (9:16, 1:1, 16:9, auto) |
| `num_frames` | integer | 121 | Number of frames in the video |
| `frame_rate` | integer | 24 | Frames per second |
| `seed` | integer | random | Random seed for reproducible results |
| `enable_detail_pass` | boolean | false | Enable second pass for enhanced quality |
| `temporal_adain_factor` | float | 0.5 | Color consistency across frames (0.0-1.0) |
| `tone_map_compression_ratio` | float | 0 | Dynamic range compression (0.0-1.0) |

## Pricing Structure

### Base Pricing
- **Cost**: $0.02 per second of video
- **Billing**: Based on 24 frames per second
- **Example**: 5 seconds = $0.10, 10 seconds = $0.20

### Cost Multipliers
- **Detail Pass**: 2x cost multiplier for enhanced quality
- **Resolution**: No additional cost for different resolutions

### Cost Examples

| Duration | Base Cost | With Detail Pass |
|----------|-----------|------------------|
| 5 seconds | $0.10 | $0.20 |
| 10 seconds | $0.20 | $0.40 |
| 30 seconds | $0.60 | $1.20 |
| 50 seconds | $1.00 | $2.00 |

## Usage Examples

### Basic Image-to-Video Generation

```typescript
import { Ltxv13b098DistilledImageToVideoExecutor } from './executors/ltxv-13b-098-distilled-image-to-video';

const executor = new Ltxv13b098DistilledImageToVideoExecutor();

const result = await executor.generateVideo({
  prompt: "The astronaut gets up and walks away",
  image_url: "https://example.com/astronaut.jpg",
  num_frames: 121,
  resolution: "720p"
});

console.log('Video URL:', result.video.url);
```

### Cinematic Style Video

```typescript
const result = await executor.generateVideo({
  prompt: "A cinematic scene with dramatic lighting and slow motion",
  image_url: "https://example.com/character.jpg",
  resolution: "720p",
  aspect_ratio: "16:9",
  enable_detail_pass: true,
  temporal_adain_factor: 0.8,
  tone_map_compression_ratio: 0.3
});
```

### Portrait Video with Custom Settings

```typescript
const result = await executor.generateVideo({
  prompt: "A person smiling and waving at the camera",
  image_url: "https://example.com/portrait.jpg",
  resolution: "720p",
  aspect_ratio: "9:16",
  num_frames: 60,
  frame_rate: 24,
  first_pass_num_inference_steps: 10,
  second_pass_num_inference_steps: 10
});
```

### Queue-Based Processing

```typescript
// Submit to queue
const { request_id } = await executor.submitToQueue({
  prompt: "A car driving through a city",
  image_url: "https://example.com/car.jpg",
  webhookUrl: "https://your-webhook.com/callback"
});

// Check status
const status = await executor.checkQueueStatus(request_id, true);

// Get result when complete
if (status.status === 'COMPLETED') {
  const result = await executor.getQueueResult(request_id);
  console.log('Video ready:', result.video.url);
}
```

## Recommendations

### Frame Count
- **Short clips**: 24-60 frames (1-2.5 seconds)
- **Medium videos**: 60-121 frames (2.5-5 seconds)
- **Long content**: 121 frames (5+ seconds)

### Resolution
- **480p**: Faster processing, lower cost, suitable for testing
- **720p**: Higher quality, better for production use

### Aspect Ratio
- **16:9**: Standard widescreen, good for most content
- **9:16**: Portrait mode, ideal for mobile/social media
- **1:1**: Square format, versatile for various platforms
- **auto**: Automatically determined from reference image

### Advanced Features

#### Two-Pass Generation
- **First Pass**: Creates the base video structure
- **Second Pass**: Refines details and enhances quality
- **Cost Impact**: Doubles the total cost
- **Use Case**: High-quality outputs, close-up shots

#### Detail Pass Control
```typescript
const result = await executor.generateVideo({
  prompt: "A detailed close-up of a flower blooming",
  image_url: "https://example.com/flower.jpg",
  enable_detail_pass: true,
  second_pass_skip_initial_steps: 3
});
```

#### Inference Step Control
```typescript
// Fast generation
const fastSettings = executor.getRecommendedInferenceSteps('fast');
// { firstPass: 6, secondPass: 6 }

// High quality
const highSettings = executor.getRecommendedInferenceSteps('high');
// { firstPass: 12, secondPass: 12 }
```

#### Temporal AdaIN Factor
- **0.1-0.3**: More color variation across frames
- **0.5**: Balanced approach (default)
- **0.7-0.9**: Consistent color distribution

#### Tone Mapping
- **0.0**: No compression, preserves dynamic range
- **0.5**: Moderate compression for balanced results
- **1.0**: Maximum compression, improves consistency

## LoRA Integration

### Available LoRA Types
```typescript
const loraRecommendations = executor.getLoRARecommendations();

// Style LoRAs for consistent artistic style
// Character LoRAs for consistent appearance
// Object LoRAs for consistent representation
```

### Using Custom LoRAs
```typescript
const result = await executor.generateVideo({
  prompt: "A character in anime style walking",
  image_url: "https://example.com/character.jpg",
  loras: [
    {
      path: "https://huggingface.co/user/anime-style-lora",
      scale: 0.8
    }
  ]
});
```

## Prompt Writing Tips

### Effective Prompt Structure
1. **Subject**: Clearly describe the main subject
2. **Action**: Specify what the subject is doing
3. **Setting**: Include environment and context
4. **Style**: Mention artistic style or cinematic techniques
5. **Camera**: Describe camera movement and framing
6. **Lighting**: Specify lighting conditions and mood
7. **Quality**: Use descriptive adjectives for visual quality

### Prompt Examples
- **Good**: "A majestic eagle soars through a golden sunset sky, wings spread wide, cinematic wide shot with warm lighting"
- **Better**: "A majestic eagle with detailed feathers soars gracefully through a golden sunset sky, wings fully extended, cinematic wide tracking shot with warm golden hour lighting, high resolution"

### Common Prompt Patterns
- **Character Actions**: "The [character] [action] in [setting]"
- **Environmental**: "A [scene] with [lighting] and [atmosphere]"
- **Cinematic**: "A [shot type] of [subject] with [camera movement]"
- **Artistic**: "A [style] painting of [subject] with [details]"

## Use Cases

### Product Demonstrations
- Showcase products in motion
- Create engaging marketing content
- Demonstrate product features dynamically

### Character Animation
- Bring static characters to life
- Create animated avatars
- Generate character-driven narratives

### Style Transfer
- Apply artistic styles to reference images
- Create unique visual aesthetics
- Transform photos into artistic videos

### Educational Content
- Animate diagrams and illustrations
- Create engaging learning materials
- Visualize complex concepts

### Creative Storytelling
- Develop visual narratives
- Create artistic video content
- Generate unique storytelling elements

## Technical Considerations

### Performance
- **Processing Time**: Varies based on video length and quality settings
- **Memory Usage**: High memory requirements for long videos
- **Scalability**: Good for batch processing multiple requests

### Quality vs. Speed Trade-offs
- **Fast Mode**: Lower inference steps, faster processing
- **Balanced Mode**: Default settings, good quality/speed balance
- **High Quality Mode**: Higher inference steps, slower but better quality

### Error Handling
```typescript
try {
  const result = await executor.generateVideo(input);
  // Handle success
} catch (error) {
  if (error.message.includes('Prompt is required')) {
    // Handle missing prompt
  } else if (error.message.includes('Image URL is required')) {
    // Handle missing image
  } else {
    // Handle other errors
  }
}
```

## Integration Examples

### React Component
```typescript
import React, { useState } from 'react';
import { Ltxv13b098DistilledImageToVideoExecutor } from './executors/ltxv-13b-098-distilled-image-to-video';

const VideoGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');

  const generateVideo = async (prompt: string, imageUrl: string) => {
    setLoading(true);
    try {
      const result = await Ltxv13b098DistilledImageToVideoExecutor.generateVideo({
        prompt,
        image_url: imageUrl
      });
      setVideoUrl(result.video.url);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Your UI components */}
      {loading && <div>Generating video...</div>}
      {videoUrl && <video src={videoUrl} controls />}
    </div>
  );
};
```

### Node.js Server
```typescript
import express from 'express';
import { Ltxv13b098DistilledImageToVideoExecutor } from './executors/ltxv-13b-098-distilled-image-to-video';

const app = express();
app.use(express.json());

app.post('/generate-video', async (req, res) => {
  try {
    const { prompt, image_url } = req.body;
    
    const result = await Ltxv13b098DistilledImageToVideoExecutor.generateVideo({
      prompt,
      image_url
    });
    
    res.json({ success: true, video: result.video });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Cost Optimization

### Strategies
1. **Use 480p for testing**: Lower resolution for faster iteration
2. **Disable detail pass initially**: Start without the 2x cost multiplier
3. **Optimize frame count**: Use minimum frames needed for your use case
4. **Batch processing**: Submit multiple requests to the queue
5. **Efficient prompts**: Write clear, specific prompts to avoid regeneration

### Budget Planning
- **Development/Testing**: $0.10-0.50 per video
- **Production**: $0.20-2.00 per video (depending on length and quality)
- **High-Quality Outputs**: $0.40-4.00 per video (with detail pass)

## Troubleshooting

### Common Issues
1. **Missing Image URL**: Ensure the image URL is accessible and valid
2. **Prompt Too Long**: Keep prompts under 1000 characters
3. **Invalid Resolution**: Use only 480p or 720p
4. **Processing Delays**: Use queue-based processing for long videos

### Best Practices
1. **Test with small videos first**: Start with 24-60 frames
2. **Use high-quality reference images**: Better input = better output
3. **Monitor costs**: Track usage to stay within budget
4. **Handle errors gracefully**: Implement proper error handling
5. **Use webhooks**: For production applications requiring reliability

## Support and Resources

- **Documentation**: Check the fal.ai documentation for updates
- **Community**: Join fal.ai community forums for tips and support
- **API Status**: Monitor fal.ai status page for service updates
- **Cost Calculator**: Use the `calculateCost` method to estimate expenses

---

*This model is part of the fal.ai LTX Video family, designed for high-quality, image-driven video generation with advanced control over style, motion, and quality.*
