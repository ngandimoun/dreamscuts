# 🎯 DreamCut Refiner Prompt Library

## Overview

The **Refiner Prompt Library** is a context-aware prompt system that ensures your refiner worker never confuses different asset contexts. It acts like a prompt switchboard, automatically selecting the right specialized prompt based on the asset mix (images, video, audio).

## 🚀 Key Benefits

✅ **Context Awareness** - Never confuses image-only vs video-only vs mixed media contexts  
✅ **Specialized Logic** - Each asset type gets appropriate processing rules  
✅ **Automatic Selection** - No manual prompt selection required  
✅ **Consistent Quality** - Standardized prompts ensure reliable output  
✅ **Extensible** - Easy to add new asset types or specialized prompts  

## 📚 Prompt Templates

### 1. Base Prompt Template

Every prompt starts with this core logic:

```
You are Dreamcut's Refiner.

TASK: Take Analyzer JSON as input. Upgrade it into Refiner JSON.

RULES:
- Follow the provided schema strictly (no missing fields, no extra fields).
- Always embed asset context into `reformulated_prompt`.
- Fill placeholders in creative_direction with strong defaults (never vague).
- Normalize asset roles:
  - image → "main visual anchor" / "secondary visual support"
  - video → "primary footage" / "cutaway"
  - audio → "background track" / "voiceover"
- Recommendations must be tiered:
  - REQUIRED if quality_score < 0.7 or asset mismatch
  - RECOMMENDED otherwise
- Check conflicts:
  - Aspect ratio vs asset orientation
  - Duration vs available footage
- Output ONLY JSON (no explanation).
```

### 2. Specialized Prompts by Asset Mix

#### 🖼️ Image Only Prompt

**Context**: Assets are images only.

**Specialized Rules**:
- Ensure reformulated prompt describes the visual content with clarity
- Creative direction should propose photographic/artistic approaches
- Conflicts: check image resolution vs target aspect ratio
- Recommendations: if quality_score < 0.7 → REQUIRED upscale

**Asset Role Mapping**:
- Primary image → "main visual anchor"
- Secondary images → "secondary visual support"
- Background images → "supporting material"

**Creative Direction Guidelines**:
- `core_concept`: Focus on visual storytelling, composition, and aesthetic appeal
- `visual_approach`: Specify photographic techniques (lighting, composition, color grading)
- `style_direction`: Define visual style (modern, vintage, minimalist, bold, etc.)
- `mood_atmosphere`: Set emotional tone through visual elements

**Example Output**:
```json
{
  "creative_direction": {
    "core_concept": "Create a vibrant social media portrait that captures the subject's personality and energy",
    "visual_approach": "Apply professional portrait lighting with soft shadows and warm color grading",
    "style_direction": "Modern, clean aesthetic optimized for Instagram with high contrast and saturation",
    "mood_atmosphere": "Confident, approachable, and engaging"
  }
}
```

#### 🎥 Video Prompt

**Context**: Assets include video footage.

**Specialized Rules**:
- Treat video as "primary footage" unless user specifies otherwise
- Refinement must include trimming, scene selection, transitions
- Creative direction must suggest pacing (fast, cinematic, casual)
- Conflicts: check duration_seconds vs raw footage length
- Recommendations:
  - REQUIRED trim if video is longer than requested duration
  - REQUIRED stabilization if shaky (quality_score < 0.6)

**Asset Role Mapping**:
- Primary video → "primary footage"
- Secondary videos → "cutaway" or "supporting clip"
- Images → "overlay" or "intro/outro frames"
- Audio → "soundtrack" or "voiceover"

**Creative Direction Guidelines**:
- `core_concept`: Focus on narrative flow, pacing, and visual storytelling
- `visual_approach`: Specify editing techniques (cuts, transitions, effects)
- `style_direction`: Define video style (cinematic, documentary, social media, etc.)
- `mood_atmosphere`: Set pacing and emotional rhythm

**Example Output**:
```json
{
  "creative_direction": {
    "core_concept": "Create a dynamic TikTok dance video with smooth transitions and energetic pacing",
    "visual_approach": "Use quick cuts and dynamic transitions with color-graded footage",
    "style_direction": "Trendy, fast-paced TikTok style with vibrant colors and smooth motion",
    "mood_atmosphere": "High energy, fun, and engaging with perfect sync to music"
  }
}
```

#### 🔊 Audio Only Prompt

**Context**: Assets include audio only.

**Specialized Rules**:
- Role: "voiceover narration", "background soundtrack", or "sound effect"
- Ensure reformulated prompt specifies audio integration
- Conflicts: mismatch between audio tone and user intent
- Recommendations:
  - REQUIRED normalization if audio quality_score < 0.7
  - RECOMMENDED add fades or background balancing

**Asset Role Mapping**:
- Music tracks → "background soundtrack"
- Voice recordings → "voiceover narration"
- Sound effects → "sound effect"
- Ambient audio → "atmospheric audio"

**Creative Direction Guidelines**:
- `core_concept`: Focus on audio storytelling, mood, and emotional impact
- `visual_approach`: Describe how audio will be presented (waveform, visualizer, etc.)
- `style_direction`: Define audio style (upbeat, mellow, dramatic, etc.)
- `mood_atmosphere`: Set emotional tone through audio elements

**Example Output**:
```json
{
  "creative_direction": {
    "core_concept": "Create an engaging podcast intro that sets the professional tone and builds anticipation",
    "visual_approach": "Present audio with clean waveform visualization and subtle branding elements",
    "style_direction": "Professional, warm, and inviting with smooth audio transitions",
    "mood_atmosphere": "Confident, knowledgeable, and approachable"
  }
}
```

#### 🎬 Mixed Media Prompt

**Context**: Assets are mixed types (image + video + audio).

**Specialized Rules**:
- Specify how each media type contributes:
  - Images → overlays, intro/outro, supporting visuals
  - Video → backbone of content
  - Audio → emotional tone, narration, soundtrack
- Creative direction must integrate all three into a cohesive style
- Conflicts: duration mismatch, aspect ratio mismatch between stills and footage
- Recommendations:
  - REQUIRED align all media to common aspect ratio
  - REQUIRED audio normalization and sync with scene timing

**Asset Role Mapping**:
- Primary video → "primary footage"
- Secondary videos → "cutaway" or "supporting clip"
- Images → "overlay", "intro/outro frames", or "supporting visuals"
- Music → "background soundtrack"
- Voice → "voiceover narration"
- Sound effects → "sound effect"

**Creative Direction Guidelines**:
- `core_concept`: Integrate all media types into cohesive narrative
- `visual_approach`: Specify how images, video, and audio work together
- `style_direction`: Define unified style across all media types
- `mood_atmosphere`: Set consistent emotional tone across all elements

**Example Output**:
```json
{
  "creative_direction": {
    "core_concept": "Create a comprehensive educational YouTube video that seamlessly integrates video footage, title slides, and background music",
    "visual_approach": "Use video as the main content with image overlays for key points and smooth audio integration",
    "style_direction": "Professional, clean, and educational with consistent branding and smooth transitions",
    "mood_atmosphere`: "Informative, engaging, and professional with a calm, focused energy"
  }
}
```

## 🔧 Implementation

### Basic Usage

```typescript
import { generateRefinerPrompt, getPromptStats } from '@/lib/analyzer/refiner-prompt-library';

// Generate context-aware prompt
const { prompt, assetMix, templateUsed } = generateRefinerPrompt(analyzerJson);

// Get processing statistics
const promptStats = getPromptStats(analyzerJson);

console.log('Template used:', templateUsed);
console.log('Asset mix:', assetMix.assetTypes);
console.log('Complexity:', promptStats.complexity);
```

### Asset Mix Analysis

```typescript
import { analyzeAssetMix } from '@/lib/analyzer/refiner-prompt-library';

const assetMix = analyzeAssetMix(analyzerJson);

console.log('Has images:', assetMix.hasImages);
console.log('Has video:', assetMix.hasVideo);
console.log('Has audio:', assetMix.hasAudio);
console.log('Asset types:', assetMix.assetTypes);
console.log('Total assets:', assetMix.totalAssets);
```

### Prompt Selection Logic

The system automatically selects the appropriate prompt based on this logic:

1. **Mixed Media** (Image + Video + Audio) → Mixed Media Prompt
2. **Image + Video** (no audio) → Video Prompt
3. **Image + Audio** (no video) → Mixed Media Prompt
4. **Video + Audio** (no images) → Video Prompt
5. **Video Only** → Video Prompt
6. **Audio Only** → Audio Only Prompt
7. **Image Only** → Image Only Prompt
8. **Fallback** → Mixed Media Prompt

## 📊 Monitoring & Analytics

### Database Tracking

The system tracks prompt usage in the database:

```sql
-- View prompt template usage
SELECT 
  template_used,
  COUNT(*) as usage_count,
  AVG(processing_time_ms) as avg_processing_time
FROM dreamcut_refiner
GROUP BY template_used
ORDER BY usage_count DESC;

-- View complexity distribution
SELECT 
  complexity,
  COUNT(*) as count,
  AVG(processing_time_ms) as avg_time
FROM dreamcut_refiner
GROUP BY complexity;
```

### Performance Metrics

```typescript
// Get comprehensive statistics
const stats = await getRefinerStats();

console.log('Template usage:', stats.template_usage);
console.log('Complexity distribution:', stats.complexity_distribution);
console.log('Asset mix distribution:', stats.asset_mix_distribution);
```

## 🧪 Testing

### Test Page

Visit `/test-prompt-library` to test all prompt variations with different asset mixes.

### Test Cases

The system includes comprehensive test cases:

1. **Image Only** - Single image for social media post
2. **Video Only** - Single video for TikTok content
3. **Audio Only** - Music track for podcast intro
4. **Mixed Media** - Images + Video + Audio for YouTube video

### Validation

```typescript
import { validatePromptSelection } from '@/lib/analyzer/refiner-prompt-library';

const isValid = validatePromptSelection(assetMix, templateUsed);
console.log('Prompt selection valid:', isValid);
```

## 🚀 Advanced Features

### Custom Prompt Templates

You can extend the system with custom templates:

```typescript
// Add custom template
const CUSTOM_TEMPLATE = `
CONTEXT: Custom asset processing.

SPECIALIZED RULES:
- Your custom rules here
- Asset-specific logic
- Conflict detection
- Recommendations
`;

// Use in prompt selection
export function selectPromptTemplate(assetMix: AssetMix): string {
  // Add your custom logic here
  if (assetMix.hasCustomAsset) {
    return BASE_REFINER_PROMPT + CUSTOM_TEMPLATE;
  }
  
  // ... existing logic
}
```

### Performance Optimization

```typescript
// Estimate processing time based on complexity
const promptStats = getPromptStats(analyzerJson);

if (promptStats.complexity === 'complex') {
  // Use higher timeout
  const result = await callLLM(prompt, { timeoutMs: 60000 });
} else {
  // Use standard timeout
  const result = await callLLM(prompt, { timeoutMs: 30000 });
}
```

## 🔍 Debugging

### Logging

The system provides detailed logging:

```
🔧 [Refiner] Asset mix analysis: {
  assetTypes: ['image', 'video'],
  totalAssets: 2,
  templateUsed: 'Image + Video',
  complexity: 'moderate',
  estimatedTime: '30-45 seconds'
}
🔧 [Refiner] Using specialized prompt for: Image + Video
```

### Error Handling

```typescript
try {
  const { prompt, assetMix, templateUsed } = generateRefinerPrompt(analyzerJson);
  // Use prompt...
} catch (error) {
  console.error('Prompt generation failed:', error);
  // Fallback to base prompt
  const fallbackPrompt = BASE_REFINER_PROMPT.replace('{ANALYZER_JSON}', JSON.stringify(analyzerJson, null, 2));
}
```

## 📈 Best Practices

### 1. Asset Type Detection

Ensure your analyzer JSON includes proper asset type information:

```json
{
  "assets": [
    {
      "id": "ast_001",
      "type": "image", // Must be 'image', 'video', or 'audio'
      "user_description": "Main image",
      "ai_caption": "A beautiful landscape",
      "quality_score": 0.8
    }
  ]
}
```

### 2. Quality Score Usage

Use quality scores to drive recommendations:

```json
{
  "recommendations": [
    {
      "type": "quality",
      "recommendation": "Enhance image resolution for better social media display",
      "priority": "required" // If quality_score < 0.7
    }
  ]
}
```

### 3. Conflict Detection

Always check for conflicts:

```json
{
  "global_analysis": {
    "conflicts": [
      {
        "issue": "Video duration (120s) exceeds requested duration (60s)",
        "resolution": "Trim video to 60 seconds or adjust target duration",
        "severity": "moderate"
      }
    ]
  }
}
```

## 🎯 Future Enhancements

### Planned Features

1. **Dynamic Prompt Templates** - Templates that adapt based on user preferences
2. **A/B Testing** - Compare different prompt variations
3. **Machine Learning** - Optimize prompts based on success rates
4. **Custom Asset Types** - Support for new media types (3D, AR, etc.)

### Extension Points

1. **Custom Asset Types** - Add support for new media types
2. **Platform-Specific Prompts** - Specialized prompts for different platforms
3. **User Preference Integration** - Prompts that adapt to user style preferences
4. **Quality Thresholds** - Configurable quality score thresholds

## 📞 Support

For issues or questions about the prompt library:

1. Check the test page: `/test-prompt-library`
2. Review the logs for asset mix analysis
3. Verify your analyzer JSON includes proper asset type information
4. Test with different asset combinations

The prompt library is designed to be robust, context-aware, and easy to extend! 🎉
