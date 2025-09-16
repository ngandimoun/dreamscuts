/**
 * Replicate Whisper Large V3 Executor
 * 
 * OpenAI Whisper Large V3 model for audio transcription and analysis.
 * State-of-the-art speech recognition and audio content analysis.
 * 
 * Model: openai/whisper-large-v3 (common Replicate model)
 */

import Replicate from "replicate";

export interface ReplicateWhisperLargeV3Input {
  audio: string; // URL to audio file
  model?: string;
  transcription?: 'plain_text' | 'srt' | 'vtt';
  translate?: boolean;
  language?: string;
  temperature?: number;
  patience?: number;
  suppress_tokens?: string;
  initial_prompt?: string;
  condition_on_previous_text?: boolean;
  temperature_increment_on_fallback?: number;
  compression_ratio_threshold?: number;
  logprob_threshold?: number;
  no_speech_threshold?: number;
}

export interface ReplicateWhisperLargeV3Output {
  transcription: string;
  language?: string;
  segments?: Array<{
    start: number;
    end: number;
    text: string;
    confidence?: number;
  }>;
  processing_time?: number;
}

export interface ReplicateWhisperLargeV3Options {
  timeout?: number;
  retries?: number;
  onProgress?: (progress: any) => void;
}

/**
 * Execute Replicate Whisper Large V3 model for audio analysis
 */
export async function executeReplicateWhisperLargeV3(
  input: ReplicateWhisperLargeV3Input,
  options: ReplicateWhisperLargeV3Options = {}
): Promise<ReplicateWhisperLargeV3Output> {
  try {
    // Validate API token
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error('REPLICATE_API_TOKEN environment variable is required');
    }

    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate required inputs
    if (!input.audio || input.audio.trim().length === 0) {
      throw new Error('Audio URL is required');
    }

    // Validate parameter ranges
    if (input.temperature && (input.temperature < 0 || input.temperature > 1)) {
      throw new Error('temperature must be between 0 and 1');
    }

    if (input.patience && (input.patience < 0 || input.patience > 10)) {
      throw new Error('patience must be between 0 and 10');
    }

    // Prepare the request payload
    const payload: any = {
      audio: input.audio.trim(),
      model: input.model || 'large-v3',
      transcription: input.transcription || 'plain_text',
      translate: input.translate || false,
      temperature: input.temperature || 0,
      patience: input.patience || 1,
      condition_on_previous_text: input.condition_on_previous_text !== false,
      temperature_increment_on_fallback: input.temperature_increment_on_fallback || 0.2,
      compression_ratio_threshold: input.compression_ratio_threshold || 2.4,
      logprob_threshold: input.logprob_threshold || -1.0,
      no_speech_threshold: input.no_speech_threshold || 0.6,
    };

    // Add optional parameters
    if (input.language) {
      payload.language = input.language;
    }

    if (input.suppress_tokens) {
      payload.suppress_tokens = input.suppress_tokens;
    }

    if (input.initial_prompt) {
      payload.initial_prompt = input.initial_prompt;
    }

    console.log(`[Replicate-Whisper-Large-V3] Processing audio transcription`);

    const startTime = Date.now();

    // Execute the model - using a generic whisper model endpoint
    const output = await replicate.run(
      "openai/whisper-large-v3:4d50797290df275329f202e48c76360b3f22b08d28c196cbc54600319435f8d2",
      {
        input: payload,
      }
    );

    const processingTime = Date.now() - startTime;

    // Process the output
    let transcription = '';
    let segments: Array<{start: number; end: number; text: string; confidence?: number}> = [];
    let detectedLanguage = '';

    if (typeof output === 'string') {
      transcription = output;
    } else if (output && typeof output === 'object') {
      // Handle different output formats
      if ((output as any).transcription) {
        transcription = (output as any).transcription;
      } else if ((output as any).text) {
        transcription = (output as any).text;
      } else if (Array.isArray(output)) {
        transcription = output.join(' ');
      }

      // Extract segments if available
      if ((output as any).segments) {
        segments = (output as any).segments;
      }

      // Extract detected language if available
      if ((output as any).language) {
        detectedLanguage = (output as any).language;
      }
    }

    console.log(`[Replicate-Whisper-Large-V3] Transcribed ${transcription.length} chars in ${processingTime}ms`);

    return {
      transcription: transcription.trim(),
      language: detectedLanguage,
      segments: segments.length > 0 ? segments : undefined,
      processing_time: processingTime
    };

  } catch (error) {
    console.error('[Replicate-Whisper-Large-V3] Execution failed:', error);
    throw new Error(`Replicate Whisper Large V3 execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to perform comprehensive audio analysis
 */
export async function comprehensiveAudioAnalysisWithWhisper(
  audioUrl: string,
  options: ReplicateWhisperLargeV3Options = {}
): Promise<{
  transcription: string;
  language: string;
  segments?: Array<{start: number; end: number; text: string; confidence?: number}>;
  summary: string;
  keyPoints: string[];
  sentiment: string;
  topics: string[];
  speakerCount: number;
  totalProcessingTime: number;
}> {
  try {
    const startTime = Date.now();

    // First, get the basic transcription
    const transcriptionResult = await executeReplicateWhisperLargeV3({
      audio: audioUrl,
      transcription: 'plain_text',
      temperature: 0,
      condition_on_previous_text: true
    }, options);

    // Analyze the transcription using a simple analysis
    const transcription = transcriptionResult.transcription;
    
    // Simple analysis (in a real implementation, you might use additional NLP models)
    const sentences = transcription.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = transcription.split(/\s+/).filter(w => w.length > 0);
    
    // Extract key points (first sentence of each paragraph or every 3rd sentence)
    const keyPoints = sentences.filter((_, index) => index % 3 === 0).slice(0, 5);
    
    // Simple topic extraction (most common significant words)
    const topicWords = words
      .filter(word => word.length > 4)
      .filter(word => !/^(the|and|but|for|with|from|that|this|they|them|their|there|where|when|what|how|why|because|before|after|during|through|about|above|below|between|under|over)$/i.test(word))
      .reduce((acc: Record<string, number>, word: string) => {
        const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
        acc[cleanWord] = (acc[cleanWord] || 0) + 1;
        return acc;
      }, {});
    
    const topics = Object.entries(topicWords)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);

    // Simple speaker count estimation (based on dialogue patterns)
    const dialogueMarkers = transcription.match(/["""'']/g) || [];
    const speakerCount = Math.max(1, Math.ceil(dialogueMarkers.length / 4));

    // Simple sentiment analysis (based on positive/negative words)
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'enjoy', 'happy', 'pleased'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'sad', 'angry', 'disappointed', 'frustrated'];
    
    const positiveCount = positiveWords.reduce((count, word) => 
      count + (transcription.toLowerCase().match(new RegExp(word, 'g')) || []).length, 0);
    const negativeCount = negativeWords.reduce((count, word) => 
      count + (transcription.toLowerCase().match(new RegExp(word, 'g')) || []).length, 0);
    
    let sentiment = 'neutral';
    if (positiveCount > negativeCount) {
      sentiment = 'positive';
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
    }

    // Create summary (first 2 sentences + key insight)
    const summary = sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '...' : '');

    const totalProcessingTime = Date.now() - startTime;

    return {
      transcription: transcriptionResult.transcription,
      language: transcriptionResult.language || 'unknown',
      segments: transcriptionResult.segments,
      summary,
      keyPoints,
      sentiment,
      topics,
      speakerCount,
      totalProcessingTime
    };

  } catch (error) {
    console.error('[Whisper-Comprehensive-Analysis] Failed:', error);
    throw new Error(`Whisper comprehensive analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to estimate processing cost for Whisper Large V3
 */
export function estimateWhisperLargeV3Cost(audioDurationSeconds: number): number {
  // Replicate pricing for Whisper Large V3 (approximate)
  const costPerSecond = 0.00006; // $0.00006 per second
  
  return audioDurationSeconds * costPerSecond;
}

/**
 * Helper function to validate audio URL
 */
export function validateAudioInput(audio: string): { isValid: boolean; error?: string } {
  if (!audio || audio.trim().length === 0) {
    return { isValid: false, error: 'Audio URL is required' };
  }

  // Check if it's a valid URL
  try {
    const url = new URL(audio);
    // Check for common audio file extensions
    const audioExtensions = ['.mp3', '.wav', '.flac', '.m4a', '.aac', '.ogg', '.wma'];
    const hasAudioExtension = audioExtensions.some(ext => 
      url.pathname.toLowerCase().includes(ext)
    );
    
    if (!hasAudioExtension) {
      console.warn('[Whisper-Large-V3] URL may not be an audio file, but proceeding with analysis');
    }
    
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Audio must be a valid URL' };
  }
}

/**
 * Supported languages for Whisper
 */
export const WHISPER_SUPPORTED_LANGUAGES = [
  'af', 'am', 'ar', 'as', 'az', 'ba', 'be', 'bg', 'bn', 'bo', 'br', 'bs', 'ca', 'cs', 'cy', 'da', 'de', 'el', 'en', 'es', 'et', 'eu', 'fa', 'fi', 'fo', 'fr', 'gl', 'gu', 'ha', 'haw', 'he', 'hi', 'hr', 'ht', 'hu', 'hy', 'id', 'is', 'it', 'ja', 'jw', 'ka', 'kk', 'km', 'kn', 'ko', 'la', 'lb', 'ln', 'lo', 'lt', 'lv', 'mg', 'mi', 'mk', 'ml', 'mn', 'mr', 'ms', 'mt', 'my', 'ne', 'nl', 'nn', 'no', 'oc', 'pa', 'pl', 'ps', 'pt', 'ro', 'ru', 'sa', 'sd', 'si', 'sk', 'sl', 'sn', 'so', 'sq', 'sr', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'tk', 'tl', 'tr', 'tt', 'uk', 'ur', 'uz', 'vi', 'yi', 'yo', 'zh'
] as const;

/**
 * Helper function for batch audio processing
 */
export async function batchAnalyzeAudioWithWhisper(
  audioFiles: Array<{ url: string; language?: string }>,
  options: ReplicateWhisperLargeV3Options = {}
): Promise<Array<{
  audioUrl: string;
  transcription: string;
  language: string;
  processingTime: number;
  success: boolean;
  error?: string;
}>> {
  const results = await Promise.allSettled(
    audioFiles.map(async (audio) => {
      try {
        const result = await executeReplicateWhisperLargeV3({
          audio: audio.url,
          language: audio.language,
          transcription: 'plain_text'
        }, options);

        return {
          audioUrl: audio.url,
          transcription: result.transcription,
          language: result.language || 'unknown',
          processingTime: result.processing_time || 0,
          success: true
        };
      } catch (error) {
        return {
          audioUrl: audio.url,
          transcription: '',
          language: 'unknown',
          processingTime: 0,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    })
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        audioUrl: audioFiles[index].url,
        transcription: '',
        language: 'unknown',
        processingTime: 0,
        success: false,
        error: result.reason?.message || 'Analysis failed'
      };
    }
  });
}

export default executeReplicateWhisperLargeV3;
