/**
 * Veo 3 Fast Industry Use Cases
 * 
 * Comprehensive guide for using Google Veo 3 Fast and fal-ai/veo3/fast/image-to-video
 * across different industries and professional applications.
 */

import { FalAiVeo3FastImageToVideoExecutor } from '../executors/fal-ai-veo3-fast-image-to-video';

// ============================================================================
// INDUSTRY-SPECIFIC USE CASES
// ============================================================================

export const veo3FastIndustryUseCases = {

  // ============================================================================
  // FILM & ENTERTAINMENT INDUSTRY
  // ============================================================================
  
  filmEntertainment: {
    description: "Professional film and entertainment applications",
    
    useCases: {
      // Pre-visualization and storyboarding
      preVisualization: {
        title: "Pre-visualization and Storyboarding",
        description: "Create animated storyboards and pre-visualization sequences",
        examples: [
          {
            scenario: "Action sequence pre-vis",
            prompt: "Dynamic action sequence with hero character dodging obstacles, camera follows with smooth tracking, dramatic lighting with shadows and highlights",
            useCase: "Director can visualize complex action sequences before filming"
          },
          {
            scenario: "Dialogue scene animation",
            prompt: "Two characters in conversation, natural gestures and expressions, subtle camera movement, realistic lighting",
            useCase: "Test dialogue delivery and blocking before principal photography"
          }
        ],
        benefits: [
          "Cost-effective pre-production planning",
          "Visual communication with crew and investors",
          "Iterative refinement of creative vision"
        ]
      },

      // Character animation and motion capture
      characterAnimation: {
        title: "Character Animation and Motion Capture",
        description: "Animate characters for films, TV shows, and digital content",
        examples: [
          {
            scenario: "Fantasy character transformation",
            prompt: "Mystical character with flowing robes, arms raised in spell-casting pose, magical energy swirling around, dramatic lighting with ethereal glow",
            useCase: "Fantasy and sci-fi productions requiring magical effects"
          },
          {
            scenario: "Historical drama performance",
            prompt: "Period-accurate character delivering monologue, subtle period-appropriate gestures, candlelit atmosphere, authentic costume movement",
            useCase: "Historical dramas and period pieces"
          }
        ],
        benefits: [
          "Realistic character performance without full motion capture",
          "Cost-effective alternative to traditional animation",
          "Quick iteration for character development"
        ]
      },

      // Special effects and VFX
      specialEffects: {
        title: "Special Effects and VFX",
        description: "Create visual effects and magical elements",
        examples: [
          {
            scenario: "Magical transformation",
            prompt: "Person surrounded by swirling magical energy, particles and light effects, transformation sequence with dramatic lighting changes",
            useCase: "Fantasy films, superhero movies, magical realism"
          },
          {
            scenario: "Environmental effects",
            prompt: "Landscape with weather effects, wind moving vegetation, lighting changes, atmospheric particles",
            useCase: "Environmental storytelling and mood setting"
          }
        ],
        benefits: [
          "Cost-effective VFX alternative",
          "Realistic particle and lighting effects",
          "Seamless integration with live action"
        ]
      }
    }
  },

  // ============================================================================
  // ADVERTISING & MARKETING
  // ============================================================================
  
  advertisingMarketing: {
    description: "Professional advertising and marketing applications",
    
    useCases: {
      // Product demonstrations
      productDemonstration: {
        title: "Product Demonstrations",
        description: "Animate products for advertising and marketing campaigns",
        examples: [
          {
            scenario: "Luxury car commercial",
            prompt: "Sleek luxury car in showroom, camera orbits smoothly around vehicle, highlighting design features, professional lighting with reflections",
            useCase: "Automotive advertising, luxury brand marketing"
          },
          {
            scenario: "Electronics showcase",
            prompt: "Smartphone rotating to show all angles, screen lighting up with interface, smooth professional presentation",
            useCase: "Tech product launches, electronics marketing"
          },
          {
            scenario: "Fashion presentation",
            prompt: "Model wearing designer clothing, elegant movements showcasing garment details, professional runway lighting",
            useCase: "Fashion brands, luxury clothing marketing"
          }
        ],
        benefits: [
          "Professional product presentation",
          "Cost-effective alternative to traditional photography",
          "Dynamic product showcasing"
        ]
      },

      // Brand storytelling
      brandStorytelling: {
        title: "Brand Storytelling",
        description: "Create compelling brand narratives and emotional connections",
        examples: [
          {
            scenario: "Lifestyle brand story",
            prompt: "Person enjoying outdoor adventure, natural movements, environmental elements, aspirational lifestyle atmosphere",
            useCase: "Outdoor brands, lifestyle products, travel marketing"
          },
          {
            scenario: "Family moments",
            prompt: "Family sharing meal together, warm interactions, cozy home atmosphere, emotional connection",
            useCase: "Food brands, home products, family-oriented marketing"
          }
        ],
        benefits: [
          "Emotional brand connection",
          "Authentic lifestyle representation",
          "Cost-effective content creation"
        ]
      },

      // Social media content
      socialMediaContent: {
        title: "Social Media Content",
        description: "Create engaging content for social media platforms",
        examples: [
          {
            scenario: "Instagram Reels",
            prompt: "Person doing trendy dance move, then pointing at camera with smile, perfect for social media engagement",
            useCase: "Social media marketing, influencer content, brand awareness"
          },
          {
            scenario: "TikTok style content",
            prompt: "Person doing popular TikTok trend, smooth transitions, energetic movements, engaging for younger audience",
            useCase: "Gen Z marketing, viral content creation, brand engagement"
          }
        ],
        benefits: [
          "Platform-optimized content",
          "Trending format compatibility",
          "High engagement potential"
        ]
      }
    }
  },

  // ============================================================================
  // EDUCATION & TRAINING
  // ============================================================================
  
  educationTraining: {
    description: "Educational and training applications",
    
    useCases: {
      // Educational content
      educationalContent: {
        title: "Educational Content Creation",
        description: "Create animated educational materials and training videos",
        examples: [
          {
            scenario: "Science demonstration",
            prompt: "Scientist explaining chemical reaction, pointing at elements, clear gestures, laboratory setting with equipment",
            useCase: "STEM education, online courses, educational videos"
          },
          {
            scenario: "Language learning",
            prompt: "Person speaking clearly, mouth movements visible, gestures for emphasis, clean background for focus",
            useCase: "Language learning apps, pronunciation guides, educational content"
          }
        ],
        benefits: [
          "Clear visual communication",
          "Consistent educational quality",
          "Cost-effective content production"
        ]
      },

      // Corporate training
      corporateTraining: {
        title: "Corporate Training",
        description: "Create training materials for corporate environments",
        examples: [
          {
            scenario: "Safety training",
            prompt: "Person demonstrating safety procedures, clear step-by-step movements, professional workplace setting",
            useCase: "Workplace safety training, compliance education, HR training"
          },
          {
            scenario: "Software training",
            prompt: "Person using computer interface, pointing at screen elements, clear hand movements, professional office setting",
            useCase: "Software training, digital literacy, technical education"
          }
        ],
        benefits: [
          "Standardized training delivery",
          "Professional presentation quality",
          "Scalable training content"
        ]
      }
    }
  },

  // ============================================================================
  // REAL ESTATE & ARCHITECTURE
  // ============================================================================
  
  realEstateArchitecture: {
    description: "Real estate and architectural visualization",
    
    useCases: {
      // Property showcasing
      propertyShowcasing: {
        title: "Property Showcasing",
        description: "Animate properties for real estate marketing",
        examples: [
          {
            scenario: "Luxury home tour",
            prompt: "Elegant home interior, camera gliding through rooms, natural lighting, showcasing architectural features",
            useCase: "Luxury real estate, high-end property marketing, virtual tours"
          },
          {
            scenario: "Commercial space",
            prompt: "Modern office space, professional lighting, camera movement highlighting design elements, business atmosphere",
            useCase: "Commercial real estate, office space marketing, business property sales"
          }
        ],
        benefits: [
          "Dynamic property presentation",
          "Cost-effective virtual tours",
          "Professional marketing materials"
        ]
      },

      // Architectural visualization
      architecturalVisualization: {
        title: "Architectural Visualization",
        description: "Visualize architectural designs and concepts",
        examples: [
          {
            scenario: "Building design showcase",
            prompt: "Modern architectural structure, camera orbiting to show all angles, dramatic lighting, showcasing design details",
            useCase: "Architectural presentations, design competitions, client presentations"
          },
          {
            scenario: "Urban planning",
            prompt: "Cityscape with buildings, camera movement showing urban layout, environmental elements, planning visualization",
            useCase: "Urban planning, city development, infrastructure projects"
          }
        ],
        benefits: [
          "Realistic design visualization",
          "Client communication tool",
          "Design iteration support"
        ]
      }
    }
  },

  // ============================================================================
  // HEALTHCARE & MEDICAL
  // ============================================================================
  
  healthcareMedical: {
    description: "Healthcare and medical applications",
    
    useCases: {
      // Medical education
      medicalEducation: {
        title: "Medical Education",
        description: "Create educational content for medical training",
        examples: [
          {
            scenario: "Surgical procedure",
            prompt: "Medical professional demonstrating procedure, precise hand movements, sterile environment, educational focus",
            useCase: "Medical training, surgical education, healthcare professional development"
          },
          {
            scenario: "Patient interaction",
            prompt: "Healthcare provider interacting with patient, compassionate gestures, professional medical setting",
            useCase: "Communication training, patient care education, medical professionalism"
          }
        ],
        benefits: [
          "Standardized medical training",
          "Professional presentation quality",
          "Cost-effective educational content"
        ]
      },

      // Health awareness
      healthAwareness: {
        title: "Health Awareness Campaigns",
        description: "Create content for health awareness and public health campaigns",
        examples: [
          {
            scenario: "Exercise demonstration",
            prompt: "Person demonstrating proper exercise form, clear movements, fitness environment, motivational atmosphere",
            useCase: "Public health campaigns, fitness education, wellness programs"
          },
          {
            scenario: "Healthy lifestyle",
            prompt: "Person preparing healthy meal, natural cooking movements, clean kitchen environment, positive lifestyle",
            useCase: "Nutrition education, healthy living campaigns, wellness marketing"
          }
        ],
        benefits: [
          "Clear health communication",
          "Positive lifestyle representation",
          "Engaging public health content"
        ]
      }
    }
  },

  // ============================================================================
  // GAMING & INTERACTIVE MEDIA
  // ============================================================================
  
  gamingInteractiveMedia: {
    description: "Gaming and interactive media applications",
    
    useCases: {
      // Character animation
      characterAnimation: {
        title: "Game Character Animation",
        description: "Animate characters for games and interactive experiences",
        examples: [
          {
            scenario: "Fantasy warrior",
            prompt: "Fantasy warrior character, combat stance, weapon movements, magical effects, dramatic lighting",
            useCase: "RPG games, fantasy games, character development"
          },
          {
            scenario: "Casual game character",
            prompt: "Friendly character doing cheerful actions, bright colors, playful movements, engaging personality",
            useCase: "Mobile games, casual gaming, character-based games"
          }
        ],
        benefits: [
          "Cost-effective character animation",
          "Quick iteration for game development",
          "Professional quality results"
        ]
      },

      // Environmental storytelling
      environmentalStorytelling: {
        title: "Environmental Storytelling",
        description: "Create atmospheric environments for games",
        examples: [
          {
            scenario: "Mystical forest",
            prompt: "Enchanted forest with magical elements, floating particles, atmospheric lighting, mysterious atmosphere",
            useCase: "Fantasy games, adventure games, atmospheric design"
          },
          {
            scenario: "Urban environment",
            prompt: "Modern city street, dynamic lighting, urban atmosphere, realistic environmental details",
            useCase: "Urban games, realistic environments, city-based games"
          }
        ],
        benefits: [
          "Atmospheric game environments",
          "Cost-effective environmental design",
          "Immersive gaming experiences"
        ]
      }
    }
  }
};

// ============================================================================
// IMPLEMENTATION FUNCTIONS
// ============================================================================

export const veo3FastIndustryImplementation = {

  // Film & Entertainment
  generateFilmContent: async (apiKey: string, imageUrl: string, sceneType: string) => {
    const executor = new FalAiVeo3FastImageToVideoExecutor(apiKey);
    
    const prompts = {
      actionSequence: "Dynamic action sequence with hero character, dramatic camera movement, intense lighting with shadows and highlights, cinematic quality",
      dialogueScene: "Two characters in natural conversation, realistic gestures and expressions, subtle camera movement, professional lighting",
      fantasyTransformation: "Mystical character transformation, magical energy effects, dramatic lighting changes, epic cinematic quality"
    };
    
    return await executor.generateVideo({
      prompt: prompts[sceneType] || prompts.actionSequence,
      image_url: imageUrl,
      aspect_ratio: "16:9",
      duration: "8s",
      generate_audio: true,
      resolution: "1080p"
    });
  },

  // Advertising & Marketing
  generateAdContent: async (apiKey: string, imageUrl: string, productType: string) => {
    const executor = new FalAiVeo3FastImageToVideoExecutor(apiKey);
    
    const prompts = {
      luxuryCar: "Sleek luxury car in professional showroom, smooth camera orbit highlighting design features, premium lighting with reflections",
      electronics: "Smartphone rotating to showcase all angles, screen interface activation, professional presentation lighting",
      fashion: "Model wearing designer clothing, elegant movements showcasing garment details, professional runway lighting"
    };
    
    return await executor.generateVideo({
      prompt: prompts[productType] || prompts.electronics,
      image_url: imageUrl,
      aspect_ratio: "16:9",
      duration: "8s",
      generate_audio: true,
      resolution: "1080p"
    });
  },

  // Education & Training
  generateEducationalContent: async (apiKey: string, imageUrl: string, subjectType: string) => {
    const executor = new FalAiVeo3FastImageToVideoExecutor(apiKey);
    
    const prompts = {
      science: "Scientist explaining concept, clear gestures and pointing, laboratory setting, educational focus",
      language: "Person speaking clearly, visible mouth movements, gestures for emphasis, clean educational background",
      safety: "Person demonstrating safety procedures, clear step-by-step movements, professional workplace setting"
    };
    
    return await executor.generateVideo({
      prompt: prompts[subjectType] || prompts.science,
      image_url: imageUrl,
      aspect_ratio: "16:9",
      duration: "8s",
      generate_audio: true,
      resolution: "720p"
    });
  },

  // Real Estate & Architecture
  generatePropertyContent: async (apiKey: string, imageUrl: string, propertyType: string) => {
    const executor = new FalAiVeo3FastImageToVideoExecutor(apiKey);
    
    const prompts = {
      luxuryHome: "Elegant home interior, camera gliding through rooms, natural lighting, showcasing architectural features",
      commercialSpace: "Modern office space, professional lighting, camera movement highlighting design elements",
      architectural: "Modern architectural structure, camera orbiting to show all angles, dramatic lighting, design showcase"
    };
    
    return await executor.generateVideo({
      prompt: prompts[propertyType] || prompts.luxuryHome,
      image_url: imageUrl,
      aspect_ratio: "16:9",
      duration: "8s",
      generate_audio: false,
      resolution: "1080p"
    });
  },

  // Healthcare & Medical
  generateMedicalContent: async (apiKey: string, imageUrl: string, medicalType: string) => {
    const executor = new FalAiVeo3FastImageToVideoExecutor(apiKey);
    
    const prompts = {
      procedure: "Medical professional demonstrating procedure, precise hand movements, sterile environment, educational focus",
      interaction: "Healthcare provider interacting with patient, compassionate gestures, professional medical setting",
      exercise: "Person demonstrating proper exercise form, clear movements, fitness environment, motivational atmosphere"
    };
    
    return await executor.generateVideo({
      prompt: prompts[medicalType] || prompts.procedure,
      image_url: imageUrl,
      aspect_ratio: "16:9",
      duration: "8s",
      generate_audio: true,
      resolution: "720p"
    });
  },

  // Gaming & Interactive Media
  generateGameContent: async (apiKey: string, imageUrl: string, gameType: string) => {
    const executor = new FalAiVeo3FastImageToVideoExecutor(apiKey);
    
    const prompts = {
      fantasy: "Fantasy warrior character, combat stance, weapon movements, magical effects, dramatic lighting",
      casual: "Friendly character doing cheerful actions, bright colors, playful movements, engaging personality",
      environment: "Enchanted forest with magical elements, floating particles, atmospheric lighting, mysterious atmosphere"
    };
    
    return await executor.generateVideo({
      prompt: prompts[gameType] || prompts.fantasy,
      image_url: imageUrl,
      aspect_ratio: "16:9",
      duration: "8s",
      generate_audio: true,
      resolution: "720p"
    });
  }
};

// ============================================================================
// COST OPTIMIZATION BY INDUSTRY
// ============================================================================

export const industryCostOptimization = {
  
  // High-budget industries (can afford premium quality)
  premiumIndustries: {
    industries: ["Film & Entertainment", "Luxury Advertising", "High-end Real Estate"],
    recommendations: {
      resolution: "1080p",
      audio: true,
      aspectRatio: "16:9",
      reasoning: "Quality is paramount for premium brands and high-budget productions"
    }
  },

  // Cost-conscious industries
  costConsciousIndustries: {
    industries: ["Education", "Healthcare", "Small Business Marketing"],
    recommendations: {
      resolution: "720p",
      audio: false,
      aspectRatio: "auto",
      reasoning: "Cost efficiency is important while maintaining professional quality"
    }
  },

  // Social media focused industries
  socialMediaIndustries: {
    industries: ["Social Media Marketing", "Influencer Content", "Viral Marketing"],
    recommendations: {
      resolution: "720p",
      audio: true,
      aspectRatio: "9:16",
      reasoning: "Optimized for mobile viewing and social media platforms"
    }
  }
};

export default veo3FastIndustryUseCases;
