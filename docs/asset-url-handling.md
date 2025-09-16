# Asset URL Handling for Query Analyzer

## Problem Solved
The query analyzer was failing to process video assets because it couldn't handle different URL types:
- **Supabase Storage URLs** (both public and private)
- **External API URLs** (Pexels, etc.)

The error `"All video analysis models failed. Please check your video URL and try again."` was occurring because the models couldn't access private Supabase URLs that require authentication.

## Solution Implemented

### 1. URL Processing System
Added comprehensive URL processing that handles:

#### **Supabase URLs**
- **Public URLs**: `https://project.supabase.co/storage/v1/object/public/bucket/path`
  - Used directly without modification
- **Private URLs**: `https://project.supabase.co/storage/v1/object/bucket/path`
  - Automatically converted to public URLs or signed URLs

#### **External URLs**
- **Pexels, Unsplash, etc.**: Used directly without modification
- **Any external media URL**: Passed through unchanged

### 2. URL Processing Functions

#### `processAssetUrl(assetUrl: string, assetId?: string)`
```typescript
// Returns:
{
  processedUrl: string;    // URL to use for analysis
  isSupabase: boolean;     // Whether it's a Supabase URL
  needsAuth: boolean;      // Whether authentication is needed
}
```

#### `generateSupabaseSignedUrl(assetUrl: string)`
```typescript
// Generates a signed URL for private Supabase assets
// Returns a temporary URL valid for 1 hour
```

### 3. Integration Points

All analyzers now use URL processing:

#### **Enhanced Analyzers**
- `enhancedImageAnalyze()` - Image analysis with URL processing
- `enhancedVideoAnalyze()` - Video analysis with URL processing  
- `enhancedAudioAnalyze()` - Audio analysis with URL processing

#### **Legacy Analyzers**
- `togetherVisionAnalyze()` - Together.ai vision with URL processing
- `falVideoAnalyze()` - Fal.ai video with URL processing

### 4. Debugging Enhancements

#### **URL Processing Logs**
```
[AssetURLProcessor] Processing URL: https://project.supabase.co/storage/v1/object/bucket/path
[AssetURLProcessor] Detected private Supabase URL, generating signed URL
[SupabaseSignedURL] Generating signed URL for: https://project.supabase.co/storage/v1/object/bucket/path
[SupabaseSignedURL] Bucket: bucket, Path: path
[SupabaseSignedURL] Generated signed URL successfully
```

#### **Analysis Logs**
```
[EnhancedVideoAnalyzer] URL processing result: {
  originalUrl: "https://project.supabase.co/storage/v1/object/bucket/path",
  processedUrl: "https://project.supabase.co/storage/v1/object/public/bucket/path",
  isSupabase: true,
  needsAuth: false
}
[EnhancedVideoAnalyzer] Analysis completed in 3036ms: {
  success: true,
  model: "qwen2-vl-7b-instruct",
  urlType: "supabase"
}
```

### 5. Debug Endpoint

New debug test available: `?test=urls`

```bash
curl "https://your-domain.com/api/dreamcut/query-analyzer/debug?test=urls"
```

Returns examples of different URL types and how they're processed.

## URL Types Handled

### 1. **Supabase Public URLs**
```
https://lrtaexlbfajztymxmriu.supabase.co/storage/v1/object/public/dreamcut-assets/users/.../file.png
```
- ✅ Used directly
- ✅ No authentication needed
- ✅ Fast processing

### 2. **Supabase Private URLs**
```
https://lrtaexlbfajztymxmriu.supabase.co/storage/v1/object/dreamcut-assets/users/.../file.png
```
- 🔄 Converted to public URL: `/storage/v1/object/` → `/storage/v1/object/public/`
- 🔄 If conversion fails, generates signed URL
- ✅ Handles authentication automatically

### 3. **External Image URLs**
```
https://images.pexels.com/photos/33900340/pexels-photo-33900340.jpeg?auto=compress&cs=tinysrgb&h=650&w=940
```
- ✅ Used directly
- ✅ No processing needed
- ✅ Fast processing

### 4. **External Video URLs**
```
https://videos.pexels.com/video-files/7438482/7438482-sd_360_624_30fps.mp4
```
- ✅ Used directly
- ✅ No processing needed
- ⚠️ May be slower due to video size

## Error Handling

### **URL Processing Errors**
- Invalid URLs: Falls back to original URL
- Supabase errors: Falls back to original URL
- Network errors: Logged and continues with original URL

### **Analysis Errors**
- Model timeouts: Detailed error logging with URL type
- Authentication failures: Specific error messages
- Network issues: Retry with different URL format

## Performance Impact

### **URL Processing Overhead**
- **Public URLs**: ~1ms (minimal overhead)
- **Private URLs**: ~100-500ms (Supabase API call)
- **External URLs**: ~1ms (minimal overhead)

### **Analysis Performance**
- **Supabase URLs**: Same as external URLs once processed
- **External URLs**: No change in performance
- **Signed URLs**: Slight delay for generation, then normal performance

## Monitoring

### **Key Metrics to Watch**
1. **URL Processing Success Rate**: Should be >99%
2. **Signed URL Generation Time**: Should be <500ms
3. **Analysis Success Rate**: Should improve significantly
4. **Error Patterns**: Monitor for URL-specific failures

### **Log Patterns to Monitor**
```
[AssetURLProcessor] Processing URL: ...
[SupabaseSignedURL] Generated signed URL successfully
[EnhancedVideoAnalyzer] Analysis completed in ...ms: { success: true, urlType: "supabase" }
```

## Testing

### **Test Different URL Types**
```bash
# Test with Supabase public URL
curl -X POST "https://your-domain.com/api/dreamcut/query-analyzer" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Analyze this image",
    "assets": [{
      "id": "test1",
      "url": "https://project.supabase.co/storage/v1/object/public/bucket/image.jpg",
      "mediaType": "image"
    }],
    "intent": "image"
  }'

# Test with Supabase private URL
curl -X POST "https://your-domain.com/api/dreamcut/query-analyzer" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Analyze this video",
    "assets": [{
      "id": "test2", 
      "url": "https://project.supabase.co/storage/v1/object/bucket/video.mp4",
      "mediaType": "video"
    }],
    "intent": "video"
  }'

# Test with external URL
curl -X POST "https://your-domain.com/api/dreamcut/query-analyzer" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Analyze this image",
    "assets": [{
      "id": "test3",
      "url": "https://images.pexels.com/photos/123456/pexels-photo-123456.jpeg",
      "mediaType": "image"
    }],
    "intent": "image"
  }'
```

## Expected Results

After implementing this fix, you should see:

1. **✅ Video Analysis Success**: Videos from Supabase should now analyze successfully
2. **✅ Better Error Messages**: More specific error information in logs
3. **✅ URL Type Tracking**: Clear indication of URL source in logs
4. **✅ Fallback Handling**: Graceful degradation when URL processing fails
5. **✅ Performance Monitoring**: Detailed timing for URL processing steps

The error `"All video analysis models failed. Please check your video URL and try again."` should be resolved, and you should see successful video analysis with proper URL handling in the logs.
