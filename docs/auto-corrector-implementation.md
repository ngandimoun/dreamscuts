# Auto-Corrector System Implementation

## Overview

The Auto-Corrector system is a comprehensive error handling and retry mechanism designed to automatically handle failures from Together AI, Replicate, and Fal.ai services. It provides intelligent fallback logic, retry mechanisms, and service health monitoring to ensure reliable AI service execution.

## Architecture

### Core Components

1. **AutoCorrector Class** (`lib/auto-corrector/index.ts`)
   - Main orchestrator for service execution with auto-correction
   - Manages retry logic, fallback chains, and error analysis
   - Provides service health monitoring and statistics tracking

2. **Service Executors** (`lib/auto-corrector/services/`)
   - **Together AI Executor** (`together-ai.ts`)
   - **Replicate Executor** (`replicate.ts`)
   - **Fal.ai Executor** (`fal-ai.ts`)

3. **React Integration** (`hooks/useAutoCorrector.ts`)
   - React hook for frontend integration
   - Service health monitoring hook
   - Service statistics hook

4. **UI Components** (`components/auto-corrector/`)
   - Demo component with comprehensive testing interface
   - Service health dashboard
   - Statistics visualization

5. **API Endpoints** (`app/api/auto-corrector/`)
   - RESTful API for service execution
   - Health check endpoints
   - Statistics and service information endpoints

## Features

### 🔄 **Automatic Retry Logic**
- Configurable retry attempts (1-10)
- Exponential backoff for retry delays
- Intelligent error analysis to determine retryability
- Timeout handling for long-running requests

### 🔀 **Fallback Chain Management**
- Automatic fallback to alternative services
- Configurable fallback chains per service
- Service availability checking
- Graceful degradation

### 📊 **Service Health Monitoring**
- Real-time health status checking
- Response time monitoring
- Error rate tracking
- Service availability detection

### 📈 **Statistics and Analytics**
- Request success/failure rates
- Average response times
- Service usage patterns
- Performance metrics

### 🛡️ **Error Analysis and Classification**
- Automatic error categorization
- Retryable vs non-retryable error detection
- Service-specific error handling
- Detailed error logging

## Service Configuration

### Fallback Chains

```typescript
// Primary service → Fallback services
together → [replicate, fal, openai]
replicate → [together, fal, openai]
fal → [replicate, together, openai]
openai → [anthropic, together, replicate]
anthropic → [openai, together, replicate]
```

### Error Classification

#### Retryable Errors
- Network timeouts
- Rate limiting (429)
- Service unavailable (503)
- Bad gateway (502)
- Gateway timeout (504)
- Internal server errors (500)

#### Non-Retryable Errors
- Authentication failures (401)
- Authorization errors (403)
- Not found (404)
- Bad request (400)
- Quota exceeded
- Billing/payment issues

## Usage Examples

### Basic Usage

```typescript
import { executeWithAutoCorrection } from '@/lib/auto-corrector/services';

// Execute with auto-correction
const result = await executeWithAutoCorrection('together', {
  prompt: 'Hello, world!',
  max_tokens: 100
});

if (result.success) {
  console.log('Success:', result.data);
} else {
  console.error('Failed:', result.error);
}
```

### Advanced Configuration

```typescript
const result = await executeWithAutoCorrection('replicate', input, {
  maxRetries: 5,
  retryDelay: 2000,
  enableFallback: true,
  logLevel: 'info',
  timeout: 45000
});
```

### React Hook Usage

```typescript
import { useAutoCorrector } from '@/hooks/useAutoCorrector';

function MyComponent() {
  const { state, execute, reset, retry } = useAutoCorrector({
    maxRetries: 3,
    enableFallback: true,
    onSuccess: (result) => console.log('Success!', result),
    onError: (error) => console.error('Error:', error)
  });

  const handleExecute = async () => {
    await execute('together', { prompt: 'Hello!' });
  };

  return (
    <div>
      {state.isLoading && <div>Loading...</div>}
      {state.error && <div>Error: {state.error}</div>}
      {state.result && <div>Result: {JSON.stringify(state.result.data)}</div>}
      <button onClick={handleExecute}>Execute</button>
    </div>
  );
}
```

### Service Health Monitoring

```typescript
import { useServiceHealth } from '@/hooks/useAutoCorrector';

function HealthDashboard() {
  const { healthStatus, checkHealth } = useServiceHealth();

  return (
    <div>
      {Object.entries(healthStatus).map(([service, health]) => (
        <div key={service}>
          <span>{service}: </span>
          <span className={health.healthy ? 'text-green-500' : 'text-red-500'}>
            {health.healthy ? 'Healthy' : 'Unhealthy'}
          </span>
          <span> ({health.responseTime}ms)</span>
        </div>
      ))}
    </div>
  );
}
```

## API Endpoints

### Execute Auto-Corrector

```http
POST /api/auto-corrector
Content-Type: application/json

{
  "service": "together",
  "input": {
    "prompt": "Hello, world!",
    "max_tokens": 100
  },
  "options": {
    "maxRetries": 3,
    "enableFallback": true
  }
}
```

### Check Service Health

```http
GET /api/auto-corrector?action=health
GET /api/auto-corrector?action=health&service=together
```

### Get Available Services

```http
GET /api/auto-corrector?action=services
```

### Get Service Statistics

```http
GET /api/auto-corrector?action=stats
```

## Configuration Options

### AutoCorrectorConfig

```typescript
interface AutoCorrectorConfig {
  maxRetries: number;        // 1-10, default: 3
  retryDelay: number;        // 100-10000ms, default: 1000
  exponentialBackoff: boolean; // default: true
  enableFallback: boolean;   // default: true
  logLevel: 'silent' | 'error' | 'warn' | 'info' | 'debug'; // default: 'info'
  timeout: number;           // 1000-60000ms, default: 30000
}
```

### Service-Specific Configuration

```typescript
const SERVICE_CONFIG = {
  together: {
    name: 'Together AI',
    description: 'Open-source AI models API',
    defaultModel: 'meta-llama/Llama-2-7b-chat-hf',
    maxTokens: 4000,
    timeout: 30000
  },
  replicate: {
    name: 'Replicate',
    description: 'Machine learning model hosting platform',
    defaultModel: 'stability-ai/stable-diffusion',
    maxTokens: 1000,
    timeout: 60000
  },
  fal: {
    name: 'Fal.ai',
    description: 'Fast AI inference platform',
    defaultModel: 'fal-ai/flux-dev',
    maxTokens: 1000,
    timeout: 45000
  }
};
```

## Error Handling

### Error Analysis

The system automatically analyzes errors to determine if they should be retried:

```typescript
private analyzeError(error: any, service: ServiceType): ServiceError {
  const errorMessage = error.message || error.toString();
  const statusCode = error.status || error.statusCode || error.code;

  // Check against retryable patterns
  const retryablePatterns = [
    /timeout/i, /network/i, /connection/i, /rate limit/i,
    /throttle/i, /temporary/i, /service unavailable/i,
    /bad gateway/i, /gateway timeout/i, /internal server error/i,
    /502/i, /503/i, /504/i, /429/i
  ];

  // Check against non-retryable patterns
  const nonRetryablePatterns = [
    /authentication/i, /authorization/i, /forbidden/i,
    /not found/i, /bad request/i, /invalid/i, /malformed/i,
    /quota exceeded/i, /billing/i, /payment/i,
    /401/i, /403/i, /404/i, /400/i
  ];

  const isRetryable = retryablePatterns.some(pattern => pattern.test(errorMessage)) &&
                     !nonRetryablePatterns.some(pattern => pattern.test(errorMessage));

  return {
    service,
    error: errorMessage,
    code: error.code,
    statusCode,
    retryable: isRetryable,
    fallbackAvailable: true
  };
}
```

### Retry Logic

```typescript
// Exponential backoff calculation
const delay = config.exponentialBackoff 
  ? config.retryDelay * Math.pow(2, attempt - 1)
  : config.retryDelay;

// Wait before retry
await new Promise(resolve => setTimeout(resolve, delay));
```

## Performance Optimization

### Timeout Management

- Service-specific timeouts
- Request-level timeout handling
- Health check timeouts (5 seconds)

### Caching and Statistics

- In-memory statistics tracking
- Service performance metrics
- Request history logging

### Resource Management

- Abort controller for request cancellation
- Memory-efficient error logging
- Configurable retry limits

## Testing

### Test Page

Access the test page at `/test-auto-corrector` to:

- Test different services and configurations
- Monitor service health in real-time
- View execution statistics and logs
- Test retry and fallback mechanisms

### Manual Testing

```typescript
// Test retry logic
const result = await executeWithAutoCorrection('together', input, {
  maxRetries: 3,
  retryDelay: 1000
});

// Test fallback
const result = await executeWithAutoCorrection('together', input, {
  enableFallback: true
});

// Test health check
const health = await checkServiceHealth('together');
```

## Monitoring and Debugging

### Logging

The system provides comprehensive logging at different levels:

- **silent**: No logging
- **error**: Only error messages
- **warn**: Warnings and errors
- **info**: General information (default)
- **debug**: Detailed debugging information

### Statistics Tracking

```typescript
interface ServiceStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  lastUsed: Date;
}
```

### Health Monitoring

```typescript
interface ServiceHealth {
  healthy: boolean;
  responseTime: number;
  error?: string;
}
```

## Best Practices

### 1. **Configure Appropriate Timeouts**
- Set service-specific timeouts based on expected response times
- Use shorter timeouts for health checks
- Consider network conditions and service capabilities

### 2. **Use Fallback Services**
- Always enable fallback for critical operations
- Configure fallback chains based on service reliability
- Monitor fallback usage patterns

### 3. **Monitor Service Health**
- Regularly check service health status
- Set up alerts for service degradation
- Track performance metrics over time

### 4. **Handle Errors Gracefully**
- Implement proper error handling in your application
- Use the retry history for debugging
- Log errors for analysis and improvement

### 5. **Optimize Retry Configuration**
- Use exponential backoff for rate-limited services
- Set appropriate retry limits to avoid infinite loops
- Consider service-specific retry strategies

## Integration with Existing Systems

### Query Analyzer Integration

The auto-corrector can be integrated with the existing query analyzer system:

```typescript
// In query-analyzer/route.ts
import { executeWithAutoCorrection } from '@/lib/auto-corrector/services';

// Replace direct service calls with auto-corrected versions
const result = await executeWithAutoCorrection('together', {
  prompt: enhancedPrompt,
  max_tokens: max_new_tokens,
  temperature: temperature
});
```

### Asset Analyzer Integration

```typescript
// In video-asset-analyzer.ts, image-asset-analyzer.ts, text-asset-analyzer.ts
import { executeWithAutoCorrection } from '@/lib/auto-corrector/services';

// Wrap executor calls with auto-correction
const result = await executeWithAutoCorrection('replicate', {
  input: modelInput,
  model: modelId
});
```

## Future Enhancements

### Planned Features

1. **Circuit Breaker Pattern**
   - Automatic service disabling after consecutive failures
   - Gradual service re-enabling
   - Service recovery monitoring

2. **Load Balancing**
   - Intelligent service selection based on performance
   - Request distribution across healthy services
   - Dynamic service weighting

3. **Caching Layer**
   - Response caching for identical requests
   - Cache invalidation strategies
   - Performance optimization

4. **Advanced Analytics**
   - Service performance trends
   - Predictive failure detection
   - Cost optimization recommendations

5. **Webhook Support**
   - Real-time service status updates
   - Failure notifications
   - Performance alerts

## Conclusion

The Auto-Corrector system provides a robust, scalable solution for handling AI service failures with intelligent retry logic, automatic fallbacks, and comprehensive monitoring. It ensures high availability and reliability for AI-powered applications while providing detailed insights into service performance and health.

The system is designed to be easily integrated into existing applications and can be extended to support additional services and features as needed.
