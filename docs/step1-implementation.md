# DreamCut Step 1 - Query Analyzer Implementation

This document describes the complete implementation of DreamCut's Step 1 Query Analyzer, which processes user queries and assets to create comprehensive creative briefs.

## Overview

The Query Analyzer is the first step in the DreamCut creative pipeline. It:

1. **Analyzes user queries** using advanced LLMs
2. **Processes media assets** (images, videos, audio) using specialized AI models
3. **Generates creative options** and processing plans
4. **Creates structured briefs** for downstream processing steps
5. **Stores results** in Supabase for persistence and tracking

## Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Query Analyzer API                       │
│  app/api/dreamcut/query-analyzer/route.ts                  │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Analysis Pipeline                        │
│  • Input Validation (Zod)                                   │
│  • Parallel Asset Processing                                │
│  • LLM Intent Analysis                                      │
│  • Creative Options Generation                              │
│  • Brief Package Creation                                   │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    External AI Services                     │
│  • Together.ai (Vision + LLM)                              │
│  • Qwen (Fallback Vision + LLM)                            │
│  • FAL.ai (Video Understanding)                            │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Storage                             │
│  • Supabase (Briefs Table)                                 │
│  • Structured JSON Storage                                 │
│  • User Association & Tracking                             │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Details

### 1. API Route (`app/api/dreamcut/query-analyzer/route.ts`)

**Key Features:**
- **Non-throwing adapters**: All external API calls are wrapped in safe adapters
- **Parallel processing**: Assets are analyzed concurrently for performance
- **Fallback mechanisms**: Multiple AI providers ensure reliability
- **Comprehensive validation**: Zod schemas validate all inputs and outputs
- **Error handling**: Graceful degradation with detailed error reporting

**Request Schema:**
```typescript
{
  query: string;                    // User's creative request
  assets: MediaAsset[];            // Array of media assets
  intent?: 'image' | 'video' | 'audio' | 'mix';
  outputImages?: number;           // 1-20 images
  outputVideoSeconds?: number;     // 5-180 seconds
  preferences?: {
    aspect_ratio?: string;
    platform_target?: string;
  };
  budget_credits?: number;
}
```

**Response Schema:**
```typescript
{
  success: boolean;
  brief?: BriefPackage;
  error?: string;
  details?: any;
}
```

### 2. AI Service Adapters

#### Together.ai Adapter
- **Vision Analysis**: Uses Llama-3.3-70B for image understanding
- **LLM Processing**: Generates creative options and intent analysis
- **Endpoint**: `https://api.together.ai/v1/chat/completions`

#### Qwen Adapter (Fallback)
- **Vision Analysis**: Uses Qwen-VL-Plus for multimodal understanding
- **LLM Processing**: Alternative text generation
- **Endpoint**: `https://dashscope.aliyuncs.com/api/v1/services/aigc/...`

#### FAL.ai Adapter
- **Video Understanding**: Specialized video analysis
- **Endpoint**: `https://fal.run/fal-ai/video-understanding`

### 3. Brief Package Structure

```typescript
interface BriefPackage {
  briefId: string;                 // Unique identifier
  createdAt: string;              // ISO timestamp
  request: QueryAnalyzerRequest;  // Original request
  analysis: {
    vision?: Record<string, any>;  // Image analysis results
    video?: Record<string, any>;   // Video analysis results
    audio?: Record<string, any>;   // Audio analysis results
  };
  plan: {
    assetProcessing: Record<string, string[]>;  // Processing actions
    creativeOptions: any[];                     // Generated options
    stockSearchCandidates?: any[];              // Stock media suggestions
    costEstimate?: number;                      // Estimated cost
  };
  status: 'analyzed' | 'queued' | 'processing' | 'done' | 'failed';
}
```

### 4. React Integration

#### Hook (`hooks/useQueryAnalyzer.ts`)
- **Type-safe API calls** with full TypeScript support
- **Loading states** and error handling
- **Automatic validation** using Zod schemas
- **Caching** of last successful brief

#### Components
- **QueryAnalyzerIntegration**: Drop-in component for chat interfaces
- **QueryAnalyzerDemo**: Standalone testing component

## Database Schema

### Briefs Table
```sql
CREATE TABLE briefs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brief_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  request JSONB NOT NULL,
  analysis JSONB NOT NULL,
  plan JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'analyzed',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  metadata JSONB DEFAULT '{}'
);
```

**Indexes:**
- `brief_id` (unique)
- `status` (for filtering)
- `user_id` (for user queries)
- `created_at` (for time-based queries)

## Usage Examples

### Basic API Call
```typescript
const response = await fetch('/api/dreamcut/query-analyzer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: "Create a video about nature",
    assets: [
      {
        url: "https://example.com/nature.jpg",
        mediaType: "image"
      }
    ],
    intent: "video",
    preferences: {
      aspect_ratio: "16:9",
      platform_target: "social"
    }
  })
});

const result = await response.json();
```

### React Hook Usage
```typescript
import { useQueryAnalyzer } from '@/hooks/useQueryAnalyzer';

function MyComponent() {
  const { analyzeQuery, isLoading, error, lastBrief } = useQueryAnalyzer();
  
  const handleAnalyze = async () => {
    const result = await analyzeQuery({
      query: "Create a video about nature",
      assets: [/* ... */],
      intent: "video"
    });
    
    if (result.success) {
      console.log('Brief created:', result.brief);
    }
  };
  
  return (
    <button onClick={handleAnalyze} disabled={isLoading}>
      {isLoading ? 'Analyzing...' : 'Analyze Query'}
    </button>
  );
}
```

## Testing

### Test Page
Visit `/test-query-analyzer` to access the interactive demo component.

### Manual Testing
```bash
curl -X POST http://localhost:3000/api/dreamcut/query-analyzer \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Create a video about nature",
    "assets": [
      {
        "url": "https://example.com/image.jpg",
        "mediaType": "image"
      }
    ],
    "intent": "video"
  }'
```

## Performance Considerations

### Parallel Processing
- Assets are analyzed concurrently using `Promise.all()`
- Multiple AI providers provide redundancy
- Timeout controls prevent hanging requests

### Caching Strategy
- Brief packages are stored in Supabase for persistence
- Client-side hook caches last successful result
- Future: Redis caching for frequently accessed briefs

### Rate Limiting
- Built-in timeout controls (20s default)
- Exponential backoff for retries
- Provider-specific rate limit handling

## Error Handling

### Adapter Safety
All external API calls are wrapped in non-throwing adapters:
```typescript
type AdapterResult<T> = Promise<{ ok: boolean; value?: T; error?: string }>;
```

### Graceful Degradation
- Primary provider fails → Fallback provider
- All providers fail → Default creative options
- Database errors → Continue with in-memory brief

### Error Categories
- **Validation Errors**: Invalid input format
- **API Errors**: External service failures
- **Timeout Errors**: Request timeouts
- **Database Errors**: Storage failures

## Security

### Input Validation
- Zod schemas validate all inputs
- URL validation for asset links
- Size limits for request payloads

### API Key Management
- Environment variables for all secrets
- Service role key for database operations
- No keys in client-side code

### Row Level Security
- Supabase RLS policies protect user data
- Users can only access their own briefs
- Service role has full access for API operations

## Monitoring & Observability

### Logging
- Structured logging for all operations
- Error tracking with context
- Performance metrics collection

### Health Checks
- API endpoint health monitoring
- External service availability checks
- Database connection monitoring

## Future Enhancements

### Planned Features
1. **Audio Transcription**: Integrate speech-to-text for audio assets
2. **Advanced Vision Models**: Support for specialized image analysis
3. **Cost Optimization**: Smart provider selection based on cost/quality
4. **Caching Layer**: Redis integration for improved performance
5. **Webhook Support**: Real-time notifications for long-running analyses

### Scalability Improvements
1. **Queue System**: BullMQ for handling high-volume requests
2. **Microservices**: Split into specialized services
3. **CDN Integration**: Asset optimization and delivery
4. **Load Balancing**: Multiple API endpoint instances

## Troubleshooting

### Common Issues

**API Key Not Found**
```
Error: TOGETHER_API_KEY_NOT_CONFIGURED
Solution: Set TOGETHER_AI_API_KEY in environment variables
```

**Timeout Errors**
```
Error: TOGETHER_VISION_ERROR:TimeoutError
Solution: Increase EXTERNAL_TIMEOUT_MS or check network connectivity
```

**Database Connection Failed**
```
Error: Supabase insert error
Solution: Verify SUPABASE_SERVICE_ROLE_KEY and database schema
```

### Debug Mode
Enable detailed logging:
```bash
LOG_LEVEL=debug
```

This provides comprehensive information about:
- API request/response details
- Processing pipeline steps
- Error context and stack traces
- Performance timing data

## Contributing

### Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `docs/environment-variables.md`)
4. Run database migrations: `docs/supabase-briefs-schema.sql`
5. Start development server: `npm run dev`

### Code Standards
- TypeScript strict mode enabled
- ESLint configuration enforced
- Zod validation for all data
- Non-throwing error handling
- Comprehensive type definitions

### Testing Requirements
- Unit tests for all adapters
- Integration tests for API endpoints
- E2E tests for React components
- Performance benchmarks for critical paths
