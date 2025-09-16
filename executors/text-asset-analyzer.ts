import { executeGPT5 } from "./gpt-5";
import { executeGPT5Mini } from "./gpt-5-mini";
import { executeClaudeSonnet4 } from "./claude-sonnet-4";
import { executeQwen3235B } from "./qwen3-235b-instruct-2507";

// Types for text analysis
export interface TextAnalysisInput {
  text: string;
  prompt: string;
  userDescription?: string;
  analysisType?: 'sentiment_analysis' | 'content_summarization' | 'language_detection' | 'keyword_extraction' | 'topic_modeling' | 'text_classification' | 'named_entity_recognition' | 'intent_analysis' | 'readability_analysis' | 'translation' | 'paraphrasing' | 'creative_writing' | 'technical_analysis' | 'educational_content' | 'marketing_analysis' | 'legal_analysis' | 'medical_analysis' | 'custom';
  maxRetries?: number;
}

export interface TextAnalysisResult {
  success: boolean;
  model: string;
  result: string;
  error?: string;
  fallbackUsed?: boolean;
  processingTime?: number;
}

export interface TextAnalysisOptions {
  timeout?: number;
  enableFallback?: boolean;
  logLevel?: 'silent' | 'error' | 'warn' | 'info' | 'debug';
}

// Model configuration with priority order and capabilities
const TEXT_MODELS = [
  {
    name: "GPT-5",
    executor: executeGPT5,
    priority: 1,
    capabilities: [
      'sentiment_analysis',
      'content_summarization',
      'language_detection',
      'keyword_extraction',
      'topic_modeling',
      'text_classification',
      'named_entity_recognition',
      'intent_analysis',
      'readability_analysis',
      'translation',
      'paraphrasing',
      'creative_writing',
      'technical_analysis',
      'educational_content',
      'marketing_analysis',
      'legal_analysis',
      'medical_analysis'
    ],
    description: "OpenAI's most capable model for advanced reasoning, code generation, instruction following, and tool use",
    performance: "Highest accuracy for complex reasoning and analysis tasks, supports multimodal input"
  },
  {
    name: "Claude-Sonnet-4",
    executor: executeClaudeSonnet4,
    priority: 2,
    capabilities: [
      'sentiment_analysis',
      'content_summarization',
      'language_detection',
      'keyword_extraction',
      'topic_modeling',
      'text_classification',
      'named_entity_recognition',
      'intent_analysis',
      'readability_analysis',
      'translation',
      'paraphrasing',
      'creative_writing',
      'technical_analysis',
      'educational_content',
      'marketing_analysis',
      'legal_analysis',
      'medical_analysis'
    ],
    description: "Hybrid reasoning model with near-instant responses and extended thinking capabilities",
    performance: "72.7% performance on SWE-bench, enhanced instruction following, parallel tool execution"
  },
  {
    name: "GPT-5-Mini",
    executor: executeGPT5Mini,
    priority: 3,
    capabilities: [
      'sentiment_analysis',
      'content_summarization',
      'language_detection',
      'keyword_extraction',
      'topic_modeling',
      'text_classification',
      'named_entity_recognition',
      'intent_analysis',
      'readability_analysis',
      'translation',
      'paraphrasing',
      'creative_writing',
      'technical_analysis',
      'educational_content',
      'marketing_analysis',
      'legal_analysis',
      'medical_analysis'
    ],
    description: "Faster version of GPT-5 with balanced speed and cost, ideal for chat and medium-difficulty reasoning",
    performance: "Optimized for faster response times while maintaining high quality outputs"
  },
  {
    name: "Qwen3-235B-Instruct",
    executor: executeQwen3235B,
    priority: 4,
    capabilities: [
      'sentiment_analysis',
      'content_summarization',
      'language_detection',
      'keyword_extraction',
      'topic_modeling',
      'text_classification',
      'named_entity_recognition',
      'intent_analysis',
      'readability_analysis',
      'translation',
      'paraphrasing',
      'creative_writing',
      'technical_analysis',
      'educational_content',
      'marketing_analysis',
      'legal_analysis',
      'medical_analysis'
    ],
    description: "Updated Qwen3 model with 235B parameters, enhanced instruction following and logical reasoning",
    performance: "Significant improvements in general capabilities, 256K long-context understanding"
  }
] as const;

/**
 * Enhanced Text Asset Analyzer with automatic fallback logic
 * Uses curated text analysis models in priority order
 */
export async function analyzeTextAsset(
  input: TextAnalysisInput,
  options: TextAnalysisOptions = {}
): Promise<TextAnalysisResult> {
  const startTime = Date.now();
  const { timeout = 30000, enableFallback = true, logLevel = 'info' } = options;
  
  // Validate input
  if (!input.text || !input.prompt) {
    return {
      success: false,
      model: 'none',
      result: '',
      error: 'Text content and prompt are required'
    };
  }

  // Filter models by analysis type if specified
  const availableModels = input.analysisType 
    ? TEXT_MODELS.filter(model => model.capabilities.includes(input.analysisType!))
    : TEXT_MODELS;

  if (availableModels.length === 0) {
    return {
      success: false,
      model: 'none',
      result: '',
      error: `No models available for analysis type: ${input.analysisType}`
    };
  }

  // Sort by priority
  const sortedModels = [...availableModels].sort((a, b) => a.priority - b.priority);

  let lastError: string = '';
  let fallbackUsed = false;

  for (let i = 0; i < sortedModels.length; i++) {
    const model = sortedModels[i];
    
    try {
      if (logLevel !== 'silent') {
        console.log(`[Text Analyzer] Attempting ${model.name} (${i + 1}/${sortedModels.length})`);
      }

      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Model timeout')), timeout);
      });

      // Execute model with timeout
      const result = await Promise.race([
        executeTextModel(model, input),
        timeoutPromise
      ]);

      const processingTime = Date.now() - startTime;

      if (logLevel !== 'silent') {
        console.log(`[Text Analyzer] ${model.name} succeeded in ${processingTime}ms`);
      }

      return {
        success: true,
        model: model.name,
        result: result,
        fallbackUsed,
        processingTime
      };

    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error';
      
      if (logLevel !== 'silent') {
        console.warn(`[Text Analyzer] ${model.name} failed: ${lastError}`);
      }

      // If this is not the last model and fallback is enabled, continue to next model
      if (i < sortedModels.length - 1 && enableFallback) {
        fallbackUsed = true;
        continue;
      }
    }
  }

  // All models failed
  const processingTime = Date.now() - startTime;
  
  return {
    success: false,
    model: 'all_failed',
    result: '',
    error: `All models failed. Last error: ${lastError}`,
    fallbackUsed,
    processingTime
  };
}

/**
 * Execute a specific text model with proper input formatting
 */
async function executeTextModel(
  model: typeof TEXT_MODELS[0],
  input: TextAnalysisInput
): Promise<string> {
  const { text, prompt, userDescription } = input;
  
  // Build enhanced prompt with user description and text content
  let enhancedPrompt = `${prompt}\n\nText to analyze:\n"${text}"`;
  if (userDescription) {
    enhancedPrompt += `\n\nIMPORTANT: The user has provided a specific description for THIS EXACT TEXT: "${userDescription}"`;
    enhancedPrompt += `\n\nConsider how the user specifically wants to use this text as described above.`;
  }

  // Execute based on model type
  switch (model.name) {
    case "GPT-5":
      const gpt5Result = await executeGPT5({
        prompt: enhancedPrompt,
        reasoning_effort: 'medium',
        verbosity: 'medium',
        max_completion_tokens: 2000
      });
      return gpt5Result.text;

    case "Claude-Sonnet-4":
      const claudeResult = await executeClaudeSonnet4({
        prompt: enhancedPrompt,
        max_tokens: 2000,
        extended_thinking: true,
        thinking_budget_tokens: 4000
      });
      return claudeResult.text;

    case "GPT-5-Mini":
      const gpt5MiniResult = await executeGPT5Mini({
        prompt: enhancedPrompt,
        reasoning_effort: 'low',
        verbosity: 'medium',
        max_completion_tokens: 2000
      });
      return gpt5MiniResult.text;

    case "Qwen3-235B-Instruct":
      const qwenResult = await executeQwen3235B({
        prompt: enhancedPrompt,
        max_tokens: 2000,
        temperature: 0.7,
        top_p: 0.9
      });
      return qwenResult.text;

    default:
      throw new Error(`Unknown model: ${model.name}`);
  }
}

/**
 * Analyze multiple text documents in batch
 */
export async function analyzeTextAssets(
  inputs: TextAnalysisInput[],
  options: TextAnalysisOptions = {}
): Promise<TextAnalysisResult[]> {
  const results: TextAnalysisResult[] = [];
  
  // Process texts in parallel with concurrency limit
  const concurrencyLimit = 3;
  const chunks = [];
  
  for (let i = 0; i < inputs.length; i += concurrencyLimit) {
    chunks.push(inputs.slice(i, i + concurrencyLimit));
  }

  for (const chunk of chunks) {
    const chunkResults = await Promise.all(
      chunk.map(input => analyzeTextAsset(input, options))
    );
    results.push(...chunkResults);
  }

  return results;
}

/**
 * Validate text content
 */
export function validateTextContent(text: string): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!text || text.trim().length === 0) {
    issues.push('Text content is empty');
  }
  
  if (text.length > 100000) {
    issues.push('Text content is too long (max 100,000 characters)');
  }
  
  if (text.length < 10) {
    issues.push('Text content is too short (min 10 characters)');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

/**
 * Create text analysis scenario with predefined prompts
 */
export function createTextAnalysisScenario(
  type: TextAnalysisInput['analysisType'],
  customText?: string,
  customPrompt?: string,
  customOptions?: Partial<TextAnalysisInput>
): TextAnalysisInput {
  const scenarios = {
    sentiment_analysis: {
      prompt: "Analyze the sentiment of the following text. Determine if it's positive, negative, or neutral, and provide a confidence score. Explain the reasoning behind your analysis.",
      analysisType: 'sentiment_analysis' as const
    },
    content_summarization: {
      prompt: "Provide a comprehensive summary of the following text. Extract the key points, main ideas, and important details. Keep the summary concise but informative.",
      analysisType: 'content_summarization' as const
    },
    language_detection: {
      prompt: "Identify the language(s) used in the following text. If multiple languages are present, specify which parts are in which language. Provide confidence scores for your identification.",
      analysisType: 'language_detection' as const
    },
    keyword_extraction: {
      prompt: "Extract the most important keywords and key phrases from the following text. Rank them by importance and relevance. Include both single words and multi-word phrases.",
      analysisType: 'keyword_extraction' as const
    },
    topic_modeling: {
      prompt: "Identify the main topics and themes in the following text. Group related concepts together and explain how they relate to each other. Provide a topic hierarchy if applicable.",
      analysisType: 'topic_modeling' as const
    },
    text_classification: {
      prompt: "Classify the following text into appropriate categories. Determine the genre, type, or domain of the content. Provide multiple classification options with confidence scores.",
      analysisType: 'text_classification' as const
    },
    named_entity_recognition: {
      prompt: "Identify and extract all named entities from the following text. Categorize them as persons, organizations, locations, dates, or other relevant entities. Provide context for each entity.",
      analysisType: 'named_entity_recognition' as const
    },
    intent_analysis: {
      prompt: "Analyze the intent and purpose of the following text. Determine what the author is trying to achieve, their goals, and the underlying motivation. Classify the intent type.",
      analysisType: 'intent_analysis' as const
    },
    readability_analysis: {
      prompt: "Analyze the readability and complexity of the following text. Assess the reading level, sentence structure, vocabulary complexity, and overall accessibility. Provide suggestions for improvement.",
      analysisType: 'readability_analysis' as const
    },
    translation: {
      prompt: "Translate the following text to English (or specify target language). Maintain the original meaning, tone, and style. If the text is already in English, provide alternative translations or paraphrases.",
      analysisType: 'translation' as const
    },
    paraphrasing: {
      prompt: "Paraphrase the following text while maintaining the original meaning and key information. Use different words and sentence structures. Provide multiple paraphrasing options.",
      analysisType: 'paraphrasing' as const
    },
    creative_writing: {
      prompt: "Analyze the creative elements of the following text. Identify literary devices, writing techniques, style, and artistic qualities. Provide suggestions for creative enhancement.",
      analysisType: 'creative_writing' as const
    },
    technical_analysis: {
      prompt: "Perform a technical analysis of the following text. Identify technical concepts, terminology, and domain-specific information. Explain complex technical content in accessible terms.",
      analysisType: 'technical_analysis' as const
    },
    educational_content: {
      prompt: "Analyze the educational value of the following text. Identify learning objectives, key concepts, and educational potential. Suggest how this content could be used for teaching or learning.",
      analysisType: 'educational_content' as const
    },
    marketing_analysis: {
      prompt: "Analyze the marketing aspects of the following text. Identify target audience, value propositions, persuasive techniques, and marketing effectiveness. Provide marketing insights and recommendations.",
      analysisType: 'marketing_analysis' as const
    },
    legal_analysis: {
      prompt: "Analyze the legal aspects of the following text. Identify legal concepts, potential issues, compliance considerations, and legal implications. Provide legal insights and recommendations.",
      analysisType: 'legal_analysis' as const
    },
    medical_analysis: {
      prompt: "Analyze the medical content of the following text. Identify medical concepts, terminology, and health-related information. Provide medical insights while noting this is not medical advice.",
      analysisType: 'medical_analysis' as const
    },
    custom: {
      prompt: customPrompt || "Analyze the following text and provide detailed insights based on the specific requirements.",
      analysisType: 'custom' as const
    }
  };

  const scenario = scenarios[type || 'content_summarization'];

  return {
    text: customText || '',
    prompt: customPrompt || scenario.prompt,
    analysisType: scenario.analysisType,
    maxRetries: 3,
    ...customOptions
  };
}

/**
 * Get available models and their capabilities
 */
export function getAvailableTextModels() {
  return TEXT_MODELS.map(model => ({
    name: model.name,
    priority: model.priority,
    capabilities: model.capabilities,
    description: model.description,
    performance: model.performance
  }));
}

/**
 * Get model recommendations for specific analysis types
 */
export function getTextModelRecommendations(analysisType: TextAnalysisInput['analysisType']) {
  const models = TEXT_MODELS.filter(model => 
    model.capabilities.includes(analysisType || 'content_summarization')
  );
  
  return models.map(model => ({
    name: model.name,
    priority: model.priority,
    description: model.description,
    performance: model.performance
  }));
}

// Export types and constants
export type { TextAnalysisInput, TextAnalysisResult, TextAnalysisOptions };
export { TEXT_MODELS };
