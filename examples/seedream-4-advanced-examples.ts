/**
 * SeeDream 4.0 Advanced Examples
 * 
 * This file contains advanced examples showcasing SeeDream 4.0's enhanced capabilities
 * for photorealistic detail capture, complex optical effects, and narrative visualization.
 */

import { 
  executeSeedream4, 
  executeSeedream4WithQueue,
  checkSeedream4Status,
  getSeedream4Result,
  calculateSeedream4Cost,
  getSeedream4ModelInfo,
  Seedream4Input
} from '../executors/seedream-4';

// Example 1: Photorealistic Macro with Complex Optical Effects
export async function createPhotorealisticMacro() {
  console.log('=== Creating Photorealistic Macro with Optical Effects ===');
  
  const input: Seedream4Input = {
    prompt: "Photorealistic macro of a cracked crystal cube suspended above an antique desk. Inside the cube: micro-rooms flicker—childhood toys, rain on windows, a hallway turning into waves. 90mm macro, f/2.8, razor focus on fracture line; refracted bokeh blooms in aurora mint, lilac haze, pale amber. Dust motes sparkle like constellations. A silver key lies beneath, reflected multiple times within the cube, skewing scale. Subtle anamorphic flare. Story: each refracted facet misremembers the key in a new shape, proving memory is a prism, not a mirror.",
    style: "macro",
    aspect_ratio: "16:9",
    duration: "10s",
    resolution: "4K",
    camera_movement: "orbital"
  };

  try {
    const result = await executeSeedream4(input);
    
    if ('error' in result) {
      console.error('Error creating photorealistic macro:', result.message);
      return null;
    }

    console.log('✅ Photorealistic macro created successfully!');
    console.log('Video URL:', result.video.url);
    console.log('Resolution:', result.video.resolution);
    console.log('Duration:', result.video.duration, 'seconds');
    console.log('File size:', result.video.file_size, 'bytes');
    
    return result;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Example 2: Memory-Based Narrative Visualization
export async function createMemoryVisualization() {
  console.log('=== Creating Memory-Based Narrative Visualization ===');
  
  const input: Seedream4Input = {
    prompt: "Memory as a prism: A grandmother's kitchen dissolves into liquid light, each surface reflecting a different moment—her hands kneading dough, steam rising from a copper pot, sunlight through lace curtains. The camera moves through these refracted memories, each angle revealing a new facet of the same story. Anamorphic lens flares create emotional depth, while macro details capture the texture of flour on weathered hands.",
    style: "memory-based",
    aspect_ratio: "16:9",
    duration: "15s",
    resolution: "4K",
    camera_movement: "tracking"
  };

  try {
    const result = await executeSeedream4(input);
    
    if ('error' in result) {
      console.error('Error creating memory visualization:', result.message);
      return null;
    }

    console.log('✅ Memory visualization created successfully!');
    console.log('Video URL:', result.video.url);
    console.log('Style: Memory-based narrative');
    console.log('Duration:', result.video.duration, 'seconds');
    
    return result;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Example 3: Microscopic Optical Effects
export async function createMicroscopicOpticalEffects() {
  console.log('=== Creating Microscopic Optical Effects ===');
  
  const input: Seedream4Input = {
    prompt: "Microscopic view of a dewdrop on a spider's web at dawn. Inside the droplet: the entire forest is compressed and refracted, creating infinite recursive landscapes. Each reflection shows a different season—spring buds, summer leaves, autumn colors, winter snow. The camera orbits the droplet as it catches the first light, creating prismatic rainbows that dance across the frame. Macro lens captures every surface detail of the web's silk.",
    style: "microscopic",
    aspect_ratio: "1:1",
    duration: "8s",
    resolution: "4K",
    camera_movement: "orbital"
  };

  try {
    const result = await executeSeedream4(input);
    
    if ('error' in result) {
      console.error('Error creating microscopic effects:', result.message);
      return null;
    }

    console.log('✅ Microscopic optical effects created successfully!');
    console.log('Video URL:', result.video.url);
    console.log('Style: Microscopic with optical effects');
    console.log('Aspect ratio: 1:1 (square format)');
    
    return result;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Example 4: Atmospheric Depth and Texture
export async function createAtmosphericDepth() {
  console.log('=== Creating Atmospheric Depth and Texture ===');
  
  const input: Seedream4Input = {
    prompt: "Cinematic close-up of weathered hands holding a vintage pocket watch, steam rising from a cup of tea beside it. The watch face reflects multiple scenes—a train station, a garden, a library—each reflection slightly distorted by the curved glass. Warm golden hour lighting creates soft shadows across the leather-bound books in the background. Macro lens captures the patina on the brass, the steam's delicate curl, and the texture of aged paper.",
    style: "atmospheric",
    aspect_ratio: "4:5",
    duration: "12s",
    resolution: "4K",
    camera_movement: "static"
  };

  try {
    const result = await executeSeedream4(input);
    
    if ('error' in result) {
      console.error('Error creating atmospheric depth:', result.message);
      return null;
    }

    console.log('✅ Atmospheric depth created successfully!');
    console.log('Video URL:', result.video.url);
    console.log('Style: Atmospheric with texture details');
    console.log('Aspect ratio: 4:5 (portrait format)');
    
    return result;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Example 5: Refractive Light Play
export async function createRefractiveLightPlay() {
  console.log('=== Creating Refractive Light Play ===');
  
  const input: Seedream4Input = {
    prompt: "A vintage wine glass sits on a marble surface, filled with amber liquid. Sunlight streams through a window, creating a prismatic spectrum that dances across the marble. The glass acts as a lens, focusing and refracting the light into intricate patterns. Each refraction reveals a different scene—a vineyard at sunset, a cellar with aging barrels, a table set for dinner. The camera slowly orbits the glass, capturing how light transforms the ordinary into the extraordinary.",
    style: "refractive",
    aspect_ratio: "16:9",
    duration: "14s",
    resolution: "4K",
    camera_movement: "orbital"
  };

  try {
    const result = await executeSeedream4(input);
    
    if ('error' in result) {
      console.error('Error creating refractive light play:', result.message);
      return null;
    }

    console.log('✅ Refractive light play created successfully!');
    console.log('Video URL:', result.video.url);
    console.log('Style: Refractive with light effects');
    console.log('Duration:', result.video.duration, 'seconds');
    
    return result;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Example 6: Scale Distortion Effects
export async function createScaleDistortion() {
  console.log('=== Creating Scale Distortion Effects ===');
  
  const input: Seedream4Input = {
    prompt: "A magnifying glass lies on an old map, its curved lens creating impossible perspectives. Through the glass, the map's ink lines become rivers flowing through miniature landscapes. Mountains rise from paper valleys, and tiny ships sail across inked seas. The camera moves between the real world and the magnified view, creating a seamless transition between scales. Each detail in the magnified world is rendered with photorealistic precision, from the texture of the paper to the flow of the ink.",
    style: "microscopic",
    aspect_ratio: "16:9",
    duration: "16s",
    resolution: "4K",
    camera_movement: "tracking"
  };

  try {
    const result = await executeSeedream4(input);
    
    if ('error' in result) {
      console.error('Error creating scale distortion:', result.message);
      return null;
    }

    console.log('✅ Scale distortion effects created successfully!');
    console.log('Video URL:', result.video.url);
    console.log('Style: Microscopic with scale manipulation');
    console.log('Duration:', result.video.duration, 'seconds');
    
    return result;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Example 7: Anamorphic Lens Effects
export async function createAnamorphicEffects() {
  console.log('=== Creating Anamorphic Lens Effects ===');
  
  const input: Seedream4Input = {
    prompt: "Cinematic shot of a lighthouse beam cutting through fog at night. Anamorphic lens creates horizontal bokeh streaks as the light passes through moisture particles. The beam illuminates swirling fog patterns, each particle catching and refracting the light. In the distance, the lighthouse appears as a vertical line of light, while the beam creates horizontal light trails across the frame. The anamorphic flare adds a subtle blue tint to the highlights, creating a dreamlike quality.",
    style: "anamorphic",
    aspect_ratio: "16:9",
    duration: "18s",
    resolution: "4K",
    camera_movement: "static"
  };

  try {
    const result = await executeSeedream4(input);
    
    if ('error' in result) {
      console.error('Error creating anamorphic effects:', result.message);
      return null;
    }

    console.log('✅ Anamorphic lens effects created successfully!');
    console.log('Video URL:', result.video.url);
    console.log('Style: Anamorphic with lens flares');
    console.log('Duration:', result.video.duration, 'seconds');
    
    return result;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Example 8: Narrative Visualization with Technical Details
export async function createNarrativeVisualization() {
  console.log('=== Creating Narrative Visualization ===');
  
  const input: Seedream4Input = {
    prompt: "A vintage typewriter sits in a pool of warm lamplight, its keys reflecting the glow. As the camera moves closer, each key becomes a window into a different story—a love letter, a novel, a newspaper article. The reflections are slightly distorted by the curved metal surfaces, creating a kaleidoscope of narratives. Macro lens captures the texture of the paper, the patina on the metal, and the delicate shadows cast by the type bars. The composition tells the story of how words transform thoughts into reality.",
    style: "narrative",
    aspect_ratio: "4:5",
    duration: "20s",
    resolution: "4K",
    camera_movement: "tracking"
  };

  try {
    const result = await executeSeedream4(input);
    
    if ('error' in result) {
      console.error('Error creating narrative visualization:', result.message);
      return null;
    }

    console.log('✅ Narrative visualization created successfully!');
    console.log('Video URL:', result.video.url);
    console.log('Style: Narrative with technical details');
    console.log('Duration:', result.video.duration, 'seconds');
    
    return result;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Example 9: Batch Processing Advanced Examples
export async function batchProcessAdvancedExamples() {
  console.log('=== Batch Processing Advanced Examples ===');
  
  const examples = [
    {
      name: "Photorealistic Macro",
      input: {
        prompt: "Macro view of a snowflake on a windowpane, each crystal facet reflecting a different season. 100mm macro, f/2.8, razor focus on crystal structure.",
        style: "macro" as const,
        aspect_ratio: "1:1" as const,
        duration: "8s" as const,
        resolution: "4K" as const,
        camera_movement: "orbital" as const
      }
    },
    {
      name: "Optical Effects",
      input: {
        prompt: "A prism on a black surface, white light entering and splitting into rainbow spectrum. Each color band reveals a different landscape—red deserts, orange sunsets, yellow fields, green forests, blue oceans, indigo mountains, violet skies.",
        style: "refractive" as const,
        aspect_ratio: "16:9" as const,
        duration: "12s" as const,
        resolution: "4K" as const,
        camera_movement: "tracking" as const
      }
    },
    {
      name: "Memory Visualization",
      input: {
        prompt: "A pocket watch opens to reveal not gears, but a miniature theater where memories play out. Each memory is a different scene—childhood, first love, graduation, wedding. The camera moves through these scenes as if walking through a memory palace.",
        style: "memory-based" as const,
        aspect_ratio: "16:9" as const,
        duration: "15s" as const,
        resolution: "4K" as const,
        camera_movement: "orbital" as const
      }
    }
  ];

  const results = [];
  
  for (const example of examples) {
    console.log(`Processing ${example.name}...`);
    
    try {
      const result = await executeSeedream4(example.input);
      
      if ('error' in result) {
        console.error(`❌ Error processing ${example.name}:`, result.message);
        results.push({ name: example.name, error: result.message });
      } else {
        console.log(`✅ ${example.name} completed:`, result.video.url);
        results.push({ 
          name: example.name, 
          video_url: result.video.url,
          file_size: result.video.file_size,
          duration: result.video.duration
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

// Example 10: Cost Calculation for Advanced Examples
export function demonstrateAdvancedCostCalculation() {
  console.log('=== Cost Calculation for Advanced Examples ===');
  
  const scenarios = [
    { duration: 8, resolution: "4K" as const, description: "Macro photography (8 seconds)" },
    { duration: 12, resolution: "4K" as const, description: "Optical effects (12 seconds)" },
    { duration: 15, resolution: "4K" as const, description: "Memory visualization (15 seconds)" },
    { duration: 20, resolution: "4K" as const, description: "Narrative visualization (20 seconds)" },
    { duration: 8, resolution: "1080p" as const, description: "Macro photography 1080p (8 seconds)" },
    { duration: 12, resolution: "1080p" as const, description: "Optical effects 1080p (12 seconds)" }
  ];

  scenarios.forEach(scenario => {
    const cost = calculateSeedream4Cost(scenario.duration, scenario.resolution);
    console.log(`${scenario.description}: $${cost.toFixed(2)}`);
  });
}

// Example 11: Model Information Display
export function displayAdvancedModelInformation() {
  console.log('=== SeeDream 4.0 Advanced Model Information ===');
  
  const modelInfo = getSeedream4ModelInfo();
  
  console.log('Name:', modelInfo.name);
  console.log('Description:', modelInfo.description);
  console.log('Provider:', modelInfo.provider);
  console.log('Model ID:', modelInfo.modelId);
  console.log('Enhanced Capabilities:');
  console.log('  - Photorealistic detail capture');
  console.log('  - Complex optical effects');
  console.log('  - Macro and microscopic rendering');
  console.log('  - Refractive and prismatic effects');
  console.log('  - Memory-based narrative visualization');
  console.log('  - Anamorphic lens effects');
  console.log('  - Atmospheric lighting control');
  console.log('  - Scale distortion effects');
  console.log('Supported Styles:', modelInfo.supportedStyles.join(', '));
  console.log('Supported Resolutions:', modelInfo.supportedResolutions.join(', '));
  console.log('Supported Aspect Ratios:', modelInfo.supportedAspectRatios.join(', '));
}

// Example 12: Complete Advanced Workflow
export async function completeAdvancedWorkflow() {
  console.log('=== Complete Advanced Workflow ===');
  
  const workflow = async () => {
    console.log('Step 1: Display model information...');
    displayAdvancedModelInformation();
    
    console.log('Step 2: Calculate costs for advanced examples...');
    demonstrateAdvancedCostCalculation();
    
    console.log('Step 3: Create photorealistic macro...');
    const macroResult = await createPhotorealisticMacro();
    
    if (macroResult) {
      console.log('Step 4: Create memory visualization...');
      const memoryResult = await createMemoryVisualization();
      
      if (memoryResult) {
        console.log('Step 5: Create optical effects...');
        const opticalResult = await createMicroscopicOpticalEffects();
        
        if (opticalResult) {
          console.log('Step 6: Advanced workflow completed successfully!');
          return {
            macro: macroResult,
            memory: memoryResult,
            optical: opticalResult
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
  console.log('🚀 Starting SeeDream 4.0 Advanced Examples\n');
  
  try {
    // Display model information
    displayAdvancedModelInformation();
    console.log('\n');
    
    // Cost calculation
    demonstrateAdvancedCostCalculation();
    console.log('\n');
    
    // Individual advanced examples
    await createPhotorealisticMacro();
    console.log('\n');
    
    await createMemoryVisualization();
    console.log('\n');
    
    await createMicroscopicOpticalEffects();
    console.log('\n');
    
    await createAtmosphericDepth();
    console.log('\n');
    
    await createRefractiveLightPlay();
    console.log('\n');
    
    await createScaleDistortion();
    console.log('\n');
    
    await createAnamorphicEffects();
    console.log('\n');
    
    await createNarrativeVisualization();
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
  createPhotorealisticMacro,
  createMemoryVisualization,
  createMicroscopicOpticalEffects,
  createAtmosphericDepth,
  createRefractiveLightPlay,
  createScaleDistortion,
  createAnamorphicEffects,
  createNarrativeVisualization,
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
