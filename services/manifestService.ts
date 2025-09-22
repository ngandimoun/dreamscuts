// services/manifestService.ts
import Ajv from "ajv";
import addFormats from "ajv-formats";
import manifestSchema from "../validators/production-manifest.schema.json";
import { createClient } from "@supabase/supabase-js"; // use your project client import

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validateShape = ajv.compile(manifestSchema);

export function runBusinessChecks(manifest) {
  const errors = [];

  // 1) duration sum == metadata.durationSeconds (allow small float tolerance)
  const sumScenes = manifest.scenes.reduce((s, sc) => s + (sc.durationSeconds || 0), 0);
  const tolerance = 0.01;
  if (Math.abs(sumScenes - manifest.metadata.durationSeconds) > tolerance) {
    errors.push({
      code: "DURATION_MISMATCH",
      message: `Sum of scene durations (${sumScenes}) != metadata.durationSeconds (${manifest.metadata.durationSeconds})`
    });
  }

  // 2) scene time overlap & bounds
  for (const sc of manifest.scenes) {
    if (sc.startAtSec < 0) errors.push({ code: "INVALID_SCENE_START", message: `scene ${sc.id} startAtSec negative` });
    if (sc.startAtSec + sc.durationSeconds > manifest.metadata.durationSeconds + 0.01) {
      errors.push({ code: "SCENE_OUT_OF_BOUNDS", message: `scene ${sc.id} ends beyond total duration` });
    }
  }
  // check overlaps
  const ranges = manifest.scenes.map(s => ({ id: s.id, start: s.startAtSec, end: s.startAtSec + s.durationSeconds }));
  ranges.sort((a,b) => a.start - b.start);
  for (let i=1;i<ranges.length;i++){
    if (ranges[i].start < ranges[i-1].end - 0.001) {
      errors.push({ code: "SCENE_OVERLAP", message: `scene ${ranges[i].id} overlaps ${ranges[i-1].id}` });
    }
  }

  // 3) assets referenced exist
  const assetKeys = new Set(Object.keys(manifest.assets || {}));
  for (const sc of manifest.scenes) {
    for (const v of sc.visuals) {
      if (!assetKeys.has(v.assetId)) {
        errors.push({ code: "MISSING_ASSET", message: `scene ${sc.id} references unknown asset ${v.assetId}` });
      }
    }
  }

  // 4) enforce AI-only visuals rule: assets.source must be "user" or "generated"
  for (const [id, a] of Object.entries(manifest.assets || {})) {
    if (a.source !== "user" && a.source !== "generated") {
      errors.push({ code: "INVALID_ASSET_SOURCE", message: `${id} source must be 'user' or 'generated' in Phase1` });
    }
  }

  // 5) Ensure TTS provider exists somewhere (narrationMap or ttsDefaults)
  if (!manifest.audio || !manifest.audio.ttsDefaults) {
    errors.push({ code: "NO_TTS_PROVIDER", message: "audio.ttsDefaults is required (ElevenLabs config)" });
  } else if (manifest.audio.ttsDefaults.provider !== "elevenlabs") {
    errors.push({ code: "UNSUPPORTED_TTS_PROVIDER", message: "Phase1 supports only elevenlabs for TTS" });
  }

  // 6) Enforce text→image→video flow when consistency.enforceTextToImageToVideo is true:
  if (manifest.consistency && manifest.consistency.enforceTextToImageToVideo) {
    // Each generated visual must be a generated asset (ok), and there should be a job to generate that asset
    const genAssets = Object.entries(manifest.assets).filter(([k,v]) => v.source === "generated").map(([k]) => k);
    const genJobs = (manifest.jobs||[]).filter(j => j.type.startsWith("gen_image") || j.type.startsWith("generate_chart") || j.type.startsWith("gen_video"));
    for (const ga of genAssets) {
      const found = genJobs.some(j => j.payload && j.payload.resultAssetId === ga);
      if (!found) errors.push({ code: "MISSING_GEN_JOB", message: `generated asset ${ga} missing generation job` });
    }
  }

  return errors;
}

export async function validateAndInsertManifest(supabaseClient, manifest) {
  // 1) shape validation
  const ok = validateShape(manifest);
  if (!ok) {
    return { ok: false, errors: [{ code: "SCHEMA_INVALID", details: validateShape.errors }] };
  }

  // 2) business checks
  const bizErrors = runBusinessChecks(manifest);
  if (bizErrors.length) {
    return { ok: false, errors: bizErrors };
  }

  // 3) insert to Supabase
  const { data, error } = await supabaseClient
    .from("dreamcut_production_manifest")
    .insert([{ user_id: manifest.userId, manifest_json: manifest, status: "planning" }])
    .select()
    .single();

  if (error) {
    return { ok: false, errors: [{ code: "SUPABASE_INSERT_FAILED", message: error.message, detail: error }] };
  }
  return { ok: true, data };
}
