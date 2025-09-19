/**
 * GPT Image 1 Chart Generator - Usage Examples
 * 
 * This file contains comprehensive examples of how to use the GPT Image 1
 * Chart Generator for various chart types and use cases.
 */

import { 
  generateChart, 
  generateChartVariations, 
  generateDashboard, 
  chartUtils,
  getChartGeneratorInfo 
} from '../executors/gpt-image-1-chart-generator';

// ============================================================================
// BASIC CHART EXAMPLES
// ============================================================================

/**
 * Example 1: Simple Bar Chart
 * Perfect for comparing categorical data
 */
export async function createSimpleBarChart() {
  const result = await generateChart({
    chartType: 'bar',
    data: [
      { label: 'Q1 2024', value: 120000 },
      { label: 'Q2 2024', value: 150000 },
      { label: 'Q3 2024', value: 180000 },
      { label: 'Q4 2024', value: 200000 },
    ],
    title: 'Quarterly Sales Performance',
    xAxisLabel: 'Quarter',
    yAxisLabel: 'Sales ($)',
    style: 'corporate',
    colorScheme: 'professional',
    quality: 'high',
  });

  console.log('Bar chart generated:', result.chart.metadata);
  return result;
}

/**
 * Example 2: Line Chart for Trends
 * Ideal for showing data over time
 */
export async function createTrendLineChart() {
  const result = await generateChart({
    chartType: 'line',
    data: [
      { label: 'Jan', value: 100 },
      { label: 'Feb', value: 120 },
      { label: 'Mar', value: 110 },
      { label: 'Apr', value: 140 },
      { label: 'May', value: 160 },
      { label: 'Jun', value: 150 },
    ],
    title: 'Monthly Revenue Trends',
    xAxisLabel: 'Month',
    yAxisLabel: 'Revenue ($K)',
    style: 'modern',
    colorScheme: 'professional',
    quality: 'high',
    gridLines: true,
  });

  return result;
}

/**
 * Example 3: Pie Chart for Proportions
 * Great for showing market share or distribution
 */
export async function createMarketSharePieChart() {
  const result = await generateChart({
    chartType: 'pie',
    data: [
      { label: 'Company A', value: 35 },
      { label: 'Company B', value: 25 },
      { label: 'Company C', value: 20 },
      { label: 'Others', value: 20 },
    ],
    title: 'Market Share Distribution',
    style: 'modern',
    colorScheme: 'vibrant',
    quality: 'high',
  });

  return result;
}

// ============================================================================
// ADVANCED CHART EXAMPLES
// ============================================================================

/**
 * Example 4: Scatter Plot for Correlation
 * Perfect for showing relationships between variables
 */
export async function createScatterPlot() {
  const result = await generateChart({
    chartType: 'scatter',
    data: [
      { label: 'Product A', value: 85, category: 'High Price' },
      { label: 'Product B', value: 72, category: 'Medium Price' },
      { label: 'Product C', value: 90, category: 'High Price' },
      { label: 'Product D', value: 65, category: 'Low Price' },
      { label: 'Product E', value: 78, category: 'Medium Price' },
    ],
    title: 'Price vs Quality Correlation',
    xAxisLabel: 'Price ($)',
    yAxisLabel: 'Quality Score',
    style: 'scientific',
    colorScheme: 'professional',
    quality: 'high',
    customInstructions: 'Show correlation line and R-squared value',
  });

  return result;
}

/**
 * Example 5: Heatmap for Matrix Data
 * Excellent for showing patterns in 2D data
 */
export async function createHeatmap() {
  const result = await generateChart({
    chartType: 'heatmap',
    data: [
      { label: 'Mon', value: 85, category: 'Morning' },
      { label: 'Mon', value: 92, category: 'Afternoon' },
      { label: 'Mon', value: 78, category: 'Evening' },
      { label: 'Tue', value: 88, category: 'Morning' },
      { label: 'Tue', value: 95, category: 'Afternoon' },
      { label: 'Tue', value: 82, category: 'Evening' },
      // ... more data points
    ],
    title: 'Website Traffic by Day and Time',
    xAxisLabel: 'Day of Week',
    yAxisLabel: 'Time of Day',
    style: 'modern',
    colorScheme: 'vibrant',
    quality: 'high',
  });

  return result;
}

/**
 * Example 6: Gantt Chart for Project Management
 * Perfect for timeline visualization
 */
export async function createGanttChart() {
  const result = await generateChart({
    chartType: 'gantt',
    data: [
      { label: 'Planning', value: 7, category: 'Phase 1' },
      { label: 'Development', value: 14, category: 'Phase 2' },
      { label: 'Testing', value: 7, category: 'Phase 3' },
      { label: 'Deployment', value: 3, category: 'Phase 4' },
    ],
    title: 'Project Timeline',
    xAxisLabel: 'Duration (Days)',
    yAxisLabel: 'Tasks',
    style: 'corporate',
    colorScheme: 'professional',
    quality: 'high',
    customInstructions: 'Show task dependencies and milestones',
  });

  return result;
}

// ============================================================================
// DASHBOARD EXAMPLES
// ============================================================================

/**
 * Example 7: Executive Dashboard
 * Comprehensive view of key metrics
 */
export async function createExecutiveDashboard() {
  const dashboard = await generateDashboard(
    [
      {
        chartType: 'bar',
        data: [
          { label: 'Revenue', value: 2500000 },
          { label: 'Expenses', value: 1800000 },
          { label: 'Profit', value: 700000 },
        ],
        title: 'Financial Overview',
        style: 'corporate',
        colorScheme: 'professional',
      },
      {
        chartType: 'pie',
        data: [
          { label: 'Product A', value: 40 },
          { label: 'Product B', value: 35 },
          { label: 'Product C', value: 25 },
        ],
        title: 'Product Mix',
        style: 'modern',
        colorScheme: 'vibrant',
      },
      {
        chartType: 'line',
        data: [
          { label: 'Q1', value: 100 },
          { label: 'Q2', value: 120 },
          { label: 'Q3', value: 140 },
          { label: 'Q4', value: 160 },
        ],
        title: 'Growth Trends',
        style: 'scientific',
        colorScheme: 'professional',
      },
    ],
    {
      layout: 'grid',
      title: 'Executive Dashboard Q4 2024',
      theme: 'corporate',
    }
  );

  return dashboard;
}

/**
 * Example 8: KPI Dashboard
 * Key performance indicators visualization
 */
export async function createKPIDashboard() {
  const result = await generateChart({
    chartType: 'dashboard',
    data: [
      { label: 'Revenue', value: 2500000 },
      { label: 'Customers', value: 15000 },
      { label: 'Satisfaction', value: 4.8 },
      { label: 'Retention', value: 92 },
    ],
    title: 'KPI Dashboard',
    style: 'modern',
    colorScheme: 'professional',
    size: 'presentation',
    aspectRatio: 'landscape',
    customInstructions: 'Create individual KPI cards with progress indicators and trend arrows',
    context: 'Monthly KPI review for board presentation',
  });

  return result;
}

// ============================================================================
// UTILITY FUNCTION EXAMPLES
// ============================================================================

/**
 * Example 9: Using Pre-built Chart Templates
 * Leverage the utility functions for common chart types
 */
export async function useChartTemplates() {
  // Sales Performance Chart
  const salesChart = chartUtils.createSalesChart(
    [
      { month: 'January', sales: 120000 },
      { month: 'February', sales: 150000 },
      { month: 'March', sales: 180000 },
      { month: 'April', sales: 200000 },
    ],
    { style: 'corporate', colorScheme: 'professional' }
  );

  // Market Share Chart
  const marketShareChart = chartUtils.createMarketShareChart(
    [
      { company: 'Company A', share: 35 },
      { company: 'Company B', share: 25 },
      { company: 'Company C', share: 20 },
      { company: 'Others', share: 20 },
    ],
    { style: 'modern', colorScheme: 'vibrant' }
  );

  // Trend Analysis Chart
  const trendChart = chartUtils.createTrendChart(
    [
      { date: '2024-01-01', value: 100 },
      { date: '2024-02-01', value: 120 },
      { date: '2024-03-01', value: 110 },
      { date: '2024-04-01', value: 140 },
    ],
    { style: 'scientific', colorScheme: 'professional' }
  );

  // Generate all charts
  const [salesResult, marketResult, trendResult] = await Promise.all([
    generateChart(salesChart),
    generateChart(marketShareChart),
    generateChart(trendChart),
  ]);

  return { salesResult, marketResult, trendResult };
}

// ============================================================================
// BATCH GENERATION EXAMPLES
// ============================================================================

/**
 * Example 10: Generate Multiple Chart Variations
 * Create different styles of the same chart
 */
export async function createChartVariations() {
  const baseInput = {
    chartType: 'bar' as const,
    data: [
      { label: 'Product A', value: 100 },
      { label: 'Product B', value: 150 },
      { label: 'Product C', value: 120 },
    ],
    title: 'Product Performance',
  };

  const variations = await generateChartVariations(baseInput, [
    { style: 'modern', colorScheme: 'vibrant' },
    { style: 'classic', colorScheme: 'professional' },
    { style: 'minimal', colorScheme: 'monochrome' },
    { style: 'corporate', colorScheme: 'professional' },
  ]);

  return variations;
}

/**
 * Example 11: Batch Chart Generation
 * Generate multiple different charts in one request
 */
export async function createBatchCharts() {
  const charts = [
    {
      chartType: 'bar' as const,
      data: [{ label: 'Revenue', value: 1000000 }],
      title: 'Monthly Revenue',
      style: 'corporate' as const,
    },
    {
      chartType: 'pie' as const,
      data: [{ label: 'Market A', value: 60 }, { label: 'Market B', value: 40 }],
      title: 'Market Distribution',
      style: 'modern' as const,
    },
    {
      chartType: 'line' as const,
      data: [{ label: 'Jan', value: 100 }, { label: 'Feb', value: 120 }],
      title: 'Growth Trend',
      style: 'scientific' as const,
    },
  ];

  const results = await Promise.all(
    charts.map(chart => generateChart(chart))
  );

  return results;
}

// ============================================================================
// SPECIALIZED CHART EXAMPLES
// ============================================================================

/**
 * Example 12: Financial Charts
 * Candlestick and waterfall charts for financial data
 */
export async function createFinancialCharts() {
  // Candlestick Chart
  const candlestickChart = await generateChart({
    chartType: 'candlestick',
    data: [
      { label: 'Day 1', value: 100, category: 'Open' },
      { label: 'Day 1', value: 110, category: 'High' },
      { label: 'Day 1', value: 95, category: 'Low' },
      { label: 'Day 1', value: 105, category: 'Close' },
      // ... more data points
    ],
    title: 'Stock Price Movement',
    style: 'corporate',
    colorScheme: 'professional',
    quality: 'high',
  });

  // Waterfall Chart
  const waterfallChart = await generateChart({
    chartType: 'waterfall',
    data: [
      { label: 'Starting Value', value: 1000000 },
      { label: 'Revenue', value: 500000 },
      { label: 'Expenses', value: -200000 },
      { label: 'Investments', value: -100000 },
      { label: 'Final Value', value: 1200000 },
    ],
    title: 'Cash Flow Analysis',
    style: 'corporate',
    colorScheme: 'professional',
    quality: 'high',
  });

  return { candlestickChart, waterfallChart };
}

/**
 * Example 13: Scientific Charts
 * Statistical and scientific data visualization
 */
export async function createScientificCharts() {
  // Box Plot
  const boxPlot = await generateChart({
    chartType: 'boxplot',
    data: [
      { label: 'Group A', value: 75, category: 'Q1' },
      { label: 'Group A', value: 85, category: 'Median' },
      { label: 'Group A', value: 95, category: 'Q3' },
      { label: 'Group B', value: 70, category: 'Q1' },
      { label: 'Group B', value: 80, category: 'Median' },
      { label: 'Group B', value: 90, category: 'Q3' },
    ],
    title: 'Statistical Distribution Analysis',
    style: 'scientific',
    colorScheme: 'professional',
    quality: 'high',
  });

  // Density Plot
  const densityPlot = await generateChart({
    chartType: 'density',
    data: [
      { label: '0-10', value: 5 },
      { label: '10-20', value: 15 },
      { label: '20-30', value: 25 },
      { label: '30-40', value: 20 },
      { label: '40-50', value: 15 },
      { label: '50-60', value: 10 },
    ],
    title: 'Data Distribution Density',
    style: 'scientific',
    colorScheme: 'professional',
    quality: 'high',
  });

  return { boxPlot, densityPlot };
}

/**
 * Example 14: Process Flow Charts
 * Flowcharts and process diagrams
 */
export async function createProcessCharts() {
  // Flowchart
  const flowchart = await generateChart({
    chartType: 'flowchart',
    data: [
      { label: 'Start', value: 1, category: 'Process' },
      { label: 'Input Data', value: 2, category: 'Process' },
      { label: 'Validate', value: 3, category: 'Decision' },
      { label: 'Process', value: 4, category: 'Process' },
      { label: 'Output', value: 5, category: 'Process' },
      { label: 'End', value: 6, category: 'Process' },
    ],
    title: 'Data Processing Workflow',
    style: 'corporate',
    colorScheme: 'professional',
    quality: 'high',
    customInstructions: 'Show decision points with diamond shapes and process steps with rectangles',
  });

  // Sankey Diagram
  const sankeyDiagram = await generateChart({
    chartType: 'sankey',
    data: [
      { label: 'Source A', value: 100, category: 'Input' },
      { label: 'Source B', value: 80, category: 'Input' },
      { label: 'Process 1', value: 120, category: 'Process' },
      { label: 'Process 2', value: 60, category: 'Process' },
      { label: 'Output 1', value: 100, category: 'Output' },
      { label: 'Output 2', value: 80, category: 'Output' },
    ],
    title: 'Data Flow Analysis',
    style: 'modern',
    colorScheme: 'vibrant',
    quality: 'high',
  });

  return { flowchart, sankeyDiagram };
}

// ============================================================================
// CUSTOMIZATION EXAMPLES
// ============================================================================

/**
 * Example 15: Highly Customized Chart
 * Advanced customization with annotations and custom styling
 */
export async function createCustomizedChart() {
  const result = await generateChart({
    chartType: 'bar',
    data: [
      { label: 'Q1 2024', value: 120000, color: '#FF6B6B' },
      { label: 'Q2 2024', value: 150000, color: '#4ECDC4' },
      { label: 'Q3 2024', value: 180000, color: '#45B7D1' },
      { label: 'Q4 2024', value: 200000, color: '#96CEB4' },
    ],
    title: 'Quarterly Sales Performance',
    subtitle: 'Record-breaking Q4 performance',
    xAxisLabel: 'Quarter',
    yAxisLabel: 'Sales ($)',
    style: 'modern',
    colorScheme: 'custom',
    customColors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
    quality: 'high',
    outputFormat: 'png',
    transparency: false,
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
    customInstructions: 'Add trend line showing growth trajectory and highlight the Q4 achievement',
    context: 'Annual sales review presentation for stakeholders',
  });

  return result;
}

/**
 * Example 16: Transparent Background Chart
 * Perfect for overlaying on other content
 */
export async function createTransparentChart() {
  const result = await generateChart({
    chartType: 'pie',
    data: [
      { label: 'Desktop', value: 60 },
      { label: 'Mobile', value: 30 },
      { label: 'Tablet', value: 10 },
    ],
    title: 'Device Usage Distribution',
    style: 'minimal',
    colorScheme: 'pastel',
    quality: 'high',
    outputFormat: 'png',
    transparency: true,
    customInstructions: 'Clean, minimal design suitable for overlay on any background',
  });

  return result;
}

// ============================================================================
// ERROR HANDLING EXAMPLES
// ============================================================================

/**
 * Example 17: Error Handling
 * Proper error handling for chart generation
 */
export async function handleChartGenerationErrors() {
  try {
    const result = await generateChart({
      chartType: 'bar',
      data: [
        { label: 'Valid Data', value: 100 },
        { label: 'More Data', value: 200 },
      ],
      title: 'Test Chart',
      style: 'corporate',
      quality: 'high',
    });

    if (result.success) {
      console.log('Chart generated successfully:', result.chart.metadata);
      return result;
    } else {
      console.error('Chart generation failed:', result.error);
      throw new Error(result.error || 'Unknown error');
    }
  } catch (error) {
    console.error('Error in chart generation:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        console.error('API key issue - check configuration');
      } else if (error.message.includes('rate limit')) {
        console.error('Rate limit exceeded - implement backoff');
      } else if (error.message.includes('invalid data')) {
        console.error('Data validation failed - check input format');
      }
    }
    
    throw error;
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get model information
 */
export function getModelInfo() {
  return getChartGeneratorInfo();
}

/**
 * Calculate estimated cost for chart generation
 */
export function estimateCost(chartType: string, quality: string, dataPoints: number) {
  const baseCosts = {
    low: 0.011,
    medium: 0.042,
    high: 0.167,
  };

  const qualityCost = baseCosts[quality as keyof typeof baseCosts] || 0.042;
  const complexityMultiplier = Math.min(dataPoints / 10, 2); // Max 2x for complex charts

  return qualityCost * complexityMultiplier;
}

/**
 * Validate chart data
 */
export function validateChartData(data: any[], chartType: string) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Data must be a non-empty array');
  }

  if (data.length > 100) {
    console.warn('Large datasets may affect readability');
  }

  for (const item of data) {
    if (!item.label || typeof item.value !== 'number') {
      throw new Error('Each data item must have a label (string) and value (number)');
    }
  }

  // Chart-specific validation
  if (chartType === 'pie' && data.length > 8) {
    console.warn('Pie charts work best with 8 or fewer categories');
  }

  return true;
}

// ============================================================================
// EXPORT ALL EXAMPLES
// ============================================================================

export const chartExamples = {
  // Basic charts
  createSimpleBarChart,
  createTrendLineChart,
  createMarketSharePieChart,
  
  // Advanced charts
  createScatterPlot,
  createHeatmap,
  createGanttChart,
  
  // Dashboards
  createExecutiveDashboard,
  createKPIDashboard,
  
  // Templates
  useChartTemplates,
  
  // Batch generation
  createChartVariations,
  createBatchCharts,
  
  // Specialized charts
  createFinancialCharts,
  createScientificCharts,
  createProcessCharts,
  
  // Customization
  createCustomizedChart,
  createTransparentChart,
  
  // Error handling
  handleChartGenerationErrors,
  
  // Utilities
  getModelInfo,
  estimateCost,
  validateChartData,
};
