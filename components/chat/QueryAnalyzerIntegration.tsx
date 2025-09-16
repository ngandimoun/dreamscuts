"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useQueryAnalyzer, type MediaAsset, type BriefPackage } from "@/hooks/useQueryAnalyzer";
import { MediaItem } from "./mediaTypes";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Loader2, CheckCircle, AlertCircle, Eye, Play, Music, Image as ImageIcon } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

interface QueryAnalyzerIntegrationProps {
  query: string;
  mediaItems: MediaItem[];
  userParameters?: {
    mediaType?: string;
    aspectRatio?: string;
    imageCount?: number;
    videoDuration?: number;
  };
  onAnalysisComplete: (brief: BriefPackage) => void;
  onError: (error: string) => void;
}

export default function QueryAnalyzerIntegration({
  query,
  mediaItems,
  userParameters,
  onAnalysisComplete,
  onError,
}: QueryAnalyzerIntegrationProps) {
  const { analyzeQuery, isLoading, error, lastBrief } = useQueryAnalyzer();
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const currentRequestRef = useRef<string | null>(null);

  // Convert MediaItem[] to MediaAsset[] - ensuring exact asset-description matching
  const convertToMediaAssets = useCallback((items: MediaItem[]): MediaAsset[] => {
    return items.map((item) => {
      // Log for debugging: ensure description is preserved for each specific asset
      console.log(`[QueryAnalyzerIntegration] Converting MediaItem ${item.id}:`, {
        name: item.name,
        type: item.type,
        url: item.url,
        description: item.description || 'NO DESCRIPTION'
      });
      
      return {
        id: item.id,
        url: item.url,
        mediaType: item.type as 'image' | 'video' | 'audio',
        metadata: {
          filename: item.name,
          size: item.fileSize,
          duration: item.duration,
          description: item.description, // Include user's description - exact matching
          width: item.width,
          height: item.height,
          mimeType: item.mimeType,
          source: item.source,
          originalMediaItemId: item.id, // Track original ID for verification
          ...item.metadata,
        },
      };
    });
  }, []);

  // Start analysis when component mounts or when query/media changes
  useEffect(() => {
    if (query.trim() && !analysisStarted && !isLoading) {
      startAnalysis();
    }
  }, [query, mediaItems, analysisStarted, isLoading]);

  // Debug: Log user parameters when they change
  useEffect(() => {
    console.log('[QueryAnalyzerIntegration] User parameters received:', userParameters);
  }, [userParameters]);

  const startAnalysis = useCallback(async () => {
    if (!query.trim()) {
      onError("Query is required for analysis");
      return;
    }

    // Generate unique request ID to prevent duplicates
    const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    
    // Check if we already have a request in progress
    if (currentRequestRef.current) {
      console.log(`[QueryAnalyzerIntegration] Request ${requestId} cancelled - already processing ${currentRequestRef.current}`);
      return;
    }

    currentRequestRef.current = requestId;
    setCurrentRequestId(requestId);
    setAnalysisStarted(true);
    console.log(`[QueryAnalyzerIntegration] Starting analysis with request ID: ${requestId}`);

    try {
      // Determine intent based on user parameters
      let intent: "image" | "video" | "audio" | "mix" = "mix";
      if (userParameters?.mediaType) {
        if (userParameters.mediaType === "image") intent = "image";
        else if (userParameters.mediaType === "video") intent = "video";
        else if (userParameters.mediaType === "audio") intent = "audio";
      }

      // Validate and clamp parameters to valid ranges
      const validatedImageCount = userParameters?.imageCount 
        ? Math.max(1, Math.min(20, userParameters.imageCount)) // Clamp between 1-20
        : (intent === "image" ? 1 : undefined);
      
      const validatedVideoDuration = userParameters?.videoDuration 
        ? Math.max(5, Math.min(180, userParameters.videoDuration)) // Clamp between 5-180
        : (intent === "video" ? 5 : undefined);

      const request = {
        query: query.trim(),
        assets: convertToMediaAssets(mediaItems),
        intent,
        outputImages: validatedImageCount,
        outputVideoSeconds: validatedVideoDuration,
        preferences: {
          aspect_ratio: userParameters?.aspectRatio || "16:9",
          platform_target: "social", // Default platform
        },
      };

      // Debug: Log the specific output parameters being sent
      console.log('[QueryAnalyzerIntegration] API Request parameters:', {
        intent,
        outputImages: request.outputImages,
        outputVideoSeconds: request.outputVideoSeconds,
        aspectRatio: request.preferences.aspect_ratio,
        validation: {
          originalImageCount: userParameters?.imageCount,
          validatedImageCount: validatedImageCount,
          originalVideoDuration: userParameters?.videoDuration,
          validatedVideoDuration: validatedVideoDuration
        },
        userParameters
      });

      const result = await analyzeQuery(request);

      if (result.success && result.brief) {
        console.log(`[QueryAnalyzerIntegration] Request ${requestId} completed successfully`);
        onAnalysisComplete(result.brief);
      } else {
        console.log(`[QueryAnalyzerIntegration] Request ${requestId} failed:`, result.error);
        onError(result.error || "Analysis failed");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      console.log(`[QueryAnalyzerIntegration] Request ${requestId} error:`, errorMessage);
      onError(errorMessage);
    } finally {
      currentRequestRef.current = null;
      setCurrentRequestId(null);
    }
  }, [query, mediaItems, convertToMediaAssets, analyzeQuery, onAnalysisComplete, onError]);

  // Show loading state
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing Your Request
          </CardTitle>
          <CardDescription>
            Processing your query and assets to create the perfect creative brief
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* User Parameters Display */}
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-sm text-blue-800 dark:text-blue-200 mb-2">Your Parameters:</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                Type: {userParameters?.mediaType || 'Not set'}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Aspect: {userParameters?.aspectRatio || 'Not set'}
              </Badge>
              {userParameters?.mediaType === 'image' && (
                <Badge variant="outline" className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                  Output: {userParameters?.imageCount || 1} image{(userParameters?.imageCount || 1) !== 1 ? 's' : ''} (1-20 range)
                </Badge>
              )}
              {userParameters?.mediaType === 'video' && (
                <Badge variant="outline" className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                  Output: {userParameters?.videoDuration || 5}s video (5-180s range)
                </Badge>
              )}
              {userParameters?.mediaType === 'audio' && (
                <Badge variant="outline" className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                  Output: Audio generation
                </Badge>
              )}
            </div>
            {/* Debug info */}
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Debug: {JSON.stringify(userParameters || {})}
            </div>
          </div>

          {/* Media Descriptions Display - showing exact asset-description matching */}
          {mediaItems.some(item => item.description) && (
            <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-medium text-sm text-purple-800 dark:text-purple-200 mb-2">
                Asset Descriptions (Exact Matching):
              </h4>
              <div className="space-y-3">
                {mediaItems.filter(item => item.description).map((item, index) => (
                  <div key={item.id} className="text-xs p-2 bg-white dark:bg-gray-800 rounded border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                        Asset {index + 1}
                      </Badge>
                      <span className="font-medium text-purple-700 dark:text-purple-300">
                        {item.name}
                      </span>
                      <span className="text-purple-500 dark:text-purple-400">
                        ({item.type})
                      </span>
                    </div>
                    <div className="text-purple-600 dark:text-purple-400 italic">
                      "{item.description}"
                    </div>
                    <div className="text-xs text-purple-500 dark:text-purple-500 mt-1">
                      ID: {item.id}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing {mediaItems.length} asset{mediaItems.length !== 1 ? 's' : ''}...
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating creative options...
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Building processing plan...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Analysis Failed:</strong> {error}
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={() => {
              setAnalysisStarted(false);
              startAnalysis();
            }}
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Show success state with brief details
  if (lastBrief) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Analysis Complete
          </CardTitle>
          <CardDescription>
            Brief ID: {lastBrief.briefId}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User Query Display */}
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <h4 className="font-medium text-sm text-orange-800 dark:text-orange-200 mb-2">Your Request:</h4>
            <div className="text-sm text-orange-700 dark:text-orange-300 font-medium">
              "{query}"
            </div>
          </div>

          {/* User Parameters Display */}
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-medium text-sm text-green-800 dark:text-green-200 mb-2">Applied Parameters:</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                Type: {userParameters?.mediaType || 'Not set'}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Aspect: {userParameters?.aspectRatio || 'Not set'}
              </Badge>
              {userParameters?.mediaType === 'image' && (
                <Badge variant="outline" className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                  ✓ Output: {userParameters?.imageCount || 1} image{(userParameters?.imageCount || 1) !== 1 ? 's' : ''} (1-20 range)
                </Badge>
              )}
              {userParameters?.mediaType === 'video' && (
                <Badge variant="outline" className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                  ✓ Output: {userParameters?.videoDuration || 5}s video (5-180s range)
                </Badge>
              )}
              {userParameters?.mediaType === 'audio' && (
                <Badge variant="outline" className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                  ✓ Output: Audio generation
                </Badge>
              )}
            </div>
            {/* Debug info */}
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Debug: {JSON.stringify(userParameters || {})}
            </div>
          </div>

          {/* Media Descriptions Display - showing exact asset-description matching */}
          {mediaItems.some(item => item.description) && (
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-medium text-sm text-purple-800 dark:text-purple-200 mb-2">
                Asset Descriptions Used (Exact Matching):
              </h4>
              <div className="space-y-3">
                {mediaItems.filter(item => item.description).map((item, index) => (
                  <div key={item.id} className="text-xs p-2 bg-white dark:bg-gray-800 rounded border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                        Asset {index + 1}
                      </Badge>
                      <span className="font-medium text-purple-700 dark:text-purple-300">
                        {item.name}
                      </span>
                      <span className="text-purple-500 dark:text-purple-400">
                        ({item.type})
                      </span>
                    </div>
                    <div className="text-purple-600 dark:text-purple-400 italic">
                      "{item.description}"
                    </div>
                    <div className="text-xs text-purple-500 dark:text-purple-500 mt-1">
                      ID: {item.id} ✓ Used in analysis
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Query Analysis */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-sm text-blue-800 dark:text-blue-200 mb-2">Query Analysis</h4>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <div className="mb-2">
                <span className="font-medium">User Intent:</span> {lastBrief.request?.query || 'No query provided'}
              </div>
              {lastBrief.analysis?.intent && (
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  <span className="font-medium">Detected Intent:</span> {lastBrief.analysis.intent.user_intent || 'General content creation'}
                </div>
              )}
            </div>
          </div>

          {/* Asset Analysis with Descriptions */}
          <div>
            <h4 className="font-medium mb-2">Asset Analysis</h4>
            <div className="space-y-3">
              {Object.entries(lastBrief.analysis).map(([type, results]) => {
                if (!results || Object.keys(results).length === 0) return null;
                
                const icon = type === 'vision' ? ImageIcon : type === 'video' ? Play : Music;
                const Icon = icon;
                
                return (
                  <div key={type} className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4" />
                      <span className="font-medium text-sm capitalize">{type} Analysis</span>
                      <Badge variant="secondary" className="text-xs">
                        {Object.keys(results).length} analyzed
                      </Badge>
                    </div>
                    
                    {/* Show actual analysis results */}
                    {Object.entries(results).map(([assetUrl, result]) => {
                      const asset = mediaItems.find(item => item.url === assetUrl);
                      const analysisData = result?.primary?.value || result?.fallback?.value || result?.value;
                      
                      return (
                        <div key={assetUrl} className="mt-2 p-2 bg-muted rounded text-xs">
                          <div className="font-medium mb-1">
                            {asset?.filename || asset?.name || 'Asset'}: 
                          </div>
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
                              Analysis completed - detailed results available in full brief
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
              {Object.entries(lastBrief.plan.assetProcessing).map(([assetUrl, actions]) => {
                const asset = mediaItems.find(item => item.url === assetUrl);
                return (
                  <div key={assetUrl} className="text-sm">
                    <span className="font-medium">{asset?.filename || 'Asset'}:</span>
                    <span className="ml-2 text-muted-foreground">
                      {actions.join(', ')}
                    </span>
                  </div>
                );
              })}
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

          <Button
            onClick={() => onAnalysisComplete(lastBrief)}
            className="w-full"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Full Brief
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Default state - show start button
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ready to Analyze</CardTitle>
        <CardDescription>
          Click to start analyzing your query and assets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={startAnalysis}
          disabled={!query.trim()}
          className="w-full"
        >
          Start Analysis
        </Button>
      </CardContent>
    </Card>
  );
}
