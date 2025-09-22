/**
 * Nano Banana Advanced Examples
 * 
 * This file contains advanced examples showcasing Nano Banana's enhanced capabilities
 * for cinematic photography, complex scene composition, and emotional storytelling.
 */

import { 
  executeNanoBanana, 
  executeNanoBananaWithQueue,
  checkNanoBananaStatus,
  getNanoBananaResult,
  calculateNanoBananaCost,
  getNanoBananaModelInfo,
  NanoBananaInput
} from '../executors/nano-banana';

// Example 1: Cinematic Rooftop Scene (Featured Example)
export async function createCinematicRooftopScene() {
  console.log('=== Creating Cinematic Rooftop Scene ===');
  
  const input: NanoBananaInput = {
    prompt: {
      concept: "After-the-rain school rooftop at blue hour; quiet cinematic goodbye.",
      subject: "Adult Korean woman (not a minor) in school-style blazer, knit vest, tie, pleated skirt; knee-high socks; polished black loafers; earbuds plugged to phone.",
      pose: "full-body by the chain-link fence; one hand holding phone at side, the other resting on fence; calm, direct gaze.",
      environment: {
        setting: "concrete rooftop with painted court arcs and shallow puddles reflecting city neon; chain-link fence; metal stairwell door ajar; distant skyline and passing train lights.",
        weather_time: "rain just ended; thin mist; teal-to-warm sky gradient.",
        props_micro: [
          "paper timetable taped to fence, edges fluttering",
          "single chalk piece near her loafer",
          "on wet concrete near her shoes: a chalk smiling face and the handwritten phrase 'i miss you' (lowercase), slightly rain-smeared yet legible",
          "spinning roof vent",
          "folded umbrella against railing"
        ]
      },
      lighting: {
        key: "ambient blue-hour sky",
        rim: "warm sodium rim from stairwell door behind her",
        practicals: "city windows and rooftop safety lamp reflecting in puddles",
        accents: "phone screen glow on fingers; crisp eye catchlights; breeze lifts hair tips"
      },
      camera: {
        lens_mm: 35,
        aperture: 2.0,
        iso: 200,
        shutter_speed: "1/160",
        angle: "slight low angle to include sky and fence leading lines",
        focus: "sharp on face; shoes clearly resolved; background gently soft",
        framing: "vertical full-body with headroom; include chalk writing at feet"
      },
      grade: "cinematic teal–orange; low-contrast film curve; subtle grain 6–8; clean blacks; no clipped highlights.",
      emotion_notes: "nostalgia + forward motion—storm passed, city waking.",
      output: { resolution: "2048x2560", format: "png" }
    },
    negative: [
      "any additional text overlays or watermarks (the ONLY allowed text is the chalk 'i miss you')",
      "plastic skin, cartoon look, HDR halos, banding",
      "warped anatomy or proportions"
    ]
  };

  try {
    const result = await executeNanoBanana(input);
    
    if ('error' in result) {
      console.error('Error creating cinematic rooftop scene:', result.message);
      return null;
    }

    console.log('✅ Cinematic rooftop scene created successfully!');
    console.log('Image URL:', result.image.url);
    console.log('Resolution:', result.image.resolution);
    console.log('Style: Cinematic blue hour photography');
    console.log('Emotional tone: Nostalgia + forward motion');
    
    return result;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Example 2: Studio Portrait with Cinematic Black & White
export async function createStudioPortrait() {
  console.log('=== Creating Studio Portrait with Cinematic Black & White ===');
  
  const input: NanoBananaInput = {
    prompt: "Make this a studio portrait. Adjust the skin tone and give it a cinematic black-and-white color grade. The man is wearing a black shirt and sitting on the back side of a chair. Change the photo angle from eye level. Use a black background. The photo should look realistic in 8K without any pixel loss.",
    style: "cinematic-black-white",
    resolution: "8K"
  };

  try {
    const result = await executeNanoBanana(input);
    
    if ('error' in result) {
      console.error('Error creating studio portrait:', result.message);
      return null;
    }

    console.log('✅ Studio portrait created successfully!');
    console.log('Image URL:', result.image.url);
    console.log('Style: Cinematic black and white');
    console.log('Resolution: 8K');
    
    return result;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Example 3: Stickwoman Character with 3D Head
export async function createStickwomanCharacter() {
  console.log('=== Creating Stickwoman Character with 3D Head ===');
  
  const input: NanoBananaInput = {
    prompt: "A stickwoman character with a photorealistic 3D-rendered female head is taking on her couch with a laptop. Created Using: digital chalkboard-style concept illustration with 3D head rendering, white chalk-like vector linework for body on textured navy surface, soft spotlight simulating classroom lighting, dynamic composition with exaggerated body language and joyful posture, slightly top-down camera perspective, subtle ambient shadows, clean background texture simulating real chalk residue, minimalistic educational aesthetic blended with character-driven visual storytelling",
    style: "educational-aesthetic",
    resolution: "4K"
  };

  try {
    const result = await executeNanoBanana(input);
    
    if ('error' in result) {
      console.error('Error creating stickwoman character:', result.message);
      return null;
    }

    console.log('✅ Stickwoman character created successfully!');
    console.log('Image URL:', result.image.url);
    console.log('Style: Educational aesthetic with 3D/2D hybrid');
    console.log('Resolution: 4K');
    
    return result;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Example 4: Hyper-Realistic Cinematic Portrait
export async function createHyperrealisticPortrait() {
  console.log('=== Creating Hyper-Realistic Cinematic Portrait ===');
  
  const input: NanoBananaInput = {
    prompt: "Hyper-realistic cinematic portrait on a deep burgundy backdrop. Maroon velvet blazer, black silk shirt, slim trousers. Leaning on elegant chair, one arm draped, confident gaze. Rich waves with highlights. Golden spotlight, dramatic shadows, ultra-detailed fabrics, skin tones, luxury editorial vibe. 85mm lens, 9:16 Instagram style.",
    style: "luxury-editorial",
    aspect_ratio: "9:16",
    resolution: "4K"
  };

  try {
    const result = await executeNanoBanana(input);
    
    if ('error' in result) {
      console.error('Error creating hyperrealistic portrait:', result.message);
      return null;
    }

    console.log('✅ Hyper-realistic portrait created successfully!');
    console.log('Image URL:', result.image.url);
    console.log('Style: Luxury editorial');
    console.log('Aspect ratio: 9:16 (Instagram optimized)');
    
    return result;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Example 5: Vintage 8K Grainy Portrait
export async function createVintagePortrait() {
  console.log('=== Creating Vintage 8K Grainy Portrait ===');
  
  const input: NanoBananaInput = {
    prompt: "Retro vintage 8K grainy bright portrait of [insert your face reference], wearing a pastel green linen shirt with white linen pants, holding a rose. Dreamy 90s romantic film feel, windy atmosphere, solid wall and dramatic deep shadows. On the wall appears the shadow silhouette of a woman in traditional abaya with dupatta softly flowing in the wind. Emotional nostalgic mood.",
    style: "vintage-8k-grainy",
    resolution: "8K"
  };

  try {
    const result = await executeNanoBanana(input);
    
    if ('error' in result) {
      console.error('Error creating vintage portrait:', result.message);
      return null;
    }

    console.log('✅ Vintage portrait created successfully!');
    console.log('Image URL:', result.image.url);
    console.log('Style: Vintage 8K grainy');
    console.log('Mood: Dreamy 90s romantic film feel');
    
    return result;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Example 6: Holographic Projection Scene
export async function createHolographicScene() {
  console.log('=== Creating Holographic Projection Scene ===');
  
  const input: NanoBananaInput = {
    prompt: "A man looking intently at a holographic projection of himself, which is emanating from a small device on a table. The man has dark hair and a beard, and he is wearing a dark blue t-shirt and a watch. His expression is one of curiosity and slight confusion. The holographic figure is glowing blue and appears to be in an active pose, gesturing with one hand. The background is a slightly blurred indoor setting, possibly a home or office",
    style: "holographic",
    resolution: "4K"
  };

  try {
    const result = await executeNanoBanana(input);
    
    if ('error' in result) {
      console.error('Error creating holographic scene:', result.message);
      return null;
    }

    console.log('✅ Holographic scene created successfully!');
    console.log('Image URL:', result.image.url);
    console.log('Style: Holographic with futuristic elements');
    console.log('Resolution: 4K');
    
    return result;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Example 7: Ethereal Reflection Portrait
export async function createEtherealReflection() {
  console.log('=== Creating Ethereal Reflection Portrait ===');
  
  const input: NanoBananaInput = {
    prompt: "A dreamy, ultra-realistic portrait of a handsome man lying gracefully beside white lilies, his head resting gently on his arms, reflected perfectly on a glossy black surface. Soft cinematic lighting highlights his glowing skin and sharp yet delicate facial features, with slightly wet strands of hair falling naturally across his forehead. The mood is ethereal, romantic, artistic, with a serene atmosphere. High detail, professional studio photography, 8K resolution.",
    style: "ethereal-romantic",
    resolution: "8K"
  };

  try {
    const result = await executeNanoBanana(input);
    
    if ('error' in result) {
      console.error('Error creating ethereal reflection:', result.message);
      return null;
    }

    console.log('✅ Ethereal reflection portrait created successfully!');
    console.log('Image URL:', result.image.url);
    console.log('Style: Ethereal romantic with perfect reflection');
    console.log('Resolution: 8K');
    
    return result;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Example 8: Therapy Room Dual-Age Visualization
export async function createTherapyRoomScene() {
  console.log('=== Creating Therapy Room Dual-Age Visualization ===');
  
  const input: NanoBananaInput = {
    prompt: "Use the two uploaded photos for likeness: Adult reference: [ADULT_PHOTO] Child reference: [CHILD_PHOTO] Photorealistic minimalist therapy room; light walls, grey sofa, wooden coffee table with a tissue box, notebook and a glass of water, simple frame and floor lamp, soft natural daylight. The same person at two ages sits side-by-side: adult on the left speaking with open hands; child on the right listening with head slightly down. Both wear matching [OUTFIT] (same color & style). Clean studio vibe, centered composition, shallow depth of field, 50mm look, 4K, vertical 3:4. No extra people, no text, no watermark.",
    style: "therapy-room",
    aspect_ratio: "3:4",
    resolution: "4K"
  };

  try {
    const result = await executeNanoBanana(input);
    
    if ('error' in result) {
      console.error('Error creating therapy room scene:', result.message);
      return null;
    }

    console.log('✅ Therapy room scene created successfully!');
    console.log('Image URL:', result.image.url);
    console.log('Style: Minimalist therapy room');
    console.log('Aspect ratio: 3:4 (vertical)');
    
    return result;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Example 9: Vintage Polaroid Collage
export async function createVintageCollage() {
  console.log('=== Creating Vintage Polaroid Collage ===');
  
  const input: NanoBananaInput = {
    prompt: "Create an artistic collage of 6 vintage Polaroid photos, attached with a decorative rope and mini clothespins, like a home photo gallery. Each Polaroid frame has a slight fading and an old paper effect. The background is a soft pastel wall with light shadows, creating a cozy and creatively chaotic atmosphere. Emotions and poses: Light laughter — eyes closed, natural joy. Dreamy gaze upwards, relaxed pose. Playful wink. Calm smile with a head tilted to the side. Dynamic gesture hands raised high, full of energy. Romantic half-glance over the shoulder. The atmosphere is an art-retro style with elements of a '70s fashion magazine, soft diffused lighting, and muted warm and golden tones. Each photograph looks like a unique behind-the-scenes shot, with a touch of nostalgia and a sense of personal history.",
    style: "vintage-collage",
    resolution: "4K"
  };

  try {
    const result = await executeNanoBanana(input);
    
    if ('error' in result) {
      console.error('Error creating vintage collage:', result.message);
      return null;
    }

    console.log('✅ Vintage collage created successfully!');
    console.log('Image URL:', result.image.url);
    console.log('Style: Vintage Polaroid collage');
    console.log('Mood: 70s fashion magazine aesthetic');
    
    return result;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Example 10: Typographic Illustration
export async function createTypographicIllustration() {
  console.log('=== Creating Typographic Illustration ===');
  
  const input: NanoBananaInput = {
    prompt: "Create a typographic illustration shaped like a {OBJECT}, where the text itself forms the shape — bold and playful lettering style that fills the entire silhouette — letters adapt fluidly to the curves and contours of the object — vibrant and contrasting color palette that fits the theme — background is solid and enhances the focus on the main shape — vector-style, clean, high resolution, poster format, 1:1 aspect ratio.",
    style: "typographic",
    aspect_ratio: "1:1",
    resolution: "4K"
  };

  try {
    const result = await executeNanoBanana(input);
    
    if ('error' in result) {
      console.error('Error creating typographic illustration:', result.message);
      return null;
    }

    console.log('✅ Typographic illustration created successfully!');
    console.log('Image URL:', result.image.url);
    console.log('Style: Typographic with object-shaped text');
    console.log('Aspect ratio: 1:1 (square format)');
    
    return result;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Example 11: Batch Processing Advanced Examples
export async function batchProcessAdvancedExamples() {
  console.log('=== Batch Processing Advanced Examples ===');
  
  const examples = [
    {
      name: "Cinematic Rooftop",
      input: {
        prompt: "After-the-rain school rooftop at blue hour; quiet cinematic goodbye. Adult Korean woman in school-style blazer, knit vest, tie, pleated skirt; knee-high socks; polished black loafers; earbuds plugged to phone. Full-body by the chain-link fence; one hand holding phone at side, the other resting on fence; calm, direct gaze.",
        style: "cinematic" as const,
        resolution: "4K" as const
      }
    },
    {
      name: "Studio Portrait",
      input: {
        prompt: "Make this a studio portrait. Adjust the skin tone and give it a cinematic black-and-white color grade. The man is wearing a black shirt and sitting on the back side of a chair. Change the photo angle from eye level. Use a black background. The photo should look realistic in 8K without any pixel loss.",
        style: "cinematic-black-white" as const,
        resolution: "8K" as const
      }
    },
    {
      name: "Vintage Portrait",
      input: {
        prompt: "Retro vintage 8K grainy bright portrait, wearing a pastel green linen shirt with white linen pants, holding a rose. Dreamy 90s romantic film feel, windy atmosphere, solid wall and dramatic deep shadows. Emotional nostalgic mood.",
        style: "vintage-8k-grainy" as const,
        resolution: "8K" as const
      }
    }
  ];

  const results = [];
  
  for (const example of examples) {
    console.log(`Processing ${example.name}...`);
    
    try {
      const result = await executeNanoBanana(example.input);
      
      if ('error' in result) {
        console.error(`❌ Error processing ${example.name}:`, result.message);
        results.push({ name: example.name, error: result.message });
      } else {
        console.log(`✅ ${example.name} completed:`, result.image.url);
        results.push({ 
          name: example.name, 
          image_url: result.image.url,
          file_size: result.image.file_size,
          resolution: result.image.resolution
        });
      }
    } catch (error) {
      console.error(`❌ Unexpected error processing ${example.name}:`, error);
      results.push({ name: example.name, error: 'Unexpected error' });
    }
    
    // Add delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log('Batch processing completed. Results:', results);
  return results;
}

// Example 12: Cost Calculation for Advanced Examples
export function demonstrateAdvancedCostCalculation() {
  console.log('=== Cost Calculation for Advanced Examples ===');
  
  const scenarios = [
    { resolution: "4K" as const, description: "Cinematic rooftop scene (4K)" },
    { resolution: "8K" as const, description: "Studio portrait (8K)" },
    { resolution: "4K" as const, description: "Vintage portrait (4K)" },
    { resolution: "4K" as const, description: "Holographic scene (4K)" },
    { resolution: "8K" as const, description: "Ethereal reflection (8K)" },
    { resolution: "4K" as const, description: "Therapy room scene (4K)" }
  ];

  scenarios.forEach(scenario => {
    const cost = calculateNanoBananaCost(scenario.resolution);
    console.log(`${scenario.description}: $${cost.toFixed(2)}`);
  });
}

// Example 13: Model Information Display
export function displayAdvancedModelInformation() {
  console.log('=== Nano Banana Advanced Model Information ===');
  
  const modelInfo = getNanoBananaModelInfo();
  
  console.log('Name:', modelInfo.name);
  console.log('Description:', modelInfo.description);
  console.log('Provider:', modelInfo.provider);
  console.log('Model ID:', modelInfo.modelId);
  console.log('Enhanced Capabilities:');
  console.log('  - Cinematic photography mastery');
  console.log('  - Complex scene composition');
  console.log('  - Emotional storytelling');
  console.log('  - Professional studio photography');
  console.log('  - Vintage aesthetic recreation');
  console.log('  - Typographic illustration');
  console.log('  - Collage and montage creation');
  console.log('  - Therapy room visualization');
  console.log('  - Nostalgic mood creation');
  console.log('  - Holographic effects');
  console.log('  - Reflection and mirror work');
  console.log('  - Lightroom-style grading');
  console.log('Supported Styles:', modelInfo.supportedStyles.join(', '));
  console.log('Supported Resolutions:', modelInfo.supportedResolutions.join(', '));
  console.log('Supported Aspect Ratios:', modelInfo.supportedAspectRatios.join(', '));
}

// Example 14: Complete Advanced Workflow
export async function completeAdvancedWorkflow() {
  console.log('=== Complete Advanced Workflow ===');
  
  const workflow = async () => {
    console.log('Step 1: Display model information...');
    displayAdvancedModelInformation();
    
    console.log('Step 2: Calculate costs for advanced examples...');
    demonstrateAdvancedCostCalculation();
    
    console.log('Step 3: Create cinematic rooftop scene...');
    const rooftopResult = await createCinematicRooftopScene();
    
    if (rooftopResult) {
      console.log('Step 4: Create studio portrait...');
      const studioResult = await createStudioPortrait();
      
      if (studioResult) {
        console.log('Step 5: Create vintage portrait...');
        const vintageResult = await createVintagePortrait();
        
        if (vintageResult) {
          console.log('Step 6: Advanced workflow completed successfully!');
          return {
            rooftop: rooftopResult,
            studio: studioResult,
            vintage: vintageResult
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
export async function runAllAdvancedExamples() {
  console.log('🚀 Starting Nano Banana Advanced Examples\n');
  
  try {
    // Display model information
    displayAdvancedModelInformation();
    console.log('\n');
    
    // Cost calculation
    demonstrateAdvancedCostCalculation();
    console.log('\n');
    
    // Individual advanced examples
    await createCinematicRooftopScene();
    console.log('\n');
    
    await createStudioPortrait();
    console.log('\n');
    
    await createStickwomanCharacter();
    console.log('\n');
    
    await createHyperrealisticPortrait();
    console.log('\n');
    
    await createVintagePortrait();
    console.log('\n');
    
    await createHolographicScene();
    console.log('\n');
    
    await createEtherealReflection();
    console.log('\n');
    
    await createTherapyRoomScene();
    console.log('\n');
    
    await createVintageCollage();
    console.log('\n');
    
    await createTypographicIllustration();
    console.log('\n');
    
    // Batch processing
    await batchProcessAdvancedExamples();
    console.log('\n');
    
    // Complete workflow
    await completeAdvancedWorkflow();
    
    console.log('\n✅ All advanced examples completed!');
    
  } catch (error) {
    console.error('❌ Error running advanced examples:', error);
  }
}

// Export individual examples for selective execution
export const advancedExamples = {
  createCinematicRooftopScene,
  createStudioPortrait,
  createStickwomanCharacter,
  createHyperrealisticPortrait,
  createVintagePortrait,
  createHolographicScene,
  createEtherealReflection,
  createTherapyRoomScene,
  createVintageCollage,
  createTypographicIllustration,
  batchProcessAdvancedExamples,
  demonstrateAdvancedCostCalculation,
  displayAdvancedModelInformation,
  completeAdvancedWorkflow,
  runAllAdvancedExamples
};

// Run examples if this file is executed directly
if (require.main === module) {
  runAllAdvancedExamples();
}
