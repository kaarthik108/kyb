"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { EthicalHighlight } from "@/types/dashboard";
import { ChevronDown, ChevronUp, Calendar, ExternalLink } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface HighlightCardProps {
  highlight: EthicalHighlight;
}

export function HighlightCard({ highlight }: HighlightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get icon based on context
  const getContextIcon = (context: string) => {
    switch (context.toLowerCase()) {
      case "environmental":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M21 11C21 16.55 17.16 21.74 12 23C6.84 21.74 3 16.55 3 11V5L12 2L21 5V11Z" />
            <path d="M12 21C14.0683 18.9337 15.25 16.0667 15.25 13C15.25 9.93333 14.0683 7.06667 12 5C9.93167 7.06667 8.75 9.93333 8.75 13C8.75 16.0667 9.93167 18.9337 12 21Z" />
          </svg>
        );
      case "social":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M16 17L21 12L16 7" />
            <path d="M8 7L3 12L8 17" />
            <path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" />
            <path d="M6 22C7.65685 22 9 20.6569 9 19C9 17.3431 7.65685 16 6 16C4.34315 16 3 17.3431 3 19C3 20.6569 4.34315 22 6 22Z" />
            <path d="M12 16C13.6569 16 15 14.6569 15 13C15 11.3431 13.6569 10 12 10C10.3431 10 9 11.3431 9 13C9 14.6569 10.3431 16 12 16Z" />
            <path d="M6 8C7.65685 8 9 6.65685 9 5C9 3.34315 7.65685 2 6 2C4.34315 2 3 3.34315 3 5C3 6.65685 4.34315 8 6 8Z" />
            <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" />
          </svg>
        );
      case "governance":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
            <path d="M12 2C15 7 15 17 12 22" />
            <path d="M12 2C9 7 9 17 12 22" />
            <path d="M2 12L22 12" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" />
            <path d="M3 7V5C3 3.89543 3.89543 3 5 3H7" />
            <path d="M3 17V19C3 20.1046 3.89543 21 5 21H7" />
            <path d="M17 3H19C20.1046 3 21 3.89543 21 5V7" />
            <path d="M17 21H19C20.1046 21 21 20.1046 21 19V17" />
          </svg>
        );
    }
  };

  // Get background color based on sentiment
  const getCardGradient = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "from-green-950/20 to-green-900/5";
      case "negative": return "from-red-950/20 to-red-900/5";
      default: return "from-blue-950/20 to-blue-900/5";
    }
  };

  const cardVariants = {
    expanded: { height: "auto" },
    collapsed: { height: "auto" }
  };

  const contentVariants = {
    expanded: { opacity: 1, height: "auto" },
    collapsed: { opacity: 0, height: 0 }
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-300 cursor-pointer overflow-hidden group",
        `bg-gradient-to-b ${getCardGradient(highlight.sentiment)}`
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <motion.div
        variants={cardVariants}
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        transition={{ duration: 0.3 }}
      >
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <Badge variant={highlight.sentiment === "positive" ? "success" : highlight.sentiment === "negative" ? "destructive" : "outline"} className="mb-2">
              <span className="flex items-center gap-1.5">
                {getContextIcon(highlight.context)}
                {highlight.context}
              </span>
            </Badge>
            <button className="text-muted-foreground hover:text-foreground">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
          
          <h3 className="font-semibold mt-2">{highlight.title}</h3>
          
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            <Calendar className="h-3 w-3 mr-1" />
            {format(parseISO(highlight.date), 'MMMM d, yyyy')}
          </div>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                transition={{ duration: 0.3 }}
                className="pt-4"
              >
                <p className="text-sm mb-3">{highlight.description}</p>
                
                <div className="flex justify-between items-center mt-3 text-xs">
                  <span className="text-muted-foreground">Source: {highlight.source}</span>
                  <button className="flex items-center gap-1 text-primary hover:underline">
                    <span>View details</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </motion.div>
    </Card>
  );
}