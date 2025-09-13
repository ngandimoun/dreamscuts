import Replicate from "replicate";

export interface CogVLM2VideoInput {
  input_video: string;
  prompt?: string;
  temperature?: number;
  max_new_tokens?: number;
  top_p?: number;
}

export interface CogVLM2VideoOutput {
  type: string;
}

export interface CogVLM2VideoOptions {
  webhookUrl?: string;
  webhookEventsFilter?: string[];
  onProgress?: (progress: any) => void;
}

/**
 * CogVLM2-Video Executor
 * 
 * CogVLM2-Video represents a new generation of visual language models designed for comprehensive 
 * image and video understanding. Built on Meta-Llama-3-8B-Instruct, this model achieves 
 * state-of-the-art performance on multiple video question answering tasks and supports both 
 * Chinese and English languages with significant improvements in benchmarks.
 * 
 * @param input - The video analysis input parameters
 * @param options - Additional execution options
 * @returns Promise with the video analysis result
 */
export async function executeCogVLM2Video(
  input: CogVLM2VideoInput,
  options: CogVLM2VideoOptions = {}
): Promise<string> {
  try {
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate required inputs
    if (!input.input_video || input.input_video.trim().length === 0) {
      throw new Error("Input video is required");
    }

    // Validate optional parameters
    if (input.temperature !== undefined && input.temperature < 0) {
      throw new Error("Temperature must be greater than or equal to 0");
    }

    if (input.max_new_tokens !== undefined && input.max_new_tokens < 0) {
      throw new Error("Max new tokens must be greater than or equal to 0");
    }

    if (input.top_p !== undefined && (input.top_p < 0 || input.top_p > 1)) {
      throw new Error("Top-p must be between 0 and 1");
    }

    // Prepare the request payload
    const payload: any = {
      input_video: input.input_video.trim(),
    };

    // Add optional parameters with defaults
    if (input.prompt !== undefined) payload.prompt = input.prompt.trim();
    if (input.temperature !== undefined) payload.temperature = input.temperature;
    if (input.max_new_tokens !== undefined) payload.max_new_tokens = input.max_new_tokens;
    if (input.top_p !== undefined) payload.top_p = input.top_p;

    // Execute the model
    const output = await replicate.run(
      "chenxwh/cogvlm2-video:9da7e9a554d36bb7b5fec36b43b00e4616dc1e819bc963ded8e053d8d8196cb5",
      {
        input: payload,
        webhook: options.webhookUrl,
        webhook_events_filter: options.webhookEventsFilter,
      }
    );

    return output as string;

  } catch (error) {
    console.error("CogVLM2-Video execution failed:", error);
    throw new Error(`CogVLM2-Video execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute CogVLM2-Video with prediction management for long-running tasks
 * 
 * @param input - The video analysis input parameters
 * @param options - Additional execution options
 * @returns Promise with prediction object for tracking
 */
export async function executeCogVLM2VideoPrediction(
  input: CogVLM2VideoInput,
  options: CogVLM2VideoOptions = {}
): Promise<any> {
  try {
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate input (same validation as above)
    if (!input.input_video || input.input_video.trim().length === 0) {
      throw new Error("Input video is required");
    }

    if (input.temperature !== undefined && input.temperature < 0) {
      throw new Error("Temperature must be greater than or equal to 0");
    }

    if (input.max_new_tokens !== undefined && input.max_new_tokens < 0) {
      throw new Error("Max new tokens must be greater than or equal to 0");
    }

    if (input.top_p !== undefined && (input.top_p < 0 || input.top_p > 1)) {
      throw new Error("Top-p must be between 0 and 1");
    }

    // Prepare the request payload
    const payload: any = {
      input_video: input.input_video.trim(),
    };

    // Add optional parameters
    if (input.prompt !== undefined) payload.prompt = input.prompt.trim();
    if (input.temperature !== undefined) payload.temperature = input.temperature;
    if (input.max_new_tokens !== undefined) payload.max_new_tokens = input.max_new_tokens;
    if (input.top_p !== undefined) payload.top_p = input.top_p;

    // Create prediction
    const prediction = await replicate.predictions.create({
      model: "chenxwh/cogvlm2-video:9da7e9a554d36bb7b5fec36b43b00e4616dc1e819bc963ded8e053d8d8196cb5",
      input: payload,
      webhook: options.webhookUrl,
      webhook_events_filter: options.webhookEventsFilter,
    });

    return prediction;

  } catch (error) {
    console.error("CogVLM2-Video prediction creation failed:", error);
    throw new Error(`CogVLM2-Video prediction creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a CogVLM2-Video prediction
 * 
 * @param predictionId - The prediction ID from prediction creation
 * @returns Promise with prediction status
 */
export async function checkCogVLM2VideoStatus(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.get(predictionId);
    return prediction;

  } catch (error) {
    console.error("CogVLM2-Video status check failed:", error);
    throw new Error(`CogVLM2-Video status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Cancel a running CogVLM2-Video prediction
 * 
 * @param predictionId - The prediction ID to cancel
 * @returns Promise with cancellation result
 */
export async function cancelCogVLM2VideoPrediction(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.cancel(predictionId);
    return prediction;

  } catch (error) {
    console.error("CogVLM2-Video prediction cancellation failed:", error);
    throw new Error(`CogVLM2-Video prediction cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create video analysis scenarios
 * 
 * @param type - Type of video analysis scenario to create
 * @param customVideoUrl - Custom video URL (optional)
 * @param customPrompt - Custom prompt (optional)
 * @param customOptions - Custom options (optional)
 * @returns CogVLM2-Video input configuration
 */
export function createVideoAnalysisScenario(
  type: 'content_analysis' | 'scene_analysis' | 'activity_recognition' | 'object_detection' | 'event_understanding' | 'question_answering' | 'summarization' | 'educational' | 'entertainment' | 'sports' | 'cooking' | 'custom',
  customVideoUrl?: string,
  customPrompt?: string,
  customOptions?: Partial<CogVLM2VideoInput>
): CogVLM2VideoInput {
  const scenarioTemplates = {
    content_analysis: {
      input_video: customVideoUrl || "https://replicate.delivery/pbxt/LgGGFqrlw37TQMMWbjCTvYwp1vhH916HGqjKIuLxyB5SqiuT/%E5%A4%A7%E8%B1%A1.mp4",
      prompt: customPrompt || "Describe this video.",
      temperature: 0.1,
      max_new_tokens: 2048,
      top_p: 0.1
    },
    scene_analysis: {
      input_video: customVideoUrl || "https://example.com/scene-video.mp4",
      prompt: customPrompt || "Analyze the scene and describe what is happening.",
      temperature: 0.1,
      max_new_tokens: 2048,
      top_p: 0.1
    },
    activity_recognition: {
      input_video: customVideoUrl || "https://example.com/activity-video.mp4",
      prompt: customPrompt || "What activities are shown in this video?",
      temperature: 0.1,
      max_new_tokens: 2048,
      top_p: 0.1
    },
    object_detection: {
      input_video: customVideoUrl || "https://example.com/object-video.mp4",
      prompt: customPrompt || "Identify and describe the objects in this video.",
      temperature: 0.1,
      max_new_tokens: 2048,
      top_p: 0.1
    },
    event_understanding: {
      input_video: customVideoUrl || "https://example.com/event-video.mp4",
      prompt: customPrompt || "Describe the events happening in this video.",
      temperature: 0.1,
      max_new_tokens: 2048,
      top_p: 0.1
    },
    question_answering: {
      input_video: customVideoUrl || "https://example.com/question-video.mp4",
      prompt: customPrompt || "Answer questions about the content shown in this video.",
      temperature: 0.1,
      max_new_tokens: 2048,
      top_p: 0.1
    },
    summarization: {
      input_video: customVideoUrl || "https://example.com/long-video.mp4",
      prompt: customPrompt || "Provide a detailed summary of this video.",
      temperature: 0.1,
      max_new_tokens: 2048,
      top_p: 0.1
    },
    educational: {
      input_video: customVideoUrl || "https://example.com/educational-video.mp4",
      prompt: customPrompt || "Explain the educational content shown in this video.",
      temperature: 0.1,
      max_new_tokens: 2048,
      top_p: 0.1
    },
    entertainment: {
      input_video: customVideoUrl || "https://example.com/entertainment-video.mp4",
      prompt: customPrompt || "Describe the entertainment value and content of this video.",
      temperature: 0.1,
      max_new_tokens: 2048,
      top_p: 0.1
    },
    sports: {
      input_video: customVideoUrl || "https://example.com/sports-video.mp4",
      prompt: customPrompt || "Analyze the sports action and provide commentary.",
      temperature: 0.1,
      max_new_tokens: 2048,
      top_p: 0.1
    },
    cooking: {
      input_video: customVideoUrl || "https://example.com/cooking-video.mp4",
      prompt: customPrompt || "Describe the cooking process shown in this video step by step.",
      temperature: 0.1,
      max_new_tokens: 2048,
      top_p: 0.1
    },
    custom: {
      input_video: customVideoUrl || "https://example.com/custom-video.mp4",
      prompt: customPrompt || "Analyze this video content and provide insights.",
      temperature: 0.1,
      max_new_tokens: 2048,
      top_p: 0.1
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
    "Describe this video.",
    "What is happening in this video?",
    "Analyze the content of this video",
    "Provide a comprehensive description of this video"
  ],
  "scene_analysis": [
    "Analyze the scene and describe what is happening.",
    "What scene is shown in this video?",
    "Describe the visual elements and activities in this scene.",
    "What is the main focus of this video scene?"
  ],
  "activity_recognition": [
    "What activities are shown in this video?",
    "Identify and describe the activities in this video.",
    "What actions are taking place in this video?",
    "Describe the main activities and movements shown."
  ],
  "object_detection": [
    "Identify and describe the objects in this video.",
    "What objects can you see in this video?",
    "List and describe all the objects visible in this video.",
    "What items or objects are present in this video?"
  ],
  "event_understanding": [
    "Describe the events happening in this video.",
    "What events are taking place in this video?",
    "Explain the sequence of events in this video.",
    "What is the main event or story in this video?"
  ],
  "question_answering": [
    "Answer questions about the content shown in this video.",
    "What can you tell me about the events in this video?",
    "Explain what is happening in this video.",
    "Provide information about the content of this video."
  ],
  "summarization": [
    "Provide a detailed summary of this video.",
    "Summarize the key points and events in this video.",
    "Give me a comprehensive overview of this video content.",
    "What are the main highlights of this video?"
  ],
  "educational": [
    "Explain the educational content shown in this video.",
    "What educational value does this video provide?",
    "Describe the learning objectives demonstrated in this video.",
    "What can be learned from watching this video?"
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
 * Example usage of the CogVLM2-Video executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic video content analysis
    const result1 = await executeCogVLM2Video({
      input_video: "https://replicate.delivery/pbxt/LgGGFqrlw37TQMMWbjCTvYwp1vhH916HGqjKIuLxyB5SqiuT/%E5%A4%A7%E8%B1%A1.mp4",
      prompt: "请仔细描述这个视频",
      temperature: 0.1,
      max_new_tokens: 2048,
      top_p: 0.1
    });

    console.log("Video analysis:", result1);

    // Example 2: Using helper function for scene analysis
    const sceneAnalysis = createVideoAnalysisScenario('scene_analysis');
    const result2 = await executeCogVLM2Video(sceneAnalysis);
    console.log("Scene analysis:", result2);

    // Example 3: Custom video analysis with specific parameters
    const customAnalysis = createVideoAnalysisScenario(
      'custom',
      "https://example.com/cooking-video.mp4",
      "Describe the cooking process shown in this video step by step.",
      { temperature: 0.1, max_new_tokens: 2048, top_p: 0.1 }
    );
    const result3 = await executeCogVLM2Video(customAnalysis);
    console.log("Custom analysis:", result3);

    // Example 4: Using predefined templates
    const result4 = await executeCogVLM2Video({
      input_video: "https://example.com/sports-video.mp4",
      prompt: PROMPT_TEMPLATES.sports[0],
      temperature: 0.1,
      max_new_tokens: 2048,
      top_p: 0.1
    });
    console.log("Sports analysis:", result4);

    // Example 5: Prediction usage for long-running tasks
    const prediction = await executeCogVLM2VideoPrediction({
      input_video: "https://example.com/complex-video.mp4",
      prompt: "Provide a comprehensive analysis of this video.",
      temperature: 0.1,
      max_new_tokens: 2048,
      top_p: 0.1,
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Prediction ID:", prediction.id);

    // Check status
    const status = await checkCogVLM2VideoStatus(prediction.id);
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
  const costPerRun = 0.024;
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
export function getOptimalParameters(videoType: 'content_analysis' | 'scene_analysis' | 'activity_recognition' | 'object_detection' | 'event_understanding' | 'question_answering' | 'summarization' | 'educational' | 'entertainment' | 'sports' | 'cooking'): {
  temperature: number;
  max_new_tokens: number;
  top_p: number;
  prompt_suggestions: string[];
} {
  const parameterMap = {
    content_analysis: { 
      temperature: 0.1, 
      max_new_tokens: 2048, 
      top_p: 0.1,
      prompt_suggestions: ["Describe this video.", "What is happening in this video?"] 
    },
    scene_analysis: { 
      temperature: 0.1, 
      max_new_tokens: 2048, 
      top_p: 0.1,
      prompt_suggestions: ["Analyze the scene and describe what is happening.", "What scene is shown in this video?"] 
    },
    activity_recognition: { 
      temperature: 0.1, 
      max_new_tokens: 2048, 
      top_p: 0.1,
      prompt_suggestions: ["What activities are shown in this video?", "Identify and describe the activities in this video."] 
    },
    object_detection: { 
      temperature: 0.1, 
      max_new_tokens: 2048, 
      top_p: 0.1,
      prompt_suggestions: ["Identify and describe the objects in this video.", "What objects can you see in this video?"] 
    },
    event_understanding: { 
      temperature: 0.1, 
      max_new_tokens: 2048, 
      top_p: 0.1,
      prompt_suggestions: ["Describe the events happening in this video.", "What events are taking place in this video?"] 
    },
    question_answering: { 
      temperature: 0.1, 
      max_new_tokens: 2048, 
      top_p: 0.1,
      prompt_suggestions: ["Answer questions about the content shown in this video.", "What can you tell me about the events in this video?"] 
    },
    summarization: { 
      temperature: 0.1, 
      max_new_tokens: 2048, 
      top_p: 0.1,
      prompt_suggestions: ["Provide a detailed summary of this video.", "Summarize the key points and events in this video."] 
    },
    educational: { 
      temperature: 0.1, 
      max_new_tokens: 2048, 
      top_p: 0.1,
      prompt_suggestions: ["Explain the educational content shown in this video.", "What educational value does this video provide?"] 
    },
    entertainment: { 
      temperature: 0.1, 
      max_new_tokens: 2048, 
      top_p: 0.1,
      prompt_suggestions: ["Describe the entertainment value and content of this video.", "What makes this video entertaining or engaging?"] 
    },
    sports: { 
      temperature: 0.1, 
      max_new_tokens: 2048, 
      top_p: 0.1,
      prompt_suggestions: ["Analyze the sports action and provide commentary.", "What sports activities are shown in this video?"] 
    },
    cooking: { 
      temperature: 0.1, 
      max_new_tokens: 2048, 
      top_p: 0.1,
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
 * @returns Array of CogVLM2-Video inputs
 */
export function createBatchVideoAnalysis(
  videoUrlsArray: string[], 
  promptsArray: string[],
  parametersArray: Partial<CogVLM2VideoInput>[]
): CogVLM2VideoInput[] {
  if (videoUrlsArray.length !== promptsArray.length || videoUrlsArray.length !== parametersArray.length) {
    throw new Error("Video URLs, prompts, and parameters arrays must have the same length");
  }

  return videoUrlsArray.map((videoUrl, index) => ({
    input_video: videoUrl,
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
  "temperature": {
    "factual_analysis": "0.1",
    "creative_responses": "0.1-0.3",
    "consistent_output": "0.1"
  },
  "top_p": {
    "factual_analysis": "0.1",
    "creative_responses": "0.1-0.3",
    "consistent_output": "0.1"
  },
  "max_new_tokens": {
    "short_responses": "1024-1536 tokens",
    "medium_responses": "1536-2048 tokens",
    "long_responses": "2048+ tokens"
  }
} as const;

/**
 * Common video analysis scenarios
 */
export const VIDEO_ANALYSIS_SCENARIOS = {
  "content_analysis": "General video content analysis and understanding",
  "scene_analysis": "Video scene analysis and interpretation",
  "activity_recognition": "Video activity recognition and description",
  "object_detection": "Video object detection and recognition",
  "event_understanding": "Video event understanding and analysis",
  "question_answering": "Video question answering and comprehension",
  "summarization": "Video content summarization and description",
  "educational": "Educational video analysis and explanation",
  "entertainment": "Entertainment content analysis",
  "sports": "Sports video analysis and commentary",
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
  "video_understanding": "State-of-the-art video understanding performance",
  "temporal_modeling": "Temporal sequence understanding and analysis",
  "visual_reasoning": "Visual reasoning over dynamic video content",
  "multimodal_integration": "Integration of video and textual information",
  "sequential_processing": "Processing of sequential video data",
  "content_analysis": "Comprehensive video content analysis and interpretation",
  "scene_understanding": "Video scene understanding and reasoning",
  "activity_recognition": "Video activity recognition and description",
  "object_detection": "Video object detection and recognition",
  "event_understanding": "Video event understanding and analysis",
  "question_answering": "Accurate video question answering and comprehension",
  "summarization": "High-quality video summarization and description",
  "temporal_reasoning": "Video temporal reasoning and analysis",
  "spatial_understanding": "Video spatial understanding and analysis",
  "context_understanding": "Video context understanding and interpretation",
  "narrative_understanding": "Video narrative understanding and analysis",
  "high_resolution_support": "Support for high-resolution video up to 1344x1344",
  "long_content_support": "Support for 8K content length processing",
  "bilingual_support": "Support for both Chinese and English languages",
  "benchmark_improvements": "Significant improvements in TextVQA and DocVQA benchmarks"
} as const;

/**
 * Video analysis tips
 */
export const VIDEO_ANALYSIS_TIPS = {
  "prompt_creation": "Use clear and specific prompts for better video understanding",
  "video_quality": "Use high-quality video for optimal analysis results",
  "parameter_tuning": "Adjust parameters based on video content and analysis needs",
  "temperature_control": "Use low temperature (0.1) for consistent, factual analysis",
  "token_limits": "Set max_new_tokens based on expected response length",
  "top_p_optimization": "Use low top_p (0.1) for focused, high-quality responses",
  "content_specificity": "Use specific questions for targeted video analysis",
  "parameter_optimization": "Test with different parameter combinations for optimal results",
  "scene_analysis": "Focus on scene elements and activities for better analysis",
  "activity_recognition": "Use specific prompts for activity identification",
  "object_detection": "Use specific prompts for object identification and description",
  "event_understanding": "Use specific prompts for event analysis and understanding",
  "high_resolution": "Take advantage of high-resolution video support for detailed analysis",
  "long_content": "Use 8K content length support for comprehensive long video analysis",
  "bilingual": "Leverage bilingual support for multilingual content analysis"
} as const;

export default executeCogVLM2Video;
