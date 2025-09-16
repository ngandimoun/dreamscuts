"use client";

import React from 'react';
import { ImageAnalyzer } from '@/components/chat/ImageAnalyzer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, CheckCircle, AlertTriangle, Brain, Eye, Search } from 'lucide-react';
import type { ImageAnalysisResult } from '@/hooks/useImageAnalyzer';

export default function TestImageAnalyzerPage() {
  const handleAnalysisComplete = (result: ImageAnalysisResult) => {
    console.log('Image analysis completed:', result);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Image Asset Analyzer Test</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Test the enhanced image understanding system with curated AI models and automatic fallback logic
        </p>
      </div>

      {/* Feature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-blue-500" />
              Multi-Model Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Uses 5 state-of-the-art image understanding models with automatic fallback
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="h-5 w-5 text-green-500" />
              Comprehensive Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Supports 11 different analysis types from visual Q&A to medical analysis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-5 w-5 text-purple-500" />
              Smart Fallback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Automatically switches to backup models if primary model fails
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Model Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Available Models (Priority Order)
          </CardTitle>
          <CardDescription>
            The system uses these models in order with automatic fallback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">1</Badge>
                <span className="font-medium">LLaVA-13B</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Large multimodal model with high accuracy on visual reasoning tasks
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">2</Badge>
                <span className="font-medium">Molmo-7B</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Allen Institute model performing between GPT-4V and GPT-4o
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">3</Badge>
                <span className="font-medium">Qwen2-VL-7B</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Latest Qwen family model for multimodal conversations
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">4</Badge>
                <span className="font-medium">Qwen-VL-Chat</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Multimodal LLM trained with alignment techniques
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">5</Badge>
                <span className="font-medium">Moondream2</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Efficient edge device model with impressive benchmark scores
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Types */}
      <Card>
        <CardHeader>
          <CardTitle>Supported Analysis Types</CardTitle>
          <CardDescription>
            Choose from 11 different analysis types for comprehensive image understanding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { type: 'Visual Q&A', desc: 'Answer questions about the image' },
              { type: 'Object Detection', desc: 'Identify and locate objects' },
              { type: 'Text Recognition', desc: 'Extract and read text' },
              { type: 'Scene Analysis', desc: 'Analyze the overall scene' },
              { type: 'Creative Tasks', desc: 'Generate creative content' },
              { type: 'Problem Solving', desc: 'Identify and solve problems' },
              { type: 'Content Summary', desc: 'Summarize image content' },
              { type: 'Educational', desc: 'Educational content analysis' },
              { type: 'Marketing', desc: 'Marketing perspective analysis' },
              { type: 'Medical', desc: 'Medical image analysis' },
              { type: 'Custom', desc: 'Custom analysis prompt' }
            ].map((item, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="font-medium text-sm">{item.type}</div>
                <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Test Examples</CardTitle>
          <CardDescription>
            Try these example image URLs to test the analyzer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Example Image URLs:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• <code>https://images.unsplash.com/photo-1506905925346-21bda4d32df4</code> - Mountain landscape</li>
                  <li>• <code>https://images.unsplash.com/photo-1517849845537-4d257902454a</code> - Dog portrait</li>
                  <li>• <code>https://images.unsplash.com/photo-1558618047-3c8c76ca7d13</code> - City street</li>
                  <li>• <code>https://images.unsplash.com/photo-1560472354-b33ff0c44a43</code> - Food photography</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Main Analyzer Component */}
      <ImageAnalyzer onAnalysisComplete={handleAnalysisComplete} />

      {/* API Information */}
      <Card>
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
          <CardDescription>
            Available endpoints for programmatic access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-muted rounded-lg">
              <div className="font-mono text-sm">
                <div><strong>POST</strong> /api/dreamcut/image-analyzer</div>
                <div className="text-muted-foreground mt-1">Analyze single or multiple images</div>
              </div>
            </div>
            
            <div className="p-3 bg-muted rounded-lg">
              <div className="font-mono text-sm">
                <div><strong>GET</strong> /api/dreamcut/image-analyzer?action=models</div>
                <div className="text-muted-foreground mt-1">Get available models and capabilities</div>
              </div>
            </div>
            
            <div className="p-3 bg-muted rounded-lg">
              <div className="font-mono text-sm">
                <div><strong>GET</strong> /api/dreamcut/image-analyzer?action=recommendations</div>
                <div className="text-muted-foreground mt-1">Get model recommendations for analysis type</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Notes */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Integration Ready:</strong> The image analyzer is fully integrated with the query analyzer system. 
          When users upload images, the system will automatically use the enhanced image analysis with fallback models.
        </AlertDescription>
      </Alert>
    </div>
  );
}
