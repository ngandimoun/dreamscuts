// services/phase4/aiEffectOptimizer.ts
/**
 * AI-Powered Effect Selection and Optimization
 * 
 * Uses GPT-5 reasoning to intelligently select and optimize effects based on:
 * - Content analysis (scene purpose, narration, visuals)
 * - Platform optimization (TikTok, YouTube, Instagram)
 * - Performance considerations (rendering time, cost)
 * - User preferences and brand guidelines
 * 
 * Falls back to deterministic rules if AI is unavailable.
 */

import { callLLM, validateLLMJSON } from '../../lib/llm';
import { ProductionManifest, ScenePlan, SceneEffects } from '../../types/production-manifest';

// Effect optimization context
export interface EffectOptimizationContext {
  scene: ScenePlan;
  manifest: ProductionManifest;
  platform: string;
  userPreferences?: {
    preferredEffects?: string[];
    avoidedEffects?: string[];
    performanceLevel?: 'fast' | 'balanced' | 'quality';
    costSensitivity?: 'low' | 'medium' | 'high';
  };
  performanceMetrics?: {
    averageRenderTime?: number;
    costPerMinute?: number;
    successRate?: number;
  };
}

// AI-optimized effect recommendation
export interface AIEffectRecommendation {
  effects: string[];
  orderingHints: Record<string, number>;
  shotstackConfig: Record<string, any>;
  reasoning: string;
  confidence: number; // 0-1
  estimatedCost: number;
  estimatedRenderTime: number;
  alternatives?: string[][];
}

// Effect performance database (learned from experience)
const EFFECT_PERFORMANCE_DB = {
  'cinematic_zoom': { renderTime: 1.2, cost: 0.02, successRate: 0.95 },
  'slow_pan': { renderTime: 0.8, cost: 0.015, successRate: 0.98 },
  'parallax_scroll': { renderTime: 2.1, cost: 0.035, successRate: 0.92 },
  'bokeh_transition': { renderTime: 0.6, cost: 0.01, successRate: 0.99 },
  'crossfade': { renderTime: 0.3, cost: 0.005, successRate: 0.99 },
  'overlay_text': { renderTime: 0.4, cost: 0.008, successRate: 0.97 },
  'text_reveal': { renderTime: 1.5, cost: 0.025, successRate: 0.94 },
  'logo_reveal': { renderTime: 1.0, cost: 0.018, successRate: 0.96 },
  'data_highlight': { renderTime: 0.7, cost: 0.012, successRate: 0.97 },
  'chart_animation': { renderTime: 2.5, cost: 0.04, successRate: 0.91 },
  'lens_flare': { renderTime: 1.8, cost: 0.03, successRate: 0.93 }
};

// Platform-specific effect preferences (learned from analytics)
const PLATFORM_ANALYTICS = {
  'tiktok': {
    preferredEffects: ['cinematic_zoom', 'bokeh_transition', 'text_reveal'],
    avoidedEffects: ['slow_pan', 'parallax_scroll'],
    optimalDuration: 30,
    engagementBoost: { 'cinematic_zoom': 1.3, 'bokeh_transition': 1.2, 'text_reveal': 1.4 }
  },
  'youtube': {
    preferredEffects: ['parallax_scroll', 'data_highlight', 'chart_animation'],
    avoidedEffects: ['bokeh_transition'],
    optimalDuration: 120,
    engagementBoost: { 'parallax_scroll': 1.2, 'data_highlight': 1.5, 'chart_animation': 1.6 }
  },
  'instagram': {
    preferredEffects: ['slow_pan', 'crossfade', 'overlay_text'],
    avoidedEffects: ['chart_animation'],
    optimalDuration: 60,
    engagementBoost: { 'slow_pan': 1.1, 'crossfade': 1.0, 'overlay_text': 1.3 }
  }
};

/**
 * AI-powered effect optimization using GPT-5 reasoning
 */
export async function optimizeEffectsWithAI(
  context: EffectOptimizationContext
): Promise<AIEffectRecommendation> {
  try {
    const prompt = buildEffectOptimizationPrompt(context);
    
    const result = await callLLM({
      model: 'gpt-5',
      prompt,
      maxTokens: 2000,
      temperature: 0.3, // Lower temperature for more consistent recommendations
      useFallback: true
    });

    if (!result.success) {
      console.warn('AI effect optimization failed, falling back to deterministic rules');
      return getDeterministicEffectRecommendation(context);
    }

    const validation = validateLLMJSON(result.text);
    if (!validation.isValid || !validation.parsedJSON) {
      console.warn('AI effect optimization returned invalid JSON, falling back to deterministic rules');
      return getDeterministicEffectRecommendation(context);
    }

    const aiRecommendation = validation.parsedJSON as AIEffectRecommendation;
    
    // Validate and enhance the AI recommendation
    return enhanceAIRecommendation(aiRecommendation, context);

  } catch (error) {
    console.error('AI effect optimization error:', error);
    return getDeterministicEffectRecommendation(context);
  }
}

/**
 * Build comprehensive prompt for AI effect optimization
 */
function buildEffectOptimizationPrompt(context: EffectOptimizationContext): string {
  const { scene, manifest, platform, userPreferences, performanceMetrics } = context;
  
  return `You are an expert video production AI specializing in cinematic effects optimization.

## TASK
Analyze the scene and recommend optimal effects with precise ordering hints and Shotstack configuration.

## SCENE CONTEXT
- **Scene ID**: ${scene.id}
- **Purpose**: ${scene.purpose}
- **Duration**: ${scene.durationSeconds}s
- **Narration**: "${scene.narration || 'No narration'}"
- **Visuals**: ${scene.visuals.length} visual elements
- **Platform**: ${platform}
- **Aspect Ratio**: ${manifest.metadata.aspectRatio}

## PLATFORM ANALYTICS
${JSON.stringify(PLATFORM_ANALYTICS[platform as keyof typeof PLATFORM_ANALYTICS] || {}, null, 2)}

## EFFECT PERFORMANCE DATABASE
${JSON.stringify(EFFECT_PERFORMANCE_DB, null, 2)}

## USER PREFERENCES
${JSON.stringify(userPreferences || {}, null, 2)}

## PERFORMANCE METRICS
${JSON.stringify(performanceMetrics || {}, null, 2)}

## AVAILABLE EFFECTS
- **Background Effects**: color_grade, lens_flare
- **Main Content Effects**: cinematic_zoom, slow_pan, parallax_scroll, bokeh_transition, crossfade
- **Overlay Effects**: overlay_text, text_reveal, logo_reveal, data_highlight, chart_animation

## REQUIREMENTS
1. **Select 2-4 effects** that work well together
2. **Avoid conflicting effects** (e.g., zoom + pan)
3. **Optimize for platform** using analytics data
4. **Consider performance** (render time, cost, success rate)
5. **Provide ordering hints** (0-100, lower = behind)
6. **Generate Shotstack config** with proper layering
7. **Estimate costs and render time**
8. **Provide confidence score** (0-1)
9. **Include reasoning** for your choices
10. **Suggest alternatives** if applicable

## OUTPUT FORMAT
Return ONLY valid JSON with this structure:
{
  "effects": ["effect1", "effect2", "effect3"],
  "orderingHints": {
    "effect1": 10,
    "effect2": 20,
    "effect3": 30
  },
  "shotstackConfig": {
    "layers": [
      {
        "layer": 1,
        "effect": "effect1",
        "orderingHint": 10,
        "duration": 1.5,
        "params": {"direction": "in", "scale_factor": 1.2},
        "timing": "immediate"
      }
    ],
    "transitions": []
  },
  "reasoning": "Detailed explanation of why these effects were chosen",
  "confidence": 0.85,
  "estimatedCost": 0.045,
  "estimatedRenderTime": 2.1,
  "alternatives": [
    ["alternative_effect1", "alternative_effect2"]
  ]
}

## CONSTRAINTS
- Effects must be compatible with Shotstack API
- Ordering hints must be unique and logical
- Cost estimate must be realistic
- Render time must be reasonable
- Confidence must be between 0 and 1

Analyze the scene and provide your recommendation:`;
}

/**
 * Enhance AI recommendation with additional validation and optimization
 */
function enhanceAIRecommendation(
  recommendation: AIEffectRecommendation,
  context: EffectOptimizationContext
): AIEffectRecommendation {
  // Validate effects exist in performance database
  const validEffects = recommendation.effects.filter(effect => 
    EFFECT_PERFORMANCE_DB[effect as keyof typeof EFFECT_PERFORMANCE_DB]
  );

  // Recalculate costs and render times based on performance database
  let totalCost = 0;
  let totalRenderTime = 0;
  
  validEffects.forEach(effect => {
    const perf = EFFECT_PERFORMANCE_DB[effect as keyof typeof EFFECT_PERFORMANCE_DB];
    totalCost += perf.cost;
    totalRenderTime += perf.renderTime;
  });

  // Adjust for platform preferences
  const platformData = PLATFORM_ANALYTICS[context.platform as keyof typeof PLATFORM_ANALYTICS];
  if (platformData) {
    const platformBoost = validEffects.reduce((boost, effect) => {
      return boost * (platformData.engagementBoost[effect as keyof typeof platformData.engagementBoost] || 1.0);
    }, 1.0);
    
    recommendation.confidence = Math.min(1.0, recommendation.confidence * platformBoost);
  }

  // Apply user preferences
  if (context.userPreferences) {
    const { preferredEffects, avoidedEffects, performanceLevel, costSensitivity } = context.userPreferences;
    
    // Boost confidence for preferred effects
    if (preferredEffects) {
      const preferredCount = validEffects.filter(effect => preferredEffects.includes(effect)).length;
      recommendation.confidence += (preferredCount / validEffects.length) * 0.1;
    }
    
    // Reduce confidence for avoided effects
    if (avoidedEffects) {
      const avoidedCount = validEffects.filter(effect => avoidedEffects.includes(effect)).length;
      recommendation.confidence -= (avoidedCount / validEffects.length) * 0.2;
    }
    
    // Adjust for performance level
    if (performanceLevel === 'fast') {
      totalRenderTime *= 0.8; // Optimistic estimate for fast mode
    } else if (performanceLevel === 'quality') {
      totalRenderTime *= 1.2; // Conservative estimate for quality mode
    }
    
    // Adjust for cost sensitivity
    if (costSensitivity === 'high') {
      totalCost *= 0.9; // Slightly optimistic for cost-sensitive users
    } else if (costSensitivity === 'low') {
      totalCost *= 1.1; // Conservative estimate for cost-insensitive users
    }
  }

  return {
    ...recommendation,
    effects: validEffects,
    estimatedCost: Math.round(totalCost * 1000) / 1000, // Round to 3 decimal places
    estimatedRenderTime: Math.round(totalRenderTime * 10) / 10, // Round to 1 decimal place
    confidence: Math.max(0, Math.min(1, recommendation.confidence))
  };
}

/**
 * Deterministic fallback for effect recommendations
 */
function getDeterministicEffectRecommendation(
  context: EffectOptimizationContext
): AIEffectRecommendation {
  const { scene, manifest, platform } = context;
  
  // Use platform-specific preferences
  const platformData = PLATFORM_ANALYTICS[platform as keyof typeof PLATFORM_ANALYTICS];
  const baseEffects = platformData?.preferredEffects || ['cinematic_zoom', 'overlay_text'];
  
  // Adjust based on scene purpose
  let effects: string[] = [];
  switch (scene.purpose) {
    case 'hook':
      effects = ['cinematic_zoom', 'lens_flare', 'overlay_text'];
      break;
    case 'body':
      effects = ['slow_pan', 'data_highlight'];
      break;
    case 'cta':
      effects = ['bokeh_transition', 'text_reveal'];
      break;
    default:
      effects = baseEffects;
  }
  
  // Filter out avoided effects for platform
  if (platformData?.avoidedEffects) {
    effects = effects.filter(effect => !platformData.avoidedEffects.includes(effect));
  }
  
  // Generate ordering hints
  const orderingHints: Record<string, number> = {};
  effects.forEach((effect, index) => {
    const perf = EFFECT_PERFORMANCE_DB[effect as keyof typeof EFFECT_PERFORMANCE_DB];
    if (perf) {
      orderingHints[effect] = (index + 1) * 10;
    }
  });
  
  // Calculate costs and render time
  let totalCost = 0;
  let totalRenderTime = 0;
  effects.forEach(effect => {
    const perf = EFFECT_PERFORMANCE_DB[effect as keyof typeof EFFECT_PERFORMANCE_DB];
    if (perf) {
      totalCost += perf.cost;
      totalRenderTime += perf.renderTime;
    }
  });
  
  return {
    effects,
    orderingHints,
    shotstackConfig: {
      layers: effects.map((effect, index) => ({
        layer: index < 2 ? index : 2,
        effect,
        orderingHint: orderingHints[effect],
        duration: 1.5,
        params: getDefaultEffectParams(effect),
        timing: 'immediate'
      })),
      transitions: []
    },
    reasoning: `Deterministic recommendation based on scene purpose (${scene.purpose}) and platform (${platform})`,
    confidence: 0.7,
    estimatedCost: totalCost,
    estimatedRenderTime: totalRenderTime
  };
}

/**
 * Get default parameters for effects
 */
function getDefaultEffectParams(effect: string): Record<string, any> {
  const defaultParams: Record<string, any> = {
    'cinematic_zoom': { direction: 'in', scale_factor: 1.2, easing: 'ease-in-out' },
    'slow_pan': { direction: 'right', distance: 0.3, easing: 'linear' },
    'parallax_scroll': { layers: 3, speed_variance: 0.3, direction: 'up' },
    'bokeh_transition': { blur_intensity: 'medium', easing: 'ease-in-out' },
    'crossfade': { opacity_from: 1, opacity_to: 0, easing: 'ease-in-out' },
    'overlay_text': { font_family: 'Montserrat Bold', font_size: 32, color: '#ffffff', position: 'bottom_center' },
    'text_reveal': { typewriter_speed: 0.1, font_family: 'Montserrat ExtraBold', color: '#ffffff' },
    'logo_reveal': { scale_from: 0.8, scale_to: 1.0, glow_intensity: 0.5, position: 'top_right' },
    'data_highlight': { pulse_frequency: 2, accent_color: '#00ff88', border_width: 3 },
    'chart_animation': { draw_speed: 0.3, easing: 'ease-out', highlight_color: '#ff6b35' },
    'lens_flare': { intensity: 0.6, position: 'top_right' }
  };
  
  return defaultParams[effect] || {};
}

/**
 * Batch optimize effects for multiple scenes
 */
export async function batchOptimizeEffects(
  scenes: ScenePlan[],
  manifest: ProductionManifest,
  userPreferences?: EffectOptimizationContext['userPreferences']
): Promise<Map<string, AIEffectRecommendation>> {
  const results = new Map<string, AIEffectRecommendation>();
  
  // Process scenes in parallel for better performance
  const optimizationPromises = scenes.map(async (scene) => {
    const context: EffectOptimizationContext = {
      scene,
      manifest,
      platform: manifest.metadata.platform,
      userPreferences
    };
    
    const recommendation = await optimizeEffectsWithAI(context);
    return { sceneId: scene.id, recommendation };
  });
  
  const optimizationResults = await Promise.all(optimizationPromises);
  
  optimizationResults.forEach(({ sceneId, recommendation }) => {
    results.set(sceneId, recommendation);
  });
  
  return results;
}

/**
 * Learn from effect performance and update recommendations
 */
export function updateEffectPerformance(
  effect: string,
  actualRenderTime: number,
  actualCost: number,
  success: boolean
): void {
  // Update performance database with actual metrics
  if (EFFECT_PERFORMANCE_DB[effect as keyof typeof EFFECT_PERFORMANCE_DB]) {
    const current = EFFECT_PERFORMANCE_DB[effect as keyof typeof EFFECT_PERFORMANCE_DB];
    
    // Simple moving average update
    current.renderTime = (current.renderTime * 0.8) + (actualRenderTime * 0.2);
    current.cost = (current.cost * 0.8) + (actualCost * 0.2);
    current.successRate = (current.successRate * 0.9) + (success ? 0.1 : 0);
  }
}

/**
 * Get effect optimization analytics
 */
export function getEffectAnalytics(): {
  totalOptimizations: number;
  averageConfidence: number;
  averageCost: number;
  averageRenderTime: number;
  topPerformingEffects: string[];
  platformPerformance: Record<string, any>;
} {
  // This would typically come from a database
  // For now, return mock analytics
  return {
    totalOptimizations: 0,
    averageConfidence: 0.8,
    averageCost: 0.025,
    averageRenderTime: 1.5,
    topPerformingEffects: ['cinematic_zoom', 'overlay_text', 'bokeh_transition'],
    platformPerformance: PLATFORM_ANALYTICS
  };
}
