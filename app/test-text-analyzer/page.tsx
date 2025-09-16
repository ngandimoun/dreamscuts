"use client";

import React from 'react';
import { TextAnalyzer } from '@/components/chat/TextAnalyzer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, CheckCircle, AlertTriangle, Brain, FileText, Search, BookOpen } from 'lucide-react';
import type { TextAnalysisResult } from '@/hooks/useTextAnalyzer';

export default function TestTextAnalyzerPage() {
  const handleAnalysisComplete = (result: TextAnalysisResult) => {
    console.log('Text analysis completed:', result);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Text Asset Analyzer Test</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Test the enhanced text understanding system with curated AI models and automatic fallback logic
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
              Uses 4 state-of-the-art text understanding models with automatic fallback
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-green-500" />
              Comprehensive Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Supports 18 different analysis types from sentiment to legal analysis
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">1</Badge>
                <span className="font-medium">GPT-5</span>
              </div>
              <p className="text-xs text-muted-foreground">
                OpenAI's most capable model for advanced reasoning, code generation, and instruction following
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">2</Badge>
                <span className="font-medium">Claude-Sonnet-4</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Hybrid reasoning model with near-instant responses and extended thinking capabilities
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">3</Badge>
                <span className="font-medium">GPT-5-Mini</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Faster version of GPT-5 with balanced speed and cost for real-time applications
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">4</Badge>
                <span className="font-medium">Qwen3-235B-Instruct</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Updated Qwen3 model with 235B parameters and enhanced instruction following
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
            Choose from 18 different analysis types for comprehensive text understanding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { type: 'Sentiment Analysis', desc: 'Analyze emotional tone and sentiment' },
              { type: 'Content Summarization', desc: 'Summarize key points and main ideas' },
              { type: 'Language Detection', desc: 'Identify the language(s) used' },
              { type: 'Keyword Extraction', desc: 'Extract important keywords and phrases' },
              { type: 'Topic Modeling', desc: 'Identify main topics and themes' },
              { type: 'Text Classification', desc: 'Classify text into categories' },
              { type: 'Named Entity Recognition', desc: 'Identify people, places, organizations' },
              { type: 'Intent Analysis', desc: 'Analyze purpose and intent' },
              { type: 'Readability Analysis', desc: 'Assess reading level and complexity' },
              { type: 'Translation', desc: 'Translate to different languages' },
              { type: 'Paraphrasing', desc: 'Rewrite with different words' },
              { type: 'Creative Writing', desc: 'Analyze creative elements and style' },
              { type: 'Technical Analysis', desc: 'Analyze technical content' },
              { type: 'Educational Content', desc: 'Assess educational value' },
              { type: 'Marketing Analysis', desc: 'Analyze marketing aspects' },
              { type: 'Legal Analysis', desc: 'Analyze legal implications' },
              { type: 'Medical Analysis', desc: 'Analyze medical content' },
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
            Try these example texts to test the analyzer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Example Texts:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• <strong>Sentiment:</strong> "I absolutely love this new product! It's amazing and exceeded all my expectations."</li>
                  <li>• <strong>Technical:</strong> "The API endpoint returns a JSON response with status codes 200 for success and 400 for client errors."</li>
                  <li>• <strong>Marketing:</strong> "Transform your business with our revolutionary AI-powered solution that increases productivity by 300%."</li>
                  <li>• <strong>Educational:</strong> "Photosynthesis is the process by which plants convert light energy into chemical energy using chlorophyll."</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Main Analyzer Component */}
      <TextAnalyzer onAnalysisComplete={handleAnalysisComplete} />

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
                <div><strong>POST</strong> /api/dreamcut/text-analyzer</div>
                <div className="text-muted-foreground mt-1">Analyze single or multiple text documents</div>
              </div>
            </div>
            
            <div className="p-3 bg-muted rounded-lg">
              <div className="font-mono text-sm">
                <div><strong>GET</strong> /api/dreamcut/text-analyzer?action=models</div>
                <div className="text-muted-foreground mt-1">Get available models and capabilities</div>
              </div>
            </div>
            
            <div className="p-3 bg-muted rounded-lg">
              <div className="font-mono text-sm">
                <div><strong>GET</strong> /api/dreamcut/text-analyzer?action=recommendations</div>
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
          <strong>Integration Ready:</strong> The text analyzer is fully integrated with the query analyzer system. 
          When users upload text content, the system will automatically use the enhanced text analysis with fallback models.
        </AlertDescription>
      </Alert>
    </div>
  );
}
