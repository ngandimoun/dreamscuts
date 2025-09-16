# Image Asset Analyzer Implementation

## Overview

The Image Asset Analyzer is a comprehensive system that provides advanced image understanding capabilities using multiple AI models with automatic fallback logic. It's designed to handle image analysis tasks including visual question answering, object detection, text recognition, scene analysis, and more.

## Architecture

### Model Priority Order

The system uses the following models in priority order with automatic fallback:

1. **LLaVA-13B** (Primary)
   - Model ID: `yorickvp/llava-13b:80537f9eead1a5bfa72d5ac6ea6414379be41d4d4f6679fd776e9535d1eb58bb`
   - Description: Large multimodal model combining vision encoder and Vicuna for general-purpose visual and language understanding
   - Performance: High accuracy on Science QA, excellent for complex visual reasoning
   - Capabilities: All analysis types

2. **Molmo-7B** (Fallback 1)
   - Model ID: `zsxkib/molmo-7b:76ebd700864218a4ca97ac1ccff068be7222272859f9ea2ae1dd4ac073fa8de8`
   - Description: Open vision-language model from Allen Institute for AI, performs between GPT-4V and GPT-4o
   - Performance: Average score of 77.3 on 11 academic benchmarks, human preference Elo rating of 1056
   - Capabilities: Visual Q&A, object detection, scene analysis, content summarization, educational, marketing, medical

3. **Qwen2-VL-7B-Instruct** (Fallback 2)
   - Model ID: `lucataco/qwen2-vl-7b-instruct:bf57361c75677fc33d480d0c5f02926e621b2caa2000347cb74aeae9d2ca07ee`
   - Description: Latest model in the Qwen family for chatting with video and image models
   - Performance: State-of-the-art multimodal capabilities, ~4 seconds processing time
   - Capabilities: Image analysis, visual Q&A, document analysis, creative content, scientific analysis, medical analysis, technical docs, visual storytelling

4. **Qwen-VL-Chat** (Fallback 3)
   - Model ID: `lucataco/qwen-vl-chat:50881b153b4d5f72b3db697e2bbad23bb1277ab741c5b52d80cd6ee17ea660e9`
   - Description: Multimodal LLM-based AI assistant trained with alignment techniques
   - Performance: Excellent for image analysis, visual question answering, and multimodal conversations
   - Capabilities: Visual Q&A, object detection, text recognition, scene analysis, creative tasks, problem solving, content summarization, educational, marketing, medical

5. **Moondream2** (Fallback 4)
   - Model ID: `lucataco/moondream2:72ccb656353c348c1385df54b237eeb7bfa874bf11486cf0b9473e691b662d31`
   - Description: Small vision language model designed to run efficiently on edge devices
   - Performance: VQAv2 (79.4%), GQA (64.9%), TextVQA (60.2%), DocVQA (61.9%) - optimized for resource-constrained environments
   - Capabilities: Visual Q&A, object detection, scene analysis, content summarization

## Supported Analysis Types

### 1. Visual Q&A
- **Purpose**: Answer questions about image content
- **Use Cases**: Interactive image exploration, educational content, customer support
- **Example**: "What objects are in this image?" "Describe the scene"

### 2. Object Detection
- **Purpose**: Identify and locate objects in images
- **Use Cases**: Inventory management, security systems, content moderation
- **Example**: "Find all cars in this image" "Identify the furniture"

### 3. Text Recognition
- **Purpose**: Extract and read text from images
- **Use Cases**: Document digitization, accessibility, data extraction
- **Example**: "Read the text on this sign" "Extract the serial number"

### 4. Scene Analysis
- **Purpose**: Analyze the overall scene and context
- **Use Cases**: Content categorization, context understanding, scene description
- **Example**: "What type of environment is this?" "Describe the setting"

### 5. Creative Tasks
- **Purpose**: Generate creative content based on images
- **Use Cases**: Content creation, storytelling, marketing materials
- **Example**: "Write a story about this image" "Create a caption"

### 6. Problem Solving
- **Purpose**: Identify and solve problems shown in images
- **Use Cases**: Technical support, troubleshooting, quality control
- **Example**: "What's wrong with this setup?" "How can this be improved?"

### 7. Content Summarization
- **Purpose**: Summarize image content concisely
- **Use Cases**: Quick content overview, accessibility, content indexing
- **Example**: "Summarize what you see" "Give me the key points"

### 8. Educational
- **Purpose**: Educational content analysis and explanation
- **Use Cases**: Learning platforms, educational content, knowledge sharing
- **Example**: "Explain what this diagram shows" "What can students learn?"

### 9. Marketing
- **Purpose**: Marketing perspective analysis
- **Use Cases**: Brand analysis, marketing insights, competitor research
- **Example**: "Analyze this from a marketing perspective" "What's the target audience?"

### 10. Medical
- **Purpose**: Medical image analysis
- **Use Cases**: Healthcare, medical imaging, diagnostic assistance
- **Example**: "Analyze this medical image" "What do you observe?"

### 11. Custom
- **Purpose**: User-defined analysis scenarios
- **Use Cases**: Specialized analysis, custom prompts, specific requirements
- **Example**: Any custom prompt provided by the user

## Implementation Details

### Core Components

1. **Image Asset Analyzer** (`executors/image-asset-analyzer.ts`)
   - Main analyzer with fallback logic
   - Model selection and execution
   - Error handling and retry logic

2. **API Endpoint** (`app/api/dreamcut/image-analyzer/route.ts`)
   - RESTful API for image analysis
   - Batch processing support
   - Model information endpoints

3. **React Hook** (`hooks/useImageAnalyzer.ts`)
   - Frontend integration
   - State management
   - Error handling

4. **React Component** (`components/chat/ImageAnalyzer.tsx`)
   - User interface
   - Analysis type selection
   - Results display

### Fallback Logic

The system implements a sophisticated fallback mechanism:

1. **Primary Model**: Attempts LLaVA-13B first
2. **Fallback Chain**: If primary fails, tries Molmo-7B, then Qwen2-VL-7B, then Qwen-VL-Chat, then Moondream2
3. **Error Handling**: Each model failure is logged with specific error messages
4. **Timeout Management**: 30-second timeout per model attempt
5. **Result Aggregation**: Returns the first successful result or comprehensive error information

### Integration with Query Analyzer

The image analyzer is fully integrated with the main query analyzer system:

- **Automatic Detection**: Images are automatically detected in user uploads
- **Enhanced Analysis**: Uses the new multi-model system instead of legacy single-model approach
- **Fallback Integration**: Falls back to legacy Together.ai and Qwen models if all new models fail
- **User Description Support**: Preserves user-provided descriptions for context-aware analysis

## API Usage

### Single Image Analysis

```typescript
POST /api/dreamcut/image-analyzer
Content-Type: application/json

{
  "imageUrl": "https://example.com/image.jpg",
  "prompt": "What do you see in this image?",
  "userDescription": "This is a product photo for my e-commerce site",
  "analysisType": "visual_qa",
  "timeout": 30000,
  "enableFallback": true
}
```

### Batch Image Analysis

```typescript
POST /api/dreamcut/image-analyzer
Content-Type: application/json

{
  "images": [
    {
      "imageUrl": "https://example.com/image1.jpg",
      "prompt": "Describe this image",
      "analysisType": "scene_analysis"
    },
    {
      "imageUrl": "https://example.com/image2.jpg", 
      "prompt": "What objects are visible?",
      "analysisType": "object_detection"
    }
  ],
  "timeout": 30000,
  "enableFallback": true
}
```

### Get Available Models

```typescript
GET /api/dreamcut/image-analyzer?action=models
```

### Get Model Recommendations

```typescript
GET /api/dreamcut/image-analyzer?action=recommendations&analysisType=visual_qa
```

## React Integration

### Using the Hook

```typescript
import { useImageAnalyzer } from '@/hooks/useImageAnalyzer';

function MyComponent() {
  const { analyzeImage, isLoading, error } = useImageAnalyzer();

  const handleAnalyze = async () => {
    const result = await analyzeImage({
      imageUrl: 'https://example.com/image.jpg',
      prompt: 'What do you see?',
      analysisType: 'visual_qa'
    });

    if (result.success) {
      console.log('Analysis:', result.analysis);
      console.log('Model used:', result.model);
    }
  };

  return (
    <button onClick={handleAnalyze} disabled={isLoading}>
      {isLoading ? 'Analyzing...' : 'Analyze Image'}
    </button>
  );
}
```

### Using the Component

```typescript
import { ImageAnalyzer } from '@/components/chat/ImageAnalyzer';

function MyPage() {
  const handleAnalysisComplete = (result) => {
    console.log('Analysis completed:', result);
  };

  return (
    <ImageAnalyzer onAnalysisComplete={handleAnalysisComplete} />
  );
}
```

## Performance Characteristics

### Processing Times
- **LLaVA-13B**: ~8-12 seconds (high accuracy)
- **Molmo-7B**: ~6-10 seconds (balanced performance)
- **Qwen2-VL-7B**: ~4-6 seconds (fast and accurate)
- **Qwen-VL-Chat**: ~5-8 seconds (good for conversations)
- **Moondream2**: ~2-4 seconds (fastest, edge-optimized)

### Accuracy Benchmarks
- **LLaVA-13B**: Highest accuracy on complex reasoning tasks
- **Molmo-7B**: 77.3 average on 11 academic benchmarks
- **Qwen2-VL-7B**: State-of-the-art on multimodal tasks
- **Qwen-VL-Chat**: Excellent for interactive analysis
- **Moondream2**: VQAv2 (79.4%), GQA (64.9%), TextVQA (60.2%), DocVQA (61.9%)

## Error Handling

The system provides comprehensive error handling:

1. **Model Failures**: Automatic fallback to next model
2. **Timeout Handling**: 30-second timeout per model
3. **Input Validation**: URL format and image type validation
4. **Error Reporting**: Detailed error messages with fallback information
5. **Graceful Degradation**: Returns partial results when possible

## Testing

### Test Page
Visit `/test-image-analyzer` to test the image analyzer with:
- Interactive UI for testing different analysis types
- Example image URLs
- Real-time results display
- Model information and capabilities

### Example Test Images
- Mountain landscape: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4`
- Dog portrait: `https://images.unsplash.com/photo-1517849845537-4d257902454a`
- City street: `https://images.unsplash.com/photo-1558618047-3c8c76ca7d13`
- Food photography: `https://images.unsplash.com/photo-1560472354-b33ff0c44a43`

## Future Enhancements

1. **Additional Models**: Integration of newer vision-language models
2. **Custom Model Training**: Support for fine-tuned models
3. **Batch Optimization**: Improved batch processing performance
4. **Caching**: Result caching for repeated analyses
5. **Analytics**: Usage analytics and performance monitoring
6. **Custom Scenarios**: User-defined analysis scenarios
7. **Multi-language Support**: Analysis in multiple languages

## Security Considerations

1. **Input Validation**: All image URLs are validated
2. **Rate Limiting**: Built-in rate limiting for API endpoints
3. **Error Sanitization**: Error messages are sanitized to prevent information leakage
4. **Timeout Protection**: Prevents long-running requests
5. **Resource Management**: Proper cleanup of resources

## Monitoring and Logging

The system includes comprehensive logging:
- Model selection and execution
- Fallback usage tracking
- Performance metrics
- Error rates and types
- User interaction patterns

This information can be used for:
- Performance optimization
- Model selection improvements
- Error analysis and debugging
- Usage analytics
