# Fal AI Bytedance Seedance 1.0 Lite Reference-to-Video Usage Guide

## Overview

The **Fal AI Bytedance Seedance 1.0 Lite Reference-to-Video** model (`fal-ai/bytedance/seedance/v1/lite/reference-to-video`) is an advanced AI model specialized in generating high-quality videos from reference images using Bytedance's Seedance 1.0 Lite architecture. This model allows you to provide 1 to 4 images as reference to create engaging video content based on text prompts, with flexible resolution and duration options.

The model offers cost-effective pricing: $0.18 for 720p 5-second videos, and for other resolutions, cost is calculated based on video tokens at $1.8 per 1 million tokens using the formula: `(height × width × FPS × duration) / 1024`.

## Key Features

- **Reference Image Support**: Use 1-4 images as reference for video generation
- **Flexible Resolution Options**: Support for 360p, 480p, 720p, and 1080p resolutions
- **Duration Control**: Generate videos from 1 to 30 seconds with customizable FPS
- **Token-Based Pricing**: Cost calculation based on video complexity and parameters
- **Queue Management**: Asynchronous processing for long-running requests
- **Real-time Logs**: Progress monitoring during video generation
- **Webhook Support**: Production-ready callback integration
- **Seed Reproducibility**: Consistent results with same inputs

## Input Parameters

### Required Parameters

- **`prompt`** (string, 1-2000 chars): Text description of the video content to generate from the reference images
- **`reference_image_urls`** (string[]): Array of image URLs to use as reference (1-4 images)

### Optional Parameters

- **`resolution`** (enum): Video resolution - `360p`, `480p`, `720p`, `1080p` (default: `720p`)
- **`duration`** (number): Video duration in seconds - 1-30 (default: `5`)
- **`fps`** (number): Frames per second - 1-60 (default: `24`)
- **`seed`** (integer, 0-999999): Random seed for reproducible results

## Pricing Structure

| Resolution | Duration | FPS | Cost Calculation | Example Cost |
|------------|----------|-----|------------------|--------------|
| 720p       | 5s       | 24  | Fixed price      | $0.18        |
| 1080p      | 5s       | 24  | Token-based      | $0.23        |
| 360p       | 10s      | 30  | Token-based      | $0.06        |

**Token Calculation Formula**: `tokens(video) = (height × width × FPS × duration) / 1024`

**Cost Formula**: `(tokens / 1,000,000) × $1.8`

## Usage Examples

### Basic Reference-to-Video Generation

```typescript
import { FalAiBytedanceSeedanceV1LiteReferenceToVideoExecutor } from './executors/fal-ai-bytedance-seedance-v1-lite-reference-to-video';

const executor = new FalAiBytedanceSeedanceV1LiteReferenceToVideoExecutor('YOUR_API_KEY');

const input = {
  prompt: "The girl catches the puppy and hugs it.",
  reference_image_urls: [
    "https://storage.googleapis.com/falserverless/example_inputs/seedance_reference.jpeg",
    "https://storage.googleapis.com/falserverless/example_inputs/seedance_reference_2.jpeg"
  ],
  resolution: "720p",
  duration: 5,
  fps: 24
};

try {
  const result = await executor.generateVideo(input);
  console.log('Generated video URL:', result.video.url);
  console.log('Seed used:', result.seed);
} catch (error) {
  console.error('Error generating video:', error);
}
```

### Queue-Based Processing for Long Videos

```typescript
// Submit request to queue
const { request_id } = await executor.submitReferenceToVideoRequest(input, 'https://your-webhook.com/callback');

console.log('Request submitted with ID:', request_id);

// Check status
const status = await executor.checkRequestStatus(request_id);
console.log('Request status:', status.status);

// Get result when complete
if (status.status === 'COMPLETED') {
  const result = await executor.getRequestResult(request_id);
  console.log('Video generated:', result.video.url);
}
```

### Cost Calculation Examples

```typescript
// Calculate cost for different configurations
const cost1 = executor.calculateCost('720p', 5, 24);  // $0.18 (fixed price)
const cost2 = executor.calculateCost('1080p', 5, 24); // $0.23 (token-based)
const cost3 = executor.calculateCost('360p', 10, 30); // $0.06 (token-based)

console.log('Costs:', { cost1, cost2, cost3 });
```

### Multiple Reference Images

```typescript
const inputWithMultipleImages = {
  prompt: "A product demonstration showing the evolution of design",
  reference_image_urls: [
    "https://example.com/product_v1.jpg",
    "https://example.com/product_v2.jpg", 
    "https://example.com/product_v3.jpg",
    "https://example.com/product_v4.jpg"
  ],
  resolution: "1080p",
  duration: 15,
  fps: 30
};

const result = await executor.generateVideo(inputWithMultipleImages);
```

## Best Practices

### Reference Image Selection
- **Quality**: Use high-resolution, clear images for better video quality
- **Consistency**: Choose images with similar styles and lighting for coherence
- **Relevance**: Ensure reference images align with your text prompt
- **Quantity**: 2-3 reference images often provide optimal results

### Prompt Engineering
- **Clarity**: Write descriptive, specific prompts that complement the reference images
- **Action**: Include action words and movement descriptions
- **Context**: Provide enough context for the model to understand the desired outcome
- **Length**: Stay within the 2000 character limit while being comprehensive

### Parameter Optimization
- **Resolution**: Choose based on your use case and budget constraints
- **Duration**: Consider your content needs and processing time
- **FPS**: Higher FPS for smooth motion, lower for cost efficiency
- **Seed**: Use consistent seeds for reproducible results in development

### Cost Management
- **Token Calculation**: Understand how resolution, duration, and FPS affect cost
- **Batch Processing**: Use queue-based processing for multiple videos
- **Resolution Scaling**: Start with lower resolutions for testing
- **Duration Planning**: Plan video length based on your budget

## Common Use Cases

### Product Marketing
- **Product Demonstrations**: Create videos from product photos
- **Before/After Comparisons**: Show product evolution or improvements
- **Feature Highlights**: Demonstrate specific product capabilities
- **Brand Storytelling**: Create brand narrative videos from assets

### Educational Content
- **Tutorial Videos**: Generate step-by-step instruction videos
- **Concept Explanations**: Visualize complex concepts from diagrams
- **Process Demonstrations**: Show workflows and procedures
- **Learning Materials**: Create engaging educational content

### Creative Projects
- **Storyboard Videos**: Bring concept art to life
- **Artistic Creations**: Generate videos from artwork and illustrations
- **Character Development**: Create character videos from concept images
- **Style Transfer**: Apply artistic styles to reference images

### Business Applications
- **Training Videos**: Create instructional content for employees
- **Sales Presentations**: Generate product showcase videos
- **Internal Communications**: Visualize company updates and news
- **Customer Support**: Create helpful explanation videos

## Technical Considerations

### Performance Optimization
- **Queue Management**: Use async processing for production applications
- **Webhook Integration**: Implement callbacks for automated workflows
- **Error Handling**: Implement robust error handling and retry logic
- **Logging**: Monitor logs for debugging and performance tracking

### Integration Patterns
- **Server-Side Processing**: Keep API keys secure on the server
- **Batch Processing**: Queue multiple requests for efficiency
- **Progress Tracking**: Monitor request status for user feedback
- **Result Storage**: Implement proper storage for generated videos

### Error Handling
```typescript
try {
  const result = await executor.generateVideo(input);
  // Handle success
} catch (error) {
  if (error.code === 'EXECUTION_ERROR') {
    console.error('Execution failed:', error.message);
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

## Advanced Features

### Custom Duration and FPS
```typescript
const customInput = {
  prompt: "A slow-motion nature scene",
  reference_image_urls: ["https://example.com/nature.jpg"],
  resolution: "1080p",
  duration: 20,  // 20 seconds
  fps: 60        // 60 FPS for smooth slow-motion
};
```

### Seed Reproducibility
```typescript
const seed = 42;
const input1 = { ...baseInput, seed };
const input2 = { ...baseInput, seed };

// Both will generate identical videos
const result1 = await executor.generateVideo(input1);
const result2 = await executor.generateVideo(input2);
```

### Multiple Resolution Testing
```typescript
const resolutions = ['360p', '480p', '720p', '1080p'];
const results = [];

for (const resolution of resolutions) {
  const input = { ...baseInput, resolution };
  const result = await executor.generateVideo(input);
  results.push({ resolution, url: result.video.url, cost: executor.calculateCost(resolution) });
}
```

## Performance Optimization

### Queue Management
- Submit multiple requests to the queue for parallel processing
- Use webhooks to avoid polling for status updates
- Implement retry logic for failed requests
- Monitor queue performance and adjust batch sizes

### Cost Optimization
- Start with lower resolutions for testing and iteration
- Use optimal FPS for your content (24-30 FPS is often sufficient)
- Plan video duration based on your budget and needs
- Consider token-based pricing for longer videos

### Quality vs. Speed
- Higher resolutions provide better quality but cost more
- Longer durations increase processing time and cost
- Balance quality requirements with budget constraints
- Use queue processing for non-time-critical applications

## Troubleshooting

### Common Issues

**Invalid Reference Images**
- Ensure all image URLs are accessible and valid
- Check that images are in supported formats (PNG, JPG, etc.)
- Verify image URLs are publicly accessible

**Prompt Length Issues**
- Keep prompts under 2000 characters
- Use concise but descriptive language
- Break complex prompts into simpler components

**Cost Calculation Errors**
- Verify resolution, duration, and FPS parameters
- Check that parameters are within supported ranges
- Use the built-in `calculateCost` method for accurate estimates

**Processing Failures**
- Check API key validity and permissions
- Verify input parameter validation
- Monitor logs for specific error messages
- Implement retry logic for transient failures

### Debugging Tips
- Enable real-time logs during processing
- Use the `validateInput` method to check parameters
- Monitor request status for progress updates
- Check webhook delivery for callback issues

## Integration Examples

### Next.js API Route
```typescript
// pages/api/generate-video.ts
import { FalAiBytedanceSeedanceV1LiteReferenceToVideoExecutor } from '../../../executors/fal-ai-bytedance-seedance-v1-lite-reference-to-video';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const executor = new FalAiBytedanceSeedanceV1LiteReferenceToVideoExecutor(process.env.FAL_KEY);
    
    if (req.body.useQueue) {
      const { request_id } = await executor.submitReferenceToVideoRequest(req.body);
      res.json({ request_id, status: 'queued' });
    } else {
      const result = await executor.generateVideo(req.body);
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### React Component
```typescript
import React, { useState } from 'react';
import { FalAiBytedanceSeedanceV1LiteReferenceToVideoExecutor } from './executors/fal-ai-bytedance-seedance-v1-lite-reference-to-video';

const VideoGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrls, setImageUrls] = useState(['']);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const executor = new FalAiBytedanceSeedanceV1LiteReferenceToVideoExecutor(process.env.REACT_APP_FAL_KEY);
      const input = {
        prompt,
        reference_image_urls: imageUrls.filter(url => url.trim()),
        resolution: '720p',
        duration: 5,
        fps: 24
      };

      const videoResult = await executor.generateVideo(input);
      setResult(videoResult);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your video..."
        maxLength={2000}
      />
      
      {imageUrls.map((url, index) => (
        <input
          key={index}
          type="url"
          value={url}
          onChange={(e) => {
            const newUrls = [...imageUrls];
            newUrls[index] = e.target.value;
            setImageUrls(newUrls);
          }}
          placeholder={`Reference image ${index + 1} URL`}
        />
      ))}
      
      <button type="button" onClick={() => setImageUrls([...imageUrls, ''])}>
        Add Another Image
      </button>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Generating...' : 'Generate Video'}
      </button>
      
      {result && (
        <div>
          <h3>Generated Video:</h3>
          <video controls src={result.video.url} />
          <p>Seed: {result.seed}</p>
        </div>
      )}
    </form>
  );
};

export default VideoGenerator;
```

## Conclusion

The Fal AI Bytedance Seedance 1.0 Lite Reference-to-Video model provides a powerful and flexible solution for generating high-quality videos from reference images. With its support for multiple reference images, flexible resolution options, and token-based pricing, it's well-suited for a wide range of applications from product marketing to creative projects.

By following the best practices outlined in this guide and leveraging the advanced features like queue management and webhook integration, you can create efficient, cost-effective video generation workflows that scale with your needs.

Remember to always validate your inputs, implement proper error handling, and monitor your usage to optimize costs and performance.
