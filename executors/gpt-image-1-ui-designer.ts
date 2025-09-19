/**
 * GPT Image 1 UI Designer Executor
 * 
 * Specialized executor for generating UI/UX designs using GPT Image 1.
 * This includes web apps, mobile apps, dashboards, and other interface
 * designs that require excellent text rendering and user experience.
 * 
 * ⚠️ CRITICAL LIMITATION: GPT Image 1 has poor face character consistency.
 * NEVER use this model for UI designs that include faces or characters, as it will
 * likely change or distort facial features. Use only for interface designs
 * without human faces or characters (avatars, profile pictures, etc.).
 * 
 * Model: gpt-image-1
 * Specialization: UI/UX design, interface design, user experience
 * Limitation: Poor face/character consistency - avoid faces in UI designs
 */

import { executeGPTImage1, GPTImage1Input, GPTImage1Output, gptImage1Utils } from './gpt-image-1';

export interface UIDesignInput {
  designType: 'web-app' | 'mobile-app' | 'dashboard' | 'landing-page' | 'admin-panel' | 'ecommerce' | 'portfolio' | 'blog' | 'saas' | 'game-ui';
  appName: string;
  description: string;
  features: string[];
  targetUsers?: string;
  style: 'modern' | 'minimalist' | 'corporate' | 'creative' | 'elegant' | 'bold' | 'material' | 'flat' | 'neumorphism' | 'glassmorphism';
  colorScheme: 'professional' | 'vibrant' | 'monochrome' | 'dark' | 'light' | 'custom';
  customColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
    surface?: string;
  };
  layout: 'single-page' | 'multi-page' | 'dashboard' | 'grid' | 'sidebar' | 'tabs';
  orientation: 'portrait' | 'landscape' | 'square';
  size: '1024x1024' | '1024x1536' | '1536x1024' | 'auto';
  quality: 'low' | 'medium' | 'high' | 'auto';
  customInstructions?: string;
  context?: string;
  branding?: {
    logo?: string;
    tagline?: string;
    companyName?: string;
  };
  navigation?: {
    type: 'header' | 'sidebar' | 'bottom' | 'floating' | 'hamburger';
    items: string[];
  };
  content?: {
    hero?: string;
    sections?: string[];
    callToAction?: string;
  };
  typography?: {
    primaryFont?: string;
    secondaryFont?: string;
    headingSize?: 'small' | 'medium' | 'large' | 'extra-large';
    bodySize?: 'small' | 'medium' | 'large';
  };
  components?: {
    buttons?: string[];
    forms?: string[];
    cards?: string[];
    modals?: string[];
  };
}

export interface UIDesignOutput {
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

export interface UIDesignOptions {
  timeout?: number;
  retries?: number;
  fallbackQuality?: 'low' | 'medium' | 'high';
}

/**
 * Generate UI/UX design using GPT Image 1
 */
export async function generateUIDesign(
  input: UIDesignInput,
  options: UIDesignOptions = {}
): Promise<UIDesignOutput> {
  const startTime = Date.now();
  
  try {
    // Validate input
    if (!input.appName || input.appName.trim().length === 0) {
      throw new Error('App name is required for UI design');
    }
    
    if (!input.description || input.description.trim().length === 0) {
      throw new Error('Description is required for UI design');
    }
    
    if (!input.features || input.features.length === 0) {
      throw new Error('Features are required for UI design');
    }
    
    // ⚠️ CRITICAL WARNING: Check for face/character content in UI elements
    const hasFaceContent = input.features.some(feature => 
      feature.toLowerCase().includes('avatar') || 
      feature.toLowerCase().includes('profile picture') || 
      feature.toLowerCase().includes('user photo') ||
      feature.toLowerCase().includes('face') ||
      feature.toLowerCase().includes('character') ||
      feature.toLowerCase().includes('person')
    ) || (input.content && (
      input.content.hero?.toLowerCase().includes('avatar') ||
      input.content.hero?.toLowerCase().includes('profile') ||
      input.content.hero?.toLowerCase().includes('face')
    ));
    
    if (hasFaceContent) {
      throw new Error('⚠️ CRITICAL: GPT Image 1 has poor face character consistency. Do not include UI elements with faces or characters (avatars, profile pictures, etc.) in your design. Use only interface elements without human faces.');
    }
    
    // Create extremely detailed prompt
    const prompt = createUIDesignPrompt(input);
    
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
    console.error('UI design generation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Create extremely detailed prompt for UI design
 */
function createUIDesignPrompt(input: UIDesignInput): string {
  const {
    designType,
    appName,
    description,
    features,
    targetUsers,
    style,
    colorScheme,
    customColors,
    layout,
    orientation,
    size,
    customInstructions,
    context,
    branding,
    navigation,
    content,
    typography,
    components,
  } = input;
  
  let prompt = `Create a highly detailed, professional ${designType} UI design with the following EXACT specifications:`;
  
  // Design Type Specific Instructions
  prompt += `\n\nDESIGN TYPE: ${designType.toUpperCase()}`;
  prompt += getDesignTypeInstructions(designType);
  
  // App Name and Branding
  prompt += `\n\nAPP NAME: "${appName}"`;
  prompt += getAppNameInstructions(designType, typography);
  
  if (branding?.tagline) {
    prompt += `\n\nTAGLINE: "${branding.tagline}"`;
    prompt += getTaglineInstructions(designType, typography);
  }
  
  if (branding?.companyName) {
    prompt += `\n\nCOMPANY NAME: "${branding.companyName}"`;
    prompt += getCompanyNameInstructions(designType, typography);
  }
  
  // Description
  prompt += `\n\nDESCRIPTION: "${description}"`;
  prompt += getDescriptionInstructions(designType, typography);
  
  // Features
  prompt += `\n\nFEATURES TO INCLUDE:`;
  features.forEach((feature, index) => {
    prompt += `\n${index + 1}. ${feature}`;
  });
  prompt += getFeaturesInstructions(designType, typography);
  
  // Target Users
  if (targetUsers) {
    prompt += `\n\nTARGET USERS: ${targetUsers}`;
    prompt += getTargetUsersInstructions(designType);
  }
  
  // Navigation
  if (navigation) {
    prompt += `\n\nNAVIGATION:`;
    prompt += `\nType: ${navigation.type}`;
    prompt += `\nItems: ${navigation.items.join(', ')}`;
    prompt += getNavigationInstructions(navigation.type, designType);
  }
  
  // Content
  if (content) {
    if (content.hero) {
      prompt += `\n\nHERO SECTION: "${content.hero}"`;
      prompt += getHeroInstructions(designType, typography);
    }
    
    if (content.sections && content.sections.length > 0) {
      prompt += `\n\nCONTENT SECTIONS:`;
      content.sections.forEach((section, index) => {
        prompt += `\nSection ${index + 1}: ${section}`;
      });
      prompt += getContentSectionsInstructions(designType, typography);
    }
    
    if (content.callToAction) {
      prompt += `\n\nCALL TO ACTION: "${content.callToAction}"`;
      prompt += getCallToActionInstructions(designType, typography);
    }
  }
  
  // Components
  if (components) {
    if (components.buttons && components.buttons.length > 0) {
      prompt += `\n\nBUTTONS: ${components.buttons.join(', ')}`;
      prompt += getButtonsInstructions(designType);
    }
    
    if (components.forms && components.forms.length > 0) {
      prompt += `\n\nFORMS: ${components.forms.join(', ')}`;
      prompt += getFormsInstructions(designType);
    }
    
    if (components.cards && components.cards.length > 0) {
      prompt += `\n\nCARDS: ${components.cards.join(', ')}`;
      prompt += getCardsInstructions(designType);
    }
    
    if (components.modals && components.modals.length > 0) {
      prompt += `\n\nMODALS: ${components.modals.join(', ')}`;
      prompt += getModalsInstructions(designType);
    }
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
  prompt += `\n- Ultra-high resolution output suitable for development and presentation`;
  prompt += `\n- Perfect text rendering with crisp, readable typography`;
  prompt += `\n- Professional UI layout with proper spacing and alignment`;
  prompt += `\n- Consistent color application throughout the interface`;
  prompt += `\n- Sharp, clear text with perfect contrast for accessibility`;
  prompt += `\n- No pixelation or blurriness in text or UI elements`;
  prompt += `\n- Proper visual hierarchy with clear information flow`;
  prompt += `\n- Professional user interface design quality`;
  prompt += `\n- Clean, modern aesthetic with attention to every detail`;
  prompt += `\n- Accurate UI element positioning and spacing`;
  prompt += `\n- Consistent visual design system throughout`;
  prompt += `\n- User-friendly interface with intuitive navigation`;
  prompt += `\n- Responsive design principles applied`;
  prompt += `\n- Accessibility considerations implemented`;
  
  return prompt;
}

/**
 * Get design type specific instructions
 */
function getDesignTypeInstructions(designType: string): string {
  const instructions = {
    'web-app': ` - Create a modern web application interface with responsive design, clear navigation, and professional styling. Focus on user experience and functionality.`,
    'mobile-app': ` - Create a mobile application interface with touch-friendly elements, proper spacing, and mobile-optimized layout. Ensure excellent usability on small screens.`,
    dashboard: ` - Create a comprehensive dashboard interface with data visualization, clear metrics, and intuitive navigation. Focus on information hierarchy and usability.`,
    'landing-page': ` - Create an engaging landing page with strong visual impact, clear messaging, and effective call-to-action elements. Focus on conversion optimization.`,
    'admin-panel': ` - Create a professional admin panel interface with clear data management, user controls, and administrative functionality. Focus on efficiency and clarity.`,
    ecommerce: ` - Create an e-commerce interface with product displays, shopping cart, and checkout flow. Focus on user experience and conversion optimization.`,
    portfolio: ` - Create a portfolio interface showcasing work, skills, and achievements. Focus on visual presentation and professional appearance.`,
    blog: ` - Create a blog interface with article layout, navigation, and reading experience. Focus on content readability and user engagement.`,
    saas: ` - Create a Software as a Service interface with subscription management, user dashboard, and feature access. Focus on user onboarding and retention.`,
    'game-ui': ` - Create a game user interface with interactive elements, game controls, and immersive design. Focus on gameplay experience and visual appeal.`,
  };
  
  return instructions[designType] || '';
}

/**
 * Get app name instructions
 */
function getAppNameInstructions(designType: string, typography?: any): string {
  const fontSizes = {
    'web-app': '28-36pt',
    'mobile-app': '24-32pt',
    dashboard: '26-34pt',
    'landing-page': '32-40pt',
    'admin-panel': '24-30pt',
    ecommerce: '28-36pt',
    portfolio: '26-34pt',
    blog: '24-32pt',
    saas: '26-34pt',
    'game-ui': '28-36pt',
  };
  
  const size = fontSizes[designType] || '26-34pt';
  
  return ` - Display prominently with professional styling (${size} font size), positioned at the top with proper spacing (20-30px margin from top edge). Use a modern sans-serif font like Arial, Helvetica, or similar. App name should be in primary brand color for maximum impact. Ensure perfect alignment and spacing.`;
}

/**
 * Get tagline instructions
 */
function getTaglineInstructions(designType: string, typography?: any): string {
  const fontSizes = {
    'web-app': '16-20pt',
    'mobile-app': '14-18pt',
    dashboard: '16-20pt',
    'landing-page': '18-22pt',
    'admin-panel': '14-18pt',
    ecommerce: '16-20pt',
    portfolio: '16-20pt',
    blog: '16-20pt',
    saas: '16-20pt',
    'game-ui': '16-20pt',
  };
  
  const size = fontSizes[designType] || '16-20pt';
  
  return ` - Place directly below the app name with 10-15px spacing. Use medium weight font (${size}), slightly lighter color (#7F8C8D or #95A5A6), same font family as app name. Ensure proper alignment and readability.`;
}

/**
 * Get company name instructions
 */
function getCompanyNameInstructions(designType: string, typography?: any): string {
  return ` - Display with professional styling, consistent with overall design theme. Use appropriate font size and weight to establish brand presence.`;
}

/**
 * Get description instructions
 */
function getDescriptionInstructions(designType: string, typography?: any): string {
  const fontSizes = {
    'web-app': '14-16pt',
    'mobile-app': '12-14pt',
    dashboard: '14-16pt',
    'landing-page': '16-18pt',
    'admin-panel': '12-14pt',
    ecommerce: '14-16pt',
    portfolio: '14-16pt',
    blog: '14-16pt',
    saas: '14-16pt',
    'game-ui': '14-16pt',
  };
  
  const size = fontSizes[designType] || '14-16pt';
  
  return ` - Display in clear, readable format (${size} font size) with proper spacing and alignment. Use consistent typography and ensure excellent readability.`;
}

/**
 * Get features instructions
 */
function getFeaturesInstructions(designType: string, typography?: any): string {
  const fontSizes = {
    'web-app': '12-14pt',
    'mobile-app': '11-13pt',
    dashboard: '12-14pt',
    'landing-page': '14-16pt',
    'admin-panel': '11-13pt',
    ecommerce: '12-14pt',
    portfolio: '12-14pt',
    blog: '12-14pt',
    saas: '12-14pt',
    'game-ui': '12-14pt',
  };
  
  const size = fontSizes[designType] || '12-14pt';
  
  return ` - Display in clear, organized format (${size} font size) with proper spacing, bullet points, or numbered lists. Ensure excellent readability and visual hierarchy.`;
}

/**
 * Get target users instructions
 */
function getTargetUsersInstructions(designType: string): string {
  return ` - Design the interface to be intuitive and appealing to the specified target users. Consider their needs, preferences, and technical expertise.`;
}

/**
 * Get navigation instructions
 */
function getNavigationInstructions(navType: string, designType: string): string {
  const instructions = {
    header: ` - Create a horizontal navigation bar at the top with clear menu items, proper spacing, and hover effects. Ensure excellent usability and accessibility.`,
    sidebar: ` - Create a vertical sidebar navigation with clear menu items, proper spacing, and visual hierarchy. Ensure easy navigation and clear organization.`,
    bottom: ` - Create a bottom navigation bar with clear icons and labels, proper spacing, and touch-friendly elements. Ensure excellent mobile usability.`,
    floating: ` - Create a floating navigation element with clear positioning, proper spacing, and intuitive design. Ensure it doesn't interfere with content.`,
    hamburger: ` - Create a hamburger menu with clear icon, proper positioning, and intuitive design. Ensure easy access and clear functionality.`,
  };
  
  return instructions[navType] || '';
}

/**
 * Get hero section instructions
 */
function getHeroInstructions(designType: string, typography?: any): string {
  return ` - Create a prominent hero section with clear messaging, strong visual impact, and effective call-to-action elements. Ensure excellent readability and visual appeal.`;
}

/**
 * Get content sections instructions
 */
function getContentSectionsInstructions(designType: string, typography?: any): string {
  return ` - Create well-organized content sections with clear headings, proper spacing, and excellent readability. Ensure logical flow and visual hierarchy.`;
}

/**
 * Get call to action instructions
 */
function getCallToActionInstructions(designType: string, typography?: any): string {
  return ` - Create prominent call-to-action elements with bold typography, contrasting colors, and clear positioning. Ensure they stand out and encourage user interaction.`;
}

/**
 * Get buttons instructions
 */
function getButtonsInstructions(designType: string): string {
  return ` - Create professional button designs with clear typography, proper spacing, and intuitive styling. Ensure excellent usability and visual appeal.`;
}

/**
 * Get forms instructions
 */
function getFormsInstructions(designType: string): string {
  return ` - Create user-friendly form designs with clear labels, proper spacing, and intuitive layout. Ensure excellent usability and accessibility.`;
}

/**
 * Get cards instructions
 */
function getCardsInstructions(designType: string): string {
  return ` - Create professional card designs with clear content, proper spacing, and visual hierarchy. Ensure excellent readability and visual appeal.`;
}

/**
 * Get modals instructions
 */
function getModalsInstructions(designType: string): string {
  return ` - Create professional modal designs with clear content, proper spacing, and intuitive layout. Ensure excellent usability and visual appeal.`;
}

/**
 * Get layout instructions
 */
function getLayoutInstructions(layout: string, orientation: string, designType: string): string {
  let instructions = `\n- Layout: ${layout}`;
  instructions += `\n- Orientation: ${orientation}`;
  
  if (layout === 'single-page') {
    instructions += `\n- Single page layout with clear content flow, proper spacing, and intuitive navigation`;
  } else if (layout === 'multi-page') {
    instructions += `\n- Multi-page layout with clear navigation, proper content organization, and intuitive user flow`;
  } else if (layout === 'dashboard') {
    instructions += `\n- Dashboard layout with clear data visualization, proper information hierarchy, and intuitive navigation`;
  } else if (layout === 'grid') {
    instructions += `\n- Grid layout with consistent spacing, proper alignment, and organized content blocks`;
  } else if (layout === 'sidebar') {
    instructions += `\n- Sidebar layout with clear navigation, proper content organization, and intuitive user experience`;
  } else if (layout === 'tabs') {
    instructions += `\n- Tab layout with clear navigation, proper content organization, and intuitive user experience`;
  }
  
  instructions += `\n- Ensure proper margins and padding throughout`;
  instructions += `\n- Maintain consistent spacing between elements`;
  instructions += `\n- Create clear visual hierarchy and information flow`;
  instructions += `\n- Ensure responsive design principles`;
  
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
  instructions += `\n- Maintain consistent typography throughout the interface`;
  instructions += `\n- Ensure excellent readability and contrast`;
  instructions += `\n- Follow accessibility guidelines for text sizing`;
  
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
    instructions += `\n- Surface color: ${customColors.surface || '#F8F9FA'}`;
  } else {
    const colorSchemes = {
      professional: `\n- Primary: #2C3E50 (Dark Blue-Gray)\n- Secondary: #7F8C8D (Medium Gray)\n- Accent: #3498DB (Blue)\n- Background: #FFFFFF (White)\n- Text: #2C3E50 (Dark Blue-Gray)\n- Surface: #F8F9FA (Light Gray)`,
      vibrant: `\n- Primary: #E74C3C (Red)\n- Secondary: #F39C12 (Orange)\n- Accent: #9B59B6 (Purple)\n- Background: #FFFFFF (White)\n- Text: #2C3E50 (Dark Blue-Gray)\n- Surface: #F8F9FA (Light Gray)`,
      monochrome: `\n- Primary: #2C3E50 (Dark Gray)\n- Secondary: #7F8C8D (Medium Gray)\n- Accent: #95A5A6 (Light Gray)\n- Background: #FFFFFF (White)\n- Text: #2C3E50 (Dark Gray)\n- Surface: #F8F9FA (Light Gray)`,
      dark: `\n- Primary: #FFFFFF (White)\n- Secondary: #BDC3C7 (Light Gray)\n- Accent: #3498DB (Blue)\n- Background: #2C3E50 (Dark Blue-Gray)\n- Text: #FFFFFF (White)\n- Surface: #34495E (Dark Gray)`,
      light: `\n- Primary: #2C3E50 (Dark Blue-Gray)\n- Secondary: #7F8C8D (Medium Gray)\n- Accent: #3498DB (Blue)\n- Background: #FFFFFF (White)\n- Text: #2C3E50 (Dark Blue-Gray)\n- Surface: #F8F9FA (Light Gray)`,
    };
    
    instructions += colorSchemes[colorScheme] || colorSchemes.professional;
  }
  
  instructions += `\n- Ensure proper contrast ratios for accessibility`;
  instructions += `\n- Use consistent color application throughout the interface`;
  instructions += `\n- Maintain visual harmony and professional appearance`;
  instructions += `\n- Follow accessibility guidelines for color contrast`;
  
  return instructions;
}

/**
 * Get style instructions
 */
function getStyleInstructions(style: string, designType?: string): string {
  const styles = {
    modern: `\n- Clean, minimalist design with sharp lines and contemporary typography\n- Use of white space and modern color palettes\n- Geometric shapes and clean layouts`,
    minimalist: `\n- Extremely clean design with minimal elements\n- Focus on typography and white space\n- Simple, uncluttered layout`,
    corporate: `\n- Professional business styling with formal typography\n- Conservative color schemes and layouts\n- Emphasis on credibility and trust`,
    creative: `\n- Innovative, artistic design with unique elements\n- Creative use of typography and layout\n- Bold colors and dynamic compositions`,
    elegant: `\n- Sophisticated, refined design with premium feel\n- High-quality typography and spacing\n- Luxurious color schemes and materials`,
    bold: `\n- Strong, impactful design with bold typography\n- High contrast colors and dynamic layouts\n- Attention-grabbing visual elements`,
    material: `\n- Material Design principles with elevation and shadows\n- Consistent spacing and typography\n- Modern, clean aesthetic`,
    flat: `\n- Flat design with minimal shadows and gradients\n- Clean, simple aesthetic\n- Focus on typography and color`,
    neumorphism: `\n- Soft, extruded design with subtle shadows\n- Modern, tactile aesthetic\n- Focus on depth and dimension`,
    glassmorphism: `\n- Glass-like design with transparency and blur\n- Modern, futuristic aesthetic\n- Focus on depth and layering`,
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
  generateUIDesign,
  createUIDesignPrompt,
};
