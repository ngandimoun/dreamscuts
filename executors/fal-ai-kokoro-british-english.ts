import { fal } from "@fal-ai/client";

export interface KokoroBritishEnglishInput {
  prompt: string;
  voice: "bf_alice" | "bf_emma" | "bf_isabella" | "bf_lily" | "bm_daniel" | "bm_fable" | "bm_george" | "bm_lewis";
  speed?: number;
}

export interface KokoroBritishEnglishOutput {
  audio: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

export interface KokoroBritishEnglishOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI Kokoro British English TTS Executor
 * 
 * A high-quality British English text-to-speech model offering natural and 
 * expressive voice synthesis. Advanced British English text-to-speech generation 
 * with natural expression and clarity, supporting multiple voice options and 
 * speed control for high-quality British English speech synthesis.
 * 
 * @param input - The British English text-to-speech generation input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated audio result
 */
export async function executeKokoroBritishEnglish(
  input: KokoroBritishEnglishInput,
  options: KokoroBritishEnglishOptions = {}
): Promise<KokoroBritishEnglishOutput> {
  try {
    // Validate required inputs
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (!input.voice) {
      throw new Error("Voice is required");
    }

    // Validate text length
    if (input.prompt.length > 5000) {
      throw new Error("Prompt must be 5000 characters or less");
    }

    if (input.prompt.length < 1) {
      throw new Error("Prompt must be at least 1 character");
    }

    // Validate voice if provided
    if (!isValidVoice(input.voice)) {
      throw new Error(`Invalid voice: ${input.voice}. Please use a valid voice option.`);
    }

    // Validate speed if provided
    if (input.speed !== undefined) {
      if (input.speed < 0.5 || input.speed > 2.0) {
        throw new Error("Speed must be between 0.5 and 2.0");
      }
    }

    // Prepare the request payload
    const payload: any = {
      prompt: input.prompt.trim(),
      voice: input.voice
    };

    // Add optional parameters if provided
    if (input.speed !== undefined) {
      payload.speed = input.speed;
    }

    // Execute the model
    const result = await fal.subscribe("fal-ai/kokoro/british-english", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as KokoroBritishEnglishOutput;

  } catch (error) {
    console.error("Fal AI Kokoro British English TTS execution failed:", error);
    throw new Error(`Fal AI Kokoro British English TTS generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Fal AI Kokoro British English TTS with queue management for batch processing
 * 
 * @param input - The British English text-to-speech generation input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeKokoroBritishEnglishQueue(
  input: KokoroBritishEnglishInput,
  options: KokoroBritishEnglishOptions = {}
): Promise<{ request_id: string }> {
  try {
    // Validate input (same validation as above)
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (!input.voice) {
      throw new Error("Voice is required");
    }

    if (input.prompt.length > 5000) {
      throw new Error("Prompt must be 5000 characters or less");
    }

    if (!isValidVoice(input.voice)) {
      throw new Error(`Invalid voice: ${input.voice}. Please use a valid voice option.`);
    }

    if (input.speed !== undefined && (input.speed < 0.5 || input.speed > 2.0)) {
      throw new Error("Speed must be between 0.5 and 2.0");
    }

    // Prepare the request payload
    const payload: any = {
      prompt: input.prompt.trim(),
      voice: input.voice
    };

    // Add optional parameters if provided
    if (input.speed !== undefined) {
      payload.speed = input.speed;
    }

    // Submit to queue
    const { request_id } = await fal.queue.submit("fal-ai/kokoro/british-english", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("Fal AI Kokoro British English TTS queue submission failed:", error);
    throw new Error(`Fal AI Kokoro British English TTS queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued Fal AI Kokoro British English TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkKokoroBritishEnglishStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/kokoro/british-english", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("Fal AI Kokoro British English TTS status check failed:", error);
    throw new Error(`Fal AI Kokoro British English TTS status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed Fal AI Kokoro British English TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated audio result
 */
export async function getKokoroBritishEnglishResult(
  requestId: string
): Promise<KokoroBritishEnglishOutput> {
  try {
    const result = await fal.queue.result("fal-ai/kokoro/british-english", {
      requestId
    });

    return result.data as KokoroBritishEnglishOutput;

  } catch (error) {
    console.error("Fal AI Kokoro British English TTS result retrieval failed:", error);
    throw new Error(`Fal AI Kokoro British English TTS result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create British English text-to-speech generation scenarios
 * 
 * @param type - Type of TTS generation scenario to create
 * @param customText - Custom text (optional)
 * @param customOptions - Custom options (optional)
 * @returns Kokoro British English TTS input configuration
 */
export function createBritishEnglishTTSScenario(
  type: 'educational' | 'motivational' | 'professional' | 'casual' | 'dramatic' | 'calm' | 'energetic' | 'custom',
  customText?: string,
  customOptions?: Partial<KokoroBritishEnglishInput>
): KokoroBritishEnglishInput {
  const scenarioTemplates = {
    educational: {
      prompt: customText || "Welcome to our English lesson. Today we shall learn about grammar and vocabulary.",
      voice: "bf_alice" as const,
      speed: 0.8
    },
    motivational: {
      prompt: customText || "Believe in yourself! You have the power to achieve anything you set your mind to!",
      voice: "bf_alice" as const,
      speed: 1.2
    },
    professional: {
      prompt: customText || "Thank you for choosing our services. We shall provide you with the best professional service.",
      voice: "bf_alice" as const,
      speed: 1.0
    },
    casual: {
      prompt: customText || "Hello there! How are you doing? Fancy a cup of tea?",
      voice: "bf_alice" as const,
      speed: 1.0
    },
    dramatic: {
      prompt: customText || "This is the moment that will change everything!",
      voice: "bf_alice" as const,
      speed: 1.1
    },
    calm: {
      prompt: customText || "Take a deep breath and relax. Everything will be quite all right.",
      voice: "bf_alice" as const,
      speed: 0.9
    },
    energetic: {
      prompt: customText || "Let's make today brilliant! We've got this!",
      voice: "bf_alice" as const,
      speed: 1.3
    },
    custom: {
      prompt: customText || "Custom British English voice generation",
      voice: "bf_alice" as const,
      speed: 1.0
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
 * Predefined British English text templates for different use cases
 */
export const BRITISH_ENGLISH_TEMPLATES = {
  "educational": [
    "Welcome to our English lesson. Today we shall learn about grammar and vocabulary.",
    "English is a beautiful language. Let's explore its nuances together.",
    "To learn English, you need patience and consistent practice.",
    "Today we shall study new vocabulary. Please pay attention.",
    "Correct pronunciation is fundamental in English."
  ],
  "motivational": [
    "Believe in yourself! You have the power to achieve anything you set your mind to!",
    "Don't be afraid to fail, because failure is the path to success.",
    "Every day is a new opportunity to grow and evolve.",
    "Persist in your goals, because perseverance leads to success!",
    "Your efforts will be rewarded. Keep going!"
  ],
  "professional": [
    "Thank you for choosing our services. We shall provide you with the best professional service.",
    "We are committed to offering quality solutions to our clients.",
    "Our team has extensive experience and technical knowledge.",
    "You can trust us, we shall take care of all your needs.",
    "We hope to establish a lasting partnership with you."
  ],
  "casual": [
    "Hello there! How are you doing? Fancy a cup of tea?",
    "Hi! How's it going? How was your day?",
    "Hello everyone! Fancy hanging out tonight?",
    "How about going to the cinema? There's a rather good film.",
    "Long time no see! How have you been?"
  ],
  "dramatic": [
    "This is the moment that will change everything!",
    "Destiny is in our hands. Let's face this challenge!",
    "This is a historic moment. We are about to witness something extraordinary!",
    "Justice always triumphs over injustice!",
    "United, we can build a better future for everyone!"
  ],
  "calm": [
    "Take a deep breath and relax. Everything will be quite all right.",
    "Calm your mind and find inner peace.",
    "Let go of your worries and maintain serenity.",
    "In this busy world, don't forget to take care of yourself.",
    "Relax and enjoy the quiet moments."
  ],
  "energetic": [
    "Let's make today brilliant! We've got this!",
    "Today is a special day! Let's give it our best!",
    "With great enthusiasm, let's face all challenges!",
    "Together, we can conquer all our goals!",
    "With determination and strength, let's move forward!"
  ]
} as const;

/**
 * Example usage of the Fal AI Kokoro British English TTS executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic British English text-to-speech generation
    const result1 = await executeKokoroBritishEnglish({
      prompt: "Ladies and gentlemen, welcome aboard. Please ensure your seatbelt is fastened and your tray table is stowed as we prepare for takeoff.",
      voice: "bf_alice",
      speed: 1.0
    });

    console.log("Generated British English speech URL:", result1.audio.url);

    // Example 2: Using helper function for educational content
    const educationalSpeech = createBritishEnglishTTSScenario('educational');
    const result2 = await executeKokoroBritishEnglish(educationalSpeech);
    console.log("Educational speech:", result2.audio.url);

    // Example 3: Custom text with specific settings
    const customSpeech = createBritishEnglishTTSScenario(
      'custom',
      "Believe in yourself! You have the power to achieve anything you set your mind to!",
      {
        voice: "bf_alice",
        speed: 1.2
      }
    );
    const result3 = await executeKokoroBritishEnglish(customSpeech);
    console.log("Custom motivational speech:", result3.audio.url);

    // Example 4: Using predefined templates
    const result4 = await executeKokoroBritishEnglish({
      prompt: BRITISH_ENGLISH_TEMPLATES.professional[0], // "Thank you for choosing our services. We shall provide you with the best professional service."
      voice: "bf_alice",
      speed: 1.0
    });
    console.log("Professional speech:", result4.audio.url);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeKokoroBritishEnglishQueue({
      prompt: "Welcome to our English lesson. Today we shall learn about grammar and vocabulary.",
      voice: "bf_alice",
      speed: 0.8,
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkKokoroBritishEnglishStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getKokoroBritishEnglishResult(request_id);
      console.log("Queue result:", result);
    }

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
  const costPerThousandCharacters = 0.02;
  return (textLength / 1000) * costPerThousandCharacters;
}

/**
 * Utility function to validate British English text format
 * 
 * @param text - The text string to validate
 * @returns Validation result with suggestions
 */
export function validateBritishEnglishTextFormat(text: string): { 
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

  if (text.length < 5) {
    suggestions.push("Text is too short, consider adding more content");
  }

  // Check for proper punctuation
  const hasPunctuation = /[.!?,;:""''()]/g.test(text);
  if (!hasPunctuation) {
    suggestions.push("Consider adding punctuation for better speech flow");
  }

  // Check for very long sentences
  const sentences = text.split(/[.!?]/);
  const longSentences = sentences.filter(sentence => sentence.trim().length > 50);
  if (longSentences.length > 0) {
    suggestions.push("Consider breaking up very long sentences for better speech flow");
  }

  // Check for mixed language content
  const hasNonEnglish = /[^\x00-\x7F]/g.test(text);
  if (hasNonEnglish) {
    suggestions.push("Consider using pure British English text for optimal TTS results");
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
  if (speed < 0.5) {
    suggestions.push("Speed must be at least 0.5");
  }

  if (speed > 2.0) {
    suggestions.push("Speed must be 2.0 or less");
  }

  // Check for optimal ranges
  if (speed < 0.7) {
    suggestions.push("Very slow speed (0.5-0.7) may result in unnatural speech");
  }

  if (speed > 1.5) {
    suggestions.push("Very fast speed (1.5-2.0) may result in unclear speech");
  }

  // Check for recommended ranges
  if (speed >= 0.8 && speed <= 1.2) {
    // This is the recommended range, no suggestions needed
  } else if (speed < 0.8) {
    suggestions.push("Consider using speed 0.8-1.2 for natural speech");
  } else if (speed > 1.2) {
    suggestions.push("Consider using speed 0.8-1.2 for natural speech");
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
export function getOptimalVoiceSettings(contentType: 'educational' | 'motivational' | 'professional' | 'casual' | 'dramatic' | 'calm' | 'energetic'): {
  voice: "bf_alice" | "bf_emma" | "bf_isabella" | "bf_lily" | "bm_daniel" | "bm_fable" | "bm_george" | "bm_lewis";
  speed: number;
} {
  const settingsMap = {
    educational: {
      voice: "bf_alice" as const,
      speed: 0.8
    },
    motivational: {
      voice: "bf_alice" as const,
      speed: 1.2
    },
    professional: {
      voice: "bf_alice" as const,
      speed: 1.0
    },
    casual: {
      voice: "bf_alice" as const,
      speed: 1.0
    },
    dramatic: {
      voice: "bf_alice" as const,
      speed: 1.1
    },
    calm: {
      voice: "bf_alice" as const,
      speed: 0.9
    },
    energetic: {
      voice: "bf_alice" as const,
      speed: 1.3
    }
  };

  return settingsMap[contentType];
}

/**
 * Utility function to enhance British English text for better speech
 * 
 * @param text - Base text to enhance
 * @param enhancements - Enhancement options
 * @returns Enhanced text
 */
export function enhanceBritishEnglishTextForSpeech(
  text: string, 
  enhancements: {
    addPunctuation?: boolean;
    breakLongSentences?: boolean;
    improveFlow?: boolean;
    addEmotionalContext?: boolean;
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
    const sentences = enhancedText.split(/[.!?]/);
    const brokenSentences = sentences.map(sentence => {
      if (sentence.trim().length > 50) {
        // Break at natural pause points
        return sentence.replace(/(,|;|:)/g, "$1\n");
      }
      return sentence;
    });
    enhancedText = brokenSentences.join(".");
  }

  // Improve flow
  if (enhancements.improveFlow) {
    enhancedText = enhancedText.replace(/\s+/g, " "); // Normalize spaces
    enhancedText = enhancedText.replace(/([.!?.,;:])/g, "$1 "); // Add spaces after punctuation
  }

  // Add emotional context
  if (enhancements.addEmotionalContext) {
    if (!/(!|\?|\.)/.test(enhancedText)) {
      enhancedText = `${enhancedText}!`;
    }
  }

  return enhancedText;
}

/**
 * Utility function to generate random British English text
 * 
 * @param category - Text category
 * @returns Random text from the category
 */
export function generateRandomBritishEnglishText(category: keyof typeof BRITISH_ENGLISH_TEMPLATES): string {
  const texts = BRITISH_ENGLISH_TEMPLATES[category];
  const randomIndex = Math.floor(Math.random() * texts.length);
  return texts[randomIndex];
}

/**
 * Utility function to create batch British English TTS generation
 * 
 * @param texts - Array of texts
 * @param options - Common options for all generations
 * @returns Array of TTS inputs
 */
export function createBatchBritishEnglishTTSGeneration(
  texts: string[], 
  options: Partial<KokoroBritishEnglishInput> = {}
): KokoroBritishEnglishInput[] {
  return texts.map(text => ({
    prompt: text,
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
  const validVoices = ["bf_alice", "bf_emma", "bf_isabella", "bf_lily", "bm_daniel", "bm_fable", "bm_george", "bm_lewis"];
  return validVoices.includes(voice);
}

/**
 * Supported audio formats
 */
export const SUPPORTED_AUDIO_FORMATS = [
  "WAV"
] as const;

/**
 * Common British English TTS generation scenarios
 */
export const BRITISH_ENGLISH_TTS_SCENARIOS = {
  "educational": "Generate educational British English speech",
  "motivational": "Create motivational British English speech",
  "professional": "Generate professional British English speech",
  "casual": "Create casual British English speech",
  "dramatic": "Generate dramatic British English speech",
  "calm": "Create calm British English speech",
  "energetic": "Generate energetic British English speech"
} as const;

/**
 * Voice characteristics and descriptions
 */
export const VOICE_CHARACTERISTICS = {
  "bf_alice": "Clear and professional female voice",
  "bf_emma": "Warm and friendly female voice",
  "bf_isabella": "Elegant and sophisticated female voice",
  "bf_lily": "Sweet and gentle female voice",
  "bm_daniel": "Strong and authoritative male voice",
  "bm_fable": "Storytelling and expressive male voice",
  "bm_george": "Professional and clear male voice",
  "bm_lewis": "Warm and trustworthy male voice"
} as const;

/**
 * Voice categories
 */
export const VOICE_CATEGORIES = {
  "female_voices": ["bf_alice", "bf_emma", "bf_isabella", "bf_lily"],
  "male_voices": ["bm_daniel", "bm_fable", "bm_george", "bm_lewis"]
} as const;

/**
 * Speed guidelines
 */
export const SPEED_GUIDELINES = {
  "slow": "0.5-0.8: Slower speech for educational or calm content",
  "normal": "0.8-1.2: Normal speech speed for most content",
  "fast": "1.2-2.0: Faster speech for energetic or dramatic content"
} as const;

/**
 * British English language features
 */
export const BRITISH_ENGLISH_LANGUAGE_FEATURES = {
  "pronunciation_accuracy": "Accurate British English pronunciation",
  "accent_processing": "Natural British English accent patterns",
  "character_processing": "Proper British English character processing",
  "punctuation_handling": "Natural British English punctuation handling",
  "sentence_structure": "Understanding of British English sentence structures",
  "emotional_expression": "Natural emotional expression in British English",
  "cultural_context": "Understanding of British English cultural context",
  "regional_variations": "Support for British English regional variations",
  "idiomatic_expressions": "Understanding of British English idioms and expressions"
} as const;

export default executeKokoroBritishEnglish;
