"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiResponse } from "@/lib/data";
import { Twitter, Linkedin, MessageSquare, Newspaper, Zap, Activity } from "lucide-react";
import { useState, useEffect } from "react";

interface SentimentPulseRadarProps {
  data: {
    platform_sentiment: {
      [key: string]: {
        positive: number;
        negative: number;
        neutral: number;
        count: number;
      };
    };
  };
}

interface RadarPoint {
  platform: string;
  angle: number;
  intensity: number;
  sentiment: "positive" | "negative" | "neutral";
  color: string;
  icon: React.ReactNode;
  mentions: number;
}

export function SentimentPulseRadar({ data }: SentimentPulseRadarProps) {
  const [pulsePhase, setPulsePhase] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  // Animate pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Twitter": return <Twitter className="h-4 w-4" />;
      case "LinkedIn": return <Linkedin className="h-4 w-4" />;
      case "Reddit": return <MessageSquare className="h-4 w-4" />;
      case "News": return <Newspaper className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  // Create radar points from real data
  const createRadarPoints = (): RadarPoint[] => {
    const platforms = Object.entries(data.platform_sentiment);
    const angleStep = (2 * Math.PI) / platforms.length;
    
    return platforms.map(([platform, sentiment], index) => {
      const positivePercent = sentiment.positive;
      const negativePercent = sentiment.negative;
      const neutralPercent = sentiment.neutral;
      
      let dominantSentiment: "positive" | "negative" | "neutral" = "neutral";
      let intensity = 20;
      
      if (positivePercent > negativePercent && positivePercent > neutralPercent) {
        dominantSentiment = "positive";
        intensity = Math.max(20, Math.min(90, positivePercent));
      } else if (negativePercent > positivePercent && negativePercent > neutralPercent) {
        dominantSentiment = "negative";
        intensity = Math.max(20, Math.min(90, negativePercent));
      } else {
        dominantSentiment = "neutral";
        intensity = Math.max(20, Math.min(90, neutralPercent));
      }

      const colors = {
        positive: "#10b981",
        negative: "#ef4444", 
        neutral: "#f59e0b"
      };

      return {
        platform,
        angle: index * angleStep,
        intensity,
        sentiment: dominantSentiment,
        color: colors[dominantSentiment],
        icon: getPlatformIcon(platform),
        mentions: sentiment.count
      };
    });
  };

  const radarPoints = createRadarPoints();
  const centerX = 200;
  const centerY = 200;
  const maxRadius = 150;

  // Generate radar grid circles
  const radarRings = [30, 60, 90, 120, 150];
  
  // Generate radar spokes
  const radarSpokes = radarPoints.map(point => point.angle);

  return (
    <Card className="border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-white font-display">Sentiment Pulse Radar</CardTitle>
          <Badge variant="outline" className="border-purple-500/30 text-purple-400 text-xs">
            <Zap className="h-3 w-3 mr-1" />
            Live Pulse
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">Real-time sentiment intensity across platforms</p>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Radar SVG */}
          <svg width="400" height="400" className="mx-auto">
            {/* Background gradient */}
            <defs>
              <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(139, 92, 246, 0.1)" />
                <stop offset="100%" stopColor="rgba(139, 92, 246, 0.02)" />
              </radialGradient>
              
              {/* Pulse gradients for each sentiment */}
              <radialGradient id="positivePulse" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(16, 185, 129, 0.8)" />
                <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
              </radialGradient>
              <radialGradient id="negativePulse" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(239, 68, 68, 0.8)" />
                <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
              </radialGradient>
              <radialGradient id="neutralPulse" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(245, 158, 11, 0.8)" />
                <stop offset="100%" stopColor="rgba(245, 158, 11, 0)" />
              </radialGradient>
            </defs>

            {/* Radar background */}
            <circle cx={centerX} cy={centerY} r={maxRadius} fill="url(#radarGradient)" />

            {/* Radar grid rings */}
            {radarRings.map((radius, index) => (
              <circle
                key={radius}
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke="rgba(139, 92, 246, 0.2)"
                strokeWidth="1"
                strokeDasharray={index % 2 === 0 ? "5,5" : "none"}
              />
            ))}

            {/* Radar spokes */}
            {radarSpokes.map((angle, index) => {
              const x2 = centerX + Math.cos(angle - Math.PI / 2) * maxRadius;
              const y2 = centerY + Math.sin(angle - Math.PI / 2) * maxRadius;
              return (
                <line
                  key={index}
                  x1={centerX}
                  y1={centerY}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(139, 92, 246, 0.3)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Animated pulse rings */}
            {radarPoints.map((point, index) => {
              const pulseRadius = (point.intensity / 100) * maxRadius;
              const animatedRadius = pulseRadius + (Math.sin((pulsePhase + index * 25) * 0.1) * 10);
              const x = centerX + Math.cos(point.angle - Math.PI / 2) * animatedRadius;
              const y = centerY + Math.sin(point.angle - Math.PI / 2) * animatedRadius;
              
              return (
                <g key={`pulse-${index}`}>
                  {/* Pulse ring */}
                  <circle
                    cx={x}
                    cy={y}
                    r={15 + Math.sin((pulsePhase + index * 30) * 0.15) * 5}
                    fill={`url(#${point.sentiment}Pulse)`}
                    opacity={0.6 + Math.sin((pulsePhase + index * 20) * 0.1) * 0.3}
                  />
                  
                  {/* Platform dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill={point.color}
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-10 transition-all duration-200"
                    onClick={() => setSelectedPlatform(selectedPlatform === point.platform ? null : point.platform)}
                  />
                  
                  {/* Platform label */}
                  <text
                    x={x}
                    y={y - 25}
                    textAnchor="middle"
                    className="text-xs font-semibold fill-white"
                  >
                    {point.platform}
                  </text>
                  
                  {/* Intensity value */}
                  <text
                    x={x}
                    y={y + 35}
                    textAnchor="middle"
                    className="text-xs fill-gray-400"
                  >
                    {Math.round(point.intensity)}%
                  </text>
                </g>
              );
            })}

            {/* Center pulse */}
            <circle
              cx={centerX}
              cy={centerY}
              r={8 + Math.sin(pulsePhase * 0.2) * 3}
              fill="rgba(139, 92, 246, 0.8)"
              opacity={0.8 + Math.sin(pulsePhase * 0.15) * 0.2}
            />
          </svg>

          {/* Selected platform info */}
          {selectedPlatform && (
            <div className="absolute top-4 right-4 bg-gray-800/90 backdrop-blur-sm border border-white/20 rounded-lg p-4 max-w-xs">
              {(() => {
                const platformData = radarPoints.find(p => p.platform === selectedPlatform);
                const sentimentData = data.platform_sentiment[selectedPlatform];
                if (!platformData || !sentimentData) return null;
                
                const total = sentimentData.positive + sentimentData.negative + sentimentData.neutral;
                
                return (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {platformData.icon}
                      <span className="font-semibold text-white">{selectedPlatform}</span>
                      <Badge variant="outline" className="text-xs" style={{ color: platformData.color }}>
                        {platformData.sentiment}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Intensity:</span>
                        <span className="text-white font-medium">{Math.round(platformData.intensity)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Mentions:</span>
                        <span className="text-white font-medium">{platformData.mentions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-400">Positive:</span>
                        <span className="text-white">{Math.round((sentimentData.positive / total) * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-400">Neutral:</span>
                        <span className="text-white">{Math.round((sentimentData.neutral / total) * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-400">Negative:</span>
                        <span className="text-white">{Math.round((sentimentData.negative / total) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-white">Positive</span>
            </div>
            <p className="text-xs text-muted-foreground">High engagement</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-white">Neutral</span>
            </div>
            <p className="text-xs text-muted-foreground">Balanced sentiment</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-white">Negative</span>
            </div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </div>
        </div>

        {/* Pulse indicator */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            <span className="inline-block w-2 h-2 bg-purple-500 rounded-full animate-pulse mr-2"></span>
            Live sentiment pulse • Click platforms for details
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 