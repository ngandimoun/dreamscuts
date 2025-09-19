# 🎬 Veo 3 Fast Audio-Off Workflow - Complete Guide

## 🚀 Overview

The **Veo 3 Fast Audio-Off Workflow** is a specialized approach designed for creating high-quality animated avatars that will be synchronized with external voice generation. This workflow ensures perfect control over voice timing, quality, and synchronization by generating video content without audio and then adding voice separately.

## 🎯 **Why Audio-Off Generation?**

### **Key Design Principles:**

1. **Perfect Voice Control**: Generate voice separately for optimal quality and timing
2. **Consistent Synchronization**: Use same prompt for both video and voice generation
3. **Cost Optimization**: Veo 3 Fast is 60-80% cheaper than standard Veo 3
4. **Quality Assurance**: Each component (video + voice) optimized independently
5. **Flexibility**: Easy to swap voices, languages, or adjust timing

### **The Audio-Off Advantage:**
- **Video Generation**: Focus purely on visual quality and animation
- **Voice Generation**: Optimized for speech quality and naturalness
- **Synchronization**: Perfect lip-sync control via Veed
- **Localization**: Easy multilingual content creation
- **Cost Efficiency**: Significant savings compared to audio-enabled generation

---

## 🎬 **Veo 3 Fast Specifications**

### **Technical Details**
- **Model**: `fal-ai/veo3/fast`
- **Duration**: Fixed 8 seconds
- **Resolution**: 720p or 1080p at 24 FPS
- **Cost**: $0.25-$0.40 per second (60-80% cheaper than standard Veo 3)
- **Audio**: **Always disabled** for this workflow
- **Quality**: Professional-grade video output

### **Pricing Comparison**
| Model | Duration | Cost per Second | Total Cost (8s) | Audio Included |
|-------|----------|-----------------|-----------------|----------------|
| **Veo 3 Fast** | 8s | $0.25-$0.40 | $2.00-$3.20 | ❌ (Audio-Off) |
| **Veo 3 Standard** | 8s | $0.50-$0.75 | $4.00-$6.00 | ✅ (Audio-On) |
| **Savings** | - | 50-60% | $2.00-$2.80 | - |

---

## 🔧 **Implementation Guide**

### **Step 1: Configure Veo 3 Fast for Audio-Off**

```typescript
import { FalAiVeo3FastImageToVideoExecutor } from '@/executors/fal-ai-veo3-fast-image-to-video';

const veo3FastExecutor = new FalAiVeo3FastImageToVideoExecutor(process.env.FAL_KEY);

// Key configuration: generate_audio: false
const videoResult = await veo3FastExecutor.generateVideo({
  prompt: "Professional CEO in business suit, confident expression, corporate office background",
  image_url: "https://example.com/avatar-image.jpg",
  aspect_ratio: "auto", // or "16:9", "9:16"
  duration: "8s", // Fixed duration
  generate_audio: false, // 🔑 CRITICAL: Always disable audio
  resolution: "720p" // or "1080p"
});
```

### **Step 2: Generate Voice Separately**

```typescript
import { ElevenLabsService } from '@/lib/elevenlabs';

const elevenLabsService = new ElevenLabsService({
  apiKey: process.env.ELEVENLABS_API_KEY
});

// Use the SAME prompt for voice generation
const voiceResult = await elevenLabsService.generateSpeech({
  text: "Professional CEO in business suit, confident expression, corporate office background",
  voice_id: "professional_corporate_voice",
  voice_settings: {
    stability: 0.75,
    similarity_boost: 0.85,
    style: 0.3,
    use_speaker_boost: true
  },
  model_id: "eleven_multilingual_v2"
});
```

### **Step 3: Synchronize with Veed**

```typescript
import { VeedLipsyncExecutor } from '@/executors/veed-lipsync';

const veedLipsyncExecutor = new VeedLipsyncExecutor(process.env.VEED_API_KEY);

// Sync the audio-off video with generated voice
const finalVideo = await veedLipsyncExecutor.generateLipsync({
  video_url: videoResult.video.url,
  audio_url: voiceResult.audio_url,
  quality: "high",
  fps: 30
});
```

---

## 🎯 **Complete Workflow Implementation**

### **Avatar Workflow Orchestrator**

```typescript
export class Veo3FastAudioOffWorkflow {
  private veo3FastExecutor: FalAiVeo3FastImageToVideoExecutor;
  private elevenLabsService: ElevenLabsService;
  private veedLipsyncExecutor: VeedLipsyncExecutor;

  constructor(apiKeys: {
    falApiKey: string;
    elevenLabsApiKey: string;
    veedApiKey: string;
  }) {
    this.veo3FastExecutor = new FalAiVeo3FastImageToVideoExecutor(apiKeys.falApiKey);
    this.elevenLabsService = new ElevenLabsService({ apiKey: apiKeys.elevenLabsApiKey });
    this.veedLipsyncExecutor = new VeedLipsyncExecutor(apiKeys.veedApiKey);
  }

  /**
   * Complete audio-off workflow: Image → Video (no audio) → Voice → Sync
   */
  async createAvatarWithAudioOff(
    imageUrl: string,
    prompt: string,
    voiceSettings: {
      voice_id: string;
      stability?: number;
      similarity_boost?: number;
      style?: number;
    }
  ) {
    // Step 1: Generate video with audio disabled
    console.log('🎬 Generating video with Veo 3 Fast (audio-off)...');
    const videoResult = await this.veo3FastExecutor.generateVideo({
      prompt: prompt,
      image_url: imageUrl,
      aspect_ratio: "auto",
      duration: "8s",
      generate_audio: false, // 🔑 Always disable audio
      resolution: "720p"
    });

    // Step 2: Generate voice with same prompt
    console.log('🎤 Generating voice with ElevenLabs...');
    const voiceResult = await this.elevenLabsService.generateSpeech({
      text: prompt, // Same prompt for consistency
      voice_id: voiceSettings.voice_id,
      voice_settings: {
        stability: voiceSettings.stability || 0.75,
        similarity_boost: voiceSettings.similarity_boost || 0.85,
        style: voiceSettings.style || 0.3,
        use_speaker_boost: true
      },
      model_id: "eleven_multilingual_v2"
    });

    // Step 3: Sync voice with video
    console.log('👄 Syncing voice with video...');
    const finalVideo = await this.veedLipsyncExecutor.generateLipsync({
      video_url: videoResult.video.url,
      audio_url: voiceResult.audio_url,
      quality: "high",
      fps: 30
    });

    return {
      video: videoResult,
      voice: voiceResult,
      finalVideo: finalVideo,
      totalCost: this.calculateTotalCost(videoResult, voiceResult, finalVideo)
    };
  }

  private calculateTotalCost(video: any, voice: any, lipsync: any): number {
    const videoCost = 8 * 0.25; // 8 seconds * $0.25 per second
    const voiceCost = 0.10; // Estimated ElevenLabs cost
    const lipsyncCost = (8 / 60) * 0.4; // 8 seconds / 60 * $0.4 per minute
    return videoCost + voiceCost + lipsyncCost;
  }
}
```

---

## 🎨 **Use Case Examples**

### **Example 1: Corporate Training Avatar**

```typescript
const workflow = new Veo3FastAudioOffWorkflow({
  falApiKey: process.env.FAL_KEY!,
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY!,
  veedApiKey: process.env.VEED_API_KEY!
});

const corporateAvatar = await workflow.createAvatarWithAudioOff(
  "https://example.com/ceo-avatar.jpg",
  "Professional CEO in business suit, confident expression, corporate office background, looking directly at camera with authoritative presence",
  {
    voice_id: "professional_corporate_voice",
    stability: 0.75,
    similarity_boost: 0.85,
    style: 0.3
  }
);

console.log(`✅ Corporate avatar created! Cost: $${corporateAvatar.totalCost.toFixed(2)}`);
```

### **Example 2: Educational Content Avatar**

```typescript
const educationalAvatar = await workflow.createAvatarWithAudioOff(
  "https://example.com/teacher-avatar.jpg",
  "Friendly teacher in casual professional attire, warm smile, classroom background, approachable and engaging expression",
  {
    voice_id: "educational_inspirational_voice",
    stability: 0.7,
    similarity_boost: 0.8,
    style: 0.4
  }
);
```

### **Example 3: Multilingual Content**

```typescript
// Generate same video, different languages
const languages = [
  { code: 'en', text: 'Welcome to our presentation. Today we will discuss the latest trends.', voice_id: 'english_professional' },
  { code: 'es', text: 'Bienvenidos a nuestra presentación. Hoy discutiremos las últimas tendencias.', voice_id: 'spanish_professional' },
  { code: 'fr', text: 'Bienvenue à notre présentation. Aujourd\'hui, nous discuterons des dernières tendances.', voice_id: 'french_professional' }
];

const multilingualResults = [];
for (const lang of languages) {
  const result = await workflow.createAvatarWithAudioOff(
    "https://example.com/presenter-avatar.jpg",
    lang.text,
    { voice_id: lang.voice_id }
  );
  multilingualResults.push({ language: lang.code, video: result });
}
```

---

## 🔄 **Batch Processing with Audio-Off**

### **Efficient Batch Processing**

```typescript
export class BatchVeo3FastProcessor {
  private workflow: Veo3FastAudioOffWorkflow;

  constructor(apiKeys: any) {
    this.workflow = new Veo3FastAudioOffWorkflow(apiKeys);
  }

  /**
   * Process multiple avatars with same base image
   */
  async processMultipleAvatars(
    baseImageUrl: string,
    prompts: string[],
    voiceSettings: any
  ) {
    // Generate base video once (audio-off)
    const baseVideo = await this.workflow.veo3FastExecutor.generateVideo({
      prompt: prompts[0], // Use first prompt for base video
      image_url: baseImageUrl,
      generate_audio: false,
      duration: "8s",
      resolution: "720p"
    });

    // Generate voices for all prompts
    const voicePromises = prompts.map(prompt =>
      this.workflow.elevenLabsService.generateSpeech({
        text: prompt,
        voice_id: voiceSettings.voice_id,
        voice_settings: voiceSettings.voice_settings
      })
    );

    const voices = await Promise.all(voicePromises);

    // Sync all voices with base video
    const syncPromises = voices.map(voice =>
      this.workflow.veedLipsyncExecutor.generateLipsync({
        video_url: baseVideo.video.url,
        audio_url: voice.audio_url,
        quality: "high",
        fps: 30
      })
    );

    const finalVideos = await Promise.all(syncPromises);

    return finalVideos.map((video, index) => ({
      prompt: prompts[index],
      video: video,
      cost: this.calculateCost(baseVideo, voices[index], video)
    }));
  }

  private calculateCost(video: any, voice: any, lipsync: any): number {
    return (8 * 0.25) + 0.10 + ((8 / 60) * 0.4);
  }
}
```

---

## 💰 **Cost Analysis & Optimization**

### **Cost Breakdown (Per 8-Second Avatar)**

| Component | Cost | Percentage |
|-----------|------|------------|
| **Veo 3 Fast (Audio-Off)** | $2.00 | 85% |
| **ElevenLabs Voice** | $0.10 | 4% |
| **Veed Lip Sync** | $0.05 | 2% |
| **Total** | **$2.15** | **100%** |

### **Cost Comparison with Audio-Enabled**

| Approach | Cost | Savings |
|----------|------|---------|
| **Veo 3 Fast (Audio-Off)** | $2.15 | - |
| **Veo 3 Standard (Audio-On)** | $4.00 | $1.85 (46%) |
| **Veo 3 Premium (Audio-On)** | $6.00 | $3.85 (64%) |

### **Optimization Strategies**

1. **Reuse Base Video**: Generate video once, create multiple voice variations
2. **Batch Processing**: Process multiple avatars simultaneously
3. **Resolution Selection**: Use 720p for most use cases, 1080p only when needed
4. **Voice Optimization**: Choose appropriate voice settings for quality vs. cost

---

## 🎯 **Best Practices**

### **Video Generation**
- ✅ **Always set `generate_audio: false`**
- ✅ **Use consistent prompts** between image and video generation
- ✅ **Optimize for 8-second duration** for cost efficiency
- ✅ **Choose appropriate resolution** (720p for most cases)

### **Voice Generation**
- ✅ **Use same prompt** as video generation for consistency
- ✅ **Test voice settings** for optimal quality
- ✅ **Choose appropriate voice model** for your use case
- ✅ **Optimize voice length** to match video duration

### **Synchronization**
- ✅ **Use high-quality audio** for best lip-sync results
- ✅ **Ensure audio and video durations match**
- ✅ **Test sync quality** before final output
- ✅ **Use appropriate FPS** (24 for cinematic, 30 for standard)

### **Error Handling**
- ✅ **Validate input URLs** before processing
- ✅ **Handle API rate limits** gracefully
- ✅ **Implement retry logic** for failed requests
- ✅ **Monitor costs** and set limits

---

## 🔧 **Advanced Configuration**

### **Custom Video Settings**

```typescript
const customVideoSettings = {
  prompt: "Your detailed prompt here",
  image_url: "https://example.com/image.jpg",
  aspect_ratio: "16:9", // "auto", "16:9", "9:16"
  duration: "8s", // Fixed duration
  generate_audio: false, // Always false for this workflow
  resolution: "1080p", // "720p" or "1080p"
  guidance_scale: 7.5, // Optional: control prompt adherence
  num_inference_steps: 30 // Optional: control quality vs. speed
};
```

### **Custom Voice Settings**

```typescript
const customVoiceSettings = {
  text: "Your text here",
  voice_id: "your_voice_id",
  voice_settings: {
    stability: 0.75, // 0.0-1.0, higher = more consistent
    similarity_boost: 0.85, // 0.0-1.0, higher = more similar to original
    style: 0.3, // 0.0-1.0, higher = more expressive
    use_speaker_boost: true // Enhance speaker characteristics
  },
  model_id: "eleven_multilingual_v2", // or "eleven_turbo_v2"
  output_format: "mp3_44100_128" // Audio format
};
```

### **Custom Sync Settings**

```typescript
const customSyncSettings = {
  video_url: "https://example.com/video.mp4",
  audio_url: "https://example.com/audio.mp3",
  quality: "high", // "low", "medium", "high"
  fps: 30, // 24, 30, 60
  start_time: 0, // Optional: start time in seconds
  end_time: 8 // Optional: end time in seconds
};
```

---

## 🚀 **Getting Started**

### **Quick Start Example**

```typescript
import { Veo3FastAudioOffWorkflow } from './workflows/veo3-fast-audio-off';

// Initialize workflow
const workflow = new Veo3FastAudioOffWorkflow({
  falApiKey: process.env.FAL_KEY!,
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY!,
  veedApiKey: process.env.VEED_API_KEY!
});

// Create your first audio-off avatar
const avatar = await workflow.createAvatarWithAudioOff(
  "https://example.com/your-avatar-image.jpg",
  "Professional presenter explaining the latest technology trends, confident and engaging expression",
  {
    voice_id: "professional_voice",
    stability: 0.75,
    similarity_boost: 0.85,
    style: 0.3
  }
);

console.log(`✅ Avatar created! Final video: ${avatar.finalVideo.video.url}`);
console.log(`💰 Total cost: $${avatar.totalCost.toFixed(2)}`);
```

### **Environment Setup**

```bash
# Required environment variables
FAL_KEY=your_fal_ai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
VEED_API_KEY=your_veed_api_key
```

---

## 📚 **Related Documentation**

- [AI Avatar Workflow System](./ai-avatar-workflow-system.md)
- [AI Avatar Image Models Guide](./ai-avatar-image-models-guide.md)
- [Veo 3 Fast Usage Guide](./veo3-fast-usage.md)
- [ElevenLabs Integration Guide](./elevenlabs-integration.md)
- [Veed Lipsync Usage Guide](./veed-lipsync-usage.md)

---

## 🎯 **Conclusion**

The **Veo 3 Fast Audio-Off Workflow** provides a cost-effective, high-quality solution for creating synchronized video avatars. By separating video generation from voice generation, you gain:

- **Cost Savings**: 46-64% cheaper than audio-enabled generation
- **Quality Control**: Optimize each component independently
- **Flexibility**: Easy voice swapping and localization
- **Consistency**: Same prompt ensures content alignment
- **Scalability**: Efficient batch processing capabilities

This workflow is perfect for creating professional avatars for corporate training, educational content, marketing materials, and any application requiring high-quality, synchronized video content.

**Ready to create your first audio-off avatar? Start with the Quick Start example above and explore the endless possibilities of AI-powered video content creation!**
