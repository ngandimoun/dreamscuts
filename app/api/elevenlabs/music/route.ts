/**
 * ElevenLabs Music API Route
 * 
 * Server-side API endpoint for music generation and composition
 */

import { NextRequest, NextResponse } from 'next/server';
import { elevenLabsService } from '@/lib/elevenlabs/service';
import { musicManager } from '@/lib/elevenlabs/music-manager';
import type { MusicComposeOptions, CompositionPlanOptions } from '@/lib/elevenlabs/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const type = searchParams.get('type') || undefined;
    const category = searchParams.get('category') || undefined;
    const keyword = searchParams.get('keyword') || undefined;
    const genre = searchParams.get('genre') || undefined;
    const mood = searchParams.get('mood') || undefined;
    const useCase = searchParams.get('use_case') || undefined;

    let result;

    switch (type) {
      case 'genres':
        result = musicManager.getMusicGenres();
        break;

      case 'moods':
        result = musicManager.getMusicMoods();
        break;

      case 'instruments':
        result = musicManager.getMusicInstruments();
        break;

      case 'structures':
        result = musicManager.getMusicStructures();
        break;

      case 'categories':
        result = musicManager.getMusicCategories();
        break;

      case 'prompting_guide':
        if (category) {
          result = musicManager.getPromptingGuide(category);
        } else {
          result = musicManager.getAllPromptingGuides();
        }
        break;

      case 'examples':
        if (genre) {
          result = musicManager.getExamplesByGenre(genre as any);
        } else if (mood) {
          result = musicManager.getExamplesByMood(mood as any);
        } else if (useCase) {
          result = musicManager.getExamplesByUseCase(useCase);
        } else if (keyword) {
          result = musicManager.searchExamples(keyword);
        } else {
          result = musicManager.getMusicExamples();
        }
        break;

      case 'random_example':
        result = musicManager.getRandomExample();
        break;

      case 'duration_range':
        const minMs = parseInt(searchParams.get('min_ms') || '10000');
        const maxMs = parseInt(searchParams.get('max_ms') || '300000');
        result = musicManager.getExamplesByDuration(minMs, maxMs);
        break;

      case 'recommended_duration':
        if (category) {
          result = musicManager.getRecommendedDuration(category);
        } else {
          result = {};
        }
        break;

      default:
        // Return all music data
        result = {
          genres: musicManager.getMusicGenres(),
          moods: musicManager.getMusicMoods(),
          instruments: musicManager.getMusicInstruments(),
          structures: musicManager.getMusicStructures(),
          categories: musicManager.getMusicCategories(),
          promptingGuides: musicManager.getAllPromptingGuides(),
          examples: musicManager.getMusicExamples()
        };
    }

    return NextResponse.json({
      success: true,
      data: result,
      query: { type, category, keyword, genre, mood, useCase }
    });

  } catch (error) {
    console.error('Music API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch music data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const action = body.action || 'compose_music';

    switch (action) {
      case 'compose_music':
        // Compose music from prompt
        if (!body.prompt && !body.composition_plan) {
          return NextResponse.json(
            { error: 'Either prompt or composition_plan is required for music composition' },
            { status: 400 }
          );
        }

        const musicComposeOptions: MusicComposeOptions = {
          prompt: body.prompt,
          composition_plan: body.composition_plan,
          music_length_ms: body.music_length_ms,
          output_format: body.output_format
        };

        const result = await elevenLabsService.composeMusic(musicComposeOptions);
        
        return NextResponse.json({
          success: true,
          action: 'compose_music',
          result: {
            music_length_ms: result.music_length_ms,
            prompt: result.prompt,
            output_format: result.output_format,
            audio_size: result.audio.byteLength
          }
        });

      case 'compose_music_detailed':
        // Compose music with detailed response
        if (!body.prompt && !body.composition_plan) {
          return NextResponse.json(
            { error: 'Either prompt or composition_plan is required for detailed music composition' },
            { status: 400 }
          );
        }

        const detailedResult = await elevenLabsService.composeMusicDetailed(musicComposeOptions);
        
        return NextResponse.json({
          success: true,
          action: 'compose_music_detailed',
          result: {
            music_length_ms: detailedResult.music_length_ms,
            prompt: detailedResult.prompt,
            output_format: detailedResult.output_format,
            filename: detailedResult.filename,
            composition_plan: detailedResult.json.composition_plan,
            song_metadata: detailedResult.json.song_metadata,
            audio_size: detailedResult.audio.byteLength
          }
        });

      case 'create_composition_plan':
        // Create composition plan from prompt
        if (!body.prompt) {
          return NextResponse.json(
            { error: 'Prompt is required for composition plan creation' },
            { status: 400 }
          );
        }

        const compositionPlanOptions: CompositionPlanOptions = {
          prompt: body.prompt,
          music_length_ms: body.music_length_ms
        };

        const planResult = await elevenLabsService.createCompositionPlan(compositionPlanOptions);

        return NextResponse.json({
          success: true,
          action: 'create_composition_plan',
          result: planResult
        });

      case 'generate_prompt':
        // Generate music prompt from parameters
        if (!body.params) {
          return NextResponse.json(
            { error: 'Parameters are required for prompt generation' },
            { status: 400 }
          );
        }

        const generatedPrompt = musicManager.generatePrompt(body.params);

        return NextResponse.json({
          success: true,
          action: 'generate_prompt',
          params: body.params,
          generated_prompt: generatedPrompt
        });

      case 'validate_prompt':
        // Validate music prompt
        if (!body.prompt) {
          return NextResponse.json(
            { error: 'Prompt is required for validation' },
            { status: 400 }
          );
        }

        const validation = musicManager.validatePrompt(body.prompt);

        return NextResponse.json({
          success: true,
          action: 'validate_prompt',
          prompt: body.prompt,
          validation
        });

      case 'analyze_prompt':
        // Analyze music prompt
        if (!body.prompt) {
          return NextResponse.json(
            { error: 'Prompt is required for analysis' },
            { status: 400 }
          );
        }

        const analysis = musicManager.analyzePrompt(body.prompt);

        return NextResponse.json({
          success: true,
          action: 'analyze_prompt',
          prompt: body.prompt,
          analysis
        });

      case 'create_composition_plan_from_params':
        // Create composition plan from parameters
        if (!body.params) {
          return NextResponse.json(
            { error: 'Parameters are required for composition plan creation' },
            { status: 400 }
          );
        }

        const { genre, mood, instruments, structure, duration, includeVocals } = body.params;

        if (!genre || !mood || !instruments || !structure || !duration) {
          return NextResponse.json(
            { error: 'Genre, mood, instruments, structure, and duration are required' },
            { status: 400 }
          );
        }

        const compositionPlan = musicManager.createCompositionPlan({
          genre,
          mood,
          instruments,
          structure,
          duration,
          includeVocals
        });

        return NextResponse.json({
          success: true,
          action: 'create_composition_plan_from_params',
          params: body.params,
          composition_plan: compositionPlan
        });

      case 'search_examples':
        // Search for music examples
        if (!body.keyword) {
          return NextResponse.json(
            { error: 'Keyword is required for search' },
            { status: 400 }
          );
        }

        const searchResults = musicManager.searchExamples(body.keyword);

        return NextResponse.json({
          success: true,
          action: 'search_examples',
          keyword: body.keyword,
          results: searchResults
        });

      case 'get_random_example':
        // Get random music example
        const randomExample = musicManager.getRandomExample();

        return NextResponse.json({
          success: true,
          action: 'get_random_example',
          example: randomExample
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: compose_music, compose_music_detailed, create_composition_plan, generate_prompt, validate_prompt, analyze_prompt, create_composition_plan_from_params, search_examples, get_random_example' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Music processing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process music request',
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
