import Replicate from "replicate";

export interface DeepSeekR1Input {
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  top_p?: number;
}

export interface DeepSeekR1Output {
  text: string;
  reasoning?: string;
}

export interface DeepSeekR1Options {
  webhookUrl?: string;
  webhookEventsFilter?: string[];
  onProgress?: (progress: any) => void;
}

/**
 * DeepSeek-R1 Executor
 * 
 * A reasoning model trained with reinforcement learning, on par with OpenAI o1. 
 * Features advanced chain-of-thought reasoning, self-verification, and reflection 
 * capabilities. Achieves performance comparable to OpenAI-o1 across math, code, 
 * and reasoning tasks.
 * 
 * @param input - The reasoning input parameters
 * @param options - Additional execution options
 * @returns Promise with the reasoning response
 */
export async function executeDeepSeekR1(
  input: DeepSeekR1Input,
  options: DeepSeekR1Options = {}
): Promise<DeepSeekR1Output> {
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
    if (input.max_tokens && (input.max_tokens < 1 || input.max_tokens > 20480)) {
      throw new Error("max_tokens must be between 1 and 20480");
    }

    if (input.temperature && (input.temperature < 0 || input.temperature > 1)) {
      throw new Error("temperature must be between 0 and 1");
    }

    if (input.presence_penalty && (input.presence_penalty < 0 || input.presence_penalty > 2)) {
      throw new Error("presence_penalty must be between 0 and 2");
    }

    if (input.frequency_penalty && (input.frequency_penalty < 0 || input.frequency_penalty > 2)) {
      throw new Error("frequency_penalty must be between 0 and 2");
    }

    if (input.top_p && (input.top_p < 0 || input.top_p > 1)) {
      throw new Error("top_p must be between 0 and 1");
    }

    // Prepare the request payload
    const payload: any = {
      prompt: input.prompt.trim(),
    };

    // Add optional inputs with defaults
    if (input.max_tokens !== undefined) {
      payload.max_tokens = input.max_tokens;
    }

    if (input.temperature !== undefined) {
      payload.temperature = input.temperature;
    }

    if (input.presence_penalty !== undefined) {
      payload.presence_penalty = input.presence_penalty;
    }

    if (input.frequency_penalty !== undefined) {
      payload.frequency_penalty = input.frequency_penalty;
    }

    if (input.top_p !== undefined) {
      payload.top_p = input.top_p;
    }

    // Execute the model
    const output = await replicate.run(
      "deepseek-ai/deepseek-r1",
      {
        input: payload,
        webhook: options.webhookUrl,
        webhook_events_filter: options.webhookEventsFilter,
      }
    );

    // Process the output (it comes as an array of strings)
    const responseText = Array.isArray(output) ? output.join("") : String(output);
    
    // Extract reasoning if present (look for <think> tags)
    const reasoningMatch = responseText.match(/<think>([\s\S]*?)<\/think>/);
    const reasoning = reasoningMatch ? reasoningMatch[1].trim() : undefined;
    
    // Clean the main response text
    const cleanText = responseText.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

    return {
      text: cleanText,
      reasoning: reasoning
    };

  } catch (error) {
    console.error("DeepSeek-R1 execution failed:", error);
    throw new Error(`DeepSeek-R1 execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute DeepSeek-R1 with prediction management for long-running tasks
 * 
 * @param input - The reasoning input parameters
 * @param options - Additional execution options
 * @returns Promise with prediction object for tracking
 */
export async function executeDeepSeekR1Prediction(
  input: DeepSeekR1Input,
  options: DeepSeekR1Options = {}
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

    if (input.max_tokens && (input.max_tokens < 1 || input.max_tokens > 20480)) {
      throw new Error("max_tokens must be between 1 and 20480");
    }

    if (input.temperature && (input.temperature < 0 || input.temperature > 1)) {
      throw new Error("temperature must be between 0 and 1");
    }

    if (input.presence_penalty && (input.presence_penalty < 0 || input.presence_penalty > 2)) {
      throw new Error("presence_penalty must be between 0 and 2");
    }

    if (input.frequency_penalty && (input.frequency_penalty < 0 || input.frequency_penalty > 2)) {
      throw new Error("frequency_penalty must be between 0 and 2");
    }

    if (input.top_p && (input.top_p < 0 || input.top_p > 1)) {
      throw new Error("top_p must be between 0 and 1");
    }

    // Prepare the request payload
    const payload: any = {
      prompt: input.prompt.trim(),
    };

    // Add optional inputs
    if (input.max_tokens !== undefined) {
      payload.max_tokens = input.max_tokens;
    }

    if (input.temperature !== undefined) {
      payload.temperature = input.temperature;
    }

    if (input.presence_penalty !== undefined) {
      payload.presence_penalty = input.presence_penalty;
    }

    if (input.frequency_penalty !== undefined) {
      payload.frequency_penalty = input.frequency_penalty;
    }

    if (input.top_p !== undefined) {
      payload.top_p = input.top_p;
    }

    // Create prediction
    const prediction = await replicate.predictions.create({
      model: "deepseek-ai/deepseek-r1",
      input: payload,
      webhook: options.webhookUrl,
      webhook_events_filter: options.webhookEventsFilter,
    });

    return prediction;

  } catch (error) {
    console.error("DeepSeek-R1 prediction creation failed:", error);
    throw new Error(`DeepSeek-R1 prediction creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a DeepSeek-R1 prediction
 * 
 * @param predictionId - The prediction ID from prediction creation
 * @returns Promise with prediction status
 */
export async function checkDeepSeekR1Status(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.get(predictionId);
    return prediction;

  } catch (error) {
    console.error("DeepSeek-R1 status check failed:", error);
    throw new Error(`DeepSeek-R1 status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Cancel a running DeepSeek-R1 prediction
 * 
 * @param predictionId - The prediction ID to cancel
 * @returns Promise with cancellation result
 */
export async function cancelDeepSeekR1Prediction(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.cancel(predictionId);
    return prediction;

  } catch (error) {
    console.error("DeepSeek-R1 prediction cancellation failed:", error);
    throw new Error(`DeepSeek-R1 prediction cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create reasoning scenarios
 * 
 * @param type - Type of reasoning scenario to create
 * @param customPrompt - Custom prompt (optional)
 * @param customOptions - Custom options (optional)
 * @returns DeepSeek-R1 input configuration
 */
export function createReasoningScenario(
  type: 'mathematical' | 'coding' | 'scientific' | 'logical' | 'strategic' | 'educational' | 'research' | 'problem_solving' | 'custom',
  customPrompt?: string,
  customOptions?: Partial<DeepSeekR1Input>
): DeepSeekR1Input {
  const scenarioTemplates = {
    mathematical: {
      prompt: customPrompt || "Solve this mathematical problem step by step: If a train leaves station A at 60 mph and another leaves station B at 40 mph, and they are 200 miles apart, when will they meet?",
      temperature: 0.1,
      max_tokens: 2000
    },
    coding: {
      prompt: customPrompt || "Write a Python function to find the longest common subsequence between two strings. Explain your approach and provide test cases.",
      temperature: 0.1,
      max_tokens: 3000
    },
    scientific: {
      prompt: customPrompt || "Explain the process of photosynthesis in detail, including the chemical equations and the role of each component.",
      temperature: 0.1,
      max_tokens: 2500
    },
    logical: {
      prompt: customPrompt || "Analyze this logical puzzle: Three people are in a room. One always tells the truth, one always lies, and one sometimes tells the truth and sometimes lies. How can you determine who is who by asking only one question?",
      temperature: 0.1,
      max_tokens: 2000
    },
    strategic: {
      prompt: customPrompt || "Develop a strategic plan for launching a new product in a competitive market. Consider market analysis, positioning, pricing, and marketing strategies.",
      temperature: 0.2,
      max_tokens: 3000
    },
    educational: {
      prompt: customPrompt || "Create a comprehensive lesson plan for teaching basic algebra to middle school students. Include learning objectives, activities, and assessment methods.",
      temperature: 0.1,
      max_tokens: 2500
    },
    research: {
      prompt: customPrompt || "Analyze the current state of artificial intelligence research and identify the most promising areas for future development.",
      temperature: 0.1,
      max_tokens: 3000
    },
    problem_solving: {
      prompt: customPrompt || "A company is experiencing declining sales. Analyze the potential causes and propose a systematic approach to identify and address the root problems.",
      temperature: 0.1,
      max_tokens: 2500
    },
    custom: {
      prompt: customPrompt || "Analyze this complex problem and provide a detailed solution with reasoning.",
      temperature: 0.1,
      max_tokens: 2000
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
 * Predefined prompt templates for different reasoning scenarios
 */
export const REASONING_PROMPT_TEMPLATES = {
  "mathematical": [
    "Solve this mathematical problem step by step: {problem}",
    "Calculate the following and show your work: {calculation}",
    "Prove this mathematical statement: {statement}",
    "Find the solution to this equation: {equation}"
  ],
  "coding": [
    "Write a {language} function to {task}. Explain your approach and provide test cases.",
    "Debug this code and explain what's wrong: {code}",
    "Optimize this algorithm for better performance: {algorithm}",
    "Design a data structure to efficiently handle {requirement}"
  ],
  "scientific": [
    "Explain the {phenomenon} in detail, including the underlying mechanisms.",
    "Analyze this scientific experiment and explain the results: {experiment}",
    "Compare and contrast {concept1} and {concept2} in terms of {aspect}",
    "Describe the process of {process} and its significance in {field}"
  ],
  "logical": [
    "Analyze this logical puzzle and provide a step-by-step solution: {puzzle}",
    "Determine the validity of this argument: {argument}",
    "Solve this logic problem using systematic reasoning: {problem}",
    "Identify the logical fallacy in this statement: {statement}"
  ],
  "strategic": [
    "Develop a strategic plan for {objective}. Consider {factors}.",
    "Analyze the competitive landscape for {industry} and recommend strategies.",
    "Create a business plan for {venture} including market analysis and financial projections.",
    "Design a marketing strategy for {product} targeting {audience}"
  ],
  "educational": [
    "Create a lesson plan for teaching {subject} to {audience}. Include learning objectives and activities.",
    "Explain {concept} in a way that {audience} can understand, using examples and analogies.",
    "Design an assessment to evaluate understanding of {topic}.",
    "Develop a curriculum for {subject} that covers {duration} with clear learning outcomes."
  ],
  "research": [
    "Analyze the current state of {field} research and identify promising areas for future development.",
    "Review the literature on {topic} and synthesize the key findings.",
    "Propose a research methodology for investigating {question}.",
    "Evaluate the strengths and weaknesses of different approaches to {problem}"
  ],
  "problem_solving": [
    "Analyze this problem systematically and propose a solution: {problem}",
    "Identify the root causes of {issue} and develop a comprehensive solution.",
    "Break down this complex problem into manageable components: {complex_problem}",
    "Design a process to address {challenge} considering all stakeholders."
  ]
} as const;

/**
 * Example usage of the DeepSeek-R1 executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic reasoning
    const result1 = await executeDeepSeekR1({
      prompt: "What is the speed of an unladen swallow?",
      temperature: 0.1,
      max_tokens: 1000
    });

    console.log("Reasoning response:", result1.text);
    if (result1.reasoning) {
      console.log("Internal reasoning:", result1.reasoning);
    }

    // Example 2: Mathematical problem
    const result2 = await executeDeepSeekR1({
      prompt: "Solve this step by step: If a train leaves station A at 60 mph and another leaves station B at 40 mph, and they are 200 miles apart, when will they meet?",
      temperature: 0.1,
      max_tokens: 2000
    });

    console.log("Mathematical solution:", result2.text);

    // Example 3: Coding problem
    const result3 = await executeDeepSeekR1({
      prompt: "Write a Python function to find the longest common subsequence between two strings. Explain your approach.",
      temperature: 0.1,
      max_tokens: 3000
    });

    console.log("Coding solution:", result3.text);

    // Example 4: Using helper function for mathematical reasoning
    const mathScenario = createReasoningScenario('mathematical');
    const result4 = await executeDeepSeekR1(mathScenario);
    console.log("Mathematical scenario:", result4.text);

    // Example 5: Custom reasoning scenario
    const customScenario = createReasoningScenario(
      'custom',
      "Analyze the pros and cons of renewable energy sources",
      {
        temperature: 0.2,
        max_tokens: 2500
      }
    );
    const result5 = await executeDeepSeekR1(customScenario);
    console.log("Custom analysis:", result5.text);

    // Example 6: Using predefined templates
    const result6 = await executeDeepSeekR1({
      prompt: REASONING_PROMPT_TEMPLATES.coding[0]
        .replace("{language}", "Python")
        .replace("{task}", "implement a binary search algorithm"),
      temperature: 0.1,
      max_tokens: 3000
    });
    console.log("Template coding solution:", result6.text);

    // Example 7: Prediction usage for long-running tasks
    const prediction = await executeDeepSeekR1Prediction({
      prompt: "Analyze the entire history of artificial intelligence and predict future developments",
      temperature: 0.1,
      max_tokens: 5000
    });

    console.log("Prediction ID:", prediction.id);

    // Check status
    const status = await checkDeepSeekR1Status(prediction.id);
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
 * @returns Estimated cost in USD
 */
export function estimateProcessingCost(inputTokens: number, outputTokens: number): number {
  const inputCostPerMillion = 3.75;
  const outputCostPerMillion = 10.00;
  
  const inputCost = (inputTokens / 1000000) * inputCostPerMillion;
  const outputCost = (outputTokens / 1000000) * outputCostPerMillion;
  
  return inputCost + outputCost;
}

/**
 * Utility function to validate prompt format for reasoning
 * 
 * @param prompt - The prompt string to validate
 * @returns Validation result with suggestions
 */
export function validateReasoningPrompt(prompt: string): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedPrompt: string; 
} {
  const suggestions: string[] = [];
  
  // Clean and format prompt
  const formattedPrompt = prompt.trim();

  // Check for common issues
  if (prompt.length < 10) {
    suggestions.push("Prompt is too short, consider adding more specific instructions for better reasoning");
  }

  // Check for reasoning indicators
  const hasReasoningWords = /(solve|analyze|explain|calculate|prove|design|develop|create|evaluate|compare|contrast|step by step|reasoning|logic)/i.test(prompt);
  
  if (!hasReasoningWords) {
    suggestions.push("Consider using reasoning-related words like 'solve', 'analyze', 'explain', or 'step by step' for better results");
  }
  
  if (prompt.length < 20) {
    suggestions.push("Consider making your prompt more specific and detailed for better reasoning results");
  }

  // Check for very long prompts
  if (prompt.length > 2000) {
    suggestions.push("Consider shortening your prompt for better processing");
  }

  // Check for question format
  const hasQuestionMark = /\?/.test(prompt);
  if (!hasQuestionMark && !hasReasoningWords) {
    suggestions.push("Consider framing your prompt as a question or using action words for better reasoning");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedPrompt
  };
}

/**
 * Utility function to get optimal settings for reasoning type
 * 
 * @param reasoningType - Type of reasoning task
 * @returns Recommended settings
 */
export function getOptimalReasoningSettings(reasoningType: 'mathematical' | 'coding' | 'scientific' | 'logical' | 'strategic' | 'educational' | 'research' | 'problem_solving'): {
  temperature: number;
  max_tokens: number;
  presence_penalty: number;
  frequency_penalty: number;
  top_p: number;
  prompt_suggestions: string[];
} {
  const settingsMap = {
    mathematical: { 
      temperature: 0.1, 
      max_tokens: 2000,
      presence_penalty: 0,
      frequency_penalty: 0,
      top_p: 1,
      prompt_suggestions: ["Solve this mathematical problem step by step:", "Calculate the following and show your work:", "Prove this mathematical statement:"] 
    },
    coding: { 
      temperature: 0.1, 
      max_tokens: 3000,
      presence_penalty: 0,
      frequency_penalty: 0,
      top_p: 1,
      prompt_suggestions: ["Write a function to", "Debug this code and explain:", "Optimize this algorithm:"] 
    },
    scientific: { 
      temperature: 0.1, 
      max_tokens: 2500,
      presence_penalty: 0,
      frequency_penalty: 0,
      top_p: 1,
      prompt_suggestions: ["Explain the scientific process of:", "Analyze this experiment:", "Compare and contrast:"] 
    },
    logical: { 
      temperature: 0.1, 
      max_tokens: 2000,
      presence_penalty: 0,
      frequency_penalty: 0,
      top_p: 1,
      prompt_suggestions: ["Analyze this logical puzzle:", "Determine the validity of:", "Solve this logic problem:"] 
    },
    strategic: { 
      temperature: 0.2, 
      max_tokens: 3000,
      presence_penalty: 0,
      frequency_penalty: 0,
      top_p: 1,
      prompt_suggestions: ["Develop a strategic plan for:", "Analyze the competitive landscape:", "Create a business plan for:"] 
    },
    educational: { 
      temperature: 0.1, 
      max_tokens: 2500,
      presence_penalty: 0,
      frequency_penalty: 0,
      top_p: 1,
      prompt_suggestions: ["Create a lesson plan for:", "Explain this concept:", "Design an assessment for:"] 
    },
    research: { 
      temperature: 0.1, 
      max_tokens: 3000,
      presence_penalty: 0,
      frequency_penalty: 0,
      top_p: 1,
      prompt_suggestions: ["Analyze the current state of:", "Review the literature on:", "Propose a research methodology for:"] 
    },
    problem_solving: { 
      temperature: 0.1, 
      max_tokens: 2500,
      presence_penalty: 0,
      frequency_penalty: 0,
      top_p: 1,
      prompt_suggestions: ["Analyze this problem systematically:", "Identify the root causes of:", "Break down this complex problem:"] 
    }
  };

  return settingsMap[reasoningType];
}

/**
 * Utility function to enhance prompt for better reasoning
 * 
 * @param prompt - Base prompt to enhance
 * @param enhancements - Enhancement options
 * @returns Enhanced prompt
 */
export function enhancePromptForReasoning(
  prompt: string, 
  enhancements: {
    addStepByStep?: boolean;
    addContext?: boolean;
    addDetail?: boolean;
    addExamples?: boolean;
  } = {}
): string {
  let enhancedPrompt = prompt.trim();

  // Add step-by-step instruction
  if (enhancements.addStepByStep) {
    if (!/(step by step|step-by-step|systematically|methodically)/i.test(enhancedPrompt)) {
      enhancedPrompt = `Please solve this step by step: ${enhancedPrompt}`;
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
      enhancedPrompt = `Please provide a detailed analysis of ${enhancedPrompt.toLowerCase()}`;
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
 * Utility function to generate random reasoning prompt
 * 
 * @param scenario - Reasoning scenario
 * @returns Random prompt from the scenario
 */
export function generateRandomReasoningPrompt(scenario: keyof typeof REASONING_PROMPT_TEMPLATES): string {
  const prompts = REASONING_PROMPT_TEMPLATES[scenario];
  const randomIndex = Math.floor(Math.random() * prompts.length);
  return prompts[randomIndex];
}

/**
 * Utility function to create batch reasoning analysis
 * 
 * @param promptsArray - Array of prompts
 * @param reasoningTypesArray - Array of reasoning types
 * @param temperaturesArray - Array of temperature values
 * @returns Array of DeepSeek-R1 inputs
 */
export function createBatchReasoningAnalysis(
  promptsArray: string[], 
  reasoningTypesArray: ('mathematical' | 'coding' | 'scientific' | 'logical' | 'strategic' | 'educational' | 'research' | 'problem_solving')[],
  temperaturesArray: number[]
): DeepSeekR1Input[] {
  if (promptsArray.length !== reasoningTypesArray.length || 
      promptsArray.length !== temperaturesArray.length) {
    throw new Error("All arrays must have the same length");
  }

  return promptsArray.map((prompt, index) => {
    const settings = getOptimalReasoningSettings(reasoningTypesArray[index]);
    return {
      prompt,
      temperature: temperaturesArray[index] || settings.temperature,
      max_tokens: settings.max_tokens,
      presence_penalty: settings.presence_penalty,
      frequency_penalty: settings.frequency_penalty,
      top_p: settings.top_p
    };
  });
}

/**
 * Supported reasoning types
 */
export const REASONING_TYPES = {
  "mathematical": "Mathematical problem solving and calculations",
  "coding": "Programming and software development tasks",
  "scientific": "Scientific analysis and explanations",
  "logical": "Logical reasoning and puzzle solving",
  "strategic": "Strategic planning and business analysis",
  "educational": "Educational content creation and lesson planning",
  "research": "Research analysis and methodology",
  "problem_solving": "General problem solving and analysis"
} as const;

/**
 * Reasoning capability descriptions
 */
export const REASONING_CAPABILITIES = {
  "chain_of_thought": "Advanced chain-of-thought reasoning with structured thinking",
  "self_verification": "Built-in self-verification and error checking",
  "reflection": "Model can reflect on its own reasoning process",
  "mathematical_reasoning": "Advanced mathematical problem solving",
  "coding_capabilities": "Code generation, debugging, and analysis",
  "long_form_reasoning": "Support for extended reasoning chains",
  "structured_thinking": "Organized and logical thought processes",
  "reinforcement_learning": "Trained with RL for reasoning optimization"
} as const;

/**
 * Common reasoning scenarios
 */
export const REASONING_SCENARIOS = {
  "mathematical": "Mathematical problem solving and calculations",
  "coding": "Programming and software development",
  "scientific": "Scientific analysis and research",
  "logical": "Logical reasoning and puzzles",
  "strategic": "Strategic planning and business",
  "educational": "Educational content and teaching",
  "research": "Research analysis and methodology",
  "problem_solving": "General problem solving"
} as const;

/**
 * Hardware requirements
 */
export const HARDWARE_REQUIREMENTS = {
  "gpu": "Nvidia L40S GPU",
  "memory": "High memory requirements for reasoning tasks",
  "processing": "Optimized for complex reasoning computations"
} as const;

/**
 * Pricing information
 */
export const PRICING_INFO = {
  "input_cost_per_million": 3.75,
  "output_cost_per_million": 10.00,
  "currency": "USD",
  "billing_unit": "per token"
} as const;

/**
 * Reasoning tips
 */
export const REASONING_TIPS = {
  "prompt_creation": "Use clear, specific prompts for better reasoning results",
  "step_by_step": "Request step-by-step solutions for complex problems",
  "temperature_settings": "Use lower temperature (0.1) for consistent reasoning",
  "token_limits": "Set appropriate max_tokens for the complexity of the task",
  "reasoning_indicators": "Use words like 'solve', 'analyze', 'explain' for better results",
  "context_provision": "Provide sufficient context for complex reasoning tasks",
  "verification": "The model includes self-verification capabilities",
  "reflection": "The model can reflect on its own reasoning process"
} as const;

export default executeDeepSeekR1;
