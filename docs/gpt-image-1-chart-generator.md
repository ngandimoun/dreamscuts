# GPT Image 1 Chart Generator

## Overview

The GPT Image 1 Chart Generator is a specialized system for creating professional charts, graphs, and explanatory diagrams using OpenAI's GPT Image 1 model. This is the **ONLY model capable** of generating detailed, accurate charts and data visualizations with superior instruction following and text rendering capabilities.

## Key Features

- **Chart Specialization**: Designed specifically for chart and diagram generation
- **Multiple Chart Types**: Support for 25+ chart types including bar, line, pie, scatter, heatmap, dashboard, and more
- **Professional Styling**: Corporate, modern, classic, and scientific design styles
- **Flexible Data Input**: Accepts structured data, objects, or descriptive text
- **High-Quality Output**: PNG, JPEG, and WebP formats with transparent background support
- **Cost Optimization**: Built-in cost calculation and quality level management
- **Batch Processing**: Generate multiple charts or dashboards in a single request
- **Extremely Detailed Prompts**: Automatically generates comprehensive prompts with every visual detail specified

## Model Information

- **Model**: `gpt-image-1`
- **Provider**: OpenAI (Official API)
- **API**: Direct OpenAI SDK integration (not Fal.ai or Replicate)
- **Specialization**: Charts, graphs, diagrams, data visualizations
- **Pricing**: $5-40 per 1M tokens (varies by quality and size)
- **Max Data Points**: 100 (recommended for readability)
- **Processing Time**: 30 seconds to 2 minutes (complex charts)
- **API Key**: Requires `OPENAI_API_KEY` environment variable

## Setup

### Environment Configuration

1. **Get OpenAI API Key**: Sign up at [OpenAI Platform](https://platform.openai.com/) and create an API key
2. **Set Environment Variable**: Add your API key to your environment:

```bash
# .env file
OPENAI_API_KEY=your_openai_api_key_here
```

3. **Verify Access**: Ensure you have access to GPT Image 1 model (may require organization verification)

### Dependencies

The system uses the official OpenAI SDK:

```bash
npm install openai
```

### API Access Requirements

- **OpenAI Account**: Active OpenAI account with billing enabled
- **Model Access**: Access to GPT Image 1 model (may require verification)
- **Rate Limits**: Respect OpenAI's rate limits and usage quotas

## Supported Chart Types

### Basic Charts
- **Bar Chart**: Vertical and horizontal bar charts
- **Line Chart**: Trend analysis and time series
- **Pie Chart**: Proportional data representation
- **Scatter Plot**: Correlation and distribution analysis
- **Area Chart**: Cumulative data visualization

### Advanced Charts
- **Histogram**: Data distribution analysis
- **Heatmap**: Matrix data visualization
- **Gantt Chart**: Project timeline visualization
- **Sankey Diagram**: Flow and process visualization
- **Treemap**: Hierarchical data representation
- **Funnel Chart**: Conversion and process flow
- **Radar Chart**: Multi-dimensional data comparison
- **Bubble Chart**: Three-dimensional data visualization

### Specialized Charts
- **Waterfall Chart**: Financial and process analysis
- **Candlestick Chart**: Financial market data
- **Box Plot**: Statistical data distribution
- **Violin Plot**: Probability density visualization
- **Density Plot**: Data distribution curves
- **Contour Plot**: Topographical data visualization
- **Surface Plot**: Three-dimensional surface data

### Diagrams and Layouts
- **Network Diagram**: Node and edge relationships
- **Flowchart**: Process and decision flows
- **Mind Map**: Hierarchical information organization
- **Org Chart**: Organizational structure
- **Timeline**: Chronological event visualization
- **Infographic**: Multi-element information design
- **Dashboard**: Multi-chart layout composition

## API Usage

### Basic Chart Generation

```typescript
import { generateChart } from '@/executors/gpt-image-1-chart-generator';

const result = await generateChart({
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
  quality: 'high',
});
```

### Detailed Prompt System

The system automatically generates extremely detailed prompts that include:

```typescript
// Example of the detailed prompt structure generated internally:
const detailedPrompt = `
Create a highly detailed, professional bar chart with the following EXACT specifications:

TITLE: "Quarterly Sales Performance" - Use large, bold, professional typography (24-32pt font size), centered at the top, with proper spacing (20-30px margin from top edge). Use a modern sans-serif font like Arial, Helvetica, or similar. Title should be in dark color (#2C3E50 or #34495E) for maximum readability.

DATA TO DISPLAY: Q1: 120000, Q2: 150000, Q3: 180000, Q4: 200000

X-AXIS LABEL: "Quarter" - Position at the bottom center, 15-20px from the chart area. Use 14-16pt font, medium weight, color #5D6D7E. Include proper spacing and alignment.

Y-AXIS LABEL: "Sales ($)" - Position vertically on the left side, centered, rotated 90 degrees counter-clockwise. Use 14-16pt font, medium weight, color #5D6D7E. Ensure proper spacing from chart area (15-20px).

VISUAL STYLING REQUIREMENTS:
- Professional business presentation style
- Conservative color palette (blues, grays, whites)
- Clean, readable typography
- Structured layout with clear sections
- Professional spacing and alignment

COLOR SPECIFICATIONS:
- Use professional business colors: deep blues (#2C3E50, #34495E), grays (#7F8C8D, #95A5A6), and whites
- Accent colors: teal (#16A085), navy (#2C3E50), and silver (#BDC3C7)
- High contrast for readability and accessibility
- Consistent color application across all elements

BACKGROUND SPECIFICATIONS:
- Pure white background (#FFFFFF)
- Clean, professional appearance
- Maximum contrast for text and data elements
- Suitable for print and digital use

TYPOGRAPHY SPECIFICATIONS:
- Use modern, professional sans-serif fonts (Arial, Helvetica, or similar)
- Title: 24-32pt, bold weight, dark color (#2C3E50)
- Axis labels: 14-16pt, medium weight, color (#5D6D7E)
- Data labels: 12-14pt, regular weight, high contrast color
- Ensure all text is perfectly readable and properly spaced

LAYOUT AND SPACING:
- Chart area should occupy 70-80% of the total image space
- Title area: 15-20% of total height at the top
- Chart area: 60-70% of total height in the center
- Consistent 20-30px margins on all sides
- Proper spacing between all elements (minimum 10px)

DATA POINT STYLING:
- Bars should have consistent width (60-80% of available space)
- Rounded corners on top of bars (4-6px radius)
- Consistent spacing between bars (20-30% of bar width)
- Data labels positioned above bars or inside bars
- Bars should extend from baseline to data value

FINAL QUALITY REQUIREMENTS:
- Ultra-high resolution output suitable for print and digital use
- Perfect alignment and spacing throughout
- Consistent color application across all elements
- Sharp, crisp text with perfect readability
- Professional business presentation quality
- No pixelation or blurriness
- Proper contrast ratios for accessibility
- Clean, modern aesthetic with attention to every detail
- Accurate data representation with precise positioning
- Consistent visual hierarchy throughout the chart
`;
```

### Advanced Configuration

```typescript
const result = await generateChart({
  chartType: 'dashboard',
  data: [
    { label: 'Revenue', value: 2500000 },
    { label: 'Expenses', value: 1800000 },
    { label: 'Profit', value: 700000 },
  ],
  title: 'Financial Dashboard',
  style: 'modern',
  colorScheme: 'professional',
  quality: 'high',
  size: 'presentation',
  aspectRatio: 'landscape',
  annotations: [
    {
      text: 'Record-breaking quarter',
      position: 'top',
      style: 'callout',
    },
  ],
  customInstructions: 'Include trend indicators and comparison to previous period',
  context: 'Q4 2024 financial review for board presentation',
});
```

### Batch Chart Generation

```typescript
import { generateChartVariations } from '@/executors/gpt-image-1-chart-generator';

const variations = await generateChartVariations(
  {
    chartType: 'line',
    data: salesData,
    title: 'Sales Trends',
  },
  [
    { style: 'modern', colorScheme: 'vibrant' },
    { style: 'classic', colorScheme: 'professional' },
    { style: 'minimal', colorScheme: 'monochrome' },
  ]
);
```

### Dashboard Generation

```typescript
import { generateDashboard } from '@/executors/gpt-image-1-chart-generator';

const dashboard = await generateDashboard(
  [
    {
      chartType: 'bar',
      data: revenueData,
      title: 'Monthly Revenue',
    },
    {
      chartType: 'pie',
      data: marketShareData,
      title: 'Market Share',
    },
    {
      chartType: 'line',
      data: trendData,
      title: 'Growth Trends',
    },
  ],
  {
    layout: 'grid',
    title: 'Executive Dashboard',
    theme: 'corporate',
  }
);
```

## Utility Functions

### Pre-built Chart Templates

```typescript
import { chartUtils } from '@/executors/gpt-image-1-chart-generator';

// Sales Performance Chart
const salesChart = chartUtils.createSalesChart(
  [
    { month: 'January', sales: 120000 },
    { month: 'February', sales: 150000 },
    { month: 'March', sales: 180000 },
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
  ],
  { style: 'scientific', colorScheme: 'professional' }
);

// KPI Dashboard
const kpiDashboard = chartUtils.createKPIDashboard(
  [
    { name: 'Revenue', value: 2500000, target: 2000000, unit: '$' },
    { name: 'Customers', value: 15000, target: 12000, unit: 'users' },
    { name: 'Satisfaction', value: 4.8, target: 4.5, unit: '/5' },
  ],
  { style: 'modern', colorScheme: 'professional' }
);
```

## API Endpoints

### Single Chart Generation

```bash
POST /api/dreamcut/chart-generator
Content-Type: application/json

{
  "chartType": "bar",
  "data": [
    { "label": "Q1", "value": 120000 },
    { "label": "Q2", "value": 150000 }
  ],
  "title": "Quarterly Sales",
  "style": "corporate",
  "colorScheme": "professional",
  "quality": "high"
}
```

### Batch Chart Generation

```bash
POST /api/dreamcut/chart-generator
Content-Type: application/json

{
  "charts": [
    {
      "chartType": "bar",
      "data": [{"label": "A", "value": 100}],
      "title": "Chart 1"
    },
    {
      "chartType": "pie",
      "data": [{"label": "B", "value": 200}],
      "title": "Chart 2"
    }
  ]
}
```

### Dashboard Generation

```bash
POST /api/dreamcut/chart-generator
Content-Type: application/json

{
  "charts": [
    {
      "chartType": "bar",
      "data": [{"label": "Revenue", "value": 1000000}],
      "title": "Revenue"
    }
  ],
  "layout": "grid",
  "title": "Executive Dashboard",
  "theme": "corporate"
}
```

### Get Model Information

```bash
GET /api/dreamcut/chart-generator?action=info
```

### Get Examples

```bash
GET /api/dreamcut/chart-generator?action=examples
```

## Configuration Options

### Chart Types
- **Basic**: `bar`, `line`, `pie`, `scatter`, `area`
- **Statistical**: `histogram`, `boxplot`, `violin`, `density`
- **Financial**: `candlestick`, `waterfall`
- **Scientific**: `heatmap`, `contour`, `surface`
- **Process**: `flowchart`, `gantt`, `sankey`, `funnel`
- **Hierarchical**: `treemap`, `mindmap`, `orgchart`
- **Layout**: `dashboard`, `infographic`, `timeline`

### Styles
- **modern**: Clean, contemporary design
- **classic**: Traditional, formal appearance
- **minimal**: Simple, uncluttered layout
- **corporate**: Business-focused, professional
- **creative**: Artistic, expressive design
- **scientific**: Technical, data-focused

### Color Schemes
- **professional**: Business-appropriate colors
- **vibrant**: Bright, energetic colors
- **monochrome**: Single-color variations
- **pastel**: Soft, muted colors
- **dark**: Dark theme colors
- **custom**: User-defined colors

### Quality Levels
- **low**: Fast generation, basic quality ($0.011-0.016)
- **medium**: Balanced speed and quality ($0.042-0.063)
- **high**: Best quality, slower generation ($0.167-0.25)
- **auto**: Model-determined optimal quality

### Output Formats
- **PNG**: High quality, supports transparency
- **JPEG**: Smaller file size, faster processing
- **WebP**: Modern format, good compression

## Best Practices

### ⚠️ CRITICAL: Detailed Prompts Required
**GPT Image 1 requires extremely detailed prompts for optimal results.** The system automatically generates comprehensive prompts that include:

- **Exact Typography**: Font sizes, weights, colors, and positioning
- **Precise Colors**: Specific hex codes for every element
- **Detailed Spacing**: Exact margins, padding, and alignment
- **Visual Styling**: Shadows, gradients, borders, and effects
- **Layout Specifications**: Positioning of every element
- **Quality Requirements**: Resolution, contrast, and accessibility

### Data Preparation
1. **Limit Data Points**: Keep under 100 points for readability
2. **Clear Labels**: Use descriptive, concise labels
3. **Consistent Format**: Ensure data follows the same structure
4. **Meaningful Values**: Use appropriate units and scales

### Chart Selection
1. **Bar Charts**: For categorical comparisons
2. **Line Charts**: For trends over time
3. **Pie Charts**: For proportional data (max 8 categories)
4. **Scatter Plots**: For correlation analysis
5. **Dashboards**: For multiple related metrics

### Styling Guidelines
1. **Corporate Style**: For business presentations
2. **Scientific Style**: For technical reports
3. **Modern Style**: For contemporary designs
4. **Professional Colors**: For formal contexts
5. **Vibrant Colors**: For engaging presentations

### Prompt Detail Requirements
1. **Specify Everything**: Colors, fonts, spacing, effects
2. **Use Custom Instructions**: Add specific requirements
3. **Provide Context**: Explain the intended use case
4. **Include Annotations**: Add callouts and highlights
5. **Quality Settings**: Use high quality for best results

### Performance Optimization
1. **Use High Quality**: For best results with detailed prompts
2. **Batch Requests**: For multiple charts
3. **Appropriate Sizes**: Match output requirements
4. **Cache Results**: Store generated charts
5. **Error Handling**: Implement retry logic

## Error Handling

### Common Errors
- **Invalid Data**: Ensure data format is correct
- **Too Many Points**: Reduce data points for readability
- **Unsupported Type**: Check chart type is supported
- **API Limits**: Respect rate limits and quotas
- **Timeout**: Increase timeout for complex charts

### Error Response Format
```json
{
  "success": false,
  "error": "Error description",
  "details": "Additional error information",
  "metadata": {
    "generatedAt": "2024-01-01T00:00:00Z",
    "processingTime": 0
  }
}
```

## Cost Management

### Cost Calculation
- **Text Tokens**: $5 per 1M tokens (input)
- **Image Tokens**: $10 per 1M tokens (input)
- **Output Tokens**: $40 per 1M tokens (generated)

### Estimated Costs by Quality
- **Low Quality**: $0.011-0.016 per image
- **Medium Quality**: $0.042-0.063 per image
- **High Quality**: $0.167-0.25 per image

### Cost Optimization Tips
1. Use medium quality for most charts
2. Batch multiple charts in one request
3. Optimize data size and complexity
4. Cache frequently used charts
5. Monitor usage and set limits

## Integration Examples

### React Component Integration

```tsx
import { useState } from 'react';
import { generateChart } from '@/executors/gpt-image-1-chart-generator';

function ChartGenerator() {
  const [chart, setChart] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateChart = async () => {
    setLoading(true);
    try {
      const result = await generateChart({
        chartType: 'bar',
        data: salesData,
        title: 'Sales Performance',
        style: 'corporate',
        quality: 'high',
      });
      setChart(result);
    } catch (error) {
      console.error('Chart generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={generateChart} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Chart'}
      </button>
      {chart && (
        <img 
          src={`data:image/png;base64,${chart.base64Data}`} 
          alt={chart.metadata.title}
        />
      )}
    </div>
  );
}
```

### Node.js Integration

```javascript
const { generateChart } = require('./executors/gpt-image-1-chart-generator');

async function createReport() {
  const chart = await generateChart({
    chartType: 'dashboard',
    data: reportData,
    title: 'Monthly Report',
    style: 'corporate',
    quality: 'high',
  });

  // Save chart to file
  const fs = require('fs');
  const buffer = Buffer.from(chart.base64Data, 'base64');
  fs.writeFileSync('report-chart.png', buffer);
}
```

## Testing

### Test Page
Visit `/test-chart-generator` to access the interactive demo component.

### Test Data
The system includes sample datasets for:
- Sales performance data
- Market share distribution
- Trend analysis data
- KPI metrics

### Validation
- Input validation for all parameters
- Data format verification
- Chart type compatibility checks
- Quality and size validation

## Troubleshooting

### Common Issues

1. **Chart Not Generating**
   - Check API key configuration
   - Verify data format
   - Ensure chart type is supported

2. **Poor Quality Output**
   - Increase quality setting
   - Simplify data complexity
   - Use appropriate chart type

3. **Slow Generation**
   - Reduce data points
   - Use lower quality setting
   - Check network connectivity

4. **High Costs**
   - Use medium quality
   - Batch requests
   - Optimize data size

### Support
- Check API documentation
- Review error messages
- Test with sample data
- Contact support for complex issues

## Future Enhancements

- **Real-time Collaboration**: Multi-user chart editing
- **Template Library**: Pre-built chart templates
- **Data Integration**: Direct database connections
- **Advanced Analytics**: Statistical analysis integration
- **Export Options**: PDF, SVG, and other formats
- **Custom Themes**: User-defined styling options
