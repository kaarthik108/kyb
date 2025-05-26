import { notFound } from "next/navigation";
import { startBrandAnalysis } from "@/app/actions/brand-analysis";
import { transformApiData, ApiResponse } from "@/lib/data";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { DashboardPolling } from "@/components/dashboard/dashboard-polling";

interface DashboardPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ 
    brand?: string; 
    location?: string; 
    category?: string; 
  }>;
}

export default async function DashboardPage({ params, searchParams }: DashboardPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const brandInfo = {
    brand: resolvedSearchParams.brand || 'Unknown Brand',
    location: resolvedSearchParams.location || 'Global',
    category: resolvedSearchParams.category || 'General'
  };

  try {
    const result = await startBrandAnalysis(brandInfo);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to start analysis');
    }

    // If we have cached data, show it immediately
    if (result.cached && result.data) {
      const apiData = result.data as ApiResponse;
      const transformedData = transformApiData(apiData);
      return (
        <DashboardClient 
          data={apiData} 
          transformedData={transformedData} 
          brandInfo={brandInfo} 
        />
      );
    }

    // If we have polling identifiers, start polling
    if (result.data && typeof result.data === 'object' && 'userId' in result.data && 'sessionId' in result.data) {
      const pollingData = result.data as { userId: string; sessionId: string };
      return (
        <DashboardPolling 
          userId={pollingData.userId}
          sessionId={pollingData.sessionId}
          brandInfo={brandInfo}
        />
      );
    }

    // Fallback
    notFound();

  } catch (error) {
    console.error('Dashboard error:', error);
    notFound();
  }
} 