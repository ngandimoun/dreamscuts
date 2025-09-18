# ElevenLabs Integration Setup Complete! 🎉

Your ElevenLabs Text to Speech integration is now ready to use. Here's everything that has been set up for you:

## 📁 Files Created

### Core Integration
- `lib/elevenlabs/types.ts` - TypeScript types and interfaces
- `lib/elevenlabs/service.ts` - Main ElevenLabs service class
- `lib/elevenlabs/voice-manager.ts` - Voice management utilities
- `lib/elevenlabs/dialogue-manager.ts` - Dialogue and audio tag management
- `lib/elevenlabs/v3-voice-library.ts` - V3 optimized voice library
- `lib/elevenlabs/language-manager.ts` - Multilingual language management
- `lib/elevenlabs/v3-prompting-guide.ts` - Official v3 prompting guide features
- `lib/elevenlabs/sound-effects-manager.ts` - Sound effects management and prompting
- `lib/elevenlabs/voice-design-manager.ts` - Voice design management and prompting
- `lib/elevenlabs/music-manager.ts` - Music generation management and prompting
- `lib/elevenlabs/pricing-manager.ts` - Pricing, usage tracking, and cost management
- `lib/elevenlabs/audio-utils.ts` - Audio processing utilities
- `lib/elevenlabs/index.ts` - Main export file

### API Routes
- `app/api/elevenlabs/text-to-speech/route.ts` - Text to speech endpoint
- `app/api/elevenlabs/text-to-dialogue/route.ts` - Text to dialogue endpoint
- `app/api/elevenlabs/voices/route.ts` - Voice listing endpoint
- `app/api/elevenlabs/audio-tags/route.ts` - Audio tag management endpoint
- `app/api/elevenlabs/v3-voices/route.ts` - V3 voice library endpoint
- `app/api/elevenlabs/languages/route.ts` - Language management endpoint
- `app/api/elevenlabs/v3-prompting/route.ts` - V3 prompting guide endpoint
- `app/api/elevenlabs/sound-effects/route.ts` - Sound effects generation endpoint
- `app/api/elevenlabs/voice-design/route.ts` - Voice design and creation endpoint
- `app/api/elevenlabs/music/route.ts` - Music generation and composition endpoint
- `app/api/elevenlabs/pricing/route.ts` - Pricing, usage tracking, and cost management endpoint
- `app/api/elevenlabs/usage/route.ts` - Usage statistics endpoint

### Components & Pages
- `components/elevenlabs/TextToSpeechDemo.tsx` - React demo component
- `components/elevenlabs/TextToDialogueDemo.tsx` - React dialogue demo component
- `app/test-elevenlabs/page.tsx` - Test page for the integration

### Documentation & Examples
- `docs/elevenlabs-integration.md` - Comprehensive integration guide
- `examples/elevenlabs-usage-examples.ts` - Text to Speech usage examples
- `examples/elevenlabs-dialogue-examples.ts` - Text to Dialogue usage examples
- `examples/elevenlabs-v3-voice-examples.ts` - V3 voice library examples
- `examples/elevenlabs-multilingual-examples.ts` - Multilingual usage examples
- `examples/elevenlabs-v3-prompting-examples.ts` - V3 prompting guide examples
- `examples/elevenlabs-sound-effects-examples.ts` - Sound effects generation examples
- `examples/elevenlabs-voice-design-examples.ts` - Voice design and creation examples
- `examples/elevenlabs-music-examples.ts` - Music generation and composition examples
- `examples/elevenlabs-pricing-examples.ts` - Pricing, usage tracking, and cost management examples
- `env.example` - Environment configuration template

## 🚀 Quick Start

### 1. Set Up Environment Variables

Create a `.env.local` file in your project root:

```env
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_DEFAULT_VOICE_ID=JBFqnCBsd6RMkjVDRZzb
ELEVENLABS_DEFAULT_MODEL_ID=eleven_multilingual_v2
```

### 2. Get Your API Key

1. Visit [ElevenLabs Dashboard](https://elevenlabs.io/app/settings/api-keys)
2. Create a new API key
3. Copy it to your `.env.local` file

### 3. Test the Integration

Visit `/test-elevenlabs` in your application to test the integration with a full-featured demo interface.

## 💡 Basic Usage

### Simple Text to Speech

```typescript
import { elevenLabs } from '@/lib/elevenlabs';

// Generate speech
const result = await elevenLabs.speak("Hello, world!");

// Play the audio
await elevenLabs.playAudio(result.audio);
```

### Voice Selection

```typescript
import { voiceManager } from '@/lib/elevenlabs';

// Get all voices
const voices = await voiceManager.getVoices();

// Find specific voices
const narrationVoices = await voiceManager.searchVoices({
  category: 'premade',
  useCase: 'narration'
});
```

### Text to Dialogue

```typescript
import { elevenLabs } from '@/lib/elevenlabs';

// Create expressive dialogue with audio tags
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
```

### V3 Voice Library

```typescript
import { v3VoiceLibrary } from '@/lib/elevenlabs';

// Get all V3 optimized voices
const v3Voices = v3VoiceLibrary.getAllV3Voices();

// Get voices by category
const characterVoices = v3VoiceLibrary.getVoicesByCategory('CHARACTERS');
const dialogueVoices = v3VoiceLibrary.getVoicesByRecommendation('DIALOGUE_EXCELLENT');

// Search voices
const jamesVoices = v3VoiceLibrary.searchVoices('James');

// Get voice with recommended settings
const james = v3VoiceLibrary.getVoiceById('JBFqnCBsd6RMkjVDRZzb');
const settings = v3VoiceLibrary.getRecommendedSettings('JBFqnCBsd6RMkjVDRZzb');

// Use with dialogue
const result = await elevenLabs.dialogue(
  "[excited] Hello from James! [whispers] I'm perfect for storytelling.",
  {
    voiceId: james?.voice_id,
    voiceSettings: settings,
    dialogueSettings: {
      stability: james?.stability_recommendation,
      use_audio_tags: true,
      enhance_emotion: true
    }
  }
);
```

### Multilingual Support

```typescript
import { languageManager, elevenLabs } from '@/lib/elevenlabs';

// Get all supported languages (70+ languages)
const allLanguages = languageManager.getAllLanguages();

// Get major languages
const majorLanguages = languageManager.getMajorLanguages();

// Detect language from text
const detectedLanguage = languageManager.detectLanguageFromText("Hola, ¿cómo estás?");
// Returns: 'es' (Spanish)

// Same voice speaking different languages
const james = v3VoiceLibrary.getVoiceById('JBFqnCBsd6RMkjVDRZzb');

// English
const englishResult = await elevenLabs.dialogue(
  "[excited] Hello! Welcome to our demonstration!",
  {
    voiceId: james?.voice_id,
    languageCode: 'en',
    dialogueSettings: { use_audio_tags: true }
  }
);

// Spanish
const spanishResult = await elevenLabs.dialogue(
  "[excited] ¡Hola! ¡Bienvenidos a nuestra demostración!",
  {
    voiceId: james?.voice_id,
    languageCode: 'es',
    dialogueSettings: { use_audio_tags: true }
  }
);

// French
const frenchResult = await elevenLabs.dialogue(
  "[excited] Bonjour! Bienvenue à notre démonstration!",
  {
    voiceId: james?.voice_id,
    languageCode: 'fr',
    dialogueSettings: { use_audio_tags: true }
  }
);
```

### V3 Prompting Guide

```typescript
import { v3PromptingGuide, elevenLabs } from '@/lib/elevenlabs';

// Get official v3 audio tags
const v3AudioTags = v3PromptingGuide.getAllV3AudioTags();
const voiceRelatedTags = v3PromptingGuide.getV3AudioTagsByCategory('voiceRelated');

// Get v3 stability settings with guidance
const stabilitySettings = v3PromptingGuide.getV3StabilitySettings();
// Returns: { creative: {...}, natural: {...}, robust: {...} }

// Get recommended v3 voice settings
const voiceSettings = v3PromptingGuide.getRecommendedV3VoiceSettings('creative');
const dialogueSettings = v3PromptingGuide.getRecommendedV3DialogueSettings('natural');

// Validate text length for v3 (recommended >250 characters)
const validation = v3PromptingGuide.validateV3TextLength(text);
console.log(validation.recommendation);

// Get official v3 examples
const examples = v3PromptingGuide.getV3Examples();
// Returns: { expressiveMonologue, multiSpeakerDialogue, customerServiceSimulation }

// Use with dialogue generation
const result = await elevenLabs.dialogue(
  "[excited] This is a v3 optimized prompt! [laughs] It's longer than 250 characters for best results.",
  {
    voiceId: voiceId,
    modelId: 'eleven_multilingual_v2',
    dialogueSettings: v3PromptingGuide.getRecommendedV3DialogueSettings('creative'),
    voiceSettings: v3PromptingGuide.getRecommendedV3VoiceSettings('creative')
  }
);
```

### Sound Effects Generation

```typescript
import { elevenLabs, soundEffectsManager } from '@/lib/elevenlabs';

// Generate basic sound effects
const result = await elevenLabs.generateSoundEffect("Glass shattering on concrete", {
  duration_seconds: 3.0,
  prompt_influence: 0.3
});

// Generate complex sequences
const sequenceResult = await elevenLabs.generateSoundEffect(
  "Footsteps on gravel, then a metallic door opens",
  {
    duration_seconds: 5.0,
    prompt_influence: 0.4
  }
);

// Generate musical elements
const musicalResult = await elevenLabs.generateSoundEffect(
  "90s hip-hop drum loop, 90 BPM",
  {
    duration_seconds: 4.0,
    loop: true,
    prompt_influence: 0.5
  }
);

// Generate cinematic effects
const cinematicResult = await elevenLabs.generateSoundEffect(
  "Cinematic braam, horror",
  {
    duration_seconds: 3.0,
    prompt_influence: 0.6
  }
);

// Get sound effects guidance
const categories = soundEffectsManager.getSoundEffectCategories();
const guide = soundEffectsManager.getPromptingGuide('cinematic');
const examples = soundEffectsManager.getExamplesByCategory('impact');

// Get recommended options for a category
const recommendedOptions = soundEffectsManager.getRecommendedOptions('ambience', 'Soft rain on leaves');

// Validate sound effect text
const validation = soundEffectsManager.validateSoundEffectText("Thunder rumbling");
console.log(validation.isValid, validation.suggestions);
```

### Voice Design

```typescript
import { elevenLabs, voiceDesignManager } from '@/lib/elevenlabs';

// Design a voice from text description
const designResult = await elevenLabs.designVoice(
  "A professional female narrator with perfect audio quality, ideal for educational content",
  {
    text: "Welcome to today's lesson. I'm excited to share this knowledge with you.",
    guidance_scale: 30,
    loudness: 0.5
  }
);

// Create a voice from generated preview
const createResult = await elevenLabs.createVoice(
  "Educational Narrator",
  "A professional female narrator with perfect audio quality, ideal for educational content",
  designResult.previews[0].generated_voice_id,
  {
    labels: {
      category: 'educational',
      use_case: 'narration'
    }
  }
);

// Get voice design guidance
const categories = voiceDesignManager.getVoiceDesignCategories();
const guide = voiceDesignManager.getPromptingGuide('professional');
const examples = voiceDesignManager.getVoiceDesignExamples();

// Validate voice description
const validation = voiceDesignManager.validateVoiceDescription("A calm male narrator");
console.log(validation.isValid, validation.suggestions);

// Analyze voice description
const analysis = voiceDesignManager.analyzeVoiceDescription("A professional male narrator with perfect audio quality");
console.log(analysis.score, analysis.strengths, analysis.improvements);

// Generate preview text
const previewText = voiceDesignManager.generatePreviewText("A wise old wizard with a mystical voice", 'character');
```

### Music Generation

```typescript
import { elevenLabs, musicManager } from '@/lib/elevenlabs';

// Generate music from text prompt
const result = await elevenLabs.composeMusic(
  "Create an intense, fast-paced electronic track for a high-adrenaline video game scene. Use driving synth arpeggios, punchy drums, distorted bass, glitch effects, and aggressive rhythmic textures. The tempo should be fast, 130–150 bpm, with rising tension, quick transitions, and dynamic energy bursts.",
  {
    music_length_ms: 60000 // 1 minute
  }
);

// Generate music with detailed response
const detailedResult = await elevenLabs.composeMusicDetailed(
  "Write a raw, emotionally charged track that fuses alternative R&B, gritty soul, indie rock, and folk. The song should still feel like a live, one-take, emotionally spontaneous performance.",
  {
    music_length_ms: 180000 // 3 minutes
  }
);

// Stream music generation
for await (const chunk of elevenLabs.streamMusic("Create a 30-second ambient track with soft pads and gentle percussion", {
  music_length_ms: 30000
})) {
  // Process each chunk as it arrives
  console.log(`Received chunk: ${chunk.byteLength} bytes`);
}

// Create composition plan
const compositionPlan = await elevenLabs.createCompositionPlan(
  "Create an upbeat pop song with catchy melodies and energetic drums",
  60000
);

// Generate music from composition plan
const planResult = await elevenLabs.composeMusic("", {
  composition_plan: compositionPlan,
  music_length_ms: 60000
});

// Get music guidance
const genres = musicManager.getMusicGenres();
const moods = musicManager.getMusicMoods();
const instruments = musicManager.getMusicInstruments();
const categories = musicManager.getMusicCategories();

// Generate music prompt from parameters
const prompt = musicManager.generatePrompt({
  genre: 'electronic',
  mood: 'energetic',
  instruments: ['synthesizer', 'drums'],
  structure: ['intro', 'verse', 'chorus'],
  useCase: 'video game',
  duration: 60000,
  includeVocals: false
});

// Validate music prompt
const validation = musicManager.validatePrompt("Create an upbeat pop song");
console.log(validation.isValid, validation.suggestions);

// Analyze music prompt
const analysis = musicManager.analyzePrompt("Create an upbeat pop song with catchy melodies");
console.log(analysis.score, analysis.strengths, analysis.improvements);
```

### Pricing & Usage Tracking

```typescript
import { elevenLabs, pricingManager } from '@/lib/elevenlabs';

// Get all pricing plans
const plans = pricingManager.getAllPlans();
console.log('Available plans:', plans.map(plan => `${plan.name}: $${plan.cost}/month`));

// Get current plan
const currentPlan = pricingManager.getCurrentPlan();
console.log('Current plan:', currentPlan.name);

// Estimate cost before making requests
const ttsEstimate = pricingManager.estimateCost('text_to_speech', {
  text_length: 100,
  model: 'eleven_multilingual_v2'
});
console.log(`TTS cost estimate: ${ttsEstimate.credits} credits, $${ttsEstimate.cost_usd}`);

const musicEstimate = pricingManager.estimateCost('music_generation', {
  duration_ms: 60000 // 1 minute
});
console.log(`Music cost estimate: ${musicEstimate.credits} credits, $${musicEstimate.cost_usd}`);

// Calculate credits for different services
const ttsCredits = pricingManager.calculateTTSCredits("Hello, this is a test message.");
const musicCredits = pricingManager.calculateMusicCredits(30000); // 30 seconds
const soundEffectCredits = pricingManager.calculateSoundEffectCredits(5); // 5 seconds
const voiceDesignCredits = pricingManager.calculateVoiceDesignCredits();

console.log('Credits needed:');
console.log(`TTS: ${ttsCredits} credits`);
console.log(`Music: ${musicCredits} credits`);
console.log(`Sound Effects: ${soundEffectCredits} credits`);
console.log(`Voice Design: ${voiceDesignCredits} credits`);

// Calculate total cost with different plans
const totalCredits = ttsCredits + musicCredits + soundEffectCredits + voiceDesignCredits;
const freePlanCost = pricingManager.calculateCost(totalCredits, pricingManager.getPlan('Free'));
const starterPlanCost = pricingManager.calculateCost(totalCredits, pricingManager.getPlan('Starter'));
const creatorPlanCost = pricingManager.calculateCost(totalCredits, pricingManager.getPlan('Creator'));

console.log('Cost comparison:');
console.log(`Free Plan: $${freePlanCost.total_cost.toFixed(4)}`);
console.log(`Starter Plan: $${starterPlanCost.total_cost.toFixed(4)}`);
console.log(`Creator Plan: $${creatorPlanCost.total_cost.toFixed(4)}`);

// Get recommended plan based on monthly usage
const monthlyCredits = 50000;
const recommendedPlan = pricingManager.getRecommendedPlan(monthlyCredits);
console.log(`Recommended plan for ${monthlyCredits} credits/month: ${recommendedPlan.name}`);

// Track usage for billing
pricingManager.recordUsage({
  service: 'text_to_speech',
  user_id: 'user_123',
  session_id: 'session_456',
  credits_used: ttsCredits,
  cost_usd: ttsEstimate.cost_usd,
  details: {
    text_length: 25,
    model_used: 'eleven_multilingual_v2',
    voice_id: 'voice_1'
  }
});

// Get usage summary
const usageSummary = pricingManager.getUsageSummary();
console.log('Usage Summary:');
console.log(`Total Credits: ${usageSummary.total_credits}`);
console.log(`Total Cost: $${usageSummary.total_cost.toFixed(4)}`);
console.log('Service Breakdown:', usageSummary.service_breakdown);

// Get usage by user
const userUsage = pricingManager.getUsageSummary({ user_id: 'user_123' });
console.log('User Usage:', userUsage);

// Export usage data
const jsonExport = pricingManager.exportUsageData('json');
const csvExport = pricingManager.exportUsageData('csv');
console.log('Exported data:', { jsonExport, csvExport });
```

### Advanced Features

```typescript
// Streaming audio
const audioStream = await service.textToSpeechStream({
  text: "Streaming example...",
  optimize_streaming_latency: 2
});

// Character voices
const characterSettings = voiceManager.getDefaultVoiceSettings('character');
const result = await elevenLabs.speak(text, {
  voiceSettings: characterSettings
});
```

## 🎯 Key Features

### ✅ What's Included

- **Text to Speech**: Convert text to high-quality speech
- **Text to Dialogue**: Create expressive dialogue with audio tags
- **Sound Effects**: Generate high-quality sound effects from text descriptions
- **Voice Design**: Create custom voices from text descriptions
- **Music Generation**: Create studio-grade music from text prompts
- **Pricing & Usage Tracking**: Comprehensive cost management and billing
- **V3 Voice Library**: 15+ optimized voices for Eleven v3
- **V3 Prompting Guide**: Official v3 prompting techniques and best practices
- **Multilingual Support**: 70+ languages with same voice
- **Audio Tags**: 50+ emotional and expressive audio tags
- **Multi-Speaker**: Support for conversations between multiple voices
- **Voice Management**: Search, filter, and select voices
- **Audio Controls**: Play, pause, stop, volume, speed control
- **Multiple Formats**: MP3, PCM, Opus support
- **Streaming**: Real-time audio generation
- **Multi-language**: Support for 70+ languages
- **Voice Settings**: Stability, similarity, style, speed control
- **Text Enhancement**: Automatic audio tag insertion
- **Usage Monitoring**: Track API usage and limits
- **Error Handling**: Robust error handling and retry logic
- **TypeScript**: Full TypeScript support with types
- **React Components**: Ready-to-use React components
- **API Routes**: Server-side endpoints for Next.js

### 🎨 Voice Categories

- **Premade**: Professional, consistent voices
- **Generated**: AI-generated voices
- **Cloned**: Voice cloning capabilities
- **Professional**: High-quality professional voices
- **Character**: Voices optimized for character work

### 🎤 V3 Optimized Voices

- **James - Husky & Engaging**: Perfect for narrative content and storytelling
- **Jane - Professional Audiobook Reader**: Ideal for audiobooks and long-form content
- **Eve**: Great for V3, conversational, energetic, and happy content
- **Reginald - Intense Villain**: Perfect for character work and dramatic content
- **Hope - Upbeat and Clear**: Excellent for social media and energetic content
- **Bradford**: Professional British narrator with excellent clarity
- **Callum**: Gravelly voice with unsettling edge for mystery content
- **Laura**: Young, sunny voice perfect for social media
- **Charlotte**: Sensual and raspy voice for character work
- **Jessica**: Young and popular voice for conversational content
- **Northern Terry**: Eccentric British character voice
- **Dr. Von Fusion**: Quirky mad scientist voice for gaming
- **British Football Announcer**: Energetic sports commentary voice
- **Drill Sergeant**: Harsh, commanding military voice
- **Grandpa Spuds Oxley**: Friendly storytelling voice

### 🎭 Audio Tags for Dialogue

- **Emotions**: `[happy]`, `[sad]`, `[excited]`, `[angry]`, `[surprised]`
- **Non-Verbal**: `[laughs]`, `[whispers]`, `[sighs]`, `[chuckles]`
- **Speech Flow**: `[pauses]`, `[interrupting]`, `[overlapping]`
- **Sound Effects**: `[applause]`, `[gunshot]`, `[footsteps]`
- **Special**: `[sings]`, `[strong French accent]`, `[strong Russian accent]`

### 🌍 Supported Languages

English, Spanish, French, German, Italian, Portuguese, Japanese, Chinese, Korean, Hindi, Arabic, Russian, Dutch, Turkish, Polish, Swedish, and 50+ more languages.

## 📊 API Endpoints

### Text to Speech
```
POST /api/elevenlabs/text-to-speech
```

### Text to Dialogue
```
POST /api/elevenlabs/text-to-dialogue
```

### Voice Management
```
GET /api/elevenlabs/voices?search=george&category=premade
```

### Audio Tag Management
```
GET /api/elevenlabs/audio-tags?category=emotions
POST /api/elevenlabs/audio-tags (validate, extract, enhance)
```

### V3 Voice Library
```
GET /api/elevenlabs/v3-voices?category=CHARACTERS&recommendation=DIALOGUE_EXCELLENT
POST /api/elevenlabs/v3-voices (get_random, get_recommended_settings, get_voice_info)
```

### Language Management
```
GET /api/elevenlabs/languages?model=eleven_v3&category=major
POST /api/elevenlabs/languages (detect_language, get_recommended_language, validate_language)
```

### V3 Prompting Guide
```
GET /api/elevenlabs/v3-prompting?type=audio_tags&category=voiceRelated
POST /api/elevenlabs/v3-prompting (get_recommended_voice_settings, validate_text_length, enhance_text_with_audio_tags)
```

### Sound Effects
```
GET /api/elevenlabs/sound-effects?type=examples&category=cinematic
POST /api/elevenlabs/sound-effects (generate_sound_effect, get_recommended_options, validate_text, search_examples)
```

### Voice Design
```
GET /api/elevenlabs/voice-design?type=examples&category=professional
POST /api/elevenlabs/voice-design (design_voice, create_voice, get_recommended_options, validate_description, analyze_description)
```

### Music Generation
```
GET /api/elevenlabs/music?type=examples&genre=electronic
POST /api/elevenlabs/music (compose_music, compose_music_detailed, create_composition_plan, generate_prompt, validate_prompt, analyze_prompt)
```

### Pricing & Usage Tracking
```
GET /api/elevenlabs/pricing?type=plans&plan=starter
POST /api/elevenlabs/pricing (estimate_cost, calculate_tts_credits, calculate_music_credits, record_usage, get_recommended_plan)
```

### Usage Statistics
```
GET /api/elevenlabs/usage
```

## 🔧 Configuration Options

### Voice Settings
- **Stability**: 0.0-1.0 (voice consistency)
- **Similarity Boost**: 0.0-1.0 (adherence to original)
- **Style**: 0.0-1.0 (style exaggeration - Eleven v3)
- **Speed**: 0.25-4.0 (speech speed)
- **Speaker Boost**: Boolean (enhance similarity)

### Dialogue Settings
- **Stability**: 'creative' | 'natural' | 'robust' (dialogue expressiveness)
- **Use Audio Tags**: Boolean (enable audio tag processing)
- **Enhance Emotion**: Boolean (automatic emotional enhancement)
- **Multi-Speaker**: Boolean (enable multi-speaker support)

### Output Formats
- `mp3_44100_128` - Recommended (good quality)
- `mp3_44100_64` - Mobile optimized
- `mp3_44100_192` - High quality
- `mp3_22050_32` - Low latency
- `pcm_44100` - Uncompressed
- `opus_48000_128` - Modern format

## 🎭 Use Cases

### Narration
```typescript
const settings = voiceManager.getDefaultVoiceSettings('narration');
// Optimized for consistent, clear narration
```

### Conversation
```typescript
const settings = voiceManager.getDefaultVoiceSettings('conversation');
// More emotional range for dialogue
```

### Announcements
```typescript
const settings = voiceManager.getDefaultVoiceSettings('announcement');
// Clear, stable voice for announcements
```

### Character Voices
```typescript
const settings = voiceManager.getDefaultVoiceSettings('character');
// High emotional range for character work
```

### Dialogue Creation
```typescript
// Create expressive dialogue with audio tags
const result = await elevenLabs.dialogue(
  "[excited] Welcome to our show! [whispers] Today we have a special guest.",
  {
    dialogueSettings: {
      stability: 'creative',
      use_audio_tags: true,
      enhance_emotion: true
    }
  }
);
```

## 📚 Documentation

- **Integration Guide**: `docs/elevenlabs-integration.md`
- **Text to Speech Examples**: `examples/elevenlabs-usage-examples.ts`
- **Text to Dialogue Examples**: `examples/elevenlabs-dialogue-examples.ts`
- **V3 Voice Library Examples**: `examples/elevenlabs-v3-voice-examples.ts`
- **Multilingual Examples**: `examples/elevenlabs-multilingual-examples.ts`
- **V3 Prompting Guide Examples**: `examples/elevenlabs-v3-prompting-examples.ts`
- **Sound Effects Examples**: `examples/elevenlabs-sound-effects-examples.ts`
- **Voice Design Examples**: `examples/elevenlabs-voice-design-examples.ts`
- **Music Generation Examples**: `examples/elevenlabs-music-examples.ts`
- **Pricing & Usage Examples**: `examples/elevenlabs-pricing-examples.ts`
- **Test Page**: `/test-elevenlabs`
- **Official Docs**: [ElevenLabs Documentation](https://elevenlabs.io/docs)
- **V3 Prompting Guide**: [Eleven v3 Prompting Guide](https://elevenlabs.io/docs/prompting-eleven-v3)
- **Sound Effects Guide**: [ElevenLabs Sound Effects](https://elevenlabs.io/docs/capabilities/sound-effects)
- **Voice Design Guide**: [ElevenLabs Voice Design](https://elevenlabs.io/docs/product-guides/voice-design)
- **Music Guide**: [ElevenLabs Music](https://elevenlabs.io/docs/product-guides/products/music)

## 🚨 Important Notes

### API Key Security
- Never expose your API key in client-side code
- Use environment variables for API keys
- Consider using server-side API routes for production

### Rate Limits
- Monitor your usage with the built-in statistics
- Implement retry logic for rate limit handling
- Consider upgrading your ElevenLabs plan for higher limits

### Voice Selection
- Test different voices for your specific use case
- Use premade voices for consistent results
- Consider voice language matching your content

## 🎉 You're Ready!

Your ElevenLabs integration is now complete and ready to use. Start by:

1. Setting up your API key in `.env.local`
2. Visiting `/test-elevenlabs` to test the integration
3. Exploring the examples in `examples/elevenlabs-usage-examples.ts`
4. Reading the full documentation in `docs/elevenlabs-integration.md`

Happy speech generation! 🎤✨
