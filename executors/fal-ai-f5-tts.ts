import { fal } from "@fal-ai/client";

export interface F5TTSInput {
  gen_text: string;
  ref_audio_url: string;
  ref_text?: string;
  model_type: "F5-TTS" | "E2-TTS";
  remove_silence?: boolean;
}

export interface F5TTSOutput {
  audio_url: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

export interface F5TTSOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI F5 TTS Executor
 * 
 * F5 TTS is an extremely good text-to-speech model that provides high-quality 
 * voice synthesis with reference audio support. Advanced TTS with voice cloning 
 * capabilities, silence removal, and multiple model types for superior speech generation.
 * 
 * @param input - The TTS generation input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated speech result
 */
export async function executeF5TTS(
  input: F5TTSInput,
  options: F5TTSOptions = {}
): Promise<F5TTSOutput> {
  try {
    // Validate required inputs
    if (!input.gen_text || input.gen_text.trim().length === 0) {
      throw new Error("Text to be converted to speech is required");
    }

    if (!input.ref_audio_url || input.ref_audio_url.trim().length === 0) {
      throw new Error("Reference audio URL is required");
    }

    if (!input.model_type) {
      throw new Error("Model type is required");
    }

    // Validate text length
    if (input.gen_text.length > 10000) {
      throw new Error("Text must be 10,000 characters or less");
    }

    if (input.gen_text.length < 1) {
      throw new Error("Text must be at least 1 character");
    }

    // Validate model type
    if (!["F5-TTS", "E2-TTS"].includes(input.model_type)) {
      throw new Error("Model type must be F5-TTS or E2-TTS");
    }

    // Validate reference audio URL format
    if (!isValidAudioURL(input.ref_audio_url)) {
      throw new Error("Reference audio must be a supported audio file");
    }

    // Prepare the request payload
    const payload = {
      gen_text: input.gen_text.trim(),
      ref_audio_url: input.ref_audio_url.trim(),
      ref_text: input.ref_text || "",
      model_type: input.model_type,
      remove_silence: input.remove_silence !== undefined ? input.remove_silence : true
    };

    // Execute the model
    const result = await fal.subscribe("fal-ai/f5-tts", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as F5TTSOutput;

  } catch (error) {
    console.error("Fal AI F5 TTS execution failed:", error);
    throw new Error(`Fal AI F5 TTS failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Fal AI F5 TTS with queue management for batch processing
 * 
 * @param input - The TTS generation input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeF5TTSQueue(
  input: F5TTSInput,
  options: F5TTSOptions = {}
): Promise<{ request_id: string }> {
  try {
    // Validate input (same validation as above)
    if (!input.gen_text || input.gen_text.trim().length === 0) {
      throw new Error("Text to be converted to speech is required");
    }

    if (!input.ref_audio_url || input.ref_audio_url.trim().length === 0) {
      throw new Error("Reference audio URL is required");
    }

    if (!input.model_type) {
      throw new Error("Model type is required");
    }

    if (input.gen_text.length > 10000) {
      throw new Error("Text must be 10,000 characters or less");
    }

    if (input.gen_text.length < 1) {
      throw new Error("Text must be at least 1 character");
    }

    if (!["F5-TTS", "E2-TTS"].includes(input.model_type)) {
      throw new Error("Model type must be F5-TTS or E2-TTS");
    }

    if (!isValidAudioURL(input.ref_audio_url)) {
      throw new Error("Reference audio must be a supported audio file");
    }

    // Prepare the request payload
    const payload = {
      gen_text: input.gen_text.trim(),
      ref_audio_url: input.ref_audio_url.trim(),
      ref_text: input.ref_text || "",
      model_type: input.model_type,
      remove_silence: input.remove_silence !== undefined ? input.remove_silence : true
    };

    // Submit to queue
    const { request_id } = await fal.queue.submit("fal-ai/f5-tts", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("Fal AI F5 TTS queue submission failed:", error);
    throw new Error(`Fal AI F5 TTS queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued Fal AI F5 TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkF5TTSStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/f5-tts", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("Fal AI F5 TTS status check failed:", error);
    throw new Error(`Fal AI F5 TTS status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed Fal AI F5 TTS request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated speech result
 */
export async function getF5TTSResult(
  requestId: string
): Promise<F5TTSOutput> {
  try {
    const result = await fal.queue.result("fal-ai/f5-tts", {
      requestId
    });

    return result.data as F5TTSOutput;

  } catch (error) {
    console.error("Fal AI F5 TTS result retrieval failed:", error);
    throw new Error(`Fal AI F5 TTS result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create TTS generation scenarios
 * 
 * @param type - Type of TTS generation scenario to create
 * @param customText - Custom text (optional)
 * @param customReferenceAudio - Custom reference audio URL (optional)
 * @param customOptions - Custom options (optional)
 * @returns F5 TTS input configuration
 */
export function createF5TTSScenario(
  type: 'narrative' | 'presentation' | 'character' | 'professional' | 'casual' | 'dramatic' | 'educational' | 'commercial' | 'custom',
  customText?: string,
  customReferenceAudio?: string,
  customOptions?: Partial<F5TTSInput>
): F5TTSInput {
  const scenarioTemplates = {
    narrative: {
      gen_text: customText || "I don't really care what you call me. I've been a silent spectator, watching species evolve, empires rise and fall. But always remember, I am mighty and enduring. Respect me and I'll nurture you; ignore me and you shall face the consequences.",
      ref_audio_url: customReferenceAudio || "https://storage.googleapis.com/falserverless/example_inputs/reference_audio.wav",
      ref_text: "Some call me nature, others call me mother nature.",
      model_type: "F5-TTS" as const,
      remove_silence: true
    },
    presentation: {
      gen_text: customText || "Welcome to our presentation. Today we will explore the fascinating world of artificial intelligence and its impact on modern technology. We'll cover key concepts, real-world applications, and future possibilities.",
      ref_audio_url: customReferenceAudio || "https://example.com/presenter-voice.wav",
      ref_text: "Hello everyone, thank you for joining us today.",
      model_type: "F5-TTS" as const,
      remove_silence: true
    },
    character: {
      gen_text: customText || "Greetings, traveler. I am the guardian of this ancient realm. Many have sought the treasures hidden within these walls, but few have succeeded. Are you prepared for the challenges that lie ahead?",
      ref_audio_url: customReferenceAudio || "https://example.com/character-voice.wav",
      ref_text: "Welcome to my domain, brave adventurer.",
      model_type: "E2-TTS" as const,
      remove_silence: true
    },
    professional: {
      gen_text: customText || "Thank you for your interest in our services. We are committed to providing the highest quality solutions to meet your business needs. Our team of experts is ready to assist you with any questions or concerns.",
      ref_audio_url: customReferenceAudio || "https://example.com/professional-voice.wav",
      ref_text: "Good morning, this is our customer service team.",
      model_type: "F5-TTS" as const,
      remove_silence: true
    },
    casual: {
      gen_text: customText || "Hey there! Thanks for checking out our latest video. I'm really excited to share this with you today. We've got some amazing content coming up, so make sure to subscribe and hit that notification bell!",
      ref_audio_url: customReferenceAudio || "https://example.com/casual-voice.wav",
      ref_text: "Hey everyone, welcome back to my channel!",
      model_type: "F5-TTS" as const,
      remove_silence: true
    },
    dramatic: {
      gen_text: customText || "In the depths of the ancient forest, where shadows dance with moonlight, a tale of courage and sacrifice unfolds. The hero's journey begins not with a single step, but with the weight of destiny upon their shoulders.",
      ref_audio_url: customReferenceAudio || "https://example.com/dramatic-voice.wav",
      ref_text: "Once upon a time, in a land far away...",
      model_type: "E2-TTS" as const,
      remove_silence: true
    },
    educational: {
      gen_text: customText || "Today we'll learn about the water cycle. Water evaporates from oceans, lakes, and rivers, rises into the atmosphere, condenses into clouds, and falls back to Earth as precipitation. This continuous process is essential for life on our planet.",
      ref_audio_url: customReferenceAudio || "https://example.com/teacher-voice.wav",
      ref_text: "Good morning class, today we're going to study...",
      model_type: "F5-TTS" as const,
      remove_silence: true
    },
    commercial: {
      gen_text: customText || "Introducing the revolutionary new product that will change your life forever. With cutting-edge technology and innovative design, this is the solution you've been waiting for. Order now and experience the difference!",
      ref_audio_url: customReferenceAudio || "https://example.com/commercial-voice.wav",
      ref_text: "Are you tired of the same old problems?",
      model_type: "F5-TTS" as const,
      remove_silence: true
    },
    custom: {
      gen_text: customText || "This is a custom text-to-speech generation. You can provide your own text and reference audio to create personalized voice content for your specific needs.",
      ref_audio_url: customReferenceAudio || "https://example.com/custom-voice.wav",
      ref_text: "This is a sample reference text for voice cloning.",
      model_type: "F5-TTS" as const,
      remove_silence: true
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
 * Predefined text templates for different TTS scenarios
 */
export const TEXT_TEMPLATES = {
  "narrative": [
    "I don't really care what you call me. I've been a silent spectator, watching species evolve, empires rise and fall. But always remember, I am mighty and enduring. Respect me and I'll nurture you; ignore me and you shall face the consequences.",
    "In the beginning, there was only darkness. Then came the light, and with it, the promise of a new dawn. But darkness never truly leaves; it merely waits in the shadows, biding its time until it can reclaim what was once its own."
  ],
  "presentation": [
    "Welcome to our presentation. Today we will explore the fascinating world of artificial intelligence and its impact on modern technology. We'll cover key concepts, real-world applications, and future possibilities.",
    "Thank you for attending today's webinar. We'll be discussing the latest trends in digital marketing, including social media strategies, content creation, and customer engagement techniques."
  ],
  "character": [
    "Greetings, traveler. I am the guardian of this ancient realm. Many have sought the treasures hidden within these walls, but few have succeeded. Are you prepared for the challenges that lie ahead?",
    "Ah, another soul has found their way to my domain. I have watched countless mortals come and go, each with their own stories, their own dreams, their own inevitable fate."
  ],
  "professional": [
    "Thank you for your interest in our services. We are committed to providing the highest quality solutions to meet your business needs. Our team of experts is ready to assist you with any questions or concerns.",
    "We appreciate your business and look forward to serving you. Our customer service team is available 24/7 to address any issues or provide additional support as needed."
  ],
  "casual": [
    "Hey there! Thanks for checking out our latest video. I'm really excited to share this with you today. We've got some amazing content coming up, so make sure to subscribe and hit that notification bell!",
    "What's up, everyone? I hope you're having an awesome day! Today we're going to try something completely different, and I think you're going to love it."
  ],
  "dramatic": [
    "In the depths of the ancient forest, where shadows dance with moonlight, a tale of courage and sacrifice unfolds. The hero's journey begins not with a single step, but with the weight of destiny upon their shoulders.",
    "The storm raged on, each thunderclap a reminder of the power that lay beyond human comprehension. In that moment, everything changed, and nothing would ever be the same again."
  ],
  "educational": [
    "Today we'll learn about the water cycle. Water evaporates from oceans, lakes, and rivers, rises into the atmosphere, condenses into clouds, and falls back to Earth as precipitation. This continuous process is essential for life on our planet.",
    "Let's explore the fascinating world of mathematics. Numbers are not just symbols on a page; they represent the very fabric of our universe, the language through which nature communicates its deepest secrets."
  ],
  "commercial": [
    "Introducing the revolutionary new product that will change your life forever. With cutting-edge technology and innovative design, this is the solution you've been waiting for. Order now and experience the difference!",
    "Don't miss out on this incredible opportunity! For a limited time only, you can get our premium service at an unbeatable price. Act now before this offer expires!"
  ]
} as const;

/**
 * Example usage of the Fal AI F5 TTS executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic TTS with voice cloning
    const result1 = await executeF5TTS({
      gen_text: "I don't really care what you call me. I've been a silent spectator, watching species evolve, empires rise and fall. But always remember, I am mighty and enduring. Respect me and I'll nurture you; ignore me and you shall face the consequences.",
      ref_audio_url: "https://storage.googleapis.com/falserverless/example_inputs/reference_audio.wav",
      ref_text: "Some call me nature, others call me mother nature.",
      model_type: "F5-TTS",
      remove_silence: true
    });

    console.log("Generated speech URL:", result1.audio_url.url);

    // Example 2: Using helper function for presentation
    const presentationTTS = createF5TTSScenario('presentation');
    const result2 = await executeF5TTS(presentationTTS);
    console.log("Presentation speech:", result2.audio_url.url);

    // Example 3: Custom text with E2-TTS model
    const customTTS = createF5TTSScenario(
      'custom',
      "This is a custom text-to-speech generation using the E2-TTS model for specialized voice synthesis.",
      "https://example.com/custom-reference.wav",
      { model_type: "E2-TTS" }
    );
    const result3 = await executeF5TTS(customTTS);
    console.log("Custom speech:", result3.audio_url.url);

    // Example 4: Using predefined templates
    const result4 = await executeF5TTS({
      gen_text: TEXT_TEMPLATES.character[0],
      ref_audio_url: "https://example.com/character-reference.wav",
      ref_text: "Welcome to my domain, brave adventurer.",
      model_type: "E2-TTS",
      remove_silence: true
    });
    console.log("Character speech:", result4.audio_url.url);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeF5TTSQueue({
      gen_text: "Thank you for your interest in our services. We are committed to providing the highest quality solutions to meet your business needs.",
      ref_audio_url: "https://example.com/professional-reference.wav",
      ref_text: "Good morning, this is our customer service team.",
      model_type: "F5-TTS",
      remove_silence: true,
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkF5TTSStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getF5TTSResult(request_id);
      console.log("Queue result:", result);
    }

  } catch (error) {
    console.error("Example execution failed:", error);
  }
}

/**
 * Utility function to estimate processing cost
 * 
 * @param textLength - Length of text in characters
 * @returns Estimated cost in USD
 */
export function estimateProcessingCost(textLength: number): number {
  const costPer1000Characters = 0.05;
  return (textLength / 1000) * costPer1000Characters;
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
  if (text.length > 10000) {
    suggestions.push("Text is too long (max 10,000 characters)");
  }

  if (text.length < 1) {
    suggestions.push("Text is too short, consider adding more content");
  }

  // Check for proper formatting
  const hasPunctuation = /[.!?]/.test(text);
  const hasSpaces = /\s/.test(text);
  
  if (!hasPunctuation) {
    suggestions.push("Consider adding punctuation for better speech flow");
  }
  
  if (!hasSpaces) {
    suggestions.push("Text should contain spaces between words");
  }

  // Check for very long sentences
  const sentences = text.split(/[.!?]+/);
  const longSentences = sentences.filter(sentence => sentence.trim().length > 200);
  if (longSentences.length > 0) {
    suggestions.push("Consider breaking up very long sentences for better speech generation");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedText
  };
}

/**
 * Utility function to validate reference audio URL
 * 
 * @param url - The reference audio URL to validate
 * @returns Validation result with suggestions
 */
export function validateReferenceAudioURL(url: string): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedURL: string; 
} {
  const suggestions: string[] = [];
  
  // Clean and format URL
  const formattedURL = url.trim();

  // Check for common issues
  if (!url || url.trim().length === 0) {
    suggestions.push("Reference audio URL is required");
  }

  // Check for valid audio format
  if (!isValidAudioURL(url)) {
    suggestions.push("Reference audio must be a supported audio file (WAV, MP3, OGG, M4A, AAC)");
  }

  // Check for valid URL format
  try {
    new URL(url);
  } catch {
    suggestions.push("Reference audio URL must be a valid URL");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedURL
  };
}

/**
 * Utility function to get optimal model settings for TTS scenario
 * 
 * @param scenario - Type of TTS scenario
 * @returns Recommended model type and settings
 */
export function getOptimalModelSettings(scenario: 'narrative' | 'presentation' | 'character' | 'professional' | 'casual' | 'dramatic' | 'educational' | 'commercial'): {
  model_type: "F5-TTS" | "E2-TTS";
  remove_silence: boolean;
} {
  const settingsMap = {
    narrative: { model_type: "F5-TTS" as const, remove_silence: true },
    presentation: { model_type: "F5-TTS" as const, remove_silence: true },
    character: { model_type: "E2-TTS" as const, remove_silence: true },
    professional: { model_type: "F5-TTS" as const, remove_silence: true },
    casual: { model_type: "F5-TTS" as const, remove_silence: true },
    dramatic: { model_type: "E2-TTS" as const, remove_silence: true },
    educational: { model_type: "F5-TTS" as const, remove_silence: true },
    commercial: { model_type: "F5-TTS" as const, remove_silence: true }
  };

  return settingsMap[scenario];
}

/**
 * Utility function to enhance text for better TTS generation
 * 
 * @param text - Base text to enhance
 * @param enhancements - Enhancement options
 * @returns Enhanced text
 */
export function enhanceTextForTTS(
  text: string, 
  enhancements: {
    addPunctuation?: boolean;
    improveFlow?: boolean;
    addPauses?: boolean;
    addEmphasis?: boolean;
  } = {}
): string {
  let enhancedText = text.trim();

  // Add punctuation if missing
  if (enhancements.addPunctuation) {
    if (!/[.!?]$/.test(enhancedText)) {
      enhancedText += ".";
    }
  }

  // Improve flow
  if (enhancements.improveFlow) {
    enhancedText = enhancedText.replace(/\s+/g, " "); // Normalize spaces
    enhancedText = enhancedText.replace(/([.!?])\s*([A-Z])/g, "$1 $2"); // Ensure proper spacing after punctuation
  }

  // Add pauses
  if (enhancements.addPauses) {
    enhancedText = enhancedText.replace(/([.!?])\s+/g, "$1 "); // Add slight pauses after sentences
  }

  // Add emphasis
  if (enhancements.addEmphasis) {
    // This is a simple enhancement - in practice, you might want more sophisticated emphasis handling
    enhancedText = enhancedText.replace(/\b(important|key|critical|essential)\b/gi, "**$1**");
  }

  return enhancedText;
}

/**
 * Utility function to generate random text
 * 
 * @param scenario - TTS scenario
 * @returns Random text from the scenario
 */
export function generateRandomText(scenario: keyof typeof TEXT_TEMPLATES): string {
  const texts = TEXT_TEMPLATES[scenario];
  const randomIndex = Math.floor(Math.random() * texts.length);
  return texts[randomIndex];
}

/**
 * Utility function to create batch TTS generation
 * 
 * @param textsArray - Array of texts
 * @param referenceAudioArray - Array of reference audio URLs
 * @param modelTypesArray - Array of model types
 * @returns Array of F5 TTS inputs
 */
export function createBatchF5TTSGeneration(
  textsArray: string[], 
  referenceAudioArray: string[],
  modelTypesArray: ("F5-TTS" | "E2-TTS")[]
): F5TTSInput[] {
  if (textsArray.length !== referenceAudioArray.length || textsArray.length !== modelTypesArray.length) {
    throw new Error("Texts, reference audio, and model types arrays must have the same length");
  }

  return textsArray.map((text, index) => ({
    gen_text: text,
    ref_audio_url: referenceAudioArray[index],
    model_type: modelTypesArray[index],
    remove_silence: true
  }));
}

/**
 * Check if URL is a valid audio format
 * 
 * @param url - The URL to check
 * @returns True if URL is a valid audio format
 */
function isValidAudioURL(url: string): boolean {
  const audioExtensions = ['.wav', '.mp3', '.ogg', '.m4a', '.aac'];
  return audioExtensions.some(ext => url.toLowerCase().includes(ext));
}

/**
 * Supported audio formats
 */
export const SUPPORTED_AUDIO_FORMATS = [
  "WAV",
  "MP3",
  "OGG",
  "M4A",
  "AAC"
] as const;

/**
 * Model type descriptions
 */
export const MODEL_TYPE_DESCRIPTIONS = {
  "F5-TTS": {
    description: "General-purpose TTS model with excellent voice cloning capabilities",
    best_for: "General voice synthesis, voice cloning, most use cases",
    quality: "High",
    speed: "Fast"
  },
  "E2-TTS": {
    description: "Specialized TTS model for specific voice synthesis needs",
    best_for: "Specific voice requirements, specialized use cases",
    quality: "High",
    speed: "Fast"
  }
} as const;

/**
 * Common TTS generation scenarios
 */
export const TTS_GENERATION_SCENARIOS = {
  "narrative": "Generate narrative voice from text",
  "presentation": "Generate presentation voice from text",
  "character": "Generate character voice from text",
  "professional": "Generate professional voice from text",
  "casual": "Generate casual voice from text",
  "dramatic": "Generate dramatic voice from text",
  "educational": "Generate educational voice from text",
  "commercial": "Generate commercial voice from text"
} as const;

/**
 * Reference audio requirements
 */
export const REFERENCE_AUDIO_REQUIREMENTS = {
  "formats": ["WAV", "MP3", "OGG", "M4A", "AAC"],
  "quality": "High-quality reference audio for better voice cloning",
  "duration": "Any duration, but longer samples may provide better results",
  "content": "Should contain clear speech for optimal voice cloning",
  "style": "Choose reference audio that matches desired voice characteristics"
} as const;

/**
 * TTS generation tips
 */
export const TTS_GENERATION_TIPS = {
  "text_formatting": "Use proper punctuation and spacing for better speech flow",
  "reference_audio": "Choose high-quality reference audio that matches your desired voice",
  "model_selection": "Use F5-TTS for general use, E2-TTS for specialized needs",
  "silence_removal": "Enable silence removal for cleaner audio output",
  "reference_text": "Provide reference text that matches the reference audio for better results"
} as const;

export default executeF5TTS;
