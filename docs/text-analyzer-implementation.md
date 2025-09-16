# Text Asset Analyzer Implementation

## Overview

The Text Asset Analyzer is a comprehensive system that provides advanced text understanding capabilities using multiple AI models with automatic fallback logic. It's designed to handle text analysis tasks including sentiment analysis, content summarization, language detection, keyword extraction, and more.

## Architecture

### Model Priority Order

The system uses the following models in priority order with automatic fallback:

1. **GPT-5** (Primary)
   - Description: OpenAI's most capable model for advanced reasoning, code generation, instruction following, and tool use
   - Performance: Highest accuracy for complex reasoning and analysis tasks, supports multimodal input
   - Capabilities: All analysis types with advanced reasoning capabilities

2. **Claude-Sonnet-4** (Fallback 1)
   - Description: Hybrid reasoning model with near-instant responses and extended thinking capabilities
   - Performance: 72.7% performance on SWE-bench, enhanced instruction following, parallel tool execution
   - Capabilities: All analysis types with extended thinking and reasoning

3. **GPT-5-Mini** (Fallback 2)
   - Description: Faster version of GPT-5 with balanced speed and cost, ideal for chat and medium-difficulty reasoning
   - Performance: Optimized for faster response times while maintaining high quality outputs
   - Capabilities: All analysis types with optimized speed and cost

4. **Qwen3-235B-Instruct** (Fallback 3)
   - Description: Updated Qwen3 model with 235B parameters, enhanced instruction following and logical reasoning
   - Performance: Significant improvements in general capabilities, 256K long-context understanding
   - Capabilities: All analysis types with enhanced instruction following

## Supported Analysis Types

### 1. Sentiment Analysis
- **Purpose**: Analyze emotional tone and sentiment
- **Use Cases**: Customer feedback analysis, social media monitoring, brand sentiment tracking
- **Example**: "I absolutely love this new product! It's amazing and exceeded all my expectations."

### 2. Content Summarization
- **Purpose**: Summarize key points and main ideas
- **Use Cases**: Document summarization, news aggregation, content digest
- **Example**: "Provide a comprehensive summary of the following text. Extract the key points, main ideas, and important details."

### 3. Language Detection
- **Purpose**: Identify the language(s) used in text
- **Use Cases**: Multilingual content processing, language routing, content localization
- **Example**: "Identify the language(s) used in the following text. If multiple languages are present, specify which parts are in which language."

### 4. Keyword Extraction
- **Purpose**: Extract important keywords and phrases
- **Use Cases**: SEO optimization, content tagging, search indexing
- **Example**: "Extract the most important keywords and key phrases from the following text. Rank them by importance and relevance."

### 5. Topic Modeling
- **Purpose**: Identify main topics and themes
- **Use Cases**: Content categorization, research analysis, topic discovery
- **Example**: "Identify the main topics and themes in the following text. Group related concepts together and explain how they relate to each other."

### 6. Text Classification
- **Purpose**: Classify text into categories
- **Use Cases**: Content moderation, spam detection, document classification
- **Example**: "Classify the following text into appropriate categories. Determine the genre, type, or domain of the content."

### 7. Named Entity Recognition
- **Purpose**: Identify people, places, organizations, dates
- **Use Cases**: Information extraction, knowledge graph building, data mining
- **Example**: "Identify and extract all named entities from the following text. Categorize them as persons, organizations, locations, dates, or other relevant entities."

### 8. Intent Analysis
- **Purpose**: Analyze purpose and intent
- **Use Cases**: Customer service automation, chatbot responses, user behavior analysis
- **Example**: "Analyze the intent and purpose of the following text. Determine what the author is trying to achieve, their goals, and the underlying motivation."

### 9. Readability Analysis
- **Purpose**: Assess reading level and complexity
- **Use Cases**: Content accessibility, educational content creation, writing improvement
- **Example**: "Analyze the readability and complexity of the following text. Assess the reading level, sentence structure, vocabulary complexity, and overall accessibility."

### 10. Translation
- **Purpose**: Translate to different languages
- **Use Cases**: Multilingual content creation, localization, language learning
- **Example**: "Translate the following text to English (or specify target language). Maintain the original meaning, tone, and style."

### 11. Paraphrasing
- **Purpose**: Rewrite with different words
- **Use Cases**: Content variation, plagiarism prevention, writing assistance
- **Example**: "Paraphrase the following text while maintaining the original meaning and key information. Use different words and sentence structures."

### 12. Creative Writing
- **Purpose**: Analyze creative elements and style
- **Use Cases**: Literary analysis, writing improvement, creative content generation
- **Example**: "Analyze the creative elements of the following text. Identify literary devices, writing techniques, style, and artistic qualities."

### 13. Technical Analysis
- **Purpose**: Analyze technical content
- **Use Cases**: Technical documentation analysis, code review, technical writing
- **Example**: "Perform a technical analysis of the following text. Identify technical concepts, terminology, and domain-specific information."

### 14. Educational Content
- **Purpose**: Assess educational value
- **Use Cases**: Learning content creation, educational assessment, curriculum development
- **Example**: "Analyze the educational value of the following text. Identify learning objectives, key concepts, and educational potential."

### 15. Marketing Analysis
- **Purpose**: Analyze marketing aspects
- **Use Cases**: Marketing content optimization, competitor analysis, campaign effectiveness
- **Example**: "Analyze the marketing aspects of the following text. Identify target audience, value propositions, persuasive techniques, and marketing effectiveness."

### 16. Legal Analysis
- **Purpose**: Analyze legal implications
- **Use Cases**: Legal document review, compliance checking, legal research
- **Example**: "Analyze the legal aspects of the following text. Identify legal concepts, potential issues, compliance considerations, and legal implications."

### 17. Medical Analysis
- **Purpose**: Analyze medical content
- **Use Cases**: Medical document analysis, health content review, medical research
- **Example**: "Analyze the medical content of the following text. Identify medical concepts, terminology, and health-related information."

### 18. Custom
- **Purpose**: User-defined analysis scenarios
- **Use Cases**: Specialized analysis, custom prompts, specific requirements
- **Example**: Any custom prompt provided by the user

## Implementation Details

### Core Components

1. **Text Asset Analyzer** (`executors/text-asset-analyzer.ts`)
   - Main analyzer with fallback logic
   - Model selection and execution
   - Error handling and retry logic

2. **API Endpoint** (`app/api/dreamcut/text-analyzer/route.ts`)
   - RESTful API for text analysis
   - Batch processing support
   - Model information endpoints

3. **React Hook** (`hooks/useTextAnalyzer.ts`)
   - Frontend integration
   - State management
   - Error handling

4. **React Component** (`components/chat/TextAnalyzer.tsx`)
   - User interface
   - Analysis type selection
   - Results display

### Fallback Logic

The system implements a sophisticated fallback mechanism:

1. **Primary Model**: Attempts GPT-5 first
2. **Fallback Chain**: If primary fails, tries Claude-Sonnet-4, then GPT-5-Mini, then Qwen3-235B-Instruct
3. **Error Handling**: Each model failure is logged with specific error messages
4. **Timeout Management**: 30-second timeout per model attempt
5. **Result Aggregation**: Returns the first successful result or comprehensive error information

### Integration with Query Analyzer

The text analyzer is fully integrated with the main query analyzer system:

- **Automatic Detection**: Text content is automatically detected in user uploads
- **Enhanced Analysis**: Uses the new multi-model system instead of legacy single-model approach
- **Fallback Integration**: Falls back to legacy models if all new models fail
- **User Description Support**: Preserves user-provided descriptions for context-aware analysis

## API Usage

### Single Text Analysis

```typescript
POST /api/dreamcut/text-analyzer
Content-Type: application/json

{
  "text": "Your text content here...",
  "prompt": "Analyze the sentiment of this text",
  "userDescription": "This is customer feedback for our product",
  "analysisType": "sentiment_analysis",
  "timeout": 30000,
  "enableFallback": true
}
```

### Batch Text Analysis

```typescript
POST /api/dreamcut/text-analyzer
Content-Type: application/json

{
  "texts": [
    {
      "text": "First text to analyze...",
      "prompt": "Summarize this text",
      "analysisType": "content_summarization"
    },
    {
      "text": "Second text to analyze...",
      "prompt": "Extract keywords from this text",
      "analysisType": "keyword_extraction"
    }
  ],
  "timeout": 30000,
  "enableFallback": true
}
```

### Get Available Models

```typescript
GET /api/dreamcut/text-analyzer?action=models
```

### Get Model Recommendations

```typescript
GET /api/dreamcut/text-analyzer?action=recommendations&analysisType=sentiment_analysis
```

## React Integration

### Using the Hook

```typescript
import { useTextAnalyzer } from '@/hooks/useTextAnalyzer';

function MyComponent() {
  const { analyzeText, isLoading, error } = useTextAnalyzer();

  const handleAnalyze = async () => {
    const result = await analyzeText({
      text: 'Your text content here...',
      prompt: 'Analyze the sentiment of this text',
      analysisType: 'sentiment_analysis'
    });

    if (result.success) {
      console.log('Analysis:', result.analysis);
      console.log('Model used:', result.model);
    }
  };

  return (
    <button onClick={handleAnalyze} disabled={isLoading}>
      {isLoading ? 'Analyzing...' : 'Analyze Text'}
    </button>
  );
}
```

### Using the Component

```typescript
import { TextAnalyzer } from '@/components/chat/TextAnalyzer';

function MyPage() {
  const handleAnalysisComplete = (result) => {
    console.log('Analysis completed:', result);
  };

  return (
    <TextAnalyzer onAnalysisComplete={handleAnalysisComplete} />
  );
}
```

## Performance Characteristics

### Processing Times
- **GPT-5**: ~8-15 seconds (highest accuracy)
- **Claude-Sonnet-4**: ~6-12 seconds (extended thinking)
- **GPT-5-Mini**: ~4-8 seconds (optimized speed)
- **Qwen3-235B-Instruct**: ~5-10 seconds (enhanced instruction following)

### Accuracy Benchmarks
- **GPT-5**: Highest accuracy for complex reasoning and analysis tasks
- **Claude-Sonnet-4**: 72.7% performance on SWE-bench, excellent for extended thinking
- **GPT-5-Mini**: Balanced performance with optimized speed and cost
- **Qwen3-235B-Instruct**: Enhanced instruction following with 256K context

## Error Handling

The system provides comprehensive error handling:

1. **Model Failures**: Automatic fallback to next model
2. **Timeout Handling**: 30-second timeout per model
3. **Input Validation**: Text content validation and length limits
4. **Error Reporting**: Detailed error messages with fallback information
5. **Graceful Degradation**: Returns partial results when possible

## Testing

### Test Page
Visit `/test-text-analyzer` to test the text analyzer with:
- Interactive UI for testing different analysis types
- Example text content
- Real-time results display
- Model information and capabilities

### Example Test Texts
- **Sentiment**: "I absolutely love this new product! It's amazing and exceeded all my expectations."
- **Technical**: "The API endpoint returns a JSON response with status codes 200 for success and 400 for client errors."
- **Marketing**: "Transform your business with our revolutionary AI-powered solution that increases productivity by 300%."
- **Educational**: "Photosynthesis is the process by which plants convert light energy into chemical energy using chlorophyll."

## Future Enhancements

1. **Additional Models**: Integration of newer language models
2. **Custom Model Training**: Support for fine-tuned models
3. **Batch Optimization**: Improved batch processing performance
4. **Caching**: Result caching for repeated analyses
5. **Analytics**: Usage analytics and performance monitoring
6. **Custom Scenarios**: User-defined analysis scenarios
7. **Multi-language Support**: Enhanced multilingual analysis
8. **Real-time Processing**: Streaming text analysis capabilities

## Security Considerations

1. **Input Validation**: All text content is validated
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

## Integration with Media Descriptions

The text analyzer is specifically designed to handle media descriptions and user text analysis:

### Media Description Analysis
- **Purpose**: Analyze user-provided descriptions of media assets
- **Use Cases**: Understanding user intent, improving media recommendations, content matching
- **Features**: Context-aware analysis that considers the media type and user's specific use case

### User Text Analysis
- **Purpose**: Analyze any text content provided by users
- **Use Cases**: Content understanding, user intent analysis, text processing
- **Features**: Comprehensive analysis with multiple specialized analysis types

The system automatically detects text content in user uploads and applies the appropriate analysis based on the context and user requirements.
