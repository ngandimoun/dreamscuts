// services/phase4/autoCalculateTimings.test.ts
import { autoCalculateSceneTimings } from './deterministicParser';
import { ProductionManifest } from '../../types/production-manifest';

describe("autoCalculateSceneTimings", () => {
  it("should auto-calculate startAtSec for scenes with missing timings", () => {
    const manifest: ProductionManifest = {
      id: "test-manifest",
      createdAt: new Date().toISOString(),
      userId: "user-123",
      sourceRefs: {
        analyzerRef: null,
        refinerRef: null,
        scriptRef: null,
      },
      metadata: {
        intent: "video",
        durationSeconds: 60,
        aspectRatio: "16:9",
        platform: "youtube",
        language: "en",
        profile: "educational_explainer",
        priority: "normal",
        note: "Test manifest",
      },
      scenes: [
        {
          id: "s1",
          startAtSec: 0, // Already set
          durationSeconds: 8,
          purpose: "hook",
          visualAnchor: undefined,
          visuals: [],
          narration: "Welcome to the future of education.",
          subtitles: [],
          tts: null,
          musicCue: null,
          effects: { transitions: ["fade_in"] },
          orderingHint: 0,
          notes: undefined,
        },
        {
          id: "s2",
          startAtSec: undefined as any, // Missing - should be auto-calculated
          durationSeconds: 45,
          purpose: "body",
          visualAnchor: undefined,
          visuals: [],
          narration: "Learn anytime, anywhere.",
          subtitles: [],
          tts: null,
          musicCue: null,
          effects: { transitions: ["dissolve_in"] },
          orderingHint: 1,
          notes: undefined,
        },
        {
          id: "s3",
          startAtSec: -1, // Invalid - should be auto-calculated
          durationSeconds: 7,
          purpose: "cta",
          visualAnchor: undefined,
          visuals: [],
          narration: "Join us today.",
          subtitles: [],
          tts: null,
          musicCue: null,
          effects: { transitions: ["fade_out"] },
          orderingHint: 2,
          notes: undefined,
        },
      ],
      assets: {},
      audio: {
        ttsDefaults: {
          provider: "elevenlabs",
          voiceId: "eva",
          style: "instructional",
          stability: 0.7,
          similarityBoost: 0.5,
          sampleRate: 22050,
          format: "mp3",
        },
        music: { cueMap: {}, globalVolumeDuckToVoices: true },
        sfx: [],
      },
      visuals: {
        defaultAspect: "16:9",
        colorPalette: ["#0F172A", "#3B82F6"],
        fonts: { primary: "Inter", secondary: "Roboto" },
      },
      effects: {
        allowed: ["cinematic_zoom", "overlay_text", "bokeh_transition"],
        defaultTransition: "fade",
        perScene: {},
      },
      consistency: {
        character_faces: "locked",
        voice_style: "consistent",
        tone: "professional",
        visual_continuity: "maintain",
        brand: { colors: [] },
      },
      jobs: [],
      qualityGate: {
        durationCompliance: true,
        requiredAssetsReady: false,
      },
      warnings: [],
    };

    const result = autoCalculateSceneTimings(manifest);

    // Scene 1: startAtSec should remain 0 (already set)
    expect(result.scenes[0].startAtSec).toBe(0);
    expect(result.scenes[0].durationSeconds).toBe(8);

    // Scene 2: startAtSec should be auto-calculated to 8 (0 + 8)
    expect(result.scenes[1].startAtSec).toBe(8);
    expect(result.scenes[1].durationSeconds).toBe(45);

    // Scene 3: startAtSec should be auto-calculated to 53 (8 + 45)
    expect(result.scenes[2].startAtSec).toBe(53);
    expect(result.scenes[2].durationSeconds).toBe(7);

    // Total duration should be 60 seconds (0 + 8 + 45 + 7)
    const totalDuration = result.scenes[result.scenes.length - 1].startAtSec + 
                         result.scenes[result.scenes.length - 1].durationSeconds;
    expect(totalDuration).toBe(60);
  });

  it("should handle scenes with invalid durationSeconds", () => {
    const manifest: ProductionManifest = {
      id: "test-manifest",
      createdAt: new Date().toISOString(),
      userId: "user-123",
      sourceRefs: {
        analyzerRef: null,
        refinerRef: null,
        scriptRef: null,
      },
      metadata: {
        intent: "video",
        durationSeconds: 10,
        aspectRatio: "16:9",
        platform: "youtube",
        language: "en",
        profile: "educational_explainer",
        priority: "normal",
        note: "Test manifest",
      },
      scenes: [
        {
          id: "s1",
          startAtSec: 0,
          durationSeconds: 0, // Invalid - should be set to 1
          purpose: "hook",
          visualAnchor: undefined,
          visuals: [],
          narration: "Test scene 1.",
          subtitles: [],
          tts: null,
          musicCue: null,
          effects: { transitions: [] },
          orderingHint: 0,
          notes: undefined,
        },
        {
          id: "s2",
          startAtSec: undefined as any,
          durationSeconds: -5, // Invalid - should be set to 1
          purpose: "body",
          visualAnchor: undefined,
          visuals: [],
          narration: "Test scene 2.",
          subtitles: [],
          tts: null,
          musicCue: null,
          effects: { transitions: [] },
          orderingHint: 1,
          notes: undefined,
        },
      ],
      assets: {},
      audio: {
        ttsDefaults: {
          provider: "elevenlabs",
          voiceId: "eva",
          style: "instructional",
          stability: 0.7,
          similarityBoost: 0.5,
          sampleRate: 22050,
          format: "mp3",
        },
        music: { cueMap: {}, globalVolumeDuckToVoices: true },
        sfx: [],
      },
      visuals: {
        defaultAspect: "16:9",
        colorPalette: ["#0F172A", "#3B82F6"],
        fonts: { primary: "Inter", secondary: "Roboto" },
      },
      effects: {
        allowed: ["cinematic_zoom", "overlay_text", "bokeh_transition"],
        defaultTransition: "fade",
        perScene: {},
      },
      consistency: {
        character_faces: "locked",
        voice_style: "consistent",
        tone: "professional",
        visual_continuity: "maintain",
        brand: { colors: [] },
      },
      jobs: [],
      qualityGate: {
        durationCompliance: true,
        requiredAssetsReady: false,
      },
      warnings: [],
    };

    const result = autoCalculateSceneTimings(manifest);

    // Scene 1: duration should be corrected to 1
    expect(result.scenes[0].startAtSec).toBe(0);
    expect(result.scenes[0].durationSeconds).toBe(1);

    // Scene 2: startAtSec should be 1, duration should be corrected to 1
    expect(result.scenes[1].startAtSec).toBe(1);
    expect(result.scenes[1].durationSeconds).toBe(1);
  });

  it("should preserve existing valid startAtSec values", () => {
    const manifest: ProductionManifest = {
      id: "test-manifest",
      createdAt: new Date().toISOString(),
      userId: "user-123",
      sourceRefs: {
        analyzerRef: null,
        refinerRef: null,
        scriptRef: null,
      },
      metadata: {
        intent: "video",
        durationSeconds: 20,
        aspectRatio: "16:9",
        platform: "youtube",
        language: "en",
        profile: "educational_explainer",
        priority: "normal",
        note: "Test manifest",
      },
      scenes: [
        {
          id: "s1",
          startAtSec: 0,
          durationSeconds: 5,
          purpose: "hook",
          visualAnchor: undefined,
          visuals: [],
          narration: "Test scene 1.",
          subtitles: [],
          tts: null,
          musicCue: null,
          effects: { transitions: [] },
          orderingHint: 0,
          notes: undefined,
        },
        {
          id: "s2",
          startAtSec: 10, // Explicitly set to 10 (not sequential)
          durationSeconds: 8,
          purpose: "body",
          visualAnchor: undefined,
          visuals: [],
          narration: "Test scene 2.",
          subtitles: [],
          tts: null,
          musicCue: null,
          effects: { transitions: [] },
          orderingHint: 1,
          notes: undefined,
        },
      ],
      assets: {},
      audio: {
        ttsDefaults: {
          provider: "elevenlabs",
          voiceId: "eva",
          style: "instructional",
          stability: 0.7,
          similarityBoost: 0.5,
          sampleRate: 22050,
          format: "mp3",
        },
        music: { cueMap: {}, globalVolumeDuckToVoices: true },
        sfx: [],
      },
      visuals: {
        defaultAspect: "16:9",
        colorPalette: ["#0F172A", "#3B82F6"],
        fonts: { primary: "Inter", secondary: "Roboto" },
      },
      effects: {
        allowed: ["cinematic_zoom", "overlay_text", "bokeh_transition"],
        defaultTransition: "fade",
        perScene: {},
      },
      consistency: {
        character_faces: "locked",
        voice_style: "consistent",
        tone: "professional",
        visual_continuity: "maintain",
        brand: { colors: [] },
      },
      jobs: [],
      qualityGate: {
        durationCompliance: true,
        requiredAssetsReady: false,
      },
      warnings: [],
    };

    const result = autoCalculateSceneTimings(manifest);

    // Scene 1: should remain unchanged
    expect(result.scenes[0].startAtSec).toBe(0);
    expect(result.scenes[0].durationSeconds).toBe(5);

    // Scene 2: should preserve the explicitly set startAtSec of 10
    expect(result.scenes[1].startAtSec).toBe(10);
    expect(result.scenes[1].durationSeconds).toBe(8);
  });

  it("should handle empty scenes array", () => {
    const manifest: ProductionManifest = {
      id: "test-manifest",
      createdAt: new Date().toISOString(),
      userId: "user-123",
      sourceRefs: {
        analyzerRef: null,
        refinerRef: null,
        scriptRef: null,
      },
      metadata: {
        intent: "video",
        durationSeconds: 10,
        aspectRatio: "16:9",
        platform: "youtube",
        language: "en",
        profile: "educational_explainer",
        priority: "normal",
        note: "Test manifest",
      },
      scenes: [], // Empty scenes array
      assets: {},
      audio: {
        ttsDefaults: {
          provider: "elevenlabs",
          voiceId: "eva",
          style: "instructional",
          stability: 0.7,
          similarityBoost: 0.5,
          sampleRate: 22050,
          format: "mp3",
        },
        music: { cueMap: {}, globalVolumeDuckToVoices: true },
        sfx: [],
      },
      visuals: {
        defaultAspect: "16:9",
        colorPalette: ["#0F172A", "#3B82F6"],
        fonts: { primary: "Inter", secondary: "Roboto" },
      },
      effects: {
        allowed: ["cinematic_zoom", "overlay_text", "bokeh_transition"],
        defaultTransition: "fade",
        perScene: {},
      },
      consistency: {
        character_faces: "locked",
        voice_style: "consistent",
        tone: "professional",
        visual_continuity: "maintain",
        brand: { colors: [] },
      },
      jobs: [],
      qualityGate: {
        durationCompliance: true,
        requiredAssetsReady: false,
      },
      warnings: [],
    };

    const result = autoCalculateSceneTimings(manifest);

    // Should return the manifest unchanged
    expect(result.scenes).toEqual([]);
    expect(result.id).toBe("test-manifest");
  });
});
