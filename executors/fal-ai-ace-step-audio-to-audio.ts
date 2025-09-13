import { fal } from "@fal-ai/client";

export interface ACEStepAudioToAudioInput {
  audio_url: string;
  edit_mode?: "lyrics" | "remix";
  original_tags: string;
  original_lyrics?: string;
  tags: string;
  lyrics?: string;
  number_of_steps?: number;
  seed?: number;
  scheduler?: "euler" | "heun";
  guidance_type?: "cfg" | "apg" | "cfg_star";
  granularity_scale?: number;
  guidance_interval?: number;
  guidance_interval_decay?: number;
  guidance_scale?: number;
  minimum_guidance_scale?: number;
  tag_guidance_scale?: number;
  lyric_guidance_scale?: number;
  original_seed?: number;
}

export interface ACEStepAudioToAudioOutput {
  audio: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  seed: number;
  tags: string;
  lyrics: string;
}

export interface ACEStepAudioToAudioOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI ACE-Step Audio-to-Audio Executor
 * 
 * Generate music from a lyrics and example audio using ACE-Step.
 * Advanced audio-to-audio generation technology that creates new music based on 
 * existing audio examples while incorporating new lyrics and style modifications 
 * with precise control over generation parameters.
 * 
 * @param input - The audio-to-audio input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated audio result
 */
export async function executeACEStepAudioToAudio(
  input: ACEStepAudioToAudioInput,
  options: ACEStepAudioToAudioOptions = {}
): Promise<ACEStepAudioToAudioOutput> {
  try {
    // Validate required inputs
    if (!input.audio_url || input.audio_url.trim().length === 0) {
      throw new Error("Audio URL is required");
    }

    if (!input.original_tags || input.original_tags.trim().length === 0) {
      throw new Error("Original tags are required");
    }

    if (!input.tags || input.tags.trim().length === 0) {
      throw new Error("Tags are required");
    }

    // Validate audio URL format
    try {
      new URL(input.audio_url);
    } catch {
      throw new Error("Audio URL must be a valid URL");
    }

    // Validate optional parameters
    if (input.edit_mode !== undefined && !["lyrics", "remix"].includes(input.edit_mode)) {
      throw new Error("Edit mode must be 'lyrics' or 'remix'");
    }

    if (input.original_tags.length > 500) {
      throw new Error("Original tags must be 500 characters or less");
    }

    if (input.tags.length > 500) {
      throw new Error("Tags must be 500 characters or less");
    }

    if (input.original_lyrics !== undefined && input.original_lyrics.length > 2000) {
      throw new Error("Original lyrics must be 2000 characters or less");
    }

    if (input.lyrics !== undefined && input.lyrics.length > 2000) {
      throw new Error("Lyrics must be 2000 characters or less");
    }

    if (input.number_of_steps !== undefined) {
      if (input.number_of_steps < 1 || input.number_of_steps > 100) {
        throw new Error("Number of steps must be between 1 and 100");
      }
    }

    if (input.seed !== undefined && input.seed < 0) {
      throw new Error("Seed must be a non-negative integer");
    }

    if (input.original_seed !== undefined && input.original_seed < 0) {
      throw new Error("Original seed must be a non-negative integer");
    }

    if (input.scheduler !== undefined && !["euler", "heun"].includes(input.scheduler)) {
      throw new Error("Scheduler must be 'euler' or 'heun'");
    }

    if (input.guidance_type !== undefined && !["cfg", "apg", "cfg_star"].includes(input.guidance_type)) {
      throw new Error("Guidance type must be 'cfg', 'apg', or 'cfg_star'");
    }

    if (input.granularity_scale !== undefined) {
      if (input.granularity_scale < 1 || input.granularity_scale > 50) {
        throw new Error("Granularity scale must be between 1 and 50");
      }
    }

    if (input.guidance_interval !== undefined) {
      if (input.guidance_interval < 0 || input.guidance_interval > 1) {
        throw new Error("Guidance interval must be between 0 and 1");
      }
    }

    if (input.guidance_interval_decay !== undefined) {
      if (input.guidance_interval_decay < 0 || input.guidance_interval_decay > 1) {
        throw new Error("Guidance interval decay must be between 0 and 1");
      }
    }

    if (input.guidance_scale !== undefined) {
      if (input.guidance_scale < 0 || input.guidance_scale > 50) {
        throw new Error("Guidance scale must be between 0 and 50");
      }
    }

    if (input.minimum_guidance_scale !== undefined) {
      if (input.minimum_guidance_scale < 0 || input.minimum_guidance_scale > 50) {
        throw new Error("Minimum guidance scale must be between 0 and 50");
      }
    }

    if (input.tag_guidance_scale !== undefined) {
      if (input.tag_guidance_scale < 0 || input.tag_guidance_scale > 50) {
        throw new Error("Tag guidance scale must be between 0 and 50");
      }
    }

    if (input.lyric_guidance_scale !== undefined) {
      if (input.lyric_guidance_scale < 0 || input.lyric_guidance_scale > 50) {
        throw new Error("Lyric guidance scale must be between 0 and 50");
      }
    }

    // Prepare the request payload
    const payload: any = {
      audio_url: input.audio_url.trim(),
      original_tags: input.original_tags.trim(),
      tags: input.tags.trim()
    };

    // Add optional parameters only if they are provided
    if (input.edit_mode !== undefined) payload.edit_mode = input.edit_mode;
    if (input.original_lyrics !== undefined) payload.original_lyrics = input.original_lyrics.trim();
    if (input.lyrics !== undefined) payload.lyrics = input.lyrics.trim();
    if (input.number_of_steps !== undefined) payload.number_of_steps = input.number_of_steps;
    if (input.seed !== undefined) payload.seed = input.seed;
    if (input.scheduler !== undefined) payload.scheduler = input.scheduler;
    if (input.guidance_type !== undefined) payload.guidance_type = input.guidance_type;
    if (input.granularity_scale !== undefined) payload.granularity_scale = input.granularity_scale;
    if (input.guidance_interval !== undefined) payload.guidance_interval = input.guidance_interval;
    if (input.guidance_interval_decay !== undefined) payload.guidance_interval_decay = input.guidance_interval_decay;
    if (input.guidance_scale !== undefined) payload.guidance_scale = input.guidance_scale;
    if (input.minimum_guidance_scale !== undefined) payload.minimum_guidance_scale = input.minimum_guidance_scale;
    if (input.tag_guidance_scale !== undefined) payload.tag_guidance_scale = input.tag_guidance_scale;
    if (input.lyric_guidance_scale !== undefined) payload.lyric_guidance_scale = input.lyric_guidance_scale;
    if (input.original_seed !== undefined) payload.original_seed = input.original_seed;

    // Execute the model
    const result = await fal.subscribe("fal-ai/ace-step/audio-to-audio", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as ACEStepAudioToAudioOutput;

  } catch (error) {
    console.error("ACE-Step Audio-to-Audio execution failed:", error);
    throw new Error(`ACE-Step Audio-to-Audio generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute ACE-Step Audio-to-Audio with queue management for long-running requests
 * 
 * @param input - The audio-to-audio input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeACEStepAudioToAudioQueue(
  input: ACEStepAudioToAudioInput,
  options: ACEStepAudioToAudioOptions = {}
): Promise<{ request_id: string }> {
  try {
    // Validate input (same validation as above)
    if (!input.audio_url || input.audio_url.trim().length === 0) {
      throw new Error("Audio URL is required");
    }

    if (!input.original_tags || input.original_tags.trim().length === 0) {
      throw new Error("Original tags are required");
    }

    if (!input.tags || input.tags.trim().length === 0) {
      throw new Error("Tags are required");
    }

    try {
      new URL(input.audio_url);
    } catch {
      throw new Error("Audio URL must be a valid URL");
    }

    // Additional validation checks (abbreviated for brevity)
    if (input.edit_mode !== undefined && !["lyrics", "remix"].includes(input.edit_mode)) {
      throw new Error("Edit mode must be 'lyrics' or 'remix'");
    }

    if (input.original_tags.length > 500) {
      throw new Error("Original tags must be 500 characters or less");
    }

    if (input.tags.length > 500) {
      throw new Error("Tags must be 500 characters or less");
    }

    if (input.original_lyrics !== undefined && input.original_lyrics.length > 2000) {
      throw new Error("Original lyrics must be 2000 characters or less");
    }

    if (input.lyrics !== undefined && input.lyrics.length > 2000) {
      throw new Error("Lyrics must be 2000 characters or less");
    }

    // Prepare the request payload (same as above)
    const payload: any = {
      audio_url: input.audio_url.trim(),
      original_tags: input.original_tags.trim(),
      tags: input.tags.trim()
    };

    if (input.edit_mode !== undefined) payload.edit_mode = input.edit_mode;
    if (input.original_lyrics !== undefined) payload.original_lyrics = input.original_lyrics.trim();
    if (input.lyrics !== undefined) payload.lyrics = input.lyrics.trim();
    if (input.number_of_steps !== undefined) payload.number_of_steps = input.number_of_steps;
    if (input.seed !== undefined) payload.seed = input.seed;
    if (input.scheduler !== undefined) payload.scheduler = input.scheduler;
    if (input.guidance_type !== undefined) payload.guidance_type = input.guidance_type;
    if (input.granularity_scale !== undefined) payload.granularity_scale = input.granularity_scale;
    if (input.guidance_interval !== undefined) payload.guidance_interval = input.guidance_interval;
    if (input.guidance_interval_decay !== undefined) payload.guidance_interval_decay = input.guidance_interval_decay;
    if (input.guidance_scale !== undefined) payload.guidance_scale = input.guidance_scale;
    if (input.minimum_guidance_scale !== undefined) payload.minimum_guidance_scale = input.minimum_guidance_scale;
    if (input.tag_guidance_scale !== undefined) payload.tag_guidance_scale = input.tag_guidance_scale;
    if (input.lyric_guidance_scale !== undefined) payload.lyric_guidance_scale = input.lyric_guidance_scale;
    if (input.original_seed !== undefined) payload.original_seed = input.original_seed;

    // Submit to queue
    const { request_id } = await fal.queue.submit("fal-ai/ace-step/audio-to-audio", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("ACE-Step Audio-to-Audio queue submission failed:", error);
    throw new Error(`ACE-Step Audio-to-Audio queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued ACE-Step Audio-to-Audio request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkACEStepAudioToAudioStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/ace-step/audio-to-audio", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("ACE-Step Audio-to-Audio status check failed:", error);
    throw new Error(`ACE-Step Audio-to-Audio status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed ACE-Step Audio-to-Audio request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated audio result
 */
export async function getACEStepAudioToAudioResult(
  requestId: string
): Promise<ACEStepAudioToAudioOutput> {
  try {
    const result = await fal.queue.result("fal-ai/ace-step/audio-to-audio", {
      requestId
    });

    return result.data as ACEStepAudioToAudioOutput;

  } catch (error) {
    console.error("ACE-Step Audio-to-Audio result retrieval failed:", error);
    throw new Error(`ACE-Step Audio-to-Audio result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create audio-to-audio generation scenarios
 * 
 * @param type - Type of audio-to-audio generation to create
 * @param audioUrl - Audio URL to use as reference
 * @param originalTags - Original tags of the audio
 * @param customTags - Custom tags (optional)
 * @param customSettings - Custom settings (optional)
 * @returns ACE-Step Audio-to-Audio input configuration
 */
export function createAudioToAudioScenario(
  type: 'instrumental_to_vocal' | 'vocal_to_instrumental' | 'style_conversion' | 'lyrics_replacement' | 'remix_generation' | 'cover_version' | 'mashup_creation' | 'karaoke_version' | 'custom',
  audioUrl: string,
  originalTags: string,
  customTags?: string,
  customSettings?: Partial<ACEStepAudioToAudioInput>
): ACEStepAudioToAudioInput {
  const scenarioTemplates = {
    instrumental_to_vocal: {
      edit_mode: "remix" as const,
      original_lyrics: "",
      tags: customTags || "vocal, pop, modern, commercial",
      lyrics: "[verse] This is a new verse with fresh lyrics [chorus] Catchy chorus that repeats"
    },
    vocal_to_instrumental: {
      edit_mode: "remix" as const,
      original_lyrics: "Original vocal lyrics",
      tags: customTags || "instrumental, ambient, electronic",
      lyrics: "[inst]"
    },
    style_conversion: {
      edit_mode: "remix" as const,
      original_lyrics: "",
      tags: customTags || "electronic, modern, synth, digital",
      lyrics: "[inst]"
    },
    lyrics_replacement: {
      edit_mode: "lyrics" as const,
      original_lyrics: "Original lyrics to replace",
      tags: originalTags,
      lyrics: "[verse] New lyrics with different message [chorus] Updated chorus with new meaning"
    },
    remix_generation: {
      edit_mode: "remix" as const,
      original_lyrics: "",
      tags: customTags || "remix, electronic, dance, upbeat",
      lyrics: "[verse] Remix verse with new energy [chorus] Remix chorus that gets you moving"
    },
    cover_version: {
      edit_mode: "remix" as const,
      original_lyrics: "Original song lyrics",
      tags: customTags || "cover, acoustic, folk, organic",
      lyrics: "[verse] Cover version with new interpretation [chorus] Cover chorus with personal touch"
    },
    mashup_creation: {
      edit_mode: "remix" as const,
      original_lyrics: "",
      tags: customTags || "mashup, electronic, creative, experimental",
      lyrics: "[verse] Mashup verse combining elements [chorus] Mashup chorus with unique blend"
    },
    karaoke_version: {
      edit_mode: "remix" as const,
      original_lyrics: "Original vocal lyrics",
      tags: customTags || "karaoke, instrumental, backing, track",
      lyrics: "[inst]"
    },
    custom: {
      edit_mode: "remix" as const,
      original_lyrics: "",
      tags: customTags || "custom, unique, modified",
      lyrics: "[inst]"
    }
  };

  const template = scenarioTemplates[type];
  const settings = { ...template, ...customSettings };

  return {
    audio_url: audioUrl,
    original_tags: originalTags,
    ...settings
  };
}

/**
 * Predefined genre tags for different music styles
 */
export const GENRE_TAGS = {
  "lofi_hiphop": "lofi, hiphop, chill, relaxed, atmospheric",
  "electronic_dance": "electronic, dance, edm, energetic, upbeat",
  "rock_alternative": "rock, alternative, guitar, drums, energetic",
  "jazz_smooth": "jazz, smooth, sophisticated, piano, saxophone",
  "classical_orchestral": "classical, orchestral, strings, brass, cinematic",
  "pop_modern": "pop, modern, catchy, commercial, radio-friendly",
  "ambient_atmospheric": "ambient, atmospheric, peaceful, meditative, ethereal",
  "trap_modern": "trap, modern, hiphop, bass, urban",
  "acoustic_folk": "acoustic, folk, guitar, organic, natural",
  "experimental_avant": "experimental, avant-garde, unique, creative, innovative"
} as const;

/**
 * Common lyrics structures
 */
export const LYRICS_STRUCTURES = {
  "verse_chorus": "[verse] This is a verse with storytelling [chorus] This is the catchy chorus that repeats",
  "verse_bridge_chorus": "[verse] Opening verse [bridge] Transitional bridge [chorus] Main chorus",
  "intro_verse_chorus": "[intro] Opening instrumental [verse] First verse [chorus] Main chorus",
  "instrumental": "[inst]",
  "vocal_harmonies": "[verse] Lead vocals with harmonies [chorus] Full vocal arrangement",
  "call_response": "[verse] Call and response pattern [chorus] Group response section"
} as const;

/**
 * Example usage of the ACE-Step Audio-to-Audio executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic audio-to-audio generation
    const result1 = await executeACEStepAudioToAudio({
      audio_url: "https://storage.googleapis.com/falserverless/example_inputs/ace-step-audio-to-audio.wav",
      edit_mode: "remix",
      original_tags: "lofi, hiphop, drum and bass, trap, chill",
      tags: "lofi, hiphop, drum and bass, trap, chill"
    });

    console.log("Generated audio URL:", result1.audio.url);

    // Example 2: Using helper function for instrumental to vocal conversion
    const instrumentalToVocal = createAudioToAudioScenario(
      'instrumental_to_vocal',
      "https://example.com/instrumental.wav",
      "instrumental, ambient, electronic"
    );
    const result2 = await executeACEStepAudioToAudio(instrumentalToVocal);
    console.log("Instrumental to vocal:", result2.audio.url);

    // Example 3: Custom audio-to-audio with lyrics
    const customAudioToAudio = createAudioToAudioScenario(
      'custom',
      "https://example.com/track.wav",
      "rock, alternative, guitar",
      "pop, upbeat, modern, commercial",
      {
        edit_mode: "remix",
        lyrics: "[verse] This is a new verse with fresh lyrics [chorus] Catchy chorus that repeats",
        guidance_scale: 20,
        tag_guidance_scale: 7
      }
    );
    const result3 = await executeACEStepAudioToAudio(customAudioToAudio);
    console.log("Custom audio-to-audio:", result3.audio.url);

    // Example 4: Using predefined genre tags
    const result4 = await executeACEStepAudioToAudio({
      audio_url: "https://example.com/audio.wav",
      edit_mode: "remix",
      original_tags: "rock, alternative, guitar",
      original_lyrics: "Original rock lyrics",
      tags: GENRE_TAGS.pop_modern,
      lyrics: LYRICS_STRUCTURES.verse_chorus,
      seed: 12345
    });
    console.log("Genre-based audio-to-audio:", result4.audio.url);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeACEStepAudioToAudioQueue({
      audio_url: "https://example.com/long_audio.wav",
      edit_mode: "remix",
      original_tags: "ambient, atmospheric, peaceful",
      original_lyrics: "",
      tags: "electronic, dance, energetic",
      lyrics: "[verse] Electronic verse with energy [chorus] Dance chorus that moves you",
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkACEStepAudioToAudioStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getACEStepAudioToAudioResult(request_id);
      console.log("Queue result:", result);
    }

  } catch (error) {
    console.error("Example execution failed:", error);
  }
}

/**
 * Utility function to estimate processing cost
 * 
 * @param audioDuration - Duration of the original audio in seconds
 * @returns Estimated cost in USD
 */
export function estimateProcessingCost(audioDuration: number): number {
  const costPerSecond = 0.0002;
  return audioDuration * costPerSecond;
}

/**
 * Utility function to validate tags format
 * 
 * @param tags - The tags string to validate
 * @returns Validation result with suggestions
 */
export function validateTagsFormat(tags: string): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedTags: string; 
} {
  const suggestions: string[] = [];
  
  // Clean and format tags
  const formattedTags = tags
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
    .join(', ');

  // Check for common issues
  if (tags.length > 500) {
    suggestions.push("Tags are too long (max 500 characters)");
  }

  if (formattedTags.split(',').length < 2) {
    suggestions.push("Consider adding more specific tags for better style control");
  }

  if (formattedTags.split(',').length > 10) {
    suggestions.push("Too many tags may confuse the model, consider focusing on 3-5 key tags");
  }

  // Check for common tag patterns
  const commonTags = ['lofi', 'hiphop', 'electronic', 'rock', 'jazz', 'classical', 'pop', 'ambient', 'trap', 'acoustic'];
  const hasCommonTags = commonTags.some(tag => formattedTags.toLowerCase().includes(tag));
  
  if (!hasCommonTags) {
    suggestions.push("Consider including common genre tags for better results");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedTags
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
 * Utility function to create optimal guidance settings
 * 
 * @param quality - Quality level (low, medium, high)
 * @returns Optimal guidance settings
 */
export function getOptimalGuidanceSettings(quality: 'low' | 'medium' | 'high' = 'medium'): {
  guidance_scale: number;
  tag_guidance_scale: number;
  lyric_guidance_scale: number;
  granularity_scale: number;
  number_of_steps: number;
} {
  const settings = {
    low: {
      guidance_scale: 10,
      tag_guidance_scale: 3,
      lyric_guidance_scale: 1,
      granularity_scale: 5,
      number_of_steps: 15
    },
    medium: {
      guidance_scale: 15,
      tag_guidance_scale: 5,
      lyric_guidance_scale: 1.5,
      granularity_scale: 10,
      number_of_steps: 27
    },
    high: {
      guidance_scale: 25,
      tag_guidance_scale: 8,
      lyric_guidance_scale: 2.5,
      granularity_scale: 15,
      number_of_steps: 50
    }
  };

  return settings[quality];
}

/**
 * Utility function to determine optimal edit mode
 * 
 * @param hasOriginalLyrics - Whether the original audio has lyrics
 * @param hasNewLyrics - Whether new lyrics are provided
 * @param wantsStyleChange - Whether style change is desired
 * @returns Recommended edit mode
 */
export function getOptimalEditMode(
  hasOriginalLyrics: boolean,
  hasNewLyrics: boolean,
  wantsStyleChange: boolean
): "lyrics" | "remix" {
  // If only changing lyrics and no style change, use lyrics mode
  if (hasOriginalLyrics && hasNewLyrics && !wantsStyleChange) {
    return "lyrics";
  }
  
  // Otherwise, use remix mode for full control
  return "remix";
}

/**
 * Supported audio formats
 */
export const SUPPORTED_AUDIO_FORMATS = [
  "MP3",
  "OGG", 
  "WAV",
  "M4A",
  "AAC"
] as const;

/**
 * Common audio-to-audio scenarios
 */
export const AUDIO_TO_AUDIO_SCENARIOS = {
  "instrumental_to_vocal": "Convert instrumental tracks to vocal tracks",
  "vocal_to_instrumental": "Convert vocal tracks to instrumental tracks",
  "style_conversion": "Convert between different musical styles",
  "lyrics_replacement": "Replace lyrics while maintaining style",
  "remix_generation": "Create remix versions of existing tracks",
  "cover_version": "Create cover versions with different styles",
  "mashup_creation": "Create mashups combining different elements",
  "karaoke_version": "Create karaoke/instrumental versions",
  "genre_conversion": "Convert between different genres",
  "mood_transformation": "Transform the mood of existing tracks"
} as const;

/**
 * Edit mode descriptions
 */
export const EDIT_MODE_DESCRIPTIONS = {
  "lyrics": "Edit only the lyrics while preserving the original audio style and structure",
  "remix": "Full audio remix with new style, structure, and optional lyrics"
} as const;

export default executeACEStepAudioToAudio;
