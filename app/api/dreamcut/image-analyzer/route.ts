import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeImageAsset, analyzeImageAssets, validateImageUrl, createImageAnalysisScenario } from "../../../../executors/image-asset-analyzer";

// Request validation schema
const ImageAnalysisRequestSchema = z.object({
  // Single image analysis
  imageUrl: z.string().url().optional(),
  prompt: z.string().min(1).optional(),
  userDescription: z.string().optional(),
  analysisType: z.enum([
    'visual_qa', 
    'object_detection', 
    'text_recognition', 
    'scene_analysis', 
    'creative_tasks', 
    'problem_solving', 
    'content_summarization', 
    'educational', 
    'marketing', 
    'medical', 
    'custom'
  ]).optional(),
  
  // Batch image analysis
  images: z.array(z.object({
    imageUrl: z.string().url(),
    prompt: z.string().min(1),
    userDescription: z.string().optional(),
    analysisType: z.enum([
      'visual_qa', 
      'object_detection', 
      'text_recognition', 
      'scene_analysis', 
      'creative_tasks', 
      'problem_solving', 
      'content_summarization', 
      'educational', 
      'marketing', 
      'medical', 
      'custom'
    ]).optional(),
  })).optional(),
  
  // Options
  timeout: z.number().min(1000).max(120000).optional(),
  enableFallback: z.boolean().optional(),
  logLevel: z.enum(['silent', 'error', 'warn', 'info', 'debug']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = ImageAnalysisRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid request format", 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { images, timeout, enableFallback, logLevel, ...singleImageData } = validationResult.data;

    // Handle batch analysis
    if (images && images.length > 0) {
      // Validate all image URLs
      const invalidUrls = images.filter(img => !validateImageUrl(img.imageUrl));
      if (invalidUrls.length > 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Invalid image URLs detected", 
            invalidUrls: invalidUrls.map(img => img.imageUrl)
          },
          { status: 400 }
        );
      }

      const results = await analyzeImageAssets(images, {
        timeout,
        enableFallback,
        logLevel
      });

      return NextResponse.json({
        success: true,
        type: "batch",
        results,
        summary: {
          total: results.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
          averageProcessingTime: results.reduce((sum, r) => sum + (r.processingTime || 0), 0) / results.length
        }
      });
    }

    // Handle single image analysis
    if (!singleImageData.imageUrl || !singleImageData.prompt) {
      return NextResponse.json(
        { 
          success: false, 
          error: "imageUrl and prompt are required for single image analysis" 
        },
        { status: 400 }
      );
    }

    // Validate image URL
    if (!validateImageUrl(singleImageData.imageUrl)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid image URL format or unsupported image type" 
        },
        { status: 400 }
      );
    }

    const result = await analyzeImageAsset(singleImageData, {
      timeout,
      enableFallback,
      logLevel
    });

    return NextResponse.json({
      success: true,
      type: "single",
      result
    });

  } catch (error) {
    console.error("Image analysis API error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// GET endpoint for model information and capabilities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'models':
        const { getAvailableImageModels } = await import("../../../executors/image-asset-analyzer");
        const models = getAvailableImageModels();
        
        return NextResponse.json({
          success: true,
          models,
          total: models.length
        });

      case 'recommendations':
        const analysisType = searchParams.get('analysisType');
        if (!analysisType) {
          return NextResponse.json(
            { success: false, error: "analysisType parameter is required" },
            { status: 400 }
          );
        }

        const { getModelRecommendations } = await import("../../../executors/image-asset-analyzer");
        const recommendations = getModelRecommendations(analysisType as any);
        
        return NextResponse.json({
          success: true,
          analysisType,
          recommendations,
          total: recommendations.length
        });

      case 'scenarios':
        const scenarioType = searchParams.get('scenarioType');
        if (!scenarioType) {
          return NextResponse.json(
            { success: false, error: "scenarioType parameter is required" },
            { status: 400 }
          );
        }

        const scenario = createImageAnalysisScenario(scenarioType as any);
        
        return NextResponse.json({
          success: true,
          scenarioType,
          scenario
        });

      default:
        return NextResponse.json({
          success: true,
          endpoints: {
            models: "/api/dreamcut/image-analyzer?action=models",
            recommendations: "/api/dreamcut/image-analyzer?action=recommendations&analysisType=visual_qa",
            scenarios: "/api/dreamcut/image-analyzer?action=scenarios&scenarioType=visual_qa"
          },
          supportedAnalysisTypes: [
            'visual_qa',
            'object_detection', 
            'text_recognition',
            'scene_analysis',
            'creative_tasks',
            'problem_solving',
            'content_summarization',
            'educational',
            'marketing',
            'medical',
            'custom'
          ]
        });
    }

  } catch (error) {
    console.error("Image analyzer GET error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
