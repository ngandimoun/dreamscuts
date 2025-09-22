# Production Planner Phase 4 - Complete Pipeline Flow

## 🚦 Pipeline Overview

The Phase 4 pipeline converts human-readable production plans (from Phase 3) into validated, structured JSON manifests ready for production execution.

## 📋 Pipeline Steps

### Step 1 — Input
- **Phase 3 output**: Human-readable treatment from GPT-5
- **JSON Schema**: Validated with AJV
- **Context**: Analyzer, Refiner, Script outputs + User UI preferences

### Step 2 — Extractor (GPT-4o-mini)
- **Purpose**: Convert director-style treatment to draft JSON manifest
- **Model**: GPT-4o-mini (cheap, fast, lightweight)
- **Input**: Human-readable treatment text
- **Output**: Draft JSON manifest (may be incomplete/malformed)
- **Fallback**: If extraction fails → deterministic parser

### Step 3 — Auto-calculate Scene Timings
- **Purpose**: Ensure timeline continuity by auto-calculating `startAtSec` for each scene
- **Function**: `autoCalculateSceneTimings()`
- **Features**:
  - Respects existing valid `startAtSec` values
  - Auto-calculates missing or invalid timings
  - Prevents gaps or overlaps in production timeline
  - Handles invalid `durationSeconds` with safe defaults

### Step 4 — First Validation (AJV)
- **Purpose**: Validate draft manifest against schema
- **Tool**: AJV with production-manifest.schema.json
- **Result**: 
  - ✅ **Pass** → Go to Step 7 (Persist)
  - ❌ **Fail** → Go to Step 5 (Repair)

### Step 5 — Repair (GPT-5)
- **Purpose**: Fix structural errors and enrich missing fields
- **Model**: GPT-5 (expensive reasoning, schema-aware)
- **Input**: Malformed JSON + AJV schema + validation errors
- **Output**: Repaired JSON manifest
- **Safety**: Limited retries, strict repair instructions

### Step 6 — Second Validation (AJV)
- **Purpose**: Validate repaired manifest
- **Result**:
  - ✅ **Pass** → Go to Step 7 (Persist)
  - ❌ **Fail** → Go to Deterministic Parser (guaranteed baseline)

### Step 7 — Persist
- **Purpose**: Store final manifest in Supabase
- **Table**: `dreamcut_production_manifest`
- **Status**: `ready`
- **Jobs**: Decomposed into `dreamcut_jobs` table

## 🔗 Pipeline Diagram

```
Phase 3 (Human Plan → GPT-5)
        ↓
Extractor (GPT-4o-mini)
        ↓
   Draft JSON
        ↓
Auto-calculate Scene Timings
        ↓
    AJV Validation
   /           \
 Fail           Pass
 ↓               ↓
Repair (GPT-5)   Persist → Supabase
        ↓
   Repaired JSON
        ↓
   AJV Validation
   /           \
 Fail           Pass
 ↓               ↓
Deterministic     Persist → Supabase
Parser
```

## ⚡ Why This Architecture Works

### Creative Reasoning = GPT-5 (Phase 3)
- Generates human-readable production plans
- Creative, flexible, handles complex requirements

### Cheap Extraction = GPT-4o-mini (Step 2)
- Fast, cost-effective JSON extraction
- Lightweight, deterministic output
- Fallback to regex parser if needed

### Schema Enforcement = AJV (Steps 3 & 5)
- Strict validation against production schema
- Catches structural and type errors
- Ensures data integrity

### Repair + Enrichment = GPT-5 (Step 4)
- Deep reasoning for complex repairs
- Schema-aware fixes
- Enriches missing fields with safe defaults

### Last Resort = Deterministic Parser (Fallback)
- Pure TypeScript regex heuristics
- No LLM dependencies
- Guaranteed baseline manifest

## 🛠️ Implementation Files

### Core Pipeline
- `services/phase4/manifestBuilder.ts` - Main pipeline orchestrator
- `services/phase4/extractor.ts` - GPT-4o-mini extraction prompts
- `services/phase4/repair.ts` - GPT-5 repair prompts
- `services/phase4/deterministicParser.ts` - Regex-based fallback parser

### Validation & Types
- `validators/production-manifest.schema.json` - AJV schema
- `types/production-manifest.ts` - TypeScript interfaces

### Database
- `docs/supabase-production-manifest-phase1.sql` - Manifest table
- `docs/supabase-dreamcut-jobs-schema.sql` - Job queue table

### Testing
- `services/phase4/pipeline.test.ts` - End-to-end pipeline tests
- `services/phase4/deterministicParser.test.ts` - Parser unit tests

## 🎯 Success Criteria

### Input Processing
- ✅ Handles messy human-readable text
- ✅ Extracts structured data reliably
- ✅ Normalizes inputs from multiple sources

### Validation
- ✅ Strict schema compliance
- ✅ Type safety enforcement
- ✅ Data integrity checks

### Repair & Fallback
- ✅ Intelligent error fixing
- ✅ Safe default values
- ✅ Guaranteed valid output

### Performance
- ✅ Fast deterministic path
- ✅ Controlled LLM usage
- ✅ Cost-effective processing

### Reliability
- ✅ Multiple fallback layers
- ✅ Error handling at every step
- ✅ Production-ready robustness

## 🚀 Usage Example

```typescript
import { buildManifestFromTreatment } from './services/phase4/manifestBuilder';

const result = await buildManifestFromTreatment({
  treatmentText: humanReadablePlan,
  analyzer: analyzerOutput,
  refiner: refinerOutput,
  script: scriptOutput,
  ui: userPreferences,
});

// Result contains:
// - manifest: Validated ProductionManifest
// - warnings: Processing warnings/fallbacks used
```

## 🔧 Configuration

### Environment Variables
- `REPAIR_ENABLED=1` - Enable GPT-5 repair
- `GPT5_KEY` - GPT-5 API key
- `GPT_SMALL_KEY` - GPT-4o-mini API key
- `SHOTSTACK_CALLBACK_URL` - Render job callbacks

### Safety Defaults
- Extractor timeout: 3 seconds
- Repair timeout: 4 seconds
- Max repair retries: 1
- Deterministic fallback: Always available

## 📊 Monitoring

### Warnings System
- LLM extraction failures
- Repair attempts used
- Fallback parser usage
- Validation errors encountered

### Quality Metrics
- Processing time
- Repair attempts
- Fallback usage rate
- Validation success rate

This pipeline ensures that regardless of input quality or LLM failures, you always get a valid, structured production manifest ready for execution! 🎉
