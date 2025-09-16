/**
 * Step 4: JSON Summarizer Utility Functions
 * 
 * Utility functions for mapping, formatting, and calculating values
 * used in the final JSON output creation.
 */

/**
 * Quality and format mapping functions
 */
export function deriveQualityLevel(technicalSpecs?: string[]): 'draft' | 'standard' | 'high' | 'professional' | 'cinema' | undefined {
  if (!technicalSpecs || technicalSpecs.length === 0) return undefined;
  
  const specs = technicalSpecs.join(' ').toLowerCase();
  if (specs.includes('cinema') || specs.includes('4k') || specs.includes('professional')) return 'cinema';
  if (specs.includes('high') || specs.includes('hd') || specs.includes('1080p')) return 'high';
  if (specs.includes('standard') || specs.includes('720p')) return 'standard';
  if (specs.includes('draft') || specs.includes('low')) return 'draft';
  return 'standard';
}

export function extractBrandRequirements(prompt: string): string | undefined {
  const brandKeywords = ['brand', 'logo', 'company', 'business', 'corporate'];
  const lowerPrompt = prompt.toLowerCase();
  
  if (brandKeywords.some(keyword => lowerPrompt.includes(keyword))) {
    return 'Brand consistency and professional presentation required';
  }
  return undefined;
}

export function derivePlatformConstraints(platform?: string | string[]): Record<string, any> | undefined {
  if (!platform) return undefined;
  
  // Handle array of platforms - use the first one for constraints
  const platformStr = Array.isArray(platform) ? platform[0] : platform;
  if (!platformStr || typeof platformStr !== 'string') return undefined;
  
  switch (platformStr.toLowerCase()) {
    case 'instagram':
      return { max_duration: 60, aspect_ratios: ['1:1', '9:16'], formats: ['mp4', 'jpg'] };
    case 'youtube':
      return { max_duration: 3600, aspect_ratios: ['16:9'], formats: ['mp4'] };
    case 'tiktok':
      return { max_duration: 180, aspect_ratios: ['9:16'], formats: ['mp4'] };
    case 'twitter':
      return { max_duration: 140, aspect_ratios: ['16:9', '1:1'], formats: ['mp4', 'gif'] };
    default:
      return { formats: ['mp4', 'jpg', 'png'] };
  }
}

export function deriveUrgencyLevel(timeline?: string): 'low' | 'medium' | 'high' | 'urgent' | undefined {
  if (!timeline) return undefined;
  
  const lowerTimeline = timeline.toLowerCase();
  if (lowerTimeline.includes('urgent') || lowerTimeline.includes('asap') || lowerTimeline.includes('immediate')) return 'urgent';
  if (lowerTimeline.includes('soon') || lowerTimeline.includes('quick') || lowerTimeline.includes('fast')) return 'high';
  if (lowerTimeline.includes('standard') || lowerTimeline.includes('normal')) return 'medium';
  return 'low';
}

export function estimateProjectTimeline(pipeline: any[]): string {
  if (!pipeline || pipeline.length === 0) return 'Unknown';
  
  // Calculate total estimated time
  let totalMinutes = 0;
  for (const step of pipeline) {
    const timeMatch = step.estimated_time?.match(/(\d+)(?:-(\d+))?\s*minutes?/);
    if (timeMatch) {
      const minTime = parseInt(timeMatch[1]);
      const maxTime = timeMatch[2] ? parseInt(timeMatch[2]) : minTime;
      totalMinutes += (minTime + maxTime) / 2;
    }
  }
  
  if (totalMinutes === 0) return 'Variable';
  
  if (totalMinutes < 60) return `${Math.round(totalMinutes)} minutes`;
  if (totalMinutes < 1440) return `${Math.round(totalMinutes / 60)} hours`;
  return `${Math.round(totalMinutes / 1440)} days`;
}

/**
 * Gap analysis utility functions
 */
export function mapGapTypeToCategory(gapKey: string): 'content' | 'style' | 'technical' | 'platform' | 'timeline' {
  if (gapKey.includes('style') || gapKey.includes('mood') || gapKey.includes('theme')) return 'style';
  if (gapKey.includes('resolution') || gapKey.includes('format') || gapKey.includes('duration')) return 'technical';
  if (gapKey.includes('platform') || gapKey.includes('target')) return 'platform';
  if (gapKey.includes('timeline') || gapKey.includes('deadline')) return 'timeline';
  return 'content';
}

export function generateGapDescription(gapKey: string): string {
  const descriptions: Record<string, string> = {
    missing_style: 'No specific style direction provided',
    missing_mood: 'Emotional tone and mood not specified',
    missing_resolution: 'Output resolution not specified',
    missing_duration: 'Content duration not specified',
    missing_format: 'Output format not specified',
    missing_platform: 'Target platform not specified',
    missing_target_audience: 'Target audience not defined'
  };
  
  return descriptions[gapKey] || `Missing ${gapKey.replace('missing_', '').replace('_', ' ')}`;
}

export function assessGapImpact(gapKey: string): 'low' | 'medium' | 'high' | 'critical' {
  const criticalGaps = ['missing_content', 'missing_primary_asset'];
  const highGaps = ['missing_resolution', 'missing_duration', 'missing_format'];
  const mediumGaps = ['missing_style', 'missing_mood', 'missing_platform'];
  
  if (criticalGaps.includes(gapKey)) return 'critical';
  if (highGaps.includes(gapKey)) return 'high';
  if (mediumGaps.includes(gapKey)) return 'medium';
  return 'low';
}

export function generateDefaultSuggestion(gapKey: string, outputType: string): string {
  const suggestions: Record<string, string> = {
    missing_style: 'Apply modern, clean visual style appropriate for content type',
    missing_mood: 'Use professional, engaging tone suitable for target audience',
    missing_resolution: outputType === 'video' ? 'Use 1920x1080 (Full HD)' : 'Use 1024x1024 for images',
    missing_duration: 'Use 30 seconds for social media, 60 seconds for general content',
    missing_format: outputType === 'video' ? 'Use MP4 format' : 'Use PNG/JPEG formats',
    missing_platform: 'Optimize for web and social media platforms',
    missing_target_audience: 'Target general audience with broad appeal'
  };
  
  return suggestions[gapKey] || `Use platform-appropriate defaults for ${gapKey.replace('missing_', '')}`;
}

/**
 * Formatting utility functions
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

/**
 * Asset mapping functions
 */
export function mapProcessingStatus(status?: string): 'success' | 'partial' | 'failed' {
  if (status === 'success') return 'success';
  if (status === 'failed') return 'failed';
  return 'partial';
}

export function mapQualityScore(score?: number): 'poor' | 'fair' | 'good' | 'excellent' | 'professional' | undefined {
  if (!score) return undefined;
  if (score >= 9) return 'professional';
  if (score >= 7) return 'excellent';
  if (score >= 5) return 'good';
  if (score >= 3) return 'fair';
  return 'poor';
}

export function mapQualityTarget(target: string): 'acceptable' | 'good' | 'excellent' | 'professional' | 'cinematic' {
  const mapping: Record<string, any> = {
    'standard': 'acceptable',
    'good': 'good',
    'high': 'excellent',
    'professional': 'professional',
    'cinema': 'cinematic'
  };
  return mapping[target] || 'good';
}

export function mapCreativeQualityTarget(target: string): 'functional' | 'appealing' | 'impressive' | 'exceptional' | 'award_worthy' {
  const mapping: Record<string, any> = {
    'functional': 'functional',
    'appealing': 'appealing',
    'impressive': 'impressive',
    'exceptional': 'exceptional'
  };
  return mapping[target] || 'appealing';
}

export function mapConsistencyTarget(target: string): 'basic' | 'good' | 'high' | 'perfect' {
  const mapping: Record<string, any> = {
    'basic': 'basic',
    'good': 'good',
    'high': 'high',
    'perfect': 'perfect'
  };
  return mapping[target] || 'good';
}

export function mapPolishTarget(target: string): 'draft' | 'refined' | 'polished' | 'premium' | 'luxury' {
  const mapping: Record<string, any> = {
    'draft': 'draft',
    'refined': 'refined',
    'polished': 'polished',
    'premium': 'premium'
  };
  return mapping[target] || 'refined';
}

/**
 * Pipeline mapping functions
 */
export function mapStepCategory(stepName: string): 'preparation' | 'enhancement' | 'creation' | 'integration' | 'finalization' {
  const name = stepName.toLowerCase();
  if (name.includes('enhance') || name.includes('improve') || name.includes('optimize')) return 'enhancement';
  if (name.includes('create') || name.includes('generate') || name.includes('produce')) return 'creation';
  if (name.includes('integrate') || name.includes('combine') || name.includes('merge')) return 'integration';
  if (name.includes('final') || name.includes('polish') || name.includes('finish')) return 'finalization';
  return 'preparation';
}

export function mapToolType(tool: string): 'ai_model' | 'processing_tool' | 'creative_software' | 'api_service' {
  const toolLower = tool.toLowerCase();
  if (toolLower.includes('model') || toolLower.includes('ai') || toolLower.includes('llm')) return 'ai_model';
  if (toolLower.includes('api') || toolLower.includes('service') || toolLower.includes('cloud')) return 'api_service';
  if (toolLower.includes('editor') || toolLower.includes('studio') || toolLower.includes('creative')) return 'creative_software';
  return 'processing_tool';
}

export function generateToolPurpose(tool: string, stepName: string): string {
  const purposes: Record<string, string> = {
    'upscaling': 'Enhance image resolution and quality',
    'enhancement': 'Improve overall asset quality',
    'video_editor': 'Edit and compose video content',
    'audio_editor': 'Process and enhance audio content',
    'image_editor': 'Edit and enhance image content',
    'compositing': 'Combine multiple visual elements',
    'color_correction': 'Adjust colors and visual tone'
  };
  
  return purposes[tool] || `Support ${stepName} process`;
}

export function generateToolAlternatives(tool: string): string[] {
  const alternatives: Record<string, string[]> = {
    'upscaling': ['Real-ESRGAN', 'ESRGAN', 'Waifu2x'],
    'video_editor': ['FFmpeg', 'Adobe Premiere', 'DaVinci Resolve'],
    'audio_editor': ['Audacity', 'Adobe Audition', 'Logic Pro'],
    'image_editor': ['GIMP', 'Adobe Photoshop', 'Canva'],
    'compositing': ['After Effects', 'Blender', 'Nuke']
  };
  
  return alternatives[tool] || [];
}

export function mapComplexityLevel(level: string): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
  const mapping: Record<string, any> = {
    'easy': 'beginner',
    'moderate': 'intermediate',
    'complex': 'advanced',
    'expert': 'expert'
  };
  return mapping[level] || 'intermediate';
}

export function mapImplementationEffort(effort: string): 'minimal' | 'low' | 'moderate' | 'high' | 'extensive' {
  const mapping: Record<string, any> = {
    'minimal': 'minimal',
    'low': 'low',
    'moderate': 'moderate',
    'significant': 'high',
    'major': 'extensive'
  };
  return mapping[effort] || 'moderate';
}

/**
 * Calculation functions
 */
export function calculateStepSuccessProbability(step: any, understanding: any): number {
  let probability = 0.8;
  
  // Adjust based on complexity
  if (step.complexity_level === 'expert') probability -= 0.2;
  else if (step.complexity_level === 'complex') probability -= 0.1;
  
  // Adjust based on dependencies
  if (step.dependencies && step.dependencies.length > 0) probability -= 0.05;
  
  return Math.max(0.3, Math.min(1.0, probability));
}

export function derivePriorityLevel(
  optimizationType: string, 
  optimizationFocus: string
): 'optional' | 'recommended' | 'important' | 'critical' {
  if (optimizationType === optimizationFocus) return 'important';
  if (optimizationFocus === 'balanced') return 'recommended';
  if (optimizationType === 'quality') return 'recommended';
  return 'optional';
}

export function calculateTechnicalFeasibility(understanding: any): number {
  let feasibility = 0.8;
  
  // Reduce for technical gaps
  const technicalGaps = understanding.gap_analysis.identified_gaps.filter((g: any) => g.gap_type === 'technical').length;
  feasibility -= technicalGaps * 0.1;
  
  // Adjust for complexity
  if (understanding.synthesis_metadata.complexity_assessment === 'highly_complex') feasibility -= 0.2;
  else if (understanding.synthesis_metadata.complexity_assessment === 'complex') feasibility -= 0.1;
  
  return Math.max(0.1, Math.min(1.0, feasibility));
}

export function calculateCreativeFeasibility(understanding: any): number {
  let feasibility = understanding.synthesis_metadata.synthesis_confidence;
  
  // Adjust for creative contradictions
  const creativeContradictions = understanding.gap_analysis.contradictions.filter((c: any) => 
    c.contradiction_type === 'intent_vs_assets'
  ).length;
  feasibility -= creativeContradictions * 0.15;
  
  return Math.max(0.1, Math.min(1.0, feasibility));
}

export function calculateResourceAdequacy(understanding: any): number {
  const primaryAssets = understanding.asset_utilization.primary_assets.length;
  const totalAssets = primaryAssets + 
                     understanding.asset_utilization.reference_assets.length +
                     understanding.asset_utilization.supporting_assets.length +
                     understanding.asset_utilization.unused_assets.length;
                     
  if (totalAssets === 0) return 0.3;
  
  const utilizationRate = primaryAssets / totalAssets;
  return Math.max(0.1, Math.min(1.0, utilizationRate + 0.2));
}

export function calculateSuccessProbability(
  completenessScore: number,
  alignmentScore: number,
  gaps: any[]
): number {
  let probability = (completenessScore + alignmentScore) / 2;
  
  // Reduce for critical gaps
  const criticalGaps = gaps.filter(g => g.impact_level === 'critical').length;
  probability -= criticalGaps * 0.2;
  
  // Reduce for high impact gaps
  const highGaps = gaps.filter(g => g.impact_level === 'high').length;
  probability -= highGaps * 0.1;
  
  return Math.max(0.1, Math.min(1.0, probability));
}
