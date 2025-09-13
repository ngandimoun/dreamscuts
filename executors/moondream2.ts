import Replicate from "replicate";

export interface Moondream2Input {
  image: string;
  prompt?: string;
}

export interface Moondream2Output {
  type: string[];
}

export interface Moondream2Options {
  webhookUrl?: string;
  webhookEventsFilter?: string[];
  onProgress?: (progress: any) => void;
}

/**
 * Moondream2 Executor
 * 
 * Moondream2 is a small vision language model designed to run efficiently on edge devices.
 * Despite its compact size, it achieves impressive performance on visual question answering 
 * benchmarks including VQAv2 (79.4%), GQA (64.9%), TextVQA (60.2%), and DocVQA (61.9%).
 * The model is optimized for resource-constrained environments and real-time processing.
 * 
 * @param input - The visual analysis input parameters
 * @param options - Additional execution options
 * @returns Promise with the analysis result
 */
export async function executeMoondream2(
  input: Moondream2Input,
  options: Moondream2Options = {}
): Promise<string[]> {
  try {
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate required inputs
    if (!input.image || input.image.trim().length === 0) {
      throw new Error("Image file is required");
    }

    // Prepare the request payload
    const payload: any = {
      image: input.image.trim(),
    };

    // Add optional prompt with default
    if (input.prompt !== undefined) {
      payload.prompt = input.prompt.trim();
    } else {
      payload.prompt = "Describe this image";
    }

    // Execute the model
    const output = await replicate.run(
      "lucataco/moondream2:72ccb656353c348c1385df54b237eeb7bfa874bf11486cf0b9473e691b662d31",
      {
        input: payload,
        webhook: options.webhookUrl,
        webhook_events_filter: options.webhookEventsFilter,
      }
    );

    return output as string[];

  } catch (error) {
    console.error("Moondream2 execution failed:", error);
    throw new Error(`Moondream2 execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Moondream2 with prediction management for long-running tasks
 * 
 * @param input - The visual analysis input parameters
 * @param options - Additional execution options
 * @returns Promise with prediction object for tracking
 */
export async function executeMoondream2Prediction(
  input: Moondream2Input,
  options: Moondream2Options = {}
): Promise<any> {
  try {
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate input (same validation as above)
    if (!input.image || input.image.trim().length === 0) {
      throw new Error("Image file is required");
    }

    // Prepare the request payload
    const payload: any = {
      image: input.image.trim(),
    };

    // Add optional prompt with default
    if (input.prompt !== undefined) {
      payload.prompt = input.prompt.trim();
    } else {
      payload.prompt = "Describe this image";
    }

    // Create prediction
    const prediction = await replicate.predictions.create({
      model: "lucataco/moondream2:72ccb656353c348c1385df54b237eeb7bfa874bf11486cf0b9473e691b662d31",
      input: payload,
      webhook: options.webhookUrl,
      webhook_events_filter: options.webhookEventsFilter,
    });

    return prediction;

  } catch (error) {
    console.error("Moondream2 prediction creation failed:", error);
    throw new Error(`Moondream2 prediction creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Moondream2 with streaming support
 * 
 * @param input - The visual analysis input parameters
 * @param options - Additional execution options
 * @returns Promise with streaming result
 */
export async function executeMoondream2Stream(
  input: Moondream2Input,
  options: Moondream2Options = {}
): Promise<any> {
  try {
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate input (same validation as above)
    if (!input.image || input.image.trim().length === 0) {
      throw new Error("Image file is required");
    }

    // Prepare the request payload
    const payload: any = {
      image: input.image.trim(),
    };

    // Add optional prompt with default
    if (input.prompt !== undefined) {
      payload.prompt = input.prompt.trim();
    } else {
      payload.prompt = "Describe this image";
    }

    // Create streaming prediction
    const stream = await replicate.stream(
      "lucataco/moondream2:72ccb656353c348c1385df54b237eeb7bfa874bf11486cf0b9473e691b662d31",
      { input: payload }
    );

    return stream;

  } catch (error) {
    console.error("Moondream2 streaming failed:", error);
    throw new Error(`Moondream2 streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a Moondream2 prediction
 * 
 * @param predictionId - The prediction ID from prediction creation
 * @returns Promise with prediction status
 */
export async function checkMoondream2Status(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.get(predictionId);
    return prediction;

  } catch (error) {
    console.error("Moondream2 status check failed:", error);
    throw new Error(`Moondream2 status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Cancel a running Moondream2 prediction
 * 
 * @param predictionId - The prediction ID to cancel
 * @returns Promise with cancellation result
 */
export async function cancelMoondream2Prediction(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.cancel(predictionId);
    return prediction;

  } catch (error) {
    console.error("Moondream2 prediction cancellation failed:", error);
    throw new Error(`Moondream2 prediction cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create edge visual analysis scenarios
 * 
 * @param type - Type of visual analysis scenario to create
 * @param customImageUrl - Custom image URL (optional)
 * @param customOptions - Custom options (optional)
 * @returns Moondream2 input configuration
 */
export function createEdgeVisualScenario(
  type: 'image_description' | 'visual_qa' | 'document_analysis' | 'text_recognition' | 'edge_processing' | 'mobile_integration' | 'iot_processing' | 'real_time_analysis' | 'visual_reasoning' | 'content_moderation' | 'accessibility_enhancement' | 'visual_search' | 'scientific_analysis' | 'medical_analysis' | 'technical_docs' | 'visual_storytelling' | 'creative_content' | 'marketing_analysis' | 'brand_monitoring' | 'quality_control' | 'surveillance' | 'robotics' | 'smart_home' | 'healthcare' | 'education' | 'automotive' | 'custom',
  customImageUrl?: string,
  customOptions?: Partial<Moondream2Input>
): Moondream2Input {
  const scenarioTemplates = {
    image_description: {
      image: customImageUrl || "https://example.com/image.jpg",
      prompt: "Describe this image in detail."
    },
    visual_qa: {
      image: customImageUrl || "https://example.com/image.jpg",
      prompt: "What is the main subject of this image and what are they doing?"
    },
    document_analysis: {
      image: customImageUrl || "https://example.com/document.jpg",
      prompt: "Extract and summarize the key information from this document."
    },
    text_recognition: {
      image: customImageUrl || "https://example.com/text-image.jpg",
      prompt: "Read all the text visible in this image."
    },
    edge_processing: {
      image: customImageUrl || "https://example.com/edge-image.jpg",
      prompt: "Analyze this image for edge device processing."
    },
    mobile_integration: {
      image: customImageUrl || "https://example.com/mobile-image.jpg",
      prompt: "Describe this image for mobile application users."
    },
    iot_processing: {
      image: customImageUrl || "https://example.com/iot-image.jpg",
      prompt: "Analyze this image for IoT device processing."
    },
    real_time_analysis: {
      image: customImageUrl || "https://example.com/realtime-image.jpg",
      prompt: "Provide real-time analysis of this image."
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
    visual_search: {
      image: customImageUrl || "https://example.com/search-image.jpg",
      prompt: "Analyze this image for visual search and retrieval."
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
    visual_storytelling: {
      image: customImageUrl || "https://example.com/story-image.jpg",
      prompt: "Create an engaging story based on this visual content."
    },
    creative_content: {
      image: customImageUrl || "https://example.com/creative-image.jpg",
      prompt: "Help create engaging content based on this image."
    },
    marketing_analysis: {
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
 * Predefined configuration templates for different edge visual analysis scenarios
 */
export const EDGE_VISUAL_TEMPLATES = {
  "image_description": {
    "description": "Comprehensive image description for edge devices",
    "settings": {
      "prompt": "Describe this image in detail."
    }
  },
  "visual_qa": {
    "description": "Visual question answering for edge devices",
    "settings": {
      "prompt": "What is the main subject of this image and what are they doing?"
    }
  },
  "document_analysis": {
    "description": "Document understanding for edge devices",
    "settings": {
      "prompt": "Extract and summarize the key information from this document."
    }
  },
  "text_recognition": {
    "description": "Text recognition in images for edge devices",
    "settings": {
      "prompt": "Read all the text visible in this image."
    }
  },
  "edge_processing": {
    "description": "Edge device optimized processing",
    "settings": {
      "prompt": "Analyze this image for edge device processing."
    }
  },
  "mobile_integration": {
    "description": "Mobile application integration",
    "settings": {
      "prompt": "Describe this image for mobile application users."
    }
  },
  "iot_processing": {
    "description": "IoT device processing",
    "settings": {
      "prompt": "Analyze this image for IoT device processing."
    }
  },
  "real_time_analysis": {
    "description": "Real-time visual analysis",
    "settings": {
      "prompt": "Provide real-time analysis of this image."
    }
  },
  "visual_reasoning": {
    "description": "Visual reasoning and logical analysis",
    "settings": {
      "prompt": "Analyze this image and provide logical reasoning about what you observe."
    }
  },
  "content_moderation": {
    "description": "Content moderation for edge devices",
    "settings": {
      "prompt": "Analyze this image for content moderation purposes."
    }
  }
} as const;

/**
 * Example usage of the Moondream2 executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic image analysis with default prompt
    const result1 = await executeMoondream2({
      image: "https://replicate.delivery/pbxt/KZKNhDQHqycw8Op7w056J8YTX5Bnb7xVcLiyB4le7oUgT2cY/moondream2.png"
    });

    console.log("Visual analysis:", result1);

    // Example 2: Using helper function for image description
    const imageDescription = createEdgeVisualScenario('image_description');
    const result2 = await executeMoondream2(imageDescription);
    console.log("Image description:", result2);

    // Example 3: Custom visual analysis with specific parameters
    const customAnalysis = createEdgeVisualScenario(
      'custom',
      "https://example.com/custom-image.jpg",
      { prompt: "Provide a detailed analysis of this content." }
    );
    const result3 = await executeMoondream2(customAnalysis);
    console.log("Custom analysis:", result3);

    // Example 4: Using predefined templates
    const result4 = await executeMoondream2({
      image: "https://example.com/document.jpg",
      ...EDGE_VISUAL_TEMPLATES.document_analysis.settings
    });
    console.log("Document analysis:", result4);

    // Example 5: Prediction usage for long-running tasks
    const prediction = await executeMoondream2Prediction({
      image: "https://example.com/complex-image.jpg",
      prompt: "Analyze this complex image in detail.",
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Prediction ID:", prediction.id);

    // Check status
    const status = await checkMoondream2Status(prediction.id);
    console.log("Prediction status:", status.status);

    // Get result when completed
    if (status.status === "succeeded") {
      console.log("Prediction result:", status.output);
    }

    // Example 6: Streaming usage
    const stream = await executeMoondream2Stream({
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
  const costPerRun = 0.0017;
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
 * Utility function to get optimal parameters for analysis type
 * 
 * @param analysisType - Type of visual analysis
 * @returns Recommended parameters
 */
export function getOptimalParameters(analysisType: 'image_description' | 'visual_qa' | 'document_analysis' | 'text_recognition' | 'edge_processing' | 'mobile_integration' | 'iot_processing' | 'real_time_analysis' | 'visual_reasoning' | 'content_moderation'): {
  prompt: string;
  description: string;
} {
  const parameterMap = {
    image_description: { 
      prompt: "Describe this image in detail.",
      description: "Comprehensive image description for edge devices"
    },
    visual_qa: { 
      prompt: "What is the main subject of this image and what are they doing?",
      description: "Visual question answering for edge devices"
    },
    document_analysis: { 
      prompt: "Extract and summarize the key information from this document.",
      description: "Document understanding for edge devices"
    },
    text_recognition: { 
      prompt: "Read all the text visible in this image.",
      description: "Text recognition in images for edge devices"
    },
    edge_processing: { 
      prompt: "Analyze this image for edge device processing.",
      description: "Edge device optimized processing"
    },
    mobile_integration: { 
      prompt: "Describe this image for mobile application users.",
      description: "Mobile application integration"
    },
    iot_processing: { 
      prompt: "Analyze this image for IoT device processing.",
      description: "IoT device processing"
    },
    real_time_analysis: { 
      prompt: "Provide real-time analysis of this image.",
      description: "Real-time visual analysis"
    },
    visual_reasoning: { 
      prompt: "Analyze this image and provide logical reasoning about what you observe.",
      description: "Visual reasoning and logical analysis"
    },
    content_moderation: { 
      prompt: "Analyze this image for content moderation purposes.",
      description: "Content moderation for edge devices"
    }
  };

  return parameterMap[analysisType];
}

/**
 * Utility function to create batch visual analysis
 * 
 * @param imageUrlsArray - Array of image URLs
 * @param parametersArray - Array of parameter objects
 * @returns Array of Moondream2 inputs
 */
export function createBatchVisualAnalysis(
  imageUrlsArray: string[], 
  parametersArray: Partial<Moondream2Input>[]
): Moondream2Input[] {
  if (imageUrlsArray.length !== parametersArray.length) {
    throw new Error("Image URLs and parameters arrays must have the same length");
  }

  return imageUrlsArray.map((imageUrl, index) => ({
    image: imageUrl,
    prompt: "Describe this image",
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
  "JPEG, PNG, WebP, BMP, GIF"
] as const;

/**
 * Common edge visual analysis scenarios
 */
export const EDGE_VISUAL_SCENARIOS = {
  "image_description": "Image description for edge devices",
  "visual_qa": "Visual question answering for edge devices",
  "document_analysis": "Document analysis for edge devices",
  "text_recognition": "Text recognition in images for edge devices",
  "edge_processing": "Edge device optimized processing",
  "mobile_integration": "Mobile application integration",
  "iot_processing": "IoT device processing",
  "real_time_analysis": "Real-time visual analysis",
  "visual_reasoning": "Visual reasoning and logical analysis",
  "content_moderation": "Content moderation for edge devices",
  "accessibility_enhancement": "Accessibility enhancement for edge devices",
  "visual_search": "Visual search for edge devices",
  "scientific_analysis": "Scientific image analysis for edge devices",
  "medical_analysis": "Medical image understanding for edge devices",
  "technical_docs": "Technical documentation analysis for edge devices",
  "visual_storytelling": "Visual storytelling for edge devices",
  "creative_content": "Creative content generation for edge devices",
  "marketing_analysis": "Marketing analysis for edge devices",
  "brand_monitoring": "Brand monitoring for edge devices",
  "quality_control": "Quality control for edge devices",
  "surveillance": "Surveillance and security for edge devices",
  "robotics": "Robotics and automation for edge devices",
  "smart_home": "Smart home applications for edge devices",
  "healthcare": "Healthcare visual systems for edge devices",
  "education": "Educational visual tools for edge devices",
  "automotive": "Automotive visual systems for edge devices",
  "custom": "User-defined analysis scenarios for edge devices"
} as const;

/**
 * Hardware requirements
 */
export const HARDWARE_REQUIREMENTS = {
  "gpu": "Nvidia L40S GPU",
  "memory": "Low memory requirements optimized for edge devices",
  "processing_power": "Efficient processing for resource-constrained environments",
  "storage": "Minimal storage requirements",
  "edge_devices": "Optimized for edge device deployment",
  "mobile_devices": "Mobile device compatible",
  "iot_devices": "IoT device compatible"
} as const;

/**
 * Benchmark performance
 */
export const BENCHMARK_PERFORMANCE = {
  "VQAv2": "79.4% accuracy",
  "GQA": "64.9% accuracy",
  "TextVQA": "60.2% accuracy",
  "DocVQA": "61.9% accuracy",
  "TallyQA_simple": "82.0% accuracy",
  "TallyQA_full": "76.8% accuracy",
  "POPE_rand": "91.3% accuracy",
  "POPE_pop": "89.7% accuracy",
  "POPE_adv": "86.9% accuracy",
  "edge_optimization": "Optimized for edge device deployment",
  "inference_speed": "Fast inference for real-time processing",
  "memory_efficiency": "Low memory footprint",
  "power_efficiency": "Power-efficient processing",
  "model_size": "Small model size for easy deployment",
  "deployment_flexibility": "Docker and Hugging Face deployment support"
} as const;

/**
 * Edge visual analysis tips
 */
export const EDGE_VISUAL_TIPS = {
  "prompt_optimization": "Use clear and specific prompts for better analysis results",
  "image_quality": "Provide high-quality images for optimal understanding",
  "edge_optimization": "Leverage the model's edge device optimization for mobile and IoT applications",
  "resource_efficiency": "Take advantage of the model's small size and efficient processing",
  "real_time_processing": "Use the model's fast inference for real-time applications",
  "deployment_flexibility": "Use Docker for easy deployment or Hugging Face for quick integration",
  "visual_reasoning": "Leverage the model's visual reasoning capabilities for complex tasks",
  "multimodal_integration": "Take advantage of vision-language integration",
  "content_creation": "Use the model's content creation assistance for creative tasks",
  "visual_qa": "Leverage visual question answering for educational content",
  "document_analysis": "Utilize document analysis capabilities for business applications",
  "scientific_analysis": "Take advantage of scientific and medical image understanding",
  "visual_storytelling": "Leverage visual storytelling capabilities for narrative content",
  "creative_generation": "Utilize creative content generation for artistic applications",
  "visual_search": "Take advantage of visual search and retrieval capabilities",
  "edge_computing": "Use the model's edge computing optimization for IoT applications",
  "mobile_integration": "Leverage mobile device compatibility for app development",
  "iot_deployment": "Utilize IoT device compatibility for embedded systems",
  "surveillance": "Take advantage of surveillance and security capabilities",
  "quality_control": "Use the model's quality control features for industrial applications",
  "robotics": "Leverage robotics and automation capabilities",
  "smart_home": "Utilize smart home application features",
  "healthcare": "Take advantage of healthcare visual system capabilities",
  "education": "Use the model's educational visual tool features",
  "automotive": "Leverage automotive visual system capabilities"
} as const;

export default executeMoondream2;
