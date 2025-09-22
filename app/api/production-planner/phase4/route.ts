// app/api/production-planner/phase4/route.ts
// Phase 4 API: Convert Studio Blueprint to Production Manifest

import { NextRequest, NextResponse } from 'next/server';
import { buildManifestFromTreatment, Phase4Inputs } from '../../../../services/phase4/manifestBuilder';
import { StudioBlueprintDatabase } from '../../../../lib/production-planner/studioBlueprintDatabase';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Initialize Supabase client with service role key
const supabaseServiceRole = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const studioBlueprintDB = new StudioBlueprintDatabase({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
});

// Input schema for Phase 4 API
const Phase4ApiInputSchema = z.object({
  studioBlueprintId: z.string().uuid('Invalid studio blueprint ID format.'),
  treatmentText: z.string().min(1, 'Treatment text is required.'),
  analyzerJson: z.record(z.any()).optional(),
  refinerJson: z.record(z.any()).optional(),
  scriptJson: z.record(z.any()).optional(),
  userUI: z.object({
    userId: z.string().uuid().nullable(),
    durationSeconds: z.number().positive().optional(),
    aspectRatio: z.string().optional(),
    platform: z.string().optional(),
    language: z.string().optional(),
    tone: z.string().optional(),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = Phase4ApiInputSchema.parse(body);

    console.log('[Phase4API] Starting Phase 4 processing for blueprint:', input.studioBlueprintId);

    // Retrieve studio blueprint if provided
    let studioBlueprint = null;
    if (input.studioBlueprintId) {
      const blueprintResult = await studioBlueprintDB.getBlueprint(input.studioBlueprintId);
      if (blueprintResult.success) {
        studioBlueprint = blueprintResult.data;
        console.log('[Phase4API] Retrieved studio blueprint:', blueprintResult.data.id);
      } else {
        console.warn('[Phase4API] Could not retrieve studio blueprint:', blueprintResult.error);
      }
    }

    // Prepare Phase 4 inputs
    const phase4Inputs: Phase4Inputs = {
      treatmentText: input.treatmentText,
      studioBlueprint: studioBlueprint ? {
        id: studioBlueprint.id,
        userId: studioBlueprint.user_id,
        sourceRefs: {
          analyzerRef: studioBlueprint.analyzer_ref,
          refinerRef: studioBlueprint.refiner_ref,
          scriptRef: studioBlueprint.script_ref,
        },
        title: studioBlueprint.project_title,
        overview: studioBlueprint.overview,
        scenes: studioBlueprint.scenes,
        audioArc: studioBlueprint.audio_arc,
        consistencyRules: studioBlueprint.consistency_rules,
        rawMarkdown: '', // Not needed for Phase 4
      } : undefined,
      analyzerJson: input.analyzerJson || {},
      refinerJson: input.refinerJson || {},
      scriptJson: input.scriptJson || {},
      userUI: input.userUI,
    };

    // Run Phase 4 pipeline
    const result = await buildManifestFromTreatment(phase4Inputs);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error || 'Phase 4 processing failed.',
          warnings: result.warnings,
          processingTimeMs: result.processingTimeMs,
        },
        { status: 500 }
      );
    }

    // Store manifest in database
    const { data: manifestData, error: manifestError } = await supabaseServiceRole
      .from('dreamcut_production_manifest')
      .insert({
        user_id: result.manifest!.userId,
        manifest_json: result.manifest!,
        status: 'planning',
        validation_errors: result.warnings.length > 0 ? { warnings: result.warnings } : null,
      })
      .select()
      .single();

    if (manifestError) {
      console.error('[Phase4API] Failed to store manifest:', manifestError);
      return NextResponse.json(
        {
          error: 'Failed to store production manifest.',
          details: manifestError.message,
        },
        { status: 500 }
      );
    }

    // Store jobs in database
    const jobsToInsert = result.jobs!.map(job => ({
      manifest_id: manifestData.id,
      job_id: job.id,
      type: job.type,
      status: 'pending',
      priority: job.priority,
      payload: job.payload,
      depends_on: job.dependsOn,
      retry_policy: job.retryPolicy,
      max_attempts: job.retryPolicy.maxRetries,
    }));

    const { error: jobsError } = await supabaseServiceRole
      .from('dreamcut_jobs')
      .insert(jobsToInsert);

    if (jobsError) {
      console.error('[Phase4API] Failed to store jobs:', jobsError);
      // Don't fail the entire request, just log the error
    }

    // Update manifest with actual ID in render job
    if (result.jobs && result.jobs.length > 0) {
      const renderJob = result.jobs.find(job => job.type === 'render_shotstack');
      if (renderJob && renderJob.payload.manifestId === 'MANIFEST_PLACEHOLDER') {
        await supabaseServiceRole
          .from('dreamcut_jobs')
          .update({ 
            payload: { 
              ...renderJob.payload, 
              manifestId: manifestData.id 
            } 
          })
          .eq('manifest_id', manifestData.id)
          .eq('job_id', renderJob.id);
      }
    }

    // Broadcast via Realtime for worker notification
    await supabaseServiceRole
      .channel('production-jobs')
      .send({
        type: 'broadcast',
        event: 'new_jobs',
        payload: {
          manifestId: manifestData.id,
          jobCount: result.jobs!.length,
          userId: result.manifest!.userId,
        },
      });

    console.log(`[Phase4API] Phase 4 completed successfully in ${result.processingTimeMs}ms`);

    return NextResponse.json({
      success: true,
      manifestId: manifestData.id,
      jobCount: result.jobs!.length,
      warnings: result.warnings,
      processingTimeMs: result.processingTimeMs,
      usedRepair: result.usedRepair,
      message: 'Production manifest created and jobs queued successfully.',
    }, { status: 201 });

  } catch (error: any) {
    console.error('[Phase4API] Phase 4 processing error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Invalid input for Phase 4 processing.',
        details: error.issues,
      }, { status: 400 });
    }
    
    return NextResponse.json({
      error: error.message || 'Internal server error during Phase 4 processing.',
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const manifestId = searchParams.get('manifestId');

    if (!manifestId) {
      return NextResponse.json({ error: 'Manifest ID is required.' }, { status: 400 });
    }

    // Retrieve manifest
    const { data: manifestData, error: manifestError } = await supabaseServiceRole
      .from('dreamcut_production_manifest')
      .select('*')
      .eq('id', manifestId)
      .single();

    if (manifestError) {
      return NextResponse.json(
        { error: 'Manifest not found.', details: manifestError.message },
        { status: 404 }
      );
    }

    // Retrieve jobs
    const { data: jobsData, error: jobsError } = await supabaseServiceRole
      .from('dreamcut_jobs')
      .select('*')
      .eq('manifest_id', manifestId)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true });

    if (jobsError) {
      console.warn('[Phase4API] Could not retrieve jobs:', jobsError);
    }

    return NextResponse.json({
      success: true,
      manifest: manifestData,
      jobs: jobsData || [],
    }, { status: 200 });

  } catch (error: any) {
    console.error('[Phase4API] Error retrieving manifest:', error);
    return NextResponse.json({
      error: error.message || 'Internal server error.',
    }, { status: 500 });
  }
}
