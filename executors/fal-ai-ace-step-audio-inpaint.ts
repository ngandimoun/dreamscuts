import { fal } from "@fal-ai/client";

export interface ACEStepAudioInpaintInput {
  audio_url: string;
  start_time_relative_to?: "start" | "end";
  start_time?: number;
  end_time_relative_to?: "start" | "end";
  end_time?: number;
  tags: string;
  lyrics?: string;
  variance?: number;
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
}

export interface ACEStepAudioInpaintOutput {
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

export interface ACEStepAudioInpaintOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI ACE-Step Audio Inpaint Executor
 * 
 * Modify a portion of provided audio with lyrics and/or style using ACE-Step.
 * Advanced audio inpainting technology that seamlessly replaces or regenerates 
 * specific sections of existing audio tracks while maintaining style consistency 
 * and adding optional lyrics with precise control over generation parameters.
 * 
 * @param input - The audio inpaint input parameters
 * @param options - Additional execution options
 * @returns Promise with the inpainted audio result
 */
export async function executeACEStepAudioInpaint(
  input: ACEStepAudioInpaintInput,
  options: ACEStepAudioInpaintOptions = {}
): Promise<ACEStepAudioInpaintOutput> {
  try {
    // Validate required inputs
    if (!input.audio_url || input.audio_url.trim().length === 0) {
      throw new Error("Audio URL is required");
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
    if (input.start_time !== undefined) {
      if (input.start_time < 0) {
        throw new Error("Start time must be non-negative");
      }
    }

    if (input.end_time !== undefined) {
      if (input.end_time < 0) {
        throw new Error("End time must be non-negative");
      }
    }

    if (input.start_time !== undefined && input.end_time !== undefined) {
      if (input.end_time <= input.start_time) {
        throw new Error("End time must be greater than start time");
      }
    }

    if (input.tags.length > 500) {
      throw new Error("Tags must be 500 characters or less");
    }

    if (input.lyrics !== undefined && input.lyrics.length > 2000) {
      throw new Error("Lyrics must be 2000 characters or less");
    }

    if (input.variance !== undefined) {
      if (input.variance < 0 || input.variance > 1) {
        throw new Error("Variance must be between 0 and 1");
      }
    }

    if (input.number_of_steps !== undefined) {
      if (input.number_of_steps < 1 || input.number_of_steps > 100) {
        throw new Error("Number of steps must be between 1 and 100");
      }
    }

    if (input.seed !== undefined && input.seed < 0) {
      throw new Error("Seed must be a non-negative integer");
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
      tags: input.tags.trim()
    };

    // Add optional parameters only if they are provided
    if (input.start_time_relative_to !== undefined) payload.start_time_relative_to = input.start_time_relative_to;
    if (input.start_time !== undefined) payload.start_time = input.start_time;
    if (input.end_time_relative_to !== undefined) payload.end_time_relative_to = input.end_time_relative_to;
    if (input.end_time !== undefined) payload.end_time = input.end_time;
    if (input.lyrics !== undefined) payload.lyrics = input.lyrics.trim();
    if (input.variance !== undefined) payload.variance = input.variance;
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

    // Execute the model
    const result = await fal.subscribe("fal-ai/ace-step/audio-inpaint", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as ACEStepAudioInpaintOutput;

  } catch (error) {
    console.error("ACE-Step Audio Inpaint execution failed:", error);
    throw new Error(`ACE-Step Audio Inpaint generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute ACE-Step Audio Inpaint with queue management for long-running requests
 * 
 * @param input - The audio inpaint input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeACEStepAudioInpaintQueue(
  input: ACEStepAudioInpaintInput,
  options: ACEStepAudioInpaintOptions = {}
): Promise<{ request_id: string }> {
  try {
    // Validate input (same validation as above)
    if (!input.audio_url || input.audio_url.trim().length === 0) {
      throw new Error("Audio URL is required");
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
    if (input.start_time !== undefined && input.start_time < 0) {
      throw new Error("Start time must be non-negative");
    }

    if (input.end_time !== undefined && input.end_time < 0) {
      throw new Error("End time must be non-negative");
    }

    if (input.start_time !== undefined && input.end_time !== undefined) {
      if (input.end_time <= input.start_time) {
        throw new Error("End time must be greater than start time");
      }
    }

    if (input.tags.length > 500) {
      throw new Error("Tags must be 500 characters or less");
    }

    if (input.lyrics !== undefined && input.lyrics.length > 2000) {
      throw new Error("Lyrics must be 2000 characters or less");
    }

    // Prepare the request payload (same as above)
    const payload: any = {
      audio_url: input.audio_url.trim(),
      tags: input.tags.trim()
    };

    if (input.start_time_relative_to !== undefined) payload.start_time_relative_to = input.start_time_relative_to;
    if (input.start_time !== undefined) payload.start_time = input.start_time;
    if (input.end_time_relative_to !== undefined) payload.end_time_relative_to = input.end_time_relative_to;
    if (input.end_time !== undefined) payload.end_time = input.end_time;
    if (input.lyrics !== undefined) payload.lyrics = input.lyrics.trim();
    if (input.variance !== undefined) payload.variance = input.variance;
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

    // Submit to queue
    const { request_id } = await fal.queue.submit("fal-ai/ace-step/audio-inpaint", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("ACE-Step Audio Inpaint queue submission failed:", error);
    throw new Error(`ACE-Step Audio Inpaint queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued ACE-Step Audio Inpaint request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkACEStepAudioInpaintStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/ace-step/audio-inpaint", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("ACE-Step Audio Inpaint status check failed:", error);
    throw new Error(`ACE-Step Audio Inpaint status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed ACE-Step Audio Inpaint request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the inpainted audio result
 */
export async function getACEStepAudioInpaintResult(
  requestId: string
): Promise<ACEStepAudioInpaintOutput> {
  try {
    const result = await fal.queue.result("fal-ai/ace-step/audio-inpaint", {
      requestId
    });

    return result.data as ACEStepAudioInpaintOutput;

  } catch (error) {
    console.error("ACE-Step Audio Inpaint result retrieval failed:", error);
    throw new Error(`ACE-Step Audio Inpaint result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create audio inpainting scenarios
 * 
 * @param type - Type of audio inpainting to create
 * @param audioUrl - Audio URL to inpaint
 * @param customTags - Custom tags (optional)
 * @param customSettings - Custom settings (optional)
 * @returns ACE-Step Audio Inpaint input configuration
 */
export function createAudioInpaintScenario(
  type: 'verse_replacement' | 'chorus_replacement' | 'bridge_replacement' | 'intro_replacement' | 'outro_replacement' | 'instrumental_replacement' | 'style_change' | 'lyrics_change' | 'custom',
  audioUrl: string,
  customTags?: string,
  customSettings?: Partial<ACEStepAudioInpaintInput>
): ACEStepAudioInpaintInput {
  const scenarioTemplates = {
    verse_replacement: {
      start_time_relative_to: "start" as const,
      start_time: 30,
      end_time_relative_to: "start" as const,
      end_time: 60,
      tags: "verse, melodic, vocal, structured",
      lyrics: "[verse] This is a new verse with fresh lyrics and creative flow"
    },
    chorus_replacement: {
      start_time_relative_to: "start" as const,
      start_time: 60,
      end_time_relative_to: "start" as const,
      end_time: 90,
      tags: "chorus, catchy, repetitive, memorable",
      lyrics: "[chorus] Catchy chorus that repeats and stays in your mind"
    },
    bridge_replacement: {
      start_time_relative_to: "start" as const,
      start_time: 90,
      end_time_relative_to: "start" as const,
      end_time: 110,
      tags: "bridge, transition, different, contrast",
      lyrics: "[bridge] This is a bridge section that provides contrast"
    },
    intro_replacement: {
      start_time_relative_to: "start" as const,
      start_time: 0,
      end_time_relative_to: "start" as const,
      end_time: 30,
      tags: "intro, buildup, atmospheric, ambient",
      lyrics: "[inst]"
    },
    outro_replacement: {
      start_time_relative_to: "end" as const,
      start_time: 30,
      end_time_relative_to: "end" as const,
      end_time: 0,
      tags: "outro, fadeout, atmospheric, ambient",
      lyrics: "[inst]"
    },
    instrumental_replacement: {
      start_time_relative_to: "start" as const,
      start_time: 45,
      end_time_relative_to: "start" as const,
      end_time: 75,
      tags: "instrumental, melodic, instrumental, extended",
      lyrics: "[inst]"
    },
    style_change: {
      start_time_relative_to: "start" as const,
      start_time: 0,
      end_time_relative_to: "start" as const,
      end_time: 60,
      tags: "electronic, modern, synth, digital",
      lyrics: "[inst]"
    },
    lyrics_change: {
      start_time_relative_to: "start" as const,
      start_time: 30,
      end_time_relative_to: "start" as const,
      end_time: 90,
      tags: "pop, upbeat, modern, commercial",
      lyrics: "[verse] New lyrics with different message [chorus] Updated chorus with new meaning"
    },
    custom: {
      start_time_relative_to: "start" as const,
      start_time: 0,
      end_time_relative_to: "start" as const,
      end_time: 30,
      tags: customTags || "custom, unique, modified",
      lyrics: "[inst]"
    }
  };

  const template = scenarioTemplates[type];
  const settings = { ...template, ...customSettings };

  return {
    audio_url: audioUrl,
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
 * Example usage of the ACE-Step Audio Inpaint executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic audio inpainting
    const result1 = await executeACEStepAudioInpaint({
      audio_url: "https://storage.googleapis.com/falserverless/example_inputs/ace-step-audio-to-audio.wav",
      start_time_relative_to: "start",
      start_time: 0,
      end_time_relative_to: "start",
      end_time: 30,
      tags: "lofi, hiphop, drum and bass, trap, chill"
    });

    console.log("Inpainted audio URL:", result1.audio.url);

    // Example 2: Using helper function for verse replacement
    const verseReplacement = createAudioInpaintScenario(
      'verse_replacement',
      "https://example.com/song.wav"
    );
    const result2 = await executeACEStepAudioInpaint(verseReplacement);
    console.log("Verse replacement:", result2.audio.url);

    // Example 3: Custom inpainting with lyrics
    const customInpaint = createAudioInpaintScenario(
      'custom',
      "https://example.com/track.wav",
      "pop, upbeat, modern, commercial",
      {
        start_time: 60,
        end_time: 90,
        lyrics: "[verse] This is a new verse with fresh lyrics [chorus] Catchy chorus that repeats",
        variance: 0.7,
        guidance_scale: 20,
        tag_guidance_scale: 7
      }
    );
    const result3 = await executeACEStepAudioInpaint(customInpaint);
    console.log("Custom inpainting:", result3.audio.url);

    // Example 4: Using predefined genre tags
    const result4 = await executeACEStepAudioInpaint({
      audio_url: "https://example.com/audio.wav",
      start_time_relative_to: "start",
      start_time: 30,
      end_time_relative_to: "start",
      end_time: 60,
      tags: GENRE_TAGS.lofi_hiphop,
      lyrics: LYRICS_STRUCTURES.verse_chorus,
      seed: 12345
    });
    console.log("Genre-based inpainting:", result4.audio.url);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeACEStepAudioInpaintQueue({
      audio_url: "https://example.com/long_audio.wav",
      start_time_relative_to: "start",
      start_time: 120,
      end_time_relative_to: "start",
      end_time: 180,
      tags: "ambient, atmospheric, peaceful",
      lyrics: "[inst]",
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkACEStepAudioInpaintStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getACEStepAudioInpaintResult(request_id);
      console.log("Queue result:", result);
    }

  } catch (error) {
    console.error("Example execution failed:", error);
  }
}

/**
 * Utility function to estimate processing cost
 * 
 * @param startTime - Start time in seconds
 * @param endTime - End time in seconds
 * @returns Estimated cost in USD
 */
export function estimateProcessingCost(startTime: number = 0, endTime: number = 30): number {
  const costPerSecond = 0.0002;
  const duration = endTime - startTime;
  return duration * costPerSecond;
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
  variance: number;
} {
  const settings = {
    low: {
      guidance_scale: 10,
      tag_guidance_scale: 3,
      lyric_guidance_scale: 1,
      granularity_scale: 5,
      number_of_steps: 15,
      variance: 0.3
    },
    medium: {
      guidance_scale: 15,
      tag_guidance_scale: 5,
      lyric_guidance_scale: 1.5,
      granularity_scale: 10,
      number_of_steps: 27,
      variance: 0.5
    },
    high: {
      guidance_scale: 25,
      tag_guidance_scale: 8,
      lyric_guidance_scale: 2.5,
      granularity_scale: 15,
      number_of_steps: 50,
      variance: 0.7
    }
  };

  return settings[quality];
}

/**
 * Utility function to validate time range
 * 
 * @param startTime - Start time in seconds
 * @param endTime - End time in seconds
 * @param audioDuration - Total audio duration in seconds (optional)
 * @returns Validation result
 */
export function validateTimeRange(
  startTime: number, 
  endTime: number, 
  audioDuration?: number
): { 
  isValid: boolean; 
  suggestions: string[]; 
  duration: number; 
} {
  const suggestions: string[] = [];
  const duration = endTime - startTime;

  if (startTime < 0) {
    suggestions.push("Start time must be non-negative");
  }

  if (endTime < 0) {
    suggestions.push("End time must be non-negative");
  }

  if (endTime <= startTime) {
    suggestions.push("End time must be greater than start time");
  }

  if (duration < 1) {
    suggestions.push("Inpainting duration should be at least 1 second");
  }

  if (duration > 300) {
    suggestions.push("Very long inpainting sections may take significant processing time");
  }

  if (audioDuration !== undefined) {
    if (startTime >= audioDuration) {
      suggestions.push("Start time exceeds audio duration");
    }

    if (endTime > audioDuration) {
      suggestions.push("End time exceeds audio duration");
    }
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    duration
  };
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
 * Common inpainting scenarios
 */
export const INPAINTING_SCENARIOS = {
  "verse_replacement": "Replace a verse section with new lyrics and style",
  "chorus_replacement": "Replace a chorus section with new content",
  "bridge_replacement": "Replace a bridge section for contrast",
  "intro_replacement": "Replace the intro section of audio",
  "outro_replacement": "Replace the outro section of audio",
  "instrumental_replacement": "Replace instrumental sections with new content",
  "style_change": "Change the style of a specific section",
  "lyrics_change": "Replace lyrics while maintaining style",
  "quality_fix": "Fix audio quality issues in specific sections",
  "content_removal": "Remove unwanted content from audio sections"
} as const;

/**
 * Time positioning options
 */
export const TIME_POSITIONING = {
  "start_relative": "Time relative to the start of the audio",
  "end_relative": "Time relative to the end of the audio",
  "absolute": "Absolute time positions from the beginning"
} as const;

export default executeACEStepAudioInpaint;
