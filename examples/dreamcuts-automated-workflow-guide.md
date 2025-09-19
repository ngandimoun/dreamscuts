# DreamCuts Automated Image Generation Guide

## 🎯 **The Ultimate AI Image Generation System**

DreamCuts now features an intelligent automation system that automatically selects the best AI model based on your query, without you needing to know about different models. Just describe what you want, and DreamCuts will choose the optimal model and deliver the best results.

## 🧠 **How It Works**

### **1. Intelligent Query Analysis**
The system analyzes your query to understand:
- **Intent**: What you want to achieve
- **Image Type**: Product, character, artistic, etc.
- **Quality Requirements**: Standard, high, or 4K
- **Use Case**: E-commerce, marketing, social media, etc.
- **Features**: Text, characters, products, hands, etc.

### **2. Automatic Model Selection**
Based on the analysis, the system automatically selects from:
- **Nano Banana**: Best for product labels, character consistency, hand-holding
- **Seedream 4.0**: Best for 4K generation, mockups, sketch-to-photo
- **GPT Image 1**: Best for creative concepts, artistic styles
- **Flux SRPO**: Best for high-quality artistic generation

### **3. Optimal Results**
The selected model generates your image with the best possible quality for your specific use case.

## 🚀 **Quick Start**

### **Basic Usage**
```typescript
import { useDreamCutsImageGeneration } from './examples/dreamcuts-smart-model-selector';

function MyComponent() {
  const { generateImage, isGenerating, lastResult, error } = useDreamCutsImageGeneration(apiKey);

  const handleGenerate = async () => {
    const result = await generateImage({
      prompt: "Create a professional product photo of a red leather jacket for e-commerce",
      options: {
        quality: 'high',
        numImages: 1
      }
    });
    
    console.log('Generated with model:', result.model);
    console.log('Images:', result.images);
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Generate Image'}
      </button>
      
      {lastResult && (
        <div>
          <p>Generated with: {lastResult.model}</p>
          {lastResult.images.map((img, index) => (
            <img key={index} src={img.url} alt={`Generated ${index + 1}`} />
          ))}
        </div>
      )}
    </div>
  );
}
```

## 📝 **Query Examples & Model Selection**

### **🏷️ Product Photography (Nano Banana)**
```typescript
// These queries will automatically use Nano Banana for perfect label preservation
await generateImage({
  prompt: "Create a product photo of this iPhone with the Apple logo clearly visible"
});

await generateImage({
  prompt: "Generate an e-commerce product shot of this branded t-shirt with the logo intact"
});

await generateImage({
  prompt: "Create a flat lay product photography image of this product with its label"
});
```

### **👤 Character Consistency (Nano Banana)**
```typescript
// These queries will automatically use Nano Banana for character consistency
await generateImage({
  prompt: "Create a wide angle shot of this character walking confidently in a modern office"
});

await generateImage({
  prompt: "Generate a scene with this character in different poses but same appearance"
});
```

### **✋ Hand-Holding Products (Nano Banana)**
```typescript
// These queries will automatically use Nano Banana for realistic hand anatomy
await generateImage({
  prompt: "Create an image of a hand holding this product naturally"
});

await generateImage({
  prompt: "Generate a lifestyle shot of someone holding this smartphone"
});
```

### **🖼️ 4K High-Resolution (Seedream 4.0)**
```typescript
// These queries will automatically use Seedream 4.0 for 4K generation
await generateImage({
  prompt: "Create a 4K high-resolution image of a modern restaurant interior"
});

await generateImage({
  prompt: "Generate an ultra HD product shot for large format printing"
});
```

### **📦 Product Mockups (Seedream 4.0)**
```typescript
// These queries will automatically use Seedream 4.0 for mockup generation
await generateImage({
  prompt: "Expand this logo into a full spread of product mockups including t-shirt, mug, and phone case"
});

await generateImage({
  prompt: "Create comprehensive brand mockups for this logo"
});
```

### **🎨 Sketch to Photo (Seedream 4.0)**
```typescript
// These queries will automatically use Seedream 4.0 for sketch conversion
await generateImage({
  prompt: "Turn this sketch into a realistic product photo",
  referenceImages: ["sketch.jpg"]
});

await generateImage({
  prompt: "Convert this line art into a professional product shot"
});
```

### **🎭 Creative Concepts (GPT Image 1)**
```typescript
// These queries will automatically use GPT Image 1 for creative generation
await generateImage({
  prompt: "Create a surreal artistic concept of a floating city in the clouds"
});

await generateImage({
  prompt: "Generate an abstract creative interpretation of digital transformation"
});
```

### **🎨 Artistic Styles (Flux SRPO)**
```typescript
// These queries will automatically use Flux SRPO for artistic generation
await generateImage({
  prompt: "Create a high-quality artistic painting of a sunset landscape"
});

await generateImage({
  prompt: "Generate an artistic style transfer of this image in Van Gogh style"
});
```

## 🔧 **Advanced Usage**

### **With Reference Images**
```typescript
await generateImage({
  prompt: "Change the background of this product to a modern studio setting",
  referenceImages: ["product.jpg"],
  options: {
    quality: 'high',
    numImages: 1
  }
});
```

### **Multiple Images**
```typescript
await generateImage({
  prompt: "Combine these images into a cohesive scene",
  referenceImages: ["image1.jpg", "image2.jpg", "image3.jpg"],
  options: {
    numImages: 2
  }
});
```

### **Quality Control**
```typescript
await generateImage({
  prompt: "Create a professional headshot",
  options: {
    quality: 'ultra', // Will automatically select 4K-capable model
    resolution: '4k'
  }
});
```

## 📊 **Model Selection Logic**

### **Nano Banana is automatically selected for:**
- ✅ Product photography with labels/text
- ✅ Character consistency across scenes
- ✅ Hand-holding products
- ✅ Background replacement
- ✅ Photo restoration
- ✅ E-commerce use cases

### **Seedream 4.0 is automatically selected for:**
- ✅ 4K high-resolution generation
- ✅ Product mockups and packaging
- ✅ Sketch to photography conversion
- ✅ Character turnarounds
- ✅ Multi-image composition
- ✅ Professional headshots
- ✅ Virtual try-ons

### **GPT Image 1 is automatically selected for:**
- ✅ Creative concepts and ideas
- ✅ Artistic styles and interpretations
- ✅ Complex creative scenes
- ✅ Abstract concepts
- ✅ Marketing campaigns
- ✅ Social media content

### **Flux SRPO is automatically selected for:**
- ✅ High-quality artistic generation
- ✅ Style transfer
- ✅ Artistic compositions
- ✅ Aesthetic quality
- ✅ Print materials
- ✅ Creative styles

## 🎯 **Use Case Examples**

### **E-commerce Store Owner**
```typescript
// Just describe what you want - the system handles the rest
await generateImage({
  prompt: "Create a professional product photo of this red leather jacket for my online store"
});
// → Automatically uses Nano Banana for perfect label preservation
```

### **Content Creator**
```typescript
await generateImage({
  prompt: "Generate a creative concept for my social media post about digital transformation"
});
// → Automatically uses GPT Image 1 for creative concepts
```

### **Brand Manager**
```typescript
await generateImage({
  prompt: "Create comprehensive mockups for our new logo across different products"
});
// → Automatically uses Seedream 4.0 for mockup generation
```

### **Photographer**
```typescript
await generateImage({
  prompt: "Generate a 4K high-resolution landscape for a large format print"
});
// → Automatically uses Seedream 4.0 for 4K generation
```

## 🔍 **Query Analysis Examples**

### **What the system detects:**
```typescript
// Query: "Create a product photo of this iPhone with the Apple logo clearly visible"
// Analysis:
// - Intent: product-photo
// - HasText: true (logo)
// - HasProducts: true (iPhone)
// - UseCase: e-commerce
// - QualityRequirement: high
// → Selected Model: Nano Banana (perfect for label preservation)
```

```typescript
// Query: "Generate a 4K high-resolution image of a modern restaurant"
// Analysis:
// - Intent: 4k-generation
// - ResolutionNeeded: 4k
// - QualityRequirement: ultra
// - UseCase: print
// → Selected Model: Seedream 4.0 (best for 4K generation)
```

```typescript
// Query: "Create a surreal artistic concept of a floating city"
// Analysis:
// - Intent: creative-concept
// - IsCreative: true
// - ImageType: artistic
// - Complexity: complex
// → Selected Model: GPT Image 1 (best for creative concepts)
```

## 🚀 **Integration with Existing Components**

### **Enhanced Image Analyzer**
```typescript
function EnhancedImageAnalyzer() {
  const { generateImage, isGenerating, lastResult } = useDreamCutsImageGeneration(apiKey);

  const handleAnalyzeAndGenerate = async (originalImage: string, analysis: any) => {
    // The system automatically chooses the best model based on the analysis
    const result = await generateImage({
      prompt: `Enhance this image based on the analysis: ${analysis.suggestions}`,
      referenceImages: [originalImage],
      options: {
        quality: analysis.quality || 'high'
      }
    });

    return result;
  };

  return (
    <div>
      {/* Your existing UI */}
      {lastResult && (
        <div>
          <p>Enhanced with: {lastResult.model}</p>
          <img src={lastResult.images[0].url} alt="Enhanced" />
        </div>
      )}
    </div>
  );
}
```

### **Smart Product Generator**
```typescript
function SmartProductGenerator() {
  const { generateImage, isGenerating } = useDreamCutsImageGeneration(apiKey);

  const generateProductSuite = async (productDescription: string) => {
    // The system automatically selects the best model for each task
    const mainPhoto = await generateImage({
      prompt: `Create a professional product photo of ${productDescription}`,
      options: { quality: 'high' }
    });

    const mockups = await generateImage({
      prompt: `Generate product mockups for ${productDescription}`,
      options: { quality: 'ultra' }
    });

    return { mainPhoto, mockups };
  };

  return (
    <div>
      <button onClick={() => generateProductSuite("red leather jacket")}>
        Generate Product Suite
      </button>
    </div>
  );
}
```

## 💡 **Pro Tips**

### **1. Be Specific About Your Needs**
```typescript
// Good: Specific about quality and use case
"Create a 4K high-resolution product photo for large format printing"

// Better: Include context
"Create a professional e-commerce product photo of this branded t-shirt with perfect label preservation"
```

### **2. Use Reference Images When Available**
```typescript
// Always include reference images when you have them
await generateImage({
  prompt: "Enhance this product photo",
  referenceImages: ["original.jpg"] // This helps the system choose the right model
});
```

### **3. Specify Quality Requirements**
```typescript
// Be explicit about quality needs
await generateImage({
  prompt: "Create a product photo",
  options: {
    quality: 'ultra', // Will automatically select 4K-capable model
    resolution: '4k'
  }
});
```

### **4. Trust the System**
```typescript
// Don't worry about which model to use - just describe what you want
await generateImage({
  prompt: "I need a professional headshot for LinkedIn"
});
// The system will automatically choose the best model for headshots
```

## 🎉 **Benefits**

### **For Users:**
- ✅ **No model knowledge required** - Just describe what you want
- ✅ **Always get the best results** - System chooses optimal model
- ✅ **Consistent quality** - Each use case gets the best model
- ✅ **Simple interface** - One function for all image generation

### **For Developers:**
- ✅ **Automatic optimization** - No need to choose models manually
- ✅ **Scalable system** - Easy to add new models
- ✅ **Intelligent routing** - Smart model selection based on analysis
- ✅ **Unified interface** - One API for all image generation

## 🚀 **Ready to Use**

The DreamCuts automated image generation system is now ready! Just import the hook and start generating images. The system will automatically:

1. **Analyze your query** to understand your needs
2. **Select the best model** for your specific use case
3. **Generate optimal results** with the chosen model
4. **Return consistent quality** every time

No more guessing which model to use - DreamCuts handles it all automatically! 🎯
