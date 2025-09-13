# Fal AI Infinitalk Single Text Usage Guide

## Overview

The **Fal AI Infinitalk Single Text** model (fal-ai/infinitalk/single-text) is an advanced AI model specialized in generating talking avatar videos from text input and images. This model automatically converts text to speech and creates synchronized lip-sync videos with natural facial expressions. Unlike the standard Infinitalk model, this version focuses on text-to-speech conversion rather than audio file input.

The model costs $0.3 per second of output video, with the price doubling for 720p resolution. It supports 20 different voice options and flexible video parameters, making it ideal for various talking head video generation needs.

## Key Features

- **Text-to-Speech Generation**: Automatically converts text input to natural speech
- **Talking Head Creation**: Generates realistic talking avatar videos from images
- **Multiple Voice Options**: 20 different voice personalities to choose from
- **Precise Lip-Sync**: Advanced AI algorithms for natural speech synchronization
- **Natural Expressions**: Generates natural facial expressions and head movements
- **Flexible Resolution**: Choose between 480p (cost-effective) or 720p (high quality)
- **Frame Control**: Customize video length from 41 to 721 frames (approx. 1.4 to 24 seconds at 30fps)
- **Acceleration Options**: Balance between speed and quality with 'none', 'regular', or 'high' settings
- **Seed-Based Reproducibility**: Ensure consistent results with seed values
- **Queue Processing**: Handle long-running requests asynchronously
- **Cost-Effective Pricing**: Pay-per-second pricing model with resolution-based scaling

## Input Parameters

### Required Parameters

#### `image_url` (string)
- **Description**: URL of the input image for the talking avatar
- **Format**: Must be a publicly accessible URL
- **Supported Formats**: JPEG, PNG, WebP, GIF
- **Best Practices**: 
  - Use high-quality, clear images (at least 512x512 pixels)
  - Ensure good lighting and contrast
  - Use images with clear facial features
  - Avoid images with multiple people or complex backgrounds
  - Ensure the face is centered and well-lit

#### `text_input` (string)
- **Description**: The text that will be converted to speech and synchronized with the avatar
- **Constraints**: 1-1000 characters
- **Best Practices**:
  - Write natural, conversational text
  - Keep sentences clear and concise
  - Use proper punctuation for natural speech patterns
  - Consider the avatar's personality and tone
  - Avoid overly complex or technical language

#### `voice` (VoiceEnum)
- **Description**: The voice personality to use for speech generation
- **Available Options**: Aria, Roger, Sarah, Laura, Charlie, George, Callum, River, Liam, Charlotte, Alice, Matilda, Will, Jessica, Eric, Chris, Brian, Daniel, Lily, Bill
- **Best Practices**:
  - Choose voices that match your content tone
  - Consider the target audience demographics
  - Test different voices for the same content
  - Match voice characteristics to the avatar image
  - Use consistent voices for brand consistency

#### `prompt` (string)
- **Description**: Text description to guide video generation and avatar appearance
- **Constraints**: 1-1000 characters
- **Best Practices**:
  - Be specific about the avatar's appearance and expression
  - Describe the context and setting clearly
  - Include emotional cues for natural expressions
  - Mention any specific movements or gestures
  - Keep prompts concise but descriptive

### Optional Parameters

#### `num_frames` (integer)
- **Description**: Number of frames to generate in the video
- **Range**: 41-721 frames
- **Default**: 145 frames (4.8 seconds at 30fps)
- **Recommendations**:
  - **Short (60 frames)**: 2 seconds - Quick social media clips
  - **Standard (145 frames)**: 4.8 seconds - Standard talking head videos
  - **Medium (300 frames)**: 10 seconds - Detailed explanations
  - **Long (600 frames)**: 20 seconds - Comprehensive content
  - **Extended (721 frames)**: 24 seconds - Maximum length content

#### `resolution` ('480p' | '720p')
- **Description**: Resolution of the generated video
- **Default**: '480p'
- **Options**:
  - **480p**: Base price, good for most use cases, ideal for social media and web content
  - **720p**: Double price, high quality, ideal for professional content and presentations

#### `seed` (integer)
- **Description**: Random seed for reproducible results
- **Range**: 0-999999
- **Default**: 42
- **Use Case**: Use the same seed to generate identical videos with the same parameters

#### `acceleration` ('none' | 'regular' | 'high')
- **Description**: Acceleration level for generation speed vs. quality trade-off
- **Default**: 'regular'
- **Options**:
  - **none**: Slowest speed, highest quality - Best for final production videos
  - **regular**: Balanced speed and quality - Best for most use cases
  - **high**: Fastest speed, lower quality - Best for quick iterations and testing

## Pricing Structure

The model uses a duration-based pricing model:
- **Base Cost**: $0.3 per second of output video
- **Resolution Scaling**: 720p resolution doubles the cost
- **Calculation Formula**: `Cost = (num_frames / 30) × $0.3 × resolution_multiplier`

### Cost Examples

| Frames | Resolution | Duration | Cost | Description |
|--------|------------|----------|------|-------------|
| 60 | 480p | 2s | $0.60 | 2-second video at 480p |
| 145 | 480p | 4.8s | $1.44 | 4.8-second video at 480p |
| 300 | 720p | 10s | $6.00 | 10-second video at 720p |
| 600 | 480p | 20s | $6.00 | 20-second video at 480p |

## Usage Examples

### Basic Video Generation

```typescript
import { FalAiInfinitalkSingleTextExecutor } from './executors/fal-ai-infinitalk-single-text';

const executor = new FalAiInfinitalkSingleTextExecutor();

const input = {
  image_url: "https://example.com/avatar.jpg",
  text_input: "Welcome to our product demonstration!",
  voice: "Sarah",
  prompt: "A professional business person speaking confidently"
};

try {
  const result = await executor.generateVideo(input);
  console.log('Video generated:', result.video.url);
} catch (error) {
  console.error('Generation failed:', error.message);
}
```

### Queue-Based Processing

```typescript
// Submit to queue for long-running requests
const { request_id } = await executor.submitToQueue(input, "https://webhook.url/notify");

// Check status
const status = await FalAiInfinitalkSingleTextExecutor.checkQueueStatus(request_id);

// Get result when complete
const result = await FalAiInfinitalkSingleTextExecutor.getQueueResult(request_id);
```

### Cost Calculation

```typescript
// Calculate cost for different configurations
const cost480p = executor.calculateCost(300, '480p'); // $3.00 for 10 seconds
const cost720p = executor.calculateCost(300, '720p'); // $6.00 for 10 seconds

// Get cost examples
const examples = executor.getCostExamples();
examples.forEach(example => {
  console.log(`${example.duration} at ${example.resolution}: $${example.cost}`);
});
```

## Best Practices

### Image Preparation
- Use high-quality, clear reference images (at least 512x512 pixels)
- Ensure good lighting and contrast for optimal results
- Use images with clear facial features and expressions
- Avoid images with multiple people or complex backgrounds
- Ensure the face is centered and well-lit
- Test with different image styles to find what works best

### Text Input Optimization
- Write natural, conversational text that flows well
- Keep sentences clear and concise for better speech synthesis
- Use proper punctuation to guide natural speech patterns
- Consider the avatar's personality and tone when writing
- Avoid overly complex or technical language that might not translate well to speech
- Test different text lengths to find optimal frame counts

### Voice Selection Strategy
- Choose voices that match your content tone and target audience
- Consider demographic factors when selecting voices
- Test different voices for the same content to find the best fit
- Match voice characteristics to the avatar image for consistency
- Use consistent voices across related content for brand consistency
- Experiment with different voice personalities for different content types

### Prompt Writing Tips
- Start with the person's appearance and clothing description
- Describe the setting and environment clearly
- Include emotional state and expression details
- Mention any specific actions or gestures you want to see
- End with the overall mood and purpose of the video
- Keep prompts descriptive but concise for optimal results

## Common Use Cases

### Educational Content
- **Tutorials and How-To Videos**: Create engaging educational content with synchronized speech
- **Language Learning**: Generate videos in different languages with appropriate voices
- **Training Materials**: Develop onboarding and training content with consistent avatars
- **Academic Presentations**: Create professional academic content with talking heads

### Marketing and Business
- **Product Demonstrations**: Showcase products with personalized talking avatars
- **Corporate Communications**: Deliver company messages with consistent branding
- **Customer Service**: Create personalized announcements and updates
- **Sales Presentations**: Generate engaging sales content with human-like avatars

### Content Creation
- **Social Media Content**: Create engaging posts with talking avatars
- **News and Media**: Generate news updates and media content
- **Entertainment**: Create gaming and entertainment content
- **Personal Messages**: Generate personalized video messages

### Professional Applications
- **Virtual Assistants**: Create AI-powered virtual assistants with human-like avatars
- **E-learning Platforms**: Develop interactive learning experiences
- **Corporate Training**: Create consistent training materials across organizations
- **Accessibility**: Make content more accessible with visual and audio components

## Technical Considerations

### Performance Optimization
- Use 480p resolution for testing and iterations to reduce costs
- Start with shorter frame counts for quick feedback and iteration
- Use acceleration settings to balance speed and quality requirements
- Batch multiple requests together for efficiency
- Implement webhook handling for production workflows
- Cache generated videos when possible to avoid regeneration

### Queue Management
- Use queue processing for long content (over 10 seconds)
- Implement webhook handling for production workflows
- Monitor queue status for long-running requests
- Handle errors gracefully in queue-based workflows
- Consider implementing retry logic for failed requests

### Error Handling
- Validate all input parameters before submission
- Handle API rate limits and authentication errors
- Implement proper error logging and monitoring
- Provide user-friendly error messages
- Implement fallback strategies for failed generations

## Advanced Features

### Seed Control
- Use consistent seed values for reproducible results
- Experiment with different seeds for variety
- Document successful seed values for future use
- Use seeds for A/B testing different parameters

### Resolution Optimization
- Use 480p for cost-effective production and testing
- Reserve 720p for final production content
- Consider your target platform requirements
- Balance quality needs with budget constraints

### Frame Count Management
- Match frame counts to content length requirements
- Consider speech timing when setting frame counts
- Use shorter frames for quick iterations
- Plan frame counts based on your content strategy

### Acceleration Settings
- Use 'high' acceleration for quick testing and iterations
- Use 'regular' acceleration for most production content
- Use 'none' acceleration for final high-quality videos
- Balance speed requirements with quality needs

## Troubleshooting

### Common Issues and Solutions

#### Image Quality Problems
- **Issue**: Poor avatar quality or distorted faces
- **Solution**: Use higher quality images with clear facial features and good lighting

#### Speech Synchronization Issues
- **Issue**: Lip-sync not matching speech timing
- **Solution**: Ensure text input length matches frame count appropriately

#### Processing Time Issues
- **Issue**: Long processing times for simple requests
- **Solution**: Use acceleration settings and check queue status for long content

#### Cost Optimization
- **Issue**: Unexpected high costs
- **Solution**: Use 480p resolution, shorter frame counts, and monitor usage

### Performance Monitoring
- Track generation times and success rates
- Monitor costs across different parameter combinations
- Log errors and performance issues for optimization
- Implement alerting for failed generations or high costs

## Integration Examples

### Next.js Application

```typescript
// pages/api/generate-video.ts
import { FalAiInfinitalkSingleTextExecutor } from '../../../executors/fal-ai-infinitalk-single-text';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const executor = new FalAiInfinitalkSingleTextExecutor();
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
import { FalAiInfinitalkSingleTextExecutor } from '../executors/fal-ai-infinitalk-single-text';

export function VideoGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async (formData) => {
    setIsGenerating(true);
    try {
      const executor = new FalAiInfinitalkSingleTextExecutor();
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
- Use 480p for most content to minimize costs
- Reserve 720p for high-priority or final production content
- Test with 480p first, then upgrade to 720p if needed

### Frame Count Optimization
- Start with shorter frame counts for testing
- Extend frame counts only when necessary
- Use the minimum frames needed for your content

### Batch Processing
- Group multiple requests together when possible
- Use queue processing for long content to avoid timeouts
- Implement efficient request management

### Caching Strategy
- Cache generated videos when possible
- Reuse content with different parameters
- Implement smart caching based on usage patterns

## Conclusion

The Fal AI Infinitalk Single Text model provides a powerful and cost-effective solution for generating talking avatar videos from text input. With its automatic text-to-speech conversion, multiple voice options, and flexible parameters, it's ideal for a wide range of applications from educational content to marketing materials.

By following the best practices outlined in this guide and optimizing your usage patterns, you can create high-quality talking head videos efficiently while managing costs effectively. The model's queue processing capabilities and webhook support make it suitable for both development and production workflows.

Remember to start with smaller frame counts and lower resolutions for testing, then scale up based on your quality requirements and budget constraints. The comprehensive error handling and validation ensure reliable operation across different use cases and content types.
