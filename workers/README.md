# 🛠️ DreamCuts Worker System

A comprehensive Supabase Realtime-based worker system for processing AI video production jobs using multiple providers.

## 🎯 Overview

This worker system processes production jobs from the Phase 4 pipeline, executing them using real AI providers:

- **🎙️ ElevenLabs**: TTS with Dialog, Music Generation, Sound Effects
- **🎨 Fal.ai**: Multi-model Image Generation, Video Generation (Veo3, Wan Effects)
- **👄 Veed**: Lip Sync with fallback providers (Sync Lipsync V2, Creatify)
- **🎬 Shotstack**: Final video rendering with professional captions

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Worker Orchestrator                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │ TTS Worker  │ │Image Worker │ │Video Worker │ │   ...   │ │
│  │(ElevenLabs) │ │  (Fal.ai)   │ │  (Fal.ai)   │ │         │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
├─────────────────────────────────────────────────────────────┤
│                Supabase Realtime Channel                    │
│                    (dreamcut_jobs)                          │
├─────────────────────────────────────────────────────────────┤
│              Production Manifest Pipeline                   │
│              (Phase 4 Job Decomposition)                    │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Provider API Keys
ELEVENLABS_API_KEY=your_elevenlabs_api_key
FAL_KEY=your_fal_ai_api_key
SHOTSTACK_API_KEY=your_shotstack_api_key

# Worker Configuration
LOG_LEVEL=info
ENABLE_WORKERS=tts,image,video,lipsync,music,sound_effects,render
ENABLE_HEALTH_CHECK=true
HEALTH_CHECK_PORT=8080
```

### 2. Database Setup

Run the database migration:

```bash
npm run db:migrate:dreamcut-jobs
```

### 3. Start Workers

```bash
# Development mode
npm run worker:dev

# Production mode
npm run worker:prod
```

## 🎛️ Worker Types

### 🎙️ TTS Worker (`tts_elevenlabs`)

**Provider**: ElevenLabs Dialog API  
**Features**: Audio tags, context awareness, high-quality output  
**Port**: 3001

```typescript
// Job payload example
{
  "sceneId": "s1",
  "text": "[excited] Welcome to our tutorial",
  "voiceId": "JBFqnCBsd6RMkjVDRZzb",
  "modelId": "eleven_multilingual_v2",
  "dialogueSettings": {
    "stability": "natural",
    "use_audio_tags": true,
    "enhance_emotion": true
  }
}
```

### 🎨 Image Worker (`gen_image_falai`)

**Provider**: Fal.ai Multi-Model  
**Models**: FLUX SRPO, Nano Banana, Professional Photo, Seedream V4  
**Port**: 3002

```typescript
// Job payload example
{
  "sceneId": "s1",
  "assetId": "gen_b_roll_001",
  "prompt": "Cinematic classroom B-roll",
  "model": "flux-srpo",
  "endpoint": "fal-ai/flux/srpo",
  "imageSize": "landscape_16_9",
  "numInferenceSteps": 28,
  "guidanceScale": 4.5
}
```

### 🎬 Video Worker (`gen_video_falai`)

**Provider**: Fal.ai Video Models  
**Models**: Veo3 Fast, Wan Effects, Wan i2v, Infinitalk  
**Port**: 3003

```typescript
// Job payload example
{
  "sceneId": "s1",
  "videoId": "video_001",
  "prompt": "Dynamic opening sequence",
  "model": "veo3-fast",
  "endpoint": "fal-ai/veo3/fast",
  "duration": "8s",
  "resolution": "720p",
  "generateAudio": false
}
```

### 👄 Lip Sync Worker (`lip_sync_lypsso`)

**Primary**: Veed (`veed/lipsync`)  
**Fallbacks**: Sync Lipsync V2, Creatify Lipsync  
**Port**: 3004

```typescript
// Job payload example
{
  "sceneId": "s1",
  "audioJobId": "job_tts_s1",
  "videoAssetId": "gen_char_001",
  "provider": "veed",
  "endpoint": "veed/lipsync",
  "quality": "high",
  "fallbackProviders": [
    {
      "provider": "sync-lipsync-v2",
      "endpoint": "fal-ai/sync-lipsync/v2",
      "cost": 0.3
    }
  ]
}
```

### 🎵 Music Worker (`gen_music_elevenlabs`)

**Provider**: ElevenLabs Music  
**Features**: Smart prompts, composition plans, genre detection  
**Port**: 3005

```typescript
// Job payload example
{
  "sceneId": "s1",
  "cueId": "music_01",
  "mood": "uplift",
  "structure": "build",
  "startSec": 8,
  "durationSec": 45,
  "instructions": "Fade in gradually",
  "genre": "electronic pop",
  "tempo": "moderate to fast"
}
```

### 🔊 Sound Effects Worker (`gen_sound_effects_elevenlabs`)

**Provider**: ElevenLabs Sound Effects  
**Features**: Context-aware generation, keyword detection  
**Port**: 3006

```typescript
// Job payload example
{
  "sceneId": "s1",
  "effectId": "sound_effect_001",
  "text": "Attention-grabbing sound effect for video opening",
  "durationSeconds": 1.5,
  "loop": false,
  "promptInfluence": 0.3
}
```

### 🎬 Render Worker (`render_shotstack`)

**Provider**: Shotstack API  
**Features**: Professional captions, transitions, effects  
**Port**: 3007

```typescript
// Job payload example
{
  "manifestId": "manifest_789",
  "provider": "shotstack",
  "environment": "stage",
  "outputFormat": "mp4",
  "quality": "high",
  "resolution": { "width": 1280, "height": 720 },
  "enableCaptions": true,
  "captionStyle": {
    "fontFamily": "Montserrat ExtraBold",
    "fontSize": 28,
    "fontColor": "#ffffff",
    "backgroundColor": "#000000",
    "backgroundOpacity": 0.8,
    "position": "bottom"
  }
}
```

## 📊 Monitoring & Health Checks

### Health Check Endpoints

```bash
# Overall health
curl http://localhost:8080/health

# Detailed status
curl http://localhost:8080/status
```

### Health Check Response

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600000,
  "workers": 7,
  "activeWorkers": 7,
  "totalActiveJobs": 3
}
```

### Worker Status Response

```json
{
  "isRunning": true,
  "totalWorkers": 7,
  "activeWorkers": 7,
  "totalActiveJobs": 3,
  "uptime": 3600000,
  "workers": [
    {
      "name": "tts",
      "isRunning": true,
      "activeJobs": 1,
      "maxConcurrentJobs": 3,
      "provider": "elevenlabs",
      "features": ["audio_tags", "context_awareness", "dialogue_settings"]
    }
  ]
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SUPABASE_URL` | ✅ | - | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | - | Supabase service role key |
| `ELEVENLABS_API_KEY` | ✅ | - | ElevenLabs API key |
| `FAL_KEY` | ✅ | - | Fal.ai API key |
| `SHOTSTACK_API_KEY` | ✅ | - | Shotstack API key |
| `LOG_LEVEL` | ❌ | `info` | Logging level |
| `ENABLE_WORKERS` | ❌ | All | Comma-separated list of workers to start |
| `ENABLE_HEALTH_CHECK` | ❌ | `false` | Enable health check server |
| `HEALTH_CHECK_PORT` | ❌ | `8080` | Health check server port |
| `MAX_CONCURRENT_JOBS` | ❌ | Varies | Max concurrent jobs per worker |
| `RETRY_DELAY_MS` | ❌ | Varies | Retry delay in milliseconds |

### Worker-Specific Configuration

Each worker can be configured with specific settings:

```bash
# TTS Worker
MAX_CONCURRENT_JOBS=3
RETRY_DELAY_MS=5000

# Image Worker  
MAX_CONCURRENT_JOBS=2
RETRY_DELAY_MS=10000

# Video Worker
MAX_CONCURRENT_JOBS=1
RETRY_DELAY_MS=15000

# Render Worker
MAX_CONCURRENT_JOBS=1
RETRY_DELAY_MS=30000
```

## 🚦 Job Flow

1. **Job Creation**: Phase 4 pipeline creates jobs in `dreamcut_jobs` table
2. **Job Detection**: Workers listen to Supabase Realtime for new jobs
3. **Job Processing**: Workers process jobs using AI provider APIs
4. **Asset Storage**: Generated assets are uploaded to Supabase Storage
5. **Status Updates**: Job status is updated in the database
6. **Dependency Resolution**: Jobs with dependencies wait for prerequisites
7. **Final Render**: Render worker combines all assets into final video

## 🔄 Scaling & Performance

### Horizontal Scaling

Workers can be scaled horizontally by running multiple instances:

```bash
# Start multiple TTS workers
ENABLE_WORKERS=tts MAX_CONCURRENT_JOBS=5 npm run worker:prod &
ENABLE_WORKERS=tts MAX_CONCURRENT_JOBS=5 npm run worker:prod &
```

### Performance Optimization

- **Parallel Processing**: Multiple workers process different job types simultaneously
- **Concurrent Jobs**: Each worker can handle multiple jobs concurrently
- **Smart Dependencies**: Jobs with dependencies are processed in correct order
- **Resource Management**: Workers have configurable resource limits

## 🛡️ Error Handling & Retry Logic

### Automatic Retries

- **Max Retries**: Configurable per worker (default: 3)
- **Backoff Strategy**: Exponential backoff with jitter
- **Error Classification**: Different retry strategies for different error types

### Fallback Providers

- **Lip Sync**: Veed → Sync Lipsync V2 → Creatify
- **Image Generation**: FLUX SRPO → Nano Banana → Professional Photo
- **Video Generation**: Veo3 Fast → Wan Effects → Wan i2v

## 📝 Logging

### Log Levels

- `debug`: Detailed debugging information
- `info`: General operational information
- `warn`: Warning messages
- `error`: Error messages

### Log Format

```
[2024-01-15T10:30:00.000Z] [TTS] Processing job job_tts_s1...
[2024-01-15T10:30:05.000Z] [TTS] Job job_tts_s1 completed successfully
```

## 🔧 Development

### Running in Development

```bash
# Start with file watching
npm run worker:dev

# Start specific workers
ENABLE_WORKERS=tts,image npm run worker:dev
```

### Testing

```bash
# Run tests
npm test

# Test specific worker
npm test -- --grep "TTS Worker"
```

## 🚀 Deployment

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["npm", "run", "worker:prod"]
```

### Production Considerations

- **Resource Limits**: Set appropriate CPU and memory limits
- **Health Checks**: Configure health check endpoints
- **Monitoring**: Set up monitoring and alerting
- **Logging**: Configure centralized logging
- **Scaling**: Use container orchestration for scaling

## 📚 API Reference

### Worker Orchestrator

```typescript
// Start orchestrator
const orchestrator = await startWorkerOrchestrator();

// Get status
const status = orchestrator.getOrchestratorStatus();

// Restart worker
await orchestrator.restartWorker('tts');

// Scale workers
await orchestrator.scaleWorkers('high');

// Stop orchestrator
await orchestrator.stop();
```

### Individual Workers

```typescript
// Start TTS worker
const ttsWorker = await startTTSWorker();

// Get worker status
const status = ttsWorker.getStatus();

// Stop worker
await ttsWorker.stop();
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- **Documentation**: Check the docs folder
- **Issues**: Create a GitHub issue
- **Discussions**: Use GitHub Discussions

---

**Built with ❤️ for the DreamCuts AI Video Production Platform**
