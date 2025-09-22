/**
 * Feature Flags and Caps for Profile-Pipeline Integration
 * 
 * This module provides environment-level feature flags and caps for prompt enhancement modes,
 * cost limits, and timeouts to ensure production stability and cost control.
 */

export interface FeatureFlags {
  // Prompt Enhancement Modes
  promptEnhancementMode: 'strict' | 'balanced' | 'creative';
  enableWorkerEnhancements: boolean;
  enableProfileOverrides: boolean;
  
  // Cost Control
  enableCostCaps: boolean;
  maxCostPerJob: number;
  maxTotalCost: number;
  
  // Timeout Control
  enableTimeoutCaps: boolean;
  maxJobTimeout: number;
  maxTotalTimeout: number;
  
  // Quality Control
  enableQualityGates: boolean;
  minQualityScore: number;
  maxRetries: number;
  
  // Profile-Specific Overrides
  profileOverrides: Record<string, Partial<FeatureFlags>>;
}

export interface CostCap {
  maxCostPerJob: number;
  maxTotalCost: number;
  costWarningThreshold: number;
  costAlertThreshold: number;
}

export interface TimeoutCap {
  maxJobTimeout: number;
  maxTotalTimeout: number;
  timeoutWarningThreshold: number;
  timeoutAlertThreshold: number;
}

/**
 * Default feature flags configuration
 */
const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  promptEnhancementMode: 'balanced',
  enableWorkerEnhancements: true,
  enableProfileOverrides: true,
  enableCostCaps: true,
  maxCostPerJob: 1.00,
  maxTotalCost: 10.00,
  enableTimeoutCaps: true,
  maxJobTimeout: 600, // 10 minutes
  maxTotalTimeout: 3600, // 1 hour
  enableQualityGates: true,
  minQualityScore: 0.3,
  maxRetries: 3,
  profileOverrides: {
    'educational_explainer': {
      promptEnhancementMode: 'strict',
      maxCostPerJob: 0.50,
      maxTotalCost: 5.00
    },
    'ugc_testimonial': {
      promptEnhancementMode: 'balanced',
      maxCostPerJob: 0.30,
      maxTotalCost: 3.00
    },
    'ugc_reaction': {
      promptEnhancementMode: 'creative',
      maxCostPerJob: 0.40,
      maxTotalCost: 4.00
    },
    'marketing_dynamic': {
      promptEnhancementMode: 'creative',
      maxCostPerJob: 1.00,
      maxTotalCost: 10.00
    },
    'cinematic_trailer': {
      promptEnhancementMode: 'creative',
      maxCostPerJob: 2.00,
      maxTotalCost: 20.00
    }
  }
};

/**
 * Load feature flags from environment variables
 */
export function loadFeatureFlags(): FeatureFlags {
  const flags = { ...DEFAULT_FEATURE_FLAGS };

  // Load from environment variables
  if (process.env.PROMPT_ENHANCEMENT_MODE) {
    flags.promptEnhancementMode = process.env.PROMPT_ENHANCEMENT_MODE as 'strict' | 'balanced' | 'creative';
  }

  if (process.env.ENABLE_WORKER_ENHANCEMENTS !== undefined) {
    flags.enableWorkerEnhancements = process.env.ENABLE_WORKER_ENHANCEMENTS === 'true';
  }

  if (process.env.ENABLE_PROFILE_OVERRIDES !== undefined) {
    flags.enableProfileOverrides = process.env.ENABLE_PROFILE_OVERRIDES === 'true';
  }

  if (process.env.ENABLE_COST_CAPS !== undefined) {
    flags.enableCostCaps = process.env.ENABLE_COST_CAPS === 'true';
  }

  if (process.env.MAX_COST_PER_JOB) {
    flags.maxCostPerJob = parseFloat(process.env.MAX_COST_PER_JOB);
  }

  if (process.env.MAX_TOTAL_COST) {
    flags.maxTotalCost = parseFloat(process.env.MAX_TOTAL_COST);
  }

  if (process.env.ENABLE_TIMEOUT_CAPS !== undefined) {
    flags.enableTimeoutCaps = process.env.ENABLE_TIMEOUT_CAPS === 'true';
  }

  if (process.env.MAX_JOB_TIMEOUT) {
    flags.maxJobTimeout = parseInt(process.env.MAX_JOB_TIMEOUT);
  }

  if (process.env.MAX_TOTAL_TIMEOUT) {
    flags.maxTotalTimeout = parseInt(process.env.MAX_TOTAL_TIMEOUT);
  }

  if (process.env.ENABLE_QUALITY_GATES !== undefined) {
    flags.enableQualityGates = process.env.ENABLE_QUALITY_GATES === 'true';
  }

  if (process.env.MIN_QUALITY_SCORE) {
    flags.minQualityScore = parseFloat(process.env.MIN_QUALITY_SCORE);
  }

  if (process.env.MAX_RETRIES) {
    flags.maxRetries = parseInt(process.env.MAX_RETRIES);
  }

  return flags;
}

/**
 * Get feature flags for a specific profile
 */
export function getFeatureFlagsForProfile(profileId: string): FeatureFlags {
  const globalFlags = loadFeatureFlags();
  
  if (!globalFlags.enableProfileOverrides) {
    return globalFlags;
  }

  const profileOverride = globalFlags.profileOverrides[profileId];
  if (!profileOverride) {
    return globalFlags;
  }

  // Merge global flags with profile-specific overrides
  return {
    ...globalFlags,
    ...profileOverride
  };
}

/**
 * Check if a cost cap would be exceeded
 */
export function checkCostCap(
  currentCost: number,
  additionalCost: number,
  profileId: string
): { allowed: boolean; reason?: string; warning?: string } {
  const flags = getFeatureFlagsForProfile(profileId);
  
  if (!flags.enableCostCaps) {
    return { allowed: true };
  }

  const totalCost = currentCost + additionalCost;
  
  if (totalCost > flags.maxTotalCost) {
    return {
      allowed: false,
      reason: `Total cost would exceed limit: ${totalCost} > ${flags.maxTotalCost}`
    };
  }

  if (additionalCost > flags.maxCostPerJob) {
    return {
      allowed: false,
      reason: `Job cost would exceed limit: ${additionalCost} > ${flags.maxCostPerJob}`
    };
  }

  // Check warning thresholds
  if (totalCost > flags.maxTotalCost * 0.8) {
    return {
      allowed: true,
      warning: `Approaching total cost limit: ${totalCost} / ${flags.maxTotalCost}`
    };
  }

  if (additionalCost > flags.maxCostPerJob * 0.8) {
    return {
      allowed: true,
      warning: `Approaching job cost limit: ${additionalCost} / ${flags.maxCostPerJob}`
    };
  }

  return { allowed: true };
}

/**
 * Check if a timeout cap would be exceeded
 */
export function checkTimeoutCap(
  currentTime: number,
  additionalTime: number,
  profileId: string
): { allowed: boolean; reason?: string; warning?: string } {
  const flags = getFeatureFlagsForProfile(profileId);
  
  if (!flags.enableTimeoutCaps) {
    return { allowed: true };
  }

  const totalTime = currentTime + additionalTime;
  
  if (totalTime > flags.maxTotalTimeout) {
    return {
      allowed: false,
      reason: `Total timeout would exceed limit: ${totalTime}s > ${flags.maxTotalTimeout}s`
    };
  }

  if (additionalTime > flags.maxJobTimeout) {
    return {
      allowed: false,
      reason: `Job timeout would exceed limit: ${additionalTime}s > ${flags.maxJobTimeout}s`
    };
  }

  // Check warning thresholds
  if (totalTime > flags.maxTotalTimeout * 0.8) {
    return {
      allowed: true,
      warning: `Approaching total timeout limit: ${totalTime}s / ${flags.maxTotalTimeout}s`
    };
  }

  if (additionalTime > flags.maxJobTimeout * 0.8) {
    return {
      allowed: true,
      warning: `Approaching job timeout limit: ${additionalTime}s / ${flags.maxJobTimeout}s`
    };
  }

  return { allowed: true };
}

/**
 * Check if quality gates are met
 */
export function checkQualityGate(
  qualityScore: number,
  profileId: string
): { passed: boolean; reason?: string } {
  const flags = getFeatureFlagsForProfile(profileId);
  
  if (!flags.enableQualityGates) {
    return { passed: true };
  }

  if (qualityScore < flags.minQualityScore) {
    return {
      passed: false,
      reason: `Quality score below minimum: ${qualityScore} < ${flags.minQualityScore}`
    };
  }

  return { passed: true };
}

/**
 * Get retry policy based on feature flags
 */
export function getRetryPolicy(profileId: string): { maxRetries: number; backoffSeconds: number } {
  const flags = getFeatureFlagsForProfile(profileId);
  
  return {
    maxRetries: flags.maxRetries,
    backoffSeconds: 30 // Default backoff
  };
}

/**
 * Apply feature flags to job payload
 */
export function applyFeatureFlagsToJob(
  payload: Record<string, any>,
  profileId: string
): Record<string, any> {
  const flags = getFeatureFlagsForProfile(profileId);
  
  return {
    ...payload,
    // Add feature flags to payload
    featureFlags: {
      promptEnhancementMode: flags.promptEnhancementMode,
      enableWorkerEnhancements: flags.enableWorkerEnhancements,
      maxCostPerJob: flags.maxCostPerJob,
      maxTotalCost: flags.maxTotalCost,
      maxJobTimeout: flags.maxJobTimeout,
      maxTotalTimeout: flags.maxTotalTimeout,
      maxRetries: flags.maxRetries
    }
  };
}

/**
 * Validate job against feature flags
 */
export function validateJobAgainstFeatureFlags(
  job: Record<string, any>,
  profileId: string
): { valid: boolean; warnings: string[]; errors: string[] } {
  const flags = getFeatureFlagsForProfile(profileId);
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check cost caps
  if (flags.enableCostCaps && job.estimatedCost) {
    const costCheck = checkCostCap(0, job.estimatedCost, profileId);
    if (!costCheck.allowed) {
      errors.push(costCheck.reason!);
    } else if (costCheck.warning) {
      warnings.push(costCheck.warning);
    }
  }

  // Check timeout caps
  if (flags.enableTimeoutCaps && job.estimatedDuration) {
    const timeoutCheck = checkTimeoutCap(0, job.estimatedDuration, profileId);
    if (!timeoutCheck.allowed) {
      errors.push(timeoutCheck.reason!);
    } else if (timeoutCheck.warning) {
      warnings.push(timeoutCheck.warning);
    }
  }

  // Check quality gates
  if (flags.enableQualityGates && job.qualityScore !== undefined) {
    const qualityCheck = checkQualityGate(job.qualityScore, profileId);
    if (!qualityCheck.passed) {
      errors.push(qualityCheck.reason!);
    }
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors
  };
}

/**
 * Get feature flags summary for monitoring
 */
export function getFeatureFlagsSummary(): {
  global: FeatureFlags;
  profiles: Record<string, FeatureFlags>;
} {
  const globalFlags = loadFeatureFlags();
  const profileFlags: Record<string, FeatureFlags> = {};

  // Get flags for each profile
  for (const profileId of Object.keys(globalFlags.profileOverrides)) {
    profileFlags[profileId] = getFeatureFlagsForProfile(profileId);
  }

  return {
    global: globalFlags,
    profiles: profileFlags
  };
}
