"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Header } from "@/components/dashboard/header";
import { SentimentAnalysis } from "@/components/dashboard/sentiment-analysis";
import { WordCloudSection } from "@/components/dashboard/word-cloud";
import { EthicalHighlights } from "@/components/dashboard/ethical-highlights";
import { PlatformMentions } from "@/components/dashboard/platform-mentions";
import { dashboardData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Building2, Briefcase } from "lucide-react";

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [formData, setFormData] = useState({
    brand: dashboardData.brand_name || "Tesla",
    location: "Global",
    category: "Automotive & Technology"
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call with a small delay
    setTimeout(() => {
      setShowDashboard(true);
      setLoading(false);
    }, 800);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          <p className="text-muted-foreground">Loading brand analytics...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Show form if dashboard is not visible yet
  if (!showDashboard) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md shadow-lg border-primary/20">
            <CardHeader className="pb-4 space-y-1">
              <CardTitle className="text-2xl">Brand Analytics</CardTitle>
              <CardDescription>Enter brand information to analyze social presence</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-base">Brand Name</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input 
                      id="brand" 
                      name="brand" 
                      placeholder="Enter brand name" 
                      className="pl-10"
                      value={formData.brand}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-base">Location</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input 
                      id="location" 
                      name="location" 
                      placeholder="Global, US, Europe, etc." 
                      className="pl-10"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-base">Category</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input 
                      id="category" 
                      name="category" 
                      placeholder="Industry or business category" 
                      className="pl-10"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium py-2.5">
                  Analyze Brand Presence
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Header brandInfo={formData} />
      <SentimentAnalysis />
      <WordCloudSection />
      <EthicalHighlights />
      <PlatformMentions />
    </DashboardLayout>
  );
}