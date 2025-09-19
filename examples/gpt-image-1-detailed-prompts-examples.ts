/**
 * GPT Image 1 Chart Generator - Extremely Detailed Prompts Examples
 * 
 * This file demonstrates how to create extremely detailed prompts for GPT Image 1
 * to generate high-quality charts. GPT Image 1 requires maximum detail in prompts
 * for optimal results, including specific colors, fonts, spacing, and styling.
 */

import { generateChart } from '../executors/gpt-image-1-chart-generator';

// ============================================================================
// EXAMPLE 1: ULTRA-DETAILED BAR CHART
// ============================================================================

/**
 * Example of an extremely detailed bar chart prompt
 * This shows how every visual element must be specified
 */
export async function createUltraDetailedBarChart() {
  const result = await generateChart({
    chartType: 'bar',
    data: [
      { label: 'Q1 2024', value: 120000, color: '#2E86AB' },
      { label: 'Q2 2024', value: 150000, color: '#A23B72' },
      { label: 'Q3 2024', value: 180000, color: '#F18F01' },
      { label: 'Q4 2024', value: 200000, color: '#C73E1D' },
    ],
    title: 'Quarterly Sales Performance',
    subtitle: 'Record-breaking Q4 with 33% growth',
    xAxisLabel: 'Quarter',
    yAxisLabel: 'Sales Revenue ($)',
    style: 'corporate',
    colorScheme: 'custom',
    customColors: ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D'],
    background: 'white',
    quality: 'high',
    outputFormat: 'png',
    annotations: [
      {
        text: 'Best quarter ever!',
        position: 'top',
        style: 'callout',
      },
      {
        text: '33% growth vs Q3',
        position: 'right',
        style: 'arrow',
      },
    ],
    customInstructions: 'Add subtle gradient effects to bars, include data labels above each bar, and add a trend line showing the growth trajectory. Ensure the Q4 bar is highlighted with a subtle glow effect.',
    context: 'Annual sales review presentation for C-level executives - must be presentation-ready quality',
  });

  console.log('Generated ultra-detailed bar chart with prompt length:', result.chart.metadata.processingTime);
  return result;
}

// ============================================================================
// EXAMPLE 2: SCIENTIFIC LINE CHART WITH MAXIMUM DETAIL
// ============================================================================

/**
 * Example of a scientific line chart with every detail specified
 * Perfect for technical reports and research presentations
 */
export async function createScientificLineChart() {
  const result = await generateChart({
    chartType: 'line',
    data: [
      { label: 'Jan 2024', value: 100, category: 'Baseline' },
      { label: 'Feb 2024', value: 120, category: 'Growth' },
      { label: 'Mar 2024', value: 110, category: 'Stabilization' },
      { label: 'Apr 2024', value: 140, category: 'Growth' },
      { label: 'May 2024', value: 160, category: 'Growth' },
      { label: 'Jun 2024', value: 150, category: 'Stabilization' },
    ],
    title: 'Monthly Performance Metrics Analysis',
    subtitle: 'Statistical Analysis of Key Performance Indicators',
    xAxisLabel: 'Time Period (Months)',
    yAxisLabel: 'Performance Score (0-200 scale)',
    style: 'scientific',
    colorScheme: 'professional',
    background: 'white',
    quality: 'high',
    gridLines: true,
    customInstructions: 'Include statistical annotations: R-squared value, trend line equation, confidence intervals, and p-values. Add error bars for each data point. Use precise scientific notation for all values. Include a secondary Y-axis for percentage changes.',
    context: 'Research paper for peer-reviewed journal - must meet academic publication standards',
  });

  return result;
}

// ============================================================================
// EXAMPLE 3: CREATIVE PIE CHART WITH ARTISTIC DETAILS
// ============================================================================

/**
 * Example of a creative pie chart with artistic styling
 * Shows how to create engaging, visually appealing charts
 */
export async function createCreativePieChart() {
  const result = await generateChart({
    chartType: 'pie',
    data: [
      { label: 'Mobile Users', value: 45, color: '#FF6B6B' },
      { label: 'Desktop Users', value: 35, color: '#4ECDC4' },
      { label: 'Tablet Users', value: 15, color: '#45B7D1' },
      { label: 'Other Devices', value: 5, color: '#96CEB4' },
    ],
    title: 'Device Usage Distribution',
    subtitle: 'Multi-platform User Engagement Analysis',
    style: 'creative',
    colorScheme: 'custom',
    customColors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
    background: 'gradient',
    quality: 'high',
    customInstructions: 'Create an artistic pie chart with 3D depth effects, subtle shadows, and gradient fills. Add percentage labels inside each slice with white text and dark outlines for readability. Include small icons representing each device type. Add a subtle outer glow effect to the entire pie chart.',
    context: 'Marketing presentation for client pitch - needs to be visually striking and professional',
  });

  return result;
}

// ============================================================================
// EXAMPLE 4: CORPORATE DASHBOARD WITH MAXIMUM SPECIFICATION
// ============================================================================

/**
 * Example of a corporate dashboard with every element specified
 * Perfect for executive presentations and board meetings
 */
export async function createCorporateDashboard() {
  const result = await generateChart({
    chartType: 'dashboard',
    data: [
      { label: 'Revenue', value: 2500000, category: 'Financial' },
      { label: 'Customers', value: 15000, category: 'Growth' },
      { label: 'Satisfaction', value: 4.8, category: 'Quality' },
      { label: 'Retention', value: 92, category: 'Growth' },
    ],
    title: 'Executive Dashboard - Q4 2024',
    subtitle: 'Key Performance Indicators and Business Metrics',
    style: 'corporate',
    colorScheme: 'professional',
    background: 'white',
    quality: 'high',
    size: 'presentation',
    aspectRatio: 'landscape',
    customInstructions: 'Create a comprehensive dashboard with individual KPI cards, each with: 1) Large metric value in bold, 2) Percentage change indicator with up/down arrows, 3) Mini trend chart, 4) Target vs actual comparison, 5) Color-coded status indicators (green for good, yellow for caution, red for attention). Include a summary section at the top with overall business health score.',
    context: 'Board of Directors quarterly review - must convey authority and professionalism',
  });

  return result;
}

// ============================================================================
// EXAMPLE 5: TRANSPARENT BACKGROUND CHART FOR OVERLAYS
// ============================================================================

/**
 * Example of a chart designed for overlay on other content
 * Shows how to create charts that work on any background
 */
export async function createTransparentOverlayChart() {
  const result = await generateChart({
    chartType: 'bar',
    data: [
      { label: 'Product A', value: 85, color: '#E74C3C' },
      { label: 'Product B', value: 72, color: '#3498DB' },
      { label: 'Product C', value: 90, color: '#2ECC71' },
      { label: 'Product D', value: 68, color: '#F39C12' },
    ],
    title: 'Product Performance Comparison',
    xAxisLabel: 'Products',
    yAxisLabel: 'Performance Score',
    style: 'minimal',
    colorScheme: 'custom',
    customColors: ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12'],
    background: 'transparent',
    quality: 'high',
    outputFormat: 'png',
    transparency: true,
    customInstructions: 'Design for overlay use: solid white backgrounds for all text elements, dark outlines around text for readability, high contrast colors that work on any background, clean minimal design with no unnecessary elements, perfect for embedding in presentations or websites.',
    context: 'Website hero section overlay - must work on any background color or image',
  });

  return result;
}

// ============================================================================
// EXAMPLE 6: DARK THEME CHART FOR MODERN APPLICATIONS
// ============================================================================

/**
 * Example of a dark theme chart for modern applications
 * Perfect for dashboards and modern web applications
 */
export async function createDarkThemeChart() {
  const result = await generateChart({
    chartType: 'line',
    data: [
      { label: '00:00', value: 120, category: 'Night' },
      { label: '06:00', value: 200, category: 'Morning' },
      { label: '12:00', value: 350, category: 'Peak' },
      { label: '18:00', value: 280, category: 'Evening' },
      { label: '24:00', value: 150, category: 'Night' },
    ],
    title: '24-Hour Traffic Analysis',
    subtitle: 'Real-time User Activity Monitoring',
    xAxisLabel: 'Time of Day',
    yAxisLabel: 'Active Users',
    style: 'modern',
    colorScheme: 'dark',
    background: 'dark',
    quality: 'high',
    customInstructions: 'Create a sleek dark theme chart with: neon accent colors (#00D4FF, #FF6B6B), glowing data points, subtle grid lines in dark gray, bright white text with proper contrast, modern typography, and a futuristic aesthetic. Add a subtle gradient background from dark blue to black.',
    context: 'Modern web application dashboard - must match contemporary dark UI design',
  });

  return result;
}

// ============================================================================
// EXAMPLE 7: PRINT-QUALITY CHART FOR PUBLICATIONS
// ============================================================================

/**
 * Example of a print-quality chart for publications
 * Perfect for reports, whitepapers, and printed materials
 */
export async function createPrintQualityChart() {
  const result = await generateChart({
    chartType: 'scatter',
    data: [
      { label: 'Region A', value: 85, category: 'High Performance' },
      { label: 'Region B', value: 72, category: 'Medium Performance' },
      { label: 'Region C', value: 90, category: 'High Performance' },
      { label: 'Region D', value: 65, category: 'Low Performance' },
      { label: 'Region E', value: 78, category: 'Medium Performance' },
    ],
    title: 'Regional Performance Analysis',
    subtitle: 'Correlation Between Investment and Performance Metrics',
    xAxisLabel: 'Investment Level ($M)',
    yAxisLabel: 'Performance Score (0-100)',
    style: 'scientific',
    colorScheme: 'professional',
    background: 'white',
    quality: 'high',
    outputFormat: 'png',
    customInstructions: 'Design for print publication: high contrast black and white with color accents, clear typography suitable for small print sizes, precise data point positioning, statistical annotations including correlation coefficient and R-squared value, professional academic styling, and crisp lines that will remain sharp when printed.',
    context: 'Academic research paper for journal publication - must meet print quality standards',
  });

  return result;
}

// ============================================================================
// EXAMPLE 8: INTERACTIVE-STYLE CHART FOR WEB APPLICATIONS
// ============================================================================

/**
 * Example of a chart designed to look interactive
 * Perfect for web applications and digital dashboards
 */
export async function createInteractiveStyleChart() {
  const result = await generateChart({
    chartType: 'bar',
    data: [
      { label: 'Week 1', value: 120, color: '#3498DB' },
      { label: 'Week 2', value: 135, color: '#2ECC71' },
      { label: 'Week 3', value: 110, color: '#E74C3C' },
      { label: 'Week 4', value: 150, color: '#F39C12' },
    ],
    title: 'Weekly Progress Tracking',
    subtitle: 'Real-time Performance Monitoring',
    xAxisLabel: 'Time Period',
    yAxisLabel: 'Progress Score',
    style: 'modern',
    colorScheme: 'vibrant',
    background: 'light',
    quality: 'high',
    customInstructions: 'Create an interactive-style chart with: hover effects simulated through subtle shadows, clickable button-like appearance for bars, modern flat design with subtle gradients, bright accent colors, rounded corners, and a clean interface aesthetic. Include progress indicators and status badges.',
    context: 'Web application dashboard - must look like it could be interactive',
  });

  return result;
}

// ============================================================================
// PROMPT ANALYSIS UTILITIES
// ============================================================================

/**
 * Analyze the generated prompt to show how detailed it is
 */
export function analyzePromptDetail(input: any): {
  promptLength: number;
  detailLevel: 'basic' | 'detailed' | 'extreme';
  sections: string[];
  recommendations: string[];
} {
  // This would analyze the actual generated prompt
  // For demonstration, we'll show what the analysis would look like
  
  const sections = [
    'Title and Typography',
    'Data Specification',
    'Axis Labels',
    'Visual Styling',
    'Color Specifications',
    'Background Details',
    'Typography Rules',
    'Layout and Spacing',
    'Grid and Axis',
    'Data Point Styling',
    'Quality Requirements'
  ];

  const recommendations = [
    'Include specific hex color codes for all elements',
    'Specify exact font sizes and weights',
    'Define precise spacing and margins',
    'Add detailed styling for each chart element',
    'Include quality and resolution requirements',
    'Specify background and transparency settings',
    'Add context about intended use case',
    'Include custom instructions for special effects'
  ];

  return {
    promptLength: 2500, // Estimated length of detailed prompt
    detailLevel: 'extreme',
    sections,
    recommendations
  };
}

/**
 * Generate a prompt complexity score
 */
export function calculatePromptComplexity(input: any): {
  score: number;
  level: string;
  factors: string[];
} {
  let score = 0;
  const factors: string[] = [];

  // Base score for required elements
  if (input.title) { score += 10; factors.push('Title specified'); }
  if (input.subtitle) { score += 5; factors.push('Subtitle included'); }
  if (input.xAxisLabel) { score += 5; factors.push('X-axis label'); }
  if (input.yAxisLabel) { score += 5; factors.push('Y-axis label'); }

  // Style and color complexity
  if (input.style) { score += 10; factors.push('Style specified'); }
  if (input.colorScheme) { score += 10; factors.push('Color scheme defined'); }
  if (input.customColors) { score += 15; factors.push('Custom colors specified'); }

  // Advanced features
  if (input.annotations) { score += 20; factors.push('Annotations included'); }
  if (input.customInstructions) { score += 25; factors.push('Custom instructions'); }
  if (input.context) { score += 15; factors.push('Context provided'); }

  // Quality and format
  if (input.quality === 'high') { score += 10; factors.push('High quality setting'); }
  if (input.transparency) { score += 10; factors.push('Transparency enabled'); }

  let level = 'basic';
  if (score >= 50) level = 'detailed';
  if (score >= 100) level = 'extreme';

  return { score, level, factors };
}

// ============================================================================
// EXPORT ALL EXAMPLES
// ============================================================================

export const detailedPromptExamples = {
  // Ultra-detailed examples
  createUltraDetailedBarChart,
  createScientificLineChart,
  createCreativePieChart,
  createCorporateDashboard,
  createTransparentOverlayChart,
  createDarkThemeChart,
  createPrintQualityChart,
  createInteractiveStyleChart,
  
  // Analysis utilities
  analyzePromptDetail,
  calculatePromptComplexity,
};

/**
 * Example of how to use the detailed prompt system
 */
export async function demonstrateDetailedPrompts() {
  console.log('=== GPT Image 1 Detailed Prompt Examples ===\n');

  // Example 1: Basic vs Detailed
  console.log('1. Creating ultra-detailed bar chart...');
  const barChart = await createUltraDetailedBarChart();
  console.log('✅ Generated with extreme detail specifications\n');

  // Example 2: Scientific chart
  console.log('2. Creating scientific line chart...');
  const lineChart = await createScientificLineChart();
  console.log('✅ Generated with academic-level detail\n');

  // Example 3: Creative chart
  console.log('3. Creating creative pie chart...');
  const pieChart = await createCreativePieChart();
  console.log('✅ Generated with artistic detail specifications\n');

  // Analyze prompt complexity
  const complexity = calculatePromptComplexity({
    title: true,
    subtitle: true,
    customColors: true,
    annotations: true,
    customInstructions: true,
    context: true,
    quality: 'high'
  });

  console.log('Prompt Complexity Analysis:');
  console.log(`Score: ${complexity.score}/100`);
  console.log(`Level: ${complexity.level}`);
  console.log('Factors:', complexity.factors.join(', '));

  return {
    barChart,
    lineChart,
    pieChart,
    complexity
  };
}
