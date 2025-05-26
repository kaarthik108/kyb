import { notFound, redirect } from "next/navigation";
import { checkAnalysisStatus } from "@/app/actions/brand-analysis";
import { transformApiData, ApiResponse } from "@/lib/data";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { DashboardPolling } from "@/components/dashboard/dashboard-polling";

interface DashboardPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ 
    brand?: string; 
    location?: string; 
    category?: string;
    userId?: string;
    sessionId?: string;
    cached?: string;
  }>;
}

export default async function DashboardPage({ params, searchParams }: DashboardPageProps) {
  const resolvedSearchParams = await searchParams;
  
  const brandInfo = {
    brand: resolvedSearchParams.brand || 'Unknown Brand',
    location: resolvedSearchParams.location || 'Global',
    category: resolvedSearchParams.category || 'General'
  };

  try {
    // If no userId or sessionId, redirect to home
    if (!resolvedSearchParams.userId || !resolvedSearchParams.sessionId) {
      redirect('/');
    }

    // Check analysis status in database
    const result = await checkAnalysisStatus(resolvedSearchParams.userId, resolvedSearchParams.sessionId);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to check analysis status');
    }

    // If analysis is completed, show results
    if (result.data && result.data.status === 'completed') {
      const apiData = result.data.results as ApiResponse;
      const transformedData = transformApiData(apiData);
      return (
        <DashboardClient 
          data={apiData} 
          transformedData={transformedData} 
          brandInfo={brandInfo} 
        />
      );
    }

    // If analysis is not completed (pending, running, etc.), start polling
    return (
      <DashboardPolling 
        userId={resolvedSearchParams.userId}
        sessionId={resolvedSearchParams.sessionId}
        brandInfo={brandInfo}
      />
    );

  } catch (error) {
    console.error('Dashboard error:', error);
    notFound();
  }
} 