/**
 * 🎬 DREAMCUT QUERY ANALYZER - RICH JSON VERSION
 * 
 * This endpoint provides a comprehensive, creative director grade analysis
 * returning a rich JSON format ready for immediate consumption by the next pipeline steps.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { analyzeUserQuery } from '@/lib/analyzer/query-analyzer';
import { analyzeAssetsInParallel } from '@/lib/analyzer/step2-asset-analyzer';
import { combineQueryAndAssets } from '@/lib/analyzer/step3-combination-analyzer';
import { createFinalAnalysisOutput } from '@/lib/analyzer/step4-json-summarizer';
import { createClient } from '@supabase/supabase-js';

// Modern request schema matching the expected format
const QueryAnalyzerRequestSchema = z.object({
  userId: z.string(),
  prompt: z.string().min(1, 'Prompt is required'),
  intent: z.enum(['image', 'video', 'audio', 'mixed']).optional(),
  options: z.object({
    durationSeconds: z.number().optional(),
    aspectRatio: z.string().optional(),
    imageCount: z.number().optional(),
    platform: z.string().optional(),
  }).optional(),
  assets: z.array(
    z.object({
      url: z.string().url('Invalid asset URL'),
      type: z.enum(['image', 'video', 'audio']),
      filename: z.string(),
      userDescription: z.string().optional(),
    })
  ).default([]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request format
    const validationResult = QueryAnalyzerRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request format',
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { userId, prompt, intent, options, assets } = validationResult.data;

    console.log('🎬 DREAMCUT ANALYZER: Starting rich JSON analysis...');
    
    const analysisId = `dq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const start = Date.now();

    // Prepare assets with IDs
    const preparedAssets = assets.map((asset, index) => ({
      id: `ast_${asset.type.slice(0, 3)}${String(index + 1).padStart(2, '0')}`,
      ...asset,
      detectedMime: getMimeType(asset.type, asset.filename),
      sizeBytes: 0, // Would be fetched from actual file
      meta: {}, // Would be populated during analysis
      analysis: {}, // Will be populated by asset analyzer
      qualityScore: 0, // Will be calculated
    }));

    // STEP 1: Advanced Query Analysis
    console.log('📝 Step 1: Analyzing user query...');
    const queryAnalysis = await analyzeUserQuery(prompt, { 
      model_preference: 'auto',
      enable_creative_reframing: true,
      gap_detection_depth: 'comprehensive'
    });
    
    if (!queryAnalysis.success || !queryAnalysis.result) {
      throw new Error(`Query analysis failed: ${queryAnalysis.error}`);
    }

    // STEP 2: Parallel Asset Analysis
    console.log('🖼️ Step 2: Analyzing assets in parallel...');
    let assetAnalysisResults = null;
    let enrichedAssets = preparedAssets;
    
    if (assets.length > 0) {
      const assetAnalysis = await analyzeAssetsInParallel(
        assets.map((a, i) => ({
          ...a,
          id: preparedAssets[i].id,
          mediaType: a.type,
          userDescription: a.userDescription || a.metadata?.description,
          metadata: a.metadata || {},
        })),
        prompt
      );
      
      if (assetAnalysis.success && assetAnalysis.result) {
        assetAnalysisResults = assetAnalysis.result;
        
        // Enrich assets with analysis results
        enrichedAssets = preparedAssets.map((asset, index) => {
          const analysis = assetAnalysisResults.asset_analyses[index];
          if (!analysis) return asset;
          
          return {
            ...asset,
            sizeBytes: analysis.metadata.file_size || 0,
            meta: {
              resolution: analysis.metadata.dimensions 
                ? `${analysis.metadata.dimensions.width}x${analysis.metadata.dimensions.height}`
                : undefined,
              durationSeconds: analysis.metadata.duration_seconds,
              fps: analysis.metadata.fps,
              bitrate: analysis.metadata.bitrate,
              sampleRate: analysis.metadata.sample_rate,
              channels: analysis.metadata.channels,
            },
            analysis: {
              caption: analysis.content_analysis.primary_description,
              objects: analysis.content_analysis.objects_detected || [],
              style: analysis.content_analysis.style_analysis,
              mood: analysis.content_analysis.mood_assessment,
              transcript: analysis.content_analysis.transcript,
              language: analysis.content_analysis.detected_language,
              tone: analysis.content_analysis.detected_tone,
              scenes: analysis.content_analysis.scenes_detected || [],
              motion: analysis.content_analysis.motion_type,
              hasAudio: analysis.metadata.has_audio,
              recommendedEdits: deriveRecommendedEdits(analysis, queryAnalysis.result, options),
            },
            qualityScore: (analysis.metadata.quality_score || 5) / 10,
          };
        });
      }
    }

    // STEP 3: Creative Synthesis
    console.log('🎭 Step 3: Performing creative synthesis...');
    let combinedAnalysis = null;
    if (assetAnalysisResults && assets.length > 0) {
      combinedAnalysis = await combineQueryAndAssets(queryAnalysis.result, assetAnalysisResults);
    }

    // STEP 4: Final Summarization
    console.log('📊 Step 4: Creating final summarization...');
    let finalAnalysis = null;
    if (combinedAnalysis?.success && combinedAnalysis.result && assetAnalysisResults) {
      finalAnalysis = await createFinalAnalysisOutput(
        queryAnalysis.result,
        assetAnalysisResults,
        combinedAnalysis.result
      );
    }

    const processingTime = Date.now() - start;

    // Build the rich JSON response
    const richResponse = {
      id: analysisId,
      createdAt: new Date().toISOString(),
      userId,
      userPrompt: prompt,
      intent: intent || queryAnalysis.result.intent.primary_output_type,
      options: {
        durationSeconds: options?.durationSeconds || queryAnalysis.result.constraints.duration_seconds || 30,
        aspectRatio: options?.aspectRatio || queryAnalysis.result.constraints.aspect_ratio || '16:9',
        imageCount: options?.imageCount || queryAnalysis.result.constraints.image_count,
        platform: options?.platform || queryAnalysis.result.constraints.platform?.[0],
      },
      assets: enrichedAssets,
      globalAnalysis: buildGlobalAnalysis(
        queryAnalysis.result,
        assetAnalysisResults,
        combinedAnalysis?.result,
        finalAnalysis?.result,
        enrichedAssets,
        options
      ),
      creativeOptions: buildCreativeOptions(
        queryAnalysis.result,
        combinedAnalysis?.result,
        finalAnalysis?.result
      ),
      recommendedPipeline: buildRecommendedPipeline(
        queryAnalysis.result,
        enrichedAssets,
        combinedAnalysis?.result
      ),
      warnings: extractWarnings(
        queryAnalysis.result,
        assetAnalysisResults,
        combinedAnalysis?.result
      ),
    };

    // Store in Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        await supabase.from('dreamcut_queries').insert({
          id: analysisId,
          user_id: userId,
          payload: richResponse,
          status: 'analyzed',
          created_at: new Date().toISOString(),
        });
      } catch (dbError) {
        console.warn('⚠️ Failed to store in Supabase:', dbError);
      }
    }

    console.log(`✅ Rich JSON analysis completed in ${processingTime}ms`);
    
    return NextResponse.json(richResponse);

  } catch (error) {
    console.error('🚨 Analyzer error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed',
        details: error instanceof Error ? { stack: error.stack } : undefined,
      },
      { status: 500 }
    );
  }
}

// Helper functions to build the rich response
function getMimeType(type: string, filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  if (type === 'image') {
    const mimeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
    };
    return mimeMap[ext || ''] || 'image/jpeg';
  }
  
  if (type === 'video') {
    const mimeMap: Record<string, string> = {
      mp4: 'video/mp4',
      webm: 'video/webm',
      mov: 'video/quicktime',
      avi: 'video/x-msvideo',
    };
    return mimeMap[ext || ''] || 'video/mp4';
  }
  
  if (type === 'audio') {
    const mimeMap: Record<string, string> = {
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/ogg',
      m4a: 'audio/mp4',
    };
    return mimeMap[ext || ''] || 'audio/mpeg';
  }
  
  return 'application/octet-stream';
}

function deriveRecommendedEdits(
  analysis: any,
  queryAnalysis: any,
  options: any
): string[] {
  const edits: string[] = [];
  
  // Quality-based recommendations
  if (analysis.metadata.quality_score < 6) {
    edits.push('enhance-quality');
  }
  
  // Type-specific recommendations
  if (analysis.asset_type === 'image') {
    if (analysis.metadata.dimensions?.width < 1920) {
      edits.push('upscale');
    }
    if (queryAnalysis.modifiers.style?.length > 0) {
      edits.push('style-transfer');
    }
    edits.push('enhance-contrast');
  }
  
  if (analysis.asset_type === 'video') {
    if (options?.durationSeconds && analysis.metadata.duration_seconds > options.durationSeconds) {
      edits.push(`trim-to-${options.durationSeconds}s`);
    }
    if (analysis.metadata.dimensions?.width < 1920) {
      edits.push('upscale');
    }
    edits.push('adjust-color-grading');
  }
  
  if (analysis.asset_type === 'audio') {
    edits.push('normalize-volume');
    if (analysis.alignment_with_query.role_in_project === 'primary_content') {
      edits.push('sync-with-video');
    }
  }
  
  return edits;
}

function buildGlobalAnalysis(
  queryAnalysis: any,
  assetAnalysis: any,
  combinedAnalysis: any,
  finalAnalysis: any,
  enrichedAssets: any[],
  options: any
): any {
  const analysis = finalAnalysis || combinedAnalysis || {};
  
  return {
    goal: analysis.global_understanding?.unified_intent?.creative_direction ||
          `Produce ${queryAnalysis.normalized_prompt}`,
    constraints: {
      durationSeconds: options?.durationSeconds || queryAnalysis.constraints.duration_seconds,
      aspectRatio: options?.aspectRatio || queryAnalysis.constraints.aspect_ratio || '16:9',
      imageCount: options?.imageCount || queryAnalysis.constraints.image_count,
      platform: options?.platform || queryAnalysis.constraints.platform?.[0],
    },
    assetRoles: Object.fromEntries(
      enrichedAssets.map(asset => [
        asset.id,
        determineAssetRole(asset, queryAnalysis)
      ])
    ),
    conflicts: identifyConflicts(queryAnalysis, enrichedAssets, options),
  };
}

function determineAssetRole(asset: any, queryAnalysis: any): string {
  // Determine role based on asset analysis and query intent
  if (asset.analysis?.recommendedEdits?.includes('sync-with-video')) {
    return 'voiceover narration';
  }
  
  if (asset.type === queryAnalysis.intent.primary_output_type) {
    return 'primary footage';
  }
  
  if (asset.userDescription?.toLowerCase().includes('reference') ||
      asset.userDescription?.toLowerCase().includes('style')) {
    return 'style reference';
  }
  
  return 'supporting content';
}

function identifyConflicts(queryAnalysis: any, assets: any[], options: any): any[] {
  const conflicts: any[] = [];
  
  // Duration conflicts
  const videoAssets = assets.filter(a => a.type === 'video');
  videoAssets.forEach(asset => {
    if (options?.durationSeconds && asset.meta?.durationSeconds) {
      if (asset.meta.durationSeconds !== options.durationSeconds) {
        conflicts.push({
          issue: `Uploaded video is ${asset.meta.durationSeconds}s but target duration is ${options.durationSeconds}s`,
          resolution: asset.meta.durationSeconds > options.durationSeconds ? 'Trim or cut scenes' : 'Loop or extend footage',
        });
      }
    }
  });
  
  // Resolution conflicts
  const targetAspectRatio = options?.aspectRatio || '16:9';
  assets.forEach(asset => {
    if (asset.meta?.resolution) {
      const [width, height] = asset.meta.resolution.split('x').map(Number);
      const ratio = width / height;
      const targetRatio = targetAspectRatio === '16:9' ? 16/9 : 
                         targetAspectRatio === '1:1' ? 1 : 
                         targetAspectRatio === '9:16' ? 9/16 : 16/9;
      
      if (Math.abs(ratio - targetRatio) > 0.1) {
        conflicts.push({
          issue: `Asset aspect ratio (${asset.meta.resolution}) doesn't match target (${targetAspectRatio})`,
          resolution: 'Crop or add letterboxing',
        });
      }
    }
  });
  
  return conflicts;
}

function buildCreativeOptions(
  queryAnalysis: any,
  combinedAnalysis: any,
  finalAnalysis: any
): any[] {
  const options: any[] = [];
  
  // Add AI-generated creative options
  const creativeAlternatives = queryAnalysis.creative_reframing?.alternative_interpretations || [];
  creativeAlternatives.forEach((alt: any, index: number) => {
    options.push({
      id: `opt_${String.fromCharCode(65 + index)}`,
      title: alt.interpretation || `Creative Option ${index + 1}`,
      short: alt.reasoning || 'Alternative creative approach',
      reasons: alt.supporting_elements || ['creative variation'],
      estimatedWorkload: alt.confidence > 0.8 ? 'low' : alt.confidence > 0.6 ? 'medium' : 'high',
    });
  });
  
  // Add synthesis-based options if available
  if (combinedAnalysis?.creative_synthesis) {
    const synthesis = combinedAnalysis.creative_synthesis;
    
    if (synthesis.style_fusion_strategy) {
      options.push({
        id: `opt_style_${options.length}`,
        title: 'Style Fusion Approach',
        short: synthesis.style_fusion_strategy,
        reasons: ['leverage multiple styles', 'create unique aesthetic'],
        estimatedWorkload: 'medium',
      });
    }
    
    if (synthesis.narrative_structure) {
      options.push({
        id: `opt_narrative_${options.length}`,
        title: 'Narrative-Driven Structure',
        short: synthesis.narrative_structure,
        reasons: ['clear story progression', 'engaging flow'],
        estimatedWorkload: 'medium',
      });
    }
  }
  
  // Ensure at least 2 options
  if (options.length < 2) {
    options.push({
      id: 'opt_standard',
      title: 'Standard Production',
      short: 'Professional execution following best practices',
      reasons: ['reliable results', 'efficient processing'],
      estimatedWorkload: 'low',
    });
  }
  
  return options;
}

function buildRecommendedPipeline(
  queryAnalysis: any,
  assets: any[],
  combinedAnalysis: any
): any {
  const pipeline = combinedAnalysis?.production_recommendations?.recommended_pipeline || {
    preprocessing: [],
    generationModels: {},
    integration: '',
  };
  
  // Preprocessing steps
  const preprocessing: string[] = [];
  
  if (assets.some(a => a.qualityScore < 0.7)) {
    preprocessing.push('enhance asset quality');
  }
  
  if (assets.some(a => a.meta?.resolution && parseInt(a.meta.resolution.split('x')[0]) < 1920)) {
    preprocessing.push('upscale to HD/4K');
  }
  
  if (assets.some(a => a.type === 'audio')) {
    preprocessing.push('normalize audio levels');
  }
  
  if (queryAnalysis.modifiers.style?.includes('cyberpunk')) {
    preprocessing.push('apply cyberpunk color grading');
  }
  
  // Generation models
  const generationModels = {
    video: 'shotstack-edit',
    image: queryAnalysis.modifiers.style ? 'replicate-sdxl' : 'replicate-flux',
    audio: 'elevenlabs-enhance',
    text: 'together-ai-llama-3-1-405b',
  };
  
  // Integration strategy
  let integration = 'standard pipeline execution';
  if (assets.some(a => a.type === 'audio' && a.analysis?.transcript)) {
    integration = 'combine assets via Shotstack API with timing from voiceover';
  }
  
  return {
    preprocessing: preprocessing.length > 0 ? preprocessing : ['validate and prepare assets'],
    generationModels,
    integration,
  };
}

function extractWarnings(
  queryAnalysis: any,
  assetAnalysis: any,
  combinedAnalysis: any
): string[] {
  const warnings: string[] = [];
  
  // Check for gaps
  if (queryAnalysis.gaps.missing_style_direction) {
    warnings.push('No specific style direction provided - will use default styling');
  }
  
  if (queryAnalysis.gaps.missing_target_audience) {
    warnings.push('Target audience not specified - optimizing for general viewers');
  }
  
  // Check for quality issues
  if (assetAnalysis?.summary.overall_quality_score < 5) {
    warnings.push('Some assets have low quality - enhancement recommended');
  }
  
  // Check for technical issues
  if (combinedAnalysis?.gap_analysis?.identified_gaps?.some((g: any) => g.impact_level === 'critical')) {
    warnings.push('Critical gaps identified - manual review recommended');
  }
  
  return warnings;
}

export async function GET() {
  return NextResponse.json({
    name: 'DreamCut Query Analyzer - Rich JSON Version',
    description: 'Comprehensive creative director grade analysis with rich JSON output',
    version: '3.0-rich',
    expectedInput: {
      userId: 'string',
      prompt: 'string',
      intent: 'image | video | audio | mixed (optional)',
      options: {
        durationSeconds: 'number (optional)',
        aspectRatio: 'string (optional)',
        imageCount: 'number (optional)',
        platform: 'string (optional)',
      },
      assets: [{
        url: 'string',
        type: 'image | video | audio',
        filename: 'string',
        userDescription: 'string (optional)',
      }],
    },
    outputFormat: 'Rich JSON matching the example in docs',
    features: [
      'Creative director grade analysis',
      'Asset role determination',
      'Conflict detection and resolution',
      'Multiple creative options generation',
      'Pipeline recommendations',
      'Quality scoring',
      'Edit recommendations',
    ],
  });
}
