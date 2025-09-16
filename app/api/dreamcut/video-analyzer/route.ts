import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeVideoAsset, analyzeVideoAssets, validateVideoUrl, createVideoAnalysisScenario } from "../../../../executors/video-asset-analyzer";

// Request validation schema
const VideoAnalysisRequestSchema = z.object({
  // Single video analysis
  videoUrl: z.string().url().optional(),
  prompt: z.string().min(1).optional(),
  userDescription: z.string().optional(),
  analysisType: z.enum([
    'content_analysis', 
    'scene_analysis', 
    'activity_recognition', 
    'question_answering', 
    'summarization', 
    'educational', 
    'entertainment', 
    'sports', 
    'cooking', 
    'custom'
  ]).optional(),
  
  // Batch video analysis
  videos: z.array(z.object({
    videoUrl: z.string().url(),
    prompt: z.string().min(1),
    userDescription: z.string().optional(),
    analysisType: z.enum([
      'content_analysis', 
      'scene_analysis', 
      'activity_recognition', 
      'question_answering', 
      'summarization', 
      'educational', 
      'entertainment', 
      'sports', 
      'cooking', 
      'custom'
    ]).optional(),
  })).optional(),
  
  // Options
  maxRetries: z.number().int().min(1).max(5).optional().default(3),
  timeout: z.number().int().min(5000).max(60000).optional().default(30000),
  enableFallback: z.boolean().optional().default(true),
  logLevel: z.enum(['silent', 'error', 'warn', 'info', 'debug']).optional().default('info'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    
    if (!body) {
      return NextResponse.json(
        { success: false, error: "INVALID_REQUEST", message: "Request body is required" },
        { status: 400 }
      );
    }

    const parsed = VideoAnalysisRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "VALIDATION_ERROR", 
          message: "Invalid request format",
          details: parsed.error.format() 
        },
        { status: 400 }
      );
    }

    const { videos, maxRetries, timeout, enableFallback, logLevel } = parsed.data;

    // Handle batch analysis
    if (videos && videos.length > 0) {
      if (videos.length > 10) {
        return NextResponse.json(
          { 
            success: false, 
            error: "BATCH_LIMIT_EXCEEDED", 
            message: "Maximum 10 videos allowed per batch request" 
          },
          { status: 400 }
        );
      }

      // Validate all video URLs
      for (const video of videos) {
        const validation = validateVideoUrl(video.videoUrl);
        if (!validation.isValid) {
          return NextResponse.json(
            { 
              success: false, 
              error: "INVALID_VIDEO_URL", 
              message: `Invalid video URL: ${video.videoUrl}`,
              details: validation.error 
            },
            { status: 400 }
          );
        }
      }

      // Perform batch analysis
      const results = await analyzeVideoAssets(
        videos.map(video => ({
          videoUrl: video.videoUrl,
          prompt: video.prompt,
          userDescription: video.userDescription,
          analysisType: video.analysisType || 'content_analysis',
          maxRetries
        })),
        { timeout, enableFallback, logLevel }
      );

      return NextResponse.json({
        success: true,
        results: results,
        summary: {
          total: results.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
          modelsUsed: [...new Set(results.map(r => r.model))],
          averageProcessingTime: results.reduce((sum, r) => sum + (r.processingTime || 0), 0) / results.length
        }
      });
    }

    // Handle single video analysis
    const { videoUrl, prompt, userDescription, analysisType } = parsed.data;

    if (!videoUrl || !prompt) {
      return NextResponse.json(
        { 
          success: false, 
          error: "MISSING_REQUIRED_FIELDS", 
          message: "videoUrl and prompt are required for single video analysis" 
        },
        { status: 400 }
      );
    }

    // Validate video URL
    const validation = validateVideoUrl(videoUrl);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: "INVALID_VIDEO_URL", 
          message: validation.error 
        },
        { status: 400 }
      );
    }

    // Perform single video analysis
    const result = await analyzeVideoAsset({
      videoUrl,
      prompt,
      userDescription,
      analysisType: analysisType || 'content_analysis',
      maxRetries
    }, {
      timeout,
      enableFallback,
      logLevel
    });

    return NextResponse.json({
      success: result.success,
      result: result.success ? {
        analysis: result.result,
        model: result.model,
        fallbackUsed: result.fallbackUsed,
        processingTime: result.processingTime
      } : null,
      error: result.success ? null : result.error
    });

  } catch (error) {
    console.error('Video analyzer error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: "INTERNAL_ERROR", 
        message: error instanceof Error ? error.message : "Unknown error occurred" 
      },
      { status: 500 }
    );
  }
}

// GET endpoint for model information and health check
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    if (action === 'models') {
      // Return available models information
      const { getVideoModelInfo } = await import("../../../executors/video-asset-analyzer");
      const models = getVideoModelInfo();
      
      return NextResponse.json({
        success: true,
        models: models,
        totalModels: models.length,
        supportedFormats: ['MP4', 'AVI', 'MOV', 'WebM', 'MKV', 'M4V', 'GIF'],
        analysisTypes: [
          'content_analysis',
          'scene_analysis', 
          'activity_recognition',
          'question_answering',
          'summarization',
          'educational',
          'entertainment',
          'sports',
          'cooking',
          'custom'
        ]
      });
    }

    if (action === 'health') {
      // Health check endpoint
      return NextResponse.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
    }

    // Default response with API information
    return NextResponse.json({
      success: true,
      message: "DreamCut Video Analyzer API",
      endpoints: {
        POST: "Analyze video(s) - send videoUrl/prompt for single or videos array for batch",
        GET: "Get model info (?action=models) or health check (?action=health)"
      },
      example: {
        single: {
          videoUrl: "https://example.com/video.mp4",
          prompt: "Describe what happens in this video",
          analysisType: "content_analysis"
        },
        batch: {
          videos: [
            {
              videoUrl: "https://example.com/video1.mp4",
              prompt: "Analyze this video",
              analysisType: "content_analysis"
            }
          ]
        }
      }
    });

  } catch (error) {
    console.error('Video analyzer GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: "INTERNAL_ERROR", 
        message: error instanceof Error ? error.message : "Unknown error occurred" 
      },
      { status: 500 }
    );
  }
}
