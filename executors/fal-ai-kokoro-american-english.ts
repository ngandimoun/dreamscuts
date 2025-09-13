import { fal } from "@fal-ai/client";

export interface KokoroAmericanEnglishInput {
  prompt: string;
  voice: "af_heart" | "af_alloy" | "af_aoede" | "af_bella" | "af_jessica" | "af_kore" | "af_nicole" | "af_nova" | "af_river" | "af_sarah" | "af_sky" | "am_adam" | "am_echo" | "am_eric" | "am_fenrir" | "am_liam" | "am_michael" | "am_onyx" | "am_puck" | "am_santa";
  speed?: number;
}

export interface KokoroAmericanEnglishOutput {
  audio: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

export interface KokoroAmericanEnglishOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI Kokoro American English TTS Executor
 * 
 * Kokoro is a lightweight text-to-speech model that delivers comparable quality 
 * to larger models while being significantly faster and more cost-efficient. 
 * Advanced American English text-to-speech generation with natural expression 
 * and clarity, supporting multiple voice options and speed control for high-quality 
 * American English speech synthesis.
 * 
 * @param input - The American English text-to-speech generation input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated audio result
 */
export async function executeKokoroAmericanEnglish(
  input: KokoroAmericanEnglishInput,
  options: KokoroAmericanEnglishOptions = {}
): Promise<KokoroAmericanEnglishOutput> {
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
    const result = await fal.subscribe("fal-ai/kokoro/american-english", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as KokoroAmericanEnglishOutput;

  } catch (error) {
    console.error("Fal AI Kokoro American English TTS execution failed:", error);
    throw new Error(`Fal AI Kokoro American English TTS generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Fal AI Kokoro American English TTS with queue management for batch processing
 * 
 * @param input - The American English text-to-speech generation input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeKokoroAmericanEnglishQueue(
  input: KokoroAmericanEnglishInput,
  options: KokoroAmericanEnglishOptions = {}
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
    const { request_id } = await fal.queue.submit("fal-ai/kokoro/american-english", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("Fal AI Kokoro American English TTS queue submission failed:", error);
    throw new Error(`Fal AI Kokoro American English TTS queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued Fal AI Kokoro American English TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkKokoroAmericanEnglishStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/kokoro/american-english", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("Fal AI Kokoro American English TTS status check failed:", error);
    throw new Error(`Fal AI Kokoro American English TTS status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed Fal AI Kokoro American English TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated audio result
 */
export async function getKokoroAmericanEnglishResult(
  requestId: string
): Promise<KokoroAmericanEnglishOutput> {
  try {
    const result = await fal.queue.result("fal-ai/kokoro/american-english", {
      requestId
    });

    return result.data as KokoroAmericanEnglishOutput;

  } catch (error) {
    console.error("Fal AI Kokoro American English TTS result retrieval failed:", error);
    throw new Error(`Fal AI Kokoro American English TTS result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create American English text-to-speech generation scenarios
 * 
 * @param type - Type of TTS generation scenario to create
 * @param customText - Custom text (optional)
 * @param customOptions - Custom options (optional)
 * @returns Kokoro American English TTS input configuration
 */
export function createAmericanEnglishTTSScenario(
  type: 'educational' | 'motivational' | 'professional' | 'casual' | 'dramatic' | 'calm' | 'energetic' | 'custom',
  customText?: string,
  customOptions?: Partial<KokoroAmericanEnglishInput>
): KokoroAmericanEnglishInput {
  const scenarioTemplates = {
    educational: {
      prompt: customText || "Welcome to our English lesson. Today we will learn about grammar and vocabulary.",
      voice: "af_heart" as const,
      speed: 0.8
    },
    motivational: {
      prompt: customText || "Believe in yourself! You have the power to achieve anything you set your mind to!",
      voice: "af_heart" as const,
      speed: 1.2
    },
    professional: {
      prompt: customText || "Thank you for choosing our services. We will provide you with the best professional service.",
      voice: "af_heart" as const,
      speed: 1.0
    },
    casual: {
      prompt: customText || "Hey there! How are you doing? Want to grab some coffee?",
      voice: "af_heart" as const,
      speed: 1.0
    },
    dramatic: {
      prompt: customText || "This is the moment that will change everything!",
      voice: "af_heart" as const,
      speed: 1.1
    },
    calm: {
      prompt: customText || "Take a deep breath and relax. Everything will be okay.",
      voice: "af_heart" as const,
      speed: 0.9
    },
    energetic: {
      prompt: customText || "Let's make today amazing! We've got this!",
      voice: "af_heart" as const,
      speed: 1.3
    },
    custom: {
      prompt: customText || "Custom American English voice generation",
      voice: "af_heart" as const,
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
 * Predefined American English text templates for different use cases
 */
export const AMERICAN_ENGLISH_TEMPLATES = {
  "educational": [
    "Welcome to our English lesson. Today we will learn about grammar and vocabulary.",
    "English is a beautiful language. Let's explore its nuances together.",
    "To learn English, you need patience and consistent practice.",
    "Today we will study new vocabulary. Please pay attention.",
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
    "Thank you for choosing our services. We will provide you with the best professional service.",
    "We are committed to offering quality solutions to our clients.",
    "Our team has extensive experience and technical knowledge.",
    "You can trust us, we will take care of all your needs.",
    "We hope to establish a lasting partnership with you."
  ],
  "casual": [
    "Hey there! How are you doing? Want to grab some coffee?",
    "Hi! How's it going? How was your day?",
    "Hey everyone! Want to hang out tonight?",
    "How about going to the movies? There's a really good film.",
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
    "Take a deep breath and relax. Everything will be okay.",
    "Calm your mind and find inner peace.",
    "Let go of your worries and maintain serenity.",
    "In this busy world, don't forget to take care of yourself.",
    "Relax and enjoy the quiet moments."
  ],
  "energetic": [
    "Let's make today amazing! We've got this!",
    "Today is a special day! Let's give it our best!",
    "With great enthusiasm, let's face all challenges!",
    "Together, we can conquer all our goals!",
    "With determination and strength, let's move forward!"
  ]
} as const;

/**
 * Example usage of the Fal AI Kokoro American English TTS executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic American English text-to-speech generation
    const result1 = await executeKokoroAmericanEnglish({
      prompt: "The future belongs to those who believe in the beauty of their dreams. So, dream big, work hard, and make it happen!",
      voice: "af_heart",
      speed: 1.0
    });

    console.log("Generated American English speech URL:", result1.audio.url);

    // Example 2: Using helper function for educational content
    const educationalSpeech = createAmericanEnglishTTSScenario('educational');
    const result2 = await executeKokoroAmericanEnglish(educationalSpeech);
    console.log("Educational speech:", result2.audio.url);

    // Example 3: Custom text with specific settings
    const customSpeech = createAmericanEnglishTTSScenario(
      'custom',
      "Believe in yourself! You have the power to achieve anything you set your mind to!",
      {
        voice: "af_heart",
        speed: 1.2
      }
    );
    const result3 = await executeKokoroAmericanEnglish(customSpeech);
    console.log("Custom motivational speech:", result3.audio.url);

    // Example 4: Using predefined templates
    const result4 = await executeKokoroAmericanEnglish({
      prompt: AMERICAN_ENGLISH_TEMPLATES.professional[0], // "Thank you for choosing our services. We will provide you with the best professional service."
      voice: "af_heart",
      speed: 1.0
    });
    console.log("Professional speech:", result4.audio.url);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeKokoroAmericanEnglishQueue({
      prompt: "Welcome to our English lesson. Today we will learn about grammar and vocabulary.",
      voice: "af_heart",
      speed: 0.8,
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkKokoroAmericanEnglishStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getKokoroAmericanEnglishResult(request_id);
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
 * Utility function to validate American English text format
 * 
 * @param text - The text string to validate
 * @returns Validation result with suggestions
 */
export function validateAmericanEnglishTextFormat(text: string): { 
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
    suggestions.push("Consider using pure American English text for optimal TTS results");
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
  voice: "af_heart" | "af_alloy" | "af_aoede" | "af_bella" | "af_jessica" | "af_kore" | "af_nicole" | "af_nova" | "af_river" | "af_sarah" | "af_sky" | "am_adam" | "am_echo" | "am_eric" | "am_fenrir" | "am_liam" | "am_michael" | "am_onyx" | "am_puck" | "am_santa";
  speed: number;
} {
  const settingsMap = {
    educational: {
      voice: "af_heart" as const,
      speed: 0.8
    },
    motivational: {
      voice: "af_heart" as const,
      speed: 1.2
    },
    professional: {
      voice: "af_heart" as const,
      speed: 1.0
    },
    casual: {
      voice: "af_heart" as const,
      speed: 1.0
    },
    dramatic: {
      voice: "af_heart" as const,
      speed: 1.1
    },
    calm: {
      voice: "af_heart" as const,
      speed: 0.9
    },
    energetic: {
      voice: "af_heart" as const,
      speed: 1.3
    }
  };

  return settingsMap[contentType];
}

/**
 * Utility function to enhance American English text for better speech
 * 
 * @param text - Base text to enhance
 * @param enhancements - Enhancement options
 * @returns Enhanced text
 */
export function enhanceAmericanEnglishTextForSpeech(
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
 * Utility function to generate random American English text
 * 
 * @param category - Text category
 * @returns Random text from the category
 */
export function generateRandomAmericanEnglishText(category: keyof typeof AMERICAN_ENGLISH_TEMPLATES): string {
  const texts = AMERICAN_ENGLISH_TEMPLATES[category];
  const randomIndex = Math.floor(Math.random() * texts.length);
  return texts[randomIndex];
}

/**
 * Utility function to create batch American English TTS generation
 * 
 * @param texts - Array of texts
 * @param options - Common options for all generations
 * @returns Array of TTS inputs
 */
export function createBatchAmericanEnglishTTSGeneration(
  texts: string[], 
  options: Partial<KokoroAmericanEnglishInput> = {}
): KokoroAmericanEnglishInput[] {
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
  const validVoices = ["af_heart", "af_alloy", "af_aoede", "af_bella", "af_jessica", "af_kore", "af_nicole", "af_nova", "af_river", "af_sarah", "af_sky", "am_adam", "am_echo", "am_eric", "am_fenrir", "am_liam", "am_michael", "am_onyx", "am_puck", "am_santa"];
  return validVoices.includes(voice);
}

/**
 * Supported audio formats
 */
export const SUPPORTED_AUDIO_FORMATS = [
  "WAV"
] as const;

/**
 * Common American English TTS generation scenarios
 */
export const AMERICAN_ENGLISH_TTS_SCENARIOS = {
  "educational": "Generate educational American English speech",
  "motivational": "Create motivational American English speech",
  "professional": "Generate professional American English speech",
  "casual": "Create casual American English speech",
  "dramatic": "Generate dramatic American English speech",
  "calm": "Create calm American English speech",
  "energetic": "Generate energetic American English speech"
} as const;

/**
 * Voice characteristics and descriptions
 */
export const VOICE_CHARACTERISTICS = {
  "af_heart": "Warm and expressive female voice",
  "af_alloy": "Clear and professional female voice",
  "af_aoede": "Melodic and musical female voice",
  "af_bella": "Elegant and sophisticated female voice",
  "af_jessica": "Friendly and approachable female voice",
  "af_kore": "Strong and confident female voice",
  "af_nicole": "Smooth and polished female voice",
  "af_nova": "Bright and energetic female voice",
  "af_river": "Calm and flowing female voice",
  "af_sarah": "Natural and conversational female voice",
  "af_sky": "Light and airy female voice",
  "am_adam": "Strong and authoritative male voice",
  "am_echo": "Deep and resonant male voice",
  "am_eric": "Friendly and approachable male voice",
  "am_fenrir": "Powerful and commanding male voice",
  "am_liam": "Warm and trustworthy male voice",
  "am_michael": "Professional and clear male voice",
  "am_onyx": "Smooth and sophisticated male voice",
  "am_puck": "Playful and energetic male voice",
  "am_santa": "Jolly and cheerful male voice"
} as const;

/**
 * Voice categories
 */
export const VOICE_CATEGORIES = {
  "female_voices": ["af_heart", "af_alloy", "af_aoede", "af_bella", "af_jessica", "af_kore", "af_nicole", "af_nova", "af_river", "af_sarah", "af_sky"],
  "male_voices": ["am_adam", "am_echo", "am_eric", "am_fenrir", "am_liam", "am_michael", "am_onyx", "am_puck", "am_santa"]
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
 * American English language features
 */
export const AMERICAN_ENGLISH_LANGUAGE_FEATURES = {
  "pronunciation_accuracy": "Accurate American English pronunciation",
  "accent_processing": "Natural American English accent patterns",
  "character_processing": "Proper American English character processing",
  "punctuation_handling": "Natural American English punctuation handling",
  "sentence_structure": "Understanding of American English sentence structures",
  "emotional_expression": "Natural emotional expression in American English",
  "cultural_context": "Understanding of American English cultural context",
  "regional_variations": "Support for American English regional variations",
  "idiomatic_expressions": "Understanding of American English idioms and expressions"
} as const;

export default executeKokoroAmericanEnglish;
