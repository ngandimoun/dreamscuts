import { fal } from "@fal-ai/client";

export interface CassetteAIMusicGeneratorInput {
  prompt: string;
  duration: number;
}

export interface CassetteAIMusicGeneratorOutput {
  audio_file: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

export interface CassetteAIMusicGeneratorOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * CassetteAI Music Generator Executor
 * 
 * CassetteAI's model generates a 30-second sample in under 2 seconds and a full 
 * 3-minute track in under 10 seconds. At 44.1 kHz stereo audio, expect a level 
 * of professional consistency with no breaks, no squeaks, and no random artifacts. 
 * Advanced music generation technology that creates professional-quality music 
 * tracks from text descriptions with ultra-fast processing and high-quality audio output.
 * 
 * @param input - The music generation input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated audio result
 */
export async function executeCassetteAIMusicGenerator(
  input: CassetteAIMusicGeneratorInput,
  options: CassetteAIMusicGeneratorOptions = {}
): Promise<CassetteAIMusicGeneratorOutput> {
  try {
    // Validate required inputs
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (input.duration === undefined || input.duration === null) {
      throw new Error("Duration is required");
    }

    // Validate prompt length
    if (input.prompt.length > 1000) {
      throw new Error("Prompt must be 1000 characters or less");
    }

    if (input.prompt.length < 1) {
      throw new Error("Prompt must be at least 1 character");
    }

    // Validate duration
    if (input.duration < 1 || input.duration > 180) {
      throw new Error("Duration must be between 1 and 180 seconds");
    }

    if (!Number.isInteger(input.duration)) {
      throw new Error("Duration must be an integer");
    }

    // Prepare the request payload
    const payload = {
      prompt: input.prompt.trim(),
      duration: input.duration
    };

    // Execute the model
    const result = await fal.subscribe("cassetteai/music-generator", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as CassetteAIMusicGeneratorOutput;

  } catch (error) {
    console.error("CassetteAI Music Generator execution failed:", error);
    throw new Error(`CassetteAI Music Generator generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute CassetteAI Music Generator with queue management for batch processing
 * 
 * @param input - The music generation input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeCassetteAIMusicGeneratorQueue(
  input: CassetteAIMusicGeneratorInput,
  options: CassetteAIMusicGeneratorOptions = {}
): Promise<{ request_id: string }> {
  try {
    // Validate input (same validation as above)
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (input.duration === undefined || input.duration === null) {
      throw new Error("Duration is required");
    }

    if (input.prompt.length > 1000) {
      throw new Error("Prompt must be 1000 characters or less");
    }

    if (input.duration < 1 || input.duration > 180) {
      throw new Error("Duration must be between 1 and 180 seconds");
    }

    if (!Number.isInteger(input.duration)) {
      throw new Error("Duration must be an integer");
    }

    // Prepare the request payload
    const payload = {
      prompt: input.prompt.trim(),
      duration: input.duration
    };

    // Submit to queue
    const { request_id } = await fal.queue.submit("cassetteai/music-generator", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("CassetteAI Music Generator queue submission failed:", error);
    throw new Error(`CassetteAI Music Generator queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued CassetteAI Music Generator request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkCassetteAIMusicGeneratorStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("cassetteai/music-generator", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("CassetteAI Music Generator status check failed:", error);
    throw new Error(`CassetteAI Music Generator status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed CassetteAI Music Generator request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated audio result
 */
export async function getCassetteAIMusicGeneratorResult(
  requestId: string
): Promise<CassetteAIMusicGeneratorOutput> {
  try {
    const result = await fal.queue.result("cassetteai/music-generator", {
      requestId
    });

    return result.data as CassetteAIMusicGeneratorOutput;

  } catch (error) {
    console.error("CassetteAI Music Generator result retrieval failed:", error);
    throw new Error(`CassetteAI Music Generator result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create music generation scenarios
 * 
 * @param type - Type of music generation scenario to create
 * @param customPrompt - Custom prompt (optional)
 * @param customDuration - Custom duration (optional)
 * @returns CassetteAI Music Generator input configuration
 */
export function createMusicGenerationScenario(
  type: 'hip_hop' | 'electronic' | 'ambient' | 'jazz' | 'classical' | 'rock' | 'pop' | 'folk' | 'blues' | 'reggae' | 'background_music' | 'theme_music' | 'workout_music' | 'meditation_music' | 'custom',
  customPrompt?: string,
  customDuration?: number
): CassetteAIMusicGeneratorInput {
  const scenarioTemplates = {
    hip_hop: {
      prompt: customPrompt || "Smooth chill hip-hop beat with mellow piano melodies, deep bass, and soft drums. Key: D Minor, Tempo: 90 BPM.",
      duration: customDuration || 60
    },
    electronic: {
      prompt: customPrompt || "Energetic electronic dance music with driving bass, crisp hi-hats, and uplifting melodies. Key: A Minor, Tempo: 128 BPM.",
      duration: customDuration || 90
    },
    ambient: {
      prompt: customPrompt || "Peaceful ambient music with soft synthesizers, gentle pads, and ethereal textures. Key: C Major, Tempo: 60 BPM.",
      duration: customDuration || 120
    },
    jazz: {
      prompt: customPrompt || "Smooth jazz with saxophone solos, walking bass, and brushed drums. Key: F Major, Tempo: 100 BPM.",
      duration: customDuration || 90
    },
    classical: {
      prompt: customPrompt || "Elegant classical piece with string orchestra, piano, and woodwinds. Key: G Major, Tempo: 80 BPM.",
      duration: customDuration || 120
    },
    rock: {
      prompt: customPrompt || "Powerful rock anthem with electric guitars, driving drums, and strong bass. Key: E Minor, Tempo: 120 BPM.",
      duration: customDuration || 90
    },
    pop: {
      prompt: customPrompt || "Catchy pop song with bright synthesizers, upbeat drums, and melodic vocals. Key: C Major, Tempo: 110 BPM.",
      duration: customDuration || 60
    },
    folk: {
      prompt: customPrompt || "Acoustic folk song with guitar, harmonica, and warm vocals. Key: G Major, Tempo: 85 BPM.",
      duration: customDuration || 90
    },
    blues: {
      prompt: customPrompt || "Bluesy track with electric guitar, harmonica, and soulful vocals. Key: A Minor, Tempo: 95 BPM.",
      duration: customDuration || 90
    },
    reggae: {
      prompt: customPrompt || "Relaxed reggae beat with off-beat guitar, steady bass, and laid-back drums. Key: D Major, Tempo: 80 BPM.",
      duration: customDuration || 90
    },
    background_music: {
      prompt: customPrompt || "Subtle background music with soft instruments and gentle melodies. Key: C Major, Tempo: 70 BPM.",
      duration: customDuration || 120
    },
    theme_music: {
      prompt: customPrompt || "Epic theme music with orchestral instruments, powerful brass, and dramatic strings. Key: D Major, Tempo: 100 BPM.",
      duration: customDuration || 90
    },
    workout_music: {
      prompt: customPrompt || "High-energy workout music with driving beats, powerful bass, and motivational energy. Key: A Minor, Tempo: 140 BPM.",
      duration: customDuration || 120
    },
    meditation_music: {
      prompt: customPrompt || "Calming meditation music with soft bells, gentle strings, and peaceful atmosphere. Key: C Major, Tempo: 50 BPM.",
      duration: customDuration || 180
    },
    custom: {
      prompt: customPrompt || "Custom music generation",
      duration: customDuration || 60
    }
  };

  return scenarioTemplates[type];
}

/**
 * Predefined music prompts for different genres
 */
export const MUSIC_PROMPTS = {
  "hip_hop": [
    "Smooth chill hip-hop beat with mellow piano melodies, deep bass, and soft drums. Key: D Minor, Tempo: 90 BPM.",
    "Old school hip-hop with boom-bap drums, funky bass, and vinyl crackle. Key: F Minor, Tempo: 85 BPM.",
    "Modern trap beat with 808s, hi-hats, and dark melodies. Key: A Minor, Tempo: 140 BPM.",
    "Jazz-influenced hip-hop with saxophone samples and smooth drums. Key: C Major, Tempo: 95 BPM."
  ],
  "electronic": [
    "Energetic electronic dance music with driving bass, crisp hi-hats, and uplifting melodies. Key: A Minor, Tempo: 128 BPM.",
    "Ambient electronic with atmospheric pads, soft arpeggios, and ethereal textures. Key: C Major, Tempo: 70 BPM.",
    "Techno track with industrial beats, dark bass, and mechanical sounds. Key: E Minor, Tempo: 130 BPM.",
    "Synthwave with retro synthesizers, driving bass, and nostalgic melodies. Key: D Major, Tempo: 120 BPM."
  ],
  "ambient": [
    "Peaceful ambient music with soft synthesizers, gentle pads, and ethereal textures. Key: C Major, Tempo: 60 BPM.",
    "Dark ambient with deep drones, atmospheric sounds, and mysterious textures. Key: D Minor, Tempo: 50 BPM.",
    "Nature ambient with bird sounds, flowing water, and gentle instruments. Key: G Major, Tempo: 55 BPM.",
    "Space ambient with cosmic sounds, floating pads, and otherworldly textures. Key: F Major, Tempo: 65 BPM."
  ],
  "jazz": [
    "Smooth jazz with saxophone solos, walking bass, and brushed drums. Key: F Major, Tempo: 100 BPM.",
    "Bebop jazz with fast piano runs, complex harmonies, and energetic drums. Key: Bb Major, Tempo: 180 BPM.",
    "Fusion jazz with electric instruments, funky rhythms, and modern sounds. Key: C Minor, Tempo: 110 BPM.",
    "Cool jazz with relaxed tempo, soft instruments, and sophisticated harmonies. Key: G Major, Tempo: 80 BPM."
  ],
  "classical": [
    "Elegant classical piece with string orchestra, piano, and woodwinds. Key: G Major, Tempo: 80 BPM.",
    "Dramatic classical with full orchestra, powerful brass, and emotional strings. Key: D Minor, Tempo: 100 BPM.",
    "Baroque classical with harpsichord, strings, and ornate melodies. Key: C Major, Tempo: 90 BPM.",
    "Romantic classical with expressive melodies, rich harmonies, and emotional depth. Key: A Major, Tempo: 85 BPM."
  ],
  "rock": [
    "Powerful rock anthem with electric guitars, driving drums, and strong bass. Key: E Minor, Tempo: 120 BPM.",
    "Alternative rock with distorted guitars, dynamic drums, and emotional vocals. Key: A Minor, Tempo: 110 BPM.",
    "Progressive rock with complex time signatures, intricate arrangements, and technical playing. Key: C Major, Tempo: 130 BPM.",
    "Blues rock with slide guitar, soulful vocals, and driving rhythm. Key: G Major, Tempo: 100 BPM."
  ],
  "pop": [
    "Catchy pop song with bright synthesizers, upbeat drums, and melodic vocals. Key: C Major, Tempo: 110 BPM.",
    "Indie pop with acoustic guitars, soft drums, and dreamy vocals. Key: F Major, Tempo: 95 BPM.",
    "Electronic pop with modern production, catchy hooks, and danceable beats. Key: A Major, Tempo: 120 BPM.",
    "Retro pop with vintage synthesizers, funky bass, and nostalgic vibes. Key: D Major, Tempo: 105 BPM."
  ],
  "folk": [
    "Acoustic folk song with guitar, harmonica, and warm vocals. Key: G Major, Tempo: 85 BPM.",
    "Celtic folk with fiddle, flute, and traditional instruments. Key: D Major, Tempo: 90 BPM.",
    "Americana folk with banjo, acoustic guitar, and storytelling vocals. Key: C Major, Tempo: 80 BPM.",
    "Indie folk with soft guitars, gentle drums, and intimate vocals. Key: F Major, Tempo: 75 BPM."
  ],
  "blues": [
    "Bluesy track with electric guitar, harmonica, and soulful vocals. Key: A Minor, Tempo: 95 BPM.",
    "Delta blues with slide guitar, raw vocals, and traditional style. Key: E Major, Tempo: 85 BPM.",
    "Chicago blues with electric instruments, driving rhythm, and urban feel. Key: Bb Major, Tempo: 100 BPM.",
    "Acoustic blues with fingerpicked guitar, harmonica, and intimate vocals. Key: G Major, Tempo: 90 BPM."
  ],
  "reggae": [
    "Relaxed reggae beat with off-beat guitar, steady bass, and laid-back drums. Key: D Major, Tempo: 80 BPM.",
    "Roots reggae with deep bass, skanking guitar, and conscious lyrics. Key: A Major, Tempo: 75 BPM.",
    "Dancehall reggae with modern production, electronic elements, and upbeat energy. Key: C Major, Tempo: 95 BPM.",
    "Dub reggae with heavy bass, echo effects, and instrumental focus. Key: G Major, Tempo: 85 BPM."
  ]
} as const;

/**
 * Example usage of the CassetteAI Music Generator executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic music generation
    const result1 = await executeCassetteAIMusicGenerator({
      prompt: "Smooth chill hip-hop beat with mellow piano melodies, deep bass, and soft drums, perfect for a night drive. Key: D Minor, Tempo: 90 BPM.",
      duration: 50
    });

    console.log("Generated music URL:", result1.audio_file.url);

    // Example 2: Using helper function for hip-hop
    const hipHopTrack = createMusicGenerationScenario('hip_hop');
    const result2 = await executeCassetteAIMusicGenerator(hipHopTrack);
    console.log("Hip-hop track:", result2.audio_file.url);

    // Example 3: Custom music with specific settings
    const customTrack = createMusicGenerationScenario(
      'custom',
      "Energetic electronic dance music with driving bass, crisp hi-hats, and uplifting melodies. Key: A Minor, Tempo: 128 BPM.",
      90
    );
    const result3 = await executeCassetteAIMusicGenerator(customTrack);
    console.log("Custom EDM track:", result3.audio_file.url);

    // Example 4: Using predefined music prompts
    const result4 = await executeCassetteAIMusicGenerator({
      prompt: MUSIC_PROMPTS.ambient[0], // "Peaceful ambient music with soft synthesizers, gentle pads, and ethereal textures. Key: C Major, Tempo: 60 BPM."
      duration: 120
    });
    console.log("Ambient track:", result4.audio_file.url);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeCassetteAIMusicGeneratorQueue({
      prompt: "Epic theme music with orchestral instruments, powerful brass, and dramatic strings. Key: D Major, Tempo: 100 BPM.",
      duration: 90,
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkCassetteAIMusicGeneratorStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getCassetteAIMusicGeneratorResult(request_id);
      console.log("Queue result:", result);
    }

  } catch (error) {
    console.error("Example execution failed:", error);
  }
}

/**
 * Utility function to estimate processing cost
 * 
 * @param durationMinutes - Duration of the music in minutes
 * @returns Estimated cost in USD
 */
export function estimateProcessingCost(durationMinutes: number): number {
  const costPerMinute = 0.02;
  return durationMinutes * costPerMinute;
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
    suggestions.push("Prompt is too short, consider adding more musical details");
  }

  // Check for musical elements
  const hasMusicalElements = /(key|tempo|bpm|instrument|style|genre)/i.test(prompt);
  if (!hasMusicalElements) {
    suggestions.push("Consider including musical elements like key, tempo, instruments, or style");
  }

  // Check for descriptive words
  const hasDescriptiveWords = /(smooth|energetic|peaceful|powerful|catchy|relaxed|dramatic|uplifting)/i.test(prompt);
  if (!hasDescriptiveWords) {
    suggestions.push("Consider adding descriptive words about mood or energy (e.g., 'smooth', 'energetic', 'peaceful')");
  }

  // Check for instruments
  const hasInstruments = /(piano|guitar|bass|drums|synthesizer|violin|saxophone|trumpet|orchestra)/i.test(prompt);
  if (!hasInstruments) {
    suggestions.push("Consider specifying instruments for better musical generation");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedPrompt
  };
}

/**
 * Utility function to validate duration
 * 
 * @param duration - The duration in seconds to validate
 * @returns Validation result with suggestions
 */
export function validateDuration(duration: number): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedDuration: number; 
} {
  const suggestions: string[] = [];
  
  // Clean and format duration
  const formattedDuration = Math.round(duration);

  // Check for common issues
  if (duration < 1) {
    suggestions.push("Duration must be at least 1 second");
  }

  if (duration > 180) {
    suggestions.push("Duration must be 180 seconds (3 minutes) or less");
  }

  if (!Number.isInteger(duration)) {
    suggestions.push("Duration should be a whole number of seconds");
  }

  // Check for optimal duration ranges
  if (duration < 10) {
    suggestions.push("Very short durations (under 10 seconds) may not capture full musical development");
  }

  if (duration > 150) {
    suggestions.push("Very long durations (over 2.5 minutes) may be unnecessarily expensive");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedDuration
  };
}

/**
 * Utility function to get optimal duration for music type
 * 
 * @param musicType - Type of music
 * @returns Recommended duration in seconds
 */
export function getOptimalDuration(musicType: 'short' | 'medium' | 'long' | 'extended'): number {
  const durationMap = {
    short: 30,    // Short clips, samples
    medium: 90,   // Standard tracks, background music
    long: 150,    // Extended tracks, theme music
    extended: 180 // Full-length tracks, ambient music
  };

  return durationMap[musicType];
}

/**
 * Utility function to enhance prompt with musical elements
 * 
 * @param basePrompt - Base prompt to enhance
 * @param enhancements - Enhancement options
 * @returns Enhanced prompt
 */
export function enhancePrompt(
  basePrompt: string, 
  enhancements: {
    key?: string;
    tempo?: number;
    instruments?: string[];
    mood?: string;
    style?: string;
  } = {}
): string {
  let enhancedPrompt = basePrompt.trim();

  // Add key
  if (enhancements.key) {
    enhancedPrompt = `${enhancedPrompt} Key: ${enhancements.key}`;
  }

  // Add tempo
  if (enhancements.tempo) {
    enhancedPrompt = `${enhancedPrompt}, Tempo: ${enhancements.tempo} BPM`;
  }

  // Add instruments
  if (enhancements.instruments && enhancements.instruments.length > 0) {
    const instrumentsText = enhancements.instruments.join(', ');
    enhancedPrompt = `${enhancedPrompt} with ${instrumentsText}`;
  }

  // Add mood
  if (enhancements.mood) {
    enhancedPrompt = `${enhancements.mood} ${enhancedPrompt}`;
  }

  // Add style
  if (enhancements.style) {
    enhancedPrompt = `${enhancedPrompt} in ${enhancements.style} style`;
  }

  return enhancedPrompt;
}

/**
 * Utility function to generate random music prompt
 * 
 * @param genre - Music genre
 * @returns Random prompt from the genre
 */
export function generateRandomPrompt(genre: keyof typeof MUSIC_PROMPTS): string {
  const prompts = MUSIC_PROMPTS[genre];
  const randomIndex = Math.floor(Math.random() * prompts.length);
  return prompts[randomIndex];
}

/**
 * Utility function to create batch music generation
 * 
 * @param prompts - Array of prompts
 * @param duration - Duration for all tracks
 * @returns Array of music generation inputs
 */
export function createBatchMusicGeneration(
  prompts: string[], 
  duration: number = 60
): CassetteAIMusicGeneratorInput[] {
  return prompts.map(prompt => ({
    prompt,
    duration
  }));
}

/**
 * Supported audio formats
 */
export const SUPPORTED_AUDIO_FORMATS = [
  "WAV"
] as const;

/**
 * Common music generation scenarios
 */
export const MUSIC_GENERATION_SCENARIOS = {
  "hip_hop": "Generate hip-hop and rap music tracks",
  "electronic": "Create electronic and dance music",
  "ambient": "Generate ambient and atmospheric music",
  "jazz": "Create jazz and fusion music",
  "classical": "Generate classical and orchestral music",
  "rock": "Create rock and alternative music",
  "pop": "Generate pop and mainstream music",
  "folk": "Create folk and acoustic music",
  "blues": "Generate blues and soul music",
  "reggae": "Create reggae and Caribbean music",
  "background_music": "Generate background and ambient music",
  "theme_music": "Create theme and cinematic music",
  "workout_music": "Generate high-energy workout music",
  "meditation_music": "Create calming meditation music"
} as const;

/**
 * Musical elements and their options
 */
export const MUSICAL_ELEMENTS = {
  "keys": ["C Major", "D Minor", "E Major", "F Major", "G Major", "A Minor", "B Major", "C Minor", "D Major", "E Minor", "F Minor", "G Minor", "A Major", "B Minor"],
  "tempos": [60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180],
  "instruments": ["piano", "guitar", "bass", "drums", "synthesizer", "violin", "saxophone", "trumpet", "orchestra", "strings", "brass", "woodwinds", "percussion", "vocals"],
  "styles": ["hip-hop", "electronic", "ambient", "jazz", "classical", "rock", "pop", "folk", "blues", "reggae", "funk", "soul", "country", "latin"],
  "moods": ["chill", "energetic", "peaceful", "dramatic", "uplifting", "melancholic", "romantic", "mysterious", "nostalgic", "futuristic", "epic", "intimate"]
} as const;

export default executeCassetteAIMusicGenerator;
