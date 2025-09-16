import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createBriefWithJob, createBriefWithPipeline } from '@/lib/db/briefs';

// Request schema for creating a brief with job processing
// This is an OPTIONAL enhancement that doesn't interfere with existing functionality
const CreateBriefRequestSchema = z.object({
  user_id: z.string().uuid().optional(),
  brief_id: z.string().optional(),
  request: z.any(), // The request object from query analyzer
  analysis: z.any(), // The analysis results
  plan: z.any(), // The processing plan
  metadata: z.any().optional(),
  use_pipeline: z.boolean().optional().default(false)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateBriefRequestSchema.parse(body);

    // Create brief with job (or pipeline)
    const result = validatedData.use_pipeline 
      ? await createBriefWithPipeline(validatedData)
      : await createBriefWithJob(validatedData);

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
    console.error('Brief creation error:', error);

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
