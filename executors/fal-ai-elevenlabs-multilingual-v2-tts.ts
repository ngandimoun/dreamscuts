import { fal } from "@fal-ai/client";

export interface ElevenLabsMultilingualV2TTSInput {
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

export interface ElevenLabsMultilingualV2TTSOutput {
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
    speaker_id?: string;
  }>;
}

export interface ElevenLabsMultilingualV2TTSOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI ElevenLabs Multilingual v2 TTS Executor
 * 
 * ElevenLabs Multilingual v2 model for text-to-speech generation. 
 * Excels in stability, language diversity, and accent accuracy. 
 * Supports 29 languages with high-quality, natural-sounding voices. 
 * Advanced multilingual text-to-speech technology that provides 
 * natural-sounding speech synthesis across multiple languages with 
 * voice stability, similarity boost, style control, and speed adjustment.
 * 
 * @param input - The text-to-speech generation input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated audio result
 */
export async function executeElevenLabsMultilingualV2TTS(
  input: ElevenLabsMultilingualV2TTSInput,
  options: ElevenLabsMultilingualV2TTSOptions = {}
): Promise<ElevenLabsMultilingualV2TTSOutput> {
  try {
    // Validate required inputs
    if (!input.text || input.text.trim().length === 0) {
      throw new Error("Text is required");
    }

    // Validate text length
    if (input.text.length > 5000) {
      throw new Error("Text must be 5000 characters or less");
    }

    if (input.text.length < 1) {
      throw new Error("Text must be at least 1 character");
    }

    // Validate voice if provided
    if (input.voice && !isValidVoice(input.voice)) {
      throw new Error(`Invalid voice: ${input.voice}. Please use a valid voice option.`);
    }

    // Validate stability if provided
    if (input.stability !== undefined) {
      if (input.stability < 0 || input.stability > 1) {
        throw new Error("Stability must be between 0 and 1");
      }
    }

    // Validate similarity boost if provided
    if (input.similarity_boost !== undefined) {
      if (input.similarity_boost < 0 || input.similarity_boost > 1) {
        throw new Error("Similarity boost must be between 0 and 1");
      }
    }

    // Validate style if provided
    if (input.style !== undefined) {
      if (input.style < 0 || input.style > 1) {
        throw new Error("Style must be between 0 and 1");
      }
    }

    // Validate speed if provided
    if (input.speed !== undefined) {
      if (input.speed < 0.7 || input.speed > 1.2) {
        throw new Error("Speed must be between 0.7 and 1.2");
      }
    }

    // Validate language code if provided
    if (input.language_code && !isValidLanguageCode(input.language_code)) {
      throw new Error(`Invalid language code: ${input.language_code}. Please use a valid ISO 639-1 language code.`);
    }

    // Prepare the request payload
    const payload: any = {
      text: input.text.trim()
    };

    // Add optional parameters if provided
    if (input.voice) {
      payload.voice = input.voice;
    }

    if (input.stability !== undefined) {
      payload.stability = input.stability;
    }

    if (input.similarity_boost !== undefined) {
      payload.similarity_boost = input.similarity_boost;
    }

    if (input.style !== undefined) {
      payload.style = input.style;
    }

    if (input.speed !== undefined) {
      payload.speed = input.speed;
    }

    if (input.timestamps !== undefined) {
      payload.timestamps = input.timestamps;
    }

    if (input.previous_text) {
      payload.previous_text = input.previous_text;
    }

    if (input.next_text) {
      payload.next_text = input.next_text;
    }

    if (input.language_code) {
      payload.language_code = input.language_code;
    }

    // Execute the model
    const result = await fal.subscribe("fal-ai/elevenlabs/tts/multilingual-v2", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as ElevenLabsMultilingualV2TTSOutput;

  } catch (error) {
    console.error("Fal AI ElevenLabs Multilingual v2 TTS execution failed:", error);
    throw new Error(`Fal AI ElevenLabs Multilingual v2 TTS generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Fal AI ElevenLabs Multilingual v2 TTS with queue management for batch processing
 * 
 * @param input - The text-to-speech generation input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeElevenLabsMultilingualV2TTSQueue(
  input: ElevenLabsMultilingualV2TTSInput,
  options: ElevenLabsMultilingualV2TTSOptions = {}
): Promise<{ request_id: string }> {
  try {
    // Validate input (same validation as above)
    if (!input.text || input.text.trim().length === 0) {
      throw new Error("Text is required");
    }

    if (input.text.length > 5000) {
      throw new Error("Text must be 5000 characters or less");
    }

    if (input.voice && !isValidVoice(input.voice)) {
      throw new Error(`Invalid voice: ${input.voice}. Please use a valid voice option.`);
    }

    if (input.stability !== undefined && (input.stability < 0 || input.stability > 1)) {
      throw new Error("Stability must be between 0 and 1");
    }

    if (input.similarity_boost !== undefined && (input.similarity_boost < 0 || input.similarity_boost > 1)) {
      throw new Error("Similarity boost must be between 0 and 1");
    }

    if (input.style !== undefined && (input.style < 0 || input.style > 1)) {
      throw new Error("Style must be between 0 and 1");
    }

    if (input.speed !== undefined && (input.speed < 0.7 || input.speed > 1.2)) {
      throw new Error("Speed must be between 0.7 and 1.2");
    }

    if (input.language_code && !isValidLanguageCode(input.language_code)) {
      throw new Error(`Invalid language code: ${input.language_code}. Please use a valid ISO 639-1 language code.`);
    }

    // Prepare the request payload
    const payload: any = {
      text: input.text.trim()
    };

    // Add optional parameters if provided
    if (input.voice) {
      payload.voice = input.voice;
    }

    if (input.stability !== undefined) {
      payload.stability = input.stability;
    }

    if (input.similarity_boost !== undefined) {
      payload.similarity_boost = input.similarity_boost;
    }

    if (input.style !== undefined) {
      payload.style = input.style;
    }

    if (input.speed !== undefined) {
      payload.speed = input.speed;
    }

    if (input.timestamps !== undefined) {
      payload.timestamps = input.timestamps;
    }

    if (input.previous_text) {
      payload.previous_text = input.previous_text;
    }

    if (input.next_text) {
      payload.next_text = input.next_text;
    }

    if (input.language_code) {
      payload.language_code = input.language_code;
    }

    // Submit to queue
    const { request_id } = await fal.queue.submit("fal-ai/elevenlabs/tts/multilingual-v2", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("Fal AI ElevenLabs Multilingual v2 TTS queue submission failed:", error);
    throw new Error(`Fal AI ElevenLabs Multilingual v2 TTS queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued Fal AI ElevenLabs Multilingual v2 TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkElevenLabsMultilingualV2TTSStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/elevenlabs/tts/multilingual-v2", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("Fal AI ElevenLabs Multilingual v2 TTS status check failed:", error);
    throw new Error(`Fal AI ElevenLabs Multilingual v2 TTS status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed Fal AI ElevenLabs Multilingual v2 TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated audio result
 */
export async function getElevenLabsMultilingualV2TTSResult(
  requestId: string
): Promise<ElevenLabsMultilingualV2TTSOutput> {
  try {
    const result = await fal.queue.result("fal-ai/elevenlabs/tts/multilingual-v2", {
      requestId
    });

    return result.data as ElevenLabsMultilingualV2TTSOutput;

  } catch (error) {
    console.error("Fal AI ElevenLabs Multilingual v2 TTS result retrieval failed:", error);
    throw new Error(`Fal AI ElevenLabs Multilingual v2 TTS result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Fal AI ElevenLabs Multilingual v2 TTS with streaming support
 * 
 * @param input - The text-to-speech generation input parameters
 * @returns Promise with streaming result
 */
export async function executeElevenLabsMultilingualV2TTSStream(
  input: ElevenLabsMultilingualV2TTSInput
): Promise<ElevenLabsMultilingualV2TTSOutput> {
  try {
    // Validate input (same validation as above)
    if (!input.text || input.text.trim().length === 0) {
      throw new Error("Text is required");
    }

    if (input.text.length > 5000) {
      throw new Error("Text must be 5000 characters or less");
    }

    // Prepare the request payload
    const payload: any = {
      text: input.text.trim()
    };

    // Add optional parameters if provided
    if (input.voice) {
      payload.voice = input.voice;
    }

    if (input.stability !== undefined) {
      payload.stability = input.stability;
    }

    if (input.similarity_boost !== undefined) {
      payload.similarity_boost = input.similarity_boost;
    }

    if (input.style !== undefined) {
      payload.style = input.style;
    }

    if (input.speed !== undefined) {
      payload.speed = input.speed;
    }

    if (input.timestamps !== undefined) {
      payload.timestamps = input.timestamps;
    }

    if (input.previous_text) {
      payload.previous_text = input.previous_text;
    }

    if (input.next_text) {
      payload.next_text = input.next_text;
    }

    if (input.language_code) {
      payload.language_code = input.language_code;
    }

    // Execute with streaming
    const stream = await fal.stream("fal-ai/elevenlabs/tts/multilingual-v2", {
      input: payload
    });

    // Process streaming events
    for await (const event of stream) {
      console.log("Streaming event:", event);
    }

    // Get final result
    const result = await stream.done();
    return result.data as ElevenLabsMultilingualV2TTSOutput;

  } catch (error) {
    console.error("Fal AI ElevenLabs Multilingual v2 TTS streaming failed:", error);
    throw new Error(`Fal AI ElevenLabs Multilingual v2 TTS streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create text-to-speech generation scenarios
 * 
 * @param type - Type of TTS generation scenario to create
 * @param customText - Custom text (optional)
 * @param customOptions - Custom options (optional)
 * @returns ElevenLabs Multilingual v2 TTS input configuration
 */
export function createTTSScenario(
  type: 'natural' | 'expressive' | 'professional' | 'dramatic' | 'calm' | 'energetic' | 'multilingual' | 'custom',
  customText?: string,
  customOptions?: Partial<ElevenLabsMultilingualV2TTSInput>
): ElevenLabsMultilingualV2TTSInput {
  const scenarioTemplates = {
    natural: {
      text: customText || "Hello! This is a natural-sounding text-to-speech generation.",
      voice: "Rachel",
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0,
      speed: 1
    },
    expressive: {
      text: customText || "Welcome to our amazing product launch! This is going to be incredible!",
      voice: "Aria",
      stability: 0.4,
      similarity_boost: 0.8,
      style: 0.6,
      speed: 1.1
    },
    professional: {
      text: customText || "Thank you for your attention. Today we will discuss our quarterly results and future plans.",
      voice: "Michael",
      stability: 0.6,
      similarity_boost: 0.7,
      style: 0.2,
      speed: 0.9
    },
    dramatic: {
      text: customText || "In a world where technology meets imagination, anything is possible!",
      voice: "Clyde",
      stability: 0.3,
      similarity_boost: 0.9,
      style: 0.8,
      speed: 1.2
    },
    calm: {
      text: customText || "Take a deep breath and relax. Everything will be okay.",
      voice: "Grace",
      stability: 0.7,
      similarity_boost: 0.8,
      style: 0.1,
      speed: 0.8
    },
    energetic: {
      text: customText || "Let's get excited! This is going to be an amazing adventure!",
      voice: "Freya",
      stability: 0.4,
      similarity_boost: 0.8,
      style: 0.7,
      speed: 1.1
    },
    multilingual: {
      text: customText || "Hello! Bonjour! Hola! Guten Tag! Ciao!",
      voice: "Aria",
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.3,
      speed: 1
    },
    custom: {
      text: customText || "Custom text-to-speech generation",
      voice: "Rachel",
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0,
      speed: 1
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
 * Predefined voice configurations for different use cases
 */
export const VOICE_CONFIGURATIONS = {
  "natural": {
    "voice": "Rachel",
    "stability": 0.5,
    "similarity_boost": 0.75,
    "style": 0,
    "speed": 1,
    "description": "Clear, natural-sounding speech"
  },
  "expressive": {
    "voice": "Aria",
    "stability": 0.4,
    "similarity_boost": 0.8,
    "style": 0.6,
    "speed": 1.1,
    "description": "Expressive, dramatic speech"
  },
  "professional": {
    "voice": "Michael",
    "stability": 0.6,
    "similarity_boost": 0.7,
    "style": 0.2,
    "speed": 0.9,
    "description": "Professional, business-like speech"
  },
  "dramatic": {
    "voice": "Clyde",
    "stability": 0.3,
    "similarity_boost": 0.9,
    "style": 0.8,
    "speed": 1.2,
    "description": "Dramatic, theatrical speech"
  },
  "calm": {
    "voice": "Grace",
    "stability": 0.7,
    "similarity_boost": 0.8,
    "style": 0.1,
    "speed": 0.8,
    "description": "Calm, soothing speech"
  },
  "energetic": {
    "voice": "Freya",
    "stability": 0.4,
    "similarity_boost": 0.8,
    "style": 0.7,
    "speed": 1.1,
    "description": "Energetic, enthusiastic speech"
  },
  "conversational": {
    "voice": "Drew",
    "stability": 0.5,
    "similarity_boost": 0.75,
    "style": 0.3,
    "speed": 1,
    "description": "Friendly, conversational speech"
  },
  "authoritative": {
    "voice": "Clyde",
    "stability": 0.6,
    "similarity_boost": 0.8,
    "style": 0.4,
    "speed": 0.9,
    "description": "Authoritative, commanding speech"
  }
} as const;

/**
 * Example usage of the Fal AI ElevenLabs Multilingual v2 TTS executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic text-to-speech generation
    const result1 = await executeElevenLabsMultilingualV2TTS({
      text: "Hello! This is a test of the text to speech system, powered by ElevenLabs. How does it sound?",
      voice: "Aria",
      stability: 0.5,
      similarity_boost: 0.75,
      speed: 1
    });

    console.log("Generated speech URL:", result1.audio.url);

    // Example 2: Using helper function for natural speech
    const naturalSpeech = createTTSScenario('natural');
    const result2 = await executeElevenLabsMultilingualV2TTS(naturalSpeech);
    console.log("Natural speech:", result2.audio.url);

    // Example 3: Custom text with specific settings
    const customSpeech = createTTSScenario(
      'custom',
      "Welcome to our amazing product launch! This is going to be incredible!",
      {
        voice: "Aria",
        stability: 0.4,
        similarity_boost: 0.8,
        style: 0.6,
        speed: 1.1
      }
    );
    const result3 = await executeElevenLabsMultilingualV2TTS(customSpeech);
    console.log("Custom expressive speech:", result3.audio.url);

    // Example 4: Using predefined voice configurations
    const result4 = await executeElevenLabsMultilingualV2TTS({
      text: "Thank you for your attention. Today we will discuss our quarterly results.",
      ...VOICE_CONFIGURATIONS.professional
    });
    console.log("Professional speech:", result4.audio.url);

    // Example 5: Multilingual speech with language code
    const result5 = await executeElevenLabsMultilingualV2TTS({
      text: "Bonjour! Comment allez-vous aujourd'hui?",
      voice: "Aria",
      language_code: "fr",
      stability: 0.5,
      similarity_boost: 0.75,
      speed: 1
    });
    console.log("French speech:", result5.audio.url);

    // Example 6: Speech with timestamps
    const result6 = await executeElevenLabsMultilingualV2TTS({
      text: "This is a test with timestamps enabled.",
      voice: "Rachel",
      timestamps: true,
      stability: 0.5,
      similarity_boost: 0.75,
      speed: 1
    });
    console.log("Speech with timestamps:", result6.audio.url);
    if (result6.timestamps) {
      console.log("Timestamps:", result6.timestamps);
    }

    // Example 7: Queue usage for batch processing
    const { request_id } = await executeElevenLabsMultilingualV2TTSQueue({
      text: "This is a batch processing example for text-to-speech generation.",
      voice: "Michael",
      stability: 0.6,
      similarity_boost: 0.7,
      style: 0.2,
      speed: 0.9,
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkElevenLabsMultilingualV2TTSStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getElevenLabsMultilingualV2TTSResult(request_id);
      console.log("Queue result:", result);
    }

    // Example 8: Streaming usage
    const result8 = await executeElevenLabsMultilingualV2TTSStream({
      text: "This is a streaming example for real-time text-to-speech generation.",
      voice: "Aria",
      stability: 0.5,
      similarity_boost: 0.75,
      speed: 1
    });
    console.log("Streaming result:", result8.audio.url);

  } catch (error) {
    console.error("Example execution failed:", error);
  }
}

/**
 * Utility function to estimate processing cost
 * 
 * @param textLength - Length of the text in characters
 * @returns Estimated cost in USD
 */
export function estimateProcessingCost(textLength: number): number {
  const costPerThousandCharacters = 0.1;
  return (textLength / 1000) * costPerThousandCharacters;
}

/**
 * Utility function to validate text format
 * 
 * @param text - The text string to validate
 * @returns Validation result with suggestions
 */
export function validateTextFormat(text: string): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedText: string; 
} {
  const suggestions: string[] = [];
  
  // Clean and format text
  const formattedText = text.trim();

  // Check for common issues
  if (text.length > 5000) {
    suggestions.push("Text is too long (max 5000 characters)");
  }

  if (text.length < 10) {
    suggestions.push("Text is too short, consider adding more content");
  }

  // Check for special characters that might affect speech
  const hasSpecialChars = /[^\w\s.,!?;:'"()-]/.test(text);
  if (hasSpecialChars) {
    suggestions.push("Text contains special characters that may affect speech quality");
  }

  // Check for proper punctuation
  const hasPunctuation = /[.!?]/.test(text);
  if (!hasPunctuation) {
    suggestions.push("Consider adding punctuation for better speech flow");
  }

  // Check for very long sentences
  const sentences = text.split(/[.!?]+/);
  const longSentences = sentences.filter(sentence => sentence.trim().length > 100);
  if (longSentences.length > 0) {
    suggestions.push("Consider breaking up very long sentences for better speech flow");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedText
  };
}

/**
 * Utility function to validate voice parameter
 * 
 * @param voice - The voice parameter to validate
 * @returns Validation result with suggestions
 */
export function validateVoiceParameter(voice: string): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedVoice: string; 
} {
  const suggestions: string[] = [];
  
  // Clean and format voice
  const formattedVoice = voice.trim();

  // Check if voice is valid
  if (!isValidVoice(formattedVoice)) {
    suggestions.push(`Invalid voice: ${formattedVoice}. Please use a valid voice option.`);
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedVoice
  };
}

/**
 * Utility function to validate stability parameter
 * 
 * @param stability - The stability value to validate
 * @returns Validation result with suggestions
 */
export function validateStabilityParameter(stability: number): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedStability: number; 
} {
  const suggestions: string[] = [];
  
  // Clean and format stability
  const formattedStability = Math.round(stability * 100) / 100; // Round to 2 decimal places

  // Check for common issues
  if (stability < 0) {
    suggestions.push("Stability must be at least 0");
  }

  if (stability > 1) {
    suggestions.push("Stability must be 1 or less");
  }

  // Check for optimal ranges
  if (stability < 0.3) {
    suggestions.push("Very low stability (0-0.3) may result in inconsistent voice quality");
  }

  if (stability > 0.8) {
    suggestions.push("Very high stability (0.8-1.0) may result in monotonous speech");
  }

  // Check for recommended ranges
  if (stability >= 0.4 && stability <= 0.6) {
    // This is the recommended range, no suggestions needed
  } else if (stability < 0.4) {
    suggestions.push("Consider using stability 0.4-0.6 for balanced results");
  } else if (stability > 0.6) {
    suggestions.push("Consider using stability 0.4-0.6 for balanced results");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedStability
  };
}

/**
 * Utility function to validate similarity boost parameter
 * 
 * @param similarityBoost - The similarity boost value to validate
 * @returns Validation result with suggestions
 */
export function validateSimilarityBoostParameter(similarityBoost: number): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedSimilarityBoost: number; 
} {
  const suggestions: string[] = [];
  
  // Clean and format similarity boost
  const formattedSimilarityBoost = Math.round(similarityBoost * 100) / 100; // Round to 2 decimal places

  // Check for common issues
  if (similarityBoost < 0) {
    suggestions.push("Similarity boost must be at least 0");
  }

  if (similarityBoost > 1) {
    suggestions.push("Similarity boost must be 1 or less");
  }

  // Check for optimal ranges
  if (similarityBoost < 0.5) {
    suggestions.push("Very low similarity boost (0-0.5) may result in poor voice matching");
  }

  if (similarityBoost > 0.9) {
    suggestions.push("Very high similarity boost (0.9-1.0) may result in overfitting");
  }

  // Check for recommended ranges
  if (similarityBoost >= 0.7 && similarityBoost <= 0.8) {
    // This is the recommended range, no suggestions needed
  } else if (similarityBoost < 0.7) {
    suggestions.push("Consider using similarity boost 0.7-0.8 for optimal voice matching");
  } else if (similarityBoost > 0.8) {
    suggestions.push("Consider using similarity boost 0.7-0.8 for optimal voice matching");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedSimilarityBoost
  };
}

/**
 * Utility function to validate style parameter
 * 
 * @param style - The style value to validate
 * @returns Validation result with suggestions
 */
export function validateStyleParameter(style: number): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedStyle: number; 
} {
  const suggestions: string[] = [];
  
  // Clean and format style
  const formattedStyle = Math.round(style * 100) / 100; // Round to 2 decimal places

  // Check for common issues
  if (style < 0) {
    suggestions.push("Style must be at least 0");
  }

  if (style > 1) {
    suggestions.push("Style must be 1 or less");
  }

  // Check for optimal ranges
  if (style < 0.3) {
    suggestions.push("Low style (0-0.3) results in natural speech");
  }

  if (style > 0.7) {
    suggestions.push("High style (0.7-1.0) results in very dramatic speech");
  }

  // Check for recommended ranges
  if (style >= 0 && style <= 0.3) {
    suggestions.push("Style 0-0.3 is recommended for natural speech");
  } else if (style >= 0.4 && style <= 0.7) {
    suggestions.push("Style 0.4-0.7 is recommended for expressive speech");
  } else if (style >= 0.8 && style <= 1.0) {
    suggestions.push("Style 0.8-1.0 is recommended for dramatic speech");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedStyle
  };
}

/**
 * Utility function to validate speed parameter
 * 
 * @param speed - The speed value to validate
 * @returns Validation result with suggestions
 */
export function validateSpeedParameter(speed: number): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedSpeed: number; 
} {
  const suggestions: string[] = [];
  
  // Clean and format speed
  const formattedSpeed = Math.round(speed * 100) / 100; // Round to 2 decimal places

  // Check for common issues
  if (speed < 0.7) {
    suggestions.push("Speed must be at least 0.7");
  }

  if (speed > 1.2) {
    suggestions.push("Speed must be 1.2 or less");
  }

  // Check for optimal ranges
  if (speed < 0.8) {
    suggestions.push("Very slow speed (0.7-0.8) may result in unnatural speech");
  }

  if (speed > 1.1) {
    suggestions.push("Very fast speed (1.1-1.2) may result in unclear speech");
  }

  // Check for recommended ranges
  if (speed >= 0.8 && speed <= 1.1) {
    // This is the recommended range, no suggestions needed
  } else if (speed < 0.8) {
    suggestions.push("Consider using speed 0.8-1.1 for natural speech");
  } else if (speed > 1.1) {
    suggestions.push("Consider using speed 0.8-1.1 for natural speech");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedSpeed
  };
}

/**
 * Utility function to get optimal voice settings for content type
 * 
 * @param contentType - Type of content
 * @returns Recommended voice settings
 */
export function getOptimalVoiceSettings(contentType: 'natural' | 'expressive' | 'professional' | 'dramatic' | 'calm' | 'energetic'): {
  voice: string;
  stability: number;
  similarity_boost: number;
  style: number;
  speed: number;
} {
  const settingsMap = {
    natural: {
      voice: "Rachel",
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0,
      speed: 1
    },
    expressive: {
      voice: "Aria",
      stability: 0.4,
      similarity_boost: 0.8,
      style: 0.6,
      speed: 1.1
    },
    professional: {
      voice: "Michael",
      stability: 0.6,
      similarity_boost: 0.7,
      style: 0.2,
      speed: 0.9
    },
    dramatic: {
      voice: "Clyde",
      stability: 0.3,
      similarity_boost: 0.9,
      style: 0.8,
      speed: 1.2
    },
    calm: {
      voice: "Grace",
      stability: 0.7,
      similarity_boost: 0.8,
      style: 0.1,
      speed: 0.8
    },
    energetic: {
      voice: "Freya",
      stability: 0.4,
      similarity_boost: 0.8,
      style: 0.7,
      speed: 1.1
    }
  };

  return settingsMap[contentType];
}

/**
 * Utility function to enhance text for better speech
 * 
 * @param text - Base text to enhance
 * @param enhancements - Enhancement options
 * @returns Enhanced text
 */
export function enhanceTextForSpeech(
  text: string, 
  enhancements: {
    addPunctuation?: boolean;
    breakLongSentences?: boolean;
    addPauses?: boolean;
    improveFlow?: boolean;
  } = {}
): string {
  let enhancedText = text.trim();

  // Add punctuation if missing
  if (enhancements.addPunctuation) {
    if (!enhancedText.match(/[.!?]$/)) {
      enhancedText += ".";
    }
  }

  // Break long sentences
  if (enhancements.breakLongSentences) {
    const sentences = enhancedText.split(/[.!?]+/);
    const brokenSentences = sentences.map(sentence => {
      if (sentence.trim().length > 100) {
        // Break at natural pause points
        return sentence.replace(/(,|;|:)/g, "$1\n");
      }
      return sentence;
    });
    enhancedText = brokenSentences.join(". ");
  }

  // Add pauses
  if (enhancements.addPauses) {
    enhancedText = enhancedText.replace(/(,|;|:)/g, "$1 ");
  }

  // Improve flow
  if (enhancements.improveFlow) {
    enhancedText = enhancedText.replace(/\s+/g, " "); // Normalize whitespace
  }

  return enhancedText;
}

/**
 * Utility function to generate random voice configuration
 * 
 * @param voiceType - Type of voice
 * @returns Random voice configuration
 */
export function generateRandomVoiceConfiguration(voiceType: 'natural' | 'expressive' | 'professional' | 'dramatic' | 'calm' | 'energetic'): {
  voice: string;
  stability: number;
  similarity_boost: number;
  style: number;
  speed: number;
} {
  const baseSettings = getOptimalVoiceSettings(voiceType);
  
  // Add some randomness to the settings
  return {
    voice: baseSettings.voice,
    stability: Math.round((baseSettings.stability + (Math.random() - 0.5) * 0.2) * 100) / 100,
    similarity_boost: Math.round((baseSettings.similarity_boost + (Math.random() - 0.5) * 0.1) * 100) / 100,
    style: Math.round((baseSettings.style + (Math.random() - 0.5) * 0.2) * 100) / 100,
    speed: Math.round((baseSettings.speed + (Math.random() - 0.5) * 0.2) * 100) / 100
  };
}

/**
 * Utility function to create batch text-to-speech generation
 * 
 * @param texts - Array of texts
 * @param options - Common options for all generations
 * @returns Array of TTS inputs
 */
export function createBatchTTSGeneration(
  texts: string[], 
  options: Partial<ElevenLabsMultilingualV2TTSInput> = {}
): ElevenLabsMultilingualV2TTSInput[] {
  return texts.map(text => ({
    text,
    ...options
  }));
}

/**
 * Check if a voice is valid
 * 
 * @param voice - The voice to check
 * @returns True if voice is valid
 */
function isValidVoice(voice: string): boolean {
  const validVoices = [
    "Rachel", "Aria", "Drew", "Clyde", "Freya", "Gigi", "Grace",
    "Josh", "Lily", "Matilda", "Michael", "Nicole", "Sarah", "Thomas"
  ];
  return validVoices.includes(voice);
}

/**
 * Check if a language code is valid
 * 
 * @param languageCode - The language code to check
 * @returns True if language code is valid
 */
function isValidLanguageCode(languageCode: string): boolean {
  const validLanguageCodes = [
    "en", "es", "fr", "de", "it", "pt", "nl", "ru", "zh", "ja", "ko",
    "ar", "hi", "tr", "pl", "sv", "no", "da", "fi", "cs"
  ];
  return validLanguageCodes.includes(languageCode);
}

/**
 * Supported audio formats
 */
export const SUPPORTED_AUDIO_FORMATS = [
  "MP3"
] as const;

/**
 * Common text-to-speech generation scenarios
 */
export const TTS_GENERATION_SCENARIOS = {
  "natural": "Generate natural-sounding speech",
  "expressive": "Create expressive, dramatic speech",
  "professional": "Generate professional, business-like speech",
  "dramatic": "Create dramatic, theatrical speech",
  "calm": "Generate calm, soothing speech",
  "energetic": "Create energetic, enthusiastic speech",
  "multilingual": "Generate multilingual speech",
  "conversational": "Create friendly, conversational speech",
  "authoritative": "Generate authoritative, commanding speech"
} as const;

/**
 * Voice characteristics and descriptions
 */
export const VOICE_CHARACTERISTICS = {
  "Rachel": "Clear, professional female voice",
  "Aria": "Warm, expressive female voice",
  "Drew": "Friendly, conversational male voice",
  "Clyde": "Deep, authoritative male voice",
  "Freya": "Energetic, youthful female voice",
  "Gigi": "Sophisticated, mature female voice",
  "Grace": "Gentle, calming female voice",
  "Josh": "Casual, approachable male voice",
  "Lily": "Sweet, melodic female voice",
  "Matilda": "Confident, strong female voice",
  "Michael": "Professional, clear male voice",
  "Nicole": "Smooth, elegant female voice",
  "Sarah": "Natural, conversational female voice",
  "Thomas": "Warm, friendly male voice"
} as const;

/**
 * Supported languages and their codes
 */
export const SUPPORTED_LANGUAGES = {
  "English (US)": "en",
  "English (UK)": "en",
  "English (AU)": "en",
  "English (CA)": "en",
  "Spanish (ES)": "es",
  "Spanish (MX)": "es",
  "Spanish (AR)": "es",
  "Spanish (CO)": "es",
  "French (FR)": "fr",
  "French (CA)": "fr",
  "German (DE)": "de",
  "Italian (IT)": "it",
  "Portuguese (PT)": "pt",
  "Portuguese (BR)": "pt",
  "Dutch (NL)": "nl",
  "Russian (RU)": "ru",
  "Chinese (CN)": "zh",
  "Chinese (TW)": "zh",
  "Japanese (JP)": "ja",
  "Korean (KR)": "ko",
  "Arabic (SA)": "ar",
  "Hindi (IN)": "hi",
  "Turkish (TR)": "tr",
  "Polish (PL)": "pl",
  "Swedish (SE)": "sv",
  "Norwegian (NO)": "no",
  "Danish (DK)": "da",
  "Finnish (FI)": "fi",
  "Czech (CZ)": "cs"
} as const;

/**
 * Parameter ranges and recommendations
 */
export const PARAMETER_RANGES = {
  "stability": {
    "range": "0-1",
    "default": 0.5,
    "recommended": "0.4-0.6",
    "description": "Higher values make the voice more consistent but less expressive"
  },
  "similarity_boost": {
    "range": "0-1",
    "default": 0.75,
    "recommended": "0.7-0.8",
    "description": "Higher values make the voice more similar to the original voice"
  },
  "style": {
    "range": "0-1",
    "default": 0,
    "recommended": "0-0.3 for natural, 0.4-0.7 for expressive",
    "description": "Higher values make the voice more expressive and dramatic"
  },
  "speed": {
    "range": "0.7-1.2",
    "default": 1,
    "recommended": "0.8-1.1",
    "description": "Values below 1.0 slow down the speech, above 1.0 speed it up"
  }
} as const;

export default executeElevenLabsMultilingualV2TTS;
