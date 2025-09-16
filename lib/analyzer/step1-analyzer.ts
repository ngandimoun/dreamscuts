/**
 * Step 1 Analyzer Implementation
 * 
 * This analyzer uses the existing models and auto-correction system
 * to perform real analysis on briefs. It's designed to be safe,
 * idempotent, and crash-resistant.
 */

import { z } from "zod";
import { executeWithAutoCorrection } from '@/lib/auto-corrector/services';
import { analyzeAllMediaInParallel, performComprehensiveReasoning, type ParallelAnalysisInput, type MediaAsset } from './parallel-media-analyzer';

// Analysis result schema
export const AnalysisSchema = z.object({
  intent: z.enum(["image", "video", "audio", "text"]),
  constraints: z.object({
    num_images: z.number().min(1).max(20).optional(),
    duration_seconds: z.number().min(5).max(180).optional(),
    max_length: z.number().min(100).max(5000).optional(),
  }),
  asset_plan: z.object({
    required_assets: z.array(z.string()),
    enhancement_needs: z.array(z.string()),
    processing_steps: z.array(z.string()),
  }),
  creative_options: z.array(z.object({
    label: z.string(),
    description: z.string(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    estimated_cost: z.number().optional(),
  })),
  media_analysis: z.object({
    vision: z.any().optional(),
    video: z.any().optional(),
    audio: z.any().optional(),
    text: z.any().optional(),
  }),
  recommendations: z.array(z.string()),
  confidence_score: z.number().min(0).max(1),
});

export type AnalysisResult = z.infer<typeof AnalysisSchema>;

// Brief interface (matches existing briefs table structure)
export interface Brief {
  id: string;
  brief_id: string;
  request: any;
  analysis?: any;
  plan?: any;
  status: string;
  user_id?: string;
  metadata?: any;
}

/**
 * Run the complete Step 1 analyzer on a brief
 * Uses existing models with auto-correction and fallbacks
 */
export async function runStep1Analyzer(brief: Brief): Promise<{
  ok: boolean;
  value?: AnalysisResult;
  error?: string;
}> {
  try {
    console.log(`[Analyzer] Starting analysis for brief ${brief.brief_id}`);

    // Step 1: Intent Detection using Together AI with auto-correction
    const intentResult = await detectIntent(brief);
    if (!intentResult.ok) {
      return { ok: false, error: `Intent detection failed: ${intentResult.error}` };
    }

    // Step 2: Media Analysis using existing analyzers with auto-correction
    const mediaAnalysisResult = await analyzeMedia(brief);
    if (!mediaAnalysisResult.ok) {
      console.warn(`[Analyzer] Media analysis failed: ${mediaAnalysisResult.error}, continuing with basic analysis`);
    }

    // Step 3: Asset Planning
    const assetPlanResult = await createAssetPlan(brief, intentResult.value!, mediaAnalysisResult.value);
    if (!assetPlanResult.ok) {
      return { ok: false, error: `Asset planning failed: ${assetPlanResult.error}` };
    }

    // Step 4: Creative Options Generation
    const creativeOptionsResult = await generateCreativeOptions(brief, intentResult.value!);
    if (!creativeOptionsResult.ok) {
      return { ok: false, error: `Creative options generation failed: ${creativeOptionsResult.error}` };
    }

    // Step 5: Recommendations
    const recommendationsResult = await generateRecommendations(brief, intentResult.value!, mediaAnalysisResult.value);
    if (!recommendationsResult.ok) {
      console.warn(`[Analyzer] Recommendations generation failed: ${recommendationsResult.error}`);
    }

    // Step 6: Assemble final result
    const finalResult: AnalysisResult = {
      intent: intentResult.value!.intent,
      constraints: intentResult.value!.constraints,
      asset_plan: assetPlanResult.value!,
      creative_options: creativeOptionsResult.value!,
      media_analysis: mediaAnalysisResult.value || {},
      recommendations: recommendationsResult.value || [],
      confidence_score: calculateConfidenceScore(intentResult.value!, mediaAnalysisResult.value)
    };

    // Step 7: Validate final result
    const validatedResult = AnalysisSchema.parse(finalResult);

    console.log(`[Analyzer] Analysis completed for brief ${brief.brief_id}`);
    return { ok: true, value: validatedResult };

  } catch (err: any) {
    console.error(`[Analyzer] Analysis failed for brief ${brief.brief_id}:`, err.message);
    return { ok: false, error: err.message };
  }
}

/**
 * Detect user intent using Together AI with auto-correction
 */
async function detectIntent(brief: Brief): Promise<{
  ok: boolean;
  value?: { intent: string; constraints: any };
  error?: string;
}> {
  try {
    const query = brief.request?.query || '';
    const assets = brief.request?.assets || [];

    const prompt = `Analyze this user request and determine the intent:

User Query: "${query}"
Assets: ${JSON.stringify(assets)}

Determine:
1. Primary intent: "image", "video", "audio", or "text"
2. Constraints based on intent:
   - For image: number of images needed (1-20)
   - For video: duration in seconds (5-180)
   - For audio: duration in seconds (5-180)
   - For text: maximum length in characters (100-5000)

Respond with valid JSON only:
{
  "intent": "image|video|audio|text",
  "constraints": {
    "num_images": number (if image),
    "duration_seconds": number (if video/audio),
    "max_length": number (if text)
  }
}`;

    const result = await executeWithAutoCorrection('together', {
      prompt,
      max_tokens: 500,
      temperature: 0.3
    });

    if (!result.success) {
      throw new Error(`Together AI failed: ${result.error}`);
    }

    const response = JSON.parse(result.data?.output?.choices?.[0]?.text || '{}');
    
    return {
      ok: true,
      value: {
        intent: response.intent || 'text',
        constraints: response.constraints || {}
      }
    };

  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * Analyze media using existing analyzers with auto-correction
 */
async function analyzeMedia(brief: Brief): Promise<{
  ok: boolean;
  value?: any;
  error?: string;
}> {
  try {
    const assets = brief.request?.assets || [];
    const query = brief.request?.query || '';
    
    console.log(`[Step1Analyzer] Starting parallel analysis of ${assets.length} assets for query: "${query}"`);
    
    // Convert assets to MediaAsset format
    const mediaAssets: MediaAsset[] = assets.map((asset, index) => ({
      id: asset.id || `asset-${index}`,
      url: asset.url || asset,
      mediaType: asset.mediaType || 'unknown',
      metadata: asset.metadata || {}
    }));
    
    // Perform parallel analysis
    const parallelInput: ParallelAnalysisInput = {
      query,
      assets: mediaAssets,
      userDescription: brief.request?.userDescription
    };
    
    const parallelResult = await analyzeAllMediaInParallel(parallelInput);
    
    if (!parallelResult.success) {
      throw new Error('Parallel analysis failed');
    }
    
    console.log(`[Step1Analyzer] Parallel analysis completed in ${parallelResult.totalProcessingTime}ms`);
    console.log(`[Step1Analyzer] Results: ${parallelResult.imageAnalysis.filter(r => r.success).length} images, ${parallelResult.videoAnalysis.filter(r => r.success).length} videos, ${parallelResult.audioAnalysis.filter(r => r.success).length} audios, ${parallelResult.textAnalysis.filter(r => r.success).length} texts`);
    
    // Perform comprehensive reasoning
    const reasoningResult = await performComprehensiveReasoning(parallelResult, query);
    
    if (!reasoningResult.success) {
      throw new Error(`Comprehensive reasoning failed: ${reasoningResult.error}`);
    }
    
    console.log(`[Step1Analyzer] Comprehensive reasoning completed with confidence: ${reasoningResult.confidence_score}`);
    
    // Return structured analysis result
    return {
      ok: true,
      value: {
        parallel_analysis: parallelResult,
        comprehensive_reasoning: reasoningResult,
        media_analysis: {
          vision: parallelResult.imageAnalysis,
          video: parallelResult.videoAnalysis,
          audio: parallelResult.audioAnalysis,
          text: parallelResult.textAnalysis
        },
        intent: reasoningResult.intent,
        constraints: reasoningResult.constraints,
        asset_plan: reasoningResult.asset_plan,
        creative_options: reasoningResult.creative_options,
        recommendations: reasoningResult.recommendations,
        confidence_score: reasoningResult.confidence_score,
        reasoning: reasoningResult.reasoning,
        processing_time: parallelResult.totalProcessingTime
      }
    };

  } catch (err: any) {
    console.error('Error in analyzeMedia:', err);
    return { ok: false, error: err.message };
  }
}

/**
 * Create asset processing plan
 */
async function createAssetPlan(brief: Brief, intent: any, mediaAnalysis: any): Promise<{
  ok: boolean;
  value?: any;
  error?: string;
}> {
  try {
    const assets = brief.request?.assets || [];
    const required_assets: string[] = [];
    const enhancement_needs: string[] = [];
    const processing_steps: string[] = [];

    // Analyze each asset and determine processing needs
    for (const asset of assets) {
      const assetUrl = asset.url || asset;
      const mediaType = asset.mediaType || 'unknown';
      
      required_assets.push(assetUrl);

      // Determine enhancement needs based on media type and analysis
      switch (mediaType) {
        case 'image':
          enhancement_needs.push(`Quality check and optimization for ${assetUrl}`);
          processing_steps.push(`Resize and optimize image: ${assetUrl}`);
          break;
        case 'video':
          enhancement_needs.push(`Video quality analysis and format optimization for ${assetUrl}`);
          processing_steps.push(`Transcode and optimize video: ${assetUrl}`);
          break;
        case 'audio':
          enhancement_needs.push(`Audio quality enhancement for ${assetUrl}`);
          processing_steps.push(`Normalize and enhance audio: ${assetUrl}`);
          break;
        case 'text':
          enhancement_needs.push(`Text content validation and formatting for ${assetUrl}`);
          processing_steps.push(`Process and format text: ${assetUrl}`);
          break;
      }
    }

    // Add intent-specific processing steps
    switch (intent.intent) {
      case 'image':
        processing_steps.push('Generate image variations');
        processing_steps.push('Apply style filters');
        break;
      case 'video':
        processing_steps.push('Create video transitions');
        processing_steps.push('Add effects and overlays');
        break;
      case 'audio':
        processing_steps.push('Mix and master audio');
        processing_steps.push('Add background music');
        break;
      case 'text':
        processing_steps.push('Format and structure content');
        processing_steps.push('Add visual elements');
        break;
    }

    return {
      ok: true,
      value: {
        required_assets,
        enhancement_needs,
        processing_steps
      }
    };

  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * Generate creative options using Together AI with auto-correction
 */
async function generateCreativeOptions(brief: Brief, intent: any): Promise<{
  ok: boolean;
  value?: any[];
  error?: string;
}> {
  try {
    const query = brief.request?.query || '';
    const intentType = intent.intent;

    const prompt = `Generate 3 creative approaches for this request:

User Query: "${query}"
Intent: ${intentType}
Constraints: ${JSON.stringify(intent.constraints)}

For each approach, provide:
- label: Short descriptive name
- description: Detailed explanation
- strengths: Array of advantages
- weaknesses: Array of limitations
- estimated_cost: Rough cost estimate (1-10 scale)

Respond with valid JSON array:
[
  {
    "label": "Approach 1 Name",
    "description": "Detailed description...",
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"],
    "estimated_cost": 5
  },
  ...
]`;

    const result = await executeWithAutoCorrection('together', {
      prompt,
      max_tokens: 800,
      temperature: 0.7
    });

    if (!result.success) {
      throw new Error(`Together AI failed: ${result.error}`);
    }

    const creativeOptions = JSON.parse(result.data?.output?.choices?.[0]?.text || '[]');
    
    return {
      ok: true,
      value: creativeOptions
    };

  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * Generate recommendations
 */
async function generateRecommendations(brief: Brief, intent: any, mediaAnalysis: any): Promise<{
  ok: boolean;
  value?: string[];
  error?: string;
}> {
  try {
    const query = brief.request?.query || '';
    const recommendations: string[] = [];

    // Add intent-specific recommendations
    switch (intent.intent) {
      case 'image':
        recommendations.push('Consider using high-resolution source images for best results');
        recommendations.push('Experiment with different artistic styles and filters');
        break;
      case 'video':
        recommendations.push('Ensure smooth transitions between video segments');
        recommendations.push('Consider adding background music or sound effects');
        break;
      case 'audio':
        recommendations.push('Use high-quality audio sources for better output');
        recommendations.push('Consider adding fade-in/fade-out effects');
        break;
      case 'text':
        recommendations.push('Structure content with clear headings and sections');
        recommendations.push('Use engaging visuals to complement the text');
        break;
    }

    // Add media analysis-based recommendations
    if (mediaAnalysis) {
      if (mediaAnalysis.image) {
        recommendations.push('Images detected - consider visual storytelling approach');
      }
      if (mediaAnalysis.video) {
        recommendations.push('Video content found - focus on dynamic presentation');
      }
      if (mediaAnalysis.audio) {
        recommendations.push('Audio elements present - ensure good audio-visual sync');
      }
    }

    return {
      ok: true,
      value: recommendations
    };

  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * Calculate confidence score based on analysis results
 */
function calculateConfidenceScore(intent: any, mediaAnalysis: any): number {
  let score = 0.5; // Base score

  // Intent detection confidence
  if (intent.intent && intent.constraints) {
    score += 0.2;
  }

  // Media analysis confidence
  if (mediaAnalysis) {
    const mediaTypes = Object.keys(mediaAnalysis);
    score += Math.min(mediaTypes.length * 0.1, 0.3);
  }

  return Math.min(score, 1.0);
}
