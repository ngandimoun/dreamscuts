import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { integrateBriefWithWorker } from '@/lib/db/brief-integration';

// Request schema for integrating an existing brief with worker processing
const IntegrateBriefRequestSchema = z.object({
  brief_id: z.string().min(1), // The brief_id from the existing briefs table
  use_pipeline: z.boolean().optional().default(false),
  job_types: z.array(z.enum(['analysis', 'asset_prep', 'storyboard', 'render', 'video_generation', 'image_processing', 'text_analysis'])).optional(),
  priority: z.number().min(0).max(100).optional().default(0)
});

/**
 * POST /api/briefs/integrate
 * 
 * This endpoint safely integrates an existing brief with the worker system
 * without modifying the brief itself. It only adds job processing.
 * 
 * This is a SAFE, NON-BREAKING integration that can be called after
 * the existing query analyzer creates a brief.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = IntegrateBriefRequestSchema.parse(body);

    // Integrate the brief with worker processing
    const result = await integrateBriefWithWorker(validatedData.brief_id, {
      use_pipeline: validatedData.use_pipeline,
      job_types: validatedData.job_types,
      priority: validatedData.priority
    });

    if (!result.ok) {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Brief successfully integrated with worker system'
    });

  } catch (error: any) {
    console.error('Brief integration error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request format',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}

/**
 * GET /api/briefs/integrate?brief_id=<id>
 * 
 * Get brief with its associated jobs
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const briefId = searchParams.get('brief_id');

    if (!briefId) {
      return NextResponse.json({
        success: false,
        error: 'brief_id parameter is required'
      }, { status: 400 });
    }

    const { getBriefWithJobs } = await import('@/lib/db/brief-integration');
    const result = await getBriefWithJobs(briefId);

    if (!result.ok) {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });

  } catch (error: any) {
    console.error('Brief integration GET error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}
