/**
 * 🎬 Studio Blueprint Database Service - Phase 3
 * 
 * Database operations for Studio Blueprint storage and retrieval.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  StudioBlueprint,
  CreateBlueprintRequest,
  CreateBlueprintResponse,
  GetBlueprintResponse,
  UpdateBlueprintRequest,
  UpdateBlueprintResponse,
  BlueprintValidationResult
} from '../../types/studio-blueprint';
import { StudioBlueprintSchema, validateStudioBlueprint } from '../../validators/studio-blueprint';

export class StudioBlueprintDatabase {
  private supabase: SupabaseClient;
  private config: {
    supabaseUrl: string;
    supabaseServiceRoleKey: string;
  };

  constructor(config: { supabaseUrl: string; supabaseServiceRoleKey: string }) {
    this.config = config;
    this.supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey);
  }

  private handleError<T>(error: any, message: string): { success: false; error: string } {
    console.error(`[StudioBlueprintDatabase] ${message}:`, error);
    return {
      success: false,
      error: error.message || message
    };
  }

  // ========================================
  // CREATE OPERATIONS
  // ========================================

  /**
   * Create a new Studio Blueprint
   */
  async createBlueprint(blueprint: StudioBlueprint): Promise<CreateBlueprintResponse> {
    try {
      // Validate the blueprint
      const validation = validateStudioBlueprint(blueprint);
      if (!validation.valid) {
        return {
          success: false,
          error: `Validation failed: ${validation.errors.map(e => e.message).join(', ')}`
        };
      }

      // Prepare the record
      const record = {
        user_id: blueprint.userId,
        analyzer_ref: blueprint.sourceRefs?.analyzerRef,
        refiner_ref: blueprint.sourceRefs?.refinerRef,
        script_ref: blueprint.sourceRefs?.scriptRef,
        project_title: blueprint.projectTitle,
        overview: blueprint.overview,
        scenes: blueprint.scenes,
        audio_arc: blueprint.audioArc,
        consistency_rules: blueprint.consistencyRules,
        status: blueprint.status || 'draft',
        quality_score: blueprint.qualityScore,
        processing_time_ms: blueprint.processingTimeMs,
        warnings: blueprint.warnings,
        human_review: blueprint.humanReview
      };

      // Insert into database
      const { data, error } = await this.supabase
        .from('studio_blueprints')
        .insert(record)
        .select()
        .single();

      if (error) {
        return this.handleError(error, 'Failed to create studio blueprint');
      }

      // Convert back to StudioBlueprint format
      const createdBlueprint: StudioBlueprint = {
        id: data.id,
        createdAt: data.created_at,
        userId: data.user_id,
        sourceRefs: {
          analyzerRef: data.analyzer_ref,
          refinerRef: data.refiner_ref,
          scriptRef: data.script_ref
        },
        projectTitle: data.project_title,
        overview: data.overview,
        scenes: data.scenes,
        audioArc: data.audio_arc,
        consistencyRules: data.consistency_rules,
        status: data.status,
        qualityScore: data.quality_score,
        processingTimeMs: data.processing_time_ms,
        warnings: data.warnings,
        humanReview: data.human_review
      };

      console.log('🎬 [StudioBlueprintDatabase] Created blueprint:', data.id);
      return {
        success: true,
        data: createdBlueprint
      };

    } catch (error) {
      return this.handleError(error, 'Error creating studio blueprint');
    }
  }

  // ========================================
  // READ OPERATIONS
  // ========================================

  /**
   * Get a Studio Blueprint by ID
   */
  async getBlueprint(id: string): Promise<GetBlueprintResponse> {
    try {
      const { data, error } = await this.supabase
        .from('studio_blueprints')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return this.handleError(error, `Failed to retrieve blueprint ${id}`);
      }

      if (!data) {
        return {
          success: false,
          error: `Blueprint ${id} not found`
        };
      }

      // Convert to StudioBlueprint format
      const blueprint: StudioBlueprint = {
        id: data.id,
        createdAt: data.created_at,
        userId: data.user_id,
        sourceRefs: {
          analyzerRef: data.analyzer_ref,
          refinerRef: data.refiner_ref,
          scriptRef: data.script_ref
        },
        projectTitle: data.project_title,
        overview: data.overview,
        scenes: data.scenes,
        audioArc: data.audio_arc,
        consistencyRules: data.consistency_rules,
        status: data.status,
        qualityScore: data.quality_score,
        processingTimeMs: data.processing_time_ms,
        warnings: data.warnings,
        humanReview: data.human_review
      };

      return {
        success: true,
        data: blueprint
      };

    } catch (error) {
      return this.handleError(error, `Error retrieving blueprint ${id}`);
    }
  }

  /**
   * Get all Studio Blueprints for a user
   */
  async getUserBlueprints(userId: string, options: {
    status?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ success: boolean; data?: StudioBlueprint[]; error?: string }> {
    try {
      let query = this.supabase
        .from('studio_blueprints')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (options.status) {
        query = query.eq('status', options.status);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        return this.handleError(error, 'Failed to retrieve user blueprints');
      }

      // Convert to StudioBlueprint format
      const blueprints: StudioBlueprint[] = data.map(item => ({
        id: item.id,
        createdAt: item.created_at,
        userId: item.user_id,
        sourceRefs: {
          analyzerRef: item.analyzer_ref,
          refinerRef: item.refiner_ref,
          scriptRef: item.script_ref
        },
        projectTitle: item.project_title,
        overview: item.overview,
        scenes: item.scenes,
        audioArc: item.audio_arc,
        consistencyRules: item.consistency_rules,
        status: item.status,
        qualityScore: item.quality_score,
        processingTimeMs: item.processing_time_ms,
        warnings: item.warnings,
        humanReview: item.human_review
      }));

      return {
        success: true,
        data: blueprints
      };

    } catch (error) {
      return this.handleError(error, 'Error retrieving user blueprints');
    }
  }

  // ========================================
  // UPDATE OPERATIONS
  // ========================================

  /**
   * Update a Studio Blueprint
   */
  async updateBlueprint(id: string, updates: Partial<StudioBlueprint>): Promise<UpdateBlueprintResponse> {
    try {
      // Validate updates
      const validation = validateStudioBlueprint(updates);
      if (!validation.valid) {
        return {
          success: false,
          error: `Validation failed: ${validation.errors.map(e => e.message).join(', ')}`
        };
      }

      // Prepare update record
      const updateRecord: any = {
        updated_at: new Date().toISOString()
      };

      if (updates.projectTitle) updateRecord.project_title = updates.projectTitle;
      if (updates.overview) updateRecord.overview = updates.overview;
      if (updates.scenes) updateRecord.scenes = updates.scenes;
      if (updates.audioArc) updateRecord.audio_arc = updates.audioArc;
      if (updates.consistencyRules) updateRecord.consistency_rules = updates.consistencyRules;
      if (updates.status) updateRecord.status = updates.status;
      if (updates.qualityScore !== undefined) updateRecord.quality_score = updates.qualityScore;
      if (updates.warnings) updateRecord.warnings = updates.warnings;
      if (updates.humanReview) updateRecord.human_review = updates.humanReview;

      // Update in database
      const { data, error } = await this.supabase
        .from('studio_blueprints')
        .update(updateRecord)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return this.handleError(error, `Failed to update blueprint ${id}`);
      }

      // Convert back to StudioBlueprint format
      const updatedBlueprint: StudioBlueprint = {
        id: data.id,
        createdAt: data.created_at,
        userId: data.user_id,
        sourceRefs: {
          analyzerRef: data.analyzer_ref,
          refinerRef: data.refiner_ref,
          scriptRef: data.script_ref
        },
        projectTitle: data.project_title,
        overview: data.overview,
        scenes: data.scenes,
        audioArc: data.audio_arc,
        consistencyRules: data.consistency_rules,
        status: data.status,
        qualityScore: data.quality_score,
        processingTimeMs: data.processing_time_ms,
        warnings: data.warnings,
        humanReview: data.human_review
      };

      return {
        success: true,
        data: updatedBlueprint
      };

    } catch (error) {
      return this.handleError(error, `Error updating blueprint ${id}`);
    }
  }

  /**
   * Update blueprint status
   */
  async updateBlueprintStatus(
    id: string, 
    status: 'draft' | 'generated' | 'reviewed' | 'approved' | 'rejected',
    reviewData?: any
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.rpc('update_blueprint_status', {
        blueprint_id: id,
        new_status: status,
        review_data: reviewData
      });

      if (error) {
        return this.handleError(error, `Failed to update blueprint status for ${id}`);
      }

      return { success: true };

    } catch (error) {
      return this.handleError(error, `Error updating blueprint status for ${id}`);
    }
  }

  // ========================================
  // DELETE OPERATIONS
  // ========================================

  /**
   * Delete a Studio Blueprint
   */
  async deleteBlueprint(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('studio_blueprints')
        .delete()
        .eq('id', id);

      if (error) {
        return this.handleError(error, `Failed to delete blueprint ${id}`);
      }

      return { success: true };

    } catch (error) {
      return this.handleError(error, `Error deleting blueprint ${id}`);
    }
  }

  // ========================================
  // STATISTICS AND ANALYTICS
  // ========================================

  /**
   * Get blueprint statistics for a user
   */
  async getUserBlueprintStats(userId: string): Promise<{
    success: boolean;
    data?: {
      totalBlueprints: number;
      generatedCount: number;
      approvedCount: number;
      rejectedCount: number;
      avgQualityScore: number;
      avgProcessingTimeMs: number;
      lastCreatedAt: string;
    };
    error?: string;
  }> {
    try {
      const { data, error } = await this.supabase
        .from('studio_blueprint_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        return this.handleError(error, 'Failed to retrieve blueprint statistics');
      }

      if (!data) {
        return {
          success: true,
          data: {
            totalBlueprints: 0,
            generatedCount: 0,
            approvedCount: 0,
            rejectedCount: 0,
            avgQualityScore: 0,
            avgProcessingTimeMs: 0,
            lastCreatedAt: new Date().toISOString()
          }
        };
      }

      return {
        success: true,
        data: {
          totalBlueprints: data.total_blueprints,
          generatedCount: data.generated_count,
          approvedCount: data.approved_count,
          rejectedCount: data.rejected_count,
          avgQualityScore: data.avg_quality_score || 0,
          avgProcessingTimeMs: data.avg_processing_time_ms || 0,
          lastCreatedAt: data.last_created_at
        }
      };

    } catch (error) {
      return this.handleError(error, 'Error retrieving blueprint statistics');
    }
  }
}
