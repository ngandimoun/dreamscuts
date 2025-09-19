/**
 * FLUX.1 SRPO Face Character API Endpoint
 * 
 * Handles requests for generating ultra-realistic face characters using
 * FLUX.1 SRPO via Fal.ai. This model excels at face consistency and
 * high-quality character generation.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateFaceCharacter, generateFaceCharacterStream } from '../../../../executors/flux-srpo-face-character';

// Request validation schema
const FluxSRPOFaceRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(2000, 'Prompt must be 2000 characters or less'),
  imageSize: z.union([
    z.enum(['square_hd', 'square', 'portrait_4_3', 'portrait_16_9', 'landscape_4_3', 'landscape_16_9']),
    z.object({
      width: z.number().min(256).max(2048),
      height: z.number().min(256).max(2048)
    })
  ]).optional(),
  numInferenceSteps: z.number().min(1).max(100).optional(),
  seed: z.number().optional(),
  guidanceScale: z.number().min(1).max(20).optional(),
  numImages: z.number().min(1).max(4).optional(),
  enableSafetyChecker: z.boolean().optional(),
  outputFormat: z.enum(['jpeg', 'png']).optional(),
  acceleration: z.enum(['none', 'regular', 'high']).optional(),
  syncMode: z.boolean().optional(),
  streaming: z.boolean().optional(),
});

const BatchFluxSRPOFaceRequestSchema = z.object({
  requests: z.array(FluxSRPOFaceRequestSchema).min(1).max(5, 'Maximum 5 requests per batch'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if it's a batch request
    if (body.requests && Array.isArray(body.requests)) {
      // Batch processing
      const validatedData = BatchFluxSRPOFaceRequestSchema.parse(body);
      
      const results = await Promise.allSettled(
        validatedData.requests.map(req => 
          req.streaming ? generateFaceCharacterStream(req) : generateFaceCharacter(req)
        )
      );
      
      const successful = results
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map(result => result.value);
      
      const failed = results
        .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
        .map(result => result.reason);
      
      return NextResponse.json({
        success: true,
        results: {
          successful,
          failed: failed.length > 0 ? failed.map(error => error.message) : undefined,
        },
        summary: {
          total: validatedData.requests.length,
          successful: successful.length,
          failed: failed.length,
        },
      });
    } else {
      // Single request processing
      const validatedData = FluxSRPOFaceRequestSchema.parse(body);
      
      const result = validatedData.streaming 
        ? await generateFaceCharacterStream(validatedData)
        : await generateFaceCharacter(validatedData);
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          result: result.result,
          metadata: result.metadata,
        });
      } else {
        return NextResponse.json({
          success: false,
          error: result.error,
        }, { status: 400 });
      }
    }
  } catch (error) {
    console.error('FLUX.1 SRPO face character API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      info: {
        name: 'FLUX.1 SRPO Face Character Generator',
        description: 'Generate ultra-realistic face characters using FLUX.1 SRPO via Fal.ai',
        model: 'fal-ai/flux/srpo',
        provider: 'Fal.ai',
        capabilities: [
          'Ultra-realistic face generation',
          'Character consistency',
          'High-quality aesthetics',
          'Professional portraits',
          'Character design',
          'Photorealistic images',
          'Face character consistency',
          'Detailed facial features'
        ],
        strengths: [
          'Excellent face consistency',
          'High-quality character generation',
          'Professional aesthetics',
          'Detailed facial features',
          'Realistic lighting and shadows',
          'Consistent character identity',
          'Ultra-realistic results',
          'Commercial use friendly'
        ],
        supportedSizes: [
          'square_hd',
          'square',
          'portrait_4_3',
          'portrait_16_9',
          'landscape_4_3',
          'landscape_16_9',
          'custom dimensions (256x256 to 2048x2048)'
        ],
        supportedFormats: [
          'jpeg',
          'png'
        ],
        accelerationOptions: [
          'none (base speed)',
          'regular (faster)',
          'high (fastest)'
        ],
        features: [
          'Ultra-realistic face generation',
          'Character consistency across images',
          'High-quality aesthetics',
          'Professional portrait quality',
          'Detailed facial feature control',
          'Streaming support',
          'Batch processing',
          'Cost optimization',
          'Safety checker',
          'Seed control for reproducibility'
        ],
        limitations: [
          'Requires FAL_KEY environment variable',
          'Maximum 2000 characters per prompt',
          'Maximum 4 images per request',
          'Maximum 5 requests per batch',
          'Cost based on megapixels generated'
        ],
        pricing: {
          base: '$0.025 per megapixel',
          acceleration: {
            none: 'Base price',
            regular: '+20% for faster generation',
            high: '+50% for fastest generation'
          },
          billing: 'Rounded up to nearest megapixel'
        },
        defaultSettings: {
          imageSize: 'portrait_4_3',
          numInferenceSteps: 28,
          guidanceScale: 4.5,
          numImages: 1,
          enableSafetyChecker: true,
          outputFormat: 'jpeg',
          acceleration: 'none',
          syncMode: false,
          streaming: false
        },
        examples: [
          {
            prompt: 'Professional portrait of a young adult woman with long brown hair, blue eyes, wearing business attire, confident expression, studio lighting, high resolution, detailed, sharp focus, professional quality, 8k, masterpiece',
            imageSize: 'portrait_4_3',
            acceleration: 'none'
          },
          {
            prompt: 'Character design of a middle-aged man with short gray hair, weathered face, wearing outdoor gear, determined expression, mountain background, natural lighting, ultra-realistic, photorealistic, high resolution, detailed, sharp focus, professional quality, 8k, masterpiece',
            imageSize: 'landscape_4_3',
            acceleration: 'regular'
          },
          {
            prompt: 'Headshot of a young adult male with curly black hair, brown eyes, wearing casual clothing, friendly smile, soft lighting, artistic style, detailed, sharp focus, professional quality, 8k, masterpiece',
            imageSize: 'square_hd',
            acceleration: 'high'
          }
        ],
        useCases: [
          'Professional portraits',
          'Character design for games',
          'Marketing materials with people',
          'Avatar generation',
          'Profile pictures',
          'Character consistency across multiple images',
          'Photorealistic character creation',
          'Artistic character illustrations'
        ],
        bestPractices: [
          'Use detailed prompts for better results',
          'Specify lighting and style preferences',
          'Include facial feature descriptions',
          'Use appropriate image sizes for your needs',
          'Consider acceleration options for faster results',
          'Use seed for reproducible results',
          'Enable safety checker for content filtering'
        ]
      },
    });
  } catch (error) {
    console.error('FLUX.1 SRPO face character info API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }, { status: 500 });
  }
}
