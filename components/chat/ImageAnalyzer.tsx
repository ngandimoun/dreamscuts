"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Image, CheckCircle, XCircle, AlertCircle, Info, Eye, Brain, Search } from 'lucide-react';
import { useImageAnalyzer } from '@/hooks/useImageAnalyzer';
import type { ImageAnalysisInput, ImageAnalysisResult } from '@/hooks/useImageAnalyzer';

interface ImageAnalyzerProps {
  onAnalysisComplete?: (result: ImageAnalysisResult) => void;
  className?: string;
}

const ANALYSIS_TYPES = [
  { value: 'visual_qa', label: 'Visual Q&A', description: 'Answer questions about the image' },
  { value: 'object_detection', label: 'Object Detection', description: 'Identify and locate objects' },
  { value: 'text_recognition', label: 'Text Recognition', description: 'Extract and read text' },
  { value: 'scene_analysis', label: 'Scene Analysis', description: 'Analyze the overall scene' },
  { value: 'creative_tasks', label: 'Creative Tasks', description: 'Generate creative content' },
  { value: 'problem_solving', label: 'Problem Solving', description: 'Identify and solve problems' },
  { value: 'content_summarization', label: 'Content Summary', description: 'Summarize image content' },
  { value: 'educational', label: 'Educational', description: 'Educational content analysis' },
  { value: 'marketing', label: 'Marketing', description: 'Marketing perspective analysis' },
  { value: 'medical', label: 'Medical', description: 'Medical image analysis' },
  { value: 'custom', label: 'Custom', description: 'Custom analysis prompt' }
];

const PRESET_PROMPTS = {
  visual_qa: "What do you see in this image? Describe the key elements, objects, and activities.",
  object_detection: "Identify and describe all the objects in this image. List their locations and characteristics.",
  text_recognition: "Extract and read all the text visible in this image. Transcribe any words, numbers, or symbols.",
  scene_analysis: "Analyze this scene and describe what is happening. What is the setting, mood, and main focus?",
  creative_tasks: "Create a creative story or narrative based on this image. What story does this image tell?",
  problem_solving: "Analyze this image and help solve any problems shown. What issues can you identify?",
  content_summarization: "Provide a detailed summary of what you see in this image. What are the main highlights?",
  educational: "Explain the educational content shown in this image. What can be learned from this visual?",
  marketing: "Analyze this image from a marketing perspective. What message does it convey?",
  medical: "Analyze this medical image carefully. Describe what you observe and any relevant medical information.",
  custom: "Analyze this image and provide detailed insights."
};

export function ImageAnalyzer({ onAnalysisComplete, className }: ImageAnalyzerProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [userDescription, setUserDescription] = useState('');
  const [analysisType, setAnalysisType] = useState<string>('visual_qa');
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { analyzeImage, isLoading, error, clearError } = useImageAnalyzer();

  const handleAnalysisTypeChange = (value: string) => {
    setAnalysisType(value);
    if (value !== 'custom') {
      setPrompt(PRESET_PROMPTS[value as keyof typeof PRESET_PROMPTS] || '');
    }
  };

  const handleAnalyze = async () => {
    if (!imageUrl.trim() || !prompt.trim()) {
      return;
    }

    clearError();
    setResult(null);

    const input: ImageAnalysisInput = {
      imageUrl: imageUrl.trim(),
      prompt: prompt.trim(),
      userDescription: userDescription.trim() || undefined,
      analysisType: analysisType as any
    };

    const analysisResult = await analyzeImage(input);
    setResult(analysisResult);
    
    if (onAnalysisComplete) {
      onAnalysisComplete(analysisResult);
    }
  };

  const handleClear = () => {
    setImageUrl('');
    setPrompt('');
    setUserDescription('');
    setAnalysisType('visual_qa');
    setResult(null);
    clearError();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Image Asset Analyzer
          </CardTitle>
          <CardDescription>
            Analyze images using advanced AI models with automatic fallback logic
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Image URL Input */}
          <div className="space-y-2">
            <label htmlFor="imageUrl" className="text-sm font-medium">
              Image URL
            </label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Analysis Type Selection */}
          <div className="space-y-2">
            <label htmlFor="analysisType" className="text-sm font-medium">
              Analysis Type
            </label>
            <Select value={analysisType} onValueChange={handleAnalysisTypeChange} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select analysis type" />
              </SelectTrigger>
              <SelectContent>
                {ANALYSIS_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{type.label}</span>
                      <span className="text-xs text-muted-foreground">{type.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              Analysis Prompt
            </label>
            <Textarea
              id="prompt"
              placeholder="Enter your analysis prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>

          {/* User Description (Optional) */}
          <div className="space-y-2">
            <label htmlFor="userDescription" className="text-sm font-medium">
              User Description (Optional)
            </label>
            <Textarea
              id="userDescription"
              placeholder="Describe how you want to use this image..."
              value={userDescription}
              onChange={(e) => setUserDescription(e.target.value)}
              disabled={isLoading}
              rows={2}
            />
          </div>

          {/* Advanced Options */}
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              disabled={isLoading}
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </Button>
            
            {showAdvanced && (
              <div className="p-4 border rounded-lg space-y-2 bg-muted/50">
                <div className="text-sm text-muted-foreground">
                  Advanced options are configured on the server side. 
                  The analyzer uses multiple models with automatic fallback.
                </div>
                <div className="text-xs text-muted-foreground">
                  Models: LLaVA-13B → Molmo-7B → Qwen2-VL-7B → Qwen-VL-Chat → Moondream2
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={handleAnalyze} 
              disabled={isLoading || !imageUrl.trim() || !prompt.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze Image
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleClear} disabled={isLoading}>
              Clear
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results Display */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Analysis Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.success ? (
              <>
                {/* Model Information */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary">
                    <Eye className="h-3 w-3 mr-1" />
                    {result.model}
                  </Badge>
                  {result.fallbackUsed && (
                    <Badge variant="outline">
                      Fallback Used
                    </Badge>
                  )}
                  {result.processingTime && (
                    <Badge variant="outline">
                      {result.processingTime}ms
                    </Badge>
                  )}
                </div>

                {/* Analysis Result */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Analysis:</label>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{result.analysis}</p>
                  </div>
                </div>
              </>
            ) : (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Analysis failed: {result.error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            About Image Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground">
            The Image Asset Analyzer uses multiple state-of-the-art AI models with automatic fallback:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">1</Badge>
              <span>LLaVA-13B - High accuracy visual reasoning</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">2</Badge>
              <span>Molmo-7B - Allen Institute model</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">3</Badge>
              <span>Qwen2-VL-7B - Latest Qwen multimodal</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">4</Badge>
              <span>Qwen-VL-Chat - Multimodal conversations</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">5</Badge>
              <span>Moondream2 - Efficient edge device model</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            If the primary model fails, the system automatically tries the next model in the sequence.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
