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
  
  // Create default platform data for missing platforms
  const getDefaultPlatformData = (platformName: string): PlatformAnalysisResult => ({
    brand_name: apiData.analysis_results_twitter?.brand_name || apiData.analysis_results_linkedin?.brand_name || apiData.analysis_results_reddit?.brand_name || apiData.analysis_results_news?.brand_name || 'Unknown',
    platform_name: platformName,
    total_mentions_on_platform: 0,
    platform_sentiment_breakdown: {
      positive: 0,
      negative: 0,
      neutral: 0
    },
    ethical_highlights_on_platform: [],
    word_cloud_themes_on_platform: [],
    mentions_on_platform: []
  });
  
  // Ensure all platform data exists with defaults
  const platformData = {
    twitter: apiData.analysis_results_twitter || getDefaultPlatformData('Twitter'),
    linkedin: apiData.analysis_results_linkedin || getDefaultPlatformData('LinkedIn'),
    reddit: apiData.analysis_results_reddit || getDefaultPlatformData('Reddit'),
    news: apiData.analysis_results_news || getDefaultPlatformData('News')
  };
  
  // Calculate overall sentiment
  let totalMentions = 0;
  let totalPositive = 0;
  let totalNegative = 0;
  let totalNeutral = 0;
  
  platforms.forEach(platform => {
    const data = platformData[platform];
    
    if (!data || !data.platform_sentiment_breakdown) {
      console.warn(`Invalid platform data for ${platform}, using defaults`);
      return;
    }
    
    const mentions = data.total_mentions_on_platform || 0;
    totalMentions += mentions;
    totalPositive += (data.platform_sentiment_breakdown.positive || 0) * mentions;
    totalNegative += (data.platform_sentiment_breakdown.negative || 0) * mentions;
    totalNeutral += (data.platform_sentiment_breakdown.neutral || 0) * mentions;
  });
  
  // Avoid division by zero
  const overallSentiment = totalMentions > 0 ? {
    positive: (totalPositive / totalMentions) * 100,
    negative: (totalNegative / totalMentions) * 100,
    neutral: (totalNeutral / totalMentions) * 100
  } : {
    positive: 0,
    negative: 0,
    neutral: 0
  };
  
  return {
    brand_name: platformData.twitter.brand_name || platformData.linkedin.brand_name || platformData.reddit.brand_name || platformData.news.brand_name || 'Unknown',
    total_mentions: totalMentions,
    overall_sentiment: overallSentiment,
    platform_sentiment: {
      Twitter: {
        positive: (platformData.twitter.platform_sentiment_breakdown?.positive || 0) * 100,
        negative: (platformData.twitter.platform_sentiment_breakdown?.negative || 0) * 100,
        neutral: (platformData.twitter.platform_sentiment_breakdown?.neutral || 0) * 100,
        count: platformData.twitter.total_mentions_on_platform || 0
      },
      LinkedIn: {
        positive: (platformData.linkedin.platform_sentiment_breakdown?.positive || 0) * 100,
        negative: (platformData.linkedin.platform_sentiment_breakdown?.negative || 0) * 100,
        neutral: (platformData.linkedin.platform_sentiment_breakdown?.neutral || 0) * 100,
        count: platformData.linkedin.total_mentions_on_platform || 0
      },
      Reddit: {
        positive: (platformData.reddit.platform_sentiment_breakdown?.positive || 0) * 100,
        negative: (platformData.reddit.platform_sentiment_breakdown?.negative || 0) * 100,
        neutral: (platformData.reddit.platform_sentiment_breakdown?.neutral || 0) * 100,
        count: platformData.reddit.total_mentions_on_platform || 0
      },
      News: {
        positive: (platformData.news.platform_sentiment_breakdown?.positive || 0) * 100,
        negative: (platformData.news.platform_sentiment_breakdown?.negative || 0) * 100,
        neutral: (platformData.news.platform_sentiment_breakdown?.neutral || 0) * 100,
        count: platformData.news.total_mentions_on_platform || 0
      }
    },
    ethical_highlights: [
      ...(platformData.twitter.ethical_highlights_on_platform || []),
      ...(platformData.linkedin.ethical_highlights_on_platform || []),
      ...(platformData.reddit.ethical_highlights_on_platform || []),
      ...(platformData.news.ethical_highlights_on_platform || [])
    ],
    word_cloud_themes: [
      ...(platformData.twitter.word_cloud_themes_on_platform || []),
      ...(platformData.linkedin.word_cloud_themes_on_platform || []),
      ...(platformData.reddit.word_cloud_themes_on_platform || []),
      ...(platformData.news.word_cloud_themes_on_platform || [])
    ],
    platforms: [
      {
        name: "Twitter",
        mentions: (platformData.twitter.mentions_on_platform || []).map(mention => ({
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
        mentions: (platformData.linkedin.mentions_on_platform || []).map(mention => ({
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
        mentions: (platformData.reddit.mentions_on_platform || []).map(mention => ({
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
        mentions: (platformData.news.mentions_on_platform || []).map(mention => ({
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