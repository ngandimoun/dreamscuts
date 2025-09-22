/**
 * Conflict Resolution Policy for Profile-Pipeline Integration
 * 
 * This module provides centralized conflict resolution between creative profiles,
 * workflow recipes, and worker enhancements to prevent override wars and crashes.
 */

import { ProfileContext, HardConstraints } from '../../types/production-manifest';

export interface ConflictResolutionResult {
  success: boolean;
  warnings: string[];
  clampedValues: Record<string, any>;
  droppedEnhancements: string[];
}

export interface ConflictResolutionOptions {
  enforcementMode: 'strict' | 'balanced' | 'creative';
  enhancementPolicy: 'additive' | 'transform_lite';
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * Centralized conflict resolution policy
 * - Clamps or drops conflicting enhancements
 * - Logs all constraint violations
 * - Prevents override wars between profiles and workers
 */
export class ConflictResolver {
  private options: ConflictResolutionOptions;

  constructor(options: ConflictResolutionOptions) {
    this.options = options;
  }

  /**
   * Resolve conflicts between profile constraints and worker enhancements
   */
  resolveConflicts(
    profileContext: ProfileContext,
    hardConstraints: HardConstraints,
    workerEnhancements: Record<string, any>
  ): ConflictResolutionResult {
    const result: ConflictResolutionResult = {
      success: true,
      warnings: [],
      clampedValues: {},
      droppedEnhancements: []
    };

    // Apply style constraints
    if (hardConstraints.style) {
      this.resolveStyleConflicts(hardConstraints.style, workerEnhancements, result);
    }

    // Apply effects constraints
    if (hardConstraints.effects) {
      this.resolveEffectsConflicts(hardConstraints.effects, workerEnhancements, result);
    }

    // Apply audio style constraints
    if (hardConstraints.audioStyle) {
      this.resolveAudioStyleConflicts(hardConstraints.audioStyle, workerEnhancements, result);
    }

    // Apply pacing constraints
    if (hardConstraints.pacing) {
      this.resolvePacingConflicts(hardConstraints.pacing, workerEnhancements, result);
    }

    // Apply enhancement policy constraints
    this.resolveEnhancementPolicyConflicts(profileContext, workerEnhancements, result);

    return result;
  }

  /**
   * Resolve style conflicts (colors, fonts, visual style)
   */
  private resolveStyleConflicts(
    styleConstraints: HardConstraints['style'],
    workerEnhancements: Record<string, any>,
    result: ConflictResolutionResult
  ): void {
    if (!styleConstraints) return;

    // Resolve color palette conflicts
    if (styleConstraints.palette && workerEnhancements.colorPalette) {
      const allowedColors = styleConstraints.palette;
      const workerColors = Array.isArray(workerEnhancements.colorPalette) 
        ? workerEnhancements.colorPalette 
        : [workerEnhancements.colorPalette];

      const validColors = workerColors.filter(color => allowedColors.includes(color));
      
      if (validColors.length === 0) {
        // Clamp to first allowed color
        result.clampedValues.colorPalette = [allowedColors[0]];
        result.warnings.push(`Color palette clamped to profile constraint: ${allowedColors[0]}`);
      } else if (validColors.length < workerColors.length) {
        // Some colors were invalid
        result.clampedValues.colorPalette = validColors;
        result.warnings.push(`Color palette filtered to profile constraints: ${validColors.join(', ')}`);
      }
    }

    // Resolve font conflicts
    if (styleConstraints.fonts && workerEnhancements.fonts) {
      const allowedFonts = styleConstraints.fonts;
      const workerFonts = workerEnhancements.fonts;

      if (workerFonts.primary && !allowedFonts.includes(workerFonts.primary)) {
        result.clampedValues.fonts = {
          ...workerFonts,
          primary: allowedFonts[0]
        };
        result.warnings.push(`Primary font clamped to profile constraint: ${allowedFonts[0]}`);
      }

      if (workerFonts.secondary && !allowedFonts.includes(workerFonts.secondary)) {
        result.clampedValues.fonts = {
          ...result.clampedValues.fonts || workerFonts,
          secondary: allowedFonts[0]
        };
        result.warnings.push(`Secondary font clamped to profile constraint: ${allowedFonts[0]}`);
      }
    }

    // Resolve visual style conflicts
    if (styleConstraints.visualStyle && workerEnhancements.visualStyle) {
      if (workerEnhancements.visualStyle !== styleConstraints.visualStyle) {
        result.clampedValues.visualStyle = styleConstraints.visualStyle;
        result.warnings.push(`Visual style clamped to profile constraint: ${styleConstraints.visualStyle}`);
      }
    }
  }

  /**
   * Resolve effects conflicts (intensity, allowed/forbidden types)
   */
  private resolveEffectsConflicts(
    effectsConstraints: HardConstraints['effects'],
    workerEnhancements: Record<string, any>,
    result: ConflictResolutionResult
  ): void {
    if (!effectsConstraints) return;

    // Resolve effect intensity conflicts
    if (effectsConstraints.maxIntensity !== undefined && workerEnhancements.effectIntensity) {
      if (workerEnhancements.effectIntensity > effectsConstraints.maxIntensity) {
        result.clampedValues.effectIntensity = effectsConstraints.maxIntensity;
        result.warnings.push(`Effect intensity clamped to profile constraint: ${effectsConstraints.maxIntensity}`);
      }
    }

    // Resolve allowed effects conflicts
    if (effectsConstraints.allowedTypes && workerEnhancements.effects) {
      const allowedEffects = effectsConstraints.allowedTypes;
      const workerEffects = Array.isArray(workerEnhancements.effects) 
        ? workerEnhancements.effects 
        : [workerEnhancements.effects];

      const validEffects = workerEffects.filter(effect => allowedEffects.includes(effect));
      
      if (validEffects.length < workerEffects.length) {
        result.clampedValues.effects = validEffects;
        result.warnings.push(`Effects filtered to profile constraints: ${validEffects.join(', ')}`);
      }
    }

    // Resolve forbidden effects conflicts
    if (effectsConstraints.forbiddenTypes && workerEnhancements.effects) {
      const forbiddenEffects = effectsConstraints.forbiddenTypes;
      const workerEffects = Array.isArray(workerEnhancements.effects) 
        ? workerEnhancements.effects 
        : [workerEnhancements.effects];

      const validEffects = workerEffects.filter(effect => !forbiddenEffects.includes(effect));
      
      if (validEffects.length < workerEffects.length) {
        result.clampedValues.effects = validEffects;
        const removedEffects = workerEffects.filter(effect => forbiddenEffects.includes(effect));
        result.warnings.push(`Forbidden effects removed: ${removedEffects.join(', ')}`);
      }
    }
  }

  /**
   * Resolve audio style conflicts (tone, music intensity, voice style)
   */
  private resolveAudioStyleConflicts(
    audioConstraints: HardConstraints['audioStyle'],
    workerEnhancements: Record<string, any>,
    result: ConflictResolutionResult
  ): void {
    if (!audioConstraints) return;

    // Resolve voice style conflicts
    if (audioConstraints.voiceStyle && workerEnhancements.voiceStyle) {
      if (workerEnhancements.voiceStyle !== audioConstraints.voiceStyle) {
        result.clampedValues.voiceStyle = audioConstraints.voiceStyle;
        result.warnings.push(`Voice style clamped to profile constraint: ${audioConstraints.voiceStyle}`);
      }
    }

    // Resolve music intensity conflicts
    if (audioConstraints.musicIntensity !== undefined && workerEnhancements.musicIntensity) {
      if (workerEnhancements.musicIntensity > audioConstraints.musicIntensity) {
        result.clampedValues.musicIntensity = audioConstraints.musicIntensity;
        result.warnings.push(`Music intensity clamped to profile constraint: ${audioConstraints.musicIntensity}`);
      }
    }

    // Resolve tone conflicts
    if (audioConstraints.tone && workerEnhancements.tone) {
      if (workerEnhancements.tone !== audioConstraints.tone) {
        result.clampedValues.tone = audioConstraints.tone;
        result.warnings.push(`Tone clamped to profile constraint: ${audioConstraints.tone}`);
      }
    }
  }

  /**
   * Resolve pacing conflicts (speed, transition style)
   */
  private resolvePacingConflicts(
    pacingConstraints: HardConstraints['pacing'],
    workerEnhancements: Record<string, any>,
    result: ConflictResolutionResult
  ): void {
    if (!pacingConstraints) return;

    // Resolve max speed conflicts
    if (pacingConstraints.maxSpeed !== undefined && workerEnhancements.speed) {
      if (workerEnhancements.speed > pacingConstraints.maxSpeed) {
        result.clampedValues.speed = pacingConstraints.maxSpeed;
        result.warnings.push(`Speed clamped to profile constraint: ${pacingConstraints.maxSpeed}`);
      }
    }

    // Resolve transition style conflicts
    if (pacingConstraints.transitionStyle && workerEnhancements.transitionStyle) {
      if (workerEnhancements.transitionStyle !== pacingConstraints.transitionStyle) {
        result.clampedValues.transitionStyle = pacingConstraints.transitionStyle;
        result.warnings.push(`Transition style clamped to profile constraint: ${pacingConstraints.transitionStyle}`);
      }
    }
  }

  /**
   * Resolve enhancement policy conflicts
   */
  private resolveEnhancementPolicyConflicts(
    profileContext: ProfileContext,
    workerEnhancements: Record<string, any>,
    result: ConflictResolutionResult
  ): void {
    const enhancementPolicy = profileContext.enhancementPolicy;
    const enforcementMode = this.options.enforcementMode;

    // In strict mode with additive policy, limit enhancements
    if (enhancementPolicy === 'additive' && enforcementMode === 'strict') {
      // Limit V3 audio tags
      if (workerEnhancements.v3AudioTags && workerEnhancements.v3AudioTags.length > 3) {
        result.clampedValues.v3AudioTags = workerEnhancements.v3AudioTags.slice(0, 3);
        result.warnings.push(`V3 audio tags limited to 3 in strict additive mode`);
      }

      // Limit enhancement complexity
      if (workerEnhancements.enhancementComplexity && workerEnhancements.enhancementComplexity > 0.5) {
        result.clampedValues.enhancementComplexity = 0.5;
        result.warnings.push(`Enhancement complexity limited to 0.5 in strict additive mode`);
      }
    }

    // In creative mode, allow more flexibility but still respect hard constraints
    if (enforcementMode === 'creative') {
      // Allow more enhancements but still clamp extreme values
      if (workerEnhancements.effectIntensity && workerEnhancements.effectIntensity > 0.9) {
        result.clampedValues.effectIntensity = 0.9;
        result.warnings.push(`Effect intensity capped at 0.9 in creative mode`);
      }
    }
  }

  /**
   * Log conflict resolution results
   */
  logResults(result: ConflictResolutionResult, context: string): void {
    if (result.warnings.length > 0) {
      const logMessage = `Conflict resolution applied for ${context}: ${result.warnings.join(', ')}`;
      
      switch (this.options.logLevel) {
        case 'debug':
        case 'info':
          console.log(logMessage);
          break;
        case 'warn':
          console.warn(logMessage);
          break;
        case 'error':
          console.error(logMessage);
          break;
      }
    }
  }
}

/**
 * Factory function to create conflict resolver with default options
 */
export function createConflictResolver(
  enforcementMode: 'strict' | 'balanced' | 'creative' = 'balanced',
  enhancementPolicy: 'additive' | 'transform_lite' = 'additive',
  logLevel: 'debug' | 'info' | 'warn' | 'error' = 'info'
): ConflictResolver {
  return new ConflictResolver({
    enforcementMode,
    enhancementPolicy,
    logLevel
  });
}

/**
 * Utility function to apply conflict resolution to worker payload
 */
export function applyConflictResolution(
  payload: Record<string, any>,
  profileContext: ProfileContext,
  hardConstraints: HardConstraints
): Record<string, any> {
  const resolver = createConflictResolver(
    payload.enforcementMode || 'balanced',
    payload.enhancementPolicy || 'additive',
    'info'
  );

  const result = resolver.resolveConflicts(profileContext, hardConstraints, payload);
  
  if (result.warnings.length > 0) {
    resolver.logResults(result, `job_${payload.sceneId || 'unknown'}`);
  }

  // Apply clamped values to payload
  const resolvedPayload = { ...payload };
  for (const [key, value] of Object.entries(result.clampedValues)) {
    resolvedPayload[key] = value;
  }

  return resolvedPayload;
}
