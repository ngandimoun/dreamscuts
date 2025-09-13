import Replicate from "replicate";

export interface Qwen2VL7BInstructInput {
  media: string;
  prompt?: string;
  max_new_tokens?: number;
}

export interface Qwen2VL7BInstructOutput {
  type: string;
}

export interface Qwen2VL7BInstructOptions {
  webhookUrl?: string;
  webhookEventsFilter?: string[];
  onProgress?: (progress: any) => void;
}

/**
 * Qwen2-VL-7B-Instruct Executor
 * 
 * Qwen2-VL-7B-Instruct is the latest iteration of the Qwen-VL model, representing nearly 
 * a year of innovation. It achieves state-of-the-art performance on visual understanding 
 * benchmarks and can understand videos over 20 minutes for high-quality video-based 
 * question answering, dialog, and content creation.
 * 
 * @param input - The multimodal analysis input parameters
 * @param options - Additional execution options
 * @returns Promise with the analysis result
 */
export async function executeQwen2VL7BInstruct(
  input: Qwen2VL7BInstructInput,
  options: Qwen2VL7BInstructOptions = {}
): Promise<string> {
  try {
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate required inputs
    if (!input.media || input.media.trim().length === 0) {
      throw new Error("Media file is required");
    }

    // Validate optional parameters
    if (input.max_new_tokens !== undefined && (input.max_new_tokens < 1 || input.max_new_tokens > 512)) {
      throw new Error("Max new tokens must be between 1 and 512");
    }

    // Prepare the request payload
    const payload: any = {
      media: input.media.trim(),
    };

    // Add optional parameters with defaults
    if (input.prompt !== undefined) payload.prompt = input.prompt.trim();
    if (input.max_new_tokens !== undefined) payload.max_new_tokens = input.max_new_tokens;

    // Execute the model
    const output = await replicate.run(
      "lucataco/qwen2-vl-7b-instruct:bf57361c75677fc33d480d0c5f02926e621b2caa2000347cb74aeae9d2ca07ee",
      {
        input: payload,
        webhook: options.webhookUrl,
        webhook_events_filter: options.webhookEventsFilter,
      }
    );

    return output as string;

  } catch (error) {
    console.error("Qwen2-VL-7B-Instruct execution failed:", error);
    throw new Error(`Qwen2-VL-7B-Instruct execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Qwen2-VL-7B-Instruct with prediction management for long-running tasks
 * 
 * @param input - The multimodal analysis input parameters
 * @param options - Additional execution options
 * @returns Promise with prediction object for tracking
 */
export async function executeQwen2VL7BInstructPrediction(
  input: Qwen2VL7BInstructInput,
  options: Qwen2VL7BInstructOptions = {}
): Promise<any> {
  try {
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate input (same validation as above)
    if (!input.media || input.media.trim().length === 0) {
      throw new Error("Media file is required");
    }

    if (input.max_new_tokens !== undefined && (input.max_new_tokens < 1 || input.max_new_tokens > 512)) {
      throw new Error("Max new tokens must be between 1 and 512");
    }

    // Prepare the request payload
    const payload: any = {
      media: input.media.trim(),
    };

    // Add optional parameters
    if (input.prompt !== undefined) payload.prompt = input.prompt.trim();
    if (input.max_new_tokens !== undefined) payload.max_new_tokens = input.max_new_tokens;

    // Create prediction
    const prediction = await replicate.predictions.create({
      model: "lucataco/qwen2-vl-7b-instruct:bf57361c75677fc33d480d0c5f02926e621b2caa2000347cb74aeae9d2ca07ee",
      input: payload,
      webhook: options.webhookUrl,
      webhook_events_filter: options.webhookEventsFilter,
    });

    return prediction;

  } catch (error) {
    console.error("Qwen2-VL-7B-Instruct prediction creation failed:", error);
    throw new Error(`Qwen2-VL-7B-Instruct prediction creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a Qwen2-VL-7B-Instruct prediction
 * 
 * @param predictionId - The prediction ID from prediction creation
 * @returns Promise with prediction status
 */
export async function checkQwen2VL7BInstructStatus(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.get(predictionId);
    return prediction;

  } catch (error) {
    console.error("Qwen2-VL-7B-Instruct status check failed:", error);
    throw new Error(`Qwen2-VL-7B-Instruct status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Cancel a running Qwen2-VL-7B-Instruct prediction
 * 
 * @param predictionId - The prediction ID to cancel
 * @returns Promise with cancellation result
 */
export async function cancelQwen2VL7BInstructPrediction(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.cancel(predictionId);
    return prediction;

  } catch (error) {
    console.error("Qwen2-VL-7B-Instruct prediction cancellation failed:", error);
    throw new Error(`Qwen2-VL-7B-Instruct prediction cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create multimodal analysis scenarios
 * 
 * @param type - Type of multimodal analysis scenario to create
 * @param customMediaUrl - Custom media URL (optional)
 * @param customOptions - Custom options (optional)
 * @returns Qwen2-VL-7B-Instruct input configuration
 */
export function createMultimodalScenario(
  type: 'image_analysis' | 'video_analysis' | 'visual_qa' | 'document_analysis' | 'multilingual_text' | 'long_video' | 'creative_content' | 'scientific_analysis' | 'medical_analysis' | 'technical_docs' | 'visual_storytelling' | 'content_creation' | 'device_control' | 'robot_operation' | 'mobile_automation' | 'custom',
  customMediaUrl?: string,
  customOptions?: Partial<Qwen2VL7BInstructInput>
): Qwen2VL7BInstructInput {
  const scenarioTemplates = {
    image_analysis: {
      media: customMediaUrl || "https://example.com/image.jpg",
      prompt: "Analyze this image and describe what you see in detail.",
      max_new_tokens: 256
    },
    video_analysis: {
      media: customMediaUrl || "https://example.com/video.mp4",
      prompt: "Describe the key events and activities in this video.",
      max_new_tokens: 512
    },
    visual_qa: {
      media: customMediaUrl || "https://example.com/image.jpg",
      prompt: "What is the main subject of this image and what are they doing?",
      max_new_tokens: 200
    },
    document_analysis: {
      media: customMediaUrl || "https://example.com/document.jpg",
      prompt: "Extract and summarize the key information from this document.",
      max_new_tokens: 400
    },
    multilingual_text: {
      media: customMediaUrl || "https://example.com/multilingual-image.jpg",
      prompt: "Read and translate all the text visible in this image.",
      max_new_tokens: 300
    },
    long_video: {
      media: customMediaUrl || "https://example.com/long-video.mp4",
      prompt: "Provide a detailed summary of this long video, including key events and themes.",
      max_new_tokens: 512
    },
    creative_content: {
      media: customMediaUrl || "https://example.com/artwork.jpg",
      prompt: "Create a creative story or narrative based on this image.",
      max_new_tokens: 300
    },
    scientific_analysis: {
      media: customMediaUrl || "https://example.com/scientific-image.jpg",
      prompt: "Analyze this scientific image and explain what it shows.",
      max_new_tokens: 350
    },
    medical_analysis: {
      media: customMediaUrl || "https://example.com/medical-image.jpg",
      prompt: "Analyze this medical image and provide insights about what it shows.",
      max_new_tokens: 300
    },
    technical_docs: {
      media: customMediaUrl || "https://example.com/technical-doc.jpg",
      prompt: "Analyze this technical documentation and explain the key concepts.",
      max_new_tokens: 400
    },
    visual_storytelling: {
      media: customMediaUrl || "https://example.com/story-image.jpg",
      prompt: "Create an engaging story based on this visual content.",
      max_new_tokens: 350
    },
    content_creation: {
      media: customMediaUrl || "https://example.com/content-image.jpg",
      prompt: "Help create engaging content based on this image.",
      max_new_tokens: 300
    },
    device_control: {
      media: customMediaUrl || "https://example.com/device-image.jpg",
      prompt: "Analyze this device interface and explain how to operate it.",
      max_new_tokens: 250
    },
    robot_operation: {
      media: customMediaUrl || "https://example.com/robot-environment.jpg",
      prompt: "Analyze this robot environment and suggest optimal operation strategies.",
      max_new_tokens: 300
    },
    mobile_automation: {
      media: customMediaUrl || "https://example.com/mobile-interface.jpg",
      prompt: "Analyze this mobile interface and provide automation guidance.",
      max_new_tokens: 250
    },
    custom: {
      media: customMediaUrl || "https://example.com/media.jpg",
      prompt: "Analyze this media content and provide insights.",
      max_new_tokens: 200
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
 * Predefined configuration templates for different multimodal analysis scenarios
 */
export const MULTIMODAL_TEMPLATES = {
  "image_analysis": {
    "description": "Comprehensive image understanding and analysis",
    "settings": {
      "prompt": "Analyze this image and describe what you see in detail.",
      "max_new_tokens": 256
    }
  },
  "video_analysis": {
    "description": "Video understanding and event analysis",
    "settings": {
      "prompt": "Describe the key events and activities in this video.",
      "max_new_tokens": 512
    }
  },
  "visual_qa": {
    "description": "Visual question answering",
    "settings": {
      "prompt": "What is the main subject of this image and what are they doing?",
      "max_new_tokens": 200
    }
  },
  "document_analysis": {
    "description": "Document understanding and information extraction",
    "settings": {
      "prompt": "Extract and summarize the key information from this document.",
      "max_new_tokens": 400
    }
  },
  "multilingual_text": {
    "description": "Multilingual text recognition and translation",
    "settings": {
      "prompt": "Read and translate all the text visible in this image.",
      "max_new_tokens": 300
    }
  },
  "long_video": {
    "description": "Long-form video comprehension and summarization",
    "settings": {
      "prompt": "Provide a detailed summary of this long video, including key events and themes.",
      "max_new_tokens": 512
    }
  },
  "creative_content": {
    "description": "Creative content generation and storytelling",
    "settings": {
      "prompt": "Create a creative story or narrative based on this image.",
      "max_new_tokens": 300
    }
  },
  "scientific_analysis": {
    "description": "Scientific image analysis and interpretation",
    "settings": {
      "prompt": "Analyze this scientific image and explain what it shows.",
      "max_new_tokens": 350
    }
  },
  "medical_analysis": {
    "description": "Medical image understanding and analysis",
    "settings": {
      "prompt": "Analyze this medical image and provide insights about what it shows.",
      "max_new_tokens": 300
    }
  },
  "technical_docs": {
    "description": "Technical documentation analysis",
    "settings": {
      "prompt": "Analyze this technical documentation and explain the key concepts.",
      "max_new_tokens": 400
    }
  }
} as const;

/**
 * Example usage of the Qwen2-VL-7B-Instruct executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic image or video analysis
    const result1 = await executeQwen2VL7BInstruct({
      media: "https://replicate.delivery/pbxt/MB8qw19bkjGGCTr8Px17db2ydBA3xrHyxBk5g5wRSEH0in9N/q2m-LO3Xg0vO0xmw.mp4",
      prompt: "Describe this video in detail."
    });

    console.log("Multimodal analysis:", result1);

    // Example 2: Using helper function for image analysis
    const imageAnalysis = createMultimodalScenario('image_analysis');
    const result2 = await executeQwen2VL7BInstruct(imageAnalysis);
    console.log("Image analysis:", result2);

    // Example 3: Custom multimodal analysis with specific parameters
    const customAnalysis = createMultimodalScenario(
      'custom',
      "https://example.com/custom-media.jpg",
      { prompt: "Provide a detailed analysis of this content.", max_new_tokens: 400 }
    );
    const result3 = await executeQwen2VL7BInstruct(customAnalysis);
    console.log("Custom analysis:", result3);

    // Example 4: Using predefined templates
    const result4 = await executeQwen2VL7BInstruct({
      media: "https://example.com/document.jpg",
      ...MULTIMODAL_TEMPLATES.document_analysis.settings
    });
    console.log("Document analysis:", result4);

    // Example 5: Prediction usage for long-running tasks
    const prediction = await executeQwen2VL7BInstructPrediction({
      media: "https://example.com/complex-video.mp4",
      prompt: "Analyze this complex video in detail.",
      max_new_tokens: 512,
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Prediction ID:", prediction.id);

    // Check status
    const status = await checkQwen2VL7BInstructStatus(prediction.id);
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
  const costPerRun = 0.0032;
  return runs * costPerRun;
}

/**
 * Utility function to validate media URL
 * 
 * @param url - The media URL to validate
 * @returns Validation result with suggestions
 */
export function validateMediaURL(url: string): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedURL: string; 
} {
  const suggestions: string[] = [];
  
  // Clean and format URL
  const formattedURL = url.trim();

  // Check for common issues
  if (!url || url.trim().length === 0) {
    suggestions.push("Media URL is required");
  }

  // Check for valid URL format
  try {
    new URL(url);
  } catch {
    suggestions.push("Media URL must be a valid URL");
  }

  // Check for valid media format
  if (!isValidMediaURL(url)) {
    suggestions.push("Media must be in supported format (images or videos)");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedURL
  };
}

/**
 * Utility function to get optimal parameters for analysis type
 * 
 * @param analysisType - Type of multimodal analysis
 * @returns Recommended parameters
 */
export function getOptimalParameters(analysisType: 'image_analysis' | 'video_analysis' | 'visual_qa' | 'document_analysis' | 'multilingual_text' | 'long_video' | 'creative_content' | 'scientific_analysis' | 'medical_analysis' | 'technical_docs'): {
  prompt: string;
  max_new_tokens: number;
  description: string;
} {
  const parameterMap = {
    image_analysis: { 
      prompt: "Analyze this image and describe what you see in detail.",
      max_new_tokens: 256,
      description: "Comprehensive image understanding and analysis"
    },
    video_analysis: { 
      prompt: "Describe the key events and activities in this video.",
      max_new_tokens: 512,
      description: "Video understanding and event analysis"
    },
    visual_qa: { 
      prompt: "What is the main subject of this image and what are they doing?",
      max_new_tokens: 200,
      description: "Visual question answering"
    },
    document_analysis: { 
      prompt: "Extract and summarize the key information from this document.",
      max_new_tokens: 400,
      description: "Document understanding and information extraction"
    },
    multilingual_text: { 
      prompt: "Read and translate all the text visible in this image.",
      max_new_tokens: 300,
      description: "Multilingual text recognition and translation"
    },
    long_video: { 
      prompt: "Provide a detailed summary of this long video, including key events and themes.",
      max_new_tokens: 512,
      description: "Long-form video comprehension and summarization"
    },
    creative_content: { 
      prompt: "Create a creative story or narrative based on this image.",
      max_new_tokens: 300,
      description: "Creative content generation and storytelling"
    },
    scientific_analysis: { 
      prompt: "Analyze this scientific image and explain what it shows.",
      max_new_tokens: 350,
      description: "Scientific image analysis and interpretation"
    },
    medical_analysis: { 
      prompt: "Analyze this medical image and provide insights about what it shows.",
      max_new_tokens: 300,
      description: "Medical image understanding and analysis"
    },
    technical_docs: { 
      prompt: "Analyze this technical documentation and explain the key concepts.",
      max_new_tokens: 400,
      description: "Technical documentation analysis"
    }
  };

  return parameterMap[analysisType];
}

/**
 * Utility function to create batch multimodal analysis
 * 
 * @param mediaUrlsArray - Array of media URLs
 * @param parametersArray - Array of parameter objects
 * @returns Array of Qwen2-VL-7B-Instruct inputs
 */
export function createBatchMultimodalAnalysis(
  mediaUrlsArray: string[], 
  parametersArray: Partial<Qwen2VL7BInstructInput>[]
): Qwen2VL7BInstructInput[] {
  if (mediaUrlsArray.length !== parametersArray.length) {
    throw new Error("Media URLs and parameters arrays must have the same length");
  }

  return mediaUrlsArray.map((mediaUrl, index) => ({
    media: mediaUrl,
    ...parametersArray[index]
  }));
}

/**
 * Check if URL is a valid media format
 * 
 * @param url - The URL to check
 * @returns True if URL is a valid media format
 */
function isValidMediaURL(url: string): boolean {
  const mediaExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.mp4', '.avi', '.mov', '.webm', '.mkv'];
  return mediaExtensions.some(ext => url.toLowerCase().includes(ext));
}

/**
 * Supported media formats
 */
export const SUPPORTED_MEDIA_FORMATS = [
  "Images: JPG, JPEG, PNG, GIF, WebP, BMP",
  "Videos: MP4, AVI, MOV, WebM, MKV"
] as const;

/**
 * Common multimodal analysis scenarios
 */
export const MULTIMODAL_ANALYSIS_SCENARIOS = {
  "image_analysis": "Image understanding and analysis",
  "video_analysis": "Video understanding and analysis",
  "visual_qa": "Visual question answering",
  "document_analysis": "Document analysis and understanding",
  "multilingual_text": "Multilingual text recognition in images",
  "long_video": "Long-form video comprehension",
  "creative_content": "Creative content generation",
  "scientific_analysis": "Scientific image analysis",
  "medical_analysis": "Medical image understanding",
  "technical_docs": "Technical documentation analysis",
  "visual_storytelling": "Visual storytelling",
  "content_creation": "Content creation assistance",
  "device_control": "Device operation and control",
  "robot_operation": "Robot operation and control",
  "mobile_automation": "Mobile phone automation",
  "custom": "User-defined analysis scenarios"
} as const;

/**
 * Hardware requirements
 */
export const HARDWARE_REQUIREMENTS = {
  "gpu": "Nvidia L40S GPU",
  "memory": "High memory requirements for multimodal processing",
  "processing_power": "High computational requirements",
  "storage": "Temporary storage for media processing"
} as const;

/**
 * Benchmark performance
 */
export const BENCHMARK_PERFORMANCE = {
  "image_understanding": "State-of-the-art image understanding performance",
  "video_understanding": "Advanced video understanding (20+ minutes)",
  "multimodal_integration": "Advanced multimodal processing capabilities",
  "visual_reasoning": "Complex reasoning and decision making",
  "question_answering": "High-quality video-based question answering",
  "content_creation": "Content creation assistance",
  "multilingual_support": "Multilingual text understanding in images",
  "dynamic_resolution": "Dynamic resolution with arbitrary image resolutions",
  "positional_embedding": "Multimodal Rotary Position Embedding (M-ROPE)",
  "device_integration": "Mobile phones, robots, and other devices",
  "long_form_video": "20+ minute video comprehension",
  "visual_processing": "Human-like visual processing experience",
  "multimodal_conversation": "Interactive multimodal dialog",
  "document_analysis": "Document understanding and analysis",
  "scientific_analysis": "Scientific image analysis and interpretation",
  "medical_analysis": "Medical image understanding and analysis",
  "technical_docs": "Technical documentation analysis",
  "visual_storytelling": "Visual storytelling capabilities",
  "creative_generation": "Creative content generation",
  "production_readiness": "Production-ready performance and scalability"
} as const;

/**
 * Multimodal analysis tips
 */
export const MULTIMODAL_ANALYSIS_TIPS = {
  "prompt_optimization": "Use clear and specific prompts for better analysis results",
  "media_quality": "Provide high-quality media for optimal understanding",
  "token_optimization": "Use appropriate token limits based on content complexity",
  "multilingual_usage": "Leverage the model's multilingual capabilities for global content",
  "resolution_optimization": "Take advantage of dynamic resolution support for various image sizes",
  "long_video_usage": "Use the model's long-form video understanding for comprehensive analysis",
  "reasoning_capabilities": "Utilize visual reasoning capabilities for complex tasks",
  "device_integration": "Consider the model's device integration capabilities for automation",
  "interactive_dialog": "Use interactive dialog features for engaging conversations",
  "visual_processing": "Leverage advanced visual processing for professional applications",
  "multimodal_conversation": "Take advantage of multimodal conversation capabilities",
  "content_creation": "Use the model's content creation assistance for creative tasks",
  "visual_qa": "Leverage visual question answering for educational content",
  "document_analysis": "Utilize document analysis capabilities for business applications",
  "scientific_analysis": "Take advantage of scientific and medical image understanding",
  "technical_docs": "Use the model's technical documentation analysis features",
  "visual_storytelling": "Leverage visual storytelling capabilities for narrative content",
  "creative_generation": "Utilize creative content generation for artistic applications",
  "visual_search": "Take advantage of visual search and retrieval capabilities",
  "ar_integration": "Use the model's augmented reality integration features"
} as const;

export default executeQwen2VL7BInstruct;
