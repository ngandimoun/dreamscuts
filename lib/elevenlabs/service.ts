/**
 * ElevenLabs Service
 * 
 * Main service class for ElevenLabs Text to Speech integration.
 * Focuses on Eleven v3 model and essential TTS functionality.
 */

import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { pricingManager } from './pricing-manager';
import type {
  ElevenLabsConfig,
  TextToSpeechOptions,
  TextToSpeechResponse,
  TextToDialogueOptions,
  TextToDialogueResponse,
  SoundEffectOptions,
  SoundEffectResponse,
  VoiceDesignOptions,
  VoiceDesignResponse,
  CreateVoiceOptions,
  CreateVoiceResponse,
  MusicComposeOptions,
  MusicComposeResponse,
  MusicComposeDetailedResponse,
  MusicStreamOptions,
  CompositionPlanOptions,
  CompositionPlanResponse,
  VoiceListResponse,
  Voice,
  VoiceSettings,
  AudioOutputFormat,
  ElevenLabsModel,
  LanguageCode,
  UsageStats,
  StreamingOptions,
  DialogueSettings
} from './types';

export class ElevenLabsService {
  private client: ElevenLabsClient;
  private config: ElevenLabsConfig;

  constructor(config?: Partial<ElevenLabsConfig>) {
    this.config = {
      apiKey: config?.apiKey || process.env.ELEVENLABS_API_KEY || '',
      baseUrl: config?.baseUrl || 'https://api.elevenlabs.io',
      defaultVoiceId: config?.defaultVoiceId || process.env.ELEVENLABS_DEFAULT_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb',
      defaultModelId: config?.defaultModelId || (process.env.ELEVENLABS_DEFAULT_MODEL_ID as ElevenLabsModel) || 'eleven_multilingual_v2',
      defaultOutputFormat: config?.defaultOutputFormat || 'mp3_44100_128',
      defaultVoiceSettings: config?.defaultVoiceSettings || {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true,
        speed: 1.0
      }
    };

    if (!this.config.apiKey) {
      throw new Error('ElevenLabs API key is required. Set ELEVENLABS_API_KEY environment variable or pass it in config.');
    }

    this.client = new ElevenLabsClient({
      apiKey: this.config.apiKey
    });
  }

  /**
   * Convert text to speech using ElevenLabs API
   */
  async textToSpeech(options: TextToSpeechOptions): Promise<TextToSpeechResponse> {
    try {
      const {
        text,
        voice_id = this.config.defaultVoiceId,
        model_id = this.config.defaultModelId,
        language_code,
        voice_settings = this.config.defaultVoiceSettings,
        output_format = this.config.defaultOutputFormat,
        seed,
        previous_text,
        next_text,
        apply_text_normalization = 'auto',
        apply_language_text_normalization = false
      } = options;

      if (!voice_id) {
        throw new Error('Voice ID is required for text to speech conversion');
      }

      const audio = await this.client.textToSpeech.convert(voice_id, {
        text,
        modelId: model_id,
        languageCode: language_code,
        voiceSettings: voice_settings,
        outputFormat: output_format,
        seed,
        previousText: previous_text,
        nextText: next_text,
        applyTextNormalization: apply_text_normalization,
        applyLanguageTextNormalization: apply_language_text_normalization
      });

      return {
        audio,
        model_id: model_id!,
        voice_id: voice_id,
        text,
        output_format: output_format!
      };
    } catch (error) {
      console.error('Text to Speech conversion failed:', error);
      throw new Error(`Text to Speech conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Convert text to speech with streaming support
   */
  async textToSpeechStream(options: StreamingOptions): Promise<AsyncIterable<Uint8Array>> {
    try {
      const {
        text,
        voice_id = this.config.defaultVoiceId,
        model_id = this.config.defaultModelId,
        language_code,
        voice_settings = this.config.defaultVoiceSettings,
        output_format = this.config.defaultOutputFormat,
        optimize_streaming_latency = 0,
        seed,
        previous_text,
        next_text,
        apply_text_normalization = 'auto',
        apply_language_text_normalization = false
      } = options;

      if (!voice_id) {
        throw new Error('Voice ID is required for streaming text to speech conversion');
      }

      const audioStream = await this.client.textToSpeech.stream(voice_id, {
        text,
        modelId: model_id,
        languageCode: language_code,
        voiceSettings: voice_settings,
        outputFormat: output_format,
        optimizeStreamingLatency: optimize_streaming_latency,
        seed,
        previousText: previous_text,
        nextText: next_text,
        applyTextNormalization: apply_text_normalization,
        applyLanguageTextNormalization: apply_language_text_normalization
      });

      return audioStream;
    } catch (error) {
      console.error('Streaming Text to Speech conversion failed:', error);
      throw new Error(`Streaming Text to Speech conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get list of available voices
   */
  async getVoices(options?: {
    search?: string;
    category?: string;
    voice_type?: string;
    page_size?: number;
    include_total_count?: boolean;
  }): Promise<VoiceListResponse> {
    try {
      const response = await this.client.voices.search({
        search: options?.search,
        category: options?.category as any,
        voiceType: options?.voice_type as any,
        pageSize: options?.page_size || 10,
        includeTotalCount: options?.include_total_count ?? true
      });

      return {
        voices: response.voices.map(voice => ({
          voice_id: voice.voice_id,
          name: voice.name || 'Unknown',
          description: voice.description,
          category: voice.category as any,
          labels: voice.labels,
          settings: voice.settings ? {
            stability: voice.settings.stability || 0.5,
            similarity_boost: voice.settings.similarity_boost || 0.75,
            style: voice.settings.style || 0.0,
            use_speaker_boost: voice.settings.use_speaker_boost || false,
            speed: voice.settings.speed || 1.0
          } : undefined,
          preview_url: voice.preview_url,
          available_for_tiers: voice.available_for_tiers,
          verified_languages: voice.verified_languages?.map(lang => ({
            language: lang.language,
            model_id: lang.model_id,
            accent: lang.accent,
            locale: lang.locale,
            preview_url: lang.preview_url
          }))
        })),
        has_more: response.has_more,
        total_count: response.total_count,
        next_page_token: response.next_page_token
      };
    } catch (error) {
      console.error('Failed to fetch voices:', error);
      throw new Error(`Failed to fetch voices: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get a specific voice by ID
   */
  async getVoice(voiceId: string): Promise<Voice | null> {
    try {
      const voices = await this.getVoices();
      return voices.voices.find(voice => voice.voice_id === voiceId) || null;
    } catch (error) {
      console.error(`Failed to fetch voice ${voiceId}:`, error);
      return null;
    }
  }

  /**
   * Get user's usage statistics
   */
  async getUsageStats(): Promise<UsageStats> {
    try {
      const response = await this.client.user.get();
      
      return {
        characters_used: response.subscription?.character_count || 0,
        characters_limit: response.subscription?.character_limit || 0,
        can_extend_character_limit: response.subscription?.can_extend_character_limit || false,
        allowed_to_extend_character_limit: response.subscription?.allowed_to_extend_character_limit || false,
        next_character_count_reset_unix: response.subscription?.next_character_count_reset_unix || 0,
        voice_limit: response.subscription?.voice_limit || 0,
        max_voice_add_edits: response.subscription?.max_voice_add_edits || 0,
        voice_add_edit_counter: response.subscription?.voice_add_edit_counter || 0,
        professional_voice_limit: response.subscription?.professional_voice_limit || 0,
        can_extend_voice_limit: response.subscription?.can_extend_voice_limit || false,
        can_use_instant_voice_cloning: response.subscription?.can_use_instant_voice_cloning || false,
        can_use_professional_voice_cloning: response.subscription?.can_use_professional_voice_cloning || false,
        currency: response.subscription?.currency || 'USD',
        status: response.subscription?.status || 'unknown',
        tier: response.subscription?.tier || 'free',
        next_invoice: {
          amount_due_cents: response.subscription?.next_invoice?.amount_due_cents || 0,
          next_payment_attempt_unix: response.subscription?.next_invoice?.next_payment_attempt_unix || 0
        },
        available_models: response.subscription?.available_models || []
      };
    } catch (error) {
      console.error('Failed to fetch usage stats:', error);
      throw new Error(`Failed to fetch usage stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get available models
   */
  async getModels(): Promise<Array<{ model_id: string; name: string; can_do_text_to_speech: boolean; can_do_voice_conversion: boolean; can_use_style: boolean; can_use_speaker_boost: boolean; serves_pro_voices: boolean; token_cost_factor: number; max_characters_request_free_user: number; max_characters_request_subscribed_user: number; languages: Array<{ language_id: string; name: string }> }>> {
    try {
      const response = await this.client.models.getAll();
      
      return response.map(model => ({
        model_id: model.model_id,
        name: model.name,
        can_do_text_to_speech: model.can_do_text_to_speech,
        can_do_voice_conversion: model.can_do_voice_conversion,
        can_use_style: model.can_use_style,
        can_use_speaker_boost: model.can_use_speaker_boost,
        serves_pro_voices: model.serves_pro_voices,
        token_cost_factor: model.token_cost_factor,
        max_characters_request_free_user: model.max_characters_request_free_user,
        max_characters_request_subscribed_user: model.max_characters_request_subscribed_user,
        languages: model.languages?.map(lang => ({
          language_id: lang.language_id,
          name: lang.name
        })) || []
      }));
    } catch (error) {
      console.error('Failed to fetch models:', error);
      throw new Error(`Failed to fetch models: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate API key and connection
   */
  async validateConnection(): Promise<boolean> {
    try {
      await this.getUsageStats();
      return true;
    } catch (error) {
      console.error('ElevenLabs connection validation failed:', error);
      return false;
    }
  }

  /**
   * Convert text to dialogue using Eleven v3 model with audio tags
   */
  async textToDialogue(options: TextToDialogueOptions): Promise<TextToDialogueResponse> {
    try {
      const {
        text,
        voice_id = this.config.defaultVoiceId,
        model_id = 'eleven_multilingual_v2', // Eleven v3 is the default for dialogue
        language_code,
        voice_settings = this.config.defaultVoiceSettings,
        output_format = this.config.defaultOutputFormat,
        seed,
        previous_text,
        next_text,
        apply_text_normalization = 'auto',
        apply_language_text_normalization = false,
        dialogue_settings
      } = options;

      if (!voice_id) {
        throw new Error('Voice ID is required for text to dialogue conversion');
      }

      // Apply dialogue-specific voice settings if provided
      let finalVoiceSettings = voice_settings;
      if (dialogue_settings?.stability) {
        finalVoiceSettings = {
          ...voice_settings,
          stability: this.getStabilityValue(dialogue_settings.stability),
          style: dialogue_settings.stability === 'creative' ? 0.7 : 
                 dialogue_settings.stability === 'natural' ? 0.3 : 0.1
        };
      }

      const audio = await this.client.textToSpeech.convert(voice_id, {
        text,
        modelId: model_id,
        languageCode: language_code,
        voiceSettings: finalVoiceSettings,
        outputFormat: output_format,
        seed,
        previousText: previous_text,
        nextText: next_text,
        applyTextNormalization: apply_text_normalization,
        applyLanguageTextNormalization: apply_language_text_normalization
      });

      return {
        audio,
        model_id: model_id!,
        voice_id: voice_id,
        text,
        output_format: output_format!,
        dialogue_settings
      };
    } catch (error) {
      console.error('Text to Dialogue conversion failed:', error);
      throw new Error(`Text to Dialogue conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Convert multi-speaker dialogue to speech
   */
  async multiSpeakerDialogue(options: {
    speakers: Array<{ name: string; voice_id: string; lines: string[] }>;
    dialogue_settings?: DialogueSettings;
    output_format?: AudioOutputFormat;
  }): Promise<Array<{ speaker: string; voice_id: string; audio: ArrayBuffer; text: string }>> {
    try {
      const results = [];

      for (const speaker of options.speakers) {
        for (const line of speaker.lines) {
          const result = await this.textToDialogue({
            text: line,
            voice_id: speaker.voice_id,
            model_id: 'eleven_multilingual_v2',
            output_format: options.output_format || this.config.defaultOutputFormat,
            dialogue_settings: options.dialogue_settings
          });

          results.push({
            speaker: speaker.name,
            voice_id: speaker.voice_id,
            audio: result.audio,
            text: line
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Multi-speaker dialogue conversion failed:', error);
      throw new Error(`Multi-speaker dialogue conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate sound effects from text description
   */
  async generateSoundEffect(options: SoundEffectOptions): Promise<SoundEffectResponse> {
    try {
      const {
        text,
        duration_seconds,
        loop = false,
        prompt_influence = 0.3,
        model_id = 'eleven_text_to_sound_v2',
        output_format = this.config.defaultOutputFormat
      } = options;

      if (!text.trim()) {
        throw new Error('Text description is required for sound effect generation');
      }

      // Validate duration if provided
      if (duration_seconds !== undefined) {
        if (duration_seconds < 0.5 || duration_seconds > 30) {
          throw new Error('Duration must be between 0.5 and 30 seconds');
        }
      }

      // Validate prompt influence
      if (prompt_influence < 0 || prompt_influence > 1) {
        throw new Error('Prompt influence must be between 0 and 1');
      }

      const audio = await this.client.textToSoundEffects.convert({
        text,
        duration_seconds,
        loop,
        prompt_influence,
        model_id,
        output_format
      });

      return {
        audio,
        text,
        duration_seconds,
        loop,
        prompt_influence,
        model_id,
        output_format
      };
    } catch (error) {
      console.error('Sound effect generation failed:', error);
      throw new Error(`Sound effect generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Design a voice from text description
   */
  async designVoice(options: VoiceDesignOptions): Promise<VoiceDesignResponse> {
    try {
      const {
        voice_description,
        model_id = 'eleven_multilingual_ttv_v2',
        text,
        auto_generate_text = false,
        loudness = 0.5,
        seed,
        guidance_scale = 5,
        stream_previews = false,
        remixing_session_id,
        remixing_session_iteration_id,
        quality,
        reference_audio_base64,
        prompt_strength,
        output_format = this.config.defaultOutputFormat
      } = options;

      if (!voice_description.trim()) {
        throw new Error('Voice description is required for voice design');
      }

      if (voice_description.length < 20 || voice_description.length > 1000) {
        throw new Error('Voice description must be between 20 and 1000 characters');
      }

      // Validate text if provided
      if (text && (text.length < 100 || text.length > 1000)) {
        throw new Error('Preview text must be between 100 and 1000 characters');
      }

      // Validate loudness
      if (loudness < -1 || loudness > 1) {
        throw new Error('Loudness must be between -1 and 1');
      }

      // Validate guidance scale
      if (guidance_scale < 0 || guidance_scale > 100) {
        throw new Error('Guidance scale must be between 0 and 100');
      }

      // Validate seed
      if (seed !== undefined && (seed < 0 || seed > 2147483647)) {
        throw new Error('Seed must be between 0 and 2147483647');
      }

      // Validate quality
      if (quality !== undefined && (quality < -1 || quality > 1)) {
        throw new Error('Quality must be between -1 and 1');
      }

      // Validate prompt strength
      if (prompt_strength !== undefined && (prompt_strength < 0 || prompt_strength > 1)) {
        throw new Error('Prompt strength must be between 0 and 1');
      }

      const response = await this.client.textToVoice.design({
        voice_description,
        model_id,
        text,
        auto_generate_text,
        loudness,
        seed,
        guidance_scale,
        stream_previews,
        remixing_session_id,
        remixing_session_iteration_id,
        quality,
        reference_audio_base64,
        prompt_strength,
        output_format
      });

      return response;
    } catch (error) {
      console.error('Voice design failed:', error);
      throw new Error(`Voice design failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a voice from a generated voice preview
   */
  async createVoice(options: CreateVoiceOptions): Promise<CreateVoiceResponse> {
    try {
      const {
        voice_name,
        voice_description,
        generated_voice_id,
        labels,
        played_not_selected_voice_ids
      } = options;

      if (!voice_name.trim()) {
        throw new Error('Voice name is required');
      }

      if (!voice_description.trim()) {
        throw new Error('Voice description is required');
      }

      if (voice_description.length < 20 || voice_description.length > 1000) {
        throw new Error('Voice description must be between 20 and 1000 characters');
      }

      if (!generated_voice_id.trim()) {
        throw new Error('Generated voice ID is required');
      }

      const response = await this.client.textToVoice.create({
        voice_name,
        voice_description,
        generated_voice_id,
        labels,
        played_not_selected_voice_ids
      });

      return response;
    } catch (error) {
      console.error('Voice creation failed:', error);
      throw new Error(`Voice creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Compose music from text prompt
   */
  async composeMusic(options: MusicComposeOptions): Promise<MusicComposeResponse> {
    try {
      const {
        prompt,
        composition_plan,
        music_length_ms = 30000, // Default 30 seconds
        output_format = this.config.defaultOutputFormat
      } = options;

      if (!prompt && !composition_plan) {
        throw new Error('Either prompt or composition_plan is required for music composition');
      }

      // Validate duration
      if (music_length_ms < 10000 || music_length_ms > 300000) {
        throw new Error('Music length must be between 10 seconds (10000ms) and 5 minutes (300000ms)');
      }

      const audio = await this.client.music.compose({
        prompt,
        composition_plan,
        music_length_ms,
        output_format
      });

      return {
        audio,
        music_length_ms,
        prompt,
        composition_plan,
        output_format
      };
    } catch (error) {
      console.error('Music composition failed:', error);
      throw new Error(`Music composition failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Compose music with detailed response including composition plan
   */
  async composeMusicDetailed(options: MusicComposeOptions): Promise<MusicComposeDetailedResponse> {
    try {
      const {
        prompt,
        composition_plan,
        music_length_ms = 30000,
        output_format = this.config.defaultOutputFormat
      } = options;

      if (!prompt && !composition_plan) {
        throw new Error('Either prompt or composition_plan is required for music composition');
      }

      // Validate duration
      if (music_length_ms < 10000 || music_length_ms > 300000) {
        throw new Error('Music length must be between 10 seconds (10000ms) and 5 minutes (300000ms)');
      }

      const response = await this.client.music.composeDetailed({
        prompt,
        composition_plan,
        music_length_ms,
        output_format
      });

      return {
        audio: response.audio,
        json: response.json,
        filename: response.filename,
        music_length_ms,
        prompt,
        output_format
      };
    } catch (error) {
      console.error('Detailed music composition failed:', error);
      throw new Error(`Detailed music composition failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Stream music composition
   */
  async *streamMusic(options: MusicStreamOptions): AsyncGenerator<ArrayBuffer, void, unknown> {
    try {
      const {
        prompt,
        composition_plan,
        music_length_ms = 30000,
        output_format = this.config.defaultOutputFormat
      } = options;

      if (!prompt && !composition_plan) {
        throw new Error('Either prompt or composition_plan is required for music streaming');
      }

      // Validate duration
      if (music_length_ms < 10000 || music_length_ms > 300000) {
        throw new Error('Music length must be between 10 seconds (10000ms) and 5 minutes (300000ms)');
      }

      const stream = await this.client.music.stream({
        prompt,
        composition_plan,
        music_length_ms,
        output_format
      });

      for await (const chunk of stream) {
        if (chunk) {
          yield chunk;
        }
      }
    } catch (error) {
      console.error('Music streaming failed:', error);
      throw new Error(`Music streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a composition plan from prompt
   */
  async createCompositionPlan(options: CompositionPlanOptions): Promise<CompositionPlanResponse> {
    try {
      const {
        prompt,
        music_length_ms = 30000
      } = options;

      if (!prompt.trim()) {
        throw new Error('Prompt is required for composition plan creation');
      }

      // Validate duration
      if (music_length_ms < 10000 || music_length_ms > 300000) {
        throw new Error('Music length must be between 10 seconds (10000ms) and 5 minutes (300000ms)');
      }

      const response = await this.client.music.compositionPlan.create({
        prompt,
        music_length_ms
      });

      return response;
    } catch (error) {
      console.error('Composition plan creation failed:', error);
      throw new Error(`Composition plan creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Track usage for billing and monitoring
   */
  trackUsage(service: string, creditsUsed: number, details: {
    user_id?: string;
    session_id?: string;
    text_length?: number;
    duration_seconds?: number;
    model_used?: string;
    voice_id?: string;
    output_format?: string;
    music_length_ms?: number;
    sound_effect_duration?: number;
    metadata?: Record<string, any>;
  }): void {
    try {
      const costCalculation = pricingManager.calculateCost(creditsUsed);
      
      pricingManager.recordUsage({
        service,
        user_id: details.user_id,
        session_id: details.session_id,
        credits_used: creditsUsed,
        cost_usd: costCalculation.total_cost,
        details: {
          text_length: details.text_length,
          duration_seconds: details.duration_seconds,
          model_used: details.model_used,
          voice_id: details.voice_id,
          output_format: details.output_format,
          music_length_ms: details.music_length_ms,
          sound_effect_duration: details.sound_effect_duration
        },
        metadata: details.metadata
      });
    } catch (error) {
      console.error('Usage tracking failed:', error);
      // Don't throw error to avoid breaking the main functionality
    }
  }

  /**
   * Estimate cost for a request before making it
   */
  estimateCost(service: string, details: {
    text_length?: number;
    duration_seconds?: number;
    duration_ms?: number;
    model?: string;
  }): { credits: number; cost_usd: number } {
    return pricingManager.estimateCost(service, details);
  }

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
  }

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
  }

  /**
   * Get current pricing plan
   */
  getCurrentPlan() {
    return pricingManager.getCurrentPlan();
  }

  /**
   * Set pricing plan
   */
  setPricingPlan(planName: string) {
    pricingManager.setPlan(planName);
  }

  /**
   * Get recommended plan based on usage
   */
  getRecommendedPlan(monthlyCredits: number) {
    return pricingManager.getRecommendedPlan(monthlyCredits);
  }

  /**
   * Convert stability setting to numeric value
   */
  private getStabilityValue(stability: 'creative' | 'natural' | 'robust'): number {
    const stabilityMap = {
      creative: 0.3,
      natural: 0.5,
      robust: 0.8
    };
    return stabilityMap[stability];
  }

  /**
   * Get default configuration
   */
  getConfig(): ElevenLabsConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<ElevenLabsConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Recreate client if API key changed
    if (newConfig.apiKey) {
      this.client = new ElevenLabsClient({
        apiKey: this.config.apiKey
      });
    }
  }
}

// Export a default instance
export const elevenLabsService = new ElevenLabsService();
