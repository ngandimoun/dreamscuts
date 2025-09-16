'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Play,
  Pause,
  BarChart3
} from 'lucide-react';

interface Job {
  id: string;
  brief_id: string;
  type: string;
  status: string;
  priority: number;
  attempts: number;
  max_attempts: number;
  error?: string;
  result?: any;
  created_at: string;
  updated_at: string;
  started_at?: string;
  completed_at?: string;
}

interface JobStats {
  type: string;
  status: string;
  count: number;
  avg_duration_seconds?: number;
  max_attempts_used: number;
}

export default function WorkerDashboard() {
  const [pendingJobs, setPendingJobs] = useState<Job[]>([]);
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [jobStats, setJobStats] = useState<JobStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [pendingRes, activeRes, statsRes] = await Promise.all([
        fetch('/api/jobs?action=pending'),
        fetch('/api/jobs?action=active'),
        fetch('/api/jobs?action=stats')
      ]);

      const [pendingData, activeData, statsData] = await Promise.all([
        pendingRes.json(),
        activeRes.json(),
        statsRes.json()
      ]);

      if (pendingData.success) {
        setPendingJobs(pendingData.data || []);
      }

      if (activeData.success) {
        setActiveJobs(activeData.data || []);
      }

      if (statsData.success) {
        setJobStats(statsData.data || []);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (autoRefresh) {
      const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      failed: 'destructive',
      processing: 'secondary',
      pending: 'outline',
      cancelled: 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    );
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toFixed(1)}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Worker Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor job processing and worker status
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span className="ml-2">{autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="ml-2">Refresh</span>
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pending">Pending Jobs</TabsTrigger>
          <TabsTrigger value="active">Active Jobs</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Jobs</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingJobs.length}</div>
                <p className="text-xs text-muted-foreground">
                  Waiting to be processed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeJobs.length}</div>
                <p className="text-xs text-muted-foreground">
                  Currently processing
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {jobStats.reduce((sum, stat) => sum + stat.count, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  All time processed
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest job processing activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeJobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(job.status)}
                      <div>
                        <p className="font-medium">{job.type}</p>
                        <p className="text-sm text-muted-foreground">
                          Brief: {job.brief_id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(job.status)}
                      <span className="text-sm text-muted-foreground">
                        Attempt {job.attempts}/{job.max_attempts}
                      </span>
                    </div>
                  </div>
                ))}
                {activeJobs.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No active jobs
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Jobs Queue</CardTitle>
              <CardDescription>
                Jobs waiting to be processed by workers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(job.status)}
                      <div>
                        <p className="font-medium">{job.type}</p>
                        <p className="text-sm text-muted-foreground">
                          Brief: {job.brief_id.slice(0, 8)}...
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Created: {formatDate(job.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Priority: {job.priority}</Badge>
                      {getStatusBadge(job.status)}
                    </div>
                  </div>
                ))}
                {pendingJobs.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No pending jobs
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Jobs</CardTitle>
              <CardDescription>
                Jobs currently being processed by workers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(job.status)}
                      <div>
                        <p className="font-medium">{job.type}</p>
                        <p className="text-sm text-muted-foreground">
                          Brief: {job.brief_id.slice(0, 8)}...
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Started: {job.started_at ? formatDate(job.started_at) : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Attempt {job.attempts}/{job.max_attempts}</Badge>
                      {getStatusBadge(job.status)}
                    </div>
                  </div>
                ))}
                {activeJobs.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No active jobs
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Statistics</CardTitle>
              <CardDescription>
                Performance metrics and job processing statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(stat.status)}
                      <div>
                        <p className="font-medium">{stat.type}</p>
                        <p className="text-sm text-muted-foreground">
                          Status: {stat.status}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{stat.count} jobs</p>
                      <p className="text-sm text-muted-foreground">
                        Avg: {formatDuration(stat.avg_duration_seconds)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Max attempts: {stat.max_attempts_used}
                      </p>
                    </div>
                  </div>
                ))}
                {jobStats.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No statistics available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
