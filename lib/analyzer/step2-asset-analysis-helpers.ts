/**
 * Step 2: Asset Analysis Helper Functions
 * 
 * Individual asset analyzers for different media types using Replicate models.
 */

import { executeReplicateLLaVA13B, createImageAnalysisPrompt } from '../../executors/replicate-llava-13b';
import { executeReplicateBLIP, comprehensiveImageAnalysisWithBLIP } from '../../executors/replicate-blip';
import { executeReplicateMoondream2, comprehensiveImageAnalysisWithMoondream2 } from '../../executors/replicate-moondream2';
import { executeReplicateApollo7B, comprehensiveVideoAnalysisWithApollo7B } from '../../executors/replicate-apollo-7b';
import { executeReplicateQwen25Omni7B, comprehensiveOmniVideoAnalysis } from '../../executors/replicate-qwen2-5-omni-7b';
import { executeReplicateWhisperLargeV3, comprehensiveAudioAnalysisWithWhisper } from '../../executors/replicate-whisper-large-v3';

interface AssetInput {
  id: string;
  url: string;
  mediaType: 'image' | 'video' | 'audio' | 'text';
  userDescription?: string;
  metadata?: any;
}

/**
 * Analyze image assets using multiple Replicate models
 */
export async function analyzeImageAsset(
  asset: AssetInput,
  userQuery: string,
  options: any
): Promise<{
  metadata: any;
  contentAnalysis: any;
  alignment: any;
  needs: any;
  confidence: number;
  modelsUsed: string[];
  fallbackUsed: boolean;
}> {
  const modelsUsed: string[] = [];
  let fallbackUsed = false;
  
  try {
    console.log(`[ImageAnalyzer] Starting comprehensive analysis for ${asset.id}`);
    
    // Try primary model first (LLaVA 13B)
    let primaryAnalysis: any;
    let detailedAnalysis: any;
    
    try {
      // Try primary model first (LLaVA 13B)
      console.log(`[ImageAnalyzer] Trying primary model: LLaVA 13B`);
      primaryAnalysis = await executeReplicateLLaVA13B({
        image: asset.url,
        prompt: createImageAnalysisPrompt('detailed'),
        max_tokens: 1024,
        temperature: 0.1
      });
      modelsUsed.push('llava-13b');
      
      // Use the primary analysis as detailed analysis - NO SECONDARY MODEL CALL
      detailedAnalysis = {
        detailedAnalysis: primaryAnalysis.text,
        objectsDetected: extractObjectsFromText(primaryAnalysis.text),
        qualityAssessment: extractQualityFromText(primaryAnalysis.text),
        styleAnalysis: extractStyleFromText(primaryAnalysis.text),
        moodAssessment: extractMoodFromText(primaryAnalysis.text)
      };
      
      console.log(`[ImageAnalyzer] Primary model succeeded, using single result`);
      
    } catch (error) {
      console.warn(`[ImageAnalyzer] Primary model LLaVA 13B failed, trying first fallback:`, error);
      fallbackUsed = true;
      
      // First fallback: BLIP
      try {
        detailedAnalysis = await comprehensiveImageAnalysisWithBLIP(asset.url);
        modelsUsed.push('blip');
        
        primaryAnalysis = {
          text: detailedAnalysis.detailedAnalysis
        };
        console.log(`[ImageAnalyzer] First fallback BLIP succeeded`);
        
      } catch (blipError) {
        console.warn(`[ImageAnalyzer] BLIP fallback failed, trying final fallback:`, blipError);
        
        // Final fallback: Moondream2
        try {
          detailedAnalysis = await comprehensiveImageAnalysisWithMoondream2(asset.url);
          modelsUsed.push('moondream2');
          
          primaryAnalysis = {
            text: detailedAnalysis.detailedAnalysis
          };
          console.log(`[ImageAnalyzer] Final fallback Moondream2 succeeded`);
          
        } catch (fallbackError) {
          console.error(`[ImageAnalyzer] All models failed for ${asset.id}:`, fallbackError);
          throw new Error('All image analysis models failed');
        }
      }
    }

    // Extract metadata (basic image properties)
    const metadata = {
      format: extractImageFormat(asset.url),
      quality_score: assessImageQuality(primaryAnalysis.text),
      estimated_dimensions: extractDimensions(primaryAnalysis.text),
      color_analysis: extractColorInfo(primaryAnalysis.text)
    };

    // Comprehensive content analysis
    const contentAnalysis = {
      primary_description: primaryAnalysis.text.substring(0, 500),
      detailed_analysis: primaryAnalysis.text,
      objects_detected: extractObjects(detailedAnalysis?.objectAnalysis || primaryAnalysis.text),
      scenes_identified: extractScenes(detailedAnalysis?.sceneAnalysis || primaryAnalysis.text),
      mood_assessment: extractMood(primaryAnalysis.text),
      style_analysis: extractStyle(primaryAnalysis.text),
      quality_assessment: detailedAnalysis?.qualityAssessment || extractQuality(primaryAnalysis.text),
      creative_potential: assessCreativePotential(primaryAnalysis.text, userQuery)
    };

    // Analyze alignment with user query
    const alignment = analyzeQueryAlignment(contentAnalysis, userQuery, asset.userDescription);

    // Determine processing needs
    const needs = determineProcessingNeeds(contentAnalysis, alignment, metadata);

    // Calculate confidence score
    const confidence = calculateImageConfidence(modelsUsed, fallbackUsed, contentAnalysis);

    return {
      metadata,
      contentAnalysis,
      alignment,
      needs,
      confidence,
      modelsUsed,
      fallbackUsed
    };

  } catch (error) {
    console.error(`[ImageAnalyzer] Analysis failed for ${asset.id}:`, error);
    
    // If all image analysis fails, return basic analysis instead of throwing error
    console.warn(`[ImageAnalyzer] Using emergency fallback analysis for ${asset.id}`);
    return createBasicImageAnalysis(asset.url, asset.metadata?.filename || 'image');
  }
}

/**
 * Analyze video assets using multiple Replicate models
 */
export async function analyzeVideoAsset(
  asset: AssetInput,
  userQuery: string,
  options: any
): Promise<{
  metadata: any;
  contentAnalysis: any;
  alignment: any;
  needs: any;
  confidence: number;
  modelsUsed: string[];
  fallbackUsed: boolean;
}> {
  const modelsUsed: string[] = [];
  let fallbackUsed = false;
  
  try {
    console.log(`[VideoAnalyzer] Starting comprehensive analysis for ${asset.id}`);
    
    let primaryAnalysis: any;
    let multimodalAnalysis: any;
    
    try {
      // Try primary model first (Apollo 7B)
      console.log(`[VideoAnalyzer] Trying primary model: Apollo 7B`);
      primaryAnalysis = await comprehensiveVideoAnalysisWithApollo7B(asset.url);
      modelsUsed.push('apollo-7b');
      
      // Use the primary analysis result - NO SECONDARY MODEL CALL
      multimodalAnalysis = {
        comprehensiveAnalysis: primaryAnalysis.comprehensiveAnalysis,
        audioAnalysis: primaryAnalysis.audioAnalysis || 'Audio analysis extracted from primary',
        visualAnalysis: primaryAnalysis.visualAnalysis || primaryAnalysis.comprehensiveAnalysis,
        textAnalysis: primaryAnalysis.textAnalysis || 'Text analysis extracted from primary',
        narrativeAnalysis: primaryAnalysis.narrativeAnalysis || extractNarrativeFromText(primaryAnalysis.comprehensiveAnalysis),
        qualityAssessment: primaryAnalysis.qualityAssessment || extractVideoQualityFromText(primaryAnalysis.comprehensiveAnalysis)
      };
      
      console.log(`[VideoAnalyzer] Primary model succeeded, using single result`);
      
    } catch (error) {
      console.warn(`[VideoAnalyzer] Primary model Apollo 7B failed, trying first fallback:`, error);
      fallbackUsed = true;
      
      // First fallback: Qwen 2.5 Omni
      try {
        multimodalAnalysis = await comprehensiveOmniVideoAnalysis(asset.url);
        modelsUsed.push('qwen2.5-omni-7b');
        
        primaryAnalysis = {
          comprehensiveAnalysis: multimodalAnalysis.comprehensiveAnalysis
        };
        console.log(`[VideoAnalyzer] First fallback Qwen 2.5 Omni succeeded`);
        
      } catch (omniError) {
        console.warn(`[VideoAnalyzer] Qwen Omni fallback failed, trying final fallback:`, omniError);
        
        // Check if it's a memory error and provide basic fallback
        if (omniError instanceof Error && omniError.message.includes('CUDA out of memory')) {
          console.warn(`[VideoAnalyzer] CUDA memory error detected, using basic fallback analysis`);
          return createBasicVideoAnalysis(asset.url, asset.metadata?.filename || 'video');
        }
        
        // Final fallback: Basic Apollo 7B call
        try {
          primaryAnalysis = await executeReplicateApollo7B({
            video: asset.url,
            prompt: 'Analyze this video comprehensively, describing all visual elements, actions, scenes, and overall content.',
            max_new_tokens: 1024
          });
          modelsUsed.push('apollo-7b-basic');
          
          multimodalAnalysis = {
            comprehensiveAnalysis: primaryAnalysis.text,
            audioAnalysis: 'Audio analysis unavailable in fallback mode',
            visualAnalysis: primaryAnalysis.text,
            textAnalysis: 'Text analysis unavailable in fallback mode',
            narrativeAnalysis: 'Narrative analysis unavailable in fallback mode',
            multimodalAnalysis: 'Multimodal analysis unavailable in fallback mode'
          };
          console.log(`[VideoAnalyzer] Final fallback Apollo 7B basic succeeded`);
          
        } catch (fallbackError) {
          console.error(`[VideoAnalyzer] All models failed for ${asset.id}:`, fallbackError);
          
          // If all models fail, return basic analysis instead of throwing error
          console.warn(`[VideoAnalyzer] Using emergency fallback analysis for ${asset.id}`);
          return createBasicVideoAnalysis(asset.url, asset.metadata?.filename || 'video');
        }
      }
    }

    // Extract metadata
    const metadata = {
      format: extractVideoFormat(asset.url),
      estimated_duration: extractDuration(primaryAnalysis.contentAnalysis || primaryAnalysis.text),
      quality_score: assessVideoQuality(primaryAnalysis.technicalAssessment || primaryAnalysis.text),
      has_audio: detectAudioPresence(multimodalAnalysis.audioAnalysis),
      scene_count: countScenes(primaryAnalysis.sceneBreakdown || primaryAnalysis.text)
    };

    // Comprehensive content analysis
    const contentAnalysis = {
      primary_description: (primaryAnalysis.contentAnalysis || primaryAnalysis.text).substring(0, 500),
      detailed_analysis: primaryAnalysis.contentAnalysis || primaryAnalysis.text,
      scenes_identified: extractVideoScenes(primaryAnalysis.sceneBreakdown || primaryAnalysis.text),
      objects_detected: extractVideoObjects(primaryAnalysis.objectInventory || primaryAnalysis.text),
      audio_content: multimodalAnalysis.audioAnalysis,
      text_content: multimodalAnalysis.textAnalysis,
      mood_assessment: extractVideoMood(primaryAnalysis.creativeEvaluation || primaryAnalysis.text),
      style_analysis: extractVideoStyle(primaryAnalysis.creativeEvaluation || primaryAnalysis.text),
      quality_assessment: primaryAnalysis.technicalAssessment || 'Quality assessment unavailable',
      creative_potential: assessVideoCreativePotential(multimodalAnalysis.multimodalAnalysis, userQuery)
    };

    // Analyze alignment with user query
    const alignment = analyzeQueryAlignment(contentAnalysis, userQuery, asset.userDescription);

    // Determine processing needs
    const needs = determineVideoProcessingNeeds(contentAnalysis, alignment, metadata);

    // Calculate confidence score
    const confidence = calculateVideoConfidence(modelsUsed, fallbackUsed, contentAnalysis);

    return {
      metadata,
      contentAnalysis,
      alignment,
      needs,
      confidence,
      modelsUsed,
      fallbackUsed
    };

  } catch (error) {
    console.error(`[VideoAnalyzer] Analysis failed for ${asset.id}:`, error);
    
    // If all video analysis fails, return basic analysis instead of throwing error
    console.warn(`[VideoAnalyzer] Using emergency fallback analysis for ${asset.id}`);
    return createBasicVideoAnalysis(asset.url, asset.metadata?.filename || 'video');
  }
}

/**
 * Analyze audio assets using Whisper and analysis
 */
export async function analyzeAudioAsset(
  asset: AssetInput,
  userQuery: string,
  options: any
): Promise<{
  metadata: any;
  contentAnalysis: any;
  alignment: any;
  needs: any;
  confidence: number;
  modelsUsed: string[];
  fallbackUsed: boolean;
}> {
  const modelsUsed: string[] = [];
  let fallbackUsed = false;
  
  try {
    console.log(`[AudioAnalyzer] Starting comprehensive analysis for ${asset.id}`);
    
    let comprehensiveAnalysis: any;
    
    try {
      // Comprehensive audio analysis with Whisper Large V3
      comprehensiveAnalysis = await comprehensiveAudioAnalysisWithWhisper(asset.url);
      modelsUsed.push('whisper-large-v3');
      
    } catch (error) {
      console.warn(`[AudioAnalyzer] Primary model failed, trying basic transcription:`, error);
      fallbackUsed = true;
      
      try {
        // Fallback to basic transcription only
        const basicTranscription = await executeReplicateWhisperLargeV3({
          audio: asset.url,
          transcription: 'plain_text'
        });
        modelsUsed.push('whisper-large-v3-basic');
        
        comprehensiveAnalysis = {
          transcription: basicTranscription.transcription,
          language: basicTranscription.language || 'unknown',
          summary: basicTranscription.transcription.substring(0, 200) + '...',
          keyPoints: [basicTranscription.transcription.substring(0, 100)],
          sentiment: 'unknown',
          topics: [],
          speakerCount: 1
        };
      } catch (fallbackError) {
        console.error(`[AudioAnalyzer] All models failed for ${asset.id}:`, fallbackError);
        throw new Error('All audio analysis models failed');
      }
    }

    // Extract metadata
    const metadata = {
      format: extractAudioFormat(asset.url),
      estimated_duration: estimateAudioDuration(comprehensiveAnalysis.transcription),
      language: comprehensiveAnalysis.language || 'unknown',
      speaker_count: comprehensiveAnalysis.speakerCount || 1,
      quality_score: assessAudioQuality(comprehensiveAnalysis.transcription)
    };

    // Comprehensive content analysis
    const contentAnalysis = {
      primary_description: comprehensiveAnalysis.summary || comprehensiveAnalysis.transcription.substring(0, 500),
      detailed_analysis: comprehensiveAnalysis.transcription,
      transcription: comprehensiveAnalysis.transcription,
      audio_content: comprehensiveAnalysis.summary,
      mood_assessment: comprehensiveAnalysis.sentiment || 'neutral',
      style_analysis: analyzeAudioStyle(comprehensiveAnalysis),
      quality_assessment: `Language: ${comprehensiveAnalysis.language}, Speakers: ${comprehensiveAnalysis.speakerCount}`,
      technical_notes: comprehensiveAnalysis.keyPoints || [],
      creative_potential: assessAudioCreativePotential(comprehensiveAnalysis, userQuery)
    };

    // Analyze alignment with user query
    const alignment = analyzeQueryAlignment(contentAnalysis, userQuery, asset.userDescription);

    // Determine processing needs
    const needs = determineAudioProcessingNeeds(contentAnalysis, alignment, metadata);

    // Calculate confidence score
    const confidence = calculateAudioConfidence(modelsUsed, fallbackUsed, comprehensiveAnalysis);

    return {
      metadata,
      contentAnalysis,
      alignment,
      needs,
      confidence,
      modelsUsed,
      fallbackUsed
    };

  } catch (error) {
    console.error(`[AudioAnalyzer] Analysis failed for ${asset.id}:`, error);
    
    // If all audio analysis fails, return basic analysis instead of throwing error
    console.warn(`[AudioAnalyzer] Using emergency fallback analysis for ${asset.id}`);
    return createBasicAudioAnalysis(asset.url, asset.metadata?.filename || 'audio');
  }
}

// Helper functions for content extraction and analysis
function extractImageFormat(url: string): string {
  const extension = url.split('.').pop()?.toLowerCase();
  return extension || 'unknown';
}

function extractVideoFormat(url: string): string {
  const extension = url.split('.').pop()?.toLowerCase();
  return extension || 'unknown';
}

function extractAudioFormat(url: string): string {
  const extension = url.split('.').pop()?.toLowerCase();
  return extension || 'unknown';
}

function assessImageQuality(description: string): number {
  const qualityIndicators = ['high quality', 'clear', 'sharp', 'detailed', 'professional'];
  const negativeIndicators = ['blurry', 'low quality', 'pixelated', 'grainy', 'poor'];
  
  let score = 5; // Base score
  
  qualityIndicators.forEach(indicator => {
    if (description.toLowerCase().includes(indicator)) score += 1;
  });
  
  negativeIndicators.forEach(indicator => {
    if (description.toLowerCase().includes(indicator)) score -= 1;
  });
  
  return Math.max(1, Math.min(10, score));
}

function assessVideoQuality(description: string): number {
  const qualityIndicators = ['high definition', 'clear', 'smooth', 'professional', 'well-lit'];
  const negativeIndicators = ['low quality', 'shaky', 'dark', 'blurry', 'poor audio'];
  
  let score = 5; // Base score
  
  qualityIndicators.forEach(indicator => {
    if (description.toLowerCase().includes(indicator)) score += 1;
  });
  
  negativeIndicators.forEach(indicator => {
    if (description.toLowerCase().includes(indicator)) score -= 1;
  });
  
  return Math.max(1, Math.min(10, score));
}

function assessAudioQuality(transcription: string): number {
  if (!transcription || transcription.length < 10) return 2;
  if (transcription.length > 1000) return 8;
  if (transcription.length > 500) return 7;
  if (transcription.length > 100) return 6;
  return 5;
}

function extractObjects(text: string): string[] {
  // Simple object extraction - in production, use more sophisticated NLP
  const commonObjects = ['person', 'people', 'car', 'house', 'tree', 'building', 'animal', 'food', 'clothing', 'furniture'];
  return commonObjects.filter(obj => text.toLowerCase().includes(obj));
}

function extractScenes(text: string): string[] {
  // Simple scene extraction
  const scenes = text.split(/[.!?]+/).filter(s => s.trim().length > 20).slice(0, 5);
  return scenes.map(s => s.trim());
}

function extractVideoScenes(text: string): string[] {
  return extractScenes(text);
}

function extractVideoObjects(text: string): string[] {
  return extractObjects(text);
}

function extractMood(text: string): string {
  const moodWords = {
    happy: ['happy', 'joyful', 'cheerful', 'bright', 'positive'],
    sad: ['sad', 'melancholy', 'dark', 'gloomy', 'depressing'],
    calm: ['calm', 'peaceful', 'serene', 'tranquil', 'relaxed'],
    energetic: ['energetic', 'dynamic', 'vibrant', 'lively', 'exciting']
  };
  
  for (const [mood, words] of Object.entries(moodWords)) {
    if (words.some(word => text.toLowerCase().includes(word))) {
      return mood;
    }
  }
  
  return 'neutral';
}

function extractVideoMood(text: string): string {
  return extractMood(text);
}

function extractStyle(text: string): string {
  const styles = ['modern', 'vintage', 'minimalist', 'artistic', 'professional', 'casual', 'formal'];
  const foundStyle = styles.find(style => text.toLowerCase().includes(style));
  return foundStyle || 'unknown';
}

function extractVideoStyle(text: string): string {
  return extractStyle(text);
}

function analyzeAudioStyle(analysis: any): string {
  if (analysis.topics?.includes('music')) return 'musical';
  if (analysis.topics?.includes('speech')) return 'spoken';
  if (analysis.speakerCount > 1) return 'conversational';
  return 'monologue';
}

function analyzeQueryAlignment(contentAnalysis: any, userQuery: string, userDescription?: string): any {
  const queryLower = userQuery.toLowerCase();
  const descriptionLower = (userDescription || '').toLowerCase();
  const contentLower = contentAnalysis.detailed_analysis.toLowerCase();
  
  // Simple keyword matching for alignment
  const queryWords = queryLower.split(' ').filter(w => w.length > 3);
  const matches = queryWords.filter(word => contentLower.includes(word)).length;
  const alignmentScore = Math.min(1, matches / Math.max(1, queryWords.length));
  
  const supportsQueryIntent = alignmentScore > 0.3;
  
  let role: 'primary_content' | 'reference_material' | 'supporting_element' | 'background' | 'enhancement_target' | 'unclear';
  
  if (alignmentScore > 0.7) {
    role = 'primary_content';
  } else if (alignmentScore > 0.4) {
    role = 'supporting_element';
  } else if (alignmentScore > 0.2) {
    role = 'reference_material';
  } else {
    role = 'unclear';
  }
  
  return {
    supports_query_intent: supportsQueryIntent,
    alignment_score: alignmentScore,
    role_in_project: role,
    usage_recommendations: generateUsageRecommendations(role, contentAnalysis),
    conflicts_or_issues: [],
    enhancement_suggestions: generateEnhancementSuggestions(contentAnalysis)
  };
}

function generateUsageRecommendations(role: string, contentAnalysis: any): string[] {
  const recommendations = [];
  
  switch (role) {
    case 'primary_content':
      recommendations.push('Use as main visual element');
      recommendations.push('Consider for hero placement');
      break;
    case 'supporting_element':
      recommendations.push('Use as supporting visual');
      recommendations.push('Good for background or secondary placement');
      break;
    case 'reference_material':
      recommendations.push('Use for style reference');
      recommendations.push('Consider for mood board');
      break;
    default:
      recommendations.push('Requires further analysis');
      recommendations.push('Consider alternative usage');
  }
  
  return recommendations;
}

function generateEnhancementSuggestions(contentAnalysis: any): string[] {
  const suggestions = [];
  
  if (contentAnalysis.quality_assessment?.includes('low')) {
    suggestions.push('Quality enhancement recommended');
  }
  
  if (contentAnalysis.mood_assessment === 'dark') {
    suggestions.push('Consider brightness adjustment');
  }
  
  if (contentAnalysis.style_analysis === 'unknown') {
    suggestions.push('Style enhancement may be needed');
  }
  
  return suggestions;
}

function determineProcessingNeeds(contentAnalysis: any, alignment: any, metadata: any): any {
  const needs = {
    requires_upscaling: metadata.quality_score < 6,
    requires_enhancement: contentAnalysis.quality_assessment?.includes('low') || false,
    requires_background_removal: false,
    requires_style_transfer: alignment.alignment_score < 0.5,
    requires_format_conversion: false,
    requires_trimming: false,
    requires_noise_reduction: false,
    requires_voice_cloning: false,
    priority_level: alignment.alignment_score > 0.7 ? 'high' : alignment.alignment_score > 0.4 ? 'medium' : 'low',
    estimated_processing_time: '2-5 minutes',
    recommended_tools: ['standard_enhancement']
  };
  
  return needs as any;
}

function determineVideoProcessingNeeds(contentAnalysis: any, alignment: any, metadata: any): any {
  const needs = determineProcessingNeeds(contentAnalysis, alignment, metadata);
  
  // Video-specific needs
  if (metadata.has_audio === false) {
    needs.requires_voice_cloning = true;
    needs.recommended_tools.push('audio_generation');
  }
  
  if (metadata.quality_score < 5) {
    needs.requires_upscaling = true;
    needs.recommended_tools.push('video_upscaling');
  }
  
  return needs;
}

function determineAudioProcessingNeeds(contentAnalysis: any, alignment: any, metadata: any): any {
  const needs = determineProcessingNeeds(contentAnalysis, alignment, metadata);
  
  // Audio-specific needs
  if (metadata.quality_score < 5) {
    needs.requires_noise_reduction = true;
    needs.recommended_tools.push('audio_cleanup');
  }
  
  if (contentAnalysis.transcription.length < 50) {
    needs.requires_enhancement = true;
    needs.recommended_tools.push('content_expansion');
  }
  
  return needs;
}

function calculateImageConfidence(modelsUsed: string[], fallbackUsed: boolean, contentAnalysis: any): number {
  let confidence = 0.8;
  
  if (fallbackUsed) confidence -= 0.2;
  if (modelsUsed.length > 1) confidence += 0.1;
  if (contentAnalysis.detailed_analysis.length > 500) confidence += 0.1;
  
  return Math.max(0.1, Math.min(1.0, confidence));
}

function calculateVideoConfidence(modelsUsed: string[], fallbackUsed: boolean, contentAnalysis: any): number {
  return calculateImageConfidence(modelsUsed, fallbackUsed, contentAnalysis);
}

function calculateAudioConfidence(modelsUsed: string[], fallbackUsed: boolean, analysis: any): number {
  let confidence = 0.8;
  
  if (fallbackUsed) confidence -= 0.2;
  if (analysis.language !== 'unknown') confidence += 0.1;
  if (analysis.transcription.length > 100) confidence += 0.1;
  
  return Math.max(0.1, Math.min(1.0, confidence));
}

// Additional helper functions
function extractDimensions(text: string): any {
  // Simple dimension extraction - would be more sophisticated in production
  return { width: 1920, height: 1080 }; // Default assumption
}

function extractColorInfo(text: string): any {
  const colors = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'orange', 'purple'];
  const foundColors = colors.filter(color => text.toLowerCase().includes(color));
  return { dominant_colors: foundColors };
}

function extractQuality(text: string): string {
  if (text.toLowerCase().includes('high quality')) return 'High quality content';
  if (text.toLowerCase().includes('low quality')) return 'Low quality content';
  return 'Standard quality content';
}

function assessCreativePotential(text: string, userQuery: string): string {
  if (userQuery.toLowerCase().includes('creative') || userQuery.toLowerCase().includes('artistic')) {
    return 'High creative potential for artistic projects';
  }
  return 'Good potential for standard content creation';
}

function assessVideoCreativePotential(text: string, userQuery: string): string {
  return assessCreativePotential(text, userQuery);
}

function assessAudioCreativePotential(analysis: any, userQuery: string): string {
  if (analysis.sentiment === 'positive') return 'Good potential for uplifting content';
  if (analysis.topics?.length > 0) return 'Good potential for topical content';
  return 'Standard creative potential';
}

function extractDuration(text: string): number {
  // Simple duration extraction - would parse actual duration in production
  return 30; // Default assumption in seconds
}

function detectAudioPresence(audioAnalysis: string): boolean {
  return audioAnalysis !== 'Audio analysis unavailable in fallback mode';
}

function countScenes(sceneText: string): number {
  return sceneText.split(/scene|sequence|segment/i).length - 1 || 1;
}

function estimateAudioDuration(transcription: string): number {
  // Rough estimate: ~150 words per minute for speech
  const wordCount = transcription.split(' ').length;
  return Math.max(10, (wordCount / 150) * 60);
}

// Additional helper functions for optimized single-model analysis
function extractObjectsFromText(text: string): string[] {
  const objects: string[] = [];
  if (!text || typeof text !== 'string') {
    return objects;
  }
  const lowerText = text.toLowerCase();
  
  // Common object detection keywords
  const objectKeywords = ['person', 'people', 'man', 'woman', 'child', 'car', 'building', 'tree', 'sky', 'water', 'animal', 'dog', 'cat', 'house', 'road', 'sign', 'text', 'food', 'furniture', 'computer', 'phone'];
  
  objectKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      objects.push(keyword);
    }
  });
  
  return objects.slice(0, 10); // Limit to 10 objects
}

function extractQualityFromText(text: string): string {
  if (!text || typeof text !== 'string') {
    return 'standard';
  }
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('high quality') || lowerText.includes('excellent') || lowerText.includes('professional')) {
    return 'high';
  } else if (lowerText.includes('good quality') || lowerText.includes('clear')) {
    return 'good';
  } else if (lowerText.includes('low quality') || lowerText.includes('blurry') || lowerText.includes('poor')) {
    return 'low';
  }
  
  return 'medium';
}

function extractStyleFromText(text: string): string {
  if (!text || typeof text !== 'string') {
    return 'unknown';
  }
  const lowerText = text.toLowerCase();
  
  const styles = ['modern', 'vintage', 'minimalist', 'abstract', 'realistic', 'artistic', 'professional', 'casual', 'dramatic', 'bright', 'dark'];
  
  for (const style of styles) {
    if (lowerText.includes(style)) {
      return style;
    }
  }
  
  return 'general';
}

function extractMoodFromText(text: string): string {
  if (!text || typeof text !== 'string') {
    return 'neutral';
  }
  const lowerText = text.toLowerCase();
  
  const moods = ['happy', 'sad', 'energetic', 'calm', 'mysterious', 'bright', 'dark', 'serious', 'playful', 'elegant', 'dramatic'];
  
  for (const mood of moods) {
    if (lowerText.includes(mood)) {
      return mood;
    }
  }
  
  return 'neutral';
}

// Basic fallback analysis functions for when all models fail
function createBasicImageAnalysis(url: string, filename: string): any {
  console.log(`[ImageAnalyzer] Creating basic fallback analysis for ${filename}`);
  
  return {
    asset_id: `image_${Date.now()}`,
    asset_type: 'image',
    asset_url: url,
    metadata: {
      filename: filename,
      file_size: 0,
      mime_type: 'image/jpeg',
      dimensions: null,
      quality_score: 5
    },
    content_analysis: {
      primary_description: `Image file: ${filename}. Basic analysis - unable to process due to model limitations.`,
      objects_detected: [],
      style_analysis: 'unknown',
      mood_assessment: 'neutral',
      scenes_identified: [],
      quality_assessment: 'Standard quality content',
      creative_potential: 'Standard creative potential'
    },
    processing_recommendations: {
      recommended_tools: ['basic_processing'],
      processing_priority: 'low',
      estimated_processing_time: '2 minutes'
    },
    alignment_with_query: {
      alignment_score: 0.5,
      role_in_project: 'supporting_material',
      specific_contributions: ['Basic image content'],
      recommended_usage: 'Use as supporting material with manual review'
    },
    confidence: 0.3,
    modelsUsed: ['basic_fallback'],
    fallbackUsed: true
  };
}

function createBasicAudioAnalysis(url: string, filename: string): any {
  console.log(`[AudioAnalyzer] Creating basic fallback analysis for ${filename}`);
  
  return {
    asset_id: `audio_${Date.now()}`,
    asset_type: 'audio',
    asset_url: url,
    metadata: {
      filename: filename,
      file_size: 0,
      mime_type: 'audio/mpeg',
      duration_seconds: null,
      sample_rate: null,
      channels: null,
      quality_score: 5
    },
    content_analysis: {
      primary_description: `Audio file: ${filename}. Basic analysis - unable to process due to model limitations.`,
      transcript: null,
      detected_language: null,
      detected_tone: null,
      mood_assessment: 'neutral',
      quality_assessment: 'Standard quality content'
    },
    processing_recommendations: {
      recommended_tools: ['basic_processing'],
      processing_priority: 'low',
      estimated_processing_time: '3 minutes'
    },
    alignment_with_query: {
      alignment_score: 0.5,
      role_in_project: 'supporting_material',
      specific_contributions: ['Basic audio content'],
      recommended_usage: 'Use as supporting material with manual review'
    },
    confidence: 0.3,
    modelsUsed: ['basic_fallback'],
    fallbackUsed: true
  };
}

function createBasicVideoAnalysis(url: string, filename: string): any {
  console.log(`[VideoAnalyzer] Creating basic fallback analysis for ${filename}`);
  
  return {
    asset_id: `video_${Date.now()}`,
    asset_type: 'video',
    asset_url: url,
    metadata: {
      filename: filename,
      file_size: 0,
      mime_type: 'video/mp4',
      duration_seconds: null,
      dimensions: null,
      fps: null,
      bitrate: null,
      has_audio: false,
      quality_score: 5
    },
    content_analysis: {
      primary_description: `Video file: ${filename}. Basic analysis - unable to process due to model limitations.`,
      objects_detected: [],
      style_analysis: 'unknown',
      mood_assessment: 'neutral',
      scenes_detected: [],
      motion_type: 'unknown',
      transcript: null,
      detected_language: null,
      detected_tone: null
    },
    processing_recommendations: {
      recommended_tools: ['basic_processing'],
      processing_priority: 'low',
      estimated_processing_time: '5 minutes'
    },
    alignment_with_query: {
      alignment_score: 0.5,
      role_in_project: 'supporting_material',
      specific_contributions: ['Basic video content'],
      recommended_usage: 'Use as supporting material with manual review'
    }
  };
}

function extractNarrativeFromText(text: string): string {
  // Extract narrative structure from comprehensive analysis
  if (!text || typeof text !== 'string') {
    return 'No narrative structure detected';
  }
  const sentences = text.split('.').filter(s => s.trim().length > 10);
  
  if (sentences.length > 3) {
    return `Narrative structure: ${sentences.slice(0, 3).join('. ')}.`;
  }
  
  return text.substring(0, 200) + '...';
}

function extractVideoQualityFromText(text: string): string {
  if (!text || typeof text !== 'string') {
    return 'standard';
  }
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('4k') || lowerText.includes('ultra hd') || lowerText.includes('high resolution')) {
    return 'excellent';
  } else if (lowerText.includes('hd') || lowerText.includes('1080p') || lowerText.includes('clear')) {
    return 'good';
  } else if (lowerText.includes('blurry') || lowerText.includes('low quality') || lowerText.includes('pixelated')) {
    return 'poor';
  }
  
  return 'standard';
}
