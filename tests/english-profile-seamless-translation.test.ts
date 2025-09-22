/**
 * English Profile Seamless Translation Integration Test
 * 
 * This test verifies that the default English profile system properly receives
 * the detected language and provides seamless translation for all supported languages.
 */

import { describe, test, expect } from '@jest/globals';

describe('English Profile Seamless Translation Integration Test', () => {
  
  test('should handle Spanish language detection and translation', async () => {
    const { getLanguageAwareCreativeProfile, generateLanguageAwareCreativeDirection } = await import('../lib/analyzer/language-aware-creative-profiles');
    
    // Test Spanish language detection
    const detectedLanguage = 'es';
    const userQuery = 'Crear un video educativo sobre universidades';
    
    // Get language-aware profile
    const profile = getLanguageAwareCreativeProfile('educational_explainer', detectedLanguage);
    
    // Generate creative direction
    const creativeDirection = generateLanguageAwareCreativeDirection(userQuery, detectedLanguage, 'educational_explainer');
    
    // Verify Spanish profile is returned
    expect(profile.language).toBe('es');
    expect(profile.core_concept).toContain('Crear contenido');
    
    // Verify creative direction is in Spanish
    expect(creativeDirection.core_concept).toContain('Crear');
    expect(creativeDirection.visual_approach).toContain('visuales');
    expect(creativeDirection.style_direction).toContain('estilo');
    expect(creativeDirection.mood_guidance).toContain('tono');
  });

  test('should handle French language detection and translation', async () => {
    const { getLanguageAwareCreativeProfile, generateLanguageAwareCreativeDirection } = await import('../lib/analyzer/language-aware-creative-profiles');
    
    // Test French language detection
    const detectedLanguage = 'fr';
    const userQuery = 'Créer une vidéo éducative sur les universités';
    
    // Get language-aware profile
    const profile = getLanguageAwareCreativeProfile('educational_explainer', detectedLanguage);
    
    // Generate creative direction
    const creativeDirection = generateLanguageAwareCreativeDirection(userQuery, detectedLanguage, 'educational_explainer');
    
    // Verify French profile is returned
    expect(profile.language).toBe('fr');
    expect(profile.core_concept).toContain('Créer du contenu');
    
    // Verify creative direction is in French
    expect(creativeDirection.core_concept).toContain('Créer');
    expect(creativeDirection.visual_approach).toContain('visuels');
    expect(creativeDirection.style_direction).toContain('style');
    expect(creativeDirection.mood_guidance).toContain('ton');
  });

  test('should handle German language detection and translation', async () => {
    const { getLanguageAwareCreativeProfile, generateLanguageAwareCreativeDirection } = await import('../lib/analyzer/language-aware-creative-profiles');
    
    // Test German language detection
    const detectedLanguage = 'de';
    const userQuery = 'Erstellen Sie ein Bildungsvideo über Universitäten';
    
    // Get language-aware profile
    const profile = getLanguageAwareCreativeProfile('educational_explainer', detectedLanguage);
    
    // Generate creative direction
    const creativeDirection = generateLanguageAwareCreativeDirection(userQuery, detectedLanguage, 'educational_explainer');
    
    // Verify German profile is returned
    expect(profile.language).toBe('de');
    expect(profile.core_concept).toContain('Erstellen Sie');
    
    // Verify creative direction is in German
    expect(creativeDirection.core_concept).toContain('Erstellen');
    expect(creativeDirection.visual_approach).toContain('visuell');
    expect(creativeDirection.style_direction).toContain('Stil');
    expect(creativeDirection.mood_guidance).toContain('Ton');
  });

  test('should handle Italian language detection and translation', async () => {
    const { getLanguageAwareCreativeProfile, generateLanguageAwareCreativeDirection } = await import('../lib/analyzer/language-aware-creative-profiles');
    
    // Test Italian language detection
    const detectedLanguage = 'it';
    const userQuery = 'Crea un video educativo sulle università';
    
    // Get language-aware profile
    const profile = getLanguageAwareCreativeProfile('educational_explainer', detectedLanguage);
    
    // Generate creative direction
    const creativeDirection = generateLanguageAwareCreativeDirection(userQuery, detectedLanguage, 'educational_explainer');
    
    // Verify Italian profile is returned
    expect(profile.language).toBe('it');
    expect(profile.core_concept).toContain('Crea contenuto');
    
    // Verify creative direction is in Italian
    expect(creativeDirection.core_concept).toContain('Crea');
    expect(creativeDirection.visual_approach).toContain('visivi');
    expect(creativeDirection.style_direction).toContain('stile');
    expect(creativeDirection.mood_guidance).toContain('tono');
  });

  test('should handle Portuguese language detection and translation', async () => {
    const { getLanguageAwareCreativeProfile, generateLanguageAwareCreativeDirection } = await import('../lib/analyzer/language-aware-creative-profiles');
    
    // Test Portuguese language detection
    const detectedLanguage = 'pt';
    const userQuery = 'Criar um vídeo educativo sobre universidades';
    
    // Get language-aware profile
    const profile = getLanguageAwareCreativeProfile('educational_explainer', detectedLanguage);
    
    // Generate creative direction
    const creativeDirection = generateLanguageAwareCreativeDirection(userQuery, detectedLanguage, 'educational_explainer');
    
    // Verify Portuguese profile is returned
    expect(profile.language).toBe('pt');
    expect(profile.core_concept).toContain('Criar conteúdo');
    
    // Verify creative direction is in Portuguese
    expect(creativeDirection.core_concept).toContain('Criar');
    expect(creativeDirection.visual_approach).toContain('visuais');
    expect(creativeDirection.style_direction).toContain('estilo');
    expect(creativeDirection.mood_guidance).toContain('tom');
  });

  test('should handle Japanese language detection and translation', async () => {
    const { getLanguageAwareCreativeProfile, generateLanguageAwareCreativeDirection } = await import('../lib/analyzer/language-aware-creative-profiles');
    
    // Test Japanese language detection
    const detectedLanguage = 'ja';
    const userQuery = '大学教育についてのビデオを作成する';
    
    // Get language-aware profile
    const profile = getLanguageAwareCreativeProfile('educational_explainer', detectedLanguage);
    
    // Generate creative direction
    const creativeDirection = generateLanguageAwareCreativeDirection(userQuery, detectedLanguage, 'educational_explainer');
    
    // Verify Japanese profile is returned
    expect(profile.language).toBe('ja');
    expect(profile.core_concept).toContain('魅力的で');
    
    // Verify creative direction is in Japanese
    expect(creativeDirection.core_concept).toContain('魅力的');
    expect(creativeDirection.visual_approach).toContain('視覚的');
    expect(creativeDirection.style_direction).toContain('スタイル');
    expect(creativeDirection.mood_guidance).toContain('トーン');
  });

  test('should handle Korean language detection and translation', async () => {
    const { getLanguageAwareCreativeProfile, generateLanguageAwareCreativeDirection } = await import('../lib/analyzer/language-aware-creative-profiles');
    
    // Test Korean language detection
    const detectedLanguage = 'ko';
    const userQuery = '대학교육에 대한 비디오 만들기';
    
    // Get language-aware profile
    const profile = getLanguageAwareCreativeProfile('educational_explainer', detectedLanguage);
    
    // Generate creative direction
    const creativeDirection = generateLanguageAwareCreativeDirection(userQuery, detectedLanguage, 'educational_explainer');
    
    // Verify Korean profile is returned
    expect(profile.language).toBe('ko');
    expect(profile.core_concept).toContain('매력적이고');
    
    // Verify creative direction is in Korean
    expect(creativeDirection.core_concept).toContain('매력적');
    expect(creativeDirection.visual_approach).toContain('시각적');
    expect(creativeDirection.style_direction).toContain('스타일');
    expect(creativeDirection.mood_guidance).toContain('톤');
  });

  test('should handle Chinese language detection and translation', async () => {
    const { getLanguageAwareCreativeProfile, generateLanguageAwareCreativeDirection } = await import('../lib/analyzer/language-aware-creative-profiles');
    
    // Test Chinese language detection
    const detectedLanguage = 'zh';
    const userQuery = '创建关于大学教育的视频';
    
    // Get language-aware profile (should fallback to English since Chinese is not in static templates)
    const profile = getLanguageAwareCreativeProfile('educational_explainer', detectedLanguage);
    
    // Generate creative direction (should use dynamic translation)
    const creativeDirection = generateLanguageAwareCreativeDirection(userQuery, detectedLanguage, 'educational_explainer');
    
    // Verify fallback to English profile
    expect(profile.language).toBe('en');
    expect(profile.core_concept).toContain('Create engaging');
    
    // Verify dynamic translation is applied
    expect(creativeDirection.core_concept).toContain('Chinese');
    expect(creativeDirection.visual_approach).toContain('Chinese cultural context');
    expect(creativeDirection.style_direction).toContain('Chinese communication style');
    expect(creativeDirection.mood_guidance).toContain('Chinese-speaking viewers');
  });

  test('should handle Arabic language detection and translation', async () => {
    const { getLanguageAwareCreativeProfile, generateLanguageAwareCreativeDirection } = await import('../lib/analyzer/language-aware-creative-profiles');
    
    // Test Arabic language detection
    const detectedLanguage = 'ar';
    const userQuery = 'إنشاء فيديو تعليمي حول الجامعات';
    
    // Get language-aware profile (should fallback to English since Arabic is not in static templates)
    const profile = getLanguageAwareCreativeProfile('educational_explainer', detectedLanguage);
    
    // Generate creative direction (should use dynamic translation)
    const creativeDirection = generateLanguageAwareCreativeDirection(userQuery, detectedLanguage, 'educational_explainer');
    
    // Verify fallback to English profile
    expect(profile.language).toBe('en');
    expect(profile.core_concept).toContain('Create engaging');
    
    // Verify dynamic translation is applied
    expect(creativeDirection.core_concept).toContain('Arabic');
    expect(creativeDirection.visual_approach).toContain('Arabic cultural context');
    expect(creativeDirection.style_direction).toContain('Arabic communication style');
    expect(creativeDirection.mood_guidance).toContain('Arabic-speaking viewers');
  });

  test('should handle Hindi language detection and translation', async () => {
    const { getLanguageAwareCreativeProfile, generateLanguageAwareCreativeDirection } = await import('../lib/analyzer/language-aware-creative-profiles');
    
    // Test Hindi language detection
    const detectedLanguage = 'hi';
    const userQuery = 'विश्वविद्यालय शिक्षा के बारे में वीडियो बनाएं';
    
    // Get language-aware profile
    const profile = getLanguageAwareCreativeProfile('educational_explainer', detectedLanguage);
    
    // Generate creative direction
    const creativeDirection = generateLanguageAwareCreativeDirection(userQuery, detectedLanguage, 'educational_explainer');
    
    // Verify Hindi profile is returned
    expect(profile.language).toBe('hi');
    expect(profile.core_concept).toContain('आकर्षक और');
    
    // Verify creative direction is in Hindi
    expect(creativeDirection.core_concept).toContain('आकर्षक');
    expect(creativeDirection.visual_approach).toContain('दृश्य');
    expect(creativeDirection.style_direction).toContain('शैली');
    expect(creativeDirection.mood_guidance).toContain('स्वर');
  });

  test('should handle unsupported language with dynamic translation', async () => {
    const { getLanguageAwareCreativeProfile, generateLanguageAwareCreativeDirection } = await import('../lib/analyzer/language-aware-creative-profiles');
    
    // Test unsupported language (Bulgarian)
    const detectedLanguage = 'bg';
    const userQuery = 'Създаване на видео за университетското образование';
    
    // Get language-aware profile (should fallback to English)
    const profile = getLanguageAwareCreativeProfile('educational_explainer', detectedLanguage);
    
    // Generate creative direction (should use dynamic translation)
    const creativeDirection = generateLanguageAwareCreativeDirection(userQuery, detectedLanguage, 'educational_explainer');
    
    // Verify fallback to English profile
    expect(profile.language).toBe('en');
    expect(profile.core_concept).toContain('Create engaging');
    
    // Verify dynamic translation is applied
    expect(creativeDirection.core_concept).toContain('Bulgarian');
    expect(creativeDirection.visual_approach).toContain('Bulgarian cultural context');
    expect(creativeDirection.style_direction).toContain('Bulgarian communication style');
    expect(creativeDirection.mood_guidance).toContain('Bulgarian-speaking viewers');
  });

  test('should handle English as default language', async () => {
    const { getLanguageAwareCreativeProfile, generateLanguageAwareCreativeDirection } = await import('../lib/analyzer/language-aware-creative-profiles');
    
    // Test English language
    const detectedLanguage = 'en';
    const userQuery = 'Create an educational video about universities';
    
    // Get language-aware profile
    const profile = getLanguageAwareCreativeProfile('educational_explainer', detectedLanguage);
    
    // Generate creative direction
    const creativeDirection = generateLanguageAwareCreativeDirection(userQuery, detectedLanguage, 'educational_explainer');
    
    // Verify English profile is returned
    expect(profile.language).toBe('en');
    expect(profile.core_concept).toContain('Create engaging');
    
    // Verify creative direction is in English
    expect(creativeDirection.core_concept).toContain('Create');
    expect(creativeDirection.visual_approach).toContain('Professional');
    expect(creativeDirection.style_direction).toContain('Clean');
    expect(creativeDirection.mood_guidance).toContain('Informative');
  });

  test('should handle UGC testimonial profile in multiple languages', async () => {
    const { getLanguageAwareCreativeProfile, generateLanguageAwareCreativeDirection } = await import('../lib/analyzer/language-aware-creative-profiles');
    
    const languages = ['es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ar', 'hi'];
    
    for (const language of languages) {
      const userQuery = `Testimonial content in ${language}`;
      
      // Get language-aware profile
      const profile = getLanguageAwareCreativeProfile('ugc_testimonial', language);
      
      // Generate creative direction
      const creativeDirection = generateLanguageAwareCreativeDirection(userQuery, language, 'ugc_testimonial');
      
      // Verify profile language matches
      expect(profile.language).toBe(language);
      
      // Verify creative direction is generated
      expect(creativeDirection.core_concept).toBeDefined();
      expect(creativeDirection.visual_approach).toBeDefined();
      expect(creativeDirection.style_direction).toBeDefined();
      expect(creativeDirection.mood_guidance).toBeDefined();
    }
  });

  test('should handle UGC reaction profile in multiple languages', async () => {
    const { getLanguageAwareCreativeProfile, generateLanguageAwareCreativeDirection } = await import('../lib/analyzer/language-aware-creative-profiles');
    
    const languages = ['es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ar', 'hi'];
    
    for (const language of languages) {
      const userQuery = `Reaction content in ${language}`;
      
      // Get language-aware profile
      const profile = getLanguageAwareCreativeProfile('ugc_reaction', language);
      
      // Generate creative direction
      const creativeDirection = generateLanguageAwareCreativeDirection(userQuery, language, 'ugc_reaction');
      
      // Verify profile language matches
      expect(profile.language).toBe(language);
      
      // Verify creative direction is generated
      expect(creativeDirection.core_concept).toBeDefined();
      expect(creativeDirection.visual_approach).toBeDefined();
      expect(creativeDirection.style_direction).toBeDefined();
      expect(creativeDirection.mood_guidance).toBeDefined();
    }
  });

  test('should ensure seamless translation flow from analyzer to production manifest', async () => {
    // Test the complete flow: Analyzer → Language Detection → Profile → Translation → Production Manifest
    
    const mockAnalyzerData = {
      user_request: {
        original_prompt: 'Crear un video educativo sobre universidades'
      },
      prompt_analysis: {
        processing_metadata: {
          detected_language: 'es'
        }
      }
    };

    // Step 1: Language detection from analyzer
    const detectedLanguage = mockAnalyzerData.prompt_analysis?.processing_metadata?.detected_language || 'en';
    expect(detectedLanguage).toBe('es');

    // Step 2: Get language-aware profile
    const { getLanguageAwareCreativeProfile } = await import('../lib/analyzer/language-aware-creative-profiles');
    const profile = getLanguageAwareCreativeProfile('educational_explainer', detectedLanguage);
    expect(profile.language).toBe('es');

    // Step 3: Generate creative direction
    const { generateLanguageAwareCreativeDirection } = await import('../lib/analyzer/language-aware-creative-profiles');
    const creativeDirection = generateLanguageAwareCreativeDirection(
      mockAnalyzerData.user_request.original_prompt,
      detectedLanguage,
      'educational_explainer'
    );

    // Step 4: Verify seamless translation
    expect(creativeDirection.core_concept).toContain('Crear');
    expect(creativeDirection.visual_approach).toContain('visuales');
    expect(creativeDirection.style_direction).toContain('estilo');
    expect(creativeDirection.mood_guidance).toContain('tono');

    // Step 5: Simulate production manifest integration
    const mockProductionManifest = {
      metadata: {
        language: detectedLanguage,
        profileId: 'educational_explainer',
        profileContext: {
          profileId: 'educational_explainer',
          language: detectedLanguage,
          coreConcept: creativeDirection.core_concept,
          visualApproach: creativeDirection.visual_approach,
          styleDirection: creativeDirection.style_direction,
          moodGuidance: creativeDirection.mood_guidance
        }
      }
    };

    // Verify production manifest has language information
    expect(mockProductionManifest.metadata.language).toBe('es');
    expect(mockProductionManifest.metadata.profileContext.language).toBe('es');
    expect(mockProductionManifest.metadata.profileContext.coreConcept).toContain('Crear');
  });
});
