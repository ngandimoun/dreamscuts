import { fal } from "@fal-ai/client";

export interface KokoroFrenchInput {
  prompt: string;
  voice: "ff_siwis";
  speed?: number;
}

export interface KokoroFrenchOutput {
  audio: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

export interface KokoroFrenchOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI Kokoro French TTS Executor
 * 
 * An expressive and natural French text-to-speech model for both European 
 * and Canadian French. Advanced French text-to-speech generation with natural 
 * expression and clarity, supporting multiple voice options and speed control 
 * for high-quality French speech synthesis.
 * 
 * @param input - The French text-to-speech generation input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated audio result
 */
export async function executeKokoroFrench(
  input: KokoroFrenchInput,
  options: KokoroFrenchOptions = {}
): Promise<KokoroFrenchOutput> {
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
    const result = await fal.subscribe("fal-ai/kokoro/french", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as KokoroFrenchOutput;

  } catch (error) {
    console.error("Fal AI Kokoro French TTS execution failed:", error);
    throw new Error(`Fal AI Kokoro French TTS generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Fal AI Kokoro French TTS with queue management for batch processing
 * 
 * @param input - The French text-to-speech generation input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeKokoroFrenchQueue(
  input: KokoroFrenchInput,
  options: KokoroFrenchOptions = {}
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
    const { request_id } = await fal.queue.submit("fal-ai/kokoro/french", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("Fal AI Kokoro French TTS queue submission failed:", error);
    throw new Error(`Fal AI Kokoro French TTS queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued Fal AI Kokoro French TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkKokoroFrenchStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/kokoro/french", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("Fal AI Kokoro French TTS status check failed:", error);
    throw new Error(`Fal AI Kokoro French TTS status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed Fal AI Kokoro French TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated audio result
 */
export async function getKokoroFrenchResult(
  requestId: string
): Promise<KokoroFrenchOutput> {
  try {
    const result = await fal.queue.result("fal-ai/kokoro/french", {
      requestId
    });

    return result.data as KokoroFrenchOutput;

  } catch (error) {
    console.error("Fal AI Kokoro French TTS result retrieval failed:", error);
    throw new Error(`Fal AI Kokoro French TTS result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create French text-to-speech generation scenarios
 * 
 * @param type - Type of TTS generation scenario to create
 * @param customText - Custom text (optional)
 * @param customOptions - Custom options (optional)
 * @returns Kokoro French TTS input configuration
 */
export function createFrenchTTSScenario(
  type: 'educational' | 'motivational' | 'professional' | 'casual' | 'dramatic' | 'calm' | 'energetic' | 'custom',
  customText?: string,
  customOptions?: Partial<KokoroFrenchInput>
): KokoroFrenchInput {
  const scenarioTemplates = {
    educational: {
      prompt: customText || "Bienvenue dans notre cours de français. Aujourd'hui, nous allons apprendre la grammaire de base.",
      voice: "ff_siwis" as const,
      speed: 0.8
    },
    motivational: {
      prompt: customText || "Croyez en vous-même, vous êtes plus capable que vous ne le pensez!",
      voice: "ff_siwis" as const,
      speed: 1.2
    },
    professional: {
      prompt: customText || "Merci d'avoir choisi nos services. Nous vous fournirons le meilleur service professionnel.",
      voice: "ff_siwis" as const,
      speed: 1.0
    },
    casual: {
      prompt: customText || "Bonjour! Comment allez-vous? Voulez-vous faire une promenade?",
      voice: "ff_siwis" as const,
      speed: 1.0
    },
    dramatic: {
      prompt: customText || "En ce moment crucial, nous devons prendre la bonne décision!",
      voice: "ff_siwis" as const,
      speed: 1.1
    },
    calm: {
      prompt: customText || "Respirez profondément et détendez-vous. Tout ira bien.",
      voice: "ff_siwis" as const,
      speed: 0.9
    },
    energetic: {
      prompt: customText || "Commençons la journée avec énergie! Allons-y!",
      voice: "ff_siwis" as const,
      speed: 1.3
    },
    custom: {
      prompt: customText || "Génération de voix personnalisée en français",
      voice: "ff_siwis" as const,
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
 * Predefined French text templates for different use cases
 */
export const FRENCH_TEMPLATES = {
  "educational": [
    "Bienvenue dans notre cours de français. Aujourd'hui, nous allons apprendre la grammaire de base.",
    "Le français est une langue riche et expressive. Explorons ses nuances ensemble.",
    "Pour apprendre le français, il faut de la patience et de la pratique constante.",
    "Aujourd'hui, nous allons étudier de nouveaux vocabulaires. Veuillez prêter attention.",
    "La prononciation correcte est fondamentale en français."
  ],
  "motivational": [
    "Croyez en vous-même, vous êtes plus capable que vous ne le pensez!",
    "N'ayez pas peur d'échouer, car l'échec est le chemin vers le succès.",
    "Chaque jour est une nouvelle opportunité de grandir et d'évoluer.",
    "Persistez dans vos objectifs, car la persévérance mène au succès!",
    "Vos efforts seront récompensés. Continuez!"
  ],
  "professional": [
    "Merci d'avoir choisi nos services. Nous vous fournirons le meilleur service professionnel.",
    "Nous nous engageons à offrir des solutions de qualité à nos clients.",
    "Notre équipe possède une vaste expérience et des connaissances techniques.",
    "Vous pouvez nous faire confiance, nous nous occuperons de tous vos besoins.",
    "Nous espérons établir un partenariat durable avec vous."
  ],
  "casual": [
    "Bonjour! Comment allez-vous? Voulez-vous faire une promenade?",
    "Salut! Comment ça va? Comment s'est passée votre journée?",
    "Hé les amis! Sortons ce soir?",
    "Que diriez-vous d'aller au cinéma? Il y a un très bon film.",
    "Il y a longtemps qu'on ne s'est pas vus! Comment allez-vous?"
  ],
  "dramatic": [
    "En ce moment crucial, nous devons prendre la bonne décision!",
    "Le destin est entre nos mains. Affrontons ce défi!",
    "C'est un moment historique. Nous allons assister à quelque chose d'extraordinaire!",
    "La justice triomphe toujours de l'injustice!",
    "Unis, nous pouvons construire un avenir meilleur pour tous!"
  ],
  "calm": [
    "Respirez profondément et détendez-vous. Tout ira bien.",
    "Calmez votre esprit et trouvez la paix intérieure.",
    "Laissez les soucis s'en aller et maintenez la sérénité.",
    "Dans ce monde pressé, n'oubliez pas de prendre soin de vous.",
    "Détendez-vous et profitez des moments de tranquillité."
  ],
  "energetic": [
    "Commençons la journée avec énergie! Allons-y!",
    "Aujourd'hui est un jour spécial! Donnons le meilleur de nous-mêmes!",
    "Avec beaucoup d'enthousiasme, affrontons tous les défis!",
    "Ensemble, nous pouvons conquérir tous les objectifs!",
    "Avec détermination et force, allons de l'avant!"
  ]
} as const;

/**
 * Example usage of the Fal AI Kokoro French TTS executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic French text-to-speech generation
    const result1 = await executeKokoroFrench({
      prompt: "La seule limite à nos réalisations de demain, ce sont nos doutes d'aujourd'hui.",
      voice: "ff_siwis",
      speed: 1.0
    });

    console.log("Generated French speech URL:", result1.audio.url);

    // Example 2: Using helper function for educational content
    const educationalSpeech = createFrenchTTSScenario('educational');
    const result2 = await executeKokoroFrench(educationalSpeech);
    console.log("Educational speech:", result2.audio.url);

    // Example 3: Custom text with specific settings
    const customSpeech = createFrenchTTSScenario(
      'custom',
      "Croyez en vous-même, vous êtes plus capable que vous ne le pensez!",
      {
        voice: "ff_siwis",
        speed: 1.2
      }
    );
    const result3 = await executeKokoroFrench(customSpeech);
    console.log("Custom motivational speech:", result3.audio.url);

    // Example 4: Using predefined templates
    const result4 = await executeKokoroFrench({
      prompt: FRENCH_TEMPLATES.professional[0], // "Merci d'avoir choisi nos services. Nous vous fournirons le meilleur service professionnel."
      voice: "ff_siwis",
      speed: 1.0
    });
    console.log("Professional speech:", result4.audio.url);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeKokoroFrenchQueue({
      prompt: "Bienvenue dans notre cours de français. Aujourd'hui, nous allons apprendre la grammaire de base.",
      voice: "ff_siwis",
      speed: 0.8,
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkKokoroFrenchStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getKokoroFrenchResult(request_id);
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
 * Utility function to validate French text format
 * 
 * @param text - The text string to validate
 * @returns Validation result with suggestions
 */
export function validateFrenchTextFormat(text: string): { 
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

  // Check for French characters
  const hasFrenchCharacters = /[àâäéèêëïîôöùûüÿçÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]/.test(text);
  if (!hasFrenchCharacters && text.length > 10) {
    suggestions.push("Consider using proper French accents for better pronunciation");
  }

  // Check for proper punctuation
  const hasFrenchPunctuation = /[.!?,;:""''()]/g.test(text);
  if (!hasFrenchPunctuation) {
    suggestions.push("Consider adding French punctuation for better speech flow");
  }

  // Check for very long sentences
  const sentences = text.split(/[.!?]/);
  const longSentences = sentences.filter(sentence => sentence.trim().length > 50);
  if (longSentences.length > 0) {
    suggestions.push("Consider breaking up very long sentences for better speech flow");
  }

  // Check for mixed language content
  const hasEnglish = /[a-zA-Z]/.test(text);
  if (hasEnglish && !/[àâäéèêëïîôöùûüÿçÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]/.test(text)) {
    suggestions.push("Consider using pure French text for optimal TTS results");
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
  voice: "ff_siwis";
  speed: number;
} {
  const settingsMap = {
    educational: {
      voice: "ff_siwis" as const,
      speed: 0.8
    },
    motivational: {
      voice: "ff_siwis" as const,
      speed: 1.2
    },
    professional: {
      voice: "ff_siwis" as const,
      speed: 1.0
    },
    casual: {
      voice: "ff_siwis" as const,
      speed: 1.0
    },
    dramatic: {
      voice: "ff_siwis" as const,
      speed: 1.1
    },
    calm: {
      voice: "ff_siwis" as const,
      speed: 0.9
    },
    energetic: {
      voice: "ff_siwis" as const,
      speed: 1.3
    }
  };

  return settingsMap[contentType];
}

/**
 * Utility function to enhance French text for better speech
 * 
 * @param text - Base text to enhance
 * @param enhancements - Enhancement options
 * @returns Enhanced text
 */
export function enhanceFrenchTextForSpeech(
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
 * Utility function to generate random French text
 * 
 * @param category - Text category
 * @returns Random text from the category
 */
export function generateRandomFrenchText(category: keyof typeof FRENCH_TEMPLATES): string {
  const texts = FRENCH_TEMPLATES[category];
  const randomIndex = Math.floor(Math.random() * texts.length);
  return texts[randomIndex];
}

/**
 * Utility function to create batch French TTS generation
 * 
 * @param texts - Array of texts
 * @param options - Common options for all generations
 * @returns Array of TTS inputs
 */
export function createBatchFrenchTTSGeneration(
  texts: string[], 
  options: Partial<KokoroFrenchInput> = {}
): KokoroFrenchInput[] {
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
  const validVoices = ["ff_siwis"];
  return validVoices.includes(voice);
}

/**
 * Supported audio formats
 */
export const SUPPORTED_AUDIO_FORMATS = [
  "WAV"
] as const;

/**
 * Common French TTS generation scenarios
 */
export const FRENCH_TTS_SCENARIOS = {
  "educational": "Generate educational French speech",
  "motivational": "Create motivational French speech",
  "professional": "Generate professional French speech",
  "casual": "Create casual French speech",
  "dramatic": "Generate dramatic French speech",
  "calm": "Create calm French speech",
  "energetic": "Generate energetic French speech"
} as const;

/**
 * Voice characteristics and descriptions
 */
export const VOICE_CHARACTERISTICS = {
  "ff_siwis": "Expressive and natural female voice"
} as const;

/**
 * Voice categories
 */
export const VOICE_CATEGORIES = {
  "female_voices": ["ff_siwis"],
  "male_voices": []
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
 * French language features
 */
export const FRENCH_LANGUAGE_FEATURES = {
  "european_french": "Support for European French pronunciation and accent",
  "canadian_french": "Support for Canadian French pronunciation and accent",
  "expression_naturalness": "Expressive and natural French speech",
  "character_processing": "Proper French character processing",
  "punctuation_handling": "Natural French punctuation handling",
  "sentence_structure": "Understanding of French sentence structures",
  "emotional_expression": "Natural emotional expression in French",
  "cultural_context": "Understanding of French cultural context",
  "regional_variations": "Support for both European and Canadian French variants"
} as const;

export default executeKokoroFrench;
