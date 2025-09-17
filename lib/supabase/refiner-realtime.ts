/**
 * Supabase Realtime Integration for DreamCut Refiner
 * 
 * Handles real-time broadcasting of refiner results to the frontend
 * for live preview and status updates.
 */

import { createClient } from '@supabase/supabase-js';

export interface RefinerRealtimeEvent {
  type: 'refined' | 'processing' | 'error';
  refinerId: string;
  modelUsed?: 'claude-3-haiku' | 'gpt-4o-mini';
  processingTimeMs?: number;
  timestamp: string;
  error?: string;
}

export interface RefinerRealtimeOptions {
  channelName?: string;
  enableLogging?: boolean;
}

/**
 * Initialize Supabase client for Realtime
 */
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables for Realtime');
  }

  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Broadcast refiner result via Supabase Realtime
 */
export async function broadcastRefinerResult(
  event: RefinerRealtimeEvent,
  options: RefinerRealtimeOptions = {}
): Promise<boolean> {
  const { channelName = 'dreamcut', enableLogging = true } = options;

  try {
    const supabase = createSupabaseClient();
    
    if (enableLogging) {
      console.log(`📡 [Realtime] Broadcasting ${event.type} event for refiner ${event.refinerId}`);
    }

    const { error } = await supabase.channel(channelName).send({
      type: 'broadcast',
      event: event.type,
      payload: event
    });

    if (error) {
      console.error('📡 [Realtime] Broadcast failed:', error);
      return false;
    }

    if (enableLogging) {
      console.log('📡 [Realtime] Broadcast successful');
    }

    return true;
  } catch (error) {
    console.error('📡 [Realtime] Unexpected error:', error);
    return false;
  }
}

/**
 * Subscribe to refiner events on the frontend
 */
export function subscribeToRefinerEvents(
  onEvent: (event: RefinerRealtimeEvent) => void,
  options: RefinerRealtimeOptions = {}
) {
  const { channelName = 'dreamcut', enableLogging = true } = options;

  try {
    const supabase = createSupabaseClient();
    
    if (enableLogging) {
      console.log('📡 [Realtime] Subscribing to refiner events...');
    }

    const channel = supabase.channel(channelName);

    // Listen for refiner events
    channel.on('broadcast', { event: 'refined' }, (payload) => {
      if (enableLogging) {
        console.log('📡 [Realtime] Received refined event:', payload);
      }
      onEvent(payload.payload as RefinerRealtimeEvent);
    });

    channel.on('broadcast', { event: 'processing' }, (payload) => {
      if (enableLogging) {
        console.log('📡 [Realtime] Received processing event:', payload);
      }
      onEvent(payload.payload as RefinerRealtimeEvent);
    });

    channel.on('broadcast', { event: 'error' }, (payload) => {
      if (enableLogging) {
        console.log('📡 [Realtime] Received error event:', payload);
      }
      onEvent(payload.payload as RefinerRealtimeEvent);
    });

    // Subscribe to the channel
    channel.subscribe((status) => {
      if (enableLogging) {
        console.log('📡 [Realtime] Subscription status:', status);
      }
    });

    // Return unsubscribe function
    return () => {
      if (enableLogging) {
        console.log('📡 [Realtime] Unsubscribing from refiner events...');
      }
      supabase.removeChannel(channel);
    };

  } catch (error) {
    console.error('📡 [Realtime] Subscription error:', error);
    return () => {}; // Return no-op unsubscribe function
  }
}

/**
 * Broadcast processing start event
 */
export async function broadcastProcessingStart(
  refinerId: string,
  options: RefinerRealtimeOptions = {}
): Promise<boolean> {
  return broadcastRefinerResult({
    type: 'processing',
    refinerId,
    timestamp: new Date().toISOString()
  }, options);
}

/**
 * Broadcast successful refinement event
 */
export async function broadcastRefinementSuccess(
  refinerId: string,
  modelUsed: 'claude-3-haiku' | 'gpt-4o-mini',
  processingTimeMs: number,
  options: RefinerRealtimeOptions = {}
): Promise<boolean> {
  return broadcastRefinerResult({
    type: 'refined',
    refinerId,
    modelUsed,
    processingTimeMs,
    timestamp: new Date().toISOString()
  }, options);
}

/**
 * Broadcast refinement error event
 */
export async function broadcastRefinementError(
  refinerId: string,
  error: string,
  options: RefinerRealtimeOptions = {}
): Promise<boolean> {
  return broadcastRefinerResult({
    type: 'error',
    refinerId,
    error,
    timestamp: new Date().toISOString()
  }, options);
}

/**
 * React hook for subscribing to refiner events
 */
export function useRefinerRealtime(
  onEvent: (event: RefinerRealtimeEvent) => void,
  options: RefinerRealtimeOptions = {}
) {
  // This would be used in a React component
  // For now, we'll export the subscription function
  return subscribeToRefinerEvents(onEvent, options);
}

/**
 * Test Realtime connection
 */
export async function testRealtimeConnection(
  options: RefinerRealtimeOptions = {}
): Promise<boolean> {
  const { enableLogging = true } = options;

  try {
    const supabase = createSupabaseClient();
    
    if (enableLogging) {
      console.log('📡 [Realtime] Testing connection...');
    }

    // Send a test broadcast
    const testEvent: RefinerRealtimeEvent = {
      type: 'refined',
      refinerId: 'test_connection',
      timestamp: new Date().toISOString()
    };

    const success = await broadcastRefinerResult(testEvent, {
      ...options,
      enableLogging: false // Don't log test events
    });

    if (enableLogging) {
      console.log('📡 [Realtime] Connection test:', success ? 'SUCCESS' : 'FAILED');
    }

    return success;
  } catch (error) {
    if (enableLogging) {
      console.error('📡 [Realtime] Connection test failed:', error);
    }
    return false;
  }
}

/**
 * Get Realtime connection status
 */
export async function getRealtimeStatus(): Promise<{
  connected: boolean;
  channelName: string;
  lastEvent?: RefinerRealtimeEvent;
}> {
  try {
    const supabase = createSupabaseClient();
    const channel = supabase.channel('dreamcut');
    
    return {
      connected: true,
      channelName: 'dreamcut',
      lastEvent: undefined // Would need to track this in a real implementation
    };
  } catch (error) {
    return {
      connected: false,
      channelName: 'dreamcut'
    };
  }
}

export default {
  broadcastRefinerResult,
  subscribeToRefinerEvents,
  broadcastProcessingStart,
  broadcastRefinementSuccess,
  broadcastRefinementError,
  useRefinerRealtime,
  testRealtimeConnection,
  getRealtimeStatus
};
