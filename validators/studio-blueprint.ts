/**
 * 🎬 Studio Blueprint Zod Schemas - Phase 3
 * 
 * Zod validation schemas for the Studio Blueprint system.
 * These schemas provide runtime validation and TypeScript inference.
 */

import { z } from "zod";

// ========================================
// 1. BASIC TYPES
// ========================================

const UUIDSchema = z.string().uuid();
const ISODateSchema = z.string().datetime();

// ========================================
// 2. PROJECT OVERVIEW SCHEMA
// ========================================

export const ProjectOverviewSchema = z.object({
  intent: z.enum(['video', 'image', 'audio']),
  duration: z.number().positive(),
  aspectRatio: z.string().min(1),
  platform: z.string().min(1),
  language: z.string().min(1),
  tone: z.string().min(1),
  
  // Optional fields
  targetAudience: z.string().optional(),
  brandGuidelines: z.string().optional(),
  specialRequirements: z.array(z.string()).optional(),
});

// ========================================
// 3. VOICE CONFIGURATION SCHEMA
// ========================================

export const VoiceConfigSchema = z.object({
  provider: z.enum(['elevenlabs', 'openai', 'azure', 'custom']),
  voiceId: z.string().optional(),
  style: z.string().min(1),
  characteristics: z.object({
    tone: z.string().optional(),
    pace: z.string().optional(),
    energy: z.string().optional(),
    accent: z.string().optional(),
  }).optional(),
});

// ========================================
// 4. VISUAL ELEMENT SCHEMA
// ========================================

export const VisualElementSchema = z.object({
  type: z.enum(['user_asset', 'ai_generated', 'stock', 'chart', 'text_overlay', 'background']),
  description: z.string().min(1),
  assetId: z.string().optional(),
  positioning: z.object({
    layer: z.number().int().min(1).max(10),
    position: z.enum(['center', 'left', 'right', 'top', 'bottom']).optional(),
    size: z.enum(['full', 'half', 'quarter', 'custom']).optional(),
  }).optional(),
  timing: z.object({
    startAtSec: z.number().min(0).optional(),
    durationSec: z.number().positive().optional(),
  }).optional(),
});

// ========================================
// 5. MUSIC CUE SCHEMA
// ========================================

export const MusicCueSchema = z.object({
  style: z.string().min(1),
  intensity: z.enum(['low', 'medium', 'high']),
  description: z.string().min(1),
  timing: z.object({
    startAtSec: z.number().min(0).optional(),
    durationSec: z.number().positive().optional(),
  }).optional(),
});

// ========================================
// 6. SCENE BLUEPRINT SCHEMA
// ========================================

export const SceneBlueprintSchema = z.object({
  id: z.string().min(1),
  purpose: z.string().min(1),
  duration: z.number().positive(),
  
  // Narration
  narration: z.string().min(1),
  voice: VoiceConfigSchema,
  
  // Visuals
  visuals: z.array(VisualElementSchema).min(1),
  
  // Effects
  effects: z.array(z.string()).default([]),
  
  // Music
  music: MusicCueSchema,
  
  // Additional Notes
  notes: z.string().optional(),
});

// ========================================
// 7. AUDIO ARC SCHEMA
// ========================================

export const AudioSegmentSchema = z.object({
  description: z.string().min(1),
  style: z.string().min(1),
  intensity: z.enum(['low', 'medium', 'high']),
  duration: z.number().positive().optional(),
});

export const SoundEffectSchema = z.object({
  name: z.string().min(1),
  timing: z.string().min(1),
  description: z.string().optional(),
});

export const AudioArcSchema = z.object({
  intro: AudioSegmentSchema,
  build: AudioSegmentSchema,
  outro: AudioSegmentSchema,
  soundEffects: z.array(SoundEffectSchema).default([]),
});

// ========================================
// 8. CONSISTENCY RULES SCHEMA
// ========================================

export const ConsistencyRulesSchema = z.object({
  faces: z.string().min(1),
  voice: z.string().min(1),
  typography: z.string().min(1),
  colorPalette: z.array(z.string()).min(1),
  branding: z.string().min(1),
  
  // Optional fields
  visualStyle: z.string().optional(),
  animationStyle: z.string().optional(),
  transitionStyle: z.string().optional(),
  qualityStandards: z.array(z.string()).optional(),
});

// ========================================
// 9. HUMAN REVIEW SCHEMA
// ========================================

export const HumanReviewSchema = z.object({
  reviewedBy: z.string().optional(),
  reviewedAt: ISODateSchema.optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'needs_revision']),
  feedback: z.string().optional(),
  suggestedChanges: z.array(z.string()).optional(),
  approvedScenes: z.array(z.string()).optional(),
  rejectedScenes: z.array(z.string()).optional(),
});

// ========================================
// 10. MAIN STUDIO BLUEPRINT SCHEMA
// ========================================

export const StudioBlueprintSchema = z.object({
  // Metadata
  id: UUIDSchema.optional(),
  createdAt: ISODateSchema.optional(),
  userId: UUIDSchema.nullable(),
  
  // Source References
  sourceRefs: z.object({
    analyzerRef: z.string().optional(),
    refinerRef: z.string().optional(),
    scriptRef: z.string().optional(),
  }).optional(),
  
  // Blueprint Content
  projectTitle: z.string().min(1),
  overview: ProjectOverviewSchema,
  scenes: z.array(SceneBlueprintSchema).min(1),
  audioArc: AudioArcSchema,
  consistencyRules: ConsistencyRulesSchema,
  
  // Processing Metadata
  status: z.enum(['draft', 'generated', 'reviewed', 'approved', 'rejected']).default('draft'),
  qualityScore: z.number().min(0).max(1).optional(),
  processingTimeMs: z.number().positive().optional(),
  warnings: z.array(z.string()).optional(),
  
  // Human Review
  humanReview: HumanReviewSchema.optional(),
});

// ========================================
// 11. INPUT DATA SCHEMAS
// ========================================

export const UserAssetSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['image', 'video', 'audio', 'text']),
  description: z.string().min(1),
  url: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
});

export const BlueprintGenerationInputSchema = z.object({
  // User Input
  userIntent: z.string().min(1),
  userAssets: z.array(UserAssetSchema).default([]),
  
  // Analysis Results
  analyzerOutput: z.any().optional(),
  refinerOutput: z.any().optional(),
  scriptOutput: z.any().optional(),
  
  // Constraints
  constraints: z.object({
    duration: z.number().positive().optional(),
    language: z.string().optional(),
    aspectRatio: z.string().optional(),
    platform: z.string().optional(),
    tone: z.string().optional(),
  }),
  
  // Generation Options
  options: z.object({
    creativeLevel: z.enum(['basic', 'professional', 'cinematic']).default('professional'),
    includeMusicArc: z.boolean().default(true),
    includeConsistencyRules: z.boolean().default(true),
    maxScenes: z.number().int().positive().max(20).default(10),
  }).optional(),
});

// ========================================
// 12. API REQUEST/RESPONSE SCHEMAS
// ========================================

export const CreateBlueprintRequestSchema = z.object({
  userId: UUIDSchema,
  input: BlueprintGenerationInputSchema,
  options: z.object({
    model: z.enum(['gpt-5', 'claude-3.5-sonnet', 'gpt-4o']).default('gpt-5'),
    temperature: z.number().min(0).max(2).default(0.7),
    maxTokens: z.number().int().positive().max(8000).default(4000),
  }).optional(),
});

export const CreateBlueprintResponseSchema = z.object({
  success: z.boolean(),
  data: StudioBlueprintSchema.optional(),
  error: z.string().optional(),
  processingTimeMs: z.number().positive().optional(),
  warnings: z.array(z.string()).optional(),
});

export const UpdateBlueprintRequestSchema = z.object({
  id: UUIDSchema,
  updates: StudioBlueprintSchema.partial(),
});

// ========================================
// 13. VALIDATION RESULT SCHEMAS
// ========================================

export const BlueprintValidationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
  severity: z.enum(['error', 'warning', 'info']),
  suggestion: z.string().optional(),
});

export const BlueprintValidationResultSchema = z.object({
  valid: z.boolean(),
  errors: z.array(BlueprintValidationErrorSchema),
  warnings: z.array(z.string()),
  qualityScore: z.number().min(0).max(1),
});

// ========================================
// 14. BLUEPRINT TO MANIFEST MAPPING SCHEMA
// ========================================

export const BlueprintToManifestMappingSchema = z.object({
  blueprintId: UUIDSchema,
  manifestId: UUIDSchema.optional(),
  conversionStatus: z.enum(['pending', 'in_progress', 'completed', 'failed']),
  mappingRules: z.object({
    narrationToTTS: z.boolean(),
    visualsToAssets: z.boolean(),
    musicToAudio: z.boolean(),
    effectsToJobs: z.boolean(),
  }),
  conversionErrors: z.array(z.string()).optional(),
  convertedAt: ISODateSchema.optional(),
});

// ========================================
// 15. EXPORTED TYPES
// ========================================

export type ProjectOverview = z.infer<typeof ProjectOverviewSchema>;
export type VoiceConfig = z.infer<typeof VoiceConfigSchema>;
export type VisualElement = z.infer<typeof VisualElementSchema>;
export type MusicCue = z.infer<typeof MusicCueSchema>;
export type SceneBlueprint = z.infer<typeof SceneBlueprintSchema>;
export type AudioArc = z.infer<typeof AudioArcSchema>;
export type ConsistencyRules = z.infer<typeof ConsistencyRulesSchema>;
export type HumanReview = z.infer<typeof HumanReviewSchema>;
export type StudioBlueprint = z.infer<typeof StudioBlueprintSchema>;
export type UserAsset = z.infer<typeof UserAssetSchema>;
export type BlueprintGenerationInput = z.infer<typeof BlueprintGenerationInputSchema>;
export type CreateBlueprintRequest = z.infer<typeof CreateBlueprintRequestSchema>;
export type CreateBlueprintResponse = z.infer<typeof CreateBlueprintResponseSchema>;
export type UpdateBlueprintRequest = z.infer<typeof UpdateBlueprintRequestSchema>;
export type BlueprintValidationError = z.infer<typeof BlueprintValidationErrorSchema>;
export type BlueprintValidationResult = z.infer<typeof BlueprintValidationResultSchema>;
export type BlueprintToManifestMapping = z.infer<typeof BlueprintToManifestMappingSchema>;

// ========================================
// 16. VALIDATION FUNCTIONS
// ========================================

/**
 * Validate a Studio Blueprint
 */
export function validateStudioBlueprint(blueprint: unknown): BlueprintValidationResult {
  try {
    const validated = StudioBlueprintSchema.parse(blueprint);
    
    // Additional business logic validation
    const errors: BlueprintValidationError[] = [];
    const warnings: string[] = [];
    
    // Check duration consistency
    const totalSceneDuration = validated.scenes.reduce((sum, scene) => sum + scene.duration, 0);
    if (Math.abs(totalSceneDuration - validated.overview.duration) > 1) {
      warnings.push(`Scene durations (${totalSceneDuration}s) don't match overview duration (${validated.overview.duration}s)`);
    }
    
    // Check for duplicate scene IDs
    const sceneIds = validated.scenes.map(s => s.id);
    const duplicateIds = sceneIds.filter((id, index) => sceneIds.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      errors.push({
        field: 'scenes',
        message: `Duplicate scene IDs found: ${duplicateIds.join(', ')}`,
        severity: 'error'
      });
    }
    
    // Check for empty scenes
    const emptyScenes = validated.scenes.filter(s => !s.narration.trim() || s.visuals.length === 0);
    if (emptyScenes.length > 0) {
      warnings.push(`${emptyScenes.length} scene(s) have missing narration or visuals`);
    }
    
    // Calculate quality score
    let qualityScore = 1.0;
    if (errors.length > 0) qualityScore -= 0.3;
    if (warnings.length > 0) qualityScore -= 0.1;
    if (validated.scenes.length < 2) qualityScore -= 0.2;
    if (!validated.audioArc) qualityScore -= 0.1;
    if (!validated.consistencyRules) qualityScore -= 0.1;
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      qualityScore: Math.max(0, qualityScore)
    };
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          severity: 'error' as const,
          suggestion: `Expected ${err.expected}, got ${err.received}`
        })),
        warnings: [],
        qualityScore: 0
      };
    }
    
    return {
      valid: false,
      errors: [{
        field: 'unknown',
        message: error instanceof Error ? error.message : 'Unknown validation error',
        severity: 'error'
      }],
      warnings: [],
      qualityScore: 0
    };
  }
}

/**
 * Validate Blueprint Generation Input
 */
export function validateBlueprintInput(input: unknown): { valid: boolean; data?: BlueprintGenerationInput; error?: string } {
  try {
    const validated = BlueprintGenerationInputSchema.parse(input);
    return { valid: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        error: `Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`
      };
    }
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown validation error'
    };
  }
}
