#!/usr/bin/env ts-node

/**
 * Supabase-based Job Worker
 * 
 * This worker replaces Redis/Bull with a Supabase-based job queue.
 * It polls for pending jobs and processes them safely with retry logic.
 * 
 * Usage:
 *   npm run worker
 *   or
 *   ts-node worker.ts
 */

import { createClient } from "@supabase/supabase-js";
import { 
  getPendingJobs, 
  claimJob, 
  completeJob, 
  failJob, 
  getJob,
  Job,
  JobType 
} from "./lib/db/jobs";
import { getBrief } from "./lib/db/briefs";

// Worker configuration
const WORKER_CONFIG = {
  pollInterval: 3000, // Poll every 3 seconds
  maxConcurrentJobs: 5, // Process up to 5 jobs concurrently
  jobTimeout: 300000, // 5 minutes timeout per job
  workerId: `worker-${process.pid}-${Date.now()}`,
  logLevel: process.env.LOG_LEVEL || 'info'
} as const;

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Worker state
let isRunning = false;
let activeJobs = new Set<string>();
let shutdownRequested = false;

// Logging utility
function log(level: string, message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] [${WORKER_CONFIG.workerId}] ${message}`;
  
  if (data) {
    console.log(logMessage, data);
  } else {
    console.log(logMessage);
  }
}

// Job processors
const jobProcessors: Record<JobType, (job: Job) => Promise<any>> = {
  async analysis(job: Job) {
    log('info', `Processing analysis job ${job.id}`, { brief_id: job.brief_id });
    
    // Get the brief using the UUID id
    const { data: brief, error: briefError } = await supabase
      .from('briefs')
      .select('*')
      .eq('id', job.brief_id)
      .single();

    if (briefError || !brief) {
      throw new Error(`Brief not found: ${briefError?.message || 'Unknown error'}`);
    }
    
    // Run the real Step 1 analyzer using existing models and auto-correction
    const { runStep1Analyzer } = await import('./lib/analyzer/step1-analyzer');
    
    log('info', `Running Step 1 analyzer for brief ${brief.brief_id}`);
    const analysisResult = await runStep1Analyzer(brief);
    
    if (!analysisResult.ok) {
      throw new Error(`Step 1 analysis failed: ${analysisResult.error}`);
    }

    // Update brief with analysis results
    try {
      const { error: updateError } = await supabase
        .from('briefs')
        .update({ 
          analysis: analysisResult.value,
          status: 'processing' // Update status to processing
        })
        .eq('id', job.brief_id);

      if (updateError) {
        log('warn', `Failed to update brief with analysis: ${updateError.message}`);
      } else {
        log('info', `Updated brief ${brief.brief_id} with analysis results`);
      }
    } catch (updateError) {
      log('warn', `Failed to update brief status: ${updateError}`);
    }

    // Return the analysis result for job storage
    return {
      brief_id: brief.brief_id,
      analysis_completed: true,
      analysis_result: analysisResult.value,
      confidence_score: analysisResult.value.confidence_score,
      intent: analysisResult.value.intent,
      creative_options_count: analysisResult.value.creative_options.length,
      recommendations_count: analysisResult.value.recommendations.length,
      processed_at: new Date().toISOString()
    };
  },

  async asset_prep(job: Job) {
    log('info', `Processing asset prep job ${job.id}`, { brief_id: job.brief_id });
    
    // Simulate asset preparation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      assets_prepared: true,
      asset_count: 3,
      prepared_at: new Date().toISOString()
    };
  },

  async storyboard(job: Job) {
    log('info', `Processing storyboard job ${job.id}`, { brief_id: job.brief_id });
    
    // Simulate storyboard creation
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    return {
      storyboard_created: true,
      scene_count: 5,
      created_at: new Date().toISOString()
    };
  },

  async render(job: Job) {
    log('info', `Processing render job ${job.id}`, { brief_id: job.brief_id });
    
    // Simulate rendering
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    return {
      rendered: true,
      output_url: `https://example.com/render/${job.brief_id}.mp4`,
      rendered_at: new Date().toISOString()
    };
  },

  async video_generation(job: Job) {
    log('info', `Processing video generation job ${job.id}`, { brief_id: job.brief_id });
    
    // Here you would integrate with your video generation logic
    // For now, we'll simulate video generation
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    return {
      video_generated: true,
      video_url: `https://example.com/video/${job.brief_id}.mp4`,
      duration: 30,
      generated_at: new Date().toISOString()
    };
  },

  async image_processing(job: Job) {
    log('info', `Processing image processing job ${job.id}`, { brief_id: job.brief_id });
    
    // Here you would integrate with your image processing logic
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      image_processed: true,
      image_url: `https://example.com/image/${job.brief_id}.jpg`,
      processed_at: new Date().toISOString()
    };
  },

  async text_analysis(job: Job) {
    log('info', `Processing text analysis job ${job.id}`, { brief_id: job.brief_id });
    
    // Here you would integrate with your text analysis logic
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      text_analyzed: true,
      analysis: {
        word_count: 150,
        sentiment: 'neutral',
        topics: ['technology', 'innovation']
      },
      analyzed_at: new Date().toISOString()
    };
  }
};

/**
 * Process a single job
 */
async function processJob(job: Job): Promise<void> {
  const startTime = Date.now();
  
  try {
    log('info', `Starting job ${job.id} (${job.type})`, {
      brief_id: job.brief_id,
      attempt: job.attempts + 1,
      max_attempts: job.max_attempts
    });

    // Get the processor for this job type
    const processor = jobProcessors[job.type];
    if (!processor) {
      throw new Error(`No processor found for job type: ${job.type}`);
    }

    // Process the job with timeout
    const result = await Promise.race([
      processor(job),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Job timeout')), WORKER_CONFIG.jobTimeout)
      )
    ]);

    // Complete the job
    const completeResult = await completeJob(job.id, result);
    if (!completeResult.ok) {
      throw new Error(`Failed to complete job: ${completeResult.error}`);
    }

    // Update brief status based on job completion
    try {
      const { updateBriefStatusFromJobs } = await import('./lib/db/brief-integration');
      // Get the brief_id from the job metadata or brief table
      const { data: brief } = await supabase
        .from('briefs')
        .select('brief_id')
        .eq('id', job.brief_id)
        .single();
      
      if (brief) {
        const briefResult = await updateBriefStatusFromJobs(brief.brief_id);
        if (briefResult.ok) {
          log('info', `Updated brief status: ${briefResult.data?.new_status}`);
        }
      }
    } catch (statusError) {
      log('warn', `Failed to update brief status: ${statusError}`);
    }

    const duration = Date.now() - startTime;
    log('info', `Completed job ${job.id}`, {
      duration: `${duration}ms`,
      result_type: typeof result
    });

  } catch (error: any) {
    const duration = Date.now() - startTime;
    log('error', `Failed job ${job.id}`, {
      error: error.message,
      duration: `${duration}ms`,
      attempt: job.attempts + 1
    });

    // Fail the job
    const failResult = await failJob(job.id, error.message);
    if (!failResult.ok) {
      log('error', `Failed to mark job ${job.id} as failed`, {
        error: failResult.error
      });
    }
  } finally {
    // Remove from active jobs
    activeJobs.delete(job.id);
  }
}

/**
 * Process pending jobs
 */
async function processPendingJobs(): Promise<void> {
  try {
    // Get pending jobs
    const pendingResult = await getPendingJobs(WORKER_CONFIG.maxConcurrentJobs);
    if (!pendingResult.ok) {
      log('error', 'Failed to get pending jobs', { error: pendingResult.error });
      return;
    }

    const pendingJobs = pendingResult.data || [];
    
    if (pendingJobs.length === 0) {
      return; // No jobs to process
    }

    log('info', `Found ${pendingJobs.length} pending jobs`);

    // Process jobs concurrently (up to maxConcurrentJobs)
    const availableSlots = WORKER_CONFIG.maxConcurrentJobs - activeJobs.size;
    const jobsToProcess = pendingJobs.slice(0, availableSlots);

    for (const job of jobsToProcess) {
      // Skip if we're already processing this job
      if (activeJobs.has(job.id)) {
        continue;
      }

      // Try to claim the job
      const claimResult = await claimJob(job.id, WORKER_CONFIG.workerId);
      if (!claimResult.ok) {
        log('warn', `Could not claim job ${job.id}`, { error: claimResult.error });
        continue;
      }

      // Add to active jobs and process
      activeJobs.add(job.id);
      processJob(claimResult.data!).catch(error => {
        log('error', `Unexpected error processing job ${job.id}`, { error: error.message });
        activeJobs.delete(job.id);
      });
    }

  } catch (error: any) {
    log('error', 'Error in processPendingJobs', { error: error.message });
  }
}

/**
 * Main worker loop
 */
async function workerLoop(): Promise<void> {
  log('info', 'Worker loop started', {
    worker_id: WORKER_CONFIG.workerId,
    poll_interval: WORKER_CONFIG.pollInterval,
    max_concurrent: WORKER_CONFIG.maxConcurrentJobs
  });

  while (!shutdownRequested) {
    try {
      await processPendingJobs();
    } catch (error: any) {
      log('error', 'Error in worker loop', { error: error.message });
    }

    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, WORKER_CONFIG.pollInterval));
  }

  log('info', 'Worker loop stopped');
}

/**
 * Graceful shutdown
 */
async function gracefulShutdown(): Promise<void> {
  log('info', 'Shutdown requested, waiting for active jobs to complete...');
  shutdownRequested = true;

  // Wait for active jobs to complete (with timeout)
  const shutdownTimeout = 30000; // 30 seconds
  const startTime = Date.now();

  while (activeJobs.size > 0 && (Date.now() - startTime) < shutdownTimeout) {
    log('info', `Waiting for ${activeJobs.size} active jobs to complete...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  if (activeJobs.size > 0) {
    log('warn', `Shutdown timeout reached, ${activeJobs.size} jobs still active`);
  }

  log('info', 'Worker shutdown complete');
  process.exit(0);
}

/**
 * Health check endpoint (optional)
 */
function startHealthCheck(): void {
  const port = process.env.HEALTH_CHECK_PORT || 3001;
  
  const http = require('http');
  const server = http.createServer((req: any, res: any) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'healthy',
        worker_id: WORKER_CONFIG.workerId,
        active_jobs: activeJobs.size,
        uptime: process.uptime()
      }));
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  server.listen(port, () => {
    log('info', `Health check server started on port ${port}`);
  });
}

// Main execution
async function main(): Promise<void> {
  log('info', 'Starting Supabase Job Worker', {
    node_version: process.version,
    worker_id: WORKER_CONFIG.workerId
  });

  // Validate environment variables
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    log('error', 'Missing required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  // Start health check server if enabled
  if (process.env.ENABLE_HEALTH_CHECK === 'true') {
    startHealthCheck();
  }

  // Handle graceful shutdown
  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    log('error', 'Uncaught exception', { error: error.message, stack: error.stack });
    gracefulShutdown();
  });

  process.on('unhandledRejection', (reason) => {
    log('error', 'Unhandled rejection', { reason });
    gracefulShutdown();
  });

  // Start the worker loop
  try {
    await workerLoop();
  } catch (error: any) {
    log('error', 'Fatal error in worker', { error: error.message });
    process.exit(1);
  }
}

// Start the worker
if (require.main === module) {
  main().catch((error) => {
    log('error', 'Failed to start worker', { error: error.message });
    process.exit(1);
  });
}

export { workerLoop, processJob, jobProcessors };
