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

// Sample data in the new format
export const dashboardData: ApiResponse = {
  userId: "user1",
  sessionId: "demo-session",
  analysis_results_twitter: {
    brand_name: "Tesla",
    platform_name: "Twitter",
    total_mentions_on_platform: 3,
    platform_sentiment_breakdown: {
      positive: 0.3333,
      negative: 0.3333,
      neutral: 0.3333
    },
    ethical_highlights_on_platform: [
      "Market competition and sales performance challenges",
      "Sustainability and environmental responsibility issues",
      "Labor practices and workplace ethics controversies"
    ],
    word_cloud_themes_on_platform: [
      { word: "Tesla", weight: 10 },
      { word: "sales", weight: 9 },
      { word: "competition", weight: 8 },
      { word: "market", weight: 7 },
      { word: "electric", weight: 6 },
      { word: "vehicles", weight: 6 },
      { word: "sustainability", weight: 5 },
      { word: "environment", weight: 5 }
    ],
    mentions_on_platform: [
      {
        date: "2025-04-11",
        text: "Tesla's sales in the United States fell almost 9 percent in the first three months of the year even as the overall market for electric vehicles grew. Competitors like GM and Ford are making gains while Tesla faces challenges with its aging lineup.",
        sentiment: "negative",
        ethical_context: "Market competition and company sales performance",
        url: "https://twitter.com/search?q=Tesla%20sales%20US%202025"
      },
      {
        date: "2025-01-29",
        text: "Tesla released its financial results for the fourth quarter and full year 2024. Despite production and delivery records, global sales fell in 2024, breaking a 12-year streak. The company also launched new Model 3 Performance trim leveraging new engineering capabilities.",
        sentiment: "neutral",
        ethical_context: "Company financial results and product update",
        url: "https://twitter.com/search?q=Tesla%20Q4%202024%20financial%20results"
      },
      {
        date: "2024-12-15",
        text: "Tesla continues to rank first in the Made in America Auto Index for 2024, capturing the top three spots. This highlights Tesla's increasing domestic manufacturing footprint and contribution to the US automotive industry.",
        sentiment: "positive",
        ethical_context: "Sustainability and local manufacturing",
        url: "https://twitter.com/search?q=Tesla%20Made%20in%20America%202024"
      }
    ]
  },
  analysis_results_linkedin: {
    brand_name: "Tesla",
    platform_name: "LinkedIn", 
    total_mentions_on_platform: 3,
    platform_sentiment_breakdown: {
      positive: 1.0,
      negative: 0.0,
      neutral: 0.0
    },
    ethical_highlights_on_platform: [
      "Sustainability and technological innovation in the automotive industry",
      "Corporate sustainability initiatives and renewable energy",
      "Leadership in autonomous vehicle technology and future mobility"
    ],
    word_cloud_themes_on_platform: [
      { word: "innovation", weight: 10 },
      { word: "sustainability", weight: 9 },
      { word: "technology", weight: 8 },
      { word: "renewable", weight: 7 },
      { word: "energy", weight: 7 },
      { word: "autonomous", weight: 6 },
      { word: "leadership", weight: 6 },
      { word: "mobility", weight: 5 }
    ],
    mentions_on_platform: [
      {
        date: "2024-05-10",
        text: "Excited to see Tesla leading the way in automotive innovation in the United States! Their latest update on battery technology is a game-changer for sustainable transportation.",
        sentiment: "positive",
        ethical_context: "Sustainability and technological innovation in the automotive industry",
        url: "https://www.linkedin.com/company/tesla"
      },
      {
        date: "2024-04-30",
        text: "Tesla's commitment to renewable energy and sustainability initiatives in the US market continues to set industry standards. Recently announced new solar projects will boost clean energy adoption nationwide.",
        sentiment: "positive",
        ethical_context: "Corporate sustainability initiatives and renewable energy",
        url: "https://www.linkedin.com/posts/tesla-clean-energy-updates-activity-7012345678901234567"
      },
      {
        date: "2024-05-08",
        text: "Interesting insights from Tesla's leadership on the future of autonomous vehicles in the US automotive sector. Their advancements promise safer roads and enhanced mobility options.",
        sentiment: "positive",
        ethical_context: "Leadership in autonomous vehicle technology and future mobility",
        url: "https://www.linkedin.com/posts/tesla-ceo-interview-autonomous-driving-activity-7013456789012345678"
      }
    ]
  },
  analysis_results_reddit: {
    brand_name: "Tesla",
    platform_name: "Reddit",
    total_mentions_on_platform: 3,
    platform_sentiment_breakdown: {
      positive: 0.0,
      negative: 0.6667,
      neutral: 0.3333
    },
    ethical_highlights_on_platform: [
      "Business challenges and controversies surrounding company leadership",
      "Customer service and product quality concerns",
      "Environmental impact debate focusing on sustainability"
    ],
    word_cloud_themes_on_platform: [
      { word: "Tesla", weight: 10 },
      { word: "issues", weight: 8 },
      { word: "quality", weight: 7 },
      { word: "service", weight: 6 },
      { word: "concerns", weight: 6 },
      { word: "environmental", weight: 5 },
      { word: "sustainability", weight: 5 },
      { word: "controversies", weight: 4 }
    ],
    mentions_on_platform: [
      {
        date: "2024-05-01",
        text: "Tesla has always been treated more like a tech disruptor than your average car company. But slumping sales, a fluctuating stock price, and Elon Musk's recent controversies have led many in r/RealTesla to discuss whether the brand can sustain its hype.",
        sentiment: "negative",
        ethical_context: "Business challenges and controversies surrounding company leadership",
        url: "https://www.reddit.com/r/RealTesla/comments/1jl6i0o/the_verge_teslas_problems_are_bigger_than_just/"
      },
      {
        date: "2024-04-20",
        text: "Had multiple issues with my new Tesla Model Y: paint defects, GPS and cameras malfunctioning right off the bat. Service has been slow but some fixes are underway.",
        sentiment: "negative",
        ethical_context: "Customer service and product quality concerns",
        url: "https://www.reddit.com/r/electricvehicles/comments/1irryus/tesla_model_y_everything_is_apparently_wear_and/"
      },
      {
        date: "2024-03-18",
        text: "Discussion about Tesla's environmental impact shows mixed opinions. Some highlight the lower lifetime emissions compared to gas cars, while others criticize battery production as problematic.",
        sentiment: "neutral",
        ethical_context: "Environmental impact debate focusing on sustainability",
        url: "https://www.reddit.com/r/sustainability/comments/doukp4/tesla_cars_actually_better_for_the_planet/"
      }
    ]
  },
  analysis_results_news: {
    brand_name: "Tesla",
    platform_name: "News",
    total_mentions_on_platform: 6,
    platform_sentiment_breakdown: {
      positive: 0.0,
      negative: 0.5,
      neutral: 0.5
    },
    ethical_highlights_on_platform: [
      "Market competition and business performance in automotive industry",
      "Financial performance and market expectations",
      "Sustainability and environmental responsibility challenges",
      "Labor practices and workplace ethics controversy"
    ],
    word_cloud_themes_on_platform: [
      { word: "Tesla", weight: 10 },
      { word: "sales", weight: 9 },
      { word: "market", weight: 8 },
      { word: "competition", weight: 7 },
      { word: "financial", weight: 7 },
      { word: "performance", weight: 6 },
      { word: "sustainability", weight: 6 },
      { word: "ethics", weight: 5 },
      { word: "workplace", weight: 4 }
    ],
    mentions_on_platform: [
      {
        date: "2025-04-11",
        text: "Tesla's sales in the United States fell almost 9 percent in the first three months of the year even as the overall market for electric vehicles grew, signaling increased competition from other automakers like GM, Ford, and Volkswagen.",
        sentiment: "negative",
        ethical_context: "Market competition and business performance in automotive industry",
        url: "https://www.nytimes.com/2025/04/11/business/tesla-sales-elon-musk.html"
      },
      {
        date: "2025-03-12",
        text: "Tesla's new US registrations fell 11 percent in January 2025, while rival electric vehicle makers experienced a 44 percent surge, led by brands such as Ford, Chevrolet, and Volkswagen.",
        sentiment: "negative",
        ethical_context: "Sales performance and competitive landscape in US electric vehicle market",
        url: "https://www.autonews.com/tesla/an-tesla-us-sales-fall-as-evs-rise-overall-0312/"
      },
      {
        date: "2025-05-13",
        text: "Tesla has started a refresh update on its best-selling Model Y SUV, but the rollout has encountered some issues causing a rocky start. The update is important as Tesla tries to maintain its lead in the competitive US automotive market.",
        sentiment: "neutral",
        ethical_context: "Product update and innovation challenges in automotive industry",
        url: "https://www.reuters.com/business/autos-transportation/teslas-refresh-best-selling-model-y-suv-starts-rocky-road-2025-05-13/"
      },
      {
        date: "2025-01-29",
        text: "Tesla posted a rare earnings miss for the last quarter of 2024, with earnings per share below expectations amid weak sales and revenue, leading to thinning profit margins.",
        sentiment: "negative",
        ethical_context: "Financial performance and market expectations",
        url: "https://www.cnn.com/2025/01/29/business/tesla-earnings"
      },
      {
        date: "2024-11-19",
        text: "Tesla's sustainability efforts have been described as inconsistent, with some positive initiatives but also criticism over transparency issues and environmental practices.",
        sentiment: "neutral",
        ethical_context: "Sustainability and environmental responsibility challenges",
        url: "https://karmawallet.io/blog/2024/11/teslas-sustainability-the-good-the-bad/"
      },
      {
        date: "2024-09-28",
        text: "The U.S. Equal Employment Opportunity Commission (EEOC) sued Tesla for tolerating widespread racial harassment and retaliation against Black employees, marking a significant legal and ethical challenge for the company.",
        sentiment: "negative",
        ethical_context: "Labor practices and workplace ethics controversy",
        url: "https://www.eeoc.gov/newsroom/eeoc-sues-tesla-racial-harassment-and-retaliation"
      }
    ]
  }
};

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