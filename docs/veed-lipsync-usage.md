# VEED Lipsync Usage Guide

## Overview

The **VEED Lipsync** model (`veed/lipsync`) is an advanced AI-powered tool that generates realistic lipsync from any audio using VEED's latest model. This model creates high-quality synchronized speech videos, making it ideal for dubbing, voice-overs, and multilingual content creation.

### Key Features

- **Realistic Lipsync Generation**: High-quality audio-video synchronization
- **Multilingual Support**: Works with various languages and accents
- **Commercial Use**: Suitable for professional and commercial applications
- **High-Quality Output**: Professional-grade results
- **Easy Integration**: Simple API with comprehensive documentation
- **Cost-Effective**: $0.4 per minute of processed video
- **Multiple Formats**: Supports various video and audio formats

### Model Information

- **Name**: VEED Lipsync
- **Provider**: VEED
- **Model ID**: `veed/lipsync`
- **Type**: Lipsync Generation
- **Version**: v1.0

## Quick Start

### Installation

```bash
npm install --save @fal-ai/client
```

### Basic Usage

```typescript
import { fal } from "@fal-ai/client";

// Set your API key
fal.config({
  credentials: "YOUR_FAL_KEY"
});

// Generate lipsync video
const result = await fal.subscribe("veed/lipsync", {
  input: {
    video_url: "https://example.com/video.mp4",
    audio_url: "https://example.com/audio.mp3"
  }
});

console.log(result.data.video.url);
```

## API Reference

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `video_url` | string | Yes | URL of the input video file. Supported formats: mp4, mov, webm, m4v, gif |
| `audio_url` | string | Yes | URL of the input audio file. Supported formats: mp3, ogg, wav, m4a, aac |

### Output Format

```typescript
{
  "video": {
    "url": "https://example.com/generated-video.mp4",
    "content_type": "video/mp4",
    "file_name": "generated-video.mp4",
    "file_size": 12345678
  }
}
```

## Usage Examples

### Basic Lipsync Generation

```typescript
import { VeedLipsyncExecutor } from './executors/veed-lipsync';

const executor = new VeedLipsyncExecutor('YOUR_API_KEY');

const result = await executor.generateLipsync({
  video_url: "https://example.com/video.mp4",
  audio_url: "https://example.com/audio.mp3"
});

console.log('Generated video URL:', result.video.url);
```

### With Progress Tracking

```typescript
const result = await executor.generateLipsync({
  video_url: "https://example.com/video.mp4",
  audio_url: "https://example.com/audio.mp3"
}, {
  logs: true,
  onQueueUpdate: (update) => {
    if (update.status === "IN_PROGRESS") {
      update.logs.map((log) => log.message).forEach(console.log);
    }
  }
});
```

### Queue-Based Processing

```typescript
// Submit request to queue
const { request_id } = await executor.submitLipsyncRequest({
  video_url: "https://example.com/long-video.mp4",
  audio_url: "https://example.com/audio.mp3"
}, {
  webhookUrl: "https://your-webhook.url/for/results"
});

// Check status
const status = await executor.getRequestStatus(request_id, { logs: true });

// Get result when complete
const result = await executor.getRequestResult(request_id);
```

## Use Cases

### Content Creation

#### YouTube Video Dubbing
```typescript
const youtubeDubbing = await executor.generateLipsync({
  video_url: "https://example.com/original-video.mp4",
  audio_url: "https://example.com/spanish-audio.mp3"
});
```

#### Social Media Content
```typescript
const socialMediaContent = await executor.generateLipsync({
  video_url: "https://example.com/influencer-video.mp4",
  audio_url: "https://example.com/voice-over.mp3"
});
```

### Localization

#### Multilingual Content
```typescript
const multilingualContent = await executor.generateLipsync({
  video_url: "https://example.com/english-video.mp4",
  audio_url: "https://example.com/french-audio.mp3"
});
```

#### International Marketing
```typescript
const internationalMarketing = await executor.generateLipsync({
  video_url: "https://example.com/us-marketing-video.mp4",
  audio_url: "https://example.com/german-marketing-audio.mp3"
});
```

### Accessibility

#### Adding Speech to Silent Videos
```typescript
const silentVideoSpeech = await executor.generateLipsync({
  video_url: "https://example.com/silent-presentation.mp4",
  audio_url: "https://example.com/descriptive-audio.mp3"
});
```

#### Audio Description
```typescript
const audioDescription = await executor.generateLipsync({
  video_url: "https://example.com/visual-story.mp4",
  audio_url: "https://example.com/audio-description.mp3"
});
```

### Professional Applications

#### Corporate Training
```typescript
const corporateTraining = await executor.generateLipsync({
  video_url: "https://example.com/training-content.mp4",
  audio_url: "https://example.com/training-narration.mp3"
});
```

#### Product Demonstrations
```typescript
const productDemonstration = await executor.generateLipsync({
  video_url: "https://example.com/product-demo.mp4",
  audio_url: "https://example.com/product-explanation.mp3"
});
```

## Cost Calculation

### Pricing Structure
- **Rate**: $0.4 per minute of processed video
- **Example**: 5-minute video costs $2.00

### Cost Calculation Function
```typescript
const cost = executor.calculateCost(5); // 5 minutes = $2.00
console.log(`Cost: $${cost}`);
```

### Processing Time Estimation
```typescript
const processingTime = executor.estimateProcessingTime(5); // 5 minutes
console.log(`Estimated processing time: ${processingTime}`);
```

## Best Practices

### Input Preparation

1. **Video Quality**
   - Use high-quality video with clear facial features
   - Ensure good lighting on the subject's face
   - Use videos with minimal background noise
   - Ensure subject is facing the camera

2. **Audio Quality**
   - Use clear, high-quality audio
   - Match audio length to video duration
   - Use audio with clear speech and minimal background music
   - Ensure proper audio format compatibility

3. **File Formats**
   - **Video**: MP4, MOV, WebM, M4V, GIF
   - **Audio**: MP3, OGG, WAV, M4A, AAC

### Cost Optimization

1. **Process Shorter Clips**
   - Break long videos into shorter segments
   - Process only necessary portions
   - Use appropriate video resolution

2. **Batch Processing**
   - Process multiple videos together
   - Use queue system for efficiency
   - Plan content to minimize processing time

3. **Quality vs. Cost**
   - Balance quality requirements with cost
   - Use efficient video formats (MP4 recommended)
   - Consider processing time vs. cost trade-offs

### Quality Enhancement

1. **Source Materials**
   - Use high-resolution source materials
   - Ensure clear facial expressions
   - Use natural lighting for better results

2. **Audio-Video Sync**
   - Ensure audio and video are properly synchronized
   - Test with different audio qualities
   - Use professional-grade audio when possible

3. **Technical Considerations**
   - Monitor processing status for long-running jobs
   - Implement proper error handling and retries
   - Use webhooks for asynchronous processing

## Troubleshooting

### Common Issues

#### Poor Lipsync Quality
**Problem**: Lipsync quality is poor or unnatural
**Solutions**:
- Use higher quality source video with clear facial features
- Ensure good lighting on the subject's face
- Use clear, high-quality audio
- Ensure subject is facing the camera

#### Processing Failure
**Problem**: Lipsync generation fails or times out
**Solutions**:
- Check that video and audio URLs are accessible
- Verify file formats are supported
- Ensure audio and video lengths match
- Use queue system for long videos

#### Audio-Video Mismatch
**Problem**: Audio and video are not properly synchronized
**Solutions**:
- Ensure audio and video lengths match exactly
- Use high-quality source materials
- Check for audio delays or timing issues
- Verify audio format compatibility

#### File Format Issues
**Problem**: Unsupported file format errors
**Solutions**:
- Use supported video formats: MP4, MOV, WebM, M4V, GIF
- Use supported audio formats: MP3, OGG, WAV, M4A, AAC
- Convert files to supported formats if necessary
- Check file URLs are accessible and valid

### Error Handling

```typescript
try {
  const result = await executor.generateLipsync({
    video_url: videoUrl,
    audio_url: audioUrl
  });
  console.log('Success:', result.video.url);
} catch (error) {
  console.error('Error:', error.message);
  // Handle error appropriately
}
```

## Advanced Usage

### Batch Processing

```typescript
const videoAudioPairs = [
  { videoUrl: "https://example.com/video1.mp4", audioUrl: "https://example.com/audio1.mp3" },
  { videoUrl: "https://example.com/video2.mp4", audioUrl: "https://example.com/audio2.mp3" },
  { videoUrl: "https://example.com/video3.mp4", audioUrl: "https://example.com/audio3.mp3" }
];

const results = await Promise.all(
  videoAudioPairs.map(async (pair) => {
    try {
      return await executor.generateLipsync({
        video_url: pair.videoUrl,
        audio_url: pair.audioUrl
      });
    } catch (error) {
      console.error('Failed to process:', pair.videoUrl, error.message);
      return null;
    }
  })
);
```

### Webhook Integration

```typescript
const { request_id } = await executor.submitLipsyncRequest({
  video_url: "https://example.com/video.mp4",
  audio_url: "https://example.com/audio.mp3"
}, {
  webhookUrl: "https://your-app.com/webhook/lipsync-complete"
});

// Your webhook endpoint will receive the result when processing is complete
```

### Progress Monitoring

```typescript
const { request_id } = await executor.submitLipsyncRequest({
  video_url: "https://example.com/video.mp4",
  audio_url: "https://example.com/audio.mp3"
});

// Poll for status updates
const checkStatus = async () => {
  const status = await executor.getRequestStatus(request_id, { logs: true });
  
  if (status.status === "COMPLETED") {
    const result = await executor.getRequestResult(request_id);
    console.log('Processing complete:', result.video.url);
  } else if (status.status === "FAILED") {
    console.error('Processing failed:', status.error);
  } else {
    console.log('Processing in progress...');
    setTimeout(checkStatus, 5000); // Check again in 5 seconds
  }
};

checkStatus();
```

## Integration Examples

### React Component

```typescript
import React, { useState } from 'react';
import { VeedLipsyncExecutor } from './executors/veed-lipsync';

const LipsyncGenerator: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const executor = new VeedLipsyncExecutor(process.env.REACT_APP_FAL_KEY!);
      const result = await executor.generateLipsync({
        video_url: videoUrl,
        audio_url: audioUrl
      });
      setResult(result.video.url);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      <input
        type="text"
        placeholder="Audio URL"
        value={audioUrl}
        onChange={(e) => setAudioUrl(e.target.value)}
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Lipsync'}
      </button>
      {result && (
        <video controls src={result} style={{ width: '100%', maxWidth: '500px' }} />
      )}
    </div>
  );
};
```

### Node.js Server

```typescript
import express from 'express';
import { VeedLipsyncExecutor } from './executors/veed-lipsync';

const app = express();
app.use(express.json());

const executor = new VeedLipsyncExecutor(process.env.FAL_KEY!);

app.post('/api/lipsync', async (req, res) => {
  try {
    const { video_url, audio_url } = req.body;
    
    const result = await executor.generateLipsync({
      video_url,
      audio_url
    });
    
    res.json({ success: true, video_url: result.video.url });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Conclusion

VEED Lipsync provides a powerful and cost-effective solution for generating realistic lipsync videos. With its support for multiple formats, high-quality output, and easy integration, it's perfect for content creation, localization, accessibility, and professional applications.

The model's $0.4 per minute pricing makes it accessible for various use cases, from individual content creators to large-scale commercial applications. By following the best practices outlined in this guide, you can achieve optimal results while managing costs effectively.