import { executeQwen2VL7BInstruct } from "./qwen2-vl-7b-instruct";
import { executeVideoLLaMA3 } from "./videollama3-7b";
import { executeApollo7B } from "./apollo-7b";
import { executeMiniCPMV4 } from "./minicpm-v-4";
// Removed incorrect Fal.ai models - they are for video generation, not understanding
import { executeWithAutoCorrection } from "../lib/auto-corrector/services";

// Types for video analysis
export interface VideoAnalysisInput {
  videoUrl: string;
  prompt: string;
  userDescription?: string;
  analysisType?: 'content_analysis' | 'scene_analysis' | 'activity_recognition' | 'question_answering' | 'summarization' | 'educational' | 'entertainment' | 'sports' | 'cooking' | 'custom';
  maxRetries?: number;
}

export interface VideoAnalysisResult {
  success: boolean;
  model: string;
  result: string;
  error?: string;
  fallbackUsed?: boolean;
  processingTime?: number;
}

export interface VideoAnalysisOptions {
  timeout?: number;
  enableFallback?: boolean;
  logLevel?: 'silent' | 'error' | 'warn' | 'info' | 'debug';
}

// HARDCODED VIDEO UNDERSTANDING MODELS - EXACT MODEL IDs AS SPECIFIED
// These models are specifically configured for video understanding, captioning, and explanation
const VIDEO_MODELS = [
  {
    name: 'qwen2-vl-7b-instruct',
    executor: executeQwen2VL7BInstruct,
    description: 'Qwen2-VL-7B-Instruct - Latest model in the Qwen family for chatting with video and image models - State-of-the-art video understanding',
    priority: 1, // PRIMARY MODEL - Fast and reliable (~4 seconds)
    modelId: 'lucataco/qwen2-vl-7b-instruct:bf57361c75677fc33d480d0c5f02926e621b2caa2000347cb74aeae9d2ca07ee',
    category: 'video_understanding',
    speed: '~4 seconds'
  },
  {
    name: 'videollama3-7b',
    executor: executeVideoLLaMA3,
    description: 'VideoLLaMA 3-7B - Frontier Multimodal Foundation Models for Video Understanding - Exceptional video understanding capabilities',
    priority: 2, // FIRST FALLBACK - Excellent video understanding (~8 seconds)
    modelId: 'lucataco/videollama3-7b:34a1f45f7068f7121a5b47c91f2d7e06c298850767f76f96660450a0a3bd5bbe',
    category: 'video_understanding',
    speed: '~8 seconds'
  },
  {
    name: 'apollo-7b',
    executor: executeApollo7B,
    description: 'Apollo 7B - An Exploration of Video Understanding in Large Multimodal Models - State-of-the-art video content analysis',
    priority: 3, // SECOND FALLBACK - Good video understanding (~8 seconds)
    modelId: 'lucataco/apollo-7b:e282f76d0451b759128be3e8bccfe5ded8f521f4a7d705883e92f837e563f575',
    category: 'video_understanding',
    speed: '~8 seconds'
  }
] as const;

// Enhanced prompts for different analysis types - ULTRA-CLEAR ANALYSIS FOCUS
const ANALYSIS_PROMPTS = {
  content_analysis: "TASK: ANALYZE EXISTING VIDEO CONTENT ONLY. You are a video content analyzer. Your job is to WATCH and DESCRIBE what is already in the video. Do NOT create, generate, or build anything. Simply analyze and describe what you see. What is happening in this video? What objects, people, or activities do you observe? Provide a detailed description of the existing video content.",
  scene_analysis: "TASK: ANALYZE EXISTING VIDEO SCENE ONLY. You are a video scene analyzer. Watch the video and describe the scene you see. What is the setting? What environment is shown? What visual elements are present? What is taking place? Do NOT create new content - only describe what already exists in the video.",
  activity_recognition: "TASK: RECOGNIZE ACTIVITIES IN EXISTING VIDEO ONLY. You are an activity recognition system. Watch the video and identify what activities, actions, or movements are happening. Describe what people or objects are doing. Do NOT create new activities - only identify what is already happening in the video.",
  question_answering: "TASK: ANSWER QUESTIONS ABOUT EXISTING VIDEO CONTENT ONLY. You are a video Q&A system. Watch the video and answer questions about what you see. Provide information about the existing content only. Do NOT create new content - only answer based on what is already in the video.",
  summarization: "TASK: SUMMARIZE EXISTING VIDEO CONTENT ONLY. You are a video summarizer. Watch the video and provide a summary of what happens. Include key events and main themes from the existing content. Do NOT create new content - only summarize what is already in the video.",
  educational: "TASK: ANALYZE EDUCATIONAL CONTENT IN EXISTING VIDEO ONLY. You are an educational content analyzer. Watch the video and explain what educational content is shown. What can be learned from this existing video? Do NOT create new educational content - only analyze what is already there.",
  entertainment: "TASK: ANALYZE ENTERTAINMENT CONTENT IN EXISTING VIDEO ONLY. You are an entertainment content analyzer. Watch the video and describe the entertainment value of the existing content. What makes it engaging? Do NOT create new entertainment - only analyze what is already in the video.",
  sports: "TASK: ANALYZE SPORTS CONTENT IN EXISTING VIDEO ONLY. You are a sports content analyzer. Watch the video and describe the sports action you see. What sport is shown? What techniques or moments do you observe? Do NOT create new sports content - only analyze what is already in the video.",
  cooking: "TASK: ANALYZE COOKING CONTENT IN EXISTING VIDEO ONLY. You are a cooking content analyzer. Watch the video and describe the cooking process shown. What recipe, ingredients, or techniques are demonstrated? Do NOT create new cooking content - only analyze what is already in the video.",
  custom: "TASK: ANALYZE EXISTING VIDEO CONTENT BASED ON SPECIFIC REQUIREMENTS. You are a custom video analyzer. Watch the video and provide analysis based on the specific requirements. Do NOT create new content - only analyze and describe what is already in the video."
} as const;

/**
 * Enhanced video asset analyzer with fallback logic and auto-corrector
 * Uses the specified models in priority order with automatic fallback and error correction
 */
export async function analyzeVideoAsset(
  input: VideoAnalysisInput,
  options: VideoAnalysisOptions = {}
): Promise<VideoAnalysisResult> {
  const startTime = Date.now();
  const {
    timeout = 90000, // Increased default timeout to 90s for video analysis
    enableFallback = true,
    logLevel = 'info'
  } = options;
  
  // Auto-corrector options
  const autoCorrectorOptions = {
    maxRetries: 3,
    retryDelay: 1000,
    enableFallback: true,
    logLevel: logLevel === 'debug' ? 'debug' : 'info',
    timeout: timeout
  };

  const {
    videoUrl,
    prompt,
    userDescription,
    analysisType = 'content_analysis',
    maxRetries = 1 // Reduced retries since we have good model fallback
  } = input;

  // Enhanced prompt with user description and analysis type
  let enhancedPrompt = prompt;
  if (userDescription) {
    enhancedPrompt += `\n\nIMPORTANT: The user has provided a specific description for THIS EXACT VIDEO: "${userDescription}"`;
    enhancedPrompt += `\n\nConsider how the user specifically wants to use this video as described above.`;
  }

  // Add analysis type specific prompt
  const typePrompt = ANALYSIS_PROMPTS[analysisType];
  if (typePrompt && !enhancedPrompt.toLowerCase().includes(analysisType)) {
    enhancedPrompt = `${typePrompt}\n\nUser Request: ${enhancedPrompt}`;
  }

  let lastError = '';
  let fallbackUsed = false;

  // Try each model in priority order (improved fallback logic)
  for (const model of VIDEO_MODELS) {
    // Try each model with retries
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        if (logLevel === 'debug' || logLevel === 'info') {
          console.log(`[VideoAnalyzer] Attempting ${model.name} (attempt ${attempt + 1}/${maxRetries}) - ${model.description}`);
        }

        const result = await executeModelWithTimeout(
          model,
          videoUrl,
          enhancedPrompt,
          timeout,
          autoCorrectorOptions
        );

        if (result.success) {
          const processingTime = Date.now() - startTime;
          if (logLevel === 'info' || logLevel === 'debug') {
            console.log(`[VideoAnalyzer] Success with ${model.name} in ${processingTime}ms`);
          }

          return {
            success: true,
            model: model.name,
            result: result.result,
            fallbackUsed,
            processingTime
          };
        }

        lastError = result.error || 'Unknown error';
        if (logLevel === 'warn' || logLevel === 'debug') {
          console.warn(`[VideoAnalyzer] ${model.name} failed: ${lastError}`);
        }

        // If this attempt failed and we have retries left for this model, wait before retrying
        if (attempt < maxRetries - 1) {
          const waitTime = Math.min(1000 * Math.pow(2, attempt), 3000); // Exponential backoff, max 3s
          if (logLevel === 'debug') {
            console.log(`[VideoAnalyzer] Waiting ${waitTime}ms before retry ${attempt + 2} for ${model.name}`);
          }
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }

      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
        if (logLevel === 'error' || logLevel === 'debug') {
          console.error(`[VideoAnalyzer] ${model.name} error:`, lastError);
        }
      }
    }

    // Mark fallback usage if we're moving to a non-primary model
    if (model.priority > 1) {
      fallbackUsed = true;
    }

    // Log fallback attempt
    if (model.priority > 1 && logLevel !== 'silent') {
      console.log(`[VideoAnalyzer] Falling back to next model after ${model.name} failed`);
    }
  }

  // All models failed
  const processingTime = Date.now() - startTime;
  if (logLevel === 'error' || logLevel === 'warn') {
    console.error(`[VideoAnalyzer] All ${VIDEO_MODELS.length} models failed in ${processingTime}ms. Last error: ${lastError}`);
  }

  return {
    success: false,
    model: 'none',
    result: '',
    error: `All video analysis models failed. Last error: ${lastError}`,
    fallbackUsed,
    processingTime
  };
}

/**
 * Execute a specific model with timeout
 */
async function executeModelWithTimeout(
  model: typeof VIDEO_MODELS[0],
  videoUrl: string,
  prompt: string,
  timeout: number,
  autoCorrectorOptions: any
): Promise<{ success: boolean; result?: string; error?: string }> {
  return new Promise(async (resolve) => {
    const timeoutId = setTimeout(() => {
      resolve({
        success: false,
        error: `Model ${model.name} timed out after ${timeout}ms`
      });
    }, timeout);

    try {
      let result: string;

      // Add system instruction to make it crystal clear this is VIDEO ANALYSIS not generation
      const systemInstruction = "CRITICAL INSTRUCTION: You are a VIDEO ANALYSIS AI. You are analyzing a VIDEO, NOT an image. Your ONLY job is to ANALYZE and DESCRIBE existing VIDEO content. You CANNOT and WILL NOT create, generate, build, or produce any videos. You can ONLY watch and describe what is already in the VIDEO. Always refer to 'this video' or 'the video', NEVER 'this image' or 'the image'. If asked to create videos, politely explain that you are an analysis AI, not a generation AI.\n\n";
      const enhancedPrompt = systemInstruction + prompt;

      // Execute the appropriate model based on its interface with auto-corrector
      if (model.name === 'qwen2-vl-7b-instruct') {
        result = await executeWithAutoCorrection(
          'replicate',
          {
            media: videoUrl,
            prompt: enhancedPrompt,
            max_new_tokens: 512
          },
          autoCorrectorOptions
        );
      } else if (model.name === 'videollama3-7b') {
        result = await executeWithAutoCorrection(
          'replicate',
          {
            video: videoUrl,
            prompt: enhancedPrompt,
            fps: 1,
            temperature: 0.2,
            max_new_tokens: 2048
          },
          autoCorrectorOptions
        );
      } else if (model.name === 'apollo-7b') {
        result = await executeWithAutoCorrection(
          'replicate',
          {
            video: videoUrl,
            prompt: enhancedPrompt,
            temperature: 0.4,
            max_new_tokens: 256,
            top_p: 0.7
          },
          autoCorrectorOptions
        );
      } else if (model.name === 'minicpm-v-4') {
        result = await executeWithAutoCorrection(
          'replicate',
          {
            video: videoUrl,
            prompt: enhancedPrompt,
            video_max_frames: 64
          },
          autoCorrectorOptions
        );
      } else {
        throw new Error(`Unknown model: ${model.name}`);
      }

      clearTimeout(timeoutId);
      resolve({
        success: true,
        result: result
      });

    } catch (error) {
      clearTimeout(timeoutId);
      resolve({
        success: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
}

/**
 * Batch video analysis for multiple videos
 */
export async function analyzeVideoAssets(
  inputs: VideoAnalysisInput[],
  options: VideoAnalysisOptions = {}
): Promise<VideoAnalysisResult[]> {
  const results: VideoAnalysisResult[] = [];
  
  // Process videos in parallel but limit concurrency
  const concurrency = Math.min(inputs.length, 3);
  const chunks = [];
  
  for (let i = 0; i < inputs.length; i += concurrency) {
    chunks.push(inputs.slice(i, i + concurrency));
  }

  for (const chunk of chunks) {
    const chunkResults = await Promise.all(
      chunk.map(input => analyzeVideoAsset(input, options))
    );
    results.push(...chunkResults);
  }

  return results;
}

/**
 * Get model information and status
 */
export function getVideoModelInfo() {
  return VIDEO_MODELS.map(model => ({
    name: model.name,
    description: model.description,
    priority: model.priority,
    modelId: model.modelId,
    status: 'available' // In a real implementation, you might check model availability
  }));
}

/**
 * Validate video URL format
 */
export function validateVideoUrl(url: string): { isValid: boolean; error?: string } {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'Video URL is required' };
  }

  try {
    new URL(url);
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }

  const videoExtensions = ['.mp4', '.avi', '.mov', '.webm', '.mkv', '.m4v', '.gif'];
  const hasValidExtension = videoExtensions.some(ext => 
    url.toLowerCase().includes(ext)
  );

  if (!hasValidExtension) {
    return { 
      isValid: false, 
      error: `Video must be in supported format: ${videoExtensions.join(', ')}` 
    };
  }

  return { isValid: true };
}

/**
 * Create analysis scenario with optimal parameters
 */
export function createVideoAnalysisScenario(
  type: keyof typeof ANALYSIS_PROMPTS,
  videoUrl: string,
  customPrompt?: string,
  userDescription?: string
): VideoAnalysisInput {
  return {
    videoUrl,
    prompt: customPrompt || ANALYSIS_PROMPTS[type],
    userDescription,
    analysisType: type,
    maxRetries: 3
  };
}

/**
 * Utility to enhance prompts for better video analysis
 */
export function enhanceVideoPrompt(
  basePrompt: string,
  enhancements: {
    addSpecificity?: boolean;
    addContext?: boolean;
    addDetail?: boolean;
    addTemporal?: boolean;
  } = {}
): string {
  let enhancedPrompt = basePrompt.trim();

  if (enhancements.addSpecificity) {
    if (!/(what|how|where|when|why|who|describe|analyze|explain|identify|detect)/i.test(enhancedPrompt)) {
      enhancedPrompt = `Please ${enhancedPrompt.toLowerCase()}`;
    }
  }

  if (enhancements.addContext) {
    if (!/(video|footage|clip|content)/i.test(enhancedPrompt)) {
      enhancedPrompt = `${enhancedPrompt} in this video`;
    }
  }

  if (enhancements.addDetail) {
    if (!/(detailed|specific|comprehensive|thorough)/i.test(enhancedPrompt)) {
      enhancedPrompt = `Please provide a detailed analysis of ${enhancedPrompt.toLowerCase()}`;
    }
  }

  if (enhancements.addTemporal) {
    if (!/(temporal|sequence|chronological|timeline)/i.test(enhancedPrompt)) {
      enhancedPrompt = `${enhancedPrompt} considering the temporal sequence of events`;
    }
  }

  return enhancedPrompt;
}

// Export default function
export default analyzeVideoAsset;
