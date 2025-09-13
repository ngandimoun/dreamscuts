# Moonvalley Marey Text-to-Video Usage Guide

## Overview

The **Moonvalley Marey Text-to-Video** model (`moonvalley/marey/t2v`) is the world's first commercially-safe video generation model trained exclusively on fully licensed data. Built to meet the standards of world-class cinematography, Marey offers unmatched control, consistency, and fidelity for professional filmmakers who demand precision in every frame. The model costs $1.50 for 5-second videos and $3.00 for 10-second videos.

## Key Features

- **Commercial Safety**: Trained exclusively on fully licensed data for commercial use
- **Cinematography Quality**: Built to meet world-class filmmaking standards
- **Advanced Prompt Understanding**: Sophisticated interpretation of detailed descriptions
- **Professional Output**: High-quality videos suitable for commercial projects
- **Multiple Dimensions**: Support for various aspect ratios and formats
- **Duration Control**: 5-second and 10-second video generation options
- **Queue Support**: Handle long-running requests with webhook integration
- **Seed Control**: Reproducible results and variations for development

## Input Parameters

### Required Parameters

- **`prompt`** (string): Detailed text description for video generation (minimum 50 words recommended for best results)

### Optional Parameters

- **`dimensions`** (1920x1080|1152x1152|1536x1152|1152x1536): Video dimensions (default: 1920x1080)
- **`duration`** (5s|10s): Video duration (default: 5s)
- **`negative_prompt`** (string): What to avoid in the generated video
- **`seed`** (number): Random seed for reproducible results (-1 for random, 0-999999, default: 9)

## Pricing Structure

The model uses a **duration-based pricing** system:

- **5-second videos**: $1.50 per video
- **10-second videos**: $3.00 per video

### Cost Examples

| Duration | Cost | Description | Use Case |
|----------|------|-------------|----------|
| 5 seconds | $1.50 | Quick content, social media, testing concepts | Short content, concept testing |
| 10 seconds | $3.00 | Extended content, storytelling, detailed scenes | Longer narratives, detailed scenes |

## Usage Examples

### Basic Video Generation

```typescript
import { MoonvalleyMareyT2VExecutor } from './executors/moonvalley-marey-t2v';

const executor = new MoonvalleyMareyT2VExecutor();

const result = await executor.generateVideo({
  prompt: 'Detailed Description: A small, white paper boat, with one corner engulfed in bright orange flames, drifts precariously across a dark puddle on wet asphalt. As raindrops fall, they create ever-expanding ripples on the water\'s surface, gently rocking the fragile vessel and causing the fiery reflection below to dance and shimmer. The flickering flame slowly consumes the paper, charring the edges black as the boat becomes waterlogged, beginning to sink in a poignant slow-motion battle between fire and water. Background: The background is softly blurred, suggesting an overcast day with out-of-focus foliage, enhancing the scene\'s intimate and melancholic mood. Middleground: Raindrops continuously strike the puddle\'s surface, creating concentric ripples that gently push the boat along its short, determined voyage. Foreground: The burning paper boat floats in sharp focus, its bright, flickering flame casting a warm, dramatic glow that reflects and distorts on the dark, wet surface of the asphalt.',
  dimensions: '1920x1080',
  duration: '5s',
  negative_prompt: '<synthetic> <scene cut> low-poly, flat shader, bad rigging, stiff animation, uncanny eyes, low-quality textures, looping glitch, cheap effect, overbloom, bloom spam, default lighting, game asset, stiff face, ugly specular, AI artifacts',
  seed: 9
});
```

### Queue-Based Processing for Longer Content

```typescript
// Submit to queue for longer videos
const { request_id } = await executor.submitToQueue({
  prompt: 'Cinematic wide shot of a majestic mountain range at golden hour. The camera slowly pans from left to right, revealing snow-capped peaks that glow with warm amber light. Rolling hills covered in dense evergreen forests stretch into the distance, their shadows lengthening as the sun sets. A pristine alpine lake reflects the sky\'s vibrant colors, creating a mirror-like surface. Atmospheric mist drifts through the valleys, adding depth and mystery to the scene. The lighting creates dramatic contrast between the illuminated peaks and shadowed valleys, emphasizing the rugged terrain\'s natural beauty.',
  dimensions: '1920x1080',
  duration: '10s',
  negative_prompt: 'low quality, blurry, distorted, artificial, synthetic',
  seed: -1
});

// Check status
const status = await MoonvalleyMareyT2VExecutor.checkQueueStatus(request_id);

// Get result when complete
if (status.status === 'completed') {
  const result = await MoonvalleyMareyT2VExecutor.getQueueResult(request_id);
}
```

### Cost Calculation

```typescript
// Calculate cost based on duration
const cost5s = executor.calculateCost('5s'); // $1.50
const cost10s = executor.calculateCost('10s'); // $3.00

// Get cost examples for different scenarios
const examples = executor.getCostExamples();
```

## Best Practices

### Prompt Writing

1. **Minimum Length**: Aim for at least 50 words of detail for best results
2. **Use Recommended Structure**: Follow the structure: [Camera Movement] + [Scale/Perspective] + [Core Visual] + [Environmental Details] + [Lighting/Technical Specs]
3. **Camera Details**: Be descriptive about camera work (e.g., 35mm, handheld shot, tracking shot)
4. **Scene Description**: Include environment, atmosphere, and setting details
5. **Subject Action**: Clearly describe subjects and their movements
6. **Technical Specs**: Mention lighting conditions and technical aspects
7. **Avoid Negatives**: Don't include negative prompts in the main description - use the negative_prompt field

### Prompt Structure Example

```
[Camera Movement]: Dynamic tracking shot through a bustling city street
[Scale/Perspective]: Wide angle, street-level perspective
[Core Visual]: People walking with umbrellas, neon-lit storefronts
[Environmental Details]: Wet pavement, night atmosphere, urban setting
[Lighting/Technical Specs]: Neon lighting, streetlights, reflections on wet surfaces
```

### Parameter Optimization

1. **Dimensions**: Choose based on your content type and platform
2. **Duration**: Use 5s for quick content, 10s for detailed storytelling
3. **Seed Values**: Use specific seeds for reproducible results during development
4. **Negative Prompts**: Leverage to avoid unwanted features and artifacts

## Common Use Cases

### Professional Filmmaking
- **Cinematic Content**: High-quality narrative and artistic videos
- **Commercial Production**: Advertising and marketing content
- **Film Projects**: Short films and cinematic sequences
- **Documentary Content**: Educational and informative videos

### Creative Content
- **Artistic Expression**: Experimental and creative video content
- **Storytelling**: Narrative and emotional content creation
- **Brand Content**: Brand storytelling and marketing materials
- **Social Media**: High-quality content for various platforms

### Educational and Training
- **Film School**: Learning and educational projects
- **Training Videos**: Professional development content
- **Concept Testing**: Visualizing ideas and concepts
- **Portfolio Building**: Creating professional work samples

## Technical Considerations

### Processing Time
- Higher complexity prompts may require more processing time
- Queue processing recommended for longer content
- Real-time monitoring available during generation

### Quality Factors
- Detailed prompts (50+ words) produce significantly better results
- Following the recommended structure improves output quality
- Seed values enable reproducible results and variations
- Negative prompts help avoid unwanted features

### Cost Optimization
- Use 5s duration for testing and concept validation
- Use 10s duration for final, detailed content
- Optimize prompts for efficiency and quality
- Consider queue processing for batch operations

## Error Handling

The executor provides comprehensive error handling with specific error codes:

- `GENERATION_FAILED`: Video generation process failed
- `QUEUE_SUBMIT_FAILED`: Failed to submit to processing queue
- `STATUS_CHECK_FAILED`: Failed to check queue status
- `RESULT_FETCH_FAILED`: Failed to retrieve queue result

### Common Issues and Solutions

1. **Generation Fails**: Ensure prompt is at least 50 words and well-structured
2. **Poor Quality**: Use more detailed prompts and follow the recommended structure
3. **Unexpected Content**: Adjust negative prompts to avoid unwanted features
4. **Inconsistent Results**: Use specific seed values for reproducible outputs
5. **Slow Processing**: Use queue processing for longer content

## Integration Examples

### Real-time Processing

```typescript
const result = await fal.subscribe('moonvalley/marey/t2v', {
  input: {
    prompt: 'Dynamic tracking shot through a bustling modern city street at night. The camera follows a smooth path along the sidewalk, revealing neon-lit storefronts and towering glass skyscrapers. Streetlights cast warm pools of light on wet pavement, reflecting colorful neon signs. People walk briskly with umbrellas, their silhouettes creating interesting shapes against the bright backgrounds. Traffic lights change from red to green, casting dynamic shadows. The scene captures the energy and vibrancy of urban nightlife with cinematic quality.',
    dimensions: '1536x1152',
    duration: '5s',
    negative_prompt: 'daytime, empty, quiet, low contrast, flat lighting',
    seed: 42
  },
  pollInterval: 1000,
  onResult: (result) => console.log('Complete:', result),
  onError: (error) => console.error('Error:', error)
});
```

### Batch Processing

```typescript
const scenes = [
  {
    prompt: 'Cinematic wide shot of a majestic mountain range at golden hour...',
    dimensions: '1920x1080',
    duration: '10s',
    seed: 123
  },
  {
    prompt: 'Dynamic tracking shot through a bustling modern city street...',
    dimensions: '1536x1152',
    duration: '5s',
    seed: 456
  }
];

const results = await Promise.all(
  scenes.map(scene => 
    executor.generateVideo({
      ...scene,
      negative_prompt: MoonvalleyMareyT2VExecutor.getDefaultNegativePrompt()
    })
  )
);
```

## Advanced Features

### Dimension Control

- **1920x1080**: Standard widescreen format, ideal for most content (default)
- **1152x1152**: Square format, perfect for social media and mobile
- **1536x1152**: Landscape format, great for cinematic content
- **1152x1536**: Portrait format, ideal for mobile-first content

### Duration Control

- **5 seconds**: Quick content, social media, testing concepts ($1.50)
- **10 seconds**: Extended content, storytelling, detailed scenes ($3.00)

### Seed Control

- **-1**: Random seed for each generation
- **0-999999**: Specific seeds for reproducible results
- **Default**: 9 for consistent starting point

### Negative Prompts

The model comes with a comprehensive default negative prompt to avoid common issues:
```
<synthetic> <scene cut> low-poly, flat shader, bad rigging, stiff animation, uncanny eyes, low-quality textures, looping glitch, cheap effect, overbloom, bloom spam, default lighting, game asset, stiff face, ugly specular, AI artifacts
```

## Troubleshooting

### Performance Issues

- **Slow Processing**: Use queue processing for longer content
- **Queue Delays**: Check queue status and use webhooks
- **Memory Issues**: Optimize prompt length and complexity

### Quality Issues

- **Poor Output**: Ensure prompt is at least 50 words and well-structured
- **Unexpected Content**: Use negative prompts to avoid unwanted features
- **Inconsistent Results**: Use specific seed values for reproducibility

### API Issues

- **Authentication Errors**: Check API key and permissions
- **Rate Limits**: Implement retry logic and respect limits
- **Parameter Validation**: Ensure all values are within valid ranges

## Commercial Use Benefits

### Licensing Advantages

- **Fully Licensed Data**: No copyright concerns for commercial projects
- **Commercial Safety**: Suitable for professional filmmaking and advertising
- **Industry Standards**: Meets professional content creation requirements
- **Brand Safety**: Ideal for brand storytelling and marketing campaigns

### Professional Applications

- **Advertising**: Commercial and marketing content
- **Film Production**: Professional filmmaking projects
- **Corporate Content**: Business and corporate communications
- **Brand Marketing**: Brand storytelling and campaigns
- **Entertainment**: Professional entertainment content

## Support and Resources

- **Documentation**: Complete API reference and examples
- **Example Prompt**: Detailed reference for prompt writing
- **Prompt Structure**: Recommended structure for optimal results
- **Best Practices**: Comprehensive guidelines for quality output
- **Community**: Professional filmmaker community and support

The Moonvalley Marey Text-to-Video model provides professional-grade video generation capabilities with commercial safety and cinematic quality. By following these guidelines and leveraging the advanced prompt structure, you can achieve excellent results for various professional, creative, and commercial applications while ensuring copyright compliance and high-quality output.
