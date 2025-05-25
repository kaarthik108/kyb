"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Info, TrendingUp } from "lucide-react";

interface EthicalHighlightsProps {
  data: {
    ethical_highlights: string[];
  };
}

export function EthicalHighlights({ data }: EthicalHighlightsProps) {
  const categorizeHighlight = (highlight: string) => {
    const positive = [
      'sustainability', 'innovation', 'leadership', 'initiatives', 'responsibility', 
      'renewable', 'clean', 'driver responsibility', 'technological innovation',
      'autonomous vehicle technology', 'future mobility', 'clean energy',
      'manufacturing', 'domestic', 'made in america'
    ];
    const negative = [
      'controversy', 'controversies', 'harassment', 'lawsuit', 'criticism', 
      'workplace ethics', 'labor practices', 'business challenges', 
      'customer service', 'product quality', 'quality concerns',
      'challenges', 'concerns', 'financial performance', 'competition'
    ];
    
    const lowerHighlight = highlight.toLowerCase();
    
    const hasPositive = positive.some(word => lowerHighlight.includes(word));
    const hasNegative = negative.some(word => lowerHighlight.includes(word));
    
    if (hasPositive && !hasNegative) {
      return { type: 'positive', icon: CheckCircle, color: 'emerald' };
    } else if (hasNegative && !hasPositive) {
      return { type: 'negative', icon: AlertTriangle, color: 'red' };
    }
    return { type: 'neutral', icon: Info, color: 'blue' };
  };

  const highlightsByCategory = data.ethical_highlights.reduce((acc, highlight) => {
    const category = categorizeHighlight(highlight);
    if (!acc[category.type]) acc[category.type] = [];
    acc[category.type].push({ text: highlight, ...category });
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Ethical & Social Insights
        </h2>
        <p className="text-muted-foreground">Key ethical considerations and social impact themes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(highlightsByCategory).map(([category, highlights]) => {
          const categoryConfig = {
            positive: {
              title: 'Positive Impact',
              borderColor: 'border-emerald-500/30',
              bgColor: 'from-emerald-900/20 to-emerald-800/10',
              badgeColor: 'emerald'
            },
            negative: {
              title: 'Areas of Concern',
              borderColor: 'border-red-500/30',
              bgColor: 'from-red-900/20 to-red-800/10',
              badgeColor: 'red'
            },
            neutral: {
              title: 'General Themes',
              borderColor: 'border-blue-500/30',
              bgColor: 'from-blue-900/20 to-blue-800/10',
              badgeColor: 'blue'
            }
          };

          const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.neutral;

          return (
            <Card key={category} className={`border-white/10 bg-gradient-to-br ${config.bgColor} backdrop-blur-sm hover:border-white/20 transition-all duration-200`}>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {config.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {highlights.map((highlight, index) => {
                  const Icon = highlight.icon;
                  return (
                    <div key={`${category}-${index}`} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                      <div className="flex items-start gap-3">
                        <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                          highlight.color === 'emerald' ? 'text-emerald-400' :
                          highlight.color === 'red' ? 'text-red-400' :
                          'text-blue-400'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-gray-200 leading-relaxed">
                            {highlight.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white">Summary Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-emerald-400">
                {highlightsByCategory.positive?.length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Positive Themes</p>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                  style={{ width: `${((highlightsByCategory.positive?.length || 0) / data.ethical_highlights.length) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-blue-400">
                {highlightsByCategory.neutral?.length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Neutral Themes</p>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
                  style={{ width: `${((highlightsByCategory.neutral?.length || 0) / data.ethical_highlights.length) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-red-400">
                {highlightsByCategory.negative?.length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Areas of Concern</p>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-red-600 to-red-400"
                  style={{ width: `${((highlightsByCategory.negative?.length || 0) / data.ethical_highlights.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}