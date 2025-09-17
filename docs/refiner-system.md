# Step 2a: Refiner = Polished JSON Upgrade

## Overview

The Refiner system is Step 2a in the DreamCut pipeline that takes the **CLEAN RICH JSON OUTPUT** from the query-analyzer and upgrades it into a polished, confident, production-ready JSON format.

## Key Features

- **Smarter** → Binds prompts to actual assets
- **Confident** → No placeholders like "**"
- **Tiered** → Required vs recommended actions
- **Consistent** → Normalized roles, strict schema
- **Reliable** → Claude 3 Haiku primary + GPT-4o-mini fallback
- **Safe** → Zod validation ensures JSON safety

## Architecture

```
Query Analyzer JSON → Refiner Service → Polished JSON
     ↓                    ↓                ↓
Raw Analysis        AI Enhancement    Production Ready
```

### Models Used

1. **Primary**: Claude 3 Haiku (fast + structured)
2. **Fallback**: GPT-4o-mini (reliable backup)

Both models run via Replicate for JSON reliability.

## API Endpoint

```
POST /api/dreamcut/refiner
```

### Request Format

```json
{
  "analyzerJson": {
    // CLEAN RICH JSON OUTPUT from query-analyzer
  },
  "options": {
    "useFallback": false,
    "maxRetries": 2,
    "timeoutMs": 30000,
    "enableLogging": true
  },
  "metadata": {
    "userId": "user-123",
    "sessionId": "session-456",
    "source": "web-app"
  }
}
```

### Response Format

```json
{
  "success": true,
  "data": {
    // Polished Refiner JSON
  },
  "metadata": {
    "refinerId": "ref_abc123",
    "modelUsed": "claude-3-haiku",
    "processingTimeMs": 1500,
    "retryCount": 0,
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

## Input/Output Schema

### Analyzer Input Schema

The refiner expects the CLEAN RICH JSON OUTPUT from the query-analyzer with this structure:

```typescript
{
  user_request: {
    original_prompt: string;
    intent: "image" | "video" | "audio" | "mixed";
    duration_seconds?: number;
    aspect_ratio?: string;
    platform?: string;
    image_count?: number;
  };
  prompt_analysis: {
    user_intent_description?: string;
    reformulated_prompt?: string;
    clarity_score?: number;
    suggested_improvements?: string[];
    content_type_analysis?: object;
  };
  assets: Array<{
    id: string;
    type: "image" | "video" | "audio";
    user_description?: string;
    ai_caption?: string;
    objects_detected?: string[];
    style?: string;
    mood?: string;
    quality_score?: number;
    role?: string;
    recommended_edits?: string[];
  }>;
  // ... other analyzer fields
}
```

### Refiner Output Schema

The refiner produces a polished JSON with enhanced structure:

```typescript
{
  user_request: {
    original_prompt: string;
    intent: "image" | "video" | "audio" | "mixed";
    duration_seconds?: number;
    aspect_ratio?: string;
    platform?: string;
    image_count?: number;
  };
  prompt_analysis: {
    user_intent_description: string; // min 10 chars, confident
    reformulated_prompt: string; // min 10 chars, confident
    clarity_score: number; // 1-10
    suggested_improvements: string[];
    content_type_analysis: {
      needs_explanation: boolean;
      needs_charts: boolean;
      needs_diagrams: boolean;
      needs_educational_content: boolean;
      content_complexity: "simple" | "moderate" | "complex";
      requires_visual_aids: boolean;
      is_instructional: boolean;
      needs_data_visualization: boolean;
      requires_interactive_elements: boolean;
      content_category: string;
    };
  };
  assets: Array<{
    id: string;
    type: "image" | "video" | "audio";
    user_description: string;
    ai_caption: string; // min 10 chars, detailed
    objects_detected: string[];
    style: string; // min 3 chars, specific
    mood: string; // min 3 chars, specific
    quality_score: number; // 0-1
    role: "primary subject reference" | "supporting material" | 
          "primary footage" | "supporting clip" | 
          "soundtrack" | "voiceover" | "sound effect";
    recommended_edits: Array<{
      action: string;
      priority: "required" | "recommended";
      reason?: string;
    }>;
  }>;
  global_analysis: {
    goal: string; // min 10 chars, clear goal
    constraints: {
      duration_seconds?: number;
      aspect_ratio?: string;
      platform?: string;
    };
    asset_roles: Record<string, string>;
    conflicts: Array<{
      issue: string;
      resolution: string;
      severity: "low" | "moderate" | "high" | "critical";
    }>;
  };
  creative_options: Array<{
    id: string;
    title: string;
    short: string;
    reasons: string[];
    estimatedWorkload: "low" | "medium" | "high";
  }>;
  creative_direction: {
    core_concept: string; // min 10 chars, confident
    visual_approach: string; // min 10 chars, confident
    style_direction: string; // min 10 chars, confident
    mood_atmosphere: string; // min 10 chars, confident
  };
  production_pipeline: {
    workflow_steps: string[];
    estimated_time: string;
    success_probability: number; // 0-1
    quality_targets: {
      technical_quality_target: "low" | "medium" | "high" | "professional";
      creative_quality_target: "basic" | "appealing" | "excellent" | "outstanding";
      consistency_target: "poor" | "fair" | "good" | "excellent";
      polish_level_target: "rough" | "basic" | "refined" | "polished";
    };
  };
  quality_metrics: {
    overall_confidence: number; // 0-1
    analysis_quality: number; // 1-10
    completion_status: "complete" | "partial" | "failed";
    feasibility_score: number; // 0-1
  };
  challenges: Array<{
    type: "quality" | "technical" | "creative" | "resource" | "timeline";
    description: string; // min 10 chars, detailed
    impact: "low" | "moderate" | "high" | "critical";
  }>;
  recommendations: Array<{
    type: "quality" | "creative" | "technical" | "resource" | "timeline";
    recommendation: string; // min 10 chars, detailed
    priority: "required" | "recommended";
  }>;
}
```

## Key Improvements Made

### 1. Smarter Prompts
- **Before**: Generic reformulated prompts
- **After**: Prompts bound to actual asset context
- **Example**: "Create a vibrant graduation portrait" instead of "Create content"

### 2. Confident Creative Direction
- **Before**: Placeholders like "**" or vague concepts
- **After**: Specific, confident concepts, approaches, styles, and moods
- **Example**: "Celebrate achievement through a vibrant graduation portrait"

### 3. Normalized Asset Roles
- **Before**: Inconsistent role descriptions
- **After**: Standardized roles:
  - Images → "primary subject reference" or "supporting material"
  - Videos → "primary footage" or "supporting clip"
  - Audio → "soundtrack", "voiceover", or "sound effect"

### 4. Tiered Recommendations
- **Before**: Generic recommendations
- **After**: Priority-based system:
  - "required" if quality_score < 0.7 OR asset critical to project
  - "recommended" for polish or style upgrades

### 5. Enhanced Conflict Detection
- **Before**: Basic conflict identification
- **After**: Comprehensive conflict analysis with resolutions:
  - Aspect ratio mismatches
  - Duration conflicts
  - Quality issues
  - Technical constraints

### 6. Strict Schema Validation
- **Before**: Loose validation
- **After**: Zod schema ensures all outputs are valid and complete

## Usage Examples

### Basic Usage

```typescript
import { refineAnalyzerJSON } from '@/lib/analyzer/refiner-service';

const result = await refineAnalyzerJSON(analyzerJson, {
  enableLogging: true
});

if (result.success) {
  console.log('Refined JSON:', result.data);
  console.log('Model used:', result.modelUsed);
  console.log('Processing time:', result.processingTimeMs);
}
```

### API Usage

```typescript
const response = await fetch('/api/dreamcut/refiner', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    analyzerJson: yourAnalyzerJson,
    options: { enableLogging: true },
    metadata: { userId: 'user-123' }
  })
});

const result = await response.json();
```

### Batch Processing

```typescript
import { batchRefineAnalyzerJSON } from '@/lib/analyzer/refiner-service';

const results = await batchRefineAnalyzerJSON(analyzerJsonArray, {
  enableLogging: true
});
```

## Error Handling

The refiner includes comprehensive error handling:

1. **Input Validation**: Zod schema validation
2. **Model Failures**: Automatic fallback from Claude to GPT
3. **JSON Parsing**: Validation of AI-generated JSON
4. **Timeout Handling**: Configurable timeouts
5. **Retry Logic**: Configurable retry attempts

## Cost Estimation

```typescript
import { estimateRefinerCost } from '@/lib/analyzer/refiner-service';

const claudeCost = estimateRefinerCost(analyzerJson, 'claude-3-haiku');
const gptCost = estimateRefinerCost(analyzerJson, 'gpt-4o-mini');
```

## Health Check

```typescript
import { refinerServiceHealthCheck } from '@/lib/analyzer/refiner-service';

const health = await refinerServiceHealthCheck();
console.log('Service healthy:', health.healthy);
console.log('Claude 3 Haiku:', health.models.claude3Haiku);
console.log('GPT-4o-mini:', health.models.gpt4oMini);
```

## Testing

Visit `/test-refiner` to test the refiner system with sample data.

## Integration with Supabase

The refiner automatically stores results in Supabase:

- **Table**: `dreamcut_refiner_results`
- **Fields**: analyzer_json, refiner_json, model_used, processing_time_ms, etc.
- **Indexing**: By user_id, session_id, and created_at

## Performance

- **Claude 3 Haiku**: ~1-3 seconds for typical JSON
- **GPT-4o-mini**: ~2-4 seconds for typical JSON
- **Fallback**: Automatic if primary model fails
- **Validation**: <100ms for Zod schema validation

## Security

- **Input Validation**: Strict Zod schema validation
- **Output Validation**: Ensures JSON safety before storage
- **API Keys**: Secure handling via environment variables
- **Error Handling**: No sensitive data in error messages

## Monitoring

- **Logging**: Comprehensive logging with configurable levels
- **Metrics**: Processing time, retry counts, model usage
- **Health Checks**: Regular service health monitoring
- **Error Tracking**: Detailed error reporting and analysis

## Next Steps

After refinement, the polished JSON is ready for:
- **Step 2b**: Production Planning
- **Step 3**: Asset Processing
- **Step 4**: Content Generation

The refiner ensures that all downstream processes receive high-quality, confident, and structured data.
