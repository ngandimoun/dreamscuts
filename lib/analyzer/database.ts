/**
 * DreamCut Analyzer Database Manager
 * 
 * Handles all database operations for the analyzer JSON schema mapping.
 * Provides type-safe operations with full realtime support.
 */

import { createClient } from '@supabase/supabase-js';
import type {
  AnalyzerQuery,
  AnalyzerAsset,
  CreativeOption,
  Challenge,
  Recommendation,
  CompleteAnalyzerResult,
  AnalyzerQueryFilters,
  AnalyzerQueryResult,
  AnalyzerQueriesResult,
  AnalyzerRealtimeCallbacks,
  InsertAnalyzerQueryData,
  InsertAnalyzerAssetData,
  InsertCreativeOptionData,
  InsertChallengeData,
  InsertRecommendationData
} from './types';

export class AnalyzerDatabaseManager {
  private supabase: ReturnType<typeof createClient>;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // ========================================
  // MAIN QUERY OPERATIONS
  // ========================================

  /**
   * Insert complete analyzer result from JSON
   */
  async insertAnalyzerResult(
    userId: string,
    analyzerJson: any
  ): Promise<{ success: boolean; queryId?: string; error?: string }> {
    try {
      const { data, error } = await this.supabase.rpc('insert_analyzer_result', {
        p_user_id: userId,
        p_analyzer_json: analyzerJson
      });

      if (error) throw error;

      console.log(`[AnalyzerDB] Analyzer result inserted: ${data}`);
      return { success: true, queryId: data };

    } catch (error) {
      console.error('[AnalyzerDB] Failed to insert analyzer result:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get complete analyzer result by query ID
   */
  async getAnalyzerResult(queryId: string): Promise<{
    success: boolean;
    result?: CompleteAnalyzerResult;
    error?: string;
  }> {
    try {
      const { data, error } = await this.supabase.rpc('get_analyzer_result', {
        p_query_id: queryId
      });

      if (error) throw error;

      return {
        success: true,
        result: data as CompleteAnalyzerResult
      };

    } catch (error) {
      console.error('[AnalyzerDB] Failed to get analyzer result:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get analyzer query with all related data
   */
  async getAnalyzerQuery(queryId: string): Promise<AnalyzerQueryResult> {
    try {
      // Get main query
      const { data: query, error: queryError } = await this.supabase
        .from('analyzer_queries')
        .select('*')
        .eq('id', queryId)
        .single();

      if (queryError) throw queryError;

      // Get assets
      const { data: assets, error: assetsError } = await this.supabase
        .from('analyzer_assets')
        .select('*')
        .eq('query_id', queryId)
        .order('created_at', { ascending: true });

      if (assetsError) throw assetsError;

      // Get creative options
      const { data: options, error: optionsError } = await this.supabase
        .from('creative_options')
        .select('*')
        .eq('query_id', queryId)
        .order('created_at', { ascending: true });

      if (optionsError) throw optionsError;

      // Get challenges
      const { data: challenges, error: challengesError } = await this.supabase
        .from('challenges')
        .select('*')
        .eq('query_id', queryId)
        .order('created_at', { ascending: true });

      if (challengesError) throw challengesError;

      // Get recommendations
      const { data: recommendations, error: recommendationsError } = await this.supabase
        .from('recommendations')
        .select('*')
        .eq('query_id', queryId)
        .order('created_at', { ascending: true });

      if (recommendationsError) throw recommendationsError;

      return {
        success: true,
        query: query as AnalyzerQuery,
        assets: assets as AnalyzerAsset[],
        creative_options: options as CreativeOption[],
        challenges: challenges as Challenge[],
        recommendations: recommendations as Recommendation[]
      };

    } catch (error) {
      console.error('[AnalyzerDB] Failed to get analyzer query:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get user's analyzer queries with filtering
   */
  async getUserAnalyzerQueries(
    userId: string,
    filters: AnalyzerQueryFilters = {}
  ): Promise<AnalyzerQueriesResult> {
    try {
      let query = this.supabase
        .from('analyzer_queries')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.intent) {
        query = query.eq('intent', filters.intent);
      }
      if (filters.completion_status) {
        query = query.eq('completion_status', filters.completion_status);
      }
      if (filters.created_after) {
        query = query.gte('created_at', filters.created_after);
      }
      if (filters.created_before) {
        query = query.lte('created_at', filters.created_before);
      }

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, count, error } = await query;

      if (error) throw error;

      return {
        success: true,
        queries: data as AnalyzerQuery[],
        total: count || 0
      };

    } catch (error) {
      console.error('[AnalyzerDB] Failed to get user analyzer queries:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // ========================================
  // INDIVIDUAL TABLE OPERATIONS
  // ========================================

  /**
   * Insert analyzer query
   */
  async insertAnalyzerQuery(data: InsertAnalyzerQueryData): Promise<{
    success: boolean;
    queryId?: string;
    error?: string;
  }> {
    try {
      const { data: result, error } = await this.supabase
        .from('analyzer_queries')
        .insert(data)
        .select('id')
        .single();

      if (error) throw error;

      return { success: true, queryId: result.id };

    } catch (error) {
      console.error('[AnalyzerDB] Failed to insert analyzer query:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Update analyzer query
   */
  async updateAnalyzerQuery(
    queryId: string,
    updates: Partial<InsertAnalyzerQueryData>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('analyzer_queries')
        .update(updates)
        .eq('id', queryId);

      if (error) throw error;

      return { success: true };

    } catch (error) {
      console.error('[AnalyzerDB] Failed to update analyzer query:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Insert analyzer asset
   */
  async insertAnalyzerAsset(data: InsertAnalyzerAssetData): Promise<{
    success: boolean;
    assetId?: string;
    error?: string;
  }> {
    try {
      const { data: result, error } = await this.supabase
        .from('analyzer_assets')
        .insert(data)
        .select('id')
        .single();

      if (error) throw error;

      return { success: true, assetId: result.id };

    } catch (error) {
      console.error('[AnalyzerDB] Failed to insert analyzer asset:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Update analyzer asset
   */
  async updateAnalyzerAsset(
    assetId: string,
    updates: Partial<InsertAnalyzerAssetData>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('analyzer_assets')
        .update(updates)
        .eq('id', assetId);

      if (error) throw error;

      return { success: true };

    } catch (error) {
      console.error('[AnalyzerDB] Failed to update analyzer asset:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Insert creative option
   */
  async insertCreativeOption(data: InsertCreativeOptionData): Promise<{
    success: boolean;
    optionId?: string;
    error?: string;
  }> {
    try {
      const { data: result, error } = await this.supabase
        .from('creative_options')
        .insert(data)
        .select('id')
        .single();

      if (error) throw error;

      return { success: true, optionId: result.id };

    } catch (error) {
      console.error('[AnalyzerDB] Failed to insert creative option:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Update creative option
   */
  async updateCreativeOption(
    optionId: string,
    updates: Partial<InsertCreativeOptionData>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('creative_options')
        .update(updates)
        .eq('id', optionId);

      if (error) throw error;

      return { success: true };

    } catch (error) {
      console.error('[AnalyzerDB] Failed to update creative option:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Insert challenge
   */
  async insertChallenge(data: InsertChallengeData): Promise<{
    success: boolean;
    challengeId?: string;
    error?: string;
  }> {
    try {
      const { data: result, error } = await this.supabase
        .from('challenges')
        .insert(data)
        .select('id')
        .single();

      if (error) throw error;

      return { success: true, challengeId: result.id };

    } catch (error) {
      console.error('[AnalyzerDB] Failed to insert challenge:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Update challenge
   */
  async updateChallenge(
    challengeId: string,
    updates: Partial<InsertChallengeData>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('challenges')
        .update(updates)
        .eq('id', challengeId);

      if (error) throw error;

      return { success: true };

    } catch (error) {
      console.error('[AnalyzerDB] Failed to update challenge:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Insert recommendation
   */
  async insertRecommendation(data: InsertRecommendationData): Promise<{
    success: boolean;
    recommendationId?: string;
    error?: string;
  }> {
    try {
      const { data: result, error } = await this.supabase
        .from('recommendations')
        .insert(data)
        .select('id')
        .single();

      if (error) throw error;

      return { success: true, recommendationId: result.id };

    } catch (error) {
      console.error('[AnalyzerDB] Failed to insert recommendation:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Update recommendation
   */
  async updateRecommendation(
    recommendationId: string,
    updates: Partial<InsertRecommendationData>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('recommendations')
        .update(updates)
        .eq('id', recommendationId);

      if (error) throw error;

      return { success: true };

    } catch (error) {
      console.error('[AnalyzerDB] Failed to update recommendation:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // ========================================
  // REALTIME SUBSCRIPTIONS
  // ========================================

  /**
   * Subscribe to realtime updates for an analyzer query
   */
  subscribeToAnalyzerQuery(
    queryId: string,
    callbacks: AnalyzerRealtimeCallbacks
  ): () => void {
    // Channel 1: Query-level updates
    const queryChannel = this.supabase
      .channel(`analyzer_queries:${queryId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'analyzer_queries',
          filter: `id=eq.${queryId}`
        },
        (payload) => {
          console.log('[AnalyzerDB] Query update:', payload);
          if (payload.new && callbacks.onQueryUpdate) {
            callbacks.onQueryUpdate(payload.new as AnalyzerQuery);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[AnalyzerDB] Subscribed to analyzer query ${queryId}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`[AnalyzerDB] Query subscription error for ${queryId}`);
          callbacks.onError?.('Query subscription failed');
        }
      });

    // Channel 2: Asset-level updates
    const assetsChannel = this.supabase
      .channel(`analyzer_assets:${queryId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'analyzer_assets',
          filter: `query_id=eq.${queryId}`
        },
        (payload) => {
          console.log('[AnalyzerDB] Asset update:', payload);
          if (payload.new && callbacks.onAssetUpdate) {
            callbacks.onAssetUpdate(payload.new as AnalyzerAsset);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[AnalyzerDB] Subscribed to assets for query ${queryId}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`[AnalyzerDB] Assets subscription error for ${queryId}`);
          callbacks.onError?.('Assets subscription failed');
        }
      });

    // Channel 3: Creative options updates
    const optionsChannel = this.supabase
      .channel(`creative_options:${queryId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'creative_options',
          filter: `query_id=eq.${queryId}`
        },
        (payload) => {
          console.log('[AnalyzerDB] Creative option update:', payload);
          if (payload.new && callbacks.onCreativeOptionUpdate) {
            callbacks.onCreativeOptionUpdate(payload.new as CreativeOption);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[AnalyzerDB] Subscribed to creative options for query ${queryId}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`[AnalyzerDB] Creative options subscription error for ${queryId}`);
          callbacks.onError?.('Creative options subscription failed');
        }
      });

    // Channel 4: Challenges updates
    const challengesChannel = this.supabase
      .channel(`challenges:${queryId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'challenges',
          filter: `query_id=eq.${queryId}`
        },
        (payload) => {
          console.log('[AnalyzerDB] Challenge update:', payload);
          if (payload.new && callbacks.onChallengeUpdate) {
            callbacks.onChallengeUpdate(payload.new as Challenge);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[AnalyzerDB] Subscribed to challenges for query ${queryId}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`[AnalyzerDB] Challenges subscription error for ${queryId}`);
          callbacks.onError?.('Challenges subscription failed');
        }
      });

    // Channel 5: Recommendations updates
    const recommendationsChannel = this.supabase
      .channel(`recommendations:${queryId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recommendations',
          filter: `query_id=eq.${queryId}`
        },
        (payload) => {
          console.log('[AnalyzerDB] Recommendation update:', payload);
          if (payload.new && callbacks.onRecommendationUpdate) {
            callbacks.onRecommendationUpdate(payload.new as Recommendation);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[AnalyzerDB] Subscribed to recommendations for query ${queryId}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`[AnalyzerDB] Recommendations subscription error for ${queryId}`);
          callbacks.onError?.('Recommendations subscription failed');
        }
      });

    // Return unsubscribe function
    return () => {
      this.supabase.removeChannel(queryChannel);
      this.supabase.removeChannel(assetsChannel);
      this.supabase.removeChannel(optionsChannel);
      this.supabase.removeChannel(challengesChannel);
      this.supabase.removeChannel(recommendationsChannel);
      console.log(`[AnalyzerDB] Unsubscribed from analyzer query ${queryId}`);
    };
  }

  // ========================================
  // ANALYTICS AND REPORTING
  // ========================================

  /**
   * Get analytics for user's analyzer queries
   */
  async getAnalyzerAnalytics(userId: string): Promise<{
    success: boolean;
    analytics?: {
      total_queries: number;
      completed_queries: number;
      failed_queries: number;
      average_processing_time: number;
      most_common_intent: string;
      average_confidence: number;
      total_assets_analyzed: number;
      challenges_resolved: number;
      recommendations_implemented: number;
    };
    error?: string;
  }> {
    try {
      // Get basic query stats
      const { data: queryStats, error: queryError } = await this.supabase
        .from('analyzer_queries')
        .select('completion_status, processing_time_ms, intent, overall_confidence')
        .eq('user_id', userId);

      if (queryError) throw queryError;

      // Get asset stats
      const { data: assetStats, error: assetError } = await this.supabase
        .from('analyzer_assets')
        .select('id')
        .eq('query_id', (await this.supabase
          .from('analyzer_queries')
          .select('id')
          .eq('user_id', userId)
        ).data?.map(q => q.id) || []);

      if (assetError) throw assetError;

      // Get challenge stats
      const { data: challengeStats, error: challengeError } = await this.supabase
        .from('challenges')
        .select('is_resolved')
        .eq('query_id', (await this.supabase
          .from('analyzer_queries')
          .select('id')
          .eq('user_id', userId)
        ).data?.map(q => q.id) || []);

      if (challengeError) throw challengeError;

      // Get recommendation stats
      const { data: recommendationStats, error: recommendationError } = await this.supabase
        .from('recommendations')
        .select('is_implemented')
        .eq('query_id', (await this.supabase
          .from('analyzer_queries')
          .select('id')
          .eq('user_id', userId)
        ).data?.map(q => q.id) || []);

      if (recommendationError) throw recommendationError;

      // Calculate analytics
      const totalQueries = queryStats.length;
      const completedQueries = queryStats.filter(q => q.completion_status === 'complete').length;
      const failedQueries = queryStats.filter(q => q.completion_status === 'failed').length;
      const averageProcessingTime = queryStats
        .filter(q => q.processing_time_ms)
        .reduce((sum, q) => sum + (q.processing_time_ms || 0), 0) / totalQueries;
      
      const intentCounts = queryStats.reduce((acc, q) => {
        acc[q.intent] = (acc[q.intent] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const mostCommonIntent = Object.entries(intentCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'unknown';
      
      const averageConfidence = queryStats
        .filter(q => q.overall_confidence)
        .reduce((sum, q) => sum + (q.overall_confidence || 0), 0) / totalQueries;

      return {
        success: true,
        analytics: {
          total_queries: totalQueries,
          completed_queries: completedQueries,
          failed_queries: failedQueries,
          average_processing_time: averageProcessingTime,
          most_common_intent: mostCommonIntent,
          average_confidence: averageConfidence,
          total_assets_analyzed: assetStats.length,
          challenges_resolved: challengeStats.filter(c => c.is_resolved).length,
          recommendations_implemented: recommendationStats.filter(r => r.is_implemented).length
        }
      };

    } catch (error) {
      console.error('[AnalyzerDB] Failed to get analyzer analytics:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

/**
 * Convenience function for creating manager instance
 */
export function createAnalyzerDatabaseManager(supabaseUrl?: string, supabaseKey?: string) {
  const url = supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = supabaseKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error('Supabase URL and key are required');
  }
  
  return new AnalyzerDatabaseManager(url, key);
}
