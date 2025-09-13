import { fal } from "@fal-ai/client";

export interface MireloSFXVideoToAudioInput {
  video_url: string;
  text_prompt?: string;
  num_samples?: number;
  seed?: number;
  duration?: number;
}

export interface MireloSFXVideoToAudioOutput {
  audio: Array<{
    url: string;
    content_type: string;
    file_name: string;
    file_size?: number;
  }>;
}

export interface MireloSFXVideoToAudioOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Mirelo AI SFX v1 Video-to-Audio Executor
 * 
 * Generate synced sounds for any video, and return the new sound track.
 * AI-powered sound effects generation that analyzes video content and creates
 * synchronized audio tracks with realistic sound effects, ambient sounds, and audio enhancements.
 * 
 * @param input - The video-to-audio input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated audio tracks result
 */
export async function executeMireloSFXVideoToAudio(
  input: MireloSFXVideoToAudioInput,
  options: MireloSFXVideoToAudioOptions = {}
): Promise<MireloSFXVideoToAudioOutput> {
  try {
    // Validate required inputs
    if (!input.video_url || input.video_url.trim().length === 0) {
      throw new Error("Video URL is required");
    }

    // Validate video URL format
    try {
      new URL(input.video_url);
    } catch {
      throw new Error("Video URL must be a valid URL");
    }

    // Validate optional parameters
    if (input.text_prompt !== undefined) {
      if (input.text_prompt.length > 500) {
        throw new Error("Text prompt must be 500 characters or less");
      }
    }

    if (input.num_samples !== undefined) {
      if (input.num_samples < 1 || input.num_samples > 5) {
        throw new Error("Number of samples must be between 1 and 5");
      }
    }

    if (input.seed !== undefined) {
      if (input.seed < 0) {
        throw new Error("Seed must be a non-negative integer");
      }
    }

    if (input.duration !== undefined) {
      if (input.duration < 1 || input.duration > 60) {
        throw new Error("Duration must be between 1 and 60 seconds");
      }
    }

    // Prepare the request payload
    const payload: any = {
      video_url: input.video_url.trim()
    };

    // Add optional parameters only if they are provided
    if (input.text_prompt !== undefined) payload.text_prompt = input.text_prompt.trim();
    if (input.num_samples !== undefined) payload.num_samples = input.num_samples;
    if (input.seed !== undefined) payload.seed = input.seed;
    if (input.duration !== undefined) payload.duration = input.duration;

    // Execute the model
    const result = await fal.subscribe("mirelo-ai/sfx-v1/video-to-audio", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as MireloSFXVideoToAudioOutput;

  } catch (error) {
    console.error("Mirelo SFX Video-to-Audio execution failed:", error);
    throw new Error(`Mirelo SFX Video-to-Audio generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Mirelo SFX Video-to-Audio with queue management for long-running requests
 * 
 * @param input - The video-to-audio input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeMireloSFXVideoToAudioQueue(
  input: MireloSFXVideoToAudioInput,
  options: MireloSFXVideoToAudioOptions = {}
): Promise<{ request_id: string }> {
  try {
    // Validate input (same validation as above)
    if (!input.video_url || input.video_url.trim().length === 0) {
      throw new Error("Video URL is required");
    }

    try {
      new URL(input.video_url);
    } catch {
      throw new Error("Video URL must be a valid URL");
    }

    if (input.text_prompt !== undefined && input.text_prompt.length > 500) {
      throw new Error("Text prompt must be 500 characters or less");
    }

    if (input.num_samples !== undefined && (input.num_samples < 1 || input.num_samples > 5)) {
      throw new Error("Number of samples must be between 1 and 5");
    }

    if (input.seed !== undefined && input.seed < 0) {
      throw new Error("Seed must be a non-negative integer");
    }

    if (input.duration !== undefined && (input.duration < 1 || input.duration > 60)) {
      throw new Error("Duration must be between 1 and 60 seconds");
    }

    // Prepare the request payload (same as above)
    const payload: any = {
      video_url: input.video_url.trim()
    };

    if (input.text_prompt !== undefined) payload.text_prompt = input.text_prompt.trim();
    if (input.num_samples !== undefined) payload.num_samples = input.num_samples;
    if (input.seed !== undefined) payload.seed = input.seed;
    if (input.duration !== undefined) payload.duration = input.duration;

    // Submit to queue
    const { request_id } = await fal.queue.submit("mirelo-ai/sfx-v1/video-to-audio", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("Mirelo SFX Video-to-Audio queue submission failed:", error);
    throw new Error(`Mirelo SFX Video-to-Audio queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued Mirelo SFX Video-to-Audio request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkMireloSFXVideoToAudioStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("mirelo-ai/sfx-v1/video-to-audio", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("Mirelo SFX Video-to-Audio status check failed:", error);
    throw new Error(`Mirelo SFX Video-to-Audio status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed Mirelo SFX Video-to-Audio request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated audio tracks result
 */
export async function getMireloSFXVideoToAudioResult(
  requestId: string
): Promise<MireloSFXVideoToAudioOutput> {
  try {
    const result = await fal.queue.result("mirelo-ai/sfx-v1/video-to-audio", {
      requestId
    });

    return result.data as MireloSFXVideoToAudioOutput;

  } catch (error) {
    console.error("Mirelo SFX Video-to-Audio result retrieval failed:", error);
    throw new Error(`Mirelo SFX Video-to-Audio result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create common video-to-audio scenarios
 * 
 * @param type - Type of video-to-audio to create
 * @param videoUrl - Video URL to process
 * @param customPrompt - Custom text prompt (optional)
 * @param customSettings - Custom settings (optional)
 * @returns Mirelo SFX Video-to-Audio input configuration
 */
export function createVideoToAudioScenario(
  type: 'action' | 'nature' | 'dramatic' | 'ambient' | 'comedy' | 'horror' | 'documentary' | 'gaming' | 'custom',
  videoUrl: string,
  customPrompt?: string,
  customSettings?: Partial<MireloSFXVideoToAudioInput>
): MireloSFXVideoToAudioInput {
  const scenarioTemplates = {
    action: {
      text_prompt: "Add dramatic music, explosions, intense sound effects, and action-packed audio",
      num_samples: 3,
      duration: 15
    },
    nature: {
      text_prompt: "Add natural ambient sounds, bird calls, wind, water sounds, and forest atmosphere",
      num_samples: 2,
      duration: 20
    },
    dramatic: {
      text_prompt: "Add dramatic orchestral music, emotional sound effects, and cinematic audio",
      num_samples: 2,
      duration: 12
    },
    ambient: {
      text_prompt: "Add subtle ambient sounds, background music, and atmospheric audio",
      num_samples: 2,
      duration: 10
    },
    comedy: {
      text_prompt: "Add comedic sound effects, playful music, and humorous audio elements",
      num_samples: 3,
      duration: 8
    },
    horror: {
      text_prompt: "Add eerie sound effects, suspenseful music, and horror atmosphere",
      num_samples: 2,
      duration: 15
    },
    documentary: {
      text_prompt: "Add professional narration background, subtle music, and documentary-style audio",
      num_samples: 2,
      duration: 25
    },
    gaming: {
      text_prompt: "Add gaming sound effects, electronic music, and interactive audio elements",
      num_samples: 3,
      duration: 10
    },
    custom: {
      text_prompt: customPrompt || "Add appropriate sound effects and audio enhancement",
      num_samples: 2,
      duration: 10
    }
  };

  const template = scenarioTemplates[type];
  const settings = { ...template, ...customSettings };

  return {
    video_url: videoUrl,
    ...settings
  };
}

/**
 * Predefined text prompts for different video types
 */
export const VIDEO_TYPE_PROMPTS = {
  "action_scene": "Add dramatic music, explosions, intense sound effects, and action-packed audio",
  "nature_documentary": "Add natural ambient sounds, bird calls, wind, water sounds, and forest atmosphere",
  "dramatic_moment": "Add dramatic orchestral music, emotional sound effects, and cinematic audio",
  "ambient_scene": "Add subtle ambient sounds, background music, and atmospheric audio",
  "comedy_skit": "Add comedic sound effects, playful music, and humorous audio elements",
  "horror_scene": "Add eerie sound effects, suspenseful music, and horror atmosphere",
  "educational_content": "Add professional narration background, subtle music, and documentary-style audio",
  "gaming_content": "Add gaming sound effects, electronic music, and interactive audio elements",
  "product_demo": "Add professional background music, subtle sound effects, and clean audio",
  "social_media": "Add engaging music, trendy sound effects, and social media-appropriate audio",
  "training_video": "Add clear background music, instructional sound effects, and professional audio",
  "marketing_video": "Add compelling music, brand-appropriate sound effects, and marketing audio"
} as const;

/**
 * Supported video formats for processing
 */
export const SUPPORTED_VIDEO_FORMATS = [
  "MP4",
  "AVI", 
  "MOV",
  "MKV",
  "WEBM"
] as const;

/**
 * Example usage of the Mirelo SFX Video-to-Audio executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic video-to-audio conversion
    const result1 = await executeMireloSFXVideoToAudio({
      video_url: "https://di3otfzjg1gxa.cloudfront.net/input_example.mp4",
      num_samples: 2,
      seed: 2105,
      duration: 10
    });

    console.log("Generated audio tracks:", result1.audio);

    // Example 2: Using helper function for action scene
    const actionScene = createVideoToAudioScenario(
      'action',
      "https://example.com/action_scene.mp4"
    );
    const result2 = await executeMireloSFXVideoToAudio(actionScene);
    console.log("Action scene audio:", result2.audio);

    // Example 3: Nature documentary with custom settings
    const natureDoc = createVideoToAudioScenario(
      'nature',
      "https://example.com/nature_doc.mp4",
      "Add realistic forest sounds and bird calls",
      { num_samples: 3, duration: 25 }
    );
    const result3 = await executeMireloSFXVideoToAudio(natureDoc);
    console.log("Nature documentary audio:", result3.audio);

    // Example 4: Custom scenario with specific prompt
    const customScenario = createVideoToAudioScenario(
      'custom',
      "https://example.com/custom_video.mp4",
      "Add futuristic electronic music and sci-fi sound effects",
      { num_samples: 2, duration: 15, seed: 1234 }
    );
    const result4 = await executeMireloSFXVideoToAudio(customScenario);
    console.log("Custom scenario audio:", result4.audio);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeMireloSFXVideoToAudioQueue({
      video_url: "https://example.com/long_video.mp4",
      text_prompt: "Add comprehensive soundtrack with music and effects",
      num_samples: 3,
      duration: 30,
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkMireloSFXVideoToAudioStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getMireloSFXVideoToAudioResult(request_id);
      console.log("Queue result:", result);
    }

  } catch (error) {
    console.error("Example execution failed:", error);
  }
}

/**
 * Utility function to validate video URL
 * 
 * @param url - Video URL to validate
 * @returns boolean indicating if URL is valid
 */
export function isValidVideoUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const supportedFormats = SUPPORTED_VIDEO_FORMATS.map(format => format.toLowerCase());
    const pathname = parsedUrl.pathname.toLowerCase();
    
    // Check if URL has a supported video format extension
    const hasSupportedFormat = supportedFormats.some(format => 
      pathname.endsWith(`.${format}`)
    );
    
    return hasSupportedFormat;
  } catch {
    return false;
  }
}

/**
 * Utility function to estimate processing cost
 * 
 * @param duration - Duration in seconds
 * @param numSamples - Number of samples to generate
 * @returns Estimated cost in USD
 */
export function estimateProcessingCost(duration: number, numSamples: number): number {
  const costPerSecond = 0.007;
  return duration * numSamples * costPerSecond;
}

/**
 * Utility function to get optimal settings for video duration
 * 
 * @param videoDuration - Duration of the input video in seconds
 * @returns Recommended settings
 */
export function getOptimalSettings(videoDuration: number): {
  recommendedDuration: number;
  recommendedSamples: number;
  estimatedCost: number;
} {
  // Cap duration at 60 seconds max
  const recommendedDuration = Math.min(videoDuration, 60);
  
  // Recommend more samples for longer videos
  const recommendedSamples = videoDuration > 30 ? 3 : 2;
  
  const estimatedCost = estimateProcessingCost(recommendedDuration, recommendedSamples);
  
  return {
    recommendedDuration,
    recommendedSamples,
    estimatedCost
  };
}

export default executeMireloSFXVideoToAudio;
