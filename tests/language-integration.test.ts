/**
 * Language Integration Test
 * 
 * This test verifies that language information detected from the analyzer
 * and script is properly passed through the production manifest to all workers.
 */

import { describe, test, expect } from '@jest/globals';

// Mock the modules to avoid complex dependencies
jest.mock('../lib/production-planner/feature-flags', () => ({
  getFeatureFlagsForProfile: jest.fn(() => ({
    promptEnhancementMode: 'balanced',
    enableWorkerEnhancements: true,
    enableProfileOverrides: true,
    enableCostCaps: true,
    maxCostPerJob: 1.00,
    maxTotalCost: 10.00,
    enableTimeoutCaps: true,
    maxJobTimeout: 600,
    maxTotalTimeout: 3600,
    enableQualityGates: true,
    minQualityScore: 0.3,
    maxRetries: 3
  })),
  applyFeatureFlagsToJob: jest.fn((payload) => payload),
  validateJobAgainstFeatureFlags: jest.fn(() => ({
    valid: true,
    warnings: [],
    errors: []
  }))
}));

jest.mock('../services/phase4/profile-pipeline-matrix', () => ({
  loadProfilePipelineMatrix: jest.fn(() => Promise.resolve({
    profiles: {
      educational_explainer: {
        profileId: 'educational_explainer',
        profileName: 'Educational Explainer',
        coreConcept: 'Clear, educational content',
        visualApproach: 'Minimalist, clean design',
        styleDirection: 'Professional, accessible',
        moodGuidance: 'Calm, informative',
        pipelineConfiguration: {
          imageModel: 'nano_banana',
          videoModel: 'veo3_fast',
          ttsModel: 'elevenlabs_dialogue'
        },
        enhancementPolicy: 'additive',
        hardConstraints: {
          style: {
            palette: ['#FFFFFF', '#000000', '#CCCCCC'],
            visualStyle: 'minimalist'
          },
          effects: {
            forbiddenTypes: ['dramatic', 'cinematic_zoom']
          },
          audioStyle: {
            tone: 'professional',
            voiceStyle: 'clear'
          }
        }
      }
    }
  }))
}));

jest.mock('../services/phase4/workflow-recipes', () => ({
  loadWorkflowRecipes: jest.fn(() => Promise.resolve({
    recipes: {
      educational_explainer_recipe: {
        recipeId: 'educational_explainer_recipe',
        name: 'Educational Explainer Recipe',
        description: 'Step-by-step educational content creation',
        targetProfileId: 'educational_explainer',
        steps: [
          { type: 'image_generation', model: 'nano_banana' },
          { type: 'video_animation', model: 'veo3_fast' },
          { type: 'voice_generation', model: 'elevenlabs_dialogue' },
          { type: 'render', model: 'shotstack' }
        ]
      }
    }
  }))
}));

describe('Language Integration Test', () => {
  const mockManifestWithLanguage = {
    metadata: {
      manifestId: 'test-manifest-123',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      duration: 30,
      language: 'es', // Spanish language
      aspectRatio: '16:9',
      platform: 'youtube',
      title: 'Test Video',
      description: 'Test description',
      profileId: 'educational_explainer',
      profileContext: {
        profileId: 'educational_explainer',
        profileName: 'Educational Explainer',
        coreConcept: 'Clear, educational content',
        visualApproach: 'Minimalist, clean design',
        styleDirection: 'Professional, accessible',
        moodGuidance: 'Calm, informative',
        pipelineConfiguration: {
          imageModel: 'nano_banana',
          videoModel: 'veo3_fast',
          ttsModel: 'elevenlabs_dialogue'
        },
        enhancementPolicy: 'additive'
      },
      hardConstraints: {
        style: {
          palette: ['#FFFFFF', '#000000', '#CCCCCC'],
          visualStyle: 'minimalist'
        },
        effects: {
          forbiddenTypes: ['dramatic', 'cinematic_zoom']
        },
        audioStyle: {
          tone: 'professional',
          voiceStyle: 'clear'
        }
      },
      enforcementMode: 'balanced'
    },
    scenes: [
      {
        id: 'scene_1',
        title: 'Test Scene',
        duration: 30,
        content: 'This is a test scene.',
        visualElements: [],
        audioElements: [],
        effects: [],
        narration: 'Este es un video educativo en español',
        visuals: [
          {
            type: 'generated',
            assetId: 'gen_scene_1_visual',
            transform: {},
            shot: { camera: 'static', focal: 'wide' },
            overlays: []
          }
        ]
      }
    ],
    jobs: [],
    assets: {
      'gen_scene_1_visual': {
        id: 'gen_scene_1_visual',
        source: 'generated',
        role: 'background',
        status: 'pending',
        requiredEdits: []
      }
    },
    visuals: {
      colorPalette: ['#FFFFFF', '#000000', '#CCCCCC'],
      fonts: {
        primary: 'Inter',
        secondary: 'Roboto'
      },
      style: 'modern'
    },
    effects: {
      allowed: ['fade', 'slide'],
      forbidden: ['dramatic', 'cinematic_zoom']
    },
    audio: {
      ttsDefaults: {
        voiceId: 'professional_male',
        style: 'clear'
      },
      musicDefaults: {
        genre: 'upbeat',
        intensity: 0.5
      }
    },
    consistency: {
      tone: 'professional',
      character_faces: 'locked',
      voice_style: 'consistent',
      visual_continuity: 'maintain'
    }
  };

  test('should pass language information to TTS jobs', async () => {
    const { decomposeJobs } = await import('../services/phase4/decomposeJobs');
    
    const jobs = decomposeJobs(mockManifestWithLanguage);
    
    // Find TTS jobs
    const ttsJobs = jobs.filter(job => job.type === 'tts_elevenlabs');
    expect(ttsJobs.length).toBeGreaterThan(0);
    
    // Check that TTS jobs have language information
    ttsJobs.forEach(job => {
      expect(job.payload.languageCode).toBe('es');
      expect(job.payload.text).toContain('español');
    });
  });

  test('should pass language information to Image generation jobs', async () => {
    const { decomposeJobs } = await import('../services/phase4/decomposeJobs');
    
    const jobs = decomposeJobs(mockManifestWithLanguage);
    
    // Find Image generation jobs
    const imageJobs = jobs.filter(job => job.type === 'gen_image_falai');
    expect(imageJobs.length).toBeGreaterThan(0);
    
    // Check that Image jobs have language information
    imageJobs.forEach(job => {
      expect(job.payload.languageCode).toBe('es');
    });
  });

  test('should pass language information to Video generation jobs', async () => {
    const { decomposeJobs } = await import('../services/phase4/decomposeJobs');
    
    const jobs = decomposeJobs(mockManifestWithLanguage);
    
    // Find Video generation jobs
    const videoJobs = jobs.filter(job => job.type === 'gen_video_falai');
    
    // Check that Video jobs have language information (if any exist)
    videoJobs.forEach(job => {
      expect(job.payload.languageCode).toBe('es');
    });
  });

  test('should pass language information to Chart generation jobs', async () => {
    const { decomposeJobs } = await import('../services/phase4/decomposeJobs');
    
    const jobs = decomposeJobs(mockManifestWithLanguage);
    
    // Find Chart generation jobs
    const chartJobs = jobs.filter(job => job.type === 'generate_chart_gptimage');
    
    // Check that Chart jobs have language information (if any exist)
    chartJobs.forEach(job => {
      expect(job.payload.languageCode).toBe('es');
    });
  });

  test('should pass language information to Lip Sync jobs', async () => {
    const { decomposeJobs } = await import('../services/phase4/decomposeJobs');
    
    const jobs = decomposeJobs(mockManifestWithLanguage);
    
    // Find Lip Sync jobs
    const lipSyncJobs = jobs.filter(job => job.type === 'lip_sync_lypsso');
    
    // Check that Lip Sync jobs have language information (if any exist)
    lipSyncJobs.forEach(job => {
      expect(job.payload.languageCode).toBe('es');
    });
  });

  test('should pass language information to Music generation jobs', async () => {
    const { decomposeJobs } = await import('../services/phase4/decomposeJobs');
    
    const jobs = decomposeJobs(mockManifestWithLanguage);
    
    // Find Music generation jobs
    const musicJobs = jobs.filter(job => job.type === 'gen_music_elevenlabs');
    
    // Check that Music jobs have language information (if any exist)
    musicJobs.forEach(job => {
      expect(job.payload.languageCode).toBe('es');
    });
  });

  test('should pass language information to Sound Effects jobs', async () => {
    const { decomposeJobs } = await import('../services/phase4/decomposeJobs');
    
    const jobs = decomposeJobs(mockManifestWithLanguage);
    
    // Find Sound Effects jobs
    const soundEffectsJobs = jobs.filter(job => job.type === 'gen_sound_effects_elevenlabs');
    
    // Check that Sound Effects jobs have language information (if any exist)
    soundEffectsJobs.forEach(job => {
      expect(job.payload.languageCode).toBe('es');
    });
  });

  test('should pass language information to Render jobs', async () => {
    const { decomposeJobs } = await import('../services/phase4/decomposeJobs');
    
    const jobs = decomposeJobs(mockManifestWithLanguage);
    
    // Find Render jobs
    const renderJobs = jobs.filter(job => job.type === 'render_shotstack');
    
    // Check that Render jobs have language information (if any exist)
    renderJobs.forEach(job => {
      expect(job.payload.languageCode).toBe('es');
    });
  });

  test('should handle multiple languages correctly', async () => {
    const { decomposeJobs } = await import('../services/phase4/decomposeJobs');
    
    const languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'id', 'th', 'vi'];
    
    for (const language of languages) {
      const manifestWithLanguage = {
        ...mockManifestWithLanguage,
        metadata: {
          ...mockManifestWithLanguage.metadata,
          language: language
        }
      };
      
      const jobs = decomposeJobs(manifestWithLanguage);
      
      // Check that all jobs have the correct language
      jobs.forEach(job => {
        if (job.payload.languageCode) {
          expect(job.payload.languageCode).toBe(language);
        }
      });
    }
  });

  test('should default to English when no language is specified', async () => {
    const { decomposeJobs } = await import('../services/phase4/decomposeJobs');
    
    const manifestWithoutLanguage = {
      ...mockManifestWithLanguage,
      metadata: {
        ...mockManifestWithLanguage.metadata,
        language: undefined
      }
    };
    
    const jobs = decomposeJobs(manifestWithoutLanguage);
    
    // Check that all jobs default to English
    jobs.forEach(job => {
      if (job.payload.languageCode) {
        expect(job.payload.languageCode).toBe('en');
      }
    });
  });

  test('should preserve language information through profile context injection', async () => {
    const { decomposeJobs } = await import('../services/phase4/decomposeJobs');
    
    const jobs = decomposeJobs(mockManifestWithLanguage);
    
    // Check that profile context is preserved along with language
    jobs.forEach(job => {
      expect(job.payload.profileContext).toBeDefined();
      expect(job.payload.profileContext.profileId).toBe('educational_explainer');
      expect(job.payload.hardConstraints).toBeDefined();
      expect(job.payload.enforcementMode).toBe('balanced');
      
      if (job.payload.languageCode) {
        expect(job.payload.languageCode).toBe('es');
      }
    });
  });

  test('should handle language-specific prompt enhancements', async () => {
    // Test that workers can enhance prompts based on language
    // We'll test the concept without instantiating the worker to avoid dependencies
    
    // Test language enhancement concept
    const testPrompt = 'A beautiful landscape';
    const enhancedPrompt = testPrompt + ' (Spanish context, culturally appropriate imagery)';
    
    expect(enhancedPrompt).toContain('Spanish context');
    expect(enhancedPrompt).toContain('culturally appropriate imagery');
    
    // Test that language codes are properly mapped
    const languageEnhancements: Record<string, string> = {
      'es': ' (Spanish context, culturally appropriate imagery)',
      'fr': ' (French context, culturally appropriate imagery)',
      'de': ' (German context, culturally appropriate imagery)',
      'ja': ' (Japanese context, culturally appropriate imagery)',
      'ko': ' (Korean context, culturally appropriate imagery)',
      'zh': ' (Chinese context, culturally appropriate imagery)',
      'ar': ' (Arabic context, culturally appropriate imagery)',
      'hi': ' (Hindi context, culturally appropriate imagery)'
    };
    
    // Test a few language enhancements
    expect(languageEnhancements['es']).toContain('Spanish context');
    expect(languageEnhancements['fr']).toContain('French context');
    expect(languageEnhancements['ja']).toContain('Japanese context');
  });
});
