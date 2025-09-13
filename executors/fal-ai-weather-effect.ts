import { fal } from "@fal-ai/client";

export interface WeatherEffectInput {
  image_url: string;
  prompt?: string;
  guidance_scale?: number;
  num_inference_steps?: number;
  safety_tolerance?: "1" | "2" | "3" | "4" | "5" | "6";
  output_format?: "jpeg" | "png";
  aspect_ratio?: "21:9" | "16:9" | "4:3" | "3:2" | "1:1" | "2:3" | "3:4" | "9:16" | "9:21";
  seed?: number;
  sync_mode?: boolean;
}

export interface WeatherEffectOutput {
  images: Array<{
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
    width?: number;
    height?: number;
  }>;
  seed?: number;
}

export class FalAiWeatherEffectExecutor {
  private modelId = "fal-ai/image-editing/weather-effect";

  /**
   * Apply weather effect to image
   */
  async applyWeather(input: WeatherEffectInput): Promise<WeatherEffectOutput> {
    const params = {
      image_url: input.image_url,
      prompt: input.prompt ?? "heavy snowfall",
      guidance_scale: input.guidance_scale ?? 3.5,
      num_inference_steps: input.num_inference_steps ?? 30,
      safety_tolerance: input.safety_tolerance ?? "2",
      output_format: input.output_format ?? "jpeg",
      aspect_ratio: input.aspect_ratio,
      seed: input.seed,
      sync_mode: input.sync_mode
    };

    const result = await fal.subscribe(this.modelId, {
      input: params
    });

    return result.data as WeatherEffectOutput;
  }

  /**
   * Apply custom weather effect
   */
  async applyCustomWeather(input: WeatherEffectInput & { prompt: string }): Promise<WeatherEffectOutput> {
    return this.applyWeather(input);
  }

  /**
   * Apply weather with custom guidance scale
   */
  async applyWeatherWithGuidance(input: WeatherEffectInput & { guidance_scale: number }): Promise<WeatherEffectOutput> {
    return this.applyWeather(input);
  }

  /**
   * High-quality weather effect with quality settings
   */
  async applyWeatherHighQuality(input: WeatherEffectInput & { 
    num_inference_steps: number; 
    guidance_scale: number 
  }): Promise<WeatherEffectOutput> {
    return this.applyWeather(input);
  }

  /**
   * Fast weather effect with performance settings
   */
  async applyWeatherFast(input: WeatherEffectInput & { 
    num_inference_steps: number; 
    guidance_scale: number 
  }): Promise<WeatherEffectOutput> {
    return this.applyWeather(input);
  }

  /**
   * Apply weather effect to specific aspect ratio
   */
  async applyWeatherToAspectRatio(input: WeatherEffectInput & { aspect_ratio: "21:9" | "16:9" | "4:3" | "3:2" | "1:1" | "2:3" | "3:4" | "9:16" | "9:21" }): Promise<WeatherEffectOutput> {
    return this.applyWeather(input);
  }

  /**
   * Apply weather effect for landscape format (16:9)
   */
  async applyWeatherForLandscape(input: WeatherEffectInput & { aspect_ratio: "16:9" }): Promise<WeatherEffectOutput> {
    return this.applyWeather(input);
  }

  /**
   * Apply weather effect for portrait format (3:4)
   */
  async applyWeatherForPortrait(input: WeatherEffectInput & { aspect_ratio: "3:4" }): Promise<WeatherEffectOutput> {
    return this.applyWeather(input);
  }

  /**
   * Apply weather effect for square format (1:1)
   */
  async applyWeatherForSquare(input: WeatherEffectInput & { aspect_ratio: "1:1" }): Promise<WeatherEffectOutput> {
    return this.applyWeather(input);
  }

  /**
   * Apply weather effect for widescreen format (21:9)
   */
  async applyWeatherForWidescreen(input: WeatherEffectInput & { aspect_ratio: "21:9" }): Promise<WeatherEffectOutput> {
    return this.applyWeather(input);
  }

  /**
   * Apply weather effect with custom safety tolerance
   */
  async applyWeatherWithSafetyTolerance(input: WeatherEffectInput & { safety_tolerance: "1" | "2" | "3" | "4" | "5" | "6" }): Promise<WeatherEffectOutput> {
    return this.applyWeather(input);
  }

  /**
   * Advanced weather effect with all custom parameters
   */
  async applyWeatherAdvanced(input: WeatherEffectInput & {
    prompt: string;
    aspect_ratio: "21:9" | "16:9" | "4:3" | "3:2" | "1:1" | "2:3" | "3:4" | "9:16" | "9:21";
    guidance_scale: number;
    num_inference_steps: number;
    safety_tolerance: "1" | "2" | "3" | "4" | "5" | "6";
    seed: number;
  }): Promise<WeatherEffectOutput> {
    return this.applyWeather(input);
  }

  /**
   * Get cost estimate for weather effect
   */
  getCostEstimate(): { price: number; unit: string } {
    return {
      price: 0.04,
      unit: "per image"
    };
  }

  /**
   * Get recommended parameters for different use cases
   */
  getRecommendedParameters(useCase: "landscape" | "cinematic" | "photography" | "creative" | "high_quality" | "fast" | "balanced" | "conservative") {
    const recommendations = {
      landscape: { aspect_ratio: "16:9" as const, guidance_scale: 3.5, num_inference_steps: 30, safety_tolerance: "2" as const, prompt: "heavy snowfall" },
      cinematic: { aspect_ratio: "21:9" as const, guidance_scale: 4.0, num_inference_steps: 35, safety_tolerance: "2" as const, prompt: "dramatic storm" },
      photography: { aspect_ratio: "3:2" as const, guidance_scale: 3.5, num_inference_steps: 30, safety_tolerance: "2" as const, prompt: "light rain" },
      creative: { aspect_ratio: "16:9" as const, guidance_scale: 3.5, num_inference_steps: 30, safety_tolerance: "2" as const, prompt: "mystical fog" },
      high_quality: { aspect_ratio: "16:9" as const, guidance_scale: 4.0, num_inference_steps: 40, safety_tolerance: "2" as const, prompt: "heavy snowfall" },
      fast: { aspect_ratio: "16:9" as const, guidance_scale: 3.0, num_inference_steps: 20, safety_tolerance: "2" as const, prompt: "light snow" },
      balanced: { aspect_ratio: "16:9" as const, guidance_scale: 3.5, num_inference_steps: 30, safety_tolerance: "2" as const, prompt: "moderate rain" },
      conservative: { aspect_ratio: "16:9" as const, guidance_scale: 3.5, num_inference_steps: 30, safety_tolerance: "1" as const, prompt: "light fog" }
    };

    return recommendations[useCase];
  }

  /**
   * Get guidance scale guide for weather effects
   */
  getGuidanceScaleGuide(): Array<{ range: string; effect: string; useCase: string }> {
    return [
      { range: "1.0-2.5", effect: "Very loose weather effect", useCase: "Creative reinterpretation" },
      { range: "2.5-3.5", effect: "Balanced weather effect", useCase: "Standard weather application" },
      { range: "3.5-4.5", effect: "Strong weather effect", useCase: "Faithful weather application" },
      { range: "4.5-6.0", effect: "Very strong weather effect", useCase: "Maximum weather control" },
      { range: "6.0-10.0", effect: "Extreme weather effect", useCase: "Experimental use" }
    ];
  }

  /**
   * Get safety tolerance guide
   */
  getSafetyToleranceGuide(): Array<{ level: string; description: string; restrictions: string; useCase: string }> {
    return [
      { level: "1", description: "Most strict", restrictions: "Blocks most content", useCase: "Family-friendly applications" },
      { level: "2", description: "Strict", restrictions: "Blocks explicit content", useCase: "General applications" },
      { level: "3", description: "Moderate", restrictions: "Balanced filtering", useCase: "Standard applications" },
      { level: "4", description: "Permissive", restrictions: "Minimal filtering", useCase: "Creative applications" },
      { level: "5", description: "Very permissive", restrictions: "Very minimal filtering", useCase: "Experimental use" },
      { level: "6", description: "Most permissive", restrictions: "No filtering", useCase: "Unrestricted use" }
    ];
  }

  /**
   * Get aspect ratio guide for weather effects
   */
  getAspectRatioGuide(): Array<{ ratio: string; description: string; useCase: string; examples: string[] }> {
    return [
      { ratio: "21:9", description: "Ultrawide format", useCase: "Cinematic weather effects", examples: ["movie scenes", "gaming content", "ultrawide displays"] },
      { ratio: "16:9", description: "Widescreen format", useCase: "Standard video content", examples: ["YouTube videos", "presentations", "desktop backgrounds"] },
      { ratio: "4:3", description: "Standard format", useCase: "Traditional displays", examples: ["legacy content", "presentations", "documentation"] },
      { ratio: "3:2", description: "Photography format", useCase: "Professional photography", examples: ["DSLR photos", "print media", "professional portfolios"] },
      { ratio: "1:1", description: "Square format", useCase: "Social media platforms", examples: ["Instagram posts", "profile pictures", "social media content"] },
      { ratio: "2:3", description: "Portrait format", useCase: "Portrait photography", examples: ["portrait photos", "mobile content", "vertical displays"] },
      { ratio: "3:4", description: "Portrait format", useCase: "Mobile content, portrait displays", examples: ["mobile apps", "portrait photos", "vertical content"] },
      { ratio: "9:16", description: "Mobile format", useCase: "Mobile apps, social media stories", examples: ["Instagram stories", "TikTok videos", "mobile apps"] },
      { ratio: "9:21", description: "Ultrawide portrait", useCase: "Ultrawide portrait content", examples: ["ultrawide mobile", "specialized displays", "experimental content"] }
    ];
  }

  /**
   * Get weather type recommendations
   */
  getWeatherTypeRecommendations(): Array<{ weather_type: string; prompt: string; guidance_scale: number; description: string }> {
    return [
      { weather_type: "Heavy Snowfall", prompt: "heavy snowfall", guidance_scale: 3.5, description: "Intense winter snowstorm effect" },
      { weather_type: "Light Rain", prompt: "light rain", guidance_scale: 3.5, description: "Gentle rain shower effect" },
      { weather_type: "Heavy Rain", prompt: "heavy rain", guidance_scale: 4.0, description: "Intense rainstorm effect" },
      { weather_type: "Mystical Fog", prompt: "mystical fog", guidance_scale: 3.5, description: "Atmospheric fog effect" },
      { weather_type: "Dramatic Storm", prompt: "dramatic storm", guidance_scale: 4.0, description: "Powerful storm effect" },
      { weather_type: "Light Snow", prompt: "light snow", guidance_scale: 3.5, description: "Gentle snowfall effect" }
    ];
  }

  /**
   * Validate input parameters
   */
  validateInput(input: WeatherEffectInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.image_url) {
      errors.push("image_url is required");
    }

    if (input.guidance_scale !== undefined && (input.guidance_scale < 1.0 || input.guidance_scale > 10.0)) {
      errors.push("guidance_scale must be between 1.0 and 10.0");
    }

    if (input.num_inference_steps !== undefined && (input.num_inference_steps < 10 || input.num_inference_steps > 50)) {
      errors.push("num_inference_steps must be between 10 and 50");
    }

    const validSafetyTolerances = ["1", "2", "3", "4", "5", "6"];
    if (input.safety_tolerance && !validSafetyTolerances.includes(input.safety_tolerance)) {
      errors.push(`safety_tolerance must be one of: ${validSafetyTolerances.join(", ")}`);
    }

    const validOutputFormats = ["jpeg", "png"];
    if (input.output_format && !validOutputFormats.includes(input.output_format)) {
      errors.push(`output_format must be one of: ${validOutputFormats.join(", ")}`);
    }

    const validAspectRatios = ["21:9", "16:9", "4:3", "3:2", "1:1", "2:3", "3:4", "9:16", "9:21"];
    if (input.aspect_ratio && !validAspectRatios.includes(input.aspect_ratio)) {
      errors.push(`aspect_ratio must be one of: ${validAspectRatios.join(", ")}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get effect description based on parameters
   */
  getEffectDescription(prompt: string, guidanceScale: number, inferenceSteps: number, safetyTolerance: string, aspectRatio?: string): string {
    const getGuidanceDescription = (scale: number): string => {
      if (scale < 2.5) return "loose";
      if (scale < 3.5) return "balanced";
      if (scale < 4.5) return "strong";
      if (scale < 6.0) return "very strong";
      return "extreme";
    };

    const getQualityDescription = (steps: number): string => {
      if (steps < 20) return "fast";
      if (steps < 30) return "good";
      if (steps < 40) return "high";
      return "very high";
    };

    const getAspectRatioDescription = (ratio?: string): string => {
      if (!ratio) return "original aspect ratio";
      const descriptions: Record<string, string> = {
        "21:9": "ultrawide",
        "16:9": "widescreen",
        "4:3": "standard",
        "3:2": "photography",
        "1:1": "square",
        "2:3": "portrait",
        "3:4": "portrait",
        "9:16": "mobile",
        "9:21": "ultrawide portrait"
      };
      return descriptions[ratio] || ratio;
    };

    const guidanceDesc = getGuidanceDescription(guidanceScale);
    const qualityDesc = getQualityDescription(inferenceSteps);
    const aspectDesc = getAspectRatioDescription(aspectRatio);

    return `Weather effect ${prompt} with ${guidanceDesc} adherence to original and ${qualityDesc} quality processing in ${aspectDesc} format (guidance: ${guidanceScale}, steps: ${inferenceSteps}, safety: ${safetyTolerance})`;
  }

  /**
   * Calculate processing time estimate
   */
  getProcessingTimeEstimate(inferenceSteps: number): { time: string; category: string } {
    if (inferenceSteps <= 20) {
      return { time: "10-20 seconds", category: "fast" };
    } else if (inferenceSteps <= 30) {
      return { time: "20-35 seconds", category: "moderate" };
    } else if (inferenceSteps <= 40) {
      return { time: "35-50 seconds", category: "slow" };
    } else {
      return { time: "50-70 seconds", category: "very slow" };
    }
  }

  /**
   * Get optimal settings for different content types
   */
  getOptimalSettings(contentType: "landscape" | "cinematic" | "photography" | "creative" | "marketing" | "mixed") {
    const settings = {
      landscape: { aspect_ratio: "16:9" as const, guidance_scale: 3.5, num_inference_steps: 30, safety_tolerance: "2" as const, prompt: "heavy snowfall" },
      cinematic: { aspect_ratio: "21:9" as const, guidance_scale: 4.0, num_inference_steps: 35, safety_tolerance: "2" as const, prompt: "dramatic storm" },
      photography: { aspect_ratio: "3:2" as const, guidance_scale: 3.5, num_inference_steps: 30, safety_tolerance: "2" as const, prompt: "light rain" },
      creative: { aspect_ratio: "16:9" as const, guidance_scale: 3.5, num_inference_steps: 30, safety_tolerance: "2" as const, prompt: "mystical fog" },
      marketing: { aspect_ratio: "16:9" as const, guidance_scale: 4.0, num_inference_steps: 35, safety_tolerance: "2" as const, prompt: "atmospheric mist" },
      mixed: { aspect_ratio: "16:9" as const, guidance_scale: 3.5, num_inference_steps: 30, safety_tolerance: "2" as const, prompt: "moderate rain" }
    };

    return settings[contentType];
  }

  /**
   * Get supported resolutions for different aspect ratios
   */
  getSupportedResolutions(): Array<{ aspect_ratio: string; width: number; height: number; name: string; useCase: string }> {
    return [
      { aspect_ratio: "21:9", width: 2560, height: 1080, name: "ultrawide_hd", useCase: "Ultrawide displays" },
      { aspect_ratio: "16:9", width: 1920, height: 1080, name: "hd_widescreen", useCase: "Standard widescreen" },
      { aspect_ratio: "4:3", width: 1440, height: 1080, name: "standard_4_3", useCase: "Traditional displays" },
      { aspect_ratio: "3:2", width: 1080, height: 720, name: "photography_3_2", useCase: "Professional photography" },
      { aspect_ratio: "1:1", width: 1080, height: 1080, name: "square_social", useCase: "Social media" },
      { aspect_ratio: "2:3", width: 720, height: 1080, name: "portrait_2_3", useCase: "Portrait photography" },
      { aspect_ratio: "3:4", width: 810, height: 1080, name: "portrait_3_4", useCase: "Portrait content" },
      { aspect_ratio: "9:16", width: 1080, height: 1920, name: "mobile_9_16", useCase: "Mobile applications" },
      { aspect_ratio: "9:21", width: 1080, height: 2520, name: "ultrawide_portrait", useCase: "Ultrawide portrait" }
    ];
  }

  /**
   * Get weather effect tips
   */
  getWeatherEffectTips(): Array<{ tip: string; description: string; importance: string }> {
    return [
      { tip: "Clear scene", description: "Use clear, well-lit landscape images for best weather effect results", importance: "High" },
      { tip: "Good composition", description: "Ensure original image has good composition for better weather integration", importance: "High" },
      { tip: "High resolution", description: "Use high-resolution images for better quality weather effects", importance: "Medium" },
      { tip: "Appropriate scenes", description: "Choose scenes that would naturally have weather effects", importance: "Medium" },
      { tip: "Weather descriptions", description: "Provide specific weather descriptions for better results", importance: "Medium" },
      { tip: "Test variations", description: "Try different weather descriptions and seeds for varied results", importance: "Low" }
    ];
  }
}

// Export a default instance
export const falAiWeatherEffect = new FalAiWeatherEffectExecutor();
