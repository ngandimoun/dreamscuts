/**
 * Eleven v3 Prompting Guide API Route
 * 
 * Server-side API endpoint for accessing v3 prompting guide features
 * Based on the official Eleven v3 prompting guide
 */

import { NextRequest, NextResponse } from 'next/server';
import { v3PromptingGuide } from '@/lib/elevenlabs/v3-prompting-guide';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const category = searchParams.get('category') || undefined;
    const type = searchParams.get('type') || undefined;

    let result;

    switch (type) {
      case 'audio_tags':
        if (category) {
          result = v3PromptingGuide.getV3AudioTagsByCategory(category as any);
        } else {
          result = v3PromptingGuide.getAllV3AudioTags();
        }
        break;

      case 'stability_settings':
        result = v3PromptingGuide.getV3StabilitySettings();
        break;

      case 'voice_guidance':
        result = v3PromptingGuide.getV3VoiceGuidance();
        break;

      case 'examples':
        result = v3PromptingGuide.getV3Examples();
        break;

      case 'punctuation_guidance':
        result = v3PromptingGuide.getPunctuationGuidance();
        break;

      case 'tag_combinations':
        result = v3PromptingGuide.getTagCombinationRecommendations();
        break;

      case 'voice_matching':
        result = v3PromptingGuide.getVoiceMatchingRecommendations();
        break;

      case 'text_enhancement_prompt':
        result = { prompt: v3PromptingGuide.getTextEnhancementPrompt() };
        break;

      default:
        // Return all v3 prompting guide data
        result = {
          audioTags: {
            all: v3PromptingGuide.getAllV3AudioTags(),
            voiceRelated: v3PromptingGuide.getV3AudioTagsByCategory('voiceRelated'),
            soundEffects: v3PromptingGuide.getV3AudioTagsByCategory('soundEffects'),
            uniqueSpecial: v3PromptingGuide.getV3AudioTagsByCategory('uniqueSpecial')
          },
          stabilitySettings: v3PromptingGuide.getV3StabilitySettings(),
          voiceGuidance: v3PromptingGuide.getV3VoiceGuidance(),
          examples: v3PromptingGuide.getV3Examples(),
          punctuationGuidance: v3PromptingGuide.getPunctuationGuidance(),
          tagCombinations: v3PromptingGuide.getTagCombinationRecommendations(),
          voiceMatching: v3PromptingGuide.getVoiceMatchingRecommendations(),
          textEnhancementPrompt: v3PromptingGuide.getTextEnhancementPrompt()
        };
    }

    return NextResponse.json({
      success: true,
      data: result,
      query: { category, type }
    });

  } catch (error) {
    console.error('V3 prompting guide API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch v3 prompting guide data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const action = body.action || 'get_recommended_settings';

    switch (action) {
      case 'get_recommended_voice_settings':
        // Get recommended voice settings for v3
        if (!body.stability) {
          return NextResponse.json(
            { error: 'Stability parameter is required' },
            { status: 400 }
          );
        }
        
        const voiceSettings = v3PromptingGuide.getRecommendedV3VoiceSettings(body.stability);
        return NextResponse.json({
          success: true,
          action: 'get_recommended_voice_settings',
          stability: body.stability,
          voiceSettings
        });

      case 'get_recommended_dialogue_settings':
        // Get recommended dialogue settings for v3
        if (!body.stability) {
          return NextResponse.json(
            { error: 'Stability parameter is required' },
            { status: 400 }
          );
        }
        
        const dialogueSettings = v3PromptingGuide.getRecommendedV3DialogueSettings(body.stability);
        return NextResponse.json({
          success: true,
          action: 'get_recommended_dialogue_settings',
          stability: body.stability,
          dialogueSettings
        });

      case 'validate_text_length':
        // Validate text length for v3
        if (!body.text) {
          return NextResponse.json(
            { error: 'Text is required for validation' },
            { status: 400 }
          );
        }
        
        const validation = v3PromptingGuide.validateV3TextLength(body.text);
        return NextResponse.json({
          success: true,
          action: 'validate_text_length',
          validation,
          text: body.text.substring(0, 100) + (body.text.length > 100 ? '...' : '')
        });

      case 'enhance_text_with_audio_tags':
        // This would typically call an LLM service to enhance text
        // For now, we'll return the enhancement prompt and let the client handle it
        if (!body.text) {
          return NextResponse.json(
            { error: 'Text is required for enhancement' },
            { status: 400 }
          );
        }
        
        const enhancementPrompt = v3PromptingGuide.getTextEnhancementPrompt();
        return NextResponse.json({
          success: true,
          action: 'enhance_text_with_audio_tags',
          enhancementPrompt,
          originalText: body.text,
          note: 'Use the enhancement prompt with an LLM service to enhance the text with audio tags'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: get_recommended_voice_settings, get_recommended_dialogue_settings, validate_text_length, enhance_text_with_audio_tags' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('V3 prompting guide processing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process v3 prompting guide request',
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
