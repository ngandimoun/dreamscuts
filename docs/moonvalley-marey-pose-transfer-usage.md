# Moonvalley Marey Pose Transfer Usage Guide

## Overview

The **Moonvalley Marey Pose Transfer** model (`moonvalley/marey/pose-transfer`) is the world's first commercially-safe pose transfer video generation model trained exclusively on fully licensed data. Built to meet the standards of world-class cinematography, Marey Pose Transfer offers unmatched control, consistency, and fidelity for professional filmmakers who need to transfer poses from reference images to character videos while maintaining character consistency and high-quality output.

The model costs $1.50 for 5-second videos and $3.00 for 10-second videos, making it an excellent choice for professional content creation, educational materials, and commercial applications.

## Key Features

- **Pose Transfer Technology**: Advanced AI that transfers poses from reference images to character videos
- **Character Consistency**: Maintains the character's appearance and style from the source image
- **Commercial Safety**: Trained on fully licensed data for commercial use
- **Multiple Dimensions**: Support for landscape, portrait, and square formats
- **Duration Control**: 5-second and 10-second video options
- **High Quality**: Cinematography-grade output suitable for professional use
- **Queue Processing**: Asynchronous processing for long content
- **Real-time Monitoring**: Progress tracking and status updates

## Input Parameters

### Required Parameters

#### `image_url` (string)
The URL of the source image containing the character you want to animate.
- **Format**: Must be a valid, accessible URL
- **Supported formats**: jpg, jpeg, png, webp, gif, avif
- **Requirements**: High-quality image with clear character visibility

#### `pose_image_url` (string)
The URL of the reference image showing the desired pose or movement.
- **Format**: Must be a valid, accessible URL
- **Supported formats**: jpg, jpeg, png, webp, gif, avif
- **Requirements**: Clear, well-defined pose reference image

#### `prompt` (string)
Detailed description of the desired video output.
- **Minimum length**: 50 words
- **Maximum length**: 2000 characters
- **Content**: Should describe the pose, movement, environment, and style

### Optional Parameters

#### `dimensions` (string, optional)
The output video dimensions. Defaults to '1920x1080' if not specified.
- **Options**:
  - `'1920x1080'`: Landscape format, ideal for widescreen content
  - `'1080x1920'`: Portrait format, perfect for mobile-first content
  - `'1152x1152'`: Square format, great for social media posts
  - `'1536x1152'`: Wide landscape, excellent for cinematic content
  - `'1152x1536'`: Tall portrait, ideal for mobile video content

#### `duration` (string, optional)
The length of the generated video. Defaults to '5s' if not specified.
- **Options**:
  - `'5s'`: Quick demonstrations and social media clips
  - `'10s'`: Detailed pose transfers and showcase content

#### `negative_prompt` (string, optional)
Text describing what to avoid in the generated video.
- **Default**: `<synthetic> <scene cut> low-poly, flat shader, bad rigging, stiff animation, uncanny eyes, low-quality textures, looping glitch, cheap effect, overbloom, bloom spam, default lighting, game asset, stiff face, ugly specular, AI artifacts`
- **Usage**: Customize to avoid specific unwanted elements

#### `seed` (number, optional)
Random seed for reproducible results.
- **Range**: -1 (random) or 0-999999
- **Default**: 9
- **Usage**: Use the same seed for consistent results

## Pricing Structure

The model uses a fixed pricing structure based on video duration:

| Duration | Cost | Description |
|----------|------|-------------|
| 5 seconds | $1.50 | Quick pose transfer demonstrations |
| 10 seconds | $3.00 | Extended pose transfer sequences |

### Cost Examples

```typescript
const executor = new MoonvalleyMareyPoseTransferExecutor();

// Calculate costs
const cost5s = executor.calculateCost('5s');  // $1.50
const cost10s = executor.calculateCost('10s'); // $3.00

// Get cost examples
const examples = executor.getCostExamples();
```

## Usage Examples

### Basic Pose Transfer Generation

```typescript
import { MoonvalleyMareyPoseTransferExecutor } from './executors/moonvalley-marey-pose-transfer';

const executor = new MoonvalleyMareyPoseTransferExecutor();

const input = {
  image_url: 'https://example.com/character.jpg',
  pose_image_url: 'https://example.com/pose_reference.jpg',
  prompt: 'A confident young woman in a flowing red dress gracefully extending her arms in a ballet pose, her hair flowing elegantly, standing in a sunlit garden with soft bokeh background, cinematic lighting, professional photography style',
  dimensions: '1920x1080',
  duration: '5s',
  seed: 42
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
const queueResult = await executor.submitToQueue(input);
console.log('Request ID:', queueResult.request_id);

// Check status
const status = await MoonvalleyMareyPoseTransferExecutor.checkQueueStatus(queueResult.request_id);
console.log('Status:', status);

// Get result when complete
const result = await MoonvalleyMareyPoseTransferExecutor.getQueueResult(queueResult.request_id);
console.log('Video result:', result.video.url);
```

### Cost Calculation

```typescript
// Calculate costs for different durations
const cost5s = executor.calculateCost('5s');   // $1.50
const cost10s = executor.calculateCost('10s'); // $3.00

// Estimate video duration
const duration5s = executor.estimateVideoDuration('5s');   // 5
const duration10s = executor.estimateVideoDuration('10s'); // 10
```

## Best Practices

### Image Preparation

#### Source Image Tips
- Use high-quality images with clear character visibility
- Ensure good lighting and contrast
- Avoid cluttered backgrounds when possible
- Use images with the character in a neutral pose for best results
- Ensure the character takes up a significant portion of the frame

#### Pose Reference Image Tips
- Choose clear, well-defined pose references
- Use images with good body positioning visibility
- Avoid poses that are too complex or extreme
- Ensure the pose image shows the desired movement clearly
- Use high-resolution pose reference images

### Prompt Writing

#### Structure Recommendations
1. **Start with character description and appearance**
2. **Describe the specific pose or movement**
3. **Include body positioning and gestures**
4. **Add facial expression details**
5. **Describe the environment or setting**
6. **Specify the mood and atmosphere**
7. **Include any specific actions or movements**
8. **End with style and quality specifications**

#### Writing Tips
- Describe the desired pose and movement clearly and specifically
- Include details about the character's appearance and clothing
- Specify the mood and atmosphere you want to convey
- Use descriptive language for body positioning and gestures
- Mention any specific actions or movements you want to see
- Include environmental context if relevant to the pose
- Be specific about facial expressions and body language
- Use action verbs to describe movement and positioning

### Pose Transfer Best Practices
- Choose pose references that clearly show the desired position
- Use poses that complement your character's style
- Consider the flow and movement between poses
- Select poses that work well with your prompt description
- Use reference poses that are achievable and natural
- Consider the character's proportions and build
- Choose poses that enhance your storytelling goals
- Test different pose references for optimal results

## Common Use Cases

### Professional Applications
- **Character Animation**: Games, interactive media, and digital content
- **Fashion Content**: Clothing demonstrations and model poses
- **Educational Content**: Dance tutorials and movement studies
- **Marketing Videos**: Product demonstrations and brand content
- **Social Media**: Engaging content for influencers and brands

### Creative Projects
- **Art Reference**: Character pose libraries for artists
- **Storytelling**: Character development and narrative content
- **Animation**: Reference creation for traditional animators
- **Content Creation**: Social media and platform-specific content

## Technical Considerations

### Performance Optimization
- Use clear, high-resolution input images
- Choose pose references that are well-defined and visible
- Write detailed, specific prompts for better results
- Use appropriate dimensions for your content type
- Consider using 5s duration for quick iterations
- Use 10s duration for complex pose sequences

### Quality Factors
- Both source and pose images should be high quality
- Pose transfer works best with clear, well-lit images
- Complex poses may require longer generation times
- Results depend on the quality of both input images
- Character consistency is maintained from the source image
- Pose accuracy depends on the clarity of the pose reference

## Error Handling

The executor provides comprehensive error handling with specific error codes:

```typescript
try {
  const result = await executor.generateVideo(input);
} catch (error) {
  switch (error.code) {
    case 'GENERATION_FAILED':
      console.error('Video generation failed:', error.message);
      break;
    case 'QUEUE_SUBMIT_FAILED':
      console.error('Queue submission failed:', error.message);
      break;
    case 'STATUS_CHECK_FAILED':
      console.error('Status check failed:', error.message);
      break;
    case 'RESULT_FETCH_FAILED':
      console.error('Result fetch failed:', error.message);
      break;
    default:
      console.error('Unknown error:', error.message);
  }
}
```

### Common Error Scenarios
- **Missing required parameters**: Ensure all required fields are provided
- **Invalid image URLs**: Verify URLs are accessible and valid
- **Prompt length issues**: Ensure prompt is between 50 words and 2000 characters
- **Invalid dimensions**: Use only supported dimension values
- **Invalid duration**: Use only '5s' or '10s' values
- **Seed range errors**: Use seed values between -1 and 999999

## Integration Examples

### React Component Integration

```typescript
import React, { useState } from 'react';
import { MoonvalleyMareyPoseTransferExecutor } from './executors/moonvalley-marey-pose-transfer';

const PoseTransferComponent = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async (input) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const executor = new MoonvalleyMareyPoseTransferExecutor();
      const videoResult = await executor.generateVideo(input);
      setResult(videoResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      {/* Component UI */}
    </div>
  );
};
```

### Node.js Server Integration

```typescript
import express from 'express';
import { MoonvalleyMareyPoseTransferExecutor } from './executors/moonvalley-marey-pose-transfer';

const app = express();
app.use(express.json());

app.post('/api/pose-transfer', async (req, res) => {
  try {
    const executor = new MoonvalleyMareyPoseTransferExecutor();
    const result = await executor.generateVideo(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message,
      code: error.code 
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Advanced Features

### Dimension Control
The model supports multiple aspect ratios for different content types:

```typescript
const dimensions = MoonvalleyMareyPoseTransferExecutor.getDimensionRecommendations();
console.log(dimensions);
// Output:
// {
//   '1920x1080': 'Landscape format, ideal for widescreen content and social media',
//   '1080x1920': 'Portrait format, perfect for mobile-first content and stories',
//   '1152x1152': 'Square format, great for social media posts and thumbnails',
//   '1536x1152': 'Wide landscape, excellent for cinematic content',
//   '1152x1536': 'Tall portrait, ideal for mobile video content'
// }
```

### Duration Control
Choose between quick demonstrations and extended content:

```typescript
const durations = MoonvalleyMareyPoseTransferExecutor.getDurationRecommendations();
console.log(durations);
// Output:
// {
//   '5s': 'Quick demonstrations, social media clips, and preview content',
//   '10s': 'Detailed pose transfers, longer demonstrations, and showcase content'
// }
```

### Seed Control
Reproducible results for consistent output:

```typescript
// Use specific seed for reproducible results
const input = {
  // ... other parameters
  seed: 42
};

// Use random seed for varied results
const inputRandom = {
  // ... other parameters
  seed: -1
};
```

### Negative Prompt Customization
Control what to avoid in your generated content:

```typescript
const defaultNegativePrompt = MoonvalleyMareyPoseTransferExecutor.getDefaultNegativePrompt();

const customInput = {
  // ... other parameters
  negative_prompt: `${defaultNegativePrompt}, blurry, low resolution, distorted`
};
```

## Troubleshooting

### Common Issues and Solutions

#### Poor Pose Transfer Quality
- **Issue**: Results don't match the pose reference
- **Solution**: Use clearer, more defined pose reference images
- **Prevention**: Choose high-quality pose references with good visibility

#### Character Inconsistency
- **Issue**: Character appearance changes unexpectedly
- **Solution**: Use higher quality source images with clear character definition
- **Prevention**: Ensure source images have good lighting and contrast

#### Generation Failures
- **Issue**: API calls fail or timeout
- **Solution**: Check image URL accessibility and prompt length
- **Prevention**: Validate all inputs before submission

#### Long Processing Times
- **Issue**: Videos take longer than expected to generate
- **Solution**: Use queue-based processing for complex requests
- **Prevention**: Start with 5s duration for testing

### Performance Optimization Tips
- Use clear, high-resolution input images
- Choose pose references that are well-defined and visible
- Write detailed, specific prompts for better results
- Use appropriate dimensions for your content type
- Consider using 5s duration for quick iterations
- Use 10s duration for complex pose sequences

### Getting Help
- Check the error messages for specific guidance
- Verify all input parameters meet requirements
- Test with simpler inputs first
- Use the provided utility methods for guidance
- Refer to the model's best practices and examples

## Model Advantages

The Moonvalley Marey Pose Transfer model offers several key advantages:

- **Commercially Safe**: Trained on fully licensed data for commercial use
- **High Quality**: Cinematography-grade output suitable for professional projects
- **Character Consistency**: Maintains character appearance and style
- **Advanced Control**: Multiple parameters for fine-tuned results
- **Professional Standards**: Built to meet world-class cinematography requirements
- **Flexible Output**: Multiple dimensions and durations for various use cases
- **Reliable Performance**: Professional-grade reliability and consistency
- **Cost Effective**: Competitive pricing for high-quality output

## Example Prompt Reference

Here's an example of a well-structured prompt for pose transfer:

```typescript
const examplePrompt = MoonvalleyMareyPoseTransferExecutor.getExamplePrompt();
console.log(examplePrompt);
// Output: "A confident young woman in a flowing red dress gracefully extending her arms in a ballet pose, her hair flowing elegantly, standing in a sunlit garden with soft bokeh background, cinematic lighting, professional photography style"
```

## Supported Image Formats

The model supports various image formats for both source and pose reference images:

```typescript
const supportedFormats = MoonvalleyMareyPoseTransferExecutor.getSupportedImageFormats();
console.log(supportedFormats);
// Output: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif']
```

## Commercial Use Best Practices

When using this model for commercial purposes:

- Ensure you have rights to use both source and pose images
- Use high-quality, professional reference materials
- Test with different pose references for best results
- Consider your target audience and content requirements
- Use appropriate dimensions for your platform
- Plan your content strategy with pose transfer capabilities
- Maintain brand consistency across generated content
- Follow platform-specific content guidelines

## Conclusion

The Moonvalley Marey Pose Transfer model provides professional-grade pose transfer capabilities with commercial safety and high-quality output. By following the best practices outlined in this guide, you can create engaging, consistent character animations that meet professional standards while maintaining cost-effectiveness.

Whether you're creating content for social media, educational materials, or professional projects, this model offers the tools and flexibility needed to bring your creative vision to life with precision and quality.
