// services/phase4/repair.ts
// Use mock executor for testing - replace with real implementation in production
import { executeGPT5 } from './mockExecutors';
import manifestSchema from '../../validators/production-manifest.schema.json';

/**
 * Repair Prompt (GPT-5)
 * 
 * Reasoning model → validate, fix, and enrich JSON draft for AJV compliance
 * Takes invalid JSON and both repairs & validates it (structural + semantic)
 */
export const repairPrompt = `You are a JSON repair and validation assistant.

### Input:
You will be given a Production Manifest draft (JSON) that may be malformed or incomplete.
You will also be given the JSON schema definition (AJV).

### Objective:
1. Validate the JSON against the schema.
2. If errors are found:
   - Fix structural errors (missing required fields, wrong types).
   - Add safe defaults for missing values:
     - durationSeconds: 10
     - aspectRatio: "16:9"
     - platform: "youtube"
     - language: "en"
     - intent: "video"
   - Ensure all arrays and objects required by schema exist, even if empty.
   - Ensure scene IDs are unique and sequential ("s1", "s2", ...).
   - Ensure jobs array exists with at least one TTS job if narration is present.
3. Never remove valid fields. Only repair or enrich.
4. Return **only the fixed JSON** — no comments, no prose.

### Output:
A valid JSON manifest that fully complies with the provided schema.`;

/**
 * Calls GPT-5 to repair malformed JSON manifest based on AJV errors
 */
export async function callGptRepair(
  manifest: any, 
  ajvErrors: any[], 
  context: any = {}
): Promise<any | null> {
  try {
    const response = await executeGPT5({
      prompt: `${repairPrompt}

### Malformed JSON Manifest:
\`\`\`json
${JSON.stringify(manifest, null, 2)}
\`\`\`

### AJV Schema:
\`\`\`json
${JSON.stringify(manifestSchema, null, 2)}
\`\`\`

### AJV Validation Errors:
\`\`\`json
${JSON.stringify(ajvErrors, null, 2)}
\`\`\`

### Context (Analyzer, Refiner, Script outputs):
\`\`\`json
${JSON.stringify(context, null, 2)}
\`\`\`

Return the repaired JSON manifest:`,
      reasoning_effort: 'low', // Focus on strict fixing, not creativity
      verbosity: 'low',
      max_completion_tokens: 4000,
      temperature: 0.1, // Aim for deterministic output
      response_format: { type: "json_object" },
    });

    const repaired = JSON.parse(response.text);
    
    // Basic safety check
    if (repaired && typeof repaired === 'object' && Array.isArray(repaired.scenes)) {
      return repaired;
    }
    
    return null;
  } catch (error: any) {
    console.error("GPT-5 repair failed:", error);
    return null;
  }
}
