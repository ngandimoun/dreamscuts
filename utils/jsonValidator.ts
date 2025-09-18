/**
 * 🔧 JSON Validator & Repair Middleware for GPT-5
 * 
 * Handles incomplete/truncated JSON responses from GPT-5 with:
 * - JSON extraction from <json>...</json> tags
 * - Local repair attempts for common issues
 * - GPT-5 retry strategy for broken JSON
 * - Schema validation with Zod
 */

import { z } from "zod";

// ✅ Define your script schema with Zod
const SceneSchema = z.object({
  scene_id: z.string(),
  duration: z.number(),
  narration: z.string(),
  visual_anchor: z.string(),
  suggested_effects: z.array(z.union([
    z.string(),
    z.object({
      type: z.string(),
      params: z.record(z.any()).optional()
    })
  ])).optional(),
  music_cue: z.string().optional(),
  subtitles: z.string().optional(),
  scene_purpose: z.string().optional(),
  emotional_tone: z.string().optional(),
  visual_treatment: z.object({
    role: z.string(),
    visual_type: z.string(),
    camera_angle: z.string(),
    lighting: z.string(),
    composition: z.string(),
    treatment_note: z.string().optional()
  }).optional()
});

const ScriptSchema = z.object({
  script_metadata: z.object({
    profile: z.string(),
    duration_seconds: z.number(),
    orientation: z.string(),
    language: z.string(),
    total_scenes: z.number(),
    estimated_word_count: z.number(),
    pacing_style: z.string()
  }),
  scenes: z.array(SceneSchema),
  global_voiceover: z.record(z.any()).optional(),
  music_plan: z.record(z.any()).optional(),
  asset_integration: z.record(z.any()).optional(),
  quality_assurance: z.record(z.any()).optional(),
  consistency: z.record(z.any()).optional(),
  scene_enrichment: z.record(z.any()).optional()
});

export type Script = z.infer<typeof ScriptSchema>;

/**
 * Extract JSON from LLM output between <json>...</json>.
 * Handles cases where closing tag is missing or JSON is incomplete.
 */
export function extractJson(llmText: string): string | null {
  // First try to find complete JSON with both tags
  const completeMatch = llmText.match(/<json>([\s\S]*?)<\/json>/);
  if (completeMatch) return completeMatch[1].trim();
  
  // If no closing tag, extract everything after <json>
  const openTagMatch = llmText.match(/<json>([\s\S]*)/);
  if (openTagMatch) {
    const extracted = openTagMatch[1].trim();
    // Remove any trailing text that's not JSON (like explanations)
    const jsonEndMatch = extracted.match(/^([\s\S]*?)(?:\n\n|\n[A-Z]|$)/);
    return jsonEndMatch ? jsonEndMatch[1].trim() : extracted;
  }
  
  return null;
}

/**
 * Try parsing JSON, with comprehensive repairs for common GPT-5 issues.
 */
export function safeParseJson(raw: string): { valid: boolean; data?: any; error?: string } {
  try {
    return { valid: true, data: JSON.parse(raw) };
  } catch (err: any) {
    // 🛠 Attempt comprehensive repairs
    let fixed = raw;

    // Remove any leading/trailing whitespace and newlines
    fixed = fixed.trim();

    // Fix incomplete strings at the end
    if (fixed.endsWith('"') && !fixed.endsWith('""')) {
      fixed = fixed.slice(0, -1) + '""';
    }

    // Fix incomplete strings in the middle (common GPT-5 issue)
    fixed = fixed.replace(/"\s*$/, '""');

    // Fix unclosed objects/arrays by counting braces
    if (!fixed.endsWith("}") && !fixed.endsWith("]")) {
      const openBraces = (fixed.match(/\{/g) || []).length;
      const closeBraces = (fixed.match(/\}/g) || []).length;
      const openBrackets = (fixed.match(/\[/g) || []).length;
      const closeBrackets = (fixed.match(/\]/g) || []).length;
      
      // Add missing closing braces/brackets
      for (let i = 0; i < openBraces - closeBraces; i++) {
        fixed += "}";
      }
      for (let i = 0; i < openBrackets - closeBrackets; i++) {
        fixed += "]";
      }
    }

    // Fix trailing commas (common JSON issue)
    fixed = fixed.replace(/,(\s*[}\]])/g, '$1');

    // Remove incomplete property after array/object closing (do this first)
    // Be more specific - only remove if there's a quote followed by incomplete content
    if (fixed.match(/\]\s*,\s*"[\s\S]*$/)) {
      fixed = fixed.replace(/\]\s*,\s*"[\s\S]*$/, ']');
    }
    // Don't remove the entire rest of the JSON, just incomplete properties
    // Look for patterns like: }, "incomplete_property_name
    if (fixed.match(/\}\s*,\s*"[^"]*$/)) {
      fixed = fixed.replace(/\}\s*,\s*"[^"]*$/, '}');
    }
    
    // Fix incomplete property that starts with a quote after comma
    fixed = fixed.replace(/,\s*"$/, '');
    fixed = fixed.replace(/,\s*"\s*$/, '');
    
    // Fix incomplete property after array/object closing
    fixed = fixed.replace(/\]\s*,\s*"$/, ']');
    fixed = fixed.replace(/\}\s*,\s*"$/, '}');
    
    // Fix incomplete property that starts with a quote after comma
    fixed = fixed.replace(/:\s*"$/, ': ""');
    fixed = fixed.replace(/,\s*"$/, ', ""');
    
    // Fix incomplete property values
    fixed = fixed.replace(/:\s*$/, ': null');
    fixed = fixed.replace(/,\s*$/, '');

    try {
      return { valid: true, data: JSON.parse(fixed) };
    } catch (err2: any) {
      return { valid: false, error: err2.message };
    }
  }
}

/**
 * Validate JSON against schema (optional).
 */
export function validateScript(data: any): { valid: boolean; data?: Script; error?: string } {
  try {
    const parsed = ScriptSchema.parse(data);
    return { valid: true, data: parsed };
  } catch (err: any) {
    return { valid: false, error: err.message };
  }
}

/**
 * Truncate JSON for repair if it's too long for GPT-5 context
 */
export function truncateForRepair(raw: string, maxLength = 4000): string {
  // If response is huge, send only last chunk to GPT-5 for repair
  return raw.length > maxLength ? raw.slice(-maxLength) : raw;
}

/**
 * Generate repair prompt for GPT-5
 */
export function generateRepairPrompt(brokenJson: string): string {
  return `You are a strict JSON repair assistant for script generation.
Repair the following broken JSON into VALID JSON that matches the script schema.
Return ONLY valid JSON, no explanations, wrapped in <json>...</json>.

Broken JSON:
<json>
${truncateForRepair(brokenJson)}
</json>

REPAIR RULES:
1. Fix any unclosed braces, brackets, or strings
2. Complete any incomplete property values
3. Ensure the JSON structure is complete and valid
4. Add missing closing braces/brackets if needed
5. Fix any trailing commas or syntax errors
6. Return ONLY the repaired JSON between <json> and </json> tags
7. Do not add explanations, comments, or extra text

REQUIRED SCRIPT SCHEMA STRUCTURE:
- script_metadata: { profile, duration_seconds, orientation, language, total_scenes, estimated_word_count, pacing_style }
- scenes: array of scene objects with scene_id, duration, narration, visual_anchor, etc.
- global_voiceover: voice configuration
- music_plan: music and audio configuration
- asset_integration: asset usage information
- quality_assurance: quality metrics
- consistency: consistency rules
- scene_enrichment: visual treatment details

Repaired JSON:`;
}

/**
 * Comprehensive JSON validation and repair pipeline
 */
export async function validateAndRepairJson(
  llmText: string, 
  repairLLMCall: (prompt: string) => Promise<{ success: boolean; text?: string; error?: string }>
): Promise<{ valid: boolean; data?: any; error?: string; repaired?: boolean }> {
  
  console.log('🔍 [JSON Validation] Starting validation pipeline...');
  console.log('🔍 [JSON Validation] Original text length:', llmText.length);
  console.log('🔍 [JSON Validation] Contains <json> tags:', llmText.includes('<json>'));
  console.log('🔍 [JSON Validation] Contains </json> tags:', llmText.includes('</json>'));

  // 1. Extract JSON from tags
  let extracted = extractJson(llmText);
  if (!extracted) {
    console.log('🔍 [JSON Validation] No JSON tags found, trying raw text...');
    extracted = llmText.trim();
  }

  console.log('🔍 [JSON Validation] Found <json> tag, attempting extraction');
  console.log('🔍 [JSON Validation] JSON match found:', !!extracted);
  console.log('🔍 [JSON Validation] Full text preview:', llmText.substring(0, 200) + '...');

  // 2. Try parsing locally first
  let parsed = safeParseJson(extracted);
  console.log('🔍 [JSON Validation] Extracted JSON without closing tag, length:', extracted.length);
  console.log('🔍 [JSON Validation] Extracted JSON preview:', extracted.substring(0, 100) + '...');

  if (parsed.valid) {
    console.log('🔍 [JSON Validation] JSON parsing succeeded locally');
    return { valid: true, data: parsed.data, repaired: false };
  }

  console.log('🔍 [JSON Validation] JSON parsing failed:', parsed.error);
  console.log('🔍 [JSON Validation] Clean text preview:', extracted.substring(0, 200) + '...');

  // 3. Try local repair
  console.log('🔍 [JSON Repair] Attempting local repair...');
  let fixed = extracted;

  // Remove any trailing text that's not JSON
  const jsonEndMatch = fixed.match(/^([\s\S]*?)(?:\n\n[A-Z]|\n[A-Z][a-z]|$)/);
  if (jsonEndMatch) {
    fixed = jsonEndMatch[1].trim();
    console.log('🔍 [JSON Repair] Removed trailing non-JSON text');
  }

  // Fix incomplete strings at the end
  if (fixed.endsWith('"') && !fixed.endsWith('""')) {
    fixed = fixed.slice(0, -1) + '""';
    console.log('🔍 [JSON Repair] Fixed incomplete string at end');
  }

  // Remove incomplete property after array/object closing
  // Be more specific - only remove if there's a quote followed by incomplete content
  if (fixed.match(/\]\s*,\s*"[\s\S]*$/)) {
    fixed = fixed.replace(/\]\s*,\s*"[\s\S]*$/, ']');
    console.log('🔍 [JSON Repair] Removed incomplete property after array');
  }
  // Don't remove the entire rest of the JSON, just incomplete properties
  // Look for patterns like: }, "incomplete_property_name
  if (fixed.match(/\}\s*,\s*"[^"]*$/)) {
    fixed = fixed.replace(/\}\s*,\s*"[^"]*$/, '}');
    console.log('🔍 [JSON Repair] Removed incomplete property after object');
  }
  
  // Fix incomplete property that starts with a quote after comma
  fixed = fixed.replace(/,\s*"$/, '');
  fixed = fixed.replace(/,\s*"\s*$/, '');
  console.log('🔍 [JSON Repair] Fixed incomplete properties starting with quote');

  // Try to find the last complete object/array structure
  const lastCompleteBrace = fixed.lastIndexOf('}');
  const lastCompleteBracket = fixed.lastIndexOf(']');
  const lastComplete = Math.max(lastCompleteBrace, lastCompleteBracket);
  
  if (lastComplete > 0) {
    fixed = fixed.substring(0, lastComplete + 1);
    console.log('🔍 [JSON Repair] Truncated to last complete structure at position:', lastComplete);
  }

  // Apply comprehensive repairs
  const repairedParsed = safeParseJson(fixed);
  if (repairedParsed.valid) {
    console.log('🔍 [JSON Validation] JSON repair succeeded locally');
    return { valid: true, data: repairedParsed.data, repaired: true };
  }

  console.log('🔍 [JSON Repair] JSON repair failed:', repairedParsed.error);

  // 4. GPT-5 repair attempt
  console.warn('⚠️ JSON parse failed, retrying with GPT-5 repair…');
  
  try {
    const repairPrompt = generateRepairPrompt(extracted);
    const repairResponse = await repairLLMCall(repairPrompt);
    
    if (!repairResponse.success || !repairResponse.text) {
      return { valid: false, error: `GPT-5 repair failed: ${repairResponse.error}` };
    }

    const repairedText = repairResponse.text;
    const repairedExtracted = extractJson(repairedText) ?? repairedText;
    
    const finalParsed = safeParseJson(repairedExtracted);
    if (finalParsed.valid) {
      console.log('🔍 [JSON Validation] GPT-5 repair succeeded');
      return { valid: true, data: finalParsed.data, repaired: true };
    }

    return { valid: false, error: `GPT-5 repair failed: ${finalParsed.error}` };
  } catch (error: any) {
    return { valid: false, error: `Repair attempt failed: ${error.message}` };
  }
}
