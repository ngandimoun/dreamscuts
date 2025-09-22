// services/phase4/decomposeJobs.ts
// Phase 4: Job Decomposition - Convert manifest to deterministic job list

import { ProductionManifest, Job, ScenePlan } from '../../types/production-manifest';

export interface JobPayload {
  [key: string]: any;
}

/**
 * Decompose Production Manifest into deterministic job list
 * This is the bridge to Phase 5 worker execution
 */
export function decomposeJobs(manifest: ProductionManifest): Job[] {
  console.log('[Phase4Jobs] Starting job decomposition...');
  
  const jobs: Job[] = [];
  const jobIds: string[] = [];

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

  // Final render job (depends on all others)
  const renderJob = createRenderJob(manifest, jobIds);
  jobs.push(renderJob);

  console.log(`[Phase4Jobs] Created ${jobs.length} jobs total`);
  return jobs;
}

/**
 * Create TTS job for scene narration
 */
function createTTSJob(scene: ScenePlan, manifest: ProductionManifest): Job {
  const payload: JobPayload = {
    sceneId: scene.id,
    text: scene.narration,
    provider: manifest.audio.ttsDefaults.provider,
    voiceId: manifest.audio.ttsDefaults.voiceId,
    format: manifest.audio.ttsDefaults.format,
    sampleRate: 22050,
    stability: manifest.audio.ttsDefaults.stability || 0.7
  };

  return {
    id: `job_tts_${scene.id}`,
    type: 'tts',
    payload,
    priority: 10,
    dependsOn: [],
    retryPolicy: {
      maxRetries: 3,
      backoffSeconds: 30
    }
  };
}

/**
 * Create asset generation job
 */
function createAssetGenerationJob(
  scene: ScenePlan, 
  visual: any, 
  asset: any, 
  manifest: ProductionManifest
): Job {
  const prompt = buildAssetPrompt(scene, visual, manifest);
  const model = determineAssetModel(visual, manifest);
  
  const payload: JobPayload = {
    sceneId: scene.id,
    prompt,
    model,
    resultAssetId: visual.assetId,
    resolution: determineResolution(manifest),
    quality: 'high'
  };

  return {
    id: `job_gen_${visual.assetId}`,
    type: 'generate_image',
    payload,
    priority: 10,
    dependsOn: [],
    retryPolicy: {
      maxRetries: 2,
      backoffSeconds: 60
    }
  };
}

/**
 * Create chart generation job
 */
function createChartGenerationJob(scene: ScenePlan, manifest: ProductionManifest): Job {
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
    type: 'generate_chart',
    payload,
    priority: 10,
    dependsOn: [],
    retryPolicy: {
      maxRetries: 2,
      backoffSeconds: 60
    }
  };
}

/**
 * Create lip sync job
 */
function createLipSyncJob(scene: ScenePlan, manifest: ProductionManifest): Job {
  const ttsJobId = `job_tts_${scene.id}`;
  
  const payload: JobPayload = {
    sceneId: scene.id,
    audioJobId: ttsJobId,
    provider: 'lypsso',
    quality: 'high'
  };

  return {
    id: `job_lipsync_${scene.id}`,
    type: 'lip_sync',
    payload,
    priority: 8,
    dependsOn: [ttsJobId],
    retryPolicy: {
      maxRetries: 2,
      backoffSeconds: 90
    }
  };
}

/**
 * Create music generation jobs
 */
function createMusicGenerationJobs(manifest: ProductionManifest): Job[] {
  const jobs: Job[] = [];
  
  // Create a single music track for the entire video
  const musicId = 'music_01';
  const payload: JobPayload = {
    cueId: musicId,
    mood: determineMusicMood(manifest),
    structure: 'intro->build->outro',
    durationSec: manifest.metadata.durationSeconds,
    provider: 'elevenlabs-music',
    instructions: 'soft instrumental, no heavy percussion, educational tone'
  };

  jobs.push({
    id: `job_music_${musicId}`,
    type: 'generate_music',
    payload,
    priority: 5,
    dependsOn: [],
    retryPolicy: {
      maxRetries: 2,
      backoffSeconds: 60
    }
  });

  return jobs;
}

/**
 * Create final render job
 */
function createRenderJob(manifest: ProductionManifest, allJobIds: string[]): Job {
  const payload: JobPayload = {
    manifestId: 'MANIFEST_PLACEHOLDER', // Will be replaced with actual ID
    shotstackJson: {}, // Will be built by render worker
    callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/callbacks/shotstack`
  };

  return {
    id: 'job_render_shotstack',
    type: 'render_shotstack',
    payload,
    priority: 12,
    dependsOn: allJobIds,
    retryPolicy: {
      maxRetries: 3,
      backoffSeconds: 120
    }
  };
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
 * Determine asset generation model
 */
function determineAssetModel(visual: any, manifest: ProductionManifest): string {
  const profile = manifest.metadata.profile;
  
  if (profile === 'anime_mode') {
    return 'falai-anime-v1';
  } else if (profile === 'educational_explainer') {
    return 'falai-image-v1';
  } else {
    return 'falai-image-v1'; // Default
  }
}

/**
 * Determine resolution based on aspect ratio
 */
function determineResolution(manifest: ProductionManifest): string {
  const aspectRatio = manifest.metadata.aspectRatio;
  
  if (aspectRatio === '16:9') {
    return '1920x1080';
  } else if (aspectRatio === '9:16') {
    return '1080x1920';
  } else if (aspectRatio === '1:1') {
    return '1080x1080';
  } else {
    return '1920x1080'; // Default
  }
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

/**
 * Determine music mood based on manifest
 */
function determineMusicMood(manifest: ProductionManifest): string {
  const profile = manifest.metadata.profile;
  const tone = manifest.consistency.tone;
  
  if (profile === 'educational_explainer') {
    return 'neutral_learning';
  } else if (profile === 'anime_mode') {
    return 'energetic_upbeat';
  } else if (tone === 'professional') {
    return 'corporate_inspiring';
  } else if (tone === 'casual') {
    return 'friendly_uplifting';
  } else {
    return 'neutral_learning'; // Default
  }
}
