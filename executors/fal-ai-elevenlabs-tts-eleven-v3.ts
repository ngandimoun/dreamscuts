import { fal } from "@fal-ai/client";

export interface ElevenLabsTTSInput {
  text: string;
  voice?: string;
  stability?: number;
  similarity_boost?: number;
  style?: number;
  speed?: number;
  timestamps?: boolean;
  previous_text?: string;
  next_text?: string;
  language_code?: string;
}

export interface ElevenLabsTTSOutput {
  audio: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  timestamps?: Array<{
    text: string;
    start: number;
    end: number;
    type: string;
  }>;
}

export interface ElevenLabsTTSOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI ElevenLabs TTS Eleven-v3 Executor
 * 
 * Generate text-to-speech audio using Eleven-v3 from ElevenLabs.
 * High-quality, natural-sounding speech synthesis with advanced voice control,
 * stability settings, and streaming support for real-time applications.
 * 
 * @param input - The text-to-speech input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated speech audio result
 */
export async function executeElevenLabsTTS(
  input: ElevenLabsTTSInput,
  options: ElevenLabsTTSOptions = {}
): Promise<ElevenLabsTTSOutput> {
  try {
    // Validate required inputs
    if (!input.text || input.text.trim().length === 0) {
      throw new Error("Text is required");
    }

    if (input.text.length > 5000) {
      throw new Error("Text must be 5000 characters or less");
    }

    // Validate optional parameters
    if (input.stability !== undefined) {
      if (input.stability < 0 || input.stability > 1) {
        throw new Error("Stability must be between 0 and 1");
      }
    }

    if (input.similarity_boost !== undefined) {
      if (input.similarity_boost < 0 || input.similarity_boost > 1) {
        throw new Error("Similarity boost must be between 0 and 1");
      }
    }

    if (input.style !== undefined) {
      if (input.style < 0 || input.style > 1) {
        throw new Error("Style must be between 0 and 1");
      }
    }

    if (input.speed !== undefined) {
      if (input.speed < 0.7 || input.speed > 1.2) {
        throw new Error("Speed must be between 0.7 and 1.2");
      }
    }

    if (input.previous_text && input.previous_text.length > 1000) {
      throw new Error("Previous text must be 1000 characters or less");
    }

    if (input.next_text && input.next_text.length > 1000) {
      throw new Error("Next text must be 1000 characters or less");
    }

    if (input.language_code && !/^[a-z]{2}$/.test(input.language_code)) {
      throw new Error("Language code must be a valid ISO 639-1 code (2 lowercase letters)");
    }

    // Prepare the request payload
    const payload: any = {
      text: input.text.trim()
    };

    // Add optional parameters only if they are provided
    if (input.voice !== undefined) payload.voice = input.voice;
    if (input.stability !== undefined) payload.stability = input.stability;
    if (input.similarity_boost !== undefined) payload.similarity_boost = input.similarity_boost;
    if (input.style !== undefined) payload.style = input.style;
    if (input.speed !== undefined) payload.speed = input.speed;
    if (input.timestamps !== undefined) payload.timestamps = input.timestamps;
    if (input.previous_text !== undefined) payload.previous_text = input.previous_text.trim();
    if (input.next_text !== undefined) payload.next_text = input.next_text.trim();
    if (input.language_code !== undefined) payload.language_code = input.language_code;

    // Execute the model
    const result = await fal.subscribe("fal-ai/elevenlabs/tts/eleven-v3", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as ElevenLabsTTSOutput;

  } catch (error) {
    console.error("ElevenLabs TTS execution failed:", error);
    throw new Error(`ElevenLabs TTS generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute ElevenLabs TTS with streaming support for real-time applications
 * 
 * @param input - The text-to-speech input parameters
 * @param options - Additional execution options
 * @returns Promise with streaming result
 */
export async function executeElevenLabsTTSStream(
  input: ElevenLabsTTSInput,
  options: ElevenLabsTTSOptions = {}
): Promise<any> {
  try {
    // Validate input (same validation as above)
    if (!input.text || input.text.trim().length === 0) {
      throw new Error("Text is required");
    }

    if (input.text.length > 5000) {
      throw new Error("Text must be 5000 characters or less");
    }

    // Prepare the request payload (same as above)
    const payload: any = {
      text: input.text.trim()
    };

    if (input.voice !== undefined) payload.voice = input.voice;
    if (input.stability !== undefined) payload.stability = input.stability;
    if (input.similarity_boost !== undefined) payload.similarity_boost = input.similarity_boost;
    if (input.style !== undefined) payload.style = input.style;
    if (input.speed !== undefined) payload.speed = input.speed;
    if (input.timestamps !== undefined) payload.timestamps = input.timestamps;
    if (input.previous_text !== undefined) payload.previous_text = input.previous_text.trim();
    if (input.next_text !== undefined) payload.next_text = input.next_text.trim();
    if (input.language_code !== undefined) payload.language_code = input.language_code;

    // Execute streaming
    const stream = await fal.stream("fal-ai/elevenlabs/tts/eleven-v3", {
      input: payload
    });

    return stream;

  } catch (error) {
    console.error("ElevenLabs TTS streaming failed:", error);
    throw new Error(`ElevenLabs TTS streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute ElevenLabs TTS with queue management for long-running requests
 * 
 * @param input - The text-to-speech input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeElevenLabsTTSQueue(
  input: ElevenLabsTTSInput,
  options: ElevenLabsTTSOptions = {}
): Promise<{ request_id: string }> {
  try {
    // Validate input (same validation as above)
    if (!input.text || input.text.trim().length === 0) {
      throw new Error("Text is required");
    }

    if (input.text.length > 5000) {
      throw new Error("Text must be 5000 characters or less");
    }

    // Prepare the request payload (same as above)
    const payload: any = {
      text: input.text.trim()
    };

    if (input.voice !== undefined) payload.voice = input.voice;
    if (input.stability !== undefined) payload.stability = input.stability;
    if (input.similarity_boost !== undefined) payload.similarity_boost = input.similarity_boost;
    if (input.style !== undefined) payload.style = input.style;
    if (input.speed !== undefined) payload.speed = input.speed;
    if (input.timestamps !== undefined) payload.timestamps = input.timestamps;
    if (input.previous_text !== undefined) payload.previous_text = input.previous_text.trim();
    if (input.next_text !== undefined) payload.next_text = input.next_text.trim();
    if (input.language_code !== undefined) payload.language_code = input.language_code;

    // Submit to queue
    const { request_id } = await fal.queue.submit("fal-ai/elevenlabs/tts/eleven-v3", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("ElevenLabs TTS queue submission failed:", error);
    throw new Error(`ElevenLabs TTS queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued ElevenLabs TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkElevenLabsTTSStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/elevenlabs/tts/eleven-v3", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("ElevenLabs TTS status check failed:", error);
    throw new Error(`ElevenLabs TTS status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed ElevenLabs TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated speech audio result
 */
export async function getElevenLabsTTSResult(
  requestId: string
): Promise<ElevenLabsTTSOutput> {
  try {
    const result = await fal.queue.result("fal-ai/elevenlabs/tts/eleven-v3", {
      requestId
    });

    return result.data as ElevenLabsTTSOutput;

  } catch (error) {
    console.error("ElevenLabs TTS result retrieval failed:", error);
    throw new Error(`ElevenLabs TTS result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create common TTS scenarios
 * 
 * @param type - Type of TTS to create
 * @param text - Text to convert to speech
 * @param customVoice - Custom voice (optional)
 * @param customSettings - Custom voice settings (optional)
 * @returns ElevenLabs TTS input configuration
 */
export function createTTSScenario(
  type: 'narration' | 'announcement' | 'conversation' | 'presentation' | 'audiobook' | 'podcast' | 'accessibility' | 'custom',
  text: string,
  customVoice?: string,
  customSettings?: Partial<ElevenLabsTTSInput>
): ElevenLabsTTSInput {
  const scenarioTemplates = {
    narration: {
      voice: "Rachel",
      stability: 0.6,
      similarity_boost: 0.8,
      speed: 0.9,
      style: 0.1
    },
    announcement: {
      voice: "Aria",
      stability: 0.7,
      similarity_boost: 0.75,
      speed: 1.0,
      style: 0
    },
    conversation: {
      voice: "Drew",
      stability: 0.4,
      similarity_boost: 0.7,
      speed: 1.1,
      style: 0.2
    },
    presentation: {
      voice: "Paul",
      stability: 0.6,
      similarity_boost: 0.8,
      speed: 0.95,
      style: 0.05
    },
    audiobook: {
      voice: "Sarah",
      stability: 0.7,
      similarity_boost: 0.85,
      speed: 0.9,
      style: 0.1
    },
    podcast: {
      voice: "Antoni",
      stability: 0.5,
      similarity_boost: 0.75,
      speed: 1.0,
      style: 0.15
    },
    accessibility: {
      voice: "Emily",
      stability: 0.8,
      similarity_boost: 0.9,
      speed: 0.85,
      style: 0
    },
    custom: {
      voice: customVoice || "Rachel",
      stability: 0.5,
      similarity_boost: 0.75,
      speed: 1.0,
      style: 0
    }
  };

  const template = scenarioTemplates[type];
  const settings = { ...template, ...customSettings };

  return {
    text,
    ...settings
  };
}

/**
 * Available voices for ElevenLabs TTS
 */
export const AVAILABLE_VOICES = {
  "Rachel": "American female voice, clear and professional",
  "Aria": "American female voice, warm and expressive",
  "Drew": "American male voice, friendly and conversational",
  "Clyde": "American male voice, deep and authoritative",
  "Paul": "American male voice, professional and clear",
  "Domi": "American female voice, energetic and upbeat",
  "Dave": "American male voice, casual and approachable",
  "Fin": "American male voice, young and energetic",
  "Sarah": "American female voice, calm and soothing",
  "Antoni": "American male voice, smooth and professional",
  "Thomas": "American male voice, confident and clear",
  "Charlie": "American male voice, friendly and warm",
  "Emily": "American female voice, clear and articulate",
  "Elli": "American female voice, young and vibrant",
  "Callum": "British male voice, sophisticated and clear",
  "Patrick": "American male voice, professional and engaging",
  "Harry": "British male voice, warm and friendly",
  "Liam": "American male voice, confident and strong",
  "Dorothy": "American female voice, mature and wise",
  "Josh": "American male voice, casual and relatable",
  "Arnold": "American male voice, deep and powerful",
  "Adam": "American male voice, clear and professional",
  "Nicole": "American female voice, warm and engaging",
  "Jessie": "American female voice, energetic and fun",
  "Ryan": "American male voice, smooth and professional",
  "Sam": "American male voice, friendly and approachable",
  "Glinda": "American female voice, elegant and sophisticated",
  "Giovanni": "American male voice, smooth and charismatic",
  "Mimi": "American female voice, sweet and gentle",
  "Freya": "American female voice, clear and confident",
  "Grace": "American female voice, calm and professional",
  "Daniel": "American male voice, warm and engaging",
  "Lily": "American female voice, young and energetic",
  "Serena": "American female voice, sophisticated and clear",
  "Ethan": "American male voice, confident and professional",
  "Gigi": "American female voice, vibrant and expressive"
} as const;

/**
 * Language codes supported by ElevenLabs TTS
 */
export const SUPPORTED_LANGUAGES = {
  "en": "English",
  "es": "Spanish",
  "fr": "French",
  "de": "German",
  "it": "Italian",
  "pt": "Portuguese",
  "pl": "Polish",
  "tr": "Turkish",
  "ru": "Russian",
  "nl": "Dutch",
  "cs": "Czech",
  "ar": "Arabic",
  "zh": "Chinese",
  "ja": "Japanese",
  "ko": "Korean",
  "hi": "Hindi"
} as const;

/**
 * Example usage of the ElevenLabs TTS executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic text-to-speech conversion
    const result1 = await executeElevenLabsTTS({
      text: "Hello! This is a test of the text to speech system, powered by ElevenLabs. How does it sound?",
      voice: "Aria",
      stability: 0.5,
      similarity_boost: 0.75,
      speed: 1
    });

    console.log("Generated speech URL:", result1.audio.url);

    // Example 2: Using helper function for narration
    const narration = createTTSScenario(
      'narration',
      "The main character walked through the dark forest, listening carefully for any sounds."
    );
    const result2 = await executeElevenLabsTTS(narration);
    console.log("Generated narration:", result2.audio.url);

    // Example 3: Streaming example
    const stream = await executeElevenLabsTTSStream({
      text: "This is a streaming example of text-to-speech generation.",
      voice: "Rachel",
      stability: 0.6,
      similarity_boost: 0.8
    });

    for await (const event of stream) {
      console.log("Streaming event:", event);
    }

    const streamResult = await stream.done();
    console.log("Streaming result:", streamResult);

    // Example 4: Multilingual content
    const result4 = await executeElevenLabsTTS({
      text: "Bonjour! Comment allez-vous aujourd'hui?",
      voice: "Aria",
      language_code: "fr",
      stability: 0.5,
      similarity_boost: 0.75
    });

    console.log("Generated French speech:", result4.audio.url);

  } catch (error) {
    console.error("Example execution failed:", error);
  }
}

export default executeElevenLabsTTS;
