/**
 * Replicate Apollo 7B Executor
 * 
 * Apollo 7B model for video understanding and analysis.
 * Excellent for video content analysis and video-based question answering.
 * 
 * Model: lucataco/apollo-7b:e282f76d0451b759128be3e8bccfe5ded8f521f4a7d705883e92f837e563f575
 */

import Replicate from "replicate";

export interface ReplicateApollo7BInput {
  video: string; // URL to video file
  prompt: string;
  temperature?: number;
  max_new_tokens?: number;
  top_p?: number;
}

export interface ReplicateApollo7BOutput {
  text: string;
  processing_time?: number;
}

export interface ReplicateApollo7BOptions {
  timeout?: number;
  retries?: number;
  onProgress?: (progress: any) => void;
}

/**
 * Execute Replicate Apollo 7B model for video analysis
 */
export async function executeReplicateApollo7B(
  input: ReplicateApollo7BInput,
  options: ReplicateApollo7BOptions = {}
): Promise<ReplicateApollo7BOutput> {
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
    if (input.max_new_tokens && (input.max_new_tokens < 1 || input.max_new_tokens > 2048)) {
      throw new Error('max_new_tokens must be between 1 and 2048');
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
      temperature: input.temperature || 0.4,
      max_new_tokens: input.max_new_tokens || 256,
      top_p: input.top_p || 0.7,
    };

    console.log(`[Replicate-Apollo-7B] Analyzing video with prompt: "${input.prompt.substring(0, 100)}..."`);

    const startTime = Date.now();

    // Execute the model
    const output = await replicate.run(
      "lucataco/apollo-7b:e282f76d0451b759128be3e8bccfe5ded8f521f4a7d705883e92f837e563f575",
      {
        input: payload,
      }
    );

    const processingTime = Date.now() - startTime;

    // Process the output
    const responseText = Array.isArray(output) ? output.join("") : String(output);

    console.log(`[Replicate-Apollo-7B] Generated ${responseText.length} chars in ${processingTime}ms`);

    return {
      text: responseText.trim(),
      processing_time: processingTime
    };

  } catch (error) {
    console.error('[Replicate-Apollo-7B] Execution failed:', error);
    throw new Error(`Replicate Apollo 7B execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create comprehensive video analysis prompts
 */
export function createVideoAnalysisPrompt(analysisType: 'content' | 'scenes' | 'objects' | 'action' | 'technical' | 'creative'): string {
  const prompts = {
    content: `Analyze this video comprehensively. Describe:
1. Main content and subject matter
2. Key scenes and sequences
3. Visual elements and composition
4. Audio elements (if any)
5. Overall narrative or flow
6. Quality and production value

Provide a detailed analysis of the video content.`,

    scenes: `Break down this video by scenes and sequences:
1. Identify distinct scenes or segments
2. Describe what happens in each scene
3. Note transitions and pacing
4. Highlight key moments or highlights
5. Analyze the overall structure

Focus on the temporal flow and scene breakdown.`,

    objects: `Identify and catalog all visible elements in this video:
1. Objects and items throughout the video
2. People and their activities
3. Settings and locations
4. Text or graphics that appear
5. Any notable visual elements

Provide a comprehensive inventory of video contents.`,

    action: `Analyze the actions and activities in this video:
1. What actions are taking place?
2. Who or what is performing these actions?
3. How do actions progress through the video?
4. What is the purpose or goal of these actions?
5. How well are actions executed?

Focus on movement, activities, and behavioral analysis.`,

    technical: `Assess the technical aspects of this video:
1. Video quality and resolution
2. Lighting and exposure
3. Camera work and stability
4. Audio quality (if present)
5. Editing and post-production
6. Overall production value

Provide a technical quality assessment.`,

    creative: `Evaluate this video from a creative perspective:
1. Visual style and aesthetic
2. Creative techniques used
3. Artistic merit and appeal
4. Mood and atmosphere
5. Creative potential for projects
6. Suggestions for enhancement

Think like a creative director analyzing footage.`
  };

  return prompts[analysisType];
}

/**
 * Helper function to perform comprehensive video analysis
 */
export async function comprehensiveVideoAnalysisWithApollo7B(
  videoUrl: string,
  options: ReplicateApollo7BOptions = {}
): Promise<{
  contentAnalysis: string;
  sceneBreakdown: string;
  objectInventory: string;
  actionAnalysis: string;
  technicalAssessment: string;
  creativeEvaluation: string;
  totalProcessingTime: number;
}> {
  try {
    const startTime = Date.now();

    // Run multiple analysis types in parallel
    const [
      contentResult,
      sceneResult,
      objectResult,
      actionResult,
      technicalResult,
      creativeResult
    ] = await Promise.all([
      executeReplicateApollo7B({
        video: videoUrl,
        prompt: createVideoAnalysisPrompt('content'),
        max_new_tokens: 512
      }, options),

      executeReplicateApollo7B({
        video: videoUrl,
        prompt: createVideoAnalysisPrompt('scenes'),
        max_new_tokens: 384
      }, options),

      executeReplicateApollo7B({
        video: videoUrl,
        prompt: createVideoAnalysisPrompt('objects'),
        max_new_tokens: 384
      }, options),

      executeReplicateApollo7B({
        video: videoUrl,
        prompt: createVideoAnalysisPrompt('action'),
        max_new_tokens: 384
      }, options),

      executeReplicateApollo7B({
        video: videoUrl,
        prompt: createVideoAnalysisPrompt('technical'),
        max_new_tokens: 384
      }, options),

      executeReplicateApollo7B({
        video: videoUrl,
        prompt: createVideoAnalysisPrompt('creative'),
        max_new_tokens: 384
      }, options),
    ]);

    const totalProcessingTime = Date.now() - startTime;

    return {
      contentAnalysis: contentResult.text,
      sceneBreakdown: sceneResult.text,
      objectInventory: objectResult.text,
      actionAnalysis: actionResult.text,
      technicalAssessment: technicalResult.text,
      creativeEvaluation: creativeResult.text,
      totalProcessingTime
    };

  } catch (error) {
    console.error('[Apollo7B-Comprehensive-Analysis] Failed:', error);
    throw new Error(`Apollo 7B comprehensive analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Predefined prompts for specific video analysis tasks
 */
export const APOLLO_7B_PROMPTS = {
  general: 'Describe what is happening in this video.',
  detailed: 'Provide a comprehensive description of this video including all visual elements, actions, and sequences.',
  summary: 'Summarize the main content and key points of this video.',
  objects: 'List all objects, people, and elements visible throughout this video.',
  actions: 'Describe all actions and activities taking place in this video.',
  scenes: 'Break down this video into distinct scenes or segments and describe each one.',
  quality: 'Assess the technical quality and production value of this video.',
  mood: 'What mood, tone, or atmosphere does this video convey?',
  purpose: 'What appears to be the purpose or intention of this video?',
  editing: 'Analyze the editing, pacing, and post-production techniques used in this video.',
  audio: 'Describe any audio elements, sounds, or music present in this video.',
  lighting: 'Analyze the lighting conditions and visual style of this video.'
} as const;

/**
 * Helper function to estimate processing cost for Apollo 7B
 */
export function estimateApollo7BCost(videoDurationSeconds: number, numberOfAnalyses: number = 1): number {
  // Replicate pricing for Apollo 7B (approximate, based on processing time)
  const baseCostPerSecond = 0.0012;
  const costMultiplier = Math.max(1, videoDurationSeconds / 30); // Longer videos cost more
  
  return baseCostPerSecond * costMultiplier * numberOfAnalyses;
}

/**
 * Helper function to validate video URL
 */
export function validateVideoInput(video: string): { isValid: boolean; error?: string } {
  if (!video || video.trim().length === 0) {
    return { isValid: false, error: 'Video URL is required' };
  }

  // Check if it's a valid URL
  try {
    const url = new URL(video);
    // Check for common video file extensions
    const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv', '.wmv'];
    const hasVideoExtension = videoExtensions.some(ext => 
      url.pathname.toLowerCase().includes(ext)
    );
    
    if (!hasVideoExtension && !url.hostname.includes('youtube') && !url.hostname.includes('vimeo')) {
      console.warn('[Apollo-7B] URL may not be a video file, but proceeding with analysis');
    }
    
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Video must be a valid URL' };
  }
}

/**
 * Helper function for batch video analysis
 */
export async function batchAnalyzeVideosWithApollo7B(
  videos: Array<{ url: string; prompt?: string }>,
  options: ReplicateApollo7BOptions = {}
): Promise<Array<{
  videoUrl: string;
  analysis: string;
  processingTime: number;
  success: boolean;
  error?: string;
}>> {
  const results = await Promise.allSettled(
    videos.map(async (video) => {
      const prompt = video.prompt || APOLLO_7B_PROMPTS.detailed;
      
      try {
        const result = await executeReplicateApollo7B({
          video: video.url,
          prompt: prompt,
          max_new_tokens: 512
        }, options);

        return {
          videoUrl: video.url,
          analysis: result.text,
          processingTime: result.processing_time || 0,
          success: true
        };
      } catch (error) {
        return {
          videoUrl: video.url,
          analysis: '',
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
        videoUrl: videos[index].url,
        analysis: '',
        processingTime: 0,
        success: false,
        error: result.reason?.message || 'Analysis failed'
      };
    }
  });
}

export default executeReplicateApollo7B;
