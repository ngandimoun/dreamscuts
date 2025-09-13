# PixVerse Extend Usage Guide

## Overview

The **PixVerse Extend** model is a powerful video extension tool that generates new content based on the ending of existing videos. Using high-quality video extending techniques, this model can seamlessly continue video sequences with various artistic styles, making it ideal for content creators, marketers, and video editors who want to extend their video content.

## Key Features

- **Video Extension**: Generate new content that continues from existing video endings
- **Multiple Styles**: Choose from anime, 3D animation, day, cyberpunk, and comic styles
- **Resolution Control**: Support for 360p, 540p, 720p, and 1080p output
- **Duration Options**: 5-second (cost-effective) or 8-second (double cost) extensions
- **Model Versions**: Multiple model versions from v3.5 to v5 for different quality levels
- **Cost-Effective Pricing**: Starting at $0.15 for 5-second videos at 360p/540p
- **Queue Support**: Asynchronous processing for longer videos
- **Real-time Progress Monitoring**: Track generation progress with detailed logs

## Input Parameters

### Required Parameters

- **`video_url`** (string): URL of the input video to extend
- **`prompt`** (string): Description of how to extend the video

### Optional Parameters

- **`negative_prompt`** (string): Text describing what to avoid in generation (default: "")
- **`style`** (enum): Artistic style - "anime", "3d_animation", "day", "cyberpunk", or "comic" (default: "day")
- **`resolution`** (enum): Output resolution - "360p", "540p", "720p", or "1080p" (default: "720p")
- **`duration`** (enum): Extension duration - "5" or "8" seconds (default: "5")
- **`model`** (enum): Model version - "v3.5", "v4", "v4.5", or "v5" (default: "v4.5")
- **`seed`** (integer): Random seed for reproducible results

## Pricing Structure

### Base Cost
- **$0.15** for 5-second videos at 360p or 540p resolution

### Resolution Multipliers
- **360p/540p**: 1.0x (base cost)
- **720p**: 1.33x ($0.20 for 5s)
- **1080p**: 2.67x ($0.40 for 5s)

### Duration Multipliers
- **5 seconds**: 1.0x (base cost)
- **8 seconds**: 2.0x (double cost)

### Cost Examples
- 360p, 5s: $0.15
- 540p, 5s: $0.15
- 720p, 5s: $0.20
- 1080p, 5s: $0.40
- 360p, 8s: $0.30
- 540p, 8s: $0.30
- 720p, 8s: $0.40
- 1080p, 8s: $0.80

## Usage Examples

### Basic Video Extension

```typescript
import { PixverseExtendExecutor } from './executors/pixverse-extend';

const executor = new PixverseExtendExecutor();

const result = await executor.extendVideo({
  video_url: "https://example.com/input_video.mp4",
  prompt: "A kid is talking into camera",
  resolution: "720p",
  duration: "5"
});

console.log('Extended video URL:', result.video.url);
```

### Stylized Video Extension

```typescript
const result = await executor.extendVideo({
  video_url: "https://example.com/anime_scene.mp4",
  prompt: "Continue the scene with vibrant anime style",
  style: "anime",
  resolution: "540p",
  duration: "5",
  model: "v4.5"
});
```

### High-Quality Professional Extension

```typescript
const result = await executor.extendVideo({
  video_url: "https://example.com/business_video.mp4",
  prompt: "Continue the business presentation professionally",
  style: "day",
  resolution: "1080p",
  duration: "5",
  model: "v5"
});
```

### Queue-Based Processing (Long Videos)

```typescript
// Submit to queue
const { request_id } = await executor.submitToQueue({
  video_url: "https://example.com/lecture_video.mp4",
  prompt: "Continue the educational lecture with engaging visuals",
  style: "day",
  resolution: "720p",
  duration: "8"
}, "https://your-webhook-url.com/callback");

// Check status
const status = await executor.checkQueueStatus(request_id);
console.log('Status:', status.status);

// Get result when complete
const result = await executor.getQueueResult(request_id);
```

## Style Options

### Available Styles

1. **`anime`** - Japanese anime style with vibrant colors and distinctive art
2. **`3d_animation`** - 3D computer-generated animation style
3. **`day`** - Natural daylight style with realistic lighting (default)
4. **`cyberpunk`** - Futuristic, high-tech aesthetic with neon colors
5. **`comic`** - Comic book or graphic novel style

### Style Selection Tips

- **`day`**: Best for realistic content, business videos, and natural scenes
- **`anime`**: Ideal for creative content, entertainment, and stylized videos
- **`3d_animation`**: Great for technical content, product demos, and modern aesthetics
- **`cyberpunk`**: Perfect for sci-fi content, tech videos, and futuristic themes
- **`comic`**: Excellent for artistic content, storytelling, and creative projects

## Model Versions

### Available Models

1. **`v3.5`** - Version 3.5 - Balanced performance and quality
2. **`v4`** - Version 4 - Enhanced quality and features
3. **`v4.5`** - Version 4.5 - Latest stable release (recommended default)
4. **`v5`** - Version 5 - Latest experimental features

### Model Selection Guide

- **`v4.5`**: Best balance of quality and stability for most use cases
- **`v5`**: Latest features but may have experimental behavior
- **`v4`**: Good quality with proven stability
- **`v3.5`**: Cost-effective option for basic extensions

## Resolution Guidelines

### Resolution Options

- **360p**: Social media, testing, cost-effective ($0.15)
- **540p**: Web content, moderate quality ($0.15)
- **720p**: Standard quality, most use cases ($0.20)
- **1080p**: High quality, professional content ($0.40)

### Resolution Recommendations

- **Testing & Social Media**: Use 360p or 540p for cost-effective testing
- **Web Content**: 540p or 720p for good quality at reasonable cost
- **Professional Use**: 720p for most professional applications
- **High-End Content**: 1080p for premium content (limited to 5s)

## Best Practices

### Prompt Writing

- **Be Specific**: Describe exactly what should happen in the extension
- **Provide Context**: Mention the scene, mood, and desired outcome
- **Use Clear Language**: Avoid ambiguous terms that could lead to unexpected results
- **Include Style Hints**: Mention visual elements, camera movements, or atmosphere

### Video Selection

- **Quality Input**: Higher quality input videos produce better extensions
- **Clear Endings**: Videos with clear, well-defined endings work best
- **Consistent Style**: Choose input videos that match your desired output style
- **Appropriate Length**: Consider how the extension will fit with your original content

### Cost Optimization

- **Start Small**: Test with 360p or 540p before using higher resolutions
- **Use 5s Duration**: 5-second extensions are more cost-effective than 8-second
- **Choose Wisely**: Select resolution based on intended use, not maximum quality
- **Batch Processing**: Use queue system for multiple extensions to manage costs

## Use Cases

### Content Creation

- **Social Media**: Extend short videos for platforms like TikTok, Instagram, and YouTube
- **Marketing**: Continue promotional videos with engaging content
- **Storytelling**: Extend narrative videos to continue stories
- **Educational**: Continue lecture videos with additional explanations

### Video Editing

- **Professional Projects**: Extend corporate videos and presentations
- **Entertainment**: Continue entertainment content with seamless transitions
- **Training Materials**: Extend instructional videos with additional content
- **Event Coverage**: Continue event recordings with extended footage

### Creative Projects

- **Artistic Videos**: Extend artistic content with style variations
- **Music Videos**: Continue music videos with visual extensions
- **Short Films**: Extend short films with additional scenes
- **Experimental Content**: Create unique video experiences

## Technical Considerations

### Input Video Requirements

- **Format Support**: MP4, MOV, AVI, WebM
- **Quality**: Higher quality inputs produce better results
- **Length**: Works best with videos that have clear endings
- **Content**: Avoid videos with rapid scene changes or complex backgrounds

### Output Considerations

- **1080p Limitation**: 1080p videos are limited to 5 seconds duration
- **Style Consistency**: Output may not perfectly match original video style
- **Generation Time**: Processing time varies by complexity and resolution
- **File Size**: Higher resolutions produce larger output files

### Performance Optimization

- **Queue System**: Use for longer videos or multiple requests
- **Webhook Integration**: Set up webhooks for automatic result retrieval
- **Progress Monitoring**: Track generation progress with real-time updates
- **Error Handling**: Implement proper error handling for failed requests

## Error Handling

### Common Issues

- **Invalid Video URL**: Ensure video is publicly accessible
- **Unsupported Format**: Use supported video formats (MP4, MOV, AVI, WebM)
- **Resolution Limitations**: 1080p videos are limited to 5 seconds
- **Authentication Errors**: Verify FAL_KEY environment variable

### Troubleshooting

- Check input validation messages
- Verify video accessibility and format compatibility
- Monitor queue status for long-running requests
- Review logs for detailed error information
- Ensure proper API key configuration

## Integration Examples

### React Component

```typescript
import React, { useState } from 'react';
import { PixverseExtendExecutor } from './executors/pixverse-extend';

const VideoExtender: React.FC = () => {
  const [isExtending, setIsExtending] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleExtend = async (formData: any) => {
    setIsExtending(true);
    try {
      const executor = new PixverseExtendExecutor();
      const videoResult = await executor.extendVideo(formData);
      setResult(videoResult);
    } catch (error) {
      console.error('Extension failed:', error);
    } finally {
      setIsExtending(false);
    }
  };

  return (
    <div>
      {/* Form components */}
      <button 
        onClick={() => handleExtend(formData)} 
        disabled={isExtending}
      >
        {isExtending ? 'Extending...' : 'Extend Video'}
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
import { PixverseExtendExecutor } from './executors/pixverse-extend';

const app = express();
app.use(express.json());

app.post('/api/extend-video', async (req, res) => {
  try {
    const executor = new PixverseExtendExecutor();
    const result = await executor.extendVideo(req.body);
    
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

## Conclusion

The PixVerse Extend model provides a powerful solution for extending video content with high-quality AI-generated sequences. With its flexible style options, resolution control, and cost-effective pricing, it's ideal for content creators, marketers, and video editors looking to expand their video content seamlessly.

By following the best practices outlined in this guide and leveraging the comprehensive features of the model, you can create engaging video extensions that maintain visual continuity while adding new content that enhances your creative projects.
