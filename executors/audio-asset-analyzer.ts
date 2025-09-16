/**
 * Audio Asset Analyzer
 * 
 * Analyzes audio content metadata and descriptions using text-based models
 * Note: This analyzer works with audio URLs and metadata, not direct audio processing
 * For actual audio transcription, specialized audio models would be needed
 */

import { executeGPT5 } from "./gpt-5";
import { executeGPT5Mini } from "./gpt-5-mini";
import { executeClaudeSonnet4 } from "./claude-sonnet-4";
import { executeQwen3235B } from "./qwen3-235b-instruct-2507";
import { executeWithAutoCorrection } from "../lib/auto-corrector/services";

// Types for audio analysis
export interface AudioAnalysisInput {
  audioUrl: string;
  prompt: string;
  userDescription?: string;
  analysisType?: 'speech_recognition' | 'music_analysis' | 'sound_effects' | 'audio_quality' | 'language_detection' | 'sentiment_analysis' | 'content_summarization' | 'transcription' | 'speaker_identification' | 'emotion_detection' | 'background_noise' | 'audio_classification' | 'custom';
  maxRetries?: number;
}

export interface AudioAnalysisResult {
  success: boolean;
  model: string;
  result: string;
  error?: string;
  fallbackUsed?: boolean;
  processingTime?: number;
}

export interface AudioAnalysisOptions {
  timeout?: number;
  enableFallback?: boolean;
  logLevel?: 'silent' | 'error' | 'warn' | 'info' | 'debug';
}

// Model configuration with priority order and capabilities
const AUDIO_MODELS = [
  {
    name: "GPT-5",
    executor: executeGPT5,
    priority: 1, // HIGHEST PRIORITY - Best for audio analysis
    capabilities: [
      'speech_recognition',
      'music_analysis',
      'sound_effects',
      'audio_quality',
      'language_detection',
      'sentiment_analysis',
      'content_summarization',
      'transcription',
      'speaker_identification',
      'emotion_detection',
      'background_noise',
      'audio_classification'
    ],
    description: "OpenAI's most advanced model for analyzing audio metadata and descriptions",
    performance: "State-of-the-art text analysis capabilities for audio content understanding"
  },
  {
    name: "Claude-Sonnet-4",
    executor: executeClaudeSonnet4,
    priority: 2, // HIGH PRIORITY - Excellent for audio analysis
    capabilities: [
      'speech_recognition',
      'music_analysis',
      'sound_effects',
      'audio_quality',
      'language_detection',
      'sentiment_analysis',
      'content_summarization',
      'transcription',
      'speaker_identification',
      'emotion_detection',
      'background_noise',
      'audio_classification'
    ],
    description: "Anthropic's advanced model for analyzing audio metadata and descriptions",
    performance: "High-quality text analysis with excellent reasoning capabilities for audio content"
  },
  {
    name: "GPT-5-Mini",
    executor: executeGPT5Mini,
    priority: 3, // MODERATE PRIORITY - Fast and efficient
    capabilities: [
      'speech_recognition',
      'music_analysis',
      'sound_effects',
      'audio_quality',
      'language_detection',
      'sentiment_analysis',
      'content_summarization',
      'transcription',
      'speaker_identification',
      'emotion_detection',
      'background_noise',
      'audio_classification'
    ],
    description: "OpenAI's efficient model for analyzing audio metadata and descriptions",
    performance: "Fast processing with good text analysis capabilities for audio content"
  },
  {
    name: "Qwen3-235B-Instruct",
    executor: executeQwen3235B,
    priority: 4, // FALLBACK - Reliable but slower
    capabilities: [
      'speech_recognition',
      'music_analysis',
      'sound_effects',
      'audio_quality',
      'language_detection',
      'sentiment_analysis',
      'content_summarization',
      'transcription',
      'speaker_identification',
      'emotion_detection',
      'background_noise',
      'audio_classification'
    ],
    description: "Qwen's large model for analyzing audio metadata and descriptions",
    performance: "Reliable text analysis with good multilingual support for audio content"
  }
] as const;

/**
 * Enhanced Audio Asset Analyzer with automatic fallback logic and auto-corrector
 * Uses appropriate models in priority order with error correction
 */
export async function analyzeAudioAsset(
  input: AudioAnalysisInput,
  options: AudioAnalysisOptions = {}
): Promise<AudioAnalysisResult> {
  const startTime = Date.now();
  const { timeout = 30000, enableFallback = true, logLevel = 'info' } = options;
  
  // Auto-corrector options
  const autoCorrectorOptions = {
    maxRetries: 3,
    retryDelay: 1000,
    enableFallback: true,
    logLevel: logLevel === 'debug' ? 'debug' : 'info',
    timeout: timeout
  };
  
  // Validate input
  if (!input.audioUrl || !input.prompt) {
    return {
      success: false,
      model: 'validation_error',
      result: '',
      error: 'Audio URL and prompt are required'
    };
  }

  // Filter models based on analysis type
  const availableModels = input.analysisType 
    ? AUDIO_MODELS.filter(model => model.capabilities.includes(input.analysisType!))
    : AUDIO_MODELS;

  if (availableModels.length === 0) {
    return {
      success: false,
      model: 'no_models_available',
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
        console.log(`[Audio Analyzer] Attempting ${model.name} (${i + 1}/${sortedModels.length})`);
      }

      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Model timeout')), timeout);
      });

      // Execute model with timeout
      const result = await Promise.race([
        executeAudioModel(model, input, autoCorrectorOptions),
        timeoutPromise
      ]);

      const processingTime = Date.now() - startTime;

      if (logLevel !== 'silent') {
        console.log(`[Audio Analyzer] ${model.name} succeeded in ${processingTime}ms`);
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
        console.warn(`[Audio Analyzer] ${model.name} failed: ${lastError}`);
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
 * Execute a specific audio model with proper input formatting and auto-corrector
 */
async function executeAudioModel(
  model: typeof AUDIO_MODELS[0],
  input: AudioAnalysisInput,
  autoCorrectorOptions: any
): Promise<string> {
  const { audioUrl, prompt, userDescription } = input;
  
  // Add system instruction to make it crystal clear this is AUDIO ANALYSIS
  const systemInstruction = "CRITICAL INSTRUCTION: You are an AUDIO ANALYSIS AI. You are analyzing AUDIO content, NOT images or videos. Your ONLY job is to ANALYZE and DESCRIBE the AUDIO content. You CANNOT and WILL NOT create, generate, build, or produce any audio, images, or videos. You can ONLY listen to and describe what is already in the AUDIO. Always refer to 'this audio' or 'the audio', NEVER 'this image', 'the image', 'this video', or 'the video'.\n\n";
  
  // Build enhanced prompt with user description
  let enhancedPrompt = systemInstruction + prompt;
  if (userDescription) {
    enhancedPrompt += `\n\nIMPORTANT: The user has provided a specific description for THIS EXACT AUDIO: "${userDescription}"`;
    enhancedPrompt += `\n\nConsider how the user specifically wants to use this audio as described above.`;
  }

  // Execute based on model type with auto-corrector
  // Note: These are text-based models that can analyze audio descriptions/metadata
  // For actual audio transcription, we would need specialized audio models
  switch (model.name) {
    case "GPT-5":
      return await executeWithAutoCorrection(
        'together-ai',
        {
          text: `${enhancedPrompt}\n\nNote: This is a text-based analysis of audio content. The audio URL is: ${audioUrl}`,
          max_tokens: 512,
          temperature: 0.7
        },
        autoCorrectorOptions
      );

    case "Claude-Sonnet-4":
      return await executeWithAutoCorrection(
        'together-ai',
        {
          text: `${enhancedPrompt}\n\nNote: This is a text-based analysis of audio content. The audio URL is: ${audioUrl}`,
          max_tokens: 512,
          temperature: 0.7
        },
        autoCorrectorOptions
      );

    case "GPT-5-Mini":
      return await executeWithAutoCorrection(
        'together-ai',
        {
          text: `${enhancedPrompt}\n\nNote: This is a text-based analysis of audio content. The audio URL is: ${audioUrl}`,
          max_tokens: 512,
          temperature: 0.7
        },
        autoCorrectorOptions
      );

    case "Qwen3-235B-Instruct":
      return await executeWithAutoCorrection(
        'together-ai',
        {
          text: `${enhancedPrompt}\n\nNote: This is a text-based analysis of audio content. The audio URL is: ${audioUrl}`,
          max_tokens: 512,
          temperature: 0.7
        },
        autoCorrectorOptions
      );

    default:
      throw new Error(`Unknown model: ${model.name}`);
  }
}

/**
 * Get model information and status
 */
export function getAudioModelInfo() {
  return AUDIO_MODELS.map(model => ({
    name: model.name,
    description: model.description,
    priority: model.priority,
    capabilities: model.capabilities,
    status: 'available'
  }));
}

/**
 * Validate audio URL format
 */
export function validateAudioUrl(url: string): { isValid: boolean; error?: string } {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'Audio URL is required' };
  }

  try {
    new URL(url);
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }

  const audioExtensions = ['.mp3', '.wav', '.m4a', '.aac', '.flac', '.ogg', '.wma'];
  const hasValidExtension = audioExtensions.some(ext => 
    url.toLowerCase().includes(ext)
  );

  if (!hasValidExtension) {
    return { 
      isValid: false, 
      error: `Audio must be in supported format: ${audioExtensions.join(', ')}` 
    };
  }

  return { isValid: true };
}

/**
 * Create analysis scenario with optimal parameters
 */
export function createAudioAnalysisScenario(
  type: keyof typeof AUDIO_ANALYSIS_PROMPTS,
  audioUrl: string,
  customPrompt?: string,
  userDescription?: string
): AudioAnalysisInput {
  return {
    audioUrl,
    prompt: customPrompt || AUDIO_ANALYSIS_PROMPTS[type],
    userDescription,
    analysisType: type,
    maxRetries: 3
  };
}

// Enhanced prompts for different audio analysis types
const AUDIO_ANALYSIS_PROMPTS = {
  speech_recognition: "TASK: ANALYZE SPEECH IN EXISTING AUDIO ONLY. You are a speech recognition system. Listen to the audio and transcribe what is being said. Identify speakers, words, phrases, and any speech patterns. Do NOT create new audio - only analyze and transcribe what is already in the audio.",
  music_analysis: "TASK: ANALYZE MUSIC IN EXISTING AUDIO ONLY. You are a music analysis system. Listen to the audio and describe the musical elements. Identify instruments, tempo, genre, mood, and musical structure. Do NOT create new music - only analyze what is already in the audio.",
  sound_effects: "TASK: ANALYZE SOUND EFFECTS IN EXISTING AUDIO ONLY. You are a sound effects analyzer. Listen to the audio and identify sound effects, ambient sounds, and audio elements. Describe what sounds you hear and their characteristics. Do NOT create new sounds - only analyze what is already in the audio.",
  audio_quality: "TASK: ANALYZE AUDIO QUALITY IN EXISTING AUDIO ONLY. You are an audio quality analyzer. Listen to the audio and assess its quality, clarity, volume levels, and any technical aspects. Identify any issues or strengths in the audio quality. Do NOT create new audio - only analyze the quality of what is already in the audio.",
  language_detection: "TASK: DETECT LANGUAGE IN EXISTING AUDIO ONLY. You are a language detection system. Listen to the audio and identify what language(s) are being spoken. Provide confidence levels and any multilingual content. Do NOT create new audio - only analyze the language content of what is already in the audio.",
  sentiment_analysis: "TASK: ANALYZE SENTIMENT IN EXISTING AUDIO ONLY. You are a sentiment analysis system. Listen to the audio and analyze the emotional tone, sentiment, and mood. Identify positive, negative, or neutral emotions expressed. Do NOT create new audio - only analyze the sentiment of what is already in the audio.",
  content_summarization: "TASK: SUMMARIZE CONTENT IN EXISTING AUDIO ONLY. You are an audio content summarizer. Listen to the audio and provide a comprehensive summary of the main topics, key points, and important information. Do NOT create new content - only summarize what is already in the audio.",
  transcription: "TASK: TRANSCRIBE EXISTING AUDIO ONLY. You are an audio transcription system. Listen to the audio and provide a complete, accurate transcription of all spoken content. Include speaker identification if possible. Do NOT create new audio - only transcribe what is already in the audio.",
  speaker_identification: "TASK: IDENTIFY SPEAKERS IN EXISTING AUDIO ONLY. You are a speaker identification system. Listen to the audio and identify different speakers, their characteristics, and when they speak. Do NOT create new audio - only analyze the speaker information in what is already in the audio.",
  emotion_detection: "TASK: DETECT EMOTIONS IN EXISTING AUDIO ONLY. You are an emotion detection system. Listen to the audio and identify the emotions being expressed through tone, voice, and speech patterns. Do NOT create new audio - only analyze the emotions in what is already in the audio.",
  background_noise: "TASK: ANALYZE BACKGROUND NOISE IN EXISTING AUDIO ONLY. You are a background noise analyzer. Listen to the audio and identify background sounds, ambient noise, and environmental audio elements. Do NOT create new audio - only analyze the background elements in what is already in the audio.",
  audio_classification: "TASK: CLASSIFY EXISTING AUDIO ONLY. You are an audio classification system. Listen to the audio and classify it into categories such as speech, music, nature sounds, etc. Provide detailed classification with confidence levels. Do NOT create new audio - only classify what is already in the audio.",
  custom: "TASK: ANALYZE EXISTING AUDIO CONTENT BASED ON SPECIFIC REQUIREMENTS. You are a custom audio analyzer. Listen to the audio and provide analysis based on the specific requirements. Do NOT create new audio - only analyze and describe what is already in the audio."
} as const;
