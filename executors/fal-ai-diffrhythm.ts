import { fal } from "@fal-ai/client";

export interface DiffRhythmInput {
  lyrics: string;
  reference_audio_url?: string;
  style_prompt?: string;
  music_duration?: "95s" | "285s";
  cfg_strength?: number;
  scheduler?: "euler" | "midpoint" | "rk4" | "implicit_adams";
  num_inference_steps?: number;
}

export interface DiffRhythmOutput {
  audio: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

export interface DiffRhythmOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI DiffRhythm Executor
 * 
 * DiffRhythm is a blazing fast model for transforming lyrics into full songs. 
 * It boasts the capability to generate full songs in less than 30 seconds. 
 * Advanced lyrics-to-music generation technology that creates complete songs 
 * from structured lyrics with timestamp markers, supporting various musical 
 * styles and reference audio.
 * 
 * @param input - The lyrics-to-music generation input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated audio result
 */
export async function executeDiffRhythm(
  input: DiffRhythmInput,
  options: DiffRhythmOptions = {}
): Promise<DiffRhythmOutput> {
  try {
    // Validate required inputs
    if (!input.lyrics || input.lyrics.trim().length === 0) {
      throw new Error("Lyrics are required");
    }

    // Validate lyrics length
    if (input.lyrics.length > 10000) {
      throw new Error("Lyrics must be 10000 characters or less");
    }

    if (input.lyrics.length < 1) {
      throw new Error("Lyrics must be at least 1 character");
    }

    // Validate lyrics structure
    if (!input.lyrics.includes('[') || !input.lyrics.includes(']')) {
      throw new Error("Lyrics must include timestamp markers in format [MM:SS.SS]");
    }

    // Validate reference audio URL if provided
    if (input.reference_audio_url) {
      try {
        new URL(input.reference_audio_url);
        if (!input.reference_audio_url.startsWith('http')) {
          throw new Error("Reference audio URL must be a valid HTTP/HTTPS URL");
        }
      } catch {
        throw new Error("Invalid reference audio URL format");
      }
    }

    // Validate CFG strength if provided
    if (input.cfg_strength !== undefined) {
      if (input.cfg_strength < 1 || input.cfg_strength > 20) {
        throw new Error("CFG strength must be between 1 and 20");
      }
    }

    // Validate inference steps if provided
    if (input.num_inference_steps !== undefined) {
      if (input.num_inference_steps < 1 || input.num_inference_steps > 100) {
        throw new Error("Number of inference steps must be between 1 and 100");
      }
    }

    // Prepare the request payload
    const payload: any = {
      lyrics: input.lyrics.trim()
    };

    // Add optional parameters if provided
    if (input.reference_audio_url) {
      payload.reference_audio_url = input.reference_audio_url;
    }

    if (input.style_prompt) {
      payload.style_prompt = input.style_prompt;
    }

    if (input.music_duration) {
      payload.music_duration = input.music_duration;
    }

    if (input.cfg_strength !== undefined) {
      payload.cfg_strength = input.cfg_strength;
    }

    if (input.scheduler) {
      payload.scheduler = input.scheduler;
    }

    if (input.num_inference_steps !== undefined) {
      payload.num_inference_steps = input.num_inference_steps;
    }

    // Execute the model
    const result = await fal.subscribe("fal-ai/diffrhythm", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as DiffRhythmOutput;

  } catch (error) {
    console.error("Fal AI DiffRhythm execution failed:", error);
    throw new Error(`Fal AI DiffRhythm generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Fal AI DiffRhythm with queue management for batch processing
 * 
 * @param input - The lyrics-to-music generation input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeDiffRhythmQueue(
  input: DiffRhythmInput,
  options: DiffRhythmOptions = {}
): Promise<{ request_id: string }> {
  try {
    // Validate input (same validation as above)
    if (!input.lyrics || input.lyrics.trim().length === 0) {
      throw new Error("Lyrics are required");
    }

    if (input.lyrics.length > 10000) {
      throw new Error("Lyrics must be 10000 characters or less");
    }

    if (!input.lyrics.includes('[') || !input.lyrics.includes(']')) {
      throw new Error("Lyrics must include timestamp markers in format [MM:SS.SS]");
    }

    if (input.reference_audio_url) {
      try {
        new URL(input.reference_audio_url);
        if (!input.reference_audio_url.startsWith('http')) {
          throw new Error("Reference audio URL must be a valid HTTP/HTTPS URL");
        }
      } catch {
        throw new Error("Invalid reference audio URL format");
      }
    }

    if (input.cfg_strength !== undefined && (input.cfg_strength < 1 || input.cfg_strength > 20)) {
      throw new Error("CFG strength must be between 1 and 20");
    }

    if (input.num_inference_steps !== undefined && (input.num_inference_steps < 1 || input.num_inference_steps > 100)) {
      throw new Error("Number of inference steps must be between 1 and 100");
    }

    // Prepare the request payload
    const payload: any = {
      lyrics: input.lyrics.trim()
    };

    // Add optional parameters if provided
    if (input.reference_audio_url) {
      payload.reference_audio_url = input.reference_audio_url;
    }

    if (input.style_prompt) {
      payload.style_prompt = input.style_prompt;
    }

    if (input.music_duration) {
      payload.music_duration = input.music_duration;
    }

    if (input.cfg_strength !== undefined) {
      payload.cfg_strength = input.cfg_strength;
    }

    if (input.scheduler) {
      payload.scheduler = input.scheduler;
    }

    if (input.num_inference_steps !== undefined) {
      payload.num_inference_steps = input.num_inference_steps;
    }

    // Submit to queue
    const { request_id } = await fal.queue.submit("fal-ai/diffrhythm", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("Fal AI DiffRhythm queue submission failed:", error);
    throw new Error(`Fal AI DiffRhythm queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued Fal AI DiffRhythm request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkDiffRhythmStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/diffrhythm", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("Fal AI DiffRhythm status check failed:", error);
    throw new Error(`Fal AI DiffRhythm status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed Fal AI DiffRhythm request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated audio result
 */
export async function getDiffRhythmResult(
  requestId: string
): Promise<DiffRhythmOutput> {
  try {
    const result = await fal.queue.result("fal-ai/diffrhythm", {
      requestId
    });

    return result.data as DiffRhythmOutput;

  } catch (error) {
    console.error("Fal AI DiffRhythm result retrieval failed:", error);
    throw new Error(`Fal AI DiffRhythm result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create lyrics-to-music generation scenarios
 * 
 * @param type - Type of music generation scenario to create
 * @param customLyrics - Custom lyrics (optional)
 * @param customOptions - Custom options (optional)
 * @returns DiffRhythm input configuration
 */
export function createLyricsToMusicScenario(
  type: 'pop' | 'rock' | 'jazz' | 'classical' | 'electronic' | 'hip_hop' | 'country' | 'blues' | 'folk' | 'reggae' | 'custom',
  customLyrics?: string,
  customOptions?: Partial<DiffRhythmInput>
): DiffRhythmInput {
  const scenarioTemplates = {
    pop: {
      lyrics: customLyrics || "[00:10.00]Catchy pop melody starts here\n[00:13.20]With bright synthesizers and upbeat drums\n[00:16.85]Chorus comes in with energy\n[00:20.40]Building to the main hook of the song",
      style_prompt: "upbeat pop",
      music_duration: "95s" as const,
      cfg_strength: 4,
      scheduler: "euler" as const,
      num_inference_steps: 32
    },
    rock: {
      lyrics: customLyrics || "[00:10.00]Powerful rock anthem begins\n[00:13.20]With electric guitars and driving drums\n[00:16.85]Building to an epic chorus\n[00:20.40]Full of energy and passion",
      style_prompt: "rock anthem",
      music_duration: "95s" as const,
      cfg_strength: 6,
      scheduler: "midpoint" as const,
      num_inference_steps: 40
    },
    jazz: {
      lyrics: customLyrics || "[00:10.00]Smooth jazz melody flows\n[00:13.20]With saxophone and walking bass\n[00:16.85]Sophisticated harmonies\n[00:20.40]Creating a cool atmosphere",
      style_prompt: "smooth jazz",
      music_duration: "95s" as const,
      cfg_strength: 5,
      scheduler: "euler" as const,
      num_inference_steps: 35
    },
    classical: {
      lyrics: customLyrics || "[00:10.00]Elegant classical piece begins\n[00:13.20]With string orchestra and piano\n[00:16.85]Building to a dramatic crescendo\n[00:20.40]Full of emotion and beauty",
      style_prompt: "classical orchestral",
      music_duration: "95s" as const,
      cfg_strength: 7,
      scheduler: "rk4" as const,
      num_inference_steps: 50
    },
    electronic: {
      lyrics: customLyrics || "[00:10.00]Electronic beats start pulsing\n[00:13.20]With synthesizers and digital sounds\n[00:16.85]Building to an energetic drop\n[00:20.40]Full of electronic energy",
      style_prompt: "electronic dance",
      music_duration: "95s" as const,
      cfg_strength: 4,
      scheduler: "euler" as const,
      num_inference_steps: 30
    },
    hip_hop: {
      lyrics: customLyrics || "[00:10.00]Hip-hop beat starts strong\n[00:13.20]With 808s and crisp hi-hats\n[00:16.85]Building to a catchy hook\n[00:20.40]Full of urban energy",
      style_prompt: "hip-hop trap",
      music_duration: "95s" as const,
      cfg_strength: 5,
      scheduler: "euler" as const,
      num_inference_steps: 35
    },
    country: {
      lyrics: customLyrics || "[00:10.00]Country melody begins\n[00:13.20]With acoustic guitar and fiddle\n[00:16.85]Building to a heartfelt chorus\n[00:20.40]Full of country soul",
      style_prompt: "country folk",
      music_duration: "95s" as const,
      cfg_strength: 4,
      scheduler: "euler" as const,
      num_inference_steps: 32
    },
    blues: {
      lyrics: customLyrics || "[00:10.00]Bluesy melody starts\n[00:13.20]With electric guitar and harmonica\n[00:16.85]Building to a soulful chorus\n[00:20.40]Full of blues emotion",
      style_prompt: "blues rock",
      music_duration: "95s" as const,
      cfg_strength: 5,
      scheduler: "euler" as const,
      num_inference_steps: 35
    },
    folk: {
      lyrics: customLyrics || "[00:10.00]Folk melody begins\n[00:13.20]With acoustic guitar and harmonica\n[00:16.85]Building to a warm chorus\n[00:20.40]Full of folk charm",
      style_prompt: "acoustic folk",
      music_duration: "95s" as const,
      cfg_strength: 4,
      scheduler: "euler" as const,
      num_inference_steps: 32
    },
    reggae: {
      lyrics: customLyrics || "[00:10.00]Reggae beat starts\n[00:13.20]With off-beat guitar and steady bass\n[00:16.85]Building to a laid-back chorus\n[00:20.40]Full of reggae vibes",
      style_prompt: "reggae ska",
      music_duration: "95s" as const,
      cfg_strength: 4,
      scheduler: "euler" as const,
      num_inference_steps: 32
    },
    custom: {
      lyrics: customLyrics || "[00:10.00]Custom lyrics start here\n[00:13.20]With your own creative content\n[00:16.85]Building to your unique chorus\n[00:20.40]Full of your personal style",
      style_prompt: "custom style",
      music_duration: "95s" as const,
      cfg_strength: 4,
      scheduler: "euler" as const,
      num_inference_steps: 32
    }
  };

  const template = scenarioTemplates[type];
  
  // Merge with custom options if provided
  return {
    ...template,
    ...customOptions
  };
}

/**
 * Predefined lyrics templates for different genres
 */
export const LYRICS_TEMPLATES = {
  "pop": [
    "[00:10.00]Catchy pop melody starts here\n[00:13.20]With bright synthesizers and upbeat drums\n[00:16.85]Chorus comes in with energy\n[00:20.40]Building to the main hook of the song",
    "[00:10.00]Pop song begins with energy\n[00:13.20]Catchy hook and memorable melody\n[00:16.85]Building to an infectious chorus\n[00:20.40]Full of pop appeal and charm"
  ],
  "rock": [
    "[00:10.00]Powerful rock anthem begins\n[00:13.20]With electric guitars and driving drums\n[00:16.85]Building to an epic chorus\n[00:20.40]Full of energy and passion",
    "[00:10.00]Rock song starts with power\n[00:13.20]Heavy guitars and strong vocals\n[00:16.85]Building to a massive chorus\n[00:20.40]Full of rock energy and attitude"
  ],
  "jazz": [
    "[00:10.00]Smooth jazz melody flows\n[00:13.20]With saxophone and walking bass\n[00:16.85]Sophisticated harmonies\n[00:20.40]Creating a cool atmosphere",
    "[00:10.00]Jazz piece begins smoothly\n[00:13.20]With sophisticated instrumentation\n[00:16.85]Building to a cool crescendo\n[00:20.40]Full of jazz sophistication"
  ],
  "classical": [
    "[00:10.00]Elegant classical piece begins\n[00:13.20]With string orchestra and piano\n[00:16.85]Building to a dramatic crescendo\n[00:20.40]Full of emotion and beauty",
    "[00:10.00]Classical composition starts\n[00:13.20]With orchestral instruments and piano\n[00:16.85]Building to an emotional climax\n[00:20.40]Full of classical grandeur"
  ],
  "electronic": [
    "[00:10.00]Electronic beats start pulsing\n[00:13.20]With synthesizers and digital sounds\n[00:16.85]Building to an energetic drop\n[00:20.40]Full of electronic energy",
    "[00:10.00]EDM track begins with energy\n[00:13.20]With driving bass and crisp hi-hats\n[00:16.85]Building to an explosive drop\n[00:20.40]Full of electronic power"
  ],
  "hip_hop": [
    "[00:10.00]Hip-hop beat starts strong\n[00:13.20]With 808s and crisp hi-hats\n[00:16.85]Building to a catchy hook\n[00:20.40]Full of urban energy",
    "[00:10.00]Rap song begins with attitude\n[00:13.20]With trap beats and strong vocals\n[00:16.85]Building to an infectious hook\n[00:20.40]Full of hip-hop swagger"
  ],
  "country": [
    "[00:10.00]Country melody begins\n[00:13.20]With acoustic guitar and fiddle\n[00:16.85]Building to a heartfelt chorus\n[00:20.40]Full of country soul",
    "[00:10.00]Country song starts with heart\n[00:13.20]With steel guitar and warm vocals\n[00:16.85]Building to a touching chorus\n[00:20.40]Full of country emotion"
  ],
  "blues": [
    "[00:10.00]Bluesy melody starts\n[00:13.20]With electric guitar and harmonica\n[00:16.85]Building to a soulful chorus\n[00:20.40]Full of blues emotion",
    "[00:10.00]Blues song begins with soul\n[00:13.20]With slide guitar and raw vocals\n[00:16.85]Building to a heartfelt chorus\n[00:20.40]Full of blues feeling"
  ],
  "folk": [
    "[00:10.00]Folk melody begins\n[00:13.20]With acoustic guitar and harmonica\n[00:16.85]Building to a warm chorus\n[00:20.40]Full of folk charm",
    "[00:10.00]Folk song starts with warmth\n[00:13.20]With banjo and gentle vocals\n[00:16.85]Building to a cozy chorus\n[00:20.40]Full of folk comfort"
  ],
  "reggae": [
    "[00:10.00]Reggae beat starts\n[00:13.20]With off-beat guitar and steady bass\n[00:16.85]Building to a laid-back chorus\n[00:20.40]Full of reggae vibes",
    "[00:10.00]Reggae song begins relaxed\n[00:13.20]With skanking guitar and smooth vocals\n[00:16.85]Building to a chill chorus\n[00:20.40]Full of reggae cool"
  ]
} as const;

/**
 * Example usage of the Fal AI DiffRhythm executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic lyrics-to-music generation
    const result1 = await executeDiffRhythm({
      lyrics: "[00:10.00]Moonlight spills through broken blinds\n[00:13.20]Your shadow dances on the dashboard shrine\n[00:16.85]Neon ghosts in gasoline rain\n[00:20.40]I hear your laughter down the midnight train",
      reference_audio_url: "https://storage.googleapis.com/falserverless/model_tests/diffrythm/rock_en.wav",
      style_prompt: "pop",
      music_duration: "95s",
      cfg_strength: 4,
      scheduler: "euler",
      num_inference_steps: 32
    });

    console.log("Generated music URL:", result1.audio.url);

    // Example 2: Using helper function for rock
    const rockTrack = createLyricsToMusicScenario('rock');
    const result2 = await executeDiffRhythm(rockTrack);
    console.log("Rock track:", result2.audio.url);

    // Example 3: Custom lyrics with specific settings
    const customTrack = createLyricsToMusicScenario(
      'custom',
      "[00:10.00]Custom lyrics start here\n[00:13.20]With your own creative content\n[00:16.85]Building to your unique chorus\n[00:20.40]Full of your personal style",
      {
        style_prompt: "electronic dance",
        music_duration: "285s",
        cfg_strength: 6,
        scheduler: "midpoint",
        num_inference_steps: 50
      }
    );
    const result3 = await executeDiffRhythm(customTrack);
    console.log("Custom EDM track:", result3.audio.url);

    // Example 4: Using predefined lyrics templates
    const result4 = await executeDiffRhythm({
      lyrics: LYRICS_TEMPLATES.jazz[0],
      style_prompt: "smooth jazz",
      music_duration: "95s",
      cfg_strength: 5,
      scheduler: "euler",
      num_inference_steps: 35
    });
    console.log("Jazz track:", result4.audio.url);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeDiffRhythmQueue({
      lyrics: "[00:10.00]Epic theme music begins\n[00:13.20]With orchestral instruments and powerful brass\n[00:16.85]Building to a dramatic crescendo\n[00:20.40]Full of cinematic grandeur",
      style_prompt: "cinematic orchestral",
      music_duration: "285s",
      cfg_strength: 8,
      scheduler: "rk4",
      num_inference_steps: 60,
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkDiffRhythmStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getDiffRhythmResult(request_id);
      console.log("Queue result:", result);
    }

  } catch (error) {
    console.error("Example execution failed:", error);
  }
}

/**
 * Utility function to estimate processing cost
 * 
 * @param durationSeconds - Duration of the music in seconds
 * @returns Estimated cost in USD
 */
export function estimateProcessingCost(durationSeconds: number): number {
  const costPer10Seconds = 0.01;
  return (durationSeconds / 10) * costPer10Seconds;
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
  if (lyrics.length > 10000) {
    suggestions.push("Lyrics are too long (max 10000 characters)");
  }

  if (lyrics.length < 10) {
    suggestions.push("Lyrics are too short, consider adding more content");
  }

  // Check for timestamp markers
  const hasTimestamps = /\[\d{2}:\d{2}\.\d{2}\]/.test(lyrics);
  if (!hasTimestamps) {
    suggestions.push("Lyrics should include timestamp markers in format [MM:SS.SS]");
  }

  // Check for section markers
  const hasSectionMarkers = /\[(chorus|verse)\]/i.test(lyrics);
  if (!hasSectionMarkers) {
    suggestions.push("Consider adding section markers like [chorus] and [verse] for better structure");
  }

  // Check for proper timestamp format
  const timestampRegex = /\[\d{2}:\d{2}\.\d{2}\]/g;
  const timestamps = lyrics.match(timestampRegex);
  if (timestamps) {
    const invalidTimestamps = timestamps.filter(timestamp => {
      const timeStr = timestamp.slice(1, -1); // Remove brackets
      const [minutes, seconds] = timeStr.split(':');
      const min = parseInt(minutes);
      const sec = parseFloat(seconds);
      return min < 0 || min > 59 || sec < 0 || sec >= 60;
    });
    
    if (invalidTimestamps.length > 0) {
      suggestions.push(`Invalid timestamp format found: ${invalidTimestamps.join(', ')}`);
    }
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedLyrics
  };
}

/**
 * Utility function to validate reference audio URL
 * 
 * @param url - The reference audio URL to validate
 * @returns Validation result with suggestions
 */
export function validateReferenceAudioURL(url: string): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedURL: string; 
} {
  const suggestions: string[] = [];
  
  // Clean and format URL
  const formattedURL = url.trim();

  try {
    new URL(formattedURL);
    
    if (!formattedURL.startsWith('http')) {
      suggestions.push("Reference audio URL must be a valid HTTP/HTTPS URL");
    }

    // Check for supported audio formats
    const supportedFormats = ['.mp3', '.ogg', '.wav', '.m4a', '.aac'];
    const hasSupportedFormat = supportedFormats.some(format => 
      formattedURL.toLowerCase().includes(format)
    );
    
    if (!hasSupportedFormat) {
      suggestions.push("Reference audio URL should point to a supported audio format (mp3, ogg, wav, m4a, aac)");
    }

  } catch {
    suggestions.push("Invalid reference audio URL format");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedURL
  };
}

/**
 * Utility function to validate CFG strength
 * 
 * @param cfgStrength - The CFG strength value to validate
 * @returns Validation result with suggestions
 */
export function validateCFGStrength(cfgStrength: number): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedCFG: number; 
} {
  const suggestions: string[] = [];
  
  // Clean and format CFG strength
  const formattedCFG = Math.round(cfgStrength * 100) / 100; // Round to 2 decimal places

  // Check for common issues
  if (cfgStrength < 1) {
    suggestions.push("CFG strength must be at least 1");
  }

  if (cfgStrength > 20) {
    suggestions.push("CFG strength must be 20 or less");
  }

  // Check for optimal ranges
  if (cfgStrength < 3) {
    suggestions.push("Very low CFG strength (1-3) may result in more creative but less prompt-adherent results");
  }

  if (cfgStrength > 10) {
    suggestions.push("Very high CFG strength (11-20) may result in very prompt-adherent but less creative results");
  }

  // Check for recommended ranges
  if (cfgStrength >= 4 && cfgStrength <= 8) {
    // This is the recommended range, no suggestions needed
  } else if (cfgStrength < 4) {
    suggestions.push("Consider using CFG strength 4-8 for balanced results");
  } else if (cfgStrength > 8) {
    suggestions.push("Consider using CFG strength 4-8 for balanced results");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedCFG
  };
}

/**
 * Utility function to validate inference steps
 * 
 * @param steps - The number of inference steps to validate
 * @returns Validation result with suggestions
 */
export function validateInferenceSteps(steps: number): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedSteps: number; 
} {
  const suggestions: string[] = [];
  
  // Clean and format inference steps
  const formattedSteps = Math.round(steps);

  // Check for common issues
  if (steps < 1) {
    suggestions.push("Number of inference steps must be at least 1");
  }

  if (steps > 100) {
    suggestions.push("Number of inference steps must be 100 or less");
  }

  if (!Number.isInteger(steps)) {
    suggestions.push("Number of inference steps should be a whole number");
  }

  // Check for optimal ranges
  if (steps < 20) {
    suggestions.push("Very few inference steps (1-20) may result in faster generation but lower quality");
  }

  if (steps > 60) {
    suggestions.push("Many inference steps (61-100) may result in higher quality but slower generation");
  }

  // Check for recommended ranges
  if (steps >= 30 && steps <= 50) {
    // This is the recommended range, no suggestions needed
  } else if (steps < 30) {
    suggestions.push("Consider using 30-50 inference steps for balanced quality and speed");
  } else if (steps > 50) {
    suggestions.push("Consider using 30-50 inference steps for balanced quality and speed");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedSteps
  };
}

/**
 * Utility function to get optimal settings for music type
 * 
 * @param musicType - Type of music
 * @returns Recommended settings
 */
export function getOptimalSettings(musicType: 'fast' | 'balanced' | 'high_quality' | 'maximum_quality'): {
  cfg_strength: number;
  scheduler: "euler" | "midpoint" | "rk4" | "implicit_adams";
  num_inference_steps: number;
} {
  const settingsMap = {
    fast: {
      cfg_strength: 4,
      scheduler: "euler" as const,
      num_inference_steps: 20
    },
    balanced: {
      cfg_strength: 5,
      scheduler: "euler" as const,
      num_inference_steps: 32
    },
    high_quality: {
      cfg_strength: 6,
      scheduler: "midpoint" as const,
      num_inference_steps: 50
    },
    maximum_quality: {
      cfg_strength: 8,
      scheduler: "rk4" as const,
      num_inference_steps: 80
    }
  };

  return settingsMap[musicType];
}

/**
 * Utility function to enhance lyrics with timestamps
 * 
 * @param lyrics - Base lyrics to enhance
 * @param startTime - Start time in seconds
 * @param interval - Time interval between lines in seconds
 * @returns Enhanced lyrics with timestamps
 */
export function enhanceLyricsWithTimestamps(
  lyrics: string, 
  startTime: number = 10, 
  interval: number = 3.2
): string {
  const lines = lyrics.split('\n').filter(line => line.trim().length > 0);
  const enhancedLines: string[] = [];

  lines.forEach((line, index) => {
    const timestamp = startTime + (index * interval);
    const minutes = Math.floor(timestamp / 60);
    const seconds = (timestamp % 60).toFixed(2);
    const timestampStr = `[${minutes.toString().padStart(2, '0')}:${seconds.padStart(5, '0')}]`;
    enhancedLines.push(`${timestampStr}${line.trim()}`);
  });

  return enhancedLines.join('\n');
}

/**
 * Utility function to generate random lyrics template
 * 
 * @param genre - Music genre
 * @returns Random lyrics template from the genre
 */
export function generateRandomLyricsTemplate(genre: keyof typeof LYRICS_TEMPLATES): string {
  const templates = LYRICS_TEMPLATES[genre];
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
}

/**
 * Utility function to create batch lyrics-to-music generation
 * 
 * @param lyricsArray - Array of lyrics
 * @param options - Common options for all generations
 * @returns Array of DiffRhythm inputs
 */
export function createBatchLyricsToMusicGeneration(
  lyricsArray: string[], 
  options: Partial<DiffRhythmInput> = {}
): DiffRhythmInput[] {
  return lyricsArray.map(lyrics => ({
    lyrics,
    ...options
  }));
}

/**
 * Supported audio formats
 */
export const SUPPORTED_AUDIO_FORMATS = [
  "mp3", "ogg", "wav", "m4a", "aac"
] as const;

/**
 * Common lyrics-to-music generation scenarios
 */
export const LYRICS_TO_MUSIC_SCENARIOS = {
  "pop": "Generate pop music from lyrics",
  "rock": "Create rock music from lyrics",
  "jazz": "Generate jazz music from lyrics",
  "classical": "Create classical music from lyrics",
  "electronic": "Generate electronic music from lyrics",
  "hip_hop": "Create hip-hop music from lyrics",
  "country": "Generate country music from lyrics",
  "blues": "Create blues music from lyrics",
  "folk": "Generate folk music from lyrics",
  "reggae": "Create reggae music from lyrics"
} as const;

/**
 * Scheduler options and their characteristics
 */
export const SCHEDULER_OPTIONS = {
  "euler": "Fast generation with good quality",
  "midpoint": "Balanced quality and speed",
  "rk4": "Higher quality with longer processing time",
  "implicit_adams": "Highest quality with longest processing time"
} as const;

/**
 * CFG strength guidelines
 */
export const CFG_STRENGTH_GUIDELINES = {
  "low_creativity": "1-3: More creative, less prompt adherence",
  "balanced": "4-6: Balanced creativity and prompt adherence",
  "high_adherence": "7-10: High prompt adherence, less creativity",
  "very_high_adherence": "11-20: Very high prompt adherence, minimal creativity"
} as const;

/**
 * Style prompts and their characteristics
 */
export const STYLE_PROMPTS = {
  "genres": ["pop", "rock", "jazz", "classical", "electronic", "hip-hop", "country", "blues", "folk", "reggae"],
  "moods": ["upbeat", "melancholic", "energetic", "peaceful", "dramatic", "romantic", "mysterious", "nostalgic"],
  "instruments": ["piano", "guitar", "bass", "drums", "synthesizer", "violin", "saxophone", "trumpet", "orchestra"],
  "tempos": ["slow", "moderate", "fast", "very fast"],
  "atmospheres": ["atmospheric", "cinematic", "intimate", "epic", "dreamy", "aggressive", "smooth", "raw"]
} as const;

export default executeDiffRhythm;
