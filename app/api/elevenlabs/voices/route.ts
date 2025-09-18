/**
 * ElevenLabs Voices API Route
 * 
 * Server-side API endpoint for fetching available voices from ElevenLabs.
 * This route provides voice information for client-side voice selection.
 */

import { NextRequest, NextResponse } from 'next/server';
import { voiceManager } from '@/lib/elevenlabs/voice-manager';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const voiceType = searchParams.get('voice_type') || undefined;
    const language = searchParams.get('language') || undefined;
    const gender = searchParams.get('gender') || undefined;
    const age = searchParams.get('age') || undefined;
    const accent = searchParams.get('accent') || undefined;
    const useCase = searchParams.get('use_case') || undefined;
    const pageSize = parseInt(searchParams.get('page_size') || '20');
    const forceRefresh = searchParams.get('force_refresh') === 'true';

    // Build search criteria
    const criteria: any = {};
    if (search) criteria.name = search;
    if (category) criteria.category = category;
    if (language) criteria.language = language;
    if (gender) criteria.gender = gender;
    if (age) criteria.age = age;
    if (accent) criteria.accent = accent;
    if (useCase) criteria.useCase = useCase;

    let voices;
    
    if (Object.keys(criteria).length > 0) {
      // Use search functionality
      voices = await voiceManager.searchVoices(criteria);
    } else {
      // Get all voices
      voices = await voiceManager.getVoices(forceRefresh);
    }

    // Limit results
    const limitedVoices = voices.slice(0, pageSize);

    // Get voice statistics
    const stats = await voiceManager.getVoiceStats();

    return NextResponse.json({
      success: true,
      voices: limitedVoices,
      total: voices.length,
      stats,
      criteria: Object.keys(criteria).length > 0 ? criteria : null
    });

  } catch (error) {
    console.error('Voices API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch voices',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
