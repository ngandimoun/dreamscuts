/**
 * GPT Image 1 Chart Generator Executor
 * 
 * Specialized executor for generating charts, graphs, and explanatory diagrams
 * using GPT Image 1. This is the ONLY model capable of generating detailed,
 * accurate charts and data visualizations.
 * 
 * Model: gpt-image-1
 * Specialization: Charts, graphs, diagrams, data visualizations
 */

import { executeGPTImage1, GPTImage1Input, GPTImage1Output, gptImage1Utils } from './gpt-image-1';

export interface ChartGeneratorInput {
  // Chart type and data
  chartType: 'bar' | 'line' | 'pie' | 'scatter' | 'area' | 'histogram' | 'heatmap' | 'gantt' | 'sankey' | 'treemap' | 'funnel' | 'radar' | 'bubble' | 'waterfall' | 'candlestick' | 'boxplot' | 'violin' | 'density' | 'contour' | 'surface' | 'network' | 'flowchart' | 'mindmap' | 'orgchart' | 'timeline' | 'infographic' | 'dashboard' | 'custom';
  
  // Data specification
  data: Array<{
    label: string;
    value: number;
    category?: string;
    color?: string;
    metadata?: Record<string, any>;
  }> | Record<string, number> | string; // Can be structured data or description
  
  // Chart configuration
  title?: string;
  subtitle?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  legend?: boolean;
  gridLines?: boolean;
  
  // Styling options
  colorScheme?: 'professional' | 'vibrant' | 'monochrome' | 'pastel' | 'dark' | 'custom';
  customColors?: string[];
  style?: 'modern' | 'classic' | 'minimal' | 'corporate' | 'creative' | 'scientific';
  background?: 'white' | 'transparent' | 'light' | 'dark' | 'gradient';
  
  // Layout and dimensions
  orientation?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium' | 'large' | 'presentation' | 'poster';
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'wide' | 'tall';
  
  // Advanced options
  annotations?: Array<{
    text: string;
    position: 'top' | 'bottom' | 'left' | 'right' | 'center';
    style?: 'callout' | 'arrow' | 'highlight' | 'note';
  }>;
  
  // GPT Image 1 specific options
  quality?: 'low' | 'medium' | 'high' | 'auto';
  outputFormat?: 'png' | 'jpeg' | 'webp';
  transparency?: boolean;
  
  // Custom prompt additions
  customInstructions?: string;
  context?: string; // Additional context about the data or use case
}

export interface ChartGeneratorOutput {
  success: boolean;
  chart: {
    imageUrl?: string;
    base64Data?: string;
    metadata: {
      chartType: string;
      title?: string;
      dataPoints: number;
      generatedAt: string;
      processingTime: number;
      cost: number;
    };
  };
  error?: string;
  recommendations?: string[];
}

export interface ChartGeneratorOptions {
  timeout?: number;
  retries?: number;
  onProgress?: (progress: any) => void;
}

/**
 * Generate a chart using GPT Image 1
 * 
 * @param input - Chart generation parameters
 * @param options - Additional execution options
 * @returns Promise with the generated chart result
 */
export async function generateChart(
  input: ChartGeneratorInput,
  options: ChartGeneratorOptions = {}
): Promise<ChartGeneratorOutput> {
  const startTime = Date.now();
  
  try {
    // Validate input
    if (!input.chartType || !input.data) {
      throw new Error('chartType and data are required');
    }

    // Generate the specialized prompt for chart generation
    const prompt = createChartPrompt(input);
    
    // Prepare GPT Image 1 input
    const gptInput: GPTImage1Input = {
      prompt,
      model: 'gpt-image-1',
      quality: input.quality || 'high', // High quality for charts
      size: getRecommendedSize(input),
      background: input.transparency ? 'transparent' : 'opaque',
      output_format: input.outputFormat || 'png',
      n: 1,
    };

    // Execute GPT Image 1
    const result = await executeGPTImage1(gptInput);
    
    const processingTime = Date.now() - startTime;
    
    // Process the result
    if (result.data && result.data.length > 0) {
      const imageData = result.data[0];
      
      return {
        success: true,
        chart: {
          base64Data: imageData.b64_json,
          metadata: {
            chartType: input.chartType,
            title: input.title,
            dataPoints: Array.isArray(input.data) ? input.data.length : Object.keys(input.data).length,
            generatedAt: new Date().toISOString(),
            processingTime,
            cost: calculateChartCost(input, result),
          },
        },
        recommendations: generateRecommendations(input, result),
      };
    } else {
      throw new Error('No image data returned from GPT Image 1');
    }

  } catch (error) {
    console.error('Chart generation failed:', error);
    
    return {
      success: false,
      chart: {
        metadata: {
          chartType: input.chartType,
          title: input.title,
          dataPoints: 0,
          generatedAt: new Date().toISOString(),
          processingTime: Date.now() - startTime,
          cost: 0,
        },
      },
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Create a specialized prompt for chart generation with extreme detail
 * GPT Image 1 requires extremely detailed prompts for optimal results
 */
function createChartPrompt(input: ChartGeneratorInput): string {
  const { chartType, data, title, subtitle, xAxisLabel, yAxisLabel, style, colorScheme, customInstructions, context } = input;
  
  // Convert data to readable format
  const dataDescription = formatDataForPrompt(data);
  
  // Build the base prompt with extreme detail
  let prompt = `Create a highly detailed, professional ${chartType} chart with the following EXACT specifications:`;
  
  // Add title with detailed typography instructions
  if (title) {
    prompt += `\n\nTITLE: "${title}" - Use large, bold, professional typography (24-32pt font size), centered at the top, with proper spacing (20-30px margin from top edge). Use a modern sans-serif font like Arial, Helvetica, or similar. Title should be in dark color (#2C3E50 or #34495E) for maximum readability.`;
  }
  
  // Add subtitle with detailed styling
  if (subtitle) {
    prompt += `\n\nSUBTITLE: "${subtitle}" - Place directly below the title with 10-15px spacing. Use medium weight font (16-20pt), slightly lighter color (#7F8C8D or #95A5A6), same font family as title.`;
  }
  
  // Add data description with specific formatting
  prompt += `\n\nDATA TO DISPLAY: ${dataDescription}`;
  
  // Add axis labels with detailed positioning and styling
  if (xAxisLabel) {
    prompt += `\n\nX-AXIS LABEL: "${xAxisLabel}" - Position at the bottom center, 15-20px from the chart area. Use 14-16pt font, medium weight, color #5D6D7E. Include proper spacing and alignment.`;
  }
  if (yAxisLabel) {
    prompt += `\n\nY-AXIS LABEL: "${yAxisLabel}" - Position vertically on the left side, centered, rotated 90 degrees counter-clockwise. Use 14-16pt font, medium weight, color #5D6D7E. Ensure proper spacing from chart area (15-20px).`;
  }
  
  // Add extremely detailed styling instructions
  const detailedStyleInstructions = buildDetailedStyleInstructions(input);
  prompt += `\n\nVISUAL STYLING REQUIREMENTS:`;
  prompt += detailedStyleInstructions;
  
  // Add detailed color specifications
  const colorInstructions = buildDetailedColorInstructions(input);
  prompt += `\n\nCOLOR SPECIFICATIONS:`;
  prompt += colorInstructions;
  
  // Add detailed background instructions
  const backgroundInstructions = buildDetailedBackgroundInstructions(input);
  prompt += `\n\nBACKGROUND SPECIFICATIONS:`;
  prompt += backgroundInstructions;
  
  // Add detailed typography instructions
  const typographyInstructions = buildDetailedTypographyInstructions(input);
  prompt += `\n\nTYPOGRAPHY SPECIFICATIONS:`;
  prompt += typographyInstructions;
  
  // Add detailed spacing and layout instructions
  const layoutInstructions = buildDetailedLayoutInstructions(input);
  prompt += `\n\nLAYOUT AND SPACING:`;
  prompt += layoutInstructions;
  
  // Add detailed annotations
  if (input.annotations && input.annotations.length > 0) {
    prompt += `\n\nANNOTATIONS:`;
    input.annotations.forEach((annotation, index) => {
      prompt += `\nAnnotation ${index + 1}: "${annotation.text}" - Position: ${annotation.position}, Style: ${annotation.style || 'callout'}. Use contrasting background color, rounded corners (5-8px radius), proper padding (8-12px), and clear typography (12-14pt font).`;
    });
  }
  
  // Add detailed grid and axis instructions
  const gridInstructions = buildDetailedGridInstructions(input);
  prompt += `\n\nGRID AND AXIS SPECIFICATIONS:`;
  prompt += gridInstructions;
  
  // Add detailed data point styling
  const dataPointInstructions = buildDetailedDataPointInstructions(input);
  prompt += `\n\nDATA POINT STYLING:`;
  prompt += dataPointInstructions;
  
  // Add context with detailed implications
  if (context) {
    prompt += `\n\nCONTEXT AND USE CASE: ${context} - Ensure the chart design and styling reflects this context appropriately.`;
  }
  
  // Add custom instructions with emphasis
  if (customInstructions) {
    prompt += `\n\nADDITIONAL REQUIREMENTS: ${customInstructions} - These are critical requirements that must be followed exactly.`;
  }
  
  // Add final quality and technical requirements with extreme detail
  prompt += `\n\nFINAL QUALITY REQUIREMENTS:`;
  prompt += `\n- Ultra-high resolution output suitable for print and digital use`;
  prompt += `\n- Perfect alignment and spacing throughout`;
  prompt += `\n- Consistent color application across all elements`;
  prompt += `\n- Sharp, crisp text with perfect readability`;
  prompt += `\n- Professional business presentation quality`;
  prompt += `\n- No pixelation or blurriness`;
  prompt += `\n- Proper contrast ratios for accessibility`;
  prompt += `\n- Clean, modern aesthetic with attention to every detail`;
  prompt += `\n- Accurate data representation with precise positioning`;
  prompt += `\n- Consistent visual hierarchy throughout the chart`;
  
  return prompt;
}

/**
 * Format data for inclusion in the prompt
 */
function formatDataForPrompt(data: ChartGeneratorInput['data']): string {
  if (typeof data === 'string') {
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => `${item.label}: ${item.value}`).join(', ');
  }
  
  if (typeof data === 'object') {
    return Object.entries(data).map(([key, value]) => `${key}: ${value}`).join(', ');
  }
  
  return String(data);
}

/**
 * Build extremely detailed style instructions
 */
function buildDetailedStyleInstructions(input: ChartGeneratorInput): string {
  let instructions = '';
  
  // Style-specific detailed instructions
  switch (input.style) {
    case 'modern':
      instructions += '\n- Clean, minimalist design with plenty of white space';
      instructions += '\n- Rounded corners (8-12px radius) on all elements';
      instructions += '\n- Subtle shadows and depth effects';
      instructions += '\n- Contemporary color palette with high contrast';
      instructions += '\n- Geometric shapes and clean lines';
      break;
    case 'classic':
      instructions += '\n- Traditional, formal appearance';
      instructions += '\n- Sharp, clean edges with no rounded corners';
      instructions += '\n- Conservative color scheme';
      instructions += '\n- Professional, business-appropriate styling';
      instructions += '\n- Clear hierarchy and structure';
      break;
    case 'minimal':
      instructions += '\n- Extremely clean and uncluttered design';
      instructions += '\n- Maximum white space utilization';
      instructions += '\n- Simple, single-color elements';
      instructions += '\n- Minimal text and labels';
      instructions += '\n- Focus on data with minimal decoration';
      break;
    case 'corporate':
      instructions += '\n- Professional business presentation style';
      instructions += '\n- Conservative color palette (blues, grays, whites)';
      instructions += '\n- Clean, readable typography';
      instructions += '\n- Structured layout with clear sections';
      instructions += '\n- Professional spacing and alignment';
      break;
    case 'creative':
      instructions += '\n- Artistic and expressive design';
      instructions += '\n- Vibrant colors and creative layouts';
      instructions += '\n- Unique visual elements and styling';
      instructions += '\n- Creative use of shapes and forms';
      instructions += '\n- Engaging and visually appealing';
      break;
    case 'scientific':
      instructions += '\n- Technical, data-focused design';
      instructions += '\n- Precise measurements and positioning';
      instructions += '\n- Clear, technical typography';
      instructions += '\n- Detailed grid systems and scales';
      instructions += '\n- Professional scientific presentation';
      break;
  }
  
  // Orientation-specific instructions
  if (input.orientation) {
    if (input.orientation === 'horizontal') {
      instructions += '\n- Horizontal layout with bars extending left to right';
      instructions += '\n- Y-axis labels on the left side';
      instructions += '\n- X-axis labels at the bottom';
    } else if (input.orientation === 'vertical') {
      instructions += '\n- Vertical layout with bars extending bottom to top';
      instructions += '\n- X-axis labels at the bottom';
      instructions += '\n- Y-axis labels on the left side';
    }
  }
  
  // Legend instructions
  if (input.legend === false) {
    instructions += '\n- No legend displayed';
    instructions += '\n- All data series clearly labeled on the chart itself';
  } else {
    instructions += '\n- Include a clear, well-positioned legend';
    instructions += '\n- Legend should be positioned to not interfere with data';
    instructions += '\n- Use consistent colors and symbols in legend';
  }
  
  return instructions;
}

/**
 * Build extremely detailed color instructions
 */
function buildDetailedColorInstructions(input: ChartGeneratorInput): string {
  let instructions = '';
  
  // Color scheme specific instructions
  switch (input.colorScheme) {
    case 'professional':
      instructions += '\n- Use professional business colors: deep blues (#2C3E50, #34495E), grays (#7F8C8D, #95A5A6), and whites';
      instructions += '\n- Accent colors: teal (#16A085), navy (#2C3E50), and silver (#BDC3C7)';
      instructions += '\n- High contrast for readability and accessibility';
      instructions += '\n- Consistent color application across all elements';
      break;
    case 'vibrant':
      instructions += '\n- Use bright, energetic colors: orange (#E67E22), green (#27AE60), blue (#3498DB), purple (#9B59B6)';
      instructions += '\n- High saturation and brightness for visual impact';
      instructions += '\n- Complementary color combinations';
      instructions += '\n- Eye-catching and engaging color palette';
      break;
    case 'monochrome':
      instructions += '\n- Use variations of a single color (recommend blue or gray)';
      instructions += '\n- Different shades and tints for data differentiation';
      instructions += '\n- Maintain sufficient contrast between elements';
      instructions += '\n- Clean, sophisticated appearance';
      break;
    case 'pastel':
      instructions += '\n- Use soft, muted colors: light blue (#AED6F1), light green (#A9DFBF), light pink (#F8C471), light purple (#D2B4DE)';
      instructions += '\n- Low saturation for gentle, pleasant appearance';
      instructions += '\n- Good for presentations and reports';
      instructions += '\n- Easy on the eyes and professional';
      break;
    case 'dark':
      instructions += '\n- Use dark theme colors: dark backgrounds (#2C3E50, #34495E) with light text';
      instructions += '\n- Bright accent colors for data points and highlights';
      instructions += '\n- High contrast for readability';
      instructions += '\n- Modern, sophisticated appearance';
      break;
  }
  
  // Custom colors
  if (input.customColors && input.customColors.length > 0) {
    instructions += '\n- Use these EXACT custom colors:';
    input.customColors.forEach((color, index) => {
      instructions += `\n  Data series ${index + 1}: ${color}`;
    });
    instructions += '\n- Apply colors consistently across all chart elements';
    instructions += '\n- Ensure proper contrast and readability';
  }
  
  return instructions;
}

/**
 * Build extremely detailed background instructions
 */
function buildDetailedBackgroundInstructions(input: ChartGeneratorInput): string {
  let instructions = '';
  
  switch (input.background) {
    case 'white':
      instructions += '\n- Pure white background (#FFFFFF)';
      instructions += '\n- Clean, professional appearance';
      instructions += '\n- Maximum contrast for text and data elements';
      instructions += '\n- Suitable for print and digital use';
      break;
    case 'transparent':
      instructions += '\n- Transparent background (no background color)';
      instructions += '\n- Chart elements should have solid backgrounds for readability';
      instructions += '\n- Perfect for overlaying on other content';
      instructions += '\n- Ensure all text and elements are clearly visible';
      break;
    case 'light':
      instructions += '\n- Light background color (#F8F9FA or #F5F5F5)';
      instructions += '\n- Subtle, professional appearance';
      instructions += '\n- Good contrast with dark text and data elements';
      instructions += '\n- Soft, approachable look';
      break;
    case 'dark':
      instructions += '\n- Dark background color (#2C3E50 or #34495E)';
      instructions += '\n- Light text and data elements for contrast';
      instructions += '\n- Modern, sophisticated appearance';
      instructions += '\n- High contrast for readability';
      break;
    case 'gradient':
      instructions += '\n- Subtle gradient background (light to slightly lighter)';
      instructions += '\n- Use colors like #F8F9FA to #E9ECEF';
      instructions += '\n- Professional gradient that doesn\'t interfere with data';
      instructions += '\n- Adds visual interest without distraction';
      break;
  }
  
  return instructions;
}

/**
 * Build extremely detailed typography instructions
 */
function buildDetailedTypographyInstructions(input: ChartGeneratorInput): string {
  let instructions = '';
  
  instructions += '\n- Use modern, professional sans-serif fonts (Arial, Helvetica, or similar)';
  instructions += '\n- Title: 24-32pt, bold weight, dark color (#2C3E50)';
  instructions += '\n- Subtitle: 16-20pt, medium weight, lighter color (#7F8C8D)';
  instructions += '\n- Axis labels: 14-16pt, medium weight, color (#5D6D7E)';
  instructions += '\n- Data labels: 12-14pt, regular weight, high contrast color';
  instructions += '\n- Legend text: 12-14pt, regular weight, consistent with axis labels';
  instructions += '\n- Ensure all text is perfectly readable and properly spaced';
  instructions += '\n- Use consistent font family throughout the entire chart';
  instructions += '\n- Proper line height and letter spacing for readability';
  
  return instructions;
}

/**
 * Build extremely detailed layout instructions
 */
function buildDetailedLayoutInstructions(input: ChartGeneratorInput): string {
  let instructions = '';
  
  instructions += '\n- Chart area should occupy 70-80% of the total image space';
  instructions += '\n- Title area: 15-20% of total height at the top';
  instructions += '\n- Chart area: 60-70% of total height in the center';
  instructions += '\n- Legend area: 10-15% of total height at bottom or side';
  instructions += '\n- Consistent 20-30px margins on all sides';
  instructions += '\n- Proper spacing between all elements (minimum 10px)';
  instructions += '\n- Align all text elements consistently';
  instructions += '\n- Ensure balanced visual weight distribution';
  instructions += '\n- Chart should be centered within the available space';
  
  return instructions;
}

/**
 * Build extremely detailed grid instructions
 */
function buildDetailedGridInstructions(input: ChartGeneratorInput): string {
  let instructions = '';
  
  if (input.gridLines === false) {
    instructions += '\n- No grid lines displayed';
    instructions += '\n- Clean, uncluttered appearance';
    instructions += '\n- Focus entirely on data visualization';
  } else {
    instructions += '\n- Include subtle grid lines for data reference';
    instructions += '\n- Grid lines should be light gray (#E5E5E5 or #F0F0F0)';
    instructions += '\n- Grid lines should not interfere with data visibility';
    instructions += '\n- Use consistent spacing between grid lines';
    instructions += '\n- Grid lines should align with axis tick marks';
  }
  
  instructions += '\n- X-axis: Horizontal lines, positioned at regular intervals';
  instructions += '\n- Y-axis: Vertical lines, positioned at regular intervals';
  instructions += '\n- Axis lines should be slightly darker than grid lines (#CCCCCC)';
  instructions += '\n- Tick marks should be clearly visible and properly spaced';
  instructions += '\n- Axis labels should align perfectly with tick marks';
  
  return instructions;
}

/**
 * Build extremely detailed data point styling instructions
 */
function buildDetailedDataPointInstructions(input: ChartGeneratorInput): string {
  let instructions = '';
  
  switch (input.chartType) {
    case 'bar':
      instructions += '\n- Bars should have consistent width (60-80% of available space)';
      instructions += '\n- Rounded corners on top of bars (4-6px radius)';
      instructions += '\n- Consistent spacing between bars (20-30% of bar width)';
      instructions += '\n- Data labels positioned above bars or inside bars';
      instructions += '\n- Bars should extend from baseline to data value';
      break;
    case 'line':
      instructions += '\n- Line thickness: 3-4px for main lines, 2px for secondary lines';
      instructions += '\n- Data points: circles with 6-8px diameter';
      instructions += '\n- Smooth curves between data points';
      instructions += '\n- Data point colors should match line colors';
      instructions += '\n- Hover states or emphasis on key data points';
      break;
    case 'pie':
      instructions += '\n- Pie slices should be clearly separated (2-4px gap)';
      instructions += '\n- Labels positioned outside pie with connecting lines';
      instructions += '\n- Percentage values displayed on or near slices';
      instructions += '\n- Largest slice should start at 12 o\'clock position';
      instructions += '\n- Consistent color application across all slices';
      break;
    case 'scatter':
      instructions += '\n- Data points: circles with 8-12px diameter';
      instructions += '\n- Different colors for different data series';
      instructions += '\n- Clear distinction between data point categories';
      instructions += '\n- Optional trend line with 2-3px thickness';
      instructions += '\n- Data point labels for key values';
      break;
  }
  
  instructions += '\n- All data points should be clearly visible and distinguishable';
  instructions += '\n- Consistent styling across all data elements';
  instructions += '\n- Proper contrast with background and grid lines';
  instructions += '\n- Data values should be clearly labeled and readable';
  
  return instructions;
}

/**
 * Get recommended size based on input parameters
 */
function getRecommendedSize(input: ChartGeneratorInput): GPTImage1Input['size'] {
  if (input.aspectRatio === 'landscape' || input.aspectRatio === 'wide') {
    return '1536x1024';
  }
  
  if (input.aspectRatio === 'portrait' || input.aspectRatio === 'tall') {
    return '1024x1536';
  }
  
  if (input.size === 'presentation' || input.size === 'poster') {
    return '1536x1024';
  }
  
  return '1024x1024'; // Default square
}

/**
 * Calculate estimated cost for chart generation
 */
function calculateChartCost(input: ChartGeneratorInput, result: GPTImage1Output): number {
  const size = getRecommendedSize(input);
  const quality = input.quality || 'high';
  
  // Use the utility function from gpt-image-1
  return gptImage1Utils.calculateGPTImage1Cost ? 
    gptImage1Utils.calculateGPTImage1Cost(size, quality, 1) : 0.167; // Default high quality cost
}

/**
 * Generate recommendations based on the chart and result
 */
function generateRecommendations(input: ChartGeneratorInput, result: GPTImage1Output): string[] {
  const recommendations: string[] = [];
  
  // Data size recommendations
  const dataPoints = Array.isArray(input.data) ? input.data.length : Object.keys(input.data).length;
  
  if (dataPoints > 20) {
    recommendations.push('Consider grouping data into categories for better readability');
  }
  
  if (dataPoints < 3) {
    recommendations.push('Consider adding more data points for a more meaningful visualization');
  }
  
  // Chart type recommendations
  if (input.chartType === 'pie' && dataPoints > 8) {
    recommendations.push('Consider using a bar chart instead of pie chart for better readability with many categories');
  }
  
  // Quality recommendations
  if (input.quality === 'low') {
    recommendations.push('Consider using higher quality setting for presentation purposes');
  }
  
  // Style recommendations
  if (!input.style) {
    recommendations.push('Consider specifying a style (modern, classic, minimal) for better consistency');
  }
  
  return recommendations;
}

/**
 * Generate multiple charts with different configurations
 */
export async function generateChartVariations(
  baseInput: ChartGeneratorInput,
  variations: Partial<ChartGeneratorInput>[],
  options: ChartGeneratorOptions = {}
): Promise<ChartGeneratorOutput[]> {
  const results: ChartGeneratorOutput[] = [];
  
  for (const variation of variations) {
    const input = { ...baseInput, ...variation };
    const result = await generateChart(input, options);
    results.push(result);
  }
  
  return results;
}

/**
 * Generate a dashboard with multiple charts
 */
export async function generateDashboard(
  charts: ChartGeneratorInput[],
  options: {
    layout?: 'grid' | 'rows' | 'columns' | 'custom';
    title?: string;
    theme?: string;
  } = {}
): Promise<ChartGeneratorOutput> {
  const dashboardInput: ChartGeneratorInput = {
    chartType: 'dashboard',
    data: `Dashboard containing ${charts.length} charts: ${charts.map(c => c.title || c.chartType).join(', ')}`,
    title: options.title || 'Analytics Dashboard',
    style: 'modern',
    colorScheme: 'professional',
    size: 'presentation',
    aspectRatio: 'landscape',
    customInstructions: `Create a comprehensive dashboard layout with ${options.layout || 'grid'} arrangement. Include proper spacing, consistent styling, and clear section headers.`,
  };
  
  return generateChart(dashboardInput, options);
}

/**
 * Utility functions for common chart types
 */
export const chartUtils = {
  /**
   * Create a sales performance chart
   */
  createSalesChart(data: Array<{month: string, sales: number}>, options: Partial<ChartGeneratorInput> = {}): ChartGeneratorInput {
    return {
      chartType: 'bar',
      data: data.map(d => ({ label: d.month, value: d.sales })),
      title: 'Sales Performance',
      xAxisLabel: 'Month',
      yAxisLabel: 'Sales ($)',
      style: 'corporate',
      colorScheme: 'professional',
      ...options,
    };
  },

  /**
   * Create a market share pie chart
   */
  createMarketShareChart(data: Array<{company: string, share: number}>, options: Partial<ChartGeneratorInput> = {}): ChartGeneratorInput {
    return {
      chartType: 'pie',
      data: data.map(d => ({ label: d.company, value: d.share })),
      title: 'Market Share Distribution',
      style: 'modern',
      colorScheme: 'vibrant',
      ...options,
    };
  },

  /**
   * Create a trend line chart
   */
  createTrendChart(data: Array<{date: string, value: number}>, options: Partial<ChartGeneratorInput> = {}): ChartGeneratorInput {
    return {
      chartType: 'line',
      data: data.map(d => ({ label: d.date, value: d.value })),
      title: 'Trend Analysis',
      xAxisLabel: 'Date',
      yAxisLabel: 'Value',
      style: 'scientific',
      colorScheme: 'professional',
      gridLines: true,
      ...options,
    };
  },

  /**
   * Create a comparison bar chart
   */
  createComparisonChart(data: Array<{category: string, values: Record<string, number>}>, options: Partial<ChartGeneratorInput> = {}): ChartGeneratorInput {
    return {
      chartType: 'bar',
      data: data.flatMap(d => 
        Object.entries(d.values).map(([key, value]) => ({
          label: `${d.category} - ${key}`,
          value,
          category: d.category,
        }))
      ),
      title: 'Comparison Analysis',
      style: 'corporate',
      colorScheme: 'professional',
      legend: true,
      ...options,
    };
  },

  /**
   * Create a KPI dashboard
   */
  createKPIDashboard(kpis: Array<{name: string, value: number, target?: number, unit?: string}>, options: Partial<ChartGeneratorInput> = {}): ChartGeneratorInput {
    return {
      chartType: 'dashboard',
      data: kpis.map(k => ({ label: k.name, value: k.value })),
      title: 'KPI Dashboard',
      style: 'modern',
      colorScheme: 'professional',
      size: 'presentation',
      aspectRatio: 'landscape',
      customInstructions: 'Create a KPI dashboard with individual metric cards, progress indicators, and clear visual hierarchy.',
      ...options,
    };
  },
};

/**
 * Get model information for chart generation
 */
export function getChartGeneratorInfo() {
  return {
    name: "GPT Image 1 Chart Generator",
    version: "1.0",
    provider: "openai",
    model_id: "gpt-image-1",
    specialization: "Charts, graphs, diagrams, data visualizations",
    description: "Specialized chart generation using GPT Image 1 - the ONLY model capable of generating detailed, accurate charts and data visualizations",
    supportedChartTypes: [
      'bar', 'line', 'pie', 'scatter', 'area', 'histogram', 'heatmap', 
      'gantt', 'sankey', 'treemap', 'funnel', 'radar', 'bubble', 
      'waterfall', 'candlestick', 'boxplot', 'violin', 'density', 
      'contour', 'surface', 'network', 'flowchart', 'mindmap', 
      'orgchart', 'timeline', 'infographic', 'dashboard', 'custom'
    ],
    supportedStyles: ['modern', 'classic', 'minimal', 'corporate', 'creative', 'scientific'],
    supportedColorSchemes: ['professional', 'vibrant', 'monochrome', 'pastel', 'dark', 'custom'],
    maxDataPoints: 100, // Recommended maximum for readability
    features: [
      "Accurate data visualization",
      "Professional chart styling",
      "Multiple chart types",
      "Custom color schemes",
      "Annotation support",
      "Dashboard generation",
      "High-quality output",
      "Business-ready formatting"
    ],
  };
}

export default {
  generateChart,
  generateChartVariations,
  generateDashboard,
  chartUtils,
  getChartGeneratorInfo,
};
