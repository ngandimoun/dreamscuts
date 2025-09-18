/**
 * ElevenLabs Text to Dialogue Examples
 * 
 * This file demonstrates how to use the ElevenLabs Text to Dialogue functionality
 * with audio tags, multi-speaker conversations, and expressive dialogue generation.
 */

import { elevenLabs, dialogueManager, ElevenLabsService } from '@/lib/elevenlabs';
import type { DialogueSettings, AudioTag } from '@/lib/elevenlabs';

// Example 1: Basic Text to Dialogue with Audio Tags
export async function basicDialogueExample() {
  try {
    const result = await elevenLabs.dialogue(
      `[excited] Okay, you are NOT going to believe this.

You know how I've been totally stuck on that short story?

Like, staring at the screen for HOURS, just... nothing?

[frustrated sigh] I was seriously about to just trash the whole thing. Start over.

Give up, probably. But then!

Last night, I was just doodling, not even thinking about it, right?

And this one little phrase popped into my head. Just... completely out of the blue.

And it wasn't even for the story, initially.

But then I typed it out, just to see. And it was like... the FLOODGATES opened!

Suddenly, I knew exactly where the character needed to go, what the ending had to be...

It all just CLICKED. [happy gasp] I stayed up till, like, 3 AM, just typing like a maniac.

Didn't even stop for coffee! [laughs] And it's... it's GOOD! Like, really good.

It feels so... complete now, you know? Like it finally has a soul.

I am so incredibly PUMPED to finish editing it now.

It went from feeling like a chore to feeling like... MAGIC. Seriously, I'm still buzzing!`,
      {
        voiceId: "JBFqnCBsd6RMkjVDRZzb",
        dialogueSettings: {
          stability: 'creative',
          use_audio_tags: true,
          enhance_emotion: true
        }
      }
    );

    // Play the generated dialogue
    await elevenLabs.playAudio(result.audio, result.output_format);
    
    console.log("Dialogue generated successfully!");
    return result;
  } catch (error) {
    console.error("Dialogue generation failed:", error);
    throw error;
  }
}

// Example 2: Multi-Speaker Conversation
export async function multiSpeakerDialogueExample() {
  try {
    const speakers = [
      {
        name: "Alice",
        voice_id: "JBFqnCBsd6RMkjVDRZzb", // Replace with actual voice IDs
        lines: [
          "[excitedly] Sam! Have you tried the new Eleven V3?",
          "[impressed] Ooh, fancy! Check this out—",
          "[dramatically] I can do full Shakespeare now! \"To be or not to be, that is the question!\"",
          "[delighted] That's so much better than our old \"ha. ha. ha.\" robot chuckle!",
          "[warmly] Same here! It's like we finally got our personality software fully installed."
        ]
      },
      {
        name: "Bob",
        voice_id: "JBFqnCBsd6RMkjVDRZzb", // Replace with actual voice IDs
        lines: [
          "[curiously] Just got it! The clarity is amazing. I can actually do whispers now—",
          "[whispers] like this!",
          "[giggling] Nice! Though I'm more excited about the laugh upgrade. Listen to this—",
          "[with genuine belly laugh] Ha ha ha!",
          "[amazed] Wow! V2 me could never. I'm actually excited to have conversations now instead of just... talking at people."
        ]
      }
    ];

    const results = await elevenLabs.multiSpeakerDialogue(speakers, {
      dialogueSettings: {
        stability: 'natural',
        use_audio_tags: true,
        enhance_emotion: true,
        multi_speaker: true
      }
    });

    // Play each speaker's lines
    for (const result of results) {
      console.log(`${result.speaker}: ${result.text}`);
      await elevenLabs.playAudio(result.audio, result.output_format);
      
      // Small delay between speakers
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return results;
  } catch (error) {
    console.error("Multi-speaker dialogue failed:", error);
    throw error;
  }
}

// Example 3: Customer Service Simulation
export async function customerServiceDialogueExample() {
  try {
    const result = await elevenLabs.dialogue(
      `[professional] "Thank you for calling Tech Solutions. My name is Sarah, how can I help you today?"

[sympathetic] "Oh no, I'm really sorry to hear you're having trouble with your new device. That sounds frustrating."

[questioning] "Okay, could you tell me a little more about what you're seeing on the screen?"

[reassuring] "Alright, based on what you're describing, it sounds like a software glitch. We can definitely walk through some troubleshooting steps to try and fix that."`,
      {
        voiceId: "JBFqnCBsd6RMkjVDRZzb",
        dialogueSettings: {
          stability: 'robust',
          use_audio_tags: true,
          enhance_emotion: true
        }
      }
    );

    await elevenLabs.playAudio(result.audio, result.output_format);
    return result;
  } catch (error) {
    console.error("Customer service dialogue failed:", error);
    throw error;
  }
}

// Example 4: Dynamic and Humorous Dialogue
export async function humorousDialogueExample() {
  try {
    const result = await elevenLabs.dialogue(
      `[laughs] Alright...guys - guys. Seriously.

[exhales] Can you believe just how - realistic - this sounds now?

[laughing hysterically] I mean OH MY GOD...it's so good.

Like you could never do this with the old model.

For example [pauses] could you switch my accent in the old model?

[dismissive] didn't think so. [excited] but you can now!

Check this out... [cute] I'm going to speak with a french accent now..and between you and me

[whispers] I don't know how. [happy] ok.. here goes. [strong French accent] "Zat's life, my friend — you can't control everysing."

[giggles] isn't that insane? Watch, now I'll do a Russian accent -

[strong Russian accent] "Dee Goldeneye eez fully operational and rready for launch."

[sighs] Absolutely, insane! Isn't it..? [sarcastic] I also have some party tricks up my sleeve..

I mean i DID go to music school.

[singing quickly] "Happy birthday to you, happy birthday to you, happy BIRTHDAY dear ElevenLabs... Happy birthday to youuu."`,
      {
        voiceId: "JBFqnCBsd6RMkjVDRZzb",
        dialogueSettings: {
          stability: 'creative',
          use_audio_tags: true,
          enhance_emotion: true
        }
      }
    );

    await elevenLabs.playAudio(result.audio, result.output_format);
    return result;
  } catch (error) {
    console.error("Humorous dialogue failed:", error);
    throw error;
  }
}

// Example 5: Audio Tag Management
export async function audioTagManagementExample() {
  try {
    // Get all available audio tags
    const allTags = elevenLabs.getAudioTags();
    console.log("All available audio tags:", allTags);

    // Get tags by category
    const emotionTags = elevenLabs.getAudioTagsByCategory('emotions');
    const nonVerbalTags = elevenLabs.getAudioTagsByCategory('nonVerbal');
    const soundEffectTags = elevenLabs.getAudioTagsByCategory('soundEffects');

    console.log("Emotion tags:", emotionTags);
    console.log("Non-verbal tags:", nonVerbalTags);
    console.log("Sound effect tags:", soundEffectTags);

    // Search for specific tags
    const laughTags = dialogueManager.searchAudioTags('laugh');
    console.log("Laugh-related tags:", laughTags);

    // Get recommended tags for specific emotions
    const happyTags = dialogueManager.getRecommendedTagsForEmotion('happy');
    const sadTags = dialogueManager.getRecommendedTagsForEmotion('sad');
    
    console.log("Recommended tags for happy:", happyTags);
    console.log("Recommended tags for sad:", sadTags);

    // Validate audio tags in text
    const testText = "[laughs] Hello [invalid_tag] world! [sighs]";
    const validation = dialogueManager.validateAudioTags(testText);
    console.log("Tag validation:", validation);

    // Extract audio tags from text
    const extractedTags = dialogueManager.extractAudioTags(testText);
    console.log("Extracted tags:", extractedTags);

    // Remove audio tags from text
    const cleanText = dialogueManager.removeAudioTags(testText);
    console.log("Clean text:", cleanText);

    return {
      allTags,
      emotionTags,
      nonVerbalTags,
      soundEffectTags,
      laughTags,
      happyTags,
      sadTags,
      validation,
      extractedTags,
      cleanText
    };
  } catch (error) {
    console.error("Audio tag management failed:", error);
    throw error;
  }
}

// Example 6: Text Enhancement with Audio Tags
export async function textEnhancementExample() {
  try {
    const originalText = "Are you serious? I can't believe you did that! That's amazing, I didn't know you could sing! I guess you're right. It's just... difficult.";

    // Enhance text with automatic audio tags
    const enhancedText = elevenLabs.enhanceTextWithAudioTags(originalText, {
      enhance_emotion: true,
      add_audio_tags: true,
      max_tags_per_sentence: 2
    });

    console.log("Original text:", originalText);
    console.log("Enhanced text:", enhancedText);

    // Generate speech with enhanced text
    const result = await elevenLabs.dialogue(enhancedText, {
      voiceId: "JBFqnCBsd6RMkjVDRZzb",
      dialogueSettings: {
        stability: 'natural',
        use_audio_tags: true,
        enhance_emotion: true
      }
    });

    await elevenLabs.playAudio(result.audio, result.output_format);
    
    return { originalText, enhancedText, result };
  } catch (error) {
    console.error("Text enhancement failed:", error);
    throw error;
  }
}

// Example 7: Dialogue Settings for Different Use Cases
export async function dialogueSettingsExample() {
  try {
    const testText = "Hello, welcome to our service. How can I help you today?";

    // Get settings for different use cases
    const conversationSettings = dialogueManager.getDialogueSettingsForUseCase('conversation');
    const narrationSettings = dialogueManager.getDialogueSettingsForUseCase('narration');
    const characterSettings = dialogueManager.getDialogueSettingsForUseCase('character');
    const announcementSettings = dialogueManager.getDialogueSettingsForUseCase('announcement');

    console.log("Conversation settings:", conversationSettings);
    console.log("Narration settings:", narrationSettings);
    console.log("Character settings:", characterSettings);
    console.log("Announcement settings:", announcementSettings);

    // Generate dialogue with different settings
    const results = [];

    for (const [useCase, settings] of [
      ['conversation', conversationSettings],
      ['narration', narrationSettings],
      ['character', characterSettings],
      ['announcement', announcementSettings]
    ]) {
      const result = await elevenLabs.dialogue(testText, {
        voiceId: "JBFqnCBsd6RMkjVDRZzb",
        dialogueSettings: settings
      });

      results.push({ useCase, settings, result });
      console.log(`Generated ${useCase} dialogue`);
    }

    return results;
  } catch (error) {
    console.error("Dialogue settings example failed:", error);
    throw error;
  }
}

// Example 8: Voice Settings Optimization for Dialogue
export async function optimizedVoiceSettingsExample() {
  try {
    const testText = "[excited] This is a test of optimized voice settings for dialogue generation!";

    // Get optimized voice settings for different stability levels
    const creativeSettings = dialogueManager.getDialogueOptimizedVoiceSettings('creative');
    const naturalSettings = dialogueManager.getDialogueOptimizedVoiceSettings('natural');
    const robustSettings = dialogueManager.getDialogueOptimizedVoiceSettings('robust');

    console.log("Creative settings:", creativeSettings);
    console.log("Natural settings:", naturalSettings);
    console.log("Robust settings:", robustSettings);

    // Generate dialogue with different voice settings
    const results = [];

    for (const [stability, voiceSettings] of [
      ['creative', creativeSettings],
      ['natural', naturalSettings],
      ['robust', robustSettings]
    ]) {
      const result = await elevenLabs.dialogue(testText, {
        voiceId: "JBFqnCBsd6RMkjVDRZzb",
        voiceSettings,
        dialogueSettings: {
          stability: stability as 'creative' | 'natural' | 'robust',
          use_audio_tags: true,
          enhance_emotion: true
        }
      });

      results.push({ stability, voiceSettings, result });
      console.log(`Generated dialogue with ${stability} settings`);
    }

    return results;
  } catch (error) {
    console.error("Optimized voice settings example failed:", error);
    throw error;
  }
}

// Example 9: Dialogue Examples from Library
export async function dialogueExamplesExample() {
  try {
    // Get predefined dialogue examples
    const examples = elevenLabs.getDialogueExamples();
    
    console.log("Available dialogue examples:");
    examples.forEach((example, index) => {
      console.log(`${index + 1}. ${example.title}: ${example.description}`);
    });

    // Generate speech for each example
    const results = [];

    for (const example of examples) {
      const result = await elevenLabs.dialogue(example.text, {
        voiceId: "JBFqnCBsd6RMkjVDRZzb",
        dialogueSettings: {
          stability: 'natural',
          use_audio_tags: true,
          enhance_emotion: true
        }
      });

      results.push({ example, result });
      console.log(`Generated: ${example.title}`);
    }

    return results;
  } catch (error) {
    console.error("Dialogue examples failed:", error);
    throw error;
  }
}

// Example 10: Complex Multi-Speaker Scene
export async function complexMultiSpeakerScene() {
  try {
    const speakers = [
      {
        name: "Narrator",
        voice_id: "JBFqnCBsd6RMkjVDRZzb", // Replace with actual voice IDs
        lines: [
          "[dramatically] In a world where technology meets creativity...",
          "[mysterious] Two voices emerge from the digital void...",
          "[building tension] Their conversation begins..."
        ]
      },
      {
        name: "AI_Assistant",
        voice_id: "JBFqnCBsd6RMkjVDRZzb", // Replace with actual voice IDs
        lines: [
          "[professional] Good day! I am your AI assistant, ready to help.",
          "[curious] I notice you seem intrigued by our conversation capabilities.",
          "[helpful] Would you like me to demonstrate some of my features?"
        ]
      },
      {
        name: "User",
        voice_id: "JBFqnCBsd6RMkjVDRZzb", // Replace with actual voice IDs
        lines: [
          "[excited] Wow! This is incredible! You sound so natural!",
          "[amazed] I can't believe how expressive you can be!",
          "[grateful] Thank you for showing me this amazing technology!"
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

    // Play the scene with proper timing
    for (const result of results) {
      console.log(`${result.speaker}: ${result.text}`);
      await elevenLabs.playAudio(result.audio, result.output_format);
      
      // Longer pause for narrator, shorter for dialogue
      const pause = result.speaker === "Narrator" ? 1000 : 500;
      await new Promise(resolve => setTimeout(resolve, pause));
    }

    return results;
  } catch (error) {
    console.error("Complex multi-speaker scene failed:", error);
    throw error;
  }
}

// Export all examples
export const dialogueExamples = {
  basicDialogueExample,
  multiSpeakerDialogueExample,
  customerServiceDialogueExample,
  humorousDialogueExample,
  audioTagManagementExample,
  textEnhancementExample,
  dialogueSettingsExample,
  optimizedVoiceSettingsExample,
  dialogueExamplesExample,
  complexMultiSpeakerScene
};
