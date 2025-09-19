# Nano Banana Quick Start Guide

## 🚀 Get Started with Google's Nano Banana in 5 Minutes

This guide will get you up and running with the `fal-ai/gemini-25-flash-image` model (Nano Banana) for your DreamCuts application.

## 📋 Prerequisites

1. **API Key**: Get your fal.ai API key from [fal.ai](https://fal.ai)
2. **Node.js**: Version 18+ recommended
3. **TypeScript**: For type safety (optional but recommended)

## ⚡ Quick Setup

### 1. Install Dependencies

```bash
npm install @fal-ai/serverless-client
# or
yarn add @fal-ai/serverless-client
```

### 2. Basic Implementation

```typescript
import { fal } from '@fal-ai/serverless-client';

// Configure your API key
fal.config({
  credentials: 'your-fal-ai-api-key-here'
});

// Generate your first image
async function generateImage() {
  const result = await fal.subscribe('fal-ai/gemini-25-flash-image', {
    input: {
      prompt: "A professional product photo of a luxury watch floating in mid-air with dramatic lighting and dust particles",
      quality: "premium",
      style: "photographic"
    }
  });
  
  console.log('Generated image:', result.data.images[0].url);
  return result.data.images[0].url;
}
```

## 🎯 Top 5 Use Cases to Try First

### 1. Product Photography (Perfect Label Reproduction)

```typescript
const productPhoto = await fal.subscribe('fal-ai/gemini-25-flash-image', {
  input: {
    prompt: "Create a flat lay product photography image of this product placed naturally among complementary items on a wooden table. Studio lighting with soft shadows. Keep the product label exactly as shown in the reference image. Professional commercial photography style, 4K quality.",
    images: [productImageBase64, backgroundImageBase64],
    quality: "premium"
  }
});
```

**Why this works**: Nano Banana excels at preserving product labels and text, making it perfect for e-commerce.

### 1.5. Image Editing (NEW!)

```typescript
const editedImage = await fal.subscribe('fal-ai/gemini-25-flash-image/edit', {
  input: {
    prompt: "make this product photo more dramatic with better lighting and shadows",
    image_urls: ["https://example.com/product-image.jpg"],
    num_images: 1,
    output_format: "jpeg"
  }
});
```

**Why this works**: The edit endpoint allows you to modify existing images while maintaining quality and consistency.

### 2. Character Consistency Across Scenes

```typescript
const characterScene = await fal.subscribe('fal-ai/gemini-25-flash-image', {
  input: {
    prompt: "Create a wide angle shot of this character walking confidently in a modern office environment. Keep the character's appearance exactly as shown in the reference image. Cinematic lighting, professional photography style.",
    images: [characterImageBase64],
    quality: "premium"
  }
});
```

**Why this works**: Maintains character consistency better than any other AI model.

### 3. Hand-Holding Products (AI's Biggest Challenge)

```typescript
const handHolding = await fal.subscribe('fal-ai/gemini-25-flash-image', {
  input: {
    prompt: "Create an image of a hand emerging from the ground holding this product in a rainforest environment. The hand should be covered in dirt and grass. Keep the product label exactly as shown. Natural outdoor lighting with shadows. Ultra-realistic photography style.",
    images: [productImageBase64],
    quality: "premium"
  }
});
```

**Why this works**: Nano Banana solves the notoriously difficult hand-holding problem that other AI models struggle with.

### 4. Background Replacement with Proper Lighting

```typescript
const backgroundReplacement = await fal.subscribe('fal-ai/gemini-25-flash-image', {
  input: {
    prompt: "Create a scene of this character in a cinematic sci-fi film by changing the background to temple ruins in a lush jungle. Keep the character's pose and location exactly the same. Adjust the lighting and shadows to match the jungle environment. Add subtle shadows cast onto the character from the surrounding jungle.",
    images: [characterImageBase64],
    quality: "premium"
  }
});
```

**Why this works**: Properly adjusts lighting to match new environments, not just pastes backgrounds.

### 5. Photo Restoration & Enhancement

```typescript
const photoRestoration = await fal.subscribe('fal-ai/gemini-25-flash-image', {
  input: {
    prompt: "Restore and enhance this old photograph. Remove the polaroid border and wood frame. Fill in any missing areas naturally. Convert to high quality, full-color image while maintaining the original character and composition.",
    images: [oldPhotoBase64],
    quality: "premium"
  }
});
```

**Why this works**: Excellent at understanding and reconstructing missing image areas.

## 🛠️ Integration with Your DreamCuts App

### Add to Your Existing Image Analyzer

```typescript
// In your existing analyzer component
import { useNanoBananaGeneration } from './examples/nano-banana-implementation-guide';

export function EnhancedImageAnalyzer() {
  const { 
    generateImage, 
    editImage,
    editProductPhoto,
    replaceBackground,
    adjustLighting,
    isGenerating, 
    isEditing,
    lastResult,
    lastEditResult 
  } = useNanoBananaGeneration('your-api-key');
  
  const enhanceAnalyzedImage = async (originalImage: string, analysis: any) => {
    const prompt = `Enhance this image based on the analysis: ${analysis.summary}. 
    Create a professional version while maintaining the original composition and key elements.`;
    
    return await generateImage(prompt, [originalImage], {
      quality: 'premium',
      style: 'photographic'
    });
  };

  const editAnalyzedImage = async (imageUrl: string, editType: string) => {
    switch (editType) {
      case 'enhance':
        return await editProductPhoto(imageUrl, ['improve lighting', 'add shadows', 'enhance details']);
      case 'background':
        return await replaceBackground(imageUrl, 'professional studio background');
      case 'lighting':
        return await adjustLighting(imageUrl, 'dramatic', 'strong');
      default:
        return await editImage('enhance this image professionally', [imageUrl]);
    }
  };
  
  return (
    <div>
      {/* Your existing analyzer UI */}
      <button onClick={() => enhanceAnalyzedImage(image, analysis)}>
        Enhance with Nano Banana
      </button>
      
      <button onClick={() => editAnalyzedImage(imageUrl, 'enhance')}>
        Edit Image
      </button>
      
      {lastResult?.success && (
        <img src={lastResult.imageUrl} alt="Enhanced" />
      )}

      {lastEditResult?.success && lastEditResult.images?.[0] && (
        <img src={lastEditResult.images[0].url} alt="Edited" />
      )}
    </div>
  );
}
```

### Add to Your Video Generation Pipeline

```typescript
// Create consistent character frames for video transitions
const createVideoFrames = async (characterImage: string) => {
  const angles = ['front-facing', 'side profile', 'behind view'];
  const frames = [];
  
  for (const angle of angles) {
    const result = await generateImage(
      `Create a ${angle} shot of this character in the same environment. Keep the character's appearance exactly as shown.`,
      [characterImage],
      { quality: 'premium', style: 'cinematic' }
    );
    frames.push(result);
  }
  
  return frames; // Use these for AI video generation
};
```

## 🎨 Prompt Engineering Best Practices

### Use the C.R.I.S.T.A.L Method

- **C**ontext & Composition: "Close-up product photography in studio environment"
- **R**ole of Subject: "Premium watch floating in mid-air with dust particles"
- **I**ntention & Style: "Ultra-realistic commercial photography style"
- **S**cenography & Lighting: "Dramatic lighting with lightning in background"
- **T**ones & Palette: "Metallic golds, dark stormy blues, electric whites"
- **A**ppearance & Details: "4K quality, hyper-detailed, professional studio lighting"
- **L**imitations: "No text overlays, no watermarks, no blur effects"

### Common Prompt Templates

```typescript
const templates = {
  productPhoto: "Create a [COMPOSITION] product photography image of [PRODUCT] [ACTION/CONTEXT]. [LIGHTING_STYLE] lighting with [SHADOW_DESCRIPTION]. Keep the product label exactly as shown. [STYLE] style, [QUALITY] quality.",
  
  characterScene: "Create a [COMPOSITION] of [CHARACTER_DESCRIPTION] [ACTION/POSE] in [ENVIRONMENT]. Keep the character's appearance exactly as shown. [LIGHTING] lighting, [STYLE] style.",
  
  backgroundReplacement: "Create a scene of [CHARACTER/OBJECT] in [NEW_ENVIRONMENT] by changing the background to [SPECIFIC_BACKGROUND]. Keep [ELEMENTS_TO_PRESERVE] exactly the same. Adjust lighting and shadows to match the [ENVIRONMENT_TYPE] environment."
};
```

## 🚨 Common Issues & Solutions

### Issue: Labels not reproducing correctly
**Solution**: Use products with clear, prominent text. Avoid small, complex fonts.

### Issue: Wrong aspect ratio output
**Solution**: The output aspect ratio matches your reference images. Create reference images with the desired aspect ratio.

### Issue: Character inconsistency
**Solution**: Start a new conversation when edits go wrong. Use the collage method for multiple characters.

### Issue: Lighting doesn't match
**Solution**: Explicitly request lighting adjustments: "Adjust the lighting and shadows to match the outdoor environment."

## 🎨 Edit Functionality Examples

### Multi-Image Editing
```typescript
const multiEdit = await fal.subscribe('fal-ai/gemini-25-flash-image/edit', {
  input: {
    prompt: "make a photo of the man driving the car down the california coastline",
    image_urls: [
      "https://example.com/person.jpg",
      "https://example.com/car.jpg"
    ],
    num_images: 1
  }
});
```

### Product Enhancement
```typescript
const enhancedProduct = await fal.subscribe('fal-ai/gemini-25-flash-image/edit', {
  input: {
    prompt: "Enhance this product image by: improve lighting, add professional shadows, enhance product details. Keep the product label exactly the same.",
    image_urls: ["https://example.com/product.jpg"]
  }
});
```

### Background Replacement
```typescript
const newBackground = await fal.subscribe('fal-ai/gemini-25-flash-image/edit', {
  input: {
    prompt: "Replace the background with a modern office environment. Keep the main subject exactly the same. Adjust lighting to match the office environment.",
    image_urls: ["https://example.com/person-outdoor.jpg"]
  }
});
```

### Lighting Adjustment
```typescript
const dramaticLighting = await fal.subscribe('fal-ai/gemini-25-flash-image/edit', {
  input: {
    prompt: "Adjust the lighting to strong dramatic lighting. Keep all subjects exactly the same, only change the lighting and shadows.",
    image_urls: ["https://example.com/image.jpg"]
  }
});
```

## 📊 Performance Tips

1. **Use Premium Quality**: Always use `quality: "premium"` for best results
2. **Be Specific**: More detailed prompts = better results
3. **Use Reference Images**: Upload reference images for better consistency
4. **Iterate**: If first result isn't perfect, refine the prompt and try again
5. **Start Fresh**: Don't continue editing in the same conversation if results degrade
6. **Edit vs Generate**: Use edit endpoint for modifying existing images, generate for creating new ones
7. **Multiple Images**: Edit endpoint can process multiple images in a single request

## 🔗 Next Steps

1. **Try the examples above** with your own images
2. **Experiment with different prompt styles** using the C.R.I.S.T.A.L method
3. **Integrate with your existing workflows** using the provided hooks and utilities
4. **Explore advanced techniques** like the collage method and video transitions
5. **Check out the comprehensive examples** in `nano-banana-comprehensive-examples.ts`

## 📚 Additional Resources

- **Comprehensive Examples**: `examples/nano-banana-comprehensive-examples.ts`
- **Implementation Guide**: `examples/nano-banana-implementation-guide.ts`
- **Fal.ai Documentation**: [fal.ai/docs](https://fal.ai/docs)
- **Google AI Studio**: [aistudio.google.com](https://aistudio.google.com)

## 🎉 You're Ready!

You now have everything you need to start using Nano Banana in your DreamCuts application. The model's ability to maintain product labels, character consistency, and handle complex editing tasks makes it perfect for professional image generation workflows.

Start with the basic examples above, then explore the advanced techniques as you become more comfortable with the model's capabilities.
