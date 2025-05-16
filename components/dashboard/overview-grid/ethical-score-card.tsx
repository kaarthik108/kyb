"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EthicalScore } from "@/types/dashboard";
import { Leaf } from "lucide-react";

interface EthicalScoreCardProps {
  data: EthicalScore;
}

export function EthicalScoreCard({ data }: EthicalScoreCardProps) {
  const { overall, factors } = data;
  
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  // Calculate gauge angle based on score
  const gaugeAngle = (overall / 100) * 180;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Leaf className="h-4 w-4" />
          Ethical Score
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-12 overflow-hidden">
            {/* Gauge background */}
            <div className="absolute top-0 left-0 w-full h-full bg-muted rounded-t-full"></div>
            
            {/* Gauge fill */}
            <div 
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-t-full origin-bottom"
              style={{ transform: `rotate(${gaugeAngle - 180}deg)` }}
            ></div>
            
            {/* Gauge center point */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-background rounded-full border-2 border-primary"></div>
          </div>
          
          <div className={`text-2xl font-bold mt-2 ${getScoreColor(overall)}`}>
            {overall}/100
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          {factors.map((factor, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">{factor.name}</span>
              <span className={`font-medium ${getScoreColor(factor.score)}`}>
                {factor.score}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}