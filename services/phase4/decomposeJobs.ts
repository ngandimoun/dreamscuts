// services/phase4/decomposeJobs.ts
// Phase 4: Job Decomposition - Convert manifest to deterministic job list
// 
// 🧩 What this does:
// - Reads Production Manifest (blueprint of what needs to exist)
// - Produces JobPlan[] (to-do list for workers)
// - Maps to real AI providers: ElevenLabs, Fal.ai, Veed, Shotstack
// - Handles dependencies and parallelization
//
// ⚙️ AI Provider Mapping:
// - ElevenLabs Dialog → tts_elevenlabs (with audio tags support)
// - Fal.ai/Replicate → gen_image_falai, gen_video_falai
// - Veed Lip Sync → lip_sync_lypsso (with fallback options)
// - ElevenLabs Music → gen_music_elevenlabs
// - Shotstack → render_shotstack (with captions)

import { ProductionManifest, JobPlan, ScenePlan } from '../../types/production-manifest';

export interface JobPayload {
  [key: string]: any;
}

/**
 * Decompose Production Manifest into deterministic job list
 * This is the bridge to Phase 5 worker execution
 */
export function decomposeJobs(manifest: ProductionManifest): JobPlan[] {
  console.log('[Phase4Jobs] Starting job decomposition...');
  
  const jobs: JobPlan[] = [];
  const jobIds: string[] = [];
  
  // Job optimization tracking
  const optimizationStats = {
    totalJobs: 0,
    parallelizableJobs: 0,
    estimatedDuration: 0,
    criticalPath: [] as string[]
  };

  // Process each scene
  manifest.scenes.forEach((scene, sceneIndex) => {
    // TTS jobs for narration
    if (scene.narration) {
      const ttsJob = createTTSJob(scene, manifest);
      jobs.push(ttsJob);
      jobIds.push(ttsJob.id);
    }

    // Asset generation jobs for visuals
    scene.visuals.forEach((visual, visualIndex) => {
      if (visual.type === 'generated') {
        const asset = manifest.assets[visual.assetId];
        if (asset && asset.status === 'pending') {
          const assetJob = createAssetGenerationJob(scene, visual, asset, manifest);
          jobs.push(assetJob);
          jobIds.push(assetJob.id);
        }
      }
    });

    // Chart generation jobs
    if (scene.visualAnchor && scene.visualAnchor.toLowerCase().includes('chart')) {
      const chartJob = createChartGenerationJob(scene, manifest);
      jobs.push(chartJob);
      jobIds.push(chartJob.id);
    }

    // Lip sync jobs (if needed)
    if (scene.narration && scene.visuals.some(v => v.type === 'user_asset')) {
      const lipSyncJob = createLipSyncJob(scene, manifest);
      jobs.push(lipSyncJob);
      jobIds.push(lipSyncJob.id);
    }
  });

  // Music generation jobs
  const musicJobs = createMusicGenerationJobs(manifest);
  jobs.push(...musicJobs);
  musicJobs.forEach(job => jobIds.push(job.id));

  // Sound effects generation jobs
  const soundEffectsJobs = createSoundEffectsJobs(manifest);
  jobs.push(...soundEffectsJobs);
  soundEffectsJobs.forEach(job => jobIds.push(job.id));

  // Video generation jobs (for scenes that need video content)
  const videoJobs = createVideoGenerationJobs(manifest);
  jobs.push(...videoJobs);
  videoJobs.forEach(job => jobIds.push(job.id));

  // Final render job (depends on all others)
  const renderJob = createRenderJob(manifest, jobIds);
  jobs.push(renderJob);

  // Optimize job execution order and dependencies
  const optimizedJobs = optimizeJobExecution(jobs, manifest);
  
  // Calculate optimization statistics
  optimizationStats.totalJobs = optimizedJobs.length;
  optimizationStats.parallelizableJobs = optimizedJobs.filter(job => !job.dependsOn || job.dependsOn.length === 0).length;
  optimizationStats.estimatedDuration = estimateTotalExecutionTime(optimizedJobs);
  optimizationStats.criticalPath = findCriticalPath(optimizedJobs);
  
  console.log(`[Phase4Jobs] Created ${optimizedJobs.length} jobs total`);
  console.log(`[Phase4Jobs] Optimization: ${optimizationStats.parallelizableJobs} parallelizable, ${optimizationStats.estimatedDuration}s estimated duration`);
  
  return optimizedJobs;
}

/**
 * Create TTS job for scene narration using ElevenLabs Dialog
 * Supports audio tags for expressive dialogue generation
 */
function createTTSJob(scene: ScenePlan, manifest: ProductionManifest): JobPlan {
  const ttsJobId = `job_tts_${scene.id}`;
  
  // Enhance text with audio tags based on scene purpose and tone
  const enhancedText = enhanceTextWithAudioTags(scene.narration!, scene.purpose, manifest.consistency.tone);
  
  const payload: JobPayload = {
    sceneId: scene.id,
    text: enhancedText,
    originalText: scene.narration,
    voiceId: scene.tts?.voiceId || manifest.audio.ttsDefaults.voiceId,
    modelId: 'eleven_multilingual_v2', // Best for dialogue
    languageCode: manifest.metadata.language || 'en',
    outputFormat: 'mp3_44100_128', // High quality for lip sync
    voiceSettings: {
      stability: scene.tts?.stability || 0.7,
      similarity_boost: scene.tts?.similarityBoost || 0.8,
      style: scene.tts?.style || 0.4,
      use_speaker_boost: true
    },
    dialogueSettings: {
      use_audio_tags: true,
      enhance_emotion: true,
      stability: 'natural' // or 'creative' for more expressive
    },
    provider: 'elevenlabs',
    // Context for better generation
    previousText: scene.id !== manifest.scenes[0]?.id ? manifest.scenes[manifest.scenes.indexOf(scene) - 1]?.narration : undefined,
    nextText: scene.id !== manifest.scenes[manifest.scenes.length - 1]?.id ? manifest.scenes[manifest.scenes.indexOf(scene) + 1]?.narration : undefined
  };

  return {
    id: ttsJobId,
    type: 'tts_elevenlabs',
    payload,
    priority: 10,
    dependsOn: [],
    retryPolicy: {
      maxRetries: 3,
      backoffSeconds: 30
    }
  } as JobPlan;
}

/**
 * Create asset generation job using Fal.ai models
 * Supports multiple models: FLUX, Nano Banana, Seedream, etc.
 */
function createAssetGenerationJob(
  scene: ScenePlan, 
  visual: any, 
  asset: any, 
  manifest: ProductionManifest
): JobPlan {
  const prompt = buildAssetPrompt(scene, visual, manifest);
  const modelConfig = determineAssetModel(visual, manifest);
  
  const payload: JobPayload = {
    sceneId: scene.id,
    assetId: visual.assetId,
    prompt: prompt,
    model: modelConfig.model,
    endpoint: modelConfig.endpoint,
    imageSize: determineImageSize(manifest),
    numInferenceSteps: modelConfig.numInferenceSteps || 28,
    guidanceScale: modelConfig.guidanceScale || 4.5,
    numImages: 1,
    enableSafetyChecker: true,
    outputFormat: 'jpeg',
    acceleration: 'regular', // or 'high' for faster generation
    resultAssetId: visual.assetId,
    // Fal.ai specific settings based on your instructions
    syncMode: false, // Use async for better performance
    seed: asset.meta?.seed || undefined,
    // Cost tracking
    estimatedCost: modelConfig.cost || 0.04,
    // Model-specific parameters
    ...(modelConfig.model === 'nano-banana' && {
      quality: 'standard',
      style: 'photographic'
    }),
    ...(modelConfig.model === 'flux-srpo' && {
      image_size: determineImageSize(manifest),
      num_inference_steps: modelConfig.numInferenceSteps,
      guidance_scale: modelConfig.guidanceScale
    })
  };

  // Determine job type based on asset type
  const jobType = asset.durationSeconds && asset.durationSeconds > 0 ? 'gen_video_falai' : 'gen_image_falai';

  return {
    id: `job_gen_${visual.assetId}`,
    type: jobType as any,
    payload,
    priority: 8,
    dependsOn: [],
    retryPolicy: {
      maxRetries: 2,
      backoffSeconds: 60
    }
  } as JobPlan;
}

/**
 * Create chart generation job
 */
function createChartGenerationJob(scene: ScenePlan, manifest: ProductionManifest): JobPlan {
  const chartId = `gen_chart_${scene.id}`;
  
  const payload: JobPayload = {
    sceneId: scene.id,
    data: generateSampleData(scene),
    style: 'vector-minimal',
    provider: 'gptimage',
    resultAssetId: chartId
  };

  return {
    id: `job_chart_${scene.id}`,
    type: 'generate_chart_gptimage',
    payload,
    priority: 10,
    dependsOn: [],
    retryPolicy: {
      maxRetries: 2,
      backoffSeconds: 60
    }
  } as JobPlan;
}

/**
 * Create lip sync job using Veed with fallback options
 * Supports multiple providers: Veed, Lypsso, Creatify
 */
function createLipSyncJob(scene: ScenePlan, manifest: ProductionManifest): JobPlan {
  const ttsJobId = `job_tts_${scene.id}`;
  
  // Find the face asset for this scene
  const faceAsset = scene.visuals.find(v => v.type === 'user' || v.type === 'generated')?.assetId;
  
  const payload: JobPayload = {
    sceneId: scene.id,
    audioJobId: ttsJobId,
    videoAssetId: faceAsset,
    // Primary provider: Veed (most reliable) - $0.4 per minute
    provider: 'veed',
    endpoint: 'veed/lipsync',
    quality: 'high',
    // Fallback providers based on your instructions
    fallbackProviders: [
      {
        provider: 'sync-lipsync-v2',
        endpoint: 'fal-ai/sync-lipsync/v2',
        cost: 0.3, // per minute
        quality: 'high',
        fps: 30
      },
      {
        provider: 'creatify-lipsync',
        endpoint: 'creatify/lipsync',
        cost: 1.0, // $1 per audio minute
        quality: 'high',
        maxDuration: 600 // 10 minutes max
      }
    ],
    // Veed specific settings based on your documentation
    videoUrl: `{{asset_url:${faceAsset}}}`, // Will be resolved by worker
    audioUrl: `{{job_result:${ttsJobId}}}`, // Will be resolved by worker
    // Quality settings
    fps: 30,
    startTime: 0,
    endTime: scene.durationSeconds,
    // Cost optimization
    costLimit: 0.4, // $0.4 per minute for Veed
    maxDuration: scene.durationSeconds,
    // Supported formats
    supportedVideoFormats: ['mp4', 'mov', 'webm', 'm4v', 'gif'],
    supportedAudioFormats: ['mp3', 'ogg', 'wav', 'm4a', 'aac']
  };

  return {
    id: `job_lipsync_${scene.id}`,
    type: 'lip_sync_lypsso', // Keep existing type for compatibility
    payload,
    priority: 6,
    dependsOn: [ttsJobId],
    retryPolicy: {
      maxRetries: 2,
      backoffSeconds: 90
    }
  } as JobPlan;
}

/**
 * Create music generation jobs using ElevenLabs Music
 * Supports composition plans and detailed music generation
 */
function createMusicGenerationJobs(manifest: ProductionManifest): JobPlan[] {
  const jobs: JobPlan[] = [];
  
  // Create a single music track for the entire video
  const musicId = 'music_01';
  const musicPrompt = generateMusicPrompt(manifest);
  
  const payload: JobPayload = {
    cueId: musicId,
    prompt: musicPrompt,
    musicLengthMs: manifest.metadata.durationSeconds * 1000,
    outputFormat: 'mp3_44100_128',
    // ElevenLabs Music specific settings
    provider: 'elevenlabs',
    action: 'compose_music',
    // Music characteristics
    mood: determineMusicMood(manifest),
    genre: determineMusicGenre(manifest),
    structure: 'intro->build->outro',
    tempo: determineMusicTempo(manifest),
    instruments: determineMusicInstruments(manifest),
    // Quality settings
    useCompositionPlan: true,
    enhanceEmotion: true,
    // Cost optimization
    maxDuration: manifest.metadata.durationSeconds * 1000,
    costLimit: 0.10 // $0.10 per 30 seconds
  };

  jobs.push({
    id: `job_music_${musicId}`,
    type: 'gen_music_elevenlabs',
    payload,
    priority: 5,
    dependsOn: [],
    retryPolicy: {
      maxRetries: 2,
      backoffSeconds: 60
    }
  } as JobPlan);

  return jobs;
}

/**
 * Create sound effects generation jobs using ElevenLabs Sound Effects
 * Based on your clear instructions for sound effects
 */
function createSoundEffectsJobs(manifest: ProductionManifest): JobPlan[] {
  const jobs: JobPlan[] = [];
  
  // Generate sound effects for each scene based on content
  manifest.scenes.forEach((scene, index) => {
    const soundEffects = determineSceneSoundEffects(scene, manifest);
    
    soundEffects.forEach((effect, effectIndex) => {
      const effectId = `sound_effect_${scene.id}_${effectIndex}`;
      
      const payload: JobPayload = {
        sceneId: scene.id,
        effectId: effectId,
        text: effect.description,
        durationSeconds: effect.duration || 2.0,
        loop: effect.loop || false,
        promptInfluence: 0.3,
        outputFormat: 'mp3_44100_128',
        // ElevenLabs Sound Effects specific settings
        provider: 'elevenlabs',
        endpoint: 'fal-ai/elevenlabs/sound-effects/v2',
        modelId: 'eleven_text_to_sound_v2',
        // Cost optimization
        costLimit: 0.10, // $0.10 per effect
        maxDuration: 22, // 22 seconds max
        // Timing
        startTime: effect.startTime || 0,
        endTime: effect.endTime || scene.durationSeconds
      };

      jobs.push({
        id: effectId,
        type: 'gen_sound_effects_elevenlabs' as any,
        payload,
        priority: 7,
        dependsOn: [],
        retryPolicy: {
          maxRetries: 2,
          backoffSeconds: 45
        }
      } as JobPlan);
    });
  });

  return jobs;
}

/**
 * Determine sound effects for a scene based on content and purpose
 */
function determineSceneSoundEffects(scene: ScenePlan, manifest: ProductionManifest): Array<{
  description: string;
  duration?: number;
  loop?: boolean;
  startTime?: number;
  endTime?: number;
}> {
  const effects: Array<{
    description: string;
    duration?: number;
    loop?: boolean;
    startTime?: number;
    endTime?: number;
  }> = [];

  // Add effects based on scene purpose
  if (scene.purpose === 'hook') {
    effects.push({
      description: 'Attention-grabbing sound effect for video opening',
      duration: 1.5,
      startTime: 0
    });
  }

  if (scene.purpose === 'cta') {
    effects.push({
      description: 'Call-to-action sound effect, energetic and motivating',
      duration: 2.0,
      startTime: scene.durationSeconds - 2.0
    });
  }

  // Add effects based on content keywords
  const narration = scene.narration?.toLowerCase() || '';
  
  if (narration.includes('music') || narration.includes('sound')) {
    effects.push({
      description: 'Musical transition sound effect',
      duration: 1.0,
      loop: false
    });
  }

  if (narration.includes('click') || narration.includes('button')) {
    effects.push({
      description: 'Button click sound effect',
      duration: 0.5,
      loop: false
    });
  }

  if (narration.includes('notification') || narration.includes('alert')) {
    effects.push({
      description: 'Notification sound effect',
      duration: 1.0,
      loop: false
    });
  }

  return effects;
}

/**
 * Create video generation jobs using Fal.ai video models
 * Based on your clear instructions for video generation
 */
function createVideoGenerationJobs(manifest: ProductionManifest): JobPlan[] {
  const jobs: JobPlan[] = [];
  
  // Generate videos for scenes that need dynamic content
  manifest.scenes.forEach((scene, index) => {
    if (shouldGenerateVideo(scene, manifest)) {
      const videoConfig = determineVideoModel(scene, manifest);
      const videoId = `video_${scene.id}`;
      
      const payload: JobPayload = {
        sceneId: scene.id,
        videoId: videoId,
        prompt: buildVideoPrompt(scene, manifest),
        // Video model configuration based on your instructions
        model: videoConfig.model,
        endpoint: videoConfig.endpoint,
        duration: videoConfig.duration || '8s',
        resolution: videoConfig.resolution || '720p',
        aspectRatio: manifest.metadata.aspectRatio,
        generateAudio: videoConfig.generateAudio || false,
        // Cost optimization
        estimatedCost: videoConfig.cost || 0.25,
        costLimit: videoConfig.costLimit || 0.50,
        // Quality settings
        quality: 'high',
        acceleration: 'regular'
      };

      jobs.push({
        id: videoId,
        type: 'gen_video_falai' as any,
        payload,
        priority: 6,
        dependsOn: [],
        retryPolicy: {
          maxRetries: 2,
          backoffSeconds: 90
        }
      } as JobPlan);
    }
  });

  return jobs;
}

/**
 * Determine if a scene should generate video content
 */
function shouldGenerateVideo(scene: ScenePlan, manifest: ProductionManifest): boolean {
  // Generate video for scenes with dynamic content
  const narration = scene.narration?.toLowerCase() || '';
  
  // Keywords that suggest video content is needed
  const videoKeywords = [
    'animation', 'moving', 'dynamic', 'transition', 'effect',
    'demonstration', 'tutorial', 'step by step', 'process',
    'timelapse', 'motion', 'flow', 'sequence'
  ];
  
  return videoKeywords.some(keyword => narration.includes(keyword)) ||
         scene.purpose === 'hook' || // Hook scenes often need dynamic content
         manifest.metadata.profile === 'anime_mode'; // Anime mode needs more video content
}

/**
 * Determine video model based on scene requirements
 */
function determineVideoModel(scene: ScenePlan, manifest: ProductionManifest): {
  model: string;
  endpoint: string;
  duration?: string;
  resolution?: string;
  generateAudio?: boolean;
  cost?: number;
  costLimit?: number;
} {
  const profile = manifest.metadata.profile;
  const duration = scene.durationSeconds;
  
  // Model selection based on your video generation instructions
  if (profile === 'anime_mode' || duration <= 8) {
    return {
      model: 'veo3-fast',
      endpoint: 'fal-ai/veo3/fast',
      duration: '8s',
      resolution: '720p',
      generateAudio: false,
      cost: 0.25, // $0.25-$0.40 per second
      costLimit: 0.40
    };
  }
  
  if (duration <= 5) {
    return {
      model: 'wan-effects',
      endpoint: 'fal-ai/wan-effects',
      duration: '5s',
      resolution: '720p',
      generateAudio: false,
      cost: 0.35, // $0.35 per video
      costLimit: 0.35
    };
  }
  
  // Default to Veo3 Fast for most cases
  return {
    model: 'veo3-fast',
    endpoint: 'fal-ai/veo3/fast',
    duration: '8s',
    resolution: '720p',
    generateAudio: false,
    cost: 0.25,
    costLimit: 0.40
  };
}

/**
 * Build video generation prompt based on scene content
 */
function buildVideoPrompt(scene: ScenePlan, manifest: ProductionManifest): string {
  const basePrompt = scene.visualAnchor || scene.narration || 'professional video content';
  const profile = manifest.metadata.profile;
  
  let prompt = basePrompt;
  
  if (profile === 'anime_mode') {
    prompt += ', anime style, vibrant colors, dynamic composition, smooth animation';
  } else if (profile === 'educational_explainer') {
    prompt += ', educational explainer style, clear and professional, smooth transitions';
  } else if (profile === 'corporate_presentation') {
    prompt += ', corporate presentation style, business professional, clean transitions';
  }
  
  // Add motion keywords based on scene purpose
  if (scene.purpose === 'hook') {
    prompt += ', attention-grabbing motion, dynamic opening';
  } else if (scene.purpose === 'cta') {
    prompt += ', compelling motion, call-to-action style';
  }
  
  return prompt;
}

/**
 * Create final render job using Shotstack with captions
 * Supports advanced features: captions, transitions, effects
 */
function createRenderJob(manifest: ProductionManifest, allJobIds: string[]): JobPlan {
  const payload: JobPayload = {
    manifestId: 'MANIFEST_PLACEHOLDER', // Will be replaced with actual ID
    // Shotstack configuration
    provider: 'shotstack',
    environment: 'stage', // or 'production'
    // Video settings
    outputFormat: 'mp4',
    quality: 'high',
    resolution: {
      width: determineVideoWidth(manifest),
      height: determineVideoHeight(manifest)
    },
    // Caption settings
    enableCaptions: true,
    captionStyle: {
      fontFamily: 'Montserrat ExtraBold',
      fontSize: 28,
      fontColor: '#ffffff',
      backgroundColor: '#000000',
      backgroundOpacity: 0.8,
      position: 'bottom',
      padding: 10,
      borderRadius: 5
    },
    // Advanced features
    enableTransitions: true,
    transitionType: 'fade',
    enableEffects: true,
    backgroundMusic: true,
    // Callback configuration
    callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/callbacks/shotstack`,
    webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/shotstack`,
    // Cost optimization
    costLimit: 0.50, // $0.50 per minute
    maxDuration: manifest.metadata.durationSeconds
  };

  return {
    id: 'job_render_shotstack',
    type: 'render_shotstack',
    payload,
    priority: 1, // Highest priority - final step
    dependsOn: allJobIds,
    retryPolicy: {
      maxRetries: 3,
      backoffSeconds: 120
    }
  } as JobPlan;
}

/**
 * Build asset generation prompt
 */
function buildAssetPrompt(scene: ScenePlan, visual: any, manifest: ProductionManifest): string {
  const basePrompt = scene.visualAnchor || visual.description || 'professional video content';
  const profile = manifest.metadata.profile;
  const style = manifest.consistency.tone;
  
  // Build context-aware prompt
  let prompt = basePrompt;
  
  if (profile === 'educational_explainer') {
    prompt += ', educational explainer style, clean and professional';
  } else if (profile === 'anime_mode') {
    prompt += ', anime style, vibrant colors, dynamic composition';
  } else if (profile === 'corporate_presentation') {
    prompt += ', corporate presentation style, business professional';
  }
  
  if (style === 'professional') {
    prompt += ', high quality, cinematic lighting';
  } else if (style === 'casual') {
    prompt += ', friendly and approachable';
  }
  
  // Add technical specifications
  prompt += `, ${manifest.visuals.defaultAspect} aspect ratio, high resolution`;
  
  return prompt;
}

/**
 * Optimize job execution order and dependencies
 */
function optimizeJobExecution(jobs: JobPlan[], manifest: ProductionManifest): JobPlan[] {
  // Group jobs by type for better parallelization
  const jobGroups = {
    tts: jobs.filter(job => job.type === 'tts_elevenlabs'),
    imageGen: jobs.filter(job => job.type === 'gen_image_falai'),
    musicGen: jobs.filter(job => job.type === 'gen_music_elevenlabs'),
    chartGen: jobs.filter(job => job.type === 'generate_chart_gptimage'),
    lipSync: jobs.filter(job => job.type === 'lip_sync_lypsso'),
    render: jobs.filter(job => job.type === 'render_shotstack')
  };

  // Optimize dependencies within each group
  const optimizedJobs: JobPlan[] = [];
  
  // Add TTS jobs first (highest priority, no dependencies)
  optimizedJobs.push(...jobGroups.tts);
  
  // Add image generation jobs (can run in parallel with TTS)
  optimizedJobs.push(...jobGroups.imageGen);
  
  // Add music generation jobs (can run in parallel)
  optimizedJobs.push(...jobGroups.musicGen);
  
  // Add chart generation jobs (can run in parallel)
  optimizedJobs.push(...jobGroups.chartGen);
  
  // Add lip sync jobs (depend on TTS completion)
  optimizedJobs.push(...jobGroups.lipSync);
  
  // Add render job last (depends on everything)
  optimizedJobs.push(...jobGroups.render);
  
  return optimizedJobs;
}

/**
 * Estimate total execution time for all jobs
 */
function estimateTotalExecutionTime(jobs: JobPlan[]): number {
  const jobDurations = {
    'tts_elevenlabs': 30, // 30 seconds average
    'gen_image_falai': 45, // 45 seconds average
    'gen_music_elevenlabs': 60, // 60 seconds average
    'generate_chart_gptimage': 20, // 20 seconds average
    'lip_sync_lypsso': 90, // 90 seconds average
    'render_shotstack': 120 // 120 seconds average
  };
  
  // Calculate critical path (longest dependency chain)
  const criticalPath = findCriticalPath(jobs);
  let totalTime = 0;
  
  for (const jobId of criticalPath) {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      totalTime += jobDurations[job.type] || 30;
    }
  }
  
  return totalTime;
}

/**
 * Find critical path through job dependencies
 */
function findCriticalPath(jobs: JobPlan[]): string[] {
  const jobMap = new Map(jobs.map(job => [job.id, job]));
  const visited = new Set<string>();
  const path: string[] = [];
  
  // Find jobs with no dependencies (start points)
  const startJobs = jobs.filter(job => !job.dependsOn || job.dependsOn.length === 0);
  
  // DFS to find longest path
  function dfs(jobId: string, currentPath: string[]): string[] {
    if (visited.has(jobId)) return currentPath;
    
    visited.add(jobId);
    const job = jobMap.get(jobId);
    if (!job) return currentPath;
    
    const newPath = [...currentPath, jobId];
    let longestPath = newPath;
    
    // Find jobs that depend on this one
    const dependentJobs = jobs.filter(j => j.dependsOn?.includes(jobId));
    
    for (const dependent of dependentJobs) {
      const dependentPath = dfs(dependent.id, newPath);
      if (dependentPath.length > longestPath.length) {
        longestPath = dependentPath;
      }
    }
    
    return longestPath;
  }
  
  // Start from each job with no dependencies
  for (const startJob of startJobs) {
    const pathFromStart = dfs(startJob.id, []);
    if (pathFromStart.length > path.length) {
      path.length = 0;
      path.push(...pathFromStart);
    }
  }
  
  return path;
}

/**
 * Enhance text with audio tags for ElevenLabs Dialog
 */
function enhanceTextWithAudioTags(text: string, purpose: string, tone: string): string {
  // Add audio tags based on scene purpose and tone
  const audioTags = {
    'hook': ['[excited]', '[energetic]'],
    'body': ['[confident]', '[clear]'],
    'cta': ['[persuasive]', '[urgent]'],
    'professional': ['[authoritative]', '[clear]'],
    'casual': ['[friendly]', '[warm]']
  };

  const tags = audioTags[purpose as keyof typeof audioTags] || audioTags['body'];
  const toneTags = audioTags[tone as keyof typeof audioTags] || [];

  // Simple enhancement - add tags to key sentences
  const sentences = text.split('. ');
  const enhancedSentences = sentences.map((sentence, index) => {
    if (index === 0 && tags.length > 0) {
      return `${tags[0]} ${sentence}`;
    } else if (index === sentences.length - 1 && toneTags.length > 0) {
      return `${toneTags[0]} ${sentence}`;
    }
    return sentence;
  });

  return enhancedSentences.join('. ');
}

/**
 * Determine asset generation model with full configuration
 * Based on your clear instructions for Fal.ai models
 */
function determineAssetModel(visual: any, manifest: ProductionManifest): { model: string; endpoint: string; numInferenceSteps?: number; guidanceScale?: number; cost?: number } {
  const profile = manifest.metadata.profile;
  
  const modelConfigs = {
    'anime_mode': {
      model: 'flux-srpo',
      endpoint: 'fal-ai/flux/srpo',
      numInferenceSteps: 28,
      guidanceScale: 4.5,
      cost: 0.04
    },
    'educational_explainer': {
      model: 'nano-banana',
      endpoint: 'fal-ai/gemini-25-flash-image',
      numInferenceSteps: 30,
      guidanceScale: 7.5,
      cost: 0.039
    },
    'corporate_presentation': {
      model: 'professional-photo',
      endpoint: 'fal-ai/professional-photo',
      numInferenceSteps: 25,
      guidanceScale: 6.0,
      cost: 0.04
    },
    'seedream-4': {
      model: 'seedream-4',
      endpoint: 'fal-ai/bytedance/seedream/v4/text-to-image',
      numInferenceSteps: 30,
      guidanceScale: 7.5,
      cost: 0.03
    },
    'multi-camera': {
      model: 'multi-camera',
      endpoint: 'fal-ai/multi-camera-generator',
      numInferenceSteps: 30,
      guidanceScale: 7.5,
      cost: 0.035
    },
    'default': {
      model: 'flux-srpo',
      endpoint: 'fal-ai/flux/srpo',
      numInferenceSteps: 28,
      guidanceScale: 4.5,
      cost: 0.04
    }
  };

  return modelConfigs[profile as keyof typeof modelConfigs] || modelConfigs['default'];
}

/**
 * Determine image size for Fal.ai models
 */
function determineImageSize(manifest: ProductionManifest): string {
  const aspectRatio = manifest.metadata.aspectRatio;
  
  const sizeMap = {
    '16:9': 'landscape_16_9',
    '9:16': 'portrait_9_16', 
    '1:1': 'square_hd',
    '4:3': 'portrait_4_3',
    '3:4': 'portrait_3_4'
  };

  return sizeMap[aspectRatio as keyof typeof sizeMap] || 'landscape_16_9';
}

/**
 * Determine video resolution for Shotstack
 */
function determineVideoWidth(manifest: ProductionManifest): number {
  const aspectRatio = manifest.metadata.aspectRatio;
  
  if (aspectRatio === '16:9') return 1920;
  if (aspectRatio === '9:16') return 1080;
  if (aspectRatio === '1:1') return 1080;
  if (aspectRatio === '4:3') return 1440;
  return 1920; // Default
}

function determineVideoHeight(manifest: ProductionManifest): number {
  const aspectRatio = manifest.metadata.aspectRatio;
  
  if (aspectRatio === '16:9') return 1080;
  if (aspectRatio === '9:16') return 1920;
  if (aspectRatio === '1:1') return 1080;
  if (aspectRatio === '4:3') return 1080;
  return 1080; // Default
}

/**
 * Generate music prompt for ElevenLabs Music
 */
function generateMusicPrompt(manifest: ProductionManifest): string {
  const mood = determineMusicMood(manifest);
  const genre = determineMusicGenre(manifest);
  const tempo = determineMusicTempo(manifest);
  const instruments = determineMusicInstruments(manifest);
  
  return `Create a ${mood} ${genre} track with ${instruments.join(', ')} at ${tempo} BPM. Perfect for ${manifest.metadata.platform} content with ${manifest.consistency.tone} tone. Duration: ${manifest.metadata.durationSeconds} seconds.`;
}

/**
 * Determine music mood based on manifest
 */
function determineMusicMood(manifest: ProductionManifest): string {
  const profile = manifest.metadata.profile;
  const tone = manifest.consistency.tone;
  
  if (profile === 'educational_explainer') return 'uplifting';
  if (profile === 'anime_mode') return 'energetic';
  if (tone === 'professional') return 'confident';
  if (tone === 'casual') return 'friendly';
  return 'neutral';
}

/**
 * Determine music genre based on manifest
 */
function determineMusicGenre(manifest: ProductionManifest): string {
  const profile = manifest.metadata.profile;
  
  if (profile === 'educational_explainer') return 'ambient electronic';
  if (profile === 'anime_mode') return 'electronic pop';
  if (profile === 'corporate_presentation') return 'corporate instrumental';
  return 'ambient';
}

/**
 * Determine music tempo based on manifest
 */
function determineMusicTempo(manifest: ProductionManifest): number {
  const profile = manifest.metadata.profile;
  
  if (profile === 'anime_mode') return 130;
  if (profile === 'educational_explainer') return 100;
  if (profile === 'corporate_presentation') return 120;
  return 110;
}

/**
 * Determine music instruments based on manifest
 */
function determineMusicInstruments(manifest: ProductionManifest): string[] {
  const profile = manifest.metadata.profile;
  
  if (profile === 'educational_explainer') return ['soft synthesizers', 'gentle percussion', 'warm pads'];
  if (profile === 'anime_mode') return ['electronic synthesizers', 'drums', 'bass'];
  if (profile === 'corporate_presentation') return ['piano', 'strings', 'subtle percussion'];
  return ['ambient synthesizers', 'soft percussion'];
}

/**
 * Generate sample data for charts
 */
function generateSampleData(scene: ScenePlan): any[] {
  // Generate sample data based on scene context
  if (scene.visualAnchor && scene.visualAnchor.toLowerCase().includes('revenue')) {
    return [
      { label: 'Q1', value: 10 },
      { label: 'Q2', value: 12 },
      { label: 'Q3', value: 14 },
      { label: 'Q4', value: 16 }
    ];
  } else if (scene.visualAnchor && scene.visualAnchor.toLowerCase().includes('growth')) {
    return [
      { label: '2021', value: 100 },
      { label: '2022', value: 120 },
      { label: '2023', value: 145 },
      { label: '2024', value: 170 }
    ];
  } else {
    // Generic sample data
    return [
      { label: 'A', value: 25 },
      { label: 'B', value: 35 },
      { label: 'C', value: 30 },
      { label: 'D', value: 10 }
    ];
  }
}

