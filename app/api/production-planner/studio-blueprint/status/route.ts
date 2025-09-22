/**
 * 🎬 Studio Blueprint Status API - Phase 3
 * 
 * API endpoint for updating Studio Blueprint status and human review.
 */

import { NextRequest, NextResponse } from 'next/server';
import { StudioBlueprintDatabase } from '../../../../../lib/production-planner/studioBlueprintDatabase';

// Initialize database service
const db = new StudioBlueprintDatabase({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!
});

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, reviewData } = body;
    
    if (!id || !status) {
      return NextResponse.json({
        success: false,
        error: 'Blueprint ID and status are required'
      }, { status: 400 });
    }
    
    // Validate status
    const validStatuses = ['draft', 'generated', 'reviewed', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      }, { status: 400 });
    }
    
    console.log('🎬 [Studio Blueprint Status API] Updating status:', { id, status });
    
    const result = await db.updateBlueprintStatus(id, status, reviewData);
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: `Blueprint status updated to ${status}`
    });
    
  } catch (error) {
    console.error('🎬 [Studio Blueprint Status API] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}
