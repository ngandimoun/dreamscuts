/**
 * Jest Setup for Profile-Pipeline Integration Tests
 */

import { jest } from '@jest/globals';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.PROMPT_ENHANCEMENT_MODE = 'balanced';
process.env.ENABLE_WORKER_ENHANCEMENTS = 'true';
process.env.ENABLE_PROFILE_OVERRIDES = 'true';
process.env.ENABLE_COST_CAPS = 'true';
process.env.MAX_COST_PER_JOB = '1.00';
process.env.MAX_TOTAL_COST = '10.00';
process.env.ENABLE_TIMEOUT_CAPS = 'true';
process.env.MAX_JOB_TIMEOUT = '600';
process.env.MAX_TOTAL_TIMEOUT = '3600';
process.env.ENABLE_QUALITY_GATES = 'true';
process.env.MIN_QUALITY_SCORE = '0.3';
process.env.MAX_RETRIES = '3';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Mock Date.now for consistent timestamps
const mockDate = new Date('2024-01-01T00:00:00.000Z');
jest.spyOn(Date, 'now').mockReturnValue(mockDate.getTime());
jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-01-01T00:00:00.000Z');

// Mock UUID generation for consistent IDs
jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'test-uuid-123')
}));

// Mock file system operations
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
  access: jest.fn(),
  mkdir: jest.fn()
}));

// Mock Supabase operations
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      })),
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      update: jest.fn(() => Promise.resolve({ data: null, error: null })),
      delete: jest.fn(() => Promise.resolve({ data: null, error: null }))
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(() => Promise.resolve({ data: null, error: null })),
        download: jest.fn(() => Promise.resolve({ data: null, error: null })),
        getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'https://example.com/test.jpg' } }))
      }))
    }
  }))
}));

// Mock external API calls
jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: { success: true } })),
  get: jest.fn(() => Promise.resolve({ data: { success: true } }))
}));

// Mock worker operations
jest.mock('../workers/elevenlabs/TTSWorker', () => ({
  TTSWorker: jest.fn().mockImplementation(() => ({
    processJob: jest.fn(() => Promise.resolve({
      success: true,
      logs: ['Applied hard constraints to TTS job']
    }))
  }))
}));

// Global test utilities
global.testUtils = {
  createMockManifest: () => ({
    metadata: {
      manifestId: 'test-manifest-123',
      version: '1.0.0',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      duration: 30,
      language: 'en',
      aspectRatio: '16:9',
      platform: 'youtube',
      title: 'Test Video',
      description: 'Test description'
    },
    scenes: [],
    jobs: [],
    assets: { images: [], audio: [], video: [] },
    visuals: {
      colorPalette: ['#FF0000', '#00FF00', '#0000FF'],
      fonts: { primary: 'Arial', secondary: 'Helvetica' },
      style: 'modern'
    },
    effects: { allowed: ['fade', 'slide'], forbidden: [] },
    audio: {
      ttsDefaults: { voiceId: 'professional_male', style: 'clear' },
      musicDefaults: { genre: 'upbeat', intensity: 0.5 }
    }
  }),
  
  createMockProfileContext: (profileId: string) => ({
    profileId,
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
    enhancementPolicy: 'additive' as const
  }),
  
  createMockHardConstraints: () => ({
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
  })
};

// Setup global error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
