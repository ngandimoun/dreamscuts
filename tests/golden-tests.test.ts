/**
 * Golden Tests for Profile-Pipeline Integration
 * 
 * These tests serve as "golden tests" that validate the complete workflow
 * from profile selection through job decomposition to worker execution.
 * They ensure that the system produces consistent, expected results for
 * common use cases.
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { ProductionManifest, ProfileContext, HardConstraints } from '../types/production-manifest';
import { mergeProfileIntoManifest } from '../services/phase4/manifestBuilder';
import { decomposeJobs } from '../services/phase4/decomposeJobs';
import { resolveManifestConflicts } from '../lib/production-planner/conflict-resolution';
import { getFeatureFlagsForProfile } from '../lib/production-planner/feature-flags';

// Test data for different scenarios
const educationalManifest: ProductionManifest = {
  metadata: {
    manifestId: 'educational-test-123',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    duration: 60,
    language: 'en',
    aspectRatio: '16:9',
    platform: 'youtube',
    title: 'How to Use Our Product',
    description: 'Educational tutorial on product usage'
  },
  scenes: [
    {
      id: 'scene_1',
      title: 'Introduction',
      duration: 15,
      content: 'Welcome to this educational tutorial. Today we will learn how to use our product effectively.',
      visualElements: [],
      audioElements: [],
      effects: []
    },
    {
      id: 'scene_2',
      title: 'Step 1: Setup',
      duration: 20,
      content: 'First, you need to set up your account and configure your preferences.',
      visualElements: [],
      audioElements: [],
      effects: []
    },
    {
      id: 'scene_3',
      title: 'Step 2: Usage',
      duration: 25,
      content: 'Now let\'s walk through the main features and how to use them effectively.',
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
    colorPalette: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'],
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

const ugcManifest: ProductionManifest = {
  metadata: {
    manifestId: 'ugc-test-456',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    duration: 30,
    language: 'en',
    aspectRatio: '9:16',
    platform: 'tiktok',
    title: 'My Experience with This Product',
    description: 'Honest review and testimonial'
  },
  scenes: [
    {
      id: 'scene_1',
      title: 'Personal Story',
      duration: 30,
      content: 'Hey everyone! I just had to share my experience with this amazing product. It literally changed my life!',
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
    allowed: ['fade', 'slide', 'zoom'],
    forbidden: []
  },
  audio: {
    ttsDefaults: {
      voiceId: 'casual_female',
      style: 'conversational'
    },
    musicDefaults: {
      genre: 'upbeat',
      intensity: 0.6
    }
  }
};

const marketingManifest: ProductionManifest = {
  metadata: {
    manifestId: 'marketing-test-789',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    duration: 45,
    language: 'en',
    aspectRatio: '16:9',
    platform: 'youtube',
    title: 'Revolutionary New Product Launch',
    description: 'Dynamic marketing video showcasing new product features'
  },
  scenes: [
    {
      id: 'scene_1',
      title: 'Hook',
      duration: 10,
      content: 'Are you ready for something revolutionary? This product will change everything you know!',
      visualElements: [],
      audioElements: [],
      effects: []
    },
    {
      id: 'scene_2',
      title: 'Features',
      duration: 25,
      content: 'Let\'s explore the amazing features that make this product stand out from the competition.',
      visualElements: [],
      audioElements: [],
      effects: []
    },
    {
      id: 'scene_3',
      title: 'Call to Action',
      duration: 10,
      content: 'Don\'t wait! Get your hands on this incredible product today and transform your life!',
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
      voiceId: 'energetic_male',
      style: 'dramatic'
    },
    musicDefaults: {
      genre: 'upbeat',
      intensity: 0.9
    }
  }
};

describe('Golden Tests - Profile-Pipeline Integration', () => {
  beforeEach(() => {
    // Reset any mocks or state
  });

  describe('Educational Explainer Profile', () => {
    test('should produce consistent educational content with strict constraints', async () => {
      const profileId = 'educational_explainer';
      const result = await mergeProfileIntoManifest(educationalManifest, profileId, null);
      
      // Verify profile context
      expect(result.metadata.profileId).toBe('educational_explainer');
      expect(result.metadata.profileContext?.coreConcept).toBe('Clear, educational content');
      expect(result.metadata.profileContext?.visualApproach).toBe('Minimalist, clean design');
      expect(result.metadata.profileContext?.enhancementPolicy).toBe('additive');
      
      // Verify hard constraints
      expect(result.metadata.hardConstraints?.style?.visualStyle).toBe('minimalist');
      expect(result.metadata.hardConstraints?.audioStyle?.tone).toBe('professional');
      expect(result.metadata.hardConstraints?.audioStyle?.voiceStyle).toBe('clear');
      
      // Verify constraints were applied
      expect(result.audio.ttsDefaults.style).toBe('clear'); // Clamped from 'dramatic'
      expect(result.effects.allowed).not.toContain('dramatic'); // Filtered out
      expect(result.effects.allowed).not.toContain('cinematic_zoom'); // Filtered out
      
      // Verify color palette was constrained
      const allowedColors = result.metadata.hardConstraints?.style?.palette || [];
      result.visuals.colorPalette.forEach(color => {
        expect(allowedColors).toContain(color);
      });
      
      // Verify feature flags
      const flags = getFeatureFlagsForProfile(profileId);
      expect(flags.promptEnhancementMode).toBe('strict');
      expect(flags.maxCostPerJob).toBe(0.50);
      expect(flags.maxTotalCost).toBe(5.00);
    });

    test('should decompose into appropriate jobs for educational content', async () => {
      const profileId = 'educational_explainer';
      const manifestWithProfile = await mergeProfileIntoManifest(educationalManifest, profileId, null);
      const jobs = decomposeJobs(manifestWithProfile);
      
      // Should have TTS jobs for each scene
      const ttsJobs = jobs.filter(job => job.type === 'gen_tts_elevenlabs');
      expect(ttsJobs.length).toBe(3); // One for each scene
      
      // Should have image generation jobs
      const imageJobs = jobs.filter(job => job.type === 'gen_image_falai');
      expect(imageJobs.length).toBeGreaterThan(0);
      
      // Should have video generation jobs
      const videoJobs = jobs.filter(job => job.type === 'gen_video_falai');
      expect(videoJobs.length).toBeGreaterThan(0);
      
      // Should have render job
      const renderJobs = jobs.filter(job => job.type === 'render_shotstack');
      expect(renderJobs.length).toBe(1);
      
      // Verify job payloads have profile context
      jobs.forEach(job => {
        expect(job.payload.profileContext).toBeDefined();
        expect(job.payload.hardConstraints).toBeDefined();
        expect(job.payload.enforcementMode).toBe('strict');
        expect(job.payload.enhancementPolicy).toBe('additive');
      });
    });
  });

  describe('UGC Testimonial Profile', () => {
    test('should produce consistent UGC content with balanced constraints', async () => {
      const profileId = 'ugc_testimonial';
      const result = await mergeProfileIntoManifest(ugcManifest, profileId, null);
      
      // Verify profile context
      expect(result.metadata.profileId).toBe('ugc_testimonial');
      expect(result.metadata.profileContext?.coreConcept).toBe('Authentic, personal testimonial');
      expect(result.metadata.profileContext?.visualApproach).toBe('Handheld, authentic look');
      expect(result.metadata.profileContext?.enhancementPolicy).toBe('additive');
      
      // Verify hard constraints
      expect(result.metadata.hardConstraints?.style?.visualStyle).toBe('handheld');
      expect(result.metadata.hardConstraints?.audioStyle?.tone).toBe('casual');
      expect(result.metadata.hardConstraints?.audioStyle?.voiceStyle).toBe('conversational');
      
      // Verify constraints were applied
      expect(result.audio.ttsDefaults.style).toBe('conversational'); // Clamped from 'conversational'
      expect(result.metadata.aspectRatio).toBe('9:16'); // Should match UGC profile
      expect(result.metadata.platform).toBe('tiktok'); // Should match UGC profile
      
      // Verify feature flags
      const flags = getFeatureFlagsForProfile(profileId);
      expect(flags.promptEnhancementMode).toBe('balanced');
      expect(flags.maxCostPerJob).toBe(0.30);
      expect(flags.maxTotalCost).toBe(3.00);
    });

    test('should decompose into appropriate jobs for UGC content', async () => {
      const profileId = 'ugc_testimonial';
      const manifestWithProfile = await mergeProfileIntoManifest(ugcManifest, profileId, null);
      const jobs = decomposeJobs(manifestWithProfile);
      
      // Should have TTS job
      const ttsJobs = jobs.filter(job => job.type === 'gen_tts_elevenlabs');
      expect(ttsJobs.length).toBe(1);
      
      // Should have image generation job
      const imageJobs = jobs.filter(job => job.type === 'gen_image_falai');
      expect(imageJobs.length).toBe(1);
      
      // Should have video generation job
      const videoJobs = jobs.filter(job => job.type === 'gen_video_falai');
      expect(videoJobs.length).toBe(1);
      
      // Should have render job
      const renderJobs = jobs.filter(job => job.type === 'render_shotstack');
      expect(renderJobs.length).toBe(1);
      
      // Verify job payloads have profile context
      jobs.forEach(job => {
        expect(job.payload.profileContext).toBeDefined();
        expect(job.payload.hardConstraints).toBeDefined();
        expect(job.payload.enforcementMode).toBe('balanced');
        expect(job.payload.enhancementPolicy).toBe('additive');
      });
    });
  });

  describe('Marketing Dynamic Profile', () => {
    test('should produce consistent marketing content with creative constraints', async () => {
      const profileId = 'marketing_dynamic';
      const result = await mergeProfileIntoManifest(marketingManifest, profileId, null);
      
      // Verify profile context
      expect(result.metadata.profileId).toBe('marketing_dynamic');
      expect(result.metadata.profileContext?.coreConcept).toBe('Dynamic, engaging marketing content');
      expect(result.metadata.profileContext?.visualApproach).toBe('High-impact, professional design');
      expect(result.metadata.profileContext?.enhancementPolicy).toBe('additive');
      
      // Verify hard constraints
      expect(result.metadata.hardConstraints?.style?.visualStyle).toBe('cinematic');
      expect(result.metadata.hardConstraints?.audioStyle?.tone).toBe('energetic');
      expect(result.metadata.hardConstraints?.audioStyle?.voiceStyle).toBe('dramatic');
      
      // Verify constraints were applied
      expect(result.audio.ttsDefaults.style).toBe('dramatic'); // Should match
      expect(result.metadata.aspectRatio).toBe('16:9'); // Should match marketing profile
      expect(result.metadata.platform).toBe('youtube'); // Should match marketing profile
      
      // Verify feature flags
      const flags = getFeatureFlagsForProfile(profileId);
      expect(flags.promptEnhancementMode).toBe('creative');
      expect(flags.maxCostPerJob).toBe(1.00);
      expect(flags.maxTotalCost).toBe(10.00);
    });

    test('should decompose into appropriate jobs for marketing content', async () => {
      const profileId = 'marketing_dynamic';
      const manifestWithProfile = await mergeProfileIntoManifest(marketingManifest, profileId, null);
      const jobs = decomposeJobs(manifestWithProfile);
      
      // Should have TTS jobs for each scene
      const ttsJobs = jobs.filter(job => job.type === 'gen_tts_elevenlabs');
      expect(ttsJobs.length).toBe(3); // One for each scene
      
      // Should have image generation jobs
      const imageJobs = jobs.filter(job => job.type === 'gen_image_falai');
      expect(imageJobs.length).toBeGreaterThan(0);
      
      // Should have video generation jobs
      const videoJobs = jobs.filter(job => job.type === 'gen_video_falai');
      expect(videoJobs.length).toBeGreaterThan(0);
      
      // Should have render job
      const renderJobs = jobs.filter(job => job.type === 'render_shotstack');
      expect(renderJobs.length).toBe(1);
      
      // Verify job payloads have profile context
      jobs.forEach(job => {
        expect(job.payload.profileContext).toBeDefined();
        expect(job.payload.hardConstraints).toBeDefined();
        expect(job.payload.enforcementMode).toBe('creative');
        expect(job.payload.enhancementPolicy).toBe('additive');
      });
    });
  });

  describe('End-to-End Workflow Tests', () => {
    test('should complete full educational workflow', async () => {
      const profileId = 'educational_explainer';
      
      // Step 1: Profile merge
      const manifestWithProfile = await mergeProfileIntoManifest(educationalManifest, profileId, null);
      
      // Step 2: Conflict resolution
      const resolvedManifest = resolveManifestConflicts(
        manifestWithProfile,
        manifestWithProfile.metadata.profileContext!,
        manifestWithProfile.metadata.hardConstraints!,
        manifestWithProfile.metadata.enforcementMode!
      );
      
      // Step 3: Job decomposition
      const jobs = decomposeJobs(resolvedManifest.resolvedManifest);
      
      // Step 4: Feature flag validation
      const flags = getFeatureFlagsForProfile(profileId);
      
      // Verify complete workflow
      expect(manifestWithProfile.metadata.profileId).toBe('educational_explainer');
      expect(resolvedManifest.resolvedManifest.metadata.profileContext).toBeDefined();
      expect(jobs.length).toBeGreaterThan(0);
      expect(flags.promptEnhancementMode).toBe('strict');
      
      // Verify all jobs have proper context
      jobs.forEach(job => {
        expect(job.payload.profileContext).toBeDefined();
        expect(job.payload.hardConstraints).toBeDefined();
        expect(job.payload.enforcementMode).toBe('strict');
        expect(job.payload.enhancementPolicy).toBe('additive');
      });
    });

    test('should complete full UGC workflow', async () => {
      const profileId = 'ugc_testimonial';
      
      // Step 1: Profile merge
      const manifestWithProfile = await mergeProfileIntoManifest(ugcManifest, profileId, null);
      
      // Step 2: Conflict resolution
      const resolvedManifest = resolveManifestConflicts(
        manifestWithProfile,
        manifestWithProfile.metadata.profileContext!,
        manifestWithProfile.metadata.hardConstraints!,
        manifestWithProfile.metadata.enforcementMode!
      );
      
      // Step 3: Job decomposition
      const jobs = decomposeJobs(resolvedManifest.resolvedManifest);
      
      // Step 4: Feature flag validation
      const flags = getFeatureFlagsForProfile(profileId);
      
      // Verify complete workflow
      expect(manifestWithProfile.metadata.profileId).toBe('ugc_testimonial');
      expect(resolvedManifest.resolvedManifest.metadata.profileContext).toBeDefined();
      expect(jobs.length).toBeGreaterThan(0);
      expect(flags.promptEnhancementMode).toBe('balanced');
      
      // Verify all jobs have proper context
      jobs.forEach(job => {
        expect(job.payload.profileContext).toBeDefined();
        expect(job.payload.hardConstraints).toBeDefined();
        expect(job.payload.enforcementMode).toBe('balanced');
        expect(job.payload.enhancementPolicy).toBe('additive');
      });
    });

    test('should complete full marketing workflow', async () => {
      const profileId = 'marketing_dynamic';
      
      // Step 1: Profile merge
      const manifestWithProfile = await mergeProfileIntoManifest(marketingManifest, profileId, null);
      
      // Step 2: Conflict resolution
      const resolvedManifest = resolveManifestConflicts(
        manifestWithProfile,
        manifestWithProfile.metadata.profileContext!,
        manifestWithProfile.metadata.hardConstraints!,
        manifestWithProfile.metadata.enforcementMode!
      );
      
      // Step 3: Job decomposition
      const jobs = decomposeJobs(resolvedManifest.resolvedManifest);
      
      // Step 4: Feature flag validation
      const flags = getFeatureFlagsForProfile(profileId);
      
      // Verify complete workflow
      expect(manifestWithProfile.metadata.profileId).toBe('marketing_dynamic');
      expect(resolvedManifest.resolvedManifest.metadata.profileContext).toBeDefined();
      expect(jobs.length).toBeGreaterThan(0);
      expect(flags.promptEnhancementMode).toBe('creative');
      
      // Verify all jobs have proper context
      jobs.forEach(job => {
        expect(job.payload.profileContext).toBeDefined();
        expect(job.payload.hardConstraints).toBeDefined();
        expect(job.payload.enforcementMode).toBe('creative');
        expect(job.payload.enhancementPolicy).toBe('additive');
      });
    });
  });

  describe('Constraint Enforcement Tests', () => {
    test('should enforce educational constraints strictly', async () => {
      const profileId = 'educational_explainer';
      const result = await mergeProfileIntoManifest(educationalManifest, profileId, null);
      
      // Verify strict enforcement
      expect(result.metadata.enforcementMode).toBe('strict');
      
      // Verify constraints were applied
      expect(result.audio.ttsDefaults.style).toBe('clear'); // Clamped from 'dramatic'
      expect(result.effects.allowed).not.toContain('dramatic'); // Filtered out
      expect(result.effects.allowed).not.toContain('cinematic_zoom'); // Filtered out
      
      // Verify color palette was constrained
      const allowedColors = result.metadata.hardConstraints?.style?.palette || [];
      result.visuals.colorPalette.forEach(color => {
        expect(allowedColors).toContain(color);
      });
    });

    test('should enforce UGC constraints in balanced mode', async () => {
      const profileId = 'ugc_testimonial';
      const result = await mergeProfileIntoManifest(ugcManifest, profileId, null);
      
      // Verify balanced enforcement
      expect(result.metadata.enforcementMode).toBe('balanced');
      
      // Verify constraints were applied
      expect(result.audio.ttsDefaults.style).toBe('conversational'); // Should match
      expect(result.metadata.aspectRatio).toBe('9:16'); // Should match UGC profile
      expect(result.metadata.platform).toBe('tiktok'); // Should match UGC profile
    });

    test('should enforce marketing constraints in creative mode', async () => {
      const profileId = 'marketing_dynamic';
      const result = await mergeProfileIntoManifest(marketingManifest, profileId, null);
      
      // Verify creative enforcement
      expect(result.metadata.enforcementMode).toBe('creative');
      
      // Verify constraints were applied
      expect(result.audio.ttsDefaults.style).toBe('dramatic'); // Should match
      expect(result.metadata.aspectRatio).toBe('16:9'); // Should match marketing profile
      expect(result.metadata.platform).toBe('youtube'); // Should match marketing profile
    });
  });
});
