/**
 * 🎬 Production Planner - Phase 0 Schemas
 * 
 * Zod validation schemas for the Production Planner system.
 * These schemas ensure type safety and validation for all production manifest data.
 */

import { z } from "zod";

// ========================================
// 1. CORE PRODUCTION TYPES
// ========================================

export const AssetTypeSchema = z.enum([
  'image', 'video', 'audio', 'text', 'chart', 'effect'
]);

export const AssetSourceSchema = z.enum([
  'user_upload', 'ai_generated', 'stock', 'enhanced'
]);

export const JobTypeSchema = z.enum([
  'analysis', 'asset_prep', 'storyboard', 'render', 'video_generation', 'image_processing', 'text_analysis',
  'voiceover_generation', 'music_generation', 'sound_effects', 'image_generation', 'video_generation_ai',
  'chart_generation', 'subtitle_generation', 'lipsync_processing', 'visual_effects', 'asset_enhancement',
  'consistency_check', 'quality_validation', 'final_assembly', 'rendering'
]);

export const JobStatusSchema = z.enum([
  'pending', 'processing', 'completed', 'failed', 'cancelled'
]);

export const ManifestStatusSchema = z.enum([
  'draft', 'validated', 'approved', 'in_production', 'completed', 'failed'
]);

export const ValidationStatusSchema = z.enum([
  'pending', 'valid', 'invalid', 'warning'
]);

// ========================================
// 2. ASSET SCHEMAS
// ========================================

export const AssetDimensionsSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive()
});

export const AssetTimingSchema = z.object({
  start_time_seconds: z.number().min(0),
  duration_seconds: z.number().positive(),
  end_time_seconds: z.number().min(0)
});

export const AssetEnhancementSchema = z.object({
  enhancement_type: z.string(),
  parameters: z.record(z.any()).optional(),
  quality_improvement: z.number().min(0).max(1).optional(),
  applied_at: z.string().datetime().optional()
});

export const ProductionAssetSchema = z.object({
  id: z.string(),
  asset_id: z.string(), // Original asset ID from analyzer/refiner
  asset_type: AssetTypeSchema,
  source: AssetSourceSchema,
  
  // URLs and file info
  original_url: z.string().url().optional(),
  processed_url: z.string().url().optional(),
  file_size_bytes: z.number().positive().optional(),
  duration_seconds: z.number().positive().optional(),
  dimensions: AssetDimensionsSchema.optional(),
  format: z.string().optional(),
  
  // Processing status
  status: z.enum(['pending', 'processing', 'ready', 'failed', 'skipped']).default('pending'),
  processing_job_id: z.string().uuid().optional(),
  
  // Usage in production
  scene_assignments: z.array(z.string()).default([]),
  usage_type: z.enum(['primary', 'background', 'overlay', 'transition', 'effect']).optional(),
  timing_info: AssetTimingSchema.optional(),
  
  // Quality & Enhancement
  quality_score: z.number().min(0).max(1).optional(),
  enhancement_applied: z.boolean().default(false),
  enhancement_details: AssetEnhancementSchema.optional(),
  
  // Consistency tracking
  consistency_group: z.string().optional(),
  consistency_checks: z.array(z.any()).default([])
});

// ========================================
// 3. SCENE SCHEMAS
// ========================================

export const VisualEffectSchema = z.object({
  effect_type: z.string(),
  parameters: z.record(z.any()).optional(),
  start_time_seconds: z.number().min(0),
  duration_seconds: z.number().positive(),
  intensity: z.number().min(0).max(1).optional()
});

export const ProductionSceneSchema = z.object({
  id: z.string(),
  scene_id: z.string(), // Original scene ID from script enhancer
  scene_order: z.number().int().positive(),
  scene_name: z.string().optional(),
  
  // Timing
  start_time_seconds: z.number().min(0),
  duration_seconds: z.number().positive(),
  
  // Content
  narration_text: z.string().optional(),
  visual_description: z.string().optional(),
  music_cue: z.string().optional(),
  sound_effects: z.array(z.string()).default([]),
  visual_effects: z.array(VisualEffectSchema).default([]),
  
  // Assets
  primary_assets: z.array(z.string()).default([]),
  background_assets: z.array(z.string()).default([]),
  overlay_assets: z.array(z.string()).default([]),
  
  // Processing
  status: z.enum(['pending', 'processing', 'ready', 'failed']).default('pending'),
  processing_jobs: z.array(z.string()).default([]),
  
  // Quality
  quality_score: z.number().min(0).max(1).optional(),
  consistency_score: z.number().min(0).max(1).optional()
});

// ========================================
// 4. JOB SCHEMAS
// ========================================

export const JobDependencySchema = z.object({
  job_id: z.string().uuid(),
  dependency_type: z.enum(['blocking', 'optional', 'parallel']).default('blocking')
});

export const ResourceRequirementsSchema = z.object({
  cpu_cores: z.number().positive().optional(),
  memory_gb: z.number().positive().optional(),
  gpu_required: z.boolean().default(false),
  api_calls: z.number().positive().optional(),
  storage_gb: z.number().positive().optional(),
  network_bandwidth_mbps: z.number().positive().optional()
});

export const ProductionJobSchema = z.object({
  id: z.string().uuid(),
  production_manifest_id: z.string().uuid(),
  type: JobTypeSchema,
  status: JobStatusSchema.default('pending'),
  priority: z.number().int().default(0),
  
  // Job configuration
  job_config: z.record(z.any()).default({}),
  dependencies: z.array(JobDependencySchema).default([]),
  estimated_duration_seconds: z.number().positive().optional(),
  resource_requirements: ResourceRequirementsSchema.optional(),
  
  // Processing
  attempts: z.number().int().min(0).default(0),
  max_attempts: z.number().int().positive().default(3),
  error: z.string().optional(),
  result: z.record(z.any()).optional(),
  metadata: z.record(z.any()).default({}),
  
  // Timing
  started_at: z.string().datetime().optional(),
  completed_at: z.string().datetime().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

// ========================================
// 5. VOICEOVER & AUDIO SCHEMAS
// ========================================

export const VoiceoverConfigSchema = z.object({
  voice_id: z.string(),
  voice_settings: z.object({
    stability: z.number().min(0).max(1).optional(),
    similarity_boost: z.number().min(0).max(1).optional(),
    style: z.number().min(0).max(1).optional(),
    use_speaker_boost: z.boolean().optional()
  }).optional(),
  model_id: z.string().optional(),
  text: z.string(),
  scene_id: z.string(),
  start_time_seconds: z.number().min(0),
  duration_seconds: z.number().positive()
});

export const MusicConfigSchema = z.object({
  music_type: z.enum(['intro', 'build', 'climax', 'outro', 'background', 'transition']),
  duration_seconds: z.number().positive(),
  start_time_seconds: z.number().min(0),
  intensity: z.number().min(0).max(1).optional(),
  genre: z.string().optional(),
  mood: z.string().optional(),
  scene_id: z.string().optional()
});

export const SoundEffectConfigSchema = z.object({
  effect_type: z.string(),
  duration_seconds: z.number().positive(),
  start_time_seconds: z.number().min(0),
  volume: z.number().min(0).max(1).default(0.8),
  scene_id: z.string().optional()
});

// ========================================
// 6. VISUAL EFFECTS & CHARTS SCHEMAS
// ========================================

export const ChartConfigSchema = z.object({
  chart_type: z.enum(['bar', 'line', 'pie', 'scatter', 'area', 'histogram', 'heatmap']),
  data: z.record(z.any()),
  title: z.string().optional(),
  x_axis_label: z.string().optional(),
  y_axis_label: z.string().optional(),
  colors: z.array(z.string()).optional(),
  scene_id: z.string(),
  start_time_seconds: z.number().min(0),
  duration_seconds: z.number().positive()
});

export const VisualEffectConfigSchema = z.object({
  effect_type: z.enum(['transition', 'overlay', 'parallax', 'zoom', 'pan', 'fade', 'blur', 'color_grading']),
  parameters: z.record(z.any()).optional(),
  start_time_seconds: z.number().min(0),
  duration_seconds: z.number().positive(),
  intensity: z.number().min(0).max(1).default(1),
  scene_id: z.string()
});

// ========================================
// 7. CONSISTENCY & QUALITY SCHEMAS
// ========================================

export const ConsistencyCheckSchema = z.object({
  check_type: z.enum(['face_consistency', 'style_consistency', 'color_consistency', 'brand_consistency']),
  asset_ids: z.array(z.string()),
  consistency_score: z.number().min(0).max(1),
  issues: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([])
});

export const QualityValidationSchema = z.object({
  validation_type: z.enum(['technical', 'creative', 'consistency', 'completeness']),
  score: z.number().min(0).max(1),
  issues: z.array(z.string()).default([]),
  passed: z.boolean(),
  recommendations: z.array(z.string()).default([])
});

// ========================================
// 8. MAIN PRODUCTION MANIFEST SCHEMA
// ========================================

export const ProductionManifestSchema = z.object({
  // Metadata
  manifest_version: z.string().default('1.0.0'),
  status: ManifestStatusSchema.default('draft'),
  priority: z.number().int().default(0),
  
  // Source References
  analyzer_id: z.string().optional(),
  refiner_id: z.string().optional(),
  script_enhancer_id: z.string().optional(),
  
  // Production Configuration
  duration_seconds: z.number().positive(),
  aspect_ratio: z.string(),
  platform: z.string(),
  language: z.string().default('en'),
  orientation: z.enum(['landscape', 'portrait', 'square']).optional(),
  
  // Core Content
  scenes: z.array(ProductionSceneSchema),
  assets: z.array(ProductionAssetSchema),
  jobs: z.array(ProductionJobSchema),
  
  // Audio Configuration
  voiceover_jobs: z.array(VoiceoverConfigSchema).default([]),
  music_plan: z.array(MusicConfigSchema).default([]),
  sound_effects: z.array(SoundEffectConfigSchema).default([]),
  
  // Visual Configuration
  visual_effects: z.array(VisualEffectConfigSchema).default([]),
  charts: z.array(ChartConfigSchema).default([]),
  
  // Quality & Consistency
  consistency_checks: z.array(ConsistencyCheckSchema).default([]),
  quality_validations: z.array(QualityValidationSchema).default([]),
  
  // Subtitles
  subtitles: z.object({
    enabled: z.boolean().default(true),
    language: z.string().default('en'),
    style: z.record(z.any()).optional(),
    auto_generate: z.boolean().default(true)
  }).optional(),
  
  // Processing Configuration
  processing_config: z.object({
    parallel_jobs: z.number().int().positive().default(3),
    retry_attempts: z.number().int().positive().default(3),
    timeout_seconds: z.number().int().positive().default(300),
    quality_threshold: z.number().min(0).max(1).default(0.8)
  }).optional(),
  
  // Validation
  validation_status: ValidationStatusSchema.default('pending'),
  validation_errors: z.array(z.string()).default([]),
  quality_score: z.number().min(0).max(1).optional()
});

// ========================================
// 9. VALIDATION UTILITIES
// ========================================

export const validateProductionManifest = (data: unknown) => {
  try {
    const manifest = ProductionManifestSchema.parse(data);
    return { valid: true, data: manifest, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        data: null,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code
        }))
      };
    }
    return {
      valid: false,
      data: null,
      errors: [{ path: 'root', message: 'Unknown validation error', code: 'unknown' }]
    };
  }
};

export const validateAsset = (data: unknown) => {
  try {
    const asset = ProductionAssetSchema.parse(data);
    return { valid: true, data: asset, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        data: null,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code
        }))
      };
    }
    return {
      valid: false,
      data: null,
      errors: [{ path: 'root', message: 'Unknown validation error', code: 'unknown' }]
    };
  }
};

export const validateScene = (data: unknown) => {
  try {
    const scene = ProductionSceneSchema.parse(data);
    return { valid: true, data: scene, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        data: null,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code
        }))
      };
    }
    return {
      valid: false,
      data: null,
      errors: [{ path: 'root', message: 'Unknown validation error', code: 'unknown' }]
    };
  }
};

// ========================================
// 10. TYPE EXPORTS
// ========================================

export type AssetType = z.infer<typeof AssetTypeSchema>;
export type AssetSource = z.infer<typeof AssetSourceSchema>;
export type JobType = z.infer<typeof JobTypeSchema>;
export type JobStatus = z.infer<typeof JobStatusSchema>;
export type ManifestStatus = z.infer<typeof ManifestStatusSchema>;
export type ValidationStatus = z.infer<typeof ValidationStatusSchema>;

export type ProductionAsset = z.infer<typeof ProductionAssetSchema>;
export type ProductionScene = z.infer<typeof ProductionSceneSchema>;
export type ProductionJob = z.infer<typeof ProductionJobSchema>;
export type ProductionManifest = z.infer<typeof ProductionManifestSchema>;

export type VoiceoverConfig = z.infer<typeof VoiceoverConfigSchema>;
export type MusicConfig = z.infer<typeof MusicConfigSchema>;
export type SoundEffectConfig = z.infer<typeof SoundEffectConfigSchema>;
export type ChartConfig = z.infer<typeof ChartConfigSchema>;
export type VisualEffectConfig = z.infer<typeof VisualEffectConfigSchema>;

export type ConsistencyCheck = z.infer<typeof ConsistencyCheckSchema>;
export type QualityValidation = z.infer<typeof QualityValidationSchema>;

export type ValidationResult<T> = {
  valid: boolean;
  data: T | null;
  errors: Array<{
    path: string;
    message: string;
    code: string;
  }>;
};
