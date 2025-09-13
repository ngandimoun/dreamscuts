import { fal } from "@fal-ai/client";

export interface DiaTTSVoiceCloneInput {
  text: string;
  ref_audio_url: string;
  ref_text: string;
}

export interface DiaTTSVoiceCloneOutput {
  audio: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

export interface DiaTTSVoiceCloneOptions {
  logs?: boolean;
  onQueueUpdate?: (update: any) => void;
  webhookUrl?: string;
}

/**
 * Fal AI Dia TTS Voice Clone Executor
 * 
 * Clone dialog voices from a sample audio and generate dialogs from text prompts 
 * using the Dia TTS which leverages advanced AI techniques to create high-quality 
 * text-to-speech. Advanced voice cloning technology that creates natural-sounding 
 * dialogue with speaker identification, voice preservation, and multi-speaker 
 * conversation generation.
 * 
 * @param input - The voice clone input parameters
 * @param options - Additional execution options
 * @returns Promise with the generated audio result
 */
export async function executeDiaTTSVoiceClone(
  input: DiaTTSVoiceCloneInput,
  options: DiaTTSVoiceCloneOptions = {}
): Promise<DiaTTSVoiceCloneOutput> {
  try {
    // Validate required inputs
    if (!input.text || input.text.trim().length === 0) {
      throw new Error("Text is required");
    }

    if (!input.ref_audio_url || input.ref_audio_url.trim().length === 0) {
      throw new Error("Reference audio URL is required");
    }

    if (!input.ref_text || input.ref_text.trim().length === 0) {
      throw new Error("Reference text is required");
    }

    // Validate text length
    if (input.text.length > 5000) {
      throw new Error("Text must be 5000 characters or less");
    }

    if (input.text.length < 1) {
      throw new Error("Text must be at least 1 character");
    }

    // Validate reference text length
    if (input.ref_text.length > 5000) {
      throw new Error("Reference text must be 5000 characters or less");
    }

    if (input.ref_text.length < 1) {
      throw new Error("Reference text must be at least 1 character");
    }

    // Validate reference audio URL format
    try {
      new URL(input.ref_audio_url);
    } catch {
      throw new Error("Reference audio URL must be a valid URL");
    }

    // Validate speaker identification in text
    const speakerPattern = /\[S\d+\]/g;
    const speakersInText = input.text.match(speakerPattern);
    if (!speakersInText || speakersInText.length === 0) {
      throw new Error("Text must contain speaker identification markers like [S1], [S2], etc.");
    }

    // Validate speaker identification in reference text
    const speakersInRefText = input.ref_text.match(speakerPattern);
    if (!speakersInRefText || speakersInRefText.length === 0) {
      throw new Error("Reference text must contain speaker identification markers like [S1], [S2], etc.");
    }

    // Check if speakers in text match reference text
    const uniqueSpeakersInText = [...new Set(speakersInText)];
    const uniqueSpeakersInRefText = [...new Set(speakersInRefText)];
    
    const hasMatchingSpeakers = uniqueSpeakersInText.some(speaker => 
      uniqueSpeakersInRefText.includes(speaker)
    );
    
    if (!hasMatchingSpeakers) {
      throw new Error("Text must contain at least one speaker that matches the reference text speakers");
    }

    // Prepare the request payload
    const payload = {
      text: input.text.trim(),
      ref_audio_url: input.ref_audio_url.trim(),
      ref_text: input.ref_text.trim()
    };

    // Execute the model
    const result = await fal.subscribe("fal-ai/dia-tts/voice-clone", {
      input: payload,
      logs: options.logs || false,
      onQueueUpdate: options.onQueueUpdate
    });

    return result.data as DiaTTSVoiceCloneOutput;

  } catch (error) {
    console.error("Dia TTS Voice Clone execution failed:", error);
    throw new Error(`Dia TTS Voice Clone generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute Dia TTS Voice Clone with queue management for long-running requests
 * 
 * @param input - The voice clone input parameters
 * @param options - Additional execution options including webhook URL
 * @returns Promise with request ID for tracking
 */
export async function executeDiaTTSVoiceCloneQueue(
  input: DiaTTSVoiceCloneInput,
  options: DiaTTSVoiceCloneOptions = {}
): Promise<{ request_id: string }> {
  try {
    // Validate input (same validation as above)
    if (!input.text || input.text.trim().length === 0) {
      throw new Error("Text is required");
    }

    if (!input.ref_audio_url || input.ref_audio_url.trim().length === 0) {
      throw new Error("Reference audio URL is required");
    }

    if (!input.ref_text || input.ref_text.trim().length === 0) {
      throw new Error("Reference text is required");
    }

    if (input.text.length > 5000) {
      throw new Error("Text must be 5000 characters or less");
    }

    if (input.ref_text.length > 5000) {
      throw new Error("Reference text must be 5000 characters or less");
    }

    try {
      new URL(input.ref_audio_url);
    } catch {
      throw new Error("Reference audio URL must be a valid URL");
    }

    // Validate speaker identification
    const speakerPattern = /\[S\d+\]/g;
    const speakersInText = input.text.match(speakerPattern);
    const speakersInRefText = input.ref_text.match(speakerPattern);
    
    if (!speakersInText || speakersInText.length === 0) {
      throw new Error("Text must contain speaker identification markers like [S1], [S2], etc.");
    }

    if (!speakersInRefText || speakersInRefText.length === 0) {
      throw new Error("Reference text must contain speaker identification markers like [S1], [S2], etc.");
    }

    // Prepare the request payload
    const payload = {
      text: input.text.trim(),
      ref_audio_url: input.ref_audio_url.trim(),
      ref_text: input.ref_text.trim()
    };

    // Submit to queue
    const { request_id } = await fal.queue.submit("fal-ai/dia-tts/voice-clone", {
      input: payload,
      webhookUrl: options.webhookUrl
    });

    return { request_id };

  } catch (error) {
    console.error("Dia TTS Voice Clone queue submission failed:", error);
    throw new Error(`Dia TTS Voice Clone queue submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check the status of a queued Dia TTS Voice Clone request
 * 
 * @param requestId - The request ID from queue submission
 * @param logs - Whether to include logs in the response
 * @returns Promise with request status
 */
export async function checkDiaTTSVoiceCloneStatus(
  requestId: string,
  logs: boolean = false
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/dia-tts/voice-clone", {
      requestId,
      logs
    });

    return status;

  } catch (error) {
    console.error("Dia TTS Voice Clone status check failed:", error);
    throw new Error(`Dia TTS Voice Clone status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the result of a completed Dia TTS Voice Clone request
 * 
 * @param requestId - The request ID from queue submission
 * @returns Promise with the generated audio result
 */
export async function getDiaTTSVoiceCloneResult(
  requestId: string
): Promise<DiaTTSVoiceCloneOutput> {
  try {
    const result = await fal.queue.result("fal-ai/dia-tts/voice-clone", {
      requestId
    });

    return result.data as DiaTTSVoiceCloneOutput;

  } catch (error) {
    console.error("Dia TTS Voice Clone result retrieval failed:", error);
    throw new Error(`Dia TTS Voice Clone result retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create voice clone scenarios
 * 
 * @param type - Type of voice clone scenario to create
 * @param customText - Custom text (optional)
 * @param customRefAudio - Custom reference audio URL (optional)
 * @param customRefText - Custom reference text (optional)
 * @returns Dia TTS Voice Clone input configuration
 */
export function createVoiceCloneScenario(
  type: 'conversation' | 'character_dialogue' | 'educational_content' | 'customer_service' | 'storytelling' | 'interview' | 'podcast' | 'game_dialogue' | 'accessibility' | 'language_learning' | 'custom',
  customText?: string,
  customRefAudio?: string,
  customRefText?: string
): DiaTTSVoiceCloneInput {
  const scenarioTemplates = {
    conversation: {
      text: customText || "[S1] Hello, how are you today? [S2] I'm doing great, thank you for asking! [S1] That's wonderful to hear. [S2] How has your day been so far?",
      ref_audio_url: customRefAudio || "https://v3.fal.media/files/elephant/d5lORit2npFfBykcAtyUr_tmplacfh8oa.mp3",
      ref_text: customRefText || "[S1] Dia is an open weights text to dialogue model. [S2] You get full control over scripts and voices. [S1] Wow. Amazing. (laughs) [S2] Try it now on Fal."
    },
    character_dialogue: {
      text: customText || "[S1] Welcome to our magical kingdom! [S2] Thank you for the warm welcome. [S1] What brings you here today? [S2] I'm on a quest to find the ancient treasure.",
      ref_audio_url: customRefAudio || "https://example.com/character_voices.mp3",
      ref_text: customRefText || "[S1] Once upon a time in a land far away. [S2] There lived a brave knight who sought adventure."
    },
    educational_content: {
      text: customText || "[S1] Today we'll learn about photosynthesis. [S2] That sounds interesting! [S1] Plants use sunlight to make food. [S2] How does that work exactly?",
      ref_audio_url: customRefAudio || "https://example.com/teacher_student.mp3",
      ref_text: customRefText || "[S1] Let's start with the basics of biology. [S2] I'm ready to learn something new."
    },
    customer_service: {
      text: customText || "[S1] Thank you for calling our support line. [S2] Hi, I'm having trouble with my account. [S1] I'd be happy to help you with that. [S2] Great, thank you so much.",
      ref_audio_url: customRefAudio || "https://example.com/customer_service.mp3",
      ref_text: customRefText || "[S1] How can I assist you today? [S2] I need help with my order."
    },
    storytelling: {
      text: customText || "[S1] The old man sat by the fire. [S2] Tell me a story, grandfather. [S1] Once upon a time, there was a brave little mouse. [S2] What happened to the mouse?",
      ref_audio_url: customRefAudio || "https://example.com/storyteller.mp3",
      ref_text: customRefText || "[S1] In a small village by the sea. [S2] The children gathered around to listen."
    },
    interview: {
      text: customText || "[S1] Thank you for joining us today. [S2] It's my pleasure to be here. [S1] Can you tell us about your background? [S2] I've been working in this field for over ten years.",
      ref_audio_url: customRefAudio || "https://example.com/interview.mp3",
      ref_text: customRefText || "[S1] Welcome to our show today. [S2] Thank you for having me."
    },
    podcast: {
      text: customText || "[S1] Welcome back to our podcast. [S2] Thanks for having me on the show. [S1] Today we're discussing technology trends. [S2] It's a fascinating topic for sure.",
      ref_audio_url: customRefAudio || "https://example.com/podcast.mp3",
      ref_text: customRefText || "[S1] This is episode one of our podcast. [S2] I'm excited to be here today."
    },
    game_dialogue: {
      text: customText || "[S1] You have entered the dungeon. [S2] I'm ready for this challenge. [S1] Beware of the traps ahead. [S2] I'll be careful, thank you for the warning.",
      ref_audio_url: customRefAudio || "https://example.com/game_voices.mp3",
      ref_text: customRefText || "[S1] Welcome to the game world. [S2] I'm ready to begin my adventure."
    },
    accessibility: {
      text: customText || "[S1] The weather today is sunny with a high of 75 degrees. [S2] That sounds like perfect weather. [S1] There's a 20% chance of rain this evening. [S2] I'll bring an umbrella just in case.",
      ref_audio_url: customRefAudio || "https://example.com/accessibility.mp3",
      ref_text: customRefText || "[S1] Good morning, here's your daily briefing. [S2] Thank you for the information."
    },
    language_learning: {
      text: customText || "[S1] Bonjour, comment allez-vous? [S2] Je vais bien, merci. [S1] Parlez-vous français? [S2] Oui, un peu.",
      ref_audio_url: customRefAudio || "https://example.com/language_learning.mp3",
      ref_text: customRefText || "[S1] Let's practice French together. [S2] I'm ready to learn."
    },
    custom: {
      text: customText || "[S1] This is a custom dialogue. [S2] You can modify this text as needed.",
      ref_audio_url: customRefAudio || "https://example.com/custom_voices.mp3",
      ref_text: customRefText || "[S1] Custom reference text here. [S2] Modify this as needed."
    }
  };

  return scenarioTemplates[type];
}

/**
 * Predefined dialogue templates for different scenarios
 */
export const DIALOGUE_TEMPLATES = {
  "greeting": "[S1] Hello there! [S2] Hi, how are you? [S1] I'm doing great, thanks! [S2] That's wonderful to hear.",
  "introduction": "[S1] Nice to meet you. [S2] Nice to meet you too. [S1] What's your name? [S2] My name is Alex.",
  "question_answer": "[S1] Can you help me with something? [S2] Of course, I'd be happy to help. [S1] Thank you so much. [S2] You're very welcome.",
  "conversation": "[S1] How was your day? [S2] It was pretty good, thanks for asking. [S1] That's great to hear. [S2] How about yours?",
  "farewell": "[S1] Well, I should get going. [S2] It was nice talking with you. [S1] Same here, take care! [S2] You too, goodbye!"
} as const;

/**
 * Common speaker identification patterns
 */
export const SPEAKER_PATTERNS = {
  "two_speakers": "[S1] and [S2]",
  "three_speakers": "[S1], [S2], and [S3]",
  "four_speakers": "[S1], [S2], [S3], and [S4]",
  "multiple_speakers": "[S1], [S2], [S3], [S4], [S5]"
} as const;

/**
 * Example usage of the Dia TTS Voice Clone executor
 */
export async function exampleUsage() {
  try {
    // Example 1: Basic voice clone generation
    const result1 = await executeDiaTTSVoiceClone({
      text: "[S1] Hello, how are you? [S2] I'm good, thank you. [S1] What's your name? [S2] My name is Dia. [S1] Nice to meet you. [S2] Nice to meet you too.",
      ref_audio_url: "https://v3.fal.media/files/elephant/d5lORit2npFfBykcAtyUr_tmplacfh8oa.mp3",
      ref_text: "[S1] Dia is an open weights text to dialogue model. [S2] You get full control over scripts and voices. [S1] Wow. Amazing. (laughs) [S2] Try it now on Fal."
    });

    console.log("Generated audio URL:", result1.audio.url);

    // Example 2: Using helper function for conversation
    const conversation = createVoiceCloneScenario('conversation');
    const result2 = await executeDiaTTSVoiceClone(conversation);
    console.log("Conversation audio:", result2.audio.url);

    // Example 3: Custom voice clone with specific content
    const customDialogue = createVoiceCloneScenario(
      'custom',
      "[S1] Welcome to our magical kingdom! [S2] Thank you for the warm welcome. [S1] What brings you here today? [S2] I'm on a quest to find the ancient treasure.",
      "https://example.com/character_voices.mp3",
      "[S1] Once upon a time in a land far away. [S2] There lived a brave knight who sought adventure."
    );
    const result3 = await executeDiaTTSVoiceClone(customDialogue);
    console.log("Custom dialogue:", result3.audio.url);

    // Example 4: Using predefined dialogue templates
    const result4 = await executeDiaTTSVoiceClone({
      text: DIALOGUE_TEMPLATES.greeting,
      ref_audio_url: "https://example.com/voices.mp3",
      ref_text: "[S1] Hello there! [S2] Hi, how are you?"
    });
    console.log("Greeting dialogue:", result4.audio.url);

    // Example 5: Queue usage for batch processing
    const { request_id } = await executeDiaTTSVoiceCloneQueue({
      text: "[S1] Today we'll learn about photosynthesis. [S2] That sounds interesting! [S1] Plants use sunlight to make food. [S2] How does that work exactly?",
      ref_audio_url: "https://example.com/teacher_student.mp3",
      ref_text: "[S1] Let's start with the basics of biology. [S2] I'm ready to learn something new.",
      webhookUrl: "https://your-webhook-url.com/callback"
    });

    console.log("Queue request ID:", request_id);

    // Check status
    const status = await checkDiaTTSVoiceCloneStatus(request_id, true);
    console.log("Request status:", status);

    // Get result when completed
    if (status.status === "COMPLETED") {
      const result = await getDiaTTSVoiceCloneResult(request_id);
      console.log("Queue result:", result);
    }

  } catch (error) {
    console.error("Example execution failed:", error);
  }
}

/**
 * Utility function to estimate processing cost
 * 
 * @param textLength - Length of the text in characters
 * @returns Estimated cost in USD
 */
export function estimateProcessingCost(textLength: number): number {
  const costPerCharacter = 0.00004;
  return textLength * costPerCharacter;
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
  if (text.length > 5000) {
    suggestions.push("Text is too long (max 5000 characters)");
  }

  if (text.length < 10) {
    suggestions.push("Text is too short, consider adding more dialogue");
  }

  // Check for speaker identification
  const speakerPattern = /\[S\d+\]/g;
  const speakers = text.match(speakerPattern);
  
  if (!speakers || speakers.length === 0) {
    suggestions.push("Text must contain speaker identification markers like [S1], [S2], etc.");
  } else {
    const uniqueSpeakers = [...new Set(speakers)];
    if (uniqueSpeakers.length < 2) {
      suggestions.push("Consider adding at least two different speakers for dialogue");
    }
    
    if (uniqueSpeakers.length > 5) {
      suggestions.push("Too many speakers may be confusing, consider using 2-4 speakers");
    }
  }

  // Check for natural dialogue flow
  const hasQuestions = /\?/g.test(text);
  const hasExclamations = /!/g.test(text);
  
  if (!hasQuestions && !hasExclamations) {
    suggestions.push("Consider adding questions or exclamations for more natural dialogue");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedText
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
  try {
    new URL(formattedURL);
  } catch {
    suggestions.push("URL must be a valid URL format");
  }

  // Check for supported audio formats
  const supportedFormats = ['.mp3', '.ogg', '.wav', '.m4a', '.aac'];
  const hasSupportedFormat = supportedFormats.some(format => 
    formattedURL.toLowerCase().includes(format)
  );
  
  if (!hasSupportedFormat) {
    suggestions.push("URL should point to a supported audio format (MP3, OGG, WAV, M4A, AAC)");
  }

  // Check for HTTPS
  if (!formattedURL.startsWith('https://')) {
    suggestions.push("Consider using HTTPS URLs for better security");
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedURL
  };
}

/**
 * Utility function to validate reference text format
 * 
 * @param refText - The reference text string to validate
 * @param mainText - The main text for comparison
 * @returns Validation result with suggestions
 */
export function validateReferenceTextFormat(refText: string, mainText: string): { 
  isValid: boolean; 
  suggestions: string[]; 
  formattedRefText: string; 
} {
  const suggestions: string[] = [];
  
  // Clean and format reference text
  const formattedRefText = refText.trim();

  // Check for common issues
  if (refText.length > 5000) {
    suggestions.push("Reference text is too long (max 5000 characters)");
  }

  if (refText.length < 10) {
    suggestions.push("Reference text is too short, consider adding more content");
  }

  // Check for speaker identification
  const speakerPattern = /\[S\d+\]/g;
  const refSpeakers = refText.match(speakerPattern);
  const mainSpeakers = mainText.match(speakerPattern);
  
  if (!refSpeakers || refSpeakers.length === 0) {
    suggestions.push("Reference text must contain speaker identification markers like [S1], [S2], etc.");
  } else if (mainSpeakers) {
    const refSpeakerSet = new Set(refSpeakers);
    const mainSpeakerSet = new Set(mainSpeakers);
    
    const hasMatchingSpeakers = [...mainSpeakerSet].some(speaker => refSpeakerSet.has(speaker));
    
    if (!hasMatchingSpeakers) {
      suggestions.push("Reference text should contain at least one speaker that matches the main text speakers");
    }
  }

  return {
    isValid: suggestions.length === 0,
    suggestions,
    formattedRefText
  };
}

/**
 * Utility function to extract speakers from text
 * 
 * @param text - The text to extract speakers from
 * @returns Array of unique speakers found in the text
 */
export function extractSpeakers(text: string): string[] {
  const speakerPattern = /\[S\d+\]/g;
  const speakers = text.match(speakerPattern);
  return speakers ? [...new Set(speakers)].sort() : [];
}

/**
 * Utility function to count characters in text (excluding speaker markers)
 * 
 * @param text - The text to count characters in
 * @returns Number of characters excluding speaker markers
 */
export function countTextCharacters(text: string): number {
  const speakerPattern = /\[S\d+\]\s*/g;
  return text.replace(speakerPattern, '').length;
}

/**
 * Supported audio formats
 */
export const SUPPORTED_AUDIO_FORMATS = [
  "MP3",
  "OGG", 
  "WAV",
  "M4A",
  "AAC"
] as const;

/**
 * Common voice clone scenarios
 */
export const VOICE_CLONE_SCENARIOS = {
  "conversation": "Generate natural conversations between multiple speakers",
  "character_dialogue": "Create character dialogue for games and animations",
  "educational_content": "Generate educational dialogues and lessons",
  "customer_service": "Create customer service interactions",
  "storytelling": "Generate storytelling and narrative content",
  "interview": "Create interview-style conversations",
  "podcast": "Generate podcast-style discussions",
  "game_dialogue": "Create game character interactions",
  "accessibility": "Generate accessible content for assistive technology",
  "language_learning": "Create language learning dialogues"
} as const;

/**
 * Speaker identification examples
 */
export const SPEAKER_EXAMPLES = {
  "two_speakers": "[S1] Hello there! [S2] Hi, how are you?",
  "three_speakers": "[S1] Welcome everyone. [S2] Thank you for having us. [S3] It's great to be here.",
  "four_speakers": "[S1] Let's start the meeting. [S2] I'm ready. [S3] Me too. [S4] Let's begin.",
  "with_actions": "[S1] Hello! (waves) [S2] Hi there! (smiles) [S1] How are you doing? [S2] I'm doing great, thanks!"
} as const;

export default executeDiaTTSVoiceClone;
