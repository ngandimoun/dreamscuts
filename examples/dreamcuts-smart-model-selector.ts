/**
 * DreamCuts Smart Model Selector
 * 
 * This system automatically selects the best AI model based on user queries
 * without requiring users to know about different models. The system analyzes
 * the user's intent and automatically routes to the optimal model.
 * 
 * Supported Models:
 * 1. Nano Banana (fal-ai/gemini-25-flash-image) - Best for product labels, character consistency, hand-holding
 * 2. Seedream 4.0 (fal-ai/bytedance/seedream/v4) - Best for 4K, mockups, sketch-to-photo, turnarounds
 * 3. GPT Image 1 (gpt-image-1) - Best for creative concepts, artistic styles, complex scenes
 * 4. Flux SRPO (fal-ai/flux/srpo) - Best for high-quality artistic generation, style transfer
 * 
 * The system automatically chooses the best model based on:
 * - User query analysis
 * - Image type detection
 * - Quality requirements
 * - Use case optimization
 */

import { fal } from "@fal-ai/client";
import { useState, useCallback } from "react";

// ============================================================================
// MODEL CONFIGURATION
// ============================================================================

export interface ModelConfig {
  name: string;
  endpoint: string;
  strengths: string[];
  bestFor: string[];
  costPerImage: number;
  maxResolution: { width: number; height: number };
  averageSpeed: number; // seconds
}

export const MODEL_CONFIGS: Record<string, ModelConfig> = {
  'nano-banana': {
    name: 'Nano Banana',
    endpoint: 'fal-ai/gemini-25-flash-image',
    strengths: [
      'product-label-preservation',
      'character-consistency',
      'hand-holding-products',
      'background-replacement',
      'photo-restoration',
      'text-generation',
      'realistic-details'
    ],
    bestFor: [
      'e-commerce-product-photos',
      'character-consistency',
      'hand-holding-products',
      'background-replacement',
      'photo-restoration',
      'text-and-logo-preservation'
    ],
    costPerImage: 0.039,
    maxResolution: { width: 2048, height: 2048 },
    averageSpeed: 25
  },
  
  'seedream-4': {
    name: 'Seedream 4.0',
    endpoint: 'fal-ai/bytedance/seedream/v4/text-to-image',
    strengths: [
      '4k-resolution',
      'multi-image-composition',
      'sketch-to-photo',
      'character-turnarounds',
      'product-mockups',
      'professional-headshots',
      'virtual-try-ons',
      'speed'
    ],
    bestFor: [
      '4k-generation',
      'product-mockups',
      'sketch-to-photo',
      'character-turnarounds',
      'multi-image-composition',
      'professional-headshots',
      'virtual-try-ons'
    ],
    costPerImage: 0.03,
    maxResolution: { width: 4096, height: 4096 },
    averageSpeed: 15
  },
  
  'gpt-image-1': {
    name: 'GPT Image 1',
    endpoint: 'gpt-image-1',
    strengths: [
      'creative-concepts',
      'artistic-styles',
      'complex-scenes',
      'storytelling',
      'conceptual-art',
      'abstract-concepts',
      'creative-composition'
    ],
    bestFor: [
      'creative-concepts',
      'artistic-styles',
      'complex-scenes',
      'storytelling',
      'conceptual-art',
      'abstract-concepts',
      'creative-composition'
    ],
    costPerImage: 0.04,
    maxResolution: { width: 2048, height: 2048 },
    averageSpeed: 20
  },
  
  'flux-srpo': {
    name: 'Flux SRPO',
    endpoint: 'fal-ai/flux/srpo',
    strengths: [
      'high-quality-artistic',
      'style-transfer',
      'artistic-generation',
      'creative-styles',
      'aesthetic-quality',
      'artistic-composition'
    ],
    bestFor: [
      'high-quality-artistic',
      'style-transfer',
      'artistic-generation',
      'creative-styles',
      'aesthetic-quality',
      'artistic-composition'
    ],
    costPerImage: 0.035,
    maxResolution: { width: 2048, height: 2048 },
    averageSpeed: 18
  }
};

// ============================================================================
// QUERY ANALYSIS SYSTEM
// ============================================================================

export interface QueryAnalysis {
  intent: string;
  imageType: string;
  qualityRequirement: 'standard' | 'high' | 'ultra';
  useCase: string;
  hasText: boolean;
  hasCharacters: boolean;
  hasProducts: boolean;
  hasHands: boolean;
  isCreative: boolean;
  isArtistic: boolean;
  isProfessional: boolean;
  resolutionNeeded: 'standard' | 'high' | '4k';
  complexity: 'simple' | 'medium' | 'complex';
}

export class QueryAnalyzer {
  private static readonly INTENT_KEYWORDS = {
    'product-photo': ['product', 'ecommerce', 'shop', 'sell', 'merchandise', 'item', 'goods'],
    'character-consistency': ['character', 'person', 'model', 'consistent', 'same person', 'character design'],
    'hand-holding': ['hand', 'holding', 'grip', 'touch', 'hand model', 'hand holding'],
    'background-replacement': ['background', 'change background', 'new background', 'replace background'],
    'photo-restoration': ['restore', 'repair', 'fix', 'old photo', 'damaged', 'enhance'],
    '4k-generation': ['4k', 'high resolution', 'ultra hd', 'print quality', 'large format'],
    'mockups': ['mockup', 'mock up', 'brand', 'logo', 'packaging', 'merchandise'],
    'sketch-to-photo': ['sketch', 'line art', 'drawing', 'convert', 'turn into photo'],
    'turnarounds': ['turnaround', 'multiple views', 'different angles', 'character views'],
    'creative-concept': ['creative', 'concept', 'idea', 'imagination', 'artistic', 'abstract'],
    'artistic-style': ['artistic', 'style', 'art', 'painting', 'illustration', 'creative'],
    'professional-headshot': ['headshot', 'professional', 'linkedin', 'corporate', 'business'],
    'virtual-try-on': ['try on', 'wear', 'clothing', 'fashion', 'outfit', 'dress']
  };

  private static readonly QUALITY_KEYWORDS = {
    'ultra': ['4k', 'ultra hd', 'print quality', 'large format', 'high resolution'],
    'high': ['high quality', 'professional', 'premium', 'detailed', 'sharp'],
    'standard': ['standard', 'normal', 'regular', 'basic']
  };

  private static readonly CREATIVE_KEYWORDS = [
    'creative', 'artistic', 'imagination', 'concept', 'abstract', 'surreal',
    'fantasy', 'dream', 'vision', 'art', 'painting', 'illustration'
  ];

  private static readonly PROFESSIONAL_KEYWORDS = [
    'professional', 'corporate', 'business', 'commercial', 'marketing',
    'advertising', 'brand', 'logo', 'headshot', 'linkedin'
  ];

  static analyzeQuery(query: string, referenceImages?: string[]): QueryAnalysis {
    const lowerQuery = query.toLowerCase();
    
    // Detect intent
    const intent = this.detectIntent(lowerQuery);
    
    // Detect image type
    const imageType = this.detectImageType(lowerQuery, referenceImages);
    
    // Detect quality requirement
    const qualityRequirement = this.detectQualityRequirement(lowerQuery);
    
    // Detect use case
    const useCase = this.detectUseCase(lowerQuery, intent);
    
    // Detect features
    const hasText = this.detectText(lowerQuery);
    const hasCharacters = this.detectCharacters(lowerQuery);
    const hasProducts = this.detectProducts(lowerQuery);
    const hasHands = this.detectHands(lowerQuery);
    const isCreative = this.detectCreative(lowerQuery);
    const isArtistic = this.detectArtistic(lowerQuery);
    const isProfessional = this.detectProfessional(lowerQuery);
    
    // Detect resolution needs
    const resolutionNeeded = this.detectResolutionNeeded(lowerQuery, qualityRequirement);
    
    // Detect complexity
    const complexity = this.detectComplexity(lowerQuery, referenceImages);
    
    return {
      intent,
      imageType,
      qualityRequirement,
      useCase,
      hasText,
      hasCharacters,
      hasProducts,
      hasHands,
      isCreative,
      isArtistic,
      isProfessional,
      resolutionNeeded,
      complexity
    };
  }

  private static detectIntent(query: string): string {
    for (const [intent, keywords] of Object.entries(this.INTENT_KEYWORDS)) {
      if (keywords.some(keyword => query.includes(keyword))) {
        return intent;
      }
    }
    return 'general';
  }

  private static detectImageType(query: string, referenceImages?: string[]): string {
    if (referenceImages && referenceImages.length > 0) {
      return 'edit';
    }
    
    if (query.includes('sketch') || query.includes('line art') || query.includes('drawing')) {
      return 'sketch-to-photo';
    }
    
    if (query.includes('product') || query.includes('ecommerce')) {
      return 'product';
    }
    
    if (query.includes('character') || query.includes('person') || query.includes('model')) {
      return 'character';
    }
    
    if (query.includes('artistic') || query.includes('creative') || query.includes('art')) {
      return 'artistic';
    }
    
    return 'general';
  }

  private static detectQualityRequirement(query: string): 'standard' | 'high' | 'ultra' {
    for (const [quality, keywords] of Object.entries(this.QUALITY_KEYWORDS)) {
      if (keywords.some(keyword => query.includes(keyword))) {
        return quality as 'standard' | 'high' | 'ultra';
      }
    }
    return 'standard';
  }

  private static detectUseCase(query: string, intent: string): string {
    if (intent !== 'general') {
      return intent;
    }
    
    if (query.includes('ecommerce') || query.includes('shop') || query.includes('sell')) {
      return 'e-commerce';
    }
    
    if (query.includes('marketing') || query.includes('advertising') || query.includes('campaign')) {
      return 'marketing';
    }
    
    if (query.includes('social media') || query.includes('instagram') || query.includes('facebook')) {
      return 'social-media';
    }
    
    if (query.includes('print') || query.includes('poster') || query.includes('banner')) {
      return 'print';
    }
    
    return 'general';
  }

  private static detectText(query: string): boolean {
    return query.includes('text') || query.includes('logo') || query.includes('label') || 
           query.includes('brand') || query.includes('name') || query.includes('title');
  }

  private static detectCharacters(query: string): boolean {
    return query.includes('character') || query.includes('person') || query.includes('model') ||
           query.includes('human') || query.includes('people') || query.includes('man') ||
           query.includes('woman') || query.includes('child') || query.includes('baby');
  }

  private static detectProducts(query: string): boolean {
    return query.includes('product') || query.includes('item') || query.includes('object') ||
           query.includes('merchandise') || query.includes('goods') || query.includes('thing');
  }

  private static detectHands(query: string): boolean {
    return query.includes('hand') || query.includes('holding') || query.includes('grip') ||
           query.includes('touch') || query.includes('hand model') || query.includes('hand holding');
  }

  private static detectCreative(query: string): boolean {
    return this.CREATIVE_KEYWORDS.some(keyword => query.includes(keyword));
  }

  private static detectArtistic(query: string): boolean {
    return query.includes('artistic') || query.includes('art') || query.includes('painting') ||
           query.includes('illustration') || query.includes('style') || query.includes('aesthetic');
  }

  private static detectProfessional(query: string): boolean {
    return this.PROFESSIONAL_KEYWORDS.some(keyword => query.includes(keyword));
  }

  private static detectResolutionNeeded(query: string, quality: string): 'standard' | 'high' | '4k' {
    if (quality === 'ultra' || query.includes('4k') || query.includes('ultra hd')) {
      return '4k';
    }
    
    if (quality === 'high' || query.includes('high resolution') || query.includes('print')) {
      return 'high';
    }
    
    return 'standard';
  }

  private static detectComplexity(query: string, referenceImages?: string[]): 'simple' | 'medium' | 'complex' {
    const complexKeywords = ['multiple', 'complex', 'detailed', 'intricate', 'sophisticated'];
    const simpleKeywords = ['simple', 'basic', 'minimal', 'clean'];
    
    if (complexKeywords.some(keyword => query.includes(keyword)) || 
        (referenceImages && referenceImages.length > 3)) {
      return 'complex';
    }
    
    if (simpleKeywords.some(keyword => query.includes(keyword)) || 
        (referenceImages && referenceImages.length <= 1)) {
      return 'simple';
    }
    
    return 'medium';
  }
}

// ============================================================================
// SMART MODEL SELECTOR
// ============================================================================

export class SmartModelSelector {
  private static readonly SELECTION_RULES = [
    // Nano Banana Rules
    {
      model: 'nano-banana',
      conditions: [
        { field: 'hasText', value: true, weight: 10 },
        { field: 'hasProducts', value: true, weight: 8 },
        { field: 'hasHands', value: true, weight: 10 },
        { field: 'intent', value: 'product-photo', weight: 9 },
        { field: 'intent', value: 'character-consistency', weight: 9 },
        { field: 'intent', value: 'hand-holding', weight: 10 },
        { field: 'intent', value: 'background-replacement', weight: 8 },
        { field: 'intent', value: 'photo-restoration', weight: 9 },
        { field: 'useCase', value: 'e-commerce', weight: 8 },
        { field: 'isProfessional', value: true, weight: 6 }
      ]
    },
    
    // Seedream 4.0 Rules
    {
      model: 'seedream-4',
      conditions: [
        { field: 'resolutionNeeded', value: '4k', weight: 10 },
        { field: 'intent', value: '4k-generation', weight: 10 },
        { field: 'intent', value: 'mockups', weight: 9 },
        { field: 'intent', value: 'sketch-to-photo', weight: 9 },
        { field: 'intent', value: 'turnarounds', weight: 8 },
        { field: 'intent', value: 'multi-image-composition', weight: 9 },
        { field: 'intent', value: 'professional-headshot', weight: 8 },
        { field: 'intent', value: 'virtual-try-on', weight: 8 },
        { field: 'complexity', value: 'complex', weight: 7 },
        { field: 'qualityRequirement', value: 'ultra', weight: 8 }
      ]
    },
    
    // GPT Image 1 Rules
    {
      model: 'gpt-image-1',
      conditions: [
        { field: 'isCreative', value: true, weight: 10 },
        { field: 'intent', value: 'creative-concept', weight: 10 },
        { field: 'intent', value: 'artistic-style', weight: 9 },
        { field: 'complexity', value: 'complex', weight: 8 },
        { field: 'imageType', value: 'artistic', weight: 9 },
        { field: 'useCase', value: 'marketing', weight: 7 },
        { field: 'useCase', value: 'social-media', weight: 7 }
      ]
    },
    
    // Flux SRPO Rules
    {
      model: 'flux-srpo',
      conditions: [
        { field: 'isArtistic', value: true, weight: 10 },
        { field: 'intent', value: 'artistic-style', weight: 9 },
        { field: 'intent', value: 'style-transfer', weight: 9 },
        { field: 'imageType', value: 'artistic', weight: 8 },
        { field: 'qualityRequirement', value: 'high', weight: 7 },
        { field: 'useCase', value: 'print', weight: 7 }
      ]
    }
  ];

  static selectBestModel(analysis: QueryAnalysis): string {
    const scores: Record<string, number> = {
      'nano-banana': 0,
      'seedream-4': 0,
      'gpt-image-1': 0,
      'flux-srpo': 0
    };

    // Calculate scores based on rules
    for (const rule of this.SELECTION_RULES) {
      for (const condition of rule.conditions) {
        const fieldValue = analysis[condition.field as keyof QueryAnalysis];
        if (fieldValue === condition.value) {
          scores[rule.model] += condition.weight;
        }
      }
    }

    // Find the model with the highest score
    let bestModel = 'nano-banana';
    let highestScore = scores[bestModel];

    for (const [model, score] of Object.entries(scores)) {
      if (score > highestScore) {
        bestModel = model;
        highestScore = score;
      }
    }

    // If no model has a score > 0, default to Nano Banana
    if (highestScore === 0) {
      return 'nano-banana';
    }

    return bestModel;
  }

  static getModelConfig(modelName: string): ModelConfig {
    return MODEL_CONFIGS[modelName] || MODEL_CONFIGS['nano-banana'];
  }
}

// ============================================================================
// DREAMCUTS AUTOMATED IMAGE GENERATOR
// ============================================================================

export interface DreamCutsImageRequest {
  prompt: string;
  referenceImages?: string[];
  options?: {
    quality?: 'standard' | 'high' | 'ultra';
    resolution?: 'standard' | 'high' | '4k';
    style?: 'photographic' | 'artistic' | 'creative';
    numImages?: number;
  };
}

export interface DreamCutsImageResponse {
  success: boolean;
  images: Array<{
    url: string;
    content?: string;
    width: number;
    height: number;
    model: string;
    generationTime: number;
  }>;
  model: string;
  analysis: QueryAnalysis;
  error?: string;
}

export class DreamCutsAutomatedImageGenerator {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateImage(request: DreamCutsImageRequest): Promise<DreamCutsImageResponse> {
    try {
      // Step 1: Analyze the query
      const analysis = QueryAnalyzer.analyzeQuery(request.prompt, request.referenceImages);
      
      // Step 2: Select the best model
      const selectedModel = SmartModelSelector.selectBestModel(analysis);
      const modelConfig = SmartModelSelector.getModelConfig(selectedModel);
      
      // Step 3: Generate the image using the selected model
      const result = await this.callModel(selectedModel, request, analysis);
      
      return {
        success: true,
        images: result.images,
        model: selectedModel,
        analysis,
        ...result
      };
    } catch (error) {
      return {
        success: false,
        images: [],
        model: 'unknown',
        analysis: {} as QueryAnalysis,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private async callModel(
    modelName: string, 
    request: DreamCutsImageRequest, 
    analysis: QueryAnalysis
  ): Promise<{ images: any[]; generationTime: number }> {
    const startTime = Date.now();
    
    switch (modelName) {
      case 'nano-banana':
        return await this.callNanoBanana(request, analysis);
      
      case 'seedream-4':
        return await this.callSeedream4(request, analysis);
      
      case 'gpt-image-1':
        return await this.callGPTImage1(request, analysis);
      
      case 'flux-srpo':
        return await this.callFluxSRPO(request, analysis);
      
      default:
        throw new Error(`Unknown model: ${modelName}`);
    }
  }

  private async callNanoBanana(
    request: DreamCutsImageRequest, 
    analysis: QueryAnalysis
  ): Promise<{ images: any[]; generationTime: number }> {
    const startTime = Date.now();
    
    if (request.referenceImages && request.referenceImages.length > 0) {
      // Use edit endpoint
      const result = await fal.subscribe('fal-ai/gemini-25-flash-image/edit', {
        input: {
          prompt: request.prompt,
          image_urls: request.referenceImages,
          num_images: request.options?.numImages || 1,
          output_format: 'jpeg',
          sync_mode: false
        }
      });
      
      return {
        images: result.data.images?.map((img: any) => ({
          url: img.url,
          content: img.content,
          width: 1024,
          height: 1024,
          model: 'nano-banana',
          generationTime: Date.now() - startTime
        })) || [],
        generationTime: Date.now() - startTime
      };
    } else {
      // Use text-to-image endpoint
      const result = await fal.subscribe('fal-ai/gemini-25-flash-image', {
        input: {
          prompt: request.prompt,
          num_images: request.options?.numImages || 1,
          output_format: 'jpeg',
          sync_mode: false
        }
      });
      
      return {
        images: result.data.images?.map((img: any) => ({
          url: img.url,
          content: img.content,
          width: 1024,
          height: 1024,
          model: 'nano-banana',
          generationTime: Date.now() - startTime
        })) || [],
        generationTime: Date.now() - startTime
      };
    }
  }

  private async callSeedream4(
    request: DreamCutsImageRequest, 
    analysis: QueryAnalysis
  ): Promise<{ images: any[]; generationTime: number }> {
    const startTime = Date.now();
    
    // Determine image size based on analysis
    let imageSize = 'square_hd';
    if (analysis.resolutionNeeded === '4k') {
      imageSize = { width: 4096, height: 4096 };
    } else if (analysis.resolutionNeeded === 'high') {
      imageSize = 'square';
    }
    
    if (request.referenceImages && request.referenceImages.length > 0) {
      // Use edit endpoint
      const result = await fal.subscribe('fal-ai/bytedance/seedream/v4/edit', {
        input: {
          prompt: request.prompt,
          image_urls: request.referenceImages,
          image_size: imageSize,
          num_images: request.options?.numImages || 1,
          enable_safety_checker: true
        }
      });
      
      return {
        images: result.data.images?.map((img: any) => ({
          url: img.url,
          content: img.file_data,
          width: img.width || 1024,
          height: img.height || 1024,
          model: 'seedream-4',
          generationTime: Date.now() - startTime
        })) || [],
        generationTime: Date.now() - startTime
      };
    } else {
      // Use text-to-image endpoint
      const result = await fal.subscribe('fal-ai/bytedance/seedream/v4/text-to-image', {
        input: {
          prompt: request.prompt,
          image_size: imageSize,
          num_images: request.options?.numImages || 1,
          enable_safety_checker: true
        }
      });
      
      return {
        images: result.data.images?.map((img: any) => ({
          url: img.url,
          content: img.file_data,
          width: img.width || 1024,
          height: img.height || 1024,
          model: 'seedream-4',
          generationTime: Date.now() - startTime
        })) || [],
        generationTime: Date.now() - startTime
      };
    }
  }

  private async callGPTImage1(
    request: DreamCutsImageRequest, 
    analysis: QueryAnalysis
  ): Promise<{ images: any[]; generationTime: number }> {
    const startTime = Date.now();
    
    // GPT Image 1 implementation would go here
    // This is a placeholder for the actual GPT Image 1 API call
    const result = await fal.subscribe('gpt-image-1', {
      input: {
        prompt: request.prompt,
        num_images: request.options?.numImages || 1,
        quality: request.options?.quality || 'standard'
      }
    });
    
    return {
      images: result.data.images?.map((img: any) => ({
        url: img.url,
        content: img.content,
        width: 1024,
        height: 1024,
        model: 'gpt-image-1',
        generationTime: Date.now() - startTime
      })) || [],
      generationTime: Date.now() - startTime
    };
  }

  private async callFluxSRPO(
    request: DreamCutsImageRequest, 
    analysis: QueryAnalysis
  ): Promise<{ images: any[]; generationTime: number }> {
    const startTime = Date.now();
    
    // Flux SRPO implementation would go here
    // This is a placeholder for the actual Flux SRPO API call
    const result = await fal.subscribe('fal-ai/flux/srpo', {
      input: {
        prompt: request.prompt,
        num_images: request.options?.numImages || 1,
        quality: request.options?.quality || 'standard'
      }
    });
    
    return {
      images: result.data.images?.map((img: any) => ({
        url: img.url,
        content: img.content,
        width: 1024,
        height: 1024,
        model: 'flux-srpo',
        generationTime: Date.now() - startTime
      })) || [],
      generationTime: Date.now() - startTime
    };
  }
}

// ============================================================================
// REACT HOOK FOR DREAMCUTS
// ============================================================================

export function useDreamCutsImageGeneration(apiKey: string) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState<DreamCutsImageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generator = new DreamCutsAutomatedImageGenerator(apiKey);

  const generateImage = useCallback(async (request: DreamCutsImageRequest) => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generator.generateImage(request);
      setLastResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Image generation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [generator]);

  return {
    generateImage,
    isGenerating,
    lastResult,
    error
  };
}

export default DreamCutsAutomatedImageGenerator;
