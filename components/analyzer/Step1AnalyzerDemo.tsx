'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Play, Clock, Target, Lightbulb, AlertTriangle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QueryAnalysisResult {
  original_prompt: string;
  normalized_prompt: string;
  intent: {
    primary_output_type: 'image' | 'video' | 'audio' | 'mixed';
    confidence: number;
    secondary_types?: string[];
    reasoning: string;
  };
  modifiers: {
    style?: string[];
    mood?: string[];
    theme?: string[];
    time_period?: string;
    emotions?: string[];
    aesthetic?: string[];
    genre?: string[];
    technical_specs?: string[];
  };
  constraints: {
    image_count?: number;
    aspect_ratio?: string;
    resolution?: string;
    duration_seconds?: number;
    fps?: number;
    target_audience?: string;
    platform?: string[];
  };
  gaps: {
    missing_duration?: boolean;
    missing_aspect_ratio?: boolean;
    missing_style_direction?: boolean;
    missing_target_audience?: boolean;
    missing_platform_specs?: boolean;
    missing_mood_tone?: boolean;
    vague_requirements?: boolean;
    needs_clarification?: string[];
  };
  creative_reframing?: {
    alternative_interpretations?: Array<{
      interpretation: string;
      rationale: string;
      confidence: number;
    }>;
    suggested_enhancements?: string[];
    potential_directions?: Array<{
      direction: string;
      description: string;
      required_assets?: string[];
    }>;
  };
  processing_metadata: {
    analysis_timestamp: string;
    processing_time_ms: number;
    model_used: string;
    confidence_score: number;
    grammar_corrections_made: boolean;
    normalization_applied: boolean;
  };
}

interface AssetRequirements {
  needs_reference_images: boolean;
  needs_source_video: boolean;
  needs_audio_input: boolean;
  recommended_asset_types: string[];
  rationale: string;
}

interface DefaultConstraints {
  suggested_duration?: number;
  suggested_aspect_ratio?: string;
  suggested_resolution?: string;
  rationale: string;
}

export default function Step1AnalyzerDemo() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    query_analysis?: QueryAnalysisResult;
    asset_requirements?: AssetRequirements;
    default_constraints?: DefaultConstraints;
    processing_time_ms?: number;
    model_used?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Options
  const [enableGrammarCorrection, setEnableGrammarCorrection] = useState(true);
  const [enableCreativeReframing, setEnableCreativeReframing] = useState(true);
  const [enableDetailedModifiers, setEnableDetailedModifiers] = useState(true);
  const [modelPreference, setModelPreference] = useState<'auto' | 'llama31_405b' | 'llama31_70b' | 'qwen25_72b' | 'gemma2_27b' | 'mistral_7b'>('auto');

  const analyzeQuery = useCallback(async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('/api/dreamcut/step1-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          options: {
            enable_grammar_correction: enableGrammarCorrection,
            enable_creative_reframing: enableCreativeReframing,
            enable_detailed_modifier_extraction: enableDetailedModifiers,
            model_preference: modelPreference,
            timeout: 60000
          }
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        setError(data.error || 'Analysis failed');
        return;
      }
      
      setResult(data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [query, enableGrammarCorrection, enableCreativeReframing, enableDetailedModifiers, modelPreference]);

  const exampleQueries = [
    'Create a cinematic trailer for my indie game',
    'make a 30 second tiktok video about cooking pasta',
    'I need professional headshots for LinkedIn',
    'Generate background music for my meditation app',
    'Create a logo animation for my startup',
    'Make a video edit of my vacation footage',
  ];

  const getIntentBadgeColor = (intent: string) => {
    switch (intent) {
      case 'image': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-green-100 text-green-800';
      case 'audio': return 'bg-purple-100 text-purple-800';
      case 'mixed': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Step 1: Query Analyzer Demo
          </CardTitle>
          <CardDescription>
            Test the user query analysis step of the DreamCut refactor. This step extracts intent, 
            constraints, and requirements from natural language prompts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Query Input */}
          <div className="space-y-2">
            <Label htmlFor="query">User Query</Label>
            <Textarea
              id="query"
              placeholder="Enter a creative request like 'Create a cinematic trailer for my indie game' or 'Make a 30-second TikTok video about cooking'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              className="min-h-[80px]"
            />
          </div>

          {/* Example Queries */}
          <div className="space-y-2">
            <Label>Example Queries</Label>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery(example)}
                  className="text-xs"
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Switch
                id="grammar"
                checked={enableGrammarCorrection}
                onCheckedChange={setEnableGrammarCorrection}
              />
              <Label htmlFor="grammar" className="text-sm">Grammar Correction</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="reframing"
                checked={enableCreativeReframing}
                onCheckedChange={setEnableCreativeReframing}
              />
              <Label htmlFor="reframing" className="text-sm">Creative Reframing</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="modifiers"
                checked={enableDetailedModifiers}
                onCheckedChange={setEnableDetailedModifiers}
              />
              <Label htmlFor="modifiers" className="text-sm">Detailed Modifiers</Label>
            </div>
            
            <div className="space-y-1">
              <Label className="text-sm">Model</Label>
              <Select value={modelPreference} onValueChange={(value: any) => setModelPreference(value)}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto (Together AI)</SelectItem>
                  <SelectItem value="llama31_405b">Llama 3.1 405B (Flagship)</SelectItem>
                  <SelectItem value="llama31_70b">Llama 3.1 70B (Balanced)</SelectItem>
                  <SelectItem value="qwen25_72b">Qwen 2.5 72B (Reasoning)</SelectItem>
                  <SelectItem value="gemma2_27b">Gemma 2 27B (Efficient)</SelectItem>
                  <SelectItem value="mistral_7b">Mistral 7B (Fast)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Analyze Button */}
          <Button 
            onClick={analyzeQuery} 
            disabled={!query.trim() || loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Query...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Analyze Query
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {result?.query_analysis && (
        <div className="space-y-4">
          {/* Processing Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Processing Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Processing Time</div>
                  <div className="font-medium">{result.processing_time_ms}ms</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Model Used</div>
                  <div className="font-medium">{result.model_used}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Confidence</div>
                  <div className={`font-medium ${getConfidenceColor(result.query_analysis.processing_metadata.confidence_score)}`}>
                    {(result.query_analysis.processing_metadata.confidence_score * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Normalized</div>
                  <div className="font-medium">
                    {result.query_analysis.processing_metadata.normalization_applied ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Intent Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Intent Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className={getIntentBadgeColor(result.query_analysis.intent.primary_output_type)}>
                    {result.query_analysis.intent.primary_output_type.toUpperCase()}
                  </Badge>
                  <span className={`font-medium ${getConfidenceColor(result.query_analysis.intent.confidence)}`}>
                    {(result.query_analysis.intent.confidence * 100).toFixed(1)}% confidence
                  </span>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Reasoning</div>
                  <div>{result.query_analysis.intent.reasoning}</div>
                </div>
                {result.query_analysis.intent.secondary_types && result.query_analysis.intent.secondary_types.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-600">Secondary Types</div>
                    <div className="flex gap-1">
                      {result.query_analysis.intent.secondary_types.map((type, index) => (
                        <Badge key={index} variant="outline">{type}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Modifiers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Extracted Modifiers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(result.query_analysis.modifiers).map(([key, values]) => {
                  if (!values || (Array.isArray(values) && values.length === 0)) return null;
                  return (
                    <div key={key}>
                      <div className="text-sm text-gray-600 capitalize mb-1">
                        {key.replace('_', ' ')}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(values) ? (
                          values.map((value, index) => (
                            <Badge key={index} variant="secondary">{value}</Badge>
                          ))
                        ) : (
                          <Badge variant="secondary">{values}</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Constraints */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detected Constraints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(result.query_analysis.constraints).map(([key, value]) => {
                  if (value === undefined || value === null) return null;
                  return (
                    <div key={key}>
                      <div className="text-sm text-gray-600 capitalize">
                        {key.replace('_', ' ')}
                      </div>
                      <div className="font-medium">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Gaps */}
          {Object.values(result.query_analysis.gaps).some(Boolean) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  Identified Gaps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(result.query_analysis.gaps).map(([key, value]) => {
                    if (!value) return null;
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                        <span className="capitalize">{key.replace('_', ' ')}</span>
                      </div>
                    );
                  })}
                  {result.query_analysis.gaps.needs_clarification && (
                    <div className="mt-3">
                      <div className="text-sm text-gray-600 mb-1">Needs Clarification</div>
                      <ul className="list-disc list-inside space-y-1">
                        {result.query_analysis.gaps.needs_clarification.map((item, index) => (
                          <li key={index} className="text-sm">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Asset Requirements */}
          {result.asset_requirements && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Asset Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${result.asset_requirements.needs_reference_images ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-sm">Reference Images</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${result.asset_requirements.needs_source_video ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-sm">Source Video</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${result.asset_requirements.needs_audio_input ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-sm">Audio Input</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Recommended Asset Types</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.asset_requirements.recommended_asset_types.map((type, index) => (
                        <Badge key={index} variant="outline">{type}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Rationale</div>
                    <div className="text-sm">{result.asset_requirements.rationale}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Creative Reframing */}
          {result.query_analysis.creative_reframing && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Creative Reframing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.query_analysis.creative_reframing.alternative_interpretations && (
                    <div>
                      <div className="text-sm text-gray-600 mb-2">Alternative Interpretations</div>
                      <div className="space-y-2">
                        {result.query_analysis.creative_reframing.alternative_interpretations.map((interpretation, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="font-medium">{interpretation.interpretation}</div>
                            <div className="text-sm text-gray-600 mt-1">{interpretation.rationale}</div>
                            <div className={`text-xs mt-1 ${getConfidenceColor(interpretation.confidence)}`}>
                              {(interpretation.confidence * 100).toFixed(1)}% confidence
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {result.query_analysis.creative_reframing.suggested_enhancements && (
                    <div>
                      <div className="text-sm text-gray-600 mb-2">Suggested Enhancements</div>
                      <ul className="list-disc list-inside space-y-1">
                        {result.query_analysis.creative_reframing.suggested_enhancements.map((enhancement, index) => (
                          <li key={index} className="text-sm">{enhancement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}