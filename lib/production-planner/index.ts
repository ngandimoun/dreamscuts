/**
 * 🎬 Production Planner - Phase 0 Index
 * 
 * Main entry point for the Production Planner system.
 * Exports all schemas, types, and database services.
 */

// ========================================
// SCHEMAS & VALIDATION
// ========================================
export * from './schemas';

// ========================================
// TYPES
// ========================================
export * from './types';

// ========================================
// DATABASE SERVICES
// ========================================
export * from './database';

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Create a Production Planner database instance with environment variables
 */
export function createProductionPlannerDatabase() {
  const { createProductionPlannerDatabase: createDB } = require('./database');
  return createDB();
}

/**
 * Validate a production manifest
 */
export function validateManifest(manifestData: unknown) {
  const { validateProductionManifest } = require('./schemas');
  return validateProductionManifest(manifestData);
}

/**
 * Get default production planner configuration
 */
export function getDefaultConfig() {
  return {
    max_concurrent_jobs: 3,
    default_timeout_seconds: 300,
    default_retry_attempts: 3,
    quality_threshold: 0.8,
    strict_validation: true,
    auto_repair_attempts: 2,
    enable_metrics: true,
    log_level: 'info' as const
  };
}

// ========================================
// CONSTANTS
// ========================================

export const PRODUCTION_PLANNER_VERSION = '1.0.0';

export const SUPPORTED_PLATFORMS = [
  'youtube',
  'instagram',
  'tiktok',
  'facebook',
  'twitter',
  'linkedin',
  'web'
] as const;

export const SUPPORTED_ASPECT_RATIOS = [
  '16:9',
  '9:16',
  '1:1',
  '4:3',
  '3:4',
  '21:9'
] as const;

export const SUPPORTED_LANGUAGES = [
  'en',
  'es',
  'fr',
  'de',
  'it',
  'pt',
  'ru',
  'ja',
  'ko',
  'zh',
  'ar',
  'hi'
] as const;

export const DEFAULT_JOB_TIMEOUTS = {
  'voiceover_generation': 120,
  'music_generation': 180,
  'image_generation': 60,
  'video_generation_ai': 300,
  'chart_generation': 30,
  'subtitle_generation': 45,
  'lipsync_processing': 240,
  'visual_effects': 90,
  'asset_enhancement': 60,
  'consistency_check': 30,
  'quality_validation': 45,
  'final_assembly': 180,
  'rendering': 600
} as const;

export const QUALITY_THRESHOLDS = {
  'excellent': 0.9,
  'good': 0.8,
  'acceptable': 0.7,
  'poor': 0.6,
  'unacceptable': 0.5
} as const;
