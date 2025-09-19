/**
 * Text Designer Demo Component
 * 
 * Interactive demo for testing GPT Image 1 text design capabilities.
 * Supports brochures, flyers, posters, business cards, and other text-heavy designs.
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
import { Loader2, Download, Eye, Settings, Palette, Type, Layout } from 'lucide-react';

interface TextDesignResult {
  success: boolean;
  design?: {
    data: any;
    metadata: {
      designType: string;
      prompt: string;
      cost: number;
      processingTime: number;
      size: string;
      quality: string;
      estimatedTokens: number;
    };
  };
  error?: string;
}

export default function TextDesignerDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TextDesignResult | null>(null);
  const [formData, setFormData] = useState({
    designType: 'brochure',
    title: 'Company Services',
    subtitle: 'Professional Solutions for Your Business',
    content: ['Service 1: Consultation', 'Service 2: Implementation', 'Service 3: Support'],
    companyName: 'Your Company Name',
    contactInfo: {
      phone: '+1-555-0123',
      email: 'info@company.com',
      website: 'www.company.com',
      address: '123 Business St, City, State 12345',
    },
    style: 'modern',
    colorScheme: 'professional',
    layout: 'single-column',
    orientation: 'portrait',
    size: '1024x1536',
    quality: 'high',
    customInstructions: '',
    context: 'Business marketing material',
    targetAudience: 'Business professionals',
    callToAction: 'Contact us today!',
    logo: 'Modern company logo with clean design',
    images: ['Professional business image', 'Team photo'],
    typography: {
      primaryFont: 'Arial',
      secondaryFont: 'Helvetica',
      headingSize: 'large',
      bodySize: 'medium',
    },
  });

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleContentChange = (index: number, value: string) => {
    const newContent = [...formData.content];
    newContent[index] = value;
    setFormData(prev => ({
      ...prev,
      content: newContent,
    }));
  };

  const addContentItem = () => {
    setFormData(prev => ({
      ...prev,
      content: [...prev.content, ''],
    }));
  };

  const removeContentItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
  };

  const generateDesign = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/dreamcut/text-designer', {
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

  const downloadImage = () => {
    if (result?.success && result.design?.data?.data?.[0]?.b64_json) {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${result.design.data.data[0].b64_json}`;
      link.download = `${formData.designType}-design.png`;
      link.click();
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">GPT Image 1 Text Designer</h1>
        <p className="text-muted-foreground">
          Generate professional text-heavy designs with extremely detailed prompts
        </p>
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-red-600 font-bold text-lg">⚠️</div>
            <div>
              <h3 className="font-semibold text-red-800 mb-1">Critical Limitation</h3>
              <p className="text-red-700 text-sm">
                <strong>GPT Image 1 has extremely poor face character consistency.</strong> 
                Never use this model on images containing faces or characters, as it will likely 
                change or distort facial features. Use only for text-heavy designs without faces.
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
              <Type className="h-5 w-5" />
              Design Configuration
            </CardTitle>
            <CardDescription>
              Configure your text-heavy design with detailed specifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="designType">Design Type</Label>
                    <Select value={formData.designType} onValueChange={(value) => handleInputChange('designType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brochure">Brochure</SelectItem>
                        <SelectItem value="flyer">Flyer</SelectItem>
                        <SelectItem value="poster">Poster</SelectItem>
                        <SelectItem value="business-card">Business Card</SelectItem>
                        <SelectItem value="banner">Banner</SelectItem>
                        <SelectItem value="newsletter">Newsletter</SelectItem>
                        <SelectItem value="menu">Menu</SelectItem>
                        <SelectItem value="invitation">Invitation</SelectItem>
                        <SelectItem value="certificate">Certificate</SelectItem>
                        <SelectItem value="label">Label</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="style">Style</Label>
                    <Select value={formData.style} onValueChange={(value) => handleInputChange('style', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="minimalist">Minimalist</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="elegant">Elegant</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                        <SelectItem value="vintage">Vintage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter design title"
                  />
                </div>

                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    placeholder="Enter subtitle (optional)"
                  />
                </div>

                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div>
                  <Label>Content Items</Label>
                  <div className="space-y-2 mt-2">
                    {formData.content.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={item}
                          onChange={(e) => handleContentChange(index, e.target.value)}
                          placeholder={`Content item ${index + 1}`}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeContentItem(index)}
                          disabled={formData.content.length === 1}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addContentItem}>
                      Add Content Item
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="callToAction">Call to Action</Label>
                  <Input
                    id="callToAction"
                    value={formData.callToAction}
                    onChange={(e) => handleInputChange('callToAction', e.target.value)}
                    placeholder="Enter call to action"
                  />
                </div>

                <div>
                  <Label htmlFor="logo">Logo Description</Label>
                  <Textarea
                    id="logo"
                    value={formData.logo}
                    onChange={(e) => handleInputChange('logo', e.target.value)}
                    placeholder="Describe the logo to include"
                    rows={2}
                  />
                </div>
              </TabsContent>

              <TabsContent value="style" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="colorScheme">Color Scheme</Label>
                    <Select value={formData.colorScheme} onValueChange={(value) => handleInputChange('colorScheme', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="vibrant">Vibrant</SelectItem>
                        <SelectItem value="monochrome">Monochrome</SelectItem>
                        <SelectItem value="pastel">Pastel</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="layout">Layout</Label>
                    <Select value={formData.layout} onValueChange={(value) => handleInputChange('layout', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single-column">Single Column</SelectItem>
                        <SelectItem value="two-column">Two Column</SelectItem>
                        <SelectItem value="three-column">Three Column</SelectItem>
                        <SelectItem value="grid">Grid</SelectItem>
                        <SelectItem value="asymmetric">Asymmetric</SelectItem>
                        <SelectItem value="centered">Centered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="orientation">Orientation</Label>
                    <Select value={formData.orientation} onValueChange={(value) => handleInputChange('orientation', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="landscape">Landscape</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="size">Size</Label>
                    <Select value={formData.size} onValueChange={(value) => handleInputChange('size', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1024x1024">1024x1024</SelectItem>
                        <SelectItem value="1024x1536">1024x1536</SelectItem>
                        <SelectItem value="1536x1024">1536x1024</SelectItem>
                        <SelectItem value="auto">Auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="quality">Quality</Label>
                  <Select value={formData.quality} onValueChange={(value) => handleInputChange('quality', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div>
                  <Label htmlFor="context">Context</Label>
                  <Textarea
                    id="context"
                    value={formData.context}
                    onChange={(e) => handleInputChange('context', e.target.value)}
                    placeholder="Describe the context and purpose of this design"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Input
                    id="targetAudience"
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    placeholder="Describe the target audience"
                  />
                </div>

                <div>
                  <Label htmlFor="customInstructions">Custom Instructions</Label>
                  <Textarea
                    id="customInstructions"
                    value={formData.customInstructions}
                    onChange={(e) => handleInputChange('customInstructions', e.target.value)}
                    placeholder="Any additional specific requirements"
                    rows={3}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />

            <Button
              onClick={generateDesign}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Design...
                </>
              ) : (
                <>
                  <Type className="mr-2 h-4 w-4" />
                  Generate Text Design
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
              Generated Design
            </CardTitle>
            <CardDescription>
              View and download your generated text design
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Generating your design...</p>
                </div>
              </div>
            )}

            {result && !isLoading && (
              <div className="space-y-4">
                {result.success && result.design ? (
                  <>
                    <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                      {result.design.data.data[0]?.b64_json ? (
                        <img
                          src={`data:image/png;base64,${result.design.data.data[0].b64_json}`}
                          alt="Generated design"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          No image data available
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-xs text-muted-foreground">Design Type</Label>
                        <p className="font-medium">{result.design.metadata.designType}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Size</Label>
                        <p className="font-medium">{result.design.metadata.size}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Quality</Label>
                        <p className="font-medium">{result.design.metadata.quality}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Cost</Label>
                        <p className="font-medium">${result.design.metadata.cost.toFixed(4)}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Processing Time</Label>
                        <p className="font-medium">{result.design.metadata.processingTime}ms</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Tokens</Label>
                        <p className="font-medium">{result.design.metadata.estimatedTokens}</p>
                      </div>
                    </div>

                    <Button onClick={downloadImage} className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download Design
                    </Button>
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
                <Type className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Configure your design and click "Generate Text Design" to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
