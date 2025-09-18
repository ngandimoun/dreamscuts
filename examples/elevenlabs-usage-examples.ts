/**
 * ElevenLabs Usage Examples
 * 
 * This file demonstrates how to use the ElevenLabs integration
 * for Text to Speech functionality in your application.
 */

import { elevenLabs, ElevenLabsService, voiceManager, AudioUtils } from '@/lib/elevenlabs';

// Example 1: Basic Text to Speech
export async function basicTextToSpeech() {
  try {
    const result = await elevenLabs.speak(
      "Hello! This is a test of ElevenLabs Text to Speech integration.",
      {
        voiceId: "JBFqnCBsd6RMkjVDRZzb", // Default voice
        modelId: "eleven_multilingual_v2",
        outputFormat: "mp3_44100_128"
      }
    );

    // Play the audio
    await elevenLabs.playAudio(result.audio, result.output_format);
    
    console.log("Audio generated successfully!");
    return result;
  } catch (error) {
    console.error("Text to Speech failed:", error);
    throw error;
  }
}

// Example 2: Using Voice Manager to Find the Perfect Voice
export async function findAndUseVoice() {
  try {
    // Search for voices suitable for narration
    const narrationVoices = await voiceManager.searchVoices({
      category: 'premade',
      useCase: 'narration',
      gender: 'male'
    });

    if (narrationVoices.length === 0) {
      throw new Error("No suitable voices found");
    }

    const selectedVoice = narrationVoices[0];
    console.log(`Selected voice: ${selectedVoice.name}`);

    // Generate speech with the selected voice
    const result = await elevenLabs.speak(
      "Welcome to our audiobook. Today we'll be reading an exciting story.",
      {
        voiceId: selectedVoice.voice_id,
        modelId: "eleven_multilingual_v2",
        voiceSettings: voiceManager.getDefaultVoiceSettings('narration')
      }
    );

    // Create an audio player with controls
    const player = elevenLabs.createAudioPlayer(result.audio, result.output_format);
    
    // Set up event listeners
    player.onEnded(() => {
      console.log("Audio playback finished");
    });

    player.onTimeUpdate((currentTime) => {
      console.log(`Current time: ${AudioUtils.formatDuration(currentTime)}`);
    });

    // Play the audio
    await player.play();
    
    return { result, player };
  } catch (error) {
    console.error("Voice selection and playback failed:", error);
    throw error;
  }
}

// Example 3: Multi-language Text to Speech
export async function multiLanguageExample() {
  const texts = [
    { text: "Hello, how are you?", language: "en" as const },
    { text: "Hola, ¿cómo estás?", language: "es" as const },
    { text: "Bonjour, comment allez-vous?", language: "fr" as const },
    { text: "Hallo, wie geht es dir?", language: "de" as const }
  ];

  const results = [];

  for (const { text, language } of texts) {
    try {
      // Find voices that support the language
      const voices = await voiceManager.findVoicesByLanguage(language);
      
      if (voices.length === 0) {
        console.warn(`No voices found for language: ${language}`);
        continue;
      }

      const voice = voices[0];
      console.log(`Using voice ${voice.name} for ${language}`);

      const result = await elevenLabs.speak(text, {
        voiceId: voice.voice_id,
        languageCode: language,
        modelId: "eleven_multilingual_v2"
      });

      results.push({ text, language, voice: voice.name, result });
    } catch (error) {
      console.error(`Failed to generate speech for ${language}:`, error);
    }
  }

  return results;
}

// Example 4: Streaming Text to Speech
export async function streamingExample() {
  try {
    const service = new ElevenLabsService();
    
    const audioStream = await service.textToSpeechStream({
      text: "This is a streaming example. The audio is generated in real-time as you listen.",
      voiceId: "JBFqnCBsd6RMkjVDRZzb",
      modelId: "eleven_multilingual_v2",
      optimize_streaming_latency: 2 // Strong latency optimizations
    });

    // Process the stream
    const audioChunks: Uint8Array[] = [];
    
    for await (const chunk of audioStream) {
      audioChunks.push(chunk);
      console.log(`Received chunk of ${chunk.length} bytes`);
    }

    // Combine all chunks into a single buffer
    const totalLength = audioChunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const combinedBuffer = new Uint8Array(totalLength);
    let offset = 0;
    
    for (const chunk of audioChunks) {
      combinedBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    // Play the combined audio
    await elevenLabs.playAudio(combinedBuffer.buffer, "mp3_44100_128");
    
    return combinedBuffer.buffer;
  } catch (error) {
    console.error("Streaming failed:", error);
    throw error;
  }
}

// Example 5: Character Voice Generation
export async function characterVoiceExample() {
  try {
    // Get voices suitable for character work
    const characterVoices = await voiceManager.getRecommendedVoices();
    const characterVoice = characterVoices.forCharacterVoices[0];
    
    if (!characterVoice) {
      throw new Error("No character voices available");
    }

    console.log(`Using character voice: ${characterVoice.name}`);

    // Generate speech with character-optimized settings
    const characterSettings = voiceManager.getDefaultVoiceSettings('character');
    
    const result = await elevenLabs.speak(
      "Greetings, traveler! I am the wise wizard of the forest. What brings you to my domain?",
      {
        voiceId: characterVoice.voice_id,
        modelId: "eleven_multilingual_v2",
        voiceSettings: characterSettings
      }
    );

    // Create waveform visualization
    const waveformData = await AudioUtils.createWaveformData(result.audio, 50);
    console.log("Waveform data:", waveformData);

    // Play with character-appropriate speed
    const player = elevenLabs.createAudioPlayer(result.audio, result.output_format);
    player.setPlaybackRate(0.9); // Slightly slower for dramatic effect
    await player.play();

    return { result, waveformData, player };
  } catch (error) {
    console.error("Character voice generation failed:", error);
    throw error;
  }
}

// Example 6: Batch Text to Speech Processing
export async function batchProcessingExample() {
  const texts = [
    "Welcome to our application!",
    "Please select your preferred language.",
    "Thank you for using our service.",
    "Have a great day!"
  ];

  const results = [];

  for (let i = 0; i < texts.length; i++) {
    try {
      console.log(`Processing text ${i + 1}/${texts.length}`);
      
      const result = await elevenLabs.speak(texts[i], {
        voiceId: "JBFqnCBsd6RMkjVDRZzb",
        modelId: "eleven_multilingual_v2",
        // Use previous/next text for better continuity
        previous_text: i > 0 ? texts[i - 1] : undefined,
        next_text: i < texts.length - 1 ? texts[i + 1] : undefined
      });

      results.push({
        index: i,
        text: texts[i],
        result,
        duration: AudioUtils.estimateDuration(texts[i])
      });

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to process text ${i + 1}:`, error);
    }
  }

  return results;
}

// Example 7: Audio Management and Download
export async function audioManagementExample() {
  try {
    const result = await elevenLabs.speak(
      "This audio will be saved to your device. You can also play it directly in the browser.",
      {
        voiceId: "JBFqnCBsd6RMkjVDRZzb",
        modelId: "eleven_multilingual_v2"
      }
    );

    // Get audio information
    const duration = AudioUtils.estimateDuration("This audio will be saved to your device. You can also play it directly in the browser.");
    const fileSize = AudioUtils.formatFileSize(result.audio.byteLength);
    
    console.log(`Audio duration: ${AudioUtils.formatDuration(duration)}`);
    console.log(`File size: ${fileSize}`);

    // Create audio player
    const player = elevenLabs.createAudioPlayer(result.audio, result.output_format);
    
    // Set up download functionality
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download Audio';
    downloadButton.onclick = () => {
      elevenLabs.downloadAudio(
        result.audio, 
        `speech_${Date.now()}.${AudioUtils.getFileExtension(result.output_format)}`,
        result.output_format
      );
    };

    // Play the audio
    await player.play();
    
    return { result, player, downloadButton, duration, fileSize };
  } catch (error) {
    console.error("Audio management failed:", error);
    throw error;
  }
}

// Example 8: Usage Statistics and Monitoring
export async function usageMonitoringExample() {
  try {
    // Check API connection
    const isConnected = await elevenLabs.validateConnection();
    console.log(`API Connection: ${isConnected ? 'Connected' : 'Failed'}`);

    if (!isConnected) {
      throw new Error("Cannot connect to ElevenLabs API");
    }

    // Get usage statistics
    const stats = await elevenLabs.getUsageStats();
    console.log("Usage Statistics:", {
      charactersUsed: stats.characters_used,
      charactersLimit: stats.characters_limit,
      remainingCharacters: stats.characters_limit - stats.characters_used,
      tier: stats.tier,
      status: stats.status,
      availableModels: stats.available_models
    });

    // Get voice statistics
    const voiceStats = await voiceManager.getVoiceStats();
    console.log("Voice Statistics:", voiceStats);

    // Check if we can generate more audio
    const canGenerateMore = stats.characters_used < stats.characters_limit;
    console.log(`Can generate more audio: ${canGenerateMore}`);

    return { stats, voiceStats, canGenerateMore };
  } catch (error) {
    console.error("Usage monitoring failed:", error);
    throw error;
  }
}

// Example 9: Error Handling and Retry Logic
export async function robustTextToSpeech(text: string, maxRetries = 3) {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries} for text: "${text.substring(0, 50)}..."`);
      
      const result = await elevenLabs.speak(text, {
        voiceId: "JBFqnCBsd6RMkjVDRZzb",
        modelId: "eleven_multilingual_v2"
      });

      console.log(`Success on attempt ${attempt}`);
      return result;
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`Failed to generate speech after ${maxRetries} attempts. Last error: ${lastError?.message}`);
}

// Example 10: Integration with React Component (for reference)
export const ReactIntegrationExample = `
// Example React component using ElevenLabs
import React, { useState, useCallback } from 'react';
import { elevenLabs, voiceManager } from '@/lib/elevenlabs';

export function TextToSpeechComponent() {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');

  // Load voices on component mount
  React.useEffect(() => {
    voiceManager.getVoices().then(setVoices);
  }, []);

  const handleGenerateSpeech = useCallback(async () => {
    if (!text.trim()) return;

    setIsGenerating(true);
    try {
      const result = await elevenLabs.speak(text, {
        voiceId: selectedVoice || undefined
      });

      const player = elevenLabs.createAudioPlayer(result.audio, result.output_format);
      setAudioPlayer(player);
      await player.play();
    } catch (error) {
      console.error('Speech generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [text, selectedVoice]);

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to convert to speech..."
        rows={4}
        cols={50}
      />
      
      <select
        value={selectedVoice}
        onChange={(e) => setSelectedVoice(e.target.value)}
      >
        <option value="">Default Voice</option>
        {voices.map(voice => (
          <option key={voice.voice_id} value={voice.voice_id}>
            {voice.name}
          </option>
        ))}
      </select>
      
      <button
        onClick={handleGenerateSpeech}
        disabled={isGenerating || !text.trim()}
      >
        {isGenerating ? 'Generating...' : 'Generate Speech'}
      </button>
      
      {audioPlayer && (
        <div>
          <button onClick={() => audioPlayer.play()}>Play</button>
          <button onClick={() => audioPlayer.pause()}>Pause</button>
          <button onClick={() => audioPlayer.stop()}>Stop</button>
        </div>
      )}
    </div>
  );
}
`;

// Export all examples
export const examples = {
  basicTextToSpeech,
  findAndUseVoice,
  multiLanguageExample,
  streamingExample,
  characterVoiceExample,
  batchProcessingExample,
  audioManagementExample,
  usageMonitoringExample,
  robustTextToSpeech
};
