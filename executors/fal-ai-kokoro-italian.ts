import { fal } from "@fal-ai/client";

export interface KokoroItalianInput {
  prompt: string;
  voice: "if_sara" | "im_nicola";
  speed?: number;
}

export interface KokoroItalianOutput {
  audio: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

export interface KokoroItalianOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI Kokoro Italian TTS Executor
 * 
 * A high-quality Italian text-to-speech model delivering smooth and 
 * expressive speech synthesis. Advanced Italian text-to-speech generation 
 * with natural expression and clarity, supporting multiple voice options and 
 * speed control for high-quality Italian speech synthesis.
 * 
 * @param input - The Italian text-to-speech generation input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated audio result
 */
export async function executeKokoroItalian(
  input: KokoroItalianInput,
  options: KokoroItalianOptions = {}
): Promise<KokoroItalianOutput> {
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
    const result = await fal.subscribe("fal-ai/kokoro/italian", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as KokoroItalianOutput;

  } catch (error) {
    console.error("Fal AI Kokoro Italian TTS execution failed:", error);
    throw new Error(`Fal AI Kokoro Italian TTS generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Fal AI Kokoro Italian TTS with queue management for batch processing
 * 
 * @param input - The Italian text-to-speech generation input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeKokoroItalianQueue(
  input: KokoroItalianInput,
  options: KokoroItalianOptions = {}
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
    const { request_id } = await fal.queue.submit("fal-ai/kokoro/italian", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("Fal AI Kokoro Italian TTS queue submission failed:", error);
    throw new Error(`Fal AI Kokoro Italian TTS queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued Fal AI Kokoro Italian TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkKokoroItalianStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/kokoro/italian", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("Fal AI Kokoro Italian TTS status check failed:", error);
    throw new Error(`Fal AI Kokoro Italian TTS status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed Fal AI Kokoro Italian TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated audio result
 */
export async function getKokoroItalianResult(
  requestId: string
): Promise<KokoroItalianOutput> {
  try {
    const result = await fal.queue.result("fal-ai/kokoro/italian", {
      requestId
    });

    return result.data as KokoroItalianOutput;

  } catch (error) {
    console.error("Fal AI Kokoro Italian TTS result retrieval failed:", error);
    throw new Error(`Fal AI Kokoro Italian TTS result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create Italian text-to-speech generation scenarios
 * 
 * @param type - Type of TTS generation scenario to create
 * @param customText - Custom text (optional)
 * @param customOptions - Custom options (optional)
 * @returns Kokoro Italian TTS input configuration
 */
export function createItalianTTSScenario(
  type: 'educational' | 'motivational' | 'professional' | 'casual' | 'dramatic' | 'calm' | 'energetic' | 'custom',
  customText?: string,
  customOptions?: Partial<KokoroItalianInput>
): KokoroItalianInput {
  const scenarioTemplates = {
    educational: {
      prompt: customText || "Benvenuti alla nostra lezione di italiano. Oggi impareremo la grammatica e il vocabolario.",
      voice: "if_sara" as const,
      speed: 0.8
    },
    motivational: {
      prompt: customText || "Credi in te stesso! Hai il potere di raggiungere tutto ciò che ti proponi!",
      voice: "if_sara" as const,
      speed: 1.2
    },
    professional: {
      prompt: customText || "Grazie per aver scelto i nostri servizi. Ti forniremo il miglior servizio professionale.",
      voice: "if_sara" as const,
      speed: 1.0
    },
    casual: {
      prompt: customText || "Ciao! Come stai? Come è andata la tua giornata?",
      voice: "if_sara" as const,
      speed: 1.0
    },
    dramatic: {
      prompt: customText || "Questo è il momento che cambierà tutto!",
      voice: "if_sara" as const,
      speed: 1.1
    },
    calm: {
      prompt: customText || "Respira profondamente e rilassati. Tutto andrà bene.",
      voice: "if_sara" as const,
      speed: 0.9
    },
    energetic: {
      prompt: customText || "Rendiamo oggi straordinario! Ce la possiamo fare!",
      voice: "if_sara" as const,
      speed: 1.3
    },
    custom: {
      prompt: customText || "Generazione vocale personalizzata in italiano",
      voice: "if_sara" as const,
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
 * Predefined Italian text templates for different use cases
 */
export const ITALIAN_TEMPLATES = {
  "educational": [
    "Benvenuti alla nostra lezione di italiano. Oggi impareremo la grammatica e il vocabolario.",
    "L'italiano è una lingua bellissima. Esploriamo insieme le sue sfumature.",
    "Per imparare l'italiano, hai bisogno di pazienza e pratica costante.",
    "Oggi studieremo nuovo vocabolario. Per favore, presta attenzione.",
    "La pronuncia corretta è fondamentale in italiano."
  ],
  "motivational": [
    "Credi in te stesso! Hai il potere di raggiungere tutto ciò che ti proponi!",
    "Non aver paura di fallire, perché il fallimento è la strada per il successo.",
    "Ogni giorno è una nuova opportunità per crescere ed evolvere.",
    "Persisti nei tuoi obiettivi, perché la perseveranza porta al successo!",
    "I tuoi sforzi saranno ricompensati. Continua così!"
  ],
  "professional": [
    "Grazie per aver scelto i nostri servizi. Ti forniremo il miglior servizio professionale.",
    "Siamo impegnati a offrire soluzioni di qualità ai nostri clienti.",
    "Il nostro team ha ampia esperienza e conoscenza tecnica.",
    "Puoi fidarti di noi, ci occuperemo di tutte le tue esigenze.",
    "Speriamo di stabilire una partnership duratura con te."
  ],
  "casual": [
    "Ciao! Come stai? Come è andata la tua giornata?",
    "Ciao a tutti! Che ne dici di uscire stasera?",
    "Che ne dici di andare al cinema? C'è un film piuttosto buono.",
    "È da tanto che non ti vedo! Come sei stato?",
    "Ciao! Come va? Com'è stata la tua giornata?"
  ],
  "dramatic": [
    "Questo è il momento che cambierà tutto!",
    "Il destino è nelle nostre mani. Affrontiamo questa sfida!",
    "Questo è un momento storico! Stiamo per assistere a qualcosa di straordinario!",
    "La giustizia trionfa sempre sull'ingiustizia!",
    "Uniti, possiamo costruire un futuro migliore per tutti!"
  ],
  "calm": [
    "Respira profondamente e rilassati. Tutto andrà bene.",
    "Calma la tua mente e trova pace interiore.",
    "Lascia andare le tue preoccupazioni e mantieni la serenità.",
    "In questo mondo frenetico, non dimenticare di prenderti cura di te stesso.",
    "Rilassati e goditi i momenti di tranquillità."
  ],
  "energetic": [
    "Rendiamo oggi straordinario! Ce la possiamo fare!",
    "Oggi è un giorno speciale! Diamoci da fare!",
    "Con grande entusiasmo, affrontiamo tutte le sfide!",
    "Insieme, possiamo conquistare tutti i nostri obiettivi!",
    "Con determinazione e forza, andiamo avanti!"
  ]
} as const;

/**
 * Example usage of the Fal AI Kokoro Italian TTS executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic Italian text-to-speech generation
    const result1 = await executeKokoroItalian({
      prompt: "Ogni giorno è una nuova opportunità per scrivere la tua storia. Rendila straordinaria!",
      voice: "if_sara",
      speed: 1.0
    });

    console.log("Generated Italian speech URL:", result1.audio.url);

    // Example 2: Using helper function for educational content
    const educationalSpeech = createItalianTTSScenario('educational');
    const result2 = await executeKokoroItalian(educationalSpeech);
    console.log("Educational speech:", result2.audio.url);

    // Example 3: Custom text with specific settings
    const customSpeech = createItalianTTSScenario(
      'custom',
      "Credi in te stesso! Hai il potere di raggiungere tutto ciò che ti proponi!",
      {
        voice: "if_sara",
        speed: 1.2
      }
    );
    const result3 = await executeKokoroItalian(customSpeech);
    console.log("Custom motivational speech:", result3.audio.url);

    // Example 4: Using predefined templates
    const result4 = await executeKokoroItalian({
      prompt: ITALIAN_TEMPLATES.professional[0], // "Grazie per aver scelto i nostri servizi. Ti forniremo il miglior servizio professionale."
      voice: "if_sara",
      speed: 1.0
    });
    console.log("Professional speech:", result4.audio.url);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeKokoroItalianQueue({
      prompt: "Benvenuti alla nostra lezione di italiano. Oggi impareremo la grammatica e il vocabolario.",
      voice: "if_sara",
      speed: 0.8,
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkKokoroItalianStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getKokoroItalianResult(request_id);
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
 * Utility function to validate Italian text format
 * 
 * @param text - The text string to validate
 * @returns Validation result with suggestions
 */
export function validateItalianTextFormat(text: string): { 
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
  const hasNonItalian = /[^\x00-\x7F]/g.test(text);
  if (hasNonItalian) {
    suggestions.push("Consider using pure Italian text for optimal TTS results");
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
  voice: "if_sara" | "im_nicola";
  speed: number;
} {
  const settingsMap = {
    educational: {
      voice: "if_sara" as const,
      speed: 0.8
    },
    motivational: {
      voice: "if_sara" as const,
      speed: 1.2
    },
    professional: {
      voice: "if_sara" as const,
      speed: 1.0
    },
    casual: {
      voice: "if_sara" as const,
      speed: 1.0
    },
    dramatic: {
      voice: "if_sara" as const,
      speed: 1.1
    },
    calm: {
      voice: "if_sara" as const,
      speed: 0.9
    },
    energetic: {
      voice: "if_sara" as const,
      speed: 1.3
    }
  };

  return settingsMap[contentType];
}

/**
 * Utility function to enhance Italian text for better speech
 * 
 * @param text - Base text to enhance
 * @param enhancements - Enhancement options
 * @returns Enhanced text
 */
export function enhanceItalianTextForSpeech(
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
 * Utility function to generate random Italian text
 * 
 * @param category - Text category
 * @returns Random text from the category
 */
export function generateRandomItalianText(category: keyof typeof ITALIAN_TEMPLATES): string {
  const texts = ITALIAN_TEMPLATES[category];
  const randomIndex = Math.floor(Math.random() * texts.length);
  return texts[randomIndex];
}

/**
 * Utility function to create batch Italian TTS generation
 * 
 * @param texts - Array of texts
 * @param options - Common options for all generations
 * @returns Array of TTS inputs
 */
export function createBatchItalianTTSGeneration(
  texts: string[], 
  options: Partial<KokoroItalianInput> = {}
): KokoroItalianInput[] {
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
  const validVoices = ["if_sara", "im_nicola"];
  return validVoices.includes(voice);
}

/**
 * Supported audio formats
 */
export const SUPPORTED_AUDIO_FORMATS = [
  "WAV"
] as const;

/**
 * Common Italian TTS generation scenarios
 */
export const ITALIAN_TTS_SCENARIOS = {
  "educational": "Generate educational Italian speech",
  "motivational": "Create motivational Italian speech",
  "professional": "Generate professional Italian speech",
  "casual": "Create casual Italian speech",
  "dramatic": "Generate dramatic Italian speech",
  "calm": "Create calm Italian speech",
  "energetic": "Generate energetic Italian speech"
} as const;

/**
 * Voice characteristics and descriptions
 */
export const VOICE_CHARACTERISTICS = {
  "if_sara": "Clear and professional female voice",
  "im_nicola": "Strong and authoritative male voice"
} as const;

/**
 * Voice categories
 */
export const VOICE_CATEGORIES = {
  "female_voices": ["if_sara"],
  "male_voices": ["im_nicola"]
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
 * Italian language features
 */
export const ITALIAN_LANGUAGE_FEATURES = {
  "pronunciation_accuracy": "Accurate Italian pronunciation",
  "accent_processing": "Natural Italian accent patterns",
  "character_processing": "Proper Italian character processing",
  "punctuation_handling": "Natural Italian punctuation handling",
  "sentence_structure": "Understanding of Italian sentence structures",
  "emotional_expression": "Natural emotional expression in Italian",
  "cultural_context": "Understanding of Italian cultural context",
  "regional_variations": "Support for Italian regional variations",
  "idiomatic_expressions": "Understanding of Italian idioms and expressions"
} as const;

export default executeKokoroItalian;
