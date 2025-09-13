# WAN v2.2 A14B Text-to-Video LoRA Usage Guide

## Overview

The WAN v2.2 A14B Text-to-Video LoRA model is an advanced AI video generation system that creates high-quality videos from text descriptions with extensive customization options. This model stands out for its LoRA (Low-Rank Adaptation) support, allowing fine-tuned control over artistic styles and video characteristics.

## Key Features

- **Text-to-Video Generation**: Create videos from descriptive text prompts
- **LoRA Integration**: Apply custom artistic styles through LoRA weights
- **Flexible Resolution**: Support for multiple output dimensions (512x512 to 1536x864)
- **Frame Control**: Adjustable frame count (16-64) for video length and smoothness
- **Quality Tuning**: Configurable inference steps and guidance scale
- **Reproducibility**: Seed-based result consistency

## Basic Usage

### Simple Video Generation

```typescript
import { createWanV22A14bTextToVideoLoraExecutor } from './executors/wan-v2-2-a14b-text-to-video-lora';

const executor = createWanV22A14bTextToVideoLoraExecutor('your-api-key');

// Basic video generation
const result = await executor.generateVideo({
  prompt: "A serene forest scene with gentle sunlight filtering through trees"
});

console.log('Video URL:', result.video.url);
```

### Advanced Video Generation

```typescript
// Customized video with specific parameters
const result = await executor.generateVideo({
  prompt: "A bustling city street with people walking and cars driving",
  negative_prompt: "blurry, low quality, distorted",
  num_frames: 48,
  num_inference_steps: 75,
  guidance_scale: 8.0,
  width: 1280,
  height: 720,
  seed: 42
});
```

## LoRA Integration

### Using Pre-trained LoRA Weights

```typescript
// Apply anime style using LoRA weights
const result = await executor.generateVideo({
  prompt: "A magical forest with glowing mushrooms and fairy lights",
  lora_weights: "https://example.com/anime-style-lora.safetensors",
  lora_scale: 1.2,
  num_frames: 32
});
```

### LoRA Scale Recommendations

- **0.5-0.8**: Subtle style influence
- **1.0**: Balanced style application (default)
- **1.2-1.5**: Strong style dominance
- **1.5-2.0**: Maximum style effect

### Custom LoRA Weights

```typescript
// Upload and use custom LoRA weights
import { fal } from '@fal-ai/client';

// Upload your LoRA weights
const loraFile = await fal.storage.upload('path/to/your/lora.safetensors');
const loraUrl = loraFile.url;

// Use in video generation
const result = await executor.generateVideo({
  prompt: "A portrait in your custom art style",
  lora_weights: loraUrl,
  lora_scale: 1.0
});
```

## Parameter Optimization

### Quality vs. Speed Trade-offs

```typescript
// Fast generation (lower quality, faster processing)
const fastResult = await executor.generateVideo({
  prompt: "Quick test video",
  ...executor.getOptimalSettings('fast')
});

// High quality (slower processing, better results)
const qualityResult = await executor.generateVideo({
  prompt: "High-quality cinematic scene",
  ...executor.getOptimalSettings('quality')
});

// Balanced approach (default settings)
const balancedResult = await executor.generateVideo({
  prompt: "Balanced quality video",
  ...executor.getOptimalSettings('balanced')
});
```

### Resolution Selection

```typescript
// Get available resolutions
const resolutions = executor.getAvailableResolutions();
console.log('Available resolutions:', resolutions);

// Check if a resolution is supported
const isSupported = executor.isResolutionSupported(1024, 576);
console.log('1024x576 supported:', isSupported);

// Social media optimized
const socialMediaResult = await executor.generateVideo({
  prompt: "Social media content",
  width: 768,
  height: 432  // 16:9 aspect ratio
});
```

## Queue Management

### Long-Running Requests

```typescript
// Submit to queue for long-running generations
const { requestId } = await executor.queueVideoGeneration({
  prompt: "Complex cinematic scene with many details",
  num_frames: 64,
  num_inference_steps: 100
});

console.log('Request ID:', requestId);

// Check status
const status = await executor.checkQueueStatus(requestId);
console.log('Status:', status.status);

// Get result when complete
if (status.status === 'COMPLETED') {
  const result = await executor.getQueueResult(requestId);
  console.log('Video URL:', result.video.url);
}
```

### Batch Processing

```typescript
// Generate multiple videos with different prompts
const prompts = [
  "A peaceful mountain landscape",
  "A busy urban intersection",
  "A tranquil beach at sunset"
];

const results = await executor.generateMultipleVideos(
  prompts.map(prompt => ({ prompt }))
);

results.forEach((result, index) => {
  if ('error' in result) {
    console.log(`Video ${index} failed:`, result.message);
  } else {
    console.log(`Video ${index} URL:`, result.video.url);
  }
});
```

## Cost Management

### Cost Calculation

```typescript
// Calculate cost for a single video
const cost = executor.calculateCost();
console.log(`Cost per video: $${cost}`);

// Calculate total cost for multiple videos
const totalCost = cost * 10;
console.log(`Cost for 10 videos: $${totalCost}`);
```

**Pricing**: $0.50 per video (fixed price regardless of complexity, resolution, or frame count)

## Best Practices

### Prompt Engineering

```typescript
// Good prompt examples
const goodPrompts = [
  "A serene forest scene with gentle sunlight filtering through trees, soft shadows, and a winding path",
  "A bustling city street with people walking, cars driving, neon signs glowing, and urban energy",
  "A magical library with floating books, glowing orbs, and mystical atmosphere"
];

// Avoid vague prompts
const vaguePrompts = [
  "A forest",           // Too simple
  "Something cool",     // Too vague
  "A video"            // Not descriptive
];
```

### Parameter Tuning

```typescript
// Start with default settings and adjust based on results
let result = await executor.generateVideo({
  prompt: "Your descriptive prompt"
});

// If you need more detail, increase inference steps
if (needMoreDetail) {
  result = await executor.generateVideo({
    prompt: "Your descriptive prompt",
    num_inference_steps: 75
  });
}

// If you need longer video, increase frames
if (needLongerVideo) {
  result = await executor.generateVideo({
    prompt: "Your descriptive prompt",
    num_frames: 48
  });
}
```

### LoRA Usage Tips

```typescript
// Get recommended LoRA weights
const recommendedWeights = executor.getRecommendedLoraWeights();
console.log('Recommended LoRA styles:', recommendedWeights);

// Test different LoRA scales
const scales = [0.8, 1.0, 1.2];
for (const scale of scales) {
  const result = await executor.generateVideo({
    prompt: "Your prompt",
    lora_weights: "your-lora-url",
    lora_scale: scale
  });
  console.log(`LoRA scale ${scale} result:`, result.video.url);
}
```

## Error Handling

```typescript
try {
  const result = await executor.generateVideo({
    prompt: "Your prompt"
  });
  console.log('Success:', result.video.url);
} catch (error) {
  if (error.message.includes('Prompt is required')) {
    console.error('Please provide a prompt');
  } else if (error.message.includes('Number of frames must be')) {
    console.error('Invalid frame count. Use:', executor.getAvailableFrameCounts());
  } else if (error.message.includes('Resolution')) {
    console.error('Invalid resolution. Use:', executor.getAvailableResolutions());
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

## Use Case Examples

### Social Media Content

```typescript
const socialMediaVideo = await executor.generateVideo({
  prompt: "A vibrant, energetic scene perfect for social media with bright colors and dynamic movement",
  width: 768,
  height: 432,  // 16:9 aspect ratio
  num_frames: 24,
  num_inference_steps: 50
});
```

### Cinematic Production

```typescript
const cinematicVideo = await executor.generateVideo({
  prompt: "A cinematic landscape with dramatic lighting, depth of field, and professional cinematography",
  width: 1280,
  height: 720,
  num_frames: 64,
  num_inference_steps: 100,
  guidance_scale: 8.5
});
```

### Artistic Style Transfer

```typescript
const artisticVideo = await executor.generateVideo({
  prompt: "A portrait in the style of Van Gogh with swirling brushstrokes and vibrant colors",
  lora_weights: "https://example.com/van-gogh-style-lora.safetensors",
  lora_scale: 1.3,
  num_frames: 32,
  guidance_scale: 8.0
});
```

## Technical Specifications

- **Input**: Text prompts (max 1000 characters)
- **Output**: MP4 video files
- **Resolutions**: 512x512 to 1536x864
- **Frame Counts**: 16, 24, 32, 48, 64
- **Inference Steps**: 10-200
- **Guidance Scale**: 1.0-20.0
- **LoRA Scale**: 0.0-2.0
- **Seed Range**: 0-2147483647

## Troubleshooting

### Common Issues

1. **Low Quality Results**
   - Increase `num_inference_steps` (try 75-100)
   - Increase `guidance_scale` (try 8.0-10.0)
   - Use more descriptive prompts

2. **Style Not Applied**
   - Check LoRA weights URL validity
   - Increase `lora_scale` (try 1.2-1.5)
   - Ensure LoRA weights are compatible

3. **Long Processing Times**
   - Reduce `num_frames` (use 16-24 for quick results)
   - Reduce `num_inference_steps` (use 25-50)
   - Use smaller resolutions

4. **Inconsistent Results**
   - Set a fixed `seed` value
   - Use consistent parameter values
   - Ensure stable API connection

### Performance Optimization

```typescript
// For development and testing
const devSettings = {
  num_frames: 16,
  num_inference_steps: 25,
  width: 512,
  height: 512
};

// For production quality
const prodSettings = {
  num_frames: 48,
  num_inference_steps: 75,
  width: 1024,
  height: 576
};
```

## Integration Examples

### React Component

```typescript
import React, { useState } from 'react';
import { createWanV22A14bTextToVideoLoraExecutor } from './executors/wan-v2-2-a14b-text-to-video-lora';

const VideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const generateVideo = async () => {
    setLoading(true);
    try {
      const executor = createWanV22A14bTextToVideoLoraExecutor('your-api-key');
      const result = await executor.generateVideo({ prompt });
      setVideoUrl(result.video.url);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your video..."
        maxLength={1000}
      />
      <button onClick={generateVideo} disabled={loading || !prompt}>
        {loading ? 'Generating...' : 'Generate Video'}
      </button>
      {videoUrl && (
        <video controls src={videoUrl} style={{ maxWidth: '100%' }} />
      )}
    </div>
  );
};
```

### Node.js Server

```typescript
import express from 'express';
import { createWanV22A14bTextToVideoLoraExecutor } from './executors/wan-v2-2-a14b-text-to-video-lora';

const app = express();
app.use(express.json());

app.post('/generate-video', async (req, res) => {
  try {
    const { prompt, options = {} } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const executor = createWanV22A14bTextToVideoLoraExecutor(process.env.FAL_AI_KEY);
    const result = await executor.generateVideo({ prompt, ...options });

    res.json({
      success: true,
      video: result.video,
      requestId: result.requestId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('Video generation server running on port 3000');
});
```

## Conclusion

The WAN v2.2 A14B Text-to-Video LoRA model provides powerful capabilities for creating high-quality videos from text descriptions. With its LoRA integration, flexible parameters, and comprehensive customization options, it's ideal for a wide range of creative and professional applications.

Key benefits include:
- **Flexibility**: Multiple resolution and frame count options
- **Style Control**: Advanced LoRA integration for artistic styles
- **Quality Tuning**: Configurable parameters for optimal results
- **Cost Efficiency**: Fixed pricing regardless of complexity
- **Professional Output**: High-quality video generation suitable for various use cases

For the best results, experiment with different parameter combinations, use descriptive prompts, and leverage LoRA weights for specific artistic styles.
