/**
 * VEED Lipsync Examples
 * 
 * This file contains comprehensive examples and use cases for the
 * VEED Lipsync model, showcasing its capabilities in generating
 * realistic lipsync from any audio using VEED's latest model.
 * 
 * Key Features Demonstrated:
 * - Realistic lipsync generation
 * - Audio-video synchronization
 * - Speech synchronization
 * - Dubbing and voice-over
 * - Multilingual support
 * - High-quality output
 * - Commercial use applications
 * - And much more...
 */

import { VeedLipsyncExecutor, createVeedLipsyncExecutor } from '../executors/veed-lipsync';

// ============================================================================
// BASIC USAGE EXAMPLES
// ============================================================================

export const veedLipsyncExamples = {
  
  // ============================================================================
  // CONTENT CREATION EXAMPLES
  // ============================================================================
  
  contentCreation: {
    // YouTube video dubbing
    youtubeDubbing: {
      description: "Create dubbed versions of YouTube videos for different languages",
      videoUrl: "https://example.com/original-video.mp4",
      audioUrl: "https://example.com/spanish-audio.mp3",
      useCase: "Multilingual YouTube content creation",
      expectedResult: "High-quality Spanish-dubbed version of the original video",
      cost: "Varies based on video length ($0.4 per minute)"
    },

    // Social media content
    socialMediaContent: {
      description: "Create engaging social media content with synchronized speech",
      videoUrl: "https://example.com/influencer-video.mp4",
      audioUrl: "https://example.com/voice-over.mp3",
      useCase: "Instagram, TikTok, and other social media platforms",
      expectedResult: "Engaging social media content with perfect lipsync",
      cost: "Varies based on video length ($0.4 per minute)"
    },

    // Educational video narration
    educationalNarration: {
      description: "Add professional narration to educational videos",
      videoUrl: "https://example.com/educational-content.mp4",
      audioUrl: "https://example.com/professional-narration.mp3",
      useCase: "Online courses, tutorials, and educational content",
      expectedResult: "Professional educational video with clear narration",
      cost: "Varies based on video length ($0.4 per minute)"
    },

    // Marketing video voice-overs
    marketingVoiceOver: {
      description: "Create compelling marketing videos with professional voice-overs",
      videoUrl: "https://example.com/product-demo.mp4",
      audioUrl: "https://example.com/marketing-script.mp3",
      useCase: "Product marketing, brand promotion, advertising",
      expectedResult: "Professional marketing video with synchronized voice-over",
      cost: "Varies based on video length ($0.4 per minute)"
    }
  },

  // ============================================================================
  // LOCALIZATION EXAMPLES
  // ============================================================================
  
  localization: {
    // Multilingual video content
    multilingualContent: {
      description: "Create multilingual versions of video content",
      videoUrl: "https://example.com/english-video.mp4",
      audioUrl: "https://example.com/french-audio.mp3",
      useCase: "International content distribution",
      expectedResult: "French version of the original English video",
      cost: "Varies based on video length ($0.4 per minute)"
    },

    // International marketing videos
    internationalMarketing: {
      description: "Adapt marketing videos for different international markets",
      videoUrl: "https://example.com/us-marketing-video.mp4",
      audioUrl: "https://example.com/german-marketing-audio.mp3",
      useCase: "Global marketing campaigns",
      expectedResult: "German version of the US marketing video",
      cost: "Varies based on video length ($0.4 per minute)"
    },

    // Educational content translation
    educationalTranslation: {
      description: "Translate educational content for different language markets",
      videoUrl: "https://example.com/english-tutorial.mp4",
      audioUrl: "https://example.com/spanish-tutorial-audio.mp3",
      useCase: "International education platforms",
      expectedResult: "Spanish version of the English tutorial",
      cost: "Varies based on video length ($0.4 per minute)"
    },

    // Entertainment content dubbing
    entertainmentDubbing: {
      description: "Dub entertainment content for different language audiences",
      videoUrl: "https://example.com/movie-clip.mp4",
      audioUrl: "https://example.com/japanese-dubbing.mp3",
      useCase: "International entertainment distribution",
      expectedResult: "Japanese-dubbed version of the movie clip",
      cost: "Varies based on video length ($0.4 per minute)"
    }
  },

  // ============================================================================
  // ACCESSIBILITY EXAMPLES
  // ============================================================================
  
  accessibility: {
    // Adding speech to silent videos
    silentVideoSpeech: {
      description: "Add speech to silent videos for better accessibility",
      videoUrl: "https://example.com/silent-presentation.mp4",
      audioUrl: "https://example.com/descriptive-audio.mp3",
      useCase: "Making silent content accessible",
      expectedResult: "Silent video with added descriptive speech",
      cost: "Varies based on video length ($0.4 per minute)"
    },

    // Creating accessible content
    accessibleContent: {
      description: "Create accessible content with clear speech synchronization",
      videoUrl: "https://example.com/visual-content.mp4",
      audioUrl: "https://example.com/accessibility-audio.mp3",
      useCase: "Accessibility compliance and inclusive content",
      expectedResult: "Accessible video content with clear speech",
      cost: "Varies based on video length ($0.4 per minute)"
    },

    // Voice-over for presentations
    presentationVoiceOver: {
      description: "Add professional voice-over to presentation videos",
      videoUrl: "https://example.com/presentation-slides.mp4",
      audioUrl: "https://example.com/presentation-narration.mp3",
      useCase: "Professional presentations and training materials",
      expectedResult: "Professional presentation with synchronized narration",
      cost: "Varies based on video length ($0.4 per minute)"
    },

    // Audio description videos
    audioDescription: {
      description: "Create audio description for visual content",
      videoUrl: "https://example.com/visual-story.mp4",
      audioUrl: "https://example.com/audio-description.mp3",
      useCase: "Accessibility for visually impaired audiences",
      expectedResult: "Video with audio description for accessibility",
      cost: "Varies based on video length ($0.4 per minute)"
    }
  },

  // ============================================================================
  // PROFESSIONAL EXAMPLES
  // ============================================================================
  
  professional: {
    // Corporate training videos
    corporateTraining: {
      description: "Create professional corporate training videos with synchronized speech",
      videoUrl: "https://example.com/training-content.mp4",
      audioUrl: "https://example.com/training-narration.mp3",
      useCase: "Employee training and development",
      expectedResult: "Professional training video with clear instruction",
      cost: "Varies based on video length ($0.4 per minute)"
    },

    // Product demonstration videos
    productDemonstration: {
      description: "Create product demonstration videos with professional voice-over",
      videoUrl: "https://example.com/product-demo.mp4",
      audioUrl: "https://example.com/product-explanation.mp3",
      useCase: "Product marketing and sales",
      expectedResult: "Professional product demo with synchronized explanation",
      cost: "Varies based on video length ($0.4 per minute)"
    },

    // Conference presentation videos
    conferencePresentation: {
      description: "Create conference presentation videos with synchronized speech",
      videoUrl: "https://example.com/conference-slides.mp4",
      audioUrl: "https://example.com/conference-audio.mp3",
      useCase: "Conference content distribution and archiving",
      expectedResult: "Professional conference presentation with synchronized audio",
      cost: "Varies based on video length ($0.4 per minute)"
    },

    // Professional development content
    professionalDevelopment: {
      description: "Create professional development content with clear instruction",
      videoUrl: "https://example.com/skill-demonstration.mp4",
      audioUrl: "https://example.com/instruction-audio.mp3",
      useCase: "Professional skill development and training",
      expectedResult: "Professional development video with clear instruction",
      cost: "Varies based on video length ($0.4 per minute)"
    }
  }
};

// ============================================================================
// USAGE EXAMPLES WITH ACTUAL IMPLEMENTATION
// ============================================================================

export const veedLipsyncUsageExamples = {
  
  // Basic lipsync generation
  generateBasicLipsync: async (apiKey: string, videoUrl: string, audioUrl: string) => {
    const executor = new VeedLipsyncExecutor(apiKey);
    
    const result = await executor.generateLipsync({
      video_url: videoUrl,
      audio_url: audioUrl
    });

    return result;
  },

  // Lipsync generation with progress tracking
  generateLipsyncWithProgress: async (apiKey: string, videoUrl: string, audioUrl: string) => {
    const executor = new VeedLipsyncExecutor(apiKey);
    
    const result = await executor.generateLipsync({
      video_url: videoUrl,
      audio_url: audioUrl
    }, {
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      }
    });

    return result;
  },

  // Queue-based processing for long videos
  processLongVideo: async (apiKey: string, videoUrl: string, audioUrl: string, webhookUrl?: string) => {
    const executor = new VeedLipsyncExecutor(apiKey);
    
    // Submit request to queue
    const { request_id } = await executor.submitLipsyncRequest({
      video_url: videoUrl,
      audio_url: audioUrl
    }, {
      webhookUrl
    });

    // Check status periodically
    let status = await executor.getRequestStatus(request_id, { logs: true });
    
    while (status.status !== "COMPLETED" && status.status !== "FAILED") {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      status = await executor.getRequestStatus(request_id, { logs: true });
    }

    if (status.status === "COMPLETED") {
      return await executor.getRequestResult(request_id);
    } else {
      throw new Error(`Lipsync generation failed: ${status.error}`);
    }
  },

  // Batch processing multiple videos
  processMultipleVideos: async (apiKey: string, videoAudioPairs: Array<{
    videoUrl: string;
    audioUrl: string;
    name?: string;
  }>) => {
    const executor = new VeedLipsyncExecutor(apiKey);
    const results = [];

    for (const pair of videoAudioPairs) {
      try {
        const result = await executor.generateLipsync({
          video_url: pair.videoUrl,
          audio_url: pair.audioUrl
        });
        results.push({ 
          success: true, 
          name: pair.name || 'Unnamed',
          result 
        });
      } catch (error) {
        results.push({ 
          success: false, 
          name: pair.name || 'Unnamed',
          error: error.message 
        });
      }
    }

    return results;
  },

  // Cost calculation
  calculateLipsyncCost: (videoDurationMinutes: number) => {
    const executor = new VeedLipsyncExecutor('dummy-key');
    return executor.calculateCost(videoDurationMinutes);
  },

  // Processing time estimation
  estimateProcessingTime: (videoDurationMinutes: number) => {
    const executor = new VeedLipsyncExecutor('dummy-key');
    return executor.estimateProcessingTime(videoDurationMinutes);
  }
};

// ============================================================================
// USE CASE TEMPLATES
// ============================================================================

export const veedLipsyncUseCaseTemplates = {
  
  // Content creation templates
  contentCreation: {
    youtubeDubbing: {
      template: "Create {language} dubbed version of {content_type} for YouTube",
      variables: {
        language: ["Spanish", "French", "German", "Japanese", "Chinese", "Portuguese"],
        content_type: ["tutorial", "review", "entertainment", "educational", "marketing"]
      }
    },
    
    socialMediaContent: {
      template: "Create {platform} content with {content_style} for {target_audience}",
      variables: {
        platform: ["Instagram", "TikTok", "YouTube Shorts", "Facebook", "Twitter"],
        content_style: ["trending", "educational", "entertaining", "promotional", "lifestyle"],
        target_audience: ["Gen Z", "millennials", "professionals", "students", "parents"]
      }
    }
  },

  // Localization templates
  localization: {
    multilingualContent: {
      template: "Translate {content_type} from {source_language} to {target_language}",
      variables: {
        content_type: ["marketing video", "educational content", "entertainment", "training material"],
        source_language: ["English", "Spanish", "French", "German", "Japanese"],
        target_language: ["English", "Spanish", "French", "German", "Japanese", "Chinese"]
      }
    },
    
    internationalMarketing: {
      template: "Adapt {marketing_type} for {target_market} with {cultural_considerations}",
      variables: {
        marketing_type: ["product launch", "brand campaign", "promotional video", "advertisement"],
        target_market: ["US market", "European market", "Asian market", "Latin American market"],
        cultural_considerations: ["local preferences", "cultural sensitivity", "regional trends", "language nuances"]
      }
    }
  },

  // Accessibility templates
  accessibility: {
    accessibleContent: {
      template: "Make {content_type} accessible for {accessibility_need}",
      variables: {
        content_type: ["presentation", "tutorial", "entertainment", "educational content"],
        accessibility_need: ["hearing impaired", "visually impaired", "cognitive disabilities", "motor disabilities"]
      }
    },
    
    audioDescription: {
      template: "Add {description_type} to {visual_content} for {accessibility_purpose}",
      variables: {
        description_type: ["audio description", "narrative description", "detailed explanation", "contextual information"],
        visual_content: ["video content", "presentation", "demonstration", "story"],
        accessibility_purpose: ["visual accessibility", "inclusive design", "compliance", "user experience"]
      }
    }
  }
};

// ============================================================================
// BEST PRACTICES AND TIPS
// ============================================================================

export const veedLipsyncBestPractices = {
  
  // Input preparation
  inputPreparation: [
    "Use high-quality video with clear facial features",
    "Ensure good lighting on the subject's face",
    "Use clear, high-quality audio for best results",
    "Match audio length to video duration",
    "Ensure subject is facing the camera for best lipsync results",
    "Use videos with minimal background noise",
    "Choose audio with clear speech and minimal background music"
  ],

  // Cost optimization
  costOptimization: [
    "Process shorter clips to reduce costs",
    "Batch process multiple videos together",
    "Use appropriate video resolution",
    "Optimize audio quality for better synchronization",
    "Plan your content to minimize processing time",
    "Use efficient video formats (MP4 recommended)",
    "Consider processing time vs. cost trade-offs"
  ],

  // Quality enhancement
  qualityEnhancement: [
    "Use videos with clear facial expressions",
    "Ensure subject is facing the camera",
    "Use natural lighting for better results",
    "Test with different audio qualities",
    "Use professional-grade audio when possible",
    "Ensure audio and video are properly synchronized",
    "Use high-resolution source materials"
  ],

  // Technical considerations
  technicalConsiderations: [
    "Supported video formats: MP4, MOV, WebM, M4V, GIF",
    "Supported audio formats: MP3, OGG, WAV, M4A, AAC",
    "Processing time varies with video length",
    "Use queue system for long videos",
    "Monitor processing status for long-running jobs",
    "Implement proper error handling and retries",
    "Use webhooks for asynchronous processing"
  ]
};

// ============================================================================
// TROUBLESHOOTING EXAMPLES
// ============================================================================

export const veedLipsyncTroubleshooting = {
  
  // Common issues and solutions
  commonIssues: {
    poorLipsyncQuality: {
      problem: "Lipsync quality is poor or unnatural",
      solutions: [
        "Use higher quality source video with clear facial features",
        "Ensure good lighting on the subject's face",
        "Use clear, high-quality audio",
        "Ensure subject is facing the camera",
        "Use videos with minimal background noise"
      ]
    },
    
    processingFailure: {
      problem: "Lipsync generation fails or times out",
      solutions: [
        "Check that video and audio URLs are accessible",
        "Verify file formats are supported",
        "Ensure audio and video lengths match",
        "Use queue system for long videos",
        "Check API key and permissions"
      ]
    },
    
    audioVideoMismatch: {
      problem: "Audio and video are not properly synchronized",
      solutions: [
        "Ensure audio and video lengths match exactly",
        "Use high-quality source materials",
        "Check for audio delays or timing issues",
        "Verify audio format compatibility",
        "Test with different audio qualities"
      ]
    },
    
    fileFormatIssues: {
      problem: "Unsupported file format errors",
      solutions: [
        "Use supported video formats: MP4, MOV, WebM, M4V, GIF",
        "Use supported audio formats: MP3, OGG, WAV, M4A, AAC",
        "Convert files to supported formats if necessary",
        "Check file URLs are accessible and valid",
        "Verify file size and quality requirements"
      ]
    }
  },

  // Error handling examples
  errorHandling: {
    urlValidation: {
      error: "Invalid video or audio URL format",
      solution: "Ensure URLs are properly formatted and accessible"
    },
    
    fileFormatValidation: {
      error: "Unsupported file format",
      solution: "Use supported formats: MP4, MOV, WebM, M4V, GIF for video; MP3, OGG, WAV, M4A, AAC for audio"
    },
    
    processingTimeout: {
      error: "Processing timeout or failure",
      solution: "Use queue system for long videos and implement proper retry logic"
    },
    
    apiKeyIssues: {
      error: "Authentication or API key issues",
      solution: "Verify API key is valid and has proper permissions"
    }
  }
};

export default veedLipsyncExamples;
