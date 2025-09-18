/**
 * ElevenLabs API Types and Interfaces
 * 
 * This file contains TypeScript types for ElevenLabs Text to Speech integration.
 * We focus on Eleven v3 model and essential TTS functionality.
 */

// Voice Settings Interface
export interface VoiceSettings {
  stability: number; // 0.0 to 1.0 - determines voice stability and emotional range
  similarity_boost: number; // 0.0 to 1.0 - how closely to adhere to original voice
  style?: number; // 0.0 to 1.0 - style exaggeration (Eleven v3 only)
  use_speaker_boost?: boolean; // boosts similarity to original speaker
  speed?: number; // 0.25 to 4.0 - speech speed (1.0 is default)
}

// Voice Information Interface
export interface Voice {
  voice_id: string;
  name: string;
  description?: string;
  category: 'generated' | 'cloned' | 'premade' | 'professional' | 'famous' | 'high_quality';
  labels?: Record<string, string>;
  settings?: VoiceSettings;
  preview_url?: string;
  available_for_tiers?: string[];
  verified_languages?: Array<{
    language: string;
    model_id: string;
    accent: string;
    locale: string;
    preview_url: string;
  }>;
}

// Text to Speech Request Options
export interface TextToSpeechOptions {
  text: string;
  voice_id?: string;
  model_id?: string;
  language_code?: string;
  voice_settings?: Partial<VoiceSettings>;
  output_format?: AudioOutputFormat;
  seed?: number; // for deterministic results (0-4294967295)
  previous_text?: string; // for speech continuity
  next_text?: string; // for speech continuity
  apply_text_normalization?: 'auto' | 'on' | 'off';
  apply_language_text_normalization?: boolean;
}

// Audio Output Formats
export type AudioOutputFormat = 
  | 'mp3_22050_32'
  | 'mp3_44100_32'
  | 'mp3_44100_64'
  | 'mp3_44100_96'
  | 'mp3_44100_128'
  | 'mp3_44100_192'
  | 'pcm_16000'
  | 'pcm_22050'
  | 'pcm_24000'
  | 'pcm_44100'
  | 'ulaw_8000'
  | 'alaw_8000'
  | 'opus_48000_32'
  | 'opus_48000_64'
  | 'opus_48000_96'
  | 'opus_48000_128'
  | 'opus_48000_192';

// ElevenLabs Models (focusing on Eleven v3)
export type ElevenLabsModel = 
  | 'eleven_multilingual_v2' // Default, most stable
  | 'eleven_turbo_v2_5' // Fast, good quality
  | 'eleven_flash_v2_5' // Ultra-low latency
  | 'eleven_multilingual_v1' // Legacy
  | 'eleven_monolingual_v1' // Legacy
  | 'eleven_turbo_v2' // Legacy
  | 'eleven_flash_v1' // Legacy
  | 'eleven_multilingual_v2_5' // Legacy
  | 'eleven_turbo_v2_5' // Legacy
  | 'eleven_flash_v2_5'; // Legacy

// Text to Speech Response
export interface TextToSpeechResponse {
  audio: ArrayBuffer;
  request_id?: string;
  model_id: string;
  voice_id: string;
  text: string;
  output_format: AudioOutputFormat;
}

// Voice List Response
export interface VoiceListResponse {
  voices: Voice[];
  has_more: boolean;
  total_count: number;
  next_page_token?: string;
}

// Error Response
export interface ElevenLabsError {
  detail: {
    status: string;
    message: string;
  };
}

// Configuration Interface
export interface ElevenLabsConfig {
  apiKey: string;
  baseUrl?: string;
  defaultVoiceId?: string;
  defaultModelId?: ElevenLabsModel;
  defaultOutputFormat?: AudioOutputFormat;
  defaultVoiceSettings?: Partial<VoiceSettings>;
}

// Streaming Options
export interface StreamingOptions extends Omit<TextToSpeechOptions, 'text'> {
  text: string;
  optimize_streaming_latency?: 0 | 1 | 2 | 3 | 4;
}

// Usage Statistics
export interface UsageStats {
  characters_used: number;
  characters_limit: number;
  can_extend_character_limit: boolean;
  allowed_to_extend_character_limit: boolean;
  next_character_count_reset_unix: number;
  voice_limit: number;
  max_voice_add_edits: number;
  voice_add_edit_counter: number;
  professional_voice_limit: number;
  can_extend_voice_limit: boolean;
  can_use_instant_voice_cloning: boolean;
  can_use_professional_voice_cloning: boolean;
  currency: string;
  status: string;
  tier: string;
  next_invoice: {
    amount_due_cents: number;
    next_payment_attempt_unix: number;
  };
  available_models: string[];
}

// Text to Dialogue Types
export interface TextToDialogueOptions {
  text: string;
  voice_id?: string;
  model_id?: string;
  language_code?: string;
  voice_settings?: Partial<VoiceSettings>;
  output_format?: AudioOutputFormat;
  seed?: number;
  previous_text?: string;
  next_text?: string;
  apply_text_normalization?: 'auto' | 'on' | 'off';
  apply_language_text_normalization?: boolean;
  // Dialogue-specific options
  dialogue_settings?: DialogueSettings;
}

export interface DialogueSettings {
  stability?: 'creative' | 'natural' | 'robust';
  use_audio_tags?: boolean;
  enhance_emotion?: boolean;
  multi_speaker?: boolean;
  speaker_voices?: Record<string, string>; // speaker_name -> voice_id mapping
}

// Audio Tags for Eleven v3
export type AudioTag = 
  // Voice-related tags
  | '[laughs]' | '[laughs harder]' | '[starts laughing]' | '[wheezing]'
  | '[whispers]' | '[sighs]' | '[exhales]' | '[sarcastic]' | '[curious]'
  | '[excited]' | '[crying]' | '[snorts]' | '[mischievously]' | '[happy]'
  | '[sad]' | '[angry]' | '[annoyed]' | '[appalled]' | '[thoughtful]'
  | '[surprised]' | '[chuckles]' | '[clears throat]' | '[short pause]'
  | '[long pause]' | '[exhales sharply]' | '[inhales deeply]' | '[muttering]'
  | '[giggling]' | '[giggles]' | '[frustrated sigh]' | '[happy gasp]'
  | '[delighted]' | '[amazed]' | '[warmly]' | '[nervously]' | '[alarmed]'
  | '[sheepishly]' | '[stifling laughter]' | '[cracking up]' | '[desperately]'
  | '[deadpan]' | '[impressed]' | '[dramatically]' | '[with genuine belly laugh]'
  | '[starting to speak]' | '[jumping in]' | '[overlapping]' | '[interrupting]'
  | '[stopping abruptly]' | '[cautiously]' | '[cheerfully]' | '[indecisive]'
  | '[quizzically]' | '[elated]' | '[professional]' | '[sympathetic]'
  | '[questioning]' | '[reassuring]'
  // Sound effects
  | '[gunshot]' | '[applause]' | '[clapping]' | '[explosion]' | '[swallows]'
  | '[gulps]' | '[leaves rustling]' | '[gentle footsteps]' | '[football]'
  | '[wrestling match]' | '[auctioneer]'
  // Unique and special
  | '[sings]' | '[woo]' | '[fart]' | '[strong French accent]' | '[strong Russian accent]'
  | '[strong X accent]' // Replace X with desired accent
  // Custom tags (users can create their own)
  | string;

// Text to Dialogue Response
export interface TextToDialogueResponse {
  audio: ArrayBuffer;
  request_id?: string;
  model_id: string;
  voice_id: string;
  text: string;
  output_format: AudioOutputFormat;
  dialogue_settings?: DialogueSettings;
}

// Dialogue Enhancement Options
export interface DialogueEnhancementOptions {
  enhance_emotion?: boolean;
  add_audio_tags?: boolean;
  preserve_original_text?: boolean;
  max_tags_per_sentence?: number;
  custom_tags?: string[];
}

// Multi-speaker Dialogue
export interface MultiSpeakerDialogue {
  speakers: Array<{
    name: string;
    voice_id: string;
    lines: string[];
  }>;
  settings?: DialogueSettings;
}

// Language Codes (ISO 639-1)
export type LanguageCode = 
  | 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'pl' | 'tr' | 'ru' | 'nl'
  | 'cs' | 'ar' | 'zh' | 'ja' | 'hu' | 'ko' | 'hi' | 'th' | 'sv' | 'da'
  | 'no' | 'fi' | 'uk' | 'bg' | 'hr' | 'sk' | 'sl' | 'et' | 'lv' | 'lt'
  | 'ro' | 'el' | 'he' | 'id' | 'ms' | 'tl' | 'vi' | 'ta' | 'te' | 'kn'
  | 'ml' | 'bn' | 'gu' | 'mr' | 'ne' | 'pa' | 'ur' | 'fa' | 'sw' | 'am'
  | 'az' | 'be' | 'bs' | 'ca' | 'ceb' | 'co' | 'cy' | 'eo' | 'eu' | 'fy'
  | 'ga' | 'gl' | 'ha' | 'haw' | 'is' | 'jw' | 'ka' | 'kk' | 'km' | 'ku'
  | 'ky' | 'la' | 'lb' | 'lo' | 'mk' | 'mt' | 'my' | 'ny' | 'ps' | 'si'
  | 'so' | 'sq' | 'su' | 'tg' | 'tk' | 'uz' | 'yi' | 'yo' | 'zu';

// Language information for better UX
export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
  modelSupport: {
    eleven_v3: boolean;
    eleven_multilingual_v2: boolean;
    eleven_turbo_v2_5: boolean;
  };
}

// Sound Effects Types
export interface SoundEffectOptions {
  text: string;
  duration_seconds?: number; // 0.5 to 30 seconds
  loop?: boolean; // Enable seamless looping
  prompt_influence?: number; // 0 to 1, how strictly to follow prompt
  model_id?: string; // Default: eleven_text_to_sound_v2
  output_format?: AudioOutputFormat;
}

export interface SoundEffectResponse {
  audio: ArrayBuffer;
  text: string;
  duration_seconds?: number;
  loop?: boolean;
  prompt_influence?: number;
  model_id: string;
  output_format: AudioOutputFormat;
}

// Sound Effects Categories
export type SoundEffectCategory = 
  | 'impact' | 'whoosh' | 'ambience' | 'one_shot' | 'loop' | 'stem' 
  | 'braam' | 'glitch' | 'drone' | 'musical' | 'foley' | 'cinematic'
  | 'nature' | 'mechanical' | 'electronic' | 'vocal' | 'atmospheric';

// Sound Effects Prompting Guide
export interface SoundEffectPrompt {
  category: SoundEffectCategory;
  description: string;
  examples: string[];
  tips: string[];
}

// Sound Effects Model Information
export interface SoundEffectModel {
  model_id: string;
  name: string;
  description: string;
  capabilities: string[];
  max_duration: number;
  supports_looping: boolean;
}

// Voice Design Types
export interface VoiceDesignOptions {
  voice_description: string; // 20-1000 characters
  model_id?: 'eleven_multilingual_ttv_v2' | 'eleven_ttv_v3';
  text?: string; // 100-1000 characters for preview
  auto_generate_text?: boolean;
  loudness?: number; // -1 to 1, default 0.5
  seed?: number; // 0 to 2147483647
  guidance_scale?: number; // 0 to 100, default 5
  stream_previews?: boolean;
  remixing_session_id?: string;
  remixing_session_iteration_id?: string;
  quality?: number; // -1 to 1
  reference_audio_base64?: string; // Only for eleven_ttv_v3
  prompt_strength?: number; // 0 to 1, only with reference audio
  output_format?: AudioOutputFormat;
}

export interface VoiceDesignPreview {
  audio_base_64: string;
  generated_voice_id: string;
  media_type: string;
  duration_secs: number;
  language: string;
}

export interface VoiceDesignResponse {
  previews: VoiceDesignPreview[];
  text: string;
}

export interface CreateVoiceOptions {
  voice_name: string;
  voice_description: string; // 20-1000 characters
  generated_voice_id: string;
  labels?: Record<string, string>;
  played_not_selected_voice_ids?: string[];
}

export interface CreateVoiceResponse {
  voice_id: string;
  name: string;
  category?: string;
  fine_tuning?: any;
  labels?: Record<string, string>;
  description?: string;
  preview_url?: string;
  available_for_tiers?: string[];
  settings?: VoiceSettings;
  sharing?: any;
  high_quality_base_model_ids?: string[];
  verified_languages?: any[];
  safety_control?: string;
  voice_verification?: any;
  permission_on_resource?: string;
  is_owner?: boolean;
  is_legacy?: boolean;
  is_mixed?: boolean;
  favorited_at_unix?: number;
  created_at_unix?: number;
}

// Voice Design Prompting Guide
export interface VoiceDesignPrompt {
  category: string;
  description: string;
  examples: string[];
  tips: string[];
  recommended_guidance_scale: number;
  recommended_text_length: number;
}

// Voice Design Attributes
export interface VoiceDesignAttributes {
  age: string[];
  accent: string[];
  gender: string[];
  tone_timbre_pitch: string[];
  pacing: string[];
  audio_quality: string[];
  character_profession: string[];
  emotion: string[];
  pitch: string[];
}

// Voice Design Example
export interface VoiceDesignExample {
  voice_type: string;
  prompt: string;
  text_preview: string;
  guidance_scale: number;
  model_id: 'eleven_multilingual_ttv_v2' | 'eleven_ttv_v3';
  expected_characteristics: string[];
}

// Eleven Music Types
export interface MusicComposeOptions {
  prompt?: string;
  composition_plan?: CompositionPlan;
  music_length_ms?: number; // 10000 to 300000 (10 seconds to 5 minutes)
  output_format?: AudioOutputFormat;
}

export interface MusicComposeResponse {
  audio: ArrayBuffer;
  filename?: string;
  music_length_ms: number;
  prompt?: string;
  composition_plan?: CompositionPlan;
  output_format: AudioOutputFormat;
}

export interface MusicComposeDetailedResponse {
  audio: ArrayBuffer;
  json: {
    composition_plan: CompositionPlan;
    song_metadata: SongMetadata;
  };
  filename: string;
  music_length_ms: number;
  prompt?: string;
  output_format: AudioOutputFormat;
}

export interface MusicStreamOptions {
  prompt?: string;
  composition_plan?: CompositionPlan;
  music_length_ms?: number;
  output_format?: AudioOutputFormat;
}

export interface CompositionPlan {
  positiveGlobalStyles: string[];
  negativeGlobalStyles: string[];
  sections: MusicSection[];
}

export interface MusicSection {
  sectionName: string;
  positiveLocalStyles: string[];
  negativeLocalStyles: string[];
  durationMs: number;
  lines: MusicLine[];
}

export interface MusicLine {
  text: string;
  startTimeMs: number;
  endTimeMs: number;
}

export interface SongMetadata {
  title?: string;
  artist?: string;
  genre?: string;
  tempo?: number;
  key?: string;
  duration_ms: number;
  language?: string;
}

export interface CompositionPlanOptions {
  prompt: string;
  music_length_ms?: number;
}

export interface CompositionPlanResponse {
  positiveGlobalStyles: string[];
  negativeGlobalStyles: string[];
  sections: MusicSection[];
}

// Music Categories and Genres
export type MusicGenre = 
  | 'electronic' | 'rock' | 'pop' | 'hip-hop' | 'jazz' | 'classical' | 'country' | 'blues'
  | 'folk' | 'reggae' | 'funk' | 'soul' | 'r&b' | 'metal' | 'punk' | 'indie' | 'alternative'
  | 'ambient' | 'techno' | 'house' | 'trance' | 'dubstep' | 'drum-and-bass' | 'synthwave'
  | 'lo-fi' | 'chill' | 'cinematic' | 'orchestral' | 'acoustic' | 'experimental' | 'world'
  | 'latin' | 'flamenco' | 'salsa' | 'bossa-nova' | 'tango' | 'samba' | 'reggaeton'
  | 'k-pop' | 'j-pop' | 'anime' | 'video-game' | 'trailer' | 'corporate' | 'advertising';

export type MusicMood = 
  | 'energetic' | 'calm' | 'happy' | 'sad' | 'melancholic' | 'uplifting' | 'dramatic'
  | 'mysterious' | 'romantic' | 'aggressive' | 'peaceful' | 'nostalgic' | 'epic'
  | 'intense' | 'relaxing' | 'dark' | 'bright' | 'emotional' | 'powerful' | 'gentle'
  | 'fierce' | 'dreamy' | 'atmospheric' | 'driving' | 'contemplative' | 'celebratory'
  | 'ominous' | 'hopeful' | 'triumphant' | 'brooding' | 'playful' | 'serious';

export type MusicInstrument = 
  | 'piano' | 'guitar' | 'bass' | 'drums' | 'violin' | 'cello' | 'viola' | 'flute'
  | 'saxophone' | 'trumpet' | 'trombone' | 'clarinet' | 'oboe' | 'bassoon' | 'harp'
  | 'organ' | 'synthesizer' | 'electric-guitar' | 'acoustic-guitar' | 'bass-guitar'
  | 'drum-machine' | 'sampler' | 'vocals' | 'choir' | 'strings' | 'brass' | 'woodwinds'
  | 'percussion' | 'bells' | 'chimes' | 'xylophone' | 'marimba' | 'vibraphone'
  | 'accordion' | 'harmonica' | 'banjo' | 'mandolin' | 'ukulele' | 'sitar' | 'tabla';

export type MusicStructure = 
  | 'intro' | 'verse' | 'chorus' | 'bridge' | 'outro' | 'breakdown' | 'drop' | 'buildup'
  | 'pre-chorus' | 'post-chorus' | 'instrumental' | 'solo' | 'interlude' | 'coda'
  | 'verse-1' | 'verse-2' | 'chorus-1' | 'chorus-2' | 'bridge-1' | 'bridge-2';

// Music Prompting Guide
export interface MusicPrompt {
  category: string;
  description: string;
  examples: string[];
  tips: string[];
  recommended_duration_ms: number;
  common_instruments: MusicInstrument[];
  common_moods: MusicMood[];
}

// Music Example
export interface MusicExample {
  title: string;
  prompt: string;
  genre: MusicGenre;
  mood: MusicMood;
  duration_ms: number;
  instruments: MusicInstrument[];
  structure: MusicStructure[];
  use_case: string;
  description: string;
}
