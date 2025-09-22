// services/phase4/validationRepair.ts
// Phase 4: Validation and Repair - AJV validation with deterministic and LLM repair

import Ajv from 'ajv';
import { ProductionManifest } from '../../types/production-manifest';
import { executeGPT5 } from '../../executors/gpt-5';
import manifestSchema from '../../validators/production-manifest.schema.json';

const ajv = new Ajv({ allErrors: true, verbose: true });

export interface RepairContext {
  analyzer: any;
  refiner: any;
  script: any;
}

/**
 * Run deterministic repairs on manifest
 */
export function runDeterministicRepair(
  manifest: ProductionManifest, 
  errors: any[]
): ProductionManifest {
  console.log('[Phase4Repair] Running deterministic repairs...');
  
  const repaired = { ...manifest };
  
  // Fix missing required fields
  if (!repaired.metadata.intent) {
    repaired.metadata.intent = 'video';
  }
  
  if (!repaired.metadata.language) {
    repaired.metadata.language = 'en';
  }
  
  if (!repaired.metadata.platform) {
    repaired.metadata.platform = 'social';
  }
  
  if (!repaired.metadata.aspectRatio) {
    repaired.metadata.aspectRatio = 'Smart Auto';
  }
  
  if (!repaired.metadata.profile) {
    repaired.metadata.profile = 'educational_explainer';
  }
  
  // Ensure duration is positive
  if (repaired.metadata.durationSeconds <= 0) {
    repaired.metadata.durationSeconds = 60;
  }
  
  // Fix scene durations to sum to total duration
  const totalSceneDuration = repaired.scenes.reduce((sum, scene) => sum + scene.durationSeconds, 0);
  const targetDuration = repaired.metadata.durationSeconds;
  
  if (Math.abs(totalSceneDuration - targetDuration) > 0.1) {
    console.log(`[Phase4Repair] Adjusting scene durations from ${totalSceneDuration}s to ${targetDuration}s`);
    
    let startAt = 0;
    repaired.scenes.forEach((scene, index) => {
      const isLastScene = index === repaired.scenes.length - 1;
      const duration = isLastScene 
        ? targetDuration - startAt // Last scene gets remaining time
        : (scene.durationSeconds / totalSceneDuration) * targetDuration;
      
      scene.startAtSec = startAt;
      scene.durationSeconds = Math.max(0.1, duration); // Minimum 0.1 seconds
      startAt += scene.durationSeconds;
    });
  }
  
  // Ensure minimum scene duration
  repaired.scenes.forEach(scene => {
    if (scene.durationSeconds < 0.05) {
      scene.durationSeconds = 0.05;
    }
  });
  
  // Fix audio defaults
  if (!repaired.audio.ttsDefaults) {
    repaired.audio.ttsDefaults = {
      provider: 'elevenlabs',
      voiceId: 'eva',
      format: 'mp3',
      stability: 0.7
    };
  }
  
  if (!repaired.audio.music) {
    repaired.audio.music = {
      cueMap: {},
      globalVolumeDuckToVoices: true
    };
  }
  
  // Fix visuals defaults
  if (!repaired.visuals) {
    repaired.visuals = {
      defaultAspect: repaired.metadata.aspectRatio
    };
  }
  
  // Fix effects defaults
  if (!repaired.effects) {
    repaired.effects = {
      allowed: ['cinematic_zoom', 'overlay_text', 'fade'],
      defaultTransition: 'fade'
    };
  }
  
  // Fix consistency defaults
  if (!repaired.consistency) {
    repaired.consistency = {
      character_faces: 'locked',
      voice_style: 'consistent',
      tone: repaired.metadata.profile
    };
  }
  
  // Ensure jobs array exists
  if (!repaired.jobs) {
    repaired.jobs = [];
  }
  
  // Ensure warnings array exists
  if (!repaired.warnings) {
    repaired.warnings = [];
  }
  
  // Remove any unknown fields that might cause validation errors
  const cleanedManifest = cleanUnknownFields(repaired);
  
  console.log('[Phase4Repair] Deterministic repairs completed');
  return cleanedManifest;
}

/**
 * Call GPT-5 for repair (limited use, expensive)
 */
export async function callGptRepair(
  manifest: ProductionManifest,
  errors: any[],
  context: RepairContext
): Promise<ProductionManifest> {
  console.log('[Phase4Repair] Calling GPT-5 for repair...');
  
  try {
    const prompt = generateRepairPrompt(manifest, errors, context);
    
    const response = await executeGPT5({
      prompt,
      reasoning_effort: 'low', // Keep reasoning minimal for repair
      verbosity: 'low',
      max_completion_tokens: 2000,
      temperature: 0.1, // Low temperature for consistent repair
      timeout: 10000 // 10 second timeout
    });
    
    const repairedText = response.text.trim();
    console.log('[Phase4Repair] GPT-5 repair response:', repairedText);
    
    // Parse the repaired JSON
    const repaired = JSON.parse(repairedText) as ProductionManifest;
    
    console.log('[Phase4Repair] GPT-5 repair completed');
    return repaired;
    
  } catch (error: any) {
    console.error('[Phase4Repair] GPT-5 repair failed:', error);
    throw new Error(`GPT-5 repair failed: ${error.message}`);
  }
}

/**
 * Build minimal fallback manifest
 */
export function buildMinimalFallbackManifest(
  originalManifest: ProductionManifest,
  context: any
): ProductionManifest {
  console.log('[Phase4Repair] Building minimal fallback manifest...');
  
  const minimal: ProductionManifest = {
    userId: originalManifest.userId,
    sourceRefs: originalManifest.sourceRefs,
    metadata: {
      intent: 'video',
      durationSeconds: context.totalDurationSeconds || 60,
      aspectRatio: context.aspectRatio || 'Smart Auto',
      platform: context.platform || 'social',
      language: context.language || 'en',
      profile: context.profile || 'educational_explainer'
    },
    scenes: [
      {
        id: 's1',
        startAtSec: 0,
        durationSeconds: context.totalDurationSeconds || 60,
        purpose: 'content',
        visuals: [
          {
            type: 'generated',
            assetId: 'gen_fallback_001',
            role: 'background'
          }
        ],
        effects: {
          transitions: ['fade'],
          overlays: [],
          filters: []
        }
      }
    ],
    assets: {
      'gen_fallback_001': {
        id: 'gen_fallback_001',
        source: 'generated',
        role: 'background',
        status: 'pending',
        requiredEdits: []
      }
    },
    audio: {
      ttsDefaults: {
        provider: 'elevenlabs',
        voiceId: 'eva',
        format: 'mp3',
        stability: 0.7
      },
      music: {
        cueMap: {},
        globalVolumeDuckToVoices: true
      }
    },
    visuals: {
      defaultAspect: context.aspectRatio || 'Smart Auto'
    },
    effects: {
      allowed: ['fade'],
      defaultTransition: 'fade'
    },
    consistency: {
      character_faces: 'locked',
      voice_style: 'consistent',
      tone: context.tone || 'professional'
    },
    jobs: [
      {
        id: 'job_gen_fallback_001',
        type: 'generate_image',
        payload: {
          sceneId: 's1',
          prompt: 'professional video background, clean and simple',
          model: 'falai-image-v1',
          resultAssetId: 'gen_fallback_001',
          resolution: '1920x1080',
          quality: 'high'
        },
        priority: 10,
        dependsOn: [],
        retryPolicy: {
          maxRetries: 3,
          backoffSeconds: 30
        }
      },
      {
        id: 'job_render_fallback',
        type: 'render_shotstack',
        payload: {
          manifestId: 'MANIFEST_PLACEHOLDER',
          shotstackJson: {},
          callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/callbacks/shotstack`
        },
        priority: 12,
        dependsOn: ['job_gen_fallback_001'],
        retryPolicy: {
          maxRetries: 3,
          backoffSeconds: 120
        }
      }
    ],
    warnings: ['Used minimal fallback manifest due to validation failures']
  };
  
  console.log('[Phase4Repair] Minimal fallback manifest created');
  return minimal;
}

/**
 * Generate repair prompt for GPT-5
 */
function generateRepairPrompt(
  manifest: ProductionManifest,
  errors: any[],
  context: RepairContext
): string {
  return `You are a strict JSON repair specialist. Fix the following Production Manifest to be valid according to the schema.

INVALID MANIFEST:
${JSON.stringify(manifest, null, 2)}

VALIDATION ERRORS:
${JSON.stringify(errors, null, 2)}

SCHEMA REQUIREMENTS:
${JSON.stringify(manifestSchema, null, 2)}

CONTEXT:
- Analyzer: ${JSON.stringify(context.analyzer, null, 2)}
- Refiner: ${JSON.stringify(context.refiner, null, 2)}
- Script: ${JSON.stringify(context.script, null, 2)}

REPAIR RULES:
1. Fix all validation errors listed above
2. Do not add new creative content - only fix structure and format
3. Use context data to fill missing required fields when possible
4. If ambiguous, leave fields as null or use safe defaults
5. Ensure all scene durations sum to metadata.durationSeconds
6. Ensure all referenced assets exist in the assets object
7. Ensure all job dependencies reference valid job IDs

Return ONLY the repaired JSON manifest. No commentary, no explanations, no markdown.`;
}

/**
 * Clean unknown fields from manifest
 */
function cleanUnknownFields(manifest: any): ProductionManifest {
  const allowedFields = [
    'userId', 'sourceRefs', 'metadata', 'scenes', 'assets', 'audio', 
    'visuals', 'effects', 'consistency', 'jobs', 'warnings'
  ];
  
  const cleaned: any = {};
  
  for (const field of allowedFields) {
    if (manifest[field] !== undefined) {
      cleaned[field] = manifest[field];
    }
  }
  
  return cleaned as ProductionManifest;
}

/**
 * Validate manifest with AJV
 */
export function validateManifest(manifest: ProductionManifest): { valid: boolean; errors: any[] } {
  const valid = ajv.validate(manifestSchema, manifest);
  return {
    valid: valid || false,
    errors: ajv.errors || []
  };
}
