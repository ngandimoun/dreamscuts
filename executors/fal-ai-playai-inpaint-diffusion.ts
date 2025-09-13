import { fal } from "@fal-ai/client";

export interface WordTime {
  text: string;
  timestamp: [number, number];
}

export interface PlayAIInpaintDiffusionInput {
  audio_url: string;
  text: string;
  output_text: string;
  chunks: WordTime[];
  response_format?: "url" | "bytes";
}

export interface PlayAIInpaintDiffusionOutput {
  audio: {
    url: string;
    content_type: string;
    file_name: string;
    file_size?: number;
    duration: number;
  };
}

export interface PlayAIInpaintDiffusionOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI PlayAI Inpaint Diffusion Executor
 * 
 * A novel way to perform audio editing, ensuring smooth transitions and consistent 
 * speaker characteristics for edits. Edit existing speech by 'inpainting' only the 
 * words you want to change with PlayAI's voice inpainter.
 * 
 * @param input - The audio inpainting input parameters
 * @param options - Additional execution options
 * @returns Promise with the inpainted audio result
 */
export async function executePlayAIInpaintDiffusion(
  input: PlayAIInpaintDiffusionInput,
  options: PlayAIInpaintDiffusionOptions = {}
): Promise<PlayAIInpaintDiffusionOutput> {
  try {
    // Validate required inputs
    if (!input.audio_url || input.audio_url.trim().length === 0) {
      throw new Error("Audio URL is required");
    }

    if (!input.text || input.text.trim().length === 0) {
      throw new Error("Input text is required");
    }

    if (!input.output_text || input.output_text.trim().length === 0) {
      throw new Error("Output text is required");
    }

    if (!input.chunks || input.chunks.length === 0) {
      throw new Error("Word chunks with timestamps are required");
    }

    // Validate audio URL format
    try {
      new URL(input.audio_url);
    } catch {
      throw new Error("Audio URL must be a valid URL");
    }

    // Validate text lengths
    if (input.text.length > 1000) {
      throw new Error("Input text must be 1000 characters or less");
    }

    if (input.output_text.length > 1000) {
      throw new Error("Output text must be 1000 characters or less");
    }

    // Validate chunks
    for (let i = 0; i < input.chunks.length; i++) {
      const chunk = input.chunks[i];
      
      if (!chunk.text || chunk.text.trim().length === 0) {
        throw new Error(`Chunk ${i + 1}: Text is required`);
      }

      if (!chunk.timestamp || chunk.timestamp.length !== 2) {
        throw new Error(`Chunk ${i + 1}: Timestamp must be an array of exactly 2 numbers [start, end]`);
      }

      const [start, end] = chunk.timestamp;
      if (typeof start !== 'number' || typeof end !== 'number') {
        throw new Error(`Chunk ${i + 1}: Timestamp values must be numbers`);
      }

      if (start < 0 || end < 0) {
        throw new Error(`Chunk ${i + 1}: Timestamp values must be non-negative`);
      }

      if (start >= end) {
        throw new Error(`Chunk ${i + 1}: Start timestamp must be less than end timestamp`);
      }

      // Check for overlapping timestamps
      for (let j = i + 1; j < input.chunks.length; j++) {
        const otherChunk = input.chunks[j];
        const [otherStart, otherEnd] = otherChunk.timestamp;
        
        if ((start < otherEnd && end > otherStart)) {
          throw new Error(`Chunk ${i + 1} and ${j + 1}: Timestamps cannot overlap`);
        }
      }
    }

    // Validate response format
    if (input.response_format && !["url", "bytes"].includes(input.response_format)) {
      throw new Error("Response format must be 'url' or 'bytes'");
    }

    // Prepare the request payload
    const payload: any = {
      audio_url: input.audio_url.trim(),
      text: input.text.trim(),
      output_text: input.output_text.trim(),
      chunks: input.chunks.map(chunk => ({
        text: chunk.text.trim(),
        timestamp: chunk.timestamp
      }))
    };

    // Add optional parameters only if they are provided
    if (input.response_format !== undefined) {
      payload.response_format = input.response_format;
    }

    // Execute the model
    const result = await fal.subscribe("fal-ai/playai/inpaint/diffusion", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as PlayAIInpaintDiffusionOutput;

  } catch (error) {
    console.error("PlayAI Inpaint Diffusion execution failed:", error);
    throw new Error(`PlayAI Inpaint Diffusion generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute PlayAI Inpaint Diffusion with queue management for long-running requests
 * 
 * @param input - The audio inpainting input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executePlayAIInpaintDiffusionQueue(
  input: PlayAIInpaintDiffusionInput,
  options: PlayAIInpaintDiffusionOptions = {}
): Promise<{ request_id: string }> {
  try {
    // Validate input (same validation as above)
    if (!input.audio_url || input.audio_url.trim().length === 0) {
      throw new Error("Audio URL is required");
    }

    if (!input.text || input.text.trim().length === 0) {
      throw new Error("Input text is required");
    }

    if (!input.output_text || input.output_text.trim().length === 0) {
      throw new Error("Output text is required");
    }

    if (!input.chunks || input.chunks.length === 0) {
      throw new Error("Word chunks with timestamps are required");
    }

    try {
      new URL(input.audio_url);
    } catch {
      throw new Error("Audio URL must be a valid URL");
    }

    if (input.text.length > 1000 || input.output_text.length > 1000) {
      throw new Error("Text must be 1000 characters or less");
    }

    // Validate chunks (same validation as above)
    for (let i = 0; i < input.chunks.length; i++) {
      const chunk = input.chunks[i];
      
      if (!chunk.text || chunk.text.trim().length === 0) {
        throw new Error(`Chunk ${i + 1}: Text is required`);
      }

      if (!chunk.timestamp || chunk.timestamp.length !== 2) {
        throw new Error(`Chunk ${i + 1}: Timestamp must be an array of exactly 2 numbers [start, end]`);
      }

      const [start, end] = chunk.timestamp;
      if (typeof start !== 'number' || typeof end !== 'number' || start < 0 || end < 0 || start >= end) {
        throw new Error(`Chunk ${i + 1}: Invalid timestamp values`);
      }
    }

    // Prepare the request payload (same as above)
    const payload: any = {
      audio_url: input.audio_url.trim(),
      text: input.text.trim(),
      output_text: input.output_text.trim(),
      chunks: input.chunks.map(chunk => ({
        text: chunk.text.trim(),
        timestamp: chunk.timestamp
      }))
    };

    if (input.response_format !== undefined) {
      payload.response_format = input.response_format;
    }

    // Submit to queue
    const { request_id } = await fal.queue.submit("fal-ai/playai/inpaint/diffusion", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("PlayAI Inpaint Diffusion queue submission failed:", error);
    throw new Error(`PlayAI Inpaint Diffusion queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued PlayAI Inpaint Diffusion request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkPlayAIInpaintDiffusionStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/playai/inpaint/diffusion", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("PlayAI Inpaint Diffusion status check failed:", error);
    throw new Error(`PlayAI Inpaint Diffusion status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed PlayAI Inpaint Diffusion request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the inpainted audio result
 */
export async function getPlayAIInpaintDiffusionResult(
  requestId: string
): Promise<PlayAIInpaintDiffusionOutput> {
  try {
    const result = await fal.queue.result("fal-ai/playai/inpaint/diffusion", {
      requestId
    });

    return result.data as PlayAIInpaintDiffusionOutput;

  } catch (error) {
    console.error("PlayAI Inpaint Diffusion result retrieval failed:", error);
    throw new Error(`PlayAI Inpaint Diffusion result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create word chunks from text and timestamps
 * 
 * @param text - The text to split into words
 * @param timestamps - Array of [start, end] timestamps for each word
 * @returns Array of WordTime objects
 */
export function createWordChunks(text: string, timestamps: [number, number][]): WordTime[] {
  const words = text.trim().split(/\s+/);
  
  if (words.length !== timestamps.length) {
    throw new Error(`Number of words (${words.length}) must match number of timestamps (${timestamps.length})`);
  }

  return words.map((word, index) => ({
    text: word,
    timestamp: timestamps[index]
  }));
}

/**
 * Helper function to create common audio editing scenarios
 * 
 * @param type - Type of audio editing to perform
 * @param audioUrl - Audio URL to edit
 * @param originalText - Original text in the audio
 * @param newText - New text to replace with
 * @param customChunks - Custom word chunks (optional)
 * @returns PlayAI Inpaint Diffusion input configuration
 */
export function createAudioEditingScenario(
  type: 'word_replacement' | 'correction' | 'update' | 'custom',
  audioUrl: string,
  originalText: string,
  newText: string,
  customChunks?: WordTime[]
): PlayAIInpaintDiffusionInput {
  const scenarioTemplates = {
    word_replacement: {
      response_format: "url" as const
    },
    correction: {
      response_format: "url" as const
    },
    update: {
      response_format: "url" as const
    },
    custom: {
      response_format: "url" as const
    }
  };

  const template = scenarioTemplates[type];

  return {
    audio_url: audioUrl,
    text: originalText,
    output_text: newText,
    chunks: customChunks || [],
    ...template
  };
}

/**
 * Utility function to validate audio URL
 * 
 * @param url - Audio URL to validate
 * @returns boolean indicating if URL is valid
 */
export function isValidAudioUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const supportedFormats = ['mp3', 'ogg', 'wav', 'm4a', 'aac'];
    const pathname = parsedUrl.pathname.toLowerCase();
    
    // Check if URL has a supported audio format extension
    const hasSupportedFormat = supportedFormats.some(format => 
      pathname.endsWith(`.${format}`)
    );
    
    return hasSupportedFormat;
  } catch {
    return false;
  }
}

/**
 * Utility function to estimate processing cost
 * 
 * @param textLength - Length of the text being processed
 * @returns Estimated cost in USD
 */
export function estimateProcessingCost(textLength: number): number {
  const costPerThousandChars = 0.1;
  return (textLength / 1000) * costPerThousandChars;
}

/**
 * Utility function to validate word chunks
 * 
 * @param chunks - Array of word chunks to validate
 * @returns Validation result with errors if any
 */
export function validateWordChunks(chunks: WordTime[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!chunks || chunks.length === 0) {
    errors.push("At least one word chunk is required");
    return { isValid: false, errors };
  }

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    
    if (!chunk.text || chunk.text.trim().length === 0) {
      errors.push(`Chunk ${i + 1}: Text is required`);
    }

    if (!chunk.timestamp || chunk.timestamp.length !== 2) {
      errors.push(`Chunk ${i + 1}: Timestamp must be an array of exactly 2 numbers [start, end]`);
      continue;
    }

    const [start, end] = chunk.timestamp;
    if (typeof start !== 'number' || typeof end !== 'number') {
      errors.push(`Chunk ${i + 1}: Timestamp values must be numbers`);
      continue;
    }

    if (start < 0 || end < 0) {
      errors.push(`Chunk ${i + 1}: Timestamp values must be non-negative`);
    }

    if (start >= end) {
      errors.push(`Chunk ${i + 1}: Start timestamp must be less than end timestamp`);
    }

    // Check for overlapping timestamps
    for (let j = i + 1; j < chunks.length; j++) {
      const otherChunk = chunks[j];
      if (otherChunk.timestamp && otherChunk.timestamp.length === 2) {
        const [otherStart, otherEnd] = otherChunk.timestamp;
        
        if ((start < otherEnd && end > otherStart)) {
          errors.push(`Chunk ${i + 1} and ${j + 1}: Timestamps cannot overlap`);
        }
      }
    }
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Example usage of the PlayAI Inpaint Diffusion executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic word replacement
    const chunks1 = createWordChunks(
      "The answer is out there Neo. It's looking for you.",
      [
        [0, 0.12], [0.12, 0.44], [0.44, 0.66], [0.66, 0.9], [0.9, 1.12],
        [1.12, 1.7], [1.7, 3.38], [3.38, 3.6], [3.6, 3.88], [3.88, 4.22]
      ]
    );

    const result1 = await executePlayAIInpaintDiffusion({
      audio_url: "https://storage.googleapis.com/falserverless/model_tests/playai/matrix_neo.mp3",
      text: "The answer is out there Neo. It's looking for you.",
      output_text: "The answer is out there Morpheus. It's looking for you.",
      chunks: chunks1
    });

    console.log("Generated inpainted audio:", result1.audio.url);

    // Example 2: Using helper function for correction scenario
    const correctionChunks = createWordChunks(
      "The company's revenue increased significantly.",
      [
        [0, 0.2], [0.2, 0.8], [0.8, 1.2], [1.2, 1.8], [1.8, 2.5]
      ]
    );

    const correctionScenario = createAudioEditingScenario(
      'correction',
      "https://example.com/audio.mp3",
      "The company's revenue increased significantly.",
      "The company's revenue increased substantially.",
      correctionChunks
    );

    const result2 = await executePlayAIInpaintDiffusion(correctionScenario);
    console.log("Corrected audio:", result2.audio.url);

    // Example 3: Queue usage for batch processing
    const { request_id } = await executePlayAIInpaintDiffusionQueue({
      audio_url: "https://example.com/long_audio.mp3",
      text: "Our sales target for this quarter is $1 million.",
      output_text: "Our sales target for this quarter is $1.5 million.",
      chunks: createWordChunks(
        "Our sales target for this quarter is $1 million.",
        [
          [0, 0.3], [0.3, 0.6], [0.6, 1.0], [1.0, 1.2], [1.2, 1.4],
          [1.4, 1.8], [1.8, 2.0], [2.0, 2.3], [2.3, 2.8]
        ]
      ),
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkPlayAIInpaintDiffusionStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getPlayAIInpaintDiffusionResult(request_id);
      console.log("Queue result:", result);
    }

  } catch (error) {
    console.error("Example execution failed:", error);
  }
}

/**
 * Supported audio formats for processing
 */
export const SUPPORTED_AUDIO_FORMATS = [
  "MP3",
  "OGG", 
  "WAV",
  "M4A",
  "AAC"
] as const;

/**
 * Common audio editing scenarios
 */
export const AUDIO_EDITING_SCENARIOS = {
  "word_replacement": "Replace specific words while maintaining voice characteristics",
  "correction": "Correct mispronounced or incorrect words",
  "update": "Update outdated information in recorded audio",
  "name_change": "Change names or proper nouns in speech",
  "number_update": "Update numerical values in audio content",
  "date_correction": "Correct dates or time references",
  "brand_update": "Update brand names or product references",
  "contact_info": "Update contact information in audio content"
} as const;

export default executePlayAIInpaintDiffusion;
