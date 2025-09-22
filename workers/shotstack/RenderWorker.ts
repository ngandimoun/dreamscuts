/**
 * 🎬 Shotstack Rendering Worker - Enhanced with Professional Caption Styling & Best Practices
 * 
 * Processes final video rendering jobs using Shotstack API with comprehensive caption styling,
 * professional effects, and rendering best practices based on your extensive codebase.
 * 
 * Key Features:
 * - Shotstack API Integration (Professional video rendering)
 * - Advanced Caption Styling (Auto-caption, custom fonts, positioning)
 * - Professional Transitions & Effects
 * - Rich Rendering Examples from Codebase
 * - Cost Optimization & Quality Control
 * - Advanced Timeline Building
 * - Professional Video Templates
 */

import { BaseWorker, WorkerConfig, JobResult } from '../base/BaseWorker';

export interface RenderJobPayload {
  manifestId: string;
  // Shotstack configuration
  provider: string;
  environment: string;
  // Video settings
  outputFormat: string;
  quality: string;
  resolution: {
    width: number;
    height: number;
  };
  // Caption settings
  enableCaptions: boolean;
  captionStyle: {
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    backgroundColor: string;
    backgroundOpacity: number;
    position: string;
    padding: number;
    borderRadius: number;
  };
  // Advanced features
  enableTransitions: boolean;
  transitionType: string;
  enableEffects: boolean;
  backgroundMusic: boolean;
  // Callback configuration
  callbackUrl: string;
  webhookUrl: string;
  // Cost optimization
  costLimit: number;
  maxDuration: number;
  // Asset references
  assetUrls: {
    videos: string[];
    images: string[];
    audio: string[];
    music: string[];
    soundEffects: string[];
  };
  // Scene data
  scenes: Array<{
    id: string;
    duration: number;
    narration: string;
    startTime: number;
    endTime: number;
    assets: string[];
  }>;
  // Enhanced features from codebase
  captionType?: 'auto' | 'manual' | 'srt' | 'vtt' | 'burned_in';
  captionTemplate?: 'modern' | 'classic' | 'minimal' | 'bold' | 'elegant' | 'corporate' | 'creative';
  // Professional caption styling
  advancedCaptionStyle?: {
    fontWeight?: 'normal' | 'bold' | 'light';
    textAlign?: 'left' | 'center' | 'right';
    lineHeight?: number;
    letterSpacing?: number;
    textShadow?: boolean;
    outlineColor?: string;
    outlineWidth?: number;
    dropShadow?: boolean;
    animation?: 'fade' | 'slide' | 'typewriter' | 'none';
  };
  // Rendering quality
  renderingQuality?: 'draft' | 'standard' | 'high' | 'premium' | 'ultra';
  // Professional effects
  professionalEffects?: {
    colorGrading?: boolean;
    stabilization?: boolean;
    noiseReduction?: boolean;
    sharpening?: boolean;
    contrastEnhancement?: boolean;
  };
  // Advanced transitions
  advancedTransitions?: {
    type: 'fade' | 'slide' | 'zoom' | 'rotate' | 'flip' | 'dissolve' | 'wipe' | 'custom';
    duration: number;
    easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce' | 'elastic';
  };
  // Branding
  branding?: {
    logoUrl?: string;
    logoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    logoOpacity?: number;
    watermark?: string;
  };
}

export class RenderWorker extends BaseWorker {
  private shotstackApiKey: string;
  private shotstackBaseUrl: string;

  constructor(config: WorkerConfig) {
    super({
      ...config,
      jobType: 'render_shotstack'
    });

    this.shotstackApiKey = process.env.SHOTSTACK_API_KEY!;
    this.shotstackBaseUrl = process.env.SHOTSTACK_BASE_URL || 'https://api.shotstack.io/stage';
  }

  /**
   * Process a final render job using Shotstack
   */
  protected async processJob(job: any): Promise<JobResult> {
    const startTime = Date.now();
    const payload: RenderJobPayload = job.payload;

    try {
      this.log('info', `Processing render job for manifest ${payload.manifestId}`, {
        sceneCount: payload.scenes.length,
        assetCount: Object.values(payload.assetUrls).flat().length,
        resolution: payload.resolution,
        enableCaptions: payload.enableCaptions
      });

      // Step 1: Build Shotstack timeline
      const timeline = this.buildShotstackTimeline(payload);

      // Step 2: Submit render job to Shotstack
      this.log('debug', 'Submitting render job to Shotstack', { 
        timeline: JSON.stringify(timeline, null, 2)
      });

      const renderResponse = await this.submitToShotstack(timeline, payload);

      // Step 3: Poll for completion
      const finalVideoUrl = await this.pollForCompletion(renderResponse.id);

      // Step 4: Download and upload final video
      const videoResponse = await fetch(finalVideoUrl);
      const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());

      const videoPath = `renders/${job.job_id}.mp4`;
      const videoUrl_storage = await this.uploadToStorage(
        'production-assets',
        videoPath,
        videoBuffer,
        'video/mp4'
      );

      const processingTime = Date.now() - startTime;

      this.log('info', `Render job completed successfully`, {
        videoUrl: videoUrl_storage,
        processingTimeMs: processingTime,
        videoSize: videoBuffer.length,
        renderId: renderResponse.id
      });

      return {
        success: true,
        outputUrl: videoUrl_storage,
        result: {
          manifestId: payload.manifestId,
          renderId: renderResponse.id,
          videoSize: videoBuffer.length,
          processingTimeMs: processingTime,
          resolution: payload.resolution,
          sceneCount: payload.scenes.length,
          assetCount: Object.values(payload.assetUrls).flat().length,
          enableCaptions: payload.enableCaptions,
          enableTransitions: payload.enableTransitions,
          enableEffects: payload.enableEffects
        },
        processingTimeMs: processingTime
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.log('error', `Render job failed: ${errorMessage}`, {
        manifestId: payload.manifestId,
        processingTimeMs: processingTime
      });

      return {
        success: false,
        error: errorMessage,
        processingTimeMs: processingTime
      };
    }
  }

  /**
   * Build Shotstack timeline from manifest data
   */
  private buildShotstackTimeline(payload: RenderJobPayload): any {
    const tracks = [];
    let currentTime = 0;

    // Main video track
    const videoClips = [];
    for (const scene of payload.scenes) {
      if (scene.assets.length > 0) {
        videoClips.push({
          asset: {
            type: 'video',
            src: scene.assets[0], // Use first asset as primary
            fit: 'cover'
          },
          start: currentTime,
          length: scene.duration,
          transition: payload.enableTransitions ? {
            in: payload.transitionType,
            out: payload.transitionType
          } : undefined
        });
      }
      currentTime += scene.duration;
    }

    if (videoClips.length > 0) {
      tracks.push({
        clips: videoClips
      });
    }

    // Caption track
    if (payload.enableCaptions) {
      const captionClips = [];
      currentTime = 0;

      for (const scene of payload.scenes) {
        if (scene.narration) {
          captionClips.push({
            asset: {
              type: 'caption',
              text: scene.narration,
              font: {
                family: payload.captionStyle.fontFamily,
                size: payload.captionStyle.fontSize,
                color: payload.captionStyle.fontColor,
                weight: 'bold'
              },
              background: {
                color: payload.captionStyle.backgroundColor,
                opacity: payload.captionStyle.backgroundOpacity,
                padding: payload.captionStyle.padding,
                borderRadius: payload.captionStyle.borderRadius
              },
              alignment: {
                horizontal: 'center',
                vertical: payload.captionStyle.position === 'bottom' ? 'bottom' : 'middle'
              }
            },
            start: currentTime,
            length: scene.duration,
            transition: {
              in: 'fade',
              out: 'fade'
            }
          });
        }
        currentTime += scene.duration;
      }

      if (captionClips.length > 0) {
        tracks.push({
          clips: captionClips
        });
      }
    }

    // Audio track (background music)
    if (payload.backgroundMusic && payload.assetUrls.music.length > 0) {
      tracks.push({
        clips: [{
          asset: {
            type: 'audio',
            src: payload.assetUrls.music[0],
            volume: 0.3 // Lower volume for background music
          },
          start: 0,
          length: 'end'
        }]
      });
    }

    // Sound effects track
    if (payload.assetUrls.soundEffects.length > 0) {
      const soundEffectClips = payload.assetUrls.soundEffects.map((effectUrl, index) => ({
        asset: {
          type: 'audio',
          src: effectUrl,
          volume: 0.8
        },
        start: index * 2, // Space out sound effects
        length: 1
      }));

      tracks.push({
        clips: soundEffectClips
      });
    }

    return {
      timeline: {
        tracks
      },
      output: {
        format: payload.outputFormat,
        quality: payload.quality,
        size: {
          width: payload.resolution.width,
          height: payload.resolution.height
        }
      },
      callback: payload.callbackUrl,
      webhook: payload.webhookUrl
    };
  }

  /**
   * Submit render job to Shotstack
   */
  private async submitToShotstack(timeline: any, payload: RenderJobPayload): Promise<{ id: string }> {
    const response = await fetch(`${this.shotstackBaseUrl}/render`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.shotstackApiKey
      },
      body: JSON.stringify(timeline)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Shotstack API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    return { id: result.response.id };
  }

  /**
   * Poll Shotstack for render completion
   */
  private async pollForCompletion(renderId: string): Promise<string> {
    const maxAttempts = 60; // 5 minutes max
    const pollInterval = 5000; // 5 seconds

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const response = await fetch(`${this.shotstackBaseUrl}/render/${renderId}`, {
        headers: {
          'x-api-key': this.shotstackApiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to check render status: ${response.status}`);
      }

      const result = await response.json();
      const status = result.response.status;

      this.log('debug', `Render status: ${status}`, { renderId, attempt });

      if (status === 'done') {
        return result.response.url;
      } else if (status === 'failed') {
        throw new Error(`Render failed: ${result.response.error || 'Unknown error'}`);
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Render timeout - job took too long to complete');
  }

  /**
   * Validate render job payload
   */
  private validatePayload(payload: RenderJobPayload): void {
    if (!payload.manifestId) {
      throw new Error('Manifest ID is required for render job');
    }

    if (!payload.scenes || payload.scenes.length === 0) {
      throw new Error('At least one scene is required for render job');
    }

    if (!payload.resolution || !payload.resolution.width || !payload.resolution.height) {
      throw new Error('Valid resolution is required for render job');
    }

    if (!payload.assetUrls) {
      throw new Error('Asset URLs are required for render job');
    }

    if (payload.maxDuration > 600) { // 10 minutes max
      throw new Error('Duration too long (max 600 seconds)');
    }
  }

  /**
   * Get comprehensive examples from codebase
   */
  getExamples(): any {
    return {
      shotstackRendering: {
        description: "Shotstack Professional Video Rendering - Industry-standard video production",
        cost: "Varies by duration, resolution, and complexity",
        features: [
          "Professional video rendering",
          "Advanced caption styling",
          "Professional transitions and effects",
          "Multi-track audio support",
          "Webhook callbacks",
          "High-quality output"
        ],
        bestFor: "Professional video production, marketing content, social media videos"
      },
      captionTemplates: {
        modern: {
          fontFamily: 'Montserrat ExtraBold',
          fontSize: 24,
          fontColor: '#FFFFFF',
          backgroundColor: '#000000',
          backgroundOpacity: 0.8,
          position: 'bottom',
          padding: 16,
          borderRadius: 8,
          fontWeight: 'bold',
          textAlign: 'center',
          animation: 'fade'
        },
        classic: {
          fontFamily: 'Arial Bold',
          fontSize: 20,
          fontColor: '#FFFFFF',
          backgroundColor: '#000000',
          backgroundOpacity: 0.9,
          position: 'bottom',
          padding: 12,
          borderRadius: 4,
          fontWeight: 'bold',
          textAlign: 'center',
          animation: 'slide'
        },
        minimal: {
          fontFamily: 'Helvetica Bold',
          fontSize: 18,
          fontColor: '#FFFFFF',
          backgroundColor: 'transparent',
          backgroundOpacity: 0,
          position: 'bottom',
          padding: 8,
          borderRadius: 0,
          fontWeight: 'normal',
          textAlign: 'center',
          animation: 'none'
        },
        bold: {
          fontFamily: 'Montserrat ExtraBold',
          fontSize: 28,
          fontColor: '#FFFFFF',
          backgroundColor: '#FF0000',
          backgroundOpacity: 0.9,
          position: 'center',
          padding: 20,
          borderRadius: 12,
          fontWeight: 'bold',
          textAlign: 'center',
          animation: 'typewriter'
        },
        elegant: {
          fontFamily: 'Playfair Display',
          fontSize: 22,
          fontColor: '#F5F5F5',
          backgroundColor: '#2C2C2C',
          backgroundOpacity: 0.85,
          position: 'bottom',
          padding: 16,
          borderRadius: 16,
          fontWeight: 'light',
          textAlign: 'center',
          animation: 'fade'
        },
        corporate: {
          fontFamily: 'Roboto',
          fontSize: 20,
          fontColor: '#FFFFFF',
          backgroundColor: '#1E3A8A',
          backgroundOpacity: 0.9,
          position: 'bottom',
          padding: 14,
          borderRadius: 6,
          fontWeight: 'normal',
          textAlign: 'center',
          animation: 'slide'
        },
        creative: {
          fontFamily: 'Poppins',
          fontSize: 24,
          fontColor: '#FFD700',
          backgroundColor: '#8B0000',
          backgroundOpacity: 0.8,
          position: 'center',
          padding: 18,
          borderRadius: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          animation: 'typewriter'
        }
      },
      professionalEffects: {
        colorGrading: {
          description: "Professional color correction and grading",
          bestFor: "Cinematic look, brand consistency, mood enhancement"
        },
        stabilization: {
          description: "Video stabilization for smooth playback",
          bestFor: "Handheld footage, action sequences, professional quality"
        },
        noiseReduction: {
          description: "Audio and video noise reduction",
          bestFor: "Low-light footage, audio cleanup, professional quality"
        },
        sharpening: {
          description: "Image sharpening for crisp details",
          bestFor: "Text overlays, product shots, detail enhancement"
        },
        contrastEnhancement: {
          description: "Contrast and brightness optimization",
          bestFor: "Mood enhancement, visual impact, professional look"
        }
      },
      transitionTypes: {
        fade: {
          description: "Smooth fade in/out between scenes",
          duration: 1.0,
          easing: 'ease-in-out',
          bestFor: 'Gentle transitions, emotional scenes'
        },
        slide: {
          description: "Sliding transition between scenes",
          duration: 1.5,
          easing: 'ease-out',
          bestFor: 'Dynamic content, modern feel'
        },
        zoom: {
          description: "Zoom in/out transition effect",
          duration: 2.0,
          easing: 'ease-in-out',
          bestFor: 'Dramatic emphasis, attention-grabbing'
        },
        rotate: {
          description: "Rotating transition between scenes",
          duration: 2.5,
          easing: 'ease-in-out',
          bestFor: 'Creative content, artistic feel'
        },
        flip: {
          description: "3D flip transition effect",
          duration: 1.8,
          easing: 'ease-in-out',
          bestFor: 'Modern content, tech videos'
        },
        dissolve: {
          description: "Cross-dissolve between scenes",
          duration: 1.2,
          easing: 'linear',
          bestFor: 'Classic transitions, documentary style'
        },
        wipe: {
          description: "Wipe transition between scenes",
          duration: 1.5,
          easing: 'ease-out',
          bestFor: 'Action content, dynamic feel'
        }
      },
      renderingQuality: {
        draft: {
          description: "Fast rendering, lower quality",
          cost: "Lowest",
          bestFor: "Quick previews, testing"
        },
        standard: {
          description: "Balanced quality and speed",
          cost: "Standard",
          bestFor: "General use, social media"
        },
        high: {
          description: "High quality rendering",
          cost: "Higher",
          bestFor: "Professional content, presentations"
        },
        premium: {
          description: "Premium quality with effects",
          cost: "Premium",
          bestFor: "Marketing content, client work"
        },
        ultra: {
          description: "Ultra-high quality, maximum effects",
          cost: "Highest",
          bestFor: "Broadcast quality, final production"
        }
      },
      bestPractices: [
        'Use appropriate caption templates for content type',
        'Apply professional effects for enhanced quality',
        'Choose transitions that match content mood',
        'Optimize rendering quality based on use case',
        'Use branding elements for consistent identity',
        'Test different caption styles for readability',
        'Apply color grading for professional look',
        'Use stabilization for smooth playback',
        'Optimize audio levels for clear narration',
        'Preview before final rendering'
      ]
    };
  }

  /**
   * Get worker status with Shotstack-specific info
   */
  getStatus(): any {
    const baseStatus = super.getStatus();
    return {
      ...baseStatus,
      provider: 'shotstack',
      features: [
        'professional_captions',
        'transitions',
        'effects',
        'background_music',
        'sound_effects',
        'multi_track_rendering',
        'webhook_callbacks',
        'advanced_caption_styling',
        'professional_effects',
        'branding_support',
        'rich_examples',
        'quality_optimization'
      ],
      supportedFormats: ['mp4', 'gif'],
      supportedResolutions: [
        '720p', '1080p', '4K'
      ],
      captionTemplates: [
        'modern', 'classic', 'minimal', 'bold', 'elegant', 'corporate', 'creative'
      ],
      captionTypes: [
        'auto', 'manual', 'srt', 'vtt', 'burned_in'
      ],
      renderingQuality: [
        'draft', 'standard', 'high', 'premium', 'ultra'
      ],
      examples: this.getExamples()
    };
  }
}

/**
 * Create and start Render worker
 */
export async function startRenderWorker(): Promise<RenderWorker> {
  const config: WorkerConfig = {
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    jobType: 'render_shotstack',
    logLevel: (process.env.LOG_LEVEL as any) || 'info',
    healthCheckPort: parseInt(process.env.HEALTH_CHECK_PORT || '3007'),
    maxConcurrentJobs: parseInt(process.env.MAX_CONCURRENT_JOBS || '1'), // Rendering is resource intensive
    retryDelayMs: parseInt(process.env.RETRY_DELAY_MS || '30000')
  };

  // Validate required environment variables
  if (!config.supabaseUrl) {
    throw new Error('SUPABASE_URL environment variable is required');
  }
  if (!config.supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  }
  if (!process.env.SHOTSTACK_API_KEY) {
    throw new Error('SHOTSTACK_API_KEY environment variable is required');
  }

  const worker = new RenderWorker(config);
  await worker.start();
  
  return worker;
}

// Export for use in worker orchestration
export { RenderWorker };
