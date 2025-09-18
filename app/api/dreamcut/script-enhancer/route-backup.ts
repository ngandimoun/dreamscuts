/**
 * 🎬 DREAMCUT SCRIPT ENHANCER API - Step 2a.5: Professional Script Generation
 * 
 * Professional script generator that takes refined analyzer JSON and creates
 * production-ready scripts for any of the 18 creative profiles.
 * 
 * Features:
 * - GPT-5 (primary) for advanced creative script generation via Replicate
 * - GPT-4o (fallback) for high-quality creative script generation
 * - Claude 3.5 Haiku (fallback) for reliability
 * - GPT-4o-mini (final fallback) for cost efficiency
 * - Zod validation for script structure safety
 * - 18 creative profile support with specialized prompts
 * - Duration-aware pacing control
 * - Asset integration with explicit visual anchors
 * - Voiceover-ready narration with subtitle generation
 * - Music and sound effect planning
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { callLLM, validateLLMJSON } from '@/lib/llm';
import { validateAndRepairJson } from '@/utils/jsonValidator';
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
    url: z.string().optional(),
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
      issue: z.string(),
      resolution: z.string()
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
    impact: z.string()
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

// Script Enhancer Output Schema
const ScriptEnhancerOutputSchema = z.object({
  script_metadata: z.object({
    profile: z.string(),
    duration_seconds: z.number(),
    orientation: z.string(),
    language: z.string(),
    total_scenes: z.number(),
    estimated_word_count: z.number(),
    pacing_style: z.string()
  }),
  scenes: z.array(z.object({
    scene_id: z.string(),
    duration: z.number(),
    narration: z.string(),
    visual_anchor: z.string(),
    suggested_effects: z.array(z.union([
      z.string(), // Backward compatibility for simple effects
      z.object({
        type: z.string(),
        params: z.record(z.any()).optional()
      })
    ])),
    music_cue: z.string(),
    subtitles: z.string(),
    scene_purpose: z.string(),
    emotional_tone: z.string(),
    visual_treatment: z.object({
      role: z.string(),
      visual_type: z.string(),
      camera_angle: z.string(),
      lighting: z.string(),
      composition: z.string(),
      treatment_note: z.string().optional()
    }).optional()
  })),
  global_voiceover: z.object({
    voices: z.array(z.object({
      id: z.string(),
      style: z.string(),
      gender: z.string(),
      age_range: z.string().optional(),
      accent: z.string().optional(),
      elevenlabs_voice_id: z.string().optional(),
      voice_settings: z.object({
        stability: z.number().optional(),
        similarity_boost: z.number().optional(),
        style: z.number().optional(),
        use_speaker_boost: z.boolean().optional()
      }).optional()
    })),
    narration_style: z.string(),
    pacing_notes: z.string(),
    audio_balance: z.object({
      voice_volume: z.string(),
      music_volume: z.string(),
      effects_volume: z.string(),
      ducking_enabled: z.boolean().optional()
    }).optional(),
    timing_control: z.object({
      pause_between_sentences: z.string(),
      emphasis_timing: z.string(),
      breathing_room: z.string(),
      sync_with_music: z.boolean().optional()
    }).optional()
  }),
  music_plan: z.object({
    style: z.string(),
    transitions: z.array(z.string()),
    mood_progression: z.array(z.string()),
    sound_effects: z.array(z.string()).optional(),
    music_arcs: z.object({
      intro: z.string(),
      development: z.string(),
      climax: z.string(),
      outro: z.string()
    }).optional(),
    music_cues: z.array(z.object({
      segment: z.string(),
      duration: z.string(),
      style: z.string(),
      intensity: z.string(),
      instrumentation: z.string(),
      emotion: z.string().optional(),
      tempo: z.string().optional()
    })).optional(),
    audio_engine: z.string().optional(),
    emotion_tracking: z.boolean().optional()
  }),
  asset_integration: z.object({
    user_assets_used: z.array(z.string()),
    generated_content_needed: z.array(z.string()),
    visual_flow: z.array(z.string())
  }),
  quality_assurance: z.object({
    duration_compliance: z.boolean(),
    asset_utilization: z.string(),
    narrative_coherence: z.string(),
    profile_alignment: z.string()
  }),
  consistency: z.object({
    character_faces: z.string(),
    voice_style: z.string(),
    tone: z.string(),
    visual_continuity: z.string(),
    brand_consistency: z.string(),
    consistency_rules: z.object({
      character_faces: z.string(),
      voice_style: z.string(),
      tone: z.string(),
      visual_continuity: z.string(),
      brand_consistency: z.string(),
      color_palette: z.string().optional(),
      font_consistency: z.string().optional(),
      logo_usage: z.string().optional(),
      style_continuity: z.string().optional()
    }).optional()
  }).optional(),
  scene_enrichment: z.object({
    progression: z.array(z.object({
      role: z.string(),
      visual: z.string(),
      asset: z.string(),
      treatment: z.string(),
      note: z.string().optional()
    })),
    visual_variety_required: z.boolean(),
    distinct_treatment_per_scene: z.boolean(),
    complementary_generation_allowed: z.boolean(),
    narrative_flow: z.string().optional()
  }).optional()
});

// Human-Readable Script Output Schema
const HumanReadableScriptSchema = z.object({
  script_metadata: z.object({
    profile: z.string(),
    duration_seconds: z.number(),
    orientation: z.string(),
    language: z.string(),
    total_scenes: z.number(),
    estimated_word_count: z.number(),
    pacing_style: z.string()
  }),
  human_readable_script: z.string(), // The main human-readable script content
  scenes: z.array(z.object({
    scene_id: z.string(),
    duration: z.number(),
    narration: z.string(),
    visual_anchor: z.string(),
    suggested_effects: z.array(z.union([
      z.string(), // Backward compatibility for simple effects
      z.object({
        type: z.string(),
        params: z.record(z.any()).optional()
      })
    ])),
    music_cue: z.string(),
    subtitles: z.string(),
    scene_purpose: z.string(),
    emotional_tone: z.string(),
    visual_treatment: z.object({
      role: z.string(),
      visual_type: z.string(),
      camera_angle: z.string(),
      lighting: z.string(),
      composition: z.string(),
      treatment_note: z.string().optional()
    }).optional()
  })),
  global_voiceover: z.object({
    voices: z.array(z.object({
      id: z.string(),
      style: z.string(),
      gender: z.string(),
      age_range: z.string().optional(),
      accent: z.string().optional(),
      elevenlabs_voice_id: z.string().optional(),
      voice_settings: z.object({
        stability: z.number().optional(),
        similarity_boost: z.number().optional(),
        style: z.number().optional(),
        use_speaker_boost: z.boolean().optional()
      }).optional()
    })),
    narration_style: z.string(),
    pacing_notes: z.string(),
    audio_balance: z.object({
      voice_volume: z.string(),
      music_volume: z.string(),
      effects_volume: z.string(),
      ducking_enabled: z.boolean().optional()
    }).optional(),
    timing_control: z.object({
      pause_between_sentences: z.string(),
      emphasis_timing: z.string(),
      breathing_room: z.string(),
      sync_with_music: z.boolean().optional()
    }).optional()
  }),
  music_plan: z.object({
    style: z.string(),
    transitions: z.array(z.string()),
    mood_progression: z.array(z.string()),
    sound_effects: z.array(z.string()).optional(),
    music_arcs: z.object({
      intro: z.string(),
      development: z.string(),
      climax: z.string(),
      outro: z.string()
    }).optional(),
    music_cues: z.array(z.object({
      segment: z.string(),
      duration: z.string(),
      style: z.string(),
      intensity: z.string(),
      instrumentation: z.string(),
      emotion: z.string().optional(),
      tempo: z.string().optional()
    })).optional(),
    audio_engine: z.string().optional(),
    emotion_tracking: z.boolean().optional()
  }),
  asset_integration: z.object({
    user_assets_used: z.array(z.string()),
    generated_content_needed: z.array(z.string()),
    visual_flow: z.array(z.string())
  }),
  quality_assurance: z.object({
    duration_compliance: z.boolean(),
    asset_utilization: z.string(),
    narrative_coherence: z.string(),
    profile_alignment: z.string()
  }),
  consistency: z.object({
    character_faces: z.string(),
    voice_style: z.string(),
    tone: z.string(),
    visual_continuity: z.string(),
    brand_consistency: z.string(),
    consistency_rules: z.object({
      character_faces: z.string(),
      voice_style: z.string(),
      tone: z.string(),
      visual_continuity: z.string(),
      brand_consistency: z.string(),
      color_palette: z.string().optional(),
      font_consistency: z.string().optional(),
      logo_usage: z.string().optional(),
      style_continuity: z.string().optional()
    }).optional()
  }).optional(),
  scene_enrichment: z.object({
    progression: z.array(z.object({
      role: z.string(),
      visual: z.string(),
      asset: z.string(),
      treatment: z.string(),
      note: z.string().optional()
    })),
    visual_variety_required: z.boolean(),
    distinct_treatment_per_scene: z.boolean(),
    complementary_generation_allowed: z.boolean(),
    narrative_flow: z.string().optional()
  }).optional(),
  // Internal metadata for JSON conversion
  internal_metadata: z.object({
    scene_ids: z.array(z.string()),
    asset_references: z.array(z.string()),
    music_cue_ids: z.array(z.string()),
    cinematic_effects_tags: z.array(z.string()),
    voiceover_info: z.object({
      voice_name: z.string(),
      style: z.string(),
      tone: z.string()
    }),
    duration_and_aspect_ratio: z.object({
      total_duration: z.number(),
      aspect_ratio: z.string()
    })
  }).optional()
});

type ScriptEnhancerInput = z.infer<typeof ScriptEnhancerInputSchema>;
type ScriptEnhancerOutput = z.infer<typeof ScriptEnhancerOutputSchema>;
type HumanReadableScript = z.infer<typeof HumanReadableScriptSchema>;

// Cinematic Scene Enrichment Library
const SCENE_ENRICHMENT_LIBRARY = {
  finance_explainer: {
    progression: [
      {
        role: "opening",
        visual: "wide_establishing_shot",
        asset: "user_asset_primary",
        treatment: "cinematic_zoom",
        note: "Establish authority and context with wide shot"
      },
      {
        role: "main",
        visual: "medium_focus_shot",
        asset: "generated_alt01",
        treatment: "split_screen_overlay",
        note: "Derived from user asset but enriched with data visualization background"
      },
      {
        role: "closing",
        visual: "closeup",
        asset: "generated_alt02",
        treatment: "bokeh_transition",
        note: "Reinforces main subject with emotional resolution and call-to-action"
      }
    ],
    visual_variety_required: true,
    distinct_treatment_per_scene: true,
    complementary_generation_allowed: true,
    narrative_flow: "authoritative progression with data emphasis"
  },
  educational_explainer: {
    progression: [
      {
        role: "opening",
        visual: "welcoming_wide_shot",
        asset: "user_asset_primary",
        treatment: "slow_pan",
        note: "Create welcoming, approachable atmosphere"
      },
      {
        role: "main",
        visual: "instructional_medium_shot",
        asset: "generated_alt01",
        treatment: "overlay_text",
        note: "Enhanced with educational elements and clear visual hierarchy"
      },
      {
        role: "closing",
        visual: "inspiring_closeup",
        asset: "generated_alt02",
        treatment: "crossfade",
        note: "Motivational conclusion with inspiring visual treatment"
      }
    ],
    visual_variety_required: true,
    distinct_treatment_per_scene: true,
    complementary_generation_allowed: true,
    narrative_flow: "educational progression with learning emphasis"
  },
  ugc_influencer: {
    progression: [
      {
        role: "opening",
        visual: "energetic_hook_shot",
        asset: "user_asset_primary",
        treatment: "cinematic_zoom",
        note: "High-energy opening to grab attention immediately"
      },
      {
        role: "main",
        visual: "dynamic_medium_shot",
        asset: "generated_alt01",
        treatment: "parallax_scroll",
        note: "Viral-style treatment with trendy visual elements"
      },
      {
        role: "closing",
        visual: "memorable_closeup",
        asset: "generated_alt02",
        treatment: "logo_reveal",
        note: "Brand-focused conclusion with viral potential"
      }
    ],
    visual_variety_required: true,
    distinct_treatment_per_scene: true,
    complementary_generation_allowed: true,
    narrative_flow: "viral progression with high engagement"
  },
  presentation_corporate: {
    progression: [
      {
        role: "opening",
        visual: "professional_establishing_shot",
        asset: "user_asset_primary",
        treatment: "cinematic_zoom",
        note: "Professional authority and credibility establishment"
      },
      {
        role: "main",
        visual: "executive_medium_shot",
        asset: "generated_alt01",
        treatment: "split_screen",
        note: "Business-focused with corporate visual elements"
      },
      {
        role: "closing",
        visual: "authoritative_closeup",
        asset: "generated_alt02",
        treatment: "bokeh_transition",
        note: "Confident conclusion with executive presence"
      }
    ],
    visual_variety_required: true,
    distinct_treatment_per_scene: true,
    complementary_generation_allowed: true,
    narrative_flow: "executive progression with professional authority"
  }
};

// ElevenLabs Professional Voiceover Library
const VOICEOVER_LIBRARY = {
  finance_explainer: {
    voices: [
      {
        id: "finance_narrator",
        style: "authoritative and trustworthy",
        gender: "neutral",
        age_range: "adult",
        accent: "neutral",
        elevenlabs_voice_id: "professional_finance_voice",
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.85,
          style: 0.3,
          use_speaker_boost: true
        }
      }
    ],
    narration_style: "clear, confident, data-driven delivery",
    pacing_notes: "Steady pace with emphasis on key statistics and insights",
    audio_balance: {
      voice_volume: "primary",
      music_volume: "background",
      effects_volume: "subtle",
      ducking_enabled: true
    },
    timing_control: {
      pause_between_sentences: "0.5s",
      emphasis_timing: "1.2x",
      breathing_room: "0.3s",
      sync_with_music: true
    }
  },
  educational_explainer: {
    voices: [
      {
        id: "educational_narrator",
        style: "inspiring and motivational",
        gender: "neutral",
        age_range: "adult",
        accent: "neutral",
        elevenlabs_voice_id: "educational_inspirational_voice",
        voice_settings: {
          stability: 0.8,
          similarity_boost: 0.9,
          style: 0.4,
          use_speaker_boost: true
        }
      }
    ],
    narration_style: "warm, encouraging, instructional delivery",
    pacing_notes: "Methodical with learning pauses and emphasis on key concepts",
    audio_balance: {
      voice_volume: "primary",
      music_volume: "supporting",
      effects_volume: "enhancing",
      ducking_enabled: true
    },
    timing_control: {
      pause_between_sentences: "0.7s",
      emphasis_timing: "1.1x",
      breathing_room: "0.4s",
      sync_with_music: true
    }
  },
  ugc_influencer: {
    voices: [
      {
        id: "influencer_narrator",
        style: "energetic and engaging",
        gender: "neutral",
        age_range: "young_adult",
        accent: "neutral",
        elevenlabs_voice_id: "viral_influencer_voice",
        voice_settings: {
          stability: 0.6,
          similarity_boost: 0.8,
          style: 0.7,
          use_speaker_boost: true
        }
      }
    ],
    narration_style: "casual, punchy, first-person engaging delivery",
    pacing_notes: "Fast-paced with energy peaks and viral hooks",
    audio_balance: {
      voice_volume: "primary",
      music_volume: "energetic",
      effects_volume: "dynamic",
      ducking_enabled: false
    },
    timing_control: {
      pause_between_sentences: "0.2s",
      emphasis_timing: "1.5x",
      breathing_room: "0.1s",
      sync_with_music: true
    }
  },
  presentation_corporate: {
    voices: [
      {
        id: "corporate_narrator",
        style: "professional and confident",
        gender: "neutral",
        age_range: "adult",
        accent: "neutral",
        elevenlabs_voice_id: "executive_corporate_voice",
        voice_settings: {
          stability: 0.85,
          similarity_boost: 0.9,
          style: 0.2,
          use_speaker_boost: true
        }
      }
    ],
    narration_style: "authoritative, business-focused, executive delivery",
    pacing_notes: "Steady, confident pace with strategic pauses for impact",
    audio_balance: {
      voice_volume: "primary",
      music_volume: "professional",
      effects_volume: "minimal",
      ducking_enabled: true
    },
    timing_control: {
      pause_between_sentences: "0.6s",
      emphasis_timing: "1.1x",
      breathing_room: "0.4s",
      sync_with_music: true
    }
  }
};

// ElevenLabs 2025-Compatible Music Cues Library
const MUSIC_CUES_LIBRARY = {
  finance_explainer: [
    {
      segment: "intro",
      duration: "0-2s",
      style: "authoritative",
      intensity: "low",
      instrumentation: "soft piano + subtle strings",
      emotion: "confident",
      tempo: "moderate"
    },
    {
      segment: "development", 
      duration: "2-8s",
      style: "motivational",
      intensity: "medium",
      instrumentation: "piano, strings, light percussion",
      emotion: "inspiring",
      tempo: "building"
    },
    {
      segment: "climax",
      duration: "8-12s",
      style: "epic",
      intensity: "high", 
      instrumentation: "orchestral build + percussion + synth pads",
      emotion: "triumphant",
      tempo: "peak"
    },
    {
      segment: "outro",
      duration: "12-15s",
      style: "resolving",
      intensity: "low",
      instrumentation: "piano fade-out + soft strings",
      emotion: "satisfied",
      tempo: "settling"
    }
  ],
  educational_explainer: [
    {
      segment: "intro",
      duration: "0-2s", 
      style: "welcoming",
      intensity: "low",
      instrumentation: "gentle piano + warm strings",
      emotion: "approachable",
      tempo: "calm"
    },
    {
      segment: "development",
      duration: "2-8s",
      style: "instructional", 
      intensity: "medium",
      instrumentation: "piano, strings, light bells",
      emotion: "focused",
      tempo: "steady"
    },
    {
      segment: "climax",
      duration: "8-12s",
      style: "inspiring",
      intensity: "medium-high",
      instrumentation: "strings crescendo + piano + light percussion",
      emotion: "motivated",
      tempo: "building"
    },
    {
      segment: "outro", 
      duration: "12-15s",
      style: "encouraging",
      intensity: "low",
      instrumentation: "piano + soft strings fade",
      emotion: "hopeful",
      tempo: "gentle"
    }
  ],
  ugc_influencer: [
    {
      segment: "intro",
      duration: "0-1s",
      style: "energetic",
      intensity: "high",
      instrumentation: "upbeat synth + drums",
      emotion: "excited",
      tempo: "fast"
    },
    {
      segment: "development",
      duration: "1-6s", 
      style: "trendy",
      intensity: "medium-high",
      instrumentation: "synth, bass, electronic elements",
      emotion: "engaging",
      tempo: "vibrant"
    },
    {
      segment: "climax",
      duration: "6-10s",
      style: "viral",
      intensity: "high",
      instrumentation: "full electronic mix + vocal chops",
      emotion: "hyped",
      tempo: "peak"
    },
    {
      segment: "outro",
      duration: "10-12s",
      style: "catchy",
      intensity: "medium",
      instrumentation: "synth fade + beat drop",
      emotion: "satisfied",
      tempo: "memorable"
    }
  ],
  presentation_corporate: [
    {
      segment: "intro",
      duration: "0-3s",
      style: "professional",
      intensity: "low",
      instrumentation: "clean piano + corporate strings",
      emotion: "confident",
      tempo: "steady"
    },
    {
      segment: "development",
      duration: "3-10s",
      style: "authoritative",
      intensity: "medium",
      instrumentation: "piano, strings, subtle percussion",
      emotion: "trustworthy",
      tempo: "building"
    },
    {
      segment: "climax",
      duration: "10-15s",
      style: "impactful",
      intensity: "high",
      instrumentation: "orchestral peak + corporate brass",
      emotion: "convincing",
      tempo: "powerful"
    },
    {
      segment: "outro",
      duration: "15-18s",
      style: "conclusive",
      intensity: "low",
      instrumentation: "piano resolution + strings",
      emotion: "accomplished",
      tempo: "resolved"
    }
  ]
};

// Studio-Grade Consistency Rules Library
const CONSISTENCY_RULES_LIBRARY = {
  finance_explainer: {
    character_faces: "locked",
    voice_style: "consistent",
    tone: "authoritative and trustworthy",
    visual_continuity: "maintained",
    brand_consistency: "enforced",
    color_palette: "professional blues and grays",
    font_consistency: "clean, modern sans-serif",
    logo_usage: "subtle, bottom-right placement",
    style_continuity: "corporate, data-driven aesthetic"
  },
  educational_explainer: {
    character_faces: "locked",
    voice_style: "consistent",
    tone: "inspiring and motivational",
    visual_continuity: "maintained",
    brand_consistency: "enforced",
    color_palette: "warm, approachable colors",
    font_consistency: "readable, friendly typography",
    logo_usage: "minimal, non-intrusive",
    style_continuity: "educational, clear communication"
  },
  ugc_influencer: {
    character_faces: "locked",
    voice_style: "consistent",
    tone: "energetic and engaging",
    visual_continuity: "maintained",
    brand_consistency: "enforced",
    color_palette: "vibrant, trendy colors",
    font_consistency: "bold, attention-grabbing",
    logo_usage: "prominent, brand-focused",
    style_continuity: "social media optimized"
  },
  presentation_corporate: {
    character_faces: "locked",
    voice_style: "consistent",
    tone: "professional and confident",
    visual_continuity: "maintained",
    brand_consistency: "enforced",
    color_palette: "corporate brand colors",
    font_consistency: "professional, branded typography",
    logo_usage: "strategic, brand reinforcement",
    style_continuity: "executive presentation quality"
  },
  pleasure_relaxation: {
    character_faces: "locked",
    voice_style: "consistent",
    tone: "calm and soothing",
    visual_continuity: "maintained",
    brand_consistency: "enforced",
    color_palette: "soft, natural tones",
    font_consistency: "gentle, flowing typography",
    logo_usage: "minimal, peaceful placement",
    style_continuity: "zen, wellness-focused"
  },
  ads_commercial: {
    character_faces: "locked",
    voice_style: "consistent",
    tone: "persuasive and compelling",
    visual_continuity: "maintained",
    brand_consistency: "enforced",
    color_palette: "brand-specific, high-contrast",
    font_consistency: "bold, commercial typography",
    logo_usage: "prominent, call-to-action focused",
    style_continuity: "advertising, conversion-optimized"
  },
  demo_product_showcase: {
    character_faces: "locked",
    voice_style: "consistent",
    tone: "demonstrative and feature-focused",
    visual_continuity: "maintained",
    brand_consistency: "enforced",
    color_palette: "tech-focused, modern colors",
    font_consistency: "clean, technical typography",
    logo_usage: "product-focused, feature highlighting",
    style_continuity: "tech demo, innovation showcase"
  },
  funny_meme_style: {
    character_faces: "locked",
    voice_style: "consistent",
    tone: "humorous and meme-worthy",
    visual_continuity: "maintained",
    brand_consistency: "enforced",
    color_palette: "vibrant, meme-appropriate colors",
    font_consistency: "fun, viral typography",
    logo_usage: "meme-integrated, viral potential",
    style_continuity: "social media, shareable content"
  },
  documentary_storytelling: {
    character_faces: "locked",
    voice_style: "consistent",
    tone: "narrative and documentary-style",
    visual_continuity: "maintained",
    brand_consistency: "enforced",
    color_palette: "cinematic, story-appropriate",
    font_consistency: "documentary, narrative typography",
    logo_usage: "subtle, story-supporting",
    style_continuity: "cinematic, documentary quality"
  }
};

// Shotstack-Compatible Cinematic Effects Library
const CINEMATIC_EFFECTS_LIBRARY = {
  // Camera Movement Effects
  cinematic_zoom: {
    type: "cinematic_zoom",
    params: { direction: "in", duration: "1s", easing: "ease-in-out", scale_factor: 1.2 }
  },
  cinematic_zoom_out: {
    type: "cinematic_zoom",
    params: { direction: "out", duration: "1.2s", easing: "ease-out", scale_factor: 0.8 }
  },
  slow_pan: {
    type: "slow_pan",
    params: { direction: "right", duration: "2s", easing: "linear", distance: "20%" }
  },
  parallax_scroll: {
    type: "parallax_scroll",
    params: { layers: 3, speed_variance: 0.3, direction: "up", duration: "1.5s" }
  },
  
  // Transition Effects
  bokeh_transition: {
    type: "bokeh_transition",
    params: { blur_intensity: "medium", duration: "0.7s", easing: "ease-in-out" }
  },
  split_screen: {
    type: "split_screen",
    params: { orientation: "vertical", transition: "wipe", ratio: "50:50", duration: "1s" }
  },
  crossfade: {
    type: "crossfade",
    params: { duration: "0.8s", easing: "ease-in-out" }
  },
  
  // Text & Overlay Effects
  overlay_text: {
    type: "overlay_text",
    params: { 
      style: "bold", 
      position: "bottom_center", 
      animation: "fade_in",
      duration: "1s",
      font_size: "large"
    }
  },
  text_reveal: {
    type: "text_reveal",
    params: { 
      animation: "typewriter", 
      duration: "1.5s", 
      position: "center",
      style: "modern"
    }
  },
  logo_reveal: {
    type: "logo_reveal",
    params: {
      style: "light_glow",
      duration: "1.2s",
      animation: "scale_fade",
      glow_intensity: "medium"
    }
  },
  
  // Visual Enhancement Effects
  lens_flare: {
    type: "lens_flare",
    params: { intensity: "medium", duration: "0.5s", position: "top_right" }
  },
  motion_blur: {
    type: "motion_blur",
    params: { intensity: "low", duration: "0.3s", direction: "horizontal" }
  },
  color_grade: {
    type: "color_grade",
    params: { style: "cinematic", intensity: "medium", temperature: "warm" }
  },
  
  // Professional Effects
  data_highlight: {
    type: "data_highlight",
    params: { 
      animation: "pulse", 
      duration: "1s", 
      color: "accent",
      intensity: "medium"
    }
  },
  chart_animation: {
    type: "chart_animation",
    params: { 
      animation: "draw_in", 
      duration: "2s", 
      easing: "ease-out",
      style: "professional"
    }
  },
  product_highlight: {
    type: "product_highlight",
    params: { 
      glow: "soft", 
      duration: "1.5s", 
      animation: "scale_glow",
      intensity: "medium"
    }
  }
};

// Creative Profile Script Templates with Enhanced Cinematic Effects
const CREATIVE_PROFILE_SCRIPTS = {
  'anime_mode': {
    style: 'dramatic dialogue with inner monologue and action sounds',
    pacing: 'dynamic with emotional peaks',
    transitions: ['dramatic_fade', 'action_cut', 'emotional_zoom'],
    effects: [
      CINEMATIC_EFFECTS_LIBRARY.lens_flare,
      CINEMATIC_EFFECTS_LIBRARY.motion_blur,
      CINEMATIC_EFFECTS_LIBRARY.cinematic_zoom,
      CINEMATIC_EFFECTS_LIBRARY.parallax_scroll,
      CINEMATIC_EFFECTS_LIBRARY.text_reveal,
      CINEMATIC_EFFECTS_LIBRARY.color_grade
    ],
    music: 'orchestral anime theme with emotional crescendos',
    music_arcs: ['epic_intro', 'emotional_buildup', 'climactic_peak', 'triumphant_outro']
  },
  'finance_explainer': {
    style: 'structured narration with data callouts',
    pacing: 'steady and authoritative',
    transitions: ['professional_fade', 'data_reveal', 'chart_transition'],
    effects: [
      CINEMATIC_EFFECTS_LIBRARY.overlay_text,
      CINEMATIC_EFFECTS_LIBRARY.data_highlight,
      CINEMATIC_EFFECTS_LIBRARY.chart_animation,
      CINEMATIC_EFFECTS_LIBRARY.cinematic_zoom,
      CINEMATIC_EFFECTS_LIBRARY.split_screen,
      CINEMATIC_EFFECTS_LIBRARY.bokeh_transition
    ],
    music: 'corporate background with subtle emphasis',
    music_arcs: ['authoritative_intro', 'steady_development', 'data_emphasis', 'confident_outro']
  },
  'educational_explainer': {
    style: 'clear, instructional narration',
    pacing: 'methodical with learning pauses',
    transitions: ['educational_fade', 'step_transition', 'concept_reveal'],
    effects: [
      CINEMATIC_EFFECTS_LIBRARY.overlay_text,
      CINEMATIC_EFFECTS_LIBRARY.text_reveal,
      CINEMATIC_EFFECTS_LIBRARY.cinematic_zoom,
      CINEMATIC_EFFECTS_LIBRARY.slow_pan,
      CINEMATIC_EFFECTS_LIBRARY.crossfade,
      CINEMATIC_EFFECTS_LIBRARY.data_highlight
    ],
    music: 'neutral background with learning emphasis',
    music_arcs: ['welcoming_intro', 'educational_flow', 'concept_emphasis', 'inspiring_outro']
  },
  'ugc_influencer': {
    style: 'casual, punchy, first-person style',
    pacing: 'energetic and engaging',
    transitions: ['quick_cut', 'energy_boost', 'trendy_transition'],
    effects: [
      CINEMATIC_EFFECTS_LIBRARY.cinematic_zoom,
      CINEMATIC_EFFECTS_LIBRARY.parallax_scroll,
      CINEMATIC_EFFECTS_LIBRARY.logo_reveal,
      CINEMATIC_EFFECTS_LIBRARY.text_reveal,
      CINEMATIC_EFFECTS_LIBRARY.motion_blur,
      CINEMATIC_EFFECTS_LIBRARY.color_grade
    ],
    music: 'trendy, upbeat with viral potential',
    music_arcs: ['viral_hook', 'energetic_flow', 'trendy_peak', 'engaging_outro']
  },
  'presentation_corporate': {
    style: 'professional, confident narration',
    pacing: 'steady and business-focused',
    transitions: ['corporate_fade', 'slide_transition', 'professional_cut'],
    effects: [
      CINEMATIC_EFFECTS_LIBRARY.overlay_text,
      CINEMATIC_EFFECTS_LIBRARY.data_highlight,
      CINEMATIC_EFFECTS_LIBRARY.cinematic_zoom,
      CINEMATIC_EFFECTS_LIBRARY.split_screen,
      CINEMATIC_EFFECTS_LIBRARY.bokeh_transition,
      CINEMATIC_EFFECTS_LIBRARY.logo_reveal
    ],
    music: 'corporate background with professional tone',
    music_arcs: ['professional_intro', 'confident_development', 'key_insight_emphasis', 'authoritative_outro']
  },
  'pleasure_relaxation': {
    style: 'calm, soothing narration',
    pacing: 'relaxed and peaceful',
    transitions: ['gentle_fade', 'soft_transition', 'calm_dissolve'],
    effects: [
      CINEMATIC_EFFECTS_LIBRARY.slow_pan,
      CINEMATIC_EFFECTS_LIBRARY.bokeh_transition,
      CINEMATIC_EFFECTS_LIBRARY.overlay_text,
      CINEMATIC_EFFECTS_LIBRARY.crossfade,
      CINEMATIC_EFFECTS_LIBRARY.color_grade,
      CINEMATIC_EFFECTS_LIBRARY.cinematic_zoom_out
    ],
    music: 'ambient, relaxing with nature sounds',
    music_arcs: ['calm_intro', 'peaceful_flow', 'serene_peak', 'tranquil_outro']
  },
  'ads_commercial': {
    style: 'persuasive, compelling narration',
    pacing: 'dynamic with call-to-action',
    transitions: ['commercial_cut', 'product_reveal', 'cta_emphasis'],
    effects: [
      CINEMATIC_EFFECTS_LIBRARY.product_highlight,
      CINEMATIC_EFFECTS_LIBRARY.logo_reveal,
      CINEMATIC_EFFECTS_LIBRARY.parallax_scroll,
      CINEMATIC_EFFECTS_LIBRARY.cinematic_zoom,
      CINEMATIC_EFFECTS_LIBRARY.text_reveal,
      CINEMATIC_EFFECTS_LIBRARY.lens_flare
    ],
    music: 'commercial background with brand emphasis',
    music_arcs: ['attention_grabber', 'product_showcase', 'persuasive_peak', 'call_to_action']
  },
  'demo_product_showcase': {
    style: 'demonstrative, feature-focused narration',
    pacing: 'clear with feature emphasis',
    transitions: ['feature_reveal', 'demo_transition', 'product_showcase'],
    effects: [
      CINEMATIC_EFFECTS_LIBRARY.product_highlight,
      CINEMATIC_EFFECTS_LIBRARY.cinematic_zoom,
      CINEMATIC_EFFECTS_LIBRARY.split_screen,
      CINEMATIC_EFFECTS_LIBRARY.logo_reveal,
      CINEMATIC_EFFECTS_LIBRARY.text_reveal,
      CINEMATIC_EFFECTS_LIBRARY.motion_blur
    ],
    music: 'tech-focused background with feature emphasis',
    music_arcs: ['tech_intro', 'feature_showcase', 'demo_emphasis', 'innovation_outro']
  },
  'funny_meme_style': {
    style: 'humorous, meme-style narration',
    pacing: 'quick and punchy',
    transitions: ['meme_cut', 'joke_transition', 'punchline_emphasis'],
    effects: [
      CINEMATIC_EFFECTS_LIBRARY.cinematic_zoom,
      CINEMATIC_EFFECTS_LIBRARY.parallax_scroll,
      CINEMATIC_EFFECTS_LIBRARY.logo_reveal,
      CINEMATIC_EFFECTS_LIBRARY.text_reveal,
      CINEMATIC_EFFECTS_LIBRARY.motion_blur,
      CINEMATIC_EFFECTS_LIBRARY.color_grade
    ],
    music: 'funny, meme-worthy with comedic timing',
    music_arcs: ['comedy_hook', 'joke_buildup', 'punchline_peak', 'viral_outro']
  },
  'documentary_storytelling': {
    style: 'narrative, documentary-style narration',
    pacing: 'cinematic with story beats',
    transitions: ['cinematic_fade', 'story_transition', 'documentary_cut'],
    effects: [
      CINEMATIC_EFFECTS_LIBRARY.slow_pan,
      CINEMATIC_EFFECTS_LIBRARY.bokeh_transition,
      CINEMATIC_EFFECTS_LIBRARY.overlay_text,
      CINEMATIC_EFFECTS_LIBRARY.cinematic_zoom,
      CINEMATIC_EFFECTS_LIBRARY.crossfade,
      CINEMATIC_EFFECTS_LIBRARY.color_grade
    ],
    music: 'cinematic score with narrative emphasis',
    music_arcs: ['narrative_intro', 'story_development', 'emotional_peak', 'satisfying_outro']
  }
};

// Generate studio-grade script enhancer prompt
function generateScriptEnhancerPrompt(input: ScriptEnhancerInput): string {
  const profile = input.refiner_extensions?.creative_profile;
  const profileId = profile?.profileId || 'educational_explainer'; // Default to educational instead of general
  const profileScript = CREATIVE_PROFILE_SCRIPTS[profileId as keyof typeof CREATIVE_PROFILE_SCRIPTS] || CREATIVE_PROFILE_SCRIPTS.educational_explainer;
  
  const duration = input.user_request.duration_seconds;
  const estimatedScenes = Math.max(2, Math.ceil(duration / 2.5)); // 2.5 seconds per scene for better pacing
  const wordsPerScene = Math.ceil((duration * 5) / estimatedScenes); // ~5 words per second for richer content
  
  return `🎬 SCRIPT ENHANCER — STUDIO-GRADE SYSTEM PROMPT

🔑 ROLE
You are the Script Enhancer, a specialized agent in the Dreamcut pipeline.
Your job is to turn raw intent + assets into a polished, professional script, structured for voiceover, subtitles, and scene planning.

🎯 OBJECTIVES
- Always deliver a narrative-ready script — even if user gave no script
- Integrate Analyzer + Refiner data (intent, profiles, assets, recommendations)
- Respect user duration, orientation, and platform constraints
- Guarantee voiceover lines, subtitles, and music cues
- Make scripts cinematic and production-ready

🧩 INPUTS RECEIVED
user_request: "${input.user_request.original_prompt}" (${input.user_request.intent}, ${duration}s, ${input.user_request.aspect_ratio}, ${input.user_request.platform})
prompt_analysis: clarity ${input.prompt_analysis.clarity_score}/10, reformulated: "${input.prompt_analysis.reformulated_prompt}"
assets: ${input.assets.length} assets with descriptions and quality scores
creative_direction: ${profile?.profileName || 'General'} profile, tone: ${input.creative_direction.mood_atmosphere}
recommendations: ${input.recommendations.length} pipeline actions

📝 RESPONSIBILITIES

STORY FRAMEWORK:
- Build Hook → Body → Climax → Outro
- Ensure pacing matches ${duration} seconds exactly
- Create ${estimatedScenes} scenes with proper timing

SCENE BREAKDOWN:
- Assign each scene a duration slice (${Math.round(duration / estimatedScenes)}s each)
- Write narration lines (voiceover text, ~${wordsPerScene} words per scene)
- Write matching subtitles (shorter, synced to narration)
- Attach visual anchors: use uploaded assets first, propose generated assets when missing

VOICEOVER PLAN (ELEVENLABS INTEGRATION):
- Always at least one narrator with ElevenLabs voice ID and settings
- If story needs multiple characters → assign distinct voices with unique voice IDs
- Define gender, style, tone, and ElevenLabs voice settings for each voice
- Ensure voice clarity: stability 0.75+, similarity_boost 0.85+, use_speaker_boost: true
- Audio balance: voice_volume "primary", music_volume "background", ducking_enabled: true
- Timing control: precise pauses, emphasis timing, breathing room, sync with music
- Narration must be clear and understandable over music and effects

VOICEOVER-MUSIC INTEGRATION:
- Voice takes priority: music ducks when voiceover speaks (ducking_enabled: true)
- Music intensity lowers during narration: "background" or "supporting" volume
- Effects enhance but don't compete: "subtle" or "enhancing" volume
- Timing sync: voiceover pauses align with music transitions
- Breathing room: 0.3-0.7s pauses between sentences for clarity
- Emphasis timing: 1.1-1.5x speed for key words/phrases

MUSIC + SFX (ELEVENLABS 2025-READY):
- Use structured music cues with intro → development → climax → outro progression
- Each segment must specify: duration, style, intensity, instrumentation, emotion, tempo
- Mark transitions ("fade in", "drop", "outro fade")
- Add SFX if style requires (anime = swoosh, impact; finance = typing, notification)
- Ensure audio_engine: "elevenlabs" and emotion_tracking: true for 2025 compatibility

SUBTITLES:
- Always present, matching narration timing
- Simplified, natural reading rhythm
- Accessibility-ready text

CONSISTENCY ENFORCEMENT (STUDIO-GRADE):
- Character faces locked across all scenes (Stable Diffusion/DreamBooth embeddings)
- Voice style consistent throughout (ElevenLabs voice consistency)
- Tone maintained: ${input.creative_direction.mood_atmosphere}
- Visual continuity maintained (no jarring transitions)
- Brand consistency enforced (colors, fonts, logo usage)
- Color palette: profile-specific professional colors
- Font consistency: appropriate typography for ${profileId}
- Logo usage: strategic placement and sizing
- Style continuity: ${profileId} aesthetic maintained throughout

🚫 THINGS TO AVOID
- Do not ignore user assets (must reference them explicitly)
- Do not exceed duration budget (${duration}s total)
- Do not produce generic "advertising" copy — always reflect the ${profileId} profile
- Do not leave empty fields

🧠 REASONING RULES (verify before writing):
1. Does the script fit inside ${duration} seconds?
2. Are user asset descriptions integrated naturally?
3. Does it match the ${input.user_request.aspect_ratio} aspect ratio?
4. Are assets mapped to scenes clearly?
5. Is the tone aligned with ${profileId} profile?
6. Do I have a clear narrator voice and matching subtitles?
7. Are music and SFX cues present to support pacing?
8. Does the story feel complete and cinematic for ${profileId}?

AVAILABLE ASSETS (${input.assets.length}):
${input.assets.map(asset => 
  `- ${asset.id}: ${asset.type} (User: "${asset.user_description || 'No description'}", AI: "${asset.ai_caption || 'No caption'}", Objects: [${asset.objects_detected?.join(', ') || 'none'}], Quality: ${asset.quality_score || 'unknown'})`
).join('\n')}

CREATIVE PROFILE: ${profileId}
- Style: ${profileScript.style}
- Pacing: ${profileScript.pacing}
- Music: ${profileScript.music}
- Effects: ${profileScript.effects.join(', ')}
- Transitions: ${profileScript.transitions.join(', ')}

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

SCENE ENRICHMENT REQUIREMENTS (CINEMATIC POLISH):
- Each scene must have distinct visual treatment and purpose
- NEVER repeat the same visual anchor across multiple scenes
- Create visual progression: opening → main → closing with distinct treatments
- Visual variety required: wide_establishing_shot → medium_focus_shot → closeup
- Complementary generation allowed: if assets are too few, generate enriched alternatives
- Each scene needs visual_treatment with: role, visual_type, camera_angle, lighting, composition
- Use SHOTSTACK-COMPATIBLE CINEMATIC EFFECTS with full parameters:
  * Camera Movement: cinematic_zoom, slow_pan, parallax_scroll
  * Transitions: bokeh_transition, split_screen, crossfade
  * Text & Overlays: overlay_text, text_reveal, logo_reveal
  * Visual Enhancement: lens_flare, motion_blur, color_grade
  * Professional: data_highlight, chart_animation, product_highlight
- Each effect must include type and params for Shotstack rendering
- Ensure each scene has unique emotional tone and visual style
- Effects should feel like Netflix documentary or Apple keynote quality
- Studio-level engagement: mimic human editing logic (wide → medium → close-up)

Generate a complete, production-ready script that transforms "${input.user_request.original_prompt}" into a professional ${profile?.profileName || 'content'} script ready for immediate use by Director + Production teams.

CRITICAL: You must generate ${estimatedScenes} scenes (not just 1) and include ALL required fields in the JSON schema below. Each scene must have all required properties.

Return ONLY valid JSON matching this exact schema:
{
  "script_metadata": {
    "profile": "${profileId}",
    "duration_seconds": ${duration},
    "orientation": "${input.user_request.aspect_ratio === 'Smart Auto' ? 'portrait' : input.user_request.aspect_ratio.includes('portrait') ? 'portrait' : input.user_request.aspect_ratio.includes('square') ? 'square' : 'landscape'}",
    "language": "english",
    "total_scenes": ${estimatedScenes},
    "estimated_word_count": ${duration * 5},
    "pacing_style": "${profileScript.pacing}"
  },
  "scenes": [
    {
      "scene_id": "s1",
      "duration": ${Math.round(duration / estimatedScenes)},
      "narration": "Hook narration that grabs attention with ${profileId} style...",
      "subtitles": "Hook subtitle text...",
      "visual_anchor": "${input.assets.length > 0 ? input.assets[0].id : 'generated_opening_visual'}",
      "suggested_effects": [
        ${JSON.stringify(profileScript.effects[0] || CINEMATIC_EFFECTS_LIBRARY.cinematic_zoom)},
        ${JSON.stringify(CINEMATIC_EFFECTS_LIBRARY.overlay_text)}
      ],
      "music_cue": "opening_theme",
      "scene_purpose": "Hook the audience and establish the main topic",
      "emotional_tone": "${input.creative_direction.mood_atmosphere}",
      "visual_treatment": {
        "role": "opening",
        "visual_type": "wide_establishing_shot",
        "camera_angle": "wide",
        "lighting": "professional",
        "composition": "rule_of_thirds",
        "treatment_note": "Establish authority and context with cinematic wide shot"
      }
    },
    {
      "scene_id": "s2",
      "duration": ${Math.round(duration / estimatedScenes)},
      "narration": "Main content narration with rich detail and ${profileId} style...",
      "subtitles": "Main content subtitle...",
      "visual_anchor": "${input.assets.length > 1 ? input.assets[1].id : 'generated_main_content'}",
      "suggested_effects": [
        ${JSON.stringify(profileScript.effects[1] || CINEMATIC_EFFECTS_LIBRARY.slow_pan)},
        ${JSON.stringify(CINEMATIC_EFFECTS_LIBRARY.parallax_scroll)},
        ${JSON.stringify(CINEMATIC_EFFECTS_LIBRARY.bokeh_transition)}
      ],
      "music_cue": "main_theme",
      "scene_purpose": "Deliver core message with visual impact",
      "emotional_tone": "${input.creative_direction.mood_atmosphere}",
      "visual_treatment": {
        "role": "main",
        "visual_type": "medium_focus_shot",
        "camera_angle": "medium",
        "lighting": "enhanced",
        "composition": "centered",
        "treatment_note": "Enhanced with complementary visual elements and data emphasis"
      }
    }
  ],
  "global_voiceover": ${JSON.stringify(VOICEOVER_LIBRARY[profileId] || VOICEOVER_LIBRARY.educational_explainer)},
  "music_plan": {
    "style": "${profileScript.music}",
    "transitions": ${JSON.stringify(profileScript.transitions)},
    "mood_progression": ${JSON.stringify(profileScript.music_arcs || ["opening", "development", "climax", "resolution"])},
    "sound_effects": ${JSON.stringify(profileScript.effects)},
    "music_arcs": {
      "intro": "${profileScript.music_arcs?.[0] || 'opening_theme'}",
      "development": "${profileScript.music_arcs?.[1] || 'main_theme'}",
      "climax": "${profileScript.music_arcs?.[2] || 'climactic_peak'}",
      "outro": "${profileScript.music_arcs?.[3] || 'resolution_theme'}"
    },
    "music_cues": ${JSON.stringify(MUSIC_CUES_LIBRARY[profileId] || MUSIC_CUES_LIBRARY.educational_explainer)},
    "audio_engine": "elevenlabs",
    "emotion_tracking": true
  },
  "asset_integration": {
    "user_assets_used": ${JSON.stringify(input.assets.map(a => a.id))},
    "generated_content_needed": ["background_music", "transition_effects"],
    "visual_flow": ["opening_shot", "main_content", "closing_shot"]
  },
  "quality_assurance": {
    "duration_compliance": true,
    "asset_utilization": "All user assets integrated appropriately",
    "narrative_coherence": "Clear story arc with proper pacing",
    "profile_alignment": "Matches ${profileId} style and requirements"
  },
  "consistency": {
    "character_faces": "locked",
    "voice_style": "consistent",
    "tone": "${input.creative_direction.mood_atmosphere}",
    "visual_continuity": "maintained",
    "brand_consistency": "enforced",
    "consistency_rules": ${JSON.stringify(CONSISTENCY_RULES_LIBRARY[profileId] || CONSISTENCY_RULES_LIBRARY.educational_explainer)}
  },
  "scene_enrichment": ${JSON.stringify(SCENE_ENRICHMENT_LIBRARY[profileId] || SCENE_ENRICHMENT_LIBRARY.educational_explainer)}
}

CRITICAL HUMAN-READABLE SCRIPT OUTPUT REQUIREMENTS:
- You are a professional script writer creating studio-quality, human-readable scripts
- Output a clean, structured script that creative teams can immediately use
- Include both the human-readable script AND the structured JSON data
- The human-readable script should be the primary output - professional and cinematic
- Never include explanations or comments outside the script structure
- If unsure about a field, set it to null or use empty string ""
- Never invent new keys not in the schema
- Before returning, check that your JSON is valid and matches the schema exactly

HUMAN-READABLE SCRIPT FORMAT:
Create a professional script with this structure:

=== SCRIPT TITLE ===
[Brief description of the video content]

=== SCRIPT METADATA ===
Profile: [creative profile name]
Duration: [X seconds]
Orientation: [aspect ratio]
Language: [language]
Total Scenes: [number]
Estimated Word Count: [number]
Pacing Style: [style description]

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
[Continue pattern...]

=== VOICEOVER GUIDANCE ===
Narration Style: [style description]
Pacing Notes: [detailed pacing guidance]
Voice Characteristics: [voice details]

=== MUSIC & AUDIO PLAN ===
Style: [music style]
Transitions: [transition types]
Mood Progression: [emotional arc]

=== PRODUCTION NOTES ===
Asset Integration: [how user assets are used]
Visual Flow: [scene progression]
Quality Assurance: [compliance notes]

EXACT JSON SCHEMA TO FOLLOW (for production pipeline):
{
  "script_metadata": {
    "profile": "string",
    "duration_seconds": "number",
    "orientation": "string",
    "language": "string",
    "total_scenes": "number",
    "estimated_word_count": "number",
    "pacing_style": "string"
  },
  "scenes": [
    {
      "scene_id": "string",
      "duration": "number",
      "narration": "string",
      "visual_anchor": "string",
      "suggested_effects": ["string or object"],
      "music_cue": "string",
      "subtitles": "string",
      "scene_purpose": "string",
      "emotional_tone": "string",
      "visual_treatment": {
        "role": "string",
        "visual_type": "string",
        "camera_angle": "string",
        "lighting": "string",
        "composition": "string",
        "treatment_note": "string"
      }
    }
  ],
  "music_plan": {
    "music_cues": [
      {
        "segment": "string",
        "duration": "string",
        "style": "string",
        "intensity": "string",
        "instrumentation": "string",
        "emotion": "string",
        "tempo": "string"
      }
    ],
    "audio_engine": "string",
    "emotion_tracking": "boolean"
  },
  "consistency": {
    "consistency_rules": {
      "character_faces": "string",
      "voice_style": "string",
      "tone": "string",
      "visual_continuity": "string",
      "brand_consistency": "string",
      "color_palette": "string",
      "font_consistency": "string",
      "logo_usage": "string",
      "style_continuity": "string"
    }
  },
  "scene_enrichment": {
    "progression": [
      {
        "role": "string",
        "visual": "string",
        "asset": "string",
        "treatment": "string",
        "note": "string"
      }
    ],
    "visual_variety_required": "boolean",
    "distinct_treatment_per_scene": "boolean",
    "complementary_generation_allowed": "boolean",
    "narrative_flow": "string"
  },
  "global_voiceover": {
    "elevenlabs_voice_id": "string",
    "voice_settings": {
      "stability": "number",
      "similarity_boost": "number",
      "style": "number",
      "use_speaker_boost": "boolean"
    },
    "audio_balance": {
      "voice_volume": "string",
      "music_volume": "string",
      "effects_volume": "string",
      "ducking_enabled": "boolean"
    },
    "timing_control": {
      "pause_between_sentences": "string",
      "emphasis_timing": "string",
      "breathing_room": "string",
      "sync_with_music": "boolean"
    }
  }
}

RESPOND WITH BOTH HUMAN-READABLE SCRIPT AND JSON:

First, provide the human-readable script in this format:

=== SCRIPT TITLE ===
[Your script title here]

=== SCRIPT METADATA ===
[Metadata as specified above]

=== SCENES ===
[All scenes as specified above]

=== VOICEOVER GUIDANCE ===
[Voiceover details]

=== MUSIC & AUDIO PLAN ===
[Music and audio details]

=== PRODUCTION NOTES ===
[Production guidance]

Then, provide the JSON data between <json> and </json> tags:
<json>
{ "your": "json", "here": "exactly", "matching": "schema" }
</json>`;
}

// Utility function to convert human-readable script to production JSON
function convertHumanReadableToProductionJSON(humanReadableScript: HumanReadableScript): ScriptEnhancerOutput {
  // Extract the structured data from the human-readable script
  const productionJSON: ScriptEnhancerOutput = {
    script_metadata: humanReadableScript.script_metadata,
    scenes: humanReadableScript.scenes,
    global_voiceover: humanReadableScript.global_voiceover,
    music_plan: humanReadableScript.music_plan,
    asset_integration: humanReadableScript.asset_integration,
    quality_assurance: humanReadableScript.quality_assurance,
    consistency: humanReadableScript.consistency,
    scene_enrichment: humanReadableScript.scene_enrichment
  };
  
  return productionJSON;
}

// Studio-grade quality assessment for script
function assessScriptQuality(script: HumanReadableScript, input: ScriptEnhancerInput): {
  overallScore: number;
  grade: string;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 1.0;

  // Studio-grade duration compliance (strict tolerance)
  const totalDuration = script.scenes.reduce((sum, scene) => sum + scene.duration, 0);
  const durationDiff = Math.abs(totalDuration - input.user_request.duration_seconds);
  if (durationDiff > 1) {
    issues.push(`Duration mismatch: ${totalDuration}s vs ${input.user_request.duration_seconds}s (tolerance: ±1s)`);
    score -= 0.25;
  }

  // Studio-grade asset utilization (must use all user assets)
  if (input.assets.length > 0) {
    const assetsUsed = script.asset_integration.user_assets_used.length;
    const assetUtilization = assetsUsed / input.assets.length;
    if (assetUtilization < 1.0) {
      issues.push(`Incomplete asset utilization: ${Math.round(assetUtilization * 100)}% of assets used (required: 100%)`);
      score -= 0.2;
    }
  }

  // Studio-grade narrative structure validation
  if (script.scenes.length < 3) {
    issues.push('Insufficient scenes for professional narrative structure (minimum: 3 scenes)');
    score -= 0.2;
  }

  // Check for proper narrative arc (hook, body, climax, outro)
  const hasHook = script.scenes.some(scene => scene.scene_id.includes('1') || scene.narration.toLowerCase().includes('hook'));
  const hasClimax = script.scenes.some(scene => scene.scene_id.includes('climax') || scene.narration.toLowerCase().includes('climax'));
  if (!hasHook) {
    issues.push('Missing compelling hook in opening scene');
    score -= 0.1;
  }
  if (!hasClimax) {
    issues.push('Missing emotional climax or key moment');
    score -= 0.1;
  }

  // Studio-grade narration quality (voiceover-ready) - Enhanced for richer content
  const avgWordsPerScene = script.scenes.reduce((sum, scene) => sum + scene.narration.split(' ').length, 0) / script.scenes.length;
  const expectedWords = (input.user_request.duration_seconds * 5) / script.scenes.length; // Increased from 3 to 5 words per second
  if (avgWordsPerScene < expectedWords * 0.8) {
    issues.push('Narration too brief for professional voiceover pacing (minimum 5 words/second)');
    score -= 0.15;
  }

  // Check subtitle quality and accessibility
  const hasSubtitles = script.scenes.every(scene => scene.subtitles && scene.subtitles.length > 0);
  if (!hasSubtitles) {
    issues.push('Missing subtitle text for accessibility compliance');
    score -= 0.1;
  }

  // Check visual anchor specificity
  const hasSpecificAnchors = script.scenes.every(scene => 
    scene.visual_anchor && 
    (scene.visual_anchor.includes('user_') || scene.visual_anchor.length > 10)
  );
  if (!hasSpecificAnchors) {
    issues.push('Visual anchors too generic for production planning');
    score -= 0.1;
  }

  // Check music and effects planning
  const hasMusicCues = script.scenes.every(scene => scene.music_cue && scene.music_cue.length > 0);
  const hasEffects = script.scenes.every(scene => scene.suggested_effects && scene.suggested_effects.length > 0);
  const hasMusicArcs = script.music_plan.music_arcs && 
    script.music_plan.music_arcs.intro && 
    script.music_plan.music_arcs.development && 
    script.music_plan.music_arcs.climax && 
    script.music_plan.music_arcs.outro;
  
  // Check for cinematic effects with parameters
  const hasCinematicEffects = script.scenes.every(scene => 
    scene.suggested_effects.some(effect => 
      typeof effect === 'object' && effect.type && effect.params
    )
  );
  
  // Check for ElevenLabs 2025-compatible music cues
  const hasStructuredMusicCues = script.music_plan.music_cues && 
    script.music_plan.music_cues.length >= 4 &&
    script.music_plan.music_cues.every(cue => 
      cue.segment && cue.duration && cue.style && cue.intensity && cue.instrumentation
    );
  
  const hasElevenLabsCompatibility = script.music_plan.audio_engine === 'elevenlabs' && 
    script.music_plan.emotion_tracking === true;
  
  // Check for ElevenLabs voiceover integration
  const hasElevenLabsVoiceover = script.global_voiceover.voices.every(voice => 
    voice.elevenlabs_voice_id && voice.voice_settings
  );
  
  const hasAudioBalance = script.global_voiceover.audio_balance &&
    script.global_voiceover.audio_balance.voice_volume === 'primary' &&
    script.global_voiceover.audio_balance.ducking_enabled === true;
  
  const hasTimingControl = script.global_voiceover.timing_control &&
    script.global_voiceover.timing_control.pause_between_sentences &&
    script.global_voiceover.timing_control.sync_with_music === true;
  
  if (!hasMusicCues) {
    issues.push('Missing music cues for production planning');
    score -= 0.05;
  }
  if (!hasEffects) {
    issues.push('Missing visual effects suggestions');
    score -= 0.05;
  }
  if (!hasCinematicEffects) {
    issues.push('Missing cinematic effects with Shotstack-compatible parameters');
    score -= 0.15;
  }
  if (!hasMusicArcs) {
    issues.push('Missing structured music arcs for professional production');
    score -= 0.1;
  }
  if (!hasStructuredMusicCues) {
    issues.push('Missing ElevenLabs 2025-compatible structured music cues');
    score -= 0.15;
  }
  if (!hasElevenLabsCompatibility) {
    issues.push('Missing ElevenLabs audio engine and emotion tracking configuration');
    score -= 0.1;
  }
  if (!hasElevenLabsVoiceover) {
    issues.push('Missing ElevenLabs voiceover integration with voice IDs and settings');
    score -= 0.15;
  }
  if (!hasAudioBalance) {
    issues.push('Missing proper audio balance with voice priority and ducking');
    score -= 0.1;
  }
  if (!hasTimingControl) {
    issues.push('Missing timing control for voiceover-music synchronization');
    score -= 0.1;
  }

  // Check consistency enforcement
  const hasConsistency = script.consistency && 
    script.consistency.character_faces && 
    script.consistency.voice_style && 
    script.consistency.tone;
  
  const hasDetailedConsistencyRules = script.consistency?.consistency_rules &&
    script.consistency.consistency_rules.character_faces &&
    script.consistency.consistency_rules.voice_style &&
    script.consistency.consistency_rules.tone &&
    script.consistency.consistency_rules.visual_continuity &&
    script.consistency.consistency_rules.brand_consistency;
  
  // Check for scene enrichment and visual variety
  const hasSceneEnrichment = script.scene_enrichment &&
    script.scene_enrichment.visual_variety_required === true &&
    script.scene_enrichment.distinct_treatment_per_scene === true &&
    script.scene_enrichment.complementary_generation_allowed === true;
  
  const hasVisualTreatment = script.scenes.every(scene => 
    scene.visual_treatment &&
    scene.visual_treatment.role &&
    scene.visual_treatment.visual_type &&
    scene.visual_treatment.camera_angle &&
    scene.visual_treatment.lighting &&
    scene.visual_treatment.composition
  );
  
  const hasVisualProgression = script.scenes.length >= 3 &&
    script.scenes.some(scene => scene.visual_treatment?.role === 'opening') &&
    script.scenes.some(scene => scene.visual_treatment?.role === 'main') &&
    script.scenes.some(scene => scene.visual_treatment?.role === 'closing');
  
  if (!hasConsistency) {
    issues.push('Missing consistency rules for character faces, voice style, and tone');
    score -= 0.1;
  }
  if (!hasDetailedConsistencyRules) {
    issues.push('Missing detailed consistency rules for studio-grade quality');
    score -= 0.15;
  }
  if (!hasSceneEnrichment) {
    issues.push('Missing scene enrichment with visual variety and progression requirements');
    score -= 0.15;
  }
  if (!hasVisualTreatment) {
    issues.push('Missing visual treatment details for each scene (role, visual_type, camera_angle, lighting, composition)');
    score -= 0.15;
  }
  if (!hasVisualProgression) {
    issues.push('Missing proper visual progression (opening → main → closing)');
    score -= 0.1;
  }

  // Studio-grade recommendations
  if (script.scenes.length < 4) {
    recommendations.push('Add more scenes for richer narrative development');
  }
  if (script.asset_integration.user_assets_used.length === 0 && input.assets.length > 0) {
    recommendations.push('Integrate all user assets with explicit visual descriptions');
  }
  if (script.global_voiceover.voices.length === 1 && script.scenes.length > 4) {
    recommendations.push('Consider multiple character voices for longer content');
  }
  if (script.music_plan.transitions.length < 3) {
    recommendations.push('Add more music transition cues for smoother production');
  }
  if (!hasCinematicEffects) {
    recommendations.push('Upgrade to cinematic effects with Shotstack-compatible parameters for professional quality');
  }
  if (!hasStructuredMusicCues) {
    recommendations.push('Implement ElevenLabs 2025-compatible structured music cues for advanced audio production');
  }
  if (!hasDetailedConsistencyRules) {
    recommendations.push('Add detailed consistency rules for studio-grade character, voice, and brand consistency');
  }
  if (!hasElevenLabsVoiceover) {
    recommendations.push('Integrate ElevenLabs voiceover with professional voice IDs and settings for clear narration');
  }
  if (!hasAudioBalance) {
    recommendations.push('Implement proper audio balance with voice priority and music ducking for clarity');
  }
  if (!hasTimingControl) {
    recommendations.push('Add precise timing control for voiceover-music synchronization and breathing room');
  }
  if (!hasSceneEnrichment) {
    recommendations.push('Implement scene enrichment with visual variety and progression for cinematic polish');
  }
  if (!hasVisualTreatment) {
    recommendations.push('Add detailed visual treatment for each scene with role, camera angle, lighting, and composition');
  }
  if (!hasVisualProgression) {
    recommendations.push('Create proper visual progression from opening to main to closing for engaging narrative flow');
  }

  // Studio-grade scoring
  const grade = score >= 0.95 ? 'A+' : 
                score >= 0.9 ? 'A' : 
                score >= 0.85 ? 'A-' : 
                score >= 0.8 ? 'B+' : 
                score >= 0.75 ? 'B' : 
                score >= 0.7 ? 'B-' : 
                score >= 0.65 ? 'C+' : 
                score >= 0.6 ? 'C' : 'D';

  return {
    overallScore: Math.max(0, score),
    grade,
    issues,
    recommendations
  };
}

// Backfill missing required fields using library defaults so schema validation passes
function backfillScriptFields(script: any, profileId: string, input: ScriptEnhancerInput): any {
  const out = { ...(script || {}) };

  const voiceDefaults: any = (VOICEOVER_LIBRARY as any)[profileId] || (VOICEOVER_LIBRARY as any).educational_explainer;
  const cueDefaults: any[] = ((MUSIC_CUES_LIBRARY as any)[profileId] || (MUSIC_CUES_LIBRARY as any).educational_explainer) as any[];
  const consistencyDefaults: any = (CONSISTENCY_RULES_LIBRARY as any)[profileId] || (CONSISTENCY_RULES_LIBRARY as any).educational_explainer;

  // Global voiceover
  out.global_voiceover = {
    ...(voiceDefaults || {}),
    ...(out.global_voiceover || {})
  };
  if (!Array.isArray(out.global_voiceover.voices)) {
    out.global_voiceover.voices = voiceDefaults?.voices || [];
  }
  if (!out.global_voiceover.narration_style) {
    out.global_voiceover.narration_style = voiceDefaults?.narration_style || 'professional narration';
  }
  if (!out.global_voiceover.pacing_notes) {
    out.global_voiceover.pacing_notes = voiceDefaults?.pacing_notes || 'steady, clear pacing with emphasis on key points';
  }

  // Music plan
  const inferredStyle = (cueDefaults && cueDefaults[0]?.style) || 'cinematic';
  const inferredMoodProgression = Array.isArray(cueDefaults)
    ? cueDefaults.map((c: any) => c?.style).filter(Boolean)
    : ['intro', 'development', 'climax', 'outro'];
  out.music_plan = {
    style: out.music_plan?.style || inferredStyle,
    transitions: (out.music_plan && Array.isArray(out.music_plan.transitions))
      ? out.music_plan.transitions
      : ['crossfade', 'bokeh_transition', 'wipe'],
    mood_progression: (out.music_plan && Array.isArray(out.music_plan.mood_progression))
      ? out.music_plan.mood_progression
      : inferredMoodProgression,
    music_cues: (out.music_plan && Array.isArray(out.music_plan.music_cues))
      ? out.music_plan.music_cues
      : (cueDefaults || []),
    audio_engine: out.music_plan?.audio_engine || 'elevenlabs',
    emotion_tracking: typeof out.music_plan?.emotion_tracking === 'boolean' ? out.music_plan.emotion_tracking : true
  };

  // Asset integration
  out.asset_integration = {
    user_assets_used: out.asset_integration?.user_assets_used || [],
    generated_content_needed: out.asset_integration?.generated_content_needed || [],
    visual_flow: out.asset_integration?.visual_flow || []
  };

  // Quality assurance
  out.quality_assurance = {
    duration_compliance: typeof out.quality_assurance?.duration_compliance === 'boolean'
      ? out.quality_assurance.duration_compliance
      : true,
    asset_utilization: out.quality_assurance?.asset_utilization || 'moderate',
    narrative_coherence: out.quality_assurance?.narrative_coherence || 'strong',
    profile_alignment: out.quality_assurance?.profile_alignment || 'strong'
  };

  // Consistency
  const existingConsistency = out.consistency || {};
  out.consistency = {
    character_faces: existingConsistency.character_faces || consistencyDefaults.character_faces,
    voice_style: existingConsistency.voice_style || consistencyDefaults.voice_style,
    tone: existingConsistency.tone || consistencyDefaults.tone,
    visual_continuity: existingConsistency.visual_continuity || consistencyDefaults.visual_continuity,
    brand_consistency: existingConsistency.brand_consistency || consistencyDefaults.brand_consistency,
    consistency_rules: existingConsistency.consistency_rules || consistencyDefaults
  };

  return out;
}

// Create an intelligent fallback script when JSON parsing fails
function createFallbackScript(input: ScriptEnhancerInput): any {
  const profileId = input.refiner_extensions?.creative_profile?.profileId || 'educational_explainer';
  const duration = input.user_request.duration_seconds;
  const estimatedScenes = Math.max(2, Math.ceil(duration / 2.5));
  
  // Extract key information from user input
  const originalPrompt = input.user_request.original_prompt || '';
  const userIntent = input.prompt_analysis?.user_intent_description || '';
  const coreConcept = input.creative_direction?.core_concept || '';
  const moodAtmosphere = input.creative_direction?.mood_atmosphere || 'professional';
  const visualApproach = input.creative_direction?.visual_approach || 'clean and engaging';
  
  // Generate contextual content based on user input
  const generateContextualNarration = (sceneIndex: number, totalScenes: number) => {
    const isFirst = sceneIndex === 0;
    const isLast = sceneIndex === totalScenes - 1;
    
    if (isFirst) {
      // Opening scene - hook the audience
      if (coreConcept) {
        return `Let's dive into ${coreConcept.toLowerCase()}. ${originalPrompt.includes('explain') ? 'I will break this down simply' : 'Here is what you need to know'}.`;
      } else if (userIntent) {
        return `Welcome! ${userIntent}. Let's get started.`;
      } else {
        return `Let's explore this together. ${originalPrompt.substring(0, 100)}...`;
      }
    } else if (isLast) {
      // Closing scene - wrap up
      return `That's a wrap! ${coreConcept ? `We've covered ${coreConcept.toLowerCase()}` : 'Thanks for watching'}. ${originalPrompt.includes('learn') ? 'Hope you learned something new!' : 'Hope this was helpful!'}`;
    } else {
      // Middle scenes - develop the content
      const contentHints = [
        'Here\'s the key insight',
        'Let me show you how this works',
        'This is where it gets interesting',
        'The important part is',
        'Here\'s what you need to understand'
      ];
      const hint = contentHints[sceneIndex % contentHints.length];
      return `${hint}. ${coreConcept ? `In ${coreConcept.toLowerCase()},` : 'In this context,'} this is crucial.`;
    }
  };
  
  // Generate contextual subtitles
  const generateContextualSubtitles = (sceneIndex: number, totalScenes: number) => {
    const narration = generateContextualNarration(sceneIndex, totalScenes);
    // Create shorter, punchier subtitles
    return narration.split('.')[0] + '.';
  };
  
  // Generate scene purposes based on content
  const generateScenePurpose = (sceneIndex: number, totalScenes: number) => {
    const isFirst = sceneIndex === 0;
    const isLast = sceneIndex === totalScenes - 1;
    
    if (isFirst) {
      return `Hook the audience with ${coreConcept ? coreConcept.toLowerCase() : 'the main topic'} and establish credibility`;
    } else if (isLast) {
      return `Deliver the final key message and create a memorable conclusion`;
    } else {
      return `Develop the core content with clear explanations and visual impact`;
    }
  };
  
  // Generate visual treatment based on assets and content
  const generateVisualTreatment = (sceneIndex: number, totalScenes: number) => {
    const isFirst = sceneIndex === 0;
    const isLast = sceneIndex === totalScenes - 1;
    const hasUserAsset = input.assets.length > sceneIndex;
    
    return {
      role: isFirst ? 'opening' : isLast ? 'closing' : 'main',
      visual_type: isFirst ? 'wide_establishing_shot' : hasUserAsset ? 'asset_focused_shot' : 'medium_focus_shot',
      camera_angle: isFirst ? 'wide' : hasUserAsset ? 'close_up' : 'medium',
      lighting: visualApproach.includes('dramatic') ? 'dramatic' : 'professional',
      composition: isFirst ? 'rule_of_thirds' : hasUserAsset ? 'centered' : 'dynamic',
      treatment_note: hasUserAsset 
        ? `Feature user asset: ${input.assets[sceneIndex]?.user_description || input.assets[sceneIndex]?.ai_caption || 'user provided content'}`
        : isFirst ? 'Establish context and authority' : 'Focus on main content delivery'
    };
  };
  
  return {
    script_metadata: {
      profile: profileId,
      duration_seconds: duration,
      orientation: input.user_request.aspect_ratio === 'Smart Auto' ? 'portrait' : 
                   input.user_request.aspect_ratio.includes('portrait') ? 'portrait' : 
                   input.user_request.aspect_ratio.includes('square') ? 'square' : 'landscape',
      language: 'english',
      total_scenes: estimatedScenes,
      estimated_word_count: duration * 5,
      pacing_style: profileId.includes('influencer') ? 'energetic and engaging' : 
                   profileId.includes('finance') ? 'authoritative and clear' : 
                   'methodical with learning pauses'
    },
    scenes: Array.from({ length: estimatedScenes }, (_, i) => ({
      scene_id: `s${i + 1}`,
      duration: Math.round(duration / estimatedScenes),
      narration: generateContextualNarration(i, estimatedScenes),
      visual_anchor: input.assets.length > i ? input.assets[i].id : `generated_scene_${i + 1}`,
      suggested_effects: [
        {
          type: i === 0 ? 'fade_in' : i === estimatedScenes - 1 ? 'fade_out' : 'cinematic_zoom',
          params: { 
            direction: i === 0 ? 'in' : 'out', 
            duration: '1s', 
            easing: 'ease-in-out', 
            scale_factor: 1.1 
          }
        }
      ],
      music_cue: i === 0 ? 'opening_theme' : i === estimatedScenes - 1 ? 'closing_theme' : 'main_theme',
      subtitles: generateContextualSubtitles(i, estimatedScenes),
      scene_purpose: generateScenePurpose(i, estimatedScenes),
      emotional_tone: moodAtmosphere,
      visual_treatment: generateVisualTreatment(i, estimatedScenes)
    })),
    global_voiceover: {
      voices: [{
        id: 'fallback_narrator',
        style: 'professional and clear',
        gender: 'neutral',
        age_range: 'adult',
        accent: 'neutral',
        elevenlabs_voice_id: 'professional_voice',
        voice_settings: {
          stability: 0.8,
          similarity_boost: 0.9,
          style: 0.3,
          use_speaker_boost: true
        }
      }],
      narration_style: 'clear, professional delivery',
      pacing_notes: 'Steady pace with emphasis on key points',
      audio_balance: {
        voice_volume: 'primary',
        music_volume: 'background',
        effects_volume: 'subtle',
        ducking_enabled: true
      },
      timing_control: {
        pause_between_sentences: '0.5s',
        emphasis_timing: '1.1x',
        breathing_room: '0.3s',
        sync_with_music: true
      }
    },
    music_plan: {
      style: 'professional background music',
      transitions: ['crossfade', 'bokeh_transition'],
      mood_progression: ['opening', 'development', 'climax', 'resolution'],
      music_cues: [
        {
          segment: 'intro',
          duration: '0-2s',
          style: 'welcoming',
          intensity: 'low',
          instrumentation: 'gentle piano + strings',
          emotion: 'approachable',
          tempo: 'calm'
        },
        {
          segment: 'development',
          duration: '2-8s',
          style: 'instructional',
          intensity: 'medium',
          instrumentation: 'piano, strings',
          emotion: 'focused',
          tempo: 'steady'
        }
      ],
      audio_engine: 'elevenlabs',
      emotion_tracking: true
    },
    asset_integration: {
      user_assets_used: input.assets.map(a => a.id),
      generated_content_needed: input.assets.length > 0 
        ? ['background_music', 'transition_effects', 'supporting_graphics']
        : ['background_music', 'transition_effects', 'primary_visuals', 'supporting_graphics'],
      visual_flow: input.assets.length > 0 
        ? ['user_asset_showcase', 'content_development', 'conclusion']
        : ['opening_shot', 'main_content', 'closing_shot']
    },
    quality_assurance: {
      duration_compliance: true,
      asset_utilization: input.assets.length > 0 
        ? `All ${input.assets.length} user assets integrated with contextual relevance`
        : 'Generated content optimized for maximum engagement',
      narrative_coherence: coreConcept 
        ? `Clear progression through ${coreConcept.toLowerCase()} with logical flow`
        : 'Strong narrative arc with engaging content development',
      profile_alignment: `Perfectly matches ${profileId.replace('_', ' ')} style with ${moodAtmosphere} tone`
    },
    consistency: {
      character_faces: 'locked',
      voice_style: 'consistent',
      tone: input.creative_direction.mood_atmosphere,
      visual_continuity: 'maintained',
      brand_consistency: 'enforced',
      consistency_rules: {
        character_faces: 'locked',
        voice_style: 'consistent',
        tone: input.creative_direction.mood_atmosphere,
        visual_continuity: 'maintained',
        brand_consistency: 'enforced',
        color_palette: 'professional colors',
        font_consistency: 'clean, modern typography',
        logo_usage: 'minimal, non-intrusive',
        style_continuity: 'professional, clear communication'
      }
    },
    scene_enrichment: {
      progression: input.assets.length > 0 ? [
        {
          role: 'opening',
          visual: 'wide_establishing_shot',
          asset: input.assets[0]?.id || 'user_asset_primary',
          treatment: 'cinematic_zoom',
          note: `Establish context with ${input.assets[0]?.user_description || 'user provided content'}`
        },
        {
          role: 'main',
          visual: input.assets.length > 1 ? 'asset_focused_shot' : 'medium_focus_shot',
          asset: input.assets.length > 1 ? input.assets[1]?.id || 'generated_content' : 'generated_content',
          treatment: 'slow_pan',
          note: input.assets.length > 1 
            ? `Develop content with ${input.assets[1]?.user_description || 'secondary asset'}`
            : 'Focus on main content delivery'
        }
      ] : [
        {
          role: 'opening',
          visual: 'wide_establishing_shot',
          asset: 'generated_opening',
          treatment: 'fade_in',
          note: `Establish context for ${coreConcept || 'the main topic'}`
        },
        {
          role: 'main',
          visual: 'medium_focus_shot',
          asset: 'generated_content',
          treatment: 'cinematic_zoom',
          note: `Deliver core content about ${coreConcept || 'the subject matter'}`
        }
      ],
      visual_variety_required: true,
      distinct_treatment_per_scene: true,
      complementary_generation_allowed: true,
      narrative_flow: coreConcept 
        ? `Professional progression through ${coreConcept.toLowerCase()} with ${moodAtmosphere} tone`
        : `Professional progression with clear communication and ${moodAtmosphere} atmosphere`
    }
  };
}

// Adapter function to transform the input format to match the expected schema
function adaptRequestFormat(body: any): any {
  console.log('🎬 [Script Enhancer] Adapting request format...');
  
  // If the body already has the expected format, return it as is
  if (body.user_request && body.prompt_analysis) {
    return body;
  }
  
  try {
    // Get the options from the body
    const options = body.options || {};
    const durationSeconds = options.durationSeconds || options.duration_seconds || 30;
    const aspectRatio = options.aspectRatio || options.aspect_ratio || '16:9';
    const platform = options.platform || 'social';
    
    // Get creative profile info from refined output
    const creativeProfile = body.creative_profile || {};
    const profileId = creativeProfile.id || body.final_analysis?.creative_profile?.id || 'educational_explainer';
    const profileName = creativeProfile.name || body.final_analysis?.creative_profile?.name || 'Educational Explainer';
    
    // Get the final analysis data
    const finalAnalysis = body.final_analysis || {};
    const globalUnderstanding = finalAnalysis.global_understanding || {};
    const unifiedCreativeDirection = globalUnderstanding.unified_creative_direction || {};
    const processingInsights = finalAnalysis.processing_insights || {};
    
    // Transform from the Refiner/Query Analyzer format to the expected format
    return {
      user_request: {
        original_prompt: body.userPrompt || body.user_prompt || '',
        intent: body.intent || 'video',
        duration_seconds: durationSeconds,
        aspect_ratio: aspectRatio,
        platform: platform,
        image_count: options.imageCount || options.image_count || 1
      },
      prompt_analysis: {
        user_intent_description: processingInsights.intent_description || finalAnalysis.intent_analysis?.user_intent || 'Create content',
        reformulated_prompt: processingInsights.reformulated_prompt || finalAnalysis.intent_analysis?.refined_prompt || body.userPrompt || '',
        clarity_score: processingInsights.clarity_score || finalAnalysis.intent_analysis?.clarity_score || 7,
        suggested_improvements: body.warnings || [],
        content_type_analysis: {
          needs_explanation: processingInsights.needs_explanation || false,
          needs_charts: processingInsights.needs_charts || false,
          needs_diagrams: processingInsights.needs_diagrams || false,
          needs_educational_content: processingInsights.needs_educational_content || false,
          content_complexity: processingInsights.content_complexity || finalAnalysis.content_analysis?.complexity || 'simple',
          requires_visual_aids: processingInsights.requires_visual_aids || false,
          is_instructional: processingInsights.is_instructional || false,
          needs_data_visualization: processingInsights.needs_data_visualization || false,
          requires_interactive_elements: processingInsights.requires_interactive_elements || false,
          content_category: processingInsights.content_category || finalAnalysis.content_analysis?.category || 'general'
        }
      },
      assets: body.assets || [],
      global_analysis: {
        goal: unifiedCreativeDirection.core_concept || finalAnalysis.goal || 'Create high-quality content',
        constraints: {
          duration_seconds: durationSeconds,
          aspect_ratio: aspectRatio,
          platform: platform
        },
        asset_roles: finalAnalysis.asset_roles || {},
        conflicts: body.warnings?.map((warning: string) => ({ 
          issue: warning, 
          resolution: 'Addressed in script'
        })) || []
      },
      creative_options: body.creativeOptions || body.creative_options || [
        {
          id: 'default_option',
          title: 'Default Option',
          short: 'Default creative approach',
          reasons: ['Best match for content type'],
          estimatedWorkload: 'medium'
        }
      ],
      creative_direction: {
        core_concept: unifiedCreativeDirection.core_concept || finalAnalysis.creative_direction?.core_concept || 'Create engaging content',
        visual_approach: unifiedCreativeDirection.visual_approach || finalAnalysis.creative_direction?.visual_approach || 'Professional style',
        style_direction: unifiedCreativeDirection.style_direction || finalAnalysis.creative_direction?.style || 'Clean and modern',
        mood_atmosphere: unifiedCreativeDirection.mood || finalAnalysis.creative_direction?.mood || 'Professional'
      },
      production_pipeline: {
        workflow_steps: body.recommendedPipeline?.steps || body.recommended_pipeline?.steps || ['Plan', 'Create', 'Review', 'Publish'],
        estimated_time: body.recommendedPipeline?.estimated_time || body.recommended_pipeline?.estimated_time || '30-45 minutes',
        success_probability: body.recommendedPipeline?.success_probability || body.recommended_pipeline?.success_probability || 0.9,
        quality_targets: body.recommendedPipeline?.quality_targets || body.recommended_pipeline?.quality_targets || {
          technical_quality_target: 'high',
          creative_quality_target: 'appealing',
          consistency_target: 'good',
          polish_level_target: 'refined'
        }
      },
      quality_metrics: {
        overall_confidence: processingInsights.overall_confidence || processingInsights.confidence_breakdown?.overall_confidence || 0.8,
        analysis_quality: processingInsights.analysis_quality || finalAnalysis.analysis_metadata?.quality_score || 8,
        completion_status: processingInsights.completion_status || finalAnalysis.analysis_metadata?.completion_status || 'complete',
        feasibility_score: processingInsights.feasibility_score || finalAnalysis.analysis_metadata?.feasibility_score || 0.85
      },
      challenges: body.warnings?.map((warning: string) => ({
        type: 'content',
        description: warning,
        impact: 'moderate'
      })) || [],
      recommendations: processingInsights.recommendations?.map((rec: string) => ({
        type: 'quality',
        recommendation: rec,
        priority: 'recommended'
      })) || [],
      refiner_extensions: {
        creative_profile: {
          profileId: profileId,
          profileName: profileName,
          goal: creativeProfile.goal || 'Create engaging content',
          confidence: creativeProfile.confidence || '0.95',
          detectionMethod: creativeProfile.detection_method || 'multi-factor',
          matchedFactors: creativeProfile.matched_factors || ['intent: video']
        }
      }
    };
  } catch (error) {
    console.error('🎬 [Script Enhancer] Error adapting request format:', error);
    throw new Error('Failed to adapt request format: ' + error.message);
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await req.json();
    
    console.log('🎬 [Script Enhancer] Starting script generation...');
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
    
    // Adapt and validate input
    const adaptedBody = adaptRequestFormat(body);
    const input = ScriptEnhancerInputSchema.parse(adaptedBody);
    console.log('🎬 [Script Enhancer] Input validation successful');
    
    // Generate script prompt
    const prompt = generateScriptEnhancerPrompt(input);
    console.log('🎬 [Script Enhancer] Generated script prompt');
    console.log('🎬 [Script Enhancer] Prompt preview:', prompt.substring(0, 500) + '...');
    
    // Call LLM with robust JSON validation and repair
    console.log('🎬 [Script Enhancer] Calling LLM for script generation...');
    const baseMessages = [
      {
        role: 'system' as const,
        content: `You are a studio-grade Script Enhancer, a specialized agent in the Dreamcut pipeline. Your expertise is turning raw intent + assets into polished, professional scripts that are immediately usable by Director + Production teams.

CORE EXPERTISE:
- Professional screenwriting with cinematic structure
- Voiceover-ready narration with perfect pacing
- Asset integration with explicit visual anchors
- Creative profile alignment across 18 specialized styles
- Duration-compliant scene breakdown
- Accessibility-ready subtitle generation
- Music and SFX planning for production

QUALITY STANDARDS:
- Every script must be production-ready
- Always respect user assets and descriptions
- Maintain consistent tone and character voices
- Ensure exact duration compliance
- Create compelling narrative arcs
- Include proper scene transitions and effects

SCRIPT WRITING KNOWLEDGE:
${JSON.stringify(scriptWritingKnowledge, null, 2)}

CRITICAL JSON OUTPUT REQUIREMENTS:
- You are a system that outputs ONLY valid JSON
- Never include explanations, comments, or extra text
- If unsure about a field, set it to null or use empty string ""
- Never invent new keys not in the schema
- Before returning, check that your JSON is valid and matches the schema exactly
- If invalid, fix it before outputting
- ALWAYS wrap your output in <json>...</json> tags
- Do not stop until you have output a closing </json> tag
- Ensure the JSON is complete and properly formatted

You deliver scripts that can be immediately used by professional production teams without additional editing.`
      },
      {
        role: 'user' as const,
        content: prompt
      }
    ];

    // Try multiple models with fallback
    let response;
    const models = ['gpt-5', 'gpt-4o', 'claude-3-5-haiku-20241022', 'gpt-4o-mini'];
    
    for (const model of models) {
      try {
        console.log(`🎬 [Script Enhancer] Trying model: ${model}`);
        response = await callLLM({
          model: model,
          messages: baseMessages,
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

    if (!response.success) {
      throw new Error(`LLM call failed: ${response.error}`);
    }

    const finalText = response.text;
    console.log('🎬 [Script Enhancer] LLM generated script');
    console.log('🎬 [Script Enhancer] Raw LLM response:', finalText.substring(0, 500) + '...');

    // Extract human-readable script and JSON from response
    let humanReadableScript = '';
    let jsonContent = '';
    
    // Check if response contains both human-readable script and JSON
    console.log('🎬 [Script Enhancer] Checking response format...');
    console.log('🎬 [Script Enhancer] Contains SCRIPT TITLE:', finalText.includes('=== SCRIPT TITLE ==='));
    console.log('🎬 [Script Enhancer] Contains JSON tags:', finalText.includes('<json>'));
    
    if (finalText.includes('=== SCRIPT TITLE ===') && finalText.includes('<json>')) {
      // Split response into human-readable script and JSON parts
      const jsonStart = finalText.indexOf('<json>');
      const jsonEnd = finalText.indexOf('</json>');
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        humanReadableScript = finalText.substring(0, jsonStart).trim();
        jsonContent = finalText.substring(jsonStart + 6, jsonEnd).trim();
        console.log('🎬 [Script Enhancer] Extracted human-readable script and JSON');
        console.log('🎬 [Script Enhancer] Human-readable script length:', humanReadableScript.length);
        console.log('🎬 [Script Enhancer] JSON content length:', jsonContent.length);
      } else {
        // Fallback: treat entire response as JSON
        jsonContent = finalText;
        console.log('🎬 [Script Enhancer] No JSON tags found, treating entire response as JSON');
      }
    } else {
      // Legacy: treat entire response as JSON
      jsonContent = finalText;
      console.log('🎬 [Script Enhancer] Legacy JSON-only response detected');
      console.log('🎬 [Script Enhancer] Response preview:', finalText.substring(0, 200) + '...');
    }

    // Use robust JSON validation and repair pipeline
    const validationResult = await validateAndRepairJson(jsonContent, async (repairPrompt: string) => {
      console.log('🔧 [JSON Repair] Calling GPT-5 for JSON repair...');
      return await callLLM({
        model: 'gpt-5',
        messages: [
          {
            role: 'system' as const,
            content: 'You are a JSON repair assistant. Fix broken JSON and return only valid JSON wrapped in <json>...</json> tags.'
          },
          {
            role: 'user' as const,
            content: repairPrompt
          }
        ],
        maxTokens: 2000,
        temperature: 0
      });
    });

    console.log('🎬 [Script Enhancer] JSON validation result:', {
      isValid: validationResult.valid,
      repaired: validationResult.repaired,
      error: validationResult.error
    });

    if (!validationResult.valid) {
      console.error('🎬 [Script Enhancer] Raw LLM response that failed:', finalText);
      
      // Create a fallback minimal script if all repair attempts fail
      console.log('🎬 [Script Enhancer] Creating fallback minimal script...');
      const fallbackScript = createFallbackScript(input);
      
      try {
        const backfilled = backfillScriptFields(fallbackScript, input.refiner_extensions?.creative_profile?.profileId || 'educational_explainer', input);
        const validatedScript = ScriptEnhancerOutputSchema.parse(backfilled);
        
        console.log('🎬 [Script Enhancer] Fallback script created successfully');
        
        // Continue with fallback script
        const qualityAssessment = assessScriptQuality(validatedScript, input);
        
        return NextResponse.json({
          success: true,
          script: validatedScript,
          quality_assessment: qualityAssessment,
          metadata: {
            scriptId: `fallback_script_${Date.now()}`,
            profile: input.refiner_extensions?.creative_profile?.profileId || 'general',
            processingTimeMs: Date.now() - startTime,
            timestamp: new Date().toISOString(),
            fallback: true
          }
        });
      } catch (fallbackError) {
        console.error('🎬 [Script Enhancer] Fallback script creation failed:', fallbackError);
        throw new Error(`JSON parsing failed and fallback creation failed: ${validationResult.error}`);
      }
    }

    const scriptJson = validationResult.data as unknown;
    console.log('🎬 [Script Enhancer] Parsed JSON:', JSON.stringify(scriptJson, null, 2).substring(0, 1000) + '...');
    
    let script;
    try {
      const profileIdForDefaults = input.refiner_extensions?.creative_profile?.profileId || 'educational_explainer';
      const backfilled = backfillScriptFields(scriptJson, profileIdForDefaults, input);
      
      // First validate with legacy schema
      const legacyScript = ScriptEnhancerOutputSchema.parse(backfilled);
      
      // Then convert to human-readable format
      const scriptWithHumanReadable = {
        ...legacyScript,
        human_readable_script: humanReadableScript || 'Human-readable script not available'
      };
      
      script = HumanReadableScriptSchema.parse(scriptWithHumanReadable);
    } catch (validationError) {
      console.error('🎬 [Script Enhancer] JSON validation failed:', validationError);
      console.error('🎬 [Script Enhancer] Expected schema fields:', Object.keys(ScriptEnhancerOutputSchema.shape));
      console.error('🎬 [Script Enhancer] Received JSON keys:', Object.keys(scriptJson || {}));
      throw new Error(`Script JSON validation failed: ${validationError.message}`);
    }
    console.log('🎬 [Script Enhancer] Script validation successful');
    
    // Assess script quality
    const qualityAssessment = assessScriptQuality(script, input);
    console.log('🎬 [Script Enhancer] Quality assessment:', {
      overallScore: qualityAssessment.overallScore,
      grade: qualityAssessment.grade,
      issuesCount: qualityAssessment.issues.length,
      recommendationsCount: qualityAssessment.recommendations.length
    });
    
    // Store in Supabase
    const scriptId = `script_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const { error: insertError } = await supabase
      .from('script_enhancer_results')
      .insert({
        id: scriptId,
        created_at: new Date().toISOString(),
        user_prompt: input.user_request.original_prompt,
        profile_id: input.refiner_extensions?.creative_profile?.profileId || 'general',
        duration_seconds: input.user_request.duration_seconds,
        script_data: script,
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
      .channel('script-enhancer-updates')
      .send({
        type: 'broadcast',
        event: 'script-generated',
        payload: {
          scriptId,
          profile: input.refiner_extensions?.creative_profile?.profileId || 'general',
          duration: input.user_request.duration_seconds,
          quality: qualityAssessment.grade
        }
      });

    console.log('🎬 [Script Enhancer] Broadcasted via Realtime');
    
    const processingTime = Date.now() - startTime;
    console.log(`🎬 [Script Enhancer] Script generation completed in ${processingTime}ms`);
    
    // Convert to production JSON for backward compatibility
    const productionJSON = convertHumanReadableToProductionJSON(script);
    
    return NextResponse.json({
      success: true,
      script, // Human-readable script with all metadata
      production_json: productionJSON, // Legacy JSON format for production pipeline
      human_readable_script: script.human_readable_script, // Just the human-readable text
      quality_assessment: qualityAssessment,
      metadata: {
        scriptId,
        profile: input.refiner_extensions?.creative_profile?.profileId || 'general',
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
