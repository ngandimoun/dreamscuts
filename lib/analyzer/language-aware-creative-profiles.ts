/**
 * Language-Aware Creative Profile System
 * 
 * This module provides language-aware creative profiles that maintain
 * the user's detected language throughout the creative direction process.
 * 
 * CRITICAL: This prevents English creative profiles from overriding
 * the user's original language intent.
 */

// Note: CREATIVE_PROFILE_SCRIPTS is defined locally in script-enhancer, not imported here

export interface LanguageAwareCreativeProfile {
  profileId: string;
  core_concept: string;
  visual_approach: string;
  style_direction: string;
  mood_guidance: string;
  pacing: string;
  style: string;
  music: string;
  transitions: string[];
  language: string;
}

/**
 * Language-specific creative direction templates
 */
const LANGUAGE_CREATIVE_TEMPLATES = {
  // French templates
  fr: {
    educational_explainer: {
      core_concept: "Créer du contenu éducatif clair et engageant",
      visual_approach: "Visuels informatifs avec animations fluides",
      style_direction: "Style professionnel et accessible",
      mood_guidance: "Ton informatif et rassurant",
      pacing: "modéré",
      style: "Narration claire et structurée",
      music: "Musique de fond subtile et professionnelle",
      transitions: ["fondu", "glissement", "zoom"]
    },
    social_media: {
      core_concept: "Créer du contenu viral et engageant pour les réseaux sociaux",
      visual_approach: "Visuels dynamiques et accrocheurs",
      style_direction: "Style moderne et tendance",
      mood_guidance: "Ton énergique et fun",
      pacing: "rapide",
      style: "Narration dynamique et captivante",
      music: "Musique entraînante et moderne",
      transitions: ["coupure", "zoom rapide", "effet de glissement"]
    },
    corporate_presentation: {
      core_concept: "Créer une présentation d'entreprise professionnelle et impactante",
      visual_approach: "Visuels élégants et sophistiqués",
      style_direction: "Style corporate et premium",
      mood_guidance: "Ton professionnel et confiant",
      pacing: "modéré",
      style: "Narration professionnelle et claire",
      music: "Musique d'entreprise subtile",
      transitions: ["fondu élégant", "transition douce", "zoom professionnel"]
    },
    finance_explainer: {
      core_concept: "Créer du contenu financier éducatif et accessible",
      visual_approach: "Visuels financiers clairs avec graphiques et données",
      style_direction: "Style professionnel et rassurant",
      mood_guidance: "Ton informatif et confiant",
      pacing: "modéré",
      style: "Narration claire et structurée",
      music: "Musique de fond professionnelle et subtile",
      transitions: ["fondu", "glissement", "zoom sur graphiques"]
    }
  },
  
  // Spanish templates
  es: {
    educational_explainer: {
      core_concept: "Crear contenido educativo claro y atractivo",
      visual_approach: "Visuales informativos con animaciones fluidas",
      style_direction: "Estilo profesional y accesible",
      mood_guidance: "Tono informativo y tranquilizador",
      pacing: "moderado",
      style: "Narración clara y estructurada",
      music: "Música de fondo sutil y profesional",
      transitions: ["desvanecimiento", "deslizamiento", "zoom"]
    },
    social_media: {
      core_concept: "Crear contenido viral y atractivo para redes sociales",
      visual_approach: "Visuales dinámicos y llamativos",
      style_direction: "Estilo moderno y tendencia",
      mood_guidance: "Tono energético y divertido",
      pacing: "rápido",
      style: "Narración dinámica y cautivadora",
      music: "Música pegajosa y moderna",
      transitions: ["corte", "zoom rápido", "efecto de deslizamiento"]
    },
    corporate_presentation: {
      core_concept: "Crear una presentación corporativa profesional e impactante",
      visual_approach: "Visuales elegantes y sofisticados",
      style_direction: "Estilo corporativo y premium",
      mood_guidance: "Tono profesional y confiado",
      pacing: "moderado",
      style: "Narración profesional y clara",
      music: "Música corporativa sutil",
      transitions: ["desvanecimiento elegante", "transición suave", "zoom profesional"]
    },
    finance_explainer: {
      core_concept: "Crear contenido financiero educativo y accesible",
      visual_approach: "Visuales financieros claros con gráficos y datos",
      style_direction: "Estilo profesional y tranquilizador",
      mood_guidance: "Tono informativo y confiado",
      pacing: "moderado",
      style: "Narración clara y estructurada",
      music: "Música de fondo profesional y sutil",
      transitions: ["desvanecimiento", "deslizamiento", "zoom en gráficos"]
    }
  },
  
  // German templates
  de: {
    educational_explainer: {
      core_concept: "Erstellen von klaren und ansprechenden Bildungsinhalten",
      visual_approach: "Informative Visuals mit flüssigen Animationen",
      style_direction: "Professioneller und zugänglicher Stil",
      mood_guidance: "Informativ und beruhigend",
      pacing: "moderat",
      style: "Klare und strukturierte Erzählung",
      music: "Subtile und professionelle Hintergrundmusik",
      transitions: ["Überblendung", "Gleiten", "Zoom"]
    },
    social_media: {
      core_concept: "Erstellen von viralem und ansprechendem Social Media Content",
      visual_approach: "Dynamische und auffällige Visuals",
      style_direction: "Moderner und trendiger Stil",
      mood_guidance: "Energisch und unterhaltsam",
      pacing: "schnell",
      style: "Dynamische und fesselnde Erzählung",
      music: "Mitreißende und moderne Musik",
      transitions: ["Schnitt", "schneller Zoom", "Gleiteffekt"]
    },
    corporate_presentation: {
      core_concept: "Erstellen einer professionellen und beeindruckenden Unternehmenspräsentation",
      visual_approach: "Elegante und raffinierte Visuals",
      style_direction: "Unternehmens- und Premium-Stil",
      mood_guidance: "Professionell und selbstbewusst",
      pacing: "moderat",
      style: "Professionelle und klare Erzählung",
      music: "Subtile Unternehmensmusik",
      transitions: ["elegante Überblendung", "sanfter Übergang", "professioneller Zoom"]
    },
    finance_explainer: {
      core_concept: "Erstellen von lehrreichem und zugänglichem Finanzinhalt",
      visual_approach: "Klare Finanzvisuals mit Diagrammen und Daten",
      style_direction: "Professioneller und beruhigender Stil",
      mood_guidance: "Informativ und selbstbewusst",
      pacing: "moderat",
      style: "Klare und strukturierte Erzählung",
      music: "Subtile und professionelle Hintergrundmusik",
      transitions: ["Überblendung", "Gleiten", "Zoom auf Diagramme"]
    }
  },
  
  // Italian templates
  it: {
    educational_explainer: {
      core_concept: "Creare contenuti educativi chiari e coinvolgenti",
      visual_approach: "Visuali informativi con animazioni fluide",
      style_direction: "Stile professionale e accessibile",
      mood_guidance: "Tono informativo e rassicurante",
      pacing: "moderato",
      style: "Narrazione chiara e strutturata",
      music: "Musica di sottofondo sottile e professionale",
      transitions: ["dissolvenza", "scorrimento", "zoom"]
    },
    social_media: {
      core_concept: "Creare contenuti virali e coinvolgenti per i social media",
      visual_approach: "Visuali dinamici e accattivanti",
      style_direction: "Stile moderno e di tendenza",
      mood_guidance: "Tono energico e divertente",
      pacing: "veloce",
      style: "Narrazione dinamica e coinvolgente",
      music: "Musica coinvolgente e moderna",
      transitions: ["taglio", "zoom veloce", "effetto di scorrimento"]
    },
    corporate_presentation: {
      core_concept: "Creare una presentazione aziendale professionale e di impatto",
      visual_approach: "Visuali eleganti e sofisticati",
      style_direction: "Stile aziendale e premium",
      mood_guidance: "Tono professionale e sicuro",
      pacing: "moderato",
      style: "Narrazione professionale e chiara",
      music: "Musica aziendale sottile",
      transitions: ["dissolvenza elegante", "transizione morbida", "zoom professionale"]
    },
    finance_explainer: {
      core_concept: "Creare contenuti finanziari educativi e accessibili",
      visual_approach: "Visuali finanziari chiari con grafici e dati",
      style_direction: "Stile professionale e rassicurante",
      mood_guidance: "Tono informativo e sicuro",
      pacing: "moderato",
      style: "Narrazione chiara e strutturata",
      music: "Musica di sottofondo professionale e sottile",
      transitions: ["dissolvenza", "scorrimento", "zoom sui grafici"]
    }
  },
  
  // Portuguese templates
  pt: {
    educational_explainer: {
      core_concept: "Criar conteúdo educacional claro e envolvente",
      visual_approach: "Visuais informativos com animações fluidas",
      style_direction: "Estilo profissional e acessível",
      mood_guidance: "Tom informativo e tranquilizador",
      pacing: "moderado",
      style: "Narração clara e estruturada",
      music: "Música de fundo sutil e profissional",
      transitions: ["desvanecimento", "deslizamento", "zoom"]
    },
    social_media: {
      core_concept: "Criar conteúdo viral e envolvente para redes sociais",
      visual_approach: "Visuais dinâmicos e chamativos",
      style_direction: "Estilo moderno e tendência",
      mood_guidance: "Tom energético e divertido",
      pacing: "rápido",
      style: "Narração dinâmica e cativante",
      music: "Música envolvente e moderna",
      transitions: ["corte", "zoom rápido", "efeito de deslizamento"]
    },
    corporate_presentation: {
      core_concept: "Criar uma apresentação corporativa profissional e impactante",
      visual_approach: "Visuais elegantes e sofisticados",
      style_direction: "Estilo corporativo e premium",
      mood_guidance: "Tom profissional e confiante",
      pacing: "moderado",
      style: "Narração profissional e clara",
      music: "Música corporativa sutil",
      transitions: ["desvanecimento elegante", "transição suave", "zoom profissional"]
    },
    finance_explainer: {
      core_concept: "Criar conteúdo financeiro educacional e acessível",
      visual_approach: "Visuais financeiros claros com gráficos e dados",
      style_direction: "Estilo profissional e tranquilizador",
      mood_guidance: "Tom informativo e confiante",
      pacing: "moderado",
      style: "Narração clara e estruturada",
      music: "Música de fundo profissional e sutil",
      transitions: ["desvanecimento", "deslizamento", "zoom nos gráficos"]
    }
  },
  
  // Japanese templates
  ja: {
    educational_explainer: {
      core_concept: "教育的で分かりやすいコンテンツを作成する",
      visual_approach: "情報豊富なビジュアルと滑らかなアニメーション",
      style_direction: "プロフェッショナルで親しみやすいスタイル",
      mood_guidance: "情報提供と安心感を与えるトーン",
      pacing: "適度",
      style: "明確で構造化されたナレーション",
      music: "控えめでプロフェッショナルな背景音楽",
      transitions: ["フェード", "スライド", "ズーム"]
    },
    social_media: {
      core_concept: "ソーシャルメディア向けのバイラルで魅力的なコンテンツを作成する",
      visual_approach: "ダイナミックで目を引くビジュアル",
      style_direction: "モダンでトレンディなスタイル",
      mood_guidance: "エネルギッシュで楽しいトーン",
      pacing: "速い",
      style: "ダイナミックで魅力的なナレーション",
      music: "キャッチーでモダンな音楽",
      transitions: ["カット", "高速ズーム", "スライド効果"]
    },
    corporate_presentation: {
      core_concept: "プロフェッショナルで印象的な企業プレゼンテーションを作成する",
      visual_approach: "エレガントで洗練されたビジュアル",
      style_direction: "コーポレートでプレミアムなスタイル",
      mood_guidance: "プロフェッショナルで自信に満ちたトーン",
      pacing: "適度",
      style: "プロフェッショナルで明確なナレーション",
      music: "控えめなコーポレート音楽",
      transitions: ["エレガントなフェード", "スムーズなトランジション", "プロフェッショナルズーム"]
    },
    finance_explainer: {
      core_concept: "教育的で分かりやすい金融コンテンツを作成する",
      visual_approach: "グラフとデータを含む明確な金融ビジュアル",
      style_direction: "プロフェッショナルで安心感を与えるスタイル",
      mood_guidance: "情報提供で自信に満ちたトーン",
      pacing: "適度",
      style: "明確で構造化されたナレーション",
      music: "控えめでプロフェッショナルな背景音楽",
      transitions: ["フェード", "スライド", "グラフズーム"]
    }
  },
  
  // Korean templates
  ko: {
    educational_explainer: {
      core_concept: "교육적이고 이해하기 쉬운 콘텐츠를 만들기",
      visual_approach: "정보가 풍부한 비주얼과 부드러운 애니메이션",
      style_direction: "전문적이고 친근한 스타일",
      mood_guidance: "정보 제공과 안심감을 주는 톤",
      pacing: "적당한",
      style: "명확하고 구조화된 내레이션",
      music: "은은하고 전문적인 배경음악",
      transitions: ["페이드", "슬라이드", "줌"]
    },
    social_media: {
      core_concept: "소셜미디어를 위한 바이럴하고 매력적인 콘텐츠 만들기",
      visual_approach: "역동적이고 눈에 띄는 비주얼",
      style_direction: "모던하고 트렌디한 스타일",
      mood_guidance: "에너지 넘치고 재미있는 톤",
      pacing: "빠른",
      style: "역동적이고 매력적인 내레이션",
      music: "캐치하고 모던한 음악",
      transitions: ["컷", "빠른 줌", "슬라이드 효과"]
    },
    corporate_presentation: {
      core_concept: "전문적이고 인상적인 기업 프레젠테이션 만들기",
      visual_approach: "우아하고 세련된 비주얼",
      style_direction: "기업적이고 프리미엄한 스타일",
      mood_guidance: "전문적이고 자신감 있는 톤",
      pacing: "적당한",
      style: "전문적이고 명확한 내레이션",
      music: "은은한 기업 음악",
      transitions: ["우아한 페이드", "부드러운 전환", "전문적 줌"]
    },
    finance_explainer: {
      core_concept: "교육적이고 이해하기 쉬운 금융 콘텐츠 만들기",
      visual_approach: "차트와 데이터를 포함한 명확한 금융 비주얼",
      style_direction: "전문적이고 안심감을 주는 스타일",
      mood_guidance: "정보 제공하고 자신감 있는 톤",
      pacing: "적당한",
      style: "명확하고 구조화된 내레이션",
      music: "은은하고 전문적인 배경음악",
      transitions: ["페이드", "슬라이드", "차트 줌"]
    }
  },
  
  // Indonesian templates
  id: {
    educational_explainer: {
      core_concept: "Membuat konten edukatif yang jelas dan mudah dipahami",
      visual_approach: "Visual informatif dengan animasi yang halus",
      style_direction: "Gaya profesional dan mudah diakses",
      mood_guidance: "Nada informatif dan meyakinkan",
      pacing: "sedang",
      style: "Narasi yang jelas dan terstruktur",
      music: "Musik latar yang halus dan profesional",
      transitions: ["fade", "slide", "zoom"]
    },
    social_media: {
      core_concept: "Membuat konten viral dan menarik untuk media sosial",
      visual_approach: "Visual yang dinamis dan menarik perhatian",
      style_direction: "Gaya modern dan trendi",
      mood_guidance: "Nada energik dan menyenangkan",
      pacing: "cepat",
      style: "Narasi yang dinamis dan menarik",
      music: "Musik yang catchy dan modern",
      transitions: ["cut", "zoom cepat", "efek slide"]
    },
    corporate_presentation: {
      core_concept: "Membuat presentasi perusahaan yang profesional dan mengesankan",
      visual_approach: "Visual yang elegan dan canggih",
      style_direction: "Gaya korporat dan premium",
      mood_guidance: "Nada profesional dan percaya diri",
      pacing: "sedang",
      style: "Narasi yang profesional dan jelas",
      music: "Musik korporat yang halus",
      transitions: ["fade elegan", "transisi halus", "zoom profesional"]
    },
    finance_explainer: {
      core_concept: "Membuat konten keuangan yang edukatif dan mudah diakses",
      visual_approach: "Visual keuangan yang jelas dengan grafik dan data",
      style_direction: "Gaya profesional dan meyakinkan",
      mood_guidance: "Nada informatif dan percaya diri",
      pacing: "sedang",
      style: "Narasi yang jelas dan terstruktur",
      music: "Musik latar yang halus dan profesional",
      transitions: ["fade", "slide", "zoom grafik"]
    }
  }
};

/**
 * Get language-aware creative profile
 */
export function getLanguageAwareCreativeProfile(
  profileId: string,
  detectedLanguage: string
): LanguageAwareCreativeProfile {
  // Default to English if language not supported
  const language = detectedLanguage.toLowerCase().substring(0, 2);
  const languageTemplates = LANGUAGE_CREATIVE_TEMPLATES[language as keyof typeof LANGUAGE_CREATIVE_TEMPLATES];
  
  if (!languageTemplates || !languageTemplates[profileId as keyof typeof languageTemplates]) {
    // Fallback to English profile with default values
    const defaultEnglishProfile = {
      core_concept: "Create engaging and informative content",
      visual_approach: "Professional and clear visuals",
      style_direction: "Clean and modern style",
      mood_guidance: "Informative and engaging tone",
      pacing: "moderate",
      style: "Clear and structured narration",
      music: "Subtle background music",
      transitions: ["fade", "slide", "zoom"]
    };
    
    return {
      profileId,
      core_concept: defaultEnglishProfile.core_concept,
      visual_approach: defaultEnglishProfile.visual_approach,
      style_direction: defaultEnglishProfile.style_direction,
      mood_guidance: defaultEnglishProfile.mood_guidance,
      pacing: defaultEnglishProfile.pacing,
      style: defaultEnglishProfile.style,
      music: defaultEnglishProfile.music,
      transitions: defaultEnglishProfile.transitions,
      language: 'en'
    };
  }
  
  const localizedProfile = languageTemplates[profileId as keyof typeof languageTemplates];
  
  return {
    profileId,
    core_concept: localizedProfile.core_concept,
    visual_approach: localizedProfile.visual_approach,
    style_direction: localizedProfile.style_direction,
    mood_guidance: localizedProfile.mood_guidance,
    pacing: localizedProfile.pacing,
    style: localizedProfile.style,
    music: localizedProfile.music,
    transitions: localizedProfile.transitions,
    language: language
  };
}

/**
 * Generate language-aware creative direction
 */
export function generateLanguageAwareCreativeDirection(
  userQuery: string,
  detectedLanguage: string,
  profileId: string = 'educational_explainer'
): {
  core_concept: string;
  visual_approach: string;
  style_direction: string;
  mood_guidance: string;
} {
  const profile = getLanguageAwareCreativeProfile(profileId, detectedLanguage);
  
  // Check if we fell back to English templates (no static template for this language)
  const isUsingEnglishFallback = profile.language === 'en' && detectedLanguage !== 'en';
  
  if (isUsingEnglishFallback) {
    // Smart dynamic translation: Generate language-appropriate creative direction
    return generateDynamicLanguageCreativeDirection(userQuery, detectedLanguage, profileId);
  }
  
  // Use existing static template logic for languages with templates
  const queryLower = userQuery.toLowerCase();
  
  // Adjust core concept based on query content
  let coreConcept = profile.core_concept;
  if (queryLower.includes('université') || queryLower.includes('university') || queryLower.includes('universidad')) {
    coreConcept = profile.core_concept.replace('contenu', 'présentation universitaire').replace('contenido', 'presentación universitaria');
  }
  
  return {
    core_concept: coreConcept,
    visual_approach: profile.visual_approach,
    style_direction: profile.style_direction,
    mood_guidance: profile.mood_guidance
  };
}

/**
 * Generate dynamic language-appropriate creative direction for languages without static templates
 * This leverages the LLM's natural language capabilities to create culturally appropriate content
 */
function generateDynamicLanguageCreativeDirection(
  userQuery: string,
  detectedLanguage: string,
  profileId: string
): {
  core_concept: string;
  visual_approach: string;
  style_direction: string;
  mood_guidance: string;
} {
  // Get English base template for structure
  const englishProfile = getLanguageAwareCreativeProfile(profileId, 'en');
  
  // Create dynamic language-appropriate content based on the user query and detected language
  // This will be processed by the LLM in the refiner to create culturally appropriate creative direction
  
  const languageNames: Record<string, string> = {
    'bg': 'Bulgarian',
    'ru': 'Russian',
    'uk': 'Ukrainian',
    'pl': 'Polish',
    'cs': 'Czech',
    'sk': 'Slovak',
    'hr': 'Croatian',
    'sr': 'Serbian',
    'sl': 'Slovenian',
    'et': 'Estonian',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'fi': 'Finnish',
    'sv': 'Swedish',
    'no': 'Norwegian',
    'da': 'Danish',
    'is': 'Icelandic',
    'tr': 'Turkish',
    'he': 'Hebrew',
    'th': 'Thai',
    'vi': 'Vietnamese',
    'ms': 'Malay',
    'tl': 'Filipino',
    'sw': 'Swahili',
    'af': 'Afrikaans',
    'eu': 'Basque',
    'ca': 'Catalan',
    'gl': 'Galician',
    'cy': 'Welsh',
    'ga': 'Irish',
    'mt': 'Maltese',
    'ro': 'Romanian',
    'el': 'Greek',
    'mk': 'Macedonian',
    'sq': 'Albanian',
    'bs': 'Bosnian',
    'me': 'Montenegrin'
  };
  
  const languageName = languageNames[detectedLanguage] || detectedLanguage;
  
  // Create dynamic creative direction that will be processed by the LLM
  // The LLM will naturally translate and adapt this to the detected language
  return {
    core_concept: `Create engaging and informative content in ${languageName} that effectively communicates the key message: "${userQuery}". Focus on clear, culturally appropriate presentation that resonates with ${languageName}-speaking audiences.`,
    visual_approach: `Use dynamic visual storytelling techniques appropriate for ${languageName} cultural context. Incorporate relevant visual metaphors, color schemes, and design elements that align with ${languageName} aesthetic preferences and cultural values.`,
    style_direction: `Maintain a professional yet approachable tone suitable for ${languageName} communication style. Ensure visual hierarchy and pacing that matches ${languageName} reading patterns and cultural expectations.`,
    mood_guidance: `Create content that feels authentic and engaging for ${languageName}-speaking viewers. Balance professionalism with cultural sensitivity, ensuring the content feels natural and compelling in the ${languageName} language context.`
  };
}

/**
 * Detect language from text using simple, reliable patterns
 */
export function detectLanguageFromText(text: string): string {
  // Only use Unicode ranges for non-Latin scripts (these are reliable)
  // For Latin-based languages, let the LLM handle detection in prompts
  
  // Japanese indicators (Hiragana, Katakana, Kanji)
  if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text)) {
    return 'ja';
  }
  
  // Chinese indicators (Simplified and Traditional)
  if (/[\u4E00-\u9FFF]/.test(text) && !/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) {
    return 'zh';
  }
  
  // Korean indicators
  if (/[\uAC00-\uD7AF]/.test(text)) {
    return 'ko';
  }
  
  // Arabic indicators
  if (/[\u0600-\u06FF]/.test(text)) {
    return 'ar';
  }
  
  // Hindi indicators
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hi';
  }
  
  // For Latin-based languages (Czech, Latvian, Spanish, French, etc.), 
  // let the LLM handle detection in prompts - this is more reliable than regex
  return 'auto';
}
