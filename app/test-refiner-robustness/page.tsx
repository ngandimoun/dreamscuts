'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

interface TestResult {
  overallScore: number;
  grade: string;
  issuesCount: number;
  recommendationsCount: number;
  hasIssues: boolean;
  confidenceGap: number;
  hasPlaceholder: boolean;
  assetIntegrationScore: number;
  isValid: boolean;
  detailedIssues: Array<{
    type: string;
    severity: string;
    message: string;
    suggestion: string;
  }>;
}

export default function TestRefinerRobustnessPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{
    problematic: TestResult | null;
    improved: TestResult | null;
    improvements: string[];
  } | null>(null);

  const runRobustnessTest = async () => {
    setIsRunning(true);
    try {
      const response = await fetch('/api/dreamcut/refiner-robustness-test', {
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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'bg-green-100 text-green-800';
      case 'B':
        return 'bg-blue-100 text-blue-800';
      case 'C':
        return 'bg-yellow-100 text-yellow-800';
      case 'D':
        return 'bg-orange-100 text-orange-800';
      case 'F':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🧪 Refiner Robustness Test</h1>
        <p className="text-gray-600">
          Test the enhanced refiner system to validate improvements in confidence normalization, 
          placeholder detection, content type consistency, and asset integration.
        </p>
      </div>

      <div className="mb-6">
        <Button 
          onClick={runRobustnessTest} 
          disabled={isRunning}
          className="w-full sm:w-auto"
        >
          {isRunning ? 'Running Tests...' : 'Run Robustness Tests'}
        </Button>
      </div>

      {results && (
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Test Summary</CardTitle>
              <CardDescription>
                Comparison between problematic and improved refiner outputs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-600">❌ Problematic Output</h4>
                  <div className="flex items-center gap-2">
                    <span>Overall Score:</span>
                    <Badge className={getGradeColor(results.problematic?.grade || 'F')}>
                      {results.problematic?.overallScore.toFixed(2)} ({results.problematic?.grade})
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Issues: {results.problematic?.issuesCount} | 
                    Confidence Gap: {results.problematic?.confidenceGap.toFixed(2)} | 
                    Placeholders: {results.problematic?.hasPlaceholder ? 'Yes' : 'No'}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600">✅ Improved Output</h4>
                  <div className="flex items-center gap-2">
                    <span>Overall Score:</span>
                    <Badge className={getGradeColor(results.improved?.grade || 'F')}>
                      {results.improved?.overallScore.toFixed(2)} ({results.improved?.grade})
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Issues: {results.improved?.issuesCount} | 
                    Confidence Gap: {results.improved?.confidenceGap.toFixed(2)} | 
                    Placeholders: {results.improved?.hasPlaceholder ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Improvements */}
          <Card>
            <CardHeader>
              <CardTitle>📈 Key Improvements</CardTitle>
              <CardDescription>
                Specific enhancements made to the refiner system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{improvement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Issues */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Problematic Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">❌ Problematic Issues</CardTitle>
                <CardDescription>
                  Issues detected in the original refiner output
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.problematic?.detailedIssues.length === 0 ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      No issues detected in problematic output
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-3">
                    {results.problematic?.detailedIssues.map((issue, index) => (
                      <Alert key={index}>
                        {getSeverityIcon(issue.severity)}
                        <AlertDescription>
                          <div className="font-semibold">{issue.message}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            Suggestion: {issue.suggestion}
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Improved Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">✅ Improved Issues</CardTitle>
                <CardDescription>
                  Issues remaining after improvements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.improved?.detailedIssues.length === 0 ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      No issues detected in improved output
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-3">
                    {results.improved?.detailedIssues.map((issue, index) => (
                      <Alert key={index}>
                        {getSeverityIcon(issue.severity)}
                        <AlertDescription>
                          <div className="font-semibold">{issue.message}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            Suggestion: {issue.suggestion}
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Metrics Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Detailed Metrics Comparison</CardTitle>
              <CardDescription>
                Side-by-side comparison of key quality metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Metric</th>
                      <th className="text-left p-2">Problematic</th>
                      <th className="text-left p-2">Improved</th>
                      <th className="text-left p-2">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Overall Score</td>
                      <td className="p-2">{results.problematic?.overallScore.toFixed(2)}</td>
                      <td className="p-2">{results.improved?.overallScore.toFixed(2)}</td>
                      <td className="p-2">
                        <Badge className={results.improved && results.problematic && results.improved.overallScore > results.problematic.overallScore ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {results.improved && results.problematic ? 
                            ((results.improved.overallScore - results.problematic.overallScore) * 100).toFixed(1) + '%' : 
                            'N/A'
                          }
                        </Badge>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Confidence Gap</td>
                      <td className="p-2">{results.problematic?.confidenceGap.toFixed(2)}</td>
                      <td className="p-2">{results.improved?.confidenceGap.toFixed(2)}</td>
                      <td className="p-2">
                        <Badge className={results.improved && results.problematic && results.improved.confidenceGap < results.problematic.confidenceGap ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {results.improved && results.problematic ? 
                            ((results.problematic.confidenceGap - results.improved.confidenceGap) * 100).toFixed(1) + '%' : 
                            'N/A'
                          }
                        </Badge>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Asset Integration</td>
                      <td className="p-2">{results.problematic?.assetIntegrationScore.toFixed(2)}</td>
                      <td className="p-2">{results.improved?.assetIntegrationScore.toFixed(2)}</td>
                      <td className="p-2">
                        <Badge className={results.improved && results.problematic && results.improved.assetIntegrationScore > results.problematic.assetIntegrationScore ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {results.improved && results.problematic ? 
                            ((results.improved.assetIntegrationScore - results.problematic.assetIntegrationScore) * 100).toFixed(1) + '%' : 
                            'N/A'
                          }
                        </Badge>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Has Placeholders</td>
                      <td className="p-2">{results.problematic?.hasPlaceholder ? 'Yes' : 'No'}</td>
                      <td className="p-2">{results.improved?.hasPlaceholder ? 'Yes' : 'No'}</td>
                      <td className="p-2">
                        <Badge className={results.improved && results.problematic && !results.improved.hasPlaceholder && results.problematic.hasPlaceholder ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {results.improved && results.problematic && !results.improved.hasPlaceholder && results.problematic.hasPlaceholder ? 'Fixed' : 'No Change'}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Validation Status</td>
                      <td className="p-2">
                        <Badge className={results.problematic?.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {results.problematic?.isValid ? 'Valid' : 'Invalid'}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Badge className={results.improved?.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {results.improved?.isValid ? 'Valid' : 'Invalid'}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Badge className={results.improved && results.problematic && results.improved.isValid && !results.problematic.isValid ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {results.improved && results.problematic && results.improved.isValid && !results.problematic.isValid ? 'Fixed' : 'No Change'}
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
