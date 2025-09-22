/**
 * 🚀 Main Worker Entry Point
 * 
 * This is the main entry point for the Supabase Realtime Worker system.
 * It orchestrates all AI provider workers and provides a unified interface.
 */

import { startWorkerOrchestrator, WorkerOrchestrator } from './WorkerOrchestrator';

// Global orchestrator instance
let orchestrator: WorkerOrchestrator | null = null;

/**
 * Start the worker system
 */
async function startWorkers(): Promise<void> {
  try {
    console.log('🚀 Starting DreamCuts Worker System...');
    
    // Validate environment variables
    validateEnvironment();
    
    // Start the orchestrator
    orchestrator = await startWorkerOrchestrator();
    
    console.log('✅ Worker System started successfully!');
    console.log('📊 Worker Status:', orchestrator.getOrchestratorStatus());
    
    // Set up graceful shutdown
    setupGracefulShutdown();
    
  } catch (error) {
    console.error('❌ Failed to start Worker System:', error);
    process.exit(1);
  }
}

/**
 * Validate required environment variables
 */
function validateEnvironment(): void {
  const required = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  const optional = [
    'ELEVENLABS_API_KEY',
    'FAL_KEY',
    'SHOTSTACK_API_KEY',
    'OPENAI_API_KEY',
    'LOG_LEVEL',
    'ENABLE_WORKERS'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  console.log('✅ Environment validation passed');
  console.log('📋 Required variables:', required);
  console.log('📋 Optional variables:', optional.filter(key => process.env[key]));
}

/**
 * Set up graceful shutdown handlers
 */
function setupGracefulShutdown(): void {
  const shutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
    
    if (orchestrator) {
      try {
        await orchestrator.stop();
        console.log('✅ Graceful shutdown completed');
      } catch (error) {
        console.error('❌ Error during shutdown:', error);
      }
    }
    
    process.exit(0);
  };

  // Handle different shutdown signals
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGQUIT', () => shutdown('SIGQUIT'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    shutdown('uncaughtException');
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    shutdown('unhandledRejection');
  });
}

/**
 * Health check endpoint (if running as a service)
 */
function setupHealthCheck(): void {
  const port = process.env.HEALTH_CHECK_PORT || 8080;
  
  // Simple HTTP server for health checks
  const http = require('http');
  
  const server = http.createServer((req: any, res: any) => {
    if (req.url === '/health') {
      const status = orchestrator?.getOrchestratorStatus() || { isRunning: false };
      
      res.writeHead(status.isRunning ? 200 : 503, {
        'Content-Type': 'application/json'
      });
      
      res.end(JSON.stringify({
        status: status.isRunning ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: status.uptime,
        workers: status.workers?.length || 0,
        activeWorkers: status.activeWorkers || 0,
        totalActiveJobs: status.totalActiveJobs || 0
      }));
    } else if (req.url === '/status') {
      const status = orchestrator?.getOrchestratorStatus() || { isRunning: false };
      
      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      
      res.end(JSON.stringify(status, null, 2));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });

  server.listen(port, () => {
    console.log(`🏥 Health check server running on port ${port}`);
    console.log(`📊 Health endpoint: http://localhost:${port}/health`);
    console.log(`📈 Status endpoint: http://localhost:${port}/status`);
  });
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  try {
    // Start the worker system
    await startWorkers();
    
    // Set up health check if configured
    if (process.env.ENABLE_HEALTH_CHECK === 'true') {
      setupHealthCheck();
    }
    
    // Keep the process alive
    console.log('🔄 Worker system is running...');
    console.log('💡 Press Ctrl+C to stop gracefully');
    
    // Log status periodically
    setInterval(() => {
      if (orchestrator) {
        const status = orchestrator.getOrchestratorStatus();
        console.log(`📊 Status: ${status.activeWorkers}/${status.totalWorkers} workers active, ${status.totalActiveJobs} jobs running`);
      }
    }, 60000); // Every minute
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Start the application
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Unhandled error in main:', error);
    process.exit(1);
  });
}

// Export for use in other modules
export { startWorkers, WorkerOrchestrator };
export * from './base/BaseWorker';
export * from './elevenlabs/TTSWorker';
export * from './elevenlabs/MusicWorker';
export * from './elevenlabs/SoundEffectsWorker';
export * from './falai/ImageWorker';
export * from './falai/VideoWorker';
export * from './veed/LipSyncWorker';
export * from './veed/TalkingAvatarWorker';
export * from './shotstack/RenderWorker';
export * from './openai/ChartWorker';
export * from './WorkerOrchestrator';
