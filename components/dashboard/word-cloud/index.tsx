"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WordCloudVisualization } from "./word-cloud-visualization";
import { SentimentType } from "@/types/dashboard";

interface WordCloudSectionProps {
  data: {
    word_cloud_themes: Array<{
      word: string;
      weight: number;
    }>;
  };
}

export function WordCloudSection({ data }: WordCloudSectionProps) {
  const getSentiment = (word: string, weight: number): SentimentType => {
    const positiveWords = ['innovation', 'sustainability', 'technology', 'leadership', 'success', 'growth', 'positive', 'excellent', 'best', 'leading', 'renewable', 'energy', 'autonomous'];
    const negativeWords = ['issues', 'concerns', 'problems', 'controversy', 'decline', 'negative', 'bad', 'poor', 'worst', 'crisis', 'ethics', 'workplace'];
    
    const lowerWord = word.toLowerCase();
    if (positiveWords.some(pw => lowerWord.includes(pw))) return "positive";
    if (negativeWords.some(nw => lowerWord.includes(nw))) return "negative";
    return "neutral";
  };

  const wordCloudData = data.word_cloud_themes.map(theme => ({
    text: theme.word,
    weight: theme.weight,
    sentiment: getSentiment(theme.word, theme.weight)
  }));

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Word Cloud Analysis
        </h2>
        <p className="text-muted-foreground">Key themes and topics extracted from brand mentions</p>
      </div>

      <Card className="border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white">Most Discussed Topics</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <WordCloudVisualization data={wordCloudData} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['positive', 'neutral', 'negative'].map((sentiment) => {
          const sentimentWords = wordCloudData
            .filter(word => word.sentiment === sentiment)
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 5);

          const colors = {
            positive: "from-emerald-600 to-emerald-400",
            neutral: "from-amber-600 to-amber-400", 
            negative: "from-red-600 to-red-400"
          };

          const textColors = {
            positive: "text-emerald-400",
            neutral: "text-amber-400",
            negative: "text-red-400"
          };

          return (
            <Card key={sentiment} className="border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className={`text-lg capitalize ${textColors[sentiment as keyof typeof textColors]}`}>
                  {sentiment} Themes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sentimentWords.map((word, index) => (
                  <div key={`${sentiment}-${word.text}-${index}`} className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{word.text}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-gray-700 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full bg-gradient-to-r ${colors[sentiment as keyof typeof colors]}`}
                          style={{ width: `${(word.weight / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-6">{word.weight}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}