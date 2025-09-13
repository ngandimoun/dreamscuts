import { fal } from "@fal-ai/client";

export interface KokoroSpanishInput {
  prompt: string;
  voice: "ef_dora" | "em_alex" | "em_santa";
  speed?: number;
}

export interface KokoroSpanishOutput {
  audio: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

export interface KokoroSpanishOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI Kokoro Spanish TTS Executor
 * 
 * A high-quality Spanish text-to-speech model offering natural and 
 * expressive voice synthesis. Advanced Spanish text-to-speech generation 
 * with natural expression and clarity, supporting multiple voice options and 
 * speed control for high-quality Spanish speech synthesis.
 * 
 * @param input - The Spanish text-to-speech generation input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated audio result
 */
export async function executeKokoroSpanish(
  input: KokoroSpanishInput,
  options: KokoroSpanishOptions = {}
): Promise<KokoroSpanishOutput> {
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
    const result = await fal.subscribe("fal-ai/kokoro/spanish", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as KokoroSpanishOutput;

  } catch (error) {
    console.error("Fal AI Kokoro Spanish TTS execution failed:", error);
    throw new Error(`Fal AI Kokoro Spanish TTS generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Fal AI Kokoro Spanish TTS with queue management for batch processing
 * 
 * @param input - The Spanish text-to-speech generation input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeKokoroSpanishQueue(
  input: KokoroSpanishInput,
  options: KokoroSpanishOptions = {}
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
    const { request_id } = await fal.queue.submit("fal-ai/kokoro/spanish", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("Fal AI Kokoro Spanish TTS queue submission failed:", error);
    throw new Error(`Fal AI Kokoro Spanish TTS queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued Fal AI Kokoro Spanish TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkKokoroSpanishStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/kokoro/spanish", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("Fal AI Kokoro Spanish TTS status check failed:", error);
    throw new Error(`Fal AI Kokoro Spanish TTS status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed Fal AI Kokoro Spanish TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated audio result
 */
export async function getKokoroSpanishResult(
  requestId: string
): Promise<KokoroSpanishOutput> {
  try {
    const result = await fal.queue.result("fal-ai/kokoro/spanish", {
      requestId
    });

    return result.data as KokoroSpanishOutput;

  } catch (error) {
    console.error("Fal AI Kokoro Spanish TTS result retrieval failed:", error);
    throw new Error(`Fal AI Kokoro Spanish TTS result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create Spanish text-to-speech generation scenarios
 * 
 * @param type - Type of TTS generation scenario to create
 * @param customText - Custom text (optional)
 * @param customOptions - Custom options (optional)
 * @returns Kokoro Spanish TTS input configuration
 */
export function createSpanishTTSScenario(
  type: 'educational' | 'motivational' | 'professional' | 'casual' | 'dramatic' | 'calm' | 'energetic' | 'custom',
  customText?: string,
  customOptions?: Partial<KokoroSpanishInput>
): KokoroSpanishInput {
  const scenarioTemplates = {
    educational: {
      prompt: customText || "Bienvenidos a nuestra lección de español. Hoy aprenderemos sobre gramática y vocabulario.",
      voice: "ef_dora" as const,
      speed: 0.8
    },
    motivational: {
      prompt: customText || "¡Cree en ti mismo! Tienes el poder de lograr todo lo que te propongas!",
      voice: "ef_dora" as const,
      speed: 1.2
    },
    professional: {
      prompt: customText || "Gracias por elegir nuestros servicios. Te proporcionaremos el mejor servicio profesional.",
      voice: "ef_dora" as const,
      speed: 1.0
    },
    casual: {
      prompt: customText || "¡Hola! ¿Cómo estás? ¿Qué tal tu día?",
      voice: "ef_dora" as const,
      speed: 1.0
    },
    dramatic: {
      prompt: customText || "¡Este es el momento que cambiará todo!",
      voice: "ef_dora" as const,
      speed: 1.1
    },
    calm: {
      prompt: customText || "Respira profundo y relájate. Todo estará bien.",
      voice: "ef_dora" as const,
      speed: 0.9
    },
    energetic: {
      prompt: customText || "¡Hagamos que hoy sea brillante! ¡Podemos hacerlo!",
      voice: "ef_dora" as const,
      speed: 1.3
    },
    custom: {
      prompt: customText || "Generación de voz personalizada en español",
      voice: "ef_dora" as const,
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
 * Predefined Spanish text templates for different use cases
 */
export const SPANISH_TEMPLATES = {
  "educational": [
    "Bienvenidos a nuestra lección de español. Hoy aprenderemos sobre gramática y vocabulario.",
    "El español es un idioma hermoso. Exploremos sus matices juntos.",
    "Para aprender español, necesitas paciencia y práctica constante.",
    "Hoy estudiaremos nuevo vocabulario. Por favor, presta atención.",
    "La pronunciación correcta es fundamental en español."
  ],
  "motivational": [
    "¡Cree en ti mismo! Tienes el poder de lograr todo lo que te propongas!",
    "No tengas miedo de fallar, porque el fracaso es el camino al éxito.",
    "Cada día es una nueva oportunidad para crecer y evolucionar.",
    "Persiste en tus objetivos, porque la perseverancia lleva al éxito!",
    "Tus esfuerzos serán recompensados. ¡Sigue adelante!"
  ],
  "professional": [
    "Gracias por elegir nuestros servicios. Te proporcionaremos el mejor servicio profesional.",
    "Estamos comprometidos a ofrecer soluciones de calidad a nuestros clientes.",
    "Nuestro equipo tiene amplia experiencia y conocimiento técnico.",
    "Puedes confiar en nosotros, nos encargaremos de todas tus necesidades.",
    "Esperamos establecer una asociación duradera contigo."
  ],
  "casual": [
    "¡Hola! ¿Cómo estás? ¿Qué tal tu día?",
    "¡Hola a todos! ¿Qué tal si salimos esta noche?",
    "¿Qué te parece ir al cine? Hay una película bastante buena.",
    "¡Hace mucho que no te veo! ¿Cómo has estado?",
    "¡Hola! ¿Cómo va todo? ¿Cómo ha sido tu día?"
  ],
  "dramatic": [
    "¡Este es el momento que cambiará todo!",
    "El destino está en nuestras manos. ¡Enfrentemos este desafío!",
    "¡Este es un momento histórico! Estamos a punto de presenciar algo extraordinario!",
    "¡La justicia siempre triunfa sobre la injusticia!",
    "¡Unidos, podemos construir un futuro mejor para todos!"
  ],
  "calm": [
    "Respira profundo y relájate. Todo estará bien.",
    "Calma tu mente y encuentra paz interior.",
    "Deja ir tus preocupaciones y mantén la serenidad.",
    "En este mundo ocupado, no olvides cuidarte a ti mismo.",
    "Relájate y disfruta los momentos de tranquilidad."
  ],
  "energetic": [
    "¡Hagamos que hoy sea brillante! ¡Podemos hacerlo!",
    "¡Hoy es un día especial! ¡Démosle lo mejor!",
    "¡Con gran entusiasmo, enfrentemos todos los desafíos!",
    "¡Juntos, podemos conquistar todos nuestros objetivos!",
    "¡Con determinación y fuerza, avancemos!"
  ]
} as const;

/**
 * Example usage of the Fal AI Kokoro Spanish TTS executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic Spanish text-to-speech generation
    const result1 = await executeKokoroSpanish({
      prompt: "La vida es un viaje, no un destino. Disfruta cada momento y sigue adelante con pasión.",
      voice: "ef_dora",
      speed: 1.0
    });

    console.log("Generated Spanish speech URL:", result1.audio.url);

    // Example 2: Using helper function for educational content
    const educationalSpeech = createSpanishTTSScenario('educational');
    const result2 = await executeKokoroSpanish(educationalSpeech);
    console.log("Educational speech:", result2.audio.url);

    // Example 3: Custom text with specific settings
    const customSpeech = createSpanishTTSScenario(
      'custom',
      "¡Cree en ti mismo! Tienes el poder de lograr todo lo que te propongas!",
      {
        voice: "ef_dora",
        speed: 1.2
      }
    );
    const result3 = await executeKokoroSpanish(customSpeech);
    console.log("Custom motivational speech:", result3.audio.url);

    // Example 4: Using predefined templates
    const result4 = await executeKokoroSpanish({
      prompt: SPANISH_TEMPLATES.professional[0], // "Gracias por elegir nuestros servicios. Te proporcionaremos el mejor servicio profesional."
      voice: "ef_dora",
      speed: 1.0
    });
    console.log("Professional speech:", result4.audio.url);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeKokoroSpanishQueue({
      prompt: "Bienvenidos a nuestra lección de español. Hoy aprenderemos sobre gramática y vocabulario.",
      voice: "ef_dora",
      speed: 0.8,
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkKokoroSpanishStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getKokoroSpanishResult(request_id);
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
 * Utility function to validate Spanish text format
 * 
 * @param text - The text string to validate
 * @returns Validation result with suggestions
 */
export function validateSpanishTextFormat(text: string): { 
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
  const hasNonSpanish = /[^\x00-\x7F]/g.test(text);
  if (hasNonSpanish) {
    suggestions.push("Consider using pure Spanish text for optimal TTS results");
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
  voice: "ef_dora" | "em_alex" | "em_santa";
  speed: number;
} {
  const settingsMap = {
    educational: {
      voice: "ef_dora" as const,
      speed: 0.8
    },
    motivational: {
      voice: "ef_dora" as const,
      speed: 1.2
    },
    professional: {
      voice: "ef_dora" as const,
      speed: 1.0
    },
    casual: {
      voice: "ef_dora" as const,
      speed: 1.0
    },
    dramatic: {
      voice: "ef_dora" as const,
      speed: 1.1
    },
    calm: {
      voice: "ef_dora" as const,
      speed: 0.9
    },
    energetic: {
      voice: "ef_dora" as const,
      speed: 1.3
    }
  };

  return settingsMap[contentType];
}

/**
 * Utility function to enhance Spanish text for better speech
 * 
 * @param text - Base text to enhance
 * @param enhancements - Enhancement options
 * @returns Enhanced text
 */
export function enhanceSpanishTextForSpeech(
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
 * Utility function to generate random Spanish text
 * 
 * @param category - Text category
 * @returns Random text from the category
 */
export function generateRandomSpanishText(category: keyof typeof SPANISH_TEMPLATES): string {
  const texts = SPANISH_TEMPLATES[category];
  const randomIndex = Math.floor(Math.random() * texts.length);
  return texts[randomIndex];
}

/**
 * Utility function to create batch Spanish TTS generation
 * 
 * @param texts - Array of texts
 * @param options - Common options for all generations
 * @returns Array of TTS inputs
 */
export function createBatchSpanishTTSGeneration(
  texts: string[], 
  options: Partial<KokoroSpanishInput> = {}
): KokoroSpanishInput[] {
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
  const validVoices = ["ef_dora", "em_alex", "em_santa"];
  return validVoices.includes(voice);
}

/**
 * Supported audio formats
 */
export const SUPPORTED_AUDIO_FORMATS = [
  "WAV"
] as const;

/**
 * Common Spanish TTS generation scenarios
 */
export const SPANISH_TTS_SCENARIOS = {
  "educational": "Generate educational Spanish speech",
  "motivational": "Create motivational Spanish speech",
  "professional": "Generate professional Spanish speech",
  "casual": "Create casual Spanish speech",
  "dramatic": "Generate dramatic Spanish speech",
  "calm": "Create calm Spanish speech",
  "energetic": "Generate energetic Spanish speech"
} as const;

/**
 * Voice characteristics and descriptions
 */
export const VOICE_CHARACTERISTICS = {
  "ef_dora": "Clear and professional female voice",
  "em_alex": "Strong and authoritative male voice",
  "em_santa": "Warm and friendly male voice"
} as const;

/**
 * Voice categories
 */
export const VOICE_CATEGORIES = {
  "female_voices": ["ef_dora"],
  "male_voices": ["em_alex", "em_santa"]
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
 * Spanish language features
 */
export const SPANISH_LANGUAGE_FEATURES = {
  "pronunciation_accuracy": "Accurate Spanish pronunciation",
  "accent_processing": "Natural Spanish accent patterns",
  "character_processing": "Proper Spanish character processing",
  "punctuation_handling": "Natural Spanish punctuation handling",
  "sentence_structure": "Understanding of Spanish sentence structures",
  "emotional_expression": "Natural emotional expression in Spanish",
  "cultural_context": "Understanding of Spanish cultural context",
  "regional_variations": "Support for Spanish regional variations",
  "idiomatic_expressions": "Understanding of Spanish idioms and expressions"
} as const;

export default executeKokoroSpanish;
