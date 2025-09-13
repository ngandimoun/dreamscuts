# Veed Avatars Text-to-Video Usage Guide

## Overview

The **Veed Avatars Text-to-Video** model (`veed/avatars/text-to-video`) is a sophisticated AI-powered tool that generates high-quality, UGC-style avatar videos from text input. This model excels at creating professional videos featuring realistic avatars that speak your content with natural speech synthesis, making it perfect for business presentations, marketing content, educational materials, and social media.

## Key Features

- **UGC-Style Generation**: Create authentic, user-generated content style videos
- **Avatar Selection**: Choose from 30+ different avatar options
- **Multiple Orientations**: Support for vertical, horizontal, and side angles
- **Walking Animations**: Some avatars support dynamic walking animations
- **Professional Quality**: High-quality output suitable for business use
- **Natural Speech**: Advanced text-to-speech with natural delivery

## Model Information

- **Model ID**: `veed/avatars/text-to-video`
- **Provider**: Veed (via fal.ai)
- **Input Types**: Text + Avatar selection
- **Output Format**: MP4 video
- **Pricing**: $0.35 per minute

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
import { createVeedAvatarsTextToVideoExecutor } from './executors/veed-avatars-text-to-video';

const executor = createVeedAvatarsTextToVideoExecutor("YOUR_API_KEY");

const result = await executor.generateVideo({
  avatar_id: "emily_vertical_primary",
  text: "Welcome to our product demonstration. Today we'll show you how our innovative solution can transform your workflow."
});

console.log("Video URL:", result.video.url);
```

## Input Parameters

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `avatar_id` | enum | Avatar to use for video generation | `"emily_vertical_primary"` |
| `text` | string | Text content to convert to speech (max 5000 chars) | `"Welcome to our demonstration..."` |

### Avatar Options

The model supports 30+ different avatar options organized into categories:

#### Professional Avatars
- **Emily**: `emily_vertical_primary`, `emily_vertical_secondary`, `emily_primary`, `emily_side`
- **Marcus**: `marcus_vertical_primary`, `marcus_vertical_secondary`, `marcus_primary`, `marcus_side`
- **Elena**: `elena_vertical_primary`, `elena_vertical_secondary`, `elena_primary`, `elena_side`

#### Specialized Avatars
- **Mira**: `mira_vertical_primary`, `mira_vertical_secondary`
- **Jasmine**: `jasmine_vertical_primary`, `jasmine_vertical_secondary`, `jasmine_vertical_walking`
- **Aisha**: `aisha_vertical_walking`, `aisha_walking`

#### Generic Avatars
- **Generic Male**: `any_male_vertical_primary`, `any_male_vertical_secondary`, `any_male_primary`, `any_male_side`
- **Generic Female**: `any_female_vertical_primary`, `any_female_vertical_secondary`, `any_female_vertical_walking`, `any_female_primary`, `any_female_side`

## Avatar Selection Guide

### By Use Case

| Use Case | Recommended Avatars | Reasoning |
|----------|-------------------|-----------|
| Business Presentation | `emily_vertical_primary`, `marcus_vertical_primary` | Professional appearance, clear speech |
| Marketing Video | `jasmine_vertical_primary`, `aisha_vertical_walking` | Engaging, dynamic presentation |
| Educational Content | `elena_vertical_primary`, `marcus_vertical_primary` | Clear, articulate delivery |
| Social Media | `jasmine_vertical_walking`, `aisha_walking` | Dynamic, lifestyle-focused |
| Product Demo | `emily_vertical_primary`, `marcus_vertical_primary` | Professional, trustworthy appearance |
| Walking Content | `jasmine_vertical_walking`, `aisha_vertical_walking` | Natural movement, engaging delivery |

### By Orientation

| Orientation | Best For | Example Avatars |
|-------------|----------|-----------------|
| Vertical Primary | Mobile-first content, social media | `emily_vertical_primary`, `marcus_vertical_primary` |
| Vertical Secondary | Alternative angles, variety | `emily_vertical_secondary`, `marcus_vertical_secondary` |
| Primary | Traditional video content | `emily_primary`, `marcus_primary` |
| Side | Profile views, dynamic content | `emily_side`, `marcus_side` |

## Advanced Usage

### Queue Management for Long-Running Requests

```typescript
// Submit to queue
const { requestId } = await executor.queueVideoGeneration({
  avatar_id: "jasmine_vertical_walking",
  text: "Join us on this exciting journey as we explore the latest trends in technology...",
  webhookUrl: "https://your-webhook-url.com/callback"
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
    avatar_id: "emily_vertical_primary",
    text: "Welcome to our business presentation."
  },
  {
    avatar_id: "marcus_vertical_primary",
    text: "Today we'll discuss our quarterly results."
  },
  {
    avatar_id: "jasmine_vertical_walking",
    text: "Let's take a walk through our new product line."
  }
];

const results = await executor.generateMultipleVideos(inputs);
```

### Cost Calculation

```typescript
// Calculate cost for different durations
const cost1min = executor.calculateCost(1); // $0.35
const cost5min = executor.calculateCost(5); // $1.75

// Get cost comparison
const comparison = executor.getCostComparison();
console.log("Cost options:", comparison);
```

## Use Case Examples

### 1. Business Presentation

```typescript
const businessVideo = await executor.generateVideo({
  avatar_id: "emily_vertical_primary",
  text: "Good morning, everyone. Today I'm excited to present our Q4 results. We've achieved remarkable growth with a 25% increase in revenue and expanded our market presence to three new regions. Our team's dedication and innovative approach have been key to this success."
});
```

### 2. Marketing Campaign

```typescript
const marketingVideo = await executor.generateVideo({
  avatar_id: "jasmine_vertical_walking",
  text: "Ever wondered how to get that flawless glow? Introducing our new skincare line, designed for real life. Step one: Cleanse with our gentle, nourishing formula. Step two: Apply our hydrating serum for that dewy look. Step three: Lock it in with our lightweight moisturizer. Feel the difference with every application. See the glow? That's the magic of our skincare. Use code 'GLOW20' for an exclusive discount. Join the skincare revolution today!"
});
```

### 3. Educational Tutorial

```typescript
const tutorialVideo = await executor.generateVideo({
  avatar_id: "elena_vertical_primary",
  text: "Today we'll learn about the fundamentals of machine learning. Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed. We'll cover three main types: supervised learning, unsupervised learning, and reinforcement learning. Let's start with supervised learning, where we train our model using labeled data."
});
```

### 4. Social Media Content

```typescript
const socialVideo = await executor.generateVideo({
  avatar_id: "aisha_vertical_walking",
  text: "Hey there! I'm so excited to share this amazing new restaurant I discovered. The food is absolutely incredible, and the atmosphere is perfect for date night. You have to try their signature pasta dish - it's life-changing! Don't forget to follow for more food adventures and lifestyle tips. Drop a comment if you've been there or want to go!"
});
```

## Best Practices

### Avatar Selection
- Choose avatars that match your brand personality
- Consider your target audience and platform
- Use professional avatars for business content
- Select walking avatars for dynamic, engaging content
- Test different avatars to find the best fit

### Text Optimization
- Keep sentences clear and concise for better speech synthesis
- Use natural language that sounds conversational when spoken
- Break long text into shorter, digestible segments
- Include pauses and natural breaks for better pacing
- Use active voice and engaging language
- Consider the avatar's personality when writing text

### Content Planning
- Plan your text to optimize speech synthesis timing
- Consider breaking long content into multiple shorter videos
- Use appropriate avatars for your content type
- Test with shorter text before creating longer content
- Consider your target platform's video requirements

## Cost Optimization

### Pricing Structure
- **Base Cost**: $0.35 per minute
- **1 minute**: $0.35
- **2 minutes**: $0.70
- **5 minutes**: $1.75
- **10 minutes**: $3.50

### Cost-Saving Strategies
- Keep text concise to minimize duration
- Use shorter text for testing and prototyping
- Consider breaking long content into multiple videos
- Choose appropriate avatars to avoid regeneration
- Plan content to optimize speech synthesis timing

## Performance Optimization

### Text Length Guidelines
- **Optimal Range**: 100-500 words for most use cases
- **Short Content**: 50-100 words for quick announcements
- **Medium Content**: 100-300 words for product demos
- **Long Content**: 300-500 words for detailed explanations
- **Maximum**: 5000 characters

### Speech Synthesis Tips
- Use clear punctuation to guide speech patterns
- Include natural pauses with commas and periods
- Break complex sentences into simpler ones
- Use conversational language that flows naturally
- Consider speech timing when structuring content

## Troubleshooting

### Common Issues

1. **Avatar Selection Errors**
   - Ensure avatar ID is from the supported list
   - Check for typos in avatar names
   - Use the `getAvailableAvatars()` method to see all options

2. **Text Input Validation**
   - Keep text under 5000 characters
   - Ensure text is not empty or only whitespace
   - Use appropriate language and content

3. **Video Generation Issues**
   - Check API key configuration
   - Verify text content is appropriate
   - Monitor queue status for long-running requests

4. **Quality Issues**
   - Choose appropriate avatars for your content type
   - Optimize text for better speech synthesis
   - Consider using professional avatars for business content

### Performance Tips

- Use appropriate avatars for your content type
- Optimize text length for your use case
- Consider using walking animations for dynamic content
- Test different avatars to find the best fit
- Monitor costs with the per-minute billing model

## API Reference

### Methods

- `generateVideo(input)`: Generate video synchronously
- `queueVideoGeneration(input, webhookUrl)`: Submit to queue
- `checkQueueStatus(requestId)`: Check queue status
- `getQueueResult(requestId)`: Get queue result
- `generateMultipleVideos(inputs)`: Batch generation
- `calculateCost(durationMinutes)`: Cost calculation

### Helper Methods

- `getAvailableAvatars()`: List all avatar options
- `getAvatarCategories()`: Get organized avatar categories
- `getRecommendedAvatars(useCase)`: Get avatars for specific use cases
- `getAvatarDetails(avatarId)`: Get detailed avatar information
- `getModelInfo()`: Get model capabilities
- `getOptimalSettings(useCase)`: Get recommended settings
- `getCostComparison()`: Compare different durations
- `getTextOptimizationTips()`: Get text optimization advice

## Cost Examples

| Duration | Cost | Use Case | Content Length |
|----------|------|----------|----------------|
| 1 minute | $0.35 | Quick announcements, tips | 100-150 words |
| 2 minutes | $0.70 | Product demos, brief explanations | 200-300 words |
| 5 minutes | $1.75 | Detailed tutorials, comprehensive guides | 500-750 words |
| 10 minutes | $3.50 | Full presentations, extended content | 1000-1500 words |

## Support and Resources

- **Documentation**: [Veed Avatars Text-to-Video](https://fal.ai/models/veed/avatars/text-to-video)
- **API Reference**: [fal.ai Client Documentation](https://fal.ai/docs)
- **Examples**: [fal.ai Examples Repository](https://github.com/fal-ai/fal-ai-examples)
- **Community**: [fal.ai Discord](https://discord.gg/fal-ai)

## Conclusion

The Veed Avatars Text-to-Video model provides a powerful solution for creating high-quality, UGC-style avatar videos from text input. With its 30+ avatar options, multiple orientations, walking animations, and professional quality output, it's ideal for business presentations, marketing content, educational materials, and social media applications.

By following the best practices outlined in this guide and understanding the avatar selection options, you can create engaging, professional videos that effectively communicate your message while maintaining brand consistency and audience engagement.
