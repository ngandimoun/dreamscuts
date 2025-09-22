// services/phase4/manifestBuilder.ts
/**
 * Phase 4 — Production Manifest Builder
 *
 * Responsibilities:
 *  - Normalize inputs (duration, language, aspect)
 *  - Extract structured intermediate from treatment (LLM optional)
 *  - Deterministic parser fallback (pure TS)
 *  - Build ProductionManifest (types from ../types/production-manifest)
 *  - AJV validate against production-manifest.schema.json
 *  - Try deterministic repairs, then (optionally) call GPT-based repair
 *  - Deterministically decompose jobs
 *  - Return sanitized, validated manifest (or minimal fallback)
 *
 *  Important: LLMs are helpers. Deterministic parser/builder + AJV are the real gatekeepers.
 */

import Ajv, { ErrorObject } from "ajv";
import addFormats from "ajv-formats";
// Simple UUID v4 generator
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

import manifestSchema from "../../validators/production-manifest.schema.json";
// adjust the path to your types location
import {
  ProductionManifest,
  ScenePlan,
  MusicCue,
  AssetPlan,
  JobPlan,
  TTSConfig,
} from "../../types/production-manifest";
import { callExtractorLLM } from './extractor';
import { callGptRepair } from './repair';
import { autoCalculateSceneTimings } from './deterministicParser';
import { decomposeJobs } from './decomposeJobs';
import { parseHumanPlanToDraftManifest as enhancedParseHumanPlan, autoCalculateSceneTimings as enhancedAutoCalculateSceneTimings, validateShotstackCompatibility } from './enhancedDeterministicParser';
import { optimizeEffectsWithAI, batchOptimizeEffects } from './aiEffectOptimizer';
import { applyDeterministicParser, applyCompleteDeterministicParser } from './enrichedDeterministicParser';

type AnalyzerJson = any;
type RefinerJson = any;
type ScriptJson = any;
type UIInput = {
  userId?: string | null;
  durationSeconds?: number | null;
  aspectRatio?: string | null;
  platform?: string | null;
  language?: string | null;
  profile?: string | null;
};

export interface Phase4Inputs {
  treatmentText: string;
  studioBlueprint?: {
    id: string;
    userId: string | null;
    sourceRefs: {
      analyzerRef?: string | null;
      refinerRef?: string | null;
      scriptRef?: string | null;
    };
    title: string;
    overview: any;
    scenes: any[];
    audioArc: any;
    consistencyRules: any;
    rawMarkdown: string;
  };
  analyzerJson?: AnalyzerJson;
  refinerJson?: RefinerJson;
  scriptJson?: ScriptJson;
  userUI?: UIInput;
}

/* -----------------------
   Config / Safety defaults
   ----------------------- */
const DEFAULT_DURATION = 60;
const EXTRACTOR_TIMEOUT_MS = 3000; // keep extractor fast
const REPAIR_TIMEOUT_MS = 4000; // limit GPT repair time
const MAX_GPT_REPAIR_RETRIES = 1;
const ENABLE_GPT_REPAIR = process.env.REPAIR_ENABLED === "1";

/* -----------------------
   AJV setup
   ----------------------- */
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validateSchema = ajv.compile(manifestSchema as object);

/* -----------------------
   Public API
   ----------------------- */

/**
 * buildManifestFromTreatment
 *
 * Inputs:
 *  - treatmentText: human-readable director treatment (phase 3)
 *  - analyzer: result JSON from Analyzer
 *  - refiner: result JSON from Refiner
 *  - script: result JSON from Script Enhancer
 *  - ui: user-specified UI inputs (duration, platform, language)
 *
 * Returns a validated ProductionManifest (passes AJV). If something breaks,
 * a deterministic minimal fallback manifest is returned (still valid).
 */
export async function buildManifestFromTreatment(params: Phase4Inputs): Promise<{ 
  success: boolean; 
  manifest?: ProductionManifest; 
  jobs?: any[]; 
  warnings: string[]; 
  processingTimeMs: number;
  usedRepair?: boolean;
  error?: string;
}> {
  const { treatmentText, analyzerJson: analyzer = {}, refinerJson: refiner = {}, scriptJson: script = {}, userUI: ui = {} } = params;
  const warnings: string[] = [];
  const startTime = Date.now();

  try {
    // 1) Normalizer (deterministic)
    const metadata = normalizeMetadata({
      ui,
      analyzer,
      refiner,
    });

  // 2) Attempt LLM extraction (small model). If it fails, fallback to deterministic parser.
  let extracted: any | null = null;
  try {
    extracted = await tryExtractorLLM(treatmentText, { totalDurationSeconds: metadata.durationSeconds, profile: refiner.profile });
  } catch (e) {
    // just log and fall back
    warnings.push("Extractor LLM failed or timed out — using deterministic parser");
  }
  if (!isValidExtraction(extracted)) {
    // Use enhanced deterministic parser with AI-powered effect optimization
    const enhancedDraft = enhancedParseHumanPlan(ui.userId || 'anonymous', treatmentText);
    extracted = {
      title: enhancedDraft.metadata?.note || "Enhanced Auto Plan",
      totalDurationSeconds: enhancedDraft.metadata?.durationSeconds || null,
      scenes: enhancedDraft.scenes?.map(scene => ({
        id: scene.id,
        title: `Scene ${scene.id}`,
        durationWeight: scene.durationSeconds,
        narration: scene.narration,
        visualAnchorHint: scene.visuals?.[0]?.assetId || null,
        effects: scene.effects?.layeredEffects || [],
        musicCue: scene.musicCue
      })) || [],
      voice: { 
        gender: enhancedDraft.audio?.ttsDefaults?.style || "any", 
        voiceIdHint: enhancedDraft.audio?.ttsDefaults?.voiceId || null 
      },
      profile: enhancedDraft.metadata?.profile || null,
      // Enhanced features
      enhancedFeatures: {
        orderingHints: enhancedDraft.scenes?.reduce((acc, scene) => {
          if (scene.effects?.orderingHints) {
            acc[scene.id] = scene.effects.orderingHints;
          }
          return acc;
        }, {} as Record<string, any>) || {},
        shotstackConfig: enhancedDraft.scenes?.reduce((acc, scene) => {
          if (scene.effects?.shotstackConfig) {
            acc[scene.id] = scene.effects.shotstackConfig;
          }
          return acc;
        }, {} as Record<string, any>) || {},
        platformOptimizations: enhancedDraft.effects?.allowed || []
      }
    };
    warnings.push("Used enhanced deterministic parser with AI-powered effect optimization");
  }

  // 3) Build a manifest object (in-memory)
  let manifest = buildManifestFromIntermediate({ extracted, metadata, analyzer, refiner, script, ui });

  // 4) Auto-calculate scene timings to ensure timeline continuity
  manifest = autoCalculateSceneTimings(manifest);

  // 4.1) Apply enriched deterministic parser with ordering hints and layered effects
  manifest = applyCompleteDeterministicParser(manifest);
  warnings.push("Applied enriched deterministic parser with ordering hints and layered effects sequencing");

  // 4.5) AI-powered effect optimization (if enhanced features are available)
  if (extracted.enhancedFeatures) {
    try {
      const effectOptimizations = await batchOptimizeEffects(
        manifest.scenes,
        manifest,
        {
          performanceLevel: 'balanced',
          costSensitivity: 'medium'
        }
      );

      // Apply AI optimizations to scenes
      manifest.scenes = manifest.scenes.map(scene => {
        const optimization = effectOptimizations.get(scene.id);
        if (optimization) {
          return {
            ...scene,
            effects: {
              layeredEffects: optimization.effects,
              orderingHints: optimization.orderingHints,
              shotstackConfig: optimization.shotstackConfig
            }
          };
        }
        return scene;
      });

      warnings.push(`Applied AI-powered effect optimization to ${effectOptimizations.size} scenes`);
    } catch (error) {
      warnings.push("AI effect optimization failed, using deterministic effects");
    }
  }

  // 5) Decompose jobs deterministically
  manifest.jobs = decomposeJobs(manifest);

  // 6) Run AJV validation
  let valid = validateManifest(manifest);
  if (!valid) {
    warnings.push("Manifest failed AJV validation. Attempting deterministic repairs.");
    // deterministic repair
    manifest = deterministicRepair(manifest);
    valid = validateManifest(manifest);
  }

  // 7) If still invalid, optional GPT-5 repair (controlled)
  if (!valid && ENABLE_GPT_REPAIR) {
    try {
      const repaired = await tryGptRepair(manifest, validateSchema.errors || [], { analyzer, refiner, script });
      if (repaired) {
        manifest = repaired;
        warnings.push("Manifest repaired by GPT repair fallback");
      }
    } catch (e) {
      warnings.push("GPT repair failed or timed out");
    }
    valid = validateManifest(manifest);
  }

  // 8) If still invalid — produce safe minimal manifest fallback
  if (!valid) {
    warnings.push("Falling back to minimal deterministic manifest");
    manifest = buildMinimalFallbackManifest(metadata, ui);
    manifest.jobs = decomposeJobs(manifest);
    if (!validateManifest(manifest)) {
      // This should not happen: if it does, throw to allow caller to handle
      throw new Error("Critical: fallback manifest failed validation");
    }
  }

    // 9) Shotstack compatibility validation (if enhanced features are available)
    if (extracted.enhancedFeatures) {
      try {
        const shotstackValidation = validateShotstackCompatibility(manifest);
        if (!shotstackValidation.isValid) {
          warnings.push(`Shotstack compatibility issues: ${shotstackValidation.warnings.join(', ')}`);
        }
        if (shotstackValidation.optimizations.length > 0) {
          warnings.push(`Shotstack optimizations suggested: ${shotstackValidation.optimizations.join(', ')}`);
        }
      } catch (error) {
        warnings.push("Shotstack compatibility validation failed");
      }
    }

    // 10) Final qualityGate evaluation
    manifest.qualityGate = manifest.qualityGate || { durationCompliance: true, requiredAssetsReady: false };

    return { 
      success: true, 
      manifest, 
      jobs: manifest.jobs, 
      warnings, 
      processingTimeMs: Date.now() - startTime,
      usedRepair: false
    };

  } catch (error) {
    console.error('Phase 4 processing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      warnings,
      processingTimeMs: Date.now() - startTime
    };
  }
}

/* -----------------------
   Helpers: Normalizer
   ----------------------- */
function normalizeMetadata(args: { ui?: UIInput; analyzer?: any; refiner?: any }) {
  const { ui = {}, analyzer = {}, refiner = {} } = args;
  const durationSeconds =
    ui.durationSeconds || analyzer.duration_seconds || refiner.suggested_duration || DEFAULT_DURATION;
  const language = ui.language || analyzer.language || refiner.language || "en";
  const aspectRatio = ui.aspectRatio || analyzer.aspect_ratio || refiner.aspect_ratio || "Smart Auto";
  const platform = ui.platform || analyzer.platform || refiner.platform || "social";
  const profile = ui.profile || refiner.profile || analyzer.profile || "general";
  return {
    intent: "video" as const,
    durationSeconds,
    aspectRatio,
    platform,
    language,
    profile,
    priority: ui["priority"] || "normal",
  };
}

/* -----------------------
   Helpers: LLM extractor (wrapper)
   ----------------------- */

/**
 * tryExtractorLLM
 * - Calls GPT-4o-mini to produce a compact intermediate structure.
 * - MUST be fast and strict; if it times out or returns invalid JSON, we return null.
 */
async function tryExtractorLLM(treatmentText: string, hints: { totalDurationSeconds: number; profile?: string }): Promise<any | null> {
  try {
    const response = await callExtractorLLM(treatmentText, hints);
    // Ensure returned object seems sensible
    if (isValidExtraction(response)) return response;
    return null;
  } catch (e) {
    return null;
  }
}

/* -----------------------
   Deterministic parser (fallback)
   ----------------------- */

/**
 * deterministicParseTreatment
 * - Pure TS heuristics to extract scene-like blocks, narration hints, visual hints, and effect keywords.
 * - This must be robust to many formatting styles.
 */
function deterministicParseTreatment(treatmentText: string) {
  // Split on lines that look like Scene headers, or every 2 paragraphs if none found
  const sceneBlocks = splitIntoSceneBlocks(treatmentText);
  const scenes = sceneBlocks.map((block, idx) => {
    const narration = extractNarration(block);
    const visualAnchors = extractVisualHints(block);
    const effects = extractEffects(block);
    const musicCue = extractMusicCue(block);
    return {
      id: `s${idx + 1}`,
      title: determineSceneTitle(block, idx),
      durationWeight: determineDurationWeight(block),
      narration,
      visualAnchorHint: visualAnchors.join(" | ") || null,
      effects,
      musicCue,
    };
  });

  return {
    title: extractTitle(treatmentText) || "Auto Plan",
    totalDurationSeconds: null,
    scenes,
    voice: { gender: "any", voiceIdHint: null },
    profile: null,
  };
}

/* -----------------------
   Deterministic Builder (intermediate -> ProductionManifest)
   ----------------------- */
function buildManifestFromIntermediate(args: {
  extracted: any;
  metadata: { intent: string; durationSeconds: number; aspectRatio: string; platform: string; language: string; profile?: string };
  analyzer?: any;
  refiner?: any;
  script?: any;
  ui?: UIInput;
}): ProductionManifest {
  const { extracted, metadata, analyzer = {}, refiner = {}, script = {}, ui = {} } = args;

  const manifest: ProductionManifest = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    userId: ui.userId || analyzer.userId || null,
    sourceRefs: {
      analyzerRef: analyzer?.id || null,
      refinerRef: refiner?.id || null,
      scriptRef: script?.id || null,
    },
    metadata: {
      intent: "video",
      durationSeconds: metadata.durationSeconds,
      aspectRatio: metadata.aspectRatio,
      platform: metadata.platform,
      language: metadata.language,
      profile: metadata.profile || extracted.profile || "general",
      priority: "normal",
      note: undefined,
    },
    scenes: [],
    assets: {},
    audio: {
      ttsDefaults: {
        provider: "elevenlabs",
        voiceId: (refiner && refiner.preferredVoice) || (script && script.voice && script.voice.default) || "eva",
        style: (refiner && refiner.voice_style) || "instructional",
        stability: 0.7,
        similarityBoost: 0.5,
        sampleRate: 22050,
        format: "mp3",
      } as TTSConfig,
      music: { cueMap: {}, globalVolumeDuckToVoices: true },
      sfx: [],
    },
    visuals: {
      defaultAspect: metadata.aspectRatio,
      colorPalette: (refiner && refiner.colorPalette) || (script && script.colorPalette) || ["#0F172A", "#3B82F6"],
      fonts: { primary: "Inter", secondary: "Roboto" },
    },
    effects: {
      allowed: (refiner && refiner.effects && refiner.effects.allowed) || ["cinematic_zoom", "overlay_text", "bokeh_transition"],
      defaultTransition: (refiner && refiner.effects && refiner.effects.defaultTransition) || "fade",
      perScene: {},
    },
    consistency: (refiner && refiner.consistency) || {
      character_faces: "locked",
      voice_style: "consistent",
      tone: "professional",
      visual_continuity: "maintain",
      brand: { colors: [] },
    },
    jobs: [],
    qualityGate: undefined,
    warnings: [],
  };

  // Build scenes: scale durationWeight to durationSeconds
  const sceneWeights = extracted.scenes.map((s: any) => s.durationWeight || 1);
  const weightSum = sceneWeights.reduce((a: number, b: number) => a + b, 0) || 1;
  let cursor = 0;
  extracted.scenes.forEach((s: any, idx: number) => {
    const dur = Math.max(0.05, Math.round(((s.durationWeight || 1) / weightSum) * metadata.durationSeconds * 100) / 100);
    const scene: ScenePlan = {
      id: s.id || `s${idx + 1}`,
      startAtSec: cursor,
      durationSeconds: dur,
      purpose: s.title || "body",
      visualAnchor: s.visualAnchorHint || undefined,
      visuals: [],
      narration: s.narration || undefined,
      subtitles: [],
      tts: s.narration ? manifest.audio.ttsDefaults : null,
      musicCue: s.musicCue || null,
      effects: { transitions: s.effects || [] },
      orderingHint: idx,
      notes: undefined,
    };

    // Visuals: prefer user asset if analyzer/refiner labels it; else generated placeholder
    if (s.visualAnchorHint && findUserAssetForHint(s.visualAnchorHint, analyzer)) {
      const assetId = findUserAssetForHint(s.visualAnchorHint, analyzer);
      scene.visuals.push({
        type: "user_asset",
        assetId,
        transform: {},
        shot: { camera: "push", focal: "mid" },
        overlays: [],
      });
      // ensure assets entry exists
      if (!manifest.assets[assetId]) {
        manifest.assets[assetId] = {
          id: assetId,
          source: "user",
          originUrl: findUserAssetUrl(assetId, analyzer),
          role: "primary",
          status: "ready",
        } as AssetPlan;
      }
    } else {
      // placeholder generated visual
      const genId = `gen_${scene.id}_visual`;
      scene.visuals.push({
        type: "generated",
        assetId: genId,
        transform: {},
        shot: { camera: "static", focal: "wide" },
        overlays: [],
      });
      manifest.assets[genId] = {
        id: genId,
        source: "generated",
        role: "background",
        status: "pending",
        requiredEdits: [],
      } as AssetPlan;
    }

    manifest.scenes.push(scene);
    cursor += dur;
  });

  // Music cue map: make one cue spanning whole timeline unless script provides more detail
  manifest.audio.music.cueMap["music_01"] = {
    id: "music_01",
    startSec: 0,
    durationSec: metadata.durationSeconds,
    mood: (refiner && refiner.musicMood) || "neutral_learning",
    structure: "intro",
    instructions: (refiner && refiner.music_instructions) || "soft marimba/pads, low percussion",
  } as MusicCue;

  // minor cleanup: ensure startAtSec sums fit duration (clamp last scene to match total duration)
  adjustSceneDurationsToTotal(manifest);

  return manifest;
}


/* -----------------------
   Validation + repair
   ----------------------- */
function validateManifest(manifest: ProductionManifest): boolean {
  const ok = validateSchema(manifest);
  if (!ok) {
    // attach errors for caller to inspect if needed
    // console.log("AJV errors:", validateSchema.errors);
  }
  return ok as boolean;
}

/**
 * deterministicRepair
 * - perform common deterministic repairs:
 *   - ensure required top-level fields exist
 *   - clamp numeric ranges
 *   - rescale scene durations to match metadata
 *   - convert arrays/strings as needed
 */
function deterministicRepair(manifest: any): ProductionManifest {
  // ensure metadata exists
  manifest.metadata = manifest.metadata || {
    intent: "video",
    durationSeconds: DEFAULT_DURATION,
    aspectRatio: "Smart Auto",
    platform: "social",
    language: "en",
    profile: "general",
  };

  // ensure scenes array
  manifest.scenes = Array.isArray(manifest.scenes) ? manifest.scenes : [];

  // ensure assets map
  manifest.assets = manifest.assets || {};

  // clamp durations and rescale if sum does not match metadata.durationSeconds
  adjustSceneDurationsToTotal(manifest);

  // ensure audio.ttsDefaults
  manifest.audio = manifest.audio || {
    ttsDefaults: { provider: "elevenlabs", voiceId: "eva", format: "mp3", stability: 0.7 },
    music: { cueMap: {}, globalVolumeDuckToVoices: true },
    sfx: [],
  };

  // ensure jobs exist - empty allowed, but we'll create minimal ones later if needed
  manifest.jobs = Array.isArray(manifest.jobs) ? manifest.jobs : [];

  return manifest;
}

/* -----------------------
   GPT Repair wrapper (controlled)
   ----------------------- */

/**
 * tryGptRepair
 * - Provides validation errors and manifest to GPT-5 with strict instructions:
 *   "Repair the JSON to pass schema. Do not invent creative content. If a required field is ambiguous, set null."
 * - Limited retries and timeouts.
 */
async function tryGptRepair(manifest: any, ajvErrors: ErrorObject[] = [], context: any = {}): Promise<ProductionManifest | null> {
  if (!ENABLE_GPT_REPAIR) return null;
  try {
    const repaired = await callGptRepair(manifest, ajvErrors, context);
    // basic safety: ensure object shape
    if (repaired && typeof repaired === "object" && Array.isArray(repaired.scenes)) return repaired as ProductionManifest;
    return null;
  } catch (e) {
    return null;
  }
}

/* -----------------------
   Minimal fallback manifest
   ----------------------- */
function buildMinimalFallbackManifest(metadata: any, ui: UIInput): ProductionManifest {
  const dur = metadata.durationSeconds || DEFAULT_DURATION;
  const sceneId = "s1";
  const narration = "Auto-generated content.";
  const ttsDefaults: TTSConfig = {
    provider: "elevenlabs",
    voiceId: "eva",
    format: "mp3",
    stability: 0.7,
    sampleRate: 22050,
  };

  const manifest: ProductionManifest = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    userId: ui.userId || null,
    sourceRefs: { analyzerRef: null, refinerRef: null, scriptRef: null },
    metadata: {
      intent: "video",
      durationSeconds: dur,
      aspectRatio: metadata.aspectRatio || "Smart Auto",
      platform: metadata.platform || "social",
      language: metadata.language || "en",
      profile: metadata.profile || "general",
    },
    scenes: [
      {
        id: sceneId,
        startAtSec: 0,
        durationSeconds: dur,
        purpose: "auto",
        visuals: [
          { type: "generated", assetId: `gen_${sceneId}_visual` as any, transform: {}, shot: { camera: "static", focal: "wide" } },
        ],
        narration,
        tts: ttsDefaults,
      } as ScenePlan,
    ],
    assets: {
      [`gen_${sceneId}_visual`]: {
        id: `gen_${sceneId}_visual`,
        source: "generated",
        role: "background",
        status: "pending",
        requiredEdits: [],
      } as AssetPlan,
    },
    audio: {
      ttsDefaults,
      music: {
        cueMap: {
          music_01: { id: "music_01", startSec: 0, durationSec: dur, mood: "neutral_learning", structure: "intro", instructions: "soft bed" } as MusicCue,
        },
        globalVolumeDuckToVoices: true,
      },
    },
    visuals: { defaultAspect: metadata.aspectRatio || "Smart Auto", colorPalette: ["#0F172A"], fonts: { primary: "Inter" } },
    effects: { allowed: ["overlay_text"], defaultTransition: "fade", perScene: {} },
    consistency: { character_faces: "locked", voice_style: "consistent", tone: "neutral", visual_continuity: "maintain" },
    jobs: [],
    qualityGate: { durationCompliance: true, requiredAssetsReady: false },
    warnings: [],
  };

  manifest.jobs = decomposeJobs(manifest);
  return manifest;
}

/* -----------------------
   Utility helpers
   ----------------------- */

function isValidExtraction(x: any): boolean {
  return !!x && Array.isArray(x.scenes) && x.scenes.length > 0;
}

function splitIntoSceneBlocks(text: string): string[] {
  const re = /\n?(?:Scene\s*\d+\.?|###+\s*Scene)\b/gi;
  // If headings found, split by them preserving content; else split by double newlines into 2-4 blocks
  if (re.test(text)) {
    // insert marker and split
    const parts = text.split(/\n(?=Scene\s*\d+|###\s+Scene|##\s+Scene)/i).filter(Boolean);
    return parts.length ? parts : [text];
  }
  const paragraphs = text.split(/\n{2,}/).filter(Boolean);
  if (paragraphs.length <= 4) return paragraphs;
  // group paragraphs into ~3 blocks
  const blocks = [];
  const blockSize = Math.ceil(paragraphs.length / 3);
  for (let i = 0; i < paragraphs.length; i += blockSize) blocks.push(paragraphs.slice(i, i + blockSize).join("\n\n"));
  return blocks;
}

function extractNarration(block: string): string | null {
  // match lines like Narration: "..." or Narration: ...
  const m = block.match(/Narration:\s*["""']?([\s\S]{5,300}?)["""']?(?:\n|$)/i);
  if (m) return m[1].trim();
  // fallback: take first strong sentence
  const sent = block.match(/(?:^|\.\s+)([A-Z][^\.!?]{10,120}[\.!?])/);
  return sent ? sent[1].trim() : null;
}

function extractVisualHints(block: string): string[] {
  const hints: string[] = [];
  const visualMatch = block.match(/Visuals?:\s*([^\n]+)/i);
  if (visualMatch) hints.push(visualMatch[1].trim());
  const keywordMatches = Array.from(block.matchAll(/\b(laptop|smartphone|chart|classroom|anime|graduation|graduate|b-roll|cinematic|portrait)\b/gi));
  for (const km of keywordMatches) hints.push(km[1]);
  return hints;
}

function extractEffects(block: string): string[] {
  const known = ["cinematic_zoom", "parallax_scroll", "bokeh_transition", "overlay_text", "logo_reveal", "split_screen"];
  const found = known.filter((k) => new RegExp(`\\b${k}\\b`, "i").test(block));
  return found;
}

function extractMusicCue(block: string): string | null {
  const m = block.match(/\b(music:|music cue:)\s*([^\n]+)/i);
  if (m) return m[2].trim();
  return null;
}

function extractTitle(text: string): string | null {
  const m = text.match(/^(?:#*\s*)?(.{5,80})\n/);
  return m ? m[1].trim() : null;
}

function determineSceneTitle(block: string, idx: number) {
  const m = block.match(/Scene\s*\d+\s*[-:—]\s*(.+)/i);
  if (m) return m[1].trim();
  return ["hook", "body", "cta"][idx] || `scene_${idx + 1}`;
}

function determineDurationWeight(block: string) {
  // heuristics: hook short (0.8), body longer (1.4), outro short (0.8)
  if (/hook|intro|opening/i.test(block)) return 0.8;
  if (/outro|cta|conclude|end|wrap/i.test(block)) return 0.8;
  return 1.2;
}

function adjustSceneDurationsToTotal(manifest: any) {
  const total = manifest.metadata?.durationSeconds || DEFAULT_DURATION;
  const scenes = manifest.scenes || [];
  if (!scenes.length) return;
  let sum = scenes.reduce((acc: number, s: any) => acc + (Number(s.durationSeconds) || 0), 0);
  if (sum === 0) {
    // distribute evenly
    const each = Math.max(0.05, Math.round((total / scenes.length) * 100) / 100);
    let cursor = 0;
    for (const s of scenes) {
      s.startAtSec = cursor;
      s.durationSeconds = each;
      cursor += each;
    }
    // adjust last to match exactly
    scenes[scenes.length - 1].durationSeconds = Math.max(0.05, total - (each * (scenes.length - 1)));
    return;
  }
  // scale factor
  const scale = total / sum;
  let cursor = 0;
  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i];
    const newdur = Math.max(0.05, Math.round(((Number(s.durationSeconds) || 0) * scale) * 100) / 100);
    s.durationSeconds = newdur;
    s.startAtSec = cursor;
    cursor += newdur;
  }
  // fix rounding drift on last scene
  const used = cursor;
  const drift = Math.round((total - used) * 100) / 100;
  if (Math.abs(drift) >= 0.01) {
    scenes[scenes.length - 1].durationSeconds = Math.max(0.05, Math.round((scenes[scenes.length - 1].durationSeconds + drift) * 100) / 100);
  }
}

function findUserAssetForHint(hint: string, analyzer: any): string | null {
  // If analyzer labeled assets with user descriptions, try to match hint words
  try {
    const assets = analyzer?.assets || [];
    for (const a of assets) {
      if (!a || !a.metadata) continue;
      const desc = (a.metadata.description || "").toLowerCase();
      if (!desc) continue;
      const tokens = hint.toLowerCase().split(/\W+/).filter(Boolean);
      for (const t of tokens) {
        if (desc.includes(t)) return a.id;
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}

function findUserAssetUrl(assetId: string | null, analyzer: any): string | undefined {
  const assets = analyzer?.assets || [];
  for (const a of assets) {
    if (a.id === assetId) return a.url || a.metadata?.url || a.metadata?.originUrl;
  }
  return undefined;
}

function buildPromptFromVisualHint(hint: string, profile?: string) {
  // Deterministic prompt builder for image generation: include profile cues and simple constraints
  const base = hint || "cinematic B-roll, high production value";
  const profileCue = profile ? ` style: ${profile}` : "";
  return `${base}. High-resolution, cinematic lighting, shallow depth of field.${profileCue}. No textual overlays, ready for motion/animation.`;
}


/* -----------------------
   Exports (if needed externally)
   ----------------------- */
export default {
  buildManifestFromTreatment,
  deterministicParseTreatment,
  validateManifest,
  deterministicRepair,
  buildMinimalFallbackManifest,
};

/* End of manifestBuilder.ts */
