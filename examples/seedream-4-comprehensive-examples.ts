/**
 * Comprehensive Examples for ByteDance's Seedream 4.0
 * 
 * This file contains detailed examples, prompts, and use cases for the
 * fal-ai/bytedance/seedream/v4/text-to-image and fal-ai/bytedance/seedream/v4/edit models,
 * showcasing their advanced capabilities in image generation and editing.
 * 
 * Key Features Demonstrated:
 * - Fast 4K image generation (up to 4096x4096)
 * - Multi-image composition and editing
 * - Sketch to photography conversion
 * - Depth masks and OpenPose generation
 * - Character turnarounds
 * - Product mockups and packaging
 * - Style transfer and virtual try-ons
 * - Professional headshots and e-commerce
 * - And much more...
 * 
 * Seedream 4.0 vs Nano Banana:
 * - Seedream: Better for 4K generation, multi-image composition, mockups
 * - Nano Banana: Better for label preservation, character consistency, hand-holding
 */

export const seedream4Examples = {
  
  // ============================================================================
  // MODEL COMPARISON & STRENGTHS
  // ============================================================================
  
  modelComparison: {
    seedream4Strengths: [
      "Fast 4K generation (up to 4096x4096)",
      "Multi-image composition and editing",
      "Sketch to photography conversion",
      "Depth masks and OpenPose generation",
      "Character turnarounds and multiple views",
      "Product mockups and packaging shots",
      "Professional headshots and e-commerce",
      "Style transfer and virtual try-ons",
      "High-resolution output with good detail"
    ],
    nanoBananaStrengths: [
      "Perfect product label reproduction",
      "Character consistency across scenes",
      "Hand-holding products (AI's biggest challenge)",
      "Background replacement with proper lighting",
      "Photo restoration and enhancement",
      "Better text and logo preservation",
      "More realistic character faces",
      "Superior object manipulation"
    ],
    whenToUseSeedream: [
      "Need 4K resolution images",
      "Creating product mockups",
      "Generating multiple character views",
      "Sketch to photography conversion",
      "Multi-image composition",
      "Professional headshots",
      "Depth masks and pose generation"
    ],
    whenToUseNanoBanana: [
      "Product photography with labels",
      "Character consistency across scenes",
      "Hand-holding products",
      "Background replacement",
      "Photo restoration",
      "Text and logo preservation",
      "Realistic character faces"
    ]
  },

  // ============================================================================
  // TEXT-TO-IMAGE EXAMPLES
  // ============================================================================
  
  textToImage: {
    // High-Resolution Generation
    highResolutionGeneration: {
      description: "Generate 4K images with Seedream's superior resolution capabilities",
      prompt: "A trendy restaurant with a digital menu board displaying 'Seedream 4.0 is available on fal' in elegant script, with diners enjoying their meals. Professional photography, 4K quality, cinematic lighting.",
      imageSize: { width: 4096, height: 4096 },
      result: "High-resolution restaurant scene with perfect text rendering"
    },

    // Product Mockups
    productMockups: {
      description: "Create comprehensive product mockups from logos",
      prompt: "Expand this logo into a full spread of product mockups including t-shirt, iPhone case, tote bag, notebook, and mug. Professional product photography, white background, studio lighting.",
      result: "Complete product mockup suite with consistent branding"
    },

    // Character Generation
    characterGeneration: {
      description: "Generate realistic characters for various use cases",
      prompt: "A professional businesswoman in a modern office setting, confident pose, natural lighting, high-quality portrait photography, 4K resolution.",
      imageSize: { width: 2048, height: 2048 },
      result: "Professional character portrait with excellent detail"
    },

    // Architectural Visualization
    architecturalVisualization: {
      description: "Create architectural visualizations and renders",
      prompt: "Modern minimalist house with large glass windows, surrounded by lush garden, golden hour lighting, architectural photography style, 4K quality.",
      imageSize: { width: 3840, height: 2160 },
      result: "High-quality architectural visualization"
    }
  },

  // ============================================================================
  // EDIT FUNCTIONALITY EXAMPLES
  // ============================================================================
  
  editExamples: {
    // Multi-Image Composition
    multiImageComposition: {
      description: "Combine multiple images into coherent scenes",
      prompt: "Dress the model in the clothes and hat. Add a cat to the scene and change the background to a Victorian era building. Professional photography style.",
      imageUrls: [
        "model_image.jpg",
        "clothes_reference.jpg", 
        "hat_reference.jpg",
        "cat_reference.jpg"
      ],
      result: "Coherent scene combining multiple elements naturally"
    },

    // Sketch to Photography
    sketchToPhotography: {
      description: "Convert sketches and line art to realistic photography",
      prompt: "Turn this sketch into a realistic e-commerce product shot photographed in a studio on a white background. Red leather jacket, professional product photography, high quality.",
      imageUrls: ["sketch_lineart.jpg"],
      result: "Realistic product photo from sketch with perfect material rendering"
    },

    // Character Turnarounds
    characterTurnarounds: {
      description: "Generate multiple views of the same character",
      prompt: "Generate four different turnaround views of this model - front, side, three-quarter, and back views. Keep the character appearance exactly the same, professional photography style.",
      imageUrls: ["character_front.jpg"],
      result: "Four consistent character views for e-commerce or training"
    },

    // Product Enhancement
    productEnhancement: {
      description: "Enhance product photos with professional styling",
      prompt: "Transform this product into a professional e-commerce shot with studio lighting, white background, and perfect product presentation. High-quality commercial photography.",
      imageUrls: ["product_original.jpg"],
      result: "Professional e-commerce product photo"
    },

    // Style Transfer
    styleTransfer: {
      description: "Transfer artistic styles while preserving subject",
      prompt: "Change the style of this image to anime/manga style while keeping the character and composition exactly the same. High-quality anime art style.",
      imageUrls: ["realistic_photo.jpg"],
      result: "Anime-style version with preserved character details"
    },

    // Virtual Try-Ons
    virtualTryOns: {
      description: "Virtual clothing try-on with multiple items",
      prompt: "Make the model wear all these clothing items - the jacket, pants, and shoes. Professional fashion photography, studio lighting, high quality.",
      imageUrls: ["model.jpg", "jacket.jpg", "pants.jpg", "shoes.jpg"],
      result: "Model wearing all clothing items naturally"
    },

    // Professional Headshots
    professionalHeadshots: {
      description: "Convert casual photos to professional headshots",
      prompt: "Turn this into a professional headshot for LinkedIn. Corporate style, professional lighting, clean background, business attire.",
      imageUrls: ["casual_photo.jpg"],
      result: "Professional LinkedIn headshot"
    },

    // Logo Editing
    logoEditing: {
      description: "Edit and modify logos and text",
      prompt: "Change the text in this logo from 'Original' to 'Cereal' while maintaining the same font style and design. Professional logo design.",
      imageUrls: ["logo_original.jpg"],
      result: "Logo with updated text maintaining original style"
    },

    // Season Changes
    seasonChanges: {
      description: "Change seasons and environments",
      prompt: "Change the season from winter to summer in this image. Add summer elements like green leaves, warm lighting, and summer atmosphere.",
      imageUrls: ["winter_scene.jpg"],
      result: "Same scene converted to summer season"
    },

    // Product Hands-On
    productHandsOn: {
      description: "Add hands holding products naturally",
      prompt: "Have a woman hold this iPhone in a professional studio setting with white background. Natural hand positioning, professional product photography.",
      imageUrls: ["iphone_product.jpg"],
      result: "Professional product shot with natural hand interaction"
    }
  },

  // ============================================================================
  // SPECIALIZED WORKFLOWS
  // ============================================================================
  
  specializedWorkflows: {
    // E-commerce Product Suite
    ecommerceProductSuite: {
      description: "Generate complete e-commerce product photography suite",
      steps: [
        "Generate main product shot with Seedream 4.0",
        "Create multiple angles and views",
        "Generate lifestyle shots",
        "Create product mockups",
        "Generate depth masks for 3D effects"
      ],
      prompt: "Create a complete e-commerce photography suite for this product including main shot, multiple angles, lifestyle image, and product mockup. Professional commercial photography, white background, studio lighting.",
      result: "Complete e-commerce photography package"
    },

    // Character Consistency Pipeline
    characterConsistencyPipeline: {
      description: "Generate consistent character across multiple scenes",
      steps: [
        "Generate base character with Seedream 4.0",
        "Create multiple poses and expressions",
        "Generate different environments",
        "Create turnaround views",
        "Generate depth masks for animation"
      ],
      prompt: "Generate consistent character views for animation pipeline including front, side, back, and three-quarter views. Professional character design, consistent lighting.",
      result: "Consistent character set for animation or games"
    },

    // Architectural Visualization Pipeline
    architecturalPipeline: {
      description: "Complete architectural visualization workflow",
      steps: [
        "Generate base architectural render",
        "Add realistic materials and textures",
        "Generate different lighting conditions",
        "Create seasonal variations",
        "Generate interior and exterior views"
      ],
      prompt: "Create realistic architectural visualization with modern materials, natural lighting, and professional photography quality. 4K resolution, architectural photography style.",
      result: "Professional architectural visualization"
    },

    // Product Mockup Generation
    mockupGeneration: {
      description: "Generate comprehensive product mockups",
      steps: [
        "Start with logo or brand element",
        "Generate multiple product applications",
        "Create realistic materials and textures",
        "Add professional lighting",
        "Generate multiple angles and views"
      ],
      prompt: "Expand this logo into comprehensive product mockups including apparel, accessories, packaging, and digital applications. Professional product photography, consistent branding.",
      result: "Complete brand mockup suite"
    }
  },

  // ============================================================================
  // ADVANCED TECHNIQUES
  // ============================================================================
  
  advancedTechniques: {
    // Depth Mask Generation
    depthMaskGeneration: {
      description: "Generate depth masks for 3D effects and compositing",
      prompt: "Generate a depth mask for this image showing foreground, midground, and background elements with proper depth separation.",
      imageUrls: ["source_image.jpg"],
      result: "Professional depth mask for 3D compositing"
    },

    // OpenPose Generation
    openPoseGeneration: {
      description: "Generate OpenPose skeletons for animation",
      prompt: "Generate an OpenPose skeleton for this character showing all major joints and bone structure for animation reference.",
      imageUrls: ["character_image.jpg"],
      result: "OpenPose skeleton for animation pipeline"
    },

    // Multi-Image Storytelling
    multiImageStorytelling: {
      description: "Create coherent image sequences for storytelling",
      prompt: "Create a sequence of 4 images telling the story of a day in the life of this character. Maintain character consistency across all images.",
      imageUrls: ["character_base.jpg"],
      result: "Coherent image sequence with consistent character"
    },

    // High-Resolution Upscaling
    highResolutionUpscaling: {
      description: "Generate high-resolution images for print and web",
      prompt: "Generate this image at 4K resolution with enhanced details, professional quality, suitable for large format printing.",
      imageUrls: ["source_image.jpg"],
      imageSize: { width: 4096, height: 4096 },
      result: "High-resolution image suitable for professional use"
    }
  },

  // ============================================================================
  // PROMPT TEMPLATES
  // ============================================================================
  
  promptTemplates: {
    // High-Resolution Generation
    highResolutionGeneration: `[SUBJECT_DESCRIPTION] in [ENVIRONMENT]. [STYLE] style, [LIGHTING] lighting, [QUALITY] quality, 4K resolution.`,

    // Product Mockups
    productMockups: `Expand this [BRAND_ELEMENT] into a full spread of product mockups including [PRODUCT_LIST]. Professional product photography, [BACKGROUND], [LIGHTING] lighting.`,

    // Character Generation
    characterGeneration: `[CHARACTER_DESCRIPTION] in [SETTING]. [POSE], [LIGHTING] lighting, [STYLE] photography, [RESOLUTION] resolution.`,

    // Multi-Image Composition
    multiImageComposition: `[ACTION] using the [ELEMENTS] from the reference images. [ENVIRONMENT_CHANGE]. [STYLE] style, [QUALITY] quality.`,

    // Sketch to Photography
    sketchToPhotography: `Turn this sketch into a realistic [PRODUCT_TYPE] shot photographed in [SETTING] on [BACKGROUND]. [PRODUCT_DETAILS], [STYLE] photography, [QUALITY] quality.`,

    // Character Turnarounds
    characterTurnarounds: `Generate [NUMBER] different turnaround views of this character - [VIEWS]. Keep the character appearance exactly the same, [STYLE] style.`,

    // Style Transfer
    styleTransfer: `Transform this image to [TARGET_STYLE] style while keeping the [ELEMENTS_TO_PRESERVE] exactly the same. [QUALITY] quality.`,

    // Virtual Try-Ons
    virtualTryOns: `Make the model wear [CLOTHING_ITEMS]. [SETTING], [LIGHTING] lighting, [STYLE] photography, [QUALITY] quality.`,

    // Professional Headshots
    professionalHeadshots: `Turn this into a professional headshot for [PURPOSE]. [STYLE] style, [LIGHTING] lighting, [BACKGROUND], [ATTIRE].`,

    // Logo Editing
    logoEditing: `Change the text in this logo from [OLD_TEXT] to [NEW_TEXT] while maintaining the same [DESIGN_ELEMENTS]. [STYLE] design.`,

    // Season Changes
    seasonChanges: `Change the season from [OLD_SEASON] to [NEW_SEASON] in this image. Add [SEASONAL_ELEMENTS], [LIGHTING_CHANGES], [ATMOSPHERE].`,

    // Product Hands-On
    productHandsOn: `Have [PERSON] hold this [PRODUCT] in [SETTING] with [BACKGROUND]. [HAND_POSITIONING], [STYLE] photography, [QUALITY] quality.`
  },

  // ============================================================================
  // IMAGE SIZE OPTIMIZATION
  // ============================================================================
  
  imageSizeOptimization: {
    // Standard Sizes
    standardSizes: {
      square_hd: { width: 1024, height: 1024 },
      square: { width: 2048, height: 2048 },
      portrait_4_3: { width: 1536, height: 2048 },
      portrait_16_9: { width: 1152, height: 2048 },
      landscape_4_3: { width: 2048, height: 1536 },
      landscape_16_9: { width: 2048, height: 1152 }
    },

    // Custom Sizes
    customSizes: {
      ultra_hd: { width: 4096, height: 4096 },
      print_quality: { width: 3840, height: 2160 },
      social_media: { width: 1080, height: 1080 },
      banner: { width: 1920, height: 1080 },
      thumbnail: { width: 512, height: 512 }
    },

    // Use Case Recommendations
    useCaseRecommendations: {
      "e-commerce": "square_hd or square for product photos",
      "social_media": "square_hd for Instagram, landscape_16_9 for YouTube",
      "print": "ultra_hd or print_quality for large format",
      "web": "square_hd or landscape_16_9 for web use",
      "mobile": "portrait_16_9 for mobile apps"
    }
  },

  // ============================================================================
  // PERFORMANCE OPTIMIZATION
  // ============================================================================
  
  performanceOptimization: {
    // Cost Optimization
    costOptimization: {
      description: "Optimize costs while maintaining quality",
      tips: [
        "Use appropriate image sizes for your use case",
        "Batch multiple requests when possible",
        "Use num_images and max_images efficiently",
        "Enable safety checker only when needed",
        "Use sync_mode for immediate results when latency is critical"
      ]
    },

    // Quality Optimization
    qualityOptimization: {
      description: "Maximize output quality",
      tips: [
        "Use detailed, specific prompts",
        "Specify professional photography styles",
        "Include lighting and composition details",
        "Use high-resolution sizes for final outputs",
        "Enable safety checker for public-facing content"
      ]
    },

    // Speed Optimization
    speedOptimization: {
      description: "Optimize generation speed",
      tips: [
        "Use smaller image sizes for iterations",
        "Use sync_mode for immediate results",
        "Batch similar requests together",
        "Use appropriate num_images and max_images",
        "Optimize prompt length and complexity"
      ]
    }
  }
};

// ============================================================================
// USAGE EXAMPLES WITH ACTUAL IMPLEMENTATION
// ============================================================================

export const seedream4UsageExamples = {
  
  // Basic text-to-image generation
  generateImage: async (prompt: string, imageSize?: { width: number; height: number }) => {
    // Implementation would call the fal-ai/bytedance/seedream/v4/text-to-image model
    return {
      prompt,
      imageSize: imageSize || { width: 1024, height: 1024 },
      result: "Generated image URL or base64 data"
    };
  },

  // Multi-image editing
  editMultipleImages: async (prompt: string, imageUrls: string[], imageSize?: { width: number; height: number }) => {
    // Implementation would call the fal-ai/bytedance/seedream/v4/edit model
    return {
      prompt,
      imageUrls,
      imageSize: imageSize || { width: 1024, height: 1024 },
      result: "Edited image URL or base64 data"
    };
  },

  // E-commerce product suite generation
  generateEcommerceSuite: async (productDescription: string, brandElements?: string[]) => {
    const basePrompt = seedream4Examples.promptTemplates.productMockups
      .replace('[BRAND_ELEMENT]', brandElements?.[0] || 'product')
      .replace('[PRODUCT_LIST]', 't-shirt, iPhone case, tote bag, notebook, and mug')
      .replace('[BACKGROUND]', 'white background')
      .replace('[LIGHTING]', 'studio');

    return await seedream4UsageExamples.generateImage(basePrompt, { width: 2048, height: 2048 });
  },

  // Character turnaround generation
  generateCharacterTurnarounds: async (characterImageUrl: string) => {
    const prompt = seedream4Examples.promptTemplates.characterTurnarounds
      .replace('[NUMBER]', '4')
      .replace('[VIEWS]', 'front, side, three-quarter, and back views')
      .replace('[STYLE]', 'professional photography');

    return await seedream4UsageExamples.editMultipleImages(prompt, [characterImageUrl]);
  },

  // Sketch to photography conversion
  convertSketchToPhoto: async (sketchImageUrl: string, productType: string, productDetails: string) => {
    const prompt = seedream4Examples.promptTemplates.sketchToPhotography
      .replace('[PRODUCT_TYPE]', productType)
      .replace('[SETTING]', 'studio')
      .replace('[BACKGROUND]', 'white background')
      .replace('[PRODUCT_DETAILS]', productDetails)
      .replace('[STYLE]', 'professional product')
      .replace('[QUALITY]', 'high quality');

    return await seedream4UsageExamples.editMultipleImages(prompt, [sketchImageUrl]);
  }
};

export default seedream4Examples;
