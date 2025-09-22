# 🎬 Production Planner Phase 3 — Studio Blueprint Implementation

## Overview

Phase 3 implements the **Human-readable Plan (LLM Reasoning)** system for the Production Planner. This creates Studio-Level Blueprints using GPT-5 reasoning model to generate director treatments before manifest serialization.

## 🎯 Objective

Turn raw inputs (user brief + assets + analyzer/refiner/script results) into a human-readable creative plan that serves as a director's treatment: a narrative plan outlining what the final video will look/sound/feel like.

**Key Characteristics:**
- ✅ **NOT JSON** — Markdown/structured bullets for human review
- ✅ **GPT-5 Reasoning Model** — Creative reasoning first, avoid JSON crashes
- ✅ **Director Treatment Format** — Professional, cinematic planning
- ✅ **Human Reviewable** — Clear to creators, producers, QA teams

## 📋 Implementation Structure

### 1. **TypeScript Interfaces** (`types/studio-blueprint.ts`)

```typescript
export interface StudioBlueprint {
  id?: UUID;
  userId: UUID | null;
  sourceRefs: {
    analyzerRef?: string;
    refinerRef?: string;
    scriptRef?: string;
  };
  projectTitle: string;
  overview: ProjectOverview;
  scenes: SceneBlueprint[];
  audioArc: AudioArc;
  consistencyRules: ConsistencyRules;
  status: 'draft' | 'generated' | 'reviewed' | 'approved' | 'rejected';
  qualityScore?: number;
  humanReview?: HumanReview;
}
```

### 2. **Zod Validation Schemas** (`validators/studio-blueprint.ts`)

- ✅ **Runtime validation** with detailed error messages
- ✅ **Business logic checks** (duration consistency, scene validation)
- ✅ **Quality scoring** based on completeness and validation
- ✅ **TypeScript inference** for development

### 3. **GPT-5 Service** (`services/studioBlueprintService.ts`)

```typescript
export class StudioBlueprintService {
  async generateBlueprint(request: CreateBlueprintRequest): Promise<CreateBlueprintResponse> {
    // 1. Generate GPT-5 prompt with structured template
    // 2. Call GPT-5 with reasoning_effort: 'high'
    // 3. Parse markdown response into structured data
    // 4. Validate and return complete blueprint
  }
}
```

### 4. **Database Schema** (`docs/supabase-studio-blueprint-schema.sql`)

```sql
CREATE TABLE studio_blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  project_title TEXT NOT NULL,
  overview JSONB NOT NULL,
  scenes JSONB NOT NULL,
  audio_arc JSONB NOT NULL,
  consistency_rules JSONB NOT NULL,
  status TEXT DEFAULT 'draft',
  quality_score NUMERIC,
  human_review JSONB,
  -- ... timestamps and indexes
);
```

### 5. **API Endpoints** (`app/api/production-planner/studio-blueprint/`)

- ✅ **POST** `/api/production-planner/studio-blueprint` — Generate blueprint
- ✅ **GET** `/api/production-planner/studio-blueprint?id={id}` — Get blueprint
- ✅ **GET** `/api/production-planner/studio-blueprint?userId={id}` — List user blueprints
- ✅ **PUT** `/api/production-planner/studio-blueprint` — Update blueprint
- ✅ **DELETE** `/api/production-planner/studio-blueprint?id={id}` — Delete blueprint
- ✅ **PUT** `/api/production-planner/studio-blueprint/status` — Update status

## 🧠 GPT-5 Prompt Template

The system uses a structured prompt template that enforces the exact markdown format:

```typescript
function generateStudioBlueprintPrompt(input: BlueprintGenerationInput): string {
  return `You are a creative director planning a short-form video production.

INPUTS:
- User Intent: "${userIntent}"
- User Assets: ${userAssets.map(a => `\n  - ${a.id}: ${a.type} - "${a.description}"`).join('')}
- Duration: ${constraints.duration} seconds
- Platform: ${constraints.platform}
- Language: ${constraints.language}
- Tone: ${constraints.tone}

TASK:
Write a human-readable production plan in Markdown format.

REQUIRED STRUCTURE:
# Production Plan: [Project Title]

## Overview
- Intent: [video/image/audio]
- Duration: [XX seconds]
- Aspect Ratio: [16:9, 9:16, etc.]
- Platform: [YouTube, TikTok, etc.]
- Language: [English]
- Tone: [Inspirational / Informative / etc.]

## Scenes
### Scene 1: [Purpose: Hook]
- Duration: X sec
- Narration: "..."
- Voice: [ElevenLabs / Style: Friendly Female]
- Visuals:
  - [User Asset: graduation photo, slow zoom in]
  - [AI Gen Asset: "Cinematic campus b-roll"]
- Effects: [cinematic_zoom, fade_in]
- Music: [neutral, intro]

## Audio Arc
- Intro: light neutral music
- Build: uplifting motivational
- Outro: resolve, soft fade
- SFX: whoosh at scene 1 transition

## Consistency Rules
- Faces locked (AI generation consistent)
- Voice consistent (same ElevenLabs voice)
- Brand colors: #0F172A, #3B82F6
- Enforce text→image→video pipeline

CRITICAL REQUIREMENTS:
- Do NOT output JSON
- Do NOT use code fences unless explicitly asked
- Style: concise, professional, creative treatment
- Each scene must have purpose, narration, visuals, audio, and effects
- Music arc and SFX must be called out
- Consistency rules must be summarized
- No hallucinated metadata (only reference "User Asset" or "AI Gen Asset")
- Make it readable by humans (creator, producer, QA)
- Ensure total scene durations match the specified duration
- Use creative, engaging descriptions that inspire production teams

RESPOND WITH ONLY THE COMPLETE HUMAN-READABLE PRODUCTION PLAN:`;
}
```

## 📊 Markdown Parser

The system includes a sophisticated markdown parser that converts the human-readable output into structured data:

```typescript
function parseMarkdownBlueprint(markdown: string): Partial<StudioBlueprint> {
  // 1. Parse project title from # Production Plan: [Title]
  // 2. Parse overview section with key-value pairs
  // 3. Parse scenes with detailed breakdowns
  // 4. Parse audio arc with intro/build/outro/SFX
  // 5. Parse consistency rules
  // 6. Return structured StudioBlueprint object
}
```

## ✅ Success Criteria

Phase 3 is successful when:

1. ✅ **Output is clear to humans** — No JSON parsing required
2. ✅ **Each scene has complete details** — Purpose, narration, visuals, audio, effects
3. ✅ **Music arc and SFX called out** — Clear audio progression
4. ✅ **Consistency rules summarized** — Brand, voice, visual guidelines
5. ✅ **No hallucinated metadata** — Only references "User Asset" or "AI Gen Asset"
6. ✅ **Duration compliance** — Scene durations match total duration
7. ✅ **Professional treatment** — Director-grade creative planning

## 🔗 Integration with Later Phases

Phase 3 feeds directly into **Phase 4 — Manifest Serialization**:

```
Phase 3: Human-readable Plan → Phase 4: Machine-enforceable Manifest
```

The human plan is parsed by a stricter serializer that maps:
- **Narration** → `audio.ttsDefaults` + `narrationMap`
- **Visuals** → `assets[]` + `jobs[]`
- **Music arcs** → `audio.music.cueMap`
- **Consistency rules** → `consistency` block

## 🚀 Usage Examples

### Generate Studio Blueprint

```typescript
const request: CreateBlueprintRequest = {
  userId: "user-123",
  input: {
    userIntent: "Create a 60-second educational video about online learning",
    userAssets: [
      {
        id: "asset_1",
        type: "image",
        description: "Graduation photo of a student"
      }
    ],
    constraints: {
      duration: 60,
      language: "English",
      aspectRatio: "16:9",
      platform: "YouTube",
      tone: "Professional"
    },
    options: {
      creativeLevel: "professional",
      includeMusicArc: true,
      includeConsistencyRules: true,
      maxScenes: 5
    }
  },
  options: {
    model: "gpt-5",
    temperature: 0.7,
    maxTokens: 4000
  }
};

const response = await fetch('/api/production-planner/studio-blueprint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(request)
});

const result = await response.json();
// result.data contains the complete StudioBlueprint
```

### Update Blueprint Status

```typescript
await fetch('/api/production-planner/studio-blueprint/status', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: blueprintId,
    status: 'approved',
    reviewData: {
      reviewedBy: 'producer-123',
      feedback: 'Great creative direction!',
      suggestedChanges: ['Consider adding more visual variety']
    }
  })
});
```

## 🧪 Testing

### Test Page: `/test-production-planner-phase3`

The test page validates:
1. ✅ **Input validation** — Zod schema validation
2. ✅ **Blueprint generation** — GPT-5 integration
3. ✅ **Database storage** — Supabase operations
4. ✅ **API endpoints** — CRUD operations
5. ✅ **Status updates** — Human review workflow

### Example Test Output

```
✅ Input Validation: Test input passes validation.
✅ Studio Blueprint Generation: Successfully generated blueprint "Online Learning Benefits"
   - ID: 123e4567-e89b-12d3-a456-426614174000
   - Status: generated
   - Quality Score: 0.85
   - Processing Time: 3247ms
   - Scenes: 3
   - Warnings: 0
✅ Blueprint Retrieval: Successfully retrieved blueprint
✅ Status Update: Successfully updated blueprint status to 'reviewed'
✅ User Blueprints List: Retrieved 1 blueprints for user
```

## 📈 Quality Metrics

The system tracks:
- **Quality Score** (0-1) — Based on validation and completeness
- **Processing Time** — GPT-5 generation duration
- **Scene Count** — Number of scenes generated
- **Warnings** — Validation warnings and suggestions
- **Human Review Status** — Approval/rejection workflow

## 🔄 Workflow Integration

```
User Input → Analyzer → Refiner → Script Enhancer → Studio Blueprint (Phase 3) → Production Manifest (Phase 4) → Worker Execution
```

Phase 3 serves as the **creative reasoning layer** that bridges human creativity with machine execution, ensuring that the final production manifest is based on sound creative direction rather than just technical requirements.

## 🎯 Next Steps

Phase 3 is complete and ready for **Phase 4 — Manifest Serialization**, which will convert the human-readable Studio Blueprint into a machine-enforceable Production Manifest for worker execution.
