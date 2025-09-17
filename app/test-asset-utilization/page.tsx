'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Info, Upload, Image, Video, Music } from 'lucide-react';

interface AssetUtilizationTestResult {
  sessionMode: string;
  utilization: {
    utilizationRate: number;
    primaryAssets: string[];
    referenceOnlyAssets: string[];
    utilizationRationale: string;
    needsElevation: boolean;
    elevationSuggestions: string[];
  };
  narrative: {
    intro: string;
    core: string[];
    outro: string;
  };
  scaffolding?: any;
}

interface TestResults {
  assetDrivenHighQuality: AssetUtilizationTestResult;
  assetDrivenLowQuality: AssetUtilizationTestResult;
  assetFreeMode: AssetUtilizationTestResult;
  summary: {
    totalTests: number;
    passedTests: number;
    keyFindings: string[];
  };
}

export default function TestAssetUtilizationPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResults | null>(null);

  const runAssetUtilizationTest = async () => {
    setIsRunning(true);
    try {
      const response = await fetch('/api/dreamcut/asset-utilization-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        console.error('Test failed:', await response.text());
      }
    } catch (error) {
      console.error('Test error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getSessionModeIcon = (mode: string) => {
    switch (mode) {
      case 'asset_driven':
        return <Upload className="h-4 w-4 text-blue-500" />;
      case 'asset_free':
        return <Image className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSessionModeColor = (mode: string) => {
    switch (mode) {
      case 'asset_driven':
        return 'bg-blue-100 text-blue-800';
      case 'asset_free':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUtilizationRateColor = (rate: number) => {
    if (rate >= 0.8) return 'bg-green-100 text-green-800';
    if (rate >= 0.6) return 'bg-yellow-100 text-yellow-800';
    if (rate >= 0.4) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🎯 Asset Utilization Test</h1>
        <p className="text-gray-600">
          Test the enhanced asset utilization features that prevent the "reference only" issue
          and ensure user assets are always meaningfully integrated into the creative process.
        </p>
      </div>

      <div className="mb-6">
        <Button 
          onClick={runAssetUtilizationTest} 
          disabled={isRunning}
          className="w-full sm:w-auto"
        >
          {isRunning ? 'Running Tests...' : 'Run Asset Utilization Tests'}
        </Button>
      </div>

      {results && (
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Test Summary</CardTitle>
              <CardDescription>
                Asset utilization improvements across different scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-600">🎯 Asset-Driven (High Quality)</h4>
                  <div className="flex items-center gap-2">
                    <span>Session Mode:</span>
                    <Badge className={getSessionModeColor(results.assetDrivenHighQuality.sessionMode)}>
                      {results.assetDrivenHighQuality.sessionMode}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Utilization: {(results.assetDrivenHighQuality.utilization.utilizationRate * 100).toFixed(0)}% | 
                    Primary: {results.assetDrivenHighQuality.utilization.primaryAssets.length} | 
                    Reference: {results.assetDrivenHighQuality.utilization.referenceOnlyAssets.length}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-orange-600">⚠️ Asset-Driven (Low Quality)</h4>
                  <div className="flex items-center gap-2">
                    <span>Session Mode:</span>
                    <Badge className={getSessionModeColor(results.assetDrivenLowQuality.sessionMode)}>
                      {results.assetDrivenLowQuality.sessionMode}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Utilization: {(results.assetDrivenLowQuality.utilization.utilizationRate * 100).toFixed(0)}% | 
                    Primary: {results.assetDrivenLowQuality.utilization.primaryAssets.length} | 
                    Reference: {results.assetDrivenLowQuality.utilization.referenceOnlyAssets.length}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600">🚀 Asset-Free Mode</h4>
                  <div className="flex items-center gap-2">
                    <span>Session Mode:</span>
                    <Badge className={getSessionModeColor(results.assetFreeMode.sessionMode)}>
                      {results.assetFreeMode.sessionMode}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Utilization: {(results.assetFreeMode.utilization.utilizationRate * 100).toFixed(0)}% | 
                    Narrative Elements: {results.assetFreeMode.narrative.core.length} | 
                    Scaffolding: {results.assetFreeMode.scaffolding ? 'Available' : 'N/A'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Findings */}
          <Card>
            <CardHeader>
              <CardTitle>📈 Key Findings</CardTitle>
              <CardDescription>
                Improvements made to address the "reference only" issue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.summary.keyFindings.map((finding, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{finding}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Test Results */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Asset-Driven High Quality */}
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">🎯 Asset-Driven (High Quality)</CardTitle>
                <CardDescription>
                  High-quality assets should be elevated to primary use
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  {getSessionModeIcon(results.assetDrivenHighQuality.sessionMode)}
                  <Badge className={getSessionModeColor(results.assetDrivenHighQuality.sessionMode)}>
                    {results.assetDrivenHighQuality.sessionMode}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Utilization Rate:</span>
                    <Badge className={getUtilizationRateColor(results.assetDrivenHighQuality.utilization.utilizationRate)}>
                      {(results.assetDrivenHighQuality.utilization.utilizationRate * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Primary Assets:</span>
                    <span className="text-sm">{results.assetDrivenHighQuality.utilization.primaryAssets.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Reference Only:</span>
                    <span className="text-sm">{results.assetDrivenHighQuality.utilization.referenceOnlyAssets.length}</span>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {results.assetDrivenHighQuality.utilization.utilizationRationale}
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Narrative Spine:</h5>
                  <div className="text-xs space-y-1">
                    <div><strong>Intro:</strong> {results.assetDrivenHighQuality.narrative.intro}</div>
                    <div><strong>Core Elements:</strong> {results.assetDrivenHighQuality.narrative.core.length}</div>
                    <div><strong>Outro:</strong> {results.assetDrivenHighQuality.narrative.outro}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Asset-Driven Low Quality */}
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">⚠️ Asset-Driven (Low Quality)</CardTitle>
                <CardDescription>
                  Low-quality assets should be elevated from reference-only
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  {getSessionModeIcon(results.assetDrivenLowQuality.sessionMode)}
                  <Badge className={getSessionModeColor(results.assetDrivenLowQuality.sessionMode)}>
                    {results.assetDrivenLowQuality.sessionMode}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Utilization Rate:</span>
                    <Badge className={getUtilizationRateColor(results.assetDrivenLowQuality.utilization.utilizationRate)}>
                      {(results.assetDrivenLowQuality.utilization.utilizationRate * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Primary Assets:</span>
                    <span className="text-sm">{results.assetDrivenLowQuality.utilization.primaryAssets.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Reference Only:</span>
                    <span className="text-sm">{results.assetDrivenLowQuality.utilization.referenceOnlyAssets.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Needs Elevation:</span>
                    <Badge className={results.assetDrivenLowQuality.utilization.needsElevation ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}>
                      {results.assetDrivenLowQuality.utilization.needsElevation ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {results.assetDrivenLowQuality.utilization.utilizationRationale}
                  </AlertDescription>
                </Alert>

                {results.assetDrivenLowQuality.utilization.elevationSuggestions.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Elevation Suggestions:</h5>
                    <div className="space-y-1">
                      {results.assetDrivenLowQuality.utilization.elevationSuggestions.map((suggestion, index) => (
                        <div key={index} className="text-xs bg-orange-50 p-2 rounded">
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Asset-Free Mode */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">🚀 Asset-Free Mode</CardTitle>
                <CardDescription>
                  No assets provided - uses profile default scaffolding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  {getSessionModeIcon(results.assetFreeMode.sessionMode)}
                  <Badge className={getSessionModeColor(results.assetFreeMode.sessionMode)}>
                    {results.assetFreeMode.sessionMode}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Utilization Rate:</span>
                    <Badge className={getUtilizationRateColor(results.assetFreeMode.utilization.utilizationRate)}>
                      {(results.assetFreeMode.utilization.utilizationRate * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Narrative Elements:</span>
                    <span className="text-sm">{results.assetFreeMode.narrative.core.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Default Scaffolding:</span>
                    <Badge className={results.assetFreeMode.scaffolding ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {results.assetFreeMode.scaffolding ? 'Available' : 'Missing'}
                    </Badge>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {results.assetFreeMode.utilization.utilizationRationale}
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Default Scaffolding:</h5>
                  <div className="text-xs space-y-1">
                    <div><strong>Intro:</strong> {results.assetFreeMode.narrative.intro}</div>
                    <div><strong>Core Elements:</strong> {results.assetFreeMode.narrative.core.length}</div>
                    <div><strong>Outro:</strong> {results.assetFreeMode.narrative.outro}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Problem vs Solution */}
          <Card>
            <CardHeader>
              <CardTitle>🔧 Problem vs Solution</CardTitle>
              <CardDescription>
                How the new asset utilization system addresses the "reference only" issue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-red-600">❌ Before (Problem)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>Assets marked as "reference only"</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>No narrative structure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>Generic outputs without asset integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>User assets feel ignored</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-600">✅ After (Solution)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Assets elevated to meaningful roles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Clear narrative spine structure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Asset-driven or profile-based scaffolding</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>User assets always matter</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
