# Shotstack Integration Guide

This guide provides comprehensive documentation for integrating and using the Shotstack video editing API in your Dreamcuts project.

## Table of Contents

1. [Overview](#overview)
2. [Setup and Configuration](#setup-and-configuration)
3. [Basic Usage](#basic-usage)
4. [Advanced Features](#advanced-features)
5. [API Reference](#api-reference)
6. [Examples](#examples)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Overview

Shotstack is a cloud-based video editing API that enables developers to create professional videos programmatically using JSON. Our integration provides:

- **Edit API**: Video rendering, templates, and asset probing
- **Serve API**: Asset management and hosting
- **Ingest API**: Source asset upload and management
- **Create API**: AI-powered asset generation
- **Auto-correction**: Built-in retry logic and error handling
- **TypeScript Support**: Full type safety and IntelliSense

## Setup and Configuration

### 1. Environment Variables

Add your Shotstack API key to your environment configuration:

```bash
# .env.local
SHOTSTACK_API_KEY=your_shotstack_api_key_here
```

### 2. API Key Setup

1. Sign up for a Shotstack account at [shotstack.io](https://shotstack.io)
2. Get your API key from the dashboard
3. Choose between `stage` (sandbox) or `v1` (production) environment

### 3. Basic Import

```typescript
import { ShotstackExecutor, createTextVideo } from '@/executors/shotstack';
```

## Basic Usage

### Creating a Simple Text Video

```typescript
import { ShotstackExecutor, createTextVideo } from '@/executors/shotstack';

const executor = new ShotstackExecutor(process.env.SHOTSTACK_API_KEY!, 'stage');

const input = createTextVideo('Hello World!', {
  duration: 5,
  background: '#1e40af',
  fontColor: '#ffffff',
  fontSize: 48,
  fontFamily: 'Montserrat ExtraBold',
  width: 1920,
  height: 1080,
  format: 'mp4',
});

const result = await executor.renderVideoAndWait(input);
console.log('Video URL:', result.response.url);
```

### Image with Text Overlay

```typescript
import { createImageTextVideo } from '@/executors/shotstack';

const input = createImageTextVideo(
  'https://example.com/image.jpg',
  'Beautiful Image',
  {
    duration: 8,
    textPosition: 'bottom',
    textColor: '#ffffff',
    fontSize: 36,
  }
);

const result = await executor.renderVideoAndWait(input);
```

### Photo Slideshow

```typescript
import { createSlideshowVideo } from '@/executors/shotstack';

const images = [
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  'https://example.com/image3.jpg',
];

const input = createSlideshowVideo(images, {
  durationPerImage: 3,
  transition: 'fade',
  background: '#000000',
});

const result = await executor.renderVideoAndWait(input);
```

## Advanced Features

### Chroma Key (Green Screen)

```typescript
import { createChromaKeyVideo } from '@/executors/shotstack';

const input = createChromaKeyVideo(
  'https://example.com/green-screen-video.mp4',
  'https://example.com/background.jpg',
  {
    chromaColor: '#00ff00',
    threshold: 0.1,
    halo: 0.1,
    duration: 10,
  }
);
```

### Video with Captions

```typescript
import { createCaptionVideo } from '@/executors/shotstack';

const captions = [
  { text: 'Welcome to our presentation', start: 0, length: 3 },
  { text: 'Today we will discuss...', start: 3, length: 4 },
  { text: 'Thank you for watching!', start: 7, length: 3 },
];

const input = createCaptionVideo(
  'https://example.com/video.mp4',
  captions,
  {
    fontColor: '#ffffff',
    fontSize: 28,
    backgroundColor: '#000000',
    backgroundOpacity: 0.8,
  }
);
```

### Animated Video with Keyframes

```typescript
import { createAnimatedVideo } from '@/executors/shotstack';

const assets = [
  {
    type: 'text' as const,
    text: 'Welcome',
    start: 0,
    length: 3,
    animations: {
      opacity: [
        { from: 0, to: 1, start: 0, length: 1, easing: 'easeIn' },
        { from: 1, to: 0, start: 2, length: 1, easing: 'easeOut' },
      ],
      offset: {
        x: [{ from: -100, to: 0, start: 0, length: 1, easing: 'easeOut' }],
        y: [{ from: 0, to: 0, start: 0, length: 1, easing: 'easeOut' }],
      },
    },
  },
];

const input = createAnimatedVideo(assets, {
  background: '#1e40af',
  width: 1920,
  height: 1080,
});
```

### Template Management

```typescript
// Create a template
const template = {
  name: 'Welcome Video Template',
  template: createTextVideo('{{TITLE}}', {
    duration: 5,
    background: '{{BACKGROUND_COLOR}}',
    fontColor: '{{TEXT_COLOR}}',
  }),
};

const templateResult = await executor.createTemplate(template);

// Render the template with merge fields
const renderResult = await executor.renderTemplate(templateResult.response.id!, [
  { find: '{{TITLE}}', replace: 'Welcome to Our Company' },
  { find: '{{BACKGROUND_COLOR}}', replace: '#1e40af' },
  { find: '{{TEXT_COLOR}}', replace: '#ffffff' },
]);
```

### Asset Management

```typescript
// Get assets by render ID
const assets = await executor.getAssetsByRenderId(renderId);

// Get specific asset information
const assetInfo = await executor.getAsset(assetId);

// Transfer asset to S3
const transferRequest = {
  provider: 's3',
  region: 'us-east-1',
  bucket: 'my-video-bucket',
  prefix: 'rendered-videos/',
  accessKeyId: 'your-access-key',
  secretAccessKey: 'your-secret-key',
};

const transferResult = await executor.transferAsset(assetId, transferRequest);

// Delete an asset
await executor.deleteAsset(assetId);
```

### Source Management

```typescript
// Fetch a source from URL
const sourceResult = await executor.fetchSource('https://example.com/video.mp4');

// List all sources
const sources = await executor.listSources(0, 10);

// Request a signed upload URL
const uploadResult = await executor.requestSignedUploadUrl();

// Upload a file using the signed URL
const file = new File(['video content'], 'video.mp4', { type: 'video/mp4' });
const uploadResponse = await fetch(uploadResult.response.uploadUrl, {
  method: 'PUT',
  body: file,
});
```

### AI Asset Generation

```typescript
// Generate text-to-speech
const ttsRequest = {
  provider: 'elevenlabs',
  type: 'text-to-speech',
  input: {
    text: 'Hello, this is a test of AI-generated speech.',
    voice: 'rachel',
    model: 'eleven_multilingual_v2',
  },
  output: {
    format: 'mp3',
    quality: 'high',
  },
};

const ttsResult = await executor.generateAsset(ttsRequest);

// Generate text-to-image
const ttiRequest = {
  provider: 'stability',
  type: 'text-to-image',
  input: {
    text: 'A beautiful sunset over mountains',
    model: 'stable-diffusion-xl',
    style: 'photographic',
    size: '1024x1024',
  },
  output: {
    format: 'png',
    quality: 'high',
  },
};

const ttiResult = await executor.generateAsset(ttiRequest);
```

## API Reference

### ShotstackExecutor Class

#### Constructor

```typescript
new ShotstackExecutor(apiKey: string, environment?: 'stage' | 'v1')
```

#### Methods

##### Video Rendering

- `renderVideo(input: ShotstackInput, options?: ShotstackOptions): Promise<ShotstackOutput>`
- `renderVideoAndWait(input: ShotstackInput, options?: ShotstackOptions): Promise<ShotstackRenderStatus>`
- `getRenderStatus(renderId: string): Promise<ShotstackRenderStatus>`
- `pollRenderStatus(renderId: string, options?: ShotstackOptions): Promise<ShotstackRenderStatus>`

##### Template Management

- `createTemplate(template: ShotstackTemplate): Promise<ShotstackTemplateResponse>`
- `getTemplate(templateId: string): Promise<ShotstackTemplateResponse>`
- `listTemplates(offset?: number, limit?: number): Promise<ShotstackTemplatesList>`
- `updateTemplate(templateId: string, template: Partial<ShotstackTemplate>): Promise<ShotstackTemplateResponse>`
- `deleteTemplate(templateId: string): Promise<{ success: boolean; message: string }>`
- `renderTemplate(templateId: string, merge?: Array<{ find: string; replace: string }>): Promise<ShotstackOutput>`

##### Asset Management

- `getAsset(assetId: string): Promise<ShotstackAssetInfo>`
- `deleteAsset(assetId: string): Promise<{ success: boolean; message: string }>`
- `getAssetsByRenderId(renderId: string): Promise<ShotstackAssetsList>`
- `transferAsset(assetId: string, transfer: ShotstackTransferRequest): Promise<ShotstackTransferResponse>`

##### Source Management

- `fetchSource(url: string): Promise<ShotstackSourceResponse>`
- `listSources(offset?: number, limit?: number): Promise<ShotstackSourcesList>`
- `getSource(sourceId: string): Promise<ShotstackSourceResponse>`
- `deleteSource(sourceId: string): Promise<{ success: boolean; message: string }>`
- `requestSignedUploadUrl(): Promise<ShotstackSignedUploadUrl>`

##### AI Asset Generation

- `generateAsset(request: ShotstackCreateRequest): Promise<ShotstackCreateResponse>`

##### Utility Methods

- `probeAsset(assetUrl: string): Promise<any>`

### Helper Functions

#### Video Creation Helpers

- `createTextVideo(text: string, options?: TextVideoOptions): ShotstackInput`
- `createImageTextVideo(imageUrl: string, text: string, options?: ImageTextVideoOptions): ShotstackInput`
- `createSlideshowVideo(images: string[], options?: SlideshowVideoOptions): ShotstackInput`
- `createCustomVideo(clips: ShotstackClip[], options?: CustomVideoOptions): ShotstackInput`
- `createChromaKeyVideo(videoUrl: string, backgroundUrl: string, options?: ChromaKeyVideoOptions): ShotstackInput`
- `createLumaMatteVideo(videoUrl: string, matteUrl: string, options?: LumaMatteVideoOptions): ShotstackInput`
- `createCaptionVideo(videoUrl: string, captions: Caption[], options?: CaptionVideoOptions): ShotstackInput`
- `createShapeVideo(shapes: Shape[], options?: ShapeVideoOptions): ShotstackInput`
- `createAnimatedVideo(assets: AnimatedAsset[], options?: AnimatedVideoOptions): ShotstackInput`
- `createMergeTemplateVideo(template: ShotstackInput, mergeFields: MergeField[]): ShotstackInput`

#### AI Generation Helpers

- `createImageToVideo(imageUrl: string, options?: ImageToVideoOptions): ShotstackInput`
- `createTextToImage(text: string, options?: TextToImageOptions): ShotstackInput`
- `createTextToSpeech(text: string, options?: TextToSpeechOptions): ShotstackInput`

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
      height: 1080, // Square format for social media
      format: 'mp4',
    }
  );

  const result = await executor.renderVideoAndWait(input);
  return result.response.url;
}
```

### Complete Example: Batch Processing

```typescript
import { ShotstackExecutor, createTextVideo } from '@/executors/shotstack';

async function batchCreateVideos(videoConfigs: Array<{
  text: string;
  background: string;
  fontColor: string;
}>) {
  const executor = new ShotstackExecutor(process.env.SHOTSTACK_API_KEY!, 'stage');
  
  const results = await Promise.all(
    videoConfigs.map(async (config) => {
      const input = createTextVideo(config.text, {
        duration: 5,
        background: config.background,
        fontColor: config.fontColor,
        fontSize: 32,
        fontFamily: 'Montserrat ExtraBold',
        width: 1280,
        height: 720,
        format: 'mp4',
      });

      const result = await executor.renderVideoAndWait(input);
      return {
        text: config.text,
        url: result.response.url,
        id: result.response.id,
      };
    })
  );

  return results;
}
```

## Best Practices

### 1. Environment Selection

- Use `stage` for development and testing
- Use `v1` for production
- Always test in stage before deploying to production

### 2. Error Handling

```typescript
try {
  const result = await executor.renderVideoAndWait(input);
  console.log('Video created successfully:', result.response.url);
} catch (error) {
  console.error('Video creation failed:', error);
  // Handle error appropriately
}
```

### 3. Asset Management

- Always clean up temporary assets when no longer needed
- Use asset transfer to move files to permanent storage
- Monitor asset expiration times (24 hours for temporary files)

### 4. Performance Optimization

- Use appropriate video dimensions for your use case
- Choose the right quality settings (low/medium/high/best)
- Consider using templates for repeated video structures
- Batch process multiple videos when possible

### 5. Security

- Never expose your API key in client-side code
- Use environment variables for configuration
- Implement proper access controls for video generation

### 6. Cost Management

- Monitor your API usage and costs
- Use stage environment for development
- Optimize video dimensions and quality settings
- Clean up unused assets regularly

## Troubleshooting

### Common Issues

#### 1. API Key Errors

**Error**: `SHOTSTACK_API_KEY environment variable is required`

**Solution**: Ensure your API key is properly set in your environment variables.

#### 2. Invalid Input Errors

**Error**: `Timeline is required` or `Output configuration is required`

**Solution**: Check that your input object has the required `timeline` and `output` properties.

#### 3. Asset URL Errors

**Error**: `Asset src is required for video, image, and audio assets`

**Solution**: Ensure all video, image, and audio assets have valid `src` URLs.

#### 4. Render Timeout

**Error**: `Render polling timeout exceeded`

**Solution**: Increase the timeout value or check if your video is too complex.

#### 5. Asset Not Found

**Error**: `Asset not found`

**Solution**: Verify that the asset URL is accessible and the asset exists.

### Debugging Tips

1. **Use Stage Environment**: Always test in stage first
2. **Check Asset URLs**: Ensure all asset URLs are accessible
3. **Validate Input**: Use the built-in validation to check your input
4. **Monitor Logs**: Check console logs for detailed error messages
5. **Test Simple Cases**: Start with simple videos and gradually add complexity

### Getting Help

1. Check the [Shotstack Documentation](https://shotstack.io/docs/)
2. Review the examples in this guide
3. Check the console logs for detailed error messages
4. Contact Shotstack support for API-specific issues

## Conclusion

The Shotstack integration provides a powerful and flexible way to create professional videos programmatically. With support for all major Shotstack APIs, comprehensive error handling, and extensive helper functions, you can easily integrate video creation into your applications.

For more examples and advanced usage, see the comprehensive examples in the `examples/` directory.