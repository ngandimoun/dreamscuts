/**
 * Brief Integration Utilities
 * 
 * These functions provide OPTIONAL integration with the worker system
 * without breaking existing functionality. They can be called after
 * the existing query analyzer creates a brief.
 */

import { createJob, createJobPipeline, JobType } from './jobs';
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Add job processing to an existing brief
 * This is a SAFE function that doesn't modify the brief, only adds jobs
 */
export async function addJobProcessingToBrief(
  briefId: string, // The brief_id (TEXT) from the existing briefs table
  options: {
    use_pipeline?: boolean;
    job_types?: JobType[];
    priority?: number;
  } = {}
): Promise<{
  ok: boolean;
  data?: any;
  error?: string;
}> {
  try {
    // First, get the brief to verify it exists and get its UUID
    const { data: brief, error: briefError } = await supabase
      .from('briefs')
      .select('id, brief_id, request, analysis, plan, user_id')
      .eq('brief_id', briefId)
      .single();

    if (briefError || !brief) {
      return { ok: false, error: `Brief not found: ${briefError?.message || 'Unknown error'}` };
    }

    // Determine job types based on options or request data
    let jobTypes: JobType[] = options.job_types || ['analysis'];

    if (options.use_pipeline && !options.job_types) {
      // Determine pipeline based on request data
      const mediaType = brief.request?.mediaType || 'text';
      switch (mediaType) {
        case 'video':
          jobTypes = ['analysis', 'asset_prep', 'video_generation', 'render'];
          break;
        case 'image':
          jobTypes = ['analysis', 'asset_prep', 'image_processing', 'render'];
          break;
        case 'audio':
          jobTypes = ['analysis', 'asset_prep', 'render'];
          break;
        case 'text':
          jobTypes = ['analysis', 'text_analysis', 'render'];
          break;
        default:
          jobTypes = ['analysis'];
      }
    }

    // Create jobs for the brief
    const jobs = jobTypes.map((type, index) => ({
      brief_id: brief.id, // Use the UUID id for the foreign key
      type,
      priority: (options.priority || 0) + (jobTypes.length - index), // Later jobs have higher priority
      max_attempts: 3,
      metadata: {
        brief_id: brief.brief_id, // Store the brief_id for reference
        user_id: brief.user_id,
        pipeline_step: index + 1,
        total_steps: jobTypes.length
      }
    }));

    const { data: createdJobs, error: jobsError } = await supabase
      .from('jobs')
      .insert(jobs)
      .select();

    if (jobsError) {
      return { ok: false, error: `Failed to create jobs: ${jobsError.message}` };
    }

    // Update brief status to 'queued' to indicate it has jobs
    const { error: updateError } = await supabase
      .from('briefs')
      .update({ status: 'queued' })
      .eq('id', brief.id);

    if (updateError) {
      console.warn('Failed to update brief status:', updateError.message);
      // Don't fail the whole operation for this
    }

    return { 
      ok: true, 
      data: { 
        brief_id: brief.brief_id,
        jobs_created: createdJobs?.length || 0,
        jobs: createdJobs
      } 
    };

  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * Get brief with its associated jobs
 */
export async function getBriefWithJobs(briefId: string): Promise<{
  ok: boolean;
  data?: {
    brief: any;
    jobs: any[];
  };
  error?: string;
}> {
  try {
    // Get brief
    const { data: brief, error: briefError } = await supabase
      .from('briefs')
      .select('*')
      .eq('brief_id', briefId)
      .single();

    if (briefError || !brief) {
      return { ok: false, error: `Brief not found: ${briefError?.message || 'Unknown error'}` };
    }

    // Get jobs for this brief
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .eq('brief_id', brief.id)
      .order('created_at', { ascending: true });

    if (jobsError) {
      return { ok: false, error: `Failed to get jobs: ${jobsError.message}` };
    }

    return { 
      ok: true, 
      data: { 
        brief, 
        jobs: jobs || [] 
      } 
    };

  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * Update brief status based on job completion
 * This can be called by workers when jobs complete
 */
export async function updateBriefStatusFromJobs(briefId: string): Promise<{
  ok: boolean;
  data?: any;
  error?: string;
}> {
  try {
    // Get brief
    const { data: brief, error: briefError } = await supabase
      .from('briefs')
      .select('id, brief_id, status')
      .eq('brief_id', briefId)
      .single();

    if (briefError || !brief) {
      return { ok: false, error: `Brief not found: ${briefError?.message || 'Unknown error'}` };
    }

    // Get all jobs for this brief
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('status')
      .eq('brief_id', brief.id);

    if (jobsError) {
      return { ok: false, error: `Failed to get jobs: ${jobsError.message}` };
    }

    if (!jobs || jobs.length === 0) {
      return { ok: true, data: { brief_id: brief.brief_id, status: brief.status } };
    }

    // Determine new status based on jobs
    let newStatus = brief.status;

    const hasFailed = jobs.some(job => job.status === 'failed');
    const hasProcessing = jobs.some(job => job.status === 'processing');
    const hasPending = jobs.some(job => job.status === 'pending');
    const allCompleted = jobs.every(job => job.status === 'completed');

    if (hasFailed) {
      newStatus = 'failed';
    } else if (allCompleted) {
      newStatus = 'done';
    } else if (hasProcessing || hasPending) {
      newStatus = 'processing';
    }

    // Update brief status if it changed
    if (newStatus !== brief.status) {
      const { error: updateError } = await supabase
        .from('briefs')
        .update({ status: newStatus })
        .eq('id', brief.id);

      if (updateError) {
        return { ok: false, error: `Failed to update brief status: ${updateError.message}` };
      }
    }

    return { 
      ok: true, 
      data: { 
        brief_id: brief.brief_id, 
        old_status: brief.status,
        new_status: newStatus,
        jobs_count: jobs.length
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
export async function integrateBriefWithWorker(
  briefId: string,
  options: {
    use_pipeline?: boolean;
    job_types?: JobType[];
    priority?: number;
  } = {}
): Promise<{
  ok: boolean;
  data?: any;
  error?: string;
}> {
  return addJobProcessingToBrief(briefId, options);
}
