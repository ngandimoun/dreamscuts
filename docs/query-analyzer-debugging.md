# Query Analyzer Debugging Enhancements

## Overview
Comprehensive debugging has been added to the `/api/dreamcut/query-analyzer` endpoint to help identify and resolve issues with asset analysis, model failures, and performance bottlenecks.

## Debugging Features Added

### 1. Request-Level Debugging
- **Request ID**: Each request gets a unique ID for tracking across logs
- **Timing Metrics**: Detailed timing for each phase of processing
- **Request Validation**: Comprehensive logging of request parsing and validation
- **Error Context**: Structured error responses with request IDs and timestamps

### 2. Asset Analysis Debugging
- **Asset Processing**: Individual tracking of each asset's analysis progress
- **Fallback Chain**: Detailed logging of primary and fallback model attempts
- **Model Performance**: Timing and success/failure metrics for each model
- **Error Details**: Specific error messages and stack traces for failures

### 3. Enhanced Logging Structure
All logs now include:
- `[QueryAnalyzer]` - Main request processing
- `[Step1Analysis]` - Core analysis logic
- `[EnhancedImageAnalyzer]` - Image analysis with fallbacks
- `[EnhancedVideoAnalyzer]` - Video analysis with fallbacks
- `[EnhancedAudioAnalyzer]` - Audio analysis with fallbacks
- `[LLMIntentAndOptions]` - LLM-based intent analysis

### 4. Performance Metrics
- **Total Request Duration**: End-to-end request timing
- **Asset Analysis Duration**: Time spent on asset processing
- **LLM Duration**: Time for intent and options generation
- **Database Duration**: Time for brief storage
- **Individual Model Timing**: Per-model performance metrics

### 5. Error Tracking
- **Analysis Statistics**: Success/failure counts for each asset type
- **Fallback Usage**: Tracking of which fallback models were used
- **Error Categorization**: Structured error types and messages
- **Stack Traces**: Full error context for debugging

## Debug Endpoint

A new debug endpoint is available at `/api/dreamcut/query-analyzer/debug`:

### GET Requests
- `?test=env` - Check environment variable configuration
- `?test=models` - List available analysis models
- `?test=schema` - Test schema validation
- `?test=full` - Run comprehensive tests

### POST Requests
- Echo back request data with validation info
- Test request parsing and structure

## Log Analysis

### Key Log Patterns to Monitor

1. **Request Start**: `[QueryAnalyzer] req_xxx - Starting request processing`
2. **Asset Processing**: `[Step1Analysis] Processing asset xxx (type): url`
3. **Model Attempts**: `[EnhancedXAnalyzer] Attempting ModelName (1/5)`
4. **Model Success**: `[EnhancedXAnalyzer] ModelName succeeded in xxxms`
5. **Model Failure**: `[EnhancedXAnalyzer] ModelName failed: error`
6. **Fallback Chain**: `[Step1Analysis] Primary analysis failed, trying fallbacks`
7. **Analysis Complete**: `[Step1Analysis] Analysis completed successfully in xxxms`

### Performance Indicators

- **Image Analysis**: Should complete in 4-15 seconds
- **Video Analysis**: May take 30+ seconds due to model complexity
- **Audio Analysis**: Should complete in 2-10 seconds
- **LLM Analysis**: Should complete in 1-5 seconds

### Error Patterns to Watch

1. **Timeout Errors**: Model processing taking too long
2. **API Key Issues**: Missing or invalid API keys
3. **Model Failures**: All models failing for an asset type
4. **Schema Validation**: Request structure issues
5. **Database Errors**: Brief storage failures

## Troubleshooting Guide

### Common Issues and Solutions

1. **Video Analysis Timeouts**
   - Check if video URL is accessible
   - Verify video format is supported
   - Monitor model queue status

2. **All Models Failing**
   - Check API key configuration
   - Verify network connectivity
   - Check model availability

3. **Slow Performance**
   - Monitor individual model timing
   - Check for concurrent request limits
   - Verify timeout settings

4. **Database Errors**
   - Check Supabase connection
   - Verify table schema
   - Check service role permissions

## Monitoring Recommendations

1. **Set up log aggregation** to track patterns across requests
2. **Monitor error rates** by asset type and model
3. **Track performance metrics** to identify bottlenecks
4. **Alert on high failure rates** or timeout patterns
5. **Regular health checks** using the debug endpoint

## Example Debug Session

```bash
# Check environment configuration
curl "https://your-domain.com/api/dreamcut/query-analyzer/debug?test=env"

# Test request structure
curl -X POST "https://your-domain.com/api/dreamcut/query-analyzer/debug" \
  -H "Content-Type: application/json" \
  -d '{"query": "test", "assets": [], "intent": "image"}'

# Monitor logs for a specific request
# Look for logs containing the request ID from the response
```

This comprehensive debugging system should help identify and resolve issues with the query analyzer endpoint quickly and efficiently.
