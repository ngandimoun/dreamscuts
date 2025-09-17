/**
 * 🎨 DreamCut Creative Profiles Layer
 * 
 * Transforms Dreamcut from functional to brilliant by automatically detecting
 * intent and context, then activating specialized creative profiles that inject
 * style, structure, asset needs, pacing, and editing conventions.
 */

import { RefinerOutput } from './refiner-schema';

// Profile detection criteria
export interface ProfileDetectionCriteria {
  keywords: string[];
  contentCategories: string[];
  intents: string[];
  assetTypes: string[];
  platforms: string[];
  durationRanges?: { min?: number; max?: number };
  qualityThresholds?: { min?: number; max?: number };
}

// Creative profile definition
export interface CreativeProfile {
  id: string;
  name: string;
  description: string;
  goal: string;
  detectionCriteria: ProfileDetectionCriteria;
  defaults: {
    creativeDirection: Partial<RefinerOutput['creative_direction']>;
    productionPipeline: Partial<RefinerOutput['production_pipeline']>;
    recommendations: Partial<RefinerOutput['recommendations'][0]>[];
    assetRequirements: string[];
    styleGuidelines: string[];
  };
  pipeline: {
    requiredAssets: string[];
    editingConventions: string[];
    transitions: string[];
    effects: string[];
    audioStyle: string;
    textOverlays: string[];
  };
  priority: number; // Higher number = higher priority
}

// 1. Educational Explainer Profile
export const EDUCATIONAL_EXPLAINER_PROFILE: CreativeProfile = {
  id: 'educational_explainer',
  name: 'Educational Explainer',
  description: 'Clarity + learning impact for educational content',
  goal: 'Create clear, educational content that maximizes learning impact',
  detectionCriteria: {
    keywords: ['explain', 'teach', 'learn', 'tutorial', 'how to', 'guide', 'education', 'course', 'lesson'],
    contentCategories: ['educational', 'tutorial', 'how-to', 'academic'],
    intents: ['image', 'video', 'mixed'],
    assetTypes: ['image', 'video', 'audio'],
    platforms: ['youtube', 'linkedin', 'educational'],
    durationRanges: { min: 30, max: 600 }
  },
  defaults: {
    creativeDirection: {
      core_concept: 'Create clear, educational content that maximizes learning impact and retention',
      visual_approach: 'Use clean, professional visuals with clear typography and supporting graphics',
      style_direction: 'Minimalist, professional, and accessible with high contrast and readable fonts',
      mood_atmosphere: 'Authoritative, trustworthy, and engaging with a focus on clarity'
    },
    productionPipeline: {
      workflow_steps: [
        'Generate supporting visuals (charts/diagrams if missing)',
        'Create clear narration script',
        'Add educational overlays and bullet points',
        'Implement simple transitions (fade/cut)',
        'Generate subtitles for accessibility'
      ],
      quality_targets: {
        technical_quality_target: 'high',
        creative_quality_target: 'professional',
        consistency_target: 'excellent',
        polish_level_target: 'refined'
      }
    },
    recommendations: [
      { type: 'audio', recommendation: 'Add clear TTS voiceover narration for accessibility', priority: 'required' },
      { type: 'visual', recommendation: 'Include charts, diagrams, and bullet overlays for clarity', priority: 'required' },
      { type: 'accessibility', recommendation: 'Generate subtitles for all spoken content', priority: 'required' },
      { type: 'style', recommendation: 'Use neutral but professional visual styling', priority: 'recommended' }
    ],
    assetRequirements: ['narration_audio', 'supporting_graphics', 'subtitles'],
    styleGuidelines: ['Clean typography', 'High contrast', 'Professional color scheme', 'Clear visual hierarchy']
  },
  pipeline: {
    requiredAssets: ['TTS voiceover', 'Educational graphics', 'Subtitles'],
    editingConventions: ['Simple cuts', 'Fade transitions', 'Clear pacing'],
    transitions: ['fade', 'cut', 'dissolve'],
    effects: ['Text overlays', 'Bullet points', 'Highlighting'],
    audioStyle: 'Clear, professional narration',
    textOverlays: ['Educational captions', 'Key points', 'Step numbers']
  },
  priority: 90
};

// 2. Anime Mode Profile
export const ANIME_MODE_PROFILE: CreativeProfile = {
  id: 'anime_mode',
  name: 'Anime Mode',
  description: 'High-energy, stylized anime content',
  goal: 'Create dynamic, stylized content with anime aesthetics and high energy',
  detectionCriteria: {
    keywords: ['anime', 'manga', 'japanese', 'kawaii', 'otaku', 'weeb', 'chibi', 'shounen', 'shoujo'],
    contentCategories: ['anime', 'manga', 'japanese_culture', 'gaming'],
    intents: ['image', 'video', 'mixed'],
    assetTypes: ['image', 'video', 'audio'],
    platforms: ['tiktok', 'instagram', 'youtube'],
    durationRanges: { min: 15, max: 180 }
  },
  defaults: {
    creativeDirection: {
      core_concept: 'Create high-energy, stylized content with anime aesthetics and dynamic visual effects',
      visual_approach: 'Apply anime art style with vibrant colors, dynamic compositions, and stylized effects',
      style_direction: 'Anime-inspired with bold colors, dynamic lines, and stylized character designs',
      mood_atmosphere: 'Energetic, exciting, and visually striking with anime-style intensity'
    },
    productionPipeline: {
      workflow_steps: [
        'Convert main characters into anime art style',
        'Add anime-style background music (J-Pop/EDM)',
        'Implement dynamic effects (speed lines, manga panels)',
        'Create chibi cutaways and reaction shots',
        'Style subtitles like fansubs with karaoke sync'
      ],
      quality_targets: {
        technical_quality_target: 'high',
        creative_quality_target: 'stylized',
        consistency_target: 'good',
        polish_level_target: 'polished'
      }
    },
    recommendations: [
      { type: 'style', recommendation: 'Convert all visual elements to anime art style', priority: 'required' },
      { type: 'audio', recommendation: 'Use fast-paced J-Pop or EDM background music', priority: 'required' },
      { type: 'effects', recommendation: 'Add speed lines, manga panels, and chibi cutaways', priority: 'recommended' },
      { type: 'text', recommendation: 'Style subtitles like fansubs with colored karaoke sync', priority: 'recommended' }
    ],
    assetRequirements: ['anime_style_assets', 'jpop_music', 'anime_effects'],
    styleGuidelines: ['Bold colors', 'Dynamic compositions', 'Anime character style', 'High energy pacing']
  },
  pipeline: {
    requiredAssets: ['Anime-style visuals', 'J-Pop/EDM music', 'Anime effects'],
    editingConventions: ['Fast cuts', 'Dynamic transitions', 'Effect-heavy'],
    transitions: ['speed_lines', 'manga_panels', 'dynamic_cuts'],
    effects: ['Speed lines', 'Manga panels', 'Chibi cutaways', 'Karaoke subtitles'],
    audioStyle: 'Fast-paced J-Pop/EDM',
    textOverlays: ['Fansub-style subtitles', 'Anime captions', 'Karaoke text']
  },
  priority: 85
};

// 3. UGC/Influencer Profile
export const UGC_INFLUENCER_PROFILE: CreativeProfile = {
  id: 'ugc_influencer',
  name: 'UGC/Influencer',
  description: 'Casual, authentic user-generated content style',
  goal: 'Create casual, authentic content that feels personal and relatable',
  detectionCriteria: {
    keywords: ['selfie', 'vlog', 'day in my life', 'get ready with me', 'haul', 'review', 'influencer', 'lifestyle'],
    contentCategories: ['lifestyle', 'beauty', 'fashion', 'vlog', 'personal'],
    intents: ['image', 'video', 'mixed'],
    assetTypes: ['image', 'video', 'audio'],
    platforms: ['tiktok', 'instagram', 'youtube_shorts'],
    durationRanges: { min: 15, max: 60 }
  },
  defaults: {
    creativeDirection: {
      core_concept: 'Create casual, authentic content that feels personal and relatable to viewers',
      visual_approach: 'Use handheld/selfie-style framing with natural lighting and casual composition',
      style_direction: 'Casual, authentic, and trendy with a personal touch and social media aesthetic',
      mood_atmosphere: 'Friendly, approachable, and authentic with a personal connection'
    },
    productionPipeline: {
      workflow_steps: [
        'Apply handheld/selfie-style framing',
        'Add light, trendy background music',
        'Create bold social-style captions',
        'Implement jump cuts for energy',
        'Add on-screen text stickers and emojis'
      ],
      quality_targets: {
        technical_quality_target: 'medium',
        creative_quality_target: 'authentic',
        consistency_target: 'good',
        polish_level_target: 'casual'
      }
    },
    recommendations: [
      { type: 'style', recommendation: 'Use handheld/selfie-style framing for authenticity', priority: 'required' },
      { type: 'audio', recommendation: 'Add light, trendy background music', priority: 'recommended' },
      { type: 'text', recommendation: 'Create bold social-style captions and stickers', priority: 'recommended' },
      { type: 'editing', recommendation: 'Keep jump cuts and emphasize personality', priority: 'recommended' }
    ],
    assetRequirements: ['casual_audio', 'social_stickers', 'trendy_music'],
    styleGuidelines: ['Natural lighting', 'Casual composition', 'Personal touch', 'Social media aesthetic']
  },
  pipeline: {
    requiredAssets: ['Casual audio', 'Social stickers', 'Trendy music'],
    editingConventions: ['Jump cuts', 'Handheld style', 'Casual pacing'],
    transitions: ['jump_cut', 'quick_cut', 'natural'],
    effects: ['Text stickers', 'Emoji overlays', 'Social captions'],
    audioStyle: 'Light, trendy background music',
    textOverlays: ['Bold social captions', 'Stickers', 'Emojis', 'Hashtags']
  },
  priority: 80
};

// 4. Bloomberg-Style Finance Explainer Profile
export const FINANCE_EXPLAINER_PROFILE: CreativeProfile = {
  id: 'finance_explainer',
  name: 'Bloomberg-Style Finance Explainer',
  description: 'Data-driven, trust-building financial content',
  goal: 'Create authoritative, data-driven financial content that builds trust and credibility',
  detectionCriteria: {
    keywords: ['finance', 'stock', 'market', 'investment', 'trading', 'economy', 'business', 'bloomberg', 'financial'],
    contentCategories: ['finance', 'business', 'investment', 'economics'],
    intents: ['image', 'video', 'mixed'],
    assetTypes: ['image', 'video', 'audio'],
    platforms: ['linkedin', 'youtube', 'professional'],
    durationRanges: { min: 60, max: 300 }
  },
  defaults: {
    creativeDirection: {
      core_concept: 'Create authoritative, data-driven financial content that builds trust and demonstrates expertise',
      visual_approach: 'Use corporate clean look with professional charts, tickers, and data visualizations',
      style_direction: 'Professional, clean, and authoritative with corporate branding and data focus',
      mood_atmosphere: 'Serious, trustworthy, and professional with emphasis on credibility'
    },
    productionPipeline: {
      workflow_steps: [
        'Generate professional stock charts and financial data',
        'Create infographic cutaways and data visualizations',
        'Add professional narration with authoritative tone',
        'Implement lower-thirds and ticker overlays',
        'Apply serious, professional background music'
      ],
      quality_targets: {
        technical_quality_target: 'professional',
        creative_quality_target: 'authoritative',
        consistency_target: 'excellent',
        polish_level_target: 'broadcast_quality'
      }
    },
    recommendations: [
      { type: 'visual', recommendation: 'Generate stock charts, infographic cutaways, and data visualizations', priority: 'required' },
      { type: 'audio', recommendation: 'Add professional narration with authoritative tone', priority: 'required' },
      { type: 'overlay', recommendation: 'Include lower-thirds, tickers, and clean graphs', priority: 'required' },
      { type: 'style', recommendation: 'Maintain corporate clean look throughout', priority: 'required' }
    ],
    assetRequirements: ['professional_narration', 'financial_charts', 'corporate_graphics'],
    styleGuidelines: ['Corporate colors', 'Clean typography', 'Data visualization', 'Professional layout']
  },
  pipeline: {
    requiredAssets: ['Professional narration', 'Financial charts', 'Corporate graphics'],
    editingConventions: ['Clean cuts', 'Professional pacing', 'Data focus'],
    transitions: ['fade', 'cut', 'professional'],
    effects: ['Lower-thirds', 'Tickers', 'Data overlays'],
    audioStyle: 'Serious, professional background music',
    textOverlays: ['Financial data', 'Stock tickers', 'Professional captions']
  },
  priority: 95
};

// 5. Presentation/Corporate Deck Video Profile
export const PRESENTATION_CORPORATE_PROFILE: CreativeProfile = {
  id: 'presentation_corporate',
  name: 'Presentation/Corporate Deck Video',
  description: 'Transform slides into dynamic presentation videos',
  goal: 'Convert static slides into engaging, dynamic presentation videos',
  detectionCriteria: {
    keywords: ['presentation', 'slides', 'corporate', 'deck', 'pitch', 'meeting', 'business', 'proposal'],
    contentCategories: ['business', 'corporate', 'presentation', 'professional'],
    intents: ['image', 'video', 'mixed'],
    assetTypes: ['image', 'video', 'audio'],
    platforms: ['linkedin', 'youtube', 'corporate'],
    durationRanges: { min: 60, max: 600 }
  },
  defaults: {
    creativeDirection: {
      core_concept: 'Transform static slides into dynamic, engaging presentation videos with professional polish',
      visual_approach: 'Create slide-like scenes with smooth transitions and professional animations',
      style_direction: 'Minimalist, branded, and professional with clean design and corporate identity',
      mood_atmosphere: 'Professional, confident, and engaging with a focus on clarity and impact'
    },
    productionPipeline: {
      workflow_steps: [
        'Create slide-like scenes with professional layout',
        'Add smooth transitions between slides',
        'Overlay charts, logos, and bullet points',
        'Generate professional voiceover narration',
        'Apply branded color scheme and typography'
      ],
      quality_targets: {
        technical_quality_target: 'professional',
        creative_quality_target: 'polished',
        consistency_target: 'excellent',
        polish_level_target: 'corporate_quality'
      }
    },
    recommendations: [
      { type: 'layout', recommendation: 'Create slide-like scenes with professional layout', priority: 'required' },
      { type: 'transitions', recommendation: 'Add smooth transitions between slides', priority: 'required' },
      { type: 'overlay', recommendation: 'Overlay charts, logos, and bullet points', priority: 'required' },
      { type: 'audio', recommendation: 'Generate professional voiceover narration', priority: 'required' }
    ],
    assetRequirements: ['professional_narration', 'corporate_graphics', 'branded_elements'],
    styleGuidelines: ['Corporate branding', 'Clean layout', 'Professional typography', 'Consistent design']
  },
  pipeline: {
    requiredAssets: ['Professional narration', 'Corporate graphics', 'Branded elements'],
    editingConventions: ['Smooth transitions', 'Professional pacing', 'Slide-based'],
    transitions: ['slide_transition', 'fade', 'professional'],
    effects: ['Chart overlays', 'Logo animations', 'Bullet points'],
    audioStyle: 'Professional voiceover narration',
    textOverlays: ['Slide titles', 'Bullet points', 'Corporate captions']
  },
  priority: 90
};

// 6. Pleasure/Relaxation Profile
export const PLEASURE_RELAXATION_PROFILE: CreativeProfile = {
  id: 'pleasure_relaxation',
  name: 'Pleasure/Relaxation',
  description: 'Mood-driven, immersive relaxation content',
  goal: 'Create calming, immersive content that promotes relaxation and positive mood',
  detectionCriteria: {
    keywords: ['relax', 'calm', 'peaceful', 'meditation', 'zen', 'spa', 'wellness', 'mindfulness', 'serene'],
    contentCategories: ['wellness', 'meditation', 'relaxation', 'lifestyle'],
    intents: ['image', 'video', 'mixed'],
    assetTypes: ['image', 'video', 'audio'],
    platforms: ['youtube', 'instagram', 'wellness'],
    durationRanges: { min: 60, max: 1800 }
  },
  defaults: {
    creativeDirection: {
      core_concept: 'Create calming, immersive content that promotes relaxation and positive emotional state',
      visual_approach: 'Use slow pacing with soft transitions and calming visuals like nature scenes',
      style_direction: 'Soft, warm, and calming with natural colors and gentle compositions',
      mood_atmosphere: 'Peaceful, serene, and soothing with emphasis on emotional well-being'
    },
    productionPipeline: {
      workflow_steps: [
        'Extend short clips into smooth loops',
        'Apply warm, calming color grading',
        'Add ambient background sound/music',
        'Use slow, gentle transitions',
        'Focus on nature and flow elements'
      ],
      quality_targets: {
        technical_quality_target: 'high',
        creative_quality_target: 'immersive',
        consistency_target: 'excellent',
        polish_level_target: 'cinematic'
      }
    },
    recommendations: [
      { type: 'pacing', recommendation: 'Use slow pacing with soft transitions', priority: 'required' },
      { type: 'audio', recommendation: 'Add ambient background sound/music', priority: 'required' },
      { type: 'visual', recommendation: 'Focus on calming visuals like nature and flow', priority: 'required' },
      { type: 'color', recommendation: 'Apply warm, calming color grading', priority: 'recommended' }
    ],
    assetRequirements: ['ambient_audio', 'nature_visuals', 'calming_music'],
    styleGuidelines: ['Warm colors', 'Soft lighting', 'Natural elements', 'Gentle motion']
  },
  pipeline: {
    requiredAssets: ['Ambient audio', 'Nature visuals', 'Calming music'],
    editingConventions: ['Slow pacing', 'Gentle transitions', 'Looping'],
    transitions: ['fade', 'dissolve', 'gentle'],
    effects: ['Color grading', 'Soft focus', 'Natural overlays'],
    audioStyle: 'Ambient, calming background music',
    textOverlays: ['Minimal text', 'Gentle captions', 'Wellness quotes']
  },
  priority: 75
};

// 7. Ads/Commercial Profile
export const ADS_COMMERCIAL_PROFILE: CreativeProfile = {
  id: 'ads_commercial',
  name: 'Ads/Commercial',
  description: 'Convert attention to action with commercial content',
  goal: 'Create compelling commercial content that drives action and conversion',
  detectionCriteria: {
    keywords: ['ad', 'commercial', 'promo', 'sale', 'buy', 'product', 'brand', 'marketing', 'campaign'],
    contentCategories: ['advertising', 'commercial', 'marketing', 'promotional'],
    intents: ['image', 'video', 'mixed'],
    assetTypes: ['image', 'video', 'audio'],
    platforms: ['facebook', 'instagram', 'youtube', 'tiktok'],
    durationRanges: { min: 15, max: 60 }
  },
  defaults: {
    creativeDirection: {
      core_concept: 'Create compelling commercial content that drives action and maximizes conversion',
      visual_approach: 'Use bold text overlays, fast cuts, and product-focused visuals',
      style_direction: 'Bold, energetic, and attention-grabbing with strong brand presence',
      mood_atmosphere: 'Exciting, persuasive, and action-oriented with urgency and appeal'
    },
    productionPipeline: {
      workflow_steps: [
        'Add bold text overlays and call-to-action elements',
        'Implement fast, energetic cuts',
        'Focus on product/brand highlights',
        'Add upbeat, energetic music',
        'Create compelling CTA screen at end'
      ],
      quality_targets: {
        technical_quality_target: 'high',
        creative_quality_target: 'compelling',
        consistency_target: 'good',
        polish_level_target: 'commercial_quality'
      }
    },
    recommendations: [
      { type: 'text', recommendation: 'Add bold text overlays and call-to-action elements', priority: 'required' },
      { type: 'editing', recommendation: 'Use fast cuts for energy and attention', priority: 'required' },
      { type: 'focus', recommendation: 'Focus on product/brand highlights', priority: 'required' },
      { type: 'audio', recommendation: 'Add upbeat, energetic music', priority: 'required' }
    ],
    assetRequirements: ['energetic_music', 'bold_graphics', 'cta_elements'],
    styleGuidelines: ['Bold typography', 'High contrast', 'Brand colors', 'Attention-grabbing']
  },
  pipeline: {
    requiredAssets: ['Energetic music', 'Bold graphics', 'CTA elements'],
    editingConventions: ['Fast cuts', 'Energetic pacing', 'Product focus'],
    transitions: ['quick_cut', 'dynamic', 'energetic'],
    effects: ['Bold text', 'Product highlights', 'CTA overlays'],
    audioStyle: 'Upbeat, energetic music',
    textOverlays: ['Bold headlines', 'Call-to-action', 'Product benefits', 'Pricing']
  },
  priority: 85
};

// 8. Demo Video/Product Showcase Profile
export const DEMO_PRODUCT_SHOWCASE_PROFILE: CreativeProfile = {
  id: 'demo_product_showcase',
  name: 'Demo Video/Product Showcase',
  description: 'Show functionality with step-by-step demonstrations',
  goal: 'Create clear, functional demonstrations that showcase product features and benefits',
  detectionCriteria: {
    keywords: ['demo', 'showcase', 'tutorial', 'how it works', 'features', 'product', 'app', 'software'],
    contentCategories: ['product', 'demo', 'tutorial', 'technology'],
    intents: ['image', 'video', 'mixed'],
    assetTypes: ['image', 'video', 'audio'],
    platforms: ['youtube', 'linkedin', 'product'],
    durationRanges: { min: 30, max: 300 }
  },
  defaults: {
    creativeDirection: {
      core_concept: 'Create clear, functional demonstrations that showcase product features and user benefits',
      visual_approach: 'Use screen capture style or clean mockups with step-by-step annotations',
      style_direction: 'Clean, professional, and functional with focus on clarity and usability',
      mood_atmosphere: 'Informative, confident, and helpful with emphasis on functionality'
    },
    productionPipeline: {
      workflow_steps: [
        'Create screen capture or clean product mockups',
        'Add step-by-step annotations and highlights',
        'Zoom in on key features and interactions',
        'Generate neutral, professional narration',
        'Highlight user interactions and benefits'
      ],
      quality_targets: {
        technical_quality_target: 'high',
        creative_quality_target: 'clear',
        consistency_target: 'excellent',
        polish_level_target: 'professional'
      }
    },
    recommendations: [
      { type: 'visual', recommendation: 'Use screen capture style or clean mockups', priority: 'required' },
      { type: 'annotation', recommendation: 'Add step-by-step annotations and highlights', priority: 'required' },
      { type: 'focus', recommendation: 'Zoom in on key features and interactions', priority: 'required' },
      { type: 'audio', recommendation: 'Generate neutral, professional narration', priority: 'recommended' }
    ],
    assetRequirements: ['professional_narration', 'product_graphics', 'annotation_elements'],
    styleGuidelines: ['Clean interface', 'Clear annotations', 'Professional layout', 'Functional focus']
  },
  pipeline: {
    requiredAssets: ['Professional narration', 'Product graphics', 'Annotation elements'],
    editingConventions: ['Step-by-step', 'Clear pacing', 'Feature focus'],
    transitions: ['cut', 'zoom', 'highlight'],
    effects: ['Feature highlights', 'Step annotations', 'Zoom effects'],
    audioStyle: 'Neutral, professional music',
    textOverlays: ['Step numbers', 'Feature labels', 'Instructions', 'Benefits']
  },
  priority: 80
};

// 9. Funny/Meme-Style Profile
export const FUNNY_MEME_STYLE_PROFILE: CreativeProfile = {
  id: 'funny_meme_style',
  name: 'Funny/Meme-Style',
  description: 'Maximize entertainment and virality with comedic content',
  goal: 'Create entertaining, viral-worthy content that maximizes engagement and shareability',
  detectionCriteria: {
    keywords: ['funny', 'meme', 'comedy', 'lol', 'haha', 'joke', 'hilarious', 'viral', 'trending'],
    contentCategories: ['comedy', 'entertainment', 'meme', 'viral'],
    intents: ['image', 'video', 'mixed'],
    assetTypes: ['image', 'video', 'audio'],
    platforms: ['tiktok', 'instagram', 'youtube_shorts'],
    durationRanges: { min: 15, max: 60 }
  },
  defaults: {
    creativeDirection: {
      core_concept: 'Create entertaining, viral-worthy content that maximizes engagement and comedic impact',
      visual_approach: 'Use fast, unexpected cuts with comedic timing and meme-style visuals',
      style_direction: 'Bold, energetic, and meme-inspired with Impact font and viral aesthetics',
      mood_atmosphere: 'Funny, energetic, and entertaining with emphasis on humor and shareability'
    },
    productionPipeline: {
      workflow_steps: [
        'Add reaction overlays (emoji, stickers)',
        'Implement zoom-punch effects and comedic timing',
        'Create meme captions with Impact font',
        'Add comedic sound effects and music',
        'Use fast, unexpected cuts for comedic effect'
      ],
      quality_targets: {
        technical_quality_target: 'medium',
        creative_quality_target: 'entertaining',
        consistency_target: 'good',
        polish_level_target: 'viral_quality'
      }
    },
    recommendations: [
      { type: 'effects', recommendation: 'Add reaction overlays (emoji, stickers)', priority: 'required' },
      { type: 'editing', recommendation: 'Use fast, unexpected cuts for comedic effect', priority: 'required' },
      { type: 'audio', recommendation: 'Add comedic sound effects and music', priority: 'required' },
      { type: 'text', recommendation: 'Create meme captions with Impact font', priority: 'recommended' }
    ],
    assetRequirements: ['comedic_audio', 'meme_graphics', 'reaction_overlays'],
    styleGuidelines: ['Bold colors', 'Impact font', 'High energy', 'Meme aesthetics']
  },
  pipeline: {
    requiredAssets: ['Comedic audio', 'Meme graphics', 'Reaction overlays'],
    editingConventions: ['Fast cuts', 'Comedic timing', 'Unexpected pacing'],
    transitions: ['quick_cut', 'zoom_punch', 'comedic'],
    effects: ['Reaction overlays', 'Zoom effects', 'Meme captions'],
    audioStyle: 'Comedic sound effects and music',
    textOverlays: ['Meme captions', 'Reaction text', 'Comedic labels', 'Viral hashtags']
  },
  priority: 70
};

// 10. Documentary/Storytelling Profile
export const DOCUMENTARY_STORYTELLING_PROFILE: CreativeProfile = {
  id: 'documentary_storytelling',
  name: 'Documentary/Storytelling',
  description: 'Narrative-driven, immersive storytelling content',
  goal: 'Create compelling, narrative-driven content that tells a story and engages viewers',
  detectionCriteria: {
    keywords: ['story', 'documentary', 'narrative', 'journey', 'experience', 'life', 'history', 'biography'],
    contentCategories: ['documentary', 'storytelling', 'narrative', 'educational'],
    intents: ['image', 'video', 'mixed'],
    assetTypes: ['image', 'video', 'audio'],
    platforms: ['youtube', 'netflix', 'documentary'],
    durationRanges: { min: 300, max: 3600 }
  },
  defaults: {
    creativeDirection: {
      core_concept: 'Create compelling, narrative-driven content that tells a story and engages viewers emotionally',
      visual_approach: 'Use archival/stock imagery mix with cinematic composition and professional pacing',
      style_direction: 'Cinematic, professional, and immersive with documentary aesthetics',
      mood_atmosphere: 'Engaging, informative, and emotionally resonant with narrative depth'
    },
    productionPipeline: {
      workflow_steps: [
        'Create scene chapters with narrative structure',
        'Add professional voiceover narration',
        'Implement cinematic transitions and fades',
        'Include lower-thirds with speaker names',
        'Apply cinematic score and ambient audio'
      ],
      quality_targets: {
        technical_quality_target: 'professional',
        creative_quality_target: 'cinematic',
        consistency_target: 'excellent',
        polish_level_target: 'broadcast_quality'
      }
    },
    recommendations: [
      { type: 'narrative', recommendation: 'Create scene chapters with narrative structure', priority: 'required' },
      { type: 'audio', recommendation: 'Add professional voiceover narration', priority: 'required' },
      { type: 'visual', recommendation: 'Use archival/stock imagery mix', priority: 'required' },
      { type: 'transitions', recommendation: 'Implement cinematic transitions and fades', priority: 'recommended' }
    ],
    assetRequirements: ['professional_narration', 'archival_footage', 'cinematic_audio'],
    styleGuidelines: ['Cinematic composition', 'Professional pacing', 'Narrative structure', 'Documentary aesthetics']
  },
  pipeline: {
    requiredAssets: ['Professional narration', 'Archival footage', 'Cinematic audio'],
    editingConventions: ['Cinematic pacing', 'Narrative structure', 'Professional transitions'],
    transitions: ['cinematic_fade', 'dissolve', 'professional'],
    effects: ['Lower-thirds', 'Scene transitions', 'Cinematic overlays'],
    audioStyle: 'Cinematic score and ambient audio',
    textOverlays: ['Speaker names', 'Chapter titles', 'Documentary captions', 'Timeline markers']
  },
  priority: 90
};

// Additional profiles (11-18) would be added here following the same pattern...

// Profile registry
export const CREATIVE_PROFILES: CreativeProfile[] = [
  EDUCATIONAL_EXPLAINER_PROFILE,
  ANIME_MODE_PROFILE,
  UGC_INFLUENCER_PROFILE,
  FINANCE_EXPLAINER_PROFILE,
  PRESENTATION_CORPORATE_PROFILE,
  PLEASURE_RELAXATION_PROFILE,
  ADS_COMMERCIAL_PROFILE,
  DEMO_PRODUCT_SHOWCASE_PROFILE,
  FUNNY_MEME_STYLE_PROFILE,
  DOCUMENTARY_STORYTELLING_PROFILE
];

// Enhanced profile detection result interface
export interface ProfileDetectionResult {
  profile: CreativeProfile | null;
  confidence: number;
  matchedFactors: string[];
  alternativeProfiles: Array<{
    profile: CreativeProfile;
    confidence: number;
    matchedFactors: string[];
  }>;
  detectionMethod: 'multi-factor' | 'fallback' | 'default';
}

/**
 * Enhanced creative profile detection with multi-factor analysis and fallbacks
 * 
 * This improved detection system:
 * 1. Uses multiple factors to determine the best profile match
 * 2. Provides confidence scores for each potential match
 * 3. Includes fallback mechanisms when primary detection is uncertain
 * 4. Analyzes asset content when available
 * 5. Returns alternative profiles for consideration
 * 
 * @param analyzerJson The analyzer input data
 * @returns ProfileDetectionResult with the best profile match and alternatives
 */
export function detectCreativeProfile(analyzerJson: any): CreativeProfile | null {
  // For backward compatibility, return just the profile
  const result = detectCreativeProfileEnhanced(analyzerJson);
  return result.profile;
}

/**
 * Enhanced creative profile detection with detailed results
 */
export function detectCreativeProfileEnhanced(analyzerJson: any): ProfileDetectionResult {
  // Extract all relevant data points for multi-factor analysis
  const prompt = analyzerJson.user_request?.original_prompt?.toLowerCase() || '';
  const intent = analyzerJson.user_request?.intent || '';
  const platform = analyzerJson.user_request?.platform?.toLowerCase() || '';
  const contentCategory = analyzerJson.prompt_analysis?.content_type_analysis?.content_category?.toLowerCase() || '';
  const assetTypes = analyzerJson.assets?.map((asset: any) => asset.type) || [];
  const duration = analyzerJson.user_request?.duration_seconds || 0;
  
  // NEW: Extract additional context for more robust detection
  const reformulatedPrompt = analyzerJson.prompt_analysis?.reformulated_prompt?.toLowerCase() || '';
  const suggestedImprovements = analyzerJson.prompt_analysis?.suggested_improvements || [];
  const assets = analyzerJson.assets || [];
  const contentComplexity = analyzerJson.prompt_analysis?.content_type_analysis?.content_complexity || 'simple';
  const needsExplanation = analyzerJson.prompt_analysis?.content_type_analysis?.needs_explanation || false;
  const needsCharts = analyzerJson.prompt_analysis?.content_type_analysis?.needs_charts || false;
  const needsDiagrams = analyzerJson.prompt_analysis?.content_type_analysis?.needs_diagrams || false;
  
  // Score each profile based on enhanced detection criteria
  const profileScores = CREATIVE_PROFILES.map(profile => {
    let score = 0;
    const matchedFactors: string[] = [];
    const criteria = profile.detectionCriteria;

    // Check keywords in original prompt (primary factor)
    const keywordMatches = criteria.keywords.filter(keyword => 
      prompt.includes(keyword.toLowerCase())
    );
    
    if (keywordMatches.length > 0) {
      score += keywordMatches.length * 10;
      matchedFactors.push(`keywords_primary: ${keywordMatches.join(', ')}`);
    }
    
    // NEW: Check keywords in reformulated prompt (secondary factor)
    const secondaryKeywordMatches = criteria.keywords.filter(keyword => 
      reformulatedPrompt.includes(keyword.toLowerCase()) && !keywordMatches.includes(keyword)
    );
    
    if (secondaryKeywordMatches.length > 0) {
      score += secondaryKeywordMatches.length * 5;
      matchedFactors.push(`keywords_secondary: ${secondaryKeywordMatches.join(', ')}`);
    }

    // Check content category (strong signal)
    if (criteria.contentCategories.includes(contentCategory)) {
      score += 20;
      matchedFactors.push(`content_category: ${contentCategory}`);
    }

    // Check intent (strong signal)
    if (criteria.intents.includes(intent)) {
      score += 15;
      matchedFactors.push(`intent: ${intent}`);
    }

    // Check platform (moderate signal)
    if (criteria.platforms.includes(platform)) {
      score += 10;
      matchedFactors.push(`platform: ${platform}`);
    }

    // Check asset types (weak signal but useful)
    const assetMatches = criteria.assetTypes.filter(type => 
      assetTypes.includes(type)
    );
    
    if (assetMatches.length > 0) {
      score += assetMatches.length * 5;
      matchedFactors.push(`asset_types: ${assetMatches.join(', ')}`);
    }

    // Check duration range (weak signal)
    if (criteria.durationRanges) {
      const { min = 0, max = Infinity } = criteria.durationRanges;
      if (duration >= min && duration <= max) {
        score += 5;
        matchedFactors.push(`duration_range: ${min}-${max === Infinity ? '∞' : max}s`);
      }
    }
    
    // NEW: Check asset content for additional signals
    if (assets.length > 0) {
      // Look for educational content in assets
      const educationalAssets = assets.filter(asset => 
        asset.ai_caption?.toLowerCase().includes('educational') || 
        asset.ai_caption?.toLowerCase().includes('diagram') ||
        asset.ai_caption?.toLowerCase().includes('chart')
      );
      
      if (educationalAssets.length > 0 && profile.id.includes('educational')) {
        score += 15;
        matchedFactors.push('educational_asset_content');
      }
      
      // Look for product showcase in assets
      const productAssets = assets.filter(asset => 
        asset.ai_caption?.toLowerCase().includes('product') || 
        asset.ai_caption?.toLowerCase().includes('item') ||
        asset.ai_caption?.toLowerCase().includes('merchandise')
      );
      
      if (productAssets.length > 0 && profile.id.includes('product')) {
        score += 15;
        matchedFactors.push('product_asset_content');
      }
    }
    
    // NEW: Check content complexity signals
    if (contentComplexity === 'complex' && profile.id.includes('educational')) {
      score += 10;
      matchedFactors.push('complex_content');
    }
    
    if ((needsExplanation || needsCharts || needsDiagrams) && 
        (profile.id.includes('educational') || profile.id.includes('explainer'))) {
      score += 15;
      matchedFactors.push('explanation_needs');
    }

    // Add priority bonus (ensures preferred profiles win ties)
    score += profile.priority;
    if (profile.priority > 0) {
      matchedFactors.push(`priority_bonus: ${profile.priority}`);
    }

    return { 
      profile, 
      score, 
      matchedFactors,
      // Calculate confidence based on score and number of matched factors
      confidence: Math.min(0.95, score / 100) 
    };
  });

  // Sort by score and return the highest scoring profile
  profileScores.sort((a, b) => b.score - a.score);
  
  // Get top profile and alternatives
  const topProfile = profileScores[0];
  const alternativeProfiles = profileScores.slice(1, 3)
    .filter(p => p.score > 20)
    .map(({ profile, score, matchedFactors }) => ({
      profile,
      confidence: Math.min(0.9, score / 100),
      matchedFactors
    }));
  
  // Determine if we have a confident match
  const hasConfidentMatch = topProfile && topProfile.score > 30;
  
  if (hasConfidentMatch) {
    return {
      profile: topProfile.profile,
      confidence: topProfile.confidence,
      matchedFactors: topProfile.matchedFactors,
      alternativeProfiles,
      detectionMethod: 'multi-factor'
    };
  }
  
  // Fallback 1: Try content category-based matching if no confident match
  if (contentCategory && contentCategory !== 'general') {
    const categoryMatches = CREATIVE_PROFILES.filter(profile => 
      profile.detectionCriteria.contentCategories.includes(contentCategory)
    );
    
    if (categoryMatches.length > 0) {
      // Sort by priority to get the best match for this category
      categoryMatches.sort((a, b) => b.priority - a.priority);
      
      return {
        profile: categoryMatches[0],
        confidence: 0.6, // Moderate confidence for category-based fallback
        matchedFactors: [`fallback_category: ${contentCategory}`],
        alternativeProfiles: alternativeProfiles.length > 0 ? alternativeProfiles : [],
        detectionMethod: 'fallback'
      };
    }
  }
  
  // Fallback 2: Try intent-based matching
  if (intent) {
    const intentMatches = CREATIVE_PROFILES.filter(profile => 
      profile.detectionCriteria.intents.includes(intent)
    );
    
    if (intentMatches.length > 0) {
      // Sort by priority
      intentMatches.sort((a, b) => b.priority - a.priority);
      
      return {
        profile: intentMatches[0],
        confidence: 0.5, // Lower confidence for intent-based fallback
        matchedFactors: [`fallback_intent: ${intent}`],
        alternativeProfiles: alternativeProfiles.length > 0 ? alternativeProfiles : [],
        detectionMethod: 'fallback'
      };
    }
  }
  
  // No profile matched with confidence
  return {
    profile: null,
    confidence: 0,
    matchedFactors: [],
    alternativeProfiles: [],
    detectionMethod: 'default'
  };
}

// Apply profile to refiner output
export function applyCreativeProfile(refinerOutput: RefinerOutput, profile: CreativeProfile): RefinerOutput {
  return {
    ...refinerOutput,
    creative_direction: {
      ...refinerOutput.creative_direction,
      ...profile.defaults.creativeDirection
    },
    production_pipeline: {
      ...refinerOutput.production_pipeline,
      ...profile.defaults.productionPipeline
    },
    recommendations: [
      ...refinerOutput.recommendations,
      ...profile.defaults.recommendations
    ]
  };
}

// Get profile by ID
export function getProfileById(profileId: string): CreativeProfile | null {
  return CREATIVE_PROFILES.find(profile => profile.id === profileId) || null;
}

// Get all profiles
export function getAllProfiles(): CreativeProfile[] {
  return CREATIVE_PROFILES;
}

// Get profiles by category
export function getProfilesByCategory(category: string): CreativeProfile[] {
  return CREATIVE_PROFILES.filter(profile => 
    profile.detectionCriteria.contentCategories.includes(category)
  );
}

export default {
  detectCreativeProfile,
  detectCreativeProfileEnhanced,
  applyCreativeProfile,
  getProfileById,
  getAllProfiles,
  getProfilesByCategory,
  CREATIVE_PROFILES
};
