"use client";

import { useState } from "react";
import { useQueryAnalyzer, type MediaAsset } from "@/hooks/useQueryAnalyzer";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { Loader2, CheckCircle, AlertCircle, Plus, X } from "lucide-react";

export default function QueryAnalyzerDemo() {
  const { analyzeQuery, isLoading, error, lastBrief } = useQueryAnalyzer();
  const [query, setQuery] = useState("");
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [newAssetUrl, setNewAssetUrl] = useState("");
  const [newAssetType, setNewAssetType] = useState<"image" | "video" | "audio">("image");
  const [intent, setIntent] = useState<"image" | "video" | "audio" | "mix">("mix");
  const [aspectRatio, setAspectRatio] = useState("16:9");

  const addAsset = () => {
    if (newAssetUrl.trim()) {
      const newAsset: MediaAsset = {
        url: newAssetUrl.trim(),
        mediaType: newAssetType,
        metadata: { addedBy: "demo" },
      };
      setAssets(prev => [...prev, newAsset]);
      setNewAssetUrl("");
    }
  };

  const removeAsset = (index: number) => {
    setAssets(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (!query.trim()) return;

    const request = {
      query: query.trim(),
      assets,
      intent,
      preferences: {
        aspect_ratio: aspectRatio,
        platform_target: "social",
      },
      budget_credits: 0,
    };

    await analyzeQuery(request);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>DreamCut Step 1 - Query Analyzer Demo</CardTitle>
          <CardDescription>
            Test the query analyzer with your own prompts and assets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Query Input */}
          <div className="space-y-2">
            <Label htmlFor="query">Your Creative Request</Label>
            <Textarea
              id="query"
              placeholder="Describe what you want to create... (e.g., 'Create a video about nature with these images')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
            />
          </div>

          {/* Intent Selection */}
          <div className="space-y-2">
            <Label htmlFor="intent">Creative Intent</Label>
            <Select value={intent} onValueChange={(value: any) => setIntent(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Image Generation</SelectItem>
                <SelectItem value="video">Video Creation</SelectItem>
                <SelectItem value="audio">Audio Production</SelectItem>
                <SelectItem value="mix">Mixed Media</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2">
            <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
            <Select value={aspectRatio} onValueChange={setAspectRatio}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                <SelectItem value="9:16">9:16 (Vertical)</SelectItem>
                <SelectItem value="1:1">1:1 (Square)</SelectItem>
                <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                <SelectItem value="21:9">21:9 (Ultrawide)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assets Management */}
          <div className="space-y-4">
            <Label>Media Assets</Label>
            
            {/* Add Asset Form */}
            <div className="flex gap-2">
              <Input
                placeholder="Asset URL (e.g., https://example.com/image.jpg)"
                value={newAssetUrl}
                onChange={(e) => setNewAssetUrl(e.target.value)}
                className="flex-1"
              />
              <Select value={newAssetType} onValueChange={(value: any) => setNewAssetType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addAsset} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Asset List */}
            {assets.length > 0 && (
              <div className="space-y-2">
                <Label>Added Assets ({assets.length})</Label>
                <div className="space-y-2">
                  {assets.map((asset, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{asset.mediaType}</Badge>
                        <span className="text-sm truncate max-w-md">{asset.url}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAsset(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={!query.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Query"
            )}
          </Button>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Results Display */}
          {lastBrief && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Analysis Results
                </CardTitle>
                <CardDescription>
                  Brief ID: {lastBrief.briefId}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* User Query */}
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h4 className="font-medium text-sm text-orange-800 dark:text-orange-200 mb-2">Your Request:</h4>
                  <div className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                    "{lastBrief.request?.query || 'No query provided'}"
                  </div>
                </div>

                {/* Analysis Summary */}
                <div>
                  <h4 className="font-medium mb-2">Analysis Summary</h4>
                  <div className="space-y-3">
                    {Object.entries(lastBrief.analysis).map(([type, results]) => {
                      if (!results || Object.keys(results).length === 0) return null;
                      
                      return (
                        <div key={type} className="border rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-sm capitalize">{type} Analysis</span>
                            <Badge variant="secondary" className="text-xs">
                              {Object.keys(results).length} analyzed
                            </Badge>
                          </div>
                          
                          {/* Show actual analysis results */}
                          {Object.entries(results).map(([assetUrl, result]) => {
                            const analysisData = result?.primary?.value || result?.fallback?.value || result?.value;
                            
                            return (
                              <div key={assetUrl} className="mt-2 p-2 bg-muted rounded text-xs">
                                <div className="font-medium mb-1">Asset Analysis:</div>
                                {analysisData?.analysis && (
                                  <div className="text-muted-foreground whitespace-pre-wrap">
                                    {typeof analysisData.analysis === 'string' 
                                      ? analysisData.analysis 
                                      : JSON.stringify(analysisData.analysis, null, 2)
                                    }
                                  </div>
                                )}
                                {analysisData?.raw?.choices?.[0]?.message?.content && (
                                  <div className="text-muted-foreground whitespace-pre-wrap">
                                    {analysisData.raw.choices[0].message.content}
                                  </div>
                                )}
                                {!analysisData?.analysis && !analysisData?.raw && (
                                  <div className="text-muted-foreground italic">
                                    Analysis completed - detailed results available
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Creative Options */}
                <div>
                  <h4 className="font-medium mb-2">Creative Options</h4>
                  <div className="space-y-3">
                    {lastBrief.plan.creativeOptions.slice(0, 3).map((option, index) => (
                      <div key={option.option_id || index} className="p-3 border rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                        <div className="font-medium text-sm mb-2">{option.title || `Option ${index + 1}`}</div>
                        <div className="text-xs text-muted-foreground mb-2">
                          {option.description || "Creative approach generated"}
                        </div>
                        
                        {/* Show creative direction details */}
                        {option.creative_direction && (
                          <div className="text-xs space-y-1">
                            <div><span className="font-medium">Opening:</span> {option.creative_direction.opening_strategy}</div>
                            <div><span className="font-medium">Style:</span> {option.creative_direction.visual_treatment}</div>
                            <div><span className="font-medium">Pacing:</span> {option.creative_direction.pacing}</div>
                            <div><span className="font-medium">Transitions:</span> {option.creative_direction.transitions}</div>
                          </div>
                        )}
                        
                        {/* Show asset usage strategy */}
                        {option.asset_usage && (
                          <div className="text-xs mt-2 p-2 bg-white/50 dark:bg-black/20 rounded">
                            <div className="font-medium mb-1">Asset Strategy:</div>
                            <div>Primary: {option.asset_usage.primary_asset ? 'Selected' : 'Auto-select'}</div>
                            <div>Enhancements: {option.asset_usage.enhancement_needs?.join(', ') || 'Standard processing'}</div>
                          </div>
                        )}
                        
                        {/* Show engagement target */}
                        {option.target_engagement && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              Target: {option.target_engagement} engagement
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Processing Plan */}
                <div>
                  <h4 className="font-medium mb-2">Processing Plan</h4>
                  <div className="space-y-1">
                    {Object.entries(lastBrief.plan.assetProcessing).map(([assetUrl, actions]) => (
                      <div key={assetUrl} className="text-sm">
                        <span className="font-medium">Asset:</span>
                        <span className="ml-2 text-muted-foreground">
                          {actions.join(', ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Estimate */}
                {lastBrief.plan.costEstimate && (
                  <div>
                    <h4 className="font-medium mb-2">Cost Estimate</h4>
                    <Badge variant="outline">
                      {lastBrief.plan.costEstimate.toFixed(2)} credits
                    </Badge>
                  </div>
                )}

                {/* Raw Brief Data */}
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium">View Raw Brief Data</summary>
                  <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto max-h-64">
                    {JSON.stringify(lastBrief, null, 2)}
                  </pre>
                </details>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
