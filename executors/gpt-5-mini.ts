import Replicate from "replicate";

export interface GPT5MiniInput {
  prompt?: string;
  messages?: Array<{ role: string; content: string }>;
  system_prompt?: string;
  image_input?: string[];
  reasoning_effort?: 'minimal' | 'low' | 'medium' | 'high';
  verbosity?: 'low' | 'medium' | 'high';
  max_completion_tokens?: number;
}

export interface GPT5MiniOutput {
  text: string;
  reasoning?: string;
}

export interface GPT5MiniOptions {
  webhookUrl?: string;
  webhookEventsFilter?: string[];
  onProgress?: (progress: any) => void;
}

/**
 * GPT-5-Mini Executor
 * 
 * Faster version of OpenAI's flagship GPT-5 model. Balanced speed and cost, 
 * ideal for chat and medium-difficulty reasoning with the same advanced features 
 * as GPT-5. Optimized for faster response times while maintaining high quality 
 * outputs, making it perfect for real-time applications and cost-sensitive use cases.
 * 
 * @param input - The multimodal input parameters
 * @param options - Additional execution options
 * @returns Promise with the response
 */
export async function executeGPT5Mini(
  input: GPT5MiniInput,
  options: GPT5MiniOptions = {}
): Promise<GPT5MiniOutput> {
  try {
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate required inputs
    if (!input.prompt && (!input.messages || input.messages.length === 0)) {
      throw new Error("Either prompt or messages is required");
    }

    // Validate parameter ranges
    if (input.reasoning_effort && !['minimal', 'low', 'medium', 'high'].includes(input.reasoning_effort)) {
      throw new Error("reasoning_effort must be one of: minimal, low, medium, high");
    }

    if (input.verbosity && !['low', 'medium', 'high'].includes(input.verbosity)) {
      throw new Error("verbosity must be one of: low, medium, high");
    }

    if (input.max_completion_tokens && input.max_completion_tokens < 1) {
      throw new Error("max_completion_tokens must be greater than 0");
    }

    // Validate image URLs if provided
    if (input.image_input) {
      for (const imageUrl of input.image_input) {
        try {
          new URL(imageUrl);
        } catch {
          throw new Error(`Invalid image URL: ${imageUrl}`);
        }
      }
    }

    // Prepare the request payload
    const payload: any = {};

    // Add prompt or messages (but not both)
    if (input.prompt && input.messages && input.messages.length > 0) {
      throw new Error("Cannot use both prompt and messages. Use either prompt OR messages.");
    }

    if (input.prompt) {
      payload.prompt = input.prompt.trim();
    }

    if (input.messages && input.messages.length > 0) {
      payload.messages = input.messages;
    }

    // Add optional inputs with defaults
    if (input.system_prompt) {
      payload.system_prompt = input.system_prompt;
    }

    if (input.image_input && input.image_input.length > 0) {
      payload.image_input = input.image_input;
    }

    if (input.reasoning_effort !== undefined) {
      payload.reasoning_effort = input.reasoning_effort;
    }

    if (input.verbosity !== undefined) {
      payload.verbosity = input.verbosity;
    }

    if (input.max_completion_tokens !== undefined) {
      payload.max_completion_tokens = input.max_completion_tokens;
    }

    // Execute the model
    const output = await replicate.run(
      "openai/gpt-5-mini",
      {
        input: payload,
        webhook: options.webhookUrl,
        webhook_events_filter: options.webhookEventsFilter,
      }
    );

    // Process the output (it comes as an array of strings)
    const responseText = Array.isArray(output) ? output.join("") : String(output);

    return {
      text: responseText
    };

  } catch (error) {
    console.error("GPT-5-Mini execution failed:", error);
    throw new Error(`GPT-5-Mini execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute GPT-5-Mini with prediction management for long-running tasks
 * 
 * @param input - The multimodal input parameters
 * @param options - Additional execution options
 * @returns Promise with prediction object for tracking
 */
export async function executeGPT5MiniPrediction(
  input: GPT5MiniInput,
  options: GPT5MiniOptions = {}
): Promise<any> {
  try {
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate input (same validation as above)
    if (!input.prompt && (!input.messages || input.messages.length === 0)) {
      throw new Error("Either prompt or messages is required");
    }

    if (input.reasoning_effort && !['minimal', 'low', 'medium', 'high'].includes(input.reasoning_effort)) {
      throw new Error("reasoning_effort must be one of: minimal, low, medium, high");
    }

    if (input.verbosity && !['low', 'medium', 'high'].includes(input.verbosity)) {
      throw new Error("verbosity must be one of: low, medium, high");
    }

    if (input.max_completion_tokens && input.max_completion_tokens < 1) {
      throw new Error("max_completion_tokens must be greater than 0");
    }

    if (input.image_input) {
      for (const imageUrl of input.image_input) {
        try {
          new URL(imageUrl);
        } catch {
          throw new Error(`Invalid image URL: ${imageUrl}`);
        }
      }
    }

    // Prepare the request payload
    const payload: any = {};

    if (input.prompt && input.messages && input.messages.length > 0) {
      throw new Error("Cannot use both prompt and messages. Use either prompt OR messages.");
    }

    if (input.prompt) {
      payload.prompt = input.prompt.trim();
    }

    if (input.messages && input.messages.length > 0) {
      payload.messages = input.messages;
    }

    // Add optional inputs
    if (input.system_prompt) {
      payload.system_prompt = input.system_prompt;
    }

    if (input.image_input && input.image_input.length > 0) {
      payload.image_input = input.image_input;
    }

    if (input.reasoning_effort !== undefined) {
      payload.reasoning_effort = input.reasoning_effort;
    }

    if (input.verbosity !== undefined) {
      payload.verbosity = input.verbosity;
    }

    if (input.max_completion_tokens !== undefined) {
      payload.max_completion_tokens = input.max_completion_tokens;
    }

    // Create prediction
    const prediction = await replicate.predictions.create({
      model: "openai/gpt-5-mini",
      input: payload,
      webhook: options.webhookUrl,
      webhook_events_filter: options.webhookEventsFilter,
    });

    return prediction;

  } catch (error) {
    console.error("GPT-5-Mini prediction creation failed:", error);
    throw new Error(`GPT-5-Mini prediction creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a GPT-5-Mini prediction
 * 
 * @param predictionId - The prediction ID from prediction creation
 * @returns Promise with prediction status
 */
export async function checkGPT5MiniStatus(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.get(predictionId);
    return prediction;

  } catch (error) {
    console.error("GPT-5-Mini status check failed:", error);
    throw new Error(`GPT-5-Mini status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Cancel a running GPT-5-Mini prediction
 * 
 * @param predictionId - The prediction ID to cancel
 * @returns Promise with cancellation result
 */
export async function cancelGPT5MiniPrediction(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.cancel(predictionId);
    return prediction;

  } catch (error) {
    console.error("GPT-5-Mini prediction cancellation failed:", error);
    throw new Error(`GPT-5-Mini prediction cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create GPT-5-Mini scenarios optimized for speed and cost
 * 
 * @param type - Type of scenario to create
 * @param customPrompt - Custom prompt (optional)
 * @param customOptions - Custom options (optional)
 * @returns GPT-5-Mini input configuration
 */
export function createGPT5MiniScenario(
  type: 'chat' | 'quick_reasoning' | 'cost_optimized' | 'real_time' | 'batch_processing' | 'conversation' | 'multimodal_quick' | 'analysis_quick' | 'custom',
  customPrompt?: string,
  customOptions?: Partial<GPT5MiniInput>
): GPT5MiniInput {
  const scenarioTemplates = {
    chat: {
      prompt: customPrompt || "Hello, how can I help you today?",
      reasoning_effort: 'minimal' as const,
      verbosity: 'medium' as const,
      max_completion_tokens: 1000
    },
    quick_reasoning: {
      prompt: customPrompt || "Solve this problem quickly but thoroughly",
      reasoning_effort: 'medium' as const,
      verbosity: 'high' as const,
      max_completion_tokens: 2000
    },
    cost_optimized: {
      prompt: customPrompt || "Provide a concise analysis",
      reasoning_effort: 'minimal' as const,
      verbosity: 'low' as const,
      max_completion_tokens: 1000
    },
    real_time: {
      prompt: customPrompt || "Respond quickly to this message",
      reasoning_effort: 'minimal' as const,
      verbosity: 'low' as const,
      max_completion_tokens: 500
    },
    batch_processing: {
      prompt: customPrompt || "Process this request efficiently",
      reasoning_effort: 'minimal' as const,
      verbosity: 'low' as const,
      max_completion_tokens: 800
    },
    conversation: {
      messages: customPrompt ? [{ role: 'user', content: customPrompt }] : [{ role: 'user', content: "Hello, how are you?" }],
      reasoning_effort: 'minimal' as const,
      verbosity: 'medium' as const,
      max_completion_tokens: 1000
    },
    multimodal_quick: {
      prompt: customPrompt || "Quickly analyze this image",
      image_input: ["https://example.com/image.jpg"],
      reasoning_effort: 'minimal' as const,
      verbosity: 'medium' as const,
      max_completion_tokens: 1000
    },
    analysis_quick: {
      prompt: customPrompt || "Provide a quick analysis of this topic",
      reasoning_effort: 'medium' as const,
      verbosity: 'medium' as const,
      max_completion_tokens: 1500
    },
    custom: {
      prompt: customPrompt || "Analyze this request and provide a response",
      reasoning_effort: 'minimal' as const,
      verbosity: 'medium' as const,
      max_completion_tokens: 1000
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
 * Predefined prompt templates for different GPT-5-Mini scenarios
 */
export const GPT5_MINI_PROMPT_TEMPLATES = {
  "chat": [
    "Hello, how can I help you today?",
    "What would you like to know about {topic}?",
    "I'm here to assist you with {task}. What do you need?",
    "How can I help you with {subject} today?",
    "What questions do you have about {area}?"
  ],
  "quick_reasoning": [
    "Solve this problem quickly but thoroughly: {problem}",
    "Analyze this situation and provide a quick solution: {situation}",
    "Break down this task into manageable steps: {task}",
    "Evaluate the key points of {topic} and provide recommendations",
    "Think through this problem systematically: {problem}"
  ],
  "cost_optimized": [
    "Provide a concise analysis of {topic}",
    "Summarize the key points of {subject}",
    "Give a brief overview of {area}",
    "List the main benefits of {option}",
    "Explain {concept} in simple terms"
  ],
  "real_time": [
    "Respond quickly to this message: {message}",
    "Give a fast answer to: {question}",
    "Quickly help with: {request}",
    "Provide immediate assistance for: {task}",
    "Give a rapid response to: {query}"
  ],
  "batch_processing": [
    "Process this request efficiently: {request}",
    "Handle this task quickly: {task}",
    "Analyze this data point: {data}",
    "Classify this item: {item}",
    "Extract key information from: {content}"
  ],
  "conversation": [
    "Let's discuss {topic}. What are your thoughts?",
    "I'm interested in learning about {subject}. Can you explain?",
    "What's your perspective on {issue}?",
    "Can you help me understand {concept}?",
    "I'm curious about {topic}. What should I know?"
  ],
  "multimodal_quick": [
    "Quickly analyze this image and tell me what you see",
    "Give a brief description of this image",
    "What are the main elements in this image?",
    "Summarize the visual content of this image",
    "Identify the key objects in this image"
  ],
  "analysis_quick": [
    "Provide a quick analysis of {topic}",
    "Give a brief assessment of {situation}",
    "Summarize the pros and cons of {option}",
    "Analyze the key factors in {scenario}",
    "Evaluate the main points of {subject}"
  ]
} as const;

/**
 * Example usage of the GPT-5-Mini executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic chat
    const result1 = await executeGPT5Mini({
      prompt: "What is the point of life?",
      system_prompt: "You are a caveman",
      reasoning_effort: 'minimal',
      verbosity: 'medium'
    });

    console.log("Basic chat response:", result1.text);

    // Example 2: Quick reasoning
    const result2 = await executeGPT5Mini({
      prompt: "Solve this problem quickly but thoroughly",
      reasoning_effort: 'medium',
      verbosity: 'high',
      max_completion_tokens: 2000
    });

    console.log("Quick reasoning response:", result2.text);

    // Example 3: Cost-optimized processing
    const result3 = await executeGPT5Mini({
      prompt: "Provide a concise analysis",
      reasoning_effort: 'minimal',
      verbosity: 'low',
      max_completion_tokens: 1000
    });

    console.log("Cost-optimized response:", result3.text);

    // Example 4: Real-time chat
    const result4 = await executeGPT5Mini({
      prompt: "Respond quickly to this message",
      reasoning_effort: 'minimal',
      verbosity: 'low',
      max_completion_tokens: 500
    });

    console.log("Real-time response:", result4.text);

    // Example 5: Conversation mode
    const result5 = await executeGPT5Mini({
      messages: [
        { role: 'user', content: 'Hello, how are you?' },
        { role: 'assistant', content: "I'm doing well, thank you!" },
        { role: 'user', content: 'Can you help me with a quick question?' }
      ],
      reasoning_effort: 'minimal',
      verbosity: 'medium'
    });

    console.log("Conversation response:", result5.text);

    // Example 6: Multimodal quick analysis
    const result6 = await executeGPT5Mini({
      prompt: "Quickly analyze this image",
      image_input: ["https://example.com/image.jpg"],
      reasoning_effort: 'minimal',
      verbosity: 'medium'
    });

    console.log("Multimodal quick analysis:", result6.text);

    // Example 7: Using helper function for chat scenario
    const chatScenario = createGPT5MiniScenario('chat');
    const result7 = await executeGPT5Mini(chatScenario);
    console.log("Chat scenario:", result7.text);

    // Example 8: Cost-optimized scenario
    const costOptimizedScenario = createGPT5MiniScenario(
      'cost_optimized',
      "Analyze the benefits of renewable energy",
      {
        max_completion_tokens: 800
      }
    );
    const result8 = await executeGPT5Mini(costOptimizedScenario);
    console.log("Cost-optimized scenario:", result8.text);

    // Example 9: Using predefined templates
    const result9 = await executeGPT5Mini({
      prompt: GPT5_MINI_PROMPT_TEMPLATES.quick_reasoning[0]
        .replace("{problem}", "How to optimize a website for better performance"),
      reasoning_effort: 'medium',
      verbosity: 'high'
    });
    console.log("Template quick reasoning:", result9.text);

    // Example 10: Prediction usage for batch processing
    const prediction = await executeGPT5MiniPrediction({
      prompt: "Process this batch item efficiently",
      reasoning_effort: 'minimal',
      verbosity: 'low',
      max_completion_tokens: 500
    });

    console.log("Prediction ID:", prediction.id);

    // Check status
    const status = await checkGPT5MiniStatus(prediction.id);
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
 * Utility function to estimate processing cost for GPT-5-Mini
 * 
 * @param inputTokens - Number of input tokens
 * @param outputTokens - Number of output tokens
 * @param hasImages - Whether the input includes images
 * @returns Estimated cost in USD
 */
export function estimateProcessingCost(
  inputTokens: number, 
  outputTokens: number, 
  hasImages: boolean = false
): number {
  const inputCostPerMillion = 0.25;
  const outputCostPerMillion = 2.00;
  
  const inputCost = (inputTokens / 1000000) * inputCostPerMillion;
  const outputCost = (outputTokens / 1000000) * outputCostPerMillion;
  
  // Note: Image processing costs are included in input tokens
  return inputCost + outputCost;
}

/**
 * Utility function to validate prompt format for GPT-5-Mini
 * 
 * @param prompt - The prompt string to validate
 * @returns Validation result with suggestions
 */
export function validateGPT5MiniPrompt(prompt: string): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedPrompt: string; 
} {
  const suggestions: string[] = [];
  
  // Clean and format prompt
  const formattedPrompt = prompt.trim();

  // Check for common issues
  if (prompt.length < 5) {
    suggestions.push("Prompt is too short, consider adding more specific instructions");
  }

  // Check for clarity indicators
  const hasClearWords = /(write|create|analyze|explain|describe|solve|implement|design|develop|help|provide|think|respond|answer)/i.test(prompt);
  
  if (!hasClearWords) {
    suggestions.push("Consider using action words like 'respond', 'analyze', 'explain', or 'help' for better results");
  }
  
  if (prompt.length < 20) {
    suggestions.push("Consider making your prompt more specific and detailed for better results");
  }

  // Check for very long prompts
  if (prompt.length > 10000) {
    suggestions.push("Consider shortening your prompt for better processing");
  }

  // Check for reasoning indicators
  const hasReasoningWords = /(step by step|think|reason|analyze|break down|evaluate)/i.test(prompt);
  if (hasReasoningWords) {
    suggestions.push("Consider using 'medium' reasoning effort for balanced speed and quality");
  }

  // Check for speed optimization opportunities
  const hasSpeedWords = /(quick|fast|rapid|immediate|urgent)/i.test(prompt);
  if (hasSpeedWords) {
    suggestions.push("Consider using 'minimal' reasoning effort and 'low' verbosity for fastest responses");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedPrompt
  };
}

/**
 * Utility function to get optimal settings for GPT-5-Mini scenario type
 * 
 * @param scenarioType - Type of scenario
 * @returns Recommended settings
 */
export function getOptimalGPT5MiniSettings(scenarioType: 'chat' | 'quick_reasoning' | 'cost_optimized' | 'real_time' | 'batch_processing' | 'conversation' | 'multimodal_quick' | 'analysis_quick'): {
  reasoning_effort: 'minimal' | 'low' | 'medium' | 'high';
  verbosity: 'low' | 'medium' | 'high';
  max_completion_tokens: number;
  system_prompt_suggestions: string[];
} {
  const settingsMap = {
    chat: { 
      reasoning_effort: 'minimal' as const,
      verbosity: 'medium' as const,
      max_completion_tokens: 1000,
      system_prompt_suggestions: ["You are a helpful, friendly assistant.", "You are a knowledgeable chat companion."] 
    },
    quick_reasoning: { 
      reasoning_effort: 'medium' as const,
      verbosity: 'high' as const,
      max_completion_tokens: 2000,
      system_prompt_suggestions: ["You are a quick-thinking problem solver.", "You are an efficient reasoning expert."] 
    },
    cost_optimized: { 
      reasoning_effort: 'minimal' as const,
      verbosity: 'low' as const,
      max_completion_tokens: 1000,
      system_prompt_suggestions: ["You are a concise, efficient assistant.", "You provide brief, helpful responses."] 
    },
    real_time: { 
      reasoning_effort: 'minimal' as const,
      verbosity: 'low' as const,
      max_completion_tokens: 500,
      system_prompt_suggestions: ["You are a fast-responding assistant.", "You provide quick, immediate responses."] 
    },
    batch_processing: { 
      reasoning_effort: 'minimal' as const,
      verbosity: 'low' as const,
      max_completion_tokens: 800,
      system_prompt_suggestions: ["You are an efficient batch processor.", "You handle requests quickly and systematically."] 
    },
    conversation: { 
      reasoning_effort: 'minimal' as const,
      verbosity: 'medium' as const,
      max_completion_tokens: 1000,
      system_prompt_suggestions: ["You are an engaging conversationalist.", "You are a friendly, helpful chat partner."] 
    },
    multimodal_quick: { 
      reasoning_effort: 'minimal' as const,
      verbosity: 'medium' as const,
      max_completion_tokens: 1000,
      system_prompt_suggestions: ["You are a quick visual analyzer.", "You provide fast image analysis."] 
    },
    analysis_quick: { 
      reasoning_effort: 'medium' as const,
      verbosity: 'medium' as const,
      max_completion_tokens: 1500,
      system_prompt_suggestions: ["You are a quick analysis expert.", "You provide efficient analytical insights."] 
    }
  };

  return settingsMap[scenarioType];
}

/**
 * Utility function to enhance prompt for better GPT-5-Mini results
 * 
 * @param prompt - Base prompt to enhance
 * @param enhancements - Enhancement options
 * @returns Enhanced prompt
 */
export function enhancePromptForGPT5Mini(
  prompt: string, 
  enhancements: {
    addSpeed?: boolean;
    addSpecificity?: boolean;
    addContext?: boolean;
    addDetail?: boolean;
  } = {}
): string {
  let enhancedPrompt = prompt.trim();

  // Add speed instruction
  if (enhancements.addSpeed) {
    if (!/(quick|fast|rapid|immediate)/i.test(enhancedPrompt)) {
      enhancedPrompt = `Please respond quickly to: ${enhancedPrompt.toLowerCase()}`;
    }
  }

  // Add specificity
  if (enhancements.addSpecificity) {
    if (!/(write|create|analyze|explain|describe|solve|implement|design|develop|help|provide|respond|answer)/i.test(enhancedPrompt)) {
      enhancedPrompt = `Please ${enhancedPrompt.toLowerCase()}`;
    }
  }

  // Add context
  if (enhancements.addContext) {
    if (!/(context|background|situation|scenario)/i.test(enhancedPrompt)) {
      enhancedPrompt = `Given the context, ${enhancedPrompt.toLowerCase()}`;
    }
  }

  // Add detail
  if (enhancements.addDetail) {
    if (!/(detailed|comprehensive|thorough|in-depth)/i.test(enhancedPrompt)) {
      enhancedPrompt = `Please provide a detailed ${enhancedPrompt.toLowerCase()}`;
    }
  }

  return enhancedPrompt;
}

/**
 * Utility function to create batch GPT-5-Mini analysis
 * 
 * @param promptsArray - Array of prompts
 * @param scenarioTypesArray - Array of scenario types
 * @param maxTokensArray - Array of max token values
 * @returns Array of GPT-5-Mini inputs
 */
export function createBatchGPT5MiniAnalysis(
  promptsArray: string[], 
  scenarioTypesArray: ('chat' | 'quick_reasoning' | 'cost_optimized' | 'real_time' | 'batch_processing' | 'conversation' | 'multimodal_quick' | 'analysis_quick')[],
  maxTokensArray: number[]
): GPT5MiniInput[] {
  if (promptsArray.length !== scenarioTypesArray.length || 
      promptsArray.length !== maxTokensArray.length) {
    throw new Error("All arrays must have the same length");
  }

  return promptsArray.map((prompt, index) => {
    const settings = getOptimalGPT5MiniSettings(scenarioTypesArray[index]);
    return {
      prompt,
      reasoning_effort: settings.reasoning_effort,
      verbosity: settings.verbosity,
      max_completion_tokens: maxTokensArray[index] || settings.max_completion_tokens
    };
  });
}

/**
 * Supported scenario types for GPT-5-Mini
 */
export const GPT5_MINI_SCENARIOS = {
  "chat": "Chat applications and conversational AI",
  "quick_reasoning": "Medium-difficulty reasoning with speed optimization",
  "cost_optimized": "Cost-effective processing for high-volume tasks",
  "real_time": "Real-time applications requiring fast responses",
  "batch_processing": "Batch processing with cost optimization",
  "conversation": "Conversational interactions with conversation history",
  "multimodal_quick": "Quick image and text analysis",
  "analysis_quick": "Quick analysis and evaluation tasks"
} as const;

/**
 * GPT-5-Mini capability descriptions
 */
export const GPT5_MINI_CAPABILITIES = {
  "speed_optimization": "Faster response times than GPT-5",
  "cost_efficiency": "Lower cost per token for cost-sensitive applications",
  "balanced_performance": "Balanced speed and quality for medium-difficulty tasks",
  "real_time_capable": "Suitable for real-time applications",
  "high_volume_ready": "Optimized for high-volume processing",
  "chat_optimized": "Ideal for conversational applications",
  "advanced_reasoning": "Same advanced reasoning capabilities as GPT-5",
  "reasoning_effort_control": "Control how deeply the model thinks before responding",
  "verbosity_control": "Control response length and detail level",
  "multimodal": "Text and image understanding capabilities",
  "reasoning_carryover": "Retains and reuses reasoning across turns",
  "custom_tools": "Define tools with freeform text input",
  "safety_controls": "Built-in safety and predictability controls",
  "api_integration": "Ready for API integrations requiring fast responses"
} as const;

/**
 * Model variant information
 */
export const GPT5_MINI_VARIANT = {
  "name": "GPT-5-Mini",
  "description": "Faster version of OpenAI's flagship GPT-5 model",
  "optimization": "Balanced speed and cost, ideal for chat and medium-difficulty reasoning",
  "target_use_cases": "Real-time applications, cost-sensitive use cases, high-volume processing"
} as const;

/**
 * Hardware requirements
 */
export const GPT5_MINI_HARDWARE = {
  "gpu": "Nvidia L40S GPU",
  "memory": "Optimized memory usage for faster processing",
  "processing": "Optimized for speed and cost efficiency"
} as const;

/**
 * Pricing information
 */
export const GPT5_MINI_PRICING = {
  "input_cost_per_million": 0.25,
  "output_cost_per_million": 2.00,
  "currency": "USD",
  "billing_unit": "per token",
  "cost_advantage": "5x cheaper than GPT-5 for both input and output tokens"
} as const;

/**
 * GPT-5-Mini tips
 */
export const GPT5_MINI_TIPS = {
  "prompt_creation": "Use clear, specific prompts for best results",
  "reasoning_effort": "Use minimal for fastest responses, medium for balanced tasks, high for complex reasoning",
  "verbosity_control": "Use low for concise answers, medium for balanced responses, high for detailed explanations",
  "speed_optimization": "Use minimal reasoning effort and low verbosity for fastest responses",
  "cost_optimization": "Use minimal reasoning effort, low verbosity, and optimize max_completion_tokens",
  "chat_applications": "Ideal for conversational applications with fast response requirements",
  "real_time_usage": "Suitable for real-time applications requiring immediate responses",
  "batch_processing": "Optimized for batch processing with cost considerations",
  "high_volume": "Perfect for high-volume applications where cost efficiency is important",
  "conversation_mode": "Use messages array for better conversation continuity"
} as const;

export default executeGPT5Mini;
