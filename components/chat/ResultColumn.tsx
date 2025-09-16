"use client"

import { Image, CheckCircle, AlertCircle, Loader2, Eye, Play, Music, ImageIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import type { BriefPackage } from "@/hooks/useQueryAnalyzer";

interface ResultColumnProps {
  isGenerating: boolean;
  generationSteps: string[];
  currentStep: number;
  finalResult: string | null;
  user?: any;
  currentBrief?: BriefPackage | null;
  analysisError?: string | null;
  userParameters?: {
    mediaType?: string;
    aspectRatio?: string;
    imageCount?: number;
    videoDuration?: number;
  };
  mediaItems?: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
}

export default function ResultColumn({
  isGenerating,
  generationSteps,
  currentStep,
  finalResult,
  user,
  currentBrief,
  analysisError,
  userParameters,
  mediaItems,
}: ResultColumnProps) {

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-gray-800 p-3 bg-background flex-shrink-0">
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            DreamCut Analysis Results
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Error State */}
          {analysisError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Analysis Failed:</strong> {analysisError}
              </AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {isGenerating && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Your Request
                </CardTitle>
                <CardDescription>
                  Processing your query and assets with AI models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {generationSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      {index < currentStep ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      )}
                      <span className={index < currentStep ? "text-green-700 dark:text-green-400" : "text-gray-500"}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success State - Brief Results */}
          {currentBrief && !isGenerating && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Analysis Complete
                  </CardTitle>
                  <CardDescription>
                    Brief ID: {currentBrief.briefId}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* User Parameters Display */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-sm text-blue-800 dark:text-blue-200 mb-2">Your Original Parameters:</h4>
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
                  {mediaItems && mediaItems.some(item => item.description) && (
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
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
                            </div>
                            <div className="text-purple-600 dark:text-purple-400 italic">
                              "{item.description}"
                            </div>
                            <div className="text-xs text-purple-500 dark:text-purple-500 mt-1">
                              ID: {item.id} ✓ Applied to analysis
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Asset Analysis Summary */}
                  <div>
                    <h4 className="font-medium mb-2">Asset Analysis</h4>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        // Handle both new comprehensive format and legacy format
                        const assets = currentBrief.brief?.assets || [];
                        const legacyAnalysis = currentBrief.analysis || {};
                        
                        if (assets.length > 0) {
                          // New comprehensive format
                          return assets.map((asset, index) => {
                            const icon = asset.type === 'image' ? ImageIcon : asset.type === 'video' ? Play : Music;
                            const Icon = icon;
                            
                            return (
                              <Badge key={asset.id || index} variant="secondary" className="flex items-center gap-1">
                                <Icon className="w-3 h-3" />
                                {asset.type}: {asset.filename}
                              </Badge>
                            );
                          });
                        } else {
                          // Legacy format
                          return Object.entries(legacyAnalysis).map(([type, results]) => {
                            if (!results || Object.keys(results).length === 0) return null;
                            
                            const icon = type === 'vision' ? ImageIcon : type === 'video' ? Play : Music;
                            const Icon = icon;
                            
                            return (
                              <Badge key={type} variant="secondary" className="flex items-center gap-1">
                                <Icon className="w-3 h-3" />
                                {type}: {Object.keys(results).length} analyzed
                              </Badge>
                            );
                          });
                        }
                      })()}
                    </div>
                  </div>

                  {/* Creative Options */}
                  <div>
                    <h4 className="font-medium mb-2">Creative Options</h4>
                    <div className="space-y-2">
                      {((currentBrief.brief?.creativeOptions || currentBrief.plan?.creativeOptions || []).slice(0, 3)).map((option, index) => (
                        <div key={option.option_id || index} className="p-3 border rounded-lg">
                          <div className="font-medium text-sm">{option.title || `Option ${index + 1}`}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {option.description || "Creative approach generated"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Processing Plan */}
                  <div>
                    <h4 className="font-medium mb-2">Processing Plan</h4>
                    <div className="space-y-1">
                      {Object.entries(currentBrief.brief?.recommendedPipeline?.preprocessing ? 
                        { 'preprocessing': currentBrief.brief.recommendedPipeline.preprocessing } : 
                        (currentBrief.plan?.assetProcessing || {})).map(([assetUrl, actions]) => (
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
                  {(currentBrief.brief?.metadata?.estimatedCost || currentBrief.plan?.costEstimate || currentBrief.brief?.recommendedPipeline?.costOptimization) && (
                    <div>
                      <h4 className="font-medium mb-2">Cost Estimate</h4>
                      <Badge variant="outline">
                        {typeof (currentBrief.brief?.metadata?.estimatedCost || currentBrief.plan?.costEstimate) === 'number' 
                          ? (currentBrief.brief?.metadata?.estimatedCost || currentBrief.plan?.costEstimate).toFixed(2) + ' credits'
                          : (currentBrief.brief?.recommendedPipeline?.costOptimization?.estimatedCredits || 'Variable based on complexity')
                        }
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Default State - No Analysis Yet */}
          {!currentBrief && !isGenerating && !analysisError && (
            <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                  <Image className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  DreamCut Query Analyzer
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                  Enter your creative request and assets to begin AI-powered analysis
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
