import { fal } from "@fal-ai/client";

export interface ACEStepLyricsToAudioInput {
  tags: string;
  lyrics?: string;
  duration?: number;
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

export interface ACEStepLyricsToAudioOutput {
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

export interface ACEStepLyricsToAudioOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI ACE-Step Lyrics to Audio Executor
 * 
 * Generate music with lyrics from text using ACE-Step.
 * Advanced lyrics-to-audio generation technology that creates complete musical 
 * compositions from genre tags and lyrics with precise control over generation 
 * parameters, support for both instrumental and vocal tracks, and advanced 
 * guidance control for professional-quality music generation.
 * 
 * @param input - The lyrics-to-audio input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated audio result
 */
export async function executeACEStepLyricsToAudio(
  input: ACEStepLyricsToAudioInput,
  options: ACEStepLyricsToAudioOptions = {}
): Promise<ACEStepLyricsToAudioOutput> {
  try {
    // Validate required inputs
    if (!input.tags || input.tags.trim().length === 0) {
      throw new Error("Tags are required");
    }

    if (input.tags.length > 500) {
      throw new Error("Tags must be 500 characters or less");
    }

    // Validate optional parameters
    if (input.lyrics !== undefined && input.lyrics.length > 2000) {
      throw new Error("Lyrics must be 2000 characters or less");
    }

    if (input.duration !== undefined) {
      if (input.duration < 1 || input.duration > 600) {
        throw new Error("Duration must be between 1 and 600 seconds");
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
      tags: input.tags.trim()
    };

    // Add optional parameters only if they are provided
    if (input.lyrics !== undefined) payload.lyrics = input.lyrics.trim();
    if (input.duration !== undefined) payload.duration = input.duration;
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
    const result = await fal.subscribe("fal-ai/ace-step", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as ACEStepLyricsToAudioOutput;

  } catch (error) {
    console.error("ACE-Step Lyrics to Audio execution failed:", error);
    throw new Error(`ACE-Step Lyrics to Audio generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute ACE-Step Lyrics to Audio with queue management for long-running requests
 * 
 * @param input - The lyrics-to-audio input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeACEStepLyricsToAudioQueue(
  input: ACEStepLyricsToAudioInput,
  options: ACEStepLyricsToAudioOptions = {}
): Promise<{ request_id: string }> {
  try {
    // Validate input (same validation as above)
    if (!input.tags || input.tags.trim().length === 0) {
      throw new Error("Tags are required");
    }

    if (input.tags.length > 500) {
      throw new Error("Tags must be 500 characters or less");
    }

    if (input.lyrics !== undefined && input.lyrics.length > 2000) {
      throw new Error("Lyrics must be 2000 characters or less");
    }

    if (input.duration !== undefined) {
      if (input.duration < 1 || input.duration > 600) {
        throw new Error("Duration must be between 1 and 600 seconds");
      }
    }

    // Additional validation checks (abbreviated for brevity)
    if (input.number_of_steps !== undefined) {
      if (input.number_of_steps < 1 || input.number_of_steps > 100) {
        throw new Error("Number of steps must be between 1 and 100");
      }
    }

    if (input.seed !== undefined && input.seed < 0) {
      throw new Error("Seed must be a non-negative integer");
    }

    // Prepare the request payload (same as above)
    const payload: any = {
      tags: input.tags.trim()
    };

    if (input.lyrics !== undefined) payload.lyrics = input.lyrics.trim();
    if (input.duration !== undefined) payload.duration = input.duration;
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
    const { request_id } = await fal.queue.submit("fal-ai/ace-step", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("ACE-Step Lyrics to Audio queue submission failed:", error);
    throw new Error(`ACE-Step Lyrics to Audio queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued ACE-Step Lyrics to Audio request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkACEStepLyricsToAudioStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/ace-step", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("ACE-Step Lyrics to Audio status check failed:", error);
    throw new Error(`ACE-Step Lyrics to Audio status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed ACE-Step Lyrics to Audio request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated audio result
 */
export async function getACEStepLyricsToAudioResult(
  requestId: string
): Promise<ACEStepLyricsToAudioOutput> {
  try {
    const result = await fal.queue.result("fal-ai/ace-step", {
      requestId
    });

    return result.data as ACEStepLyricsToAudioOutput;

  } catch (error) {
    console.error("ACE-Step Lyrics to Audio result retrieval failed:", error);
    throw new Error(`ACE-Step Lyrics to Audio result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create lyrics-to-audio generation scenarios
 * 
 * @param type - Type of lyrics-to-audio generation to create
 * @param customTags - Custom tags (optional)
 * @param customLyrics - Custom lyrics (optional)
 * @param customSettings - Custom settings (optional)
 * @returns ACE-Step Lyrics to Audio input configuration
 */
export function createLyricsToAudioScenario(
  type: 'vocal_song' | 'instrumental_track' | 'background_music' | 'theme_music' | 'jingle_creation' | 'workout_music' | 'meditation_music' | 'game_music' | 'podcast_music' | 'social_media_music' | 'custom',
  customTags?: string,
  customLyrics?: string,
  customSettings?: Partial<ACEStepLyricsToAudioInput>
): ACEStepLyricsToAudioInput {
  const scenarioTemplates = {
    vocal_song: {
      tags: customTags || "pop, modern, catchy, commercial, radio-friendly",
      lyrics: customLyrics || "[verse] This is a verse with storytelling [chorus] This is the catchy chorus that repeats",
      duration: 180
    },
    instrumental_track: {
      tags: customTags || "instrumental, ambient, electronic, atmospheric",
      lyrics: "[inst]",
      duration: 120
    },
    background_music: {
      tags: customTags || "upbeat, instrumental, modern, electronic, background",
      lyrics: "[inst]",
      duration: 90
    },
    theme_music: {
      tags: customTags || "epic, orchestral, cinematic, dramatic, strings",
      lyrics: "[inst]",
      duration: 60
    },
    jingle_creation: {
      tags: customTags || "catchy, commercial, upbeat, memorable, short",
      lyrics: customLyrics || "[verse] Catchy jingle verse [chorus] Memorable hook that sticks",
      duration: 30
    },
    workout_music: {
      tags: customTags || "high-energy, electronic, dance, motivational, upbeat",
      lyrics: customLyrics || "[verse] Push yourself to the limit [chorus] You can do anything you set your mind to",
      duration: 180
    },
    meditation_music: {
      tags: customTags || "calming, peaceful, ambient, meditative, soft",
      lyrics: customLyrics || "[verse] Breathe in peace, breathe out stress [chorus] Find your center, find your calm",
      duration: 300
    },
    game_music: {
      tags: customTags || "adventure, epic, orchestral, mysterious, dynamic",
      lyrics: "[inst]",
      duration: 120
    },
    podcast_music: {
      tags: customTags || "professional, modern, electronic, clean, engaging",
      lyrics: "[inst]",
      duration: 15
    },
    social_media_music: {
      tags: customTags || "trendy, modern, hip-hop, catchy, short",
      lyrics: customLyrics || "[verse] Living my best life [chorus] Nothing can stop me now",
      duration: 60
    },
    custom: {
      tags: customTags || "custom, unique, modified, creative",
      lyrics: customLyrics || "[inst]",
      duration: 60
    }
  };

  const template = scenarioTemplates[type];
  const settings = { ...template, ...customSettings };

  return {
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
 * Example usage of the ACE-Step Lyrics to Audio executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic lyrics-to-audio generation
    const result1 = await executeACEStepLyricsToAudio({
      tags: "lofi, hiphop, drum and bass, trap, chill",
      lyrics: "[verse] Walking down the street on a sunny day [chorus] Everything feels right, everything's okay",
      duration: 60
    });

    console.log("Generated audio URL:", result1.audio.url);

    // Example 2: Using helper function for vocal song
    const vocalSong = createLyricsToAudioScenario('vocal_song');
    const result2 = await executeACEStepLyricsToAudio(vocalSong);
    console.log("Vocal song:", result2.audio.url);

    // Example 3: Custom lyrics-to-audio with specific settings
    const customSong = createLyricsToAudioScenario(
      'custom',
      "rock, alternative, guitar, powerful, energetic",
      "[verse] The world is changing fast around me [chorus] But I'll stand my ground and be free",
      {
        duration: 180,
        guidance_scale: 20,
        tag_guidance_scale: 7
      }
    );
    const result3 = await executeACEStepLyricsToAudio(customSong);
    console.log("Custom rock song:", result3.audio.url);

    // Example 4: Using predefined genre tags
    const result4 = await executeACEStepLyricsToAudio({
      tags: GENRE_TAGS.lofi_hiphop,
      lyrics: LYRICS_STRUCTURES.verse_chorus,
      duration: 90,
      seed: 12345
    });
    console.log("Lofi hiphop track:", result4.audio.url);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeACEStepLyricsToAudioQueue({
      tags: "ambient, atmospheric, peaceful, meditative",
      lyrics: "[verse] Breathe in peace, breathe out stress [chorus] Find your center, find your calm",
      duration: 300,
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkACEStepLyricsToAudioStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getACEStepLyricsToAudioResult(request_id);
      console.log("Queue result:", result);
    }

  } catch (error) {
    console.error("Example execution failed:", error);
  }
}

/**
 * Utility function to estimate processing cost
 * 
 * @param duration - Duration of the audio in seconds
 * @returns Estimated cost in USD
 */
export function estimateProcessingCost(duration: number): number {
  const costPerSecond = 0.0002;
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
 * Utility function to validate lyrics format
 * 
 * @param lyrics - The lyrics string to validate
 * @returns Validation result with suggestions
 */
export function validateLyricsFormat(lyrics: string): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedLyrics: string; 
} {
  const suggestions: string[] = [];
  
  // Clean and format lyrics
  const formattedLyrics = lyrics.trim();

  // Check for common issues
  if (lyrics.length > 2000) {
    suggestions.push("Lyrics are too long (max 2000 characters)");
  }

  if (lyrics.length < 10 && lyrics !== "[inst]" && lyrics !== "[instrumental]") {
    suggestions.push("Lyrics are too short, consider adding more content");
  }

  // Check for structure markers
  const hasStructure = /\[(verse|chorus|bridge|intro|outro)\]/i.test(lyrics);
  if (!hasStructure && lyrics !== "[inst]" && lyrics !== "[instrumental]") {
    suggestions.push("Consider using structure markers like [verse], [chorus], [bridge] for better organization");
  }

  // Check for instrumental markers
  const isInstrumental = lyrics === "[inst]" || lyrics === "[instrumental]";
  if (!isInstrumental && !hasStructure) {
    suggestions.push("Consider using [inst] or [instrumental] for instrumental tracks, or add structure markers for vocal tracks");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedLyrics
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
 * Utility function to create duration-optimized settings
 * 
 * @param duration - Duration in seconds
 * @returns Optimized settings for the duration
 */
export function getDurationOptimizedSettings(duration: number): {
  number_of_steps: number;
  granularity_scale: number;
  guidance_scale: number;
} {
  if (duration <= 30) {
    return {
      number_of_steps: 20,
      granularity_scale: 8,
      guidance_scale: 12
    };
  } else if (duration <= 120) {
    return {
      number_of_steps: 27,
      granularity_scale: 10,
      guidance_scale: 15
    };
  } else if (duration <= 300) {
    return {
      number_of_steps: 35,
      granularity_scale: 12,
      guidance_scale: 18
    };
  } else {
    return {
      number_of_steps: 50,
      granularity_scale: 15,
      guidance_scale: 25
    };
  }
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
 * Common lyrics-to-audio scenarios
 */
export const LYRICS_TO_AUDIO_SCENARIOS = {
  "vocal_song": "Generate complete songs with vocals and lyrics",
  "instrumental_track": "Create instrumental tracks without vocals",
  "background_music": "Generate background music for videos and content",
  "theme_music": "Create theme music for presentations and content",
  "jingle_creation": "Generate short jingles and musical hooks",
  "workout_music": "Create high-energy music for exercise and fitness",
  "meditation_music": "Generate calming music for meditation and relaxation",
  "game_music": "Create music for games and interactive content",
  "podcast_music": "Generate intro and background music for podcasts",
  "social_media_music": "Create music for social media content"
} as const;

/**
 * Lyrics structure markers
 */
export const LYRICS_MARKERS = {
  "verse": "[verse] - Main verse section",
  "chorus": "[chorus] - Main chorus section",
  "bridge": "[bridge] - Bridge section",
  "intro": "[intro] - Introduction section",
  "outro": "[outro] - Conclusion section",
  "instrumental": "[inst] or [instrumental] - Instrumental track"
} as const;

export default executeACEStepLyricsToAudio;
