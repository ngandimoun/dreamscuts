// services/phase4/mockExecutors.ts
// Mock implementations for testing the Phase 4 pipeline

export async function executeGPT4oMini(params: {
  prompt: string;
  max_completion_tokens?: number;
  temperature?: number;
  response_format?: { type: string };
}): Promise<{ text: string }> {
  // Mock GPT-4o-mini response - returns a simple JSON structure
  const mockResponse = {
    metadata: {
      intent: "video",
      durationSeconds: 5,
      aspectRatio: "16:9",
      platform: "youtube",
      language: "en",
      profile: "educational_explainer"
    },
    scenes: [
      {
        id: "s1",
        durationSeconds: 2,
        purpose: "hook",
        narration: "Step one: pick footage.",
        effects: { layeredEffects: ["fade_in", "gentle_zoom"] },
        visuals: []
      },
      {
        id: "s2", 
        durationSeconds: 2,
        purpose: "body",
        narration: "Step two: add data.",
        effects: { layeredEffects: ["dissolve_in"] },
        visuals: []
      },
      {
        id: "s3",
        durationSeconds: 1,
        purpose: "cta", 
        narration: "Step three: publish confidently.",
        effects: { layeredEffects: ["fade_out"] },
        visuals: []
      }
    ],
    assets: {},
    audio: {
      ttsDefaults: { provider: "elevenlabs" },
      music: { cueMap: {} }
    },
    consistency: {}
  };

  return { text: JSON.stringify(mockResponse) };
}

export async function executeGPT5(params: {
  prompt: string;
  reasoning_effort?: string;
  verbosity?: string;
  max_completion_tokens?: number;
  temperature?: number;
  response_format?: { type: string };
}): Promise<{ text: string }> {
  // Mock GPT-5 repair response - returns a repaired version of the input
  // In a real implementation, this would parse the prompt and repair the JSON
  const mockRepairedResponse = {
    id: "manifest-123",
    createdAt: new Date().toISOString(),
    userId: "user-123",
    sourceRefs: {
      analyzerRef: null,
      refinerRef: null,
      scriptRef: null
    },
    metadata: {
      intent: "video",
      durationSeconds: 5,
      aspectRatio: "16:9",
      platform: "youtube",
      language: "en",
      profile: "educational_explainer",
      priority: "normal",
      note: "Repaired by GPT-5"
    },
    scenes: [
      {
        id: "s1",
        startAtSec: 0,
        durationSeconds: 2,
        purpose: "hook",
        visualAnchor: undefined,
        visuals: [],
        narration: "Step one: pick footage.",
        subtitles: [],
        tts: null,
        musicCue: null,
        effects: { transitions: ["fade_in", "gentle_zoom"] },
        orderingHint: 0,
        notes: undefined
      },
      {
        id: "s2",
        startAtSec: 2,
        durationSeconds: 2,
        purpose: "body", 
        visualAnchor: undefined,
        visuals: [],
        narration: "Step two: add data.",
        subtitles: [],
        tts: null,
        musicCue: null,
        effects: { transitions: ["dissolve_in"] },
        orderingHint: 1,
        notes: undefined
      },
      {
        id: "s3",
        startAtSec: 4,
        durationSeconds: 1,
        purpose: "cta",
        visualAnchor: undefined,
        visuals: [],
        narration: "Step three: publish confidently.",
        subtitles: [],
        tts: null,
        musicCue: null,
        effects: { transitions: ["fade_out"] },
        orderingHint: 2,
        notes: undefined
      }
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
        format: "mp3"
      },
      music: {
        cueMap: {
          music_01: {
            id: "music_01",
            startSec: 0,
            durationSec: 5,
            mood: "neutral_learning",
            structure: "intro",
            instructions: "soft marimba/pads, low percussion"
          }
        },
        globalVolumeDuckToVoices: true
      },
      sfx: []
    },
    visuals: {
      defaultAspect: "16:9",
      colorPalette: ["#0F172A", "#3B82F6"],
      fonts: { primary: "Inter", secondary: "Roboto" }
    },
    effects: {
      allowed: ["cinematic_zoom", "overlay_text", "bokeh_transition"],
      defaultTransition: "fade",
      perScene: {}
    },
    consistency: {
      character_faces: "locked",
      voice_style: "consistent",
      tone: "professional",
      visual_continuity: "maintain",
      brand: { colors: [] }
    },
    jobs: [
      {
        id: "job_tts_s1",
        type: "tts",
        payload: {
          sceneId: "s1",
          text: "Step one: pick footage.",
          provider: "elevenlabs",
          voiceId: "eva",
          style: "instructional",
          format: "mp3",
          sampleRate: 22050
        },
        priority: 10
      },
      {
        id: "job_tts_s2", 
        type: "tts",
        payload: {
          sceneId: "s2",
          text: "Step two: add data.",
          provider: "elevenlabs",
          voiceId: "eva",
          style: "instructional",
          format: "mp3",
          sampleRate: 22050
        },
        priority: 10
      },
      {
        id: "job_tts_s3",
        type: "tts", 
        payload: {
          sceneId: "s3",
          text: "Step three: publish confidently.",
          provider: "elevenlabs",
          voiceId: "eva",
          style: "instructional",
          format: "mp3",
          sampleRate: 22050
        },
        priority: 10
      },
      {
        id: "job_render_shotstack",
        type: "render_shotstack",
        payload: {
          manifestId: "manifest-123",
          shotstackJson: {},
          callbackUrl: null
        },
        dependsOn: ["job_tts_s1", "job_tts_s2", "job_tts_s3"],
        priority: 12
      }
    ],
    qualityGate: {
      durationCompliance: true,
      requiredAssetsReady: false
    },
    warnings: []
  };

  return { text: JSON.stringify(mockRepairedResponse) };
}
