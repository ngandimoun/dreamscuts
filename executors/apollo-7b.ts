import Replicate from "replicate";

export interface Apollo7BInput {
  video: string;
  prompt?: string;
  temperature?: number;
  max_new_tokens?: number;
  top_p?: number;
}

export interface Apollo7BOutput {
  type: string;
}

export interface Apollo7BOptions {
  webhookUrl?: string;
  webhookEventsFilter?: string[];
  onProgress?: (progress: any) => void;
}

/**
 * Apollo 7B Executor
 * 
 * Apollo 7B represents an advanced exploration of video understanding in large multimodal models.
 * This model demonstrates exceptional capabilities in processing and interpreting video content,
 * providing detailed analysis and answering questions about video scenes, activities, and content.
 * 
 * @param input - The video analysis input parameters
 * @param options - Additional execution options
 * @returns Promise with the video analysis result
 */
export async function executeApollo7B(
  input: Apollo7BInput,
  options: Apollo7BOptions = {}
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

    // Validate optional parameters
    if (input.temperature !== undefined && (input.temperature < 0.1 || input.temperature > 2)) {
      throw new Error("Temperature must be between 0.1 and 2");
    }

    if (input.max_new_tokens !== undefined && (input.max_new_tokens < 32 || input.max_new_tokens > 1024)) {
      throw new Error("Max new tokens must be between 32 and 1024");
    }

    if (input.top_p !== undefined && (input.top_p < 0 || input.top_p > 1)) {
      throw new Error("Top-p must be between 0 and 1");
    }

    // Prepare the request payload
    const payload: any = {
      video: input.video.trim(),
    };

    // Add optional parameters with defaults
    if (input.prompt !== undefined) payload.prompt = input.prompt.trim();
    if (input.temperature !== undefined) payload.temperature = input.temperature;
    if (input.max_new_tokens !== undefined) payload.max_new_tokens = input.max_new_tokens;
    if (input.top_p !== undefined) payload.top_p = input.top_p;

    // Execute the model
    const output = await replicate.run(
      "lucataco/apollo-7b:e282f76d0451b759128be3e8bccfe5ded8f521f4a7d705883e92f837e563f575",
      {
        input: payload,
        webhook: options.webhookUrl,
        webhook_events_filter: options.webhookEventsFilter,
      }
    );

    return output as string;

  } catch (error) {
    console.error("Apollo 7B execution failed:", error);
    throw new Error(`Apollo 7B execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Apollo 7B with prediction management for long-running tasks
 * 
 * @param input - The video analysis input parameters
 * @param options - Additional execution options
 * @returns Promise with prediction object for tracking
 */
export async function executeApollo7BPrediction(
  input: Apollo7BInput,
  options: Apollo7BOptions = {}
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

    if (input.temperature !== undefined && (input.temperature < 0.1 || input.temperature > 2)) {
      throw new Error("Temperature must be between 0.1 and 2");
    }

    if (input.max_new_tokens !== undefined && (input.max_new_tokens < 32 || input.max_new_tokens > 1024)) {
      throw new Error("Max new tokens must be between 32 and 1024");
    }

    if (input.top_p !== undefined && (input.top_p < 0 || input.top_p > 1)) {
      throw new Error("Top-p must be between 0 and 1");
    }

    // Prepare the request payload
    const payload: any = {
      video: input.video.trim(),
    };

    // Add optional parameters
    if (input.prompt !== undefined) payload.prompt = input.prompt.trim();
    if (input.temperature !== undefined) payload.temperature = input.temperature;
    if (input.max_new_tokens !== undefined) payload.max_new_tokens = input.max_new_tokens;
    if (input.top_p !== undefined) payload.top_p = input.top_p;

    // Create prediction
    const prediction = await replicate.predictions.create({
      model: "lucataco/apollo-7b:e282f76d0451b759128be3e8bccfe5ded8f521f4a7d705883e92f837e563f575",
      input: payload,
      webhook: options.webhookUrl,
      webhook_events_filter: options.webhookEventsFilter,
    });

    return prediction;

  } catch (error) {
    console.error("Apollo 7B prediction creation failed:", error);
    throw new Error(`Apollo 7B prediction creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of an Apollo 7B prediction
 * 
 * @param predictionId - The prediction ID from prediction creation
 * @returns Promise with prediction status
 */
export async function checkApollo7BStatus(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.get(predictionId);
    return prediction;

  } catch (error) {
    console.error("Apollo 7B status check failed:", error);
    throw new Error(`Apollo 7B status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Cancel a running Apollo 7B prediction
 * 
 * @param predictionId - The prediction ID to cancel
 * @returns Promise with cancellation result
 */
export async function cancelApollo7BPrediction(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.cancel(predictionId);
    return prediction;

  } catch (error) {
    console.error("Apollo 7B prediction cancellation failed:", error);
    throw new Error(`Apollo 7B prediction cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create video analysis scenarios
 * 
 * @param type - Type of video analysis scenario to create
 * @param customVideoUrl - Custom video URL (optional)
 * @param customPrompt - Custom prompt (optional)
 * @param customOptions - Custom options (optional)
 * @returns Apollo 7B input configuration
 */
export function createVideoAnalysisScenario(
  type: 'content_analysis' | 'scene_analysis' | 'activity_recognition' | 'question_answering' | 'summarization' | 'educational' | 'entertainment' | 'sports' | 'cooking' | 'custom',
  customVideoUrl?: string,
  customPrompt?: string,
  customOptions?: Partial<Apollo7BInput>
): Apollo7BInput {
  const scenarioTemplates = {
    content_analysis: {
      video: customVideoUrl || "https://replicate.delivery/pbxt/M9kGHuJMeAKZs0eSbaEk6hCc7zqY4Tg94IxWwDpC5hRiuBPY/astro.mp4",
      prompt: customPrompt || "Describe this video in detail",
      temperature: 0.4,
      max_new_tokens: 256,
      top_p: 0.7
    },
    scene_analysis: {
      video: customVideoUrl || "https://example.com/scene-video.mp4",
      prompt: customPrompt || "Analyze the scene and describe what is happening.",
      temperature: 0.3,
      max_new_tokens: 512,
      top_p: 0.8
    },
    activity_recognition: {
      video: customVideoUrl || "https://example.com/activity-video.mp4",
      prompt: customPrompt || "What activities are shown in this video?",
      temperature: 0.2,
      max_new_tokens: 384,
      top_p: 0.7
    },
    question_answering: {
      video: customVideoUrl || "https://example.com/question-video.mp4",
      prompt: customPrompt || "Answer questions about the content shown in this video.",
      temperature: 0.1,
      max_new_tokens: 256,
      top_p: 0.6
    },
    summarization: {
      video: customVideoUrl || "https://example.com/long-video.mp4",
      prompt: customPrompt || "Provide a detailed summary of this video.",
      temperature: 0.3,
      max_new_tokens: 512,
      top_p: 0.8
    },
    educational: {
      video: customVideoUrl || "https://example.com/educational-video.mp4",
      prompt: customPrompt || "Explain the educational content shown in this video.",
      temperature: 0.2,
      max_new_tokens: 512,
      top_p: 0.7
    },
    entertainment: {
      video: customVideoUrl || "https://example.com/entertainment-video.mp4",
      prompt: customPrompt || "Describe the entertainment value and content of this video.",
      temperature: 0.5,
      max_new_tokens: 384,
      top_p: 0.8
    },
    sports: {
      video: customVideoUrl || "https://example.com/sports-video.mp4",
      prompt: customPrompt || "Analyze the sports action and provide commentary.",
      temperature: 0.3,
      max_new_tokens: 512,
      top_p: 0.7
    },
    cooking: {
      video: customVideoUrl || "https://example.com/cooking-video.mp4",
      prompt: customPrompt || "Describe the cooking process shown in this video step by step.",
      temperature: 0.2,
      max_new_tokens: 512,
      top_p: 0.7
    },
    custom: {
      video: customVideoUrl || "https://example.com/custom-video.mp4",
      prompt: customPrompt || "Analyze this video content and provide insights.",
      temperature: 0.4,
      max_new_tokens: 256,
      top_p: 0.7
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
    "Describe this video in detail",
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
 * Example usage of the Apollo 7B executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic video content analysis
    const result1 = await executeApollo7B({
      video: "https://replicate.delivery/pbxt/M9kGHuJMeAKZs0eSbaEk6hCc7zqY4Tg94IxWwDpC5hRiuBPY/astro.mp4",
      prompt: "Describe this video in detail",
      temperature: 0.4,
      max_new_tokens: 256,
      top_p: 0.7
    });

    console.log("Video analysis:", result1);

    // Example 2: Using helper function for scene analysis
    const sceneAnalysis = createVideoAnalysisScenario('scene_analysis');
    const result2 = await executeApollo7B(sceneAnalysis);
    console.log("Scene analysis:", result2);

    // Example 3: Custom video analysis with specific parameters
    const customAnalysis = createVideoAnalysisScenario(
      'custom',
      "https://example.com/cooking-video.mp4",
      "Describe the cooking process shown in this video step by step.",
      { temperature: 0.2, max_new_tokens: 512, top_p: 0.7 }
    );
    const result3 = await executeApollo7B(customAnalysis);
    console.log("Custom analysis:", result3);

    // Example 4: Using predefined templates
    const result4 = await executeApollo7B({
      video: "https://example.com/sports-video.mp4",
      prompt: PROMPT_TEMPLATES.sports[0],
      temperature: 0.3,
      max_new_tokens: 512,
      top_p: 0.7
    });
    console.log("Sports analysis:", result4);

    // Example 5: Prediction usage for long-running tasks
    const prediction = await executeApollo7BPrediction({
      video: "https://example.com/complex-video.mp4",
      prompt: "Provide a comprehensive analysis of this video.",
      temperature: 0.4,
      max_new_tokens: 512,
      top_p: 0.7,
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Prediction ID:", prediction.id);

    // Check status
    const status = await checkApollo7BStatus(prediction.id);
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
  const costPerRun = 0.0037;
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
export function getOptimalParameters(videoType: 'content_analysis' | 'scene_analysis' | 'activity_recognition' | 'question_answering' | 'summarization' | 'educational' | 'entertainment' | 'sports' | 'cooking'): {
  temperature: number;
  max_new_tokens: number;
  top_p: number;
  prompt_suggestions: string[];
} {
  const parameterMap = {
    content_analysis: { 
      temperature: 0.4, 
      max_new_tokens: 256, 
      top_p: 0.7,
      prompt_suggestions: ["Describe this video in detail", "What is happening in this video?"] 
    },
    scene_analysis: { 
      temperature: 0.3, 
      max_new_tokens: 512, 
      top_p: 0.8,
      prompt_suggestions: ["Analyze the scene and describe what is happening.", "What scene is shown in this video?"] 
    },
    activity_recognition: { 
      temperature: 0.2, 
      max_new_tokens: 384, 
      top_p: 0.7,
      prompt_suggestions: ["What activities are shown in this video?", "Identify and describe the activities in this video."] 
    },
    question_answering: { 
      temperature: 0.1, 
      max_new_tokens: 256, 
      top_p: 0.6,
      prompt_suggestions: ["Answer questions about the content shown in this video.", "What can you tell me about the events in this video?"] 
    },
    summarization: { 
      temperature: 0.3, 
      max_new_tokens: 512, 
      top_p: 0.8,
      prompt_suggestions: ["Provide a detailed summary of this video.", "Summarize the key points and events in this video."] 
    },
    educational: { 
      temperature: 0.2, 
      max_new_tokens: 512, 
      top_p: 0.7,
      prompt_suggestions: ["Explain the educational content shown in this video.", "What educational value does this video provide?"] 
    },
    entertainment: { 
      temperature: 0.5, 
      max_new_tokens: 384, 
      top_p: 0.8,
      prompt_suggestions: ["Describe the entertainment value and content of this video.", "What makes this video entertaining or engaging?"] 
    },
    sports: { 
      temperature: 0.3, 
      max_new_tokens: 512, 
      top_p: 0.7,
      prompt_suggestions: ["Analyze the sports action and provide commentary.", "What sports activities are shown in this video?"] 
    },
    cooking: { 
      temperature: 0.2, 
      max_new_tokens: 512, 
      top_p: 0.7,
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
 * @returns Array of Apollo 7B inputs
 */
export function createBatchVideoAnalysis(
  videoUrlsArray: string[], 
  promptsArray: string[],
  parametersArray: Partial<Apollo7BInput>[]
): Apollo7BInput[] {
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
  "temperature": {
    "factual_analysis": "0.1-0.3",
    "creative_responses": "0.4-0.7",
    "consistent_output": "0.1-0.2"
  },
  "top_p": {
    "factual_analysis": "0.6-0.8",
    "creative_responses": "0.8-0.9",
    "consistent_output": "0.6-0.7"
  },
  "max_new_tokens": {
    "short_responses": "256-384 tokens",
    "medium_responses": "384-512 tokens",
    "long_responses": "512-1024 tokens"
  }
} as const;

/**
 * Common video analysis scenarios
 */
export const VIDEO_ANALYSIS_SCENARIOS = {
  "content_analysis": "General video content analysis and understanding",
  "scene_analysis": "Video scene analysis and interpretation",
  "activity_recognition": "Video activity recognition and description",
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
  "video_understanding": "Advanced video content analysis and understanding",
  "temporal_modeling": "Temporal sequence understanding and analysis",
  "visual_reasoning": "Visual reasoning over dynamic video content",
  "multimodal_integration": "Integration of video and textual information",
  "sequential_processing": "Processing of sequential video data",
  "content_analysis": "Comprehensive video content analysis and interpretation",
  "scene_understanding": "Video scene understanding and reasoning",
  "activity_recognition": "Video activity recognition and description",
  "question_answering": "Accurate video question answering and comprehension",
  "summarization": "High-quality video summarization and description"
} as const;

/**
 * Video analysis tips
 */
export const VIDEO_ANALYSIS_TIPS = {
  "prompt_creation": "Use clear and specific prompts for better video understanding",
  "video_quality": "Use high-quality video for optimal analysis results",
  "parameter_tuning": "Adjust parameters based on video content and analysis needs",
  "temperature_control": "Use lower temperature for factual analysis, higher for creative responses",
  "token_limits": "Set max_new_tokens based on expected response length",
  "top_p_optimization": "Use appropriate top_p for response quality",
  "content_specificity": "Use specific questions for targeted video analysis",
  "parameter_optimization": "Test different parameter combinations for optimal results",
  "scene_analysis": "Focus on scene elements and activities for better analysis",
  "activity_recognition": "Use specific prompts for activity identification"
} as const;

export default executeApollo7B;
