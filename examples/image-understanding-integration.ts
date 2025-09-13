/**
 * Image Understanding Integration Examples
 * 
 * This file demonstrates how to integrate the hardcoded image understanding service
 * into your existing Dreamcut application for various use cases.
 */

import ImageUnderstandingService from '../services/image-understanding-service';

/**
 * Example 1: Basic Image Description Integration
 * 
 * Use this for simple image descriptions in your UI
 */
export async function getImageDescription(imageUrl: string): Promise<string> {
  try {
    const result = await ImageUnderstandingService.describeImage(imageUrl);
    
    if (result.success) {
      return result.result;
    } else {
      console.error('Image description failed:', result.error);
      return 'Unable to describe this image at the moment.';
    }
  } catch (error) {
    console.error('Image description error:', error);
    return 'Error processing image description.';
  }
}

/**
 * Example 2: Content Moderation Integration
 * 
 * Use this to analyze images for inappropriate content
 */
export async function moderateImageContent(imageUrl: string): Promise<{
  isAppropriate: boolean;
  reason: string;
  confidence: 'high' | 'medium' | 'low';
}> {
  try {
    const result = await ImageUnderstandingService.analyzeImage(imageUrl, {
      customPrompt: 'Analyze this image for inappropriate content. Describe what you see and whether it contains any inappropriate, offensive, or harmful content. Be specific about what makes it appropriate or inappropriate.'
    });
    
    if (result.success) {
      const response = result.result.toLowerCase();
      const isAppropriate = !response.includes('inappropriate') && 
                           !response.includes('offensive') && 
                           !response.includes('harmful') &&
                           !response.includes('explicit') &&
                           !response.includes('violence');
      
      return {
        isAppropriate,
        reason: result.result,
        confidence: result.fallbackUsed ? 'medium' : 'high'
      };
    } else {
      return {
        isAppropriate: true, // Default to safe
        reason: 'Unable to analyze image content',
        confidence: 'low'
      };
    }
  } catch (error) {
    console.error('Content moderation error:', error);
    return {
      isAppropriate: true, // Default to safe
      reason: 'Error analyzing image content',
      confidence: 'low'
    };
  }
}

/**
 * Example 3: Accessibility Integration
 * 
 * Use this to generate alt text for images
 */
export async function generateAltText(imageUrl: string): Promise<string> {
  try {
    const result = await ImageUnderstandingService.captionImage(imageUrl, {
      customPrompt: 'Generate a concise alt text description for this image that would be helpful for screen readers. Focus on the main subject and key visual elements.'
    });
    
    if (result.success) {
      // Clean up the result for alt text
      return result.result
        .replace(/^["']|["']$/g, '') // Remove quotes
        .trim()
        .substring(0, 125); // Limit length for alt text
    } else {
      return 'Image description unavailable';
    }
  } catch (error) {
    console.error('Alt text generation error:', error);
    return 'Image description unavailable';
  }
}

/**
 * Example 4: Educational Content Integration
 * 
 * Use this to create educational descriptions for learning materials
 */
export async function createEducationalDescription(imageUrl: string, subject: string): Promise<string> {
  try {
    const result = await ImageUnderstandingService.explainImage(imageUrl, {
      customPrompt: `Explain this image in an educational context for ${subject}. Provide clear, informative descriptions that would help students understand the visual content and its relevance to the subject matter.`
    });
    
    if (result.success) {
      return result.result;
    } else {
      return 'Educational description unavailable';
    }
  } catch (error) {
    console.error('Educational description error:', error);
    return 'Educational description unavailable';
  }
}

/**
 * Example 5: Social Media Integration
 * 
 * Use this to generate engaging captions for social media posts
 */
export async function generateSocialMediaCaption(imageUrl: string, platform: 'instagram' | 'twitter' | 'facebook'): Promise<string> {
  try {
    const platformPrompts = {
      instagram: 'Create an engaging Instagram caption for this image. Make it visually appealing and include relevant hashtags.',
      twitter: 'Create a concise Twitter caption for this image. Keep it under 280 characters and engaging.',
      facebook: 'Create a Facebook post caption for this image. Make it informative and engaging for a general audience.'
    };
    
    const result = await ImageUnderstandingService.captionImage(imageUrl, {
      customPrompt: platformPrompts[platform]
    });
    
    if (result.success) {
      return result.result;
    } else {
      return 'Caption generation unavailable';
    }
  } catch (error) {
    console.error('Social media caption error:', error);
    return 'Caption generation unavailable';
  }
}

/**
 * Example 6: E-commerce Integration
 * 
 * Use this to generate product descriptions from images
 */
export async function generateProductDescription(imageUrl: string, productType: string): Promise<string> {
  try {
    const result = await ImageUnderstandingService.analyzeImage(imageUrl, {
      customPrompt: `Analyze this ${productType} product image and generate a detailed product description. Include key features, materials, colors, and any notable characteristics that would be important for potential customers.`
    });
    
    if (result.success) {
      return result.result;
    } else {
      return 'Product description unavailable';
    }
  } catch (error) {
    console.error('Product description error:', error);
    return 'Product description unavailable';
  }
}

/**
 * Example 7: News and Journalism Integration
 * 
 * Use this to analyze news images and generate captions
 */
export async function analyzeNewsImage(imageUrl: string, context: string): Promise<{
  caption: string;
  keyElements: string[];
  newsworthy: boolean;
}> {
  try {
    const result = await ImageUnderstandingService.understandImage(imageUrl, {
      customPrompt: `Analyze this news image in the context of: ${context}. Identify key elements, people, locations, and events. Determine if this image is newsworthy and why.`
    });
    
    if (result.success) {
      const response = result.result;
      const keyElements = response
        .split(/[.!?]/)
        .map(s => s.trim())
        .filter(s => s.length > 10)
        .slice(0, 5); // Top 5 key elements
      
      const newsworthy = response.toLowerCase().includes('newsworthy') || 
                        response.toLowerCase().includes('important') ||
                        response.toLowerCase().includes('significant');
      
      return {
        caption: response,
        keyElements,
        newsworthy
      };
    } else {
      return {
        caption: 'Image analysis unavailable',
        keyElements: [],
        newsworthy: false
      };
    }
  } catch (error) {
    console.error('News image analysis error:', error);
    return {
      caption: 'Image analysis unavailable',
      keyElements: [],
      newsworthy: false
    };
  }
}

/**
 * Example 8: Healthcare Integration
 * 
 * Use this to analyze medical images (for educational purposes only)
 */
export async function analyzeMedicalImage(imageUrl: string, imageType: string): Promise<string> {
  try {
    const result = await ImageUnderstandingService.analyzeImage(imageUrl, {
      customPrompt: `Analyze this ${imageType} medical image for educational purposes. Describe the visible anatomical structures, any notable features, and provide educational context. Note: This is for educational purposes only and should not be used for medical diagnosis.`
    });
    
    if (result.success) {
      return result.result;
    } else {
      return 'Medical image analysis unavailable';
    }
  } catch (error) {
    console.error('Medical image analysis error:', error);
    return 'Medical image analysis unavailable';
  }
}

/**
 * Example 9: Batch Processing Integration
 * 
 * Use this to process multiple images efficiently
 */
export async function processImageBatch(imageUrls: string[], task: 'description' | 'captioning' | 'analysis'): Promise<Array<{
  url: string;
  result: string;
  success: boolean;
  modelUsed: string;
}>> {
  try {
    const results = await ImageUnderstandingService.processBatch(imageUrls, { task });
    
    return results.map((result, index) => ({
      url: imageUrls[index],
      result: result.result,
      success: result.success,
      modelUsed: result.modelUsed
    }));
  } catch (error) {
    console.error('Batch processing error:', error);
    return imageUrls.map(url => ({
      url,
      result: 'Processing failed',
      success: false,
      modelUsed: 'none'
    }));
  }
}

/**
 * Example 10: Real-time Integration with Error Handling
 * 
 * Use this for real-time applications with proper error handling
 */
export async function realTimeImageAnalysis(imageUrl: string, callback: (result: string) => void): Promise<void> {
  try {
    // Show loading state
    callback('Analyzing image...');
    
    const result = await ImageUnderstandingService.understandImage(imageUrl, {
      task: 'analysis',
      timeout: 10000 // 10 second timeout
    });
    
    if (result.success) {
      callback(result.result);
    } else {
      callback('Analysis failed. Please try again.');
    }
  } catch (error) {
    console.error('Real-time analysis error:', error);
    callback('Error analyzing image. Please check your connection and try again.');
  }
}

/**
 * Example 11: Integration with Your Existing Registry System
 * 
 * Use this to integrate with your existing AI model registry
 */
export async function getImageUnderstandingRecommendation(imageUrl: string): Promise<{
  recommendedTask: string;
  confidence: number;
  reasoning: string;
}> {
  try {
    // First, get a basic understanding of the image
    const result = await ImageUnderstandingService.understandImage(imageUrl, {
      task: 'understanding'
    });
    
    if (result.success) {
      const response = result.result.toLowerCase();
      
      // Determine the best task based on image content
      let recommendedTask = 'description';
      let confidence = 0.7;
      let reasoning = 'Standard image description recommended';
      
      if (response.includes('chart') || response.includes('graph') || response.includes('data')) {
        recommendedTask = 'analysis';
        confidence = 0.9;
        reasoning = 'Data visualization detected - analysis recommended';
      } else if (response.includes('text') || response.includes('document')) {
        recommendedTask = 'explanation';
        confidence = 0.8;
        reasoning = 'Text-heavy image detected - explanation recommended';
      } else if (response.includes('person') || response.includes('people')) {
        recommendedTask = 'captioning';
        confidence = 0.8;
        reasoning = 'People detected - captioning recommended';
      } else if (response.includes('art') || response.includes('painting') || response.includes('design')) {
        recommendedTask = 'detailed_description';
        confidence = 0.9;
        reasoning = 'Artistic content detected - detailed description recommended';
      }
      
      return {
        recommendedTask,
        confidence,
        reasoning
      };
    } else {
      return {
        recommendedTask: 'description',
        confidence: 0.5,
        reasoning: 'Unable to analyze image - defaulting to description'
      };
    }
  } catch (error) {
    console.error('Recommendation error:', error);
    return {
      recommendedTask: 'description',
      confidence: 0.3,
      reasoning: 'Error analyzing image - defaulting to description'
    };
  }
}

// Export all functions for use in your application
export {
  getImageDescription,
  moderateImageContent,
  generateAltText,
  createEducationalDescription,
  generateSocialMediaCaption,
  generateProductDescription,
  analyzeNewsImage,
  analyzeMedicalImage,
  processImageBatch,
  realTimeImageAnalysis,
  getImageUnderstandingRecommendation
};
