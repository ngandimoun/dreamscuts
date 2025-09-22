/**
 * 🛡️ Production-Safe Job Manager
 * 
 * This class provides a safe interface for creating and managing jobs
 * in the dreamcut_jobs table with full production safety features.
 * 
 * SAFETY GUARANTEES:
 * - ✅ Uses production-safe database functions
 * - ✅ Validates job status transitions
 * - ✅ Handles retry logic with exponential backoff
 * - ✅ Manages job dependencies
 * - ✅ Tracks worker health and heartbeats
 * - ✅ Provides comprehensive error handling
 * - ✅ Supports dead letter queue for failed jobs
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SafeJobConfig {
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

export interface CreateJobOptions {
  manifestId: string;
  jobId: string;
  type: string;
  payload: any;
  priority?: number;
  dependsOn?: string[];
  retryPolicy?: {
    maxRetries?: number;
    backoffSeconds?: number;
    maxBackoffSeconds?: number;
  };
  tags?: string[];
  metadata?: any;
  estimatedCostUsd?: number;
}

export interface JobStatus {
  id: string;
  jobId: string;
  type: string;
  status: string;
  priority: number;
  attempts: number;
  maxAttempts: number;
  workerId?: string;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  result?: any;
  outputUrl?: string;
  processingTimeMs?: number;
  isDeadLetter: boolean;
  deadLetterReason?: string;
  nextRetryAt?: string;
}

export class ProductionSafeJobManager {
  private supabase: SupabaseClient;
  private config: SafeJobConfig;

  constructor(config: SafeJobConfig) {
    this.config = config;
    this.supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey);
  }

  /**
   * Create a new job with production-safe validation
   */
  async createJob(options: CreateJobOptions): Promise<{ success: boolean; jobId?: string; error?: string }> {
    try {
      this.log('info', `Creating SAFE job ${options.jobId} of type ${options.type}`);

      const { data, error } = await this.supabase
        .from('dreamcut_jobs')
        .insert({
          manifest_id: options.manifestId,
          job_id: options.jobId,
          type: options.type,
          payload: options.payload,
          priority: options.priority || 5,
          depends_on: options.dependsOn || [],
          retry_policy: {
            maxRetries: options.retryPolicy?.maxRetries || 3,
            backoffSeconds: options.retryPolicy?.backoffSeconds || 30,
            maxBackoffSeconds: options.retryPolicy?.maxBackoffSeconds || 3600
          },
          tags: options.tags || [],
          metadata: options.metadata || {},
          estimated_cost_usd: options.estimatedCostUsd,
          status: 'pending'
        })
        .select('id, job_id')
        .single();

      if (error) {
        this.log('error', `Failed to create SAFE job ${options.jobId}: ${error.message}`);
        return { success: false, error: error.message };
      }

      this.log('info', `Successfully created SAFE job ${options.jobId} with ID ${data.id}`);
      return { success: true, jobId: data.job_id };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log('error', `Exception creating SAFE job ${options.jobId}: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Get job status using production-safe functions
   */
  async getJobStatus(jobId: string): Promise<JobStatus | null> {
    try {
      const { data, error } = await this.supabase
        .from('dreamcut_jobs')
        .select('*')
        .eq('job_id', jobId)
        .single();

      if (error) {
        this.log('error', `Failed to get job status for ${jobId}: ${error.message}`);
        return null;
      }

      return {
        id: data.id,
        jobId: data.job_id,
        type: data.type,
        status: data.status,
        priority: data.priority,
        attempts: data.attempts,
        maxAttempts: data.max_attempts,
        workerId: data.worker_id,
        startedAt: data.started_at,
        completedAt: data.completed_at,
        errorMessage: data.error_message,
        result: data.result,
        outputUrl: data.output_url,
        processingTimeMs: data.processing_time_ms,
        isDeadLetter: data.is_dead_letter,
        deadLetterReason: data.dead_letter_reason,
        nextRetryAt: data.next_retry_at
      };

    } catch (error) {
      this.log('error', `Exception getting job status for ${jobId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }

  /**
   * Get jobs ready for processing using production-safe function
   */
  async getReadyJobs(jobType?: string, limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await this.supabase.rpc('get_ready_jobs', {
        job_type_filter: jobType || null,
        limit_count: limit
      });

      if (error) {
        this.log('error', `Failed to get ready jobs: ${error.message}`);
        return [];
      }

      return data || [];

    } catch (error) {
      this.log('error', `Exception getting ready jobs: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }
  }

  /**
   * Update job status using production-safe function
   */
  async updateJobStatus(
    jobId: string,
    status: string,
    workerId?: string,
    errorMessage?: string,
    result?: any,
    processingTimeMs?: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await this.supabase.rpc('update_job_status_safe', {
        job_uuid: jobId,
        new_status: status,
        worker_id_param: workerId || null,
        error_message_param: errorMessage || null,
        result_data: result || null,
        processing_time_ms_param: processingTimeMs || null
      });

      if (error) {
        this.log('error', `Failed to update job status for ${jobId}: ${error.message}`);
        return { success: false, error: error.message };
      }

      this.log('debug', `Successfully updated job ${jobId} to status ${status}`);
      return { success: true };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log('error', `Exception updating job status for ${jobId}: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Retry a failed job using production-safe function
   */
  async retryJob(
    jobId: string,
    failureReason?: string,
    failureCategory?: string
  ): Promise<{ success: boolean; willRetry: boolean; error?: string }> {
    try {
      const { data, error } = await this.supabase.rpc('retry_failed_job', {
        job_uuid: jobId,
        failure_reason_param: failureReason || null,
        failure_category_param: failureCategory || null
      });

      if (error) {
        this.log('error', `Failed to retry job ${jobId}: ${error.message}`);
        return { success: false, willRetry: false, error: error.message };
      }

      const willRetry = data === true;
      this.log('info', `Job ${jobId} retry result: ${willRetry ? 'will retry' : 'moved to dead letter queue'}`);
      
      return { success: true, willRetry };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log('error', `Exception retrying job ${jobId}: ${errorMessage}`);
      return { success: false, willRetry: false, error: errorMessage };
    }
  }

  /**
   * Update worker heartbeat for health monitoring
   */
  async updateWorkerHeartbeat(workerId: string, jobId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await this.supabase.rpc('update_worker_heartbeat', {
        worker_id_param: workerId,
        job_uuid: jobId
      });

      if (error) {
        this.log('error', `Failed to update worker heartbeat for ${workerId}: ${error.message}`);
        return { success: false, error: error.message };
      }

      return { success: true };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log('error', `Exception updating worker heartbeat: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Detect and reassign jobs from stale workers
   */
  async detectStaleWorkers(heartbeatTimeoutMinutes: number = 5): Promise<{ success: boolean; staleJobsCount: number; error?: string }> {
    try {
      const { data, error } = await this.supabase.rpc('detect_stale_workers', {
        heartbeat_timeout_minutes: heartbeatTimeoutMinutes
      });

      if (error) {
        this.log('error', `Failed to detect stale workers: ${error.message}`);
        return { success: false, staleJobsCount: 0, error: error.message };
      }

      const staleJobsCount = data || 0;
      this.log('info', `Detected ${staleJobsCount} stale jobs and reassigned them`);
      
      return { success: true, staleJobsCount };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log('error', `Exception detecting stale workers: ${errorMessage}`);
      return { success: false, staleJobsCount: 0, error: errorMessage };
    }
  }

  /**
   * Get job performance metrics
   */
  async getJobMetrics(): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('dreamcut_job_metrics')
        .select('*');

      if (error) {
        this.log('error', `Failed to get job metrics: ${error.message}`);
        return [];
      }

      return data || [];

    } catch (error) {
      this.log('error', `Exception getting job metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }
  }

  /**
   * Get worker performance metrics
   */
  async getWorkerMetrics(): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('dreamcut_worker_metrics')
        .select('*');

      if (error) {
        this.log('error', `Failed to get worker metrics: ${error.message}`);
        return [];
      }

      return data || [];

    } catch (error) {
      this.log('error', `Exception getting worker metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }
  }

  /**
   * Get production manifest progress
   */
  async getProductionProgress(manifestId?: string): Promise<any[]> {
    try {
      let query = this.supabase
        .from('dreamcut_production_progress')
        .select('*');

      if (manifestId) {
        query = query.eq('manifest_id', manifestId);
      }

      const { data, error } = await query;

      if (error) {
        this.log('error', `Failed to get production progress: ${error.message}`);
        return [];
      }

      return data || [];

    } catch (error) {
      this.log('error', `Exception getting production progress: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }
  }

  /**
   * Clean up old completed jobs
   */
  async cleanupOldJobs(retentionDays: number = 30): Promise<{ success: boolean; deletedCount: number; error?: string }> {
    try {
      const { data, error } = await this.supabase.rpc('cleanup_old_jobs', {
        retention_days: retentionDays
      });

      if (error) {
        this.log('error', `Failed to cleanup old jobs: ${error.message}`);
        return { success: false, deletedCount: 0, error: error.message };
      }

      const deletedCount = data || 0;
      this.log('info', `Cleaned up ${deletedCount} old completed jobs`);
      
      return { success: true, deletedCount };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log('error', `Exception cleaning up old jobs: ${errorMessage}`);
      return { success: false, deletedCount: 0, error: errorMessage };
    }
  }

  /**
   * Clean up dead letter jobs
   */
  async cleanupDeadLetterJobs(retentionDays: number = 7): Promise<{ success: boolean; deletedCount: number; error?: string }> {
    try {
      const { data, error } = await this.supabase.rpc('cleanup_dead_letter_jobs', {
        retention_days: retentionDays
      });

      if (error) {
        this.log('error', `Failed to cleanup dead letter jobs: ${error.message}`);
        return { success: false, deletedCount: 0, error: error.message };
      }

      const deletedCount = data || 0;
      this.log('info', `Cleaned up ${deletedCount} dead letter jobs`);
      
      return { success: true, deletedCount };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log('error', `Exception cleaning up dead letter jobs: ${errorMessage}`);
      return { success: false, deletedCount: 0, error: errorMessage };
    }
  }

  /**
   * Logging utility
   */
  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [SAFE-JOB-MANAGER]`;
    
    const logMessage = data ? `${prefix} ${message}` : `${prefix} ${message}`;
    
    switch (level) {
      case 'debug':
        if (this.config.logLevel === 'debug') {
          console.log(logMessage, data || '');
        }
        break;
      case 'info':
        if (['debug', 'info'].includes(this.config.logLevel || 'info')) {
          console.log(logMessage, data || '');
        }
        break;
      case 'warn':
        if (['debug', 'info', 'warn'].includes(this.config.logLevel || 'info')) {
          console.warn(logMessage, data || '');
        }
        break;
      case 'error':
        console.error(logMessage, data || '');
        break;
    }
  }
}

/**
 * Create a production-safe job manager instance
 */
export function createProductionSafeJobManager(): ProductionSafeJobManager {
  const config: SafeJobConfig = {
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    logLevel: (process.env.LOG_LEVEL as any) || 'info'
  };

  // Validate required environment variables
  if (!config.supabaseUrl) {
    throw new Error('SUPABASE_URL environment variable is required');
  }
  if (!config.supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  }

  return new ProductionSafeJobManager(config);
}
