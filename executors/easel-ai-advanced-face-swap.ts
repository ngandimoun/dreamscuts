import { fal } from "@fal-ai/client";

export interface FaceSwapInput {
  face_image_0: string;
  gender_0?: "male" | "female" | "non-binary";
  face_image_1?: string;
  gender_1?: "male" | "female" | "non-binary";
  target_image: string;
  workflow_type?: "user_hair" | "target_hair";
  upscale?: boolean;
  detailer?: boolean;
}

export interface FaceSwapOutput {
  image: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
    width?: number;
    height?: number;
  };
}

export class EaselAiAdvancedFaceSwapExecutor {
  private modelId = "easel-ai/advanced-face-swap";

  /**
   * Swap face in target image
   */
  async swapFace(input: FaceSwapInput): Promise<FaceSwapOutput> {
    const params = {
      face_image_0: input.face_image_0,
      gender_0: input.gender_0,
      face_image_1: input.face_image_1,
      gender_1: input.gender_1,
      target_image: input.target_image,
      workflow_type: input.workflow_type ?? "user_hair",
      upscale: input.upscale ?? true,
      detailer: input.detailer ?? false
    };

    const result = await fal.subscribe(this.modelId, {
      input: params
    });

    return result.data as FaceSwapOutput;
  }

  /**
   * Swap two faces in target image
   */
  async swapTwoFaces(input: FaceSwapInput & { 
    face_image_1: string; 
    gender_1: "male" | "female" | "non-binary" 
  }): Promise<FaceSwapOutput> {
    return this.swapFace(input);
  }

  /**
   * High-quality face swap with upscale and detailer
   */
  async swapFaceHighQuality(input: FaceSwapInput & { 
    upscale: boolean; 
    detailer: boolean 
  }): Promise<FaceSwapOutput> {
    return this.swapFace(input);
  }

  /**
   * Face swap while preserving user hair
   */
  async swapFacePreserveUserHair(input: FaceSwapInput): Promise<FaceSwapOutput> {
    return this.swapFace({
      ...input,
      workflow_type: "user_hair"
    });
  }

  /**
   * Face swap while preserving target hair
   */
  async swapFacePreserveTargetHair(input: FaceSwapInput): Promise<FaceSwapOutput> {
    return this.swapFace({
      ...input,
      workflow_type: "target_hair"
    });
  }

  /**
   * Face swap with upscale enabled
   */
  async swapFaceWithUpscale(input: FaceSwapInput): Promise<FaceSwapOutput> {
    return this.swapFace({
      ...input,
      upscale: true
    });
  }

  /**
   * Face swap with detailer enabled
   */
  async swapFaceWithDetailer(input: FaceSwapInput): Promise<FaceSwapOutput> {
    return this.swapFace({
      ...input,
      detailer: true
    });
  }

  /**
   * Face swap for male subject
   */
  async swapFaceMale(input: FaceSwapInput): Promise<FaceSwapOutput> {
    return this.swapFace({
      ...input,
      gender_0: "male"
    });
  }

  /**
   * Face swap for female subject
   */
  async swapFaceFemale(input: FaceSwapInput): Promise<FaceSwapOutput> {
    return this.swapFace({
      ...input,
      gender_0: "female"
    });
  }

  /**
   * Face swap for non-binary subject
   */
  async swapFaceNonBinary(input: FaceSwapInput): Promise<FaceSwapOutput> {
    return this.swapFace({
      ...input,
      gender_0: "non-binary"
    });
  }

  /**
   * Advanced face swap with all custom parameters
   */
  async swapFaceAdvanced(input: FaceSwapInput & {
    gender_0: "male" | "female" | "non-binary";
    workflow_type: "user_hair" | "target_hair";
    upscale: boolean;
    detailer: boolean;
  }): Promise<FaceSwapOutput> {
    return this.swapFace(input);
  }

  /**
   * Swap male and female faces in target image
   */
  async swapMaleFemaleFaces(input: FaceSwapInput & { 
    face_image_1: string; 
    gender_0: "male" | "female";
    gender_1: "male" | "female";
  }): Promise<FaceSwapOutput> {
    return this.swapFace(input);
  }

  /**
   * Swap faces for entertainment purposes
   */
  async swapFaceEntertainment(input: FaceSwapInput): Promise<FaceSwapOutput> {
    return this.swapFace(input);
  }

  /**
   * Swap faces for content creation
   */
  async swapFaceContentCreation(input: FaceSwapInput): Promise<FaceSwapOutput> {
    return this.swapFace(input);
  }

  /**
   * Swap faces for social media
   */
  async swapFaceSocialMedia(input: FaceSwapInput): Promise<FaceSwapOutput> {
    return this.swapFace(input);
  }

  /**
   * Swap faces for digital art
   */
  async swapFaceDigitalArt(input: FaceSwapInput): Promise<FaceSwapOutput> {
    return this.swapFace(input);
  }

  /**
   * Swap faces for character creation
   */
  async swapFaceCharacterCreation(input: FaceSwapInput): Promise<FaceSwapOutput> {
    return this.swapFace(input);
  }

  /**
   * Get cost estimate for face swap
   */
  getCostEstimate(): { price: number; unit: string } {
    return {
      price: 0.05,
      unit: "per generation"
    };
  }

  /**
   * Get recommended parameters for different use cases
   */
  getRecommendedParameters(useCase: "entertainment" | "content_creation" | "social_media" | "digital_art" | "character_creation" | "high_quality" | "fast" | "balanced" | "conservative") {
    const recommendations = {
      entertainment: { workflow_type: "user_hair" as const, upscale: true, detailer: false },
      content_creation: { workflow_type: "user_hair" as const, upscale: true, detailer: true },
      social_media: { workflow_type: "user_hair" as const, upscale: true, detailer: false },
      digital_art: { workflow_type: "target_hair" as const, upscale: true, detailer: true },
      character_creation: { workflow_type: "target_hair" as const, upscale: true, detailer: true },
      high_quality: { workflow_type: "user_hair" as const, upscale: true, detailer: true },
      fast: { workflow_type: "user_hair" as const, upscale: false, detailer: false },
      balanced: { workflow_type: "user_hair" as const, upscale: true, detailer: false },
      conservative: { workflow_type: "target_hair" as const, upscale: true, detailer: false }
    };

    return recommendations[useCase];
  }

  /**
   * Get workflow type guide for face swap
   */
  getWorkflowTypeGuide(): Array<{ type: string; description: string; useCase: string; effect: string }> {
    return [
      { type: "user_hair", description: "Preserve user's hair", useCase: "Standard face swap", effect: "Keeps original hair style from face image" },
      { type: "target_hair", description: "Preserve target's hair", useCase: "Scene preservation", effect: "Keeps hair style from target image" }
    ];
  }

  /**
   * Get gender guide for face swap
   */
  getGenderGuide(): Array<{ gender: string; description: string; useCase: string; considerations: string }> {
    return [
      { gender: "male", description: "Male subject", useCase: "Male face swap", considerations: "Optimized for male facial features" },
      { gender: "female", description: "Female subject", useCase: "Female face swap", considerations: "Optimized for female facial features" },
      { gender: "non-binary", description: "Non-binary subject", useCase: "Non-binary face swap", considerations: "Neutral facial feature processing" }
    ];
  }

  /**
   * Get face swap recommendations
   */
  getFaceSwapRecommendations(): Array<{ swap_type: string; workflow_type: "user_hair" | "target_hair"; upscale: boolean; detailer: boolean; description: string }> {
    return [
      { swap_type: "Standard Face Swap", workflow_type: "user_hair", upscale: true, detailer: false, description: "Basic face swap with user hair preservation" },
      { swap_type: "High Quality Face Swap", workflow_type: "user_hair", upscale: true, detailer: true, description: "Premium face swap with enhanced details" },
      { swap_type: "Scene Preservation", workflow_type: "target_hair", upscale: true, detailer: false, description: "Face swap while preserving target scene details" },
      { swap_type: "Fast Face Swap", workflow_type: "user_hair", upscale: false, detailer: false, description: "Quick face swap for rapid results" },
      { swap_type: "Multi-Person Swap", workflow_type: "user_hair", upscale: true, detailer: true, description: "Swap multiple faces in target image" },
      { swap_type: "Character Creation", workflow_type: "target_hair", upscale: true, detailer: true, description: "Face swap for character design and creation" }
    ];
  }

  /**
   * Validate input parameters
   */
  validateInput(input: FaceSwapInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.face_image_0) {
      errors.push("face_image_0 is required");
    }

    if (!input.target_image) {
      errors.push("target_image is required");
    }

    const validGenders = ["male", "female", "non-binary"];
    if (input.gender_0 && !validGenders.includes(input.gender_0)) {
      errors.push(`gender_0 must be one of: ${validGenders.join(", ")}`);
    }

    if (input.gender_1 && !validGenders.includes(input.gender_1)) {
      errors.push(`gender_1 must be one of: ${validGenders.join(", ")}`);
    }

    const validWorkflowTypes = ["user_hair", "target_hair"];
    if (input.workflow_type && !validWorkflowTypes.includes(input.workflow_type)) {
      errors.push(`workflow_type must be one of: ${validWorkflowTypes.join(", ")}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get effect description based on parameters
   */
  getEffectDescription(workflowType: string, upscale: boolean, detailer: boolean, gender0?: string, gender1?: string): string {
    const getWorkflowDescription = (type: string): string => {
      return type === "user_hair" ? "preserving user hair" : "preserving target hair";
    };

    const getQualityDescription = (upscale: boolean, detailer: boolean): string => {
      if (upscale && detailer) return "high quality with upscale and detailer";
      if (upscale) return "upscaled quality";
      if (detailer) return "detailed quality";
      return "standard quality";
    };

    const getGenderDescription = (gender0?: string, gender1?: string): string => {
      if (gender0 && gender1) {
        return `${gender0} and ${gender1} faces`;
      } else if (gender0) {
        return `${gender0} face`;
      }
      return "face";
    };

    const workflowDesc = getWorkflowDescription(workflowType);
    const qualityDesc = getQualityDescription(upscale, detailer);
    const genderDesc = getGenderDescription(gender0, gender1);

    return `Face swap of ${genderDesc} with ${workflowDesc} in ${qualityDesc} mode`;
  }

  /**
   * Calculate processing time estimate
   */
  getProcessingTimeEstimate(upscale: boolean, detailer: boolean): { time: string; category: string } {
    if (!upscale && !detailer) {
      return { time: "15-30 seconds", category: "fast" };
    } else if (upscale && !detailer) {
      return { time: "30-45 seconds", category: "moderate" };
    } else if (upscale && detailer) {
      return { time: "45-60 seconds", category: "slow" };
    } else {
      return { time: "25-40 seconds", category: "moderate" };
    }
  }

  /**
   * Get optimal settings for different content types
   */
  getOptimalSettings(contentType: "entertainment" | "content_creation" | "social_media" | "digital_art" | "character_creation" | "mixed") {
    const settings = {
      entertainment: { workflow_type: "user_hair" as const, upscale: true, detailer: false },
      content_creation: { workflow_type: "user_hair" as const, upscale: true, detailer: true },
      social_media: { workflow_type: "user_hair" as const, upscale: true, detailer: false },
      digital_art: { workflow_type: "target_hair" as const, upscale: true, detailer: true },
      character_creation: { workflow_type: "target_hair" as const, upscale: true, detailer: true },
      mixed: { workflow_type: "user_hair" as const, upscale: true, detailer: false }
    };

    return settings[contentType];
  }

  /**
   * Get supported resolutions for different aspect ratios
   */
  getSupportedResolutions(): Array<{ aspect_ratio: string; width: number; height: number; name: string; useCase: string }> {
    return [
      { aspect_ratio: "1:1", width: 1024, height: 1024, name: "square_1_1", useCase: "Social media" },
      { aspect_ratio: "4:3", width: 1024, height: 768, name: "standard_4_3", useCase: "Traditional displays" },
      { aspect_ratio: "3:2", width: 1024, height: 683, name: "photography_3_2", useCase: "Professional photography" },
      { aspect_ratio: "16:9", width: 1024, height: 576, name: "widescreen_16_9", useCase: "Video content" }
    ];
  }

  /**
   * Get face swap tips
   */
  getFaceSwapTips(): Array<{ tip: string; description: string; importance: string }> {
    return [
      { tip: "Clear face images", description: "Use clear, high-quality face images for best face swap results", importance: "High" },
      { tip: "Good lighting", description: "Ensure good lighting and contrast in face images", importance: "High" },
      { tip: "Visible faces", description: "Ensure target image has clear, visible faces", importance: "High" },
      { tip: "Appropriate workflow", description: "Use appropriate workflow type (user_hair vs target_hair)", importance: "Medium" },
      { tip: "Enable upscale", description: "Enable upscale for better quality results", importance: "Medium" },
      { tip: "Use detailer", description: "Use detailer for improved image details when needed", importance: "Medium" },
      { tip: "Gender selection", description: "Use appropriate gender selection for better results", importance: "Low" },
      { tip: "Test variations", description: "Test with different workflow types for optimal results", importance: "Low" }
    ];
  }
}

// Export a default instance
export const easelAiAdvancedFaceSwap = new EaselAiAdvancedFaceSwapExecutor();
