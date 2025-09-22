/**
 * 🎬 Studio Blueprint Service - Phase 3
 * 
 * Service for generating human-readable creative plans using GPT-5 reasoning model.
 * This creates director treatments before manifest serialization.
 */

import { executeGPT5 } from '../executors/gpt-5';
import { 
  StudioBlueprint, 
  BlueprintGenerationInput, 
  CreateBlueprintRequest, 
  CreateBlueprintResponse,
  BlueprintValidationResult,
  ProjectOverview,
  SceneBlueprint,
  AudioArc,
  ConsistencyRules
} from '../types/studio-blueprint';
import { 
  StudioBlueprintSchema, 
  validateStudioBlueprint,
  validateBlueprintInput 
} from '../validators/studio-blueprint';

// ========================================
// 1. GPT-5 PROMPT TEMPLATE
// ========================================

function generateStudioBlueprintPrompt(input: BlueprintGenerationInput): string {
  const { userIntent, userAssets, constraints, options } = input;
  
  const creativeLevel = options?.creativeLevel || 'professional';
  const maxScenes = options?.maxScenes || 10;
  
  return `You are a creative director planning a short-form video production.

INPUTS:
- User Intent: "${userIntent}"
- User Assets: ${userAssets.length > 0 ? userAssets.map(a => `\n  - ${a.id}: ${a.type} - "${a.description}"`).join('') : 'None provided'}
- Duration: ${constraints.duration || 'Not specified'} seconds
- Aspect Ratio: ${constraints.aspectRatio || 'Not specified'}
- Platform: ${constraints.platform || 'Not specified'}
- Language: ${constraints.language || 'English'}
- Tone: ${constraints.tone || 'Professional'}
- Creative Level: ${creativeLevel}
- Max Scenes: ${maxScenes}

TASK:
Write a human-readable production plan in Markdown format. This is a director's treatment that a creative producer can read and approve.

REQUIRED STRUCTURE:
# Production Plan: [Project Title]

## Overview
- Intent: [video/image/audio]
- Duration: [XX seconds]
- Aspect Ratio: [16:9, 9:16, etc.]
- Platform: [YouTube, TikTok, etc.]
- Language: [English]
- Tone: [Inspirational / Informative / etc.]

## Scenes
### Scene 1: [Purpose: Hook]
- Duration: X sec
- Narration: "..."
- Voice: [ElevenLabs / Style: Friendly Female]
- Visuals:
  - [User Asset: graduation photo, slow zoom in]
  - [AI Gen Asset: "Cinematic campus b-roll"]
- Effects: [cinematic_zoom, fade_in]
- Music: [neutral, intro]

### Scene 2: [Purpose: Body]
- Duration: X sec
- Narration: "..."
- Voice: [ElevenLabs / Style: Confident Female]
- Visuals:
  - [AI Gen Asset: "classroom discussion with students"]
  - [Chart Overlay: job opportunities graph]
- Effects: [pan, parallax_scroll]
- Music: [uplift, build]

### Scene 3: [Purpose: CTA]
- Duration: X sec
- Narration: "..."
- Voice: [ElevenLabs / Style: Confident Female]
- Visuals:
  - [AI Gen Asset: branded endcard with CTA]
- Effects: [bokeh_transition]
- Music: [resolve, outro]

## Audio Arc
- Intro: light neutral music
- Build: uplifting motivational
- Outro: resolve, soft fade
- SFX: whoosh at scene 1 transition

## Consistency Rules
- Faces locked (AI generation consistent)
- Voice consistent (same ElevenLabs voice)
- Brand colors: #0F172A, #3B82F6
- Enforce text→image→video pipeline

CRITICAL REQUIREMENTS:
- Do NOT output JSON
- Do NOT use code fences unless explicitly asked
- Style: concise, professional, creative treatment
- Each scene must have purpose, narration, visuals, audio, and effects
- Music arc and SFX must be called out
- Consistency rules must be summarized
- No hallucinated metadata (only reference "User Asset" or "AI Gen Asset")
- Make it readable by humans (creator, producer, QA)
- Ensure total scene durations match the specified duration
- Use creative, engaging descriptions that inspire production teams

RESPOND WITH ONLY THE COMPLETE HUMAN-READABLE PRODUCTION PLAN:`;
}

// ========================================
// 2. MARKDOWN PARSER
// ========================================

function parseMarkdownBlueprint(markdown: string): Partial<StudioBlueprint> {
  const lines = markdown.split('\n');
  let currentSection = '';
  let currentScene: Partial<SceneBlueprint> | null = null;
  
  const blueprint: Partial<StudioBlueprint> = {
    projectTitle: '',
    overview: {} as ProjectOverview,
    scenes: [],
    audioArc: {} as AudioArc,
    consistencyRules: {} as ConsistencyRules,
    status: 'generated'
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Parse project title
    if (line.startsWith('# Production Plan:')) {
      blueprint.projectTitle = line.replace('# Production Plan:', '').trim();
      continue;
    }
    
    // Parse sections
    if (line.startsWith('## Overview')) {
      currentSection = 'overview';
      continue;
    } else if (line.startsWith('## Scenes')) {
      currentSection = 'scenes';
      continue;
    } else if (line.startsWith('## Audio Arc')) {
      currentSection = 'audioArc';
      continue;
    } else if (line.startsWith('## Consistency Rules')) {
      currentSection = 'consistencyRules';
      continue;
    }
    
    // Parse scene headers
    if (line.startsWith('### Scene')) {
      if (currentScene) {
        blueprint.scenes!.push(currentScene as SceneBlueprint);
      }
      
      const sceneMatch = line.match(/### Scene (\d+): \[Purpose: (.+)\]/);
      if (sceneMatch) {
        currentScene = {
          id: `scene_${sceneMatch[1]}`,
          purpose: sceneMatch[2],
          duration: 0,
          narration: '',
          voice: { provider: 'elevenlabs', style: '' },
          visuals: [],
          effects: [],
          music: { style: '', intensity: 'medium', description: '' }
        };
      }
      continue;
    }
    
    // Parse overview fields
    if (currentSection === 'overview' && line.startsWith('- ')) {
      const [key, value] = line.replace('- ', '').split(': ');
      if (key && value) {
        switch (key.toLowerCase()) {
          case 'intent':
            blueprint.overview!.intent = value as 'video' | 'image' | 'audio';
            break;
          case 'duration':
            blueprint.overview!.duration = parseInt(value.replace(' seconds', '').replace('s', ''));
            break;
          case 'aspect ratio':
            blueprint.overview!.aspectRatio = value;
            break;
          case 'platform':
            blueprint.overview!.platform = value;
            break;
          case 'language':
            blueprint.overview!.language = value;
            break;
          case 'tone':
            blueprint.overview!.tone = value;
            break;
        }
      }
      continue;
    }
    
    // Parse scene fields
    if (currentSection === 'scenes' && currentScene && line.startsWith('- ')) {
      const [key, value] = line.replace('- ', '').split(': ');
      if (key && value) {
        switch (key.toLowerCase()) {
          case 'duration':
            currentScene.duration = parseInt(value.replace(' sec', '').replace('s', ''));
            break;
          case 'narration':
            currentScene.narration = value.replace(/"/g, '');
            break;
          case 'voice':
            const voiceMatch = value.match(/\[(.+?) \/ Style: (.+)\]/);
            if (voiceMatch) {
              currentScene.voice = {
                provider: voiceMatch[1].toLowerCase() as 'elevenlabs',
                style: voiceMatch[2]
              };
            }
            break;
          case 'visuals':
            // Parse visual elements (simplified)
            const visualLines = [line];
            let j = i + 1;
            while (j < lines.length && lines[j].startsWith('  - ')) {
              visualLines.push(lines[j]);
              j++;
            }
            
            currentScene.visuals = visualLines.map(vl => {
              const visualMatch = vl.match(/  - \[(.+?): (.+)\]/);
              if (visualMatch) {
                return {
                  type: visualMatch[1].toLowerCase().replace(' ', '_') as any,
                  description: visualMatch[2]
                };
              }
              return {
                type: 'ai_generated' as const,
                description: vl.replace('  - ', '')
              };
            });
            break;
          case 'effects':
            currentScene.effects = value.replace(/\[|\]/g, '').split(', ').map(e => e.trim());
            break;
          case 'music':
            const musicMatch = value.match(/\[(.+?), (.+)\]/);
            if (musicMatch) {
              currentScene.music = {
                style: musicMatch[1],
                intensity: musicMatch[2] as 'low' | 'medium' | 'high',
                description: `${musicMatch[1]} ${musicMatch[2]}`
              };
            }
            break;
        }
      }
      continue;
    }
    
    // Parse audio arc
    if (currentSection === 'audioArc' && line.startsWith('- ')) {
      const [key, value] = line.replace('- ', '').split(': ');
      if (key && value && blueprint.audioArc) {
        switch (key.toLowerCase()) {
          case 'intro':
            blueprint.audioArc.intro = { description: value, style: 'intro', intensity: 'low' };
            break;
          case 'build':
            blueprint.audioArc.build = { description: value, style: 'build', intensity: 'medium' };
            break;
          case 'outro':
            blueprint.audioArc.outro = { description: value, style: 'outro', intensity: 'low' };
            break;
          case 'sfx':
            if (!blueprint.audioArc.soundEffects) blueprint.audioArc.soundEffects = [];
            blueprint.audioArc.soundEffects.push({
              name: value.split(' at ')[0],
              timing: value.split(' at ')[1] || 'general'
            });
            break;
        }
      }
      continue;
    }
    
    // Parse consistency rules
    if (currentSection === 'consistencyRules' && line.startsWith('- ')) {
      const [key, value] = line.replace('- ', '').split(': ');
      if (key && value && blueprint.consistencyRules) {
        switch (key.toLowerCase()) {
          case 'faces':
            blueprint.consistencyRules.faces = value;
            break;
          case 'voice':
            blueprint.consistencyRules.voice = value;
            break;
          case 'brand colors':
            blueprint.consistencyRules.colorPalette = value.split(', ').map(c => c.trim());
            break;
          case 'typography':
            blueprint.consistencyRules.typography = value;
            break;
          case 'branding':
            blueprint.consistencyRules.branding = value;
            break;
        }
      }
      continue;
    }
  }
  
  // Add the last scene
  if (currentScene) {
    blueprint.scenes!.push(currentScene as SceneBlueprint);
  }
  
  return blueprint;
}

// ========================================
// 3. MAIN SERVICE CLASS
// ========================================

export class StudioBlueprintService {
  private defaultOptions = {
    model: 'gpt-5' as const,
    temperature: 0.7,
    maxTokens: 4000
  };

  /**
   * Generate a Studio Blueprint using GPT-5 reasoning model
   */
  async generateBlueprint(request: CreateBlueprintRequest): Promise<CreateBlueprintResponse> {
    const startTime = Date.now();
    
    try {
      // Validate input
      const inputValidation = validateBlueprintInput(request.input);
      if (!inputValidation.valid) {
        return {
          success: false,
          error: inputValidation.error || 'Invalid input data'
        };
      }
      
      // Generate prompt
      const prompt = generateStudioBlueprintPrompt(request.input);
      
      // Call GPT-5
      const options = { ...this.defaultOptions, ...request.options };
      const gpt5Response = await executeGPT5({
        prompt,
        reasoning_effort: 'high',
        verbosity: 'medium',
        max_completion_tokens: options.maxTokens,
        temperature: options.temperature
      });
      
      // Parse markdown response
      const markdownContent = gpt5Response.text;
      const parsedBlueprint = parseMarkdownBlueprint(markdownContent);
      
      // Create complete blueprint
      const blueprint: StudioBlueprint = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        userId: request.userId,
        sourceRefs: {
          analyzerRef: request.input.analyzerOutput?.id,
          refinerRef: request.input.refinerOutput?.id,
          scriptRef: request.input.scriptOutput?.id
        },
        projectTitle: parsedBlueprint.projectTitle || 'Untitled Production',
        overview: parsedBlueprint.overview || {
          intent: 'video',
          duration: request.input.constraints.duration || 60,
          aspectRatio: request.input.constraints.aspectRatio || '16:9',
          platform: request.input.constraints.platform || 'YouTube',
          language: request.input.constraints.language || 'English',
          tone: request.input.constraints.tone || 'Professional'
        },
        scenes: parsedBlueprint.scenes || [],
        audioArc: parsedBlueprint.audioArc || {
          intro: { description: 'Light intro music', style: 'intro', intensity: 'low' },
          build: { description: 'Building energy', style: 'build', intensity: 'medium' },
          outro: { description: 'Soft resolution', style: 'outro', intensity: 'low' },
          soundEffects: []
        },
        consistencyRules: parsedBlueprint.consistencyRules || {
          faces: 'locked',
          voice: 'consistent',
          typography: 'modern sans-serif',
          colorPalette: ['#0F172A', '#3B82F6'],
          branding: 'professional'
        },
        status: 'generated',
        processingTimeMs: Date.now() - startTime,
        warnings: []
      };
      
      // Validate the generated blueprint
      const validation = validateStudioBlueprint(blueprint);
      blueprint.qualityScore = validation.qualityScore;
      blueprint.warnings = validation.warnings;
      
      if (!validation.valid) {
        blueprint.warnings = blueprint.warnings || [];
        blueprint.warnings.push(`Validation errors: ${validation.errors.map(e => e.message).join(', ')}`);
      }
      
      return {
        success: true,
        data: blueprint,
        processingTimeMs: Date.now() - startTime,
        warnings: blueprint.warnings
      };
      
    } catch (error) {
      console.error('🎬 [Studio Blueprint Service] Generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during blueprint generation',
        processingTimeMs: Date.now() - startTime
      };
    }
  }
  
  /**
   * Validate a Studio Blueprint
   */
  validateBlueprint(blueprint: unknown): BlueprintValidationResult {
    return validateStudioBlueprint(blueprint);
  }
  
  /**
   * Convert Studio Blueprint to Production Manifest (for Phase 4)
   */
  async convertToManifest(blueprint: StudioBlueprint): Promise<{ success: boolean; manifest?: any; error?: string }> {
    try {
      // This will be implemented in Phase 4
      // For now, return a placeholder
      return {
        success: false,
        error: 'Manifest conversion not yet implemented (Phase 4)'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown conversion error'
      };
    }
  }
}

// ========================================
// 4. EXPORTED FUNCTIONS
// ========================================

export const studioBlueprintService = new StudioBlueprintService();

export async function generateStudioBlueprint(request: CreateBlueprintRequest): Promise<CreateBlueprintResponse> {
  return studioBlueprintService.generateBlueprint(request);
}

export function validateStudioBlueprintData(blueprint: unknown): BlueprintValidationResult {
  return studioBlueprintService.validateBlueprint(blueprint);
}
