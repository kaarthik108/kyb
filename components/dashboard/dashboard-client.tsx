"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Header } from "@/components/dashboard/header";
import { SentimentAnalysis } from "@/components/dashboard/sentiment-analysis";
import { WordCloudSection } from "@/components/dashboard/word-cloud";
import { EthicalHighlights } from "@/components/dashboard/ethical-highlights";
import { PlatformMentions } from "@/components/dashboard/platform-mentions";
import { ApiResponse } from "@/lib/data";

interface DashboardClientProps {
  data: ApiResponse;
  transformedData: any;
  brandInfo: {
    brand: string;
    location: string;
    category: string;
  };
}

export function DashboardClient({ data, transformedData, brandInfo }: DashboardClientProps) {
  return (
    <DashboardLayout data={data}>
      <div className="space-y-8">
        <Header brandInfo={brandInfo} />
        <SentimentAnalysis data={transformedData} />
        <WordCloudSection data={transformedData} />
        <EthicalHighlights data={transformedData} />
        <PlatformMentions data={transformedData} />
      </div>
    </DashboardLayout>
  );
} 