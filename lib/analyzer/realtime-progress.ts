/**
 * Supabase Realtime Progress Broadcasting
 * 
 * "On-Set Playback Monitors" - Shows live analysis progress
 * Only activated after the core JSON schema is rock-solid
 */

import { createClient } from '@/lib/supabase/client';

export interface AnalysisProgress {
  analysis_id: string;
  user_id: string;
  overall_progress: number; // 0-100
  current_step: 'query' | 'assets' | 'synthesis' | 'finalization';
  step_progress: number; // 0-100
  status: 'processing' | 'completed' | 'failed';
  message: string;
  estimated_completion_ms?: number;
  
  // Detailed progress per component
  components: {
    query_analysis?: {
      status: 'pending' | 'processing' | 'completed' | 'failed';
      progress: number;
      model_used?: string;
      confidence?: number;
    };
    asset_analyses?: Array<{
      asset_id: string;
      asset_type: 'image' | 'video' | 'audio';
      status: 'pending' | 'processing' | 'completed' | 'failed';
      progress: number;
      model_used?: string;
      quality_score?: number;
    }>;
    synthesis?: {
      status: 'pending' | 'processing' | 'completed' | 'failed';
      progress: number;
      creative_options_generated?: number;
      contradictions_resolved?: number;
    };
    pipeline_generation?: {
      status: 'pending' | 'processing' | 'completed' | 'failed';
      progress: number;
      workflow_steps_defined?: number;
    };
  };
}

/**
 * Broadcast analysis progress to subscribed clients
 */
export async function broadcastProgress(
  progress: AnalysisProgress
): Promise<void> {
  const supabase = createClient();
  
  try {
    // Update progress in database
    await supabase
      .from('analysis_progress')
      .upsert({
        analysis_id: progress.analysis_id,
        user_id: progress.user_id,
        progress_data: progress,
        updated_at: new Date().toISOString()
      });

    // Broadcast via Realtime
    await supabase
      .channel(`analysis:${progress.analysis_id}`)
      .send({
        type: 'broadcast',
        event: 'progress_update',
        payload: progress
      });

    console.log(`[RealtimeProgress] Broadcasted progress for ${progress.analysis_id}: ${progress.overall_progress}%`);
    
  } catch (error) {
    console.error('[RealtimeProgress] Failed to broadcast:', error);
    // Don't throw - progress broadcasting is non-critical
  }
}

/**
 * Subscribe to analysis progress updates
 */
export function subscribeToProgress(
  analysisId: string,
  onProgress: (progress: AnalysisProgress) => void
): () => void {
  const supabase = createClient();
  
  const channel = supabase
    .channel(`analysis:${analysisId}`)
    .on('broadcast', { event: 'progress_update' }, ({ payload }) => {
      onProgress(payload as AnalysisProgress);
    })
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Progress tracking helper for the unified analyzer
 */
export class AnalysisProgressTracker {
  private analysisId: string;
  private userId: string;
  private startTime: number;
  private currentProgress: AnalysisProgress;

  constructor(analysisId: string, userId: string) {
    this.analysisId = analysisId;
    this.userId = userId;
    this.startTime = Date.now();
    
    this.currentProgress = {
      analysis_id: analysisId,
      user_id: userId,
      overall_progress: 0,
      current_step: 'query',
      step_progress: 0,
      status: 'processing',
      message: 'Starting analysis...',
      components: {}
    };
  }

  async startQueryAnalysis(model: string): Promise<void> {
    this.currentProgress.current_step = 'query';
    this.currentProgress.overall_progress = 5;
    this.currentProgress.message = `Analyzing user query with ${model}...`;
    this.currentProgress.components.query_analysis = {
      status: 'processing',
      progress: 10,
      model_used: model
    };
    
    await broadcastProgress(this.currentProgress);
  }

  async completeQueryAnalysis(confidence: number): Promise<void> {
    this.currentProgress.overall_progress = 20;
    this.currentProgress.message = `Query analysis completed (${Math.round(confidence * 100)}% confidence)`;
    this.currentProgress.components.query_analysis = {
      status: 'completed',
      progress: 100,
      model_used: this.currentProgress.components.query_analysis?.model_used,
      confidence
    };
    
    await broadcastProgress(this.currentProgress);
  }

  async startAssetAnalysis(assets: Array<{id: string, type: 'image'|'video'|'audio'}>): Promise<void> {
    this.currentProgress.current_step = 'assets';
    this.currentProgress.overall_progress = 25;
    this.currentProgress.message = `Analyzing ${assets.length} assets in parallel...`;
    
    this.currentProgress.components.asset_analyses = assets.map(asset => ({
      asset_id: asset.id,
      asset_type: asset.type,
      status: 'pending' as const,
      progress: 0
    }));
    
    await broadcastProgress(this.currentProgress);
  }

  async updateAssetProgress(assetId: string, progress: number, model?: string): Promise<void> {
    if (this.currentProgress.components.asset_analyses) {
      const assetAnalysis = this.currentProgress.components.asset_analyses.find(a => a.asset_id === assetId);
      if (assetAnalysis) {
        assetAnalysis.status = 'processing';
        assetAnalysis.progress = progress;
        if (model) assetAnalysis.model_used = model;
      }
    }
    
    // Calculate overall asset progress
    const avgAssetProgress = this.currentProgress.components.asset_analyses
      ? this.currentProgress.components.asset_analyses.reduce((sum, a) => sum + a.progress, 0) / this.currentProgress.components.asset_analyses.length
      : 0;
    
    this.currentProgress.overall_progress = 25 + (avgAssetProgress * 0.35); // 25-60%
    this.currentProgress.message = `Analyzing assets... ${Math.round(avgAssetProgress)}% complete`;
    
    await broadcastProgress(this.currentProgress);
  }

  async completeAssetAnalysis(assetId: string, qualityScore: number): Promise<void> {
    if (this.currentProgress.components.asset_analyses) {
      const assetAnalysis = this.currentProgress.components.asset_analyses.find(a => a.asset_id === assetId);
      if (assetAnalysis) {
        assetAnalysis.status = 'completed';
        assetAnalysis.progress = 100;
        assetAnalysis.quality_score = qualityScore;
      }
    }
    
    // Check if all assets are complete
    const allComplete = this.currentProgress.components.asset_analyses?.every(a => a.status === 'completed');
    if (allComplete) {
      this.currentProgress.overall_progress = 60;
      this.currentProgress.message = 'All assets analyzed successfully';
    }
    
    await broadcastProgress(this.currentProgress);
  }

  async startSynthesis(): Promise<void> {
    this.currentProgress.current_step = 'synthesis';
    this.currentProgress.overall_progress = 65;
    this.currentProgress.message = 'Combining assets with user query...';
    this.currentProgress.components.synthesis = {
      status: 'processing',
      progress: 10
    };
    
    await broadcastProgress(this.currentProgress);
  }

  async updateSynthesis(creativeOptions: number, contradictions: number): Promise<void> {
    this.currentProgress.overall_progress = 80;
    this.currentProgress.message = `Generated ${creativeOptions} creative options, resolved ${contradictions} contradictions`;
    this.currentProgress.components.synthesis = {
      status: 'processing',
      progress: 70,
      creative_options_generated: creativeOptions,
      contradictions_resolved: contradictions
    };
    
    await broadcastProgress(this.currentProgress);
  }

  async startPipelineGeneration(): Promise<void> {
    this.currentProgress.current_step = 'finalization';
    this.currentProgress.overall_progress = 85;
    this.currentProgress.message = 'Generating production pipeline...';
    this.currentProgress.components.pipeline_generation = {
      status: 'processing',
      progress: 20
    };
    
    await broadcastProgress(this.currentProgress);
  }

  async complete(workflowSteps: number): Promise<void> {
    const totalTime = Date.now() - this.startTime;
    
    this.currentProgress.overall_progress = 100;
    this.currentProgress.status = 'completed';
    this.currentProgress.message = `Analysis complete! Generated ${workflowSteps}-step production pipeline in ${(totalTime / 1000).toFixed(1)}s`;
    
    if (this.currentProgress.components.synthesis) {
      this.currentProgress.components.synthesis.status = 'completed';
      this.currentProgress.components.synthesis.progress = 100;
    }
    
    if (this.currentProgress.components.pipeline_generation) {
      this.currentProgress.components.pipeline_generation.status = 'completed';
      this.currentProgress.components.pipeline_generation.progress = 100;
      this.currentProgress.components.pipeline_generation.workflow_steps_defined = workflowSteps;
    }
    
    await broadcastProgress(this.currentProgress);
  }

  async fail(error: string, step?: string): Promise<void> {
    this.currentProgress.status = 'failed';
    this.currentProgress.message = `Analysis failed: ${error}`;
    
    // Mark current component as failed
    switch (this.currentProgress.current_step) {
      case 'query':
        if (this.currentProgress.components.query_analysis) {
          this.currentProgress.components.query_analysis.status = 'failed';
        }
        break;
      case 'assets':
        // Mark pending/processing assets as failed
        this.currentProgress.components.asset_analyses?.forEach(asset => {
          if (asset.status !== 'completed') {
            asset.status = 'failed';
          }
        });
        break;
      case 'synthesis':
        if (this.currentProgress.components.synthesis) {
          this.currentProgress.components.synthesis.status = 'failed';
        }
        break;
      case 'finalization':
        if (this.currentProgress.components.pipeline_generation) {
          this.currentProgress.components.pipeline_generation.status = 'failed';
        }
        break;
    }
    
    await broadcastProgress(this.currentProgress);
  }
}

/**
 * SQL for creating the progress tracking table:
 * 
 * CREATE TABLE analysis_progress (
 *   analysis_id TEXT PRIMARY KEY,
 *   user_id TEXT NOT NULL,
 *   progress_data JSONB NOT NULL,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- Enable RLS
 * ALTER TABLE analysis_progress ENABLE ROW LEVEL SECURITY;
 * 
 * -- Policy: Users can only see their own progress
 * CREATE POLICY "Users can view own analysis progress" ON analysis_progress
 *   FOR SELECT USING (auth.uid()::text = user_id);
 * 
 * CREATE POLICY "Users can update own analysis progress" ON analysis_progress
 *   FOR ALL USING (auth.uid()::text = user_id);
 */
