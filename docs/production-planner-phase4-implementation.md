# Production Planner Phase 4 Implementation

## Overview

Phase 4 is the critical bridge from human creativity (Phase 3 Studio Blueprint) to deterministic execution (Phase 5 workers). It converts human-readable treatment text into validated Production Manifests with deterministic job queues.

## Architecture

```
Phase 3 (Studio Blueprint) → Phase 4 Pipeline → Phase 5 (Workers)
     ↓                           ↓                    ↓
Human-readable plan    →  Production Manifest  →  Job Execution
```

## Core Components

### 1. Manifest Builder (`services/phase4/manifestBuilder.ts`)
- **Main orchestrator** for the Phase 4 pipeline
- Coordinates all sub-components
- Handles error recovery and fallbacks
- Returns validated Production Manifest + job list

### 2. LLM Extractor (`services/phase4/extractor.ts`)
- **Optional helper** using GPT-4o-mini
- Converts treatment text to structured intermediate format
- Fast, cheap, with strict token limits
- Falls back to deterministic parser if it fails

### 3. Deterministic Parser (`services/phase4/deterministicParser.ts`)
- **Primary truth engine** - pure TypeScript, no LLM
- Parses treatment text using regex and heuristics
- Handles scene extraction, narration, effects, visuals
- Always produces predictable output

### 4. Job Decomposer (`services/phase4/decomposeJobs.ts`)
- **Deterministic job generation** from manifest
- Creates TTS, asset generation, chart, music, render jobs
- Sets proper dependencies and priorities
- Maps to specific providers (ElevenLabs, Fal.ai, Shotstack)

### 5. Validation & Repair (`services/phase4/validationRepair.ts`)
- **AJV schema validation** against production-manifest.schema.json
- Deterministic repairs for common issues
- GPT-5 repair as last resort (expensive, limited use)
- Minimal fallback manifest if all else fails

## Processing Flow

### Step 4.1: Input Normalization
```typescript
const normalized = {
  totalDurationSeconds: userUI.duration || analyzer.duration || 60,
  language: userUI.language || analyzer.language || 'en',
  aspectRatio: userUI.aspectRatio || analyzer.aspectRatio || 'Smart Auto',
  // ... other canonical values
};
```

### Step 4.2: LLM Extraction (Optional)
```typescript
// Try GPT-4o-mini extraction first
const extracted = await extractStructuredData(treatmentText, hints);
// Falls back to deterministic parser if fails
```

### Step 4.3: Deterministic Parsing
```typescript
// Pure TypeScript parsing - the primary method
const extracted = parseTreatmentDeterministically(treatmentText, context);
```

### Step 4.4: Manifest Building
```typescript
const manifest = buildManifestFromExtracted(extracted, normalized, inputs);
// Creates scenes, assets, audio, effects, consistency rules
```

### Step 4.5: AJV Validation
```typescript
const isValid = ajv.validate(manifestSchema, manifest);
if (!isValid) {
  // Run repair loop
}
```

### Step 4.6: Repair Loop
1. **Deterministic repairs**: Fix durations, fill missing fields, clean data
2. **Re-validate**: Check if repairs fixed the issues
3. **GPT-5 repair**: If still invalid, call GPT-5 with strict limits
4. **Minimal fallback**: If all repairs fail, create basic valid manifest

### Step 4.7: Job Decomposition
```typescript
const jobs = decomposeJobs(manifest);
// Creates TTS, asset generation, music, render jobs with dependencies
```

### Step 4.8: Persistence
- Store manifest in `dreamcut_production_manifest`
- Store jobs in `dreamcut_jobs` with proper dependencies
- Broadcast via Realtime for worker notification

## Job Types & Providers

### TTS Jobs
```json
{
  "type": "tts",
  "payload": {
    "sceneId": "s1",
    "text": "Step one: pick footage.",
    "provider": "elevenlabs",
    "voiceId": "eva",
    "format": "mp3"
  }
}
```

### Asset Generation Jobs
```json
{
  "type": "generate_image",
  "payload": {
    "sceneId": "s2",
    "prompt": "Cinematic office B-roll: sleek analyst opening laptop",
    "model": "falai-image-v1",
    "resultAssetId": "gen_b_roll_001"
  }
}
```

### Chart Generation Jobs
```json
{
  "type": "generate_chart",
  "payload": {
    "sceneId": "s2",
    "data": [{"label": "Q1", "value": 10}],
    "provider": "gptimage",
    "resultAssetId": "gen_chart_q3"
  }
}
```

### Music Generation Jobs
```json
{
  "type": "generate_music",
  "payload": {
    "cueId": "music_01",
    "mood": "neutral_learning",
    "provider": "elevenlabs-music",
    "durationSec": 45
  }
}
```

### Render Jobs
```json
{
  "type": "render_shotstack",
  "payload": {
    "manifestId": "manifest-uuid",
    "shotstackJson": {},
    "callbackUrl": "https://api/callbacks/shotstack"
  },
  "dependsOn": ["job_tts_s1", "job_gen_asset_001", "job_music_01"]
}
```

## Database Schema

### `dreamcut_production_manifest`
- Stores the complete Production Manifest JSON
- Links to user, analyzer, refiner, script references
- Tracks validation status and errors

### `dreamcut_jobs`
- Individual job records with dependencies
- Status tracking (pending → processing → completed/failed)
- Retry logic and error handling
- Priority-based execution order

## API Endpoints

### POST `/api/production-planner/phase4`
**Input:**
```json
{
  "studioBlueprintId": "uuid",
  "treatmentText": "markdown treatment text",
  "analyzerJson": {},
  "refinerJson": {},
  "scriptJson": {},
  "userUI": {
    "userId": "uuid",
    "durationSeconds": 60,
    "aspectRatio": "16:9",
    "platform": "social",
    "language": "en",
    "tone": "professional"
  }
}
```

**Output:**
```json
{
  "success": true,
  "manifestId": "uuid",
  "jobCount": 5,
  "warnings": [],
  "processingTimeMs": 1250,
  "usedRepair": false
}
```

### GET `/api/production-planner/phase4?manifestId=uuid`
**Output:**
```json
{
  "success": true,
  "manifest": { /* Production Manifest */ },
  "jobs": [ /* Job array */ ]
}
```

## Error Handling & Fault Tolerance

### Deterministic Repairs
- Fill missing required fields from context
- Adjust scene durations to match total duration
- Set safe defaults for audio, visuals, effects
- Clean unknown fields that cause validation errors

### LLM Repair (Limited Use)
- Only called when deterministic repairs fail
- Strict token limits and timeouts
- No creative content generation - only structural fixes
- Expensive, so used sparingly

### Minimal Fallback
- Creates basic valid manifest if all repairs fail
- Single scene with generated asset
- Minimal job set (generate asset + render)
- Sets warnings for manual review

## Testing

### Unit Tests (`tests/phase4.test.ts`)
- Deterministic parser with various treatment formats
- Job decomposition with different manifest types
- Validation and repair logic
- Integration tests for end-to-end flow

### Test Page (`app/test-production-planner-phase4/page.tsx`)
- Interactive testing with real treatment text
- Validates manifest structure and job creation
- Shows processing time and repair usage
- Displays generated manifest and jobs

## Performance & Monitoring

### Time Budgets
- **Extractor**: 1-2 seconds (GPT-4o-mini)
- **Deterministic parser**: <100ms
- **Repair LLM**: 2-5 seconds (GPT-5)
- **Total Phase 4**: <10 seconds for interactive UI

### Metrics to Track
- Processing time breakdown
- Repair usage frequency
- Job creation success rate
- Manifest validation pass rate
- Worker execution success rate

## Security & Cost Considerations

### Input Sanitization
- Remove URLs and secrets from treatment text before LLM calls
- Validate all user inputs with Zod schemas
- Rate limit LLM calls per user/project

### Cost Control
- Use GPT-4o-mini for extraction (cheap, fast)
- Reserve GPT-5 only for repair (expensive, limited)
- Set strict token limits and timeouts
- Log LLM usage for monitoring

## Integration with Phase 5

Phase 4 outputs are consumed by Phase 5 workers:

1. **Workers poll** `dreamcut_jobs` table for pending jobs
2. **Dependencies resolved** automatically by job queue
3. **Results stored** back in job records
4. **Realtime updates** notify UI of progress
5. **Final render** combines all assets into video

## Example Output

From the "Build a Vid" treatment, Phase 4 produces:

```json
{
  "metadata": {
    "intent": "video",
    "durationSeconds": 5,
    "aspectRatio": "Smart Auto",
    "platform": "social",
    "language": "en",
    "profile": "educational_explainer"
  },
  "scenes": [
    {
      "id": "s1",
      "startAtSec": 0,
      "durationSeconds": 2,
      "purpose": "hook",
      "narration": "Step one: pick footage.",
      "visuals": [{"type": "generated", "assetId": "gen_laptop_001"}]
    }
  ],
  "jobs": [
    {
      "id": "job_tts_s1",
      "type": "tts",
      "payload": {"text": "Step one: pick footage.", "provider": "elevenlabs"}
    },
    {
      "id": "job_render_shotstack",
      "type": "render_shotstack",
      "dependsOn": ["job_tts_s1", "job_gen_laptop_001"]
    }
  ]
}
```

This manifest is then executed by Phase 5 workers to produce the final video.
