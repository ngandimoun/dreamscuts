"use client";

import React from 'react';
import { VideoAnalyzer } from '@/components/chat/VideoAnalyzer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';
import type { VideoAnalysisResult } from '@/hooks/useVideoAnalyzer';

export default function TestVideoAnalyzerPage() {
  const handleAnalysisComplete = (result: VideoAnalysisResult) => {
    console.log('Video analysis completed:', result);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Video Asset Analyzer Test</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Test the enhanced video analysis system with automatic fallback between multiple AI models.
          The system uses Qwen2-VL-7B-Instruct as the primary model with VideoLLaMA 3, Apollo 7B, and MiniCPM-V-4 as fallbacks.
        </p>
      </div>

      {/* Model Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Model Configuration
          </CardTitle>
          <CardDescription>
            The video analyzer uses these models in priority order with automatic fallback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="default">Primary</Badge>
                <span className="font-medium">Qwen2-VL-7B-Instruct</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Latest model in the Qwen family for chatting with video and image models
              </p>
              
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Fallback 1</Badge>
                <span className="font-medium">VideoLLaMA 3-7B</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Frontier Multimodal Foundation Models for Video Understanding
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Fallback 2</Badge>
                <span className="font-medium">Apollo 7B</span>
              </div>
              <p className="text-sm text-muted-foreground">
                An Exploration of Video Understanding in Large Multimodal Models
              </p>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline">Fallback 3</Badge>
                <span className="font-medium">MiniCPM-V-4</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Strong image and video understanding performance
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Automatic Fallback</h4>
              <p className="text-sm text-muted-foreground">
                If the primary model fails, automatically tries the next model in the priority list
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Multiple Analysis Types</h4>
              <p className="text-sm text-muted-foreground">
                Content analysis, scene analysis, activity recognition, and more
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">User Context</h4>
              <p className="text-sm text-muted-foreground">
                Include user descriptions to help the AI understand your specific use case
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Batch Processing</h4>
              <p className="text-sm text-muted-foreground">
                Analyze multiple videos simultaneously with the API
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> Make sure you have the required API keys configured in your environment:
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li><code>REPLICATE_API_TOKEN</code> - Required for all video analysis models</li>
            <li><code>TOGETHER_AI_API_KEY</code> - For fallback image analysis</li>
            <li><code>QWEN_API_KEY</code> - For additional fallback options</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Video Analyzer Component */}
      <VideoAnalyzer onAnalysisComplete={handleAnalysisComplete} />

      {/* API Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>API Usage Examples</CardTitle>
          <CardDescription>
            You can also use the video analyzer programmatically via the API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Single Video Analysis</h4>
            <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
{`fetch('/api/dreamcut/video-analyzer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    videoUrl: 'https://example.com/video.mp4',
    prompt: 'Describe what happens in this video',
    analysisType: 'content_analysis',
    userDescription: 'I want to use this for a presentation'
  })
})`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Batch Video Analysis</h4>
            <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
{`fetch('/api/dreamcut/video-analyzer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    videos: [
      {
        videoUrl: 'https://example.com/video1.mp4',
        prompt: 'Analyze this video',
        analysisType: 'content_analysis'
      },
      {
        videoUrl: 'https://example.com/video2.mp4',
        prompt: 'What activities are shown?',
        analysisType: 'activity_recognition'
      }
    ]
  })
})`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
