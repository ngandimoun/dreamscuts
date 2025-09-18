/**
 * ElevenLabs Music Examples
 * 
 * This file demonstrates how to generate music with Eleven Music
 * Based on the official ElevenLabs Music documentation
 */

import { elevenLabs, musicManager, AudioUtils } from '@/lib/elevenlabs';
import type { MusicComposeOptions, CompositionPlan } from '@/lib/elevenlabs/types';

// Example 1: Basic music generation
export async function basicMusicGenerationExample() {
  try {
    console.log("=== Basic Music Generation Example ===");

    const basicPrompts = [
      "Create an upbeat pop song with catchy melodies and energetic drums",
      "Generate a calm acoustic guitar piece with gentle fingerpicking",
      "Make an electronic dance track with synthesizers and a driving beat",
      "Create a cinematic orchestral piece with strings and brass",
      "Generate a jazz piano solo with complex harmonies"
    ];

    const results = [];

    for (const prompt of basicPrompts) {
      console.log(`\nGenerating music: "${prompt}"`);
      
      // Validate the prompt first
      const validation = musicManager.validatePrompt(prompt);
      console.log(`Validation: Valid: ${validation.isValid}`);
      if (validation.suggestions.length > 0) {
        console.log(`Suggestions: ${validation.suggestions.join(', ')}`);
      }

      // Generate the music
      const result = await elevenLabs.composeMusic(prompt, {
        music_length_ms: 30000 // 30 seconds
      });

      results.push({
        prompt,
        validation,
        result
      });

      console.log(`Generated music: ${result.music_length_ms}ms`);
      
      // Play the generated music
      await AudioUtils.playAudio(result.audio);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return results;
  } catch (error) {
    console.error("Basic music generation example failed:", error);
    throw error;
  }
}

// Example 2: Video game music
export async function videoGameMusicExample() {
  try {
    console.log("=== Video Game Music Example ===");

    const videoGamePrompts = [
      "Create an intense, fast-paced electronic track for a high-adrenaline video game scene. Use driving synth arpeggios, punchy drums, distorted bass, glitch effects, and aggressive rhythmic textures. The tempo should be fast, 130–150 bpm, with rising tension, quick transitions, and dynamic energy bursts.",
      "Epic orchestral battle music with soaring strings, powerful brass, and thunderous percussion for a fantasy RPG boss fight.",
      "Retro 8-bit chiptune with catchy melodies and upbeat tempo for a platformer game.",
      "Mysterious ambient track with ethereal pads and subtle percussion for an exploration sequence.",
      "Triumphant victory fanfare with brass and timpani for completing a level"
    ];

    const results = [];

    for (const prompt of videoGamePrompts) {
      console.log(`\nGenerating video game music: "${prompt.substring(0, 100)}..."`);
      
      // Get recommended duration for video game category
      const recommendedDuration = musicManager.getRecommendedDuration('video_game');
      console.log(`Recommended duration: ${recommendedDuration}ms`);

      // Generate the music
      const result = await elevenLabs.composeMusic(prompt, {
        music_length_ms: Math.min(recommendedDuration, 60000) // Cap at 1 minute for demo
      });

      results.push({
        prompt,
        recommendedDuration,
        result
      });

      console.log(`Generated video game music: ${result.music_length_ms}ms`);
      
      // Play the generated music
      await AudioUtils.playAudio(result.audio);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return results;
  } catch (error) {
    console.error("Video game music example failed:", error);
    throw error;
  }
}

// Example 3: Commercial and advertising music
export async function commercialMusicExample() {
  try {
    console.log("=== Commercial Music Example ===");

    const commercialPrompts = [
      "Track for a high-end mascara commercial. Upbeat and polished. Voiceover only. The script begins: 'We bring you the most volumizing mascara yet.' Mention the brand name 'X' at the end.",
      "Upbeat corporate jingle with bright synthesizers, punchy drums, and an optimistic melody for a tech startup.",
      "Elegant and sophisticated orchestral piece for a luxury car advertisement.",
      "Fun and playful track with acoustic guitar and cheerful vocals for a children's toy commercial.",
      "Professional and trustworthy background music for a financial services advertisement"
    ];

    const results = [];

    for (const prompt of commercialPrompts) {
      console.log(`\nGenerating commercial music: "${prompt.substring(0, 100)}..."`);
      
      // Get recommended duration for commercial category
      const recommendedDuration = musicManager.getRecommendedDuration('commercial');
      console.log(`Recommended duration: ${recommendedDuration}ms`);

      // Generate the music
      const result = await elevenLabs.composeMusic(prompt, {
        music_length_ms: recommendedDuration
      });

      results.push({
        prompt,
        recommendedDuration,
        result
      });

      console.log(`Generated commercial music: ${result.music_length_ms}ms`);
      
      // Play the generated music
      await AudioUtils.playAudio(result.audio);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return results;
  } catch (error) {
    console.error("Commercial music example failed:", error);
    throw error;
  }
}

// Example 4: Cinematic music
export async function cinematicMusicExample() {
  try {
    console.log("=== Cinematic Music Example ===");

    const cinematicPrompts = [
      "A slow, melancholic piano melody over ambient synth textures, suitable for a tragic film scene.",
      "Dark, atmospheric electronic track with deep bass, glitchy percussion, and haunting vocal samples.",
      "Epic orchestral piece with full symphony, choir, and dramatic crescendos for a movie trailer.",
      "Intimate acoustic guitar with soft strings for a romantic scene.",
      "Tense, suspenseful music with staccato strings and ominous brass for a thriller"
    ];

    const results = [];

    for (const prompt of cinematicPrompts) {
      console.log(`\nGenerating cinematic music: "${prompt.substring(0, 100)}..."`);
      
      // Get recommended duration for cinematic category
      const recommendedDuration = musicManager.getRecommendedDuration('cinematic');
      console.log(`Recommended duration: ${recommendedDuration}ms`);

      // Generate the music
      const result = await elevenLabs.composeMusic(prompt, {
        music_length_ms: Math.min(recommendedDuration, 120000) // Cap at 2 minutes for demo
      });

      results.push({
        prompt,
        recommendedDuration,
        result
      });

      console.log(`Generated cinematic music: ${result.music_length_ms}ms`);
      
      // Play the generated music
      await AudioUtils.playAudio(result.audio);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return results;
  } catch (error) {
    console.error("Cinematic music example failed:", error);
    throw error;
  }
}

// Example 5: Composition plans
export async function compositionPlanExample() {
  try {
    console.log("=== Composition Plan Example ===");

    // Create a composition plan from parameters
    const compositionPlan = musicManager.createCompositionPlan({
      genre: 'electronic',
      mood: 'energetic',
      instruments: ['synthesizer', 'drums', 'bass'],
      structure: ['intro', 'verse', 'chorus', 'bridge', 'outro'],
      duration: 60000, // 1 minute
      includeVocals: true
    });

    console.log("Created composition plan:", JSON.stringify(compositionPlan, null, 2));

    // Generate music using the composition plan
    const result = await elevenLabs.composeMusic("", {
      composition_plan: compositionPlan,
      music_length_ms: 60000
    });

    console.log(`Generated music from composition plan: ${result.music_length_ms}ms`);
    
    // Play the generated music
    await AudioUtils.playAudio(result.audio);
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      compositionPlan,
      result
    };
  } catch (error) {
    console.error("Composition plan example failed:", error);
    throw error;
  }
}

// Example 6: Detailed music generation
export async function detailedMusicGenerationExample() {
  try {
    console.log("=== Detailed Music Generation Example ===");

    const prompt = "Write a raw, emotionally charged track that fuses alternative R&B, gritty soul, indie rock, and folk. The song should still feel like a live, one-take, emotionally spontaneous performance. A female vocalist begins at 15 seconds: 'I tried to leave the light on, just in case you turned around But all the shadows answered back, and now I'm burning out My voice is shaking in the silence you left behind But I keep singing to the smoke, hoping love is still alive'";

    console.log(`Generating detailed music: "${prompt.substring(0, 100)}..."`);

    // Generate music with detailed response
    const result = await elevenLabs.composeMusicDetailed(prompt, {
      music_length_ms: 180000 // 3 minutes
    });

    console.log(`Generated detailed music: ${result.music_length_ms}ms`);
    console.log(`Filename: ${result.filename}`);
    console.log(`Composition plan sections: ${result.json.composition_plan.sections.length}`);
    console.log(`Song metadata:`, result.json.song_metadata);

    // Play the generated music
    await AudioUtils.playAudio(result.audio);
    await new Promise(resolve => setTimeout(resolve, 2000));

    return result;
  } catch (error) {
    console.error("Detailed music generation example failed:", error);
    throw error;
  }
}

// Example 7: Music streaming
export async function musicStreamingExample() {
  try {
    console.log("=== Music Streaming Example ===");

    const prompt = "Create a 30-second ambient track with soft pads and gentle percussion";

    console.log(`Streaming music: "${prompt}"`);

    // Stream music generation
    const audioChunks: ArrayBuffer[] = [];
    
    for await (const chunk of elevenLabs.streamMusic(prompt, {
      music_length_ms: 30000
    })) {
      audioChunks.push(chunk);
      console.log(`Received chunk: ${chunk.byteLength} bytes`);
    }

    // Combine all chunks
    const totalLength = audioChunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
    const combinedAudio = new Uint8Array(totalLength);
    let offset = 0;
    
    for (const chunk of audioChunks) {
      combinedAudio.set(new Uint8Array(chunk), offset);
      offset += chunk.byteLength;
    }

    console.log(`Streamed music complete: ${totalLength} bytes total`);
    
    // Play the streamed music
    await AudioUtils.playAudio(combinedAudio.buffer);
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      prompt,
      totalLength,
      chunkCount: audioChunks.length
    };
  } catch (error) {
    console.error("Music streaming example failed:", error);
    throw error;
  }
}

// Example 8: Music manager features
export async function musicManagerFeaturesExample() {
  try {
    console.log("=== Music Manager Features Example ===");

    // Get all available data
    const genres = musicManager.getMusicGenres();
    const moods = musicManager.getMusicMoods();
    const instruments = musicManager.getMusicInstruments();
    const structures = musicManager.getMusicStructures();
    const categories = musicManager.getMusicCategories();

    console.log(`\nAvailable genres: ${genres.length}`);
    console.log(`Genres: ${genres.slice(0, 10).join(', ')}...`);

    console.log(`\nAvailable moods: ${moods.length}`);
    console.log(`Moods: ${moods.slice(0, 10).join(', ')}...`);

    console.log(`\nAvailable instruments: ${instruments.length}`);
    console.log(`Instruments: ${instruments.slice(0, 10).join(', ')}...`);

    console.log(`\nAvailable structures: ${structures.length}`);
    console.log(`Structures: ${structures.join(', ')}`);

    console.log(`\nAvailable categories: ${categories.length}`);
    console.log(`Categories: ${categories.join(', ')}`);

    // Get prompting guides
    console.log(`\nPrompting guides:`);
    categories.forEach(category => {
      const guide = musicManager.getPromptingGuide(category);
      console.log(`- ${category}: ${guide.description}`);
      console.log(`  Examples: ${guide.examples.slice(0, 1).join(', ')}`);
    });

    // Get examples
    const examples = musicManager.getMusicExamples();
    console.log(`\nMusic examples: ${examples.length}`);
    examples.slice(0, 3).forEach(example => {
      console.log(`- ${example.title}: ${example.genre} ${example.mood}`);
    });

    // Search examples
    const searchResults = musicManager.searchExamples('electronic');
    console.log(`\nSearch results for "electronic": ${searchResults.length}`);
    searchResults.forEach(result => {
      console.log(`- ${result.title}: ${result.genre} ${result.mood}`);
    });

    // Get random example
    const randomExample = musicManager.getRandomExample();
    console.log(`\nRandom example: ${randomExample.title}`);

    // Test prompt generation
    const generatedPrompt = musicManager.generatePrompt({
      genre: 'electronic',
      mood: 'energetic',
      instruments: ['synthesizer', 'drums'],
      structure: ['intro', 'verse', 'chorus'],
      useCase: 'video game',
      duration: 60000,
      includeVocals: false
    });
    console.log(`\nGenerated prompt: "${generatedPrompt}"`);

    // Test validation
    const validation = musicManager.validatePrompt(generatedPrompt);
    console.log(`\nValidation: Valid: ${validation.isValid}`);
    if (validation.suggestions.length > 0) {
      console.log(`Suggestions: ${validation.suggestions.join(', ')}`);
    }

    // Test analysis
    const analysis = musicManager.analyzePrompt(generatedPrompt);
    console.log(`\nAnalysis: Score: ${analysis.score}/100`);
    console.log(`Strengths: ${analysis.strengths.join(', ')}`);

    return {
      genres,
      moods,
      instruments,
      structures,
      categories,
      examples,
      searchResults,
      randomExample,
      generatedPrompt,
      validation,
      analysis
    };
  } catch (error) {
    console.error("Music manager features example failed:", error);
    throw error;
  }
}

// Example 9: Official examples demonstration
export async function officialMusicExamplesDemonstration() {
  try {
    console.log("=== Official Music Examples Demonstration ===");

    const officialExamples = musicManager.getMusicExamples();
    const results = [];

    // Test a few official examples
    for (let i = 0; i < Math.min(3, officialExamples.length); i++) {
      const example = officialExamples[i];
      console.log(`\n--- Testing Official Example: ${example.title} ---`);
      console.log(`Genre: ${example.genre}, Mood: ${example.mood}`);
      console.log(`Instruments: ${example.instruments.join(', ')}`);
      console.log(`Use case: ${example.use_case}`);

      const result = await elevenLabs.composeMusic(example.prompt, {
        music_length_ms: Math.min(example.duration_ms, 60000) // Cap at 1 minute for demo
      });

      results.push({
        example,
        result
      });

      console.log(`Generated music: ${result.music_length_ms}ms`);
      
      // Play the generated music
      await AudioUtils.playAudio(result.audio);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return results;
  } catch (error) {
    console.error("Official music examples demonstration failed:", error);
    throw error;
  }
}

// Example 10: Duration variations
export async function durationVariationsExample() {
  try {
    console.log("=== Duration Variations Example ===");

    const testPrompt = "Create a short electronic track with synthesizers and drums";
    const durations = [10000, 30000, 60000, 120000]; // 10s, 30s, 1m, 2m
    const results = [];

    for (const duration of durations) {
      console.log(`\nTesting duration: ${duration}ms (${duration / 1000}s)`);
      
      const result = await elevenLabs.composeMusic(testPrompt, {
        music_length_ms: duration
      });

      results.push({
        duration,
        result
      });

      console.log(`Generated music: ${result.music_length_ms}ms`);
      
      // Play the generated music
      await AudioUtils.playAudio(result.audio);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    return results;
  } catch (error) {
    console.error("Duration variations example failed:", error);
    throw error;
  }
}

// Export all examples
export const musicExamples = {
  basicMusicGenerationExample,
  videoGameMusicExample,
  commercialMusicExample,
  cinematicMusicExample,
  compositionPlanExample,
  detailedMusicGenerationExample,
  musicStreamingExample,
  musicManagerFeaturesExample,
  officialMusicExamplesDemonstration,
  durationVariationsExample
};
