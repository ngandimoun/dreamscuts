/**
 * 🎯 DreamCut Refiner Prompt Library
 * 
 * Context-aware prompt system that selects the right specialized prompt
 * based on asset mix (images, video, audio) to ensure the refiner never
 * confuses contexts and always applies appropriate logic.
 */

// Base prompt template - core logic injected into all prompts
export const BASE_REFINER_PROMPT = `
You are Dreamcut's Refiner.

TASK: Take Analyzer JSON as input. Upgrade it into Refiner JSON.

CRITICAL RULES:
- Follow the provided schema strictly (no missing fields, no extra fields).
- Always embed asset context into \`reformulated_prompt\`.
- NEVER use placeholders like "**" in creative_direction.core_concept - always provide specific, meaningful content.
- Normalize asset roles with clear, specific descriptions:
  - image → "main visual anchor" / "secondary visual support" / "background element"
  - video → "primary footage" / "cutaway" / "supporting clip"
  - audio → "background track" / "voiceover" / "sound effect"
- Recommendations must be tiered:
  - REQUIRED if quality_score < 0.7 or asset mismatch
  - RECOMMENDED otherwise
- Check conflicts:
  - Aspect ratio vs asset orientation
  - Duration vs available footage
- CONFIDENCE NORMALIZATION:
  - If analyzer confidence is low (< 0.4), don't over-correct to high confidence (> 0.8)
  - Maintain realistic confidence levels that reflect actual analysis quality
  - If assets aren't meaningfully integrated, keep confidence moderate (0.5-0.7)
- CONTENT TYPE CONSISTENCY:
  - If needs_explanation is true, ensure needs_educational_content is also true
  - Normalize contradictory content type analysis
- ASSET INTEGRATION REQUIREMENTS:
  - Reformulated prompt must reference specific assets and their roles
  - Each asset must have a clear, meaningful role description
  - Asset context must be embedded in the reformulated prompt
- ASSET UTILIZATION REQUIREMENTS (CRITICAL):
  - NEVER mark assets as "reference_only" - always elevate them to meaningful roles
  - If assets exist, determine session_mode as "asset_driven"
  - If no assets exist, use session_mode as "asset_free" and provide default_scaffolding
  - For asset_driven mode: anchor narrative_spine to uploaded assets
  - For asset_free mode: use profile default scaffolding for narrative structure
  - Always provide asset_utilization_summary with rationale for asset usage
  - Ensure utilization_rate is never 0 when assets exist
- USER DESCRIPTION PRIORITY (CRITICAL):
  - ALWAYS prioritize user_description over AI caption for asset role assignment
  - If user says "main character", elevate to primary role regardless of quality score (unless <0.3)
  - If user says "logo" or "branding", assign branding role with very low quality threshold (0.2)
  - If user says "background", assign background role appropriately
  - User intent overrides AI analysis - respect human narrative decisions
  - Include asset_role_elevation rules in refiner_extensions to document elevation logic
- NARRATIVE SPINE REQUIREMENTS:
  - Always provide clear intro → core → outro structure
  - For asset_driven: base narrative on uploaded assets
  - For asset_free: use profile-specific default scaffolding
  - Ensure every output has narrative structure, never generic descriptions
- OUTPUT SCHEMA REQUIREMENTS:
  - MUST include refiner_extensions object with:
    - session_mode: "asset_driven" or "asset_free"
    - narrative_spine: { intro: string, core: [string], outro: string }
    - default_scaffolding: { [profile_id]: { intro, core, outro } } (only for asset_free)
    - asset_utilization_summary: { total_assets, utilized_assets, utilization_rate, primary_assets, reference_only_assets, utilization_rationale }
  - MUST add utilization_level to each asset using ONLY these exact values:
    - For images: "primary_subject" (main focus) or "supporting_visual" (secondary) or "background_element" (backdrop)
    - For videos: "primary_footage" (main content) or "supporting_visual" (b-roll)
    - For any asset type: "seed_for_generation" (reference only) or "reference_only" (minimal use)
  - MUST add asset_utilization_score to quality_metrics
- EXAMPLE refiner_extensions structure:
  {
    "session_mode": "asset_driven",
    "narrative_spine": {
      "intro": "Open with graduation photo showcasing achievement",
      "core": ["Feature subject in center frame", "Add celebratory animations"],
      "outro": "End with empowering tagline"
    },
    "asset_utilization_summary": {
      "total_assets": 1,
      "utilized_assets": 1,
      "utilization_rate": 1.0,
      "primary_assets": ["ast_ima01"],
      "reference_only_assets": [],
      "utilization_rationale": "User explicitly defined as main character - elevated to primary role"
    },
    "asset_role_elevation": {
      "rules": [
        {
          "match_on": "user_description",
          "keywords": ["main character", "protagonist", "hero"],
          "action": "elevate_to_primary",
          "conditions": { "min_quality_score": 0.3 },
          "reason": "User explicitly defined narrative role as main character"
        }
      ],
      "default_behavior": "reference_only"
    },
    "elevation_applied": [
      {
        "asset_id": "ast_ima01",
        "original_role": "reference material",
        "elevated_role": "primary",
        "elevation_reason": "User explicitly defined narrative role as main character",
        "user_description": "main character",
        "confidence": 0.9,
        "quality_threshold": 0.3
      }
    ]
  }
- Output ONLY JSON (no explanation).

Analyzer JSON:
{ANALYZER_JSON}
`;

// 🖼️ IMAGE-ONLY PROMPT
export const IMAGE_ONLY_PROMPT = `
CONTEXT: Assets are images only.

SPECIALIZED RULES:
- Ensure reformulated prompt describes the visual content with clarity and references specific images.
- Creative direction should propose photographic/artistic approaches (e.g. "vivid social media portrait", "minimalist infographic").
- NEVER use "**" or vague placeholders in core_concept - always provide specific visual direction.
- Conflicts: check image resolution vs target aspect ratio.
- Recommendations: if quality_score < 0.7 → REQUIRED upscale.

ASSET ROLE MAPPING:
- Primary image → "main visual anchor" (specify what makes it primary)
- Secondary images → "secondary visual support" (specify how they support)
- Background images → "supporting material" (specify their supporting role)

CREATIVE DIRECTION GUIDELINES:
- core_concept: MUST be specific and descriptive (e.g., "Create a vibrant social media post showcasing the product with clean, modern aesthetics and strong visual hierarchy")
- visual_approach: Specify photographic techniques (lighting, composition, color grading)
- style_direction: Define visual style (modern, vintage, minimalist, bold, etc.)
- mood_atmosphere: Set emotional tone through visual elements

ASSET INTEGRATION REQUIREMENTS:
- Reformulated prompt must mention specific image types and their visual characteristics
- Each image must be referenced in the reformulated prompt with its role
- Visual elements must be tied to the user's original intent

CONFLICT DETECTION:
- Image resolution vs target aspect ratio mismatch
- Multiple images with conflicting styles
- Low quality images that need enhancement

RECOMMENDATIONS:
- REQUIRED: Upscale if quality_score < 0.7
- REQUIRED: Color correction if images have inconsistent tones
- RECOMMENDED: Add visual effects or filters for style consistency
- RECOMMENDED: Optimize for target platform (Instagram, TikTok, etc.)

QUALITY ASSURANCE:
- If analyzer confidence is low, maintain moderate refiner confidence (0.5-0.7)
- Ensure core_concept is at least 50 characters and contains no placeholders
- Verify all images are meaningfully integrated into the reformulated prompt
`;

// 🎥 VIDEO PROMPT (with or without audio)
export const VIDEO_PROMPT = `
CONTEXT: Assets include video footage.

SPECIALIZED RULES:
- Treat video as "primary footage" unless user specifies otherwise.
- Refinement must include trimming, scene selection, transitions.
- Creative direction must suggest pacing (fast, cinematic, casual).
- Conflicts: check duration_seconds vs raw footage length.
- Recommendations:
  - REQUIRED trim if video is longer than requested duration.
  - REQUIRED stabilization if shaky (quality_score < 0.6).

ASSET ROLE MAPPING:
- Primary video → "primary footage"
- Secondary videos → "cutaway" or "supporting clip"
- Images → "overlay" or "intro/outro frames"
- Audio → "soundtrack" or "voiceover"

CREATIVE DIRECTION GUIDELINES:
- core_concept: Focus on narrative flow, pacing, and visual storytelling
- visual_approach: Specify editing techniques (cuts, transitions, effects)
- style_direction: Define video style (cinematic, documentary, social media, etc.)
- mood_atmosphere: Set pacing and emotional rhythm

CONFLICT DETECTION:
- Duration mismatch: video longer/shorter than requested
- Aspect ratio mismatch between different video clips
- Audio-video sync issues
- Shaky footage requiring stabilization

RECOMMENDATIONS:
- REQUIRED: Trim if video exceeds requested duration
- REQUIRED: Stabilize if quality_score < 0.6 (shaky footage)
- REQUIRED: Sync audio with video if both present
- RECOMMENDED: Add transitions between scenes
- RECOMMENDED: Color grade for consistency
- RECOMMENDED: Add text overlays or captions
`;

// 🔊 AUDIO-ONLY PROMPT
export const AUDIO_ONLY_PROMPT = `
CONTEXT: Assets include audio only.

SPECIALIZED RULES:
- Role: "voiceover narration", "background soundtrack", or "sound effect".
- Ensure reformulated prompt specifies audio integration ("celebratory music to match graduation mood").
- Conflicts: mismatch between audio tone and user intent (e.g., sad music for happy video).
- Recommendations:
  - REQUIRED normalization if audio quality_score < 0.7.
  - RECOMMENDED add fades or background balancing.

ASSET ROLE MAPPING:
- Music tracks → "background soundtrack"
- Voice recordings → "voiceover narration"
- Sound effects → "sound effect"
- Ambient audio → "atmospheric audio"

CREATIVE DIRECTION GUIDELINES:
- core_concept: Focus on audio storytelling, mood, and emotional impact
- visual_approach: Describe how audio will be presented (waveform, visualizer, etc.)
- style_direction: Define audio style (upbeat, mellow, dramatic, etc.)
- mood_atmosphere: Set emotional tone through audio elements

CONFLICT DETECTION:
- Audio tone mismatch with user intent
- Multiple audio tracks with conflicting styles
- Audio quality issues (noise, distortion, low volume)
- Duration mismatch between different audio tracks

RECOMMENDATIONS:
- REQUIRED: Normalize audio levels if quality_score < 0.7
- REQUIRED: Remove background noise if present
- REQUIRED: Match audio tone to user intent
- RECOMMENDED: Add fade in/out effects
- RECOMMENDED: Balance multiple audio tracks
- RECOMMENDED: Add audio effects (reverb, echo, etc.)
`;

// 🎬 MIXED MEDIA PROMPT (image + video + audio)
export const MIXED_MEDIA_PROMPT = `
CONTEXT: Assets are mixed types (image + video + audio).

SPECIALIZED RULES:
- Specify how each media type contributes:
  - Images → overlays, intro/outro, supporting visuals.
  - Video → backbone of content.
  - Audio → emotional tone, narration, soundtrack.
- Creative direction must integrate all three into a cohesive style.
- Conflicts: duration mismatch (audio shorter than video), aspect ratio mismatch between stills and footage.
- Recommendations:
  - REQUIRED align all media to common aspect ratio.
  - REQUIRED audio normalization and sync with scene timing.

ASSET ROLE MAPPING:
- Primary video → "primary footage"
- Secondary videos → "cutaway" or "supporting clip"
- Images → "overlay", "intro/outro frames", or "supporting visuals"
- Music → "background soundtrack"
- Voice → "voiceover narration"
- Sound effects → "sound effect"

CREATIVE DIRECTION GUIDELINES:
- core_concept: Integrate all media types into cohesive narrative
- visual_approach: Specify how images, video, and audio work together
- style_direction: Define unified style across all media types
- mood_atmosphere: Set consistent emotional tone across all elements

CONFLICT DETECTION:
- Duration mismatch between audio and video
- Aspect ratio mismatch between images and video
- Audio-video sync issues
- Style inconsistency across different media types
- Quality differences between media types

RECOMMENDATIONS:
- REQUIRED: Align all media to common aspect ratio
- REQUIRED: Sync audio with video timing
- REQUIRED: Normalize quality across all media types
- REQUIRED: Ensure style consistency across all elements
- RECOMMENDED: Add transitions between different media types
- RECOMMENDED: Balance audio levels with visual content
- RECOMMENDED: Add visual effects to unify different media types
`;

// 🎯 PROMPT SELECTION LOGIC
export interface AssetMix {
  hasImages: boolean;
  hasVideo: boolean;
  hasAudio: boolean;
  assetTypes: string[];
  totalAssets: number;
}

/**
 * Analyze asset mix from analyzer JSON
 */
export function analyzeAssetMix(analyzerJson: any): AssetMix {
  const assets = analyzerJson.assets || [];
  const assetTypes = assets.map((asset: any) => asset.type).filter(Boolean);
  
  return {
    hasImages: assetTypes.includes('image'),
    hasVideo: assetTypes.includes('video'),
    hasAudio: assetTypes.includes('audio'),
    assetTypes: [...new Set(assetTypes)], // Remove duplicates
    totalAssets: assets.length
  };
}

/**
 * Select the appropriate prompt template based on asset mix
 */
export function selectPromptTemplate(assetMix: AssetMix): string {
  const { hasImages, hasVideo, hasAudio, assetTypes } = assetMix;
  
  // Mixed media (most complex)
  if (hasImages && hasVideo && hasAudio) {
    return BASE_REFINER_PROMPT + MIXED_MEDIA_PROMPT;
  }
  
  // Image + Video (no audio)
  if (hasImages && hasVideo && !hasAudio) {
    return BASE_REFINER_PROMPT + VIDEO_PROMPT;
  }
  
  // Image + Audio (no video)
  if (hasImages && hasAudio && !hasVideo) {
    return BASE_REFINER_PROMPT + MIXED_MEDIA_PROMPT; // Treat as mixed media
  }
  
  // Video + Audio (no images)
  if (hasVideo && hasAudio && !hasImages) {
    return BASE_REFINER_PROMPT + VIDEO_PROMPT;
  }
  
  // Single media types
  if (hasVideo && !hasImages && !hasAudio) {
    return BASE_REFINER_PROMPT + VIDEO_PROMPT;
  }
  
  if (hasAudio && !hasImages && !hasVideo) {
    return BASE_REFINER_PROMPT + AUDIO_ONLY_PROMPT;
  }
  
  if (hasImages && !hasVideo && !hasAudio) {
    return BASE_REFINER_PROMPT + IMAGE_ONLY_PROMPT;
  }
  
  // Fallback to mixed media for any other combination
  return BASE_REFINER_PROMPT + MIXED_MEDIA_PROMPT;
}

/**
 * Generate the complete prompt with analyzer JSON injected
 */
export function generateRefinerPrompt(analyzerJson: any): {
  prompt: string;
  assetMix: AssetMix;
  templateUsed: string;
} {
  const assetMix = analyzeAssetMix(analyzerJson);
  const template = selectPromptTemplate(assetMix);
  
  // Replace placeholder with actual analyzer JSON
  const prompt = template.replace('{ANALYZER_JSON}', JSON.stringify(analyzerJson, null, 2));
  
  return {
    prompt,
    assetMix,
    templateUsed: getTemplateName(assetMix)
  };
}

/**
 * Get human-readable template name for logging
 */
function getTemplateName(assetMix: AssetMix): string {
  const { hasImages, hasVideo, hasAudio } = assetMix;
  
  if (hasImages && hasVideo && hasAudio) return 'Mixed Media (Image + Video + Audio)';
  if (hasImages && hasVideo) return 'Image + Video';
  if (hasImages && hasAudio) return 'Image + Audio';
  if (hasVideo && hasAudio) return 'Video + Audio';
  if (hasVideo) return 'Video Only';
  if (hasAudio) return 'Audio Only';
  if (hasImages) return 'Image Only';
  
  return 'Unknown/Empty';
}

/**
 * Validate that the selected prompt is appropriate for the asset mix
 */
export function validatePromptSelection(assetMix: AssetMix, templateUsed: string): boolean {
  const { hasImages, hasVideo, hasAudio } = assetMix;
  
  // Check if the template matches the asset mix
  if (hasImages && hasVideo && hasAudio) {
    return templateUsed.includes('Mixed Media');
  }
  
  if (hasVideo && !hasImages && !hasAudio) {
    return templateUsed.includes('Video Only');
  }
  
  if (hasAudio && !hasImages && !hasVideo) {
    return templateUsed.includes('Audio Only');
  }
  
  if (hasImages && !hasVideo && !hasAudio) {
    return templateUsed.includes('Image Only');
  }
  
  // For mixed combinations, any template is acceptable
  return true;
}

/**
 * Get prompt statistics for monitoring
 */
export function getPromptStats(analyzerJson: any): {
  assetMix: AssetMix;
  templateUsed: string;
  complexity: 'simple' | 'moderate' | 'complex';
  estimatedProcessingTime: string;
} {
  const assetMix = analyzeAssetMix(analyzerJson);
  const templateUsed = getTemplateName(assetMix);
  
  // Determine complexity based on asset mix
  let complexity: 'simple' | 'moderate' | 'complex' = 'simple';
  if (assetMix.totalAssets > 3) complexity = 'moderate';
  if (assetMix.hasImages && assetMix.hasVideo && assetMix.hasAudio) complexity = 'complex';
  if (assetMix.totalAssets > 5) complexity = 'complex';
  
  // Estimate processing time
  let estimatedProcessingTime = '15-30 seconds';
  if (complexity === 'moderate') estimatedProcessingTime = '30-45 seconds';
  if (complexity === 'complex') estimatedProcessingTime = '45-60 seconds';
  
  return {
    assetMix,
    templateUsed,
    complexity,
    estimatedProcessingTime
  };
}

// Export all prompt templates for testing
export const PROMPT_TEMPLATES = {
  BASE: BASE_REFINER_PROMPT,
  IMAGE_ONLY: IMAGE_ONLY_PROMPT,
  VIDEO: VIDEO_PROMPT,
  AUDIO_ONLY: AUDIO_ONLY_PROMPT,
  MIXED_MEDIA: MIXED_MEDIA_PROMPT
};

export default {
  generateRefinerPrompt,
  analyzeAssetMix,
  selectPromptTemplate,
  validatePromptSelection,
  getPromptStats,
  PROMPT_TEMPLATES
};
