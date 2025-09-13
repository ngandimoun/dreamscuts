# WAN v2.2 A14B Text-to-Video Turbo Usage Guide

## Overview

The WAN v2.2 A14B Text-to-Video Turbo model is a high-performance AI video generation system that creates high-quality videos from text descriptions with turbo optimization. This model stands out for its **tiered pricing system** based on resolution, making it ideal for both cost-conscious and quality-focused applications.

## Key Features

- **Text-to-Video Generation**: Create videos from descriptive text prompts
- **Turbo Optimization**: Faster generation with optimized processing
- **Tiered Pricing**: Cost varies by resolution (480p: $0.05, 580p: $0.075, 720p: $0.10)
- **Multiple Resolutions**: Support for 480p, 580p, and 720p output
- **Safety Features**: Built-in content moderation and safety checking
- **Prompt Enhancement**: Optional AI-powered prompt expansion
- **Acceleration Control**: Configurable speed vs. quality trade-offs

## Basic Usage

### Simple Video Generation

```typescript
import { createWanV22A14bTextToVideoTurboExecutor } from './executors/wan-v2-2-a14b-text-to-video-turbo';

const executor = createWanV22A14bTextToVideoTurboExecutor('your-api-key');

// Basic video generation (defaults to 720p, $0.10)
const result = await executor.generateVideo({
  prompt: "A medium shot establishes a modern, minimalist office setting: clean lines, muted grey walls, and polished wood surfaces."
});

console.log('Video URL:', result.video.url);
console.log('Cost:', executor.calculateCost('720p')); // $0.10
```

### Cost-Effective Video Generation

```typescript
// Generate at 480p for cost savings ($0.05 - 50% savings)
const budgetResult = await executor.generateVideo({
  prompt: "A bustling city street with people walking and cars driving",
  resolution: "480p"
});

console.log('Cost:', executor.calculateCost('480p')); // $0.05
```

### High-Quality Video Generation

```typescript
// Generate at 720p with enhanced settings ($0.10)
const qualityResult = await executor.generateVideo({
  prompt: "A cinematic landscape with dramatic lighting and professional cinematography",
  resolution: "720p",
  enable_prompt_expansion: true,
  acceleration: "none"
});

console.log('Cost:', executor.calculateCost('720p')); // $0.10
```

## Resolution and Pricing Guide

### Pricing Tiers

| Resolution | Cost | Savings | Best For |
|------------|------|---------|----------|
| **480p** | $0.05 | **50% savings** | Prototyping, testing, budget content |
| **580p** | $0.075 | **25% savings** | Most production use cases, social media |
| **720p** | $0.10 | Base price | Premium content, professional use |

### Cost Comparison

```typescript
// Get detailed cost comparison
const costComparison = executor.getCostComparison();
costComparison.forEach(tier => {
  console.log(`${tier.resolution}: $${tier.cost} (${tier.savings})`);
});

// Output:
// 720p: $0.10 (Base price)
// 580p: $0.075 (25% savings)
// 480p: $0.05 (50% savings)
```

### Resolution Selection Strategies

```typescript
// Budget-conscious approach
const budgetSettings = executor.getOptimalSettings('cost_effective');
// Returns: { resolution: "480p", acceleration: "regular", enable_safety_checker: true }

// Balanced approach
const balancedSettings = executor.getOptimalSettings('balanced');
// Returns: { resolution: "580p", acceleration: "regular", enable_prompt_expansion: false }

// High-quality approach
const qualitySettings = executor.getOptimalSettings('quality');
// Returns: { resolution: "720p", acceleration: "none", enable_prompt_expansion: true }
```

## Advanced Usage

### Custom Aspect Ratios

```typescript
// Generate vertical video for mobile (9:16 aspect ratio)
const verticalVideo = await executor.generateVideo({
  prompt: "A person walking down a street in a city",
  resolution: "580p",
  aspect_ratio: "9:16"
});

// Generate square video for social media (1:1 aspect ratio)
const squareVideo = await executor.generateVideo({
  prompt: "A product showcase with professional lighting",
  resolution: "480p",
  aspect_ratio: "1:1"
});
```

### Safety and Content Moderation

```typescript
// Enable safety checker (default: true)
const safeVideo = await executor.generateVideo({
  prompt: "A family-friendly scene in a park",
  enable_safety_checker: true
});

// Disable safety checker for creative freedom (use with caution)
const creativeVideo = await executor.generateVideo({
  prompt: "An artistic abstract scene",
  enable_safety_checker: false
});
```

### Prompt Enhancement

```typescript
// Enable AI-powered prompt expansion for better results
const enhancedVideo = await executor.generateVideo({
  prompt: "A sunset over mountains",
  enable_prompt_expansion: true,
  resolution: "720p"
});

// The model will automatically expand your prompt with additional details
// while maintaining the original meaning
```

### Acceleration Control

```typescript
// Fast generation with acceleration (slight quality trade-off)
const fastVideo = await executor.generateVideo({
  prompt: "Quick test scene",
  acceleration: "regular",
  resolution: "480p"
});

// Maximum quality with no acceleration
const qualityVideo = await executor.generateVideo({
  prompt: "High-quality cinematic scene",
  acceleration: "none",
  resolution: "720p"
});
```

## Cost Optimization Strategies

### Batch Generation at Lower Resolutions

```typescript
// Generate multiple videos at 480p for cost efficiency
const prompts = [
  "A peaceful forest scene",
  "A busy urban intersection",
  "A tranquil beach at sunset",
  "A cozy coffee shop interior"
];

const batchResults = await executor.generateMultipleVideos(
  prompts.map(prompt => ({ 
    prompt, 
    resolution: "480p" 
  }))
);

const totalCost = prompts.length * executor.calculateCost('480p');
console.log(`Total cost for ${prompts.length} videos: $${totalCost}`); // $0.20
```

### Resolution Testing Strategy

```typescript
// Test at lower resolution first, then upgrade if needed
async function generateVideoWithTesting(prompt: string) {
  // Start with 480p for testing ($0.05)
  const testResult = await executor.generateVideo({
    prompt,
    resolution: "480p"
  });
  
  // If quality is sufficient, keep it
  if (isQualitySufficient(testResult.video)) {
    return testResult;
  }
  
  // Upgrade to 580p for better quality ($0.075)
  const upgradeResult = await executor.generateVideo({
    prompt,
    resolution: "580p"
  });
  
  return upgradeResult;
}
```

### Cost-Effective Production Workflow

```typescript
// Production workflow with cost optimization
async function productionWorkflow(prompts: string[]) {
  const results = [];
  
  for (const prompt of prompts) {
    // Use 480p for initial drafts
    const draft = await executor.generateVideo({
      prompt,
      resolution: "480p",
      acceleration: "regular"
    });
    
    // If approved, generate final at 580p
    if (await approveDraft(draft)) {
      const final = await executor.generateVideo({
        prompt,
        resolution: "580p",
        acceleration: "none"
      });
      results.push(final);
    }
  }
  
  return results;
}
```

## Queue Management

### Long-Running Requests

```typescript
// Submit to queue for long-running generations
const { requestId } = await executor.queueVideoGeneration({
  prompt: "Complex cinematic scene with many details",
  resolution: "720p",
  enable_prompt_expansion: true
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

### Batch Queue Processing

```typescript
// Queue multiple videos for batch processing
async function queueBatchVideos(prompts: string[], resolution: "480p" | "580p" | "720p" = "580p") {
  const queuePromises = prompts.map(prompt => 
    executor.queueVideoGeneration({ prompt, resolution })
  );
  
  const queueResults = await Promise.all(queuePromises);
  const requestIds = queueResults.map(result => result.requestId);
  
  // Monitor all requests
  const results = [];
  for (const requestId of requestIds) {
    const result = await executor.getQueueResult(requestId);
    results.push(result);
  }
  
  return results;
}
```

## Best Practices

### Prompt Engineering

```typescript
// Good prompt examples for different resolutions
const goodPrompts = {
  "480p": "A simple scene with clear subjects and minimal complexity",
  "580p": "A detailed scene with good lighting and clear composition",
  "720p": "A cinematic scene with complex details, professional lighting, and artistic composition"
};

// Avoid vague prompts
const vaguePrompts = [
  "A video",           // Too simple
  "Something cool",    // Too vague
  "A scene"            // Not descriptive
];
```

### Resolution Selection Guidelines

```typescript
// Resolution selection based on use case
function getOptimalResolution(useCase: string): "480p" | "580p" | "720p" {
  switch (useCase.toLowerCase()) {
    case "prototype":
    case "test":
    case "draft":
      return "480p"; // Fast and cheap
      
    case "social_media":
    case "web_content":
    case "production":
      return "580p"; // Balanced quality and cost
      
    case "premium":
    case "professional":
    case "cinematic":
      return "720p"; // Highest quality
      
    default:
      return "580p"; // Balanced default
  }
}
```

### Cost Management

```typescript
// Calculate total project cost
function calculateProjectCost(prompts: string[], resolution: "480p" | "580p" | "720p" = "580p") {
  const costPerVideo = executor.calculateCost(resolution);
  const totalCost = prompts.length * costPerVideo;
  
  console.log(`Project cost breakdown:`);
  console.log(`- Videos: ${prompts.length}`);
  console.log(`- Resolution: ${resolution}`);
  console.log(`- Cost per video: $${costPerVideo}`);
  console.log(`- Total cost: $${totalCost}`);
  
  return totalCost;
}

// Compare costs across resolutions
function compareResolutionCosts(prompts: string[]) {
  const resolutions = ["480p", "580p", "720p"] as const;
  
  resolutions.forEach(resolution => {
    const cost = executor.calculateCost(resolution);
    const totalCost = prompts.length * cost;
    console.log(`${resolution}: $${totalCost} total ($${cost} per video)`);
  });
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
  } else if (error.message.includes('Resolution must be')) {
    console.error('Invalid resolution. Use:', executor.getAvailableResolutions());
  } else if (error.message.includes('Aspect ratio must be')) {
    console.error('Invalid aspect ratio. Use:', executor.getAvailableAspectRatios());
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
  resolution: "480p",  // Adequate quality for social media
  aspect_ratio: "9:16", // Vertical format for mobile
  acceleration: "regular" // Fast generation
});
```

### Marketing Campaigns

```typescript
const marketingVideo = await executor.generateVideo({
  prompt: "A professional product showcase with elegant lighting and smooth camera movements",
  resolution: "580p",  // High quality for marketing
  aspect_ratio: "16:9", // Standard widescreen
  enable_prompt_expansion: true, // Enhanced details
  enable_safety_checker: true // Content safety
});
```

### Prototype Development

```typescript
const prototypeVideo = await executor.generateVideo({
  prompt: "A concept scene for rapid prototyping and testing",
  resolution: "480p",  // Fast and cost-effective
  acceleration: "regular", // Maximum speed
  enable_safety_checker: false // Creative freedom
});
```

## Technical Specifications

- **Input**: Text prompts (max 1000 characters)
- **Output**: MP4 video files
- **Resolutions**: 480p, 580p, 720p
- **Aspect Ratios**: 16:9, 9:16, 1:1
- **Acceleration**: none, regular
- **Safety Checker**: Enabled by default
- **Prompt Expansion**: Optional AI enhancement

## Troubleshooting

### Common Issues

1. **Low Quality Results**
   - Increase resolution from 480p to 580p or 720p
   - Disable acceleration for better quality
   - Enable prompt expansion for enhanced details

2. **High Costs**
   - Use 480p resolution for 50% cost savings
   - Batch generate multiple videos at lower resolutions
   - Reserve 720p only for premium content

3. **Slow Generation**
   - Enable acceleration (regular)
   - Use lower resolution (480p or 580p)
   - Disable prompt expansion

4. **Content Safety Issues**
   - Ensure safety checker is enabled
   - Review and refine prompts
   - Use appropriate content descriptions

### Performance Optimization

```typescript
// For development and testing
const devSettings = {
  resolution: "480p",
  acceleration: "regular",
  enable_prompt_expansion: false
};

// For production quality
const prodSettings = {
  resolution: "580p",
  acceleration: "none",
  enable_prompt_expansion: true
};

// For premium content
const premiumSettings = {
  resolution: "720p",
  acceleration: "none",
  enable_prompt_expansion: true,
  enable_safety_checker: true
};
```

## Integration Examples

### React Component

```typescript
import React, { useState } from 'react';
import { createWanV22A14bTextToVideoTurboExecutor } from './executors/wan-v2-2-a14b-text-to-video-turbo';

const VideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState<'480p' | '580p' | '720p'>('580p');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const generateVideo = async () => {
    setLoading(true);
    try {
      const executor = createWanV22A14bTextToVideoTurboExecutor('your-api-key');
      const result = await executor.generateVideo({ prompt, resolution });
      setVideoUrl(result.video.url);
      
      const cost = executor.calculateCost(resolution);
      console.log(`Generated ${resolution} video for $${cost}`);
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
      <select value={resolution} onChange={(e) => setResolution(e.target.value as any)}>
        <option value="480p">480p - $0.05</option>
        <option value="580p">580p - $0.075</option>
        <option value="720p">720p - $0.10</option>
      </select>
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
import { createWanV22A14bTextToVideoTurboExecutor } from './executors/wan-v2-2-a14b-text-to-video-turbo';

const app = express();
app.use(express.json());

app.post('/generate-video', async (req, res) => {
  try {
    const { prompt, resolution = '580p', options = {} } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const executor = createWanV22A14bTextToVideoTurboExecutor(process.env.FAL_AI_KEY);
    const result = await executor.generateVideo({ prompt, resolution, ...options });
    const cost = executor.calculateCost(resolution);

    res.json({
      success: true,
      video: result.video,
      prompt: result.prompt,
      seed: result.seed,
      cost,
      resolution
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

The WAN v2.2 A14B Text-to-Video Turbo model provides powerful capabilities for creating high-quality videos from text descriptions with significant cost optimization through its tiered pricing system. With turbo optimization, flexible resolution options, and comprehensive safety features, it's ideal for a wide range of creative and professional applications.

Key benefits include:
- **Cost Efficiency**: 50% savings with 480p resolution
- **Flexibility**: Multiple resolution and aspect ratio options
- **Speed**: Turbo optimization for faster generation
- **Safety**: Built-in content moderation
- **Quality**: High-quality output across all resolution tiers

For the best results, experiment with different resolution settings based on your quality requirements and budget constraints. Start with 580p for most use cases, use 480p for prototyping and testing, and reserve 720p for premium content requiring the highest quality.
