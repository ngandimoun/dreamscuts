/**
 * ElevenLabs Text to Dialogue API Route
 * 
 * Server-side API endpoint for generating expressive dialogue using ElevenLabs.
 * This route handles text to dialogue conversion with audio tags and multi-speaker support.
 */

import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsService } from '@/lib/elevenlabs/service';
import { dialogueManager } from '@/lib/elevenlabs/dialogue-manager';
import type { TextToDialogueOptions, DialogueSettings } from '@/lib/elevenlabs/types';

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

    // Validate audio tags if provided
    if (body.validate_audio_tags) {
      const validation = dialogueManager.validateAudioTags(body.text);
      if (!validation.valid) {
        return NextResponse.json(
          { 
            error: 'Invalid audio tags found',
            invalid_tags: validation.invalidTags
          },
          { status: 400 }
        );
      }
    }

    // Enhance text with audio tags if requested
    let finalText = body.text;
    if (body.enhance_text) {
      finalText = dialogueManager.enhanceTextWithAudioTags(body.text, {
        enhance_emotion: body.enhance_emotion ?? true,
        add_audio_tags: body.add_audio_tags ?? true,
        max_tags_per_sentence: body.max_tags_per_sentence ?? 2,
        custom_tags: body.custom_tags
      });
    }

    // Prepare dialogue settings
    const dialogueSettings: DialogueSettings = {
      stability: body.dialogue_settings?.stability || 'natural',
      use_audio_tags: body.dialogue_settings?.use_audio_tags ?? true,
      enhance_emotion: body.dialogue_settings?.enhance_emotion ?? true,
      multi_speaker: body.dialogue_settings?.multi_speaker ?? false,
      speaker_voices: body.dialogue_settings?.speaker_voices
    };

    // Prepare options
    const options: TextToDialogueOptions = {
      text: finalText,
      voice_id: body.voice_id || undefined,
      model_id: body.model_id || 'eleven_multilingual_v2',
      language_code: body.language_code || undefined,
      voice_settings: body.voice_settings || undefined,
      output_format: body.output_format || 'mp3_44100_128',
      seed: body.seed || undefined,
      previous_text: body.previous_text || undefined,
      next_text: body.next_text || undefined,
      apply_text_normalization: body.apply_text_normalization || 'auto',
      apply_language_text_normalization: body.apply_language_text_normalization || false,
      dialogue_settings
    };

    // Generate dialogue
    const result = await elevenLabsService.textToDialogue(options);

    // Convert ArrayBuffer to base64 for JSON response
    const audioBase64 = Buffer.from(result.audio).toString('base64');

    // Extract audio tags from the text
    const audioTags = dialogueManager.extractAudioTags(finalText);

    // Return the result
    return NextResponse.json({
      success: true,
      audio: audioBase64,
      format: result.output_format,
      voice_id: result.voice_id,
      model_id: result.model_id,
      text: result.text,
      original_text: body.text,
      enhanced_text: finalText,
      audio_tags: audioTags,
      dialogue_settings: result.dialogue_settings,
      request_id: result.request_id
    });

  } catch (error) {
    console.error('Text to Dialogue API error:', error);
    
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
