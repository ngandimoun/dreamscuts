import { fal } from "@fal-ai/client";

export type OutputFormat = 
  | "mp3_22050_32"
  | "mp3_44100_32"
  | "mp3_44100_64"
  | "mp3_44100_96"
  | "mp3_44100_128"
  | "mp3_44100_192"
  | "pcm_8000"
  | "pcm_16000"
  | "pcm_22050"
  | "pcm_24000"
  | "pcm_44100"
  | "pcm_48000"
  | "ulaw_8000"
  | "alaw_8000"
  | "opus_48000_32"
  | "opus_48000_64"
  | "opus_48000_96"
  | "opus_48000_128"
  | "opus_48000_192";

export interface SoundEffectsInput {
  text: string;
  loop?: boolean;
  duration_seconds?: number;
  prompt_influence?: number;
  output_format?: OutputFormat;
}

export interface SoundEffectsOutput {
  audio: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

export interface SoundEffectsOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI ElevenLabs Sound Effects v2 Executor
 * 
 * Generate high-quality sound effects using ElevenLabs advanced sound effects model.
 * Turn text into sound effects for videos, voice-overs, or video games using 
 * state-of-the-art sound generation technology.
 * 
 * @param input - The sound effects input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated sound effect result
 */
export async function executeSoundEffects(
  input: SoundEffectsInput,
  options: SoundEffectsOptions = {}
): Promise<SoundEffectsOutput> {
  try {
    // Validate input
    if (!input.text || input.text.trim().length === 0) {
      throw new Error("Text description is required");
    }

    if (input.text.length > 500) {
      throw new Error("Text description must be 500 characters or less");
    }

    if (input.duration_seconds !== undefined) {
      if (input.duration_seconds < 0.5 || input.duration_seconds > 22) {
        throw new Error("Duration must be between 0.5 and 22 seconds");
      }
    }

    if (input.prompt_influence !== undefined) {
      if (input.prompt_influence < 0 || input.prompt_influence > 1) {
        throw new Error("Prompt influence must be between 0 and 1");
      }
    }

    // Prepare the request payload
    const payload = {
      text: input.text.trim(),
      loop: input.loop || false,
      duration_seconds: input.duration_seconds || undefined,
      prompt_influence: input.prompt_influence || 0.3,
      output_format: input.output_format || "mp3_44100_128"
    };

    // Execute the model
    const result = await fal.subscribe("fal-ai/elevenlabs/sound-effects/v2", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as SoundEffectsOutput;

  } catch (error) {
    console.error("Sound Effects execution failed:", error);
    throw new Error(`Sound Effects generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Sound Effects with queue management for long-running requests
 * 
 * @param input - The sound effects input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeSoundEffectsQueue(
  input: SoundEffectsInput,
  options: SoundEffectsOptions = {}
): Promise<{ request_id: string }> {
  try {
    // Validate input (same validation as above)
    if (!input.text || input.text.trim().length === 0) {
      throw new Error("Text description is required");
    }

    if (input.text.length > 500) {
      throw new Error("Text description must be 500 characters or less");
    }

    if (input.duration_seconds !== undefined) {
      if (input.duration_seconds < 0.5 || input.duration_seconds > 22) {
        throw new Error("Duration must be between 0.5 and 22 seconds");
      }
    }

    if (input.prompt_influence !== undefined) {
      if (input.prompt_influence < 0 || input.prompt_influence > 1) {
        throw new Error("Prompt influence must be between 0 and 1");
      }
    }

    // Prepare the request payload
    const payload = {
      text: input.text.trim(),
      loop: input.loop || false,
      duration_seconds: input.duration_seconds || undefined,
      prompt_influence: input.prompt_influence || 0.3,
      output_format: input.output_format || "mp3_44100_128"
    };

    // Submit to queue
    const { request_id } = await fal.queue.submit("fal-ai/elevenlabs/sound-effects/v2", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("Sound Effects queue submission failed:", error);
    throw new Error(`Sound Effects queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued Sound Effects request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkSoundEffectsStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/elevenlabs/sound-effects/v2", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("Sound Effects status check failed:", error);
    throw new Error(`Sound Effects status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed Sound Effects request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated sound effect result
 */
export async function getSoundEffectsResult(
  requestId: string
): Promise<SoundEffectsOutput> {
  try {
    const result = await fal.queue.result("fal-ai/elevenlabs/sound-effects/v2", {
      requestId
    });

    return result.data as SoundEffectsOutput;

  } catch (error) {
    console.error("Sound Effects result retrieval failed:", error);
    throw new Error(`Sound Effects result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create common sound effect types
 * 
 * @param type - Type of sound effect to create
 * @param customText - Custom text description (optional)
 * @param duration - Duration in seconds (optional)
 * @returns Sound effects input configuration
 */
export function createSoundEffect(
  type: 'cinematic' | 'ui' | 'ambient' | 'game' | 'notification' | 'custom',
  customText?: string,
  duration?: number
): SoundEffectsInput {
  const soundEffectTemplates = {
    cinematic: "Spacious braam suitable for high-impact movie trailer moments",
    ui: "Sharp electronic beep for button press notification",
    ambient: "Gentle rain falling on leaves in a forest",
    game: "Retro arcade power-up sound effect",
    notification: "Soft chime notification sound",
    custom: customText || "Custom sound effect"
  };

  const baseConfig: SoundEffectsInput = {
    text: soundEffectTemplates[type],
    output_format: "mp3_44100_128",
    prompt_influence: 0.3
  };

  if (duration) {
    baseConfig.duration_seconds = duration;
  }

  if (type === 'ambient') {
    baseConfig.loop = true;
  }

  return baseConfig;
}

/**
 * Available output formats for the Sound Effects model
 */
export const OUTPUT_FORMATS = {
  // MP3 formats
  "mp3_22050_32": "MP3 22050 Hz 32 kbps",
  "mp3_44100_32": "MP3 44100 Hz 32 kbps",
  "mp3_44100_64": "MP3 44100 Hz 64 kbps",
  "mp3_44100_96": "MP3 44100 Hz 96 kbps",
  "mp3_44100_128": "MP3 44100 Hz 128 kbps (recommended)",
  "mp3_44100_192": "MP3 44100 Hz 192 kbps (high quality)",
  
  // PCM formats
  "pcm_8000": "PCM 8000 Hz",
  "pcm_16000": "PCM 16000 Hz",
  "pcm_22050": "PCM 22050 Hz",
  "pcm_24000": "PCM 24000 Hz",
  "pcm_44100": "PCM 44100 Hz",
  "pcm_48000": "PCM 48000 Hz",
  
  // Compressed formats
  "ulaw_8000": "μ-law 8000 Hz",
  "alaw_8000": "A-law 8000 Hz",
  
  // Opus formats
  "opus_48000_32": "Opus 48000 Hz 32 kbps",
  "opus_48000_64": "Opus 48000 Hz 64 kbps",
  "opus_48000_96": "Opus 48000 Hz 96 kbps",
  "opus_48000_128": "Opus 48000 Hz 128 kbps",
  "opus_48000_192": "Opus 48000 Hz 192 kbps"
} as const;

/**
 * Common sound effect prompts for different use cases
 */
export const SOUND_EFFECT_PROMPTS = {
  cinematic: [
    "Spacious braam suitable for high-impact movie trailer moments",
    "Deep cinematic whoosh for dramatic transitions",
    "Epic orchestral hit for heroic moments",
    "Tense suspenseful drone for thriller scenes"
  ],
  ui: [
    "Sharp electronic beep for button press notification",
    "Soft click sound for UI interactions",
    "Success chime for completed actions",
    "Error alert sound for warnings"
  ],
  ambient: [
    "Gentle rain falling on leaves in a forest",
    "Ocean waves crashing on a peaceful beach",
    "Wind blowing through tall grass in a meadow",
    "Crackling fire in a cozy fireplace"
  ],
  game: [
    "Retro arcade power-up sound effect",
    "Fantasy magic spell casting sound",
    "Sci-fi laser weapon firing",
    "Medieval sword clash and clang"
  ],
  notification: [
    "Soft chime notification sound",
    "Gentle bell ring for alerts",
    "Subtle ding for new messages",
    "Warm notification tone for positive feedback"
  ]
} as const;

/**
 * Example usage of the Sound Effects executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Cinematic sound effect
    const result1 = await executeSoundEffects({
      text: "Spacious braam suitable for high-impact movie trailer moments",
      duration_seconds: 3.0,
      prompt_influence: 0.3,
      output_format: "mp3_44100_128"
    });

    console.log("Generated sound effect URL:", result1.audio.url);

    // Example 2: Using helper function for UI sound
    const uiSound = createSoundEffect('ui', undefined, 0.5);
    const result2 = await executeSoundEffects(uiSound);
    console.log("Generated UI sound:", result2.audio.url);

    // Example 3: Ambient looping sound
    const result3 = await executeSoundEffects({
      text: "Gentle rain falling on leaves in a forest",
      duration_seconds: 10.0,
      loop: true,
      prompt_influence: 0.5,
      output_format: "mp3_44100_96"
    });

    console.log("Generated ambient loop:", result3.audio.url);

  } catch (error) {
    console.error("Example execution failed:", error);
  }
}

export default executeSoundEffects;
