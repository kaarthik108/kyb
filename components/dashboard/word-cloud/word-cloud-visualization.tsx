"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WordCloudItem, SentimentType } from "@/types/dashboard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import * as d3 from "d3";
import { useTheme } from "next-themes";

interface WordCloudVisualizationProps {
  data: WordCloudItem[];
}

interface BubbleDataItem extends WordCloudItem {
  radius: number;
  isCommon: boolean;
  x?: number;
  y?: number;
}

export function WordCloudVisualization({ data }: WordCloudVisualizationProps) {
  const [selectedItem, setSelectedItem] = useState<WordCloudItem | null>(null);
  const [filter, setFilter] = useState<SentimentType | "all">("all");
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Filter data based on selected sentiment
  const filteredData = filter === "all" 
    ? data 
    : data.filter(item => item.sentiment === filter);

  // Prepare data for visualization with additional properties
  const bubbleData: BubbleDataItem[] = filteredData.map(item => ({
    ...item,
    radius: getRadius(item.weight),
    isCommon: item.weight > 60, // Threshold for common vs unique themes
  }));

  // Calculate radius based on weight
  function getRadius(weight: number): number {
    const min = Math.min(...data.map(item => item.weight));
    const max = Math.max(...data.map(item => item.weight));
    const normalized = (weight - min) / (max - min); // 0 to 1
    const minRadius = 40; // Further increased minimum radius
    const maxRadius = 120; // Further increased maximum radius
    return minRadius + normalized * (maxRadius - minRadius);
  }

  // Get CSS variable color
  const getCSSColor = (variable: string): string => {
    // Getting CSS variable color in the format of hsl(var(--chart-1))
    return `hsl(var(${variable}))`;
  }

  // Get colors based on sentiment using theme CSS variables
  const getSentimentColor = (sentiment: SentimentType, isCommon: boolean): string => {
    switch (sentiment) {
      case "positive":
        return isCommon ? getCSSColor("--chart-1") : getCSSColor("--chart-1/85%");
      case "negative":
        return isCommon ? getCSSColor("--chart-2") : getCSSColor("--chart-2/85%");
      case "neutral":
      default:
        return isCommon ? getCSSColor("--chart-4") : getCSSColor("--chart-4/85%");
    }
  };

  // Get stroke colors (slightly darker version)
  const getStrokeColor = (sentiment: SentimentType): string => {
    switch (sentiment) {
      case "positive":
        return getCSSColor("--chart-1/90%");
      case "negative":
        return getCSSColor("--chart-2/90%");
      case "neutral":
      default:
        return getCSSColor("--chart-4/90%");
    }
  };

  // Get badge variant based on sentiment
  const getBadgeVariant = (sentiment: SentimentType) => {
    switch (sentiment) {
      case "positive": return "default";
      case "negative": return "destructive";
      case "neutral": return "secondary";
      case "mixed": return "outline";
      default: return "secondary";
    }
  };

  // Helper function to wrap text
  function wrapText(text: string): string {
    // For very long words, add a space after 6 characters to allow wrapping
    if (text.length > 10 && !text.includes(' ')) {
      const midpoint = Math.floor(text.length / 2);
      return text.slice(0, midpoint) + ' ' + text.slice(midpoint);
    }
    return text;
  }

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || bubbleData.length === 0) return;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Get container dimensions
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", containerWidth)
      .attr("height", containerHeight);

    // Create simulation with improved forces for better positioning
    const simulation = d3.forceSimulation<BubbleDataItem>(bubbleData)
      .force("charge", d3.forceManyBody().strength(10)) // Increased strength for better separation
      .force("center", d3.forceCenter(containerWidth / 2, containerHeight / 2))
      .force("collision", d3.forceCollide<BubbleDataItem>().radius(d => d.radius + 5)) // Increased padding between bubbles
      .force("x", d3.forceX(containerWidth / 2).strength(0.05)) // Gentle force toward center X
      .force("y", d3.forceY(containerHeight / 2).strength(0.05)) // Gentle force toward center Y
      .on("tick", ticked);

    // Create node group
    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll<SVGGElement, BubbleDataItem>("g")
      .data(bubbleData)
      .enter()
      .append("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .on("click", (_event: MouseEvent, d: BubbleDataItem) => {
        setSelectedItem(selectedItem?.text === d.text ? null : d);
      });

    // Determine if dark mode
    const isDarkMode = theme === 'dark';
    
    // Create defs for gradients
    const defs = svg.append("defs");

    // Create gradients for each sentiment type
    ["positive", "negative", "neutral"].forEach(sentiment => {
      const sentimentType = sentiment as SentimentType;
      const baseColor = getSentimentColor(sentimentType, true);
      const lightColor = getSentimentColor(sentimentType, false);
      
      // Radial gradient for each sentiment
      const gradient = defs.append("radialGradient")
        .attr("id", `bubble-${sentiment}`)
        .attr("cx", "0.5")
        .attr("cy", "0.3")
        .attr("r", "0.7")
        .attr("fx", "0.5")
        .attr("fy", "0.3");
        
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", lightColor)
        .attr("stop-opacity", 1);
        
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", baseColor)
        .attr("stop-opacity", 1);
      
      // Create shine overlay
      const shine = defs.append("radialGradient")
        .attr("id", `shine-${sentiment}`)
        .attr("cx", "0.5")
        .attr("cy", "0.3")
        .attr("r", "0.7")
        .attr("fx", "0.5")
        .attr("fy", "0.3");
        
      shine.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "white")
        .attr("stop-opacity", 0.3);
        
      shine.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "white")
        .attr("stop-opacity", 0);
    });

    // Append circles with improved visual styling
    node.append("circle")
      .attr("r", (d: BubbleDataItem) => d.radius)
      .attr("fill", (d: BubbleDataItem) => {
        // Use gradient based on sentiment
        return `url(#bubble-${d.sentiment})`;
      })
      .attr("stroke", (d: BubbleDataItem) => {
        return getStrokeColor(d.sentiment);
      })
      .attr("stroke-width", 2)
      .attr("fill-opacity", 0.95);

    // Apply shine overlay
    node.append("circle")
      .attr("r", (d: BubbleDataItem) => d.radius)
      .attr("fill", (d: BubbleDataItem) => `url(#shine-${d.sentiment})`)
      .style("pointer-events", "none");

    // Append text with improved visibility and text wrapping for long words
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("stroke", "rgba(0,0,0,0.25)") 
      .attr("stroke-width", "0.7px")
      .style("font-weight", (d: BubbleDataItem) => d.isCommon ? "700" : "600")
      .style("pointer-events", "none")
      .style("text-shadow", "0px 0px 3px rgba(0,0,0,0.3)")
      .each(function(d) {
        const text = d3.select(this);
        const words = wrapText(d.text).split(/\s+/);
        
        // Calculate font size based on available space and word length
        const textLength = d.text.length;
        let fontSize = Math.min(d.radius / 2.5, 20);
        
        // Adjust for text length - longer text gets smaller font
        if (textLength > 10) {
          fontSize = fontSize * (10 / textLength) * 1.8;
        } else if (textLength > 6) {
          fontSize = fontSize * 0.9;
        }
        
        // Shorter words can be bigger
        if (textLength <= 4) {
          fontSize = Math.min(fontSize * 1.3, d.radius / 1.8);
        }
        
        // Apply font size
        text.style("font-size", `${Math.max(9, Math.min(fontSize, d.radius / 1.8))}px`);
        
        // Handle single word or multi-word cases
        if (words.length === 1 && words[0].length <= 10) {
          // Single short word - no need to wrap
          text.text(words[0]);
        } else {
          // Clear existing text
          text.text(null);
          
          // Add each word on a new line
          const lineHeight = fontSize * 1.1; // Line height slightly bigger than font size
          const maxLines = Math.floor(d.radius * 1.5 / lineHeight);
          const lines = [];
          
          let currentLine = "";
          words.forEach(word => {
            // If adding this word would make the line too long, start a new line
            if ((currentLine + " " + word).length > 10 && currentLine !== "") {
              lines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = currentLine === "" ? word : currentLine + " " + word;
            }
          });
          if (currentLine !== "") lines.push(currentLine);
          
          // Limit the number of lines to avoid overflowing the bubble
          const limitedLines = lines.slice(0, maxLines);
          
          // Center the text block vertically
          const yOffset = (limitedLines.length - 1) * lineHeight / 2;
          
          limitedLines.forEach((line, i) => {
            text.append("tspan")
              .attr("x", 0)
              .attr("y", i * lineHeight - yOffset)
              .text(line);
          });
        }
      });

    // Second pass - check text sizing and adjust if needed
    setTimeout(() => {
      node.each(function(d) {
        // Get the bounding box of the text
        const textElement = d3.select(this).select("text").node() as SVGTextElement;
        if (textElement) {
          const bbox = textElement.getBBox();
          // Calculate the diagonal length of the bounding box
          const diagonal = Math.sqrt(bbox.width * bbox.width + bbox.height * bbox.height);
          
          // If the text is still too large for the bubble, shrink it
          if (diagonal > d.radius * 1.8) {
            const scale = (d.radius * 1.8) / diagonal;
            const currentSize = parseFloat(d3.select(textElement).style("font-size"));
            const newSize = Math.max(8, Math.floor(currentSize * scale));
            d3.select(textElement).style("font-size", `${newSize}px`);
          }
        }
      });
    }, 100);

    // Run simulation for more iterations to find better positions
    simulation.alpha(1).restart();
    
    // Adjust simulation parameters for smoother animation
    simulation.alphaDecay(0.02); // Slower decay for better positioning

    function ticked() {
      node.attr("transform", (d: BubbleDataItem) => {
        // Improved boundary checking to keep bubbles within container
        d.x = Math.max(d.radius, Math.min(containerWidth - d.radius, d.x || 0));
        d.y = Math.max(d.radius, Math.min(containerHeight - d.radius, d.y || 0));
        return `translate(${d.x},${d.y})`;
      });
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [bubbleData, filter, theme]);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Brand Themes</CardTitle>
            <CardDescription>
              Key topics mentioned across platforms
            </CardDescription>
          </div>
          <Tabs value={filter} onValueChange={(value) => setFilter(value as SentimentType | "all")}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="positive">Positive</TabsTrigger>
              <TabsTrigger value="neutral">Neutral</TabsTrigger>
              <TabsTrigger value="negative">Negative</TabsTrigger>
              <TabsTrigger value="mixed">Mixed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          ref={containerRef} 
          className="bg-card/30 dark:bg-card/20 rounded-lg p-2 h-[700px] relative overflow-hidden"
        >
          <svg ref={svgRef} className="w-full h-full"></svg>
        </div>

        {/* Legend with sentiment colors */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))]"></div>
            <span>Positive sentiment</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-4))]"></div>
            <span>Neutral sentiment</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-2))]"></div>
            <span>Negative sentiment</span>
          </div>
          <div className="flex items-center gap-6 ml-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-opacity-100 border border-gray-300"></div>
              <span>Common themes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-opacity-70 border border-gray-300"></div>
              <span>Unique themes</span>
            </div>
          </div>
        </div>

        {selectedItem && (
          <motion.div 
            className="m-4 p-4 border rounded-md bg-card/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">{selectedItem.text}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={getBadgeVariant(selectedItem.sentiment)}>
                    {selectedItem.sentiment.charAt(0).toUpperCase() + selectedItem.sentiment.slice(1)}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Relevance score: {selectedItem.weight}/100
                  </p>
                </div>
              </div>
              <button 
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </button>
            </div>
            <p className="mt-3 text-sm">
              This theme appears frequently in discussions with a {selectedItem.sentiment} sentiment across multiple platforms.
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}