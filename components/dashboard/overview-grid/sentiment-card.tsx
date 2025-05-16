"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface TrendingTopic {
  topic: string;
  change: number;
  volume: number;
}

interface TrendingTopicsCardProps {
  data: any; // We'll extract what we need from the provided data
}

export function SentimentCard({ data }: TrendingTopicsCardProps) {
  // Topics that are trending with their change percentage
  const trendingTopics: TrendingTopic[] = [
    { topic: "Electric Vehicles", change: 8.3, volume: 85 },
    { topic: "Sustainability", change: 12.7, volume: 72 },
    { topic: "Innovation", change: 5.2, volume: 64 },
    { topic: "Competition", change: -3.8, volume: 58 },
    { topic: "Production", change: -6.2, volume: 51 }
  ];

  // Sort by absolute change value to show most significant changes first
  const sortedTopics = [...trendingTopics].sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-3">
          {sortedTopics.map((topic, index) => (
            <motion.div 
              key={topic.topic}
              className="relative"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate max-w-[150px]">{topic.topic}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                    topic.change >= 0 
                      ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/30' 
                      : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-950/30'
                  }`}>
                    {topic.change >= 0 ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    {Math.abs(topic.change)}%
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Volume: {topic.volume}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full rounded-full ${
                    topic.change >= 0 ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${topic.volume}%` }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Based on social mention volume change</span>
            <span>Past 7 days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}