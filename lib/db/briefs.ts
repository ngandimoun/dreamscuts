import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { createJob, createJobPipeline, JobType } from "./jobs";

// Brief schema - matches existing briefs table structure
export const BriefSchema = z.object({
  id: z.string().uuid().optional(),
  brief_id: z.string().optional(), // This is the unique identifier in existing schema
  user_id: z.string().uuid().optional(),
  request: z.any(), // JSONB field in existing schema
  analysis: z.any(), // JSONB field in existing schema
  plan: z.any(), // JSONB field in existing schema
  status: z.enum(['analyzed', 'queued', 'processing', 'done', 'failed']).default('analyzed'),
  metadata: z.any().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});

export type Brief = z.infer<typeof BriefSchema>;

// Interface for creating briefs that matches existing API
export interface CreateBriefInput {
  user_id?: string;
  brief_id?: string; // Optional, will be generated if not provided
  request: any; // The request object from query analyzer
  analysis: any; // The analysis results
  plan: any; // The processing plan
  metadata?: any;
}

// Supabase client with service role for server-side operations
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Create a new brief and automatically enqueue analysis job
 * This works with the existing briefs table structure
 */
export async function createBriefWithJob(input: CreateBriefInput): Promise<{
  ok: boolean;
  data?: Brief;
  error?: string;
}> {
  try {
    // Generate brief_id if not provided
    const brief_id = input.brief_id || `brief-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Validate input
    const validatedInput = BriefSchema.parse({
      ...input,
      brief_id,
      status: 'queued' // Set to queued since we're creating a job
    });

    // Create the brief
    const { data: brief, error: briefError } = await supabase
      .from('briefs')
      .insert([validatedInput])
      .select()
      .single();

    if (briefError) {
      return { ok: false, error: briefError.message };
    }

    // Create the initial analysis job using the brief's UUID id
    const jobResult = await createJob({
      brief_id: brief.id, // Use the UUID id for the foreign key
      type: 'analysis',
      priority: 10, // High priority for initial analysis
      metadata: {
        brief_id: brief.brief_id, // Store the brief_id for reference
        user_id: input.user_id
      }
    });

    if (!jobResult.ok) {
      // If job creation fails, we should probably rollback the brief creation
      // For now, we'll just return the error
      return { ok: false, error: `Brief created but job creation failed: ${jobResult.error}` };
    }

    return { ok: true, data: brief };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * Create a brief with a full processing pipeline
 * This works with the existing briefs table structure
 */
export async function createBriefWithPipeline(input: CreateBriefInput): Promise<{
  ok: boolean;
  data?: Brief;
  error?: string;
}> {
  try {
    // Generate brief_id if not provided
    const brief_id = input.brief_id || `brief-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Validate input
    const validatedInput = BriefSchema.parse({
      ...input,
      brief_id,
      status: 'queued' // Set to queued since we're creating jobs
    });

    // Create the brief
    const { data: brief, error: briefError } = await supabase
      .from('briefs')
      .insert([validatedInput])
      .select()
      .single();

    if (briefError) {
      return { ok: false, error: briefError.message };
    }

    // Define the processing pipeline based on media type
    // We'll determine this from the request data
    let pipeline: JobType[] = ['analysis'];

    // Try to determine media type from request
    const mediaType = input.request?.mediaType || 'text';
    switch (mediaType) {
      case 'video':
        pipeline = ['analysis', 'asset_prep', 'video_generation', 'render'];
        break;
      case 'image':
        pipeline = ['analysis', 'asset_prep', 'image_processing', 'render'];
        break;
      case 'audio':
        pipeline = ['analysis', 'asset_prep', 'render'];
        break;
      case 'text':
        pipeline = ['analysis', 'text_analysis', 'render'];
        break;
    }

    // Create the job pipeline using the brief's UUID id
    const pipelineResult = await createJobPipeline(brief.id, pipeline);

    if (!pipelineResult.ok) {
      return { ok: false, error: `Brief created but pipeline creation failed: ${pipelineResult.error}` };
    }

    return { ok: true, data: brief };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * Get brief by ID
 */
export async function getBrief(briefId: string): Promise<{
  ok: boolean;
  data?: Brief;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('briefs')
      .select('*')
      .eq('id', briefId)
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
 * Get briefs by user ID
 */
export async function getBriefsByUser(userId: string): Promise<{
  ok: boolean;
  data?: Brief[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('briefs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, data: data || [] };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * Update brief
 */
export async function updateBrief(briefId: string, updates: Partial<Brief>): Promise<{
  ok: boolean;
  data?: Brief;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('briefs')
      .update(updates)
      .eq('id', briefId)
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
 * Delete brief (will cascade delete jobs)
 */
export async function deleteBrief(briefId: string): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase
      .from('briefs')
      .delete()
      .eq('id', briefId);

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * Get brief with its jobs
 */
export async function getBriefWithJobs(briefId: string): Promise<{
  ok: boolean;
  data?: {
    brief: Brief;
    jobs: any[];
  };
  error?: string;
}> {
  try {
    // Get brief
    const briefResult = await getBrief(briefId);
    if (!briefResult.ok) {
      return { ok: false, error: briefResult.error };
    }

    // Get jobs
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .eq('brief_id', briefId)
      .order('created_at', { ascending: true });

    if (jobsError) {
      return { ok: false, error: jobsError.message };
    }

    return { 
      ok: true, 
      data: { 
        brief: briefResult.data!, 
        jobs: jobs || [] 
      } 
    };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * Update brief status based on job completion
 */
export async function updateBriefStatusFromJobs(briefId: string): Promise<{
  ok: boolean;
  data?: Brief;
  error?: string;
}> {
  try {
    // Get all jobs for this brief
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .eq('brief_id', briefId);

    if (jobsError) {
      return { ok: false, error: jobsError.message };
    }

    if (!jobs || jobs.length === 0) {
      return { ok: false, error: 'No jobs found for brief' };
    }

    // Determine status based on jobs
    let newStatus: 'draft' | 'processing' | 'completed' | 'failed' = 'draft';

    const hasFailed = jobs.some(job => job.status === 'failed');
    const hasProcessing = jobs.some(job => job.status === 'processing');
    const allCompleted = jobs.every(job => job.status === 'completed');

    if (hasFailed) {
      newStatus = 'failed';
    } else if (allCompleted) {
      newStatus = 'completed';
    } else if (hasProcessing || jobs.some(job => job.status === 'pending')) {
      newStatus = 'processing';
    }

    // Update brief status
    return await updateBrief(briefId, { status: newStatus });
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}
