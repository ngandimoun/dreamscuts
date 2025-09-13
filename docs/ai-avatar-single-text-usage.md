# AI Avatar Single Text Usage Guide

## Overview

The **AI Avatar Single Text** model is a powerful tool for generating talking avatar videos from images and text using fal.ai's MultiTalk technology. This model automatically converts text to speech and generates realistic lip-sync animations, making it ideal for content creation, social media, educational videos, and professional presentations.

## Key Features

- **Talking Avatar Generation**: Create realistic talking head videos from any image
- **Automatic Text-to-Speech**: Built-in voice synthesis with 20 different voice options
- **Lip-Sync Generation**: Advanced AI-powered mouth movement synchronization
- **Flexible Resolution**: Choose between 480p (cost-effective) and 720p (high-quality)
- **Voice Selection**: 20 distinct voices for different use cases and audiences
- **Cost-Effective Pricing**: $0.30 per second with resolution multipliers
- **Queue Support**: Asynchronous processing for longer videos
- **Real-time Progress Monitoring**: Track generation progress with detailed logs

## Basic Usage

### Simple Avatar Generation

```typescript
import { AiAvatarSingleTextExecutor } from './executors/ai-avatar-single-text';

const executor = new AiAvatarSingleTextExecutor();

const result = await executor.generateAvatar({
  image_url: "https://example.com/person.jpg",
  text_input: "Hello, welcome to our presentation!",
  voice: "Sarah",
  prompt: "A professional woman speaking to camera"
});

console.log('Generated avatar video URL:', result.video.url);
console.log('Seed used:', result.seed);
```

### With Custom Parameters

```typescript
const result = await executor.generateAvatar({
  image_url: "https://example.com/speaker.jpg",
  text_input: "Today we'll discuss the future of AI technology.",
  voice: "Roger",
  prompt: "Professional speaker giving a presentation",
  num_frames: 129,
  resolution: "720p",
  seed: 12345,
  acceleration: "regular"
});
```

### With Queue Processing

For longer videos or when you need to handle multiple requests:

```typescript
// Submit to queue
const { requestId } = await executor.submitToQueue({
  image_url: "https://example.com/avatar.jpg",
  text_input: "This is a longer presentation that will take time to generate.",
  voice: "Charlotte",
  prompt: "Professional presenter speaking to camera",
  num_frames: 129,
  resolution: "720p"
});

// Check status
const status = await executor.checkStatus(requestId);
console.log('Status:', status.status);

// Get result when complete
if (status.status === 'COMPLETED') {
  const result = await executor.getResult(requestId);
  console.log('Video URL:', result.video.url);
}
```

## Input Parameters

### Required Parameters

- **`image_url`** (string): URL of the input image file
- **`text_input`** (string): The text content for the avatar to speak
- **`voice`** (VoiceEnum): The voice to use for speech generation
- **`prompt`** (string): Text description to guide video generation

### Optional Parameters

- **`num_frames`** (number): Number of frames (81-129, default: 136)
- **`resolution`** (ResolutionEnum): Output resolution (480p or 720p, default: 480p)
- **`seed`** (number): Random seed for reproducibility (0-999999, default: 42)
- **`acceleration`** (AccelerationEnum): Generation speed (none/regular/high, default: regular)

### Input Requirements

- **Image**: Should contain clear facial features for optimal results
- **Text**: Clear, well-written content for natural speech
- **URLs**: Must be publicly accessible and valid URLs
- **Formats**: Supports common image formats (JPG, PNG, WebP, etc.)

## Voice Selection

### Available Voices (20 Options)

The model provides 20 different voice options:

- **Professional**: Sarah, Roger, Charlotte, George
- **Casual**: Alice, Liam, Jessica, Chris
- **Friendly**: Laura, Charlie, Matilda, Will
- **Authoritative**: Bill, Eric, Daniel, Aria
- **Youthful**: Lily, River, Callum, Alice

### Voice Recommendations

```typescript
// Get voice recommendations for specific use cases
const professionalVoices = executor.getVoiceRecommendations('professional');
const casualVoices = executor.getVoiceRecommendations('casual');
const friendlyVoices = executor.getVoiceRecommendations('friendly');

// Get all available voices
const allVoices = executor.getAvailableVoices();
```

### Voice Selection Tips

- **Professional Content**: Use Sarah, Roger, Charlotte, or George
- **Social Media**: Use Alice, Liam, Jessica, or Chris for friendly tone
- **Educational**: Use Laura, Charlie, or Matilda for approachable feel
- **Business**: Use Bill, Eric, or Daniel for authoritative presence
- **Youth Content**: Use Lily, River, or Callum for younger audience

## Advanced Usage

### Cost Estimation

Estimate costs before processing:

```typescript
// Estimate cost for a 3-second video at 480p
const estimatedCost = executor.calculateCost(3, '480p');
console.log(`Estimated cost: $${estimatedCost.toFixed(2)}`);

// Estimate cost for a 4-second video at 720p
const highQualityCost = executor.calculateCost(4, '720p');
console.log(`High quality cost: $${highQualityCost.toFixed(2)}`);
```

### Optimal Settings for Different Use Cases

```typescript
// Get optimal settings for social media
const socialMediaSettings = executor.getOptimalSettings('social_media');
// Returns: { num_frames: 81, resolution: '480p', acceleration: 'high' }

// Get optimal settings for professional use
const professionalSettings = executor.getOptimalSettings('professional');
// Returns: { num_frames: 136, resolution: '720p', acceleration: 'regular' }

// Get optimal settings for quick demos
const quickDemoSettings = executor.getOptimalSettings('quick_demo');
// Returns: { num_frames: 81, resolution: '480p', acceleration: 'high' }
```

### Input Validation

Validate inputs before processing:

```typescript
const validation = executor.validateInput({
  image_url: "https://example.com/person.jpg",
  text_input: "Hello world!",
  voice: "Sarah",
  prompt: "Person speaking to camera"
});

if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
  // Handle errors appropriately
} else {
  // Proceed with generation
  const result = await executor.generateAvatar({
    image_url: "https://example.com/person.jpg",
    text_input: "Hello world!",
    voice: "Sarah",
    prompt: "Person speaking to camera"
  });
}
```

## Use Case Examples

### 1. Social Media Content

Create engaging social media posts with talking avatars:

```typescript
const socialMediaContent = await executor.generateAvatar({
  image_url: "https://example.com/avatar.jpg",
  text_input: "Check out our latest product! It's amazing!",
  voice: "Alice",
  prompt: "Friendly person promoting a product",
  resolution: "480p",
  acceleration: "high"
});
```

### 2. Educational Videos

Create educational content with professional narration:

```typescript
const educationalVideo = await executor.generateAvatar({
  image_url: "https://example.com/teacher.jpg",
  text_input: "Today we'll learn about the fundamentals of machine learning.",
  voice: "Charlotte",
  prompt: "Professional teacher explaining a concept",
  resolution: "720p",
  acceleration: "regular"
});
```

### 3. Marketing Presentations

Create marketing videos with engaging speakers:

```typescript
const marketingVideo = await executor.generateAvatar({
  image_url: "https://example.com/speaker.jpg",
  text_input: "Our solution transforms how businesses operate.",
  voice: "Roger",
  prompt: "Confident business person presenting a solution",
  resolution: "720p",
  acceleration: "regular"
});
```

### 4. Personal Branding

Create personal brand content with consistent avatars:

```typescript
const personalBrand = await executor.generateAvatar({
  image_url: "https://example.com/me.jpg",
  text_input: "Welcome to my channel where I share insights about AI.",
  voice: "Liam",
  prompt: "Friendly creator introducing their content",
  resolution: "480p",
  acceleration: "high"
});
```

## Best Practices

### Image Quality

- Use high-resolution images with clear facial features
- Ensure good lighting and minimal background noise
- Use images with clear, unobstructed faces
- Avoid images with multiple people (use single-person images)

### Text Content

- Write clear, natural-sounding text
- Keep sentences concise and engaging
- Use appropriate tone for your target audience
- Avoid overly complex or technical language unless necessary

### Voice Selection

- Match voice characteristics to your content and audience
- Test different voices for the same content
- Consider cultural and demographic factors
- Use consistent voices for brand consistency

### Resolution and Performance

- Use 480p for social media and cost-effective content
- Use 720p for professional presentations and high-quality content
- Choose acceleration based on urgency vs. quality needs
- Consider frame count for optimal video duration

### Cost Optimization

- Use 480p resolution for most content
- Keep frame count at 81 for shorter videos
- Use high acceleration for quick demos
- Batch process multiple videos when possible

## Error Handling

### Input Validation Errors

```typescript
try {
  const validation = executor.validateInput({
    image_url: "invalid-url",
    text_input: "",
    voice: "InvalidVoice",
    prompt: ""
  });

  if (!validation.isValid) {
    console.error('Validation errors:', validation.errors);
    // Handle validation errors
  }
} catch (error) {
  console.error('Validation failed:', error);
}
```

### Generation Errors

```typescript
try {
  const result = await executor.generateAvatar({
    image_url: "https://example.com/person.jpg",
    text_input: "Hello world!",
    voice: "Sarah",
    prompt: "Person speaking to camera"
  });
} catch (error) {
  console.error('Avatar generation failed:', error.error);
  if (error.details) {
    console.error('Details:', error.details);
  }
}
```

### Queue Status Errors

```typescript
try {
  const status = await executor.checkStatus(requestId);
  console.log('Status:', status.status);
} catch (error) {
  console.error('Status check failed:', error.error);
}
```

## Troubleshooting

### Common Issues

1. **Invalid Image URLs**
   - Ensure URLs are publicly accessible
   - Check for CORS restrictions
   - Verify file formats are supported
   - Test URLs in a browser

2. **Poor Avatar Quality**
   - Use images with clear facial features
   - Ensure good lighting conditions
   - Avoid background noise in images
   - Use high-quality source images

3. **Generation Failures**
   - Check input validation results
   - Verify image accessibility
   - Ensure proper file formats
   - Monitor generation logs

4. **Cost Issues**
   - Calculate costs before processing
   - Use 480p for cost-effective content
   - Monitor frame count settings
   - Consider acceleration options

### Performance Tips

- Use appropriate resolution for your needs
- Choose optimal frame counts for duration
- Use acceleration settings based on urgency
- Monitor generation progress with logs
- Handle errors gracefully with retry logic

## API Reference

### Class: AiAvatarSingleTextExecutor

#### Methods

- **`generateAvatar(input)`**: Generate avatar synchronously
- **`submitToQueue(input)`**: Submit to queue for async processing
- **`checkStatus(requestId)`**: Check queue status
- **`getResult(requestId)`**: Get completed result
- **`calculateCost(durationSeconds, resolution)`**: Estimate generation cost
- **`validateInput(input)`**: Validate input parameters
- **`getAvailableVoices()`**: Get all available voice options
- **`getVoiceRecommendations(useCase)`**: Get voice recommendations
- **`getOptimalSettings(useCase)`**: Get optimal settings for use cases

#### Properties

- **`modelEndpoint`**: The AI Avatar Single Text model endpoint

### Input Interface: AiAvatarSingleTextInput

- **`image_url`**: URL of the input image file
- **`text_input`**: Text content for the avatar to speak
- **`voice`**: Voice selection from available options
- **`prompt`**: Text description to guide generation
- **`num_frames`**: Number of frames (81-129)
- **`resolution`**: Output resolution (480p or 720p)
- **`seed`**: Random seed for reproducibility
- **`acceleration`**: Generation speed setting

### Output Interface: AiAvatarSingleTextOutput

- **`video`**: Object containing video URL and metadata
  - **`url`**: Download URL for the generated video
  - **`content_type`**: MIME type of the video file
  - **`file_name`**: Name of the generated file
  - **`file_size`**: Size of the file in bytes
- **`seed`**: The seed used for generation

## Cost Structure

The model uses a **per-second pricing model** with multipliers:

- **Base cost per second**: $0.30
- **720p resolution multiplier**: 2.0x (doubles the cost)
- **Frames over 81 multiplier**: 1.25x (for longer videos)
- **No setup fees or additional charges**

### Example Calculations

- **3-second 480p video**: $0.90
- **3-second 720p video**: $1.80
- **4-second 480p video with 129 frames**: $1.50 (includes 1.25x multiplier)
- **4-second 720p video with 129 frames**: $3.00 (includes both multipliers)

## Conclusion

The AI Avatar Single Text model offers powerful capabilities for creating engaging talking avatar videos. By understanding the input requirements, optimizing voice selection, and managing costs effectively, you can create professional avatar content for various applications including social media, education, marketing, and personal branding.

For more information about fal.ai's platform and available models, visit the [fal.ai documentation](https://fal.ai/docs).
