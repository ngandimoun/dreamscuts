/**
 * ElevenLabs V3 Voice Library API Route
 * 
 * Server-side API endpoint for accessing the V3 voice library
 * with detailed voice information, recommendations, and search capabilities.
 */

import { NextRequest, NextResponse } from 'next/server';
import { V3VoiceLibrary } from '@/lib/elevenlabs/v3-voice-library';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const category = searchParams.get('category') || undefined;
    const recommendation = searchParams.get('recommendation') || undefined;
    const search = searchParams.get('search') || undefined;
    const gender = searchParams.get('gender') || undefined;
    const accent = searchParams.get('accent') || undefined;
    const emotionalRange = searchParams.get('emotional_range') || undefined;
    const useCase = searchParams.get('use_case') || undefined;
    const voiceId = searchParams.get('voice_id') || undefined;

    let voices;

    if (voiceId) {
      // Get specific voice by ID
      const voice = V3VoiceLibrary.getVoiceById(voiceId);
      if (!voice) {
        return NextResponse.json(
          { error: 'Voice not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        voice,
        settings: V3VoiceLibrary.getRecommendedSettings(voiceId)
      });
    }

    if (category) {
      // Get voices by category
      voices = V3VoiceLibrary.getVoicesByCategory(category as any);
    } else if (recommendation) {
      // Get voices by recommendation type
      voices = V3VoiceLibrary.getVoicesByRecommendation(recommendation as any);
    } else if (search) {
      // Search voices
      voices = V3VoiceLibrary.searchVoices(search);
    } else if (gender) {
      // Get voices by gender
      voices = V3VoiceLibrary.getVoicesByGender(gender as any);
    } else if (accent) {
      // Get voices by accent
      voices = V3VoiceLibrary.getVoicesByAccent(accent);
    } else if (emotionalRange) {
      // Get voices by emotional range
      voices = V3VoiceLibrary.getVoicesByEmotionalRange(emotionalRange as any);
    } else if (useCase) {
      // Get voices for specific use case
      voices = V3VoiceLibrary.getVoicesForUseCase(useCase);
    } else {
      // Get all V3 voices
      voices = V3VoiceLibrary.getAllV3Voices();
    }

    // Get voice categories for reference
    const categories = {
      NARRATIVE: V3VoiceLibrary.getVoicesByCategory('NARRATIVE').length,
      CONVERSATIONAL: V3VoiceLibrary.getVoicesByCategory('CONVERSATIONAL').length,
      CHARACTERS: V3VoiceLibrary.getVoicesByCategory('CHARACTERS').length,
      SOCIAL_MEDIA: V3VoiceLibrary.getVoicesByCategory('SOCIAL_MEDIA').length,
      PROFESSIONAL: V3VoiceLibrary.getVoicesByCategory('PROFESSIONAL').length,
      GAMING: V3VoiceLibrary.getVoicesByCategory('GAMING').length,
      AUDIOBOOKS: V3VoiceLibrary.getVoicesByCategory('AUDIOBOOKS').length
    };

    // Get recommendations for reference
    const recommendations = {
      DIALOGUE_EXCELLENT: V3VoiceLibrary.getVoicesByRecommendation('DIALOGUE_EXCELLENT').length,
      PROFESSIONAL: V3VoiceLibrary.getVoicesByRecommendation('PROFESSIONAL').length,
      CHARACTERS: V3VoiceLibrary.getVoicesByRecommendation('CHARACTERS').length,
      SOCIAL_MEDIA: V3VoiceLibrary.getVoicesByRecommendation('SOCIAL_MEDIA').length,
      AUDIOBOOKS: V3VoiceLibrary.getVoicesByRecommendation('AUDIOBOOKS').length
    };

    return NextResponse.json({
      success: true,
      voices,
      total: voices.length,
      categories,
      recommendations,
      query: {
        category,
        recommendation,
        search,
        gender,
        accent,
        emotionalRange,
        useCase,
        voiceId
      }
    });

  } catch (error) {
    console.error('V3 voices API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch V3 voices',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const action = body.action || 'get_random';

    switch (action) {
      case 'get_random':
        // Get random voice from category
        const randomVoice = V3VoiceLibrary.getRandomVoice(body.category);
        return NextResponse.json({
          success: true,
          action: 'get_random',
          voice: randomVoice,
          settings: V3VoiceLibrary.getRecommendedSettings(randomVoice.voice_id)
        });

      case 'get_recommended_settings':
        // Get recommended settings for voice
        if (!body.voice_id) {
          return NextResponse.json(
            { error: 'Voice ID is required' },
            { status: 400 }
          );
        }
        
        const settings = V3VoiceLibrary.getRecommendedSettings(body.voice_id);
        if (!settings) {
          return NextResponse.json(
            { error: 'Voice not found or no settings available' },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          success: true,
          action: 'get_recommended_settings',
          voice_id: body.voice_id,
          settings
        });

      case 'get_voice_info':
        // Get detailed voice information
        if (!body.voice_id) {
          return NextResponse.json(
            { error: 'Voice ID is required' },
            { status: 400 }
          );
        }
        
        const voice = V3VoiceLibrary.getVoiceById(body.voice_id);
        if (!voice) {
          return NextResponse.json(
            { error: 'Voice not found' },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          success: true,
          action: 'get_voice_info',
          voice,
          settings: V3VoiceLibrary.getRecommendedSettings(body.voice_id)
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: get_random, get_recommended_settings, get_voice_info' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('V3 voices processing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process V3 voice request',
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
