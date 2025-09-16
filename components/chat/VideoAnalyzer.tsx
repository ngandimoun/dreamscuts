"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Video, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { useVideoAnalyzer } from '@/hooks/useVideoAnalyzer';
import type { VideoAnalysisInput, VideoAnalysisResult } from '@/hooks/useVideoAnalyzer';

interface VideoAnalyzerProps {
  onAnalysisComplete?: (result: VideoAnalysisResult) => void;
  className?: string;
}

const ANALYSIS_TYPES = [
  { value: 'content_analysis', label: 'Content Analysis', description: 'Comprehensive video content analysis' },
  { value: 'scene_analysis', label: 'Scene Analysis', description: 'Analyze scenes and visual elements' },
  { value: 'activity_recognition', label: 'Activity Recognition', description: 'Identify activities and actions' },
  { value: 'question_answering', label: 'Question Answering', description: 'Answer questions about video content' },
  { value: 'summarization', label: 'Summarization', description: 'Provide video summary' },
  { value: 'educational', label: 'Educational', description: 'Analyze educational content' },
  { value: 'entertainment', label: 'Entertainment', description: 'Analyze entertainment value' },
  { value: 'sports', label: 'Sports', description: 'Analyze sports content' },
  { value: 'cooking', label: 'Cooking', description: 'Analyze cooking processes' },
  { value: 'custom', label: 'Custom', description: 'Custom analysis' }
] as const;

export function VideoAnalyzer({ onAnalysisComplete, className }: VideoAnalyzerProps) {
  const [videoUrl, setVideoUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [userDescription, setUserDescription] = useState('');
  const [analysisType, setAnalysisType] = useState<VideoAnalysisInput['analysisType']>('content_analysis');
  
  const { 
    isLoading, 
    error, 
    lastResult, 
    analyzeVideo, 
    clearError, 
    validateVideoUrl 
  } = useVideoAnalyzer();

  const handleAnalyze = async () => {
    if (!videoUrl.trim() || !prompt.trim()) {
      return;
    }

    const validation = validateVideoUrl(videoUrl);
    if (!validation.isValid) {
      return;
    }

    const result = await analyzeVideo({
      videoUrl: videoUrl.trim(),
      prompt: prompt.trim(),
      userDescription: userDescription.trim() || undefined,
      analysisType
    });

    if (onAnalysisComplete) {
      onAnalysisComplete(result);
    }
  };

  const handleClear = () => {
    setVideoUrl('');
    setPrompt('');
    setUserDescription('');
    setAnalysisType('content_analysis');
    clearError();
  };

  const isFormValid = videoUrl.trim() && prompt.trim();
  const urlValidation = videoUrl ? validateVideoUrl(videoUrl) : { isValid: true };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Video Content Analyzer
        </CardTitle>
        <CardDescription>
          Analyze video content using advanced AI models with automatic fallback
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Video URL Input */}
        <div className="space-y-2">
          <label htmlFor="video-url" className="text-sm font-medium">
            Video URL *
          </label>
          <div className="relative">
            <Input
              id="video-url"
              type="url"
              placeholder="https://example.com/video.mp4"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className={!urlValidation.isValid ? 'border-red-500' : ''}
            />
            {videoUrl && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                {urlValidation.isValid ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            )}
          </div>
          {!urlValidation.isValid && (
            <p className="text-sm text-red-500">{urlValidation.error}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Supported formats: MP4, AVI, MOV, WebM, MKV, M4V, GIF
          </p>
        </div>

        {/* Analysis Type Selection */}
        <div className="space-y-2">
          <label htmlFor="analysis-type" className="text-sm font-medium">
            Analysis Type
          </label>
          <Select value={analysisType} onValueChange={(value: any) => setAnalysisType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select analysis type" />
            </SelectTrigger>
            <SelectContent>
              {ANALYSIS_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs text-muted-foreground">{type.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Prompt Input */}
        <div className="space-y-2">
          <label htmlFor="prompt" className="text-sm font-medium">
            Analysis Prompt *
          </label>
          <Textarea
            id="prompt"
            placeholder="Describe what you want to analyze in the video..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />
        </div>

        {/* User Description Input */}
        <div className="space-y-2">
          <label htmlFor="user-description" className="text-sm font-medium">
            User Description (Optional)
          </label>
          <Textarea
            id="user-description"
            placeholder="Provide additional context about how you want to use this video..."
            value={userDescription}
            onChange={(e) => setUserDescription(e.target.value)}
            rows={2}
          />
          <p className="text-xs text-muted-foreground">
            This helps the AI understand your specific use case for the video
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleAnalyze}
            disabled={!isFormValid || isLoading || !urlValidation.isValid}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Video className="mr-2 h-4 w-4" />
                Analyze Video
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={isLoading}
          >
            Clear
          </Button>
        </div>

        {/* Results Display */}
        {lastResult && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {lastResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-medium">
                {lastResult.success ? 'Analysis Complete' : 'Analysis Failed'}
              </span>
            </div>

            {lastResult.success && (
              <div className="space-y-2">
                {/* Model Information */}
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    Model: {lastResult.model}
                  </Badge>
                  {lastResult.fallbackUsed && (
                    <Badge variant="outline" className="text-orange-600">
                      Fallback Used
                    </Badge>
                  )}
                  {lastResult.processingTime && (
                    <Badge variant="outline">
                      {lastResult.processingTime}ms
                    </Badge>
                  )}
                </div>

                {/* Analysis Result */}
                <div className="rounded-lg border bg-muted/50 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Analysis Result</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{lastResult.analysis}</p>
                </div>
              </div>
            )}

            {!lastResult.success && lastResult.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{lastResult.error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default VideoAnalyzer;
