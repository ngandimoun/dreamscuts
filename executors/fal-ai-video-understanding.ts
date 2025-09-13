import { fal } from "@fal-ai/client";

export interface VideoUnderstandingInput {
  video_url: string;
  prompt: string;
  detailed_analysis?: boolean;
}

export interface VideoUnderstandingOutput {
  output: string;
}

export interface VideoUnderstandingOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI Video Understanding Executor
 * 
 * A video understanding model to analyze video content and answer questions 
 * about what's happening in the video based on user prompts. Advanced video 
 * analysis with detailed content understanding and question answering capabilities.
 * 
 * @param input - The video analysis input parameters
 * @param options - Additional execution options
 * @returns Promise with the video analysis result
 */
export async function executeVideoUnderstanding(
  input: VideoUnderstandingInput,
  options: VideoUnderstandingOptions = {}
): Promise<VideoUnderstandingOutput | { error: string; success: false }> {
  try {
    // Validate required inputs
    if (!input.video_url || input.video_url.trim().length === 0) {
      throw new Error("Video URL is required");
    }

    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    // Validate prompt length
    if (input.prompt.length > 1000) {
      throw new Error("Prompt must be 1000 characters or less");
    }

    if (input.prompt.length < 1) {
      throw new Error("Prompt must be at least 1 character");
    }

    // Validate video URL format
    if (!isValidVideoURL(input.video_url)) {
      console.warn("⚠️ Video URL may not be in supported format:", input.video_url);
      // Don't throw, let Fal AI handle it and provide better error message
    }

    // Prepare the request payload
    const payload = {
      video_url: input.video_url.trim(),
      prompt: input.prompt.trim(),
      detailed_analysis: input.detailed_analysis !== undefined ? input.detailed_analysis : false
    };

    // Execute the model
    const result = await fal.subscribe("fal-ai/video-understanding", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as VideoUnderstandingOutput;

  } catch (error) {
    console.error("Fal AI Video Understanding execution failed:", error);
    
    // Log detailed error information for debugging
    if (error && typeof error === 'object' && 'body' in error) {
      console.error("Fal AI Error Details:", {
        status: (error as any).status,
        body: (error as any).body,
        input: payload
      });
    }
    
    // Return error response instead of throwing
    return {
      success: false,
      error: `Fal AI Video Understanding failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Execute Fal AI Video Understanding with queue management for batch processing
 * 
 * @param input - The video analysis input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeVideoUnderstandingQueue(
  input: VideoUnderstandingInput,
  options: VideoUnderstandingOptions = {}
): Promise<{ request_id: string }> {
  try {
    // Validate input (same validation as above)
    if (!input.video_url || input.video_url.trim().length === 0) {
      throw new Error("Video URL is required");
    }

    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (input.prompt.length > 1000) {
      throw new Error("Prompt must be 1000 characters or less");
    }

    if (input.prompt.length < 1) {
      throw new Error("Prompt must be at least 1 character");
    }

    if (!isValidVideoURL(input.video_url)) {
      throw new Error("Video must be in supported format (MP4, MOV, WEBM, M4V, GIF)");
    }

    // Prepare the request payload
    const payload = {
      video_url: input.video_url.trim(),
      prompt: input.prompt.trim(),
      detailed_analysis: input.detailed_analysis !== undefined ? input.detailed_analysis : false
    };

    // Submit to queue
    const { request_id } = await fal.queue.submit("fal-ai/video-understanding", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("Fal AI Video Understanding queue submission failed:", error);
    throw new Error(`Fal AI Video Understanding queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued Fal AI Video Understanding request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkVideoUnderstandingStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/video-understanding", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("Fal AI Video Understanding status check failed:", error);
    throw new Error(`Fal AI Video Understanding status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed Fal AI Video Understanding request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the video analysis result
 */
export async function getVideoUnderstandingResult(
  requestId: string
): Promise<VideoUnderstandingOutput> {
  try {
    const result = await fal.queue.result("fal-ai/video-understanding", {
      requestId
    });

    return result.data as VideoUnderstandingOutput;

  } catch (error) {
    console.error("Fal AI Video Understanding result retrieval failed:", error);
    throw new Error(`Fal AI Video Understanding result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create video analysis scenarios
 * 
 * @param type - Type of video analysis scenario to create
 * @param customVideoUrl - Custom video URL (optional)
 * @param customPrompt - Custom prompt (optional)
 * @param customOptions - Custom options (optional)
 * @returns Video Understanding input configuration
 */
export function createVideoAnalysisScenario(
  type: 'content_analysis' | 'scene_description' | 'object_detection' | 'action_recognition' | 'educational' | 'entertainment' | 'marketing' | 'security' | 'custom',
  customVideoUrl?: string,
  customPrompt?: string,
  customOptions?: Partial<VideoUnderstandingInput>
): VideoUnderstandingInput {
  const scenarioTemplates = {
    content_analysis: {
      video_url: customVideoUrl || "https://v3.fal.media/files/elephant/mLAMkUTxFMbe2xF0qpLdA_Ll9mDE8webFA6GAu3vD_M_71ee7217db1d4aa4af1d2f1ae060389b.mp4",
      prompt: customPrompt || "What is happening in this video?",
      detailed_analysis: false
    },
    scene_description: {
      video_url: customVideoUrl || "https://example.com/nature-video.mp4",
      prompt: customPrompt || "Describe the setting and environment shown in this video",
      detailed_analysis: true
    },
    object_detection: {
      video_url: customVideoUrl || "https://example.com/street-video.mp4",
      prompt: customPrompt || "What objects and people can you see in this video?",
      detailed_analysis: true
    },
    action_recognition: {
      video_url: customVideoUrl || "https://example.com/sports-video.mp4",
      prompt: customPrompt || "What actions and activities are taking place in this video?",
      detailed_analysis: true
    },
    educational: {
      video_url: customVideoUrl || "https://example.com/lecture-video.mp4",
      prompt: customPrompt || "What educational content is being presented in this video?",
      detailed_analysis: true
    },
    entertainment: {
      video_url: customVideoUrl || "https://example.com/movie-clip.mp4",
      prompt: customPrompt || "What entertainment elements are present in this video?",
      detailed_analysis: false
    },
    marketing: {
      video_url: customVideoUrl || "https://example.com/advertisement.mp4",
      prompt: customPrompt || "What marketing messages and products are featured in this video?",
      detailed_analysis: true
    },
    security: {
      video_url: customVideoUrl || "https://example.com/surveillance.mp4",
      prompt: customPrompt || "What security-related activities or events are shown in this video?",
      detailed_analysis: true
    },
    custom: {
      video_url: customVideoUrl || "https://example.com/custom-video.mp4",
      prompt: customPrompt || "Analyze this video content and provide insights",
      detailed_analysis: false
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
 * Predefined prompt templates for different video analysis scenarios
 */
export const PROMPT_TEMPLATES = {
  "content_analysis": [
    "What is happening in this video?",
    "Describe the main content and activities shown in this video",
    "What is the primary focus of this video?"
  ],
  "scene_description": [
    "Describe the setting and environment shown in this video",
    "What is the location and context of this video?",
    "Describe the visual elements and atmosphere of this video"
  ],
  "object_detection": [
    "What objects and people can you see in this video?",
    "Identify all the visible objects and entities in this video",
    "What items, people, or objects are present in this video?"
  ],
  "action_recognition": [
    "What actions and activities are taking place in this video?",
    "Describe the movements and activities shown in this video",
    "What is happening in terms of actions and behaviors in this video?"
  ],
  "educational": [
    "What educational content is being presented in this video?",
    "What learning objectives or educational topics are covered in this video?",
    "Describe the educational value and content of this video"
  ],
  "entertainment": [
    "What entertainment elements are present in this video?",
    "Describe the entertainment value and content of this video",
    "What makes this video entertaining or engaging?"
  ],
  "marketing": [
    "What marketing messages and products are featured in this video?",
    "What promotional content or advertising elements are shown in this video?",
    "Describe the marketing and promotional aspects of this video"
  ],
  "security": [
    "What security-related activities or events are shown in this video?",
    "Describe any security concerns or incidents visible in this video",
    "What safety or security elements are present in this video?"
  ]
} as const;

/**
 * Example usage of the Fal AI Video Understanding executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic video content analysis
    const result1 = await executeVideoUnderstanding({
      video_url: "https://v3.fal.media/files/elephant/mLAMkUTxFMbe2xF0qpLdA_Ll9mDE8webFA6GAu3vD_M_71ee7217db1d4aa4af1d2f1ae060389b.mp4",
      prompt: "What is happening in this video?",
      detailed_analysis: false
    });

    console.log("Video analysis:", result1.output);

    // Example 2: Using helper function for scene description
    const sceneAnalysis = createVideoAnalysisScenario('scene_description');
    const result2 = await executeVideoUnderstanding(sceneAnalysis);
    console.log("Scene analysis:", result2.output);

    // Example 3: Custom video analysis with detailed analysis
    const customAnalysis = createVideoAnalysisScenario(
      'custom',
      "https://example.com/cooking-video.mp4",
      "What ingredients are being used in this cooking video and what cooking techniques are demonstrated?",
      { detailed_analysis: true }
    );
    const result3 = await executeVideoUnderstanding(customAnalysis);
    console.log("Custom analysis:", result3.output);

    // Example 4: Using predefined templates
    const result4 = await executeVideoUnderstanding({
      video_url: "https://example.com/sports-video.mp4",
      prompt: PROMPT_TEMPLATES.action_recognition[0],
      detailed_analysis: true
    });
    console.log("Action recognition:", result4.output);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeVideoUnderstandingQueue({
      video_url: "https://example.com/educational-video.mp4",
      prompt: "What educational content is being presented in this video?",
      detailed_analysis: true,
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkVideoUnderstandingStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getVideoUnderstandingResult(request_id);
      console.log("Queue result:", result);
    }

  } catch (error) {
    console.error("Example execution failed:", error);
  }
}

/**
 * Utility function to estimate processing cost
 * 
 * @param videoDurationSeconds - Duration of video in seconds
 * @returns Estimated cost in USD
 */
export function estimateProcessingCost(videoDurationSeconds: number): number {
  const costPer5Seconds = 0.01;
  return Math.ceil(videoDurationSeconds / 5) * costPer5Seconds;
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
  if (prompt.length > 1000) {
    suggestions.push("Prompt is too long (max 1000 characters)");
  }

  if (prompt.length < 1) {
    suggestions.push("Prompt is too short, consider adding more specific questions");
  }

  // Check for proper formatting
  const hasQuestionMark = /\?/.test(prompt);
  const hasSpecificWords = /(what|how|where|when|why|who|describe|identify|analyze)/i.test(prompt);
  
  if (!hasQuestionMark && !hasSpecificWords) {
    suggestions.push("Consider using question words or action verbs for better analysis");
  }
  
  if (prompt.length < 10) {
    suggestions.push("Consider making your prompt more specific for better results");
  }

  // Check for very long sentences
  const sentences = prompt.split(/[.!?]+/);
  const longSentences = sentences.filter(sentence => sentence.trim().length > 100);
  if (longSentences.length > 0) {
    suggestions.push("Consider breaking up very long sentences for better analysis");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedPrompt
  };
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

  // Check for valid video format
  if (!isValidVideoURL(url)) {
    suggestions.push("Video must be in supported format (MP4, MOV, WEBM, M4V, GIF)");
  }

  // Check for valid URL format
  try {
    new URL(url);
  } catch {
    suggestions.push("Video URL must be a valid URL");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedURL
  };
}

/**
 * Utility function to get optimal analysis settings for video type
 * 
 * @param videoType - Type of video content
 * @returns Recommended analysis settings
 */
export function getOptimalAnalysisSettings(videoType: 'content_analysis' | 'scene_description' | 'object_detection' | 'action_recognition' | 'educational' | 'entertainment' | 'marketing' | 'security'): {
  detailed_analysis: boolean;
  prompt_suggestions: string[];
} {
  const settingsMap = {
    content_analysis: { 
      detailed_analysis: false, 
      prompt_suggestions: ["What is happening in this video?", "Describe the main content and activities shown in this video"] 
    },
    scene_description: { 
      detailed_analysis: true, 
      prompt_suggestions: ["Describe the setting and environment shown in this video", "What is the location and context of this video?"] 
    },
    object_detection: { 
      detailed_analysis: true, 
      prompt_suggestions: ["What objects and people can you see in this video?", "Identify all the visible objects and entities in this video"] 
    },
    action_recognition: { 
      detailed_analysis: true, 
      prompt_suggestions: ["What actions and activities are taking place in this video?", "Describe the movements and activities shown in this video"] 
    },
    educational: { 
      detailed_analysis: true, 
      prompt_suggestions: ["What educational content is being presented in this video?", "What learning objectives or educational topics are covered in this video?"] 
    },
    entertainment: { 
      detailed_analysis: false, 
      prompt_suggestions: ["What entertainment elements are present in this video?", "Describe the entertainment value and content of this video"] 
    },
    marketing: { 
      detailed_analysis: true, 
      prompt_suggestions: ["What marketing messages and products are featured in this video?", "What promotional content or advertising elements are shown in this video?"] 
    },
    security: { 
      detailed_analysis: true, 
      prompt_suggestions: ["What security-related activities or events are shown in this video?", "Describe any security concerns or incidents visible in this video"] 
    }
  };

  return settingsMap[videoType];
}

/**
 * Utility function to enhance prompt for better video analysis
 * 
 * @param prompt - Base prompt to enhance
 * @param enhancements - Enhancement options
 * @returns Enhanced prompt
 */
export function enhancePromptForVideoAnalysis(
  prompt: string, 
  enhancements: {
    addSpecificity?: boolean;
    addContext?: boolean;
    addDetail?: boolean;
    addTimeframe?: boolean;
  } = {}
): string {
  let enhancedPrompt = prompt.trim();

  // Add specificity
  if (enhancements.addSpecificity) {
    if (!/(what|how|where|when|why|who|describe|identify|analyze)/i.test(enhancedPrompt)) {
      enhancedPrompt = `What ${enhancedPrompt.toLowerCase()}`;
    }
  }

  // Add context
  if (enhancements.addContext) {
    if (!/(video|clip|footage|scene)/i.test(enhancedPrompt)) {
      enhancedPrompt = `${enhancedPrompt} in this video`;
    }
  }

  // Add detail
  if (enhancements.addDetail) {
    if (!/(detailed|specific|comprehensive)/i.test(enhancedPrompt)) {
      enhancedPrompt = `Provide a detailed analysis of ${enhancedPrompt.toLowerCase()}`;
    }
  }

  // Add timeframe
  if (enhancements.addTimeframe) {
    if (!/(throughout|during|at the beginning|at the end)/i.test(enhancedPrompt)) {
      enhancedPrompt = `${enhancedPrompt} throughout the video`;
    }
  }

  return enhancedPrompt;
}

/**
 * Utility function to generate random prompt
 * 
 * @param scenario - Video analysis scenario
 * @returns Random prompt from the scenario
 */
export function generateRandomPrompt(scenario: keyof typeof PROMPT_TEMPLATES): string {
  const prompts = PROMPT_TEMPLATES[scenario];
  const randomIndex = Math.floor(Math.random() * prompts.length);
  return prompts[randomIndex];
}

/**
 * Utility function to create batch video analysis
 * 
 * @param videoUrlsArray - Array of video URLs
 * @param promptsArray - Array of prompts
 * @param detailedAnalysisArray - Array of detailed analysis flags
 * @returns Array of Video Understanding inputs
 */
export function createBatchVideoAnalysis(
  videoUrlsArray: string[], 
  promptsArray: string[],
  detailedAnalysisArray: boolean[]
): VideoUnderstandingInput[] {
  if (videoUrlsArray.length !== promptsArray.length || videoUrlsArray.length !== detailedAnalysisArray.length) {
    throw new Error("Video URLs, prompts, and detailed analysis arrays must have the same length");
  }

  return videoUrlsArray.map((videoUrl, index) => ({
    video_url: videoUrl,
    prompt: promptsArray[index],
    detailed_analysis: detailedAnalysisArray[index]
  }));
}

/**
 * Check if URL is a valid video format
 * 
 * @param url - The URL to check
 * @returns True if URL is a valid video format
 */
function isValidVideoURL(url: string): boolean {
  const videoExtensions = ['.mp4', '.mov', '.webm', '.m4v', '.gif'];
  return videoExtensions.some(ext => url.toLowerCase().includes(ext));
}

/**
 * Supported video formats
 */
export const SUPPORTED_VIDEO_FORMATS = [
  "MP4",
  "MOV",
  "WEBM",
  "M4V",
  "GIF"
] as const;

/**
 * Analysis type descriptions
 */
export const ANALYSIS_TYPE_DESCRIPTIONS = {
  "basic_analysis": {
    description: "Standard video content analysis",
    best_for: "General video understanding, basic content analysis",
    quality: "High",
    speed: "Fast"
  },
  "detailed_analysis": {
    description: "Comprehensive video analysis with detailed insights",
    best_for: "Complex video content, detailed content analysis",
    quality: "Very High",
    speed: "Moderate"
  }
} as const;

/**
 * Common video analysis scenarios
 */
export const VIDEO_ANALYSIS_SCENARIOS = {
  "content_analysis": "Analyze general video content",
  "scene_description": "Describe video scenes and environments",
  "object_detection": "Detect objects and people in video",
  "action_recognition": "Recognize actions and activities in video",
  "educational": "Analyze educational video content",
  "entertainment": "Analyze entertainment video content",
  "marketing": "Analyze marketing and promotional video content",
  "security": "Analyze security and surveillance video content"
} as const;

/**
 * Video format requirements
 */
export const VIDEO_FORMAT_REQUIREMENTS = {
  "formats": ["MP4", "MOV", "WEBM", "M4V", "GIF"],
  "quality": "High-quality video for better analysis results",
  "resolution": "Any resolution, but higher resolution may provide better results",
  "content": "Should contain clear visual content for optimal analysis",
  "accessibility": "Video URL must be publicly accessible"
} as const;

/**
 * Video analysis tips
 */
export const VIDEO_ANALYSIS_TIPS = {
  "prompt_creation": "Use clear and specific prompts for better analysis results",
  "video_quality": "Use high-quality video for optimal analysis results",
  "detailed_analysis": "Enable detailed analysis for comprehensive video understanding",
  "prompt_specificity": "Ask specific questions about video content for targeted analysis",
  "video_format": "Use supported video formats (MP4, MOV, WEBM, M4V, GIF) for best results"
} as const;

export default executeVideoUnderstanding;
