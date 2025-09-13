import { fal } from "@fal-ai/client";

export interface KokoroHindiInput {
  prompt: string;
  voice: "hf_alpha" | "hf_beta" | "hm_omega" | "hm_psi";
  speed?: number;
}

export interface KokoroHindiOutput {
  audio: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

export interface KokoroHindiOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI Kokoro Hindi TTS Executor
 * 
 * A fast and expressive Hindi text-to-speech model with clear pronunciation 
 * and accurate intonation. Advanced Hindi text-to-speech generation with 
 * clear pronunciation and accurate intonation, supporting multiple voice 
 * options and speed control for high-quality Hindi speech synthesis.
 * 
 * @param input - The Hindi text-to-speech generation input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated audio result
 */
export async function executeKokoroHindi(
  input: KokoroHindiInput,
  options: KokoroHindiOptions = {}
): Promise<KokoroHindiOutput> {
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
    const result = await fal.subscribe("fal-ai/kokoro/hindi", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as KokoroHindiOutput;

  } catch (error) {
    console.error("Fal AI Kokoro Hindi TTS execution failed:", error);
    throw new Error(`Fal AI Kokoro Hindi TTS generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Fal AI Kokoro Hindi TTS with queue management for batch processing
 * 
 * @param input - The Hindi text-to-speech generation input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeKokoroHindiQueue(
  input: KokoroHindiInput,
  options: KokoroHindiOptions = {}
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
    const { request_id } = await fal.queue.submit("fal-ai/kokoro/hindi", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("Fal AI Kokoro Hindi TTS queue submission failed:", error);
    throw new Error(`Fal AI Kokoro Hindi TTS queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued Fal AI Kokoro Hindi TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkKokoroHindiStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/kokoro/hindi", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("Fal AI Kokoro Hindi TTS status check failed:", error);
    throw new Error(`Fal AI Kokoro Hindi TTS status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed Fal AI Kokoro Hindi TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated audio result
 */
export async function getKokoroHindiResult(
  requestId: string
): Promise<KokoroHindiOutput> {
  try {
    const result = await fal.queue.result("fal-ai/kokoro/hindi", {
      requestId
    });

    return result.data as KokoroHindiOutput;

  } catch (error) {
    console.error("Fal AI Kokoro Hindi TTS result retrieval failed:", error);
    throw new Error(`Fal AI Kokoro Hindi TTS result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create Hindi text-to-speech generation scenarios
 * 
 * @param type - Type of TTS generation scenario to create
 * @param customText - Custom text (optional)
 * @param customOptions - Custom options (optional)
 * @returns Kokoro Hindi TTS input configuration
 */
export function createHindiTTSScenario(
  type: 'educational' | 'motivational' | 'professional' | 'casual' | 'dramatic' | 'calm' | 'energetic' | 'custom',
  customText?: string,
  customOptions?: Partial<KokoroHindiInput>
): KokoroHindiInput {
  const scenarioTemplates = {
    educational: {
      prompt: customText || "हिंदी भाषा सीखने के लिए आपका स्वागत है। आज हम मूलभूत व्याकरण सीखेंगे।",
      voice: "hm_omega" as const,
      speed: 0.8
    },
    motivational: {
      prompt: customText || "अपने आप पर विश्वास रखें, आप जितना सोचते हैं उससे कहीं अधिक सक्षम हैं!",
      voice: "hf_beta" as const,
      speed: 1.2
    },
    professional: {
      prompt: customText || "हमारी सेवा चुनने के लिए धन्यवाद। हम आपको सर्वोत्तम पेशेवर सेवा प्रदान करेंगे।",
      voice: "hm_psi" as const,
      speed: 1.0
    },
    casual: {
      prompt: customText || "नमस्ते! आज मौसम बहुत अच्छा है, चलिए बाहर घूमने चलते हैं।",
      voice: "hf_alpha" as const,
      speed: 1.0
    },
    dramatic: {
      prompt: customText || "इस महत्वपूर्ण क्षण में, हमें सही निर्णय लेना होगा!",
      voice: "hm_omega" as const,
      speed: 1.1
    },
    calm: {
      prompt: customText || "कृपया गहरी सांस लें और मन को शांत करें। सब कुछ ठीक हो जाएगा।",
      voice: "hf_beta" as const,
      speed: 0.9
    },
    energetic: {
      prompt: customText || "आइए नई ऊर्जा के साथ नए दिन की शुरुआत करें! चलिए!",
      voice: "hf_alpha" as const,
      speed: 1.3
    },
    custom: {
      prompt: customText || "कस्टम हिंदी वॉयस जेनरेशन",
      voice: "hf_alpha" as const,
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
 * Predefined Hindi text templates for different use cases
 */
export const HINDI_TEMPLATES = {
  "educational": [
    "हिंदी भाषा सीखने के लिए आपका स्वागत है। आज हम मूलभूत व्याकरण सीखेंगे।",
    "हिंदी एक सुंदर भाषा है, आइए इसके रहस्यों का पता लगाएं।",
    "हिंदी सीखने के लिए धैर्य और अभ्यास की आवश्यकता है।",
    "आज हम नए शब्द सीखेंगे, कृपया ध्यान से सुनें।",
    "हिंदी में उच्चारण बहुत महत्वपूर्ण है, कृपया सही उच्चारण पर ध्यान दें।"
  ],
  "motivational": [
    "अपने आप पर विश्वास रखें, आप जितना सोचते हैं उससे कहीं अधिक सक्षम हैं!",
    "असफलता से डरें नहीं, क्योंकि असफलता सफलता की जननी है।",
    "हर दिन एक नई शुरुआत है, आइए सकारात्मक सोच के साथ जीवन का सामना करें।",
    "कठिनाइयां केवल अस्थायी हैं, दृढ़ता ही जीत है!",
    "आपकी मेहनत व्यर्थ नहीं जाएगी, सफलता आपका इंतजार कर रही है।"
  ],
  "professional": [
    "हमारी सेवा चुनने के लिए धन्यवाद। हम आपको सर्वोत्तम पेशेवर सेवा प्रदान करेंगे।",
    "हम ग्राहकों को सबसे संतोषजनक समाधान प्रदान करने के लिए प्रतिबद्ध हैं।",
    "हमारी टीम के पास समृद्ध अनुभव और पेशेवर ज्ञान है।",
    "कृपया निश्चिंत रहें, हम आपकी हर आवश्यकता को गंभीरता से संभालेंगे।",
    "हम आपके साथ दीर्घकालिक साझेदारी स्थापित करने की आशा करते हैं।"
  ],
  "casual": [
    "नमस्ते! आज मौसम बहुत अच्छा है, चलिए बाहर घूमने चलते हैं।",
    "कैसे हैं आप? काम ठीक चल रहा है?",
    "सप्ताहांत में क्या योजना है? हम साथ में फिल्म देख सकते हैं।",
    "इस रेस्टोरेंट का खाना बहुत स्वादिष्ट है, आप भी ट्राई करें।",
    "बहुत दिनों बाद मिले हैं, हाल ही में क्या कर रहे हैं?"
  ],
  "dramatic": [
    "इस महत्वपूर्ण क्षण में, हमें सही निर्णय लेना होगा!",
    "भाग्य हमारे अपने हाथों में है, आइए चुनौतियों का सामना करें!",
    "यह एक ऐतिहासिक क्षण है, हम चमत्कार होते हुए देखेंगे!",
    "न्याय अंत में बुराई पर विजय प्राप्त करेगा!",
    "आइए एकजुट होकर एक बेहतर भविष्य का निर्माण करें!"
  ],
  "calm": [
    "कृपया गहरी सांस लें और मन को शांत करें। सब कुछ ठीक हो जाएगा।",
    "मन को शांत करें और आंतरिक शांति का अनुभव करें।",
    "चिंताओं को हवा में उड़ने दें और मन की शांति बनाए रखें।",
    "इस व्यस्त दुनिया में, अपने लिए कुछ समय निकालना याद रखें।",
    "मन और शरीर को आराम दें और वर्तमान के सुंदर क्षणों का आनंद लें।"
  ],
  "energetic": [
    "आइए नई ऊर्जा के साथ नए दिन की शुरुआत करें! चलिए!",
    "आज एक अच्छा दिन है, आइए पूरी ताकत से काम करें!",
    "सकारात्मक ऊर्जा से भरपूर, हर चुनौती का स्वागत करें!",
    "आइए मिलकर चमत्कार करें और सपनों को साकार करें!",
    "जोश से भरपूर, आगे बढ़ते रहें!"
  ]
} as const;

/**
 * Example usage of the Fal AI Kokoro Hindi TTS executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic Hindi text-to-speech generation
    const result1 = await executeKokoroHindi({
      prompt: "सपने वो नहीं जो हम सोते समय देखते हैं, सपने वो हैं जो हमें सोने नहीं देते।",
      voice: "hf_alpha",
      speed: 1.0
    });

    console.log("Generated Hindi speech URL:", result1.audio.url);

    // Example 2: Using helper function for educational content
    const educationalSpeech = createHindiTTSScenario('educational');
    const result2 = await executeKokoroHindi(educationalSpeech);
    console.log("Educational speech:", result2.audio.url);

    // Example 3: Custom text with specific settings
    const customSpeech = createHindiTTSScenario(
      'custom',
      "अपने आप पर विश्वास रखें, आप जितना सोचते हैं उससे कहीं अधिक सक्षम हैं!",
      {
        voice: "hf_beta",
        speed: 1.2
      }
    );
    const result3 = await executeKokoroHindi(customSpeech);
    console.log("Custom motivational speech:", result3.audio.url);

    // Example 4: Using predefined templates
    const result4 = await executeKokoroHindi({
      prompt: HINDI_TEMPLATES.professional[0], // "हमारी सेवा चुनने के लिए धन्यवाद। हम आपको सर्वोत्तम पेशेवर सेवा प्रदान करेंगे।"
      voice: "hm_psi",
      speed: 1.0
    });
    console.log("Professional speech:", result4.audio.url);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeKokoroHindiQueue({
      prompt: "हिंदी भाषा सीखने के लिए आपका स्वागत है। आज हम मूलभूत व्याकरण सीखेंगे।",
      voice: "hm_omega",
      speed: 0.8,
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkKokoroHindiStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getKokoroHindiResult(request_id);
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
 * Utility function to validate Hindi text format
 * 
 * @param text - The text string to validate
 * @returns Validation result with suggestions
 */
export function validateHindiTextFormat(text: string): { 
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

  // Check for Hindi characters
  const hasHindiCharacters = /[\u0900-\u097F]/.test(text);
  if (!hasHindiCharacters) {
    suggestions.push("Text should contain Hindi characters for Hindi TTS");
  }

  // Check for proper punctuation
  const hasHindiPunctuation = /[।!?.,;:""''()]/g.test(text);
  if (!hasHindiPunctuation) {
    suggestions.push("Consider adding Hindi punctuation for better speech flow");
  }

  // Check for very long sentences
  const sentences = text.split(/[।!?]/);
  const longSentences = sentences.filter(sentence => sentence.trim().length > 50);
  if (longSentences.length > 0) {
    suggestions.push("Consider breaking up very long sentences for better speech flow");
  }

  // Check for mixed language content
  const hasEnglish = /[a-zA-Z]/.test(text);
  if (hasEnglish) {
    suggestions.push("Consider using pure Hindi text for optimal Hindi TTS results");
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
  voice: "hf_alpha" | "hf_beta" | "hm_omega" | "hm_psi";
  speed: number;
} {
  const settingsMap = {
    educational: {
      voice: "hm_omega" as const,
      speed: 0.8
    },
    motivational: {
      voice: "hf_beta" as const,
      speed: 1.2
    },
    professional: {
      voice: "hm_psi" as const,
      speed: 1.0
    },
    casual: {
      voice: "hf_alpha" as const,
      speed: 1.0
    },
    dramatic: {
      voice: "hm_omega" as const,
      speed: 1.1
    },
    calm: {
      voice: "hf_beta" as const,
      speed: 0.9
    },
    energetic: {
      voice: "hf_alpha" as const,
      speed: 1.3
    }
  };

  return settingsMap[contentType];
}

/**
 * Utility function to enhance Hindi text for better speech
 * 
 * @param text - Base text to enhance
 * @param enhancements - Enhancement options
 * @returns Enhanced text
 */
export function enhanceHindiTextForSpeech(
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
    if (!enhancedText.match(/[।!?]$/)) {
      enhancedText += "।";
    }
  }

  // Break long sentences
  if (enhancements.breakLongSentences) {
    const sentences = enhancedText.split(/[।!?]/);
    const brokenSentences = sentences.map(sentence => {
      if (sentence.trim().length > 50) {
        // Break at natural pause points
        return sentence.replace(/(,|;|:)/g, "$1\n");
      }
      return sentence;
    });
    enhancedText = brokenSentences.join("।");
  }

  // Improve flow
  if (enhancements.improveFlow) {
    enhancedText = enhancedText.replace(/\s+/g, ""); // Remove extra spaces
    enhancedText = enhancedText.replace(/([।!?.,;:])/g, "$1 "); // Add spaces after punctuation
  }

  // Add emotional context
  if (enhancements.addEmotionalContext) {
    if (!/(!|\?|।)/.test(enhancedText)) {
      enhancedText = `${enhancedText}!`;
    }
  }

  return enhancedText;
}

/**
 * Utility function to generate random Hindi text
 * 
 * @param category - Text category
 * @returns Random text from the category
 */
export function generateRandomHindiText(category: keyof typeof HINDI_TEMPLATES): string {
  const texts = HINDI_TEMPLATES[category];
  const randomIndex = Math.floor(Math.random() * texts.length);
  return texts[randomIndex];
}

/**
 * Utility function to create batch Hindi TTS generation
 * 
 * @param texts - Array of texts
 * @param options - Common options for all generations
 * @returns Array of TTS inputs
 */
export function createBatchHindiTTSGeneration(
  texts: string[], 
  options: Partial<KokoroHindiInput> = {}
): KokoroHindiInput[] {
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
  const validVoices = ["hf_alpha", "hf_beta", "hm_omega", "hm_psi"];
  return validVoices.includes(voice);
}

/**
 * Supported audio formats
 */
export const SUPPORTED_AUDIO_FORMATS = [
  "WAV"
] as const;

/**
 * Common Hindi TTS generation scenarios
 */
export const HINDI_TTS_SCENARIOS = {
  "educational": "Generate educational Hindi speech",
  "motivational": "Create motivational Hindi speech",
  "professional": "Generate professional Hindi speech",
  "casual": "Create casual Hindi speech",
  "dramatic": "Generate dramatic Hindi speech",
  "calm": "Create calm Hindi speech",
  "energetic": "Generate energetic Hindi speech"
} as const;

/**
 * Voice characteristics and descriptions
 */
export const VOICE_CHARACTERISTICS = {
  "hf_alpha": "Clear, expressive female voice",
  "hf_beta": "Warm, gentle female voice",
  "hm_omega": "Deep, authoritative male voice",
  "hm_psi": "Clear, professional male voice"
} as const;

/**
 * Voice categories
 */
export const VOICE_CATEGORIES = {
  "female_voices": ["hf_alpha", "hf_beta"],
  "male_voices": ["hm_omega", "hm_psi"]
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
 * Hindi language features
 */
export const HINDI_LANGUAGE_FEATURES = {
  "devanagari_support": "Full Devanagari script support",
  "pronunciation_accuracy": "Clear pronunciation and accurate intonation",
  "character_processing": "Proper Hindi character processing",
  "punctuation_handling": "Natural Hindi punctuation handling",
  "sentence_structure": "Understanding of Hindi sentence structures",
  "emotional_expression": "Natural emotional expression in Hindi",
  "cultural_context": "Understanding of Hindi cultural context",
  "regional_variations": "Support for standard Hindi"
} as const;

export default executeKokoroHindi;
