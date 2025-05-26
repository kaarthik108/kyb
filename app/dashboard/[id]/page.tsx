import { notFound } from "next/navigation";
import { startBrandAnalysis } from "@/app/actions/brand-analysis";
import { transformApiData } from "@/lib/data";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

interface DashboardPageProps {
  params: { id: string };
  searchParams: { 
    brand?: string; 
    location?: string; 
    category?: string; 
  };
}

export default async function DashboardPage({ params, searchParams }: DashboardPageProps) {
  const brandInfo = {
    brand: searchParams.brand || 'Unknown Brand',
    location: searchParams.location || 'Global',
    category: searchParams.category || 'General'
  };

  try {
    const result = await startBrandAnalysis(brandInfo);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch data');
    }

    if (!result.data) {
      notFound();
    }

    const transformedData = transformApiData(result.data);

    return (
      <DashboardClient 
        data={result.data} 
        transformedData={transformedData} 
        brandInfo={brandInfo} 
      />
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    notFound();
  }
} 