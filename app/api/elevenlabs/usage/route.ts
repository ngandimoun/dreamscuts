/**
 * ElevenLabs Usage Statistics API Route
 * 
 * Server-side API endpoint for fetching usage statistics from ElevenLabs.
 * This route provides information about API usage, limits, and account status.
 */

import { NextRequest, NextResponse } from 'next/server';
import { elevenLabsService } from '@/lib/elevenlabs/service';
import { voiceManager } from '@/lib/elevenlabs/voice-manager';

export async function GET(request: NextRequest) {
  try {
    // Get usage statistics
    const usageStats = await elevenLabsService.getUsageStats();
    
    // Get voice statistics
    const voiceStats = await voiceManager.getVoiceStats();
    
    // Get available models
    const models = await elevenLabsService.getModels();
    
    // Validate connection
    const isConnected = await elevenLabsService.validateConnection();

    // Calculate additional metrics
    const remainingCharacters = usageStats.characters_limit - usageStats.characters_used;
    const usagePercentage = (usageStats.characters_used / usageStats.characters_limit) * 100;
    const canGenerateMore = remainingCharacters > 0;

    return NextResponse.json({
      success: true,
      connection: {
        is_connected: isConnected,
        status: isConnected ? 'connected' : 'disconnected'
      },
      usage: {
        ...usageStats,
        remaining_characters: remainingCharacters,
        usage_percentage: Math.round(usagePercentage * 100) / 100,
        can_generate_more: canGenerateMore
      },
      voices: voiceStats,
      models: models.map(model => ({
        model_id: model.model_id,
        name: model.name,
        can_do_text_to_speech: model.can_do_text_to_speech,
        can_use_style: model.can_use_style,
        can_use_speaker_boost: model.can_use_speaker_boost,
        max_characters_free: model.max_characters_request_free_user,
        max_characters_subscribed: model.max_characters_request_subscribed_user,
        languages: model.languages
      })),
      recommendations: {
        recommended_format: usageStats.tier === 'free' ? 'mp3_44100_64' : 'mp3_44100_128',
        recommended_model: 'eleven_multilingual_v2',
        estimated_cost_per_character: usageStats.tier === 'free' ? 0 : 0.0003
      }
    });

  } catch (error) {
    console.error('Usage API error:', error);
    
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { 
            error: 'Invalid or missing API key',
            connection: { is_connected: false, status: 'invalid_key' }
          },
          { status: 401 }
        );
      }
      
      if (error.message.includes('quota') || error.message.includes('limit')) {
        return NextResponse.json(
          { 
            error: 'API quota exceeded',
            connection: { is_connected: true, status: 'quota_exceeded' }
          },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to fetch usage statistics',
        details: error instanceof Error ? error.message : 'Unknown error',
        connection: { is_connected: false, status: 'error' }
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
