"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
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

export default function DashboardPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const dashboardId = params.id as string;

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brandInfo, setBrandInfo] = useState({
    brand: searchParams.get('brand') || 'Unknown Brand',
    location: searchParams.get('location') || 'Global',
    category: searchParams.get('category') || 'General'
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brandInfo),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dashboardId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-t-2 border-blue-400 opacity-20"></div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-medium bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Analyzing brand data...
            </p>
            <p className="text-sm text-muted-foreground">Processing insights from multiple platforms</p>
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
                onClick={fetchDashboardData}
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
        <div className="flex items-center justify-end">
          <Button 
            onClick={fetchDashboardData}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        <Header brandInfo={brandInfo} />
        <SentimentAnalysis data={transformedData} />
        <WordCloudSection data={transformedData} />
        <EthicalHighlights data={transformedData} />
        <PlatformMentions data={transformedData} />
      </div>
    </DashboardLayout>
  );
} 