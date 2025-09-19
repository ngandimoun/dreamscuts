import { NextRequest, NextResponse } from 'next/server';
import { ShotstackExecutor, ShotstackInput, ShotstackOptions } from '@/executors/shotstack';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input, options = {} } = body;

    // Validate API key
    if (!process.env.SHOTSTACK_API_KEY) {
      return NextResponse.json(
        { error: 'SHOTSTACK_API_KEY environment variable is required' },
        { status: 500 }
      );
    }

    // Validate input
    if (!input) {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      );
    }

    // Create executor
    const executor = new ShotstackExecutor(
      process.env.SHOTSTACK_API_KEY,
      options.environment || 'stage'
    );

    // Render video
    const result = await executor.renderVideoAndWait(input, {
      ...options,
      onProgress: (status) => {
        console.log(`[Shotstack] Render progress: ${status.response.status}`);
      },
    });

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('[Shotstack API] Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'Shotstack video rendering failed',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const renderId = searchParams.get('renderId');
    const environment = searchParams.get('environment') as 'stage' | 'v1' || 'stage';

    if (!renderId) {
      return NextResponse.json(
        { error: 'renderId parameter is required' },
        { status: 400 }
      );
    }

    // Validate API key
    if (!process.env.SHOTSTACK_API_KEY) {
      return NextResponse.json(
        { error: 'SHOTSTACK_API_KEY environment variable is required' },
        { status: 500 }
      );
    }

    // Create executor
    const executor = new ShotstackExecutor(
      process.env.SHOTSTACK_API_KEY,
      environment
    );

    // Get render status
    const status = await executor.getRenderStatus(renderId);

    return NextResponse.json({
      success: true,
      data: status,
    });

  } catch (error) {
    console.error('[Shotstack API] Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'Failed to get render status',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}
