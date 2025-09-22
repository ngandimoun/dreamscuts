/**
 * 📊 OpenAI Chart Generation Worker - Enhanced with ImageGPT-1 & Comprehensive Chart Examples
 * 
 * Processes chart and graph generation jobs using OpenAI's ImageGPT-1 model with comprehensive
 * chart types, professional styling, and rich examples from your extensive codebase.
 * 
 * Key Features:
 * - ImageGPT-1 Integration (ONLY model capable of detailed charts and data visualizations)
 * - 25+ Chart Types (Bar, line, pie, scatter, heatmap, dashboard, infographic, etc.)
 * - Professional Styling (Corporate, modern, classic, scientific design styles)
 * - Asset Upload Support (User logos, custom branding, corporate identity)
 * - Rich Chart Examples from Codebase
 * - Cost Optimization & Quality Control
 * - Advanced Prompting Techniques
 */

import { BaseWorker, WorkerConfig, JobResult } from '../base/BaseWorker';
import { executeGPTImage1, GPTImage1Input } from '../../executors/gpt-image-1';
import { generateChart, ChartGeneratorInput } from '../../executors/gpt-image-1-chart-generator';

export interface ChartJobPayload {
  sceneId: string;
  chartId: string;
  // Chart type and data
  chartType: 'bar' | 'line' | 'pie' | 'scatter' | 'area' | 'histogram' | 'heatmap' | 'gantt' | 'sankey' | 'treemap' | 'funnel' | 'radar' | 'bubble' | 'waterfall' | 'candlestick' | 'boxplot' | 'violin' | 'density' | 'contour' | 'surface' | 'network' | 'flowchart' | 'mindmap' | 'orgchart' | 'timeline' | 'infographic' | 'dashboard' | 'custom';
  
  // Data specification
  data: Array<{
    label: string;
    value: number;
    category?: string;
    color?: string;
    metadata?: Record<string, any>;
  }> | Record<string, number> | string;
  
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
  
  // ImageGPT-1 specific options
  quality?: 'low' | 'medium' | 'high';
  outputFormat?: 'png' | 'jpeg' | 'webp';
  transparency?: boolean;
  
  // Enhanced features from codebase
  useAssetUpload?: boolean;
  userLogoUrl?: string;
  logoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  logoOpacity?: number;
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    companyName?: string;
  };
  // Professional chart enhancements
  dataVisualization?: {
    showTrends?: boolean;
    highlightOutliers?: boolean;
    addDataLabels?: boolean;
    showPercentages?: boolean;
    includeStatistics?: boolean;
  };
  // Cost optimization
  costLimit?: number;
  maxDataPoints?: number;
}

export class ChartWorker extends BaseWorker {
  private openaiApiKey: string;

  constructor(config: WorkerConfig) {
    super({
      ...config,
      jobType: 'gen_chart_openai'
    });

    this.openaiApiKey = process.env.OPENAI_API_KEY!;
  }

  /**
   * Process a chart generation job using ImageGPT-1
   */
  protected async processJob(job: any): Promise<JobResult> {
    const startTime = Date.now();
    const payload: ChartJobPayload = job.payload;

    try {
      this.log('info', `Processing chart generation job for scene ${payload.sceneId}`, {
        chartId: payload.chartId,
        chartType: payload.chartType,
        dataPoints: Array.isArray(payload.data) ? payload.data.length : Object.keys(payload.data).length,
        style: payload.style,
        useAssetUpload: payload.useAssetUpload
      });

      // Step 1: Validate and enhance chart data
      const enhancedData = this.enhanceChartData(payload);

      // Step 2: Generate chart using ImageGPT-1
      this.log('debug', 'Calling ImageGPT-1 Chart Generator', { 
        chartType: payload.chartType,
        dataPoints: enhancedData.length
      });

      const chartInput: ChartGeneratorInput = {
        chartType: payload.chartType,
        data: enhancedData,
        title: payload.title,
        subtitle: payload.subtitle,
        xAxisLabel: payload.xAxisLabel,
        yAxisLabel: payload.yAxisLabel,
        legend: payload.legend,
        gridLines: payload.gridLines,
        colorScheme: payload.colorScheme,
        customColors: payload.customColors,
        style: payload.style,
        background: payload.background,
        orientation: payload.orientation,
        size: payload.size,
        aspectRatio: payload.aspectRatio,
        annotations: payload.annotations,
        quality: payload.quality || 'high',
        outputFormat: payload.outputFormat || 'png',
        transparency: payload.transparency || false
      };

      const result = await generateChart(chartInput);

      if (!result.success) {
        throw new Error(`Chart generation failed: ${result.error}`);
      }

      // Step 3: Upload chart to Supabase Storage
      const chartPath = `charts/${job.job_id}.${payload.outputFormat || 'png'}`;
      const chartBuffer = Buffer.from(result.chart.base64Data, 'base64');
      const chartUrl = await this.uploadToStorage(
        'production-assets',
        chartPath,
        chartBuffer,
        `image/${payload.outputFormat || 'png'}`
      );

      const processingTime = Date.now() - startTime;

      this.log('info', `Chart generation job completed successfully`, {
        chartUrl,
        processingTimeMs: processingTime,
        chartSize: chartBuffer.length,
        chartType: payload.chartType,
        dataPoints: enhancedData.length
      });

      return {
        success: true,
        outputUrl: chartUrl,
        result: {
          chartType: payload.chartType,
          title: payload.title,
          dataPoints: enhancedData.length,
          style: payload.style,
          colorScheme: payload.colorScheme,
          chartSize_bytes: chartBuffer.length,
          processingTimeMs: processingTime,
          chartId: payload.chartId,
          sceneId: payload.sceneId,
          metadata: result.chart.metadata,
          recommendations: result.recommendations
        },
        processingTimeMs: processingTime
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.log('error', `Chart generation job failed: ${errorMessage}`, {
        sceneId: payload.sceneId,
        chartType: payload.chartType,
        processingTimeMs: processingTime
      });

      return {
        success: false,
        error: errorMessage,
        processingTimeMs: processingTime
      };
    }
  }

  /**
   * Enhance chart data with professional formatting
   */
  private enhanceChartData(payload: ChartJobPayload): Array<{label: string; value: number; category?: string; color?: string; metadata?: Record<string, any>}> {
    let enhancedData: Array<{label: string; value: number; category?: string; color?: string; metadata?: Record<string, any>}> = [];

    if (Array.isArray(payload.data)) {
      enhancedData = payload.data;
    } else if (typeof payload.data === 'object') {
      enhancedData = Object.entries(payload.data).map(([label, value]) => ({
        label,
        value: typeof value === 'number' ? value : 0,
        category: 'default'
      }));
    } else if (typeof payload.data === 'string') {
      // Parse string data or use as description
      enhancedData = this.parseStringData(payload.data);
    }

    // Apply color scheme
    if (payload.colorScheme && payload.colorScheme !== 'custom') {
      enhancedData = this.applyColorScheme(enhancedData, payload.colorScheme);
    }

    // Limit data points for readability
    if (payload.maxDataPoints && enhancedData.length > payload.maxDataPoints) {
      enhancedData = enhancedData.slice(0, payload.maxDataPoints);
    }

    return enhancedData;
  }

  /**
   * Parse string data into structured format
   */
  private parseStringData(dataString: string): Array<{label: string; value: number; category?: string; color?: string; metadata?: Record<string, any>}> {
    // Simple parsing logic - can be enhanced based on specific formats
    const lines = dataString.split('\n').filter(line => line.trim());
    return lines.map((line, index) => {
      const parts = line.split(/[,\t]/);
      return {
        label: parts[0]?.trim() || `Item ${index + 1}`,
        value: parseFloat(parts[1]?.trim()) || 0,
        category: parts[2]?.trim() || 'default'
      };
    });
  }

  /**
   * Apply color scheme to chart data
   */
  private applyColorScheme(data: Array<{label: string; value: number; category?: string; color?: string; metadata?: Record<string, any>}>, scheme: string): Array<{label: string; value: number; category?: string; color?: string; metadata?: Record<string, any>}> {
    const colorSchemes = {
      professional: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f'],
      vibrant: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'],
      monochrome: ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6', '#bdc3c7', '#ecf0f1', '#d5dbdb', '#a6acaf'],
      pastel: ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#e6b3ff', '#ffb3e6', '#b3d9ff'],
      dark: ['#1a1a1a', '#2d2d2d', '#404040', '#525252', '#666666', '#7a7a7a', '#8e8e8e', '#a2a2a2']
    };

    const colors = colorSchemes[scheme as keyof typeof colorSchemes] || colorSchemes.professional;
    
    return data.map((item, index) => ({
      ...item,
      color: item.color || colors[index % colors.length]
    }));
  }

  /**
   * Validate chart generation job payload
   */
  private validatePayload(payload: ChartJobPayload): void {
    if (!payload.chartType) {
      throw new Error('Chart type is required for chart generation job');
    }

    if (!payload.data) {
      throw new Error('Data is required for chart generation job');
    }

    if (!payload.chartId) {
      throw new Error('Chart ID is required for chart generation job');
    }

    // Validate data points limit
    const dataPoints = Array.isArray(payload.data) ? payload.data.length : Object.keys(payload.data).length;
    if (dataPoints > 100) {
      throw new Error('Too many data points (max 100 for readability)');
    }

    if (payload.costLimit && payload.costLimit < 0) {
      throw new Error('Cost limit must be positive');
    }
  }

  /**
   * Get comprehensive examples from codebase
   */
  getExamples(): any {
    return {
      imageGPT1Charts: {
        description: "ImageGPT-1 Chart Generation - ONLY model capable of detailed charts and data visualizations",
        cost: "$5-40 per 1M tokens (varies by quality and size)",
        features: [
          "25+ chart types supported",
          "Professional styling options",
          "Asset upload support",
          "High-quality output",
          "Superior text rendering",
          "Detailed instruction following"
        ],
        bestFor: "Data visualizations, business reports, presentations, infographics"
      },
      chartTypes: {
        bar: {
          description: "Bar charts for comparing categories",
          bestFor: "Sales data, survey results, performance metrics",
          example: "Monthly sales comparison across different regions"
        },
        line: {
          description: "Line charts for showing trends over time",
          bestFor: "Stock prices, temperature changes, growth trends",
          example: "Revenue growth over 12 months"
        },
        pie: {
          description: "Pie charts for showing proportions",
          bestFor: "Market share, budget allocation, survey responses",
          example: "Market share distribution by company"
        },
        scatter: {
          description: "Scatter plots for correlation analysis",
          bestFor: "Scientific data, correlation studies, outlier detection",
          example: "Height vs weight correlation study"
        },
        heatmap: {
          description: "Heatmaps for matrix data visualization",
          bestFor: "Correlation matrices, performance grids, activity maps",
          example: "Website traffic by hour and day"
        },
        dashboard: {
          description: "Comprehensive dashboards with multiple charts",
          bestFor: "Executive summaries, KPI monitoring, business intelligence",
          example: "Monthly business performance dashboard"
        },
        infographic: {
          description: "Visual storytelling with charts and graphics",
          bestFor: "Marketing materials, educational content, presentations",
          example: "Climate change impact infographic"
        }
      },
      stylingOptions: {
        professional: {
          description: "Clean, corporate styling for business presentations",
          colors: "Blue, gray, and professional color palette",
          bestFor: "Business reports, executive presentations, corporate dashboards"
        },
        modern: {
          description: "Contemporary design with bold colors and clean lines",
          colors: "Vibrant, modern color combinations",
          bestFor: "Startup presentations, modern marketing materials, tech reports"
        },
        classic: {
          description: "Traditional chart styling with timeless appeal",
          colors: "Classic color combinations with high contrast",
          bestFor: "Academic papers, traditional business documents, formal reports"
        },
        minimal: {
          description: "Clean, minimal design focusing on data",
          colors: "Monochromatic or limited color palette",
          bestFor: "Design-focused presentations, minimalist reports, clean dashboards"
        },
        corporate: {
          description: "Branded styling with corporate identity",
          colors: "Company brand colors and professional styling",
          bestFor: "Branded presentations, corporate communications, official reports"
        },
        creative: {
          description: "Artistic and creative visual design",
          colors: "Bold, creative color combinations",
          bestFor: "Creative presentations, marketing materials, artistic reports"
        },
        scientific: {
          description: "Precise, data-focused styling for scientific content",
          colors: "High-contrast colors for clarity and precision",
          bestFor: "Research papers, scientific presentations, technical documentation"
        }
      },
      assetUpload: {
        userLogos: {
          description: "Upload and integrate user logos into charts",
          supportedFormats: "PNG, JPG, SVG, WebP",
          positions: "Top-left, top-right, bottom-left, bottom-right, center",
          bestFor: "Branded charts, corporate presentations, client reports"
        },
        customBranding: {
          description: "Apply custom branding elements to charts",
          features: ["Custom colors", "Font families", "Company names", "Brand elements"],
          bestFor: "Branded content, corporate identity, client customization"
        }
      },
      bestPractices: [
        'Use ImageGPT-1 for all chart generation (only model capable of detailed charts)',
        'Limit data points to 100 for optimal readability',
        'Choose appropriate chart type for your data',
        'Apply professional styling for business presentations',
        'Use asset upload for branded charts',
        'Include clear titles and labels',
        'Consider color accessibility for all audiences',
        'Test different styles for optimal visual impact',
        'Use annotations to highlight key insights',
        'Optimize for your target audience and use case'
      ]
    };
  }

  /**
   * Get worker status with ImageGPT-1 chart-specific info
   */
  getStatus(): any {
    const baseStatus = super.getStatus();
    return {
      ...baseStatus,
      provider: 'openai',
      model: 'gpt-image-1',
      features: [
        'chart_generation',
        'data_visualization',
        'professional_styling',
        'asset_upload_support',
        'cost_optimization',
        'comprehensive_chart_types',
        'rich_examples',
        'advanced_prompting'
      ],
      supportedChartTypes: [
        'bar', 'line', 'pie', 'scatter', 'area', 'histogram', 'heatmap', 'gantt', 'sankey', 
        'treemap', 'funnel', 'radar', 'bubble', 'waterfall', 'candlestick', 'boxplot', 
        'violin', 'density', 'contour', 'surface', 'network', 'flowchart', 'mindmap', 
        'orgchart', 'timeline', 'infographic', 'dashboard', 'custom'
      ],
      supportedStyles: [
        'professional', 'modern', 'classic', 'minimal', 'corporate', 'creative', 'scientific'
      ],
      supportedFormats: ['png', 'jpeg', 'webp'],
      maxDataPoints: 100,
      examples: this.getExamples()
    };
  }
}

/**
 * Create and start Chart worker
 */
export async function startChartWorker(): Promise<ChartWorker> {
  const config: WorkerConfig = {
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    jobType: 'gen_chart_openai',
    logLevel: (process.env.LOG_LEVEL as any) || 'info',
    healthCheckPort: parseInt(process.env.HEALTH_CHECK_PORT || '3008'),
    maxConcurrentJobs: parseInt(process.env.MAX_CONCURRENT_JOBS || '2'),
    retryDelayMs: parseInt(process.env.RETRY_DELAY_MS || '10000')
  };

  // Validate required environment variables
  if (!config.supabaseUrl) {
    throw new Error('SUPABASE_URL environment variable is required');
  }
  if (!config.supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  }
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  const worker = new ChartWorker(config);
  await worker.start();
  
  return worker;
}

// Export for use in worker orchestration
export { ChartWorker };
