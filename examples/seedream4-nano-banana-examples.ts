/**
 * Seedream 4 & Nano Banana Examples
 * 
 * This file contains comprehensive examples and use cases for both
 * Seedream 4 and Nano Banana models, showcasing their capabilities
 * in generating video frames, camera movements, and creative video content.
 * 
 * Key Features Demonstrated:
 * - First frame and last frame generation
 * - Camera movement control
 * - Vintage style video creation
 * - Frame-to-video workflows
 * - Creative video effects
 * - Professional video production
 * - And much more...
 */

import { Seedream4Executor, createSeedream4Executor } from '../executors/seedream-4';
import { NanoBananaExecutor, createNanoBananaExecutor } from '../executors/nano-banana';

// ============================================================================
// FRAME GENERATION EXAMPLES
// ============================================================================

export const frameGenerationExamples = {
  
  // ============================================================================
  // FIRST FRAME GENERATION
  // ============================================================================
  
  firstFrameGeneration: {
    // Basic first frame
    basicFirstFrame: {
      description: "Generate the first frame of a video sequence",
      prompt: "A woman standing in a room, looking at the camera",
      style: "photographic",
      aspect_ratio: "4:5",
      resolution: "1080p",
      useCase: "Video sequence planning and storyboarding",
      expectedResult: "Clear first frame showing the subject in starting position"
    },

    // Character introduction frame
    characterIntroduction: {
      description: "First frame for character introduction",
      prompt: "A confident person stepping forward, making eye contact with the camera",
      style: "cinematic",
      aspect_ratio: "16:9",
      resolution: "1080p",
      useCase: "Character introductions in videos",
      expectedResult: "Engaging first frame with character in introduction pose"
    },

    // Scene establishment frame
    sceneEstablishment: {
      description: "First frame establishing the scene",
      prompt: "Wide shot of a modern office space with natural lighting",
      style: "photographic",
      aspect_ratio: "16:9",
      resolution: "1080p",
      useCase: "Scene establishment in video content",
      expectedResult: "Clear establishing shot showing the environment"
    },

    // Action sequence first frame
    actionFirstFrame: {
      description: "First frame for action sequence",
      prompt: "Hero character in ready position, looking determined",
      style: "cinematic",
      aspect_ratio: "16:9",
      resolution: "1080p",
      useCase: "Action sequences and dynamic content",
      expectedResult: "Dynamic first frame showing character in action-ready pose"
    }
  },

  // ============================================================================
  // LAST FRAME GENERATION
  // ============================================================================
  
  lastFrameGeneration: {
    // Basic last frame
    basicLastFrame: {
      description: "Generate the last frame of a video sequence",
      prompt: "View from the top of the room, looking down at the woman",
      style: "photographic",
      aspect_ratio: "4:5",
      resolution: "1080p",
      useCase: "Video sequence completion and conclusion",
      expectedResult: "Final frame showing the scene from a different perspective"
    },

    // Character conclusion frame
    characterConclusion: {
      description: "Last frame for character conclusion",
      prompt: "Person walking away from camera,背影消失在远处",
      style: "cinematic",
      aspect_ratio: "16:9",
      resolution: "1080p",
      useCase: "Character conclusions and endings",
      expectedResult: "Emotional last frame showing character departure"
    },

    // Scene resolution frame
    sceneResolution: {
      description: "Last frame resolving the scene",
      prompt: "Empty room with soft lighting, peaceful atmosphere",
      style: "photographic",
      aspect_ratio: "16:9",
      resolution: "1080p",
      useCase: "Scene resolution and closure",
      expectedResult: "Peaceful last frame showing resolved scene"
    },

    // Action sequence last frame
    actionLastFrame: {
      description: "Last frame for action sequence",
      prompt: "Hero character in victory pose, triumphant expression",
      style: "cinematic",
      aspect_ratio: "16:9",
      resolution: "1080p",
      useCase: "Action sequence conclusions",
      expectedResult: "Triumphant last frame showing character success"
    }
  },

  // ============================================================================
  // CAMERA MOVEMENT EXAMPLES
  // ============================================================================
  
  cameraMovement: {
    // Tracking shot
    trackingShot: {
      description: "Camera tracks the woman as she moves through the room",
      prompt: "Camera tracks the woman",
      style: "cinematic",
      aspect_ratio: "16:9",
      duration: "10s",
      resolution: "1080p",
      useCase: "Dynamic following shots and character movement",
      expectedResult: "Smooth tracking shot following the subject"
    },

    // Panning shot
    panningShot: {
      description: "Camera pans across the scene",
      prompt: "Camera pans from left to right across the room",
      style: "cinematic",
      aspect_ratio: "16:9",
      duration: "8s",
      resolution: "1080p",
      useCase: "Scene exploration and environmental shots",
      expectedResult: "Smooth panning shot revealing the environment"
    },

    // Zooming shot
    zoomingShot: {
      description: "Camera zooms in on the subject",
      prompt: "Camera zooms in on the person's face",
      style: "cinematic",
      aspect_ratio: "16:9",
      duration: "6s",
      resolution: "1080p",
      useCase: "Emotional emphasis and detail shots",
      expectedResult: "Smooth zoom shot focusing on the subject"
    },

    // Orbital shot
    orbitalShot: {
      description: "Camera orbits around the subject",
      prompt: "Camera orbits around the person in the center",
      style: "cinematic",
      aspect_ratio: "16:9",
      duration: "12s",
      resolution: "1080p",
      useCase: "360-degree character shots and product showcases",
      expectedResult: "Smooth orbital shot around the subject"
    }
  },

  // ============================================================================
  // VINTAGE STYLE EXAMPLES
  // ============================================================================
  
  vintageStyle: {
    // Gotham energy example
    gothamEnergy: {
      description: "Peak Gotham energy with 2004 VGA aesthetic",
      prompt: "2004 VGA bar-selfie: Joker (smudged white greasepaint, green-tinted slicked hair, purple satin shirt open to chest, lit cigar) holds flip-phone at arm's length, wide-angle lens slightly tilted. Batman (black cowl, matte finish, visible jaw stubble, grey T-shirt) sits centre, eyes narrowed at lens, one brow raised. Catwoman (black PVC halter, cat-ear headband, smudged eyeliner, red lipstick) leans over bar, gloved hand on Joker's shoulder. Harley Quinn (red/blue crop top, diamond face paint cracked, pigtails with faded ribbon) pops between them, tongue out, holding a half-empty beer bottle. Background: dim wood-paneled dive bar, Bud Light neon blur, CRT TV static, jukebox glow. Harsh on-camera flash blows highlights, green-yellow white-balance shift, heavy VGA noise, 640×480 pixel stretch, date-stamp '04-10-15 02:17'. Mild motion blur on Harley's bottle, dust specks on lens, finger partially covers corner.",
      style: "photographic 2004 VGA analog selfie",
      aspect_ratio: "4:5",
      duration: "5s",
      resolution: "1080p",
      negative_prompt: "logos, text, extra limbs, smooth skin, HDR, modern phone",
      useCase: "Vintage aesthetic content and retro styling",
      expectedResult: "Authentic 2004 VGA bar selfie with Gotham characters"
    },

    // Retro selfie style
    retroSelfie: {
      description: "Retro selfie with vintage camera effects",
      prompt: "Vintage selfie with film grain, soft focus, warm tones, and nostalgic atmosphere",
      style: "photographic vintage analog",
      aspect_ratio: "4:5",
      duration: "5s",
      resolution: "1080p",
      negative_prompt: "digital, HDR, modern, sharp",
      useCase: "Nostalgic content and vintage styling",
      expectedResult: "Authentic vintage selfie with film camera effects"
    },

    // Film camera aesthetic
    filmCamera: {
      description: "Film camera aesthetic with analog effects",
      prompt: "Film camera shot with grain, light leaks, and analog imperfections",
      style: "photographic film analog",
      aspect_ratio: "16:9",
      duration: "8s",
      resolution: "1080p",
      negative_prompt: "digital, clean, perfect, modern",
      useCase: "Film aesthetic and analog styling",
      expectedResult: "Authentic film camera look with analog effects"
    }
  }
};

// ============================================================================
// WORKFLOW EXAMPLES
// ============================================================================

export const workflowExamples = {
  
  // ============================================================================
  // FRAME-TO-VIDEO WORKFLOW
  // ============================================================================
  
  frameToVideoWorkflow: {
    title: "Frame-to-Video Workflow",
    description: "Create video from first and last frames using Seedream 4 or Nano Banana",
    
    steps: [
      {
        step: 1,
        title: "Generate First Frame",
        description: "Create the first frame of your video sequence",
        implementation: `
// Generate first frame with Seedream 4
const firstFrame = await seedream4Executor.generateFirstFrame(
  "A woman standing in a room, looking at the camera",
  {
    style: "photographic",
    aspect_ratio: "4:5",
    resolution: "1080p"
  }
);

// Or with Nano Banana
const firstFrame = await nanoBananaExecutor.generateFirstFrame(
  "A woman standing in a room, looking at the camera",
  {
    style: "photographic",
    aspect_ratio: "4:5",
    resolution: "1080p"
  }
);
        `
      },
      {
        step: 2,
        title: "Generate Last Frame",
        description: "Create the last frame of your video sequence",
        implementation: `
// Generate last frame with Seedream 4
const lastFrame = await seedream4Executor.generateLastFrame(
  "View from the top of the room, looking down at the woman",
  {
    style: "photographic",
    aspect_ratio: "4:5",
    resolution: "1080p"
  }
);

// Or with Nano Banana
const lastFrame = await nanoBananaExecutor.generateLastFrame(
  "View from the top of the room, looking down at the woman",
  {
    style: "photographic",
    aspect_ratio: "4:5",
    resolution: "1080p"
  }
);
        `
      },
      {
        step: 3,
        title: "Use with Video Generation Tools",
        description: "Use the frames with tools like Kling or Midjourney for video generation",
        implementation: `
// Use frames with video generation tools
// The frames can be used as reference or starting points
// for other video generation tools like Kling or Midjourney

// Example: Use first frame as reference for video generation
const videoPrompt = "Camera tracks the woman, starting from the first frame reference";
        `
      },
      {
        step: 4,
        title: "Apply Camera Movement",
        description: "Add camera movement prompts for smooth transitions",
        implementation: `
// Generate video with camera movement
const videoWithMovement = await seedream4Executor.generateWithCameraMovement(
  "Camera tracks the woman as she moves through the room",
  "tracking",
  {
    style: "cinematic",
    aspect_ratio: "16:9",
    duration: "10s",
    resolution: "1080p"
  }
);
        `
      }
    ]
  },

  // ============================================================================
  // CINEMATIC CREATION WORKFLOW
  // ============================================================================
  
  cinematicCreationWorkflow: {
    title: "Cinematic Video Creation Workflow",
    description: "Create professional cinematic videos with Seedream 4 or Nano Banana",
    
    steps: [
      {
        step: 1,
        title: "Plan Your Sequence",
        description: "Plan the video sequence with first and last frames",
        implementation: `
// Plan your video sequence
const sequence = {
  firstFrame: "Hero character in ready position",
  lastFrame: "Hero character in victory pose",
  cameraMovement: "tracking",
  duration: "15s",
  style: "cinematic"
};
        `
      },
      {
        step: 2,
        title: "Generate Key Frames",
        description: "Generate first and last frames",
        implementation: `
// Generate key frames
const firstFrame = await seedream4Executor.generateFirstFrame(sequence.firstFrame);
const lastFrame = await seedream4Executor.generateLastFrame(sequence.lastFrame);
        `
      },
      {
        step: 3,
        title: "Create Camera Movement",
        description: "Generate video with camera movement",
        implementation: `
// Create camera movement video
const cameraMovement = await seedream4Executor.generateWithCameraMovement(
  "Hero character moving through the scene",
  sequence.cameraMovement,
  {
    style: sequence.style,
    duration: sequence.duration,
    resolution: "1080p"
  }
);
        `
      },
      {
        step: 4,
        title: "Refine and Iterate",
        description: "Refine the results and iterate as needed",
        implementation: `
// Refine and iterate
// Test different prompts, styles, and camera movements
// until you achieve the desired result
        `
      }
    ]
  }
};

// ============================================================================
// USAGE EXAMPLES WITH ACTUAL IMPLEMENTATION
// ============================================================================

export const seedream4NanoBananaUsageExamples = {
  
  // Basic frame generation
  generateBasicFrames: async (apiKey: string, prompt: string) => {
    const seedream4Executor = new Seedream4Executor(apiKey);
    const nanoBananaExecutor = new NanoBananaExecutor(apiKey);
    
    // Generate first frame with Seedream 4
    const firstFrame = await seedream4Executor.generateFirstFrame(prompt, {
      style: "photographic",
      aspect_ratio: "4:5",
      resolution: "1080p"
    });

    // Generate last frame with Nano Banana
    const lastFrame = await nanoBananaExecutor.generateLastFrame(
      `View from the top of the room, looking down at the woman`,
      {
        style: "photographic",
        aspect_ratio: "4:5",
        resolution: "1080p"
      }
    );

    return { firstFrame, lastFrame };
  },

  // Camera movement generation
  generateCameraMovement: async (apiKey: string, prompt: string, movement: string) => {
    const seedream4Executor = new Seedream4Executor(apiKey);
    
    const result = await seedream4Executor.generateWithCameraMovement(
      prompt,
      movement,
      {
        style: "cinematic",
        aspect_ratio: "16:9",
        duration: "10s",
        resolution: "1080p"
      }
    );

    return result;
  },

  // Vintage style generation
  generateVintageStyle: async (apiKey: string, prompt: string, vintageStyle?: string) => {
    const seedream4Executor = new Seedream4Executor(apiKey);
    
    const result = await seedream4Executor.generateVintageVideo(
      prompt,
      vintageStyle,
      {
        aspect_ratio: "4:5",
        duration: "5s",
        resolution: "1080p",
        negative_prompt: "logos, text, extra limbs, smooth skin, HDR, modern phone"
      }
    );

    return result;
  },

  // Complete workflow example
  completeWorkflow: async (apiKey: string, sceneDescription: string) => {
    const seedream4Executor = new Seedream4Executor(apiKey);
    const nanoBananaExecutor = new NanoBananaExecutor(apiKey);
    
    // Step 1: Generate first frame
    const firstFrame = await seedream4Executor.generateFirstFrame(
      `First frame: ${sceneDescription}`,
      {
        style: "photographic",
        aspect_ratio: "4:5",
        resolution: "1080p"
      }
    );

    // Step 2: Generate last frame
    const lastFrame = await nanoBananaExecutor.generateLastFrame(
      `Last frame: View from the top of the room, looking down at the scene`,
      {
        style: "photographic",
        aspect_ratio: "4:5",
        resolution: "1080p"
      }
    );

    // Step 3: Generate camera movement video
    const cameraMovement = await seedream4Executor.generateWithCameraMovement(
      `Camera tracks the scene: ${sceneDescription}`,
      "tracking",
      {
        style: "cinematic",
        aspect_ratio: "16:9",
        duration: "10s",
        resolution: "1080p"
      }
    );

    return {
      firstFrame: firstFrame.video.url,
      lastFrame: lastFrame.video.url,
      cameraMovement: cameraMovement.video.url
    };
  },

  // Batch frame generation
  generateBatchFrames: async (apiKey: string, prompts: string[]) => {
    const seedream4Executor = new Seedream4Executor(apiKey);
    const results = [];

    for (const prompt of prompts) {
      try {
        const firstFrame = await seedream4Executor.generateFirstFrame(prompt);
        const lastFrame = await seedream4Executor.generateLastFrame(
          `View from the top of the room, looking down at the scene`
        );
        
        results.push({
          success: true,
          prompt,
          firstFrame: firstFrame.video.url,
          lastFrame: lastFrame.video.url
        });
      } catch (error) {
        results.push({
          success: false,
          prompt,
          error: error.message
        });
      }
    }

    return results;
  }
};

// ============================================================================
// PROMPT TEMPLATES
// ============================================================================

export const promptTemplates = {
  
  // First frame templates
  firstFrameTemplates: {
    characterIntroduction: "First frame: {character} {action}, {expression}, {setting}",
    sceneEstablishment: "First frame: Wide shot of {location} with {lighting} and {atmosphere}",
    actionSequence: "First frame: {character} in {pose}, {expression}, ready for {action}",
    productShowcase: "First frame: {product} in {setting} with {lighting} and {angle}"
  },

  // Last frame templates
  lastFrameTemplates: {
    characterConclusion: "Last frame: {character} {action}, {expression}, {setting}",
    sceneResolution: "Last frame: {location} with {lighting} and {atmosphere}",
    actionConclusion: "Last frame: {character} in {pose}, {expression}, after {action}",
    productConclusion: "Last frame: {product} in {setting} with {lighting} and {angle}"
  },

  // Camera movement templates
  cameraMovementTemplates: {
    tracking: "Camera tracks {subject} as {action}",
    panning: "Camera pans from {start} to {end} across {scene}",
    zooming: "Camera zooms {direction} on {subject}",
    orbital: "Camera orbits around {subject} in {scene}"
  },

  // Vintage style templates
  vintageStyleTemplates: {
    vgaSelfie: "2004 VGA bar-selfie: {characters} in {setting} with {effects}",
    filmCamera: "Film camera shot with {effects} and {atmosphere}",
    retroStyle: "Retro {style} with {effects} and {atmosphere}"
  }
};

// ============================================================================
// BEST PRACTICES
// ============================================================================

export const bestPractices = {
  
  // Frame generation
  frameGeneration: [
    "Be specific about the subject's pose and expression",
    "Describe the camera angle and composition clearly",
    "Include details about lighting and atmosphere",
    "Use consistent style between first and last frames",
    "Consider the emotional arc of your video sequence"
  ],

  // Camera movement
  cameraMovement: [
    "Use specific camera movement terms (tracking, panning, zooming)",
    "Describe the speed and smoothness of movement",
    "Specify the starting and ending positions",
    "Include details about the subject being tracked",
    "Consider the emotional impact of camera movement"
  ],

  // Vintage styling
  vintageStyling: [
    "Use authentic vintage terminology and effects",
    "Include specific technical details (VGA, film grain, etc.)",
    "Use negative prompts to avoid modern elements",
    "Consider the era and aesthetic you're targeting",
    "Test different vintage styles for authenticity"
  ],

  // Workflow optimization
  workflowOptimization: [
    "Plan your video sequence before generating frames",
    "Use consistent prompts and styles across frames",
    "Test different camera movements for best results",
    "Iterate and refine based on results",
    "Consider the target platform and audience"
  ]
};

export default {
  frameGenerationExamples,
  workflowExamples,
  seedream4NanoBananaUsageExamples,
  promptTemplates,
  bestPractices
};
