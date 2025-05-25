"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2,
  Maximize2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ApiResponse } from "@/lib/data";

interface FloatingChatProps {
  data?: ApiResponse;
}

export function FloatingChat({ data }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Create context message based on data
  const getContextMessage = () => {
    if (!data) {
      return 'Hi! I\'m your brand analytics assistant. I can help you interpret sentiment data, understand platform trends, and provide insights about your brand\'s digital presence. What would you like to know?';
    }

    const brandName = data.analysis_results_twitter?.brand_name || 'the brand';
    const totalMentions = Object.values(data).reduce((sum, platform) => {
      if (typeof platform === 'object' && platform && 'total_mentions_on_platform' in platform) {
        return sum + (platform.total_mentions_on_platform || 0);
      }
      return sum;
    }, 0);

    return `Hi! I'm analyzing ${brandName} for you. I found ${totalMentions} total mentions across Twitter, LinkedIn, Reddit, and News platforms. I can help you understand:

• Sentiment patterns across different platforms
• Key ethical highlights and concerns
• Word cloud themes and trending topics
• Platform-specific performance insights
• Actionable recommendations for brand improvement

What specific aspect would you like to explore?`;
  };

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: getContextMessage()
      }
    ],
    body: {
      context: data ? {
        brandName: data.analysis_results_twitter?.brand_name,
        query: data.query,
        totalMentions: Object.values(data).reduce((sum, platform) => {
          if (typeof platform === 'object' && platform && 'total_mentions_on_platform' in platform) {
            return sum + (platform.total_mentions_on_platform || 0);
          }
          return sum;
        }, 0),
        platforms: {
          twitter: data.analysis_results_twitter,
          linkedin: data.analysis_results_linkedin,
          reddit: data.analysis_results_reddit,
          news: data.analysis_results_news
        }
      } : null
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 z-50 animate-float"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={cn(
        "border-white/10 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-lg shadow-2xl transition-all duration-300",
        isMinimized ? "w-80 h-16" : "w-96 h-[500px]"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Analytics Assistant</h3>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "Thinking..." : data ? `Analyzing ${data.analysis_results_twitter?.brand_name || 'Brand'}` : "Online"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-white"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar max-h-[350px]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 text-sm",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="p-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex-shrink-0 mt-0.5">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2 break-words",
                      message.role === 'user'
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-auto"
                        : "bg-gray-800/50 text-gray-200 border border-gray-700/50"
                    )}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {message.role === 'user' && (
                    <div className="p-1.5 rounded-full bg-gray-700 flex-shrink-0 mt-0.5">
                      <User className="h-3 w-3 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 text-sm">
                  <div className="p-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex-shrink-0 mt-0.5">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                  <div className="bg-gray-800/50 text-gray-200 border border-gray-700/50 rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about brand analytics..."
                  className="flex-1 bg-gray-800/50 border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 text-white placeholder:text-gray-400 text-sm"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        )}
      </Card>
    </div>
  );
} 