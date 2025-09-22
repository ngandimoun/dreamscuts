// services/phase4/enrichedDeterministicParser.ts
import type { ProductionManifest, ScenePlan, SceneEffects } from "../../types/production-manifest";

/**
 * Enhanced Deterministic Parser with Ordering Hints and Layered Effects Sequencing
 * 
 * This extends the existing deterministic parser with:
 * 1. orderingHint auto-assignment (sequential order for Shotstack workers)
 * 2. Layered effects sequencing (smooth transitions and cinematic effects)
 * 3. Timeline continuity (startAtSec flow)
 */

/**
 * Deterministically enrich scenes with:
 *  - timeline continuity (startAtSec)
 *  - orderingHint (sequential order)
 *  - effects sequencing (layered + transitions)
 */
export function enrichScenes(scenes: ScenePlan[]): ScenePlan[] {
  let currentTime = 0;

  return scenes.map((scene, index) => {
    // --- Timeline continuity ---
    const startAtSec = currentTime;
    currentTime += scene.durationSeconds;

    // --- Ordering ---
    const orderingHint = index + 1;

    // --- Effects Sequencing ---
    const effects: SceneEffects = scene.effects || {};

    // Default transitions sequence (rotate to avoid monotony)
    const defaultTransitions = ["fade", "slide_left", "bokeh_transition"];
    const chosenTransition = defaultTransitions[index % defaultTransitions.length];

    // Layered cinematic effects by purpose
    const purposeEffectMap: Record<string, string[]> = {
      hook: ["cinematic_zoom"],
      body: ["parallax_scroll"],
      cta: ["cinematic_zoom", "overlay_text"]
    };

    const layeredEffects =
      scene.purpose && purposeEffectMap[scene.purpose]
        ? purposeEffectMap[scene.purpose]
        : ["cinematic_zoom"];

    return {
      ...scene,
      startAtSec,
      orderingHint,
      effects: {
        transitions: effects.transitions || [chosenTransition],
        layeredEffects: effects.layeredEffects || layeredEffects,
        gradePreset: effects.gradePreset || "neutral_pro"
      }
    };
  });
}

/**
 * Entry point: takes draft manifest and returns enriched manifest
 */
export function applyDeterministicParser(manifest: ProductionManifest): ProductionManifest {
  return {
    ...manifest,
    scenes: enrichScenes(manifest.scenes)
  };
}

/**
 * Enhanced scene enrichment with platform-specific optimizations
 */
export function enrichScenesWithPlatformOptimization(
  scenes: ScenePlan[], 
  platform: string
): ScenePlan[] {
  let currentTime = 0;

  // Platform-specific effect preferences
  const platformEffectMap: Record<string, Record<string, string[]>> = {
    tiktok: {
      hook: ["cinematic_zoom", "bokeh_transition"],
      body: ["slow_pan", "data_highlight"],
      cta: ["text_reveal", "logo_reveal"]
    },
    youtube: {
      hook: ["parallax_scroll", "overlay_text"],
      body: ["slow_pan", "chart_animation"],
      cta: ["crossfade", "logo_reveal"]
    },
    instagram: {
      hook: ["cinematic_zoom", "lens_flare"],
      body: ["slow_pan", "overlay_text"],
      cta: ["bokeh_transition", "text_reveal"]
    }
  };

  // Platform-specific transition preferences
  const platformTransitions: Record<string, string[]> = {
    tiktok: ["bokeh_transition", "slide_up", "fade"],
    youtube: ["crossfade", "slide_left", "fade"],
    instagram: ["fade", "bokeh_transition", "slide_left"]
  };

  return scenes.map((scene, index) => {
    // --- Timeline continuity ---
    const startAtSec = currentTime;
    currentTime += scene.durationSeconds;

    // --- Ordering ---
    const orderingHint = index + 1;

    // --- Platform-specific Effects Sequencing ---
    const effects: SceneEffects = scene.effects || {};

    // Choose transitions based on platform
    const platformTransitionSet = platformTransitions[platform] || ["fade", "slide_left", "bokeh_transition"];
    const chosenTransition = platformTransitionSet[index % platformTransitionSet.length];

    // Choose layered effects based on platform and purpose
    const platformEffects = platformEffectMap[platform] || platformEffectMap.youtube;
    const layeredEffects = scene.purpose && platformEffects[scene.purpose]
      ? platformEffects[scene.purpose]
      : ["cinematic_zoom"];

    return {
      ...scene,
      startAtSec,
      orderingHint,
      effects: {
        transitions: effects.transitions || [chosenTransition],
        layeredEffects: effects.layeredEffects || layeredEffects,
        gradePreset: effects.gradePreset || "neutral_pro"
      }
    };
  });
}

/**
 * Enhanced manifest enrichment with platform optimization
 */
export function applyDeterministicParserWithPlatform(
  manifest: ProductionManifest
): ProductionManifest {
  const platform = manifest.metadata.platform || "youtube";
  
  return {
    ...manifest,
    scenes: enrichScenesWithPlatformOptimization(manifest.scenes, platform)
  };
}

/**
 * Advanced scene enrichment with cinematic complexity levels
 */
export function enrichScenesWithCinematicLevel(
  scenes: ScenePlan[], 
  cinematicLevel: "basic" | "pro" = "basic"
): ScenePlan[] {
  let currentTime = 0;

  // Cinematic complexity mapping
  const cinematicEffectMap: Record<string, Record<string, string[]>> = {
    basic: {
      hook: ["cinematic_zoom"],
      body: ["slow_pan"],
      cta: ["fade"]
    },
    pro: {
      hook: ["cinematic_zoom", "lens_flare", "overlay_text"],
      body: ["parallax_scroll", "data_highlight", "slow_pan"],
      cta: ["bokeh_transition", "text_reveal", "logo_reveal"]
    }
  };

  // Pro-level transition sequences
  const proTransitions = [
    "fade", "slide_left", "bokeh_transition", 
    "crossfade", "slide_up", "parallax_scroll"
  ];

  return scenes.map((scene, index) => {
    // --- Timeline continuity ---
    const startAtSec = currentTime;
    currentTime += scene.durationSeconds;

    // --- Ordering ---
    const orderingHint = index + 1;

    // --- Cinematic Effects Sequencing ---
    const effects: SceneEffects = scene.effects || {};

    // Choose transitions based on cinematic level
    const chosenTransition = cinematicLevel === "pro" 
      ? proTransitions[index % proTransitions.length]
      : ["fade", "slide_left"][index % 2];

    // Choose layered effects based on cinematic level and purpose
    const levelEffects = cinematicEffectMap[cinematicLevel];
    const layeredEffects = scene.purpose && levelEffects[scene.purpose]
      ? levelEffects[scene.purpose]
      : levelEffects.hook || ["cinematic_zoom"];

    return {
      ...scene,
      startAtSec,
      orderingHint,
      effects: {
        transitions: effects.transitions || [chosenTransition],
        layeredEffects: effects.layeredEffects || layeredEffects,
        gradePreset: effects.gradePreset || "neutral_pro"
      }
    };
  });
}

/**
 * Complete manifest enrichment with all enhancements
 */
export function applyCompleteDeterministicParser(
  manifest: ProductionManifest
): ProductionManifest {
  const platform = manifest.metadata.platform || "youtube";
  const cinematicLevel = manifest.metadata.cinematicLevel || "basic";
  
  // If cinematic level is specified, use it; otherwise use platform optimization
  let enrichedScenes;
  if (cinematicLevel !== "basic") {
    enrichedScenes = enrichScenesWithCinematicLevel(manifest.scenes, cinematicLevel);
  } else {
    enrichedScenes = enrichScenesWithPlatformOptimization(manifest.scenes, platform);
  }
  
  return {
    ...manifest,
    scenes: enrichedScenes
  };
}

/**
 * Validate scene enrichment results
 */
export function validateSceneEnrichment(scenes: ScenePlan[]): {
  isValid: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check timeline continuity
  for (let i = 0; i < scenes.length - 1; i++) {
    const currentScene = scenes[i];
    const nextScene = scenes[i + 1];
    
    const currentEnd = currentScene.startAtSec + currentScene.durationSeconds;
    if (currentEnd > nextScene.startAtSec) {
      errors.push(`Scene ${currentScene.id} overlaps with ${nextScene.id}`);
    }
    
    if (currentEnd < nextScene.startAtSec) {
      warnings.push(`Gap between scene ${currentScene.id} and ${nextScene.id}`);
    }
  }

  // Check ordering hints
  const orderingHints = scenes.map(s => s.orderingHint).filter(h => h != null);
  if (orderingHints.length !== scenes.length) {
    errors.push("Some scenes are missing orderingHint");
  }

  // Check if ordering hints are sequential (1, 2, 3, ...)
  const sortedHints = [...orderingHints].sort((a, b) => a! - b!);
  for (let i = 0; i < sortedHints.length; i++) {
    if (sortedHints[i] !== i + 1) {
      errors.push(`OrderingHint sequence is not sequential: expected ${i + 1}, got ${sortedHints[i]}`);
    }
  }
  
  // Also check if the original order matches the expected sequence
  for (let i = 0; i < scenes.length; i++) {
    const expectedHint = i + 1;
    const actualHint = scenes[i].orderingHint;
    if (actualHint !== expectedHint) {
      errors.push(`OrderingHint sequence is not sequential: expected ${expectedHint}, got ${actualHint}`);
    }
  }

  // Check effects
  scenes.forEach(scene => {
    if (!scene.effects) {
      warnings.push(`Scene ${scene.id} has no effects`);
    } else {
      if (!scene.effects.transitions || scene.effects.transitions.length === 0) {
        warnings.push(`Scene ${scene.id} has no transitions`);
      }
      if (!scene.effects.layeredEffects || scene.effects.layeredEffects.length === 0) {
        warnings.push(`Scene ${scene.id} has no layered effects`);
      }
      if (!scene.effects.gradePreset) {
        warnings.push(`Scene ${scene.id} has no grade preset`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    warnings,
    errors
  };
}

/**
 * Get enrichment statistics
 */
export function getEnrichmentStats(scenes: ScenePlan[]): {
  totalScenes: number;
  scenesWithEffects: number;
  scenesWithOrderingHint: number;
  totalDuration: number;
  averageSceneDuration: number;
  effectTypes: Record<string, number>;
  transitionTypes: Record<string, number>;
} {
  const totalScenes = scenes.length;
  const scenesWithEffects = scenes.filter(s => s.effects).length;
  const scenesWithOrderingHint = scenes.filter(s => s.orderingHint != null).length;
  const totalDuration = scenes.reduce((sum, s) => sum + s.durationSeconds, 0);
  const averageSceneDuration = totalScenes > 0 ? totalDuration / totalScenes : 0;

  // Count effect types
  const effectTypes: Record<string, number> = {};
  const transitionTypes: Record<string, number> = {};

  scenes.forEach(scene => {
    if (scene.effects) {
      // Count layered effects
      scene.effects.layeredEffects?.forEach(effect => {
        effectTypes[effect] = (effectTypes[effect] || 0) + 1;
      });

      // Count transitions
      scene.effects.transitions?.forEach(transition => {
        transitionTypes[transition] = (transitionTypes[transition] || 0) + 1;
      });
    }
  });

  return {
    totalScenes,
    scenesWithEffects,
    scenesWithOrderingHint,
    totalDuration,
    averageSceneDuration,
    effectTypes,
    transitionTypes
  };
}
