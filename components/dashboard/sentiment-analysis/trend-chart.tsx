"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyTrend } from "@/types/dashboard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';

interface TrendChartProps {
  data: DailyTrend[];
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Trend</CardTitle>
        <CardDescription>
          Sentiment distribution over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorNeutral" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(parseISO(date), 'MMM dd')}
                className="text-xs font-medium"
              />
              <YAxis className="text-xs font-medium" />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                labelFormatter={(date) => format(parseISO(date as string), 'MMMM d, yyyy')}
                formatter={(value, name) => {
                  const formattedName = {
                    positive: 'Positive',
                    neutral: 'Neutral',
                    negative: 'Negative'
                  }[name as string] || name;
                  
                  return [value, formattedName];
                }}
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
              <Area 
                type="monotone" 
                dataKey="positive" 
                stroke="hsl(var(--chart-1))" 
                fillOpacity={1} 
                fill="url(#colorPositive)" 
              />
              <Area 
                type="monotone" 
                dataKey="neutral" 
                stroke="hsl(var(--chart-3))" 
                fillOpacity={1} 
                fill="url(#colorNeutral)" 
              />
              <Area 
                type="monotone" 
                dataKey="negative" 
                stroke="hsl(var(--chart-4))" 
                fillOpacity={1} 
                fill="url(#colorNegative)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}