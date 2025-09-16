/**
 * Safe Integration for Unified Analyzer
 * 
 * This module provides safe integration functions that can be used
 * with the existing query analyzer without breaking anything.
 * 
 * DEPRECATION NOTICE: The old step1-analyzer functions are deprecated.
 * Use the new unified analyzer functions for new implementations.
 */

// Old imports (deprecated but kept for compatibility)
import { runStep1Analyzer } from './step1-analyzer';
import { createJob } from '@/lib/db/jobs';
import { createClient } from '@supabase/supabase-js';

// New modular imports for unified analyzer
import { analyzeUserQuery } from './query-analyzer';
import { analyzeAssetsInParallel } from './step2-asset-analyzer';
import { combineQueryAndAssets } from './step3-combination-analyzer';
import { createFinalAnalysisOutput } from './step4-json-summarizer';

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Safely integrate Step 1 analyzer with an existing brief
 * This function is completely safe and won't break existing functionality
 */
export async function integrateStep1Analyzer(
  briefId: string, // The brief_id (TEXT) from the existing briefs table
  options: {
    priority?: number;
    max_attempts?: number;
    metadata?: any;
  } = {}
): Promise<{
  ok: boolean;
  data?: any;
  error?: string;
}> {
  try {
    console.log(`[Integration] Integrating Step 1 analyzer with brief ${briefId}`);

    // First, get the brief to verify it exists and get its UUID
    const { data: brief, error: briefError } = await supabase
      .from('briefs')
      .select('id, brief_id, request, analysis, plan, user_id, status')
      .eq('brief_id', briefId)
      .single();

    if (briefError || !brief) {
      return { ok: false, error: `Brief not found: ${briefError?.message || 'Unknown error'}` };
    }

    // Check if analysis already exists
    if (brief.analysis && typeof brief.analysis === 'object') {
      console.log(`[Integration] Brief ${briefId} already has analysis, skipping`);
      return { 
        ok: true, 
        data: { 
          brief_id: brief.brief_id,
          message: 'Analysis already exists',
          existing_analysis: brief.analysis
        } 
      };
    }

    // Create analysis job
    const jobResult = await createJob({
      brief_id: brief.id, // Use the UUID id for the foreign key
      type: 'analysis',
      priority: options.priority || 10,
      max_attempts: options.max_attempts || 3,
      metadata: {
        brief_id: brief.brief_id, // Store the brief_id for reference
        user_id: brief.user_id,
        integration_type: 'step1_analyzer',
        ...options.metadata
      }
    });

    if (!jobResult.ok) {
      return { ok: false, error: `Failed to create analysis job: ${jobResult.error}` };
    }

    console.log(`[Integration] Created analysis job ${jobResult.data?.id} for brief ${briefId}`);

    return { 
      ok: true, 
      data: { 
        brief_id: brief.brief_id,
        job_id: jobResult.data?.id,
        job_created: true,
        message: 'Step 1 analyzer job created successfully'
      } 
    };

  } catch (err: any) {
    console.error(`[Integration] Failed to integrate Step 1 analyzer:`, err.message);
    return { ok: false, error: err.message };
  }
}

/**
 * Run Step 1 analyzer immediately (synchronous)
 * This is useful for testing or when you want immediate results
 */
export async function runStep1AnalyzerImmediate(
  briefId: string
): Promise<{
  ok: boolean;
  data?: any;
  error?: string;
}> {
  try {
    console.log(`[Integration] Running Step 1 analyzer immediately for brief ${briefId}`);

    // Get the brief
    const { data: brief, error: briefError } = await supabase
      .from('briefs')
      .select('*')
      .eq('brief_id', briefId)
      .single();

    if (briefError || !brief) {
      return { ok: false, error: `Brief not found: ${briefError?.message || 'Unknown error'}` };
    }

    // Check if analysis already exists
    if (brief.analysis && typeof brief.analysis === 'object') {
      console.log(`[Integration] Brief ${briefId} already has analysis`);
      return { 
        ok: true, 
        data: { 
          brief_id: brief.brief_id,
          analysis: brief.analysis,
          message: 'Analysis already exists'
        } 
      };
    }

    // Run the analyzer
    const analysisResult = await runStep1Analyzer(brief);
    
    if (!analysisResult.ok) {
      return { ok: false, error: `Analysis failed: ${analysisResult.error}` };
    }

    // Update the brief with analysis results
    const { error: updateError } = await supabase
      .from('briefs')
      .update({ 
        analysis: analysisResult.value,
        status: 'processing'
      })
      .eq('id', brief.id);

    if (updateError) {
      console.warn(`[Integration] Failed to update brief with analysis: ${updateError.message}`);
    }

    return { 
      ok: true, 
      data: { 
        brief_id: brief.brief_id,
        analysis: analysisResult.value,
        message: 'Step 1 analysis completed successfully'
      } 
    };

  } catch (err: any) {
    console.error(`[Integration] Failed to run Step 1 analyzer immediately:`, err.message);
    return { ok: false, error: err.message };
  }
}

/**
 * Get analysis status for a brief
 */
export async function getAnalysisStatus(
  briefId: string
): Promise<{
  ok: boolean;
  data?: any;
  error?: string;
}> {
  try {
    // Get brief with its jobs
    const { data: brief, error: briefError } = await supabase
      .from('briefs')
      .select('id, brief_id, analysis, status')
      .eq('brief_id', briefId)
      .single();

    if (briefError || !brief) {
      return { ok: false, error: `Brief not found: ${briefError?.message || 'Unknown error'}` };
    }

    // Get analysis jobs for this brief
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .eq('brief_id', brief.id)
      .eq('type', 'analysis')
      .order('created_at', { ascending: false });

    if (jobsError) {
      return { ok: false, error: `Failed to get jobs: ${jobsError.message}` };
    }

    const analysisJob = jobs?.[0]; // Get the most recent analysis job

    return {
      ok: true,
      data: {
        brief_id: brief.brief_id,
        has_analysis: !!(brief.analysis && typeof brief.analysis === 'object'),
        analysis: brief.analysis,
        brief_status: brief.status,
        analysis_job: analysisJob ? {
          id: analysisJob.id,
          status: analysisJob.status,
          attempts: analysisJob.attempts,
          max_attempts: analysisJob.max_attempts,
          error: analysisJob.error,
          created_at: analysisJob.created_at,
          updated_at: analysisJob.updated_at
        } : null
      }
    };

  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * Safe integration function that can be called after existing brief creation
 * This is the main function to use for integrating with existing code
 */
export async function safeIntegrateStep1Analyzer(
  briefId: string,
  options: {
    priority?: number;
    max_attempts?: number;
    run_immediate?: boolean;
    metadata?: any;
  } = {}
): Promise<{
  ok: boolean;
  data?: any;
  error?: string;
}> {
  // If run_immediate is true, run the analyzer immediately
  if (options.run_immediate) {
    return runStep1AnalyzerImmediate(briefId);
  }

  // Otherwise, create a job for the worker to process
  return integrateStep1Analyzer(briefId, options);
}

/**
 * NEW UNIFIED ANALYZER INTEGRATION
 * 
 * Run the new unified analyzer pipeline for a brief
 * This is the recommended approach for new implementations
 */
export async function runUnifiedAnalyzer(
  briefId: string,
  options: {
    step1_model?: string;
    enable_ai_synthesis?: boolean;
    detail_level?: string;
    target_audience?: string;
  } = {}
): Promise<{
  ok: boolean;
  data?: any;
  error?: string;
}> {
  try {
    console.log(`[UnifiedAnalyzer] Processing brief ${briefId}`);

    // Get the brief
    const { data: brief, error: briefError } = await supabase
      .from('briefs')
      .select('*')
      .eq('brief_id', briefId)
      .single();

    if (briefError || !brief) {
      return { ok: false, error: `Brief not found: ${briefError?.message || 'Unknown error'}` };
    }

    // Extract query and assets from the request
    const query = brief.request?.query || brief.request?.prompt || '';
    const assets = brief.request?.assets || [];

    if (!query) {
      return { ok: false, error: 'No query found in brief request' };
    }

    // Step 1: Query Analysis
    const step1Start = Date.now();
    const queryResult = await analyzeUserQuery(query, {
      model_preference: options.step1_model || 'auto'
    });
    const step1Time = Date.now() - step1Start;

    if (!queryResult.success) {
      return { ok: false, error: `Query analysis failed: ${queryResult.error}` };
    }

    // Step 2: Asset Analysis (if assets exist)
    const step2Start = Date.now();
    let assetResult;
    if (assets.length > 0) {
      assetResult = await analyzeAssetsInParallel(assets, query);
      if (!assetResult.success) {
        return { ok: false, error: `Asset analysis failed: ${assetResult.error}` };
      }
    } else {
      // Create minimal asset result for queries without assets
      assetResult = {
        success: true,
        result: {
          total_assets: 0,
          asset_analyses: [],
          summary: {
            successful_analyses: 0,
            failed_analyses: 0,
            overall_quality_score: 5,
            asset_type_breakdown: {},
            primary_content_assets: [],
            reference_material_assets: [],
            enhancement_needed_assets: []
          }
        }
      };
    }
    const step2Time = Date.now() - step2Start;

    // Step 3: Combination & Synthesis
    const step3Start = Date.now();
    const combinationResult = await combineQueryAndAssets(queryResult.result!, assetResult.result!, {
      enable_ai_synthesis: options.enable_ai_synthesis !== false
    });
    const step3Time = Date.now() - step3Start;

    if (!combinationResult.success) {
      return { ok: false, error: `Combination analysis failed: ${combinationResult.error}` };
    }

    // Step 4: Final JSON Output
    const step4Start = Date.now();
    const finalResult = await createFinalAnalysisOutput(
      queryResult.result!,
      assetResult.result!,
      combinationResult.result!,
      step1Time,
      step2Time,
      step3Time,
      {
        detail_level: options.detail_level || 'standard',
        target_audience: options.target_audience || 'general'
      }
    );
    const step4Time = Date.now() - step4Start;

    if (!finalResult.success) {
      return { ok: false, error: `Final output creation failed: ${finalResult.error}` };
    }

    // Update the brief with the complete analysis
    const { error: updateError } = await supabase
      .from('briefs')
      .update({ 
        analysis: finalResult.result,
        status: 'analyzed',
        updated_at: new Date().toISOString()
      })
      .eq('brief_id', briefId);

    if (updateError) {
      console.error(`[UnifiedAnalyzer] Failed to update brief ${briefId}:`, updateError);
      // Don't fail the whole operation for update errors
    }

    console.log(`[UnifiedAnalyzer] Successfully processed brief ${briefId}`);
    console.log(`[UnifiedAnalyzer] Performance: Step1=${step1Time}ms, Step2=${step2Time}ms, Step3=${step3Time}ms, Step4=${step4Time}ms`);

    return { 
      ok: true, 
      data: { 
        brief_id: brief.brief_id,
        analysis: finalResult.result,
        performance: {
          step1_time_ms: step1Time,
          step2_time_ms: step2Time,
          step3_time_ms: step3Time,
          step4_time_ms: step4Time,
          total_time_ms: step1Time + step2Time + step3Time + step4Time
        }
      } 
    };

  } catch (error) {
    console.error(`[UnifiedAnalyzer] Error processing brief ${briefId}:`, error);
    return { 
      ok: false, 
      error: error instanceof Error ? error.message : 'Unknown error in unified analyzer' 
    };
  }
}
