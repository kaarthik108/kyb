export type Platform = "Twitter" | "LinkedIn" | "Reddit" | "News" | "Other";
export type SentimentType = "positive" | "neutral" | "negative" | "mixed";

export interface BrandInfo {
  name: string;
  logo: string;
  location: string;
  category: string;
}

export interface TimePeriod {
  label: string;
  value: string;
}

export interface Trend {
  count: number;
  trend: number;
  period: string;
}

export interface SentimentDistribution {
  name: string;
  value: number;
}

export interface SentimentScore {
  score: number;
  trend: number;
  distribution: SentimentDistribution[];
}

export interface PlatformStat {
  name: string;
  count: number;
  percentage: number;
}

export interface EthicalFactor {
  name: string;
  score: number;
}

export interface EthicalScore {
  overall: number;
  factors: EthicalFactor[];
}

export interface OverviewStats {
  totalMentions: Trend;
  sentiment: SentimentScore;
  platformDistribution: PlatformStat[];
  ethicalScore: EthicalScore;
}

export interface DailyTrend {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface PlatformSentimentData {
  [key: string]: { positive: number; neutral: number; negative: number };
}

export interface WordCloudItem {
  text: string;
  weight: number;
  sentiment: SentimentType;
}

export interface EthicalHighlight {
  title: string;
  context: string;
  description: string;
  sentiment: SentimentType;
  date: string;
  source: string;
}

export interface MentionEngagement {
  likes: number;
  shares: number;
  comments: number;
}

export interface PlatformMention {
  id: string;
  platform: Platform;
  author: string;
  content: string;
  date: string;
  sentiment: SentimentType;
  engagement: MentionEngagement;
  url: string;
}

export interface PlatformMetric {
  platform: string;
  metrics: {
    mentions: number;
    reach: string;
    engagement: string;
    sentiment: number;
  };
}

export interface EngagementTrend {
  date: string;
  twitter: number;
  linkedin: number;
  reddit: number;
  news: number;
}

export interface ShareOfVoice {
  competitor: string;
  percentage: number;
}

export interface GeographicDistribution {
  region: string;
  percentage: number;
}

export interface DetailedAnalytics {
  platformMetrics: PlatformMetric[];
  engagementTrends: EngagementTrend[];
  shareOfVoice: ShareOfVoice[];
  geographicDistribution: GeographicDistribution[];
}

export interface DashboardData {
  brandInfo: BrandInfo;
  timePeriods: TimePeriod[];
  overviewStats: OverviewStats;
  sentimentTrend: DailyTrend[];
  platformSentiment: PlatformSentimentData;
  wordCloudThemes: WordCloudItem[];
  ethicalHighlights: EthicalHighlight[];
  platformMentions: PlatformMention[];
  detailedAnalytics: DetailedAnalytics;
}