import { fal } from "@fal-ai/client";

export interface DialogVoice {
  voice: string;
  turn_prefix: string;
}

export interface DialogTTSInput {
  input: string;
  voices: DialogVoice[];
  response_format?: "url" | "bytes";
  seed?: number;
}

export interface DialogTTSOutput {
  audio: {
    url: string;
    content_type: string;
    file_name: string;
    file_size: number;
    duration: number;
  };
}

export interface DialogTTSOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI PlayAI TTS Dialog Executor
 * 
 * Generates natural-sounding multi-speaker dialogues and audio.
 * Perfect for expressive outputs, storytelling, games, animations, and interactive media.
 * 
 * @param input - The dialogue input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated audio result
 */
export async function executeDialogTTS(
  input: DialogTTSInput,
  options: DialogTTSOptions = {}
): Promise<DialogTTSOutput> {
  try {
    // Validate input
    if (!input.input || !input.voices || input.voices.length === 0) {
      throw new Error("Input and voices are required");
    }

    if (input.voices.length > 2) {
      throw new Error("Maximum of 2 speakers allowed");
    }

    if (input.voices.length < 1) {
      throw new Error("At least 1 speaker is required");
    }

    // Validate voice structure
    for (const voice of input.voices) {
      if (!voice.voice || !voice.turn_prefix) {
        throw new Error("Each voice must have 'voice' and 'turn_prefix' properties");
      }
    }

    // Validate turn prefixes are unique
    const prefixes = input.voices.map(v => v.turn_prefix);
    const uniquePrefixes = new Set(prefixes);
    if (prefixes.length !== uniquePrefixes.size) {
      throw new Error("Turn prefixes must be unique for each speaker");
    }

    // Prepare the request payload
    const payload = {
      input: input.input,
      voices: input.voices,
      response_format: input.response_format || "url",
      seed: input.seed || null
    };

    // Execute the model
    const result = await fal.subscribe("fal-ai/playai/tts/dialog", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as DialogTTSOutput;

  } catch (error) {
    console.error("Dialog TTS execution failed:", error);
    throw new Error(`Dialog TTS generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Dialog TTS with queue management for long-running requests
 * 
 * @param input - The dialogue input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeDialogTTSQueue(
  input: DialogTTSInput,
  options: DialogTTSOptions = {}
): Promise<{ request_id: string }> {
  try {
    // Validate input (same validation as above)
    if (!input.input || !input.voices || input.voices.length === 0) {
      throw new Error("Input and voices are required");
    }

    if (input.voices.length > 2) {
      throw new Error("Maximum of 2 speakers allowed");
    }

    if (input.voices.length < 1) {
      throw new Error("At least 1 speaker is required");
    }

    // Validate voice structure
    for (const voice of input.voices) {
      if (!voice.voice || !voice.turn_prefix) {
        throw new Error("Each voice must have 'voice' and 'turn_prefix' properties");
      }
    }

    // Validate turn prefixes are unique
    const prefixes = input.voices.map(v => v.turn_prefix);
    const uniquePrefixes = new Set(prefixes);
    if (prefixes.length !== uniquePrefixes.size) {
      throw new Error("Turn prefixes must be unique for each speaker");
    }

    // Prepare the request payload
    const payload = {
      input: input.input,
      voices: input.voices,
      response_format: input.response_format || "url",
      seed: input.seed || null
    };

    // Submit to queue
    const { request_id } = await fal.queue.submit("fal-ai/playai/tts/dialog", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("Dialog TTS queue submission failed:", error);
    throw new Error(`Dialog TTS queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued Dialog TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkDialogTTSStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/playai/tts/dialog", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("Dialog TTS status check failed:", error);
    throw new Error(`Dialog TTS status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed Dialog TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated audio result
 */
export async function getDialogTTSResult(
  requestId: string
): Promise<DialogTTSOutput> {
  try {
    const result = await fal.queue.result("fal-ai/playai/tts/dialog", {
      requestId
    });

    return result.data as DialogTTSOutput;

  } catch (error) {
    console.error("Dialog TTS result retrieval failed:", error);
    throw new Error(`Dialog TTS result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create a simple dialogue with two speakers
 * 
 * @param speaker1Text - Text for the first speaker
 * @param speaker2Text - Text for the second speaker
 * @param speaker1Voice - Voice for the first speaker
 * @param speaker2Voice - Voice for the second speaker
 * @param speaker1Prefix - Prefix for the first speaker (default: "Speaker 1: ")
 * @param speaker2Prefix - Prefix for the second speaker (default: "Speaker 2: ")
 * @returns Formatted dialogue string
 */
export function createDialogue(
  speaker1Text: string,
  speaker2Text: string,
  speaker1Voice: string,
  speaker2Voice: string,
  speaker1Prefix: string = "Speaker 1: ",
  speaker2Prefix: string = "Speaker 2: "
): { input: string; voices: DialogVoice[] } {
  const dialogue = `${speaker1Prefix}${speaker1Text}\n${speaker2Prefix}${speaker2Text}`;
  
  const voices: DialogVoice[] = [
    {
      voice: speaker1Voice,
      turn_prefix: speaker1Prefix
    },
    {
      voice: speaker2Voice,
      turn_prefix: speaker2Prefix
    }
  ];

  return { input: dialogue, voices };
}

/**
 * Available voice options for the Dialog TTS model
 */
export const AVAILABLE_VOICES = {
  "Jennifer (English (US)/American)": "American English female voice",
  "Furio (English (IT)/Italian)": "Italian-accented English male voice",
  "Emma (English (UK)/British)": "British English female voice",
  "Carlos (Spanish/Spain)": "Spanish male voice",
  "Marie (French/France)": "French female voice",
  "Hans (German/Germany)": "German male voice",
  "Yuki (Japanese/Japan)": "Japanese female voice",
  "Li (Chinese/Mandarin)": "Chinese Mandarin female voice",
  "Alessandro (Italian/Italy)": "Italian male voice",
  "Sofia (Portuguese/Brazil)": "Portuguese Brazilian female voice"
} as const;

/**
 * Example usage of the Dialog TTS executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Simple conversation
    const result1 = await executeDialogTTS({
      input: "Speaker 1: Hey, did you catch the game last night?\nSpeaker 2: Of course! What a match—it had me on the edge of my seat.",
      voices: [
        {
          voice: "Jennifer (English (US)/American)",
          turn_prefix: "Speaker 1: "
        },
        {
          voice: "Furio (English (IT)/Italian)",
          turn_prefix: "Speaker 2: "
        }
      ]
    });

    console.log("Generated audio URL:", result1.audio.url);
    console.log("Duration:", result1.audio.duration, "seconds");

    // Example 2: Using helper function
    const dialogue = createDialogue(
      "Hello, how are you today?",
      "I'm doing great, thank you for asking!",
      "Jennifer (English (US)/American)",
      "Emma (English (UK)/British)"
    );

    const result2 = await executeDialogTTS(dialogue);
    console.log("Generated dialogue audio:", result2.audio.url);

  } catch (error) {
    console.error("Example execution failed:", error);
  }
}

export default executeDialogTTS;
