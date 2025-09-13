# Wan Effects - Usage Guide

## Overview

The Wan Effects model is a special effects video generator that applies popular effects to images, creating engaging videos with predefined effect templates. This model transforms static images into dynamic videos with various visual effects like cakeify, squish, muscle, inflate, crush, rotate, and many more creative transformations.

## Model Information

- **Name**: Wan Effects
- **Version**: v1.0
- **Provider**: fal-ai
- **Model ID**: `fal-ai/wan-effects`
- **Type**: Video Generation (Effects Application)
- **Quality Tier**: Standard

## Key Features

- **40+ Effect Types**: Wide variety of predefined effects for different use cases
- **Affordable Pricing**: Only $0.35 per video
- **Customizable Parameters**: Control frames, FPS, aspect ratio, and effect intensity
- **Seed Control**: Reproducible results with seed parameter
- **Turbo Mode**: Faster generation when quality is not critical
- **LoRA Scaling**: Adjust effect intensity with lora_scale parameter

## Pricing

- **Cost per video**: $0.35
- **All effects included**: No additional charges for different effect types
- **Quality**: Standard tier output
- **Billing**: Per video (no additional charges)

## Installation

1. Install the FAL AI client:
```bash
npm install --save @fal-ai/client
```

2. Set your API key:
```bash
export FAL_KEY="YOUR_API_KEY"
```

3. Import the executor:
```typescript
import { createWanEffectsExecutor } from './executors/wan-effects';
```

## Basic Usage

### Simple Effect Application

```typescript
import { createWanEffectsExecutor } from './executors/wan-effects';

const executor = createWanEffectsExecutor(process.env.FAL_KEY);

const result = await executor.generateEffectsVideo({
  subject: "a cute kitten",
  image_url: "https://example.com/cat.jpg"
});

console.log(result.video.url);
```

### Advanced Configuration with Custom Effects

```typescript
const result = await executor.generateEffectsVideo({
  subject: "a superhero character",
  image_url: "https://example.com/hero.jpg",
  effect_type: "hulk",
  num_frames: 81,
  frames_per_second: 16,
  aspect_ratio: "16:9",
  lora_scale: 1.2,
  turbo_mode: false
});
```

## Available Effect Types

The model supports 40+ different effects organized by category:

### **Transformation Effects**
- `squish`, `muscle`, `inflate`, `crush`, `deflate`
- `hulk`, `baby`, `bride`, `classy`

### **Character Effects**
- `puppy`, `snow-white`, `disney-princess`
- `pirate-captain`, `princess`, `samurai`, `vip`, `warrior`
- `assassin`, `robot-face-reveal`, `super-saiyan`

### **Action Effects**
- `rotate`, `gun-shooting`, `timelapse`, `tsunami`, `fire`
- `zoom-call`, `doom-fps`, `fus-ro-dah`, `hug-jesus`

### **Emotional Effects**
- `jumpscare`, `laughing`, `crying`, `kissing`, `angry-face`
- `cartoon-jaw-drop`

### **Style Effects**
- `mona-lisa`, `painting`, `animeify`, `blast`
- `selfie-younger-self`

### **Environment Effects**
- `jungle`, `zen`

## Asynchronous Processing

For long-running requests, use the queue system:

```typescript
// Submit to queue
const { requestId } = await executor.queueEffectsVideoGeneration({
  subject: "a magical creature",
  image_url: "https://example.com/creature.jpg",
  effect_type: "disney-princess"
});

// Check status
const status = await executor.checkQueueStatus(requestId);

// Get result when complete
const result = await executor.getQueueResult(requestId);
```

## Input Parameters

### Required Parameters

- **subject** (string): Subject description for the effect template
- **image_url** (string): URL of input image to apply effects to

### Optional Parameters

- **effect_type** (WanEffectType): Type of effect to apply (default: "cakeify")
- **num_frames** (integer): Number of frames to generate (default: 81, range: 1-200)
- **frames_per_second** (integer): FPS of generated video (default: 16, range: 1-60)
- **seed** (integer): Random seed for reproducibility (0 to 2147483647)
- **aspect_ratio** ("16:9" | "9:16" | "1:1"): Output aspect ratio (default: "16:9")
- **num_inference_steps** (integer): Inference steps for sampling (default: 30, range: 1-100)
- **lora_scale** (float): LoRA weight scale for effect intensity (default: 1.0, range: 0.1-2.0)
- **turbo_mode** (boolean): Use turbo mode for faster generation

## Output Format

```typescript
interface WanEffectsOutput {
  video: {
    url: string;           // Download URL for the generated video
    content_type?: string; // MIME type (video/mp4)
    file_name?: string;    // Generated filename
    file_size?: number;    // File size in bytes
  };
  seed?: number;           // Seed used for generation
  requestId?: string;      // Request identifier
}
```

## Effect Selection Guide

### **For Portraits & People**
- `baby`, `bride`, `classy`, `hulk`, `super-saiyan`
- `disney-princess`, `pirate-captain`, `warrior`
- `selfie-younger-self`, `animeify`

### **For Animals & Creatures**
- `puppy`, `squish`, `inflate`, `deflate`
- `cakeify`, `blast`

### **For Action & Movement**
- `rotate`, `gun-shooting`, `timelapse`
- `tsunami`, `fire`, `zoom-call`

### **For Entertainment & Memes**
- `jumpscare`, `laughing`, `crying`
- `cartoon-jaw-drop`, `fus-ro-dah`

### **For Artistic & Stylistic**
- `mona-lisa`, `painting`, `zen`
- `jungle`, `assassin`

## Best Practices

### 1. **Effect Selection**
- Choose effects that complement your subject matter
- Consider the intended audience and platform
- Test different effects with similar subjects

### 2. **Image Quality**
- Use high-resolution source images (minimum 720p recommended)
- Ensure good lighting and clear subjects
- Avoid blurry or low-quality input images

### 3. **Parameter Optimization**
- Start with default values and adjust as needed
- Use `lora_scale` to control effect intensity (0.1-2.0)
- Enable `turbo_mode` for faster generation when quality isn't critical

### 4. **Aspect Ratio Selection**
- **16:9**: Best for landscape videos and social media
- **9:16**: Ideal for mobile-first content (TikTok, Instagram Stories)
- **1:1**: Perfect for square format platforms (Instagram posts)

### 5. **Frame Rate Considerations**
- **16 FPS**: Good balance of quality and file size
- **Higher FPS**: Smoother motion but larger files
- **Lower FPS**: Smaller files but choppier motion

## Cost Optimization

### **Batch Processing**
```typescript
const executor = createWanEffectsExecutor(process.env.FAL_KEY);

// Calculate cost for multiple videos
const numberOfVideos = 20;
const totalCost = executor.calculateCost() * numberOfVideos;
console.log(`Total cost for ${numberOfVideos} videos: $${totalCost.toFixed(2)}`);
// Output: Total cost for 20 videos: $7.00
```

### **Budget Scenarios**
- **$5.00 budget**: 14 videos
- **$10.00 budget**: 28 videos
- **$20.00 budget**: 57 videos

## Error Handling

```typescript
try {
  const result = await executor.generateEffectsVideo(input);
  // Handle success
} catch (error) {
  if (error.message.includes('API key')) {
    // Handle authentication errors
  } else if (error.message.includes('image_url')) {
    // Handle invalid image URL
  } else if (error.message.includes('effect_type')) {
    // Handle invalid effect type
  } else if (error.message.includes('lora_scale')) {
    // Handle invalid LoRA scale
  } else {
    // Handle other errors
    console.error('Effects video generation failed:', error.message);
  }
}
```

## Common Use Cases

### 1. **Social Media Content**
- Create engaging TikTok videos with effects
- Generate Instagram Reels with transformations
- Produce YouTube Shorts with visual effects

### 2. **Entertainment & Memes**
- Transform photos into funny videos
- Create viral content with popular effects
- Generate reaction videos and GIFs

### 3. **Marketing & Advertising**
- Apply effects to product photos
- Create attention-grabbing promotional content
- Generate unique brand videos

### 4. **Personal Content**
- Transform selfies with creative effects
- Create birthday or celebration videos
- Generate personalized entertainment content

## Performance Considerations

- **Processing Time**: 5-second videos typically take 2-4 minutes
- **Image Size**: Larger images may increase processing time
- **Effect Complexity**: Some effects may take longer than others
- **Turbo Mode**: Can reduce generation time by 30-50%

## Troubleshooting

### Common Issues

1. **Poor Quality Output**
   - Ensure high-quality input images
   - Check effect type compatibility
   - Adjust lora_scale values

2. **Effect Not Applied Properly**
   - Verify effect type is valid
   - Check subject description relevance
   - Adjust inference steps and LoRA scale

3. **Long Processing Times**
   - Enable turbo mode for faster generation
   - Reduce number of frames if possible
   - Check image size and complexity

### Optimization Tips

- **Effect Selection**: Choose effects that naturally complement your subject
- **Parameter Tuning**: Experiment with lora_scale and inference steps
- **Image Preparation**: Use clear, well-lit images with distinct subjects

## Integration Examples

### React Component

```typescript
import React, { useState } from 'react';
import { createWanEffectsExecutor } from './executors/wan-effects';

const EffectsVideoGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const generateEffectsVideo = async (subject: string, imageUrl: string, effectType: string) => {
    setLoading(true);
    try {
      const executor = createWanEffectsExecutor(process.env.REACT_APP_FAL_KEY);
      const result = await executor.generateEffectsVideo({
        subject,
        image_url: imageUrl,
        effect_type: effectType as any,
        turbo_mode: true
      });
      setVideoUrl(result.video.url);
    } catch (error) {
      console.error('Effects video generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Your UI components */}
    </div>
  );
};
```

### Node.js API

```typescript
import express from 'express';
import { createWanEffectsExecutor } from './executors/wan-effects';

const app = express();
app.use(express.json());

app.post('/generate-effects-video', async (req, res) => {
  try {
    const { subject, image_url, effect_type, lora_scale, turbo_mode } = req.body;
    
    const executor = createWanEffectsExecutor(process.env.FAL_KEY);
    const result = await executor.generateEffectsVideo({
      subject,
      image_url,
      effect_type: effect_type || "cakeify",
      lora_scale: lora_scale || 1.0,
      turbo_mode: turbo_mode || false
    });

    res.json({ success: true, video: result.video, seed: result.seed });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
```

### Effect Browser

```typescript
const executor = createWanEffectsExecutor(process.env.FAL_KEY);

// Get all available effects
const availableEffects = executor.getAvailableEffects();
console.log(`Available effects: ${availableEffects.length}`);

// Group effects by category
const effectCategories = {
  transformation: ['squish', 'muscle', 'inflate', 'crush', 'deflate'],
  character: ['hulk', 'baby', 'bride', 'disney-princess'],
  action: ['rotate', 'gun-shooting', 'timelapse', 'fire'],
  emotional: ['laughing', 'crying', 'kissing', 'angry-face'],
  style: ['mona-lisa', 'painting', 'animeify', 'blast']
};
```

## Support and Resources

- **Documentation**: [FAL AI Documentation](https://fal.ai/docs)
- **API Reference**: [Wan Effects API](https://fal.ai/docs/reference/rest/wan-effects)
- **Community**: [FAL AI Discord](https://discord.gg/fal-ai)
- **Examples**: [GitHub Examples](https://github.com/fal-ai/fal-ai-examples)

## Changelog

### v1.0 (Current)
- 40+ predefined effect types
- Customizable video parameters
- Seed control for reproducibility
- Turbo mode for faster generation
- LoRA scaling for effect intensity
- Multiple aspect ratio support

## Technical Specifications

- **Model Family**: Wan Effects
- **Architecture**: Effect-to-Video Generation
- **Input Types**: Image + Text
- **Output Format**: MP4
- **Max Duration**: ~5 seconds (81 frames at 16 FPS)
- **Quality Tier**: Standard
- **Effect Types**: 40+ predefined effects
- **Seed Control**: Yes
- **Turbo Mode**: Yes
- **LoRA Scaling**: Yes
