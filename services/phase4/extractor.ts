// services/phase4/extractor.ts
// Use mock executor for testing - replace with real implementation in production
import { executeGPT4oMini } from './mockExecutors';

/**
 * Extractor Prompt (GPT-4o-mini)
 * 
 * Lightweight → deterministic JSON emission from text plan
 * Takes Phase 3 "human-readable plan" and emits clean JSON draft manifest
 */
export const extractorPrompt = `You are a JSON extractor that converts a human-readable production plan into a structured JSON manifest draft.

### Input:
The input is a director-style treatment in plain text or markdown.
It may include:
- Language, duration, aspect ratio, platform, style
- Scene breakdowns with narration, purpose, duration
- Mentions of assets, effects, music, voice style
- Brand colors or logos
- Consistency rules

### Output:
Return **only JSON** with the following structure (partial manifest draft):
{
  "metadata": {
    "intent": "video",
    "durationSeconds": number,
    "aspectRatio": string,
    "platform": string,
    "language": string,
    "profile": string
  },
  "scenes": [
    {
      "id": string,
      "durationSeconds": number,
      "purpose": string,
      "narration": string,
      "effects": { "layeredEffects": [string] },
      "visuals": []
    }
  ],
  "assets": {},
  "audio": {
    "ttsDefaults": { "provider": "elevenlabs" },
    "music": { "cueMap": {} }
  },
  "consistency": {}
}

### Rules:
- Always output valid JSON. No explanations, no comments.
- If information missing, leave as empty string, null, or empty object.
- Scene IDs must be sequential: "s1", "s2", "s3".
- narration must always be string (use "" if missing).
- durationSeconds must be a number (fallback 10 if unknown).
- language fallback: "en".`;

/**
 * Calls GPT-4o-mini to extract structured JSON from human-readable treatment
 */
export async function callExtractorLLM(treatmentText: string, hints: { totalDurationSeconds: number; profile?: string }): Promise<any | null> {
  try {
    const response = await executeGPT4oMini({
      prompt: `${extractorPrompt}\n\n### Treatment Text:\n${treatmentText}\n\n### Hints:\n${JSON.stringify(hints, null, 2)}`,
      max_completion_tokens: 1000,
      temperature: 0.1, // Low temperature for deterministic output
      response_format: { type: "json_object" },
    });

    const extracted = JSON.parse(response.text);
    
    // Basic validation - ensure it has the expected structure
    if (extracted && typeof extracted === 'object' && Array.isArray(extracted.scenes)) {
      return extracted;
    }
    
    return null;
  } catch (error: any) {
    console.error("Extractor LLM failed:", error);
    return null;
  }
}