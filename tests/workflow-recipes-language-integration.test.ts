/**
 * Workflow Recipes Language Integration Test
 * 
 * Tests that workflow recipes properly integrate with language detection
 * and provide seamless translation for all workflow steps.
 */

import { 
  loadLanguageAwareWorkflowRecipes,
  getLanguageAwareWorkflowRecipe,
  generateDynamicLanguageWorkflowRecipe,
  processLanguageAwareWorkflowRecipe
} from '../lib/production-planner/language-aware-workflow-recipes';

// Mock the workflow recipes loader
jest.mock('../services/phase4/workflow-recipes', () => ({
  loadWorkflowRecipes: jest.fn(() => Promise.resolve({
    recipes: {
      ugc_testimonial_recipe: {
        recipeId: 'ugc_testimonial_recipe',
        recipeName: 'UGC Testimonial Workflow',
        description: 'Authentic user-generated testimonial content with handheld feel',
        profileId: 'ugc_testimonial',
        enforcementMode: 'balanced',
        workflow: {
          steps: [
            {
              step: 1,
              name: 'Image Enhancement',
              description: 'Enhance user uploaded product images with UGC style',
              jobType: 'enhance_image_falai',
              model: 'nano_banana',
              promptEnhancement: {
                basePrompt: 'UGC style product photo, handheld camera, authentic lighting, casual setting',
                styleTags: ['handheld', 'authentic', 'casual', 'personal'],
                qualityTags: ['high quality', 'natural lighting', 'realistic'],
                forbiddenTags: ['professional', 'studio', 'commercial', 'polished']
              },
              constraints: {
                maxEnhancementIntensity: 0.4,
                requiredStyle: 'handheld',
                forbiddenEffects: ['cinematic_zoom', 'bokeh_transition']
              }
            },
            {
              step: 2,
              name: 'Voice Generation',
              description: 'Generate authentic testimonial voice with casual tone',
              jobType: 'tts_elevenlabs',
              model: 'elevenlabs_dialogue',
              promptEnhancement: {
                basePrompt: 'Casual, authentic testimonial voice',
                voiceStyle: 'conversational',
                emotionTags: ['authentic', 'personal', 'trustworthy'],
                v3AudioTags: ['[casual]', '[authentic]', '[personal]']
              },
              constraints: {
                maxEmotionIntensity: 0.4,
                requiredTone: 'casual',
                forbiddenStyles: ['dramatic', 'commercial', 'formal']
              }
            }
          ]
        },
        expectedOutput: {
          duration: '15-30 seconds',
          style: 'handheld, authentic, casual',
          quality: 'high but not overly polished',
          cost: '$2-4'
        }
      }
    }
  }))
}));

describe('Workflow Recipes Language Integration', () => {
  describe('Static Language Templates', () => {
    test('should translate UGC testimonial recipe to Spanish', async () => {
      const originalRecipe = {
        recipeId: 'ugc_testimonial_recipe',
        recipeName: 'UGC Testimonial Workflow',
        description: 'Authentic user-generated testimonial content with handheld feel',
        profileId: 'ugc_testimonial',
        enforcementMode: 'balanced',
        workflow: {
          steps: [
            {
              step: 1,
              name: 'Image Enhancement',
              description: 'Enhance user uploaded product images with UGC style',
              jobType: 'enhance_image_falai',
              model: 'nano_banana',
              promptEnhancement: {
                basePrompt: 'UGC style product photo, handheld camera, authentic lighting, casual setting',
                styleTags: ['handheld', 'authentic', 'casual', 'personal'],
                qualityTags: ['high quality', 'natural lighting', 'realistic'],
                forbiddenTags: ['professional', 'studio', 'commercial', 'polished']
              },
              constraints: {
                maxEnhancementIntensity: 0.4,
                requiredStyle: 'handheld',
                forbiddenEffects: ['cinematic_zoom', 'bokeh_transition']
              }
            }
          ]
        }
      };

      const translatedRecipe = getLanguageAwareWorkflowRecipe('ugc_testimonial_recipe', 'es', originalRecipe);

      expect(translatedRecipe.language).toBe('es');
      expect(translatedRecipe.workflow.steps[0].name).toBe('Mejora de Imagen');
      expect(translatedRecipe.workflow.steps[0].description).toBe('Mejorar imágenes de productos subidas por el usuario con estilo UGC');
      expect(translatedRecipe.workflow.steps[0].promptEnhancement.basePrompt).toBe('Foto de producto estilo UGC, cámara en mano, iluminación auténtica, ambiente casual');
      expect(translatedRecipe.workflow.steps[0].promptEnhancement.styleTags).toEqual(['cámara en mano', 'auténtico', 'casual', 'personal']);
    });

    test('should translate UGC testimonial recipe to French', async () => {
      const originalRecipe = {
        recipeId: 'ugc_testimonial_recipe',
        recipeName: 'UGC Testimonial Workflow',
        description: 'Authentic user-generated testimonial content with handheld feel',
        profileId: 'ugc_testimonial',
        enforcementMode: 'balanced',
        workflow: {
          steps: [
            {
              step: 1,
              name: 'Image Enhancement',
              description: 'Enhance user uploaded product images with UGC style',
              jobType: 'enhance_image_falai',
              model: 'nano_banana',
              promptEnhancement: {
                basePrompt: 'UGC style product photo, handheld camera, authentic lighting, casual setting',
                styleTags: ['handheld', 'authentic', 'casual', 'personal'],
                qualityTags: ['high quality', 'natural lighting', 'realistic'],
                forbiddenTags: ['professional', 'studio', 'commercial', 'polished']
              },
              constraints: {
                maxEnhancementIntensity: 0.4,
                requiredStyle: 'handheld',
                forbiddenEffects: ['cinematic_zoom', 'bokeh_transition']
              }
            }
          ]
        }
      };

      const translatedRecipe = getLanguageAwareWorkflowRecipe('ugc_testimonial_recipe', 'fr', originalRecipe);

      expect(translatedRecipe.language).toBe('fr');
      expect(translatedRecipe.workflow.steps[0].name).toBe('Amélioration d\'Image');
      expect(translatedRecipe.workflow.steps[0].description).toBe('Améliorer les images de produits téléchargées par l\'utilisateur avec un style UGC');
      expect(translatedRecipe.workflow.steps[0].promptEnhancement.basePrompt).toBe('Photo de produit style UGC, caméra à la main, éclairage authentique, ambiance décontractée');
      expect(translatedRecipe.workflow.steps[0].promptEnhancement.styleTags).toEqual(['caméra à la main', 'authentique', 'décontracté', 'personnel']);
    });

    test('should translate UGC testimonial recipe to German', async () => {
      const originalRecipe = {
        recipeId: 'ugc_testimonial_recipe',
        recipeName: 'UGC Testimonial Workflow',
        description: 'Authentic user-generated testimonial content with handheld feel',
        profileId: 'ugc_testimonial',
        enforcementMode: 'balanced',
        workflow: {
          steps: [
            {
              step: 1,
              name: 'Image Enhancement',
              description: 'Enhance user uploaded product images with UGC style',
              jobType: 'enhance_image_falai',
              model: 'nano_banana',
              promptEnhancement: {
                basePrompt: 'UGC style product photo, handheld camera, authentic lighting, casual setting',
                styleTags: ['handheld', 'authentic', 'casual', 'personal'],
                qualityTags: ['high quality', 'natural lighting', 'realistic'],
                forbiddenTags: ['professional', 'studio', 'commercial', 'polished']
              },
              constraints: {
                maxEnhancementIntensity: 0.4,
                requiredStyle: 'handheld',
                forbiddenEffects: ['cinematic_zoom', 'bokeh_transition']
              }
            }
          ]
        }
      };

      const translatedRecipe = getLanguageAwareWorkflowRecipe('ugc_testimonial_recipe', 'de', originalRecipe);

      expect(translatedRecipe.language).toBe('de');
      expect(translatedRecipe.workflow.steps[0].name).toBe('Bildverbesserung');
      expect(translatedRecipe.workflow.steps[0].description).toBe('Verbesserung von Benutzer-uploaded Produktbildern mit UGC-Stil');
      expect(translatedRecipe.workflow.steps[0].promptEnhancement.basePrompt).toBe('UGC-Stil Produktfoto, Handkamera, authentische Beleuchtung, lockere Umgebung');
      expect(translatedRecipe.workflow.steps[0].promptEnhancement.styleTags).toEqual(['Handkamera', 'authentisch', 'locker', 'persönlich']);
    });
  });

  describe('Dynamic Translation Fallback', () => {
    test('should generate dynamic translation for Chinese', async () => {
      const originalRecipe = {
        recipeId: 'ugc_testimonial_recipe',
        recipeName: 'UGC Testimonial Workflow',
        description: 'Authentic user-generated testimonial content with handheld feel',
        profileId: 'ugc_testimonial',
        enforcementMode: 'balanced',
        workflow: {
          steps: [
            {
              step: 1,
              name: 'Image Enhancement',
              description: 'Enhance user uploaded product images with UGC style',
              jobType: 'enhance_image_falai',
              model: 'nano_banana',
              promptEnhancement: {
                basePrompt: 'UGC style product photo, handheld camera, authentic lighting, casual setting',
                styleTags: ['handheld', 'authentic', 'casual', 'personal'],
                qualityTags: ['high quality', 'natural lighting', 'realistic'],
                forbiddenTags: ['professional', 'studio', 'commercial', 'polished']
              },
              constraints: {
                maxEnhancementIntensity: 0.4,
                requiredStyle: 'handheld',
                forbiddenEffects: ['cinematic_zoom', 'bokeh_transition']
              }
            }
          ]
        }
      };

      const translatedRecipe = generateDynamicLanguageWorkflowRecipe('ugc_testimonial_recipe', 'zh', originalRecipe);

      expect(translatedRecipe.language).toBe('zh');
      expect(translatedRecipe.workflow.steps[0].promptEnhancement.basePrompt).toContain('Chinese context');
      expect(translatedRecipe.workflow.steps[0].promptEnhancement.basePrompt).toContain('culturally appropriate for Chinese-speaking audiences');
    });

    test('should generate dynamic translation for Arabic', async () => {
      const originalRecipe = {
        recipeId: 'ugc_testimonial_recipe',
        recipeName: 'UGC Testimonial Workflow',
        description: 'Authentic user-generated testimonial content with handheld feel',
        profileId: 'ugc_testimonial',
        enforcementMode: 'balanced',
        workflow: {
          steps: [
            {
              step: 1,
              name: 'Image Enhancement',
              description: 'Enhance user uploaded product images with UGC style',
              jobType: 'enhance_image_falai',
              model: 'nano_banana',
              promptEnhancement: {
                basePrompt: 'UGC style product photo, handheld camera, authentic lighting, casual setting',
                styleTags: ['handheld', 'authentic', 'casual', 'personal'],
                qualityTags: ['high quality', 'natural lighting', 'realistic'],
                forbiddenTags: ['professional', 'studio', 'commercial', 'polished']
              },
              constraints: {
                maxEnhancementIntensity: 0.4,
                requiredStyle: 'handheld',
                forbiddenEffects: ['cinematic_zoom', 'bokeh_transition']
              }
            }
          ]
        }
      };

      const translatedRecipe = generateDynamicLanguageWorkflowRecipe('ugc_testimonial_recipe', 'ar', originalRecipe);

      expect(translatedRecipe.language).toBe('ar');
      expect(translatedRecipe.workflow.steps[0].promptEnhancement.basePrompt).toContain('Arabic context');
      expect(translatedRecipe.workflow.steps[0].promptEnhancement.basePrompt).toContain('culturally appropriate for Arabic-speaking audiences');
    });

    test('should generate dynamic translation for Hindi', async () => {
      const originalRecipe = {
        recipeId: 'ugc_testimonial_recipe',
        recipeName: 'UGC Testimonial Workflow',
        description: 'Authentic user-generated testimonial content with handheld feel',
        profileId: 'ugc_testimonial',
        enforcementMode: 'balanced',
        workflow: {
          steps: [
            {
              step: 1,
              name: 'Image Enhancement',
              description: 'Enhance user uploaded product images with UGC style',
              jobType: 'enhance_image_falai',
              model: 'nano_banana',
              promptEnhancement: {
                basePrompt: 'UGC style product photo, handheld camera, authentic lighting, casual setting',
                styleTags: ['handheld', 'authentic', 'casual', 'personal'],
                qualityTags: ['high quality', 'natural lighting', 'realistic'],
                forbiddenTags: ['professional', 'studio', 'commercial', 'polished']
              },
              constraints: {
                maxEnhancementIntensity: 0.4,
                requiredStyle: 'handheld',
                forbiddenEffects: ['cinematic_zoom', 'bokeh_transition']
              }
            }
          ]
        }
      };

      const translatedRecipe = generateDynamicLanguageWorkflowRecipe('ugc_testimonial_recipe', 'hi', originalRecipe);

      expect(translatedRecipe.language).toBe('hi');
      expect(translatedRecipe.workflow.steps[0].promptEnhancement.basePrompt).toContain('Hindi context');
      expect(translatedRecipe.workflow.steps[0].promptEnhancement.basePrompt).toContain('culturally appropriate for Hindi-speaking audiences');
    });
  });

  describe('Process Language Aware Workflow Recipe', () => {
    test('should use static translation for supported languages', async () => {
      const originalRecipe = {
        recipeId: 'ugc_testimonial_recipe',
        recipeName: 'UGC Testimonial Workflow',
        description: 'Authentic user-generated testimonial content with handheld feel',
        profileId: 'ugc_testimonial',
        enforcementMode: 'balanced',
        workflow: {
          steps: [
            {
              step: 1,
              name: 'Image Enhancement',
              description: 'Enhance user uploaded product images with UGC style',
              jobType: 'enhance_image_falai',
              model: 'nano_banana',
              promptEnhancement: {
                basePrompt: 'UGC style product photo, handheld camera, authentic lighting, casual setting',
                styleTags: ['handheld', 'authentic', 'casual', 'personal'],
                qualityTags: ['high quality', 'natural lighting', 'realistic'],
                forbiddenTags: ['professional', 'studio', 'commercial', 'polished']
              },
              constraints: {
                maxEnhancementIntensity: 0.4,
                requiredStyle: 'handheld',
                forbiddenEffects: ['cinematic_zoom', 'bokeh_transition']
              }
            }
          ]
        }
      };

      const processedRecipe = processLanguageAwareWorkflowRecipe('ugc_testimonial_recipe', 'es', originalRecipe);

      expect(processedRecipe.language).toBe('es');
      expect(processedRecipe.workflow.steps[0].name).toBe('Mejora de Imagen');
    });

    test('should use dynamic translation for unsupported languages', async () => {
      const originalRecipe = {
        recipeId: 'ugc_testimonial_recipe',
        recipeName: 'UGC Testimonial Workflow',
        description: 'Authentic user-generated testimonial content with handheld feel',
        profileId: 'ugc_testimonial',
        enforcementMode: 'balanced',
        workflow: {
          steps: [
            {
              step: 1,
              name: 'Image Enhancement',
              description: 'Enhance user uploaded product images with UGC style',
              jobType: 'enhance_image_falai',
              model: 'nano_banana',
              promptEnhancement: {
                basePrompt: 'UGC style product photo, handheld camera, authentic lighting, casual setting',
                styleTags: ['handheld', 'authentic', 'casual', 'personal'],
                qualityTags: ['high quality', 'natural lighting', 'realistic'],
                forbiddenTags: ['professional', 'studio', 'commercial', 'polished']
              },
              constraints: {
                maxEnhancementIntensity: 0.4,
                requiredStyle: 'handheld',
                forbiddenEffects: ['cinematic_zoom', 'bokeh_transition']
              }
            }
          ]
        }
      };

      const processedRecipe = processLanguageAwareWorkflowRecipe('ugc_testimonial_recipe', 'zh', originalRecipe);

      expect(processedRecipe.language).toBe('zh');
      expect(processedRecipe.workflow.steps[0].promptEnhancement.basePrompt).toContain('Chinese context');
    });

    test('should return English for English language', async () => {
      const originalRecipe = {
        recipeId: 'ugc_testimonial_recipe',
        recipeName: 'UGC Testimonial Workflow',
        description: 'Authentic user-generated testimonial content with handheld feel',
        profileId: 'ugc_testimonial',
        enforcementMode: 'balanced',
        workflow: {
          steps: [
            {
              step: 1,
              name: 'Image Enhancement',
              description: 'Enhance user uploaded product images with UGC style',
              jobType: 'enhance_image_falai',
              model: 'nano_banana',
              promptEnhancement: {
                basePrompt: 'UGC style product photo, handheld camera, authentic lighting, casual setting',
                styleTags: ['handheld', 'authentic', 'casual', 'personal'],
                qualityTags: ['high quality', 'natural lighting', 'realistic'],
                forbiddenTags: ['professional', 'studio', 'commercial', 'polished']
              },
              constraints: {
                maxEnhancementIntensity: 0.4,
                requiredStyle: 'handheld',
                forbiddenEffects: ['cinematic_zoom', 'bokeh_transition']
              }
            }
          ]
        }
      };

      const processedRecipe = processLanguageAwareWorkflowRecipe('ugc_testimonial_recipe', 'en', originalRecipe);

      expect(processedRecipe.language).toBe('en');
      expect(processedRecipe.workflow.steps[0].name).toBe('Image Enhancement');
    });
  });

  describe('Load Language Aware Workflow Recipes', () => {
    test('should load all recipes with language awareness', async () => {
      const languageAwareRecipes = await loadLanguageAwareWorkflowRecipes('es');

      expect(languageAwareRecipes).toBeDefined();
      expect(languageAwareRecipes.ugc_testimonial_recipe).toBeDefined();
      expect(languageAwareRecipes.ugc_testimonial_recipe.language).toBe('es');
      expect(languageAwareRecipes.ugc_testimonial_recipe.workflow.steps[0].name).toBe('Mejora de Imagen');
    });

    test('should handle unsupported languages with dynamic translation', async () => {
      const languageAwareRecipes = await loadLanguageAwareWorkflowRecipes('zh');

      expect(languageAwareRecipes).toBeDefined();
      expect(languageAwareRecipes.ugc_testimonial_recipe).toBeDefined();
      expect(languageAwareRecipes.ugc_testimonial_recipe.language).toBe('zh');
      expect(languageAwareRecipes.ugc_testimonial_recipe.workflow.steps[0].promptEnhancement.basePrompt).toContain('Chinese context');
    });

    test('should handle English language correctly', async () => {
      const languageAwareRecipes = await loadLanguageAwareWorkflowRecipes('en');

      expect(languageAwareRecipes).toBeDefined();
      expect(languageAwareRecipes.ugc_testimonial_recipe).toBeDefined();
      expect(languageAwareRecipes.ugc_testimonial_recipe.language).toBe('en');
      expect(languageAwareRecipes.ugc_testimonial_recipe.workflow.steps[0].name).toBe('Image Enhancement');
    });
  });
});
