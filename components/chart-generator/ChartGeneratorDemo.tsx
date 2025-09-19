"use client";

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Download, RefreshCw, BarChart3, PieChart, TrendingUp, Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ChartData {
  label: string;
  value: number;
  category?: string;
  color?: string;
}

interface ChartGeneratorState {
  chartType: string;
  title: string;
  subtitle: string;
  xAxisLabel: string;
  yAxisLabel: string;
  style: string;
  colorScheme: string;
  quality: string;
  outputFormat: string;
  data: ChartData[];
  customInstructions: string;
  context: string;
}

const CHART_TYPES = [
  { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
  { value: 'line', label: 'Line Chart', icon: TrendingUp },
  { value: 'pie', label: 'Pie Chart', icon: PieChart },
  { value: 'scatter', label: 'Scatter Plot', icon: Activity },
  { value: 'area', label: 'Area Chart', icon: Activity },
  { value: 'histogram', label: 'Histogram', icon: BarChart3 },
  { value: 'heatmap', label: 'Heatmap', icon: Activity },
  { value: 'dashboard', label: 'Dashboard', icon: Activity },
  { value: 'infographic', label: 'Infographic', icon: Activity },
  { value: 'flowchart', label: 'Flowchart', icon: Activity },
  { value: 'mindmap', label: 'Mind Map', icon: Activity },
  { value: 'timeline', label: 'Timeline', icon: Activity },
];

const STYLES = [
  { value: 'modern', label: 'Modern' },
  { value: 'classic', label: 'Classic' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'creative', label: 'Creative' },
  { value: 'scientific', label: 'Scientific' },
];

const COLOR_SCHEMES = [
  { value: 'professional', label: 'Professional' },
  { value: 'vibrant', label: 'Vibrant' },
  { value: 'monochrome', label: 'Monochrome' },
  { value: 'pastel', label: 'Pastel' },
  { value: 'dark', label: 'Dark' },
];

const QUALITY_LEVELS = [
  { value: 'low', label: 'Low (Fast)' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High (Best)' },
  { value: 'auto', label: 'Auto' },
];

const OUTPUT_FORMATS = [
  { value: 'png', label: 'PNG' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'webp', label: 'WebP' },
];

const SAMPLE_DATA = {
  sales: [
    { label: 'Q1 2024', value: 120000 },
    { label: 'Q2 2024', value: 150000 },
    { label: 'Q3 2024', value: 180000 },
    { label: 'Q4 2024', value: 200000 },
  ],
  marketShare: [
    { label: 'Company A', value: 35 },
    { label: 'Company B', value: 25 },
    { label: 'Company C', value: 20 },
    { label: 'Others', value: 20 },
  ],
  trends: [
    { label: 'Jan', value: 100 },
    { label: 'Feb', value: 120 },
    { label: 'Mar', value: 110 },
    { label: 'Apr', value: 140 },
    { label: 'May', value: 160 },
    { label: 'Jun', value: 150 },
  ],
};

export default function ChartGeneratorDemo() {
  const [state, setState] = useState<ChartGeneratorState>({
    chartType: 'bar',
    title: 'Sales Performance',
    subtitle: '',
    xAxisLabel: 'Quarter',
    yAxisLabel: 'Sales ($)',
    style: 'corporate',
    colorScheme: 'professional',
    quality: 'high',
    outputFormat: 'png',
    data: SAMPLE_DATA.sales,
    customInstructions: '',
    context: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedChart, setGeneratedChart] = useState<{
    base64Data: string;
    metadata: any;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateState = useCallback((updates: Partial<ChartGeneratorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const loadSampleData = useCallback((sampleType: keyof typeof SAMPLE_DATA) => {
    const sample = SAMPLE_DATA[sampleType];
    updateState({ data: sample });
    
    // Update title based on sample type
    const titles = {
      sales: 'Sales Performance',
      marketShare: 'Market Share Distribution',
      trends: 'Trend Analysis',
    };
    updateState({ title: titles[sampleType] });
  }, [updateState]);

  const generateChart = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedChart(null);

    try {
      const response = await fetch('/api/dreamcut/chart-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chartType: state.chartType,
          data: state.data,
          title: state.title,
          subtitle: state.subtitle || undefined,
          xAxisLabel: state.xAxisLabel || undefined,
          yAxisLabel: state.yAxisLabel || undefined,
          style: state.style,
          colorScheme: state.colorScheme,
          quality: state.quality,
          outputFormat: state.outputFormat,
          customInstructions: state.customInstructions || undefined,
          context: state.context || undefined,
        }),
      });

      const result = await response.json();

      if (result.success && result.result.success) {
        setGeneratedChart({
          base64Data: result.result.chart.base64Data,
          metadata: result.result.chart.metadata,
        });
        toast({
          title: "Chart Generated Successfully",
          description: `Generated ${state.chartType} chart in ${result.result.chart.metadata.processingTime}ms`,
        });
      } else {
        throw new Error(result.error || result.result?.error || 'Failed to generate chart');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast({
        title: "Chart Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [state]);

  const downloadChart = useCallback(() => {
    if (!generatedChart) return;

    const link = document.createElement('a');
    link.href = `data:image/${state.outputFormat};base64,${generatedChart.base64Data}`;
    link.download = `${state.title.replace(/[^a-zA-Z0-9]/g, '_')}.${state.outputFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedChart, state.title, state.outputFormat]);

  const addDataPoint = useCallback(() => {
    updateState({
      data: [...state.data, { label: `Item ${state.data.length + 1}`, value: 0 }],
    });
  }, [state.data, updateState]);

  const updateDataPoint = useCallback((index: number, field: keyof ChartData, value: string | number) => {
    const newData = [...state.data];
    newData[index] = { ...newData[index], [field]: value };
    updateState({ data: newData });
  }, [state.data, updateState]);

  const removeDataPoint = useCallback((index: number) => {
    const newData = state.data.filter((_, i) => i !== index);
    updateState({ data: newData });
  }, [state.data, updateState]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">GPT Image 1 Chart Generator</h1>
        <p className="text-muted-foreground">
          Generate professional charts, graphs, and diagrams using GPT Image 1 - the ONLY model capable of detailed chart generation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Chart Configuration</CardTitle>
            <CardDescription>
              Configure your chart parameters and data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Chart Type */}
            <div className="space-y-2">
              <Label htmlFor="chartType">Chart Type</Label>
              <Select value={state.chartType} onValueChange={(value) => updateState({ chartType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHART_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={state.title}
                onChange={(e) => updateState({ title: e.target.value })}
                placeholder="Chart title"
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle (Optional)</Label>
              <Input
                id="subtitle"
                value={state.subtitle}
                onChange={(e) => updateState({ subtitle: e.target.value })}
                placeholder="Chart subtitle"
              />
            </div>

            {/* Axis Labels */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="xAxisLabel">X-Axis Label</Label>
                <Input
                  id="xAxisLabel"
                  value={state.xAxisLabel}
                  onChange={(e) => updateState({ xAxisLabel: e.target.value })}
                  placeholder="X-axis label"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yAxisLabel">Y-Axis Label</Label>
                <Input
                  id="yAxisLabel"
                  value={state.yAxisLabel}
                  onChange={(e) => updateState({ yAxisLabel: e.target.value })}
                  placeholder="Y-axis label"
                />
              </div>
            </div>

            {/* Style and Color Scheme */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="style">Style</Label>
                <Select value={state.style} onValueChange={(value) => updateState({ style: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STYLES.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="colorScheme">Color Scheme</Label>
                <Select value={state.colorScheme} onValueChange={(value) => updateState({ colorScheme: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLOR_SCHEMES.map((scheme) => (
                      <SelectItem key={scheme.value} value={scheme.value}>
                        {scheme.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quality and Format */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quality">Quality</Label>
                <Select value={state.quality} onValueChange={(value) => updateState({ quality: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUALITY_LEVELS.map((quality) => (
                      <SelectItem key={quality.value} value={quality.value}>
                        {quality.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="outputFormat">Output Format</Label>
                <Select value={state.outputFormat} onValueChange={(value) => updateState({ outputFormat: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OUTPUT_FORMATS.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Custom Instructions */}
            <div className="space-y-2">
              <Label htmlFor="customInstructions">Custom Instructions (Optional)</Label>
              <Textarea
                id="customInstructions"
                value={state.customInstructions}
                onChange={(e) => updateState({ customInstructions: e.target.value })}
                placeholder="Additional instructions for chart generation..."
                rows={3}
              />
            </div>

            {/* Context */}
            <div className="space-y-2">
              <Label htmlFor="context">Context (Optional)</Label>
              <Textarea
                id="context"
                value={state.context}
                onChange={(e) => updateState({ context: e.target.value })}
                placeholder="Additional context about the data or use case..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data and Actions Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Data Configuration</CardTitle>
            <CardDescription>
              Configure your chart data and sample datasets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sample Data Buttons */}
            <div className="space-y-2">
              <Label>Sample Datasets</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadSampleData('sales')}
                >
                  Sales Data
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadSampleData('marketShare')}
                >
                  Market Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadSampleData('trends')}
                >
                  Trends
                </Button>
              </div>
            </div>

            <Separator />

            {/* Data Points */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Data Points</Label>
                <Button variant="outline" size="sm" onClick={addDataPoint}>
                  Add Point
                </Button>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {state.data.map((point, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={point.label}
                      onChange={(e) => updateDataPoint(index, 'label', e.target.value)}
                      placeholder="Label"
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={point.value}
                      onChange={(e) => updateDataPoint(index, 'value', Number(e.target.value))}
                      placeholder="Value"
                      className="w-20"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeDataPoint(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Generate Button */}
            <Button
              onClick={generateChart}
              disabled={isGenerating || state.data.length === 0}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Chart...
                </>
              ) : (
                <>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Generate Chart
                </>
              )}
            </Button>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Generated Chart Display */}
      {generatedChart && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Generated Chart</CardTitle>
                <CardDescription>
                  Your chart has been generated successfully
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={downloadChart}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" onClick={generateChart}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Chart Image */}
              <div className="flex justify-center">
                <img
                  src={`data:image/${state.outputFormat};base64,${generatedChart.base64Data}`}
                  alt={state.title}
                  className="max-w-full h-auto rounded-lg border"
                />
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{generatedChart.metadata.dataPoints}</div>
                  <div className="text-sm text-muted-foreground">Data Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{generatedChart.metadata.processingTime}ms</div>
                  <div className="text-sm text-muted-foreground">Processing Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">${generatedChart.metadata.cost.toFixed(4)}</div>
                  <div className="text-sm text-muted-foreground">Cost</div>
                </div>
                <div className="text-center">
                  <Badge variant="secondary">{generatedChart.metadata.chartType}</Badge>
                  <div className="text-sm text-muted-foreground mt-1">Chart Type</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
