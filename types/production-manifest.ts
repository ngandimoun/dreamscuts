// types/production-manifest.ts
export type UUID = string;
export type ISODate = string; // "2025-09-21T12:34:56.000Z"

export interface ProductionManifest {
  id?: UUID; // server-generated
  createdAt?: ISODate;
  userId: UUID | null;
  sourceRefs: {
    analyzerRef?: string;
    refinerRef?: string;
    scriptRef?: string;
  };
  metadata: ManifestMetadata;
  scenes: ScenePlan[];
  assets: Record<string, AssetPlan>;
  audio: AudioPlan;
  visuals: VisualPlan;
  effects: EffectsPlan;
  consistency: ConsistencyRules;
  jobs: JobPlan[]; // deterministic tasks workers consume
  qualityGate?: QualityGate;
  warnings?: string[];
}

/* ---------- Metadata ---------- */
export interface ManifestMetadata {
  intent: "video" | "image" | "audio";
  durationSeconds: number;            // total runtime (must equal sum scenes)
  aspectRatio: string;                // "16:9", "9:16", "Smart Auto"
  platform: string;                   // "tiktok","instagram","youtube","social"
  language: string;                   // e.g., "en" or "en-US"
  profile?: string;                   // creative profile (anime_mode, etc.)
  priority?: "low" | "normal" | "high";
  voiceGender?: "male" | "female" | "neutral" | "auto";
  cinematicLevel?: "basic" | "pro";
  note?: string;
}

/* ---------- Scenes ---------- */
export interface ScenePlan {
  id: string;                         // scene_s1
  startAtSec: number;                 // absolute
  durationSeconds: number;
  purpose: "hook" | "body" | "cta" | string;
  narration?: string;                 // final text for TTS
  language?: string;                  // per-scene override
  tts?: TTSConfig | null;
  musicCue?: string | null;           // key into audio.music.cueMap
  visualAnchor?: string;              // assetId prioritized for the scene
  visuals: SceneVisual[];             // list ordered by layering
  multiShot?: ShotVariation[];        // OPTIONAL auto-gen shots for cinematicLevel=pro
  effects?: SceneEffects;
  subtitles?: SubtitleSpec[];         // optional precomputed
  charts?: ChartPlan[];               // optional data visuals
  notes?: string;
}

/* Scene visuals and shots */
export interface SceneVisual {
  type: "user" | "generated";         // NO stock allowed in Phase1 (enforced)
  assetId: string;                    // maps to assets[assetId]
  transform?: {
    scale?: number;
    crop?: { x: number; y: number; w: number; h: number };
    angle?: number;
  };
  shot?: {
    camera?: "static" | "push" | "pull" | "pan" | "tilt";
    focal?: "tight" | "mid" | "wide";
  };
  overlays?: OverlaySpec[];
}

export interface ShotVariation {
  shotId: string;
  camera: "static" | "push" | "pull" | "pan" | "tilt";
  focal: "tight" | "mid" | "wide";
  description?: string;
}

export interface OverlaySpec {
  type: "text" | "kpi" | "chart" | "logo" | "lower_third";
  params: Record<string, any>;
  animate?: string; // "slide_in","fade","bokeh_transition","cinematic_zoom"
}

export interface SubtitleSpec {
  text: string;
  start: number;
  end: number;
}

/* Charts */
export interface ChartPlan {
  id: string;
  type: "bar" | "line" | "pie" | "table" | "custom";
  prompt: string; // used by gpt-image or chart generator
  resultAssetId?: string; // will be populated after generation
}

/* ---------- Assets ---------- */
export interface AssetPlan {
  id: string;
  source: "user" | "generated";       // phase1 forbids "stock"
  originUrl?: string;                 // user URL
  mimeType?: string;
  role: "primary" | "reference" | "background" | "graphic";
  width?: number;
  height?: number;
  durationSeconds?: number;           // for video
  meta?: Record<string, any>;
  requiredEdits?: string[];           // e.g., ["upscale-2x","style-transfer:educational"]
  status?: "pending" | "processing" | "ready" | "failed";
}

/* ---------- Audio ---------- */
export interface AudioPlan {
  ttsDefaults: TTSConfig;
  narrationMap?: Record<string, TTSConfig>; // sceneId -> override
  music: {
    cueMap: Record<string, MusicCue>;
    duckToVoice?: boolean;
  };
  sfx?: SfxPlan[];
}

export interface TTSConfig {
  provider: "elevenlabs";
  voiceId?: string;
  style?: string;           // e.g., "confident","friendly"
  stability?: number;       // 0..1
  similarityBoost?: number; // 0..1
  sampleRate?: 22050 | 44100;
  format?: "mp3" | "wav";
}

export interface MusicCue {
  id: string;
  startSec: number;
  durationSec?: number;
  mood: string;             // "neutral_learning","uplift",...
  structure?: "intro" | "build" | "climax" | "outro";
  instructions?: string;
}

export interface SfxPlan {
  id: string;
  cue: string;              // "whoosh","click","chime"
  sceneId: string;
  startAt: number;
}

/* ---------- Visuals & Effects ---------- */
export interface VisualPlan {
  defaultAspect: string;
  colorPalette?: string[]; // hex
  fonts?: { primary?: string; secondary?: string };
  imagePipeline?: "text-to-image-then-video"; // fixed rule in Phase1
}

export interface EffectsPlan {
  allowed: string[]; // e.g., ["cinematic_zoom","parallax_scroll","bokeh_transition"]
  defaultTransition?: string;
  perScene?: Record<string, SceneEffects>;
}

export interface SceneEffects {
  transitions?: string[];      // in/out
  layeredEffects?: string[];   // cinematic_zoom etc.
  gradePreset?: string;        // "neutral_pro"
}

/* ---------- Consistency ---------- */
export interface ConsistencyRules {
  character_faces?: "locked" | "vary";
  voice_style?: "consistent" | "vary";
  tone?: string;
  visual_continuity?: "maintain" | "relaxed";
  brand?: { colors?: string[]; logoAssetId?: string; font?: string };
  enforceTextToImageToVideo?: boolean; // Phase1: true
}

/* ---------- Jobs ---------- */
export interface JobPlan {
  id: string;
  type:
    | "gen_image_falai"
    | "enhance_image_falai"
    | "gen_video_falai"
    | "tts_elevenlabs"
    | "gen_music_elevenlabs"
    | "lip_sync_lypsso"
    | "generate_chart_gptimage"
    | "render_shotstack";
  payload: Record<string, any>;
  dependsOn?: string[];
  priority?: number;
  retryPolicy?: { maxRetries?: number; backoffSeconds?: number };
}

/* ---------- QA ---------- */
export interface QualityGate {
  durationCompliance: boolean;
  requiredAssetsReady: boolean;
  manifestScore?: number; // 0..1
}
