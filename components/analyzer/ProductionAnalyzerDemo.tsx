/**
 * Production Analyzer Demo Component
 * 
 * Uses the exact Supabase schema design with proper realtime channels
 * for the complete "director's feedback" experience in production.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Play, 
  Upload,
  Brain,
  Eye,
  Film,
  Music,
  Check,
  Database,
  Radio,
  Settings,
  Download,
  Users
} from "lucide-react";
import { createDreamCutManager } from "@/lib/supabase/dreamcut-realtime";
import type { DreamCutQuery, DreamCutAsset, DreamCutMessage } from "@/lib/supabase/dreamcut-realtime";

interface Asset {
  url: string;
  filename: string;
  type: 'image' | 'video' | 'audio';
  description: string;
}

export default function ProductionAnalyzerDemo() {
  // Form state
  const [query, setQuery] = useState("Make a cinematic 30-second cyberpunk trailer with neon rain, using my reference image and video, and add my voiceover.");
  const [assets, setAssets] = useState<Asset[]>([
    {
      url: "https://cdn.supabase.io/assets/cyberpunk_ref.jpg",
      type: "image",
      description: "Moodboard reference for style and lighting",
      filename: "cyberpunk_ref.jpg"
    },
    {
      url: "https://cdn.supabase.io/assets/city_drive.mp4",
      type: "video",
      description: "Footage of driving through neon-lit streets",
      filename: "city_drive.mp4"
    },
    {
      url: "https://cdn.supabase.io/assets/voiceover.mp3",
      type: "audio",
      description: "Narration for the trailer",
      filename: "voiceover.mp3"
    }
  ]);

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentQuery, setCurrentQuery] = useState<DreamCutQuery | null>(null);
  const [queryAssets, setQueryAssets] = useState<Record<string, DreamCutAsset>>({});
  const [messages, setMessages] = useState<DreamCutMessage[]>([]);
  const [realtimeStatus, setRealtimeStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  
  // Database connection
  const [dreamCutManager] = useState(() => {
    try {
      return createDreamCutManager();
    } catch (error) {
      console.error('Failed to create DreamCut manager:', error);
      return null;
    }
  });

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup subscription on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const startAnalysis = async () => {
    if (!dreamCutManager || !query.trim() || assets.length === 0) return;

    setIsAnalyzing(true);
    setCurrentQuery(null);
    setQueryAssets({});
    setMessages([]);
    setRealtimeStatus('connecting');

    try {
      console.log('[ProductionDemo] Starting production analysis...');

      // Start the analysis via the production API
      const response = await fetch('/api/dreamcut/production-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          assets: assets.map(asset => ({
            url: asset.url,
            filename: asset.filename,
            type: asset.type,
            description: asset.description
          })),
          user_id: 'demo_user', // In real app, get from auth
          options: {
            analysis_mode: 'comprehensive',
            enable_realtime: true
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const queryId = data.query_id;
        console.log(`[ProductionDemo] Analysis started with query ID: ${queryId}`);
        
        // Subscribe to realtime updates using the manager
        unsubscribeRef.current = dreamCutManager.subscribeToQuery(queryId, {
          onQueryUpdate: (updatedQuery) => {
            console.log('[ProductionDemo] Query update:', updatedQuery);
            setCurrentQuery(updatedQuery);
            
            if (updatedQuery.status === 'completed') {
              setIsAnalyzing(false);
            } else if (updatedQuery.status === 'failed') {
              setIsAnalyzing(false);
            }
          },
          
          onAssetUpdate: (updatedAsset) => {
            console.log('[ProductionDemo] Asset update:', updatedAsset);
            setQueryAssets(prev => ({
              ...prev,
              [updatedAsset.id]: updatedAsset
            }));
          },
          
          onNewMessage: (newMessage) => {
            console.log('[ProductionDemo] New message:', newMessage);
            setMessages(prev => [...prev, newMessage]);
          },
          
          onError: (error) => {
            console.error('[ProductionDemo] Realtime error:', error);
            setRealtimeStatus('disconnected');
          }
        });
        
        setRealtimeStatus('connected');
        
        // Load initial data
        const { success: loadSuccess, query: loadedQuery, assets: loadedAssets, messages: loadedMessages } = 
          await dreamCutManager.getQuery(queryId);
          
        if (loadSuccess && loadedQuery) {
          setCurrentQuery(loadedQuery);
          
          if (loadedAssets) {
            const assetsMap = loadedAssets.reduce((acc, asset) => {
              acc[asset.id] = asset;
              return acc;
            }, {} as Record<string, DreamCutAsset>);
            setQueryAssets(assetsMap);
          }
          
          if (loadedMessages) {
            setMessages(loadedMessages);
          }
        }
        
      } else {
        throw new Error(data.error || 'Failed to start analysis');
      }
      
    } catch (error) {
      console.error('[ProductionDemo] Analysis failed:', error);
      setIsAnalyzing(false);
      setRealtimeStatus('disconnected');
      
      // Add error message to UI
      const errorMessage: DreamCutMessage = {
        id: `error_${Date.now()}`,
        query_id: '',
        type: 'error',
        content: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        emoji: '❌',
        data: {},
        created_at: new Date().toISOString()
      };
      setMessages([errorMessage]);
    }
  };

  const stopAnalysis = () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    setIsAnalyzing(false);
    setRealtimeStatus('disconnected');
  };

  const addAsset = () => {
    const newAsset: Asset = {
      url: "",
      type: "image",
      description: "",
      filename: ""
    };
    setAssets([...assets, newAsset]);
  };

  const updateAsset = (index: number, field: keyof Asset, value: string) => {
    const updated = [...assets];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-extract filename from URL
    if (field === 'url' && value) {
      try {
        const filename = value.split('/').pop() || 'unknown_file';
        updated[index].filename = filename;
      } catch {
        // Keep existing filename
      }
    }
    
    setAssets(updated);
  };

  const removeAsset = (index: number) => {
    setAssets(assets.filter((_, i) => i !== index));
  };

  const getMessageIcon = (type: DreamCutMessage['type']) => {
    switch (type) {
      case 'asset_start':
      case 'asset_progress':
      case 'asset_complete':
        return <Eye className="h-4 w-4" />;
      case 'merge':
        return <Brain className="h-4 w-4" />;
      case 'final':
        return <Check className="h-4 w-4" />;
      case 'error':
        return <Settings className="h-4 w-4" />;
      default:
        return <Film className="h-4 w-4" />;
    }
  };

  const getAssetIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'image': return <Eye className="h-4 w-4" />;
      case 'video': return <Film className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      default: return <Upload className="h-4 w-4" />;
    }
  };

  const getRealtimeStatusColor = () => {
    switch (realtimeStatus) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-yellow-600';
      case 'disconnected': return 'text-red-600';
    }
  };

  if (!dreamCutManager) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Configuration Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Failed to initialize Supabase connection. Please check your environment variables:
            </p>
            <ul className="mt-2 text-sm text-muted-foreground">
              <li>• NEXT_PUBLIC_SUPABASE_URL</li>
              <li>• NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            DreamCut Production Analyzer
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-4">
            Complete Supabase schema implementation with realtime channels for the director's feedback experience.
          </p>
          
          <div className="flex justify-center items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-2">
              <Database className="h-3 w-3" />
              Supabase Schema
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <Radio className={`h-3 w-3 ${getRealtimeStatusColor()}`} />
              Realtime: {realtimeStatus}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <Users className="h-3 w-3" />
              Multi-User Ready
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Input Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Creative Request</CardTitle>
                <CardDescription>
                  Enter your creative vision
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="query">Your Prompt</Label>
                  <Textarea
                    id="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Describe what you want to create..."
                    rows={4}
                    disabled={isAnalyzing}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Assets ({assets.length})</span>
                  <Button
                    size="sm"
                    onClick={addAsset}
                    disabled={isAnalyzing || assets.length >= 10}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Add Asset
                  </Button>
                </CardTitle>
                <CardDescription>
                  Reference materials for your project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assets.map((asset, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getAssetIcon(asset.type)}
                          <Badge variant="outline">{asset.type}</Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeAsset(index)}
                          disabled={isAnalyzing}
                        >
                          Remove
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          value={asset.type}
                          onChange={(e) => updateAsset(index, 'type', e.target.value as any)}
                          disabled={isAnalyzing}
                          className="px-3 py-2 border rounded-md text-sm"
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                          <option value="audio">Audio</option>
                        </select>
                        
                        <Input
                          placeholder="URL"
                          value={asset.url}
                          onChange={(e) => updateAsset(index, 'url', e.target.value)}
                          disabled={isAnalyzing}
                          className="col-span-2"
                        />
                      </div>
                      
                      <Input
                        placeholder="Description"
                        value={asset.description}
                        onChange={(e) => updateAsset(index, 'description', e.target.value)}
                        disabled={isAnalyzing}
                      />

                      {/* Asset status from database */}
                      {Object.values(queryAssets).find(a => a.filename === asset.filename) && (() => {
                        const dbAsset = Object.values(queryAssets).find(a => a.filename === asset.filename)!;
                        return (
                          <div className="mt-2 p-2 bg-muted rounded">
                            <div className="flex items-center justify-between text-sm">
                              <span>Status: {dbAsset.status}</span>
                              <span>{dbAsset.progress}%</span>
                            </div>
                            <Progress value={dbAsset.progress} className="mt-1" />
                            {dbAsset.model_used && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Model: {dbAsset.model_used}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  ))}
                  
                  {assets.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No assets added yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                onClick={startAnalysis}
                disabled={isAnalyzing || !query.trim() || assets.length === 0}
                className="flex-1"
              >
                {isAnalyzing ? (
                  <>
                    <Settings className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Production Analysis
                  </>
                )}
              </Button>
              
              {isAnalyzing && (
                <Button onClick={stopAnalysis} variant="outline">
                  Stop
                </Button>
              )}
            </div>
          </div>

          {/* Right Column: Realtime Updates */}
          <div className="space-y-6">
            {/* Database Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Query Status</div>
                    <div className="text-muted-foreground">
                      {currentQuery ? currentQuery.status : 'None'}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Progress</div>
                    <div className="text-muted-foreground">
                      {currentQuery ? `${currentQuery.progress}%` : '0%'}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Stage</div>
                    <div className="text-muted-foreground">
                      {currentQuery ? currentQuery.stage : 'init'}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Assets Tracked</div>
                    <div className="text-muted-foreground">
                      {Object.keys(queryAssets).length}
                    </div>
                  </div>
                </div>
                
                {currentQuery && (
                  <div className="space-y-2">
                    <Progress value={currentQuery.progress} />
                    <div className="text-xs text-muted-foreground">
                      Query ID: {currentQuery.id}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Director's Messages */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className={`h-5 w-5 ${getRealtimeStatusColor()}`} />
                  Director's Feedback
                </CardTitle>
                <CardDescription>
                  Live updates from Supabase Realtime
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div key={message.id} className="flex items-start gap-3">
                        <div className="mt-1">
                          {getMessageIcon(message.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {message.emoji && (
                              <span className="text-lg">{message.emoji}</span>
                            )}
                            <span className="text-sm">{message.content}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(message.created_at).toLocaleTimeString()} • {message.type}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {messages.length === 0 && !isAnalyzing && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Film className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Start analysis to see director's feedback</p>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Final Result */}
            {currentQuery?.status === 'completed' && currentQuery.payload && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    Analysis Complete
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4">
                    <Check className="h-4 w-4" />
                    <AlertDescription>
                      Production analysis completed! Ready for the next pipeline stage.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Processing Time:</span>
                      <span>{currentQuery.processing_time_ms ? `${currentQuery.processing_time_ms}ms` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Models Used:</span>
                      <span>{currentQuery.models_used?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cost Estimate:</span>
                      <span>${currentQuery.cost_estimate?.toFixed(4) || '0.0000'}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Analysis JSON
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Schema Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Production Database Schema</CardTitle>
            <CardDescription>
              Complete Supabase implementation with realtime channels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="font-medium mb-2">dreamcut_queries</div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Overall progress tracking</li>
                  <li>• Status: processing → completed</li>
                  <li>• Stage: init → analyzing → merging → done</li>
                  <li>• Final payload storage</li>
                </ul>
              </div>
              
              <div>
                <div className="font-medium mb-2">dreamcut_assets</div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Individual asset progress</li>
                  <li>• Partial analysis updates</li>
                  <li>• Worker and model tracking</li>
                  <li>• Quality scoring</li>
                </ul>
              </div>
              
              <div>
                <div className="font-medium mb-2">dreamcut_messages</div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Director feedback messages</li>
                  <li>• Emoji and timestamps</li>
                  <li>• Message type categorization</li>
                  <li>• Asset association</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
