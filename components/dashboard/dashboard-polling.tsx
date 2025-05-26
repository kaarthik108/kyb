"use client";

import { useState, useEffect } from "react";
import { checkAnalysisStatus } from "@/app/actions/brand-analysis";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { transformApiData, ApiResponse } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardPollingProps {
  userId: string;
  sessionId: string;
  brandInfo: {
    brand: string;
    location: string;
    category: string;
  };
}

export function DashboardPolling({ userId, sessionId, brandInfo }: DashboardPollingProps) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(Date.now());

  const maxTimeMs = 5 * 60 * 1000; // 5 minutes in milliseconds
  const pollInterval = 20000; // 20 seconds

  const pollForResults = async () => {
    try {
      const result = await checkAnalysisStatus(userId, sessionId);
      
      if (!result.success) {
        throw new Error(result.error || 'Status check failed');
      }
      
      const statusData = result.data;
      
      if (statusData.status === 'completed' && statusData.results) {
        console.log('Analysis completed, caching results');
        
        // Cache the results
        // await cacheResults(statusData.results, brandInfo);
        
        setData(statusData.results as ApiResponse);
        setLoading(false);
        return true; // Stop polling
      } else if (statusData.status === 'failed') {
        throw new Error(statusData.error_message || 'Analysis failed');
      }
      
      return false; // Continue polling
    } catch (error) {
      console.error('Polling error:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed');
      setLoading(false);
      return true; // Stop polling
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isMounted = true;

    // Update current time every second for UI
    const timeInterval = setInterval(() => {
      if (isMounted) {
        setCurrentTime(Date.now());
      }
    }, 1000);

    const poll = async () => {
      if (!isMounted) return;
      
      const elapsed = Date.now() - startTime;
      
      // Check if we've exceeded the maximum time
      if (elapsed >= maxTimeMs) {
        setError('Analysis timed out after 5 minutes');
        setLoading(false);
        return;
      }

      const shouldStop = await pollForResults();
      
      if (!shouldStop && isMounted) {
        timeoutId = setTimeout(poll, pollInterval);
      }
    };

    // Start polling immediately
    poll();

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      clearInterval(timeInterval);
    };
  }, [userId, sessionId, startTime]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Reset start time for new attempt
    window.location.reload();
  };

  if (loading) {
    const timeElapsed = Math.floor((currentTime - startTime) / 1000);
    const timeRemaining = Math.max(0, Math.floor((maxTimeMs - (currentTime - startTime)) / 1000));
    
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-8">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-t-2 border-blue-400 opacity-20"></div>
          </div>
          <div className="text-center space-y-4 max-w-md">
            <p className="text-xl font-poppins font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Analyzing {brandInfo.brand}
            </p>
            <p className="text-sm text-muted-foreground font-medium">
              Our AI agents are gathering insights from multiple platforms
            </p>
            <div className="p-4 rounded-lg bg-amber-900/20 border border-amber-500/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <p className="text-amber-400 text-sm font-medium">
                  Analysis in progress...
                </p>
              </div>
              <p className="text-amber-300/70 text-xs">
                Time elapsed: {timeElapsed}s | Time remaining: {timeRemaining}s
              </p>
              <p className="text-amber-300/70 text-xs mt-1">
                Checking every 20 seconds
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <Card className="max-w-md w-full border-red-500/20 bg-red-900/10">
            <CardContent className="p-6 text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-red-400">Analysis Failed</h3>
                <p className="text-sm text-muted-foreground mt-2">{error}</p>
              </div>
              <Button onClick={handleRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Analysis
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p>No data available</p>
          <Button onClick={handleRetry} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const transformedData = transformApiData(data);

  return (
    <DashboardClient 
      data={data} 
      transformedData={transformedData} 
      brandInfo={brandInfo} 
    />
  );
} 