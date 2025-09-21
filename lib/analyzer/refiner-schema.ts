/**
 * Step 2a: Refiner = Polished JSON Upgrade
 * 
 * Bulletproof Zod schema for the Refiner JSON output that upgrades the raw analyzer JSON
 * into a more polished, confident, and production-ready format.
 * 
 * This schema matches the exact specifications for bulletproof compatibility.
 */

import { z } from 'zod';

// Input schema - what the refiner receives from query-analyzer (flexible for existing pipeline)
export const AnalyzerInputSchema = z.object({
  id: z.string().optional(), // For linking to analyzer results
  user_request: z.object({
    original_prompt: z.string(),
    intent: z.enum(['image', 'video', 'audio', 'mixed']).optional(),
    duration_seconds: z.number().nullable().optional(),
    aspect_ratio: z.string().nullable().optional(),
    platform: z.string().nullable().optional(),
    image_count: z.number().nullable().optional(),
  }),
  prompt_analysis: z.object({
    user_intent_description: z.string().optional(),
    reformulated_prompt: z.string().optional(),
    clarity_score: z.number().min(1).max(10).optional(),
    suggested_improvements: z.array(z.string()).optional(),
    content_type_analysis: z.object({
      needs_explanation: z.boolean().optional(),
      needs_charts: z.boolean().optional(),
      needs_diagrams: z.boolean().optional(),
      needs_educational_content: z.boolean().optional(),
      content_complexity: z.enum([
        // English
        'very_simple', 'simple', 'moderate', 'complex',
        // French
        'très_simple', 'simple', 'modéré', 'complexe',
        // Spanish
        'muy_simple', 'simple', 'moderado', 'complejo',
        // German
        'sehr_einfach', 'einfach', 'mäßig', 'komplex',
        // Italian
        'molto_semplice', 'semplice', 'moderato', 'complesso',
        // Portuguese
        'muito_simples', 'simples', 'moderado', 'complexo'
      ]).optional(),
      requires_visual_aids: z.boolean().optional(),
      is_instructional: z.boolean().optional(),
      needs_data_visualization: z.boolean().optional(),
      requires_interactive_elements: z.boolean().optional(),
      content_category: z.string().optional(),
    }).optional(),
  }).optional(),
  assets: z.array(z.object({
    id: z.string(),
    type: z.enum(['image', 'video', 'audio']),
    user_description: z.string().optional(),
    ai_caption: z.string().optional(),
    objects_detected: z.array(z.string()).optional(),
    style: z.string().optional(),
    mood: z.string().optional(),
    quality_score: z.number().min(0).max(1).optional(),
    role: z.string().optional(),
    recommended_edits: z.array(z.string()).optional(),
  })).optional(),
  global_analysis: z.object({
    goal: z.string().optional(),
    constraints: z.record(z.any()).optional(),
    asset_roles: z.record(z.string()).optional(),
    conflicts: z.array(z.any()).optional(),
  }).optional(),
  creative_options: z.array(z.object({
    id: z.string(),
    title: z.string(),
    short: z.string().optional(),
    reasons: z.array(z.string()).optional(),
    estimatedWorkload: z.enum([
      // English
      'low', 'medium', 'high',
      // French
      'faible', 'moyen', 'élevé',
      // Spanish
      'bajo', 'medio', 'alto',
      // German
      'niedrig', 'mittel', 'hoch',
      // Italian
      'basso', 'medio', 'alto',
      // Portuguese
      'baixo', 'médio', 'alto'
    ]).optional(),
  })).optional(),
  creative_direction: z.object({
    core_concept: z.string().optional(),
    visual_approach: z.string().optional(),
    style_direction: z.string().optional(),
    mood_atmosphere: z.string().optional(),
  }).optional(),
  production_pipeline: z.object({
    workflow_steps: z.array(z.string()).optional(),
    estimated_time: z.string().optional(),
    success_probability: z.number().min(0).max(1).optional(),
    quality_targets: z.record(z.any()).optional(),
  }).optional(),
  quality_metrics: z.object({
    overall_confidence: z.number().min(0).max(1).optional(),
    analysis_quality: z.number().min(1).max(10).optional(),
    completion_status: z.enum([
      // English
      'complete', 'partial', 'failed',
      // French
      'complet', 'partiel', 'échoué',
      // Spanish
      'completo', 'parcial', 'fallido',
      // German
      'vollständig', 'teilweise', 'fehlgeschlagen',
      // Italian
      'completo', 'parziale', 'fallito',
      // Portuguese
      'completo', 'parcial', 'falhou'
    ]).optional(),
    feasibility_score: z.number().min(0).max(1).optional(),
  }).optional(),
  challenges: z.array(z.object({
    type: z.string(),
    description: z.string(),
    impact: z.enum([
      // English
      'minor', 'moderate', 'major',
      // French
      'mineur', 'modéré', 'majeur',
      // Spanish
      'menor', 'moderado', 'mayor',
      // German
      'gering', 'mäßig', 'groß',
      // Italian
      'minore', 'moderato', 'maggiore',
      // Portuguese
      'menor', 'moderado', 'maior'
    ]).optional(),
  })).optional(),
  recommendations: z.array(z.object({
    type: z.string(),
    recommendation: z.string(),
    priority: z.enum([
      // English
      'required', 'recommended', 'REQUIRED', 'RECOMMENDED',
      // French
      'requis', 'recommandé', 'REQUIS', 'RECOMMANDÉ',
      // Spanish
      'requerido', 'recomendado', 'REQUERIDO', 'RECOMENDADO',
      // German
      'erforderlich', 'empfohlen', 'ERFORDERLICH', 'EMPFOHLEN',
      // Italian
      'richiesto', 'raccomandato', 'RICHIESTA', 'RACCOMANDATO',
      // Portuguese
      'necessário', 'recomendado', 'NECESSÁRIO', 'RECOMENDADO'
    ]).optional(),
  })).optional(),
}).passthrough(); // Allow additional fields from existing pipeline

// Enhanced Refiner Output Schema with Asset Utilization Extensions
export const RefinerSchema = z.object({
  user_request: z.object({
    original_prompt: z.string(),
    intent: z.enum(["image", "video", "audio"]),
    duration_seconds: z.number().nullable().optional(),
    aspect_ratio: z.string(),
    platform: z.string(),
    image_count: z.number().optional(),
  }),

  prompt_analysis: z.object({
    user_intent_description: z.string(),
    reformulated_prompt: z.string(),
    clarity_score: z.number().min(1).max(10),
    suggested_improvements: z.array(z.string()),
    content_type_analysis: z.object({
      needs_explanation: z.boolean(),
      needs_charts: z.boolean(),
      needs_diagrams: z.boolean(),
      needs_educational_content: z.boolean(),
      content_complexity: z.enum([
        // English
        "very_simple", "simple", "moderate", "complex",
        // French
        "très_simple", "simple", "modéré", "complexe",
        // Spanish
        "muy_simple", "simple", "moderado", "complejo",
        // German
        "sehr_einfach", "einfach", "mäßig", "komplex",
        // Italian
        "molto_semplice", "semplice", "moderato", "complesso",
        // Portuguese
        "muito_simples", "simples", "moderado", "complexo"
      ]),
      requires_visual_aids: z.boolean(),
      is_instructional: z.boolean(),
      needs_data_visualization: z.boolean(),
      requires_interactive_elements: z.boolean(),
      content_category: z.string(),
    }),
  }),

  assets: z.array(
    z.object({
      id: z.string(),
      type: z.enum(["image", "video", "audio"]),
      user_description: z.string(),
      ai_caption: z.string(),
      objects_detected: z.array(z.string()),
      style: z.string(),
      mood: z.string(),
      quality_score: z.number().min(0).max(1),
      role: z.string(),
      utilization_level: z.enum(["primary_subject", "primary_footage", "seed_for_generation", "supporting_visual", "background_element", "reference_only", "primary_visual", "main_visual_anchor"]).optional(),
      recommended_edits: z.array(
        z.union([
          z.string(), // Allow simple string recommendations
          z.object({
            action: z.string(),
            priority: z.enum([
              // English
              "required", "recommended", "REQUIRED", "RECOMMENDED",
              // French
              "requis", "recommandé", "REQUIS", "RECOMMANDÉ",
              // Spanish
              "requerido", "recomendado", "REQUERIDO", "RECOMENDADO",
              // German
              "erforderlich", "empfohlen", "ERFORDERLICH", "EMPFOHLEN",
              // Italian
              "richiesto", "raccomandato", "RICHIESTA", "RACCOMANDATO",
              // Portuguese
              "necessário", "recomendado", "NECESSÁRIO", "RECOMENDADO"
            ]),
          })
        ])
      ).optional(),
    })
  ),

  global_analysis: z.object({
    goal: z.string(),
    constraints: z.object({
      duration_seconds: z.number().nullable().optional(),
      aspect_ratio: z.string().optional(),
      platform: z.string().optional(),
    }).optional(),
    asset_roles: z.record(z.string(), z.string()).optional(),
    conflicts: z.array(
      z.object({
        issue: z.string().optional(),
        resolution: z.string().optional(),
        severity: z.enum(["minor", "moderate", "critical"]).optional(),
      })
    ).optional(),
  }),

  // NEW: Asset Utilization Extensions
  refiner_extensions: z.object({
    session_mode: z.enum(["asset_driven", "asset_free"]),
    narrative_spine: z.object({
      intro: z.string(),
      core: z.array(z.string()),
      outro: z.string(),
    }),
    default_scaffolding: z.record(z.string(), z.object({
      intro: z.string(),
      core: z.array(z.string()),
      outro: z.string(),
    })).optional(),
    asset_utilization_summary: z.object({
      total_assets: z.number(),
      utilized_assets: z.number(),
      utilization_rate: z.number().min(0).max(1),
      primary_assets: z.array(z.string()),
      reference_only_assets: z.array(z.string()),
      utilization_rationale: z.string(),
    }),
    // NEW: Asset Role Elevation based on user descriptions
    asset_role_elevation: z.object({
      rules: z.array(z.object({
        match_on: z.string(),
        keywords: z.array(z.string()),
        action: z.string(),
        conditions: z.object({
          min_quality_score: z.number().min(0).max(1),
        }),
        reason: z.string(),
      })),
      default_behavior: z.string(),
    }).optional(),
    elevation_applied: z.array(z.object({
      asset_id: z.string(),
      original_role: z.string(),
      elevated_role: z.string(),
      elevation_reason: z.string(),
      user_description: z.string(),
      confidence: z.number().min(0).max(1),
      quality_threshold: z.number().min(0).max(1),
    })).optional(),
  }),

  creative_options: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      short: z.string().optional(),
      reasons: z.array(z.string()).optional(),
      estimatedWorkload: z.enum([
        // English
        "low", "medium", "high",
        // French
        "faible", "moyen", "élevé",
        // Spanish
        "bajo", "medio", "alto",
        // German
        "niedrig", "mittel", "hoch",
        // Italian
        "basso", "medio", "alto",
        // Portuguese
        "baixo", "médio", "alto"
      ]).optional(),
    })
  ).optional(),

  creative_direction: z.object({
    core_concept: z.string(),
    visual_approach: z.string().optional(),
    style_direction: z.string().optional(),
    mood_atmosphere: z.string().optional(),
  }),

  production_pipeline: z.object({
    workflow_steps: z.array(z.string()).optional(),
    estimated_time: z.string().optional(),
    success_probability: z.number().min(0).max(1).optional(),
    quality_targets: z.object({
      technical_quality_target: z.string().optional(),
      creative_quality_target: z.string().optional(),
      consistency_target: z.string().optional(),
      polish_level_target: z.string().optional(),
    }).optional(),
  }),

  quality_metrics: z.object({
    overall_confidence: z.number().min(0).max(1).optional(),
    analysis_quality: z.number().min(1).max(10).optional(),
    completion_status: z.enum([
      // English
      "partial", "complete",
      // French
      "partiel", "complet",
      // Spanish
      "parcial", "completo",
      // German
      "teilweise", "vollständig",
      // Italian
      "parziale", "completo",
      // Portuguese
      "parcial", "completo"
    ]).optional(),
    feasibility_score: z.number().min(0).max(1).optional(),
    asset_utilization_score: z.number().min(0).max(1).optional(), // NEW
  }),

  challenges: z.array(
    z.object({
      type: z.string(),
      description: z.string(),
      impact: z.enum([
        // English
        "minor", "moderate", "major",
        // French
        "mineur", "modéré", "majeur",
        // Spanish
        "menor", "moderado", "mayor",
        // German
        "gering", "mäßig", "groß",
        // Italian
        "minore", "moderato", "maggiore",
        // Portuguese
        "menor", "moderado", "maior"
      ]).optional(),
    })
  ).optional(),

  recommendations: z.array(
    z.object({
      type: z.string(),
      recommendation: z.string(),
      priority: z.enum([
        // English
        "required", "recommended", "REQUIRED", "RECOMMENDED",
        // French
        "requis", "recommandé", "REQUIS", "RECOMMANDÉ",
        // Spanish
        "requerido", "recomendado", "REQUERIDO", "RECOMENDADO",
        // German
        "erforderlich", "empfohlen", "ERFORDERLICH", "EMPFOHLEN",
        // Italian
        "richiesto", "raccomandato", "RICHIESTA", "RACCOMANDATO",
        // Portuguese
        "necessário", "recomendado", "NECESSÁRIO", "RECOMENDADO"
      ]).optional(),
    })
  ).optional(),
});

// Type exports
export type AnalyzerInput = z.infer<typeof AnalyzerInputSchema>;
export type RefinerOutput = z.infer<typeof RefinerSchema>;

// Enhanced validation functions with confidence normalization
export function validateAnalyzerInput(data: unknown): AnalyzerInput {
  return AnalyzerInputSchema.parse(data);
}

export function validateRefinerOutput(data: unknown): RefinerOutput {
  return RefinerSchema.parse(data);
}

// Confidence level validation and normalization
export interface ConfidenceAnalysis {
  analyzerConfidence: number;
  refinerConfidence: number;
  confidenceGap: number;
  isOverCorrected: boolean;
  needsNormalization: boolean;
}

export function analyzeConfidenceLevels(analyzerData: AnalyzerInput, refinerData: RefinerOutput): ConfidenceAnalysis {
  const analyzerConfidence = analyzerData.quality_metrics?.overall_confidence || 0.5;
  const refinerConfidence = refinerData.quality_metrics?.overall_confidence || 0.75;
  const confidenceGap = Math.abs(refinerConfidence - analyzerConfidence);
  const isOverCorrected = refinerConfidence > analyzerConfidence + 0.3;
  const needsNormalization = confidenceGap > 0.2;

  return {
    analyzerConfidence,
    refinerConfidence,
    confidenceGap,
    isOverCorrected,
    needsNormalization
  };
}

// Core concept validation and placeholder detection
export interface CoreConceptAnalysis {
  hasPlaceholder: boolean;
  placeholderValue: string | null;
  conceptStrength: 'weak' | 'moderate' | 'strong';
  needsEnhancement: boolean;
}

export function analyzeCoreConcept(creativeDirection: RefinerOutput['creative_direction']): CoreConceptAnalysis {
  const coreConcept = creativeDirection?.core_concept || '';
  const hasPlaceholder = coreConcept.includes('**') || coreConcept.trim() === '' || coreConcept.length < 10;
  const placeholderValue = hasPlaceholder ? coreConcept : null;
  
  let conceptStrength: 'weak' | 'moderate' | 'strong' = 'weak';
  if (coreConcept.length > 50 && !hasPlaceholder) conceptStrength = 'moderate';
  if (coreConcept.length > 100 && !hasPlaceholder && coreConcept.includes('content')) conceptStrength = 'strong';
  
  const needsEnhancement = hasPlaceholder || conceptStrength === 'weak';

  return {
    hasPlaceholder,
    placeholderValue,
    conceptStrength,
    needsEnhancement
  };
}

// Content type analysis normalization
export interface ContentTypeNormalization {
  originalAnalysis: any;
  normalizedAnalysis: any;
  contradictions: string[];
  needsCorrection: boolean;
}

export function normalizeContentTypeAnalysis(analyzerData: AnalyzerInput): ContentTypeNormalization {
  const originalAnalysis = analyzerData.prompt_analysis?.content_type_analysis || {};
  const normalizedAnalysis = { ...originalAnalysis };
  const contradictions: string[] = [];
  let needsCorrection = false;

  // Fix explainer contradictions
  if (originalAnalysis.needs_explanation === true && originalAnalysis.needs_educational_content === false) {
    normalizedAnalysis.needs_educational_content = true;
    contradictions.push('Explainer content should be educational');
    needsCorrection = true;
  }

  // Normalize content complexity if missing
  if (!normalizedAnalysis.content_complexity) {
    const assetCount = analyzerData.assets?.length || 0;
    if (assetCount <= 2) normalizedAnalysis.content_complexity = 'simple';
    else if (assetCount <= 5) normalizedAnalysis.content_complexity = 'moderate';
    else normalizedAnalysis.content_complexity = 'complex';
    needsCorrection = true;
  }

  // Ensure content category is set
  if (!normalizedAnalysis.content_category) {
    const prompt = analyzerData.user_request?.original_prompt?.toLowerCase() || '';
    if (prompt.includes('explain') || prompt.includes('teach')) {
      normalizedAnalysis.content_category = 'educational';
    } else if (prompt.includes('funny') || prompt.includes('meme')) {
      normalizedAnalysis.content_category = 'entertainment';
    } else {
      normalizedAnalysis.content_category = 'general';
    }
    needsCorrection = true;
  }

  return {
    originalAnalysis,
    normalizedAnalysis,
    contradictions,
    needsCorrection
  };
}

// Asset integration validation
export interface AssetIntegrationAnalysis {
  meaningfulIntegration: boolean;
  assetContextEmbedded: boolean;
  roleClarity: 'clear' | 'unclear' | 'missing';
  integrationScore: number; // 0-1
  issues: string[];
}

export function analyzeAssetIntegration(analyzerData: AnalyzerInput, refinerData: RefinerOutput): AssetIntegrationAnalysis {
  const assets = analyzerData.assets || [];
  const reformulatedPrompt = refinerData.prompt_analysis?.reformulated_prompt || '';
  const issues: string[] = [];
  let integrationScore = 0;

  // Check if assets are meaningfully integrated
  const meaningfulIntegration = assets.length > 0 && reformulatedPrompt.length > 50;
  if (!meaningfulIntegration) {
    issues.push('Assets not meaningfully integrated into reformulated prompt');
  } else {
    integrationScore += 0.3;
  }

  // Check if asset context is embedded
  const assetContextEmbedded = assets.some(asset => 
    reformulatedPrompt.toLowerCase().includes(asset.type) ||
    reformulatedPrompt.toLowerCase().includes(asset.user_description?.toLowerCase() || '')
  );
  if (!assetContextEmbedded) {
    issues.push('Asset context not embedded in reformulated prompt');
  } else {
    integrationScore += 0.4;
  }

  // Check role clarity
  let roleClarity: 'clear' | 'unclear' | 'missing' = 'clear';
  const assetsWithRoles = assets.filter(asset => asset.role && asset.role.length > 5);
  if (assetsWithRoles.length === 0) {
    roleClarity = 'missing';
    issues.push('Asset roles not clearly defined');
  } else if (assetsWithRoles.length < assets.length * 0.7) {
    roleClarity = 'unclear';
    issues.push('Some asset roles unclear or missing');
  } else {
    integrationScore += 0.3;
  }

  return {
    meaningfulIntegration,
    assetContextEmbedded,
    roleClarity,
    integrationScore,
    issues
  };
}

// NEW: Asset Utilization Analysis
export interface AssetUtilizationAnalysis {
  sessionMode: 'asset_driven' | 'asset_free';
  utilizationRate: number; // 0-1
  primaryAssets: string[];
  referenceOnlyAssets: string[];
  utilizationRationale: string;
  needsElevation: boolean;
  elevationSuggestions: string[];
  assetRoleElevations: AssetRoleElevation[];
}

// NEW: Asset Role Elevation based on user descriptions
export interface AssetRoleElevation {
  assetId: string;
  originalRole: string;
  elevatedRole: string;
  elevationReason: string;
  userDescription: string;
  confidence: number;
  qualityThreshold: number;
}

export function analyzeAssetUtilization(analyzerData: AnalyzerInput): AssetUtilizationAnalysis {
  const assets = analyzerData.assets || [];
  const totalAssets = assets.length;
  
  // Determine session mode
  const sessionMode: 'asset_driven' | 'asset_free' = totalAssets > 0 ? 'asset_driven' : 'asset_free';
  
  if (sessionMode === 'asset_free') {
    return {
      sessionMode: 'asset_free',
      utilizationRate: 0,
      primaryAssets: [],
      referenceOnlyAssets: [],
      utilizationRationale: 'No assets provided - will use profile default scaffolding',
      needsElevation: false,
      elevationSuggestions: [],
      assetRoleElevations: []
    };
  }
  
  // Analyze asset quality and potential utilization with user description priority
  const primaryAssets: string[] = [];
  const referenceOnlyAssets: string[] = [];
  const elevationSuggestions: string[] = [];
  const assetRoleElevations: AssetRoleElevation[] = [];
  
  assets.forEach(asset => {
    const qualityScore = asset.quality_score || 0;
    const userDescription = asset.user_description || '';
    const hasGoodDescription = userDescription.length > 10;
    const hasGoodCaption = asset.ai_caption && asset.ai_caption.length > 10;
    
    // NEW: Check for user description-based role elevation
    const roleElevation = analyzeUserDescriptionForRoleElevation(asset, qualityScore);
    
    if (roleElevation) {
      assetRoleElevations.push(roleElevation);
      
      // Apply elevation based on user description
      if (roleElevation.elevatedRole === 'primary' && qualityScore >= roleElevation.qualityThreshold) {
        primaryAssets.push(asset.id);
        elevationSuggestions.push(`Elevated ${asset.id} to primary role: ${roleElevation.elevationReason}`);
      } else if (roleElevation.elevatedRole === 'primary' && qualityScore < roleElevation.qualityThreshold) {
        // Still elevate but with quality enhancement note
        primaryAssets.push(asset.id);
        elevationSuggestions.push(`Elevated ${asset.id} to primary role (${roleElevation.elevationReason}) with quality enhancement needed`);
      } else if (roleElevation.elevatedRole === 'branding') {
        primaryAssets.push(asset.id);
        elevationSuggestions.push(`Elevated ${asset.id} to branding role: ${roleElevation.elevationReason}`);
      } else if (roleElevation.elevatedRole === 'background') {
        referenceOnlyAssets.push(asset.id);
        elevationSuggestions.push(`Assigned ${asset.id} as background: ${roleElevation.elevationReason}`);
      }
    } else {
      // Fallback to original quality-based logic
      if (qualityScore >= 0.7 && (hasGoodDescription || hasGoodCaption)) {
        primaryAssets.push(asset.id);
      } else if (qualityScore >= 0.5) {
        // Asset can be elevated with improvements
        primaryAssets.push(asset.id);
        elevationSuggestions.push(`Elevate ${asset.id} to primary use with quality enhancement`);
      } else {
        // Asset is reference only but should still be utilized
        referenceOnlyAssets.push(asset.id);
        elevationSuggestions.push(`Use ${asset.id} as seed for generation or supporting element`);
      }
    }
  });
  
  // Calculate utilization rate (never let assets be completely unused)
  const utilizedAssets = primaryAssets.length + referenceOnlyAssets.length;
  const utilizationRate = totalAssets > 0 ? utilizedAssets / totalAssets : 0;
  
  // Generate utilization rationale
  let utilizationRationale = '';
  if (primaryAssets.length === totalAssets) {
    utilizationRationale = 'All assets are high quality and will be used as primary content';
  } else if (primaryAssets.length > 0) {
    utilizationRationale = `${primaryAssets.length} assets will be primary content, ${referenceOnlyAssets.length} will be supporting elements or generation seeds`;
  } else {
    utilizationRationale = 'Assets will be used as generation seeds and supporting elements to ensure user contribution matters';
  }
  
  const needsElevation = referenceOnlyAssets.length > 0 || elevationSuggestions.length > 0;
  
  return {
    sessionMode,
    utilizationRate,
    primaryAssets,
    referenceOnlyAssets,
    utilizationRationale,
    needsElevation,
    elevationSuggestions,
    assetRoleElevations
  };
}

// NEW: User Description-Based Role Elevation Analysis
export function analyzeUserDescriptionForRoleElevation(asset: any, qualityScore: number): AssetRoleElevation | null {
  const userDescription = (asset.user_description || '').toLowerCase().trim();
  
  if (!userDescription) {
    return null;
  }
  
  // Define role elevation rules based on user descriptions
  const roleElevationRules = [
    {
      keywords: ['main character', 'protagonist', 'hero', 'central figure', 'main subject', 'primary character', 'lead character'],
      elevatedRole: 'primary',
      qualityThreshold: 0.3, // Very low threshold - user intent overrides quality
      reason: 'User explicitly defined narrative role as main character'
    },
    {
      keywords: ['logo', 'brand mark', 'watermark', 'branding', 'company logo', 'brand identity'],
      elevatedRole: 'branding',
      qualityThreshold: 0.2, // Even lower threshold for branding
      reason: 'User explicitly defined narrative role as branding asset'
    },
    {
      keywords: ['background', 'scenery', 'environment', 'scene', 'setting', 'backdrop'],
      elevatedRole: 'background',
      qualityThreshold: 0.2,
      reason: 'User explicitly defined role as background scene'
    },
    {
      keywords: ['product', 'item', 'object', 'feature', 'showcase', 'highlight'],
      elevatedRole: 'primary',
      qualityThreshold: 0.4,
      reason: 'User explicitly defined as primary product/object to showcase'
    },
    {
      keywords: ['reference', 'style', 'inspiration', 'mood', 'aesthetic'],
      elevatedRole: 'reference',
      qualityThreshold: 0.3,
      reason: 'User explicitly defined as style/mood reference'
    }
  ];
  
  // Check each rule against the user description
  for (const rule of roleElevationRules) {
    const hasMatchingKeyword = rule.keywords.some(keyword => 
      userDescription.includes(keyword)
    );
    
    if (hasMatchingKeyword) {
      return {
        assetId: asset.id,
        originalRole: 'reference material', // Default fallback role
        elevatedRole: rule.elevatedRole,
        elevationReason: rule.reason,
        userDescription: asset.user_description,
        confidence: 0.9, // High confidence when user explicitly states role
        qualityThreshold: rule.qualityThreshold
      };
    }
  }
  
  return null;
}

// NEW: Session Mode Detection
export function detectSessionMode(analyzerData: AnalyzerInput): 'asset_driven' | 'asset_free' {
  const assets = analyzerData.assets || [];
  
  if (assets.length === 0) {
    return 'asset_free';
  }
  
  // Check if any assets are usable (quality > 0.3 or have meaningful content)
  const usableAssets = assets.filter(asset => 
    (asset.quality_score || 0) > 0.3 || 
    (asset.user_description && asset.user_description.length > 5) ||
    (asset.ai_caption && asset.ai_caption.length > 5)
  );
  
  return usableAssets.length > 0 ? 'asset_driven' : 'asset_free';
}

// NEW: Narrative Spine Generation
export function generateNarrativeSpine(
  analyzerData: AnalyzerInput, 
  sessionMode: 'asset_driven' | 'asset_free',
  creativeProfile?: any
): { intro: string; core: string[]; outro: string } {
  
  if (sessionMode === 'asset_free') {
    // Use profile default scaffolding
    const profileId = creativeProfile?.id || 'general';
    return getDefaultScaffolding(profileId);
  }
  
  // Asset-driven narrative spine
  const assets = analyzerData.assets || [];
  const userPrompt = analyzerData.user_request?.original_prompt || '';
  
  // Generate intro based on primary asset
  const primaryAsset = assets.find(asset => asset.quality_score && asset.quality_score >= 0.7) || assets[0];
  const intro = primaryAsset ? 
    `Open with ${primaryAsset.type} showcasing ${primaryAsset.user_description || primaryAsset.ai_caption}` :
    `Create engaging opening that introduces the main concept`;
  
  // Generate core content based on available assets
  const core: string[] = [];
  assets.forEach((asset, index) => {
    if (asset.quality_score && asset.quality_score >= 0.7) {
      core.push(`Feature ${asset.type} as primary content: ${asset.user_description || asset.ai_caption}`);
    } else {
      core.push(`Use ${asset.type} as supporting element or generation seed for ${asset.user_description || 'visual enhancement'}`);
    }
  });
  
  // Ensure we have at least 2 core elements
  if (core.length < 2) {
    core.push('Add complementary visuals to support the narrative');
    core.push('Include engaging transitions and effects');
  }
  
  // Generate outro
  const outro = `Conclude with strong call-to-action or summary that reinforces the main message`;
  
  return { intro, core, outro };
}

// NEW: Default Scaffolding for Asset-Free Mode
export function getDefaultScaffolding(profileId: string): { intro: string; core: string[]; outro: string } {
  const scaffolding: Record<string, { intro: string; core: string[]; outro: string }> = {
    'educational_explainer': {
      intro: 'Start with clear title and learning objective',
      core: [
        'Present key concepts with visual aids',
        'Use step-by-step explanations',
        'Include examples and demonstrations',
        'Add interactive elements or questions'
      ],
      outro: 'Summarize key points and provide next steps'
    },
    'finance_explainer': {
      intro: 'Market headline with ticker animation',
      core: [
        'Data chart visualization',
        'Expert voice-over explaining insights',
        'Relevant stock footage (trading floor, skyline)',
        'Key statistics and trends'
      ],
      outro: 'Summary call-to-action (subscribe, follow, learn more)'
    },
    'anime_mode': {
      intro: 'Dynamic stylized opening frame',
      core: [
        'Character spotlight with expressive pose',
        'Dialogue bubbles synced with TTS',
        'Energetic background music',
        'Action sequences with effects'
      ],
      outro: 'Flashy anime-style outro card'
    },
    'ugc_influencer': {
      intro: 'Personal introduction with authentic feel',
      core: [
        'Day-in-the-life content',
        'Product reviews or recommendations',
        'Behind-the-scenes moments',
        'Interactive Q&A or challenges'
      ],
      outro: 'Call-to-action for engagement (like, follow, comment)'
    },
    'ads_commercial': {
      intro: 'Attention-grabbing hook',
      core: [
        'Product benefits and features',
        'Social proof or testimonials',
        'Clear value proposition',
        'Urgency or scarcity elements'
      ],
      outro: 'Strong call-to-action with clear next steps'
    }
  };
  
  return scaffolding[profileId] || {
    intro: 'Create engaging opening that captures attention',
    core: [
      'Present main content with clear structure',
      'Use supporting visuals and effects',
      'Maintain consistent pacing and style'
    ],
    outro: 'End with memorable conclusion and call-to-action'
  };
}

// Multilingual enum normalization functions
export function normalizeImpactValue(impact: string): 'minor' | 'moderate' | 'major' {
  const impactMap: Record<string, 'minor' | 'moderate' | 'major'> = {
    // English
    'minor': 'minor',
    'moderate': 'moderate', 
    'major': 'major',
    // French
    'mineur': 'minor',
    'modéré': 'moderate',
    'majeur': 'major',
    // Spanish
    'menor': 'minor',
    'moderado': 'moderate',
    'mayor': 'major',
    // German
    'gering': 'minor',
    'mäßig': 'moderate',
    'groß': 'major',
    // Italian
    'minore': 'minor',
    'moderato': 'moderate',
    'maggiore': 'major',
    // Portuguese
    'menor': 'minor',
    'moderado': 'moderate',
    'maior': 'major'
  };
  
  return impactMap[impact.toLowerCase()] || 'moderate';
}

export function normalizePriorityValue(priority: string): 'required' | 'recommended' {
  const priorityMap: Record<string, 'required' | 'recommended'> = {
    // English
    'required': 'required',
    'recommended': 'recommended',
    'REQUIRED': 'required',
    'RECOMMENDED': 'recommended',
    // French
    'requis': 'required',
    'recommandé': 'recommended',
    'REQUIS': 'required',
    'RECOMMANDÉ': 'recommended',
    // Spanish
    'requerido': 'required',
    'recomendado': 'recommended',
    'REQUERIDO': 'required',
    'RECOMENDADO': 'recommended',
    // German
    'erforderlich': 'required',
    'empfohlen': 'recommended',
    'ERFORDERLICH': 'required',
    'EMPFOHLEN': 'recommended',
    // Italian
    'richiesto': 'required',
    'raccomandato': 'recommended',
    'RICHIESTA': 'required',
    'RACCOMANDATO': 'recommended',
    // Portuguese
    'necessário': 'required',
    'recomendado': 'recommended',
    'NECESSÁRIO': 'required',
    'RECOMENDADO': 'recommended'
  };
  
  return priorityMap[priority.toLowerCase()] || 'recommended';
}

export function normalizeContentComplexityValue(complexity: string): 'very_simple' | 'simple' | 'moderate' | 'complex' {
  const complexityMap: Record<string, 'very_simple' | 'simple' | 'moderate' | 'complex'> = {
    // English
    'very_simple': 'very_simple',
    'simple': 'simple',
    'moderate': 'moderate',
    'complex': 'complex',
    // French
    'très_simple': 'very_simple',
    'modéré': 'moderate',
    'complexe': 'complex',
    // Spanish
    'muy_simple': 'very_simple',
    'moderado': 'moderate',
    'complejo': 'complex',
    // German
    'sehr_einfach': 'very_simple',
    'einfach': 'simple',
    'mäßig': 'moderate',
    'komplex': 'complex',
    // Italian
    'molto_semplice': 'very_simple',
    'semplice': 'simple',
    'moderato': 'moderate',
    'complesso': 'complex',
    // Portuguese
    'muito_simples': 'very_simple',
    'simples': 'simple',
    'moderado': 'moderate',
    'complexo': 'complex'
  };
  
  return complexityMap[complexity.toLowerCase()] || 'moderate';
}

export function normalizeWorkloadValue(workload: string): 'low' | 'medium' | 'high' {
  const workloadMap: Record<string, 'low' | 'medium' | 'high'> = {
    // English
    'low': 'low',
    'medium': 'medium',
    'high': 'high',
    // French
    'faible': 'low',
    'moyen': 'medium',
    'élevé': 'high',
    // Spanish
    'bajo': 'low',
    'medio': 'medium',
    'alto': 'high',
    // German
    'niedrig': 'low',
    'mittel': 'medium',
    'hoch': 'high',
    // Italian
    'basso': 'low',
    'medio': 'medium',
    'alto': 'high',
    // Portuguese
    'baixo': 'low',
    'médio': 'medium',
    'alto': 'high'
  };
  
  return workloadMap[workload.toLowerCase()] || 'medium';
}

export function normalizeCompletionStatusValue(status: string): 'partial' | 'complete' {
  const statusMap: Record<string, 'partial' | 'complete'> = {
    // English
    'partial': 'partial',
    'complete': 'complete',
    // French
    'partiel': 'partial',
    'complet': 'complete',
    // Spanish
    'parcial': 'partial',
    'completo': 'complete',
    // German
    'teilweise': 'partial',
    'vollständig': 'complete',
    // Italian
    'parziale': 'partial',
    'completo': 'complete',
    // Portuguese
    'parcial': 'partial',
    'completo': 'complete'
  };
  
  return statusMap[status.toLowerCase()] || 'complete';
}

// Function to normalize multilingual refiner output to English
export function normalizeRefinerOutput(refinerData: any): RefinerOutput {
  const normalized = { ...refinerData };
  
  // Normalize content_type_analysis
  if (normalized.prompt_analysis?.content_type_analysis?.content_complexity) {
    normalized.prompt_analysis.content_type_analysis.content_complexity = 
      normalizeContentComplexityValue(normalized.prompt_analysis.content_type_analysis.content_complexity);
  }
  
  // Normalize creative_options
  if (normalized.creative_options) {
    normalized.creative_options = normalized.creative_options.map((option: any) => ({
      ...option,
      estimatedWorkload: option.estimatedWorkload ? normalizeWorkloadValue(option.estimatedWorkload) : option.estimatedWorkload
    }));
  }
  
  // Normalize quality_metrics
  if (normalized.quality_metrics?.completion_status) {
    normalized.quality_metrics.completion_status = 
      normalizeCompletionStatusValue(normalized.quality_metrics.completion_status);
  }
  
  // Normalize challenges
  if (normalized.challenges) {
    normalized.challenges = normalized.challenges.map((challenge: any) => ({
      ...challenge,
      impact: challenge.impact ? normalizeImpactValue(challenge.impact) : challenge.impact
    }));
  }
  
  // Normalize recommendations
  if (normalized.recommendations) {
    normalized.recommendations = normalized.recommendations.map((rec: any) => ({
      ...rec,
      priority: rec.priority ? normalizePriorityValue(rec.priority) : rec.priority
    }));
  }
  
  // Normalize asset recommended_edits
  if (normalized.assets) {
    normalized.assets = normalized.assets.map((asset: any) => {
      if (asset.recommended_edits) {
        asset.recommended_edits = asset.recommended_edits.map((edit: any) => {
          if (typeof edit === 'object' && edit.priority) {
            return {
              ...edit,
              priority: normalizePriorityValue(edit.priority)
            };
          }
          return edit;
        });
      }
      return asset;
    });
  }
  
  return normalized;
}

// Legacy exports for backward compatibility
export const RefinerOutputSchema = RefinerSchema;
