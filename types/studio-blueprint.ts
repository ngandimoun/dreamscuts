/**
 * 🎬 Studio Blueprint Types - Phase 3
 * 
 * TypeScript interfaces for the Studio Blueprint system.
 * This represents the human-readable creative plan before manifest serialization.
 */

export type UUID = string;
export type ISODate = string;

// ========================================
// 1. CORE STUDIO BLUEPRINT INTERFACE
// ========================================

export interface StudioBlueprint {
  id?: UUID; // server-generated
  createdAt?: ISODate;
  userId: UUID | null;
  
  // Source References
  sourceRefs: {
    analyzerRef?: string;
    refinerRef?: string;
    scriptRef?: string;
  };
  
  // Blueprint Content
  projectTitle: string;
  overview: ProjectOverview;
  scenes: SceneBlueprint[];
  audioArc: AudioArc;
  consistencyRules: ConsistencyRules;
  
  // Processing Metadata
  status: 'draft' | 'generated' | 'reviewed' | 'approved' | 'rejected';
  qualityScore?: number;
  processingTimeMs?: number;
  warnings?: string[];
  
  // Human Review
  humanReview?: HumanReview;
}

// ========================================
// 2. PROJECT OVERVIEW
// ========================================

export interface ProjectOverview {
  intent: 'video' | 'image' | 'audio';
  duration: number; // seconds
  aspectRatio: string; // "16:9", "9:16", "1:1", etc.
  platform: string; // "YouTube", "TikTok", "LinkedIn", etc.
  language: string; // "English", "Spanish", etc.
  tone: string; // "Inspirational", "Informative", "Professional", etc.
  
  // Additional Context
  targetAudience?: string;
  brandGuidelines?: string;
  specialRequirements?: string[];
}

// ========================================
// 3. SCENE BLUEPRINT
// ========================================

export interface SceneBlueprint {
  id: string; // "scene_1", "scene_2", etc.
  purpose: 'hook' | 'body' | 'cta' | 'transition' | string;
  duration: number; // seconds
  
  // Narration
  narration: string; // exact text for TTS
  voice: VoiceConfig;
  
  // Visuals
  visuals: VisualElement[];
  
  // Effects
  effects: string[]; // ["cinematic_zoom", "fade_in", "pan", etc.]
  
  // Music
  music: MusicCue;
  
  // Additional Notes
  notes?: string;
}

// ========================================
// 4. VOICE CONFIGURATION
// ========================================

export interface VoiceConfig {
  provider: 'elevenlabs' | 'openai' | 'azure' | 'custom';
  voiceId?: string;
  style: string; // "Friendly Female", "Confident Male", etc.
  characteristics: {
    tone?: string;
    pace?: string;
    energy?: string;
    accent?: string;
  };
}

// ========================================
// 5. VISUAL ELEMENTS
// ========================================

export interface VisualElement {
  type: 'user_asset' | 'ai_generated' | 'stock' | 'chart' | 'text_overlay' | 'background';
  description: string; // Human-readable description
  assetId?: string; // Reference to actual asset if available
  positioning?: {
    layer: number; // 1 = background, 2 = main, 3 = overlay
    position?: 'center' | 'left' | 'right' | 'top' | 'bottom';
    size?: 'full' | 'half' | 'quarter' | 'custom';
  };
  timing?: {
    startAtSec?: number;
    durationSec?: number;
  };
}

// ========================================
// 6. MUSIC CUE
// ========================================

export interface MusicCue {
  style: string; // "neutral", "uplift", "resolve", etc.
  intensity: 'low' | 'medium' | 'high';
  description: string; // "light marimba/piano bed", "uplifting motivational", etc.
  timing?: {
    startAtSec?: number;
    durationSec?: number;
  };
}

// ========================================
// 7. AUDIO ARC
// ========================================

export interface AudioArc {
  intro: AudioSegment;
  build: AudioSegment;
  outro: AudioSegment;
  soundEffects: SoundEffect[];
}

export interface AudioSegment {
  description: string;
  style: string;
  intensity: 'low' | 'medium' | 'high';
  duration?: number;
}

export interface SoundEffect {
  name: string; // "whoosh", "ui_tick", "approval_chime", etc.
  timing: string; // "at scene 1 transition", "on KPI highlight", etc.
  description?: string;
}

// ========================================
// 8. CONSISTENCY RULES
// ========================================

export interface ConsistencyRules {
  faces: string; // "locked", "consistent", "varied", etc.
  voice: string; // "single ElevenLabs config", "consistent across all steps", etc.
  typography: string; // "Modern sans-serif", "corporate style", etc.
  colorPalette: string[]; // ["#0F172A", "#3B82F6", "#FFFFFF"]
  branding: string; // "End-card with logo placement", "safe margins enforced", etc.
  
  // Additional Rules
  visualStyle?: string;
  animationStyle?: string;
  transitionStyle?: string;
  qualityStandards?: string[];
}

// ========================================
// 9. HUMAN REVIEW
// ========================================

export interface HumanReview {
  reviewedBy?: string; // user ID or name
  reviewedAt?: ISODate;
  status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  feedback?: string;
  suggestedChanges?: string[];
  approvedScenes?: string[]; // scene IDs that are approved
  rejectedScenes?: string[]; // scene IDs that need revision
}

// ========================================
// 10. INPUT DATA FOR BLUEPRINT GENERATION
// ========================================

export interface BlueprintGenerationInput {
  // User Input
  userIntent: string;
  userAssets: UserAsset[];
  
  // Analysis Results
  analyzerOutput?: any;
  refinerOutput?: any;
  scriptOutput?: any;
  
  // Constraints
  constraints: {
    duration?: number;
    language?: string;
    aspectRatio?: string;
    platform?: string;
    tone?: string;
  };
  
  // Generation Options
  options?: {
    creativeLevel?: 'basic' | 'professional' | 'cinematic';
    includeMusicArc?: boolean;
    includeConsistencyRules?: boolean;
    maxScenes?: number;
  };
}

export interface UserAsset {
  id: string;
  type: 'image' | 'video' | 'audio' | 'text';
  description: string;
  url?: string;
  metadata?: Record<string, any>;
}

// ========================================
// 11. API RESPONSE TYPES
// ========================================

export interface CreateBlueprintRequest {
  userId: string;
  input: BlueprintGenerationInput;
  options?: {
    model?: 'gpt-5' | 'claude-3.5-sonnet' | 'gpt-4o';
    temperature?: number;
    maxTokens?: number;
  };
}

export interface CreateBlueprintResponse {
  success: boolean;
  data?: StudioBlueprint;
  error?: string;
  processingTimeMs?: number;
  warnings?: string[];
}

export interface GetBlueprintResponse {
  success: boolean;
  data?: StudioBlueprint;
  error?: string;
}

export interface UpdateBlueprintRequest {
  id: string;
  updates: Partial<StudioBlueprint>;
}

export interface UpdateBlueprintResponse {
  success: boolean;
  data?: StudioBlueprint;
  error?: string;
}

// ========================================
// 12. BLUEPRINT VALIDATION
// ========================================

export interface BlueprintValidationResult {
  valid: boolean;
  errors: BlueprintValidationError[];
  warnings: string[];
  qualityScore: number;
}

export interface BlueprintValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  suggestion?: string;
}

// ========================================
// 13. BLUEPRINT CONVERSION TO MANIFEST
// ========================================

export interface BlueprintToManifestMapping {
  blueprintId: string;
  manifestId?: string;
  conversionStatus: 'pending' | 'in_progress' | 'completed' | 'failed';
  mappingRules: {
    narrationToTTS: boolean;
    visualsToAssets: boolean;
    musicToAudio: boolean;
    effectsToJobs: boolean;
  };
  conversionErrors?: string[];
  convertedAt?: ISODate;
}
