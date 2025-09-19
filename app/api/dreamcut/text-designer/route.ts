/**
 * Text Designer API Endpoint
 * 
 * Handles requests for generating text-heavy designs using GPT Image 1.
 * Supports brochures, flyers, posters, business cards, and other marketing materials.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateTextDesign } from '../../../../executors/gpt-image-1-text-designer';

// Request validation schema
const TextDesignRequestSchema = z.object({
  designType: z.enum(['brochure', 'flyer', 'poster', 'business-card', 'banner', 'newsletter', 'menu', 'invitation', 'certificate', 'label']),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  content: z.array(z.string()).min(1, 'Content is required'),
  companyName: z.string().optional(),
  contactInfo: z.object({
    phone: z.string().optional(),
    email: z.string().optional(),
    website: z.string().optional(),
    address: z.string().optional(),
  }).optional(),
  style: z.enum(['modern', 'classic', 'minimalist', 'corporate', 'creative', 'elegant', 'bold', 'vintage']).default('modern'),
  colorScheme: z.enum(['professional', 'vibrant', 'monochrome', 'pastel', 'dark', 'custom']).default('professional'),
  customColors: z.object({
    primary: z.string().optional(),
    secondary: z.string().optional(),
    accent: z.string().optional(),
    background: z.string().optional(),
    text: z.string().optional(),
  }).optional(),
  layout: z.enum(['single-column', 'two-column', 'three-column', 'grid', 'asymmetric', 'centered']).default('single-column'),
  orientation: z.enum(['portrait', 'landscape', 'square']).default('portrait'),
  size: z.enum(['1024x1024', '1024x1536', '1536x1024', 'auto']).default('1024x1536'),
  quality: z.enum(['low', 'medium', 'high', 'auto']).default('high'),
  customInstructions: z.string().optional(),
  context: z.string().optional(),
  targetAudience: z.string().optional(),
  callToAction: z.string().optional(),
  logo: z.string().optional(),
  images: z.array(z.string()).optional(),
  typography: z.object({
    primaryFont: z.string().optional(),
    secondaryFont: z.string().optional(),
    headingSize: z.enum(['small', 'medium', 'large', 'extra-large']).optional(),
    bodySize: z.enum(['small', 'medium', 'large']).optional(),
  }).optional(),
});

const BatchTextDesignRequestSchema = z.object({
  designs: z.array(TextDesignRequestSchema).min(1).max(10, 'Maximum 10 designs per batch'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if it's a batch request
    if (body.designs && Array.isArray(body.designs)) {
      // Batch processing
      const validatedData = BatchTextDesignRequestSchema.parse(body);
      
      const results = await Promise.allSettled(
        validatedData.designs.map(design => generateTextDesign(design))
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
          total: validatedData.designs.length,
          successful: successful.length,
          failed: failed.length,
        },
      });
    } else {
      // Single design processing
      const validatedData = TextDesignRequestSchema.parse(body);
      
      const result = await generateTextDesign(validatedData);
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          design: result.design,
        });
      } else {
        return NextResponse.json({
          success: false,
          error: result.error,
        }, { status: 400 });
      }
    }
  } catch (error) {
    console.error('Text design API error:', error);
    
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
        name: 'GPT Image 1 Text Designer',
        description: 'Generate text-heavy designs using GPT Image 1 with extremely detailed prompts',
        model: 'gpt-image-1',
        provider: 'OpenAI',
        capabilities: [
          'Brochures and flyers',
          'Posters and banners',
          'Business cards and certificates',
          'Newsletters and menus',
          'Invitations and labels',
          'Text-heavy marketing materials',
        ],
        supportedDesignTypes: [
          'brochure',
          'flyer',
          'poster',
          'business-card',
          'banner',
          'newsletter',
          'menu',
          'invitation',
          'certificate',
          'label',
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
          'pastel',
          'dark',
          'custom',
        ],
        supportedLayouts: [
          'single-column',
          'two-column',
          'three-column',
          'grid',
          'asymmetric',
          'centered',
        ],
        supportedOrientations: [
          'portrait',
          'landscape',
          'square',
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
        features: [
          'Extremely detailed prompt generation',
          'Professional typography specifications',
          'Custom color schemes',
          'Flexible layouts',
          'Batch processing',
          'Cost optimization',
          'High-quality output',
        ],
        limitations: [
          '⚠️ CRITICAL: Poor face character consistency - NEVER use on images with faces',
          'Avoid portraits, characters, or any human faces in designs',
          'Use only for text-heavy designs without faces',
        ],
        pricing: {
          base: '$5-40 per 1M tokens',
          factors: ['Quality level', 'Image size', 'Prompt complexity'],
        },
        examples: [
          {
            designType: 'brochure',
            title: 'Company Services',
            content: ['Service 1', 'Service 2', 'Service 3'],
            style: 'corporate',
            colorScheme: 'professional',
          },
          {
            designType: 'flyer',
            title: 'Special Event',
            content: ['Event details', 'Date and time', 'Location'],
            style: 'creative',
            colorScheme: 'vibrant',
          },
          {
            designType: 'business-card',
            title: 'John Doe',
            content: ['CEO', 'Company Name'],
            contactInfo: {
              phone: '+1-555-0123',
              email: 'john@company.com',
            },
            style: 'elegant',
            colorScheme: 'professional',
          },
        ],
      },
    });
  } catch (error) {
    console.error('Text design info API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }, { status: 500 });
  }
}
