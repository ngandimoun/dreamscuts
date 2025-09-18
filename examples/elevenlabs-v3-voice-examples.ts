/**
 * ElevenLabs V3 Voice Library Examples
 * 
 * This file demonstrates how to use the V3 voice library with different voices
 * and their specific capabilities for various use cases.
 */

import { elevenLabs, v3VoiceLibrary, V3VoiceLibrary } from '@/lib/elevenlabs';
import type { V3Voice } from '@/lib/elevenlabs';

// Example 1: Using James - Husky & Engaging for Narrative Content
export async function jamesNarrativeExample() {
  try {
    const james = v3VoiceLibrary.getVoiceById("JBFqnCBsd6RMkjVDRZzb");
    if (!james) {
      throw new Error("James voice not found");
    }

    console.log(`Using ${james.name} for narrative content`);
    console.log(`Description: ${james.description}`);
    console.log(`Best for: ${james.best_for.join(', ')}`);
    console.log(`Personality: ${james.personality.join(', ')}`);

    const result = await elevenLabs.dialogue(
      `[excited] Welcome to our story! [dramatically] Once upon a time, in a land far, far away... [whispers] there lived a brave knight who embarked on an epic quest.`,
      {
        voiceId: james.voice_id,
        dialogueSettings: {
          stability: james.stability_recommendation,
          use_audio_tags: true,
          enhance_emotion: true
        },
        voiceSettings: james.settings
      }
    );

    await elevenLabs.playAudio(result.audio);
    return result;
  } catch (error) {
    console.error("James narrative example failed:", error);
    throw error;
  }
}

// Example 2: Using Eve for Conversational Content
export async function eveConversationalExample() {
  try {
    const eve = v3VoiceLibrary.searchVoices("Eve")[0];
    if (!eve) {
      throw new Error("Eve voice not found");
    }

    console.log(`Using ${eve.name} for conversational content`);
    console.log(`Emotional range: ${eve.emotional_range}`);
    console.log(`Audio tag compatibility: ${eve.audio_tag_compatibility}`);

    const result = await elevenLabs.dialogue(
      `[excited] Hi there! [laughs] I'm so excited to talk with you today! [curious] What would you like to chat about? [happy] I'm here to help with anything you need!`,
      {
        voiceId: eve.voice_id,
        dialogueSettings: {
          stability: eve.stability_recommendation,
          use_audio_tags: true,
          enhance_emotion: true
        },
        voiceSettings: eve.settings
      }
    );

    await elevenLabs.playAudio(result.audio);
    return result;
  } catch (error) {
    console.error("Eve conversational example failed:", error);
    throw error;
  }
}

// Example 3: Using Reginald for Character/Villain Content
export async function reginaldVillainExample() {
  try {
    const reginald = v3VoiceLibrary.searchVoices("Reginald")[0];
    if (!reginald) {
      throw new Error("Reginald voice not found");
    }

    console.log(`Using ${reginald.name} for villain character`);
    console.log(`Use cases: ${reginald.use_cases.join(', ')}`);
    console.log(`Personality: ${reginald.personality.join(', ')}`);

    const result = await elevenLabs.dialogue(
      `[dramatically] So, you've finally found me... [laughs] Excellent! [whispers] I've been waiting for this moment. [angry] You think you can stop me? [laughs harder] How amusing!`,
      {
        voiceId: reginald.voice_id,
        dialogueSettings: {
          stability: reginald.stability_recommendation,
          use_audio_tags: true,
          enhance_emotion: true
        },
        voiceSettings: reginald.settings
      }
    );

    await elevenLabs.playAudio(result.audio);
    return result;
  } catch (error) {
    console.error("Reginald villain example failed:", error);
    throw error;
  }
}

// Example 4: Using Hope for Social Media Content
export async function hopeSocialMediaExample() {
  try {
    const hope = v3VoiceLibrary.searchVoices("Hope")[0];
    if (!hope) {
      throw new Error("Hope voice not found");
    }

    console.log(`Using ${hope.name} for social media content`);
    console.log(`Best for: ${hope.best_for.join(', ')}`);
    console.log(`Age range: ${hope.age_range}`);

    const result = await elevenLabs.dialogue(
      `[excited] Hey everyone! [happy] Welcome back to my channel! [enthusiastic] Today we're going to talk about something AMAZING! [laughs] Are you ready? Let's go!`,
      {
        voiceId: hope.voice_id,
        dialogueSettings: {
          stability: hope.stability_recommendation,
          use_audio_tags: true,
          enhance_emotion: true
        },
        voiceSettings: hope.settings
      }
    );

    await elevenLabs.playAudio(result.audio);
    return result;
  } catch (error) {
    console.error("Hope social media example failed:", error);
    throw error;
  }
}

// Example 5: Using Bradford for Professional Content
export async function bradfordProfessionalExample() {
  try {
    const bradford = v3VoiceLibrary.searchVoices("Bradford")[0];
    if (!bradford) {
      throw new Error("Bradford voice not found");
    }

    console.log(`Using ${bradford.name} for professional content`);
    console.log(`Accent: ${bradford.accent}`);
    console.log(`Stability recommendation: ${bradford.stability_recommendation}`);

    const result = await elevenLabs.dialogue(
      `[professional] Good morning, ladies and gentlemen. [reassuring] Today's presentation will cover our quarterly results and future strategies. [confident] Let's begin with the key metrics.`,
      {
        voiceId: bradford.voice_id,
        dialogueSettings: {
          stability: bradford.stability_recommendation,
          use_audio_tags: true,
          enhance_emotion: true
        },
        voiceSettings: bradford.settings
      }
    );

    await elevenLabs.playAudio(result.audio);
    return result;
  } catch (error) {
    console.error("Bradford professional example failed:", error);
    throw error;
  }
}

// Example 6: Multi-Speaker Dialogue with Different V3 Voices
export async function multiSpeakerV3Example() {
  try {
    // Get different character voices
    const james = v3VoiceLibrary.getVoiceById("JBFqnCBsd6RMkjVDRZzb"); // James
    const eve = v3VoiceLibrary.searchVoices("Eve")[0]; // Eve
    const reginald = v3VoiceLibrary.searchVoices("Reginald")[0]; // Reginald

    if (!james || !eve || !reginald) {
      throw new Error("One or more voices not found");
    }

    console.log("Creating multi-speaker dialogue with V3 voices:");
    console.log(`- ${james.name} (${james.gender}, ${james.accent})`);
    console.log(`- ${eve.name} (${eve.gender}, ${eve.accent})`);
    console.log(`- ${reginald.name} (${reginald.gender}, ${reginald.accent})`);

    const speakers = [
      {
        name: "James",
        voice_id: james.voice_id,
        lines: [
          "[excited] Welcome to our adventure! [dramatically] Today we embark on a quest!",
          "[confident] I'll lead the way through this dangerous journey."
        ]
      },
      {
        name: "Eve",
        voice_id: eve.voice_id,
        lines: [
          "[happy] I'm so excited to be part of this team! [enthusiastic] Let's do this!",
          "[curious] What challenges do you think we'll face along the way?"
        ]
      },
      {
        name: "Reginald",
        voice_id: reginald.voice_id,
        lines: [
          "[dramatically] Ah, foolish heroes... [laughs] You think you can succeed?",
          "[whispers] I'll be watching... waiting... [angry] Your journey ends here!"
        ]
      }
    ];

    const results = await elevenLabs.multiSpeakerDialogue(speakers, {
      dialogueSettings: {
        stability: 'creative',
        use_audio_tags: true,
        enhance_emotion: true,
        multi_speaker: true
      }
    });

    // Play each speaker's lines
    for (const result of results) {
      console.log(`${result.speaker}: ${result.text}`);
      await elevenLabs.playAudio(result.audio);
      
      // Small delay between speakers
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return results;
  } catch (error) {
    console.error("Multi-speaker V3 example failed:", error);
    throw error;
  }
}

// Example 7: Voice Library Exploration
export async function voiceLibraryExploration() {
  try {
    console.log("=== V3 Voice Library Exploration ===\n");

    // Get all V3 voices
    const allVoices = v3VoiceLibrary.getAllV3Voices();
    console.log(`Total V3 voices available: ${allVoices.length}\n`);

    // Get voices by category
    const categories = ['NARRATIVE', 'CONVERSATIONAL', 'CHARACTERS', 'SOCIAL_MEDIA', 'PROFESSIONAL', 'GAMING', 'AUDIOBOOKS'];
    
    for (const category of categories) {
      const voices = v3VoiceLibrary.getVoicesByCategory(category as any);
      console.log(`${category}: ${voices.length} voices`);
      if (voices.length > 0) {
        console.log(`  Examples: ${voices.slice(0, 3).map(v => v.name).join(', ')}`);
      }
    }

    console.log("\n=== Voice Recommendations ===\n");

    // Get voices by recommendation
    const recommendations = ['DIALOGUE_EXCELLENT', 'PROFESSIONAL', 'CHARACTERS', 'SOCIAL_MEDIA', 'AUDIOBOOKS'];
    
    for (const rec of recommendations) {
      const voices = v3VoiceLibrary.getVoicesByRecommendation(rec as any);
      console.log(`${rec}: ${voices.length} voices`);
      if (voices.length > 0) {
        console.log(`  Examples: ${voices.slice(0, 3).map(v => v.name).join(', ')}`);
      }
    }

    console.log("\n=== Voice Characteristics ===\n");

    // Get voices by gender
    const maleVoices = v3VoiceLibrary.getVoicesByGender('male');
    const femaleVoices = v3VoiceLibrary.getVoicesByGender('female');
    console.log(`Male voices: ${maleVoices.length}`);
    console.log(`Female voices: ${femaleVoices.length}`);

    // Get voices by emotional range
    const highEmotional = v3VoiceLibrary.getVoicesByEmotionalRange('high');
    const mediumEmotional = v3VoiceLibrary.getVoicesByEmotionalRange('medium');
    const lowEmotional = v3VoiceLibrary.getVoicesByEmotionalRange('low');
    console.log(`High emotional range: ${highEmotional.length}`);
    console.log(`Medium emotional range: ${mediumEmotional.length}`);
    console.log(`Low emotional range: ${lowEmotional.length}`);

    // Get voices by accent
    const americanVoices = v3VoiceLibrary.getVoicesByAccent('American');
    const britishVoices = v3VoiceLibrary.getVoicesByAccent('British');
    console.log(`American accent voices: ${americanVoices.length}`);
    console.log(`British accent voices: ${britishVoices.length}`);

    // Get audio tag optimized voices
    const audioTagVoices = v3VoiceLibrary.getAudioTagOptimizedVoices();
    console.log(`Audio tag optimized voices: ${audioTagVoices.length}`);

    return {
      totalVoices: allVoices.length,
      categories: categories.reduce((acc, cat) => {
        acc[cat] = v3VoiceLibrary.getVoicesByCategory(cat as any).length;
        return acc;
      }, {} as Record<string, number>),
      recommendations: recommendations.reduce((acc, rec) => {
        acc[rec] = v3VoiceLibrary.getVoicesByRecommendation(rec as any).length;
        return acc;
      }, {} as Record<string, number>),
      characteristics: {
        male: maleVoices.length,
        female: femaleVoices.length,
        highEmotional: highEmotional.length,
        mediumEmotional: mediumEmotional.length,
        lowEmotional: lowEmotional.length,
        american: americanVoices.length,
        british: britishVoices.length,
        audioTagOptimized: audioTagVoices.length
      }
    };
  } catch (error) {
    console.error("Voice library exploration failed:", error);
    throw error;
  }
}

// Example 8: Voice Search and Filtering
export async function voiceSearchExample() {
  try {
    console.log("=== Voice Search Examples ===\n");

    // Search by name
    const jamesResults = v3VoiceLibrary.searchVoices("James");
    console.log(`Search for "James": ${jamesResults.length} results`);
    jamesResults.forEach(voice => {
      console.log(`  - ${voice.name}: ${voice.description.substring(0, 50)}...`);
    });

    // Search by personality trait
    const energeticVoices = v3VoiceLibrary.searchVoices("energetic");
    console.log(`\nSearch for "energetic": ${energeticVoices.length} results`);
    energeticVoices.forEach(voice => {
      console.log(`  - ${voice.name}: ${voice.personality.join(', ')}`);
    });

    // Search by use case
    const gamingVoices = v3VoiceLibrary.searchVoices("gaming");
    console.log(`\nSearch for "gaming": ${gamingVoices.length} results`);
    gamingVoices.forEach(voice => {
      console.log(`  - ${voice.name}: ${voice.use_cases.join(', ')}`);
    });

    // Get voices for specific use case
    const storytellingVoices = v3VoiceLibrary.getVoicesForUseCase("storytelling");
    console.log(`\nVoices for "storytelling": ${storytellingVoices.length} results`);
    storytellingVoices.forEach(voice => {
      console.log(`  - ${voice.name}: ${voice.description.substring(0, 50)}...`);
    });

    return {
      jamesResults,
      energeticVoices,
      gamingVoices,
      storytellingVoices
    };
  } catch (error) {
    console.error("Voice search example failed:", error);
    throw error;
  }
}

// Example 9: Voice Settings Optimization
export async function voiceSettingsOptimization() {
  try {
    console.log("=== Voice Settings Optimization ===\n");

    const voices = [
      v3VoiceLibrary.getVoiceById("JBFqnCBsd6RMkjVDRZzb"), // James
      v3VoiceLibrary.searchVoices("Eve")[0], // Eve
      v3VoiceLibrary.searchVoices("Reginald")[0] // Reginald
    ].filter(Boolean);

    for (const voice of voices) {
      if (!voice) continue;

      console.log(`\n${voice.name}:`);
      console.log(`  Stability recommendation: ${voice.stability_recommendation}`);
      console.log(`  Emotional range: ${voice.emotional_range}`);
      console.log(`  Audio tag compatibility: ${voice.audio_tag_compatibility}`);
      console.log(`  Recommended settings:`);
      console.log(`    - Stability: ${voice.settings.stability}`);
      console.log(`    - Similarity Boost: ${voice.settings.similarity_boost}`);
      console.log(`    - Style: ${voice.settings.style}`);
      console.log(`    - Speed: ${voice.settings.speed}`);
      console.log(`    - Speaker Boost: ${voice.settings.use_speaker_boost}`);

      // Get recommended settings
      const recommendedSettings = v3VoiceLibrary.getRecommendedSettings(voice.voice_id);
      if (recommendedSettings) {
        console.log(`  Verified settings match: ${JSON.stringify(recommendedSettings) === JSON.stringify(voice.settings)}`);
      }
    }

    return voices.map(voice => ({
      name: voice?.name,
      settings: voice?.settings,
      recommendations: voice ? v3VoiceLibrary.getRecommendedSettings(voice.voice_id) : null
    }));
  } catch (error) {
    console.error("Voice settings optimization failed:", error);
    throw error;
  }
}

// Example 10: Random Voice Selection
export async function randomVoiceSelection() {
  try {
    console.log("=== Random Voice Selection ===\n");

    // Get random voice from all voices
    const randomVoice = v3VoiceLibrary.getRandomVoice();
    console.log(`Random voice: ${randomVoice.name}`);
    console.log(`Description: ${randomVoice.description}`);
    console.log(`Best for: ${randomVoice.best_for.join(', ')}`);

    // Get random voice from specific category
    const randomCharacter = v3VoiceLibrary.getRandomVoice('CHARACTERS');
    console.log(`\nRandom character voice: ${randomCharacter.name}`);
    console.log(`Description: ${randomCharacter.description}`);
    console.log(`Personality: ${randomCharacter.personality.join(', ')}`);

    // Get random voice from conversational category
    const randomConversational = v3VoiceLibrary.getRandomVoice('CONVERSATIONAL');
    console.log(`\nRandom conversational voice: ${randomConversational.name}`);
    console.log(`Description: ${randomConversational.description}`);
    console.log(`Use cases: ${randomConversational.use_cases.join(', ')}`);

    // Generate speech with random voice
    const result = await elevenLabs.dialogue(
      `[excited] Hello! I'm ${randomVoice.name}! [happy] I'm a ${randomVoice.emotional_range} emotional range voice, perfect for ${randomVoice.best_for.join(' and ')}! [laughs] Nice to meet you!`,
      {
        voiceId: randomVoice.voice_id,
        dialogueSettings: {
          stability: randomVoice.stability_recommendation,
          use_audio_tags: true,
          enhance_emotion: true
        },
        voiceSettings: randomVoice.settings
      }
    );

    await elevenLabs.playAudio(result.audio);
    
    return {
      randomVoice,
      randomCharacter,
      randomConversational,
      result
    };
  } catch (error) {
    console.error("Random voice selection failed:", error);
    throw error;
  }
}

// Export all examples
export const v3VoiceExamples = {
  jamesNarrativeExample,
  eveConversationalExample,
  reginaldVillainExample,
  hopeSocialMediaExample,
  bradfordProfessionalExample,
  multiSpeakerV3Example,
  voiceLibraryExploration,
  voiceSearchExample,
  voiceSettingsOptimization,
  randomVoiceSelection
};
