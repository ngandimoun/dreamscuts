# AI Avatar Multi-Text Usage Guide

## Overview

The **AI Avatar Multi-Text** model (`fal-ai/ai-avatar/multi-text`) is a sophisticated AI-powered tool that generates realistic multi-person conversation videos from static images and text inputs. This model excels at creating engaging conversation scenes by converting text to speech for each person, generating natural lip-sync, facial expressions, and body language.

## Key Features

- **Multi-Person Support**: Generate conversations between multiple people in a single image
- **Text-to-Speech Integration**: 20 different voice options for natural conversation variety
- **Image-Based Generation**: Use any image as the foundation for video creation
- **Flexible Duration**: Control video length with frame counts from 81-129 frames
- **Quality Options**: Choose between 480p and 720p output resolution
- **Acceleration Control**: Configurable speed vs. quality trade-offs

## Model Information

- **Model ID**: `fal-ai/ai-avatar/multi-text`
- **Provider**: fal.ai
- **Input Types**: Image URL + Text inputs
- **Output Format**: MP4 video
- **Pricing**: $0.3 per second with 1.25x billing for frames > 81

## Basic Usage

### Installation

```bash
npm install --save @fal-ai/client
```

### Setup

```typescript
import { fal } from "@fal-ai/client";

// Set your API key
fal.config({
  credentials: "YOUR_FAL_KEY"
});
```

### Simple Example

```typescript
import { createAiAvatarMultiTextExecutor } from './executors/ai-avatar-multi-text';

const executor = createAiAvatarMultiTextExecutor("YOUR_API_KEY");

const result = await executor.generateVideo({
  image_url: "https://example.com/conversation-image.png",
  first_text_input: "Hello, how are you today?",
  second_text_input: "I'm doing great, thanks for asking!",
  prompt: "Two friends having a casual conversation"
});

console.log("Video URL:", result.video.url);
```

## Input Parameters

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `image_url` | string | URL of the input image | `"https://example.com/image.png"` |
| `first_text_input` | string | First person's dialogue (max 500 chars) | `"Do you know what we're eating?"` |
| `second_text_input` | string | Second person's dialogue (max 500 chars) | `"I think it's called milky pie."` |
| `prompt` | string | Scene description (max 1000 chars) | `"Two kids talking at lunch"` |

### Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `voice1` | enum | `"Sarah"` | First person's voice |
| `voice2` | enum | `"Roger"` | Second person's voice |
| `num_frames` | integer | `191` | Video length (81-129) |
| `resolution` | enum | `"480p"` | Output quality |
| `seed` | integer | `81` | Random seed for reproducibility |
| `acceleration` | enum | `"regular"` | Processing speed |

## Voice Options

The model supports 20 different voice options:

**Professional Voices**: Sarah, Roger, Laura, George, Chris, Brian, Daniel, Bill
**Casual Voices**: Charlie, Lily, Alice, Matilda, Will, Jessica, Eric
**Dynamic Voices**: Aria, River, Liam, Charlotte, Callum

### Recommended Voice Combinations

| Scenario | Voice 1 | Voice 2 | Reasoning |
|----------|---------|---------|-----------|
| Business Meeting | Sarah | Roger | Clear, professional |
| Casual Chat | Charlie | Lily | Friendly, approachable |
| Educational | Laura | George | Articulate, clear |
| Entertainment | Aria | River | Dynamic, engaging |

## Frame Count and Duration

| Frames | Duration | Cost | Billing Multiplier |
|--------|----------|------|-------------------|
| 81 | ~2.7s | $0.81 | 1.0x |
| 105 | ~3.5s | $1.05 | 1.0x |
| 129 | ~4.3s | $1.61 | 1.25x |
| 191 | ~6.4s | $2.39 | 1.25x |

**Note**: Frame counts above 81 incur a 1.25x billing multiplier.

## Advanced Usage

### Queue Management for Long-Running Requests

```typescript
// Submit to queue
const { requestId } = await executor.queueVideoGeneration({
  image_url: "https://example.com/image.png",
  first_text_input: "What do you think about this project?",
  second_text_input: "I think it has great potential!",
  prompt: "Two professionals discussing a business proposal",
  num_frames: 129,
  resolution: "720p"
});

// Check status
const status = await executor.checkQueueStatus(requestId);
console.log("Status:", status.status);

// Get result when complete
const result = await executor.getQueueResult(requestId);
```

### Batch Generation

```typescript
const inputs = [
  {
    image_url: "https://example.com/image1.png",
    first_text_input: "Hello there!",
    second_text_input: "Hi! How are you?",
    prompt: "Friendly greeting"
  },
  {
    image_url: "https://example.com/image2.png",
    first_text_input: "What's new?",
    second_text_input: "Not much, just working.",
    prompt: "Casual conversation"
  }
];

const results = await executor.generateMultipleVideos(inputs);
```

### Cost Calculation

```typescript
// Calculate cost for different configurations
const cost81 = executor.calculateCost(81, "480p"); // $0.81
const cost129 = executor.calculateCost(129, "720p"); // $1.61

// Get cost comparison
const comparison = executor.getCostComparison();
console.log("Cost options:", comparison);
```

## Use Case Examples

### 1. Educational Content

```typescript
const educationalVideo = await executor.generateVideo({
  image_url: "https://example.com/teachers.png",
  first_text_input: "Today we'll learn about photosynthesis.",
  second_text_input: "That sounds interesting! How does it work?",
  prompt: "Two teachers discussing a science lesson",
  voice1: "Laura",
  voice2: "George",
  num_frames: 105,
  resolution: "480p"
});
```

### 2. Business Presentation

```typescript
const businessVideo = await executor.generateVideo({
  image_url: "https://example.com/meeting.png",
  first_text_input: "Our Q4 results look promising.",
  second_text_input: "Yes, we've exceeded our targets by 15%.",
  prompt: "Two executives reviewing quarterly performance",
  voice1: "Sarah",
  voice2: "Roger",
  num_frames: 129,
  resolution: "720p"
});
```

### 3. Social Media Content

```typescript
const socialVideo = await executor.generateVideo({
  image_url: "https://example.com/friends.png",
  first_text_input: "This new restaurant is amazing!",
  second_text_input: "I know, right? The food is incredible!",
  prompt: "Two friends excited about a new restaurant",
  voice1: "Charlie",
  voice2: "Lily",
  num_frames: 81,
  resolution: "480p"
});
```

## Best Practices

### Image Selection
- Use high-quality, clear images with good lighting
- Ensure faces are clearly visible
- Choose images with appropriate aspect ratios
- Avoid images with too many people (2-3 people work best)

### Text Input
- Keep dialogue natural and conversational
- Use appropriate language for your target audience
- Keep each text input under 500 characters
- Provide clear, descriptive prompts

### Cost Optimization
- Start with 81 frames for testing
- Use 480p resolution for most use cases
- Reserve higher frame counts for premium content
- Consider acceleration settings for faster processing

### Voice Selection
- Match voices to your content type
- Use different voices for different speakers
- Consider your target audience
- Test voice combinations before finalizing

## Error Handling

```typescript
try {
  const result = await executor.generateVideo(input);
  console.log("Success:", result.video.url);
} catch (error) {
  if (error.message.includes("Image URL is required")) {
    console.error("Please provide a valid image URL");
  } else if (error.message.includes("Text input")) {
    console.error("Please provide both text inputs");
  } else if (error.message.includes("Number of frames")) {
    console.error("Frame count must be between 81-129");
  } else {
    console.error("Generation failed:", error.message);
  }
}
```

## Performance Optimization

### Acceleration Settings

| Setting | Speed | Quality | Use Case |
|---------|-------|---------|----------|
| `none` | Slowest | Highest | Premium content, final production |
| `regular` | Balanced | High | Most use cases, good balance |
| `high` | Fastest | Good | Rapid prototyping, time-sensitive content |

### Resolution Selection

| Resolution | Quality | Cost | Use Case |
|------------|---------|------|----------|
| `480p` | Good | Lower | Web content, social media, testing |
| `720p` | High | Same | Premium content, presentations, final output |

## Troubleshooting

### Common Issues

1. **Image Loading Errors**
   - Ensure image URL is publicly accessible
   - Check image format (PNG, JPG, JPEG)
   - Verify image size and dimensions

2. **Text Input Validation**
   - Keep text inputs under 500 characters
   - Ensure both text inputs are provided
   - Use appropriate language and content

3. **Frame Count Issues**
   - Frame count must be between 81-129
   - Higher frame counts increase cost (1.25x multiplier)
   - Consider your budget and quality needs

4. **Processing Time**
   - Use acceleration settings for faster processing
   - Higher resolution may increase processing time
   - Queue system available for long-running requests

### Performance Tips

- Use 480p resolution for cost-effective content
- Start with 81 frames for testing and prototyping
- Use acceleration settings based on your time requirements
- Batch generate multiple videos at lower frame counts
- Monitor costs with the billing multiplier for frames > 81

## API Reference

### Methods

- `generateVideo(input)`: Generate video synchronously
- `queueVideoGeneration(input, webhookUrl)`: Submit to queue
- `checkQueueStatus(requestId)`: Check queue status
- `getQueueResult(requestId)`: Get queue result
- `generateMultipleVideos(inputs)`: Batch generation
- `calculateCost(frames, resolution)`: Cost calculation

### Helper Methods

- `getAvailableVoices()`: List all voice options
- `getAvailableResolutions()`: List resolution options
- `getAvailableAccelerationOptions()`: List acceleration options
- `getAvailableFrameRange()`: Get frame count range
- `getModelInfo()`: Get model capabilities
- `getOptimalSettings(useCase)`: Get recommended settings
- `getCostComparison()`: Compare different configurations
- `getRecommendedVoiceCombinations()`: Get voice pairing suggestions

## Cost Examples

| Configuration | Frames | Resolution | Duration | Cost |
|---------------|--------|------------|----------|------|
| Basic | 81 | 480p | 2.7s | $0.81 |
| Standard | 105 | 480p | 3.5s | $1.05 |
| Extended | 129 | 480p | 4.3s | $1.61 |
| Premium | 129 | 720p | 4.3s | $1.61 |
| Long | 191 | 480p | 6.4s | $2.39 |

## Support and Resources

- **Documentation**: [fal.ai AI Avatar Multi-Text](https://fal.ai/models/ai-avatar/multi-text)
- **API Reference**: [fal.ai Client Documentation](https://fal.ai/docs)
- **Examples**: [fal.ai Examples Repository](https://github.com/fal-ai/fal-ai-examples)
- **Community**: [fal.ai Discord](https://discord.gg/fal-ai)

## Conclusion

The AI Avatar Multi-Text model provides a powerful solution for creating engaging, multi-person conversation videos from static images and text inputs. With its 20 voice options, flexible frame counts, and quality settings, it's ideal for educational content, business presentations, social media, and entertainment applications.

By following the best practices outlined in this guide and understanding the cost structure, you can create high-quality conversation videos efficiently and cost-effectively.
