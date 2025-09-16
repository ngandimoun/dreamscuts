/**
 * DreamCut Supabase Realtime Implementation
 * 
 * Implements the complete director's feedback experience using the
 * exact schema design with realtime channels for live progress streaming.
 */

import { createClient } from '@supabase/supabase-js';

// Database types matching the schema
export interface DreamCutQuery {
  id: string;
  user_id: string;
  user_prompt: string;
  intent: 'image' | 'video' | 'audio' | 'mixed';
  options: Record<string, any>;
  
  // Progress tracking
  status: 'processing' | 'completed' | 'failed';
  stage: 'init' | 'analyzing' | 'merging' | 'done';
  progress: number; // 0-100
  
  // Results
  payload?: Record<string, any>; // final analyzer JSON
  error_message?: string;
  
  // Performance metrics
  processing_time_ms?: number;
  models_used?: string[];
  cost_estimate?: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface DreamCutAsset {
  id: string;
  query_id: string;
  
  // Asset details
  url: string;
  filename?: string;
  type: 'image' | 'video' | 'audio';
  user_description?: string;
  file_size_bytes?: number;
  metadata: Record<string, any>;
  
  // Analysis progress
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  progress: number; // 0-100
  analysis: Record<string, any>; // partial analysis JSON
  
  // Processing details
  worker_id?: string;
  model_used?: string;
  processing_time_ms?: number;
  error_message?: string;
  
  // Quality metrics
  quality_score?: number;
  confidence_score?: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  analyzed_at?: string;
}

export interface DreamCutMessage {
  id: string;
  query_id: string;
  
  // Message details
  type: 'status' | 'asset_start' | 'asset_progress' | 'asset_complete' | 'merge' | 'final' | 'conflict' | 'suggestion' | 'error';
  content: string;
  emoji?: string;
  
  // Associated data
  asset_id?: string;
  data: Record<string, any>;
  
  // Timestamps
  created_at: string;
}

/**
 * DreamCut Realtime Manager
 * 
 * Handles all database operations and realtime subscriptions
 * for the director's feedback experience.
 */
export class DreamCutRealtimeManager {
  private supabase: ReturnType<typeof createClient>;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Initialize a new query with assets
   */
  async initializeQuery(
    userId: string,
    userPrompt: string,
    intent: 'image' | 'video' | 'audio' | 'mixed',
    assets: Array<{
      url: string;
      filename?: string;
      type: 'image' | 'video' | 'audio';
      description?: string;
      metadata?: Record<string, any>;
    }>,
    options: Record<string, any> = {}
  ): Promise<{ success: boolean; queryId?: string; error?: string }> {
    try {
      const { data, error } = await this.supabase.rpc('initialize_dreamcut_query', {
        p_user_id: userId,
        p_user_prompt: userPrompt,
        p_intent: intent,
        p_options: options,
        p_assets: assets
      });

      if (error) throw error;

      console.log(`[DreamCutRealtime] Query initialized: ${data}`);
      return { success: true, queryId: data };

    } catch (error) {
      console.error('[DreamCutRealtime] Failed to initialize query:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Update asset analysis progress
   */
  async updateAssetProgress(
    assetId: string,
    progress: number,
    options: {
      status?: 'analyzing' | 'completed' | 'failed';
      analysis?: Record<string, any>;
      modelUsed?: string;
      message?: string;
      messageType?: DreamCutMessage['type'];
      emoji?: string;
    } = {}
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.rpc('update_asset_progress', {
        p_asset_id: assetId,
        p_progress: progress,
        p_status: options.status,
        p_analysis: options.analysis,
        p_model_used: options.modelUsed,
        p_message: options.message,
        p_message_type: options.messageType || 'asset_progress',
        p_emoji: options.emoji
      });

      if (error) throw error;

      console.log(`[DreamCutRealtime] Asset ${assetId} progress: ${progress}%`);
      return { success: true };

    } catch (error) {
      console.error('[DreamCutRealtime] Failed to update asset progress:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Complete query with final analysis payload
   */
  async completeQuery(
    queryId: string,
    payload: Record<string, any>,
    options: {
      processingTimeMs?: number;
      modelsUsed?: string[];
      costEstimate?: number;
    } = {}
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.rpc('complete_dreamcut_query', {
        p_query_id: queryId,
        p_payload: payload,
        p_processing_time_ms: options.processingTimeMs,
        p_models_used: options.modelsUsed,
        p_cost_estimate: options.costEstimate
      });

      if (error) throw error;

      console.log(`[DreamCutRealtime] Query ${queryId} completed`);
      return { success: true };

    } catch (error) {
      console.error('[DreamCutRealtime] Failed to complete query:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Add a director message
   */
  async addMessage(
    queryId: string,
    type: DreamCutMessage['type'],
    content: string,
    options: {
      emoji?: string;
      assetId?: string;
      data?: Record<string, any>;
    } = {}
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('dreamcut_messages')
        .insert({
          query_id: queryId,
          type,
          content,
          emoji: options.emoji,
          asset_id: options.assetId,
          data: options.data || {}
        });

      if (error) throw error;

      console.log(`[DreamCutRealtime] Message added: ${options.emoji} ${content}`);
      return { success: true };

    } catch (error) {
      console.error('[DreamCutRealtime] Failed to add message:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get query with assets
   */
  async getQuery(queryId: string): Promise<{
    success: boolean;
    query?: DreamCutQuery;
    assets?: DreamCutAsset[];
    messages?: DreamCutMessage[];
    error?: string;
  }> {
    try {
      // Get query
      const { data: query, error: queryError } = await this.supabase
        .from('dreamcut_queries')
        .select('*')
        .eq('id', queryId)
        .single();

      if (queryError) throw queryError;

      // Get assets
      const { data: assets, error: assetsError } = await this.supabase
        .from('dreamcut_assets')
        .select('*')
        .eq('query_id', queryId)
        .order('created_at', { ascending: true });

      if (assetsError) throw assetsError;

      // Get messages
      const { data: messages, error: messagesError } = await this.supabase
        .from('dreamcut_messages')
        .select('*')
        .eq('query_id', queryId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      return {
        success: true,
        query: query as DreamCutQuery,
        assets: assets as DreamCutAsset[],
        messages: messages as DreamCutMessage[]
      };

    } catch (error) {
      console.error('[DreamCutRealtime] Failed to get query:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Subscribe to realtime updates for a query
   */
  subscribeToQuery(
    queryId: string,
    callbacks: {
      onQueryUpdate?: (query: DreamCutQuery) => void;
      onAssetUpdate?: (asset: DreamCutAsset) => void;
      onNewMessage?: (message: DreamCutMessage) => void;
      onError?: (error: any) => void;
    }
  ): () => void {
    // Channel 1: Query-level updates
    const queryChannel = this.supabase
      .channel(`dreamcut_queries:${queryId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dreamcut_queries',
          filter: `id=eq.${queryId}`
        },
        (payload) => {
          console.log('[DreamCutRealtime] Query update:', payload);
          if (payload.new && callbacks.onQueryUpdate) {
            callbacks.onQueryUpdate(payload.new as DreamCutQuery);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[DreamCutRealtime] Subscribed to query ${queryId}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`[DreamCutRealtime] Query subscription error for ${queryId}`);
          callbacks.onError?.('Query subscription failed');
        }
      });

    // Channel 2: Asset-level updates
    const assetsChannel = this.supabase
      .channel(`dreamcut_assets:${queryId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dreamcut_assets',
          filter: `query_id=eq.${queryId}`
        },
        (payload) => {
          console.log('[DreamCutRealtime] Asset update:', payload);
          if (payload.new && callbacks.onAssetUpdate) {
            callbacks.onAssetUpdate(payload.new as DreamCutAsset);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[DreamCutRealtime] Subscribed to assets for query ${queryId}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`[DreamCutRealtime] Assets subscription error for ${queryId}`);
          callbacks.onError?.('Assets subscription failed');
        }
      });

    // Channel 3: Messages
    const messagesChannel = this.supabase
      .channel(`dreamcut_messages:${queryId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'dreamcut_messages',
          filter: `query_id=eq.${queryId}`
        },
        (payload) => {
          console.log('[DreamCutRealtime] New message:', payload);
          if (payload.new && callbacks.onNewMessage) {
            callbacks.onNewMessage(payload.new as DreamCutMessage);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[DreamCutRealtime] Subscribed to messages for query ${queryId}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`[DreamCutRealtime] Messages subscription error for ${queryId}`);
          callbacks.onError?.('Messages subscription failed');
        }
      });

    // Return unsubscribe function
    return () => {
      this.supabase.removeChannel(queryChannel);
      this.supabase.removeChannel(assetsChannel);
      this.supabase.removeChannel(messagesChannel);
      console.log(`[DreamCutRealtime] Unsubscribed from query ${queryId}`);
    };
  }

  /**
   * Get user's query history
   */
  async getUserQueries(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      status?: 'processing' | 'completed' | 'failed';
    } = {}
  ): Promise<{
    success: boolean;
    queries?: DreamCutQuery[];
    total?: number;
    error?: string;
  }> {
    try {
      let query = this.supabase
        .from('dreamcut_queries')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (options.status) {
        query = query.eq('status', options.status);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
      }

      const { data, count, error } = await query;

      if (error) throw error;

      return {
        success: true,
        queries: data as DreamCutQuery[],
        total: count || 0
      };

    } catch (error) {
      console.error('[DreamCutRealtime] Failed to get user queries:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

/**
 * React Hook for DreamCut Realtime
 */
export function useDreamCutRealtime(supabaseUrl: string, supabaseKey: string) {
  const manager = new DreamCutRealtimeManager(supabaseUrl, supabaseKey);
  return manager;
}

/**
 * Convenience function for creating manager instance
 */
export function createDreamCutManager(supabaseUrl?: string, supabaseKey?: string) {
  const url = supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = supabaseKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error('Supabase URL and key are required');
  }
  
  return new DreamCutRealtimeManager(url, key);
}
