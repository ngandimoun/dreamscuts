# DreamCut Step 1 - Environment Variables Configuration

This document outlines the required environment variables for the DreamCut Step 1 Query Analyzer implementation.

## Required Environment Variables

### AI Model Providers

```bash
# Together.ai - Primary LLM and Vision provider
TOGETHER_AI_API_KEY=b172c3d94cd2779e74d65f8e6d1218825ec6ac2a0cc28d0698bb4e73dd361f00

# Qwen (Alibaba Cloud) - Fallback LLM and Vision provider
QWEN_API_KEY=your-qwen-api-key-here

# FAL.ai - Video understanding and processing
FAL_KEY=ef2bfe67-7a93-41b0-bbe8-fd359f91c88b:7fe56c519efc8624803223f61eea1d25

# Shotstack - Video editing (for future steps)
SHOTSTACK_API_KEY=BVwSH1OrhTyMjbAGfO9VEnNsAzZaGDpz07MlcGdu
```

### Supabase Configuration

```bash
# Supabase project configuration
NEXT_PUBLIC_SUPABASE_URL=https://lrtaexlbfajztymxmriu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxydGFleGxiZmFqenR5bXhtcml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MTgxNjIsImV4cCI6MjA3MzI5NDE2Mn0.Y90sZY1_X4QwA87d3KjmTX_E6dQjXvdiXfzqfXDaemg
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxydGFleGxiZmFqenR5bXhtcml1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzcxODE2MiwiZXhwIjoyMDczMjk0MTYyfQ.H6Am11FNnn5ZzS3upzCvW3YsFUjo1fmC5WOTQxgF6YA
```

### Optional Configuration

```bash
# Timeout settings
EXTERNAL_TIMEOUT_MS=20000

# Development settings
NODE_ENV=development
LOG_LEVEL=debug
```

## API Endpoints Used

### Together.ai
- **Vision Analysis**: `https://api.together.ai/v1/chat/completions`
- **LLM Processing**: `https://api.together.ai/v1/chat/completions`
- **Models Used**: 
  - `meta-llama/Llama-3.3-70B-Instruct-Turbo` (for text analysis)
  - Vision models for image analysis

### Qwen (Alibaba Cloud)
- **Vision Analysis**: `https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation`
- **LLM Processing**: `https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation`
- **Models Used**: `qwen-vl-plus` (for vision), `qwen-plus` (for text)

### FAL.ai
- **Video Analysis**: `https://fal.run/fal-ai/video-understanding`
- **Authentication**: Key-based authentication

## Database Schema

The implementation requires a `briefs` table in Supabase with the following structure:

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

## Security Notes

1. **API Keys**: Never commit API keys to version control
2. **Environment Variables**: Use `.env.local` for local development
3. **Production**: Set environment variables in your deployment platform (Vercel, Netlify, etc.)
4. **Service Role**: The `SUPABASE_SERVICE_ROLE_KEY` has elevated permissions and should be kept secure

## Rate Limits and Costs

### Together.ai
- Rate limits vary by model and plan
- Costs: ~$0.0002 per 1K tokens for Llama-3.3-70B

### Qwen
- Rate limits: 100 requests per minute (free tier)
- Costs: Pay-per-use model

### FAL.ai
- Rate limits: Varies by endpoint
- Costs: Pay-per-request model

## Testing

To test the implementation:

1. Set up all required environment variables
2. Run the Supabase schema migration
3. Test with a simple query and asset:

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

## Troubleshooting

### Common Issues

1. **API Key Not Found**: Ensure environment variables are properly set
2. **Timeout Errors**: Increase `EXTERNAL_TIMEOUT_MS` if needed
3. **Database Errors**: Verify Supabase connection and table schema
4. **Rate Limiting**: Implement exponential backoff for production use

### Debug Mode

Enable debug logging by setting:
```bash
LOG_LEVEL=debug
```

This will provide detailed information about API calls and responses.
