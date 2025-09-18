/**
 * ElevenLabs Audio Tags API Route
 * 
 * Server-side API endpoint for managing audio tags for Text to Dialogue.
 * This route provides audio tag information, validation, and text enhancement.
 */

import { NextRequest, NextResponse } from 'next/server';
import { dialogueManager } from '@/lib/elevenlabs/dialogue-manager';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const emotion = searchParams.get('emotion') || undefined;

    let tags;

    if (category) {
      // Get tags by category
      tags = dialogueManager.getAudioTagsByCategory(category as any);
    } else if (search) {
      // Search tags by keyword
      tags = dialogueManager.searchAudioTags(search);
    } else if (emotion) {
      // Get recommended tags for emotion
      tags = dialogueManager.getRecommendedTagsForEmotion(emotion);
    } else {
      // Get all tags
      tags = dialogueManager.getAllAudioTags();
    }

    // Get tag categories for reference
    const categories = {
      emotions: dialogueManager.getAudioTagsByCategory('emotions'),
      nonVerbal: dialogueManager.getAudioTagsByCategory('nonVerbal'),
      speechFlow: dialogueManager.getAudioTagsByCategory('speechFlow'),
      soundEffects: dialogueManager.getAudioTagsByCategory('soundEffects'),
      special: dialogueManager.getAudioTagsByCategory('special')
    };

    return NextResponse.json({
      success: true,
      tags,
      total: tags.length,
      categories,
      query: {
        category,
        search,
        emotion
      }
    });

  } catch (error) {
    console.error('Audio tags API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch audio tags',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.text || typeof body.text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    const action = body.action || 'validate';

    switch (action) {
      case 'validate':
        // Validate audio tags in text
        const validation = dialogueManager.validateAudioTags(body.text);
        return NextResponse.json({
          success: true,
          action: 'validate',
          valid: validation.valid,
          invalid_tags: validation.invalidTags,
          text: body.text
        });

      case 'extract':
        // Extract audio tags from text
        const extractedTags = dialogueManager.extractAudioTags(body.text);
        return NextResponse.json({
          success: true,
          action: 'extract',
          tags: extractedTags,
          text: body.text
        });

      case 'remove':
        // Remove audio tags from text
        const cleanText = dialogueManager.removeAudioTags(body.text);
        return NextResponse.json({
          success: true,
          action: 'remove',
          original_text: body.text,
          clean_text: cleanText
        });

      case 'enhance':
        // Enhance text with audio tags
        const enhancedText = dialogueManager.enhanceTextWithAudioTags(body.text, {
          enhance_emotion: body.enhance_emotion ?? true,
          add_audio_tags: body.add_audio_tags ?? true,
          max_tags_per_sentence: body.max_tags_per_sentence ?? 2,
          custom_tags: body.custom_tags
        });
        return NextResponse.json({
          success: true,
          action: 'enhance',
          original_text: body.text,
          enhanced_text: enhancedText
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: validate, extract, remove, enhance' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Audio tags processing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process audio tags',
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
