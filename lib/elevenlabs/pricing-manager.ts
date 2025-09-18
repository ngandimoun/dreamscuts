/**
 * ElevenLabs Pricing Manager
 * 
 * Comprehensive pricing and usage tracking for ElevenLabs API services
 * Based on official ElevenLabs pricing as of 2024
 */

// ElevenLabs Pricing Plans
export interface ElevenLabsPlan {
  name: string;
  cost: number; // Monthly cost in USD
  credits: number; // Monthly credits included
  features: string[];
  usage_examples: {
    tts_multilingual_v2_minutes: number;
    tts_flash_v2_5_minutes: number;
    conversational_ai_minutes: number;
  };
  additional_credits_cost?: number; // Cost per additional credit
  seats?: number;
  commercial_license: boolean;
  music_api: boolean;
  voice_cloning: boolean;
  professional_voice_cloning: boolean;
  pcm_audio: boolean;
  multi_seat: boolean;
  custom_terms: boolean;
}

// Service-specific pricing
export interface ServicePricing {
  service: string;
  unit: 'character' | 'second' | 'minute' | 'generation';
  credits_per_unit: number;
  description: string;
}

// Usage tracking
export interface UsageRecord {
  id: string;
  timestamp: Date;
  service: string;
  user_id?: string;
  session_id?: string;
  credits_used: number;
  cost_usd: number;
  details: {
    text_length?: number;
    duration_seconds?: number;
    model_used?: string;
    voice_id?: string;
    output_format?: string;
    music_length_ms?: number;
    sound_effect_duration?: number;
  };
  metadata?: Record<string, any>;
}

// Cost calculation result
export interface CostCalculation {
  credits_used: number;
  cost_usd: number;
  plan_credits_remaining: number;
  overage_credits?: number;
  overage_cost?: number;
  total_cost: number;
  breakdown: {
    included_credits_cost: number;
    overage_cost: number;
  };
}

// Pricing Plans (as of 2024)
export const ELEVENLABS_PLANS: ElevenLabsPlan[] = [
  {
    name: 'Free',
    cost: 0,
    credits: 10000,
    features: [
      'Text to Speech API',
      'Speech to Text API',
      'Voice Isolator API',
      'Voice Changer API',
      'Dubbing API',
      'Conversational AI API'
    ],
    usage_examples: {
      tts_multilingual_v2_minutes: 10,
      tts_flash_v2_5_minutes: 20,
      conversational_ai_minutes: 15
    },
    commercial_license: false,
    music_api: false,
    voice_cloning: false,
    professional_voice_cloning: false,
    pcm_audio: false,
    multi_seat: false,
    custom_terms: false
  },
  {
    name: 'Starter',
    cost: 5,
    credits: 30000,
    features: [
      'All Free features',
      'Commercial license',
      'Instant Voice Cloning',
      'Dubbing Studio API',
      'Eleven Music API'
    ],
    usage_examples: {
      tts_multilingual_v2_minutes: 30,
      tts_flash_v2_5_minutes: 60,
      conversational_ai_minutes: 50
    },
    commercial_license: true,
    music_api: true,
    voice_cloning: true,
    professional_voice_cloning: false,
    pcm_audio: false,
    multi_seat: false,
    custom_terms: false
  },
  {
    name: 'Creator',
    cost: 22,
    credits: 100000,
    features: [
      'All Starter features',
      'Professional Voice Cloning',
      'Usage-based billing for additional credits',
      'Higher quality audio at 192 kbps'
    ],
    usage_examples: {
      tts_multilingual_v2_minutes: 100,
      tts_flash_v2_5_minutes: 200,
      conversational_ai_minutes: 250
    },
    additional_credits_cost: 0.0003, // $0.30 per 1000 credits
    commercial_license: true,
    music_api: true,
    voice_cloning: true,
    professional_voice_cloning: true,
    pcm_audio: false,
    multi_seat: false,
    custom_terms: false
  },
  {
    name: 'Pro',
    cost: 99,
    credits: 500000,
    features: [
      'All Creator features',
      '44.1kHz PCM audio output via API'
    ],
    usage_examples: {
      tts_multilingual_v2_minutes: 500,
      tts_flash_v2_5_minutes: 1000,
      conversational_ai_minutes: 1100
    },
    additional_credits_cost: 0.0002, // $0.20 per 1000 credits
    commercial_license: true,
    music_api: true,
    voice_cloning: true,
    professional_voice_cloning: true,
    pcm_audio: true,
    multi_seat: false,
    custom_terms: false
  },
  {
    name: 'Scale',
    cost: 330,
    credits: 2000000,
    features: [
      'All Pro features',
      'Multi-seat Workspace'
    ],
    usage_examples: {
      tts_multilingual_v2_minutes: 2000,
      tts_flash_v2_5_minutes: 4000,
      conversational_ai_minutes: 3600
    },
    additional_credits_cost: 0.00015, // $0.15 per 1000 credits
    seats: 3,
    commercial_license: true,
    music_api: true,
    voice_cloning: true,
    professional_voice_cloning: true,
    pcm_audio: true,
    multi_seat: true,
    custom_terms: false
  },
  {
    name: 'Business',
    cost: 1320,
    credits: 11000000,
    features: [
      'All Scale features',
      'Low-latency TTS as low as 5c/minute',
      '3 Professional Voice Clones'
    ],
    usage_examples: {
      tts_multilingual_v2_minutes: 11000,
      tts_flash_v2_5_minutes: 22000,
      conversational_ai_minutes: 13750
    },
    additional_credits_cost: 0.0001, // $0.10 per 1000 credits
    seats: 5,
    commercial_license: true,
    music_api: true,
    voice_cloning: true,
    professional_voice_cloning: true,
    pcm_audio: true,
    multi_seat: true,
    custom_terms: false
  },
  {
    name: 'Enterprise',
    cost: 0, // Custom pricing
    credits: 0, // Custom credits
    features: [
      'All Business features',
      'Custom terms & assurance around DPA/SLAs',
      'BAAs for HIPAA customers',
      'Custom SSO',
      'More seats and voices',
      'Elevated concurrency limits',
      'ElevenStudios fully managed dubbing',
      'Significant discounts at scale',
      'Priority support'
    ],
    usage_examples: {
      tts_multilingual_v2_minutes: 0,
      tts_flash_v2_5_minutes: 0,
      conversational_ai_minutes: 0
    },
    commercial_license: true,
    music_api: true,
    voice_cloning: true,
    professional_voice_cloning: true,
    pcm_audio: true,
    multi_seat: true,
    custom_terms: true
  }
];

// Service-specific pricing (credits per unit)
export const SERVICE_PRICING: ServicePricing[] = [
  {
    service: 'text_to_speech',
    unit: 'character',
    credits_per_unit: 1,
    description: '1 character = 1 credit'
  },
  {
    service: 'speech_to_text',
    unit: 'second',
    credits_per_unit: 1,
    description: '1 second of audio = 1 credit'
  },
  {
    service: 'voice_cloning_instant',
    unit: 'generation',
    credits_per_unit: 1000,
    description: 'Instant voice cloning = 1000 credits per generation'
  },
  {
    service: 'voice_cloning_professional',
    unit: 'generation',
    credits_per_unit: 10000,
    description: 'Professional voice cloning = 10000 credits per generation'
  },
  {
    service: 'voice_design',
    unit: 'generation',
    credits_per_unit: 1000,
    description: 'Voice design = 1000 credits per generation (3 previews)'
  },
  {
    service: 'music_generation',
    unit: 'minute',
    credits_per_unit: 2000, // Estimated based on pricing
    description: 'Music generation = ~2000 credits per minute'
  },
  {
    service: 'sound_effects',
    unit: 'generation',
    credits_per_unit: 500, // Estimated
    description: 'Sound effects = ~500 credits per generation'
  },
  {
    service: 'conversational_ai',
    unit: 'minute',
    credits_per_unit: 100,
    description: 'Conversational AI = ~100 credits per minute'
  }
];

export class PricingManager {
  private usageRecords: UsageRecord[] = [];
  private currentPlan: ElevenLabsPlan;

  constructor(planName: string = 'Free') {
    this.currentPlan = this.getPlan(planName);
  }

  /**
   * Get pricing plan by name
   */
  getPlan(planName: string): ElevenLabsPlan {
    const plan = ELEVENLABS_PLANS.find(p => p.name.toLowerCase() === planName.toLowerCase());
    if (!plan) {
      throw new Error(`Plan "${planName}" not found`);
    }
    return plan;
  }

  /**
   * Get all available plans
   */
  getAllPlans(): ElevenLabsPlan[] {
    return ELEVENLABS_PLANS;
  }

  /**
   * Get service pricing
   */
  getServicePricing(service: string): ServicePricing | undefined {
    return SERVICE_PRICING.find(p => p.service === service);
  }

  /**
   * Calculate credits for text-to-speech
   */
  calculateTTSCredits(text: string, model?: string): number {
    const textLength = text.length;
    // Base calculation: 1 character = 1 credit
    let credits = textLength;
    
    // Model-specific adjustments (if any)
    if (model?.includes('flash')) {
      // Flash models might be more efficient
      credits = Math.ceil(credits * 0.8);
    }
    
    return credits;
  }

  /**
   * Calculate credits for music generation
   */
  calculateMusicCredits(durationMs: number): number {
    const durationMinutes = durationMs / 60000;
    const musicPricing = this.getServicePricing('music_generation');
    if (!musicPricing) return 0;
    
    return Math.ceil(durationMinutes * musicPricing.credits_per_unit);
  }

  /**
   * Calculate credits for sound effects
   */
  calculateSoundEffectCredits(durationSeconds?: number): number {
    const soundEffectPricing = this.getServicePricing('sound_effects');
    if (!soundEffectPricing) return 0;
    
    // Base cost for sound effect generation
    let credits = soundEffectPricing.credits_per_unit;
    
    // Add duration-based cost if provided
    if (durationSeconds) {
      credits += Math.ceil(durationSeconds * 10); // 10 credits per second
    }
    
    return credits;
  }

  /**
   * Calculate credits for voice design
   */
  calculateVoiceDesignCredits(): number {
    const voiceDesignPricing = this.getServicePricing('voice_design');
    return voiceDesignPricing?.credits_per_unit || 1000;
  }

  /**
   * Calculate total cost including overages
   */
  calculateCost(creditsUsed: number, plan?: ElevenLabsPlan): CostCalculation {
    const planToUse = plan || this.currentPlan;
    const planCredits = planToUse.credits;
    const planCost = planToUse.cost;
    
    let overageCredits = 0;
    let overageCost = 0;
    
    if (creditsUsed > planCredits) {
      overageCredits = creditsUsed - planCredits;
      if (planToUse.additional_credits_cost) {
        overageCost = overageCredits * planToUse.additional_credits_cost;
      }
    }
    
    const totalCost = planCost + overageCost;
    
    return {
      credits_used: creditsUsed,
      cost_usd: totalCost,
      plan_credits_remaining: Math.max(0, planCredits - creditsUsed),
      overage_credits: overageCredits > 0 ? overageCredits : undefined,
      overage_cost: overageCost > 0 ? overageCost : undefined,
      total_cost: totalCost,
      breakdown: {
        included_credits_cost: planCost,
        overage_cost: overageCost
      }
    };
  }

  /**
   * Record usage
   */
  recordUsage(record: Omit<UsageRecord, 'id' | 'timestamp'>): UsageRecord {
    const usageRecord: UsageRecord = {
      id: this.generateId(),
      timestamp: new Date(),
      ...record
    };
    
    this.usageRecords.push(usageRecord);
    return usageRecord;
  }

  /**
   * Get usage records
   */
  getUsageRecords(filters?: {
    user_id?: string;
    service?: string;
    start_date?: Date;
    end_date?: Date;
  }): UsageRecord[] {
    let records = [...this.usageRecords];
    
    if (filters) {
      if (filters.user_id) {
        records = records.filter(r => r.user_id === filters.user_id);
      }
      if (filters.service) {
        records = records.filter(r => r.service === filters.service);
      }
      if (filters.start_date) {
        records = records.filter(r => r.timestamp >= filters.start_date!);
      }
      if (filters.end_date) {
        records = records.filter(r => r.timestamp <= filters.end_date!);
      }
    }
    
    return records;
  }

  /**
   * Get usage summary
   */
  getUsageSummary(filters?: {
    user_id?: string;
    service?: string;
    start_date?: Date;
    end_date?: Date;
  }): {
    total_credits: number;
    total_cost: number;
    service_breakdown: Record<string, { credits: number; cost: number; count: number }>;
    daily_usage: Record<string, { credits: number; cost: number; count: number }>;
  } {
    const records = this.getUsageRecords(filters);
    
    let totalCredits = 0;
    let totalCost = 0;
    const serviceBreakdown: Record<string, { credits: number; cost: number; count: number }> = {};
    const dailyUsage: Record<string, { credits: number; cost: number; count: number }> = {};
    
    for (const record of records) {
      totalCredits += record.credits_used;
      totalCost += record.cost_usd;
      
      // Service breakdown
      if (!serviceBreakdown[record.service]) {
        serviceBreakdown[record.service] = { credits: 0, cost: 0, count: 0 };
      }
      serviceBreakdown[record.service].credits += record.credits_used;
      serviceBreakdown[record.service].cost += record.cost_usd;
      serviceBreakdown[record.service].count += 1;
      
      // Daily usage
      const dateKey = record.timestamp.toISOString().split('T')[0];
      if (!dailyUsage[dateKey]) {
        dailyUsage[dateKey] = { credits: 0, cost: 0, count: 0 };
      }
      dailyUsage[dateKey].credits += record.credits_used;
      dailyUsage[dateKey].cost += record.cost_usd;
      dailyUsage[dateKey].count += 1;
    }
    
    return {
      total_credits: totalCredits,
      total_cost: totalCost,
      service_breakdown: serviceBreakdown,
      daily_usage: dailyUsage
    };
  }

  /**
   * Estimate cost for a request
   */
  estimateCost(service: string, details: {
    text_length?: number;
    duration_seconds?: number;
    duration_ms?: number;
    model?: string;
  }): { credits: number; cost_usd: number } {
    let credits = 0;
    
    switch (service) {
      case 'text_to_speech':
        if (details.text_length) {
          credits = this.calculateTTSCredits('x'.repeat(details.text_length), details.model);
        }
        break;
      case 'music_generation':
        if (details.duration_ms) {
          credits = this.calculateMusicCredits(details.duration_ms);
        }
        break;
      case 'sound_effects':
        credits = this.calculateSoundEffectCredits(details.duration_seconds);
        break;
      case 'voice_design':
        credits = this.calculateVoiceDesignCredits();
        break;
      default:
        const servicePricing = this.getServicePricing(service);
        if (servicePricing) {
          if (servicePricing.unit === 'character' && details.text_length) {
            credits = details.text_length * servicePricing.credits_per_unit;
          } else if (servicePricing.unit === 'second' && details.duration_seconds) {
            credits = details.duration_seconds * servicePricing.credits_per_unit;
          } else if (servicePricing.unit === 'minute' && details.duration_seconds) {
            credits = (details.duration_seconds / 60) * servicePricing.credits_per_unit;
          } else if (servicePricing.unit === 'generation') {
            credits = servicePricing.credits_per_unit;
          }
        }
    }
    
    const costCalculation = this.calculateCost(credits);
    return {
      credits,
      cost_usd: costCalculation.total_cost
    };
  }

  /**
   * Get recommended plan based on usage
   */
  getRecommendedPlan(monthlyCredits: number): ElevenLabsPlan {
    // Find the most cost-effective plan
    let bestPlan = ELEVENLABS_PLANS[0];
    let bestCostPerCredit = Infinity;
    
    for (const plan of ELEVENLABS_PLANS) {
      if (plan.name === 'Enterprise') continue; // Skip enterprise for recommendations
      
      const totalCost = plan.cost + (Math.max(0, monthlyCredits - plan.credits) * (plan.additional_credits_cost || 0.0003));
      const costPerCredit = totalCost / monthlyCredits;
      
      if (costPerCredit < bestCostPerCredit) {
        bestCostPerCredit = costPerCredit;
        bestPlan = plan;
      }
    }
    
    return bestPlan;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Set current plan
   */
  setPlan(planName: string): void {
    this.currentPlan = this.getPlan(planName);
  }

  /**
   * Get current plan
   */
  getCurrentPlan(): ElevenLabsPlan {
    return this.currentPlan;
  }

  /**
   * Clear usage records
   */
  clearUsageRecords(): void {
    this.usageRecords = [];
  }

  /**
   * Export usage data
   */
  exportUsageData(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['id', 'timestamp', 'service', 'user_id', 'credits_used', 'cost_usd', 'details'];
      const rows = this.usageRecords.map(record => [
        record.id,
        record.timestamp.toISOString(),
        record.service,
        record.user_id || '',
        record.credits_used,
        record.cost_usd,
        JSON.stringify(record.details)
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    return JSON.stringify(this.usageRecords, null, 2);
  }
}

// Export default instance
export const pricingManager = new PricingManager();
