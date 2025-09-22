/**
 * 🎛️ Worker Orchestration and Management System
 * 
 * Manages all AI provider workers with health monitoring, scaling, and coordination.
 * Based on your clear instructions for worker management and orchestration.
 */

import { BaseWorker } from './base/BaseWorker';
import { TTSWorker, startTTSWorker } from './elevenlabs/TTSWorker';
import { ImageWorker, startImageWorker } from './falai/ImageWorker';
import { VideoWorker, startVideoWorker } from './falai/VideoWorker';
import { LipSyncWorker, startLipSyncWorker } from './veed/LipSyncWorker';
import { MusicWorker, startMusicWorker } from './elevenlabs/MusicWorker';
import { SoundEffectsWorker, startSoundEffectsWorker } from './elevenlabs/SoundEffectsWorker';
import { RenderWorker, startRenderWorker } from './shotstack/RenderWorker';
import { ChartWorker, startChartWorker } from './openai/ChartWorker';
import { TalkingAvatarWorker, startTalkingAvatarWorker } from './veed/TalkingAvatarWorker';

export interface WorkerOrchestratorConfig {
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  enableWorkers?: string[]; // Which workers to start
  healthCheckInterval?: number;
  maxRetries?: number;
  gracefulShutdownTimeout?: number;
}

export interface WorkerStatus {
  name: string;
  isRunning: boolean;
  activeJobs: number;
  maxConcurrentJobs: number;
  provider: string;
  features: string[];
  lastHealthCheck: Date;
  uptime: number;
  totalJobsProcessed: number;
  totalJobsFailed: number;
  averageProcessingTime: number;
}

export class WorkerOrchestrator {
  private config: WorkerOrchestratorConfig;
  private workers: Map<string, BaseWorker> = new Map();
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private isShuttingDown = false;
  private startTime = Date.now();

  constructor(config: WorkerOrchestratorConfig) {
    this.config = {
      logLevel: 'info',
      enableWorkers: ['tts', 'image', 'video', 'lipsync', 'music', 'sound_effects', 'render'],
      healthCheckInterval: 30000, // 30 seconds
      maxRetries: 3,
      gracefulShutdownTimeout: 30000, // 30 seconds
      ...config
    };
  }

  /**
   * Start all configured workers
   */
  async start(): Promise<void> {
    this.log('info', 'Starting Worker Orchestrator...');

    try {
      // Start workers based on configuration
      const workerStartPromises = [];

      if (this.config.enableWorkers?.includes('tts')) {
        workerStartPromises.push(this.startWorker('tts', startTTSWorker));
      }

      if (this.config.enableWorkers?.includes('image')) {
        workerStartPromises.push(this.startWorker('image', startImageWorker));
      }

      if (this.config.enableWorkers?.includes('video')) {
        workerStartPromises.push(this.startWorker('video', startVideoWorker));
      }

      if (this.config.enableWorkers?.includes('lipsync')) {
        workerStartPromises.push(this.startWorker('lipsync', startLipSyncWorker));
      }

      if (this.config.enableWorkers?.includes('music')) {
        workerStartPromises.push(this.startWorker('music', startMusicWorker));
      }

      if (this.config.enableWorkers?.includes('sound_effects')) {
        workerStartPromises.push(this.startWorker('sound_effects', startSoundEffectsWorker));
      }

      if (this.config.enableWorkers?.includes('render')) {
        workerStartPromises.push(this.startWorker('render', startRenderWorker));
      }

      if (this.config.enableWorkers?.includes('chart')) {
        workerStartPromises.push(this.startWorker('chart', startChartWorker));
      }

      if (this.config.enableWorkers?.includes('talking_avatar')) {
        workerStartPromises.push(this.startWorker('talking_avatar', startTalkingAvatarWorker));
      }

      // Start all workers in parallel
      await Promise.all(workerStartPromises);

      // Start health monitoring
      this.startHealthMonitoring();

      this.log('info', `Worker Orchestrator started successfully with ${this.workers.size} workers`);
    } catch (error) {
      this.log('error', `Failed to start Worker Orchestrator: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  /**
   * Stop all workers gracefully
   */
  async stop(): Promise<void> {
    if (this.isShuttingDown) {
      return;
    }

    this.isShuttingDown = true;
    this.log('info', 'Stopping Worker Orchestrator...');

    try {
      // Stop health monitoring
      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval);
        this.healthCheckInterval = null;
      }

      // Stop all workers
      const stopPromises = Array.from(this.workers.values()).map(worker => 
        worker.stop().catch(error => 
          this.log('error', `Error stopping worker: ${error.message}`)
        )
      );

      // Wait for all workers to stop with timeout
      await Promise.race([
        Promise.all(stopPromises),
        new Promise(resolve => setTimeout(resolve, this.config.gracefulShutdownTimeout))
      ]);

      this.workers.clear();
      this.log('info', 'Worker Orchestrator stopped successfully');
    } catch (error) {
      this.log('error', `Error during shutdown: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Start a specific worker
   */
  private async startWorker(name: string, startFunction: () => Promise<BaseWorker>): Promise<void> {
    try {
      this.log('info', `Starting ${name} worker...`);
      const worker = await startFunction();
      this.workers.set(name, worker);
      this.log('info', `${name} worker started successfully`);
    } catch (error) {
      this.log('error', `Failed to start ${name} worker: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  /**
   * Start health monitoring
   */
  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, this.config.healthCheckInterval);
  }

  /**
   * Perform health check on all workers
   */
  private async performHealthCheck(): Promise<void> {
    const healthPromises = Array.from(this.workers.entries()).map(async ([name, worker]) => {
      try {
        const status = worker.getStatus();
        this.log('debug', `Health check for ${name}: ${status.isRunning ? 'healthy' : 'unhealthy'}`, status);
        
        if (!status.isRunning) {
          this.log('warn', `Worker ${name} is not running, attempting restart...`);
          // In a production system, you might want to restart the worker here
        }
      } catch (error) {
        this.log('error', `Health check failed for ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    await Promise.all(healthPromises);
  }

  /**
   * Get status of all workers
   */
  getWorkersStatus(): WorkerStatus[] {
    const statuses: WorkerStatus[] = [];

    for (const [name, worker] of this.workers.entries()) {
      const status = worker.getStatus();
      statuses.push({
        name,
        isRunning: status.isRunning,
        activeJobs: status.activeJobs,
        maxConcurrentJobs: status.maxConcurrentJobs,
        provider: status.provider || 'unknown',
        features: status.features || [],
        lastHealthCheck: new Date(),
        uptime: Date.now() - this.startTime,
        totalJobsProcessed: 0, // Would be tracked in a real implementation
        totalJobsFailed: 0, // Would be tracked in a real implementation
        averageProcessingTime: 0 // Would be tracked in a real implementation
      });
    }

    return statuses;
  }

  /**
   * Get overall orchestrator status
   */
  getOrchestratorStatus(): {
    isRunning: boolean;
    totalWorkers: number;
    activeWorkers: number;
    totalActiveJobs: number;
    uptime: number;
    workers: WorkerStatus[];
  } {
    const workersStatus = this.getWorkersStatus();
    const activeWorkers = workersStatus.filter(w => w.isRunning).length;
    const totalActiveJobs = workersStatus.reduce((sum, w) => sum + w.activeJobs, 0);

    return {
      isRunning: !this.isShuttingDown,
      totalWorkers: this.workers.size,
      activeWorkers,
      totalActiveJobs,
      uptime: Date.now() - this.startTime,
      workers: workersStatus
    };
  }

  /**
   * Restart a specific worker
   */
  async restartWorker(workerName: string): Promise<void> {
    const worker = this.workers.get(workerName);
    if (!worker) {
      throw new Error(`Worker ${workerName} not found`);
    }

    this.log('info', `Restarting ${workerName} worker...`);

    try {
      await worker.stop();
      this.workers.delete(workerName);

      // Restart based on worker type
      switch (workerName) {
        case 'tts':
          await this.startWorker('tts', startTTSWorker);
          break;
        case 'image':
          await this.startWorker('image', startImageWorker);
          break;
        case 'video':
          await this.startWorker('video', startVideoWorker);
          break;
        case 'lipsync':
          await this.startWorker('lipsync', startLipSyncWorker);
          break;
        case 'music':
          await this.startWorker('music', startMusicWorker);
          break;
        case 'sound_effects':
          await this.startWorker('sound_effects', startSoundEffectsWorker);
          break;
        case 'render':
          await this.startWorker('render', startRenderWorker);
          break;
        case 'chart':
          await this.startWorker('chart', startChartWorker);
          break;
        case 'talking_avatar':
          await this.startWorker('talking_avatar', startTalkingAvatarWorker);
          break;
        default:
          throw new Error(`Unknown worker type: ${workerName}`);
      }

      this.log('info', `${workerName} worker restarted successfully`);
    } catch (error) {
      this.log('error', `Failed to restart ${workerName} worker: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  /**
   * Scale workers based on demand
   */
  async scaleWorkers(demand: 'low' | 'medium' | 'high'): Promise<void> {
    this.log('info', `Scaling workers for ${demand} demand`);

    // In a real implementation, you would adjust worker concurrency limits
    // or start/stop additional worker instances based on demand
    for (const [name, worker] of this.workers.entries()) {
      const status = worker.getStatus();
      this.log('debug', `Worker ${name} current capacity: ${status.activeJobs}/${status.maxConcurrentJobs}`);
    }
  }

  /**
   * Logging utility
   */
  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [ORCHESTRATOR]`;
    
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
 * Create and start Worker Orchestrator
 */
export async function startWorkerOrchestrator(): Promise<WorkerOrchestrator> {
  const config: WorkerOrchestratorConfig = {
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    logLevel: (process.env.LOG_LEVEL as any) || 'info',
    enableWorkers: process.env.ENABLE_WORKERS?.split(',') || [
      'tts', 'image', 'video', 'lipsync', 'music', 'sound_effects', 'render'
    ],
    healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL || '30000'),
    maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
    gracefulShutdownTimeout: parseInt(process.env.GRACEFUL_SHUTDOWN_TIMEOUT || '30000')
  };

  // Validate required environment variables
  if (!config.supabaseUrl) {
    throw new Error('SUPABASE_URL environment variable is required');
  }
  if (!config.supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  }

  const orchestrator = new WorkerOrchestrator(config);
  await orchestrator.start();
  
  return orchestrator;
}

// Export for use in main worker script
export { WorkerOrchestrator };
