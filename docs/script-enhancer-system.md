# 🎬 DreamCut Script Enhancer System - Step 2a.5 (Studio-Grade)

## Overview

The **Script Enhancer** is Step 2a.5 in the DreamCut pipeline that automatically generates **studio-grade, production-ready scripts** after the refiner completes. It transforms any user input (from rough sentences like "make anime vid" to full drafts) into professional, voiceover-ready scripts with proper narrative structure, asset integration, and creative profile alignment.

**Studio-Grade Quality**: Every script is immediately usable by Director + Production teams without additional editing.

## 🚀 Key Features

✅ **Professional Script Generation** - Creates voiceover-ready scripts with proper pacing  
✅ **18 Creative Profile Support** - Specialized prompts for each profile type  
✅ **Duration-Aware Pacing** - Automatically fits scripts to exact duration requirements  
✅ **Asset Integration** - Explicitly references user assets in the narrative  
✅ **Narrative Structure** - Hook, body, climax, outro with proper timing  
✅ **Quality Assurance** - Validates duration compliance, asset utilization, and coherence  
✅ **Music & Sound Planning** - Includes music cues and sound effect recommendations  
✅ **Subtitle Generation** - Creates accessibility-ready subtitle text  

## 🎯 Core Responsibilities

### 1. Normalize Story Intent
- Preserves user's creative ask ("anime vid" stays anime, "finance explainer" stays finance-style)
- Applies appropriate creative profile based on refiner analysis
- Maintains consistency with detected profile throughout script

### 2. Structure Into Narrative
- **Hook (0-3s)**: Grabs attention immediately
- **Body (3s-end-5s)**: Core message with asset integration
- **Climax (end-5s-end-2s)**: Emotional peak or key moment
- **Outro (end-2s-end)**: Call-to-action or conclusion

### 3. Integrate Assets
- Explicitly mentions where user assets appear in the story
- Example: "Scene 1 opens with the uploaded graduation photo, zoomed and stylized"
- Maps asset descriptions to visual anchors in scenes

### 4. Enforce Compulsories
- Always produces voiceover-ready text
- Always includes subtitles for accessibility
- Proposes default music/sound effects if missing from metadata
- Ensures exact duration compliance

### 5. Adapt To Creative Profiles
- **Anime Mode**: Dramatic dialogue, inner monologue, action sounds
- **Finance Explainer**: Structured narration, data callouts
- **UGC Influencer**: Casual, punchy, first-person style
- **Educational**: Clear, instructional narration with learning pauses
- **Corporate**: Professional, confident business tone
- And 13 more specialized profiles...

### 6. Pacing Control
- Locks to user's selected duration
- Estimates words per scene (~15 words per 5 seconds)
- Stretches or condenses as needed
- Maintains narrative flow

## 🏗️ Architecture

```
Refiner JSON → Script Enhancer → Production-Ready Script
     ↓              ↓                    ↓
Polished Data   AI Script Gen      Voiceover Ready
```

### Input Flow
1. **Analyzer JSON** - Raw analysis from query-analyzer
2. **Refiner JSON** - Polished data with creative profile
3. **User Context** - Duration, orientation, target audience

### Output Structure
```json
{
  "script_metadata": {
    "profile": "anime_mode",
    "duration_seconds": 30,
    "orientation": "portrait",
    "language": "english",
    "total_scenes": 6,
    "estimated_word_count": 90,
    "pacing_style": "dynamic with emotional peaks"
  },
  "scenes": [
    {
      "scene_id": "s1",
      "duration": 5,
      "narration": "A young hero gazes at the horizon, ready for a new journey.",
      "visual_anchor": "user_image_01",
      "suggested_effects": ["anime-glow", "lens-flare"],
      "music_cue": "dramatic_intro",
      "subtitles": "A new journey begins...",
      "scene_purpose": "hook",
      "emotional_tone": "engaging"
    }
  ],
  "global_voiceover": {
    "voices": [
      {
        "id": "main_narrator",
        "style": "emotional",
        "gender": "female",
        "age_range": "young_adult",
        "accent": "neutral"
      }
    ],
    "narration_style": "dramatic dialogue with inner monologue",
    "pacing_notes": "Match dynamic pacing with dramatic_fade, action_cut transitions"
  },
  "music_plan": {
    "style": "orchestral anime theme with emotional crescendos",
    "transitions": ["dramatic_fade", "action_cut", "emotional_zoom"],
    "mood_progression": ["opening", "development", "climax", "resolution"],
    "sound_effects": ["ambient", "emphasis", "transition"]
  },
  "asset_integration": {
    "user_assets_used": ["user_image_01"],
    "generated_content_needed": ["opening_visual", "background_elements"],
    "visual_flow": ["hook_visual", "content_development", "climax_moment"]
  },
  "quality_assurance": {
    "duration_compliance": true,
    "asset_utilization": "high",
    "narrative_coherence": "strong",
    "profile_alignment": "excellent"
  }
}
```

## 🎨 Creative Profile Script Templates

### Anime Mode
- **Style**: Dramatic dialogue with inner monologue and action sounds
- **Pacing**: Dynamic with emotional peaks
- **Transitions**: dramatic_fade, action_cut, emotional_zoom
- **Effects**: anime-glow, lens-flare, motion-blur, speed-lines
- **Music**: Orchestral anime theme with emotional crescendos

### Finance Explainer
- **Style**: Structured narration with data callouts
- **Pacing**: Steady and authoritative
- **Transitions**: professional_fade, data_reveal, chart_transition
- **Effects**: text_overlay, data_highlight, chart_animation
- **Music**: Corporate background with subtle emphasis

### Educational Explainer
- **Style**: Clear, instructional narration
- **Pacing**: Methodical with learning pauses
- **Transitions**: educational_fade, step_transition, concept_reveal
- **Effects**: bullet_points, highlighting, step_numbers
- **Music**: Neutral background with learning emphasis

### UGC Influencer
- **Style**: Casual, punchy, first-person style
- **Pacing**: Energetic and engaging
- **Transitions**: quick_cut, energy_boost, trendy_transition
- **Effects**: trendy_overlay, energy_effects, social_style
- **Music**: Trendy, upbeat with viral potential

### Corporate Presentation
- **Style**: Professional, confident narration
- **Pacing**: Steady and business-focused
- **Transitions**: corporate_fade, slide_transition, professional_cut
- **Effects**: corporate_overlay, data_visualization, brand_elements
- **Music**: Corporate background with professional tone

### Relaxation Content
- **Style**: Calm, soothing narration
- **Pacing**: Relaxed and peaceful
- **Transitions**: gentle_fade, soft_transition, calm_dissolve
- **Effects**: soft_glow, gentle_blur, peaceful_overlay
- **Music**: Ambient, relaxing with nature sounds

### Commercial Ads
- **Style**: Persuasive, compelling narration
- **Pacing**: Dynamic with call-to-action
- **Transitions**: commercial_cut, product_reveal, cta_emphasis
- **Effects**: product_highlight, brand_overlay, commercial_effects
- **Music**: Commercial background with brand emphasis

### Product Demo
- **Style**: Demonstrative, feature-focused narration
- **Pacing**: Clear with feature emphasis
- **Transitions**: feature_reveal, demo_transition, product_showcase
- **Effects**: feature_highlight, demo_overlay, product_effects
- **Music**: Tech-focused background with feature emphasis

### Meme Style
- **Style**: Humorous, meme-style narration
- **Pacing**: Quick and punchy
- **Transitions**: meme_cut, joke_transition, punchline_emphasis
- **Effects**: meme_overlay, comedy_effects, viral_style
- **Music**: Funny, meme-worthy with comedic timing

### Documentary
- **Style**: Narrative, documentary-style narration
- **Pacing**: Cinematic with story beats
- **Transitions**: cinematic_fade, story_transition, documentary_cut
- **Effects**: documentary_overlay, cinematic_effects, story_elements
- **Music**: Cinematic score with narrative emphasis

## 🔧 API Endpoint

### POST /api/dreamcut/script-enhancer

**Request Body**: Refined analyzer JSON from the refiner API

**Response Format**:
```json
{
  "success": true,
  "script": {
    // Complete script structure as shown above
  },
  "quality_assessment": {
    "overallScore": 0.95,
    "grade": "A",
    "issues": [],
    "recommendations": []
  },
  "metadata": {
    "scriptId": "script_1234567890_abc123",
    "profile": "anime_mode",
    "processingTimeMs": 2500,
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

## 🚨 Studio-Grade Quality Assurance

### Duration Compliance (Strict)
- Validates total scene duration matches user requirement exactly
- Allows only ±1 second tolerance for professional pacing
- Penalizes any duration mismatches severely

### Asset Utilization (100% Required)
- Tracks percentage of user assets referenced in script
- Requires 100% utilization for studio-grade rating
- Identifies any unused assets as critical issues

### Narrative Coherence (Professional Structure)
- Ensures proper scene progression with minimum 3 scenes
- Validates hook → body → climax → outro structure
- Checks for compelling hook and emotional climax
- Verifies logical flow and professional transitions

### Profile Alignment (Perfect Match)
- Verifies script matches detected creative profile exactly
- Ensures consistent tone and style throughout
- Validates appropriate effects and music choices
- Checks for profile-specific narrative elements

### Production Readiness
- Validates voiceover-ready narration with proper pacing
- Ensures subtitle text for accessibility compliance
- Checks visual anchor specificity for production planning
- Verifies music cues and effects suggestions
- Confirms character voice consistency

## 🎯 Integration Flow

The Script Enhancer is automatically called after the refiner completes:

1. **Query Analyzer** generates initial analysis
2. **Refiner** polishes and applies creative profile
3. **Script Enhancer** generates production-ready script
4. **Response** includes both refined analysis and script

### Example Terminal Output
```
🎨 [Auto-Refiner] Refinement completed successfully
🎬 [Auto-Script-Enhancer] Starting automatic script generation...
🎬 [Auto-Script-Enhancer] Script generation completed successfully
🎬 [Auto-Script-Enhancer] Script profile: anime_mode
🎬 [Auto-Script-Enhancer] Script quality: A
```

## 🧪 Testing

Use the test page at `/test-script-enhancer` to:
- Test different creative profiles
- Validate script generation with various inputs
- Check quality assessment accuracy
- Verify duration compliance
- Test asset integration

## 🎬 Production Ready

Every script generated by the Script Enhancer is:
- **Voiceover Ready**: Clear, natural narration text
- **Duration Compliant**: Fits exact timing requirements
- **Asset Integrated**: References user content appropriately
- **Profile Aligned**: Matches creative profile style
- **Accessibility Ready**: Includes subtitle text
- **Music Planned**: Includes sound and music cues

This guarantees that every project exits with a usable script, even if the input was just "make anime vid" + a single image.
