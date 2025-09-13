import { fal } from "@fal-ai/client";

export interface KokoroJapaneseInput {
  prompt: string;
  voice: "jf_alpha" | "jf_gongitsune" | "jf_nezumi" | "jf_tebukuro" | "jm_kumo";
  speed?: number;
}

export interface KokoroJapaneseOutput {
  audio: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

export interface KokoroJapaneseOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI Kokoro Japanese TTS Executor
 * 
 * A fast and natural-sounding Japanese text-to-speech model optimized for smooth 
 * pronunciation. Advanced Japanese text-to-speech generation with natural expression 
 * and clarity, supporting multiple voice options and speed control for high-quality 
 * Japanese speech synthesis.
 * 
 * @param input - The Japanese text-to-speech generation input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated audio result
 */
export async function executeKokoroJapanese(
  input: KokoroJapaneseInput,
  options: KokoroJapaneseOptions = {}
): Promise<KokoroJapaneseOutput> {
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
    const result = await fal.subscribe("fal-ai/kokoro/japanese", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as KokoroJapaneseOutput;

  } catch (error) {
    console.error("Fal AI Kokoro Japanese TTS execution failed:", error);
    throw new Error(`Fal AI Kokoro Japanese TTS generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Fal AI Kokoro Japanese TTS with queue management for batch processing
 * 
 * @param input - The Japanese text-to-speech generation input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeKokoroJapaneseQueue(
  input: KokoroJapaneseInput,
  options: KokoroJapaneseOptions = {}
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
    const { request_id } = await fal.queue.submit("fal-ai/kokoro/japanese", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("Fal AI Kokoro Japanese TTS queue submission failed:", error);
    throw new Error(`Fal AI Kokoro Japanese TTS queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued Fal AI Kokoro Japanese TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkKokoroJapaneseStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/kokoro/japanese", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("Fal AI Kokoro Japanese TTS status check failed:", error);
    throw new Error(`Fal AI Kokoro Japanese TTS status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed Fal AI Kokoro Japanese TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated audio result
 */
export async function getKokoroJapaneseResult(
  requestId: string
): Promise<KokoroJapaneseOutput> {
  try {
    const result = await fal.queue.result("fal-ai/kokoro/japanese", {
      requestId
    });

    return result.data as KokoroJapaneseOutput;

  } catch (error) {
    console.error("Fal AI Kokoro Japanese TTS result retrieval failed:", error);
    throw new Error(`Fal AI Kokoro Japanese TTS result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create Japanese text-to-speech generation scenarios
 * 
 * @param type - Type of TTS generation scenario to create
 * @param customText - Custom text (optional)
 * @param customOptions - Custom options (optional)
 * @returns Kokoro Japanese TTS input configuration
 */
export function createJapaneseTTSScenario(
  type: 'educational' | 'motivational' | 'professional' | 'casual' | 'dramatic' | 'calm' | 'energetic' | 'custom',
  customText?: string,
  customOptions?: Partial<KokoroJapaneseInput>
): KokoroJapaneseInput {
  const scenarioTemplates = {
    educational: {
      prompt: customText || "こんにちは。今日は日本語の勉強をしましょう。",
      voice: "jf_alpha" as const,
      speed: 0.8
    },
    motivational: {
      prompt: customText || "頑張って！あなたならできる！",
      voice: "jf_alpha" as const,
      speed: 1.2
    },
    professional: {
      prompt: customText || "お疲れ様です。本日はありがとうございました。",
      voice: "jf_alpha" as const,
      speed: 1.0
    },
    casual: {
      prompt: customText || "こんにちは！元気ですか？",
      voice: "jf_alpha" as const,
      speed: 1.0
    },
    dramatic: {
      prompt: customText || "この瞬間が運命を決める！",
      voice: "jf_alpha" as const,
      speed: 1.1
    },
    calm: {
      prompt: customText || "深呼吸をして、リラックスしてください。",
      voice: "jf_alpha" as const,
      speed: 0.9
    },
    energetic: {
      prompt: customText || "今日も一日頑張りましょう！",
      voice: "jf_alpha" as const,
      speed: 1.3
    },
    custom: {
      prompt: customText || "カスタム日本語音声生成",
      voice: "jf_alpha" as const,
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
 * Predefined Japanese text templates for different use cases
 */
export const JAPANESE_TEMPLATES = {
  "educational": [
    "こんにちは。今日は日本語の勉強をしましょう。",
    "日本語は美しい言語です。一緒に学びましょう。",
    "ひらがな、カタカナ、漢字を覚えましょう。",
    "今日は新しい単語を勉強します。",
    "正しい発音が大切です。"
  ],
  "motivational": [
    "頑張って！あなたならできる！",
    "失敗を恐れずに挑戦しましょう。",
    "毎日が新しいチャンスです。",
    "目標に向かって努力を続けましょう！",
    "あなたの努力は必ず報われます。"
  ],
  "professional": [
    "お疲れ様です。本日はありがとうございました。",
    "私たちは最高のサービスを提供いたします。",
    "経験豊富なチームがサポートいたします。",
    "お客様のニーズにお応えします。",
    "長期的なパートナーシップを築きましょう。"
  ],
  "casual": [
    "こんにちは！元気ですか？",
    "やあ！調子はどう？",
    "みんな、今晩出かけない？",
    "映画を見に行かない？面白い映画があるよ。",
    "久しぶり！元気だった？"
  ],
  "dramatic": [
    "この瞬間が運命を決める！",
    "運命は私たちの手の中にある。",
    "歴史的な瞬間です。",
    "正義は必ず勝利する！",
    "団結すれば、より良い未来を築ける！"
  ],
  "calm": [
    "深呼吸をして、リラックスしてください。",
    "心を落ち着けて、内なる平和を見つけましょう。",
    "心配事を手放して、静寂を保ちましょう。",
    "忙しい世界でも、自分を大切にしてください。",
    "リラックスして、静かな時間を楽しみましょう。"
  ],
  "energetic": [
    "今日も一日頑張りましょう！",
    "今日は特別な日！ベストを尽くそう！",
    "熱意を持って、すべての挑戦に立ち向かおう！",
    "一緒に目標を達成しよう！",
    "決意と力で前進しよう！"
  ]
} as const;

/**
 * Example usage of the Fal AI Kokoro Japanese TTS executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic Japanese text-to-speech generation
    const result1 = await executeKokoroJapanese({
      prompt: "夢を追いかけることを恐れないでください。努力すれば、必ず道は開けます！",
      voice: "jf_alpha",
      speed: 1.0
    });

    console.log("Generated Japanese speech URL:", result1.audio.url);

    // Example 2: Using helper function for educational content
    const educationalSpeech = createJapaneseTTSScenario('educational');
    const result2 = await executeKokoroJapanese(educationalSpeech);
    console.log("Educational speech:", result2.audio.url);

    // Example 3: Custom text with specific settings
    const customSpeech = createJapaneseTTSScenario(
      'custom',
      "頑張って！あなたならできる！",
      {
        voice: "jf_alpha",
        speed: 1.2
      }
    );
    const result3 = await executeKokoroJapanese(customSpeech);
    console.log("Custom motivational speech:", result3.audio.url);

    // Example 4: Using predefined templates
    const result4 = await executeKokoroJapanese({
      prompt: JAPANESE_TEMPLATES.professional[0], // "お疲れ様です。本日はありがとうございました。"
      voice: "jf_alpha",
      speed: 1.0
    });
    console.log("Professional speech:", result4.audio.url);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeKokoroJapaneseQueue({
      prompt: "こんにちは。今日は日本語の勉強をしましょう。",
      voice: "jf_alpha",
      speed: 0.8,
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkKokoroJapaneseStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getKokoroJapaneseResult(request_id);
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
 * Utility function to validate Japanese text format
 * 
 * @param text - The text string to validate
 * @returns Validation result with suggestions
 */
export function validateJapaneseTextFormat(text: string): { 
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

  // Check for Japanese characters
  const hasJapaneseCharacters = /[ひらがなカタカナ一-龯]/.test(text);
  if (!hasJapaneseCharacters && text.length > 10) {
    suggestions.push("Consider using proper Japanese characters for better pronunciation");
  }

  // Check for proper punctuation
  const hasJapanesePunctuation = /[。！？、]/.test(text);
  if (!hasJapanesePunctuation) {
    suggestions.push("Consider adding Japanese punctuation for better speech flow");
  }

  // Check for very long sentences
  const sentences = text.split(/[。！？]/);
  const longSentences = sentences.filter(sentence => sentence.trim().length > 50);
  if (longSentences.length > 0) {
    suggestions.push("Consider breaking up very long sentences for better speech flow");
  }

  // Check for mixed language content
  const hasEnglish = /[a-zA-Z]/.test(text);
  if (hasEnglish && !/[ひらがなカタカナ一-龯]/.test(text)) {
    suggestions.push("Consider using pure Japanese text for optimal TTS results");
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
  voice: "jf_alpha" | "jf_gongitsune" | "jf_nezumi" | "jf_tebukuro" | "jm_kumo";
  speed: number;
} {
  const settingsMap = {
    educational: {
      voice: "jf_alpha" as const,
      speed: 0.8
    },
    motivational: {
      voice: "jf_alpha" as const,
      speed: 1.2
    },
    professional: {
      voice: "jf_alpha" as const,
      speed: 1.0
    },
    casual: {
      voice: "jf_alpha" as const,
      speed: 1.0
    },
    dramatic: {
      voice: "jf_alpha" as const,
      speed: 1.1
    },
    calm: {
      voice: "jf_alpha" as const,
      speed: 0.9
    },
    energetic: {
      voice: "jf_alpha" as const,
      speed: 1.3
    }
  };

  return settingsMap[contentType];
}

/**
 * Utility function to enhance Japanese text for better speech
 * 
 * @param text - Base text to enhance
 * @param enhancements - Enhancement options
 * @returns Enhanced text
 */
export function enhanceJapaneseTextForSpeech(
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
    if (!enhancedText.match(/[。！？]$/)) {
      enhancedText += "。";
    }
  }

  // Break long sentences
  if (enhancements.breakLongSentences) {
    const sentences = enhancedText.split(/[。！？]/);
    const brokenSentences = sentences.map(sentence => {
      if (sentence.trim().length > 50) {
        // Break at natural pause points
        return sentence.replace(/(、|；|：)/g, "$1\n");
      }
      return sentence;
    });
    enhancedText = brokenSentences.join("。");
  }

  // Improve flow
  if (enhancements.improveFlow) {
    enhancedText = enhancedText.replace(/\s+/g, " "); // Normalize spaces
    enhancedText = enhancedText.replace(/([。！？、；：])/g, "$1 "); // Add spaces after punctuation
  }

  // Add emotional context
  if (enhancements.addEmotionalContext) {
    if (!/(！|？|。)/.test(enhancedText)) {
      enhancedText = `${enhancedText}！`;
    }
  }

  return enhancedText;
}

/**
 * Utility function to generate random Japanese text
 * 
 * @param category - Text category
 * @returns Random text from the category
 */
export function generateRandomJapaneseText(category: keyof typeof JAPANESE_TEMPLATES): string {
  const texts = JAPANESE_TEMPLATES[category];
  const randomIndex = Math.floor(Math.random() * texts.length);
  return texts[randomIndex];
}

/**
 * Utility function to create batch Japanese TTS generation
 * 
 * @param texts - Array of texts
 * @param options - Common options for all generations
 * @returns Array of TTS inputs
 */
export function createBatchJapaneseTTSGeneration(
  texts: string[], 
  options: Partial<KokoroJapaneseInput> = {}
): KokoroJapaneseInput[] {
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
  const validVoices = ["jf_alpha", "jf_gongitsune", "jf_nezumi", "jf_tebukuro", "jm_kumo"];
  return validVoices.includes(voice);
}

/**
 * Supported audio formats
 */
export const SUPPORTED_AUDIO_FORMATS = [
  "WAV"
] as const;

/**
 * Common Japanese TTS generation scenarios
 */
export const JAPANESE_TTS_SCENARIOS = {
  "educational": "Generate educational Japanese speech",
  "motivational": "Create motivational Japanese speech",
  "professional": "Generate professional Japanese speech",
  "casual": "Create casual Japanese speech",
  "dramatic": "Generate dramatic Japanese speech",
  "calm": "Create calm Japanese speech",
  "energetic": "Generate energetic Japanese speech"
} as const;

/**
 * Voice characteristics and descriptions
 */
export const VOICE_CHARACTERISTICS = {
  "jf_alpha": "Natural and clear female voice",
  "jf_gongitsune": "Expressive and warm female voice",
  "jf_nezumi": "Soft and gentle female voice",
  "jf_tebukuro": "Energetic and lively female voice",
  "jm_kumo": "Deep and authoritative male voice"
} as const;

/**
 * Voice categories
 */
export const VOICE_CATEGORIES = {
  "female_voices": ["jf_alpha", "jf_gongitsune", "jf_nezumi", "jf_tebukuro"],
  "male_voices": ["jm_kumo"]
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
 * Japanese language features
 */
export const JAPANESE_LANGUAGE_FEATURES = {
  "hiragana_katakana": "Support for Hiragana and Katakana characters",
  "kanji_processing": "Advanced Kanji character processing",
  "pitch_accent": "Natural Japanese pitch accent patterns",
  "pronunciation_accuracy": "Smooth and accurate Japanese pronunciation",
  "character_processing": "Proper Japanese character processing",
  "punctuation_handling": "Natural Japanese punctuation handling",
  "sentence_structure": "Understanding of Japanese sentence structures",
  "emotional_expression": "Natural emotional expression in Japanese",
  "cultural_context": "Understanding of Japanese cultural context",
  "honorifics": "Support for Japanese honorifics and politeness levels"
} as const;

export default executeKokoroJapanese;
