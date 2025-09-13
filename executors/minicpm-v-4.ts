import Replicate from "replicate";

export interface MiniCPMV4Input {
  prompt: string;
  image?: string;
  video?: string;
  video_max_frames?: number;
}

export type MiniCPMV4Output = string;

export interface MiniCPMV4Options {
  webhookUrl?: string;
  webhookEventsFilter?: string[];
  onProgress?: (progress: any) => void;
}

/**
 * MiniCPM-V-4 Executor
 * 
 * MiniCPM-V 4.0 has strong image and video understanding performance.
 * A GPT-4V Level MLLM for Single Image, Multi Image and Video on Your Phone
 * with leading visual capability and superior efficiency.
 * 
 * The model is built based on SigLIP2-400M and MiniCPM4-3B with a total of 4.1B parameters.
 * It achieves an average score of 69.0 on OpenCompass, outperforming GPT-4.1-mini-20250414.
 * 
 * @param input - The visual analysis input parameters
 * @param options - Additional execution options
 * @returns Promise with the analysis result
 */
export async function executeMiniCPMV4(
  input: MiniCPMV4Input,
  options: MiniCPMV4Options = {}
): Promise<MiniCPMV4Output> {
  try {
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate required inputs
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    // Validate optional parameters
    if (input.video_max_frames !== undefined && (input.video_max_frames < 1 || input.video_max_frames > 64)) {
      throw new Error("Video max frames must be between 1 and 64");
    }

    // At least one of image or video must be provided
    if (!input.image && !input.video) {
      throw new Error("Either image or video must be provided");
    }

    // Prepare the request payload
    const payload: any = {
      prompt: input.prompt.trim(),
    };

    // Add optional parameters
    if (input.image) {
      payload.image = input.image.trim();
    }
    if (input.video) {
      payload.video = input.video.trim();
    }
    if (input.video_max_frames !== undefined) {
      payload.video_max_frames = input.video_max_frames;
    }

    // Execute the model
    const output = await replicate.run(
      "lucataco/minicpm-v-4:8b647b895c75cc7885d0a22d4fb1a0a2cb4fcf8ebbc13b78e09ec671f9183b27",
      {
        input: payload,
        webhook: options.webhookUrl,
        webhook_events_filter: options.webhookEventsFilter,
      }
    );

    return output as string;

  } catch (error) {
    console.error("MiniCPM-V-4 execution failed:", error);
    throw new Error(`MiniCPM-V-4 execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute MiniCPM-V-4 with prediction management for long-running tasks
 * 
 * @param input - The visual analysis input parameters
 * @param options - Additional execution options
 * @returns Promise with prediction object for tracking
 */
export async function executeMiniCPMV4Prediction(
  input: MiniCPMV4Input,
  options: MiniCPMV4Options = {}
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

    if (input.video_max_frames !== undefined && (input.video_max_frames < 1 || input.video_max_frames > 64)) {
      throw new Error("Video max frames must be between 1 and 64");
    }

    if (!input.image && !input.video) {
      throw new Error("Either image or video must be provided");
    }

    // Prepare the request payload
    const payload: any = {
      prompt: input.prompt.trim(),
    };

    if (input.image) {
      payload.image = input.image.trim();
    }
    if (input.video) {
      payload.video = input.video.trim();
    }
    if (input.video_max_frames !== undefined) {
      payload.video_max_frames = input.video_max_frames;
    }

    // Create prediction
    const prediction = await replicate.predictions.create({
      model: "lucataco/minicpm-v-4:8b647b895c75cc7885d0a22d4fb1a0a2cb4fcf8ebbc13b78e09ec671f9183b27",
      input: payload,
      webhook: options.webhookUrl,
      webhook_events_filter: options.webhookEventsFilter,
    });

    return prediction;

  } catch (error) {
    console.error("MiniCPM-V-4 prediction creation failed:", error);
    throw new Error(`MiniCPM-V-4 prediction creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute MiniCPM-V-4 with streaming support
 * 
 * @param input - The visual analysis input parameters
 * @param options - Additional execution options
 * @returns Promise with streaming result
 */
export async function executeMiniCPMV4Stream(
  input: MiniCPMV4Input,
  options: MiniCPMV4Options = {}
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

    if (input.video_max_frames !== undefined && (input.video_max_frames < 1 || input.video_max_frames > 64)) {
      throw new Error("Video max frames must be between 1 and 64");
    }

    if (!input.image && !input.video) {
      throw new Error("Either image or video must be provided");
    }

    // Prepare the request payload
    const payload: any = {
      prompt: input.prompt.trim(),
    };

    if (input.image) {
      payload.image = input.image.trim();
    }
    if (input.video) {
      payload.video = input.video.trim();
    }
    if (input.video_max_frames !== undefined) {
      payload.video_max_frames = input.video_max_frames;
    }

    // Create streaming prediction
    const stream = await replicate.stream(
      "lucataco/minicpm-v-4:8b647b895c75cc7885d0a22d4fb1a0a2cb4fcf8ebbc13b78e09ec671f9183b27",
      { input: payload }
    );

    return stream;

  } catch (error) {
    console.error("MiniCPM-V-4 streaming failed:", error);
    throw new Error(`MiniCPM-V-4 streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a MiniCPM-V-4 prediction
 * 
 * @param predictionId - The prediction ID from prediction creation
 * @returns Promise with prediction status
 */
export async function checkMiniCPMV4Status(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.get(predictionId);
    return prediction;

  } catch (error) {
    console.error("MiniCPM-V-4 status check failed:", error);
    throw new Error(`MiniCPM-V-4 status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Cancel a running MiniCPM-V-4 prediction
 * 
 * @param predictionId - The prediction ID to cancel
 * @returns Promise with cancellation result
 */
export async function cancelMiniCPMV4Prediction(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.cancel(predictionId);
    return prediction;

  } catch (error) {
    console.error("MiniCPM-V-4 prediction cancellation failed:", error);
    throw new Error(`MiniCPM-V-4 prediction cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create mobile visual analysis scenarios
 * 
 * @param type - Type of visual analysis scenario to create
 * @param customImageUrl - Custom image URL (optional)
 * @param customVideoUrl - Custom video URL (optional)
 * @param customOptions - Custom options (optional)
 * @returns MiniCPM-V-4 input configuration
 */
export function createMobileVisualScenario(
  type: 'mobile_analysis' | 'image_description' | 'video_analysis' | 'visual_qa' | 'document_analysis' | 'chart_understanding' | 'edge_computing' | 'real_time_processing' | 'multi_image' | 'visual_reasoning' | 'content_moderation' | 'accessibility_enhancement' | 'educational_content' | 'social_media' | 'e_commerce' | 'news_analysis' | 'scientific_analysis' | 'medical_analysis' | 'technical_docs' | 'visual_marketing' | 'brand_monitoring' | 'quality_control' | 'surveillance' | 'robotics' | 'smart_home' | 'healthcare' | 'education' | 'automotive' | 'custom',
  customImageUrl?: string,
  customVideoUrl?: string,
  customOptions?: Partial<MiniCPMV4Input>
): MiniCPMV4Input {
  const scenarioTemplates = {
    mobile_analysis: {
      image: customImageUrl || "https://example.com/mobile-image.jpg",
      prompt: "Analyze this image for mobile device processing."
    },
    image_description: {
      image: customImageUrl || "https://example.com/image.jpg",
      prompt: "Describe this image in detail."
    },
    video_analysis: {
      video: customVideoUrl || "https://example.com/video.mp4",
      prompt: "Analyze this video content and describe what happens.",
      video_max_frames: 16
    },
    visual_qa: {
      image: customImageUrl || "https://example.com/image.jpg",
      prompt: "What is the main subject of this image and what are they doing?"
    },
    document_analysis: {
      image: customImageUrl || "https://example.com/document.jpg",
      prompt: "Extract and summarize the key information from this document."
    },
    chart_understanding: {
      image: customImageUrl || "https://example.com/chart.jpg",
      prompt: "Analyze this chart and explain the data trends."
    },
    edge_computing: {
      image: customImageUrl || "https://example.com/edge-image.jpg",
      prompt: "Process this image for edge computing applications."
    },
    real_time_processing: {
      image: customImageUrl || "https://example.com/realtime-image.jpg",
      prompt: "Provide real-time analysis of this image."
    },
    multi_image: {
      image: customImageUrl || "https://example.com/image1.jpg",
      prompt: "Compare and analyze these images."
    },
    visual_reasoning: {
      image: customImageUrl || "https://example.com/reasoning-image.jpg",
      prompt: "Analyze this image and provide logical reasoning about what you observe."
    },
    content_moderation: {
      image: customImageUrl || "https://example.com/content-image.jpg",
      prompt: "Analyze this image for content moderation purposes."
    },
    accessibility_enhancement: {
      image: customImageUrl || "https://example.com/accessibility-image.jpg",
      prompt: "Describe this image to enhance accessibility for visually impaired users."
    },
    educational_content: {
      image: customImageUrl || "https://example.com/educational-image.jpg",
      prompt: "Create educational content based on this image."
    },
    social_media: {
      image: customImageUrl || "https://example.com/social-image.jpg",
      prompt: "Create engaging social media content based on this image."
    },
    e_commerce: {
      image: customImageUrl || "https://example.com/product-image.jpg",
      prompt: "Generate product description for this e-commerce image."
    },
    news_analysis: {
      image: customImageUrl || "https://example.com/news-image.jpg",
      prompt: "Analyze this news image and provide context."
    },
    scientific_analysis: {
      image: customImageUrl || "https://example.com/scientific-image.jpg",
      prompt: "Analyze this scientific image and explain what you observe."
    },
    medical_analysis: {
      image: customImageUrl || "https://example.com/medical-image.jpg",
      prompt: "Describe what you see in this medical image."
    },
    technical_docs: {
      image: customImageUrl || "https://example.com/technical-doc.jpg",
      prompt: "Analyze this technical documentation and explain the key concepts."
    },
    visual_marketing: {
      image: customImageUrl || "https://example.com/marketing-image.jpg",
      prompt: "Analyze this image for marketing purposes."
    },
    brand_monitoring: {
      image: customImageUrl || "https://example.com/brand-image.jpg",
      prompt: "Analyze this image for brand monitoring."
    },
    quality_control: {
      image: customImageUrl || "https://example.com/quality-image.jpg",
      prompt: "Analyze this image for quality control purposes."
    },
    surveillance: {
      image: customImageUrl || "https://example.com/surveillance-image.jpg",
      prompt: "Analyze this surveillance image for security purposes."
    },
    robotics: {
      image: customImageUrl || "https://example.com/robotics-image.jpg",
      prompt: "Analyze this image for robotic system processing."
    },
    smart_home: {
      image: customImageUrl || "https://example.com/smart-home-image.jpg",
      prompt: "Analyze this image for smart home automation."
    },
    healthcare: {
      image: customImageUrl || "https://example.com/healthcare-image.jpg",
      prompt: "Analyze this image for healthcare applications."
    },
    education: {
      image: customImageUrl || "https://example.com/education-image.jpg",
      prompt: "Analyze this image for educational purposes."
    },
    automotive: {
      image: customImageUrl || "https://example.com/automotive-image.jpg",
      prompt: "Analyze this image for automotive applications."
    },
    custom: {
      image: customImageUrl || "https://example.com/image.jpg",
      prompt: "Analyze this image and provide insights."
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
 * Predefined configuration templates for different mobile visual analysis scenarios
 */
export const MOBILE_VISUAL_TEMPLATES = {
  "mobile_analysis": {
    "description": "Mobile device optimized image analysis",
    "settings": {
      "prompt": "Analyze this image for mobile device processing."
    }
  },
  "image_description": {
    "description": "Image description for mobile applications",
    "settings": {
      "prompt": "Describe this image in detail."
    }
  },
  "video_analysis": {
    "description": "Video content analysis for mobile devices",
    "settings": {
      "prompt": "Analyze this video content and describe what happens.",
      "video_max_frames": 16
    }
  },
  "visual_qa": {
    "description": "Visual question answering for mobile use",
    "settings": {
      "prompt": "What is the main subject of this image and what are they doing?"
    }
  },
  "document_analysis": {
    "description": "Document analysis for mobile applications",
    "settings": {
      "prompt": "Extract and summarize the key information from this document."
    }
  },
  "chart_understanding": {
    "description": "Chart and graph understanding for mobile",
    "settings": {
      "prompt": "Analyze this chart and explain the data trends."
    }
  },
  "edge_computing": {
    "description": "Edge computing optimized processing",
    "settings": {
      "prompt": "Process this image for edge computing applications."
    }
  },
  "real_time_processing": {
    "description": "Real-time visual processing for mobile",
    "settings": {
      "prompt": "Provide real-time analysis of this image."
    }
  },
  "multi_image": {
    "description": "Multi-image understanding for mobile",
    "settings": {
      "prompt": "Compare and analyze these images."
    }
  },
  "visual_reasoning": {
    "description": "Visual reasoning and logical analysis for mobile",
    "settings": {
      "prompt": "Analyze this image and provide logical reasoning about what you observe."
    }
  }
} as const;

/**
 * Example usage of the MiniCPM-V-4 executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic image analysis
    const result1 = await executeMiniCPMV4({
      image: "https://example.com/image.jpg",
      prompt: "describe this image in detail"
    });

    console.log("Image analysis:", result1);

    // Example 2: Video analysis
    const result2 = await executeMiniCPMV4({
      video: "https://example.com/video.mp4",
      prompt: "describe what happens in this video",
      video_max_frames: 16
    });

    console.log("Video analysis:", result2);

    // Example 3: Using helper function for mobile analysis
    const mobileAnalysis = createMobileVisualScenario('mobile_analysis');
    const result3 = await executeMiniCPMV4(mobileAnalysis);
    console.log("Mobile analysis:", result3);

    // Example 4: Custom mobile analysis with specific parameters
    const customAnalysis = createMobileVisualScenario(
      'custom',
      "https://example.com/custom-image.jpg",
      undefined,
      { 
        prompt: "Provide a detailed analysis of this content for mobile users.",
        video_max_frames: 8
      }
    );
    const result4 = await executeMiniCPMV4(customAnalysis);
    console.log("Custom analysis:", result4);

    // Example 5: Using predefined templates
    const result5 = await executeMiniCPMV4({
      image: "https://example.com/chart.jpg",
      ...MOBILE_VISUAL_TEMPLATES.chart_understanding.settings
    });
    console.log("Chart analysis:", result5);

    // Example 6: Prediction usage for long-running tasks
    const prediction = await executeMiniCPMV4Prediction({
      image: "https://example.com/complex-image.jpg",
      prompt: "Analyze this complex image in detail.",
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Prediction ID:", prediction.id);

    // Check status
    const status = await checkMiniCPMV4Status(prediction.id);
    console.log("Prediction status:", status.status);

    // Get result when completed
    if (status.status === "succeeded") {
      console.log("Prediction result:", status.output);
    }

    // Example 7: Streaming usage
    const stream = await executeMiniCPMV4Stream({
      image: "https://example.com/image.jpg",
      prompt: "Describe this image as you process it."
    });

    for await (const event of stream) {
      process.stdout.write(`${event}`);
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
  const costPerRun = 0.0; // Free model
  return runs * costPerRun;
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
    suggestions.push("Image must be in supported format (JPEG, PNG, WebP, BMP)");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedURL
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
    suggestions.push("Video must be in supported format (MP4, AVI, MOV)");
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
 * @param analysisType - Type of visual analysis
 * @returns Recommended parameters
 */
export function getOptimalParameters(analysisType: 'mobile_analysis' | 'image_description' | 'video_analysis' | 'visual_qa' | 'document_analysis' | 'chart_understanding' | 'edge_computing' | 'real_time_processing' | 'multi_image' | 'visual_reasoning'): {
  prompt: string;
  video_max_frames?: number;
  description: string;
} {
  const parameterMap = {
    mobile_analysis: { 
      prompt: "Analyze this image for mobile device processing.",
      description: "Mobile device optimized image analysis"
    },
    image_description: { 
      prompt: "Describe this image in detail.",
      description: "Image description for mobile applications"
    },
    video_analysis: { 
      prompt: "Analyze this video content and describe what happens.",
      video_max_frames: 16,
      description: "Video content analysis for mobile devices"
    },
    visual_qa: { 
      prompt: "What is the main subject of this image and what are they doing?",
      description: "Visual question answering for mobile use"
    },
    document_analysis: { 
      prompt: "Extract and summarize the key information from this document.",
      description: "Document analysis for mobile applications"
    },
    chart_understanding: { 
      prompt: "Analyze this chart and explain the data trends.",
      description: "Chart and graph understanding for mobile"
    },
    edge_computing: { 
      prompt: "Process this image for edge computing applications.",
      description: "Edge computing optimized processing"
    },
    real_time_processing: { 
      prompt: "Provide real-time analysis of this image.",
      description: "Real-time visual processing for mobile"
    },
    multi_image: { 
      prompt: "Compare and analyze these images.",
      description: "Multi-image understanding for mobile"
    },
    visual_reasoning: { 
      prompt: "Analyze this image and provide logical reasoning about what you observe.",
      description: "Visual reasoning and logical analysis for mobile"
    }
  };

  return parameterMap[analysisType];
}

/**
 * Utility function to create batch visual analysis
 * 
 * @param imageUrlsArray - Array of image URLs
 * @param parametersArray - Array of parameter objects
 * @returns Array of MiniCPM-V-4 inputs
 */
export function createBatchVisualAnalysis(
  imageUrlsArray: string[], 
  parametersArray: Partial<MiniCPMV4Input>[]
): MiniCPMV4Input[] {
  if (imageUrlsArray.length !== parametersArray.length) {
    throw new Error("Image URLs and parameters arrays must have the same length");
  }

  return imageUrlsArray.map((imageUrl, index) => ({
    image: imageUrl,
    prompt: "Analyze this image and provide insights.",
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
 * Check if URL is a valid video format
 * 
 * @param url - The URL to check
 * @returns True if URL is a valid video format
 */
function isValidVideoURL(url: string): boolean {
  const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];
  return videoExtensions.some(ext => url.toLowerCase().includes(ext));
}

/**
 * Supported image formats
 */
export const SUPPORTED_IMAGE_FORMATS = [
  "JPEG, PNG, WebP, BMP, GIF"
] as const;

/**
 * Supported video formats
 */
export const SUPPORTED_VIDEO_FORMATS = [
  "MP4, AVI, MOV, WMV, FLV, WebM"
] as const;

/**
 * Common mobile visual analysis scenarios
 */
export const MOBILE_VISUAL_SCENARIOS = {
  "mobile_analysis": "Mobile device optimized image analysis",
  "image_description": "Image description for mobile applications",
  "video_analysis": "Video content analysis for mobile devices",
  "visual_qa": "Visual question answering for mobile use",
  "document_analysis": "Document analysis for mobile applications",
  "chart_understanding": "Chart and graph understanding for mobile",
  "edge_computing": "Edge computing optimized processing",
  "real_time_processing": "Real-time visual processing for mobile",
  "multi_image": "Multi-image understanding for mobile",
  "visual_reasoning": "Visual reasoning and logical analysis for mobile",
  "content_moderation": "Content moderation for mobile devices",
  "accessibility_enhancement": "Accessibility enhancement for mobile",
  "educational_content": "Educational content for mobile",
  "social_media": "Social media content for mobile",
  "e_commerce": "E-commerce product analysis for mobile",
  "news_analysis": "News image analysis for mobile",
  "scientific_analysis": "Scientific image analysis for mobile",
  "medical_analysis": "Medical image understanding for mobile",
  "technical_docs": "Technical documentation analysis for mobile",
  "visual_marketing": "Visual marketing analysis for mobile",
  "brand_monitoring": "Brand monitoring for mobile",
  "quality_control": "Quality control for mobile",
  "surveillance": "Surveillance and security for mobile",
  "robotics": "Robotics and automation for mobile",
  "smart_home": "Smart home applications for mobile",
  "healthcare": "Healthcare visual systems for mobile",
  "education": "Educational visual tools for mobile",
  "automotive": "Automotive visual systems for mobile",
  "custom": "User-defined analysis scenarios for mobile"
} as const;

/**
 * Hardware requirements
 */
export const HARDWARE_REQUIREMENTS = {
  "gpu": "Nvidia L40S GPU",
  "memory": "Mobile-optimized memory requirements",
  "processing_power": "Mobile-optimized processing for on-device deployment",
  "storage": "Minimal storage requirements",
  "mobile_devices": "Optimized for mobile device deployment",
  "edge_devices": "Edge device compatible",
  "on_device": "On-device processing capability"
} as const;

/**
 * Benchmark performance
 */
export const BENCHMARK_PERFORMANCE = {
  "opencompass": "69.0 average score",
  "ocrbench": "894",
  "mathvista": "66.9",
  "hallusionbench": "50.8",
  "mmmu": "51.2",
  "mmvet": "68.0",
  "mmbench_v1_1": "79.7",
  "mmstar": "62.8",
  "ai2d": "82.9",
  "chartqa": "84.4",
  "mme": "68.5",
  "realworldqa": "80.8",
  "textvqa": "92.9",
  "docvqa": "20.7",
  "mathvision": "14.2",
  "dynamath": "32.7",
  "wemath": "6.3",
  "object_halbench": "3.5",
  "mm_halbench": "4.1",
  "mantis": "71.4",
  "blink": "54.0",
  "video_mme": "61.2/65.8",
  "mobile_optimization": "Optimized for mobile device deployment",
  "edge_computing": "Edge computing optimization",
  "on_device_processing": "On-device processing capability",
  "mobile_efficiency": "Superior efficiency for mobile devices",
  "iphone_16_pro_max": "Less than 2s first token delay, more than 17 token/s decoding",
  "no_heating": "No heating problems on mobile devices",
  "concurrent_requests": "Superior throughput under concurrent requests"
} as const;

/**
 * Mobile visual analysis tips
 */
export const MOBILE_VISUAL_TIPS = {
  "prompt_optimization": "Use clear and specific prompts for better analysis results",
  "image_quality": "Provide high-quality images for optimal understanding",
  "video_quality": "Provide high-quality videos for optimal understanding",
  "mobile_optimization": "Leverage the model's mobile optimization for on-device applications",
  "edge_computing": "Take advantage of the model's edge computing capabilities",
  "real_time_processing": "Use the model's real-time processing for mobile applications",
  "video_analysis": "Leverage the model's video understanding capabilities",
  "multi_image": "Take advantage of multi-image understanding features",
  "visual_reasoning": "Leverage the model's visual reasoning capabilities",
  "content_moderation": "Use the model's content moderation for mobile apps",
  "accessibility": "Leverage accessibility enhancement features",
  "educational_content": "Utilize educational content creation capabilities",
  "social_media": "Take advantage of social media content features",
  "e_commerce": "Use e-commerce product analysis capabilities",
  "news_analysis": "Leverage news image analysis features",
  "scientific_analysis": "Take advantage of scientific image analysis",
  "medical_analysis": "Use medical image understanding capabilities",
  "technical_docs": "Leverage technical documentation analysis",
  "visual_marketing": "Take advantage of visual marketing analysis",
  "brand_monitoring": "Use brand monitoring capabilities",
  "quality_control": "Leverage quality control features",
  "surveillance": "Take advantage of surveillance and security capabilities",
  "robotics": "Use robotics and automation features",
  "smart_home": "Leverage smart home application capabilities",
  "healthcare": "Take advantage of healthcare visual systems",
  "education": "Use educational visual tool features",
  "automotive": "Leverage automotive visual system capabilities",
  "free_commercial": "Take advantage of free commercial use after registration",
  "apache_license": "Use the model's Apache 2.0 license for open source projects",
  "academic_research": "Leverage the model's academic research capabilities",
  "comprehensive_benchmarks": "Utilize the model's comprehensive benchmark performance",
  "mobile_device_optimization": "Take advantage of mobile device optimization",
  "edge_computing_integration": "Use the model's edge computing integration features"
} as const;

export default executeMiniCPMV4;
