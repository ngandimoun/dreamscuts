import { fal } from "@fal-ai/client";

export type OutputFormat = "flac" | "mp3" | "wav" | "ogg" | "m4a";
export type OutputBitRate = "128" | "192" | "256" | "320";
export type Side = "left" | "right";

export interface SonautoExtendInput {
  prompt?: string;
  tags?: string[];
  lyrics_prompt?: string;
  seed?: number;
  prompt_strength?: number;
  balance_strength?: number;
  num_songs?: number;
  output_format?: OutputFormat;
  output_bit_rate?: OutputBitRate;
  audio_url: string;
  side: Side;
  extend_duration?: number;
  crop_duration?: number;
}

export interface SonautoExtendOutput {
  seed: number;
  tags: string[];
  lyrics: string;
  audio: {
    url: string;
    content_type: string;
    file_name: string;
    file_size: number;
  };
  extend_duration: number;
}

export interface SonautoExtendOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Sonauto v2 Extend Executor
 * 
 * Extend existing songs by adding new sections to the beginning or end using Sonauto,
 * an AI music model that transforms text into full songs with lyrics. This function
 * takes an existing audio file and generates seamless continuations or introductions
 * that match the style and feel of the original track.
 * 
 * @param input - The song extension input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated extended song result
 */
export async function executeSonautoExtend(
  input: SonautoExtendInput,
  options: SonautoExtendOptions = {}
): Promise<SonautoExtendOutput> {
  try {
    // Validate required inputs
    if (!input.audio_url || input.audio_url.trim().length === 0) {
      throw new Error("Audio URL is required");
    }

    if (!input.side || !['left', 'right'].includes(input.side)) {
      throw new Error("Side must be either 'left' or 'right'");
    }

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

    if (input.extend_duration !== undefined) {
      if (input.extend_duration < 1.0 || input.extend_duration > 60.0) {
        throw new Error("Extend duration must be between 1.0 and 60.0 seconds");
      }
    }

    if (input.crop_duration !== undefined) {
      if (input.crop_duration < 0.1 || input.crop_duration > 30.0) {
        throw new Error("Crop duration must be between 0.1 and 30.0 seconds");
      }
    }

    // Prepare the request payload
    const payload: any = {
      audio_url: input.audio_url.trim(),
      side: input.side
    };

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
    if (input.extend_duration !== undefined) payload.extend_duration = input.extend_duration;
    if (input.crop_duration !== undefined) payload.crop_duration = input.crop_duration;

    // Execute the model
    const result = await fal.subscribe("sonauto/v2/extend", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as SonautoExtendOutput;

  } catch (error) {
    console.error("Sonauto Extend execution failed:", error);
    throw new Error(`Sonauto Extend generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Sonauto Extend with queue management for long-running requests
 * 
 * @param input - The song extension input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeSonautoExtendQueue(
  input: SonautoExtendInput,
  options: SonautoExtendOptions = {}
): Promise<{ request_id: string }> {
  try {
    // Validate input (same validation as above)
    if (!input.audio_url || input.audio_url.trim().length === 0) {
      throw new Error("Audio URL is required");
    }

    if (!input.side || !['left', 'right'].includes(input.side)) {
      throw new Error("Side must be either 'left' or 'right'");
    }

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
    const payload: any = {
      audio_url: input.audio_url.trim(),
      side: input.side
    };

    if (hasPrompt) payload.prompt = input.prompt!.trim();
    if (hasTags) payload.tags = input.tags;
    if (hasLyrics) payload.lyrics_prompt = input.lyrics_prompt!.trim();
    if (input.seed !== undefined) payload.seed = input.seed;
    if (input.prompt_strength !== undefined) payload.prompt_strength = input.prompt_strength;
    if (input.balance_strength !== undefined) payload.balance_strength = input.balance_strength;
    if (input.num_songs !== undefined) payload.num_songs = input.num_songs;
    if (input.output_format !== undefined) payload.output_format = input.output_format;
    if (input.output_bit_rate !== undefined) payload.output_bit_rate = input.output_bit_rate;
    if (input.extend_duration !== undefined) payload.extend_duration = input.extend_duration;
    if (input.crop_duration !== undefined) payload.crop_duration = input.crop_duration;

    // Submit to queue
    const { request_id } = await fal.queue.submit("sonauto/v2/extend", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("Sonauto Extend queue submission failed:", error);
    throw new Error(`Sonauto Extend queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued Sonauto Extend request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkSonautoExtendStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("sonauto/v2/extend", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("Sonauto Extend status check failed:", error);
    throw new Error(`Sonauto Extend status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed Sonauto Extend request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated extended song result
 */
export async function getSonautoExtendResult(
  requestId: string
): Promise<SonautoExtendOutput> {
  try {
    const result = await fal.queue.result("sonauto/v2/extend", {
      requestId
    });

    return result.data as SonautoExtendOutput;

  } catch (error) {
    console.error("Sonauto Extend result retrieval failed:", error);
    throw new Error(`Sonauto Extend result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create common song extension types
 * 
 * @param type - Type of extension to create
 * @param audioUrl - URL of the audio file to extend
 * @param side - Which side to extend (left or right)
 * @param customPrompt - Custom prompt (optional)
 * @param duration - Extension duration in seconds (optional)
 * @returns Sonauto extension input configuration
 */
export function createSongExtension(
  type: 'intro' | 'outro' | 'bridge' | 'verse' | 'chorus' | 'instrumental' | 'custom',
  audioUrl: string,
  side: Side,
  customPrompt?: string,
  duration?: number
): SonautoExtendInput {
  const extensionTemplates = {
    intro: "Add an engaging introduction to the song",
    outro: "Add a memorable outro to the song",
    bridge: "Add a bridge section to the song",
    verse: "Add a new verse to the song",
    chorus: "Add a chorus section to the song",
    instrumental: "Add an instrumental section to the song",
    custom: customPrompt || "Extend the song"
  };

  const baseConfig: SonautoExtendInput = {
    audio_url: audioUrl,
    side: side,
    prompt: extensionTemplates[type],
    prompt_strength: 1.8,
    balance_strength: 0.7,
    output_format: "wav"
  };

  if (duration) {
    baseConfig.extend_duration = duration;
  }

  if (type === 'instrumental') {
    baseConfig.lyrics_prompt = "";
  }

  return baseConfig;
}

/**
 * Available output formats for the Sonauto Extend model
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
 * Common music style tags for Sonauto
 */
export const MUSIC_STYLE_TAGS = {
  genres: [
    "pop", "rock", "hip-hop", "electronic", "jazz", "classical", "country",
    "blues", "reggae", "funk", "soul", "r&b", "folk", "indie", "alternative"
  ],
  moods: [
    "upbeat", "melancholic", "energetic", "calm", "dramatic", "romantic",
    "mysterious", "nostalgic", "aggressive", "peaceful", "exciting", "sad"
  ],
  instruments: [
    "guitar", "piano", "drums", "bass", "violin", "saxophone", "trumpet",
    "synthesizer", "acoustic", "electric", "orchestral", "electronic"
  ],
  styles: [
    "acoustic", "electric", "orchestral", "minimalist", "complex", "simple",
    "experimental", "traditional", "modern", "vintage", "futuristic"
  ]
} as const;

/**
 * Example usage of the Sonauto Extend executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Add beginning to existing song
    const result1 = await executeSonautoExtend({
      prompt: "Add a beginning to the song",
      audio_url: "https://cdn.sonauto.ai/generations2_altformats/audio_c5e63f7c-fc79-4322-808d-c09911af4713.wav",
      side: "left",
      prompt_strength: 1.8,
      balance_strength: 0.7,
      output_format: "wav"
    });

    console.log("Generated extended song URL:", result1.audio.url);
    console.log("Extension duration:", result1.extend_duration, "seconds");

    // Example 2: Using helper function for outro
    const outroExtension = createSongExtension(
      'outro',
      "https://example.com/song.wav",
      'right',
      undefined,
      20.0
    );
    const result2 = await executeSonautoExtend(outroExtension);
    console.log("Generated outro:", result2.audio.url);

    // Example 3: Extend with specific tags and lyrics
    const result3 = await executeSonautoExtend({
      tags: ["pop", "upbeat", "electronic"],
      lyrics_prompt: "This is the continuation of our amazing song",
      audio_url: "https://example.com/song.wav",
      side: "right",
      extend_duration: 20.0,
      output_format: "mp3",
      output_bit_rate: "320"
    });

    console.log("Generated extended song with tags:", result3.audio.url);

  } catch (error) {
    console.error("Example execution failed:", error);
  }
}

export default executeSonautoExtend;
