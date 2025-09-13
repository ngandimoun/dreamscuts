import Replicate from "replicate";

export interface GPT5Input {
  prompt?: string;
  messages?: Array<{ role: string; content: string }>;
  system_prompt?: string;
  image_input?: string[];
  reasoning_effort?: 'minimal' | 'low' | 'medium' | 'high';
  verbosity?: 'low' | 'medium' | 'high';
  max_completion_tokens?: number;
}

export interface GPT5Output {
  text: string;
  reasoning?: string;
}

export interface GPT5Options {
  webhookUrl?: string;
  webhookEventsFilter?: string[];
  onProgress?: (progress: any) => void;
}

/**
 * GPT-5 Executor
 * 
 * OpenAI's most capable model to date, designed for advanced reasoning, code generation, 
 * instruction following, and tool use. Features multiple variants (gpt-5, gpt-5-mini, 
 * gpt-5-nano) with different capabilities, reasoning effort control, verbosity control, 
 * custom tools, and reasoning carryover for improved performance across conversation turns.
 * 
 * @param input - The multimodal input parameters
 * @param options - Additional execution options
 * @returns Promise with the response
 */
export async function executeGPT5(
  input: GPT5Input,
  options: GPT5Options = {}
): Promise<GPT5Output> {
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
      "openai/gpt-5",
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
    console.error("GPT-5 execution failed:", error);
    throw new Error(`GPT-5 execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute GPT-5 with prediction management for long-running tasks
 * 
 * @param input - The multimodal input parameters
 * @param options - Additional execution options
 * @returns Promise with prediction object for tracking
 */
export async function executeGPT5Prediction(
  input: GPT5Input,
  options: GPT5Options = {}
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
      model: "openai/gpt-5",
      input: payload,
      webhook: options.webhookUrl,
      webhook_events_filter: options.webhookEventsFilter,
    });

    return prediction;

  } catch (error) {
    console.error("GPT-5 prediction creation failed:", error);
    throw new Error(`GPT-5 prediction creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a GPT-5 prediction
 * 
 * @param predictionId - The prediction ID from prediction creation
 * @returns Promise with prediction status
 */
export async function checkGPT5Status(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.get(predictionId);
    return prediction;

  } catch (error) {
    console.error("GPT-5 status check failed:", error);
    throw new Error(`GPT-5 status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Cancel a running GPT-5 prediction
 * 
 * @param predictionId - The prediction ID to cancel
 * @returns Promise with cancellation result
 */
export async function cancelGPT5Prediction(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.cancel(predictionId);
    return prediction;

  } catch (error) {
    console.error("GPT-5 prediction cancellation failed:", error);
    throw new Error(`GPT-5 prediction cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create GPT-5 scenarios
 * 
 * @param type - Type of scenario to create
 * @param customPrompt - Custom prompt (optional)
 * @param customOptions - Custom options (optional)
 * @returns GPT-5 input configuration
 */
export function createGPT5Scenario(
  type: 'reasoning' | 'coding' | 'creative_writing' | 'analysis' | 'conversation' | 'multimodal' | 'agentic' | 'frontend' | 'research' | 'custom',
  customPrompt?: string,
  customOptions?: Partial<GPT5Input>
): GPT5Input {
  const scenarioTemplates = {
    reasoning: {
      prompt: customPrompt || "Solve this complex problem step by step with detailed reasoning",
      reasoning_effort: 'high' as const,
      verbosity: 'high' as const,
      max_completion_tokens: 4000
    },
    coding: {
      prompt: customPrompt || "Write a Python function to implement binary search with proper error handling and test cases",
      reasoning_effort: 'minimal' as const,
      verbosity: 'high' as const,
      system_prompt: "You are an expert Python developer. Always include tests and error handling.",
      max_completion_tokens: 3000
    },
    creative_writing: {
      prompt: customPrompt || "Write a creative short story about a character who discovers they can see into the future",
      reasoning_effort: 'medium' as const,
      verbosity: 'high' as const,
      max_completion_tokens: 4000
    },
    analysis: {
      prompt: customPrompt || "Analyze the pros and cons of renewable energy sources and provide a comprehensive assessment",
      reasoning_effort: 'medium' as const,
      verbosity: 'high' as const,
      max_completion_tokens: 3000
    },
    conversation: {
      messages: customPrompt ? [{ role: 'user', content: customPrompt }] : [{ role: 'user', content: "Hello, how are you?" }],
      reasoning_effort: 'minimal' as const,
      verbosity: 'medium' as const
    },
    multimodal: {
      prompt: customPrompt || "Analyze this image and provide detailed insights",
      image_input: ["https://example.com/image.jpg"],
      reasoning_effort: 'medium' as const,
      verbosity: 'high' as const,
      max_completion_tokens: 2000
    },
    agentic: {
      prompt: customPrompt || "Help me plan a complex project. Break it down into manageable tasks and provide a detailed timeline",
      reasoning_effort: 'high' as const,
      verbosity: 'high' as const,
      max_completion_tokens: 5000
    },
    frontend: {
      prompt: customPrompt || "Create a React component using Tailwind CSS for a modern dashboard interface",
      reasoning_effort: 'minimal' as const,
      verbosity: 'high' as const,
      system_prompt: "You are a frontend developer expert in React, Tailwind CSS, and modern UI/UX practices.",
      max_completion_tokens: 4000
    },
    research: {
      prompt: customPrompt || "Research and analyze the current state of artificial intelligence and predict future developments",
      reasoning_effort: 'high' as const,
      verbosity: 'high' as const,
      max_completion_tokens: 5000
    },
    custom: {
      prompt: customPrompt || "Analyze this request and provide a comprehensive response",
      reasoning_effort: 'medium' as const,
      verbosity: 'medium' as const,
      max_completion_tokens: 2000
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
 * Predefined prompt templates for different GPT-5 scenarios
 */
export const GPT5_PROMPT_TEMPLATES = {
  "reasoning": [
    "Solve this complex problem step by step with detailed reasoning: {problem}",
    "Analyze this situation and provide a logical solution: {situation}",
    "Break down this complex task into manageable steps: {task}",
    "Evaluate the pros and cons of {topic} and provide recommendations",
    "Think through this problem systematically: {problem}"
  ],
  "coding": [
    "Write a {language} function to {task} with proper error handling and test cases",
    "Debug this code and explain what's wrong: {code}",
    "Optimize this algorithm for better performance: {algorithm}",
    "Design a data structure to efficiently handle {requirement}",
    "Implement a {pattern} pattern in {language} for {use_case}"
  ],
  "creative_writing": [
    "Write a creative short story about {character} who {situation}",
    "Create a dialogue between {character1} and {character2} about {topic}",
    "Write a poem about {theme} using {style} style",
    "Develop a character profile for {character_name} including background and motivations",
    "Write a scene where {character} faces {challenge} and how they overcome it"
  ],
  "analysis": [
    "Analyze the pros and cons of {topic} and provide a comprehensive assessment",
    "Evaluate the effectiveness of {strategy} in {context}",
    "Compare different approaches to {problem} and recommend the best one",
    "Assess the impact of {factor} on {outcome}",
    "Analyze the trends in {field} and predict future developments"
  ],
  "conversation": [
    "Let's discuss {topic}. What are your thoughts on this subject?",
    "I'm interested in learning about {subject}. Can you explain it to me?",
    "What's your perspective on {issue}? I'd like to hear your analysis.",
    "Can you help me understand {concept} better?",
    "I'm curious about {topic}. What should I know about it?"
  ],
  "multimodal": [
    "Analyze this image and provide detailed insights about what you see",
    "Describe the visual elements in this image and their significance",
    "What story does this image tell? Analyze the narrative elements",
    "Compare and contrast the elements in these images: {images}",
    "Identify all the objects and people in this image and describe their relationships"
  ],
  "agentic": [
    "Help me plan {task} including {requirements} and provide a detailed timeline",
    "Create a comprehensive strategy for {goal} with actionable steps",
    "Design a workflow for {process} that is efficient and scalable",
    "Develop a plan to achieve {objective} with measurable milestones",
    "Organize and prioritize these tasks: {tasks} with clear dependencies"
  ],
  "frontend": [
    "Create a {framework} component using {styling} for {purpose}",
    "Design a modern {type} interface with {features}",
    "Build a responsive {component} that works on all devices",
    "Implement a {pattern} pattern in {framework} for {use_case}",
    "Create a {theme} themed {component} with {styling} and {icons}"
  ],
  "research": [
    "Research and analyze the current state of {field} including recent developments",
    "Investigate the relationship between {factor1} and {factor2} in {context}",
    "Review the literature on {topic} and synthesize the key findings",
    "Analyze the impact of {technology} on {industry} with supporting data",
    "Compare different methodologies for {research_area} and evaluate their effectiveness"
  ]
} as const;

/**
 * Example usage of the GPT-5 executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic reasoning
    const result1 = await executeGPT5({
      prompt: "Are you AGI?",
      reasoning_effort: 'minimal',
      verbosity: 'medium'
    });

    console.log("Basic reasoning response:", result1.text);

    // Example 2: Advanced reasoning
    const result2 = await executeGPT5({
      prompt: "Solve this complex mathematical problem step by step",
      reasoning_effort: 'high',
      verbosity: 'high',
      max_completion_tokens: 4000
    });

    console.log("Advanced reasoning response:", result2.text);

    // Example 3: Coding task
    const result3 = await executeGPT5({
      prompt: "Write a Python function to implement binary search",
      reasoning_effort: 'minimal',
      verbosity: 'high',
      system_prompt: "You are an expert Python developer."
    });

    console.log("Coding response:", result3.text);

    // Example 4: Conversation mode
    const result4 = await executeGPT5({
      messages: [
        { role: 'user', content: 'Hello, how are you?' },
        { role: 'assistant', content: "I'm doing well, thank you!" },
        { role: 'user', content: 'Can you help me with a coding problem?' }
      ],
      reasoning_effort: 'medium',
      verbosity: 'medium'
    });

    console.log("Conversation response:", result4.text);

    // Example 5: Multimodal analysis
    const result5 = await executeGPT5({
      prompt: "Analyze this image and provide insights",
      image_input: ["https://example.com/image.jpg"],
      reasoning_effort: 'medium',
      verbosity: 'high'
    });

    console.log("Multimodal analysis:", result5.text);

    // Example 6: Using helper function for reasoning scenario
    const reasoningScenario = createGPT5Scenario('reasoning');
    const result6 = await executeGPT5(reasoningScenario);
    console.log("Reasoning scenario:", result6.text);

    // Example 7: Custom scenario with specific parameters
    const customScenario = createGPT5Scenario(
      'agentic',
      "Help me plan a software development project",
      {
        max_completion_tokens: 5000,
        verbosity: 'high'
      }
    );
    const result7 = await executeGPT5(customScenario);
    console.log("Custom agentic scenario:", result7.text);

    // Example 8: Using predefined templates
    const result8 = await executeGPT5({
      prompt: GPT5_PROMPT_TEMPLATES.coding[0]
        .replace("{language}", "Python")
        .replace("{task}", "implement a quicksort algorithm"),
      reasoning_effort: 'minimal',
      verbosity: 'high'
    });
    console.log("Template coding solution:", result8.text);

    // Example 9: Prediction usage for long-running tasks
    const prediction = await executeGPT5Prediction({
      prompt: "Create a comprehensive analysis of artificial intelligence trends",
      reasoning_effort: 'high',
      verbosity: 'high',
      max_completion_tokens: 6000
    });

    console.log("Prediction ID:", prediction.id);

    // Check status
    const status = await checkGPT5Status(prediction.id);
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
 * @param hasImages - Whether the input includes images
 * @returns Estimated cost in USD
 */
export function estimateProcessingCost(
  inputTokens: number, 
  outputTokens: number, 
  hasImages: boolean = false
): number {
  const inputCostPerMillion = 1.25;
  const outputCostPerMillion = 10.00;
  
  const inputCost = (inputTokens / 1000000) * inputCostPerMillion;
  const outputCost = (outputTokens / 1000000) * outputCostPerMillion;
  
  // Note: Image processing costs are included in input tokens
  return inputCost + outputCost;
}

/**
 * Utility function to validate prompt format for GPT-5
 * 
 * @param prompt - The prompt string to validate
 * @returns Validation result with suggestions
 */
export function validateGPT5Prompt(prompt: string): { 
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
  const hasClearWords = /(write|create|analyze|explain|describe|solve|implement|design|develop|help|provide|think)/i.test(prompt);
  
  if (!hasClearWords) {
    suggestions.push("Consider using action words like 'write', 'analyze', 'explain', or 'think' for better results");
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
    suggestions.push("Consider using 'high' reasoning effort for better step-by-step analysis");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedPrompt
  };
}

/**
 * Utility function to get optimal settings for GPT-5 scenario type
 * 
 * @param scenarioType - Type of scenario
 * @returns Recommended settings
 */
export function getOptimalGPT5Settings(scenarioType: 'reasoning' | 'coding' | 'creative_writing' | 'analysis' | 'conversation' | 'multimodal' | 'agentic' | 'frontend' | 'research'): {
  reasoning_effort: 'minimal' | 'low' | 'medium' | 'high';
  verbosity: 'low' | 'medium' | 'high';
  max_completion_tokens: number;
  system_prompt_suggestions: string[];
} {
  const settingsMap = {
    reasoning: { 
      reasoning_effort: 'high' as const,
      verbosity: 'high' as const,
      max_completion_tokens: 4000,
      system_prompt_suggestions: ["You are a logical reasoning expert.", "You are an analytical thinker who breaks down problems systematically."] 
    },
    coding: { 
      reasoning_effort: 'minimal' as const,
      verbosity: 'high' as const,
      max_completion_tokens: 3000,
      system_prompt_suggestions: ["You are an expert software developer.", "You are a coding expert who writes clean, efficient code."] 
    },
    creative_writing: { 
      reasoning_effort: 'medium' as const,
      verbosity: 'high' as const,
      max_completion_tokens: 4000,
      system_prompt_suggestions: ["You are a creative writer.", "You are a skilled storyteller who creates engaging narratives."] 
    },
    analysis: { 
      reasoning_effort: 'medium' as const,
      verbosity: 'high' as const,
      max_completion_tokens: 3000,
      system_prompt_suggestions: ["You are a research analyst.", "You are an expert at providing thorough analysis."] 
    },
    conversation: { 
      reasoning_effort: 'minimal' as const,
      verbosity: 'medium' as const,
      max_completion_tokens: 2000,
      system_prompt_suggestions: ["You are a helpful, knowledgeable assistant.", "You are an engaging conversationalist."] 
    },
    multimodal: { 
      reasoning_effort: 'medium' as const,
      verbosity: 'high' as const,
      max_completion_tokens: 2000,
      system_prompt_suggestions: ["You are an expert at analyzing images.", "You are a visual analysis expert who provides detailed descriptions."] 
    },
    agentic: { 
      reasoning_effort: 'high' as const,
      verbosity: 'high' as const,
      max_completion_tokens: 5000,
      system_prompt_suggestions: ["You are a project planning expert.", "You are a strategic thinker who breaks down complex tasks."] 
    },
    frontend: { 
      reasoning_effort: 'minimal' as const,
      verbosity: 'high' as const,
      max_completion_tokens: 4000,
      system_prompt_suggestions: ["You are a frontend development expert.", "You are skilled in modern UI/UX practices and frameworks."] 
    },
    research: { 
      reasoning_effort: 'high' as const,
      verbosity: 'high' as const,
      max_completion_tokens: 5000,
      system_prompt_suggestions: ["You are a research analyst.", "You are an expert researcher who provides thorough analysis."] 
    }
  };

  return settingsMap[scenarioType];
}

/**
 * Utility function to enhance prompt for better GPT-5 results
 * 
 * @param prompt - Base prompt to enhance
 * @param enhancements - Enhancement options
 * @returns Enhanced prompt
 */
export function enhancePromptForGPT5(
  prompt: string, 
  enhancements: {
    addReasoning?: boolean;
    addSpecificity?: boolean;
    addContext?: boolean;
    addDetail?: boolean;
  } = {}
): string {
  let enhancedPrompt = prompt.trim();

  // Add reasoning instruction
  if (enhancements.addReasoning) {
    if (!/(step by step|think|reason|analyze)/i.test(enhancedPrompt)) {
      enhancedPrompt = `Think step by step and ${enhancedPrompt.toLowerCase()}`;
    }
  }

  // Add specificity
  if (enhancements.addSpecificity) {
    if (!/(write|create|analyze|explain|describe|solve|implement|design|develop|help|provide)/i.test(enhancedPrompt)) {
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
 * Utility function to create batch GPT-5 analysis
 * 
 * @param promptsArray - Array of prompts
 * @param scenarioTypesArray - Array of scenario types
 * @param maxTokensArray - Array of max token values
 * @returns Array of GPT-5 inputs
 */
export function createBatchGPT5Analysis(
  promptsArray: string[], 
  scenarioTypesArray: ('reasoning' | 'coding' | 'creative_writing' | 'analysis' | 'conversation' | 'multimodal' | 'agentic' | 'frontend' | 'research')[],
  maxTokensArray: number[]
): GPT5Input[] {
  if (promptsArray.length !== scenarioTypesArray.length || 
      promptsArray.length !== maxTokensArray.length) {
    throw new Error("All arrays must have the same length");
  }

  return promptsArray.map((prompt, index) => {
    const settings = getOptimalGPT5Settings(scenarioTypesArray[index]);
    return {
      prompt,
      reasoning_effort: settings.reasoning_effort,
      verbosity: settings.verbosity,
      max_completion_tokens: maxTokensArray[index] || settings.max_completion_tokens
    };
  });
}

/**
 * Supported scenario types
 */
export const GPT5_SCENARIOS = {
  "reasoning": "Complex reasoning and problem solving",
  "coding": "Programming and software development",
  "creative_writing": "Creative content generation",
  "analysis": "Data analysis and evaluation",
  "conversation": "Conversational interactions",
  "multimodal": "Image and text analysis",
  "agentic": "Agentic workflows and planning",
  "frontend": "Frontend development with modern frameworks",
  "research": "Research and analysis tasks"
} as const;

/**
 * GPT-5 capability descriptions
 */
export const GPT5_CAPABILITIES = {
  "advanced_reasoning": "Most capable model for complex reasoning tasks",
  "code_generation": "Excellent code generation with testing and validation support",
  "instruction_following": "Advanced instruction following capabilities",
  "tool_use": "Advanced tool use capabilities for agentic workflows",
  "reasoning_effort_control": "Control how deeply the model thinks before responding",
  "verbosity_control": "Control response length and detail level",
  "multimodal": "Text and image understanding capabilities",
  "reasoning_carryover": "Retains and reuses reasoning across turns for improved performance",
  "frontend_support": "Supports modern frameworks like Tailwind, shadcn/ui, Radix Themes",
  "conversation_continuity": "Improved performance through reasoning carryover",
  "custom_tools": "Define tools with freeform text input",
  "safety_controls": "Built-in safety and predictability controls"
} as const;

/**
 * Model variants
 */
export const GPT5_VARIANTS = {
  "gpt-5": "Best for complex, multi-step tasks and rich world knowledge",
  "gpt-5-mini": "Balanced speed and cost, ideal for chat and medium-difficulty reasoning",
  "gpt-5-nano": "Lightweight, great for fast, simple tasks like classification"
} as const;

/**
 * Hardware requirements
 */
export const GPT5_HARDWARE = {
  "gpu": "Nvidia L40S GPU",
  "memory": "High memory requirements for advanced reasoning",
  "processing": "Optimized for both fast and deep reasoning"
} as const;

/**
 * Pricing information
 */
export const GPT5_PRICING = {
  "input_cost_per_million": 1.25,
  "output_cost_per_million": 10.00,
  "currency": "USD",
  "billing_unit": "per token"
} as const;

/**
 * GPT-5 tips
 */
export const GPT5_TIPS = {
  "prompt_creation": "Use clear, specific prompts for best results",
  "reasoning_effort": "Use minimal for coding, medium for balanced tasks, high for complex reasoning",
  "verbosity_control": "Use low for concise answers, medium for balanced responses, high for detailed explanations",
  "tool_usage": "Define custom tools clearly and use preambles for transparency",
  "code_generation": "Require testing and validation for generated code",
  "frontend_development": "Use detailed prompts for better UI/UX and integration",
  "agentic_tasks": "Break down complex tasks and persist until fully resolved",
  "reasoning_carryover": "Take advantage of reasoning carryover for conversation continuity",
  "multimodal": "Use medium reasoning effort for image analysis tasks",
  "conversation_mode": "Use messages array for better conversation continuity"
} as const;

export default executeGPT5;
