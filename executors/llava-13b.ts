import Replicate from "replicate";

export interface LLaVA13BInput {
  image: string;
  prompt: string;
  top_p?: number;
  temperature?: number;
  max_tokens?: number;
}

export interface LLaVA13BOutput {
  type: string[];
}

export interface LLaVA13BOptions {
  webhookUrl?: string;
  webhookEventsFilter?: string[];
  onProgress?: (progress: any) => void;
}

/**
 * LLaVA-13B Executor
 * 
 * LLaVA represents a novel end-to-end trained large multimodal model that combines a vision 
 * encoder and Vicuna for general-purpose visual and language understanding, achieving impressive 
 * chat capabilities mimicking spirits of the multimodal GPT-4 and setting a new state-of-the-art 
 * accuracy on Science QA.
 * 
 * @param input - The visual analysis input parameters
 * @param options - Additional execution options
 * @returns Promise with the analysis result
 */
export async function executeLLaVA13B(
  input: LLaVA13BInput,
  options: LLaVA13BOptions = {}
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

    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    // Validate optional parameters
    if (input.top_p !== undefined && (input.top_p < 0 || input.top_p > 1)) {
      throw new Error("top_p must be between 0 and 1");
    }

    if (input.temperature !== undefined && input.temperature < 0) {
      throw new Error("temperature must be >= 0");
    }

    if (input.max_tokens !== undefined && input.max_tokens < 0) {
      throw new Error("max_tokens must be >= 0");
    }

    // Prepare the request payload
    const payload: any = {
      image: input.image.trim(),
      prompt: input.prompt.trim(),
    };

    // Add optional parameters with defaults
    if (input.top_p !== undefined) payload.top_p = input.top_p;
    if (input.temperature !== undefined) payload.temperature = input.temperature;
    if (input.max_tokens !== undefined) payload.max_tokens = input.max_tokens;

    // Execute the model
    console.log(`[LLaVA-13B] Sending payload to Replicate:`, {
      image: payload.image.substring(0, 100) + '...',
      imageLength: payload.image.length,
      prompt: payload.prompt.substring(0, 100) + '...',
      temperature: payload.temperature,
      max_tokens: payload.max_tokens
    });

    const output = await replicate.run(
      "yorickvp/llava-13b:80537f9eead1a5bfa72d5ac6ea6414379be41d4d4f6679fd776e9535d1eb58bb",
      {
        input: payload,
        webhook: options.webhookUrl,
        webhook_events_filter: options.webhookEventsFilter,
      }
    );

    console.log(`[LLaVA-13B] Received output from Replicate:`, {
      outputType: typeof output,
      outputLength: Array.isArray(output) ? output.length : (output?.length || 0),
      outputPreview: Array.isArray(output) 
        ? output.join(' ').substring(0, 200) 
        : (output?.substring(0, 200) || 'No output')
    });

    return output as string[];

  } catch (error) {
    console.error("LLaVA-13B execution failed:", error);
    throw new Error(`LLaVA-13B execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute LLaVA-13B with prediction management for long-running tasks
 * 
 * @param input - The visual analysis input parameters
 * @param options - Additional execution options
 * @returns Promise with prediction object for tracking
 */
export async function executeLLaVA13BPrediction(
  input: LLaVA13BInput,
  options: LLaVA13BOptions = {}
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

    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (input.top_p !== undefined && (input.top_p < 0 || input.top_p > 1)) {
      throw new Error("top_p must be between 0 and 1");
    }

    if (input.temperature !== undefined && input.temperature < 0) {
      throw new Error("temperature must be >= 0");
    }

    if (input.max_tokens !== undefined && input.max_tokens < 0) {
      throw new Error("max_tokens must be >= 0");
    }

    // Prepare the request payload
    const payload: any = {
      image: input.image.trim(),
      prompt: input.prompt.trim(),
    };

    // Add optional parameters
    if (input.top_p !== undefined) payload.top_p = input.top_p;
    if (input.temperature !== undefined) payload.temperature = input.temperature;
    if (input.max_tokens !== undefined) payload.max_tokens = input.max_tokens;

    // Create prediction
    const prediction = await replicate.predictions.create({
      model: "yorickvp/llava-13b:80537f9eead1a5bfa72d5ac6ea6414379be41d4d4f6679fd776e9535d1eb58bb",
      input: payload,
      webhook: options.webhookUrl,
      webhook_events_filter: options.webhookEventsFilter,
    });

    return prediction;

  } catch (error) {
    console.error("LLaVA-13B prediction creation failed:", error);
    throw new Error(`LLaVA-13B prediction creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute LLaVA-13B with streaming support
 * 
 * @param input - The visual analysis input parameters
 * @param options - Additional execution options
 * @returns Promise with streaming result
 */
export async function executeLLaVA13BStream(
  input: LLaVA13BInput,
  options: LLaVA13BOptions = {}
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

    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (input.top_p !== undefined && (input.top_p < 0 || input.top_p > 1)) {
      throw new Error("top_p must be between 0 and 1");
    }

    if (input.temperature !== undefined && input.temperature < 0) {
      throw new Error("temperature must be >= 0");
    }

    if (input.max_tokens !== undefined && input.max_tokens < 0) {
      throw new Error("max_tokens must be >= 0");
    }

    // Prepare the request payload
    const payload: any = {
      image: input.image.trim(),
      prompt: input.prompt.trim(),
    };

    // Add optional parameters
    if (input.top_p !== undefined) payload.top_p = input.top_p;
    if (input.temperature !== undefined) payload.temperature = input.temperature;
    if (input.max_tokens !== undefined) payload.max_tokens = input.max_tokens;

    // Create streaming prediction
    const stream = await replicate.stream(
      "yorickvp/llava-13b:80537f9eead1a5bfa72d5ac6ea6414379be41d4d4f6679fd776e9535d1eb58bb",
      { input: payload }
    );

    return stream;

  } catch (error) {
    console.error("LLaVA-13B streaming failed:", error);
    throw new Error(`LLaVA-13B streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a LLaVA-13B prediction
 * 
 * @param predictionId - The prediction ID from prediction creation
 * @returns Promise with prediction status
 */
export async function checkLLaVA13BStatus(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.get(predictionId);
    return prediction;

  } catch (error) {
    console.error("LLaVA-13B status check failed:", error);
    throw new Error(`LLaVA-13B status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Cancel a running LLaVA-13B prediction
 * 
 * @param predictionId - The prediction ID to cancel
 * @returns Promise with cancellation result
 */
export async function cancelLLaVA13BPrediction(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.cancel(predictionId);
    return prediction;

  } catch (error) {
    console.error("LLaVA-13B prediction cancellation failed:", error);
    throw new Error(`LLaVA-13B prediction cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create visual analysis scenarios
 * 
 * @param type - Type of visual analysis scenario to create
 * @param customImageUrl - Custom image URL (optional)
 * @param customOptions - Custom options (optional)
 * @returns LLaVA-13B input configuration
 */
export function createVisualAnalysisScenario(
  type: 'image_description' | 'visual_qa' | 'creative_analysis' | 'scientific_analysis' | 'document_analysis' | 'medical_analysis' | 'visual_storytelling' | 'content_creation' | 'visual_reasoning' | 'image_interpretation' | 'visual_education' | 'visual_research' | 'visual_communication' | 'visual_art' | 'visual_design' | 'custom',
  customImageUrl?: string,
  customOptions?: Partial<LLaVA13BInput>
): LLaVA13BInput {
  const scenarioTemplates = {
    image_description: {
      image: customImageUrl || "https://example.com/image.jpg",
      prompt: "Describe this image in detail.",
      max_tokens: 512
    },
    visual_qa: {
      image: customImageUrl || "https://example.com/image.jpg",
      prompt: "What is the main subject of this image and what are they doing?",
      max_tokens: 200
    },
    creative_analysis: {
      image: customImageUrl || "https://example.com/artwork.jpg",
      prompt: "Create a creative story based on this image.",
      temperature: 0.7,
      max_tokens: 300
    },
    scientific_analysis: {
      image: customImageUrl || "https://example.com/scientific-image.jpg",
      prompt: "Analyze this scientific image and explain what you observe.",
      max_tokens: 400
    },
    document_analysis: {
      image: customImageUrl || "https://example.com/document.jpg",
      prompt: "Extract and summarize the key information from this document.",
      max_tokens: 400
    },
    medical_analysis: {
      image: customImageUrl || "https://example.com/medical-image.jpg",
      prompt: "Describe what you see in this medical image.",
      max_tokens: 300
    },
    visual_storytelling: {
      image: customImageUrl || "https://example.com/story-image.jpg",
      prompt: "Create an engaging story based on this visual content.",
      temperature: 0.6,
      max_tokens: 350
    },
    content_creation: {
      image: customImageUrl || "https://example.com/content-image.jpg",
      prompt: "Help create engaging content based on this image.",
      max_tokens: 300
    },
    visual_reasoning: {
      image: customImageUrl || "https://example.com/reasoning-image.jpg",
      prompt: "Analyze this image and provide logical reasoning about what you observe.",
      max_tokens: 400
    },
    image_interpretation: {
      image: customImageUrl || "https://example.com/interpretation-image.jpg",
      prompt: "Provide a detailed interpretation of this image.",
      max_tokens: 350
    },
    visual_education: {
      image: customImageUrl || "https://example.com/educational-image.jpg",
      prompt: "Explain this image in an educational context.",
      max_tokens: 300
    },
    visual_research: {
      image: customImageUrl || "https://example.com/research-image.jpg",
      prompt: "Analyze this image from a research perspective.",
      max_tokens: 400
    },
    visual_communication: {
      image: customImageUrl || "https://example.com/communication-image.jpg",
      prompt: "Help communicate the key message of this image.",
      max_tokens: 250
    },
    visual_art: {
      image: customImageUrl || "https://example.com/art-image.jpg",
      prompt: "Analyze this artwork and discuss its artistic elements.",
      temperature: 0.5,
      max_tokens: 350
    },
    visual_design: {
      image: customImageUrl || "https://example.com/design-image.jpg",
      prompt: "Evaluate the design elements and composition of this image.",
      max_tokens: 300
    },
    custom: {
      image: customImageUrl || "https://example.com/image.jpg",
      prompt: "Analyze this image and provide insights.",
      max_tokens: 200
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
 * Predefined configuration templates for different visual analysis scenarios
 */
export const VISUAL_ANALYSIS_TEMPLATES = {
  "image_description": {
    "description": "Comprehensive image description and captioning",
    "settings": {
      "prompt": "Describe this image in detail.",
      "max_tokens": 512
    }
  },
  "visual_qa": {
    "description": "Visual question answering",
    "settings": {
      "prompt": "What is the main subject of this image and what are they doing?",
      "max_tokens": 200
    }
  },
  "creative_analysis": {
    "description": "Creative visual content analysis",
    "settings": {
      "prompt": "Create a creative story based on this image.",
      "temperature": 0.7,
      "max_tokens": 300
    }
  },
  "scientific_analysis": {
    "description": "Scientific image analysis and interpretation",
    "settings": {
      "prompt": "Analyze this scientific image and explain what you observe.",
      "max_tokens": 400
    }
  },
  "document_analysis": {
    "description": "Document analysis and understanding",
    "settings": {
      "prompt": "Extract and summarize the key information from this document.",
      "max_tokens": 400
    }
  },
  "medical_analysis": {
    "description": "Medical image understanding and analysis",
    "settings": {
      "prompt": "Describe what you see in this medical image.",
      "max_tokens": 300
    }
  },
  "visual_storytelling": {
    "description": "Visual storytelling and narrative creation",
    "settings": {
      "prompt": "Create an engaging story based on this visual content.",
      "temperature": 0.6,
      "max_tokens": 350
    }
  },
  "content_creation": {
    "description": "Content creation assistance",
    "settings": {
      "prompt": "Help create engaging content based on this image.",
      "max_tokens": 300
    }
  },
  "visual_reasoning": {
    "description": "Visual reasoning and logical analysis",
    "settings": {
      "prompt": "Analyze this image and provide logical reasoning about what you observe.",
      "max_tokens": 400
    }
  },
  "image_interpretation": {
    "description": "Detailed image interpretation",
    "settings": {
      "prompt": "Provide a detailed interpretation of this image.",
      "max_tokens": 350
    }
  }
} as const;

/**
 * Example usage of the LLaVA-13B executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic image analysis
    const result1 = await executeLLaVA13B({
      image: "https://replicate.delivery/pbxt/KRULC43USWlEx4ZNkXltJqvYaHpEx2uJ4IyUQPRPwYb8SzPf/view.jpg",
      prompt: "Are you allowed to swim here?"
    });

    console.log("Visual analysis:", result1);

    // Example 2: Using helper function for image description
    const imageDescription = createVisualAnalysisScenario('image_description');
    const result2 = await executeLLaVA13B(imageDescription);
    console.log("Image description:", result2);

    // Example 3: Custom visual analysis with specific parameters
    const customAnalysis = createVisualAnalysisScenario(
      'custom',
      "https://example.com/custom-image.jpg",
      { prompt: "Provide a detailed analysis of this content.", max_tokens: 400 }
    );
    const result3 = await executeLLaVA13B(customAnalysis);
    console.log("Custom analysis:", result3);

    // Example 4: Using predefined templates
    const result4 = await executeLLaVA13B({
      image: "https://example.com/document.jpg",
      ...VISUAL_ANALYSIS_TEMPLATES.document_analysis.settings
    });
    console.log("Document analysis:", result4);

    // Example 5: Prediction usage for long-running tasks
    const prediction = await executeLLaVA13BPrediction({
      image: "https://example.com/complex-image.jpg",
      prompt: "Analyze this complex image in detail.",
      max_tokens: 512,
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Prediction ID:", prediction.id);

    // Check status
    const status = await checkLLaVA13BStatus(prediction.id);
    console.log("Prediction status:", status.status);

    // Get result when completed
    if (status.status === "succeeded") {
      console.log("Prediction result:", status.output);
    }

    // Example 6: Streaming usage
    const stream = await executeLLaVA13BStream({
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
  const costPerRun = 0.00098;
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
    suggestions.push("Image must be in supported format (JPEG, PNG, WebP)");
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
export function getOptimalParameters(analysisType: 'image_description' | 'visual_qa' | 'creative_analysis' | 'scientific_analysis' | 'document_analysis' | 'medical_analysis' | 'visual_storytelling' | 'content_creation' | 'visual_reasoning' | 'image_interpretation'): {
  prompt: string;
  max_tokens: number;
  temperature?: number;
  description: string;
} {
  const parameterMap = {
    image_description: { 
      prompt: "Describe this image in detail.",
      max_tokens: 512,
      description: "Comprehensive image description and captioning"
    },
    visual_qa: { 
      prompt: "What is the main subject of this image and what are they doing?",
      max_tokens: 200,
      description: "Visual question answering"
    },
    creative_analysis: { 
      prompt: "Create a creative story based on this image.",
      max_tokens: 300,
      temperature: 0.7,
      description: "Creative visual content analysis"
    },
    scientific_analysis: { 
      prompt: "Analyze this scientific image and explain what you observe.",
      max_tokens: 400,
      description: "Scientific image analysis and interpretation"
    },
    document_analysis: { 
      prompt: "Extract and summarize the key information from this document.",
      max_tokens: 400,
      description: "Document analysis and understanding"
    },
    medical_analysis: { 
      prompt: "Describe what you see in this medical image.",
      max_tokens: 300,
      description: "Medical image understanding and analysis"
    },
    visual_storytelling: { 
      prompt: "Create an engaging story based on this visual content.",
      max_tokens: 350,
      temperature: 0.6,
      description: "Visual storytelling and narrative creation"
    },
    content_creation: { 
      prompt: "Help create engaging content based on this image.",
      max_tokens: 300,
      description: "Content creation assistance"
    },
    visual_reasoning: { 
      prompt: "Analyze this image and provide logical reasoning about what you observe.",
      max_tokens: 400,
      description: "Visual reasoning and logical analysis"
    },
    image_interpretation: { 
      prompt: "Provide a detailed interpretation of this image.",
      max_tokens: 350,
      description: "Detailed image interpretation"
    }
  };

  return parameterMap[analysisType];
}

/**
 * Utility function to create batch visual analysis
 * 
 * @param imageUrlsArray - Array of image URLs
 * @param parametersArray - Array of parameter objects
 * @returns Array of LLaVA-13B inputs
 */
export function createBatchVisualAnalysis(
  imageUrlsArray: string[], 
  parametersArray: Partial<LLaVA13BInput>[]
): LLaVA13BInput[] {
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
 * Supported image formats
 */
export const SUPPORTED_IMAGE_FORMATS = [
  "JPEG, PNG, WebP, GIF, BMP"
] as const;

/**
 * Common visual analysis scenarios
 */
export const VISUAL_ANALYSIS_SCENARIOS = {
  "image_description": "Image description and captioning",
  "visual_qa": "Visual question answering",
  "creative_analysis": "Creative visual content analysis",
  "scientific_analysis": "Scientific image analysis",
  "document_analysis": "Document analysis and understanding",
  "medical_analysis": "Medical image understanding",
  "visual_storytelling": "Visual storytelling",
  "content_creation": "Content creation assistance",
  "visual_reasoning": "Visual reasoning and logical analysis",
  "image_interpretation": "Detailed image interpretation",
  "visual_education": "Visual education and learning",
  "visual_research": "Visual research and analysis",
  "visual_communication": "Visual communication",
  "visual_art": "Visual art analysis",
  "visual_design": "Visual design evaluation",
  "custom": "User-defined analysis scenarios"
} as const;

/**
 * Hardware requirements
 */
export const HARDWARE_REQUIREMENTS = {
  "gpu": "Nvidia L40S GPU",
  "memory": "High memory requirements for visual processing",
  "processing_power": "High computational requirements",
  "storage": "Temporary storage for image processing"
} as const;

/**
 * Benchmark performance
 */
export const BENCHMARK_PERFORMANCE = {
  "visual_understanding": "GPT-4 level multimodal capabilities",
  "visual_instruction_tuning": "Advanced visual instruction tuning",
  "multimodal_integration": "Vision and language integration",
  "visual_reasoning": "Visual reasoning and decision making",
  "question_answering": "Visual question answering",
  "content_creation": "Visual content generation and storytelling",
  "image_analysis": "Comprehensive image analysis",
  "visual_processing": "Advanced visual processing",
  "multimodal_conversation": "Multimodal chat capabilities",
  "document_analysis": "Document understanding and analysis",
  "scientific_analysis": "Scientific image analysis and interpretation",
  "medical_analysis": "Medical image understanding and analysis",
  "visual_storytelling": "Visual storytelling capabilities",
  "creative_generation": "Creative visual content generation",
  "production_readiness": "Production-ready performance and scalability"
} as const;

/**
 * Visual analysis tips
 */
export const VISUAL_ANALYSIS_TIPS = {
  "prompt_optimization": "Use clear and specific prompts for better analysis results",
  "image_quality": "Provide high-quality images for optimal understanding",
  "token_optimization": "Use appropriate token limits based on content complexity",
  "temperature_control": "Adjust temperature for creative vs. factual analysis",
  "top_p_control": "Use top_p to control response diversity",
  "visual_reasoning": "Leverage the model's visual reasoning capabilities for complex tasks",
  "multimodal_integration": "Take advantage of vision-language integration",
  "content_creation": "Use the model's content creation assistance for creative tasks",
  "visual_qa": "Leverage visual question answering for educational content",
  "document_analysis": "Utilize document analysis capabilities for business applications",
  "scientific_analysis": "Take advantage of scientific and medical image understanding",
  "visual_storytelling": "Leverage visual storytelling capabilities for narrative content",
  "creative_generation": "Utilize creative content generation for artistic applications",
  "visual_communication": "Use the model's visual communication capabilities",
  "visual_education": "Leverage visual education features for learning applications",
  "visual_research": "Utilize visual research capabilities for analysis tasks",
  "visual_art": "Take advantage of visual art analysis features",
  "visual_design": "Use the model's visual design evaluation capabilities"
} as const;

export default executeLLaVA13B;
