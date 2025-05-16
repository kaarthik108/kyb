import { PlatformBreakdown } from "./platform-breakdown";
import { ComparativeCards } from "./comparative-cards";
import { dashboardData } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, ThumbsDown, Minus, ArrowUpRight, ArrowDownRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function SentimentAnalysis() {
  const { platform_sentiment, overall_sentiment } = dashboardData;

  // Calculate overall percentages and round them
  const positivePercent = Math.round(overall_sentiment.positive);
  const neutralPercent = Math.round(overall_sentiment.neutral);
  const negativePercent = Math.round(overall_sentiment.negative);

  // Calculate sentiment score (0-100)
  const sentimentScore = positivePercent;
  
  // Determine sentiment trend indicators
  const getPlatformTrend = (sentiment: number) => {
    if (sentiment >= 65) return { 
      icon: <ArrowUpRight className="h-4 w-4 text-emerald-500" />, 
      text: "text-emerald-500",
      message: "Strong positive sentiment"
    };
    if (sentiment >= 50) return { 
      icon: <ArrowUpRight className="h-4 w-4 text-emerald-400" />, 
      text: "text-emerald-400",
      message: "Moderate positive sentiment"
    };
    if (sentiment >= 40) return { 
      icon: <Minus className="h-4 w-4 text-blue-500" />, 
      text: "text-blue-500",
      message: "Neutral sentiment"
    };
    if (sentiment >= 30) return { 
      icon: <ArrowDownRight className="h-4 w-4 text-amber-500" />, 
      text: "text-amber-500",
      message: "Concerning sentiment"
    };
    return { 
      icon: <ArrowDownRight className="h-4 w-4 text-red-500" />, 
      text: "text-red-500",
      message: "Critical negative sentiment"
    };
  };

  const overallTrend = getPlatformTrend(sentimentScore);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">
        <div className="flex items-center gap-2">
          Sentiment Analysis
          <div className="relative group">
            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            <div className="absolute hidden group-hover:block z-10 bottom-full mb-2 bg-card shadow-lg p-2 rounded text-xs text-muted-foreground w-48">
              Analysis of brand sentiment across platforms with insights
            </div>
          </div>
        </div>
      </h2>
      
      {/* Overall sentiment summary card */}
      <Card className="mb-6 border-l-4 border-l-blue-500 overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Left: Sentiment gauge */}
            <div className="p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border">
              <div className="mb-3 text-lg font-medium text-center">Overall Sentiment</div>
              <div className="relative flex items-center justify-center">
                {/* Background gauge */}
                <div className="w-36 h-36 rounded-full border-8 border-muted relative">
                  {/* Gauge progress */}
                  <svg className="w-full h-full absolute top-0 left-0" viewBox="0 0 100 100">
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="46" 
                      fill="none" 
                      strokeWidth="8"
                      stroke={sentimentScore >= 65 ? "rgb(52, 211, 153)" : 
                             sentimentScore >= 50 ? "rgb(96, 165, 250)" :
                             sentimentScore >= 30 ? "rgb(251, 191, 36)" : "rgb(248, 113, 113)"}
                      strokeDasharray="289.5"
                      strokeDashoffset={289.5 - (289.5 * sentimentScore / 100)}
                      strokeLinecap="round"
                      transform="rotate(-90, 50, 50)"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  
                  {/* Value */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold">{sentimentScore}</div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 mt-4 font-medium ${overallTrend.text}`}>
                {overallTrend.icon}
                <span>{overallTrend.message}</span>
              </div>
            </div>
            
            {/* Middle: Sentiment distribution */}
            <div className="p-6 border-b md:border-b-0 md:border-r border-border">
              <div className="mb-4 text-lg font-medium">Sentiment Breakdown</div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span>Positive</span>
                    </div>
                    <span className="font-medium">{positivePercent}%</span>
                  </div>
                  <motion.div 
                    className="bg-muted rounded-full h-2 w-full overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div 
                      className="bg-emerald-500 h-full" 
                      initial={{ width: 0 }}
                      animate={{ width: `${positivePercent}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                    />
                  </motion.div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Neutral</span>
                    </div>
                    <span className="font-medium">{neutralPercent}%</span>
                  </div>
                  <motion.div 
                    className="bg-muted rounded-full h-2 w-full overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div 
                      className="bg-blue-500 h-full" 
                      initial={{ width: 0 }}
                      animate={{ width: `${neutralPercent}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </motion.div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>Negative</span>
                    </div>
                    <span className="font-medium">{negativePercent}%</span>
                  </div>
                  <motion.div 
                    className="bg-muted rounded-full h-2 w-full overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div 
                      className="bg-red-500 h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${negativePercent}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </motion.div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  {positivePercent > negativePercent ? 
                    `Positive sentiment exceeds negative by ${positivePercent - negativePercent}%` : 
                    negativePercent > positivePercent ?
                    `Negative sentiment exceeds positive by ${negativePercent - positivePercent}%` :
                    `Equal positive and negative sentiment`
                  }
                </div>
              </div>
            </div>
            
            {/* Right: Key insights */}
            <div className="p-6">
              <div className="mb-4 text-lg font-medium">Sentiment Insights</div>
              
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                  <div className="font-medium text-emerald-600 dark:text-emerald-400">Strongest Positive</div>
                  <div className="mt-1">Most positive discussion centers around sustainability initiatives and electric vehicle innovation.</div>
                </div>
                
                {negativePercent > 15 && (
                  <div className="p-3 bg-red-500/10 rounded-md border border-red-500/20">
                    <div className="font-medium text-red-600 dark:text-red-400">Key Concern</div>
                    <div className="mt-1">Negative sentiment largely stems from production concerns and competitor comparisons.</div>
                  </div>
                )}
                
                <div className="p-3 bg-blue-500/10 rounded-md border border-blue-500/20">
                  <div className="font-medium text-blue-600 dark:text-blue-400">Trend Analysis</div>
                  <div className="mt-1">Sentiment has improved by 4.2% over the previous period, showing positive momentum.</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Per platform sentiment - now full width */}
      <ComparativeCards data={platform_sentiment} />
    </div>
  );
}