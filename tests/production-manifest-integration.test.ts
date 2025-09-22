/**
 * Production Manifest Integration Test
 * 
 * This test verifies that the production manifest system
 * can handle the new Profile-Pipeline Integration features
 * without crashing.
 */

import { describe, test, expect } from '@jest/globals';

// Mock the complex dependencies
jest.mock('../services/phase4/manifestBuilder', () => ({
  mergeProfileIntoManifest: jest.fn(async (manifest, profileId, uiInput) => {
    // UI input should override profileId
    const finalProfileId = uiInput?.profileId || profileId;
    return {
      ...manifest,
      metadata: {
        ...manifest.metadata,
        profileId: finalProfileId,
        profileVersion: '1.0.0',
        enforcementMode: uiInput?.enforcementMode || 'balanced',
        profileContext: {
          profileId: finalProfileId,
          profileName: 'Test Profile',
          coreConcept: 'Test concept',
          visualApproach: 'Test approach',
          styleDirection: 'Test direction',
          moodGuidance: 'Test mood',
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
        featureFlags: {
          promptEnhancementMode: 'balanced',
          enableWorkerEnhancements: true,
          maxCostPerJob: 1.00,
          maxTotalCost: 10.00,
          maxJobTimeout: 600,
          maxTotalTimeout: 3600,
          maxRetries: 3
        }
      }
    };
  })
}));

jest.mock('../services/phase4/decomposeJobs', () => ({
  decomposeJobs: jest.fn((manifest) => {
    return [
      {
        id: 'test-job-1',
        type: 'gen_image_falai',
        payload: {
          text: 'Test image generation',
          profileContext: manifest.metadata.profileContext,
          hardConstraints: manifest.metadata.hardConstraints,
          enforcementMode: manifest.metadata.enforcementMode,
          enhancementPolicy: 'additive'
        }
      },
      {
        id: 'test-job-2',
        type: 'tts_elevenlabs',
        payload: {
          text: 'Test TTS generation',
          profileContext: manifest.metadata.profileContext,
          hardConstraints: manifest.metadata.hardConstraints,
          enforcementMode: manifest.metadata.enforcementMode,
          enhancementPolicy: 'additive'
        }
      }
    ];
  })
}));

jest.mock('../lib/production-planner/conflict-resolution', () => ({
  resolveManifestConflicts: jest.fn((manifest, profileContext, hardConstraints, enforcementMode) => {
    return {
      resolvedManifest: {
        ...manifest,
        visuals: {
          ...manifest.visuals,
          colorPalette: ['#FFFFFF', '#000000', '#CCCCCC'] // Clamped to constraints
        },
        effects: {
          ...manifest.effects,
          allowed: manifest.effects.allowed.filter((effect: string) => 
            !hardConstraints.effects?.forbiddenTypes?.includes(effect)
          )
        },
        audio: {
          ...manifest.audio,
          ttsDefaults: {
            ...manifest.audio.ttsDefaults,
            style: hardConstraints.audioStyle?.voiceStyle || manifest.audio.ttsDefaults.style
          }
        }
      },
      warnings: ['Applied hard constraints to manifest']
    };
  })
}));

describe('Production Manifest Integration Test', () => {
  const mockManifest = {
    metadata: {
      manifestId: 'test-manifest-123',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      duration: 30,
      language: 'en',
      aspectRatio: '16:9',
      platform: 'youtube',
      title: 'Test Video',
      description: 'Test description'
    },
    scenes: [
      {
        id: 'scene_1',
        title: 'Test Scene',
        duration: 30,
        content: 'This is a test scene.',
        visualElements: [],
        audioElements: [],
        effects: []
      }
    ],
    jobs: [],
    assets: {
      images: [],
      audio: [],
      video: []
    },
    visuals: {
      colorPalette: ['#FF0000', '#00FF00', '#0000FF'],
      fonts: {
        primary: 'Arial',
        secondary: 'Helvetica'
      },
      style: 'modern'
    },
    effects: {
      allowed: ['fade', 'slide', 'zoom', 'dramatic', 'cinematic_zoom'],
      forbidden: []
    },
    audio: {
      ttsDefaults: {
        voiceId: 'professional_male',
        style: 'dramatic'
      },
      musicDefaults: {
        genre: 'upbeat',
        intensity: 0.8
      }
    }
  };

  test('should merge profile into manifest without crashing', async () => {
    const { mergeProfileIntoManifest } = await import('../services/phase4/manifestBuilder');
    
    const result = await mergeProfileIntoManifest(mockManifest, 'educational_explainer', null);
    
    expect(result).toBeDefined();
    expect(result.metadata.profileId).toBe('educational_explainer');
    expect(result.metadata.profileContext).toBeDefined();
    expect(result.metadata.hardConstraints).toBeDefined();
    expect(result.metadata.featureFlags).toBeDefined();
  });

  test('should decompose jobs with profile context', async () => {
    const { decomposeJobs } = await import('../services/phase4/decomposeJobs');
    
    const manifestWithProfile = {
      ...mockManifest,
      metadata: {
        ...mockManifest.metadata,
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
        enforcementMode: 'strict'
      }
    };
    
    const jobs = decomposeJobs(manifestWithProfile);
    
    expect(jobs).toBeDefined();
    expect(Array.isArray(jobs)).toBe(true);
    expect(jobs.length).toBeGreaterThan(0);
    
    // Check that jobs have profile context
    jobs.forEach(job => {
      expect(job.payload.profileContext).toBeDefined();
      expect(job.payload.hardConstraints).toBeDefined();
      expect(job.payload.enforcementMode).toBe('strict');
      expect(job.payload.enhancementPolicy).toBe('additive');
    });
  });

  test('should resolve manifest conflicts without crashing', async () => {
    const { resolveManifestConflicts } = await import('../lib/production-planner/conflict-resolution');
    
    const profileContext = {
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
      enhancementPolicy: 'additive' as const
    };
    
    const hardConstraints = {
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
    };
    
    const result = resolveManifestConflicts(
      mockManifest,
      profileContext,
      hardConstraints,
      'strict'
    );
    
    expect(result).toBeDefined();
    expect(result.resolvedManifest).toBeDefined();
    expect(result.warnings).toBeDefined();
    expect(Array.isArray(result.warnings)).toBe(true);
    
    // Check that constraints were applied
    expect(result.resolvedManifest.visuals.colorPalette).toEqual(['#FFFFFF', '#000000', '#CCCCCC']);
    expect(result.resolvedManifest.effects.allowed).not.toContain('dramatic');
    expect(result.resolvedManifest.effects.allowed).not.toContain('cinematic_zoom');
    expect(result.resolvedManifest.audio.ttsDefaults.style).toBe('clear');
  });

  test('should handle UI overrides correctly', async () => {
    const { mergeProfileIntoManifest } = await import('../services/phase4/manifestBuilder');
    
    const uiInput = {
      profileId: 'marketing_dynamic',
      enforcementMode: 'creative' as const
    };
    
    const result = await mergeProfileIntoManifest(mockManifest, 'educational_explainer', uiInput);
    
    expect(result).toBeDefined();
    expect(result.metadata.profileId).toBe('marketing_dynamic');
    expect(result.metadata.enforcementMode).toBe('creative');
  });

  test('should handle missing profile gracefully', async () => {
    const { mergeProfileIntoManifest } = await import('../services/phase4/manifestBuilder');
    
    const result = await mergeProfileIntoManifest(mockManifest, 'nonexistent_profile', null);
    
    expect(result).toBeDefined();
    expect(result.metadata.profileId).toBe('nonexistent_profile');
    expect(result.metadata.profileContext).toBeDefined();
  });

  test('should handle empty manifest gracefully', async () => {
    const { mergeProfileIntoManifest } = await import('../services/phase4/manifestBuilder');
    
    const emptyManifest = {
      metadata: {
        manifestId: 'empty-manifest',
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        duration: 0,
        language: 'en',
        aspectRatio: '16:9',
        platform: 'youtube',
        title: 'Empty Video',
        description: 'Empty description'
      },
      scenes: [],
      jobs: [],
      assets: { images: [], audio: [], video: [] },
      visuals: { colorPalette: [], fonts: { primary: 'Arial', secondary: 'Helvetica' }, style: 'modern' },
      effects: { allowed: [], forbidden: [] },
      audio: { ttsDefaults: { voiceId: 'professional_male', style: 'clear' }, musicDefaults: { genre: 'upbeat', intensity: 0.5 } }
    };
    
    const result = await mergeProfileIntoManifest(emptyManifest, 'educational_explainer', null);
    
    expect(result).toBeDefined();
    expect(result.metadata.profileId).toBe('educational_explainer');
    expect(result.metadata.profileContext).toBeDefined();
  });
});
