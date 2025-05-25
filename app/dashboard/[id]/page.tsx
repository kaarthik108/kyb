"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { startBrandAnalysis, checkDatabaseStatus, cacheResults } from "@/app/actions/brand-analysis";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Header } from "@/components/dashboard/header";
import { SentimentAnalysis } from "@/components/dashboard/sentiment-analysis";
import { WordCloudSection } from "@/components/dashboard/word-cloud";
import { EthicalHighlights } from "@/components/dashboard/ethical-highlights";
import { PlatformMentions } from "@/components/dashboard/platform-mentions";
import { transformApiData, ApiResponse } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

function generateRandomId(length: number = 16): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function DashboardPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const dashboardId = params.id as string;

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollingInfo, setPollingInfo] = useState<{userId: string, sessionId: string} | null>(null);
  const hasStartedRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get brand info from URL params
  const brandInfo = {
    brand: searchParams.get('brand') || 'Unknown Brand',
    location: searchParams.get('location') || 'Global',
    category: searchParams.get('category') || 'General'
  };

  const pollForResults = async (userId: string, sessionId: string) => {
    const maxAttempts = 15;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      // Check if polling was aborted
      if (abortControllerRef.current?.signal.aborted) {
        console.log('Polling aborted');
        return;
      }
      
      try {
        console.log(`Polling attempt ${attempts + 1}/${maxAttempts}`);
        
        const result = await checkDatabaseStatus(userId, sessionId);
        
        if (!result.success) {
          throw new Error(result.error || 'Status check failed');
        }
        
        const statusData = result.data;
        
        if (statusData.status === 'completed' && statusData.results) {
          const enrichedData = {
            ...statusData.results,
            dashboardId: generateRandomId(16),
            generatedAt: new Date().toISOString(),
            query: brandInfo,
            userId,
            sessionId
          };
          
          // Cache the results
          await cacheResults(enrichedData, brandInfo);
          
          setData(enrichedData);
          setLoading(false);
          return;
        } else if (statusData.status === 'failed') {
          throw new Error(statusData.error_message || 'Analysis failed');
        }
        
        // Use timeout ref for cleanup
        await new Promise<void>((resolve) => {
          pollingTimeoutRef.current = setTimeout(resolve, 20000);
        });
        attempts++;
        
      } catch (error) {
        console.error('Polling error:', error);
        if (attempts >= maxAttempts - 1) {
          setError(error instanceof Error ? error.message : 'Analysis failed');
          setLoading(false);
          return;
        }
        await new Promise<void>((resolve) => {
          pollingTimeoutRef.current = setTimeout(resolve, 20000);
        });
        attempts++;
      }
    }
    
    setError('Analysis timed out after 5 minutes');
    setLoading(false);
  };

    const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await startBrandAnalysis(brandInfo);

      if (!result.success) {
        throw new Error(result.error || 'Failed to start analysis');
      }

      // Check if we got cached results
      if (result.cached && result.data) {
        console.log('Got cached results:', result.data);
        // Validate the cached data has the required structure
        const cachedData = result.data as any;
        if (cachedData.analysis_results_twitter && 
            cachedData.analysis_results_linkedin && 
            cachedData.analysis_results_reddit && 
            cachedData.analysis_results_news) {
          setData(cachedData);
          setLoading(false);
        } else {
          // Cached data is incomplete, treat as error
          console.error('Cached data is incomplete:', cachedData);
          throw new Error('Cached data is incomplete or corrupted');
        }
      } else if (result.data && typeof result.data === 'object' && 'userId' in result.data && 'sessionId' in result.data) {
        console.log('Starting polling for new analysis');
        const { userId, sessionId } = result.data as { userId: string; sessionId: string };
        setPollingInfo({ userId, sessionId });
        pollForResults(userId, sessionId);
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Prevent multiple calls in StrictMode and during re-renders
    if (hasStartedRef.current) return;
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    hasStartedRef.current = true;
    
    fetchDashboardData();
    
    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, []); // Empty dependency array - only run once

  if (loading) {
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
              <p className="text-amber-400 text-sm font-medium">
                ⏱️ This process typically takes 2-5 minutes
              </p>
              <p className="text-amber-300/70 text-xs mt-1">
                We're analyzing Twitter, LinkedIn, Reddit, and News sources with polling every 20 seconds
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
              <Button 
                onClick={() => {
                  hasStartedRef.current = false;
                  abortControllerRef.current = new AbortController();
                  fetchDashboardData();
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
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
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </DashboardLayout>
    );
  }

  const transformedData = transformApiData(data);

  return (
    <DashboardLayout data={data}>
      <div className="space-y-8">
        <Header brandInfo={brandInfo} />
        <SentimentAnalysis data={transformedData} />
        <WordCloudSection data={transformedData} />
        <EthicalHighlights data={transformedData} />
        <PlatformMentions data={transformedData} />
        
        {/* Note about mentions limit */}
        <div className="text-center py-8">
          <p className="text-xs text-gray-500">
            * For time constraints, only 3 mentions per platform are shown. This can be extended for comprehensive analysis.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
} 