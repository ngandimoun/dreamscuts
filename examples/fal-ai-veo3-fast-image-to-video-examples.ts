/**
 * Fal AI Veo3 Fast Image-to-Video Examples
 * 
 * This file contains comprehensive examples and use cases for the
 * fal-ai/veo3/fast/image-to-video model, showcasing its capabilities
 * in generating high-quality videos from static images with 50% cost savings.
 * 
 * Key Features Demonstrated:
 * - Image-to-video generation with natural motion
 * - Text prompt control for precise animation
 * - Audio generation support
 * - Multiple aspect ratios and resolutions
 * - Cost-effective pricing with 50% savings
 * - Professional-grade output quality
 * - Safety filters and content moderation
 * - And much more...
 */

import { FalAiVeo3FastImageToVideoExecutor, createVeo3FastImageToVideoExecutor } from '../executors/fal-ai-veo3-fast-image-to-video';

// ============================================================================
// BASIC USAGE EXAMPLES
// ============================================================================

export const veo3FastImageToVideoExamples = {
  
  // ============================================================================
  // CHARACTER ANIMATION EXAMPLES
  // ============================================================================
  
  characterAnimation: {
    // Professional headshot animation
    professionalHeadshot: {
      description: "Animate a professional headshot with natural expressions and speech",
      prompt: "A woman looks into the camera, breathes in, then exclaims energetically, \"have you guys checked out Veo3 Image-to-Video on Fal? It's incredible!\"",
      imageUrl: "https://example.com/professional-headshot.jpg",
      aspectRatio: "auto",
      generateAudio: true,
      resolution: "1080p",
      expectedResult: "Natural facial expressions with synchronized speech and energy"
    },

    // Casual portrait animation
    casualPortrait: {
      description: "Animate a casual portrait with gentle movements",
      prompt: "A person smiles warmly, then looks away thoughtfully before returning to the camera with a nod",
      imageUrl: "https://example.com/casual-portrait.jpg",
      aspectRatio: "16:9",
      generateAudio: false,
      resolution: "720p",
      expectedResult: "Subtle, natural movements with emotional expression"
    },

    // Character introduction
    characterIntroduction: {
      description: "Create a character introduction with personality",
      prompt: "A confident person steps forward, gestures with their hands while speaking, then leans back with a satisfied smile",
      imageUrl: "https://example.com/character-intro.jpg",
      aspectRatio: "9:16",
      generateAudio: true,
      resolution: "720p",
      expectedResult: "Dynamic character introduction with engaging movements"
    }
  },

  // ============================================================================
  // LIFESTYLE AND ENVIRONMENTAL EXAMPLES
  // ============================================================================
  
  lifestyleAnimation: {
    // Forest walk animation
    forestWalk: {
      description: "Animate a person walking through a forest with environmental effects",
      prompt: "A person walking through a forest with leaves falling around them, gentle wind movement, and natural lighting changes",
      imageUrl: "https://example.com/forest-walk.jpg",
      aspectRatio: "16:9",
      generateAudio: false,
      resolution: "1080p",
      expectedResult: "Natural walking motion with environmental particle effects"
    },

    // Kitchen cooking scene
    kitchenCooking: {
      description: "Animate a cooking scene with realistic kitchen activities",
      prompt: "A chef cooking in a modern kitchen, stirring a pot with steam rising, checking ingredients, and tasting the food",
      imageUrl: "https://example.com/kitchen-cooking.jpg",
      aspectRatio: "16:9",
      generateAudio: true,
      resolution: "720p",
      expectedResult: "Realistic cooking actions with steam and kitchen atmosphere"
    },

    // Beach relaxation
    beachRelaxation: {
      description: "Animate a beach relaxation scene with natural elements",
      prompt: "A person relaxing on a beach chair, waves gently lapping the shore, palm leaves swaying in the breeze",
      imageUrl: "https://example.com/beach-relaxation.jpg",
      aspectRatio: "9:16",
      generateAudio: false,
      resolution: "720p",
      expectedResult: "Peaceful beach atmosphere with natural wave and wind effects"
    }
  },

  // ============================================================================
  // PRODUCT AND COMMERCIAL EXAMPLES
  // ============================================================================
  
  productAnimation: {
    // Product demonstration
    productDemo: {
      description: "Animate a product demonstration with professional presentation",
      prompt: "A person holding a smartphone, demonstrating its features with smooth hand movements, rotating the device to show different angles",
      imageUrl: "https://example.com/product-demo.jpg",
      aspectRatio: "16:9",
      generateAudio: true,
      resolution: "1080p",
      expectedResult: "Professional product showcase with smooth device handling"
    },

    // Fashion showcase
    fashionShowcase: {
      description: "Animate a fashion model showcasing clothing",
      prompt: "A model walking confidently, turning to show the outfit from different angles, with elegant movements and poses",
      imageUrl: "https://example.com/fashion-showcase.jpg",
      aspectRatio: "9:16",
      generateAudio: false,
      resolution: "720p",
      expectedResult: "Elegant fashion presentation with model movements"
    },

    // Food presentation
    foodPresentation: {
      description: "Animate a food presentation with appetizing effects",
      prompt: "A chef presenting a beautifully plated dish, with steam rising from the food, gentle camera movement to showcase the presentation",
      imageUrl: "https://example.com/food-presentation.jpg",
      aspectRatio: "16:9",
      generateAudio: true,
      resolution: "1080p",
      expectedResult: "Appetizing food presentation with steam and professional styling"
    }
  },

  // ============================================================================
  // CREATIVE AND ARTISTIC EXAMPLES
  // ============================================================================
  
  creativeAnimation: {
    // Artistic portrait
    artisticPortrait: {
      description: "Animate an artistic portrait with creative movements",
      prompt: "An artist's portrait with paintbrush strokes appearing around them, colors flowing and mixing in the air, creating an artistic atmosphere",
      imageUrl: "https://example.com/artistic-portrait.jpg",
      aspectRatio: "auto",
      generateAudio: false,
      resolution: "720p",
      expectedResult: "Creative artistic effects with flowing colors and brushstrokes"
    },

    // Abstract concept
    abstractConcept: {
      description: "Animate an abstract concept with surreal elements",
      prompt: "A person in a surreal environment where reality bends around them, with floating geometric shapes and impossible perspectives",
      imageUrl: "https://example.com/abstract-concept.jpg",
      aspectRatio: "16:9",
      generateAudio: true,
      resolution: "1080p",
      expectedResult: "Surreal animation with impossible physics and abstract elements"
    },

    // Nature transformation
    natureTransformation: {
      description: "Animate a nature scene with seasonal transformation",
      prompt: "A landscape transitioning from summer to autumn, with leaves changing colors and falling, gentle wind effects, and lighting changes",
      imageUrl: "https://example.com/nature-transformation.jpg",
      aspectRatio: "16:9",
      generateAudio: false,
      resolution: "720p",
      expectedResult: "Seasonal transformation with natural color and lighting changes"
    }
  },

  // ============================================================================
  // SOCIAL MEDIA AND CONTENT EXAMPLES
  // ============================================================================
  
  socialMediaContent: {
    // Instagram Reel style
    instagramReel: {
      description: "Create Instagram Reel style content with engaging movements",
      prompt: "A person doing a quick dance move, then pointing at the camera with a smile, perfect for social media engagement",
      imageUrl: "https://example.com/instagram-reel.jpg",
      aspectRatio: "9:16",
      generateAudio: true,
      resolution: "720p",
      expectedResult: "Engaging social media content with dance and interaction"
    },

    // TikTok style
    tiktokStyle: {
      description: "Create TikTok style content with trendy movements",
      prompt: "A person doing a popular TikTok dance trend, with smooth transitions and energetic movements",
      imageUrl: "https://example.com/tiktok-style.jpg",
      aspectRatio: "9:16",
      generateAudio: true,
      resolution: "720p",
      expectedResult: "Trendy TikTok content with popular dance movements"
    },

    // YouTube Shorts
    youtubeShorts: {
      description: "Create YouTube Shorts style educational content",
      prompt: "A person explaining a concept with hand gestures, pointing at elements, and using visual aids to demonstrate the topic",
      imageUrl: "https://example.com/youtube-shorts.jpg",
      aspectRatio: "9:16",
      generateAudio: true,
      resolution: "1080p",
      expectedResult: "Educational content with clear explanations and visual aids"
    }
  }
};

// ============================================================================
// USAGE EXAMPLES WITH ACTUAL IMPLEMENTATION
// ============================================================================

export const veo3FastImageToVideoUsageExamples = {
  
  // Basic video generation
  generateBasicVideo: async (apiKey: string) => {
    const executor = new FalAiVeo3FastImageToVideoExecutor(apiKey);
    
    const result = await executor.generateVideo({
      prompt: "A woman looks into the camera, breathes in, then exclaims energetically, \"have you guys checked out Veo3 Image-to-Video on Fal? It's incredible!\"",
      image_url: "https://storage.googleapis.com/falserverless/example_inputs/veo3-i2v-input.png",
      aspect_ratio: "auto",
      duration: "8s",
      generate_audio: true,
      resolution: "720p"
    });

    return result;
  },

  // Character animation with specific movements
  generateCharacterAnimation: async (apiKey: string, imageUrl: string, characterAction: string) => {
    const executor = new FalAiVeo3FastImageToVideoExecutor(apiKey);
    
    const result = await executor.generateVideo({
      prompt: characterAction,
      image_url: imageUrl,
      aspect_ratio: "16:9",
      generate_audio: true,
      resolution: "1080p"
    });

    return result;
  },

  // Product demonstration
  generateProductDemo: async (apiKey: string, productImageUrl: string, productName: string) => {
    const executor = new FalAiVeo3FastImageToVideoExecutor(apiKey);
    
    const result = await executor.generateVideo({
      prompt: `A person holding a ${productName}, demonstrating its features with smooth hand movements, rotating the device to show different angles`,
      image_url: productImageUrl,
      aspect_ratio: "16:9",
      generate_audio: true,
      resolution: "1080p"
    });

    return result;
  },

  // Social media content
  generateSocialMediaContent: async (apiKey: string, imageUrl: string, platform: 'instagram' | 'tiktok' | 'youtube') => {
    const executor = new FalAiVeo3FastImageToVideoExecutor(apiKey);
    
    const aspectRatio = platform === 'instagram' || platform === 'tiktok' ? '9:16' : '16:9';
    const resolution = platform === 'youtube' ? '1080p' : '720p';
    
    const result = await executor.generateVideo({
      prompt: "A person doing an engaging movement, then pointing at the camera with a smile, perfect for social media engagement",
      image_url: imageUrl,
      aspect_ratio: aspectRatio,
      generate_audio: true,
      resolution: resolution
    });

    return result;
  },

  // Batch video generation
  generateMultipleVideos: async (apiKey: string, videoRequests: Array<{
    prompt: string;
    imageUrl: string;
    aspectRatio?: 'auto' | '16:9' | '9:16';
    generateAudio?: boolean;
    resolution?: '720p' | '1080p';
  }>) => {
    const executor = new FalAiVeo3FastImageToVideoExecutor(apiKey);
    const results = [];

    for (const request of videoRequests) {
      try {
        const result = await executor.generateVideo({
          prompt: request.prompt,
          image_url: request.imageUrl,
          aspect_ratio: request.aspectRatio || 'auto',
          generate_audio: request.generateAudio !== false,
          resolution: request.resolution || '720p'
        });
        results.push({ success: true, result });
      } catch (error) {
        results.push({ success: false, error: error.message });
      }
    }

    return results;
  },

  // Cost calculation
  calculateVideoCost: (duration: '8s', generateAudio: boolean = true) => {
    const executor = new FalAiVeo3FastImageToVideoExecutor('dummy-key');
    return executor.calculateCost(duration, generateAudio);
  }
};

// ============================================================================
// PROMPT TEMPLATES
// ============================================================================

export const veo3FastImageToVideoPromptTemplates = {
  
  // Character animation templates
  characterAnimation: {
    introduction: `A person steps forward confidently, makes eye contact with the camera, and says: "{message}"`,
    explanation: `A person gestures with their hands while explaining, pointing at different elements, and maintaining eye contact`,
    reaction: `A person reacts with {emotion}, then {action}, showing genuine {feeling}`,
    demonstration: `A person demonstrates {action} with clear, deliberate movements, showing each step carefully`
  },

  // Product showcase templates
  productShowcase: {
    demonstration: `A person holding {product}, demonstrating its features with smooth hand movements, rotating to show different angles`,
    presentation: `A person presenting {product} professionally, highlighting key features with confident gestures`,
    comparison: `A person comparing {product} with {alternative}, showing the differences with clear movements`
  },

  // Lifestyle templates
  lifestyle: {
    activity: `A person {activity} in a {environment}, with natural movements and {atmosphere} effects`,
    relaxation: `A person relaxing in a {setting}, with gentle movements and peaceful {ambiance}`,
    exercise: `A person {exercise} with proper form, showing smooth, controlled movements`
  },

  // Social media templates
  socialMedia: {
    engagement: `A person doing an engaging {action}, then pointing at the camera with a smile, perfect for {platform}`,
    trend: `A person doing the popular {trend} with smooth transitions and energetic movements`,
    tutorial: `A person explaining {topic} with hand gestures, pointing at elements, and using visual aids`
  }
};

// ============================================================================
// BEST PRACTICES AND TIPS
// ============================================================================

export const veo3FastImageToVideoBestPractices = {
  
  // Input image preparation
  inputImageTips: [
    "Use high-quality images (720p or higher resolution)",
    "Ensure 16:9 aspect ratio for best results",
    "Keep file size under 8MB",
    "Use supported formats (JPG, PNG, WebP, GIF, AVIF)",
    "Ensure appropriate content (safety filters applied)"
  ],

  // Prompt optimization
  promptOptimization: [
    "Be specific about the animation you want",
    "Describe the movement and actions clearly",
    "Include style preferences for consistency",
    "Mention camera movements for dynamic shots",
    "Add ambiance details for mood setting",
    "Use natural, conversational language"
  ],

  // Performance optimization
  performanceTips: [
    "Use 720p for faster processing, 1080p for quality",
    "Disable audio for 33% cost savings",
    "Use 'auto' aspect ratio for automatic optimization",
    "Use queue system for multiple videos",
    "Implement proper error handling and retries"
  ],

  // Cost optimization
  costOptimization: [
    "Disable audio when not needed (saves 33%)",
    "Use 720p resolution for cost-effective results",
    "Batch process multiple videos",
    "Plan your prompts to avoid regeneration",
    "Use appropriate duration for your content"
  ]
};

// ============================================================================
// TROUBLESHOOTING EXAMPLES
// ============================================================================

export const veo3FastImageToVideoTroubleshooting = {
  
  // Common issues and solutions
  commonIssues: {
    poorAnimationQuality: {
      problem: "Animation looks unnatural or low quality",
      solutions: [
        "Use higher resolution input images",
        "Be more specific in your animation prompts",
        "Ensure input image is in 16:9 aspect ratio",
        "Try different aspect ratio settings"
      ]
    },
    
    aspectRatioMismatch: {
      problem: "Video doesn't match expected aspect ratio",
      solutions: [
        "Use 'auto' aspect ratio for automatic optimization",
        "Ensure input image is in 16:9 aspect ratio",
        "Try different aspect ratio settings",
        "Crop input image to 16:9 before processing"
      ]
    },
    
    audioNotGenerated: {
      problem: "No audio in the generated video",
      solutions: [
        "Ensure generate_audio is set to true",
        "Check that your prompt includes speech or sound cues",
        "Verify audio generation is supported for your use case"
      ]
    },
    
    fileSizeTooLarge: {
      problem: "Input image exceeds size limit",
      solutions: [
        "Compress the input image to under 8MB",
        "Resize the image to lower resolution",
        "Use a different image format (WebP is more efficient)",
        "Crop the image to reduce file size"
      ]
    }
  },

  // Error handling examples
  errorHandling: {
    urlValidation: {
      error: "Invalid image URL format",
      solution: "Ensure the image URL is properly formatted and accessible"
    },
    
    missingPrompt: {
      error: "Prompt is required and cannot be empty",
      solution: "Provide a descriptive prompt for the animation"
    },
    
    unsupportedFormat: {
      error: "Unsupported image format",
      solution: "Use supported formats: JPG, JPEG, PNG, WebP, GIF, AVIF"
    }
  }
};

export default veo3FastImageToVideoExamples;
