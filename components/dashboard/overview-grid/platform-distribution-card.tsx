"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformStat } from "@/types/dashboard";
import { BarChart, RefreshCcw } from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";

interface CompetitorDataProps {
  data: PlatformStat[]; // We'll repurpose this for competitor data
}

export function PlatformDistributionCard({ data }: CompetitorDataProps) {
  // Format data for competition comparison
  const competitorData = [
    { 
      metric: "Social Presence", 
      "Our Brand": 78, 
      "Competitor A": 65, 
      "Competitor B": 82, 
      "Competitor C": 51 
    },
    { 
      metric: "Sentiment Score", 
      "Our Brand": 73, 
      "Competitor A": 62, 
      "Competitor B": 58, 
      "Competitor C": 69 
    },
    { 
      metric: "Market Share", 
      "Our Brand": 31, 
      "Competitor A": 25, 
      "Competitor B": 35, 
      "Competitor C": 9 
    },
    { 
      metric: "Brand Recognition", 
      "Our Brand": 85, 
      "Competitor A": 71, 
      "Competitor B": 79, 
      "Competitor C": 42 
    },
  ];

  // Colors for the chart
  const colors = {
    "Our Brand": "#4f46e5",
    "Competitor A": "#64748b",
    "Competitor B": "#0ea5e9",
    "Competitor C": "#a3a3a3"
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <BarChart className="h-4 w-4" />
          Competition Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[210px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={competitorData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              barSize={10}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="metric" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
                height={35}
                tickMargin={5}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
                domain={[0, 100]}
                tickCount={6}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  fontSize: '12px',
                  padding: '8px'
                }}
                formatter={(value) => [`${value}%`, '']}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '10px' }} 
                iconSize={8}
                iconType="circle"
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
              <Bar 
                dataKey="Our Brand" 
                fill={colors["Our Brand"]} 
                radius={[10, 10, 10, 10]} 
                name="Our Brand"
              />
              <Bar 
                dataKey="Competitor A" 
                fill={colors["Competitor A"]} 
                radius={[10, 10, 10, 10]}
                name="Competitor A"
              />
              <Bar 
                dataKey="Competitor B" 
                fill={colors["Competitor B"]} 
                radius={[10, 10, 10, 10]}
                name="Competitor B"
              />
              <Bar 
                dataKey="Competitor C" 
                fill={colors["Competitor C"]} 
                radius={[10, 10, 10, 10]}
                name="Competitor C"
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <RefreshCcw className="h-3 w-3" />
            <span>Updated 2 hours ago</span>
          </div>
          <span>Q3 2023 data</span>
        </div>
      </CardContent>
    </Card>
  );
}