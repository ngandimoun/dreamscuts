/**
 * Text Editor API Endpoint
 * 
 * Handles requests for editing text on images using GPT Image 1.
 * Supports adding, replacing, removing, and styling text on existing images.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { editTextOnImage } from '../../../../executors/gpt-image-1-text-editor';

// Request validation schema
const TextEditRequestSchema = z.object({
  image: z.string().min(1, 'Image is required'),
  operation: z.enum(['add-text', 'replace-text', 'remove-text', 'style-text', 'translate-text', 'fix-text']),
  textChanges: z.array(z.object({
    originalText: z.string().optional(),
    newText: z.string().optional(),
    position: z.object({
      x: z.number().min(0).max(100),
      y: z.number().min(0).max(100),
    }).optional(),
    style: z.object({
      font: z.string().optional(),
      size: z.number().positive().optional(),
      color: z.string().optional(),
      weight: z.enum(['normal', 'bold', 'light']).optional(),
      alignment: z.enum(['left', 'center', 'right']).optional(),
      background: z.string().optional(),
      padding: z.number().positive().optional(),
    }).optional(),
  })).min(1, 'Text changes are required'),
  mask: z.string().optional(),
  style: z.enum(['modern', 'classic', 'minimalist', 'corporate', 'creative', 'elegant', 'bold', 'vintage']).default('modern'),
  colorScheme: z.enum(['professional', 'vibrant', 'monochrome', 'dark', 'light', 'custom']).default('professional'),
  customColors: z.object({
    primary: z.string().optional(),
    secondary: z.string().optional(),
    accent: z.string().optional(),
    background: z.string().optional(),
    text: z.string().optional(),
  }).optional(),
  size: z.enum(['1024x1024', '1024x1536', '1536x1024', 'auto']).default('1024x1024'),
  quality: z.enum(['low', 'medium', 'high', 'auto']).default('high'),
  customInstructions: z.string().optional(),
  context: z.string().optional(),
  preserveOriginal: z.boolean().default(true),
  blendMode: z.enum(['normal', 'overlay', 'multiply', 'screen', 'soft-light', 'hard-light']).default('normal'),
});

const BatchTextEditRequestSchema = z.object({
  edits: z.array(TextEditRequestSchema).min(1).max(10, 'Maximum 10 edits per batch'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if it's a batch request
    if (body.edits && Array.isArray(body.edits)) {
      // Batch processing
      const validatedData = BatchTextEditRequestSchema.parse(body);
      
      const results = await Promise.allSettled(
        validatedData.edits.map(edit => editTextOnImage(edit))
      );
      
      const successful = results
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map(result => result.value);
      
      const failed = results
        .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
        .map(result => result.reason);
      
      return NextResponse.json({
        success: true,
        results: {
          successful,
          failed: failed.length > 0 ? failed.map(error => error.message) : undefined,
        },
        summary: {
          total: validatedData.edits.length,
          successful: successful.length,
          failed: failed.length,
        },
      });
    } else {
      // Single edit processing
      const validatedData = TextEditRequestSchema.parse(body);
      
      const result = await editTextOnImage(validatedData);
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          editedImage: result.editedImage,
        });
      } else {
        return NextResponse.json({
          success: false,
          error: result.error,
        }, { status: 400 });
      }
    }
  } catch (error) {
    console.error('Text edit API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      info: {
        name: 'GPT Image 1 Text Editor',
        description: 'Edit text on images using GPT Image 1 with extremely detailed prompts',
        model: 'gpt-image-1',
        provider: 'OpenAI',
        capabilities: [
          'Add text to images',
          'Replace existing text',
          'Remove text from images',
          'Style and format text',
          'Translate text on images',
          'Fix text errors',
          'Professional text rendering',
        ],
        supportedOperations: [
          'add-text',
          'replace-text',
          'remove-text',
          'style-text',
          'translate-text',
          'fix-text',
        ],
        supportedStyles: [
          'modern',
          'classic',
          'minimalist',
          'corporate',
          'creative',
          'elegant',
          'bold',
          'vintage',
        ],
        supportedColorSchemes: [
          'professional',
          'vibrant',
          'monochrome',
          'dark',
          'light',
          'custom',
        ],
        supportedSizes: [
          '1024x1024',
          '1024x1536',
          '1536x1024',
          'auto',
        ],
        supportedQualities: [
          'low',
          'medium',
          'high',
          'auto',
        ],
        supportedBlendModes: [
          'normal',
          'overlay',
          'multiply',
          'screen',
          'soft-light',
          'hard-light',
        ],
        features: [
          'Extremely detailed prompt generation',
          'Professional text styling',
          'Custom color schemes',
          'Flexible positioning',
          'Style preservation',
          'Batch processing',
          'Cost optimization',
          'High-quality output',
        ],
        limitations: [
          '⚠️ CRITICAL: Poor face character consistency - NEVER use on images with faces',
          'Faces will be distorted, changed, or completely replaced',
          'Use only on images without faces (landscapes, objects, text-only images)',
        ],
        pricing: {
          base: '$5-40 per 1M tokens',
          factors: ['Quality level', 'Image size', 'Prompt complexity'],
        },
        examples: [
          {
            operation: 'add-text',
            textChanges: [{
              newText: 'Welcome to Our Store',
              position: { x: 50, y: 20 },
              style: {
                font: 'Arial',
                size: 24,
                color: '#FFFFFF',
                weight: 'bold',
                alignment: 'center',
              },
            }],
            style: 'modern',
            colorScheme: 'professional',
          },
          {
            operation: 'replace-text',
            textChanges: [{
              originalText: 'Old Company Name',
              newText: 'New Company Name',
              style: {
                font: 'Helvetica',
                size: 20,
                color: '#2C3E50',
                weight: 'bold',
              },
            }],
            style: 'corporate',
            colorScheme: 'professional',
          },
          {
            operation: 'style-text',
            textChanges: [{
              originalText: 'Existing Text',
              style: {
                font: 'Arial',
                size: 18,
                color: '#E74C3C',
                weight: 'bold',
                background: '#FFFFFF',
                padding: 10,
              },
            }],
            style: 'creative',
            colorScheme: 'vibrant',
          },
        ],
      },
    });
  } catch (error) {
    console.error('Text edit info API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }, { status: 500 });
  }
}
