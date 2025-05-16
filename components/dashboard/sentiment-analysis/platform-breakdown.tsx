"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformSentimentData } from "@/types/dashboard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PlatformBreakdownProps {
  data: PlatformSentimentData;
}

export function PlatformBreakdown({ data }: PlatformBreakdownProps) {
  // Convert the data to the format expected by recharts
  const chartData = Object.entries(data).map(([platform, values]) => ({
    platform,
    positive: values.positive,
    neutral: values.neutral,
    negative: values.negative,
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Platform Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" className="text-xs font-medium" />
              <YAxis dataKey="platform" type="category" width={80} className="text-xs font-medium" />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                formatter={(value) => [`${value}%`, '']}
              />
              <Legend 
                formatter={(value) => {
                  return {
                    positive: 'Positive',
                    neutral: 'Neutral',
                    negative: 'Negative'
                  }[value] || value;
                }}
              />
              <Bar dataKey="positive" stackId="a" fill="hsl(var(--chart-1))" />
              <Bar dataKey="neutral" stackId="a" fill="hsl(var(--chart-3))" />
              <Bar dataKey="negative" stackId="a" fill="hsl(var(--chart-4))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}