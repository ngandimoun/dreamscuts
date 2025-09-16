"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, FileText, CheckCircle, XCircle, AlertCircle, Info, Brain, Search, BookOpen } from 'lucide-react';
import { useTextAnalyzer } from '@/hooks/useTextAnalyzer';
import type { TextAnalysisInput, TextAnalysisResult } from '@/hooks/useTextAnalyzer';

interface TextAnalyzerProps {
  onAnalysisComplete?: (result: TextAnalysisResult) => void;
  className?: string;
}

const ANALYSIS_TYPES = [
  { value: 'sentiment_analysis', label: 'Sentiment Analysis', description: 'Analyze emotional tone and sentiment' },
  { value: 'content_summarization', label: 'Content Summarization', description: 'Summarize key points and main ideas' },
  { value: 'language_detection', label: 'Language Detection', description: 'Identify the language(s) used' },
  { value: 'keyword_extraction', label: 'Keyword Extraction', description: 'Extract important keywords and phrases' },
  { value: 'topic_modeling', label: 'Topic Modeling', description: 'Identify main topics and themes' },
  { value: 'text_classification', label: 'Text Classification', description: 'Classify text into categories' },
  { value: 'named_entity_recognition', label: 'Named Entity Recognition', description: 'Identify people, places, organizations' },
  { value: 'intent_analysis', label: 'Intent Analysis', description: 'Analyze purpose and intent' },
  { value: 'readability_analysis', label: 'Readability Analysis', description: 'Assess reading level and complexity' },
  { value: 'translation', label: 'Translation', description: 'Translate to different languages' },
  { value: 'paraphrasing', label: 'Paraphrasing', description: 'Rewrite with different words' },
  { value: 'creative_writing', label: 'Creative Writing', description: 'Analyze creative elements and style' },
  { value: 'technical_analysis', label: 'Technical Analysis', description: 'Analyze technical content' },
  { value: 'educational_content', label: 'Educational Content', description: 'Assess educational value' },
  { value: 'marketing_analysis', label: 'Marketing Analysis', description: 'Analyze marketing aspects' },
  { value: 'legal_analysis', label: 'Legal Analysis', description: 'Analyze legal implications' },
  { value: 'medical_analysis', label: 'Medical Analysis', description: 'Analyze medical content' },
  { value: 'custom', label: 'Custom', description: 'Custom analysis prompt' }
];

const PRESET_PROMPTS = {
  sentiment_analysis: "Analyze the sentiment of the following text. Determine if it's positive, negative, or neutral, and provide a confidence score. Explain the reasoning behind your analysis.",
  content_summarization: "Provide a comprehensive summary of the following text. Extract the key points, main ideas, and important details. Keep the summary concise but informative.",
  language_detection: "Identify the language(s) used in the following text. If multiple languages are present, specify which parts are in which language. Provide confidence scores for your identification.",
  keyword_extraction: "Extract the most important keywords and key phrases from the following text. Rank them by importance and relevance. Include both single words and multi-word phrases.",
  topic_modeling: "Identify the main topics and themes in the following text. Group related concepts together and explain how they relate to each other. Provide a topic hierarchy if applicable.",
  text_classification: "Classify the following text into appropriate categories. Determine the genre, type, or domain of the content. Provide multiple classification options with confidence scores.",
  named_entity_recognition: "Identify and extract all named entities from the following text. Categorize them as persons, organizations, locations, dates, or other relevant entities. Provide context for each entity.",
  intent_analysis: "Analyze the intent and purpose of the following text. Determine what the author is trying to achieve, their goals, and the underlying motivation. Classify the intent type.",
  readability_analysis: "Analyze the readability and complexity of the following text. Assess the reading level, sentence structure, vocabulary complexity, and overall accessibility. Provide suggestions for improvement.",
  translation: "Translate the following text to English (or specify target language). Maintain the original meaning, tone, and style. If the text is already in English, provide alternative translations or paraphrases.",
  paraphrasing: "Paraphrase the following text while maintaining the original meaning and key information. Use different words and sentence structures. Provide multiple paraphrasing options.",
  creative_writing: "Analyze the creative elements of the following text. Identify literary devices, writing techniques, style, and artistic qualities. Provide suggestions for creative enhancement.",
  technical_analysis: "Perform a technical analysis of the following text. Identify technical concepts, terminology, and domain-specific information. Explain complex technical content in accessible terms.",
  educational_content: "Analyze the educational value of the following text. Identify learning objectives, key concepts, and educational potential. Suggest how this content could be used for teaching or learning.",
  marketing_analysis: "Analyze the marketing aspects of the following text. Identify target audience, value propositions, persuasive techniques, and marketing effectiveness. Provide marketing insights and recommendations.",
  legal_analysis: "Analyze the legal aspects of the following text. Identify legal concepts, potential issues, compliance considerations, and legal implications. Provide legal insights and recommendations.",
  medical_analysis: "Analyze the medical content of the following text. Identify medical concepts, terminology, and health-related information. Provide medical insights while noting this is not medical advice.",
  custom: "Analyze the following text and provide detailed insights based on the specific requirements."
};

export function TextAnalyzer({ onAnalysisComplete, className }: TextAnalyzerProps) {
  const [text, setText] = useState('');
  const [prompt, setPrompt] = useState('');
  const [userDescription, setUserDescription] = useState('');
  const [analysisType, setAnalysisType] = useState<string>('content_summarization');
  const [result, setResult] = useState<TextAnalysisResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { analyzeText, isLoading, error, clearError } = useTextAnalyzer();

  const handleAnalysisTypeChange = (value: string) => {
    setAnalysisType(value);
    if (value !== 'custom') {
      setPrompt(PRESET_PROMPTS[value as keyof typeof PRESET_PROMPTS] || '');
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim() || !prompt.trim()) {
      return;
    }

    clearError();
    setResult(null);

    const input: TextAnalysisInput = {
      text: text.trim(),
      prompt: prompt.trim(),
      userDescription: userDescription.trim() || undefined,
      analysisType: analysisType as any
    };

    const analysisResult = await analyzeText(input);
    setResult(analysisResult);
    
    if (onAnalysisComplete) {
      onAnalysisComplete(analysisResult);
    }
  };

  const handleClear = () => {
    setText('');
    setPrompt('');
    setUserDescription('');
    setAnalysisType('content_summarization');
    setResult(null);
    clearError();
  };

  const getCharacterCount = () => {
    return text.length;
  };

  const getWordCount = () => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Text Asset Analyzer
          </CardTitle>
          <CardDescription>
            Analyze text content using advanced AI models with automatic fallback logic
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Text Input */}
          <div className="space-y-2">
            <label htmlFor="text" className="text-sm font-medium">
              Text Content
            </label>
            <Textarea
              id="text"
              placeholder="Enter the text you want to analyze..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
              rows={8}
              className="resize-none"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{getCharacterCount()} characters</span>
              <span>{getWordCount()} words</span>
            </div>
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
              rows={4}
            />
          </div>

          {/* User Description (Optional) */}
          <div className="space-y-2">
            <label htmlFor="userDescription" className="text-sm font-medium">
              User Description (Optional)
            </label>
            <Textarea
              id="userDescription"
              placeholder="Describe how you want to use this text..."
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
                  Models: GPT-5 → Claude-Sonnet-4 → GPT-5-Mini → Qwen3-235B-Instruct
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={handleAnalyze} 
              disabled={isLoading || !text.trim() || !prompt.trim()}
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
                  Analyze Text
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
                    <Search className="h-3 w-3 mr-1" />
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
            About Text Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground">
            The Text Asset Analyzer uses multiple state-of-the-art AI models with automatic fallback:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">1</Badge>
              <span>GPT-5 - Most capable model for advanced reasoning</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">2</Badge>
              <span>Claude-Sonnet-4 - Hybrid reasoning with extended thinking</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">3</Badge>
              <span>GPT-5-Mini - Fast and cost-effective</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">4</Badge>
              <span>Qwen3-235B - Enhanced instruction following</span>
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
