/**
 * Replicate Qwen 2.5 Omni 7B Executor
 * 
 * Qwen 2.5 Omni 7B model for multimodal video understanding.
 * Excellent for comprehensive video analysis with text and audio understanding.
 * 
 * Model: lucataco/qwen2.5-omni-7b:0ca8160f7aaf85703a6aac282d6c79aa64d3541b239fa4c5c1688b10cb1faef1
 */

import Replicate from "replicate";

export interface ReplicateQwen25Omni7BInput {
  video: string; // URL to video file
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
}

export interface ReplicateQwen25Omni7BOutput {
  text: string;
  processing_time?: number;
}

export interface ReplicateQwen25Omni7BOptions {
  timeout?: number;
  retries?: number;
  onProgress?: (progress: any) => void;
}

/**
 * Execute Replicate Qwen 2.5 Omni 7B model for video analysis
 */
export async function executeReplicateQwen25Omni7B(
  input: ReplicateQwen25Omni7BInput,
  options: ReplicateQwen25Omni7BOptions = {}
): Promise<ReplicateQwen25Omni7BOutput> {
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
    if (!input.video || input.video.trim().length === 0) {
      throw new Error('Video URL is required');
    }

    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error('Prompt is required');
    }

    // Validate parameter ranges
    if (input.max_tokens && (input.max_tokens < 1 || input.max_tokens > 2048)) {
      throw new Error('max_tokens must be between 1 and 2048');
    }

    if (input.temperature && (input.temperature < 0 || input.temperature > 1)) {
      throw new Error('temperature must be between 0 and 1');
    }

    if (input.top_p && (input.top_p < 0 || input.top_p > 1)) {
      throw new Error('top_p must be between 0 and 1');
    }

    // Prepare the request payload
    const payload = {
      video: input.video.trim(),
      prompt: input.prompt.trim(),
      max_tokens: input.max_tokens || 1024,
      temperature: input.temperature || 0.1,
      top_p: input.top_p || 0.9,
      use_audio_in_video: false, // Disable audio analysis to avoid errors with videos without audio
    };

    console.log(`[Replicate-Qwen25-Omni-7B] Analyzing video with prompt: "${input.prompt.substring(0, 100)}..."`);

    const startTime = Date.now();

    // Execute the model
    const output = await replicate.run(
      "lucataco/qwen2.5-omni-7b:0ca8160f7aaf85703a6aac282d6c79aa64d3541b239fa4c5c1688b10cb1faef1",
      {
        input: payload,
      }
    );

    const processingTime = Date.now() - startTime;

    // Process the output
    const responseText = Array.isArray(output) ? output.join("") : String(output);

    console.log(`[Replicate-Qwen25-Omni-7B] Generated ${responseText.length} chars in ${processingTime}ms`);

    return {
      text: responseText.trim(),
      processing_time: processingTime
    };

  } catch (error) {
    console.error('[Replicate-Qwen25-Omni-7B] Execution failed:', error);
    throw new Error(`Replicate Qwen 2.5 Omni 7B execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create multimodal video analysis prompts
 */
export function createOmniVideoAnalysisPrompt(analysisType: 'comprehensive' | 'audio' | 'visual' | 'text' | 'narrative' | 'multimodal'): string {
  const prompts = {
    comprehensive: `Analyze this video comprehensively across all modalities:
1. Visual content: scenes, objects, people, actions
2. Audio content: speech, music, sounds, effects
3. Text content: any visible text or captions
4. Narrative structure: story, flow, message
5. Technical quality: production value, clarity
6. Overall assessment: purpose, effectiveness, appeal

Provide a detailed multimodal analysis.`,

    audio: `Focus specifically on the audio elements of this video:
1. Speech content: what is being said, by whom
2. Music and sound effects: background audio, atmosphere
3. Audio quality: clarity, volume, production
4. Audio-visual synchronization
5. Emotional impact of audio elements
6. Language and communication analysis

Analyze all auditory aspects in detail.`,

    visual: `Analyze the visual elements of this video in detail:
1. Visual composition and cinematography
2. Color palette and visual style
3. Scene changes and transitions
4. Objects, people, and environments
5. Visual effects and post-production
6. Camera work and framing

Focus on comprehensive visual analysis.`,

    text: `Identify and analyze any textual content in this video:
1. Visible text, titles, captions, subtitles
2. Graphics and overlays with text
3. Signs, labels, or written material
4. Text-to-speech or spoken content transcription
5. Context and meaning of textual elements
6. Readability and presentation quality

Extract and analyze all text-based information.`,

    narrative: `Analyze the narrative and storytelling aspects:
1. Story structure and plot progression
2. Characters and their development
3. Key messages and themes
4. Pacing and dramatic elements
5. Emotional journey and impact
6. Narrative techniques used

Focus on storytelling and content structure.`,

    multimodal: `Perform an integrated multimodal analysis:
1. How visual, audio, and text elements work together
2. Cross-modal consistency and reinforcement
3. Overall message coherence across modalities
4. Effectiveness of multimodal communication
5. Areas where modalities support or conflict
6. Holistic assessment of the content

Analyze the integration of all content types.`
  };

  return prompts[analysisType];
}

/**
 * Helper function to perform comprehensive multimodal video analysis
 */
export async function comprehensiveOmniVideoAnalysis(
  videoUrl: string,
  options: ReplicateQwen25Omni7BOptions = {}
): Promise<{
  comprehensiveAnalysis: string;
  audioAnalysis: string;
  visualAnalysis: string;
  textAnalysis: string;
  narrativeAnalysis: string;
  multimodalAnalysis: string;
  totalProcessingTime: number;
}> {
  try {
    const startTime = Date.now();

    // Run all analysis types in parallel
    const [
      comprehensiveResult,
      audioResult,
      visualResult,
      textResult,
      narrativeResult,
      multimodalResult
    ] = await Promise.all([
      executeReplicateQwen25Omni7B({
        video: videoUrl,
        prompt: createOmniVideoAnalysisPrompt('comprehensive'),
        max_tokens: 512
      }, options),

      executeReplicateQwen25Omni7B({
        video: videoUrl,
        prompt: createOmniVideoAnalysisPrompt('audio'),
        max_tokens: 384
      }, options),

      executeReplicateQwen25Omni7B({
        video: videoUrl,
        prompt: createOmniVideoAnalysisPrompt('visual'),
        max_tokens: 384
      }, options),

      executeReplicateQwen25Omni7B({
        video: videoUrl,
        prompt: createOmniVideoAnalysisPrompt('text'),
        max_tokens: 384
      }, options),

      executeReplicateQwen25Omni7B({
        video: videoUrl,
        prompt: createOmniVideoAnalysisPrompt('narrative'),
        max_tokens: 384
      }, options),

      executeReplicateQwen25Omni7B({
        video: videoUrl,
        prompt: createOmniVideoAnalysisPrompt('multimodal'),
        max_tokens: 384
      }, options),
    ]);

    const totalProcessingTime = Date.now() - startTime;

    return {
      comprehensiveAnalysis: comprehensiveResult.text,
      audioAnalysis: audioResult.text,
      visualAnalysis: visualResult.text,
      textAnalysis: textResult.text,
      narrativeAnalysis: narrativeResult.text,
      multimodalAnalysis: multimodalResult.text,
      totalProcessingTime
    };

  } catch (error) {
    console.error('[Qwen25-Omni-Comprehensive-Analysis] Failed:', error);
    throw new Error(`Qwen 2.5 Omni comprehensive analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Predefined prompts for Qwen 2.5 Omni specific tasks
 */
export const QWEN25_OMNI_PROMPTS = {
  general: 'Analyze this video and describe what you see, hear, and understand.',
  detailed: 'Provide a comprehensive multimodal analysis of this video including visual, audio, and textual elements.',
  transcription: 'Transcribe any speech or dialogue in this video.',
  summary: 'Summarize the main content and key points of this video.',
  objects: 'Identify all objects, people, and visual elements in this video.',
  audio_description: 'Describe all audio elements including speech, music, and sound effects.',
  scene_description: 'Describe each scene and sequence in this video.',
  quality_assessment: 'Assess the technical quality and production value of this video.',
  content_analysis: 'Analyze the content, message, and purpose of this video.',
  accessibility: 'Provide an accessibility description of this video for visually impaired users.',
  educational: 'Analyze this video from an educational perspective - what does it teach?',
  emotional: 'Analyze the emotional content and impact of this video.'
} as const;

/**
 * Helper function to estimate processing cost for Qwen 2.5 Omni 7B
 */
export function estimateQwen25Omni7BCost(videoDurationSeconds: number, numberOfAnalyses: number = 1): number {
  // Replicate pricing for Qwen 2.5 Omni 7B (approximate)
  const baseCostPerSecond = 0.001;
  const costMultiplier = Math.max(1, videoDurationSeconds / 30);
  
  return baseCostPerSecond * costMultiplier * numberOfAnalyses;
}

/**
 * Helper function for specialized audio-focused analysis
 */
export async function audioFocusedVideoAnalysis(
  videoUrl: string,
  options: ReplicateQwen25Omni7BOptions = {}
): Promise<{
  transcription: string;
  audioDescription: string;
  speechAnalysis: string;
  musicAnalysis: string;
  totalProcessingTime: number;
}> {
  try {
    const startTime = Date.now();

    const [
      transcriptionResult,
      audioDescResult,
      speechResult,
      musicResult
    ] = await Promise.all([
      executeReplicateQwen25Omni7B({
        video: videoUrl,
        prompt: 'Transcribe all speech and dialogue in this video. Include speaker identification if possible.',
        max_tokens: 512
      }, options),

      executeReplicateQwen25Omni7B({
        video: videoUrl,
        prompt: 'Describe all audio elements in this video including speech, music, sound effects, and ambient sounds.',
        max_tokens: 384
      }, options),

      executeReplicateQwen25Omni7B({
        video: videoUrl,
        prompt: 'Analyze the speech patterns, tone, emotion, and communication style in this video.',
        max_tokens: 384
      }, options),

      executeReplicateQwen25Omni7B({
        video: videoUrl,
        prompt: 'Describe any music, background audio, or sound effects. Analyze their mood and purpose.',
        max_tokens: 384
      }, options),
    ]);

    const totalProcessingTime = Date.now() - startTime;

    return {
      transcription: transcriptionResult.text,
      audioDescription: audioDescResult.text,
      speechAnalysis: speechResult.text,
      musicAnalysis: musicResult.text,
      totalProcessingTime
    };

  } catch (error) {
    console.error('[Qwen25-Omni-Audio-Analysis] Failed:', error);
    throw new Error(`Qwen 2.5 Omni audio analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export default executeReplicateQwen25Omni7B;
