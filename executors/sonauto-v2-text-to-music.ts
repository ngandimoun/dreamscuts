import { fal } from "@fal-ai/client";

export type OutputFormat = "flac" | "mp3" | "wav" | "ogg" | "m4a";
export type OutputBitRate = "128" | "192" | "256" | "320";
export type BPM = "auto" | number;

export interface SonautoTextToMusicInput {
  prompt?: string;
  tags?: string[];
  lyrics_prompt?: string;
  seed?: number;
  prompt_strength?: number;
  balance_strength?: number;
  num_songs?: number;
  output_format?: OutputFormat;
  output_bit_rate?: OutputBitRate;
  bpm?: BPM;
}

export interface SonautoTextToMusicOutput {
  seed: number;
  tags: string[];
  lyrics: string;
  audio: {
    url: string;
    content_type: string;
    file_name: string;
    file_size: number;
  };
}

export interface SonautoTextToMusicOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Sonauto v2 Text-to-Music Executor
 * 
 * Generate songs using Sonauto, an AI music model that transforms text into full songs with lyrics.
 * Sonauto can turn any idea into a complete song with high-quality music in any style.
 * For example, you can create an original birthday song sung by Frank Sinatra in just minutes.
 * 
 * @param input - The text-to-music input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated song result
 */
export async function executeSonautoTextToMusic(
  input: SonautoTextToMusicInput,
  options: SonautoTextToMusicOptions = {}
): Promise<SonautoTextToMusicOutput> {
  try {
    // Validate input combinations
    const hasPrompt = input.prompt && input.prompt.trim().length > 0;
    const hasTags = input.tags && input.tags.length > 0;
    const hasLyrics = input.lyrics_prompt !== undefined && input.lyrics_prompt.trim().length > 0;

    if (!hasPrompt && !hasTags && !hasLyrics) {
      throw new Error("Must provide at least one of: prompt, tags, or lyrics_prompt");
    }

    if (hasPrompt && hasTags && hasLyrics) {
      throw new Error("Cannot provide all three inputs (prompt, tags, and lyrics_prompt) simultaneously");
    }

    if (hasTags && !hasPrompt && !hasLyrics) {
      throw new Error("If tags are provided, you must also include either a prompt or lyrics_prompt");
    }

    // Validate optional parameters
    if (input.prompt_strength !== undefined) {
      if (input.prompt_strength < 0.1 || input.prompt_strength > 3.0) {
        throw new Error("Prompt strength must be between 0.1 and 3.0");
      }
    }

    if (input.balance_strength !== undefined) {
      if (input.balance_strength < 0.1 || input.balance_strength > 1.0) {
        throw new Error("Balance strength must be between 0.1 and 1.0");
      }
    }

    if (input.num_songs !== undefined) {
      if (input.num_songs < 1 || input.num_songs > 2) {
        throw new Error("Number of songs must be between 1 and 2");
      }
    }

    if (input.bpm !== undefined && typeof input.bpm === 'number') {
      if (input.bpm < 60 || input.bpm > 200) {
        throw new Error("BPM must be between 60 and 200, or 'auto'");
      }
    }

    // Prepare the request payload
    const payload: any = {};

    // Add optional parameters only if they are provided
    if (hasPrompt) payload.prompt = input.prompt!.trim();
    if (hasTags) payload.tags = input.tags;
    if (hasLyrics) payload.lyrics_prompt = input.lyrics_prompt!.trim();
    if (input.seed !== undefined) payload.seed = input.seed;
    if (input.prompt_strength !== undefined) payload.prompt_strength = input.prompt_strength;
    if (input.balance_strength !== undefined) payload.balance_strength = input.balance_strength;
    if (input.num_songs !== undefined) payload.num_songs = input.num_songs;
    if (input.output_format !== undefined) payload.output_format = input.output_format;
    if (input.output_bit_rate !== undefined) payload.output_bit_rate = input.output_bit_rate;
    if (input.bpm !== undefined) payload.bpm = input.bpm;

    // Execute the model
    const result = await fal.subscribe("sonauto/v2/text-to-music", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as SonautoTextToMusicOutput;

  } catch (error) {
    console.error("Sonauto Text-to-Music execution failed:", error);
    throw new Error(`Sonauto Text-to-Music generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Sonauto Text-to-Music with queue management for long-running requests
 * 
 * @param input - The text-to-music input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeSonautoTextToMusicQueue(
  input: SonautoTextToMusicInput,
  options: SonautoTextToMusicOptions = {}
): Promise<{ request_id: string }> {
  try {
    // Validate input (same validation as above)
    const hasPrompt = input.prompt && input.prompt.trim().length > 0;
    const hasTags = input.tags && input.tags.length > 0;
    const hasLyrics = input.lyrics_prompt !== undefined && input.lyrics_prompt.trim().length > 0;

    if (!hasPrompt && !hasTags && !hasLyrics) {
      throw new Error("Must provide at least one of: prompt, tags, or lyrics_prompt");
    }

    if (hasPrompt && hasTags && hasLyrics) {
      throw new Error("Cannot provide all three inputs (prompt, tags, and lyrics_prompt) simultaneously");
    }

    if (hasTags && !hasPrompt && !hasLyrics) {
      throw new Error("If tags are provided, you must also include either a prompt or lyrics_prompt");
    }

    // Prepare the request payload (same as above)
    const payload: any = {};

    if (hasPrompt) payload.prompt = input.prompt!.trim();
    if (hasTags) payload.tags = input.tags;
    if (hasLyrics) payload.lyrics_prompt = input.lyrics_prompt!.trim();
    if (input.seed !== undefined) payload.seed = input.seed;
    if (input.prompt_strength !== undefined) payload.prompt_strength = input.prompt_strength;
    if (input.balance_strength !== undefined) payload.balance_strength = input.balance_strength;
    if (input.num_songs !== undefined) payload.num_songs = input.num_songs;
    if (input.output_format !== undefined) payload.output_format = input.output_format;
    if (input.output_bit_rate !== undefined) payload.output_bit_rate = input.output_bit_rate;
    if (input.bpm !== undefined) payload.bpm = input.bpm;

    // Submit to queue
    const { request_id } = await fal.queue.submit("sonauto/v2/text-to-music", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("Sonauto Text-to-Music queue submission failed:", error);
    throw new Error(`Sonauto Text-to-Music queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued Sonauto Text-to-Music request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkSonautoTextToMusicStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("sonauto/v2/text-to-music", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("Sonauto Text-to-Music status check failed:", error);
    throw new Error(`Sonauto Text-to-Music status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed Sonauto Text-to-Music request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated song result
 */
export async function getSonautoTextToMusicResult(
  requestId: string
): Promise<SonautoTextToMusicOutput> {
  try {
    const result = await fal.queue.result("sonauto/v2/text-to-music", {
      requestId
    });

    return result.data as SonautoTextToMusicOutput;

  } catch (error) {
    console.error("Sonauto Text-to-Music result retrieval failed:", error);
    throw new Error(`Sonauto Text-to-Music result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create common song types
 * 
 * @param type - Type of song to create
 * @param customPrompt - Custom prompt (optional)
 * @param customTags - Custom tags (optional)
 * @param customLyrics - Custom lyrics (optional)
 * @returns Sonauto text-to-music input configuration
 */
export function createSong(
  type: 'pop' | 'rock' | 'jazz' | 'electronic' | 'classical' | 'country' | 'hip-hop' | 'birthday' | 'love' | 'instrumental' | 'custom',
  customPrompt?: string,
  customTags?: string[],
  customLyrics?: string
): SonautoTextToMusicInput {
  const songTemplates = {
    pop: {
      prompt: "A catchy pop song with upbeat melody and modern production",
      tags: ["pop", "upbeat", "contemporary", "catchy"]
    },
    rock: {
      prompt: "An energetic rock song with powerful guitars and driving rhythm",
      tags: ["rock", "energetic", "guitar", "powerful"]
    },
    jazz: {
      prompt: "A smooth jazz song with sophisticated harmonies and elegant style",
      tags: ["jazz", "smooth", "sophisticated", "elegant"]
    },
    electronic: {
      prompt: "An electronic dance song with synthesizers and modern beats",
      tags: ["electronic", "dance", "synthesizer", "modern"]
    },
    classical: {
      prompt: "A classical orchestral piece with beautiful melodies and rich harmonies",
      tags: ["classical", "orchestral", "beautiful", "rich"]
    },
    country: {
      prompt: "A country song with acoustic guitars and heartfelt storytelling",
      tags: ["country", "acoustic", "heartfelt", "storytelling"]
    },
    'hip-hop': {
      prompt: "A hip-hop track with strong beats and urban style",
      tags: ["hip-hop", "urban", "beats", "strong"]
    },
    birthday: {
      prompt: "A happy birthday song with celebratory mood and joyful melody",
      tags: ["birthday", "happy", "celebratory", "joyful"]
    },
    love: {
      prompt: "A romantic love song with emotional lyrics and tender melody",
      tags: ["love", "romantic", "emotional", "tender"]
    },
    instrumental: {
      prompt: "An instrumental piece with beautiful melodies and no vocals",
      tags: ["instrumental", "melodic", "beautiful"],
      lyrics_prompt: ""
    },
    custom: {
      prompt: customPrompt || "A custom song",
      tags: customTags || ["pop"],
      lyrics_prompt: customLyrics
    }
  };

  const template = songTemplates[type];

  return {
    prompt: template.prompt,
    tags: template.tags,
    lyrics_prompt: template.lyrics_prompt,
    prompt_strength: 2.0,
    balance_strength: 0.7,
    output_format: "wav",
    bpm: "auto"
  };
}

/**
 * Available output formats for the Sonauto Text-to-Music model
 */
export const OUTPUT_FORMATS = {
  "flac": "FLAC (lossless compression)",
  "mp3": "MP3 (lossy compression, requires bitrate)",
  "wav": "WAV (uncompressed, recommended)",
  "ogg": "OGG (open source format)",
  "m4a": "M4A (AAC compression, requires bitrate)"
} as const;

/**
 * Available output bit rates for MP3 and M4A formats
 */
export const OUTPUT_BIT_RATES = {
  "128": "128 kbps (standard quality)",
  "192": "192 kbps (good quality)",
  "256": "256 kbps (high quality)",
  "320": "320 kbps (highest quality)"
} as const;

/**
 * Common music style tags for Sonauto Text-to-Music
 */
export const MUSIC_STYLE_TAGS = {
  genres: [
    "pop", "rock", "hip-hop", "electronic", "jazz", "classical", "country",
    "blues", "reggae", "funk", "soul", "r&b", "folk", "indie", "alternative",
    "dance pop", "pop rock", "indie pop", "bubblegum pop", "synthpop", "teen pop", "electropop"
  ],
  decades: [
    "2020s", "2010s", "2000s", "1990s", "1980s", "1970s", "1960s"
  ],
  moods: [
    "upbeat", "melancholic", "energetic", "calm", "dramatic", "romantic",
    "mysterious", "nostalgic", "aggressive", "peaceful", "exciting", "sad",
    "catchy", "melodic", "atmospheric", "transitional", "happy", "celebratory",
    "joyful", "emotional", "tender", "powerful", "sophisticated", "elegant"
  ],
  instruments: [
    "guitar", "piano", "drums", "bass", "violin", "saxophone", "trumpet",
    "synthesizer", "acoustic", "electric", "orchestral", "electronic",
    "instrumental", "vocal", "harmonies"
  ],
  styles: [
    "acoustic", "electric", "orchestral", "minimalist", "complex", "simple",
    "experimental", "traditional", "modern", "vintage", "futuristic",
    "contemporary", "smooth", "urban", "beats", "melodic", "beautiful",
    "rich", "heartfelt", "storytelling", "strong", "driving", "rhythm"
  ]
} as const;

/**
 * Example usage of the Sonauto Text-to-Music executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Simple pop song from prompt
    const result1 = await executeSonautoTextToMusic({
      prompt: "A pop song about turtles flying",
      prompt_strength: 2.0,
      balance_strength: 0.7,
      num_songs: 1,
      output_format: "wav",
      bpm: "auto"
    });

    console.log("Generated song URL:", result1.audio.url);
    console.log("Generated lyrics:", result1.lyrics);
    console.log("Tags used:", result1.tags);

    // Example 2: Using helper function for birthday song
    const birthdaySong = createSong('birthday');
    const result2 = await executeSonautoTextToMusic(birthdaySong);
    console.log("Generated birthday song:", result2.audio.url);

    // Example 3: Jazz song with custom lyrics
    const result3 = await executeSonautoTextToMusic({
      tags: ["jazz", "smooth", "sophisticated"],
      lyrics_prompt: "This is a beautiful jazz song with smooth melodies and sophisticated harmonies",
      prompt_strength: 1.8,
      balance_strength: 0.8,
      output_format: "mp3",
      output_bit_rate: "320",
      bpm: 120
    });

    console.log("Generated jazz song:", result3.audio.url);

  } catch (error) {
    console.error("Example execution failed:", error);
  }
}

export default executeSonautoTextToMusic;
