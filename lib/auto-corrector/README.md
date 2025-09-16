# Auto-Corrector System

A comprehensive error handling and retry mechanism for AI services including Together AI, Replicate, and Fal.ai.

## 🚀 Quick Start

### Basic Usage

```typescript
import { executeWithAutoCorrection } from '@/lib/auto-corrector/services';

// Execute with automatic retry and fallback
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

### React Hook Usage

```typescript
import { useAutoCorrector } from '@/hooks/useAutoCorrector';

function MyComponent() {
  const { state, execute, reset, retry } = useAutoCorrector({
    maxRetries: 3,
    enableFallback: true
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

## 📁 File Structure

```
lib/auto-corrector/
├── index.ts                    # Main AutoCorrector class
├── services/
│   ├── index.ts               # Service registry and utilities
│   ├── together-ai.ts         # Together AI service executor
│   ├── replicate.ts           # Replicate service executor
│   └── fal-ai.ts              # Fal.ai service executor
├── integration-example.ts     # Integration examples
└── README.md                  # This file

hooks/
└── useAutoCorrector.ts        # React hooks

components/auto-corrector/
└── AutoCorrectorDemo.tsx      # Demo component

app/
├── api/auto-corrector/
│   └── route.ts               # API endpoints
└── test-auto-corrector/
    └── page.tsx               # Test page
```

## 🔧 Configuration

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

### Service Configuration

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

## 🔄 Fallback Chains

The system automatically falls back to alternative services when the primary service fails:

```
Primary Service → Fallback Services
together → [replicate, fal, openai]
replicate → [together, fal, openai]
fal → [replicate, together, openai]
openai → [anthropic, together, replicate]
anthropic → [openai, together, replicate]
```

## 🛡️ Error Handling

### Retryable Errors
- Network timeouts
- Rate limiting (429)
- Service unavailable (503)
- Bad gateway (502)
- Gateway timeout (504)
- Internal server errors (500)

### Non-Retryable Errors
- Authentication failures (401)
- Authorization errors (403)
- Not found (404)
- Bad request (400)
- Quota exceeded
- Billing/payment issues

## 📊 Monitoring

### Service Health

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

### Service Statistics

```typescript
import { useServiceStats } from '@/hooks/useAutoCorrector';

function StatsDashboard() {
  const { stats, refreshStats } = useServiceStats();

  return (
    <div>
      {Object.entries(stats).map(([service, stat]) => (
        <div key={service}>
          <h3>{service}</h3>
          <p>Total Requests: {stat.totalRequests}</p>
          <p>Success Rate: {((stat.successfulRequests / stat.totalRequests) * 100).toFixed(1)}%</p>
          <p>Avg Response Time: {stat.averageResponseTime.toFixed(0)}ms</p>
        </div>
      ))}
    </div>
  );
}
```

## 🌐 API Endpoints

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

## 🔌 Integration Examples

### With Existing Executors

```typescript
import { executeWithAutoCorrectionWrapper } from '@/lib/auto-corrector/integration-example';

// Wrap your existing executor
const result = await executeWithAutoCorrectionWrapper(
  'together',
  yourExistingExecutor,
  input,
  { maxRetries: 3, enableFallback: true }
);
```

### With Asset Analyzers

```typescript
import { enhancedVideoAnalyzeWithAutoCorrection } from '@/lib/auto-corrector/integration-example';

// Enhanced video analysis with auto-correction
const result = await enhancedVideoAnalyzeWithAutoCorrection(
  videoUrl,
  prompt,
  userDescription
);
```

### Batch Processing

```typescript
import { processBatchWithAutoCorrection } from '@/lib/auto-corrector/integration-example';

// Process multiple inputs with auto-correction
const results = await processBatchWithAutoCorrection(
  'together',
  inputs,
  yourExecutor,
  { concurrency: 3, maxRetries: 2 }
);
```

## 🧪 Testing

### Test Page

Visit `/test-auto-corrector` to test the system with:

- Different services and configurations
- Real-time health monitoring
- Execution statistics and logs
- Retry and fallback mechanisms

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

## 📈 Performance

### Optimization Features

- **Exponential Backoff**: Reduces server load during retries
- **Timeout Management**: Prevents hanging requests
- **Service Health Monitoring**: Avoids unhealthy services
- **Statistics Tracking**: Performance insights and optimization

### Best Practices

1. **Configure Appropriate Timeouts**
   - Set service-specific timeouts based on expected response times
   - Use shorter timeouts for health checks

2. **Use Fallback Services**
   - Always enable fallback for critical operations
   - Monitor fallback usage patterns

3. **Monitor Service Health**
   - Regularly check service health status
   - Set up alerts for service degradation

4. **Handle Errors Gracefully**
   - Implement proper error handling in your application
   - Use the retry history for debugging

## 🔮 Future Enhancements

- **Circuit Breaker Pattern**: Automatic service disabling after failures
- **Load Balancing**: Intelligent service selection based on performance
- **Caching Layer**: Response caching for identical requests
- **Advanced Analytics**: Predictive failure detection
- **Webhook Support**: Real-time service status updates

## 📚 Documentation

- [Full Implementation Guide](../docs/auto-corrector-implementation.md)
- [API Reference](./services/index.ts)
- [Integration Examples](./integration-example.ts)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
