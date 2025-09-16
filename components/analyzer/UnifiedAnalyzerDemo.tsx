/**
 * Unified Analyzer Demo Component
 * 
 * Replaces all the individual test components with a single, comprehensive
 * demo interface for the complete analysis pipeline.
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Zap, 
  Brain, 
  Image, 
  Video, 
  AudioLines,
  Settings,
  Play,
  Download
} from "lucide-react";

interface MediaAsset {
  id: string;
  url: string;
  mediaType: 'image' | 'video' | 'audio';
  description?: string;
  metadata?: Record<string, any>;
}

interface AnalysisOptions {
  step1: {
    model_preference: string;
    enable_creative_reframing: boolean;
    gap_detection_depth: string;
  };
  step2: {
    parallel_processing: boolean;
    enable_fallbacks: boolean;
    quality_threshold: number;
  };
  step3: {
    enable_ai_synthesis: boolean;
    synthesis_model: string;
    include_creative_suggestions: boolean;
    gap_analysis_depth: string;
    optimization_focus: string;
  };
  step4: {
    include_alternative_approaches: boolean;
    include_creative_enhancements: boolean;
    include_detailed_pipeline: boolean;
    include_processing_insights: boolean;
    detail_level: string;
    target_audience: string;
  };
}

interface AnalysisResult {
  success: boolean;
  request_id: string;
  processing_time_ms: number;
  final_analysis: any;
  pipeline_breakdown: any;
  executive_summary: any;
  performance: any;
  warnings?: string[];
  error?: string;
}

export default function UnifiedAnalyzerDemo() {
  const [query, setQuery] = useState("Create a cinematic trailer for a sci-fi movie with dark, mysterious atmosphere");
  const [assets, setAssets] = useState<MediaAsset[]>([
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176",
      mediaType: "image",
      description: "Dark sci-fi corridor"
    }
  ]);
  const [options, setOptions] = useState<AnalysisOptions>({
    step1: {
      model_preference: 'auto',
      enable_creative_reframing: true,
      gap_detection_depth: 'detailed'
    },
    step2: {
      parallel_processing: true,
      enable_fallbacks: true,
      quality_threshold: 5
    },
    step3: {
      enable_ai_synthesis: true,
      synthesis_model: 'auto',
      include_creative_suggestions: true,
      gap_analysis_depth: 'detailed',
      optimization_focus: 'balanced'
    },
    step4: {
      include_alternative_approaches: true,
      include_creative_enhancements: true,
      include_detailed_pipeline: true,
      include_processing_insights: true,
      detail_level: 'standard',
      target_audience: 'general'
    }
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [progress, setProgress] = useState(0);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setCurrentStep(0);
    setProgress(0);
    setResult(null);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 15, 95));
    }, 500);

    try {
      const response = await fetch('/api/dreamcut/unified-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          assets,
          options
        }),
      });

      const data = await response.json();
      
      clearInterval(progressInterval);
      setProgress(100);
      setResult(data);
      
      if (!data.success) {
        console.error('Analysis failed:', data.error);
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Request failed:', error);
      setResult({
        success: false,
        request_id: 'error',
        processing_time_ms: 0,
        final_analysis: null,
        pipeline_breakdown: null,
        executive_summary: null,
        performance: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addAsset = () => {
    const newAsset: MediaAsset = {
      id: Date.now().toString(),
      url: "",
      mediaType: "image",
      description: ""
    };
    setAssets([...assets, newAsset]);
  };

  const updateAsset = (id: string, field: keyof MediaAsset, value: any) => {
    setAssets(assets.map(asset => 
      asset.id === id ? { ...asset, [field]: value } : asset
    ));
  };

  const removeAsset = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id));
  };

  const updateOption = (section: keyof AnalysisOptions, field: string, value: any) => {
    setOptions(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const downloadResult = () => {
    if (!result?.final_analysis) return;
    
    const dataStr = JSON.stringify(result.final_analysis, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analysis-${result.request_id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">DreamCut Unified Analyzer</h1>
        <p className="text-muted-foreground">
          Complete analysis pipeline: Query → Assets → Synthesis → Output
        </p>
        <Badge variant="outline" className="text-sm">
          Version 2.0.0 • All Steps Unified
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Query Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Query Input
              </CardTitle>
              <CardDescription>
                Describe what you want to create
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe your creative project..."
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          {/* Assets Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Media Assets
              </CardTitle>
              <CardDescription>
                Add images, videos, or audio files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {assets.map((asset) => (
                <div key={asset.id} className="grid grid-cols-12 gap-2 items-center">
                  <Select
                    value={asset.mediaType}
                    onValueChange={(value: 'image' | 'video' | 'audio') => 
                      updateAsset(asset.id, 'mediaType', value)}
                  >
                    <SelectTrigger className="col-span-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">
                        <div className="flex items-center gap-2">
                          <Image className="h-4 w-4" />
                          Image
                        </div>
                      </SelectItem>
                      <SelectItem value="video">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          Video
                        </div>
                      </SelectItem>
                      <SelectItem value="audio">
                        <div className="flex items-center gap-2">
                          <AudioLines className="h-4 w-4" />
                          Audio
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    className="col-span-6"
                    value={asset.url}
                    onChange={(e) => updateAsset(asset.id, 'url', e.target.value)}
                    placeholder="Asset URL..."
                  />
                  <Input
                    className="col-span-3"
                    value={asset.description || ''}
                    onChange={(e) => updateAsset(asset.id, 'description', e.target.value)}
                    placeholder="Description..."
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeAsset(asset.id)}
                    className="col-span-1"
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addAsset} className="w-full">
                Add Asset
              </Button>
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Analysis Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="step1" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="step1">Step 1</TabsTrigger>
                  <TabsTrigger value="step2">Step 2</TabsTrigger>
                  <TabsTrigger value="step3">Step 3</TabsTrigger>
                  <TabsTrigger value="step4">Step 4</TabsTrigger>
                </TabsList>

                <TabsContent value="step1" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Model Preference</Label>
                    <Select
                      value={options.step1.model_preference}
                      onValueChange={(value) => updateOption('step1', 'model_preference', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto Select</SelectItem>
                        <SelectItem value="llama31_405b">Llama 3.1 405B</SelectItem>
                        <SelectItem value="llama31_70b">Llama 3.1 70B</SelectItem>
                        <SelectItem value="qwen25_72b">Qwen 2.5 72B</SelectItem>
                        <SelectItem value="gemma2_27b">Gemma 2 27B</SelectItem>
                        <SelectItem value="mistral_7b">Mistral 7B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={options.step1.enable_creative_reframing}
                      onCheckedChange={(checked) => updateOption('step1', 'enable_creative_reframing', checked)}
                    />
                    <Label>Enable Creative Reframing</Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Gap Detection Depth</Label>
                    <Select
                      value={options.step1.gap_detection_depth}
                      onValueChange={(value) => updateOption('step1', 'gap_detection_depth', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="step2" className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={options.step2.parallel_processing}
                      onCheckedChange={(checked) => updateOption('step2', 'parallel_processing', checked)}
                    />
                    <Label>Parallel Processing</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={options.step2.enable_fallbacks}
                      onCheckedChange={(checked) => updateOption('step2', 'enable_fallbacks', checked)}
                    />
                    <Label>Enable Fallbacks</Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Quality Threshold: {options.step2.quality_threshold}/10</Label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={options.step2.quality_threshold}
                      onChange={(e) => updateOption('step2', 'quality_threshold', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="step3" className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={options.step3.enable_ai_synthesis}
                      onCheckedChange={(checked) => updateOption('step3', 'enable_ai_synthesis', checked)}
                    />
                    <Label>AI Synthesis</Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Optimization Focus</Label>
                    <Select
                      value={options.step3.optimization_focus}
                      onValueChange={(value) => updateOption('step3', 'optimization_focus', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quality">Quality</SelectItem>
                        <SelectItem value="speed">Speed</SelectItem>
                        <SelectItem value="cost">Cost</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="step4" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Detail Level</Label>
                    <Select
                      value={options.step4.detail_level}
                      onValueChange={(value) => updateOption('step4', 'detail_level', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">Summary</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Target Audience</Label>
                    <Select
                      value={options.step4.target_audience}
                      onValueChange={(value) => updateOption('step4', 'target_audience', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !query.trim()}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing... Step {currentStep + 1}/4
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Complete Analysis
              </>
            )}
          </Button>

          {isAnalyzing && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground text-center">
                Processing pipeline: {Math.round(progress)}% complete
              </p>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {result && (
            <>
              {/* Status */}
              <Alert className={result.success ? "border-green-200" : "border-red-200"}>
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription>
                    {result.success ? (
                      `Analysis completed in ${(result.processing_time_ms / 1000).toFixed(1)}s`
                    ) : (
                      `Analysis failed: ${result.error}`
                    )}
                  </AlertDescription>
                </div>
              </Alert>

              {result.success && (
                <>
                  {/* Executive Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Executive Summary
                        <Button variant="outline" size="sm" onClick={downloadResult}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Project Type</Label>
                          <p className="text-sm">{result.executive_summary?.output_type}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Confidence</Label>
                          <p className="text-sm">{result.executive_summary?.overall_confidence}%</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Quality Score</Label>
                          <p className="text-sm">{result.executive_summary?.quality_score}/10</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Readiness</Label>
                          <Badge variant={
                            result.executive_summary?.production_readiness === 'ready' ? 'default' :
                            result.executive_summary?.production_readiness === 'needs_preparation' ? 'secondary' :
                            'destructive'
                          }>
                            {result.executive_summary?.production_readiness}
                          </Badge>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <Label className="text-sm font-medium">Assets Processed</Label>
                        <p className="text-sm">
                          {result.executive_summary?.assets_processed} total, 
                          {result.executive_summary?.primary_assets_count} primary
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pipeline Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Pipeline Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {result.pipeline_breakdown && Object.entries(result.pipeline_breakdown).map(([step, data]: [string, any]) => (
                          <div key={step} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center gap-2">
                              {data.success ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span className="font-medium">
                                {step.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {(data.processing_time_ms / 1000).toFixed(1)}s
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Full Results */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Complete Analysis Results</CardTitle>
                      <CardDescription>
                        Full structured output from the analysis pipeline
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-96">
                        {JSON.stringify(result.final_analysis, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}

          {!result && !isAnalyzing && (
            <Card>
              <CardContent className="text-center py-8">
                <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Ready to Analyze</h3>
                <p className="text-sm text-muted-foreground">
                  Enter your query and assets, then click "Start Complete Analysis" to begin.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
