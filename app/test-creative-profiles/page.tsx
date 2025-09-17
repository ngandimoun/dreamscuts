'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CheckCircle, XCircle, Clock, Zap, Palette, Brain, Target, Settings } from 'lucide-react';
import { detectCreativeProfile, getAllProfiles, getProfileById } from '@/lib/analyzer/creative-profiles';

// Test cases for different creative profiles
const PROFILE_TEST_CASES = {
  educational: {
    name: '📚 Educational Explainer',
    description: 'Test educational content detection',
    analyzerJson: {
      id: 'dq_edu_001',
      user_request: {
        original_prompt: 'explain how machine learning works in a simple tutorial',
        intent: 'video',
        duration_seconds: 300,
        platform: 'youtube'
      },
      prompt_analysis: {
        content_type_analysis: {
          content_category: 'educational',
          needs_explanation: true,
          is_instructional: true
        }
      },
      assets: [
        {
          id: 'ast_vid01',
          type: 'video',
          user_description: 'main explanation video',
          quality_score: 0.8
        }
      ]
    }
  },
  
  anime: {
    name: '🎌 Anime Mode',
    description: 'Test anime content detection',
    analyzerJson: {
      id: 'dq_anime_001',
      user_request: {
        original_prompt: 'create an anime-style video about my daily routine',
        intent: 'video',
        duration_seconds: 60,
        platform: 'tiktok'
      },
      prompt_analysis: {
        content_type_analysis: {
          content_category: 'anime',
          needs_explanation: false,
          is_instructional: false
        }
      },
      assets: [
        {
          id: 'ast_img01',
          type: 'image',
          user_description: 'my photo to convert to anime style',
          quality_score: 0.7
        }
      ]
    }
  },
  
  finance: {
    name: '💰 Bloomberg-Style Finance',
    description: 'Test financial content detection',
    analyzerJson: {
      id: 'dq_fin_001',
      user_request: {
        original_prompt: 'explain the stock market trends and investment strategies',
        intent: 'video',
        duration_seconds: 180,
        platform: 'linkedin'
      },
      prompt_analysis: {
        content_type_analysis: {
          content_category: 'finance',
          needs_explanation: true,
          is_instructional: true
        }
      },
      assets: [
        {
          id: 'ast_img01',
          type: 'image',
          user_description: 'stock charts and financial data',
          quality_score: 0.9
        }
      ]
    }
  },
  
  ugc: {
    name: '📱 UGC/Influencer',
    description: 'Test user-generated content detection',
    analyzerJson: {
      id: 'dq_ugc_001',
      user_request: {
        original_prompt: 'day in my life vlog with get ready with me content',
        intent: 'video',
        duration_seconds: 45,
        platform: 'instagram'
      },
      prompt_analysis: {
        content_type_analysis: {
          content_category: 'lifestyle',
          needs_explanation: false,
          is_instructional: false
        }
      },
      assets: [
        {
          id: 'ast_vid01',
          type: 'video',
          user_description: 'selfie-style vlog footage',
          quality_score: 0.6
        }
      ]
    }
  },
  
  commercial: {
    name: '📢 Ads/Commercial',
    description: 'Test commercial content detection',
    analyzerJson: {
      id: 'dq_ads_001',
      user_request: {
        original_prompt: 'create a promotional video for our new product launch',
        intent: 'video',
        duration_seconds: 30,
        platform: 'facebook'
      },
      prompt_analysis: {
        content_type_analysis: {
          content_category: 'advertising',
          needs_explanation: false,
          is_instructional: false
        }
      },
      assets: [
        {
          id: 'ast_vid01',
          type: 'video',
          user_description: 'product demonstration footage',
          quality_score: 0.8
        }
      ]
    }
  },
  
  documentary: {
    name: '🎬 Documentary/Storytelling',
    description: 'Test documentary content detection',
    analyzerJson: {
      id: 'dq_doc_001',
      user_request: {
        original_prompt: 'tell the story of my journey as an entrepreneur',
        intent: 'video',
        duration_seconds: 600,
        platform: 'youtube'
      },
      prompt_analysis: {
        content_type_analysis: {
          content_category: 'documentary',
          needs_explanation: false,
          is_instructional: false
        }
      },
      assets: [
        {
          id: 'ast_vid01',
          type: 'video',
          user_description: 'archival footage and interviews',
          quality_score: 0.7
        }
      ]
    }
  }
};

export default function TestCreativeProfilesPage() {
  const [selectedTestCase, setSelectedTestCase] = useState<keyof typeof PROFILE_TEST_CASES>('educational');
  const [analyzerJson, setAnalyzerJson] = useState(JSON.stringify(PROFILE_TEST_CASES.educational.analyzerJson, null, 2));
  const [detectionResult, setDetectionResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allProfiles] = useState(getAllProfiles());

  const handleTestCaseSelect = (testCase: keyof typeof PROFILE_TEST_CASES) => {
    setSelectedTestCase(testCase);
    setAnalyzerJson(JSON.stringify(PROFILE_TEST_CASES[testCase].analyzerJson, null, 2));
    setDetectionResult(null);
    setError(null);
  };

  const handleDetectProfile = async () => {
    setIsLoading(true);
    setError(null);
    setDetectionResult(null);

    try {
      const parsedAnalyzerJson = JSON.parse(analyzerJson);
      
      // Detect creative profile
      const detectedProfile = detectCreativeProfile(parsedAnalyzerJson);
      
      // Analyze detection criteria
      const analysis = {
        detectedProfile,
        detectionScore: detectedProfile ? calculateDetectionScore(parsedAnalyzerJson, detectedProfile) : 0,
        allMatchingProfiles: getAllMatchingProfiles(parsedAnalyzerJson),
        detectionBreakdown: getDetectionBreakdown(parsedAnalyzerJson)
      };
      
      setDetectionResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDetectionScore = (analyzerJson: any, profile: any): number => {
    let score = 0;
    const prompt = analyzerJson.user_request?.original_prompt?.toLowerCase() || '';
    const criteria = profile.detectionCriteria;

    // Check keywords
    const keywordMatches = criteria.keywords.filter((keyword: string) => 
      prompt.includes(keyword.toLowerCase())
    ).length;
    score += keywordMatches * 10;

    // Check content category
    const contentCategory = analyzerJson.prompt_analysis?.content_type_analysis?.content_category?.toLowerCase() || '';
    if (criteria.contentCategories.includes(contentCategory)) {
      score += 20;
    }

    // Check intent
    const intent = analyzerJson.user_request?.intent || '';
    if (criteria.intents.includes(intent)) {
      score += 15;
    }

    // Check platform
    const platform = analyzerJson.user_request?.platform?.toLowerCase() || '';
    if (criteria.platforms.includes(platform)) {
      score += 10;
    }

    // Check asset types
    const assetTypes = analyzerJson.assets?.map((asset: any) => asset.type) || [];
    const assetMatches = criteria.assetTypes.filter((type: string) => 
      assetTypes.includes(type)
    ).length;
    score += assetMatches * 5;

    // Add priority bonus
    score += profile.priority;

    return score;
  };

  const getAllMatchingProfiles = (analyzerJson: any) => {
    return allProfiles.map(profile => ({
      profile,
      score: calculateDetectionScore(analyzerJson, profile)
    })).sort((a, b) => b.score - a.score);
  };

  const getDetectionBreakdown = (analyzerJson: any) => {
    const prompt = analyzerJson.user_request?.original_prompt?.toLowerCase() || '';
    const contentCategory = analyzerJson.prompt_analysis?.content_type_analysis?.content_category?.toLowerCase() || '';
    const intent = analyzerJson.user_request?.intent || '';
    const platform = analyzerJson.user_request?.platform?.toLowerCase() || '';
    const assetTypes = analyzerJson.assets?.map((asset: any) => asset.type) || [];
    const duration = analyzerJson.user_request?.duration_seconds || 0;

    return {
      prompt,
      contentCategory,
      intent,
      platform,
      assetTypes,
      duration,
      extractedKeywords: extractKeywords(prompt)
    };
  };

  const extractKeywords = (prompt: string): string[] => {
    const allKeywords = allProfiles.flatMap(profile => profile.detectionCriteria.keywords);
    return allKeywords.filter(keyword => prompt.includes(keyword.toLowerCase()));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    if (score >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🎨 Creative Profiles Test</h1>
        <p className="text-muted-foreground">
          Test the Creative Profiles Layer that transforms Dreamcut from functional to brilliant
          by automatically detecting intent and context, then activating specialized creative profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Test Cases Selection */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Profile Test Cases</CardTitle>
            <CardDescription>
              Select different content types to test creative profile detection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(PROFILE_TEST_CASES).map(([key, testCase]) => (
              <div
                key={key}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTestCase === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleTestCaseSelect(key as keyof typeof PROFILE_TEST_CASES)}
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
              Current test case: {PROFILE_TEST_CASES[selectedTestCase].name}
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
              onClick={handleDetectProfile}
              disabled={isLoading}
              className="mt-4 w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Detecting Profile...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Detect Creative Profile
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

      {detectionResult && (
        <div className="mt-6 space-y-6">
          {/* Detection Result */}
          <Card>
            <CardHeader>
              <CardTitle>🎯 Profile Detection Result</CardTitle>
              <CardDescription>
                Which creative profile was detected and why
              </CardDescription>
            </CardHeader>
            <CardContent>
              {detectionResult.detectedProfile ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h3 className="font-medium text-green-800">Profile Detected</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-1">{detectionResult.detectedProfile.name}</h4>
                        <p className="text-sm text-muted-foreground">{detectionResult.detectedProfile.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getScoreColor(detectionResult.detectionScore)}>
                          Score: {detectionResult.detectionScore}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">Goal: {detectionResult.detectedProfile.goal}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">🎨 Creative Direction</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Core Concept:</span>
                          <p className="text-muted-foreground">{detectionResult.detectedProfile.defaults.creativeDirection.core_concept}</p>
                        </div>
                        <div>
                          <span className="font-medium">Visual Approach:</span>
                          <p className="text-muted-foreground">{detectionResult.detectedProfile.defaults.creativeDirection.visual_approach}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">⚙️ Pipeline</h4>
                      <div className="space-y-1 text-sm">
                        {detectionResult.detectedProfile.pipeline.requiredAssets.map((asset: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>{asset}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 border rounded-lg bg-yellow-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <h3 className="font-medium text-yellow-800">No Profile Detected</h3>
                  </div>
                  <p className="text-sm text-yellow-700">
                    No specific creative profile was detected. The system will use general refinement.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detection Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>🔍 Detection Analysis</CardTitle>
              <CardDescription>
                How the system analyzed your content to detect the profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">📝 Content Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Prompt:</span>
                      <p className="text-muted-foreground italic">"{detectionResult.detectionBreakdown.prompt}"</p>
                    </div>
                    <div>
                      <span className="font-medium">Content Category:</span>
                      <Badge variant="outline" className="ml-2">{detectionResult.detectionBreakdown.contentCategory || 'none'}</Badge>
                    </div>
                    <div>
                      <span className="font-medium">Intent:</span>
                      <Badge variant="outline" className="ml-2">{detectionResult.detectionBreakdown.intent}</Badge>
                    </div>
                    <div>
                      <span className="font-medium">Platform:</span>
                      <Badge variant="outline" className="ml-2">{detectionResult.detectionBreakdown.platform || 'none'}</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">🏷️ Extracted Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {detectionResult.detectionBreakdown.extractedKeywords.length > 0 ? (
                      detectionResult.detectionBreakdown.extractedKeywords.map((keyword: string, index: number) => (
                        <Badge key={index} variant="secondary">{keyword}</Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No matching keywords found</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* All Profile Scores */}
          <Card>
            <CardHeader>
              <CardTitle>📊 All Profile Scores</CardTitle>
              <CardDescription>
                How all profiles scored against your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {detectionResult.allMatchingProfiles.map((item: any, index: number) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg ${
                      index === 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{item.profile.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.profile.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getScoreColor(item.score)}>
                          Score: {item.score}
                        </Badge>
                        {index === 0 && (
                          <Badge variant="secondary" className="ml-2">Selected</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Profile Features */}
          {detectionResult.detectedProfile && (
            <Card>
              <CardHeader>
                <CardTitle>✨ Profile Features</CardTitle>
                <CardDescription>
                  What makes this profile special for your content type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">🎯 Goal</h4>
                    <p className="text-sm text-muted-foreground">{detectionResult.detectedProfile.goal}</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">🎨 Style Guidelines</h4>
                    <div className="space-y-1 text-sm">
                      {detectionResult.detectedProfile.defaults.styleGuidelines.map((guideline: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                          <span>{guideline}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">⚡ Editing Conventions</h4>
                    <div className="space-y-1 text-sm">
                      {detectionResult.detectedProfile.pipeline.editingConventions.map((convention: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span>{convention}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">🎵 Audio Style</h4>
                    <p className="text-sm text-muted-foreground">{detectionResult.detectedProfile.pipeline.audioStyle}</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">📝 Text Overlays</h4>
                    <div className="space-y-1 text-sm">
                      {detectionResult.detectedProfile.pipeline.textOverlays.map((overlay: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                          <span>{overlay}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">🎬 Transitions</h4>
                    <div className="flex flex-wrap gap-1">
                      {detectionResult.detectedProfile.pipeline.transitions.map((transition: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">{transition}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!isLoading && !error && !detectionResult && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a test case and click "Detect Creative Profile" to see the magic!</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
