import { Card, CardContent } from "@/components/ui/card";
import { ApiResponse } from "@/lib/data";
import { Twitter, Linkedin, MessageSquare, Newspaper } from "lucide-react";

interface DetailedAnalyticsProps {
  data: ApiResponse;
}

export function DetailedAnalytics({ data }: DetailedAnalyticsProps) {
  // Extract platform metrics from API data
  const platformMetrics = [
    {
      platform: "Twitter",
      icon: <Twitter className="h-5 w-5" />,
      metrics: {
        mentions: data.analysis_results_twitter.total_mentions_on_platform,
        reach: "8.7M", // This would come from API in real implementation
        engagement: "2.3%", // This would come from API in real implementation
        sentiment: Math.round(data.analysis_results_twitter.platform_sentiment_breakdown.positive * 100),
      },
    },
    {
      platform: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      metrics: {
        mentions: data.analysis_results_linkedin.total_mentions_on_platform,
        reach: "4.2M", // This would come from API in real implementation
        engagement: "3.8%", // This would come from API in real implementation
        sentiment: Math.round(data.analysis_results_linkedin.platform_sentiment_breakdown.positive * 100),
      },
    },
    {
      platform: "Reddit",
      icon: <MessageSquare className="h-5 w-5" />,
      metrics: {
        mentions: data.analysis_results_reddit.total_mentions_on_platform,
        reach: "3.1M", // This would come from API in real implementation
        engagement: "4.2%", // This would come from API in real implementation
        sentiment: Math.round(data.analysis_results_reddit.platform_sentiment_breakdown.positive * 100),
      },
    },
    {
      platform: "News",
      icon: <Newspaper className="h-5 w-5" />,
      metrics: {
        mentions: data.analysis_results_news.total_mentions_on_platform,
        reach: "12.5M", // This would come from API in real implementation
        engagement: "1.7%", // This would come from API in real implementation
        sentiment: Math.round(data.analysis_results_news.platform_sentiment_breakdown.positive * 100),
      },
    },
  ];

  const getSentimentColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 70) return "text-amber-500";
    if (score >= 60) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Detailed Analytics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {platformMetrics.map((platform) => (
          <Card key={platform.platform} className="bg-card border rounded-lg overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="rounded-full bg-primary/10 p-2 flex-shrink-0">
                  {platform.icon}
                </div>
                <h3 className="text-lg font-medium truncate">{platform.platform}</h3>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Mentions</div>
                  <div className="text-base font-bold">{platform.metrics.mentions.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Reach</div>
                  <div className="text-base font-bold">{platform.metrics.reach}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Engagement</div>
                  <div className="text-base font-bold">{platform.metrics.engagement}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Sentiment</div>
                  <div className={`text-base font-bold ${getSentimentColor(platform.metrics.sentiment)}`}>
                    {platform.metrics.sentiment}
                  </div>
                </div>
              </div>

              {/* Sparkline visualization */}
              <div className="mt-3 h-8">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path
                    d="M0,10 Q10,5 20,10 T40,10 T60,5 T80,10 T100,8"
                    fill="none"
                    stroke="rgb(52, 211, 153)"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}