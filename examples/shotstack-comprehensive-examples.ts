/**
 * Comprehensive Shotstack API Examples
 * 
 * This file contains detailed examples demonstrating all the features
 * and capabilities of the Shotstack video editing API integration.
 */

import {
  ShotstackExecutor,
  ShotstackInput,
  ShotstackTemplate,
  ShotstackCreateRequest,
  ShotstackTransferRequest,
  createTextVideo,
  createImageTextVideo,
  createSlideshowVideo,
  createCustomVideo,
  createChromaKeyVideo,
  createLumaMatteVideo,
  createCaptionVideo,
  createShapeVideo,
  createAnimatedVideo,
  createMergeTemplateVideo,
  createImageToVideo,
  createTextToImage,
  createTextToSpeech,
} from '../executors/shotstack';

// ===== BASIC VIDEO CREATION EXAMPLES =====

/**
 * Example 1: Simple Text Video
 */
export async function createSimpleTextVideo(apiKey: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
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
  console.log('Text video created:', result.response.url);
  return result;
}

/**
 * Example 2: Image with Text Overlay
 */
export async function createImageWithText(apiKey: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  const input = createImageTextVideo(
    'https://shotstack-assets.s3.amazonaws.com/images/waterfall-square.jpg',
    'Beautiful Waterfall',
    {
      duration: 8,
      textPosition: 'bottom',
      textColor: '#ffffff',
      fontSize: 36,
      fontFamily: 'Montserrat ExtraBold',
      width: 1920,
      height: 1080,
      format: 'mp4',
    }
  );

  const result = await executor.renderVideoAndWait(input);
  console.log('Image with text created:', result.response.url);
  return result;
}

/**
 * Example 3: Photo Slideshow
 */
export async function createPhotoSlideshow(apiKey: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  const images = [
    'https://shotstack-assets.s3.amazonaws.com/images/waterfall-square.jpg',
    'https://shotstack-assets.s3.amazonaws.com/images/mountain-square.jpg',
    'https://shotstack-assets.s3.amazonaws.com/images/beach-square.jpg',
    'https://shotstack-assets.s3.amazonaws.com/images/forest-square.jpg',
  ];

  const input = createSlideshowVideo(images, {
    durationPerImage: 4,
    transition: 'fade',
    background: '#000000',
    width: 1920,
    height: 1080,
    format: 'mp4',
  });

  const result = await executor.renderVideoAndWait(input);
  console.log('Slideshow created:', result.response.url);
  return result;
}

// ===== ADVANCED VIDEO FEATURES =====

/**
 * Example 4: Chroma Key (Green Screen) Video
 */
export async function createChromaKeyVideo(apiKey: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  const input = createChromaKeyVideo(
    'https://example.com/green-screen-video.mp4',
    'https://shotstack-assets.s3.amazonaws.com/images/beach-square.jpg',
    {
      chromaColor: '#00ff00',
      threshold: 0.1,
      halo: 0.1,
      duration: 10,
      width: 1920,
      height: 1080,
      format: 'mp4',
    }
  );

  const result = await executor.renderVideoAndWait(input);
  console.log('Chroma key video created:', result.response.url);
  return result;
}

/**
 * Example 5: Video with Captions
 */
export async function createVideoWithCaptions(apiKey: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  const captions = [
    { text: 'Welcome to our presentation', start: 0, length: 3 },
    { text: 'Today we will discuss...', start: 3, length: 4 },
    { text: 'Thank you for watching!', start: 7, length: 3 },
  ];

  const input = createCaptionVideo(
    'https://example.com/presentation-video.mp4',
    captions,
    {
      fontColor: '#ffffff',
      fontSize: 28,
      fontFamily: 'Montserrat ExtraBold',
      backgroundColor: '#000000',
      backgroundOpacity: 0.8,
      width: 1920,
      height: 1080,
      format: 'mp4',
    }
  );

  const result = await executor.renderVideoAndWait(input);
  console.log('Video with captions created:', result.response.url);
  return result;
}

/**
 * Example 6: Animated Video with Keyframes
 */
export async function createAnimatedVideo(apiKey: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
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
    {
      type: 'text' as const,
      text: 'To Shotstack',
      start: 2,
      length: 3,
      animations: {
        opacity: [
          { from: 0, to: 1, start: 2, length: 1, easing: 'easeIn' },
          { from: 1, to: 0, start: 4, length: 1, easing: 'easeOut' },
        ],
        offset: {
          x: [{ from: 100, to: 0, start: 2, length: 1, easing: 'easeOut' }],
          y: [{ from: 0, to: 0, start: 2, length: 1, easing: 'easeOut' }],
        },
      },
    },
  ];

  const input = createAnimatedVideo(assets, {
    background: '#1e40af',
    width: 1920,
    height: 1080,
    format: 'mp4',
  });

  const result = await executor.renderVideoAndWait(input);
  console.log('Animated video created:', result.response.url);
  return result;
}

/**
 * Example 7: Video with Shapes
 */
export async function createShapeVideo(apiKey: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  const shapes = [
    {
      type: 'rectangle' as const,
      start: 0,
      length: 3,
      position: { x: 100, y: 100 },
      size: { width: 200, height: 100 },
      fill: { color: '#ff0000', opacity: 0.8 },
      stroke: { color: '#ffffff', width: 2 },
    },
    {
      type: 'circle' as const,
      start: 2,
      length: 3,
      position: { x: 400, y: 200 },
      size: { width: 150, height: 150 },
      fill: { color: '#00ff00', opacity: 0.8 },
      stroke: { color: '#ffffff', width: 2 },
    },
    {
      type: 'line' as const,
      start: 4,
      length: 2,
      position: { x: 50, y: 300 },
      size: { width: 500, height: 5 },
      stroke: { color: '#0000ff', width: 5 },
    },
  ];

  const input = createShapeVideo(shapes, {
    background: '#f0f0f0',
    width: 1920,
    height: 1080,
    format: 'mp4',
  });

  const result = await executor.renderVideoAndWait(input);
  console.log('Shape video created:', result.response.url);
  return result;
}

// ===== TEMPLATE MANAGEMENT =====

/**
 * Example 8: Create and Use Templates
 */
export async function createAndUseTemplate(apiKey: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  // Create a template
  const template: ShotstackTemplate = {
    name: 'Welcome Video Template',
    template: createTextVideo('{{TITLE}}', {
      duration: 5,
      background: '{{BACKGROUND_COLOR}}',
      fontColor: '{{TEXT_COLOR}}',
      fontSize: 48,
      fontFamily: 'Montserrat ExtraBold',
      width: 1920,
      height: 1080,
      format: 'mp4',
    }),
  };

  const templateResult = await executor.createTemplate(template);
  console.log('Template created:', templateResult.response.id);

  // Render the template with merge fields
  const renderResult = await executor.renderTemplate(templateResult.response.id!, [
    { find: '{{TITLE}}', replace: 'Welcome to Our Company' },
    { find: '{{BACKGROUND_COLOR}}', replace: '#1e40af' },
    { find: '{{TEXT_COLOR}}', replace: '#ffffff' },
  ]);

  console.log('Template rendered:', renderResult.response.id);
  return { template: templateResult, render: renderResult };
}

/**
 * Example 9: List and Manage Templates
 */
export async function manageTemplates(apiKey: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  // List all templates
  const templates = await executor.listTemplates(0, 10);
  console.log('Templates:', templates.response.templates);

  // Get a specific template
  if (templates.response.templates.length > 0) {
    const templateId = templates.response.templates[0].id!;
    const template = await executor.getTemplate(templateId);
    console.log('Template details:', template.response);

    // Update the template
    const updatedTemplate = await executor.updateTemplate(templateId, {
      name: 'Updated Template Name',
    });
    console.log('Template updated:', updatedTemplate.response);

    // Delete the template
    const deleteResult = await executor.deleteTemplate(templateId);
    console.log('Template deleted:', deleteResult);
  }

  return templates;
}

// ===== ASSET MANAGEMENT =====

/**
 * Example 10: Asset Management
 */
export async function manageAssets(apiKey: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  // First, create a video to get an asset
  const input = createTextVideo('Asset Test', {
    duration: 3,
    background: '#000000',
    fontColor: '#ffffff',
    format: 'mp4',
  });

  const renderResult = await executor.renderVideoAndWait(input);
  console.log('Video rendered:', renderResult.response.id);

  // Get assets by render ID
  const assets = await executor.getAssetsByRenderId(renderResult.response.id);
  console.log('Assets:', assets.response.assets);

  // Get specific asset information
  if (assets.response.assets.length > 0) {
    const assetId = assets.response.assets[0].id;
    const assetInfo = await executor.getAsset(assetId);
    console.log('Asset info:', assetInfo.response);

    // Transfer asset to S3
    const transferRequest: ShotstackTransferRequest = {
      provider: 's3',
      region: 'us-east-1',
      bucket: 'my-video-bucket',
      prefix: 'rendered-videos/',
      accessKeyId: 'your-access-key',
      secretAccessKey: 'your-secret-key',
    };

    const transferResult = await executor.transferAsset(assetId, transferRequest);
    console.log('Asset transfer initiated:', transferResult.response.id);

    // Delete the asset
    const deleteResult = await executor.deleteAsset(assetId);
    console.log('Asset deleted:', deleteResult);
  }

  return assets;
}

// ===== SOURCE MANAGEMENT =====

/**
 * Example 11: Source Management
 */
export async function manageSources(apiKey: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  // Fetch a source from URL
  const sourceResult = await executor.fetchSource('https://example.com/video.mp4');
  console.log('Source fetched:', sourceResult.response.id);

  // List all sources
  const sources = await executor.listSources(0, 10);
  console.log('Sources:', sources.response.sources);

  // Get specific source information
  if (sources.response.sources.length > 0) {
    const sourceId = sources.response.sources[0].id!;
    const sourceInfo = await executor.getSource(sourceId);
    console.log('Source info:', sourceInfo.response);

    // Delete the source
    const deleteResult = await executor.deleteSource(sourceId);
    console.log('Source deleted:', deleteResult);
  }

  return sources;
}

/**
 * Example 12: Request Signed Upload URL
 */
export async function requestSignedUpload(apiKey: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  const uploadResult = await executor.requestSignedUploadUrl();
  console.log('Upload URL:', uploadResult.response.uploadUrl);
  console.log('Source ID:', uploadResult.response.sourceId);
  console.log('Expires:', uploadResult.response.expires);

  // Use the upload URL to upload a file
  // const file = new File(['video content'], 'video.mp4', { type: 'video/mp4' });
  // const uploadResponse = await fetch(uploadResult.response.uploadUrl, {
  //   method: 'PUT',
  //   body: file,
  // });

  return uploadResult;
}

// ===== AI ASSET GENERATION =====

/**
 * Example 13: Generate AI Assets
 */
export async function generateAIAssets(apiKey: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  // Generate text-to-speech
  const ttsRequest: ShotstackCreateRequest = {
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
  console.log('TTS generated:', ttsResult.response.id);

  // Generate text-to-image
  const ttiRequest: ShotstackCreateRequest = {
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
  console.log('Image generated:', ttiResult.response.id);

  // Generate image-to-video
  const itvRequest: ShotstackCreateRequest = {
    provider: 'openai',
    type: 'image-to-video',
    input: {
      image: 'https://example.com/generated-image.png',
      model: 'sora',
      duration: 5,
      fps: 24,
    },
    output: {
      format: 'mp4',
      quality: 'high',
    },
  };

  const itvResult = await executor.generateAsset(itvRequest);
  console.log('Video generated:', itvResult.response.id);

  return { tts: ttsResult, tti: ttiResult, itv: itvResult };
}

// ===== COMPLEX VIDEO COMPOSITION =====

/**
 * Example 14: Complex Video with Multiple Tracks
 */
export async function createComplexVideo(apiKey: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  const input: ShotstackInput = {
    timeline: {
      background: '#000000',
      soundtrack: {
        src: 'https://example.com/background-music.mp3',
        effect: 'fadeInOut',
      },
      tracks: [
        // Background video track
        {
          clips: [
            {
              asset: {
                type: 'video',
                src: 'https://example.com/background-video.mp4',
                fit: 'cover',
              },
              start: 0,
              length: 15,
              opacity: 0.3,
            },
          ],
        },
        // Main content track
        {
          clips: [
            {
              asset: {
                type: 'text',
                text: 'Welcome to Our Presentation',
                font: {
                  family: 'Montserrat ExtraBold',
                  size: 48,
                  color: '#ffffff',
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'middle',
                },
                background: {
                  color: '#1e40af',
                  opacity: 0.8,
                  padding: 20,
                  borderRadius: 10,
                },
              },
              start: 0,
              length: 5,
              transition: {
                in: 'fade',
                out: 'fade',
              },
            },
            {
              asset: {
                type: 'image',
                src: 'https://shotstack-assets.s3.amazonaws.com/images/waterfall-square.jpg',
                fit: 'cover',
              },
              start: 5,
              length: 5,
              transition: {
                in: 'slideLeft',
                out: 'slideRight',
              },
            },
            {
              asset: {
                type: 'text',
                text: 'Thank You for Watching!',
                font: {
                  family: 'Montserrat ExtraBold',
                  size: 36,
                  color: '#ffffff',
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'middle',
                },
              },
              start: 10,
              length: 5,
              transition: {
                in: 'fade',
                out: 'fade',
              },
            },
          ],
        },
        // Overlay graphics track
        {
          clips: [
            {
              asset: {
                type: 'shape',
                shape: 'rectangle',
                rectangle: {
                  width: 200,
                  height: 50,
                },
                fill: {
                  color: '#ff0000',
                  opacity: 0.7,
                },
              },
              start: 2,
              length: 3,
              offset: {
                x: 100,
                y: 100,
              },
            },
          ],
        },
      ],
    },
    output: {
      format: 'mp4',
      size: {
        width: 1920,
        height: 1080,
      },
      fps: 30,
      quality: 'high',
    },
  };

  const result = await executor.renderVideoAndWait(input);
  console.log('Complex video created:', result.response.url);
  return result;
}

// ===== UTILITY FUNCTIONS =====

/**
 * Example 15: Asset Probing
 */
export async function probeAsset(apiKey: string, assetUrl: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  const probeResult = await executor.probeAsset(assetUrl);
  console.log('Asset probe result:', probeResult);
  
  return probeResult;
}

/**
 * Example 16: Batch Video Processing
 */
export async function batchProcessVideos(apiKey: string, videoConfigs: Array<{
  text: string;
  background: string;
  fontColor: string;
}>) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  const results = await Promise.all(
    videoConfigs.map(async (config, index) => {
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
      console.log(`Video ${index + 1} created:`, result.response.url);
      return result;
    })
  );

  return results;
}

// ===== ERROR HANDLING AND RETRY LOGIC =====

/**
 * Example 17: Error Handling
 */
export async function handleErrors(apiKey: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  try {
    // This will fail due to invalid input
    const invalidInput: ShotstackInput = {
      timeline: {
        tracks: [], // Empty tracks will cause validation error
      },
      output: {
        format: 'mp4',
      },
    };

    await executor.renderVideo(invalidInput);
  } catch (error) {
    console.error('Expected error caught:', error);
  }

  try {
    // This will fail due to invalid asset URL
    const inputWithInvalidAsset = createTextVideo('Test', {
      duration: 5,
      background: '#000000',
      fontColor: '#ffffff',
    });

    // Modify the input to have an invalid asset
    inputWithInvalidAsset.timeline.tracks[0].clips[0].asset.src = 'invalid-url';

    await executor.renderVideoAndWait(inputWithInvalidAsset);
  } catch (error) {
    console.error('Asset error caught:', error);
  }
}

// ===== EXPORT ALL EXAMPLES =====

export const shotstackExamples = {
  // Basic examples
  createSimpleTextVideo,
  createImageWithText,
  createPhotoSlideshow,
  
  // Advanced examples
  createChromaKeyVideo,
  createVideoWithCaptions,
  createAnimatedVideo,
  createShapeVideo,
  
  // Template management
  createAndUseTemplate,
  manageTemplates,
  
  // Asset management
  manageAssets,
  manageSources,
  requestSignedUpload,
  
  // AI generation
  generateAIAssets,
  
  // Complex composition
  createComplexVideo,
  
  // Utilities
  probeAsset,
  batchProcessVideos,
  handleErrors,
};

// ===== USAGE EXAMPLES =====

/**
 * Example usage of the Shotstack integration
 */
export async function runAllExamples(apiKey: string) {
  console.log('Starting Shotstack examples...');
  
  try {
    // Basic examples
    await createSimpleTextVideo(apiKey);
    await createImageWithText(apiKey);
    await createPhotoSlideshow(apiKey);
    
    // Advanced examples
    await createChromaKeyVideo(apiKey);
    await createVideoWithCaptions(apiKey);
    await createAnimatedVideo(apiKey);
    await createShapeVideo(apiKey);
    
    // Template management
    await createAndUseTemplate(apiKey);
    await manageTemplates(apiKey);
    
    // Asset management
    await manageAssets(apiKey);
    await manageSources(apiKey);
    await requestSignedUpload(apiKey);
    
    // AI generation
    await generateAIAssets(apiKey);
    
    // Complex composition
    await createComplexVideo(apiKey);
    
    // Utilities
    await probeAsset(apiKey, 'https://example.com/video.mp4');
    await batchProcessVideos(apiKey, [
      { text: 'Video 1', background: '#ff0000', fontColor: '#ffffff' },
      { text: 'Video 2', background: '#00ff00', fontColor: '#000000' },
      { text: 'Video 3', background: '#0000ff', fontColor: '#ffffff' },
    ]);
    
    // Error handling
    await handleErrors(apiKey);
    
    console.log('All examples completed successfully!');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}