# Shotstack API Reference

This document provides a comprehensive reference for all Shotstack-related TypeScript interfaces, methods, and options.

## Table of Contents

1. [Core Interfaces](#core-interfaces)
2. [ShotstackExecutor Class](#shotstackexecutor-class)
3. [Helper Functions](#helper-functions)
4. [Type Definitions](#type-definitions)
5. [Error Handling](#error-handling)
6. [Examples](#examples)

## Core Interfaces

### ShotstackInput

The main input interface for video rendering requests.

```typescript
interface ShotstackInput {
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
```

### ShotstackTrack

Represents a track in the video timeline.

```typescript
interface ShotstackTrack {
  clips: ShotstackClip[];
}
```

### ShotstackClip

Represents a clip within a track.

```typescript
interface ShotstackClip {
  asset: ShotstackAsset;
  start: number | 'auto';
  length: number | 'auto' | 'end';
  transition?: {
    in?: TransitionType;
    out?: TransitionType;
  };
  filter?: FilterType;
  effect?: EffectType;
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
  opacity?: number | AnimationKeyframe[];
  offset?: {
    x: number | AnimationKeyframe[];
    y: number | AnimationKeyframe[];
  };
  position?: PositionType;
  fit?: FitType;
  scale?: number;
  volume?: number;
  alias?: string;
}
```

### ShotstackAsset

Represents an asset (video, image, text, etc.) in a clip.

```typescript
interface ShotstackAsset {
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
    weight?: FontWeight;
    style?: FontStyle;
    decoration?: FontDecoration;
    align?: FontAlign;
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
```

### ShotstackOutput

Response from video rendering requests.

```typescript
interface ShotstackOutput {
  success: boolean;
  message: string;
  response: {
    message: string;
    id: string;
  };
}
```

### ShotstackRenderStatus

Status information for render jobs.

```typescript
interface ShotstackRenderStatus {
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
```

### ShotstackOptions

Options for video rendering and polling.

```typescript
interface ShotstackOptions {
  environment?: 'stage' | 'v1';
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  onProgress?: (status: ShotstackRenderStatus) => void;
}
```

## ShotstackExecutor Class

### Constructor

```typescript
constructor(apiKey: string, environment: 'stage' | 'v1' = 'stage')
```

Creates a new ShotstackExecutor instance.

**Parameters:**
- `apiKey`: Your Shotstack API key
- `environment`: API environment ('stage' for sandbox, 'v1' for production)

### Video Rendering Methods

#### renderVideo

```typescript
async renderVideo(input: ShotstackInput, options?: ShotstackOptions): Promise<ShotstackOutput>
```

Starts a video rendering job and returns immediately with the render ID.

**Parameters:**
- `input`: Video configuration
- `options`: Optional rendering options

**Returns:** Promise resolving to render response with ID

#### renderVideoAndWait

```typescript
async renderVideoAndWait(input: ShotstackInput, options?: ShotstackOptions): Promise<ShotstackRenderStatus>
```

Starts a video rendering job and waits for completion.

**Parameters:**
- `input`: Video configuration
- `options`: Optional rendering options

**Returns:** Promise resolving to final render status with video URL

#### getRenderStatus

```typescript
async getRenderStatus(renderId: string, options?: ShotstackOptions): Promise<ShotstackRenderStatus>
```

Gets the current status of a render job.

**Parameters:**
- `renderId`: The render job ID
- `options`: Optional options

**Returns:** Promise resolving to current render status

#### pollRenderStatus

```typescript
async pollRenderStatus(renderId: string, options?: ShotstackOptions): Promise<ShotstackRenderStatus>
```

Polls a render job until completion.

**Parameters:**
- `renderId`: The render job ID
- `options`: Optional polling options

**Returns:** Promise resolving to final render status

### Template Management Methods

#### createTemplate

```typescript
async createTemplate(template: ShotstackTemplate): Promise<ShotstackTemplateResponse>
```

Creates a new template.

**Parameters:**
- `template`: Template configuration

**Returns:** Promise resolving to created template

#### getTemplate

```typescript
async getTemplate(templateId: string): Promise<ShotstackTemplateResponse>
```

Gets a template by ID.

**Parameters:**
- `templateId`: Template ID

**Returns:** Promise resolving to template details

#### listTemplates

```typescript
async listTemplates(offset?: number, limit?: number): Promise<ShotstackTemplatesList>
```

Lists all templates.

**Parameters:**
- `offset`: Pagination offset (default: 0)
- `limit`: Number of templates to return (default: 10)

**Returns:** Promise resolving to templates list

#### updateTemplate

```typescript
async updateTemplate(templateId: string, template: Partial<ShotstackTemplate>): Promise<ShotstackTemplateResponse>
```

Updates an existing template.

**Parameters:**
- `templateId`: Template ID
- `template`: Updated template data

**Returns:** Promise resolving to updated template

#### deleteTemplate

```typescript
async deleteTemplate(templateId: string): Promise<{ success: boolean; message: string }>
```

Deletes a template.

**Parameters:**
- `templateId`: Template ID

**Returns:** Promise resolving to deletion result

#### renderTemplate

```typescript
async renderTemplate(templateId: string, merge?: Array<{ find: string; replace: string }>): Promise<ShotstackOutput>
```

Renders a template with optional merge fields.

**Parameters:**
- `templateId`: Template ID
- `merge`: Optional merge field replacements

**Returns:** Promise resolving to render response

### Asset Management Methods

#### getAsset

```typescript
async getAsset(assetId: string): Promise<ShotstackAssetInfo>
```

Gets asset information by ID.

**Parameters:**
- `assetId`: Asset ID

**Returns:** Promise resolving to asset information

#### deleteAsset

```typescript
async deleteAsset(assetId: string): Promise<{ success: boolean; message: string }>
```

Deletes an asset.

**Parameters:**
- `assetId`: Asset ID

**Returns:** Promise resolving to deletion result

#### getAssetsByRenderId

```typescript
async getAssetsByRenderId(renderId: string): Promise<ShotstackAssetsList>
```

Gets all assets for a render job.

**Parameters:**
- `renderId`: Render job ID

**Returns:** Promise resolving to assets list

#### transferAsset

```typescript
async transferAsset(assetId: string, transfer: ShotstackTransferRequest): Promise<ShotstackTransferResponse>
```

Transfers an asset to another destination.

**Parameters:**
- `assetId`: Asset ID
- `transfer`: Transfer configuration

**Returns:** Promise resolving to transfer response

### Source Management Methods

#### fetchSource

```typescript
async fetchSource(url: string): Promise<ShotstackSourceResponse>
```

Fetches a source from a URL.

**Parameters:**
- `url`: Source URL

**Returns:** Promise resolving to source information

#### listSources

```typescript
async listSources(offset?: number, limit?: number): Promise<ShotstackSourcesList>
```

Lists all sources.

**Parameters:**
- `offset`: Pagination offset (default: 0)
- `limit`: Number of sources to return (default: 10)

**Returns:** Promise resolving to sources list

#### getSource

```typescript
async getSource(sourceId: string): Promise<ShotstackSourceResponse>
```

Gets a source by ID.

**Parameters:**
- `sourceId`: Source ID

**Returns:** Promise resolving to source information

#### deleteSource

```typescript
async deleteSource(sourceId: string): Promise<{ success: boolean; message: string }>
```

Deletes a source.

**Parameters:**
- `sourceId`: Source ID

**Returns:** Promise resolving to deletion result

#### requestSignedUploadUrl

```typescript
async requestSignedUploadUrl(): Promise<ShotstackSignedUploadUrl>
```

Requests a signed upload URL for direct file uploads.

**Returns:** Promise resolving to upload URL and source ID

### AI Asset Generation Methods

#### generateAsset

```typescript
async generateAsset(request: ShotstackCreateRequest): Promise<ShotstackCreateResponse>
```

Generates an asset using AI services.

**Parameters:**
- `request`: AI generation request

**Returns:** Promise resolving to generation response

### Utility Methods

#### probeAsset

```typescript
async probeAsset(assetUrl: string): Promise<any>
```

Probes an asset to get metadata.

**Parameters:**
- `assetUrl`: Asset URL

**Returns:** Promise resolving to asset metadata

## Helper Functions

### Video Creation Helpers

#### createTextVideo

```typescript
function createTextVideo(
  text: string,
  options?: {
    duration?: number;
    background?: string;
    fontColor?: string;
    fontSize?: number;
    fontFamily?: string;
    width?: number;
    height?: number;
    format?: 'mp4' | 'gif';
  }
): ShotstackInput
```

Creates a simple text video.

#### createImageTextVideo

```typescript
function createImageTextVideo(
  imageUrl: string,
  text: string,
  options?: {
    duration?: number;
    textPosition?: 'top' | 'center' | 'bottom';
    textColor?: string;
    fontSize?: number;
    fontFamily?: string;
    width?: number;
    height?: number;
    format?: 'mp4' | 'gif';
  }
): ShotstackInput
```

Creates a video with an image and text overlay.

#### createSlideshowVideo

```typescript
function createSlideshowVideo(
  images: string[],
  options?: {
    durationPerImage?: number;
    transition?: 'fade' | 'slideLeft' | 'slideRight' | 'slideUp' | 'slideDown';
    background?: string;
    width?: number;
    height?: number;
    format?: 'mp4' | 'gif';
  }
): ShotstackInput
```

Creates a photo slideshow video.

#### createCustomVideo

```typescript
function createCustomVideo(
  clips: ShotstackClip[],
  options?: {
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
  }
): ShotstackInput
```

Creates a custom video with multiple clips.

#### createChromaKeyVideo

```typescript
function createChromaKeyVideo(
  videoUrl: string,
  backgroundUrl: string,
  options?: {
    chromaColor?: string;
    threshold?: number;
    halo?: number;
    duration?: number;
    width?: number;
    height?: number;
    format?: 'mp4' | 'gif';
  }
): ShotstackInput
```

Creates a chroma key (green screen) video.

#### createLumaMatteVideo

```typescript
function createLumaMatteVideo(
  videoUrl: string,
  matteUrl: string,
  options?: {
    duration?: number;
    width?: number;
    height?: number;
    format?: 'mp4' | 'gif';
  }
): ShotstackInput
```

Creates a luma matte video.

#### createCaptionVideo

```typescript
function createCaptionVideo(
  videoUrl: string,
  captions: Array<{
    text: string;
    start: number;
    length: number;
  }>,
  options?: {
    fontColor?: string;
    fontSize?: number;
    fontFamily?: string;
    backgroundColor?: string;
    backgroundOpacity?: number;
    width?: number;
    height?: number;
    format?: 'mp4' | 'gif';
  }
): ShotstackInput
```

Creates a video with captions.

#### createShapeVideo

```typescript
function createShapeVideo(
  shapes: Array<{
    type: 'rectangle' | 'circle' | 'line';
    start: number;
    length: number;
    position?: { x: number; y: number };
    size?: { width: number; height: number };
    fill?: { color: string; opacity?: number };
    stroke?: { color: string; width: number };
  }>,
  options?: {
    background?: string;
    width?: number;
    height?: number;
    format?: 'mp4' | 'gif';
  }
): ShotstackInput
```

Creates a video with shapes.

#### createAnimatedVideo

```typescript
function createAnimatedVideo(
  assets: Array<{
    type: 'text' | 'image' | 'video';
    src?: string;
    text?: string;
    start: number;
    length: number;
    animations?: {
      opacity?: AnimationKeyframe[];
      offset?: {
        x: AnimationKeyframe[];
        y: AnimationKeyframe[];
      };
      scale?: AnimationKeyframe[];
    };
  }>,
  options?: {
    background?: string;
    width?: number;
    height?: number;
    format?: 'mp4' | 'gif';
  }
): ShotstackInput
```

Creates an animated video with keyframes.

#### createMergeTemplateVideo

```typescript
function createMergeTemplateVideo(
  template: ShotstackInput,
  mergeFields: Array<{ find: string; replace: string }>
): ShotstackInput
```

Creates a video from a template with merge fields.

### AI Generation Helpers

#### createImageToVideo

```typescript
function createImageToVideo(
  imageUrl: string,
  options?: {
    duration?: number;
    width?: number;
    height?: number;
    format?: 'mp4' | 'gif';
    provider?: 'openai' | 'stability';
    model?: string;
  }
): ShotstackInput
```

Creates a video from an AI-generated image.

#### createTextToImage

```typescript
function createTextToImage(
  text: string,
  options?: {
    duration?: number;
    width?: number;
    height?: number;
    format?: 'mp4' | 'gif';
    provider?: 'openai' | 'stability';
    model?: string;
    style?: string;
  }
): ShotstackInput
```

Creates a video with an AI-generated image.

#### createTextToSpeech

```typescript
function createTextToSpeech(
  text: string,
  options?: {
    duration?: number;
    width?: number;
    height?: number;
    format?: 'mp4' | 'gif';
    provider?: 'elevenlabs' | 'openai';
    voice?: string;
    model?: string;
  }
): ShotstackInput
```

Creates a video with AI-generated speech.

## Type Definitions

### Transition Types

```typescript
type TransitionType = 
  | 'fade' | 'wipeLeft' | 'wipeRight' | 'wipeUp' | 'wipeDown'
  | 'slideLeft' | 'slideRight' | 'slideUp' | 'slideDown'
  | 'carouselLeft' | 'carouselRight' | 'carouselUp' | 'carouselDown'
  | 'fadeBlack' | 'fadeWhite' | 'radial' | 'diamond'
  | 'crossZoom' | 'crossHatch' | 'crossWarp' | 'crossMelt'
  | 'crossGlitch' | 'crossFlip' | 'crossSlide' | 'crossPush'
  | 'crossRotate' | 'crossScale' | 'crossSkew' | 'crossBlur'
  | 'crossSharpen' | 'crossBrightness' | 'crossContrast'
  | 'crossSaturation' | 'crossHue' | 'crossInvert'
  | 'crossGrayscale' | 'crossSepia' | 'crossVintage'
  | 'crossLomo' | 'crossXPro' | 'cross1977' | 'crossBrannan'
  | 'crossBrooklyn' | 'crossClarendon' | 'crossGingham'
  | 'crossJuno' | 'crossLark' | 'crossLoFi' | 'crossLudwig'
  | 'crossMaven' | 'crossMayfair' | 'crossMoon' | 'crossNashville'
  | 'crossPerpetua' | 'crossReyes' | 'crossRise' | 'crossSlumber'
  | 'crossStinson' | 'crossToaster' | 'crossValencia'
  | 'crossWalden' | 'crossWillow' | 'crossXPro2';
```

### Filter Types

```typescript
type FilterType = 
  | 'boost' | 'contrast' | 'darken' | 'lighten'
  | 'saturate' | 'desaturate' | 'blur' | 'sharpen'
  | 'emboss' | 'edge' | 'posterize' | 'sepia'
  | 'vintage' | 'lomo' | 'xpro' | '1977' | 'brannan'
  | 'brooklyn' | 'clarendon' | 'gingham' | 'juno'
  | 'lark' | 'lofi' | 'ludwig' | 'maven' | 'mayfair'
  | 'moon' | 'nashville' | 'perpetua' | 'reyes'
  | 'rise' | 'slumber' | 'stinson' | 'toaster'
  | 'valencia' | 'walden' | 'willow' | 'xpro2';
```

### Effect Types

```typescript
type EffectType = 
  | 'zoomIn' | 'zoomOut' | 'slideLeft' | 'slideRight'
  | 'slideUp' | 'slideDown' | 'carouselLeft' | 'carouselRight'
  | 'carouselUp' | 'carouselDown' | 'fadeIn' | 'fadeOut'
  | 'fadeInOut' | 'wipeLeft' | 'wipeRight' | 'wipeUp'
  | 'wipeDown' | 'crossZoom' | 'crossHatch' | 'crossWarp'
  | 'crossMelt' | 'crossGlitch' | 'crossFlip' | 'crossSlide'
  | 'crossPush' | 'crossRotate' | 'crossScale' | 'crossSkew'
  | 'crossBlur' | 'crossSharpen' | 'crossBrightness'
  | 'crossContrast' | 'crossSaturation' | 'crossHue'
  | 'crossInvert' | 'crossGrayscale' | 'crossSepia'
  | 'crossVintage' | 'crossLomo' | 'crossXPro' | 'cross1977'
  | 'crossBrannan' | 'crossBrooklyn' | 'crossClarendon'
  | 'crossGingham' | 'crossJuno' | 'crossLark' | 'crossLoFi'
  | 'crossLudwig' | 'crossMaven' | 'crossMayfair' | 'crossMoon'
  | 'crossNashville' | 'crossPerpetua' | 'crossReyes'
  | 'crossRise' | 'crossSlumber' | 'crossStinson'
  | 'crossToaster' | 'crossValencia' | 'crossWalden'
  | 'crossWillow' | 'crossXPro2';
```

### Position Types

```typescript
type PositionType = 
  | 'topLeft' | 'topCenter' | 'topRight'
  | 'centerLeft' | 'center' | 'centerRight'
  | 'bottomLeft' | 'bottomCenter' | 'bottomRight'
  | 'left' | 'right' | 'top' | 'bottom';
```

### Fit Types

```typescript
type FitType = 'cover' | 'contain' | 'fill' | 'fit' | 'none';
```

### Font Types

```typescript
type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
type FontStyle = 'normal' | 'italic' | 'oblique';
type FontDecoration = 'none' | 'underline' | 'line-through';
type FontAlign = 'left' | 'center' | 'right' | 'justify';
```

### Animation Types

```typescript
interface AnimationKeyframe {
  from: number;
  to: number;
  start: number;
  length: number;
  interpolation?: 'linear' | 'bezier';
  easing?: EasingType;
}

type EasingType = 
  | 'ease' | 'easeIn' | 'easeOut' | 'easeInOut'
  | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad'
  | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic'
  | 'easeInQuart' | 'easeOutQuart' | 'easeInOutQuart'
  | 'easeInQuint' | 'easeOutQuint' | 'easeInOutQuint'
  | 'easeInSine' | 'easeOutSine' | 'easeInOutSine'
  | 'easeInExpo' | 'easeOutExpo' | 'easeInOutExpo'
  | 'easeInCirc' | 'easeOutCirc' | 'easeInOutCirc'
  | 'easeInBack' | 'easeOutBack' | 'easeInOutBack';
```

## Error Handling

### Common Error Types

```typescript
interface ShotstackError {
  success: false;
  message: string;
  error?: string;
  details?: string;
}
```

### Error Handling Example

```typescript
try {
  const result = await executor.renderVideoAndWait(input);
  console.log('Video created successfully:', result.response.url);
} catch (error) {
  if (error instanceof Error) {
    console.error('Shotstack error:', error.message);
    
    // Handle specific error types
    if (error.message.includes('API key')) {
      console.error('Invalid API key');
    } else if (error.message.includes('timeline')) {
      console.error('Invalid timeline configuration');
    } else if (error.message.includes('asset')) {
      console.error('Invalid asset configuration');
    }
  }
}
```

## Examples

### Complete Example: Social Media Post

```typescript
import { ShotstackExecutor, createImageTextVideo } from '@/executors/shotstack';

async function createSocialMediaPost() {
  const executor = new ShotstackExecutor(process.env.SHOTSTACK_API_KEY!, 'stage');
  
  const input = createImageTextVideo(
    'https://example.com/product-image.jpg',
    'Check out our new product!',
    {
      duration: 10,
      textPosition: 'bottom',
      textColor: '#ffffff',
      fontSize: 32,
      fontFamily: 'Montserrat ExtraBold',
      width: 1080,
      height: 1080,
      format: 'mp4',
    }
  );

  try {
    const result = await executor.renderVideoAndWait(input);
    return result.response.url;
  } catch (error) {
    console.error('Failed to create social media post:', error);
    throw error;
  }
}
```

### Complete Example: Template Usage

```typescript
import { ShotstackExecutor, createTextVideo } from '@/executors/shotstack';

async function createAndUseTemplate() {
  const executor = new ShotstackExecutor(process.env.SHOTSTACK_API_KEY!, 'stage');
  
  // Create template
  const template = {
    name: 'Welcome Video Template',
    template: createTextVideo('{{TITLE}}', {
      duration: 5,
      background: '{{BACKGROUND_COLOR}}',
      fontColor: '{{TEXT_COLOR}}',
      fontSize: 48,
      fontFamily: 'Montserrat ExtraBold',
    }),
  };

  const templateResult = await executor.createTemplate(template);
  console.log('Template created:', templateResult.response.id);

  // Render template
  const renderResult = await executor.renderTemplate(templateResult.response.id!, [
    { find: '{{TITLE}}', replace: 'Welcome to Our Company' },
    { find: '{{BACKGROUND_COLOR}}', replace: '#1e40af' },
    { find: '{{TEXT_COLOR}}', replace: '#ffffff' },
  ]);

  return renderResult.response.id;
}
```

This comprehensive API reference provides all the information needed to effectively use the Shotstack integration in your projects.