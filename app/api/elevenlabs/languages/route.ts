/**
 * ElevenLabs Language Management API Route
 * 
 * Server-side API endpoint for managing supported languages
 * and language detection for multilingual voice generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { languageManager } from '@/lib/elevenlabs/language-manager';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const model = searchParams.get('model') || undefined;
    const search = searchParams.get('search') || undefined;
    const region = searchParams.get('region') || undefined;
    const category = searchParams.get('category') || undefined;
    const code = searchParams.get('code') || undefined;

    let languages;

    if (code) {
      // Get specific language by code
      const language = languageManager.getLanguageByCode(code as any);
      if (!language) {
        return NextResponse.json(
          { error: 'Language not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        language
      });
    }

    if (model) {
      // Get languages supported by specific model
      languages = languageManager.getLanguagesByModel(model as any);
    } else if (search) {
      // Search languages
      languages = languageManager.searchLanguages(search);
    } else if (region) {
      // Get languages by region
      languages = languageManager.getLanguagesByRegion(region);
    } else if (category) {
      // Get languages by category
      switch (category.toLowerCase()) {
        case 'major':
          languages = languageManager.getMajorLanguages();
          break;
        case 'european':
          languages = languageManager.getEuropeanLanguages();
          break;
        case 'asian':
          languages = languageManager.getAsianLanguages();
          break;
        case 'african':
          languages = languageManager.getAfricanLanguages();
          break;
        case 'american':
          languages = languageManager.getAmericanLanguages();
          break;
        default:
          languages = languageManager.getAllLanguages();
      }
    } else {
      // Get all languages
      languages = languageManager.getAllLanguages();
    }

    // Get language statistics
    const stats = {
      total: languageManager.getAllLanguages().length,
      byModel: {
        eleven_v3: languageManager.getLanguagesByModel('eleven_v3').length,
        eleven_multilingual_v2: languageManager.getLanguagesByModel('eleven_multilingual_v2').length,
        eleven_turbo_v2_5: languageManager.getLanguagesByModel('eleven_turbo_v2_5').length
      },
      byCategory: {
        major: languageManager.getMajorLanguages().length,
        european: languageManager.getEuropeanLanguages().length,
        asian: languageManager.getAsianLanguages().length,
        african: languageManager.getAfricanLanguages().length,
        american: languageManager.getAmericanLanguages().length
      }
    };

    return NextResponse.json({
      success: true,
      languages,
      total: languages.length,
      stats,
      query: {
        model,
        search,
        region,
        category,
        code
      }
    });

  } catch (error) {
    console.error('Languages API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch languages',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const action = body.action || 'detect_language';

    switch (action) {
      case 'detect_language':
        // Detect language from text
        if (!body.text) {
          return NextResponse.json(
            { error: 'Text is required for language detection' },
            { status: 400 }
          );
        }
        
        const detectedLanguage = languageManager.detectLanguageFromText(body.text);
        const languageInfo = detectedLanguage ? languageManager.getLanguageByCode(detectedLanguage) : null;
        
        return NextResponse.json({
          success: true,
          action: 'detect_language',
          detectedLanguage,
          languageInfo,
          text: body.text.substring(0, 100) + (body.text.length > 100 ? '...' : '')
        });

      case 'get_recommended_language':
        // Get recommended language for voice and text
        if (!body.voice_id || !body.text) {
          return NextResponse.json(
            { error: 'Voice ID and text are required' },
            { status: 400 }
          );
        }
        
        const recommendedLanguage = languageManager.getRecommendedLanguageForVoice(body.voice_id, body.text);
        const recommendedLanguageInfo = languageManager.getLanguageByCode(recommendedLanguage);
        
        return NextResponse.json({
          success: true,
          action: 'get_recommended_language',
          voice_id: body.voice_id,
          recommendedLanguage,
          languageInfo: recommendedLanguageInfo,
          text: body.text.substring(0, 100) + (body.text.length > 100 ? '...' : '')
        });

      case 'validate_language':
        // Validate if language code is supported
        if (!body.code) {
          return NextResponse.json(
            { error: 'Language code is required' },
            { status: 400 }
          );
        }
        
        const isValid = languageManager.isLanguageSupported(body.code);
        const languageInfo = isValid ? languageManager.getLanguageByCode(body.code as any) : null;
        
        return NextResponse.json({
          success: true,
          action: 'validate_language',
          code: body.code,
          isValid,
          languageInfo
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: detect_language, get_recommended_language, validate_language' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Languages processing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process language request',
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
