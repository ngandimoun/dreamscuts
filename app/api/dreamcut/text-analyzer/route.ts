import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeTextAsset, analyzeTextAssets, validateTextContent, createTextAnalysisScenario } from "../../../../executors/text-asset-analyzer";

// Request validation schema
const TextAnalysisRequestSchema = z.object({
  // Single text analysis
  text: z.string().min(1).optional(),
  prompt: z.string().min(1).optional(),
  userDescription: z.string().optional(),
  analysisType: z.enum([
    'sentiment_analysis', 
    'content_summarization', 
    'language_detection', 
    'keyword_extraction', 
    'topic_modeling', 
    'text_classification', 
    'named_entity_recognition', 
    'intent_analysis', 
    'readability_analysis', 
    'translation', 
    'paraphrasing', 
    'creative_writing', 
    'technical_analysis', 
    'educational_content', 
    'marketing_analysis', 
    'legal_analysis', 
    'medical_analysis', 
    'custom'
  ]).optional(),
  
  // Batch text analysis
  texts: z.array(z.object({
    text: z.string().min(1),
    prompt: z.string().min(1),
    userDescription: z.string().optional(),
    analysisType: z.enum([
      'sentiment_analysis', 
      'content_summarization', 
      'language_detection', 
      'keyword_extraction', 
      'topic_modeling', 
      'text_classification', 
      'named_entity_recognition', 
      'intent_analysis', 
      'readability_analysis', 
      'translation', 
      'paraphrasing', 
      'creative_writing', 
      'technical_analysis', 
      'educational_content', 
      'marketing_analysis', 
      'legal_analysis', 
      'medical_analysis', 
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
    const validationResult = TextAnalysisRequestSchema.safeParse(body);
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

    const { texts, timeout, enableFallback, logLevel, ...singleTextData } = validationResult.data;

    // Handle batch analysis
    if (texts && texts.length > 0) {
      // Validate all text content
      const invalidTexts = texts.filter(text => {
        const validation = validateTextContent(text.text);
        return !validation.isValid;
      });
      
      if (invalidTexts.length > 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Invalid text content detected", 
            invalidTexts: invalidTexts.map((text, index) => ({
              index,
              issues: validateTextContent(text.text).issues
            }))
          },
          { status: 400 }
        );
      }

      const results = await analyzeTextAssets(texts, {
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

    // Handle single text analysis
    if (!singleTextData.text || !singleTextData.prompt) {
      return NextResponse.json(
        { 
          success: false, 
          error: "text and prompt are required for single text analysis" 
        },
        { status: 400 }
      );
    }

    // Validate text content
    const textValidation = validateTextContent(singleTextData.text);
    if (!textValidation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid text content", 
          issues: textValidation.issues
        },
        { status: 400 }
      );
    }

    const result = await analyzeTextAsset(singleTextData, {
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
    console.error("Text analysis API error:", error);
    
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
        const { getAvailableTextModels } = await import("../../../executors/text-asset-analyzer");
        const models = getAvailableTextModels();
        
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

        const { getTextModelRecommendations } = await import("../../../executors/text-asset-analyzer");
        const recommendations = getTextModelRecommendations(analysisType as any);
        
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

        const scenario = createTextAnalysisScenario(scenarioType as any);
        
        return NextResponse.json({
          success: true,
          scenarioType,
          scenario
        });

      default:
        return NextResponse.json({
          success: true,
          endpoints: {
            models: "/api/dreamcut/text-analyzer?action=models",
            recommendations: "/api/dreamcut/text-analyzer?action=recommendations&analysisType=content_summarization",
            scenarios: "/api/dreamcut/text-analyzer?action=scenarios&scenarioType=content_summarization"
          },
          supportedAnalysisTypes: [
            'sentiment_analysis',
            'content_summarization', 
            'language_detection',
            'keyword_extraction',
            'topic_modeling',
            'text_classification',
            'named_entity_recognition',
            'intent_analysis',
            'readability_analysis',
            'translation',
            'paraphrasing',
            'creative_writing',
            'technical_analysis',
            'educational_content',
            'marketing_analysis',
            'legal_analysis',
            'medical_analysis',
            'custom'
          ]
        });
    }

  } catch (error) {
    console.error("Text analyzer GET error:", error);
    
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
