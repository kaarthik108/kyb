"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlatformSentimentData } from "@/types/dashboard";
import { Twitter, Linkedin, MessageSquare, Newspaper, TrendingUp, TrendingDown, Activity } from "lucide-react";

interface PlatformBreakdownProps {
  data: PlatformSentimentData;
}

export function PlatformBreakdown({ data }: PlatformBreakdownProps) {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Twitter": return <Twitter className="h-5 w-5 text-blue-400" />;
      case "LinkedIn": return <Linkedin className="h-5 w-5 text-blue-600" />;
      case "Reddit": return <MessageSquare className="h-5 w-5 text-orange-400" />;
      case "News": return <Newspaper className="h-5 w-5 text-gray-400" />;
      default: return <MessageSquare className="h-5 w-5 text-gray-400" />;
    }
  };

  const getPerformanceScore = (values: any) => {
    // Ensure values exist and are numbers
    const positive = Number(values?.positive) || 0;
    const neutral = Number(values?.neutral) || 0;
    const negative = Number(values?.negative) || 0;
    
    const total = positive + neutral + negative;
    
    // Handle edge case where total is 0
    if (total === 0) return 0;
    
    const positivePercent = (positive / total) * 100;
    const neutralPercent = (neutral / total) * 100;
    const score = ((positivePercent * 1) + (neutralPercent * 0.5)) / 1;
    
    // Ensure the result is a valid number
    return Math.round(isNaN(score) ? 0 : score);
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 80) return { level: "Excellent", color: "text-emerald-400", bg: "bg-emerald-400/20", icon: TrendingUp };
    if (score >= 60) return { level: "Good", color: "text-blue-400", bg: "bg-blue-400/20", icon: Activity };
    if (score >= 40) return { level: "Average", color: "text-amber-400", bg: "bg-amber-400/20", icon: Activity };
    return { level: "Poor", color: "text-red-400", bg: "bg-red-400/20", icon: TrendingDown };
  };

  const getHeatmapIntensity = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  const platformEntries = Object.entries(data);
  const maxMentions = Math.max(...platformEntries.map(([_, values]) => Number(values?.count) || 0), 1);

  return (
    <Card className="h-full border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-white font-display">Platform Performance</CardTitle>
          <Badge variant="outline" className="border-purple-500/30 text-purple-400 text-xs">
            Heatmap
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">Performance matrix across platforms</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Performance Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {platformEntries.map(([platform, values]) => {
            const score = getPerformanceScore(values);
            const performance = getPerformanceLevel(score);
            const PerformanceIcon = performance.icon;
            const count = Number(values?.count) || 0;
            const mentionIntensity = maxMentions > 0 ? (count / maxMentions) * 100 : 0;

            return (
              <div
                key={platform}
                className={`relative p-4 rounded-xl border border-white/10 ${performance.bg} backdrop-blur-sm hover:scale-105 transition-all duration-300 group cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getPlatformIcon(platform)}
                    <span className="font-semibold text-white text-sm">{platform}</span>
                  </div>
                  <PerformanceIcon className={`h-4 w-4 ${performance.color}`} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Score</span>
                    <span className={`text-lg font-bold ${performance.color}`}>{score.toString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Level</span>
                    <span className={`text-xs font-medium ${performance.color}`}>{performance.level}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Volume</span>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getHeatmapIntensity(mentionIntensity)} transition-all duration-1000`}
                          style={{ width: `${mentionIntensity}%` }}
                        />
                      </div>
                      <span className="text-xs text-white font-medium">{count}</span>
                    </div>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>



        {/* Legend */}
        <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/10">
          <div className="text-center">
            <div className="w-3 h-3 bg-emerald-500 rounded-full mx-auto mb-1"></div>
            <span className="text-xs text-muted-foreground">Excellent</span>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
            <span className="text-xs text-muted-foreground">Good</span>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-amber-500 rounded-full mx-auto mb-1"></div>
            <span className="text-xs text-muted-foreground">Average</span>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
            <span className="text-xs text-muted-foreground">Poor</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}