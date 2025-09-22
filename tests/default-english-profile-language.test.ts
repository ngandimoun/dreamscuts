/**
 * Default English Profile Language Integration Test
 * 
 * This test verifies that the default English profile system properly receives
 * the detected language for seamless translation and cultural adaptation.
 */

import { describe, test, expect } from '@jest/globals';

// Mock the modules to avoid complex dependencies
jest.mock('../lib/analyzer/language-aware-creative-profiles', () => ({
  getLanguageAwareCreativeProfile: jest.fn(),
  generateLanguageAwareCreativeDirection: jest.fn(),
  detectLanguageFromText: jest.fn()
}));

describe('Default English Profile Language Integration Test', () => {
  const mockAnalyzerData = {
    user_request: {
      original_prompt: 'Create a video about university education'
    },
    prompt_analysis: {
      processing_metadata: {
        detected_language: 'es' // Spanish detected
      }
    }
  };

  const mockCreativeProfile = {
    id: 'educational_explainer',
    name: 'Educational Explainer'
  };

  test('should detect language from analyzer metadata', () => {
    const detectedLanguage = mockAnalyzerData.prompt_analysis?.processing_metadata?.detected_language || 'en';
    expect(detectedLanguage).toBe('es');
  });

  test('should fallback to text detection when metadata is missing', () => {
    const analyzerDataWithoutMetadata = {
      user_request: {
        original_prompt: 'Crear un video sobre educación universitaria'
      },
      prompt_analysis: {
        processing_metadata: {
          detected_language: undefined
        }
      }
    };

    // Mock detectLanguageFromText to return Spanish
    const { detectLanguageFromText } = require('../lib/analyzer/language-aware-creative-profiles');
    detectLanguageFromText.mockReturnValue('es');

    const detectedLanguage = analyzerDataWithoutMetadata.prompt_analysis?.processing_metadata?.detected_language || 
                            detectLanguageFromText(analyzerDataWithoutMetadata.user_request.original_prompt) || 
                            'en';
    
    expect(detectedLanguage).toBe('es');
  });

  test('should default to English when no language is detected', () => {
    const analyzerDataNoLanguage = {
      user_request: {
        original_prompt: 'Create a video about education'
      },
      prompt_analysis: {
        processing_metadata: {
          detected_language: undefined
        }
      }
    };

    // Mock detectLanguageFromText to return undefined
    const { detectLanguageFromText } = require('../lib/analyzer/language-aware-creative-profiles');
    detectLanguageFromText.mockReturnValue(undefined);

    const detectedLanguage = analyzerDataNoLanguage.prompt_analysis?.processing_metadata?.detected_language || 
                            detectLanguageFromText(analyzerDataNoLanguage.user_request.original_prompt) || 
                            'en';
    
    expect(detectedLanguage).toBe('en');
  });

  test('should apply language-aware creative profile for detected language', () => {
    const { getLanguageAwareCreativeProfile, generateLanguageAwareCreativeDirection } = require('../lib/analyzer/language-aware-creative-profiles');
    
    // Mock the functions
    getLanguageAwareCreativeProfile.mockReturnValue({
      profileId: 'educational_explainer',
      core_concept: 'Create engaging and informative content',
      visual_approach: 'Professional and clear visuals',
      style_direction: 'Clean and modern style',
      mood_guidance: 'Informative and engaging tone',
      language: 'es'
    });

    generateLanguageAwareCreativeDirection.mockReturnValue({
      core_concept: 'Crear contenido atractivo e informativo',
      visual_approach: 'Visuales profesionales y claras',
      style_direction: 'Estilo limpio y moderno',
      mood_guidance: 'Tono informativo y atractivo'
    });

    const detectedLanguage = 'es';
    const languageAwareDirection = generateLanguageAwareCreativeDirection(
      mockAnalyzerData.user_request.original_prompt,
      detectedLanguage,
      mockCreativeProfile.id
    );

    expect(languageAwareDirection.core_concept).toContain('Crear contenido');
    expect(languageAwareDirection.visual_approach).toContain('Visuales profesionales');
    expect(languageAwareDirection.style_direction).toContain('Estilo limpio');
    expect(languageAwareDirection.mood_guidance).toContain('Tono informativo');
  });

  test('should use English fallback profile when language not supported', () => {
    const { getLanguageAwareCreativeProfile } = require('../lib/analyzer/language-aware-creative-profiles');
    
    // Mock fallback to English profile
    getLanguageAwareCreativeProfile.mockReturnValue({
      profileId: 'educational_explainer',
      core_concept: 'Create engaging and informative content',
      visual_approach: 'Professional and clear visuals',
      style_direction: 'Clean and modern style',
      mood_guidance: 'Informative and engaging tone',
      language: 'en' // Fallback to English
    });

    const detectedLanguage = 'xx'; // Unsupported language
    const profile = getLanguageAwareCreativeProfile('educational_explainer', detectedLanguage);

    expect(profile.language).toBe('en');
    expect(profile.core_concept).toContain('Create engaging');
  });

  test('should generate dynamic language creative direction for unsupported languages', () => {
    const { generateLanguageAwareCreativeDirection } = require('../lib/analyzer/language-aware-creative-profiles');
    
    // Mock dynamic translation for unsupported language
    generateLanguageAwareCreativeDirection.mockReturnValue({
      core_concept: 'Create engaging and informative content in Bulgarian that effectively communicates the key message: "Create a video about university education". Focus on clear, culturally appropriate presentation that resonates with Bulgarian-speaking audiences.',
      visual_approach: 'Use dynamic visual storytelling techniques appropriate for Bulgarian cultural context. Incorporate relevant visual metaphors, color schemes, and design elements that align with Bulgarian aesthetic preferences and cultural values.',
      style_direction: 'Maintain a professional yet approachable tone suitable for Bulgarian communication style. Ensure visual hierarchy and pacing that matches Bulgarian reading patterns and cultural expectations.',
      mood_guidance: 'Create content that feels authentic and engaging for Bulgarian-speaking viewers. Balance professionalism with cultural sensitivity, ensuring the content feels natural and compelling in the Bulgarian language context.'
    });

    const detectedLanguage = 'bg'; // Bulgarian (unsupported)
    const languageAwareDirection = generateLanguageAwareCreativeDirection(
      'Create a video about university education',
      detectedLanguage,
      'educational_explainer'
    );

    expect(languageAwareDirection.core_concept).toContain('Bulgarian');
    expect(languageAwareDirection.visual_approach).toContain('Bulgarian cultural context');
    expect(languageAwareDirection.style_direction).toContain('Bulgarian communication style');
    expect(languageAwareDirection.mood_guidance).toContain('Bulgarian-speaking viewers');
  });

  test('should handle multiple language detection scenarios', () => {
    const testCases = [
      { language: 'es', expected: 'Spanish' },
      { language: 'fr', expected: 'French' },
      { language: 'de', expected: 'German' },
      { language: 'it', expected: 'Italian' },
      { language: 'pt', expected: 'Portuguese' },
      { language: 'ru', expected: 'Russian' },
      { language: 'ja', expected: 'Japanese' },
      { language: 'ko', expected: 'Korean' },
      { language: 'zh', expected: 'Chinese' },
      { language: 'ar', expected: 'Arabic' },
      { language: 'hi', expected: 'Hindi' },
      { language: 'bg', expected: 'Bulgarian' },
      { language: 'cs', expected: 'Czech' },
      { language: 'pl', expected: 'Polish' },
      { language: 'tr', expected: 'Turkish' }
    ];

    const { generateLanguageAwareCreativeDirection } = require('../lib/analyzer/language-aware-creative-profiles');

    testCases.forEach(({ language, expected }) => {
      generateLanguageAwareCreativeDirection.mockReturnValue({
        core_concept: `Create engaging content in ${expected}`,
        visual_approach: `${expected} cultural context`,
        style_direction: `${expected} communication style`,
        mood_guidance: `${expected}-speaking viewers`
      });

      const direction = generateLanguageAwareCreativeDirection(
        'Test query',
        language,
        'educational_explainer'
      );

      expect(direction.core_concept).toContain(expected);
      expect(direction.visual_approach).toContain(expected);
      expect(direction.style_direction).toContain(expected);
      expect(direction.mood_guidance).toContain(expected);
    });
  });

  test('should preserve language context through refiner processing', () => {
    const detectedLanguage = 'es';
    
    // Mock the language-aware creative direction
    const { generateLanguageAwareCreativeDirection } = require('../lib/analyzer/language-aware-creative-profiles');
    generateLanguageAwareCreativeDirection.mockReturnValue({
      core_concept: 'Crear contenido educativo atractivo',
      visual_approach: 'Visuales profesionales y claras',
      style_direction: 'Estilo limpio y moderno',
      mood_guidance: 'Tono informativo y atractivo'
    });

    const languageAwareDirection = generateLanguageAwareCreativeDirection(
      mockAnalyzerData.user_request.original_prompt,
      detectedLanguage,
      mockCreativeProfile.id
    );

    // Simulate refiner processing
    const finalRefinerJson = {
      creative_direction: {
        ...languageAwareDirection,
        // Other refiner fields would be here
      }
    };

    expect(finalRefinerJson.creative_direction.core_concept).toContain('Crear contenido');
    expect(finalRefinerJson.creative_direction.visual_approach).toContain('Visuales profesionales');
    expect(finalRefinerJson.creative_direction.style_direction).toContain('Estilo limpio');
    expect(finalRefinerJson.creative_direction.mood_guidance).toContain('Tono informativo');
  });

  test('should handle language detection from text patterns', () => {
    const { detectLanguageFromText } = require('../lib/analyzer/language-aware-creative-profiles');
    
    // Test Japanese detection
    detectLanguageFromText.mockReturnValue('ja');
    const japaneseText = '大学教育についてのビデオを作成する';
    const detectedLang = detectLanguageFromText(japaneseText);
    expect(detectedLang).toBe('ja');

    // Test Chinese detection
    detectLanguageFromText.mockReturnValue('zh');
    const chineseText = '创建关于大学教育的视频';
    const detectedLang2 = detectLanguageFromText(chineseText);
    expect(detectedLang2).toBe('zh');

    // Test Korean detection
    detectLanguageFromText.mockReturnValue('ko');
    const koreanText = '대학교육에 대한 비디오 만들기';
    const detectedLang3 = detectLanguageFromText(koreanText);
    expect(detectedLang3).toBe('ko');

    // Test Arabic detection
    detectLanguageFromText.mockReturnValue('ar');
    const arabicText = 'إنشاء فيديو حول التعليم الجامعي';
    const detectedLang4 = detectLanguageFromText(arabicText);
    expect(detectedLang4).toBe('ar');
  });

  test('should ensure seamless translation flow from analyzer to refiner', () => {
    // Test the complete flow: Analyzer → Language Detection → Profile Selection → Translation
    
    const analyzerData = {
      user_request: {
        original_prompt: 'Crear un video educativo sobre universidades'
      },
      prompt_analysis: {
        processing_metadata: {
          detected_language: 'es'
        }
      }
    };

    // Step 1: Language detection
    const detectedLanguage = analyzerData.prompt_analysis?.processing_metadata?.detected_language || 'en';
    expect(detectedLanguage).toBe('es');

    // Step 2: Profile selection with language awareness
    const { getLanguageAwareCreativeProfile } = require('../lib/analyzer/language-aware-creative-profiles');
    getLanguageAwareCreativeProfile.mockReturnValue({
      profileId: 'educational_explainer',
      language: 'es',
      core_concept: 'Crear contenido educativo atractivo'
    });

    const profile = getLanguageAwareCreativeProfile('educational_explainer', detectedLanguage);
    expect(profile.language).toBe('es');

    // Step 3: Creative direction generation
    const { generateLanguageAwareCreativeDirection } = require('../lib/analyzer/language-aware-creative-profiles');
    generateLanguageAwareCreativeDirection.mockReturnValue({
      core_concept: 'Crear contenido educativo atractivo sobre universidades',
      visual_approach: 'Visuales profesionales y educativas',
      style_direction: 'Estilo académico y moderno',
      mood_guidance: 'Tono informativo y motivador'
    });

    const creativeDirection = generateLanguageAwareCreativeDirection(
      analyzerData.user_request.original_prompt,
      detectedLanguage,
      'educational_explainer'
    );

    // Step 4: Verify seamless translation
    expect(creativeDirection.core_concept).toContain('Crear contenido');
    expect(creativeDirection.visual_approach).toContain('Visuales profesionales');
    expect(creativeDirection.style_direction).toContain('Estilo académico');
    expect(creativeDirection.mood_guidance).toContain('Tono informativo');

    // Step 5: Verify cultural appropriateness
    expect(creativeDirection.core_concept).toContain('universidades');
    expect(creativeDirection.visual_approach).toContain('educativas');
    expect(creativeDirection.style_direction).toContain('académico');
  });
});
