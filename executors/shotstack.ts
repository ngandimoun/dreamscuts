/**
 * Shotstack Video Editing API Executor
 * 
 * Shotstack is a cloud-based video editing API that enables developers to create
 * professional videos programmatically using JSON. It supports various assets
 * including images, videos, text, shapes, and audio with advanced features like
 * transitions, effects, animations, and chroma key.
 * 
 * This executor supports all Shotstack v1 APIs:
 * - Edit API: Video rendering, templates, and asset probing
 * - Serve API: Asset management and hosting
 * - Ingest API: Source asset upload and management
 * - Create API: AI-powered asset generation
 * 
 * Documentation: https://shotstack.io/docs/
 */

export interface ShotstackInput {
  timeline: {
    background?: string;
    soundtrack?: {
      src: string;
      effect?: 'fadeIn' | 'fadeOut' | 'fadeInOut';
    };
    tracks: ShotstackTrack[];
    fonts?: Array<{
      src: string;
    }>;
    cache?: boolean;
  };
  output: {
    format: 'mp4' | 'gif';
    resolution?: 'preview' | 'mobile' | 'sd' | 'hd' | '1080';
    size?: {
      width: number;
      height: number;
    };
    fps?: number;
    quality?: 'low' | 'medium' | 'high' | 'best';
  };
  merge?: Array<{
    find: string;
    replace: string;
  }>;
  callback?: string;
  destinations?: Array<{
    provider: 'shotstack' | 's3' | 'gcs' | 'azure';
    exclude?: boolean;
    region?: string;
    bucket?: string;
    prefix?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
  }>;
}

export interface ShotstackTrack {
  clips: ShotstackClip[];
}

export interface ShotstackClip {
  asset: ShotstackAsset;
  start: number | 'auto';
  length: number | 'auto' | 'end';
  transition?: {
    in?: 'fade' | 'wipeLeft' | 'wipeRight' | 'wipeUp' | 'wipeDown' | 'slideLeft' | 'slideRight' | 'slideUp' | 'slideDown' | 'carouselLeft' | 'carouselRight' | 'carouselUp' | 'carouselDown' | 'fadeBlack' | 'fadeWhite' | 'radial' | 'diamond' | 'crossZoom' | 'crossHatch' | 'crossWarp' | 'crossMelt' | 'crossGlitch' | 'crossFlip' | 'crossSlide' | 'crossPush' | 'crossZoom' | 'crossRotate' | 'crossScale' | 'crossSkew' | 'crossBlur' | 'crossSharpen' | 'crossBrightness' | 'crossContrast' | 'crossSaturation' | 'crossHue' | 'crossInvert' | 'crossGrayscale' | 'crossSepia' | 'crossVintage' | 'crossLomo' | 'crossXPro' | 'cross1977' | 'crossBrannan' | 'crossBrooklyn' | 'crossClarendon' | 'crossGingham' | 'crossJuno' | 'crossLark' | 'crossLoFi' | 'crossLudwig' | 'crossMaven' | 'crossMayfair' | 'crossMoon' | 'crossNashville' | 'crossPerpetua' | 'crossReyes' | 'crossRise' | 'crossSlumber' | 'crossStinson' | 'crossToaster' | 'crossValencia' | 'crossWalden' | 'crossWillow' | 'crossXPro2';
    out?: 'fade' | 'wipeLeft' | 'wipeRight' | 'wipeUp' | 'wipeDown' | 'slideLeft' | 'slideRight' | 'slideUp' | 'slideDown' | 'carouselLeft' | 'carouselRight' | 'carouselUp' | 'carouselDown' | 'fadeBlack' | 'fadeWhite' | 'radial' | 'diamond' | 'crossZoom' | 'crossHatch' | 'crossWarp' | 'crossMelt' | 'crossGlitch' | 'crossFlip' | 'crossSlide' | 'crossPush' | 'crossZoom' | 'crossRotate' | 'crossScale' | 'crossSkew' | 'crossBlur' | 'crossSharpen' | 'crossBrightness' | 'crossContrast' | 'crossSaturation' | 'crossHue' | 'crossInvert' | 'crossGrayscale' | 'crossSepia' | 'crossVintage' | 'crossLomo' | 'crossXPro' | 'cross1977' | 'crossBrannan' | 'crossBrooklyn' | 'crossClarendon' | 'crossGingham' | 'crossJuno' | 'crossLark' | 'crossLoFi' | 'crossLudwig' | 'crossMaven' | 'crossMayfair' | 'crossMoon' | 'crossNashville' | 'crossPerpetua' | 'crossReyes' | 'crossRise' | 'crossSlumber' | 'crossStinson' | 'crossToaster' | 'crossValencia' | 'crossWalden' | 'crossWillow' | 'crossXPro2';
  };
  filter?: 'boost' | 'contrast' | 'darken' | 'lighten' | 'saturate' | 'desaturate' | 'blur' | 'sharpen' | 'emboss' | 'edge' | 'posterize' | 'sepia' | 'vintage' | 'lomo' | 'xpro' | '1977' | 'brannan' | 'brooklyn' | 'clarendon' | 'gingham' | 'juno' | 'lark' | 'lofi' | 'ludwig' | 'maven' | 'mayfair' | 'moon' | 'nashville' | 'perpetua' | 'reyes' | 'rise' | 'slumber' | 'stinson' | 'toaster' | 'valencia' | 'walden' | 'willow' | 'xpro2';
  effect?: 'zoomIn' | 'zoomOut' | 'slideLeft' | 'slideRight' | 'slideUp' | 'slideDown' | 'carouselLeft' | 'carouselRight' | 'carouselUp' | 'carouselDown' | 'fadeIn' | 'fadeOut' | 'fadeInOut' | 'wipeLeft' | 'wipeRight' | 'wipeUp' | 'wipeDown' | 'crossZoom' | 'crossHatch' | 'crossWarp' | 'crossMelt' | 'crossGlitch' | 'crossFlip' | 'crossSlide' | 'crossPush' | 'crossRotate' | 'crossScale' | 'crossSkew' | 'crossBlur' | 'crossSharpen' | 'crossBrightness' | 'crossContrast' | 'crossSaturation' | 'crossHue' | 'crossInvert' | 'crossGrayscale' | 'crossSepia' | 'crossVintage' | 'crossLomo' | 'crossXPro' | 'cross1977' | 'crossBrannan' | 'crossBrooklyn' | 'crossClarendon' | 'crossGingham' | 'crossJuno' | 'crossLark' | 'crossLoFi' | 'crossLudwig' | 'crossMaven' | 'crossMayfair' | 'crossMoon' | 'crossNashville' | 'crossPerpetua' | 'crossReyes' | 'crossRise' | 'crossSlumber' | 'crossStinson' | 'crossToaster' | 'crossValencia' | 'crossWalden' | 'crossWillow' | 'crossXPro2';
  transform?: {
    scale?: number;
    rotate?: {
      angle: number;
    };
    skew?: {
      x: number;
      y: number;
    };
  };
  opacity?: number | Array<{
    from: number;
    to: number;
    start: number;
    length: number;
    interpolation?: 'linear' | 'bezier';
    easing?: 'ease' | 'easeIn' | 'easeOut' | 'easeInOut' | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad' | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic' | 'easeInQuart' | 'easeOutQuart' | 'easeInOutQuart' | 'easeInQuint' | 'easeOutQuint' | 'easeInOutQuint' | 'easeInSine' | 'easeOutSine' | 'easeInOutSine' | 'easeInExpo' | 'easeOutExpo' | 'easeInOutExpo' | 'easeInCirc' | 'easeOutCirc' | 'easeInOutCirc' | 'easeInBack' | 'easeOutBack' | 'easeInOutBack';
  }>;
  offset?: {
    x: number | Array<{
      from: number;
      to: number;
      start: number;
      length: number;
      interpolation?: 'linear' | 'bezier';
      easing?: 'ease' | 'easeIn' | 'easeOut' | 'easeInOut' | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad' | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic' | 'easeInQuart' | 'easeOutQuart' | 'easeInOutQuart' | 'easeInQuint' | 'easeOutQuint' | 'easeInOutQuint' | 'easeInSine' | 'easeOutSine' | 'easeInOutSine' | 'easeInExpo' | 'easeOutExpo' | 'easeInOutExpo' | 'easeInCirc' | 'easeOutCirc' | 'easeInOutCirc' | 'easeInBack' | 'easeOutBack' | 'easeInOutBack';
    }>;
    y: number | Array<{
      from: number;
      to: number;
      start: number;
      length: number;
      interpolation?: 'linear' | 'bezier';
      easing?: 'ease' | 'easeIn' | 'easeOut' | 'easeInOut' | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad' | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic' | 'easeInQuart' | 'easeOutQuart' | 'easeInOutQuart' | 'easeInQuint' | 'easeOutQuint' | 'easeInOutQuint' | 'easeInSine' | 'easeOutSine' | 'easeInOutSine' | 'easeInExpo' | 'easeOutExpo' | 'easeInOutExpo' | 'easeInCirc' | 'easeOutCirc' | 'easeInOutCirc' | 'easeInBack' | 'easeOutBack' | 'easeInOutBack';
    }>;
  };
  position?: 'topLeft' | 'topCenter' | 'topRight' | 'centerLeft' | 'center' | 'centerRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'left' | 'right' | 'top' | 'bottom';
  fit?: 'cover' | 'contain' | 'fill' | 'fit' | 'none';
  scale?: number;
  volume?: number;
  alias?: string;
}

export interface ShotstackAsset {
  type: 'video' | 'image' | 'text' | 'html' | 'audio' | 'luma' | 'title' | 'shape' | 'caption';
  src?: string;
  text?: string;
  html?: string;
  css?: string;
  shape?: 'rectangle' | 'circle' | 'line';
  rectangle?: {
    width: number;
    height: number;
    cornerRadius?: number;
  };
  circle?: {
    radius: number;
  };
  line?: {
    length: number;
    thickness: number;
  };
  fill?: {
    color: string;
    opacity?: number;
  };
  stroke?: {
    color: string;
    width: number;
  };
  font?: {
    family?: string;
    size?: number;
    color?: string;
    weight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    style?: 'normal' | 'italic' | 'oblique';
    decoration?: 'none' | 'underline' | 'line-through';
    align?: 'left' | 'center' | 'right' | 'justify';
    lineHeight?: number;
    letterSpacing?: number;
    stroke?: string;
    strokeWidth?: number;
  };
  alignment?: {
    horizontal?: 'left' | 'center' | 'right';
    vertical?: 'top' | 'middle' | 'bottom';
  };
  background?: {
    color: string;
    padding?: number;
    borderRadius?: number;
    opacity?: number;
  };
  width?: number;
  height?: number;
  trim?: number;
  volume?: number;
  chromaKey?: {
    color: string;
    threshold: number;
    halo: number;
  };
}

export interface ShotstackOutput {
  success: boolean;
  message: string;
  response: {
    message: string;
    id: string;
  };
}

export interface ShotstackRenderStatus {
  success: boolean;
  message: string;
  response: {
    id: string;
    owner: string;
    plan: string;
    status: 'queued' | 'fetching' | 'rendering' | 'saving' | 'done' | 'failed';
    url?: string;
    data?: any;
    created: string;
    updated: string;
    error?: string;
  };
}

export interface ShotstackOptions {
  environment?: 'stage' | 'v1';
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  onProgress?: (status: ShotstackRenderStatus) => void;
}

// Template interfaces
export interface ShotstackTemplate {
  id?: string;
  name: string;
  template: ShotstackInput;
  created?: string;
  updated?: string;
}

export interface ShotstackTemplateResponse {
  success: boolean;
  message: string;
  response: ShotstackTemplate;
}

export interface ShotstackTemplatesList {
  success: boolean;
  message: string;
  response: {
    templates: ShotstackTemplate[];
    pagination: {
      offset: number;
      limit: number;
      total: number;
    };
  };
}

// Asset interfaces
export interface ShotstackAssetInfo {
  success: boolean;
  message: string;
  response: {
    id: string;
    url: string;
    size: number;
    created: string;
    expires?: string;
    renderId?: string;
  };
}

export interface ShotstackAssetsList {
  success: boolean;
  message: string;
  response: {
    assets: Array<{
      id: string;
      url: string;
      size: number;
      created: string;
      expires?: string;
      renderId?: string;
    }>;
    pagination: {
      offset: number;
      limit: number;
      total: number;
    };
  };
}

// Source interfaces
export interface ShotstackSource {
  id?: string;
  url: string;
  created?: string;
  updated?: string;
  status?: 'ready' | 'fetching' | 'failed';
  size?: number;
  duration?: number;
  width?: number;
  height?: number;
  fps?: number;
  format?: string;
  codec?: string;
  bitrate?: number;
  error?: string;
}

export interface ShotstackSourceResponse {
  success: boolean;
  message: string;
  response: ShotstackSource;
}

export interface ShotstackSourcesList {
  success: boolean;
  message: string;
  response: {
    sources: ShotstackSource[];
    pagination: {
      offset: number;
      limit: number;
      total: number;
    };
  };
}

export interface ShotstackSignedUploadUrl {
  success: boolean;
  message: string;
  response: {
    uploadUrl: string;
    sourceId: string;
    expires: string;
  };
}

// Create API interfaces
export interface ShotstackCreateRequest {
  provider: 'openai' | 'stability' | 'elevenlabs' | 'did' | 'heygen';
  type: 'text-to-speech' | 'text-to-image' | 'image-to-video' | 'text-generation' | 'text-to-avatar';
  input: {
    text?: string;
    image?: string;
    voice?: string;
    model?: string;
    style?: string;
    size?: string;
    quality?: string;
    duration?: number;
    fps?: number;
    [key: string]: any;
  };
  output?: {
    format?: string;
    quality?: string;
    [key: string]: any;
  };
}

export interface ShotstackCreateResponse {
  success: boolean;
  message: string;
  response: {
    id: string;
    status: 'queued' | 'processing' | 'done' | 'failed';
    url?: string;
    error?: string;
    created: string;
    updated: string;
  };
}

// Transfer interfaces
export interface ShotstackTransferRequest {
  provider: 's3' | 'gcs' | 'azure' | 'mux' | 'vimeo' | 'google-drive';
  region?: string;
  bucket?: string;
  prefix?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  [key: string]: any;
}

export interface ShotstackTransferResponse {
  success: boolean;
  message: string;
  response: {
    id: string;
    status: 'queued' | 'processing' | 'done' | 'failed';
    url?: string;
    error?: string;
    created: string;
    updated: string;
  };
}

export class ShotstackExecutor {
  private apiKey: string;
  private environment: 'stage' | 'v1';
  private baseUrl: string;

  constructor(apiKey: string, environment: 'stage' | 'v1' = 'stage') {
    this.apiKey = apiKey;
    this.environment = environment;
    this.baseUrl = environment === 'stage' 
      ? 'https://api.shotstack.io/stage' 
      : 'https://api.shotstack.io/v1';
  }

  /**
   * Render a video using the Shotstack API
   */
  async renderVideo(
    input: ShotstackInput,
    options: ShotstackOptions = {}
  ): Promise<ShotstackOutput> {
    try {
      this.validateInput(input);

      const response = await fetch(`${this.baseUrl}/edit/render`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Shotstack API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Shotstack video rendering failed: ${errorMessage}`);
    }
  }

  /**
   * Check the status of a render job
   */
  async getRenderStatus(
    renderId: string,
    options: ShotstackOptions = {}
  ): Promise<ShotstackRenderStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/edit/render/${renderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Shotstack API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get render status: ${errorMessage}`);
    }
  }

  /**
   * Poll for render completion
   */
  async pollRenderStatus(
    renderId: string,
    options: ShotstackOptions = {}
  ): Promise<ShotstackRenderStatus> {
    const maxRetries = options.maxRetries || 60;
    const retryDelay = options.retryDelay || 2000;
    const timeout = options.timeout || 300000; // 5 minutes

    const startTime = Date.now();

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      // Check timeout
      if (Date.now() - startTime > timeout) {
        throw new Error('Render polling timeout exceeded');
      }

      try {
        const status = await this.getRenderStatus(renderId, options);
        
        // Call progress callback if provided
        if (options.onProgress) {
          options.onProgress(status);
        }

        // Check if render is complete
        if (status.response.status === 'done') {
          return status;
        }

        // Check if render failed
        if (status.response.status === 'failed') {
          throw new Error(`Render failed: ${status.response.error || 'Unknown error'}`);
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } catch (error) {
        if (attempt === maxRetries - 1) {
          throw error;
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }

    throw new Error('Maximum polling attempts exceeded');
  }

  /**
   * Render video and wait for completion
   */
  async renderVideoAndWait(
    input: ShotstackInput,
    options: ShotstackOptions = {}
  ): Promise<ShotstackRenderStatus> {
    // Start the render
    const renderResult = await this.renderVideo(input, options);
    
    // Poll for completion
    return await this.pollRenderStatus(renderResult.response.id, options);
  }

  /**
   * Probe asset metadata
   */
  async probeAsset(assetUrl: string): Promise<any> {
    try {
      const encodedUrl = encodeURIComponent(assetUrl);
      const response = await fetch(`${this.baseUrl}/probe/${encodedUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Shotstack API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to probe asset: ${errorMessage}`);
    }
  }

  // ===== TEMPLATE METHODS =====

  /**
   * Create a template
   */
  async createTemplate(template: ShotstackTemplate): Promise<ShotstackTemplateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify(template),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Shotstack API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to create template: ${errorMessage}`);
    }
  }

  /**
   * Get a template by ID
   */
  async getTemplate(templateId: string): Promise<ShotstackTemplateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/templates/${templateId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Shotstack API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get template: ${errorMessage}`);
    }
  }

  /**
   * List templates
   */
  async listTemplates(offset: number = 0, limit: number = 10): Promise<ShotstackTemplatesList> {
    try {
      const response = await fetch(`${this.baseUrl}/templates?offset=${offset}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Shotstack API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to list templates: ${errorMessage}`);
    }
  }

  /**
   * Update a template
   */
  async updateTemplate(templateId: string, template: Partial<ShotstackTemplate>): Promise<ShotstackTemplateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/templates/${templateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify(template),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Shotstack API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to update template: ${errorMessage}`);
    }
  }

  /**
   * Delete a template
   */
  async deleteTemplate(templateId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/templates/${templateId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Shotstack API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to delete template: ${errorMessage}`);
    }
  }

  /**
   * Render a template
   */
  async renderTemplate(templateId: string, merge: Array<{ find: string; replace: string }> = []): Promise<ShotstackOutput> {
    try {
      const response = await fetch(`${this.baseUrl}/templates/${templateId}/render`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify({ merge }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Shotstack API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to render template: ${errorMessage}`);
    }
  }

  // ===== SERVE API METHODS =====

  /**
   * Get asset information by ID
   */
  async getAsset(assetId: string): Promise<ShotstackAssetInfo> {
    try {
      const response = await fetch(`${this.baseUrl}/assets/${assetId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Shotstack API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get asset: ${errorMessage}`);
    }
  }

  /**
   * Delete an asset
   */
  async deleteAsset(assetId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/assets/${assetId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Shotstack API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to delete asset: ${errorMessage}`);
    }
  }

  /**
   * Get assets by render ID
   */
  async getAssetsByRenderId(renderId: string): Promise<ShotstackAssetsList> {
    try {
      const response = await fetch(`${this.baseUrl}/assets/render/${renderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Shotstack API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get assets by render ID: ${errorMessage}`);
    }
  }

  /**
   * Transfer an asset to another destination
   */
  async transferAsset(assetId: string, transfer: ShotstackTransferRequest): Promise<ShotstackTransferResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/assets/${assetId}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify(transfer),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Shotstack API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to transfer asset: ${errorMessage}`);
    }
  }

  // ===== INGEST API METHODS =====

  /**
   * Fetch a source from URL
   */
  async fetchSource(url: string): Promise<ShotstackSourceResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/sources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Shotstack API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to fetch source: ${errorMessage}`);
    }
  }

  /**
   * List sources
   */
  async listSources(offset: number = 0, limit: number = 10): Promise<ShotstackSourcesList> {
    try {
      const response = await fetch(`${this.baseUrl}/sources?offset=${offset}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Shotstack API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to list sources: ${errorMessage}`);
    }
  }

  /**
   * Get a source by ID
   */
  async getSource(sourceId: string): Promise<ShotstackSourceResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/sources/${sourceId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Shotstack API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get source: ${errorMessage}`);
    }
  }

  /**
   * Delete a source
   */
  async deleteSource(sourceId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/sources/${sourceId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Shotstack API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to delete source: ${errorMessage}`);
    }
  }

  /**
   * Request a signed upload URL
   */
  async requestSignedUploadUrl(): Promise<ShotstackSignedUploadUrl> {
    try {
      const response = await fetch(`${this.baseUrl}/sources/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Shotstack API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to request signed upload URL: ${errorMessage}`);
    }
  }

  // ===== CREATE API METHODS =====

  /**
   * Generate an asset using AI services
   */
  async generateAsset(request: ShotstackCreateRequest): Promise<ShotstackCreateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Shotstack API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to generate asset: ${errorMessage}`);
    }
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: ShotstackInput): void {
    if (!input.timeline) {
      throw new Error('Timeline is required');
    }

    if (!input.timeline.tracks || !Array.isArray(input.timeline.tracks)) {
      throw new Error('Timeline tracks are required and must be an array');
    }

    if (!input.output) {
      throw new Error('Output configuration is required');
    }

    if (!input.output.format || !['mp4', 'gif'].includes(input.output.format)) {
      throw new Error('Output format must be either "mp4" or "gif"');
    }

    // Validate tracks and clips
    for (const track of input.timeline.tracks) {
      if (!track.clips || !Array.isArray(track.clips)) {
        throw new Error('Track clips are required and must be an array');
      }

      for (const clip of track.clips) {
        if (!clip.asset) {
          throw new Error('Clip asset is required');
        }

        if (!clip.asset.type) {
          throw new Error('Asset type is required');
        }

        if (!['video', 'image', 'text', 'html', 'audio', 'luma', 'title', 'shape', 'caption'].includes(clip.asset.type)) {
          throw new Error('Invalid asset type');
        }

        if (clip.asset.type === 'video' || clip.asset.type === 'image' || clip.asset.type === 'audio') {
          if (!clip.asset.src) {
            throw new Error('Asset src is required for video, image, and audio assets');
          }
        }

        if (clip.asset.type === 'text' || clip.asset.type === 'title') {
          if (!clip.asset.text) {
            throw new Error('Asset text is required for text and title assets');
          }
        }
      }
    }
  }
}

/**
 * Create a Shotstack executor instance
 */
export function createShotstackExecutor(apiKey: string, environment: 'stage' | 'v1' = 'stage'): ShotstackExecutor {
  return new ShotstackExecutor(apiKey, environment);
}

/**
 * Quick video rendering function
 */
export async function renderShotstackVideo(
  apiKey: string,
  input: ShotstackInput,
  options: ShotstackOptions = {}
): Promise<ShotstackRenderStatus> {
  const executor = new ShotstackExecutor(apiKey, options.environment);
  return await executor.renderVideoAndWait(input, options);
}

/**
 * Helper function to create a simple text video
 */
export function createTextVideo(
  text: string,
  options: {
    duration?: number;
    background?: string;
    fontColor?: string;
    fontSize?: number;
    fontFamily?: string;
    width?: number;
    height?: number;
    format?: 'mp4' | 'gif';
  } = {}
): ShotstackInput {
  return {
    timeline: {
      background: options.background || '#000000',
      tracks: [
        {
          clips: [
            {
              asset: {
                type: 'text',
                text: text,
                font: {
                  family: options.fontFamily || 'Montserrat ExtraBold',
                  size: options.fontSize || 32,
                  color: options.fontColor || '#ffffff',
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'middle',
                },
              },
              start: 0,
              length: options.duration || 5,
              transition: {
                in: 'fade',
                out: 'fade',
              },
            },
          ],
        },
      ],
    },
    output: {
      format: options.format || 'mp4',
      size: {
        width: options.width || 1280,
        height: options.height || 720,
      },
    },
  };
}

/**
 * Helper function to create a video with image and text overlay
 */
export function createImageTextVideo(
  imageUrl: string,
  text: string,
  options: {
    duration?: number;
    textPosition?: 'top' | 'center' | 'bottom';
    textColor?: string;
    fontSize?: number;
    fontFamily?: string;
    width?: number;
    height?: number;
    format?: 'mp4' | 'gif';
  } = {}
): ShotstackInput {
  return {
    timeline: {
      tracks: [
        {
          clips: [
            {
              asset: {
                type: 'image',
                src: imageUrl,
                fit: 'cover',
              },
              start: 0,
              length: options.duration || 5,
            },
          ],
        },
        {
          clips: [
            {
              asset: {
                type: 'text',
                text: text,
                font: {
                  family: options.fontFamily || 'Montserrat ExtraBold',
                  size: options.fontSize || 32,
                  color: options.textColor || '#ffffff',
                },
                alignment: {
                  horizontal: 'center',
                  vertical: options.textPosition || 'center',
                },
                background: {
                  color: '#000000',
                  opacity: 0.5,
                  padding: 20,
                  borderRadius: 10,
                },
              },
              start: 0,
              length: options.duration || 5,
              transition: {
                in: 'fade',
                out: 'fade',
              },
            },
          ],
        },
      ],
    },
    output: {
      format: options.format || 'mp4',
      size: {
        width: options.width || 1280,
        height: options.height || 720,
      },
    },
  };
}

/**
 * Helper function to create a video slideshow
 */
export function createSlideshowVideo(
  images: string[],
  options: {
    durationPerImage?: number;
    transition?: 'fade' | 'slideLeft' | 'slideRight' | 'slideUp' | 'slideDown';
    background?: string;
    width?: number;
    height?: number;
    format?: 'mp4' | 'gif';
  } = {}
): ShotstackInput {
  const clips = images.map((imageUrl, index) => ({
    asset: {
      type: 'image' as const,
      src: imageUrl,
      fit: 'cover' as const,
    },
    start: index * (options.durationPerImage || 3),
    length: options.durationPerImage || 3,
    transition: {
      in: index === 0 ? 'fade' : (options.transition || 'fade'),
      out: index === images.length - 1 ? 'fade' : (options.transition || 'fade'),
    },
  }));

  return {
    timeline: {
      background: options.background || '#000000',
      tracks: [
        {
          clips,
        },
      ],
    },
    output: {
      format: options.format || 'mp4',
      size: {
        width: options.width || 1280,
        height: options.height || 720,
      },
    },
  };
}

/**
 * Helper function to create a custom video with advanced features
 */
export function createCustomVideo(
  clips: ShotstackClip[],
  options: {
    background?: string;
    soundtrack?: {
      src: string;
      effect?: 'fadeIn' | 'fadeOut' | 'fadeInOut';
    };
    width?: number;
    height?: number;
    format?: 'mp4' | 'gif';
    fps?: number;
    quality?: 'low' | 'medium' | 'high' | 'best';
  } = {}
): ShotstackInput {
  return {
    timeline: {
      background: options.background,
      soundtrack: options.soundtrack,
      tracks: [
        {
          clips,
        },
      ],
    },
    output: {
      format: options.format || 'mp4',
      size: {
        width: options.width || 1280,
        height: options.height || 720,
      },
      fps: options.fps,
      quality: options.quality,
    },
  };
}

/**
 * Helper function to create a chroma key video (green screen)
 */
export function createChromaKeyVideo(
  videoUrl: string,
  backgroundUrl: string,
  options: {
    chromaColor?: string;
    threshold?: number;
    halo?: number;
    duration?: number;
    width?: number;
    height?: number;
    format?: 'mp4' | 'gif';
  } = {}
): ShotstackInput {
  return {
    timeline: {
      tracks: [
        {
          clips: [
            {
              asset: {
                type: 'video',
                src: backgroundUrl,
                fit: 'cover',
              },
              start: 0,
              length: options.duration || 10,
            },
          ],
        },
        {
          clips: [
            {
              asset: {
                type: 'video',
                src: videoUrl,
                fit: 'cover',
                chromaKey: {
                  color: options.chromaColor || '#00ff00',
                  threshold: options.threshold || 0.1,
                  halo: options.halo || 0.1,
                },
              },
              start: 0,
              length: options.duration || 10,
            },
          ],
        },
      ],
    },
    output: {
      format: options.format || 'mp4',
      size: {
        width: options.width || 1280,
        height: options.height || 720,
      },
    },
  };
}

/**
 * Helper function to create a luma matte video
 */
export function createLumaMatteVideo(
  videoUrl: string,
  matteUrl: string,
  options: {
    duration?: number;
    width?: number;
    height?: number;
    format?: 'mp4' | 'gif';
  } = {}
): ShotstackInput {
  return {
    timeline: {
      tracks: [
        {
          clips: [
            {
              asset: {
                type: 'video',
                src: videoUrl,
                fit: 'cover',
              },
              start: 0,
              length: options.duration || 10,
            },
          ],
        },
        {
          clips: [
            {
              asset: {
                type: 'luma',
                src: matteUrl,
                fit: 'cover',
              },
              start: 0,
              length: options.duration || 10,
            },
          ],
        },
      ],
    },
    output: {
      format: options.format || 'mp4',
      size: {
        width: options.width || 1280,
        height: options.height || 720,
      },
    },
  };
}

/**
 * Helper function to create a video with captions
 */
export function createCaptionVideo(
  videoUrl: string,
  captions: Array<{
    text: string;
    start: number;
    length: number;
  }>,
  options: {
    fontColor?: string;
    fontSize?: number;
    fontFamily?: string;
    backgroundColor?: string;
    backgroundOpacity?: number;
    width?: number;
    height?: number;
    format?: 'mp4' | 'gif';
  } = {}
): ShotstackInput {
  const captionClips = captions.map(caption => ({
    asset: {
      type: 'caption' as const,
      text: caption.text,
      font: {
        family: options.fontFamily || 'Montserrat ExtraBold',
        size: options.fontSize || 24,
        color: options.fontColor || '#ffffff',
      },
      background: {
        color: options.backgroundColor || '#000000',
        opacity: options.backgroundOpacity || 0.7,
        padding: 10,
        borderRadius: 5,
      },
      alignment: {
        horizontal: 'center',
        vertical: 'bottom',
      },
    },
    start: caption.start,
    length: caption.length,
    transition: {
      in: 'fade',
      out: 'fade',
    },
  }));

  return {
    timeline: {
      tracks: [
        {
          clips: [
            {
              asset: {
                type: 'video',
                src: videoUrl,
                fit: 'cover',
              },
              start: 0,
              length: Math.max(...captions.map(c => c.start + c.length)),
            },
          ],
        },
        {
          clips: captionClips,
        },
      ],
    },
    output: {
      format: options.format || 'mp4',
      size: {
        width: options.width || 1280,
        height: options.height || 720,
      },
    },
  };
}

/**
 * Helper function to create a video with shapes
 */
export function createShapeVideo(
  shapes: Array<{
    type: 'rectangle' | 'circle' | 'line';
    start: number;
    length: number;
    position?: { x: number; y: number };
    size?: { width: number; height: number };
    fill?: { color: string; opacity?: number };
    stroke?: { color: string; width: number };
  }>,
  options: {
    background?: string;
    width?: number;
    height?: number;
    format?: 'mp4' | 'gif';
  } = {}
): ShotstackInput {
  const shapeClips = shapes.map(shape => ({
    asset: {
      type: 'shape' as const,
      shape: shape.type,
      ...(shape.type === 'rectangle' && shape.size && {
        rectangle: {
          width: shape.size.width,
          height: shape.size.height,
        },
      }),
      ...(shape.type === 'circle' && shape.size && {
        circle: {
          radius: Math.min(shape.size.width, shape.size.height) / 2,
        },
      }),
      ...(shape.type === 'line' && shape.size && {
        line: {
          length: shape.size.width,
          thickness: shape.size.height,
        },
      }),
      fill: shape.fill,
      stroke: shape.stroke,
    },
    start: shape.start,
    length: shape.length,
    ...(shape.position && {
      offset: {
        x: shape.position.x,
        y: shape.position.y,
      },
    }),
  }));

  return {
    timeline: {
      background: options.background || '#000000',
      tracks: [
        {
          clips: shapeClips,
        },
      ],
    },
    output: {
      format: options.format || 'mp4',
      size: {
        width: options.width || 1280,
        height: options.height || 720,
      },
    },
  };
}

/**
 * Helper function to create an animated video with keyframes
 */
export function createAnimatedVideo(
  assets: Array<{
    type: 'text' | 'image' | 'video';
    src?: string;
    text?: string;
    start: number;
    length: number;
    animations?: {
      opacity?: Array<{ from: number; to: number; start: number; length: number; easing?: string }>;
      offset?: {
        x: Array<{ from: number; to: number; start: number; length: number; easing?: string }>;
        y: Array<{ from: number; to: number; start: number; length: number; easing?: string }>;
      };
      scale?: Array<{ from: number; to: number; start: number; length: number; easing?: string }>;
    };
  }>,
  options: {
    background?: string;
    width?: number;
    height?: number;
    format?: 'mp4' | 'gif';
  } = {}
): ShotstackInput {
  const clips = assets.map(asset => ({
    asset: {
      type: asset.type,
      ...(asset.src && { src: asset.src }),
      ...(asset.text && { text: asset.text }),
      font: asset.type === 'text' ? {
        family: 'Montserrat ExtraBold',
        size: 32,
        color: '#ffffff',
      } : undefined,
      alignment: asset.type === 'text' ? {
        horizontal: 'center',
        vertical: 'middle',
      } : undefined,
    },
    start: asset.start,
    length: asset.length,
    ...(asset.animations?.opacity && { opacity: asset.animations.opacity }),
    ...(asset.animations?.offset && { offset: asset.animations.offset }),
    ...(asset.animations?.scale && { 
      transform: {
        scale: asset.animations.scale[0]?.from || 1,
      },
    }),
  }));

  return {
    timeline: {
      background: options.background || '#000000',
      tracks: [
        {
          clips,
        },
      ],
    },
    output: {
      format: options.format || 'mp4',
      size: {
        width: options.width || 1280,
        height: options.height || 720,
      },
    },
  };
}

/**
 * Helper function to create a template with merge fields
 */
export function createMergeTemplateVideo(
  template: ShotstackInput,
  mergeFields: Array<{ find: string; replace: string }>
): ShotstackInput {
  return {
    ...template,
    merge: mergeFields,
  };
}

/**
 * Helper function to create a video using AI-generated assets
 */
export function createImageToVideo(
  imageUrl: string,
  options: {
    duration?: number;
    width?: number;
    height?: number;
    format?: 'mp4' | 'gif';
    provider?: 'openai' | 'stability';
    model?: string;
  } = {}
): ShotstackInput {
  return {
    timeline: {
      tracks: [
        {
          clips: [
            {
              asset: {
                type: 'video',
                src: imageUrl, // This would be the AI-generated video URL
                fit: 'cover',
              },
              start: 0,
              length: options.duration || 5,
            },
          ],
        },
      ],
    },
    output: {
      format: options.format || 'mp4',
      size: {
        width: options.width || 1280,
        height: options.height || 720,
      },
    },
  };
}

/**
 * Helper function to create a video with AI-generated text-to-image
 */
export function createTextToImage(
  text: string,
  options: {
    duration?: number;
    width?: number;
    height?: number;
    format?: 'mp4' | 'gif';
    provider?: 'openai' | 'stability';
    model?: string;
    style?: string;
  } = {}
): ShotstackInput {
  return {
    timeline: {
      tracks: [
        {
          clips: [
            {
              asset: {
                type: 'image',
                src: '', // This would be populated with the AI-generated image URL
                fit: 'cover',
              },
              start: 0,
              length: options.duration || 5,
            },
          ],
        },
      ],
    },
    output: {
      format: options.format || 'mp4',
      size: {
        width: options.width || 1280,
        height: options.height || 720,
      },
    },
  };
}

/**
 * Helper function to create a video with AI-generated text-to-speech
 */
export function createTextToSpeech(
  text: string,
  options: {
    duration?: number;
    width?: number;
    height?: number;
    format?: 'mp4' | 'gif';
    provider?: 'elevenlabs' | 'openai';
    voice?: string;
    model?: string;
  } = {}
): ShotstackInput {
  return {
    timeline: {
      soundtrack: {
        src: '', // This would be populated with the AI-generated audio URL
        effect: 'fadeInOut',
      },
      background: '#000000',
      tracks: [
        {
          clips: [
            {
              asset: {
                type: 'text',
                text: text,
                font: {
                  family: 'Montserrat ExtraBold',
                  size: 32,
                  color: '#ffffff',
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'middle',
                },
              },
              start: 0,
              length: options.duration || 5,
              transition: {
                in: 'fade',
                out: 'fade',
              },
            },
          ],
        },
      ],
    },
    output: {
      format: options.format || 'mp4',
      size: {
        width: options.width || 1280,
        height: options.height || 720,
      },
    },
  };
}
