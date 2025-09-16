'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw, 
  AlertTriangle,
  Activity,
  Brain,
  Zap,
  Play,
  Pause,
  Loader2
} from 'lucide-react';

export default function AsyncQueryAnalyzerDemo() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [priority, setPriority] = useState(10);
  const [timeout, setTimeout] = useState(60000);

  const handleAnalyze = async () => {
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/dreamcut/query-analyzer-async', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          options: {
            enable_async: true,
            priority: priority,
            timeout: timeout
          }
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data.data);
      
      // Start automatic status checking
      startStatusCheck(data.data.brief_id);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startStatusCheck = (briefId: string) => {
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
    }

    const interval = setInterval(async () => {
      await checkStatus(briefId);
    }, 3000); // Check every 3 seconds

    setStatusCheckInterval(interval);
  };

  const checkStatus = async (briefId?: string) => {
    const targetBriefId = briefId || result?.brief_id;
    if (!targetBriefId) return;

    setIsCheckingStatus(true);
    try {
      const response = await fetch(`/api/dreamcut/query-analyzer-async?brief_id=${targetBriefId}`);
      const data = await response.json();

      if (data.success) {
        setResult(prev => ({
          ...prev,
          ...data.data
        }));

        // Stop checking if analysis is complete
        if (data.data.status === 'done' || data.data.status === 'failed') {
          if (statusCheckInterval) {
            clearInterval(statusCheckInterval);
            setStatusCheckInterval(null);
          }
        }
      }
    } catch (err) {
      console.error('Status check failed:', err);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const stopStatusCheck = () => {
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
      setStatusCheckInterval(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'queued':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      done: 'default',
      completed: 'default',
      failed: 'destructive',
      processing: 'secondary',
      queued: 'outline',
      cancelled: 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Async Query Analyzer Demo</h1>
        <p className="text-muted-foreground">
          Test async processing with optimized model ordering and worker system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Async Analysis Configuration</CardTitle>
          <CardDescription>
            Configure and test the async query analyzer with optimized performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="query">Query</Label>
            <Textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your query (e.g., 'change the background of this image')"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                type="number"
                min="0"
                max="100"
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeout">Timeout (ms)</Label>
              <Input
                id="timeout"
                type="number"
                min="5000"
                max="300000"
                value={timeout}
                onChange={(e) => setTimeout(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleAnalyze} 
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span>{isLoading ? 'Starting Analysis...' : 'Start Async Analysis'}</span>
            </Button>
            
            {result && (
              <Button 
                variant="outline" 
                onClick={() => checkStatus()}
                disabled={isCheckingStatus}
                className="flex items-center space-x-2"
              >
                {isCheckingStatus ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span>Check Status</span>
              </Button>
            )}

            {statusCheckInterval && (
              <Button 
                variant="outline" 
                onClick={stopStatusCheck}
                className="flex items-center space-x-2"
              >
                <Pause className="h-4 w-4" />
                <span>Stop Auto-Check</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getStatusIcon(result.status)}
              <span>Async Analysis Result</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
                <TabsTrigger value="raw">Raw Data</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Brief ID</Label>
                    <p className="font-medium">{result.brief_id || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(result.status)}
                      {getStatusBadge(result.status)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Mode</Label>
                    <Badge variant="secondary">{result.processing_mode || 'async'}</Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Created</Label>
                    <p className="font-medium text-xs">
                      {result.created_at ? new Date(result.created_at).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>

                {result.analysis && typeof result.analysis === 'object' && (
                  <div className="space-y-2">
                    <Label>Analysis Summary</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Intent</Label>
                        <p className="font-medium">{result.analysis.intent || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Confidence</Label>
                        <p className="font-medium">{result.analysis.confidence_score ? `${(result.analysis.confidence_score * 100).toFixed(1)}%` : 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Creative Options</Label>
                        <p className="font-medium">{result.analysis.creative_options?.length || 0}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Recommendations</Label>
                        <p className="font-medium">{result.analysis.recommendations?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                )}

                {result.processing_info && (
                  <div className="space-y-2">
                    <Label>Processing Info</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Mode</Label>
                        <p className="font-medium">{result.processing_info.mode || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Has Analysis</Label>
                        <Badge variant={result.processing_info.has_analysis ? "default" : "secondary"}>
                          {result.processing_info.has_analysis ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Job Created</Label>
                        <Badge variant={result.processing_info.job_created ? "default" : "secondary"}>
                          {result.processing_info.job_created ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Est. Completion</Label>
                        <p className="font-medium">{result.processing_info.estimated_completion || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4">
                {result.analysis && typeof result.analysis === 'object' ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Intent & Constraints</Label>
                      <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                        {JSON.stringify({
                          intent: result.analysis.intent,
                          constraints: result.analysis.constraints
                        }, null, 2)}
                      </pre>
                    </div>

                    <div>
                      <Label>Asset Plan</Label>
                      <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                        {JSON.stringify(result.analysis.asset_plan, null, 2)}
                      </pre>
                    </div>

                    <div>
                      <Label>Creative Options</Label>
                      <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                        {JSON.stringify(result.analysis.creative_options, null, 2)}
                      </pre>
                    </div>

                    <div>
                      <Label>Recommendations</Label>
                      <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                        {JSON.stringify(result.analysis.recommendations, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    {result.status === 'processing' ? 'Analysis in progress...' : 'No analysis data available'}
                  </p>
                )}
              </TabsContent>

              <TabsContent value="status" className="space-y-4">
                {result.analysis_job ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Job ID</Label>
                        <p className="font-medium">{result.analysis_job.id}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Status</Label>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(result.analysis_job.status)}
                          {getStatusBadge(result.analysis_job.status)}
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Attempts</Label>
                        <p className="font-medium">{result.analysis_job.attempts}/{result.analysis_job.max_attempts}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Started</Label>
                        <p className="font-medium text-xs">
                          {result.analysis_job.started_at ? new Date(result.analysis_job.started_at).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {result.analysis_job.error && (
                      <div>
                        <Label>Error</Label>
                        <Alert variant="destructive">
                          <XCircle className="h-4 w-4" />
                          <AlertDescription>{result.analysis_job.error}</AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No analysis job found
                  </p>
                )}
              </TabsContent>

              <TabsContent value="raw" className="space-y-4">
                <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
