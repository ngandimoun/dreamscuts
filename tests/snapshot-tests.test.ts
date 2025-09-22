/**
 * Snapshot Tests for Profile-Pipeline Integration
 * 
 * These tests ensure that the profile-pipeline integration produces
 * consistent, deterministic output that can be validated against
 * known good snapshots.
 */

import { describe, test, expect } from '@jest/globals';
import { ProductionManifest, ProfileContext, HardConstraints } from '../types/production-manifest';
import { mergeProfileIntoManifest } from '../services/phase4/manifestBuilder';
import { resolveManifestConflicts } from '../lib/production-planner/conflict-resolution';
import { getFeatureFlagsForProfile } from '../lib/production-planner/feature-flags';

// Test data for snapshot tests
const snapshotTestManifest: ProductionManifest = {
  metadata: {
    manifestId: 'snapshot-test-123',
    version: '1.0.0',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    duration: 30,
    language: 'en',
    aspectRatio: '16:9',
    platform: 'youtube',
    title: 'Snapshot Test Video',
    description: 'Test video for snapshot validation'
  },
  scenes: [
    {
      id: 'scene_1',
      title: 'Test Scene',
      duration: 30,
      content: 'This is a test scene for snapshot validation.',
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
    colorPalette: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'],
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

describe('Snapshot Tests - Profile-Pipeline Integration', () => {
  describe('Educational Explainer Profile Snapshot', () => {
    test('should produce consistent educational profile output', async () => {
      const profileId = 'educational_explainer';
      const result = await mergeProfileIntoManifest(snapshotTestManifest, profileId, null);
      
      // Create snapshot of key properties
      const snapshot = {
        metadata: {
          profileId: result.metadata.profileId,
          profileVersion: result.metadata.profileVersion,
          enforcementMode: result.metadata.enforcementMode,
          hardConstraints: result.metadata.hardConstraints,
          profileContext: {
            profileId: result.metadata.profileContext?.profileId,
            profileName: result.metadata.profileContext?.profileName,
            coreConcept: result.metadata.profileContext?.coreConcept,
            visualApproach: result.metadata.profileContext?.visualApproach,
            styleDirection: result.metadata.profileContext?.styleDirection,
            moodGuidance: result.metadata.profileContext?.moodGuidance,
            enhancementPolicy: result.metadata.profileContext?.enhancementPolicy,
            pipelineConfiguration: result.metadata.profileContext?.pipelineConfiguration
          }
        },
        visuals: {
          colorPalette: result.visuals.colorPalette,
          fonts: result.visuals.fonts,
          style: result.visuals.style
        },
        effects: {
          allowed: result.effects.allowed,
          forbidden: result.effects.forbidden
        },
        audio: {
          ttsDefaults: result.audio.ttsDefaults,
          musicDefaults: result.audio.musicDefaults
        }
      };
      
      expect(snapshot).toMatchSnapshot();
    });

    test('should produce consistent educational feature flags', () => {
      const profileId = 'educational_explainer';
      const flags = getFeatureFlagsForProfile(profileId);
      
      const snapshot = {
        promptEnhancementMode: flags.promptEnhancementMode,
        enableWorkerEnhancements: flags.enableWorkerEnhancements,
        enableProfileOverrides: flags.enableProfileOverrides,
        enableCostCaps: flags.enableCostCaps,
        maxCostPerJob: flags.maxCostPerJob,
        maxTotalCost: flags.maxTotalCost,
        enableTimeoutCaps: flags.enableTimeoutCaps,
        maxJobTimeout: flags.maxJobTimeout,
        maxTotalTimeout: flags.maxTotalTimeout,
        enableQualityGates: flags.enableQualityGates,
        minQualityScore: flags.minQualityScore,
        maxRetries: flags.maxRetries
      };
      
      expect(snapshot).toMatchSnapshot();
    });
  });

  describe('UGC Testimonial Profile Snapshot', () => {
    test('should produce consistent UGC profile output', async () => {
      const profileId = 'ugc_testimonial';
      const result = await mergeProfileIntoManifest(snapshotTestManifest, profileId, null);
      
      // Create snapshot of key properties
      const snapshot = {
        metadata: {
          profileId: result.metadata.profileId,
          profileVersion: result.metadata.profileVersion,
          enforcementMode: result.metadata.enforcementMode,
          hardConstraints: result.metadata.hardConstraints,
          profileContext: {
            profileId: result.metadata.profileContext?.profileId,
            profileName: result.metadata.profileContext?.profileName,
            coreConcept: result.metadata.profileContext?.coreConcept,
            visualApproach: result.metadata.profileContext?.visualApproach,
            styleDirection: result.metadata.profileContext?.styleDirection,
            moodGuidance: result.metadata.profileContext?.moodGuidance,
            enhancementPolicy: result.metadata.profileContext?.enhancementPolicy,
            pipelineConfiguration: result.metadata.profileContext?.pipelineConfiguration
          }
        },
        visuals: {
          colorPalette: result.visuals.colorPalette,
          fonts: result.visuals.fonts,
          style: result.visuals.style
        },
        effects: {
          allowed: result.effects.allowed,
          forbidden: result.effects.forbidden
        },
        audio: {
          ttsDefaults: result.audio.ttsDefaults,
          musicDefaults: result.audio.musicDefaults
        }
      };
      
      expect(snapshot).toMatchSnapshot();
    });

    test('should produce consistent UGC feature flags', () => {
      const profileId = 'ugc_testimonial';
      const flags = getFeatureFlagsForProfile(profileId);
      
      const snapshot = {
        promptEnhancementMode: flags.promptEnhancementMode,
        enableWorkerEnhancements: flags.enableWorkerEnhancements,
        enableProfileOverrides: flags.enableProfileOverrides,
        enableCostCaps: flags.enableCostCaps,
        maxCostPerJob: flags.maxCostPerJob,
        maxTotalCost: flags.maxTotalCost,
        enableTimeoutCaps: flags.enableTimeoutCaps,
        maxJobTimeout: flags.maxJobTimeout,
        maxTotalTimeout: flags.maxTotalTimeout,
        enableQualityGates: flags.enableQualityGates,
        minQualityScore: flags.minQualityScore,
        maxRetries: flags.maxRetries
      };
      
      expect(snapshot).toMatchSnapshot();
    });
  });

  describe('Marketing Dynamic Profile Snapshot', () => {
    test('should produce consistent marketing profile output', async () => {
      const profileId = 'marketing_dynamic';
      const result = await mergeProfileIntoManifest(snapshotTestManifest, profileId, null);
      
      // Create snapshot of key properties
      const snapshot = {
        metadata: {
          profileId: result.metadata.profileId,
          profileVersion: result.metadata.profileVersion,
          enforcementMode: result.metadata.enforcementMode,
          hardConstraints: result.metadata.hardConstraints,
          profileContext: {
            profileId: result.metadata.profileContext?.profileId,
            profileName: result.metadata.profileContext?.profileName,
            coreConcept: result.metadata.profileContext?.coreConcept,
            visualApproach: result.metadata.profileContext?.visualApproach,
            styleDirection: result.metadata.profileContext?.styleDirection,
            moodGuidance: result.metadata.profileContext?.moodGuidance,
            enhancementPolicy: result.metadata.profileContext?.enhancementPolicy,
            pipelineConfiguration: result.metadata.profileContext?.pipelineConfiguration
          }
        },
        visuals: {
          colorPalette: result.visuals.colorPalette,
          fonts: result.visuals.fonts,
          style: result.visuals.style
        },
        effects: {
          allowed: result.effects.allowed,
          forbidden: result.effects.forbidden
        },
        audio: {
          ttsDefaults: result.audio.ttsDefaults,
          musicDefaults: result.audio.musicDefaults
        }
      };
      
      expect(snapshot).toMatchSnapshot();
    });

    test('should produce consistent marketing feature flags', () => {
      const profileId = 'marketing_dynamic';
      const flags = getFeatureFlagsForProfile(profileId);
      
      const snapshot = {
        promptEnhancementMode: flags.promptEnhancementMode,
        enableWorkerEnhancements: flags.enableWorkerEnhancements,
        enableProfileOverrides: flags.enableProfileOverrides,
        enableCostCaps: flags.enableCostCaps,
        maxCostPerJob: flags.maxCostPerJob,
        maxTotalCost: flags.maxTotalCost,
        enableTimeoutCaps: flags.enableTimeoutCaps,
        maxJobTimeout: flags.maxJobTimeout,
        maxTotalTimeout: flags.maxTotalTimeout,
        enableQualityGates: flags.enableQualityGates,
        minQualityScore: flags.minQualityScore,
        maxRetries: flags.maxRetries
      };
      
      expect(snapshot).toMatchSnapshot();
    });
  });

  describe('UGC Reaction Profile Snapshot', () => {
    test('should produce consistent UGC reaction profile output', async () => {
      const profileId = 'ugc_reaction';
      const result = await mergeProfileIntoManifest(snapshotTestManifest, profileId, null);
      
      // Create snapshot of key properties
      const snapshot = {
        metadata: {
          profileId: result.metadata.profileId,
          profileVersion: result.metadata.profileVersion,
          enforcementMode: result.metadata.enforcementMode,
          hardConstraints: result.metadata.hardConstraints,
          profileContext: {
            profileId: result.metadata.profileContext?.profileId,
            profileName: result.metadata.profileContext?.profileName,
            coreConcept: result.metadata.profileContext?.coreConcept,
            visualApproach: result.metadata.profileContext?.visualApproach,
            styleDirection: result.metadata.profileContext?.styleDirection,
            moodGuidance: result.metadata.profileContext?.moodGuidance,
            enhancementPolicy: result.metadata.profileContext?.enhancementPolicy,
            pipelineConfiguration: result.metadata.profileContext?.pipelineConfiguration
          }
        },
        visuals: {
          colorPalette: result.visuals.colorPalette,
          fonts: result.visuals.fonts,
          style: result.visuals.style
        },
        effects: {
          allowed: result.effects.allowed,
          forbidden: result.effects.forbidden
        },
        audio: {
          ttsDefaults: result.audio.ttsDefaults,
          musicDefaults: result.audio.musicDefaults
        }
      };
      
      expect(snapshot).toMatchSnapshot();
    });
  });

  describe('Cinematic Trailer Profile Snapshot', () => {
    test('should produce consistent cinematic trailer profile output', async () => {
      const profileId = 'cinematic_trailer';
      const result = await mergeProfileIntoManifest(snapshotTestManifest, profileId, null);
      
      // Create snapshot of key properties
      const snapshot = {
        metadata: {
          profileId: result.metadata.profileId,
          profileVersion: result.metadata.profileVersion,
          enforcementMode: result.metadata.enforcementMode,
          hardConstraints: result.metadata.hardConstraints,
          profileContext: {
            profileId: result.metadata.profileContext?.profileId,
            profileName: result.metadata.profileContext?.profileName,
            coreConcept: result.metadata.profileContext?.coreConcept,
            visualApproach: result.metadata.profileContext?.visualApproach,
            styleDirection: result.metadata.profileContext?.styleDirection,
            moodGuidance: result.metadata.profileContext?.moodGuidance,
            enhancementPolicy: result.metadata.profileContext?.enhancementPolicy,
            pipelineConfiguration: result.metadata.profileContext?.pipelineConfiguration
          }
        },
        visuals: {
          colorPalette: result.visuals.colorPalette,
          fonts: result.visuals.fonts,
          style: result.visuals.style
        },
        effects: {
          allowed: result.effects.allowed,
          forbidden: result.effects.forbidden
        },
        audio: {
          ttsDefaults: result.audio.ttsDefaults,
          musicDefaults: result.audio.musicDefaults
        }
      };
      
      expect(snapshot).toMatchSnapshot();
    });
  });

  describe('Conflict Resolution Snapshot', () => {
    test('should produce consistent conflict resolution output', () => {
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
        snapshotTestManifest,
        profileContext,
        hardConstraints,
        'strict'
      );

      const snapshot = {
        warnings: result.warnings,
        resolvedManifest: {
          visuals: {
            colorPalette: result.resolvedManifest.visuals.colorPalette,
            fonts: result.resolvedManifest.visuals.fonts,
            style: result.resolvedManifest.visuals.style
          },
          effects: {
            allowed: result.resolvedManifest.effects.allowed,
            forbidden: result.resolvedManifest.effects.forbidden
          },
          audio: {
            ttsDefaults: result.resolvedManifest.audio.ttsDefaults,
            musicDefaults: result.resolvedManifest.audio.musicDefaults
          }
        }
      };

      expect(snapshot).toMatchSnapshot();
    });
  });

  describe('UI Override Snapshot', () => {
    test('should produce consistent UI override output', async () => {
      const profileId = 'educational_explainer';
      const uiInput = {
        profileId: 'marketing_dynamic',
        enforcementMode: 'creative' as const
      };
      
      const result = await mergeProfileIntoManifest(snapshotTestManifest, profileId, uiInput);
      
      // Create snapshot of key properties
      const snapshot = {
        metadata: {
          profileId: result.metadata.profileId,
          profileVersion: result.metadata.profileVersion,
          enforcementMode: result.metadata.enforcementMode,
          hardConstraints: result.metadata.hardConstraints,
          profileContext: {
            profileId: result.metadata.profileContext?.profileId,
            profileName: result.metadata.profileContext?.profileName,
            coreConcept: result.metadata.profileContext?.coreConcept,
            visualApproach: result.metadata.profileContext?.visualApproach,
            styleDirection: result.metadata.profileContext?.styleDirection,
            moodGuidance: result.metadata.profileContext?.moodGuidance,
            enhancementPolicy: result.metadata.profileContext?.enhancementPolicy,
            pipelineConfiguration: result.metadata.profileContext?.pipelineConfiguration
          }
        },
        visuals: {
          colorPalette: result.visuals.colorPalette,
          fonts: result.visuals.fonts,
          style: result.visuals.style
        },
        effects: {
          allowed: result.effects.allowed,
          forbidden: result.effects.forbidden
        },
        audio: {
          ttsDefaults: result.audio.ttsDefaults,
          musicDefaults: result.audio.musicDefaults
        }
      };
      
      expect(snapshot).toMatchSnapshot();
    });
  });
});
