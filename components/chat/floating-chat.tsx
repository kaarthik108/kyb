"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ApiResponse } from "@/lib/data";

interface FloatingChatProps {
  data?: ApiResponse;
}

export function FloatingChat({ data }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
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
    },
    onError: (error) => {
      console.error('Chat error:', error);
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
      {/* Messages Stack - Appears above the input */}
      {messages.length > 0 && (
        <div className="flex flex-col space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
          {messages.slice(-5).map((message) => ( // Show only last 5 messages
            <div
              key={message.id}
              className={cn(
                "max-w-sm animate-slide-up",
                message.role === 'user' ? "self-end" : "self-start"
              )}
            >
              <div className={cn(
                "relative p-3 rounded-2xl shadow-lg backdrop-blur-lg border",
                message.role === 'user'
                  ? "bg-gradient-to-r from-blue-600/90 to-purple-600/90 border-blue-500/30 text-white"
                  : "bg-gray-900/90 border-gray-700/50 text-gray-200"
              )}>
                {/* Message indicator */}
                <div className={cn(
                  "absolute -top-1 p-1 rounded-full",
                  message.role === 'user' ? "-right-1 bg-blue-500" : "-left-1 bg-purple-500"
                )}>
                  {message.role === 'user' ? (
                    <User className="h-2 w-2 text-white" />
                  ) : (
                    <Bot className="h-2 w-2 text-white" />
                  )}
                </div>
                
                {/* Message content */}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                
                {/* Sparkle effect for AI messages */}
                {message.role === 'assistant' && (
                  <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-purple-400 animate-pulse" />
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="max-w-sm animate-slide-up self-start">
          <div className="bg-red-900/90 border border-red-500/50 rounded-2xl p-3 text-red-200">
            <div className="absolute -top-1 -left-1 p-1 rounded-full bg-red-500">
              <Bot className="h-2 w-2 text-white" />
            </div>
            <p className="text-sm">{error.message}</p>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="max-w-sm animate-slide-up self-start">
          <div className="bg-gray-900/90 border border-gray-700/50 rounded-2xl p-3 text-gray-200">
            <div className="absolute -top-1 -left-1 p-1 rounded-full bg-purple-500">
              <Bot className="h-2 w-2 text-white" />
            </div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Input Interface */}
      <div className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl shadow-2xl p-4 w-80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Analytics Assistant</h3>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "Thinking..." : data ? `Analyzing ${data.analysis_results_twitter?.brand_name || 'Brand'}` : "Ready to help"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-white"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

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
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          Ask me anything about the brand analysis
        </p>
      </div>
    </div>
  );
} 