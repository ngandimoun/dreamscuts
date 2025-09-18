/**
 * ElevenLabs Voice Design API Route
 * 
 * Server-side API endpoint for designing and creating custom voices from text descriptions
 */

import { NextRequest, NextResponse } from 'next/server';
import { elevenLabsService } from '@/lib/elevenlabs/service';
import { voiceDesignManager } from '@/lib/elevenlabs/voice-design-manager';
import type { VoiceDesignOptions, CreateVoiceOptions } from '@/lib/elevenlabs/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const type = searchParams.get('type') || undefined;
    const category = searchParams.get('category') || undefined;
    const keyword = searchParams.get('keyword') || undefined;
    const modelId = searchParams.get('model_id') || undefined;

    let result;

    switch (type) {
      case 'models':
        result = voiceDesignManager.getVoiceDesignModels();
        break;

      case 'categories':
        result = voiceDesignManager.getVoiceDesignCategories();
        break;

      case 'prompting_guide':
        if (category) {
          result = voiceDesignManager.getPromptingGuide(category);
        } else {
          result = voiceDesignManager.getAllPromptingGuides();
        }
        break;

      case 'attributes':
        result = voiceDesignManager.getVoiceDesignAttributes();
        break;

      case 'examples':
        if (category) {
          result = voiceDesignManager.getExamplesByVoiceType(category);
        } else if (keyword) {
          result = voiceDesignManager.searchExamples(keyword);
        } else {
          result = voiceDesignManager.getVoiceDesignExamples();
        }
        break;

      case 'random_example':
        result = voiceDesignManager.getRandomExample();
        break;

      case 'guidance_scale_range':
        const min = parseInt(searchParams.get('min') || '0');
        const max = parseInt(searchParams.get('max') || '100');
        result = voiceDesignManager.getExamplesByGuidanceScale(min, max);
        break;

      case 'by_model':
        if (modelId) {
          result = voiceDesignManager.getExamplesByModel(modelId);
        } else {
          result = {};
        }
        break;

      default:
        // Return all voice design data
        result = {
          models: voiceDesignManager.getVoiceDesignModels(),
          categories: voiceDesignManager.getVoiceDesignCategories(),
          promptingGuides: voiceDesignManager.getAllPromptingGuides(),
          attributes: voiceDesignManager.getVoiceDesignAttributes(),
          examples: voiceDesignManager.getVoiceDesignExamples()
        };
    }

    return NextResponse.json({
      success: true,
      data: result,
      query: { type, category, keyword, modelId }
    });

  } catch (error) {
    console.error('Voice design API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch voice design data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const action = body.action || 'design_voice';

    switch (action) {
      case 'design_voice':
        // Design a voice from text description
        if (!body.voice_description) {
          return NextResponse.json(
            { error: 'Voice description is required for voice design' },
            { status: 400 }
          );
        }

        const voiceDesignOptions: VoiceDesignOptions = {
          voice_description: body.voice_description,
          model_id: body.model_id,
          text: body.text,
          auto_generate_text: body.auto_generate_text,
          loudness: body.loudness,
          seed: body.seed,
          guidance_scale: body.guidance_scale,
          stream_previews: body.stream_previews,
          remixing_session_id: body.remixing_session_id,
          remixing_session_iteration_id: body.remixing_session_iteration_id,
          quality: body.quality,
          reference_audio_base64: body.reference_audio_base64,
          prompt_strength: body.prompt_strength,
          output_format: body.output_format
        };

        const result = await elevenLabsService.designVoice(voiceDesignOptions);
        
        return NextResponse.json({
          success: true,
          action: 'design_voice',
          result: {
            previews: result.previews.map(preview => ({
              generated_voice_id: preview.generated_voice_id,
              duration_secs: preview.duration_secs,
              language: preview.language,
              media_type: preview.media_type,
              audio_size: preview.audio_base_64.length
            })),
            text: result.text,
            preview_count: result.previews.length
          }
        });

      case 'create_voice':
        // Create a voice from a generated voice preview
        if (!body.voice_name || !body.voice_description || !body.generated_voice_id) {
          return NextResponse.json(
            { error: 'Voice name, description, and generated voice ID are required' },
            { status: 400 }
          );
        }

        const createVoiceOptions: CreateVoiceOptions = {
          voice_name: body.voice_name,
          voice_description: body.voice_description,
          generated_voice_id: body.generated_voice_id,
          labels: body.labels,
          played_not_selected_voice_ids: body.played_not_selected_voice_ids
        };

        const createResult = await elevenLabsService.createVoice(createVoiceOptions);

        return NextResponse.json({
          success: true,
          action: 'create_voice',
          result: {
            voice_id: createResult.voice_id,
            name: createResult.name,
            description: createResult.description,
            category: createResult.category,
            preview_url: createResult.preview_url,
            available_for_tiers: createResult.available_for_tiers,
            settings: createResult.settings,
            is_owner: createResult.is_owner,
            created_at_unix: createResult.created_at_unix
          }
        });

      case 'get_recommended_options':
        // Get recommended options for a category
        if (!body.category || !body.voice_description) {
          return NextResponse.json(
            { error: 'Category and voice description are required' },
            { status: 400 }
          );
        }

        const recommendedOptions = voiceDesignManager.getRecommendedOptions(
          body.category, 
          body.voice_description
        );

        return NextResponse.json({
          success: true,
          action: 'get_recommended_options',
          category: body.category,
          voice_description: body.voice_description,
          recommendedOptions
        });

      case 'validate_description':
        // Validate voice description
        if (!body.voice_description) {
          return NextResponse.json(
            { error: 'Voice description is required for validation' },
            { status: 400 }
          );
        }

        const validation = voiceDesignManager.validateVoiceDescription(body.voice_description);

        return NextResponse.json({
          success: true,
          action: 'validate_description',
          voice_description: body.voice_description,
          validation
        });

      case 'generate_preview_text':
        // Generate preview text for voice description
        if (!body.voice_description) {
          return NextResponse.json(
            { error: 'Voice description is required for preview text generation' },
            { status: 400 }
          );
        }

        const previewText = voiceDesignManager.generatePreviewText(
          body.voice_description, 
          body.category
        );

        return NextResponse.json({
          success: true,
          action: 'generate_preview_text',
          voice_description: body.voice_description,
          category: body.category,
          preview_text: previewText
        });

      case 'analyze_description':
        // Analyze voice description
        if (!body.voice_description) {
          return NextResponse.json(
            { error: 'Voice description is required for analysis' },
            { status: 400 }
          );
        }

        const analysis = voiceDesignManager.analyzeVoiceDescription(body.voice_description);

        return NextResponse.json({
          success: true,
          action: 'analyze_description',
          voice_description: body.voice_description,
          analysis
        });

      case 'search_examples':
        // Search for voice design examples
        if (!body.keyword) {
          return NextResponse.json(
            { error: 'Keyword is required for search' },
            { status: 400 }
          );
        }

        const searchResults = voiceDesignManager.searchExamples(body.keyword);

        return NextResponse.json({
          success: true,
          action: 'search_examples',
          keyword: body.keyword,
          results: searchResults
        });

      case 'get_random_example':
        // Get random voice design example
        const randomExample = voiceDesignManager.getRandomExample();

        return NextResponse.json({
          success: true,
          action: 'get_random_example',
          example: randomExample
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: design_voice, create_voice, get_recommended_options, validate_description, generate_preview_text, analyze_description, search_examples, get_random_example' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Voice design processing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process voice design request',
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
