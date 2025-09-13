import Replicate from "replicate";

export interface VideoLLaMA3Input {
  video: string;
  prompt: string;
  fps?: number;
  top_p?: number;
  max_frames?: number;
  temperature?: number;
  max_new_tokens?: number;
}

export interface VideoLLaMA3Output {
  type: string;
}

export interface VideoLLaMA3Options {
  webhookUrl?: string;
  webhookEventsFilter?: string[];
  onProgress?: (progress: any) => void;
}

/**
 * VideoLLaMA 3-7B Executor
 * 
 * VideoLLaMA 3 represents a state-of-the-art series of multimodal foundation models 
 * designed to excel in both image and video understanding tasks. Leveraging advanced 
 * architectures, VideoLLaMA 3 demonstrates exceptional capabilities in processing 
 * and interpreting visual content across various contexts.
 * 
 * @param input - The video analysis input parameters
 * @param options - Additional execution options
 * @returns Promise with the video analysis result
 */
export async function executeVideoLLaMA3(
  input: VideoLLaMA3Input,
  options: VideoLLaMA3Options = {}
): Promise<string> {
  try {
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate required inputs
    if (!input.video || input.video.trim().length === 0) {
      throw new Error("Video is required");
    }

    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    // Validate optional parameters
    if (input.fps !== undefined && (input.fps < 1 || input.fps > 10)) {
      throw new Error("FPS must be between 1 and 10");
    }

    if (input.top_p !== undefined && (input.top_p < 0 || input.top_p > 1)) {
      throw new Error("Top-p must be between 0 and 1");
    }

    if (input.max_frames !== undefined && (input.max_frames < 1 || input.max_frames > 256)) {
      throw new Error("Max frames must be between 1 and 256");
    }

    if (input.temperature !== undefined && (input.temperature < 0 || input.temperature > 1)) {
      throw new Error("Temperature must be between 0 and 1");
    }

    if (input.max_new_tokens !== undefined && (input.max_new_tokens < 1 || input.max_new_tokens > 4096)) {
      throw new Error("Max new tokens must be between 1 and 4096");
    }

    // Prepare the request payload
    const payload: any = {
      video: input.video.trim(),
      prompt: input.prompt.trim(),
    };

    // Add optional parameters with defaults
    if (input.fps !== undefined) payload.fps = input.fps;
    if (input.top_p !== undefined) payload.top_p = input.top_p;
    if (input.max_frames !== undefined) payload.max_frames = input.max_frames;
    if (input.temperature !== undefined) payload.temperature = input.temperature;
    if (input.max_new_tokens !== undefined) payload.max_new_tokens = input.max_new_tokens;

    // Execute the model
    const output = await replicate.run(
      "lucataco/videollama3-7b:34a1f45f7068f7121a5b47c91f2d7e06c298850767f76f96660450a0a3bd5bbe",
      {
        input: payload,
        webhook: options.webhookUrl,
        webhook_events_filter: options.webhookEventsFilter,
      }
    );

    return output as string;

  } catch (error) {
    console.error("VideoLLaMA 3 execution failed:", error);
    throw new Error(`VideoLLaMA 3 execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute VideoLLaMA 3 with prediction management for long-running tasks
 * 
 * @param input - The video analysis input parameters
 * @param options - Additional execution options
 * @returns Promise with prediction object for tracking
 */
export async function executeVideoLLaMA3Prediction(
  input: VideoLLaMA3Input,
  options: VideoLLaMA3Options = {}
): Promise<any> {
  try {
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate input (same validation as above)
    if (!input.video || input.video.trim().length === 0) {
      throw new Error("Video is required");
    }

    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (input.fps !== undefined && (input.fps < 1 || input.fps > 10)) {
      throw new Error("FPS must be between 1 and 10");
    }

    if (input.top_p !== undefined && (input.top_p < 0 || input.top_p > 1)) {
      throw new Error("Top-p must be between 0 and 1");
    }

    if (input.max_frames !== undefined && (input.max_frames < 1 || input.max_frames > 256)) {
      throw new Error("Max frames must be between 1 and 256");
    }

    if (input.temperature !== undefined && (input.temperature < 0 || input.temperature > 1)) {
      throw new Error("Temperature must be between 0 and 1");
    }

    if (input.max_new_tokens !== undefined && (input.max_new_tokens < 1 || input.max_new_tokens > 4096)) {
      throw new Error("Max new tokens must be between 1 and 4096");
    }

    // Prepare the request payload
    const payload: any = {
      video: input.video.trim(),
      prompt: input.prompt.trim(),
    };

    // Add optional parameters
    if (input.fps !== undefined) payload.fps = input.fps;
    if (input.top_p !== undefined) payload.top_p = input.top_p;
    if (input.max_frames !== undefined) payload.max_frames = input.max_frames;
    if (input.temperature !== undefined) payload.temperature = input.temperature;
    if (input.max_new_tokens !== undefined) payload.max_new_tokens = input.max_new_tokens;

    // Create prediction
    const prediction = await replicate.predictions.create({
      model: "lucataco/videollama3-7b:34a1f45f7068f7121a5b47c91f2d7e06c298850767f76f96660450a0a3bd5bbe",
      input: payload,
      webhook: options.webhookUrl,
      webhook_events_filter: options.webhookEventsFilter,
    });

    return prediction;

  } catch (error) {
    console.error("VideoLLaMA 3 prediction creation failed:", error);
    throw new Error(`VideoLLaMA 3 prediction creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a VideoLLaMA 3 prediction
 * 
 * @param predictionId - The prediction ID from prediction creation
 * @returns Promise with prediction status
 */
export async function checkVideoLLaMA3Status(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.get(predictionId);
    return prediction;

  } catch (error) {
    console.error("VideoLLaMA 3 status check failed:", error);
    throw new Error(`VideoLLaMA 3 status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Cancel a running VideoLLaMA 3 prediction
 * 
 * @param predictionId - The prediction ID to cancel
 * @returns Promise with cancellation result
 */
export async function cancelVideoLLaMA3Prediction(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.cancel(predictionId);
    return prediction;

  } catch (error) {
    console.error("VideoLLaMA 3 prediction cancellation failed:", error);
    throw new Error(`VideoLLaMA 3 prediction cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create video analysis scenarios
 * 
 * @param type - Type of video analysis scenario to create
 * @param customVideoUrl - Custom video URL (optional)
 * @param customPrompt - Custom prompt (optional)
 * @param customOptions - Custom options (optional)
 * @returns VideoLLaMA 3 input configuration
 */
export function createVideoAnalysisScenario(
  type: 'content_analysis' | 'anomaly_detection' | 'summarization' | 'question_answering' | 'educational' | 'surveillance' | 'entertainment' | 'sports' | 'cooking' | 'custom',
  customVideoUrl?: string,
  customPrompt?: string,
  customOptions?: Partial<VideoLLaMA3Input>
): VideoLLaMA3Input {
  const scenarioTemplates = {
    content_analysis: {
      video: customVideoUrl || "https://replicate.delivery/pbxt/MV1tNGskZ6lDM0iDmHelOin3dAvOmsbSGQUW6KYhhwKiQMUT/bear.mp4",
      prompt: customPrompt || "What is happening in this video?",
      fps: 1,
      temperature: 0.2,
      max_new_tokens: 2048
    },
    anomaly_detection: {
      video: customVideoUrl || "https://example.com/surveillance-video.mp4",
      prompt: customPrompt || "Identify any unusual or suspicious activities in this video.",
      fps: 1,
      temperature: 0.1,
      max_frames: 180,
      max_new_tokens: 512
    },
    summarization: {
      video: customVideoUrl || "https://example.com/long-video.mp4",
      prompt: customPrompt || "Provide a detailed summary of this video.",
      fps: 2,
      temperature: 0.2,
      max_frames: 120,
      max_new_tokens: 1024
    },
    question_answering: {
      video: customVideoUrl || "https://example.com/educational-video.mp4",
      prompt: customPrompt || "Answer questions about the content shown in this video.",
      fps: 1,
      temperature: 0.1,
      max_new_tokens: 1024
    },
    educational: {
      video: customVideoUrl || "https://example.com/lecture-video.mp4",
      prompt: customPrompt || "Explain the educational content shown in this video.",
      fps: 1,
      temperature: 0.1,
      max_new_tokens: 1536
    },
    surveillance: {
      video: customVideoUrl || "https://example.com/security-video.mp4",
      prompt: customPrompt || "Analyze this surveillance footage for security purposes.",
      fps: 1,
      temperature: 0.1,
      max_frames: 180,
      max_new_tokens: 512
    },
    entertainment: {
      video: customVideoUrl || "https://example.com/movie-clip.mp4",
      prompt: customPrompt || "Describe the entertainment value and content of this video.",
      fps: 2,
      temperature: 0.3,
      max_new_tokens: 1024
    },
    sports: {
      video: customVideoUrl || "https://example.com/sports-video.mp4",
      prompt: customPrompt || "Analyze the sports action and provide commentary.",
      fps: 3,
      temperature: 0.2,
      max_frames: 120,
      max_new_tokens: 1024
    },
    cooking: {
      video: customVideoUrl || "https://example.com/cooking-video.mp4",
      prompt: customPrompt || "Describe the cooking process shown in this video step by step.",
      fps: 2,
      temperature: 0.1,
      max_frames: 120,
      max_new_tokens: 1024
    },
    custom: {
      video: customVideoUrl || "https://example.com/custom-video.mp4",
      prompt: customPrompt || "Analyze this video content and provide insights.",
      fps: 1,
      temperature: 0.2,
      max_new_tokens: 2048
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
    "What is the primary focus of this video?",
    "Analyze the visual content of this video"
  ],
  "anomaly_detection": [
    "Identify any unusual or suspicious activities in this video.",
    "What anomalies or unexpected events can you detect?",
    "Are there any unusual behaviors or activities in this video?",
    "Detect any irregularities or suspicious patterns in this video."
  ],
  "summarization": [
    "Provide a detailed summary of this video.",
    "Summarize the key points and events in this video.",
    "Give me a comprehensive overview of this video content.",
    "What are the main highlights of this video?"
  ],
  "question_answering": [
    "Answer questions about the content shown in this video.",
    "What can you tell me about the events in this video?",
    "Explain what is happening in this video.",
    "Provide information about the content of this video."
  ],
  "educational": [
    "Explain the educational content shown in this video.",
    "What educational value does this video provide?",
    "Describe the learning objectives demonstrated in this video.",
    "What can be learned from watching this video?"
  ],
  "surveillance": [
    "Analyze this surveillance footage for security purposes.",
    "What security-related information can you extract from this video?",
    "Identify any security concerns or incidents in this video.",
    "Analyze this video for security and safety purposes."
  ],
  "entertainment": [
    "Describe the entertainment value and content of this video.",
    "What makes this video entertaining or engaging?",
    "Analyze the entertainment elements in this video.",
    "What entertainment value does this video provide?"
  ],
  "sports": [
    "Analyze the sports action and provide commentary.",
    "What sports activities are shown in this video?",
    "Describe the athletic performance in this video.",
    "Provide sports analysis and commentary for this video."
  ],
  "cooking": [
    "Describe the cooking process shown in this video step by step.",
    "What cooking techniques are demonstrated in this video?",
    "Explain the recipe and cooking method shown in this video.",
    "What ingredients and cooking steps are shown in this video?"
  ]
} as const;

/**
 * Example usage of the VideoLLaMA 3 executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic video content analysis
    const result1 = await executeVideoLLaMA3({
      video: "https://replicate.delivery/pbxt/MV1tNGskZ6lDM0iDmHelOin3dAvOmsbSGQUW6KYhhwKiQMUT/bear.mp4",
      prompt: "What is unusual in the video?",
      fps: 1,
      temperature: 0.2,
      max_new_tokens: 2048
    });

    console.log("Video analysis:", result1);

    // Example 2: Using helper function for anomaly detection
    const anomalyDetection = createVideoAnalysisScenario('anomaly_detection');
    const result2 = await executeVideoLLaMA3(anomalyDetection);
    console.log("Anomaly detection:", result2);

    // Example 3: Custom video analysis with specific parameters
    const customAnalysis = createVideoAnalysisScenario(
      'custom',
      "https://example.com/cooking-video.mp4",
      "Describe the cooking process shown in this video step by step.",
      { fps: 2, temperature: 0.1, max_frames: 120, max_new_tokens: 1024 }
    );
    const result3 = await executeVideoLLaMA3(customAnalysis);
    console.log("Custom analysis:", result3);

    // Example 4: Using predefined templates
    const result4 = await executeVideoLLaMA3({
      video: "https://example.com/sports-video.mp4",
      prompt: PROMPT_TEMPLATES.sports[0],
      fps: 3,
      temperature: 0.2,
      max_frames: 120,
      max_new_tokens: 1024
    });
    console.log("Sports analysis:", result4);

    // Example 5: Prediction usage for long-running tasks
    const prediction = await executeVideoLLaMA3Prediction({
      video: "https://example.com/long-video.mp4",
      prompt: "Provide a comprehensive analysis of this video.",
      fps: 1,
      temperature: 0.2,
      max_frames: 180,
      max_new_tokens: 2048,
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Prediction ID:", prediction.id);

    // Check status
    const status = await checkVideoLLaMA3Status(prediction.id);
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
  const costPerRun = 0.011;
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
  const hasSpecificWords = /(what|how|where|when|why|who|describe|analyze|explain|identify|detect)/i.test(prompt);
  
  if (!hasQuestionMark && !hasSpecificWords) {
    suggestions.push("Consider using question words or action verbs for better analysis");
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
 * Utility function to get optimal parameters for video type
 * 
 * @param videoType - Type of video content
 * @returns Recommended parameters
 */
export function getOptimalParameters(videoType: 'content_analysis' | 'anomaly_detection' | 'summarization' | 'question_answering' | 'educational' | 'surveillance' | 'entertainment' | 'sports' | 'cooking'): {
  fps: number;
  temperature: number;
  max_frames: number;
  max_new_tokens: number;
  top_p: number;
  prompt_suggestions: string[];
} {
  const parameterMap = {
    content_analysis: { 
      fps: 1, 
      temperature: 0.2, 
      max_frames: 180, 
      max_new_tokens: 2048, 
      top_p: 0.9,
      prompt_suggestions: ["What is happening in this video?", "Describe the main content and activities shown in this video"] 
    },
    anomaly_detection: { 
      fps: 1, 
      temperature: 0.1, 
      max_frames: 180, 
      max_new_tokens: 512, 
      top_p: 0.8,
      prompt_suggestions: ["Identify any unusual or suspicious activities in this video.", "What anomalies or unexpected events can you detect?"] 
    },
    summarization: { 
      fps: 2, 
      temperature: 0.2, 
      max_frames: 120, 
      max_new_tokens: 1024, 
      top_p: 0.9,
      prompt_suggestions: ["Provide a detailed summary of this video.", "Summarize the key points and events in this video."] 
    },
    question_answering: { 
      fps: 1, 
      temperature: 0.1, 
      max_frames: 180, 
      max_new_tokens: 1024, 
      top_p: 0.8,
      prompt_suggestions: ["Answer questions about the content shown in this video.", "What can you tell me about the events in this video?"] 
    },
    educational: { 
      fps: 1, 
      temperature: 0.1, 
      max_frames: 180, 
      max_new_tokens: 1536, 
      top_p: 0.8,
      prompt_suggestions: ["Explain the educational content shown in this video.", "What educational value does this video provide?"] 
    },
    surveillance: { 
      fps: 1, 
      temperature: 0.1, 
      max_frames: 180, 
      max_new_tokens: 512, 
      top_p: 0.8,
      prompt_suggestions: ["Analyze this surveillance footage for security purposes.", "What security-related information can you extract from this video?"] 
    },
    entertainment: { 
      fps: 2, 
      temperature: 0.3, 
      max_frames: 120, 
      max_new_tokens: 1024, 
      top_p: 0.9,
      prompt_suggestions: ["Describe the entertainment value and content of this video.", "What makes this video entertaining or engaging?"] 
    },
    sports: { 
      fps: 3, 
      temperature: 0.2, 
      max_frames: 120, 
      max_new_tokens: 1024, 
      top_p: 0.9,
      prompt_suggestions: ["Analyze the sports action and provide commentary.", "What sports activities are shown in this video?"] 
    },
    cooking: { 
      fps: 2, 
      temperature: 0.1, 
      max_frames: 120, 
      max_new_tokens: 1024, 
      top_p: 0.8,
      prompt_suggestions: ["Describe the cooking process shown in this video step by step.", "What cooking techniques are demonstrated in this video?"] 
    }
  };

  return parameterMap[videoType];
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
    addTemporal?: boolean;
  } = {}
): string {
  let enhancedPrompt = prompt.trim();

  // Add specificity
  if (enhancements.addSpecificity) {
    if (!/(what|how|where|when|why|who|describe|analyze|explain|identify|detect)/i.test(enhancedPrompt)) {
      enhancedPrompt = `Please ${enhancedPrompt.toLowerCase()}`;
    }
  }

  // Add context
  if (enhancements.addContext) {
    if (!/(video|footage|clip|content)/i.test(enhancedPrompt)) {
      enhancedPrompt = `${enhancedPrompt} in this video`;
    }
  }

  // Add detail
  if (enhancements.addDetail) {
    if (!/(detailed|specific|comprehensive|thorough)/i.test(enhancedPrompt)) {
      enhancedPrompt = `Please provide a detailed analysis of ${enhancedPrompt.toLowerCase()}`;
    }
  }

  // Add temporal
  if (enhancements.addTemporal) {
    if (!/(temporal|sequence|chronological|timeline)/i.test(enhancedPrompt)) {
      enhancedPrompt = `${enhancedPrompt} considering the temporal sequence of events`;
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
 * @param parametersArray - Array of parameter objects
 * @returns Array of VideoLLaMA 3 inputs
 */
export function createBatchVideoAnalysis(
  videoUrlsArray: string[], 
  promptsArray: string[],
  parametersArray: Partial<VideoLLaMA3Input>[]
): VideoLLaMA3Input[] {
  if (videoUrlsArray.length !== promptsArray.length || videoUrlsArray.length !== parametersArray.length) {
    throw new Error("Video URLs, prompts, and parameters arrays must have the same length");
  }

  return videoUrlsArray.map((videoUrl, index) => ({
    video: videoUrl,
    prompt: promptsArray[index],
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
 * Parameter optimization guidelines
 */
export const PARAMETER_OPTIMIZATION = {
  "fps": {
    "simple_content": "1-2 fps",
    "complex_content": "3-5 fps", 
    "detailed_analysis": "5-10 fps"
  },
  "top_p": {
    "factual_analysis": "0.8-0.9",
    "creative_responses": "0.9-0.95",
    "consistent_output": "0.7-0.8"
  },
  "max_frames": {
    "short_videos": "30-60 frames",
    "medium_videos": "60-120 frames",
    "long_videos": "120-256 frames"
  },
  "temperature": {
    "factual_analysis": "0.1-0.3",
    "creative_responses": "0.4-0.7",
    "consistent_output": "0.1-0.2"
  },
  "max_new_tokens": {
    "short_responses": "256-512 tokens",
    "medium_responses": "512-1024 tokens",
    "long_responses": "1024-2048 tokens"
  }
} as const;

/**
 * Common video analysis scenarios
 */
export const VIDEO_ANALYSIS_SCENARIOS = {
  "content_analysis": "General video content analysis",
  "anomaly_detection": "Detect unusual events and anomalies",
  "summarization": "Video content summarization",
  "question_answering": "Answer questions about video content",
  "educational": "Educational video analysis",
  "surveillance": "Security and surveillance analysis",
  "entertainment": "Entertainment content analysis",
  "sports": "Sports video analysis",
  "cooking": "Cooking and recipe analysis",
  "custom": "User-defined analysis scenarios"
} as const;

/**
 * Hardware requirements
 */
export const HARDWARE_REQUIREMENTS = {
  "gpu": "Nvidia L40S GPU",
  "memory": "High memory requirements for video processing",
  "processing_power": "High computational requirements",
  "storage": "Temporary storage for video processing"
} as const;

/**
 * Benchmark performance
 */
export const BENCHMARK_PERFORMANCE = {
  "video_understanding": "State-of-the-art performance in video understanding tasks",
  "temporal_modeling": "Advanced spatial-temporal modeling capabilities",
  "visual_reasoning": "High-level reasoning over dynamic visual scenes",
  "multimodal_integration": "Effective integration of textual and visual information",
  "sequential_processing": "Efficient processing of sequential video data",
  "content_analysis": "Comprehensive video content analysis and understanding",
  "question_answering": "Accurate video question answering and comprehension",
  "anomaly_detection": "Effective detection of unusual events and anomalies",
  "summarization": "High-quality video summarization and description",
  "content_moderation": "Reliable video content moderation and safety analysis"
} as const;

/**
 * Video analysis tips
 */
export const VIDEO_ANALYSIS_TIPS = {
  "prompt_creation": "Use clear and specific prompts for better video understanding",
  "video_quality": "Use high-quality video for optimal analysis results",
  "parameter_tuning": "Adjust parameters based on video content and analysis needs",
  "fps_optimization": "Use appropriate FPS based on content complexity",
  "frame_processing": "Set max_frames based on video length and processing requirements",
  "temperature_control": "Use lower temperature for factual analysis, higher for creative responses",
  "token_limits": "Set max_new_tokens based on expected response length",
  "temporal_considerations": "Consider the temporal nature of video content in prompts",
  "content_specificity": "Use specific questions for targeted video analysis",
  "parameter_optimization": "Test different parameter combinations for optimal results"
} as const;

export default executeVideoLLaMA3;
