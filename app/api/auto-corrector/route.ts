import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { executeWithAutoCorrection, checkAllServicesHealth, getAvailableServices } from '@/lib/auto-corrector/services';
import { ServiceType } from '@/lib/auto-corrector';

// Request schema for auto-corrector execution
const AutoCorrectorRequestSchema = z.object({
  service: z.enum(['together', 'replicate', 'fal', 'openai', 'anthropic']),
  input: z.record(z.any()),
  options: z.object({
    maxRetries: z.number().min(1).max(10).optional(),
    retryDelay: z.number().min(100).max(10000).optional(),
    enableFallback: z.boolean().optional(),
    logLevel: z.enum(['silent', 'error', 'warn', 'info', 'debug']).optional(),
    timeout: z.number().min(1000).max(60000).optional(),
  }).optional(),
});

// Request schema for health check
const HealthCheckRequestSchema = z.object({
  service: z.enum(['together', 'replicate', 'fal', 'openai', 'anthropic']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { service, input, options } = AutoCorrectorRequestSchema.parse(body);

    const result = await executeWithAutoCorrection(service, input, options);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error('Auto-corrector API error:', error);

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'health':
        const service = searchParams.get('service') as ServiceType | null;
        if (service) {
          const { checkServiceHealth } = await import('@/lib/auto-corrector/services');
          const health = await checkServiceHealth(service);
          return NextResponse.json({
            success: true,
            data: { [service]: health }
          });
        } else {
          const health = await checkAllServicesHealth();
          return NextResponse.json({
            success: true,
            data: health
          });
        }

      case 'services':
        const services = getAvailableServices();
        return NextResponse.json({
          success: true,
          data: services
        });

      case 'stats':
        const { getAllServiceStats } = await import('@/lib/auto-corrector/services');
        const stats = getAllServiceStats();
        return NextResponse.json({
          success: true,
          data: stats
        });

      default:
        return NextResponse.json({
          success: true,
          data: {
            message: 'Auto-corrector API is running',
            endpoints: {
              'POST /api/auto-corrector': 'Execute auto-corrector with service and input',
              'GET /api/auto-corrector?action=health': 'Check service health status',
              'GET /api/auto-corrector?action=services': 'Get available services',
              'GET /api/auto-corrector?action=stats': 'Get service statistics'
            }
          }
        });
    }

  } catch (error: any) {
    console.error('Auto-corrector API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}
