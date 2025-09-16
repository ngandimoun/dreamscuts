import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// Job types and schemas
export const JobTypeSchema = z.enum([
  'analysis',
  'asset_prep', 
  'storyboard',
  'render',
  'video_generation',
  'image_processing',
  'text_analysis'
]);

export const JobStatusSchema = z.enum([
  'pending',
  'processing',
  'completed',
  'failed',
  'cancelled'
]);

export type JobType = z.infer<typeof JobTypeSchema>;
export type JobStatus = z.infer<typeof JobStatusSchema>;

export interface Job {
  id: string;
  brief_id: string;
  type: JobType;
  status: JobStatus;
  priority: number;
  attempts: number;
  max_attempts: number;
  error?: string;
  result?: any;
  metadata?: any;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateJobInput {
  brief_id: string;
  type: JobType;
  priority?: number;
  max_attempts?: number;
  metadata?: any;
}

export interface JobStats {
  type: string;
  status: string;
  count: number;
  avg_duration_seconds?: number;
  max_attempts_used: number;
}

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Create a new job
 */
export async function createJob(input: CreateJobInput): Promise<{
  ok: boolean;
  data?: Job;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert([{
        brief_id: input.brief_id,
        type: input.type,
        priority: input.priority || 0,
        max_attempts: input.max_attempts || 3,
        metadata: input.metadata || {}
      }])
      .select()
      .single();

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * Get pending jobs for processing
 */
export async function getPendingJobs(limit: number = 10): Promise<{
  ok: boolean;
  data?: Job[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('pending_jobs_queue')
      .select('*')
      .limit(limit);

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, data: data || [] };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * Claim a job for processing (atomic operation to prevent race conditions)
 */
export async function claimJob(jobId: string, workerId?: string): Promise<{
  ok: boolean;
  data?: Job;
  error?: string;
}> {
  try {
    // Use the database function to atomically claim the job
    const { data: claimed, error: claimError } = await supabase
      .rpc('claim_job', { 
        job_id: jobId,
        worker_id: workerId || `worker-${process.pid}-${Date.now()}`
      });

    if (claimError) {
      return { ok: false, error: claimError.message };
    }

    if (!claimed) {
      return { ok: false, error: 'Job could not be claimed (may be already claimed or max attempts reached)' };
    }

    // Get the updated job
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError) {
      return { ok: false, error: jobError.message };
    }

    return { ok: true, data: job };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * Complete a job
 */
export async function completeJob(jobId: string, result?: any): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const { data: completed, error } = await supabase
      .rpc('complete_job', { 
        job_id: jobId,
        job_result: result
      });

    if (error) {
      return { ok: false, error: error.message };
    }

    if (!completed) {
      return { ok: false, error: 'Job could not be completed (may not be in processing status)' };
    }

    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * Fail a job
 */
export async function failJob(jobId: string, errorMessage: string): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const { data: failed, error } = await supabase
      .rpc('fail_job', { 
        job_id: jobId,
        error_message: errorMessage
      });

    if (error) {
      return { ok: false, error: error.message };
    }

    if (!failed) {
      return { ok: false, error: 'Job could not be failed (may not be in processing status)' };
    }

    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * Get job by ID
 */
export async function getJob(jobId: string): Promise<{
  ok: boolean;
  data?: Job;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * Get jobs by brief ID
 */
export async function getJobsByBrief(briefId: string): Promise<{
  ok: boolean;
  data?: Job[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('brief_id', briefId)
      .order('created_at', { ascending: true });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, data: data || [] };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * Get job statistics
 */
export async function getJobStats(): Promise<{
  ok: boolean;
  data?: JobStats[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('job_stats')
      .select('*');

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, data: data || [] };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * Get active jobs (currently processing)
 */
export async function getActiveJobs(): Promise<{
  ok: boolean;
  data?: Job[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('active_jobs')
      .select('*');

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, data: data || [] };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * Cancel a job
 */
export async function cancelJob(jobId: string): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase
      .from('jobs')
      .update({ 
        status: 'cancelled',
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId)
      .in('status', ['pending', 'processing']);

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * Clean up old completed/failed jobs (for maintenance)
 */
export async function cleanupOldJobs(olderThanDays: number = 30): Promise<{
  ok: boolean;
  deletedCount?: number;
  error?: string;
}> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const { data, error } = await supabase
      .from('jobs')
      .delete()
      .in('status', ['completed', 'failed', 'cancelled'])
      .lt('completed_at', cutoffDate.toISOString())
      .select('id');

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, deletedCount: data?.length || 0 };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * Create multiple jobs for a brief (pipeline)
 */
export async function createJobPipeline(briefId: string, jobTypes: JobType[]): Promise<{
  ok: boolean;
  data?: Job[];
  error?: string;
}> {
  try {
    const jobs = jobTypes.map((type, index) => ({
      brief_id: briefId,
      type,
      priority: jobTypes.length - index, // Later jobs have higher priority
      max_attempts: 3,
      metadata: { pipeline_step: index + 1, total_steps: jobTypes.length }
    }));

    const { data, error } = await supabase
      .from('jobs')
      .insert(jobs)
      .select();

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, data: data || [] };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}
