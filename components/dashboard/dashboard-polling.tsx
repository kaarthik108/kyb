"use client";

import { useState, useEffect, useRef } from "react";
import { checkAnalysisStatus } from "@/app/actions/brand-analysis";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { transformApiData, ApiResponse } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logWithContext } from "@/lib/utils";

interface DashboardPollingProps {
  userId: string;
  sessionId: string;
  brandInfo: {
    brand: string;
    location: string;
    category: string;
  };
}

function logWithTimestamp(message: string, data?: any) {
  logWithContext('POLLING', message, data);
}

export function DashboardPolling({ userId, sessionId, brandInfo }: DashboardPollingProps) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [pollCount, setPollCount] = useState(0);
  const hasLoggedInit = useRef(false);
  const hasLoggedDataLoad = useRef(false);

  const maxTimeMs = 5 * 60 * 1000; // 5 minutes in milliseconds
  const pollInterval = 20000; // 20 seconds

  // Only log initialization once
  if (!hasLoggedInit.current) {
    hasLoggedInit.current = true;
    logWithTimestamp('🎯 DashboardPolling component initialized', { 
      userId, 
      sessionId, 
      brandInfo,
      maxTimeMs,
      pollInterval
    });
  }

  const pollForResults = async () => {
    const pollStartTime = Date.now();
    const currentPollCount = pollCount + 1;
    setPollCount(currentPollCount);
    
    logWithTimestamp(`🔄 Starting poll #${currentPollCount}`, { 
      userId, 
      sessionId,
      timeElapsed: pollStartTime - startTime
    });

    try {
      const result = await checkAnalysisStatus(userId, sessionId);
      const pollDuration = Date.now() - pollStartTime;
      
      logWithTimestamp(`📊 Poll #${currentPollCount} completed in ${pollDuration}ms`, { 
        success: result.success,
        hasData: !!result.data,
        status: result.data?.status,
        hasResults: !!(result.data as any)?.results
      });
      
      if (!result.success) {
        logWithTimestamp(`❌ Poll #${currentPollCount} failed`, { error: result.error });
        throw new Error(result.error || 'Status check failed');
      }
      
      const statusData = result.data;
      
      if (statusData.status === 'completed' && statusData.results) {
        logWithTimestamp(`🎉 Analysis completed on poll #${currentPollCount}!`, { 
          totalPolls: currentPollCount,
          totalTime: Date.now() - startTime,
          resultsSize: JSON.stringify(statusData.results).length
        });
        
        setData(statusData.results as ApiResponse);
        setLoading(false);
        return true; // Stop polling
      } else if (statusData.status === 'failed') {
        logWithTimestamp(`💥 Analysis failed on poll #${currentPollCount}`, { 
          errorMessage: statusData.error_message,
          totalPolls: currentPollCount
        });
        throw new Error(statusData.error_message || 'Analysis failed');
      } else {
        logWithTimestamp(`⏳ Poll #${currentPollCount} - analysis still in progress`, { 
          status: statusData.status,
          timeElapsed: Date.now() - startTime,
          nextPollIn: pollInterval
        });
      }
      
      return false; // Continue polling
    } catch (error) {
      const pollDuration = Date.now() - pollStartTime;
      logWithTimestamp(`💥 Poll #${currentPollCount} error after ${pollDuration}ms`, { 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      setError(error instanceof Error ? error.message : 'Analysis failed');
      setLoading(false);
      return true; // Stop polling
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let timeInterval: NodeJS.Timeout;
    let isMounted = true;

    logWithTimestamp('🚀 Starting polling effect', { 
      userId, 
      sessionId,
      isMounted,
      startTime: new Date(startTime).toISOString()
    });

    // Update current time every second for UI (only while loading)
    if (loading && !data) {
      timeInterval = setInterval(() => {
        if (isMounted && loading && !data) {
          setCurrentTime(Date.now());
        }
      }, 1000);
    }

    const poll = async () => {
      if (!isMounted) {
        logWithTimestamp('🛑 Component unmounted, stopping poll');
        return;
      }
      
      const elapsed = Date.now() - startTime;
      
      // Check if we've exceeded the maximum time
      if (elapsed >= maxTimeMs) {
        logWithTimestamp('⏰ Polling timeout reached', { 
          elapsed,
          maxTimeMs,
          totalPolls: pollCount
        });
        setError('Analysis timed out after 5 minutes');
        setLoading(false);
        return;
      }

      logWithTimestamp('🔄 About to poll for results', { 
        elapsed,
        remainingTime: maxTimeMs - elapsed,
        pollCount: pollCount + 1
      });

      const shouldStop = await pollForResults();
      
      if (!shouldStop && isMounted) {
        logWithTimestamp('⏭️ Scheduling next poll', { 
          nextPollIn: pollInterval,
          nextPollAt: new Date(Date.now() + pollInterval).toISOString()
        });
        timeoutId = setTimeout(poll, pollInterval);
      } else {
        logWithTimestamp('🏁 Polling stopped', { 
          shouldStop,
          isMounted,
          reason: shouldStop ? 'analysis complete/failed' : 'component unmounted'
        });
      }
    };

    // Start polling immediately
    poll();

    return () => {
      logWithTimestamp('🧹 Cleaning up polling effect', { 
        isMounted,
        timeoutId: !!timeoutId,
        timeInterval: !!timeInterval,
        totalPolls: pollCount
      });
      
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (timeInterval) {
        clearInterval(timeInterval);
      }
    };
  }, [userId, sessionId, startTime]);

  const handleRetry = () => {
    logWithTimestamp('🔄 User initiated retry', { 
      previousError: error,
      totalPolls: pollCount
    });
    
    setError(null);
    setLoading(true);
    setPollCount(0);
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
                Polls completed: {pollCount} | Checking every 20 seconds
              </p>
              <p className="text-amber-300/70 text-xs mt-1">
                Session: {sessionId.substring(0, 12)}...
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    logWithTimestamp('❌ Displaying error state', { 
      error,
      totalPolls: pollCount,
      totalTime: Date.now() - startTime
    });
    
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <Card className="max-w-md w-full border-red-500/20 bg-red-900/10">
            <CardContent className="p-6 text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-red-400">Analysis Failed</h3>
                <p className="text-sm text-muted-foreground mt-2">{error}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Polls completed: {pollCount} | Session: {sessionId.substring(0, 12)}...
                </p>
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
    logWithTimestamp('❓ No data available state', { 
      totalPolls: pollCount,
      totalTime: Date.now() - startTime
    });
    
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

  // Log data loading only once
  if (!hasLoggedDataLoad.current) {
    hasLoggedDataLoad.current = true;
    logWithTimestamp('🎉 Data loaded, rendering dashboard', { 
      totalPolls: pollCount,
      totalTime: Date.now() - startTime,
      dataSize: JSON.stringify(data).length
    });
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