import { fal } from "@fal-ai/client";

export interface KokoroBrazilianPortugueseInput {
  prompt: string;
  voice: "pf_dora" | "pm_alex" | "pm_santa";
  speed?: number;
}

export interface KokoroBrazilianPortugueseOutput {
  audio: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

export interface KokoroBrazilianPortugueseOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI Kokoro Brazilian Portuguese TTS Executor
 * 
 * A natural and expressive Brazilian Portuguese text-to-speech model optimized 
 * for clarity and fluency. Advanced Brazilian Portuguese text-to-speech generation 
 * with natural expression and clarity, supporting multiple voice options and speed 
 * control for high-quality Brazilian Portuguese speech synthesis.
 * 
 * @param input - The Brazilian Portuguese text-to-speech generation input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated audio result
 */
export async function executeKokoroBrazilianPortuguese(
  input: KokoroBrazilianPortugueseInput,
  options: KokoroBrazilianPortugueseOptions = {}
): Promise<KokoroBrazilianPortugueseOutput> {
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
    const result = await fal.subscribe("fal-ai/kokoro/brazilian-portuguese", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as KokoroBrazilianPortugueseOutput;

  } catch (error) {
    console.error("Fal AI Kokoro Brazilian Portuguese TTS execution failed:", error);
    throw new Error(`Fal AI Kokoro Brazilian Portuguese TTS generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Fal AI Kokoro Brazilian Portuguese TTS with queue management for batch processing
 * 
 * @param input - The Brazilian Portuguese text-to-speech generation input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeKokoroBrazilianPortugueseQueue(
  input: KokoroBrazilianPortugueseInput,
  options: KokoroBrazilianPortugueseOptions = {}
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
    const { request_id } = await fal.queue.submit("fal-ai/kokoro/brazilian-portuguese", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("Fal AI Kokoro Brazilian Portuguese TTS queue submission failed:", error);
    throw new Error(`Fal AI Kokoro Brazilian Portuguese TTS queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued Fal AI Kokoro Brazilian Portuguese TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkKokoroBrazilianPortugueseStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/kokoro/brazilian-portuguese", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("Fal AI Kokoro Brazilian Portuguese TTS status check failed:", error);
    throw new Error(`Fal AI Kokoro Brazilian Portuguese TTS status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed Fal AI Kokoro Brazilian Portuguese TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated audio result
 */
export async function getKokoroBrazilianPortugueseResult(
  requestId: string
): Promise<KokoroBrazilianPortugueseOutput> {
  try {
    const result = await fal.queue.result("fal-ai/kokoro/brazilian-portuguese", {
      requestId
    });

    return result.data as KokoroBrazilianPortugueseOutput;

  } catch (error) {
    console.error("Fal AI Kokoro Brazilian Portuguese TTS result retrieval failed:", error);
    throw new Error(`Fal AI Kokoro Brazilian Portuguese TTS result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create Brazilian Portuguese text-to-speech generation scenarios
 * 
 * @param type - Type of TTS generation scenario to create
 * @param customText - Custom text (optional)
 * @param customOptions - Custom options (optional)
 * @returns Kokoro Brazilian Portuguese TTS input configuration
 */
export function createBrazilianPortugueseTTSScenario(
  type: 'educational' | 'motivational' | 'professional' | 'casual' | 'dramatic' | 'calm' | 'energetic' | 'custom',
  customText?: string,
  customOptions?: Partial<KokoroBrazilianPortugueseInput>
): KokoroBrazilianPortugueseInput {
  const scenarioTemplates = {
    educational: {
      prompt: customText || "Bem-vindos ao nosso curso de português brasileiro. Hoje vamos aprender gramática básica.",
      voice: "pm_alex" as const,
      speed: 0.8
    },
    motivational: {
      prompt: customText || "Acredite em si mesmo, você é mais capaz do que imagina!",
      voice: "pf_dora" as const,
      speed: 1.2
    },
    professional: {
      prompt: customText || "Obrigado por escolher nossos serviços. Forneceremos o melhor atendimento profissional.",
      voice: "pm_alex" as const,
      speed: 1.0
    },
    casual: {
      prompt: customText || "Olá! Como você está? Que tal irmos dar uma volta?",
      voice: "pf_dora" as const,
      speed: 1.0
    },
    dramatic: {
      prompt: customText || "Neste momento crucial, devemos tomar a decisão certa!",
      voice: "pm_santa" as const,
      speed: 1.1
    },
    calm: {
      prompt: customText || "Respire fundo e relaxe. Tudo vai ficar bem.",
      voice: "pf_dora" as const,
      speed: 0.9
    },
    energetic: {
      prompt: customText || "Vamos começar o dia com energia! Vamos lá!",
      voice: "pm_santa" as const,
      speed: 1.3
    },
    custom: {
      prompt: customText || "Geração de voz personalizada em português brasileiro",
      voice: "pf_dora" as const,
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
 * Predefined Brazilian Portuguese text templates for different use cases
 */
export const BRAZILIAN_PORTUGUESE_TEMPLATES = {
  "educational": [
    "Bem-vindos ao nosso curso de português brasileiro. Hoje vamos aprender gramática básica.",
    "O português brasileiro é uma língua rica e expressiva. Vamos explorar suas nuances.",
    "Para aprender português, é necessário paciência e prática constante.",
    "Hoje vamos estudar novos vocábulos. Prestem atenção, por favor.",
    "A pronúncia correta é fundamental no português brasileiro."
  ],
  "motivational": [
    "Acredite em si mesmo, você é mais capaz do que imagina!",
    "Não tenha medo de falhar, pois o fracasso é o caminho para o sucesso.",
    "Cada dia é uma nova oportunidade de crescer e evoluir.",
    "Persista nos seus objetivos, pois a persistência leva ao sucesso!",
    "Seus esforços serão recompensados. Continue em frente!"
  ],
  "professional": [
    "Obrigado por escolher nossos serviços. Forneceremos o melhor atendimento profissional.",
    "Estamos comprometidos em oferecer soluções de qualidade para nossos clientes.",
    "Nossa equipe possui vasta experiência e conhecimento técnico.",
    "Pode confiar em nós, cuidaremos de todas as suas necessidades.",
    "Esperamos estabelecer uma parceria duradoura com vocês."
  ],
  "casual": [
    "Olá! Como você está? Que tal irmos dar uma volta?",
    "Oi! Tudo bem? Como foi o seu dia?",
    "E aí, pessoal! Vamos sair hoje à noite?",
    "Que tal irmos ao cinema? Tem um filme muito bom passando.",
    "Faz tempo que não nos vemos! Como você tem passado?"
  ],
  "dramatic": [
    "Neste momento crucial, devemos tomar a decisão certa!",
    "O destino está em nossas mãos. Vamos enfrentar este desafio!",
    "Este é um momento histórico. Vamos testemunhar algo extraordinário!",
    "A justiça sempre prevalece sobre a injustiça!",
    "Unidos, podemos construir um futuro melhor para todos!"
  ],
  "calm": [
    "Respire fundo e relaxe. Tudo vai ficar bem.",
    "Acalme sua mente e encontre a paz interior.",
    "Deixe as preocupações irem embora e mantenha a serenidade.",
    "Neste mundo corrido, lembre-se de cuidar de si mesmo.",
    "Relaxe e aproveite os momentos de tranquilidade."
  ],
  "energetic": [
    "Vamos começar o dia com energia! Vamos lá!",
    "Hoje é um dia especial! Vamos dar o nosso melhor!",
    "Com muito entusiasmo, vamos enfrentar qualquer desafio!",
    "Juntos, podemos conquistar qualquer objetivo!",
    "Com determinação e força, vamos em frente!"
  ]
} as const;

/**
 * Example usage of the Fal AI Kokoro Brazilian Portuguese TTS executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic Brazilian Portuguese text-to-speech generation
    const result1 = await executeKokoroBrazilianPortuguese({
      prompt: "O segredo do sucesso é a persistência. Nunca desista dos seus sonhos!",
      voice: "pf_dora",
      speed: 1.0
    });

    console.log("Generated Brazilian Portuguese speech URL:", result1.audio.url);

    // Example 2: Using helper function for educational content
    const educationalSpeech = createBrazilianPortugueseTTSScenario('educational');
    const result2 = await executeKokoroBrazilianPortuguese(educationalSpeech);
    console.log("Educational speech:", result2.audio.url);

    // Example 3: Custom text with specific settings
    const customSpeech = createBrazilianPortugueseTTSScenario(
      'custom',
      "Acredite em si mesmo, você é mais capaz do que imagina!",
      {
        voice: "pf_dora",
        speed: 1.2
      }
    );
    const result3 = await executeKokoroBrazilianPortuguese(customSpeech);
    console.log("Custom motivational speech:", result3.audio.url);

    // Example 4: Using predefined templates
    const result4 = await executeKokoroBrazilianPortuguese({
      prompt: BRAZILIAN_PORTUGUESE_TEMPLATES.professional[0], // "Obrigado por escolher nossos serviços. Forneceremos o melhor atendimento profissional."
      voice: "pm_alex",
      speed: 1.0
    });
    console.log("Professional speech:", result4.audio.url);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeKokoroBrazilianPortugueseQueue({
      prompt: "Bem-vindos ao nosso curso de português brasileiro. Hoje vamos aprender gramática básica.",
      voice: "pm_alex",
      speed: 0.8,
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkKokoroBrazilianPortugueseStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getKokoroBrazilianPortugueseResult(request_id);
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
 * Utility function to validate Brazilian Portuguese text format
 * 
 * @param text - The text string to validate
 * @returns Validation result with suggestions
 */
export function validateBrazilianPortugueseTextFormat(text: string): { 
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

  // Check for Portuguese characters
  const hasPortugueseCharacters = /[áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(text);
  if (!hasPortugueseCharacters && text.length > 10) {
    suggestions.push("Consider using proper Portuguese accents for better pronunciation");
  }

  // Check for proper punctuation
  const hasPortuguesePunctuation = /[.!?,;:""''()]/g.test(text);
  if (!hasPortuguesePunctuation) {
    suggestions.push("Consider adding Portuguese punctuation for better speech flow");
  }

  // Check for very long sentences
  const sentences = text.split(/[.!?]/);
  const longSentences = sentences.filter(sentence => sentence.trim().length > 50);
  if (longSentences.length > 0) {
    suggestions.push("Consider breaking up very long sentences for better speech flow");
  }

  // Check for mixed language content
  const hasEnglish = /[a-zA-Z]/.test(text);
  if (hasEnglish && !/[áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(text)) {
    suggestions.push("Consider using pure Brazilian Portuguese text for optimal TTS results");
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
  voice: "pf_dora" | "pm_alex" | "pm_santa";
  speed: number;
} {
  const settingsMap = {
    educational: {
      voice: "pm_alex" as const,
      speed: 0.8
    },
    motivational: {
      voice: "pf_dora" as const,
      speed: 1.2
    },
    professional: {
      voice: "pm_alex" as const,
      speed: 1.0
    },
    casual: {
      voice: "pf_dora" as const,
      speed: 1.0
    },
    dramatic: {
      voice: "pm_santa" as const,
      speed: 1.1
    },
    calm: {
      voice: "pf_dora" as const,
      speed: 0.9
    },
    energetic: {
      voice: "pm_santa" as const,
      speed: 1.3
    }
  };

  return settingsMap[contentType];
}

/**
 * Utility function to enhance Brazilian Portuguese text for better speech
 * 
 * @param text - Base text to enhance
 * @param enhancements - Enhancement options
 * @returns Enhanced text
 */
export function enhanceBrazilianPortugueseTextForSpeech(
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
 * Utility function to generate random Brazilian Portuguese text
 * 
 * @param category - Text category
 * @returns Random text from the category
 */
export function generateRandomBrazilianPortugueseText(category: keyof typeof BRAZILIAN_PORTUGUESE_TEMPLATES): string {
  const texts = BRAZILIAN_PORTUGUESE_TEMPLATES[category];
  const randomIndex = Math.floor(Math.random() * texts.length);
  return texts[randomIndex];
}

/**
 * Utility function to create batch Brazilian Portuguese TTS generation
 * 
 * @param texts - Array of texts
 * @param options - Common options for all generations
 * @returns Array of TTS inputs
 */
export function createBatchBrazilianPortugueseTTSGeneration(
  texts: string[], 
  options: Partial<KokoroBrazilianPortugueseInput> = {}
): KokoroBrazilianPortugueseInput[] {
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
  const validVoices = ["pf_dora", "pm_alex", "pm_santa"];
  return validVoices.includes(voice);
}

/**
 * Supported audio formats
 */
export const SUPPORTED_AUDIO_FORMATS = [
  "WAV"
] as const;

/**
 * Common Brazilian Portuguese TTS generation scenarios
 */
export const BRAZILIAN_PORTUGUESE_TTS_SCENARIOS = {
  "educational": "Generate educational Brazilian Portuguese speech",
  "motivational": "Create motivational Brazilian Portuguese speech",
  "professional": "Generate professional Brazilian Portuguese speech",
  "casual": "Create casual Brazilian Portuguese speech",
  "dramatic": "Generate dramatic Brazilian Portuguese speech",
  "calm": "Create calm Brazilian Portuguese speech",
  "energetic": "Generate energetic Brazilian Portuguese speech"
} as const;

/**
 * Voice characteristics and descriptions
 */
export const VOICE_CHARACTERISTICS = {
  "pf_dora": "Clear, expressive female voice",
  "pm_alex": "Professional, clear male voice",
  "pm_santa": "Warm, friendly male voice"
} as const;

/**
 * Voice categories
 */
export const VOICE_CATEGORIES = {
  "female_voices": ["pf_dora"],
  "male_voices": ["pm_alex", "pm_santa"]
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
 * Brazilian Portuguese language features
 */
export const BRAZILIAN_PORTUGUESE_LANGUAGE_FEATURES = {
  "brazilian_accent": "Authentic Brazilian Portuguese accent and pronunciation",
  "expression_naturalness": "Natural and expressive Brazilian Portuguese speech",
  "character_processing": "Proper Brazilian Portuguese character processing",
  "punctuation_handling": "Natural Brazilian Portuguese punctuation handling",
  "sentence_structure": "Understanding of Brazilian Portuguese sentence structures",
  "emotional_expression": "Natural emotional expression in Brazilian Portuguese",
  "cultural_context": "Understanding of Brazilian Portuguese cultural context",
  "regional_variations": "Support for standard Brazilian Portuguese"
} as const;

export default executeKokoroBrazilianPortuguese;
