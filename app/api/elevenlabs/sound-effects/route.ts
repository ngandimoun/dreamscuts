/**
 * ElevenLabs Sound Effects API Route
 * 
 * Server-side API endpoint for generating sound effects from text descriptions
 */

import { NextRequest, NextResponse } from 'next/server';
import { elevenLabsService } from '@/lib/elevenlabs/service';
import { soundEffectsManager } from '@/lib/elevenlabs/sound-effects-manager';
import type { SoundEffectOptions, SoundEffectCategory } from '@/lib/elevenlabs/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const type = searchParams.get('type') || undefined;
    const category = searchParams.get('category') || undefined;
    const keyword = searchParams.get('keyword') || undefined;

    let result;

    switch (type) {
      case 'models':
        result = soundEffectsManager.getSoundEffectModels();
        break;

      case 'categories':
        result = soundEffectsManager.getSoundEffectCategories();
        break;

      case 'prompting_guide':
        if (category) {
          result = soundEffectsManager.getPromptingGuide(category as SoundEffectCategory);
        } else {
          result = soundEffectsManager.getAllPromptingGuides();
        }
        break;

      case 'examples':
        if (category) {
          result = soundEffectsManager.getExamplesByCategory(category as SoundEffectCategory);
        } else if (keyword) {
          result = soundEffectsManager.searchSoundEffectExamples(keyword);
        } else {
          result = soundEffectsManager.getPopularCombinations();
        }
        break;

      case 'tips':
        if (category) {
          result = soundEffectsManager.getTipsByCategory(category as SoundEffectCategory);
        } else {
          result = {};
        }
        break;

      case 'random_example':
        result = soundEffectsManager.getRandomExample(category as SoundEffectCategory);
        break;

      default:
        // Return all sound effects data
        result = {
          models: soundEffectsManager.getSoundEffectModels(),
          categories: soundEffectsManager.getSoundEffectCategories(),
          promptingGuides: soundEffectsManager.getAllPromptingGuides(),
          popularCombinations: soundEffectsManager.getPopularCombinations()
        };
    }

    return NextResponse.json({
      success: true,
      data: result,
      query: { type, category, keyword }
    });

  } catch (error) {
    console.error('Sound effects API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch sound effects data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const action = body.action || 'generate_sound_effect';

    switch (action) {
      case 'generate_sound_effect':
        // Generate sound effect from text
        if (!body.text) {
          return NextResponse.json(
            { error: 'Text description is required for sound effect generation' },
            { status: 400 }
          );
        }

        const soundEffectOptions: SoundEffectOptions = {
          text: body.text,
          duration_seconds: body.duration_seconds,
          loop: body.loop,
          prompt_influence: body.prompt_influence,
          model_id: body.model_id,
          output_format: body.output_format
        };

        const result = await elevenLabsService.generateSoundEffect(soundEffectOptions);
        
        return NextResponse.json({
          success: true,
          action: 'generate_sound_effect',
          result: {
            text: result.text,
            duration_seconds: result.duration_seconds,
            loop: result.loop,
            prompt_influence: result.prompt_influence,
            model_id: result.model_id,
            output_format: result.output_format,
            audio_size: result.audio.byteLength
          }
        });

      case 'get_recommended_options':
        // Get recommended options for a category
        if (!body.category || !body.text) {
          return NextResponse.json(
            { error: 'Category and text are required' },
            { status: 400 }
          );
        }

        const recommendedOptions = soundEffectsManager.getRecommendedOptions(
          body.category as SoundEffectCategory, 
          body.text
        );

        return NextResponse.json({
          success: true,
          action: 'get_recommended_options',
          category: body.category,
          text: body.text,
          recommendedOptions
        });

      case 'validate_text':
        // Validate sound effect text
        if (!body.text) {
          return NextResponse.json(
            { error: 'Text is required for validation' },
            { status: 400 }
          );
        }

        const validation = soundEffectsManager.validateSoundEffectText(body.text);

        return NextResponse.json({
          success: true,
          action: 'validate_text',
          text: body.text,
          validation
        });

      case 'search_examples':
        // Search for sound effect examples
        if (!body.keyword) {
          return NextResponse.json(
            { error: 'Keyword is required for search' },
            { status: 400 }
          );
        }

        const searchResults = soundEffectsManager.searchSoundEffectExamples(body.keyword);

        return NextResponse.json({
          success: true,
          action: 'search_examples',
          keyword: body.keyword,
          results: searchResults
        });

      case 'get_random_example':
        // Get random sound effect example
        const randomExample = soundEffectsManager.getRandomExample(body.category as SoundEffectCategory);

        return NextResponse.json({
          success: true,
          action: 'get_random_example',
          category: body.category,
          example: randomExample
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: generate_sound_effect, get_recommended_options, validate_text, search_examples, get_random_example' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Sound effects processing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process sound effects request',
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
