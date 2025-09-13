import { fal } from "@fal-ai/client";

export interface YuEInput {
  lyrics: string;
  genres: string;
}

export interface YuEOutput {
  audio: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

export interface YuEOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI YuE Music Generation Executor
 * 
 * YuE is a groundbreaking series of open-source foundation models designed for 
 * music generation, specifically for transforming lyrics into full songs. 
 * Advanced music generation from lyrics with genre control and high-quality audio output.
 * 
 * @param input - The music generation input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated music result
 */
export async function executeYuE(
  input: YuEInput,
  options: YuEOptions = {}
): Promise<YuEOutput> {
  try {
    // Validate required inputs
    if (!input.lyrics || input.lyrics.trim().length === 0) {
      throw new Error("Lyrics are required");
    }

    if (!input.genres || input.genres.trim().length === 0) {
      throw new Error("Genres are required");
    }

    // Validate lyrics length
    if (input.lyrics.length > 2000) {
      throw new Error("Lyrics must be 2000 characters or less");
    }

    if (input.lyrics.length < 10) {
      throw new Error("Lyrics must be at least 10 characters");
    }

    // Validate genres length
    if (input.genres.length > 200) {
      throw new Error("Genres must be 200 characters or less");
    }

    if (input.genres.length < 3) {
      throw new Error("Genres must be at least 3 characters");
    }

    // Validate lyrics structure
    if (!hasValidLyricsStructure(input.lyrics)) {
      throw new Error("Lyrics must contain [verse] and [chorus] sections");
    }

    // Prepare the request payload
    const payload = {
      lyrics: input.lyrics.trim(),
      genres: input.genres.trim()
    };

    // Execute the model
    const result = await fal.subscribe("fal-ai/yue", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as YuEOutput;

  } catch (error) {
    console.error("Fal AI YuE music generation execution failed:", error);
    throw new Error(`Fal AI YuE music generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Fal AI YuE with queue management for batch processing
 * 
 * @param input - The music generation input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeYuEQueue(
  input: YuEInput,
  options: YuEOptions = {}
): Promise<{ request_id: string }> {
  try {
    // Validate input (same validation as above)
    if (!input.lyrics || input.lyrics.trim().length === 0) {
      throw new Error("Lyrics are required");
    }

    if (!input.genres || input.genres.trim().length === 0) {
      throw new Error("Genres are required");
    }

    if (input.lyrics.length > 2000) {
      throw new Error("Lyrics must be 2000 characters or less");
    }

    if (input.lyrics.length < 10) {
      throw new Error("Lyrics must be at least 10 characters");
    }

    if (input.genres.length > 200) {
      throw new Error("Genres must be 200 characters or less");
    }

    if (input.genres.length < 3) {
      throw new Error("Genres must be at least 3 characters");
    }

    if (!hasValidLyricsStructure(input.lyrics)) {
      throw new Error("Lyrics must contain [verse] and [chorus] sections");
    }

    // Prepare the request payload
    const payload = {
      lyrics: input.lyrics.trim(),
      genres: input.genres.trim()
    };

    // Submit to queue
    const { request_id } = await fal.queue.submit("fal-ai/yue", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("Fal AI YuE queue submission failed:", error);
    throw new Error(`Fal AI YuE queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued Fal AI YuE request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkYuEStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/yue", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("Fal AI YuE status check failed:", error);
    throw new Error(`Fal AI YuE status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed Fal AI YuE request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated music result
 */
export async function getYuEResult(
  requestId: string
): Promise<YuEOutput> {
  try {
    const result = await fal.queue.result("fal-ai/yue", {
      requestId
    });

    return result.data as YuEOutput;

  } catch (error) {
    console.error("Fal AI YuE result retrieval failed:", error);
    throw new Error(`Fal AI YuE result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create music generation scenarios
 * 
 * @param type - Type of music generation scenario to create
 * @param customLyrics - Custom lyrics (optional)
 * @param customGenres - Custom genres (optional)
 * @param customOptions - Custom options (optional)
 * @returns YuE input configuration
 */
export function createMusicGenerationScenario(
  type: 'pop' | 'rock' | 'electronic' | 'acoustic' | 'inspiring' | 'calm' | 'energetic' | 'custom',
  customLyrics?: string,
  customGenres?: string,
  customOptions?: Partial<YuEInput>
): YuEInput {
  const scenarioTemplates = {
    pop: {
      lyrics: customLyrics || `[verse]
Staring at the sunset, colors paint the sky
Thoughts of you keep swirling, can't deny
I know I let you down, I made mistakes
But I'm here to mend the heart I didn't break

[chorus]
Every road you take, I'll be one step behind
Every dream you chase, I'm reaching for the light
You can't fight this feeling now
I won't back down
You know you can't deny it now
I won't back down`,
      genres: customGenres || "inspiring female uplifting pop airy vocal electronic bright vocal vocal"
    },
    rock: {
      lyrics: customLyrics || `[verse]
Breaking through the silence, hear my voice
Making all the noise, I have no choice
Standing up for what I believe
This is what I need, this is what I need

[chorus]
We are the champions, we are the ones
Fighting for our dreams until the day is done
We are the champions, we are the ones
Never giving up until we've won`,
      genres: customGenres || "rock energetic powerful guitar-driven anthemic"
    },
    electronic: {
      lyrics: customLyrics || `[verse]
Digital dreams in the neon light
Dancing through the night, everything's bright
Synthetic sounds and electric beats
Moving to the rhythm, feeling the heat

[chorus]
We're living in the future now
Digital world, we'll show you how
We're living in the future now
This is our time, this is our time`,
      genres: customGenres || "electronic synthpop electropop energetic dance"
    },
    acoustic: {
      lyrics: customLyrics || `[verse]
Sitting by the window, watching the rain
Thinking of the memories, feeling no pain
Time goes by so slowly here
Everything is clear, everything is clear

[chorus]
Peaceful moments, quiet dreams
Life is not as hard as it seems
Peaceful moments, quiet dreams
Everything will be alright`,
      genres: customGenres || "acoustic calm peaceful gentle acoustic guitar"
    },
    inspiring: {
      lyrics: customLyrics || `[verse]
Rise up from the ashes, stronger than before
Open up the doors, there's so much more
Every step you take is a victory
This is your story, this is your story

[chorus]
You can do anything you set your mind to
The world is waiting there for you
You can do anything you set your mind to
Believe in yourself, it's true`,
      genres: customGenres || "inspiring uplifting motivational empowering"
    },
    calm: {
      lyrics: customLyrics || `[verse]
Softly falling rain on the window pane
Quiet thoughts remain, nothing to explain
Gentle breeze is blowing through the trees
Bringing peace, bringing peace

[chorus]
In the silence of the night
Everything will be alright
In the silence of the night
Everything will be alright`,
      genres: customGenres || "calm peaceful gentle soothing ambient"
    },
    energetic: {
      lyrics: customLyrics || `[verse]
Feel the rhythm in your soul
Let the music take control
Dancing through the night away
This is our time to play

[chorus]
We're alive, we're free
This is how it's meant to be
We're alive, we're free
Living our destiny`,
      genres: customGenres || "energetic upbeat dance pop exciting"
    },
    custom: {
      lyrics: customLyrics || `[verse]
Custom lyrics for your song
Make it short or make it long
This is where your story starts
Let it come from your heart

[chorus]
Custom music generation
For your own creation
Custom music generation
This is your inspiration`,
      genres: customGenres || "custom personalized unique creative"
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
 * Predefined lyrics templates for different music styles
 */
export const LYRICS_TEMPLATES = {
  "pop": [
    `[verse]
Staring at the sunset, colors paint the sky
Thoughts of you keep swirling, can't deny
I know I let you down, I made mistakes
But I'm here to mend the heart I didn't break

[chorus]
Every road you take, I'll be one step behind
Every dream you chase, I'm reaching for the light
You can't fight this feeling now
I won't back down
You know you can't deny it now
I won't back down`,
    `[verse]
Walking down the street, feeling the beat
Life is so sweet, nothing to defeat
Sunshine in my eyes, blue in the skies
This is my time to rise

[chorus]
We're living life to the fullest
Every moment is the best
We're living life to the fullest
Putting our hearts to the test`
  ],
  "rock": [
    `[verse]
Breaking through the silence, hear my voice
Making all the noise, I have no choice
Standing up for what I believe
This is what I need, this is what I need

[chorus]
We are the champions, we are the ones
Fighting for our dreams until the day is done
We are the champions, we are the ones
Never giving up until we've won`,
    `[verse]
Thunder in the distance, lightning in the sky
Ready for resistance, this is our time to fly
Guitars are screaming, drums are beating
This is our time for meeting

[chorus]
Rock and roll forever
We'll be together
Rock and roll forever
Nothing can sever`
  ],
  "electronic": [
    `[verse]
Digital dreams in the neon light
Dancing through the night, everything's bright
Synthetic sounds and electric beats
Moving to the rhythm, feeling the heat

[chorus]
We're living in the future now
Digital world, we'll show you how
We're living in the future now
This is our time, this is our time`,
    `[verse]
Bass is pumping, lights are flashing
Dancing, jumping, never crashing
Electronic symphony in the air
This is our time to share

[chorus]
Feel the beat, feel the sound
Dancing all around
Feel the beat, feel the sound
This is where we're found`
  ],
  "acoustic": [
    `[verse]
Sitting by the window, watching the rain
Thinking of the memories, feeling no pain
Time goes by so slowly here
Everything is clear, everything is clear

[chorus]
Peaceful moments, quiet dreams
Life is not as hard as it seems
Peaceful moments, quiet dreams
Everything will be alright`,
    `[verse]
Guitar strings are singing, soft and low
Gentle winds are bringing, peace I know
Simple life is calling, this is home
Never more alone, never more alone

[chorus]
In the quiet of the morning
Everything is dawning
In the quiet of the morning
Life is worth adorning`
  ],
  "inspiring": [
    `[verse]
Rise up from the ashes, stronger than before
Open up the doors, there's so much more
Every step you take is a victory
This is your story, this is your story

[chorus]
You can do anything you set your mind to
The world is waiting there for you
You can do anything you set your mind to
Believe in yourself, it's true`,
    `[verse]
Dreams are waiting, just reach out
Doubt is fading, there's no doubt
Every challenge makes you strong
This is where you belong

[chorus]
Rise up, rise up
Fill your heart with hope
Rise up, rise up
You can learn to cope`
  ],
  "calm": [
    `[verse]
Softly falling rain on the window pane
Quiet thoughts remain, nothing to explain
Gentle breeze is blowing through the trees
Bringing peace, bringing peace

[chorus]
In the silence of the night
Everything will be alright
In the silence of the night
Everything will be alright`,
    `[verse]
Ocean waves are gently rolling
Peaceful thoughts are slowly strolling
Time stands still in this moment
This is where we're meant

[chorus]
Calm and peaceful, all is well
In this moment, we can tell
Calm and peaceful, all is well
This is where we dwell`
  ],
  "energetic": [
    `[verse]
Feel the rhythm in your soul
Let the music take control
Dancing through the night away
This is our time to play

[chorus]
We're alive, we're free
This is how it's meant to be
We're alive, we're free
Living our destiny`,
    `[verse]
Energy is flowing, hearts are glowing
Life is showing, we're all knowing
Dancing, jumping, never stopping
This is our time for topping

[chorus]
Feel the energy, feel the power
This is our finest hour
Feel the energy, feel the power
This is our finest hour`
  ]
} as const;

/**
 * Predefined genre combinations for different music styles
 */
export const GENRE_COMBINATIONS = {
  "pop": [
    "inspiring female uplifting pop airy vocal electronic bright vocal vocal",
    "pop upbeat catchy melodic female vocal",
    "pop rock anthemic uplifting energetic"
  ],
  "rock": [
    "rock energetic powerful guitar-driven anthemic",
    "alternative rock indie powerful emotional",
    "hard rock heavy guitar-driven powerful"
  ],
  "electronic": [
    "electronic synthpop electropop energetic dance",
    "ambient electronic chillout atmospheric",
    "downtempo electronic trip hop smooth"
  ],
  "acoustic": [
    "acoustic calm peaceful gentle acoustic guitar",
    "folk acoustic singer-songwriter intimate",
    "country acoustic warm storytelling"
  ],
  "inspiring": [
    "inspiring uplifting motivational empowering",
    "anthemic inspiring powerful emotional",
    "uplifting inspiring hopeful optimistic"
  ],
  "calm": [
    "calm peaceful gentle soothing ambient",
    "meditation calm peaceful zen",
    "lullaby gentle soft peaceful"
  ],
  "energetic": [
    "energetic upbeat dance pop exciting",
    "high-energy dance electronic exciting",
    "energetic rock powerful anthemic"
  ]
} as const;

/**
 * Example usage of the Fal AI YuE executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic music generation
    const result1 = await executeYuE({
      lyrics: `[verse]
Staring at the sunset, colors paint the sky
Thoughts of you keep swirling, can't deny
I know I let you down, I made mistakes
But I'm here to mend the heart I didn't break

[chorus]
Every road you take, I'll be one step behind
Every dream you chase, I'm reaching for the light
You can't fight this feeling now
I won't back down
You know you can't deny it now
I won't back down`,
      genres: "inspiring female uplifting pop airy vocal electronic bright vocal vocal"
    });

    console.log("Generated music URL:", result1.audio.url);

    // Example 2: Using helper function for rock music
    const rockMusic = createMusicGenerationScenario('rock');
    const result2 = await executeYuE(rockMusic);
    console.log("Rock music:", result2.audio.url);

    // Example 3: Custom lyrics with specific genres
    const customMusic = createMusicGenerationScenario(
      'custom',
      `[verse]
Custom lyrics for your song
Make it short or make it long
This is where your story starts
Let it come from your heart

[chorus]
Custom music generation
For your own creation
Custom music generation
This is your inspiration`,
      "custom personalized unique creative"
    );
    const result3 = await executeYuE(customMusic);
    console.log("Custom music:", result3.audio.url);

    // Example 4: Using predefined templates
    const result4 = await executeYuE({
      lyrics: LYRICS_TEMPLATES.acoustic[0],
      genres: GENRE_COMBINATIONS.acoustic[0]
    });
    console.log("Acoustic music:", result4.audio.url);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeYuEQueue({
      lyrics: `[verse]
Sitting by the window, watching the rain
Thinking of the memories, feeling no pain
Time goes by so slowly here
Everything is clear, everything is clear

[chorus]
Peaceful moments, quiet dreams
Life is not as hard as it seems
Peaceful moments, quiet dreams
Everything will be alright`,
      genres: "acoustic calm peaceful gentle acoustic guitar",
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkYuEStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getYuEResult(request_id);
      console.log("Queue result:", result);
    }

  } catch (error) {
    console.error("Example execution failed:", error);
  }
}

/**
 * Utility function to estimate processing cost
 * 
 * @param estimatedDurationSeconds - Estimated duration of generated music in seconds
 * @returns Estimated cost in USD
 */
export function estimateProcessingCost(estimatedDurationSeconds: number): number {
  const costPerSecond = 0.05;
  return estimatedDurationSeconds * costPerSecond;
}

/**
 * Utility function to validate lyrics format
 * 
 * @param lyrics - The lyrics string to validate
 * @returns Validation result with suggestions
 */
export function validateLyricsFormat(lyrics: string): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedLyrics: string; 
} {
  const suggestions: string[] = [];
  
  // Clean and format lyrics
  const formattedLyrics = lyrics.trim();

  // Check for common issues
  if (lyrics.length > 2000) {
    suggestions.push("Lyrics are too long (max 2000 characters)");
  }

  if (lyrics.length < 10) {
    suggestions.push("Lyrics are too short, consider adding more content");
  }

  // Check for proper structure
  if (!hasValidLyricsStructure(lyrics)) {
    suggestions.push("Lyrics must contain [verse] and [chorus] sections");
  }

  // Check for proper formatting
  const hasVerse = /\[verse\]/i.test(lyrics);
  const hasChorus = /\[chorus\]/i.test(lyrics);
  
  if (!hasVerse) {
    suggestions.push("Consider adding a [verse] section");
  }
  
  if (!hasChorus) {
    suggestions.push("Consider adding a [chorus] section");
  }

  // Check for very long sections
  const sections = lyrics.split(/\[(verse|chorus)\]/i);
  const longSections = sections.filter(section => section.trim().length > 200);
  if (longSections.length > 0) {
    suggestions.push("Consider breaking up very long sections for better music generation");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedLyrics
  };
}

/**
 * Utility function to validate genres format
 * 
 * @param genres - The genres string to validate
 * @returns Validation result with suggestions
 */
export function validateGenresFormat(genres: string): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedGenres: string; 
} {
  const suggestions: string[] = [];
  
  // Clean and format genres
  const formattedGenres = genres.trim();

  // Check for common issues
  if (genres.length > 200) {
    suggestions.push("Genres are too long (max 200 characters)");
  }

  if (genres.length < 3) {
    suggestions.push("Genres are too short, consider adding more descriptive terms");
  }

  // Check for proper spacing
  const genreWords = genres.split(/\s+/);
  if (genreWords.length < 2) {
    suggestions.push("Consider using multiple genre descriptors separated by spaces");
  }

  // Check for common genre terms
  const commonGenres = ['pop', 'rock', 'electronic', 'acoustic', 'jazz', 'blues', 'country', 'folk', 'classical', 'hip hop', 'rap', 'r&b', 'reggae', 'funk', 'soul', 'gospel', 'metal', 'punk', 'indie', 'alternative'];
  const hasCommonGenre = commonGenres.some(genre => genres.toLowerCase().includes(genre));
  
  if (!hasCommonGenre) {
    suggestions.push("Consider including common genre terms like 'pop', 'rock', 'electronic', etc.");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedGenres
  };
}

/**
 * Utility function to get optimal genre settings for music style
 * 
 * @param musicStyle - Type of music style
 * @returns Recommended genre combination
 */
export function getOptimalGenreSettings(musicStyle: 'pop' | 'rock' | 'electronic' | 'acoustic' | 'inspiring' | 'calm' | 'energetic'): string {
  const genreMap = {
    pop: "inspiring female uplifting pop airy vocal electronic bright vocal vocal",
    rock: "rock energetic powerful guitar-driven anthemic",
    electronic: "electronic synthpop electropop energetic dance",
    acoustic: "acoustic calm peaceful gentle acoustic guitar",
    inspiring: "inspiring uplifting motivational empowering",
    calm: "calm peaceful gentle soothing ambient",
    energetic: "energetic upbeat dance pop exciting"
  };

  return genreMap[musicStyle];
}

/**
 * Utility function to enhance lyrics for better music generation
 * 
 * @param lyrics - Base lyrics to enhance
 * @param enhancements - Enhancement options
 * @returns Enhanced lyrics
 */
export function enhanceLyricsForMusic(
  lyrics: string, 
  enhancements: {
    addStructure?: boolean;
    improveFlow?: boolean;
    addEmotionalContext?: boolean;
    addRhythm?: boolean;
  } = {}
): string {
  let enhancedLyrics = lyrics.trim();

  // Add structure if missing
  if (enhancements.addStructure) {
    if (!/\[verse\]/i.test(enhancedLyrics)) {
      enhancedLyrics = `[verse]\n${enhancedLyrics}`;
    }
    if (!/\[chorus\]/i.test(enhancedLyrics)) {
      enhancedLyrics += `\n\n[chorus]\nThis is the chorus of your song\nMake it strong, make it long`;
    }
  }

  // Improve flow
  if (enhancements.improveFlow) {
    enhancedLyrics = enhancedLyrics.replace(/\s+/g, " "); // Normalize spaces
    enhancedLyrics = enhancedLyrics.replace(/([.!?])/g, "$1\n"); // Add line breaks after punctuation
  }

  // Add emotional context
  if (enhancements.addEmotionalContext) {
    if (!/(feeling|emotion|heart|soul|love|dream|hope|fear|joy|pain)/i.test(enhancedLyrics)) {
      enhancedLyrics = enhancedLyrics.replace(/(\[chorus\])/i, "$1\nFeel the emotion in your heart\nThis is where your story starts");
    }
  }

  // Add rhythm
  if (enhancements.addRhythm) {
    // This is a simple enhancement - in practice, you might want more sophisticated rhythm analysis
    enhancedLyrics = enhancedLyrics.replace(/(\n)([A-Z])/g, "$1$2"); // Ensure proper capitalization
  }

  return enhancedLyrics;
}

/**
 * Utility function to generate random lyrics
 * 
 * @param style - Music style
 * @returns Random lyrics from the style
 */
export function generateRandomLyrics(style: keyof typeof LYRICS_TEMPLATES): string {
  const lyrics = LYRICS_TEMPLATES[style];
  const randomIndex = Math.floor(Math.random() * lyrics.length);
  return lyrics[randomIndex];
}

/**
 * Utility function to generate random genres
 * 
 * @param style - Music style
 * @returns Random genre combination from the style
 */
export function generateRandomGenres(style: keyof typeof GENRE_COMBINATIONS): string {
  const genres = GENRE_COMBINATIONS[style];
  const randomIndex = Math.floor(Math.random() * genres.length);
  return genres[randomIndex];
}

/**
 * Utility function to create batch music generation
 * 
 * @param lyricsArray - Array of lyrics
 * @param genresArray - Array of genres
 * @returns Array of YuE inputs
 */
export function createBatchMusicGeneration(
  lyricsArray: string[], 
  genresArray: string[]
): YuEInput[] {
  if (lyricsArray.length !== genresArray.length) {
    throw new Error("Lyrics and genres arrays must have the same length");
  }

  return lyricsArray.map((lyrics, index) => ({
    lyrics,
    genres: genresArray[index]
  }));
}

/**
 * Check if lyrics have valid structure
 * 
 * @param lyrics - The lyrics to check
 * @returns True if lyrics have valid structure
 */
function hasValidLyricsStructure(lyrics: string): boolean {
  const hasVerse = /\[verse\]/i.test(lyrics);
  const hasChorus = /\[chorus\]/i.test(lyrics);
  return hasVerse && hasChorus;
}

/**
 * Supported audio formats
 */
export const SUPPORTED_AUDIO_FORMATS = [
  "MP3"
] as const;

/**
 * Common music generation scenarios
 */
export const MUSIC_GENERATION_SCENARIOS = {
  "pop": "Generate pop music from lyrics",
  "rock": "Generate rock music from lyrics",
  "electronic": "Generate electronic music from lyrics",
  "acoustic": "Generate acoustic music from lyrics",
  "inspiring": "Generate inspiring music from lyrics",
  "calm": "Generate calm music from lyrics",
  "energetic": "Generate energetic music from lyrics"
} as const;

/**
 * Genre categories and descriptions
 */
export const GENRE_CATEGORIES = {
  "pop_genres": ["pop", "pop rock", "indie pop", "bubblegum pop", "synthpop", "teen pop", "electropop"],
  "rock_genres": ["rock", "alternative rock", "indie rock", "pop rock", "soft rock", "hard rock", "progressive rock"],
  "electronic_genres": ["electronic", "synthpop", "electropop", "ambient", "downtempo", "trip hop", "chillout"],
  "acoustic_genres": ["acoustic", "folk", "indie folk", "singer-songwriter", "country", "bluegrass", "americana"],
  "vocal_descriptors": ["female", "male", "airy", "bright", "warm", "powerful", "gentle", "emotional"],
  "mood_descriptors": ["inspiring", "uplifting", "calm", "energetic", "melancholic", "romantic", "dramatic", "peaceful"]
} as const;

/**
 * Lyrics structure guidelines
 */
export const LYRICS_STRUCTURE_GUIDELINES = {
  "verse": "Verses tell the story and provide context",
  "chorus": "Chorus is the main hook and most memorable part",
  "bridge": "Bridge provides contrast and builds tension",
  "outro": "Outro concludes the song and provides closure"
} as const;

/**
 * Music generation tips
 */
export const MUSIC_GENERATION_TIPS = {
  "lyrics_structure": "Use [verse] and [chorus] sections for best results",
  "genre_selection": "Choose genres that match the mood and style of your lyrics",
  "length_guidelines": "Keep lyrics between 10-2000 characters for optimal generation",
  "emotional_expression": "Include emotional words and phrases for better musical expression",
  "rhythm_considerations": "Consider the natural rhythm and flow of your lyrics"
} as const;

export default executeYuE;
