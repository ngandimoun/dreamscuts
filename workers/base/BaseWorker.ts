/**
 * 🛠️ Base Worker Infrastructure
 * 
 * Provides the foundation for all AI provider workers with Supabase Realtime integration.
 * Based on your clear instructions for model usage and job processing.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface WorkerConfig {
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
  jobType: string;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  healthCheckPort?: number;
  maxConcurrentJobs?: number;
  retryDelayMs?: number;
}

export interface JobResult {
  success: boolean;
  outputUrl?: string;
  result?: any;
  error?: string;
  processingTimeMs?: number;
}

export interface JobPayload {
  [key: string]: any;
}

export abstract class BaseWorker {
  protected supabase: SupabaseClient;
  protected config: WorkerConfig;
  protected channel: RealtimeChannel | null = null;
  protected isRunning = false;
  protected activeJobs = new Set<string>();
  protected maxConcurrentJobs: number;

  constructor(config: WorkerConfig) {
    this.config = config;
    this.supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey);
    this.maxConcurrentJobs = config.maxConcurrentJobs || 3;
  }

  /**
   * Start the worker and listen for jobs
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      this.log('warn', 'Worker is already running');
      return;
    }

    this.log('info', `Starting ${this.config.jobType} worker...`);
    
    try {
      // Set up Supabase Realtime channel
      this.channel = this.supabase
        .channel(`jobs-${this.config.jobType}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'dreamcut_jobs',
            filter: `type=eq.${this.config.jobType}`
          },
          async (payload) => {
            await this.handleNewJob(payload.new);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'dreamcut_jobs',
            filter: `type=eq.${this.config.jobType}`
          },
          async (payload) => {
            // Handle job updates if needed
            this.log('debug', `Job ${payload.new.job_id} updated: ${payload.new.status}`);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            this.log('info', `Successfully subscribed to ${this.config.jobType} jobs`);
            this.isRunning = true;
          } else if (status === 'CHANNEL_ERROR') {
            this.log('error', 'Failed to subscribe to job channel');
          }
        });

      // Start health check server if configured
      if (this.config.healthCheckPort) {
        await this.startHealthCheck();
      }

      this.log('info', `${this.config.jobType} worker started successfully`);
    } catch (error) {
      this.log('error', `Failed to start worker: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  /**
   * Stop the worker
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.log('info', `Stopping ${this.config.jobType} worker...`);
    
    if (this.channel) {
      await this.supabase.removeChannel(this.channel);
      this.channel = null;
    }
    
    this.isRunning = false;
    this.log('info', `${this.config.jobType} worker stopped`);
  }

  /**
   * Handle a new job from Supabase Realtime
   */
  private async handleNewJob(job: any): Promise<void> {
    const jobId = job.job_id;
    
    // Check if we're at capacity
    if (this.activeJobs.size >= this.maxConcurrentJobs) {
      this.log('warn', `At capacity (${this.maxConcurrentJobs} jobs), skipping ${jobId}`);
      return;
    }

    // Check if job is pending
    if (job.status !== 'pending') {
      this.log('debug', `Job ${jobId} is not pending (status: ${job.status}), skipping`);
      return;
    }

    // Add to active jobs
    this.activeJobs.add(jobId);
    
    try {
      this.log('info', `Processing job ${jobId}...`);
      
      // Mark job as processing
      await this.updateJobStatus(jobId, 'processing', { started_at: new Date().toISOString() });
      
      // Process the job
      const result = await this.processJob(job);
      
      if (result.success) {
        // Mark job as completed
        await this.updateJobStatus(jobId, 'completed', {
          completed_at: new Date().toISOString(),
          result: result.result,
          output_url: result.outputUrl,
          processing_time_ms: result.processingTimeMs
        });
        
        this.log('info', `Job ${jobId} completed successfully`);
      } else {
        // Mark job as failed
        await this.updateJobStatus(jobId, 'failed', {
          completed_at: new Date().toISOString(),
          error_message: result.error,
          processing_time_ms: result.processingTimeMs
        });
        
        this.log('error', `Job ${jobId} failed: ${result.error}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Mark job as failed
      await this.updateJobStatus(jobId, 'failed', {
        completed_at: new Date().toISOString(),
        error_message: errorMessage
      });
      
      this.log('error', `Job ${jobId} failed with exception: ${errorMessage}`);
    } finally {
      // Remove from active jobs
      this.activeJobs.delete(jobId);
    }
  }

  /**
   * Update job status in database
   */
  protected async updateJobStatus(
    jobId: string, 
    status: string, 
    updates: Record<string, any> = {}
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('dreamcut_jobs')
        .update({
          status,
          updated_at: new Date().toISOString(),
          ...updates
        })
        .eq('job_id', jobId);

      if (error) {
        this.log('error', `Failed to update job ${jobId}: ${error.message}`);
      }
    } catch (error) {
      this.log('error', `Exception updating job ${jobId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Upload file to Supabase Storage
   */
  protected async uploadToStorage(
    bucket: string,
    path: string,
    file: Buffer | Uint8Array,
    contentType: string
  ): Promise<string> {
    const { error: uploadError } = await this.supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        upsert: true
      });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    const { data: urlData } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return urlData.publicUrl;
  }

  /**
   * Start health check server
   */
  private async startHealthCheck(): Promise<void> {
    // Simple health check endpoint
    const port = this.config.healthCheckPort!;
    
    // This would be implemented with a simple HTTP server
    // For now, just log that health check is available
    this.log('info', `Health check available on port ${port}`);
  }

  /**
   * Logging utility
   */
  protected log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${this.config.jobType.toUpperCase()}]`;
    
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

  /**
   * Abstract method to be implemented by specific workers
   */
  protected abstract processJob(job: any): Promise<JobResult>;

  /**
   * Get worker status
   */
  getStatus(): {
    isRunning: boolean;
    jobType: string;
    activeJobs: number;
    maxConcurrentJobs: number;
  } {
    return {
      isRunning: this.isRunning,
      jobType: this.config.jobType,
      activeJobs: this.activeJobs.size,
      maxConcurrentJobs: this.maxConcurrentJobs
    };
  }
}
