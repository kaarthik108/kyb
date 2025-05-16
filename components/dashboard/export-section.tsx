"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Download, Share2, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function ExportSection() {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = () => {
    setIsDownloading(true);
    
    // Simulate download
    setTimeout(() => {
      setIsDownloading(false);
      toast({
        title: "Report Downloaded",
        description: "Your report has been downloaded successfully.",
      });
    }, 1500);
  };
  
  const handleShare = () => {
    toast({
      title: "Share Link Generated",
      description: "A shareable link has been copied to your clipboard.",
    });
  };
  
  const handleSchedule = () => {
    toast({
      title: "Schedule Report",
      description: "Please set up report scheduling in the settings panel.",
    });
  };

  return (
    <div className="mb-8">
      <Card className="bg-gradient-to-r from-card/50 to-card border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium mb-1">Export & Share Dashboard</h3>
              <p className="text-muted-foreground text-sm">
                Download reports, share with stakeholders, or schedule automated reports
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={handleDownload} 
                disabled={isDownloading}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {isDownloading ? "Downloading..." : "Download Report"}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleShare}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share Dashboard
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleSchedule}
                className="gap-2"
              >
                <Clock className="h-4 w-4" />
                Schedule Reports
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}