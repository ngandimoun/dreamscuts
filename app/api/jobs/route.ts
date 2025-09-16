import { NextRequest, NextResponse } from 'next/server';
import { 
  getPendingJobs, 
  getActiveJobs, 
  getJobStats, 
  getJobsByBrief,
  getJob 
} from '@/lib/db/jobs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const briefId = searchParams.get('brief_id');
    const jobId = searchParams.get('job_id');

    switch (action) {
      case 'pending':
        const pendingResult = await getPendingJobs(50);
        if (!pendingResult.ok) {
          return NextResponse.json({
            success: false,
            error: pendingResult.error
          }, { status: 500 });
        }
        return NextResponse.json({
          success: true,
          data: pendingResult.data
        });

      case 'active':
        const activeResult = await getActiveJobs();
        if (!activeResult.ok) {
          return NextResponse.json({
            success: false,
            error: activeResult.error
          }, { status: 500 });
        }
        return NextResponse.json({
          success: true,
          data: activeResult.data
        });

      case 'stats':
        const statsResult = await getJobStats();
        if (!statsResult.ok) {
          return NextResponse.json({
            success: false,
            error: statsResult.error
          }, { status: 500 });
        }
        return NextResponse.json({
          success: true,
          data: statsResult.data
        });

      case 'by_brief':
        if (!briefId) {
          return NextResponse.json({
            success: false,
            error: 'brief_id parameter is required'
          }, { status: 400 });
        }
        const briefJobsResult = await getJobsByBrief(briefId);
        if (!briefJobsResult.ok) {
          return NextResponse.json({
            success: false,
            error: briefJobsResult.error
          }, { status: 500 });
        }
        return NextResponse.json({
          success: true,
          data: briefJobsResult.data
        });

      case 'single':
        if (!jobId) {
          return NextResponse.json({
            success: false,
            error: 'job_id parameter is required'
          }, { status: 400 });
        }
        const jobResult = await getJob(jobId);
        if (!jobResult.ok) {
          return NextResponse.json({
            success: false,
            error: jobResult.error
          }, { status: 500 });
        }
        return NextResponse.json({
          success: true,
          data: jobResult.data
        });

      default:
        return NextResponse.json({
          success: true,
          data: {
            message: 'Jobs API is running',
            endpoints: {
              'GET /api/jobs?action=pending': 'Get pending jobs',
              'GET /api/jobs?action=active': 'Get active jobs',
              'GET /api/jobs?action=stats': 'Get job statistics',
              'GET /api/jobs?action=by_brief&brief_id=<id>': 'Get jobs by brief ID',
              'GET /api/jobs?action=single&job_id=<id>': 'Get single job by ID'
            }
          }
        });
    }

  } catch (error: any) {
    console.error('Jobs API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}
