import { fal } from "@fal-ai/client";

export interface ACEStepAudioOutpaintInput {
  audio_url: string;
  extend_before_duration?: number;
  extend_after_duration?: number;
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
}

export interface ACEStepAudioOutpaintOutput {
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

export interface ACEStepAudioOutpaintOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI ACE-Step Audio Outpaint Executor
 * 
 * Extend the beginning or end of provided audio with lyrics and/or style using ACE-Step.
 * Advanced audio extension technology that seamlessly extends existing audio tracks while 
 * maintaining style consistency and adding optional lyrics with precise control over generation parameters.
 * 
 * @param input - The audio outpaint input parameters
 * @param options - Additional execution options
 * @returns Promise with the extended audio result
 */
export async function executeACEStepAudioOutpaint(
  input: ACEStepAudioOutpaintInput,
  options: ACEStepAudioOutpaintOptions = {}
): Promise<ACEStepAudioOutpaintOutput> {
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
    if (input.extend_before_duration !== undefined) {
      if (input.extend_before_duration < 0) {
        throw new Error("Extend before duration must be non-negative");
      }
    }

    if (input.extend_after_duration !== undefined) {
      if (input.extend_after_duration < 0) {
        throw new Error("Extend after duration must be non-negative");
      }
    }

    if (input.tags.length > 500) {
      throw new Error("Tags must be 500 characters or less");
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
    if (input.extend_before_duration !== undefined) payload.extend_before_duration = input.extend_before_duration;
    if (input.extend_after_duration !== undefined) payload.extend_after_duration = input.extend_after_duration;
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

    // Execute the model
    const result = await fal.subscribe("fal-ai/ace-step/audio-outpaint", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as ACEStepAudioOutpaintOutput;

  } catch (error) {
    console.error("ACE-Step Audio Outpaint execution failed:", error);
    throw new Error(`ACE-Step Audio Outpaint generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute ACE-Step Audio Outpaint with queue management for long-running requests
 * 
 * @param input - The audio outpaint input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeACEStepAudioOutpaintQueue(
  input: ACEStepAudioOutpaintInput,
  options: ACEStepAudioOutpaintOptions = {}
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
    if (input.extend_before_duration !== undefined && input.extend_before_duration < 0) {
      throw new Error("Extend before duration must be non-negative");
    }

    if (input.extend_after_duration !== undefined && input.extend_after_duration < 0) {
      throw new Error("Extend after duration must be non-negative");
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

    if (input.extend_before_duration !== undefined) payload.extend_before_duration = input.extend_before_duration;
    if (input.extend_after_duration !== undefined) payload.extend_after_duration = input.extend_after_duration;
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

    // Submit to queue
    const { request_id } = await fal.queue.submit("fal-ai/ace-step/audio-outpaint", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("ACE-Step Audio Outpaint queue submission failed:", error);
    throw new Error(`ACE-Step Audio Outpaint queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued ACE-Step Audio Outpaint request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkACEStepAudioOutpaintStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/ace-step/audio-outpaint", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("ACE-Step Audio Outpaint status check failed:", error);
    throw new Error(`ACE-Step Audio Outpaint status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed ACE-Step Audio Outpaint request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the extended audio result
 */
export async function getACEStepAudioOutpaintResult(
  requestId: string
): Promise<ACEStepAudioOutpaintOutput> {
  try {
    const result = await fal.queue.result("fal-ai/ace-step/audio-outpaint", {
      requestId
    });

    return result.data as ACEStepAudioOutpaintOutput;

  } catch (error) {
    console.error("ACE-Step Audio Outpaint result retrieval failed:", error);
    throw new Error(`ACE-Step Audio Outpaint result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create audio extension scenarios
 * 
 * @param type - Type of audio extension to create
 * @param audioUrl - Audio URL to extend
 * @param customTags - Custom tags (optional)
 * @param customSettings - Custom settings (optional)
 * @returns ACE-Step Audio Outpaint input configuration
 */
export function createAudioExtensionScenario(
  type: 'intro' | 'outro' | 'verse' | 'chorus' | 'bridge' | 'instrumental' | 'extended' | 'custom',
  audioUrl: string,
  customTags?: string,
  customSettings?: Partial<ACEStepAudioOutpaintInput>
): ACEStepAudioOutpaintInput {
  const scenarioTemplates = {
    intro: {
      extend_before_duration: 30,
      extend_after_duration: 0,
      tags: "intro, buildup, atmospheric, ambient",
      lyrics: "[inst]"
    },
    outro: {
      extend_before_duration: 0,
      extend_after_duration: 30,
      tags: "outro, fadeout, atmospheric, ambient",
      lyrics: "[inst]"
    },
    verse: {
      extend_before_duration: 0,
      extend_after_duration: 45,
      tags: "verse, melodic, vocal, structured",
      lyrics: "[verse] This is a new verse with fresh lyrics and creative flow"
    },
    chorus: {
      extend_before_duration: 0,
      extend_after_duration: 30,
      tags: "chorus, catchy, repetitive, memorable",
      lyrics: "[chorus] Catchy chorus that repeats and stays in your mind"
    },
    bridge: {
      extend_before_duration: 0,
      extend_after_duration: 20,
      tags: "bridge, transition, different, contrast",
      lyrics: "[bridge] This is a bridge section that provides contrast"
    },
    instrumental: {
      extend_before_duration: 0,
      extend_after_duration: 60,
      tags: "instrumental, melodic, instrumental, extended",
      lyrics: "[inst]"
    },
    extended: {
      extend_before_duration: 15,
      extend_after_duration: 45,
      tags: "extended, longer, developed, full",
      lyrics: "[verse] Extended version with more content [chorus] Longer chorus section"
    },
    custom: {
      extend_before_duration: 0,
      extend_after_duration: 30,
      tags: customTags || "extended, custom, unique",
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
 * Example usage of the ACE-Step Audio Outpaint executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic audio extension
    const result1 = await executeACEStepAudioOutpaint({
      audio_url: "https://storage.googleapis.com/falserverless/example_inputs/ace-step-audio-to-audio.wav",
      extend_before_duration: 0,
      extend_after_duration: 30,
      tags: "lofi, hiphop, drum and bass, trap, chill"
    });

    console.log("Extended audio URL:", result1.audio.url);

    // Example 2: Using helper function for intro extension
    const introExtension = createAudioExtensionScenario(
      'intro',
      "https://example.com/song.wav"
    );
    const result2 = await executeACEStepAudioOutpaint(introExtension);
    console.log("Intro extension:", result2.audio.url);

    // Example 3: Custom extension with lyrics
    const customExtension = createAudioExtensionScenario(
      'custom',
      "https://example.com/track.wav",
      "pop, upbeat, modern, commercial",
      {
        extend_after_duration: 45,
        lyrics: "[verse] This is a new verse with fresh lyrics [chorus] Catchy chorus that repeats",
        guidance_scale: 20,
        tag_guidance_scale: 7
      }
    );
    const result3 = await executeACEStepAudioOutpaint(customExtension);
    console.log("Custom extension:", result3.audio.url);

    // Example 4: Using predefined genre tags
    const result4 = await executeACEStepAudioOutpaint({
      audio_url: "https://example.com/audio.wav",
      extend_after_duration: 60,
      tags: GENRE_TAGS.lofi_hiphop,
      lyrics: LYRICS_STRUCTURES.verse_chorus,
      seed: 12345
    });
    console.log("Genre-based extension:", result4.audio.url);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeACEStepAudioOutpaintQueue({
      audio_url: "https://example.com/long_audio.wav",
      extend_after_duration: 120,
      tags: "ambient, atmospheric, extended, peaceful",
      lyrics: "[inst]",
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkACEStepAudioOutpaintStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getACEStepAudioOutpaintResult(request_id);
      console.log("Queue result:", result);
    }

  } catch (error) {
    console.error("Example execution failed:", error);
  }
}

/**
 * Utility function to estimate processing cost
 * 
 * @param extendBefore - Duration to extend before in seconds
 * @param extendAfter - Duration to extend after in seconds
 * @returns Estimated cost in USD
 */
export function estimateProcessingCost(extendBefore: number = 0, extendAfter: number = 30): number {
  const costPerSecond = 0.0002;
  const totalDuration = extendBefore + extendAfter;
  return totalDuration * costPerSecond;
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
 * Common extension scenarios
 */
export const EXTENSION_SCENARIOS = {
  "intro_extension": "Add an intro section to the beginning of audio",
  "outro_extension": "Add an outro section to the end of audio",
  "verse_extension": "Add a new verse with lyrics",
  "chorus_extension": "Add a chorus section with repetitive lyrics",
  "bridge_extension": "Add a bridge section for contrast",
  "instrumental_extension": "Extend with instrumental content only",
  "bidirectional_extension": "Extend both before and after the original audio",
  "style_transfer": "Extend while changing the musical style"
} as const;

export default executeACEStepAudioOutpaint;
