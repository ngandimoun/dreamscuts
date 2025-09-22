// tests/phase4.test.ts
// Phase 4 Unit Tests

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { parseTreatmentDeterministically } from '../services/phase4/deterministicParser';
import { decomposeJobs } from '../services/phase4/decomposeJobs';
import { runDeterministicRepair, validateManifest } from '../services/phase4/validationRepair';
import { ProductionManifest } from '../types/production-manifest';

// Mock the executors
jest.mock('../executors/gpt-4o-mini', () => ({
  executeGPT4oMini: jest.fn(),
}));

jest.mock('../executors/gpt-5', () => ({
  executeGPT5: jest.fn(),
}));

describe('Phase 4: Deterministic Parser', () => {
  const mockContext = {
    totalDurationSeconds: 60,
    profile: 'educational_explainer',
    language: 'en',
    aspectRatio: '16:9',
    platform: 'social',
    tone: 'professional',
    userId: 'test-user-123',
  };

  it('should parse treatment text with scene headings', () => {
    const treatmentText = `# Production Plan: Test Video

## Scenes
### Scene 1: [Purpose: Hook]
- Duration: 20 sec
- Narration: "Welcome to our tutorial."
- Visuals: laptop footage

### Scene 2: [Purpose: Body]
- Duration: 30 sec
- Narration: "Here's how it works."
- Visuals: chart overlay

### Scene 3: [Purpose: CTA]
- Duration: 10 sec
- Narration: "Get started today."
- Visuals: end card`;

    const result = parseTreatmentDeterministically(treatmentText, mockContext);

    expect(result.title).toBe('Test Video');
    expect(result.scenes).toHaveLength(3);
    expect(result.scenes[0].title).toBe('Hook');
    expect(result.scenes[0].narration).toBe('Welcome to our tutorial.');
    expect(result.scenes[1].title).toBe('Body');
    expect(result.scenes[2].title).toBe('CTA');
  });

  it('should extract effects from scene blocks', () => {
    const treatmentText = `### Scene 1: [Purpose: Hook]
- Effects: [cinematic_zoom, fade_in]
- Narration: "Test narration"`;

    const result = parseTreatmentDeterministically(treatmentText, mockContext);

    expect(result.scenes[0].effects).toContain('cinematic_zoom');
    expect(result.scenes[0].effects).toContain('fade_in');
  });

  it('should handle missing durations with default weights', () => {
    const treatmentText = `### Scene 1: [Purpose: Hook]
- Narration: "First scene"

### Scene 2: [Purpose: Body]
- Narration: "Second scene"`;

    const result = parseTreatmentDeterministically(treatmentText, mockContext);

    expect(result.scenes).toHaveLength(2);
    expect(result.scenes[0].durationWeight).toBeGreaterThan(0);
    expect(result.scenes[1].durationWeight).toBeGreaterThan(0);
  });

  it('should extract voice preferences', () => {
    const treatmentText = `# Production Plan: Test
- Voice: [ElevenLabs / Style: Friendly Female]`;

    const result = parseTreatmentDeterministically(treatmentText, mockContext);

    expect(result.voice.gender).toBe('female');
    expect(result.voice.voiceIdHint).toContain('Friendly Female');
  });
});

describe('Phase 4: Job Decomposition', () => {
  const mockManifest: ProductionManifest = {
    userId: 'test-user',
    sourceRefs: {
      analyzerRef: 'analyzer-123',
      refinerRef: 'refiner-456',
      scriptRef: 'script-789',
    },
    metadata: {
      intent: 'video',
      durationSeconds: 60,
      aspectRatio: '16:9',
      platform: 'social',
      language: 'en',
      profile: 'educational_explainer',
    },
    scenes: [
      {
        id: 's1',
        startAtSec: 0,
        durationSeconds: 20,
        purpose: 'hook',
        narration: 'Welcome to our tutorial.',
        visuals: [
          {
            type: 'generated',
            assetId: 'gen_img_001',
            role: 'background',
          },
        ],
        effects: {
          transitions: ['fade'],
          overlays: [],
          filters: [],
        },
      },
      {
        id: 's2',
        startAtSec: 20,
        durationSeconds: 30,
        purpose: 'body',
        narration: 'Here is how it works.',
        visuals: [
          {
            type: 'generated',
            assetId: 'gen_chart_001',
            role: 'overlay',
          },
        ],
        effects: {
          transitions: ['dissolve'],
          overlays: [],
          filters: [],
        },
      },
    ],
    assets: {
      'gen_img_001': {
        id: 'gen_img_001',
        source: 'generated',
        role: 'background',
        status: 'pending',
        requiredEdits: [],
      },
      'gen_chart_001': {
        id: 'gen_chart_001',
        source: 'generated',
        role: 'overlay',
        status: 'pending',
        requiredEdits: [],
      },
    },
    audio: {
      ttsDefaults: {
        provider: 'elevenlabs',
        voiceId: 'eva',
        format: 'mp3',
        stability: 0.7,
      },
      music: {
        cueMap: {},
        globalVolumeDuckToVoices: true,
      },
    },
    visuals: {
      defaultAspect: '16:9',
    },
    effects: {
      allowed: ['fade', 'dissolve'],
      defaultTransition: 'fade',
    },
    consistency: {
      character_faces: 'locked',
      voice_style: 'consistent',
      tone: 'professional',
    },
    jobs: [],
    warnings: [],
  };

  it('should create TTS jobs for scenes with narration', () => {
    const jobs = decomposeJobs(mockManifest);

    const ttsJobs = jobs.filter(job => job.type === 'tts');
    expect(ttsJobs).toHaveLength(2);
    expect(ttsJobs[0].payload.sceneId).toBe('s1');
    expect(ttsJobs[0].payload.text).toBe('Welcome to our tutorial.');
    expect(ttsJobs[1].payload.sceneId).toBe('s2');
    expect(ttsJobs[1].payload.text).toBe('Here is how it works.');
  });

  it('should create asset generation jobs for generated visuals', () => {
    const jobs = decomposeJobs(mockManifest);

    const assetJobs = jobs.filter(job => job.type === 'generate_image');
    expect(assetJobs).toHaveLength(2);
    expect(assetJobs[0].payload.resultAssetId).toBe('gen_img_001');
    expect(assetJobs[1].payload.resultAssetId).toBe('gen_chart_001');
  });

  it('should create render job with proper dependencies', () => {
    const jobs = decomposeJobs(mockManifest);

    const renderJob = jobs.find(job => job.type === 'render_shotstack');
    expect(renderJob).toBeDefined();
    expect(renderJob!.dependsOn.length).toBeGreaterThan(0);
    
    // Should depend on TTS and asset generation jobs
    const ttsJobIds = jobs.filter(job => job.type === 'tts').map(job => job.id);
    const assetJobIds = jobs.filter(job => job.type === 'generate_image').map(job => job.id);
    
    ttsJobIds.forEach(id => expect(renderJob!.dependsOn).toContain(id));
    assetJobIds.forEach(id => expect(renderJob!.dependsOn).toContain(id));
  });

  it('should set proper job priorities', () => {
    const jobs = decomposeJobs(mockManifest);

    const ttsJobs = jobs.filter(job => job.type === 'tts');
    const assetJobs = jobs.filter(job => job.type === 'generate_image');
    const renderJob = jobs.find(job => job.type === 'render_shotstack');

    expect(ttsJobs[0].priority).toBe(10);
    expect(assetJobs[0].priority).toBe(10);
    expect(renderJob!.priority).toBe(12);
  });
});

describe('Phase 4: Validation and Repair', () => {
  it('should validate a complete manifest', () => {
    const validManifest: ProductionManifest = {
      userId: 'test-user',
      sourceRefs: {
        analyzerRef: 'analyzer-123',
        refinerRef: 'refiner-456',
        scriptRef: 'script-789',
      },
      metadata: {
        intent: 'video',
        durationSeconds: 60,
        aspectRatio: '16:9',
        platform: 'social',
        language: 'en',
        profile: 'educational_explainer',
      },
      scenes: [
        {
          id: 's1',
          startAtSec: 0,
          durationSeconds: 60,
          purpose: 'content',
          visuals: [],
          effects: {
            transitions: [],
            overlays: [],
            filters: [],
          },
        },
      ],
      assets: {},
      audio: {
        ttsDefaults: {
          provider: 'elevenlabs',
          voiceId: 'eva',
          format: 'mp3',
          stability: 0.7,
        },
        music: {
          cueMap: {},
          globalVolumeDuckToVoices: true,
        },
      },
      visuals: {
        defaultAspect: '16:9',
      },
      effects: {
        allowed: ['fade'],
        defaultTransition: 'fade',
      },
      consistency: {
        character_faces: 'locked',
        voice_style: 'consistent',
        tone: 'professional',
      },
      jobs: [],
      warnings: [],
    };

    const validation = validateManifest(validManifest);
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('should repair missing required fields', () => {
    const incompleteManifest = {
      userId: 'test-user',
      scenes: [
        {
          id: 's1',
          startAtSec: 0,
          durationSeconds: 60,
          purpose: 'content',
          visuals: [],
          effects: {
            transitions: [],
            overlays: [],
            filters: [],
          },
        },
      ],
      assets: {},
    } as any;

    const repaired = runDeterministicRepair(incompleteManifest, []);
    
    expect(repaired.metadata.intent).toBe('video');
    expect(repaired.metadata.language).toBe('en');
    expect(repaired.metadata.durationSeconds).toBe(60);
    expect(repaired.audio.ttsDefaults).toBeDefined();
    expect(repaired.visuals).toBeDefined();
    expect(repaired.effects).toBeDefined();
    expect(repaired.consistency).toBeDefined();
  });

  it('should adjust scene durations to match total duration', () => {
    const manifestWithWrongDurations = {
      userId: 'test-user',
      metadata: {
        durationSeconds: 60,
      },
      scenes: [
        {
          id: 's1',
          startAtSec: 0,
          durationSeconds: 30,
          purpose: 'content',
          visuals: [],
          effects: { transitions: [], overlays: [], filters: [] },
        },
        {
          id: 's2',
          startAtSec: 30,
          durationSeconds: 20,
          purpose: 'content',
          visuals: [],
          effects: { transitions: [], overlays: [], filters: [] },
        },
      ],
      assets: {},
    } as any;

    const repaired = runDeterministicRepair(manifestWithWrongDurations, []);
    
    const totalSceneDuration = repaired.scenes.reduce((sum: number, scene: any) => sum + scene.durationSeconds, 0);
    expect(Math.abs(totalSceneDuration - 60)).toBeLessThan(0.1);
  });
});

describe('Phase 4: Integration Tests', () => {
  it('should handle end-to-end manifest creation', () => {
    const treatmentText = `# Production Plan: Integration Test

### Scene 1: [Purpose: Hook]
- Duration: 20 sec
- Narration: "Welcome to our test."
- Visuals: test footage
- Effects: [fade_in]

### Scene 2: [Purpose: Body]
- Duration: 30 sec
- Narration: "This is the main content."
- Visuals: chart data
- Effects: [dissolve]`;

    const context = {
      totalDurationSeconds: 50,
      profile: 'educational_explainer',
      language: 'en',
      aspectRatio: '16:9',
      platform: 'social',
      tone: 'professional',
      userId: 'test-user',
    };

    // Parse treatment
    const extracted = parseTreatmentDeterministically(treatmentText, context);
    
    expect(extracted.title).toBe('Integration Test');
    expect(extracted.scenes).toHaveLength(2);
    expect(extracted.scenes[0].narration).toBe('Welcome to our test.');
    expect(extracted.scenes[1].narration).toBe('This is the main content.');
  });
});
