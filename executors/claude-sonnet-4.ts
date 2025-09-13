import Replicate from "replicate";

export interface ClaudeSonnet4Input {
  prompt: string;
  image?: string;
  system_prompt?: string;
  max_tokens?: number;
  max_image_resolution?: number;
  extended_thinking?: boolean;
  thinking_budget_tokens?: number;
}

export interface ClaudeSonnet4Output {
  text: string;
  thinking?: string;
}

export interface ClaudeSonnet4Options {
  webhookUrl?: string;
  webhookEventsFilter?: string[];
  onProgress?: (progress: any) => void;
}

/**
 * Claude Sonnet 4 Executor
 * 
 * Claude Sonnet 4 is a hybrid reasoning model that offers both near-instant responses 
 * and extended thinking capabilities. It significantly improves upon Claude Sonnet 3.7's 
 * performance while maintaining efficiency for everyday use cases. Features advanced 
 * coding capabilities with 72.7% performance on SWE-bench, enhanced instruction 
 * following, parallel tool execution, and memory improvements.
 * 
 * @param input - The multimodal input parameters
 * @param options - Additional execution options
 * @returns Promise with the response
 */
export async function executeClaudeSonnet4(
  input: ClaudeSonnet4Input,
  options: ClaudeSonnet4Options = {}
): Promise<ClaudeSonnet4Output> {
  try {
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate required inputs
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    // Validate parameter ranges
    if (input.max_tokens && (input.max_tokens < 1024 || input.max_tokens > 64000)) {
      throw new Error("max_tokens must be between 1024 and 64000");
    }

    if (input.max_image_resolution && (input.max_image_resolution < 0.001 || input.max_image_resolution > 2)) {
      throw new Error("max_image_resolution must be between 0.001 and 2.0");
    }

    if (input.thinking_budget_tokens && (input.thinking_budget_tokens < 1024 || input.thinking_budget_tokens > 64000)) {
      throw new Error("thinking_budget_tokens must be between 1024 and 64000");
    }

    // Validate image URL if provided
    if (input.image) {
      try {
        new URL(input.image);
      } catch {
        throw new Error("Image must be a valid URL");
      }
    }

    // Prepare the request payload
    const payload: any = {
      prompt: input.prompt.trim(),
    };

    // Add optional inputs with defaults
    if (input.image) {
      payload.image = input.image;
    }

    if (input.system_prompt) {
      payload.system_prompt = input.system_prompt;
    }

    if (input.max_tokens !== undefined) {
      payload.max_tokens = input.max_tokens;
    }

    if (input.max_image_resolution !== undefined) {
      payload.max_image_resolution = input.max_image_resolution;
    }

    if (input.extended_thinking !== undefined) {
      payload.extended_thinking = input.extended_thinking;
    }

    if (input.thinking_budget_tokens !== undefined) {
      payload.thinking_budget_tokens = input.thinking_budget_tokens;
    }

    // Execute the model
    const output = await replicate.run(
      "anthropic/claude-4-sonnet",
      {
        input: payload,
        webhook: options.webhookUrl,
        webhook_events_filter: options.webhookEventsFilter,
      }
    );

    // Process the output (it comes as an array of strings)
    const responseText = Array.isArray(output) ? output.join("") : String(output);
    
    // Extract thinking if present (look for thinking patterns)
    const thinkingMatch = responseText.match(/<thinking>([\s\S]*?)<\/thinking>/i);
    const thinking = thinkingMatch ? thinkingMatch[1].trim() : undefined;
    
    // Clean the main response text
    const cleanText = responseText.replace(/<thinking>[\s\S]*?<\/thinking>/gi, "").trim();

    return {
      text: cleanText,
      thinking: thinking
    };

  } catch (error) {
    console.error("Claude Sonnet 4 execution failed:", error);
    throw new Error(`Claude Sonnet 4 execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Claude Sonnet 4 with prediction management for long-running tasks
 * 
 * @param input - The multimodal input parameters
 * @param options - Additional execution options
 * @returns Promise with prediction object for tracking
 */
export async function executeClaudeSonnet4Prediction(
  input: ClaudeSonnet4Input,
  options: ClaudeSonnet4Options = {}
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

    if (input.max_tokens && (input.max_tokens < 1024 || input.max_tokens > 64000)) {
      throw new Error("max_tokens must be between 1024 and 64000");
    }

    if (input.max_image_resolution && (input.max_image_resolution < 0.001 || input.max_image_resolution > 2)) {
      throw new Error("max_image_resolution must be between 0.001 and 2.0");
    }

    if (input.thinking_budget_tokens && (input.thinking_budget_tokens < 1024 || input.thinking_budget_tokens > 64000)) {
      throw new Error("thinking_budget_tokens must be between 1024 and 64000");
    }

    if (input.image) {
      try {
        new URL(input.image);
      } catch {
        throw new Error("Image must be a valid URL");
      }
    }

    // Prepare the request payload
    const payload: any = {
      prompt: input.prompt.trim(),
    };

    // Add optional inputs
    if (input.image) {
      payload.image = input.image;
    }

    if (input.system_prompt) {
      payload.system_prompt = input.system_prompt;
    }

    if (input.max_tokens !== undefined) {
      payload.max_tokens = input.max_tokens;
    }

    if (input.max_image_resolution !== undefined) {
      payload.max_image_resolution = input.max_image_resolution;
    }

    if (input.extended_thinking !== undefined) {
      payload.extended_thinking = input.extended_thinking;
    }

    if (input.thinking_budget_tokens !== undefined) {
      payload.thinking_budget_tokens = input.thinking_budget_tokens;
    }

    // Create prediction
    const prediction = await replicate.predictions.create({
      model: "anthropic/claude-4-sonnet",
      input: payload,
      webhook: options.webhookUrl,
      webhook_events_filter: options.webhookEventsFilter,
    });

    return prediction;

  } catch (error) {
    console.error("Claude Sonnet 4 prediction creation failed:", error);
    throw new Error(`Claude Sonnet 4 prediction creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a Claude Sonnet 4 prediction
 * 
 * @param predictionId - The prediction ID from prediction creation
 * @returns Promise with prediction status
 */
export async function checkClaudeSonnet4Status(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.get(predictionId);
    return prediction;

  } catch (error) {
    console.error("Claude Sonnet 4 status check failed:", error);
    throw new Error(`Claude Sonnet 4 status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Cancel a running Claude Sonnet 4 prediction
 * 
 * @param predictionId - The prediction ID to cancel
 * @returns Promise with cancellation result
 */
export async function cancelClaudeSonnet4Prediction(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.cancel(predictionId);
    return prediction;

  } catch (error) {
    console.error("Claude Sonnet 4 prediction cancellation failed:", error);
    throw new Error(`Claude Sonnet 4 prediction cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create Claude Sonnet 4 scenarios
 * 
 * @param type - Type of scenario to create
 * @param customPrompt - Custom prompt (optional)
 * @param customOptions - Custom options (optional)
 * @returns Claude Sonnet 4 input configuration
 */
export function createClaudeSonnet4Scenario(
  type: 'coding' | 'reasoning' | 'image_analysis' | 'creative_writing' | 'technical_documentation' | 'research' | 'conversation' | 'extended_thinking' | 'custom',
  customPrompt?: string,
  customOptions?: Partial<ClaudeSonnet4Input>
): ClaudeSonnet4Input {
  const scenarioTemplates = {
    coding: {
      prompt: customPrompt || "Write a Python function to implement binary search algorithm. Include proper error handling and test cases.",
      system_prompt: "You are an expert Python developer. Write clean, efficient code with proper error handling and documentation.",
      max_tokens: 6000,
      extended_thinking: false
    },
    reasoning: {
      prompt: customPrompt || "Analyze this complex problem and provide a step-by-step solution with reasoning.",
      system_prompt: "You are a logical reasoning expert. Break down problems systematically and provide clear explanations.",
      max_tokens: 4000,
      extended_thinking: false
    },
    image_analysis: {
      prompt: customPrompt || "Describe what you see in this image in detail, including objects, people, setting, and any notable features.",
      image: "https://example.com/image.jpg",
      max_image_resolution: 1.0,
      max_tokens: 3000,
      extended_thinking: false
    },
    creative_writing: {
      prompt: customPrompt || "Write a creative short story about a character who discovers they can see into the future.",
      system_prompt: "You are a creative writer. Write engaging, well-structured stories with vivid descriptions and compelling characters.",
      max_tokens: 5000,
      extended_thinking: false
    },
    technical_documentation: {
      prompt: customPrompt || "Create comprehensive technical documentation for a REST API endpoint.",
      system_prompt: "You are a technical writer. Create clear, comprehensive documentation that developers can easily follow.",
      max_tokens: 4000,
      extended_thinking: false
    },
    research: {
      prompt: customPrompt || "Research and analyze the current state of artificial intelligence in healthcare.",
      system_prompt: "You are a research analyst. Provide thorough, well-sourced analysis with clear insights and conclusions.",
      max_tokens: 6000,
      extended_thinking: false
    },
    conversation: {
      prompt: customPrompt || "Let's have a conversation about the future of technology.",
      system_prompt: "You are a helpful, knowledgeable assistant. Engage in thoughtful conversation and provide insightful responses.",
      max_tokens: 3000,
      extended_thinking: false
    },
    extended_thinking: {
      prompt: customPrompt || "Solve this complex mathematical problem that requires deep reasoning and multiple steps.",
      system_prompt: "You are a mathematical expert. Use extended thinking to work through complex problems step by step.",
      max_tokens: 8000,
      extended_thinking: true,
      thinking_budget_tokens: 4000
    },
    custom: {
      prompt: customPrompt || "Analyze this request and provide a comprehensive response.",
      system_prompt: "You are a helpful assistant. Provide thorough, accurate responses to user requests.",
      max_tokens: 4000,
      extended_thinking: false
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
 * Predefined prompt templates for different Claude Sonnet 4 scenarios
 */
export const CLAUDE_SONNET4_PROMPT_TEMPLATES = {
  "coding": [
    "Write a {language} function to {task}. Include proper error handling and test cases.",
    "Debug this code and explain what's wrong: {code}",
    "Optimize this algorithm for better performance: {algorithm}",
    "Design a data structure to efficiently handle {requirement}",
    "Implement a {pattern} pattern in {language} for {use_case}"
  ],
  "reasoning": [
    "Analyze this complex problem and provide a step-by-step solution: {problem}",
    "Determine the validity of this argument: {argument}",
    "Solve this logic puzzle using systematic reasoning: {puzzle}",
    "Identify the root cause of {issue} and propose solutions",
    "Compare and contrast {concept1} and {concept2} in terms of {aspect}"
  ],
  "image_analysis": [
    "Describe what you see in this image in detail, including objects, people, setting, and any notable features.",
    "Analyze the composition, lighting, and mood of this image.",
    "Identify all the objects and people in this image and describe their relationships.",
    "What story does this image tell? Describe the narrative elements you observe.",
    "Analyze the technical aspects of this image (composition, color, lighting, etc.)."
  ],
  "creative_writing": [
    "Write a creative short story about {character} who {situation}.",
    "Create a dialogue between {character1} and {character2} about {topic}.",
    "Write a poem about {theme} using {style} style.",
    "Develop a character profile for {character_name} including background, motivations, and personality.",
    "Write a scene where {character} faces {challenge} and how they overcome it."
  ],
  "technical_documentation": [
    "Create comprehensive technical documentation for {system} including API endpoints, usage examples, and troubleshooting.",
    "Write a user guide for {software} covering installation, configuration, and common use cases.",
    "Document the architecture of {system} including components, data flow, and integration points.",
    "Create API documentation for {service} with request/response examples and error codes.",
    "Write a troubleshooting guide for {system} covering common issues and solutions."
  ],
  "research": [
    "Research and analyze the current state of {field} including recent developments and future trends.",
    "Compare different approaches to {problem} and evaluate their pros and cons.",
    "Analyze the impact of {technology} on {industry} with supporting data and examples.",
    "Review the literature on {topic} and synthesize the key findings.",
    "Investigate the relationship between {factor1} and {factor2} in {context}."
  ],
  "conversation": [
    "Let's discuss {topic}. What are your thoughts on this subject?",
    "I'm interested in learning about {subject}. Can you explain it to me?",
    "What's your perspective on {issue}? I'd like to hear your analysis.",
    "Can you help me understand {concept} better?",
    "I'm curious about {topic}. What should I know about it?"
  ],
  "extended_thinking": [
    "Solve this complex {type} problem that requires deep reasoning and multiple steps: {problem}",
    "Analyze this multi-faceted issue from multiple perspectives: {issue}",
    "Work through this complex scenario step by step: {scenario}",
    "Break down this intricate problem into manageable components: {problem}",
    "Use extended thinking to thoroughly analyze {topic} and provide comprehensive insights."
  ]
} as const;

/**
 * Example usage of the Claude Sonnet 4 executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic text generation
    const result1 = await executeClaudeSonnet4({
      prompt: "Give me a recipe for tasty smashed avocado on sourdough toast",
      system_prompt: "You are a helpful assistant",
      max_tokens: 2000
    });

    console.log("Basic response:", result1.text);

    // Example 2: Coding task
    const result2 = await executeClaudeSonnet4({
      prompt: "Write a Python function to implement binary search",
      system_prompt: "You are an expert Python developer. Write clean, efficient code with proper error handling.",
      max_tokens: 4000
    });

    console.log("Coding response:", result2.text);

    // Example 3: Image analysis
    const result3 = await executeClaudeSonnet4({
      prompt: "Describe what you see in this image",
      image: "https://example.com/image.jpg",
      max_image_resolution: 1.0,
      max_tokens: 3000
    });

    console.log("Image analysis:", result3.text);

    // Example 4: Extended thinking
    const result4 = await executeClaudeSonnet4({
      prompt: "Solve this complex mathematical problem step by step",
      extended_thinking: true,
      thinking_budget_tokens: 4000,
      max_tokens: 6000
    });

    console.log("Extended thinking response:", result4.text);
    if (result4.thinking) {
      console.log("Thinking process:", result4.thinking);
    }

    // Example 5: Using helper function for coding scenario
    const codingScenario = createClaudeSonnet4Scenario('coding');
    const result5 = await executeClaudeSonnet4(codingScenario);
    console.log("Coding scenario:", result5.text);

    // Example 6: Custom scenario with extended thinking
    const customScenario = createClaudeSonnet4Scenario(
      'extended_thinking',
      "Analyze the pros and cons of renewable energy sources",
      {
        thinking_budget_tokens: 3000,
        max_tokens: 5000
      }
    );
    const result6 = await executeClaudeSonnet4(customScenario);
    console.log("Custom extended thinking:", result6.text);

    // Example 7: Using predefined templates
    const result7 = await executeClaudeSonnet4({
      prompt: CLAUDE_SONNET4_PROMPT_TEMPLATES.coding[0]
        .replace("{language}", "Python")
        .replace("{task}", "implement a quicksort algorithm"),
      system_prompt: "You are an expert Python developer.",
      max_tokens: 5000
    });
    console.log("Template coding solution:", result7.text);

    // Example 8: Prediction usage for long-running tasks
    const prediction = await executeClaudeSonnet4Prediction({
      prompt: "Analyze the entire history of artificial intelligence and predict future developments",
      extended_thinking: true,
      thinking_budget_tokens: 8000,
      max_tokens: 10000
    });

    console.log("Prediction ID:", prediction.id);

    // Check status
    const status = await checkClaudeSonnet4Status(prediction.id);
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
 * @param inputTokens - Number of input tokens
 * @param outputTokens - Number of output tokens
 * @param hasImage - Whether the input includes an image
 * @param imagePixels - Number of pixels in the image (if applicable)
 * @returns Estimated cost in USD
 */
export function estimateProcessingCost(
  inputTokens: number, 
  outputTokens: number, 
  hasImage: boolean = false, 
  imagePixels?: number
): number {
  const inputCostPerMillion = 3.00;
  const outputCostPerMillion = 15.00;
  
  let inputCost = (inputTokens / 1000000) * inputCostPerMillion;
  const outputCost = (outputTokens / 1000000) * outputCostPerMillion;
  
  // Add image cost if present
  if (hasImage && imagePixels) {
    const imageTokens = imagePixels / 750;
    inputCost += (imageTokens / 1000000) * inputCostPerMillion;
  }
  
  return inputCost + outputCost;
}

/**
 * Utility function to validate prompt format for Claude Sonnet 4
 * 
 * @param prompt - The prompt string to validate
 * @returns Validation result with suggestions
 */
export function validateClaudeSonnet4Prompt(prompt: string): { 
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
  const hasClearWords = /(write|create|analyze|explain|describe|solve|implement|design|develop)/i.test(prompt);
  
  if (!hasClearWords) {
    suggestions.push("Consider using action words like 'write', 'analyze', 'explain', or 'create' for better results");
  }
  
  if (prompt.length < 20) {
    suggestions.push("Consider making your prompt more specific and detailed for better results");
  }

  // Check for very long prompts
  if (prompt.length > 5000) {
    suggestions.push("Consider shortening your prompt for better processing");
  }

  // Check for question format
  const hasQuestionMark = /\?/.test(prompt);
  if (!hasQuestionMark && !hasClearWords) {
    suggestions.push("Consider framing your prompt as a question or using action words for better results");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedPrompt
  };
}

/**
 * Utility function to get optimal settings for Claude Sonnet 4 scenario type
 * 
 * @param scenarioType - Type of scenario
 * @returns Recommended settings
 */
export function getOptimalClaudeSonnet4Settings(scenarioType: 'coding' | 'reasoning' | 'image_analysis' | 'creative_writing' | 'technical_documentation' | 'research' | 'conversation' | 'extended_thinking'): {
  max_tokens: number;
  max_image_resolution: number;
  extended_thinking: boolean;
  thinking_budget_tokens: number;
  system_prompt_suggestions: string[];
} {
  const settingsMap = {
    coding: { 
      max_tokens: 6000,
      max_image_resolution: 0.5,
      extended_thinking: false,
      thinking_budget_tokens: 1024,
      system_prompt_suggestions: ["You are an expert software developer.", "You are a coding expert who writes clean, efficient code."] 
    },
    reasoning: { 
      max_tokens: 4000,
      max_image_resolution: 0.5,
      extended_thinking: false,
      thinking_budget_tokens: 1024,
      system_prompt_suggestions: ["You are a logical reasoning expert.", "You are an analytical thinker who breaks down problems systematically."] 
    },
    image_analysis: { 
      max_tokens: 3000,
      max_image_resolution: 1.0,
      extended_thinking: false,
      thinking_budget_tokens: 1024,
      system_prompt_suggestions: ["You are an expert at analyzing images.", "You are a visual analysis expert who provides detailed descriptions."] 
    },
    creative_writing: { 
      max_tokens: 5000,
      max_image_resolution: 0.5,
      extended_thinking: false,
      thinking_budget_tokens: 1024,
      system_prompt_suggestions: ["You are a creative writer.", "You are a skilled storyteller who creates engaging narratives."] 
    },
    technical_documentation: { 
      max_tokens: 4000,
      max_image_resolution: 0.5,
      extended_thinking: false,
      thinking_budget_tokens: 1024,
      system_prompt_suggestions: ["You are a technical writer.", "You are an expert at creating clear, comprehensive documentation."] 
    },
    research: { 
      max_tokens: 6000,
      max_image_resolution: 0.5,
      extended_thinking: false,
      thinking_budget_tokens: 1024,
      system_prompt_suggestions: ["You are a research analyst.", "You are an expert researcher who provides thorough analysis."] 
    },
    conversation: { 
      max_tokens: 3000,
      max_image_resolution: 0.5,
      extended_thinking: false,
      thinking_budget_tokens: 1024,
      system_prompt_suggestions: ["You are a helpful, knowledgeable assistant.", "You are an engaging conversationalist."] 
    },
    extended_thinking: { 
      max_tokens: 8000,
      max_image_resolution: 0.5,
      extended_thinking: true,
      thinking_budget_tokens: 4000,
      system_prompt_suggestions: ["You are an expert who uses deep reasoning.", "You are a systematic thinker who works through complex problems step by step."] 
    }
  };

  return settingsMap[scenarioType];
}

/**
 * Utility function to enhance prompt for better Claude Sonnet 4 results
 * 
 * @param prompt - Base prompt to enhance
 * @param enhancements - Enhancement options
 * @returns Enhanced prompt
 */
export function enhancePromptForClaudeSonnet4(
  prompt: string, 
  enhancements: {
    addSpecificity?: boolean;
    addContext?: boolean;
    addDetail?: boolean;
    addExamples?: boolean;
  } = {}
): string {
  let enhancedPrompt = prompt.trim();

  // Add specificity
  if (enhancements.addSpecificity) {
    if (!/(write|create|analyze|explain|describe|solve|implement|design|develop)/i.test(enhancedPrompt)) {
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

  // Add examples
  if (enhancements.addExamples) {
    if (!/(example|examples|illustrate|demonstrate)/i.test(enhancedPrompt)) {
      enhancedPrompt = `${enhancedPrompt}. Please provide examples to illustrate your points.`;
    }
  }

  return enhancedPrompt;
}

/**
 * Utility function to create batch Claude Sonnet 4 analysis
 * 
 * @param promptsArray - Array of prompts
 * @param scenarioTypesArray - Array of scenario types
 * @param maxTokensArray - Array of max token values
 * @returns Array of Claude Sonnet 4 inputs
 */
export function createBatchClaudeSonnet4Analysis(
  promptsArray: string[], 
  scenarioTypesArray: ('coding' | 'reasoning' | 'image_analysis' | 'creative_writing' | 'technical_documentation' | 'research' | 'conversation' | 'extended_thinking')[],
  maxTokensArray: number[]
): ClaudeSonnet4Input[] {
  if (promptsArray.length !== scenarioTypesArray.length || 
      promptsArray.length !== maxTokensArray.length) {
    throw new Error("All arrays must have the same length");
  }

  return promptsArray.map((prompt, index) => {
    const settings = getOptimalClaudeSonnet4Settings(scenarioTypesArray[index]);
    return {
      prompt,
      max_tokens: maxTokensArray[index] || settings.max_tokens,
      max_image_resolution: settings.max_image_resolution,
      extended_thinking: settings.extended_thinking,
      thinking_budget_tokens: settings.thinking_budget_tokens
    };
  });
}

/**
 * Supported scenario types
 */
export const CLAUDE_SONNET4_SCENARIOS = {
  "coding": "Software development and programming tasks",
  "reasoning": "Logical reasoning and problem solving",
  "image_analysis": "Image understanding and analysis",
  "creative_writing": "Creative content generation",
  "technical_documentation": "Technical writing and documentation",
  "research": "Research and analysis tasks",
  "conversation": "Conversational interactions",
  "extended_thinking": "Complex reasoning with extended thinking mode"
} as const;

/**
 * Claude Sonnet 4 capability descriptions
 */
export const CLAUDE_SONNET4_CAPABILITIES = {
  "dual_modes": "Standard mode for fast responses, Extended thinking for complex problems",
  "coding_excellence": "72.7% performance on SWE-bench coding tasks",
  "instruction_following": "Enhanced instruction following and steerability",
  "parallel_tools": "Parallel tool execution capabilities",
  "memory_improvements": "Memory improvements with local file access",
  "web_search": "Web search integration during extended thinking (beta)",
  "safety_protections": "AI Safety Level 3 (ASL-3) protections",
  "multimodal": "Text and image understanding capabilities",
  "thinking_summaries": "Condensed reasoning summaries available",
  "shortcut_reduction": "65% reduction in shortcut/loophole behavior"
} as const;

/**
 * Performance benchmarks
 */
export const CLAUDE_SONNET4_BENCHMARKS = {
  "coding": {
    "SWE_bench": "72.7% (state-of-the-art for coding tasks)"
  },
  "reasoning": {
    "GPQA_Diamond": "75.5% (70.0% without extended thinking)",
    "MMMLU": "88.2% (85.4% without extended thinking)",
    "MMMU": "77.6% (72.6% without extended thinking)",
    "AIME": "40.0% (33.1% without extended thinking)"
  }
} as const;

/**
 * Hardware requirements
 */
export const CLAUDE_SONNET4_HARDWARE = {
  "gpu": "Nvidia L40S GPU",
  "memory": "High memory requirements for extended thinking",
  "processing": "Optimized for both fast and deep reasoning"
} as const;

/**
 * Pricing information
 */
export const CLAUDE_SONNET4_PRICING = {
  "input_cost_per_million": 3.00,
  "output_cost_per_million": 15.00,
  "currency": "USD",
  "billing_unit": "per token",
  "image_pricing": "Images priced as (width px * height px)/750 input tokens"
} as const;

/**
 * Claude Sonnet 4 tips
 */
export const CLAUDE_SONNET4_TIPS = {
  "prompt_creation": "Use clear, specific prompts for best results",
  "extended_thinking": "Use extended thinking mode for complex reasoning tasks",
  "system_prompts": "Use system prompts to guide model behavior",
  "image_optimization": "Optimize image resolution to balance quality and cost",
  "token_management": "Set appropriate max_tokens based on expected response length",
  "coding_tasks": "Excellent for coding tasks with 72.7% SWE-bench performance",
  "safety_features": "Implements AI Safety Level 3 protections",
  "parallel_execution": "Take advantage of parallel tool execution capabilities"
} as const;

export default executeClaudeSonnet4;
