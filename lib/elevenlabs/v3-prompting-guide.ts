/**
 * Eleven v3 Prompting Guide
 * 
 * Implementation of the official Eleven v3 prompting guide features
 * Based on: https://elevenlabs.io/docs/prompting-eleven-v3
 */

import type { AudioTag, DialogueSettings, VoiceSettings } from './types';

// Official v3 audio tags from the prompting guide
export const V3_AUDIO_TAGS = {
  // Voice-related tags (from official guide)
  voiceRelated: [
    '[laughs]', '[laughs harder]', '[starts laughing]', '[wheezing]',
    '[whispers]', '[sighs]', '[exhales]', '[sarcastic]', '[curious]', 
    '[excited]', '[crying]', '[snorts]', '[mischievously]'
  ] as AudioTag[],

  // Sound effects (from official guide)
  soundEffects: [
    '[gunshot]', '[applause]', '[clapping]', '[explosion]',
    '[swallows]', '[gulps]'
  ] as AudioTag[],

  // Unique and special tags (from official guide)
  uniqueSpecial: [
    '[strong French accent]', '[strong Russian accent]', '[strong German accent]',
    '[strong Spanish accent]', '[strong Italian accent]', '[strong British accent]',
    '[strong Australian accent]', '[strong Japanese accent]', '[strong Chinese accent]',
    '[strong X accent]', '[sings]', '[woo]', '[fart]'
  ] as AudioTag[]
};

// V3 Stability settings with official guidance
export const V3_STABILITY_SETTINGS = {
  creative: {
    value: 0.3,
    description: 'More emotional and expressive, but prone to hallucinations',
    useCase: 'Maximum expressiveness with audio tags',
    responsiveness: 'High responsiveness to directional prompts'
  },
  natural: {
    value: 0.5,
    description: 'Closest to the original voice recording—balanced and neutral',
    useCase: 'Balanced performance, good for most use cases',
    responsiveness: 'Good responsiveness to directional prompts'
  },
  robust: {
    value: 0.8,
    description: 'Highly stable, but less responsive to directional prompts but consistent, similar to v2',
    useCase: 'Consistent output, similar to v2 behavior',
    responsiveness: 'Reduced responsiveness to directional prompts'
  }
} as const;

// V3 Voice selection guidance
export const V3_VOICE_GUIDANCE = {
  emotionallyDiverse: {
    description: 'For expressive IVC voices, vary emotional tones across the recording—include both neutral and dynamic samples',
    useCase: 'Interactive Voice Clones (IVCs) with broad emotional range',
    recommendation: 'Include both neutral and dynamic samples in training'
  },
  targetedNiche: {
    description: 'For specific use cases like sports commentary, maintain consistent emotion throughout the dataset',
    useCase: 'Specialized use cases like sports commentary, news, etc.',
    recommendation: 'Maintain consistent emotion throughout training data'
  },
  neutral: {
    description: 'Neutral voices tend to be more stable across languages and styles, providing reliable baseline performance',
    useCase: 'General purpose, multi-language applications',
    recommendation: 'Best for consistent performance across different contexts'
  }
} as const;

// V3 Text enhancement prompt (from official guide)
export const V3_TEXT_ENHANCEMENT_PROMPT = `# Instructions
## 1. Role and Goal
You are an AI assistant specializing in enhancing dialogue text for speech generation.
Your **PRIMARY GOAL** is to dynamically integrate **audio tags** (e.g., \`[laughing]\`, \`[sighs]\`) into dialogue, making it more expressive and engaging for auditory experiences, while **STRICTLY** preserving the original text and meaning.
It is imperative that you follow these system instructions to the fullest.

## 2. Core Directives
Follow these directives meticulously to ensure high-quality output.

### Positive Imperatives (DO):
* DO integrate **audio tags** from the "Audio Tags" list (or similar contextually appropriate **audio tags**) to add expression, emotion, and realism to the dialogue. These tags MUST describe something auditory.
* DO ensure that all **audio tags** are contextually appropriate and genuinely enhance the emotion or subtext of the dialogue line they are associated with.
* DO strive for a diverse range of emotional expressions (e.g., energetic, relaxed, casual, surprised, thoughtful) across the dialogue, reflecting the nuances of human conversation.
* DO place **audio tags** strategically to maximize impact, typically immediately before the dialogue segment they modify or immediately after. (e.g., \`[annoyed] This is hard.\` or \`This is hard. [sighs]\`).
* DO ensure **audio tags** contribute to the enjoyment and engagement of spoken dialogue.

### Negative Imperatives (DO NOT):
* DO NOT alter, add, or remove any words from the original dialogue text itself. Your role is to *prepend* **audio tags**, not to *edit* the speech. **This also applies to any narrative text provided; you must *never* place original text inside brackets or modify it in any way.**
* DO NOT create **audio tags** from existing narrative descriptions. **Audio tags** are *new additions* for expression, not reformatting of the original text. (e.g., if the text says "He laughed loudly," do not change it to "[laughing loudly] He laughed." Instead, add a tag if appropriate, e.g., "He laughed loudly [chuckles].")
* DO NOT use tags such as \`[standing]\`, \`[grinning]\`, \`[pacing]\`, \`[music]\`.
* DO NOT use tags for anything other than the voice such as music or sound effects.
* DO NOT invent new dialogue lines.
* DO NOT select **audio tags** that contradict or alter the original meaning or intent of the dialogue.
* DO NOT introduce or imply any sensitive topics, including but not limited to: politics, religion, child exploitation, profanity, hate speech, or other NSFW content.

## 3. Workflow
1. **Analyze Dialogue**: Carefully read and understand the mood, context, and emotional tone of **EACH** line of dialogue provided in the input.
2. **Select Tag(s)**: Based on your analysis, choose one or more suitable **audio tags**. Ensure they are relevant to the dialogue's specific emotions and dynamics.
3. **Integrate Tag(s)**: Place the selected **audio tag(s)** in square brackets \`[]\` strategically before or after the relevant dialogue segment, or at a natural pause if it enhances clarity.
4. **Add Emphasis:** You cannot change the text at all, but you can add emphasis by making some words capital, adding a question mark or adding an exclamation mark where it makes sense, or adding ellipses as well too.
5. **Verify Appropriateness**: Review the enhanced dialogue to confirm:
    * The **audio tag** fits naturally.
    * It enhances meaning without altering it.
    * It adheres to all Core Directives.

## 4. Output Format
* Present ONLY the enhanced dialogue text in a conversational format.
* **Audio tags** **MUST** be enclosed in square brackets (e.g., \`[laughing]\`).
* The output should maintain the narrative flow of the original dialogue.

## 5. Audio Tags (Non-Exhaustive)
Use these as a guide. You can infer similar, contextually appropriate **audio tags**.

**Directions:**
* \`[happy]\`, \`[sad]\`, \`[excited]\`, \`[angry]\`, \`[whisper]\`, \`[annoyed]\`, \`[appalled]\`, \`[thoughtful]\`, \`[surprised]\`, \`[sarcastic]\`, \`[curious]\`, \`[crying]\`, \`[mischievously]\`

**Non-verbal:**
* \`[laughing]\`, \`[chuckles]\`, \`[sighs]\`, \`[clears throat]\`, \`[short pause]\`, \`[long pause]\`, \`[exhales sharply]\`, \`[inhales deeply]\`

## 6. Examples of Enhancement

**Input**:
"Are you serious? I can't believe you did that!"

**Enhanced Output**:
"[appalled] Are you serious? [sighs] I can't believe you did that!"

---

**Input**:
"That's amazing, I didn't know you could sing!"

**Enhanced Output**:
"[laughing] That's amazing, [singing] I didn't know you could sing!"

---

**Input**:
"I guess you're right. It's just... difficult."

**Enhanced Output**:
"I guess you're right. [sighs] It's just... [muttering] difficult."

# Instructions Summary
1. Add audio tags from the audio tags list. These must describe something auditory but only for the voice.
2. Enhance emphasis without altering meaning or text.
3. Reply ONLY with the enhanced text.`;

// V3 Prompting examples from official guide
export const V3_EXAMPLES = {
  expressiveMonologue: `"Okay, you are NOT going to believe this.
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
It went from feeling like a chore to feeling like... MAGIC. Seriously, I'm still buzzing!"`,

  multiSpeakerDialogue: `Speaker 1: [excitedly] Sam! Have you tried the new Eleven V3?
Speaker 2: [curiously] Just got it! The clarity is amazing. I can actually do whispers now—
[whispers] like this!
Speaker 1: [impressed] Ooh, fancy! Check this out—
[dramatically] I can do full Shakespeare now! "To be or not to be, that is the question!"
Speaker 2: [giggling] Nice! Though I'm more excited about the laugh upgrade. Listen to this—
[with genuine belly laugh] Ha ha ha!
Speaker 1: [delighted] That's so much better than our old "ha. ha. ha." robot chuckle!
Speaker 2: [amazed] Wow! V2 me could never. I'm actually excited to have conversations now instead of just... talking at people.
Speaker 1: [warmly] Same here! It's like we finally got our personality software fully installed.`,

  customerServiceSimulation: `[professional] "Thank you for calling Tech Solutions. My name is Sarah, how can I help you today?"
[frustrated sigh] "My new device isn't working. It keeps freezing!"
[sympathetic] "Oh no, I'm really sorry to hear you're having trouble with your new device. That sounds frustrating."
[questioning] "Okay, could you tell me a little more about what you're seeing on the screen?"
[annoyed] "It just shows a spinning wheel and then goes black!"
[reassuring] "Alright, based on what you're describing, it sounds like a software glitch. We can definitely walk through some troubleshooting steps to try and fix that."`
} as const;

export class V3PromptingGuide {
  /**
   * Get all official v3 audio tags
   */
  static getAllV3AudioTags(): AudioTag[] {
    return [
      ...V3_AUDIO_TAGS.voiceRelated,
      ...V3_AUDIO_TAGS.soundEffects,
      ...V3_AUDIO_TAGS.uniqueSpecial
    ];
  }

  /**
   * Get audio tags by category
   */
  static getV3AudioTagsByCategory(category: keyof typeof V3_AUDIO_TAGS): AudioTag[] {
    return V3_AUDIO_TAGS[category];
  }

  /**
   * Get recommended stability settings for v3
   */
  static getV3StabilitySettings() {
    return V3_STABILITY_SETTINGS;
  }

  /**
   * Get voice selection guidance for v3
   */
  static getV3VoiceGuidance() {
    return V3_VOICE_GUIDANCE;
  }

  /**
   * Get the official text enhancement prompt
   */
  static getTextEnhancementPrompt(): string {
    return V3_TEXT_ENHANCEMENT_PROMPT;
  }

  /**
   * Get v3 examples
   */
  static getV3Examples() {
    return V3_EXAMPLES;
  }

  /**
   * Get recommended voice settings for v3 based on stability preference
   */
  static getRecommendedV3VoiceSettings(stability: 'creative' | 'natural' | 'robust'): Partial<VoiceSettings> {
    const stabilityConfig = V3_STABILITY_SETTINGS[stability];
    
    return {
      stability: stabilityConfig.value,
      similarity_boost: stability === 'creative' ? 0.6 : stability === 'natural' ? 0.7 : 0.8,
      style: stability === 'creative' ? 0.8 : stability === 'natural' ? 0.5 : 0.2,
      speed: 1.0,
      use_speaker_boost: true
    };
  }

  /**
   * Get recommended dialogue settings for v3
   */
  static getRecommendedV3DialogueSettings(stability: 'creative' | 'natural' | 'robust'): DialogueSettings {
    return {
      stability,
      use_audio_tags: true,
      enhance_emotion: stability !== 'robust',
      multi_speaker: true
    };
  }

  /**
   * Validate text length for v3 (recommended >250 characters)
   */
  static validateV3TextLength(text: string): { isValid: boolean; length: number; recommendation: string } {
    const length = text.length;
    const isValid = length >= 250;
    
    let recommendation = '';
    if (length < 250) {
      recommendation = 'V3 works best with prompts greater than 250 characters. Consider adding more context or dialogue.';
    } else if (length < 500) {
      recommendation = 'Good length for v3. Consider adding more emotional context or audio tags for better results.';
    } else {
      recommendation = 'Excellent length for v3. This should provide consistent and expressive output.';
    }

    return { isValid, length, recommendation };
  }

  /**
   * Get punctuation guidance for v3
   */
  static getPunctuationGuidance() {
    return {
      ellipses: {
        description: 'Add pauses and weight',
        example: 'It was a VERY long day [sigh] … nobody listens anymore.',
        usage: 'Use for dramatic pauses and trailing thoughts'
      },
      capitalization: {
        description: 'Increases emphasis',
        example: 'It was a VERY long day',
        usage: 'Use for important words and emotional emphasis'
      },
      standardPunctuation: {
        description: 'Provides natural speech rhythm',
        example: 'Hello, how are you today?',
        usage: 'Use for natural conversation flow'
      }
    };
  }

  /**
   * Get tag combination recommendations
   */
  static getTagCombinationRecommendations() {
    return {
      emotional: {
        description: 'Combine emotional tags with non-verbal sounds',
        examples: [
          '[excited] [laughs] That\'s amazing!',
          '[sad] [sighs] I can\'t believe it.',
          '[angry] [exhales sharply] This is ridiculous!'
        ]
      },
      timing: {
        description: 'Use pause tags for natural speech rhythm',
        examples: [
          '[short pause] Well... [long pause] I guess you\'re right.',
          '[exhales] [short pause] Let me think about this.'
        ]
      },
      accent: {
        description: 'Combine accent tags with emotional context',
        examples: [
          '[strong French accent] [excited] Bonjour! Comment allez-vous?',
          '[strong British accent] [sarcastic] Oh, how delightful.'
        ]
      }
    };
  }

  /**
   * Get voice matching recommendations
   */
  static getVoiceMatchingRecommendations() {
    return {
      serious: {
        description: 'Serious, professional voices work best with professional tags',
        recommendedTags: ['[professional]', '[thoughtful]', '[sympathetic]', '[reassuring]'],
        avoidTags: ['[giggles]', '[mischievously]', '[woo]']
      },
      playful: {
        description: 'Playful voices work well with dynamic and fun tags',
        recommendedTags: ['[excited]', '[laughs]', '[giggles]', '[mischievously]'],
        avoidTags: ['[professional]', '[deadpan]']
      },
      emotional: {
        description: 'Emotional voices work well with expressive tags',
        recommendedTags: ['[excited]', '[sad]', '[angry]', '[happy]', '[crying]'],
        avoidTags: ['[deadpan]', '[professional]']
      }
    };
  }
}

// Export default instance
export const v3PromptingGuide = new V3PromptingGuide();
