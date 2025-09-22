/**
 * Enhanced Nano Banana Examples with 11 Foundational Capabilities
 * 
 * This file contains comprehensive examples, prompt templates, and use cases
 * for the enhanced Nano Banana (Google Gemini 2.5 Flash Image) model,
 * showcasing all 11 foundational capabilities with exact copy-paste prompts.
 * 
 * Based on the incredible functionalities from the video content:
 * - 11 Foundational Capabilities
 * - Prompt Enhancers (Flexibility & Consistency)
 * - Comic Generation
 * - Aspect Ratio Control
 * - Professional Photography Techniques
 */

import { 
  NanoBananaExecutor,
  IdentityTransformationInput,
  StyleApplicationInput,
  BackgroundChangeInput,
  ObjectPlacementInput,
  AestheticArrangementInput,
  GenerativeFillInput,
  MultiImageBlendingInput,
  ObjectTransformationInput,
  TextTypographyInput,
  ColorAdaptationInput,
  PhotoRepairInput
} from '../executors/nano-banana';

// ============================================================================
// PROMPT ENHANCERS - FOUNDATIONAL TECHNIQUES
// ============================================================================

export const promptEnhancers = {
  flexibility: {
    description: "Tell Nano Banana what you want to change",
    examples: [
      "Edit the characteristics of the person to fit medieval knight aesthetic",
      "Edit the appearance of the person to fit the overall aesthetics",
      "Turn this person into a medieval knight with natural lighting and realistic placement"
    ],
    template: "Edit the characteristics to fit {TARGET} with natural lighting and realistic placement"
  },
  
  consistency: {
    description: "Tell Nano Banana what you want to preserve",
    examples: [
      "Keep the same face",
      "Keep the same outfit",
      "Keep everything else the same",
      "Change the color of this man's shirt, but keep the logo on the shirt the same"
    ],
    template: "Keep the same {ELEMENTS}, keep everything else the same"
  },
  
  combined: {
    description: "Combine flexibility and consistency enhancers for maximum effectiveness",
    example: "Transform this person into a medieval knight. Edit their appearance to fit the overall aesthetic with natural lighting and realistic placement. Keep their face recognizable and keep everything else the same."
  }
};

// ============================================================================
// 11 FOUNDATIONAL CAPABILITIES WITH EXACT PROMPTS
// ============================================================================

export const nanoBananaCapabilities = {
  
  // 1. Identity & Character Transformation
  identityCharacterTransformation: {
    description: "Transform people's identity while maintaining recognizable appearance",
    exactPrompts: {
      astronaut: "Transform this person into an astronaut. Keep their face recognizable. Professional photography style.",
      baker: "Transform this person into a baker. Keep their face recognizable. Professional photography style.",
      wizard: "Transform this person into a wizard. Keep their face recognizable. Professional photography style.",
      medievalKnight: "Transform this person into a medieval knight. Keep their face recognizable. Professional photography style.",
      samurai: "Transform this person into a Japanese samurai. Keep their face recognizable. Professional photography style."
    },
    useCases: [
      "Social media content for personal branding experiments",
      "Thumbnail creation for videos",
      "Storytelling visuals where you want to be the main character",
      "Character consistency across multiple scenes"
    ],
    example: {
      input: {
        subject_description: "A person in casual clothing",
        target_character: "medieval knight",
        preserve_face: true,
        preserve_outfit: false,
        preserve_pose: false
      } as IdentityTransformationInput,
      prompt: "Transform this person into a medieval knight. Keep their face recognizable. Professional photography style."
    }
  },

  // 2. Style & Effect Application
  styleEffectApplication: {
    description: "Apply artistic styles, visual effects and aesthetic transformations",
    exactPrompts: {
      vanGogh: "Apply the Van Gogh style to this image while maintaining the subject. Professional quality.",
      simpson: "Apply the Simpson style to this image while maintaining the subject. Professional quality.",
      impressionist: "Apply the impressionist style to this image while maintaining the subject. Professional quality.",
      manga: "Apply the manga style to this image while maintaining the subject. Professional quality.",
      comic: "Apply the comic book style to this image while maintaining the subject. Professional quality."
    },
    useCases: [
      "Creative projects requiring artistic transformation",
      "Style transfer while preserving subject identity",
      "Artistic interpretation of photographs",
      "Creating unique visual aesthetics"
    ],
    example: {
      input: {
        target_style: "Van Gogh",
        preserve_subject: true,
        intensity: "moderate"
      } as StyleApplicationInput,
      prompt: "Apply the Van Gogh style to this image moderately while maintaining the subject. Professional quality."
    }
  },

  // 3. Background / Environment Changes
  backgroundEnvironmentChange: {
    description: "Change background or environment with proper lighting adjustment",
    exactPrompts: {
      storm: "Change the background so that the man is in the middle of a storm. Keep the person the same. Adjust the lighting to match the new environment. Add appropriate shadows for the new environment.",
      mountain: "Put this man on top of a mountain. Keep the person the same. Adjust the lighting to match the new environment. Add appropriate shadows for the new environment.",
      cave: "Put this man inside a cave. Keep the person the same. Adjust the lighting to match the new environment. Add appropriate shadows for the new environment.",
      medievalField: "Put this man in the middle of a field in a medieval setting. Keep the person the same. Adjust the lighting to match the new environment. Add appropriate shadows for the new environment."
    },
    useCases: [
      "Creating photos of yourself in different locations",
      "Environmental storytelling",
      "Background replacement for portraits",
      "Combining with identity transformation for complete character creation"
    ],
    example: {
      input: {
        new_background: "lush jungle environment",
        preserve_lighting: false,
        adjust_shadows: true,
        environmental_consistency: true
      } as BackgroundChangeInput,
      prompt: "Change the background to lush jungle environment. Keep the person the same. Adjust the lighting to match the new environment. Add appropriate shadows for the new environment. Make it look like the photo was taken in this environment."
    }
  },

  // 4. Object Placement
  objectPlacement: {
    description: "Add objects to scenes with automatic lighting and shadow harmonization",
    exactPrompts: {
      luxuryCar: "Add a luxury car to the middle of this driveway. Harmonize the lighting and shadows naturally. Add realistic shadows and reflections. Make it look like the objects were part of the original image.",
      flowersInVase: "Add the flowers to the empty vase. Harmonize the lighting and shadows naturally. Add realistic shadows and reflections. Make it look like the objects were part of the original image.",
      furniture: "Add modern furniture to this empty room. Harmonize the lighting and shadows naturally. Add realistic shadows and reflections. Make it look like the objects were part of the original image."
    },
    useCases: [
      "E-commerce product placement",
      "Lifestyle photos for marketing",
      "Real estate staging",
      "Product photography with context"
    ],
    example: {
      input: {
        objects_to_add: ["luxury car"],
        placement_description: "in the middle of this driveway",
        lighting_harmonization: true,
        shadow_integration: true
      } as ObjectPlacementInput,
      prompt: "Add luxury car to this image. in the middle of this driveway. Harmonize the lighting and shadows naturally. Add realistic shadows and reflections. Make it look like the objects were part of the original image."
    }
  },

  // 5. Aesthetic Arrangement & Styling
  aestheticArrangementStyling: {
    description: "Transform content arrangement for better aesthetic presentation",
    exactPrompts: {
      foodPhotography: "Arrange and style this content for improved aesthetic presentation with better composition and visual appeal. Feel free to change the entire composition of the photo for improved aesthetic presentation with better composition and visual appeal.",
      productPhotography: "Arrange and style this content for professional product photography with better composition and visual appeal. Feel free to change the entire composition of the photo for improved aesthetic presentation with better composition and visual appeal.",
      lifestyle: "Arrange and style this content for lifestyle photography with better composition and visual appeal. Feel free to change the entire composition of the photo for improved aesthetic presentation with better composition and visual appeal."
    },
    useCases: [
      "Food photography enhancement",
      "Product photography improvement",
      "Lifestyle content creation",
      "Social media content optimization"
    ],
    example: {
      input: {
        composition_style: "professional product photography",
        visual_appeal_focus: "improved aesthetic presentation",
        allow_composition_change: true
      } as AestheticArrangementInput,
      prompt: "Arrange and style this content for improved aesthetic presentation with professional product photography. Feel free to change the entire composition of the photo for improved aesthetic presentation with better composition and visual appeal."
    }
  },

  // 6. Generative Fill & Expansion
  generativeFillExpansion: {
    description: "Fill empty areas or expand image boundaries",
    exactPrompts: {
      wallArtwork: "Fill the wall with artwork. Match the lighting and aesthetics of the existing image. Make sure no blank areas are left.",
      boxingGym: "Put this man inside a boxing gym. Match the lighting and aesthetics of the existing image. Make sure no blank areas are left.",
      expandBoundaries: "Expand the image boundaries naturally. Match the lighting and aesthetics of the existing image. Make sure no blank areas are left."
    },
    useCases: [
      "Filling empty spaces in images",
      "Expanding image boundaries",
      "Creating complete scenes from partial images",
      "Background generation from scratch"
    ],
    example: {
      input: {
        fill_area_description: "the wall with artwork",
        match_lighting: true,
        match_aesthetics: true,
        expand_boundaries: false
      } as GenerativeFillInput,
      prompt: "Fill the wall with artwork in this image. Match the lighting and aesthetics of the existing image. Make sure no blank areas are left."
    }
  },

  // 7. Multi Image Blending
  multiImageBlending: {
    description: "Combine multiple separate images into one cohesive scene",
    exactPrompts: {
      threePeople: "Combine these images into one cohesive scene. Put these three people into an image. Create a unified scene with consistent lighting and environment. Maintain character consistency across all elements.",
      coffeeShop: "Combine these images into one cohesive scene. Put this man inside the coffee shop while wearing this shirt and drinking from this cup. Create a unified scene with consistent lighting and environment. Maintain character consistency across all elements."
    },
    useCases: [
      "Creating scenes with multiple characters",
      "Combining different elements into cohesive scenes",
      "Character consistency across multiple images",
      "Complex scene composition"
    ],
    example: {
      input: {
        images_to_blend: ["person1.jpg", "person2.jpg", "person3.jpg"],
        blending_instructions: "Put these three people into an image",
        scene_cohesion: true,
        character_consistency: true
      } as MultiImageBlendingInput,
      prompt: "Combine these images into one cohesive scene. Put these three people into an image. Create a unified scene with consistent lighting and environment. Maintain character consistency across all elements."
    }
  },

  // 8. Object / Material Transformation
  objectMaterialTransformation: {
    description: "Modify objects like furniture or textures while maintaining scene integrity",
    exactPrompts: {
      marbleTable: "Change the table to have a marble top. Keep everything else in the scene the same. Keep the main subject exactly the same.",
      knittedShirt: "Change this cotton shirt into a colorful knitted shirt. Keep everything else in the scene the same. Keep the main subject exactly the same.",
      leatherSofa: "Change this sofa to a leather sofa. Keep everything else in the scene the same. Keep the main subject exactly the same."
    },
    useCases: [
      "Testing different materials before purchase",
      "Interior design visualization",
      "Product material variations",
      "Fashion and clothing modifications"
    ],
    example: {
      input: {
        object_to_transform: "table",
        new_material_style: "marble top",
        preserve_scene: true,
        preserve_subject: true
      } as ObjectTransformationInput,
      prompt: "Change the table to marble top. Keep everything else in the scene the same. Keep the main subject exactly the same."
    }
  },

  // 9. Text & Typography
  textTypography: {
    description: "Add, edit or enhance text elements with perfect consistency",
    exactPrompts: {
      changeText: "Change the text 'mangtomas' to 'Terren Thomasas' and change the text 'all around Sarsa' to 'my favorite Sarsa' while preserving the same style and appearance. Integrate the text naturally into the image.",
      addText: "Add the text 'TOWEL' to this image. Keep the existing text style and design exactly the same. Integrate the text naturally into the image.",
      editLogo: "Change the text on this logo from 'TOWEL' to 'ROBERT' while preserving the same style and appearance. Integrate the text naturally into the image."
    },
    useCases: [
      "Product label modification",
      "Logo text changes",
      "Adding text to images",
      "Brand customization"
    ],
    example: {
      input: {
        text_to_edit: "mangtomas",
        new_text: "Terren Thomasas",
        preserve_style: true,
        natural_integration: true
      } as TextTypographyInput,
      prompt: "Change the text 'mangtomas' to 'Terren Thomasas' while preserving the same style and appearance. Integrate the text naturally into the image."
    }
  },

  // 10. Color Adaptation
  colorAdaptation: {
    description: "Adapt content to match specific colors (brand colors, etc.)",
    exactPrompts: {
      blueWhite: "Change all colors to blue and white. Use these as brand colors. Maintain the visual impact while changing colors. Maintain proper contrast and readability.",
      blackGold: "Change all colors to black and gold. Use these as brand colors. Maintain the visual impact while changing colors. Maintain proper contrast and readability.",
      brandColors: "Change all colors to match brand colors. Use these as brand colors. Maintain the visual impact while changing colors. Maintain proper contrast and readability."
    },
    useCases: [
      "Brand color adaptation",
      "Color scheme changes",
      "Brand consistency across images",
      "Color palette modifications"
    ],
    example: {
      input: {
        target_colors: ["blue", "white"],
        brand_colors: true,
        preserve_visual_impact: true,
        maintain_contrast: true
      } as ColorAdaptationInput,
      prompt: "Change all colors to blue and white. Use these as brand colors. Maintain the visual impact while changing colors. Maintain proper contrast and readability."
    }
  },

  // 11. Photo Repair & Enhancement
  photoRepairEnhancement: {
    description: "Fix and improve overall quality of images",
    exactPrompts: {
      restoration: "Restore and enhance this old photograph. Remove any damage, fill in missing areas naturally. Maintain the authentic look and feel of the original. Apply moderate enhancements.",
      enhancement: "Enhance the overall quality of this image. Improve lighting, contrast, and details. Maintain the authentic look and feel of the original. Apply moderate enhancements.",
      colorization: "Colorize this black and white image with realistic colors. Maintain the authentic look and feel of the original. Apply moderate enhancements.",
      qualityImprovement: "Improve the quality and resolution of this image. Maintain the authentic look and feel of the original. Apply moderate enhancements."
    },
    useCases: [
      "Old photo restoration",
      "Image quality improvement",
      "Black and white colorization",
      "General photo enhancement"
    ],
    example: {
      input: {
        repair_type: "restoration",
        preserve_authenticity: true,
        enhancement_level: "moderate"
      } as PhotoRepairInput,
      prompt: "Restore and enhance this old photograph. Remove any damage, fill in missing areas naturally. Maintain the authentic look and feel of the original. Apply moderate enhancements."
    }
  }
};

// ============================================================================
// COMIC GENERATION EXAMPLES
// ============================================================================

export const comicGeneration = {
  description: "Generate entire comic pages with consistent characters and backgrounds",
  
  singlePanelPrompt: `Create a comic panel in {ART_STYLE}. Character: {CHARACTER_DESCRIPTION}. Action: {ACTION}. Background: {BACKGROUND}. {DIALOGUE} {LIGHTING}`,
  
  nextPanelPrompt: `Generate the next panel where {NEXT_ACTION}. Use same style, colors, and setting with {ANGLE}. {DIALOGUE}`,
  
  fullPagePrompt: `Create a full comic page with {NUMBER_OF_PANELS} panels in {ART_STYLE}. Characters: {CHARACTER_DESCRIPTIONS}. Story: {STORY_DESCRIPTION}. Settings: {SETTINGS}. Lighting: {LIGHTING}.`,
  
  examples: {
    character1: "A young woman with freckles, sitting on a bench outside texting with her phone, her red handbag is on the bench",
    character2: "A teenager who grabs her handbag in a swift motion and tries to run away",
    action1: "sitting on a bench outside texting with her phone",
    action2: "grabs her handbag in a swift motion and tries to run away",
    action3: "standing and looking at the teenager running with her purse and crossing the street",
    action4: "gets hit by a yellow sedan (funny scene)",
    background: "calm and quiet park with trees",
    dialogue1: "comic text effect near her phone showing 'tap'",
    dialogue2: "comic bubble with text 'Someone please help'"
  },
  
  workflow: [
    "1. Generate first panel with character description and action",
    "2. Copy the generated image and use it as reference for next panel",
    "3. Continue with subsequent panels maintaining consistency",
    "4. Combine all panels in a 2x2 grid using Canva or similar tool"
  ]
};

// ============================================================================
// ASPECT RATIO CONTROL EXAMPLES
// ============================================================================

export const aspectRatioControl = {
  description: "Control output aspect ratios through reference images",
  
  technique: "The aspect ratio of generated images matches the reference images used",
  
  exactPrompt: `Redraw the content from image one onto image two and adjust image one by adding content so that its aspect ratio matches image two at the same time. Completely remove the content of image 2, keeping only its aspect ratio. Make sure no blank areas are left.`,
  
  examples: {
    verticalToLandscape: "Place vertical character images in a widescreen collage to generate landscape images",
    landscapeToVertical: "Use vertical reference images to generate portrait orientation",
    customRatios: "Create reference images with desired aspect ratios for specific outputs"
  },
  
  workflow: [
    "1. Upload your main image first",
    "2. Upload a blank image with your desired aspect ratio as the second image",
    "3. Use the exact prompt template above",
    "4. The output will match the aspect ratio of the second image"
  ]
};

// ============================================================================
// PROFESSIONAL PHOTOGRAPHY TECHNIQUES
// ============================================================================

export const professionalPhotography = {
  description: "Professional-grade photography techniques using the 6-component formula",
  
  formula: {
    subject: "Specific and clear subject description",
    action: "What the subject is doing",
    environment: "Where the scene takes place",
    artStyle: "Camera and quality specifications",
    lighting: "Lighting setup and conditions",
    details: "Additional details that make the image feel real"
  },
  
  examples: {
    portrait: {
      subject: "A young woman with freckles",
      action: "Smiling thoughtfully and sitting on a beach",
      environment: "In a cozy cafe by the window",
      artStyle: "Shot on a Canon 5D Mark IV",
      lighting: "Natural window light",
      details: "Warm coffee cup and hands, soft focus background"
    },
    
    product: {
      subject: "Premium watch floating in mid-air with dust particles",
      action: "Floating naturally with dramatic lighting",
      environment: "Studio environment",
      artStyle: "Macro lens for sharp detail",
      lighting: "Dramatic lighting with lightning in background",
      details: "Moody atmosphere, metallic golds, dark stormy blues"
    },
    
    architectural: {
      subject: "Modern building with clean lines",
      action: "Standing majestically",
      environment: "Urban landscape",
      artStyle: "Professional architectural photography",
      lighting: "Golden hour lighting",
      details: "Contemporary materials, enhanced sense of place"
    }
  }
};

// ============================================================================
// USAGE EXAMPLES WITH ACTUAL IMPLEMENTATION
// ============================================================================

export const usageExamples = {
  
  // Basic identity transformation
  async transformToAstronaut(apiKey: string, referenceImage: string) {
    const executor = new NanoBananaExecutor(apiKey);
    const input: IdentityTransformationInput = {
      subject_description: "A person in casual clothing",
      target_character: "astronaut",
      preserve_face: true,
      preserve_outfit: false,
      preserve_pose: false
    };
    
    return await executor.identityCharacterTransformation(input, referenceImage, {
      style: "photographic",
      aspect_ratio: "4:5",
      resolution: "1080p"
    });
  },
  
  // Style application
  async applyVanGoghStyle(apiKey: string, referenceImage: string) {
    const executor = new NanoBananaExecutor(apiKey);
    const input: StyleApplicationInput = {
      target_style: "Van Gogh",
      preserve_subject: true,
      intensity: "moderate"
    };
    
    return await executor.styleEffectApplication(input, referenceImage, {
      aspect_ratio: "4:5",
      resolution: "1080p"
    });
  },
  
  // Background change
  async changeToJungleBackground(apiKey: string, referenceImage: string) {
    const executor = new NanoBananaExecutor(apiKey);
    const input: BackgroundChangeInput = {
      new_background: "lush jungle environment",
      preserve_lighting: false,
      adjust_shadows: true,
      environmental_consistency: true
    };
    
    return await executor.backgroundEnvironmentChange(input, referenceImage, {
      style: "photographic",
      aspect_ratio: "4:5",
      resolution: "1080p"
    });
  },
  
  // Comic panel generation
  async generateComicPanel(apiKey: string) {
    const executor = new NanoBananaExecutor(apiKey);
    
    return await executor.generateComicPanel(
      "A young woman with freckles, sitting on a bench outside texting with her phone, her red handbag is on the bench",
      "sitting on a bench outside texting with her phone",
      "calm and quiet park with trees",
      {
        artStyle: "modern colorful comic art style",
        aspectRatio: "1:1",
        dialogue: "comic text effect near her phone showing 'tap'",
        lighting: "natural outdoor lighting"
      }
    );
  },
  
  // Aspect ratio control
  async generateWithAspectRatio(apiKey: string, prompt: string, aspectRatioImage: string) {
    const executor = new NanoBananaExecutor(apiKey);
    
    return await executor.generateWithAspectRatioControl(prompt, aspectRatioImage, {
      style: "photographic",
      resolution: "1080p"
    });
  }
};

// ============================================================================
// PROMPT TEMPLATES FOR DIFFERENT USE CASES
// ============================================================================

export const promptTemplates = {
  
  // Identity transformation template
  identityTransformation: `Transform this person into a {TARGET_CHARACTER}. {PRESERVE_FACE ? 'Keep their face recognizable' : ''}. {PRESERVE_OUTFIT ? 'Keep the same outfit' : ''}. {PRESERVE_POSE ? 'Keep the same pose' : ''}. Professional photography style.`,
  
  // Style application template
  styleApplication: `Apply the {TARGET_STYLE} style to this image {INTENSITY} while {PRESERVE_SUBJECT ? 'maintaining the subject' : 'transforming the entire image'}. Professional quality.`,
  
  // Background change template
  backgroundChange: `Change the background to {NEW_BACKGROUND}. Keep the person the same. {PRESERVE_LIGHTING ? 'Keep the lighting the same' : 'Adjust the lighting to match the new environment'}. {ADJUST_SHADOWS ? 'Add appropriate shadows for the new environment' : ''}. {ENVIRONMENTAL_CONSISTENCY ? 'Make it look like the photo was taken in this environment' : ''}.`,
  
  // Object placement template
  objectPlacement: `Add {OBJECTS} to this image. {PLACEMENT_DESCRIPTION}. {LIGHTING_HARMONIZATION ? 'Harmonize the lighting and shadows naturally' : ''}. {SHADOW_INTEGRATION ? 'Add realistic shadows and reflections' : ''}. Make it look like the objects were part of the original image.`,
  
  // Comic panel template
  comicPanel: `Create a comic panel in {ART_STYLE}. Character: {CHARACTER_DESCRIPTION}. Action: {ACTION}. Background: {BACKGROUND}. {DIALOGUE ? `Dialogue: "${DIALOGUE}"` : ''} {LIGHTING ? `Lighting: ${LIGHTING}` : ''}`,
  
  // Aspect ratio control template
  aspectRatioControl: `Redraw the content from image one onto image two and adjust image one by adding content so that its aspect ratio matches image two at the same time. Completely remove the content of image 2, keeping only its aspect ratio. Make sure no blank areas are left. Original prompt: {ORIGINAL_PROMPT}`,
  
  // Professional photography template
  professionalPhotography: `{SUBJECT} {ACTION} in {ENVIRONMENT}. {ART_STYLE}. {LIGHTING}. {DETAILS}. Professional quality.`
};

export default {
  promptEnhancers,
  nanoBananaCapabilities,
  comicGeneration,
  aspectRatioControl,
  professionalPhotography,
  usageExamples,
  promptTemplates
};

