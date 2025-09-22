// validators/production-manifest.ts
import { z } from "zod";

export const TTSConfigZ = z.object({
  provider: z.literal("elevenlabs"),
  voiceId: z.string().optional(),
  style: z.string().optional(),
  stability: z.number().min(0).max(1).optional(),
  similarityBoost: z.number().min(0).max(1).optional(),
  sampleRate: z.number().optional(),
  format: z.enum(["mp3","wav"]).optional()
});

export const SceneVisualZ = z.object({
  type: z.enum(["user","generated"]),
  assetId: z.string(),
  transform: z.object({
    scale: z.number().optional(),
    crop: z.object({ x: z.number(), y: z.number(), w: z.number(), h: z.number() }).optional(),
    angle: z.number().optional()
  }).optional(),
  shot: z.object({
    camera: z.enum(["static","push","pull","pan","tilt"]).optional(),
    focal: z.enum(["tight","mid","wide"]).optional()
  }).optional(),
  overlays: z.array(z.any()).optional()
});

export const ScenePlanZ = z.object({
  id: z.string(),
  startAtSec: z.number().min(0),
  durationSeconds: z.number().min(0.05),
  purpose: z.string(),
  narration: z.string().optional(),
  language: z.string().optional(),
  tts: TTSConfigZ.optional().nullable(),
  musicCue: z.string().optional().nullable(),
  visualAnchor: z.string().optional(),
  visuals: z.array(SceneVisualZ).min(1),
  multiShot: z.array(z.any()).optional(),
  effects: z.any().optional(),
  subtitles: z.array(z.any()).optional(),
  charts: z.array(z.any()).optional()
});

export const ProductionManifestZ = z.object({
  userId: z.string().nullable(),
  sourceRefs: z.object({
    analyzerRef: z.string().optional(),
    refinerRef: z.string().optional(),
    scriptRef: z.string().optional()
  }).optional(),
  metadata: z.object({
    intent: z.enum(["video","image","audio"]),
    durationSeconds: z.number().min(1),
    aspectRatio: z.string(),
    platform: z.string(),
    language: z.string(),
    profile: z.string().optional(),
    priority: z.enum(["low","normal","high"]).optional(),
    voiceGender: z.string().optional(),
    cinematicLevel: z.enum(["basic","pro"]).optional()
  }),
  scenes: z.array(ScenePlanZ).min(1),
  assets: z.record(z.any()),
  audio: z.object({
    ttsDefaults: TTSConfigZ,
    narrationMap: z.record(TTSConfigZ).optional(),
    music: z.record(z.any())
  }),
  visuals: z.any(),
  effects: z.any(),
  consistency: z.any(),
  jobs: z.array(z.object({ id: z.string(), type: z.string(), payload: z.record(z.any()) }))
});
