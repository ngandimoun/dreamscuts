import Replicate from "replicate";

export interface QwenVLChatInput {
  image: string;
  prompt?: string;
}

export interface QwenVLChatOutput {
  type: string;
}

export interface QwenVLChatOptions {
  webhookUrl?: string;
  webhookEventsFilter?: string[];
  onProgress?: (progress: any) => void;
}

/**
 * Qwen-VL-Chat Executor
 * 
 * Qwen-VL-Chat is a multimodal LLM-based AI assistant trained with alignment techniques.
 * It supports flexible interaction including multi-round question answering and creative 
 * capabilities, making it excellent for image analysis, visual question answering, and 
 * multimodal conversations.
 * 
 * @param input - The image analysis input parameters
 * @param options - Additional execution options
 * @returns Promise with the image analysis result
 */
export async function executeQwenVLChat(
  input: QwenVLChatInput,
  options: QwenVLChatOptions = {}
): Promise<string> {
  try {
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate required inputs
    if (!input.image || input.image.trim().length === 0) {
      throw new Error("Image is required");
    }

    // Prepare the request payload
    const payload: any = {
      image: input.image.trim(),
    };

    // Add optional parameters with defaults
    if (input.prompt !== undefined) payload.prompt = input.prompt.trim();

    // Execute the model
    const output = await replicate.run(
      "lucataco/qwen-vl-chat:50881b153b4d5f72b3db697e2bbad23bb1277ab741c5b52d80cd6ee17ea660e9",
      {
        input: payload,
        webhook: options.webhookUrl,
        webhook_events_filter: options.webhookEventsFilter,
      }
    );

    return output as string;

  } catch (error) {
    console.error("Qwen-VL-Chat execution failed:", error);
    throw new Error(`Qwen-VL-Chat execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Qwen-VL-Chat with prediction management for long-running tasks
 * 
 * @param input - The image analysis input parameters
 * @param options - Additional execution options
 * @returns Promise with prediction object for tracking
 */
export async function executeQwenVLChatPrediction(
  input: QwenVLChatInput,
  options: QwenVLChatOptions = {}
): Promise<any> {
  try {
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate input (same validation as above)
    if (!input.image || input.image.trim().length === 0) {
      throw new Error("Image is required");
    }

    // Prepare the request payload
    const payload: any = {
      image: input.image.trim(),
    };

    // Add optional parameters
    if (input.prompt !== undefined) payload.prompt = input.prompt.trim();

    // Create prediction
    const prediction = await replicate.predictions.create({
      model: "lucataco/qwen-vl-chat:50881b153b4d5f72b3db697e2bbad23bb1277ab741c5b52d80cd6ee17ea660e9",
      input: payload,
      webhook: options.webhookUrl,
      webhook_events_filter: options.webhookEventsFilter,
    });

    return prediction;

  } catch (error) {
    console.error("Qwen-VL-Chat prediction creation failed:", error);
    throw new Error(`Qwen-VL-Chat prediction creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a Qwen-VL-Chat prediction
 * 
 * @param predictionId - The prediction ID from prediction creation
 * @returns Promise with prediction status
 */
export async function checkQwenVLChatStatus(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.get(predictionId);
    return prediction;

  } catch (error) {
    console.error("Qwen-VL-Chat status check failed:", error);
    throw new Error(`Qwen-VL-Chat status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Cancel a running Qwen-VL-Chat prediction
 * 
 * @param predictionId - The prediction ID to cancel
 * @returns Promise with cancellation result
 */
export async function cancelQwenVLChatPrediction(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.cancel(predictionId);
    return prediction;

  } catch (error) {
    console.error("Qwen-VL-Chat prediction cancellation failed:", error);
    throw new Error(`Qwen-VL-Chat prediction cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create image analysis scenarios
 * 
 * @param type - Type of image analysis scenario to create
 * @param customImageUrl - Custom image URL (optional)
 * @param customPrompt - Custom prompt (optional)
 * @param customOptions - Custom options (optional)
 * @returns Qwen-VL-Chat input configuration
 */
export function createImageAnalysisScenario(
  type: 'visual_qa' | 'object_detection' | 'text_recognition' | 'scene_analysis' | 'creative_tasks' | 'problem_solving' | 'content_summarization' | 'educational' | 'marketing' | 'medical' | 'custom',
  customImageUrl?: string,
  customPrompt?: string,
  customOptions?: Partial<QwenVLChatInput>
): QwenVLChatInput {
  const scenarioTemplates = {
    visual_qa: {
      image: customImageUrl || "https://replicate.delivery/pbxt/JSwt0WCMKtolbjYYo6WYIE01Iemz3etQD6ugKxxeiVVlMgjF/Menu.jpeg",
      prompt: customPrompt || "What do you see in this image?"
    },
    object_detection: {
      image: customImageUrl || "https://example.com/objects.jpg",
      prompt: customPrompt || "Identify and describe all the objects in this image."
    },
    text_recognition: {
      image: customImageUrl || "https://example.com/text-image.jpg",
      prompt: customPrompt || "Extract and read all the text visible in this image."
    },
    scene_analysis: {
      image: customImageUrl || "https://example.com/scene.jpg",
      prompt: customPrompt || "Analyze this scene and describe what is happening."
    },
    creative_tasks: {
      image: customImageUrl || "https://example.com/artwork.jpg",
      prompt: customPrompt || "Create a creative story based on this image."
    },
    problem_solving: {
      image: customImageUrl || "https://example.com/problem.jpg",
      prompt: customPrompt || "Analyze this image and help solve the problem shown."
    },
    content_summarization: {
      image: customImageUrl || "https://example.com/complex-image.jpg",
      prompt: customPrompt || "Provide a detailed summary of what you see in this image."
    },
    educational: {
      image: customImageUrl || "https://example.com/educational-image.jpg",
      prompt: customPrompt || "Explain the educational content shown in this image."
    },
    marketing: {
      image: customImageUrl || "https://example.com/marketing-image.jpg",
      prompt: customPrompt || "Analyze this marketing image and describe its effectiveness."
    },
    medical: {
      image: customImageUrl || "https://example.com/medical-image.jpg",
      prompt: customPrompt || "Analyze this medical image and provide insights."
    },
    custom: {
      image: customImageUrl || "https://example.com/custom-image.jpg",
      prompt: customPrompt || "Analyze this image and provide insights."
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
 * Predefined prompt templates for different image analysis scenarios
 */
export const PROMPT_TEMPLATES = {
  "visual_qa": [
    "What do you see in this image?",
    "Describe what is shown in this image.",
    "What can you tell me about this image?",
    "Explain what you observe in this image."
  ],
  "object_detection": [
    "Identify and describe all the objects in this image.",
    "What objects can you see in this image?",
    "List and describe all the items visible in this image.",
    "What items or objects are present in this image?"
  ],
  "text_recognition": [
    "Extract and read all the text visible in this image.",
    "What text can you see in this image?",
    "Read and transcribe all the text in this image.",
    "What words or text are shown in this image?"
  ],
  "scene_analysis": [
    "Analyze this scene and describe what is happening.",
    "What scene is shown in this image?",
    "Describe the visual elements and activities in this scene.",
    "What is the main focus of this image?"
  ],
  "creative_tasks": [
    "Create a creative story based on this image.",
    "Write a creative description of this image.",
    "Generate a creative narrative inspired by this image.",
    "Create an imaginative story about what you see."
  ],
  "problem_solving": [
    "Analyze this image and help solve the problem shown.",
    "What problem is depicted in this image?",
    "How would you approach the situation shown in this image?",
    "What solution would you suggest for what you see?"
  ],
  "content_summarization": [
    "Provide a detailed summary of what you see in this image.",
    "Summarize the key elements in this image.",
    "Give me a comprehensive overview of this image.",
    "What are the main highlights of this image?"
  ],
  "educational": [
    "Explain the educational content shown in this image.",
    "What educational value does this image provide?",
    "Describe the learning objectives demonstrated in this image.",
    "What can be learned from this image?"
  ],
  "marketing": [
    "Analyze this marketing image and describe its effectiveness.",
    "What marketing message does this image convey?",
    "How effective is this marketing image?",
    "What marketing strategy is shown in this image?"
  ],
  "medical": [
    "Analyze this medical image and provide insights.",
    "What medical information can you extract from this image?",
    "Describe the medical aspects shown in this image.",
    "What medical insights can you provide about this image?"
  ]
} as const;

/**
 * Example usage of the Qwen-VL-Chat executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic image content analysis
    const result1 = await executeQwenVLChat({
      image: "https://replicate.delivery/pbxt/JSwt0WCMKtolbjYYo6WYIE01Iemz3etQD6ugKxxeiVVlMgjF/Menu.jpeg",
      prompt: "How much would I pay if I want to order two Salmon Burger and three Meat Lover's Pizza? Think carefully step by step."
    });

    console.log("Image analysis:", result1);

    // Example 2: Using helper function for visual QA
    const visualQA = createImageAnalysisScenario('visual_qa');
    const result2 = await executeQwenVLChat(visualQA);
    console.log("Visual QA:", result2);

    // Example 3: Custom image analysis with specific parameters
    const customAnalysis = createImageAnalysisScenario(
      'custom',
      "https://example.com/custom-image.jpg",
      "Analyze this image and provide insights."
    );
    const result3 = await executeQwenVLChat(customAnalysis);
    console.log("Custom analysis:", result3);

    // Example 4: Using predefined templates
    const result4 = await executeQwenVLChat({
      image: "https://example.com/objects.jpg",
      prompt: PROMPT_TEMPLATES.object_detection[0]
    });
    console.log("Object detection:", result4);

    // Example 5: Prediction usage for long-running tasks
    const prediction = await executeQwenVLChatPrediction({
      image: "https://example.com/complex-image.jpg",
      prompt: "Provide a comprehensive analysis of this image.",
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Prediction ID:", prediction.id);

    // Check status
    const status = await checkQwenVLChatStatus(prediction.id);
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
  const costPerRun = 0.12;
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
 * Utility function to validate image URL
 * 
 * @param url - The image URL to validate
 * @returns Validation result with suggestions
 */
export function validateImageURL(url: string): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedURL: string; 
} {
  const suggestions: string[] = [];
  
  // Clean and format URL
  const formattedURL = url.trim();

  // Check for common issues
  if (!url || url.trim().length === 0) {
    suggestions.push("Image URL is required");
  }

  // Check for valid URL format
  try {
    new URL(url);
  } catch {
    suggestions.push("Image URL must be a valid URL");
  }

  // Check for valid image format
  if (!isValidImageURL(url)) {
    suggestions.push("Image must be in supported format (JPEG, PNG, GIF, WebP, BMP)");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedURL
  };
}

/**
 * Utility function to get optimal parameters for image type
 * 
 * @param imageType - Type of image content
 * @returns Recommended parameters
 */
export function getOptimalParameters(imageType: 'visual_qa' | 'object_detection' | 'text_recognition' | 'scene_analysis' | 'creative_tasks' | 'problem_solving' | 'content_summarization' | 'educational' | 'marketing' | 'medical'): {
  prompt_suggestions: string[];
} {
  const parameterMap = {
    visual_qa: { 
      prompt_suggestions: ["What do you see in this image?", "Describe what is shown in this image."] 
    },
    object_detection: { 
      prompt_suggestions: ["Identify and describe all the objects in this image.", "What objects can you see in this image?"] 
    },
    text_recognition: { 
      prompt_suggestions: ["Extract and read all the text visible in this image.", "What text can you see in this image?"] 
    },
    scene_analysis: { 
      prompt_suggestions: ["Analyze this scene and describe what is happening.", "What scene is shown in this image?"] 
    },
    creative_tasks: { 
      prompt_suggestions: ["Create a creative story based on this image.", "Write a creative description of this image."] 
    },
    problem_solving: { 
      prompt_suggestions: ["Analyze this image and help solve the problem shown.", "What problem is depicted in this image?"] 
    },
    content_summarization: { 
      prompt_suggestions: ["Provide a detailed summary of what you see in this image.", "Summarize the key elements in this image."] 
    },
    educational: { 
      prompt_suggestions: ["Explain the educational content shown in this image.", "What educational value does this image provide?"] 
    },
    marketing: { 
      prompt_suggestions: ["Analyze this marketing image and describe its effectiveness.", "What marketing message does this image convey?"] 
    },
    medical: { 
      prompt_suggestions: ["Analyze this medical image and provide insights.", "What medical information can you extract from this image?"] 
    }
  };

  return parameterMap[imageType];
}

/**
 * Utility function to enhance prompt for better image analysis
 * 
 * @param prompt - Base prompt to enhance
 * @param enhancements - Enhancement options
 * @returns Enhanced prompt
 */
export function enhancePromptForImageAnalysis(
  prompt: string, 
  enhancements: {
    addSpecificity?: boolean;
    addContext?: boolean;
    addDetail?: boolean;
    addCreative?: boolean;
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
    if (!/(image|picture|photo|visual)/i.test(enhancedPrompt)) {
      enhancedPrompt = `${enhancedPrompt} in this image`;
    }
  }

  // Add detail
  if (enhancements.addDetail) {
    if (!/(detailed|specific|comprehensive|thorough)/i.test(enhancedPrompt)) {
      enhancedPrompt = `Please provide a detailed analysis of ${enhancedPrompt.toLowerCase()}`;
    }
  }

  // Add creative
  if (enhancements.addCreative) {
    if (!/(creative|imaginative|story|narrative)/i.test(enhancedPrompt)) {
      enhancedPrompt = `Please provide a creative and imaginative ${enhancedPrompt.toLowerCase()}`;
    }
  }

  return enhancedPrompt;
}

/**
 * Utility function to generate random prompt
 * 
 * @param scenario - Image analysis scenario
 * @returns Random prompt from the scenario
 */
export function generateRandomPrompt(scenario: keyof typeof PROMPT_TEMPLATES): string {
  const prompts = PROMPT_TEMPLATES[scenario];
  const randomIndex = Math.floor(Math.random() * prompts.length);
  return prompts[randomIndex];
}

/**
 * Utility function to create batch image analysis
 * 
 * @param imageUrlsArray - Array of image URLs
 * @param promptsArray - Array of prompts
 * @param parametersArray - Array of parameter objects
 * @returns Array of Qwen-VL-Chat inputs
 */
export function createBatchImageAnalysis(
  imageUrlsArray: string[], 
  promptsArray: string[],
  parametersArray: Partial<QwenVLChatInput>[]
): QwenVLChatInput[] {
  if (imageUrlsArray.length !== promptsArray.length || imageUrlsArray.length !== parametersArray.length) {
    throw new Error("Image URLs, prompts, and parameters arrays must have the same length");
  }

  return imageUrlsArray.map((imageUrl, index) => ({
    image: imageUrl,
    prompt: promptsArray[index],
    ...parametersArray[index]
  }));
}

/**
 * Check if URL is a valid image format
 * 
 * @param url - The URL to check
 * @returns True if URL is a valid image format
 */
function isValidImageURL(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
  return imageExtensions.some(ext => url.toLowerCase().includes(ext));
}

/**
 * Supported image formats
 */
export const SUPPORTED_IMAGE_FORMATS = [
  "JPEG",
  "PNG", 
  "GIF",
  "WebP",
  "BMP"
] as const;

/**
 * Common image analysis scenarios
 */
export const IMAGE_ANALYSIS_SCENARIOS = {
  "visual_qa": "Visual question answering and comprehension",
  "object_detection": "Image object detection and recognition",
  "text_recognition": "Visual text recognition and extraction",
  "scene_analysis": "Visual scene analysis and reasoning",
  "creative_tasks": "Image-based creative tasks",
  "problem_solving": "Visual problem solving and analysis",
  "content_summarization": "Image content summarization and description",
  "educational": "Educational image content analysis",
  "marketing": "Marketing image analysis",
  "medical": "Medical image analysis",
  "custom": "User-defined analysis scenarios"
} as const;

/**
 * Hardware requirements
 */
export const HARDWARE_REQUIREMENTS = {
  "gpu": "Nvidia L40S GPU",
  "memory": "High memory requirements for image processing",
  "processing_power": "High computational requirements",
  "storage": "Temporary storage for image processing"
} as const;

/**
 * Benchmark performance
 */
export const BENCHMARK_PERFORMANCE = {
  "image_understanding": "Advanced image analysis and understanding",
  "visual_reasoning": "Visual reasoning and understanding capabilities",
  "multimodal_integration": "Integration of image and textual information",
  "question_answering": "Multi-round question answering support",
  "creative_capabilities": "Creative capabilities and flexible interaction",
  "alignment_techniques": "Trained with alignment techniques for better responses",
  "flexible_interaction": "Support for flexible interaction patterns",
  "visual_qa": "Visual question answering and comprehension",
  "image_analysis": "Comprehensive image content analysis and interpretation",
  "scene_understanding": "Visual scene analysis and reasoning",
  "object_detection": "Image object detection and recognition",
  "text_recognition": "Visual text recognition and extraction",
  "creative_tasks": "Image-based creative tasks and generation",
  "problem_solving": "Visual problem solving and analysis",
  "content_summarization": "Image content summarization and description",
  "storytelling": "Visual storytelling and narrative generation",
  "educational_analysis": "Image-based educational content analysis",
  "data_interpretation": "Visual data interpretation and analysis",
  "research_analysis": "Image-based research and analysis",
  "accessibility": "Visual accessibility and description generation"
} as const;

/**
 * Image analysis tips
 */
export const IMAGE_ANALYSIS_TIPS = {
  "prompt_creation": "Use clear and specific prompts for better image understanding",
  "image_quality": "Use high-quality images for optimal analysis results",
  "prompt_optimization": "Use clear prompts with specific instructions for optimal image analysis",
  "content_specificity": "Use specific questions for targeted image analysis",
  "visual_reasoning": "Leverage the model's visual reasoning capabilities",
  "multimodal_integration": "Take advantage of the multimodal integration for comprehensive analysis",
  "creative_capabilities": "Use the model's creative capabilities for imaginative tasks",
  "multi_round_qa": "Take advantage of the multi-round question answering support",
  "alignment_techniques": "Use the model's alignment techniques for better responses",
  "flexible_interaction": "Leverage the flexible interaction patterns for complex tasks",
  "visual_qa": "Use the model's visual question answering capabilities",
  "image_understanding": "Take advantage of the image understanding and interpretation features",
  "scene_analysis": "Use the model's visual scene analysis and reasoning capabilities",
  "object_detection": "Leverage the object detection and recognition features",
  "text_recognition": "Use the visual text recognition and extraction capabilities"
} as const;

export default executeQwenVLChat;
