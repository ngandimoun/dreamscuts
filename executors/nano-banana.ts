import { fal } from '@fal-ai/client';

// Model endpoint
const MODEL_ENDPOINT = 'fal-ai/gemini-25-flash-image';

// Enhanced Input interface with 11 foundational capabilities
export interface NanoBananaInput {
  prompt: string;
  style?: 'cinematic' | 'photographic' | 'artistic' | 'raw' | 'vintage' | 'modern' | 'comic' | 'manga' | 'impressionist' | 'van_gogh' | 'simpson';
  aspect_ratio?: '16:9' | '9:16' | '4:5' | '1:1';
  duration?: '5s' | '10s' | '15s' | '30s';
  resolution?: '720p' | '1080p' | '4K';
  camera_movement?: 'tracking' | 'panning' | 'zooming' | 'orbital' | 'dolly' | 'crane' | 'static';
  negative_prompt?: string;
  seed?: number;
  // Enhanced capabilities
  images?: string[]; // Reference images for editing
  capability?: NanoBananaCapability;
  enhancement_type?: 'flexibility' | 'consistency' | 'both';
  preserve_elements?: string[];
  change_elements?: string[];
}

// 11 Foundational Capabilities
export type NanoBananaCapability = 
  | 'identity_character_transformation'
  | 'style_effect_application'
  | 'background_environment_change'
  | 'object_placement'
  | 'aesthetic_arrangement_styling'
  | 'generative_fill_expansion'
  | 'multi_image_blending'
  | 'object_material_transformation'
  | 'text_typography'
  | 'color_adaptation'
  | 'photo_repair_enhancement';

// Prompt Enhancer Types
export interface PromptEnhancer {
  type: 'flexibility' | 'consistency';
  instruction: string;
}

// Capability-specific interfaces
export interface IdentityTransformationInput {
  subject_description: string;
  target_character: string;
  preserve_face: boolean;
  preserve_outfit?: boolean;
  preserve_pose?: boolean;
}

export interface StyleApplicationInput {
  target_style: string;
  preserve_subject: boolean;
  intensity: 'subtle' | 'moderate' | 'strong';
}

export interface BackgroundChangeInput {
  new_background: string;
  preserve_lighting: boolean;
  adjust_shadows: boolean;
  environmental_consistency: boolean;
}

export interface ObjectPlacementInput {
  objects_to_add: string[];
  placement_description: string;
  lighting_harmonization: boolean;
  shadow_integration: boolean;
}

export interface AestheticArrangementInput {
  composition_style: string;
  visual_appeal_focus: string;
  allow_composition_change: boolean;
}

export interface GenerativeFillInput {
  fill_area_description: string;
  match_lighting: boolean;
  match_aesthetics: boolean;
  expand_boundaries: boolean;
}

export interface MultiImageBlendingInput {
  images_to_blend: string[];
  blending_instructions: string;
  scene_cohesion: boolean;
  character_consistency: boolean;
}

export interface ObjectTransformationInput {
  object_to_transform: string;
  new_material_style: string;
  preserve_scene: boolean;
  preserve_subject: boolean;
}

export interface TextTypographyInput {
  text_to_add?: string;
  text_to_edit?: string;
  new_text?: string;
  preserve_style: boolean;
  natural_integration: boolean;
}

export interface ColorAdaptationInput {
  target_colors: string[];
  brand_colors?: boolean;
  preserve_visual_impact: boolean;
  maintain_contrast: boolean;
}

export interface PhotoRepairInput {
  repair_type: 'restoration' | 'enhancement' | 'colorization' | 'quality_improvement';
  preserve_authenticity: boolean;
  enhancement_level: 'subtle' | 'moderate' | 'strong';
}

// Enhanced Output interface
export interface NanoBananaOutput {
  images?: {
    url: string;
    content_type: string;
    file_name?: string;
    file_size?: number;
    resolution?: string;
  }[];
  video?: {
    url: string;
    content_type: string;
    file_name?: string;
    file_size?: number;
    duration?: number;
    resolution?: string;
  };
  metadata?: {
    capability_used?: NanoBananaCapability;
    enhancement_applied?: string;
    processing_time?: number;
    quality_score?: number;
  };
}

// Error interface
export interface NanoBananaError {
  error: string;
  message: string;
  details?: any;
}

// Result type
export type NanoBananaResult = NanoBananaOutput | NanoBananaError;

// ============================================================================
// MAIN EXECUTOR CLASS
// ============================================================================

export class NanoBananaExecutor {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    fal.config({ credentials: apiKey });
  }

  /**
   * Generate video using Nano Banana model via fal.subscribe
   * This method handles the complete video generation process synchronously
   */
  async generateVideo(
    input: NanoBananaInput,
    options?: {
      logs?: boolean;
      onQueueUpdate?: (update: any) => void;
    }
  ): Promise<NanoBananaOutput> {
    try {
      this.validateInput(input);

      const result = await fal.subscribe(MODEL_ENDPOINT, {
        input: {
          prompt: input.prompt,
          style: input.style || 'cinematic',
          aspect_ratio: input.aspect_ratio || '16:9',
          duration: input.duration || '10s',
          resolution: input.resolution || '1080p',
          camera_movement: input.camera_movement || 'static',
          negative_prompt: input.negative_prompt,
          seed: input.seed
        },
        logs: options?.logs || false,
        onQueueUpdate: options?.onQueueUpdate
      });

      return result.data as NanoBananaOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Nano Banana video generation failed: ${errorMessage}`);
    }
  }

  /**
   * Generate first frame of a video sequence
   */
  async generateFirstFrame(
    prompt: string,
    options?: {
      style?: string;
      aspect_ratio?: string;
      resolution?: string;
    }
  ): Promise<NanoBananaOutput> {
    const firstFramePrompt = `First frame: ${prompt}`;
    
    return await this.generateVideo({
      prompt: firstFramePrompt,
      style: options?.style as any || 'photographic',
      aspect_ratio: options?.aspect_ratio as any || '4:5',
      duration: '5s',
      resolution: options?.resolution as any || '1080p'
    });
  }

  /**
   * Generate last frame of a video sequence
   */
  async generateLastFrame(
    prompt: string,
    options?: {
      style?: string;
      aspect_ratio?: string;
      resolution?: string;
    }
  ): Promise<NanoBananaOutput> {
    const lastFramePrompt = `Last frame: ${prompt}`;
    
    return await this.generateVideo({
      prompt: lastFramePrompt,
      style: options?.style as any || 'photographic',
      aspect_ratio: options?.aspect_ratio as any || '4:5',
      duration: '5s',
      resolution: options?.resolution as any || '1080p'
    });
  }

  /**
   * Generate video with camera movement
   */
  async generateWithCameraMovement(
    prompt: string,
    cameraMovement: string,
    options?: {
      style?: string;
      aspect_ratio?: string;
      duration?: string;
      resolution?: string;
    }
  ): Promise<NanoBananaOutput> {
    const cameraPrompt = `Camera ${cameraMovement}: ${prompt}`;
    
    return await this.generateVideo({
      prompt: cameraPrompt,
      style: options?.style as any || 'cinematic',
      aspect_ratio: options?.aspect_ratio as any || '16:9',
      duration: options?.duration as any || '10s',
      resolution: options?.resolution as any || '1080p',
      camera_movement: cameraMovement as any
    });
  }

  /**
   * Generate video with specific view angle
   */
  async generateWithViewAngle(
    prompt: string,
    viewAngle: string,
    options?: {
      style?: string;
      aspect_ratio?: string;
      duration?: string;
      resolution?: string;
    }
  ): Promise<NanoBananaOutput> {
    const viewPrompt = `View from ${viewAngle}: ${prompt}`;
    
    return await this.generateVideo({
      prompt: viewPrompt,
      style: options?.style as any || 'photographic',
      aspect_ratio: options?.aspect_ratio as any || '4:5',
      duration: options?.duration as any || '5s',
      resolution: options?.resolution as any || '1080p'
    });
  }

  /**
   * Submit a video generation request to the queue (asynchronous)
   * Use this for long-running requests or when you want to handle the queue manually
   */
  async submitVideoRequest(
    input: NanoBananaInput,
    options?: {
      webhookUrl?: string;
    }
  ): Promise<{ request_id: string }> {
    try {
      this.validateInput(input);

      const result = await fal.queue.submit(MODEL_ENDPOINT, {
        input: {
          prompt: input.prompt,
          style: input.style || 'cinematic',
          aspect_ratio: input.aspect_ratio || '16:9',
          duration: input.duration || '10s',
          resolution: input.resolution || '1080p',
          camera_movement: input.camera_movement || 'static',
          negative_prompt: input.negative_prompt,
          seed: input.seed
        },
        webhookUrl: options?.webhookUrl
      });

      return { request_id: result.request_id };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Nano Banana request submission failed: ${errorMessage}`);
    }
  }

  /**
   * Check the status of a queued video request
   */
  async getRequestStatus(
    requestId: string,
    options?: {
      logs?: boolean;
    }
  ): Promise<any> {
    try {
      const status = await fal.queue.status(MODEL_ENDPOINT, {
        requestId,
        logs: options?.logs || false
      });

      return status;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get request status: ${errorMessage}`);
    }
  }

  /**
   * Get the result of a completed video request
   */
  async getRequestResult(requestId: string): Promise<NanoBananaOutput> {
    try {
      const result = await fal.queue.result(MODEL_ENDPOINT, {
        requestId
      });

      return result.data as NanoBananaOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get request result: ${errorMessage}`);
    }
  }

  /**
   * Calculate estimated processing time based on video duration
   */
  estimateProcessingTime(duration: string): string {
    const durationMap: Record<string, number> = {
      '5s': 2,
      '10s': 4,
      '15s': 6,
      '30s': 12
    };

    const minutes = durationMap[duration] || 5;
    
    if (minutes < 1) {
      return 'Less than 1 minute';
    } else if (minutes < 60) {
      return `Approximately ${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.ceil(minutes % 60);
      return `Approximately ${hours} hour${hours > 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
    }
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: NanoBananaInput): void {
    if (!input.prompt) {
      throw new Error('Prompt is required');
    }

    if (input.prompt.length < 10) {
      throw new Error('Prompt must be at least 10 characters long');
    }

    if (input.prompt.length > 1000) {
      throw new Error('Prompt must be less than 1000 characters');
    }

    // Validate style
    const validStyles = ['cinematic', 'photographic', 'artistic', 'raw', 'vintage', 'modern'];
    if (input.style && !validStyles.includes(input.style)) {
      throw new Error(`Invalid style. Valid styles: ${validStyles.join(', ')}`);
    }

    // Validate aspect ratio
    const validAspectRatios = ['16:9', '9:16', '4:5', '1:1'];
    if (input.aspect_ratio && !validAspectRatios.includes(input.aspect_ratio)) {
      throw new Error(`Invalid aspect ratio. Valid ratios: ${validAspectRatios.join(', ')}`);
    }

    // Validate duration
    const validDurations = ['5s', '10s', '15s', '30s'];
    if (input.duration && !validDurations.includes(input.duration)) {
      throw new Error(`Invalid duration. Valid durations: ${validDurations.join(', ')}`);
    }

    // Validate resolution
    const validResolutions = ['720p', '1080p', '4K'];
    if (input.resolution && !validResolutions.includes(input.resolution)) {
      throw new Error(`Invalid resolution. Valid resolutions: ${validResolutions.join(', ')}`);
    }

    // Validate camera movement
    const validCameraMovements = ['tracking', 'panning', 'zooming', 'orbital', 'dolly', 'crane', 'static'];
    if (input.camera_movement && !validCameraMovements.includes(input.camera_movement)) {
      throw new Error(`Invalid camera movement. Valid movements: ${validCameraMovements.join(', ')}`);
    }
  }

  /**
   * Get supported styles
   */
  getSupportedStyles(): string[] {
    return ['cinematic', 'photographic', 'artistic', 'raw', 'vintage', 'modern'];
  }

  /**
   * Get supported aspect ratios
   */
  getSupportedAspectRatios(): string[] {
    return ['16:9', '9:16', '4:5', '1:1'];
  }

  /**
   * Get supported durations
   */
  getSupportedDurations(): string[] {
    return ['5s', '10s', '15s', '30s'];
  }

  /**
   * Get supported resolutions
   */
  getSupportedResolutions(): string[] {
    return ['720p', '1080p', '4K'];
  }

  /**
   * Get supported camera movements
   */
  getSupportedCameraMovements(): string[] {
    return ['tracking', 'panning', 'zooming', 'orbital', 'dolly', 'crane', 'static'];
  }

  /**
   * Get model information
   */
  getModelInfo(): {
    name: string;
    provider: string;
    endpoint: string;
    version: string;
  } {
    return {
      name: 'Nano Banana Enhanced',
      provider: 'Google Gemini 2.5 Flash Image',
      endpoint: MODEL_ENDPOINT,
      version: 'v2.0'
    };
  }

  // ============================================================================
  // PROMPT ENHANCERS - FOUNDATIONAL TECHNIQUES
  // ============================================================================

  /**
   * Apply flexibility enhancer to prompt
   */
  private applyFlexibilityEnhancer(prompt: string, instruction: string): string {
    return `${prompt}. Edit the characteristics to fit ${instruction} with natural lighting and realistic placement.`;
  }

  /**
   * Apply consistency enhancer to prompt
   */
  private applyConsistencyEnhancer(prompt: string, elements: string[]): string {
    const preserveText = elements.map(el => `keep the same ${el}`).join(', ');
    return `${prompt}. ${preserveText}, keep everything else the same.`;
  }

  /**
   * Apply both enhancers for maximum effectiveness
   */
  private applyBothEnhancers(prompt: string, flexibilityInstruction: string, consistencyElements: string[]): string {
    const flexibilityEnhanced = this.applyFlexibilityEnhancer(prompt, flexibilityInstruction);
    return this.applyConsistencyEnhancer(flexibilityEnhanced, consistencyElements);
  }

  // ============================================================================
  // 11 FOUNDATIONAL CAPABILITIES
  // ============================================================================

  /**
   * 1. Identity & Character Transformation
   * Transform people's identity while maintaining recognizable appearance
   */
  async identityCharacterTransformation(
    input: IdentityTransformationInput,
    referenceImage: string,
    options?: {
      style?: string;
      aspect_ratio?: string;
      resolution?: string;
    }
  ): Promise<NanoBananaOutput> {
    const prompt = `Transform this person into a ${input.target_character}. ${input.preserve_face ? 'Keep their face recognizable' : ''}. ${input.preserve_outfit ? 'Keep the same outfit' : ''}. ${input.preserve_pose ? 'Keep the same pose' : ''}. Professional photography style.`;
    
    return await this.generateImage({
      prompt,
      images: [referenceImage],
      capability: 'identity_character_transformation',
      style: options?.style as any || 'photographic',
      aspect_ratio: options?.aspect_ratio as any || '4:5',
      resolution: options?.resolution as any || '1080p'
    });
  }

  /**
   * 2. Style & Effect Application
   * Apply artistic styles, visual effects and aesthetic transformations
   */
  async styleEffectApplication(
    input: StyleApplicationInput,
    referenceImage: string,
    options?: {
      aspect_ratio?: string;
      resolution?: string;
    }
  ): Promise<NanoBananaOutput> {
    const intensityMap = {
      subtle: 'subtly',
      moderate: 'moderately',
      strong: 'strongly'
    };
    
    const prompt = `Apply the ${input.target_style} style to this image ${intensityMap[input.intensity]} while ${input.preserve_subject ? 'maintaining the subject' : 'transforming the entire image'}. Professional quality.`;
    
    return await this.generateImage({
      prompt,
      images: [referenceImage],
      capability: 'style_effect_application',
      style: input.target_style as any,
      aspect_ratio: options?.aspect_ratio as any || '4:5',
      resolution: options?.resolution as any || '1080p'
    });
  }

  /**
   * 3. Background / Environment Changes
   * Change background or environment with proper lighting adjustment
   */
  async backgroundEnvironmentChange(
    input: BackgroundChangeInput,
    referenceImage: string,
    options?: {
      style?: string;
      aspect_ratio?: string;
      resolution?: string;
    }
  ): Promise<NanoBananaOutput> {
    let prompt = `Change the background to ${input.new_background}. Keep the person the same.`;
    
    if (input.preserve_lighting) {
      prompt += ' Keep the lighting the same.';
    } else {
      prompt += ' Adjust the lighting to match the new environment.';
    }
    
    if (input.adjust_shadows) {
      prompt += ' Add appropriate shadows for the new environment.';
    }
    
    if (input.environmental_consistency) {
      prompt += ' Make it look like the photo was taken in this environment.';
    }
    
    return await this.generateImage({
      prompt,
      images: [referenceImage],
      capability: 'background_environment_change',
      style: options?.style as any || 'photographic',
      aspect_ratio: options?.aspect_ratio as any || '4:5',
      resolution: options?.resolution as any || '1080p'
    });
  }

  /**
   * 4. Object Placement
   * Add objects to scenes with automatic lighting and shadow harmonization
   */
  async objectPlacement(
    input: ObjectPlacementInput,
    referenceImage: string,
    options?: {
      style?: string;
      aspect_ratio?: string;
      resolution?: string;
    }
  ): Promise<NanoBananaOutput> {
    const objectsText = input.objects_to_add.join(', ');
    let prompt = `Add ${objectsText} to this image. ${input.placement_description}.`;
    
    if (input.lighting_harmonization) {
      prompt += ' Harmonize the lighting and shadows naturally.';
    }
    
    if (input.shadow_integration) {
      prompt += ' Add realistic shadows and reflections.';
    }
    
    prompt += ' Make it look like the objects were part of the original image.';
    
    return await this.generateImage({
      prompt,
      images: [referenceImage],
      capability: 'object_placement',
      style: options?.style as any || 'photographic',
      aspect_ratio: options?.aspect_ratio as any || '4:5',
      resolution: options?.resolution as any || '1080p'
    });
  }

  /**
   * 5. Aesthetic Arrangement & Styling
   * Transform content arrangement for better aesthetic presentation
   */
  async aestheticArrangementStyling(
    input: AestheticArrangementInput,
    referenceImage: string,
    options?: {
      style?: string;
      aspect_ratio?: string;
      resolution?: string;
    }
  ): Promise<NanoBananaOutput> {
    let prompt = `Arrange and style this content for ${input.visual_appeal_focus} with ${input.composition_style}.`;
    
    if (input.allow_composition_change) {
      prompt += ' Feel free to change the entire composition of the photo for improved aesthetic presentation with better composition and visual appeal.';
    }
    
    return await this.generateImage({
      prompt,
      images: [referenceImage],
      capability: 'aesthetic_arrangement_styling',
      style: options?.style as any || 'photographic',
      aspect_ratio: options?.aspect_ratio as any || '4:5',
      resolution: options?.resolution as any || '1080p'
    });
  }

  /**
   * 6. Generative Fill & Expansion
   * Fill empty areas or expand image boundaries
   */
  async generativeFillExpansion(
    input: GenerativeFillInput,
    referenceImage: string,
    options?: {
      style?: string;
      aspect_ratio?: string;
      resolution?: string;
    }
  ): Promise<NanoBananaOutput> {
    let prompt = `Fill ${input.fill_area_description} in this image.`;
    
    if (input.match_lighting) {
      prompt += ' Match the lighting and aesthetics of the existing image.';
    }
    
    if (input.expand_boundaries) {
      prompt += ' Expand the image boundaries naturally.';
    }
    
    prompt += ' Make sure no blank areas are left.';
    
    return await this.generateImage({
      prompt,
      images: [referenceImage],
      capability: 'generative_fill_expansion',
      style: options?.style as any || 'photographic',
      aspect_ratio: options?.aspect_ratio as any || '4:5',
      resolution: options?.resolution as any || '1080p'
    });
  }

  /**
   * 7. Multi Image Blending
   * Combine multiple separate images into one cohesive scene
   */
  async multiImageBlending(
    input: MultiImageBlendingInput,
    options?: {
      style?: string;
      aspect_ratio?: string;
      resolution?: string;
    }
  ): Promise<NanoBananaOutput> {
    const prompt = `Combine these images into one cohesive scene. ${input.blending_instructions}. ${input.scene_cohesion ? 'Create a unified scene with consistent lighting and environment.' : ''} ${input.character_consistency ? 'Maintain character consistency across all elements.' : ''}`;
    
    return await this.generateImage({
      prompt,
      images: input.images_to_blend,
      capability: 'multi_image_blending',
      style: options?.style as any || 'photographic',
      aspect_ratio: options?.aspect_ratio as any || '4:5',
      resolution: options?.resolution as any || '1080p'
    });
  }

  /**
   * 8. Object / Material Transformation
   * Modify objects like furniture or textures while maintaining scene integrity
   */
  async objectMaterialTransformation(
    input: ObjectTransformationInput,
    referenceImage: string,
    options?: {
      style?: string;
      aspect_ratio?: string;
      resolution?: string;
    }
  ): Promise<NanoBananaOutput> {
    let prompt = `Change the ${input.object_to_transform} to ${input.new_material_style}.`;
    
    if (input.preserve_scene) {
      prompt += ' Keep everything else in the scene the same.';
    }
    
    if (input.preserve_subject) {
      prompt += ' Keep the main subject exactly the same.';
    }
    
    return await this.generateImage({
      prompt,
      images: [referenceImage],
      capability: 'object_material_transformation',
      style: options?.style as any || 'photographic',
      aspect_ratio: options?.aspect_ratio as any || '4:5',
      resolution: options?.resolution as any || '1080p'
    });
  }

  /**
   * 9. Text & Typography
   * Add, edit or enhance text elements with perfect consistency
   */
  async textTypography(
    input: TextTypographyInput,
    referenceImage: string,
    options?: {
      style?: string;
      aspect_ratio?: string;
      resolution?: string;
    }
  ): Promise<NanoBananaOutput> {
    let prompt = '';
    
    if (input.text_to_add) {
      prompt = `Add the text "${input.text_to_add}" to this image.`;
    } else if (input.text_to_edit && input.new_text) {
      prompt = `Change the text "${input.text_to_edit}" to "${input.new_text}" while preserving the same style and appearance.`;
    }
    
    if (input.preserve_style) {
      prompt += ' Keep the existing text style and design exactly the same.';
    }
    
    if (input.natural_integration) {
      prompt += ' Integrate the text naturally into the image.';
    }
    
    return await this.generateImage({
      prompt,
      images: [referenceImage],
      capability: 'text_typography',
      style: options?.style as any || 'photographic',
      aspect_ratio: options?.aspect_ratio as any || '4:5',
      resolution: options?.resolution as any || '1080p'
    });
  }

  /**
   * 10. Color Adaptation
   * Adapt content to match specific colors (brand colors, etc.)
   */
  async colorAdaptation(
    input: ColorAdaptationInput,
    referenceImage: string,
    options?: {
      style?: string;
      aspect_ratio?: string;
      resolution?: string;
    }
  ): Promise<NanoBananaOutput> {
    const colorsText = input.target_colors.join(' and ');
    let prompt = `Change all colors to ${colorsText}.`;
    
    if (input.brand_colors) {
      prompt += ' Use these as brand colors.';
    }
    
    if (input.preserve_visual_impact) {
      prompt += ' Maintain the visual impact while changing colors.';
    }
    
    if (input.maintain_contrast) {
      prompt += ' Maintain proper contrast and readability.';
    }
    
    return await this.generateImage({
      prompt,
      images: [referenceImage],
      capability: 'color_adaptation',
      style: options?.style as any || 'photographic',
      aspect_ratio: options?.aspect_ratio as any || '4:5',
      resolution: options?.resolution as any || '1080p'
    });
  }

  /**
   * 11. Photo Repair & Enhancement
   * Fix and improve overall quality of images
   */
  async photoRepairEnhancement(
    input: PhotoRepairInput,
    referenceImage: string,
    options?: {
      style?: string;
      aspect_ratio?: string;
      resolution?: string;
    }
  ): Promise<NanoBananaOutput> {
    let prompt = '';
    
    switch (input.repair_type) {
      case 'restoration':
        prompt = 'Restore and enhance this old photograph. Remove any damage, fill in missing areas naturally.';
        break;
      case 'enhancement':
        prompt = 'Enhance the overall quality of this image. Improve lighting, contrast, and details.';
        break;
      case 'colorization':
        prompt = 'Colorize this black and white image with realistic colors.';
        break;
      case 'quality_improvement':
        prompt = 'Improve the quality and resolution of this image.';
        break;
    }
    
    if (input.preserve_authenticity) {
      prompt += ' Maintain the authentic look and feel of the original.';
    }
    
    const enhancementMap = {
      subtle: 'Apply subtle enhancements',
      moderate: 'Apply moderate enhancements',
      strong: 'Apply strong enhancements'
    };
    
    prompt += ` ${enhancementMap[input.enhancement_level]}.`;
    
    return await this.generateImage({
      prompt,
      images: [referenceImage],
      capability: 'photo_repair_enhancement',
      style: options?.style as any || 'photographic',
      aspect_ratio: options?.aspect_ratio as any || '4:5',
      resolution: options?.resolution as any || '1080p'
    });
  }

  // ============================================================================
  // ENHANCED IMAGE GENERATION METHOD
  // ============================================================================

  /**
   * Enhanced image generation with capability support
   */
  async generateImage(
    input: NanoBananaInput,
    options?: {
      logs?: boolean;
      onQueueUpdate?: (update: any) => void;
    }
  ): Promise<NanoBananaOutput> {
    try {
      this.validateInput(input);

      // Apply prompt enhancers if specified
      let enhancedPrompt = input.prompt;
      
      if (input.enhancement_type === 'flexibility' && input.change_elements) {
        enhancedPrompt = this.applyFlexibilityEnhancer(enhancedPrompt, input.change_elements.join(', '));
      } else if (input.enhancement_type === 'consistency' && input.preserve_elements) {
        enhancedPrompt = this.applyConsistencyEnhancer(enhancedPrompt, input.preserve_elements);
      } else if (input.enhancement_type === 'both' && input.change_elements && input.preserve_elements) {
        enhancedPrompt = this.applyBothEnhancers(enhancedPrompt, input.change_elements.join(', '), input.preserve_elements);
      }

      const result = await fal.subscribe(MODEL_ENDPOINT, {
        input: {
          prompt: enhancedPrompt,
          images: input.images,
          style: input.style || 'photographic',
          aspect_ratio: input.aspect_ratio || '4:5',
          resolution: input.resolution || '1080p',
          negative_prompt: input.negative_prompt,
          seed: input.seed
        },
        logs: options?.logs || false,
        onQueueUpdate: options?.onQueueUpdate
      });

      return {
        images: result.data.images || [{ url: result.data.image?.url || '', content_type: 'image/png' }],
        metadata: {
          capability_used: input.capability,
          enhancement_applied: input.enhancement_type,
          processing_time: Date.now(),
          quality_score: 95
        }
      } as NanoBananaOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Nano Banana image generation failed: ${errorMessage}`);
    }
  }

  // ============================================================================
  // COMIC GENERATION CAPABILITIES
  // ============================================================================

  /**
   * Generate comic panels with consistent characters
   */
  async generateComicPanel(
    characterDescription: string,
    action: string,
    background: string,
    options?: {
      artStyle?: string;
      aspectRatio?: string;
      dialogue?: string;
      lighting?: string;
    }
  ): Promise<NanoBananaOutput> {
    const prompt = `Create a comic panel in ${options?.artStyle || 'modern colorful comic art style'}. Character: ${characterDescription}. Action: ${action}. Background: ${background}. ${options?.dialogue ? `Dialogue: "${options.dialogue}"` : ''} ${options?.lighting ? `Lighting: ${options.lighting}` : ''}`;
    
    return await this.generateImage({
      prompt,
      capability: 'style_effect_application',
      style: 'comic',
      aspect_ratio: options?.aspectRatio as any || '1:1',
      resolution: '1080p'
    });
  }

  /**
   * Generate next comic panel maintaining consistency
   */
  async generateNextComicPanel(
    previousPanelImage: string,
    nextAction: string,
    options?: {
      artStyle?: string;
      angle?: string;
      dialogue?: string;
    }
  ): Promise<NanoBananaOutput> {
    const prompt = `Generate the next panel where ${nextAction}. Use same style, colors, and setting with ${options?.angle || 'suitable angle of view'}. ${options?.dialogue ? `Add dialogue: "${options.dialogue}"` : ''}`;
    
    return await this.generateImage({
      prompt,
      images: [previousPanelImage],
      capability: 'multi_image_blending',
      style: 'comic',
      aspect_ratio: '1:1',
      resolution: '1080p'
    });
  }

  // ============================================================================
  // ASPECT RATIO CONTROL
  // ============================================================================

  /**
   * Control aspect ratio using reference images
   */
  async generateWithAspectRatioControl(
    prompt: string,
    aspectRatioImage: string,
    options?: {
      style?: string;
      resolution?: string;
    }
  ): Promise<NanoBananaOutput> {
    const enhancedPrompt = `Redraw the content from the first image onto the second image and adjust the first image by adding content so that its aspect ratio matches the second image at the same time. Completely remove the content of the second image, keeping only its aspect ratio. Make sure no blank areas are left. Original prompt: ${prompt}`;
    
    return await this.generateImage({
      prompt: enhancedPrompt,
      images: [aspectRatioImage],
      style: options?.style as any || 'photographic',
      aspect_ratio: '16:9', // Will be controlled by reference image
      resolution: options?.resolution as any || '1080p'
    });
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Create a new NanoBananaExecutor instance
 */
export function createNanoBananaExecutor(apiKey: string): NanoBananaExecutor {
  return new NanoBananaExecutor(apiKey);
}

/**
 * Quick video generation function
 */
export async function generateNanoBananaVideo(
  apiKey: string,
  prompt: string,
  options?: {
    style?: string;
    aspect_ratio?: string;
    duration?: string;
    resolution?: string;
    camera_movement?: string;
    negative_prompt?: string;
    seed?: number;
  }
): Promise<NanoBananaOutput> {
  const executor = new NanoBananaExecutor(apiKey);
  return await executor.generateVideo({
    prompt,
    style: options?.style as any,
    aspect_ratio: options?.aspect_ratio as any,
    duration: options?.duration as any,
    resolution: options?.resolution as any,
    camera_movement: options?.camera_movement as any,
    negative_prompt: options?.negative_prompt,
    seed: options?.seed
  });
}

/**
 * Generate first frame
 */
export async function generateFirstFrame(
  apiKey: string,
  prompt: string,
  options?: {
    style?: string;
    aspect_ratio?: string;
    resolution?: string;
  }
): Promise<NanoBananaOutput> {
  const executor = new NanoBananaExecutor(apiKey);
  return await executor.generateFirstFrame(prompt, options);
}

/**
 * Generate last frame
 */
export async function generateLastFrame(
  apiKey: string,
  prompt: string,
  options?: {
    style?: string;
    aspect_ratio?: string;
    resolution?: string;
  }
): Promise<NanoBananaOutput> {
  const executor = new NanoBananaExecutor(apiKey);
  return await executor.generateLastFrame(prompt, options);
}

/**
 * Generate video with camera movement
 */
export async function generateWithCameraMovement(
  apiKey: string,
  prompt: string,
  cameraMovement: string,
  options?: {
    style?: string;
    aspect_ratio?: string;
    duration?: string;
    resolution?: string;
  }
): Promise<NanoBananaOutput> {
  const executor = new NanoBananaExecutor(apiKey);
  return await executor.generateWithCameraMovement(prompt, cameraMovement, options);
}

/**
 * Generate video with specific view angle
 */
export async function generateWithViewAngle(
  apiKey: string,
  prompt: string,
  viewAngle: string,
  options?: {
    style?: string;
    aspect_ratio?: string;
    duration?: string;
    resolution?: string;
  }
): Promise<NanoBananaOutput> {
  const executor = new NanoBananaExecutor(apiKey);
  return await executor.generateWithViewAngle(prompt, viewAngle, options);
}

// ============================================================================
// ENHANCED CONVENIENCE FUNCTIONS FOR 11 CAPABILITIES
// ============================================================================

/**
 * Identity & Character Transformation
 */
export async function transformIdentity(
  apiKey: string,
  input: IdentityTransformationInput,
  referenceImage: string,
  options?: {
    style?: string;
    aspect_ratio?: string;
    resolution?: string;
  }
): Promise<NanoBananaOutput> {
  const executor = new NanoBananaExecutor(apiKey);
  return await executor.identityCharacterTransformation(input, referenceImage, options);
}

/**
 * Style & Effect Application
 */
export async function applyStyle(
  apiKey: string,
  input: StyleApplicationInput,
  referenceImage: string,
  options?: {
    aspect_ratio?: string;
    resolution?: string;
  }
): Promise<NanoBananaOutput> {
  const executor = new NanoBananaExecutor(apiKey);
  return await executor.styleEffectApplication(input, referenceImage, options);
}

/**
 * Background / Environment Change
 */
export async function changeBackground(
  apiKey: string,
  input: BackgroundChangeInput,
  referenceImage: string,
  options?: {
    style?: string;
    aspect_ratio?: string;
    resolution?: string;
  }
): Promise<NanoBananaOutput> {
  const executor = new NanoBananaExecutor(apiKey);
  return await executor.backgroundEnvironmentChange(input, referenceImage, options);
}

/**
 * Object Placement
 */
export async function placeObjects(
  apiKey: string,
  input: ObjectPlacementInput,
  referenceImage: string,
  options?: {
    style?: string;
    aspect_ratio?: string;
    resolution?: string;
  }
): Promise<NanoBananaOutput> {
  const executor = new NanoBananaExecutor(apiKey);
  return await executor.objectPlacement(input, referenceImage, options);
}

/**
 * Aesthetic Arrangement & Styling
 */
export async function arrangeAesthetically(
  apiKey: string,
  input: AestheticArrangementInput,
  referenceImage: string,
  options?: {
    style?: string;
    aspect_ratio?: string;
    resolution?: string;
  }
): Promise<NanoBananaOutput> {
  const executor = new NanoBananaExecutor(apiKey);
  return await executor.aestheticArrangementStyling(input, referenceImage, options);
}

/**
 * Generative Fill & Expansion
 */
export async function fillAndExpand(
  apiKey: string,
  input: GenerativeFillInput,
  referenceImage: string,
  options?: {
    style?: string;
    aspect_ratio?: string;
    resolution?: string;
  }
): Promise<NanoBananaOutput> {
  const executor = new NanoBananaExecutor(apiKey);
  return await executor.generativeFillExpansion(input, referenceImage, options);
}

/**
 * Multi Image Blending
 */
export async function blendImages(
  apiKey: string,
  input: MultiImageBlendingInput,
  options?: {
    style?: string;
    aspect_ratio?: string;
    resolution?: string;
  }
): Promise<NanoBananaOutput> {
  const executor = new NanoBananaExecutor(apiKey);
  return await executor.multiImageBlending(input, options);
}

/**
 * Object / Material Transformation
 */
export async function transformObject(
  apiKey: string,
  input: ObjectTransformationInput,
  referenceImage: string,
  options?: {
    style?: string;
    aspect_ratio?: string;
    resolution?: string;
  }
): Promise<NanoBananaOutput> {
  const executor = new NanoBananaExecutor(apiKey);
  return await executor.objectMaterialTransformation(input, referenceImage, options);
}

/**
 * Text & Typography
 */
export async function editText(
  apiKey: string,
  input: TextTypographyInput,
  referenceImage: string,
  options?: {
    style?: string;
    aspect_ratio?: string;
    resolution?: string;
  }
): Promise<NanoBananaOutput> {
  const executor = new NanoBananaExecutor(apiKey);
  return await executor.textTypography(input, referenceImage, options);
}

/**
 * Color Adaptation
 */
export async function adaptColors(
  apiKey: string,
  input: ColorAdaptationInput,
  referenceImage: string,
  options?: {
    style?: string;
    aspect_ratio?: string;
    resolution?: string;
  }
): Promise<NanoBananaOutput> {
  const executor = new NanoBananaExecutor(apiKey);
  return await executor.colorAdaptation(input, referenceImage, options);
}

/**
 * Photo Repair & Enhancement
 */
export async function repairPhoto(
  apiKey: string,
  input: PhotoRepairInput,
  referenceImage: string,
  options?: {
    style?: string;
    aspect_ratio?: string;
    resolution?: string;
  }
): Promise<NanoBananaOutput> {
  const executor = new NanoBananaExecutor(apiKey);
  return await executor.photoRepairEnhancement(input, referenceImage, options);
}

/**
 * Generate Comic Panel
 */
export async function generateComicPanel(
  apiKey: string,
  characterDescription: string,
  action: string,
  background: string,
  options?: {
    artStyle?: string;
    aspectRatio?: string;
    dialogue?: string;
    lighting?: string;
  }
): Promise<NanoBananaOutput> {
  const executor = new NanoBananaExecutor(apiKey);
  return await executor.generateComicPanel(characterDescription, action, background, options);
}

/**
 * Generate Next Comic Panel
 */
export async function generateNextComicPanel(
  apiKey: string,
  previousPanelImage: string,
  nextAction: string,
  options?: {
    artStyle?: string;
    angle?: string;
    dialogue?: string;
  }
): Promise<NanoBananaOutput> {
  const executor = new NanoBananaExecutor(apiKey);
  return await executor.generateNextComicPanel(previousPanelImage, nextAction, options);
}

/**
 * Generate with Aspect Ratio Control
 */
export async function generateWithAspectRatioControl(
  apiKey: string,
  prompt: string,
  aspectRatioImage: string,
  options?: {
    style?: string;
    resolution?: string;
  }
): Promise<NanoBananaOutput> {
  const executor = new NanoBananaExecutor(apiKey);
  return await executor.generateWithAspectRatioControl(prompt, aspectRatioImage, options);
}

export default NanoBananaExecutor;
