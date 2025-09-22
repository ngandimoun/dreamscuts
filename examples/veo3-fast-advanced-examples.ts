/**
 * Veo3 Fast Advanced Examples
 * 
 * This file contains advanced examples showcasing Veo3 Fast's enhanced capabilities
 * for cinematic production, complex scene composition, and professional audio design.
 */

import { 
  Veo3FastExecutor,
  Veo3FastInput,
  Veo3FastOutput,
  Veo3FastError
} from '../executors/veo3-fast';

// Example 1: Cinematic Fire Halo Scene (Featured Example)
export async function createCinematicFireHalo(apiKey: string) {
  console.log('=== Creating Cinematic Fire Halo Scene ===');
  
  const executor = new Veo3FastExecutor(apiKey);
  
  const input: Veo3FastInput = {
    prompt: JSON.stringify({
      shot: {
        type: "single",
        camera_motion: "slow vertical dolly-in from low angle (subtle tilt up), no cuts",
        loop_hint: "hold last 6 frames for seamless social autoplay"
      },
      subject: {
        character: "blonde woman in a flowing black long-sleeve dress, barefoot, ethereal witch-priestess",
        pose: "arms raised overhead, palms opening to the sky",
        expression: "rapt, eyes toward the halo",
        wardrobe_motion: "dress hem and sleeves ripple upward in heat-draft"
      },
      scene: {
        environment: "void-black backdrop filled with ember particulates",
        hero_prop: "roaring circular fire halo behind subject (solar-flare look)",
        fx: ["sparks", "embers", "soft ash", "volumetric heat shimmer"],
        time_of_day: "timeless night"
      },
      visual_details: {
        beats: [
          {
            time: "0.0-2.5",
            action: "Embers drift up; faint ring of fire traces on behind the subject. Camera begins slow dolly-in from low angle.",
            focus: "silhouette resolves from black; rim-light on hair and arms"
          },
          {
            time: "2.5-5.5",
            action: "The fire ring ignites fully and churns like solar plasma; subject raises hands higher, heat ripple intensifies.",
            focus: "glowing edge highlights; micro-sparks arc around palms"
          },
          {
            time: "5.5-8.0",
            action: "Subject levitates a few inches; dress billows; ring pulses brighter once, then stabilizes for loop.",
            focus: "hero tableau framed by perfect circle; last frames steady for seamless loop"
          }
        ]
      },
      cinematography: {
        lens: "telephoto 85mm feel, shallow depth (f/2.0), low-angle hero composition",
        framing: "centered, head near inner rim of the halo",
        exposure: "crisp highlights on fire, deep blacks preserved (no lifted shadows)",
        post: "high-contrast, slight glow bloom on highlights, tiny chromatic aberration on hottest edges"
      },
      audio: {
        fx: [
          "low sub-bass rumble",
          "airy ember crackles",
          "one soft whoosh swell at 5.5s"
        ],
        music: "droning dark-ambient pad that rises subtly by +2 dB at the final pulse",
        dialogue: "none"
      },
      color_palette: {
        primary: "incandescent orange-red (#FF5A1F)",
        secondary: "solar yellow-white core (#FFD36B)",
        accents: "deep ember reds (#C21A0F)",
        background: "true black (#000000)"
      }
    }),
    aspect_ratio: "16:9",
    resolution: "1080p",
    generate_audio: true
  };

  try {
    const result = await executor.generateVideo(input);
    
    console.log('✅ Cinematic fire halo scene created successfully!');
    console.log('Video URL:', result.video.url);
    console.log('Resolution:', result.resolution);
    console.log('Style: Cinematic fire effects with ethereal atmosphere');
    console.log('Audio: Synchronized with ambient and musical elements');
    
    return result;
  } catch (error) {
    console.error('Error creating cinematic fire halo scene:', error);
    return null;
  }
}

// Example 2: Celestial Megastructure Scene
export async function createCelestialMegastructure(apiKey: string) {
  console.log('=== Creating Celestial Megastructure Scene ===');
  
  const executor = new Veo3FastExecutor(apiKey);
  
  const input: Veo3FastInput = {
    prompt: JSON.stringify({
      shot: {
        type: "single",
        camera_motion: "slow ascending crane shot rising from ground level of the city toward the massive glowing ring in the sky",
        loop_hint: "hold final frames of glowing ring and drifting clouds for seamless autoplay loop"
      },
      subject: {
        hero_element: "colossal golden-lit megastructure ring hovering in the sky, half-shrouded in glowing clouds",
        secondary_elements: "grand white stone city with domes, spires, and gardens below",
        focus: "city foreground leading eye upward into the radiant sky portal"
      },
      scene: {
        environment: "mythic celestial metropolis with gleaming architecture, manicured green gardens, and radiant skies",
        hero_prop: "orbital ring structure with glowing circuits and radiant energy",
        fx: ["god rays bursting through clouds", "drifting mist layers", "light shimmer on domes"],
        time_of_day: "bright mythic afternoon transitioning into heavenly glow"
      },
      visual_details: {
        beats: [
          {
            time: "0.0-2.5",
            action: "Camera glides upward past domes and spires; golden reflections glisten on rooftops; clouds swirl slowly above.",
            focus: "cityscape grandeur, depth from foreground trees to mid domes"
          },
          {
            time: "2.5-5.5",
            action: "Ring's inner lights flare gently; circuit-like glow ripples; shafts of light pierce clouds and wash over city.",
            focus: "celestial detail; scale between city and megastructure"
          },
          {
            time: "5.5-8.0",
            action: "Camera ascends to frame full glowing arc dominating sky; clouds drift apart to reveal open heavens; loop stabilizes.",
            focus: "hero reveal of colossal structure against radiant blue void"
          }
        ]
      },
      cinematography: {
        lens: "wide-angle 24mm, deep depth of field",
        framing: "low-to-high crane shot emphasizing vertical scale",
        exposure: "balanced to preserve detail in highlights of glowing ring and shadows of city",
        post: "epic cinematic HDR, golden-and-blue high contrast, volumetric god rays"
      },
      audio: {
        fx: [
          "low celestial hum",
          "soft wind through spires",
          "subtle choral shimmer as ring ignites"
        ],
        music: "epic orchestral build with ethereal choir pads",
        dialogue: "none"
      },
      color_palette: {
        primary: "celestial blue sky (#2E63C6)",
        secondary: "golden white stone (#F5E4C1)",
        accents: "glowing circuit gold (#FFCE70), emerald green gardens (#2D7045)",
        background: "deep atmospheric cloud layers"
      }
    }),
    aspect_ratio: "16:9",
    resolution: "1080p",
    generate_audio: true
  };

  try {
    const result = await executor.generateVideo(input);
    
    console.log('✅ Celestial megastructure scene created successfully!');
    console.log('Video URL:', result.video.url);
    console.log('Style: Epic celestial composition with orbital ring');
    console.log('Audio: Orchestral build with ethereal choir pads');
    
    return result;
  } catch (error) {
    console.error('Error creating celestial megastructure scene:', error);
    return null;
  }
}

// Example 3: Wildlife Cinematography
export async function createWildlifeCinematography(apiKey: string) {
  console.log('=== Creating Wildlife Cinematography ===');
  
  const executor = new Veo3FastExecutor(apiKey);
  
  const input: Veo3FastInput = {
    prompt: JSON.stringify({
      shot: {
        camera_motion: "slow push-in from low angle toward leopard's piercing gaze",
        lens: "85mm telephoto, T1.8",
        shutter: "1/50",
        iso: 1600,
        look: "black-and-white cinematic wildlife portrait"
      },
      subject: {
        primary: "a leopard reclining on a dark mound, tail draped forward, luminous eyes fixed directly on camera",
        secondary: "tall grass strands silhouetted against the darkness",
        tertiary: "texture of spotted fur shimmering in selective light"
      },
      scene: {
        location: "savannah edge at night",
        time: "pre-dawn darkness",
        weather: "clear, cool air with faint breeze",
        mood: "intense, intimate, predatory stillness"
      },
      visual_details: {
        timeline_beats: [
          "0.0-2.5s: The leopard lies motionless, half in shadow, eyes catch faint rim light.",
          "2.5-5.0s: Camera pushes closer; spots become crisp, grass edges shimmer faintly; gaze remains unbroken.",
          "5.0-8.0s: Leopard's tail twitches slightly, head tilts imperceptibly; eyes dominate frame as push-in reaches medium close-up."
        ],
        surface_fx: "matte fur with sharp spot contrast; damp grass glistens faintly",
        lighting_fx: "single low-key rim light accentuating face and tail curve; deep negative fill"
      },
      cinematography: {
        framing: "leopard centered low, with long tail leading diagonally across frame; head and eyes near golden ratio point",
        depth_of_field: "shallow, isolating leopard from void background",
        exposure: "protect highlights in fur while preserving shadow depth",
        grading: "high-contrast monochrome; silver highlights, inky blacks"
      },
      audio: {
        fx: [
          "low ambient night crickets, sparse rustling grass",
          "occasional distant owl call",
          "soft breath of leopard, subtle rumble of chest purr-growl"
        ],
        music: "tense, minimal drone with deep cello undertones fading in slowly",
        mix_notes: "diegetic animal and ambient sounds dominate; music subliminal"
      },
      color_palette: {
        monochrome: ["#000000", "#1C1C1C", "#4A4A4A", "#C0C0C0", "#FFFFFF"]
      }
    }),
    aspect_ratio: "16:9",
    resolution: "1080p",
    generate_audio: true
  };

  try {
    const result = await executor.generateVideo(input);
    
    console.log('✅ Wildlife cinematography created successfully!');
    console.log('Video URL:', result.video.url);
    console.log('Style: Black and white wildlife portrait');
    console.log('Audio: Ambient nature sounds with minimal musical drone');
    
    return result;
  } catch (error) {
    console.error('Error creating wildlife cinematography:', error);
    return null;
  }
}

// Example 4: Ocean Astrophotography
export async function createOceanAstrophotography(apiKey: string) {
  console.log('=== Creating Ocean Astrophotography ===');
  
  const executor = new Veo3FastExecutor(apiKey);
  
  const input: Veo3FastInput = {
    prompt: JSON.stringify({
      shot: {
        camera_motion: "slow dolly-in at water level toward a towering curling wave",
        lens: "24mm wide-angle, T2.8",
        shutter: "1/48",
        iso: 800,
        look: "cinematic night ocean with astrophotography-grade sky"
      },
      subject: {
        primary: "a giant midnight ocean wave curling like a claw, backlit by starlight",
        secondary: "Milky Way band arcing across the sky; distant jagged coast in silhouette",
        tertiary: "silver moon-glint ripples and sparse bioluminescent flecks in the foam"
      },
      scene: {
        location: "open sea near volcanic coastline",
        time: "astronomical night",
        weather: "clear sky, light offshore wind",
        mood: "sublime, cosmic, awe-inducing calm-before-impact"
      },
      visual_details: {
        timeline_beats: [
          "0.0-2.5s: Begin close to the surface—mirror-like water, star reflections shimmering; the Milky Way dominates the upper frame.",
          "2.5-5.0s: Dolly-in reveals the wave wall rising and curling; white lace foam catches star highlights; subtle bioluminescent sparks flicker.",
          "5.0-8.0s: Push into the hollow of the wave; spray threads become sharp against the galaxy; the crest feathers and holds just before crashing, freeze on the brink."
        ],
        surface_fx: "micro-ripples, high-frequency foam detail, occasional spray droplets crossing lens (light)",
        sky_fx: "high dynamic range star field with warm dust lanes; slight parallax as camera advances"
      },
      cinematography: {
        framing: "waterline perspective rising slightly as the wave grows; horizon low-right, wave fills left frame, galaxy diagonal top-right",
        depth_of_field: "deep focus (hyperfocal) to keep stars and wave crisp",
        exposure: "ETTR with protected highlights in foam; specular star glints preserved",
        grading: "cool indigo-cyan sea, warm orange galactic core; metallic silver moon reflections"
      },
      audio: {
        fx: [
          "low ocean rumble and distant surf",
          "hiss of wind over water",
          "close, airy spray whoosh as the camera nears the tube"
        ],
        music: "sub-bass ambient drone with slow swelling pads; no melody, just rising awe",
        mix_notes: "diegetic water dominates; music -12 LUFS bed, cresting to -9 LUFS at beat 3"
      },
      color_palette: {
        sea: ["#0E1A2B", "#112B3A", "#AFC3D7"],
        sky: ["#0B0F1A", "#1C2233"],
        galactic_core: ["#F2B066", "#C07B4D", "#7A6FA4"],
        highlights: ["#E6EEF7", "#FFFFFF"]
      }
    }),
    aspect_ratio: "16:9",
    resolution: "1080p",
    generate_audio: true
  };

  try {
    const result = await executor.generateVideo(input);
    
    console.log('✅ Ocean astrophotography created successfully!');
    console.log('Video URL:', result.video.url);
    console.log('Style: Cinematic night ocean with Milky Way background');
    console.log('Audio: Ambient ocean sounds with sub-bass musical drone');
    
    return result;
  } catch (error) {
    console.error('Error creating ocean astrophotography:', error);
    return null;
  }
}

// Example 5: Perfume Commercial
export async function createPerfumeCommercial(apiKey: string) {
  console.log('=== Creating Perfume Commercial ===');
  
  const executor = new Veo3FastExecutor(apiKey);
  
  const input: Veo3FastInput = {
    prompt: JSON.stringify({
      shot: {
        composition: "starts in extreme close-up of rippling water surface, transitions to droplets rising mid-air in formation, ends in centered macro on suspended perfume bottle",
        lens: "macro lens for droplet texture, 50mm for mid-air formation, 85mm for product reveal",
        frame_rate: "60fps",
        camera_movement: "cut 1: slow vertical pan up from water surface (2s), cut 2: orbital motion around forming droplet silhouette (3s), cut 3: slow dolly-in as bottle crystallizes mid-air (3s)"
      },
      subject: {
        description: "water droplets rise from a liquid surface and form the suspended shape of a Chanel N°5 perfume bottle mid-air",
        props: "final Chanel N°5 bottle suspended in space, formed from clear and shimmering droplets"
      },
      scene: {
        location: "glossy black reflective platform with infinite dark background",
        environment: "weightless, pure atmosphere with soft ambient mist and faint reflections"
      },
      visual_details: {
        action: "droplets lift and spiral upward with balletic precision, converging mid-air into the iconic geometric silhouette of the Chanel N°5 bottle; the form crystallizes with a shimmer, label appearing last in suspended elegance",
        special_effects: "high-detail droplet simulation, slow-motion swirl, material morph from fluid to glass, suspended crystal shimmer"
      },
      cinematography: {
        lighting: "directional spotlight from above with soft side fill, delicate reflections along droplet edges and bottle facets",
        color_palette: "black, silver, transparent highlights, champagne gold accent",
        tone: "luxurious, sensual, iconic"
      },
      audio: {
        music: "minimal ambient piano with subtle orchestral undertone",
        ambient: "faint water resonance, high-frequency shimmer",
        sound_effects: "droplet rise chimes, soft formation resonance, crystalline ping as final form completes",
        mix_level: "elegant, delicate, focused on sonic purity and clarity"
      }
    }),
    aspect_ratio: "16:9",
    resolution: "1080p",
    generate_audio: true
  };

  try {
    const result = await executor.generateVideo(input);
    
    console.log('✅ Perfume commercial created successfully!');
    console.log('Video URL:', result.video.url);
    console.log('Style: High-end commercial with water droplet formation');
    console.log('Audio: Minimal ambient piano with crystalline sound effects');
    
    return result;
  } catch (error) {
    console.error('Error creating perfume commercial:', error);
    return null;
  }
}

// Example 6: Golden Arc Ritual Scene
export async function createGoldenArcRitual(apiKey: string) {
  console.log('=== Creating Golden Arc Ritual Scene ===');
  
  const executor = new Veo3FastExecutor(apiKey);
  
  const input: Veo3FastInput = {
    prompt: JSON.stringify({
      shot: {
        type: "single",
        camera_motion: "slow top-down crane descend with subtle push-in (no cuts)",
        loop_hint: "hold final 6 frames for seamless autoplay"
      },
      subject: {
        character: "blonde woman with a single back braid, wearing a flowing black evening dress with thigh-high slit; barefoot; goddess-ritual vibe",
        pose: "arms outstretched overhead touching a luminous golden arc; head bowed slightly",
        expression: "calm, reverent focus",
        wardrobe_motion: "fabric breathes gently; hem sways from faint updraft"
      },
      scene: {
        environment: "black void stage with sparse floating dust motes",
        hero_prop: "crescent-like golden light arc above her hands (liquid-light ribbon)",
        fx: ["soft volumetric glow", "micro-particle drift", "subtle heat shimmer near arc"],
        time_of_day: "timeless night"
      },
      visual_details: {
        beats: [
          {
            time: "0.0-2.4",
            action: "Camera descends from above; subject silhouette resolves; dormant gold arc begins to glimmer as hands make contact.",
            focus: "top-down framing, shoulders and braid highlighted"
          },
          {
            time: "2.4-5.4",
            action: "Arc brightens and bends smoothly into a perfect crescent; light blooms along her arms; dust motes orbit slowly.",
            focus: "rim highlights on skin; gentle lens bloom on the arc"
          },
          {
            time: "5.4-8.0",
            action: "She rises a few centimeters (levitation hint) while arc hums and stabilizes; fabric lifts softly; camera finishes push-in and settles for loop.",
            focus: "hero tableau centered; clean negative space around figure"
          }
        ]
      },
      cinematography: {
        lens: "portrait 65–85mm feel, shallow depth (f/2.0)",
        framing: "centered vertical figure; arc sits just above frame midline; low key with strong speculars",
        exposure: "protect highlights on arc, maintain true blacks; mild roll-off on skin",
        post: "cinematic contrast; glow bloom on arc; very light film grain; negligible chromatic aberration"
      },
      audio: {
        fx: [
          "low airy shimmer tied to the arc brightness",
          "soft cloth rustle on levitation",
          "sub-bass swell at 5.4s"
        ],
        music: "minimal drone in D minor, barely rising toward the final hold",
        dialogue: "none"
      },
      color_palette: {
        primary: "molten gold (#F5C76A)",
        secondary: "amber highlights (#D69B3A)",
        accents: "skin neutrals with warm rim",
        background: "pure black (#000000)"
      }
    }),
    aspect_ratio: "16:9",
    resolution: "1080p",
    generate_audio: true
  };

  try {
    const result = await executor.generateVideo(input);
    
    console.log('✅ Golden arc ritual scene created successfully!');
    console.log('Video URL:', result.video.url);
    console.log('Style: Sacred ritual with golden light arc');
    console.log('Audio: Minimal drone with airy shimmer effects');
    
    return result;
  } catch (error) {
    console.error('Error creating golden arc ritual scene:', error);
    return null;
  }
}

// Example 7: Burning Mountain Landscape
export async function createBurningMountainLandscape(apiKey: string) {
  console.log('=== Creating Burning Mountain Landscape ===');
  
  const executor = new Veo3FastExecutor(apiKey);
  
  const input: Veo3FastInput = {
    prompt: JSON.stringify({
      shot: {
        type: "single",
        camera_motion: "slow push-in across water surface toward ship and burning mountain",
        loop_hint: "stabilize water reflections and ember drift for seamless loop"
      },
      subject: {
        hero_element: "tall sailing ship with rigging illuminated by orange glow",
        secondary_elements: "mountainside forest fire, wooden village homes, colossal full moon rising behind mountain",
        focus: "ship as central silhouette against fiery background"
      },
      scene: {
        environment: "dark fjord waters, forested mountain ridge aflame, coastal cabins lit warmly",
        hero_prop: "ship with glowing sails catching firelight",
        fx: ["embers drifting in the air", "moonlight glow haze", "fire flicker reflections on water"],
        time_of_day: "night under massive golden moon"
      },
      visual_details: {
        beats: [
          {
            time: "0.0-2.5",
            action: "Camera begins glide over water; reflection of flames and moon ripples softly; ship silhouette emerges.",
            focus: "low angle with shimmering water foreground"
          },
          {
            time: "2.5-5.5",
            action: "Embers swirl across frame; flames roll up the forested slope; moon looms larger, partially veiled by smoke.",
            focus: "contrast of orange fire vs pale gold moon"
          },
          {
            time: "5.5-8.0",
            action: "Ship edges closer; sails flicker with reflected firelight; ember density blooms before stabilizing for loop.",
            focus: "ship framed against burning ridge and moon"
          }
        ]
      },
      cinematography: {
        lens: "cinematic wide 35mm, deep depth of field",
        framing: "ship slightly off-center, mountain diagonal rising behind",
        exposure: "low key with bright orange highlights balanced by moon glow",
        post: "high-contrast grade, warm fire-orange and cool gold dual-tone, soft vignette"
      },
      audio: {
        fx: [
          "distant crackle of fire",
          "soft water lapping against ship hull",
          "low rumble wind carrying embers"
        ],
        music: "slow orchestral drone with cello swells",
        dialogue: "none"
      },
      color_palette: {
        primary: "fire orange (#FF7A29)",
        secondary: "golden moonlight (#FFD36B)",
        accents: "deep shadow blacks (#0A0A0A), ember reds (#C92A0F)",
        background: "smoky gradients blending into black"
      }
    }),
    aspect_ratio: "16:9",
    resolution: "1080p",
    generate_audio: true
  };

  try {
    const result = await executor.generateVideo(input);
    
    console.log('✅ Burning mountain landscape created successfully!');
    console.log('Video URL:', result.video.url);
    console.log('Style: Apocalyptic landscape with fire and moon');
    console.log('Audio: Orchestral drone with fire and water effects');
    
    return result;
  } catch (error) {
    console.error('Error creating burning mountain landscape:', error);
    return null;
  }
}

// Example 8: Batch Processing Advanced Examples
export async function batchProcessAdvancedExamples(apiKey: string) {
  console.log('=== Batch Processing Advanced Examples ===');
  
  const examples = [
    {
      name: "Cinematic Fire Halo",
      input: {
        prompt: "Cinematic fire halo scene with ethereal witch-priestess, slow vertical dolly-in from low angle, roaring circular fire halo behind subject with ember particulates, telephoto 85mm feel with shallow depth, high-contrast grading with glow bloom on highlights",
        aspect_ratio: "16:9" as const,
        resolution: "1080p" as const,
        generate_audio: true
      }
    },
    {
      name: "Celestial Megastructure",
      input: {
        prompt: "Epic celestial megastructure with orbital ring, slow ascending crane shot rising from city toward massive glowing ring in sky, wide-angle 24mm with deep depth of field, epic cinematic HDR with golden-and-blue high contrast, volumetric god rays",
        aspect_ratio: "16:9" as const,
        resolution: "1080p" as const,
        generate_audio: true
      }
    },
    {
      name: "Wildlife Cinematography",
      input: {
        prompt: "Black and white wildlife cinematography with leopard, slow push-in from low angle toward leopard's piercing gaze, 85mm telephoto with shallow depth of field, high-contrast monochrome grading with silver highlights and inky blacks",
        aspect_ratio: "16:9" as const,
        resolution: "1080p" as const,
        generate_audio: true
      }
    }
  ];

  const executor = new Veo3FastExecutor(apiKey);
  const results = [];
  
  for (const example of examples) {
    console.log(`Processing ${example.name}...`);
    
    try {
      const result = await executor.generateVideo(example.input);
      
      console.log(`✅ ${example.name} completed:`, result.video.url);
      results.push({ 
        name: example.name, 
        video_url: result.video.url,
        file_size: result.video.file_size,
        request_id: result.requestId
      });
    } catch (error) {
      console.error(`❌ Error processing ${example.name}:`, error);
      results.push({ name: example.name, error: 'Generation failed' });
    }
    
    // Add delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  console.log('Batch processing completed. Results:', results);
  return results;
}

// Example 9: Cost Calculation for Advanced Examples
export function demonstrateAdvancedCostCalculation() {
  console.log('=== Cost Calculation for Advanced Examples ===');
  
  const scenarios = [
    { duration: 8, audio: true, description: "Cinematic fire halo scene (8s with audio)" },
    { duration: 8, audio: true, description: "Celestial megastructure scene (8s with audio)" },
    { duration: 8, audio: true, description: "Wildlife cinematography (8s with audio)" },
    { duration: 8, audio: true, description: "Ocean astrophotography (8s with audio)" },
    { duration: 8, audio: true, description: "Perfume commercial (8s with audio)" },
    { duration: 8, audio: false, description: "Silent version (8s without audio)" }
  ];

  scenarios.forEach(scenario => {
    const cost = scenario.audio ? 8 * 0.40 : 8 * 0.25;
    console.log(`${scenario.description}: $${cost.toFixed(2)}`);
  });
}

// Example 10: Model Information Display
export function displayAdvancedModelInformation() {
  console.log('=== Veo3 Fast Advanced Model Information ===');
  
  console.log('Name: Veo3 Fast Enhanced');
  console.log('Description: Advanced AI video generation with exceptional cinematic capabilities');
  console.log('Provider: Google (via fal.ai)');
  console.log('Model ID: fal-ai/veo3/fast');
  console.log('Enhanced Capabilities:');
  console.log('  - Cinematic production mastery');
  console.log('  - Complex scene composition');
  console.log('  - Professional audio design');
  console.log('  - Wildlife cinematography');
  console.log('  - Fantasy and sci-fi scenes');
  console.log('  - Commercial production');
  console.log('  - Astrophotography integration');
  console.log('  - Advanced special effects');
  console.log('  - Volumetric lighting');
  console.log('  - Particle simulation');
  console.log('  - Fire and ember effects');
  console.log('  - Water and ocean cinematography');
  console.log('  - Holographic effects');
  console.log('  - Reflection and mirror work');
  console.log('Supported Aspect Ratios: 16:9, 9:16, 1:1');
  console.log('Supported Resolutions: 720p, 1080p');
  console.log('Supported Durations: 8s');
  console.log('Audio Generation: Full synchronized audio with dialogue and sound effects');
  console.log('Pricing: $0.25/second (audio off), $0.40/second (audio on)');
}

// Example 11: Complete Advanced Workflow
export async function completeAdvancedWorkflow(apiKey: string) {
  console.log('=== Complete Advanced Workflow ===');
  
  const workflow = async () => {
    console.log('Step 1: Display model information...');
    displayAdvancedModelInformation();
    
    console.log('Step 2: Calculate costs for advanced examples...');
    demonstrateAdvancedCostCalculation();
    
    console.log('Step 3: Create cinematic fire halo scene...');
    const fireHaloResult = await createCinematicFireHalo(apiKey);
    
    if (fireHaloResult) {
      console.log('Step 4: Create celestial megastructure scene...');
      const celestialResult = await createCelestialMegastructure(apiKey);
      
      if (celestialResult) {
        console.log('Step 5: Create wildlife cinematography...');
        const wildlifeResult = await createWildlifeCinematography(apiKey);
        
        if (wildlifeResult) {
          console.log('Step 6: Advanced workflow completed successfully!');
          return {
            fireHalo: fireHaloResult,
            celestial: celestialResult,
            wildlife: wildlifeResult
          };
        }
      }
    }
    
    console.log('Step 6: Advanced workflow completed with some failures');
    return null;
  };
  
  return await workflow();
}

// Main execution function to run all advanced examples
export async function runAllAdvancedExamples(apiKey: string) {
  console.log('🚀 Starting Veo3 Fast Advanced Examples\n');
  
  try {
    // Display model information
    displayAdvancedModelInformation();
    console.log('\n');
    
    // Cost calculation
    demonstrateAdvancedCostCalculation();
    console.log('\n');
    
    // Individual advanced examples
    await createCinematicFireHalo(apiKey);
    console.log('\n');
    
    await createCelestialMegastructure(apiKey);
    console.log('\n');
    
    await createWildlifeCinematography(apiKey);
    console.log('\n');
    
    await createOceanAstrophotography(apiKey);
    console.log('\n');
    
    await createPerfumeCommercial(apiKey);
    console.log('\n');
    
    await createGoldenArcRitual(apiKey);
    console.log('\n');
    
    await createBurningMountainLandscape(apiKey);
    console.log('\n');
    
    // Batch processing
    await batchProcessAdvancedExamples(apiKey);
    console.log('\n');
    
    // Complete workflow
    await completeAdvancedWorkflow(apiKey);
    
    console.log('\n✅ All advanced examples completed!');
    
  } catch (error) {
    console.error('❌ Error running advanced examples:', error);
  }
}

// Export individual examples for selective execution
export const advancedExamples = {
  createCinematicFireHalo,
  createCelestialMegastructure,
  createWildlifeCinematography,
  createOceanAstrophotography,
  createPerfumeCommercial,
  createGoldenArcRitual,
  createBurningMountainLandscape,
  batchProcessAdvancedExamples,
  demonstrateAdvancedCostCalculation,
  displayAdvancedModelInformation,
  completeAdvancedWorkflow,
  runAllAdvancedExamples
};

// Run examples if this file is executed directly
if (require.main === module) {
  const apiKey = process.env.FAL_KEY || 'your-api-key-here';
  runAllAdvancedExamples(apiKey);
}
