/**
 * GPT Image 1 Text Designer Executor
 * 
 * Specialized executor for generating text-heavy designs using GPT Image 1.
 * This includes brochures, flyers, posters, business cards, and other
 * marketing materials that require excellent text rendering and typography.
 * 
 * ⚠️ CRITICAL LIMITATION: GPT Image 1 has poor face character consistency.
 * NEVER use this model for designs that include faces or characters, as it will
 * likely change or distort facial features. Use only for text-heavy designs
 * without human faces or characters.
 * 
 * Model: gpt-image-1
 * Specialization: Text-heavy designs, typography, marketing materials
 * Limitation: Poor face/character consistency - avoid faces in designs
 */

import { executeGPTImage1, GPTImage1Input, GPTImage1Output, gptImage1Utils } from './gpt-image-1';

export interface TextDesignInput {
  designType: 'brochure' | 'flyer' | 'poster' | 'business-card' | 'banner' | 'newsletter' | 'menu' | 'invitation' | 'certificate' | 'label';
  title: string;
  subtitle?: string;
  content: string[];
  companyName?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
  };
  style: 'modern' | 'classic' | 'minimalist' | 'corporate' | 'creative' | 'elegant' | 'bold' | 'vintage';
  colorScheme: 'professional' | 'vibrant' | 'monochrome' | 'pastel' | 'dark' | 'custom';
  customColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  layout: 'single-column' | 'two-column' | 'three-column' | 'grid' | 'asymmetric' | 'centered';
  orientation: 'portrait' | 'landscape' | 'square';
  size: '1024x1024' | '1024x1536' | '1536x1024' | 'auto';
  quality: 'low' | 'medium' | 'high' | 'auto';
  customInstructions?: string;
  context?: string;
  targetAudience?: string;
  callToAction?: string;
  logo?: string; // Description of logo to include
  images?: string[]; // Descriptions of images to include
  typography?: {
    primaryFont?: string;
    secondaryFont?: string;
    headingSize?: 'small' | 'medium' | 'large' | 'extra-large';
    bodySize?: 'small' | 'medium' | 'large';
  };
}

export interface TextDesignOutput {
  success: boolean;
  design?: {
    data: GPTImage1Output;
    metadata: {
      designType: string;
      prompt: string;
      cost: number;
      processingTime: number;
      size: string;
      quality: string;
      estimatedTokens: number;
    };
  };
  error?: string;
}

export interface TextDesignOptions {
  timeout?: number;
  retries?: number;
  fallbackQuality?: 'low' | 'medium' | 'high';
}

/**
 * Generate text-heavy design using GPT Image 1
 */
export async function generateTextDesign(
  input: TextDesignInput,
  options: TextDesignOptions = {}
): Promise<TextDesignOutput> {
  const startTime = Date.now();
  
  try {
    // Validate input
    if (!input.title || input.title.trim().length === 0) {
      throw new Error('Title is required for text design');
    }
    
    if (!input.content || input.content.length === 0) {
      throw new Error('Content is required for text design');
    }
    
    // ⚠️ CRITICAL WARNING: Check for face/character content in images
    if (input.images && input.images.some(img => 
      img.toLowerCase().includes('face') || 
      img.toLowerCase().includes('character') || 
      img.toLowerCase().includes('person') || 
      img.toLowerCase().includes('portrait') ||
      img.toLowerCase().includes('people') ||
      img.toLowerCase().includes('human')
    )) {
      throw new Error('⚠️ CRITICAL: GPT Image 1 has poor face character consistency. Do not include images with faces or characters in your design. Use only images without faces (landscapes, objects, abstract designs, etc.).');
    }
    
    // Create extremely detailed prompt
    const prompt = createTextDesignPrompt(input);
    
    // Prepare GPT Image 1 input
    const gptInput: GPTImage1Input = {
      prompt,
      model: 'gpt-image-1',
      quality: input.quality || 'high',
      size: input.size || '1024x1536',
      output_format: 'png',
      n: 1,
    };
    
    // Execute the model
    const result = await executeGPTImage1(gptInput, {
      timeout: options.timeout || 120000,
      retries: options.retries || 2,
    });
    
    const processingTime = Date.now() - startTime;
    const estimatedTokens = estimateTokens(prompt);
    const cost = calculateCost(estimatedTokens, input.quality || 'high', input.size || '1024x1536');
    
    return {
      success: true,
      design: {
        data: result,
        metadata: {
          designType: input.designType,
          prompt,
          cost,
          processingTime,
          size: input.size || '1024x1536',
          quality: input.quality || 'high',
          estimatedTokens,
        },
      },
    };
    
  } catch (error) {
    console.error('Text design generation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Create extremely detailed prompt for text design
 */
function createTextDesignPrompt(input: TextDesignInput): string {
  const {
    designType,
    title,
    subtitle,
    content,
    companyName,
    contactInfo,
    style,
    colorScheme,
    customColors,
    layout,
    orientation,
    size,
    customInstructions,
    context,
    targetAudience,
    callToAction,
    logo,
    images,
    typography,
  } = input;
  
  let prompt = `Create a highly detailed, professional ${designType} design with the following EXACT specifications:`;
  
  // Design Type Specific Instructions
  prompt += `\n\nDESIGN TYPE: ${designType.toUpperCase()}`;
  prompt += getDesignTypeInstructions(designType);
  
  // Title Specifications
  prompt += `\n\nTITLE: "${title}"`;
  prompt += getTitleInstructions(designType, typography);
  
  // Subtitle Specifications
  if (subtitle) {
    prompt += `\n\nSUBTITLE: "${subtitle}"`;
    prompt += getSubtitleInstructions(designType, typography);
  }
  
  // Content Specifications
  prompt += `\n\nCONTENT TO INCLUDE:`;
  content.forEach((item, index) => {
    prompt += `\n${index + 1}. "${item}"`;
  });
  prompt += getContentInstructions(designType, typography);
  
  // Company Information
  if (companyName) {
    prompt += `\n\nCOMPANY NAME: "${companyName}"`;
    prompt += getCompanyNameInstructions(designType, typography);
  }
  
  // Contact Information
  if (contactInfo) {
    prompt += `\n\nCONTACT INFORMATION:`;
    if (contactInfo.phone) prompt += `\nPhone: ${contactInfo.phone}`;
    if (contactInfo.email) prompt += `\nEmail: ${contactInfo.email}`;
    if (contactInfo.website) prompt += `\nWebsite: ${contactInfo.website}`;
    if (contactInfo.address) prompt += `\nAddress: ${contactInfo.address}`;
    prompt += getContactInfoInstructions(designType, typography);
  }
  
  // Call to Action
  if (callToAction) {
    prompt += `\n\nCALL TO ACTION: "${callToAction}"`;
    prompt += getCallToActionInstructions(designType, typography);
  }
  
  // Logo Specifications
  if (logo) {
    prompt += `\n\nLOGO: ${logo}`;
    prompt += getLogoInstructions(designType);
  }
  
  // Image Specifications
  if (images && images.length > 0) {
    prompt += `\n\nIMAGES TO INCLUDE:`;
    images.forEach((image, index) => {
      prompt += `\nImage ${index + 1}: ${image}`;
    });
    prompt += getImageInstructions(designType);
  }
  
  // Layout Specifications
  prompt += `\n\nLAYOUT SPECIFICATIONS:`;
  prompt += getLayoutInstructions(layout, orientation, designType);
  
  // Typography Specifications
  prompt += `\n\nTYPOGRAPHY SPECIFICATIONS:`;
  prompt += getTypographyInstructions(typography, designType);
  
  // Color Specifications
  prompt += `\n\nCOLOR SPECIFICATIONS:`;
  prompt += getColorInstructions(colorScheme, customColors, designType);
  
  // Style Specifications
  prompt += `\n\nSTYLE SPECIFICATIONS:`;
  prompt += getStyleInstructions(style, designType);
  
  // Context and Target Audience
  if (context) {
    prompt += `\n\nCONTEXT: ${context}`;
  }
  if (targetAudience) {
    prompt += `\n\nTARGET AUDIENCE: ${targetAudience}`;
  }
  
  // Custom Instructions
  if (customInstructions) {
    prompt += `\n\nADDITIONAL REQUIREMENTS: ${customInstructions}`;
  }
  
  // Final Quality Requirements
  prompt += `\n\nFINAL QUALITY REQUIREMENTS:`;
  prompt += `\n- Ultra-high resolution output suitable for print and digital use`;
  prompt += `\n- Perfect text rendering with crisp, readable typography`;
  prompt += `\n- Professional layout with proper spacing and alignment`;
  prompt += `\n- Consistent color application throughout`;
  prompt += `\n- Sharp, clear text with perfect contrast`;
  prompt += `\n- No pixelation or blurriness in text or graphics`;
  prompt += `\n- Proper visual hierarchy with clear information flow`;
  prompt += `\n- Professional business presentation quality`;
  prompt += `\n- Clean, modern aesthetic with attention to every detail`;
  prompt += `\n- Accurate text positioning and spacing`;
  prompt += `\n- Consistent visual branding throughout`;
  
  return prompt;
}

/**
 * Get design type specific instructions
 */
function getDesignTypeInstructions(designType: string): string {
  const instructions = {
    brochure: ` - Create a multi-panel brochure layout with clear sections, professional business styling, and excellent readability. Include proper margins, columns, and visual hierarchy.`,
    flyer: ` - Create a single-page flyer with eye-catching design, clear messaging, and strong visual impact. Focus on immediate attention-grabbing elements.`,
    poster: ` - Create a large-format poster with bold typography, strong visual elements, and clear messaging that can be read from a distance.`,
    'business-card': ` - Create a professional business card with clean layout, proper spacing, and all essential contact information clearly displayed.`,
    banner: ` - Create a web or print banner with clear messaging, appropriate sizing, and professional appearance.`,
    newsletter: ` - Create a newsletter layout with multiple sections, clear typography, and professional business styling.`,
    menu: ` - Create a restaurant menu with clear sections, readable typography, and appetizing visual presentation.`,
    invitation: ` - Create an elegant invitation with formal styling, clear event details, and sophisticated design elements.`,
    certificate: ` - Create a formal certificate with official styling, clear text, and professional appearance.`,
    label: ` - Create a product label with clear branding, readable text, and appropriate sizing for the product.`,
  };
  
  return instructions[designType] || '';
}

/**
 * Get title instructions
 */
function getTitleInstructions(designType: string, typography?: any): string {
  const fontSizes = {
    brochure: '24-32pt',
    flyer: '28-36pt',
    poster: '36-48pt',
    'business-card': '18-24pt',
    banner: '24-32pt',
    newsletter: '22-28pt',
    menu: '24-30pt',
    invitation: '26-32pt',
    certificate: '28-34pt',
    label: '16-22pt',
  };
  
  const size = fontSizes[designType] || '24-32pt';
  
  return ` - Use large, bold, professional typography (${size} font size), positioned prominently at the top with proper spacing (20-30px margin from top edge). Use a modern sans-serif font like Arial, Helvetica, or similar. Title should be in dark color (#2C3E50 or #34495E) for maximum readability. Ensure perfect alignment and spacing.`;
}

/**
 * Get subtitle instructions
 */
function getSubtitleInstructions(designType: string, typography?: any): string {
  const fontSizes = {
    brochure: '16-20pt',
    flyer: '18-22pt',
    poster: '20-24pt',
    'business-card': '12-16pt',
    banner: '16-20pt',
    newsletter: '16-20pt',
    menu: '18-22pt',
    invitation: '18-22pt',
    certificate: '20-24pt',
    label: '12-16pt',
  };
  
  const size = fontSizes[designType] || '16-20pt';
  
  return ` - Place directly below the title with 10-15px spacing. Use medium weight font (${size}), slightly lighter color (#7F8C8D or #95A5A6), same font family as title. Ensure proper alignment and readability.`;
}

/**
 * Get content instructions
 */
function getContentInstructions(designType: string, typography?: any): string {
  const fontSizes = {
    brochure: '12-14pt',
    flyer: '14-16pt',
    poster: '16-18pt',
    'business-card': '10-12pt',
    banner: '12-14pt',
    newsletter: '12-14pt',
    menu: '14-16pt',
    invitation: '14-16pt',
    certificate: '16-18pt',
    label: '10-12pt',
  };
  
  const size = fontSizes[designType] || '12-14pt';
  
  return ` - Use clear, readable typography (${size} font size), proper line spacing (1.4-1.6), and consistent formatting. Ensure excellent readability with proper contrast and spacing between elements. Use bullet points or numbered lists where appropriate.`;
}

/**
 * Get company name instructions
 */
function getCompanyNameInstructions(designType: string, typography?: any): string {
  return ` - Display prominently with professional styling, consistent with overall design theme. Use appropriate font size and weight to establish brand presence.`;
}

/**
 * Get contact info instructions
 */
function getContactInfoInstructions(designType: string, typography?: any): string {
  return ` - Display in clear, readable format with proper spacing. Use consistent typography and ensure all contact information is easily accessible and professional.`;
}

/**
 * Get call to action instructions
 */
function getCallToActionInstructions(designType: string, typography?: any): string {
  return ` - Make prominent and eye-catching with bold typography, contrasting colors, and clear positioning. Use action-oriented language and ensure it stands out from other content.`;
}

/**
 * Get logo instructions
 */
function getLogoInstructions(designType: string): string {
  return ` - Integrate seamlessly into the design with proper sizing, positioning, and spacing. Ensure it maintains brand consistency and doesn't interfere with text readability.`;
}

/**
 * Get image instructions
 */
function getImageInstructions(designType: string): string {
  return ` - Integrate with proper sizing, positioning, and spacing. Ensure images complement the text and don't interfere with readability. Use appropriate image placement and sizing for the design type.`;
}

/**
 * Get layout instructions
 */
function getLayoutInstructions(layout: string, orientation: string, designType: string): string {
  let instructions = `\n- Layout: ${layout}`;
  instructions += `\n- Orientation: ${orientation}`;
  
  if (layout === 'single-column') {
    instructions += `\n- Single column layout with centered content, proper margins (40-60px), and clear vertical flow`;
  } else if (layout === 'two-column') {
    instructions += `\n- Two column layout with balanced content distribution, proper column spacing (20-30px), and clear visual separation`;
  } else if (layout === 'three-column') {
    instructions += `\n- Three column layout with equal column widths, proper spacing (15-25px), and clear content organization`;
  } else if (layout === 'grid') {
    instructions += `\n- Grid layout with consistent spacing, proper alignment, and organized content blocks`;
  } else if (layout === 'asymmetric') {
    instructions += `\n- Asymmetric layout with dynamic positioning, balanced visual weight, and creative content placement`;
  } else if (layout === 'centered') {
    instructions += `\n- Centered layout with balanced content, proper spacing, and focused attention on key elements`;
  }
  
  instructions += `\n- Ensure proper margins and padding throughout`;
  instructions += `\n- Maintain consistent spacing between elements`;
  instructions += `\n- Create clear visual hierarchy and information flow`;
  
  return instructions;
}

/**
 * Get typography instructions
 */
function getTypographyInstructions(typography?: any, designType?: string): string {
  let instructions = '';
  
  if (typography?.primaryFont) {
    instructions += `\n- Primary font: ${typography.primaryFont}`;
  } else {
    instructions += `\n- Primary font: Modern sans-serif (Arial, Helvetica, or similar)`;
  }
  
  if (typography?.secondaryFont) {
    instructions += `\n- Secondary font: ${typography.secondaryFont}`;
  } else {
    instructions += `\n- Secondary font: Complementary serif or sans-serif`;
  }
  
  if (typography?.headingSize) {
    instructions += `\n- Heading size: ${typography.headingSize}`;
  }
  
  if (typography?.bodySize) {
    instructions += `\n- Body text size: ${typography.bodySize}`;
  }
  
  instructions += `\n- Ensure perfect text rendering with crisp, clear typography`;
  instructions += `\n- Use appropriate font weights and styles for hierarchy`;
  instructions += `\n- Maintain consistent typography throughout the design`;
  instructions += `\n- Ensure excellent readability and contrast`;
  
  return instructions;
}

/**
 * Get color instructions
 */
function getColorInstructions(colorScheme: string, customColors?: any, designType?: string): string {
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
      pastel: `\n- Primary: #85C1E9 (Light Blue)\n- Secondary: #F8C471 (Light Orange)\n- Accent: #D7BDE2 (Light Purple)\n- Background: #FFFFFF (White)\n- Text: #2C3E50 (Dark Blue-Gray)`,
      dark: `\n- Primary: #FFFFFF (White)\n- Secondary: #BDC3C7 (Light Gray)\n- Accent: #3498DB (Blue)\n- Background: #2C3E50 (Dark Blue-Gray)\n- Text: #FFFFFF (White)`,
    };
    
    instructions += colorSchemes[colorScheme] || colorSchemes.professional;
  }
  
  instructions += `\n- Ensure proper contrast ratios for accessibility`;
  instructions += `\n- Use consistent color application throughout`;
  instructions += `\n- Maintain visual harmony and professional appearance`;
  
  return instructions;
}

/**
 * Get style instructions
 */
function getStyleInstructions(style: string, designType?: string): string {
  const styles = {
    modern: `\n- Clean, minimalist design with sharp lines and contemporary typography\n- Use of white space and modern color palettes\n- Geometric shapes and clean layouts`,
    classic: `\n- Traditional, timeless design with serif typography\n- Formal layout with established design principles\n- Professional and conservative styling`,
    minimalist: `\n- Extremely clean design with minimal elements\n- Focus on typography and white space\n- Simple, uncluttered layout`,
    corporate: `\n- Professional business styling with formal typography\n- Conservative color schemes and layouts\n- Emphasis on credibility and trust`,
    creative: `\n- Innovative, artistic design with unique elements\n- Creative use of typography and layout\n- Bold colors and dynamic compositions`,
    elegant: `\n- Sophisticated, refined design with premium feel\n- High-quality typography and spacing\n- Luxurious color schemes and materials`,
    bold: `\n- Strong, impactful design with bold typography\n- High contrast colors and dynamic layouts\n- Attention-grabbing visual elements`,
    vintage: `\n- Retro-inspired design with classic typography\n- Aged color schemes and traditional layouts\n- Nostalgic and timeless appeal`,
  };
  
  return styles[style] || styles.modern;
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
  generateTextDesign,
  createTextDesignPrompt,
};
