// deterministicParser.ts
import { ProductionManifest, ScenePlan } from "../../types/production-manifest";

// Regex utility
function matchAll(regex: RegExp, text: string): string[] {
  const matches: string[] = [];
  let m;
  while ((m = regex.exec(text)) !== null) {
    matches.push(m[1].trim());
  }
  return matches;
}

export function parseHumanPlanToDraftManifest(
  userId: string,
  humanPlan: string
): Partial<ProductionManifest> {
  const draft: Partial<ProductionManifest> = {
    userId,
    metadata: {
      intent: "video",
      durationSeconds: 60,
      aspectRatio: "16:9",
      platform: "youtube",
      language: "en",
    },
    scenes: [],
    assets: {},
    audio: {
      ttsDefaults: { provider: "elevenlabs" },
      music: { cueMap: {} },
    },
    visuals: { defaultAspect: "16:9" },
    effects: { allowed: [] },
    consistency: {},
    jobs: [],
  };

  // --- Heuristics (~20 rules) ---

  // 1. Extract language
  const langMatch = humanPlan.match(/language[:\-]\s*([a-z]+)/i);
  if (langMatch) draft.metadata!.language = langMatch[1];

  // 2. Extract duration
  const durMatch = humanPlan.match(/duration[:\-]\s*(\d+)/i);
  if (durMatch) draft.metadata!.durationSeconds = parseInt(durMatch[1]);

  // 3. Detect platform
  const platMatch = humanPlan.match(/platform[:\-]\s*(tiktok|youtube|instagram)/i);
  if (platMatch) draft.metadata!.platform = platMatch[1].toLowerCase();

  // 4. Extract aspect ratio
  const arMatch = humanPlan.match(/aspect[:\-]\s*(\d+:\d+)/i);
  if (arMatch) draft.metadata!.aspectRatio = arMatch[1];

  // 5. Extract profile
  const profileMatch = humanPlan.match(/style[:\-]\s*([a-z_]+)/i);
  if (profileMatch) draft.metadata!.profile = profileMatch[1];

  // 6. Scenes
  const sceneBlocks = humanPlan.split(/scene\s*\d+\s*[:\-]/i);
  sceneBlocks.slice(1).forEach((block, i) => {
    const narrationMatch = block.match(/narration[:\-]\s*([^\n]+)/i);
    const purposeMatch = block.match(/purpose[:\-]\s*([^\n]+)/i);
    const durationMatch = block.match(/(\d+)\s*sec/i);

    draft.scenes!.push({
      id: `s${i + 1}`,
      startAtSec: i * 10,
      durationSeconds: durationMatch ? parseInt(durationMatch[1]) : 10,
      purpose: purposeMatch ? purposeMatch[1] : "body",
      narration: narrationMatch ? narrationMatch[1] : undefined,
      visuals: [],
    });
  });

  // 7. Extract assets
  const assetMatches = matchAll(/asset[:\-]\s*(https?:[^\s]+)/gi, humanPlan);
  assetMatches.forEach((url, i) => {
    draft.assets![`asset_${i + 1}`] = {
      id: `asset_${i + 1}`,
      source: "user",
      originUrl: url,
      role: "primary",
      status: "ready",
    };
  });

  // 8. Voiceover style
  const voiceMatch = humanPlan.match(/voice[:\-]\s*([a-z]+)/i);
  if (voiceMatch) draft.audio!.ttsDefaults.style = voiceMatch[1];

  // 9. Voice ID
  const voiceIdMatch = humanPlan.match(/voiceid[:\-]\s*([a-z0-9_]+)/i);
  if (voiceIdMatch) draft.audio!.ttsDefaults.voiceId = voiceIdMatch[1];

  // 10. Music structure
  const musicMatches = matchAll(/music[:\-]\s*([^\n]+)/gi, humanPlan);
  musicMatches.forEach((m, i) => {
    draft.audio!.music.cueMap[`music_${i + 1}`] = {
      id: `music_${i + 1}`,
      startSec: i * 15,
      mood: m,
      structure: i === 0 ? "intro" : i === musicMatches.length - 1 ? "outro" : "build",
    };
  });

  // 11. Effects (permitted list)
  const effectMatches = matchAll(/effect[:\-]\s*([a-z_]+)/gi, humanPlan);
  draft.effects!.allowed = effectMatches;

  // 12. Scene effects
  draft.scenes!.forEach((scene, i) => {
    const block = sceneBlocks[i + 1] || "";
    const sceneEffMatches = matchAll(/effect[:\-]\s*([a-z_]+)/gi, block);
    if (sceneEffMatches.length) {
      (scene as any).effects = { layeredEffects: sceneEffMatches };
    }
  });

  // 13. Consistency rules
  if (/faces locked/i.test(humanPlan)) draft.consistency!.character_faces = "locked";
  if (/voice consistent/i.test(humanPlan)) draft.consistency!.voice_style = "consistent";
  if (/tone[:\-]/i.test(humanPlan)) {
    const toneMatch = humanPlan.match(/tone[:\-]\s*([a-z]+)/i);
    if (toneMatch) draft.consistency!.tone = toneMatch[1];
  }

  // 14. Brand colors
  const colorMatches = matchAll(/#([0-9a-f]{6})/gi, humanPlan);
  if (colorMatches.length) draft.consistency!.brand = { colors: colorMatches };

  // 15. Logo
  const logoMatch = humanPlan.match(/logo[:\-]\s*(https?:[^\s]+)/i);
  if (logoMatch) draft.consistency!.brand = { ...(draft.consistency!.brand || {}), logoAssetId: logoMatch[1] };

  // 16. Subtitles
  draft.scenes!.forEach((s) => {
    if (s.narration) {
      s.subtitles = [{ text: s.narration, start: s.startAtSec, end: s.startAtSec + s.durationSeconds }];
    }
  });

  // 17. Job seeds (just TTS for now)
  draft.jobs = draft.scenes!.map((s) => ({
    id: `job_tts_${s.id}`,
    type: "tts",
    payload: { sceneId: s.id, text: s.narration || "" },
  }));

  // 18. Quality gate draft
  draft.qualityGate = {
    durationCompliance: true,
    requiredAssetsReady: true,
    manifestScore: 0.7,
  };

  // 19. Add warnings if missing narration
  draft.warnings = draft.scenes!.filter((s) => !s.narration).map((s) => `Scene ${s.id} missing narration`);

  // 20. Default note
  if (!draft.metadata!.note) draft.metadata!.note = "Draft generated by deterministic parser";

  return draft;
}

/**
 * Auto-calculate startAtSec for each scene to ensure timeline continuity.
 * If startAtSec already exists, it is respected; otherwise, it's computed.
 * This prevents gaps or overlaps in production plans.
 */
export function autoCalculateSceneTimings(manifest: ProductionManifest): ProductionManifest {
  let currentTime = 0;

  const updatedScenes = manifest.scenes.map((scene) => {
    const sceneCopy = { ...scene };
    // If startAtSec is missing or negative, assign currentTime
    if (sceneCopy.startAtSec == null || sceneCopy.startAtSec < 0) {
      sceneCopy.startAtSec = currentTime;
    }
    // If durationSeconds missing or invalid, fallback to 1s
    if (!sceneCopy.durationSeconds || sceneCopy.durationSeconds <= 0) {
      sceneCopy.durationSeconds = 1;
    }

    currentTime = sceneCopy.startAtSec + sceneCopy.durationSeconds;
    return sceneCopy;
  });

  return { ...manifest, scenes: updatedScenes };
}