/**
 * GPT Image 1 Text Editor Executor
 * 
 * Specialized executor for editing text on images and adding text to images
 * using GPT Image 1. This includes text replacement, addition, removal,
 * and styling modifications on existing images.
 * 
 * ⚠️ CRITICAL LIMITATION: GPT Image 1 has poor face character consistency.
 * NEVER use this model on images containing faces or characters, as it will
 * likely change or distort facial features during text editing operations.
 * 
 * Model: gpt-image-1
 * Specialization: Text editing, text addition, text styling on images
 * Limitation: Poor face/character consistency - avoid images with faces
 */

import { executeGPTImage1Edit, GPTImage1EditInput, GPTImage1Output, gptImage1Utils } from './gpt-image-1';

export interface TextEditInput {
  image: string; // Base64 encoded image or image URL
  operation: 'add-text' | 'replace-text' | 'remove-text' | 'style-text' | 'translate-text' | 'fix-text';
  textChanges: {
    originalText?: string; // Text to replace or remove
    newText?: string; // New text to add or replace with
    position?: {
      x: number; // X coordinate (0-100 percentage)
      y: number; // Y coordinate (0-100 percentage)
    };
    style?: {
      font?: string;
      size?: number;
      color?: string;
      weight?: 'normal' | 'bold' | 'light';
      alignment?: 'left' | 'center' | 'right';
      background?: string;
      padding?: number;
    };
  }[];
  mask?: string; // Base64 encoded mask or mask URL (optional)
  style: 'modern' | 'classic' | 'minimalist' | 'corporate' | 'creative' | 'elegant' | 'bold' | 'vintage';
  colorScheme: 'professional' | 'vibrant' | 'monochrome' | 'dark' | 'light' | 'custom';
  customColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  size: '1024x1024' | '1024x1536' | '1536x1024' | 'auto';
  quality: 'low' | 'medium' | 'high' | 'auto';
  customInstructions?: string;
  context?: string;
  preserveOriginal?: boolean; // Whether to preserve original image elements
  blendMode?: 'normal' | 'overlay' | 'multiply' | 'screen' | 'soft-light' | 'hard-light';
}

export interface TextEditOutput {
  success: boolean;
  editedImage?: {
    data: GPTImage1Output;
    metadata: {
      operation: string;
      prompt: string;
      cost: number;
      processingTime: number;
      size: string;
      quality: string;
      estimatedTokens: number;
      changesApplied: number;
    };
  };
  error?: string;
}

export interface TextEditOptions {
  timeout?: number;
  retries?: number;
  fallbackQuality?: 'low' | 'medium' | 'high';
}

/**
 * Edit text on image using GPT Image 1
 */
export async function editTextOnImage(
  input: TextEditInput,
  options: TextEditOptions = {}
): Promise<TextEditOutput> {
  const startTime = Date.now();
  
  try {
    // Validate input
    if (!input.image || input.image.trim().length === 0) {
      throw new Error('Image is required for text editing');
    }
    
    if (!input.textChanges || input.textChanges.length === 0) {
      throw new Error('Text changes are required for text editing');
    }
    
    // ⚠️ CRITICAL WARNING: Check for face/character content
    if (input.image.includes('face') || input.image.includes('character') || 
        input.image.includes('person') || input.image.includes('portrait')) {
      throw new Error('⚠️ CRITICAL: GPT Image 1 has poor face character consistency. Do not use this model on images containing faces or characters as it will likely change or distort facial features. Use only on images without faces (landscapes, objects, text-only images, etc.).');
    }
    
    // Create extremely detailed prompt
    const prompt = createTextEditPrompt(input);
    
    // Prepare GPT Image 1 edit input
    const gptInput: GPTImage1EditInput = {
      image: input.image,
      prompt,
      model: 'gpt-image-1',
      quality: input.quality || 'high',
      size: input.size || '1024x1024',
      output_format: 'png',
      n: 1,
      mask: input.mask,
      input_fidelity: input.preserveOriginal ? 'high' : 'low',
    };
    
    // Execute the model
    const result = await executeGPTImage1Edit(gptInput, {
      timeout: options.timeout || 120000,
      retries: options.retries || 2,
    });
    
    const processingTime = Date.now() - startTime;
    const estimatedTokens = estimateTokens(prompt);
    const cost = calculateCost(estimatedTokens, input.quality || 'high', input.size || '1024x1024');
    
    return {
      success: true,
      editedImage: {
        data: result,
        metadata: {
          operation: input.operation,
          prompt,
          cost,
          processingTime,
          size: input.size || '1024x1024',
          quality: input.quality || 'high',
          estimatedTokens,
          changesApplied: input.textChanges.length,
        },
      },
    };
    
  } catch (error) {
    console.error('Text editing failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Create extremely detailed prompt for text editing
 */
function createTextEditPrompt(input: TextEditInput): string {
  const {
    operation,
    textChanges,
    style,
    colorScheme,
    customColors,
    size,
    customInstructions,
    context,
    preserveOriginal,
    blendMode,
  } = input;
  
  let prompt = `Edit the image with the following EXACT text modifications:`;
  
  // Operation Type
  prompt += `\n\nOPERATION: ${operation.toUpperCase()}`;
  prompt += getOperationInstructions(operation);
  
  // Text Changes
  prompt += `\n\nTEXT CHANGES TO APPLY:`;
  textChanges.forEach((change, index) => {
    prompt += `\n\nChange ${index + 1}:`;
    
    if (change.originalText) {
      prompt += `\n- Original text: "${change.originalText}"`;
    }
    
    if (change.newText) {
      prompt += `\n- New text: "${change.newText}"`;
    }
    
    if (change.position) {
      prompt += `\n- Position: X: ${change.position.x}%, Y: ${change.position.y}%`;
    }
    
    if (change.style) {
      prompt += `\n- Style specifications:`;
      if (change.style.font) prompt += `\n  * Font: ${change.style.font}`;
      if (change.style.size) prompt += `\n  * Size: ${change.style.size}pt`;
      if (change.style.color) prompt += `\n  * Color: ${change.style.color}`;
      if (change.style.weight) prompt += `\n  * Weight: ${change.style.weight}`;
      if (change.style.alignment) prompt += `\n  * Alignment: ${change.style.alignment}`;
      if (change.style.background) prompt += `\n  * Background: ${change.style.background}`;
      if (change.style.padding) prompt += `\n  * Padding: ${change.style.padding}px`;
    }
  });
  
  // Style Specifications
  prompt += `\n\nSTYLE SPECIFICATIONS:`;
  prompt += getStyleInstructions(style);
  
  // Color Specifications
  prompt += `\n\nCOLOR SPECIFICATIONS:`;
  prompt += getColorInstructions(colorScheme, customColors);
  
  // Preservation Instructions
  if (preserveOriginal) {
    prompt += `\n\nPRESERVATION REQUIREMENTS:`;
    prompt += `\n- Preserve all original image elements and composition`;
    prompt += `\n- Only modify the specified text elements`;
    prompt += `\n- Maintain original image quality and resolution`;
    prompt += `\n- Keep original colors and lighting intact`;
    prompt += `\n- Preserve original image structure and layout`;
  }
  
  // Blend Mode
  if (blendMode) {
    prompt += `\n\nBLEND MODE: ${blendMode}`;
    prompt += getBlendModeInstructions(blendMode);
  }
  
  // Context
  if (context) {
    prompt += `\n\nCONTEXT: ${context}`;
  }
  
  // Custom Instructions
  if (customInstructions) {
    prompt += `\n\nADDITIONAL REQUIREMENTS: ${customInstructions}`;
  }
  
  // Final Quality Requirements
  prompt += `\n\nFINAL QUALITY REQUIREMENTS:`;
  prompt += `\n- Ultra-high resolution output with perfect text rendering`;
  prompt += `\n- Crisp, clear text with perfect contrast and readability`;
  prompt += `\n- Professional text styling with proper typography`;
  prompt += `\n- Consistent color application throughout`;
  prompt += `\n- Sharp, clear text with no pixelation or blurriness`;
  prompt += `\n- Perfect alignment and spacing of text elements`;
  prompt += `\n- Professional image editing quality`;
  prompt += `\n- Clean, modern aesthetic with attention to every detail`;
  prompt += `\n- Accurate text positioning and styling`;
  prompt += `\n- Consistent visual design throughout`;
  prompt += `\n- Seamless integration of text with image elements`;
  prompt += `\n- Natural-looking text that appears original to the image`;
  
  return prompt;
}

/**
 * Get operation specific instructions
 */
function getOperationInstructions(operation: string): string {
  const instructions = {
    'add-text': ` - Add new text to the image with professional styling and proper positioning. Ensure the text integrates seamlessly with the existing image elements.`,
    'replace-text': ` - Replace existing text with new text while maintaining the same position, size, and styling. Ensure the replacement looks natural and professional.`,
    'remove-text': ` - Remove specified text from the image while preserving the background and other elements. Ensure the removal looks natural and doesn't leave artifacts.`,
    'style-text': ` - Modify the styling of existing text (font, size, color, weight, etc.) while maintaining the same content and position. Ensure the styling changes look professional.`,
    'translate-text': ` - Translate existing text to a different language while maintaining the same position, size, and styling. Ensure the translation looks natural and professional.`,
    'fix-text': ` - Fix spelling, grammar, or formatting errors in existing text while maintaining the same position, size, and styling. Ensure the fixes look natural and professional.`,
  };
  
  return instructions[operation] || '';
}

/**
 * Get style instructions
 */
function getStyleInstructions(style: string): string {
  const styles = {
    modern: `\n- Clean, minimalist text styling with contemporary typography\n- Use of modern fonts and clean layouts\n- Professional and sleek appearance`,
    classic: `\n- Traditional, timeless text styling with serif typography\n- Formal layout with established design principles\n- Professional and conservative appearance`,
    minimalist: `\n- Extremely clean text styling with minimal elements\n- Focus on typography and readability\n- Simple, uncluttered appearance`,
    corporate: `\n- Professional business text styling with formal typography\n- Conservative color schemes and layouts\n- Emphasis on credibility and trust`,
    creative: `\n- Innovative, artistic text styling with unique elements\n- Creative use of typography and layout\n- Bold colors and dynamic compositions`,
    elegant: `\n- Sophisticated, refined text styling with premium feel\n- High-quality typography and spacing\n- Luxurious color schemes and materials`,
    bold: `\n- Strong, impactful text styling with bold typography\n- High contrast colors and dynamic layouts\n- Attention-grabbing visual elements`,
    vintage: `\n- Retro-inspired text styling with classic typography\n- Aged color schemes and traditional layouts\n- Nostalgic and timeless appeal`,
  };
  
  return styles[style] || styles.modern;
}

/**
 * Get color instructions
 */
function getColorInstructions(colorScheme: string, customColors?: any): string {
  let instructions = '';
  
  if (customColors) {
    instructions += `\n- Primary color: ${customColors.primary || '#2C3E50'}`;
    instructions += `\n- Secondary color: ${customColors.secondary || '#7F8C8D'}`;
    instructions += `\n- Accent color: ${customColors.accent || '#3498DB'}`;
    instructions += `\n- Background color: ${customColors.background || '#FFFFFF'}`;
    instructions += `\n- Text color: ${customColors.text || '#2C3E50'}`;
  } else {
    const colorSchemes = {
      professional: `\n- Primary: #2C3E50 (Dark Blue-Gray)\n- Secondary: #7F8C8D (Medium Gray)\n- Accent: #3498DB (Blue)\n- Background: #FFFFFF (White)\n- Text: #2C3E50 (Dark Blue-Gray)`,
      vibrant: `\n- Primary: #E74C3C (Red)\n- Secondary: #F39C12 (Orange)\n- Accent: #9B59B6 (Purple)\n- Background: #FFFFFF (White)\n- Text: #2C3E50 (Dark Blue-Gray)`,
      monochrome: `\n- Primary: #2C3E50 (Dark Gray)\n- Secondary: #7F8C8D (Medium Gray)\n- Accent: #95A5A6 (Light Gray)\n- Background: #FFFFFF (White)\n- Text: #2C3E50 (Dark Gray)`,
      dark: `\n- Primary: #FFFFFF (White)\n- Secondary: #BDC3C7 (Light Gray)\n- Accent: #3498DB (Blue)\n- Background: #2C3E50 (Dark Blue-Gray)\n- Text: #FFFFFF (White)`,
      light: `\n- Primary: #2C3E50 (Dark Blue-Gray)\n- Secondary: #7F8C8D (Medium Gray)\n- Accent: #3498DB (Blue)\n- Background: #FFFFFF (White)\n- Text: #2C3E50 (Dark Blue-Gray)`,
    };
    
    instructions += colorSchemes[colorScheme] || colorSchemes.professional;
  }
  
  instructions += `\n- Ensure proper contrast ratios for readability`;
  instructions += `\n- Use consistent color application throughout`;
  instructions += `\n- Maintain visual harmony with the original image`;
  instructions += `\n- Ensure text is clearly visible against the background`;
  
  return instructions;
}

/**
 * Get blend mode instructions
 */
function getBlendModeInstructions(blendMode: string): string {
  const instructions = {
    normal: ` - Use normal blending mode for standard text overlay`,
    overlay: ` - Use overlay blending mode for enhanced text visibility`,
    multiply: ` - Use multiply blending mode for darker text effect`,
    screen: ` - Use screen blending mode for lighter text effect`,
    'soft-light': ` - Use soft light blending mode for subtle text effect`,
    'hard-light': ` - Use hard light blending mode for strong text effect`,
  };
  
  return instructions[blendMode] || instructions.normal;
}

/**
 * Estimate tokens for cost calculation
 */
function estimateTokens(prompt: string): number {
  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(prompt.length / 4);
}

/**
 * Calculate cost based on tokens, quality, and size
 */
function calculateCost(tokens: number, quality: string, size: string): number {
  const baseCostPer1K = 0.005; // $5 per 1M tokens
  const qualityMultiplier = {
    low: 1,
    medium: 1.5,
    high: 2,
    auto: 1.5,
  };
  
  const sizeMultiplier = {
    '1024x1024': 1,
    '1024x1536': 1.5,
    '1536x1024': 1.5,
    auto: 1.25,
  };
  
  const cost = (tokens / 1000) * baseCostPer1K * qualityMultiplier[quality] * sizeMultiplier[size];
  return Math.round(cost * 10000) / 10000; // Round to 4 decimal places
}

export default {
  editTextOnImage,
  createTextEditPrompt,
};
