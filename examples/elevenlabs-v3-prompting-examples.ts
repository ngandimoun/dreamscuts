/**
 * Eleven v3 Prompting Guide Examples
 * 
 * This file demonstrates how to use the official Eleven v3 prompting guide features
 * Based on: https://elevenlabs.io/docs/prompting-eleven-v3
 */

import { elevenLabs, v3PromptingGuide, v3VoiceLibrary } from '@/lib/elevenlabs';

// Example 1: Using official v3 audio tags
export async function officialV3AudioTagsExample() {
  try {
    const james = v3VoiceLibrary.getVoiceById("JBFqnCBsd6RMkjVDRZzb"); // James - Husky & Engaging
    if (!james) {
      throw new Error("James voice not found");
    }

    console.log("=== Official V3 Audio Tags Example ===");

    // Voice-related tags from official guide
    const voiceRelatedTags = v3PromptingGuide.getV3AudioTagsByCategory('voiceRelated');
    console.log("Voice-related tags:", voiceRelatedTags);

    // Sound effects from official guide
    const soundEffects = v3PromptingGuide.getV3AudioTagsByCategory('soundEffects');
    console.log("Sound effects:", soundEffects);

    // Unique and special tags from official guide
    const uniqueSpecial = v3PromptingGuide.getV3AudioTagsByCategory('uniqueSpecial');
    console.log("Unique and special tags:", uniqueSpecial);

    // Example using official v3 tags
    const result = await elevenLabs.dialogue(
      `[whispers] I never knew it could be this way, but I'm glad we're here. [sighs] It's been a long journey. [excited] But now we can finally move forward!`,
      {
        voiceId: james.voice_id,
        modelId: 'eleven_multilingual_v2',
        dialogueSettings: {
          stability: 'natural',
          use_audio_tags: true,
          enhance_emotion: true
        },
        voiceSettings: james.settings
      }
    );

    await elevenLabs.playAudio(result.audio);
    return result;
  } catch (error) {
    console.error("Official v3 audio tags example failed:", error);
    throw error;
  }
}

// Example 2: V3 stability settings demonstration
export async function v3StabilitySettingsExample() {
  try {
    const eve = v3VoiceLibrary.searchVoices("Eve")[0];
    if (!eve) {
      throw new Error("Eve voice not found");
    }

    console.log("=== V3 Stability Settings Example ===");

    const stabilitySettings = v3PromptingGuide.getV3StabilitySettings();
    console.log("V3 Stability Settings:", stabilitySettings);

    const testText = `[excited] This is a test of different stability settings! [laughs] Can you hear the difference? [whispers] Each setting should sound different.`;

    const results = [];

    // Test each stability setting
    for (const [stability, config] of Object.entries(stabilitySettings)) {
      console.log(`\nTesting ${stability} stability:`);
      console.log(`Description: ${config.description}`);
      console.log(`Use case: ${config.useCase}`);

      const voiceSettings = v3PromptingGuide.getRecommendedV3VoiceSettings(stability as any);
      const dialogueSettings = v3PromptingGuide.getRecommendedV3DialogueSettings(stability as any);

      const result = await elevenLabs.dialogue(testText, {
        voiceId: eve.voice_id,
        modelId: 'eleven_multilingual_v2',
        dialogueSettings,
        voiceSettings
      });

      results.push({
        stability,
        config,
        voiceSettings,
        dialogueSettings,
        result
      });

      await elevenLabs.playAudio(result.audio);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Pause between tests
    }

    return results;
  } catch (error) {
    console.error("V3 stability settings example failed:", error);
    throw error;
  }
}

// Example 3: Official v3 examples from the guide
export async function officialV3ExamplesExample() {
  try {
    const james = v3VoiceLibrary.getVoiceById("JBFqnCBsd6RMkjVDRZzb");
    const eve = v3VoiceLibrary.searchVoices("Eve")[0];

    if (!james || !eve) {
      throw new Error("Required voices not found");
    }

    console.log("=== Official V3 Examples from Guide ===");

    const examples = v3PromptingGuide.getV3Examples();
    console.log("Available examples:", Object.keys(examples));

    // Expressive monologue example
    console.log("\n--- Expressive Monologue Example ---");
    const monologueResult = await elevenLabs.dialogue(examples.expressiveMonologue, {
      voiceId: james.voice_id,
      modelId: 'eleven_multilingual_v2',
      dialogueSettings: {
        stability: 'creative',
        use_audio_tags: true,
        enhance_emotion: true
      },
      voiceSettings: v3PromptingGuide.getRecommendedV3VoiceSettings('creative')
    });

    await elevenLabs.playAudio(monologueResult.audio);

    // Multi-speaker dialogue example
    console.log("\n--- Multi-Speaker Dialogue Example ---");
    const multiSpeakerText = examples.multiSpeakerDialogue;
    
    // Parse the multi-speaker dialogue
    const lines = multiSpeakerText.split('\n').filter(line => line.trim());
    const speakers = [];
    
    for (const line of lines) {
      const match = line.match(/^Speaker (\d+): (.+)$/);
      if (match) {
        const speakerNum = match[1];
        const text = match[2];
        const voiceId = speakerNum === '1' ? james.voice_id : eve.voice_id;
        
        speakers.push({
          name: `Speaker ${speakerNum}`,
          voice_id: voiceId,
          lines: [text]
        });
      }
    }

    const multiSpeakerResults = await elevenLabs.multiSpeakerDialogue(speakers, {
      dialogueSettings: {
        stability: 'natural',
        use_audio_tags: true,
        multi_speaker: true
      }
    });

    for (const result of multiSpeakerResults) {
      console.log(`${result.speaker}: ${result.text}`);
      await elevenLabs.playAudio(result.audio);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return {
      monologue: monologueResult,
      multiSpeaker: multiSpeakerResults
    };
  } catch (error) {
    console.error("Official v3 examples example failed:", error);
    throw error;
  }
}

// Example 4: Text length validation for v3
export async function v3TextLengthValidationExample() {
  try {
    console.log("=== V3 Text Length Validation Example ===");

    const testTexts = [
      "Hello!", // Too short
      "This is a medium length text that should work okay with v3 but might not be optimal.", // Medium
      "This is a much longer text that should work very well with Eleven v3. The official guide recommends using prompts greater than 250 characters for best results. This text is designed to be long enough to provide consistent and expressive output. It includes multiple sentences and should demonstrate the full capabilities of the v3 model. [excited] This should sound great! [laughs] The longer text provides more context for the model to work with, resulting in more natural and expressive speech generation." // Long enough
    ];

    const results = [];

    for (const text of testTexts) {
      const validation = v3PromptingGuide.validateV3TextLength(text);
      console.log(`\nText: "${text.substring(0, 50)}..."`);
      console.log(`Length: ${validation.length} characters`);
      console.log(`Valid: ${validation.isValid}`);
      console.log(`Recommendation: ${validation.recommendation}`);

      results.push({
        text,
        validation
      });
    }

    return results;
  } catch (error) {
    console.error("V3 text length validation example failed:", error);
    throw error;
  }
}

// Example 5: Punctuation guidance for v3
export async function v3PunctuationGuidanceExample() {
  try {
    const hope = v3VoiceLibrary.searchVoices("Hope")[0];
    if (!hope) {
      throw new Error("Hope voice not found");
    }

    console.log("=== V3 Punctuation Guidance Example ===");

    const punctuationGuidance = v3PromptingGuide.getPunctuationGuidance();
    console.log("Punctuation guidance:", punctuationGuidance);

    const examples = [
      {
        title: "Ellipses for pauses and weight",
        text: "It was a VERY long day [sigh] … nobody listens anymore.",
        guidance: punctuationGuidance.ellipses
      },
      {
        title: "Capitalization for emphasis",
        text: "It was a VERY long day and I'm EXHAUSTED!",
        guidance: punctuationGuidance.capitalization
      },
      {
        title: "Standard punctuation for natural rhythm",
        text: "Hello, how are you today? I hope you're doing well!",
        guidance: punctuationGuidance.standardPunctuation
      }
    ];

    const results = [];

    for (const example of examples) {
      console.log(`\n--- ${example.title} ---`);
      console.log(`Text: "${example.text}"`);
      console.log(`Guidance: ${example.guidance.description}`);

      const result = await elevenLabs.dialogue(example.text, {
        voiceId: hope.voice_id,
        modelId: 'eleven_multilingual_v2',
        dialogueSettings: {
          stability: 'natural',
          use_audio_tags: true,
          enhance_emotion: true
        },
        voiceSettings: hope.settings
      });

      results.push({
        ...example,
        result
      });

      await elevenLabs.playAudio(result.audio);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return results;
  } catch (error) {
    console.error("V3 punctuation guidance example failed:", error);
    throw error;
  }
}

// Example 6: Tag combination recommendations
export async function v3TagCombinationExample() {
  try {
    const reginald = v3VoiceLibrary.searchVoices("Reginald")[0];
    if (!reginald) {
      throw new Error("Reginald voice not found");
    }

    console.log("=== V3 Tag Combination Example ===");

    const tagCombinations = v3PromptingGuide.getTagCombinationRecommendations();
    console.log("Tag combination recommendations:", tagCombinations);

    const examples = [
      {
        title: "Emotional combinations",
        text: "[excited] [laughs] That's amazing! I can't believe it worked!",
        category: "emotional"
      },
      {
        title: "Timing combinations",
        text: "[short pause] Well... [long pause] I guess you're right. [exhales]",
        category: "timing"
      },
      {
        title: "Accent combinations",
        text: "[strong French accent] [excited] Bonjour! Comment allez-vous aujourd'hui?",
        category: "accent"
      }
    ];

    const results = [];

    for (const example of examples) {
      console.log(`\n--- ${example.title} ---`);
      console.log(`Text: "${example.text}"`);

      const result = await elevenLabs.dialogue(example.text, {
        voiceId: reginald.voice_id,
        modelId: 'eleven_multilingual_v2',
        dialogueSettings: {
          stability: 'creative',
          use_audio_tags: true,
          enhance_emotion: true
        },
        voiceSettings: v3PromptingGuide.getRecommendedV3VoiceSettings('creative')
      });

      results.push({
        ...example,
        result
      });

      await elevenLabs.playAudio(result.audio);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return results;
  } catch (error) {
    console.error("V3 tag combination example failed:", error);
    throw error;
  }
}

// Example 7: Voice matching recommendations
export async function v3VoiceMatchingExample() {
  try {
    console.log("=== V3 Voice Matching Example ===");

    const voiceMatching = v3PromptingGuide.getVoiceMatchingRecommendations();
    console.log("Voice matching recommendations:", voiceMatching);

    // Get different types of voices
    const professionalVoices = v3VoiceLibrary.getVoicesByCategory('PROFESSIONAL');
    const characterVoices = v3VoiceLibrary.getVoicesByCategory('CHARACTERS');
    const conversationalVoices = v3VoiceLibrary.getVoicesByCategory('CONVERSATIONAL');

    const examples = [
      {
        title: "Professional voice with professional tags",
        voice: professionalVoices[0],
        text: "[professional] Thank you for calling. How may I assist you today?",
        recommendations: voiceMatching.serious
      },
      {
        title: "Character voice with playful tags",
        voice: characterVoices[0],
        text: "[excited] [laughs] That's hilarious! [giggles] I can't stop laughing!",
        recommendations: voiceMatching.playful
      },
      {
        title: "Conversational voice with emotional tags",
        voice: conversationalVoices[0],
        text: "[excited] I'm so happy to see you! [sad] But I'm also a bit worried about the situation.",
        recommendations: voiceMatching.emotional
      }
    ];

    const results = [];

    for (const example of examples) {
      if (!example.voice) continue;

      console.log(`\n--- ${example.title} ---`);
      console.log(`Voice: ${example.voice.name}`);
      console.log(`Text: "${example.text}"`);
      console.log(`Recommended tags: ${example.recommendations.recommendedTags.join(', ')}`);
      console.log(`Avoid tags: ${example.recommendations.avoidTags.join(', ')}`);

      const result = await elevenLabs.dialogue(example.text, {
        voiceId: example.voice.voice_id,
        modelId: 'eleven_multilingual_v2',
        dialogueSettings: {
          stability: 'natural',
          use_audio_tags: true,
          enhance_emotion: true
        },
        voiceSettings: example.voice.settings
      });

      results.push({
        ...example,
        result
      });

      await elevenLabs.playAudio(result.audio);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return results;
  } catch (error) {
    console.error("V3 voice matching example failed:", error);
    throw error;
  }
}

// Example 8: Complete v3 prompting guide demonstration
export async function completeV3PromptingGuideExample() {
  try {
    console.log("=== Complete V3 Prompting Guide Demonstration ===");

    const james = v3VoiceLibrary.getVoiceById("JBFqnCBsd6RMkjVDRZzb");
    if (!james) {
      throw new Error("James voice not found");
    }

    // Get all v3 prompting guide data
    const allAudioTags = v3PromptingGuide.getAllV3AudioTags();
    const stabilitySettings = v3PromptingGuide.getV3StabilitySettings();
    const voiceGuidance = v3PromptingGuide.getV3VoiceGuidance();
    const examples = v3PromptingGuide.getV3Examples();
    const punctuationGuidance = v3PromptingGuide.getPunctuationGuidance();
    const tagCombinations = v3PromptingGuide.getTagCombinationRecommendations();
    const voiceMatching = v3PromptingGuide.getVoiceMatchingRecommendations();

    console.log(`Total V3 audio tags: ${allAudioTags.length}`);
    console.log(`Stability settings: ${Object.keys(stabilitySettings).length}`);
    console.log(`Voice guidance types: ${Object.keys(voiceGuidance).length}`);
    console.log(`Available examples: ${Object.keys(examples).length}`);
    console.log(`Punctuation guidance types: ${Object.keys(punctuationGuidance).length}`);
    console.log(`Tag combination types: ${Object.keys(tagCombinations).length}`);
    console.log(`Voice matching types: ${Object.keys(voiceMatching).length}`);

    // Demonstrate a comprehensive v3 example
    const comprehensiveText = `[excited] Welcome to the complete Eleven v3 demonstration! [laughs] This is going to be amazing!

[whispers] Let me tell you a secret... [sighs] I've been working on this for a long time.

[excited] But now it's ready! [with genuine belly laugh] Ha ha ha! 

[professional] The v3 model offers incredible expressiveness and emotional range. [thoughtful] It can handle complex dialogue with multiple speakers and emotional states.

[dramatically] "To be or not to be, that is the question!" [impressed] Shakespeare never sounded so good!

[strong French accent] "Zat's life, my friend — you can't control everysing." [laughs] Oui, c'est vrai!

[excited] Thank you for listening to this comprehensive demonstration of Eleven v3 capabilities!`;

    // Validate text length
    const validation = v3PromptingGuide.validateV3TextLength(comprehensiveText);
    console.log(`\nText validation:`);
    console.log(`Length: ${validation.length} characters`);
    console.log(`Valid: ${validation.isValid}`);
    console.log(`Recommendation: ${validation.recommendation}`);

    // Generate with optimal v3 settings
    const result = await elevenLabs.dialogue(comprehensiveText, {
      voiceId: james.voice_id,
      modelId: 'eleven_multilingual_v2',
      dialogueSettings: v3PromptingGuide.getRecommendedV3DialogueSettings('creative'),
      voiceSettings: v3PromptingGuide.getRecommendedV3VoiceSettings('creative')
    });

    await elevenLabs.playAudio(result.audio);

    return {
      guideData: {
        allAudioTags,
        stabilitySettings,
        voiceGuidance,
        examples,
        punctuationGuidance,
        tagCombinations,
        voiceMatching
      },
      validation,
      result
    };
  } catch (error) {
    console.error("Complete v3 prompting guide example failed:", error);
    throw error;
  }
}

// Export all examples
export const v3PromptingExamples = {
  officialV3AudioTagsExample,
  v3StabilitySettingsExample,
  officialV3ExamplesExample,
  v3TextLengthValidationExample,
  v3PunctuationGuidanceExample,
  v3TagCombinationExample,
  v3VoiceMatchingExample,
  completeV3PromptingGuideExample
};
