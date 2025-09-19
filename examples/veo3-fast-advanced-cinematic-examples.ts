/**
 * Veo 3 Fast Advanced Cinematic Examples
 * 
 * This file contains sophisticated cinematic examples showcasing advanced
 * prompting techniques for Google Veo 3 Fast and fal-ai/veo3/fast/image-to-video.
 * Based on real-world usage patterns and professional video production techniques.
 */

import { FalAiVeo3FastImageToVideoExecutor } from '../executors/fal-ai-veo3-fast-image-to-video';

// ============================================================================
// CINEMATIC PROMPT STRUCTURES
// ============================================================================

export interface CinematicPromptStructure {
  shot: {
    type: 'single' | 'tracking' | 'crane' | 'drone' | 'macro';
    camera_motion: string;
    lens: string;
    aperture: string;
    frame_rate?: string;
    film_grain?: number;
  };
  subject: {
    character?: string;
    pose?: string;
    expression?: string;
    wardrobe_motion?: string;
  };
  scene: {
    environment: string;
    hero_prop?: string;
    fx?: string[];
    time_of_day: string;
  };
  visual_details: {
    beats: Array<{
      time: string;
      action: string;
      focus: string;
    }>;
  };
  cinematography: {
    lens: string;
    framing: string;
    exposure: string;
    post: string;
  };
  audio: {
    fx?: string[];
    music: string;
    ambient?: string;
    mix_level?: string;
  };
  color_palette: {
    primary: string;
    secondary: string;
    accents?: string;
    background: string;
  };
  negative_prompt?: string[];
}

// ============================================================================
// ADVANCED CINEMATIC EXAMPLES
// ============================================================================

export const veo3FastAdvancedCinematicExamples = {

  // Goddess Ritual Scene - Based on your sophisticated example
  goddessRitual: {
    description: "Sacred ritual scene with golden light arc and mystical atmosphere",
    prompt: {
      shot: {
        type: 'single',
        camera_motion: 'slow top-down crane descend with subtle push-in (no cuts)',
        lens: 'portrait 65–85mm feel, shallow depth (f/2.0)',
        frame_rate: '24fps',
        film_grain: 0.02
      },
      subject: {
        character: 'blonde woman with a single back braid, wearing a flowing black evening dress with thigh-high slit; barefoot; goddess-ritual vibe',
        pose: 'arms outstretched overhead touching a luminous golden arc; head bowed slightly',
        expression: 'calm, reverent focus',
        wardrobe_motion: 'fabric breathes gently; hem sways from faint updraft'
      },
      scene: {
        environment: 'black void stage with sparse floating dust motes',
        hero_prop: 'crescent-like golden light arc above her hands (liquid-light ribbon)',
        fx: ['soft volumetric glow', 'micro-particle drift', 'subtle heat shimmer near arc'],
        time_of_day: 'timeless night'
      },
      visual_details: {
        beats: [
          {
            time: '0.0-2.4',
            action: 'Camera descends from above; subject silhouette resolves; dormant gold arc begins to glimmer as hands make contact.',
            focus: 'top-down framing, shoulders and braid highlighted'
          },
          {
            time: '2.4-5.4',
            action: 'Arc brightens and bends smoothly into a perfect crescent; light blooms along her arms; dust motes orbit slowly.',
            focus: 'rim highlights on skin; gentle lens bloom on the arc'
          },
          {
            time: '5.4-8.0',
            action: 'She rises a few centimeters (levitation hint) while arc hums and stabilizes; fabric lifts softly; camera finishes push-in and settles for loop.',
            focus: 'hero tableau centered; clean negative space around figure'
          }
        ]
      },
      cinematography: {
        lens: 'portrait 65–85mm feel, shallow depth (f/2.0)',
        framing: 'centered vertical figure; arc sits just above frame midline; low key with strong speculars',
        exposure: 'protect highlights on arc, maintain true blacks; mild roll-off on skin',
        post: 'cinematic contrast; glow bloom on arc; very light film grain; negligible chromatic aberration'
      },
      audio: {
        fx: [
          'low airy shimmer tied to the arc brightness',
          'soft cloth rustle on levitation',
          'sub-bass swell at 5.4s'
        ],
        music: 'minimal drone in D minor, barely rising toward the final hold',
        ambient: 'whistling mountain wind',
        mix_level: 'cinematic mix with music leading, effects supporting'
      },
      color_palette: {
        primary: 'molten gold (#F5C76A)',
        secondary: 'amber highlights (#D69B3A)',
        accents: 'skin neutrals with warm rim',
        background: 'pure black (#000000)'
      },
      negative_prompt: [
        'cartoonish rendering',
        'overexposed arc clipping',
        'banding or posterization in blacks',
        'extra limbs or finger artifacts',
        'busy background',
        'harsh color shifts (green, magenta)'
      ]
    },
    expectedResult: "Sacred, poised, ascendant mood with seamless loop for autoplay"
  },

  // Vintage Car Journey - Redwood Forest
  vintageCarJourney: {
    description: "Cinematic tracking shot of vintage car through redwood forest",
    prompt: {
      shot: {
        type: 'tracking',
        camera_motion: 'fixed position just behind and slightly to the left of the car',
        lens: 'wide-angle cinematic lens',
        aperture: 'f/4.0',
        frame_rate: '24fps'
      },
      subject: {
        character: 'pristine, vintage turquoise Volkswagen Beetle',
        pose: 'gliding smoothly down narrow, sun-dappled asphalt road',
        expression: 'classic automotive elegance'
      },
      scene: {
        environment: 'towering, ancient redwood trees with massive, deeply furrowed trunks',
        fx: ['sunlight filtering through canopy', 'dynamic light and shadow patterns'],
        time_of_day: 'midday with clear blue sky'
      },
      visual_details: {
        beats: [
          {
            time: '0.0-8.0',
            action: 'Car glides smoothly along winding road, sunlight creates shifting patterns, redwoods tower on both sides',
            focus: 'iconic rear design of Beetle, individual needles on redwood branches, crystalline snow structure'
          }
        ]
      },
      cinematography: {
        lens: 'wide-angle cinematic lens',
        framing: 'tracking shot showcasing car and surrounding redwood environment',
        exposure: 'natural daylight with strong contrast between light and shadow',
        post: 'hyper-realistic rendering with enhanced detail in every element'
      },
      audio: {
        fx: [
          'gentle hum of Beetle engine',
          'soft crunch of tires on asphalt',
          'distant whisper of wind through colossal trees'
        ],
        music: 'serene and timeless orchestral atmosphere',
        ambient: 'crisp, cool air with faint mist rising from melting snow'
      },
      color_palette: {
        primary: 'vibrant turquoise (#40E0D0)',
        secondary: 'deep forest green (#228B22)',
        accents: 'glinting sunlight reflections',
        background: 'clear brilliant blue sky (#87CEEB)'
      },
      negative_prompt: [
        'low resolution details',
        'unnatural lighting',
        'poor texture quality',
        'distracting elements'
      ]
    },
    expectedResult: "Serene and timeless atmosphere with perfect automotive and nature detail"
  },

  // Dragon Transformation - Epic Fantasy
  dragonTransformation: {
    description: "Epic fantasy scene with baby dragon transforming into armored beast",
    prompt: {
      shot: {
        type: 'wide',
        camera_motion: 'slow dolly in',
        lens: '50mm',
        frame_rate: '24fps'
      },
      subject: {
        character: 'young, realistic baby dragon with soft scales and small wings',
        pose: 'roars silently as body elongates and wings expand',
        expression: 'powerful transformation with determination'
      },
      scene: {
        environment: 'rocky mountain peak above the clouds',
        fx: ['flames swirl around feet', 'golden light bursts from chest', 'ancient magical runes circle body'],
        time_of_day: 'dusk with dramatic lighting'
      },
      visual_details: {
        beats: [
          {
            time: '0.0-2.4',
            action: 'Baby dragon roars silently, scales begin to harden',
            focus: 'close-up on facial features and initial transformation'
          },
          {
            time: '2.4-5.4',
            action: 'Body elongates, wings expand dramatically, scales transform into armor-like plates',
            focus: 'wing expansion and scale transformation detail'
          },
          {
            time: '5.4-8.0',
            action: 'Transformation completes, dragon rises with newfound power, magical runes fade',
            focus: 'full transformed dragon in epic pose'
          }
        ]
      },
      cinematography: {
        lens: '50mm portrait lens',
        framing: 'centered vertical figure with epic mountain backdrop',
        exposure: 'dramatic side-lighting with glowing dusk highlights and backlit silhouette',
        post: 'cinematic contrast with strong specular highlights on armor'
      },
      audio: {
        fx: [
          'rumbling ground',
          'crackling fire',
          'magical resonance',
          'wing expansion sounds'
        ],
        music: 'swelling orchestral score with choir and horns',
        ambient: 'whistling mountain wind',
        mix_level: 'cinematic mix with music leading, effects supporting'
      },
      color_palette: {
        primary: 'molten gold (#F5C76A)',
        secondary: 'deep blues (#1E3A8A)',
        accents: 'fiery oranges (#FF4500)',
        background: 'mountain peak silhouette (#2D3748)'
      },
      negative_prompt: [
        'cartoonish rendering',
        'poor scale detail',
        'unrealistic proportions',
        'low fantasy quality'
      ]
    },
    expectedResult: "Epic and awe-inspiring transformation with cinematic quality"
  },

  // Luxury Car Formation - Futuristic Commercial
  luxuryCarFormation: {
    description: "Futuristic luxury car forming from liquid metal in minimalist environment",
    prompt: {
      shot: {
        type: 'macro',
        camera_motion: 'macro to wide orbital pull-back and orbit',
        lens: '85mm Macro to 35mm Prime (Virtual Lens Change)',
        aperture: 'f/1.8 transitioning to f/5.6',
        frame_rate: '24fps'
      },
      subject: {
        character: 'sleek, futuristic, all-electric concept sports car',
        pose: 'forming from liquid metal sphere',
        expression: 'sophisticated and powerful'
      },
      scene: {
        environment: 'minimalist, infinite virtual studio with perfectly polished black obsidian floor',
        fx: ['liquid metal flowing', 'blue energy wireframe', 'LED light activation'],
        time_of_day: 'timeless void'
      },
      visual_details: {
        beats: [
          {
            time: '0.0-2.0',
            action: 'Liquid metal sphere slowly pulses, surface rippling as if reacting to low-frequency sound',
            focus: 'extreme close-up on mercury-like drop with surface tension ripples'
          },
          {
            time: '2.1-5.0',
            action: 'Sphere violently expands and splashes outwards in zero-gravity, tendrils extend to form wireframe',
            focus: 'wireframe formation with blue energy traces'
          },
          {
            time: '5.1-7.0',
            action: 'Liquid metal flows over energy wireframe, solidifying into smooth body panels',
            focus: 'metallic flow and solidification process'
          },
          {
            time: '7.1-8.0',
            action: 'Car fully formed, LED headlights and taillights flash on with clean pulse, settles gently',
            focus: 'final reveal with sharp LED activation'
          }
        ]
      },
      cinematography: {
        lens: '85mm Macro to 35mm Prime',
        framing: 'starts extreme close-up, ends with grand sweeping reveal',
        exposure: 'clean, high-contrast lighting with strong specular highlights',
        post: 'high-end commercial quality with perfect reflections'
      },
      audio: {
        fx: [
          'deep, low-frequency bass hum matching pulsing',
          'sharp, reversed whoosh as sphere expands',
          'high-tech electronic chimes and crackles',
          'clean, powerful thump synchronized with lights'
        ],
        music: 'modern, electronic, and impactful',
        ambient: 'faint, clean, high-tech hum of electric vehicle'
      },
      color_palette: {
        primary: 'deep gloss black with pearlescent finish',
        secondary: 'electric blue accent (#00BFFF)',
        accents: 'silvery white liquid metal',
        background: 'pure black void (#000000)'
      },
      negative_prompt: [
        'grainy reflections',
        'poor metallic quality',
        'inconsistent lighting',
        'low commercial quality'
      ]
    },
    expectedResult: "Futuristic, sleek, powerful, magical, and sophisticated commercial quality"
  }
};

// ============================================================================
// USAGE FUNCTIONS
// ============================================================================

export const veo3FastAdvancedUsageExamples = {

  // Generate goddess ritual scene
  generateGoddessRitual: async (apiKey: string, imageUrl: string) => {
    const executor = new FalAiVeo3FastImageToVideoExecutor(apiKey);
    
    const prompt = "A blonde woman with flowing black evening dress, arms outstretched touching a luminous golden arc, camera descends slowly from above, arc brightens and forms perfect crescent, she rises slightly with fabric flowing, sacred ritual atmosphere with golden light and mystical particles";
    
    return await executor.generateVideo({
      prompt,
      image_url: imageUrl,
      aspect_ratio: "auto",
      duration: "8s",
      generate_audio: true,
      resolution: "1080p"
    });
  },

  // Generate vintage car journey
  generateVintageCarJourney: async (apiKey: string, imageUrl: string) => {
    const executor = new FalAiVeo3FastImageToVideoExecutor(apiKey);
    
    const prompt = "Pristine vintage turquoise Volkswagen Beetle gliding smoothly down sun-dappled asphalt road through towering ancient redwood trees, camera tracking behind and left, sunlight filtering through canopy creating dynamic light patterns, hyper-realistic detail in car and nature";
    
    return await executor.generateVideo({
      prompt,
      image_url: imageUrl,
      aspect_ratio: "16:9",
      duration: "8s",
      generate_audio: true,
      resolution: "1080p"
    });
  },

  // Generate dragon transformation
  generateDragonTransformation: async (apiKey: string, imageUrl: string) => {
    const executor = new FalAiVeo3FastImageToVideoExecutor(apiKey);
    
    const prompt = "Baby dragon on rocky mountain peak, roars silently as body elongates and wings expand dramatically, scales harden into gleaming armor plates, flames swirl around feet, golden light bursts from chest, ancient magical runes circle body, epic cinematic quality";
    
    return await executor.generateVideo({
      prompt,
      image_url: imageUrl,
      aspect_ratio: "16:9",
      duration: "8s",
      generate_audio: true,
      resolution: "1080p"
    });
  },

  // Generate luxury car formation
  generateLuxuryCarFormation: async (apiKey: string, imageUrl: string) => {
    const executor = new FalAiVeo3FastImageToVideoExecutor(apiKey);
    
    const prompt = "Single drop of liquid metal in minimalist black void, slowly pulses then violently expands, tendrils form wireframe of futuristic car, liquid metal flows over wireframe solidifying into smooth body panels, LED lights flash on, high-end commercial quality";
    
    return await executor.generateVideo({
      prompt,
      image_url: imageUrl,
      aspect_ratio: "16:9",
      duration: "8s",
      generate_audio: true,
      resolution: "1080p"
    });
  }
};

// ============================================================================
// PROMPT TEMPLATES FOR CINEMATIC SCENES
// ============================================================================

export const cinematicPromptTemplates = {
  
  // Epic transformation template
  epicTransformation: {
    structure: `{subject} {initial_state}, then {transformation_trigger} begins, {transformation_process}, culminating in {final_state}`,
    examples: [
      "A {character} {initial_pose}, then {magic_effect} begins, {transformation_sequence}, culminating in {final_powerful_pose}",
      "A {object} {starting_condition}, then {activation} begins, {transformation_detailed}, culminating in {final_state}"
    ]
  },

  // Cinematic journey template
  cinematicJourney: {
    structure: `{vehicle/subject} {motion} through {environment}, {camera_movement}, {environmental_effects}, {atmospheric_details}`,
    examples: [
      "A {vehicle} {traveling_action} through {scenic_location}, camera tracking smoothly, {weather_effects}, {time_of_day_lighting}",
      "A {character} {movement} through {setting}, {camera_technique}, {environmental_particles}, {mood_atmosphere}"
    ]
  },

  // Commercial reveal template
  commercialReveal: {
    structure: `{starting_element} {initial_action}, then {transformation_sequence}, {build_up}, culminating in {dramatic_reveal}`,
    examples: [
      "A {product} {starting_state}, then {formation_sequence}, {progressive_build}, culminating in {stunning_reveal}",
      "A {element} {beginning_action}, then {evolution_process}, {intensity_rise}, culminating in {final_presentation}"
    ]
  }
};

export default veo3FastAdvancedCinematicExamples;
