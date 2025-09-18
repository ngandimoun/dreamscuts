/**
 * Step 1: User Query Analysis
 * 
 * Goal: Extract intent, meaning, constraints, and hidden requirements from user prompts
 * 
 * This module handles:
 * - Normalize: clean the text, fix grammar if needed
 * - Intent classification: does the user want images, video, or audio?
 * - Extract modifiers: style, mood, theme, time period, emotions, etc.
 * - Extract constraints: counts, durations, aspect ratio, resolution, length, etc.
 * - Detect gaps: if user is vague, mark what's missing
 * - Optional creative reframing: suggest interpretations if the query is underspecified
 */

import { z } from 'zod';

// Together AI model executors
import { executeTogetherAILlama31405B, createLlama31405BPrompt, LLAMA31_405B_SYSTEM_PROMPTS } from '../../executors/together-ai-llama-3-1-405b';
import { executeTogetherAILlama3170B, createLlama3170BPrompt } from '../../executors/together-ai-llama-3-1-70b';
import { executeTogetherAIQwen2572B, createQwen2572BPrompt } from '../../executors/together-ai-qwen-2-5-72b';
import { executeTogetherAIGemma227B, createGemma227BPrompt } from '../../executors/together-ai-gemma-2-27b';
import { executeTogetherAIMistral7B, createMistral7BPrompt } from '../../executors/together-ai-mistral-7b';

// Types and schemas
export const QueryAnalysisSchema = z.object({
  original_prompt: z.string(),
  normalized_prompt: z.string(),
  intent: z.object({
    primary_output_type: z.enum(['image', 'video', 'audio', 'mixed']),
    confidence: z.number().min(0).max(1),
    secondary_types: z.array(z.enum(['image', 'video', 'audio'])).optional(),
    reasoning: z.string()
  }),
  modifiers: z.object({
    style: z.union([z.array(z.string()), z.null()]).optional(),
    mood: z.union([z.array(z.string()), z.null()]).optional(),
    theme: z.union([z.array(z.string()), z.null()]).optional(),
    time_period: z.union([z.string(), z.array(z.string()), z.null()]).optional(),
    emotions: z.union([z.array(z.string()), z.null()]).optional(),
    aesthetic: z.union([z.array(z.string()), z.null()]).optional(),
    genre: z.union([z.array(z.string()), z.null()]).optional(),
    technical_specs: z.union([z.array(z.string()), z.null()]).optional()
  }),
  constraints: z.object({
    // Image constraints
    image_count: z.union([z.number(), z.array(z.number())]).nullable().optional(),
    aspect_ratio: z.union([z.string(), z.array(z.string())]).nullable().optional(),
    resolution: z.union([z.string(), z.array(z.string())]).nullable().optional(),
    image_format: z.union([z.string(), z.array(z.string())]).nullable().optional(),
    
    // Video constraints
    duration_seconds: z.union([z.number(), z.array(z.number())]).nullable().optional(),
    fps: z.union([z.number(), z.array(z.number())]).nullable().optional(),
    video_format: z.union([z.string(), z.array(z.string())]).nullable().optional(),
    video_quality: z.union([z.string(), z.array(z.string())]).nullable().optional(),
    
    // Audio constraints
    audio_length_seconds: z.union([z.number(), z.array(z.number())]).nullable().optional(),
    audio_format: z.union([z.string(), z.array(z.string())]).nullable().optional(),
    sample_rate: z.union([z.number(), z.array(z.number())]).nullable().optional(),
    
    // General constraints
    budget: z.union([z.number(), z.array(z.number())]).nullable().optional(),
    timeline: z.union([z.string(), z.array(z.string())]).nullable().optional(),
    platform: z.union([z.array(z.string()), z.string()]).nullable().optional(),
    target_audience: z.union([z.string(), z.array(z.string())]).nullable().optional()
  }),
  gaps: z.object({
    missing_duration: z.boolean().optional(),
    missing_aspect_ratio: z.boolean().optional(),
    missing_style_direction: z.boolean().optional(),
    missing_target_audience: z.boolean().optional(),
    missing_platform_specs: z.boolean().optional(),
    missing_mood_tone: z.boolean().optional(),
    vague_requirements: z.boolean().optional(),
    needs_clarification: z.array(z.string()).optional()
  }),
  creative_reframing: z.object({
    alternative_interpretations: z.array(z.object({
      interpretation: z.string(),
      rationale: z.string(),
      confidence: z.number().min(0).max(1)
    })).optional(),
    suggested_enhancements: z.array(z.string()).optional(),
    potential_directions: z.array(z.object({
      direction: z.string(),
      description: z.string(),
      required_assets: z.array(z.string()).optional()
    })).optional()
  }),
  processing_metadata: z.object({
    analysis_timestamp: z.string(),
    processing_time_ms: z.number(),
    model_used: z.string(),
    confidence_score: z.number().min(0).max(1),
    grammar_corrections_made: z.boolean(),
    normalization_applied: z.boolean()
  })
});

export type QueryAnalysisResult = z.infer<typeof QueryAnalysisSchema>;

interface QueryAnalysisOptions {
  enableGrammarCorrection?: boolean;
  enableCreativeReframing?: boolean;
  enableDetailedModifierExtraction?: boolean;
  fallbackOnFailure?: boolean;
  timeout?: number;
  model_preference?: 'llama31_405b' | 'llama31_70b' | 'qwen25_72b' | 'gemma2_27b' | 'mistral_7b' | 'auto';
}

/**
 * Analyze user query and extract comprehensive information
 */
export async function analyzeUserQuery(
  query: string,
  options: QueryAnalysisOptions = {}
): Promise<{
  success: boolean;
  result?: QueryAnalysisResult;
  error?: string;
  model_used?: string;
  processing_time?: number;
}> {
  const startTime = Date.now();
  
  const {
    enableGrammarCorrection = true,
    enableCreativeReframing = true,
    enableDetailedModifierExtraction = true,
    fallbackOnFailure = true,
    timeout = 60000,
    model_preference = 'auto'
  } = options;

  console.log(`[QueryAnalyzer] Starting analysis for query: "${query.substring(0, 100)}..."`);
  
  try {
    // Step 1: Text normalization and grammar correction
    const normalizedQuery = await normalizeQuery(query, enableGrammarCorrection);
    
    // Step 2: Build analysis prompt
    const analysisPrompt = buildAnalysisPrompt(normalizedQuery, {
      enableCreativeReframing,
      enableDetailedModifierExtraction
    });
    
    // Step 3: Execute LLM analysis with fallback chain
    const llmResult = await executeLLMAnalysis(analysisPrompt, model_preference, timeout);
    
    if (!llmResult.success && fallbackOnFailure) {
      console.log(`[QueryAnalyzer] Primary analysis failed, trying fallback models`);
      // Try fallback models in order of capability and reliability
      const fallbackModels: Array<'llama31_405b' | 'llama31_70b' | 'qwen25_72b' | 'gemma2_27b' | 'mistral_7b'> = [
        'llama31_405b', 'llama31_70b', 'qwen25_72b', 'gemma2_27b', 'mistral_7b'
      ];
      
      for (const model of fallbackModels) {
        if (model !== model_preference) {
          const fallbackResult = await executeLLMAnalysis(analysisPrompt, model, timeout);
          if (fallbackResult.success) {
            console.log(`[QueryAnalyzer] Fallback model ${model} succeeded`);
            llmResult.success = true;
            llmResult.result = fallbackResult.result;
            llmResult.model_used = fallbackResult.model_used;
            break;
          }
        }
      }
    }
    
    if (!llmResult.success) {
      return {
        success: false,
        error: llmResult.error || 'All LLM models failed to analyze query',
        processing_time: Date.now() - startTime
      };
    }
    
    // Step 4: Parse and validate LLM response
    const parsedAnalysis = await parseAndValidateAnalysis(
      llmResult.result,
      query,
      normalizedQuery,
      llmResult.model_used || 'unknown',
      Date.now() - startTime
    );
    
    if (!parsedAnalysis.success) {
      return {
        success: false,
        error: parsedAnalysis.error,
        processing_time: Date.now() - startTime
      };
    }
    
    console.log(`[QueryAnalyzer] Analysis completed successfully in ${Date.now() - startTime}ms`);
    
    return {
      success: true,
      result: parsedAnalysis.result,
      model_used: llmResult.model_used,
      processing_time: Date.now() - startTime
    };
    
  } catch (error) {
    console.error(`[QueryAnalyzer] Unexpected error:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      processing_time: Date.now() - startTime
    };
  }
}

/**
 * Normalize and clean the user query
 */
async function normalizeQuery(query: string, enableGrammarCorrection: boolean): Promise<string> {
  let normalized = query.trim();
  
  // Basic normalization
  normalized = normalized.replace(/\s+/g, ' '); // Multiple spaces to single space
  normalized = normalized.replace(/([.!?])\s*$/, '$1'); // Ensure proper ending punctuation
  
  if (enableGrammarCorrection) {
    // Simple grammar corrections that don't require LLM
    normalized = normalized.replace(/\bi\b/g, 'I'); // Capitalize "i"
    normalized = normalized.replace(/(\w+)\s+\1\b/g, '$1'); // Remove duplicate words
    
    // If the query is very short or has obvious issues, we might want to enhance it
    if (normalized.length < 10 || !normalized.match(/[.!?]$/)) {
      // Add period if missing and query is substantial
      if (normalized.length > 3 && !normalized.match(/[.!?]$/)) {
        normalized += '.';
      }
    }
  }
  
  return normalized;
}

/**
 * Build comprehensive analysis prompt for LLM
 */
function buildAnalysisPrompt(query: string, options: {
  enableCreativeReframing: boolean;
  enableDetailedModifierExtraction: boolean;
}): string {
  return `You are a professional creative project analyzer. Analyze the following user query and extract comprehensive information about their creative intent.

USER QUERY: "${query}"

IMPORTANT: The user may mention media types (like "image" or "video") in their query, but this is often descriptive content rather than their actual intent. Focus on analyzing the creative content, style, and requirements rather than trying to determine the output type from the text alone.

Provide a detailed JSON analysis following this exact structure:

{
  "original_prompt": "${query}",
  "normalized_prompt": "[cleaned and corrected version if needed]",
  "intent": {
    "primary_output_type": "[image|video|audio|mixed]",
    "confidence": [0.0-1.0],
    "secondary_types": ["[additional types if applicable]"],
    "reasoning": "[explain why you classified this way - note that UI selection takes precedence over text analysis]"
  },
  "modifiers": {
    "style": ["[visual/aesthetic styles mentioned or implied]"],
    "mood": ["[emotional tone, atmosphere]"],
    "theme": ["[subject themes, topics]"],
    "time_period": "[historical period, era if mentioned]",
    "emotions": ["[emotional qualities to convey]"],
    "aesthetic": ["[visual aesthetic preferences]"],
    "genre": ["[creative genres like cinematic, documentary, etc.]"],
    "technical_specs": ["[any technical requirements mentioned]"]
  },
  "constraints": {
    "image_count": [number if specified],
    "aspect_ratio": "[ratio if mentioned like 16:9, 9:16, 1:1]",
    "resolution": "[if specified like 4K, HD, etc.]",
    "image_format": "[if specified]",
    "duration_seconds": [number if specified],
    "fps": [number if specified],
    "video_format": "[if specified]",
    "video_quality": "[if specified]",
    "audio_length_seconds": [number if specified],
    "audio_format": "[if specified]",
    "sample_rate": [number if specified],
    "budget": [number if mentioned],
    "timeline": "[deadline if mentioned]",
    "platform": ["[platforms like Instagram, YouTube, TikTok if mentioned]"],
    "target_audience": "[if specified or can be inferred]"
  },
  "gaps": {
    "missing_duration": [true if video/audio intent but no duration specified],
    "missing_aspect_ratio": [true if visual intent but no ratio specified],
    "missing_style_direction": [true if request is style-vague],
    "missing_target_audience": [true if not specified],
    "missing_platform_specs": [true if platform not specified],
    "missing_mood_tone": [true if emotional direction unclear],
    "vague_requirements": [true if overall request is underspecified],
    "needs_clarification": ["[list specific things that need clarification]"]
  },
  ${options.enableCreativeReframing ? `"creative_reframing": {
    "alternative_interpretations": [
      {
        "interpretation": "[alternative way to understand the request]",
        "rationale": "[why this interpretation makes sense]",
        "confidence": [0.0-1.0]
      }
    ],
    "suggested_enhancements": ["[ways to improve/expand the concept]"],
    "potential_directions": [
      {
        "direction": "[creative direction name]",
        "description": "[what this direction would involve]",
        "required_assets": ["[what assets would be needed]"]
      }
    ]
  },` : ''}
  "processing_metadata": {
    "analysis_timestamp": "[current ISO timestamp]",
    "processing_time_ms": 0,
    "model_used": "[model name]",
    "confidence_score": [0.0-1.0 overall confidence in analysis],
    "grammar_corrections_made": [true/false],
    "normalization_applied": [true/false]
  }
}

ANALYSIS GUIDELINES:
1. Be specific and actionable in your analysis
2. Infer missing information based on context clues
3. Identify gaps that would prevent successful project execution
4. Consider industry standards for missing specifications
5. Be conservative with confidence scores - only use high confidence (>0.8) when very certain
6. Extract both explicit and implicit requirements
7. CRITICAL: When user mentions "image" or "video" in their query, treat this as descriptive content about what they want to create, not as their output type preference. The UI selection will override your intent detection.
8. Focus on analyzing creative content, style, mood, and technical requirements rather than output type determination
${options.enableDetailedModifierExtraction ? `9. Pay special attention to subtle style/mood/aesthetic cues
10. Consider cultural and temporal contexts for complete modifier extraction` : ''}

Respond ONLY with the JSON object, no additional text.`;
}

/**
 * Execute LLM analysis with specified Together AI model
 */
async function executeLLMAnalysis(
  prompt: string,
  model: 'llama31_405b' | 'llama31_70b' | 'qwen25_72b' | 'gemma2_27b' | 'mistral_7b' | 'auto',
  timeout: number
): Promise<{
  success: boolean;
  result?: string;
  error?: string;
  model_used?: string;
}> {
  
  const executeWithTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) => 
        setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
      )
    ]);
  };
  
  try {
    let result: string;
    let modelUsed: string;
    
    if (model === 'auto') {
      // Try Together AI models in order of preference for query analysis
      const models = [
        { 
          name: 'llama31_405b', 
          executor: executeTogetherAILlama31405B,
          promptFormatter: createLlama31405BPrompt
        },
        { 
          name: 'llama31_70b', 
          executor: executeTogetherAILlama3170B,
          promptFormatter: createLlama3170BPrompt
        },
        { 
          name: 'qwen25_72b', 
          executor: executeTogetherAIQwen2572B,
          promptFormatter: createQwen2572BPrompt
        },
        { 
          name: 'gemma2_27b', 
          executor: executeTogetherAIGemma227B,
          promptFormatter: createGemma227BPrompt
        },
        { 
          name: 'mistral_7b', 
          executor: executeTogetherAIMistral7B,
          promptFormatter: createMistral7BPrompt
        }
      ];
      
      for (const modelInfo of models) {
        try {
          const formattedPrompt = modelInfo.promptFormatter(
            LLAMA31_405B_SYSTEM_PROMPTS.query_analysis, 
            prompt
          );
          
          const response = await executeWithTimeout(
            modelInfo.executor({ 
              prompt: formattedPrompt,
              max_tokens: 2000,
              temperature: 0.1,
              top_p: 0.9
            }), 
            timeout
          );
          
          result = response.text;
          modelUsed = modelInfo.name;
          break;
        } catch (error) {
          console.log(`[QueryAnalyzer] Model ${modelInfo.name} failed:`, error);
          continue;
        }
      }
      
      if (!result!) {
        return {
          success: false,
          error: 'All auto-selected Together AI models failed'
        };
      }
    } else {
      // Use specific Together AI model
      const modelConfigs = {
        llama31_405b: {
          executor: executeTogetherAILlama31405B,
          promptFormatter: createLlama31405BPrompt
        },
        llama31_70b: {
          executor: executeTogetherAILlama3170B,
          promptFormatter: createLlama3170BPrompt
        },
        qwen25_72b: {
          executor: executeTogetherAIQwen2572B,
          promptFormatter: createQwen2572BPrompt
        },
        gemma2_27b: {
          executor: executeTogetherAIGemma227B,
          promptFormatter: createGemma227BPrompt
        },
        mistral_7b: {
          executor: executeTogetherAIMistral7B,
          promptFormatter: createMistral7BPrompt
        }
      };
      
      const config = modelConfigs[model];
      const formattedPrompt = config.promptFormatter(
        LLAMA31_405B_SYSTEM_PROMPTS.query_analysis, 
        prompt
      );
      
      const response = await executeWithTimeout(
        config.executor({ 
          prompt: formattedPrompt,
          max_tokens: 2000,
          temperature: 0.1,
          top_p: 0.9
        }), 
        timeout
      );
      
      result = response.text;
      modelUsed = model;
    }
    
    return {
      success: true,
      result,
      model_used: modelUsed
    };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Together AI execution error'
    };
  }
}

/**
 * Parse and validate LLM response
 */
async function parseAndValidateAnalysis(
  llmResponse: string,
  originalQuery: string,
  normalizedQuery: string,
  modelUsed: string,
  processingTime: number
): Promise<{
  success: boolean;
  result?: QueryAnalysisResult;
  error?: string;
}> {
  try {
    // Extract JSON from response (in case LLM added extra text)
    const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        success: false,
        error: 'No valid JSON found in LLM response'
      };
    }
    
    const parsedResponse = JSON.parse(jsonMatch[0]);
    
    // Fill in metadata that LLM might not have populated correctly
    parsedResponse.original_prompt = originalQuery;
    parsedResponse.processing_metadata = {
      ...parsedResponse.processing_metadata,
      analysis_timestamp: new Date().toISOString(),
      processing_time_ms: processingTime,
      model_used: modelUsed,
      grammar_corrections_made: originalQuery !== normalizedQuery,
      normalization_applied: true
    };
    
    // Validate against schema
    const validated = QueryAnalysisSchema.safeParse(parsedResponse);
    
    if (!validated.success) {
      console.error(`[QueryAnalyzer] Validation failed:`, validated.error.format());
      return {
        success: false,
        error: `Analysis validation failed: ${JSON.stringify(validated.error.format())}`
      };
    }
    
    return {
      success: true,
      result: validated.data
    };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse LLM response'
    };
  }
}

/**
 * Helper function to detect if query needs asset upload
 */
export function detectAssetRequirements(analysis: QueryAnalysisResult): {
  needs_reference_images: boolean;
  needs_source_video: boolean;
  needs_audio_input: boolean;
  recommended_asset_types: string[];
  rationale: string;
} {
  const { intent, gaps, modifiers } = analysis;
  
  const needs_reference_images = 
    (intent.primary_output_type === 'image' || intent.primary_output_type === 'video') &&
    (gaps.missing_style_direction || modifiers.style?.length === 0);
    
  const needs_source_video = 
    intent.primary_output_type === 'video' && 
    (modifiers.technical_specs?.some(spec => spec.toLowerCase().includes('edit')) ||
     modifiers.genre?.some(genre => genre.toLowerCase().includes('remix')));
     
  const needs_audio_input = 
    (intent.primary_output_type === 'audio' || intent.primary_output_type === 'video') &&
    (modifiers.technical_specs?.some(spec => spec.toLowerCase().includes('voice')) ||
     gaps.missing_mood_tone);
  
  const recommended_asset_types: string[] = [];
  if (needs_reference_images) recommended_asset_types.push('reference_images');
  if (needs_source_video) recommended_asset_types.push('source_video');
  if (needs_audio_input) recommended_asset_types.push('audio_samples');
  
  const rationale = `Based on intent (${intent.primary_output_type}) and identified gaps: ${
    Object.entries(gaps)
      .filter(([_, value]) => value === true)
      .map(([key, _]) => key)
      .join(', ')
  }`;
  
  return {
    needs_reference_images,
    needs_source_video,
    needs_audio_input,
    recommended_asset_types,
    rationale
  };
}

/**
 * Generate default constraints based on intent and platform
 */
export function generateDefaultConstraints(analysis: QueryAnalysisResult): {
  suggested_duration?: number;
  suggested_aspect_ratio?: string;
  suggested_resolution?: string;
  rationale: string;
} {
  const { intent, constraints } = analysis;
  const platform = constraints.platform?.[0]?.toLowerCase();
  
  let suggested_duration: number | undefined;
  let suggested_aspect_ratio: string | undefined;
  let suggested_resolution: string | undefined;
  
  // Platform-specific defaults
  if (platform) {
    switch (platform) {
      case 'tiktok':
      case 'instagram':
      case 'youtube shorts':
        suggested_duration = suggested_duration || 30;
        suggested_aspect_ratio = suggested_aspect_ratio || '9:16';
        suggested_resolution = suggested_resolution || '1080x1920';
        break;
      case 'youtube':
        suggested_duration = suggested_duration || 60;
        suggested_aspect_ratio = suggested_aspect_ratio || '16:9';
        suggested_resolution = suggested_resolution || '1920x1080';
        break;
      case 'instagram feed':
        suggested_aspect_ratio = suggested_aspect_ratio || '1:1';
        suggested_resolution = suggested_resolution || '1080x1080';
        break;
    }
  }
  
  // Intent-based defaults
  if (intent.primary_output_type === 'video' && !suggested_duration) {
    suggested_duration = 30; // Default 30 seconds
  }
  
  if (!suggested_aspect_ratio) {
    if (intent.primary_output_type === 'video') {
      suggested_aspect_ratio = '16:9'; // Standard video
    } else if (intent.primary_output_type === 'image') {
      suggested_aspect_ratio = '1:1'; // Square for social media
    }
  }
  
  const rationale = `Defaults based on ${platform ? `platform (${platform}) and ` : ''}intent (${intent.primary_output_type})`;
  
  return {
    suggested_duration,
    suggested_aspect_ratio,
    suggested_resolution,
    rationale
  };
}
