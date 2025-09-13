import { fal } from "@fal-ai/client";

export interface CassetteAISoundEffectsInput {
  prompt: string;
  duration: number;
}

export interface CassetteAISoundEffectsOutput {
  audio_file: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

export interface CassetteAISoundEffectsOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * CassetteAI Sound Effects Generator Executor
 * 
 * Create stunningly realistic sound effects in seconds - CassetteAI's Sound Effects 
 * Model generates high-quality SFX up to 30 seconds long in just 1 second of 
 * processing time. Advanced sound effects generation technology that creates 
 * realistic audio effects from text descriptions with ultra-fast processing and 
 * professional-quality output.
 * 
 * @param input - The sound effects input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated audio result
 */
export async function executeCassetteAISoundEffects(
  input: CassetteAISoundEffectsInput,
  options: CassetteAISoundEffectsOptions = {}
): Promise<CassetteAISoundEffectsOutput> {
  try {
    // Validate required inputs
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (input.duration === undefined || input.duration === null) {
      throw new Error("Duration is required");
    }

    // Validate prompt length
    if (input.prompt.length > 500) {
      throw new Error("Prompt must be 500 characters or less");
    }

    if (input.prompt.length < 1) {
      throw new Error("Prompt must be at least 1 character");
    }

    // Validate duration
    if (input.duration < 1 || input.duration > 30) {
      throw new Error("Duration must be between 1 and 30 seconds");
    }

    if (!Number.isInteger(input.duration)) {
      throw new Error("Duration must be an integer");
    }

    // Prepare the request payload
    const payload = {
      prompt: input.prompt.trim(),
      duration: input.duration
    };

    // Execute the model
    const result = await fal.subscribe("cassetteai/sound-effects-generator", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as CassetteAISoundEffectsOutput;

  } catch (error) {
    console.error("CassetteAI Sound Effects execution failed:", error);
    throw new Error(`CassetteAI Sound Effects generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute CassetteAI Sound Effects with queue management for batch processing
 * 
 * @param input - The sound effects input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeCassetteAISoundEffectsQueue(
  input: CassetteAISoundEffectsInput,
  options: CassetteAISoundEffectsOptions = {}
): Promise<{ request_id: string }> {
  try {
    // Validate input (same validation as above)
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    if (input.duration === undefined || input.duration === null) {
      throw new Error("Duration is required");
    }

    if (input.prompt.length > 500) {
      throw new Error("Prompt must be 500 characters or less");
    }

    if (input.duration < 1 || input.duration > 30) {
      throw new Error("Duration must be between 1 and 30 seconds");
    }

    if (!Number.isInteger(input.duration)) {
      throw new Error("Duration must be an integer");
    }

    // Prepare the request payload
    const payload = {
      prompt: input.prompt.trim(),
      duration: input.duration
    };

    // Submit to queue
    const { request_id } = await fal.queue.submit("cassetteai/sound-effects-generator", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("CassetteAI Sound Effects queue submission failed:", error);
    throw new Error(`CassetteAI Sound Effects queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued CassetteAI Sound Effects request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkCassetteAISoundEffectsStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("cassetteai/sound-effects-generator", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("CassetteAI Sound Effects status check failed:", error);
    throw new Error(`CassetteAI Sound Effects status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed CassetteAI Sound Effects request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated audio result
 */
export async function getCassetteAISoundEffectsResult(
  requestId: string
): Promise<CassetteAISoundEffectsOutput> {
  try {
    const result = await fal.queue.result("cassetteai/sound-effects-generator", {
      requestId
    });

    return result.data as CassetteAISoundEffectsOutput;

  } catch (error) {
    console.error("CassetteAI Sound Effects result retrieval failed:", error);
    throw new Error(`CassetteAI Sound Effects result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create sound effects scenarios
 * 
 * @param type - Type of sound effect scenario to create
 * @param customPrompt - Custom prompt (optional)
 * @param customDuration - Custom duration (optional)
 * @returns CassetteAI Sound Effects input configuration
 */
export function createSoundEffectsScenario(
  type: 'animal_sounds' | 'nature_sounds' | 'urban_sounds' | 'mechanical_sounds' | 'human_sounds' | 'transportation_sounds' | 'weather_sounds' | 'household_sounds' | 'musical_sounds' | 'sci_fi_sounds' | 'ambient_sounds' | 'custom',
  customPrompt?: string,
  customDuration?: number
): CassetteAISoundEffectsInput {
  const scenarioTemplates = {
    animal_sounds: {
      prompt: customPrompt || "dog barking in the rain",
      duration: customDuration || 15
    },
    nature_sounds: {
      prompt: customPrompt || "ocean waves crashing on shore",
      duration: customDuration || 20
    },
    urban_sounds: {
      prompt: customPrompt || "busy city street with traffic and people",
      duration: customDuration || 25
    },
    mechanical_sounds: {
      prompt: customPrompt || "car engine starting",
      duration: customDuration || 10
    },
    human_sounds: {
      prompt: customPrompt || "footsteps on wooden floor",
      duration: customDuration || 8
    },
    transportation_sounds: {
      prompt: customPrompt || "airplane taking off",
      duration: customDuration || 12
    },
    weather_sounds: {
      prompt: customPrompt || "thunderstorm with rain and wind",
      duration: customDuration || 30
    },
    household_sounds: {
      prompt: customPrompt || "coffee machine brewing",
      duration: customDuration || 6
    },
    musical_sounds: {
      prompt: customPrompt || "piano playing softly",
      duration: customDuration || 18
    },
    sci_fi_sounds: {
      prompt: customPrompt || "spaceship engine humming",
      duration: customDuration || 22
    },
    ambient_sounds: {
      prompt: customPrompt || "forest with birds chirping and wind",
      duration: customDuration || 30
    },
    custom: {
      prompt: customPrompt || "custom sound effect",
      duration: customDuration || 15
    }
  };

  return scenarioTemplates[type];
}

/**
 * Predefined sound effect prompts for different categories
 */
export const SOUND_EFFECT_PROMPTS = {
  "animals": [
    "dog barking in the rain",
    "cat meowing softly",
    "bird chirping in forest",
    "cow mooing in field",
    "horse neighing",
    "lion roaring",
    "elephant trumpeting",
    "wolf howling at moon"
  ],
  "nature": [
    "ocean waves crashing on shore",
    "wind through trees",
    "thunderstorm with rain",
    "river flowing gently",
    "rain on leaves",
    "fire crackling",
    "snow falling quietly",
    "mountain echo"
  ],
  "urban": [
    "busy city street with traffic",
    "construction site with machinery",
    "subway train arriving",
    "crowd talking in restaurant",
    "traffic light changing",
    "street vendor calling out",
    "police siren in distance",
    "helicopter flying overhead"
  ],
  "mechanical": [
    "car engine starting",
    "door creaking open",
    "clock ticking loudly",
    "typewriter clicking",
    "elevator moving",
    "washing machine spinning",
    "drill operating",
    "chainsaw cutting wood"
  ],
  "human": [
    "footsteps on wooden floor",
    "laughter echoing",
    "doorbell ringing",
    "phone ringing",
    "keyboard typing",
    "whistling tune",
    "coughing",
    "applause"
  ],
  "transportation": [
    "airplane taking off",
    "car honking horn",
    "bicycle bell ringing",
    "train whistle blowing",
    "motorcycle revving",
    "boat engine running",
    "truck backing up",
    "bus door opening"
  ],
  "weather": [
    "rain on window",
    "wind howling",
    "snow falling",
    "hail hitting roof",
    "fog horn in distance",
    "ice cracking",
    "heat wave with cicadas",
    "blizzard with strong winds"
  ],
  "household": [
    "coffee machine brewing",
    "vacuum cleaner running",
    "phone ringing",
    "microwave beeping",
    "shower running",
    "refrigerator humming",
    "dishwasher running",
    "alarm clock ringing"
  ],
  "musical": [
    "piano playing softly",
    "guitar strumming",
    "drum beat",
    "violin playing",
    "trumpet fanfare",
    "saxophone solo",
    "organ playing",
    "xylophone melody"
  ],
  "sci_fi": [
    "spaceship engine humming",
    "laser beam firing",
    "robot beeping",
    "alien communication",
    "teleporter activating",
    "force field buzzing",
    "energy weapon charging",
    "hologram projecting"
  ]
} as const;

/**
 * Example usage of the CassetteAI Sound Effects executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic sound effect generation
    const result1 = await executeCassetteAISoundEffects({
      prompt: "dog barking in the rain",
      duration: 30
    });

    console.log("Generated audio URL:", result1.audio_file.url);

    // Example 2: Using helper function for animal sounds
    const animalSound = createSoundEffectsScenario('animal_sounds');
    const result2 = await executeCassetteAISoundEffects(animalSound);
    console.log("Animal sound:", result2.audio_file.url);

    // Example 3: Custom sound effect with specific settings
    const customSound = createSoundEffectsScenario(
      'custom',
      "ocean waves crashing on shore with seagulls",
      25
    );
    const result3 = await executeCassetteAISoundEffects(customSound);
    console.log("Custom ocean sound:", result3.audio_file.url);

    // Example 4: Using predefined sound effect prompts
    const result4 = await executeCassetteAISoundEffects({
      prompt: SOUND_EFFECT_PROMPTS.nature[0], // "ocean waves crashing on shore"
      duration: 20
    });
    console.log("Nature sound:", result4.audio_file.url);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeCassetteAISoundEffectsQueue({
      prompt: "thunderstorm with rain and wind",
      duration: 30,
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkCassetteAISoundEffectsStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getCassetteAISoundEffectsResult(request_id);
      console.log("Queue result:", result);
    }

  } catch (error) {
    console.error("Example execution failed:", error);
  }
}

/**
 * Utility function to estimate processing cost
 * 
 * @param numberOfGenerations - Number of sound effect generations
 * @returns Estimated cost in USD
 */
export function estimateProcessingCost(numberOfGenerations: number): number {
  const costPerGeneration = 0.01;
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
  if (prompt.length > 500) {
    suggestions.push("Prompt is too long (max 500 characters)");
  }

  if (prompt.length < 5) {
    suggestions.push("Prompt is too short, consider adding more descriptive details");
  }

  // Check for descriptive elements
  const hasDescriptiveWords = /(sound|noise|audio|effect|ambient|atmospheric)/i.test(prompt);
  if (!hasDescriptiveWords) {
    suggestions.push("Consider including descriptive words like 'sound', 'noise', or 'ambient' for better results");
  }

  // Check for environmental context
  const hasEnvironmentalContext = /(in|on|at|with|during|under|over|near|around)/i.test(prompt);
  if (!hasEnvironmentalContext) {
    suggestions.push("Consider adding environmental context (e.g., 'in the rain', 'on the street', 'with wind')");
  }

  // Check for specific details
  const hasSpecificDetails = /\b(soft|loud|gentle|harsh|quiet|noisy|distant|close|echoing|muffled)\b/i.test(prompt);
  if (!hasSpecificDetails) {
    suggestions.push("Consider adding specific details about volume, distance, or quality (e.g., 'soft', 'loud', 'distant')");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedPrompt
  };
}

/**
 * Utility function to validate duration
 * 
 * @param duration - The duration in seconds to validate
 * @returns Validation result with suggestions
 */
export function validateDuration(duration: number): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedDuration: number; 
} {
  const suggestions: string[] = [];
  
  // Clean and format duration
  const formattedDuration = Math.round(duration);

  // Check for common issues
  if (duration < 1) {
    suggestions.push("Duration must be at least 1 second");
  }

  if (duration > 30) {
    suggestions.push("Duration must be 30 seconds or less");
  }

  if (!Number.isInteger(duration)) {
    suggestions.push("Duration should be a whole number of seconds");
  }

  // Check for optimal duration ranges
  if (duration < 5) {
    suggestions.push("Very short durations (under 5 seconds) may not capture full sound effects");
  }

  if (duration > 25) {
    suggestions.push("Very long durations (over 25 seconds) may be unnecessarily expensive");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedDuration
  };
}

/**
 * Utility function to get optimal duration for sound effect type
 * 
 * @param soundType - Type of sound effect
 * @returns Recommended duration in seconds
 */
export function getOptimalDuration(soundType: 'short' | 'medium' | 'long' | 'ambient'): number {
  const durationMap = {
    short: 5,    // Quick sounds like doorbell, phone ring
    medium: 15,  // Standard sounds like car engine, footsteps
    long: 25,    // Extended sounds like thunderstorm, ocean waves
    ambient: 30  // Ambient/background sounds
  };

  return durationMap[soundType];
}

/**
 * Utility function to enhance prompt with descriptive elements
 * 
 * @param basePrompt - Base prompt to enhance
 * @param enhancements - Enhancement options
 * @returns Enhanced prompt
 */
export function enhancePrompt(
  basePrompt: string, 
  enhancements: {
    volume?: 'soft' | 'loud' | 'quiet' | 'noisy';
    distance?: 'close' | 'distant' | 'nearby' | 'far away';
    quality?: 'clear' | 'muffled' | 'echoing' | 'crisp';
    environment?: string;
  } = {}
): string {
  let enhancedPrompt = basePrompt.trim();

  // Add volume descriptor
  if (enhancements.volume) {
    enhancedPrompt = `${enhancements.volume} ${enhancedPrompt}`;
  }

  // Add distance descriptor
  if (enhancements.distance) {
    enhancedPrompt = `${enhancedPrompt} ${enhancements.distance}`;
  }

  // Add quality descriptor
  if (enhancements.quality) {
    enhancedPrompt = `${enhancedPrompt} (${enhancements.quality})`;
  }

  // Add environment context
  if (enhancements.environment) {
    enhancedPrompt = `${enhancedPrompt} in ${enhancements.environment}`;
  }

  return enhancedPrompt;
}

/**
 * Utility function to generate random sound effect prompt
 * 
 * @param category - Sound effect category
 * @returns Random prompt from the category
 */
export function generateRandomPrompt(category: keyof typeof SOUND_EFFECT_PROMPTS): string {
  const prompts = SOUND_EFFECT_PROMPTS[category];
  const randomIndex = Math.floor(Math.random() * prompts.length);
  return prompts[randomIndex];
}

/**
 * Utility function to create batch sound effects
 * 
 * @param prompts - Array of prompts
 * @param duration - Duration for all sound effects
 * @returns Array of sound effect inputs
 */
export function createBatchSoundEffects(
  prompts: string[], 
  duration: number = 15
): CassetteAISoundEffectsInput[] {
  return prompts.map(prompt => ({
    prompt,
    duration
  }));
}

/**
 * Supported audio formats
 */
export const SUPPORTED_AUDIO_FORMATS = [
  "WAV"
] as const;

/**
 * Common sound effect scenarios
 */
export const SOUND_EFFECT_SCENARIOS = {
  "animal_sounds": "Generate animal vocalizations and sounds",
  "nature_sounds": "Create natural environmental sounds",
  "urban_sounds": "Generate city and urban ambient sounds",
  "mechanical_sounds": "Create machine and mechanical sounds",
  "human_sounds": "Generate human vocalizations and activities",
  "transportation_sounds": "Create vehicle and transportation sounds",
  "weather_sounds": "Generate weather and atmospheric sounds",
  "household_sounds": "Create home and household sounds",
  "musical_sounds": "Generate musical instruments and sounds",
  "sci_fi_sounds": "Create science fiction and futuristic sounds",
  "ambient_sounds": "Generate ambient and atmospheric background sounds"
} as const;

/**
 * Sound effect categories with descriptions
 */
export const SOUND_CATEGORIES = {
  "animals": "Animal sounds and vocalizations",
  "nature": "Natural environmental sounds",
  "urban": "City and urban ambient sounds",
  "mechanical": "Machine and mechanical sounds",
  "human": "Human vocalizations and activities",
  "transportation": "Vehicle and transportation sounds",
  "weather": "Weather and atmospheric sounds",
  "household": "Home and household sounds",
  "musical": "Musical instruments and sounds",
  "sci_fi": "Science fiction and futuristic sounds"
} as const;

export default executeCassetteAISoundEffects;
