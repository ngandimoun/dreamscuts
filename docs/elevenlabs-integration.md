# ElevenLabs Integration Guide

This guide explains how to use the ElevenLabs Text to Speech and Text to Dialogue integration in your project. The integration focuses on Eleven v3 model and provides a clean, TypeScript-first API for generating high-quality speech and expressive dialogue from text.

## Table of Contents

- [Setup](#setup)
- [Configuration](#configuration)
- [Basic Usage](#basic-usage)
- [Text to Dialogue](#text-to-dialogue)
- [Audio Tags](#audio-tags)
- [Advanced Features](#advanced-features)
- [Voice Management](#voice-management)
- [Audio Handling](#audio-handling)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [API Reference](#api-reference)

## Setup

### 1. Install Dependencies

The required dependencies are already installed in your project:

```bash
npm install @elevenlabs/elevenlabs-js dotenv --legacy-peer-deps
```

### 2. Environment Configuration

Create a `.env.local` file in your project root (copy from `env.example`):

```env
# ElevenLabs API Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Optional: Default voice ID for Text to Speech
ELEVENLABS_DEFAULT_VOICE_ID=JBFqnCBsd6RMkjVDRZzb

# Optional: Default model ID (Eleven v3 is recommended)
ELEVENLABS_DEFAULT_MODEL_ID=eleven_multilingual_v2
```

### 3. Get Your API Key

1. Visit [ElevenLabs Dashboard](https://elevenlabs.io/app/settings/api-keys)
2. Create a new API key
3. Copy the key to your `.env.local` file

## Configuration

### Basic Configuration

```typescript
import { ElevenLabsService } from '@/lib/elevenlabs';

// Using environment variables (recommended)
const service = new ElevenLabsService();

// Or with custom configuration
const service = new ElevenLabsService({
  apiKey: 'your-api-key',
  defaultVoiceId: 'JBFqnCBsd6RMkjVDRZzb',
  defaultModelId: 'eleven_multilingual_v2',
  defaultOutputFormat: 'mp3_44100_128'
});
```

### Voice Settings

```typescript
import type { VoiceSettings } from '@/lib/elevenlabs';

const voiceSettings: VoiceSettings = {
  stability: 0.5,        // 0.0-1.0: Voice stability and emotional range
  similarity_boost: 0.75, // 0.0-1.0: Adherence to original voice
  style: 0.0,            // 0.0-1.0: Style exaggeration (Eleven v3 only)
  use_speaker_boost: true, // Boosts similarity to original speaker
  speed: 1.0             // 0.25-4.0: Speech speed
};
```

## Basic Usage

### Simple Text to Speech

```typescript
import { elevenLabs } from '@/lib/elevenlabs';

async function speak() {
  try {
    const result = await elevenLabs.speak(
      "Hello! This is a test of ElevenLabs Text to Speech.",
      {
        voiceId: "JBFqnCBsd6RMkjVDRZzb",
        modelId: "eleven_multilingual_v2"
      }
    );

    // Play the audio
    await elevenLabs.playAudio(result.audio, result.output_format);
  } catch (error) {
    console.error('Speech generation failed:', error);
  }
}
```

### Using Voice Manager

```typescript
import { voiceManager } from '@/lib/elevenlabs';

async function findPerfectVoice() {
  // Get all voices
  const voices = await voiceManager.getVoices();
  
  // Search for specific voices
  const narrationVoices = await voiceManager.searchVoices({
    category: 'premade',
    useCase: 'narration',
    gender: 'male'
  });
  
  // Get recommended voices
  const recommended = await voiceManager.getRecommendedVoices();
  console.log('Narration voices:', recommended.forNarration);
}
```

## Text to Dialogue

The Text to Dialogue feature allows you to create immersive, natural-sounding dialogue with expressive audio tags using the Eleven v3 model. This is perfect for creating conversations, character voices, and dynamic audio content.

### Basic Text to Dialogue

```typescript
import { elevenLabs } from '@/lib/elevenlabs';

async function createDialogue() {
  const result = await elevenLabs.dialogue(
    `[excited] Hello there! [whispers] I have a secret to tell you. [laughs] Just kidding!`,
    {
      voiceId: "JBFqnCBsd6RMkjVDRZzb",
      dialogueSettings: {
        stability: 'creative',
        use_audio_tags: true,
        enhance_emotion: true
      }
    }
  );

  await elevenLabs.playAudio(result.audio);
}
```

### Multi-Speaker Dialogue

```typescript
async function multiSpeakerDialogue() {
  const speakers = [
    {
      name: "Alice",
      voice_id: "voice_id_1",
      lines: [
        "[excitedly] Sam! Have you tried the new Eleven V3?",
        "[impressed] The clarity is amazing!"
      ]
    },
    {
      name: "Bob", 
      voice_id: "voice_id_2",
      lines: [
        "[curiously] Just got it! I can actually do whispers now—",
        "[whispers] like this!"
      ]
    }
  ];

  const results = await elevenLabs.multiSpeakerDialogue(speakers, {
    dialogueSettings: {
      stability: 'natural',
      use_audio_tags: true,
      multi_speaker: true
    }
  });

  // Play each speaker's lines
  for (const result of results) {
    await elevenLabs.playAudio(result.audio);
  }
}
```

## Audio Tags

Audio tags are special markers that control the emotional delivery and expression of the generated speech. They are enclosed in square brackets and placed within the text.

### Available Audio Tags

#### Voice-related Tags
- `[laughs]`, `[laughs harder]`, `[starts laughing]`, `[wheezing]`
- `[whispers]`, `[sighs]`, `[exhales]`
- `[sarcastic]`, `[curious]`, `[excited]`, `[crying]`
- `[happy]`, `[sad]`, `[angry]`, `[surprised]`

#### Sound Effects
- `[gunshot]`, `[applause]`, `[clapping]`, `[explosion]`
- `[swallows]`, `[gulps]`

#### Special Tags
- `[sings]`, `[strong French accent]`, `[strong Russian accent]`

### Audio Tag Management

```typescript
import { dialogueManager } from '@/lib/elevenlabs';

// Get all available audio tags
const allTags = dialogueManager.getAllAudioTags();

// Get tags by category
const emotionTags = dialogueManager.getAudioTagsByCategory('emotions');
const nonVerbalTags = dialogueManager.getAudioTagsByCategory('nonVerbal');

// Search for specific tags
const laughTags = dialogueManager.searchAudioTags('laugh');

// Validate audio tags in text
const validation = dialogueManager.validateAudioTags(text);

// Extract audio tags from text
const extractedTags = dialogueManager.extractAudioTags(text);

// Remove audio tags from text
const cleanText = dialogueManager.removeAudioTags(text);
```

### Text Enhancement

```typescript
// Automatically enhance text with audio tags
const enhancedText = elevenLabs.enhanceTextWithAudioTags(
  "Hello! How are you today?",
  {
    enhance_emotion: true,
    add_audio_tags: true,
    max_tags_per_sentence: 2
  }
);

// Result: "[excited] Hello! [questioning] How are you today?"
```

### Dialogue Settings

```typescript
// Get optimized settings for different use cases
const conversationSettings = dialogueManager.getDialogueSettingsForUseCase('conversation');
const characterSettings = dialogueManager.getDialogueSettingsForUseCase('character');

// Stability levels
const creativeSettings = dialogueManager.getDialogueOptimizedVoiceSettings('creative');
const naturalSettings = dialogueManager.getDialogueOptimizedVoiceSettings('natural');
const robustSettings = dialogueManager.getDialogueOptimizedVoiceSettings('robust');
```

## Advanced Features

### Streaming Text to Speech

```typescript
import { ElevenLabsService } from '@/lib/elevenlabs';

async function streamingExample() {
  const service = new ElevenLabsService();
  
  const audioStream = await service.textToSpeechStream({
    text: "This is a streaming example...",
    voiceId: "JBFqnCBsd6RMkjVDRZzb",
    optimize_streaming_latency: 2
  });

  // Process stream in real-time
  for await (const chunk of audioStream) {
    console.log(`Received ${chunk.length} bytes`);
    // Process chunk...
  }
}
```

### Multi-language Support

```typescript
async function multiLanguageExample() {
  const texts = [
    { text: "Hello, how are you?", language: "en" },
    { text: "Hola, ¿cómo estás?", language: "es" },
    { text: "Bonjour, comment allez-vous?", language: "fr" }
  ];

  for (const { text, language } of texts) {
    const voices = await voiceManager.findVoicesByLanguage(language);
    if (voices.length > 0) {
      const result = await elevenLabs.speak(text, {
        voiceId: voices[0].voice_id,
        languageCode: language
      });
      await elevenLabs.playAudio(result.audio);
    }
  }
}
```

### Character Voice Generation

```typescript
async function characterVoice() {
  const characterVoices = await voiceManager.getRecommendedVoices();
  const characterVoice = characterVoices.forCharacterVoices[0];
  
  const characterSettings = voiceManager.getDefaultVoiceSettings('character');
  
  const result = await elevenLabs.speak(
    "Greetings, traveler! I am the wise wizard of the forest.",
    {
      voiceId: characterVoice.voice_id,
      voiceSettings: characterSettings
    }
  );

  const player = elevenLabs.createAudioPlayer(result.audio);
  player.setPlaybackRate(0.9); // Slower for dramatic effect
  await player.play();
}
```

## Voice Management

### Finding Voices

```typescript
// By name
const voices = await voiceManager.findVoicesByName("George");

// By category
const premadeVoices = await voiceManager.findVoicesByCategory('premade');

// By language
const englishVoices = await voiceManager.findVoicesByLanguage('en');

// Complex search
const results = await voiceManager.searchVoices({
  category: 'premade',
  gender: 'female',
  age: 'young',
  useCase: 'conversation'
});
```

### Voice Settings by Use Case

```typescript
// Get optimized settings for different use cases
const narrationSettings = voiceManager.getDefaultVoiceSettings('narration');
const conversationSettings = voiceManager.getDefaultVoiceSettings('conversation');
const announcementSettings = voiceManager.getDefaultVoiceSettings('announcement');
const characterSettings = voiceManager.getDefaultVoiceSettings('character');
```

## Audio Handling

### Audio Player with Controls

```typescript
import { AudioUtils } from '@/lib/elevenlabs';

async function audioPlayerExample() {
  const result = await elevenLabs.speak("This is a test message.");
  
  const player = elevenLabs.createAudioPlayer(result.audio);
  
  // Set up event listeners
  player.onEnded(() => console.log('Playback finished'));
  player.onTimeUpdate((time) => console.log(`Time: ${AudioUtils.formatDuration(time)}`));
  
  // Control playback
  await player.play();
  player.setVolume(0.8);
  player.setPlaybackRate(1.2);
  
  // Later...
  player.pause();
  player.setCurrentTime(10); // Jump to 10 seconds
  await player.play();
}
```

### Audio Download

```typescript
async function downloadExample() {
  const result = await elevenLabs.speak("This will be downloaded.");
  
  // Download with custom filename
  elevenLabs.downloadAudio(
    result.audio,
    `speech_${Date.now()}.mp3`,
    result.output_format
  );
}
```

### Waveform Visualization

```typescript
async function waveformExample() {
  const result = await elevenLabs.speak("Generate waveform data for this audio.");
  
  const waveformData = await AudioUtils.createWaveformData(result.audio, 100);
  console.log('Waveform data:', waveformData);
  
  // Use waveformData for visualization
}
```

## Error Handling

### Robust Error Handling

```typescript
async function robustSpeechGeneration(text: string, maxRetries = 3) {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await elevenLabs.speak(text);
      return result;
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`Failed after ${maxRetries} attempts: ${lastError?.message}`);
}
```

### Connection Validation

```typescript
async function validateConnection() {
  const isConnected = await elevenLabs.validateConnection();
  
  if (!isConnected) {
    console.error('Cannot connect to ElevenLabs API');
    return;
  }
  
  console.log('Connected to ElevenLabs API');
}
```

## Best Practices

### 1. Voice Selection

- Use **premade voices** for consistent, professional results
- Use **character voices** for dynamic, emotional content
- Match voice language to your content language
- Test different voices for your specific use case

### 2. Voice Settings

- **Stability**: Higher values (0.7-0.9) for consistent narration
- **Similarity Boost**: Higher values (0.8-0.9) for voice cloning
- **Style**: Use with Eleven v3 for character voices (0.3-0.7)
- **Speed**: 0.8-1.2 for most use cases

### 3. Performance Optimization

- Use **streaming** for real-time applications
- Use **lower quality formats** for mobile/web (mp3_44100_64)
- Use **higher quality formats** for production (mp3_44100_192)
- Implement **caching** for frequently used voices

### 4. Cost Management

```typescript
// Monitor usage
const stats = await elevenLabs.getUsageStats();
console.log(`Characters used: ${stats.characters_used}/${stats.characters_limit}`);

// Estimate costs
const text = "Your text here";
const estimatedCost = text.length * 0.0003; // Approximate cost per character
```

### 5. Text Preparation

- Remove unnecessary punctuation for better pronunciation
- Use proper spacing and capitalization
- Break long texts into smaller chunks for better quality
- Use descriptive text for emotional context: "she said excitedly"

## API Reference

### ElevenLabsService

Main service class for ElevenLabs integration.

```typescript
class ElevenLabsService {
  constructor(config?: Partial<ElevenLabsConfig>)
  
  async textToSpeech(options: TextToSpeechOptions): Promise<TextToSpeechResponse>
  async textToDialogue(options: TextToDialogueOptions): Promise<TextToDialogueResponse>
  async multiSpeakerDialogue(options: MultiSpeakerOptions): Promise<MultiSpeakerResult[]>
  async textToSpeechStream(options: StreamingOptions): Promise<AsyncIterable<Uint8Array>>
  async getVoices(options?: VoiceSearchOptions): Promise<VoiceListResponse>
  async getVoice(voiceId: string): Promise<Voice | null>
  async getUsageStats(): Promise<UsageStats>
  async getModels(): Promise<Model[]>
  async validateConnection(): Promise<boolean>
}
```

### VoiceManager

Utility class for voice management and selection.

```typescript
class VoiceManager {
  async getVoices(forceRefresh?: boolean): Promise<Voice[]>
  async findVoicesByName(name: string): Promise<Voice[]>
  async findVoicesByCategory(category: VoiceCategory): Promise<Voice[]>
  async findVoicesByLanguage(language: LanguageCode): Promise<Voice[]>
  async searchVoices(criteria: VoiceSearchCriteria): Promise<Voice[]>
  async getRecommendedVoices(): Promise<RecommendedVoices>
  getDefaultVoiceSettings(useCase: UseCase): VoiceSettings
}
```

### DialogueManager

Utility class for dialogue management and audio tag handling.

```typescript
class DialogueManager {
  static getAllAudioTags(): AudioTag[]
  static getAudioTagsByCategory(category: string): AudioTag[]
  static searchAudioTags(keyword: string): AudioTag[]
  static getRecommendedTagsForEmotion(emotion: string): AudioTag[]
  static enhanceTextWithAudioTags(text: string, options?: DialogueEnhancementOptions): string
  static createMultiSpeakerDialogue(speakers: Speaker[], settings?: DialogueSettings): MultiSpeakerDialogue
  static formatMultiSpeakerDialogue(dialogue: MultiSpeakerDialogue): string
  static getDialogueSettingsForUseCase(useCase: string): DialogueSettings
  static validateAudioTags(text: string): ValidationResult
  static extractAudioTags(text: string): AudioTag[]
  static removeAudioTags(text: string): string
  static getDialogueOptimizedVoiceSettings(stability: string): VoiceSettings
  static getDialogueExamples(): DialogueExample[]
}
```

### AudioUtils

Utility class for audio processing and playback.

```typescript
class AudioUtils {
  static createAudioElement(audioBuffer: ArrayBuffer, format: AudioOutputFormat): HTMLAudioElement
  static playAudio(audioBuffer: ArrayBuffer, format: AudioOutputFormat): Promise<void>
  static downloadAudio(audioBuffer: ArrayBuffer, filename: string, format: AudioOutputFormat): void
  static createAudioPlayer(audioBuffer: ArrayBuffer, format: AudioOutputFormat): AudioPlayer
  static createWaveformData(audioBuffer: ArrayBuffer, samples: number): Promise<number[]>
  static formatDuration(seconds: number): string
  static estimateDuration(text: string, wordsPerMinute: number): number
}
```

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify the key is correct in your `.env.local` file
   - Check if the key has expired or been revoked
   - Ensure the key has the necessary permissions

2. **Audio Not Playing**
   - Check browser audio permissions
   - Verify the audio format is supported
   - Try a different output format

3. **Voice Not Found**
   - Use `voiceManager.getVoices()` to see available voices
   - Check if the voice ID is correct
   - Verify the voice is available for your account tier

4. **Rate Limiting**
   - Implement retry logic with exponential backoff
   - Monitor your usage statistics
   - Consider upgrading your ElevenLabs plan

### Getting Help

- Check the [ElevenLabs Documentation](https://elevenlabs.io/docs)
- Review the example files in `/examples/elevenlabs-usage-examples.ts`
- Test with the provided examples to verify your setup

## Examples

See the example files for comprehensive demonstrations:

### Text to Speech Examples
`/examples/elevenlabs-usage-examples.ts` includes:
- Basic text to speech
- Voice selection and management
- Multi-language support
- Streaming audio
- Character voice generation
- Batch processing
- Audio management
- Error handling
- React integration

### Text to Dialogue Examples
`/examples/elevenlabs-dialogue-examples.ts` includes:
- Basic dialogue with audio tags
- Multi-speaker conversations
- Customer service simulations
- Humorous dialogue examples
- Audio tag management
- Text enhancement
- Dialogue settings optimization
- Complex multi-speaker scenes

## Support

For issues specific to this integration, check the code comments and examples. For ElevenLabs API issues, refer to the [ElevenLabs Support](https://elevenlabs.io/help).
