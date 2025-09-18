/**
 * 🎬 DREAMCUT SCRIPT ENHANCER API - Human-Readable Script Generation
 * 
 * Clean, focused script generator that produces professional, human-readable scripts
 * for creative teams. No JSON processing - just pure, cinematic script output.
 * 
 * Features:
 * - GPT-5 (primary) for advanced creative script generation
 * - GPT-4o (fallback) for high-quality creative script generation
 * - Claude 3.5 Haiku (fallback) for reliability
 * - GPT-4o-mini (final fallback) for cost efficiency
 * - 18 creative profile support with specialized prompts
 * - Duration-aware pacing control
 * - Asset integration with explicit visual anchors
 * - Voiceover-ready narration with subtitle generation
 * - Music and sound effect planning
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { callLLM } from '@/lib/llm';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Script Enhancer Input Schema
const ScriptEnhancerInputSchema = z.object({
  user_request: z.object({
    original_prompt: z.string(),
    intent: z.string(),
    duration_seconds: z.number(),
    aspect_ratio: z.string(),
    platform: z.string(),
    image_count: z.number().optional()
  }),
  prompt_analysis: z.object({
    user_intent_description: z.string(),
    reformulated_prompt: z.string(),
    clarity_score: z.number(),
    suggested_improvements: z.array(z.string()),
    content_type_analysis: z.object({
      needs_explanation: z.boolean(),
      needs_charts: z.boolean(),
      needs_diagrams: z.boolean(),
      needs_educational_content: z.boolean(),
      content_complexity: z.string(),
      requires_visual_aids: z.boolean(),
      is_instructional: z.boolean(),
      needs_data_visualization: z.boolean(),
      requires_interactive_elements: z.boolean(),
      content_category: z.string()
    })
  }),
  assets: z.array(z.object({
    id: z.string(),
    type: z.string(),
    url: z.string(),
    user_description: z.string().optional(),
    ai_caption: z.string().optional(),
    objects_detected: z.array(z.string()).optional(),
    quality_score: z.number().optional()
  })),
  global_analysis: z.object({
    goal: z.string(),
    constraints: z.object({
      duration_seconds: z.number(),
      aspect_ratio: z.string(),
      platform: z.string()
    }),
    asset_roles: z.record(z.string()),
    conflicts: z.array(z.object({
      issue: z.string().optional(),
      resolution: z.string().optional(),
      severity: z.enum(["minor", "moderate", "critical"]).optional()
    }))
  }),
  creative_options: z.array(z.object({
    id: z.string(),
    title: z.string(),
    short: z.string(),
    reasons: z.array(z.string()),
    estimatedWorkload: z.string()
  })),
  creative_direction: z.object({
    core_concept: z.string(),
    visual_approach: z.string(),
    style_direction: z.string(),
    mood_atmosphere: z.string()
  }),
  production_pipeline: z.object({
    workflow_steps: z.array(z.string()),
    estimated_time: z.string(),
    success_probability: z.number(),
    quality_targets: z.object({
      technical_quality_target: z.string(),
      creative_quality_target: z.string(),
      consistency_target: z.string(),
      polish_level_target: z.string()
    })
  }),
  quality_metrics: z.object({
    overall_confidence: z.number(),
    analysis_quality: z.number(),
    completion_status: z.string(),
    feasibility_score: z.number()
  }),
  challenges: z.array(z.object({
    type: z.string(),
    description: z.string(),
    impact: z.enum(["minor", "moderate", "major"]).optional()
  })),
  recommendations: z.array(z.object({
    type: z.string(),
    recommendation: z.string(),
    priority: z.string()
  })),
  refiner_extensions: z.object({
    creative_profile: z.object({
      profileId: z.string(),
      profileName: z.string(),
      goal: z.string(),
      confidence: z.string(),
      detectionMethod: z.string(),
      matchedFactors: z.array(z.string())
    }).optional()
  }).optional()
});

// Simple Response Schema
const ScriptResponseSchema = z.object({
  human_readable_script: z.string(),
  script_metadata: z.object({
    profile: z.string(),
    duration_seconds: z.number(),
    orientation: z.string(),
    language: z.string(),
    total_scenes: z.number(),
    estimated_word_count: z.number(),
    pacing_style: z.string()
  })
});

type ScriptEnhancerInput = z.infer<typeof ScriptEnhancerInputSchema>;
type ScriptResponse = z.infer<typeof ScriptResponseSchema>;

// Creative Profile Scripts Library with 2025 AI Trends
const CREATIVE_PROFILE_SCRIPTS = {
  anime_mode: {
    style: "Dramatic dialogue with inner monologue and emotional depth",
    pacing: "Dynamic with emotional peaks and valleys",
    music: "Epic orchestral with emotional swells",
    effects: ["cinematic_zoom", "parallax_scroll", "dramatic_lighting"],
    transitions: ["crossfade", "wipe", "dissolve"],
    ai_trends: ["AI talking avatars with anime-style expressions", "AI-generated fantasy environments", "AI voice cloning for character consistency", "AI-powered motion graphics with anime aesthetics", "AI visual effects with dramatic lighting", "AI realistic video generation for fantasy scenes", "AI-generated particle effects for magical moments"]
  },
  finance_explainer: {
    style: "Professional, data-driven narration with clear explanations",
    pacing: "Steady, authoritative with emphasis on key numbers",
    music: "Corporate, uplifting background music",
    effects: ["data_highlight", "chart_animation", "text_reveal"],
    transitions: ["slide", "fade", "push"],
    ai_trends: ["AI-powered data visualization", "AI talking avatars for consistent brand presence", "AI-generated corporate environments", "AI voice cloning for multilingual content", "AI-generated charts and graphs", "AI realistic video generation for product demos", "AI visual effects for professional polish", "AI video editing for optimal pacing"]
  },
  educational_explainer: {
    style: "Clear, instructional narration with step-by-step guidance",
    pacing: "Moderate, educational with pauses for comprehension",
    music: "Light, educational background music",
    effects: ["highlight", "zoom", "overlay_text"],
    transitions: ["fade", "dissolve", "slide"],
    ai_trends: ["AI talking avatars for accessibility", "AI-generated educational environments", "AI content personalization for different learning styles", "AI voice cloning for consistent instruction", "AI-generated charts and infographics", "AI realistic video generation for demonstrations", "AI visual effects for clear explanations", "AI video editing for optimal learning pace"]
  },
  ugc_influencer: {
    style: "Casual, authentic, first-person storytelling",
    pacing: "Fast-paced, energetic with natural pauses",
    music: "Trendy, upbeat background tracks",
    effects: ["quick_cuts", "text_overlay", "color_pop"],
    transitions: ["jump_cut", "swipe", "zoom"],
    ai_trends: ["Face swap for celebrity cameos", "AI-generated trendy backgrounds", "AI-powered motion graphics for engagement", "AI content personalization for different audiences", "AI realistic video generation for authentic content", "AI visual effects for viral appeal", "AI video editing for maximum engagement", "AI-generated music and sound effects"]
  },
  presentation_corporate: {
    style: "Professional, confident business presentation style",
    pacing: "Steady, professional with strategic pauses",
    music: "Corporate, professional background music",
    effects: ["slide_transition", "bullet_points", "logo_reveal"],
    transitions: ["slide", "fade", "push"],
    ai_trends: ["AI talking avatars for consistent brand representation", "AI-generated professional environments", "AI voice cloning for global presentations", "AI-powered motion graphics for data visualization", "AI-generated charts and graphs for presentations", "AI realistic video generation for case studies", "AI visual effects for professional polish", "AI video editing for optimal presentation flow"]
  },
  pleasure_relaxation: {
    style: "Calm, soothing narration with peaceful tone",
    pacing: "Slow, relaxing with gentle rhythm",
    music: "Ambient, peaceful background music",
    effects: ["soft_focus", "gentle_zoom", "warm_lighting"],
    transitions: ["fade", "dissolve", "soft_cut"],
    ai_trends: ["AI-generated peaceful environments", "AI voice cloning for consistent calming tone", "AI-generated ambient music", "AI content personalization for relaxation preferences", "AI visual effects for soothing aesthetics", "AI realistic video generation for nature scenes", "AI video editing for calming pace", "AI-generated sound effects for relaxation"]
  },
  ads_commercial: {
    style: "Persuasive, compelling with strong call-to-action",
    pacing: "Dynamic, attention-grabbing with urgency",
    music: "Energetic, commercial background music",
    effects: ["quick_cuts", "text_pop", "product_highlight"],
    transitions: ["jump_cut", "swipe", "zoom"],
    ai_trends: ["Face swap for celebrity endorsements", "AI talking avatars for brand consistency", "AI-generated product environments", "AI content personalization for target demographics", "AI realistic video generation for product demos", "AI visual effects for attention-grabbing moments", "AI video editing for maximum impact", "AI-generated music and sound for brand recall"]
  },
  demo_product_showcase: {
    style: "Demonstrative, feature-focused with clear benefits",
    pacing: "Moderate, showcasing with product focus",
    music: "Modern, tech-focused background music",
    effects: ["product_zoom", "feature_highlight", "3d_rotation"],
    transitions: ["slide", "fade", "push"],
    ai_trends: ["AI-generated product environments", "AI-powered motion graphics for feature highlights", "AI talking avatars for product demonstrations", "AI voice cloning for consistent product messaging", "AI realistic video generation for product showcases", "AI visual effects for feature emphasis", "AI video editing for optimal demonstration flow", "AI-generated charts for feature comparisons"]
  },
  funny_meme_style: {
    style: "Humorous, meme-style with comedic timing",
    pacing: "Fast, punchy with comedic pauses",
    music: "Fun, upbeat background music",
    effects: ["quick_cuts", "text_meme", "comic_effects"],
    transitions: ["jump_cut", "swipe", "zoom"],
    ai_trends: ["Face swap for comedic transformations", "AI-generated meme backgrounds", "AI-powered motion graphics for comedic effects", "AI content personalization for humor preferences", "AI realistic video generation for comedic scenarios", "AI visual effects for comedic timing", "AI video editing for perfect comedic pacing", "AI-generated sound effects for comedic impact"]
  },
  documentary_storytelling: {
    style: "Narrative, documentary-style with storytelling approach",
    pacing: "Varied, narrative-driven with emotional beats",
    music: "Documentary-style background music",
    effects: ["cinematic_zoom", "parallax", "dramatic_lighting"],
    transitions: ["crossfade", "dissolve", "fade"],
    ai_trends: ["AI-generated historical environments", "Face swap for historical figure reenactments", "AI voice cloning for consistent narration", "AI-powered motion graphics for storytelling enhancement", "AI realistic video generation for historical recreations", "AI visual effects for cinematic storytelling", "AI video editing for narrative flow", "AI-generated music for emotional storytelling"]
  }
};

// Generate clean, human-readable script prompt
function generateHumanReadableScriptPrompt(input: ScriptEnhancerInput): string {
  const profileId = input.refiner_extensions?.creative_profile?.profileId || 'educational_explainer';
  const profileScript = CREATIVE_PROFILE_SCRIPTS[profileId as keyof typeof CREATIVE_PROFILE_SCRIPTS] || CREATIVE_PROFILE_SCRIPTS.educational_explainer;
  const duration = input.user_request.duration_seconds;
  const aspectRatio = input.user_request.aspect_ratio;
  const platform = input.user_request.platform;

  return `You are a professional script writer creating a studio-quality, human-readable script for a ${duration}-second video.

TASK: Create a professional, cinematic script that creative teams can immediately use for production.

VIDEO SPECIFICATIONS:
- Duration: ${duration} seconds
- Aspect Ratio: ${aspectRatio}
- Platform: ${platform}
- Profile: ${profileId}
- Style: ${profileScript.style}
- Pacing: ${profileScript.pacing}
- Music: ${profileScript.music}
- Effects: ${profileScript.effects.join(', ')}
- Transitions: ${profileScript.transitions.join(', ')}
- AI Trends for ${profileId}: ${profileScript.ai_trends?.join(', ') || 'Standard AI content features'}

USER REQUEST: "${input.user_request.original_prompt}"
REFORMULATED: "${input.prompt_analysis.reformulated_prompt}"
INTENT: ${input.prompt_analysis.user_intent_description}

AVAILABLE ASSETS (${input.assets.length}):
${input.assets.map(asset => 
  `- ${asset.id}: ${asset.type} (User: "${asset.user_description || 'No description'}", AI: "${asset.ai_caption || 'No caption'}", Objects: [${asset.objects_detected?.join(', ') || 'none'}], Quality: ${asset.quality_score || 'unknown'})`
).join('\n')}

CREATIVE DIRECTION:
- Core Concept: ${input.creative_direction.core_concept}
- Visual Approach: ${input.creative_direction.visual_approach}
- Style Direction: ${input.creative_direction.style_direction}
- Mood & Atmosphere: ${input.creative_direction.mood_atmosphere}

IDENTIFIED CONFLICTS:
${input.global_analysis.conflicts.length > 0 ? 
  input.global_analysis.conflicts.map(conflict => 
    `- ${conflict.issue || 'Conflict identified'}: ${conflict.resolution || 'Resolution needed'} (${conflict.severity || 'unknown'} severity)`
  ).join('\n') : 
  '- No conflicts identified'}

PROJECT CHALLENGES:
${input.challenges.length > 0 ? 
  input.challenges.map(challenge => 
    `- ${challenge.type}: ${challenge.description} (${challenge.impact || 'unknown'} impact)`
  ).join('\n') : 
  '- No major challenges identified'}

NARRATIVE STRUCTURE REQUIRED:
- Hook (0-3s): Grab attention immediately with ${profileId} style
- Body (3s-${duration-5}s): Core message with asset integration
- Climax (${duration-5}s-${duration-2}s): Emotional peak or key moment
- Outro (${duration-2}s-${duration}s): Call-to-action or conclusion

ASSET INTEGRATION RULES:
${input.assets.length > 0 ? 
  `- MUST mention each user asset: ${input.assets.map(a => a.id).join(', ')}
- Describe how each asset appears in the story using user descriptions
- Use asset descriptions to inform visual anchors and scene context
- Create visual variety: don't repeat the same asset in every scene
- Propose complementary generated scenes when needed for narrative flow` :
  '- No user assets provided - will use generated content and stock imagery'
}

SCRIPT FORMAT REQUIREMENTS:
Create a professional script with this EXACT structure:

=== SCRIPT TITLE ===
[Brief, compelling title for the video]

=== SCRIPT METADATA ===
Profile: ${profileId}
Duration: ${duration} seconds
Orientation: ${aspectRatio}
Language: English
Total Scenes: [number of scenes]
Estimated Word Count: [estimated words]
Pacing Style: ${profileScript.pacing}

=== SCENES ===

Scene 1 | Duration: [X]s | Purpose: [scene purpose]
Narration: "[exact narration text]"
Visuals: [visual anchor description]
Effects: [suggested effects list]
Music: [music cue description]
Pacing: [pacing notes]
Mood: [emotional tone]
Consistency: [consistency notes]

Scene 2 | Duration: [X]s | Purpose: [scene purpose]
[Continue pattern for all scenes...]

=== VOICEOVER GUIDANCE ===
Narration Style: ${profileScript.style}
Pacing Notes: [detailed pacing guidance for voice actor]
Voice Characteristics: [voice details, tone, energy level]

=== MUSIC & AUDIO PLAN ===
Style: ${profileScript.music}
Transitions: ${profileScript.transitions.join(', ')}
Mood Progression: [emotional arc from start to finish]

=== PRODUCTION NOTES ===
Asset Integration: [how user assets are used in the script]
Visual Flow: [scene progression and visual continuity]
Quality Assurance: [compliance notes and requirements]

2025 AI CONTENT TRENDS INTEGRATION:
Consider incorporating these cutting-edge AI features that are trending in 2025:

AI TALKING AVATARS:
- Design scenes with hyper-realistic AI avatars for consistent brand presence
- Include avatar close-ups for maximum impact and engagement
- Plan for avatar personality traits, gestures, and expressions that match content tone
- Consider multilingual content with perfect lip-sync capabilities
- Use avatars for accessibility (sign language, consistent presentation)

FACE SWAP TECHNOLOGY:
- Plan dramatic face swap reveals as key moments in the narrative
- Include seamless transition effects for face changes
- Design scenes that showcase the technology's capabilities naturally
- Create narrative justification for face swaps (celebrity cameos, historical figures, transformations)
- Use for multi-character scenarios with single actor

AI VOICE CLONING & ENHANCEMENT:
- Design for voice variety and emotional range with AI voice capabilities
- Include specific voice direction in production notes
- Plan for voice transitions and character changes
- Consider voice aging, modification, or multilingual voice consistency
- Use for posthumous content or consistent brand voice across all content

AI-GENERATED ENVIRONMENTS:
- Design scenes that showcase unique, impossible, or expensive locations
- Include environmental storytelling elements with AI-generated backgrounds
- Plan for seamless integration between real footage and AI environments
- Consider historical recreations, fantasy settings, or consistent brand environments
- Use for mood and atmosphere enhancement

AI-POWERED MOTION GRAPHICS:
- Design graphics that enhance rather than distract from content
- Include specific timing for graphic reveals and interactions
- Plan for graphics that respond to narration and emotional content
- Consider dynamic data visualization and brand-consistent animated elements
- Use for accessibility with motion sensitivity considerations

AI CONTENT PERSONALIZATION:
- Design modular content sections for different audience preferences
- Include alternative versions for different demographics or skill levels
- Plan for seamless content transitions and personalization triggers
- Consider adaptive difficulty levels and customized examples
- Use for global reach with cultural adaptation

AI-GENERATED MUSIC & SOUND:
- Design scenes with specific musical moments and sound effect cues
- Plan for mood-matching soundtracks and adaptive music
- Include custom sound effects for specific actions or transitions
- Consider copyright-free original music that responds to content pacing
- Use silence as a powerful storytelling tool

AI VISUAL EFFECTS & POST-PRODUCTION:
- Plan for automatic color grading and style transfer that enhances mood
- Include AI-powered green screen removal and background replacement
- Design scenes that showcase intelligent object removal and inpainting
- Plan for style-consistent visual effects across all scenes
- Include automatic lighting correction and enhancement
- Consider AI-generated particle effects and animations for key moments

AI VOICEOVER & AUDIO ENHANCEMENT:
- Design for multi-language voiceover with perfect pronunciation
- Include emotional voice modulation based on content context
- Plan for automatic audio cleanup and noise reduction
- Include AI-powered audio mastering and leveling
- Consider voice aging, gender switching, and accent modification
- Plan for real-time voice translation with lip-sync

AI VIDEO EDITING & TRIMMING:
- Design content with natural cut points and transitions
- Plan for optimal pacing and rhythm in scene structure
- Include specific timing cues for AI editing systems
- Consider viewer attention spans and engagement patterns
- Plan for automatic scene detection and optimal cut points
- Include AI-powered pacing optimization for engagement

AI-GENERATED CHARTS, GRAPHS & DATA VISUALIZATION:
- Design scenes that showcase data visualization capabilities
- Include specific data points and chart requirements
- Plan for progressive data revelation and storytelling
- Consider accessibility with clear data presentation
- Include automatic chart generation from data inputs
- Plan for AI-powered infographic creation with brand consistency

AI REALISTIC VIDEO GENERATION:
- Design scenes that showcase photorealistic AI capabilities
- Plan for seamless integration between AI and real content
- Include specific realism requirements and quality standards
- Consider narrative justification for AI-generated realistic content
- Plan for AI-generated realistic human performances
- Include photorealistic product demonstrations and showcases

AI CONTENT OPTIMIZATION & A/B TESTING:
- Design modular content that can be easily tested and optimized
- Include alternative versions for different audience segments
- Plan for platform-specific optimizations and adaptations
- Consider performance metrics and engagement goals
- Include automatic A/B testing of different content versions
- Plan for AI-powered audience targeting and personalization

INTEGRATION GUIDELINES:
- AI features should feel natural and enhance the story, not distract
- Every AI feature should serve the narrative or educational purpose
- Focus on accessibility and making content more inclusive
- Prioritize quality implementation over using every available feature
- Ensure AI features support the core message and user intent
- Leverage AI for production efficiency and creative enhancement
- Consider the full AI production pipeline from creation to optimization

CRITICAL REQUIREMENTS:
- Write ONLY the human-readable script in the format above
- Do NOT include any JSON, code, or technical formatting
- Make it professional and ready for creative teams
- Ensure each scene has distinct purpose and visual treatment
- Include all necessary production guidance
- Keep narration natural and voiceover-ready
- Make it cinematic and engaging
- Consider 2025 AI trends where they enhance the content naturally
- Focus on modern, cutting-edge content that leverages available AI technology

MANDATORY SECTIONS - MUST INCLUDE ALL:
1. === SCRIPT TITLE ===
2. === SCRIPT METADATA ===
3. === SCENES === (with all scenes)
4. === VOICEOVER GUIDANCE === (MANDATORY)
5. === MUSIC & AUDIO PLAN === (MANDATORY)
6. === PRODUCTION NOTES === (MANDATORY)

DO NOT TRUNCATE THE SCRIPT - COMPLETE ALL SECTIONS ABOVE.

RESPOND WITH ONLY THE COMPLETE HUMAN-READABLE SCRIPT:`;
}

// Simple quality assessment
function assessScriptQuality(script: string, input: ScriptEnhancerInput): {
  overallScore: number;
  grade: string;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Check for required sections (more lenient scoring)
  if (!script.includes('=== SCRIPT TITLE ===')) {
    issues.push('Missing script title section');
    score -= 10;
  }
  if (!script.includes('=== SCENES ===')) {
    issues.push('Missing scenes section');
    score -= 20;
  }
  if (!script.includes('=== VOICEOVER GUIDANCE ===')) {
    issues.push('Missing voiceover guidance');
    score -= 10;
  }
  if (!script.includes('=== MUSIC & AUDIO PLAN ===')) {
    issues.push('Missing music and audio plan');
    score -= 10;
  }
  if (!script.includes('=== PRODUCTION NOTES ===')) {
    issues.push('Missing production notes');
    score -= 5;
  }

  // Check scene count
  const sceneMatches = script.match(/Scene \d+/g);
  const sceneCount = sceneMatches ? sceneMatches.length : 0;
  const expectedScenes = Math.max(3, Math.ceil(input.user_request.duration_seconds / 5));
  
  if (sceneCount < expectedScenes) {
    issues.push(`Too few scenes: ${sceneCount} found, ${expectedScenes} expected`);
    score -= 20;
  }

  // Check asset integration
  if (input.assets.length > 0) {
    const assetMentions = input.assets.filter(asset => 
      script.includes(asset.id) || script.includes(asset.user_description || '')
    ).length;
    
    if (assetMentions < input.assets.length) {
      issues.push('Not all user assets are integrated');
      score -= 15;
    }
  }

  // Generate recommendations
  if (sceneCount < 5) {
    recommendations.push('Consider adding more scenes for better pacing');
  }
  if (script.length < 1000) {
    recommendations.push('Script could be more detailed for production teams');
  }
  if (!script.includes('Effects:')) {
    recommendations.push('Add more specific visual effects guidance');
  }

  // Determine grade
  let grade = 'F';
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';

  return {
    overallScore: score / 100,
    grade,
    issues,
    recommendations
  };
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await req.json();
    
    console.log('🎬 [Script Enhancer] Starting human-readable script generation...');
    console.log('🎬 [Script Enhancer] Received body keys:', Object.keys(body));
    
    // Load script writing knowledge
    let scriptWritingKnowledge = {};
    try {
      const knowledgePath = path.join(process.cwd(), 'lib', 'script-enhancer-knowledge.json');
      const knowledgeData = fs.readFileSync(knowledgePath, 'utf8');
      scriptWritingKnowledge = JSON.parse(knowledgeData);
      console.log('🎬 [Script Enhancer] Loaded script writing knowledge');
    } catch (err) {
      console.warn('🎬 [Script Enhancer] Failed to load script writing knowledge:', err);
    }
    
    // Validate input
    const input = ScriptEnhancerInputSchema.parse(body);
    console.log('🎬 [Script Enhancer] Input validation successful');
    
    // Generate script prompt
    const prompt = generateHumanReadableScriptPrompt(input);
    console.log('🎬 [Script Enhancer] Generated script prompt');
    
    // Call LLM with fallback models
    console.log('🎬 [Script Enhancer] Calling LLM for script generation...');
    const models = ['gpt-5', 'gpt-4o', 'claude-3.5-haiku', 'gpt-4o-mini'] as const;
    let response: { success: boolean; text?: string; error?: string } | undefined;
    
    for (const model of models) {
      try {
        console.log(`🎬 [Script Enhancer] Trying model: ${model}`);
        response = await callLLM({
          model: model,
          messages: [
            {
              role: 'system' as const,
              content: 'You are a professional script writer creating studio-quality, human-readable scripts for video production. You excel at creating engaging, cinematic scripts that creative teams can immediately use.'
            },
            {
              role: 'user' as const,
              content: prompt
            }
          ],
          maxTokens: 4000,
          temperature: 0.1
        });
        
        if (response.success) {
          console.log(`🎬 [Script Enhancer] Success with model: ${model}`);
          break;
        } else {
          console.warn(`🎬 [Script Enhancer] Failed with model ${model}: ${response.error}`);
        }
      } catch (error) {
        console.warn(`🎬 [Script Enhancer] Error with model ${model}:`, error);
        continue;
      }
    }

    if (!response || !response.success) {
      throw new Error(`LLM call failed: ${response?.error || 'No response received'}`);
    }

    const humanReadableScript = response.text || '';
    console.log('🎬 [Script Enhancer] Generated human-readable script');
    console.log('🎬 [Script Enhancer] Script length:', humanReadableScript.length, 'characters');
    
    // Assess script quality
    const qualityAssessment = assessScriptQuality(humanReadableScript, input);
    console.log('🎬 [Script Enhancer] Quality assessment:', {
      overallScore: qualityAssessment.overallScore,
      grade: qualityAssessment.grade,
      issuesCount: qualityAssessment.issues.length,
      recommendationsCount: qualityAssessment.recommendations.length
    });
    
    // Extract metadata from script
    const profileId = input.refiner_extensions?.creative_profile?.profileId || 'educational_explainer';
    const sceneMatches = humanReadableScript.match(/Scene \d+/g);
    const sceneCount = sceneMatches ? sceneMatches.length : 0;
    const wordCount = humanReadableScript.split(/\s+/).length;
    
    const script_metadata = {
      profile: profileId,
      duration_seconds: input.user_request.duration_seconds,
      orientation: input.user_request.aspect_ratio,
      language: 'English',
      total_scenes: sceneCount,
      estimated_word_count: wordCount,
      pacing_style: CREATIVE_PROFILE_SCRIPTS[profileId as keyof typeof CREATIVE_PROFILE_SCRIPTS]?.pacing || 'moderate'
    };
    
    // Store in Supabase
    const scriptId = `script_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const { error: insertError } = await supabase
      .from('script_enhancer_results')
      .insert({
        id: scriptId,
        created_at: new Date().toISOString(),
        user_prompt: input.user_request.original_prompt,
        profile_id: profileId,
        duration_seconds: input.user_request.duration_seconds,
        script_data: { human_readable_script: humanReadableScript, script_metadata: script_metadata },
        quality_assessment: qualityAssessment,
        processing_time_ms: Date.now() - startTime
      });

    if (insertError) {
      console.warn('🎬 [Script Enhancer] Supabase storage failed:', insertError);
    } else {
      console.log('🎬 [Script Enhancer] Stored in Supabase:', scriptId);
    }

    // Broadcast via Realtime
    await supabase
      .channel('script_enhancer_updates')
      .send({
        type: 'broadcast',
        event: 'script_generated',
        payload: {
          scriptId,
          profile: profileId,
          duration: input.user_request.duration_seconds,
          quality: qualityAssessment.grade
        }
      });

    console.log('🎬 [Script Enhancer] Broadcasted via Realtime');
    
    const processingTime = Date.now() - startTime;
    console.log(`🎬 [Script Enhancer] Script generation completed in ${processingTime}ms`);
    
    return NextResponse.json({
      success: true,
      human_readable_script: humanReadableScript,
      script_metadata: script_metadata,
      quality_assessment: qualityAssessment,
      metadata: {
        scriptId,
        profile: profileId,
        processingTimeMs: processingTime,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('🎬 [Script Enhancer] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
