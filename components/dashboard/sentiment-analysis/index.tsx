"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SentimentPulseRadar } from "./sentiment-pulse-radar";
import { PlatformBreakdown } from "./platform-breakdown";
import { ComparativeCards } from "./comparative-cards";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface SentimentAnalysisProps {
  data: {
    brand_name: string;
    total_mentions: number;
    overall_sentiment: {
      positive: number;
      negative: number;
      neutral: number;
    };
    platform_sentiment: {
      [key: string]: {
        positive: number;
        negative: number;
        neutral: number;
        count: number;
      };
    };
  };
}

export function SentimentAnalysis({ data }: SentimentAnalysisProps) {
  // Ensure sentiment values are valid numbers
  const overallSentiment = {
    positive: Number(data.overall_sentiment?.positive) || 0,
    negative: Number(data.overall_sentiment?.negative) || 0,
    neutral: Number(data.overall_sentiment?.neutral) || 0,
  };

  const getPlatformTrend = (sentiment: number) => {
    return sentiment > 50 ? "positive" : sentiment < 30 ? "negative" : "neutral";
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "text-emerald-400";
      case "negative": return "text-red-400";
      default: return "text-amber-400";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return TrendingUp;
      case "negative": return TrendingDown;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Sentiment Analysis
        </h2>
        <p className="text-muted-foreground">Real-time sentiment tracking across all platforms</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries({ 
          Positive: { value: overallSentiment.positive, color: "emerald", trend: "positive" },
          Neutral: { value: overallSentiment.neutral, color: "amber", trend: "neutral" },
          Negative: { value: overallSentiment.negative, color: "red", trend: "negative" }
        }).map(([key, { value, color, trend }]) => {
          const Icon = getSentimentIcon(trend);
          return (
            <Card key={key} className="border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm hover:border-white/20 transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">{key} Sentiment</CardTitle>
                <Icon className={`h-4 w-4 ${getSentimentColor(trend)}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{(isNaN(value) ? 0 : value).toFixed(1)}%</div>
                <div className={`w-full bg-gray-700 rounded-full h-2 mt-2`}>
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${
                      color === 'emerald' ? 'from-emerald-600 to-emerald-400' :
                      color === 'amber' ? 'from-amber-600 to-amber-400' :
                      'from-red-600 to-red-400'
                    }`}
                    style={{ width: `${isNaN(value) ? 0 : Math.max(0, Math.min(100, value))}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SentimentPulseRadar data={data} />

        <PlatformBreakdown data={data.platform_sentiment} />
      </div>

      <ComparativeCards data={data.platform_sentiment} />
    </div>
  );
}