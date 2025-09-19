import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateChart, generateChartVariations, generateDashboard, chartUtils, getChartGeneratorInfo } from "../../../../executors/gpt-image-1-chart-generator";

// Request validation schema
const ChartGeneratorRequestSchema = z.object({
  // Chart type and data
  chartType: z.enum([
    'bar', 'line', 'pie', 'scatter', 'area', 'histogram', 'heatmap', 
    'gantt', 'sankey', 'treemap', 'funnel', 'radar', 'bubble', 
    'waterfall', 'candlestick', 'boxplot', 'violin', 'density', 
    'contour', 'surface', 'network', 'flowchart', 'mindmap', 
    'orgchart', 'timeline', 'infographic', 'dashboard', 'custom'
  ]),
  
  // Data specification - flexible to accept different formats
  data: z.union([
    z.array(z.object({
      label: z.string(),
      value: z.number(),
      category: z.string().optional(),
      color: z.string().optional(),
      metadata: z.record(z.any()).optional(),
    })),
    z.record(z.number()), // Object with string keys and number values
    z.string(), // Description of data
  ]),
  
  // Chart configuration
  title: z.string().optional(),
  subtitle: z.string().optional(),
  xAxisLabel: z.string().optional(),
  yAxisLabel: z.string().optional(),
  legend: z.boolean().optional(),
  gridLines: z.boolean().optional(),
  
  // Styling options
  colorScheme: z.enum(['professional', 'vibrant', 'monochrome', 'pastel', 'dark', 'custom']).optional(),
  customColors: z.array(z.string()).optional(),
  style: z.enum(['modern', 'classic', 'minimal', 'corporate', 'creative', 'scientific']).optional(),
  background: z.enum(['white', 'transparent', 'light', 'dark', 'gradient']).optional(),
  
  // Layout and dimensions
  orientation: z.enum(['horizontal', 'vertical']).optional(),
  size: z.enum(['small', 'medium', 'large', 'presentation', 'poster']).optional(),
  aspectRatio: z.enum(['square', 'landscape', 'portrait', 'wide', 'tall']).optional(),
  
  // Advanced options
  annotations: z.array(z.object({
    text: z.string(),
    position: z.enum(['top', 'bottom', 'left', 'right', 'center']),
    style: z.enum(['callout', 'arrow', 'highlight', 'note']).optional(),
  })).optional(),
  
  // GPT Image 1 specific options
  quality: z.enum(['low', 'medium', 'high', 'auto']).optional(),
  outputFormat: z.enum(['png', 'jpeg', 'webp']).optional(),
  transparency: z.boolean().optional(),
  
  // Custom prompt additions
  customInstructions: z.string().optional(),
  context: z.string().optional(),
  
  // Options
  timeout: z.number().min(1000).max(300000).optional(), // 5 minutes max
  retries: z.number().min(0).max(3).optional(),
});

// Batch generation schema
const BatchChartRequestSchema = z.object({
  charts: z.array(ChartGeneratorRequestSchema),
  options: z.object({
    timeout: z.number().min(1000).max(300000).optional(),
    retries: z.number().min(0).max(3).optional(),
  }).optional(),
});

// Dashboard generation schema
const DashboardRequestSchema = z.object({
  charts: z.array(ChartGeneratorRequestSchema),
  layout: z.enum(['grid', 'rows', 'columns', 'custom']).optional(),
  title: z.string().optional(),
  theme: z.string().optional(),
  options: z.object({
    timeout: z.number().min(1000).max(300000).optional(),
    retries: z.number().min(0).max(3).optional(),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Determine request type based on structure
    let requestType: 'single' | 'batch' | 'dashboard' = 'single';
    
    if (body.charts && Array.isArray(body.charts)) {
      if (body.layout || body.title) {
        requestType = 'dashboard';
      } else {
        requestType = 'batch';
      }
    }
    
    // Validate request based on type
    let validationResult: z.SafeParseReturnType<any, any>;
    
    switch (requestType) {
      case 'batch':
        validationResult = BatchChartRequestSchema.safeParse(body);
        break;
      case 'dashboard':
        validationResult = DashboardRequestSchema.safeParse(body);
        break;
      default:
        validationResult = ChartGeneratorRequestSchema.safeParse(body);
    }
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid request format", 
          details: validationResult.error.errors,
          requestType
        },
        { status: 400 }
      );
    }
    
    const validatedData = validationResult.data;
    
    // Handle different request types
    switch (requestType) {
      case 'single':
        return await handleSingleChartGeneration(validatedData);
        
      case 'batch':
        return await handleBatchChartGeneration(validatedData);
        
      case 'dashboard':
        return await handleDashboardGeneration(validatedData);
        
      default:
        return NextResponse.json(
          { success: false, error: "Invalid request type" },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error("Chart generator error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * Handle single chart generation
 */
async function handleSingleChartGeneration(data: any) {
  try {
    const { timeout, retries, ...chartInput } = data;
    
    const result = await generateChart(chartInput, {
      timeout,
      retries,
    });
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        type: "single",
        result,
        metadata: {
          generatedAt: new Date().toISOString(),
          processingTime: result.chart.metadata.processingTime,
          cost: result.chart.metadata.cost,
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        type: "single",
        error: result.error,
        metadata: {
          generatedAt: new Date().toISOString(),
          processingTime: result.chart.metadata.processingTime,
        }
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error("Single chart generation failed:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Chart generation failed",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * Handle batch chart generation
 */
async function handleBatchChartGeneration(data: any) {
  try {
    const { charts, options = {} } = data;
    
    const results = await Promise.all(
      charts.map(async (chartInput: any) => {
        const { timeout, retries, ...input } = chartInput;
        return generateChart(input, {
          timeout: timeout || options.timeout,
          retries: retries || options.retries,
        });
      })
    );
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    return NextResponse.json({
      success: true,
      type: "batch",
      results,
      summary: {
        total: results.length,
        successful: successful.length,
        failed: failed.length,
        totalProcessingTime: results.reduce((sum, r) => sum + r.chart.metadata.processingTime, 0),
        totalCost: results.reduce((sum, r) => sum + r.chart.metadata.cost, 0),
      },
      metadata: {
        generatedAt: new Date().toISOString(),
      }
    });
    
  } catch (error) {
    console.error("Batch chart generation failed:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Batch chart generation failed",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * Handle dashboard generation
 */
async function handleDashboardGeneration(data: any) {
  try {
    const { charts, layout, title, theme, options = {} } = data;
    
    const result = await generateDashboard(charts, {
      layout,
      title,
      theme,
      ...options,
    });
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        type: "dashboard",
        result,
        metadata: {
          generatedAt: new Date().toISOString(),
          processingTime: result.chart.metadata.processingTime,
          cost: result.chart.metadata.cost,
          chartCount: charts.length,
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        type: "dashboard",
        error: result.error,
        metadata: {
          generatedAt: new Date().toISOString(),
          processingTime: result.chart.metadata.processingTime,
        }
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error("Dashboard generation failed:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Dashboard generation failed",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// GET endpoint for model information and capabilities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'info':
        const info = getChartGeneratorInfo();
        
        return NextResponse.json({
          success: true,
          info,
        });

      case 'examples':
        const examples = {
          salesChart: {
            chartType: 'bar',
            data: [
              { label: 'Q1', value: 120000 },
              { label: 'Q2', value: 150000 },
              { label: 'Q3', value: 180000 },
              { label: 'Q4', value: 200000 },
            ],
            title: 'Quarterly Sales Performance',
            xAxisLabel: 'Quarter',
            yAxisLabel: 'Sales ($)',
            style: 'corporate',
            colorScheme: 'professional',
          },
          marketShare: {
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
          },
          trendAnalysis: {
            chartType: 'line',
            data: [
              { label: 'Jan', value: 100 },
              { label: 'Feb', value: 120 },
              { label: 'Mar', value: 110 },
              { label: 'Apr', value: 140 },
              { label: 'May', value: 160 },
              { label: 'Jun', value: 150 },
            ],
            title: 'Monthly Trend Analysis',
            xAxisLabel: 'Month',
            yAxisLabel: 'Value',
            style: 'scientific',
            colorScheme: 'professional',
            gridLines: true,
          },
        };
        
        return NextResponse.json({
          success: true,
          examples,
        });

      case 'utils':
        const utils = {
          createSalesChart: "chartUtils.createSalesChart(data, options)",
          createMarketShareChart: "chartUtils.createMarketShareChart(data, options)",
          createTrendChart: "chartUtils.createTrendChart(data, options)",
          createComparisonChart: "chartUtils.createComparisonChart(data, options)",
          createKPIDashboard: "chartUtils.createKPIDashboard(kpis, options)",
        };
        
        return NextResponse.json({
          success: true,
          utils,
        });

      default:
        return NextResponse.json({
          success: true,
          endpoints: {
            info: "/api/dreamcut/chart-generator?action=info",
            examples: "/api/dreamcut/chart-generator?action=examples",
            utils: "/api/dreamcut/chart-generator?action=utils",
          },
          supportedChartTypes: [
            'bar', 'line', 'pie', 'scatter', 'area', 'histogram', 'heatmap', 
            'gantt', 'sankey', 'treemap', 'funnel', 'radar', 'bubble', 
            'waterfall', 'candlestick', 'boxplot', 'violin', 'density', 
            'contour', 'surface', 'network', 'flowchart', 'mindmap', 
            'orgchart', 'timeline', 'infographic', 'dashboard', 'custom'
          ],
          supportedStyles: ['modern', 'classic', 'minimal', 'corporate', 'creative', 'scientific'],
          supportedColorSchemes: ['professional', 'vibrant', 'monochrome', 'pastel', 'dark', 'custom'],
        });
    }

  } catch (error) {
    console.error("Chart generator GET error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
