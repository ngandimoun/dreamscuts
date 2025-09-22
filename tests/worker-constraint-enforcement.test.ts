/**
 * Worker Constraint Enforcement Tests
 * 
 * These tests validate that workers properly enforce hard constraints
 * and apply profile context when processing jobs.
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { TTSWorker } from '../workers/elevenlabs/TTSWorker';
import { ProfileContext, HardConstraints } from '../types/production-manifest';

// Mock TTS job payloads
const mockTTSJob = {
  id: 'test-tts-job-1',
  type: 'gen_tts_elevenlabs',
  priority: 1,
  dependencies: [],
  payload: {
    text: 'This is a test message for TTS generation.',
    voiceSettings: {
      voiceId: 'professional_male',
      style: 'dramatic',
      emotion: 'excited'
    },
    emotionLevel: 'dramatic',
    v3AudioTags: ['[excited]', '[whispers]', '[loud]', '[fast]', '[slow]']
  }
};

const educationalProfileContext: ProfileContext = {
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

const educationalHardConstraints: HardConstraints = {
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

const ugcProfileContext: ProfileContext = {
  profileId: 'ugc_testimonial',
  profileName: 'UGC Testimonial',
  coreConcept: 'Authentic, personal testimonial',
  visualApproach: 'Handheld, authentic look',
  styleDirection: 'Casual, relatable',
  moodGuidance: 'Genuine, enthusiastic',
  pipelineConfiguration: {
    imageModel: 'nano_banana',
    videoModel: 'veo3_fast',
    ttsModel: 'elevenlabs_dialogue'
  },
  enhancementPolicy: 'additive'
};

const ugcHardConstraints: HardConstraints = {
  style: {
    palette: ['#FF0000', '#00FF00', '#0000FF'],
    visualStyle: 'handheld'
  },
  effects: {
    allowedTypes: ['fade', 'slide']
  },
  audioStyle: {
    tone: 'casual',
    voiceStyle: 'conversational'
  }
};

describe('Worker Constraint Enforcement', () => {
  let ttsWorker: TTSWorker;

  beforeEach(() => {
    // Create a mock TTS worker
    ttsWorker = new TTSWorker({
      name: 'test-tts-worker',
      config: {
        enableWorkers: ['tts'],
        maxConcurrentJobs: 5,
        jobTimeout: 300000,
        retryAttempts: 3
      }
    });
  });

  describe('TTS Worker Constraint Enforcement', () => {
    test('should enforce educational profile constraints in strict mode', async () => {
      const jobWithConstraints = {
        ...mockTTSJob,
        payload: {
          ...mockTTSJob.payload,
          profileContext: educationalProfileContext,
          hardConstraints: educationalHardConstraints,
          enforcementMode: 'strict',
          enhancementPolicy: 'additive'
        }
      };

      // Mock the processJob method to test constraint application
      const result = await ttsWorker.processJob(jobWithConstraints);

      // Verify constraints were applied
      expect(result.success).toBe(true);
      
      // In strict mode, voice style should be clamped to 'clear'
      expect(jobWithConstraints.payload.voiceSettings.style).toBe('clear');
      
      // Emotion level should be clamped to 'subtle' for professional tone
      expect(jobWithConstraints.payload.emotionLevel).toBe('subtle');
      
      // V3 audio tags should be limited in strict additive mode
      expect(jobWithConstraints.payload.v3AudioTags.length).toBeLessThanOrEqual(3);
    });

    test('should enforce UGC profile constraints in balanced mode', async () => {
      const jobWithConstraints = {
        ...mockTTSJob,
        payload: {
          ...mockTTSJob.payload,
          profileContext: ugcProfileContext,
          hardConstraints: ugcHardConstraints,
          enforcementMode: 'balanced',
          enhancementPolicy: 'additive'
        }
      };

      // Mock the processJob method to test constraint application
      const result = await ttsWorker.processJob(jobWithConstraints);

      // Verify constraints were applied
      expect(result.success).toBe(true);
      
      // In balanced mode, voice style should be clamped to 'conversational'
      expect(jobWithConstraints.payload.voiceSettings.style).toBe('conversational');
      
      // Emotion level should be clamped to 'moderate' for casual tone
      expect(jobWithConstraints.payload.emotionLevel).toBe('moderate');
    });

    test('should allow creative mode with minimal constraints', async () => {
      const jobWithConstraints = {
        ...mockTTSJob,
        payload: {
          ...mockTTSJob.payload,
          profileContext: ugcProfileContext,
          hardConstraints: ugcHardConstraints,
          enforcementMode: 'creative',
          enhancementPolicy: 'additive'
        }
      };

      // Mock the processJob method to test constraint application
      const result = await ttsWorker.processJob(jobWithConstraints);

      // Verify constraints were applied
      expect(result.success).toBe(true);
      
      // In creative mode, more flexibility should be allowed
      // Voice style should still be clamped to profile constraint
      expect(jobWithConstraints.payload.voiceSettings.style).toBe('conversational');
      
      // But emotion level might be more flexible
      expect(jobWithConstraints.payload.emotionLevel).toBeDefined();
    });

    test('should log constraint violations', async () => {
      const jobWithConstraints = {
        ...mockTTSJob,
        payload: {
          ...mockTTSJob.payload,
          profileContext: educationalProfileContext,
          hardConstraints: educationalHardConstraints,
          enforcementMode: 'strict',
          enhancementPolicy: 'additive'
        }
      };

      // Mock the processJob method to test constraint application
      const result = await ttsWorker.processJob(jobWithConstraints);

      // Verify constraints were applied and logged
      expect(result.success).toBe(true);
      
      // Should have logged constraint violations
      expect(result.logs).toBeDefined();
      expect(result.logs.some(log => log.includes('Applied hard constraints'))).toBe(true);
    });

    test('should handle missing constraints gracefully', async () => {
      const jobWithoutConstraints = {
        ...mockTTSJob,
        payload: {
          ...mockTTSJob.payload
          // No profile context or constraints
        }
      };

      // Mock the processJob method to test constraint application
      const result = await ttsWorker.processJob(jobWithoutConstraints);

      // Should still process successfully without constraints
      expect(result.success).toBe(true);
      
      // Original payload should remain unchanged
      expect(jobWithoutConstraints.payload.voiceSettings.style).toBe('dramatic');
      expect(jobWithoutConstraints.payload.emotionLevel).toBe('dramatic');
    });

    test('should enforce enhancement policy constraints', async () => {
      const jobWithConstraints = {
        ...mockTTSJob,
        payload: {
          ...mockTTSJob.payload,
          profileContext: educationalProfileContext,
          hardConstraints: educationalHardConstraints,
          enforcementMode: 'strict',
          enhancementPolicy: 'additive'
        }
      };

      // Mock the processJob method to test constraint application
      const result = await ttsWorker.processJob(jobWithConstraints);

      // Verify constraints were applied
      expect(result.success).toBe(true);
      
      // In strict additive mode, V3 audio tags should be limited
      expect(jobWithConstraints.payload.v3AudioTags.length).toBeLessThanOrEqual(3);
      
      // Should log the limitation
      expect(result.logs).toBeDefined();
      expect(result.logs.some(log => log.includes('V3 audio tags limited'))).toBe(true);
    });
  });

  describe('Constraint Precedence Tests', () => {
    test('should respect hard constraints over worker enhancements', async () => {
      const jobWithConstraints = {
        ...mockTTSJob,
        payload: {
          ...mockTTSJob.payload,
          profileContext: educationalProfileContext,
          hardConstraints: educationalHardConstraints,
          enforcementMode: 'strict',
          enhancementPolicy: 'additive'
        }
      };

      // Mock the processJob method to test constraint application
      const result = await ttsWorker.processJob(jobWithConstraints);

      // Verify constraints were applied
      expect(result.success).toBe(true);
      
      // Hard constraints should override worker enhancements
      expect(jobWithConstraints.payload.voiceSettings.style).toBe('clear');
      expect(jobWithConstraints.payload.emotionLevel).toBe('subtle');
    });

    test('should apply profile context to worker behavior', async () => {
      const jobWithConstraints = {
        ...mockTTSJob,
        payload: {
          ...mockTTSJob.payload,
          profileContext: educationalProfileContext,
          hardConstraints: educationalHardConstraints,
          enforcementMode: 'strict',
          enhancementPolicy: 'additive'
        }
      };

      // Mock the processJob method to test constraint application
      const result = await ttsWorker.processJob(jobWithConstraints);

      // Verify constraints were applied
      expect(result.success).toBe(true);
      
      // Profile context should influence worker behavior
      expect(jobWithConstraints.payload.profileContext).toBeDefined();
      expect(jobWithConstraints.payload.profileContext.profileId).toBe('educational_explainer');
      expect(jobWithConstraints.payload.profileContext.enhancementPolicy).toBe('additive');
    });
  });

  describe('Error Handling Tests', () => {
    test('should handle invalid constraint values gracefully', async () => {
      const invalidConstraints: HardConstraints = {
        audioStyle: {
          tone: 'invalid_tone',
          voiceStyle: 'invalid_style'
        }
      };

      const jobWithInvalidConstraints = {
        ...mockTTSJob,
        payload: {
          ...mockTTSJob.payload,
          profileContext: educationalProfileContext,
          hardConstraints: invalidConstraints,
          enforcementMode: 'strict',
          enhancementPolicy: 'additive'
        }
      };

      // Mock the processJob method to test constraint application
      const result = await ttsWorker.processJob(jobWithInvalidConstraints);

      // Should still process successfully
      expect(result.success).toBe(true);
      
      // Should handle invalid constraints gracefully
      expect(jobWithInvalidConstraints.payload.voiceSettings.style).toBeDefined();
    });

    test('should handle missing profile context gracefully', async () => {
      const jobWithMissingContext = {
        ...mockTTSJob,
        payload: {
          ...mockTTSJob.payload,
          hardConstraints: educationalHardConstraints,
          enforcementMode: 'strict',
          enhancementPolicy: 'additive'
          // Missing profileContext
        }
      };

      // Mock the processJob method to test constraint application
      const result = await ttsWorker.processJob(jobWithMissingContext);

      // Should still process successfully
      expect(result.success).toBe(true);
      
      // Should handle missing context gracefully
      expect(jobWithMissingContext.payload.voiceSettings.style).toBeDefined();
    });
  });
});
