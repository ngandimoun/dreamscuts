/**
 * Parallel Media Analyzer
 * 
 * Analyzes all media types in parallel for comprehensive Step 1 analysis
 * Processes text query, images, videos, and audio simultaneously
 * Then performs final reasoning comprehension
 */

import { analyzeTextAsset } from "../../executors/text-asset-analyzer";
import { analyzeImageAsset } from "../../executors/image-asset-analyzer";
import { analyzeVideoAsset } from "../../executors/video-asset-analyzer";
import { analyzeAudioAsset } from "../../executors/audio-asset-analyzer";

// Types for parallel analysis
export interface MediaAsset {
  id: string;
  url: string;
  mediaType: 'image' | 'video' | 'audio' | 'text';
  metadata?: {
    description?: string;
    [key: string]: any;
  };
}

export interface ParallelAnalysisInput {
  query: string;
  assets: MediaAsset[];
  userDescription?: string;
}

export interface MediaAnalysisResult {
  mediaType: 'image' | 'video' | 'audio' | 'text';
  assetId: string;
  assetUrl: string;
  success: boolean;
  result?: string;
  model?: string;
  error?: string;
  processingTime?: number;
  fallbackUsed?: boolean;
}

export interface ParallelAnalysisResult {
  success: boolean;
  queryAnalysis: MediaAnalysisResult | null;
  imageAnalysis: MediaAnalysisResult[];
  videoAnalysis: MediaAnalysisResult[];
  audioAnalysis: MediaAnalysisResult[];
  textAnalysis: MediaAnalysisResult[];
  totalProcessingTime: number;
  errors: string[];
}

export interface ComprehensiveReasoningResult {
  success: boolean;
  intent: string;
  constraints: {
    num_images?: number;
    duration_seconds?: number;
    max_length?: number;
  };
  asset_plan: {
    required_assets: string[];
    enhancement_needs: string[];
    processing_steps: string[];
  };
  creative_options: Array<{
    label: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
    estimated_cost?: number;
  }>;
  media_analysis: {
    vision: any;
    video: any;
    audio: any;
    text: any;
  };
  recommendations: string[];
  confidence_score: number;
  reasoning: string;
  error?: string;
}

/**
 * Analyze all media types in parallel
 */
export async function analyzeAllMediaInParallel(
  input: ParallelAnalysisInput
): Promise<ParallelAnalysisResult> {
  const startTime = Date.now();
  const { query, assets, userDescription } = input;
  
  console.log(`[ParallelAnalyzer] Starting parallel analysis of ${assets.length} assets`);
  
  // Separate assets by type
  const images = assets.filter(asset => asset.mediaType === 'image');
  const videos = assets.filter(asset => asset.mediaType === 'video');
  const audios = assets.filter(asset => asset.mediaType === 'audio');
  const texts = assets.filter(asset => asset.mediaType === 'text');
  
  console.log(`[ParallelAnalyzer] Found: ${images.length} images, ${videos.length} videos, ${audios.length} audios, ${texts.length} texts`);
  
  // Create all analysis promises
  const analysisPromises: Promise<MediaAnalysisResult>[] = [];
  
  // 1. Analyze the main query text
  if (query.trim()) {
    analysisPromises.push(
      analyzeTextQuery(query, userDescription)
    );
  }
  
  // 2. Analyze all images in parallel
  images.forEach(image => {
    analysisPromises.push(
      analyzeImageAsset({
        imageUrl: image.url,
        prompt: `ANALYZE USER INTENT AND PURPOSE: ${query}`,
        userDescription: image.metadata?.description || userDescription,
        analysisType: 'visual_qa',
        maxRetries: 3
      }, {
        timeout: 15000,
        enableFallback: true,
        logLevel: 'info'
      }).then(result => ({
        mediaType: 'image' as const,
        assetId: image.id,
        assetUrl: image.url,
        success: result.success,
        result: result.success ? result.result : undefined,
        model: result.model,
        error: result.error,
        processingTime: result.processingTime,
        fallbackUsed: result.fallbackUsed
      })).catch(error => ({
        mediaType: 'image' as const,
        assetId: image.id,
        assetUrl: image.url,
        success: false,
        error: error.message,
        processingTime: 0
      }))
    );
  });
  
  // 3. Analyze all videos in parallel
  videos.forEach(video => {
    analysisPromises.push(
      analyzeVideoAsset({
        videoUrl: video.url,
        prompt: `ANALYZE USER INTENT AND PURPOSE: ${query}`,
        userDescription: video.metadata?.description || userDescription,
        analysisType: 'content_analysis',
        maxRetries: 3
      }, {
        timeout: 30000,
        enableFallback: true,
        logLevel: 'info'
      }).then(result => ({
        mediaType: 'video' as const,
        assetId: video.id,
        assetUrl: video.url,
        success: result.success,
        result: result.success ? result.result : undefined,
        model: result.model,
        error: result.error,
        processingTime: result.processingTime,
        fallbackUsed: result.fallbackUsed
      })).catch(error => ({
        mediaType: 'video' as const,
        assetId: video.id,
        assetUrl: video.url,
        success: false,
        error: error.message,
        processingTime: 0
      }))
    );
  });
  
  // 4. Analyze all audios in parallel
  audios.forEach(audio => {
    analysisPromises.push(
      analyzeAudioAsset({
        audioUrl: audio.url,
        prompt: `ANALYZE USER INTENT AND PURPOSE: ${query}`,
        userDescription: audio.metadata?.description || userDescription,
        analysisType: 'content_summarization',
        maxRetries: 3
      }, {
        timeout: 30000,
        enableFallback: true,
        logLevel: 'info'
      }).then(result => ({
        mediaType: 'audio' as const,
        assetId: audio.id,
        assetUrl: audio.url,
        success: result.success,
        result: result.success ? result.result : undefined,
        model: result.model,
        error: result.error,
        processingTime: result.processingTime,
        fallbackUsed: result.fallbackUsed
      })).catch(error => ({
        mediaType: 'audio' as const,
        assetId: audio.id,
        assetUrl: audio.url,
        success: false,
        error: error.message,
        processingTime: 0
      }))
    );
  });
  
  // 5. Analyze all text assets in parallel
  texts.forEach(text => {
    analysisPromises.push(
      analyzeTextAsset({
        text: text.url, // Assuming URL contains text content or is a text file
        prompt: `ANALYZE USER INTENT AND PURPOSE: ${query}`,
        userDescription: text.metadata?.description || userDescription,
        analysisType: 'content_summarization',
        maxRetries: 3
      }, {
        timeout: 30000,
        enableFallback: true,
        logLevel: 'info'
      }).then(result => ({
        mediaType: 'text' as const,
        assetId: text.id,
        assetUrl: text.url,
        success: result.success,
        result: result.success ? result.result : undefined,
        model: result.model,
        error: result.error,
        processingTime: result.processingTime,
        fallbackUsed: result.fallbackUsed
      })).catch(error => ({
        mediaType: 'text' as const,
        assetId: text.id,
        assetUrl: text.url,
        success: false,
        error: error.message,
        processingTime: 0
      }))
    );
  });
  
  console.log(`[ParallelAnalyzer] Executing ${analysisPromises.length} analysis tasks in parallel`);
  
  // Execute all analyses in parallel
  const results = await Promise.allSettled(analysisPromises);
  
  // Process results
  const queryAnalysis: MediaAnalysisResult | null = results[0]?.status === 'fulfilled' ? results[0].value : null;
  const mediaResults = results.slice(1).map(result => 
    result.status === 'fulfilled' ? result.value : {
      mediaType: 'text' as const,
      assetId: 'unknown',
      assetUrl: 'unknown',
      success: false,
      error: result.status === 'rejected' ? result.reason : 'Unknown error',
      processingTime: 0
    }
  );
  
  // Separate results by media type
  const imageAnalysis = mediaResults.filter(r => r.mediaType === 'image');
  const videoAnalysis = mediaResults.filter(r => r.mediaType === 'video');
  const audioAnalysis = mediaResults.filter(r => r.mediaType === 'audio');
  const textAnalysis = mediaResults.filter(r => r.mediaType === 'text');
  
  const totalProcessingTime = Date.now() - startTime;
  const errors = mediaResults.filter(r => !r.success).map(r => r.error || 'Unknown error');
  
  console.log(`[ParallelAnalyzer] Completed in ${totalProcessingTime}ms. Success: ${mediaResults.filter(r => r.success).length}/${mediaResults.length}`);
  
  return {
    success: true,
    queryAnalysis,
    imageAnalysis,
    videoAnalysis,
    audioAnalysis,
    textAnalysis,
    totalProcessingTime,
    errors
  };
}

/**
 * Analyze the main query text
 */
async function analyzeTextQuery(query: string, userDescription?: string): Promise<MediaAnalysisResult> {
  try {
    const result = await analyzeTextAsset({
      text: query,
      prompt: `ANALYZE USER INTENT AND PURPOSE: ${query}`,
      userDescription,
      analysisType: 'intent_analysis',
      maxRetries: 3
    }, {
      timeout: 30000,
      enableFallback: true,
      logLevel: 'info'
    });
    
    return {
      mediaType: 'text',
      assetId: 'query',
      assetUrl: 'query',
      success: result.success,
      result: result.success ? result.result : undefined,
      model: result.model,
      error: result.error,
      processingTime: result.processingTime,
      fallbackUsed: result.fallbackUsed
    };
  } catch (error) {
    return {
      mediaType: 'text',
      assetId: 'query',
      assetUrl: 'query',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      processingTime: 0
    };
  }
}

/**
 * Perform comprehensive reasoning on all analysis results
 */
export async function performComprehensiveReasoning(
  parallelResult: ParallelAnalysisResult,
  originalQuery: string
): Promise<ComprehensiveReasoningResult> {
  try {
    console.log(`[ComprehensiveReasoning] Starting reasoning with ${parallelResult.imageAnalysis.length} images, ${parallelResult.videoAnalysis.length} videos, ${parallelResult.audioAnalysis.length} audios, ${parallelResult.textAnalysis.length} texts`);
    
    // Combine all successful analysis results
    const allResults = [
      ...parallelResult.imageAnalysis.filter(r => r.success),
      ...parallelResult.videoAnalysis.filter(r => r.success),
      ...parallelResult.audioAnalysis.filter(r => r.success),
      ...parallelResult.textAnalysis.filter(r => r.success)
    ];
    
    if (allResults.length === 0) {
      return {
        success: false,
        intent: 'unknown',
        constraints: {},
        asset_plan: { required_assets: [], enhancement_needs: [], processing_steps: [] },
        creative_options: [],
        media_analysis: { vision: null, video: null, audio: null, text: null },
        recommendations: ['Unable to analyze any media content'],
        confidence_score: 0,
        reasoning: 'No successful media analysis results available',
        error: 'All media analysis failed'
      };
    }
    
    // Create comprehensive analysis summary
    const analysisSummary = createAnalysisSummary(parallelResult, originalQuery);
    
    // Use the most advanced model for final reasoning
    const reasoningResult = await analyzeTextAsset({
      text: analysisSummary,
      prompt: `COMPREHENSIVE REASONING TASK: Based on the parallel analysis results below, provide a comprehensive understanding of the user's intent, constraints, asset plan, creative options, and recommendations. Focus on understanding what the user wants to achieve and how to best help them.

ANALYSIS RESULTS:
${analysisSummary}

Please provide a structured response with:
1. Intent: What the user wants to achieve
2. Constraints: Any limitations or requirements
3. Asset Plan: What assets are needed and how to enhance them
4. Creative Options: Different approaches to achieve the goal
5. Recommendations: Best practices and suggestions
6. Confidence Score: How confident you are in this analysis (0-1)`,
      analysisType: 'intent_analysis',
      maxRetries: 3
    }, {
      timeout: 60000,
      enableFallback: true,
      logLevel: 'info'
    });
    
    if (!reasoningResult.success) {
      throw new Error(`Reasoning analysis failed: ${reasoningResult.error}`);
    }
    
    // Parse the reasoning result into structured format
    const structuredResult = parseReasoningResult(reasoningResult.result, parallelResult);
    
    return {
      success: true,
      ...structuredResult,
      reasoning: reasoningResult.result
    };
    
  } catch (error) {
    console.error(`[ComprehensiveReasoning] Error:`, error);
    return {
      success: false,
      intent: 'unknown',
      constraints: {},
      asset_plan: { required_assets: [], enhancement_needs: [], processing_steps: [] },
      creative_options: [],
      media_analysis: { vision: null, video: null, audio: null, text: null },
      recommendations: ['Analysis failed'],
      confidence_score: 0,
      reasoning: 'Failed to perform comprehensive reasoning',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Create a comprehensive analysis summary
 */
function createAnalysisSummary(parallelResult: ParallelAnalysisResult, originalQuery: string): string {
  const summary = [];
  
  summary.push(`ORIGINAL USER QUERY: ${originalQuery}`);
  summary.push(`TOTAL PROCESSING TIME: ${parallelResult.totalProcessingTime}ms`);
  summary.push(`SUCCESSFUL ANALYSES: ${parallelResult.imageAnalysis.filter(r => r.success).length + parallelResult.videoAnalysis.filter(r => r.success).length + parallelResult.audioAnalysis.filter(r => r.success).length + parallelResult.textAnalysis.filter(r => r.success).length}`);
  summary.push('');
  
  // Query analysis
  if (parallelResult.queryAnalysis?.success) {
    summary.push(`QUERY ANALYSIS (${parallelResult.queryAnalysis.model}):`);
    summary.push(parallelResult.queryAnalysis.result);
    summary.push('');
  }
  
  // Image analysis
  if (parallelResult.imageAnalysis.length > 0) {
    summary.push(`IMAGE ANALYSIS (${parallelResult.imageAnalysis.filter(r => r.success).length}/${parallelResult.imageAnalysis.length} successful):`);
    parallelResult.imageAnalysis.forEach((result, index) => {
      if (result.success) {
        summary.push(`Image ${index + 1} (${result.model}): ${result.result}`);
      } else {
        summary.push(`Image ${index + 1}: FAILED - ${result.error}`);
      }
    });
    summary.push('');
  }
  
  // Video analysis
  if (parallelResult.videoAnalysis.length > 0) {
    summary.push(`VIDEO ANALYSIS (${parallelResult.videoAnalysis.filter(r => r.success).length}/${parallelResult.videoAnalysis.length} successful):`);
    parallelResult.videoAnalysis.forEach((result, index) => {
      if (result.success) {
        summary.push(`Video ${index + 1} (${result.model}): ${result.result}`);
      } else {
        summary.push(`Video ${index + 1}: FAILED - ${result.error}`);
      }
    });
    summary.push('');
  }
  
  // Audio analysis
  if (parallelResult.audioAnalysis.length > 0) {
    summary.push(`AUDIO ANALYSIS (${parallelResult.audioAnalysis.filter(r => r.success).length}/${parallelResult.audioAnalysis.length} successful):`);
    parallelResult.audioAnalysis.forEach((result, index) => {
      if (result.success) {
        summary.push(`Audio ${index + 1} (${result.model}): ${result.result}`);
      } else {
        summary.push(`Audio ${index + 1}: FAILED - ${result.error}`);
      }
    });
    summary.push('');
  }
  
  // Text analysis
  if (parallelResult.textAnalysis.length > 0) {
    summary.push(`TEXT ANALYSIS (${parallelResult.textAnalysis.filter(r => r.success).length}/${parallelResult.textAnalysis.length} successful):`);
    parallelResult.textAnalysis.forEach((result, index) => {
      if (result.success) {
        summary.push(`Text ${index + 1} (${result.model}): ${result.result}`);
      } else {
        summary.push(`Text ${index + 1}: FAILED - ${result.error}`);
      }
    });
    summary.push('');
  }
  
  // Errors
  if (parallelResult.errors.length > 0) {
    summary.push(`ANALYSIS ERRORS:`);
    parallelResult.errors.forEach((error, index) => {
      summary.push(`${index + 1}. ${error}`);
    });
  }
  
  return summary.join('\n');
}

/**
 * Parse reasoning result into structured format
 */
function parseReasoningResult(reasoningText: string, parallelResult: ParallelAnalysisResult): Omit<ComprehensiveReasoningResult, 'success' | 'reasoning' | 'error'> {
  // This is a simplified parser - in a real implementation, you might want to use
  // a more sophisticated parsing approach or ask the model to return structured JSON
  
  const intent = extractSection(reasoningText, 'Intent:', 'Constraints:') || 'content_creation';
  const constraints = {
    num_images: parallelResult.imageAnalysis.length || undefined,
    duration_seconds: parallelResult.videoAnalysis.length > 0 ? 30 : undefined,
    max_length: 1000
  };
  
  const asset_plan = {
    required_assets: [
      ...parallelResult.imageAnalysis.map(r => r.assetUrl),
      ...parallelResult.videoAnalysis.map(r => r.assetUrl),
      ...parallelResult.audioAnalysis.map(r => r.assetUrl)
    ],
    enhancement_needs: ['quality_improvement', 'format_optimization'],
    processing_steps: ['analysis', 'enhancement', 'integration']
  };
  
  const creative_options = [
    {
      label: 'Standard Approach',
      description: 'Use existing assets with basic enhancements',
      strengths: ['Fast', 'Cost-effective'],
      weaknesses: ['Limited creativity'],
      estimated_cost: 10
    },
    {
      label: 'Enhanced Approach',
      description: 'Apply advanced processing and creative enhancements',
      strengths: ['High quality', 'Creative'],
      weaknesses: ['More expensive', 'Longer processing'],
      estimated_cost: 25
    }
  ];
  
  const media_analysis = {
    vision: parallelResult.imageAnalysis.length > 0 ? parallelResult.imageAnalysis : null,
    video: parallelResult.videoAnalysis.length > 0 ? parallelResult.videoAnalysis : null,
    audio: parallelResult.audioAnalysis.length > 0 ? parallelResult.audioAnalysis : null,
    text: parallelResult.textAnalysis.length > 0 ? parallelResult.textAnalysis : null
  };
  
  const recommendations = [
    'Ensure all media assets are high quality',
    'Consider user intent and purpose',
    'Apply appropriate enhancements based on analysis'
  ];
  
  const confidence_score = Math.min(0.9, (parallelResult.imageAnalysis.filter(r => r.success).length + 
    parallelResult.videoAnalysis.filter(r => r.success).length + 
    parallelResult.audioAnalysis.filter(r => r.success).length + 
    parallelResult.textAnalysis.filter(r => r.success).length) / 
    Math.max(1, parallelResult.imageAnalysis.length + parallelResult.videoAnalysis.length + 
    parallelResult.audioAnalysis.length + parallelResult.textAnalysis.length));
  
  return {
    intent,
    constraints,
    asset_plan,
    creative_options,
    media_analysis,
    recommendations,
    confidence_score
  };
}

/**
 * Extract a section from text between two markers
 */
function extractSection(text: string, startMarker: string, endMarker: string): string | null {
  const startIndex = text.indexOf(startMarker);
  if (startIndex === -1) return null;
  
  const endIndex = text.indexOf(endMarker, startIndex);
  if (endIndex === -1) return text.substring(startIndex + startMarker.length).trim();
  
  return text.substring(startIndex + startMarker.length, endIndex).trim();
}
