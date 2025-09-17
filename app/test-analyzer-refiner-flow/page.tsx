'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CheckCircle, XCircle, Zap, Brain, Palette, ArrowRight } from 'lucide-react';

export default function TestAnalyzerRefinerFlowPage() {
  const [query, setQuery] = useState('explain how machine learning works in a simple tutorial');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSteps, setShowSteps] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setShowSteps(true);

    try {
      const response = await fetch('/api/dreamcut/query-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          assets: [],
          intent: 'video',
          outputVideoSeconds: 60,
          preferences: {
            aspect_ratio: '16:9',
            platform_target: 'youtube'
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getCreativeProfileInfo = (result: any) => {
    if (!result) return null;
    
    // Check if this looks like it went through the refiner
    const hasEnhancedCreativeDirection = result.creative_direction?.core_concept?.includes('Create clear, educational content') ||
                                       result.creative_direction?.core_concept?.includes('Create high-energy, stylized content') ||
                                       result.creative_direction?.core_concept?.includes('Create casual, authentic content');
    
    if (hasEnhancedCreativeDirection) {
      return {
        detected: true,
        type: 'Educational Explainer',
        description: 'Content was automatically refined with educational profile'
      };
    }
    
    return {
      detected: false,
      type: 'General',
      description: 'Content used general refinement'
    };
  };

  const profileInfo = getCreativeProfileInfo(result);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🔄 Analyzer → Refiner Flow Test</h1>
        <p className="text-muted-foreground">
          Test the complete flow: Query Analyzer automatically calls Refiner with Creative Profiles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle>📝 Test Query</CardTitle>
            <CardDescription>
              Enter a query to test the complete analyzer → refiner flow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[100px]"
              placeholder="Enter your query here..."
            />
            <Button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing & Refining...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Start Complete Flow
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Flow Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>🔄 Flow Steps</CardTitle>
            <CardDescription>
              The complete analyzer → refiner flow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Query Analyzer</h4>
                  <p className="text-sm text-muted-foreground">Analyzes user query and generates CLEAN RICH JSON OUTPUT</p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Creative Profile Detection</h4>
                  <p className="text-sm text-muted-foreground">Detects appropriate creative profile based on content analysis</p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Refiner Enhancement</h4>
                  <p className="text-sm text-muted-foreground">Applies creative profile and enhances the JSON output</p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-green-50">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Enhanced Output</h4>
                  <p className="text-sm text-muted-foreground">Returns refined JSON with creative profile applied</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {error && (
        <Card className="mt-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-red-600 mt-1">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="mt-6 space-y-6">
          {/* Creative Profile Detection */}
          <Card>
            <CardHeader>
              <CardTitle>🎨 Creative Profile Detection</CardTitle>
              <CardDescription>
                Which creative profile was automatically detected and applied
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`p-4 border rounded-lg ${profileInfo?.detected ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {profileInfo?.detected ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Zap className="h-5 w-5 text-yellow-600" />
                  )}
                  <h3 className="font-medium">{profileInfo?.type} Profile</h3>
                </div>
                <p className="text-sm text-muted-foreground">{profileInfo?.description}</p>
                {profileInfo?.detected && (
                  <Badge className="mt-2 bg-green-100 text-green-800">Creative Profile Applied</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Creative Direction */}
          <Card>
            <CardHeader>
              <CardTitle>✨ Enhanced Creative Direction</CardTitle>
              <CardDescription>
                How the refiner enhanced the creative direction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Core Concept</h4>
                  <p className="text-sm text-muted-foreground">{result.creative_direction?.core_concept}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Visual Approach</h4>
                  <p className="text-sm text-muted-foreground">{result.creative_direction?.visual_approach}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Style Direction</h4>
                  <p className="text-sm text-muted-foreground">{result.creative_direction?.style_direction}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Mood & Atmosphere</h4>
                  <p className="text-sm text-muted-foreground">{result.creative_direction?.mood_atmosphere}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Enhanced Recommendations</CardTitle>
              <CardDescription>
                Profile-specific recommendations added by the refiner
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.recommendations?.map((rec: any, index: number) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={rec.priority === 'required' ? 'destructive' : 'secondary'}>
                        {rec.priority}
                      </Badge>
                      <span className="font-medium text-sm">{rec.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Full Result */}
          <Card>
            <CardHeader>
              <CardTitle>📄 Complete Refined Output</CardTitle>
              <CardDescription>
                The complete JSON output after analyzer → refiner flow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="formatted" className="w-full">
                <TabsList>
                  <TabsTrigger value="formatted">Formatted</TabsTrigger>
                  <TabsTrigger value="raw">Raw JSON</TabsTrigger>
                </TabsList>
                <TabsContent value="formatted" className="mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">User Request</h4>
                        <div className="text-sm space-y-1">
                          <p><strong>Prompt:</strong> {result.user_request?.original_prompt}</p>
                          <p><strong>Intent:</strong> {result.user_request?.intent}</p>
                          <p><strong>Duration:</strong> {result.user_request?.duration_seconds}s</p>
                          <p><strong>Platform:</strong> {result.user_request?.platform}</p>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Quality Metrics</h4>
                        <div className="text-sm space-y-1">
                          <p><strong>Confidence:</strong> {Math.round((result.quality_metrics?.overall_confidence || 0) * 100)}%</p>
                          <p><strong>Analysis Quality:</strong> {result.quality_metrics?.analysis_quality}/10</p>
                          <p><strong>Feasibility:</strong> {Math.round((result.quality_metrics?.feasibility_score || 0) * 100)}%</p>
                          <p><strong>Status:</strong> {result.quality_metrics?.completion_status}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="raw" className="mt-4">
                  <Textarea
                    value={JSON.stringify(result, null, 2)}
                    readOnly
                    className="min-h-[400px] font-mono text-sm"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      {!isLoading && !error && !result && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Enter a query and click "Start Complete Flow" to test the analyzer → refiner integration!</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
