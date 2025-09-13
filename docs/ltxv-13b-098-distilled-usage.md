# LTX Video 13B 0.98 Distilled Usage Guide

## Overview

The **LTX Video 13B 0.98 Distilled** model is a powerful text-to-video generation tool that creates long videos from prompts using LTX Video-0.9.8 13B Distilled technology. This model supports custom LoRA weights, advanced video processing options, and two-pass generation for enhanced quality. With its cost-effective pricing of $0.02 per second, it's ideal for generating extended video content for various applications.

## Key Features

- **Long Video Generation**: Create videos from 2.5 seconds to 30+ seconds in length
- **Custom LoRA Support**: Apply custom LoRA weights for style and character consistency
- **Two-Pass Generation**: First pass for structure, second pass for detail enhancement
- **Advanced Controls**: Temporal AdaIN, tone mapping, and inference step control
- **Cost-Effective**: $0.02 per second with optional detail pass (2x cost)
- **Multiple Formats**: Support for 480p and 720p resolutions
- **Flexible Aspect Ratios**: 16:9, 9:16, and 1:1 formats
- **Queue Support**: Asynchronous processing for longer videos

## Input Parameters

### Required Parameters

- **`prompt`** (string): Text description for video generation (max 2000 characters)

### Optional Parameters

- **`negative_prompt`** (string): Text to avoid in generation (default: "worst quality, inconsistent motion, blurry, jittery, distorted")
- **`loras`** (array): Custom LoRA weights for style control
- **`resolution`** (enum): Output quality - "480p" or "720p" (default: "720p")
- **`aspect_ratio`** (enum): Output format - "16:9", "9:16", or "1:1" (default: "16:9")
- **`seed`** (integer): Random seed for reproducible results
- **`num_frames`** (integer): Number of frames in video (default: 121)
- **`first_pass_num_inference_steps`** (integer): First pass quality (default: 8)
- **`second_pass_num_inference_steps`** (integer): Second pass quality (default: 8)
- **`second_pass_skip_initial_steps`** (integer): Skip steps in second pass (default: 5)
- **`frame_rate`** (integer): Video frame rate (default: 24)
- **`expand_prompt`** (boolean): AI prompt expansion (default: false)
- **`reverse_video`** (boolean): Reverse video playback (default: false)
- **`enable_safety_checker`** (boolean): Content moderation (default: true)
- **`enable_detail_pass`** (boolean): Enhanced detail generation (default: false)
- **`temporal_adain_factor`** (float): Color consistency (0.0-1.0, default: 0.5)
- **`tone_map_compression_ratio`** (float): Dynamic range compression (0.0-1.0, default: 0)

## Pricing Structure

### Base Cost
- **$0.02 per second** billed at 24 frames per second
- **Detail pass enabled**: Doubles the cost to $0.04 per second

### Cost Examples
- 5-second video: $0.10
- 10-second video: $0.20
- 30-second video: $0.60
- 5-second video with detail pass: $0.20
- 10-second video with detail pass: $0.40

### Cost Calculation
The model bills based on frame count at 24fps, regardless of your chosen frame rate:
- **Billed seconds** = `num_frames` ÷ 24
- **Base cost** = billed seconds × $0.02
- **Total cost** = base cost × detail pass multiplier (1.0 or 2.0)

## Usage Examples

### Basic Video Generation

```typescript
import { Ltxv13b098DistilledExecutor } from './executors/ltxv-13b-098-distilled';

const executor = new Ltxv13b098DistilledExecutor();

const result = await executor.generateVideo({
  prompt: "A person walking through a sunlit forest, dappled light filtering through trees, peaceful atmosphere, natural lighting, cinematic quality",
  num_frames: 121,
  resolution: "720p",
  aspect_ratio: "16:9"
});

console.log('Generated video URL:', result.video.url);
```

### Cinematic Scene with Detail Pass

```typescript
const result = await executor.generateVideo({
  prompt: "A cinematic fast-tracking shot follows a vintage, teal camper van as it descends a winding mountain trail. The van, slightly weathered but well-maintained, is the central focus, its retro design emphasized by the motion blur. Medium shot reveals the dusty, ochre trail, edged with vibrant green pine trees. Close-up on the van's tires shows the gravel spraying, highlighting the speed and rugged terrain. Sunlight filters through the trees, casting dappled shadows on the van and the trail. The background is a hazy, majestic mountain range bathed in warm, golden light. The overall mood is adventurous and exhilarating. High resolution 4k movie scene.",
  num_frames: 121,
  resolution: "720p",
  aspect_ratio: "16:9",
  enable_detail_pass: true,
  first_pass_num_inference_steps: 12,
  second_pass_num_inference_steps: 12
});
```

### Portrait Format for Mobile

```typescript
const result = await executor.generateVideo({
  prompt: "A person walking through a sunlit forest, dappled light filtering through trees, peaceful atmosphere, natural lighting, cinematic quality",
  num_frames: 240,
  resolution: "720p",
  aspect_ratio: "9:16",
  enable_detail_pass: false
});
```

### Custom LoRA Style Application

```typescript
const result = await executor.generateVideo({
  prompt: "A character in anime style walking through a magical forest, vibrant colors, smooth animation",
  loras: [
    {
      path: "https://huggingface.co/username/anime-style-lora",
      scale: 0.8
    }
  ],
  num_frames: 180,
  resolution: "720p",
  aspect_ratio: "16:9"
});
```

### Queue-Based Processing (Long Videos)

```typescript
// Submit to queue
const { request_id } = await executor.submitToQueue({
  prompt: "A complex cinematic sequence showing the evolution of a city from dawn to dusk, time-lapse style, multiple camera angles, professional cinematography",
  num_frames: 720,
  resolution: "720p",
  aspect_ratio: "16:9",
  enable_detail_pass: true
}, "https://your-webhook-url.com/callback");

// Check status
const status = await executor.checkQueueStatus(request_id);
console.log('Status:', status.status);

// Get result when complete
const result = await executor.getQueueResult(request_id);
```

## Frame Count Recommendations

### Duration Guidelines
- **60 frames**: 2.5 seconds - Short clips, social media
- **121 frames**: 5 seconds - Standard videos (default)
- **240 frames**: 10 seconds - Medium-length content
- **480 frames**: 20 seconds - Long-form content
- **720 frames**: 30 seconds - Extended content

### Use Case Recommendations
- **Social Media**: 60-121 frames (2.5-5 seconds)
- **Marketing**: 121-240 frames (5-10 seconds)
- **Educational**: 240-480 frames (10-20 seconds)
- **Cinematic**: 480+ frames (20+ seconds)

## Resolution and Aspect Ratio Options

### Available Resolutions
1. **`480p`** - Standard definition (cost-effective)
   - Best for: Social media, rapid prototyping
   - Use case: Cost-conscious projects, testing

2. **`720p`** - High definition (default)
   - Best for: Most production content
   - Use case: Professional videos, final versions

### Available Aspect Ratios
1. **`16:9`** - Widescreen landscape format (default)
   - Best for: YouTube, TV, desktop viewing
   - Use case: Traditional video content, presentations

2. **`9:16`** - Portrait format for mobile devices
   - Best for: TikTok, Instagram Stories, mobile viewing
   - Use case: Social media content, mobile-first experiences

3. **`1:1`** - Square format for social media
   - Best for: Instagram posts, Facebook, LinkedIn
   - Use case: Social media marketing, profile content

## Advanced Features

### Two-Pass Generation
The model uses a sophisticated two-pass approach:
1. **First Pass**: Establishes video structure and basic motion
2. **Second Pass**: Enhances details and refines quality

### Detail Pass Enhancement
- **Enabled**: Doubles cost but significantly improves quality
- **Use cases**: Final production content, professional videos
- **When to enable**: Final versions, quality-focused projects

### Inference Step Control
- **4-8 steps**: Fast generation, lower quality
- **8-12 steps**: Balanced quality and speed (recommended)
- **12-16 steps**: High quality, slower generation

### Temporal AdaIN (Adaptive Instance Normalization)
Controls color consistency across video frames:
- **0.0**: No color normalization (maximum variation)
- **0.5**: Balanced consistency (default)
- **1.0**: Maximum color consistency

### Tone Mapping
Controls dynamic range compression:
- **0.0**: No compression (preserve full range)
- **0.5**: Moderate compression (balanced)
- **1.0**: Maximum compression (broad compatibility)

## LoRA Integration

### What are LoRA Weights?
LoRA (Low-Rank Adaptation) weights allow you to apply specific styles, characters, or effects to your generated videos.

### LoRA Usage Examples
```typescript
const loraWeights = [
  // Style transfer
  {
    path: "https://huggingface.co/username/anime-style",
    scale: 0.8
  },
  // Character consistency
  {
    path: "https://huggingface.co/username/character-model",
    scale: 1.0
  }
];
```

### LoRA Best Practices
1. **Scale Values**: 0.5-1.0 for most applications
2. **Multiple LoRAs**: Can combine multiple weights
3. **Public Access**: LoRA files must be publicly accessible
4. **Quality**: Use high-quality, well-trained LoRA weights

## Prompt Writing Tips

### Character Limits
- **Maximum**: 2000 characters
- **Optimal**: 500-1500 characters for best results

### Content Guidelines
1. **Be Specific**: Describe exactly what should happen in the video
2. **Camera Movements**: Mention camera angles and movements
3. **Lighting**: Describe lighting conditions and atmosphere
4. **Visual Style**: Specify artistic direction and style
5. **Subjects**: Detail characters, objects, and actions
6. **Cinematic Language**: Use film terminology for better results

### Example Prompts

#### Good Examples
- "A cinematic fast-tracking shot follows a vintage, teal camper van as it descends a winding mountain trail"
- "A person walking through a sunlit forest, dappled light filtering through trees, peaceful atmosphere"
- "A colorful abstract animation with flowing shapes, vibrant colors, smooth motion, artistic style"

#### Avoid
- Vague descriptions like "something cool happening"
- Overly complex scenes with too many elements
- Contradictory instructions
- Technical jargon that may confuse the AI

## Use Cases

### Content Creation
- **Long-form Videos**: Extended content for platforms like YouTube
- **Cinematic Content**: Professional-quality video production
- **Storytelling**: Narrative videos with extended duration
- **Educational Content**: Instructional videos requiring length

### Marketing and Business
- **Product Demonstrations**: Extended product showcases
- **Company Presentations**: Professional business content
- **Social Media Campaigns**: Long-form content for various platforms
- **Brand Videos**: Extended brand storytelling

### Creative Projects
- **Artistic Videos**: Creative content with custom styles
- **Music Videos**: Extended visual accompaniments
- **Short Films**: Narrative content with proper duration
- **Experimental Content**: Creative exploration with LoRA weights

## Technical Considerations

### Input Requirements
- **Prompt Length**: Maximum 2000 characters
- **LoRA Files**: Must be publicly accessible URLs
- **Frame Counts**: 60+ frames recommended for smooth motion
- **Inference Steps**: 4-16 steps for quality control

### Output Specifications
- **Duration**: Variable based on frame count and frame rate
- **Format**: MP4 video files
- **Quality**: Depends on resolution and inference steps
- **File Size**: Varies by content complexity and duration

### Performance Optimization
- **Queue System**: Use for long videos or multiple requests
- **Webhook Integration**: Set up webhooks for automatic result retrieval
- **Progress Monitoring**: Track generation progress with real-time updates
- **Error Handling**: Implement proper error handling for failed requests

## Error Handling

### Common Issues
- **Prompt Too Long**: Keep prompts under 2000 characters
- **Invalid LoRA URLs**: Ensure LoRA files are publicly accessible
- **Authentication Errors**: Verify FAL_KEY environment variable
- **Queue Timeouts**: Long videos may require queue processing

### Troubleshooting
1. **Check Input Validation**: Review error messages for specific issues
2. **Verify LoRA Access**: Ensure LoRA weights are publicly accessible
3. **Monitor Queue Status**: Check status for long-running requests
4. **Review Logs**: Examine detailed logs for error information
5. **Validate API Key**: Confirm proper API key configuration

## Integration Examples

### React Component

```typescript
import React, { useState } from 'react';
import { Ltxv13b098DistilledExecutor } from './executors/ltxv-13b-098-distilled';

const VideoGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async (formData: any) => {
    setIsGenerating(true);
    try {
      const executor = new Ltxv13b098DistilledExecutor();
      const videoResult = await executor.generateVideo(formData);
      setResult(videoResult);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      {/* Form components */}
      <button 
        onClick={() => handleGenerate(formData)} 
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Generate Video'}
      </button>
      
      {result && (
        <video controls src={result.video.url}>
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};
```

### Node.js API Endpoint

```typescript
import express from 'express';
import { Ltxv13b098DistilledExecutor } from './executors/ltxv-13b-098-distilled';

const app = express();
app.use(express.json());

app.post('/api/generate-video', async (req, res) => {
  try {
    const executor = new Ltxv13b098DistilledExecutor();
    const result = await executor.generateVideo(req.body);
    
    res.json({
      success: true,
      data: result
    });
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

### Pricing Benefits
- **Predictable Costs**: $0.02 per second regardless of complexity
- **No Hidden Fees**: Same price for 480p and 720p
- **Budget Friendly**: Affordable for extended content creation
- **Scalable**: Easy to estimate costs for different durations

### Usage Strategies
1. **Batch Processing**: Generate multiple videos efficiently
2. **Detail Pass Control**: Use detail pass only for final versions
3. **Frame Count Optimization**: Choose appropriate frame counts for your needs
4. **Queue Management**: Use queue system for multiple requests
5. **Resolution Selection**: Use 480p for testing, 720p for production

## Conclusion

The LTX Video 13B 0.98 Distilled model provides an excellent solution for creating long-form video content from text prompts. With its cost-effective pricing, advanced features like custom LoRA support and two-pass generation, and flexible output options, it's ideal for content creators, marketers, and businesses looking to generate extended video content.

By following the best practices outlined in this guide and leveraging the comprehensive features of the model, you can create engaging, high-quality videos that effectively communicate your message and engage your audience across various platforms and use cases.
