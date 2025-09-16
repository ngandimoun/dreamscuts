# Supabase Worker Setup Guide

This guide explains how to set up and run the Supabase-based job worker system that replaces Redis/Bull.

## 🛡️ **CRITICAL SAFETY NOTICE**

**This worker system is 100% SAFE and NON-BREAKING:**
- ✅ Your existing codebase, frontend, and UI will continue working exactly as before
- ✅ The worker system is completely optional - you can use it or not
- ✅ No automatic job creation interferes with existing functionality
- ✅ All existing APIs and functionality remain unchanged

**See [Worker Safety Guide](./worker-safety-guide.md) for complete safety details.**

## Overview

The worker system uses Supabase as a job queue instead of Redis/Bull, providing:
- No Redis infrastructure required
- All state persisted in Supabase
- Horizontal scaling support
- Built-in retry logic and error handling
- **100% optional integration** - doesn't break existing functionality

## Prerequisites

1. **Supabase Project**: You need a Supabase project with the jobs schema installed
2. **Environment Variables**: Required environment variables configured
3. **Node.js**: Version 18+ with TypeScript support

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Worker Configuration (Optional)
LOG_LEVEL=info
ENABLE_HEALTH_CHECK=true
HEALTH_CHECK_PORT=3001
```

## Database Setup

### 1. Install the Jobs Schema

Run the SQL migration to create the jobs table and related functions:

```bash
# Using psql (if you have direct database access)
psql $DATABASE_URL -f docs/supabase-jobs-schema.sql

# Or using the npm script
npm run db:migrate
```

### 2. Verify Schema Installation

Check that the following objects were created:
- `jobs` table
- `job_stats` view
- `active_jobs` view
- `pending_jobs_queue` view
- `claim_job()` function
- `complete_job()` function
- `fail_job()` function

## Running the Worker

### Development Mode

```bash
# Start the worker with auto-reload
npm run worker:dev

# Or start manually
ts-node --watch worker.ts
```

### Production Mode

```bash
# Start the worker
npm run worker:prod

# Or start manually
node -r ts-node/register worker.ts
```

### Multiple Workers

You can run multiple worker instances for horizontal scaling:

```bash
# Terminal 1
npm run worker

# Terminal 2
npm run worker

# Terminal 3
npm run worker
```

Each worker will have a unique ID and can process jobs independently.

## API Usage

### Create a Brief with Job

```bash
curl -X POST http://localhost:3000/api/briefs \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid",
    "title": "My Video Project",
    "description": "Create a video about AI",
    "query": "Generate a video about artificial intelligence",
    "media_type": "video",
    "use_pipeline": true
  }'
```

### Monitor Jobs

```bash
# Get pending jobs
curl http://localhost:3000/api/jobs?action=pending

# Get active jobs
curl http://localhost:3000/api/jobs?action=active

# Get job statistics
curl http://localhost:3000/api/jobs?action=stats

# Get jobs for a specific brief
curl http://localhost:3000/api/jobs?action=by_brief&brief_id=brief-uuid
```

## Worker Dashboard

Access the worker dashboard at `/test-worker` to monitor:
- Pending jobs queue
- Active jobs
- Job statistics
- Real-time updates

## Job Types

The system supports the following job types:

1. **analysis**: Initial content analysis
2. **asset_prep**: Asset preparation and optimization
3. **storyboard**: Storyboard generation
4. **render**: Final rendering
5. **video_generation**: Video creation
6. **image_processing**: Image processing
7. **text_analysis**: Text analysis

## Job Processing Pipeline

### Simple Pipeline (use_pipeline: false)
```
Brief Creation → Analysis Job
```

### Full Pipeline (use_pipeline: true)
```
Brief Creation → Analysis → Asset Prep → [Media-specific] → Render
```

Media-specific steps:
- **Video**: `analysis` → `asset_prep` → `video_generation` → `render`
- **Image**: `analysis` → `asset_prep` → `image_processing` → `render`
- **Audio**: `analysis` → `asset_prep` → `render`
- **Text**: `analysis` → `text_analysis` → `render`

## Safety Features

### Job Locking
- Jobs are atomically claimed to prevent race conditions
- Only one worker can process a job at a time
- Failed claims are logged and retried

### Retry Logic
- Configurable max attempts (default: 3)
- Exponential backoff for retries
- Automatic retry for transient failures
- Permanent failure after max attempts

### Error Handling
- Comprehensive error logging
- Job failure tracking
- Graceful worker shutdown
- Health check endpoint

### Monitoring
- Real-time job status tracking
- Performance metrics
- Worker health monitoring
- Detailed logging

## Scaling Considerations

### Horizontal Scaling
- Multiple workers can run simultaneously
- Jobs are distributed automatically
- No shared state between workers
- Database handles concurrency

### Performance Tuning
- Adjust `maxConcurrentJobs` based on server capacity
- Tune `pollInterval` for responsiveness vs. efficiency
- Set appropriate `jobTimeout` for job types
- Monitor database performance

### Resource Management
- Workers automatically handle job timeouts
- Graceful shutdown on SIGINT/SIGTERM
- Memory-efficient job processing
- Connection pooling for database

## Troubleshooting

### Common Issues

1. **Jobs stuck in processing**
   - Check worker logs for errors
   - Verify database connectivity
   - Restart workers if necessary

2. **High memory usage**
   - Reduce `maxConcurrentJobs`
   - Check for memory leaks in job processors
   - Monitor worker health

3. **Database connection errors**
   - Verify environment variables
   - Check Supabase project status
   - Ensure service role key has proper permissions

### Debugging

Enable debug logging:
```bash
LOG_LEVEL=debug npm run worker
```

Check worker health:
```bash
curl http://localhost:3001/health
```

Monitor database:
```sql
-- Check job distribution
SELECT type, status, COUNT(*) FROM jobs GROUP BY type, status;

-- Check stuck jobs
SELECT * FROM jobs WHERE status = 'processing' AND started_at < NOW() - INTERVAL '10 minutes';

-- Check job performance
SELECT * FROM job_stats ORDER BY count DESC;
```

## Integration with Existing Systems

### Query Analyzer Integration

Update your query analyzer to use the new job system:

```typescript
import { createBriefWithJob } from '@/lib/db/briefs';

// Instead of direct processing
const result = await createBriefWithJob({
  user_id: userId,
  title: 'Analysis Request',
  description: 'Process user query',
  query: userQuery,
  media_type: 'text'
});
```

### Asset Analyzer Integration

Update asset analyzers to create jobs:

```typescript
import { createJob } from '@/lib/db/jobs';

// Create analysis job for video
await createJob({
  brief_id: briefId,
  type: 'analysis',
  metadata: { video_url: videoUrl }
});
```

## Best Practices

1. **Job Design**
   - Keep jobs focused and atomic
   - Use appropriate timeouts
   - Handle errors gracefully
   - Log important events

2. **Worker Management**
   - Monitor worker health
   - Use process managers in production
   - Implement proper logging
   - Set up alerts for failures

3. **Database Optimization**
   - Regular cleanup of old jobs
   - Monitor query performance
   - Use appropriate indexes
   - Consider partitioning for large datasets

4. **Error Handling**
   - Implement retry logic
   - Log errors with context
   - Monitor error rates
   - Set up alerting

## Production Deployment

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'dreamcuts-worker',
    script: 'worker.ts',
    interpreter: 'ts-node',
    instances: 4, // Number of workers
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      LOG_LEVEL: 'info'
    }
  }]
};
EOF

# Start workers
pm2 start ecosystem.config.js

# Monitor
pm2 monit
```

### Using Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

CMD ["npm", "run", "worker:prod"]
```

### Health Checks

The worker includes a health check endpoint:

```bash
# Check worker health
curl http://localhost:3001/health

# Response
{
  "status": "healthy",
  "worker_id": "worker-12345-1234567890",
  "active_jobs": 2,
  "uptime": 3600
}
```

## Conclusion

The Supabase-based worker system provides a robust, scalable alternative to Redis/Bull with the following benefits:

- **Simplified Infrastructure**: No Redis required
- **Persistent State**: All data in Supabase
- **Horizontal Scaling**: Multiple workers supported
- **Built-in Monitoring**: Comprehensive dashboard
- **Error Handling**: Automatic retries and failure tracking
- **Easy Integration**: Simple API for job creation

This system is production-ready and can handle high-volume job processing with proper monitoring and scaling.
