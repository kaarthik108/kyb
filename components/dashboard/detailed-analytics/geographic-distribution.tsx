"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GeographicDistribution as GeoDistributionType } from "@/types/dashboard";
import { Progress } from "@/components/ui/progress";

interface GeographicDistributionProps {
  data: GeoDistributionType[];
}

export function GeographicDistribution({ data }: GeographicDistributionProps) {
  // Sort data by percentage (descending)
  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographic Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedData.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{item.region}</span>
                <span className="text-sm font-medium">{item.percentage}%</span>
              </div>
              <Progress 
                value={item.percentage} 
                className="h-2" 
                indicatorClassName={`${index === 0 ? 'bg-chart-1' : index === 1 ? 'bg-chart-2' : index === 2 ? 'bg-chart-3' : 'bg-chart-4'}`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}