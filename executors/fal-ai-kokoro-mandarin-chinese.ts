import { fal } from "@fal-ai/client";

export interface KokoroMandarinChineseInput {
  prompt: string;
  voice: 
    | "zf_xiaobei" | "zf_xiaoni" | "zf_xiaoxiao" | "zf_xiaoyi" 
    | "zm_yunjian" | "zm_yunxi" | "zm_yunxia" | "zm_yunyang";
  speed?: number;
}

export interface KokoroMandarinChineseOutput {
  audio: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

export interface KokoroMandarinChineseOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI Kokoro Mandarin Chinese TTS Executor
 * 
 * A highly efficient Mandarin Chinese text-to-speech model that captures 
 * natural tones and prosody. Advanced Mandarin Chinese text-to-speech 
 * generation with natural tone and prosody capture, supporting multiple 
 * voice options and speed control for high-quality Chinese speech synthesis.
 * 
 * @param input - The Mandarin Chinese text-to-speech generation input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated audio result
 */
export async function executeKokoroMandarinChinese(
  input: KokoroMandarinChineseInput,
  options: KokoroMandarinChineseOptions = {}
): Promise<KokoroMandarinChineseOutput> {
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
    const result = await fal.subscribe("fal-ai/kokoro/mandarin-chinese", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as KokoroMandarinChineseOutput;

  } catch (error) {
    console.error("Fal AI Kokoro Mandarin Chinese TTS execution failed:", error);
    throw new Error(`Fal AI Kokoro Mandarin Chinese TTS generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Fal AI Kokoro Mandarin Chinese TTS with queue management for batch processing
 * 
 * @param input - The Mandarin Chinese text-to-speech generation input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeKokoroMandarinChineseQueue(
  input: KokoroMandarinChineseInput,
  options: KokoroMandarinChineseOptions = {}
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
    const { request_id } = await fal.queue.submit("fal-ai/kokoro/mandarin-chinese", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("Fal AI Kokoro Mandarin Chinese TTS queue submission failed:", error);
    throw new Error(`Fal AI Kokoro Mandarin Chinese TTS queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued Fal AI Kokoro Mandarin Chinese TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkKokoroMandarinChineseStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/kokoro/mandarin-chinese", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("Fal AI Kokoro Mandarin Chinese TTS status check failed:", error);
    throw new Error(`Fal AI Kokoro Mandarin Chinese TTS status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed Fal AI Kokoro Mandarin Chinese TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated audio result
 */
export async function getKokoroMandarinChineseResult(
  requestId: string
): Promise<KokoroMandarinChineseOutput> {
  try {
    const result = await fal.queue.result("fal-ai/kokoro/mandarin-chinese", {
      requestId
    });

    return result.data as KokoroMandarinChineseOutput;

  } catch (error) {
    console.error("Fal AI Kokoro Mandarin Chinese TTS result retrieval failed:", error);
    throw new Error(`Fal AI Kokoro Mandarin Chinese TTS result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create Mandarin Chinese text-to-speech generation scenarios
 * 
 * @param type - Type of TTS generation scenario to create
 * @param customText - Custom text (optional)
 * @param customOptions - Custom options (optional)
 * @returns Kokoro Mandarin Chinese TTS input configuration
 */
export function createMandarinChineseTTSScenario(
  type: 'educational' | 'motivational' | 'professional' | 'casual' | 'dramatic' | 'calm' | 'energetic' | 'custom',
  customText?: string,
  customOptions?: Partial<KokoroMandarinChineseInput>
): KokoroMandarinChineseInput {
  const scenarioTemplates = {
    educational: {
      prompt: customText || "欢迎来到我们的中文学习课程。今天我们将学习基础的中文语法。",
      voice: "zm_yunxi" as const,
      speed: 0.8
    },
    motivational: {
      prompt: customText || "相信自己，你比你想象的更强大！每一个挑战都是成长的机会。",
      voice: "zf_xiaoyi" as const,
      speed: 1.2
    },
    professional: {
      prompt: customText || "感谢您选择我们的服务。我们将为您提供最优质的专业服务。",
      voice: "zm_yunjian" as const,
      speed: 1.0
    },
    casual: {
      prompt: customText || "你好！今天天气真不错，我们一起出去走走吧。",
      voice: "zf_xiaobei" as const,
      speed: 1.0
    },
    dramatic: {
      prompt: customText || "在这个关键时刻，我们必须做出正确的选择！",
      voice: "zm_yunyang" as const,
      speed: 1.1
    },
    calm: {
      prompt: customText || "请深呼吸，放松心情。一切都会好起来的。",
      voice: "zf_xiaoni" as const,
      speed: 0.9
    },
    energetic: {
      prompt: customText || "让我们充满活力地开始新的一天！加油！",
      voice: "zf_xiaoxiao" as const,
      speed: 1.3
    },
    custom: {
      prompt: customText || "自定义中文语音生成",
      voice: "zf_xiaobei" as const,
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
 * Predefined Mandarin Chinese text templates for different use cases
 */
export const MANDARIN_CHINESE_TEMPLATES = {
  "educational": [
    "欢迎来到我们的中文学习课程。今天我们将学习基础的中文语法。",
    "中文是一门美丽的语言，让我们一起来探索它的奥秘。",
    "学习中文需要耐心和练习，但结果一定会让你满意。",
    "今天我们要学习新的汉字，请大家认真听讲。",
    "中文的声调很重要，请大家注意发音的准确性。"
  ],
  "motivational": [
    "相信自己，你比你想象的更强大！每一个挑战都是成长的机会。",
    "不要害怕失败，因为失败是成功之母。继续努力，你会成功的！",
    "每一天都是新的开始，让我们用积极的心态面对生活。",
    "困难只是暂时的，坚持就是胜利！",
    "你的努力不会被辜负，成功就在前方等待着你。"
  ],
  "professional": [
    "感谢您选择我们的服务。我们将为您提供最优质的专业服务。",
    "我们致力于为客户提供最满意的解决方案。",
    "我们的团队拥有丰富的经验和专业的知识。",
    "请放心，我们会认真处理您的每一个需求。",
    "我们期待与您建立长期的合作关系。"
  ],
  "casual": [
    "你好！今天天气真不错，我们一起出去走走吧。",
    "最近怎么样？工作还顺利吗？",
    "周末有什么计划吗？我们可以一起去看电影。",
    "这家餐厅的菜很好吃，推荐你试试。",
    "好久不见了，最近在忙什么呢？"
  ],
  "dramatic": [
    "在这个关键时刻，我们必须做出正确的选择！",
    "命运掌握在我们自己手中，让我们勇敢地面对挑战！",
    "这是一个历史性的时刻，我们将见证奇迹的发生！",
    "正义终将战胜邪恶，光明终将驱散黑暗！",
    "让我们团结一致，共同创造美好的未来！"
  ],
  "calm": [
    "请深呼吸，放松心情。一切都会好起来的。",
    "静下心来，感受内心的平静与安宁。",
    "让烦恼随风而去，保持内心的宁静。",
    "在这个忙碌的世界里，记得给自己一些时间。",
    "放松身心，享受当下的美好时光。"
  ],
  "energetic": [
    "让我们充满活力地开始新的一天！加油！",
    "今天是个好日子，让我们全力以赴！",
    "充满正能量，迎接每一个挑战！",
    "让我们一起创造奇迹，实现梦想！",
    "激情四射，勇往直前！"
  ]
} as const;

/**
 * Example usage of the Fal AI Kokoro Mandarin Chinese TTS executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic Mandarin Chinese text-to-speech generation
    const result1 = await executeKokoroMandarinChinese({
      prompt: "每一个伟大的旅程，都始于勇敢迈出的第一步。加油，你可以做到！",
      voice: "zf_xiaobei",
      speed: 1.0
    });

    console.log("Generated Mandarin Chinese speech URL:", result1.audio.url);

    // Example 2: Using helper function for educational content
    const educationalSpeech = createMandarinChineseTTSScenario('educational');
    const result2 = await executeKokoroMandarinChinese(educationalSpeech);
    console.log("Educational speech:", result2.audio.url);

    // Example 3: Custom text with specific settings
    const customSpeech = createMandarinChineseTTSScenario(
      'custom',
      "相信自己，你比你想象的更强大！每一个挑战都是成长的机会。",
      {
        voice: "zf_xiaoyi",
        speed: 1.2
      }
    );
    const result3 = await executeKokoroMandarinChinese(customSpeech);
    console.log("Custom motivational speech:", result3.audio.url);

    // Example 4: Using predefined templates
    const result4 = await executeKokoroMandarinChinese({
      prompt: MANDARIN_CHINESE_TEMPLATES.professional[0], // "感谢您选择我们的服务。我们将为您提供最优质的专业服务。"
      voice: "zm_yunjian",
      speed: 1.0
    });
    console.log("Professional speech:", result4.audio.url);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeKokoroMandarinChineseQueue({
      prompt: "欢迎来到我们的中文学习课程。今天我们将学习基础的中文语法。",
      voice: "zm_yunxi",
      speed: 0.8,
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkKokoroMandarinChineseStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getKokoroMandarinChineseResult(request_id);
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
 * Utility function to validate Mandarin Chinese text format
 * 
 * @param text - The text string to validate
 * @returns Validation result with suggestions
 */
export function validateMandarinChineseTextFormat(text: string): { 
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

  // Check for Chinese characters
  const hasChineseCharacters = /[\u4e00-\u9fff]/.test(text);
  if (!hasChineseCharacters) {
    suggestions.push("Text should contain Chinese characters for Mandarin Chinese TTS");
  }

  // Check for proper punctuation
  const hasChinesePunctuation = /[。！？，、；：""''（）【】]/.test(text);
  if (!hasChinesePunctuation) {
    suggestions.push("Consider adding Chinese punctuation for better speech flow");
  }

  // Check for very long sentences
  const sentences = text.split(/[。！？]/);
  const longSentences = sentences.filter(sentence => sentence.trim().length > 50);
  if (longSentences.length > 0) {
    suggestions.push("Consider breaking up very long sentences for better speech flow");
  }

  // Check for mixed language content
  const hasEnglish = /[a-zA-Z]/.test(text);
  if (hasEnglish) {
    suggestions.push("Consider using pure Chinese text for optimal Mandarin Chinese TTS results");
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
  voice: "zf_xiaobei" | "zf_xiaoni" | "zf_xiaoxiao" | "zf_xiaoyi" | "zm_yunjian" | "zm_yunxi" | "zm_yunxia" | "zm_yunyang";
  speed: number;
} {
  const settingsMap = {
    educational: {
      voice: "zm_yunxi" as const,
      speed: 0.8
    },
    motivational: {
      voice: "zf_xiaoyi" as const,
      speed: 1.2
    },
    professional: {
      voice: "zm_yunjian" as const,
      speed: 1.0
    },
    casual: {
      voice: "zf_xiaobei" as const,
      speed: 1.0
    },
    dramatic: {
      voice: "zm_yunyang" as const,
      speed: 1.1
    },
    calm: {
      voice: "zf_xiaoni" as const,
      speed: 0.9
    },
    energetic: {
      voice: "zf_xiaoxiao" as const,
      speed: 1.3
    }
  };

  return settingsMap[contentType];
}

/**
 * Utility function to enhance Mandarin Chinese text for better speech
 * 
 * @param text - Base text to enhance
 * @param enhancements - Enhancement options
 * @returns Enhanced text
 */
export function enhanceMandarinChineseTextForSpeech(
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
        return sentence.replace(/(，|；|：)/g, "$1\n");
      }
      return sentence;
    });
    enhancedText = brokenSentences.join("。");
  }

  // Improve flow
  if (enhancements.improveFlow) {
    enhancedText = enhancedText.replace(/\s+/g, ""); // Remove extra spaces
    enhancedText = enhancedText.replace(/([，。！？；：])/g, "$1 "); // Add spaces after punctuation
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
 * Utility function to generate random Mandarin Chinese text
 * 
 * @param category - Text category
 * @returns Random text from the category
 */
export function generateRandomMandarinChineseText(category: keyof typeof MANDARIN_CHINESE_TEMPLATES): string {
  const texts = MANDARIN_CHINESE_TEMPLATES[category];
  const randomIndex = Math.floor(Math.random() * texts.length);
  return texts[randomIndex];
}

/**
 * Utility function to create batch Mandarin Chinese TTS generation
 * 
 * @param texts - Array of texts
 * @param options - Common options for all generations
 * @returns Array of TTS inputs
 */
export function createBatchMandarinChineseTTSGeneration(
  texts: string[], 
  options: Partial<KokoroMandarinChineseInput> = {}
): KokoroMandarinChineseInput[] {
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
  const validVoices = [
    "zf_xiaobei", "zf_xiaoni", "zf_xiaoxiao", "zf_xiaoyi", 
    "zm_yunjian", "zm_yunxi", "zm_yunxia", "zm_yunyang"
  ];
  return validVoices.includes(voice);
}

/**
 * Supported audio formats
 */
export const SUPPORTED_AUDIO_FORMATS = [
  "WAV"
] as const;

/**
 * Common Mandarin Chinese TTS generation scenarios
 */
export const MANDARIN_CHINESE_TTS_SCENARIOS = {
  "educational": "Generate educational Mandarin Chinese speech",
  "motivational": "Create motivational Mandarin Chinese speech",
  "professional": "Generate professional Mandarin Chinese speech",
  "casual": "Create casual Mandarin Chinese speech",
  "dramatic": "Generate dramatic Mandarin Chinese speech",
  "calm": "Create calm Mandarin Chinese speech",
  "energetic": "Generate energetic Mandarin Chinese speech"
} as const;

/**
 * Voice characteristics and descriptions
 */
export const VOICE_CHARACTERISTICS = {
  "zf_xiaobei": "Clear, friendly female voice",
  "zf_xiaoni": "Warm, gentle female voice",
  "zf_xiaoxiao": "Energetic, youthful female voice",
  "zf_xiaoyi": "Professional, mature female voice",
  "zm_yunjian": "Deep, authoritative male voice",
  "zm_yunxi": "Clear, professional male voice",
  "zm_yunxia": "Warm, friendly male voice",
  "zm_yunyang": "Confident, strong male voice"
} as const;

/**
 * Voice categories
 */
export const VOICE_CATEGORIES = {
  "female_voices": ["zf_xiaobei", "zf_xiaoni", "zf_xiaoxiao", "zf_xiaoyi"],
  "male_voices": ["zm_yunjian", "zm_yunxi", "zm_yunxia", "zm_yunyang"]
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
 * Mandarin Chinese language features
 */
export const MANDARIN_CHINESE_FEATURES = {
  "tone_support": "Natural tone capture for Mandarin Chinese",
  "prosody_understanding": "Advanced prosody and rhythm understanding",
  "character_processing": "Proper Chinese character processing",
  "punctuation_handling": "Natural Chinese punctuation handling",
  "sentence_structure": "Understanding of Chinese sentence structures",
  "emotional_expression": "Natural emotional expression in Chinese",
  "cultural_context": "Understanding of Chinese cultural context",
  "regional_variations": "Support for standard Mandarin Chinese"
} as const;

export default executeKokoroMandarinChinese;
