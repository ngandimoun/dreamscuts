import { fal } from "@fal-ai/client";

export interface ACEStepPromptToAudioInput {
  prompt: string;
  instrumental?: boolean;
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

export interface ACEStepPromptToAudioOutput {
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

export interface ACEStepPromptToAudioOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI ACE-Step Prompt-to-Audio Executor
 * 
 * Generate music from a simple prompt using ACE-Step.
 * Advanced prompt-to-audio generation technology that creates complete musical 
 * compositions from natural language descriptions with automatic tag and lyrics 
 * generation, precise control over generation parameters, and support for both 
 * instrumental and vocal tracks.
 * 
 * @param input - The prompt-to-audio input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated audio result
 */
export async function executeACEStepPromptToAudio(
  input: ACEStepPromptToAudioInput,
  options: ACEStepPromptToAudioOptions = {}
): Promise<ACEStepPromptToAudioOutput> {
  try {
    // Validate required inputs
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (input.prompt.length > 1000) {
      throw new Error("Prompt must be 1000 characters or less");
    }

    // Validate optional parameters
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
      prompt: input.prompt.trim()
    };

    // Add optional parameters only if they are provided
    if (input.instrumental !== undefined) payload.instrumental = input.instrumental;
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
    const result = await fal.subscribe("fal-ai/ace-step/prompt-to-audio", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as ACEStepPromptToAudioOutput;

  } catch (error) {
    console.error("ACE-Step Prompt-to-Audio execution failed:", error);
    throw new Error(`ACE-Step Prompt-to-Audio generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute ACE-Step Prompt-to-Audio with queue management for long-running requests
 * 
 * @param input - The prompt-to-audio input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeACEStepPromptToAudioQueue(
  input: ACEStepPromptToAudioInput,
  options: ACEStepPromptToAudioOptions = {}
): Promise<{ request_id: string }> {
  try {
    // Validate input (same validation as above)
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (input.prompt.length > 1000) {
      throw new Error("Prompt must be 1000 characters or less");
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
      prompt: input.prompt.trim()
    };

    if (input.instrumental !== undefined) payload.instrumental = input.instrumental;
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
    const { request_id } = await fal.queue.submit("fal-ai/ace-step/prompt-to-audio", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("ACE-Step Prompt-to-Audio queue submission failed:", error);
    throw new Error(`ACE-Step Prompt-to-Audio queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued ACE-Step Prompt-to-Audio request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkACEStepPromptToAudioStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/ace-step/prompt-to-audio", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("ACE-Step Prompt-to-Audio status check failed:", error);
    throw new Error(`ACE-Step Prompt-to-Audio status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed ACE-Step Prompt-to-Audio request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated audio result
 */
export async function getACEStepPromptToAudioResult(
  requestId: string
): Promise<ACEStepPromptToAudioOutput> {
  try {
    const result = await fal.queue.result("fal-ai/ace-step/prompt-to-audio", {
      requestId
    });

    return result.data as ACEStepPromptToAudioOutput;

  } catch (error) {
    console.error("ACE-Step Prompt-to-Audio result retrieval failed:", error);
    throw new Error(`ACE-Step Prompt-to-Audio result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create prompt-to-audio generation scenarios
 * 
 * @param type - Type of prompt-to-audio generation to create
 * @param customPrompt - Custom prompt (optional)
 * @param customSettings - Custom settings (optional)
 * @returns ACE-Step Prompt-to-Audio input configuration
 */
export function createPromptToAudioScenario(
  type: 'background_music' | 'workout_music' | 'ambient_music' | 'theme_music' | 'jingle_creation' | 'meditation_music' | 'game_music' | 'podcast_music' | 'social_media_music' | 'presentation_music' | 'custom',
  customPrompt?: string,
  customSettings?: Partial<ACEStepPromptToAudioInput>
): ACEStepPromptToAudioInput {
  const scenarioTemplates = {
    background_music: {
      prompt: "Upbeat instrumental background music with modern electronic elements, perfect for videos and content creation",
      instrumental: true,
      duration: 120
    },
    workout_music: {
      prompt: "High-energy electronic dance music with driving beats and motivational energy for intense workout sessions",
      instrumental: true,
      duration: 180
    },
    ambient_music: {
      prompt: "Peaceful ambient music with soft synthesizers and atmospheric textures for relaxation and focus",
      instrumental: true,
      duration: 300
    },
    theme_music: {
      prompt: "Epic orchestral theme music with strings, brass, and cinematic elements for dramatic presentations",
      instrumental: true,
      duration: 60
    },
    jingle_creation: {
      prompt: "Catchy commercial jingle with upbeat melody and memorable hook for advertising and branding",
      instrumental: false,
      duration: 30
    },
    meditation_music: {
      prompt: "Calming meditation music with gentle nature sounds, soft piano, and peaceful atmosphere for mindfulness",
      instrumental: true,
      duration: 600
    },
    game_music: {
      prompt: "Adventure game soundtrack with epic orchestral elements, mysterious atmosphere, and dynamic progression",
      instrumental: true,
      duration: 180
    },
    podcast_music: {
      prompt: "Professional podcast intro music with modern electronic elements and clean, engaging sound",
      instrumental: true,
      duration: 15
    },
    social_media_music: {
      prompt: "Trendy social media background music with modern hip-hop beats and catchy melody for short videos",
      instrumental: true,
      duration: 60
    },
    presentation_music: {
      prompt: "Professional presentation background music with subtle electronic elements and corporate-friendly sound",
      instrumental: true,
      duration: 90
    },
    custom: {
      prompt: customPrompt || "A beautiful musical composition with modern elements and engaging melody",
      instrumental: false,
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
 * Predefined prompt templates for different music styles
 */
export const PROMPT_TEMPLATES = {
  "lofi_hiphop": "A lofi hiphop track with chill vibes, soft beats, and atmospheric elements",
  "electronic_dance": "An energetic electronic dance track with synthesizers, driving beats, and uplifting melodies",
  "rock_alternative": "A powerful rock track with electric guitars, energetic drums, and strong vocals",
  "jazz_smooth": "A smooth jazz composition with piano, saxophone, and sophisticated harmonies",
  "classical_orchestral": "A majestic orchestral piece with strings, brass, and cinematic grandeur",
  "pop_modern": "A modern pop song with catchy melodies, contemporary production, and radio-friendly sound",
  "ambient_atmospheric": "An ambient soundscape with ethereal textures, soft synthesizers, and peaceful atmosphere",
  "trap_modern": "A modern trap beat with heavy bass, crisp hi-hats, and urban energy",
  "acoustic_folk": "An acoustic folk song with guitar, organic instruments, and storytelling elements",
  "experimental_avant": "An experimental musical piece with unique sounds, creative arrangements, and avant-garde elements"
} as const;

/**
 * Common music generation scenarios
 */
export const MUSIC_SCENARIOS = {
  "relaxation": "Calming and peaceful music for relaxation and stress relief",
  "energy": "High-energy music for motivation and physical activity",
  "focus": "Background music for concentration and productivity",
  "celebration": "Upbeat and joyful music for celebrations and happy moments",
  "romance": "Romantic and emotional music for intimate moments",
  "adventure": "Epic and adventurous music for exciting experiences",
  "mystery": "Mysterious and intriguing music for suspenseful moments",
  "nostalgia": "Nostalgic and sentimental music for reflective moments"
} as const;

/**
 * Example usage of the ACE-Step Prompt-to-Audio executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic prompt-to-audio generation
    const result1 = await executeACEStepPromptToAudio({
      prompt: "A lofi hiphop song with a chill vibe about a sunny day on the boardwalk.",
      instrumental: false,
      duration: 60
    });

    console.log("Generated audio URL:", result1.audio.url);

    // Example 2: Using helper function for background music
    const backgroundMusic = createPromptToAudioScenario('background_music');
    const result2 = await executeACEStepPromptToAudio(backgroundMusic);
    console.log("Background music:", result2.audio.url);

    // Example 3: Custom prompt-to-audio with specific settings
    const customMusic = createPromptToAudioScenario(
      'custom',
      "An epic orchestral piece with strings, brass, and cinematic elements for a dramatic movie scene",
      {
        instrumental: true,
        duration: 120,
        guidance_scale: 20,
        tag_guidance_scale: 7
      }
    );
    const result3 = await executeACEStepPromptToAudio(customMusic);
    console.log("Custom orchestral music:", result3.audio.url);

    // Example 4: Using predefined prompt templates
    const result4 = await executeACEStepPromptToAudio({
      prompt: PROMPT_TEMPLATES.lofi_hiphop,
      instrumental: true,
      duration: 90,
      seed: 12345
    });
    console.log("Lofi hiphop track:", result4.audio.url);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeACEStepPromptToAudioQueue({
      prompt: "A long ambient meditation track with nature sounds and peaceful atmosphere",
      instrumental: true,
      duration: 600,
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkACEStepPromptToAudioStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getACEStepPromptToAudioResult(request_id);
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
 * Utility function to validate prompt format
 * 
 * @param prompt - The prompt string to validate
 * @returns Validation result with suggestions
 */
export function validatePromptFormat(prompt: string): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedPrompt: string; 
} {
  const suggestions: string[] = [];
  
  // Clean and format prompt
  const formattedPrompt = prompt.trim();

  // Check for common issues
  if (prompt.length > 1000) {
    suggestions.push("Prompt is too long (max 1000 characters)");
  }

  if (prompt.length < 10) {
    suggestions.push("Prompt is too short, consider adding more descriptive details");
  }

  // Check for common prompt elements
  const hasGenre = /\b(lofi|hiphop|electronic|rock|jazz|classical|pop|ambient|trap|acoustic|experimental)\b/i.test(prompt);
  if (!hasGenre) {
    suggestions.push("Consider including a musical genre for better results");
  }

  const hasMood = /\b(chill|energetic|peaceful|dramatic|romantic|mysterious|upbeat|calm|epic|melancholic)\b/i.test(prompt);
  if (!hasMood) {
    suggestions.push("Consider including mood or atmosphere descriptors");
  }

  const hasInstruments = /\b(piano|guitar|synthesizer|drums|strings|brass|saxophone|violin|bass|vocals)\b/i.test(prompt);
  if (!hasInstruments) {
    suggestions.push("Consider mentioning specific instruments for better control");
  }

  const hasContext = /\b(for|about|with|perfect for|suitable for|ideal for)\b/i.test(prompt);
  if (!hasContext) {
    suggestions.push("Consider adding context or use case for better results");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedPrompt
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
 * Common prompt-to-audio scenarios
 */
export const PROMPT_TO_AUDIO_SCENARIOS = {
  "background_music": "Generate background music for videos and content",
  "workout_music": "Create high-energy music for exercise and fitness",
  "ambient_music": "Generate ambient and atmospheric music",
  "theme_music": "Create theme music for presentations and content",
  "jingle_creation": "Generate short jingles and musical hooks",
  "meditation_music": "Create calming music for meditation and relaxation",
  "game_music": "Generate music for games and interactive content",
  "podcast_music": "Create intro and background music for podcasts",
  "social_media_music": "Generate music for social media content",
  "presentation_music": "Create professional music for presentations"
} as const;

/**
 * Prompt enhancement suggestions
 */
export const PROMPT_ENHANCEMENTS = {
  "add_genre": "Include specific musical genres (e.g., 'lofi hiphop', 'electronic dance')",
  "add_mood": "Describe mood and atmosphere (e.g., 'chill vibe', 'energetic')",
  "add_instruments": "Mention specific instruments (e.g., 'piano', 'synthesizers')",
  "add_tempo": "Specify tempo and rhythm (e.g., 'upbeat', 'slow and peaceful')",
  "add_context": "Provide context or use case (e.g., 'for workout', 'for relaxation')",
  "add_style": "Describe musical style (e.g., 'ambient', 'commercial', 'experimental')"
} as const;

export default executeACEStepPromptToAudio;
