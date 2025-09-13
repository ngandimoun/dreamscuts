import Replicate from "replicate";

export interface TikTokShortCaptionsInput {
  video: string;
  caption_size?: number;
  highlight_color?: string;
  model?: 'large-v3';
  language?: string;
  temperature?: number;
  patience?: number;
  suppress_tokens?: string;
  initial_prompt?: string;
  condition_on_previous_text?: boolean;
  temperature_increment_on_fallback?: number;
  compression_ratio_threshold?: number;
  logprob_threshold?: number;
  no_speech_threshold?: number;
}

export interface TikTokShortCaptionsOutput {
  type: string;
}

export interface TikTokShortCaptionsOptions {
  webhookUrl?: string;
  webhookEventsFilter?: string[];
  onProgress?: (progress: any) => void;
}

/**
 * TikTok Short Captions Executor
 * 
 * TikTok Short Captions is a powerful video captioning tool specifically designed for 
 * TikTok-style content. It uses Whisper GPU for high-quality transcription and generates 
 * engaging, short-form captions with customizable highlighting colors and styling options 
 * optimized for social media platforms.
 * 
 * @param input - The TikTok-style captioning input parameters
 * @param options - Additional execution options
 * @returns Promise with the captioning result
 */
export async function executeTikTokShortCaptions(
  input: TikTokShortCaptionsInput,
  options: TikTokShortCaptionsOptions = {}
): Promise<string> {
  try {
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate required inputs
    if (!input.video || input.video.trim().length === 0) {
      throw new Error("Video file is required");
    }

    // Validate optional parameters
    if (input.caption_size !== undefined && (input.caption_size < 1 || input.caption_size > 200)) {
      throw new Error("Caption size must be between 1 and 200 words");
    }

    if (input.temperature !== undefined && (input.temperature < 0 || input.temperature > 1)) {
      throw new Error("Temperature must be between 0 and 1");
    }

    if (input.highlight_color !== undefined && !isValidHexColor(input.highlight_color)) {
      throw new Error("Highlight color must be a valid hex color code");
    }

    // Prepare the request payload
    const payload: any = {
      video: input.video.trim(),
    };

    // Add optional parameters with defaults
    if (input.caption_size !== undefined) payload.caption_size = input.caption_size;
    if (input.highlight_color !== undefined) payload.highlight_color = input.highlight_color;
    if (input.model !== undefined) payload.model = input.model;
    if (input.language !== undefined) payload.language = input.language;
    if (input.temperature !== undefined) payload.temperature = input.temperature;
    if (input.patience !== undefined) payload.patience = input.patience;
    if (input.suppress_tokens !== undefined) payload.suppress_tokens = input.suppress_tokens;
    if (input.initial_prompt !== undefined) payload.initial_prompt = input.initial_prompt;
    if (input.condition_on_previous_text !== undefined) payload.condition_on_previous_text = input.condition_on_previous_text;
    if (input.temperature_increment_on_fallback !== undefined) payload.temperature_increment_on_fallback = input.temperature_increment_on_fallback;
    if (input.compression_ratio_threshold !== undefined) payload.compression_ratio_threshold = input.compression_ratio_threshold;
    if (input.logprob_threshold !== undefined) payload.logprob_threshold = input.logprob_threshold;
    if (input.no_speech_threshold !== undefined) payload.no_speech_threshold = input.no_speech_threshold;

    // Execute the model
    const output = await replicate.run(
      "shreejalmaharjan-27/tiktok-short-captions:46bf1c12c77ad1782d6f87828d4d8ba4d48646b8e1271b490cb9e95ccdbc4504",
      {
        input: payload,
        webhook: options.webhookUrl,
        webhook_events_filter: options.webhookEventsFilter,
      }
    );

    return output as string;

  } catch (error) {
    console.error("TikTok Short Captions execution failed:", error);
    throw new Error(`TikTok Short Captions execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute TikTok Short Captions with prediction management for long-running tasks
 * 
 * @param input - The TikTok-style captioning input parameters
 * @param options - Additional execution options
 * @returns Promise with prediction object for tracking
 */
export async function executeTikTokShortCaptionsPrediction(
  input: TikTokShortCaptionsInput,
  options: TikTokShortCaptionsOptions = {}
): Promise<any> {
  try {
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate input (same validation as above)
    if (!input.video || input.video.trim().length === 0) {
      throw new Error("Video file is required");
    }

    if (input.caption_size !== undefined && (input.caption_size < 1 || input.caption_size > 200)) {
      throw new Error("Caption size must be between 1 and 200 words");
    }

    if (input.temperature !== undefined && (input.temperature < 0 || input.temperature > 1)) {
      throw new Error("Temperature must be between 0 and 1");
    }

    if (input.highlight_color !== undefined && !isValidHexColor(input.highlight_color)) {
      throw new Error("Highlight color must be a valid hex color code");
    }

    // Prepare the request payload
    const payload: any = {
      video: input.video.trim(),
    };

    // Add optional parameters
    if (input.caption_size !== undefined) payload.caption_size = input.caption_size;
    if (input.highlight_color !== undefined) payload.highlight_color = input.highlight_color;
    if (input.model !== undefined) payload.model = input.model;
    if (input.language !== undefined) payload.language = input.language;
    if (input.temperature !== undefined) payload.temperature = input.temperature;
    if (input.patience !== undefined) payload.patience = input.patience;
    if (input.suppress_tokens !== undefined) payload.suppress_tokens = input.suppress_tokens;
    if (input.initial_prompt !== undefined) payload.initial_prompt = input.initial_prompt;
    if (input.condition_on_previous_text !== undefined) payload.condition_on_previous_text = input.condition_on_previous_text;
    if (input.temperature_increment_on_fallback !== undefined) payload.temperature_increment_on_fallback = input.temperature_increment_on_fallback;
    if (input.compression_ratio_threshold !== undefined) payload.compression_ratio_threshold = input.compression_ratio_threshold;
    if (input.logprob_threshold !== undefined) payload.logprob_threshold = input.logprob_threshold;
    if (input.no_speech_threshold !== undefined) payload.no_speech_threshold = input.no_speech_threshold;

    // Create prediction
    const prediction = await replicate.predictions.create({
      model: "shreejalmaharjan-27/tiktok-short-captions:46bf1c12c77ad1782d6f87828d4d8ba4d48646b8e1271b490cb9e95ccdbc4504",
      input: payload,
      webhook: options.webhookUrl,
      webhook_events_filter: options.webhookEventsFilter,
    });

    return prediction;

  } catch (error) {
    console.error("TikTok Short Captions prediction creation failed:", error);
    throw new Error(`TikTok Short Captions prediction creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a TikTok Short Captions prediction
 * 
 * @param predictionId - The prediction ID from prediction creation
 * @returns Promise with prediction status
 */
export async function checkTikTokShortCaptionsStatus(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.get(predictionId);
    return prediction;

  } catch (error) {
    console.error("TikTok Short Captions status check failed:", error);
    throw new Error(`TikTok Short Captions status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Cancel a running TikTok Short Captions prediction
 * 
 * @param predictionId - The prediction ID to cancel
 * @returns Promise with cancellation result
 */
export async function cancelTikTokShortCaptionsPrediction(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.cancel(predictionId);
    return prediction;

  } catch (error) {
    console.error("TikTok Short Captions prediction cancellation failed:", error);
    throw new Error(`TikTok Short Captions prediction cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create TikTok-style captioning scenarios
 * 
 * @param type - Type of TikTok-style captioning scenario to create
 * @param customVideoUrl - Custom video URL (optional)
 * @param customOptions - Custom options (optional)
 * @returns TikTok Short Captions input configuration
 */
export function createTikTokCaptioningScenario(
  type: 'tiktok' | 'instagram_reels' | 'youtube_shorts' | 'viral_content' | 'multilingual' | 'brand_content' | 'educational' | 'entertainment' | 'marketing' | 'custom',
  customVideoUrl?: string,
  customOptions?: Partial<TikTokShortCaptionsInput>
): TikTokShortCaptionsInput {
  const scenarioTemplates = {
    tiktok: {
      video: customVideoUrl || "https://example.com/tiktok-video.mp4",
      caption_size: 50,
      highlight_color: "#39E508",
      language: "auto",
      temperature: 0,
      condition_on_previous_text: true
    },
    instagram_reels: {
      video: customVideoUrl || "https://example.com/reel.mp4",
      caption_size: 40,
      highlight_color: "#E1306C",
      language: "en",
      temperature: 0,
      condition_on_previous_text: true
    },
    youtube_shorts: {
      video: customVideoUrl || "https://example.com/short.mp4",
      caption_size: 60,
      highlight_color: "#FF0000",
      language: "auto",
      temperature: 0,
      condition_on_previous_text: true
    },
    viral_content: {
      video: customVideoUrl || "https://example.com/viral-video.mp4",
      caption_size: 30,
      highlight_color: "#39E508",
      language: "auto",
      temperature: 0.1,
      condition_on_previous_text: true
    },
    multilingual: {
      video: customVideoUrl || "https://example.com/spanish-video.mp4",
      caption_size: 50,
      highlight_color: "#39E508",
      language: "auto",
      temperature: 0,
      condition_on_previous_text: true
    },
    brand_content: {
      video: customVideoUrl || "https://example.com/brand-video.mp4",
      caption_size: 45,
      highlight_color: "#FF6B6B",
      language: "auto",
      temperature: 0,
      condition_on_previous_text: true
    },
    educational: {
      video: customVideoUrl || "https://example.com/educational-video.mp4",
      caption_size: 70,
      highlight_color: "#4ECDC4",
      language: "auto",
      temperature: 0,
      condition_on_previous_text: true
    },
    entertainment: {
      video: customVideoUrl || "https://example.com/entertainment-video.mp4",
      caption_size: 40,
      highlight_color: "#FFE66D",
      language: "auto",
      temperature: 0.1,
      condition_on_previous_text: true
    },
    marketing: {
      video: customVideoUrl || "https://example.com/marketing-video.mp4",
      caption_size: 35,
      highlight_color: "#A8E6CF",
      language: "auto",
      temperature: 0,
      condition_on_previous_text: true
    },
    custom: {
      video: customVideoUrl || "https://example.com/video.mp4",
      caption_size: 50,
      highlight_color: "#39E508",
      language: "auto",
      temperature: 0,
      condition_on_previous_text: true
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
 * Predefined configuration templates for different TikTok-style captioning scenarios
 */
export const TIKTOK_CAPTIONING_TEMPLATES = {
  "tiktok": {
    "description": "Optimized for TikTok platform",
    "settings": {
      "caption_size": 50,
      "highlight_color": "#39E508",
      "language": "auto",
      "temperature": 0
    }
  },
  "instagram_reels": {
    "description": "Optimized for Instagram Reels",
    "settings": {
      "caption_size": 40,
      "highlight_color": "#E1306C",
      "language": "en",
      "temperature": 0
    }
  },
  "youtube_shorts": {
    "description": "Optimized for YouTube Shorts",
    "settings": {
      "caption_size": 60,
      "highlight_color": "#FF0000",
      "language": "auto",
      "temperature": 0
    }
  },
  "viral_content": {
    "description": "Optimized for viral content",
    "settings": {
      "caption_size": 30,
      "highlight_color": "#39E508",
      "language": "auto",
      "temperature": 0.1
    }
  },
  "multilingual": {
    "description": "Optimized for multilingual content",
    "settings": {
      "caption_size": 50,
      "highlight_color": "#39E508",
      "language": "auto",
      "temperature": 0
    }
  },
  "brand_content": {
    "description": "Optimized for brand content",
    "settings": {
      "caption_size": 45,
      "highlight_color": "#FF6B6B",
      "language": "auto",
      "temperature": 0
    }
  },
  "educational": {
    "description": "Optimized for educational content",
    "settings": {
      "caption_size": 70,
      "highlight_color": "#4ECDC4",
      "language": "auto",
      "temperature": 0
    }
  },
  "entertainment": {
    "description": "Optimized for entertainment content",
    "settings": {
      "caption_size": 40,
      "highlight_color": "#FFE66D",
      "language": "auto",
      "temperature": 0.1
    }
  },
  "marketing": {
    "description": "Optimized for marketing content",
    "settings": {
      "caption_size": 35,
      "highlight_color": "#A8E6CF",
      "language": "auto",
      "temperature": 0
    }
  }
} as const;

/**
 * Example usage of the TikTok Short Captions executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic TikTok-style video captioning
    const result1 = await executeTikTokShortCaptions({
      video: "https://example.com/video.mp4",
      caption_size: 100
    });

    console.log("TikTok captioning result:", result1);

    // Example 2: Using helper function for TikTok
    const tiktokStyle = createTikTokCaptioningScenario('tiktok');
    const result2 = await executeTikTokShortCaptions(tiktokStyle);
    console.log("TikTok style captioning:", result2);

    // Example 3: Custom TikTok-style captioning with specific parameters
    const customCaptioning = createTikTokCaptioningScenario(
      'custom',
      "https://example.com/custom-video.mp4",
      { caption_size: 80, highlight_color: "#8A2BE2", language: "es" }
    );
    const result3 = await executeTikTokShortCaptions(customCaptioning);
    console.log("Custom captioning:", result3);

    // Example 4: Using predefined templates
    const result4 = await executeTikTokShortCaptions({
      video: "https://example.com/instagram-reel.mp4",
      ...TIKTOK_CAPTIONING_TEMPLATES.instagram_reels.settings
    });
    console.log("Instagram Reels captioning:", result4);

    // Example 5: Prediction usage for long-running tasks
    const prediction = await executeTikTokShortCaptionsPrediction({
      video: "https://example.com/long-video.mp4",
      caption_size: 100,
      highlight_color: "#39E508",
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Prediction ID:", prediction.id);

    // Check status
    const status = await checkTikTokShortCaptionsStatus(prediction.id);
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
  const costPerRun = 0.19;
  return runs * costPerRun;
}

/**
 * Utility function to validate video URL
 * 
 * @param url - The video URL to validate
 * @returns Validation result with suggestions
 */
export function validateVideoURL(url: string): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedURL: string; 
} {
  const suggestions: string[] = [];
  
  // Clean and format URL
  const formattedURL = url.trim();

  // Check for common issues
  if (!url || url.trim().length === 0) {
    suggestions.push("Video URL is required");
  }

  // Check for valid URL format
  try {
    new URL(url);
  } catch {
    suggestions.push("Video URL must be a valid URL");
  }

  // Check for valid video format
  if (!isValidVideoURL(url)) {
    suggestions.push("Video must be in supported format (MP4, AVI, MOV, WebM, MKV)");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedURL
  };
}

/**
 * Utility function to get optimal parameters for platform type
 * 
 * @param platformType - Type of social media platform
 * @returns Recommended parameters
 */
export function getOptimalParameters(platformType: 'tiktok' | 'instagram_reels' | 'youtube_shorts' | 'viral_content' | 'multilingual' | 'brand_content' | 'educational' | 'entertainment' | 'marketing'): {
  caption_size: number;
  highlight_color: string;
  language: string;
  temperature: number;
  description: string;
} {
  const parameterMap = {
    tiktok: { 
      caption_size: 50, 
      highlight_color: "#39E508",
      language: "auto",
      temperature: 0,
      description: "Optimized for TikTok platform"
    },
    instagram_reels: { 
      caption_size: 40, 
      highlight_color: "#E1306C",
      language: "en",
      temperature: 0,
      description: "Optimized for Instagram Reels"
    },
    youtube_shorts: { 
      caption_size: 60, 
      highlight_color: "#FF0000",
      language: "auto",
      temperature: 0,
      description: "Optimized for YouTube Shorts"
    },
    viral_content: { 
      caption_size: 30, 
      highlight_color: "#39E508",
      language: "auto",
      temperature: 0.1,
      description: "Optimized for viral content"
    },
    multilingual: { 
      caption_size: 50, 
      highlight_color: "#39E508",
      language: "auto",
      temperature: 0,
      description: "Optimized for multilingual content"
    },
    brand_content: { 
      caption_size: 45, 
      highlight_color: "#FF6B6B",
      language: "auto",
      temperature: 0,
      description: "Optimized for brand content"
    },
    educational: { 
      caption_size: 70, 
      highlight_color: "#4ECDC4",
      language: "auto",
      temperature: 0,
      description: "Optimized for educational content"
    },
    entertainment: { 
      caption_size: 40, 
      highlight_color: "#FFE66D",
      language: "auto",
      temperature: 0.1,
      description: "Optimized for entertainment content"
    },
    marketing: { 
      caption_size: 35, 
      highlight_color: "#A8E6CF",
      language: "auto",
      temperature: 0,
      description: "Optimized for marketing content"
    }
  };

  return parameterMap[platformType];
}

/**
 * Utility function to create batch TikTok-style captioning
 * 
 * @param videoUrlsArray - Array of video URLs
 * @param parametersArray - Array of parameter objects
 * @returns Array of TikTok Short Captions inputs
 */
export function createBatchTikTokCaptioning(
  videoUrlsArray: string[], 
  parametersArray: Partial<TikTokShortCaptionsInput>[]
): TikTokShortCaptionsInput[] {
  if (videoUrlsArray.length !== parametersArray.length) {
    throw new Error("Video URLs and parameters arrays must have the same length");
  }

  return videoUrlsArray.map((videoUrl, index) => ({
    video: videoUrl,
    ...parametersArray[index]
  }));
}

/**
 * Check if URL is a valid video format
 * 
 * @param url - The URL to check
 * @returns True if URL is a valid video format
 */
function isValidVideoURL(url: string): boolean {
  const videoExtensions = ['.mp4', '.avi', '.mov', '.webm', '.mkv'];
  return videoExtensions.some(ext => url.toLowerCase().includes(ext));
}

/**
 * Check if string is a valid hex color
 * 
 * @param color - The color string to check
 * @returns True if string is a valid hex color
 */
function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Supported video formats
 */
export const SUPPORTED_VIDEO_FORMATS = [
  "MP4",
  "AVI", 
  "MOV",
  "WebM",
  "MKV"
] as const;

/**
 * Supported languages
 */
export const SUPPORTED_LANGUAGES = [
  "auto", "af", "am", "ar", "as", "az", "ba", "be", "bg", "bn", "bo", "br", "bs", "ca", "cs", "cy", "da", "de", "el", "en", "es", "et", "eu", "fa", "fi", "fo", "fr", "gl", "gu", "ha", "haw", "he", "hi", "hr", "ht", "hu", "hy", "id", "is", "it", "ja", "jw", "ka", "kk", "km", "kn", "ko", "la", "lb", "ln", "lo", "lt", "lv", "mg", "mi", "mk", "ml", "mn", "mr", "ms", "mt", "my", "ne", "nl", "nn", "no", "oc", "pa", "pl", "ps", "pt", "ro", "ru", "sa", "sd", "si", "sk", "sl", "sn", "so", "sq", "sr", "su", "sv", "sw", "ta", "te", "tg", "th", "tk", "tl", "tr", "tt", "uk", "ur", "uz", "vi", "yi", "yo", "yue", "zh"
] as const;

/**
 * Common TikTok-style captioning scenarios
 */
export const TIKTOK_CAPTIONING_SCENARIOS = {
  "tiktok": "TikTok video captioning",
  "instagram_reels": "Instagram Reels captioning",
  "youtube_shorts": "YouTube Shorts captioning",
  "viral_content": "Viral content optimization",
  "multilingual": "Multilingual video captioning",
  "brand_content": "Brand content captioning",
  "educational": "Educational content captioning",
  "entertainment": "Entertainment content captioning",
  "marketing": "Marketing content captioning",
  "custom": "User-defined captioning scenarios"
} as const;

/**
 * Hardware requirements
 */
export const HARDWARE_REQUIREMENTS = {
  "gpu": "Nvidia A100 (80GB) GPU",
  "memory": "High memory requirements for video processing",
  "processing_power": "High computational requirements",
  "storage": "Temporary storage for video processing"
} as const;

/**
 * Benchmark performance
 */
export const BENCHMARK_PERFORMANCE = {
  "transcription_accuracy": "High accuracy automatic transcription with Whisper large-v3",
  "caption_timing": "Precise caption timing synchronization",
  "tiktok_formatting": "TikTok-style formatting and styling",
  "highlight_accuracy": "Accurate highlight color application",
  "caption_sizing": "Efficient caption size optimization",
  "language_detection": "Accurate automatic language detection",
  "gpu_processing": "Efficient GPU-accelerated processing",
  "social_optimization": "Social media platform optimization",
  "short_form_quality": "High-quality short-form content generation",
  "mobile_optimization": "Mobile-first captioning optimization",
  "viral_enhancement": "Viral content enhancement capabilities",
  "engagement_optimization": "Engagement-focused caption optimization",
  "platform_integration": "Platform-specific formatting",
  "creator_tools": "Content creator tool effectiveness",
  "marketing_optimization": "Social media marketing optimization",
  "accessibility": "Enhanced video accessibility",
  "performance_speed": "High-performance processing",
  "output_quality": "Professional video output quality",
  "format_compatibility": "Wide format compatibility",
  "error_handling": "Robust error handling and recovery"
} as const;

/**
 * TikTok-style captioning tips
 */
export const TIKTOK_CAPTIONING_TIPS = {
  "caption_size_optimization": "Use appropriate caption sizes for different platforms (30-50 for TikTok, 40-60 for Instagram Reels)",
  "highlight_color_optimization": "Choose highlight colors that match your brand or content theme",
  "language_optimization": "Use automatic language detection for multilingual content",
  "platform_optimization": "Optimize caption size based on target social media platform",
  "brand_consistency": "Use custom highlight colors for brand consistency",
  "engagement_testing": "Test different caption sizes to find optimal engagement",
  "temperature_optimization": "Use appropriate temperature settings for content consistency",
  "video_length_consideration": "Consider video length when setting caption size",
  "brand_colors": "Use brand colors for highlight customization",
  "mobile_optimization": "Optimize for mobile viewing experience",
  "viral_content": "Use short, punchy captions for viral content",
  "platform_formatting": "Consider platform-specific formatting requirements",
  "readability_optimization": "Use high contrast colors for better readability",
  "device_testing": "Test caption readability on different devices",
  "content_consistency": "Use consistent styling across content series",
  "engagement_metrics": "Optimize for social media engagement metrics",
  "accessibility_consideration": "Consider accessibility when choosing colors",
  "audience_targeting": "Use appropriate language settings for target audience",
  "color_testing": "Test different highlight colors for engagement",
  "timing_optimization": "Optimize caption timing for maximum impact"
} as const;

export default executeTikTokShortCaptions;
