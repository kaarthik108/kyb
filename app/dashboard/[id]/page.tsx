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
import { AlertCircle, RefreshCw, Twitter, Linkedin, MessageSquare, Newspaper, Search, Database, Brain, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const loadingSteps = [
  {
    id: 'twitter',
    icon: Twitter,
    title: 'Analyzing Twitter/X',
    description: 'Using BrightData MCP server to scrape and analyze tweets',
    color: 'from-blue-400 to-blue-600',
    duration: 15000
  },
  {
    id: 'linkedin',
    icon: Linkedin,
    title: 'Scanning LinkedIn',
    description: 'Extracting professional discussions and company mentions',
    color: 'from-blue-600 to-blue-800',
    duration: 12000
  },
  {
    id: 'reddit',
    icon: MessageSquare,
    title: 'Mining Reddit',
    description: 'Analyzing community discussions and user sentiment',
    color: 'from-orange-400 to-red-500',
    duration: 10000
  },
  {
    id: 'news',
    icon: Newspaper,
    title: 'Processing News',
    description: 'Gathering media coverage and press mentions',
    color: 'from-gray-400 to-gray-600',
    duration: 8000
  },
  {
    id: 'analysis',
    icon: Brain,
    title: 'AI Analysis',
    description: 'Processing sentiment, ethics, and generating insights',
    color: 'from-purple-400 to-purple-600',
    duration: 5000
  }
];

export default function DashboardPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const dashboardId = params.id as string;

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [apiStartTime, setApiStartTime] = useState<number>(0);
  const [brandInfo, setBrandInfo] = useState({
    brand: searchParams.get('brand') || 'Unknown Brand',
    location: searchParams.get('location') || 'Global',
    category: searchParams.get('category') || 'General'
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      setCurrentStep(0);
      setCompletedSteps([]);
      setApiStartTime(Date.now());

      // Start step progression based on elapsed time
      const stepInterval = setInterval(() => {
        const elapsed = Date.now() - apiStartTime;
        
        // Progress through steps based on elapsed time
        if (elapsed > 10000 && currentStep < 1) { // 10s - Twitter done
          setCurrentStep(1);
          setCompletedSteps(prev => [...prev, 'twitter']);
        } else if (elapsed > 20000 && currentStep < 2) { // 20s - LinkedIn done
          setCurrentStep(2);
          setCompletedSteps(prev => [...prev, 'linkedin']);
        } else if (elapsed > 30000 && currentStep < 3) { // 30s - Reddit done
          setCurrentStep(3);
          setCompletedSteps(prev => [...prev, 'reddit']);
        } else if (elapsed > 40000 && currentStep < 4) { // 40s - News done
          setCurrentStep(4);
          setCompletedSteps(prev => [...prev, 'news']);
        }
      }, 1000); // Check every second

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brandInfo),
      });

      // Clear the interval immediately when API completes
      clearInterval(stepInterval);

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const result = await response.json();
      
      // Mark all steps as completed when API finishes
      setCompletedSteps(loadingSteps.map(step => step.id));
      setCurrentStep(loadingSteps.length);
      
      // Small delay to show completion state before showing dashboard
      setTimeout(() => {
        setData(result);
        setLoading(false);
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dashboardId]);

  if (loading) {
    const elapsed = apiStartTime ? Date.now() - apiStartTime : 0;
    const estimatedTotal = 60000; // 1 minute estimate
    const progress = Math.min((elapsed / estimatedTotal) * 100, 95); // Cap at 95% until complete

    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Analyzing {brandInfo.brand}
            </h1>
            <p className="text-muted-foreground">
              Our AI agents are gathering insights from multiple platforms
            </p>
            <div className="w-64 bg-gray-700 rounded-full h-2 mx-auto">
              <div 
                className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">
              {Math.round(elapsed / 1000)}s elapsed • Estimated: ~1-2 minutes
            </p>
          </div>

          <div className="w-full max-w-4xl space-y-6">
            {loadingSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === index;
              const isCompleted = completedSteps.includes(step.id);
              const isPending = index > currentStep;

              return (
                <Card 
                  key={step.id}
                  className={`border transition-all duration-500 ${
                    isActive 
                      ? 'border-blue-500/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10 scale-105' 
                      : isCompleted
                      ? 'border-green-500/30 bg-green-500/5'
                      : 'border-gray-700 bg-gray-900/50'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full transition-all duration-500 ${
                        isActive 
                          ? `bg-gradient-to-r ${step.color} animate-pulse`
                          : isCompleted
                          ? 'bg-green-500'
                          : 'bg-gray-700'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-white" />
                        ) : (
                          <Icon className={`h-6 w-6 text-white ${isActive ? 'animate-bounce' : ''}`} />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold transition-colors ${
                          isActive ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isActive && (
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        )}
                        {isCompleted && (
                          <span className="text-xs text-green-400 font-medium">Complete</span>
                        )}
                        {isPending && (
                          <span className="text-xs text-gray-500">Pending</span>
                        )}
                      </div>
                    </div>

                    {isActive && (
                      <div className="mt-4">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center space-y-2 mt-8">
            <p className="text-sm text-muted-foreground">
              Step {Math.min(currentStep + 1, loadingSteps.length)} of {loadingSteps.length}
            </p>
            <p className="text-xs text-gray-500">
              Real-time analysis in progress...
            </p>
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