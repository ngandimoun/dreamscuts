import Replicate from "replicate";

export interface QwenOmniInput {
  prompt: string;
  image?: string;
  audio?: string;
  video?: string;
  system_prompt?: string;
  use_audio_in_video?: boolean;
  voice_type?: "Chelsie" | "Ethan";
  generate_audio?: boolean;
}

export interface QwenOmniOutput {
  text: string;
  voice?: string;
}

export interface QwenOmniOptions {
  webhookUrl?: string;
  webhookEventsFilter?: string[];
  onProgress?: (progress: any) => void;
}

/**
 * Qwen2.5-Omni-7B Executor
 * 
 * An end-to-end multimodal model designed to perceive diverse modalities, including 
 * text, images, audio, and video, while simultaneously generating text and natural 
 * speech responses in a streaming manner. Features Thinker-Talker architecture with 
 * real-time voice and video chat capabilities.
 * 
 * @param input - The multimodal input parameters
 * @param options - Additional execution options
 * @returns Promise with the multimodal response
 */
export async function executeQwenOmni(
  input: QwenOmniInput,
  options: QwenOmniOptions = {}
): Promise<QwenOmniOutput> {
  try {
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate required inputs
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    // Validate voice type if provided
    if (input.voice_type && !["Chelsie", "Ethan"].includes(input.voice_type)) {
      throw new Error("Voice type must be either 'Chelsie' or 'Ethan'");
    }

    // Prepare the request payload
    const payload: any = {
      prompt: input.prompt.trim(),
    };

    // Add optional inputs
    if (input.image) {
      payload.image = input.image;
    }

    if (input.audio) {
      payload.audio = input.audio;
    }

    if (input.video) {
      payload.video = input.video;
    }

    if (input.system_prompt) {
      payload.system_prompt = input.system_prompt;
    }

    if (input.use_audio_in_video !== undefined) {
      payload.use_audio_in_video = input.use_audio_in_video;
    }

    if (input.voice_type) {
      payload.voice_type = input.voice_type;
    }

    if (input.generate_audio !== undefined) {
      payload.generate_audio = input.generate_audio;
    }

    // Execute the model
    const output = await replicate.run(
      "lucataco/qwen2.5-omni-7b:0ca8160f7aaf85703a6aac282d6c79aa64d3541b239fa4c5c1688b10cb1faef1",
      {
        input: payload,
        webhook: options.webhookUrl,
        webhook_events_filter: options.webhookEventsFilter,
      }
    );

    return output as QwenOmniOutput;

  } catch (error) {
    console.error("Qwen2.5-Omni execution failed:", error);
    throw new Error(`Qwen2.5-Omni execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Qwen2.5-Omni with prediction management for long-running tasks
 * 
 * @param input - The multimodal input parameters
 * @param options - Additional execution options
 * @returns Promise with prediction object for tracking
 */
export async function executeQwenOmniPrediction(
  input: QwenOmniInput,
  options: QwenOmniOptions = {}
): Promise<any> {
  try {
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate input (same validation as above)
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (input.voice_type && !["Chelsie", "Ethan"].includes(input.voice_type)) {
      throw new Error("Voice type must be either 'Chelsie' or 'Ethan'");
    }

    // Prepare the request payload
    const payload: any = {
      prompt: input.prompt.trim(),
    };

    // Add optional inputs
    if (input.image) {
      payload.image = input.image;
    }

    if (input.audio) {
      payload.audio = input.audio;
    }

    if (input.video) {
      payload.video = input.video;
    }

    if (input.system_prompt) {
      payload.system_prompt = input.system_prompt;
    }

    if (input.use_audio_in_video !== undefined) {
      payload.use_audio_in_video = input.use_audio_in_video;
    }

    if (input.voice_type) {
      payload.voice_type = input.voice_type;
    }

    if (input.generate_audio !== undefined) {
      payload.generate_audio = input.generate_audio;
    }

    // Create prediction
    const prediction = await replicate.predictions.create({
      model: "lucataco/qwen2.5-omni-7b:0ca8160f7aaf85703a6aac282d6c79aa64d3541b239fa4c5c1688b10cb1faef1",
      input: payload,
      webhook: options.webhookUrl,
      webhook_events_filter: options.webhookEventsFilter,
    });

    return prediction;

  } catch (error) {
    console.error("Qwen2.5-Omni prediction creation failed:", error);
    throw new Error(`Qwen2.5-Omni prediction creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a Qwen2.5-Omni prediction
 * 
 * @param predictionId - The prediction ID from prediction creation
 * @returns Promise with prediction status
 */
export async function checkQwenOmniStatus(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.get(predictionId);
    return prediction;

  } catch (error) {
    console.error("Qwen2.5-Omni status check failed:", error);
    throw new Error(`Qwen2.5-Omni status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Cancel a running Qwen2.5-Omni prediction
 * 
 * @param predictionId - The prediction ID to cancel
 * @returns Promise with cancellation result
 */
export async function cancelQwenOmniPrediction(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.cancel(predictionId);
    return prediction;

  } catch (error) {
    console.error("Qwen2.5-Omni prediction cancellation failed:", error);
    throw new Error(`Qwen2.5-Omni prediction cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create multimodal scenarios
 * 
 * @param type - Type of multimodal scenario to create
 * @param customPrompt - Custom prompt (optional)
 * @param customOptions - Custom options (optional)
 * @returns Qwen Omni input configuration
 */
export function createMultimodalScenario(
  type: 'text_only' | 'image_analysis' | 'audio_transcription' | 'video_analysis' | 'voice_chat' | 'multimodal_conversation' | 'educational' | 'accessibility' | 'content_creation' | 'custom',
  customPrompt?: string,
  customOptions?: Partial<QwenOmniInput>
): QwenOmniInput {
  const scenarioTemplates = {
    text_only: {
      prompt: customPrompt || "Hello! How can I help you today?",
      generate_audio: false
    },
    image_analysis: {
      prompt: customPrompt || "What do you see in this image? Please describe it in detail.",
      image: "https://example.com/image.jpg",
      generate_audio: true,
      voice_type: "Chelsie"
    },
    audio_transcription: {
      prompt: customPrompt || "Please transcribe and analyze this audio content.",
      audio: "https://example.com/audio.wav",
      generate_audio: true,
      voice_type: "Ethan"
    },
    video_analysis: {
      prompt: customPrompt || "Describe what's happening in this video and what you can hear.",
      video: "https://replicate.delivery/pbxt/MmJqxKbRSknHd9fwtTEbywWqDDdhgsx5tNYLIDnFqJ9j5ObC/draw.mp4",
      use_audio_in_video: true,
      generate_audio: true,
      voice_type: "Chelsie"
    },
    voice_chat: {
      prompt: customPrompt || "Let's have a conversation! What would you like to talk about?",
      generate_audio: true,
      voice_type: "Chelsie"
    },
    multimodal_conversation: {
      prompt: customPrompt || "I've shared an image, audio, and video with you. Please analyze all of them and provide a comprehensive response.",
      image: "https://example.com/image.jpg",
      audio: "https://example.com/audio.wav",
      video: "https://example.com/video.mp4",
      use_audio_in_video: true,
      generate_audio: true,
      voice_type: "Chelsie"
    },
    educational: {
      prompt: customPrompt || "Please explain this educational content in a clear and engaging way.",
      generate_audio: true,
      voice_type: "Ethan"
    },
    accessibility: {
      prompt: customPrompt || "Please provide an accessible description of this content.",
      generate_audio: true,
      voice_type: "Chelsie"
    },
    content_creation: {
      prompt: customPrompt || "Help me create engaging content based on this input.",
      generate_audio: true,
      voice_type: "Ethan"
    },
    custom: {
      prompt: customPrompt || "Analyze this multimodal input and provide insights.",
      generate_audio: true,
      voice_type: "Chelsie"
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
 * Predefined prompt templates for different multimodal scenarios
 */
export const PROMPT_TEMPLATES = {
  "text_only": [
    "Hello! How can I help you today?",
    "What would you like to know?",
    "I'm here to assist you. What can I do for you?"
  ],
  "image_analysis": [
    "What do you see in this image? Please describe it in detail.",
    "Analyze this image and tell me what's happening.",
    "Describe the visual elements in this image.",
    "What objects, people, or scenes can you identify in this image?"
  ],
  "audio_transcription": [
    "Please transcribe and analyze this audio content.",
    "What is being said in this audio?",
    "Transcribe this audio and provide insights about the content.",
    "Listen to this audio and tell me what you hear."
  ],
  "video_analysis": [
    "Describe what's happening in this video and what you can hear.",
    "Analyze this video content and provide a comprehensive description.",
    "What do you see and hear in this video?",
    "Please describe the visual and audio elements in this video."
  ],
  "voice_chat": [
    "Let's have a conversation! What would you like to talk about?",
    "I'm ready to chat! What's on your mind?",
    "Hello! I'm here to talk. What would you like to discuss?",
    "Let's have an engaging conversation. What interests you?"
  ],
  "multimodal_conversation": [
    "I've shared multiple types of content with you. Please analyze all of them and provide a comprehensive response.",
    "Please examine the image, audio, and video I've provided and give me your thoughts.",
    "Analyze all the multimedia content I've shared and provide insights.",
    "Review the different types of content and tell me what you observe."
  ],
  "educational": [
    "Please explain this educational content in a clear and engaging way.",
    "Help me understand this educational material.",
    "Can you teach me about this content?",
    "Please provide an educational explanation of this material."
  ],
  "accessibility": [
    "Please provide an accessible description of this content.",
    "Help make this content accessible by describing it clearly.",
    "Provide an accessibility-friendly description of this material.",
    "Describe this content in a way that's accessible to everyone."
  ],
  "content_creation": [
    "Help me create engaging content based on this input.",
    "How can I use this content to create something interesting?",
    "What creative ideas do you have for this content?",
    "Help me develop content ideas based on this material."
  ]
} as const;

/**
 * Example usage of the Qwen2.5-Omni executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic text generation
    const result1 = await executeQwenOmni({
      prompt: "Hello! How can I help you today?",
      generate_audio: false
    });

    console.log("Text response:", result1.text);

    // Example 2: Image analysis with voice
    const result2 = await executeQwenOmni({
      prompt: "What do you see in this image?",
      image: "https://example.com/image.jpg",
      generate_audio: true,
      voice_type: "Chelsie"
    });

    console.log("Image analysis:", result2.text);
    console.log("Voice response:", result2.voice);

    // Example 3: Video analysis with audio
    const result3 = await executeQwenOmni({
      prompt: "Describe what's happening in this video",
      video: "https://replicate.delivery/pbxt/MmJqxKbRSknHd9fwtTEbywWqDDdhgsx5tNYLIDnFqJ9j5ObC/draw.mp4",
      use_audio_in_video: true,
      generate_audio: true,
      voice_type: "Ethan"
    });

    console.log("Video analysis:", result3.text);
    console.log("Voice response:", result3.voice);

    // Example 4: Using helper function for voice chat
    const voiceChat = createMultimodalScenario('voice_chat');
    const result4 = await executeQwenOmni(voiceChat);
    console.log("Voice chat:", result4.text, result4.voice);

    // Example 5: Custom multimodal scenario
    const customScenario = createMultimodalScenario(
      'custom',
      "Analyze this image and audio together",
      {
        image: "https://example.com/image.jpg",
        audio: "https://example.com/audio.wav",
        voice_type: "Chelsie"
      }
    );
    const result5 = await executeQwenOmni(customScenario);
    console.log("Custom analysis:", result5.text, result5.voice);

    // Example 6: Using predefined templates
    const result6 = await executeQwenOmni({
      prompt: PROMPT_TEMPLATES.image_analysis[0],
      image: "https://example.com/image.jpg",
      generate_audio: true,
      voice_type: "Ethan"
    });
    console.log("Template analysis:", result6.text, result6.voice);

    // Example 7: Prediction usage for long-running tasks
    const prediction = await executeQwenOmniPrediction({
      prompt: "Analyze this complex video content",
      video: "https://example.com/long-video.mp4",
      use_audio_in_video: true,
      generate_audio: true,
      voice_type: "Chelsie"
    });

    console.log("Prediction ID:", prediction.id);

    // Check status
    const status = await checkQwenOmniStatus(prediction.id);
    console.log("Prediction status:", status.status);

    // Get result when completed
    if (status.status === "succeeded") {
      console.log("Prediction result:", status.output);
    }

  } catch (error) {
    console.error("Example execution failed:", error);
  }
}

/**
 * Utility function to estimate processing cost
 * 
 * @param runs - Number of runs
 * @returns Estimated cost in USD
 */
export function estimateProcessingCost(runs: number): number {
  const costPerRun = 0.012;
  return runs * costPerRun;
}

/**
 * Utility function to validate prompt format
 * 
 * @param prompt - The prompt string to validate
 * @returns Validation result with suggestions
 */
export function validatePromptFormat(prompt: string): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedPrompt: string; 
} {
  const suggestions: string[] = [];
  
  // Clean and format prompt
  const formattedPrompt = prompt.trim();

  // Check for common issues
  if (prompt.length < 1) {
    suggestions.push("Prompt is too short, consider adding more specific instructions");
  }

  // Check for proper formatting
  const hasQuestionMark = /\?/.test(prompt);
  const hasSpecificWords = /(what|how|where|when|why|who|describe|analyze|explain|help)/i.test(prompt);
  
  if (!hasQuestionMark && !hasSpecificWords) {
    suggestions.push("Consider using question words or action verbs for better responses");
  }
  
  if (prompt.length < 5) {
    suggestions.push("Consider making your prompt more specific for better results");
  }

  // Check for very long prompts
  if (prompt.length > 1000) {
    suggestions.push("Consider shortening your prompt for better processing");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedPrompt
  };
}

/**
 * Utility function to validate media URL
 * 
 * @param url - The media URL to validate
 * @param type - Type of media (image, audio, video)
 * @returns Validation result with suggestions
 */
export function validateMediaURL(url: string, type: 'image' | 'audio' | 'video'): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedURL: string; 
} {
  const suggestions: string[] = [];
  
  // Clean and format URL
  const formattedURL = url.trim();

  // Check for common issues
  if (!url || url.trim().length === 0) {
    suggestions.push(`${type} URL is required`);
  }

  // Check for valid URL format
  try {
    new URL(url);
  } catch {
    suggestions.push(`${type} URL must be a valid URL`);
  }

  // Check for valid media format
  if (!isValidMediaURL(url, type)) {
    const formats = getSupportedFormats(type);
    suggestions.push(`${type} must be in supported format (${formats.join(', ')})`);
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedURL
  };
}

/**
 * Utility function to get optimal settings for multimodal type
 * 
 * @param multimodalType - Type of multimodal interaction
 * @returns Recommended settings
 */
export function getOptimalMultimodalSettings(multimodalType: 'text_only' | 'image_analysis' | 'audio_transcription' | 'video_analysis' | 'voice_chat' | 'multimodal_conversation' | 'educational' | 'accessibility' | 'content_creation'): {
  generate_audio: boolean;
  voice_type: "Chelsie" | "Ethan";
  use_audio_in_video: boolean;
  prompt_suggestions: string[];
} {
  const settingsMap = {
    text_only: { 
      generate_audio: false, 
      voice_type: "Chelsie" as const,
      use_audio_in_video: false,
      prompt_suggestions: ["Hello! How can I help you today?", "What would you like to know?"] 
    },
    image_analysis: { 
      generate_audio: true, 
      voice_type: "Chelsie" as const,
      use_audio_in_video: false,
      prompt_suggestions: ["What do you see in this image? Please describe it in detail.", "Analyze this image and tell me what's happening."] 
    },
    audio_transcription: { 
      generate_audio: true, 
      voice_type: "Ethan" as const,
      use_audio_in_video: false,
      prompt_suggestions: ["Please transcribe and analyze this audio content.", "What is being said in this audio?"] 
    },
    video_analysis: { 
      generate_audio: true, 
      voice_type: "Chelsie" as const,
      use_audio_in_video: true,
      prompt_suggestions: ["Describe what's happening in this video and what you can hear.", "Analyze this video content and provide a comprehensive description."] 
    },
    voice_chat: { 
      generate_audio: true, 
      voice_type: "Chelsie" as const,
      use_audio_in_video: false,
      prompt_suggestions: ["Let's have a conversation! What would you like to talk about?", "I'm ready to chat! What's on your mind?"] 
    },
    multimodal_conversation: { 
      generate_audio: true, 
      voice_type: "Chelsie" as const,
      use_audio_in_video: true,
      prompt_suggestions: ["I've shared multiple types of content with you. Please analyze all of them and provide a comprehensive response.", "Please examine the image, audio, and video I've provided and give me your thoughts."] 
    },
    educational: { 
      generate_audio: true, 
      voice_type: "Ethan" as const,
      use_audio_in_video: false,
      prompt_suggestions: ["Please explain this educational content in a clear and engaging way.", "Help me understand this educational material."] 
    },
    accessibility: { 
      generate_audio: true, 
      voice_type: "Chelsie" as const,
      use_audio_in_video: false,
      prompt_suggestions: ["Please provide an accessible description of this content.", "Help make this content accessible by describing it clearly."] 
    },
    content_creation: { 
      generate_audio: true, 
      voice_type: "Ethan" as const,
      use_audio_in_video: false,
      prompt_suggestions: ["Help me create engaging content based on this input.", "How can I use this content to create something interesting?"] 
    }
  };

  return settingsMap[multimodalType];
}

/**
 * Utility function to enhance prompt for better multimodal understanding
 * 
 * @param prompt - Base prompt to enhance
 * @param enhancements - Enhancement options
 * @returns Enhanced prompt
 */
export function enhancePromptForMultimodal(
  prompt: string, 
  enhancements: {
    addSpecificity?: boolean;
    addContext?: boolean;
    addDetail?: boolean;
    addMultimodal?: boolean;
  } = {}
): string {
  let enhancedPrompt = prompt.trim();

  // Add specificity
  if (enhancements.addSpecificity) {
    if (!/(what|how|where|when|why|who|describe|analyze|explain|help)/i.test(enhancedPrompt)) {
      enhancedPrompt = `Please ${enhancedPrompt.toLowerCase()}`;
    }
  }

  // Add context
  if (enhancements.addContext) {
    if (!/(image|audio|video|content|material)/i.test(enhancedPrompt)) {
      enhancedPrompt = `${enhancedPrompt} in the provided content`;
    }
  }

  // Add detail
  if (enhancements.addDetail) {
    if (!/(detailed|specific|comprehensive|thorough)/i.test(enhancedPrompt)) {
      enhancedPrompt = `Please provide a detailed analysis of ${enhancedPrompt.toLowerCase()}`;
    }
  }

  // Add multimodal
  if (enhancements.addMultimodal) {
    if (!/(multimodal|multiple|all|together)/i.test(enhancedPrompt)) {
      enhancedPrompt = `${enhancedPrompt} considering all the provided media`;
    }
  }

  return enhancedPrompt;
}

/**
 * Utility function to generate random prompt
 * 
 * @param scenario - Multimodal scenario
 * @returns Random prompt from the scenario
 */
export function generateRandomPrompt(scenario: keyof typeof PROMPT_TEMPLATES): string {
  const prompts = PROMPT_TEMPLATES[scenario];
  const randomIndex = Math.floor(Math.random() * prompts.length);
  return prompts[randomIndex];
}

/**
 * Utility function to create batch multimodal analysis
 * 
 * @param promptsArray - Array of prompts
 * @param imagesArray - Array of image URLs
 * @param audiosArray - Array of audio URLs
 * @param videosArray - Array of video URLs
 * @param voiceTypesArray - Array of voice types
 * @returns Array of Qwen Omni inputs
 */
export function createBatchMultimodalAnalysis(
  promptsArray: string[], 
  imagesArray: (string | undefined)[],
  audiosArray: (string | undefined)[],
  videosArray: (string | undefined)[],
  voiceTypesArray: ("Chelsie" | "Ethan")[]
): QwenOmniInput[] {
  if (promptsArray.length !== imagesArray.length || 
      promptsArray.length !== audiosArray.length || 
      promptsArray.length !== videosArray.length || 
      promptsArray.length !== voiceTypesArray.length) {
    throw new Error("All arrays must have the same length");
  }

  return promptsArray.map((prompt, index) => ({
    prompt,
    image: imagesArray[index],
    audio: audiosArray[index],
    video: videosArray[index],
    voice_type: voiceTypesArray[index],
    generate_audio: true
  }));
}

/**
 * Check if URL is a valid media format
 * 
 * @param url - The URL to check
 * @param type - Type of media
 * @returns True if URL is a valid media format
 */
function isValidMediaURL(url: string, type: 'image' | 'audio' | 'video'): boolean {
  const extensions = {
    image: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    audio: ['.wav', '.mp3', '.flac', '.aac'],
    video: ['.mp4', '.avi', '.mov', '.webm']
  };

  return extensions[type].some(ext => url.toLowerCase().includes(ext));
}

/**
 * Get supported formats for media type
 * 
 * @param type - Type of media
 * @returns Array of supported formats
 */
function getSupportedFormats(type: 'image' | 'audio' | 'video'): string[] {
  const formats = {
    image: ['JPEG', 'PNG', 'WebP', 'GIF'],
    audio: ['WAV', 'MP3', 'FLAC', 'AAC'],
    video: ['MP4', 'AVI', 'MOV', 'WebM']
  };

  return formats[type];
}

/**
 * Supported media formats
 */
export const SUPPORTED_MEDIA_FORMATS = {
  "image": ["JPEG", "PNG", "WebP", "GIF"],
  "audio": ["WAV", "MP3", "FLAC", "AAC"],
  "video": ["MP4", "AVI", "MOV", "WebM"]
} as const;

/**
 * Voice type descriptions
 */
export const VOICE_TYPE_DESCRIPTIONS = {
  "Chelsie": {
    "gender": "Female",
    "description": "A honeyed, velvety voice that carries a gentle warmth and luminous clarity.",
    "best_for": "General use, educational content, customer service"
  },
  "Ethan": {
    "gender": "Male", 
    "description": "A bright, upbeat voice with infectious energy and a warm, approachable vibe.",
    "best_for": "Energetic content, entertainment, dynamic presentations"
  }
} as const;

/**
 * Multimodal capability descriptions
 */
export const MULTIMODAL_CAPABILITIES = {
  "text_understanding": "Advanced text comprehension and generation",
  "image_understanding": "Comprehensive image analysis and description",
  "audio_understanding": "Audio content analysis and transcription",
  "video_understanding": "Video content analysis with audio integration",
  "speech_generation": "Natural and robust speech synthesis",
  "multimodal_integration": "Seamless integration of multiple modalities",
  "real_time_processing": "Real-time multimodal processing",
  "streaming_generation": "Streaming text and speech generation"
} as const;

/**
 * Common multimodal scenarios
 */
export const MULTIMODAL_SCENARIOS = {
  "text_only": "Text-only interactions",
  "image_analysis": "Image analysis and description",
  "audio_transcription": "Audio transcription and understanding",
  "video_analysis": "Video content analysis",
  "voice_chat": "Voice-based conversations",
  "multimodal_conversation": "Multi-media content analysis",
  "educational": "Educational content with voice",
  "accessibility": "Accessibility content generation",
  "content_creation": "Content creation assistance"
} as const;

/**
 * Hardware requirements
 */
export const HARDWARE_REQUIREMENTS = {
  "gpu": "Nvidia L40S GPU",
  "memory": "31.11 GB (BF16), 93.56 GB (FP32)",
  "precision": "BF16 recommended for optimal performance",
  "attention_implementation": "flash_attention_2 recommended"
} as const;

/**
 * Benchmark performance
 */
export const BENCHMARK_PERFORMANCE = {
  "omni_bench": "56.13% (Speech: 55.25%, Sound Event: 60.00%, Music: 52.83%)",
  "asr_librispeech": "1.6% WER (dev-clean), 3.5% WER (dev-other)",
  "common_voice_15": "7.6% WER (English), 5.2% WER (Chinese)",
  "fleurs": "3.0% WER (Chinese), 4.1% WER (English)",
  "covost2": "30.2 BLEU (en-de), 37.7 BLEU (de-en)",
  "mel_ser": "0.570 accuracy",
  "vocal_sound_vsc": "0.939 accuracy",
  "giant_steps_tempo": "0.88 accuracy",
  "music_caps": "0.328 CLIP Score",
  "mmau": "65.60% (Sound: 67.87%, Music: 69.16%, Speech: 59.76%)",
  "voice_bench": "4.49 AlpacaEval, 3.93 CommonEval, 55.71 SD-QA, 61.32 MMSU",
  "mmmu": "59.2% accuracy",
  "mmbench": "81.8% accuracy",
  "mmstar": "64.0% accuracy",
  "mme": "2340 score",
  "mvbench": "70.3% accuracy",
  "seed_tts": "1.42 content consistency, 0.754 speaker similarity"
} as const;

/**
 * Multimodal tips
 */
export const MULTIMODAL_TIPS = {
  "prompt_creation": "Use clear and specific prompts for better multimodal understanding",
  "media_quality": "Use high-quality media for optimal analysis results",
  "voice_selection": "Choose appropriate voice type for your content",
  "audio_generation": "Enable audio generation for voice responses",
  "video_audio": "Use audio in video for comprehensive video analysis",
  "system_prompt": "Use default system prompt for optimal audio output",
  "multimodal_integration": "Leverage multiple modalities for comprehensive analysis",
  "real_time_capabilities": "Use real-time capabilities for interactive applications",
  "streaming_support": "Take advantage of streaming for responsive experiences",
  "accessibility": "Use voice generation for accessibility features"
} as const;

export default executeQwenOmni;
