"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dashboardData } from "@/lib/data";
import { Platform } from "@/types/dashboard";
import { Twitter, Linkedin, MessageSquare, Newspaper, ExternalLink, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { format } from "date-fns";

export function PlatformMentions() {
  const [activePlatform, setActivePlatform] = useState<Platform | "All">("All");
  const { platforms } = dashboardData;

  // Get all platforms from the API data
  const platformsList = platforms.map(platform => platform.name as Platform);

  // Get all mentions across all platforms
  const allMentions = platforms.flatMap(platform => 
    platform.mentions.map(mention => ({
      id: `${platform.name}-${mention.date}`,
      platform: mention.platform as Platform,
      author: platform.name, // Use platform name as author
      content: mention.text,
      date: mention.date,
      sentiment: mention.sentiment,
      ethical_context: mention.ethical_context,
      url: mention.url
    }))
  );

  const filteredMentions = activePlatform === "All" 
    ? allMentions 
    : allMentions.filter(mention => mention.platform === activePlatform);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case "Twitter":
        return <Twitter className="h-5 w-5 text-blue-500" />;
      case "LinkedIn":
        return <Linkedin className="h-5 w-5 text-blue-700" />;
      case "Reddit":
        return <MessageSquare className="h-5 w-5 text-orange-600" />;
      case "News":
        return <Newspaper className="h-5 w-5 text-gray-600" />;
      default:
        return <MessageSquare className="h-5 w-5" />;
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-emerald-500" />;
      case "negative":
        return <ThumbsDown className="h-4 w-4 text-red-500" />;
      case "neutral":
      default:
        return <Minus className="h-4 w-4 text-blue-500" />;
    }
  };

  const getBorderColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "border-l-emerald-500";
      case "negative":
        return "border-l-red-500";
      case "neutral":
      default:
        return "border-l-blue-500";
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Platform Mentions</h2>
      <Card className="bg-card overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Recent Mentions</CardTitle>
            <Tabs 
              defaultValue="All" 
              value={activePlatform} 
              onValueChange={(value) => setActivePlatform(value as Platform | "All")}
            >
              <TabsList className="bg-background/80 backdrop-blur-sm">
                <TabsTrigger value="All" className="text-sm">All</TabsTrigger>
                {platformsList.map(platform => (
                  <TabsTrigger 
                    key={platform} 
                    value={platform} 
                    className="text-sm flex gap-1.5 items-center"
                  >
                    {getPlatformIcon(platform)}
                    <span>{platform}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredMentions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No mentions found for this platform
              </div>
            ) : (
              filteredMentions.map((mention) => (
                <Card 
                  key={mention.id} 
                  className={`overflow-hidden border-l-4 ${getBorderColor(mention.sentiment)} hover:shadow-md transition-shadow`}
                >
                  <CardContent className="p-5">
                    <div className="flex justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(mention.platform)}
                        <span className="font-medium">{mention.platform}</span>
                        <span className="bg-secondary/50 text-xs rounded-full px-2 py-0.5 inline-flex items-center gap-1">
                          {getSentimentIcon(mention.sentiment)}
                          <span className="capitalize">{mention.sentiment}</span>
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(mention.date)}
                      </div>
                    </div>
                    <p className="text-sm mb-3 leading-relaxed">{mention.content}</p>
                    <div className="flex justify-between items-center text-xs">
                      <div className="text-muted-foreground bg-secondary/30 px-2 py-1 rounded">
                        {mention.ethical_context}
                      </div>
                      <a 
                        href={mention.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:underline flex items-center gap-1 hover:text-primary/80"
                      >
                        View source
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}