"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trend } from "@/types/dashboard";
import { ArrowDown, ArrowUp, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface MentionsCardProps {
  data: Trend;
}

export function MentionsCard({ data }: MentionsCardProps) {
  const { count, trend, period } = data;
  const isPositive = trend > 0;

  // Format the count to have commas
  const formattedCount = count.toLocaleString();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Total Mentions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-1">
          <div className="text-2xl font-bold">{formattedCount}</div>
          <div className="flex items-center mt-1">
            <span
              className={`text-xs font-medium flex items-center ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPositive ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(trend)}%
            </span>
            <span className="text-xs text-muted-foreground ml-1.5">
              {period}
            </span>
          </div>
        </div>

        <div className="mt-4 relative h-10">
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </CardContent>
    </Card>
  );
}