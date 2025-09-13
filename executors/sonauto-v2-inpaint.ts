import { fal } from "@fal-ai/client";

export type OutputFormat = "flac" | "mp3" | "wav" | "ogg" | "m4a";
export type OutputBitRate = "128" | "192" | "256" | "320";

export interface InpaintSection {
  start: number;
  end: number;
}

export interface SonautoInpaintInput {
  tags: string[];
  lyrics_prompt: string;
  seed?: number;
  prompt_strength?: number;
  balance_strength?: number;
  num_songs?: number;
  output_format?: OutputFormat;
  output_bit_rate?: OutputBitRate;
  audio_url: string;
  sections: InpaintSection[];
  selection_crop?: boolean;
}

export interface SonautoInpaintOutput {
  audio: {
    url: string;
    content_type: string;
    file_name: string;
    file_size: number;
  };
  seed: number;
}

export interface SonautoInpaintOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Sonauto v2 Inpaint Executor
 * 
 * Replace or regenerate specific sections of an existing song using Sonauto,
 * an AI music model that transforms text into full songs with lyrics. This function
 * allows you to modify parts of a song while keeping the rest intact, perfect for
 * fixing problematic sections or changing specific lyrics.
 * 
 * @param input - The song inpainting input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated inpainted song result
 */
export async function executeSonautoInpaint(
  input: SonautoInpaintInput,
  options: SonautoInpaintOptions = {}
): Promise<SonautoInpaintOutput> {
  try {
    // Validate required inputs
    if (!input.audio_url || input.audio_url.trim().length === 0) {
      throw new Error("Audio URL is required");
    }

    if (!input.tags || input.tags.length === 0) {
      throw new Error("Tags are required for inpainting");
    }

    if (input.lyrics_prompt === undefined) {
      throw new Error("Lyrics prompt is required for inpainting");
    }

    if (!input.sections || input.sections.length === 0) {
      throw new Error("Sections are required for inpainting");
    }

    // Validate sections (currently only one section is supported)
    if (input.sections.length !== 1) {
      throw new Error("Currently only one section is supported for inpainting");
    }

    const section = input.sections[0];
    if (section.start < 0) {
      throw new Error("Section start time must be 0 or greater");
    }

    if (section.end <= section.start) {
      throw new Error("Section end time must be greater than start time");
    }

    if (section.end - section.start < 0.1) {
      throw new Error("Section duration must be at least 0.1 seconds");
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

    // Prepare the request payload
    const payload: any = {
      tags: input.tags,
      lyrics_prompt: input.lyrics_prompt,
      audio_url: input.audio_url.trim(),
      sections: input.sections
    };

    // Add optional parameters only if they are provided
    if (input.seed !== undefined) payload.seed = input.seed;
    if (input.prompt_strength !== undefined) payload.prompt_strength = input.prompt_strength;
    if (input.balance_strength !== undefined) payload.balance_strength = input.balance_strength;
    if (input.num_songs !== undefined) payload.num_songs = input.num_songs;
    if (input.output_format !== undefined) payload.output_format = input.output_format;
    if (input.output_bit_rate !== undefined) payload.output_bit_rate = input.output_bit_rate;
    if (input.selection_crop !== undefined) payload.selection_crop = input.selection_crop;

    // Execute the model
    const result = await fal.subscribe("sonauto/v2/inpaint", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as SonautoInpaintOutput;

  } catch (error) {
    console.error("Sonauto Inpaint execution failed:", error);
    throw new Error(`Sonauto Inpaint generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Sonauto Inpaint with queue management for long-running requests
 * 
 * @param input - The song inpainting input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeSonautoInpaintQueue(
  input: SonautoInpaintInput,
  options: SonautoInpaintOptions = {}
): Promise<{ request_id: string }> {
  try {
    // Validate input (same validation as above)
    if (!input.audio_url || input.audio_url.trim().length === 0) {
      throw new Error("Audio URL is required");
    }

    if (!input.tags || input.tags.length === 0) {
      throw new Error("Tags are required for inpainting");
    }

    if (input.lyrics_prompt === undefined) {
      throw new Error("Lyrics prompt is required for inpainting");
    }

    if (!input.sections || input.sections.length === 0) {
      throw new Error("Sections are required for inpainting");
    }

    if (input.sections.length !== 1) {
      throw new Error("Currently only one section is supported for inpainting");
    }

    const section = input.sections[0];
    if (section.start < 0 || section.end <= section.start || section.end - section.start < 0.1) {
      throw new Error("Invalid section timing");
    }

    // Prepare the request payload (same as above)
    const payload: any = {
      tags: input.tags,
      lyrics_prompt: input.lyrics_prompt,
      audio_url: input.audio_url.trim(),
      sections: input.sections
    };

    if (input.seed !== undefined) payload.seed = input.seed;
    if (input.prompt_strength !== undefined) payload.prompt_strength = input.prompt_strength;
    if (input.balance_strength !== undefined) payload.balance_strength = input.balance_strength;
    if (input.num_songs !== undefined) payload.num_songs = input.num_songs;
    if (input.output_format !== undefined) payload.output_format = input.output_format;
    if (input.output_bit_rate !== undefined) payload.output_bit_rate = input.output_bit_rate;
    if (input.selection_crop !== undefined) payload.selection_crop = input.selection_crop;

    // Submit to queue
    const { request_id } = await fal.queue.submit("sonauto/v2/inpaint", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("Sonauto Inpaint queue submission failed:", error);
    throw new Error(`Sonauto Inpaint queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued Sonauto Inpaint request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkSonautoInpaintStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("sonauto/v2/inpaint", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("Sonauto Inpaint status check failed:", error);
    throw new Error(`Sonauto Inpaint status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed Sonauto Inpaint request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated inpainted song result
 */
export async function getSonautoInpaintResult(
  requestId: string
): Promise<SonautoInpaintOutput> {
  try {
    const result = await fal.queue.result("sonauto/v2/inpaint", {
      requestId
    });

    return result.data as SonautoInpaintOutput;

  } catch (error) {
    console.error("Sonauto Inpaint result retrieval failed:", error);
    throw new Error(`Sonauto Inpaint result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create common inpainting scenarios
 * 
 * @param type - Type of inpainting to perform
 * @param audioUrl - URL of the audio file to inpaint
 * @param startTime - Start time of the section to inpaint
 * @param endTime - End time of the section to inpaint
 * @param customTags - Custom tags (optional)
 * @param customLyrics - Custom lyrics (optional)
 * @returns Sonauto inpainting input configuration
 */
export function createSongInpaint(
  type: 'chorus' | 'verse' | 'bridge' | 'instrumental' | 'intro' | 'outro' | 'custom',
  audioUrl: string,
  startTime: number,
  endTime: number,
  customTags?: string[],
  customLyrics?: string
): SonautoInpaintInput {
  const inpaintTemplates = {
    chorus: {
      tags: ["pop", "upbeat", "catchy"],
      lyrics: "[Chorus]\nThis is the new chorus section\nWith fresh lyrics and energy"
    },
    verse: {
      tags: ["contemporary", "melodic"],
      lyrics: "This is a brand new verse\nWith different lyrics and flow"
    },
    bridge: {
      tags: ["transitional", "atmospheric"],
      lyrics: "This is the bridge section\nConnecting different parts of the song"
    },
    instrumental: {
      tags: ["instrumental", "melodic"],
      lyrics: ""
    },
    intro: {
      tags: ["intro", "atmospheric"],
      lyrics: "This is the new introduction\nSetting the mood for the song"
    },
    outro: {
      tags: ["outro", "fade"],
      lyrics: "This is the new ending\nBringing the song to a close"
    },
    custom: {
      tags: customTags || ["pop"],
      lyrics: customLyrics || "Custom inpainted section"
    }
  };

  const template = inpaintTemplates[type];

  return {
    audio_url: audioUrl,
    tags: template.tags,
    lyrics_prompt: template.lyrics,
    sections: [{ start: startTime, end: endTime }],
    prompt_strength: 2.0,
    balance_strength: 0.7,
    output_format: "wav"
  };
}

/**
 * Available output formats for the Sonauto Inpaint model
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
 * Common music style tags for Sonauto Inpaint
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
    "catchy", "melodic", "atmospheric", "transitional"
  ],
  instruments: [
    "guitar", "piano", "drums", "bass", "violin", "saxophone", "trumpet",
    "synthesizer", "acoustic", "electric", "orchestral", "electronic",
    "instrumental"
  ],
  styles: [
    "acoustic", "electric", "orchestral", "minimalist", "complex", "simple",
    "experimental", "traditional", "modern", "vintage", "futuristic",
    "contemporary", "smooth", "fade"
  ]
} as const;

/**
 * Example usage of the Sonauto Inpaint executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Replace chorus section
    const result1 = await executeSonautoInpaint({
      tags: ["2020s", "dance pop", "pop rock", "indie pop"],
      lyrics_prompt: "[Chorus]\nPigs are soaring in the sky\nWings of bacon flying by",
      audio_url: "https://cdn.sonauto.ai/generations2_altformats/audio_c5e63f7c-fc79-4322-808d-c09911af4713.wav",
      sections: [{ start: 0, end: 9.45 }],
      prompt_strength: 2.0,
      balance_strength: 0.7,
      output_format: "wav"
    });

    console.log("Generated inpainted song URL:", result1.audio.url);
    console.log("Seed used:", result1.seed);

    // Example 2: Using helper function for instrumental section
    const instrumentalInpaint = createSongInpaint(
      'instrumental',
      "https://example.com/song.wav",
      30.0,
      45.0
    );
    const result2 = await executeSonautoInpaint(instrumentalInpaint);
    console.log("Generated instrumental section:", result2.audio.url);

    // Example 3: Replace verse with custom tags and lyrics
    const result3 = await executeSonautoInpaint({
      tags: ["jazz", "smooth", "instrumental"],
      lyrics_prompt: "",
      audio_url: "https://example.com/song.wav",
      sections: [{ start: 15.0, end: 30.0 }],
      prompt_strength: 1.8,
      output_format: "mp3",
      output_bit_rate: "320",
      selection_crop: true
    });

    console.log("Generated jazz instrumental section:", result3.audio.url);

  } catch (error) {
    console.error("Example execution failed:", error);
  }
}

export default executeSonautoInpaint;
