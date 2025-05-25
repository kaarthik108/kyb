import { Platform } from "@/types/dashboard";

export interface PlatformAnalysisResult {
  brand_name: string;
  platform_name: string;
  total_mentions_on_platform: number;
  platform_sentiment_breakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  ethical_highlights_on_platform: string[];
  word_cloud_themes_on_platform: Array<{
    word: string;
    weight: number;
  }>;
  mentions_on_platform: Array<{
    date: string;
    text: string;
    sentiment: "positive" | "negative" | "neutral";
    ethical_context: string;
    url: string;
  }>;
}

export interface ApiResponse {
  userId: string;
  sessionId: string;
  analysis_results_twitter: PlatformAnalysisResult;
  analysis_results_linkedin: PlatformAnalysisResult;
  analysis_results_reddit: PlatformAnalysisResult;
  analysis_results_news: PlatformAnalysisResult;
  dashboardId?: string;
  generatedAt?: string;
  query?: {
    brand: string;
    location: string;
    category: string;
  };
}

// Helper functions to transform API data for components
export const transformApiData = (apiData: ApiResponse) => {
  const platforms = ['twitter', 'linkedin', 'reddit', 'news'] as const;
  
  // Validate that all required platform data exists
  for (const platform of platforms) {
    const platformKey = `analysis_results_${platform}` as keyof ApiResponse;
    if (!apiData[platformKey]) {
      throw new Error(`Missing platform data for ${platform}`);
    }
  }
  
  // Calculate overall sentiment
  let totalMentions = 0;
  let totalPositive = 0;
  let totalNegative = 0;
  let totalNeutral = 0;
  
  platforms.forEach(platform => {
    const platformKey = `analysis_results_${platform}` as keyof ApiResponse;
    const platformData = apiData[platformKey] as PlatformAnalysisResult;
    
    if (!platformData || !platformData.platform_sentiment_breakdown) {
      console.error(`Invalid platform data for ${platform}:`, platformData);
      return;
    }
    
    totalMentions += platformData.total_mentions_on_platform || 0;
    totalPositive += (platformData.platform_sentiment_breakdown.positive || 0) * (platformData.total_mentions_on_platform || 0);
    totalNegative += (platformData.platform_sentiment_breakdown.negative || 0) * (platformData.total_mentions_on_platform || 0);
    totalNeutral += (platformData.platform_sentiment_breakdown.neutral || 0) * (platformData.total_mentions_on_platform || 0);
  });
  
  return {
    brand_name: apiData.analysis_results_twitter.brand_name,
    total_mentions: totalMentions,
    overall_sentiment: {
      positive: (totalPositive / totalMentions) * 100,
      negative: (totalNegative / totalMentions) * 100,
      neutral: (totalNeutral / totalMentions) * 100
    },
    platform_sentiment: {
      Twitter: {
        positive: apiData.analysis_results_twitter.platform_sentiment_breakdown.positive * 100,
        negative: apiData.analysis_results_twitter.platform_sentiment_breakdown.negative * 100,
        neutral: apiData.analysis_results_twitter.platform_sentiment_breakdown.neutral * 100,
        count: apiData.analysis_results_twitter.total_mentions_on_platform
      },
      LinkedIn: {
        positive: apiData.analysis_results_linkedin.platform_sentiment_breakdown.positive * 100,
        negative: apiData.analysis_results_linkedin.platform_sentiment_breakdown.negative * 100,
        neutral: apiData.analysis_results_linkedin.platform_sentiment_breakdown.neutral * 100,
        count: apiData.analysis_results_linkedin.total_mentions_on_platform
      },
      Reddit: {
        positive: apiData.analysis_results_reddit.platform_sentiment_breakdown.positive * 100,
        negative: apiData.analysis_results_reddit.platform_sentiment_breakdown.negative * 100,
        neutral: apiData.analysis_results_reddit.platform_sentiment_breakdown.neutral * 100,
        count: apiData.analysis_results_reddit.total_mentions_on_platform
      },
      News: {
        positive: apiData.analysis_results_news.platform_sentiment_breakdown.positive * 100,
        negative: apiData.analysis_results_news.platform_sentiment_breakdown.negative * 100,
        neutral: apiData.analysis_results_news.platform_sentiment_breakdown.neutral * 100,
        count: apiData.analysis_results_news.total_mentions_on_platform
      }
    },
    ethical_highlights: [
      ...apiData.analysis_results_twitter.ethical_highlights_on_platform,
      ...apiData.analysis_results_linkedin.ethical_highlights_on_platform,
      ...apiData.analysis_results_reddit.ethical_highlights_on_platform,
      ...apiData.analysis_results_news.ethical_highlights_on_platform
    ],
    word_cloud_themes: [
      ...apiData.analysis_results_twitter.word_cloud_themes_on_platform,
      ...apiData.analysis_results_linkedin.word_cloud_themes_on_platform,
      ...apiData.analysis_results_reddit.word_cloud_themes_on_platform,
      ...apiData.analysis_results_news.word_cloud_themes_on_platform
    ],
    platforms: [
      {
        name: "Twitter",
        mentions: apiData.analysis_results_twitter.mentions_on_platform.map(mention => ({
          platform: "Twitter" as const,
          date: mention.date,
          text: mention.text,
          sentiment: mention.sentiment,
          ethical_context: mention.ethical_context,
          url: mention.url
        }))
      },
      {
        name: "LinkedIn",
        mentions: apiData.analysis_results_linkedin.mentions_on_platform.map(mention => ({
          platform: "LinkedIn" as const,
          date: mention.date,
          text: mention.text,
          sentiment: mention.sentiment,
          ethical_context: mention.ethical_context,
          url: mention.url
        }))
      },
      {
        name: "Reddit",
        mentions: apiData.analysis_results_reddit.mentions_on_platform.map(mention => ({
          platform: "Reddit" as const,
          date: mention.date,
          text: mention.text,
          sentiment: mention.sentiment,
          ethical_context: mention.ethical_context,
          url: mention.url
        }))
      },
      {
        name: "News",
        mentions: apiData.analysis_results_news.mentions_on_platform.map(mention => ({
          platform: "News" as const,
          date: mention.date,
          text: mention.text,
          sentiment: mention.sentiment,
          ethical_context: mention.ethical_context,
          url: mention.url
        }))
      }
    ]
  };
};