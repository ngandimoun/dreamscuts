import { fal } from "@fal-ai/client";

export interface MiniMaxMusicInput {
  prompt: string;
  reference_audio_url: string;
}

export interface MiniMaxMusicOutput {
  audio: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

export interface MiniMaxMusicOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI MiniMax Music Generation Executor
 * 
 * Generate music from text prompts using the MiniMax model, which leverages 
 * advanced AI techniques to create high-quality, diverse musical compositions. 
 * Text-to-music generation with reference audio support for style transfer and musical composition.
 * 
 * @param input - The music generation input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated music result
 */
export async function executeMiniMaxMusic(
  input: MiniMaxMusicInput,
  options: MiniMaxMusicOptions = {}
): Promise<MiniMaxMusicOutput> {
  try {
    // Validate required inputs
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (!input.reference_audio_url || input.reference_audio_url.trim().length === 0) {
      throw new Error("Reference audio URL is required");
    }

    // Validate prompt length
    if (input.prompt.length > 600) {
      throw new Error("Prompt must be 600 characters or less");
    }

    if (input.prompt.length < 10) {
      throw new Error("Prompt must be at least 10 characters");
    }

    // Validate reference audio URL format
    if (!isValidAudioURL(input.reference_audio_url)) {
      throw new Error("Reference audio must be a .wav or .mp3 file");
    }

    // Prepare the request payload
    const payload = {
      prompt: input.prompt.trim(),
      reference_audio_url: input.reference_audio_url.trim()
    };

    // Execute the model
    const result = await fal.subscribe("fal-ai/minimax-music", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as MiniMaxMusicOutput;

  } catch (error) {
    console.error("Fal AI MiniMax Music generation execution failed:", error);
    throw new Error(`Fal AI MiniMax Music generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Fal AI MiniMax Music with queue management for batch processing
 * 
 * @param input - The music generation input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeMiniMaxMusicQueue(
  input: MiniMaxMusicInput,
  options: MiniMaxMusicOptions = {}
): Promise<{ request_id: string }> {
  try {
    // Validate input (same validation as above)
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (!input.reference_audio_url || input.reference_audio_url.trim().length === 0) {
      throw new Error("Reference audio URL is required");
    }

    if (input.prompt.length > 600) {
      throw new Error("Prompt must be 600 characters or less");
    }

    if (input.prompt.length < 10) {
      throw new Error("Prompt must be at least 10 characters");
    }

    if (!isValidAudioURL(input.reference_audio_url)) {
      throw new Error("Reference audio must be a .wav or .mp3 file");
    }

    // Prepare the request payload
    const payload = {
      prompt: input.prompt.trim(),
      reference_audio_url: input.reference_audio_url.trim()
    };

    // Submit to queue
    const { request_id } = await fal.queue.submit("fal-ai/minimax-music", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("Fal AI MiniMax Music queue submission failed:", error);
    throw new Error(`Fal AI MiniMax Music queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued Fal AI MiniMax Music request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkMiniMaxMusicStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/minimax-music", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("Fal AI MiniMax Music status check failed:", error);
    throw new Error(`Fal AI MiniMax Music status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed Fal AI MiniMax Music request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated music result
 */
export async function getMiniMaxMusicResult(
  requestId: string
): Promise<MiniMaxMusicOutput> {
  try {
    const result = await fal.queue.result("fal-ai/minimax-music", {
      requestId
    });

    return result.data as MiniMaxMusicOutput;

  } catch (error) {
    console.error("Fal AI MiniMax Music result retrieval failed:", error);
    throw new Error(`Fal AI MiniMax Music result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create music generation scenarios
 * 
 * @param type - Type of music generation scenario to create
 * @param customPrompt - Custom prompt (optional)
 * @param customReferenceAudio - Custom reference audio URL (optional)
 * @param customOptions - Custom options (optional)
 * @returns MiniMax Music input configuration
 */
export function createMiniMaxMusicScenario(
  type: 'upbeat' | 'calm' | 'inspiring' | 'dance' | 'rock' | 'pop' | 'acoustic' | 'electronic' | 'custom',
  customPrompt?: string,
  customReferenceAudio?: string,
  customOptions?: Partial<MiniMaxMusicInput>
): MiniMaxMusicInput {
  const scenarioTemplates = {
    upbeat: {
      prompt: customPrompt || `## Fast and Limitless
In the heart of the code, where dreams collide,

FAL's the name, taking tech for a ride.
Generative media, blazing the trail,

Fast inference power, we'll never fail.
##`,
      reference_audio_url: customReferenceAudio || "https://fal.media/files/lion/OOTBTSlxKMH_E8H6hoSlb.mpga"
    },
    calm: {
      prompt: customPrompt || `In the quiet of the night

When stars are shining bright

We find our way together

Through stormy weather`,
      reference_audio_url: customReferenceAudio || "https://example.com/calm-song.mp3"
    },
    inspiring: {
      prompt: customPrompt || `## Rise Up and Shine
Every challenge makes us stronger

Every step brings us closer

To the dreams we're chasing

In this world of wonder
##`,
      reference_audio_url: customReferenceAudio || "https://example.com/inspiring-song.mp3"
    },
    dance: {
      prompt: customPrompt || `Feel the rhythm in your soul
Let the music take control
Dancing through the night away
This is our time to play`,
      reference_audio_url: customReferenceAudio || "https://example.com/dance-song.mp3"
    },
    rock: {
      prompt: customPrompt || `## Breaking Through
Thunder in the distance, lightning in the sky
Ready for resistance, this is our time to fly
Guitars are screaming, drums are beating
This is our time for meeting
##`,
      reference_audio_url: customReferenceAudio || "https://example.com/rock-song.mp3"
    },
    pop: {
      prompt: customPrompt || `Walking down the street, feeling the beat
Life is so sweet, nothing to defeat
Sunshine in my eyes, blue in the skies
This is my time to rise`,
      reference_audio_url: customReferenceAudio || "https://example.com/pop-song.mp3"
    },
    acoustic: {
      prompt: customPrompt || `Sitting by the window, watching the rain
Thinking of the memories, feeling no pain
Time goes by so slowly here
Everything is clear, everything is clear`,
      reference_audio_url: customReferenceAudio || "https://example.com/acoustic-song.mp3"
    },
    electronic: {
      prompt: customPrompt || `## Digital Dreams
Bass is pumping, lights are flashing
Dancing, jumping, never crashing
Electronic symphony in the air
This is our time to share
##`,
      reference_audio_url: customReferenceAudio || "https://example.com/electronic-song.mp3"
    },
    custom: {
      prompt: customPrompt || `Custom lyrics for your song
Make it short or make it long
This is where your story starts
Let it come from your heart`,
      reference_audio_url: customReferenceAudio || "https://example.com/custom-song.mp3"
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
 * Predefined prompt templates for different music styles
 */
export const PROMPT_TEMPLATES = {
  "upbeat": [
    `## Fast and Limitless
In the heart of the code, where dreams collide,

FAL's the name, taking tech for a ride.
Generative media, blazing the trail,

Fast inference power, we'll never fail.
##`,
    `## Energy and Power
Feel the rhythm in your soul
Let the music take control
Dancing through the night away
This is our time to play
##`
  ],
  "calm": [
    `In the quiet of the night

When stars are shining bright

We find our way together

Through stormy weather`,
    `Softly falling rain on the window pane
Quiet thoughts remain, nothing to explain
Gentle breeze is blowing through the trees
Bringing peace, bringing peace`
  ],
  "inspiring": [
    `## Rise Up and Shine
Every challenge makes us stronger

Every step brings us closer

To the dreams we're chasing

In this world of wonder
##`,
    `## You Can Do It
Rise up from the ashes, stronger than before
Open up the doors, there's so much more
Every step you take is a victory
This is your story, this is your story
##`
  ],
  "dance": [
    `Feel the rhythm in your soul
Let the music take control
Dancing through the night away
This is our time to play`,
    `Energy is flowing, hearts are glowing
Life is showing, we're all knowing
Dancing, jumping, never stopping
This is our time for topping`
  ],
  "rock": [
    `## Breaking Through
Thunder in the distance, lightning in the sky
Ready for resistance, this is our time to fly
Guitars are screaming, drums are beating
This is our time for meeting
##`,
    `## Rock and Roll Forever
Breaking through the silence, hear my voice
Making all the noise, I have no choice
Standing up for what I believe
This is what I need, this is what I need
##`
  ],
  "pop": [
    `Walking down the street, feeling the beat
Life is so sweet, nothing to defeat
Sunshine in my eyes, blue in the skies
This is my time to rise`,
    `Staring at the sunset, colors paint the sky
Thoughts of you keep swirling, can't deny
I know I let you down, I made mistakes
But I'm here to mend the heart I didn't break`
  ],
  "acoustic": [
    `Sitting by the window, watching the rain
Thinking of the memories, feeling no pain
Time goes by so slowly here
Everything is clear, everything is clear`,
    `Guitar strings are singing, soft and low
Gentle winds are bringing, peace I know
Simple life is calling, this is home
Never more alone, never more alone`
  ],
  "electronic": [
    `## Digital Dreams
Bass is pumping, lights are flashing
Dancing, jumping, never crashing
Electronic symphony in the air
This is our time to share
##`,
    `## Future Sound
Digital dreams in the neon light
Dancing through the night, everything's bright
Synthetic sounds and electric beats
Moving to the rhythm, feeling the heat
##`
  ]
} as const;

/**
 * Example usage of the Fal AI MiniMax Music executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic music generation with accompaniment
    const result1 = await executeMiniMaxMusic({
      prompt: `## Fast and Limitless
In the heart of the code, where dreams collide,

FAL's the name, taking tech for a ride.
Generative media, blazing the trail,

Fast inference power, we'll never fail.
##`,
      reference_audio_url: "https://fal.media/files/lion/OOTBTSlxKMH_E8H6hoSlb.mpga"
    });

    console.log("Generated music URL:", result1.audio.url);

    // Example 2: Using helper function for calm music
    const calmMusic = createMiniMaxMusicScenario('calm');
    const result2 = await executeMiniMaxMusic(calmMusic);
    console.log("Calm music:", result2.audio.url);

    // Example 3: Custom prompt with specific reference audio
    const customMusic = createMiniMaxMusicScenario(
      'custom',
      `## Custom Creation
This is where your story starts
Let it come from your heart
Custom music generation
For your own creation
##`,
      "https://example.com/custom-reference.mp3"
    );
    const result3 = await executeMiniMaxMusic(customMusic);
    console.log("Custom music:", result3.audio.url);

    // Example 4: Using predefined templates
    const result4 = await executeMiniMaxMusic({
      prompt: PROMPT_TEMPLATES.inspiring[0],
      reference_audio_url: "https://example.com/inspiring-reference.mp3"
    });
    console.log("Inspiring music:", result4.audio.url);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeMiniMaxMusicQueue({
      prompt: `In the quiet of the night

When stars are shining bright

We find our way together

Through stormy weather`,
      reference_audio_url: "https://example.com/calm-reference.mp3",
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkMiniMaxMusicStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getMiniMaxMusicResult(request_id);
      console.log("Queue result:", result);
    }

  } catch (error) {
    console.error("Example execution failed:", error);
  }
}

/**
 * Utility function to estimate processing cost
 * 
 * @param numberOfGenerations - Number of generations to estimate
 * @returns Estimated cost in USD
 */
export function estimateProcessingCost(numberOfGenerations: number): number {
  const costPerGeneration = 0.035;
  return numberOfGenerations * costPerGeneration;
}

/**
 * Utility function to validate prompt format
 * 
 * @param prompt - The prompt string to validate
 * @returns Validation result with suggestions
 */
export function validatePromptFormat(prompt: string): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedPrompt: string; 
} {
  const suggestions: string[] = [];
  
  // Clean and format prompt
  const formattedPrompt = prompt.trim();

  // Check for common issues
  if (prompt.length > 600) {
    suggestions.push("Prompt is too long (max 600 characters)");
  }

  if (prompt.length < 10) {
    suggestions.push("Prompt is too short, consider adding more content");
  }

  // Check for proper formatting
  const hasAccompaniment = /^##.*##$/s.test(prompt);
  const hasNewlines = /\n/.test(prompt);
  const hasDoubleNewlines = /\n\n/.test(prompt);
  
  if (!hasAccompaniment && !hasNewlines) {
    suggestions.push("Consider using newlines to separate lines or ## for accompaniment");
  }
  
  if (!hasDoubleNewlines) {
    suggestions.push("Consider using double newlines to add pauses between lines");
  }

  // Check for very long lines
  const lines = prompt.split('\n');
  const longLines = lines.filter(line => line.trim().length > 100);
  if (longLines.length > 0) {
    suggestions.push("Consider breaking up very long lines for better music generation");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedPrompt
  };
}

/**
 * Utility function to validate reference audio URL
 * 
 * @param url - The reference audio URL to validate
 * @returns Validation result with suggestions
 */
export function validateReferenceAudioURL(url: string): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedURL: string; 
} {
  const suggestions: string[] = [];
  
  // Clean and format URL
  const formattedURL = url.trim();

  // Check for common issues
  if (!url || url.trim().length === 0) {
    suggestions.push("Reference audio URL is required");
  }

  // Check for valid audio format
  if (!isValidAudioURL(url)) {
    suggestions.push("Reference audio must be a .wav or .mp3 file");
  }

  // Check for valid URL format
  try {
    new URL(url);
  } catch {
    suggestions.push("Reference audio URL must be a valid URL");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedURL
  };
}

/**
 * Utility function to get optimal prompt settings for music style
 * 
 * @param musicStyle - Type of music style
 * @returns Recommended prompt template
 */
export function getOptimalPromptSettings(musicStyle: 'upbeat' | 'calm' | 'inspiring' | 'dance' | 'rock' | 'pop' | 'acoustic' | 'electronic'): string {
  const promptMap = {
    upbeat: `## Fast and Limitless
In the heart of the code, where dreams collide,

FAL's the name, taking tech for a ride.
Generative media, blazing the trail,

Fast inference power, we'll never fail.
##`,
    calm: `In the quiet of the night

When stars are shining bright

We find our way together

Through stormy weather`,
    inspiring: `## Rise Up and Shine
Every challenge makes us stronger

Every step brings us closer

To the dreams we're chasing

In this world of wonder
##`,
    dance: `Feel the rhythm in your soul
Let the music take control
Dancing through the night away
This is our time to play`,
    rock: `## Breaking Through
Thunder in the distance, lightning in the sky
Ready for resistance, this is our time to fly
Guitars are screaming, drums are beating
This is our time for meeting
##`,
    pop: `Walking down the street, feeling the beat
Life is so sweet, nothing to defeat
Sunshine in my eyes, blue in the skies
This is my time to rise`,
    acoustic: `Sitting by the window, watching the rain
Thinking of the memories, feeling no pain
Time goes by so slowly here
Everything is clear, everything is clear`,
    electronic: `## Digital Dreams
Bass is pumping, lights are flashing
Dancing, jumping, never crashing
Electronic symphony in the air
This is our time to share
##`
  };

  return promptMap[musicStyle];
}

/**
 * Utility function to enhance prompt for better music generation
 * 
 * @param prompt - Base prompt to enhance
 * @param enhancements - Enhancement options
 * @returns Enhanced prompt
 */
export function enhancePromptForMusic(
  prompt: string, 
  enhancements: {
    addAccompaniment?: boolean;
    addPauses?: boolean;
    improveFlow?: boolean;
    addEmotionalContext?: boolean;
  } = {}
): string {
  let enhancedPrompt = prompt.trim();

  // Add accompaniment if missing
  if (enhancements.addAccompaniment) {
    if (!/^##.*##$/s.test(enhancedPrompt)) {
      enhancedPrompt = `## ${enhancedPrompt} ##`;
    }
  }

  // Add pauses if missing
  if (enhancements.addPauses) {
    enhancedPrompt = enhancedPrompt.replace(/\n/g, "\n\n");
  }

  // Improve flow
  if (enhancements.improveFlow) {
    enhancedPrompt = enhancedPrompt.replace(/\s+/g, " "); // Normalize spaces
    enhancedPrompt = enhancedPrompt.replace(/([.!?])/g, "$1\n"); // Add line breaks after punctuation
  }

  // Add emotional context
  if (enhancements.addEmotionalContext) {
    if (!/(feeling|emotion|heart|soul|love|dream|hope|fear|joy|pain)/i.test(enhancedPrompt)) {
      enhancedPrompt = enhancedPrompt.replace(/(##|$)/, "\nFeel the emotion in your heart\n$1");
    }
  }

  return enhancedPrompt;
}

/**
 * Utility function to generate random prompt
 * 
 * @param style - Music style
 * @returns Random prompt from the style
 */
export function generateRandomPrompt(style: keyof typeof PROMPT_TEMPLATES): string {
  const prompts = PROMPT_TEMPLATES[style];
  const randomIndex = Math.floor(Math.random() * prompts.length);
  return prompts[randomIndex];
}

/**
 * Utility function to create batch music generation
 * 
 * @param promptsArray - Array of prompts
 * @param referenceAudioArray - Array of reference audio URLs
 * @returns Array of MiniMax Music inputs
 */
export function createBatchMiniMaxMusicGeneration(
  promptsArray: string[], 
  referenceAudioArray: string[]
): MiniMaxMusicInput[] {
  if (promptsArray.length !== referenceAudioArray.length) {
    throw new Error("Prompts and reference audio arrays must have the same length");
  }

  return promptsArray.map((prompt, index) => ({
    prompt,
    reference_audio_url: referenceAudioArray[index]
  }));
}

/**
 * Check if URL is a valid audio format
 * 
 * @param url - The URL to check
 * @returns True if URL is a valid audio format
 */
function isValidAudioURL(url: string): boolean {
  const audioExtensions = ['.wav', '.mp3'];
  return audioExtensions.some(ext => url.toLowerCase().includes(ext));
}

/**
 * Supported audio formats
 */
export const SUPPORTED_AUDIO_FORMATS = [
  "MP3",
  "WAV"
] as const;

/**
 * Common music generation scenarios
 */
export const MUSIC_GENERATION_SCENARIOS = {
  "upbeat": "Generate upbeat music from text prompts",
  "calm": "Generate calm music from text prompts",
  "inspiring": "Generate inspiring music from text prompts",
  "dance": "Generate dance music from text prompts",
  "rock": "Generate rock music from text prompts",
  "pop": "Generate pop music from text prompts",
  "acoustic": "Generate acoustic music from text prompts",
  "electronic": "Generate electronic music from text prompts"
} as const;

/**
 * Prompt formatting guidelines
 */
export const PROMPT_FORMATTING_GUIDELINES = {
  "line_separation": "Use single newline to separate each line of lyrics",
  "pause_control": "Use double newlines to add pauses between lines",
  "accompaniment": "Use ## at beginning and end of lyrics to add accompaniment",
  "character_limit": "Maximum 600 characters for optimal generation",
  "minimum_length": "Minimum 10 characters for generation"
} as const;

/**
 * Reference audio requirements
 */
export const REFERENCE_AUDIO_REQUIREMENTS = {
  "format": "Must be .wav or .mp3 file",
  "duration": "Must be longer than 15 seconds",
  "content": "Should contain music and vocals",
  "quality": "High-quality reference audio for better style transfer",
  "style": "Choose reference audio that matches desired musical style"
} as const;

/**
 * Music generation tips
 */
export const MUSIC_GENERATION_TIPS = {
  "prompt_formatting": "Use proper formatting with newlines and ## markers for best results",
  "reference_audio": "Choose high-quality reference audio that matches your desired style",
  "length_guidelines": "Keep prompts between 10-600 characters for optimal generation",
  "emotional_expression": "Include emotional words and phrases for better musical expression",
  "style_consistency": "Ensure reference audio style matches your prompt content"
} as const;

export default executeMiniMaxMusic;
