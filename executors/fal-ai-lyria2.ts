import { fal } from "@fal-ai/client";

export interface Lyria2Input {
  prompt: string;
  negative_prompt?: string;
  seed?: number;
}

export interface Lyria2Output {
  audio: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

export interface Lyria2Options {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI Lyria 2 Executor
 * 
 * Lyria 2 is Google's latest music generation model, you can generate any type of music with this model.
 * Advanced text-to-music generation with high-quality audio output, supporting various genres, moods, 
 * and musical styles with professional production quality.
 * 
 * @param input - The music generation input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated music audio result
 */
export async function executeLyria2(
  input: Lyria2Input,
  options: Lyria2Options = {}
): Promise<Lyria2Output> {
  try {
    // Validate required inputs
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (input.prompt.length > 1000) {
      throw new Error("Prompt must be 1000 characters or less");
    }

    // Validate optional parameters
    if (input.negative_prompt !== undefined) {
      if (input.negative_prompt.length > 500) {
        throw new Error("Negative prompt must be 500 characters or less");
      }
    }

    if (input.seed !== undefined) {
      if (input.seed < 0) {
        throw new Error("Seed must be a non-negative integer");
      }
    }

    // Prepare the request payload
    const payload: any = {
      prompt: input.prompt.trim()
    };

    // Add optional parameters only if they are provided
    if (input.negative_prompt !== undefined) {
      payload.negative_prompt = input.negative_prompt.trim();
    }
    if (input.seed !== undefined) {
      payload.seed = input.seed;
    }

    // Execute the model
    const result = await fal.subscribe("fal-ai/lyria2", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as Lyria2Output;

  } catch (error) {
    console.error("Lyria 2 execution failed:", error);
    throw new Error(`Lyria 2 generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Lyria 2 with queue management for long-running requests
 * 
 * @param input - The music generation input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeLyria2Queue(
  input: Lyria2Input,
  options: Lyria2Options = {}
): Promise<{ request_id: string }> {
  try {
    // Validate input (same validation as above)
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (input.prompt.length > 1000) {
      throw new Error("Prompt must be 1000 characters or less");
    }

    if (input.negative_prompt !== undefined && input.negative_prompt.length > 500) {
      throw new Error("Negative prompt must be 500 characters or less");
    }

    if (input.seed !== undefined && input.seed < 0) {
      throw new Error("Seed must be a non-negative integer");
    }

    // Prepare the request payload (same as above)
    const payload: any = {
      prompt: input.prompt.trim()
    };

    if (input.negative_prompt !== undefined) {
      payload.negative_prompt = input.negative_prompt.trim();
    }
    if (input.seed !== undefined) {
      payload.seed = input.seed;
    }

    // Submit to queue
    const { request_id } = await fal.queue.submit("fal-ai/lyria2", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("Lyria 2 queue submission failed:", error);
    throw new Error(`Lyria 2 queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued Lyria 2 request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkLyria2Status(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/lyria2", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("Lyria 2 status check failed:", error);
    throw new Error(`Lyria 2 status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed Lyria 2 request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated music audio result
 */
export async function getLyria2Result(
  requestId: string
): Promise<Lyria2Output> {
  try {
    const result = await fal.queue.result("fal-ai/lyria2", {
      requestId
    });

    return result.data as Lyria2Output;

  } catch (error) {
    console.error("Lyria 2 result retrieval failed:", error);
    throw new Error(`Lyria 2 result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create music generation scenarios
 * 
 * @param type - Type of music to generate
 * @param customPrompt - Custom prompt (optional)
 * @param customSettings - Custom settings (optional)
 * @returns Lyria 2 input configuration
 */
export function createMusicScenario(
  type: 'ambient' | 'electronic' | 'classical' | 'rock' | 'jazz' | 'hip_hop' | 'orchestral' | 'acoustic' | 'experimental' | 'custom',
  customPrompt?: string,
  customSettings?: Partial<Lyria2Input>
): Lyria2Input {
  const scenarioTemplates = {
    ambient: {
      prompt: "A lush, ambient soundscape featuring serene atmospheric textures, gentle synthesizer pads, and subtle melodic elements. Peaceful and meditative with soft reverb and ethereal qualities.",
      negative_prompt: "vocals, drums, fast tempo, aggressive sounds"
    },
    electronic: {
      prompt: "An energetic electronic track with driving synthesizer bass, crisp drum beats, and uplifting melodic hooks. Modern EDM production with dynamic drops and electronic elements.",
      negative_prompt: "acoustic instruments, slow tempo, classical sounds"
    },
    classical: {
      prompt: "A beautiful classical composition featuring elegant piano melodies, soaring string sections, and delicate woodwind arrangements. Sophisticated and refined with traditional orchestral elements.",
      negative_prompt: "electronic sounds, modern production, vocals, drums"
    },
    rock: {
      prompt: "A powerful rock anthem with driving electric guitars, energetic drum beats, and strong bass lines. High-energy and dynamic with classic rock instrumentation and production.",
      negative_prompt: "electronic sounds, slow tempo, classical instruments"
    },
    jazz: {
      prompt: "A smooth jazz piece featuring sophisticated piano improvisation, walking bass lines, and subtle drum brushes. Elegant and sophisticated with traditional jazz instrumentation.",
      negative_prompt: "electronic sounds, vocals, heavy drums, fast tempo"
    },
    hip_hop: {
      prompt: "A modern hip-hop beat with deep bass, crisp hi-hats, and atmospheric synthesizer elements. Urban and contemporary with rhythmic patterns and electronic textures.",
      negative_prompt: "classical instruments, slow tempo, acoustic sounds"
    },
    orchestral: {
      prompt: "A majestic orchestral composition featuring soaring strings, powerful brass sections, and delicate woodwind melodies. Epic and cinematic with dramatic crescendos and rich harmonies.",
      negative_prompt: "electronic sounds, modern production, vocals, drums"
    },
    acoustic: {
      prompt: "A warm acoustic piece featuring gentle acoustic guitar, soft piano, and subtle string arrangements. Intimate and organic with natural instrument tones and peaceful atmosphere.",
      negative_prompt: "electronic sounds, heavy drums, fast tempo, synthesizers"
    },
    experimental: {
      prompt: "An experimental soundscape combining unconventional sounds, unique textures, and innovative musical elements. Creative and avant-garde with unexpected sonic combinations.",
      negative_prompt: "traditional instruments, conventional structure, predictable patterns"
    },
    custom: {
      prompt: customPrompt || "A musical composition with various instruments and styles",
      negative_prompt: "low quality"
    }
  };

  const template = scenarioTemplates[type];
  const settings = { ...template, ...customSettings };

  return {
    ...settings
  };
}

/**
 * Predefined music prompts for different genres and moods
 */
export const MUSIC_PROMPTS = {
  "ambient_peaceful": "A peaceful ambient soundscape with gentle synthesizer pads, soft atmospheric textures, and subtle melodic elements. Calm and meditative.",
  "electronic_energetic": "An energetic electronic dance track with driving bass, crisp drums, and uplifting melodies. High-energy EDM production.",
  "classical_elegant": "An elegant classical piece featuring piano and strings with sophisticated harmonies and refined musical expression.",
  "rock_powerful": "A powerful rock anthem with electric guitars, energetic drums, and strong bass lines. High-energy and dynamic.",
  "jazz_smooth": "A smooth jazz composition with piano improvisation, walking bass, and subtle drum brushes. Sophisticated and elegant.",
  "orchestral_epic": "A majestic orchestral composition with soaring strings, powerful brass, and dramatic crescendos. Epic and cinematic.",
  "acoustic_warm": "A warm acoustic piece with gentle guitar, soft piano, and natural instrument tones. Intimate and organic.",
  "hip_hop_modern": "A modern hip-hop beat with deep bass, crisp hi-hats, and atmospheric synthesizers. Urban and contemporary.",
  "experimental_creative": "An experimental soundscape with unconventional sounds, unique textures, and innovative musical elements. Creative and avant-garde.",
  "meditation_calm": "A calming meditation track with soft ambient textures, gentle nature sounds, and peaceful atmospheric elements.",
  "workout_energetic": "An energetic workout track with driving beats, motivational melodies, and high-energy production. Perfect for exercise.",
  "romantic_soft": "A romantic and soft musical piece with gentle melodies, warm harmonies, and emotional expression. Intimate and heartfelt."
} as const;

/**
 * Common negative prompts for different scenarios
 */
export const NEGATIVE_PROMPTS = {
  "no_vocals": "vocals, singing, lyrics, voice",
  "no_drums": "drums, percussion, beats, rhythm",
  "no_electronic": "electronic sounds, synthesizers, digital effects",
  "no_classical": "classical instruments, orchestral sounds, traditional music",
  "no_slow": "slow tempo, slow pace, lethargic, dragging",
  "no_fast": "fast tempo, rapid pace, hectic, rushed",
  "no_aggressive": "aggressive sounds, harsh tones, loud volume, intense",
  "no_quiet": "quiet sounds, soft volume, gentle, subtle",
  "high_quality": "low quality, poor production, distorted, unclear",
  "clean_mix": "noisy, distorted, unclear, poor audio quality"
} as const;

/**
 * Example usage of the Lyria 2 executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic music generation
    const result1 = await executeLyria2({
      prompt: "A lush, ambient soundscape featuring the serene sounds of a flowing river, complemented by the distant chirping of birds, and a gentle, melancholic piano melody that slowly unfolds.",
      negative_prompt: "vocals, slow tempo"
    });

    console.log("Generated music URL:", result1.audio.url);

    // Example 2: Using helper function for electronic music
    const electronicMusic = createMusicScenario('electronic');
    const result2 = await executeLyria2(electronicMusic);
    console.log("Electronic music:", result2.audio.url);

    // Example 3: Custom scenario with specific settings
    const customMusic = createMusicScenario(
      'custom',
      "A cinematic orchestral piece with dramatic strings, powerful brass, and epic crescendos. Perfect for movie trailers and heroic moments.",
      { negative_prompt: "electronic sounds, vocals, modern production" }
    );
    const result3 = await executeLyria2(customMusic);
    console.log("Cinematic music:", result3.audio.url);

    // Example 4: Using predefined prompts
    const result4 = await executeLyria2({
      prompt: MUSIC_PROMPTS.ambient_peaceful,
      negative_prompt: NEGATIVE_PROMPTS.no_vocals,
      seed: 12345
    });
    console.log("Ambient music:", result4.audio.url);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeLyria2Queue({
      prompt: "A professional background music track suitable for corporate presentations and business videos. Clean, modern, and sophisticated.",
      negative_prompt: "vocals, aggressive sounds, fast tempo",
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkLyria2Status(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getLyria2Result(request_id);
      console.log("Queue result:", result);
    }

  } catch (error) {
    console.error("Example execution failed:", error);
  }
}

/**
 * Utility function to estimate processing cost
 * 
 * @param duration - Duration in seconds (always 30 for Lyria 2)
 * @returns Estimated cost in USD
 */
export function estimateProcessingCost(duration: number = 30): number {
  const costPer30Seconds = 0.1;
  return (duration / 30) * costPer30Seconds;
}

/**
 * Utility function to validate prompt quality
 * 
 * @param prompt - The prompt to validate
 * @returns Validation result with suggestions
 */
export function validatePromptQuality(prompt: string): { 
  isValid: boolean; 
  suggestions: string[]; 
  score: number; 
} {
  const suggestions: string[] = [];
  let score = 0;

  // Check prompt length
  if (prompt.length < 20) {
    suggestions.push("Consider making your prompt more descriptive (at least 20 characters)");
  } else {
    score += 1;
  }

  // Check for genre/style
  const genreKeywords = ['classical', 'electronic', 'rock', 'jazz', 'hip hop', 'ambient', 'orchestral', 'acoustic', 'experimental'];
  const hasGenre = genreKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
  if (!hasGenre) {
    suggestions.push("Consider specifying a musical genre or style");
  } else {
    score += 1;
  }

  // Check for mood/emotion
  const moodKeywords = ['happy', 'melancholy', 'energetic', 'calm', 'dramatic', 'peaceful', 'intense', 'romantic', 'mysterious', 'uplifting'];
  const hasMood = moodKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
  if (!hasMood) {
    suggestions.push("Consider describing the mood or emotion you want");
  } else {
    score += 1;
  }

  // Check for instruments
  const instrumentKeywords = ['piano', 'synthesizer', 'guitar', 'violin', 'drums', 'bass', 'flute', 'trumpet', 'saxophone', 'organ'];
  const hasInstruments = instrumentKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
  if (!hasInstruments) {
    suggestions.push("Consider specifying instruments you want to hear");
  } else {
    score += 1;
  }

  // Check for tempo/rhythm
  const tempoKeywords = ['fast', 'slow', 'tempo', 'beat', 'rhythm', 'pace', 'ballad', 'driving'];
  const hasTempo = tempoKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
  if (!hasTempo) {
    suggestions.push("Consider indicating tempo or rhythm preferences");
  } else {
    score += 1;
  }

  // Check for production quality terms
  const qualityKeywords = ['high-quality', 'professional', 'clean', 'crisp', 'warm', 'rich', 'full', 'detailed'];
  const hasQuality = qualityKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
  if (!hasQuality) {
    suggestions.push("Consider adding production quality descriptors");
  } else {
    score += 1;
  }

  return {
    isValid: score >= 3,
    suggestions,
    score: score / 6 // Normalize to 0-1
  };
}

/**
 * Utility function to generate random seed
 * 
 * @returns Random seed number
 */
export function generateRandomSeed(): number {
  return Math.floor(Math.random() * 1000000);
}

/**
 * Supported music genres
 */
export const SUPPORTED_GENRES = [
  "classical",
  "electronic", 
  "rock",
  "jazz",
  "hip hop",
  "ambient",
  "orchestral",
  "acoustic",
  "experimental",
  "pop",
  "blues",
  "country",
  "folk",
  "reggae",
  "funk",
  "soul",
  "r&b",
  "metal",
  "punk",
  "indie"
] as const;

/**
 * Supported moods and emotions
 */
export const SUPPORTED_MOODS = [
  "happy",
  "melancholy",
  "energetic",
  "calm",
  "dramatic",
  "peaceful",
  "intense",
  "romantic",
  "mysterious",
  "uplifting",
  "nostalgic",
  "hopeful",
  "dark",
  "bright",
  "serene",
  "passionate",
  "contemplative",
  "playful",
  "serious",
  "ethereal"
] as const;

/**
 * Supported instruments
 */
export const SUPPORTED_INSTRUMENTS = [
  "piano",
  "synthesizer",
  "acoustic guitar",
  "electric guitar",
  "violin",
  "drums",
  "bass",
  "flute",
  "trumpet",
  "saxophone",
  "organ",
  "cello",
  "viola",
  "clarinet",
  "oboe",
  "trombone",
  "harp",
  "xylophone",
  "marimba",
  "vibraphone"
] as const;

export default executeLyria2;
