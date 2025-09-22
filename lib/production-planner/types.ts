/**
 * 🎬 Production Planner - Phase 0 Types
 * 
 * TypeScript type definitions for the Production Planner system.
 * These types complement the Zod schemas and provide additional type safety.
 */

import { 
  ProductionManifest, 
  ProductionAsset, 
  ProductionScene, 
  ProductionJob,
  AssetType,
  AssetSource,
  JobType,
  JobStatus,
  ManifestStatus,
  ValidationStatus
} from './schemas';

// ========================================
// 1. DATABASE TYPES
// ========================================

export interface ProductionManifestRecord {
  id: string;
  user_id: string;
  analyzer_id?: string;
  refiner_id?: string;
  script_enhancer_id?: string;
  manifest_version: string;
  status: ManifestStatus;
  priority: number;
  duration_seconds: number;
  aspect_ratio: string;
  platform: string;
  language: string;
  orientation?: 'landscape' | 'portrait' | 'square';
  manifest_data: ProductionManifest;
  validation_status: ValidationStatus;
  validation_errors: string[];
  quality_score?: number;
  created_at: string;
  updated_at: string;
  validated_at?: string;
  approved_at?: string;
  started_at?: string;
  completed_at?: string;
  processing_time_ms?: number;
  estimated_completion_time?: string;
  error_message?: string;
  retry_count: number;
  max_retries: number;
}

export interface ProductionAssetRecord {
  id: string;
  production_manifest_id: string;
  asset_id: string;
  asset_type: AssetType;
  source: AssetSource;
  original_url?: string;
  processed_url?: string;
  file_size_bytes?: number;
  duration_seconds?: number;
  dimensions?: { width: number; height: number };
  format?: string;
  status: 'pending' | 'processing' | 'ready' | 'failed' | 'skipped';
  processing_job_id?: string;
  scene_assignments: string[];
  usage_type?: 'primary' | 'background' | 'overlay' | 'transition' | 'effect';
  timing_info?: {
    start_time_seconds: number;
    duration_seconds: number;
    end_time_seconds: number;
  };
  quality_score?: number;
  enhancement_applied: boolean;
  enhancement_details?: Record<string, any>;
  consistency_group?: string;
  consistency_checks: any[];
  created_at: string;
  updated_at: string;
}

export interface ProductionSceneRecord {
  id: string;
  production_manifest_id: string;
  scene_id: string;
  scene_order: number;
  scene_name?: string;
  start_time_seconds: number;
  duration_seconds: number;
  end_time_seconds: number;
  narration_text?: string;
  visual_description?: string;
  music_cue?: string;
  sound_effects: string[];
  visual_effects: any[];
  primary_assets: any[];
  background_assets: any[];
  overlay_assets: any[];
  status: 'pending' | 'processing' | 'ready' | 'failed';
  processing_jobs: any[];
  quality_score?: number;
  consistency_score?: number;
  created_at: string;
  updated_at: string;
}

// ========================================
// 2. API TYPES
// ========================================

export interface CreateProductionManifestRequest {
  user_id: string;
  analyzer_id?: string;
  refiner_id?: string;
  script_enhancer_id?: string;
  duration_seconds: number;
  aspect_ratio: string;
  platform: string;
  language?: string;
  orientation?: 'landscape' | 'portrait' | 'square';
  manifest_data: ProductionManifest;
}

export interface CreateProductionManifestResponse {
  success: boolean;
  data?: ProductionManifestRecord;
  error?: string;
  validation_errors?: string[];
}

export interface UpdateProductionManifestRequest {
  id: string;
  status?: ManifestStatus;
  priority?: number;
  manifest_data?: Partial<ProductionManifest>;
  validation_status?: ValidationStatus;
  validation_errors?: string[];
  quality_score?: number;
}

export interface UpdateProductionManifestResponse {
  success: boolean;
  data?: ProductionManifestRecord;
  error?: string;
}

export interface GetProductionManifestResponse {
  success: boolean;
  data?: ProductionManifestRecord;
  error?: string;
}

export interface ListProductionManifestsRequest {
  user_id: string;
  status?: ManifestStatus;
  limit?: number;
  offset?: number;
  order_by?: 'created_at' | 'updated_at' | 'priority' | 'status';
  order_direction?: 'asc' | 'desc';
}

export interface ListProductionManifestsResponse {
  success: boolean;
  data?: ProductionManifestRecord[];
  total_count?: number;
  error?: string;
}

// ========================================
// 3. VALIDATION TYPES
// ========================================

export interface ValidationError {
  path: string;
  message: string;
  code: string;
  severity?: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  score?: number;
}

export interface ManifestValidationResult extends ValidationResult {
  manifest_id: string;
  validation_timestamp: string;
  validation_duration_ms: number;
}

// ========================================
// 4. PROCESSING TYPES
// ========================================

export interface ProcessingContext {
  manifest_id: string;
  user_id: string;
  started_at: string;
  current_phase: ProcessingPhase;
  progress_percentage: number;
  estimated_completion_time?: string;
  active_jobs: string[];
  completed_jobs: string[];
  failed_jobs: string[];
}

export type ProcessingPhase = 
  | 'initialization'
  | 'validation'
  | 'asset_preparation'
  | 'scene_processing'
  | 'audio_generation'
  | 'visual_effects'
  | 'quality_validation'
  | 'final_assembly'
  | 'completed'
  | 'failed';

export interface ProcessingStatus {
  phase: ProcessingPhase;
  progress: number; // 0-100
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

// ========================================
// 5. JOB PROCESSING TYPES
// ========================================

export interface JobExecutionContext {
  job_id: string;
  manifest_id: string;
  user_id: string;
  job_type: JobType;
  job_config: Record<string, any>;
  dependencies: string[];
  resource_requirements?: {
    cpu_cores?: number;
    memory_gb?: number;
    gpu_required?: boolean;
    api_calls?: number;
    storage_gb?: number;
    network_bandwidth_mbps?: number;
  };
  timeout_seconds: number;
  retry_count: number;
  max_retries: number;
}

export interface JobResult {
  job_id: string;
  success: boolean;
  result?: Record<string, any>;
  error?: string;
  processing_time_ms: number;
  resource_usage?: {
    cpu_seconds: number;
    memory_mb: number;
    api_calls: number;
    storage_mb: number;
  };
  output_urls?: string[];
  metadata?: Record<string, any>;
}

// ========================================
// 6. INTEGRATION TYPES
// ========================================

export interface AnalyzerIntegration {
  analyzer_id: string;
  analyzer_data: Record<string, any>;
  asset_mappings: Record<string, string>; // analyzer asset ID -> production asset ID
  scene_mappings: Record<string, string>; // analyzer scene ID -> production scene ID
}

export interface RefinerIntegration {
  refiner_id: string;
  refiner_data: Record<string, any>;
  creative_profile: {
    profile_id: string;
    profile_name: string;
    goal: string;
    confidence: string;
    detection_method: string;
    matched_factors: string[];
  };
  style_guidelines: Record<string, any>;
}

export interface ScriptEnhancerIntegration {
  script_enhancer_id: string;
  script_data: {
    human_readable_script: string;
    script_metadata: {
      profile: string;
      duration_seconds: number;
      orientation: string;
      language: string;
      total_scenes: number;
      estimated_word_count: number;
      pacing_style: string;
    };
  };
  language_detection: {
    detected_language: string;
    language_code?: string;
    language_confidence: number;
    language_provider: string;
    is_language_reliable: boolean;
  };
}

// ========================================
// 7. ERROR TYPES
// ========================================

export class ProductionPlannerError extends Error {
  constructor(
    message: string,
    public code: string,
    public manifest_id?: string,
    public job_id?: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ProductionPlannerError';
  }
}

export class ValidationError extends ProductionPlannerError {
  constructor(
    message: string,
    public validation_errors: ValidationError[],
    manifest_id?: string
  ) {
    super(message, 'VALIDATION_ERROR', manifest_id);
    this.name = 'ValidationError';
  }
}

export class ProcessingError extends ProductionPlannerError {
  constructor(
    message: string,
    public phase: ProcessingPhase,
    manifest_id?: string,
    job_id?: string,
    details?: Record<string, any>
  ) {
    super(message, 'PROCESSING_ERROR', manifest_id, job_id, details);
    this.name = 'ProcessingError';
  }
}

export class JobExecutionError extends ProductionPlannerError {
  constructor(
    message: string,
    public job_type: JobType,
    job_id: string,
    manifest_id?: string,
    details?: Record<string, any>
  ) {
    super(message, 'JOB_EXECUTION_ERROR', manifest_id, job_id, details);
    this.name = 'JobExecutionError';
  }
}

// ========================================
// 8. CONFIGURATION TYPES
// ========================================

export interface ProductionPlannerConfig {
  // Database
  supabase_url: string;
  supabase_service_role_key: string;
  
  // Processing
  max_concurrent_jobs: number;
  default_timeout_seconds: number;
  default_retry_attempts: number;
  quality_threshold: number;
  
  // External Services
  elevenlabs_api_key?: string;
  replicate_api_token?: string;
  fal_ai_api_key?: string;
  openai_api_key?: string;
  
  // Validation
  strict_validation: boolean;
  auto_repair_attempts: number;
  
  // Monitoring
  enable_metrics: boolean;
  log_level: 'debug' | 'info' | 'warn' | 'error';
}

// ========================================
// 9. UTILITY TYPES
// ========================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// ========================================
// 10. EVENT TYPES
// ========================================

export interface ProductionEvent {
  event_type: string;
  manifest_id: string;
  user_id: string;
  timestamp: string;
  data: Record<string, any>;
}

export interface ManifestCreatedEvent extends ProductionEvent {
  event_type: 'manifest_created';
  data: {
    manifest_id: string;
    status: ManifestStatus;
    duration_seconds: number;
    platform: string;
  };
}

export interface ManifestStatusChangedEvent extends ProductionEvent {
  event_type: 'manifest_status_changed';
  data: {
    manifest_id: string;
    old_status: ManifestStatus;
    new_status: ManifestStatus;
    reason?: string;
  };
}

export interface JobCompletedEvent extends ProductionEvent {
  event_type: 'job_completed';
  data: {
    job_id: string;
    job_type: JobType;
    success: boolean;
    processing_time_ms: number;
    result?: Record<string, any>;
    error?: string;
  };
}

export interface ProcessingPhaseChangedEvent extends ProductionEvent {
  event_type: 'processing_phase_changed';
  data: {
    manifest_id: string;
    old_phase: ProcessingPhase;
    new_phase: ProcessingPhase;
    progress_percentage: number;
    estimated_completion_time?: string;
  };
}
