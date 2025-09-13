# EchoMimic V3 Talking Avatar Usage Guide

## Overview

The **EchoMimic V3 Talking Avatar** model (`fal-ai/echomimic-v3`) generates high-quality talking avatar videos from a picture, audio, and text prompt. It creates natural lip-sync, facial expressions, and body movements synchronized to audio input, making it perfect for corporate presentations, educational content, marketing videos, and more. The model costs $0.20 per generated second of video, based on the length of the input audio.

## Key Features

- **Talking Avatar Generation**: Create realistic talking avatars from static images
- **Natural Lip-Sync**: Audio-driven lip synchronization for realistic speech
- **Facial Animation**: Natural facial expressions and eye movements
- **Body Movement**: Controlled body language and gestures
- **Background Preservation**: Maintains original image background and lighting
- **Audio-Driven Video**: Video duration automatically matches audio length
- **High Quality Output**: Professional-grade talking avatar videos
- **Queue Support**: Handle long-running requests with webhook integration

## Input Parameters

### Required Parameters

- **`image_url`** (string): URL of the image to use as a reference for video generation
- **`audio_url`** (string): URL of the audio to use as a reference for video generation
- **`prompt`** (string): Text prompt describing desired movement, expressions, and behavior

### Optional Parameters

- **`negative_prompt`** (string): What to avoid in the generated video (default: "")
- **`num_frames_per_generation`** (1-200): Number of frames to generate at once (default: 121)
- **`guidance_scale`** (0-20): Controls adherence to the prompt (default: 4.5)
- **`audio_guidance_scale`** (0-20): Controls audio-visual synchronization (default: 2.5)
- **`seed`** (number): Random seed for reproducible results

## Pricing Structure

The model uses a **per-second pricing** system based on audio duration:

- **Base Rate**: $0.20 per second of video
- **Video Duration**: Automatically matches audio duration
- **Cost Calculation**: Audio length × $0.20

### Cost Examples

| Audio Duration | Video Length | Cost | Description |
|----------------|--------------|------|-------------|
| 5 seconds | 5 seconds | $1.00 | Short presentation or greeting |
| 10 seconds | 10 seconds | $2.00 | Brief product demo or announcement |
| 30 seconds | 30 seconds | $6.00 | Standard marketing message |
| 1 minute | 1 minute | $12.00 | Extended presentation or training |

## Usage Examples

### Basic Talking Avatar Generation

```typescript
import { FalAiEchoMimicV3Executor } from './executors/fal-ai-echomimic-v3';

const executor = new FalAiEchoMimicV3Executor();

const result = await executor.generateTalkingAvatar({
  image_url: 'https://storage.googleapis.com/falserverless/example_inputs/echo-mimic-input-image.png',
  audio_url: 'https://storage.googleapis.com/falserverless/example_inputs/echo-mimic-input-audio.mp3',
  prompt: 'A person is in a relaxed pose. As the video progresses, the character speaks while arm and body movements are minimal and consistent with a natural speaking posture. Hand movements remain minimal. Don\'t blink too often. Preserve background integrity matching the reference image\'s spatial configuration, lighting conditions, and color temperature.',
  num_frames_per_generation: 121,
  guidance_scale: 4.5,
  audio_guidance_scale: 2.5
});
```

### Queue-Based Processing for Longer Content

```typescript
// Submit to queue for longer audio files
const { request_id } = await executor.submitToQueue({
  image_url: 'https://example.com/instructor.jpg',
  audio_url: 'https://example.com/lesson.mp3',
  prompt: 'A professional instructor in a teaching pose. The character maintains an engaging, approachable expression while speaking. Use natural hand gestures to emphasize key points. Maintain eye contact with the camera. Keep movements purposeful and educational. Preserve the classroom background and lighting.',
  num_frames_per_generation: 100,
  guidance_scale: 4.0,
  audio_guidance_scale: 3.0
});

// Check status
const status = await FalAiEchoMimicV3Executor.checkQueueStatus(request_id);

// Get result when complete
if (status.status === 'completed') {
  const result = await FalAiEchoMimicV3Executor.getQueueResult(request_id);
}
```

### Cost Calculation

```typescript
// Calculate cost based on audio duration
const audioDurationSeconds = 30; // 30 seconds
const cost = executor.calculateCost(audioDurationSeconds); // $6.00

// Get cost examples for different scenarios
const examples = executor.getCostExamples();
```

## Best Practices

### Image Preparation

1. **High Quality**: Use clear, high-resolution portrait images
2. **Good Lighting**: Ensure proper contrast and visibility
3. **Neutral Expression**: Choose images with natural, approachable expressions
4. **Clear Background**: Use images with clean, professional backgrounds
5. **Appropriate Aspect Ratio**: Consider your final video dimensions
6. **Public Access**: Ensure images are publicly accessible via URL

### Audio Preparation

1. **Clear Speech**: Use well-articulated, clear audio content
2. **Good Quality**: Avoid background noise and distortion
3. **Appropriate Length**: Consider cost implications of longer audio
4. **Professional Tone**: Match audio style to your use case
5. **Format Support**: Use supported formats (mp3, ogg, wav, m4a, aac)

### Prompt Writing

1. **Be Specific**: Describe desired pose, movement, and expressions clearly
2. **Movement Control**: Specify hand gestures, body language, and facial expressions
3. **Background Preservation**: Include requirements for maintaining background integrity
4. **Natural Behavior**: Describe natural speaking postures and movements
5. **Use the Example**: Reference the provided example prompt for structure

### Parameter Optimization

1. **Frame Count**: Use 100-121 frames for balanced quality and speed
2. **Guidance Scale**: Balance between 3.5-4.5 for natural movement
3. **Audio Guidance**: Use 2.0-3.0 for optimal lip-sync accuracy
4. **Seed Values**: Use specific seeds for reproducible results during development

## Common Use Cases

### Corporate and Business
- **Presentations**: Create talking avatar presenters for corporate meetings
- **Training Videos**: Develop educational content with virtual instructors
- **Marketing**: Generate spokesperson avatars for advertising campaigns
- **Customer Service**: Create support videos with talking representatives
- **Product Demos**: Develop demonstration videos with virtual hosts

### Education and Training
- **Online Courses**: Create engaging virtual instructors
- **Tutorial Videos**: Develop step-by-step guidance videos
- **Language Learning**: Generate pronunciation and conversation videos
- **Professional Development**: Create training content for employees
- **Accessibility**: Develop content with sign language or clear speech

### Entertainment and Media
- **Social Media**: Create engaging talking avatar content
- **News Delivery**: Generate virtual news presenters
- **Storytelling**: Create narrative content with virtual characters
- **Virtual Events**: Develop presenter avatars for webinars
- **Brand Communication**: Create consistent brand messaging

## Technical Considerations

### Processing Time
- Higher frame counts increase processing time
- Longer audio files require more processing time
- Queue processing recommended for content over 30 seconds
- Real-time monitoring available during generation

### Quality Factors
- Image quality directly impacts final video quality
- Audio clarity affects lip-sync accuracy
- Guidance scales control movement naturalness
- Frame count affects visual smoothness

### Cost Optimization
- Use shorter audio for cost-effective testing
- Optimize frame counts for your quality requirements
- Consider queue processing for longer content
- Balance quality and cost based on use case

## Error Handling

The executor provides comprehensive error handling with specific error codes:

- `GENERATION_FAILED`: Talking avatar generation process failed
- `QUEUE_SUBMIT_FAILED`: Failed to submit to processing queue
- `STATUS_CHECK_FAILED`: Failed to check queue status
- `RESULT_FETCH_FAILED`: Failed to retrieve queue result

### Common Issues and Solutions

1. **Generation Fails**: Check image and audio URL accessibility
2. **Poor Lip-Sync**: Increase audio guidance scale for better synchronization
3. **Rigid Movement**: Decrease guidance scale for more natural movement
4. **Background Changes**: Be more specific about background preservation in prompts
5. **Slow Processing**: Reduce frame count or use queue processing

## Integration Examples

### Real-time Processing

```typescript
const result = await fal.subscribe('fal-ai/echomimic-v3', {
  input: {
    image_url: 'https://example.com/spokesperson.jpg',
    audio_url: 'https://example.com/advertisement.mp3',
    prompt: 'A confident business person in a professional setting. The character speaks with enthusiasm and conviction. Use subtle hand gestures to emphasize key messages. Maintain a warm, trustworthy expression. Keep movements polished and professional. Preserve the corporate background and branding elements.',
    num_frames_per_generation: 150,
    guidance_scale: 5.0,
    audio_guidance_scale: 2.5
  },
  pollInterval: 1000,
  onResult: (result) => console.log('Complete:', result),
  onError: (error) => console.error('Error:', error)
});
```

### Batch Processing

```typescript
const presentations = [
  {
    image: 'https://example.com/presenter1.jpg',
    audio: 'https://example.com/slide1.mp3',
    prompt: 'Professional presenter with minimal movement, natural speaking posture'
  },
  {
    image: 'https://example.com/presenter2.jpg',
    audio: 'https://example.com/slide2.mp3',
    prompt: 'Engaging instructor with natural hand gestures and expressions'
  }
];

const results = await Promise.all(
  presentations.map(presentation => 
    executor.generateTalkingAvatar({
      image_url: presentation.image,
      audio_url: presentation.audio,
      prompt: presentation.prompt,
      num_frames_per_generation: 121,
      guidance_scale: 4.5,
      audio_guidance_scale: 2.5
    })
  )
);
```

## Advanced Features

### Guidance Scale Control

- **2.0-3.0**: Lower adherence to prompt, more natural movement
- **3.5-4.5**: Balanced adherence and natural movement (recommended)
- **5.0-6.0**: Higher adherence to prompt, more controlled movement
- **6.0+**: Very strict adherence to prompt, minimal variation

### Audio Guidance Scale Control

- **1.0-2.0**: Lower audio influence, more visual freedom
- **2.0-3.0**: Balanced audio and visual influence (recommended)
- **3.0-4.0**: Higher audio influence, more lip-sync accuracy
- **4.0+**: Very strict audio-visual synchronization

### Frame Generation Control

- **60-80**: Faster generation, lower quality
- **100-121**: Balanced quality and speed (recommended)
- **150-180**: Higher quality, slower generation
- **180+**: Maximum quality, slowest generation

## Troubleshooting

### Performance Issues

- **Slow Processing**: Reduce frame count or use queue processing
- **Queue Delays**: Check queue status and use webhooks
- **Memory Issues**: Use lower frame counts for testing

### Quality Issues

- **Poor Lip-Sync**: Increase audio guidance scale
- **Rigid Movement**: Decrease guidance scale
- **Background Changes**: Improve prompt specificity for background preservation

### API Issues

- **Authentication Errors**: Check API key and permissions
- **Rate Limits**: Implement retry logic and respect limits
- **Parameter Validation**: Ensure all values are within valid ranges

## Support and Resources

- **Documentation**: Complete API reference and examples
- **Example Prompt**: Detailed reference for prompt writing
- **Supported Formats**: Comprehensive list of image and audio formats
- **Community**: Active user community and support forums

The EchoMimic V3 Talking Avatar model provides professional-grade talking avatar generation capabilities with natural lip-sync and movement. By following these guidelines and leveraging the advanced parameter controls, you can achieve excellent results for various business, educational, and entertainment applications while optimizing costs and processing time.
