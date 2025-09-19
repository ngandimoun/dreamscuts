/**
 * Comprehensive Examples for Google's Nano Banana (Gemini 2.5 Flash Image)
 * 
 * This file contains detailed examples, prompts, and use cases for the
 * fal-ai/gemini-25-flash-image model, showcasing its advanced capabilities
 * in image generation, editing, and manipulation.
 * 
 * Key Features Demonstrated:
 * - Product photography with perfect label reproduction
 * - Character consistency across multiple scenes
 * - Advanced image editing and manipulation
 * - Background replacement with proper lighting
 * - Hand-holding products (notoriously difficult for AI)
 * - Clothing placement on models
 * - 3D model generation from images
 * - Architectural visualization
 * - And much more...
 */

export const nanoBananaExamples = {
  
  // ============================================================================
  // PROMPT STRUCTURE & BEST PRACTICES
  // ============================================================================
  
  promptStructure: {
    description: "The C.R.I.S.T.A.L method for optimal Nano Banana prompts",
    structure: {
      C: "Context & Composition - Where is the scene? What composition? (close-up, wide shot, etc.)",
      R: "Role of Subject - What is your subject? What actions, postures, details?",
      I: "Intention & Style - What artistic style? References? Era? Ultra-realistic?",
      S: "Scenography & Lighting - What ambiance? What emotions to convey?",
      T: "Tones & Palette - What colors are expected?",
      A: "Appearance & Details - Textures, finishes, quality level (4K, film grain, etc.)",
      L: "Limitations - What NOT to include (no text, no blur, etc.)"
    },
    example: `Context: Close-up product photography in a studio environment
Role: Premium watch floating in mid-air with dust particles
Intention: Ultra-realistic commercial photography style
Scenography: Dramatic lighting with lightning in background, moody atmosphere
Tones: Metallic golds, dark stormy blues, electric whites
Appearance: 4K quality, hyper-detailed, professional studio lighting
Limitations: No text overlays, no watermarks, no blur effects`
  },

  // ============================================================================
  // PRODUCT PHOTOGRAPHY EXAMPLES
  // ============================================================================
  
  productPhotography: {
    hotSauceFlatLay: {
      description: "Perfect product placement with label preservation",
      prompt: `Create a flat lay product photography image of this hot sauce bottle placed naturally among chicken wings on a wooden table. Studio lighting with soft shadows. Keep the product label exactly as shown in the reference image. Professional commercial photography style, 4K quality.`,
      referenceImages: ["hot_sauce_bottle.png", "chicken_wings_background.jpg"],
      result: "Perfect label reproduction with natural product placement"
    },

    floatingProduct: {
      description: "Product half-submerged in liquid with perfect label preservation",
      prompt: `Create a dramatic product shot where this bottle is half-submerged in orange hot sauce, floating naturally with chicken wings around it. The bottle should appear to be emerging from the liquid with sauce dripping from the cap. Keep the product label exactly as shown. Professional studio lighting, 4K quality, commercial photography style.`,
      referenceImages: ["product_bottle.png", "liquid_reference.jpg"],
      result: "Impossible to achieve in Photoshop - perfect label + realistic liquid interaction"
    },

    handHoldingProduct: {
      description: "Hand-holding products - Nano Banana's specialty",
      prompt: `Create an image of a hand emerging from the ground holding this bottle in a rainforest environment. The hand should be covered in dirt and grass. Keep the product label exactly as shown. Natural outdoor lighting with shadows. Ultra-realistic photography style.`,
      referenceImages: ["product_bottle.png"],
      result: "Perfect hand anatomy with realistic product interaction"
    },

    perspectiveChange: {
      description: "Surface-level perspective with hand interaction",
      prompt: `Create a surface-level view where a hand is lifting this bottle out of hot sauce. The camera should be positioned at the liquid surface level looking up. Studio lighting with dramatic shadows. Keep the product label exactly as shown. Professional commercial photography.`,
      referenceImages: ["product_bottle.png"],
      result: "Perfect perspective change with maintained label integrity"
    }
  },

  // ============================================================================
  // CHARACTER CONSISTENCY & WORLD BUILDING
  // ============================================================================
  
  characterConsistency: {
    singleImageWorldBuilding: {
      description: "Build entire worlds from a single character image",
      prompt: `Create a side profile photo of this pilot climbing into the cockpit of the fighter jet behind her. She appears tired and weary after a long day. Keep the character exactly as shown in the reference image. Cinematic lighting, professional photography style.`,
      referenceImages: ["pilot_character.png"],
      result: "Consistent character across different scenes and actions"
    },

    characterPoseVariation: {
      description: "Same character in different poses and contexts",
      prompt: `Create an image of this pilot sitting down and leaning back against a wooden crate. She looks exhausted. Keep the character's appearance exactly as shown in the reference image. Natural outdoor lighting, cinematic style.`,
      referenceImages: ["pilot_character.png"],
      result: "Character consistency with natural pose variation"
    },

    characterEditing: {
      description: "Add specific elements to existing character images",
      prompt: `Add an oxygen mask to this pilot's face while keeping everything else in the image exactly the same. The mask should fit naturally and look realistic. Professional photography lighting.`,
      referenceImages: ["pilot_with_helmet.png"],
      result: "Perfect addition of elements while maintaining image integrity"
    }
  },

  // ============================================================================
  // BACKGROUND REPLACEMENT & LIGHTING
  // ============================================================================
  
  backgroundReplacement: {
    basicReplacement: {
      description: "Simple background change (basic approach)",
      prompt: `Change the background of this image to a lush jungle environment.`,
      referenceImages: ["character_image.png"],
      result: "Basic replacement but may look disconnected"
    },

    contextualReplacement: {
      description: "Contextual background replacement with proper lighting",
      prompt: `Create a scene of this character inside a cinematic sci-fi film by changing the background to temple ruins in a lush jungle. Keep the character's pose and location exactly the same. Adjust the lighting and shadows to match the jungle environment. Add subtle shadows cast onto the character from the surrounding jungle.`,
      referenceImages: ["character_image.png"],
      result: "Realistic integration with proper environmental lighting"
    },

    greenScreenMethod: {
      description: "Using green screen for better background replacement",
      prompt: `Replace the green background with a mountain landscape. Adjust the lighting and shadows on the character to match the outdoor mountain environment. Make it look like the photo was taken outside.`,
      referenceImages: ["character_green_screen.png"],
      result: "Better integration when using green screen reference"
    }
  },

  // ============================================================================
  // MULTIPLE CHARACTER COMBINATION
  // ============================================================================
  
  multipleCharacters: {
    basicCombination: {
      description: "Combining multiple characters (basic approach)",
      prompt: `The man with blue skin and the woman with green skin stand across from each other in black ancient temple ruins in the background inside a medieval fantasy film.`,
      referenceImages: ["blue_man.png", "green_woman.png"],
      result: "Characters combined but may look disconnected"
    },

    contextualCombination: {
      description: "Contextual character combination with interaction",
      prompt: `Create a side profile photo of the green-skinned woman sitting on a rock while the blue-skinned man reaches out and gestures for her to stand up. Set in a medieval fantasy environment shot on 35mm camera. Wide angle shot, full body composition.`,
      referenceImages: ["blue_man.png", "green_woman.png"],
      result: "Better integration with specific character interactions"
    },

    collageMethod: {
      description: "Using collage method for better results",
      prompt: `Create a scene using this collage reference image. Transform the collage into a realistic photograph while maintaining all the character details and positioning shown in the reference.`,
      referenceImages: ["character_collage.png"],
      result: "Best method for combining multiple references"
    }
  },

  // ============================================================================
  // ASPECT RATIO CONTROL
  // ============================================================================
  
  aspectRatioControl: {
    description: "Controlling output aspect ratios through reference images",
    technique: "The aspect ratio of generated images matches the reference images used",
    examples: {
      verticalToLandscape: "Place vertical character images in a widescreen collage to generate landscape images",
      landscapeToVertical: "Use vertical reference images to generate portrait orientation",
      customRatios: "Create reference images with desired aspect ratios for specific outputs"
    }
  },

  // ============================================================================
  // IMAGE EXPANSION (OUTPAINTING)
  // ============================================================================
  
  imageExpansion: {
    description: "Expanding images beyond their original boundaries",
    technique: "Place image on larger canvas with white space, then fill the white areas",
    prompt: `Expand this character image to fill the white areas of the canvas. Create a fantasy environment with ancient temple at the top, dragon flying in the distance, and mysterious stone well in the foreground. Keep the character in the same location.`,
    referenceImages: ["character_on_white_canvas.png"],
    result: "Seamless image expansion with environmental storytelling"
  },

  // ============================================================================
  // ANNOTATED REFERENCES
  // ============================================================================
  
  annotatedReferences: {
    textAnnotations: {
      description: "Using text and arrows to guide image generation",
      prompt: `Expand the character photo to fill the white areas using the directions shown in the image. Keep the character in the same location.`,
      referenceImages: ["character_with_annotations.png"],
      result: "Precise control over object placement and composition"
    },

    imageAnnotations: {
      description: "Combining text annotations with image references",
      prompt: `Create a scene using this annotated reference image. Place all elements exactly as indicated by the arrows and text, using the provided image references for each element.`,
      referenceImages: ["fully_annotated_reference.png"],
      result: "Maximum control over final composition and elements"
    }
  },

  // ============================================================================
  // LIGHTING MANIPULATION
  // ============================================================================
  
  lightingManipulation: {
    moodChange: {
      description: "Changing lighting to alter mood and atmosphere",
      prompt: `Change the lighting of this scene to a golden glow with soft diffused lighting, adding rays of sunlight casting shadows onto the character. Keep the character and environment exactly the same.`,
      referenceImages: ["dramatic_character.png"],
      result: "Complete mood transformation through lighting changes"
    },

    colorPaletteChange: {
      description: "Altering color palettes while maintaining structure",
      prompt: `Change the lighting to bright blue sky with vivid, saturated colors. Keep all structures and characters exactly the same.`,
      referenceImages: ["original_scene.png"],
      result: "Color transformation while preserving all structural elements"
    }
  },

  // ============================================================================
  // LOGO & TEXT INTEGRATION
  // ============================================================================
  
  logoIntegration: {
    description: "Adding logos and text to objects and products",
    prompt: `Add the spray-painted logo with text "TOWEL" onto the side of this vehicle. Adjust the lighting to match the environment.`,
    referenceImages: ["logo_design.png", "vehicle.png"],
    result: "Perfect logo integration with environmental lighting matching"
  },

  textModification: {
    description: "Modifying existing text while preserving style",
    prompt: `Change the text on this logo from "TOWEL" to "ROBERT" while preserving the same style and appearance.`,
    referenceImages: ["logo_with_text.png"],
    result: "Text modification while maintaining design consistency"
  },

  // ============================================================================
  // CAMERA ANGLE VARIATIONS
  // ============================================================================
  
  cameraAngles: {
    closeUp: {
      prompt: `Create a close-up shot of this character's face looking towards the camera.`,
      result: "Intimate character focus"
    },

    lowAngle: {
      prompt: `Create a low angle shot from below, placing the camera beneath the character and tilting upwards. Full body shot showing boots.`,
      result: "Dramatic low-angle perspective"
    },

    highAngle: {
      prompt: `Create a high angle shot from above, looking down towards the character. Expand the image and pull the camera back.`,
      result: "Overhead perspective with environmental context"
    },

    behindShot: {
      prompt: `Create an image shot from behind the character, showing the environment ahead.`,
      result: "Rear perspective with forward-looking composition"
    }
  },

  // ============================================================================
  // ARCHITECTURAL VISUALIZATION
  // ============================================================================
  
  architecturalVisualization: {
    conceptGeneration: {
      prompt: `Create a Zaha Hadid style home on the edge of a cliff. White organic architecture with birds and god rays in the sky. Aerial drone shot, high quality architecture rendering.`,
      result: "Futuristic architectural concept with dramatic setting"
    },

    floorPlanToRendering: {
      prompt: `Transform this floor plan into a realistic architectural rendering. Create a modern building with clean lines and contemporary materials. Professional architectural photography style.`,
      referenceImages: ["floor_plan.png"],
      result: "3D visualization from 2D plans"
    },

    roomRemodeling: {
      prompt: `Completely remodel this room while retaining all architectural elements like windows, soffits, and wood ceilings. Change all furniture to light wood mid-century modern style. Place abstract unique artwork on the walls.`,
      referenceImages: ["room_photo.png"],
      result: "Complete room transformation with preserved architecture"
    },

    exteriorRemodeling: {
      prompt: `Remodel the exterior of this home with modern materials and contemporary design elements. Update the landscaping to complement the new design. Professional architectural photography.`,
      referenceImages: ["home_exterior.png"],
      result: "Complete exterior transformation"
    }
  },

  // ============================================================================
  // PHOTO RESTORATION & ENHANCEMENT
  // ============================================================================
  
  photoRestoration: {
    oldPhotoEnhancement: {
      prompt: `Restore and enhance this old photograph. Remove the polaroid border and wood frame. Fill in any missing areas naturally. Convert to high quality, full-color image.`,
      referenceImages: ["old_polaroid.png"],
      result: "Complete photo restoration with missing area reconstruction"
    },

    styleConversion: {
      prompt: `Convert this photograph into a manga/comic book style while maintaining the character's appearance and pose.`,
      referenceImages: ["person_photo.png"],
      result: "Style conversion while preserving character identity"
    },

    figurineCreation: {
      prompt: `Transform this photograph into a realistic figurine with packaging box and 3D modeling software interface in the background.`,
      referenceImages: ["person_photo.png"],
      result: "Creative transformation into collectible figurine"
    }
  },

  // ============================================================================
  // E-COMMERCE & PRODUCT VISUALIZATION
  // ============================================================================
  
  ecommerceVisualization: {
    productShowcase: {
      prompt: `Create a professional e-commerce product photo of this item. Include studio lighting, shadows, reflections, and a preview of the product in its real-world context.`,
      referenceImages: ["product_design.png"],
      result: "Professional e-commerce ready product photography"
    },

    lifestyleIntegration: {
      prompt: `Place this product in a 1960s kitchen setting for a lifestyle marketing image. Create a vintage advertisement style with period-appropriate styling.`,
      referenceImages: ["product.png"],
      result: "Lifestyle marketing image with period styling"
    }
  },

  // ============================================================================
  // ADVANCED EDITING TECHNIQUES
  // ============================================================================
  
  advancedEditing: {
    selectiveEditing: {
      description: "Editing specific parts of images with precision",
      prompt: `Remove the hat from this person's head and add a cap instead. Keep everything else exactly the same.`,
      technique: "Be specific: 'Remove X and add Y' rather than 'Replace X with Y'"
    },

    lightingAdjustment: {
      prompt: `Add subtle shadows cast onto the body and head from the surrounding environment. Adjust the lighting to be more dramatic and cinematic.`,
      result: "Professional lighting enhancement"
    },

    colorGrading: {
      prompt: `Apply a warm, golden color grade to this image while maintaining all details and textures.`,
      result: "Professional color grading effect"
    }
  },

  // ============================================================================
  // VIDEO TRANSITION PREPARATION
  // ============================================================================
  
  videoTransitions: {
    description: "Creating consistent scenes for AI video generation",
    technique: "Generate multiple angles of the same scene for seamless video transitions",
    examples: {
      frontToBack: "Front-facing character shot + behind character shot for rotation transition",
      actionSequence: "Character running + character climbing for action transition",
      environmental: "Different camera angles of the same environment for cinematic transitions"
    }
  },

  // ============================================================================
  // COMMON ISSUES & SOLUTIONS
  // ============================================================================
  
  troubleshooting: {
    labelReproduction: {
      issue: "Labels not reproducing correctly",
      solution: "Use products with clear, prominent text. Avoid small, complex fonts",
      example: "Prime bottle works better than complex wine labels"
    },

    aspectRatioProblems: {
      issue: "Wrong aspect ratio output",
      solution: "Use reference images with the desired aspect ratio",
      example: "Create widescreen collage for landscape output"
    },

    characterInconsistency: {
      issue: "Characters changing appearance between generations",
      solution: "Start new conversation when edits go wrong, use collage method for multiple characters",
      example: "Don't continue editing in same conversation if results degrade"
    },

    lightingDisconnection: {
      issue: "Background and subject lighting don't match",
      solution: "Explicitly request lighting adjustments to match environment",
      example: "Add 'adjust lighting to match outdoor environment' to prompts"
    }
  },

  // ============================================================================
  // EDIT FUNCTIONALITY EXAMPLES
  // ============================================================================
  
  editExamples: {
    multiImageEditing: {
      description: "Edit multiple images with a single prompt",
      prompt: "make a photo of the man driving the car down the california coastline",
      imageUrls: [
        "https://storage.googleapis.com/falserverless/example_inputs/nano-banana-edit-input.png",
        "https://storage.googleapis.com/falserverless/example_inputs/nano-banana-edit-input-2.png"
      ],
      result: "Combines elements from multiple images into a cohesive scene"
    },

    characterPoseEditing: {
      description: "Change character pose while maintaining appearance",
      prompt: "Edit this character to be sitting on a chair instead of standing. Keep the character's appearance exactly the same, only change the pose and positioning. Professional photography style.",
      imageUrls: ["character_standing.jpg"],
      result: "Same character in different pose with maintained consistency"
    },

    backgroundReplacementEdit: {
      description: "Replace background via edit endpoint",
      prompt: "Replace the background of this image with a modern office environment. Keep the main subject exactly the same. Adjust the lighting and shadows to match the office environment. Professional photography style.",
      imageUrls: ["person_outdoor.jpg"],
      result: "Background replaced with proper lighting adjustment"
    },

    productEnhancement: {
      description: "Enhance product photos while preserving labels",
      prompt: "Enhance this product image by: improve lighting, add professional shadows, enhance product details. Keep the product label and appearance exactly the same. Professional commercial photography style.",
      imageUrls: ["product_original.jpg"],
      result: "Enhanced product photo with preserved label integrity"
    },

    styleTransfer: {
      description: "Transfer artistic style while preserving subject",
      prompt: "Transform this image to vintage film photography style. Keep the main subject exactly the same, only change the style and aesthetic. Professional quality.",
      imageUrls: ["modern_photo.jpg"],
      result: "Style transfer with subject preservation"
    },

    objectManipulation: {
      addObject: {
        prompt: "Add a vintage car to this street scene. Integrate it naturally with the existing scene and lighting.",
        result: "Natural object addition with environmental integration"
      },
      removeObject: {
        prompt: "Remove the person from this landscape photo. Fill in the area naturally to maintain the composition.",
        result: "Clean object removal with natural background reconstruction"
      },
      replaceObject: {
        prompt: "Replace the modern car with a vintage car in this street scene. Maintain the same positioning and lighting.",
        result: "Object replacement with maintained positioning"
      }
    },

    lightingAdjustment: {
      dramatic: {
        prompt: "Adjust the lighting in this image to strong dramatic lighting. Keep all subjects and objects exactly the same, only change the lighting and shadows. Professional photography style.",
        result: "Dramatic lighting enhancement"
      },
      goldenHour: {
        prompt: "Adjust the lighting in this image to moderate golden hour lighting. Keep all subjects and objects exactly the same, only change the lighting and shadows. Professional photography style.",
        result: "Warm golden hour lighting effect"
      },
      studio: {
        prompt: "Adjust the lighting in this image to professional studio lighting. Keep all subjects and objects exactly the same, only change the lighting and shadows. Professional photography style.",
        result: "Professional studio lighting setup"
      }
    },

    colorGrading: {
      warm: {
        prompt: "Apply moderate warm color grading to this image. Maintain all details and textures while adjusting the color palette. Professional color grading style.",
        result: "Warm, inviting color palette"
      },
      cinematic: {
        prompt: "Apply strong cinematic color grading to this image. Maintain all details and textures while adjusting the color palette. Professional color grading style.",
        result: "Cinematic color grading effect"
      },
      vintage: {
        prompt: "Apply subtle vintage color grading to this image. Maintain all details and textures while adjusting the color palette. Professional color grading style.",
        result: "Vintage film aesthetic"
      }
    }
  },

  // ============================================================================
  // PROMPT TEMPLATES FOR DIFFERENT USE CASES
  // ============================================================================
  
  promptTemplates: {
    productPhotography: `Create a [COMPOSITION] product photography image of [PRODUCT] [ACTION/CONTEXT]. [LIGHTING_STYLE] lighting with [SHADOW_DESCRIPTION]. Keep the product label exactly as shown in the reference image. [STYLE] style, [QUALITY] quality.`,

    characterConsistency: `Create a [COMPOSITION] of [CHARACTER_DESCRIPTION] [ACTION/POSE] in [ENVIRONMENT]. Keep the character's appearance exactly as shown in the reference image. [LIGHTING] lighting, [STYLE] style.`,

    backgroundReplacement: `Create a scene of [CHARACTER/OBJECT] in [NEW_ENVIRONMENT] by changing the background to [SPECIFIC_BACKGROUND]. Keep [ELEMENTS_TO_PRESERVE] exactly the same. Adjust lighting and shadows to match the [ENVIRONMENT_TYPE] environment.`,

    architecturalVisualization: `Create a [STYLE] [BUILDING_TYPE] in [LOCATION/CONTEXT]. [ARCHITECTURAL_DETAILS]. [CAMERA_ANGLE] shot, [LIGHTING_CONDITIONS]. High quality architecture rendering.`,

    photoRestoration: `Restore and enhance this [PHOTO_TYPE]. [SPECIFIC_REQUESTS]. Convert to [FINAL_STYLE] while maintaining [ELEMENTS_TO_PRESERVE]. [QUALITY_SPECIFICATIONS].`,

    // Edit Templates
    editCharacterPose: `Edit this character to [NEW_POSE] in the [ENVIRONMENT]. Keep the character's appearance exactly the same, only change the pose and positioning. [STYLE] style.`,

    editBackground: `Replace the background of this image with [NEW_BACKGROUND]. Keep the main subject exactly the same. [LIGHTING_INSTRUCTION] [STYLE] style.`,

    editProductEnhancement: `Enhance this product image by: [ENHANCEMENTS]. Keep the product label and appearance exactly the same. [STYLE] style.`,

    editStyleTransfer: `Transform this image to [TARGET_STYLE] style. [PRESERVE_INSTRUCTION] [QUALITY] quality.`,

    editObjectManipulation: `[ACTION] [OBJECT_DESCRIPTION] [ADDITIONAL_INSTRUCTIONS]. [INTEGRATION_INSTRUCTION].`,

    editLightingAdjustment: `Adjust the lighting in this image to [INTENSITY] [LIGHTING_TYPE] lighting. Keep all subjects and objects exactly the same, only change the lighting and shadows. [STYLE] style.`,

    editColorGrading: `Apply [INTENSITY] [COLOR_GRADE] color grading to this image. Maintain all details and textures while adjusting the color palette. [STYLE] style.`
  }
};

// ============================================================================
// USAGE EXAMPLES WITH ACTUAL IMPLEMENTATION
// ============================================================================

export const nanoBananaUsageExamples = {
  
  // Basic image generation
  generateImage: async (prompt: string, referenceImages?: string[]) => {
    // Implementation would call the fal-ai/gemini-25-flash-image model
    return {
      prompt,
      referenceImages,
      result: "Generated image URL or base64 data"
    };
  },

  // Product photography workflow
  productPhotographyWorkflow: async (productImage: string, backgroundImage: string) => {
    const prompt = nanoBananaExamples.promptTemplates.productPhotography
      .replace('[COMPOSITION]', 'flat lay')
      .replace('[PRODUCT]', 'this product')
      .replace('[ACTION/CONTEXT]', 'placed naturally among complementary items')
      .replace('[LIGHTING_STYLE]', 'Studio')
      .replace('[SHADOW_DESCRIPTION]', 'soft shadows')
      .replace('[STYLE]', 'Professional commercial photography')
      .replace('[QUALITY]', '4K quality');

    return await nanoBananaUsageExamples.generateImage(prompt, [productImage, backgroundImage]);
  },

  // Character consistency workflow
  characterConsistencyWorkflow: async (characterImage: string, action: string, environment: string) => {
    const prompt = nanoBananaExamples.promptTemplates.characterConsistency
      .replace('[COMPOSITION]', 'wide angle shot')
      .replace('[CHARACTER_DESCRIPTION]', 'this character')
      .replace('[ACTION/POSE]', action)
      .replace('[ENVIRONMENT]', environment)
      .replace('[LIGHTING]', 'Natural outdoor')
      .replace('[STYLE]', 'cinematic');

    return await nanoBananaUsageExamples.generateImage(prompt, [characterImage]);
  }
};

export default nanoBananaExamples;
