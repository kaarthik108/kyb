"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EngagementTrend } from "@/types/dashboard";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

interface EngagementTrendsProps {
  data: EngagementTrend[];
}

export function EngagementTrends({ data }: EngagementTrendsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs font-medium" />
              <YAxis className="text-xs font-medium" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                formatter={(value) => [`${value}%`, 'Engagement Rate']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="twitter" 
                name="Twitter" 
                stroke="hsl(var(--chart-1))" 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="linkedin" 
                name="LinkedIn" 
                stroke="hsl(var(--chart-2))" 
              />
              <Line 
                type="monotone" 
                dataKey="reddit" 
                name="Reddit" 
                stroke="hsl(var(--chart-4))" 
              />
              <Line 
                type="monotone" 
                dataKey="news" 
                name="News" 
                stroke="hsl(var(--chart-5))" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}