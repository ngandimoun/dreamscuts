/**
 * Veo 3 Fast Prompt Templates
 * 
 * Comprehensive library of reusable prompt templates for Google Veo 3 Fast
 * and fal-ai/veo3/fast/image-to-video, based on professional video production
 * techniques and real-world usage patterns.
 */

// ============================================================================
// CINEMATIC PROMPT TEMPLATES
// ============================================================================

export const cinematicPromptTemplates = {

  // ============================================================================
  // SHOT COMPOSITION TEMPLATES
  // ============================================================================
  
  shotComposition: {
    // Wide establishing shots
    wideEstablishing: {
      template: "Wide establishing shot of {subject} in {environment}, {camera_movement}, {lighting_condition}, {atmospheric_elements}",
      variables: {
        subject: ["landscape", "cityscape", "building", "character", "vehicle"],
        environment: ["mountain peak", "urban street", "forest", "beach", "desert"],
        camera_movement: ["slow dolly in", "smooth pan", "static tripod", "crane descent"],
        lighting_condition: ["golden hour", "dramatic shadows", "soft natural light", "cinematic lighting"],
        atmospheric_elements: ["floating particles", "mist", "dust motes", "volumetric light"]
      },
      example: "Wide establishing shot of vintage car in redwood forest, slow dolly in, golden hour lighting, floating dust motes"
    },

    // Medium shots
    mediumShot: {
      template: "Medium shot of {subject} {action}, {camera_position}, {focus_technique}, {background_elements}",
      variables: {
        subject: ["person", "character", "product", "animal"],
        action: ["speaking", "gesturing", "demonstrating", "performing"],
        camera_position: ["eye level", "slightly above", "slightly below", "over shoulder"],
        focus_technique: ["shallow depth of field", "rack focus", "sharp throughout", "selective focus"],
        background_elements: ["blurred background", "bokeh effects", "environmental context", "clean backdrop"]
      },
      example: "Medium shot of person speaking, eye level, shallow depth of field, blurred background"
    },

    // Close-up shots
    closeUp: {
      template: "Close-up of {subject} {detail}, {camera_movement}, {lighting_setup}, {texture_focus}",
      variables: {
        subject: ["face", "hands", "product", "object"],
        detail: ["expressions", "movements", "features", "textures"],
        camera_movement: ["static", "subtle push-in", "slight tilt", "micro movements"],
        lighting_setup: ["key light", "rim lighting", "soft fill", "dramatic shadows"],
        texture_focus: ["skin texture", "material details", "surface quality", "fine details"]
      },
      example: "Close-up of face expressions, subtle push-in, key light, skin texture"
    }
  },

  // ============================================================================
  // CAMERA MOVEMENT TEMPLATES
  // ============================================================================
  
  cameraMovement: {
    // Tracking shots
    trackingShot: {
      template: "Tracking shot following {subject} {movement}, {camera_speed}, {stabilization}, {background_motion}",
      variables: {
        subject: ["character", "vehicle", "object", "person"],
        movement: ["walking", "running", "driving", "moving"],
        camera_speed: ["smooth and steady", "dynamic and fast", "slow and deliberate", "variable speed"],
        stabilization: ["gimbal smooth", "handheld organic", "dolly smooth", "drone cinematic"],
        background_motion: ["parallax effect", "motion blur", "sharp background", "environmental movement"]
      },
      example: "Tracking shot following character walking, smooth and steady, gimbal smooth, parallax effect"
    },

    // Orbital shots
    orbitalShot: {
      template: "Orbital shot around {subject}, {orbit_speed}, {orbit_radius}, {lighting_changes}",
      variables: {
        subject: ["character", "object", "building", "vehicle"],
        orbit_speed: ["slow and majestic", "medium pace", "fast and dynamic", "variable speed"],
        orbit_radius: ["tight orbit", "medium distance", "wide orbit", "changing radius"],
        lighting_changes: ["consistent lighting", "dramatic lighting shifts", "rim lighting", "shadow play"]
      },
      example: "Orbital shot around character, slow and majestic, medium distance, dramatic lighting shifts"
    },

    // Crane shots
    craneShot: {
      template: "Crane shot {direction} from {start_position} to {end_position}, {movement_speed}, {reveal_effect}",
      variables: {
        direction: ["ascending", "descending", "lateral", "diagonal"],
        start_position: ["ground level", "medium height", "high above", "close proximity"],
        end_position: ["high above", "ground level", "medium height", "distant view"],
        movement_speed: ["slow and smooth", "medium pace", "fast and dramatic", "variable speed"],
        reveal_effect: ["gradual reveal", "dramatic reveal", "contextual reveal", "surprise reveal"]
      },
      example: "Crane shot descending from high above to ground level, slow and smooth, dramatic reveal"
    }
  },

  // ============================================================================
  // LIGHTING TEMPLATES
  // ============================================================================
  
  lighting: {
    // Natural lighting
    naturalLighting: {
      template: "Natural {light_source} lighting, {time_of_day}, {weather_condition}, {light_quality}",
      variables: {
        light_source: ["sunlight", "moonlight", "starlight", "firelight"],
        time_of_day: ["golden hour", "blue hour", "midday", "midnight"],
        weather_condition: ["clear sky", "overcast", "stormy", "misty"],
        light_quality: ["soft and diffused", "harsh and direct", "dramatic shadows", "even illumination"]
      },
      example: "Natural sunlight lighting, golden hour, clear sky, soft and diffused"
    },

    // Cinematic lighting
    cinematicLighting: {
      template: "Cinematic {lighting_style} with {key_light}, {fill_light}, {back_light}, {atmosphere}",
      variables: {
        lighting_style: ["three-point lighting", "chiaroscuro", "high key", "low key"],
        key_light: ["warm key", "cool key", "hard key", "soft key"],
        fill_light: ["subtle fill", "strong fill", "colored fill", "no fill"],
        back_light: ["rim lighting", "hair light", "separation light", "atmospheric light"],
        atmosphere: ["volumetric fog", "dust particles", "smoke", "clean air"]
      },
      example: "Cinematic three-point lighting with warm key, subtle fill, rim lighting, volumetric fog"
    },

    // Special lighting effects
    specialLighting: {
      template: "Special lighting with {effect_type}, {color_temperature}, {intensity}, {movement}",
      variables: {
        effect_type: ["neon glow", "fire effects", "magical aura", "practical lights"],
        color_temperature: ["warm (3000K)", "cool (6000K)", "mixed", "colorful"],
        intensity: ["subtle", "moderate", "bright", "dramatic"],
        movement: ["static", "flickering", "pulsing", "moving"]
      },
      example: "Special lighting with magical aura, warm (3000K), moderate, pulsing"
    }
  },

  // ============================================================================
  // CHARACTER ANIMATION TEMPLATES
  // ============================================================================
  
  characterAnimation: {
    // Facial expressions
    facialExpressions: {
      template: "Character with {expression} expression, {eye_movement}, {mouth_action}, {head_movement}",
      variables: {
        expression: ["joyful", "serious", "surprised", "contemplative", "determined"],
        eye_movement: ["direct eye contact", "looking away", "blinking naturally", "wide-eyed"],
        mouth_action: ["speaking clearly", "smiling", "lips slightly parted", "mouth closed"],
        head_movement: ["nodding", "shaking head", "tilting", "steady"]
      },
      example: "Character with joyful expression, direct eye contact, speaking clearly, nodding"
    },

    // Body movements
    bodyMovements: {
      template: "Character {body_action} with {gesture_type}, {posture}, {movement_quality}",
      variables: {
        body_action: ["walking", "standing", "sitting", "gesturing", "demonstrating"],
        gesture_type: ["pointing", "waving", "clapping", "reaching", "holding"],
        posture: ["confident", "relaxed", "alert", "casual", "professional"],
        movement_quality: ["smooth and natural", "deliberate", "energetic", "graceful"]
      },
      example: "Character walking with pointing, confident, smooth and natural"
    },

    // Emotional states
    emotionalStates: {
      template: "Character showing {emotion} through {physical_expression}, {breathing_pattern}, {overall_mood}",
      variables: {
        emotion: ["happiness", "sadness", "anger", "fear", "surprise", "disgust"],
        physical_expression: ["facial expression", "body language", "gestures", "posture"],
        breathing_pattern: ["calm breathing", "heavy breathing", "shallow breathing", "steady breathing"],
        overall_mood: ["uplifting", "melancholic", "intense", "peaceful", "energetic"]
      },
      example: "Character showing happiness through facial expression, calm breathing, uplifting"
    }
  },

  // ============================================================================
  // ENVIRONMENTAL EFFECTS TEMPLATES
  // ============================================================================
  
  environmentalEffects: {
    // Weather effects
    weatherEffects: {
      template: "Environmental {weather_type} with {intensity}, {particle_effects}, {atmospheric_impact}",
      variables: {
        weather_type: ["rain", "snow", "fog", "wind", "storm", "sunshine"],
        intensity: ["light", "moderate", "heavy", "extreme"],
        particle_effects: ["visible droplets", "snowflakes", "dust particles", "leaves"],
        atmospheric_impact: ["moody atmosphere", "dramatic lighting", "visibility changes", "texture enhancement"]
      },
      example: "Environmental rain with moderate, visible droplets, moody atmosphere"
    },

    // Natural elements
    naturalElements: {
      template: "Natural {element_type} with {movement_pattern}, {texture_detail}, {interaction_effect}",
      variables: {
        element_type: ["water", "fire", "earth", "air", "plants", "rocks"],
        movement_pattern: ["flowing", "swaying", "drifting", "falling", "rising"],
        texture_detail: ["smooth", "rough", "crystalline", "organic", "metallic"],
        interaction_effect: ["reflection", "refraction", "shadow casting", "light scattering"]
      },
      example: "Natural water with flowing, smooth, reflection"
    },

    // Magical effects
    magicalEffects: {
      template: "Magical {effect_type} with {color_scheme}, {movement_style}, {energy_level}",
      variables: {
        effect_type: ["energy aura", "particle burst", "transformation", "teleportation"],
        color_scheme: ["golden", "blue", "purple", "rainbow", "white"],
        movement_style: ["swirling", "pulsing", "flowing", "exploding", "orbiting"],
        energy_level: ["subtle", "moderate", "intense", "overwhelming"]
      },
      example: "Magical energy aura with golden, swirling, moderate"
    }
  },

  // ============================================================================
  // AUDIO DESIGN TEMPLATES
  // ============================================================================
  
  audioDesign: {
    // Music styles
    musicStyles: {
      template: "Music with {genre} style, {tempo}, {instrumentation}, {emotional_tone}",
      variables: {
        genre: ["orchestral", "electronic", "ambient", "cinematic", "minimalist"],
        tempo: ["slow and contemplative", "moderate pace", "upbeat", "variable tempo"],
        instrumentation: ["strings and brass", "synthesizers", "piano", "full orchestra"],
        emotional_tone: ["uplifting", "melancholic", "dramatic", "peaceful", "energetic"]
      },
      example: "Music with orchestral style, moderate pace, strings and brass, dramatic"
    },

    // Sound effects
    soundEffects: {
      template: "Sound effects including {primary_sfx}, {ambient_sfx}, {foley_sfx}, {mix_balance}",
      variables: {
        primary_sfx: ["character voice", "object sounds", "environmental sounds", "musical elements"],
        ambient_sfx: ["room tone", "atmospheric sounds", "background noise", "natural sounds"],
        foley_sfx: ["footsteps", "clothing rustle", "object handling", "breathing"],
        mix_balance: ["music prominent", "effects prominent", "balanced mix", "minimal mix"]
      },
      example: "Sound effects including character voice, atmospheric sounds, footsteps, balanced mix"
    },

    // Audio atmosphere
    audioAtmosphere: {
      template: "Audio atmosphere with {spatial_design}, {dynamic_range}, {frequency_balance}",
      variables: {
        spatial_design: ["stereo field", "surround sound", "mono focus", "spatial audio"],
        dynamic_range: ["wide dynamic range", "compressed", "natural dynamics", "controlled dynamics"],
        frequency_balance: ["full spectrum", "low-end heavy", "high-end bright", "mid-range focus"]
      },
      example: "Audio atmosphere with stereo field, wide dynamic range, full spectrum"
    }
  }
};

// ============================================================================
// INDUSTRY-SPECIFIC TEMPLATES
// ============================================================================

export const industrySpecificTemplates = {

  // ============================================================================
  // FILM & ENTERTAINMENT
  // ============================================================================
  
  filmEntertainment: {
    // Action sequences
    actionSequence: {
      template: "Action sequence with {hero_character} {action_type}, {camera_work}, {stunt_coordination}, {safety_measures}",
      variables: {
        hero_character: ["protagonist", "hero", "main character", "lead actor"],
        action_type: ["fighting", "chasing", "escaping", "rescuing", "confronting"],
        camera_work: ["dynamic tracking", "handheld intensity", "smooth gimbal", "drone aerial"],
        stunt_coordination: ["choreographed moves", "realistic physics", "dramatic timing", "safety protocols"],
        safety_measures: ["controlled environment", "professional stunt team", "safety equipment", "risk assessment"]
      }
    },

    // Dialogue scenes
    dialogueScene: {
      template: "Dialogue scene between {character_count} characters, {conversation_tone}, {blocking}, {emotional_arc}",
      variables: {
        character_count: ["two characters", "multiple characters", "group conversation", "monologue"],
        conversation_tone: ["intimate", "confrontational", "comedic", "dramatic", "philosophical"],
        blocking: ["static positioning", "dynamic movement", "proximity changes", "spatial relationships"],
        emotional_arc: ["building tension", "resolution", "conflict", "understanding", "transformation"]
      }
    }
  },

  // ============================================================================
  // ADVERTISING & MARKETING
  // ============================================================================
  
  advertisingMarketing: {
    // Product showcases
    productShowcase: {
      template: "Product showcase featuring {product_type}, {presentation_style}, {target_audience}, {brand_message}",
      variables: {
        product_type: ["luxury item", "tech gadget", "fashion piece", "food product", "service"],
        presentation_style: ["elegant", "energetic", "minimalist", "lifestyle", "technical"],
        target_audience: ["luxury consumers", "tech enthusiasts", "fashion forward", "health conscious"],
        brand_message: ["premium quality", "innovation", "style", "health", "convenience"]
      }
    },

    // Brand storytelling
    brandStorytelling: {
      template: "Brand story showing {narrative_arc}, {emotional_connection}, {visual_metaphors}, {call_to_action}",
      variables: {
        narrative_arc: ["transformation", "journey", "discovery", "achievement", "connection"],
        emotional_connection: ["aspiration", "nostalgia", "joy", "confidence", "belonging"],
        visual_metaphors: ["growth", "freedom", "success", "harmony", "innovation"],
        call_to_action: ["purchase", "learn more", "experience", "join", "discover"]
      }
    }
  },

  // ============================================================================
  // EDUCATION & TRAINING
  // ============================================================================
  
  educationTraining: {
    // Educational content
    educationalContent: {
      template: "Educational content explaining {subject_matter}, {teaching_method}, {visual_aids}, {learning_outcome}",
      variables: {
        subject_matter: ["scientific concept", "historical event", "mathematical principle", "language lesson"],
        teaching_method: ["demonstration", "explanation", "interactive", "visual", "step-by-step"],
        visual_aids: ["diagrams", "models", "charts", "animations", "real examples"],
        learning_outcome: ["understanding", "skill development", "knowledge retention", "application"]
      }
    },

    // Training materials
    trainingMaterials: {
      template: "Training material for {skill_type}, {difficulty_level}, {practical_application}, {assessment_method}",
      variables: {
        skill_type: ["technical skill", "soft skill", "safety procedure", "compliance training"],
        difficulty_level: ["beginner", "intermediate", "advanced", "expert"],
        practical_application: ["hands-on practice", "simulation", "real-world scenarios", "case studies"],
        assessment_method: ["knowledge test", "practical demonstration", "peer review", "self-assessment"]
      }
    }
  }
};

// ============================================================================
// PROMPT OPTIMIZATION TEMPLATES
// ============================================================================

export const promptOptimizationTemplates = {

  // ============================================================================
  // QUALITY ENHANCEMENT
  // ============================================================================
  
  qualityEnhancement: {
    // Technical quality
    technicalQuality: {
      template: "High-quality {resolution} video with {frame_rate}, {color_grading}, {post_processing}",
      variables: {
        resolution: ["4K", "1080p", "720p", "HD"],
        frame_rate: ["24fps cinematic", "30fps smooth", "60fps fluid", "variable frame rate"],
        color_grading: ["cinematic", "natural", "vibrant", "monochrome", "vintage"],
        post_processing: ["film grain", "lens flare", "depth of field", "motion blur", "sharpening"]
      }
    },

    // Artistic quality
    artisticQuality: {
      template: "Artistically {style} with {composition}, {mood}, {aesthetic_choices}",
      variables: {
        style: ["cinematic", "documentary", "commercial", "artistic", "experimental"],
        composition: ["rule of thirds", "golden ratio", "symmetrical", "asymmetrical", "dynamic"],
        mood: ["dramatic", "peaceful", "energetic", "mysterious", "uplifting"],
        aesthetic_choices: ["color palette", "lighting style", "texture focus", "movement quality"]
      }
    }
  },

  // ============================================================================
  // COST OPTIMIZATION
  // ============================================================================
  
  costOptimization: {
    // Budget-friendly options
    budgetFriendly: {
      template: "Cost-effective {quality_level} with {optimization_techniques}, {efficiency_focus}",
      variables: {
        quality_level: ["good quality", "professional quality", "broadcast quality", "cinema quality"],
        optimization_techniques: ["720p resolution", "no audio", "auto aspect ratio", "batch processing"],
        efficiency_focus: ["fast processing", "minimal iterations", "template reuse", "automated workflows"]
      }
    },

    // Premium options
    premiumOptions: {
      template: "Premium {quality_tier} with {advanced_features}, {professional_standards}",
      variables: {
        quality_tier: ["4K resolution", "HDR color", "professional audio", "cinema quality"],
        advanced_features: ["custom aspect ratios", "high frame rates", "advanced post-processing", "professional grading"],
        professional_standards: ["broadcast ready", "cinema ready", "commercial grade", "award quality"]
      }
    }
  }
};

// ============================================================================
// TEMPLATE USAGE FUNCTIONS
// ============================================================================

export const templateUsageFunctions = {

  // Generate prompt from template
  generatePromptFromTemplate: (template: string, variables: Record<string, string>): string => {
    let prompt = template;
    
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{${key}}`;
      prompt = prompt.replace(new RegExp(placeholder, 'g'), value);
    }
    
    return prompt;
  },

  // Get random variable from template
  getRandomVariable: (variableArray: string[]): string => {
    return variableArray[Math.floor(Math.random() * variableArray.length)];
  },

  // Generate random prompt from template
  generateRandomPrompt: (template: any): string => {
    let prompt = template.template;
    
    for (const [key, value] of Object.entries(template.variables)) {
      if (Array.isArray(value)) {
        const randomValue = getRandomVariable(value);
        prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), randomValue);
      }
    }
    
    return prompt;
  },

  // Validate template variables
  validateTemplateVariables: (template: string, variables: Record<string, string>): boolean => {
    const placeholders = template.match(/{[^}]+}/g) || [];
    const providedKeys = Object.keys(variables);
    
    return placeholders.every(placeholder => {
      const key = placeholder.slice(1, -1);
      return providedKeys.includes(key);
    });
  }
};

export default {
  cinematicPromptTemplates,
  industrySpecificTemplates,
  promptOptimizationTemplates,
  templateUsageFunctions
};
