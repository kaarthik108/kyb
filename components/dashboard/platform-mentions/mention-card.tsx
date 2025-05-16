"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PlatformMention } from "@/types/dashboard";
import { ThumbsUp, ThumbsDown, Heart, Share2, MessageSquare, Calendar, Twitter, Linkedin, MessagesSquare, Newspaper, ExternalLink } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface MentionCardProps {
  mention: PlatformMention;
}

export function MentionCard({ mention }: MentionCardProps) {
  const { platform, author, content, date, sentiment, engagement, url } = mention;

  // Get platform-specific icon
  const getPlatformIcon = () => {
    switch (platform) {
      case "Twitter":
        return <Twitter className="h-4 w-4" />;
      case "LinkedIn":
        return <Linkedin className="h-4 w-4" />;
      case "Reddit":
        return <MessagesSquare className="h-4 w-4" />;
      case "News":
        return <Newspaper className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  // Get sentiment icon
  const getSentimentIcon = () => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case "negative":
        return <ThumbsDown className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Get border color based on sentiment
  const getBorderColor = () => {
    switch (sentiment) {
      case "positive":
        return "border-l-green-500";
      case "negative":
        return "border-l-red-500";
      case "neutral":
        return "border-l-gray-500";
      default:
        return "border-l-blue-500";
    }
  };

  return (
    <Card className={cn(
      "transition-shadow hover:shadow-md relative overflow-hidden border-l-4",
      getBorderColor()
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div>
            <Badge variant="outline" className="flex items-center gap-1.5">
              {getPlatformIcon()}
              {platform}
            </Badge>
          </div>
          <div>
            {getSentimentIcon()}
          </div>
        </div>
        
        <div className="mt-3">
          <div className="font-medium">{author}</div>
          <p className="mt-2 text-sm">{content}</p>
        </div>
        
        <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {format(parseISO(date), 'MMM d, yyyy h:mm a')}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {engagement.likes}
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="h-3 w-3" />
              {engagement.shares}
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {engagement.comments}
            </div>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <span>View</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}