/**
 * UI Designer API Endpoint
 * 
 * Handles requests for generating UI/UX designs using GPT Image 1.
 * Supports web apps, mobile apps, dashboards, and other interface designs.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateUIDesign } from '../../../../executors/gpt-image-1-ui-designer';

// Request validation schema
const UIDesignRequestSchema = z.object({
  designType: z.enum(['web-app', 'mobile-app', 'dashboard', 'landing-page', 'admin-panel', 'ecommerce', 'portfolio', 'blog', 'saas', 'game-ui']),
  appName: z.string().min(1, 'App name is required'),
  description: z.string().min(1, 'Description is required'),
  features: z.array(z.string()).min(1, 'Features are required'),
  targetUsers: z.string().optional(),
  style: z.enum(['modern', 'minimalist', 'corporate', 'creative', 'elegant', 'bold', 'material', 'flat', 'neumorphism', 'glassmorphism']).default('modern'),
  colorScheme: z.enum(['professional', 'vibrant', 'monochrome', 'dark', 'light', 'custom']).default('professional'),
  customColors: z.object({
    primary: z.string().optional(),
    secondary: z.string().optional(),
    accent: z.string().optional(),
    background: z.string().optional(),
    text: z.string().optional(),
    surface: z.string().optional(),
  }).optional(),
  layout: z.enum(['single-page', 'multi-page', 'dashboard', 'grid', 'sidebar', 'tabs']).default('single-page'),
  orientation: z.enum(['portrait', 'landscape', 'square']).default('landscape'),
  size: z.enum(['1024x1024', '1024x1536', '1536x1024', 'auto']).default('1536x1024'),
  quality: z.enum(['low', 'medium', 'high', 'auto']).default('high'),
  customInstructions: z.string().optional(),
  context: z.string().optional(),
  branding: z.object({
    logo: z.string().optional(),
    tagline: z.string().optional(),
    companyName: z.string().optional(),
  }).optional(),
  navigation: z.object({
    type: z.enum(['header', 'sidebar', 'bottom', 'floating', 'hamburger']).optional(),
    items: z.array(z.string()).optional(),
  }).optional(),
  content: z.object({
    hero: z.string().optional(),
    sections: z.array(z.string()).optional(),
    callToAction: z.string().optional(),
  }).optional(),
  typography: z.object({
    primaryFont: z.string().optional(),
    secondaryFont: z.string().optional(),
    headingSize: z.enum(['small', 'medium', 'large', 'extra-large']).optional(),
    bodySize: z.enum(['small', 'medium', 'large']).optional(),
  }).optional(),
  components: z.object({
    buttons: z.array(z.string()).optional(),
    forms: z.array(z.string()).optional(),
    cards: z.array(z.string()).optional(),
    modals: z.array(z.string()).optional(),
  }).optional(),
});

const BatchUIDesignRequestSchema = z.object({
  designs: z.array(UIDesignRequestSchema).min(1).max(10, 'Maximum 10 designs per batch'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if it's a batch request
    if (body.designs && Array.isArray(body.designs)) {
      // Batch processing
      const validatedData = BatchUIDesignRequestSchema.parse(body);
      
      const results = await Promise.allSettled(
        validatedData.designs.map(design => generateUIDesign(design))
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
      const validatedData = UIDesignRequestSchema.parse(body);
      
      const result = await generateUIDesign(validatedData);
      
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
    console.error('UI design API error:', error);
    
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
        name: 'GPT Image 1 UI Designer',
        description: 'Generate UI/UX designs using GPT Image 1 with extremely detailed prompts',
        model: 'gpt-image-1',
        provider: 'OpenAI',
        capabilities: [
          'Web application interfaces',
          'Mobile application interfaces',
          'Dashboard designs',
          'Landing pages',
          'Admin panels',
          'E-commerce interfaces',
          'Portfolio websites',
          'Blog interfaces',
          'SaaS applications',
          'Game user interfaces',
        ],
        supportedDesignTypes: [
          'web-app',
          'mobile-app',
          'dashboard',
          'landing-page',
          'admin-panel',
          'ecommerce',
          'portfolio',
          'blog',
          'saas',
          'game-ui',
        ],
        supportedStyles: [
          'modern',
          'minimalist',
          'corporate',
          'creative',
          'elegant',
          'bold',
          'material',
          'flat',
          'neumorphism',
          'glassmorphism',
        ],
        supportedColorSchemes: [
          'professional',
          'vibrant',
          'monochrome',
          'dark',
          'light',
          'custom',
        ],
        supportedLayouts: [
          'single-page',
          'multi-page',
          'dashboard',
          'grid',
          'sidebar',
          'tabs',
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
          'Professional UI/UX specifications',
          'Custom color schemes',
          'Flexible layouts',
          'Component specifications',
          'Navigation design',
          'Batch processing',
          'Cost optimization',
          'High-quality output',
        ],
        limitations: [
          '⚠️ CRITICAL: Poor face character consistency - NEVER use on UI elements with faces',
          'Avoid avatars, profile pictures, or any human faces in UI designs',
          'Use only for interface designs without faces',
        ],
        pricing: {
          base: '$5-40 per 1M tokens',
          factors: ['Quality level', 'Image size', 'Prompt complexity'],
        },
        examples: [
          {
            designType: 'web-app',
            appName: 'TaskManager Pro',
            description: 'A modern task management application',
            features: ['Task creation', 'Team collaboration', 'Progress tracking'],
            style: 'modern',
            colorScheme: 'professional',
          },
          {
            designType: 'mobile-app',
            appName: 'Fitness Tracker',
            description: 'A mobile fitness tracking application',
            features: ['Workout tracking', 'Progress monitoring', 'Social features'],
            style: 'material',
            colorScheme: 'vibrant',
          },
          {
            designType: 'dashboard',
            appName: 'Analytics Dashboard',
            description: 'A comprehensive analytics dashboard',
            features: ['Data visualization', 'Real-time metrics', 'Custom reports'],
            style: 'corporate',
            colorScheme: 'dark',
          },
        ],
      },
    });
  } catch (error) {
    console.error('UI design info API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }, { status: 500 });
  }
}
