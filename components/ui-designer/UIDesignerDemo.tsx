/**
 * UI Designer Demo Component
 * 
 * Interactive demo for testing GPT Image 1 UI/UX design capabilities.
 * Supports web apps, mobile apps, dashboards, and other interface designs.
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
import { Loader2, Download, Eye, Settings, Palette, Monitor, Smartphone } from 'lucide-react';

interface UIDesignResult {
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

export default function UIDesignerDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<UIDesignResult | null>(null);
  const [formData, setFormData] = useState({
    designType: 'web-app',
    appName: 'TaskManager Pro',
    description: 'A modern task management application for teams',
    features: ['Task creation and management', 'Team collaboration', 'Progress tracking', 'Deadline reminders'],
    targetUsers: 'Business professionals and teams',
    style: 'modern',
    colorScheme: 'professional',
    layout: 'single-page',
    orientation: 'landscape',
    size: '1536x1024',
    quality: 'high',
    customInstructions: '',
    context: 'Business productivity application',
    branding: {
      logo: 'Modern, minimalist logo with clean lines',
      tagline: 'Streamline Your Workflow',
      companyName: 'Productivity Solutions Inc.',
    },
    navigation: {
      type: 'header',
      items: ['Dashboard', 'Tasks', 'Team', 'Reports', 'Settings'],
    },
    content: {
      hero: 'Welcome to TaskManager Pro - The ultimate productivity solution',
      sections: ['Dashboard Overview', 'Task Management', 'Team Collaboration', 'Analytics'],
      callToAction: 'Get Started Today',
    },
    typography: {
      primaryFont: 'Inter',
      secondaryFont: 'Roboto',
      headingSize: 'large',
      bodySize: 'medium',
    },
    components: {
      buttons: ['Primary Button', 'Secondary Button', 'Icon Button'],
      forms: ['Login Form', 'Task Creation Form', 'User Profile Form'],
      cards: ['Task Card', 'User Card', 'Stats Card'],
      modals: ['Confirmation Modal', 'Settings Modal'],
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

  const handleFeaturesChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures,
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const generateDesign = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/dreamcut/ui-designer', {
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
        <h1 className="text-3xl font-bold mb-2">GPT Image 1 UI Designer</h1>
        <p className="text-muted-foreground">
          Generate professional UI/UX designs with extremely detailed prompts
        </p>
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-red-600 font-bold text-lg">⚠️</div>
            <div>
              <h3 className="font-semibold text-red-800 mb-1">Critical Limitation</h3>
              <p className="text-red-700 text-sm">
                <strong>GPT Image 1 has extremely poor face character consistency.</strong> 
                Never use this model for UI designs that include faces or characters (avatars, 
                profile pictures, etc.), as it will likely change or distort facial features.
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
              <Monitor className="h-5 w-5" />
              UI Design Configuration
            </CardTitle>
            <CardDescription>
              Configure your UI/UX design with detailed specifications
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
                        <SelectItem value="web-app">Web App</SelectItem>
                        <SelectItem value="mobile-app">Mobile App</SelectItem>
                        <SelectItem value="dashboard">Dashboard</SelectItem>
                        <SelectItem value="landing-page">Landing Page</SelectItem>
                        <SelectItem value="admin-panel">Admin Panel</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="portfolio">Portfolio</SelectItem>
                        <SelectItem value="blog">Blog</SelectItem>
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="game-ui">Game UI</SelectItem>
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
                        <SelectItem value="minimalist">Minimalist</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="elegant">Elegant</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                        <SelectItem value="material">Material</SelectItem>
                        <SelectItem value="flat">Flat</SelectItem>
                        <SelectItem value="neumorphism">Neumorphism</SelectItem>
                        <SelectItem value="glassmorphism">Glassmorphism</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="appName">App Name</Label>
                  <Input
                    id="appName"
                    value={formData.appName}
                    onChange={(e) => handleInputChange('appName', e.target.value)}
                    placeholder="Enter app name"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your application"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="targetUsers">Target Users</Label>
                  <Input
                    id="targetUsers"
                    value={formData.targetUsers}
                    onChange={(e) => handleInputChange('targetUsers', e.target.value)}
                    placeholder="Describe your target users"
                  />
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div>
                  <Label>Features</Label>
                  <div className="space-y-2 mt-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={feature}
                          onChange={(e) => handleFeaturesChange(index, e.target.value)}
                          placeholder={`Feature ${index + 1}`}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFeature(index)}
                          disabled={formData.features.length === 1}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addFeature}>
                      Add Feature
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="hero">Hero Section</Label>
                  <Input
                    id="hero"
                    value={formData.content.hero}
                    onChange={(e) => handleInputChange('content.hero', e.target.value)}
                    placeholder="Enter hero section text"
                  />
                </div>

                <div>
                  <Label htmlFor="callToAction">Call to Action</Label>
                  <Input
                    id="callToAction"
                    value={formData.content.callToAction}
                    onChange={(e) => handleInputChange('content.callToAction', e.target.value)}
                    placeholder="Enter call to action text"
                  />
                </div>

                <div>
                  <Label htmlFor="logo">Logo Description</Label>
                  <Textarea
                    id="logo"
                    value={formData.branding.logo}
                    onChange={(e) => handleInputChange('branding.logo', e.target.value)}
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
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
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
                        <SelectItem value="single-page">Single Page</SelectItem>
                        <SelectItem value="multi-page">Multi Page</SelectItem>
                        <SelectItem value="dashboard">Dashboard</SelectItem>
                        <SelectItem value="grid">Grid</SelectItem>
                        <SelectItem value="sidebar">Sidebar</SelectItem>
                        <SelectItem value="tabs">Tabs</SelectItem>
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
                    placeholder="Describe the context and purpose of this UI"
                    rows={2}
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

                <div>
                  <Label htmlFor="navigationType">Navigation Type</Label>
                  <Select value={formData.navigation.type} onValueChange={(value) => handleInputChange('navigation.type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="header">Header</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="floating">Floating</SelectItem>
                      <SelectItem value="hamburger">Hamburger</SelectItem>
                    </SelectContent>
                  </Select>
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
                  Generating UI Design...
                </>
              ) : (
                <>
                  <Monitor className="mr-2 h-4 w-4" />
                  Generate UI Design
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
              Generated UI Design
            </CardTitle>
            <CardDescription>
              View and download your generated UI design
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Generating your UI design...</p>
                </div>
              </div>
            )}

            {result && !isLoading && (
              <div className="space-y-4">
                {result.success && result.design ? (
                  <>
                    <div className="aspect-[3/2] bg-muted rounded-lg overflow-hidden">
                      {result.design.data.data[0]?.b64_json ? (
                        <img
                          src={`data:image/png;base64,${result.design.data.data[0].b64_json}`}
                          alt="Generated UI design"
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
                      Download UI Design
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
                <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Configure your UI design and click "Generate UI Design" to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
