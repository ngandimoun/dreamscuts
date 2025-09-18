'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Play, FileText, Clock, Users, Volume2, Music, Eye } from 'lucide-react';

interface ScriptScene {
  scene_id: string;
  duration: number;
  narration: string;
  visual_anchor: string;
  suggested_effects: string[];
  music_cue: string;
  subtitles: string;
  scene_purpose: string;
  emotional_tone: string;
}

interface ScriptMetadata {
  profile: string;
  duration_seconds: number;
  orientation: string;
  language: string;
  total_scenes: number;
  estimated_word_count: number;
  pacing_style: string;
}

interface ScriptEnhancerResult {
  script_metadata: ScriptMetadata;
  human_readable_script: string; // Main human-readable script content
}

interface ScriptEnhancerResponse {
  success: boolean;
  human_readable_script?: string; // Main human-readable script
  script_metadata?: ScriptMetadata; // Script metadata
  quality_assessment?: {
    overallScore: number;
    grade: string;
    issues: string[];
    recommendations: string[];
  };
  metadata?: {
    scriptId: string;
    profile: string;
    processingTimeMs: number;
    timestamp: string;
  };
  error?: string;
}

const CREATIVE_PROFILES = [
  { id: 'anime_mode', name: 'Anime Mode', description: 'Dramatic dialogue with inner monologue' },
  { id: 'finance_explainer', name: 'Finance Explainer', description: 'Structured narration with data callouts' },
  { id: 'educational_explainer', name: 'Educational Explainer', description: 'Clear, instructional narration' },
  { id: 'ugc_influencer', name: 'UGC Influencer', description: 'Casual, punchy, first-person style' },
  { id: 'presentation_corporate', name: 'Corporate Presentation', description: 'Professional, confident narration' },
  { id: 'pleasure_relaxation', name: 'Relaxation Content', description: 'Calm, soothing narration' },
  { id: 'ads_commercial', name: 'Commercial Ads', description: 'Persuasive, compelling narration' },
  { id: 'demo_product_showcase', name: 'Product Demo', description: 'Demonstrative, feature-focused' },
  { id: 'funny_meme_style', name: 'Meme Style', description: 'Humorous, meme-style narration' },
  { id: 'documentary_storytelling', name: 'Documentary', description: 'Narrative, documentary-style' }
];

export default function TestScriptEnhancerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScriptEnhancerResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    original_prompt: 'build this',
    intent: 'image',
    duration_seconds: 30,
    aspect_ratio: '16:9',
    platform: 'social',
    user_intent_description: 'Create a Smart Auto image for social platform',
    reformulated_prompt: 'Create a visually striking image with strong composition',
    clarity_score: 3,
    content_category: 'general',
    content_complexity: 'simple',
    core_concept: 'Transform user request into professional content',
    visual_approach: 'Apply platform-appropriate styling',
    style_direction: 'Modern, clean, and engaging',
    mood_atmosphere: 'Professional and appealing',
    profile_id: 'anime_mode'
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateScript = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Create mock analyzer/refiner data
      const mockInput = {
        user_request: {
          original_prompt: formData.original_prompt,
          intent: formData.intent,
          duration_seconds: formData.duration_seconds,
          aspect_ratio: formData.aspect_ratio,
          platform: formData.platform,
          image_count: 1
        },
        prompt_analysis: {
          user_intent_description: formData.user_intent_description,
          reformulated_prompt: formData.reformulated_prompt,
          clarity_score: formData.clarity_score,
          suggested_improvements: [
            'Specify the style, mood, or tone you prefer',
            'Mention preferred colors or composition style'
          ],
          content_type_analysis: {
            needs_explanation: false,
            needs_charts: false,
            needs_diagrams: false,
            needs_educational_content: false,
            content_complexity: formData.content_complexity,
            requires_visual_aids: false,
            is_instructional: false,
            needs_data_visualization: false,
            requires_interactive_elements: false,
            content_category: formData.content_category
          }
        },
        assets: [
          {
            id: 'user_image_01',
            type: 'image',
            url: 'https://example.com/image.jpg',
            user_description: 'A beautiful landscape photo',
            ai_caption: 'Scenic mountain landscape with clear blue sky',
            objects_detected: ['mountain', 'sky', 'landscape'],
            quality_score: 0.85
          }
        ],
        global_analysis: {
          goal: 'Create high-quality content with professional styling',
          constraints: {
            duration_seconds: formData.duration_seconds,
            aspect_ratio: formData.aspect_ratio,
            platform: formData.platform
          },
          asset_roles: {
            'user_image_01': 'primary_visual'
          },
          conflicts: []
        },
        creative_options: [
          {
            id: 'opt_modern',
            title: 'Modern Professional',
            short: 'Contemporary design with clean lines',
            reasons: ['Versatile and professional', 'Works across platforms'],
            estimatedWorkload: 'low'
          }
        ],
        creative_direction: {
          core_concept: formData.core_concept,
          visual_approach: formData.visual_approach,
          style_direction: formData.style_direction,
          mood_atmosphere: formData.mood_atmosphere
        },
        production_pipeline: {
          workflow_steps: [
            'Enhance image quality',
            'Apply chosen creative style',
            'Optimize for target platform',
            'Export in required format'
          ],
          estimated_time: '30-45 minutes',
          success_probability: 0.9,
          quality_targets: {
            technical_quality_target: 'high',
            creative_quality_target: 'appealing',
            consistency_target: 'good',
            polish_level_target: 'refined'
          }
        },
        quality_metrics: {
          overall_confidence: 0.75,
          analysis_quality: 8,
          completion_status: 'complete',
          feasibility_score: 0.85
        },
        challenges: [],
        recommendations: [
          {
            type: 'quality',
            recommendation: 'Enhance asset quality before applying creative direction',
            priority: 'recommended'
          }
        ],
        refiner_extensions: {
          creative_profile: {
            profileId: formData.profile_id,
            profileName: CREATIVE_PROFILES.find(p => p.id === formData.profile_id)?.name || 'General',
            goal: 'Create engaging, professional content',
            confidence: '0.95',
            detectionMethod: 'multi-factor',
            matchedFactors: ['intent: image', 'priority_bonus: 95']
          }
        }
      };

      const response = await fetch('/api/dreamcut/script-enhancer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockInput),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Script generation failed');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🎬 Script Enhancer Test</h1>
        <p className="text-muted-foreground">
          Test the Script Enhancer API that generates production-ready scripts for any of the 18 creative profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Script Generation Input</CardTitle>
            <CardDescription>
              Configure the parameters for script generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="original_prompt">Original Prompt</Label>
                <Input
                  id="original_prompt"
                  value={formData.original_prompt}
                  onChange={(e) => handleInputChange('original_prompt', e.target.value)}
                  placeholder="build this"
                />
              </div>
              <div>
                <Label htmlFor="intent">Intent</Label>
                <Select value={formData.intent} onValueChange={(value) => handleInputChange('intent', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration_seconds">Duration (seconds)</Label>
                <Input
                  id="duration_seconds"
                  type="number"
                  value={formData.duration_seconds}
                  onChange={(e) => handleInputChange('duration_seconds', parseInt(e.target.value))}
                  min="5"
                  max="300"
                />
              </div>
              <div>
                <Label htmlFor="aspect_ratio">Aspect Ratio</Label>
                <Select value={formData.aspect_ratio} onValueChange={(value) => handleInputChange('aspect_ratio', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                    <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                    <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="platform">Platform</Label>
              <Select value={formData.platform} onValueChange={(value) => handleInputChange('platform', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="profile_id">Creative Profile</Label>
              <Select value={formData.profile_id} onValueChange={(value) => handleInputChange('profile_id', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CREATIVE_PROFILES.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                {CREATIVE_PROFILES.find(p => p.id === formData.profile_id)?.description}
              </p>
            </div>

            <div>
              <Label htmlFor="user_intent_description">Intent Description</Label>
              <Textarea
                id="user_intent_description"
                value={formData.user_intent_description}
                onChange={(e) => handleInputChange('user_intent_description', e.target.value)}
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="reformulated_prompt">Reformulated Prompt</Label>
              <Textarea
                id="reformulated_prompt"
                value={formData.reformulated_prompt}
                onChange={(e) => handleInputChange('reformulated_prompt', e.target.value)}
                rows={2}
              />
            </div>

            <Button 
              onClick={generateScript} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Script...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Generate Script
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700">{error}</p>
              </CardContent>
            </Card>
          )}

          {result && (
            <>
              {/* Human-Readable Script */}
              {result.human_readable_script && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Human-Readable Script
                    </CardTitle>
                    <CardDescription>
                      Professional script ready for creative teams
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg border max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                        {result.human_readable_script}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Script Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Script Metadata
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Profile</Label>
                      <p className="text-sm text-muted-foreground">{result.script_metadata?.profile}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Duration</Label>
                      <p className="text-sm text-muted-foreground">{result.script_metadata?.duration_seconds}s</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Scenes</Label>
                      <p className="text-sm text-muted-foreground">{result.script_metadata?.total_scenes}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Word Count</Label>
                      <p className="text-sm text-muted-foreground">{result.script_metadata?.estimated_word_count}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Pacing Style</Label>
                    <p className="text-sm text-muted-foreground">{result.script_metadata?.pacing_style}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quality Assessment */}
              {result.quality_assessment && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge variant={result.quality_assessment.grade === 'A' ? 'default' : 'secondary'}>
                        Grade: {result.quality_assessment.grade}
                      </Badge>
                      Quality Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Overall Score</Label>
                      <p className="text-sm text-muted-foreground">
                        {(result.quality_assessment.overallScore * 100).toFixed(1)}%
                      </p>
                    </div>
                    {result.quality_assessment.issues.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-red-600">Issues</Label>
                        <ul className="text-sm text-red-600 list-disc list-inside">
                          {result.quality_assessment.issues.map((issue, index) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {result.quality_assessment.recommendations.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-blue-600">Recommendations</Label>
                        <ul className="text-sm text-blue-600 list-disc list-inside">
                          {result.quality_assessment.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}


              {/* Processing Metadata */}
              {result.metadata && (
                <Card>
                  <CardHeader>
                    <CardTitle>Processing Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="font-medium">Script ID</Label>
                        <p className="text-muted-foreground">{result.metadata.scriptId}</p>
                      </div>
                      <div>
                        <Label className="font-medium">Processing Time</Label>
                        <p className="text-muted-foreground">{result.metadata.processingTimeMs}ms</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
