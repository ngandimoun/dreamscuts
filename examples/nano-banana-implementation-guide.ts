/**
 * Nano Banana Implementation Guide
 * 
 * This guide shows how to integrate Google's Nano Banana (fal-ai/gemini-25-flash-image)
 * into your existing DreamCuts application, with practical examples and API integration.
 */

import { nanoBananaExamples } from './nano-banana-comprehensive-examples';

// ============================================================================
// API INTEGRATION SETUP
// ============================================================================

export interface NanoBananaConfig {
  apiKey: string;
  model: 'fal-ai/gemini-25-flash-image';
  baseUrl?: string;
}

export interface Seedream4Config {
  apiKey: string;
  model: 'fal-ai/bytedance/seedream/v4/text-to-image' | 'fal-ai/bytedance/seedream/v4/edit';
  baseUrl?: string;
}

export interface NanoBananaRequest {
  prompt: string;
  referenceImages?: string[]; // Base64 or URLs
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  quality?: 'standard' | 'premium';
  style?: 'photographic' | 'artistic' | 'cinematic';
}

export interface NanoBananaEditRequest {
  prompt: string;
  imageUrls: string[]; // URLs of images to edit
  numImages?: number; // Default: 1
  outputFormat?: 'jpeg' | 'png'; // Default: 'jpeg'
  syncMode?: boolean; // When true, returns data URIs instead of URLs
}

export interface Seedream4Request {
  prompt: string;
  imageSize?: 'square_hd' | 'square' | 'portrait_4_3' | 'portrait_16_9' | 'landscape_4_3' | 'landscape_16_9' | { width: number; height: number };
  numImages?: number; // Default: 1
  maxImages?: number; // Default: 1
  seed?: number;
  syncMode?: boolean;
  enableSafetyChecker?: boolean; // Default: true
}

export interface Seedream4EditRequest {
  prompt: string;
  imageUrls: string[]; // URLs of images to edit (up to 10)
  imageSize?: 'square_hd' | 'square' | 'portrait_4_3' | 'portrait_16_9' | 'landscape_4_3' | 'landscape_16_9' | { width: number; height: number };
  numImages?: number; // Default: 1
  maxImages?: number; // Default: 1
  seed?: number;
  syncMode?: boolean;
  enableSafetyChecker?: boolean; // Default: true
}

export interface NanoBananaResponse {
  success: boolean;
  imageUrl?: string;
  imageBase64?: string;
  error?: string;
  metadata?: {
    generationTime: number;
    model: string;
    prompt: string;
  };
}

export interface NanoBananaEditResponse {
  success: boolean;
  images?: Array<{
    url?: string;
    content?: string; // Base64 when syncMode is true
    contentType?: string;
    fileName?: string;
    fileSize?: number;
  }>;
  description?: string;
  error?: string;
  metadata?: {
    generationTime: number;
    model: string;
    prompt: string;
    numImages: number;
  };
}

export interface Seedream4Response {
  success: boolean;
  images?: Array<{
    url?: string;
    content?: string; // Base64 when syncMode is true
    contentType?: string;
    fileName?: string;
    fileSize?: number;
    width?: number;
    height?: number;
  }>;
  seed?: number;
  error?: string;
  metadata?: {
    generationTime: number;
    model: string;
    prompt: string;
    numImages: number;
    imageSize: { width: number; height: number };
  };
}

// ============================================================================
// CORE API CLIENT
// ============================================================================

export class NanoBananaClient {
  private config: NanoBananaConfig;

  constructor(config: NanoBananaConfig) {
    this.config = config;
  }

  async generateImage(request: NanoBananaRequest): Promise<NanoBananaResponse> {
    try {
      const startTime = Date.now();
      
      // Prepare the request payload
      const payload = {
        model: this.config.model,
        prompt: request.prompt,
        images: request.referenceImages,
        aspect_ratio: request.aspectRatio || '1:1',
        quality: request.quality || 'standard',
        style: request.style || 'photographic'
      };

      // Make API call to fal.ai
      const response = await fetch('https://fal.run/fal-ai/gemini-25-flash-image', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const result = await response.json();
      const generationTime = Date.now() - startTime;

      return {
        success: true,
        imageUrl: result.images?.[0]?.url,
        imageBase64: result.images?.[0]?.content,
        metadata: {
          generationTime,
          model: this.config.model,
          prompt: request.prompt
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async editImage(request: NanoBananaEditRequest): Promise<NanoBananaEditResponse> {
    try {
      const startTime = Date.now();
      
      // Prepare the request payload for edit endpoint
      const payload = {
        prompt: request.prompt,
        image_urls: request.imageUrls,
        num_images: request.numImages || 1,
        output_format: request.outputFormat || 'jpeg',
        sync_mode: request.syncMode || false
      };

      // Make API call to fal.ai edit endpoint
      const response = await fetch('https://fal.run/fal-ai/gemini-25-flash-image/edit', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const result = await response.json();
      const generationTime = Date.now() - startTime;

      return {
        success: true,
        images: result.images?.map((img: any) => ({
          url: img.url,
          content: img.content,
          contentType: img.content_type,
          fileName: img.file_name,
          fileSize: img.file_size
        })),
        description: result.description,
        metadata: {
          generationTime,
          model: 'fal-ai/gemini-25-flash-image/edit',
          prompt: request.prompt,
          numImages: request.numImages || 1
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

// ============================================================================
// SEEDREAM 4.0 CLIENT
// ============================================================================

export class Seedream4Client {
  private config: Seedream4Config;

  constructor(config: Seedream4Config) {
    this.config = config;
  }

  async generateImage(request: Seedream4Request): Promise<Seedream4Response> {
    try {
      const startTime = Date.now();
      
      // Prepare the request payload
      const payload = {
        prompt: request.prompt,
        image_size: request.imageSize || 'square_hd',
        num_images: request.numImages || 1,
        max_images: request.maxImages || 1,
        seed: request.seed,
        sync_mode: request.syncMode || false,
        enable_safety_checker: request.enableSafetyChecker !== false
      };

      // Make API call to fal.ai
      const response = await fetch('https://fal.run/fal-ai/bytedance/seedream/v4/text-to-image', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const result = await response.json();
      const generationTime = Date.now() - startTime;

      return {
        success: true,
        images: result.images?.map((img: any) => ({
          url: img.url,
          content: img.file_data,
          contentType: img.content_type,
          fileName: img.file_name,
          fileSize: img.file_size,
          width: img.width,
          height: img.height
        })),
        seed: result.seed,
        metadata: {
          generationTime,
          model: this.config.model,
          prompt: request.prompt,
          numImages: request.numImages || 1,
          imageSize: typeof request.imageSize === 'object' ? request.imageSize : { width: 1024, height: 1024 }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async editImage(request: Seedream4EditRequest): Promise<Seedream4Response> {
    try {
      const startTime = Date.now();
      
      // Prepare the request payload for edit endpoint
      const payload = {
        prompt: request.prompt,
        image_urls: request.imageUrls,
        image_size: request.imageSize || 'square_hd',
        num_images: request.numImages || 1,
        max_images: request.maxImages || 1,
        seed: request.seed,
        sync_mode: request.syncMode || false,
        enable_safety_checker: request.enableSafetyChecker !== false
      };

      // Make API call to fal.ai edit endpoint
      const response = await fetch('https://fal.run/fal-ai/bytedance/seedream/v4/edit', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const result = await response.json();
      const generationTime = Date.now() - startTime;

      return {
        success: true,
        images: result.images?.map((img: any) => ({
          url: img.url,
          content: img.file_data,
          contentType: img.content_type,
          fileName: img.file_name,
          fileSize: img.file_size,
          width: img.width,
          height: img.height
        })),
        seed: result.seed,
        metadata: {
          generationTime,
          model: 'fal-ai/bytedance/seedream/v4/edit',
          prompt: request.prompt,
          numImages: request.numImages || 1,
          imageSize: typeof request.imageSize === 'object' ? request.imageSize : { width: 1024, height: 1024 }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

// ============================================================================
// SPECIALIZED WORKFLOWS
// ============================================================================

export class NanoBananaWorkflows {
  private client: NanoBananaClient;

  constructor(client: NanoBananaClient) {
    this.client = client;
  }

  // Product Photography Workflow
  async createProductPhotography(
    productImage: string,
    backgroundImage: string,
    style: 'flat-lay' | 'lifestyle' | 'studio' = 'studio'
  ): Promise<NanoBananaResponse> {
    const templates = {
      'flat-lay': nanoBananaExamples.productPhotography.hotSauceFlatLay.prompt,
      'lifestyle': nanoBananaExamples.productPhotography.handHoldingProduct.prompt,
      'studio': nanoBananaExamples.productPhotography.floatingProduct.prompt
    };

    const prompt = templates[style]
      .replace('this hot sauce bottle', 'this product')
      .replace('chicken wings', 'complementary items');

    return await this.client.generateImage({
      prompt,
      referenceImages: [productImage, backgroundImage],
      quality: 'premium',
      style: 'photographic'
    });
  }

  // Character Consistency Workflow
  async createCharacterScene(
    characterImage: string,
    action: string,
    environment: string,
    cameraAngle: 'close-up' | 'wide' | 'low-angle' | 'high-angle' = 'wide'
  ): Promise<NanoBananaResponse> {
    const anglePrompts = {
      'close-up': 'Create a close-up shot of this character',
      'wide': 'Create a wide angle shot of this character',
      'low-angle': 'Create a low angle shot from below, looking up at this character',
      'high-angle': 'Create a high angle shot from above, looking down at this character'
    };

    const prompt = `${anglePrompts[cameraAngle]} ${action} in ${environment}. Keep the character's appearance exactly as shown in the reference image. Cinematic lighting, professional photography style.`;

    return await this.client.generateImage({
      prompt,
      referenceImages: [characterImage],
      quality: 'premium',
      style: 'cinematic'
    });
  }

  // Background Replacement Workflow
  async replaceBackground(
    subjectImage: string,
    newBackground: string,
    maintainLighting: boolean = true
  ): Promise<NanoBananaResponse> {
    const lightingInstruction = maintainLighting 
      ? 'Adjust the lighting and shadows to match the new environment.'
      : '';

    const prompt = `Replace the background of this image with ${newBackground}. Keep the main subject exactly the same. ${lightingInstruction} Professional photography style.`;

    return await this.client.generateImage({
      prompt,
      referenceImages: [subjectImage],
      quality: 'premium',
      style: 'photographic'
    });
  }

  // Architectural Visualization Workflow
  async createArchitecturalVisualization(
    floorPlan?: string,
    style: string = 'modern',
    context: string = 'urban environment'
  ): Promise<NanoBananaResponse> {
    const prompt = floorPlan 
      ? `Transform this floor plan into a realistic ${style} architectural rendering in a ${context}. Professional architectural photography style, high quality rendering.`
      : `Create a ${style} building design in a ${context}. Professional architectural visualization, high quality rendering.`;

    return await this.client.generateImage({
      prompt,
      referenceImages: floorPlan ? [floorPlan] : undefined,
      quality: 'premium',
      style: 'photographic'
    });
  }

  // Photo Restoration Workflow
  async restorePhoto(
    oldPhoto: string,
    enhancements: string[] = ['colorize', 'enhance', 'remove-damage']
  ): Promise<NanoBananaResponse> {
    const enhancementText = enhancements.join(', ');
    
    const prompt = `Restore and enhance this old photograph. ${enhancementText}. Convert to high quality, full-color image while maintaining the original character and composition.`;

    return await this.client.generateImage({
      prompt,
      referenceImages: [oldPhoto],
      quality: 'premium',
      style: 'photographic'
    });
  }

  // ============================================================================
  // EDIT WORKFLOWS
  // ============================================================================

  // Multi-Image Editing Workflow
  async editMultipleImages(
    imageUrls: string[],
    editPrompt: string,
    numImages: number = 1,
    outputFormat: 'jpeg' | 'png' = 'jpeg'
  ): Promise<NanoBananaEditResponse> {
    return await this.client.editImage({
      prompt: editPrompt,
      imageUrls,
      numImages,
      outputFormat,
      syncMode: false
    });
  }

  // Character Pose Editing
  async editCharacterPose(
    characterImageUrl: string,
    newPose: string,
    environment: string = 'same environment'
  ): Promise<NanoBananaEditResponse> {
    const prompt = `Edit this character to ${newPose} in the ${environment}. Keep the character's appearance exactly the same, only change the pose and positioning. Professional photography style.`;

    return await this.client.editImage({
      prompt,
      imageUrls: [characterImageUrl],
      numImages: 1,
      outputFormat: 'jpeg'
    });
  }

  // Background Replacement via Edit
  async editBackground(
    subjectImageUrl: string,
    newBackground: string,
    maintainLighting: boolean = true
  ): Promise<NanoBananaEditResponse> {
    const lightingInstruction = maintainLighting 
      ? 'Adjust the lighting and shadows to match the new background environment.'
      : '';

    const prompt = `Replace the background of this image with ${newBackground}. Keep the main subject exactly the same. ${lightingInstruction} Professional photography style.`;

    return await this.client.editImage({
      prompt,
      imageUrls: [subjectImageUrl],
      numImages: 1,
      outputFormat: 'jpeg'
    });
  }

  // Product Enhancement via Edit
  async enhanceProduct(
    productImageUrl: string,
    enhancements: string[] = ['improve lighting', 'add shadows', 'enhance details']
  ): Promise<NanoBananaEditResponse> {
    const enhancementText = enhancements.join(', ');
    
    const prompt = `Enhance this product image by: ${enhancementText}. Keep the product label and appearance exactly the same. Professional commercial photography style.`;

    return await this.client.editImage({
      prompt,
      imageUrls: [productImageUrl],
      numImages: 1,
      outputFormat: 'jpeg'
    });
  }

  // Style Transfer via Edit
  async transferStyle(
    subjectImageUrl: string,
    targetStyle: string,
    preserveSubject: boolean = true
  ): Promise<NanoBananaEditResponse> {
    const preserveInstruction = preserveSubject 
      ? 'Keep the main subject exactly the same, only change the style and aesthetic.'
      : '';

    const prompt = `Transform this image to ${targetStyle} style. ${preserveInstruction} Professional quality.`;

    return await this.client.editImage({
      prompt,
      imageUrls: [subjectImageUrl],
      numImages: 1,
      outputFormat: 'jpeg'
    });
  }

  // Object Addition/Removal via Edit
  async editObjects(
    imageUrl: string,
    action: 'add' | 'remove' | 'replace',
    objectDescription: string,
    replacementObject?: string
  ): Promise<NanoBananaEditResponse> {
    let prompt: string;
    
    switch (action) {
      case 'add':
        prompt = `Add ${objectDescription} to this image. Integrate it naturally with the existing scene and lighting.`;
        break;
      case 'remove':
        prompt = `Remove ${objectDescription} from this image. Fill in the area naturally to maintain the composition.`;
        break;
      case 'replace':
        prompt = `Replace ${objectDescription} with ${replacementObject} in this image. Maintain the same positioning and lighting.`;
        break;
    }

    return await this.client.editImage({
      prompt,
      imageUrls: [imageUrl],
      numImages: 1,
      outputFormat: 'jpeg'
    });
  }

  // Lighting Adjustment via Edit
  async adjustLighting(
    imageUrl: string,
    lightingType: 'dramatic' | 'soft' | 'golden hour' | 'studio' | 'natural',
    intensity: 'subtle' | 'moderate' | 'strong' = 'moderate'
  ): Promise<NanoBananaEditResponse> {
    const prompt = `Adjust the lighting in this image to ${intensity} ${lightingType} lighting. Keep all subjects and objects exactly the same, only change the lighting and shadows. Professional photography style.`;

    return await this.client.editImage({
      prompt,
      imageUrls: [imageUrl],
      numImages: 1,
      outputFormat: 'jpeg'
    });
  }

  // Color Grading via Edit
  async applyColorGrading(
    imageUrl: string,
    colorGrade: 'warm' | 'cool' | 'vintage' | 'cinematic' | 'high contrast' | 'desaturated',
    intensity: 'subtle' | 'moderate' | 'strong' = 'moderate'
  ): Promise<NanoBananaEditResponse> {
    const prompt = `Apply ${intensity} ${colorGrade} color grading to this image. Maintain all details and textures while adjusting the color palette. Professional color grading style.`;

    return await this.client.editImage({
      prompt,
      imageUrls: [imageUrl],
      numImages: 1,
      outputFormat: 'jpeg'
    });
  }
}

// ============================================================================
// SEEDREAM 4.0 WORKFLOWS
// ============================================================================

export class Seedream4Workflows {
  private client: Seedream4Client;

  constructor(client: Seedream4Client) {
    this.client = client;
  }

  // High-Resolution Generation
  async generateHighResolution(
    prompt: string,
    imageSize: { width: number; height: number } = { width: 4096, height: 4096 }
  ): Promise<Seedream4Response> {
    return await this.client.generateImage({
      prompt,
      imageSize,
      numImages: 1,
      enableSafetyChecker: true
    });
  }

  // Product Mockup Generation
  async generateProductMockups(
    brandElement: string,
    productList: string[],
    imageSize: 'square_hd' | 'square' = 'square'
  ): Promise<Seedream4Response> {
    const prompt = `Expand this ${brandElement} into a full spread of product mockups including ${productList.join(', ')}. Professional product photography, white background, studio lighting.`;
    
    return await this.client.generateImage({
      prompt,
      imageSize,
      numImages: 1
    });
  }

  // Character Turnaround Generation
  async generateCharacterTurnarounds(
    characterImageUrl: string,
    views: string[] = ['front', 'side', 'three-quarter', 'back']
  ): Promise<Seedream4Response> {
    const prompt = `Generate ${views.length} different turnaround views of this character - ${views.join(', ')} views. Keep the character appearance exactly the same, professional photography style.`;
    
    return await this.client.editImage({
      prompt,
      imageUrls: [characterImageUrl],
      numImages: views.length
    });
  }

  // Sketch to Photography Conversion
  async convertSketchToPhoto(
    sketchImageUrl: string,
    productType: string,
    productDetails: string,
    setting: string = 'studio',
    background: string = 'white background'
  ): Promise<Seedream4Response> {
    const prompt = `Turn this sketch into a realistic ${productType} shot photographed in ${setting} on ${background}. ${productDetails}, professional product photography, high quality.`;
    
    return await this.client.editImage({
      prompt,
      imageUrls: [sketchImageUrl],
      imageSize: 'square'
    });
  }

  // Multi-Image Composition
  async composeMultipleImages(
    prompt: string,
    imageUrls: string[],
    imageSize: 'square_hd' | 'square' = 'square'
  ): Promise<Seedream4Response> {
    return await this.client.editImage({
      prompt,
      imageUrls,
      imageSize,
      numImages: 1
    });
  }

  // Virtual Try-On
  async virtualTryOn(
    modelImageUrl: string,
    clothingUrls: string[],
    setting: string = 'professional studio',
    lighting: string = 'studio lighting'
  ): Promise<Seedream4Response> {
    const clothingList = clothingUrls.length > 1 ? 'all these clothing items' : 'this clothing item';
    const prompt = `Make the model wear ${clothingList}. ${setting}, ${lighting}, professional fashion photography, high quality.`;
    
    return await this.client.editImage({
      prompt,
      imageUrls: [modelImageUrl, ...clothingUrls],
      imageSize: 'square'
    });
  }

  // Professional Headshot
  async createProfessionalHeadshot(
    casualImageUrl: string,
    purpose: string = 'LinkedIn',
    style: string = 'corporate',
    lighting: string = 'professional lighting',
    background: string = 'clean background',
    attire: string = 'business attire'
  ): Promise<Seedream4Response> {
    const prompt = `Turn this into a professional headshot for ${purpose}. ${style} style, ${lighting}, ${background}, ${attire}.`;
    
    return await this.client.editImage({
      prompt,
      imageUrls: [casualImageUrl],
      imageSize: 'portrait_4_3'
    });
  }

  // Style Transfer
  async transferStyle(
    subjectImageUrl: string,
    targetStyle: string,
    preserveElements: string = 'character and composition'
  ): Promise<Seedream4Response> {
    const prompt = `Transform this image to ${targetStyle} style while keeping the ${preserveElements} exactly the same. High quality.`;
    
    return await this.client.editImage({
      prompt,
      imageUrls: [subjectImageUrl],
      imageSize: 'square'
    });
  }

  // Season Change
  async changeSeason(
    imageUrl: string,
    fromSeason: string,
    toSeason: string,
    seasonalElements: string[] = [],
    lightingChanges: string = '',
    atmosphere: string = ''
  ): Promise<Seedream4Response> {
    const elementsText = seasonalElements.length > 0 ? `Add ${seasonalElements.join(', ')}` : '';
    const prompt = `Change the season from ${fromSeason} to ${toSeason} in this image. ${elementsText}${lightingChanges ? `, ${lightingChanges}` : ''}${atmosphere ? `, ${atmosphere}` : ''}.`;
    
    return await this.client.editImage({
      prompt,
      imageUrls: [imageUrl],
      imageSize: 'landscape_16_9'
    });
  }

  // Product Hands-On
  async addProductHandsOn(
    productImageUrl: string,
    person: string = 'a professional model',
    setting: string = 'professional studio setting',
    background: string = 'white background',
    handPositioning: string = 'natural hand positioning'
  ): Promise<Seedream4Response> {
    const prompt = `Have ${person} hold this product in ${setting} with ${background}. ${handPositioning}, professional product photography, high quality.`;
    
    return await this.client.editImage({
      prompt,
      imageUrls: [productImageUrl],
      imageSize: 'square'
    });
  }

  // Depth Mask Generation
  async generateDepthMask(
    imageUrl: string
  ): Promise<Seedream4Response> {
    const prompt = `Generate a depth mask for this image showing foreground, midground, and background elements with proper depth separation.`;
    
    return await this.client.editImage({
      prompt,
      imageUrls: [imageUrl],
      imageSize: 'square_hd'
    });
  }

  // OpenPose Generation
  async generateOpenPose(
    characterImageUrl: string
  ): Promise<Seedream4Response> {
    const prompt = `Generate an OpenPose skeleton for this character showing all major joints and bone structure for animation reference.`;
    
    return await this.client.editImage({
      prompt,
      imageUrls: [characterImageUrl],
      imageSize: 'square_hd'
    });
  }

  // Logo Editing
  async editLogo(
    logoImageUrl: string,
    oldText: string,
    newText: string,
    designElements: string = 'font style and design'
  ): Promise<Seedream4Response> {
    const prompt = `Change the text in this logo from '${oldText}' to '${newText}' while maintaining the same ${designElements}. Professional logo design.`;
    
    return await this.client.editImage({
      prompt,
      imageUrls: [logoImageUrl],
      imageSize: 'square_hd'
    });
  }
}

// ============================================================================
// INTEGRATION WITH EXISTING DREAMCUTS COMPONENTS
// ============================================================================

export class DreamCutsNanoBananaIntegration {
  private workflows: NanoBananaWorkflows;

  constructor(apiKey: string) {
    const client = new NanoBananaClient({
      apiKey,
      model: 'fal-ai/gemini-25-flash-image'
    });
    this.workflows = new NanoBananaWorkflows(client);
  }
}

export class DreamCutsSeedream4Integration {
  private workflows: Seedream4Workflows;

  constructor(apiKey: string) {
    const client = new Seedream4Client({
      apiKey,
      model: 'fal-ai/bytedance/seedream/v4/text-to-image'
    });
    this.workflows = new Seedream4Workflows(client);
  }
}

export class DreamCutsAIImageIntegration {
  private nanoBananaIntegration: DreamCutsNanoBananaIntegration;
  private seedream4Integration: DreamCutsSeedream4Integration;

  constructor(apiKey: string) {
    this.nanoBananaIntegration = new DreamCutsNanoBananaIntegration(apiKey);
    this.seedream4Integration = new DreamCutsSeedream4Integration(apiKey);
  }

  // Choose the best model for the task
  async generateOptimalImage(
    task: 'product-photo' | 'character-consistency' | 'hand-holding' | 'background-replacement' | 'photo-restoration' | '4k-generation' | 'mockups' | 'turnarounds' | 'sketch-to-photo',
    prompt: string,
    referenceImages?: string[],
    options?: any
  ) {
    switch (task) {
      case 'product-photo':
      case 'character-consistency':
      case 'hand-holding':
      case 'background-replacement':
      case 'photo-restoration':
        // Use Nano Banana for these tasks
        return await this.nanoBananaIntegration.workflows.createProductPhotography(
          referenceImages?.[0] || '',
          referenceImages?.[1] || '',
          'studio'
        );
      
      case '4k-generation':
      case 'mockups':
      case 'turnarounds':
      case 'sketch-to-photo':
        // Use Seedream 4.0 for these tasks
        return await this.seedream4Integration.workflows.generateHighResolution(
          prompt,
          { width: 4096, height: 4096 }
        );
      
      default:
        // Default to Nano Banana
        return await this.nanoBananaIntegration.workflows.createProductPhotography(
          referenceImages?.[0] || '',
          referenceImages?.[1] || '',
          'studio'
        );
    }
  }

  // Integration with existing image analyzer
  async enhanceAnalyzedImage(
    originalImage: string,
    analysisResult: any,
    enhancementType: 'product-photo' | 'character-consistency' | 'background-replacement'
  ): Promise<NanoBananaResponse> {
    switch (enhancementType) {
      case 'product-photo':
        return await this.workflows.createProductPhotography(
          originalImage,
          '', // No background image needed for basic product photo
          'studio'
        );
      
      case 'character-consistency':
        return await this.workflows.createCharacterScene(
          originalImage,
          'in a professional setting',
          'modern office environment'
        );
      
      case 'background-replacement':
        return await this.workflows.replaceBackground(
          originalImage,
          'professional studio background'
        );
      
      default:
        throw new Error(`Unknown enhancement type: ${enhancementType}`);
    }
  }

  // Integration with video generation pipeline
  async createVideoTransitionFrames(
    characterImage: string,
    transitionType: 'rotation' | 'movement' | 'environment-change'
  ): Promise<NanoBananaResponse[]> {
    const frames: NanoBananaResponse[] = [];
    
    switch (transitionType) {
      case 'rotation':
        // Create multiple angles for smooth rotation
        const angles = ['front-facing', 'side profile', 'behind view'];
        for (const angle of angles) {
          const result = await this.workflows.createCharacterScene(
            characterImage,
            `in ${angle} pose`,
            'same environment',
            'wide'
          );
          frames.push(result);
        }
        break;
      
      case 'movement':
        // Create action sequence frames
        const actions = ['standing', 'walking', 'running'];
        for (const action of actions) {
          const result = await this.workflows.createCharacterScene(
            characterImage,
            action,
            'outdoor environment',
            'wide'
          );
          frames.push(result);
        }
        break;
      
      case 'environment-change':
        // Create same character in different environments
        const environments = ['office', 'outdoor park', 'studio'];
        for (const env of environments) {
          const result = await this.workflows.createCharacterScene(
            characterImage,
            'standing confidently',
            env,
            'wide'
          );
          frames.push(result);
        }
        break;
    }
    
    return frames;
  }
}

// ============================================================================
// REACT HOOKS FOR UI INTEGRATION
// ============================================================================

import { useState, useCallback } from 'react';

export function useNanoBananaGeneration(apiKey: string) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [lastResult, setLastResult] = useState<NanoBananaResponse | null>(null);
  const [lastEditResult, setLastEditResult] = useState<NanoBananaEditResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const integration = new DreamCutsNanoBananaIntegration(apiKey);

  const generateImage = useCallback(async (
    prompt: string,
    referenceImages?: string[],
    options?: Partial<NanoBananaRequest>
  ) => {
    setIsGenerating(true);
    setError(null);

    try {
      const client = new NanoBananaClient({
        apiKey,
        model: 'fal-ai/gemini-25-flash-image'
      });

      const result = await client.generateImage({
        prompt,
        referenceImages,
        ...options
      });

      setLastResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Generation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [apiKey]);

  const editImage = useCallback(async (
    prompt: string,
    imageUrls: string[],
    options?: Partial<NanoBananaEditRequest>
  ) => {
    setIsEditing(true);
    setError(null);

    try {
      const client = new NanoBananaClient({
        apiKey,
        model: 'fal-ai/gemini-25-flash-image'
      });

      const result = await client.editImage({
        prompt,
        imageUrls,
        ...options
      });

      setLastEditResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Edit failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsEditing(false);
    }
  }, [apiKey]);

  const createProductPhoto = useCallback(async (
    productImage: string,
    backgroundImage: string,
    style: 'flat-lay' | 'lifestyle' | 'studio' = 'studio'
  ) => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await integration.workflows.createProductPhotography(
        productImage,
        backgroundImage,
        style
      );
      setLastResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Product photo creation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [integration]);

  const editProductPhoto = useCallback(async (
    productImageUrl: string,
    enhancements: string[] = ['improve lighting', 'add shadows', 'enhance details']
  ) => {
    setIsEditing(true);
    setError(null);

    try {
      const result = await integration.workflows.enhanceProduct(
        productImageUrl,
        enhancements
      );
      setLastEditResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Product enhancement failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsEditing(false);
    }
  }, [integration]);

  const replaceBackground = useCallback(async (
    subjectImageUrl: string,
    newBackground: string,
    maintainLighting: boolean = true
  ) => {
    setIsEditing(true);
    setError(null);

    try {
      const result = await integration.workflows.editBackground(
        subjectImageUrl,
        newBackground,
        maintainLighting
      );
      setLastEditResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Background replacement failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsEditing(false);
    }
  }, [integration]);

  const adjustLighting = useCallback(async (
    imageUrl: string,
    lightingType: 'dramatic' | 'soft' | 'golden hour' | 'studio' | 'natural',
    intensity: 'subtle' | 'moderate' | 'strong' = 'moderate'
  ) => {
    setIsEditing(true);
    setError(null);

    try {
      const result = await integration.workflows.adjustLighting(
        imageUrl,
        lightingType,
        intensity
      );
      setLastEditResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lighting adjustment failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsEditing(false);
    }
  }, [integration]);

  return {
    // Generation methods
    generateImage,
    createProductPhoto,
    
    // Edit methods
    editImage,
    editProductPhoto,
    replaceBackground,
    adjustLighting,
    
    // State
    isGenerating,
    isEditing,
    lastResult,
    lastEditResult,
    error
  };
}

export function useSeedream4Generation(apiKey: string) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [lastResult, setLastResult] = useState<Seedream4Response | null>(null);
  const [lastEditResult, setLastEditResult] = useState<Seedream4Response | null>(null);
  const [error, setError] = useState<string | null>(null);

  const integration = new DreamCutsSeedream4Integration(apiKey);

  const generateImage = useCallback(async (
    prompt: string,
    imageSize?: 'square_hd' | 'square' | 'portrait_4_3' | 'portrait_16_9' | 'landscape_4_3' | 'landscape_16_9' | { width: number; height: number },
    options?: Partial<Seedream4Request>
  ) => {
    setIsGenerating(true);
    setError(null);

    try {
      const client = new Seedream4Client({
        apiKey,
        model: 'fal-ai/bytedance/seedream/v4/text-to-image'
      });

      const result = await client.generateImage({
        prompt,
        imageSize,
        ...options
      });

      setLastResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Generation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [apiKey]);

  const editImage = useCallback(async (
    prompt: string,
    imageUrls: string[],
    options?: Partial<Seedream4EditRequest>
  ) => {
    setIsEditing(true);
    setError(null);

    try {
      const client = new Seedream4Client({
        apiKey,
        model: 'fal-ai/bytedance/seedream/v4/edit'
      });

      const result = await client.editImage({
        prompt,
        imageUrls,
        ...options
      });

      setLastEditResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Edit failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsEditing(false);
    }
  }, [apiKey]);

  const generateHighResolution = useCallback(async (
    prompt: string,
    imageSize: { width: number; height: number } = { width: 4096, height: 4096 }
  ) => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await integration.workflows.generateHighResolution(prompt, imageSize);
      setLastResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'High-resolution generation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [integration]);

  const generateProductMockups = useCallback(async (
    brandElement: string,
    productList: string[],
    imageSize: 'square_hd' | 'square' = 'square'
  ) => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await integration.workflows.generateProductMockups(brandElement, productList, imageSize);
      setLastResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Product mockup generation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [integration]);

  const convertSketchToPhoto = useCallback(async (
    sketchImageUrl: string,
    productType: string,
    productDetails: string
  ) => {
    setIsEditing(true);
    setError(null);

    try {
      const result = await integration.workflows.convertSketchToPhoto(sketchImageUrl, productType, productDetails);
      setLastEditResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sketch to photo conversion failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsEditing(false);
    }
  }, [integration]);

  const generateCharacterTurnarounds = useCallback(async (
    characterImageUrl: string,
    views: string[] = ['front', 'side', 'three-quarter', 'back']
  ) => {
    setIsEditing(true);
    setError(null);

    try {
      const result = await integration.workflows.generateCharacterTurnarounds(characterImageUrl, views);
      setLastEditResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Character turnaround generation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsEditing(false);
    }
  }, [integration]);

  return {
    // Generation methods
    generateImage,
    generateHighResolution,
    generateProductMockups,
    
    // Edit methods
    editImage,
    convertSketchToPhoto,
    generateCharacterTurnarounds,
    
    // State
    isGenerating,
    isEditing,
    lastResult,
    lastEditResult,
    error
  };
}

export function useAIImageGeneration(apiKey: string) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const integration = new DreamCutsAIImageIntegration(apiKey);

  const generateOptimalImage = useCallback(async (
    task: 'product-photo' | 'character-consistency' | 'hand-holding' | 'background-replacement' | 'photo-restoration' | '4k-generation' | 'mockups' | 'turnarounds' | 'sketch-to-photo',
    prompt: string,
    referenceImages?: string[],
    options?: any
  ) => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await integration.generateOptimalImage(task, prompt, referenceImages, options);
      setLastResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Image generation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [integration]);

  return {
    generateOptimalImage,
    isGenerating,
    isEditing,
    lastResult,
    error
  };
}

// ============================================================================
// EXAMPLE USAGE IN COMPONENTS
// ============================================================================

export const NanoBananaExampleComponent = () => {
  const { 
    generateImage, 
    createProductPhoto, 
    editImage,
    editProductPhoto,
    replaceBackground,
    adjustLighting,
    isGenerating, 
    isEditing,
    lastResult, 
    lastEditResult,
    error 
  } = useNanoBananaGeneration('your-api-key');

  const handleProductPhotoGeneration = async () => {
    try {
      const result = await createProductPhoto(
        'base64-product-image',
        'base64-background-image',
        'studio'
      );
      
      if (result.success && result.imageUrl) {
        // Display the generated image
        console.log('Generated product photo:', result.imageUrl);
      }
    } catch (err) {
      console.error('Failed to generate product photo:', err);
    }
  };

  const handleCustomGeneration = async () => {
    try {
      const result = await generateImage(
        nanoBananaExamples.productPhotography.hotSauceFlatLay.prompt,
        ['reference-image-1', 'reference-image-2'],
        { quality: 'premium', style: 'photographic' }
      );
      
      if (result.success && result.imageUrl) {
        console.log('Generated image:', result.imageUrl);
      }
    } catch (err) {
      console.error('Failed to generate image:', err);
    }
  };

  const handleImageEdit = async () => {
    try {
      const result = await editImage(
        'make this product photo more dramatic with better lighting and shadows',
        ['https://example.com/product-image.jpg'],
        { numImages: 1, outputFormat: 'jpeg' }
      );
      
      if (result.success && result.images?.[0]) {
        console.log('Edited image:', result.images[0].url);
        console.log('Description:', result.description);
      }
    } catch (err) {
      console.error('Failed to edit image:', err);
    }
  };

  const handleProductEnhancement = async () => {
    try {
      const result = await editProductPhoto(
        'https://example.com/product-image.jpg',
        ['improve lighting', 'add professional shadows', 'enhance product details']
      );
      
      if (result.success && result.images?.[0]) {
        console.log('Enhanced product photo:', result.images[0].url);
      }
    } catch (err) {
      console.error('Failed to enhance product photo:', err);
    }
  };

  const handleBackgroundReplacement = async () => {
    try {
      const result = await replaceBackground(
        'https://example.com/subject-image.jpg',
        'modern studio background with soft lighting',
        true // maintain lighting
      );
      
      if (result.success && result.images?.[0]) {
        console.log('Background replaced:', result.images[0].url);
      }
    } catch (err) {
      console.error('Failed to replace background:', err);
    }
  };

  const handleLightingAdjustment = async () => {
    try {
      const result = await adjustLighting(
        'https://example.com/image.jpg',
        'dramatic',
        'strong'
      );
      
      if (result.success && result.images?.[0]) {
        console.log('Lighting adjusted:', result.images[0].url);
      }
    } catch (err) {
      console.error('Failed to adjust lighting:', err);
    }
  };

  return (
    <div className="nano-banana-component">
      <h2>Nano Banana Image Generation & Editing</h2>
      
      {/* Generation Section */}
      <div className="generation-section">
        <h3>Image Generation</h3>
        <button 
          onClick={handleProductPhotoGeneration}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Create Product Photo'}
        </button>
        
        <button 
          onClick={handleCustomGeneration}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Custom Image'}
        </button>
      </div>

      {/* Editing Section */}
      <div className="editing-section">
        <h3>Image Editing</h3>
        <button 
          onClick={handleImageEdit}
          disabled={isEditing}
        >
          {isEditing ? 'Editing...' : 'Edit Image'}
        </button>
        
        <button 
          onClick={handleProductEnhancement}
          disabled={isEditing}
        >
          {isEditing ? 'Enhancing...' : 'Enhance Product Photo'}
        </button>
        
        <button 
          onClick={handleBackgroundReplacement}
          disabled={isEditing}
        >
          {isEditing ? 'Replacing...' : 'Replace Background'}
        </button>
        
        <button 
          onClick={handleLightingAdjustment}
          disabled={isEditing}
        >
          {isEditing ? 'Adjusting...' : 'Adjust Lighting'}
        </button>
      </div>
      
      {error && (
        <div className="error">
          Error: {error}
        </div>
      )}
      
      {/* Generation Results */}
      {lastResult?.success && lastResult.imageUrl && (
        <div className="result">
          <h4>Generated Image</h4>
          <img src={lastResult.imageUrl} alt="Generated" />
          <p>Generation time: {lastResult.metadata?.generationTime}ms</p>
        </div>
      )}

      {/* Edit Results */}
      {lastEditResult?.success && lastEditResult.images?.[0] && (
        <div className="result">
          <h4>Edited Image</h4>
          <img src={lastEditResult.images[0].url} alt="Edited" />
          {lastEditResult.description && (
            <p>Description: {lastEditResult.description}</p>
          )}
          <p>Edit time: {lastEditResult.metadata?.generationTime}ms</p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const NanoBananaUtils = {
  // Convert file to base64 for API
  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  },

  // Validate image format
  isValidImageFormat: (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    return validTypes.includes(file.type);
  },

  // Generate prompt from template
  generatePromptFromTemplate: (
    template: string,
    variables: Record<string, string>
  ): string => {
    let prompt = template;
    Object.entries(variables).forEach(([key, value]) => {
      prompt = prompt.replace(`[${key.toUpperCase()}]`, value);
    });
    return prompt;
  },

  // Estimate generation cost (if applicable)
  estimateCost: (quality: 'standard' | 'premium'): number => {
    // This would depend on the actual pricing model
    return quality === 'premium' ? 0.05 : 0.02; // Example pricing
  }
};

export default {
  NanoBananaClient,
  NanoBananaWorkflows,
  DreamCutsNanoBananaIntegration,
  useNanoBananaGeneration,
  NanoBananaUtils
};
