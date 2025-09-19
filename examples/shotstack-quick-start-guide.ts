/**
 * Shotstack Quick Start Guide
 * 
 * This file provides simple, ready-to-use examples for common
 * Shotstack video editing scenarios.
 */

import {
  ShotstackExecutor,
  createTextVideo,
  createImageTextVideo,
  createSlideshowVideo,
  createCustomVideo,
} from '../executors/shotstack';

// ===== QUICK START EXAMPLES =====

/**
 * Quick Start 1: Simple Text Video
 * Perfect for announcements, titles, or simple messages
 */
export async function quickTextVideo(apiKey: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  const input = createTextVideo('Hello World!', {
    duration: 5,
    background: '#1e40af',
    fontColor: '#ffffff',
    fontSize: 48,
    fontFamily: 'Montserrat ExtraBold',
  });

  const result = await executor.renderVideoAndWait(input);
  return result.response.url;
}

/**
 * Quick Start 2: Image with Text Overlay
 * Great for social media posts, presentations, or marketing content
 */
export async function quickImageWithText(apiKey: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  const input = createImageTextVideo(
    'https://shotstack-assets.s3.amazonaws.com/images/waterfall-square.jpg',
    'Beautiful Waterfall',
    {
      duration: 8,
      textPosition: 'bottom',
      textColor: '#ffffff',
      fontSize: 36,
    }
  );

  const result = await executor.renderVideoAndWait(input);
  return result.response.url;
}

/**
 * Quick Start 3: Photo Slideshow
 * Ideal for showcasing multiple images, portfolios, or event highlights
 */
export async function quickSlideshow(apiKey: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  const images = [
    'https://shotstack-assets.s3.amazonaws.com/images/waterfall-square.jpg',
    'https://shotstack-assets.s3.amazonaws.com/images/mountain-square.jpg',
    'https://shotstack-assets.s3.amazonaws.com/images/beach-square.jpg',
  ];

  const input = createSlideshowVideo(images, {
    durationPerImage: 3,
    transition: 'fade',
    background: '#000000',
  });

  const result = await executor.renderVideoAndWait(input);
  return result.response.url;
}

/**
 * Quick Start 4: Custom Video with Multiple Elements
 * For more complex compositions with text, images, and effects
 */
export async function quickCustomVideo(apiKey: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  const input = createCustomVideo(
    [
      {
        asset: {
          type: 'text',
          text: 'Welcome to Our Company',
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
        length: 3,
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
        start: 3,
        length: 4,
        transition: {
          in: 'slideLeft',
          out: 'slideRight',
        },
      },
      {
        asset: {
          type: 'text',
          text: 'Thank You!',
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
        start: 7,
        length: 3,
        transition: {
          in: 'fade',
          out: 'fade',
        },
      },
    ],
    {
      background: '#000000',
      width: 1920,
      height: 1080,
      format: 'mp4',
    }
  );

  const result = await executor.renderVideoAndWait(input);
  return result.response.url;
}

// ===== COMMON USE CASES =====

/**
 * Social Media Post
 * Optimized for Instagram, Facebook, or Twitter
 */
export async function socialMediaPost(apiKey: string, text: string, imageUrl: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  const input = createImageTextVideo(imageUrl, text, {
    duration: 10,
    textPosition: 'bottom',
    textColor: '#ffffff',
    fontSize: 32,
    fontFamily: 'Montserrat ExtraBold',
    width: 1080,
    height: 1080, // Square format for social media
    format: 'mp4',
  });

  const result = await executor.renderVideoAndWait(input);
  return result.response.url;
}

/**
 * YouTube Thumbnail Video
 * Short video perfect for YouTube thumbnails or previews
 */
export async function youtubeThumbnail(apiKey: string, title: string, backgroundImage: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  const input = createImageTextVideo(backgroundImage, title, {
    duration: 3,
    textPosition: 'center',
    textColor: '#ffffff',
    fontSize: 48,
    fontFamily: 'Montserrat ExtraBold',
    width: 1280,
    height: 720, // 16:9 aspect ratio for YouTube
    format: 'mp4',
  });

  const result = await executor.renderVideoAndWait(input);
  return result.response.url;
}

/**
 * Product Showcase
 * Perfect for e-commerce or product demonstrations
 */
export async function productShowcase(apiKey: string, productImages: string[], productName: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  const input = createSlideshowVideo(productImages, {
    durationPerImage: 4,
    transition: 'fade',
    background: '#ffffff',
    width: 1920,
    height: 1080,
    format: 'mp4',
  });

  // Add product name overlay
  input.timeline.tracks.push({
    clips: [
      {
        asset: {
          type: 'text',
          text: productName,
          font: {
            family: 'Montserrat ExtraBold',
            size: 36,
            color: '#000000',
          },
          alignment: {
            horizontal: 'center',
            vertical: 'bottom',
          },
          background: {
            color: '#ffffff',
            opacity: 0.9,
            padding: 15,
            borderRadius: 5,
          },
        },
        start: 0,
        length: productImages.length * 4,
        transition: {
          in: 'fade',
          out: 'fade',
        },
      },
    ],
  });

  const result = await executor.renderVideoAndWait(input);
  return result.response.url;
}

/**
 * Event Announcement
 * Great for promoting events, webinars, or announcements
 */
export async function eventAnnouncement(apiKey: string, eventName: string, eventDate: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  const input = createCustomVideo(
    [
      {
        asset: {
          type: 'text',
          text: eventName,
          font: {
            family: 'Montserrat ExtraBold',
            size: 48,
            color: '#ffffff',
          },
          alignment: {
            horizontal: 'center',
            vertical: 'middle',
          },
        },
        start: 0,
        length: 4,
        transition: {
          in: 'fade',
          out: 'fade',
        },
      },
      {
        asset: {
          type: 'text',
          text: eventDate,
          font: {
            family: 'Montserrat ExtraBold',
            size: 32,
            color: '#ffff00',
          },
          alignment: {
            horizontal: 'center',
            vertical: 'bottom',
          },
          background: {
            color: '#000000',
            opacity: 0.8,
            padding: 15,
            borderRadius: 5,
          },
        },
        start: 4,
        length: 3,
        transition: {
          in: 'fade',
          out: 'fade',
        },
      },
    ],
    {
      background: '#1e40af',
      width: 1920,
      height: 1080,
      format: 'mp4',
    }
  );

  const result = await executor.renderVideoAndWait(input);
  return result.response.url;
}

// ===== BATCH PROCESSING =====

/**
 * Batch Create Multiple Videos
 * Efficiently create multiple videos with different content
 */
export async function batchCreateVideos(apiKey: string, videoConfigs: Array<{
  text: string;
  background: string;
  fontColor: string;
  duration: number;
}>) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  const results = await Promise.all(
    videoConfigs.map(async (config) => {
      const input = createTextVideo(config.text, {
        duration: config.duration,
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

// ===== TEMPLATE CREATION =====

/**
 * Create a Reusable Template
 * Create a template that can be used multiple times with different content
 */
export async function createReusableTemplate(apiKey: string) {
  const executor = new ShotstackExecutor(apiKey, 'stage');
  
  // Create a template
  const template = {
    name: 'Company Announcement Template',
    template: createTextVideo('{{ANNOUNCEMENT_TEXT}}', {
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
  console.log('Template created with ID:', templateResult.response.id);

  // Use the template with different content
  const renderResult = await executor.renderTemplate(templateResult.response.id!, [
    { find: '{{ANNOUNCEMENT_TEXT}}', replace: 'New Product Launch!' },
    { find: '{{BACKGROUND_COLOR}}', replace: '#ff0000' },
    { find: '{{TEXT_COLOR}}', replace: '#ffffff' },
  ]);

  return {
    templateId: templateResult.response.id,
    renderId: renderResult.response.id,
    url: renderResult.response.url,
  };
}

// ===== EXPORT QUICK START FUNCTIONS =====

export const quickStart = {
  // Basic examples
  quickTextVideo,
  quickImageWithText,
  quickSlideshow,
  quickCustomVideo,
  
  // Common use cases
  socialMediaPost,
  youtubeThumbnail,
  productShowcase,
  eventAnnouncement,
  
  // Batch processing
  batchCreateVideos,
  
  // Templates
  createReusableTemplate,
};

// ===== USAGE EXAMPLE =====

/**
 * Example of how to use the quick start functions
 */
export async function runQuickStartExamples(apiKey: string) {
  console.log('Running Shotstack Quick Start examples...');
  
  try {
    // Basic examples
    const textVideoUrl = await quickTextVideo(apiKey);
    console.log('Text video created:', textVideoUrl);
    
    const imageTextUrl = await quickImageWithText(apiKey);
    console.log('Image with text created:', imageTextUrl);
    
    const slideshowUrl = await quickSlideshow(apiKey);
    console.log('Slideshow created:', slideshowUrl);
    
    const customVideoUrl = await quickCustomVideo(apiKey);
    console.log('Custom video created:', customVideoUrl);
    
    // Common use cases
    const socialMediaUrl = await socialMediaPost(
      apiKey,
      'Check out our new product!',
      'https://shotstack-assets.s3.amazonaws.com/images/waterfall-square.jpg'
    );
    console.log('Social media post created:', socialMediaUrl);
    
    const youtubeUrl = await youtubeThumbnail(
      apiKey,
      'Amazing Tutorial',
      'https://shotstack-assets.s3.amazonaws.com/images/mountain-square.jpg'
    );
    console.log('YouTube thumbnail created:', youtubeUrl);
    
    // Batch processing
    const batchResults = await batchCreateVideos(apiKey, [
      { text: 'Video 1', background: '#ff0000', fontColor: '#ffffff', duration: 3 },
      { text: 'Video 2', background: '#00ff00', fontColor: '#000000', duration: 4 },
      { text: 'Video 3', background: '#0000ff', fontColor: '#ffffff', duration: 5 },
    ]);
    console.log('Batch videos created:', batchResults);
    
    // Template creation
    const templateResult = await createReusableTemplate(apiKey);
    console.log('Template created and used:', templateResult);
    
    console.log('All quick start examples completed successfully!');
  } catch (error) {
    console.error('Error running quick start examples:', error);
  }
}