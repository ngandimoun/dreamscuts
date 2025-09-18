/**
 * ElevenLabs Language Manager
 * 
 * Manages language support for ElevenLabs v3 multilingual capabilities
 * Same voice can speak different languages with proper language_code parameter
 */

import type { LanguageCode, LanguageInfo } from './types';

// Comprehensive language information for ElevenLabs v3
export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  // Major Languages
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', region: 'Global', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', region: 'Spain/Latin America', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'France/Canada', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Germany/Austria', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', region: 'Italy', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', region: 'Portugal/Brazil', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', region: 'Russia', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', region: 'China', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'Japan', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', region: 'South Korea', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', region: 'Middle East', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'India', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  
  // European Languages
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', region: 'Netherlands', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', region: 'Poland', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', region: 'Turkey', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', region: 'Sweden', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', region: 'Denmark', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', region: 'Norway', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', region: 'Finland', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', region: 'Greece', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', region: 'Israel', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', region: 'Czech Republic', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', region: 'Hungary', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', region: 'Romania', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬', region: 'Bulgaria', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷', region: 'Croatia', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰', region: 'Slovakia', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮', region: 'Slovenia', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪', region: 'Estonia', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻', region: 'Latvia', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹', region: 'Lithuania', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', region: 'Ukraine', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  
  // Asian Languages
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', region: 'Thailand', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', region: 'Vietnam', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', region: 'Indonesia', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', region: 'Malaysia', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭', region: 'Philippines', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', region: 'India/Sri Lanka', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', region: 'India', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', region: 'India', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', region: 'India', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', region: 'Bangladesh/India', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', region: 'India', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', region: 'India', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵', region: 'Nepal', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', region: 'India/Pakistan', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', region: 'Pakistan', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', region: 'Iran', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇹🇿', region: 'East Africa', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', region: 'Ethiopia', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  
  // Additional Languages
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', flag: '🇦🇿', region: 'Azerbaijan', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская', flag: '🇧🇾', region: 'Belarus', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', flag: '🇧🇦', region: 'Bosnia', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', flag: '🇪🇸', region: 'Spain', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'ceb', name: 'Cebuano', nativeName: 'Cebuano', flag: '🇵🇭', region: 'Philippines', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'co', name: 'Corsican', nativeName: 'Corsu', flag: '🇫🇷', region: 'France', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', flag: '🇬🇧', region: 'Wales', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'eo', name: 'Esperanto', nativeName: 'Esperanto', flag: '🌍', region: 'International', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'eu', name: 'Basque', nativeName: 'Euskera', flag: '🇪🇸', region: 'Spain', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'fy', name: 'Frisian', nativeName: 'Frysk', flag: '🇳🇱', region: 'Netherlands', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', flag: '🇮🇪', region: 'Ireland', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'gl', name: 'Galician', nativeName: 'Galego', flag: '🇪🇸', region: 'Spain', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬', region: 'Nigeria', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'haw', name: 'Hawaiian', nativeName: 'ʻŌlelo Hawaiʻi', flag: '🇺🇸', region: 'Hawaii', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', flag: '🇮🇸', region: 'Iceland', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'jw', name: 'Javanese', nativeName: 'Basa Jawa', flag: '🇮🇩', region: 'Indonesia', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', flag: '🇬🇪', region: 'Georgia', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша', flag: '🇰🇿', region: 'Kazakhstan', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ', flag: '🇰🇭', region: 'Cambodia', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'ku', name: 'Kurdish', nativeName: 'Kurdî', flag: '🇮🇶', region: 'Kurdistan', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча', flag: '🇰🇬', region: 'Kyrgyzstan', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'la', name: 'Latin', nativeName: 'Latina', flag: '🏛️', region: 'Historical', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'lb', name: 'Luxembourgish', nativeName: 'Lëtzebuergesch', flag: '🇱🇺', region: 'Luxembourg', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ', flag: '🇱🇦', region: 'Laos', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски', flag: '🇲🇰', region: 'North Macedonia', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', flag: '🇲🇹', region: 'Malta', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'my', name: 'Myanmar', nativeName: 'မြန်မာ', flag: '🇲🇲', region: 'Myanmar', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'ny', name: 'Chichewa', nativeName: 'Chichewa', flag: '🇲🇼', region: 'Malawi', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو', flag: '🇦🇫', region: 'Afghanistan', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰', region: 'Sri Lanka', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali', flag: '🇸🇴', region: 'Somalia', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', flag: '🇦🇱', region: 'Albania', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'su', name: 'Sundanese', nativeName: 'Basa Sunda', flag: '🇮🇩', region: 'Indonesia', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ', flag: '🇹🇯', region: 'Tajikistan', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'tk', name: 'Turkmen', nativeName: 'Türkmen', flag: '🇹🇲', region: 'Turkmenistan', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbek', flag: '🇺🇿', region: 'Uzbekistan', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'yi', name: 'Yiddish', nativeName: 'ייִדיש', flag: '🇮🇱', region: 'Jewish Communities', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬', region: 'Nigeria', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } },
  { code: 'zu', name: 'Zulu', nativeName: 'IsiZulu', flag: '🇿🇦', region: 'South Africa', modelSupport: { eleven_v3: true, eleven_multilingual_v2: true, eleven_turbo_v2_5: true } }
];

export class LanguageManager {
  /**
   * Get all supported languages
   */
  static getAllLanguages(): LanguageInfo[] {
    return SUPPORTED_LANGUAGES;
  }

  /**
   * Get languages supported by a specific model
   */
  static getLanguagesByModel(model: 'eleven_v3' | 'eleven_multilingual_v2' | 'eleven_turbo_v2_5'): LanguageInfo[] {
    return SUPPORTED_LANGUAGES.filter(lang => lang.modelSupport[model]);
  }

  /**
   * Get language info by code
   */
  static getLanguageByCode(code: LanguageCode): LanguageInfo | null {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code) || null;
  }

  /**
   * Search languages by name or native name
   */
  static searchLanguages(query: string): LanguageInfo[] {
    const lowerQuery = query.toLowerCase();
    return SUPPORTED_LANGUAGES.filter(lang => 
      lang.name.toLowerCase().includes(lowerQuery) ||
      lang.nativeName.toLowerCase().includes(lowerQuery) ||
      lang.region.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get languages by region
   */
  static getLanguagesByRegion(region: string): LanguageInfo[] {
    return SUPPORTED_LANGUAGES.filter(lang => 
      lang.region.toLowerCase().includes(region.toLowerCase())
    );
  }

  /**
   * Get major languages (most commonly used)
   */
  static getMajorLanguages(): LanguageInfo[] {
    const majorCodes: LanguageCode[] = [
      'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 
      'ar', 'hi', 'nl', 'pl', 'tr', 'sv', 'da', 'no', 'fi', 'el'
    ];
    return SUPPORTED_LANGUAGES.filter(lang => majorCodes.includes(lang.code));
  }

  /**
   * Get European languages
   */
  static getEuropeanLanguages(): LanguageInfo[] {
    return SUPPORTED_LANGUAGES.filter(lang => 
      ['Europe', 'Spain', 'France', 'Germany', 'Italy', 'Portugal', 'Russia', 
       'Netherlands', 'Poland', 'Turkey', 'Sweden', 'Denmark', 'Norway', 
       'Finland', 'Greece', 'Israel', 'Czech Republic', 'Hungary', 'Romania', 
       'Bulgaria', 'Croatia', 'Slovakia', 'Slovenia', 'Estonia', 'Latvia', 
       'Lithuania', 'Ukraine', 'Wales', 'Ireland', 'Iceland', 'Luxembourg', 
       'Malta', 'North Macedonia', 'Albania'].some(region => 
        lang.region.includes(region)
      )
    );
  }

  /**
   * Get Asian languages
   */
  static getAsianLanguages(): LanguageInfo[] {
    return SUPPORTED_LANGUAGES.filter(lang => 
      ['China', 'Japan', 'South Korea', 'Thailand', 'Vietnam', 'Indonesia', 
       'Malaysia', 'Philippines', 'India', 'Bangladesh', 'Nepal', 'Pakistan', 
       'Iran', 'Cambodia', 'Laos', 'Myanmar', 'Sri Lanka', 'Afghanistan', 
       'Georgia', 'Kazakhstan', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan', 
       'Uzbekistan'].some(region => lang.region.includes(region))
    );
  }

  /**
   * Get African languages
   */
  static getAfricanLanguages(): LanguageInfo[] {
    return SUPPORTED_LANGUAGES.filter(lang => 
      ['East Africa', 'Ethiopia', 'Nigeria', 'Malawi', 'Somalia', 'South Africa'].some(region => 
        lang.region.includes(region)
      )
    );
  }

  /**
   * Get American languages
   */
  static getAmericanLanguages(): LanguageInfo[] {
    return SUPPORTED_LANGUAGES.filter(lang => 
      ['Spain/Latin America', 'France/Canada', 'Portugal/Brazil', 'Philippines', 'Hawaii'].some(region => 
        lang.region.includes(region)
      )
    );
  }

  /**
   * Validate if a language code is supported
   */
  static isLanguageSupported(code: string): code is LanguageCode {
    return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
  }

  /**
   * Get language code from text (basic detection)
   */
  static detectLanguageFromText(text: string): LanguageCode | null {
    // Basic language detection based on character sets
    const chineseRegex = /[\u4e00-\u9fff]/;
    const japaneseRegex = /[\u3040-\u309f\u30a0-\u30ff]/;
    const koreanRegex = /[\uac00-\ud7af]/;
    const arabicRegex = /[\u0600-\u06ff]/;
    const cyrillicRegex = /[\u0400-\u04ff]/;
    const devanagariRegex = /[\u0900-\u097f]/;
    const thaiRegex = /[\u0e00-\u0e7f]/;

    if (chineseRegex.test(text)) return 'zh';
    if (japaneseRegex.test(text)) return 'ja';
    if (koreanRegex.test(text)) return 'ko';
    if (arabicRegex.test(text)) return 'ar';
    if (cyrillicRegex.test(text)) return 'ru';
    if (devanagariRegex.test(text)) return 'hi';
    if (thaiRegex.test(text)) return 'th';

    // Default to English for Latin script
    return 'en';
  }

  /**
   * Get recommended language for voice
   */
  static getRecommendedLanguageForVoice(voiceId: string, text: string): LanguageCode {
    // For now, detect from text. In the future, this could be enhanced
    // to consider voice-specific language preferences
    return this.detectLanguageFromText(text) || 'en';
  }
}

// Export default instance
export const languageManager = new LanguageManager();
