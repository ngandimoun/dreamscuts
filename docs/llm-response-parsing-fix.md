# LLM Response Parsing Fix for Query Analyzer

## Problem Identified
The query analyzer was failing with `BRIEF_VALIDATION_FAILED` because the LLM response parsing was not working correctly:

```
[Step1Analysis] Using LLM-generated creative options: undefined options
[Step1Analysis] Brief validation failed: {
  errors: { _errors: [], plan: { _errors: [], creativeOptions: [Object] } },
  briefId: 'brief_1757947284697_kvevdm2'
}
```

The LLM was returning a successful response (status 200), but the `creativeOptions` was coming back as `undefined`, causing the brief validation to fail.

## Root Cause Analysis

### 1. **LLM Response Structure Issue**
- The LLM was returning a response, but the parsing logic was not correctly extracting the `creativeOptions` array
- The response content was not being properly parsed from the API response structure
- No fallback mechanism existed when LLM parsing failed

### 2. **Missing Error Handling**
- No detailed logging of the LLM response structure
- No fallback creative options when parsing failed
- No validation of the parsed response structure

## Solution Implemented

### 1. **Enhanced LLM Response Parsing**

#### **Response Content Extraction**
```typescript
// Extract the response content
const responseContent = json.choices?.[0]?.message?.content;
console.log(`[LLMIntentAndOptions] Response content:`, {
  hasContent: !!responseContent,
  contentLength: responseContent?.length || 0,
  contentPreview: responseContent?.substring(0, 200) + (responseContent?.length > 200 ? '...' : '')
});
```

#### **JSON Parsing with Multiple Strategies**
```typescript
// Try to parse JSON from the response content
let parsedOptions: any = null;
if (responseContent) {
  try {
    // Look for JSON in the response content
    const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsedOptions = JSON.parse(jsonMatch[0]);
    } else {
      // Try to parse entire content
      parsedOptions = JSON.parse(responseContent);
    }
  } catch (parseError) {
    console.log(`[Step1Analysis] Failed to parse JSON from response content:`, parseError);
  }
}
```

### 2. **Robust Creative Options Extraction**

#### **Multiple Parsing Strategies**
```typescript
// Extract creative options from parsed response
if (parsedOptions) {
  if (parsedOptions.creativeOptions && Array.isArray(parsedOptions.creativeOptions)) {
    creativeOptions = parsedOptions.creativeOptions;
  } else if (Array.isArray(parsedOptions)) {
    creativeOptions = parsedOptions;
  } else {
    creativeOptions = generateDefaultCreativeOptions(assets);
  }
} else {
  creativeOptions = generateDefaultCreativeOptions(assets);
}
```

### 3. **Default Creative Options Generator**

#### **Asset-Aware Default Options**
```typescript
function generateDefaultCreativeOptions(assets: Array<{ url: string; mediaType: string; description?: string }>) {
  const assetTypes = assets.map(a => a.mediaType);
  const hasImages = assetTypes.includes('image');
  const hasVideos = assetTypes.includes('video');
  const hasAudio = assetTypes.includes('audio');
  
  // Generate context-aware default options based on asset types
  const options = [
    {
      option_id: "default_asset_focused",
      title: "Asset-First Approach",
      description: "Use uploaded assets as primary content with light enhancement and polish.",
      // ... complete option structure
    }
  ];
  
  // Add media-specific options
  if (hasVideos) {
    options.push({
      option_id: "video_storytelling",
      title: "Video Storytelling",
      // ... video-specific option
    });
  }
  
  return options;
}
```

### 4. **Improved LLM Prompt**

#### **Strict JSON Format Requirements**
```typescript
const systemPrompt = `You are a senior creative director and technical producer. Given the user request and asset list, return STRICT JSON ONLY (no other text) containing:

{
  "user_intent": "string describing what the user wants to achieve",
  "video_spec": {
    "duration_seconds": number,
    "style": "string",
    "tone": "string", 
    "voiceover": boolean,
    "aspect_ratio_preference": "string",
    "platform_target": "string",
    "resolution_preference": "string"
  },
  "needs_detection": {
    "voiceover": boolean,
    "chart": boolean,
    "explanation": boolean
  },
  "creativeOptions": [
    {
      "option_id": "unique_string",
      "title": "string",
      "description": "string",
      "creative_direction": {
        "opening_strategy": "string",
        "visual_treatment": "string",
        "pacing": "string",
        "transitions": "string"
      },
      "asset_usage": {
        "primary_asset": "url_string_or_null",
        "supporting_assets": ["url_strings"],
        "enhancement_needs": ["string_array"]
      },
      "target_engagement": "string",
      "differentiation": "string"
    }
  ]
}

IMPORTANT: Return ONLY valid JSON. No markdown, no explanations, no additional text.`;
```

### 5. **Comprehensive Debugging**

#### **Response Structure Logging**
```typescript
console.log(`[Step1Analysis] LLM response structure:`, {
  hasContent: !!responseContent,
  hasRaw: !!rawResponse,
  contentType: typeof responseContent,
  rawType: typeof rawResponse
});
```

#### **Parsing Process Logging**
```typescript
console.log(`[Step1Analysis] Successfully parsed JSON from response content`);
console.log(`[Step1Analysis] Using LLM-generated creative options: ${creativeOptions.length} options`);
console.log(`[Step1Analysis] Could not parse LLM response, using default creative options`);
```

## Expected Results

### **Before Fix**
```
[Step1Analysis] Using LLM-generated creative options: undefined options
[Step1Analysis] Brief validation failed: {
  errors: { _errors: [], plan: { _errors: [], creativeOptions: [Object] } },
  briefId: 'brief_1757947284697_kvevdm2'
}
```

### **After Fix**
```
[LLMIntentAndOptions] Response content: {
  hasContent: true,
  contentLength: 1234,
  contentPreview: '{"user_intent": "Create a social media video", "creativeOptions": [{"option_id": "video_storytelling"...'
}
[Step1Analysis] Successfully parsed JSON from response content
[Step1Analysis] Using LLM-generated creative options: 3 options
[Step1Analysis] Analysis completed successfully in 66743ms
```

## Fallback Behavior

### **When LLM Parsing Fails**
1. **Log the parsing error** with detailed context
2. **Generate default creative options** based on asset types
3. **Continue with analysis** instead of failing
4. **Provide meaningful options** even without LLM input

### **Default Options Generated**
- **Asset-First Approach**: Basic option for any asset combination
- **Video Storytelling**: When video assets are present
- **Multimedia Presentation**: When both images and audio are present

## Testing

### **Test LLM Response Parsing**
```bash
# Test with a request that should trigger LLM response
curl -X POST "https://your-domain.com/api/dreamcut/query-analyzer" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Create a social media video about my product",
    "assets": [
      {
        "id": "test1",
        "url": "https://example.com/video.mp4",
        "mediaType": "video"
      }
    ],
    "intent": "video",
    "preferences": {
      "aspect_ratio": "16:9",
      "platform_target": "social"
    }
  }'
```

### **Expected Log Output**
```
[LLMIntentAndOptions] API response received: { hasChoices: true, choicesCount: 1, responseSize: 2349 }
[LLMIntentAndOptions] Response content: { hasContent: true, contentLength: 1234, contentPreview: '{"user_intent"...' }
[Step1Analysis] LLM response structure: { hasContent: true, hasRaw: true, contentType: 'string', rawType: 'object' }
[Step1Analysis] Successfully parsed JSON from response content
[Step1Analysis] Using LLM-generated creative options: 3 options
[Step1Analysis] Analysis completed successfully in 66743ms
```

## Monitoring

### **Key Metrics to Watch**
1. **LLM Response Success Rate**: Should be >95%
2. **Creative Options Parsing Success**: Should be >90%
3. **Default Options Usage**: Should be <10% (indicates LLM parsing issues)
4. **Brief Validation Success**: Should be >99%

### **Log Patterns to Monitor**
```
[Step1Analysis] Successfully parsed JSON from response content
[Step1Analysis] Using LLM-generated creative options: X options
[DefaultCreativeOptions] Generated X default creative options
[Step1Analysis] Could not parse LLM response, using default creative options
```

This fix ensures that the query analyzer will always produce valid briefs, even when the LLM response parsing fails, providing a robust fallback mechanism while maintaining detailed debugging information.
