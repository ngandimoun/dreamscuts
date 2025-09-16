/**
 * Realtime Analyzer Demo Component
 * 
 * Demonstrates the "director's feedback" experience with live streaming
 * updates as the analysis progresses. Shows the storyboard flow in action.
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
import { Separator } from "@/components/ui/separator";
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
  Clock,
  Zap,
  Download,
  Settings
} from "lucide-react";
import { subscribeToQueryUpdates } from "@/lib/analyzer/realtime-storyboard";
import type { DreamCutMessage, AssetProgress } from "@/lib/analyzer/realtime-storyboard";

interface Asset {
  id: string;
  url: string;
  mediaType: 'image' | 'video' | 'audio';
  description: string;
  filename: string;
}

export default function RealtimeAnalyzerDemo() {
  // Form state
  const [query, setQuery] = useState("Make a cinematic 30-second cyberpunk trailer with neon rain, using my reference image and video, and add my voiceover.");
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "asset_1",
      url: "https://cdn.supabase.io/assets/cyberpunk_ref.jpg",
      mediaType: "image",
      description: "Moodboard reference for style and lighting",
      filename: "cyberpunk_ref.jpg"
    },
    {
      id: "asset_2", 
      url: "https://cdn.supabase.io/assets/city_drive.mp4",
      mediaType: "video",
      description: "Footage of driving through neon-lit streets",
      filename: "city_drive.mp4"
    },
    {
      id: "asset_3",
      url: "https://cdn.supabase.io/assets/voiceover.mp3",
      mediaType: "audio",
      description: "Narration for the trailer",
      filename: "voiceover.mp3"
    }
  ]);

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [queryId, setQueryId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [messages, setMessages] = useState<DreamCutMessage[]>([]);
  const [assetStatuses, setAssetStatuses] = useState<Record<string, AssetProgress>>({});
  const [finalResult, setFinalResult] = useState<any>(null);
  
  // UI state
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
    if (!query.trim() || assets.length === 0) return;

    setIsAnalyzing(true);
    setProgress(0);
    setCurrentStage('Starting...');
    setMessages([]);
    setAssetStatuses({});
    setFinalResult(null);

    try {
      // Start the realtime analysis
      const response = await fetch('/api/dreamcut/realtime-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          assets: assets.map(asset => ({
            id: asset.id,
            url: asset.url,
            mediaType: asset.mediaType,
            description: asset.description
          })),
          user_id: 'demo_user', // In real app, get from auth
          options: {
            step1: { model_preference: 'auto' },
            step2: { parallel_processing: true },
            step3: { enable_ai_synthesis: true },
            step4: { detail_level: 'comprehensive' },
            realtime: { enable_streaming: true }
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setQueryId(data.query_id);
        
        // Subscribe to realtime updates
        unsubscribeRef.current = subscribeToQueryUpdates(data.query_id, {
          onMessage: (message) => {
            setMessages(prev => [...prev, message]);
            
            // Update current stage based on message type
            if (message.type === 'status') {
              setCurrentStage('Initializing...');
            } else if (message.type === 'asset_start') {
              setCurrentStage(`Analyzing ${message.data?.asset_type}...`);
            } else if (message.type === 'merge') {
              setCurrentStage('Creating creative brief...');
            } else if (message.type === 'final') {
              setCurrentStage('Complete!');
            }
          },
          
          onProgress: (data) => {
            setProgress(data.progress);
            
            // Map stage to user-friendly text
            const stageMap: Record<string, string> = {
              'init': 'Starting analysis...',
              'analyzing': 'Analyzing assets...',
              'merging': 'Creating creative brief...',
              'complete': 'Analysis complete!'
            };
            setCurrentStage(stageMap[data.stage] || data.stage);
          },
          
          onAssetProgress: (asset) => {
            setAssetStatuses(prev => ({
              ...prev,
              [asset.asset_id]: asset
            }));
          },
          
          onComplete: (payload) => {
            setFinalResult(payload);
            setIsAnalyzing(false);
            setProgress(100);
            setCurrentStage('Complete!');
          }
        });
        
      } else {
        throw new Error(data.error || 'Failed to start analysis');
      }
      
    } catch (error) {
      console.error('Analysis failed:', error);
      setIsAnalyzing(false);
      setMessages(prev => [...prev, {
        id: `error_${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'status',
        content: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        emoji: '❌'
      }]);
    }
  };

  const stopAnalysis = () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    setIsAnalyzing(false);
    setCurrentStage('Stopped');
  };

  const addAsset = () => {
    const newAsset: Asset = {
      id: `asset_${Date.now()}`,
      url: "",
      mediaType: "image",
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
      case 'conflict':
        return <Settings className="h-4 w-4" />;
      case 'suggestion':
        return <Zap className="h-4 w-4" />;
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            DreamCut Realtime Analyzer
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Experience the "director's feedback" flow with live streaming updates as your creative brief is analyzed.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Input Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Creative Request</CardTitle>
                <CardDescription>
                  Describe what you want to create
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="query">Your Prompt</Label>
                  <Textarea
                    id="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Describe your creative vision..."
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
                    <div key={asset.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getAssetIcon(asset.mediaType)}
                          <Badge variant="outline">{asset.mediaType}</Badge>
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
                          value={asset.mediaType}
                          onChange={(e) => updateAsset(index, 'mediaType', e.target.value as any)}
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
                        placeholder="Description (e.g., 'Style reference for lighting')"
                        value={asset.description}
                        onChange={(e) => updateAsset(index, 'description', e.target.value)}
                        disabled={isAnalyzing}
                      />

                      {/* Asset status during analysis */}
                      {assetStatuses[asset.id] && (
                        <div className="mt-2 p-2 bg-muted rounded">
                          <div className="flex items-center justify-between text-sm">
                            <span>Status: {assetStatuses[asset.id].stage}</span>
                            <span>{assetStatuses[asset.id].progress}%</span>
                          </div>
                          <Progress value={assetStatuses[asset.id].progress} className="mt-1" />
                        </div>
                      )}
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
                    Start Analysis
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
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Analysis Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{currentStage}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
                
                {queryId && (
                  <div className="text-xs text-muted-foreground">
                    Query ID: {queryId}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Director's Feedback Chat */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Director's Feedback</CardTitle>
                <CardDescription>
                  Live analysis updates as they happen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-3">
                    {messages.map((message, index) => (
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
                            {new Date(message.timestamp).toLocaleTimeString()}
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
            {finalResult && (
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
                      Creative brief generated successfully! Ready for production pipeline.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Assets Analyzed:</span>
                      <span>{finalResult.final_analysis?.assets_analysis?.total_assets_processed || assets.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Creative Options:</span>
                      <span>{finalResult.final_analysis?.creative_options?.alternative_approaches?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pipeline Steps:</span>
                      <span>{finalResult.final_analysis?.pipeline_recommendations?.recommended_workflow?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quality Score:</span>
                      <span>{finalResult.final_analysis?.analysis_metadata?.quality_score || 0}/10</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <Button className="w-full" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Analysis JSON
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Storyboard Explanation */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How the Realtime Flow Works</CardTitle>
            <CardDescription>
              The "director's feedback" experience follows a film production storyboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="space-y-2">
                <div className="font-medium flex items-center gap-2">
                  <Film className="h-4 w-4" />
                  1. Initialization
                </div>
                <p className="text-muted-foreground">
                  "Got your request. Let's break it down..."
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  2. Asset Analysis
                </div>
                <p className="text-muted-foreground">
                  Each asset analyzed in parallel with progress updates
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="font-medium flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  3. Creative Synthesis
                </div>
                <p className="text-muted-foreground">
                  "Combining query + assets into creative brief..."
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="font-medium flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  4. Production Ready
                </div>
                <p className="text-muted-foreground">
                  "Creative brief ready 🎬 Ready for production! 🚀"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
