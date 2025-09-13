# Fal AI PixVerse V5 Text-to-Video Usage Guide

## Overview

The **Fal AI PixVerse V5 Text-to-Video** model (fal-ai/pixverse/v5/text-to-video) is an advanced AI model specialized in generating high-quality video clips from text prompts using PixVerse v5. This model excels at creating visually stunning videos with multiple style options, flexible aspect ratios, and various resolution choices.

The model offers cost-effective pricing that scales with resolution and duration: $0.15 for 360p/540p, $0.20 for 720p, and $0.40 for 1080p. 8-second videos cost double the base price, and 1080p videos are limited to 5 seconds maximum.

## Key Features

- **High-Quality Generation**: Creates professional-grade videos from text descriptions
- **Multiple Style Options**: Support for anime, 3D animation, clay, comic, and cyberpunk styles
- **Flexible Aspect Ratios**: Choose from 16:9, 4:3, 1:1, 3:4, and 9:16 formats
- **Resolution Control**: Options from 360p to 1080p with cost scaling
- **Duration Options**: 5-second (standard) or 8-second (extended) videos
- **Negative Prompting**: Advanced filtering to avoid unwanted elements
- **Seed Control**: Reproducible results with consistent seed values
- **Queue Processing**: Handle long-running requests asynchronously
- **Cost-Effective Pricing**: Variable pricing based on resolution and duration

## Input Parameters

### Required Parameters

#### `prompt` (string)
- **Description**: Text description of the video you want to generate
- **Constraints**: 1-2000 characters
- **Best Practices**:
  - Be specific about visual elements and style
  - Include details about lighting, atmosphere, and mood
  - Mention specific art styles or visual references
  - Describe camera angles and movements if relevant
  - Keep prompts clear and descriptive
  - Use vivid, descriptive language for better results

### Optional Parameters

#### `aspect_ratio` (AspectRatioEnum)
- **Description**: The aspect ratio of the generated video
- **Default**: '16:9'
- **Available Options**:
  - **16:9**: Widescreen format, ideal for most content and social media
  - **4:3**: Traditional format, good for educational content and presentations
  - **1:1**: Square format, perfect for Instagram, TikTok, and social media
  - **3:4**: Portrait format, good for mobile viewing and stories
  - **9:16**: Vertical format, ideal for mobile-first content, stories, and reels

#### `resolution` (ResolutionEnum)
- **Description**: The resolution of the generated video
- **Default**: '720p'
- **Available Options**:
  - **360p**: $0.15 - Basic quality, ideal for testing and quick previews
  - **540p**: $0.15 - Good quality, suitable for social media and web content
  - **720p**: $0.20 - High quality, perfect for most use cases and professional content
  - **1080p**: $0.40 - Premium quality, limited to 5 seconds maximum

#### `duration` (DurationEnum)
- **Description**: The duration of the generated video in seconds
- **Default**: '5'
- **Available Options**:
  - **5**: Base price - Standard duration, good for most content
  - **8**: Double price - Extended duration, costs twice as much

#### `negative_prompt` (string)
- **Description**: Text describing what you don't want to see in the video
- **Constraints**: Less than 2000 characters
- **Default**: ""
- **Best Practices**:
  - Specify what you don't want to see
  - Include quality issues to avoid (blurry, low quality)
  - Mention unwanted elements or styles
  - Use specific terms for better filtering
  - Keep negative prompts concise but effective

#### `style` (StyleEnum)
- **Description**: The artistic style of the generated video
- **Available Options**:
  - **anime**: Japanese animation style - Best for anime content and cartoons
  - **3d_animation**: 3D computer graphics style - Best for modern content and gaming
  - **clay**: Claymation/stop-motion style - Best for artistic content and children's videos
  - **comic**: Comic book/graphic novel style - Best for storytelling and artistic content
  - **cyberpunk**: Futuristic, high-tech style - Best for sci-fi content and modern aesthetics

#### `seed` (integer)
- **Description**: Random seed for reproducible results
- **Range**: 0-999999
- **Use Case**: Use the same seed to generate identical videos with the same parameters

## Pricing Structure

The model uses a resolution and duration-based pricing model:

### Base Costs by Resolution
- **360p**: $0.15 per video
- **540p**: $0.15 per video
- **720p**: $0.20 per video
- **1080p**: $0.40 per video

### Duration Multipliers
- **5 seconds**: Base price
- **8 seconds**: Double price (2×)

### Cost Examples

| Resolution | Duration | Cost | Description |
|------------|----------|------|-------------|
| 360p | 5s | $0.15 | 5-second video at 360p |
| 540p | 5s | $0.15 | 5-second video at 540p |
| 720p | 5s | $0.20 | 5-second video at 720p |
| 1080p | 5s | $0.40 | 5-second video at 1080p (limited to 5s) |
| 720p | 8s | $0.40 | 8-second video at 720p (double cost) |

## Usage Examples

### Basic Video Generation

```typescript
import { FalAiPixverseV5TextToVideoExecutor } from './executors/fal-ai-pixverse-v5-text-to-video';

const executor = new FalAiPixverseV5TextToVideoExecutor();

const input = {
  prompt: "A serene mountain landscape at sunset with golden light filtering through clouds",
  aspect_ratio: "16:9",
  resolution: "720p",
  duration: "5"
};

try {
  const result = await executor.generateVideo(input);
  console.log('Video generated:', result.video.url);
} catch (error) {
  console.error('Generation failed:', error.message);
}
```

### Advanced Video Generation with Style

```typescript
const advancedInput = {
  prompt: "Epic low-cut camera capture of a girl clad in ultraviolet threads, Peter Max art style depiction, luminous diamond skin glistening under a vast moon's radiance, embodied in a superhuman flight among mystical ruins, symbolizing a deity's ritual ascent, hyper-detailed",
  aspect_ratio: "16:9",
  resolution: "720p",
  duration: "5",
  negative_prompt: "blurry, low quality, low resolution, pixelated, noisy, grainy, out of focus, poorly lit, poorly exposed, poorly composed, poorly framed, poorly cropped, poorly color corrected, poorly color graded",
  style: "cyberpunk"
};

const result = await executor.generateVideo(advancedInput);
```

### Queue-Based Processing

```typescript
// Submit to queue for long-running requests
const { request_id } = await executor.submitToQueue(input, "https://webhook.url/notify");

// Check status
const status = await FalAiPixverseV5TextToVideoExecutor.checkQueueStatus(request_id);

// Get result when complete
const result = await FalAiPixverseV5TextToVideoExecutor.getQueueResult(request_id);
```

### Cost Calculation

```typescript
// Calculate cost for different configurations
const cost720p5s = executor.calculateCost('720p', '5'); // $0.20 for 5 seconds at 720p
const cost720p8s = executor.calculateCost('720p', '8'); // $0.40 for 8 seconds at 720p
const cost1080p5s = executor.calculateCost('1080p', '5'); // $0.40 for 5 seconds at 1080p

// Get cost examples
const examples = executor.getCostExamples();
examples.forEach(example => {
  console.log(`${example.duration} at ${example.resolution}: $${example.cost}`);
});
```

## Best Practices

### Prompt Writing Strategy
- **Start with the main subject or action**: Clearly describe what you want to see
- **Describe the visual style and aesthetic**: Mention specific art styles or visual references
- **Include environmental and atmospheric details**: Describe lighting, mood, and setting
- **Mention camera angles or movements**: Specify viewing perspective if relevant
- **End with quality and detail specifications**: Use terms like "hyper-detailed" or "high quality"
- **Keep prompts clear and descriptive**: Avoid vague or ambiguous language

### Negative Prompt Optimization
- **Specify quality issues to avoid**: Include terms like "blurry", "low quality", "pixelated"
- **Mention unwanted elements**: Describe what you don't want to see
- **Use specific filtering terms**: Be precise about what to exclude
- **Keep negative prompts concise**: Focus on the most important exclusions
- **Test different combinations**: Experiment with various negative prompt strategies

### Style Selection Strategy
- **Match style to content**: Choose styles that complement your subject matter
- **Consider your target audience**: Different styles appeal to different demographics
- **Test multiple styles**: Experiment with different aesthetics for the same content
- **Use style for branding**: Maintain consistent styles across related content
- **Balance style with prompt**: Ensure your prompt works well with the chosen style

### Resolution and Duration Optimization
- **Start with lower resolutions**: Use 360p or 540p for testing and iteration
- **Reserve 720p for production**: Most cost-effective balance of quality and price
- **Use 1080p sparingly**: Only for high-priority content (5s max)
- **Stick to 5-second duration**: Most cost-effective option for most use cases
- **Plan 8-second content carefully**: Double cost but provides more storytelling time

## Common Use Cases

### Social Media Content
- **Instagram Reels**: Use 9:16 aspect ratio with 720p resolution
- **TikTok Videos**: Optimize for mobile viewing with vertical formats
- **YouTube Shorts**: Create engaging content with 9:16 aspect ratio
- **Twitter/X Videos**: Use 16:9 format for optimal platform compatibility

### Marketing and Business
- **Product Demonstrations**: Showcase products with clear, descriptive prompts
- **Brand Videos**: Create consistent visual identity with specific styles
- **Corporate Communications**: Professional content with appropriate aspect ratios
- **Promotional Materials**: Engaging content optimized for target platforms

### Educational Content
- **Tutorial Videos**: Clear explanations with appropriate visual styles
- **Learning Materials**: Educational content with consistent formatting
- **Training Videos**: Professional content for corporate learning
- **Academic Presentations**: Scholarly content with appropriate aesthetics

### Creative Projects
- **Artistic Videos**: Explore different styles and visual approaches
- **Storytelling**: Create narrative content with extended duration
- **Experimental Content**: Test different prompts and style combinations
- **Personal Projects**: Develop creative skills with various parameters

## Technical Considerations

### Performance Optimization
- **Start with lower resolutions**: Use 360p or 540p for testing and iterations
- **Implement queue processing**: Handle long-running requests asynchronously
- **Use webhooks**: Real-time notifications for production workflows
- **Cache generated content**: Avoid regeneration when possible
- **Batch requests**: Group multiple requests for efficiency

### Quality Management
- **Monitor resolution constraints**: 1080p limited to 5 seconds maximum
- **Balance cost and quality**: Choose appropriate resolution for your needs
- **Use seed values**: Ensure reproducible results for consistent content
- **Implement error handling**: Graceful handling of generation failures
- **Validate input parameters**: Check constraints before submission

### Cost Optimization
- **Use 5-second duration**: Most cost-effective option for most content
- **Choose appropriate resolutions**: Balance quality needs with budget constraints
- **Implement efficient workflows**: Minimize unnecessary regeneration
- **Monitor usage patterns**: Track costs across different configurations
- **Plan content strategy**: Optimize for cost-effective production

## Advanced Features

### Style Transfer Capabilities
- **Anime Style**: Perfect for cartoon and animation content
- **3D Animation**: Modern, computer-generated aesthetics
- **Clay Style**: Artistic, stop-motion appearance
- **Comic Style**: Graphic novel and comic book aesthetics
- **Cyberpunk Style**: Futuristic, high-tech visual themes

### Aspect Ratio Optimization
- **16:9**: Universal format for most platforms and content
- **4:3**: Traditional format for presentations and educational content
- **1:1**: Square format optimized for social media platforms
- **3:4**: Portrait format for mobile-first content
- **9:16**: Vertical format for stories and mobile viewing

### Resolution Strategy
- **360p**: Cost-effective testing and preview generation
- **540p**: Good quality for social media and web content
- **720p**: High quality for most production content
- **1080p**: Premium quality for high-priority content (5s max)

## Troubleshooting

### Common Issues and Solutions

#### Quality Problems
- **Issue**: Poor video quality or blurry output
- **Solution**: Use higher resolutions and ensure clear, descriptive prompts

#### Style Mismatches
- **Issue**: Generated style doesn't match expectations
- **Solution**: Be more specific in prompts and choose appropriate style options

#### Cost Issues
- **Issue**: Unexpected high costs
- **Solution**: Use lower resolutions, stick to 5-second duration, and monitor usage

#### Generation Failures
- **Issue**: Videos fail to generate
- **Solution**: Check prompt length, validate parameters, and implement error handling

### Performance Monitoring
- **Track generation times**: Monitor processing speed across different configurations
- **Monitor success rates**: Track successful vs. failed generations
- **Log cost patterns**: Analyze spending across different parameter combinations
- **Implement alerting**: Set up notifications for failed generations or high costs

## Integration Examples

### Next.js Application

```typescript
// pages/api/generate-video.ts
import { FalAiPixverseV5TextToVideoExecutor } from '../../../executors/fal-ai-pixverse-v5-text-to-video';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const executor = new FalAiPixverseV5TextToVideoExecutor();
    const result = await executor.generateVideo(req.body);
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### React Component

```typescript
// components/VideoGenerator.tsx
import { useState } from 'react';
import { FalAiPixverseV5TextToVideoExecutor } from '../executors/fal-ai-pixverse-v5-text-to-video';

export function VideoGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async (formData) => {
    setIsGenerating(true);
    try {
      const executor = new FalAiPixverseV5TextToVideoExecutor();
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
      {/* Form implementation */}
      {isGenerating && <div>Generating video...</div>}
      {result && (
        <video controls src={result.video.url}>
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}
```

## Cost Optimization Strategies

### Resolution Management
- **Use 360p/540p for testing**: Minimize costs during development and iteration
- **Reserve 720p for production**: Most cost-effective balance of quality and price
- **Limit 1080p usage**: Only for high-priority content with 5-second constraint

### Duration Optimization
- **Stick to 5-second duration**: Most cost-effective option for most content
- **Plan 8-second content carefully**: Double cost but provides more storytelling time
- **Consider content requirements**: Choose duration based on actual needs

### Workflow Optimization
- **Implement efficient testing**: Use lower resolutions for iteration
- **Cache generated content**: Avoid regeneration when possible
- **Batch requests**: Group multiple requests for efficiency
- **Monitor usage patterns**: Track costs and optimize accordingly

## Conclusion

The Fal AI PixVerse V5 Text-to-Video model provides a powerful and cost-effective solution for generating high-quality videos from text prompts. With its multiple style options, flexible aspect ratios, and various resolution choices, it's ideal for a wide range of applications from social media content to professional marketing materials.

By following the best practices outlined in this guide and optimizing your usage patterns, you can create stunning videos efficiently while managing costs effectively. The model's queue processing capabilities and webhook support make it suitable for both development and production workflows.

Remember to start with smaller resolutions and shorter durations for testing, then scale up based on your quality requirements and budget constraints. The comprehensive error handling and validation ensure reliable operation across different use cases and content types.

The model's unique combination of style options, aspect ratio flexibility, and cost-effective pricing makes it an excellent choice for creators, marketers, and developers looking to generate high-quality video content from text descriptions.
