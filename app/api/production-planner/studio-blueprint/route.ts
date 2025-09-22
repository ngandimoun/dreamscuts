/**
 * 🎬 Studio Blueprint API - Phase 3
 * 
 * API endpoint for generating and managing Studio Blueprints.
 * This creates human-readable creative plans using GPT-5 reasoning model.
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  CreateBlueprintRequestSchema, 
  CreateBlueprintResponseSchema,
  validateBlueprintInput 
} from '../../../../validators/studio-blueprint';
import { generateStudioBlueprint } from '../../../../services/studioBlueprintService';
import { StudioBlueprintDatabase } from '../../../../lib/production-planner/studioBlueprintDatabase';

// Initialize database service
const db = new StudioBlueprintDatabase({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!
});

export async function POST(req: NextRequest) {
  try {
    console.log('🎬 [Studio Blueprint API] Starting blueprint generation...');
    
    // Parse and validate request body
    const body = await req.json();
    const validation = CreateBlueprintRequestSchema.safeParse(body);
    
    if (!validation.success) {
      console.error('🎬 [Studio Blueprint API] Validation failed:', validation.error);
      return NextResponse.json({
        success: false,
        error: `Validation failed: ${validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`
      }, { status: 400 });
    }
    
    const request = validation.data;
    console.log('🎬 [Studio Blueprint API] Valid request received for user:', request.userId);
    
    // Generate the Studio Blueprint using GPT-5
    const startTime = Date.now();
    const generationResult = await generateStudioBlueprint(request);
    const processingTime = Date.now() - startTime;
    
    if (!generationResult.success) {
      console.error('🎬 [Studio Blueprint API] Generation failed:', generationResult.error);
      return NextResponse.json({
        success: false,
        error: generationResult.error,
        processingTimeMs: processingTime
      }, { status: 500 });
    }
    
    console.log('🎬 [Studio Blueprint API] Blueprint generated successfully:', generationResult.data?.id);
    
    // Store the blueprint in the database
    if (generationResult.data) {
      const storageResult = await db.createBlueprint(generationResult.data);
      
      if (!storageResult.success) {
        console.error('🎬 [Studio Blueprint API] Storage failed:', storageResult.error);
        return NextResponse.json({
          success: false,
          error: `Blueprint generated but storage failed: ${storageResult.error}`,
          processingTimeMs: processingTime
        }, { status: 500 });
      }
      
      console.log('🎬 [Studio Blueprint API] Blueprint stored successfully:', storageResult.data?.id);
      
      // Return the complete response
      return NextResponse.json({
        success: true,
        data: storageResult.data,
        processingTimeMs: processingTime,
        warnings: generationResult.warnings
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Blueprint generation succeeded but no data returned',
      processingTimeMs: processingTime
    }, { status: 500 });
    
  } catch (error) {
    console.error('🎬 [Studio Blueprint API] Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const blueprintId = searchParams.get('id');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    
    console.log('🎬 [Studio Blueprint API] GET request:', { blueprintId, userId, status, limit, offset });
    
    // Get specific blueprint by ID
    if (blueprintId) {
      const result = await db.getBlueprint(blueprintId);
      
      if (!result.success) {
        return NextResponse.json({
          success: false,
          error: result.error
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        data: result.data
      });
    }
    
    // Get user's blueprints
    if (userId) {
      const result = await db.getUserBlueprints(userId, {
        status: status || undefined,
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined
      });
      
      if (!result.success) {
        return NextResponse.json({
          success: false,
          error: result.error
        }, { status: 500 });
      }
      
      return NextResponse.json({
        success: true,
        data: result.data
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Either blueprintId or userId must be provided'
    }, { status: 400 });
    
  } catch (error) {
    console.error('🎬 [Studio Blueprint API] GET error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, updates } = body;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Blueprint ID is required'
      }, { status: 400 });
    }
    
    console.log('🎬 [Studio Blueprint API] PUT request for blueprint:', id);
    
    const result = await db.updateBlueprint(id, updates);
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      data: result.data
    });
    
  } catch (error) {
    console.error('🎬 [Studio Blueprint API] PUT error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const blueprintId = searchParams.get('id');
    
    if (!blueprintId) {
      return NextResponse.json({
        success: false,
        error: 'Blueprint ID is required'
      }, { status: 400 });
    }
    
    console.log('🎬 [Studio Blueprint API] DELETE request for blueprint:', blueprintId);
    
    const result = await db.deleteBlueprint(blueprintId);
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true
    });
    
  } catch (error) {
    console.error('🎬 [Studio Blueprint API] DELETE error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}
