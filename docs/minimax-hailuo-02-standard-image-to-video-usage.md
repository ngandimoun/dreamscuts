# MiniMax Hailuo-02 Standard Image-to-Video Usage Guide

## Overview

The **MiniMax Hailuo-02 Standard Image-to-Video** model is a powerful AI tool that transforms static images into dynamic video content. This model leverages advanced deep learning techniques to generate natural motion and animations based on text prompts while preserving the visual quality and details of the original image.

## Key Features

- **Image-to-Video Transformation**: Convert still images into fluid video content
- **Natural Motion Synthesis**: Generate realistic animations with physics understanding
- **High-Quality Output**: Support for 512P and 768P resolutions
- **Duration Control**: Generate 6 or 10-second videos
- **Prompt Optimization**: Built-in prompt optimizer for better results
- **Commercial Use**: Permitted for commercial applications
- **Easy Integration**: Simple API through fal.ai

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- fal.ai API key

### Setup Steps

1. **Install the FAL AI client:**
   ```bash
   npm install --save @fal-ai/client
   ```

2. **Set your API key:**
   ```bash
   export FAL_KEY="YOUR_API_KEY"
   ```

3. **Import and configure:**
   ```typescript
   import { fal } from "@fal-ai/client";
   fal.config({ credentials: "YOUR_FAL_KEY" });
   ```

## Basic Usage

### Simple Video Generation

```typescript
import { fal } from "@fal-ai/client";

// Configure the client
fal.config({ credentials: "YOUR_FAL_KEY" });

// Generate video with default settings
const result = await fal.subscribe("fal-ai/minimax/hailuo-02/standard/image-to-video", {
  input: {
    prompt: "A lego chef cooking eggs",
    image_url: "https://example.com/image.jpg"
  }
});

console.log("Video URL:", result.video.url);
```

### Custom Parameters

```typescript
const result = await fal.subscribe("fal-ai/minimax/hailuo-02/standard/image-to-video", {
  input: {
    prompt: "Camera slowly zooms in on the subject",
    image_url: "https://example.com/image.jpg",
    duration: "10",
    resolution: "512P",
    prompt_optimizer: true
  }
});
```

## Advanced Usage

### Using the Executor Class

```typescript
import { createMinimaxHailuo02StandardImageToVideoExecutor } from "./executors/minimax-hailuo-02-standard-image-to-video";

const executor = createMinimaxHailuo02StandardImageToVideoExecutor("YOUR_FAL_KEY");

// Generate video
const result = await executor.generateVideo({
  prompt: "Gentle swaying motion with natural movement",
  image_url: "https://example.com/image.jpg",
  duration: "10",
  resolution: "768P"
});

console.log("Generated video:", result.video);
```

### Queue-Based Processing

For long-running requests, use the queue system:

```typescript
// Submit to queue
const { requestId } = await executor.queueVideoGeneration({
  prompt: "Panning across the landscape",
  image_url: "https://example.com/image.jpg",
  duration: "10"
});

// Check status
const status = await executor.checkQueueStatus(requestId);
console.log("Status:", status);

// Get result when complete
const result = await executor.getQueueResult(requestId);
console.log("Video:", result.video);
```

### Batch Processing

Generate multiple videos in parallel:

```typescript
const inputs = [
  {
    prompt: "Zoom in on the subject",
    image_url: "https://example.com/image1.jpg"
  },
  {
    prompt: "Pan across the scene",
    image_url: "https://example.com/image2.jpg"
  }
];

const results = await executor.generateMultipleVideos(inputs);
results.forEach((result, index) => {
  if ('error' in result) {
    console.error(`Video ${index} failed:`, result.message);
  } else {
    console.log(`Video ${index}:`, result.video.url);
  }
});
```

## Input Parameters

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `prompt` | string | Text description of desired animation | "Camera slowly zooms in on the subject" |
| `image_url` | string | URL of the input image to animate | "https://example.com/image.jpg" |

### Optional Parameters

| Parameter | Type | Default | Description | Values |
|-----------|------|---------|-------------|---------|
| `duration` | string | "6" | Video duration in seconds | "6", "10" |
| `resolution` | string | "768P" | Output video resolution | "512P", "768P" |
| `prompt_optimizer` | boolean | true | Enable prompt optimization | true, false |

## Output Format

The model returns a video object with the following structure:

```typescript
{
  video: {
    url: string;           // Direct download URL
    content_type?: string; // MIME type (video/mp4)
    file_name?: string;    // Suggested filename
    file_size?: number;    // File size in bytes
  };
  requestId?: string;      // For queue-based requests
}
```

## Best Practices

### Image Preparation
- Use high-quality images with good lighting
- Ensure clear subjects and good contrast
- Avoid overly complex or cluttered images
- Use images with sufficient resolution

### Prompt Engineering
- Be specific about desired motion and camera movement
- Include style and mood descriptions
- Use clear, descriptive language
- Avoid ambiguous or contradictory instructions

### Parameter Optimization
- Start with 6-second duration for testing
- Use 768P resolution for optimal quality
- Enable prompt optimizer for better results
- Experiment with different prompt variations

### Error Handling
- Implement proper error handling for API calls
- Check image URL accessibility
- Handle queue timeouts gracefully
- Validate input parameters before submission

## Common Use Cases

### Content Creation
- **Social Media**: Create engaging posts from static images
- **Marketing**: Transform product photos into dynamic ads
- **Education**: Animate diagrams and illustrations
- **Entertainment**: Bring artwork and photos to life

### Business Applications
- **E-commerce**: Create product demonstration videos
- **Real Estate**: Animate property photos
- **Restaurants**: Showcase food and ambiance
- **Events**: Promote venues and experiences

### Creative Projects
- **Art**: Animate paintings and illustrations
- **Photography**: Add motion to still shots
- **Design**: Create dynamic presentations
- **Storytelling**: Enhance narrative content

## Performance Considerations

### Quality vs. Speed
- 512P resolution: Faster generation, smaller file size
- 768P resolution: Higher quality, longer processing time
- 6-second duration: Quicker results, lower cost
- 10-second duration: More content, higher cost

### Cost Optimization
- Base cost: $2.50 for 6-second video
- Additional cost: $0.50 per additional second
- 10-second video: $4.50 total
- Use queue system for batch processing

### Processing Times
- 6-second videos: Typically 2-5 minutes
- 10-second videos: Typically 3-8 minutes
- Resolution impact: 768P takes longer than 512P
- Queue system recommended for long requests

## Troubleshooting

### Common Issues

**Poor Video Quality**
- Ensure input image meets quality requirements
- Check that image has good lighting and contrast
- Verify image format compatibility

**Motion Not as Expected**
- Write more descriptive prompts
- Include specific motion instructions
- Enable prompt optimizer
- Test with different prompt variations

**Processing Errors**
- Verify image URL accessibility
- Check API key validity
- Ensure image format is supported
- Validate input parameters

**Long Processing Times**
- Use queue system for better management
- Check fal.ai service status
- Consider using lower resolution
- Verify image size and complexity

### Optimization Tips

**Image Preparation**
- Use well-lit, high-quality images
- Ensure clear subjects and good contrast
- Avoid overly complex backgrounds
- Test with different image types

**Prompt Engineering**
- Be specific about desired animation
- Include camera movement details
- Describe style and mood
- Use clear, descriptive language

**Parameter Tuning**
- Start with default settings
- Experiment with different durations
- Test various resolutions
- Enable prompt optimizer

## Integration Examples

### React Component

```typescript
import React, { useState } from 'react';
import { createMinimaxHailuo02StandardImageToVideoExecutor } from './executors/minimax-hailuo-02-standard-image-to-video';

const VideoGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateVideo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const executor = createMinimaxHailuo02StandardImageToVideoExecutor("YOUR_FAL_KEY");
      const result = await executor.generateVideo({
        prompt: "Camera slowly zooms in on the subject",
        image_url: "https://example.com/image.jpg"
      });
      
      setVideoUrl(result.video.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={generateVideo} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Video'}
      </button>
      
      {error && <div className="error">{error}</div>}
      
      {videoUrl && (
        <video controls>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default VideoGenerator;
```

### Node.js Server

```typescript
import express from 'express';
import { createMinimaxHailuo02StandardImageToVideoExecutor } from './executors/minimax-hailuo-02-standard-image-to-video';

const app = express();
app.use(express.json());

app.post('/generate-video', async (req, res) => {
  try {
    const { prompt, image_url, duration, resolution } = req.body;
    
    const executor = createMinimaxHailuo02StandardImageToVideoExecutor(process.env.FAL_KEY!);
    
    const result = await executor.generateVideo({
      prompt,
      image_url,
      duration,
      resolution
    });
    
    res.json({
      success: true,
      video: result.video
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Support and Resources

### Documentation
- [fal.ai API Documentation](https://fal.ai/docs)
- [MiniMax Hailuo-02 Model Page](https://fal.ai/models/minimax/hailuo-02/standard/image-to-video)

### Community
- [fal.ai Discord](https://discord.gg/fal-ai)
- [GitHub Issues](https://github.com/fal-ai/fal-ai-js/issues)

### Pricing
- Base cost: $2.50 for 6-second video
- Additional seconds: $0.50 each
- 10-second video: $4.50 total
- No monthly fees or subscriptions

## Conclusion

The MiniMax Hailuo-02 Standard Image-to-Video model provides a powerful and cost-effective solution for transforming static images into dynamic video content. With its advanced motion synthesis capabilities, flexible parameters, and easy integration, it's an excellent choice for content creators, developers, and businesses looking to add motion to their visual content.

By following the best practices outlined in this guide and leveraging the provided executor class, you can quickly integrate this model into your applications and start creating engaging video content from your existing images.
