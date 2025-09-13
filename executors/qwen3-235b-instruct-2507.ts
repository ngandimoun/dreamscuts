import Replicate from "replicate";

export interface Qwen3235BInput {
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  top_p?: number;
}

export interface Qwen3235BOutput {
  text: string;
}

export interface Qwen3235BOptions {
  webhookUrl?: string;
  webhookEventsFilter?: string[];
  onProgress?: (progress: any) => void;
}

/**
 * Qwen3-235B-A22B-Instruct-2507 Executor
 * 
 * Updated Qwen3 model for instruction following with significant improvements in 
 * general capabilities, including instruction following, logical reasoning, text 
 * comprehension, mathematics, science, coding and tool usage. Features 235B total 
 * parameters with 22B activated, FP8 quantization, and enhanced 256K long-context 
 * understanding.
 * 
 * @param input - The input parameters
 * @param options - Additional execution options
 * @returns Promise with the response
 */
export async function executeQwen3235B(
  input: Qwen3235BInput,
  options: Qwen3235BOptions = {}
): Promise<Qwen3235BOutput> {
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
    if (input.max_tokens && (input.max_tokens < 1 || input.max_tokens > 16384)) {
      throw new Error("max_tokens must be between 1 and 16384");
    }

    if (input.temperature && (input.temperature < 0 || input.temperature > 2)) {
      throw new Error("temperature must be between 0 and 2");
    }

    if (input.presence_penalty && (input.presence_penalty < -2 || input.presence_penalty > 2)) {
      throw new Error("presence_penalty must be between -2 and 2");
    }

    if (input.frequency_penalty && (input.frequency_penalty < -2 || input.frequency_penalty > 2)) {
      throw new Error("frequency_penalty must be between -2 and 2");
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
      "qwen/qwen3-235b-a22b-instruct-2507",
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
    console.error("Qwen3-235B execution failed:", error);
    throw new Error(`Qwen3-235B execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Qwen3-235B with prediction management for long-running tasks
 * 
 * @param input - The input parameters
 * @param options - Additional execution options
 * @returns Promise with prediction object for tracking
 */
export async function executeQwen3235BPrediction(
  input: Qwen3235BInput,
  options: Qwen3235BOptions = {}
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

    if (input.max_tokens && (input.max_tokens < 1 || input.max_tokens > 16384)) {
      throw new Error("max_tokens must be between 1 and 16384");
    }

    if (input.temperature && (input.temperature < 0 || input.temperature > 2)) {
      throw new Error("temperature must be between 0 and 2");
    }

    if (input.presence_penalty && (input.presence_penalty < -2 || input.presence_penalty > 2)) {
      throw new Error("presence_penalty must be between -2 and 2");
    }

    if (input.frequency_penalty && (input.frequency_penalty < -2 || input.frequency_penalty > 2)) {
      throw new Error("frequency_penalty must be between -2 and 2");
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
      model: "qwen/qwen3-235b-a22b-instruct-2507",
      input: payload,
      webhook: options.webhookUrl,
      webhook_events_filter: options.webhookEventsFilter,
    });

    return prediction;

  } catch (error) {
    console.error("Qwen3-235B prediction creation failed:", error);
    throw new Error(`Qwen3-235B prediction creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a Qwen3-235B prediction
 * 
 * @param predictionId - The prediction ID from prediction creation
 * @returns Promise with prediction status
 */
export async function checkQwen3235BStatus(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.get(predictionId);
    return prediction;

  } catch (error) {
    console.error("Qwen3-235B status check failed:", error);
    throw new Error(`Qwen3-235B status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Cancel a running Qwen3-235B prediction
 * 
 * @param predictionId - The prediction ID to cancel
 * @returns Promise with cancellation result
 */
export async function cancelQwen3235BPrediction(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.cancel(predictionId);
    return prediction;

  } catch (error) {
    console.error("Qwen3-235B prediction cancellation failed:", error);
    throw new Error(`Qwen3-235B prediction cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create Qwen3-235B scenarios
 * 
 * @param type - Type of scenario to create
 * @param customPrompt - Custom prompt (optional)
 * @param customOptions - Custom options (optional)
 * @returns Qwen3-235B input configuration
 */
export function createQwen3235BScenario(
  type: 'instruction_following' | 'reasoning' | 'coding' | 'mathematics' | 'science' | 'creative_writing' | 'analysis' | 'multilingual' | 'agentic' | 'custom',
  customPrompt?: string,
  customOptions?: Partial<Qwen3235BInput>
): Qwen3235BInput {
  const scenarioTemplates = {
    instruction_following: {
      prompt: customPrompt || "Create a detailed step-by-step guide for learning a new programming language",
      max_tokens: 2000,
      temperature: 0.1,
      top_p: 0.8
    },
    reasoning: {
      prompt: customPrompt || "Analyze this complex problem and provide a logical step-by-step solution",
      max_tokens: 1500,
      temperature: 0.1,
      top_p: 0.8
    },
    coding: {
      prompt: customPrompt || "Write a Python function to implement a binary search algorithm with proper error handling and test cases",
      max_tokens: 2000,
      temperature: 0.1,
      top_p: 0.8
    },
    mathematics: {
      prompt: customPrompt || "Solve this mathematical problem step by step: Calculate the derivative of f(x) = x³ + 2x² - 5x + 3",
      max_tokens: 1500,
      temperature: 0.1,
      top_p: 0.8
    },
    science: {
      prompt: customPrompt || "Explain the process of photosynthesis in detail, including the chemical equations and the role of each component",
      max_tokens: 2000,
      temperature: 0.1,
      top_p: 0.8
    },
    creative_writing: {
      prompt: customPrompt || "Write a creative short story about a character who discovers they can see into the future",
      max_tokens: 2500,
      temperature: 0.7,
      top_p: 0.9
    },
    analysis: {
      prompt: customPrompt || "Analyze the pros and cons of renewable energy sources and provide a comprehensive assessment",
      max_tokens: 2000,
      temperature: 0.1,
      top_p: 0.8
    },
    multilingual: {
      prompt: customPrompt || "Translate this text to Chinese and explain the cultural nuances: 'The early bird catches the worm'",
      max_tokens: 1500,
      temperature: 0.1,
      top_p: 0.8
    },
    agentic: {
      prompt: customPrompt || "Help me plan a trip to Japan. Provide a detailed itinerary including places to visit, transportation, and cultural tips",
      max_tokens: 3000,
      temperature: 0.1,
      top_p: 0.8
    },
    custom: {
      prompt: customPrompt || "Analyze this request and provide a comprehensive response",
      max_tokens: 1500,
      temperature: 0.1,
      top_p: 0.8
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
 * Predefined prompt templates for different Qwen3-235B scenarios
 */
export const QWEN3_235B_PROMPT_TEMPLATES = {
  "instruction_following": [
    "Create a detailed step-by-step guide for {task}",
    "Provide comprehensive instructions for {process}",
    "Write a tutorial on how to {action}",
    "Explain how to {task} in detail",
    "Create a guide for {subject} including {requirements}"
  ],
  "reasoning": [
    "Analyze this complex problem and provide a logical step-by-step solution: {problem}",
    "Solve this reasoning puzzle: {puzzle}",
    "Determine the validity of this argument: {argument}",
    "Identify the root cause of {issue} and propose solutions",
    "Compare and contrast {concept1} and {concept2} in terms of {aspect}"
  ],
  "coding": [
    "Write a {language} function to {task} with proper error handling and test cases",
    "Debug this code and explain what's wrong: {code}",
    "Optimize this algorithm for better performance: {algorithm}",
    "Design a data structure to efficiently handle {requirement}",
    "Implement a {pattern} pattern in {language} for {use_case}"
  ],
  "mathematics": [
    "Solve this mathematical problem step by step: {problem}",
    "Calculate {calculation} and show your work",
    "Prove this mathematical statement: {statement}",
    "Find the solution to this equation: {equation}",
    "Derive the formula for {concept}"
  ],
  "science": [
    "Explain the process of {phenomenon} in detail, including the underlying mechanisms",
    "Analyze this scientific experiment and explain the results: {experiment}",
    "Compare and contrast {concept1} and {concept2} in terms of {aspect}",
    "Describe the process of {process} and its significance in {field}",
    "Explain the scientific principles behind {phenomenon}"
  ],
  "creative_writing": [
    "Write a creative short story about {character} who {situation}",
    "Create a dialogue between {character1} and {character2} about {topic}",
    "Write a poem about {theme} using {style} style",
    "Develop a character profile for {character_name} including background, motivations, and personality",
    "Write a scene where {character} faces {challenge} and how they overcome it"
  ],
  "analysis": [
    "Analyze the pros and cons of {topic} and provide a comprehensive assessment",
    "Evaluate the effectiveness of {strategy} in {context}",
    "Compare different approaches to {problem} and recommend the best one",
    "Assess the impact of {factor} on {outcome}",
    "Analyze the trends in {field} and predict future developments"
  ],
  "multilingual": [
    "Translate this text to {language} and explain the cultural nuances: {text}",
    "Explain the meaning of {phrase} in {language} and provide context",
    "Compare how {concept} is expressed in {language1} and {language2}",
    "Provide a cultural explanation of {idiom} in {language}",
    "Translate and analyze this {language} text: {text}"
  ],
  "agentic": [
    "Help me plan {task} including {requirements}",
    "Create a comprehensive strategy for {goal}",
    "Design a workflow for {process}",
    "Develop a plan to achieve {objective}",
    "Organize and prioritize these tasks: {tasks}"
  ]
} as const;

/**
 * Example usage of the Qwen3-235B executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic instruction following
    const result1 = await executeQwen3235B({
      prompt: "Give me a workout plan for this entire month to train for the Salkantay trek",
      max_tokens: 2000,
      temperature: 0.1
    });

    console.log("Instruction following response:", result1.text);

    // Example 2: Coding task
    const result2 = await executeQwen3235B({
      prompt: "Write a Python function to implement binary search algorithm",
      max_tokens: 1500,
      temperature: 0.1,
      top_p: 0.8
    });

    console.log("Coding response:", result2.text);

    // Example 3: Mathematical reasoning
    const result3 = await executeQwen3235B({
      prompt: "Solve this step by step: If a train leaves station A at 60 mph and another leaves station B at 40 mph, and they are 200 miles apart, when will they meet?",
      max_tokens: 1000,
      temperature: 0.1
    });

    console.log("Mathematical reasoning:", result3.text);

    // Example 4: Creative writing
    const result4 = await executeQwen3235B({
      prompt: "Write a creative short story about a character who discovers they can see into the future",
      max_tokens: 2500,
      temperature: 0.7,
      top_p: 0.9
    });

    console.log("Creative writing:", result4.text);

    // Example 5: Using helper function for instruction following
    const instructionScenario = createQwen3235BScenario('instruction_following');
    const result5 = await executeQwen3235B(instructionScenario);
    console.log("Instruction scenario:", result5.text);

    // Example 6: Custom scenario with specific parameters
    const customScenario = createQwen3235BScenario(
      'analysis',
      "Analyze the impact of artificial intelligence on the job market",
      {
        max_tokens: 3000,
        temperature: 0.1
      }
    );
    const result6 = await executeQwen3235B(customScenario);
    console.log("Custom analysis:", result6.text);

    // Example 7: Using predefined templates
    const result7 = await executeQwen3235B({
      prompt: QWEN3_235B_PROMPT_TEMPLATES.coding[0]
        .replace("{language}", "Python")
        .replace("{task}", "implement a quicksort algorithm"),
      max_tokens: 2000,
      temperature: 0.1,
      top_p: 0.8
    });
    console.log("Template coding solution:", result7.text);

    // Example 8: Prediction usage for long-running tasks
    const prediction = await executeQwen3235BPrediction({
      prompt: "Create a comprehensive analysis of the current state of artificial intelligence and predict future developments",
      max_tokens: 4000,
      temperature: 0.1
    });

    console.log("Prediction ID:", prediction.id);

    // Check status
    const status = await checkQwen3235BStatus(prediction.id);
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
  const inputCostPerMillion = 0.264;
  const outputCostPerMillion = 1.06;
  
  const inputCost = (inputTokens / 1000000) * inputCostPerMillion;
  const outputCost = (outputTokens / 1000000) * outputCostPerMillion;
  
  return inputCost + outputCost;
}

/**
 * Utility function to validate prompt format for Qwen3-235B
 * 
 * @param prompt - The prompt string to validate
 * @returns Validation result with suggestions
 */
export function validateQwen3235BPrompt(prompt: string): { 
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
  const hasClearWords = /(write|create|analyze|explain|describe|solve|implement|design|develop|help|provide)/i.test(prompt);
  
  if (!hasClearWords) {
    suggestions.push("Consider using action words like 'write', 'analyze', 'explain', or 'create' for better results");
  }
  
  if (prompt.length < 20) {
    suggestions.push("Consider making your prompt more specific and detailed for better results");
  }

  // Check for very long prompts
  if (prompt.length > 10000) {
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
 * Utility function to get optimal settings for Qwen3-235B scenario type
 * 
 * @param scenarioType - Type of scenario
 * @returns Recommended settings
 */
export function getOptimalQwen3235BSettings(scenarioType: 'instruction_following' | 'reasoning' | 'coding' | 'mathematics' | 'science' | 'creative_writing' | 'analysis' | 'multilingual' | 'agentic'): {
  max_tokens: number;
  temperature: number;
  top_p: number;
  presence_penalty: number;
  frequency_penalty: number;
  prompt_suggestions: string[];
} {
  const settingsMap = {
    instruction_following: { 
      max_tokens: 2000,
      temperature: 0.1,
      top_p: 0.8,
      presence_penalty: 0,
      frequency_penalty: 0,
      prompt_suggestions: ["Create a detailed step-by-step guide for", "Provide comprehensive instructions for", "Write a tutorial on how to"] 
    },
    reasoning: { 
      max_tokens: 1500,
      temperature: 0.1,
      top_p: 0.8,
      presence_penalty: 0,
      frequency_penalty: 0,
      prompt_suggestions: ["Analyze this complex problem and provide a logical solution:", "Solve this reasoning puzzle:", "Determine the validity of this argument:"] 
    },
    coding: { 
      max_tokens: 2000,
      temperature: 0.1,
      top_p: 0.8,
      presence_penalty: 0,
      frequency_penalty: 0,
      prompt_suggestions: ["Write a function to", "Debug this code and explain:", "Optimize this algorithm:"] 
    },
    mathematics: { 
      max_tokens: 1500,
      temperature: 0.1,
      top_p: 0.8,
      presence_penalty: 0,
      frequency_penalty: 0,
      prompt_suggestions: ["Solve this mathematical problem step by step:", "Calculate and show your work:", "Prove this mathematical statement:"] 
    },
    science: { 
      max_tokens: 2000,
      temperature: 0.1,
      top_p: 0.8,
      presence_penalty: 0,
      frequency_penalty: 0,
      prompt_suggestions: ["Explain the process of", "Analyze this scientific experiment:", "Compare and contrast"] 
    },
    creative_writing: { 
      max_tokens: 2500,
      temperature: 0.7,
      top_p: 0.9,
      presence_penalty: 0,
      frequency_penalty: 0,
      prompt_suggestions: ["Write a creative short story about", "Create a dialogue between", "Write a poem about"] 
    },
    analysis: { 
      max_tokens: 2000,
      temperature: 0.1,
      top_p: 0.8,
      presence_penalty: 0,
      frequency_penalty: 0,
      prompt_suggestions: ["Analyze the pros and cons of", "Evaluate the effectiveness of", "Compare different approaches to"] 
    },
    multilingual: { 
      max_tokens: 1500,
      temperature: 0.1,
      top_p: 0.8,
      presence_penalty: 0,
      frequency_penalty: 0,
      prompt_suggestions: ["Translate this text to", "Explain the meaning of", "Compare how this is expressed in"] 
    },
    agentic: { 
      max_tokens: 3000,
      temperature: 0.1,
      top_p: 0.8,
      presence_penalty: 0,
      frequency_penalty: 0,
      prompt_suggestions: ["Help me plan", "Create a comprehensive strategy for", "Design a workflow for"] 
    }
  };

  return settingsMap[scenarioType];
}

/**
 * Utility function to enhance prompt for better Qwen3-235B results
 * 
 * @param prompt - Base prompt to enhance
 * @param enhancements - Enhancement options
 * @returns Enhanced prompt
 */
export function enhancePromptForQwen3235B(
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

  // Add examples
  if (enhancements.addExamples) {
    if (!/(example|examples|illustrate|demonstrate)/i.test(enhancedPrompt)) {
      enhancedPrompt = `${enhancedPrompt}. Please provide examples to illustrate your points.`;
    }
  }

  return enhancedPrompt;
}

/**
 * Utility function to create batch Qwen3-235B analysis
 * 
 * @param promptsArray - Array of prompts
 * @param scenarioTypesArray - Array of scenario types
 * @param maxTokensArray - Array of max token values
 * @returns Array of Qwen3-235B inputs
 */
export function createBatchQwen3235BAnalysis(
  promptsArray: string[], 
  scenarioTypesArray: ('instruction_following' | 'reasoning' | 'coding' | 'mathematics' | 'science' | 'creative_writing' | 'analysis' | 'multilingual' | 'agentic')[],
  maxTokensArray: number[]
): Qwen3235BInput[] {
  if (promptsArray.length !== scenarioTypesArray.length || 
      promptsArray.length !== maxTokensArray.length) {
    throw new Error("All arrays must have the same length");
  }

  return promptsArray.map((prompt, index) => {
    const settings = getOptimalQwen3235BSettings(scenarioTypesArray[index]);
    return {
      prompt,
      max_tokens: maxTokensArray[index] || settings.max_tokens,
      temperature: settings.temperature,
      top_p: settings.top_p,
      presence_penalty: settings.presence_penalty,
      frequency_penalty: settings.frequency_penalty
    };
  });
}

/**
 * Supported scenario types
 */
export const QWEN3_235B_SCENARIOS = {
  "instruction_following": "Instruction following and task completion",
  "reasoning": "Logical reasoning and problem solving",
  "coding": "Programming and software development",
  "mathematics": "Mathematical problem solving",
  "science": "Scientific knowledge and analysis",
  "creative_writing": "Creative content generation",
  "analysis": "Data analysis and evaluation",
  "multilingual": "Multilingual tasks and translation",
  "agentic": "Agentic workflows and planning"
} as const;

/**
 * Qwen3-235B capability descriptions
 */
export const QWEN3_235B_CAPABILITIES = {
  "instruction_following": "Significantly improved instruction following capabilities",
  "logical_reasoning": "Enhanced logical reasoning abilities",
  "text_comprehension": "Improved text comprehension and analysis",
  "mathematics": "Better mathematical problem solving",
  "science": "Enhanced scientific knowledge and reasoning",
  "coding": "Improved code generation and debugging",
  "tool_usage": "Advanced tool usage capabilities",
  "long_context": "Enhanced 256K long-context understanding",
  "multilingual": "Substantial gains in long-tail knowledge coverage across multiple languages",
  "user_alignment": "Better alignment with user preferences in subjective and open-ended tasks",
  "agentic_workflows": "Excellent tool calling capabilities for agentic workflows",
  "fp8_quantization": "FP8 quantization for efficiency"
} as const;

/**
 * Performance benchmarks
 */
export const QWEN3_235B_BENCHMARKS = {
  "knowledge": {
    "MMLU_Pro": 83.0,
    "MMLU_Redux": 93.1,
    "GPQA": 77.5,
    "SuperGPQA": 62.6,
    "SimpleQA": 54.3,
    "CSimpleQA": 84.3
  },
  "reasoning": {
    "AIME25": 70.3,
    "HMMT25": 55.4,
    "ARC_AGI": 41.8,
    "ZebraLogic": 95.0,
    "LiveBench": 75.4
  },
  "coding": {
    "LiveCodeBench": 51.8,
    "MultiPL_E": 87.9,
    "Aider_Polyglot": 57.3
  },
  "alignment": {
    "IFEval": 88.7,
    "Arena_Hard_v2": 79.2,
    "Creative_Writing_v3": 87.5,
    "WritingBench": 85.2
  },
  "agent": {
    "BFCL_v3": 70.9,
    "TAU1_Retail": 71.3,
    "TAU1_Airline": 44.0,
    "TAU2_Retail": 74.6,
    "TAU2_Airline": 50.0,
    "TAU2_Telecom": 32.5
  },
  "multilingual": {
    "MultiIF": 77.5,
    "MMLU_ProX": 79.4,
    "INCLUDE": 79.5,
    "PolyMATH": 50.2
  }
} as const;

/**
 * Hardware requirements
 */
export const QWEN3_235B_HARDWARE = {
  "gpu": "Nvidia L40S GPU",
  "memory": "High memory requirements for 235B parameter model",
  "quantization": "FP8 quantization for efficiency",
  "context_length": "Supports up to 262,144 tokens context length"
} as const;

/**
 * Pricing information
 */
export const QWEN3_235B_PRICING = {
  "input_cost_per_million": 0.264,
  "output_cost_per_million": 1.06,
  "currency": "USD",
  "billing_unit": "per token"
} as const;

/**
 * Qwen3-235B tips
 */
export const QWEN3_235B_TIPS = {
  "prompt_creation": "Use clear, specific prompts for best instruction following results",
  "instruction_following": "Leverage the model's significantly improved instruction following capabilities",
  "long_context": "Take advantage of the 256K long-context understanding",
  "multilingual": "Use the model for multilingual tasks with improved knowledge coverage",
  "agentic_workflows": "Leverage excellent tool calling capabilities for agentic workflows",
  "temperature_settings": "Use lower temperature (0.1) for consistent, focused responses",
  "token_management": "Set appropriate max_tokens based on expected response length",
  "reasoning_tasks": "Strong performance on logical reasoning and problem solving",
  "coding_tasks": "Good performance on code generation and debugging",
  "user_alignment": "Better alignment with user preferences in subjective tasks"
} as const;

export default executeQwen3235B;
