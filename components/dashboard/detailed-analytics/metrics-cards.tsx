"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformMetric } from "@/types/dashboard";
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import { Twitter, Linkedin, MessageSquare, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MetricsCardsProps {
  data: PlatformMetric[];
}

export function MetricsCards({ data }: MetricsCardsProps) {
  // Random data for mini sparklines
  const getSparklineData = () => {
    return Array.from({ length: 7 }, (_, i) => ({
      day: i,
      value: Math.floor(Math.random() * 100),
    }));
  };

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Twitter":
        return <Twitter className="h-4 w-4" />;
      case "LinkedIn":
        return <Linkedin className="h-4 w-4" />;
      case "Reddit":
        return <MessageSquare className="h-4 w-4" />;
      case "News":
        return <Newspaper className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Get sentiment color
  const getSentimentColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((platform, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Badge 
                variant="outline" 
                className="flex items-center gap-1.5 p-1.5"
              >
                {getPlatformIcon(platform.platform)}
              </Badge>
              {platform.platform}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <div className="text-sm text-muted-foreground">Mentions</div>
                <div className="text-lg font-semibold">
                  {platform.metrics.mentions.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Reach</div>
                <div className="text-lg font-semibold">{platform.metrics.reach}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Engagement</div>
                <div className="text-lg font-semibold">{platform.metrics.engagement}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Sentiment</div>
                <div className={`text-lg font-semibold ${getSentimentColor(platform.metrics.sentiment)}`}>
                  {platform.metrics.sentiment}
                </div>
              </div>
            </div>

            <div className="h-12 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getSparklineData()}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}