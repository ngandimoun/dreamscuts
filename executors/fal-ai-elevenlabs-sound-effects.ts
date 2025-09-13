import { fal } from "@fal-ai/client";

export interface ElevenLabsSoundEffectsInput {
  text: string;
  loop?: boolean;
  duration_seconds?: number;
  prompt_influence?: number;
  output_format?: 
    | "mp3_22050_32" | "mp3_44100_32" | "mp3_44100_64" | "mp3_44100_96" 
    | "mp3_44100_128" | "mp3_44100_192" | "pcm_8000" | "pcm_16000" 
    | "pcm_22050" | "pcm_24000" | "pcm_44100" | "pcm_48000" 
    | "ulaw_8000" | "alaw_8000" | "opus_48000_32" | "opus_48000_64" 
    | "opus_48000_96" | "opus_48000_128" | "opus_48000_192";
}

export interface ElevenLabsSoundEffectsOutput {
  audio: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

export interface ElevenLabsSoundEffectsOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI ElevenLabs Sound Effects Executor
 * 
 * Generate sound effects using ElevenLabs advanced sound effects model. 
 * Turn text into sound effects for videos, voice-overs or video games 
 * using state-of-the-art sound generation technology. Advanced 
 * text-to-sound-effects generation that creates high-quality audio 
 * effects from natural language descriptions with customizable 
 * duration, looping, and output formats.
 * 
 * @param input - The sound effects generation input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated audio result
 */
export async function executeElevenLabsSoundEffects(
  input: ElevenLabsSoundEffectsInput,
  options: ElevenLabsSoundEffectsOptions = {}
): Promise<ElevenLabsSoundEffectsOutput> {
  try {
    // Validate required inputs
    if (!input.text || input.text.trim().length === 0) {
      throw new Error("Text is required");
    }

    // Validate text length
    if (input.text.length > 1000) {
      throw new Error("Text must be 1000 characters or less");
    }

    if (input.text.length < 1) {
      throw new Error("Text must be at least 1 character");
    }

    // Validate duration if provided
    if (input.duration_seconds !== undefined) {
      if (input.duration_seconds < 0.5 || input.duration_seconds > 22) {
        throw new Error("Duration must be between 0.5 and 22 seconds");
      }
    }

    // Validate prompt influence if provided
    if (input.prompt_influence !== undefined) {
      if (input.prompt_influence < 0 || input.prompt_influence > 1) {
        throw new Error("Prompt influence must be between 0 and 1");
      }
    }

    // Validate output format if provided
    if (input.output_format && !isValidOutputFormat(input.output_format)) {
      throw new Error(`Invalid output format: ${input.output_format}. Please use a valid output format.`);
    }

    // Prepare the request payload
    const payload: any = {
      text: input.text.trim()
    };

    // Add optional parameters if provided
    if (input.loop !== undefined) {
      payload.loop = input.loop;
    }

    if (input.duration_seconds !== undefined) {
      payload.duration_seconds = input.duration_seconds;
    }

    if (input.prompt_influence !== undefined) {
      payload.prompt_influence = input.prompt_influence;
    }

    if (input.output_format) {
      payload.output_format = input.output_format;
    }

    // Execute the model
    const result = await fal.subscribe("fal-ai/elevenlabs/sound-effects", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as ElevenLabsSoundEffectsOutput;

  } catch (error) {
    console.error("Fal AI ElevenLabs Sound Effects execution failed:", error);
    throw new Error(`Fal AI ElevenLabs Sound Effects generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Fal AI ElevenLabs Sound Effects with queue management for batch processing
 * 
 * @param input - The sound effects generation input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeElevenLabsSoundEffectsQueue(
  input: ElevenLabsSoundEffectsInput,
  options: ElevenLabsSoundEffectsOptions = {}
): Promise<{ request_id: string }> {
  try {
    // Validate input (same validation as above)
    if (!input.text || input.text.trim().length === 0) {
      throw new Error("Text is required");
    }

    if (input.text.length > 1000) {
      throw new Error("Text must be 1000 characters or less");
    }

    if (input.duration_seconds !== undefined && (input.duration_seconds < 0.5 || input.duration_seconds > 22)) {
      throw new Error("Duration must be between 0.5 and 22 seconds");
    }

    if (input.prompt_influence !== undefined && (input.prompt_influence < 0 || input.prompt_influence > 1)) {
      throw new Error("Prompt influence must be between 0 and 1");
    }

    if (input.output_format && !isValidOutputFormat(input.output_format)) {
      throw new Error(`Invalid output format: ${input.output_format}. Please use a valid output format.`);
    }

    // Prepare the request payload
    const payload: any = {
      text: input.text.trim()
    };

    // Add optional parameters if provided
    if (input.loop !== undefined) {
      payload.loop = input.loop;
    }

    if (input.duration_seconds !== undefined) {
      payload.duration_seconds = input.duration_seconds;
    }

    if (input.prompt_influence !== undefined) {
      payload.prompt_influence = input.prompt_influence;
    }

    if (input.output_format) {
      payload.output_format = input.output_format;
    }

    // Submit to queue
    const { request_id } = await fal.queue.submit("fal-ai/elevenlabs/sound-effects", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("Fal AI ElevenLabs Sound Effects queue submission failed:", error);
    throw new Error(`Fal AI ElevenLabs Sound Effects queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued Fal AI ElevenLabs Sound Effects request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkElevenLabsSoundEffectsStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/elevenlabs/sound-effects", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("Fal AI ElevenLabs Sound Effects status check failed:", error);
    throw new Error(`Fal AI ElevenLabs Sound Effects status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed Fal AI ElevenLabs Sound Effects request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated audio result
 */
export async function getElevenLabsSoundEffectsResult(
  requestId: string
): Promise<ElevenLabsSoundEffectsOutput> {
  try {
    const result = await fal.queue.result("fal-ai/elevenlabs/sound-effects", {
      requestId
    });

    return result.data as ElevenLabsSoundEffectsOutput;

  } catch (error) {
    console.error("Fal AI ElevenLabs Sound Effects result retrieval failed:", error);
    throw new Error(`Fal AI ElevenLabs Sound Effects result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Fal AI ElevenLabs Sound Effects with streaming support
 * 
 * @param input - The sound effects generation input parameters
 * @returns Promise with streaming result
 */
export async function executeElevenLabsSoundEffectsStream(
  input: ElevenLabsSoundEffectsInput
): Promise<ElevenLabsSoundEffectsOutput> {
  try {
    // Validate input (same validation as above)
    if (!input.text || input.text.trim().length === 0) {
      throw new Error("Text is required");
    }

    if (input.text.length > 1000) {
      throw new Error("Text must be 1000 characters or less");
    }

    // Prepare the request payload
    const payload: any = {
      text: input.text.trim()
    };

    // Add optional parameters if provided
    if (input.loop !== undefined) {
      payload.loop = input.loop;
    }

    if (input.duration_seconds !== undefined) {
      payload.duration_seconds = input.duration_seconds;
    }

    if (input.prompt_influence !== undefined) {
      payload.prompt_influence = input.prompt_influence;
    }

    if (input.output_format) {
      payload.output_format = input.output_format;
    }

    // Execute with streaming
    const stream = await fal.stream("fal-ai/elevenlabs/sound-effects", {
      input: payload
    });

    // Process streaming events
    for await (const event of stream) {
      console.log("Streaming event:", event);
    }

    // Get final result
    const result = await stream.done();
    return result.data as ElevenLabsSoundEffectsOutput;

  } catch (error) {
    console.error("Fal AI ElevenLabs Sound Effects streaming failed:", error);
    throw new Error(`Fal AI ElevenLabs Sound Effects streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create sound effects generation scenarios
 * 
 * @param type - Type of sound effects generation scenario to create
 * @param customText - Custom text (optional)
 * @param customOptions - Custom options (optional)
 * @returns ElevenLabs Sound Effects input configuration
 */
export function createSoundEffectsScenario(
  type: 'ambient' | 'impact' | 'mechanical' | 'nature' | 'human' | 'animal' | 'musical' | 'electronic' | 'transportation' | 'weather' | 'custom',
  customText?: string,
  customOptions?: Partial<ElevenLabsSoundEffectsInput>
): ElevenLabsSoundEffectsInput {
  const scenarioTemplates = {
    ambient: {
      text: customText || "Gentle rain falling on leaves with distant thunder",
      loop: true,
      duration_seconds: 10,
      prompt_influence: 0.5,
      output_format: "mp3_44100_128" as const
    },
    impact: {
      text: customText || "Sharp metallic clang with echo",
      loop: false,
      duration_seconds: 2,
      prompt_influence: 0.7,
      output_format: "mp3_44100_192" as const
    },
    mechanical: {
      text: customText || "Industrial machine humming with rhythmic clicking",
      loop: true,
      duration_seconds: 8,
      prompt_influence: 0.4,
      output_format: "mp3_44100_128" as const
    },
    nature: {
      text: customText || "Birds chirping in a forest with wind through trees",
      loop: true,
      duration_seconds: 15,
      prompt_influence: 0.3,
      output_format: "mp3_44100_128" as const
    },
    human: {
      text: customText || "Footsteps on wooden floor with door creaking",
      loop: false,
      duration_seconds: 3,
      prompt_influence: 0.6,
      output_format: "mp3_44100_128" as const
    },
    animal: {
      text: customText || "Dog barking in the distance with echo",
      loop: false,
      duration_seconds: 4,
      prompt_influence: 0.5,
      output_format: "mp3_44100_128" as const
    },
    musical: {
      text: customText || "Piano chord with reverb and sustain",
      loop: false,
      duration_seconds: 5,
      prompt_influence: 0.8,
      output_format: "mp3_44100_192" as const
    },
    electronic: {
      text: customText || "Synthesizer sweep with digital effects",
      loop: false,
      duration_seconds: 6,
      prompt_influence: 0.6,
      output_format: "mp3_44100_128" as const
    },
    transportation: {
      text: customText || "Car engine starting with door slamming",
      loop: false,
      duration_seconds: 4,
      prompt_influence: 0.5,
      output_format: "mp3_44100_128" as const
    },
    weather: {
      text: customText || "Thunderstorm with heavy rain and wind",
      loop: true,
      duration_seconds: 12,
      prompt_influence: 0.4,
      output_format: "mp3_44100_128" as const
    },
    custom: {
      text: customText || "Custom sound effect generation",
      loop: false,
      duration_seconds: 5,
      prompt_influence: 0.3,
      output_format: "mp3_44100_128" as const
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
 * Predefined sound effects prompts for different categories
 */
export const SOUND_EFFECTS_PROMPTS = {
  "ambient": [
    "Gentle rain falling on leaves with distant thunder",
    "Ocean waves crashing on shore with seagulls",
    "Forest ambiance with birds and wind",
    "City street at night with distant traffic",
    "Crackling fireplace with wind outside",
    "Mountain stream flowing over rocks",
    "Desert wind with sand particles",
    "Snow falling quietly in a forest"
  ],
  "impact": [
    "Sharp metallic clang with echo",
    "Heavy door slamming shut",
    "Glass breaking with shards falling",
    "Wooden beam cracking and falling",
    "Metal pipe hitting concrete",
    "Stone dropping into water",
    "Hammer hitting anvil",
    "Car crash with metal crunching"
  ],
  "mechanical": [
    "Industrial machine humming with rhythmic clicking",
    "Clock ticking with pendulum swing",
    "Engine starting with gears engaging",
    "Printing press with paper feeding",
    "Elevator moving with cable sounds",
    "Air conditioning unit with fan",
    "Washing machine agitating",
    "Drill bit cutting through metal"
  ],
  "nature": [
    "Birds chirping in a forest with wind through trees",
    "Wolf howling in the distance",
    "Cricket sounds in a summer night",
    "Waterfall cascading over rocks",
    "Wind through tall grass",
    "Thunder rumbling in the distance",
    "Rain on a tin roof",
    "Ocean waves with seagulls"
  ],
  "human": [
    "Footsteps on wooden floor with door creaking",
    "Laughter echoing in a room",
    "Applause with cheering",
    "Whispering voices in a library",
    "Doorbell ringing with echo",
    "Phone ringing with vibration",
    "Keyboard typing with mouse clicks",
    "Breathing with slight echo"
  ],
  "animal": [
    "Dog barking in the distance with echo",
    "Cat meowing softly",
    "Horse neighing with hoof beats",
    "Cow mooing in a field",
    "Chicken clucking in a barn",
    "Pig snorting and grunting",
    "Sheep bleating in a meadow",
    "Rooster crowing at dawn"
  ],
  "musical": [
    "Piano chord with reverb and sustain",
    "Guitar string plucked with echo",
    "Violin bowing with vibrato",
    "Drum roll building to crescendo",
    "Trumpet fanfare with brass section",
    "Flute melody with wind effects",
    "Organ chord with cathedral reverb",
    "Xylophone notes with wooden resonance"
  ],
  "electronic": [
    "Synthesizer sweep with digital effects",
    "Computer startup sound with beeps",
    "Radio static with voice fragments",
    "Electronic beep sequence",
    "Digital alarm with urgency",
    "Robot servo motor whirring",
    "Laser beam firing with energy",
    "Hologram activation sound"
  ],
  "transportation": [
    "Car engine starting with door slamming",
    "Airplane taking off with jet engines",
    "Train whistle with tracks rumbling",
    "Motorcycle revving with exhaust",
    "Bicycle chain with wheel spinning",
    "Helicopter rotor blades chopping",
    "Ship horn with ocean waves",
    "Bus brakes squealing with air release"
  ],
  "weather": [
    "Thunderstorm with heavy rain and wind",
    "Light rain on window with thunder",
    "Snowstorm with wind howling",
    "Hail hitting roof with intensity",
    "Fog horn with misty atmosphere",
    "Wind through trees with leaves rustling",
    "Sunny day with gentle breeze",
    "Hurricane with destructive winds"
  ]
} as const;

/**
 * Example usage of the Fal AI ElevenLabs Sound Effects executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic sound effect generation
    const result1 = await executeElevenLabsSoundEffects({
      text: "Spacious braam suitable for high-impact movie trailer moments",
      prompt_influence: 0.3,
      output_format: "mp3_44100_128"
    });

    console.log("Generated sound effect URL:", result1.audio.url);

    // Example 2: Using helper function for ambient sound
    const ambientSound = createSoundEffectsScenario('ambient');
    const result2 = await executeElevenLabsSoundEffects(ambientSound);
    console.log("Ambient sound:", result2.audio.url);

    // Example 3: Custom sound with specific settings
    const customSound = createSoundEffectsScenario(
      'custom',
      "Sharp metallic clang with echo",
      {
        loop: false,
        duration_seconds: 2,
        prompt_influence: 0.7,
        output_format: "mp3_44100_192"
      }
    );
    const result3 = await executeElevenLabsSoundEffects(customSound);
    console.log("Custom impact sound:", result3.audio.url);

    // Example 4: Using predefined sound effects prompts
    const result4 = await executeElevenLabsSoundEffects({
      text: SOUND_EFFECTS_PROMPTS.mechanical[0], // "Industrial machine humming with rhythmic clicking"
      loop: true,
      duration_seconds: 8,
      prompt_influence: 0.4,
      output_format: "mp3_44100_128"
    });
    console.log("Mechanical sound:", result4.audio.url);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeElevenLabsSoundEffectsQueue({
      text: "Thunderstorm with heavy rain and wind",
      loop: true,
      duration_seconds: 12,
      prompt_influence: 0.4,
      output_format: "mp3_44100_128",
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkElevenLabsSoundEffectsStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getElevenLabsSoundEffectsResult(request_id);
      console.log("Queue result:", result);
    }

    // Example 6: Streaming usage
    const result6 = await executeElevenLabsSoundEffectsStream({
      text: "Ocean waves crashing on shore with seagulls",
      loop: true,
      duration_seconds: 10,
      prompt_influence: 0.3,
      output_format: "mp3_44100_128"
    });
    console.log("Streaming result:", result6.audio.url);

  } catch (error) {
    console.error("Example execution failed:", error);
  }
}

/**
 * Utility function to estimate processing cost
 * 
 * @param durationSeconds - Duration of the sound effect in seconds
 * @returns Estimated cost in USD
 */
export function estimateProcessingCost(durationSeconds: number): number {
  const costPerSecond = 0.002;
  return durationSeconds * costPerSecond;
}

/**
 * Utility function to validate text format
 * 
 * @param text - The text string to validate
 * @returns Validation result with suggestions
 */
export function validateTextFormat(text: string): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedText: string; 
} {
  const suggestions: string[] = [];
  
  // Clean and format text
  const formattedText = text.trim();

  // Check for common issues
  if (text.length > 1000) {
    suggestions.push("Text is too long (max 1000 characters)");
  }

  if (text.length < 5) {
    suggestions.push("Text is too short, consider adding more descriptive details");
  }

  // Check for sound-related keywords
  const hasSoundKeywords = /(sound|noise|audio|effect|bang|crash|click|beep|hum|buzz|whir|clang|thud|splash|drip|tick|ring|echo|reverb)/i.test(text);
  if (!hasSoundKeywords) {
    suggestions.push("Consider including sound-related keywords for better generation");
  }

  // Check for descriptive adjectives
  const hasDescriptiveWords = /(sharp|soft|loud|quiet|deep|high|metallic|wooden|electronic|natural|mechanical|ambient|distant|close|echoing|reverberating)/i.test(text);
  if (!hasDescriptiveWords) {
    suggestions.push("Consider adding descriptive adjectives about sound characteristics");
  }

  // Check for sound characteristics
  const hasSoundCharacteristics = /(pitch|volume|tone|texture|rhythm|tempo|frequency|amplitude|duration|intensity)/i.test(text);
  if (!hasSoundCharacteristics) {
    suggestions.push("Consider including sound characteristics like pitch, volume, or texture");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedText
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
  const formattedDuration = Math.round(duration * 100) / 100; // Round to 2 decimal places

  // Check for common issues
  if (duration < 0.5) {
    suggestions.push("Duration must be at least 0.5 seconds");
  }

  if (duration > 22) {
    suggestions.push("Duration must be 22 seconds or less");
  }

  // Check for optimal ranges
  if (duration < 1) {
    suggestions.push("Very short durations (0.5-1s) may not capture full sound development");
  }

  if (duration > 15) {
    suggestions.push("Very long durations (15-22s) may be unnecessarily expensive");
  }

  // Check for recommended ranges
  if (duration >= 2 && duration <= 10) {
    // This is the recommended range, no suggestions needed
  } else if (duration < 2) {
    suggestions.push("Consider using 2-10 seconds for optimal sound effect quality");
  } else if (duration > 10) {
    suggestions.push("Consider using 2-10 seconds for optimal sound effect quality");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedDuration
  };
}

/**
 * Utility function to validate prompt influence
 * 
 * @param promptInfluence - The prompt influence value to validate
 * @returns Validation result with suggestions
 */
export function validatePromptInfluence(promptInfluence: number): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedPromptInfluence: number; 
} {
  const suggestions: string[] = [];
  
  // Clean and format prompt influence
  const formattedPromptInfluence = Math.round(promptInfluence * 100) / 100; // Round to 2 decimal places

  // Check for common issues
  if (promptInfluence < 0) {
    suggestions.push("Prompt influence must be at least 0");
  }

  if (promptInfluence > 1) {
    suggestions.push("Prompt influence must be 1 or less");
  }

  // Check for optimal ranges
  if (promptInfluence < 0.2) {
    suggestions.push("Very low prompt influence (0-0.2) may result in high variation");
  }

  if (promptInfluence > 0.8) {
    suggestions.push("Very high prompt influence (0.8-1.0) may result in low variation");
  }

  // Check for recommended ranges
  if (promptInfluence >= 0.3 && promptInfluence <= 0.6) {
    // This is the recommended range, no suggestions needed
  } else if (promptInfluence < 0.3) {
    suggestions.push("Consider using prompt influence 0.3-0.6 for balanced results");
  } else if (promptInfluence > 0.6) {
    suggestions.push("Consider using prompt influence 0.3-0.6 for balanced results");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedPromptInfluence
  };
}

/**
 * Utility function to get optimal settings for sound effect type
 * 
 * @param soundType - Type of sound effect
 * @returns Recommended settings
 */
export function getOptimalSettings(soundType: 'ambient' | 'impact' | 'mechanical' | 'nature' | 'human' | 'animal' | 'musical' | 'electronic' | 'transportation' | 'weather'): {
  loop: boolean;
  duration_seconds: number;
  prompt_influence: number;
  output_format: "mp3_44100_128" | "mp3_44100_192";
} {
  const settingsMap = {
    ambient: {
      loop: true,
      duration_seconds: 10,
      prompt_influence: 0.4,
      output_format: "mp3_44100_128" as const
    },
    impact: {
      loop: false,
      duration_seconds: 2,
      prompt_influence: 0.7,
      output_format: "mp3_44100_192" as const
    },
    mechanical: {
      loop: true,
      duration_seconds: 8,
      prompt_influence: 0.5,
      output_format: "mp3_44100_128" as const
    },
    nature: {
      loop: true,
      duration_seconds: 12,
      prompt_influence: 0.3,
      output_format: "mp3_44100_128" as const
    },
    human: {
      loop: false,
      duration_seconds: 3,
      prompt_influence: 0.6,
      output_format: "mp3_44100_128" as const
    },
    animal: {
      loop: false,
      duration_seconds: 4,
      prompt_influence: 0.5,
      output_format: "mp3_44100_128" as const
    },
    musical: {
      loop: false,
      duration_seconds: 5,
      prompt_influence: 0.8,
      output_format: "mp3_44100_192" as const
    },
    electronic: {
      loop: false,
      duration_seconds: 6,
      prompt_influence: 0.6,
      output_format: "mp3_44100_128" as const
    },
    transportation: {
      loop: false,
      duration_seconds: 4,
      prompt_influence: 0.5,
      output_format: "mp3_44100_128" as const
    },
    weather: {
      loop: true,
      duration_seconds: 15,
      prompt_influence: 0.4,
      output_format: "mp3_44100_128" as const
    }
  };

  return settingsMap[soundType];
}

/**
 * Utility function to enhance text for better sound effects
 * 
 * @param text - Base text to enhance
 * @param enhancements - Enhancement options
 * @returns Enhanced text
 */
export function enhanceTextForSoundEffects(
  text: string, 
  enhancements: {
    addSoundCharacteristics?: boolean;
    addDescriptiveAdjectives?: boolean;
    addEnvironmentalContext?: boolean;
    improveClarity?: boolean;
  } = {}
): string {
  let enhancedText = text.trim();

  // Add sound characteristics
  if (enhancements.addSoundCharacteristics) {
    if (!/(pitch|volume|tone|texture|rhythm|tempo|frequency|amplitude|duration|intensity)/i.test(enhancedText)) {
      enhancedText = `${enhancedText} with clear sound characteristics`;
    }
  }

  // Add descriptive adjectives
  if (enhancements.addDescriptiveAdjectives) {
    if (!/(sharp|soft|loud|quiet|deep|high|metallic|wooden|electronic|natural|mechanical|ambient|distant|close|echoing|reverberating)/i.test(enhancedText)) {
      enhancedText = `${enhancedText} with distinctive qualities`;
    }
  }

  // Add environmental context
  if (enhancements.addEnvironmentalContext) {
    if (!/(room|hall|outdoor|indoor|cave|tunnel|open|closed|echo|reverb)/i.test(enhancedText)) {
      enhancedText = `${enhancedText} in a suitable environment`;
    }
  }

  // Improve clarity
  if (enhancements.improveClarity) {
    enhancedText = enhancedText.replace(/\s+/g, " "); // Normalize whitespace
    enhancedText = enhancedText.replace(/[^\w\s.,!?-]/g, ""); // Remove special characters
  }

  return enhancedText;
}

/**
 * Utility function to generate random sound effect prompt
 * 
 * @param category - Sound effect category
 * @returns Random prompt from the category
 */
export function generateRandomSoundEffectPrompt(category: keyof typeof SOUND_EFFECTS_PROMPTS): string {
  const prompts = SOUND_EFFECTS_PROMPTS[category];
  const randomIndex = Math.floor(Math.random() * prompts.length);
  return prompts[randomIndex];
}

/**
 * Utility function to create batch sound effects generation
 * 
 * @param texts - Array of texts
 * @param options - Common options for all generations
 * @returns Array of sound effects inputs
 */
export function createBatchSoundEffectsGeneration(
  texts: string[], 
  options: Partial<ElevenLabsSoundEffectsInput> = {}
): ElevenLabsSoundEffectsInput[] {
  return texts.map(text => ({
    text,
    ...options
  }));
}

/**
 * Check if an output format is valid
 * 
 * @param format - The output format to check
 * @returns True if format is valid
 */
function isValidOutputFormat(format: string): boolean {
  const validFormats = [
    "mp3_22050_32", "mp3_44100_32", "mp3_44100_64", "mp3_44100_96", 
    "mp3_44100_128", "mp3_44100_192", "pcm_8000", "pcm_16000", 
    "pcm_22050", "pcm_24000", "pcm_44100", "pcm_48000", 
    "ulaw_8000", "alaw_8000", "opus_48000_32", "opus_48000_64", 
    "opus_48000_96", "opus_48000_128", "opus_48000_192"
  ];
  return validFormats.includes(format);
}

/**
 * Supported audio formats
 */
export const SUPPORTED_AUDIO_FORMATS = [
  "MP3", "PCM", "ULAW", "ALAW", "OPUS"
] as const;

/**
 * Common sound effects generation scenarios
 */
export const SOUND_EFFECTS_GENERATION_SCENARIOS = {
  "ambient": "Generate ambient and atmospheric sounds",
  "impact": "Create impact and collision sounds",
  "mechanical": "Generate mechanical and machine sounds",
  "nature": "Create natural and environmental sounds",
  "human": "Generate human-made sounds and activities",
  "animal": "Create animal sounds and vocalizations",
  "musical": "Generate musical instruments and tones",
  "electronic": "Create electronic and digital sounds",
  "transportation": "Generate vehicle and transportation sounds",
  "weather": "Create weather and atmospheric sounds"
} as const;

/**
 * Output format categories and their characteristics
 */
export const OUTPUT_FORMAT_CATEGORIES = {
  "mp3_formats": {
    "formats": ["mp3_22050_32", "mp3_44100_32", "mp3_44100_64", "mp3_44100_96", "mp3_44100_128", "mp3_44100_192"],
    "description": "Compressed audio formats with different quality levels",
    "recommended": "mp3_44100_128 for balanced quality and file size"
  },
  "pcm_formats": {
    "formats": ["pcm_8000", "pcm_16000", "pcm_22050", "pcm_24000", "pcm_44100", "pcm_48000"],
    "description": "Uncompressed audio formats with different sample rates",
    "recommended": "pcm_44100 for high quality"
  },
  "compressed_formats": {
    "formats": ["ulaw_8000", "alaw_8000"],
    "description": "Compressed formats for telephony applications",
    "recommended": "ulaw_8000 for telephony"
  },
  "opus_formats": {
    "formats": ["opus_48000_32", "opus_48000_64", "opus_48000_96", "opus_48000_128", "opus_48000_192"],
    "description": "Modern compressed format with high efficiency",
    "recommended": "opus_48000_128 for modern applications"
  }
} as const;

/**
 * Prompt influence guidelines
 */
export const PROMPT_INFLUENCE_GUIDELINES = {
  "low_variation": "0.7-1.0: High prompt adherence, low variation",
  "balanced": "0.3-0.6: Balanced prompt adherence and variation",
  "high_variation": "0-0.3: Low prompt adherence, high variation"
} as const;

/**
 * Sound effect categories and their characteristics
 */
export const SOUND_EFFECT_CATEGORIES = {
  "ambient": "Environmental and atmospheric sounds",
  "mechanical": "Machine and mechanical sounds",
  "nature": "Natural and environmental sounds",
  "human": "Human-made sounds and activities",
  "animal": "Animal sounds and vocalizations",
  "musical": "Musical instruments and tones",
  "impact": "Impact and collision sounds",
  "electronic": "Electronic and digital sounds",
  "transportation": "Vehicle and transportation sounds",
  "weather": "Weather and atmospheric sounds"
} as const;

export default executeElevenLabsSoundEffects;
