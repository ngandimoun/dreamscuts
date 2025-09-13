# Bytedance Video Stylize - Usage Guide

## Overview
The Bytedance Video Stylize model is a powerful AI tool that transforms static images into dynamic, stylized videos. It applies various artistic transformations while maintaining the core elements of the original image, creating engaging animated content with professional-quality stylization effects.

## Model Information
- **Model ID**: `fal-ai/bytedance/video-stylize`
- **Provider**: Bytedance (via fal.ai)
- **Version**: v1.0
- **Cost**: $0.23 per video (fixed price)
- **Output Format**: MP4 video
- **Quality**: Professional stylization with artistic effects

## Key Features
- **Style Transformation**: Apply various artistic styles to your images
- **Image-to-Video**: Seamlessly convert static images to animated videos
- **Multiple Styles**: Support for manga, anime, cartoon, oil painting, and more
- **Professional Quality**: High-quality stylization with consistent results
- **Easy Integration**: Simple API with clear input requirements
- **Cost-Effective**: Fixed price regardless of style complexity

## Basic Usage

### 1. Import and Initialize
```typescript
import { createBytedanceVideoStylizeExecutor } from './executors/bytedance-video-stylize';

const executor = createBytedanceVideoStylizeExecutor('your-fal-ai-api-key');
```

### 2. Simple Video Stylization
```typescript
const result = await executor.generateStylizedVideo({
  style: "Manga style",
  image_url: "https://example.com/your-image.jpg"
});

console.log('Generated stylized video URL:', result.video.url);
```

### 3. Different Style Examples
```typescript
// Anime style
const animeResult = await executor.generateStylizedVideo({
  style: "Anime style",
  image_url: "https://example.com/character-portrait.jpg"
});

// Oil painting style
const oilPaintingResult = await executor.generateStylizedVideo({
  style: "Oil painting style",
  image_url: "https://example.com/landscape.jpg"
});

// Cartoon style
const cartoonResult = await executor.generateStylizedVideo({
  style: "Cartoon style",
  image_url: "https://example.com/portrait.jpg"
});
```

## Advanced Features

### Style Customization
The model supports various artistic styles. Here are some popular options:

```typescript
// Character-focused styles
const characterStyles = [
  "Manga style",
  "Anime style", 
  "Cartoon style"
];

// Artistic transformation styles
const artisticStyles = [
  "Oil painting style",
  "Watercolor style",
  "Modern art style"
];

// Graphic and comic styles
const graphicStyles = [
  "Comic book style",
  "Sketch style",
  "Pop art style"
];

// Nostalgic styles
const nostalgicStyles = [
  "Vintage style",
  "Retro style",
  "Classic style"
];
```

### Helper Methods for Style Selection
```typescript
// Get all recommended styles
const allStyles = executor.getRecommendedStyles();
console.log('Available styles:', allStyles);

// Get style suggestions for specific use cases
const styleSuggestions = executor.getStyleSuggestions();
styleSuggestions.forEach(suggestion => {
  console.log(`${suggestion.useCase}: ${suggestion.styles.join(', ')}`);
});

// Check if a specific style is supported
const isSupported = executor.isStyleSupported("Cyberpunk style");
console.log('Cyberpunk style supported:', isSupported);
```

### Style Recommendations by Image Type
```typescript
// For portraits
const portraitStyles = ["Manga style", "Anime style", "Oil painting style"];

// For landscapes
const landscapeStyles = ["Watercolor style", "Oil painting style", "Modern art style"];

// For characters
const characterStyles = ["Cartoon style", "Comic book style", "Anime style"];

// For abstract content
const abstractStyles = ["Modern art style", "Pop art style", "Sketch style"];
```

## Queue-Based Processing

For handling multiple requests or long-running generations:

### 1. Submit to Queue
```typescript
const { requestId } = await executor.queueStylizedVideoGeneration({
  style: "Watercolor style",
  image_url: "https://example.com/nature-scene.jpg"
}, 'https://your-webhook-url.com/callback');
```

### 2. Check Status
```typescript
const status = await executor.checkQueueStatus(requestId);
console.log('Processing status:', status.status);
console.log('Progress logs:', status.logs);
```

### 3. Get Results
```typescript
const result = await executor.getQueueResult(requestId);
console.log('Generated stylized video URL:', result.video.url);
```

## Input Parameters

### Required Parameters
- **`style`** (string): The artistic style to apply. Should be a short description (max 100 characters).
- **`image_url`** (string): URL of the source image to transform into a stylized video.

### Style Examples
```typescript
// Popular style options
const popularStyles = [
  "Manga style",           // Japanese comic book aesthetic
  "Anime style",           // Japanese animation style
  "Cartoon style",         // Western cartoon aesthetic
  "Oil painting style",    // Classical oil painting texture
  "Watercolor style",      // Soft watercolor effect
  "Sketch style",          // Hand-drawn sketch effect
  "Comic book style",      // Traditional comic book look
  "Pop art style",         // 1960s pop art aesthetic
  "Vintage style",         // Nostalgic vintage effect
  "Modern art style"       // Contemporary artistic style
];
```

## Output Format

The model returns an object with the following structure:

```typescript
interface BytedanceVideoStylizeOutput {
  video: {
    url: string;           // URL of the generated stylized video
    content_type?: string; // MIME type of the video
    file_name?: string;    // Name of the video file
    file_size?: number;    // Size of the video file in bytes
  };
  requestId?: string;      // Request ID for queue-based processing
}
```

## Cost Calculation

The cost is fixed per video regardless of style complexity:

```typescript
const cost = executor.calculateCost(); // Always returns $0.23
console.log(`Cost: $${cost}`);
```

**Cost Examples:**
- 1 video: $0.23
- 10 videos: $2.30
- 100 videos: $23.00

## Model Capabilities

### Supported Input Types
- **Image Formats**: JPG, PNG, WebP, and other standard formats
- **Style Descriptions**: Short, descriptive style names
- **Image Quality**: High-quality images recommended for best results

### Output Quality
- **Format**: MP4 video with standard compression
- **Resolution**: Standard video resolution
- **Frame Rate**: Standard frame rate
- **Duration**: Variable based on input image complexity

### Processing Features
- Real-time progress updates
- Multiple artistic style support
- Professional-quality stylization
- Image integrity preservation
- Consistent output quality

## Best Practices

### 1. Image Quality
- Use high-resolution, clear source images
- Ensure good lighting and contrast
- Avoid heavily compressed or low-quality images
- Choose images with clear subjects

### 2. Style Selection
- Use descriptive style names (e.g., "Manga style" not just "Manga")
- Keep style descriptions under 100 characters
- Test different styles with the same image for variety
- Consider the image content when choosing styles

### 3. Style-Specific Tips
```typescript
// For character portraits
const characterPortrait = await executor.generateStylizedVideo({
  style: "Manga style",
  image_url: "https://example.com/portrait.jpg"
});

// For landscapes and nature scenes
const landscapeScene = await executor.generateStylizedVideo({
  style: "Watercolor style",
  image_url: "https://example.com/landscape.jpg"
});

// For modern content
const modernContent = await executor.generateStylizedVideo({
  style: "Pop art style",
  image_url: "https://example.com/modern-image.jpg"
});
```

### 4. Error Handling
```typescript
try {
  const result = await executor.generateStylizedVideo({
    style: "Oil painting style",
    image_url: "https://example.com/artwork.jpg"
  });
  // Process successful result
} catch (error) {
  console.error('Video stylization failed:', error.message);
  // Handle error appropriately
}
```

## Use Cases

### Character Animation
- Transform character portraits into animated content
- Create manga and anime-style character videos
- Develop cartoon-style character animations

### Artistic Content Creation
- Convert artwork into animated videos
- Apply artistic styles to photographs
- Create unique artistic content for portfolios

### Social Media Content
- Generate engaging stylized videos for platforms
- Create unique content that stands out
- Transform static images into shareable videos

### Marketing and Advertising
- Create stylized brand content
- Transform product images into animated videos
- Develop creative marketing materials

### Educational Content
- Make educational images more engaging
- Create stylized explainer videos
- Transform diagrams into animated content

## File Upload Support

Upload local images using fal.ai's storage API:

```typescript
import { fal } from "@fal-ai/client";

// Upload a local image file
const file = new File([imageData], "image.jpg", { type: "image/jpeg" });
const url = await fal.storage.upload(file);

// Use the uploaded image for video stylization
const result = await executor.generateStylizedVideo({
  style: "Sketch style",
  image_url: url
});
```

## Limitations and Considerations

### Current Limitations
- Style description must be under 100 characters
- MP4 output format only
- Processing time varies with complexity
- Some styles may work better with certain image types

### Quality Factors
- Output quality depends on input image quality
- Complex images may require longer processing
- Style selection affects final output appearance
- Image content influences style effectiveness

## Troubleshooting

### Common Issues

1. **Invalid Image URL**
   - Ensure the image URL is accessible
   - Check that the image format is supported
   - Verify the image file exists and is not corrupted

2. **Style Description Too Long**
   - Keep style descriptions under 100 characters
   - Use concise, descriptive language
   - Avoid overly complex style descriptions

3. **Processing Failures**
   - Check image quality and format
   - Ensure fal.ai API key is valid
   - Verify network connectivity

4. **Style Not Working Well**
   - Try different styles with the same image
   - Consider the image content when choosing styles
   - Use recommended style-image combinations

### Getting Help
- Check fal.ai documentation for API-related issues
- Verify your fal.ai account has access to this model
- Ensure you have sufficient credits for processing
- Test with simpler styles first

## Example Workflows

### Basic Character Stylization
```typescript
import { createBytedanceVideoStylizeExecutor } from './executors/bytedance-video-stylize';

async function createCharacterVideo() {
  try {
    const executor = createBytedanceVideoStylizeExecutor('your-api-key');
    
    const result = await executor.generateStylizedVideo({
      style: "Manga style",
      image_url: "https://example.com/character-portrait.jpg"
    });
    
    console.log('Character video created successfully!');
    console.log('Output URL:', result.video.url);
    
    return result;
  } catch (error) {
    console.error('Character video creation failed:', error.message);
    throw error;
  }
}
```

### Multiple Style Testing
```typescript
async function testMultipleStyles() {
  try {
    const executor = createBytedanceVideoStylizeExecutor('your-api-key');
    
    const styles = ["Manga style", "Anime style", "Cartoon style"];
    const imageUrl = "https://example.com/test-image.jpg";
    
    const results = await Promise.all(
      styles.map(style => 
        executor.generateStylizedVideo({
          style,
          image_url: imageUrl
        })
      )
    );
    
    console.log('Multiple styles tested successfully!');
    results.forEach((result, index) => {
      console.log(`${styles[index]}: ${result.video.url}`);
    });
    
    return results;
  } catch (error) {
    console.error('Multiple style testing failed:', error.message);
    throw error;
  }
}
```

### Batch Processing with Style Variety
```typescript
async function createStyleVariety() {
  try {
    const executor = createBytedanceVideoStylizeExecutor('your-api-key');
    
    const inputs = [
      {
        style: "Oil painting style",
        image_url: "https://example.com/landscape.jpg"
      },
      {
        style: "Pop art style",
        image_url: "https://example.com/portrait.jpg"
      },
      {
        style: "Watercolor style",
        image_url: "https://example.com/nature.jpg"
      }
    ];
    
    const results = await executor.generateMultipleStylizedVideos(inputs);
    
    console.log('Style variety batch completed!');
    results.forEach((result, index) => {
      if ('video' in result) {
        console.log(`Style ${index + 1}: ${result.video.url}`);
      } else {
        console.log(`Style ${index + 1} failed:`, result.message);
      }
    });
    
    return results;
  } catch (error) {
    console.error('Style variety batch failed:', error.message);
    throw error;
  }
}
```

### Creative Portfolio Building
```typescript
async function buildCreativePortfolio() {
  try {
    const executor = createBytedanceVideoStylizeExecutor('your-api-key');
    
    const portfolioItems = [
      {
        style: "Manga style",
        image_url: "https://example.com/character1.jpg",
        description: "Character in manga style"
      },
      {
        style: "Oil painting style",
        image_url: "https://example.com/landscape1.jpg",
        description: "Landscape in oil painting style"
      },
      {
        style: "Pop art style",
        image_url: "https://example.com/portrait1.jpg",
        description: "Portrait in pop art style"
      }
    ];
    
    const portfolioVideos = await Promise.all(
      portfolioItems.map(item => 
        executor.generateStylizedVideo({
          style: item.style,
          image_url: item.image_url
        })
      )
    );
    
    console.log('Creative portfolio built successfully!');
    portfolioVideos.forEach((video, index) => {
      console.log(`${portfolioItems[index].description}: ${video.video.url}`);
    });
    
    return portfolioVideos;
  } catch (error) {
    console.error('Portfolio building failed:', error.message);
    throw error;
  }
}
```

This comprehensive guide should help you effectively use the Bytedance Video Stylize model for creating unique, artistic video content from static images. The model excels at transforming ordinary images into engaging, stylized videos that can enhance your creative projects, social media content, and marketing materials.
