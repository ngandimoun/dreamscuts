/**
 * 🎬 Production Planner - Phase 0 Database Service
 * 
 * Database operations for the Production Planner system.
 * Handles CRUD operations for production manifests, assets, scenes, and jobs.
 */

import { createClient } from '@supabase/supabase-js';
import { 
  ProductionManifestRecord,
  ProductionAssetRecord,
  ProductionSceneRecord,
  CreateProductionManifestRequest,
  CreateProductionManifestResponse,
  UpdateProductionManifestRequest,
  UpdateProductionManifestResponse,
  GetProductionManifestResponse,
  ListProductionManifestsRequest,
  ListProductionManifestsResponse,
  ProductionManifest,
  ValidationResult
} from './types';
import { validateProductionManifest } from './schemas';

export class ProductionPlannerDatabase {
  private supabase;

  constructor(supabaseUrl: string, supabaseServiceRoleKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  }

  // ========================================
  // PRODUCTION MANIFEST OPERATIONS
  // ========================================

  /**
   * Create a new production manifest
   */
  async createProductionManifest(
    request: CreateProductionManifestRequest
  ): Promise<CreateProductionManifestResponse> {
    try {
      // Validate the manifest data
      const validation = validateProductionManifest(request.manifest_data);
      if (!validation.valid) {
        return {
          success: false,
          error: 'Invalid manifest data',
          validation_errors: validation.errors.map(err => `${err.path}: ${err.message}`)
        };
      }

      // Prepare the record
      const record = {
        user_id: request.user_id,
        analyzer_id: request.analyzer_id,
        refiner_id: request.refiner_id,
        script_enhancer_id: request.script_enhancer_id,
        duration_seconds: request.duration_seconds,
        aspect_ratio: request.aspect_ratio,
        platform: request.platform,
        language: request.language || 'en',
        orientation: request.orientation,
        manifest_data: request.manifest_data,
        validation_status: validation.valid ? 'valid' : 'invalid',
        validation_errors: validation.errors.map(err => `${err.path}: ${err.message}`),
        quality_score: this.calculateQualityScore(request.manifest_data)
      };

      // Insert into database
      const { data, error } = await this.supabase
        .from('production_manifest')
        .insert(record)
        .select()
        .single();

      if (error) {
        console.error('🎬 [Production Planner] Database error:', error);
        return {
          success: false,
          error: `Database error: ${error.message}`
        };
      }

      console.log('🎬 [Production Planner] Created manifest:', data.id);
      return {
        success: true,
        data: data as ProductionManifestRecord
      };

    } catch (error) {
      console.error('🎬 [Production Planner] Create manifest error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get a production manifest by ID
   */
  async getProductionManifest(manifestId: string): Promise<GetProductionManifestResponse> {
    try {
      const { data, error } = await this.supabase
        .from('production_manifest')
        .select('*')
        .eq('id', manifestId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return {
            success: false,
            error: 'Manifest not found'
          };
        }
        console.error('🎬 [Production Planner] Database error:', error);
        return {
          success: false,
          error: `Database error: ${error.message}`
        };
      }

      return {
        success: true,
        data: data as ProductionManifestRecord
      };

    } catch (error) {
      console.error('🎬 [Production Planner] Get manifest error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Update a production manifest
   */
  async updateProductionManifest(
    request: UpdateProductionManifestRequest
  ): Promise<UpdateProductionManifestResponse> {
    try {
      const updateData: any = {};

      if (request.status !== undefined) updateData.status = request.status;
      if (request.priority !== undefined) updateData.priority = request.priority;
      if (request.manifest_data !== undefined) {
        // Validate updated manifest data
        const validation = validateProductionManifest(request.manifest_data);
        updateData.manifest_data = request.manifest_data;
        updateData.validation_status = validation.valid ? 'valid' : 'invalid';
        updateData.validation_errors = validation.errors.map(err => `${err.path}: ${err.message}`);
        updateData.quality_score = this.calculateQualityScore(request.manifest_data);
      }
      if (request.validation_status !== undefined) updateData.validation_status = request.validation_status;
      if (request.validation_errors !== undefined) updateData.validation_errors = request.validation_errors;
      if (request.quality_score !== undefined) updateData.quality_score = request.quality_score;

      // Add timestamp updates
      if (request.status === 'validated') updateData.validated_at = new Date().toISOString();
      if (request.status === 'approved') updateData.approved_at = new Date().toISOString();
      if (request.status === 'in_production') updateData.started_at = new Date().toISOString();
      if (request.status === 'completed') updateData.completed_at = new Date().toISOString();

      const { data, error } = await this.supabase
        .from('production_manifest')
        .update(updateData)
        .eq('id', request.id)
        .select()
        .single();

      if (error) {
        console.error('🎬 [Production Planner] Database error:', error);
        return {
          success: false,
          error: `Database error: ${error.message}`
        };
      }

      console.log('🎬 [Production Planner] Updated manifest:', request.id);
      return {
        success: true,
        data: data as ProductionManifestRecord
      };

    } catch (error) {
      console.error('🎬 [Production Planner] Update manifest error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * List production manifests for a user
   */
  async listProductionManifests(
    request: ListProductionManifestsRequest
  ): Promise<ListProductionManifestsResponse> {
    try {
      let query = this.supabase
        .from('production_manifest')
        .select('*', { count: 'exact' })
        .eq('user_id', request.user_id);

      // Apply filters
      if (request.status) {
        query = query.eq('status', request.status);
      }

      // Apply ordering
      const orderBy = request.order_by || 'created_at';
      const orderDirection = request.order_direction || 'desc';
      query = query.order(orderBy, { ascending: orderDirection === 'asc' });

      // Apply pagination
      const limit = request.limit || 20;
      const offset = request.offset || 0;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('🎬 [Production Planner] Database error:', error);
        return {
          success: false,
          error: `Database error: ${error.message}`
        };
      }

      return {
        success: true,
        data: data as ProductionManifestRecord[],
        total_count: count || 0
      };

    } catch (error) {
      console.error('🎬 [Production Planner] List manifests error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Delete a production manifest
   */
  async deleteProductionManifest(manifestId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('production_manifest')
        .delete()
        .eq('id', manifestId);

      if (error) {
        console.error('🎬 [Production Planner] Database error:', error);
        return {
          success: false,
          error: `Database error: ${error.message}`
        };
      }

      console.log('🎬 [Production Planner] Deleted manifest:', manifestId);
      return { success: true };

    } catch (error) {
      console.error('🎬 [Production Planner] Delete manifest error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // ========================================
  // PRODUCTION ASSETS OPERATIONS
  // ========================================

  /**
   * Create production assets from manifest data
   */
  async createProductionAssets(
    manifestId: string,
    assets: any[]
  ): Promise<{ success: boolean; error?: string; asset_ids?: string[] }> {
    try {
      const assetRecords = assets.map(asset => ({
        production_manifest_id: manifestId,
        asset_id: asset.id,
        asset_type: asset.asset_type,
        source: asset.source,
        original_url: asset.original_url,
        processed_url: asset.processed_url,
        file_size_bytes: asset.file_size_bytes,
        duration_seconds: asset.duration_seconds,
        dimensions: asset.dimensions,
        format: asset.format,
        status: asset.status || 'pending',
        scene_assignments: asset.scene_assignments || [],
        usage_type: asset.usage_type,
        timing_info: asset.timing_info,
        quality_score: asset.quality_score,
        enhancement_applied: asset.enhancement_applied || false,
        enhancement_details: asset.enhancement_details,
        consistency_group: asset.consistency_group,
        consistency_checks: asset.consistency_checks || []
      }));

      const { data, error } = await this.supabase
        .from('production_assets')
        .insert(assetRecords)
        .select('id');

      if (error) {
        console.error('🎬 [Production Planner] Database error:', error);
        return {
          success: false,
          error: `Database error: ${error.message}`
        };
      }

      const assetIds = data?.map(record => record.id) || [];
      console.log('🎬 [Production Planner] Created assets:', assetIds.length);
      return {
        success: true,
        asset_ids: assetIds
      };

    } catch (error) {
      console.error('🎬 [Production Planner] Create assets error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get production assets for a manifest
   */
  async getProductionAssets(manifestId: string): Promise<{
    success: boolean;
    data?: ProductionAssetRecord[];
    error?: string;
  }> {
    try {
      const { data, error } = await this.supabase
        .from('production_assets')
        .select('*')
        .eq('production_manifest_id', manifestId)
        .order('created_at');

      if (error) {
        console.error('🎬 [Production Planner] Database error:', error);
        return {
          success: false,
          error: `Database error: ${error.message}`
        };
      }

      return {
        success: true,
        data: data as ProductionAssetRecord[]
      };

    } catch (error) {
      console.error('🎬 [Production Planner] Get assets error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // ========================================
  // PRODUCTION SCENES OPERATIONS
  // ========================================

  /**
   * Create production scenes from manifest data
   */
  async createProductionScenes(
    manifestId: string,
    scenes: any[]
  ): Promise<{ success: boolean; error?: string; scene_ids?: string[] }> {
    try {
      const sceneRecords = scenes.map(scene => ({
        production_manifest_id: manifestId,
        scene_id: scene.id,
        scene_order: scene.scene_order,
        scene_name: scene.scene_name,
        start_time_seconds: scene.start_time_seconds,
        duration_seconds: scene.duration_seconds,
        narration_text: scene.narration_text,
        visual_description: scene.visual_description,
        music_cue: scene.music_cue,
        sound_effects: scene.sound_effects || [],
        visual_effects: scene.visual_effects || [],
        primary_assets: scene.primary_assets || [],
        background_assets: scene.background_assets || [],
        overlay_assets: scene.overlay_assets || [],
        status: scene.status || 'pending',
        processing_jobs: scene.processing_jobs || [],
        quality_score: scene.quality_score,
        consistency_score: scene.consistency_score
      }));

      const { data, error } = await this.supabase
        .from('production_scenes')
        .insert(sceneRecords)
        .select('id');

      if (error) {
        console.error('🎬 [Production Planner] Database error:', error);
        return {
          success: false,
          error: `Database error: ${error.message}`
        };
      }

      const sceneIds = data?.map(record => record.id) || [];
      console.log('🎬 [Production Planner] Created scenes:', sceneIds.length);
      return {
        success: true,
        scene_ids: sceneIds
      };

    } catch (error) {
      console.error('🎬 [Production Planner] Create scenes error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get production scenes for a manifest
   */
  async getProductionScenes(manifestId: string): Promise<{
    success: boolean;
    data?: ProductionSceneRecord[];
    error?: string;
  }> {
    try {
      const { data, error } = await this.supabase
        .from('production_scenes')
        .select('*')
        .eq('production_manifest_id', manifestId)
        .order('scene_order');

      if (error) {
        console.error('🎬 [Production Planner] Database error:', error);
        return {
          success: false,
          error: `Database error: ${error.message}`
        };
      }

      return {
        success: true,
        data: data as ProductionSceneRecord[]
      };

    } catch (error) {
      console.error('🎬 [Production Planner] Get scenes error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Calculate quality score for a manifest
   */
  private calculateQualityScore(manifest: ProductionManifest): number {
    let score = 0;
    let factors = 0;

    // Check if manifest has required fields
    if (manifest.scenes && manifest.scenes.length > 0) {
      score += 0.3;
      factors++;
    }

    if (manifest.assets && manifest.assets.length > 0) {
      score += 0.3;
      factors++;
    }

    if (manifest.jobs && manifest.jobs.length > 0) {
      score += 0.2;
      factors++;
    }

    if (manifest.duration_seconds > 0) {
      score += 0.1;
      factors++;
    }

    if (manifest.aspect_ratio && manifest.platform) {
      score += 0.1;
      factors++;
    }

    return factors > 0 ? score / factors : 0;
  }

  /**
   * Get production manifest summary with related data
   */
  async getProductionManifestSummary(manifestId: string): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const { data, error } = await this.supabase
        .from('production_manifest_summary')
        .select('*')
        .eq('id', manifestId)
        .single();

      if (error) {
        console.error('🎬 [Production Planner] Database error:', error);
        return {
          success: false,
          error: `Database error: ${error.message}`
        };
      }

      return {
        success: true,
        data
      };

    } catch (error) {
      console.error('🎬 [Production Planner] Get summary error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get production progress for a manifest
   */
  async getProductionProgress(manifestId: string): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const { data, error } = await this.supabase
        .from('production_progress')
        .select('*')
        .eq('manifest_id', manifestId)
        .single();

      if (error) {
        console.error('🎬 [Production Planner] Database error:', error);
        return {
          success: false,
          error: `Database error: ${error.message}`
        };
      }

      return {
        success: true,
        data
      };

    } catch (error) {
      console.error('🎬 [Production Planner] Get progress error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

/**
 * Create a Production Planner database instance
 */
export function createProductionPlannerDatabase(
  supabaseUrl?: string,
  supabaseServiceRoleKey?: string
): ProductionPlannerDatabase {
  const url = supabaseUrl || process.env.SUPABASE_URL;
  const key = supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Supabase URL and Service Role Key are required');
  }

  return new ProductionPlannerDatabase(url, key);
}
