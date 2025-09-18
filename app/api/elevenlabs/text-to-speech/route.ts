/**
 * ElevenLabs Text to Speech API Route
 * 
 * Server-side API endpoint for generating speech using ElevenLabs.
 * This route handles text to speech conversion and returns audio data.
 */

import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsService } from '@/lib/elevenlabs/service';
import type { TextToSpeechOptions } from '@/lib/elevenlabs/types';

// Initialize ElevenLabs service
const elevenLabsService = new ElevenLabsService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.text || typeof body.text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate text length (ElevenLabs has limits)
    if (body.text.length > 5000) {
      return NextResponse.json(
        { error: 'Text is too long. Maximum 5000 characters allowed.' },
        { status: 400 }
      );
    }

    // Prepare options
    const options: TextToSpeechOptions = {
      text: body.text,
      voice_id: body.voice_id || undefined,
      model_id: body.model_id || 'eleven_multilingual_v2',
      language_code: body.language_code || undefined,
      voice_settings: body.voice_settings || undefined,
      output_format: body.output_format || 'mp3_44100_128',
      seed: body.seed || undefined,
      previous_text: body.previous_text || undefined,
      next_text: body.next_text || undefined,
      apply_text_normalization: body.apply_text_normalization || 'auto',
      apply_language_text_normalization: body.apply_language_text_normalization || false
    };

    // Generate speech
    const result = await elevenLabsService.textToSpeech(options);

    // Convert ArrayBuffer to base64 for JSON response
    const audioBase64 = Buffer.from(result.audio).toString('base64');

    // Return the result
    return NextResponse.json({
      success: true,
      audio: audioBase64,
      format: result.output_format,
      voice_id: result.voice_id,
      model_id: result.model_id,
      text: result.text,
      request_id: result.request_id
    });

  } catch (error) {
    console.error('Text to Speech API error:', error);
    
    // Handle specific ElevenLabs errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid or missing API key' },
          { status: 401 }
        );
      }
      
      if (error.message.includes('quota') || error.message.includes('limit')) {
        return NextResponse.json(
          { error: 'API quota exceeded' },
          { status: 429 }
        );
      }
      
      if (error.message.includes('voice')) {
        return NextResponse.json(
          { error: 'Invalid voice ID' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
