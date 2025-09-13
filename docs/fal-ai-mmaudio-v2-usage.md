# Fal AI Mmaudio v2 Usage Guide

## Overview

The **Fal AI Mmaudio v2** model (`fal-ai/mmaudio-v2`) is an advanced AI-powered tool for generating high-quality audio content from text prompts and audio inputs. This model excels at creating diverse audio content including background music, sound effects, ambient sounds, and more, with fine-grained control over generation parameters.

The model offers cost-effective pricing that scales with audio length and inference steps: $0.05 per second of audio with additional costs for higher inference step counts.

## Key Features

- **Advanced Audio Generation**: Create high-quality audio content from text descriptions
- **Flexible Input Options**: Support for both text prompts and audio input files
- **Parameter Control**: Fine-tune generation with inference steps, guidance scale, and sampling parameters
- **Multiple Output Options**: Generate 1-4 audio samples with customizable length (1-60 seconds)
- **Cost Optimization**: Resolution-based pricing with step count multipliers
- **Queue Management**: Asynchronous processing for long-running requests
- **Real-time Logs**: Progress monitoring during audio generation
- **Webhook Support**: Production-ready callback integration

## Input Parameters

### Required Parameters

- **`audio_url`** (string): URL of the audio file to use as input for audio generation

### Optional Parameters

- **`prompt`** (string, 0-2000 chars): Text description of the audio content to generate
- **`negative_prompt`** (string, 0-2000 chars): Text describing elements to avoid in the audio
- **`seed`** (number, 0-999999): Random seed for reproducible results
- **`num_inference_steps`** (number, 1-200): Number of denoising steps (default: 50)
- **`guidance_scale`** (number, 0.1-20.0): How closely to follow the prompt (default: 3.0)
- **`num_samples`** (number, 1-4): Number of audio samples to generate (default: 1)
- **`audio_length_in_s`** (number, 1-60): Length of generated audio in seconds (default: 10)
- **`top_k`** (number, 1-1000): Top-k sampling parameter (default: 250)
- **`top_p`** (number, 0.0-1.0): Top-p sampling parameter (default: 0.0)
- **`temperature`** (number, 0.1-10.0): Randomness control (default: 1.0)
- **`classifier_free_guidance`** (boolean): Whether to use classifier-free guidance (default: true)

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

### Simple Audio Generation

```typescript
import { FalAiMmaudioV2Executor } from './executors/fal-ai-mmaudio-v2';

const executor = new FalAiMmaudioV2Executor("YOUR_API_KEY");

// Basic usage with default settings
const result = await executor.generateAudio({
  audio_url: "https://example.com/input-audio.mp3",
  prompt: "A peaceful forest ambience with birds chirping"
});

console.log("Generated audio URL:", result.audio.url);
```

### Advanced Audio Generation

```typescript
// Advanced usage with custom parameters
const result = await executor.generateAudio({
  audio_url: "https://example.com/input-audio.mp3",
  prompt: "Energetic electronic music with drums and synthesizers",
  negative_prompt: "Slow tempo, acoustic instruments",
  audio_length_in_s: 30,
  num_inference_steps: 100,
  guidance_scale: 4.0,
  temperature: 0.8,
  num_samples: 2
});

console.log("Generated audio:", result.audio);
console.log("Seed used:", result.seed);
```

## Queue-Based Processing

### Submit to Queue

```typescript
// For long-running audio generation
const { request_id } = await executor.submitAudioGenerationRequest({
  audio_url: "https://example.com/input-audio.mp3",
  prompt: "Complex orchestral piece with multiple instruments",
  audio_length_in_s: 60,
  num_inference_steps: 200
}, "https://your-webhook.com/callback");

console.log("Request ID:", request_id);
```

### Check Status

```typescript
// Check the status of your request
const status = await executor.checkRequestStatus(request_id);
console.log("Status:", status.status);
console.log("Progress:", status.progress);
```

### Get Results

```typescript
// Retrieve the completed audio
const result = await executor.getRequestResult(request_id);
console.log("Generated audio:", result.audio.url);
```

## Cost Calculation

```typescript
// Calculate cost for different configurations
const cost10s50steps = executor.calculateCost(10, 50); // $0.50
const cost30s100steps = executor.calculateCost(30, 100); // $1.50
const cost60s200steps = executor.calculateCost(60, 200); // $6.00

console.log(`10s audio with 50 steps: $${cost10s50steps}`);
console.log(`30s audio with 100 steps: $${cost30s100steps}`);
console.log(`60s audio with 200 steps: $${cost60s200steps}`);
```

## Best Practices

### Prompt Engineering

- **Be Specific**: Use detailed descriptions for better results
  ```typescript
  // Good
  prompt: "A peaceful forest ambience with birds chirping, gentle wind through leaves, and distant water flowing"
  
  // Less effective
  prompt: "Forest sounds"
  ```

- **Use Negative Prompts**: Avoid unwanted elements
  ```typescript
  negative_prompt: "Loud noises, harsh sounds, music, human voices"
  ```

### Parameter Tuning

- **Guidance Scale**: Higher values (3.0-5.0) for more prompt adherence, lower (1.0-2.0) for creativity
- **Inference Steps**: 50-100 for standard quality, 150-200 for high quality
- **Temperature**: Lower values (0.1-0.5) for consistent results, higher (1.0-2.0) for variety

### Audio Length Optimization

```typescript
// For short content (social media, intros)
audio_length_in_s: 5-15

// For background music
audio_length_in_s: 30-60

// For sound effects
audio_length_in_s: 1-5
```

## Common Use Cases

### Background Music Generation

```typescript
const backgroundMusic = await executor.generateAudio({
  audio_url: "https://example.com/input.mp3",
  prompt: "Calm, ambient background music suitable for meditation and relaxation",
  audio_length_in_s: 30,
  guidance_scale: 4.0,
  num_inference_steps: 75
});
```

### Sound Effect Creation

```typescript
const soundEffect = await executor.generateAudio({
  audio_url: "https://example.com/input.mp3",
  prompt: "Sharp, metallic sound effect for a sci-fi interface",
  audio_length_in_s: 3,
  guidance_scale: 5.0,
  num_inference_steps: 100
});
```

### Ambient Audio Synthesis

```typescript
const ambientAudio = await executor.generateAudio({
  audio_url: "https://example.com/input.mp3",
  prompt: "Rain falling on a tin roof with distant thunder",
  audio_length_in_s: 45,
  guidance_scale: 3.5,
  num_inference_steps: 80
});
```

## Technical Considerations

### Input Audio Requirements

- **Format**: MP3, WAV, AAC, OGG, M4A
- **Quality**: Higher quality input generally produces better results
- **Length**: Input audio length can influence generation quality

### Output Quality

- **Standard Quality**: 50 inference steps, suitable for most use cases
- **High Quality**: 100-150 inference steps, for professional content
- **Ultra Quality**: 150-200 inference steps, maximum quality but higher cost

### Performance Optimization

```typescript
// For faster generation (lower quality)
num_inference_steps: 25-50

// For higher quality (slower generation)
num_inference_steps: 150-200

// Balance quality and speed
num_inference_steps: 75-100
```

## Error Handling

```typescript
try {
  const result = await executor.generateAudio({
    audio_url: "https://example.com/input.mp3",
    prompt: "Forest ambience"
  });
  
  console.log("Success:", result.audio.url);
} catch (error) {
  if (error.code === 'EXECUTION_ERROR') {
    console.error("Generation failed:", error.message);
  } else {
    console.error("Unexpected error:", error.message);
  }
}
```

## Integration Examples

### React Component

```typescript
import React, { useState } from 'react';
import { FalAiMmaudioV2Executor } from './executors/fal-ai-mmaudio-v2';

const AudioGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const generateAudio = async () => {
    setIsGenerating(true);
    try {
      const executor = new FalAiMmaudioV2Executor(process.env.REACT_APP_FAL_KEY!);
      const result = await executor.generateAudio({
        audio_url: "https://example.com/input.mp3",
        prompt: "Peaceful forest ambience",
        audio_length_in_s: 15
      });
      setAudioUrl(result.audio.url);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <button onClick={generateAudio} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Generate Audio'}
      </button>
      {audioUrl && (
        <audio controls src={audioUrl}>
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default AudioGenerator;
```

### Node.js Server

```typescript
import express from 'express';
import { FalAiMmaudioV2Executor } from './executors/fal-ai-mmaudio-v2';

const app = express();
app.use(express.json());

app.post('/generate-audio', async (req, res) => {
  try {
    const executor = new FalAiMmaudioV2Executor(process.env.FAL_API_KEY!);
    
    const result = await executor.generateAudio({
      audio_url: req.body.audio_url,
      prompt: req.body.prompt,
      audio_length_in_s: req.body.audio_length_in_s || 10
    });
    
    res.json({
      success: true,
      audio: result.audio,
      cost: executor.calculateCost(req.body.audio_length_in_s || 10)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('Audio generation server running on port 3000');
});
```

## Performance Optimization

### Batch Processing

```typescript
// Generate multiple audio samples efficiently
const batchResult = await executor.generateAudio({
  audio_url: "https://example.com/input.mp3",
  prompt: "Forest ambience",
  num_samples: 4,
  audio_length_in_s: 20
});

// Process all samples
for (let i = 0; i < batchResult.audio.length; i++) {
  console.log(`Sample ${i + 1}:`, batchResult.audio[i].url);
}
```

### Caching Strategies

```typescript
// Cache generated audio URLs for reuse
const audioCache = new Map<string, string>();

const getCachedAudio = async (prompt: string, audioUrl: string) => {
  const cacheKey = `${prompt}_${audioUrl}`;
  
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey);
  }
  
  const result = await executor.generateAudio({
    audio_url: audioUrl,
    prompt: prompt
  });
  
  audioCache.set(cacheKey, result.audio.url);
  return result.audio.url;
};
```

## Troubleshooting

### Common Issues

1. **Audio URL Invalid**
   ```typescript
   // Ensure the audio URL is accessible
   if (!input.audio_url.startsWith('http')) {
     throw new Error('Audio URL must be a valid HTTP/HTTPS URL');
   }
   ```

2. **Generation Timeout**
   ```typescript
   // Use queue-based processing for long audio
   if (input.audio_length_in_s > 30 || input.num_inference_steps > 100) {
     const { request_id } = await executor.submitAudioGenerationRequest(input);
     // Monitor progress and retrieve result
   }
   ```

3. **Quality Issues**
   ```typescript
   // Increase inference steps for better quality
   if (qualityIssues) {
     input.num_inference_steps = Math.min(200, input.num_inference_steps * 1.5);
     input.guidance_scale = Math.min(20.0, input.guidance_scale * 1.2);
   }
   ```

### Debug Mode

```typescript
// Enable detailed logging
const result = await executor.generateAudio({
  audio_url: "https://example.com/input.mp3",
  prompt: "Test prompt"
});

// Check metadata for debugging
console.log("Audio metadata:", result.metadata);
console.log("Generation seed:", result.seed);
```

## Advanced Features

### Seed Control for Reproducibility

```typescript
// Use the same seed for consistent results
const seed = 123456;

const result1 = await executor.generateAudio({
  audio_url: "https://example.com/input.mp3",
  prompt: "Forest ambience",
  seed: seed
});

const result2 = await executor.generateAudio({
  audio_url: "https://example.com/input.mp3",
  prompt: "Forest ambience",
  seed: seed
});

// result1 and result2 should be identical
```

### Custom Sampling Parameters

```typescript
// Fine-tune generation with advanced sampling
const result = await executor.generateAudio({
  audio_url: "https://example.com/input.mp3",
  prompt: "Electronic music",
  top_k: 100,        // More focused sampling
  top_p: 0.9,        // Nucleus sampling
  temperature: 0.7    // Balanced creativity
});
```

## Support and Resources

- **Documentation**: [Fal AI Documentation](https://docs.fal.ai/)
- **API Reference**: [Fal AI API Reference](https://docs.fal.ai/reference)
- **Community**: [Fal AI Discord](https://discord.gg/fal-ai)
- **Examples**: [Fal AI Examples](https://github.com/fal-ai/fal-examples)

## Conclusion

The Fal AI Mmaudio v2 model provides powerful audio generation capabilities with fine-grained control over the generation process. By following the best practices outlined in this guide, you can create high-quality audio content for various applications while optimizing for cost and performance.

Remember to experiment with different parameters to find the optimal settings for your specific use case, and consider using the queue system for longer audio generation tasks.
