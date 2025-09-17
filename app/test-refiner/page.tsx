/**
 * Test Refiner Integration Page
 * 
 * This page demonstrates the Step 2a: Refiner = Polished JSON Upgrade
 * by taking sample analyzer JSON and showing the refined output.
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';

// Sample analyzer JSON (from the example in the user's request)
const SAMPLE_ANALYZER_JSON = {
  "id": "dq_sample_001",
  "user_request": {
    "original_prompt": "build a vid with these",
    "intent": "image",
    "aspect_ratio": "Smart Auto",
    "platform": "social",
    "image_count": 1
  },
  "assets": [
    {
      "id": "ast_ima01",
      "type": "image",
      "user_description": "use her as main character",
      "ai_caption": "A young woman in graduation gown...",
      "objects_detected": ["person", "car"],
      "style": "unknown",
      "mood": "happy",
      "quality_score": 0.6,
      "role": "primary source footage"
    }
  ],
  "global_analysis": {
    "goal": "Create a social media video",
    "constraints": {
      "aspect_ratio": "Smart Auto",
      "platform": "social"
    }
  },
  "creative_options": [
    {
      "id": "opt_1",
      "title": "Standard Approach",
      "short": "Basic video creation",
      "reasons": ["Simple", "Fast"],
      "estimatedWorkload": "low"
    }
  ],
  "creative_direction": {
    "core_concept": "Create engaging content",
    "visual_approach": "Professional styling",
    "style_direction": "Modern and clean",
    "mood_atmosphere": "Positive and energetic"
  },
  "production_pipeline": {
    "workflow_steps": ["Process assets", "Apply styling", "Export"],
    "estimated_time": "15-30 minutes",
    "success_probability": 0.8
  },
  "quality_metrics": {
    "overall_confidence": 0.7,
    "analysis_quality": 6,
    "completion_status": "partial",
    "feasibility_score": 0.75
  },
  "challenges": [
    {
      "type": "quality",
      "description": "Some assets need enhancement",
      "impact": "moderate"
    }
  ],
  "recommendations": [
    {
      "type": "quality",
      "recommendation": "Enhance asset quality",
      "priority": "recommended"
    }
  ]
};

interface RefinerResult {
  // The bulletproof refiner returns the validated JSON directly
  user_request?: any;
  prompt_analysis?: any;
  assets?: any[];
  global_analysis?: any;
  creative_options?: any[];
  creative_direction?: any;
  production_pipeline?: any;
  quality_metrics?: any;
  challenges?: any[];
  recommendations?: any[];
  // Error case
  error?: string;
}

export default function TestRefinerPage() {
  const [analyzerJson, setAnalyzerJson] = useState(JSON.stringify(SAMPLE_ANALYZER_JSON, null, 2));
  const [refinerResult, setRefinerResult] = useState<RefinerResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefine = async () => {
    setIsLoading(true);
    setError(null);
    setRefinerResult(null);

    try {
      // Parse the analyzer JSON
      const parsedAnalyzerJson = JSON.parse(analyzerJson);

      // Call the bulletproof refiner API (returns validated JSON directly)
      const response = await fetch('/api/dreamcut/refiner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedAnalyzerJson), // Direct analyzer JSON
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Refiner API failed');
      }

      // The bulletproof refiner returns the validated JSON directly
      setRefinerResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = () => {
    setAnalyzerJson(JSON.stringify(SAMPLE_ANALYZER_JSON, null, 2));
    setRefinerResult(null);
    setError(null);
  };

  const handleClear = () => {
    setAnalyzerJson('');
    setRefinerResult(null);
    setError(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🔧 DreamCut Refiner Test</h1>
        <p className="text-muted-foreground">
          Step 2a: Polished JSON Upgrade - Test the refiner system that upgrades raw analyzer JSON
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Analyzer JSON Input
            </CardTitle>
            <CardDescription>
              Paste the CLEAN RICH JSON OUTPUT from the query-analyzer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={handleLoadSample} variant="outline" size="sm">
                Load Sample
              </Button>
              <Button onClick={handleClear} variant="outline" size="sm">
                Clear
              </Button>
            </div>
            
            <Textarea
              value={analyzerJson}
              onChange={(e) => setAnalyzerJson(e.target.value)}
              placeholder="Paste your analyzer JSON here..."
              className="min-h-[400px] font-mono text-sm"
            />
            
            <Button 
              onClick={handleRefine} 
              disabled={isLoading || !analyzerJson.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refining JSON...
                </>
              ) : (
                '🔧 Refine JSON'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {refinerResult?.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : error ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : (
                <Clock className="h-5 w-5" />
              )}
              Refined JSON Output
            </CardTitle>
            <CardDescription>
              Polished, confident, production-ready JSON
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Processing with AI models...</span>
              </div>
            )}

            {error && (
              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="h-4 w-4" />
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            )}

            {refinerResult && !refinerResult.error && (
              <div className="space-y-4">
                {/* Refined JSON */}
                <Tabs defaultValue="formatted" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="formatted">Formatted</TabsTrigger>
                    <TabsTrigger value="raw">Raw</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="formatted" className="mt-4">
                    <div className="bg-gray-50 p-4 rounded-lg max-h-[500px] overflow-auto">
                      <pre className="text-sm font-mono whitespace-pre-wrap">
                        {JSON.stringify(refinerResult, null, 2)}
                      </pre>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="raw" className="mt-4">
                    <Textarea
                      value={JSON.stringify(refinerResult)}
                      readOnly
                      className="min-h-[400px] font-mono text-sm"
                    />
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {!isLoading && !error && !refinerResult && (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Click "Refine JSON" to process the analyzer output</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Key Improvements Section */}
      {refinerResult && !refinerResult.error && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>🎯 Key Improvements Made</CardTitle>
            <CardDescription>
              The refiner has upgraded your analyzer JSON with these enhancements:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">✨ Smarter Prompts</h4>
                <p className="text-sm text-muted-foreground">
                  Reformulated prompts are now bound to actual asset context
                </p>
                {refinerResult.prompt_analysis?.reformulated_prompt && (
                  <p className="text-xs mt-2 p-2 bg-blue-50 rounded">
                    "{refinerResult.prompt_analysis.reformulated_prompt}"
                  </p>
                )}
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">🎯 Confident Direction</h4>
                <p className="text-sm text-muted-foreground">
                  No more placeholders - all creative direction is confident and specific
                </p>
                {refinerResult.creative_direction?.core_concept && (
                  <p className="text-xs mt-2 p-2 bg-green-50 rounded">
                    "{refinerResult.creative_direction.core_concept}"
                  </p>
                )}
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">📊 Tiered Recommendations</h4>
                <p className="text-sm text-muted-foreground">
                  Required vs recommended actions based on quality scores
                </p>
                {refinerResult.recommendations && (
                  <div className="text-xs mt-2 space-y-1">
                    {refinerResult.recommendations.map((rec, i) => (
                      <div key={i} className={`p-2 rounded ${rec.priority === 'required' ? 'bg-red-50' : 'bg-yellow-50'}`}>
                        <span className="font-medium">{rec.priority}:</span> {rec.recommendation}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">🔄 Normalized Roles</h4>
                <p className="text-sm text-muted-foreground">
                  Asset roles are standardized and consistent
                </p>
                {refinerResult.assets && (
                  <div className="text-xs mt-2 space-y-1">
                    {refinerResult.assets.map((asset, i) => (
                      <div key={i} className="p-2 bg-purple-50 rounded">
                        <span className="font-medium">{asset.id}:</span> {asset.role}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">⚡ Conflict Detection</h4>
                <p className="text-sm text-muted-foreground">
                  Identifies and resolves aspect ratio, duration, and quality conflicts
                </p>
                {refinerResult.global_analysis?.conflicts && (
                  <div className="text-xs mt-2 space-y-1">
                    {refinerResult.global_analysis.conflicts.map((conflict, i) => (
                      <div key={i} className="p-2 bg-orange-50 rounded">
                        <span className="font-medium">{conflict.severity}:</span> {conflict.issue}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">🛡️ Schema Validation</h4>
                <p className="text-sm text-muted-foreground">
                  Zod ensures JSON safety before storing in Supabase
                </p>
                <div className="text-xs mt-2 p-2 bg-green-50 rounded">
                  ✅ Validated and stored successfully
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>📚 API Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Endpoint</h4>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                POST /api/dreamcut/refiner
              </code>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Models Used</h4>
              <div className="flex gap-2">
                <Badge variant="default">Claude 3 Haiku (Primary)</Badge>
                <Badge variant="secondary">GPT-4o-mini (Fallback)</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Fast, structured JSON generation with Claude 3 Haiku</li>
                <li>• Reliable fallback with GPT-4o-mini</li>
                <li>• Zod validation for JSON safety</li>
                <li>• Supabase storage integration</li>
                <li>• Automatic conflict detection and resolution</li>
                <li>• Tiered recommendation system</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
