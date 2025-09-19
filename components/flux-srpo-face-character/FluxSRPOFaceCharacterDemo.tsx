/**
 * FLUX.1 SRPO Face Character Demo Component
 * 
 * Interactive demo for testing FLUX.1 SRPO face character generation capabilities.
 * Specialized for ultra-realistic face character generation with excellent consistency.
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Download, Eye, Settings, Palette, User, Sparkles } from 'lucide-react';

interface FluxSRPOFaceResult {
  success: boolean;
  result?: {
    images: Array<{
      url: string;
      width: number;
      height: number;
      content_type: string;
    }>;
    timings?: {
      inference: number;
      total: number;
    };
    seed: number;
    has_nsfw_concepts: boolean[];
    prompt: string;
  };
  metadata?: {
    cost: number;
    processingTime: number;
    model: string;
    provider: string;
    imageCount: number;
    totalPixels: number;
  };
  error?: string;
}

export default function FluxSRPOFaceCharacterDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FluxSRPOFaceResult | null>(null);
  const [formData, setFormData] = useState({
    prompt: 'Professional portrait of a young adult woman with long brown hair, blue eyes, wearing business attire, confident expression, studio lighting, high resolution, detailed, sharp focus, professional quality, 8k, masterpiece',
    imageSize: 'portrait_4_3',
    numInferenceSteps: 28,
    seed: undefined as number | undefined,
    guidanceScale: 4.5,
    numImages: 1,
    enableSafetyChecker: true,
    outputFormat: 'jpeg',
    acceleration: 'none',
    syncMode: false,
    streaming: false,
  });

  const [characterBuilder, setCharacterBuilder] = useState({
    characterType: 'portrait',
    gender: 'female',
    age: 'young-adult',
    ethnicity: 'Caucasian',
    hairColor: 'brown',
    hairStyle: 'long',
    eyeColor: 'blue',
    facialFeatures: ['high cheekbones', 'defined jawline'],
    expression: 'confident',
    clothing: 'business attire',
    setting: 'studio',
    style: 'realistic',
    lighting: 'studio lighting',
    pose: 'head-on',
    additionalDetails: 'professional quality, 8k, masterpiece',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCharacterBuilderChange = (field: string, value: any) => {
    setCharacterBuilder(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFacialFeaturesChange = (index: number, value: string) => {
    const newFeatures = [...characterBuilder.facialFeatures];
    newFeatures[index] = value;
    setCharacterBuilder(prev => ({
      ...prev,
      facialFeatures: newFeatures,
    }));
  };

  const addFacialFeature = () => {
    setCharacterBuilder(prev => ({
      ...prev,
      facialFeatures: [...prev.facialFeatures, ''],
    }));
  };

  const removeFacialFeature = (index: number) => {
    setCharacterBuilder(prev => ({
      ...prev,
      facialFeatures: prev.facialFeatures.filter((_, i) => i !== index),
    }));
  };

  const generateFromBuilder = () => {
    const prompt = createPromptFromBuilder(characterBuilder);
    setFormData(prev => ({
      ...prev,
      prompt,
    }));
  };

  const createPromptFromBuilder = (builder: typeof characterBuilder): string => {
    let prompt = '';
    
    if (builder.characterType === 'portrait') {
      prompt += 'Professional portrait of a ';
    } else if (builder.characterType === 'full-body') {
      prompt += 'Full body shot of a ';
    } else if (builder.characterType === 'headshot') {
      prompt += 'Headshot of a ';
    } else if (builder.characterType === 'character-design') {
      prompt += 'Character design of a ';
    }
    
    prompt += `${builder.age} ${builder.gender} ${builder.ethnicity} `;
    prompt += `with ${builder.hairColor} ${builder.hairStyle} hair, `;
    prompt += `${builder.eyeColor} eyes, `;
    
    if (builder.facialFeatures.length > 0) {
      prompt += builder.facialFeatures.join(', ') + ', ';
    }
    
    prompt += `${builder.expression} expression, `;
    prompt += `wearing ${builder.clothing}, `;
    prompt += `in ${builder.setting}, `;
    
    if (builder.style === 'realistic') {
      prompt += 'ultra-realistic, photorealistic, ';
    } else if (builder.style === 'cinematic') {
      prompt += 'cinematic, movie-quality, ';
    } else if (builder.style === 'artistic') {
      prompt += 'artistic, detailed, ';
    } else if (builder.style === 'photographic') {
      prompt += 'photographic, professional photography, ';
    }
    
    prompt += `${builder.lighting}, `;
    prompt += `${builder.pose} pose, `;
    prompt += builder.additionalDetails;
    
    return prompt.trim().replace(/,\s*$/, '');
  };

  const generateFaceCharacter = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/dreamcut/flux-srpo-face-character', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `flux-srpo-face-character-${index + 1}.${formData.outputFormat}`;
    link.click();
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">FLUX.1 SRPO Face Character Generator</h1>
        <p className="text-muted-foreground">
          Generate ultra-realistic face characters with excellent consistency using FLUX.1 SRPO
        </p>
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-green-600 font-bold text-lg">✨</div>
            <div>
              <h3 className="font-semibold text-green-800 mb-1">Excellent for Face Characters</h3>
              <p className="text-green-700 text-sm">
                <strong>FLUX.1 SRPO excels at face character consistency.</strong> 
                This model is specifically designed for ultra-realistic face generation with 
                excellent character consistency across multiple images.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Face Character Configuration
            </CardTitle>
            <CardDescription>
              Configure your ultra-realistic face character generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="prompt" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="prompt">Direct Prompt</TabsTrigger>
                <TabsTrigger value="builder">Character Builder</TabsTrigger>
              </TabsList>

              <TabsContent value="prompt" className="space-y-4">
                <div>
                  <Label htmlFor="prompt">Prompt</Label>
                  <Textarea
                    id="prompt"
                    value={formData.prompt}
                    onChange={(e) => handleInputChange('prompt', e.target.value)}
                    placeholder="Describe your face character in detail..."
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.prompt.length}/2000 characters
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="builder" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="characterType">Character Type</Label>
                    <Select value={characterBuilder.characterType} onValueChange={(value) => handleCharacterBuilderChange('characterType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="full-body">Full Body</SelectItem>
                        <SelectItem value="headshot">Headshot</SelectItem>
                        <SelectItem value="character-design">Character Design</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={characterBuilder.gender} onValueChange={(value) => handleCharacterBuilderChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Select value={characterBuilder.age} onValueChange={(value) => handleCharacterBuilderChange('age', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="teen">Teen</SelectItem>
                        <SelectItem value="young-adult">Young Adult</SelectItem>
                        <SelectItem value="adult">Adult</SelectItem>
                        <SelectItem value="elderly">Elderly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="ethnicity">Ethnicity</Label>
                    <Input
                      id="ethnicity"
                      value={characterBuilder.ethnicity}
                      onChange={(e) => handleCharacterBuilderChange('ethnicity', e.target.value)}
                      placeholder="e.g., Caucasian, Asian, African, etc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hairColor">Hair Color</Label>
                    <Input
                      id="hairColor"
                      value={characterBuilder.hairColor}
                      onChange={(e) => handleCharacterBuilderChange('hairColor', e.target.value)}
                      placeholder="e.g., brown, blonde, black, red"
                    />
                  </div>

                  <div>
                    <Label htmlFor="hairStyle">Hair Style</Label>
                    <Input
                      id="hairStyle"
                      value={characterBuilder.hairStyle}
                      onChange={(e) => handleCharacterBuilderChange('hairStyle', e.target.value)}
                      placeholder="e.g., long, short, curly, straight"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eyeColor">Eye Color</Label>
                    <Input
                      id="eyeColor"
                      value={characterBuilder.eyeColor}
                      onChange={(e) => handleCharacterBuilderChange('eyeColor', e.target.value)}
                      placeholder="e.g., blue, brown, green, hazel"
                    />
                  </div>

                  <div>
                    <Label htmlFor="expression">Expression</Label>
                    <Input
                      id="expression"
                      value={characterBuilder.expression}
                      onChange={(e) => handleCharacterBuilderChange('expression', e.target.value)}
                      placeholder="e.g., confident, friendly, serious, smiling"
                    />
                  </div>
                </div>

                <div>
                  <Label>Facial Features</Label>
                  <div className="space-y-2 mt-2">
                    {characterBuilder.facialFeatures.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={feature}
                          onChange={(e) => handleFacialFeaturesChange(index, e.target.value)}
                          placeholder={`Facial feature ${index + 1}`}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFacialFeature(index)}
                          disabled={characterBuilder.facialFeatures.length === 1}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addFacialFeature}>
                      Add Facial Feature
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clothing">Clothing</Label>
                    <Input
                      id="clothing"
                      value={characterBuilder.clothing}
                      onChange={(e) => handleCharacterBuilderChange('clothing', e.target.value)}
                      placeholder="e.g., business attire, casual wear, formal dress"
                    />
                  </div>

                  <div>
                    <Label htmlFor="setting">Setting</Label>
                    <Input
                      id="setting"
                      value={characterBuilder.setting}
                      onChange={(e) => handleCharacterBuilderChange('setting', e.target.value)}
                      placeholder="e.g., studio, outdoor, office, home"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="style">Style</Label>
                    <Select value={characterBuilder.style} onValueChange={(value) => handleCharacterBuilderChange('style', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realistic">Realistic</SelectItem>
                        <SelectItem value="cinematic">Cinematic</SelectItem>
                        <SelectItem value="artistic">Artistic</SelectItem>
                        <SelectItem value="photographic">Photographic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="lighting">Lighting</Label>
                    <Input
                      id="lighting"
                      value={characterBuilder.lighting}
                      onChange={(e) => handleCharacterBuilderChange('lighting', e.target.value)}
                      placeholder="e.g., studio lighting, natural light, dramatic lighting"
                    />
                  </div>
                </div>

                <Button onClick={generateFromBuilder} className="w-full">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Prompt from Builder
                </Button>
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="imageSize">Image Size</Label>
                    <Select value={formData.imageSize} onValueChange={(value) => handleInputChange('imageSize', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="square_hd">Square HD</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="portrait_4_3">Portrait 4:3</SelectItem>
                        <SelectItem value="portrait_16_9">Portrait 16:9</SelectItem>
                        <SelectItem value="landscape_4_3">Landscape 4:3</SelectItem>
                        <SelectItem value="landscape_16_9">Landscape 16:9</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="numImages">Number of Images</Label>
                    <Select value={formData.numImages.toString()} onValueChange={(value) => handleInputChange('numImages', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Image</SelectItem>
                        <SelectItem value="2">2 Images</SelectItem>
                        <SelectItem value="3">3 Images</SelectItem>
                        <SelectItem value="4">4 Images</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="outputFormat">Output Format</Label>
                    <Select value={formData.outputFormat} onValueChange={(value) => handleInputChange('outputFormat', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jpeg">JPEG</SelectItem>
                        <SelectItem value="png">PNG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="acceleration">Acceleration</Label>
                    <Select value={formData.acceleration} onValueChange={(value) => handleInputChange('acceleration', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None (Base Speed)</SelectItem>
                        <SelectItem value="regular">Regular (Faster)</SelectItem>
                        <SelectItem value="high">High (Fastest)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="numInferenceSteps">Inference Steps</Label>
                    <Input
                      id="numInferenceSteps"
                      type="number"
                      min="1"
                      max="100"
                      value={formData.numInferenceSteps}
                      onChange={(e) => handleInputChange('numInferenceSteps', parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="guidanceScale">Guidance Scale</Label>
                    <Input
                      id="guidanceScale"
                      type="number"
                      min="1"
                      max="20"
                      step="0.1"
                      value={formData.guidanceScale}
                      onChange={(e) => handleInputChange('guidanceScale', parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="seed">Seed (Optional)</Label>
                  <Input
                    id="seed"
                    type="number"
                    value={formData.seed || ''}
                    onChange={(e) => handleInputChange('seed', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Leave empty for random"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enableSafetyChecker"
                    checked={formData.enableSafetyChecker}
                    onChange={(e) => handleInputChange('enableSafetyChecker', e.target.checked)}
                  />
                  <Label htmlFor="enableSafetyChecker">Enable Safety Checker</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="streaming"
                    checked={formData.streaming}
                    onChange={(e) => handleInputChange('streaming', e.target.checked)}
                  />
                  <Label htmlFor="streaming">Enable Streaming</Label>
                </div>
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />

            <Button
              onClick={generateFaceCharacter}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Face Character...
                </>
              ) : (
                <>
                  <User className="mr-2 h-4 w-4" />
                  Generate Face Character
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Generated Face Character
            </CardTitle>
            <CardDescription>
              View and download your generated face character
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Generating your face character...</p>
                </div>
              </div>
            )}

            {result && !isLoading && (
              <div className="space-y-4">
                {result.success && result.result ? (
                  <>
                    <div className="grid grid-cols-1 gap-4">
                      {result.result.images.map((image, index) => (
                        <div key={index} className="space-y-2">
                          <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                            <img
                              src={image.url}
                              alt={`Generated face character ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button 
                            onClick={() => downloadImage(image.url, index)} 
                            className="w-full"
                            size="sm"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download Image {index + 1}
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-xs text-muted-foreground">Model</Label>
                        <p className="font-medium">{result.metadata?.model}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Provider</Label>
                        <p className="font-medium">{result.metadata?.provider}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Images</Label>
                        <p className="font-medium">{result.metadata?.imageCount}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Cost</Label>
                        <p className="font-medium">${result.metadata?.cost.toFixed(4)}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Processing Time</Label>
                        <p className="font-medium">{result.metadata?.processingTime}ms</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Seed</Label>
                        <p className="font-medium">{result.result.seed}</p>
                      </div>
                    </div>

                    {result.result.has_nsfw_concepts.some(Boolean) && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                          ⚠️ Some images may contain content that was flagged by the safety checker.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-destructive mb-2">Generation Failed</div>
                    <p className="text-sm text-muted-foreground">{result.error}</p>
                  </div>
                )}
              </div>
            )}

            {!result && !isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Configure your face character and click "Generate Face Character" to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
