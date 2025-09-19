# GPT Image 1 Text Designer

## Overview

The GPT Image 1 Text Designer is a specialized executor for generating text-heavy designs using OpenAI's GPT Image 1 model. This system excels at creating professional marketing materials, business documents, and other designs that require excellent text rendering and typography.

## Key Features

- **Text-Heavy Design Generation**: Specialized for brochures, flyers, posters, business cards, and marketing materials
- **Extremely Detailed Prompts**: Automatically generates comprehensive prompts with every visual detail specified
- **Professional Typography**: Advanced text rendering with precise font specifications, sizing, and spacing
- **Flexible Layouts**: Support for various layout types including single-column, multi-column, grid, and asymmetric designs
- **Custom Color Schemes**: Professional, vibrant, monochrome, pastel, dark, and custom color options
- **High-Quality Output**: PNG, JPEG, and WebP formats with transparent background support
- **Cost Optimization**: Built-in cost calculation and quality level management
- **Batch Processing**: Generate multiple designs in a single request

## Model Information

- **Model**: `gpt-image-1`
- **Provider**: OpenAI (Official API)
- **API**: Direct OpenAI SDK integration (not Fal.ai or Replicate)
- **Specialization**: Text-heavy designs, typography, marketing materials
- **Pricing**: $5-40 per 1M tokens (varies by quality and size)
- **Processing Time**: 30 seconds to 2 minutes (complex designs)
- **API Key**: Requires `OPENAI_API_KEY` environment variable

## ⚠️ CRITICAL LIMITATION: Face Character Consistency

**GPT Image 1 has extremely poor face character consistency.** This is a fundamental limitation of the model that cannot be overcome with better prompts or techniques.

### What This Means:
- **NEVER use GPT Image 1 on images containing faces or characters**
- **Faces will be distorted, changed, or completely replaced**
- **Character consistency is not maintained across edits**
- **This applies to ALL operations: generation, editing, and modification**

### Safe Use Cases:
- ✅ **Text-only designs** (brochures, flyers, posters without faces)
- ✅ **Landscape and object images** (buildings, products, nature)
- ✅ **Abstract designs** (patterns, geometric shapes, logos)
- ✅ **UI elements** (buttons, forms, layouts without avatars)
- ✅ **Charts and graphs** (data visualizations, infographics)

### Avoid These Use Cases:
- ❌ **Portraits or headshots** (any image with human faces)
- ❌ **Character designs** (cartoons, illustrations with people)
- ❌ **Team photos** (group pictures, staff photos)
- ❌ **Avatar generation** (profile pictures, user images)
- ❌ **People in marketing materials** (models, testimonials with faces)

### Automatic Protection:
The system automatically detects and blocks requests that might contain face-related content, providing clear error messages to prevent accidental usage.

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

## Supported Design Types

### Basic Designs
- **Brochure**: Multi-panel business brochures with clear sections and professional styling
- **Flyer**: Single-page promotional flyers with eye-catching design and strong visual impact
- **Poster**: Large-format posters with bold typography and clear messaging
- **Business Card**: Professional business cards with clean layout and contact information
- **Banner**: Web or print banners with clear messaging and professional appearance
- **Newsletter**: Newsletter layouts with multiple sections and professional business styling
- **Menu**: Restaurant menus with clear sections and appetizing visual presentation
- **Invitation**: Elegant invitations with formal styling and clear event details
- **Certificate**: Formal certificates with official styling and professional appearance
- **Label**: Product labels with clear branding and readable text

## Supported Styles

### Design Styles
- **Modern**: Clean, minimalist design with contemporary typography and modern color palettes
- **Classic**: Traditional, timeless design with serif typography and formal layouts
- **Minimalist**: Extremely clean design with minimal elements and focus on typography
- **Corporate**: Professional business styling with formal typography and conservative layouts
- **Creative**: Innovative, artistic design with unique elements and bold colors
- **Elegant**: Sophisticated, refined design with premium feel and luxurious materials
- **Bold**: Strong, impactful design with bold typography and high contrast colors
- **Vintage**: Retro-inspired design with classic typography and nostalgic appeal

## Supported Color Schemes

### Color Options
- **Professional**: Dark blue-gray primary with medium gray secondary and blue accent
- **Vibrant**: Red primary with orange secondary and purple accent
- **Monochrome**: Dark gray primary with medium gray secondary and light gray accent
- **Pastel**: Light blue primary with light orange secondary and light purple accent
- **Dark**: White primary with light gray secondary and blue accent on dark background
- **Custom**: User-defined color palette with primary, secondary, accent, background, and text colors

## Supported Layouts

### Layout Types
- **Single Column**: Centered content with proper margins and clear vertical flow
- **Two Column**: Balanced content distribution with proper column spacing
- **Three Column**: Equal column widths with proper spacing and content organization
- **Grid**: Consistent spacing with proper alignment and organized content blocks
- **Asymmetric**: Dynamic positioning with balanced visual weight and creative placement
- **Centered**: Balanced content with proper spacing and focused attention on key elements

## API Usage

### Basic Usage

```typescript
import { generateTextDesign } from './executors/gpt-image-1-text-designer';

const result = await generateTextDesign({
  designType: 'brochure',
  title: 'Company Services',
  subtitle: 'Professional Solutions for Your Business',
  content: [
    'Service 1: Consultation',
    'Service 2: Implementation', 
    'Service 3: Support'
  ],
  companyName: 'Your Company Name',
  contactInfo: {
    phone: '+1-555-0123',
    email: 'info@company.com',
    website: 'www.company.com',
    address: '123 Business St, City, State 12345'
  },
  style: 'corporate',
  colorScheme: 'professional',
  layout: 'two-column',
  orientation: 'portrait',
  size: '1024x1536',
  quality: 'high'
});

if (result.success) {
  console.log('Design generated successfully');
  console.log('Cost:', result.design.metadata.cost);
  console.log('Processing time:', result.design.metadata.processingTime);
} else {
  console.error('Generation failed:', result.error);
}
```

### API Endpoint

```bash
POST /api/dreamcut/text-designer
Content-Type: application/json

{
  "designType": "brochure",
  "title": "Company Services",
  "subtitle": "Professional Solutions for Your Business",
  "content": ["Service 1", "Service 2", "Service 3"],
  "companyName": "Your Company Name",
  "style": "corporate",
  "colorScheme": "professional",
  "layout": "two-column",
  "orientation": "portrait",
  "size": "1024x1536",
  "quality": "high"
}
```

### Batch Processing

```typescript
const batchResult = await generateTextDesign({
  designs: [
    {
      designType: 'brochure',
      title: 'Company Services',
      content: ['Service 1', 'Service 2'],
      style: 'corporate',
      colorScheme: 'professional'
    },
    {
      designType: 'flyer',
      title: 'Special Event',
      content: ['Event details', 'Date and time'],
      style: 'creative',
      colorScheme: 'vibrant'
    }
  ]
});
```

## CRITICAL: Detailed Prompts Required

GPT Image 1 for text designs works extremely well **only if the prompt is extremely well-detailed**. Every visual detail must be present in the prompt, including:

### Typography Details
- **Font Specifications**: Exact font names, sizes, weights, and styles
- **Text Positioning**: Precise coordinates, alignment, and spacing
- **Color Codes**: Exact hex color values for all text elements
- **Line Spacing**: Specific line height and paragraph spacing
- **Text Effects**: Shadows, outlines, gradients, and other visual effects

### Layout Details
- **Margins and Padding**: Exact pixel values for all spacing
- **Column Specifications**: Width, spacing, and alignment details
- **Grid Systems**: Precise grid specifications and content positioning
- **Visual Hierarchy**: Clear specification of heading levels and importance

### Color Details
- **Background Colors**: Exact hex codes and gradient specifications
- **Text Colors**: Specific color values for all text elements
- **Accent Colors**: Precise specifications for highlights and emphasis
- **Contrast Ratios**: Accessibility-compliant color combinations

### Visual Elements
- **Logo Placement**: Exact positioning and sizing specifications
- **Image Integration**: Precise placement and styling of visual elements
- **Border and Frame Details**: Exact specifications for decorative elements
- **Shadow and Depth**: Specific shadow parameters and layering

### Quality Requirements
- **Resolution Specifications**: Exact output resolution requirements
- **File Format Details**: Specific format and compression settings
- **Print Specifications**: CMYK color profiles and print-ready settings
- **Accessibility Standards**: WCAG compliance and readability requirements

## Example Detailed Prompt

The system automatically generates prompts like this:

```
Create a highly detailed, professional brochure design with the following EXACT specifications:

DESIGN TYPE: BROCHURE
- Create a multi-panel brochure layout with clear sections, professional business styling, and excellent readability. Include proper margins, columns, and visual hierarchy.

TITLE: "Company Services"
- Use large, bold, professional typography (24-32pt font size), positioned prominently at the top with proper spacing (20-30px margin from top edge). Use a modern sans-serif font like Arial, Helvetica, or similar. Title should be in dark color (#2C3E50 or #34495E) for maximum readability. Ensure perfect alignment and spacing.

SUBTITLE: "Professional Solutions for Your Business"
- Place directly below the title with 10-15px spacing. Use medium weight font (16-20pt), slightly lighter color (#7F8C8D or #95A5A6), same font family as title. Ensure proper alignment and readability.

CONTENT TO INCLUDE:
1. "Service 1: Consultation"
2. "Service 2: Implementation"
3. "Service 3: Support"
- Use clear, readable typography (12-14pt font size), proper line spacing (1.4-1.6), and consistent formatting. Ensure excellent readability with proper contrast and spacing between elements. Use bullet points or numbered lists where appropriate.

LAYOUT SPECIFICATIONS:
- Layout: two-column
- Orientation: portrait
- Two column layout with balanced content distribution, proper column spacing (20-30px), and clear visual separation
- Ensure proper margins and padding throughout
- Maintain consistent spacing between elements
- Create clear visual hierarchy and information flow

COLOR SPECIFICATIONS:
- Primary: #2C3E50 (Dark Blue-Gray)
- Secondary: #7F8C8D (Medium Gray)
- Accent: #3498DB (Blue)
- Background: #FFFFFF (White)
- Text: #2C3E50 (Dark Blue-Gray)
- Ensure proper contrast ratios for accessibility
- Use consistent color application throughout
- Maintain visual harmony and professional appearance

FINAL QUALITY REQUIREMENTS:
- Ultra-high resolution output suitable for print and digital use
- Perfect text rendering with crisp, readable typography
- Professional layout with proper spacing and alignment
- Consistent color application throughout
- Sharp, clear text with perfect contrast
- No pixelation or blurriness in text or graphics
- Proper visual hierarchy with clear information flow
- Professional business presentation quality
- Clean, modern aesthetic with attention to every detail
- Accurate text positioning and spacing
- Consistent visual branding throughout
```

## Best Practices

### Design Configuration
1. **Choose Appropriate Design Type**: Select the design type that best matches your use case
2. **Use Descriptive Content**: Provide clear, concise content that conveys your message effectively
3. **Select Suitable Style**: Choose a style that aligns with your brand and target audience
4. **Optimize Color Scheme**: Use colors that enhance readability and brand recognition
5. **Consider Layout**: Choose layouts that organize information logically and attractively

### Content Guidelines
1. **Clear Titles**: Use descriptive, attention-grabbing titles
2. **Concise Content**: Keep content brief and focused on key messages
3. **Professional Language**: Use appropriate tone and terminology for your audience
4. **Call to Action**: Include clear, compelling calls to action when appropriate
5. **Contact Information**: Provide complete, accurate contact details

### Quality Optimization
1. **Use High Quality**: Select 'high' quality for professional presentations
2. **Appropriate Sizing**: Choose sizes that match your intended use
3. **Test Different Styles**: Experiment with various styles to find the best fit
4. **Batch Processing**: Use batch processing for multiple related designs
5. **Cost Management**: Monitor costs and use appropriate quality levels

## Error Handling

### Common Errors
- **Invalid Input**: Ensure all required fields are provided and valid
- **API Key Issues**: Verify your OpenAI API key is correct and has sufficient credits
- **Rate Limiting**: Respect OpenAI's rate limits and implement appropriate delays
- **Model Access**: Ensure you have access to the GPT Image 1 model
- **Network Issues**: Implement retry logic for network-related failures

### Error Response Format
```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "details": "Additional error details if available"
}
```

## Cost Management

### Cost Factors
- **Quality Level**: Higher quality levels cost more
- **Image Size**: Larger images require more tokens
- **Prompt Complexity**: More detailed prompts increase token usage
- **Batch Processing**: Multiple designs in one request can be more cost-effective

### Cost Optimization
1. **Use Appropriate Quality**: Don't use 'high' quality unless necessary
2. **Optimize Prompts**: Include only necessary details in custom instructions
3. **Batch Requests**: Process multiple designs together when possible
4. **Monitor Usage**: Track costs and adjust quality levels as needed
5. **Cache Results**: Store and reuse designs when appropriate

## Examples

### Business Brochure
```typescript
const brochure = await generateTextDesign({
  designType: 'brochure',
  title: 'Professional Services',
  subtitle: 'Excellence in Every Project',
  content: [
    'Consulting Services',
    'Project Management',
    'Technical Support',
    'Training Programs'
  ],
  companyName: 'TechSolutions Inc.',
  contactInfo: {
    phone: '+1-555-0123',
    email: 'info@techsolutions.com',
    website: 'www.techsolutions.com'
  },
  style: 'corporate',
  colorScheme: 'professional',
  layout: 'two-column',
  orientation: 'portrait',
  quality: 'high'
});
```

### Event Flyer
```typescript
const flyer = await generateTextDesign({
  designType: 'flyer',
  title: 'Annual Conference 2024',
  subtitle: 'Innovation in Technology',
  content: [
    'Date: March 15-17, 2024',
    'Location: Convention Center',
    'Speakers: Industry Leaders',
    'Registration: Early Bird Special'
  ],
  callToAction: 'Register Now!',
  style: 'creative',
  colorScheme: 'vibrant',
  layout: 'centered',
  orientation: 'portrait',
  quality: 'high'
});
```

### Business Card
```typescript
const businessCard = await generateTextDesign({
  designType: 'business-card',
  title: 'John Smith',
  content: [
    'CEO & Founder',
    'Innovation Solutions'
  ],
  contactInfo: {
    phone: '+1-555-0123',
    email: 'john@innovationsolutions.com',
    website: 'www.innovationsolutions.com'
  },
  style: 'elegant',
  colorScheme: 'professional',
  layout: 'centered',
  orientation: 'landscape',
  size: '1024x1024',
  quality: 'high'
});
```

## Integration

### React Component
```tsx
import { TextDesignerDemo } from '@/components/text-designer/TextDesignerDemo';

export default function TextDesignPage() {
  return <TextDesignerDemo />;
}
```

### Next.js Page
```tsx
// app/test-text-designer/page.tsx
import TextDesignerDemo from '@/components/text-designer/TextDesignerDemo';

export default function TestTextDesignerPage() {
  return <TextDesignerDemo />;
}
```

## Troubleshooting

### Common Issues
1. **Generation Fails**: Check API key, model access, and input validation
2. **Poor Quality**: Ensure detailed prompts and appropriate quality settings
3. **High Costs**: Optimize quality levels and prompt complexity
4. **Slow Processing**: Use appropriate quality levels and monitor rate limits
5. **Inconsistent Results**: Provide more detailed specifications and context

### Debug Mode
Enable debug logging to troubleshoot issues:

```typescript
const result = await generateTextDesign(input, {
  timeout: 120000,
  retries: 2,
  fallbackQuality: 'medium'
});
```

## Support

For issues, questions, or feature requests:
1. Check the documentation and examples
2. Review error messages and logs
3. Test with simpler inputs first
4. Contact support with detailed error information

## License

This implementation is part of the DreamCuts project and follows the same licensing terms.
