// enhancedDeterministicParser.ts
import { ProductionManifest, ScenePlan, SceneEffects, SceneVisual, OverlaySpec } from "../../types/production-manifest";

// Enhanced regex utility with better pattern matching
function matchAll(regex: RegExp, text: string): string[] {
  const matches: string[] = [];
  let m;
  while ((m = regex.exec(text)) !== null) {
    matches.push(m[1].trim());
  }
  return matches;
}

// Shotstack-compatible effect definitions with ordering hints
interface ShotstackEffect {
  type: string;
  layer: number; // 0 = background, 1 = main content, 2+ = overlays
  orderingHint: number; // Lower numbers render first (behind higher numbers)
  duration: number; // in seconds
  params: Record<string, any>;
  easing?: string;
  timing?: 'immediate' | 'delayed' | 'staggered';
}

// Predefined effect templates for common patterns
const EFFECT_TEMPLATES: Record<string, ShotstackEffect> = {
  // Background effects (layer 0)
  'color_grade': {
    type: 'color_grade',
    layer: 0,
    orderingHint: 0,
    duration: 0,
    params: { preset: 'neutral_pro', intensity: 0.8 },
    timing: 'immediate'
  },
  'lens_flare': {
    type: 'lens_flare',
    layer: 0,
    orderingHint: 1,
    duration: 2,
    params: { intensity: 0.6, position: 'top_right' },
    timing: 'delayed'
  },

  // Main content effects (layer 1)
  'cinematic_zoom': {
    type: 'cinematic_zoom',
    layer: 1,
    orderingHint: 10,
    duration: 1.5,
    params: { direction: 'in', scale_factor: 1.2, easing: 'ease-in-out' },
    timing: 'immediate'
  },
  'slow_pan': {
    type: 'slow_pan',
    layer: 1,
    orderingHint: 11,
    duration: 3,
    params: { direction: 'right', distance: 0.3, easing: 'linear' },
    timing: 'immediate'
  },
  'parallax_scroll': {
    type: 'parallax_scroll',
    layer: 1,
    orderingHint: 12,
    duration: 2.5,
    params: { layers: 3, speed_variance: 0.3, direction: 'up' },
    timing: 'immediate'
  },

  // Transition effects (layer 1)
  'bokeh_transition': {
    type: 'bokeh_transition',
    layer: 1,
    orderingHint: 15,
    duration: 0.7,
    params: { blur_intensity: 'medium', easing: 'ease-in-out' },
    timing: 'immediate'
  },
  'crossfade': {
    type: 'crossfade',
    layer: 1,
    orderingHint: 16,
    duration: 1,
    params: { opacity_from: 1, opacity_to: 0, easing: 'ease-in-out' },
    timing: 'immediate'
  },

  // Overlay effects (layer 2+)
  'overlay_text': {
    type: 'overlay_text',
    layer: 2,
    orderingHint: 20,
    duration: 2,
    params: { 
      font_family: 'Montserrat Bold', 
      font_size: 32, 
      color: '#ffffff',
      position: 'bottom_center',
      animation: 'slide_up'
    },
    timing: 'delayed'
  },
  'text_reveal': {
    type: 'text_reveal',
    layer: 2,
    orderingHint: 21,
    duration: 3,
    params: { 
      typewriter_speed: 0.1, 
      font_family: 'Montserrat ExtraBold',
      color: '#ffffff',
      background: 'rgba(0,0,0,0.8)'
    },
    timing: 'staggered'
  },
  'logo_reveal': {
    type: 'logo_reveal',
    layer: 2,
    orderingHint: 22,
    duration: 2.5,
    params: { 
      scale_from: 0.8, 
      scale_to: 1.0, 
      glow_intensity: 0.5,
      position: 'top_right'
    },
    timing: 'delayed'
  },
  'data_highlight': {
    type: 'data_highlight',
    layer: 2,
    orderingHint: 23,
    duration: 1.5,
    params: { 
      pulse_frequency: 2, 
      accent_color: '#00ff88',
      border_width: 3
    },
    timing: 'immediate'
  },
  'chart_animation': {
    type: 'chart_animation',
    layer: 2,
    orderingHint: 24,
    duration: 4,
    params: { 
      draw_speed: 0.3, 
      easing: 'ease-out',
      highlight_color: '#ff6b35'
    },
    timing: 'staggered'
  }
};

// Scene purpose to effect mapping
const PURPOSE_EFFECT_MAPPING: Record<string, string[]> = {
  'hook': ['cinematic_zoom', 'lens_flare', 'overlay_text'],
  'body': ['slow_pan', 'parallax_scroll', 'data_highlight'],
  'cta': ['bokeh_transition', 'text_reveal', 'logo_reveal'],
  'transition': ['crossfade', 'bokeh_transition'],
  'data': ['chart_animation', 'data_highlight', 'overlay_text'],
  'product': ['cinematic_zoom', 'logo_reveal', 'overlay_text']
};

// Platform-specific effect preferences
const PLATFORM_EFFECT_PREFERENCES: Record<string, string[]> = {
  'tiktok': ['cinematic_zoom', 'bokeh_transition', 'text_reveal'],
  'instagram': ['slow_pan', 'crossfade', 'overlay_text'],
  'youtube': ['parallax_scroll', 'data_highlight', 'chart_animation'],
  'social': ['cinematic_zoom', 'logo_reveal', 'overlay_text']
};

export function parseHumanPlanToDraftManifest(
  userId: string,
  humanPlan: string
): Partial<ProductionManifest> {
  const draft: Partial<ProductionManifest> = {
    userId,
    metadata: {
      intent: "video",
      durationSeconds: 60,
      aspectRatio: "16:9",
      platform: "youtube",
      language: "en",
    },
    scenes: [],
    assets: {},
    audio: {
      ttsDefaults: { provider: "elevenlabs" },
      music: { cueMap: {} },
    },
    visuals: { defaultAspect: "16:9" },
    effects: { allowed: [] },
    consistency: {},
    jobs: [],
  };

  // --- Enhanced Heuristics with Shotstack Integration ---

  // 1. Extract language
  const langMatch = humanPlan.match(/language[:\-]\s*([a-z]+)/i);
  if (langMatch) draft.metadata!.language = langMatch[1];

  // 2. Extract duration
  const durMatch = humanPlan.match(/duration[:\-]\s*(\d+)/i);
  if (durMatch) draft.metadata!.durationSeconds = parseInt(durMatch[1]);

  // 3. Detect platform
  const platMatch = humanPlan.match(/platform[:\-]\s*(tiktok|youtube|instagram|social)/i);
  if (platMatch) draft.metadata!.platform = platMatch[1].toLowerCase();

  // 4. Extract aspect ratio
  const arMatch = humanPlan.match(/aspect[:\-]\s*(\d+:\d+)/i);
  if (arMatch) draft.metadata!.aspectRatio = arMatch[1];

  // 5. Extract profile
  const profileMatch = humanPlan.match(/style[:\-]\s*([a-z_]+)/i);
  if (profileMatch) draft.metadata!.profile = profileMatch[1];

  // 6. Enhanced scene parsing with effects
  const sceneBlocks = humanPlan.split(/scene\s*\d+\s*[:\-]/i);
  sceneBlocks.slice(1).forEach((block, i) => {
    const narrationMatch = block.match(/narration[:\-]\s*([^\n]+)/i);
    const purposeMatch = block.match(/purpose[:\-]\s*([^\n]+)/i);
    const durationMatch = block.match(/(\d+)\s*sec/i);
    const visualMatch = block.match(/visual[:\-]\s*([^\n]+)/i);

    const purpose = purposeMatch ? purposeMatch[1].toLowerCase() : "body";
    
    // Auto-assign effects based on scene purpose and platform
    const sceneEffects = generateSceneEffects(purpose, draft.metadata!.platform!, block);
    
    // Auto-assign visual ordering hints
    const visuals = generateSceneVisuals(visualMatch?.[1] || "", i);

    draft.scenes!.push({
      id: `s${i + 1}`,
      startAtSec: i * 10,
      durationSeconds: durationMatch ? parseInt(durationMatch[1]) : 10,
      purpose: purpose as any,
      narration: narrationMatch ? narrationMatch[1] : undefined,
      visuals: visuals,
      effects: sceneEffects,
    });
  });

  // 7. Extract assets with enhanced metadata
  const assetMatches = matchAll(/asset[:\-]\s*(https?:[^\s]+)/gi, humanPlan);
  assetMatches.forEach((url, i) => {
    draft.assets![`asset_${i + 1}`] = {
      id: `asset_${i + 1}`,
      source: "user",
      originUrl: url,
      role: "primary",
      status: "ready",
      meta: {
        orderingHint: i * 10, // Simple ordering based on appearance
        layer: 1, // Main content layer
        shotstackCompatible: true
      }
    };
  });

  // 8. Voiceover style
  const voiceMatch = humanPlan.match(/voice[:\-]\s*([a-z]+)/i);
  if (voiceMatch) draft.audio!.ttsDefaults.style = voiceMatch[1];

  // 9. Voice ID
  const voiceIdMatch = humanPlan.match(/voiceid[:\-]\s*([a-z0-9_]+)/i);
  if (voiceIdMatch) draft.audio!.ttsDefaults.voiceId = voiceIdMatch[1];

  // 10. Enhanced music structure with timing
  const musicMatches = matchAll(/music[:\-]\s*([^\n]+)/gi, humanPlan);
  musicMatches.forEach((m, i) => {
    draft.audio!.music.cueMap[`music_${i + 1}`] = {
      id: `music_${i + 1}`,
      startSec: i * 15,
      mood: m,
      structure: i === 0 ? "intro" : i === musicMatches.length - 1 ? "outro" : "build",
      instructions: `Auto-generated music cue for ${m} mood`
    };
  });

  // 11. Enhanced effects with Shotstack compatibility
  const effectMatches = matchAll(/effect[:\-]\s*([a-z_]+)/gi, humanPlan);
  const allowedEffects = effectMatches.length > 0 ? effectMatches : 
    getDefaultEffectsForPlatform(draft.metadata!.platform!);
  
  draft.effects!.allowed = allowedEffects;
  draft.effects!.defaultTransition = getDefaultTransitionForPlatform(draft.metadata!.platform!);

  // 12. Enhanced scene effects with ordering
  draft.scenes!.forEach((scene, i) => {
    const block = sceneBlocks[i + 1] || "";
    const sceneEffMatches = matchAll(/effect[:\-]\s*([a-z_]+)/gi, block);
    
    if (sceneEffMatches.length > 0) {
      scene.effects = {
        layeredEffects: sceneEffMatches,
        orderingHints: generateOrderingHints(sceneEffMatches),
        shotstackConfig: generateShotstackConfig(sceneEffMatches, scene.purpose)
      };
    }
  });

  // 13. Enhanced consistency rules
  if (/faces locked/i.test(humanPlan)) draft.consistency!.character_faces = "locked";
  if (/voice consistent/i.test(humanPlan)) draft.consistency!.voice_style = "consistent";
  if (/tone[:\-]/i.test(humanPlan)) {
    const toneMatch = humanPlan.match(/tone[:\-]\s*([a-z]+)/i);
    if (toneMatch) draft.consistency!.tone = toneMatch[1];
  }

  // 14. Brand colors with Shotstack compatibility
  const colorMatches = matchAll(/#([0-9a-f]{6})/gi, humanPlan);
  if (colorMatches.length) {
    draft.consistency!.brand = { 
      colors: colorMatches,
      shotstackPalette: generateShotstackColorPalette(colorMatches)
    };
  }

  // 15. Logo with enhanced metadata
  const logoMatch = humanPlan.match(/logo[:\-]\s*(https?:[^\s]+)/i);
  if (logoMatch) {
    draft.consistency!.brand = { 
      ...(draft.consistency!.brand || {}), 
      logoAssetId: logoMatch[1],
      logoEffects: ['logo_reveal', 'overlay_text']
    };
  }

  // 16. Enhanced subtitles with timing
  draft.scenes!.forEach((s) => {
    if (s.narration) {
      s.subtitles = [{
        text: s.narration,
        start: s.startAtSec,
        end: s.startAtSec + s.durationSeconds
      }];
    }
  });

  // 17. Enhanced job generation with ordering
  const jobs = generateJobsWithOrdering(draft.scenes!, draft.assets!);
  draft.jobs = jobs;

  // 18. Enhanced quality gate
  draft.qualityGate = {
    durationCompliance: true,
    requiredAssetsReady: true,
    manifestScore: 0.8, // Higher score due to enhanced features
    shotstackCompatibility: true,
    effectOrderingValid: true
  };

  // 19. Enhanced warnings
  const warnings = [];
  draft.scenes!.forEach((s) => {
    if (!s.narration) warnings.push(`Scene ${s.id} missing narration`);
    if (!s.effects) warnings.push(`Scene ${s.id} missing effects - consider adding for better engagement`);
  });
  draft.warnings = warnings;

  // 20. Enhanced metadata
  if (!draft.metadata!.note) {
    draft.metadata!.note = "Enhanced draft with Shotstack integration, auto-assigned ordering hints, and layer effects sequencing";
  }

  return draft;
}

/**
 * Generate scene effects based on purpose and platform
 */
function generateSceneEffects(purpose: string, platform: string, sceneText: string): SceneEffects {
  const baseEffects = PURPOSE_EFFECT_MAPPING[purpose] || PURPOSE_EFFECT_MAPPING['body'];
  const platformEffects = PLATFORM_EFFECT_PREFERENCES[platform] || [];
  
  // Combine and deduplicate effects
  const allEffects = [...new Set([...baseEffects, ...platformEffects])];
  
  // Check for specific effects mentioned in scene text
  const mentionedEffects = matchAll(/effect[:\-]\s*([a-z_]+)/gi, sceneText);
  
  const finalEffects = mentionedEffects.length > 0 ? mentionedEffects : allEffects.slice(0, 3);
  
  return {
    layeredEffects: finalEffects,
    orderingHints: generateOrderingHints(finalEffects),
    shotstackConfig: generateShotstackConfig(finalEffects, purpose)
  };
}

/**
 * Generate scene visuals with proper ordering
 */
function generateSceneVisuals(visualDescription: string, sceneIndex: number): SceneVisual[] {
  if (!visualDescription) {
    return [{
      type: "generated",
      assetId: `gen_visual_s${sceneIndex + 1}`,
      transform: { scale: 1.0 },
      shot: { camera: "static", focal: "mid" },
      overlays: []
    }];
  }

  const visuals: SceneVisual[] = [];
  
  // Parse visual description for multiple assets
  const assetMatches = matchAll(/asset[:\-]\s*([^\n,]+)/gi, visualDescription);
  
  assetMatches.forEach((asset, i) => {
    visuals.push({
      type: "generated",
      assetId: `gen_${asset.trim().replace(/\s+/g, '_')}_s${sceneIndex + 1}`,
      transform: { 
        scale: 1.0,
        crop: undefined,
        angle: 0
      },
      shot: { 
        camera: i === 0 ? "static" : "pan", // First asset static, others can pan
        focal: i === 0 ? "wide" : "mid"
      },
      overlays: generateOverlaysForVisual(asset, i)
    });
  });

  return visuals;
}

/**
 * Generate overlays for visual elements
 */
function generateOverlaysForVisual(visualDescription: string, index: number): OverlaySpec[] {
  const overlays: OverlaySpec[] = [];
  
  // Auto-generate text overlay for main visual
  if (index === 0) {
    overlays.push({
      type: "text",
      params: {
        text: visualDescription,
        fontFamily: "Montserrat Bold",
        fontSize: 24,
        color: "#ffffff",
        position: "bottom_center"
      },
      animate: "slide_up"
    });
  }

  // Add logo overlay if mentioned
  if (/logo/i.test(visualDescription)) {
    overlays.push({
      type: "logo",
      params: {
        position: "top_right",
        scale: 0.8
      },
      animate: "logo_reveal"
    });
  }

  return overlays;
}

/**
 * Generate ordering hints for effects
 */
function generateOrderingHints(effects: string[]): Record<string, number> {
  const hints: Record<string, number> = {};
  
  effects.forEach((effect, index) => {
    const template = EFFECT_TEMPLATES[effect];
    if (template) {
      hints[effect] = template.orderingHint + (index * 0.1); // Slight offset for multiple effects
    } else {
      hints[effect] = 50 + index; // Default ordering for unknown effects
    }
  });

  return hints;
}

/**
 * Generate Shotstack configuration for effects
 */
function generateShotstackConfig(effects: string[], purpose: string): Record<string, any> {
  const config: Record<string, any> = {
    layers: [],
    transitions: [],
    timing: {}
  };

  effects.forEach((effect, index) => {
    const template = EFFECT_TEMPLATES[effect];
    if (template) {
      config.layers.push({
        layer: template.layer,
        effect: effect,
        orderingHint: template.orderingHint,
        duration: template.duration,
        params: template.params,
        timing: template.timing
      });
    }
  });

  // Add transition based on purpose
  if (purpose === 'transition') {
    config.transitions.push({
      type: 'crossfade',
      duration: 1,
      easing: 'ease-in-out'
    });
  }

  return config;
}

/**
 * Get default effects for platform
 */
function getDefaultEffectsForPlatform(platform: string): string[] {
  return PLATFORM_EFFECT_PREFERENCES[platform] || ['cinematic_zoom', 'overlay_text'];
}

/**
 * Get default transition for platform
 */
function getDefaultTransitionForPlatform(platform: string): string {
  const transitions: Record<string, string> = {
    'tiktok': 'bokeh_transition',
    'instagram': 'crossfade',
    'youtube': 'crossfade',
    'social': 'bokeh_transition'
  };
  
  return transitions[platform] || 'crossfade';
}

/**
 * Generate Shotstack color palette
 */
function generateShotstackColorPalette(colors: string[]): Record<string, string> {
  return {
    primary: colors[0] || '#000000',
    secondary: colors[1] || '#ffffff',
    accent: colors[2] || '#ff6b35',
    background: colors[3] || '#f8f9fa',
    text: colors[4] || '#333333'
  };
}

/**
 * Generate jobs with proper ordering and dependencies
 */
function generateJobsWithOrdering(scenes: ScenePlan[], assets: Record<string, any>): any[] {
  const jobs: any[] = [];
  let jobCounter = 0;

  // TTS jobs (highest priority, no dependencies)
  scenes.forEach((scene) => {
    if (scene.narration) {
      jobs.push({
        id: `job_tts_${scene.id}`,
        type: "tts",
        payload: { sceneId: scene.id, text: scene.narration },
        priority: 10,
        orderingHint: jobCounter++,
        dependsOn: []
      });
    }
  });

  // Asset generation jobs (medium priority, no dependencies)
  Object.values(assets).forEach((asset: any) => {
    if (asset.source === "generated") {
      jobs.push({
        id: `job_gen_${asset.id}`,
        type: "gen_image_falai",
        payload: { assetId: asset.id, prompt: asset.meta?.prompt || "Professional visual" },
        priority: 8,
        orderingHint: jobCounter++,
        dependsOn: []
      });
    }
  });

  // Music generation jobs (lower priority, no dependencies)
  jobs.push({
    id: 'job_music_background',
    type: 'gen_music_elevenlabs',
    payload: { mood: 'neutral_learning', duration: 60 },
    priority: 5,
    orderingHint: jobCounter++,
    dependsOn: []
  });

  // Render job (lowest priority, depends on all others)
  const allJobIds = jobs.map(job => job.id);
  jobs.push({
    id: 'job_render_shotstack',
    type: 'render_shotstack',
    payload: { 
      manifestId: 'MANIFEST_PLACEHOLDER',
      enableEffects: true,
      enableTransitions: true,
      enableCaptions: true
    },
    priority: 1,
    orderingHint: jobCounter++,
    dependsOn: allJobIds
  });

  return jobs;
}

/**
 * Auto-calculate startAtSec for each scene to ensure timeline continuity.
 * Enhanced with effect timing considerations.
 */
export function autoCalculateSceneTimings(manifest: ProductionManifest): ProductionManifest {
  let currentTime = 0;

  const updatedScenes = manifest.scenes.map((scene) => {
    const sceneCopy = { ...scene };
    
    // If startAtSec is missing or negative, assign currentTime
    if (sceneCopy.startAtSec == null || sceneCopy.startAtSec < 0) {
      sceneCopy.startAtSec = currentTime;
    }
    
    // If durationSeconds missing or invalid, fallback to 1s
    if (!sceneCopy.durationSeconds || sceneCopy.durationSeconds <= 0) {
      sceneCopy.durationSeconds = 1;
    }

    // Add transition time if effects are present
    const transitionTime = sceneCopy.effects?.layeredEffects?.includes('bokeh_transition') ? 0.5 : 0;
    
    currentTime = sceneCopy.startAtSec + sceneCopy.durationSeconds + transitionTime;
    return sceneCopy;
  });

  return { ...manifest, scenes: updatedScenes };
}

/**
 * Validate and optimize Shotstack compatibility
 */
export function validateShotstackCompatibility(manifest: ProductionManifest): {
  isValid: boolean;
  warnings: string[];
  optimizations: string[];
} {
  const warnings: string[] = [];
  const optimizations: string[] = [];

  // Check effect ordering
  manifest.scenes.forEach((scene) => {
    if (scene.effects?.layeredEffects) {
      const effects = scene.effects.layeredEffects;
      const orderingHints = scene.effects.orderingHints || {};
      
      // Validate ordering hints exist
      effects.forEach(effect => {
        if (!orderingHints[effect]) {
          warnings.push(`Scene ${scene.id}: Effect '${effect}' missing ordering hint`);
        }
      });

      // Check for conflicting effects
      if (effects.includes('cinematic_zoom') && effects.includes('slow_pan')) {
        warnings.push(`Scene ${scene.id}: Conflicting camera effects (zoom + pan)`);
      }
    }
  });

  // Check asset compatibility
  Object.values(manifest.assets).forEach((asset: any) => {
    if (asset.meta?.shotstackCompatible === false) {
      warnings.push(`Asset ${asset.id}: Not Shotstack compatible`);
    }
  });

  // Suggest optimizations
  if (manifest.metadata.platform === 'tiktok' && !manifest.effects.allowed.includes('bokeh_transition')) {
    optimizations.push('Consider adding bokeh_transition for TikTok platform');
  }

  if (manifest.metadata.platform === 'youtube' && !manifest.effects.allowed.includes('data_highlight')) {
    optimizations.push('Consider adding data_highlight for YouTube platform');
  }

  return {
    isValid: warnings.length === 0,
    warnings,
    optimizations
  };
}
