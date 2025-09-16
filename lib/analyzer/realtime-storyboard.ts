/**
 * DreamCut Realtime Storyboard Implementation
 * 
 * Creates the "human director giving feedback" experience with progressive
 * asset analysis updates streaming to the frontend via Supabase Realtime.
 * 
 * Storyboard Flow:
 * 1. User submits → Initial status
 * 2. Parallel asset analysis → Progressive updates  
 * 3. Global merge → Final creative brief
 * 4. Frontend streams → Chat-like director feedback
 */

import { createClient } from '@/lib/supabase/client';

// Database schemas for realtime flow
export interface DreamCutQuery {
  id: string;
  user_id: string;
  status: 'processing' | 'completed' | 'failed';
  stage: 'init' | 'analyzing' | 'merging' | 'complete';
  progress: number; // 0-100
  user_prompt: string;
  intent: string;
  assets_count: number;
  messages: DreamCutMessage[];
  payload?: any; // Final analysis JSON
  created_at: string;
  updated_at: string;
}

export interface DreamCutMessage {
  id: string;
  timestamp: string;
  type: 'status' | 'asset_start' | 'asset_progress' | 'asset_complete' | 'merge' | 'final' | 'conflict' | 'suggestion';
  content: string;
  data?: any; // Additional structured data
  emoji?: string;
}

export interface AssetProgress {
  asset_id: string;
  asset_type: 'image' | 'video' | 'audio';
  filename: string;
  stage: 'pending' | 'analyzing' | 'complete' | 'failed';
  progress: number; // 0-100
  analysis?: {
    caption?: string;
    style?: string;
    mood?: string;
    duration_seconds?: number;
    motion?: string;
    scenes?: string[];
    transcript?: string;
    tone?: string;
    recommended_edits?: string[];
    quality_score?: number;
  };
  worker_id?: string;
  processing_time_ms?: number;
}

/**
 * Realtime Director - Orchestrates the storyboard flow
 */
export class RealtimeDirector {
  private queryId: string;
  private userId: string;
  private supabase: ReturnType<typeof createClient>;
  private messages: DreamCutMessage[] = [];

  constructor(queryId: string, userId: string) {
    this.queryId = queryId;
    this.userId = userId;
    this.supabase = createClient();
  }

  /**
   * 1. User Submits Query - Initialize the flow
   */
  async initializeQuery(
    userPrompt: string,
    intent: string,
    assetsCount: number
  ): Promise<void> {
    const initialQuery: Partial<DreamCutQuery> = {
      id: this.queryId,
      user_id: this.userId,
      status: 'processing',
      stage: 'init',
      progress: 0,
      user_prompt: userPrompt,
      intent,
      assets_count: assetsCount,
      messages: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Write initial row to database
    await this.supabase
      .from('dreamcut_queries')
      .insert(initialQuery);

    // Send initial director message
    await this.addMessage({
      type: 'status',
      content: `Got your request. Let's break it down...`,
      emoji: '🎬'
    });

    console.log(`[RealtimeDirector] Query ${this.queryId} initialized`);
  }

  /**
   * 2a. Start Image Analysis
   */
  async startImageAnalysis(assetId: string, filename: string): Promise<void> {
    await this.addMessage({
      type: 'asset_start',
      content: `Analyzing image: ${filename}`,
      data: { asset_id: assetId, asset_type: 'image', filename },
      emoji: '🖼️'
    });

    await this.updateProgress(15, 'analyzing');
  }

  /**
   * Update image analysis progress
   */
  async updateImageAnalysis(
    assetId: string,
    partialAnalysis: AssetProgress['analysis'],
    progress: number
  ): Promise<void> {
    const assetProgress: AssetProgress = {
      asset_id: assetId,
      asset_type: 'image',
      filename: '',
      stage: 'analyzing',
      progress,
      analysis: partialAnalysis
    };

    // Broadcast partial analysis via Realtime
    await this.supabase
      .channel(`dreamcut_queries:${this.queryId}`)
      .send({
        type: 'broadcast',
        event: 'asset_progress',
        payload: assetProgress
      });

    if (progress >= 100) {
      const styleDesc = partialAnalysis?.style || 'analyzed';
      const moodDesc = partialAnalysis?.mood || 'detected';
      
      await this.addMessage({
        type: 'asset_complete',
        content: `→ ✅ ${styleDesc} style, ${moodDesc} mood`,
        data: assetProgress,
        emoji: '✅'
      });
    }
  }

  /**
   * 2b. Start Video Analysis
   */
  async startVideoAnalysis(assetId: string, filename: string): Promise<void> {
    await this.addMessage({
      type: 'asset_start',
      content: `Analyzing video: ${filename}`,
      data: { asset_id: assetId, asset_type: 'video', filename },
      emoji: '🎥'
    });

    await this.updateProgress(35, 'analyzing');
  }

  /**
   * Update video analysis progress
   */
  async updateVideoAnalysis(
    assetId: string,
    partialAnalysis: AssetProgress['analysis'],
    progress: number
  ): Promise<void> {
    const assetProgress: AssetProgress = {
      asset_id: assetId,
      asset_type: 'video',
      filename: '',
      stage: 'analyzing',
      progress,
      analysis: partialAnalysis
    };

    await this.supabase
      .channel(`dreamcut_queries:${this.queryId}`)
      .send({
        type: 'broadcast',
        event: 'asset_progress',
        payload: assetProgress
      });

    if (progress >= 100) {
      const duration = partialAnalysis?.duration_seconds || 0;
      const needsTrimming = duration > 30 ? ', needs trimming' : '';
      
      await this.addMessage({
        type: 'asset_complete',
        content: `→ ✅ footage, ${duration}s${needsTrimming}`,
        data: assetProgress,
        emoji: '✅'
      });

      // Check for conflicts
      if (duration > 30) {
        await this.addMessage({
          type: 'conflict',
          content: `⚠️ Video is ${duration}s but you want 30s - I'll trim it`,
          data: { conflict_type: 'duration_mismatch', resolution: 'trim_video' },
          emoji: '⚠️'
        });
      }
    }
  }

  /**
   * 2c. Start Audio Analysis
   */
  async startAudioAnalysis(assetId: string, filename: string): Promise<void> {
    await this.addMessage({
      type: 'asset_start',
      content: `Analyzing audio: ${filename}`,
      data: { asset_id: assetId, asset_type: 'audio', filename },
      emoji: '🎵'
    });

    await this.updateProgress(55, 'analyzing');
  }

  /**
   * Update audio analysis progress
   */
  async updateAudioAnalysis(
    assetId: string,
    partialAnalysis: AssetProgress['analysis'],
    progress: number
  ): Promise<void> {
    const assetProgress: AssetProgress = {
      asset_id: assetId,
      asset_type: 'audio',
      filename: '',
      stage: 'analyzing',
      progress,
      analysis: partialAnalysis
    };

    await this.supabase
      .channel(`dreamcut_queries:${this.queryId}`)
      .send({
        type: 'broadcast',
        event: 'asset_progress',
        payload: assetProgress
      });

    if (progress >= 100) {
      const tone = partialAnalysis?.tone || 'narration';
      
      await this.addMessage({
        type: 'asset_complete',
        content: `→ ✅ ${tone} narration detected`,
        data: assetProgress,
        emoji: '✅'
      });
    }
  }

  /**
   * 3. Global Merge - Combine everything
   */
  async startGlobalMerge(): Promise<void> {
    await this.addMessage({
      type: 'merge',
      content: 'Combining query + assets into creative brief...',
      emoji: '🎭'
    });

    await this.updateProgress(80, 'merging');
  }

  /**
   * Final creative brief ready
   */
  async completeAnalysis(
    finalPayload: any,
    creativeSuggestions: string[],
    conflicts: Array<{type: string, resolution: string}>
  ): Promise<void> {
    // Update database with final payload
    await this.supabase
      .from('dreamcut_queries')
      .update({
        status: 'completed',
        stage: 'complete',
        progress: 100,
        payload: finalPayload,
        updated_at: new Date().toISOString()
      })
      .eq('id', this.queryId);

    // Generate summary message
    const intent = finalPayload.final_analysis?.query_summary?.parsed_intent?.primary_output_type || 'content';
    const duration = finalPayload.final_analysis?.query_summary?.extracted_constraints?.technical_requirements?.duration_seconds || 30;
    const assetsCount = finalPayload.final_analysis?.assets_analysis?.total_assets_processed || 0;

    await this.addMessage({
      type: 'final',
      content: `Creative brief ready 🎬`,
      emoji: '🎬'
    });

    // Add summary details
    const assetTypes = this.getAssetTypeSummary(finalPayload);
    await this.addMessage({
      type: 'final',
      content: `- Intent: cinematic ${duration}s ${intent}`,
      emoji: '🎯'
    });

    await this.addMessage({
      type: 'final',
      content: `- Assets: ${assetTypes}`,
      emoji: '📁'
    });

    // Add conflicts if any
    for (const conflict of conflicts) {
      await this.addMessage({
        type: 'conflict',
        content: `- Conflicts: ${conflict.resolution}`,
        emoji: '⚠️'
      });
    }

    // Add creative suggestions
    if (creativeSuggestions.length > 0) {
      const suggestionsText = creativeSuggestions.slice(0, 2).join(', ');
      await this.addMessage({
        type: 'suggestion',
        content: `- Suggested directions: ${suggestionsText}`,
        emoji: '💡'
      });
    }

    await this.addMessage({
      type: 'final',
      content: 'Ready for production! 🚀',
      emoji: '🚀'
    });

    console.log(`[RealtimeDirector] Query ${this.queryId} completed`);
  }

  /**
   * Handle analysis failure
   */
  async handleFailure(error: string, stage: string): Promise<void> {
    await this.supabase
      .from('dreamcut_queries')
      .update({
        status: 'failed',
        stage: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('id', this.queryId);

    await this.addMessage({
      type: 'status',
      content: `Analysis failed at ${stage}: ${error}`,
      emoji: '❌'
    });
  }

  /**
   * Private helper: Add message and broadcast
   */
  private async addMessage(messageData: {
    type: DreamCutMessage['type'];
    content: string;
    data?: any;
    emoji?: string;
  }): Promise<void> {
    const message: DreamCutMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      timestamp: new Date().toISOString(),
      type: messageData.type,
      content: messageData.content,
      data: messageData.data,
      emoji: messageData.emoji
    };

    this.messages.push(message);

    // Update database
    await this.supabase
      .from('dreamcut_queries')
      .update({
        messages: this.messages,
        updated_at: new Date().toISOString()
      })
      .eq('id', this.queryId);

    // Broadcast via Realtime
    await this.supabase
      .channel(`dreamcut_queries:${this.queryId}`)
      .send({
        type: 'broadcast',
        event: 'new_message',
        payload: message
      });

    console.log(`[RealtimeDirector] Message: ${messageData.emoji} ${messageData.content}`);
  }

  /**
   * Private helper: Update progress
   */
  private async updateProgress(progress: number, stage: DreamCutQuery['stage']): Promise<void> {
    await this.supabase
      .from('dreamcut_queries')
      .update({
        progress,
        stage,
        updated_at: new Date().toISOString()
      })
      .eq('id', this.queryId);

    // Broadcast progress update
    await this.supabase
      .channel(`dreamcut_queries:${this.queryId}`)
      .send({
        type: 'broadcast',
        event: 'progress_update',
        payload: { progress, stage }
      });
  }

  /**
   * Private helper: Generate asset type summary
   */
  private getAssetTypeSummary(payload: any): string {
    const assets = payload.final_analysis?.assets_analysis?.individual_assets || [];
    const counts = assets.reduce((acc: any, asset: any) => {
      const role = asset.alignment_with_query?.role_in_project || 'content';
      const type = asset.asset_type;
      acc[type] = acc[type] || [];
      acc[type].push(role);
      return acc;
    }, {});

    const summaries = [];
    if (counts.image) summaries.push(`${counts.image.length} image (${counts.image[0]})`);
    if (counts.video) summaries.push(`${counts.video.length} video (${counts.video[0]})`);
    if (counts.audio) summaries.push(`${counts.audio.length} audio (${counts.audio[0]})`);

    return summaries.join(', ');
  }
}

/**
 * Frontend subscription helper
 */
export function subscribeToQueryUpdates(
  queryId: string,
  callbacks: {
    onMessage?: (message: DreamCutMessage) => void;
    onProgress?: (data: { progress: number; stage: string }) => void;
    onAssetProgress?: (asset: AssetProgress) => void;
    onComplete?: (payload: any) => void;
  }
): () => void {
  const supabase = createClient();
  
  const channel = supabase
    .channel(`dreamcut_queries:${queryId}`)
    .on('broadcast', { event: 'new_message' }, ({ payload }) => {
      callbacks.onMessage?.(payload as DreamCutMessage);
    })
    .on('broadcast', { event: 'progress_update' }, ({ payload }) => {
      callbacks.onProgress?.(payload as { progress: number; stage: string });
    })
    .on('broadcast', { event: 'asset_progress' }, ({ payload }) => {
      callbacks.onAssetProgress?.(payload as AssetProgress);
    })
    .subscribe();

  // Also subscribe to database changes for final completion
  const dbSubscription = supabase
    .channel('dreamcut_queries_changes')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'dreamcut_queries',
      filter: `id=eq.${queryId}`
    }, (payload) => {
      if (payload.new.status === 'completed') {
        callbacks.onComplete?.(payload.new.payload);
      }
    })
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
    supabase.removeChannel(dbSubscription);
  };
}

/**
 * SQL for creating the realtime tables:
 * 
 * CREATE TABLE dreamcut_queries (
 *   id TEXT PRIMARY KEY,
 *   user_id TEXT NOT NULL,
 *   status TEXT NOT NULL CHECK (status IN ('processing', 'completed', 'failed')),
 *   stage TEXT NOT NULL CHECK (stage IN ('init', 'analyzing', 'merging', 'complete')),
 *   progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
 *   user_prompt TEXT NOT NULL,
 *   intent TEXT NOT NULL,
 *   assets_count INTEGER NOT NULL DEFAULT 0,
 *   messages JSONB NOT NULL DEFAULT '[]',
 *   payload JSONB,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- Enable RLS
 * ALTER TABLE dreamcut_queries ENABLE ROW LEVEL SECURITY;
 * 
 * -- Policy: Users can only see their own queries
 * CREATE POLICY "Users can manage own queries" ON dreamcut_queries
 *   FOR ALL USING (auth.uid()::text = user_id);
 * 
 * -- Enable Realtime
 * ALTER PUBLICATION supabase_realtime ADD TABLE dreamcut_queries;
 */
