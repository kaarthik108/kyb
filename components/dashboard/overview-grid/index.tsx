import { MentionsCard } from "./mentions-card";
import { SentimentCard } from "./sentiment-card";
import { PlatformDistributionCard } from "./platform-distribution-card";
import { dashboardData, transformApiData } from "@/lib/data";

export function OverviewGrid() {
  const transformedData = transformApiData(dashboardData);
  const { total_mentions, overall_sentiment, platform_sentiment } = transformedData;

  // Calculate platform distribution from platform_sentiment
  const platformDistribution = Object.entries(platform_sentiment).map(([name, data]) => ({
    name,
    count: data.count,
    percentage: Math.round((data.count / total_mentions) * 100) // Round percentages
  }));

  // Format data for mentions card
  const mentionsData = {
    count: total_mentions,
    trend: 5.2, // Add trend for visual appeal
    period: "vs. previous period"
  };

  // Format data for sentiment card with rounded percentages
  const sentimentData = {
    score: Math.round(overall_sentiment.positive),
    trend: 2.1, // Add trend for visual appeal
    distribution: [
      { name: "Positive", value: Math.round(overall_sentiment.positive) },
      { name: "Neutral", value: Math.round(overall_sentiment.neutral) },
      { name: "Negative", value: Math.round(overall_sentiment.negative) }
    ]
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MentionsCard data={mentionsData} />
        <SentimentCard data={sentimentData} />
        <PlatformDistributionCard data={platformDistribution} />
      </div>
    </div>
  );
}