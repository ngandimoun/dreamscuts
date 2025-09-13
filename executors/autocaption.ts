import Replicate from "replicate";

export interface AutoCaptionInput {
  video_file_input: string;
  transcript_file_input?: string;
  output_video?: boolean;
  output_transcript?: boolean;
  subs_position?: 'bottom75' | 'center' | 'top' | 'bottom' | 'left' | 'right';
  color?: string;
  highlight_color?: string;
  fontsize?: number;
  MaxChars?: number;
  opacity?: number;
  font?: 'Poppins/Poppins-Bold.ttf' | 'Poppins/Poppins-BoldItalic.ttf' | 'Poppins/Poppins-ExtraBold.ttf' | 'Poppins/Poppins-ExtraBoldItalic.ttf' | 'Poppins/Poppins-Black.ttf' | 'Poppins/Poppins-BlackItalic.ttf' | 'Atkinson_Hyperlegible/AtkinsonHyperlegible-Bold.ttf' | 'Atkinson_Hyperlegible/AtkinsonHyperlegible-BoldItalic.ttf' | 'M_PLUS_Rounded_1c/MPLUSRounded1c-ExtraBold.ttf' | 'Arial/Arial_Bold.ttf' | 'Arial/Arial_BoldItalic.ttf' | 'Tajawal/Tajawal-Bold.ttf' | 'Tajawal/Tajawal-ExtraBold.ttf' | 'Tajawal/Tajawal-Black.ttf';
  kerning?: number;
  translate?: boolean;
  stroke_color?: string;
  stroke_width?: number;
  right_to_left?: boolean;
}

export interface AutoCaptionOutput {
  type: string[];
}

export interface AutoCaptionOptions {
  webhookUrl?: string;
  webhookEventsFilter?: string[];
  onProgress?: (progress: any) => void;
}

/**
 * AutoCaption Executor
 * 
 * AutoCaption is a powerful video captioning tool that automatically transcribes video content 
 * and adds karaoke-style captions with extensive customization options. It supports multiple 
 * fonts, colors, positions, and styling options to create professional-looking subtitles for videos.
 * 
 * @param input - The video captioning input parameters
 * @param options - Additional execution options
 * @returns Promise with the captioning result
 */
export async function executeAutoCaption(
  input: AutoCaptionInput,
  options: AutoCaptionOptions = {}
): Promise<string[]> {
  try {
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate required inputs
    if (!input.video_file_input || input.video_file_input.trim().length === 0) {
      throw new Error("Video file input is required");
    }

    // Validate optional parameters
    if (input.fontsize !== undefined && input.fontsize <= 0) {
      throw new Error("Font size must be greater than 0");
    }

    if (input.MaxChars !== undefined && input.MaxChars <= 0) {
      throw new Error("MaxChars must be greater than 0");
    }

    if (input.opacity !== undefined && (input.opacity < 0 || input.opacity > 1)) {
      throw new Error("Opacity must be between 0 and 1");
    }

    if (input.stroke_width !== undefined && input.stroke_width < 0) {
      throw new Error("Stroke width must be greater than or equal to 0");
    }

    // Prepare the request payload
    const payload: any = {
      video_file_input: input.video_file_input.trim(),
    };

    // Add optional parameters with defaults
    if (input.transcript_file_input !== undefined) payload.transcript_file_input = input.transcript_file_input.trim();
    if (input.output_video !== undefined) payload.output_video = input.output_video;
    if (input.output_transcript !== undefined) payload.output_transcript = input.output_transcript;
    if (input.subs_position !== undefined) payload.subs_position = input.subs_position;
    if (input.color !== undefined) payload.color = input.color;
    if (input.highlight_color !== undefined) payload.highlight_color = input.highlight_color;
    if (input.fontsize !== undefined) payload.fontsize = input.fontsize;
    if (input.MaxChars !== undefined) payload.MaxChars = input.MaxChars;
    if (input.opacity !== undefined) payload.opacity = input.opacity;
    if (input.font !== undefined) payload.font = input.font;
    if (input.kerning !== undefined) payload.kerning = input.kerning;
    if (input.translate !== undefined) payload.translate = input.translate;
    if (input.stroke_color !== undefined) payload.stroke_color = input.stroke_color;
    if (input.stroke_width !== undefined) payload.stroke_width = input.stroke_width;
    if (input.right_to_left !== undefined) payload.right_to_left = input.right_to_left;

    // Execute the model
    const output = await replicate.run(
      "fictions-ai/autocaption:aa083d4ac7604fb6d29bd3eef7bc36d7166b3a96628c995b61c179bd0bcc31d3",
      {
        input: payload,
        webhook: options.webhookUrl,
        webhook_events_filter: options.webhookEventsFilter,
      }
    );

    return output as string[];

  } catch (error) {
    console.error("AutoCaption execution failed:", error);
    throw new Error(`AutoCaption execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute AutoCaption with prediction management for long-running tasks
 * 
 * @param input - The video captioning input parameters
 * @param options - Additional execution options
 * @returns Promise with prediction object for tracking
 */
export async function executeAutoCaptionPrediction(
  input: AutoCaptionInput,
  options: AutoCaptionOptions = {}
): Promise<any> {
  try {
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate input (same validation as above)
    if (!input.video_file_input || input.video_file_input.trim().length === 0) {
      throw new Error("Video file input is required");
    }

    if (input.fontsize !== undefined && input.fontsize <= 0) {
      throw new Error("Font size must be greater than 0");
    }

    if (input.MaxChars !== undefined && input.MaxChars <= 0) {
      throw new Error("MaxChars must be greater than 0");
    }

    if (input.opacity !== undefined && (input.opacity < 0 || input.opacity > 1)) {
      throw new Error("Opacity must be between 0 and 1");
    }

    if (input.stroke_width !== undefined && input.stroke_width < 0) {
      throw new Error("Stroke width must be greater than or equal to 0");
    }

    // Prepare the request payload
    const payload: any = {
      video_file_input: input.video_file_input.trim(),
    };

    // Add optional parameters
    if (input.transcript_file_input !== undefined) payload.transcript_file_input = input.transcript_file_input.trim();
    if (input.output_video !== undefined) payload.output_video = input.output_video;
    if (input.output_transcript !== undefined) payload.output_transcript = input.output_transcript;
    if (input.subs_position !== undefined) payload.subs_position = input.subs_position;
    if (input.color !== undefined) payload.color = input.color;
    if (input.highlight_color !== undefined) payload.highlight_color = input.highlight_color;
    if (input.fontsize !== undefined) payload.fontsize = input.fontsize;
    if (input.MaxChars !== undefined) payload.MaxChars = input.MaxChars;
    if (input.opacity !== undefined) payload.opacity = input.opacity;
    if (input.font !== undefined) payload.font = input.font;
    if (input.kerning !== undefined) payload.kerning = input.kerning;
    if (input.translate !== undefined) payload.translate = input.translate;
    if (input.stroke_color !== undefined) payload.stroke_color = input.stroke_color;
    if (input.stroke_width !== undefined) payload.stroke_width = input.stroke_width;
    if (input.right_to_left !== undefined) payload.right_to_left = input.right_to_left;

    // Create prediction
    const prediction = await replicate.predictions.create({
      model: "fictions-ai/autocaption:aa083d4ac7604fb6d29bd3eef7bc36d7166b3a96628c995b61c179bd0bcc31d3",
      input: payload,
      webhook: options.webhookUrl,
      webhook_events_filter: options.webhookEventsFilter,
    });

    return prediction;

  } catch (error) {
    console.error("AutoCaption prediction creation failed:", error);
    throw new Error(`AutoCaption prediction creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of an AutoCaption prediction
 * 
 * @param predictionId - The prediction ID from prediction creation
 * @returns Promise with prediction status
 */
export async function checkAutoCaptionStatus(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.get(predictionId);
    return prediction;

  } catch (error) {
    console.error("AutoCaption status check failed:", error);
    throw new Error(`AutoCaption status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Cancel a running AutoCaption prediction
 * 
 * @param predictionId - The prediction ID to cancel
 * @returns Promise with cancellation result
 */
export async function cancelAutoCaptionPrediction(
  predictionId: string
): Promise<any> {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.cancel(predictionId);
    return prediction;

  } catch (error) {
    console.error("AutoCaption prediction cancellation failed:", error);
    throw new Error(`AutoCaption prediction cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create video captioning scenarios
 * 
 * @param type - Type of video captioning scenario to create
 * @param customVideoUrl - Custom video URL (optional)
 * @param customOptions - Custom options (optional)
 * @returns AutoCaption input configuration
 */
export function createCaptioningScenario(
  type: 'social_media' | 'educational' | 'marketing' | 'accessibility' | 'multilingual' | 'professional' | 'entertainment' | 'tutorial' | 'news' | 'corporate' | 'custom',
  customVideoUrl?: string,
  customOptions?: Partial<AutoCaptionInput>
): AutoCaptionInput {
  const scenarioTemplates = {
    social_media: {
      video_file_input: customVideoUrl || "https://example.com/reel.mp4",
      fontsize: 4,
      MaxChars: 10,
      subs_position: "bottom75" as const,
      color: "white",
      highlight_color: "yellow",
      output_video: true,
      output_transcript: true
    },
    educational: {
      video_file_input: customVideoUrl || "https://example.com/lecture.mp4",
      fontsize: 7,
      MaxChars: 20,
      subs_position: "bottom75" as const,
      color: "white",
      opacity: 0.8,
      font: "Atkinson_Hyperlegible/AtkinsonHyperlegible-Bold.ttf" as const,
      output_video: true,
      output_transcript: true
    },
    marketing: {
      video_file_input: customVideoUrl || "https://example.com/ad.mp4",
      fontsize: 7,
      MaxChars: 20,
      subs_position: "center" as const,
      color: "white",
      stroke_color: "black",
      stroke_width: 3,
      font: "Poppins/Poppins-Black.ttf" as const,
      output_video: true,
      output_transcript: true
    },
    accessibility: {
      video_file_input: customVideoUrl || "https://example.com/content.mp4",
      fontsize: 8,
      MaxChars: 25,
      subs_position: "bottom75" as const,
      color: "white",
      opacity: 0.9,
      stroke_color: "black",
      stroke_width: 3,
      font: "Atkinson_Hyperlegible/AtkinsonHyperlegible-Bold.ttf" as const,
      output_video: true,
      output_transcript: true
    },
    multilingual: {
      video_file_input: customVideoUrl || "https://example.com/spanish-video.mp4",
      translate: true,
      right_to_left: false,
      fontsize: 7,
      MaxChars: 20,
      output_video: true,
      output_transcript: true
    },
    professional: {
      video_file_input: customVideoUrl || "https://example.com/corporate-video.mp4",
      fontsize: 7,
      MaxChars: 20,
      subs_position: "bottom75" as const,
      color: "white",
      stroke_color: "black",
      stroke_width: 2.6,
      font: "Poppins/Poppins-Bold.ttf" as const,
      output_video: true,
      output_transcript: true
    },
    entertainment: {
      video_file_input: customVideoUrl || "https://example.com/entertainment.mp4",
      fontsize: 7,
      MaxChars: 20,
      subs_position: "bottom75" as const,
      color: "white",
      highlight_color: "yellow",
      font: "Poppins/Poppins-ExtraBold.ttf" as const,
      output_video: true,
      output_transcript: true
    },
    tutorial: {
      video_file_input: customVideoUrl || "https://example.com/tutorial.mp4",
      fontsize: 7,
      MaxChars: 20,
      subs_position: "bottom75" as const,
      color: "white",
      opacity: 0.8,
      font: "Atkinson_Hyperlegible/AtkinsonHyperlegible-Bold.ttf" as const,
      output_video: true,
      output_transcript: true
    },
    news: {
      video_file_input: customVideoUrl || "https://example.com/news.mp4",
      fontsize: 7,
      MaxChars: 20,
      subs_position: "bottom75" as const,
      color: "white",
      stroke_color: "black",
      stroke_width: 2.6,
      font: "Arial/Arial_Bold.ttf" as const,
      output_video: true,
      output_transcript: true
    },
    corporate: {
      video_file_input: customVideoUrl || "https://example.com/corporate.mp4",
      fontsize: 7,
      MaxChars: 20,
      subs_position: "bottom75" as const,
      color: "white",
      stroke_color: "black",
      stroke_width: 2.6,
      font: "Poppins/Poppins-Bold.ttf" as const,
      output_video: true,
      output_transcript: true
    },
    custom: {
      video_file_input: customVideoUrl || "https://example.com/video.mp4",
      fontsize: 7,
      MaxChars: 20,
      subs_position: "bottom75" as const,
      color: "white",
      highlight_color: "yellow",
      output_video: true,
      output_transcript: true
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
 * Predefined configuration templates for different video captioning scenarios
 */
export const CAPTIONING_TEMPLATES = {
  "social_media": {
    "description": "Optimized for social media reels and short videos",
    "settings": {
      "fontsize": 4,
      "MaxChars": 10,
      "subs_position": "bottom75",
      "color": "white",
      "highlight_color": "yellow"
    }
  },
  "educational": {
    "description": "Optimized for educational and tutorial content",
    "settings": {
      "fontsize": 7,
      "MaxChars": 20,
      "subs_position": "bottom75",
      "color": "white",
      "opacity": 0.8,
      "font": "Atkinson_Hyperlegible/AtkinsonHyperlegible-Bold.ttf"
    }
  },
  "marketing": {
    "description": "Optimized for marketing and promotional videos",
    "settings": {
      "fontsize": 7,
      "MaxChars": 20,
      "subs_position": "center",
      "color": "white",
      "stroke_color": "black",
      "stroke_width": 3,
      "font": "Poppins/Poppins-Black.ttf"
    }
  },
  "accessibility": {
    "description": "Optimized for accessibility and readability",
    "settings": {
      "fontsize": 8,
      "MaxChars": 25,
      "subs_position": "bottom75",
      "color": "white",
      "opacity": 0.9,
      "stroke_color": "black",
      "stroke_width": 3,
      "font": "Atkinson_Hyperlegible/AtkinsonHyperlegible-Bold.ttf"
    }
  },
  "multilingual": {
    "description": "Optimized for multilingual content with translation",
    "settings": {
      "translate": true,
      "right_to_left": false,
      "fontsize": 7,
      "MaxChars": 20
    }
  },
  "professional": {
    "description": "Optimized for professional and corporate content",
    "settings": {
      "fontsize": 7,
      "MaxChars": 20,
      "subs_position": "bottom75",
      "color": "white",
      "stroke_color": "black",
      "stroke_width": 2.6,
      "font": "Poppins/Poppins-Bold.ttf"
    }
  },
  "entertainment": {
    "description": "Optimized for entertainment and creative content",
    "settings": {
      "fontsize": 7,
      "MaxChars": 20,
      "subs_position": "bottom75",
      "color": "white",
      "highlight_color": "yellow",
      "font": "Poppins/Poppins-ExtraBold.ttf"
    }
  },
  "tutorial": {
    "description": "Optimized for tutorial and instructional content",
    "settings": {
      "fontsize": 7,
      "MaxChars": 20,
      "subs_position": "bottom75",
      "color": "white",
      "opacity": 0.8,
      "font": "Atkinson_Hyperlegible/AtkinsonHyperlegible-Bold.ttf"
    }
  },
  "news": {
    "description": "Optimized for news and journalism content",
    "settings": {
      "fontsize": 7,
      "MaxChars": 20,
      "subs_position": "bottom75",
      "color": "white",
      "stroke_color": "black",
      "stroke_width": 2.6,
      "font": "Arial/Arial_Bold.ttf"
    }
  },
  "corporate": {
    "description": "Optimized for corporate and business content",
    "settings": {
      "fontsize": 7,
      "MaxChars": 20,
      "subs_position": "bottom75",
      "color": "white",
      "stroke_color": "black",
      "stroke_width": 2.6,
      "font": "Poppins/Poppins-Bold.ttf"
    }
  }
} as const;

/**
 * Example usage of the AutoCaption executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic video captioning
    const result1 = await executeAutoCaption({
      video_file_input: "https://example.com/video.mp4",
      output_video: true,
      output_transcript: true
    });

    console.log("Captioning result:", result1);

    // Example 2: Using helper function for social media
    const socialMedia = createCaptioningScenario('social_media');
    const result2 = await executeAutoCaption(socialMedia);
    console.log("Social media captioning:", result2);

    // Example 3: Custom video captioning with specific parameters
    const customCaptioning = createCaptioningScenario(
      'custom',
      "https://example.com/custom-video.mp4",
      { fontsize: 8, MaxChars: 25, color: "yellow", highlight_color: "red" }
    );
    const result3 = await executeAutoCaption(customCaptioning);
    console.log("Custom captioning:", result3);

    // Example 4: Using predefined templates
    const result4 = await executeAutoCaption({
      video_file_input: "https://example.com/educational-video.mp4",
      ...CAPTIONING_TEMPLATES.educational.settings
    });
    console.log("Educational captioning:", result4);

    // Example 5: Prediction usage for long-running tasks
    const prediction = await executeAutoCaptionPrediction({
      video_file_input: "https://example.com/long-video.mp4",
      output_video: true,
      output_transcript: true,
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Prediction ID:", prediction.id);

    // Check status
    const status = await checkAutoCaptionStatus(prediction.id);
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
 * @param runs - Number of runs
 * @returns Estimated cost in USD
 */
export function estimateProcessingCost(runs: number): number {
  const costPerRun = 0.058;
  return runs * costPerRun;
}

/**
 * Utility function to validate video URL
 * 
 * @param url - The video URL to validate
 * @returns Validation result with suggestions
 */
export function validateVideoURL(url: string): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedURL: string; 
} {
  const suggestions: string[] = [];
  
  // Clean and format URL
  const formattedURL = url.trim();

  // Check for common issues
  if (!url || url.trim().length === 0) {
    suggestions.push("Video URL is required");
  }

  // Check for valid URL format
  try {
    new URL(url);
  } catch {
    suggestions.push("Video URL must be a valid URL");
  }

  // Check for valid video format
  if (!isValidVideoURL(url)) {
    suggestions.push("Video must be in supported format (MP4, AVI, MOV, WebM, MKV)");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedURL
  };
}

/**
 * Utility function to get optimal parameters for video type
 * 
 * @param videoType - Type of video content
 * @returns Recommended parameters
 */
export function getOptimalParameters(videoType: 'social_media' | 'educational' | 'marketing' | 'accessibility' | 'multilingual' | 'professional' | 'entertainment' | 'tutorial' | 'news' | 'corporate'): {
  fontsize: number;
  MaxChars: number;
  subs_position: string;
  color: string;
  highlight_color: string;
  opacity: number;
  font: string;
  stroke_color: string;
  stroke_width: number;
  description: string;
} {
  const parameterMap = {
    social_media: { 
      fontsize: 4, 
      MaxChars: 10, 
      subs_position: "bottom75",
      color: "white",
      highlight_color: "yellow",
      opacity: 0,
      font: "Poppins/Poppins-ExtraBold.ttf",
      stroke_color: "black",
      stroke_width: 2.6,
      description: "Optimized for social media reels and short videos"
    },
    educational: { 
      fontsize: 7, 
      MaxChars: 20, 
      subs_position: "bottom75",
      color: "white",
      highlight_color: "yellow",
      opacity: 0.8,
      font: "Atkinson_Hyperlegible/AtkinsonHyperlegible-Bold.ttf",
      stroke_color: "black",
      stroke_width: 2.6,
      description: "Optimized for educational and tutorial content"
    },
    marketing: { 
      fontsize: 7, 
      MaxChars: 20, 
      subs_position: "center",
      color: "white",
      highlight_color: "yellow",
      opacity: 0,
      font: "Poppins/Poppins-Black.ttf",
      stroke_color: "black",
      stroke_width: 3,
      description: "Optimized for marketing and promotional videos"
    },
    accessibility: { 
      fontsize: 8, 
      MaxChars: 25, 
      subs_position: "bottom75",
      color: "white",
      highlight_color: "yellow",
      opacity: 0.9,
      font: "Atkinson_Hyperlegible/AtkinsonHyperlegible-Bold.ttf",
      stroke_color: "black",
      stroke_width: 3,
      description: "Optimized for accessibility and readability"
    },
    multilingual: { 
      fontsize: 7, 
      MaxChars: 20, 
      subs_position: "bottom75",
      color: "white",
      highlight_color: "yellow",
      opacity: 0,
      font: "Poppins/Poppins-ExtraBold.ttf",
      stroke_color: "black",
      stroke_width: 2.6,
      description: "Optimized for multilingual content with translation"
    },
    professional: { 
      fontsize: 7, 
      MaxChars: 20, 
      subs_position: "bottom75",
      color: "white",
      highlight_color: "yellow",
      opacity: 0,
      font: "Poppins/Poppins-Bold.ttf",
      stroke_color: "black",
      stroke_width: 2.6,
      description: "Optimized for professional and corporate content"
    },
    entertainment: { 
      fontsize: 7, 
      MaxChars: 20, 
      subs_position: "bottom75",
      color: "white",
      highlight_color: "yellow",
      opacity: 0,
      font: "Poppins/Poppins-ExtraBold.ttf",
      stroke_color: "black",
      stroke_width: 2.6,
      description: "Optimized for entertainment and creative content"
    },
    tutorial: { 
      fontsize: 7, 
      MaxChars: 20, 
      subs_position: "bottom75",
      color: "white",
      highlight_color: "yellow",
      opacity: 0.8,
      font: "Atkinson_Hyperlegible/AtkinsonHyperlegible-Bold.ttf",
      stroke_color: "black",
      stroke_width: 2.6,
      description: "Optimized for tutorial and instructional content"
    },
    news: { 
      fontsize: 7, 
      MaxChars: 20, 
      subs_position: "bottom75",
      color: "white",
      highlight_color: "yellow",
      opacity: 0,
      font: "Arial/Arial_Bold.ttf",
      stroke_color: "black",
      stroke_width: 2.6,
      description: "Optimized for news and journalism content"
    },
    corporate: { 
      fontsize: 7, 
      MaxChars: 20, 
      subs_position: "bottom75",
      color: "white",
      highlight_color: "yellow",
      opacity: 0,
      font: "Poppins/Poppins-Bold.ttf",
      stroke_color: "black",
      stroke_width: 2.6,
      description: "Optimized for corporate and business content"
    }
  };

  return parameterMap[videoType];
}

/**
 * Utility function to create batch video captioning
 * 
 * @param videoUrlsArray - Array of video URLs
 * @param parametersArray - Array of parameter objects
 * @returns Array of AutoCaption inputs
 */
export function createBatchVideoCaptioning(
  videoUrlsArray: string[], 
  parametersArray: Partial<AutoCaptionInput>[]
): AutoCaptionInput[] {
  if (videoUrlsArray.length !== parametersArray.length) {
    throw new Error("Video URLs and parameters arrays must have the same length");
  }

  return videoUrlsArray.map((videoUrl, index) => ({
    video_file_input: videoUrl,
    ...parametersArray[index]
  }));
}

/**
 * Check if URL is a valid video format
 * 
 * @param url - The URL to check
 * @returns True if URL is a valid video format
 */
function isValidVideoURL(url: string): boolean {
  const videoExtensions = ['.mp4', '.avi', '.mov', '.webm', '.mkv'];
  return videoExtensions.some(ext => url.toLowerCase().includes(ext));
}

/**
 * Supported video formats
 */
export const SUPPORTED_VIDEO_FORMATS = [
  "MP4",
  "AVI", 
  "MOV",
  "WebM",
  "MKV"
] as const;

/**
 * Supported fonts
 */
export const SUPPORTED_FONTS = [
  "Poppins/Poppins-Bold.ttf",
  "Poppins/Poppins-BoldItalic.ttf",
  "Poppins/Poppins-ExtraBold.ttf",
  "Poppins/Poppins-ExtraBoldItalic.ttf",
  "Poppins/Poppins-Black.ttf",
  "Poppins/Poppins-BlackItalic.ttf",
  "Atkinson_Hyperlegible/AtkinsonHyperlegible-Bold.ttf",
  "Atkinson_Hyperlegible/AtkinsonHyperlegible-BoldItalic.ttf",
  "M_PLUS_Rounded_1c/MPLUSRounded1c-ExtraBold.ttf",
  "Arial/Arial_Bold.ttf",
  "Arial/Arial_BoldItalic.ttf",
  "Tajawal/Tajawal-Bold.ttf",
  "Tajawal/Tajawal-ExtraBold.ttf",
  "Tajawal/Tajawal-Black.ttf"
] as const;

/**
 * Supported subtitle positions
 */
export const SUPPORTED_POSITIONS = [
  "bottom75",
  "center",
  "top",
  "bottom",
  "left",
  "right"
] as const;

/**
 * Common video captioning scenarios
 */
export const VIDEO_CAPTIONING_SCENARIOS = {
  "social_media": "Social media video captioning (optimized for reels)",
  "educational": "Educational video subtitling",
  "marketing": "Marketing video enhancement",
  "accessibility": "Accessibility-focused captioning",
  "multilingual": "Multilingual video captioning with translation",
  "professional": "Professional and corporate content",
  "entertainment": "Entertainment content captioning",
  "tutorial": "Tutorial video enhancement",
  "news": "News and journalism captioning",
  "corporate": "Corporate video accessibility",
  "custom": "User-defined captioning scenarios"
} as const;

/**
 * Hardware requirements
 */
export const HARDWARE_REQUIREMENTS = {
  "gpu": "Nvidia L40S GPU",
  "memory": "High memory requirements for video processing",
  "processing_power": "High computational requirements",
  "storage": "Temporary storage for video processing"
} as const;

/**
 * Benchmark performance
 */
export const BENCHMARK_PERFORMANCE = {
  "transcription_accuracy": "High accuracy automatic transcription",
  "caption_timing": "Precise caption timing synchronization",
  "font_rendering": "High-quality font rendering and typography",
  "color_accuracy": "Accurate color and styling application",
  "positioning_precision": "Precise subtitle positioning",
  "character_handling": "Efficient character limit handling",
  "multilingual_support": "Comprehensive multi-language support",
  "translation_quality": "High-quality translation capabilities",
  "format_compatibility": "Wide format compatibility",
  "processing_speed": "Efficient processing and rendering",
  "video_quality": "Preserved video quality during processing",
  "accessibility_compliance": "Full accessibility compliance",
  "professional_appearance": "Professional-grade output quality",
  "typography_quality": "High-quality typography and text rendering",
  "effect_rendering": "Accurate stroke and effect rendering",
  "background_handling": "Proper background opacity handling",
  "rtl_support": "Right-to-left language support",
  "batch_processing": "Efficient batch processing capabilities",
  "error_handling": "Robust error handling and recovery",
  "output_quality": "High-quality output file generation"
} as const;

/**
 * Video captioning tips
 */
export const VIDEO_CAPTIONING_TIPS = {
  "font_size_optimization": "Use appropriate font sizes for different video types (7.0 for videos, 4.0 for reels)",
  "character_limit_optimization": "Set character limits based on video format (20 for videos, 10 for reels)",
  "positioning_optimization": "Choose subtitle positions that don't obstruct important visual content",
  "color_optimization": "Use high contrast colors for better readability",
  "background_optimization": "Consider background opacity for better text visibility",
  "font_selection": "Choose appropriate fonts for different languages and content types",
  "translation_optimization": "Enable translation for multilingual content",
  "stroke_optimization": "Use stroke effects for better text visibility on complex backgrounds",
  "positioning_testing": "Test different positioning options for optimal placement",
  "accessibility_optimization": "Consider accessibility requirements when choosing colors and fonts",
  "transcript_optimization": "Use custom transcripts for better accuracy when available",
  "platform_optimization": "Optimize settings based on target platform and audience",
  "professional_fonts": "Use professional fonts for corporate and educational content",
  "rtl_language_support": "Consider right-to-left languages when captioning Arabic or Hebrew content",
  "highlight_optimization": "Use highlight colors to emphasize important words or phrases",
  "kerning_optimization": "Adjust kerning for better text spacing and readability",
  "opacity_optimization": "Use appropriate opacity levels for different background types",
  "video_length_consideration": "Consider video length when choosing processing options",
  "batch_processing": "Use batch processing for multiple videos efficiently",
  "quality_testing": "Test output quality on different devices and platforms"
} as const;

export default executeAutoCaption;
