# Vidu Q1 Reference to Video Usage Guide

## Overview

The **Vidu Q1 Reference to Video** model is a powerful tool for generating video clips from multiple image references using Vidu's Q1 technology. This model creates videos with consistent subject appearance by leveraging up to 7 reference images, making it ideal for character-driven content, product demonstrations, and storytelling projects.

## Key Features

- **Reference Image to Video**: Generate videos from 1-7 reference images
- **Consistent Subject Generation**: Maintain visual consistency across video frames
- **Multiple Aspect Ratios**: Support for 16:9, 9:16, and 1:1 formats
- **Movement Control**: Configurable movement amplitude (auto, small, medium, large)
- **Background Music Option**: Optional BGM for enhanced video experience
- **Fixed Pricing**: $0.40 per 5-second video regardless of complexity
- **Queue Support**: Asynchronous processing for longer generations
- **Real-time Progress Monitoring**: Track generation progress with detailed logs

## Input Parameters

### Required Parameters

- **`prompt`** (string): Text description for video generation (max 1500 characters)
- **`reference_image_urls`** (array): URLs of reference images (1-7 images)

### Optional Parameters

- **`seed`** (integer): Random seed for reproducible results
- **`aspect_ratio`** (enum): Output format - "16:9", "9:16", or "1:1" (default: "16:9")
- **`movement_amplitude`** (enum): Movement intensity - "auto", "small", "medium", or "large" (default: "auto")
- **`bgm`** (boolean): Whether to add background music (default: false)

## Pricing Structure

### Fixed Cost
- **$0.40** per 5-second video regardless of complexity or reference image count

### Cost Examples
- Single reference image: $0.40
- Multiple reference images (up to 7): $0.40
- Any aspect ratio: $0.40
- Any movement amplitude: $0.40

## Usage Examples

### Basic Video Generation

```typescript
import { ViduQ1ReferenceToVideoExecutor } from './executors/vidu-q1-reference-to-video';

const executor = new ViduQ1ReferenceToVideoExecutor();

const result = await executor.generateVideo({
  prompt: "A young woman walking in a park",
  reference_image_urls: ["https://example.com/woman.jpg"],
  aspect_ratio: "16:9",
  movement_amplitude: "auto"
});

console.log('Generated video URL:', result.video.url);
```

### Multi-Subject Video Generation

```typescript
const result = await executor.generateVideo({
  prompt: "A young woman and a monkey inside a colorful house",
  reference_image_urls: [
    "https://example.com/woman.jpg",
    "https://example.com/monkey.jpg",
    "https://example.com/house.jpg"
  ],
  aspect_ratio: "16:9",
  movement_amplitude: "medium"
});
```

### Portrait Format for Mobile

```typescript
const result = await executor.generateVideo({
  prompt: "A person dancing in a studio",
  reference_image_urls: ["https://example.com/dancer.jpg"],
  aspect_ratio: "9:16",
  movement_amplitude: "large",
  bgm: true
});
```

### Queue-Based Processing (Long Videos)

```typescript
// Submit to queue
const { request_id } = await executor.submitToQueue({
  prompt: "A complex scene with multiple characters in a fantasy world",
  reference_image_urls: [
    "https://example.com/character1.jpg",
    "https://example.com/character2.jpg",
    "https://example.com/character3.jpg",
    "https://example.com/character4.jpg",
    "https://example.com/character5.jpg"
  ],
  aspect_ratio: "16:9",
  movement_amplitude: "auto"
}, "https://your-webhook-url.com/callback");

// Check status
const status = await executor.checkQueueStatus(request_id);
console.log('Status:', status.status);

// Get result when complete
const result = await executor.getQueueResult(request_id);
```

## Aspect Ratio Options

### Available Formats

1. **`16:9`** - Widescreen landscape format (default)
   - Best for: YouTube, TV, desktop viewing
   - Use case: Traditional video content, presentations

2. **`9:16`** - Portrait format for mobile devices
   - Best for: TikTok, Instagram Stories, mobile viewing
   - Use case: Social media content, mobile-first experiences

3. **`1:1`** - Square format for social media
   - Best for: Instagram posts, Facebook, LinkedIn
   - Use case: Social media marketing, profile content

## Movement Amplitude Control

### Available Options

1. **`auto`** - Automatic movement detection (default)
   - Best for: Most use cases, balanced movement
   - AI determines optimal movement based on content

2. **`small`** - Subtle, minimal movement
   - Best for: Professional content, subtle animations
   - Use case: Business videos, product demonstrations

3. **`medium`** - Moderate movement intensity
   - Best for: Engaging content with natural movement
   - Use case: Educational content, storytelling

4. **`large`** - Dynamic, energetic movement
   - Best for: Action scenes, entertainment content
   - Use case: Dance videos, action sequences, dynamic content

## Reference Image Guidelines

### Image Count Recommendations

- **1 image**: Single subject consistency
- **2-3 images**: Dual or multiple subjects
- **4-5 images**: Complex scenes with multiple elements
- **6-7 images**: Maximum detail and consistency

### Image Quality Requirements

- **High Resolution**: Use clear, high-quality images
- **Good Lighting**: Ensure subjects are well-lit and visible
- **Consistent Style**: Choose images with similar visual style
- **Clear Subjects**: Avoid overly complex or cluttered backgrounds
- **Similar Aspect Ratios**: Use images with compatible dimensions when possible

### Best Practices for Reference Images

1. **Subject Clarity**: Ensure main subjects are clearly visible
2. **Lighting Consistency**: Use images with similar lighting conditions
3. **Style Matching**: Choose images with compatible visual styles
4. **Background Simplicity**: Avoid overly complex backgrounds
5. **Angle Variety**: Include images showing different perspectives
6. **Quality Standards**: Use high-resolution, clear images
7. **Count Optimization**: Use appropriate number of images for your use case

## Prompt Writing Tips

### Character Limits
- **Maximum**: 1500 characters
- **Optimal**: 500-1000 characters for best results

### Content Guidelines

1. **Be Specific**: Describe exactly what should happen in the video
2. **Include Context**: Mention the scene, mood, and desired outcome
3. **Reference Integration**: Explain how reference images should be used
4. **Movement Description**: Specify desired movement and animation style
5. **Visual Style**: Mention atmosphere, lighting, and visual elements
6. **Clear Language**: Use descriptive, unambiguous terms

### Example Prompts

#### Good Examples
- "A young woman walking confidently through a sunlit park, wearing a red dress"
- "A monkey playing joyfully with toys inside a colorful, modern house"
- "A professional dancer performing contemporary moves in a well-lit studio"

#### Avoid
- Vague descriptions like "something cool happening"
- Overly complex scenes with too many elements
- Contradictory instructions
- Technical jargon that may confuse the AI

## Use Cases

### Content Creation
- **Character-Driven Videos**: Create consistent character appearances
- **Product Demonstrations**: Show products in action with consistent styling
- **Storytelling**: Develop narrative content with visual continuity
- **Brand Identity**: Maintain consistent brand visuals across videos

### Marketing and Business
- **Product Launches**: Demonstrate products with consistent branding
- **Company Presentations**: Create professional content with consistent visuals
- **Social Media Campaigns**: Generate engaging content for various platforms
- **Educational Content**: Create instructional videos with consistent subjects

### Creative Projects
- **Artistic Videos**: Develop creative content with visual consistency
- **Music Videos**: Create visual accompaniments with consistent themes
- **Short Films**: Develop narrative content with character consistency
- **Experimental Content**: Explore creative possibilities with reference images

## Technical Considerations

### Input Requirements
- **Image Formats**: JPG, PNG, WebP, GIF, AVIF
- **Image Count**: 1-7 reference images
- **Image Quality**: High-resolution, clear images work best
- **Accessibility**: Images must be publicly accessible URLs

### Output Specifications
- **Duration**: Fixed 5 seconds
- **Format**: MP4 video files
- **Quality**: Depends on input image quality and prompt complexity
- **File Size**: Varies by content complexity

### Performance Optimization
- **Queue System**: Use for complex generations or multiple requests
- **Webhook Integration**: Set up webhooks for automatic result retrieval
- **Progress Monitoring**: Track generation progress with real-time updates
- **Error Handling**: Implement proper error handling for failed requests

## Error Handling

### Common Issues

- **Invalid Image URLs**: Ensure images are publicly accessible
- **Too Many Images**: Maximum 7 reference images allowed
- **Prompt Too Long**: Keep prompts under 1500 characters
- **Authentication Errors**: Verify FAL_KEY environment variable
- **Image Format Issues**: Use supported image formats

### Troubleshooting

1. **Check Input Validation**: Review error messages for specific issues
2. **Verify Image Accessibility**: Ensure reference images are publicly accessible
3. **Monitor Queue Status**: Check status for long-running requests
4. **Review Logs**: Examine detailed logs for error information
5. **Validate API Key**: Confirm proper API key configuration

## Integration Examples

### React Component

```typescript
import React, { useState } from 'react';
import { ViduQ1ReferenceToVideoExecutor } from './executors/vidu-q1-reference-to-video';

const VideoGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async (formData: any) => {
    setIsGenerating(true);
    try {
      const executor = new ViduQ1ReferenceToVideoExecutor();
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
import { ViduQ1ReferenceToVideoExecutor } from './executors/vidu-q1-reference-to-video';

const app = express();
app.use(express.json());

app.post('/api/generate-video', async (req, res) => {
  try {
    const executor = new ViduQ1ReferenceToVideoExecutor();
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

### Fixed Pricing Benefits
- **Predictable Costs**: $0.40 per video regardless of complexity
- **No Hidden Fees**: Same price for 1 or 7 reference images
- **Budget Friendly**: Affordable for regular content creation
- **Scalable**: Easy to estimate costs for multiple videos

### Usage Strategies
1. **Batch Processing**: Generate multiple videos efficiently
2. **Reference Optimization**: Use optimal number of reference images
3. **Prompt Efficiency**: Write clear, concise prompts
4. **Queue Management**: Use queue system for multiple requests

## Conclusion

The Vidu Q1 Reference to Video model provides an excellent solution for creating character-consistent videos from reference images. With its fixed pricing, flexible aspect ratios, and movement control options, it's ideal for content creators, marketers, and businesses looking to maintain visual consistency across their video content.

By following the best practices outlined in this guide and leveraging the comprehensive features of the model, you can create engaging, consistent videos that effectively represent your subjects and brand identity.
