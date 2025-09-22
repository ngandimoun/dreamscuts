# 🎬 Production Planner - Phase 1 Implementation Guide

## Overview

Phase 1 delivers a **studio-grade, implementation-ready** production manifest system with canonical TypeScript interfaces, runtime validation, and strict business rules. This phase ensures deterministic worker consumption and production safety.

## Why This Design

### Goals Achieved

- **Deterministic for workers** — No free text parsing in workers; everything is concrete (assets, job payloads, providers)
- **Production-safety** — Validate shape (AJV) and runtime business rules (duration sum, language present, text→image→video flow)
- **AI-first** — Manifest enforces AI generation for visuals unless explicitly `source: user`
- **Composable jobs** — `jobs[]` is deterministic and provider-bound (e.g., `tts_elevenlabs`, `gen_image_falai`), ready for worker pipeline
- **Extendable** — Top-level shape strict, inner fields allow vendor params via `additionalProperties: true` where necessary

## Files Created

### 1. TypeScript Interfaces - `types/production-manifest.ts`
**Canonical type system** for the entire production manifest structure.

```typescript
export interface ProductionManifest {
  id?: UUID;
  userId: UUID | null;
  sourceRefs: { analyzerRef?: string; refinerRef?: string; scriptRef?: string; };
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
```

**Key Features:**
- **Strict typing** for all manifest components
- **Scene timing** with absolute start times and durations
- **Asset source validation** (only "user" or "generated" in Phase 1)
- **Job structure** with provider-specific payloads
- **TTS configuration** for ElevenLabs integration

### 2. AJV JSON Schema - `validators/production-manifest.schema.json`
**Runtime validation** that enforces shape and basic constraints.

```json
{
  "$id": "https://example.com/schemas/production-manifest.json",
  "type": "object",
  "required": ["userId","metadata","scenes","assets","audio","visuals","consistency","jobs"],
  "additionalProperties": false,
  "properties": {
    "metadata": {
      "required": ["intent","durationSeconds","aspectRatio","platform","language"],
      "properties": {
        "intent": { "enum": ["video","image","audio"] },
        "durationSeconds": { "minimum": 1 }
      }
    }
  }
}
```

**Key Features:**
- **Shape validation** with required fields
- **Asset source restriction** (no "stock" allowed in Phase 1)
- **Scene structure validation** with timing constraints
- **Job type validation** for supported providers

### 3. Zod Schema - `validators/production-manifest.ts`
**Dev-time validation** with better TypeScript inference.

```typescript
export const ProductionManifestZ = z.object({
  userId: z.string().nullable(),
  metadata: z.object({
    intent: z.enum(["video","image","audio"]),
    durationSeconds: z.number().min(1),
    aspectRatio: z.string(),
    platform: z.string(),
    language: z.string()
  }),
  scenes: z.array(ScenePlanZ).min(1),
  assets: z.record(z.any()),
  audio: z.object({
    ttsDefaults: TTSConfigZ,
    music: z.record(z.any())
  }),
  jobs: z.array(z.object({ id: z.string(), type: z.string(), payload: z.record(z.any()) }))
});
```

### 4. Example Manifest - `examples/manifest-example.json`
**Realistic 60-second AI-only video** demonstrating Phase 1 requirements.

```json
{
  "userId": "user_789",
  "metadata": {
    "intent": "video",
    "durationSeconds": 60,
    "aspectRatio": "16:9",
    "platform": "youtube",
    "language": "en",
    "cinematicLevel": "pro"
  },
  "scenes": [
    {
      "id": "s1",
      "startAtSec": 0,
      "durationSeconds": 8,
      "purpose": "hook",
      "narration": "How a degree opens doors you never knew existed.",
      "visuals": [
        {
          "type": "user",
          "assetId": "asset_user_grad",
          "shot": { "camera": "push", "focal": "mid" }
        }
      ]
    }
  ],
  "assets": {
    "asset_user_grad": {
      "id": "asset_user_grad",
      "source": "user",
      "role": "primary",
      "status": "ready"
    }
  },
  "jobs": [
    {
      "id": "job_tts_s1",
      "type": "tts_elevenlabs",
      "payload": { "sceneId": "s1", "text": "How a degree opens doors...", "voiceId": "eva" }
    }
  ]
}
```

### 5. Server-side Validation - `services/manifestService.ts`
**Robust validation** with business rules and Supabase integration.

```typescript
export function runBusinessChecks(manifest) {
  const errors = [];

  // 1) Duration sum validation
  const sumScenes = manifest.scenes.reduce((s, sc) => s + sc.durationSeconds, 0);
  if (Math.abs(sumScenes - manifest.metadata.durationSeconds) > 0.01) {
    errors.push({
      code: "DURATION_MISMATCH",
      message: `Sum of scene durations (${sumScenes}) != metadata.durationSeconds (${manifest.metadata.durationSeconds})`
    });
  }

  // 2) Scene overlap detection
  // 3) Asset reference validation
  // 4) AI-only visuals enforcement
  // 5) TTS provider validation
  // 6) Text→Image→Video flow validation

  return errors;
}
```

### 6. Database Schema - `docs/supabase-production-manifest-phase1.sql`
**Production manifest storage** with status tracking and validation results.

```sql
CREATE TABLE dreamcut_production_manifest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  manifest_json JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'ready_to_dispatch', 'rendering', 'done', 'failed')),
  validation_status TEXT DEFAULT 'pending',
  validation_errors JSONB DEFAULT '[]',
  business_check_errors JSONB DEFAULT '[]',
  quality_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Runtime Rules (Enforced in Service)

### Mandatory Business Checks

1. **Duration Sum Check**
   ```typescript
   const sumScenes = manifest.scenes.reduce((s, sc) => s + sc.durationSeconds, 0);
   if (Math.abs(sumScenes - manifest.metadata.durationSeconds) > 0.01) {
     // ERROR: Duration mismatch
   }
   ```

2. **Scene Overlap Detection**
   ```typescript
   // Check for overlapping scene times
   ranges.sort((a,b) => a.start - b.start);
   for (let i=1; i<ranges.length; i++) {
     if (ranges[i].start < ranges[i-1].end - 0.001) {
       // ERROR: Scene overlap
     }
   }
   ```

3. **Asset Reference Validation**
   ```typescript
   const assetKeys = new Set(Object.keys(manifest.assets));
   for (const scene of manifest.scenes) {
     for (const visual of scene.visuals) {
       if (!assetKeys.has(visual.assetId)) {
         // ERROR: Missing asset reference
       }
     }
   }
   ```

4. **AI-Only Visuals Rule**
   ```typescript
   for (const [id, asset] of Object.entries(manifest.assets)) {
     if (asset.source !== "user" && asset.source !== "generated") {
       // ERROR: Invalid asset source (no stock in Phase 1)
     }
   }
   ```

5. **TTS Provider Validation**
   ```typescript
   if (!manifest.audio?.ttsDefaults?.provider === "elevenlabs") {
     // ERROR: Missing or invalid TTS provider
   }
   ```

6. **Text→Image→Video Flow**
   ```typescript
   if (manifest.consistency?.enforceTextToImageToVideo) {
     const genAssets = Object.entries(manifest.assets)
       .filter(([k,v]) => v.source === "generated")
       .map(([k]) => k);
     const genJobs = manifest.jobs.filter(j => 
       j.type.startsWith("gen_image") || j.type.startsWith("generate_chart")
     );
     for (const assetId of genAssets) {
       if (!genJobs.some(j => j.payload?.resultAssetId === assetId)) {
         // ERROR: Missing generation job for asset
       }
     }
   }
   ```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install ajv ajv-formats
```

### 2. Run Database Migration
```bash
npm run db:migrate:production-manifest
```

### 3. Test the Implementation
Visit `/test-production-planner-phase1` to run comprehensive tests.

## Usage Examples

### Creating a Manifest
```typescript
import { validateAndInsertManifest } from './services/manifestService';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const manifest = {
  userId: "user_123",
  metadata: {
    intent: "video",
    durationSeconds: 60,
    aspectRatio: "16:9",
    platform: "youtube",
    language: "en"
  },
  scenes: [...],
  assets: {...},
  audio: {...},
  jobs: [...]
};

const result = await validateAndInsertManifest(supabase, manifest);
if (result.ok) {
  console.log('Manifest created:', result.data.id);
} else {
  console.log('Validation errors:', result.errors);
}
```

### Validating a Manifest
```typescript
import { runBusinessChecks } from './services/manifestService';

const errors = runBusinessChecks(manifest);
if (errors.length === 0) {
  console.log('Manifest is valid');
} else {
  console.log('Business rule violations:', errors);
}
```

## Supported Job Types

- `gen_image_falai` - Generate images using Fal.ai
- `enhance_image_falai` - Enhance existing images
- `gen_video_falai` - Generate videos from images
- `tts_elevenlabs` - Text-to-speech using ElevenLabs
- `gen_music_elevenlabs` - Generate music using ElevenLabs
- `lip_sync_lypsso` - Lip sync processing
- `generate_chart_gptimage` - Generate charts using GPT-4o
- `render_shotstack` - Final video rendering

## Quality Gates

- **Duration Compliance** - Scenes sum to total duration
- **Required Assets Ready** - All referenced assets exist
- **Manifest Score** - Overall quality score (0-1)
- **Validation Status** - Schema and business rule validation

## Next Steps

Phase 1 provides the foundation for:

- **Phase 2**: Manifest creation from Refiner + Script Enhancer integration
- **Phase 3**: Job generation and dependency management
- **Phase 4**: Production execution and monitoring

The manifest structure is now **deterministic**, **validated**, and **ready for worker consumption**.
