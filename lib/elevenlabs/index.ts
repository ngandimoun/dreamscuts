/**
 * ElevenLabs Integration
 * 
 * Main export file for ElevenLabs Text to Speech functionality.
 * Provides a clean API for integrating ElevenLabs into your application.
 */

// Core service and utilities
export { ElevenLabsService, elevenLabsService } from './service';
export { VoiceManager, voiceManager } from './voice-manager';
export { DialogueManager, dialogueManager } from './dialogue-manager';
export { V3VoiceLibrary, v3VoiceLibrary } from './v3-voice-library';
export { LanguageManager, languageManager } from './language-manager';
export { V3PromptingGuide, v3PromptingGuide } from './v3-prompting-guide';
export { SoundEffectsManager, soundEffectsManager } from './sound-effects-manager';
export { VoiceDesignManager, voiceDesignManager } from './voice-design-manager';
export { MusicManager, musicManager } from './music-manager';
export { PricingManager, pricingManager } from './pricing-manager';
export { AudioUtils } from './audio-utils';

// Types
export type {
  ElevenLabsConfig,
  TextToSpeechOptions,
  TextToSpeechResponse,
  TextToDialogueOptions,
  TextToDialogueResponse,
  DialogueSettings,
  AudioTag,
  DialogueEnhancementOptions,
  MultiSpeakerDialogue,
  VoiceListResponse,
  Voice,
  VoiceSettings,
  AudioOutputFormat,
  ElevenLabsModel,
  LanguageCode,
  UsageStats,
  StreamingOptions,
  ElevenLabsError
} from './types';

// V3 Voice Library types
export type { V3Voice } from './v3-voice-library';

// Language Manager types
export type { LanguageInfo } from './types';

// Sound Effects types
export type { 
  SoundEffectOptions, 
  SoundEffectResponse, 
  SoundEffectCategory, 
  SoundEffectPrompt, 
  SoundEffectModel 
} from './types';

// Voice Design types
export type { 
  VoiceDesignOptions, 
  VoiceDesignResponse, 
  VoiceDesignPreview,
  CreateVoiceOptions,
  CreateVoiceResponse,
  VoiceDesignPrompt,
  VoiceDesignAttributes,
  VoiceDesignExample
} from './types';

// Music types
export type { 
  MusicComposeOptions, 
  MusicComposeResponse, 
  MusicComposeDetailedResponse,
  MusicStreamOptions,
  CompositionPlan,
  CompositionPlanOptions,
  CompositionPlanResponse,
  MusicSection,
  MusicLine,
  SongMetadata,
  MusicGenre,
  MusicMood,
  MusicInstrument,
  MusicStructure,
  MusicPrompt,
  MusicExample
} from './types';

// Pricing types
export type { 
  ElevenLabsPlan,
  ServicePricing,
  UsageRecord,
  CostCalculation
} from './pricing-manager';

// Re-export ElevenLabs client for advanced usage
export { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

// Convenience functions for common operations
export const elevenLabs = {
  /**
   * Quick text to speech conversion
   */
  async speak(text: string, options?: {
    voiceId?: string;
    modelId?: string;
    languageCode?: LanguageCode;
    outputFormat?: AudioOutputFormat;
    voiceSettings?: Partial<VoiceSettings>;
  }) {
    return elevenLabsService.textToSpeech({
      text,
      ...options
    });
  },

  /**
   * Get available voices
   */
  async getVoices() {
    return voiceManager.getVoices();
  },

  /**
   * Find voice by name
   */
  async findVoice(name: string) {
    const voices = await voiceManager.findVoicesByName(name);
    return voices[0] || null;
  },

  /**
   * Get recommended voices for different use cases
   */
  async getRecommendedVoices() {
    return voiceManager.getRecommendedVoices();
  },

  /**
   * Play audio directly
   */
  async playAudio(audioBuffer: ArrayBuffer, format: AudioOutputFormat = 'mp3_44100_128') {
    return AudioUtils.playAudio(audioBuffer, format);
  },

  /**
   * Download audio as file
   */
  downloadAudio(audioBuffer: ArrayBuffer, filename: string, format: AudioOutputFormat = 'mp3_44100_128') {
    return AudioUtils.downloadAudio(audioBuffer, filename, format);
  },

  /**
   * Create audio player with controls
   */
  createAudioPlayer(audioBuffer: ArrayBuffer, format: AudioOutputFormat = 'mp3_44100_128') {
    return AudioUtils.createAudioPlayer(audioBuffer, format);
  },

  /**
   * Get usage statistics
   */
  async getUsageStats() {
    return elevenLabsService.getUsageStats();
  },

  /**
   * Validate API connection
   */
  async validateConnection() {
    return elevenLabsService.validateConnection();
  },

  /**
   * Convert text to dialogue with audio tags
   */
  async dialogue(text: string, options?: {
    voiceId?: string;
    modelId?: string;
    languageCode?: LanguageCode;
    outputFormat?: AudioOutputFormat;
    voiceSettings?: Partial<VoiceSettings>;
    dialogueSettings?: DialogueSettings;
  }) {
    return elevenLabsService.textToDialogue({
      text,
      ...options
    });
  },

  /**
   * Create multi-speaker dialogue
   */
  async multiSpeakerDialogue(speakers: Array<{ name: string; voice_id: string; lines: string[] }>, options?: {
    dialogueSettings?: DialogueSettings;
    outputFormat?: AudioOutputFormat;
  }) {
    return elevenLabsService.multiSpeakerDialogue({
      speakers,
      ...options
    });
  },

  /**
   * Enhance text with audio tags
   */
  enhanceTextWithAudioTags(text: string, options?: DialogueEnhancementOptions) {
    return dialogueManager.enhanceTextWithAudioTags(text, options);
  },

  /**
   * Get available audio tags
   */
  getAudioTags() {
    return dialogueManager.getAllAudioTags();
  },

  /**
   * Get audio tags by category
   */
  getAudioTagsByCategory(category: 'emotions' | 'nonVerbal' | 'speechFlow' | 'soundEffects' | 'special') {
    return dialogueManager.getAudioTagsByCategory(category);
  },

  /**
   * Get dialogue examples
   */
  getDialogueExamples() {
    return dialogueManager.getDialogueExamples();
  },

  /**
   * Get V3 optimized voices
   */
  getV3Voices() {
    return v3VoiceLibrary.getAllV3Voices();
  },

  /**
   * Get V3 voices by category
   */
  getV3VoicesByCategory(category: 'NARRATIVE' | 'CONVERSATIONAL' | 'CHARACTERS' | 'SOCIAL_MEDIA' | 'PROFESSIONAL' | 'GAMING' | 'AUDIOBOOKS') {
    return v3VoiceLibrary.getVoicesByCategory(category);
  },

  /**
   * Get V3 voices by recommendation
   */
  getV3VoicesByRecommendation(type: 'DIALOGUE_EXCELLENT' | 'PROFESSIONAL' | 'CHARACTERS' | 'SOCIAL_MEDIA' | 'AUDIOBOOKS') {
    return v3VoiceLibrary.getVoicesByRecommendation(type);
  },

  /**
   * Search V3 voices
   */
  searchV3Voices(query: string) {
    return v3VoiceLibrary.searchVoices(query);
  },

  /**
   * Get V3 voice by ID
   */
  getV3VoiceById(voiceId: string) {
    return v3VoiceLibrary.getVoiceById(voiceId);
  },

  /**
   * Get recommended settings for V3 voice
   */
  getV3VoiceSettings(voiceId: string) {
    return v3VoiceLibrary.getRecommendedSettings(voiceId);
  },

  /**
   * Get all supported languages
   */
  getSupportedLanguages() {
    return languageManager.getAllLanguages();
  },

  /**
   * Get languages by model
   */
  getLanguagesByModel(model: 'eleven_v3' | 'eleven_multilingual_v2' | 'eleven_turbo_v2_5') {
    return languageManager.getLanguagesByModel(model);
  },

  /**
   * Get language info by code
   */
  getLanguageByCode(code: string) {
    return languageManager.getLanguageByCode(code as any);
  },

  /**
   * Search languages
   */
  searchLanguages(query: string) {
    return languageManager.searchLanguages(query);
  },

  /**
   * Get major languages
   */
  getMajorLanguages() {
    return languageManager.getMajorLanguages();
  },

  /**
   * Detect language from text
   */
  detectLanguageFromText(text: string) {
    return languageManager.detectLanguageFromText(text);
  },

  /**
   * Get recommended language for voice
   */
  getRecommendedLanguageForVoice(voiceId: string, text: string) {
    return languageManager.getRecommendedLanguageForVoice(voiceId, text);
  },

  /**
   * Get V3 prompting guide features
   */
  getV3PromptingGuide() {
    return v3PromptingGuide;
  },

  /**
   * Get V3 audio tags
   */
  getV3AudioTags() {
    return v3PromptingGuide.getAllV3AudioTags();
  },

  /**
   * Get V3 stability settings
   */
  getV3StabilitySettings() {
    return v3PromptingGuide.getV3StabilitySettings();
  },

  /**
   * Get V3 voice guidance
   */
  getV3VoiceGuidance() {
    return v3PromptingGuide.getV3VoiceGuidance();
  },

  /**
   * Get V3 examples
   */
  getV3Examples() {
    return v3PromptingGuide.getV3Examples();
  },

  /**
   * Get recommended V3 voice settings
   */
  getRecommendedV3VoiceSettings(stability: 'creative' | 'natural' | 'robust') {
    return v3PromptingGuide.getRecommendedV3VoiceSettings(stability);
  },

  /**
   * Get recommended V3 dialogue settings
   */
  getRecommendedV3DialogueSettings(stability: 'creative' | 'natural' | 'robust') {
    return v3PromptingGuide.getRecommendedV3DialogueSettings(stability);
  },

  /**
   * Validate V3 text length
   */
  validateV3TextLength(text: string) {
    return v3PromptingGuide.validateV3TextLength(text);
  },

  /**
   * Get V3 punctuation guidance
   */
  getV3PunctuationGuidance() {
    return v3PromptingGuide.getPunctuationGuidance();
  },

  /**
   * Get V3 tag combination recommendations
   */
  getV3TagCombinationRecommendations() {
    return v3PromptingGuide.getTagCombinationRecommendations();
  },

  /**
   * Get V3 voice matching recommendations
   */
  getV3VoiceMatchingRecommendations() {
    return v3PromptingGuide.getVoiceMatchingRecommendations();
  },

  /**
   * Generate sound effects from text description
   */
  async generateSoundEffect(text: string, options?: {
    duration_seconds?: number;
    loop?: boolean;
    prompt_influence?: number;
    model_id?: string;
    output_format?: AudioOutputFormat;
  }) {
    return elevenLabsService.generateSoundEffect({
      text,
      ...options
    });
  },

  /**
   * Get sound effects manager
   */
  getSoundEffectsManager() {
    return soundEffectsManager;
  },

  /**
   * Get sound effect models
   */
  getSoundEffectModels() {
    return soundEffectsManager.getSoundEffectModels();
  },

  /**
   * Get sound effect categories
   */
  getSoundEffectCategories() {
    return soundEffectsManager.getSoundEffectCategories();
  },

  /**
   * Get prompting guide for sound effect category
   */
  getSoundEffectPromptingGuide(category: SoundEffectCategory) {
    return soundEffectsManager.getPromptingGuide(category);
  },

  /**
   * Search sound effect examples
   */
  searchSoundEffectExamples(keyword: string) {
    return soundEffectsManager.searchSoundEffectExamples(keyword);
  },

  /**
   * Get recommended sound effect options
   */
  getRecommendedSoundEffectOptions(category: SoundEffectCategory, text: string) {
    return soundEffectsManager.getRecommendedOptions(category, text);
  },

  /**
   * Validate sound effect text
   */
  validateSoundEffectText(text: string) {
    return soundEffectsManager.validateSoundEffectText(text);
  },

  /**
   * Get random sound effect example
   */
  getRandomSoundEffectExample(category?: SoundEffectCategory) {
    return soundEffectsManager.getRandomExample(category);
  },

  /**
   * Get popular sound effect combinations
   */
  getPopularSoundEffectCombinations() {
    return soundEffectsManager.getPopularCombinations();
  },

  /**
   * Design a voice from text description
   */
  async designVoice(voiceDescription: string, options?: {
    model_id?: 'eleven_multilingual_ttv_v2' | 'eleven_ttv_v3';
    text?: string;
    auto_generate_text?: boolean;
    loudness?: number;
    seed?: number;
    guidance_scale?: number;
    stream_previews?: boolean;
    quality?: number;
    reference_audio_base64?: string;
    prompt_strength?: number;
    output_format?: AudioOutputFormat;
  }) {
    return elevenLabsService.designVoice({
      voice_description: voiceDescription,
      ...options
    });
  },

  /**
   * Create a voice from a generated voice preview
   */
  async createVoice(voiceName: string, voiceDescription: string, generatedVoiceId: string, options?: {
    labels?: Record<string, string>;
    played_not_selected_voice_ids?: string[];
  }) {
    return elevenLabsService.createVoice({
      voice_name: voiceName,
      voice_description: voiceDescription,
      generated_voice_id: generatedVoiceId,
      ...options
    });
  },

  /**
   * Get voice design manager
   */
  getVoiceDesignManager() {
    return voiceDesignManager;
  },

  /**
   * Get voice design models
   */
  getVoiceDesignModels() {
    return voiceDesignManager.getVoiceDesignModels();
  },

  /**
   * Get voice design categories
   */
  getVoiceDesignCategories() {
    return voiceDesignManager.getVoiceDesignCategories();
  },

  /**
   * Get prompting guide for voice design category
   */
  getVoiceDesignPromptingGuide(category: string) {
    return voiceDesignManager.getPromptingGuide(category);
  },

  /**
   * Get voice design attributes
   */
  getVoiceDesignAttributes() {
    return voiceDesignManager.getVoiceDesignAttributes();
  },

  /**
   * Get voice design examples
   */
  getVoiceDesignExamples() {
    return voiceDesignManager.getVoiceDesignExamples();
  },

  /**
   * Search voice design examples
   */
  searchVoiceDesignExamples(keyword: string) {
    return voiceDesignManager.searchExamples(keyword);
  },

  /**
   * Get recommended voice design options
   */
  getRecommendedVoiceDesignOptions(category: string, voiceDescription: string) {
    return voiceDesignManager.getRecommendedOptions(category, voiceDescription);
  },

  /**
   * Validate voice description
   */
  validateVoiceDescription(description: string) {
    return voiceDesignManager.validateVoiceDescription(description);
  },

  /**
   * Generate preview text for voice description
   */
  generateVoicePreviewText(voiceDescription: string, category?: string) {
    return voiceDesignManager.generatePreviewText(voiceDescription, category);
  },

  /**
   * Analyze voice description
   */
  analyzeVoiceDescription(description: string) {
    return voiceDesignManager.analyzeVoiceDescription(description);
  },

  /**
   * Get random voice design example
   */
  getRandomVoiceDesignExample() {
    return voiceDesignManager.getRandomExample();
  },

  /**
   * Compose music from text prompt
   */
  async composeMusic(prompt: string, options?: {
    music_length_ms?: number;
    output_format?: AudioOutputFormat;
  }) {
    return elevenLabsService.composeMusic({
      prompt,
      ...options
    });
  },

  /**
   * Compose music with detailed response
   */
  async composeMusicDetailed(prompt: string, options?: {
    music_length_ms?: number;
    output_format?: AudioOutputFormat;
  }) {
    return elevenLabsService.composeMusicDetailed({
      prompt,
      ...options
    });
  },

  /**
   * Stream music composition
   */
  async *streamMusic(prompt: string, options?: {
    music_length_ms?: number;
    output_format?: AudioOutputFormat;
  }) {
    yield* elevenLabsService.streamMusic({
      prompt,
      ...options
    });
  },

  /**
   * Create composition plan from prompt
   */
  async createCompositionPlan(prompt: string, musicLengthMs?: number) {
    return elevenLabsService.createCompositionPlan({
      prompt,
      music_length_ms: musicLengthMs
    });
  },

  /**
   * Get music manager
   */
  getMusicManager() {
    return musicManager;
  },

  /**
   * Get music genres
   */
  getMusicGenres() {
    return musicManager.getMusicGenres();
  },

  /**
   * Get music moods
   */
  getMusicMoods() {
    return musicManager.getMusicMoods();
  },

  /**
   * Get music instruments
   */
  getMusicInstruments() {
    return musicManager.getMusicInstruments();
  },

  /**
   * Get music structures
   */
  getMusicStructures() {
    return musicManager.getMusicStructures();
  },

  /**
   * Get music categories
   */
  getMusicCategories() {
    return musicManager.getMusicCategories();
  },

  /**
   * Get music prompting guide
   */
  getMusicPromptingGuide(category: string) {
    return musicManager.getPromptingGuide(category);
  },

  /**
   * Get music examples
   */
  getMusicExamples() {
    return musicManager.getMusicExamples();
  },

  /**
   * Search music examples
   */
  searchMusicExamples(keyword: string) {
    return musicManager.searchExamples(keyword);
  },

  /**
   * Generate music prompt
   */
  generateMusicPrompt(params: {
    genre?: string;
    mood?: string;
    instruments?: string[];
    structure?: string[];
    useCase?: string;
    duration?: number;
    includeVocals?: boolean;
    tempo?: number;
    key?: string;
    customDescription?: string;
  }) {
    return musicManager.generatePrompt(params);
  },

  /**
   * Validate music prompt
   */
  validateMusicPrompt(prompt: string) {
    return musicManager.validatePrompt(prompt);
  },

  /**
   * Analyze music prompt
   */
  analyzeMusicPrompt(prompt: string) {
    return musicManager.analyzePrompt(prompt);
  },

  /**
   * Get random music example
   */
  getRandomMusicExample() {
    return musicManager.getRandomExample();
  },

  /**
   * Create composition plan from parameters
   */
  createCompositionPlanFromParams(params: {
    genre: string;
    mood: string;
    instruments: string[];
    structure: string[];
    duration: number;
    includeVocals?: boolean;
  }) {
    return musicManager.createCompositionPlan(params);
  },

  /**
   * Get pricing manager
   */
  getPricingManager() {
    return pricingManager;
  },

  /**
   * Get all pricing plans
   */
  getPricingPlans() {
    return pricingManager.getAllPlans();
  },

  /**
   * Get current pricing plan
   */
  getCurrentPricingPlan() {
    return pricingManager.getCurrentPlan();
  },

  /**
   * Set pricing plan
   */
  setPricingPlan(planName: string) {
    pricingManager.setPlan(planName);
  },

  /**
   * Estimate cost for a request
   */
  estimateCost(service: string, details: {
    text_length?: number;
    duration_seconds?: number;
    duration_ms?: number;
    model?: string;
  }) {
    return pricingManager.estimateCost(service, details);
  },

  /**
   * Get usage summary
   */
  getUsageSummary(filters?: {
    user_id?: string;
    service?: string;
    start_date?: Date;
    end_date?: Date;
  }) {
    return pricingManager.getUsageSummary(filters);
  },

  /**
   * Get usage records
   */
  getUsageRecords(filters?: {
    user_id?: string;
    service?: string;
    start_date?: Date;
    end_date?: Date;
  }) {
    return pricingManager.getUsageRecords(filters);
  },

  /**
   * Get recommended plan based on usage
   */
  getRecommendedPlan(monthlyCredits: number) {
    return pricingManager.getRecommendedPlan(monthlyCredits);
  },

  /**
   * Calculate cost for credits used
   */
  calculateCost(creditsUsed: number, planName?: string) {
    const plan = planName ? pricingManager.getPlan(planName) : undefined;
    return pricingManager.calculateCost(creditsUsed, plan);
  },

  /**
   * Calculate TTS credits
   */
  calculateTTSCredits(text: string, model?: string) {
    return pricingManager.calculateTTSCredits(text, model);
  },

  /**
   * Calculate music credits
   */
  calculateMusicCredits(durationMs: number) {
    return pricingManager.calculateMusicCredits(durationMs);
  },

  /**
   * Calculate sound effect credits
   */
  calculateSoundEffectCredits(durationSeconds?: number) {
    return pricingManager.calculateSoundEffectCredits(durationSeconds);
  },

  /**
   * Calculate voice design credits
   */
  calculateVoiceDesignCredits() {
    return pricingManager.calculateVoiceDesignCredits();
  },

  /**
   * Export usage data
   */
  exportUsageData(format: 'json' | 'csv' = 'json') {
    return pricingManager.exportUsageData(format);
  }
};

// Default export for easy importing
export default elevenLabs;
