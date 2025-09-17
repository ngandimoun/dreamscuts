'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CheckCircle, XCircle, Clock, Zap, Image, Video, Music, Layers } from 'lucide-react';
import { generateRefinerPrompt, getPromptStats, analyzeAssetMix } from '@/lib/analyzer/refiner-prompt-library';

// Test cases for different asset mixes
const TEST_CASES = {
  imageOnly: {
    name: '🖼️ Image Only',
    description: 'Single image asset for social media post',
    analyzerJson: {
      id: 'dq_img_001',
      user_request: {
        original_prompt: 'make a social media post with this image',
        intent: 'image',
        aspect_ratio: '1:1',
        platform: 'instagram'
      },
      assets: [
        {
          id: 'ast_img01',
          type: 'image',
          user_description: 'use this as the main image',
          ai_caption: 'A beautiful sunset over mountains',
          objects_detected: ['mountain', 'sunset', 'sky'],
          style: 'landscape',
          mood: 'peaceful',
          quality_score: 0.8,
          role: 'primary image'
        }
      ],
      global_analysis: {
        goal: 'Create an Instagram post',
        constraints: { aspect_ratio: '1:1', platform: 'instagram' }
      }
    }
  },
  
  videoOnly: {
    name: '🎥 Video Only',
    description: 'Single video for TikTok content',
    analyzerJson: {
      id: 'dq_vid_001',
      user_request: {
        original_prompt: 'create a tiktok video with this footage',
        intent: 'video',
        duration_seconds: 30,
        aspect_ratio: '9:16',
        platform: 'tiktok'
      },
      assets: [
        {
          id: 'ast_vid01',
          type: 'video',
          user_description: 'use this as the main video',
          ai_caption: 'A person dancing to upbeat music',
          objects_detected: ['person', 'dance', 'music'],
          style: 'dynamic',
          mood: 'energetic',
          quality_score: 0.7,
          role: 'primary footage'
        }
      ],
      global_analysis: {
        goal: 'Create a TikTok dance video',
        constraints: { duration_seconds: 30, aspect_ratio: '9:16', platform: 'tiktok' }
      }
    }
  },
  
  audioOnly: {
    name: '🔊 Audio Only',
    description: 'Music track for podcast intro',
    analyzerJson: {
      id: 'dq_aud_001',
      user_request: {
        original_prompt: 'create a podcast intro with this music',
        intent: 'audio',
        duration_seconds: 15,
        platform: 'podcast'
      },
      assets: [
        {
          id: 'ast_aud01',
          type: 'audio',
          user_description: 'use this as background music',
          ai_caption: 'Upbeat instrumental music with electronic elements',
          objects_detected: ['music', 'electronic', 'beat'],
          style: 'electronic',
          mood: 'upbeat',
          quality_score: 0.9,
          role: 'background music'
        }
      ],
      global_analysis: {
        goal: 'Create a podcast intro',
        constraints: { duration_seconds: 15, platform: 'podcast' }
      }
    }
  },
  
  mixedMedia: {
    name: '🎬 Mixed Media',
    description: 'Images + Video + Audio for YouTube video',
    analyzerJson: {
      id: 'dq_mix_001',
      user_request: {
        original_prompt: 'create a youtube video with these assets',
        intent: 'video',
        duration_seconds: 120,
        aspect_ratio: '16:9',
        platform: 'youtube'
      },
      assets: [
        {
          id: 'ast_vid01',
          type: 'video',
          user_description: 'main video footage',
          ai_caption: 'A person explaining something in front of a whiteboard',
          objects_detected: ['person', 'whiteboard', 'explanation'],
          style: 'educational',
          mood: 'informative',
          quality_score: 0.8,
          role: 'primary footage'
        },
        {
          id: 'ast_img01',
          type: 'image',
          user_description: 'intro slide',
          ai_caption: 'A title slide with the topic name',
          objects_detected: ['text', 'title', 'slide'],
          style: 'clean',
          mood: 'professional',
          quality_score: 0.9,
          role: 'intro slide'
        },
        {
          id: 'ast_aud01',
          type: 'audio',
          user_description: 'background music',
          ai_caption: 'Soft background music for educational content',
          objects_detected: ['music', 'ambient', 'soft'],
          style: 'ambient',
          mood: 'calm',
          quality_score: 0.7,
          role: 'background music'
        }
      ],
      global_analysis: {
        goal: 'Create an educational YouTube video',
        constraints: { duration_seconds: 120, aspect_ratio: '16:9', platform: 'youtube' }
      }
    }
  }
};

export default function TestPromptLibraryPage() {
  const [selectedTestCase, setSelectedTestCase] = useState<keyof typeof TEST_CASES>('imageOnly');
  const [analyzerJson, setAnalyzerJson] = useState(JSON.stringify(TEST_CASES.imageOnly.analyzerJson, null, 2));
  const [promptResult, setPromptResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestCaseSelect = (testCase: keyof typeof TEST_CASES) => {
    setSelectedTestCase(testCase);
    setAnalyzerJson(JSON.stringify(TEST_CASES[testCase].analyzerJson, null, 2));
    setPromptResult(null);
    setError(null);
  };

  const handleGeneratePrompt = async () => {
    setIsLoading(true);
    setError(null);
    setPromptResult(null);

    try {
      const parsedAnalyzerJson = JSON.parse(analyzerJson);
      
      // Generate context-aware prompt
      const { prompt, assetMix, templateUsed } = generateRefinerPrompt(parsedAnalyzerJson);
      const promptStats = getPromptStats(parsedAnalyzerJson);
      
      setPromptResult({
        prompt,
        assetMix,
        templateUsed,
        promptStats,
        promptLength: prompt.length,
        estimatedTokens: Math.ceil(prompt.length / 4) // Rough estimate
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getAssetIcon = (assetType: string) => {
    switch (assetType) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      default: return <Layers className="h-4 w-4" />;
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'complex': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🎯 Refiner Prompt Library Test</h1>
        <p className="text-muted-foreground">
          Test the context-aware prompt system that selects the right specialized prompt
          based on asset mix (images, video, audio) to ensure the refiner never confuses contexts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Test Cases Selection */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Test Cases</CardTitle>
            <CardDescription>
              Select different asset mixes to see how the prompt library adapts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(TEST_CASES).map(([key, testCase]) => (
              <div
                key={key}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTestCase === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleTestCaseSelect(key as keyof typeof TEST_CASES)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium">{testCase.name}</h3>
                  {selectedTestCase === key && <CheckCircle className="h-4 w-4 text-blue-500" />}
                </div>
                <p className="text-sm text-muted-foreground">{testCase.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Analyzer JSON Input */}
        <Card>
          <CardHeader>
            <CardTitle>📄 Analyzer JSON Input</CardTitle>
            <CardDescription>
              Current test case: {TEST_CASES[selectedTestCase].name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={analyzerJson}
              onChange={(e) => setAnalyzerJson(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              placeholder="Analyzer JSON will appear here..."
            />
            <Button
              onClick={handleGeneratePrompt}
              disabled={isLoading}
              className="mt-4 w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Prompt...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Context-Aware Prompt
                </>
              )}
            </Button>
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

      {promptResult && (
        <div className="mt-6 space-y-6">
          {/* Asset Mix Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>🔍 Asset Mix Analysis</CardTitle>
              <CardDescription>
                How the prompt library analyzed your asset mix
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Asset Types</h4>
                  <div className="flex gap-2 flex-wrap">
                    {promptResult.assetMix.assetTypes.map((type: string, index: number) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {getAssetIcon(type)}
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Template Selected</h4>
                  <Badge variant="secondary" className="text-sm">
                    {promptResult.templateUsed}
                  </Badge>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Complexity</h4>
                  <Badge className={getComplexityColor(promptResult.promptStats.complexity)}>
                    {promptResult.promptStats.complexity}
                  </Badge>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Processing Stats</h4>
                  <div className="space-y-1 text-sm">
                    <div>Total Assets: {promptResult.assetMix.totalAssets}</div>
                    <div>Estimated Time: {promptResult.promptStats.estimatedProcessingTime}</div>
                    <div>Prompt Length: {promptResult.promptLength.toLocaleString()} chars</div>
                    <div>Estimated Tokens: {promptResult.estimatedTokens.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Asset Breakdown</h4>
                  <div className="space-y-1 text-sm">
                    <div>Images: {promptResult.assetMix.hasImages ? '✅' : '❌'}</div>
                    <div>Video: {promptResult.assetMix.hasVideo ? '✅' : '❌'}</div>
                    <div>Audio: {promptResult.assetMix.hasAudio ? '✅' : '❌'}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generated Prompt */}
          <Card>
            <CardHeader>
              <CardTitle>🎯 Generated Context-Aware Prompt</CardTitle>
              <CardDescription>
                The specialized prompt that will be sent to the LLM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="formatted" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="formatted">Formatted</TabsTrigger>
                  <TabsTrigger value="raw">Raw Text</TabsTrigger>
                </TabsList>
                
                <TabsContent value="formatted" className="mt-4">
                  <div className="bg-gray-50 p-4 rounded-lg max-h-[500px] overflow-auto">
                    <pre className="text-sm font-mono whitespace-pre-wrap">
                      {promptResult.prompt}
                    </pre>
                  </div>
                </TabsContent>
                
                <TabsContent value="raw" className="mt-4">
                  <Textarea
                    value={promptResult.prompt}
                    readOnly
                    className="min-h-[400px] font-mono text-sm"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Prompt Features */}
          <Card>
            <CardHeader>
              <CardTitle>✨ Prompt Features</CardTitle>
              <CardDescription>
                What makes this prompt specialized for your asset mix
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">🎯 Context Awareness</h4>
                  <p className="text-sm text-muted-foreground">
                    Prompt is tailored specifically for {promptResult.templateUsed.toLowerCase()} assets
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">🔄 Asset Role Mapping</h4>
                  <p className="text-sm text-muted-foreground">
                    Normalizes roles based on asset types and context
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">⚡ Conflict Detection</h4>
                  <p className="text-sm text-muted-foreground">
                    Checks for aspect ratio, duration, and quality conflicts
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">📊 Tiered Recommendations</h4>
                  <p className="text-sm text-muted-foreground">
                    REQUIRED vs RECOMMENDED actions based on quality scores
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">🎨 Creative Direction</h4>
                  <p className="text-sm text-muted-foreground">
                    Provides confident, specific creative guidance
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">🛡️ Schema Validation</h4>
                  <p className="text-sm text-muted-foreground">
                    Ensures output matches the exact refiner schema
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!isLoading && !error && !promptResult && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a test case and click "Generate Context-Aware Prompt" to see the magic!</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
