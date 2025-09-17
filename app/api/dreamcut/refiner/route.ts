/**
 * 🎬 DREAMCUT REFINER API - Step 2a: Polished JSON Upgrade
 * 
 * Bulletproof refiner worker that takes the CLEAN RICH JSON OUTPUT ESSENTIAL ANALYSIS DATA 
 * from the query-analyzer and upgrades it into a polished, confident, production-ready JSON format.
 * 
 * IMPORTANT: This endpoint expects ONLY the CLEAN RICH JSON OUTPUT ESSENTIAL ANALYSIS DATA
 * - No wrapper objects
 * - No legacy format handling  
 * - Direct analyzer JSON only
 * 
 * Features:
 * - Claude 3.5 Haiku (primary) for fast, structured JSON
 * - GPT-4o-mini (fallback) for reliability
 * - Zod validation for JSON safety (no crash guarantee)
 * - Supabase storage with Realtime broadcasting
 * - Analyzer stays untouched (additional safe layer)
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  RefinerSchema, 
  validateAnalyzerInput, 
  analyzeConfidenceLevels,
  analyzeCoreConcept,
  normalizeContentTypeAnalysis,
  analyzeAssetIntegration,
  analyzeAssetUtilization,
  detectSessionMode,
  generateNarrativeSpine,
  getDefaultScaffolding,
  type AnalyzerInput,
  type RefinerOutput
} from '@/lib/analyzer/refiner-schema';
import { assessRefinerQuality, validateRefinerQuality } from '@/lib/analyzer/refiner-quality-utils';
import { callLLM, validateLLMJSON } from '@/lib/llm';
import { generateRefinerPrompt, getPromptStats } from '@/lib/analyzer/refiner-prompt-library';
import { detectCreativeProfile, detectCreativeProfileEnhanced, applyCreativeProfile } from '@/lib/analyzer/creative-profiles';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Enhanced error handling interface
interface RefinerError {
  type: 'validation' | 'llm' | 'schema' | 'storage' | 'analysis';
  message: string;
  details?: any;
  recoverable: boolean;
}

// Quality assessment interface
interface QualityAssessment {
  overallScore: number;
  confidenceAnalysis: any;
  coreConceptAnalysis: any;
  contentTypeNormalization: any;
  assetIntegrationAnalysis: any;
  issues: string[];
  recommendations: string[];
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let analyzerData: AnalyzerInput;
  let qualityAssessment: QualityAssessment | null = null;
  
  try {
    const body = await req.json(); // Analyzer JSON from step 1
    
    console.log('🔧 [Refiner] Processing CLEAN RICH JSON OUTPUT...');
    console.log('🔧 [Refiner] Received body keys:', Object.keys(body));
    console.log('🔧 [Refiner] Body structure preview:', {
      hasUserRequest: !!body.user_request,
      hasPromptAnalysis: !!body.prompt_analysis,
      hasAssets: !!body.assets,
      hasGlobalAnalysis: !!body.global_analysis,
      hasCreativeDirection: !!body.creative_direction
    });

    // Enhanced validation with detailed error reporting
    try {
      analyzerData = validateAnalyzerInput(body);
      console.log('🔧 [Refiner] Input validation successful');
    } catch (validationError) {
      const error: RefinerError = {
        type: 'validation',
        message: 'Invalid CLEAN RICH JSON OUTPUT format',
        details: validationError,
        recoverable: false
      };
      
      console.error('🔧 [Refiner] Input validation failed:', error);
      console.error('🔧 [Refiner] CLEAN RICH JSON OUTPUT that failed validation:', JSON.stringify(body, null, 2));
      
      return NextResponse.json(
        { 
          error: error.message,
          type: error.type,
          details: process.env.NODE_ENV === 'development' ? error.details : undefined
        },
        { status: 400 }
      );
    }
    
    // Pre-processing quality assessment
    console.log('🔧 [Refiner] Running pre-processing quality assessment...');
    
    // Normalize content type analysis to fix contradictions
    const contentTypeNormalization = normalizeContentTypeAnalysis(analyzerData);
    if (contentTypeNormalization.needsCorrection) {
      console.log('🔧 [Refiner] Content type normalization applied:', contentTypeNormalization.contradictions);
      // Apply normalized analysis to analyzer data
      if (analyzerData.prompt_analysis) {
        analyzerData.prompt_analysis.content_type_analysis = contentTypeNormalization.normalizedAnalysis;
      }
    }
    
    // NEW: Asset Utilization Analysis
    console.log('🔧 [Refiner] Running asset utilization analysis...');
    const assetUtilizationAnalysis = analyzeAssetUtilization(analyzerData);
    const sessionMode = detectSessionMode(analyzerData);
    
    console.log('🔧 [Refiner] Asset utilization analysis:', {
      sessionMode,
      utilizationRate: assetUtilizationAnalysis.utilizationRate.toFixed(2),
      primaryAssets: assetUtilizationAnalysis.primaryAssets.length,
      referenceOnlyAssets: assetUtilizationAnalysis.referenceOnlyAssets.length,
      needsElevation: assetUtilizationAnalysis.needsElevation
    });
    
    if (assetUtilizationAnalysis.needsElevation) {
      console.log('🔧 [Refiner] Asset elevation suggestions:', assetUtilizationAnalysis.elevationSuggestions);
    }
    
    // Enhanced creative profile detection with multi-factor analysis
    const profileDetection = detectCreativeProfileEnhanced(analyzerData);
    const creativeProfile = profileDetection.profile;
    
    // Generate context-aware prompt based on asset mix
    const { prompt, assetMix, templateUsed } = generateRefinerPrompt(analyzerData);
    const promptStats = getPromptStats(analyzerData);
    
    console.log('🔧 [Refiner] Asset mix analysis:', {
      assetTypes: assetMix.assetTypes,
      totalAssets: assetMix.totalAssets,
      templateUsed,
      complexity: promptStats.complexity,
      estimatedTime: promptStats.estimatedProcessingTime
    });
    
    if (creativeProfile) {
      console.log('🎨 [Refiner] Creative profile detected:', {
        profileId: creativeProfile.id,
        profileName: creativeProfile.name,
        goal: creativeProfile.goal,
        confidence: profileDetection.confidence.toFixed(2),
        detectionMethod: profileDetection.detectionMethod,
        matchedFactors: profileDetection.matchedFactors.length > 0 
          ? profileDetection.matchedFactors.slice(0, 3) 
          : ['default_selection']
      });
      
      if (profileDetection.alternativeProfiles.length > 0) {
        console.log('🎨 [Refiner] Alternative profiles available:', 
          profileDetection.alternativeProfiles.map(alt => ({
            id: alt.profile.id,
            name: alt.profile.name,
            confidence: alt.confidence.toFixed(2)
          }))
        );
      }
    } else {
      console.log('🔧 [Refiner] No specific creative profile detected, using general refinement');
    }
    
    console.log('🔧 [Refiner] Using specialized prompt for:', templateUsed);
    console.log('🔧 [Refiner] Calling LLM for refinement...');
    
        // Call LLM with automatic fallback
        const llmResult = await callLLM(prompt, { 
          model: 'claude-3.5-haiku',
          maxTokens: 2048,
          temperature: 0.1
        });
    
    if (!llmResult.success) {
      console.error('🔧 [Refiner] LLM call failed:', llmResult.error);
      return NextResponse.json(
        { error: `LLM processing failed: ${llmResult.error}` },
        { status: 500 }
      );
    }
    
    console.log(`🔧 [Refiner] LLM generated ${llmResult.text.length} chars using ${llmResult.modelUsed}`);
    
    // Parse and validate JSON output
    const jsonValidation = validateLLMJSON(llmResult.text);
    
    if (!jsonValidation.isValid) {
      console.error('🔧 [Refiner] JSON parsing failed:', jsonValidation.error);
      console.error('🔧 [Refiner] LLM raw output:', llmResult.text);
      return NextResponse.json(
        { error: `Invalid JSON from LLM: ${jsonValidation.error}` },
        { status: 500 }
      );
    }
    
    console.log('🔧 [Refiner] LLM generated JSON structure:', {
      hasUserRequest: !!jsonValidation.parsedJSON.user_request,
      hasPromptAnalysis: !!jsonValidation.parsedJSON.prompt_analysis,
      hasAssets: !!jsonValidation.parsedJSON.assets,
      hasGlobalAnalysis: !!jsonValidation.parsedJSON.global_analysis,
      hasCreativeDirection: !!jsonValidation.parsedJSON.creative_direction,
      hasProductionPipeline: !!jsonValidation.parsedJSON.production_pipeline,
      hasQualityMetrics: !!jsonValidation.parsedJSON.quality_metrics,
      hasChallenges: !!jsonValidation.parsedJSON.challenges,
      hasRecommendations: !!jsonValidation.parsedJSON.recommendations
    });
    
    // Add missing refiner_extensions if LLM didn't generate them
    let llmJson = jsonValidation.parsedJSON;
    if (!llmJson.refiner_extensions) {
      console.log('🔧 [Refiner] Adding missing refiner_extensions...');
      
      // Generate narrative spine
      const narrativeSpine = generateNarrativeSpine(analyzerData, sessionMode, creativeProfile);
      
      // Generate default scaffolding for asset-free mode
      const defaultScaffolding = sessionMode === 'asset_free' ? {
        [creativeProfile?.id || 'general']: getDefaultScaffolding(creativeProfile?.id || 'general')
      } : undefined;
      
      llmJson.refiner_extensions = {
        session_mode: sessionMode,
        narrative_spine: narrativeSpine,
        default_scaffolding: defaultScaffolding,
        asset_utilization_summary: {
          total_assets: analyzerData.assets?.length || 0,
          utilized_assets: assetUtilizationAnalysis.primaryAssets.length + assetUtilizationAnalysis.referenceOnlyAssets.length,
          utilization_rate: assetUtilizationAnalysis.utilizationRate,
          primary_assets: assetUtilizationAnalysis.primaryAssets,
          reference_only_assets: assetUtilizationAnalysis.referenceOnlyAssets,
          utilization_rationale: assetUtilizationAnalysis.utilizationRationale
        },
        // NEW: Asset Role Elevation based on user descriptions
        asset_role_elevation: {
          rules: [
            {
              match_on: "user_description",
              keywords: ["main character", "protagonist", "hero", "central figure", "main subject", "primary character", "lead character"],
              action: "elevate_to_primary",
              conditions: {
                min_quality_score: 0.3
              },
              reason: "User explicitly defined narrative role as main character"
            },
            {
              match_on: "user_description",
              keywords: ["logo", "brand mark", "watermark", "branding", "company logo", "brand identity"],
              action: "elevate_to_branding",
              conditions: {
                min_quality_score: 0.2
              },
              reason: "User explicitly defined narrative role as branding asset"
            },
            {
              match_on: "user_description",
              keywords: ["background", "scenery", "environment", "scene", "setting", "backdrop"],
              action: "assign_as_background",
              conditions: {
                min_quality_score: 0.2
              },
              reason: "User explicitly defined role as background scene"
            }
          ],
          default_behavior: "reference_only"
        },
        elevation_applied: assetUtilizationAnalysis.assetRoleElevations.map(elevation => ({
          asset_id: elevation.assetId,
          original_role: elevation.originalRole,
          elevated_role: elevation.elevatedRole,
          elevation_reason: elevation.elevationReason,
          user_description: elevation.userDescription,
          confidence: elevation.confidence,
          quality_threshold: elevation.qualityThreshold
        }))
      };
    }

    // Add missing or normalize utilization_level to assets
    if (llmJson.assets && Array.isArray(llmJson.assets)) {
      llmJson.assets = llmJson.assets.map((asset: any) => {
        // Map non-standard utilization levels to standard ones
        let utilizationLevel = asset.utilization_level;
        
        // If no utilization_level or it's a non-standard value, map it
        if (!utilizationLevel || 
            !["primary_subject", "primary_footage", "seed_for_generation", 
              "supporting_visual", "background_element", "reference_only", 
              "primary_visual", "main_visual_anchor"].includes(utilizationLevel)) {
          
          // Determine the appropriate utilization level
          if (assetUtilizationAnalysis.primaryAssets.includes(asset.id)) {
            // For primary assets, use appropriate type based on asset type
            if (asset.type === 'image') {
              utilizationLevel = 'primary_subject';
            } else if (asset.type === 'video') {
              utilizationLevel = 'primary_footage';
            } else {
              utilizationLevel = 'primary_subject'; // Default for other types
            }
          } else if (assetUtilizationAnalysis.referenceOnlyAssets.includes(asset.id)) {
            utilizationLevel = 'seed_for_generation';
          } else {
            utilizationLevel = 'supporting_visual';
          }
        }
        
        // Handle specific non-standard values that might come from LLM
        if (utilizationLevel === 'primary_visual') {
          utilizationLevel = 'primary_subject';
        }
        if (utilizationLevel === 'main_visual_anchor') {
          utilizationLevel = 'primary_subject';
        }
        
        return {
          ...asset,
          utilization_level: utilizationLevel
        };
      });
    }

    // Add missing asset_utilization_score to quality_metrics
    if (llmJson.quality_metrics && typeof llmJson.quality_metrics === 'object') {
      if (typeof llmJson.quality_metrics.asset_utilization_score === 'undefined') {
        llmJson.quality_metrics.asset_utilization_score = assetUtilizationAnalysis.utilizationRate;
      }
    }

    // Enhanced schema validation with detailed error reporting and auto-fixes
    let validatedRefinerJson: RefinerOutput;
    try {
      validatedRefinerJson = RefinerSchema.parse(llmJson);
      console.log('🔧 [Refiner] Schema validation successful');
    } catch (schemaError: any) {
      console.error('🔧 [Refiner] Schema validation failed:', {
        type: 'schema',
        message: 'Schema validation failed',
        details: schemaError
      });
      
      // Attempt to fix common schema issues
      let fixedJson = { ...llmJson };
      let fixAttempted = false;
      
      // Check if we have ZodError with issues
      if (schemaError.issues && Array.isArray(schemaError.issues)) {
        console.log('🔧 [Refiner] Attempting to fix schema issues...');
        
        // Process each issue
        schemaError.issues.forEach((issue: any) => {
          // Handle invalid enum values
          if (issue.code === 'invalid_enum_value' && issue.path) {
            const path = issue.path;
            
            // Fix utilization_level issues
            if (path.includes('utilization_level')) {
              console.log(`🔧 [Refiner] Fixing invalid utilization_level: ${issue.received}`);
              
              // Get the asset index
              const assetIndex = path[path.indexOf('assets') + 1];
              
              if (fixedJson.assets && Array.isArray(fixedJson.assets) && fixedJson.assets[assetIndex]) {
                // Map to a valid value
                const asset = fixedJson.assets[assetIndex];
                if (asset.type === 'image') {
                  fixedJson.assets[assetIndex].utilization_level = 'primary_subject';
                } else if (asset.type === 'video') {
                  fixedJson.assets[assetIndex].utilization_level = 'primary_footage';
                } else {
                  fixedJson.assets[assetIndex].utilization_level = 'supporting_visual';
                }
                fixAttempted = true;
              }
            }
            
            // Fix priority issues in recommendations
            if (path.includes('priority')) {
              console.log(`🔧 [Refiner] Fixing invalid priority: ${issue.received}`);
              
              // Get the recommendation index
              const recIndex = path[path.indexOf('recommendations') + 1];
              
              if (fixedJson.recommendations && Array.isArray(fixedJson.recommendations) && 
                  fixedJson.recommendations[recIndex]) {
                // Normalize to lowercase
                const priority = fixedJson.recommendations[recIndex].priority;
                if (typeof priority === 'string') {
                  fixedJson.recommendations[recIndex].priority = priority.toLowerCase();
                  fixAttempted = true;
                }
              }
            }
          }
        });
        
        // Try validation again with fixed JSON
        if (fixAttempted) {
          try {
            console.log('🔧 [Refiner] Retrying validation with fixed JSON');
            validatedRefinerJson = RefinerSchema.parse(fixedJson);
            console.log('🔧 [Refiner] Schema validation successful after fixes');
            llmJson = fixedJson; // Update the JSON with our fixes
          } catch (retryError) {
            console.log('🔧 [Refiner] Schema validation still failed after fixes');
            console.log('🔧 [Refiner] Invalid JSON structure:', JSON.stringify(llmJson, null, 2));
            
            return NextResponse.json(
              { 
                error: 'Schema validation failed even after attempted fixes',
                type: 'schema',
                details: process.env.NODE_ENV === 'development' ? retryError : undefined
              },
              { status: 500 }
            );
          }
        } else {
          console.log('🔧 [Refiner] No automatic fixes available for these issues');
          console.log('🔧 [Refiner] Invalid JSON structure:', JSON.stringify(llmJson, null, 2));
          
          return NextResponse.json(
            { 
              error: 'Schema validation failed',
              type: 'schema',
              details: process.env.NODE_ENV === 'development' ? schemaError : undefined
            },
            { status: 500 }
          );
        }
      } else {
        const error: RefinerError = {
          type: 'schema',
          message: 'Schema validation failed',
          details: schemaError,
          recoverable: false
        };
        
        console.error('🔧 [Refiner] Invalid JSON structure:', JSON.stringify(llmJson, null, 2));
        
        return NextResponse.json(
          { 
            error: error.message,
            type: error.type,
            details: process.env.NODE_ENV === 'development' ? error.details : undefined
          },
          { status: 500 }
        );
      }
    }
    
    // Apply creative profile if detected
    let finalRefinerJson = validatedRefinerJson;
    if (creativeProfile) {
      console.log('🎨 [Refiner] Applying creative profile:', creativeProfile.name);
      finalRefinerJson = applyCreativeProfile(validatedRefinerJson, creativeProfile);
      console.log('🎨 [Refiner] Creative profile applied successfully');
    }
    
    // Asset utilization extensions are already added before schema validation
    console.log('🔧 [Refiner] Asset utilization extensions already applied');
    
    // Comprehensive quality assessment using new utilities
    console.log('🔧 [Refiner] Running comprehensive quality assessment...');
    
    const qualityValidation = validateRefinerQuality(analyzerData, finalRefinerJson);
    const qualityReport = qualityValidation.report;
    
    // Log quality assessment results
    console.log('🔧 [Refiner] Quality assessment completed:', {
      overallScore: qualityReport.overallScore.toFixed(2),
      grade: qualityReport.grade,
      issuesCount: qualityReport.issues.length,
      recommendationsCount: qualityReport.recommendations.length,
      isValid: qualityValidation.isValid
    });
    
    // Log specific issues if any
    if (qualityReport.issues.length > 0) {
      console.log('🔧 [Refiner] Quality issues detected:', qualityReport.issues.map(issue => ({
        type: issue.type,
        severity: issue.severity,
        message: issue.message
      })));
    }
    
    // Create legacy format for backward compatibility
    qualityAssessment = {
      overallScore: qualityReport.overallScore,
      confidenceAnalysis: {
        analyzerConfidence: analyzerData.quality_metrics?.overall_confidence || 0.5,
        refinerConfidence: finalRefinerJson.quality_metrics?.overall_confidence || 0.75,
        confidenceGap: qualityReport.metrics.confidenceGap,
        isOverCorrected: qualityReport.metrics.confidenceGap > 0.3,
        needsNormalization: qualityReport.metrics.confidenceGap > 0.2
      },
      coreConceptAnalysis: {
        hasPlaceholder: qualityReport.metrics.hasPlaceholders,
        placeholderValue: qualityReport.metrics.hasPlaceholders ? finalRefinerJson.creative_direction?.core_concept : null,
        conceptStrength: qualityReport.metrics.coreConceptStrength > 0.8 ? 'strong' : 
                        qualityReport.metrics.coreConceptStrength > 0.5 ? 'moderate' : 'weak',
        needsEnhancement: qualityReport.metrics.coreConceptStrength < 0.7
      },
      contentTypeNormalization,
      assetIntegrationAnalysis: {
        meaningfulIntegration: qualityReport.metrics.assetIntegrationScore > 0.6,
        assetContextEmbedded: qualityReport.metrics.assetIntegrationScore > 0.4,
        roleClarity: qualityReport.metrics.assetIntegrationScore > 0.7 ? 'clear' : 
                    qualityReport.metrics.assetIntegrationScore > 0.4 ? 'unclear' : 'missing',
        integrationScore: qualityReport.metrics.assetIntegrationScore,
        issues: qualityReport.issues.filter(issue => issue.type === 'integration').map(issue => issue.message)
      },
      issues: qualityReport.issues.map(issue => issue.message),
      recommendations: qualityReport.recommendations
    };
    
    // Store in Supabase (bulletproof storage)
    try {
      const refinerId = `ref_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      
      const { error: insertError } = await supabase
        .from('dreamcut_refiner')
        .insert({
          id: refinerId,
          analyzer_id: analyzerData.id || null,
          payload: finalRefinerJson,
          model_used: llmResult.modelUsed,
          processing_time_ms: llmResult.processingTimeMs,
          retry_count: llmResult.retryCount,
          template_used: templateUsed,
          asset_mix: assetMix.assetTypes,
          complexity: promptStats.complexity,
          creative_profile: creativeProfile?.id || null,
          // Add profile_detection data if available (safely handle old DB schema)
          ...(creativeProfile ? {
            profile_detection: {
              profile_id: creativeProfile.id,
              confidence: profileDetection.confidence,
              detection_method: profileDetection.detectionMethod,
              matched_factors_count: profileDetection.matchedFactors.length,
              alternative_profiles_count: profileDetection.alternativeProfiles.length
            }
          } : {}),
          created_at: new Date().toISOString(),
        });
      
      if (insertError) {
        console.error('🔧 [Refiner] Supabase insert failed:', insertError);
        return NextResponse.json(
          { error: `Database storage failed: ${insertError.message}` },
          { status: 500 }
        );
      }
      
      console.log('🔧 [Refiner] Stored in Supabase:', refinerId);
      
      // Broadcast via Supabase Realtime (optional)
      try {
        await supabase.channel('dreamcut').send({
          type: 'broadcast',
          event: 'refined',
          payload: {
            refinerId,
            modelUsed: llmResult.modelUsed,
            processingTimeMs: llmResult.processingTimeMs,
            timestamp: new Date().toISOString(),
            creativeProfile: creativeProfile?.id || null,
            profileConfidence: creativeProfile ? profileDetection.confidence : 0,
            detectionMethod: creativeProfile ? profileDetection.detectionMethod : 'none'
          }
        });
        console.log('🔧 [Refiner] Broadcasted via Realtime');
      } catch (broadcastError) {
        console.warn('🔧 [Refiner] Realtime broadcast failed (non-critical):', broadcastError);
        // Don't fail the request if broadcast fails
      }
      
    } catch (dbError) {
      const error: RefinerError = {
        type: 'storage',
        message: 'Database operation failed',
        details: dbError,
        recoverable: true
      };
      
      console.error('🔧 [Refiner] Database operation failed:', error);
      return NextResponse.json(
        { 
          error: error.message,
          type: error.type,
          details: process.env.NODE_ENV === 'development' ? error.details : undefined
        },
        { status: 500 }
      );
    }
    
    // Return the refined JSON with quality assessment
    const processingTime = Date.now() - startTime;
    
    return NextResponse.json({
      ...finalRefinerJson,
      _metadata: {
        refinerId: `ref_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
        processingTimeMs: processingTime,
        modelUsed: llmResult.modelUsed,
        templateUsed,
        creativeProfile: creativeProfile?.id || null,
        profileDetection: creativeProfile ? {
          profileId: creativeProfile.id,
          profileName: creativeProfile.name,
          confidence: profileDetection.confidence,
          detectionMethod: profileDetection.detectionMethod,
          matchedFactors: profileDetection.matchedFactors.slice(0, 5),
          alternativeProfiles: profileDetection.alternativeProfiles.map(alt => ({
            id: alt.profile.id,
            name: alt.profile.name,
            confidence: alt.confidence
          }))
        } : null,
        qualityAssessment: qualityAssessment ? {
          overallScore: qualityAssessment.overallScore,
          grade: qualityReport.grade,
          issuesCount: qualityAssessment.issues.length,
          recommendationsCount: qualityAssessment.recommendations.length,
          hasIssues: qualityAssessment.issues.length > 0,
          confidenceGap: qualityAssessment.confidenceAnalysis.confidenceGap,
          hasPlaceholder: qualityAssessment.coreConceptAnalysis.hasPlaceholder,
          assetIntegrationScore: qualityAssessment.assetIntegrationAnalysis.integrationScore,
          assetUtilizationScore: assetUtilizationAnalysis.utilizationRate,
          sessionMode: sessionMode,
          utilizationRate: assetUtilizationAnalysis.utilizationRate,
          primaryAssetsCount: assetUtilizationAnalysis.primaryAssets.length,
          referenceOnlyAssetsCount: assetUtilizationAnalysis.referenceOnlyAssets.length,
          isValid: qualityValidation.isValid,
          detailedIssues: qualityReport.issues.map(issue => ({
            type: issue.type,
            severity: issue.severity,
            message: issue.message,
            suggestion: issue.suggestion
          }))
        } : null
      }
    });
    
  } catch (err: any) {
    const refinerError: RefinerError = {
      type: 'analysis',
      message: 'Unexpected error during refinement',
      details: err,
      recoverable: false
    };
    
    console.error('🔧 [Refiner] Unexpected error:', refinerError);
    return NextResponse.json(
      { 
        error: refinerError.message,
        type: refinerError.type,
        details: process.env.NODE_ENV === 'development' ? refinerError.details : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'DreamCut Refiner API - Step 2a: Polished JSON Upgrade',
    description: 'Upgrades raw analyzer JSON into polished, production-ready JSON format',
    version: '1.0.0',
    features: [
      'Claude 3.5 Haiku primary model for fast JSON generation',
      'GPT-4o-mini fallback for reliability',
      'Zod validation for JSON safety',
      'Supabase storage integration',
      'Batch processing support',
      'Health check endpoints',
    ],
    expectedInput: {
      analyzerJson: 'CLEAN RICH JSON OUTPUT ESSENTIAL ANALYSIS DATA from query-analyzer (direct, no wrapper)',
      options: {
        useFallback: 'boolean (optional) - force GPT-4o-mini',
        maxRetries: 'number (optional) - max retry attempts',
        timeoutMs: 'number (optional) - timeout in milliseconds',
        enableLogging: 'boolean (optional) - enable detailed logging',
      },
      metadata: {
        userId: 'string (optional) - user identifier',
        sessionId: 'string (optional) - session identifier',
        source: 'string (optional) - source of the request',
      },
    },
    outputFormat: 'Polished Refiner JSON with enhanced confidence and structure',
    models: {
      primary: 'Claude 3 Haiku (fast + structured)',
      fallback: 'GPT-4o-mini (reliable backup)',
    },
    validation: 'Zod schema validation for both input and output',
    storage: 'Supabase integration for result persistence',
  });
}

// Health check endpoint
export async function HEAD() {
  try {
    // Import health check function
    const { refinerServiceHealthCheck } = await import('@/lib/analyzer/refiner-service');
    
    const health = await refinerServiceHealthCheck();
    
    if (health.healthy) {
      return new NextResponse(null, { status: 200 });
    } else {
      return new NextResponse(null, { status: 503 });
    }
  } catch (error) {
    return new NextResponse(null, { status: 503 });
  }
}
