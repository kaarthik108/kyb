"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Platform } from "@/types/dashboard";
import { 
  Twitter, 
  Linkedin, 
  MessageSquare, 
  Newspaper,
  ThumbsUp, 
  ThumbsDown, 
  Minus, 
  ExternalLink,
  Calendar,
  TrendingUp
} from "lucide-react";

interface PlatformMentionsProps {
  data: {
    platforms: Array<{
      name: string;
      mentions: Array<{
        platform: Platform;
        date: string;
        text: string;
        sentiment: "positive" | "negative" | "neutral";
        ethical_context: string;
        url: string;
      }>;
    }>;
  };
}

export function PlatformMentions({ data }: PlatformMentionsProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
  const [selectedSentiment, setSelectedSentiment] = useState<string>("All");

  const platforms = ["All", ...data.platforms.map(p => p.name)];
  const sentiments = ["All", "positive", "neutral", "negative"];

  const allMentions = data.platforms.flatMap(platform => 
    platform.mentions.map(mention => ({
      ...mention,
      platformName: platform.name
    }))
  );

  const filteredMentions = allMentions.filter(mention => {
    const platformMatch = selectedPlatform === "All" || mention.platformName === selectedPlatform;
    const sentimentMatch = selectedSentiment === "All" || mention.sentiment === selectedSentiment;
    return platformMatch && sentimentMatch;
  });

  const formatDate = (dateString: string) => {
    if (dateString === "Recent" || dateString.includes("ago")) {
      return dateString;
    }
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case "Twitter": return <Twitter className="h-4 w-4" />;
      case "LinkedIn": return <Linkedin className="h-4 w-4" />;
      case "Reddit": return <MessageSquare className="h-4 w-4" />;
      case "News": return <Newspaper className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return <ThumbsUp className="h-4 w-4 text-emerald-400" />;
      case "negative": return <ThumbsDown className="h-4 w-4 text-red-400" />;
      default: return <Minus className="h-4 w-4 text-amber-400" />;
    }
  };

  const getBorderColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "border-l-emerald-500";
      case "negative": return "border-l-red-500";
      default: return "border-l-amber-500";
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "Twitter": return "text-blue-400";
      case "LinkedIn": return "text-blue-600";
      case "Reddit": return "text-orange-400";
      case "News": return "text-gray-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Platform Mentions
        </h2>
        <p className="text-muted-foreground">Real-time brand mentions across social media and news platforms</p>
      </div>

      <div className="flex flex-wrap gap-4 p-6 bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg border border-white/10">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Platform</label>
          <div className="flex flex-wrap gap-2">
            {platforms.map(platform => (
              <Button
                key={platform}
                variant={selectedPlatform === platform ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPlatform(platform)}
                className={`${
                  selectedPlatform === platform 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                    : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {platform}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Sentiment</label>
          <div className="flex flex-wrap gap-2">
            {sentiments.map(sentiment => (
              <Button
                key={sentiment}
                variant={selectedSentiment === sentiment ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSentiment(sentiment)}
                className={`${
                  selectedSentiment === sentiment 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                    : "border-gray-600 text-gray-300 hover:bg-gray-700"
                } capitalize`}
              >
                {sentiment}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredMentions.length === 0 ? (
          <Card className="border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No mentions found for the selected filters.</p>
            </CardContent>
          </Card>
        ) : (
          filteredMentions.map((mention, index) => (
            <Card 
              key={index} 
              className={`border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm hover:border-white/20 transition-all duration-200 border-l-4 ${getBorderColor(mention.sentiment)}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gray-800 ${getPlatformColor(mention.platformName)}`}>
                      {getPlatformIcon(mention.platform)}
                    </div>
                    <div>
                      <CardTitle className="text-base text-white">{mention.platformName}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatDate(mention.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getSentimentIcon(mention.sentiment)}
                    <Badge 
                      variant="outline" 
                      className={`${
                        mention.sentiment === 'positive' ? 'border-emerald-500/30 text-emerald-400' :
                        mention.sentiment === 'negative' ? 'border-red-500/30 text-red-400' :
                        'border-amber-500/30 text-amber-400'
                      } capitalize`}
                    >
                      {mention.sentiment}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-200 leading-relaxed text-sm">
                  {mention.text}
                </p>
                
                <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-blue-400 mb-1">Ethical Context</div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {mention.ethical_context}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Source:</span>
                    <span className={`text-xs font-medium ${getPlatformColor(mention.platformName)}`}>
                      {mention.platformName}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <a 
                      href={mention.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Source
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {filteredMentions.length > 0 && (
        <div className="text-center p-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredMentions.length} of {allMentions.length} mentions
          </p>
        </div>
      )}
    </div>
  );
}