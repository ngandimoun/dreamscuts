/**
 * Profile-Pipeline Integration Tests
 * 
 * This test suite validates the integration between creative profiles and workflow pipelines,
 * ensuring that hard constraints are properly applied, conflicts are resolved, and the system
 * works seamlessly without crashes or overrides.
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { ProductionManifest, ProfileContext, HardConstraints } from '../types/production-manifest';
import { mergeProfileIntoManifest } from '../services/phase4/manifestBuilder';
import { resolveManifestConflicts } from '../lib/production-planner/conflict-resolution';
import { getFeatureFlagsForProfile, validateJobAgainstFeatureFlags } from '../lib/production-planner/feature-flags';
import { loadProfilePipelineMatrix } from '../services/phase4/profile-pipeline-matrix';
import { loadWorkflowRecipes } from '../services/phase4/workflow-recipes';

// Mock data for testing
const mockManifest: ProductionManifest = {
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
      title: 'Introduction',
      duration: 10,
      content: 'Welcome to our product demo',
      visualElements: [],
      audioElements: [],
      effects: []
    }
  ],
  jobs: [
    {
      id: 'job_tts_1',
      type: 'gen_tts_elevenlabs',
      priority: 1,
      dependencies: [],
      payload: {
        text: 'Welcome to our product demo',
        voiceSettings: {
          voiceId: 'professional_male',
          style: 'clear'
        }
      }
    }
  ],
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
    allowed: ['fade', 'slide', 'zoom'],
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
  }
};

describe('Profile-Pipeline Integration', () => {
  beforeEach(() => {
    // Reset any mocks or state
  });

  afterEach(() => {
    // Cleanup
  });

  describe('Profile Context Injection', () => {
    test('should inject profile context into manifest metadata', async () => {
      const profileId = 'educational_explainer';
      const result = await mergeProfileIntoManifest(mockManifest, profileId, null);
      
      expect(result.metadata.profileId).toBe(profileId);
      expect(result.metadata.profileContext).toBeDefined();
      expect(result.metadata.hardConstraints).toBeDefined();
      expect(result.metadata.enforcementMode).toBeDefined();
    });

    test('should apply hard constraints from profile', async () => {
      const profileId = 'educational_explainer';
      const result = await mergeProfileIntoManifest(mockManifest, profileId, null);
      
      // Educational profile should have minimalist constraints
      expect(result.metadata.hardConstraints?.style?.visualStyle).toBe('minimalist');
      expect(result.metadata.hardConstraints?.audioStyle?.tone).toBe('professional');
    });

    test('should respect precedence order: UI > Recipe > Profile', async () => {
      const profileId = 'educational_explainer';
      const uiInput = {
        profileId: 'marketing_dynamic',
        enforcementMode: 'strict' as const
      };
      
      const result = await mergeProfileIntoManifest(mockManifest, profileId, uiInput);
      
      // UI input should override profile selection
      expect(result.metadata.profileId).toBe('marketing_dynamic');
      expect(result.metadata.enforcementMode).toBe('strict');
    });
  });

  describe('Hard Constraints Enforcement', () => {
    test('should clamp color palette to profile constraints', async () => {
      const profileId = 'educational_explainer';
      const result = await mergeProfileIntoManifest(mockManifest, profileId, null);
      
      // Educational profile should limit colors to professional palette
      const allowedColors = result.metadata.hardConstraints?.style?.palette || [];
      const manifestColors = result.visuals.colorPalette;
      
      // All manifest colors should be in allowed colors
      manifestColors.forEach(color => {
        expect(allowedColors).toContain(color);
      });
    });

    test('should filter effects based on profile constraints', async () => {
      const profileId = 'educational_explainer';
      const result = await mergeProfileIntoManifest(mockManifest, profileId, null);
      
      // Educational profile should forbid dramatic effects
      const forbiddenEffects = result.metadata.hardConstraints?.effects?.forbiddenTypes || [];
      const manifestEffects = result.effects.allowed;
      
      // No forbidden effects should be in allowed effects
      forbiddenEffects.forEach(effect => {
        expect(manifestEffects).not.toContain(effect);
      });
    });

    test('should clamp voice style to profile constraints', async () => {
      const profileId = 'educational_explainer';
      const result = await mergeProfileIntoManifest(mockManifest, profileId, null);
      
      // Educational profile should enforce professional voice style
      const allowedVoiceStyle = result.metadata.hardConstraints?.audioStyle?.voiceStyle;
      const manifestVoiceStyle = result.audio.ttsDefaults.style;
      
      expect(manifestVoiceStyle).toBe(allowedVoiceStyle);
    });
  });

  describe('Conflict Resolution', () => {
    test('should resolve conflicts between profile and manifest', () => {
      const profileContext: ProfileContext = {
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
      };

      const hardConstraints: HardConstraints = {
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

      expect(result.resolvedManifest.visuals.colorPalette).toEqual(
        expect.arrayContaining(['#FFFFFF', '#000000', '#CCCCCC'])
      );
      expect(result.resolvedManifest.effects.allowed).not.toContain('dramatic');
      expect(result.resolvedManifest.audio.ttsDefaults.style).toBe('clear');
    });

    test('should log warnings for clamped values', () => {
      const profileContext: ProfileContext = {
        profileId: 'educational_explainer',
        profileName: 'Educational Explainer',
        coreConcept: 'Clear, educational content',
        visualApproach: 'Minimalist, clean design',
        styleDirection: 'Professional, accessible',
        moodGuidance: 'Calm, informative',
        pipelineConfiguration: {},
        enhancementPolicy: 'additive'
      };

      const hardConstraints: HardConstraints = {
        style: {
          palette: ['#FFFFFF', '#000000']
        }
      };

      const result = resolveManifestConflicts(
        mockManifest,
        profileContext,
        hardConstraints,
        'strict'
      );

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(w => w.includes('Color palette'))).toBe(true);
    });
  });

  describe('Feature Flags Integration', () => {
    test('should apply feature flags based on profile', () => {
      const profileId = 'educational_explainer';
      const flags = getFeatureFlagsForProfile(profileId);
      
      expect(flags.promptEnhancementMode).toBe('strict');
      expect(flags.maxCostPerJob).toBe(0.50);
      expect(flags.maxTotalCost).toBe(5.00);
    });

    test('should validate jobs against feature flags', () => {
      const profileId = 'educational_explainer';
      const job = {
        estimatedCost: 0.30,
        estimatedDuration: 300,
        qualityScore: 0.8
      };
      
      const result = validateJobAgainstFeatureFlags(job, profileId);
      
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    test('should reject jobs that exceed cost caps', () => {
      const profileId = 'educational_explainer';
      const job = {
        estimatedCost: 1.00, // Exceeds 0.50 limit
        estimatedDuration: 300,
        qualityScore: 0.8
      };
      
      const result = validateJobAgainstFeatureFlags(job, profileId);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('cost'))).toBe(true);
    });

    test('should reject jobs that exceed timeout caps', () => {
      const profileId = 'educational_explainer';
      const job = {
        estimatedCost: 0.30,
        estimatedDuration: 1200, // Exceeds 600s limit
        qualityScore: 0.8
      };
      
      const result = validateJobAgainstFeatureFlags(job, profileId);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('timeout'))).toBe(true);
    });
  });

  describe('Model Selection Matrix', () => {
    test('should load profile-pipeline matrix', async () => {
      const matrix = await loadProfilePipelineMatrix();
      
      expect(matrix.profiles).toBeDefined();
      expect(matrix.profiles.educational_explainer).toBeDefined();
      expect(matrix.profiles.marketing_dynamic).toBeDefined();
      expect(matrix.profiles.ugc_testimonial).toBeDefined();
    });

    test('should have correct model mappings for each profile', async () => {
      const matrix = await loadProfilePipelineMatrix();
      
      // Educational profile should use cost-effective models
      const educational = matrix.profiles.educational_explainer;
      expect(educational.pipelineConfiguration.imageModel).toBe('nano_banana');
      expect(educational.pipelineConfiguration.videoModel).toBe('veo3_fast');
      
      // Marketing profile should use high-quality models
      const marketing = matrix.profiles.marketing_dynamic;
      expect(marketing.pipelineConfiguration.imageModel).toBe('seedream_4.0');
      expect(marketing.pipelineConfiguration.videoModel).toBe('veo3_fast');
    });
  });

  describe('Workflow Recipes', () => {
    test('should load workflow recipes', async () => {
      const recipes = await loadWorkflowRecipes();
      
      expect(recipes.recipes).toBeDefined();
      expect(recipes.recipes.ugc_testimonial_recipe).toBeDefined();
      expect(recipes.recipes.product_ad_recipe).toBeDefined();
    });

    test('should have correct recipe steps', async () => {
      const recipes = await loadWorkflowRecipes();
      
      const ugcRecipe = recipes.recipes.ugc_testimonial_recipe;
      expect(ugcRecipe.steps).toBeDefined();
      expect(ugcRecipe.steps.length).toBeGreaterThan(0);
      
      // UGC recipe should include image generation, video animation, voice, and lip sync
      const stepTypes = ugcRecipe.steps.map(step => step.type);
      expect(stepTypes).toContain('image_generation');
      expect(stepTypes).toContain('video_animation');
      expect(stepTypes).toContain('voice_generation');
      expect(stepTypes).toContain('lip_sync');
    });
  });

  describe('End-to-End Integration', () => {
    test('should complete full profile-pipeline integration', async () => {
      const profileId = 'ugc_testimonial';
      const uiInput = {
        profileId: 'ugc_testimonial',
        enforcementMode: 'balanced' as const
      };
      
      // Step 1: Merge profile into manifest
      const manifestWithProfile = await mergeProfileIntoManifest(mockManifest, profileId, uiInput);
      
      // Step 2: Apply conflict resolution
      const resolvedManifest = resolveManifestConflicts(
        manifestWithProfile,
        manifestWithProfile.metadata.profileContext!,
        manifestWithProfile.metadata.hardConstraints!,
        manifestWithProfile.metadata.enforcementMode!
      );
      
      // Step 3: Validate against feature flags
      const flags = getFeatureFlagsForProfile(profileId);
      const jobValidation = validateJobAgainstFeatureFlags(
        resolvedManifest.resolvedManifest.jobs[0],
        profileId
      );
      
      // Assertions
      expect(manifestWithProfile.metadata.profileId).toBe('ugc_testimonial');
      expect(resolvedManifest.resolvedManifest.metadata.profileContext).toBeDefined();
      expect(jobValidation.valid).toBe(true);
      expect(flags.promptEnhancementMode).toBe('balanced');
    });

    test('should handle profile overrides correctly', async () => {
      const profileId = 'educational_explainer';
      const uiInput = {
        profileId: 'marketing_dynamic',
        enforcementMode: 'creative' as const
      };
      
      const result = await mergeProfileIntoManifest(mockManifest, profileId, uiInput);
      
      // UI input should override profile selection
      expect(result.metadata.profileId).toBe('marketing_dynamic');
      expect(result.metadata.enforcementMode).toBe('creative');
      
      // But should still have marketing profile constraints
      expect(result.metadata.profileContext?.profileId).toBe('marketing_dynamic');
    });
  });

  describe('Error Handling', () => {
    test('should handle missing profile gracefully', async () => {
      const profileId = 'nonexistent_profile';
      const result = await mergeProfileIntoManifest(mockManifest, profileId, null);
      
      // Should fall back to default behavior
      expect(result.metadata.profileId).toBe(profileId);
      expect(result.metadata.profileContext).toBeDefined();
    });

    test('should handle invalid hard constraints', () => {
      const profileContext: ProfileContext = {
        profileId: 'test_profile',
        profileName: 'Test Profile',
        coreConcept: 'Test concept',
        visualApproach: 'Test approach',
        styleDirection: 'Test direction',
        moodGuidance: 'Test mood',
        pipelineConfiguration: {},
        enhancementPolicy: 'additive'
      };

      const invalidConstraints: HardConstraints = {
        style: {
          palette: [] // Empty palette should be handled
        }
      };

      const result = resolveManifestConflicts(
        mockManifest,
        profileContext,
        invalidConstraints,
        'strict'
      );

      // Should not crash and should provide fallback
      expect(result.resolvedManifest).toBeDefined();
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });
});

// Snapshot tests for deterministic behavior
describe('Profile-Pipeline Snapshot Tests', () => {
  test('educational_explainer profile should produce consistent output', async () => {
    const profileId = 'educational_explainer';
    const result = await mergeProfileIntoManifest(mockManifest, profileId, null);
    
    // Snapshot the key properties that should be deterministic
    const snapshot = {
      profileId: result.metadata.profileId,
      enforcementMode: result.metadata.enforcementMode,
      hardConstraints: result.metadata.hardConstraints,
      profileContext: {
        profileId: result.metadata.profileContext?.profileId,
        enhancementPolicy: result.metadata.profileContext?.enhancementPolicy,
        pipelineConfiguration: result.metadata.profileContext?.pipelineConfiguration
      }
    };
    
    expect(snapshot).toMatchSnapshot();
  });

  test('ugc_testimonial profile should produce consistent output', async () => {
    const profileId = 'ugc_testimonial';
    const result = await mergeProfileIntoManifest(mockManifest, profileId, null);
    
    const snapshot = {
      profileId: result.metadata.profileId,
      enforcementMode: result.metadata.enforcementMode,
      hardConstraints: result.metadata.hardConstraints,
      profileContext: {
        profileId: result.metadata.profileContext?.profileId,
        enhancementPolicy: result.metadata.profileContext?.enhancementPolicy,
        pipelineConfiguration: result.metadata.profileContext?.pipelineConfiguration
      }
    };
    
    expect(snapshot).toMatchSnapshot();
  });

  test('conflict resolution should produce consistent results', () => {
    const profileContext: ProfileContext = {
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
    };

    const hardConstraints: HardConstraints = {
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

    const snapshot = {
      warnings: result.warnings,
      resolvedManifest: {
        visuals: result.resolvedManifest.visuals,
        effects: result.resolvedManifest.effects,
        audio: result.resolvedManifest.audio
      }
    };

    expect(snapshot).toMatchSnapshot();
  });
});
