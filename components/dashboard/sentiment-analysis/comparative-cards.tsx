"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, MinusCircle, ThumbsDown, Twitter, Linkedin, MessagesSquare, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

// Updated interface to match actual data structure
interface PlatformSentimentValues {
  positive: number;
  negative: number;
  neutral: number;
  count: number;
}

interface PlatformSentimentData {
  [key: string]: PlatformSentimentValues;
}

interface ComparativeCardsProps {
  data: PlatformSentimentData;
}

export function ComparativeCards({ data }: ComparativeCardsProps) {
  const platformIcons = {
    Twitter: <Twitter className="h-4 w-4" />,
    LinkedIn: <Linkedin className="h-4 w-4" />,
    Reddit: <MessagesSquare className="h-4 w-4" />,
    News: <Newspaper className="h-4 w-4" />,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Platform Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(data).map(([platform, values]) => {
            // Ensure values exist and are numbers
            const positive = Number(values?.positive) || 0;
            const neutral = Number(values?.neutral) || 0;
            const negative = Number(values?.negative) || 0;
            const count = Number(values?.count) || 0;
            
            const total = positive + neutral + negative;
            
            // Handle edge case where total is 0
            const positivePercent = total > 0 ? Math.round((positive / total) * 100) : 0;
            const neutralPercent = total > 0 ? Math.round((neutral / total) * 100) : 0;
            const negativePercent = total > 0 ? Math.round((negative / total) * 100) : 0;
            
            // Calculate sentiment score (0-100 scale)
            const sentimentScore = total > 0 ? Math.round(
              ((positive * 100) + (neutral * 50)) / total
            ) : 0;
            
            // Determine sentiment label
            let sentimentLabel = "Neutral";
            let sentimentColor = "text-blue-500";
            
            if (sentimentScore >= 70) {
              sentimentLabel = "Positive";
              sentimentColor = "text-emerald-500";
            } else if (sentimentScore <= 40) {
              sentimentLabel = "Negative";
              sentimentColor = "text-red-500";
            }
            
            return (
              <div key={platform} className="p-4 border rounded-md bg-card/50 hover:bg-card/80 transition-colors flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {/* @ts-ignore */}
                    {platformIcons[platform] || <div className="h-4 w-4" />}
                    <h3 className="font-medium">{platform}</h3>
                  </div>
                  <div className={`text-sm font-semibold ${sentimentColor}`}>
                    {sentimentLabel}
                  </div>
                </div>
                
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5">
                      <ThumbsUp className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Positive</span>
                    </div>
                    <span className="font-medium">{positivePercent}%</span>
                  </div>
                  <div className="bg-muted rounded-full h-1.5 w-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full" 
                      style={{ width: `${positivePercent}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5">
                      <MinusCircle className="h-3.5 w-3.5 text-blue-500" />
                      <span>Neutral</span>
                    </div>
                    <span className="font-medium">{neutralPercent}%</span>
                  </div>
                  <div className="bg-muted rounded-full h-1.5 w-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full" 
                      style={{ width: `${neutralPercent}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5">
                      <ThumbsDown className="h-3.5 w-3.5 text-red-500" />
                      <span>Negative</span>
                    </div>
                    <span className="font-medium">{negativePercent}%</span>
                  </div>
                  <div className="bg-muted rounded-full h-1.5 w-full overflow-hidden">
                    <div 
                      className="bg-red-500 h-full" 
                      style={{ width: `${negativePercent}%` }}
                    />
                  </div>
                </div>
                
                {/* Add total mentions count for context */}
                <div className="mt-3 pt-2 border-t text-xs text-muted-foreground">
                  Total mentions: {count}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}