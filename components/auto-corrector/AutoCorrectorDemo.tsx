'use client';

import { useState } from 'react';
import { useAutoCorrector, useServiceHealth, useServiceStats } from '@/hooks/useAutoCorrector';
import { ServiceType } from '@/lib/auto-corrector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw, 
  AlertTriangle,
  Activity,
  BarChart3,
  Zap
} from 'lucide-react';

export default function AutoCorrectorDemo() {
  const [selectedService, setSelectedService] = useState<ServiceType>('together');
  const [inputText, setInputText] = useState('Hello, how are you today?');
  const [maxRetries, setMaxRetries] = useState(3);
  const [enableFallback, setEnableFallback] = useState(true);

  const { state, execute, reset, retry, cancel } = useAutoCorrector({
    maxRetries,
    enableFallback,
    logLevel: 'info',
    onSuccess: (result) => {
      console.log('Auto-corrector success:', result);
    },
    onError: (error) => {
      console.error('Auto-corrector error:', error);
    }
  });

  const { healthStatus, isChecking, checkHealth } = useServiceHealth();
  const { stats, refreshStats } = useServiceStats();

  const handleExecute = async () => {
    const input = {
      prompt: inputText,
      max_tokens: 100,
      temperature: 0.7
    };

    await execute(selectedService, input);
  };

  const getServiceDisplayName = (service: ServiceType) => {
    const names = {
      together: 'Together AI',
      replicate: 'Replicate',
      fal: 'Fal.ai',
      openai: 'OpenAI',
      anthropic: 'Anthropic'
    };
    return names[service] || service;
  };

  const getHealthStatusIcon = (healthy: boolean) => {
    return healthy ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Auto-Corrector Demo</h1>
        <p className="text-muted-foreground">
          Test the auto-corrector system with Together AI, Replicate, and Fal.ai services
        </p>
      </div>

      <Tabs defaultValue="demo" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="demo">Demo</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="demo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Corrector Configuration</CardTitle>
              <CardDescription>
                Configure and test the auto-corrector system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service">Service</Label>
                  <Select value={selectedService} onValueChange={(value) => setSelectedService(value as ServiceType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="together">Together AI</SelectItem>
                      <SelectItem value="replicate">Replicate</SelectItem>
                      <SelectItem value="fal">Fal.ai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxRetries">Max Retries</Label>
                  <Input
                    id="maxRetries"
                    type="number"
                    min="1"
                    max="10"
                    value={maxRetries}
                    onChange={(e) => setMaxRetries(parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inputText">Input Text</Label>
                <Textarea
                  id="inputText"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter your prompt here..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enableFallback"
                  checked={enableFallback}
                  onChange={(e) => setEnableFallback(e.target.checked)}
                />
                <Label htmlFor="enableFallback">Enable Fallback Services</Label>
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={handleExecute} 
                  disabled={state.isLoading}
                  className="flex items-center space-x-2"
                >
                  {state.isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  <span>{state.isLoading ? 'Executing...' : 'Execute'}</span>
                </Button>
                
                {state.isLoading && (
                  <Button variant="outline" onClick={cancel}>
                    Cancel
                  </Button>
                )}
                
                {state.error && (
                  <Button variant="outline" onClick={retry}>
                    Retry
                  </Button>
                )}
                
                <Button variant="outline" onClick={reset}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {state.isLoading && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Execution Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Service: {getServiceDisplayName(state.currentService || 'together')}</span>
                    <span>Attempts: {state.attempts}</span>
                  </div>
                  <Progress value={(state.attempts / maxRetries) * 100} className="w-full" />
                </div>
                
                {state.fallbackUsed && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Fallback service is being used due to primary service failure.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {state.result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {state.result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span>Execution Result</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Service</Label>
                    <p className="font-medium">{getServiceDisplayName(state.result.service)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Attempts</Label>
                    <p className="font-medium">{state.result.attempts}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Processing Time</Label>
                    <p className="font-medium">{state.processingTime.toFixed(0)}ms</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Fallback Used</Label>
                    <Badge variant={state.fallbackUsed ? "default" : "secondary"}>
                      {state.fallbackUsed ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>

                {state.result.success && state.result.data && (
                  <div className="space-y-2">
                    <Label>Response Data</Label>
                    <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                      {JSON.stringify(state.result.data, null, 2)}
                    </pre>
                  </div>
                )}

                {state.error && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{state.error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Service Health Status</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={checkHealth}
                  disabled={isChecking}
                >
                  {isChecking ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span className="ml-2">Refresh</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(healthStatus).map(([service, health]) => (
                  <Card key={service}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{getServiceDisplayName(service as ServiceType)}</h3>
                        {getHealthStatusIcon(health.healthy)}
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Response Time:</span>
                          <span>{health.responseTime}ms</span>
                        </div>
                        {health.error && (
                          <div className="text-red-500 text-xs">
                            {health.error}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Service Statistics</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshStats}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="ml-2">Refresh</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(stats).map(([service, stat]) => (
                  <Card key={service}>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-3">{getServiceDisplayName(service as ServiceType)}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Requests:</span>
                          <span className="font-medium">{stat.totalRequests}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Success Rate:</span>
                          <span className="font-medium">
                            {stat.totalRequests > 0 
                              ? ((stat.successfulRequests / stat.totalRequests) * 100).toFixed(1)
                              : 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Response Time:</span>
                          <span className="font-medium">{stat.averageResponseTime.toFixed(0)}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Used:</span>
                          <span className="font-medium text-xs">
                            {new Date(stat.lastUsed).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Retry History</CardTitle>
              <CardDescription>
                Detailed log of all retry attempts and fallback usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              {state.retryHistory.length > 0 ? (
                <div className="space-y-3">
                  {state.retryHistory.map((attempt, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-md">
                      <div className="flex-shrink-0">
                        {attempt.retryable ? (
                          <RefreshCw className="h-4 w-4 text-blue-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            Attempt {attempt.attempt}
                          </span>
                          <Badge variant="outline">
                            {getServiceDisplayName(attempt.service)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(attempt.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {attempt.error}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No retry history available. Execute a request to see retry logs.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
