/**
 * ElevenLabs Multilingual Examples
 * 
 * This file demonstrates how to use the same voice to speak different languages
 * with proper language_code parameter for accurate pronunciation
 */

import { elevenLabs, languageManager, v3VoiceLibrary } from '@/lib/elevenlabs';
import type { LanguageCode } from '@/lib/elevenlabs';

// Example 1: Same voice speaking different languages
export async function sameVoiceDifferentLanguages() {
  try {
    const james = v3VoiceLibrary.getVoiceById("JBFqnCBsd6RMkjVDRZzb"); // James - Husky & Engaging
    if (!james) {
      throw new Error("James voice not found");
    }

    console.log(`Using ${james.name} to speak multiple languages`);

    // English
    const englishResult = await elevenLabs.dialogue(
      "[excited] Hello! Welcome to our multilingual demonstration! [happy] This is James speaking in English.",
      {
        voiceId: james.voice_id,
        languageCode: 'en',
        dialogueSettings: {
          stability: james.stability_recommendation,
          use_audio_tags: true,
          enhance_emotion: true
        },
        voiceSettings: james.settings
      }
    );
    console.log("Playing English version...");
    await elevenLabs.playAudio(englishResult.audio);

    // Spanish
    const spanishResult = await elevenLabs.dialogue(
      "[excited] ¡Hola! Bienvenidos a nuestra demostración multilingüe! [happy] Este es James hablando en español.",
      {
        voiceId: james.voice_id,
        languageCode: 'es',
        dialogueSettings: {
          stability: james.stability_recommendation,
          use_audio_tags: true,
          enhance_emotion: true
        },
        voiceSettings: james.settings
      }
    );
    console.log("Playing Spanish version...");
    await elevenLabs.playAudio(spanishResult.audio);

    // French
    const frenchResult = await elevenLabs.dialogue(
      "[excited] Bonjour! Bienvenue à notre démonstration multilingue! [happy] C'est James qui parle en français.",
      {
        voiceId: james.voice_id,
        languageCode: 'fr',
        dialogueSettings: {
          stability: james.stability_recommendation,
          use_audio_tags: true,
          enhance_emotion: true
        },
        voiceSettings: james.settings
      }
    );
    console.log("Playing French version...");
    await elevenLabs.playAudio(frenchResult.audio);

    // German
    const germanResult = await elevenLabs.dialogue(
      "[excited] Hallo! Willkommen zu unserer mehrsprachigen Demonstration! [happy] Das ist James, der auf Deutsch spricht.",
      {
        voiceId: james.voice_id,
        languageCode: 'de',
        dialogueSettings: {
          stability: james.stability_recommendation,
          use_audio_tags: true,
          enhance_emotion: true
        },
        voiceSettings: james.settings
      }
    );
    console.log("Playing German version...");
    await elevenLabs.playAudio(germanResult.audio);

    return {
      english: englishResult,
      spanish: spanishResult,
      french: frenchResult,
      german: germanResult
    };
  } catch (error) {
    console.error("Same voice different languages example failed:", error);
    throw error;
  }
}

// Example 2: Language detection and automatic selection
export async function languageDetectionExample() {
  try {
    const eve = v3VoiceLibrary.searchVoices("Eve")[0];
    if (!eve) {
      throw new Error("Eve voice not found");
    }

    const texts = [
      "Hello, how are you today?", // English
      "Hola, ¿cómo estás hoy?", // Spanish
      "Bonjour, comment allez-vous aujourd'hui?", // French
      "Hallo, wie geht es dir heute?", // German
      "Ciao, come stai oggi?", // Italian
      "Olá, como você está hoje?", // Portuguese
    ];

    const results = [];

    for (const text of texts) {
      // Detect language from text
      const detectedLanguage = languageManager.detectLanguageFromText(text);
      const languageInfo = languageManager.getLanguageByCode(detectedLanguage);
      
      console.log(`Text: "${text}"`);
      console.log(`Detected language: ${detectedLanguage} (${languageInfo?.name})`);

      const result = await elevenLabs.dialogue(
        `[happy] ${text} [excited] I'm speaking in ${languageInfo?.name}!`,
        {
          voiceId: eve.voice_id,
          languageCode: detectedLanguage,
          dialogueSettings: {
            stability: eve.stability_recommendation,
            use_audio_tags: true,
            enhance_emotion: true
          },
          voiceSettings: eve.settings
        }
      );

      results.push({
        text,
        detectedLanguage,
        languageInfo,
        result
      });

      await elevenLabs.playAudio(result.audio);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Pause between languages
    }

    return results;
  } catch (error) {
    console.error("Language detection example failed:", error);
    throw error;
  }
}

// Example 3: Multi-speaker dialogue in different languages
export async function multilingualMultiSpeakerExample() {
  try {
    const james = v3VoiceLibrary.getVoiceById("JBFqnCBsd6RMkjVDRZzb"); // James
    const eve = v3VoiceLibrary.searchVoices("Eve")[0]; // Eve

    if (!james || !eve) {
      throw new Error("Required voices not found");
    }

    console.log("Creating multilingual multi-speaker dialogue...");

    // English conversation
    const englishSpeakers = [
      {
        name: "James",
        voice_id: james.voice_id,
        lines: ["[excited] Hello Eve! How are you today?", "[happy] I'm doing great, thanks for asking!"]
      },
      {
        name: "Eve",
        voice_id: eve.voice_id,
        lines: ["[happy] Hi James! I'm wonderful, thank you!", "[excited] Let's practice some languages together!"]
      }
    ];

    const englishResults = await elevenLabs.multiSpeakerDialogue(englishSpeakers, {
      dialogueSettings: {
        stability: 'natural',
        use_audio_tags: true,
        multi_speaker: true
      }
    });

    console.log("Playing English conversation...");
    for (const result of englishResults) {
      console.log(`${result.speaker}: ${result.text}`);
      await elevenLabs.playAudio(result.audio);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Spanish conversation
    const spanishSpeakers = [
      {
        name: "James",
        voice_id: james.voice_id,
        lines: ["[excited] ¡Hola Eve! ¿Cómo estás hoy?", "[happy] ¡Estoy muy bien, gracias por preguntar!"]
      },
      {
        name: "Eve",
        voice_id: eve.voice_id,
        lines: ["[happy] ¡Hola James! ¡Estoy maravillosa, gracias!", "[excited] ¡Vamos a practicar algunos idiomas juntos!"]
      }
    ];

    const spanishResults = await elevenLabs.multiSpeakerDialogue(spanishSpeakers, {
      dialogueSettings: {
        stability: 'natural',
        use_audio_tags: true,
        multi_speaker: true
      }
    });

    console.log("Playing Spanish conversation...");
    for (const result of spanishResults) {
      console.log(`${result.speaker}: ${result.text}`);
      await elevenLabs.playAudio(result.audio);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return {
      english: englishResults,
      spanish: spanishResults
    };
  } catch (error) {
    console.error("Multilingual multi-speaker example failed:", error);
    throw error;
  }
}

// Example 4: Language-specific content with proper pronunciation
export async function languageSpecificContentExample() {
  try {
    const hope = v3VoiceLibrary.searchVoices("Hope")[0];
    if (!hope) {
      throw new Error("Hope voice not found");
    }

    const languageContent = [
      {
        language: 'en' as LanguageCode,
        text: "[excited] Welcome to our amazing product! [happy] It's going to revolutionize your workflow!",
        description: "English marketing content"
      },
      {
        language: 'es' as LanguageCode,
        text: "[excited] ¡Bienvenidos a nuestro increíble producto! [happy] ¡Va a revolucionar tu flujo de trabajo!",
        description: "Spanish marketing content"
      },
      {
        language: 'fr' as LanguageCode,
        text: "[excited] Bienvenue à notre produit incroyable! [happy] Il va révolutionner votre flux de travail!",
        description: "French marketing content"
      },
      {
        language: 'de' as LanguageCode,
        text: "[excited] Willkommen zu unserem erstaunlichen Produkt! [happy] Es wird Ihren Arbeitsablauf revolutionieren!",
        description: "German marketing content"
      },
      {
        language: 'it' as LanguageCode,
        text: "[excited] Benvenuti al nostro prodotto incredibile! [happy] Rivoluzionerà il vostro flusso di lavoro!",
        description: "Italian marketing content"
      },
      {
        language: 'pt' as LanguageCode,
        text: "[excited] Bem-vindos ao nosso produto incrível! [happy] Vai revolucionar o seu fluxo de trabalho!",
        description: "Portuguese marketing content"
      }
    ];

    const results = [];

    for (const content of languageContent) {
      const languageInfo = languageManager.getLanguageByCode(content.language);
      console.log(`\n--- ${content.description} ---`);
      console.log(`Language: ${languageInfo?.name} (${languageInfo?.nativeName})`);
      console.log(`Text: ${content.text}`);

      const result = await elevenLabs.dialogue(content.text, {
        voiceId: hope.voice_id,
        languageCode: content.language,
        dialogueSettings: {
          stability: hope.stability_recommendation,
          use_audio_tags: true,
          enhance_emotion: true
        },
        voiceSettings: hope.settings
      });

      results.push({
        ...content,
        languageInfo,
        result
      });

      await elevenLabs.playAudio(result.audio);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Pause between languages
    }

    return results;
  } catch (error) {
    console.error("Language-specific content example failed:", error);
    throw error;
  }
}

// Example 5: Language exploration and statistics
export async function languageExplorationExample() {
  try {
    console.log("=== Language Exploration ===\n");

    // Get all supported languages
    const allLanguages = languageManager.getAllLanguages();
    console.log(`Total supported languages: ${allLanguages.length}\n`);

    // Get languages by model
    const v3Languages = languageManager.getLanguagesByModel('eleven_v3');
    const multilingualLanguages = languageManager.getLanguagesByModel('eleven_multilingual_v2');
    const turboLanguages = languageManager.getLanguagesByModel('eleven_turbo_v2_5');
    
    console.log(`Eleven v3 supported languages: ${v3Languages.length}`);
    console.log(`Multilingual v2 supported languages: ${multilingualLanguages.length}`);
    console.log(`Turbo v2.5 supported languages: ${turboLanguages.length}\n`);

    // Get languages by category
    const majorLanguages = languageManager.getMajorLanguages();
    const europeanLanguages = languageManager.getEuropeanLanguages();
    const asianLanguages = languageManager.getAsianLanguages();
    const africanLanguages = languageManager.getAfricanLanguages();
    const americanLanguages = languageManager.getAmericanLanguages();

    console.log("Language categories:");
    console.log(`- Major languages: ${majorLanguages.length}`);
    console.log(`- European languages: ${europeanLanguages.length}`);
    console.log(`- Asian languages: ${asianLanguages.length}`);
    console.log(`- African languages: ${africanLanguages.length}`);
    console.log(`- American languages: ${americanLanguages.length}\n`);

    // Show sample languages from each category
    console.log("Sample major languages:");
    majorLanguages.slice(0, 10).forEach(lang => {
      console.log(`  ${lang.flag} ${lang.name} (${lang.nativeName}) - ${lang.region}`);
    });

    console.log("\nSample European languages:");
    europeanLanguages.slice(0, 5).forEach(lang => {
      console.log(`  ${lang.flag} ${lang.name} (${lang.nativeName}) - ${lang.region}`);
    });

    console.log("\nSample Asian languages:");
    asianLanguages.slice(0, 5).forEach(lang => {
      console.log(`  ${lang.flag} ${lang.name} (${lang.nativeName}) - ${lang.region}`);
    });

    // Test language detection
    console.log("\n=== Language Detection Tests ===");
    const testTexts = [
      "Hello, how are you?",
      "Hola, ¿cómo estás?",
      "Bonjour, comment allez-vous?",
      "Hallo, wie geht es dir?",
      "Ciao, come stai?",
      "Olá, como você está?",
      "Привет, как дела?",
      "你好，你好吗？",
      "こんにちは、元気ですか？",
      "안녕하세요, 어떻게 지내세요?"
    ];

    for (const text of testTexts) {
      const detected = languageManager.detectLanguageFromText(text);
      const languageInfo = languageManager.getLanguageByCode(detected);
      console.log(`"${text}" → ${detected} (${languageInfo?.name})`);
    }

    return {
      totalLanguages: allLanguages.length,
      byModel: {
        eleven_v3: v3Languages.length,
        eleven_multilingual_v2: multilingualLanguages.length,
        eleven_turbo_v2_5: turboLanguages.length
      },
      byCategory: {
        major: majorLanguages.length,
        european: europeanLanguages.length,
        asian: asianLanguages.length,
        african: africanLanguages.length,
        american: americanLanguages.length
      },
      sampleLanguages: {
        major: majorLanguages.slice(0, 10),
        european: europeanLanguages.slice(0, 5),
        asian: asianLanguages.slice(0, 5)
      }
    };
  } catch (error) {
    console.error("Language exploration example failed:", error);
    throw error;
  }
}

// Example 6: Voice-language compatibility testing
export async function voiceLanguageCompatibilityExample() {
  try {
    console.log("=== Voice-Language Compatibility Testing ===\n");

    const testVoices = [
      v3VoiceLibrary.getVoiceById("JBFqnCBsd6RMkjVDRZzb"), // James
      v3VoiceLibrary.searchVoices("Eve")[0], // Eve
      v3VoiceLibrary.searchVoices("Hope")[0], // Hope
    ].filter(Boolean);

    const testLanguages: LanguageCode[] = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko'];

    const results = [];

    for (const voice of testVoices) {
      if (!voice) continue;

      console.log(`\nTesting ${voice.name} with multiple languages:`);
      console.log(`Voice characteristics: ${voice.personality.join(', ')}`);
      console.log(`Emotional range: ${voice.emotional_range}`);
      console.log(`Audio tag compatibility: ${voice.audio_tag_compatibility}\n`);

      const voiceResults = [];

      for (const langCode of testLanguages) {
        const languageInfo = languageManager.getLanguageByCode(langCode);
        if (!languageInfo) continue;

        // Create language-specific greeting
        const greetings = {
          en: "[excited] Hello! I'm speaking English!",
          es: "[excited] ¡Hola! ¡Estoy hablando español!",
          fr: "[excited] Bonjour! Je parle français!",
          de: "[excited] Hallo! Ich spreche Deutsch!",
          it: "[excited] Ciao! Parlo italiano!",
          pt: "[excited] Olá! Estou falando português!",
          ru: "[excited] Привет! Я говорю по-русски!",
          zh: "[excited] 你好！我在说中文！",
          ja: "[excited] こんにちは！日本語で話しています！",
          ko: "[excited] 안녕하세요! 한국어로 말하고 있습니다!"
        };

        const greeting = greetings[langCode] || `[excited] Hello in ${languageInfo.name}!`;

        try {
          const result = await elevenLabs.dialogue(greeting, {
            voiceId: voice.voice_id,
            languageCode: langCode,
            dialogueSettings: {
              stability: voice.stability_recommendation,
              use_audio_tags: true,
              enhance_emotion: true
            },
            voiceSettings: voice.settings
          });

          voiceResults.push({
            language: langCode,
            languageInfo,
            greeting,
            result,
            success: true
          });

          console.log(`  ✓ ${languageInfo.flag} ${languageInfo.name}: Success`);
        } catch (error) {
          voiceResults.push({
            language: langCode,
            languageInfo,
            greeting,
            error: error instanceof Error ? error.message : 'Unknown error',
            success: false
          });

          console.log(`  ✗ ${languageInfo.flag} ${languageInfo.name}: Failed`);
        }
      }

      results.push({
        voice,
        results: voiceResults,
        successCount: voiceResults.filter(r => r.success).length,
        totalCount: voiceResults.length
      });
    }

    // Summary
    console.log("\n=== Compatibility Summary ===");
    results.forEach(({ voice, successCount, totalCount }) => {
      const successRate = ((successCount / totalCount) * 100).toFixed(1);
      console.log(`${voice?.name}: ${successCount}/${totalCount} languages (${successRate}% success rate)`);
    });

    return results;
  } catch (error) {
    console.error("Voice-language compatibility example failed:", error);
    throw error;
  }
}

// Export all examples
export const multilingualExamples = {
  sameVoiceDifferentLanguages,
  languageDetectionExample,
  multilingualMultiSpeakerExample,
  languageSpecificContentExample,
  languageExplorationExample,
  voiceLanguageCompatibilityExample
};
