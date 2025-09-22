/**
 * Language-Aware Workflow Recipes
 * 
 * This module provides language-aware workflow recipe processing that integrates
 * with the language detection system to provide seamless translation for all
 * workflow steps and prompts.
 */

import { detectLanguageFromText } from '../analyzer/language-aware-creative-profiles';

export interface LanguageAwareWorkflowStep {
  step: number;
  name: string;
  description: string;
  jobType: string;
  model?: string;
  promptEnhancement: {
    basePrompt: string;
    styleTags?: string[];
    qualityTags?: string[];
    forbiddenTags?: string[];
    voiceStyle?: string;
    emotionTags?: string[];
    v3AudioTags?: string[];
    musicStyle?: string;
    soundCategories?: string[];
    cameraMovements?: string[];
    chartStyle?: string;
    angleVariations?: string[];
  };
  constraints: {
    [key: string]: any;
  };
}

export interface LanguageAwareWorkflowRecipe {
  recipeId: string;
  recipeName: string;
  description: string;
  profileId: string;
  enforcementMode: 'strict' | 'balanced' | 'creative';
  workflow: {
    steps: LanguageAwareWorkflowStep[];
  };
  expectedOutput: {
    duration: string;
    style: string;
    quality: string;
    cost: string;
  };
  language: string;
}

/**
 * Language-specific prompt translations for workflow recipes
 */
const WORKFLOW_LANGUAGE_TRANSLATIONS = {
  // Spanish translations
  es: {
    ugc_testimonial_recipe: {
      step1: {
        name: "Mejora de Imagen",
        description: "Mejorar imágenes de productos subidas por el usuario con estilo UGC",
        basePrompt: "Foto de producto estilo UGC, cámara en mano, iluminación auténtica, ambiente casual",
        styleTags: ["cámara en mano", "auténtico", "casual", "personal"],
        qualityTags: ["alta calidad", "iluminación natural", "realista"],
        forbiddenTags: ["profesional", "estudio", "comercial", "pulido"]
      },
      step2: {
        name: "Ángulos Multi-Cámara",
        description: "Generar múltiples ángulos de cámara para sensación UGC dinámica",
        basePrompt: "Foto de producto estilo UGC desde diferentes ángulos, cámara en mano, sensación auténtica",
        angleVariations: ["primer plano", "plano medio", "plano general", "vista aérea"]
      },
      step3: {
        name: "Generación de Voz",
        description: "Generar voz testimonial auténtica con tono casual",
        basePrompt: "Voz testimonial casual y auténtica",
        voiceStyle: "conversacional",
        emotionTags: ["auténtico", "personal", "confiable"],
        v3AudioTags: ["[casual]", "[auténtico]", "[personal]"]
      },
      step4: {
        name: "Animación de Video",
        description: "Animar imágenes con movimientos de cámara estilo UGC",
        basePrompt: "Video estilo UGC con movimientos de cámara en mano, sensación auténtica",
        cameraMovements: ["cámara en mano", "ligero temblor", "paneo natural"]
      },
      step5: {
        name: "Renderizado Final",
        description: "Renderizar video testimonial UGC final con sensación auténtica"
      }
    },
    ugc_reaction: {
      step1: {
        name: "Mejora de Imagen",
        description: "Mejorar imágenes subidas por el usuario con estilo audaz para redes sociales",
        basePrompt: "Imagen audaz y llamativa, estilo redes sociales, colores vibrantes",
        styleTags: ["audaz", "vibrante", "llamativo", "redes sociales"],
        qualityTags: ["alta calidad", "colores vibrantes", "llamativo"],
        forbiddenTags: ["sutil", "minimalista", "profesional"]
      },
      step2: {
        name: "Generación de Voz",
        description: "Generar voz de reacción emocionada con energía",
        basePrompt: "Voz de reacción emocionada y enérgica",
        voiceStyle: "emocionado",
        emotionTags: ["emocionado", "sorprendido", "atractivo"],
        v3AudioTags: ["[emocionado]", "[sorprendido]", "[enérgico]"]
      },
      step3: {
        name: "Efectos de Sonido",
        description: "Agregar efectos de sonido atractivos para contenido de reacción",
        basePrompt: "Efectos de sonido atractivos para contenido de reacción",
        soundCategories: ["whoosh", "pop", "timbre", "notificación"]
      },
      step4: {
        name: "Animación de Video",
        description: "Animar con movimientos dinámicos y llamativos",
        basePrompt: "Video dinámico y llamativo con movimientos audaces",
        cameraMovements: ["dinámico", "enérgico", "llamativo"]
      },
      step5: {
        name: "Renderizado Final",
        description: "Renderizar video de reacción UGC final con estilo audaz"
      }
    },
    educational_explainer: {
      step1: {
        name: "Mejora de Imagen",
        description: "Mejorar imágenes con estilo claro y educativo",
        basePrompt: "Imagen clara y educativa, estilo minimalista, fácil de entender",
        styleTags: ["claro", "educativo", "minimalista", "fácil de entender"],
        qualityTags: ["alta calidad", "claro", "educativo"],
        forbiddenTags: ["dramático", "cinematográfico", "complejo"]
      },
      step2: {
        name: "Generación de Gráficos",
        description: "Generar gráficos y diagramas claros y educativos",
        basePrompt: "Gráfico claro y educativo, estilo minimalista, fácil de entender",
        chartStyle: "minimalista"
      },
      step3: {
        name: "Generación de Voz",
        description: "Generar voz clara y educativa con tono profesional",
        basePrompt: "Voz clara y educativa, tono profesional",
        voiceStyle: "claro",
        emotionTags: ["claro", "educativo", "profesional"],
        v3AudioTags: ["[claro]", "[educativo]", "[profesional]"]
      },
      step4: {
        name: "Generación de Música",
        description: "Generar música de fondo sutil y educativa",
        basePrompt: "Música de fondo sutil y educativa, estilo minimalista",
        musicStyle: "sutil",
        emotionTags: ["calmado", "educativo", "minimalista"]
      },
      step5: {
        name: "Animación de Video",
        description: "Animar con movimientos suaves y educativos",
        basePrompt: "Video suave y educativo con movimientos claros",
        cameraMovements: ["suave", "claro", "educativo"]
      },
      step6: {
        name: "Renderizado Final",
        description: "Renderizar explicador educativo final con estilo claro y minimalista"
      }
    }
  },
  
  // French translations
  fr: {
    ugc_testimonial_recipe: {
      step1: {
        name: "Amélioration d'Image",
        description: "Améliorer les images de produits téléchargées par l'utilisateur avec un style UGC",
        basePrompt: "Photo de produit style UGC, caméra à la main, éclairage authentique, ambiance décontractée",
        styleTags: ["caméra à la main", "authentique", "décontracté", "personnel"],
        qualityTags: ["haute qualité", "éclairage naturel", "réaliste"],
        forbiddenTags: ["professionnel", "studio", "commercial", "poli"]
      },
      step2: {
        name: "Angles Multi-Caméra",
        description: "Générer plusieurs angles de caméra pour une sensation UGC dynamique",
        basePrompt: "Photo de produit style UGC sous différents angles, caméra à la main, sensation authentique",
        angleVariations: ["gros plan", "plan moyen", "plan large", "vue aérienne"]
      },
      step3: {
        name: "Génération de Voix",
        description: "Générer une voix testimonial authentique avec un ton décontracté",
        basePrompt: "Voix testimonial décontractée et authentique",
        voiceStyle: "conversationnel",
        emotionTags: ["authentique", "personnel", "digne de confiance"],
        v3AudioTags: ["[décontracté]", "[authentique]", "[personnel]"]
      },
      step4: {
        name: "Animation Vidéo",
        description: "Animer les images avec des mouvements de caméra style UGC",
        basePrompt: "Vidéo style UGC avec mouvements de caméra à la main, sensation authentique",
        cameraMovements: ["caméra à la main", "léger tremblement", "panoramique naturel"]
      },
      step5: {
        name: "Rendu Final",
        description: "Rendre la vidéo testimonial UGC finale avec une sensation authentique"
      }
    }
  },
  
  // German translations
  de: {
    ugc_testimonial_recipe: {
      step1: {
        name: "Bildverbesserung",
        description: "Verbesserung von Benutzer-uploaded Produktbildern mit UGC-Stil",
        basePrompt: "UGC-Stil Produktfoto, Handkamera, authentische Beleuchtung, lockere Umgebung",
        styleTags: ["Handkamera", "authentisch", "locker", "persönlich"],
        qualityTags: ["hohe Qualität", "natürliche Beleuchtung", "realistisch"],
        forbiddenTags: ["professionell", "Studio", "kommerziell", "poliert"]
      },
      step2: {
        name: "Multi-Kamera-Winkel",
        description: "Generierung mehrerer Kamerawinkel für dynamisches UGC-Gefühl",
        basePrompt: "UGC-Stil Produktfoto aus verschiedenen Winkeln, Handkamera, authentisches Gefühl",
        angleVariations: ["Nahaufnahme", "Mittelaufnahme", "Weitaufnahme", "Vogelperspektive"]
      },
      step3: {
        name: "Sprachgenerierung",
        description: "Generierung authentischer Testimonial-Stimme mit lockeren Ton",
        basePrompt: "Lockere, authentische Testimonial-Stimme",
        voiceStyle: "gesprächig",
        emotionTags: ["authentisch", "persönlich", "vertrauenswürdig"],
        v3AudioTags: ["[locker]", "[authentisch]", "[persönlich]"]
      },
      step4: {
        name: "Video-Animation",
        description: "Animation von Bildern mit UGC-Stil Kamerabewegungen",
        basePrompt: "UGC-Stil Video mit Handkamera-Bewegungen, authentisches Gefühl",
        cameraMovements: ["Handkamera", "leichter Wackeln", "natürliches Schwenken"]
      },
      step5: {
        name: "Finales Rendering",
        description: "Rendering des finalen UGC-Testimonial-Videos mit authentischem Gefühl"
      }
    }
  }
};

/**
 * Get language-aware workflow recipe
 */
export function getLanguageAwareWorkflowRecipe(
  recipeId: string,
  detectedLanguage: string,
  originalRecipe: any
): LanguageAwareWorkflowRecipe {
  const language = detectedLanguage.toLowerCase().substring(0, 2);
  const languageTranslations = WORKFLOW_LANGUAGE_TRANSLATIONS[language as keyof typeof WORKFLOW_LANGUAGE_TRANSLATIONS];
  
  // If no translations available for this language, return original recipe with language info
  if (!languageTranslations || !languageTranslations[recipeId as keyof typeof languageTranslations]) {
    return {
      ...originalRecipe,
      language: 'en' // Return English to indicate fallback needed
    };
  }
  
  const recipeTranslations = languageTranslations[recipeId as keyof typeof languageTranslations];
  
  // Translate workflow steps
  const translatedSteps = originalRecipe.workflow.steps.map((step: any, index: number) => {
    const stepKey = `step${step.step}` as keyof typeof recipeTranslations;
    const stepTranslation = recipeTranslations[stepKey];
    
    if (!stepTranslation) {
      return step; // Return original step if no translation available
    }
    
    return {
      ...step,
      name: stepTranslation.name || step.name,
      description: stepTranslation.description || step.description,
      promptEnhancement: {
        ...step.promptEnhancement,
        basePrompt: stepTranslation.basePrompt || step.promptEnhancement.basePrompt,
        styleTags: stepTranslation.styleTags || step.promptEnhancement.styleTags,
        qualityTags: stepTranslation.qualityTags || step.promptEnhancement.qualityTags,
        forbiddenTags: stepTranslation.forbiddenTags || step.promptEnhancement.forbiddenTags,
        voiceStyle: stepTranslation.voiceStyle || step.promptEnhancement.voiceStyle,
        emotionTags: stepTranslation.emotionTags || step.promptEnhancement.emotionTags,
        v3AudioTags: stepTranslation.v3AudioTags || step.promptEnhancement.v3AudioTags,
        musicStyle: stepTranslation.musicStyle || step.promptEnhancement.musicStyle,
        soundCategories: stepTranslation.soundCategories || step.promptEnhancement.soundCategories,
        cameraMovements: stepTranslation.cameraMovements || step.promptEnhancement.cameraMovements,
        chartStyle: stepTranslation.chartStyle || step.promptEnhancement.chartStyle,
        angleVariations: stepTranslation.angleVariations || step.promptEnhancement.angleVariations
      }
    };
  });
  
  return {
    ...originalRecipe,
    workflow: {
      ...originalRecipe.workflow,
      steps: translatedSteps
    },
    language: language
  };
}

/**
 * Generate dynamic language-appropriate workflow recipe for unsupported languages
 */
export function generateDynamicLanguageWorkflowRecipe(
  recipeId: string,
  detectedLanguage: string,
  originalRecipe: any
): LanguageAwareWorkflowRecipe {
  const languageNames: Record<string, string> = {
    'bg': 'Bulgarian',
    'ru': 'Russian',
    'uk': 'Ukrainian',
    'pl': 'Polish',
    'cs': 'Czech',
    'sk': 'Slovak',
    'hr': 'Croatian',
    'sr': 'Serbian',
    'sl': 'Slovenian',
    'et': 'Estonian',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'fi': 'Finnish',
    'sv': 'Swedish',
    'no': 'Norwegian',
    'da': 'Danish',
    'is': 'Icelandic',
    'tr': 'Turkish',
    'he': 'Hebrew',
    'th': 'Thai',
    'vi': 'Vietnamese',
    'ms': 'Malay',
    'tl': 'Filipino',
    'sw': 'Swahili',
    'af': 'Afrikaans',
    'eu': 'Basque',
    'ca': 'Catalan',
    'gl': 'Galician',
    'cy': 'Welsh',
    'ga': 'Irish',
    'mt': 'Maltese',
    'ro': 'Romanian',
    'el': 'Greek',
    'mk': 'Macedonian',
    'sq': 'Albanian',
    'bs': 'Bosnian',
    'me': 'Montenegrin',
    'zh': 'Chinese',
    'ar': 'Arabic',
    'hi': 'Hindi',
    'ja': 'Japanese',
    'ko': 'Korean'
  };
  
  const languageName = languageNames[detectedLanguage] || detectedLanguage;
  
  // Create dynamic workflow recipe with language context
  const dynamicSteps = originalRecipe.workflow.steps.map((step: any) => ({
    ...step,
    promptEnhancement: {
      ...step.promptEnhancement,
      basePrompt: `${step.promptEnhancement.basePrompt} (${languageName} context, culturally appropriate for ${languageName}-speaking audiences)`
    }
  }));
  
  return {
    ...originalRecipe,
    workflow: {
      ...originalRecipe.workflow,
      steps: dynamicSteps
    },
    language: detectedLanguage
  };
}

/**
 * Process workflow recipe with language awareness
 */
export function processLanguageAwareWorkflowRecipe(
  recipeId: string,
  detectedLanguage: string,
  originalRecipe: any
): LanguageAwareWorkflowRecipe {
  // First try to get language-specific translation
  const languageAwareRecipe = getLanguageAwareWorkflowRecipe(recipeId, detectedLanguage, originalRecipe);
  
  // If we got the same language as detected and it's not English, return it
  if (languageAwareRecipe.language === detectedLanguage.toLowerCase().substring(0, 2)) {
    return languageAwareRecipe;
  }
  
  // If we got English fallback and detected language is not English, use dynamic translation
  if (languageAwareRecipe.language === 'en' && detectedLanguage !== 'en') {
    return generateDynamicLanguageWorkflowRecipe(recipeId, detectedLanguage, originalRecipe);
  }
  
  // If detected language is English, return the recipe as-is
  if (detectedLanguage === 'en') {
    return {
      ...originalRecipe,
      language: 'en'
    };
  }
  
  // For any other case, use dynamic translation
  return generateDynamicLanguageWorkflowRecipe(recipeId, detectedLanguage, originalRecipe);
}

/**
 * Load and process workflow recipes with language awareness
 */
export async function loadLanguageAwareWorkflowRecipes(
  detectedLanguage: string
): Promise<{ [key: string]: LanguageAwareWorkflowRecipe }> {
  try {
    // For testing, use mock data instead of importing
    const mockRecipes = {
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
    };
    
    const languageAwareRecipes: { [key: string]: LanguageAwareWorkflowRecipe } = {};
    
    // Process each recipe with language awareness
    for (const [recipeId, recipe] of Object.entries(mockRecipes.recipes)) {
      languageAwareRecipes[recipeId] = processLanguageAwareWorkflowRecipe(
        recipeId,
        detectedLanguage,
        recipe
      );
    }
    
    return languageAwareRecipes;
  } catch (error) {
    console.error('Error loading language-aware workflow recipes:', error);
    return {};
  }
}
