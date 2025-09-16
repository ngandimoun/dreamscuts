# Video Asset Analyzer Implementation

## Overview

The Video Asset Analyzer is a comprehensive system that provides advanced video understanding capabilities using multiple AI models with automatic fallback logic. It's designed to handle video analysis tasks including content analysis, scene analysis, activity recognition, and more.

## Architecture

### Model Priority Order

The system uses the following models in priority order with automatic fallback:

1. **Qwen2-VL-7B-Instruct** (Primary)
   - Model ID: `lucataco/qwen2-vl-7b-instruct:bf57361c75677fc33d480d0c5f02926e621b2caa2000347cb74aeae9d2ca07ee`
   - Description: Latest model in the Qwen family for chatting with video and image models
   - Performance: ~4 seconds processing time

2. **VideoLLaMA 3-7B** (Fallback 1)
   - Model ID: `lucataco/videollama3-7b:34a1f45f7068f7121a5b47c91f2d7e06c298850767f76f96660450a0a3bd5bbe`
   - Description: Frontier Multimodal Foundation Models for Video Understanding
   - Performance: ~8 seconds processing time

3. **Apollo 7B** (Fallback 2)
   - Model ID: `lucataco/apollo-7b:e282f76d0451b759128be3e8bccfe5ded8f521f4a7d705883e92f837e563f575`
   - Description: An Exploration of Video Understanding in Large Multimodal Models
   - Performance: ~8 seconds processing time

4. **MiniCPM-V-4** (Fallback 3)
   - Model ID: `lucataco/minicpm-v-4:8b647b895c75cc7885d0a22d4fb1a0a2cb4fcf8ebbc13b78e09ec671f9183b27`
   - Description: Strong image and video understanding performance
   - Performance: Variable

## Components

### 1. Core Analyzer (`executors/video-asset-analyzer.ts`)

The main video analysis engine that:
- Manages model execution with timeout handling
- Implements automatic fallback logic
- Provides batch processing capabilities
- Includes comprehensive error handling and retry logic

**Key Functions:**
- `analyzeVideoAsset()` - Single video analysis
- `analyzeVideoAssets()` - Batch video analysis
- `validateVideoUrl()` - URL validation
- `createVideoAnalysisScenario()` - Scenario creation

### 2. API Endpoint (`app/api/dreamcut/video-analyzer/route.ts`)

RESTful API that provides:
- Single video analysis endpoint
- Batch video analysis endpoint
- Model information endpoint
- Health check endpoint

**Endpoints:**
- `POST /api/dreamcut/video-analyzer` - Analyze video(s)
- `GET /api/dreamcut/video-analyzer?action=models` - Get model info
- `GET /api/dreamcut/video-analyzer?action=health` - Health check

### 3. React Hook (`hooks/useVideoAnalyzer.ts`)

Custom React hook that provides:
- State management for video analysis
- Error handling and loading states
- URL validation utilities
- Easy integration with React components

### 4. React Component (`components/chat/VideoAnalyzer.tsx`)

UI component that provides:
- Video URL input with validation
- Analysis type selection
- User description input
- Real-time results display
- Error handling and status indicators

### 5. Integration with Query Analyzer

The video analyzer is integrated into the main query analyzer system:
- Enhanced video analysis with fallback models
- Legacy Fal.ai support as additional fallback
- Together.ai vision analysis as final fallback
- Comprehensive error handling and logging

## Analysis Types

The system supports multiple analysis types:

1. **Content Analysis** - Comprehensive video content analysis
2. **Scene Analysis** - Analyze scenes and visual elements
3. **Activity Recognition** - Identify activities and actions
4. **Question Answering** - Answer questions about video content
5. **Summarization** - Provide video summary
6. **Educational** - Analyze educational content
7. **Entertainment** - Analyze entertainment value
8. **Sports** - Analyze sports content
9. **Cooking** - Analyze cooking processes
10. **Custom** - Custom analysis

## Usage Examples

### Single Video Analysis

```typescript
import { analyzeVideoAsset } from './executors/video-asset-analyzer';

const result = await analyzeVideoAsset({
  videoUrl: 'https://example.com/video.mp4',
  prompt: 'Describe what happens in this video',
  analysisType: 'content_analysis',
  userDescription: 'I want to use this for a presentation'
});
```

### Batch Video Analysis

```typescript
import { analyzeVideoAssets } from './executors/video-asset-analyzer';

const results = await analyzeVideoAssets([
  {
    videoUrl: 'https://example.com/video1.mp4',
    prompt: 'Analyze this video',
    analysisType: 'content_analysis'
  },
  {
    videoUrl: 'https://example.com/video2.mp4',
    prompt: 'What activities are shown?',
    analysisType: 'activity_recognition'
  }
]);
```

### API Usage

```javascript
// Single video analysis
const response = await fetch('/api/dreamcut/video-analyzer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    videoUrl: 'https://example.com/video.mp4',
    prompt: 'Describe what happens in this video',
    analysisType: 'content_analysis'
  })
});

// Batch analysis
const response = await fetch('/api/dreamcut/video-analyzer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    videos: [
      {
        videoUrl: 'https://example.com/video1.mp4',
        prompt: 'Analyze this video',
        analysisType: 'content_analysis'
      }
    ]
  })
});
```

### React Hook Usage

```typescript
import { useVideoAnalyzer } from '@/hooks/useVideoAnalyzer';

function MyComponent() {
  const { analyzeVideo, isLoading, lastResult, error } = useVideoAnalyzer();

  const handleAnalyze = async () => {
    const result = await analyzeVideo({
      videoUrl: 'https://example.com/video.mp4',
      prompt: 'Describe what happens in this video',
      analysisType: 'content_analysis'
    });
  };

  return (
    <div>
      <button onClick={handleAnalyze} disabled={isLoading}>
        {isLoading ? 'Analyzing...' : 'Analyze Video'}
      </button>
      {lastResult && <div>{lastResult.analysis}</div>}
    </div>
  );
}
```

## Configuration

### Environment Variables

Required environment variables:

```bash
# Required for video analysis models
REPLICATE_API_TOKEN=your_replicate_token

# Optional fallbacks
TOGETHER_AI_API_KEY=your_together_key
QWEN_API_KEY=your_qwen_key
FAL_KEY=your_fal_key

# Timeout configuration
EXTERNAL_TIMEOUT_MS=30000
```

### Model Configuration

The models are configured in `executors/video-asset-analyzer.ts`:

```typescript
const VIDEO_MODELS = [
  {
    name: 'qwen2-vl-7b-instruct',
    executor: executeQwen2VL7BInstruct,
    description: 'Latest model in the Qwen family...',
    priority: 1,
    modelId: 'lucataco/qwen2-vl-7b-instruct:...'
  },
  // ... other models
];
```

## Error Handling

The system includes comprehensive error handling:

1. **Model Failures** - Automatic fallback to next model
2. **Timeout Handling** - Configurable timeouts with retry logic
3. **URL Validation** - Pre-validation of video URLs
4. **Rate Limiting** - Exponential backoff for retries
5. **Graceful Degradation** - Multiple fallback layers

## Performance Considerations

- **Timeout Management** - Default 30-second timeout per model
- **Retry Logic** - Up to 3 retries with exponential backoff
- **Batch Processing** - Limited to 10 videos per batch
- **Concurrency Control** - Maximum 3 concurrent analyses
- **Memory Management** - Efficient model loading and cleanup

## Testing

A test page is available at `/test-video-analyzer` that provides:
- Interactive video analysis interface
- Model information display
- API usage examples
- Real-time results visualization

## Integration Points

The video analyzer integrates with:

1. **Query Analyzer** - Main analysis pipeline
2. **Supabase** - Brief storage and retrieval
3. **React Components** - UI integration
4. **API Routes** - RESTful endpoints
5. **Error Monitoring** - Comprehensive logging

## Future Enhancements

Potential improvements:
- Audio analysis integration
- Real-time video processing
- Custom model training
- Advanced caching strategies
- Performance optimization
- Additional analysis types

## Troubleshooting

Common issues and solutions:

1. **Model Timeout** - Increase timeout or check network connectivity
2. **Invalid URL** - Verify video URL format and accessibility
3. **API Key Issues** - Check environment variable configuration
4. **Rate Limiting** - Implement proper retry logic
5. **Memory Issues** - Monitor concurrent request limits

## Support

For issues or questions:
- Check the test page at `/test-video-analyzer`
- Review API documentation at `/api/dreamcut/video-analyzer`
- Examine logs for detailed error information
- Verify environment variable configuration
