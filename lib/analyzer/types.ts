/**
 * DreamCut Analyzer Database Types
 * 
 * TypeScript types for the analyzer JSON schema mapping to Supabase tables.
 * These types match the database schema exactly for type safety.
 */

// ========================================
// MAIN QUERY TYPES
// ========================================

export interface AnalyzerQuery {
  id: string;
  user_id: string;
  
  // User Request Data
  original_prompt: string;
  intent: 'image' | 'video' | 'audio' | 'mixed';
  duration_seconds?: number;
  aspect_ratio?: string;
  platform?: string;
  image_count?: number;
  
  // Prompt Analysis
  user_intent_description?: string;
  reformulated_prompt?: string;
  clarity_score?: number; // 1-10
  suggested_improvements?: string[];
  
  // Content Type Analysis
  needs_explanation?: boolean;
  needs_charts?: boolean;
  needs_diagrams?: boolean;
  needs_educational_content?: boolean;
  content_complexity?: 'simple' | 'moderate' | 'complex';
  requires_visual_aids?: boolean;
  is_instructional?: boolean;
  needs_data_visualization?: boolean;
  requires_interactive_elements?: boolean;
  content_category?: string;
  
  // Global Analysis
  goal?: string;
  constraints?: Record<string, any>;
  asset_roles?: Record<string, any>;
  conflicts?: string[];
  
  // Creative Direction
  core_concept?: string;
  visual_approach?: string;
  style_direction?: string;
  mood_atmosphere?: string;
  
  // Production Pipeline
  workflow_steps?: string[];
  estimated_time?: string;
  success_probability?: number; // 0-1
  quality_targets?: Record<string, any>;
  
  // Quality Metrics
  overall_confidence?: number; // 0-1
  analysis_quality?: number; // 1-10
  completion_status?: 'complete' | 'partial' | 'failed';
  feasibility_score?: number; // 0-1
  
  // Processing metadata
  processing_time_ms?: number;
  models_used?: string[];
  cost_estimate?: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

// ========================================
// ASSET TYPES
// ========================================

export interface AnalyzerAsset {
  id: string;
  query_id: string;
  
  // Asset identification
  asset_id: string; // e.g., "ast_ima01"
  type: 'image' | 'video' | 'audio';
  
  // Asset details
  user_description?: string;
  ai_caption?: string;
  objects_detected?: string[];
  style?: string;
  mood?: string;
  quality_score?: number; // 0-1
  role?: string;
  recommended_edits?: string[];
  
  // File metadata
  file_url?: string;
  file_size_bytes?: number;
  file_format?: string;
  resolution?: string;
  duration_seconds?: number;
  
  // Analysis metadata
  analysis_confidence?: number; // 0-1
  processing_time_ms?: number;
  model_used?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  analyzed_at?: string;
}

// ========================================
// CREATIVE OPTIONS TYPES
// ========================================

export interface CreativeOption {
  id: string;
  query_id: string;
  
  // Option details
  option_id: string; // e.g., "opt_modern"
  title: string;
  short_description?: string;
  reasons?: string[];
  estimated_workload?: 'low' | 'medium' | 'high';
  
  // Selection tracking
  is_selected?: boolean;
  selection_reason?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// ========================================
// CHALLENGES TYPES
// ========================================

export interface Challenge {
  id: string;
  query_id: string;
  
  // Challenge details
  type: string; // e.g., "quality", "technical", "creative"
  description: string;
  impact?: 'low' | 'moderate' | 'high' | 'critical';
  
  // Resolution tracking
  is_resolved?: boolean;
  resolution_notes?: string;
  resolved_at?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// ========================================
// RECOMMENDATIONS TYPES
// ========================================

export interface Recommendation {
  id: string;
  query_id: string;
  
  // Recommendation details
  type: string; // e.g., "quality", "creative", "technical"
  recommendation: string;
  priority?: 'low' | 'medium' | 'high' | 'critical' | 'recommended';
  
  // Implementation tracking
  is_implemented?: boolean;
  implementation_notes?: string;
  implemented_at?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// ========================================
// COMPLETE ANALYZER RESULT TYPES
// ========================================

export interface CompleteAnalyzerResult {
  user_request: {
    original_prompt: string;
    intent: 'image' | 'video' | 'audio' | 'mixed';
    duration_seconds?: number;
    aspect_ratio?: string;
    platform?: string;
    image_count?: number;
  };
  prompt_analysis: {
    user_intent_description?: string;
    reformulated_prompt?: string;
    clarity_score?: number;
    suggested_improvements?: string[];
    content_type_analysis: {
      needs_explanation?: boolean;
      needs_charts?: boolean;
      needs_diagrams?: boolean;
      needs_educational_content?: boolean;
      content_complexity?: 'simple' | 'moderate' | 'complex';
      requires_visual_aids?: boolean;
      is_instructional?: boolean;
      needs_data_visualization?: boolean;
      requires_interactive_elements?: boolean;
      content_category?: string;
    };
  };
  assets: Array<{
    id: string;
    type: 'image' | 'video' | 'audio';
    user_description?: string;
    ai_caption?: string;
    objects_detected?: string[];
    style?: string;
    mood?: string;
    quality_score?: number;
    role?: string;
    recommended_edits?: string[];
  }>;
  global_analysis: {
    goal?: string;
    constraints?: Record<string, any>;
    asset_roles?: Record<string, any>;
    conflicts?: string[];
  };
  creative_options: Array<{
    id: string;
    title: string;
    short?: string;
    reasons?: string[];
    estimatedWorkload?: 'low' | 'medium' | 'high';
    is_selected?: boolean;
  }>;
  creative_direction: {
    core_concept?: string;
    visual_approach?: string;
    style_direction?: string;
    mood_atmosphere?: string;
  };
  production_pipeline: {
    workflow_steps?: string[];
    estimated_time?: string;
    success_probability?: number;
    quality_targets?: Record<string, any>;
  };
  quality_metrics: {
    overall_confidence?: number;
    analysis_quality?: number;
    completion_status?: 'complete' | 'partial' | 'failed';
    feasibility_score?: number;
  };
  challenges: Array<{
    type: string;
    description: string;
    impact?: 'low' | 'moderate' | 'high' | 'critical';
    is_resolved?: boolean;
  }>;
  recommendations: Array<{
    type: string;
    recommendation: string;
    priority?: 'low' | 'medium' | 'high' | 'critical' | 'recommended';
    is_implemented?: boolean;
  }>;
  processing_time_ms?: number;
  models_used?: string[];
  cost_estimate?: number;
  created_at: string;
  updated_at: string;
}

// ========================================
// DATABASE OPERATION TYPES
// ========================================

export interface AnalyzerQueryFilters {
  user_id?: string;
  intent?: 'image' | 'video' | 'audio' | 'mixed';
  completion_status?: 'complete' | 'partial' | 'failed';
  created_after?: string;
  created_before?: string;
  limit?: number;
  offset?: number;
}

export interface AnalyzerQueryResult {
  success: boolean;
  query?: AnalyzerQuery;
  assets?: AnalyzerAsset[];
  creative_options?: CreativeOption[];
  challenges?: Challenge[];
  recommendations?: Recommendation[];
  error?: string;
}

export interface AnalyzerQueriesResult {
  success: boolean;
  queries?: AnalyzerQuery[];
  total?: number;
  error?: string;
}

// ========================================
// REALTIME SUBSCRIPTION TYPES
// ========================================

export interface AnalyzerRealtimeCallbacks {
  onQueryUpdate?: (query: AnalyzerQuery) => void;
  onAssetUpdate?: (asset: AnalyzerAsset) => void;
  onCreativeOptionUpdate?: (option: CreativeOption) => void;
  onChallengeUpdate?: (challenge: Challenge) => void;
  onRecommendationUpdate?: (recommendation: Recommendation) => void;
  onError?: (error: any) => void;
}

// ========================================
// INSERT/UPDATE TYPES
// ========================================

export interface InsertAnalyzerQueryData {
  user_id: string;
  original_prompt: string;
  intent: 'image' | 'video' | 'audio' | 'mixed';
  duration_seconds?: number;
  aspect_ratio?: string;
  platform?: string;
  image_count?: number;
  user_intent_description?: string;
  reformulated_prompt?: string;
  clarity_score?: number;
  suggested_improvements?: string[];
  needs_explanation?: boolean;
  needs_charts?: boolean;
  needs_diagrams?: boolean;
  needs_educational_content?: boolean;
  content_complexity?: 'simple' | 'moderate' | 'complex';
  requires_visual_aids?: boolean;
  is_instructional?: boolean;
  needs_data_visualization?: boolean;
  requires_interactive_elements?: boolean;
  content_category?: string;
  goal?: string;
  constraints?: Record<string, any>;
  asset_roles?: Record<string, any>;
  conflicts?: string[];
  core_concept?: string;
  visual_approach?: string;
  style_direction?: string;
  mood_atmosphere?: string;
  workflow_steps?: string[];
  estimated_time?: string;
  success_probability?: number;
  quality_targets?: Record<string, any>;
  overall_confidence?: number;
  analysis_quality?: number;
  completion_status?: 'complete' | 'partial' | 'failed';
  feasibility_score?: number;
  processing_time_ms?: number;
  models_used?: string[];
  cost_estimate?: number;
}

export interface InsertAnalyzerAssetData {
  query_id: string;
  asset_id: string;
  type: 'image' | 'video' | 'audio';
  user_description?: string;
  ai_caption?: string;
  objects_detected?: string[];
  style?: string;
  mood?: string;
  quality_score?: number;
  role?: string;
  recommended_edits?: string[];
  file_url?: string;
  file_size_bytes?: number;
  file_format?: string;
  resolution?: string;
  duration_seconds?: number;
  analysis_confidence?: number;
  processing_time_ms?: number;
  model_used?: string;
}

export interface InsertCreativeOptionData {
  query_id: string;
  option_id: string;
  title: string;
  short_description?: string;
  reasons?: string[];
  estimated_workload?: 'low' | 'medium' | 'high';
  is_selected?: boolean;
  selection_reason?: string;
}

export interface InsertChallengeData {
  query_id: string;
  type: string;
  description: string;
  impact?: 'low' | 'moderate' | 'high' | 'critical';
  is_resolved?: boolean;
  resolution_notes?: string;
}

export interface InsertRecommendationData {
  query_id: string;
  type: string;
  recommendation: string;
  priority?: 'low' | 'medium' | 'high' | 'critical' | 'recommended';
  is_implemented?: boolean;
  implementation_notes?: string;
}
